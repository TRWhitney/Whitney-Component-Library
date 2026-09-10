import {act} from 'react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {RadarChart} from '../src/index.js';
import type {RadarChartDimensions} from '../src/index.js';

afterEach(cleanup);

interface VehicleSeries {
  readonly cargo?: number;
  readonly comfort?: number;
  readonly handling?: number;
  readonly id: string;
  readonly label: string;
  readonly range?: number;
  readonly reliability?: number;
  readonly speed?: number;
}

const dimensions: RadarChartDimensions<VehicleSeries> = [
  {accessor: 'speed', id: 'speed', label: 'Speed'},
  {accessor: 'range', id: 'range', label: 'Range'},
  {accessor: 'reliability', id: 'reliability', label: 'Reliability'},
];

const common = {
  dataTableLabel: 'Vehicle comparison data',
  description: 'Comparable vehicle scores across three qualities.',
  dimensions,
  emptyState: {description: 'Choose vehicles with recorded scores.', title: 'No vehicle scores'},
  idAccessor: 'id',
  invalidData: {description: 'Correct negative or non-finite scores.', title: 'Invalid scores'},
  labelAccessor: 'label',
  labels: {dimension: 'Quality'},
  legend: {label: 'Vehicles'},
  title: 'Vehicle profile',
  value: {label: 'Score', unit: 'points'},
} as const;

describe('RadarChart', () => {
  it('renders ordered dimensions, one polygon, and a dimension-by-series table', () => {
    const {container} = render(
      <RadarChart
        {...common}
        data={[{id: 'courier', label: 'Courier', range: 4, reliability: 3, speed: 5}]}
      />,
    );

    expect(container.querySelectorAll('[data-wcl-radar-spoke]')).toHaveLength(3);
    expect(container.querySelectorAll('[data-wcl-radar-series]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-wcl-radar-point]')).toHaveLength(3);
    const table = within(screen.getByRole('table', {name: common.dataTableLabel}));
    expect(table.getAllByRole('row')).toHaveLength(4);
    expect(table.getByRole('columnheader', {name: 'Quality, Score'})).toBeTruthy();
    expect(table.getByRole('columnheader', {name: 'Courier'})).toBeTruthy();
    expect(table.getByRole('rowheader', {name: 'Speed'})).toBeTruthy();
    expect(table.getByRole('cell', {name: '5 points'})).toBeTruthy();
  });

  it('uses visual-only shoulders around isolated values and keeps missing values exact', () => {
    const {container} = render(
      <RadarChart {...common} data={[{id: 'courier', label: 'Courier', speed: 5}]} />,
    );

    const areaPoints = container
      .querySelector('[data-wcl-radar-area]')!
      .getAttribute('points')!
      .split(' ')
      .map((point) => point.split(',').map(Number));
    expect(areaPoints[0]).toEqual([240, 90]);
    expect(areaPoints[1]![0]).toBeCloseTo(272.4759, 3);
    expect(areaPoints[1]![1]).toBeCloseTo(258.75, 3);
    expect(areaPoints[2]![0]).toBeCloseTo(207.5241, 3);
    expect(areaPoints[2]![1]).toBeCloseTo(258.75, 3);
    expect(container.querySelectorAll('[data-wcl-radar-point]')).toHaveLength(1);
    const table = within(screen.getByRole('table', {name: common.dataTableLabel}));
    expect(within(table.getByRole('row', {name: /Range/})).getByRole('cell').textContent).toBe(
      '0 points',
    );
    expect(
      within(table.getByRole('row', {name: /Reliability/})).getByRole('cell').textContent,
    ).toBe('0 points');
  });

  it('applies the complete sparse-shoulder rule without changing source points', () => {
    const sixDimensions: RadarChartDimensions<VehicleSeries> = [
      {accessor: 'speed', id: 'speed', label: 'Speed'},
      {accessor: 'range', id: 'range', label: 'Range'},
      {accessor: 'reliability', id: 'reliability', label: 'Reliability'},
      {accessor: 'comfort', id: 'comfort', label: 'Comfort'},
      {accessor: 'handling', id: 'handling', label: 'Handling'},
      {accessor: 'cargo', id: 'cargo', label: 'Cargo'},
    ];
    const areaRatios = (container: HTMLElement) =>
      container
        .querySelector('[data-wcl-radar-area]')!
        .getAttribute('points')!
        .split(' ')
        .map((point) => point.split(',').map(Number))
        .map(([x, y]) => Math.hypot(x! - 240, y! - 240) / 150);
    const {container, rerender} = render(
      <RadarChart
        {...common}
        data={[{comfort: 5, id: 'mixed', label: 'Mixed', speed: 0.5}]}
        dimensions={sixDimensions}
      />,
    );

    areaRatios(container).forEach((ratio, index) => {
      expect(ratio).toBeCloseTo([0.1, 0.08, 0.25, 1, 0.25, 0.08][index]!, 8);
    });
    expect(container.querySelectorAll('[data-wcl-radar-point]')).toHaveLength(2);

    rerender(
      <RadarChart
        {...common}
        data={[{comfort: 5, id: 'capped', label: 'Capped', speed: 0.25}]}
        dimensions={sixDimensions}
      />,
    );
    areaRatios(container)
      .slice(0, 2)
      .forEach((ratio) => expect(ratio).toBeCloseTo(0.05, 8));

    rerender(
      <RadarChart
        {...common}
        data={[{id: 'adjacent', label: 'Adjacent', range: 2, speed: 5}]}
        dimensions={sixDimensions}
      />,
    );
    areaRatios(container).forEach((ratio, index) => {
      expect(ratio).toBeCloseTo([1, 0.4, 0, 0, 0, 0][index]!, 8);
    });
  });

  it('derives a readable shared scale for fractional values', () => {
    const {container} = render(
      <RadarChart
        {...common}
        data={[{id: 'fractional', label: 'Fractional', range: 0.5, reliability: 0.25, speed: 0.75}]}
      />,
    );

    const speedPoint = container.querySelector('[data-wcl-radar-point]')!;
    expect(Number(speedPoint.getAttribute('cy'))).toBeCloseTo(127.5, 3);
    expect([...container.querySelectorAll('[data-wcl-radar-guide] text')].at(-1)?.textContent).toBe(
      '1 points',
    );
  });

  it('keeps finite numeric extremes inside finite scale geometry', () => {
    const {container, rerender} = render(
      <RadarChart
        {...common}
        data={[
          {
            id: 'maximum',
            label: 'Maximum',
            range: Number.MAX_VALUE,
            reliability: Number.MAX_VALUE,
            speed: Number.MAX_VALUE,
          },
        ]}
      />,
    );
    const assertFiniteGeometry = () => {
      for (const point of container.querySelectorAll('[data-wcl-radar-point]')) {
        expect(Number.isFinite(Number(point.getAttribute('cx')))).toBe(true);
        expect(Number.isFinite(Number(point.getAttribute('cy')))).toBe(true);
      }
      expect(container.querySelector('[data-wcl-radar-area]')?.getAttribute('points')).not.toMatch(
        /Infinity|NaN/,
      );
      expect(
        [...container.querySelectorAll('[data-wcl-radar-guide] text')]
          .map((label) => label.textContent)
          .join(' '),
      ).not.toMatch(/Infinity|NaN/);
    };

    assertFiniteGeometry();
    rerender(
      <RadarChart
        {...common}
        data={[
          {
            id: 'minimum',
            label: 'Minimum',
            range: Number.MIN_VALUE,
            reliability: Number.MIN_VALUE,
            speed: Number.MIN_VALUE,
          },
        ]}
      />,
    );
    assertFiniteGeometry();
  });

  it('invalidates complete series while retaining valid series and exact zero-only output', () => {
    const {container, rerender} = render(
      <RadarChart
        {...common}
        data={[
          {id: 'courier', label: 'Courier', range: 4, reliability: 3, speed: 5},
          {id: 'broken', label: 'Broken', range: -1, reliability: 2, speed: 3},
        ]}
      />,
    );

    expect(screen.getByText(common.invalidData.title)).toBeTruthy();
    expect(container.querySelectorAll('[data-wcl-radar-series]')).toHaveLength(1);
    expect(screen.queryByRole('columnheader', {name: 'Broken'})).toBeNull();

    rerender(
      <RadarChart
        {...common}
        data={[{id: 'broken', label: 'Broken', range: Number.NaN, reliability: 2, speed: 3}]}
      />,
    );
    expect(container.querySelector('[data-wcl-empty-state][data-kind="unavailable"]')).toBeTruthy();
    expect(screen.queryByRole('table')).toBeNull();

    rerender(
      <RadarChart
        {...common}
        data={[{id: 'zero', label: 'Zero profile', range: 0, reliability: 0, speed: 0}]}
      />,
    );
    expect(container.querySelector('[data-wcl-radar-series]')).toBeTruthy();
    expect(container.querySelector('[data-wcl-radar-area]')).toBeNull();
    expect(container.querySelector('[data-wcl-radar-point]')).toBeNull();
    expect(screen.getByRole('table', {name: common.dataTableLabel})).toBeTruthy();
  });

  it('renders empty, loading, partial, and error states without stale plot output', () => {
    const {container, rerender} = render(<RadarChart {...common} data={[] as never} />);
    expect(container.querySelector('[data-wcl-empty-state][data-kind="no-data"]')).toBeTruthy();
    expect(screen.getByText(common.emptyState.title)).toBeTruthy();
    expect(screen.queryByRole('table')).toBeNull();

    rerender(
      <RadarChart
        {...common}
        data={[{id: 'courier', label: 'Courier', range: 4, reliability: 3, speed: 5}]}
        status={{kind: 'loading', label: 'Loading vehicle scores'}}
      />,
    );
    expect(screen.getByRole('status').textContent).toBe('Loading vehicle scores');
    expect(container.querySelector('[data-wcl-radar-area]')).toBeNull();
    expect(screen.queryByRole('table')).toBeNull();

    rerender(
      <RadarChart
        {...common}
        data={[{id: 'courier', label: 'Courier', range: 4, reliability: 3, speed: 5}]}
        status={{
          description: 'The latest reliability score has not arrived.',
          kind: 'partial',
          title: 'Some scores are pending',
        }}
      />,
    );
    expect(screen.getByText('Some scores are pending')).toBeTruthy();
    expect(container.querySelector('[data-wcl-radar-area]')).toBeTruthy();
    expect(screen.getByRole('table', {name: common.dataTableLabel})).toBeTruthy();

    rerender(
      <RadarChart
        {...common}
        data={[{id: 'courier', label: 'Courier', range: 4, reliability: 3, speed: 5}]}
        status={{
          description: 'Try the comparison again.',
          kind: 'error',
          title: 'Vehicle scores failed',
        }}
      />,
    );
    expect(screen.getByText('Vehicle scores failed')).toBeTruthy();
    expect(container.querySelector('[data-wcl-radar-area]')).toBeNull();
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('reads dimensions with pointer, touch, and keyboard while the legend emphasizes series', () => {
    const {container} = render(
      <RadarChart
        {...common}
        data={[
          {id: 'courier', label: 'Courier', range: 4, reliability: 3, speed: 5},
          {id: 'scout', label: 'Scout', range: 5, reliability: 4, speed: 2},
        ]}
      />,
    );
    const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
    fireEvent.focus(canvas);
    expect(screen.getByRole('tooltip').textContent).toContain('Speed');
    expect(screen.getByRole('tooltip').textContent).toContain('Courier5 points');
    expect(screen.getByRole('tooltip').textContent).toContain('Scout2 points');

    fireEvent.keyDown(canvas, {key: 'ArrowRight'});
    expect(screen.getByRole('tooltip').textContent).toContain('Range');
    fireEvent.pointerMove(container.querySelector('[data-dimension-index="2"]')!, {
      clientX: 280,
      clientY: 190,
      pointerType: 'mouse',
    });
    expect(screen.getByRole('tooltip').textContent).toBe('ReliabilityCourier3 points');
    expect(container.querySelector('[data-wcl-radar-reading-line]')).toBeTruthy();
    const readingPoint = container.querySelector('[data-wcl-radar-reading-point]')!;
    const sourcePoint = container.querySelector('[data-wcl-radar-point]')!;
    expect(Number(readingPoint.getAttribute('r'))).toBeLessThan(
      Number(sourcePoint.getAttribute('r')),
    );
    expect(
      container.querySelector('[data-series-id="courier"]')?.hasAttribute('data-emphasized'),
    ).toBe(true);
    expect(container.querySelector('[data-series-id="scout"]')?.hasAttribute('data-muted')).toBe(
      true,
    );

    const scoutLegend = screen.getByRole('button', {name: 'Scout'});
    fireEvent.pointerLeave(container.querySelector('[data-wcl-chart-svg]')!);
    fireEvent.mouseEnter(scoutLegend);
    expect(
      container.querySelector('[data-series-id="scout"]')?.hasAttribute('data-emphasized'),
    ).toBe(true);
    expect(container.querySelector('[data-series-id="courier"]')?.hasAttribute('data-muted')).toBe(
      true,
    );
    fireEvent.click(scoutLegend);
    fireEvent.mouseLeave(scoutLegend);
    expect(scoutLegend.getAttribute('aria-pressed')).toBe('true');
    fireEvent.pointerMove(container.querySelector('[data-dimension-index="2"]')!, {
      clientX: 280,
      clientY: 190,
      pointerType: 'mouse',
    });
    expect(screen.getByRole('tooltip').textContent).toBe('ReliabilityScout4 points');
    expect(
      container.querySelector('[data-wcl-radar-reading-line]')?.getAttribute('data-color'),
    ).toBe('series-2');
    fireEvent.keyDown(scoutLegend, {key: 'Escape'});
    expect(scoutLegend.getAttribute('aria-pressed')).toBe('false');

    fireEvent.pointerDown(container.querySelector('[data-dimension-index="0"]')!, {
      pointerType: 'touch',
    });
    expect(screen.getByRole('tooltip').textContent).toContain('Speed');
  });

  it('gives a pinned legend series priority only where polygon areas overlap', () => {
    const {container} = render(
      <RadarChart
        {...common}
        data={[
          {id: 'courier', label: 'Courier', range: 7, reliability: 9, speed: 5},
          {id: 'scout', label: 'Scout', range: 9, reliability: 7, speed: 8},
        ]}
      />,
    );
    const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
    vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
      bottom: 480,
      height: 480,
      left: 0,
      right: 480,
      top: 0,
      width: 480,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    const rangeSector = container.querySelector('[data-dimension-index="1"]')!;

    fireEvent.pointerMove(rangeSector, {clientX: 305, clientY: 278, pointerType: 'mouse'});
    expect(screen.getByRole('tooltip').textContent).toBe('RangeScout9 points');

    fireEvent.pointerLeave(svg);
    fireEvent.click(screen.getByRole('button', {name: 'Courier'}));
    fireEvent.pointerMove(rangeSector, {clientX: 305, clientY: 278, pointerType: 'mouse'});
    expect(screen.getByRole('tooltip').textContent).toBe('RangeCourier7 points');

    fireEvent.pointerMove(rangeSector, {clientX: 344, clientY: 300, pointerType: 'mouse'});
    expect(screen.getByRole('tooltip').textContent).toBe('RangeScout9 points');
  });

  it('clears a retained direct reading when its series or geometry changes', () => {
    const {container, rerender} = render(
      <RadarChart
        {...common}
        data={[
          {id: 'courier', label: 'Courier', range: 4, reliability: 3, speed: 5},
          {id: 'scout', label: 'Scout', range: 5, reliability: 4, speed: 2},
        ]}
      />,
    );
    const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
    vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
      bottom: 480,
      height: 480,
      left: 0,
      right: 480,
      top: 0,
      width: 480,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    fireEvent.pointerDown(container.querySelector('[data-dimension-index="0"]')!, {
      clientX: 240,
      clientY: 90,
      pointerType: 'touch',
    });
    expect(screen.getByRole('tooltip').textContent).toBe('SpeedCourier5 points');

    rerender(
      <RadarChart
        {...common}
        data={[{id: 'scout', label: 'Scout', range: 5, reliability: 4, speed: 2}]}
      />,
    );
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(container.querySelector('[data-wcl-radar-reading-guide]')).toBeNull();
  });

  it('preserves valid pinned and focused legend emphasis when values change', () => {
    const first: readonly [VehicleSeries, VehicleSeries] = [
      {id: 'courier', label: 'Courier', range: 4, reliability: 3, speed: 5},
      {id: 'scout', label: 'Scout', range: 5, reliability: 4, speed: 2},
    ];
    const second: readonly [VehicleSeries, VehicleSeries] = [
      {id: 'courier', label: 'Courier', range: 5, reliability: 4, speed: 3},
      {id: 'scout', label: 'Scout', range: 3, reliability: 5, speed: 4},
    ];
    const {container, rerender} = render(<RadarChart {...common} data={first} />);
    const courierLegend = screen.getByRole('button', {name: 'Courier'});
    const scoutLegend = screen.getByRole('button', {name: 'Scout'});

    fireEvent.click(courierLegend);
    rerender(<RadarChart {...common} data={second} />);
    expect(courierLegend.getAttribute('aria-pressed')).toBe('true');
    expect(
      container.querySelector('[data-series-id="courier"]')?.hasAttribute('data-emphasized'),
    ).toBe(true);

    fireEvent.click(courierLegend);
    fireEvent.focus(scoutLegend);
    rerender(<RadarChart {...common} data={first} />);
    expect(
      container.querySelector('[data-series-id="scout"]')?.hasAttribute('data-emphasized'),
    ).toBe(true);
  });

  it('retains, replaces, and dismisses a geometrically selected touch reading', () => {
    const {container} = render(
      <RadarChart
        {...common}
        data={[
          {id: 'courier', label: 'Courier', range: 4, reliability: 3, speed: 5},
          {id: 'scout', label: 'Scout', range: 5, reliability: 4, speed: 2},
        ]}
      />,
    );
    const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
    vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
      bottom: 480,
      height: 480,
      left: 0,
      right: 480,
      top: 0,
      width: 480,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    fireEvent.pointerDown(container.querySelector('[data-dimension-index="0"]')!, {
      clientX: 240,
      clientY: 90,
      pointerType: 'touch',
    });
    expect(screen.getByRole('tooltip').textContent).toBe('SpeedCourier5 points');
    expect(container.querySelector('[data-wcl-radar-reading-guide]')).toBeTruthy();

    fireEvent.pointerDown(container.querySelector('[data-dimension-index="1"]')!, {
      clientX: 370,
      clientY: 315,
      pointerType: 'touch',
    });
    expect(screen.getByRole('tooltip').textContent).toBe('RangeScout5 points');

    fireEvent.pointerDown(document.body, {pointerType: 'touch'});
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('enforces structural bounds and required state copy at runtime', () => {
    expect(() =>
      render(
        <RadarChart
          {...common}
          dimensions={dimensions.slice(0, 2) as unknown as typeof dimensions}
          data={[{id: 'courier', label: 'Courier', range: 4, speed: 5}]}
        />,
      ),
    ).toThrow(/at least three dimensions/i);

    expect(() =>
      render(
        <RadarChart
          {...common}
          data={
            Array.from({length: 7}, (_, index) => ({
              id: `series-${index}`,
              label: `Series ${index}`,
              range: 4,
              reliability: 3,
              speed: 5,
            })) as never
          }
        />,
      ),
    ).toThrow(/at most six series/i);

    expect(() =>
      render(
        <RadarChart
          {...common}
          data={[
            {id: 'duplicate', label: 'Invalid duplicate', range: -1, speed: 5},
            {id: 'duplicate', label: 'Valid duplicate', range: 4, reliability: 3, speed: 5},
          ]}
        />,
      ),
    ).toThrow(/series id "duplicate" is duplicated/i);

    expect(() =>
      render(
        <RadarChart
          {...common}
          data={[{id: 'courier', label: 'Courier', range: 4, reliability: 3, speed: 5}]}
          emptyState={{...common.emptyState, title: ' '}}
        />,
      ),
    ).toThrow(/empty-state title.*blank/i);
  });

  it('keeps chart state output deterministic through server rendering and hydration', async () => {
    const specimen = (
      <RadarChart
        {...common}
        aspectRatio={1.6}
        data={[{id: 'courier', label: 'Courier', range: 4, reliability: 3, speed: 5}]}
        minimumSize={{height: 260, width: 340}}
      />
    );
    const markup = renderToString(specimen);
    document.body.innerHTML = `<div id="root">${markup}</div>`;
    const rootElement = document.querySelector('#root')!;
    const frame = rootElement.querySelector('[data-wcl-chart-frame]');
    expect(frame?.getAttribute('style')).toContain('--wcl-chart-aspect-ratio:1.6');
    expect(frame?.getAttribute('style')).toContain('--wcl-chart-minimum-width:340px');
    const recoverableErrors: unknown[] = [];
    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(async () => {
      root = hydrateRoot(rootElement, specimen, {
        onRecoverableError: (error) => recoverableErrors.push(error),
      });
      await Promise.resolve();
    });
    expect(recoverableErrors).toEqual([]);
    await act(async () => {
      root?.unmount();
      await Promise.resolve();
    });
  });

  it('uses the standard chart proportions by default', () => {
    const {container} = render(
      <RadarChart
        {...common}
        data={[{id: 'courier', label: 'Courier', range: 4, reliability: 3, speed: 5}]}
      />,
    );
    const frame = container.querySelector<HTMLElement>('[data-wcl-chart-frame]')!;

    expect(frame.style.getPropertyValue('--wcl-chart-aspect-ratio')).toBe('1.75');
    expect(frame.style.getPropertyValue('--wcl-chart-minimum-height')).toBe('180px');
    expect(frame.style.getPropertyValue('--wcl-chart-minimum-width')).toBe('320px');
  });

  it('lets a consumer minimum width exceed the default bound', () => {
    const {container} = render(
      <RadarChart
        {...common}
        data={[{id: 'courier', label: 'Courier', range: 4, reliability: 3, speed: 5}]}
        minimumSize={{height: 180, width: 640}}
      />,
    );

    expect(
      container
        .querySelector<HTMLElement>('[data-wcl-radar-chart]')
        ?.style.getPropertyValue('--wcl-chart-minimum-width'),
    ).toBe('640px');
  });

  it('uses the chart family local-overflow convention at its legibility limit', () => {
    const {container, rerender} = render(
      <RadarChart
        {...common}
        data={[{id: 'courier', label: 'Courier', range: 4, reliability: 3, speed: 5}]}
      />,
    );

    expect(container.querySelector('[data-wcl-chart-frame]')?.getAttribute('data-overflow')).toBe(
      'scroll',
    );

    rerender(
      <RadarChart
        {...common}
        data={[{id: 'courier', label: 'Courier', range: 4, reliability: 3, speed: 5}]}
        overflow="clip"
      />,
    );
    expect(container.querySelector('[data-wcl-chart-frame]')?.getAttribute('data-overflow')).toBe(
      'clip',
    );
  });

  it('keeps automatic series colors clear of explicit ordinary colors', () => {
    const {container} = render(
      <RadarChart
        {...common}
        colorAccessor={(item) => (item.id === 'courier' ? 'series-2' : undefined)}
        data={[
          {id: 'courier', label: 'Courier', range: 4, reliability: 3, speed: 5},
          {id: 'scout', label: 'Scout', range: 5, reliability: 4, speed: 2},
        ]}
      />,
    );

    expect(container.querySelector('[data-series-id="courier"]')?.getAttribute('data-color')).toBe(
      'series-2',
    );
    expect(container.querySelector('[data-series-id="scout"]')?.getAttribute('data-color')).toBe(
      'accent',
    );
  });
});

it('fills the radar point up to its border at enlarged and compact scales', () => {
  let side = 720;
  const resize: (() => void)[] = [];
  const measure = vi
    .spyOn(SVGElement.prototype, 'getBoundingClientRect')
    .mockImplementation(() => new DOMRect(0, 0, side, side));
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(notify: () => void) {
        resize.push(notify);
      }
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  );
  try {
    const {container} = render(
      <RadarChart
        {...common}
        data={[{id: 'courier', label: 'Courier', speed: 5, range: 4, reliability: 3}]}
      />,
    );
    const read = () =>
      fireEvent.pointerMove(container.querySelector('[data-dimension-index="0"]')!, {
        clientX: side / 2,
        clientY: (side * 90) / 480,
        pointerType: 'mouse',
      });
    read();
    const radius = () =>
      Number(container.querySelector('[data-wcl-radar-reading-point]')!.getAttribute('r'));
    // At 1.5x, the 4-unit point radius is 6px. Its emphasized 3px border starts at 4.5px.
    expect(radius() * 1.5).toBeGreaterThanOrEqual(4.5);
    expect(radius() * 1.5).toBeLessThanOrEqual(4.85);
    side = 240;
    act(() => {
      for (const notify of resize) notify();
    });
    read();
    // At half size, the inner edge is half a pixel from the center.
    expect(radius() * 0.5).toBeGreaterThanOrEqual(0.5);
    expect(radius() * 0.5).toBeLessThanOrEqual(0.85);
  } finally {
    measure.mockRestore();
    vi.unstubAllGlobals();
  }
});

it('keeps radar text readable when the rendered plot shrinks and grows', () => {
  let side = 176;
  const resize: (() => void)[] = [];
  const measure = vi
    .spyOn(SVGElement.prototype, 'getBoundingClientRect')
    .mockImplementation(() => new DOMRect(0, 0, side, side));
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(notify: () => void) {
        resize.push(notify);
      }
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  );
  try {
    const {container} = render(
      <RadarChart
        {...common}
        data={[{id: 'courier', label: 'Courier', speed: 5, range: 4, reliability: 3}]}
      />,
    );
    const assertReadableText = () => {
      const labels = container.querySelectorAll<SVGTextElement>(
        '[data-wcl-radar-spoke] text, [data-wcl-radar-guide] text',
      );
      expect(labels.length).toBeGreaterThan(0);
      for (const label of labels) {
        expect((parseFloat(getComputedStyle(label).fontSize) * side) / 480).toBeGreaterThanOrEqual(
          12,
        );
      }
    };
    assertReadableText();
    side = 144;
    act(() => {
      for (const notify of resize) notify();
    });
    assertReadableText();
    side = 720;
    act(() => {
      for (const notify of resize) notify();
    });
    assertReadableText();
  } finally {
    measure.mockRestore();
    vi.unstubAllGlobals();
  }
});
