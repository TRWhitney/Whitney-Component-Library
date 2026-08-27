import {act, cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {afterEach, describe, expect, it} from 'vitest';

import {Sparkline} from '../src/index.js';

afterEach(cleanup);

interface DemandRecord {
  readonly month: string;
  readonly value?: number | null;
}

const data: readonly DemandRecord[] = [
  {month: 'Jan', value: 3},
  {month: 'Feb', value: null},
  {month: 'Mar', value: 1},
  {month: 'Apr', value: 4},
  {month: 'May', value: 1},
  {month: 'Jun', value: 5},
];

const common = {
  data,
  dataTableLabel: 'Thermal demand history',
  description: 'Monthly thermal demand, including months without a reading.',
  emptyState: {description: 'Record demand to begin.', title: 'No demand history'},
  invalidData: {description: 'Correct non-finite readings.', title: 'Invalid demand history'},
  labels: {
    first: 'First',
    highest: 'Highest',
    last: 'Last',
    lowest: 'Lowest',
    missing: 'No reading',
  },
  position: {
    accessor: 'month',
    label: 'Month',
    scale: {type: 'categorical'},
  },
  title: 'Thermal demand',
  value: {
    accessor: 'value',
    formatValue: (value: number) => value.toFixed(1),
    label: 'Demand',
    unit: 'MWh',
  },
} as const;

describe('Sparkline', () => {
  it('renders honest gaps, complete rows, and accepted current and tied-range cues', () => {
    const {container} = render(<Sparkline {...common} />);

    expect(screen.getByText(common.title)).toBeTruthy();
    expect(screen.getByText(common.description)).toBeTruthy();
    expect(container.querySelector('[data-wcl-chart-axis]')).toBeNull();
    expect(container.querySelector('[data-wcl-chart-legend]')).toBeNull();
    expect(screen.queryByRole('region')).toBeNull();
    expect(
      container.querySelector('[data-wcl-chart-reading-announcement]')?.getAttribute('aria-atomic'),
    ).toBe('true');

    const line = container.querySelector('[data-wcl-sparkline-line]');
    expect(line?.getAttribute('d')?.match(/M/g)).toHaveLength(2);
    expect(
      container.querySelector('[data-wcl-sparkline-isolated]')?.getAttribute('data-row-index'),
    ).toBe('0');
    expect(container.querySelectorAll('[data-wcl-sparkline-cue="lowest"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-wcl-sparkline-cue="highest"]')).toHaveLength(0);
    expect(container.querySelectorAll('[data-wcl-sparkline-cue="current"]')).toHaveLength(1);
    expect(container.querySelector('[data-row-index="3"]')).toBeNull();
    expect(
      container.querySelector('[data-row-index="5"]')?.getAttribute('data-wcl-sparkline-cue'),
    ).toBe('current');

    const summary = container.querySelector<HTMLElement>('[data-wcl-sparkline-summary]')!;
    expect(summary.querySelector('[data-first-index]')?.getAttribute('data-first-index')).toBe('0');
    expect(summary.querySelector('[data-last-index]')?.getAttribute('data-last-index')).toBe('5');
    expect(within(summary).getByText('1.0 MWh')).toBeTruthy();
    expect(within(summary).getAllByText('5.0 MWh')).toHaveLength(2);

    const table = screen.getByRole('table', {name: common.dataTableLabel});
    expect(within(table).getAllByRole('row')).toHaveLength(data.length + 1);
    expect(within(table).getByRole('row', {name: /Feb No reading/})).toBeTruthy();
    expect(within(table).getByRole('row', {name: /Jun 5\.0 MWh/})).toBeTruthy();
  });

  it('uses directional half-filled circles for low and high ties and a hollow endpoint', () => {
    const {container} = render(
      <Sparkline
        {...common}
        data={[
          {month: 'Jan', value: 1},
          {month: 'Feb', value: 1},
          {month: 'Mar', value: 2},
          {month: 'Apr', value: 4},
          {month: 'May', value: 4},
        ]}
      />,
    );
    const lowest = container.querySelector('[data-wcl-sparkline-cue="lowest"]');
    const highest = container.querySelector('[data-wcl-sparkline-cue="highest"]');

    expect(container.querySelectorAll('[data-wcl-sparkline-cue="lowest"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-wcl-sparkline-cue="highest"]')).toHaveLength(1);
    expect(lowest?.querySelector('[data-wcl-sparkline-cue-fill="bottom"]')).toBeTruthy();
    expect(highest?.querySelector('[data-wcl-sparkline-cue-fill="top"]')).toBeTruthy();
    expect(
      container
        .querySelector('[data-wcl-sparkline-cue="current"]')
        ?.querySelector('[data-wcl-sparkline-cue-fill]'),
    ).toBeNull();
    expect(container.querySelector('[data-row-index="2"]')).toBeNull();
  });

  it('completes existing cue circles on reading and keeps the ordinary reading point', () => {
    const {container} = render(
      <Sparkline
        {...common}
        data={[
          {month: 'Jan', value: 1},
          {month: 'Feb', value: 1},
          {month: 'Mar', value: 2},
          {month: 'Apr', value: 4},
          {month: 'May', value: 4},
        ]}
      />,
    );
    const canvas = container.querySelector('[data-wcl-sparkline-canvas]')!;

    fireEvent.focus(canvas);
    expect(
      container
        .querySelector('[data-wcl-chart-reading-node]')
        ?.getAttribute('data-wcl-sparkline-reading-node'),
    ).toBe('complete');
    expect(
      container
        .querySelector('[data-wcl-chart-reading-node]')
        ?.getAttribute('data-wcl-sparkline-reading-fill'),
    ).toBe('top');
    expect(container.querySelector('[data-wcl-chart-reading-node]')?.getAttribute('d')).toMatch(
      / A [^ ]+ [^ ]+ 0 1 1 /,
    );
    fireEvent.keyDown(canvas, {key: 'ArrowRight'});
    fireEvent.keyDown(canvas, {key: 'ArrowRight'});
    expect(
      container
        .querySelector('[data-wcl-chart-reading-node]')
        ?.getAttribute('data-wcl-sparkline-reading-node'),
    ).toBe('ordinary');
    fireEvent.keyDown(canvas, {key: 'ArrowRight'});
    expect(
      container
        .querySelector('[data-wcl-chart-reading-node]')
        ?.getAttribute('data-wcl-sparkline-reading-node'),
    ).toBe('complete');
    expect(
      container
        .querySelector('[data-wcl-chart-reading-node]')
        ?.getAttribute('data-wcl-sparkline-reading-fill'),
    ).toBe('bottom');
    expect(container.querySelector('[data-wcl-chart-reading-node]')?.getAttribute('d')).toMatch(
      / A [^ ]+ [^ ]+ 0 1 0 /,
    );
    fireEvent.keyDown(canvas, {key: 'End'});
    expect(
      container
        .querySelector('[data-wcl-chart-reading-node]')
        ?.getAttribute('data-wcl-sparkline-reading-node'),
    ).toBe('complete');
    expect(
      container
        .querySelector('[data-wcl-chart-reading-node]')
        ?.getAttribute('data-wcl-sparkline-reading-fill'),
    ).toBe('full');
  });

  it('preserves complete range cues when every value is equal', () => {
    const {container} = render(
      <Sparkline
        {...common}
        data={[
          {month: 'Jan', value: 2},
          {month: 'Feb', value: 2},
          {month: 'Mar', value: 2},
        ]}
      />,
    );
    const canvas = container.querySelector('[data-wcl-sparkline-canvas]')!;

    expect(container.querySelectorAll('[data-wcl-sparkline-cue="range"]')).toHaveLength(2);
    expect(
      container
        .querySelector('[data-wcl-sparkline-cue="range"] [data-wcl-sparkline-cue-fill]')
        ?.getAttribute('data-wcl-sparkline-cue-fill'),
    ).toBe('full');
    fireEvent.focus(canvas);
    expect(container.querySelector('[data-wcl-chart-reading-needle]')).toBeTruthy();
    expect(container.querySelector('[data-wcl-chart-reading-node]')).toBeNull();
    expect(within(screen.getByRole('tooltip')).getByText('Lowest, Highest')).toBeTruthy();
    fireEvent.keyDown(canvas, {key: 'End'});
    expect(
      container
        .querySelector('[data-wcl-chart-reading-node]')
        ?.getAttribute('data-wcl-sparkline-reading-fill'),
    ).toBe('full');
  });

  it('reads nearest records with pointer, retained touch, and ordered keyboard movement', () => {
    const {container} = render(<Sparkline {...common} />);
    const canvas = container.querySelector('[data-wcl-sparkline-canvas]')!;
    const svg = container.querySelector('[data-wcl-sparkline-svg]')!;
    Object.defineProperty(svg, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({bottom: 160, height: 160, left: 0, right: 640, top: 0, width: 640}),
    });

    fireEvent.pointerMove(svg, {clientX: 160, clientY: 80, pointerType: 'mouse'});
    const tooltip = screen.getByRole('tooltip');
    expect(within(tooltip).getByText('Feb')).toBeTruthy();
    expect(within(tooltip).getByText('No reading')).toBeTruthy();
    expect(tooltip.style.getPropertyValue('--wcl-chart-tooltip-y')).toBe('80px');
    expect(container.querySelector('[data-wcl-chart-reading-node]')).toBeNull();

    fireEvent.pointerDown(svg, {
      clientX: 370,
      clientY: 80,
      pointerId: 1,
      pointerType: 'touch',
    });
    expect(within(screen.getByRole('tooltip')).getByText('Apr')).toBeTruthy();
    fireEvent.pointerLeave(svg, {pointerType: 'touch'});
    expect(within(screen.getByRole('tooltip')).getByText('Apr')).toBeTruthy();
    fireEvent.pointerMove(svg, {clientX: 58, clientY: 80, pointerType: 'mouse'});
    expect(within(screen.getByRole('tooltip')).getByText('Jan')).toBeTruthy();
    fireEvent.pointerLeave(svg, {pointerType: 'mouse'});
    expect(within(screen.getByRole('tooltip')).getByText('Apr')).toBeTruthy();
    fireEvent.pointerDown(document.body, {pointerType: 'mouse'});
    expect(screen.queryByRole('tooltip')).toBeNull();

    fireEvent.focus(canvas);
    expect(within(screen.getByRole('tooltip')).getByText('Jan')).toBeTruthy();
    expect(within(screen.getByRole('tooltip')).queryByText('Lowest')).toBeNull();
    expect(within(screen.getByRole('tooltip')).queryByText('Highest')).toBeNull();
    expect((canvas as HTMLElement).style.getPropertyValue('--wcl-chart-point-radius')).not.toBe('');
    expect(
      container
        .querySelector('[data-wcl-chart-reading-node]')
        ?.getAttribute('data-wcl-sparkline-reading-node'),
    ).toBe('ordinary');
    fireEvent.keyDown(canvas, {key: 'ArrowRight'});
    expect(within(screen.getByRole('tooltip')).getByText('Feb')).toBeTruthy();
    expect(within(screen.getByRole('tooltip')).getByText('No reading')).toBeTruthy();
    fireEvent.keyDown(canvas, {key: 'End'});
    expect(within(screen.getByRole('tooltip')).getByText('Jun')).toBeTruthy();
    expect(within(screen.getByRole('tooltip')).getByText('Highest')).toBeTruthy();
    expect(within(screen.getByRole('tooltip')).queryByText('Lowest')).toBeNull();
    fireEvent.keyDown(canvas, {key: 'Home'});
    expect(within(screen.getByRole('tooltip')).getByText('Jan')).toBeTruthy();
    fireEvent.keyDown(canvas, {key: 'ArrowRight'});
    fireEvent.keyDown(canvas, {key: 'ArrowRight'});
    expect(within(screen.getByRole('tooltip')).getByText('Mar')).toBeTruthy();
    expect(within(screen.getByRole('tooltip')).getByText('Lowest')).toBeTruthy();
    expect(within(screen.getByRole('tooltip')).queryByText('Highest')).toBeNull();
    fireEvent.keyDown(canvas, {key: 'Escape'});
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('accepts negative and zero values, applies a fixed range, and reports invalid records', () => {
    const {container} = render(
      <Sparkline
        {...common}
        data={[
          {month: 'Jan', value: -2},
          {month: 'Feb', value: Number.POSITIVE_INFINITY},
          {month: 'Mar', value: 0},
        ]}
        valueRange={[-10, 10]}
      />,
    );

    expect(screen.getByText(common.invalidData.title)).toBeTruthy();
    expect(screen.getByRole('table').querySelectorAll('tbody tr')).toHaveLength(2);
    expect(container.querySelector('[data-wcl-sparkline-line]')?.getAttribute('d')).not.toMatch(
      /NaN|Infinity/,
    );
    expect(
      container
        .querySelector('[data-wcl-sparkline-cue="current"] [data-wcl-sparkline-cue-outline]')
        ?.getAttribute('cy'),
    ).toBe('80');
    expect(within(screen.getByRole('table')).getByRole('row', {name: /Mar 0\.0 MWh/})).toBeTruthy();
  });

  it('keeps geometry finite at the supported numeric extremes', () => {
    const linear = render(
      <Sparkline
        {...common}
        data={[
          {month: -Number.MAX_VALUE, value: -Number.MAX_VALUE},
          {month: 0, value: 0},
          {month: Number.MAX_VALUE, value: Number.MAX_VALUE},
        ]}
        position={{
          accessor: 'month',
          label: 'Sequence',
          scale: {domain: [-Number.MAX_VALUE, Number.MAX_VALUE], type: 'linear'},
        }}
        valueRange={[-Number.MAX_VALUE, Number.MAX_VALUE]}
      />,
    );

    expect(
      linear.container.querySelector('[data-wcl-sparkline-line]')?.getAttribute('d'),
    ).not.toMatch(/NaN|Infinity/);
    for (const cue of linear.container.querySelectorAll('[data-wcl-sparkline-cue]')) {
      const outline = cue.querySelector('[data-wcl-sparkline-cue-outline]');
      expect(outline?.getAttribute('cx')).not.toMatch(/NaN|Infinity/);
      expect(outline?.getAttribute('cy')).not.toMatch(/NaN|Infinity/);
    }
    linear.unmount();

    const logarithmic = render(
      <Sparkline
        {...common}
        data={[
          {month: Number.MIN_VALUE, value: 1},
          {month: Number.MIN_VALUE * 2, value: 2},
        ]}
        position={{
          accessor: 'month',
          label: 'Sequence',
          scale: {base: 0.5, type: 'logarithmic'},
        }}
      />,
    );
    expect(
      logarithmic.container.querySelector('[data-wcl-sparkline-line]')?.getAttribute('d'),
    ).not.toMatch(/NaN|Infinity/);
    logarithmic.unmount();

    const time = render(
      <Sparkline
        {...common}
        data={[{month: new Date(-8_640_000_000_000_000), value: 1}]}
        position={{accessor: 'month', label: 'Date', scale: {type: 'time'}}}
      />,
    );
    expect(
      time.container.querySelector('[data-wcl-sparkline-line]')?.getAttribute('d'),
    ).not.toMatch(/NaN|Infinity/);
    expect(
      time.container
        .querySelector('[data-wcl-sparkline-cue] [data-wcl-sparkline-cue-outline]')
        ?.getAttribute('cx'),
    ).not.toMatch(/NaN|Infinity/);
    time.rerender(
      <Sparkline
        {...common}
        data={[{month: new Date(8_640_000_000_000_000), value: 1}]}
        position={{accessor: 'month', label: 'Date', scale: {type: 'time'}}}
      />,
    );
    expect(
      time.container.querySelector('[data-wcl-sparkline-line]')?.getAttribute('d'),
    ).not.toMatch(/NaN|Infinity/);
    expect(
      time.container
        .querySelector('[data-wcl-sparkline-cue] [data-wcl-sparkline-cue-outline]')
        ?.getAttribute('cx'),
    ).not.toMatch(/NaN|Infinity/);
  });

  it('uses explicit empty, unavailable, loading, partial, and error states', () => {
    const {container, rerender} = render(
      <Sparkline {...common} data={[] as readonly DemandRecord[]} />,
    );
    expect(screen.getByText(common.emptyState.title)).toBeTruthy();
    expect(container.querySelector('[data-wcl-sparkline-svg]')).toBeNull();

    rerender(<Sparkline {...common} data={[{month: 'Jan', value: Number.NaN}]} />);
    expect(screen.getByText(common.invalidData.title)).toBeTruthy();
    expect(container.querySelector('[data-wcl-sparkline-svg]')).toBeNull();

    rerender(<Sparkline {...common} data={[{month: 'Jan', value: null}]} />);
    expect(screen.getByText(common.invalidData.title)).toBeTruthy();
    expect(
      within(screen.getByRole('table', {name: common.dataTableLabel})).getByRole('row', {
        name: /Jan No reading/,
      }),
    ).toBeTruthy();

    rerender(<Sparkline {...common} status={{kind: 'loading', label: 'Loading demand history'}} />);
    expect(screen.getByRole('status').textContent).toBe('Loading demand history');

    rerender(
      <Sparkline
        {...common}
        status={{description: 'One month is pending.', kind: 'partial', title: 'Partial history'}}
      />,
    );
    expect(screen.getByText('Partial history')).toBeTruthy();
    expect(container.querySelector('[data-wcl-sparkline-svg]')).toBeTruthy();

    rerender(
      <Sparkline
        {...common}
        status={{description: 'Try again.', kind: 'error', title: 'Demand history failed'}}
      />,
    );
    expect(screen.getByText('Demand history failed')).toBeTruthy();
    expect(container.querySelector('[data-wcl-sparkline-svg]')).toBeNull();
  });

  it('supports numeric and time positions and serializes sizing without local overflow', () => {
    const numeric = render(
      <Sparkline
        {...common}
        aspectRatio={3}
        data={[
          {month: 1, value: 2},
          {month: 10, value: 4},
        ]}
        minimumSize={{height: 90, width: 280}}
        position={{accessor: 'month', label: 'Sequence', scale: {domain: [0, 12], type: 'linear'}}}
      />,
    );
    const canvas = numeric.container.querySelector<HTMLElement>('[data-wcl-sparkline-canvas]')!;
    expect(canvas.style.getPropertyValue('--wcl-chart-aspect-ratio')).toBe('3');
    expect(canvas.style.getPropertyValue('--wcl-chart-minimum-height')).toBe('90px');
    expect(canvas.style.getPropertyValue('--wcl-chart-minimum-width')).toBe('280px');
    expect(numeric.container.querySelector('[data-scrollable]')).toBeNull();
    numeric.unmount();

    const when = [new Date('2026-01-01T00:00:00Z'), new Date('2026-01-02T00:00:00Z')];
    render(
      <Sparkline
        {...common}
        data={[
          {month: when[0]!, value: 2},
          {month: when[1]!, value: 4},
        ]}
        position={{
          accessor: 'month',
          formatValue: (value: Date) => value.toISOString().slice(5, 10),
          label: 'Day',
          scale: {type: 'time'},
        }}
      />,
    );
    expect(
      within(screen.getByRole('table')).getByRole('row', {name: /01-01 2\.0 MWh/}),
    ).toBeTruthy();
  });

  it('defaults to a shorter compact trend area', () => {
    const {container} = render(<Sparkline {...common} />);
    const canvas = container.querySelector<HTMLElement>('[data-wcl-sparkline-canvas]')!;

    expect(canvas.style.getPropertyValue('--wcl-chart-aspect-ratio')).toBe('6');
    expect(canvas.style.getPropertyValue('--wcl-chart-minimum-height')).toBe('48px');
    expect(canvas.style.getPropertyValue('--wcl-chart-minimum-width')).toBe('240px');
  });

  it('lets a consumer minimum width exceed the default bound', () => {
    const {container} = render(<Sparkline {...common} minimumSize={{height: 48, width: 640}} />);

    expect(
      container
        .querySelector<HTMLElement>('[data-wcl-sparkline]')
        ?.style.getPropertyValue('--wcl-chart-minimum-width'),
    ).toBe('640px');
  });

  it('rejects invalid configuration at runtime', () => {
    expect(() => render(<Sparkline {...common} valueRange={[4, 4]} />)).toThrow(/valueRange/i);
    expect(() => render(<Sparkline {...common} aspectRatio={0} />)).toThrow(/aspectRatio/i);
    expect(() =>
      render(
        <Sparkline
          {...common}
          position={{
            ...common.position,
            scale: {domain: ['Jan', 'Jan'] as readonly string[], type: 'categorical'},
          }}
        />,
      ),
    ).toThrow(/unique/i);
  });

  it('clears retained readings when the ordered series changes', () => {
    const {container, rerender} = render(<Sparkline {...common} />);
    fireEvent.focus(container.querySelector('[data-wcl-sparkline-canvas]')!);
    expect(screen.getByRole('tooltip')).toBeTruthy();
    rerender(<Sparkline {...common} data={[{month: 'Jul', value: 8}]} />);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('renders on the server and hydrates without mismatch warnings', async () => {
    const element = <Sparkline {...common} />;
    const html = renderToString(element);
    expect(html).toContain('data-wcl-sparkline');
    expect(html).toContain(common.dataTableLabel);
    const host = document.createElement('div');
    host.innerHTML = html;
    document.body.append(host);
    const recoverableErrors: unknown[] = [];
    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(async () => {
      root = hydrateRoot(host, element, {
        onRecoverableError: (error) => recoverableErrors.push(error),
      });
      await Promise.resolve();
    });
    expect(recoverableErrors).toEqual([]);
    await act(async () => {
      root?.unmount();
      await Promise.resolve();
    });
    host.remove();
  });
});
