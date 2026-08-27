import {act} from 'react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {Heatmap} from '../src/index.js';
import type {HeatmapProps} from '../src/index.js';

afterEach(cleanup);

interface Reading {
  readonly hour: string;
  readonly location: string;
  readonly value: number;
}

const common: Omit<HeatmapProps<Reading>, 'data'> = {
  columnAccessor: 'hour',
  columns: [
    {id: 'morning', label: 'Morning'},
    {id: 'evening', label: 'Evening'},
  ],
  dataTableLabel: 'Temperature readings',
  description: 'Temperature by location and time of day.',
  emptyState: {description: 'Record a reading to begin.', title: 'No readings'},
  invalidData: {description: 'Correct invalid readings.', title: 'Invalid readings'},
  labels: {
    colorKey: 'Temperature scale',
    column: 'Time',
    missing: 'No reading',
    row: 'Location',
    scrollRegion: 'Temperature grid',
  },
  rowAccessor: 'location',
  rows: [
    {id: 'north', label: 'North room'},
    {id: 'south', label: 'South room'},
  ],
  scale: {type: 'sequential'},
  title: 'Room temperature',
  value: {accessor: 'value', label: 'Temperature', unit: '°C'},
};

describe('Heatmap', () => {
  it('preserves the declared grid, zero, and missing cells in its visual and table', () => {
    const data: readonly Reading[] = [
      {hour: 'morning', location: 'north', value: 0},
      {hour: 'evening', location: 'south', value: -2},
    ];
    const {container} = render(<Heatmap {...common} data={data} />);

    expect(container.querySelectorAll('[data-wcl-heatmap-cell]')).toHaveLength(4);
    expect(container.querySelectorAll('[data-missing]')).toHaveLength(2);
    const table = within(screen.getByRole('table', {name: common.dataTableLabel}));
    expect(table.getAllByRole('row')).toHaveLength(3);
    expect(within(table.getByRole('row', {name: /North room/})).getAllByRole('cell')).toHaveLength(
      2,
    );
    expect(table.getByRole('cell', {name: '0 °C'})).toBeTruthy();
    expect(table.getByRole('cell', {name: '-2 °C'})).toBeTruthy();
    expect(table.getAllByRole('cell', {name: common.labels.missing})).toHaveLength(2);
  });

  it('renders a visible numeric key and a distinct missing key', () => {
    const {container} = render(
      <Heatmap
        {...common}
        data={[
          {hour: 'morning', location: 'north', value: 10},
          {hour: 'evening', location: 'north', value: 20},
        ]}
      />,
    );

    const key = screen.getByLabelText(common.labels.colorKey);
    expect(within(key).getByText('10 °C')).toBeTruthy();
    expect(within(key).getByText('20 °C')).toBeTruthy();
    expect(within(key).getByText(common.labels.missing)).toBeTruthy();
    expect(container.querySelector('[data-wcl-heatmap-key-gradient]')).toBeTruthy();
    expect(container.querySelector('[data-wcl-heatmap-key-missing]')).toBeTruthy();
  });

  it('derives sequential and centered two-sided color scales and clamps fixed ranges', () => {
    const {container, rerender} = render(
      <Heatmap
        {...common}
        data={[
          {hour: 'morning', location: 'north', value: -10},
          {hour: 'evening', location: 'north', value: 30},
        ]}
      />,
    );
    const ratios = () =>
      [...container.querySelectorAll('[data-scale-ratio]')].map((cell) =>
        Number(cell.getAttribute('data-scale-ratio')),
      );
    expect(ratios()).toEqual([0, 1]);

    rerender(
      <Heatmap
        {...common}
        data={[
          {hour: 'morning', location: 'north', value: -10},
          {hour: 'evening', location: 'north', value: 30},
        ]}
        scale={{midpoint: 10, type: 'two-sided'}}
      />,
    );
    expect(ratios()).toEqual([1, 1]);
    expect(container.querySelector('[data-color="series-2"]')).toBeTruthy();
    expect(container.querySelector('[data-color="accent"]')).toBeTruthy();
    expect(screen.getByText('10 °C', {selector: '[data-wcl-heatmap-key-midpoint]'})).toBeTruthy();

    rerender(
      <Heatmap
        {...common}
        data={[
          {hour: 'morning', location: 'north', value: -20},
          {hour: 'evening', location: 'north', value: 50},
        ]}
        scale={{domain: [-10, 30], midpoint: 10, type: 'two-sided'}}
      />,
    );
    expect(ratios()).toEqual([1, 1]);
    expect(screen.getByText('-10 °C')).toBeTruthy();
    expect(screen.getByText('30 °C')).toBeTruthy();
  });

  it('renders the declared two-sided midpoint with the neutral color shown by its key', () => {
    const {container} = render(
      <Heatmap
        {...common}
        data={[{hour: 'morning', location: 'north', value: 10}]}
        scale={{domain: [0, 20], midpoint: 10, type: 'two-sided'}}
      />,
    );

    expect(
      container
        .querySelector('[data-wcl-heatmap-cell][data-scale-ratio="0.0000"]')
        ?.getAttribute('style'),
    ).toContain('--wcl-heatmap-intensity: 0%');
  });

  it('rejects ambiguous grid structure and invalid scale configuration', () => {
    const renderInvalid =
      (overrides: Partial<Omit<HeatmapProps<Reading>, 'data'>> & {data?: readonly Reading[]}) =>
      () =>
        render(<Heatmap {...common} data={[]} {...overrides} />);

    expect(renderInvalid({rows: [...common.rows, {id: 'north', label: 'Duplicate'}]})).toThrow(
      /row id "north" is duplicated/,
    );
    expect(
      renderInvalid({
        data: [
          {hour: 'morning', location: 'north', value: 1},
          {hour: 'morning', location: 'north', value: 2},
        ],
      }),
    ).toThrow(/cell.*duplicated/);
    expect(
      renderInvalid({
        data: [
          {hour: 'morning', location: 'north', value: Number.NaN},
          {hour: 'morning', location: 'north', value: 2},
        ],
      }),
    ).toThrow(/cell.*duplicated/);
    expect(renderInvalid({data: [{hour: 'overnight', location: 'north', value: 1}]})).toThrow(
      /undeclared column/,
    );
    expect(renderInvalid({data: [{hour: 'morning', location: 'basement', value: 1}]})).toThrow(
      /undeclared row/,
    );
    expect(renderInvalid({scale: {domain: [2, 2], type: 'sequential'}})).toThrow(
      /ascending finite/,
    );
    expect(renderInvalid({scale: {domain: [0, 10], midpoint: 10, type: 'two-sided'}})).toThrow(
      /midpoint must be inside/,
    );
  });

  it('keeps distinct coordinate pairs distinct even when ids contain separator characters', () => {
    const {container} = render(
      <Heatmap
        {...common}
        columns={[
          {id: 'b\0c', label: 'Joined column'},
          {id: 'c', label: 'Plain column'},
        ]}
        data={[
          {hour: 'b\0c', location: 'a', value: 1},
          {hour: 'c', location: 'a\0b', value: 2},
        ]}
        rows={[
          {id: 'a', label: 'Plain row'},
          {id: 'a\0b', label: 'Joined row'},
        ]}
      />,
    );

    expect(container.querySelectorAll('[data-wcl-heatmap-cell]')).toHaveLength(4);
    expect(screen.getByRole('cell', {name: '1 °C'})).toBeTruthy();
    expect(screen.getByRole('cell', {name: '2 °C'})).toBeTruthy();
  });

  it('keeps valid cells when records are non-finite and reports all-invalid data as unavailable', () => {
    const {container, rerender} = render(
      <Heatmap
        {...common}
        data={[
          {hour: 'morning', location: 'north', value: 4},
          {hour: 'evening', location: 'north', value: Number.NaN},
        ]}
      />,
    );
    expect(screen.getByText(common.invalidData.title)).toBeTruthy();
    expect(container.querySelectorAll('[data-wcl-heatmap-cell]')).toHaveLength(4);
    expect(screen.getByRole('cell', {name: '4 °C'})).toBeTruthy();
    expect(screen.getAllByRole('cell', {name: common.labels.missing})).toHaveLength(3);

    rerender(
      <Heatmap
        {...common}
        data={[{hour: 'morning', location: 'north', value: Number.POSITIVE_INFINITY}]}
      />,
    );
    expect(container.querySelector('[data-wcl-empty-state][data-kind="unavailable"]')).toBeTruthy();
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('keeps a declared all-missing grid readable and uses empty state for an absent domain', () => {
    const {container, rerender} = render(<Heatmap<Reading> {...common} data={[]} />);
    expect(container.querySelectorAll('[data-missing]')).toHaveLength(4);
    expect(screen.getAllByRole('cell', {name: common.labels.missing})).toHaveLength(4);
    expect(container.querySelector('[data-wcl-heatmap-key-numeric]')).toBeNull();

    rerender(<Heatmap<Reading> {...common} data={[]} rows={[]} />);
    expect(container.querySelector('[data-wcl-empty-state][data-kind="no-data"]')).toBeTruthy();
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('keeps finite numeric extremes inside finite scale encodings', () => {
    const {container, rerender} = render(
      <Heatmap
        {...common}
        data={[
          {hour: 'morning', location: 'north', value: -Number.MAX_VALUE},
          {hour: 'evening', location: 'north', value: Number.MAX_VALUE},
        ]}
        scale={{domain: [-Number.MAX_VALUE, Number.MAX_VALUE], type: 'sequential'}}
      />,
    );
    const assertFiniteRatios = () => {
      for (const cell of container.querySelectorAll('[data-scale-ratio]')) {
        expect(Number.isFinite(Number(cell.getAttribute('data-scale-ratio')))).toBe(true);
      }
    };
    assertFiniteRatios();

    rerender(
      <Heatmap
        {...common}
        data={[
          {hour: 'morning', location: 'north', value: -Number.MAX_VALUE},
          {hour: 'evening', location: 'north', value: Number.MAX_VALUE},
        ]}
        scale={{
          domain: [-Number.MAX_VALUE, Number.MAX_VALUE],
          midpoint: 0,
          type: 'two-sided',
        }}
      />,
    );
    assertFiniteRatios();
  });

  it('reads exact cells with pointer and touch and follows keyboard grid navigation', () => {
    const {container} = render(
      <Heatmap
        {...common}
        data={[
          {hour: 'morning', location: 'north', value: 1},
          {hour: 'evening', location: 'south', value: 4},
        ]}
      />,
    );
    const canvas = container.querySelector('[data-wcl-heatmap-canvas]')!;
    const cells = container.querySelectorAll('[data-wcl-heatmap-cell]');

    fireEvent.pointerMove(cells[0]!, {clientX: 120, clientY: 80, pointerType: 'mouse'});
    expect(screen.getByRole('tooltip').textContent).toContain('North room');
    expect(screen.getByRole('tooltip').textContent).toContain('Morning');
    expect(screen.getByRole('tooltip').textContent).toContain('1 °C');
    expect(screen.getByRole('tooltip').getAttribute('style')).toContain('80px');
    fireEvent.pointerMove(canvas, {clientX: 8, clientY: 8, pointerType: 'mouse'});
    expect(screen.queryByRole('tooltip')).toBeNull();

    fireEvent.pointerDown(cells[1]!, {pointerId: 1, pointerType: 'touch'});
    expect(screen.getByRole('tooltip').textContent).toContain(common.labels.missing);
    fireEvent.pointerLeave(canvas, {pointerId: 1, pointerType: 'touch'});
    expect(screen.getByRole('tooltip').textContent).toContain(common.labels.missing);
    fireEvent.pointerMove(canvas, {pointerType: 'touch'});
    expect(screen.getByRole('tooltip')).toBeTruthy();
    fireEvent.pointerDown(document.body, {pointerType: 'touch'});
    expect(screen.queryByRole('tooltip')).toBeNull();

    fireEvent.focus(canvas);
    expect(screen.getByRole('tooltip').textContent).toContain('North room');
    fireEvent.keyDown(canvas, {key: 'ArrowRight'});
    expect(screen.getByRole('tooltip').textContent).toContain('Evening');
    fireEvent.keyDown(canvas, {key: 'ArrowDown'});
    expect(screen.getByRole('tooltip').textContent).toContain('South room');
    expect(screen.getByRole('tooltip').textContent).toContain('4 °C');
    fireEvent.keyDown(canvas, {key: 'Home'});
    expect(screen.getByRole('tooltip').textContent).toContain('Morning');
    fireEvent.keyDown(canvas, {ctrlKey: true, key: 'Home'});
    expect(screen.getByRole('tooltip').textContent).toContain('North room');
    fireEvent.keyDown(canvas, {ctrlKey: true, key: 'End'});
    expect(screen.getByRole('tooltip').textContent).toContain('South room');
    expect(screen.getByRole('tooltip').textContent).toContain('4 °C');
    fireEvent.keyDown(canvas, {key: 'Escape'});
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('restores a retained touch reading after mouse hover leaves', () => {
    const {container} = render(
      <Heatmap
        {...common}
        data={[
          {hour: 'morning', location: 'north', value: 1},
          {hour: 'evening', location: 'north', value: 2},
        ]}
      />,
    );
    const canvas = container.querySelector('[data-wcl-heatmap-canvas]')!;
    const cells = container.querySelectorAll('[data-wcl-heatmap-cell]');

    fireEvent.pointerDown(cells[1]!, {pointerId: 1, pointerType: 'touch'});
    expect(screen.getByRole('tooltip').textContent).toContain('Evening');
    fireEvent.pointerMove(cells[0]!, {clientX: 120, clientY: 80, pointerType: 'mouse'});
    expect(screen.getByRole('tooltip').textContent).toContain('Morning');
    fireEvent.pointerLeave(canvas, {pointerType: 'mouse'});
    expect(screen.getByRole('tooltip').textContent).toContain('Evening');
  });

  it('stops vertical keyboard movement at row boundaries without changing columns', () => {
    const {container} = render(
      <Heatmap {...common} data={[{hour: 'evening', location: 'north', value: 1}]} />,
    );
    const canvas = container.querySelector('[data-wcl-heatmap-canvas]')!;
    fireEvent.focus(canvas);
    fireEvent.keyDown(canvas, {key: 'ArrowRight'});
    expect(screen.getByRole('tooltip').textContent).toContain('Evening');
    fireEvent.keyDown(canvas, {key: 'ArrowUp'});
    expect(screen.getByRole('tooltip').textContent).toContain('North room');
    expect(screen.getByRole('tooltip').textContent).toContain('Evening');

    fireEvent.keyDown(canvas, {ctrlKey: true, key: 'End'});
    expect(screen.getByRole('tooltip').textContent).toContain('South room');
    expect(screen.getByRole('tooltip').textContent).toContain('Evening');
    fireEvent.keyDown(canvas, {key: 'ArrowDown'});
    expect(screen.getByRole('tooltip').textContent).toContain('South room');
    expect(screen.getByRole('tooltip').textContent).toContain('Evening');
  });

  it('reveals keyboard-selected cells inside an overflowing grid', () => {
    const scrollIntoView = vi.fn();
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    });
    const {container} = render(
      <Heatmap {...common} data={[{hour: 'morning', location: 'north', value: 1}]} />,
    );
    const canvas = container.querySelector('[data-wcl-heatmap-canvas]')!;
    fireEvent.focus(canvas);
    fireEvent.keyDown(canvas, {ctrlKey: true, key: 'End'});

    expect(scrollIntoView).toHaveBeenLastCalledWith({block: 'nearest', inline: 'nearest'});
    delete (Element.prototype as {scrollIntoView?: unknown}).scrollIntoView;
  });

  it('hides dense cell text and labels the local transient-scrollbar region', () => {
    const columns = Array.from({length: 9}, (_, index) => ({
      id: `column-${index}`,
      label: `Column ${index + 1}`,
    }));
    const {container} = render(
      <Heatmap
        {...common}
        columns={columns}
        data={[{hour: 'column-0', location: 'north', value: 12}]}
      />,
    );
    const region = screen.getByRole('region', {name: common.labels.scrollRegion});
    expect(region.hasAttribute('data-scrollable')).toBe(true);
    expect(container.querySelector('[data-show-values]')).toBeNull();
    fireEvent.scroll(region);
    expect(region.hasAttribute('data-scrollbar-active')).toBe(true);
  });

  it('keeps a ninth column inline when measured space is sufficient', () => {
    const bounds = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      bottom: 300,
      height: 300,
      left: 0,
      right: 900,
      toJSON: () => ({}),
      top: 0,
      width: 900,
      x: 0,
      y: 0,
    });
    const columns = Array.from({length: 9}, (_, index) => ({
      id: `column-${index}`,
      label: `Column ${index + 1}`,
    }));
    const {container} = render(
      <Heatmap
        {...common}
        columns={columns}
        data={[{hour: 'column-0', location: 'north', value: 12}]}
        rows={[{id: 'north', label: 'North room'}]}
      />,
    );

    expect(screen.queryByRole('region', {name: common.labels.scrollRegion})).toBeNull();
    expect(container.querySelector('[data-show-values]')).toBeTruthy();
    bounds.mockRestore();
  });

  it('shows values in a compact grid when its cells have enough room', () => {
    const bounds = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      bottom: 300,
      height: 300,
      left: 0,
      right: 400,
      toJSON: () => ({}),
      top: 0,
      width: 400,
      x: 0,
      y: 0,
    });
    const {container} = render(
      <Heatmap
        {...common}
        data={[
          {hour: 'morning', location: 'north', value: 1},
          {hour: 'evening', location: 'south', value: 2},
        ]}
      />,
    );

    expect(container.querySelector('[data-show-values]')).toBeTruthy();
    bounds.mockRestore();
  });

  it('starts responsive observation when a loading Heatmap becomes ready', () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    const ResizeObserverConstructor = vi.fn(
      class {
        disconnect = disconnect;
        observe = observe;
      },
    );
    Object.defineProperty(window, 'ResizeObserver', {
      configurable: true,
      value: ResizeObserverConstructor,
    });
    const {rerender} = render(
      <Heatmap
        {...common}
        data={[{hour: 'morning', location: 'north', value: 1}]}
        status={{kind: 'loading', label: 'Loading readings'}}
      />,
    );
    expect(observe).not.toHaveBeenCalled();

    rerender(<Heatmap {...common} data={[{hour: 'morning', location: 'north', value: 1}]} />);
    expect(observe).toHaveBeenCalledOnce();
    delete (window as {ResizeObserver?: unknown}).ResizeObserver;
  });

  it('renders loading, partial, and error states without stale grid output', () => {
    const data = [{hour: 'morning', location: 'north', value: 1}] as const;
    const {container, rerender} = render(
      <Heatmap {...common} data={data} status={{kind: 'loading', label: 'Loading readings'}} />,
    );
    expect(screen.getByRole('status').textContent).toBe('Loading readings');
    expect(container.querySelector('[data-wcl-heatmap-grid]')).toBeNull();

    rerender(
      <Heatmap
        {...common}
        data={data}
        status={{
          description: 'One sensor is pending.',
          kind: 'partial',
          title: 'Some readings pending',
        }}
      />,
    );
    expect(screen.getByText('Some readings pending')).toBeTruthy();
    expect(container.querySelector('[data-wcl-heatmap-grid]')).toBeTruthy();

    rerender(
      <Heatmap
        {...common}
        data={data}
        status={{description: 'Try again.', kind: 'error', title: 'Readings failed'}}
      />,
    );
    expect(screen.getByText('Readings failed')).toBeTruthy();
    expect(container.querySelector('[data-wcl-heatmap-grid]')).toBeNull();
  });

  it('clears a direct reading when the complete grid changes', () => {
    const {container, rerender} = render(
      <Heatmap {...common} data={[{hour: 'morning', location: 'north', value: 1}]} />,
    );
    fireEvent.focus(container.querySelector('[data-wcl-heatmap-canvas]')!);
    expect(screen.getByRole('tooltip')).toBeTruthy();
    rerender(
      <Heatmap
        {...common}
        columns={[{id: 'morning', label: 'Morning'}]}
        data={[{hour: 'morning', location: 'north', value: 2}]}
      />,
    );
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('renders on the server and hydrates without mismatch warnings', async () => {
    const element = <Heatmap {...common} data={[{hour: 'morning', location: 'north', value: 1}]} />;
    const html = renderToString(element);
    expect(html).toContain('data-wcl-heatmap');
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
