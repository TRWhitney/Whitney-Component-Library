import {within, act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, beforeEach, expect, it, vi} from 'vitest';
import {
  Heatmap,
  type HeatmapProps,
  type HeatmapInteraction,
  type HeatmapSelectionItem,
} from '../src/index.js';

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
  scale: {color: '#2878ff', type: 'sequential'},
  title: 'Room temperature',
  value: {accessor: 'value', label: 'Temperature', unit: '°C'},
};

const data = [
  {hour: 'morning', location: 'north', value: 0},
  {hour: 'evening', location: 'south', value: 20},
];
const labels = {
  instructions: 'Select cells or activate details.',
  clear: 'Clear selection',
  empty: 'None',
  summary: (n: number) => `${n} selected`,
  item: (item: HeatmapSelectionItem) => `${item.rowId} ${item.columnId}`,
  hidden: (s: string) => s,
};
beforeEach(() => {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const index = this.getAttribute('data-cell-index');
    return index === null
      ? new DOMRect(0, 0, 300, 180)
      : new DOMRect(60 + (+index % 2) * 104, 30 + Math.floor(+index / 2) * 54, 100, 50);
  });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});
function cell(container: HTMLElement, index: number) {
  return container.querySelector<HTMLElement>(`[data-cell-index="${index}"]`)!;
}
function pointer(target: Element, type: 'pointerDown' | 'pointerUp' | 'pointerMove', extra = {}) {
  const r = target.getBoundingClientRect();
  fireEvent[type](target, {
    clientX: r.x + r.width / 2,
    clientY: r.y + r.height / 2,
    pointerId: 1,
    pointerType: 'mouse',
    isPrimary: true,
    button: 0,
    ...extra,
  });
}
function click(target: Element, extra = {}) {
  pointer(target, 'pointerDown', extra);
  pointer(target, 'pointerUp', extra);
}
it('selects zero and missing cells while activation reports the original or absent record independently', () => {
  const onActivate = vi.fn<NonNullable<HeatmapInteraction<Reading>['onActivate']>>(),
    onSelectionChange = vi.fn<(items: readonly HeatmapSelectionItem[]) => void>();
  const {container} = render(
    <Heatmap
      {...common}
      data={data}
      interaction={{selection: {labels, onSelectionChange}, onActivate}}
    />,
  );
  click(cell(container, 0));
  expect(onSelectionChange).toHaveBeenLastCalledWith([{rowId: 'north', columnId: 'morning'}]);
  expect(cell(container, 0).hasAttribute('data-selected')).toBe(true);
  click(cell(container, 0), {ctrlKey: true});
  expect(onActivate).toHaveBeenLastCalledWith({
    item: {rowId: 'north', columnId: 'morning'},
    row: common.rows[0],
    column: common.columns[0],
    value: 0,
    datum: data[0],
    input: 'pointer',
  });
  click(cell(container, 1));
  click(cell(container, 1), {metaKey: true});
  expect(onActivate).toHaveBeenLastCalledWith({
    item: {rowId: 'north', columnId: 'evening'},
    row: common.rows[0],
    column: common.columns[1],
    value: undefined,
    datum: undefined,
    input: 'pointer',
  });
  expect(onSelectionChange).toHaveBeenCalledTimes(2);
  expect(container.querySelector('[data-wcl-chart-activation-outline]')).not.toBeNull();
  fireEvent.click(screen.getByRole('button', {name: 'Clear selection'}));
  expect(onSelectionChange).toHaveBeenLastCalledWith([]);
});
it('commits touched boxes and cancels a drag without changing the prior selection', () => {
  const change = vi.fn<(items: readonly HeatmapSelectionItem[]) => void>();
  const {container} = render(
    <Heatmap
      {...common}
      data={data}
      interaction={{selection: {labels, onSelectionChange: change}}}
    />,
  );
  const canvas = container.querySelector('[data-wcl-heatmap-canvas]')!;
  pointer(cell(container, 0), 'pointerDown', {clientX: 158, clientY: 40});
  pointer(canvas, 'pointerMove', {clientX: 168, clientY: 90});
  expect(container.querySelector('[data-wcl-chart-selection-box]')).not.toBeNull();
  pointer(canvas, 'pointerUp', {clientX: 168, clientY: 90});
  expect(change).toHaveBeenLastCalledWith([
    {rowId: 'north', columnId: 'morning'},
    {rowId: 'north', columnId: 'evening'},
    {rowId: 'south', columnId: 'morning'},
    {rowId: 'south', columnId: 'evening'},
  ]);
  pointer(cell(container, 0), 'pointerDown');
  pointer(cell(container, 1), 'pointerMove');
  fireEvent.keyDown(canvas, {key: 'Escape'});
  pointer(cell(container, 1), 'pointerUp');
  expect(change).toHaveBeenCalledTimes(1);
  expect(container.querySelector('[data-wcl-chart-selection-box]')).toBeNull();
});
it('keeps controlled ownership and selection identity across reordering and prunes removed coordinates', () => {
  const change = vi.fn<(items: readonly HeatmapSelectionItem[]) => void>();
  const selectedItems = [{rowId: 'north', columnId: 'morning'}];
  const interaction = {selection: {labels, selectedItems, onSelectionChange: change}};
  const {container, rerender} = render(
    <Heatmap {...common} data={data} interaction={interaction} />,
  );
  click(cell(container, 1));
  expect(cell(container, 1).hasAttribute('data-selected')).toBe(false);
  rerender(
    <Heatmap {...common} rows={[...common.rows].reverse()} data={data} interaction={interaction} />,
  );
  expect(cell(container, 2).hasAttribute('data-selected')).toBe(true);
  rerender(
    <Heatmap {...common} rows={[common.rows[1]!]} data={[data[1]!]} interaction={interaction} />,
  );
  expect(container.querySelector('[data-selected]')).toBeNull();
  expect(change).toHaveBeenCalledTimes(1);
});
it('activates on touch hold without selecting on release, and cancels a hold on data replacement', () => {
  vi.useFakeTimers();
  const onActivate = vi.fn<NonNullable<HeatmapInteraction<Reading>['onActivate']>>(),
    change = vi.fn<(items: readonly HeatmapSelectionItem[]) => void>();
  const interaction = {selection: {labels, onSelectionChange: change}, onActivate};
  const {container, rerender} = render(
    <Heatmap {...common} data={data} interaction={interaction} />,
  );
  pointer(cell(container, 1), 'pointerDown', {pointerType: 'touch'});
  act(() => {
    vi.advanceTimersByTime(510);
  });
  pointer(cell(container, 1), 'pointerUp', {pointerType: 'touch'});
  expect(onActivate.mock.lastCall?.[0].input).toBe('touch');
  expect(change).not.toHaveBeenCalled();
  pointer(cell(container, 0), 'pointerDown', {pointerType: 'touch'});
  rerender(<Heatmap {...common} data={[...data]} interaction={interaction} />);
  act(() => {
    vi.advanceTimersByTime(510);
  });
  expect(onActivate).toHaveBeenCalledTimes(1);
});
it('separates keyboard selection and activation and supports Command grid endpoints', () => {
  const onActivate = vi.fn<NonNullable<HeatmapInteraction<Reading>['onActivate']>>(),
    change = vi.fn<(items: readonly HeatmapSelectionItem[]) => void>();
  const {container} = render(
    <Heatmap
      {...common}
      data={data}
      interaction={{selection: {labels, onSelectionChange: change}, onActivate}}
    />,
  );
  const canvas = container.querySelector('[data-wcl-heatmap-canvas]')!;
  fireEvent.focus(canvas);
  fireEvent.keyDown(canvas, {key: 'ArrowRight'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(change).toHaveBeenLastCalledWith([{rowId: 'north', columnId: 'evening'}]);
  fireEvent.keyDown(canvas, {key: ' ', ctrlKey: true});
  expect(onActivate.mock.lastCall?.[0].item).toEqual({rowId: 'north', columnId: 'evening'});
  fireEvent.keyDown(canvas, {key: 'End', metaKey: true});
  fireEvent.keyDown(canvas, {key: 'Enter', metaKey: true});
  expect(onActivate.mock.lastCall?.[0].item).toEqual({rowId: 'south', columnId: 'evening'});
  expect(change).toHaveBeenCalledTimes(1);
});
it('does not activate the first cell from empty chart space or pointer focus', () => {
  const onActivate = vi.fn<NonNullable<HeatmapInteraction<Reading>['onActivate']>>();
  const {container} = render(<Heatmap {...common} data={data} interaction={{onActivate}} />);
  const canvas = container.querySelector('[data-wcl-heatmap-canvas]')!;
  pointer(canvas, 'pointerDown', {clientX: 10, clientY: 10});
  fireEvent.focus(canvas);
  pointer(canvas, 'pointerUp', {clientX: 10, clientY: 10});
  expect(onActivate).not.toHaveBeenCalled();
  expect(container.querySelector('[data-active]')).toBeNull();
  click(cell(container, 3));
  expect(onActivate.mock.lastCall?.[0].item).toEqual({rowId: 'south', columnId: 'evening'});
});

it('adds and removes touched cells and cancels on pointer loss or scrolling', () => {
  const change = vi.fn<(items: readonly HeatmapSelectionItem[]) => void>();
  const {container} = render(
    <Heatmap
      {...common}
      data={data}
      interaction={{selection: {labels, onSelectionChange: change}}}
    />,
  );
  const canvas = container.querySelector('[data-wcl-heatmap-canvas]')!;
  click(cell(container, 3));
  pointer(cell(container, 0), 'pointerDown', {shiftKey: true});
  pointer(cell(container, 1), 'pointerMove');
  pointer(cell(container, 1), 'pointerUp');
  expect(change.mock.lastCall?.[0]).toHaveLength(3);
  pointer(cell(container, 0), 'pointerDown', {altKey: true});
  pointer(cell(container, 1), 'pointerMove');
  pointer(cell(container, 1), 'pointerUp');
  expect(change).toHaveBeenLastCalledWith([{rowId: 'south', columnId: 'evening'}]);
  pointer(cell(container, 0), 'pointerDown');
  pointer(cell(container, 1), 'pointerMove');
  fireEvent.pointerCancel(canvas, {pointerId: 1});
  pointer(cell(container, 1), 'pointerUp');
  expect(change).toHaveBeenCalledTimes(3);
  pointer(cell(container, 0), 'pointerDown');
  pointer(cell(container, 1), 'pointerMove');
  fireEvent.scroll(container.querySelector('[data-wcl-heatmap-frame]')!);
  pointer(cell(container, 1), 'pointerUp');
  expect(change).toHaveBeenCalledTimes(3);
  expect(container.querySelector('[data-wcl-chart-selection-box]')).toBeNull();
});
it('keeps invalid source records distinct from absent records and supports all-missing grids', () => {
  const onActivate = vi.fn<NonNullable<HeatmapInteraction<Reading>['onActivate']>>();
  const invalid = {hour: 'evening', location: 'north', value: NaN};
  const {container, rerender} = render(
    <Heatmap {...common} data={[data[0]!, invalid]} interaction={{onActivate}} />,
  );
  click(cell(container, 1));
  expect(onActivate.mock.lastCall?.[0].value).toBeUndefined();
  expect(onActivate.mock.lastCall?.[0].datum).toBe(invalid);
  rerender(<Heatmap {...common} data={[]} interaction={{onActivate}} />);
  click(cell(container, 3));
  expect(onActivate.mock.lastCall?.[0]).toMatchObject({
    item: {rowId: 'south', columnId: 'evening'},
    value: undefined,
    datum: undefined,
  });
});
it('restarts finite activation feedback and cancels a pending hold when activation is disabled', () => {
  vi.useFakeTimers();
  const onActivate = vi.fn<NonNullable<HeatmapInteraction<Reading>['onActivate']>>(),
    change = vi.fn<(items: readonly HeatmapSelectionItem[]) => void>();
  const selection = {labels, onSelectionChange: change};
  const {container, rerender} = render(
    <Heatmap {...common} data={data} interaction={{selection, onActivate}} />,
  );
  click(cell(container, 0), {ctrlKey: true});
  act(() => {
    vi.advanceTimersByTime(400);
  });
  click(cell(container, 0), {ctrlKey: true});
  act(() => {
    vi.advanceTimersByTime(300);
  });
  expect(container.querySelector('[data-wcl-chart-activation-outline]')).not.toBeNull();
  act(() => {
    vi.advanceTimersByTime(351);
  });
  expect(container.querySelector('[data-wcl-chart-activation-outline]')).toBeNull();
  pointer(cell(container, 0), 'pointerDown', {pointerType: 'touch'});
  rerender(<Heatmap {...common} data={data} interaction={{selection}} />);
  act(() => {
    vi.advanceTimersByTime(510);
  });
  pointer(cell(container, 0), 'pointerUp', {pointerType: 'touch'});
  expect(onActivate).toHaveBeenCalledTimes(2);
  expect(change).not.toHaveBeenCalled();
});
it('cancels a pending drag on layout and status changes', () => {
  let notify: ResizeObserverCallback | undefined;
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: ResizeObserverCallback) {
        notify = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
  try {
    const change = vi.fn<(items: readonly HeatmapSelectionItem[]) => void>();
    const interaction = {selection: {labels, onSelectionChange: change}};
    const {container, rerender} = render(
      <Heatmap {...common} data={data} interaction={interaction} />,
    );
    pointer(cell(container, 0), 'pointerDown');
    pointer(cell(container, 1), 'pointerMove');
    const canvas = container.querySelector('[data-wcl-heatmap-canvas]')!;
    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 400, 180));
    act(() => notify?.([], {} as ResizeObserver));
    pointer(cell(container, 1), 'pointerUp');
    expect(change).not.toHaveBeenCalled();
    pointer(cell(container, 0), 'pointerDown');
    pointer(cell(container, 1), 'pointerMove');
    rerender(
      <Heatmap
        {...common}
        data={data}
        interaction={interaction}
        status={{kind: 'loading', label: 'Loading'}}
      />,
    );
    expect(container.querySelector('[data-wcl-chart-selection-box]')).toBeNull();
    expect(change).not.toHaveBeenCalled();
  } finally {
    vi.unstubAllGlobals();
  }
});

it('keeps the keyboard reading visible after scrolling its cell into view', () => {
  const {container} = render(
    <Heatmap {...common} data={data} interaction={{onActivate: () => {}}} />,
  );
  const canvas = container.querySelector('[data-wcl-heatmap-canvas]')!;
  fireEvent.focus(canvas);
  fireEvent.keyDown(canvas, {key: 'End', ctrlKey: true});
  fireEvent.scroll(container.querySelector('[data-wcl-heatmap-frame]')!);
  expect(screen.getByRole('tooltip').textContent).toContain('20 °C');
  expect(cell(container, 3).hasAttribute('data-active')).toBe(true);
});

it('shows selection details on demand in controls mode and returns focus after clearing', () => {
  const {container} = render(
    <Heatmap
      {...common}
      data={data}
      interaction={{
        selection: {
          labels,
          presentation: 'controls',
          defaultSelectedItems: [{rowId: 'north', columnId: 'morning'}],
        },
      }}
    />,
  );
  const controls = container.querySelector<HTMLElement>(
    '[data-wcl-chart-selection][data-presentation="controls"]',
  )!;
  const ui = within(controls);
  expect(controls).toBeTruthy();
  expect(
    container.querySelector('[data-wcl-chart-selection][data-presentation="panel"]'),
  ).toBeNull();
  expect(ui.queryByRole('list')).toBeNull();
  const disclosure = container.querySelector('summary')!;
  fireEvent.click(disclosure);
  expect(ui.getByRole('list')).toBeTruthy();
  fireEvent.keyDown(disclosure, {key: 'Escape'});
  expect(ui.queryByRole('list')).toBeNull();
  fireEvent.click(ui.getByRole('button', {name: labels.clear}));
  expect(ui.getByRole('status').textContent).toBe(labels.empty);
  expect(document.activeElement).toBe(container.querySelector('[data-wcl-chart-canvas]'));
});
