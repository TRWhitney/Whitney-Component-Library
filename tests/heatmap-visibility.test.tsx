import {useState} from 'react';
import {act, cleanup, fireEvent, render, screen, within, waitFor} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {Heatmap, type HeatmapSelectionItem} from '../src/index.js';
const data = [
  {row: 'a', column: 'x', value: 0},
  {row: 'b', column: 'y', value: 20},
];
const visibilityLabels = {
  hideRow: (s: string) => `Hide row ${s}`,
  showRow: (s: string) => `Show row ${s}`,
  hideColumn: (s: string) => `Hide column ${s}`,
  showColumn: (s: string) => `Show column ${s}`,
  restore: (n: number) => `Restore ${n} hidden dimensions`,
  hiddenRows: 'Hidden rows',
  hiddenColumns: 'Hidden columns',
  hidden: 'Hidden',
  showAll: 'Show all',
  close: 'Close restore list',
  allHidden: {title: 'No visible cells', description: 'Restore a row or column.'},
};
const common = {
  data,
  rows: [
    {id: 'a', label: 'North'},
    {id: 'b', label: 'South'},
  ],
  columns: [
    {id: 'x', label: 'Morning'},
    {id: 'y', label: 'Evening'},
  ],
  rowAccessor: 'row',
  columnAccessor: 'column',
  value: {accessor: 'value', label: 'Temperature'},
  title: 'Temperatures',
  description: 'Room readings',
  dataTableLabel: 'Readings',
  scale: {type: 'sequential', color: '#2878ff'},
  labels: {
    row: 'Room',
    column: 'Time',
    missing: 'Missing',
    colorKey: 'Scale',
    scrollRegion: 'Grid',
  },
  emptyState: {title: 'Empty', description: 'Supply dimensions'},
  invalidData: {title: 'Invalid', description: 'Fix readings'},
  visibilityLabels,
} as const;
const labels = {
  instructions: 'Select cells',
  clear: 'Clear selection',
  empty: 'None',
  summary: (n: number) => `${n} selected`,
  item: (item: HeatmapSelectionItem) => `${item.rowId}/${item.columnId}`,
  hidden: (s: string) => `${s} hidden`,
};
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});
const press = (name: string) => fireEvent.click(screen.getByRole('button', {name}));
it('removes full tracks, refits values, and restores from the corner while retaining full readings', async () => {
  const {container} = render(<Heatmap {...common} />);
  press('Hide row South');
  await waitFor(() =>
    expect(
      within(container.querySelector<HTMLElement>('[data-wcl-heatmap-key-numeric]')!).getAllByText(
        '0',
      ),
    ).toHaveLength(2),
  );
  expect(container.querySelectorAll('[data-wcl-heatmap-row]')).toHaveLength(1);
  expect(container.querySelectorAll('[data-wcl-heatmap-cell]')).toHaveLength(2);
  expect(screen.getByRole('rowheader', {name: 'South (Hidden)'})).toBeTruthy();
  expect(within(screen.getByRole('table')).getByText('20')).toBeTruthy();
  press('Hide column Evening');
  expect(container.querySelectorAll('[data-wcl-heatmap-cell]')).toHaveLength(1);
  expect(screen.getByRole('columnheader', {name: 'Evening (Hidden)'})).toBeTruthy();
  press('Restore 2 hidden dimensions');
  press('Show row South');
  press('Show column Evening');
  expect(container.querySelectorAll('[data-wcl-heatmap-cell]')).toHaveLength(4);
});
it('retains hidden selection and supports all-hidden recovery and clearing', () => {
  const change = vi.fn();
  const {container} = render(
    <Heatmap
      {...common}
      interaction={{
        selection: {
          labels,
          defaultSelectedItems: [{rowId: 'a', columnId: 'x'}],
          onSelectionChange: change,
        },
      }}
    />,
  );
  press('Hide row North');
  expect(screen.getByText('a/x hidden')).toBeTruthy();
  press('Hide row South');
  expect(container.querySelectorAll('[data-wcl-heatmap-cell]')).toHaveLength(0);
  expect(screen.getByText('No visible cells')).toBeTruthy();
  expect(change).not.toHaveBeenCalled();
  press('Show all');
  expect(document.activeElement).toBe(screen.getByRole('button', {name: 'Hide row North'}));
  expect(container.querySelector('[data-selected]')).toBeTruthy();
  press('Hide column Morning');
  press('Clear selection');
  expect(change).toHaveBeenLastCalledWith([]);
});
it('retains hidden IDs on reorder and value changes, prunes removals, and resets when disabled', () => {
  const {container, rerender} = render(<Heatmap {...common} />);
  press('Hide row North');
  rerender(
    <Heatmap
      {...common}
      rows={[...common.rows].reverse()}
      data={[{...data[0]!, value: 10}, data[1]!]}
    />,
  );
  expect(container.querySelectorAll('[data-wcl-heatmap-cell]')).toHaveLength(2);
  rerender(<Heatmap {...common} rows={[common.rows[1]]} data={[data[1]!]} />);
  rerender(<Heatmap {...common} />);
  expect(container.querySelectorAll('[data-wcl-heatmap-cell]')).toHaveLength(4);
  press('Hide column Morning');
  const {visibilityLabels: omitted, ...withoutVisibility} = common;
  void omitted;
  rerender(<Heatmap {...withoutVisibility} />);
  expect(container.querySelectorAll('[data-wcl-heatmap-cell]')).toHaveLength(4);
  rerender(<Heatmap {...common} />);
  expect(screen.queryByRole('button', {name: /Restore/})).toBeNull();
});
it('validates hidden source records and preserves explicit scale bounds', () => {
  const {container, rerender} = render(
    <Heatmap {...common} scale={{type: 'sequential', color: '#2878ff', domain: [-10, 30]}} />,
  );
  press('Hide row South');
  const key = container.querySelector('[data-wcl-heatmap-key]')!;
  expect(key.textContent).toContain('-10');
  expect(key.textContent).toContain('30');
  rerender(<Heatmap {...common} data={[data[0]!, {...data[1]!, value: NaN}]} />);
  expect(screen.getByText('Invalid')).toBeTruthy();
});
it('uses visible keyboard coordinates and original source indices for callback records', () => {
  const onActivate = vi.fn();
  const {container} = render(
    <Heatmap
      {...common}
      value={{accessor: (d, i) => d.value + i, label: 'Indexed'}}
      interaction={{onActivate}}
    />,
  );
  press('Hide row North');
  press('Hide column Morning');
  const canvas = container.querySelector('[data-wcl-heatmap-canvas]')!;
  fireEvent.focus(canvas);
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(onActivate).toHaveBeenLastCalledWith(
    expect.objectContaining({
      item: {rowId: 'b', columnId: 'y'},
      datum: data[1],
      value: 21,
      input: 'keyboard',
    }),
  );
});

function mockCells() {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const index = this.getAttribute('data-cell-index');
    return index === null
      ? new DOMRect(0, 0, 300, 180)
      : new DOMRect(60 + (+index % 2) * 104, 64 + Math.floor(+index / 2) * 54, 100, 50);
  });
}
function pointerCell(
  container: HTMLElement,
  type: 'pointerDown' | 'pointerUp' | 'pointerMove',
  index: number,
  pointerType = 'touch',
) {
  const cell = container.querySelector(`[data-cell-index="${index}"]`)!;
  const bounds = cell.getBoundingClientRect();
  fireEvent[type](cell, {
    clientX: bounds.x + bounds.width / 2,
    clientY: bounds.y + bounds.height / 2,
    pointerId: 1,
    pointerType,
    button: 0,
    isPrimary: true,
  });
}
it('animates first and repeated touch holds when details update and leaves selection unchanged', () => {
  vi.useFakeTimers();
  mockCells();
  const change = vi.fn(),
    activated = vi.fn();
  function Example() {
    const [details, setDetails] = useState('');
    return (
      <>
        <Heatmap
          {...common}
          interaction={{
            selection: {labels, onSelectionChange: change},
            onActivate: (event) => {
              activated(event);
              setDetails(`${event.item.rowId}/${event.item.columnId}`);
            },
          }}
        />
        <output>{details}</output>
      </>
    );
  }
  const {container} = render(<Example />);
  for (const index of [0, 0, 1]) {
    pointerCell(container, 'pointerDown', index);
    act(() => {
      vi.advanceTimersByTime(510);
    });
    expect(container.querySelector('[data-wcl-chart-activation-outline]')).toBeTruthy();
    pointerCell(container, 'pointerUp', index);
    act(() => {
      vi.advanceTimersByTime(660);
    });
  }
  expect(activated).toHaveBeenCalledTimes(3);
  expect(change).not.toHaveBeenCalled();
});
it('cancels pending holds and drags when dimensions are hidden', () => {
  vi.useFakeTimers();
  mockCells();
  const activated = vi.fn(),
    change = vi.fn();
  const {container} = render(
    <Heatmap
      {...common}
      interaction={{selection: {labels, onSelectionChange: change}, onActivate: activated}}
    />,
  );
  pointerCell(container, 'pointerDown', 0);
  press('Hide row North');
  act(() => {
    vi.advanceTimersByTime(510);
  });
  pointerCell(container, 'pointerUp', 0);
  expect(activated).not.toHaveBeenCalled();
  expect(change).not.toHaveBeenCalled();
  pointerCell(container, 'pointerDown', 0, 'mouse');
  pointerCell(container, 'pointerMove', 1, 'mouse');
  expect(container.querySelector('[data-wcl-chart-selection-box]')).toBeTruthy();
  press('Hide column Evening');
  expect(container.querySelector('[data-wcl-chart-selection-box]')).toBeNull();
  pointerCell(container, 'pointerUp', 0, 'mouse');
  expect(change).not.toHaveBeenCalled();
});
it('keeps hidden controlled selections during a new visible selection and restores their frames', () => {
  mockCells();
  const change = vi.fn();
  const selection = {
    labels,
    selectedItems: [{rowId: 'a', columnId: 'x'}],
    onSelectionChange: change,
  };
  const {container} = render(<Heatmap {...common} interaction={{selection}} />);
  press('Hide row North');
  pointerCell(container, 'pointerDown', 1, 'mouse');
  pointerCell(container, 'pointerUp', 1, 'mouse');
  expect(change).toHaveBeenLastCalledWith([
    {rowId: 'a', columnId: 'x'},
    {rowId: 'b', columnId: 'y'},
  ]);
  press('Restore 1 hidden dimensions');
  press('Show row North');
  expect(container.querySelector('[data-cell-index="0"][data-selected]')).toBeTruthy();
});
it('keeps a visible missing cell operable when all recorded values have been hidden', () => {
  const activate = vi.fn();
  const {container} = render(<Heatmap {...common} interaction={{onActivate: activate}} />);
  press('Hide row South');
  press('Hide column Morning');
  expect(container.querySelectorAll('[data-wcl-heatmap-cell]')).toHaveLength(1);
  expect(screen.queryByText('Invalid')).toBeNull();
  const canvas = container.querySelector('[data-wcl-heatmap-canvas]')!;
  fireEvent.focus(canvas);
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(activate).toHaveBeenLastCalledWith(
    expect.objectContaining({
      item: {rowId: 'a', columnId: 'y'},
      value: undefined,
      datum: undefined,
    }),
  );
});

it('reserves Room and the restore count before hiding short-named tracks', () => {
  const rows = Array.from({length: 8}, (_, i) => ({id: `r${i}`, label: `A${i + 1}`}));
  const columns = Array.from({length: 8}, (_, i) => ({id: `c${i}`, label: `${i}:00`}));
  const {container} = render(
    <Heatmap
      {...common}
      rows={rows}
      columns={columns}
      data={[{row: 'r0', column: 'c0', value: 1}]}
    />,
  );
  const labelWidth = () =>
    parseFloat(
      container
        .querySelector<HTMLElement>('[data-wcl-heatmap-frame]')!
        .style.getPropertyValue('--wcl-heatmap-row-label-width'),
    );
  const before = labelWidth();
  // The Room word, a closed eye with a two-digit count, gaps and padding fit in 100px.
  expect(before).toBeGreaterThanOrEqual(100);
  press('Hide row A2');
  expect(labelWidth()).toBe(before);
  expect(screen.getByRole('button', {name: 'Restore 1 hidden dimensions'})).toBeTruthy();
  expect(container.querySelector('[data-wcl-heatmap-corner] > span')?.textContent).toBe('Room');
});
