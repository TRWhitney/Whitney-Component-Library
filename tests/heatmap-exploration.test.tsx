import {cleanup, fireEvent, render, screen, within, waitFor} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {Heatmap, type HeatmapSelectionItem, type ChartRectangularWindow} from '../src/index.js';
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
const explorationLabels = {
  overview: 'Overview',
  closeOverview: 'Close overview',
  done: 'Done',
  reset: 'Reset view',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  panLeft: 'Left',
  panRight: 'Right',
  panUp: 'Up',
  panDown: 'Down',
  window: 'Visible cells',
  instructions: 'Move the area or resize a corner.',
  corner: (corner: string) => `Resize ${corner}`,
  range: (window: {x: readonly string[]; y: readonly string[]}) =>
    `${window.x.join(' to ')} / ${window.y.join(' to ')}`,
};
it('windows complete cell identities while retaining missing cells and complete data', () => {
  const {container} = render(
    <Heatmap
      {...common}
      exploration={{labels: explorationLabels, defaultWindow: {x: ['x', 'x'], y: ['a', 'b']}}}
    />,
  );
  expect(container.querySelectorAll('[data-wcl-heatmap-cell]')).toHaveLength(2);
  expect(within(screen.getByRole('table')).getByText('20')).toBeTruthy();
  press('Overview');
  expect(screen.getByRole('dialog')).toBeTruthy();
});
it('changes ordered row and column windows with a single callback', () => {
  const changed = vi.fn<(window: ChartRectangularWindow<string, string>) => void>();
  const ended = vi.fn();
  render(
    <Heatmap
      {...common}
      exploration={{labels: explorationLabels, onWindowChange: changed, onWindowChangeEnd: ended}}
    />,
  );
  press('Zoom in');
  expect(changed).toHaveBeenCalledTimes(1);
  expect(ended).toHaveBeenCalledTimes(1);
  expect(changed.mock.lastCall![0].x[0]).toBe(changed.mock.lastCall![0].x[1]);
  expect(changed.mock.lastCall![0].y[0]).toBe(changed.mock.lastCall![0].y[1]);
});
it('retains selection outside a window and restores a hidden row from outside it', () => {
  const {container} = render(
    <Heatmap
      {...common}
      exploration={{labels: explorationLabels}}
      interaction={{selection: {labels, defaultSelectedItems: [{rowId: 'a', columnId: 'x'}]}}}
    />,
  );
  press('Hide row North');
  press('Zoom in');
  expect(container.querySelector('[data-wcl-chart-selection]')?.textContent).toContain(
    '1 selected',
  );
  press('Restore 1 hidden dimensions');
  press('Show row North');
  expect(within(screen.getByRole('table')).getByRole('rowheader', {name: 'North'})).toBeTruthy();
});

it('keeps the exploration frame and controls while every row is hidden', () => {
  const {container} = render(<Heatmap {...common} exploration={{labels: explorationLabels}} />);
  press('Hide row North');
  press('Hide row South');
  expect(container.querySelector('[data-wcl-heatmap-frame]')).not.toBeNull();
  expect(screen.getByRole('button', {name: 'Overview'})).toBeTruthy();
  press('Show all');
  expect(container.querySelectorAll('[data-wcl-heatmap-cell]')).toHaveLength(4);
});

it('keeps the color domain independent of the cell window and shows the full unhidden overview', () => {
  const {container} = render(
    <Heatmap
      {...common}
      exploration={{labels: explorationLabels, defaultWindow: {x: ['x', 'x'], y: ['a', 'a']}}}
    />,
  );
  expect(container.querySelector('[data-wcl-heatmap-key-numeric]')?.textContent).toBe('020');
  expect(container.querySelector('[data-wcl-heatmap-cell]')?.getAttribute('data-scale-ratio')).toBe(
    '0.0000',
  );
  press('Overview');
  expect(
    screen.getByRole('dialog').querySelectorAll('[data-wcl-heatmap-overview-cell]'),
  ).toHaveLength(4);
  press('Done');
  expect(container.querySelectorAll('[data-wcl-heatmap-cell]')).toHaveLength(1);
});

it('cancels selection and hold activation when a second touch starts exploration', () => {
  vi.useFakeTimers();
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const index = this.getAttribute('data-cell-index');
    return index === null
      ? new DOMRect(0, 0, 300, 180)
      : new DOMRect(60 + (+index % 2) * 104, 30 + Math.floor(+index / 2) * 54, 100, 50);
  });
  const selected = vi.fn(),
    activated = vi.fn(),
    changed = vi.fn();
  const {container} = render(
    <Heatmap
      {...common}
      exploration={{labels: explorationLabels, onWindowChange: changed}}
      interaction={{selection: {labels, onSelectionChange: selected}, onActivate: activated}}
    />,
  );
  const canvas = container.querySelector('[data-wcl-heatmap-canvas]')!;
  const cell = container.querySelector('[data-cell-index="0"]')!;
  const first = {
    pointerType: 'touch',
    pointerId: 1,
    isPrimary: true,
    button: 0,
    clientX: 90,
    clientY: 50,
  };
  const second = {...first, pointerId: 2, isPrimary: false, clientX: 170, clientY: 90};
  fireEvent.pointerDown(cell, first);
  fireEvent.pointerDown(canvas, second);
  fireEvent.pointerMove(canvas, {...second, clientX: 260, clientY: 140});
  vi.advanceTimersByTime(700);
  fireEvent.pointerUp(canvas, first);
  fireEvent.pointerUp(canvas, {...second, clientX: 260, clientY: 140});
  expect(changed).toHaveBeenCalled();
  expect(selected).not.toHaveBeenCalled();
  expect(activated).not.toHaveBeenCalled();
  expect(fireEvent.wheel(canvas, {deltaY: 100, ctrlKey: true})).toBe(true);
});

it('selects and activates missing and zero cells using source identities after panning', () => {
  const selected = vi.fn(),
    activated = vi.fn();
  const {container} = render(
    <Heatmap
      {...common}
      exploration={{labels: explorationLabels, defaultWindow: {x: ['y', 'y'], y: ['a', 'a']}}}
      interaction={{selection: {labels, onSelectionChange: selected}, onActivate: activated}}
    />,
  );
  const canvas = container.querySelector('[data-wcl-heatmap-canvas]')!;
  fireEvent.focus(canvas);
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(selected).toHaveBeenLastCalledWith([{rowId: 'a', columnId: 'y'}]);
  fireEvent.keyDown(canvas, {key: 'Enter', ctrlKey: true});
  expect(activated).toHaveBeenLastCalledWith(
    expect.objectContaining({
      item: {rowId: 'a', columnId: 'y'},
      value: undefined,
      datum: undefined,
    }),
  );
  press('Left');
  fireEvent.focus(canvas);
  fireEvent.keyDown(canvas, {key: 'Enter', metaKey: true});
  expect(activated).toHaveBeenLastCalledWith(
    expect.objectContaining({item: {rowId: 'a', columnId: 'x'}, value: 0, datum: data[0]}),
  );
  expect(container.querySelector('[data-wcl-chart-selection]')?.textContent).toContain(
    'a/y hidden',
  );
});

it('resizes a snapped corner with the keyboard and retains it after closing Overview', () => {
  const changed = vi.fn(),
    ended = vi.fn();
  const {container} = render(
    <Heatmap
      {...common}
      exploration={{labels: explorationLabels, onWindowChange: changed, onWindowChangeEnd: ended}}
    />,
  );
  press('Overview');
  fireEvent.keyDown(screen.getByRole('button', {name: 'Resize top-left'}), {key: 'ArrowRight'});
  expect(changed).toHaveBeenLastCalledWith({x: ['y', 'y'], y: ['a', 'b']});
  expect(ended).toHaveBeenLastCalledWith({x: ['y', 'y'], y: ['a', 'b']});
  press('Done');
  expect(container.querySelectorAll('[data-wcl-heatmap-cell]')).toHaveLength(2);
  press('Overview');
  expect(screen.getByRole('group', {name: 'Visible cells: y to y / a to b'})).toBeTruthy();
});

it('retains surviving window cells when source tracks are removed', () => {
  const exploration = {
    labels: explorationLabels,
    defaultWindow: {x: ['x', 'y'], y: ['a', 'a']},
  } as const;
  const {container, rerender} = render(<Heatmap {...common} exploration={exploration} />);
  rerender(
    <Heatmap {...common} rows={[common.rows[1]]} data={[data[1]!]} exploration={exploration} />,
  );
  expect(container.querySelectorAll('[data-wcl-heatmap-cell]')).toHaveLength(2);
});

it('keeps real domain labels when every row is hidden', () => {
  const {container} = render(<Heatmap {...common} exploration={{labels: explorationLabels}} />);
  press('Hide row North');
  press('Hide row South');
  expect(container.querySelector('[data-wcl-chart-exploration-range]')?.textContent).toContain(
    'a to b',
  );
});

it('moves the overview by two whole tracks with Shift', () => {
  const changed = vi.fn<(window: ChartRectangularWindow<string, string>) => void>();
  render(
    <Heatmap
      {...common}
      rows={['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({id, label: id}))}
      exploration={{
        labels: explorationLabels,
        defaultWindow: {x: ['x', 'y'], y: ['a', 'a']},
        onWindowChange: changed,
      }}
    />,
  );
  press('Overview');
  fireEvent.keyDown(screen.getByRole('group', {name: /Visible cells:/}), {
    key: 'ArrowDown',
    shiftKey: true,
  });
  expect(changed.mock.lastCall![0].y).toEqual(['c', 'c']);
});

it('manages crowded axes without restricting the full heatmap window', async () => {
  const rows = Array.from({length: 24}, (_, index) => ({id: `r${index}`, label: `R${index}`}));
  const columns = Array.from({length: 24}, (_, index) => ({id: `c${index}`, label: `C${index}`}));
  const {container} = render(
    <Heatmap
      {...common}
      rows={rows}
      columns={columns}
      data={rows.flatMap((row) =>
        columns.map((column) => ({row: row.id, column: column.id, value: 20})),
      )}
      minimumSize={{width: 320, height: 300}}
      visibilityLabels={{...visibilityLabels, manage: 'Manage visibility'}}
      exploration={{labels: explorationLabels}}
    />,
  );
  expect(container.querySelectorAll('[data-wcl-heatmap-cell]')).toHaveLength(576);
  expect(screen.queryByRole('button', {name: 'Hide column C0'})).toBeNull();
  const manager = screen.getByRole('button', {name: 'Manage visibility'});
  manager.focus();
  fireEvent.click(manager);
  const dialog = await screen.findByRole('dialog', {name: 'Manage visibility'});
  const firstColumn = within(dialog).getByRole('button', {name: 'Hide column C0'});
  firstColumn.focus();
  fireEvent.click(firstColumn);
  expect(document.activeElement).toBe(firstColumn);
  expect(container.querySelectorAll('[data-wcl-heatmap-cell]')).toHaveLength(552);
  expect(within(dialog).getByRole('button', {name: 'Show column C0'})).toBeTruthy();
  fireEvent.click(within(dialog).getByRole('button', {name: 'Hide row R0'}));
  expect(container.querySelectorAll('[data-wcl-heatmap-cell]')).toHaveLength(529);
  fireEvent.click(within(dialog).getByRole('button', {name: 'Show column C0'}));
  fireEvent.click(within(dialog).getByRole('button', {name: 'Show row R0'}));
  expect(container.querySelectorAll('[data-wcl-heatmap-cell]')).toHaveLength(576);
  expect(
    container.querySelector('[data-wcl-chart-table]')!.querySelectorAll('tbody td'),
  ).toHaveLength(576);
  expect(screen.getByRole('dialog', {name: 'Manage visibility'})).toBeTruthy();
  fireEvent.click(within(dialog).getByRole('button', {name: 'Close restore list'}));
  await waitFor(() => expect(document.activeElement).toBe(manager));
});

it('pans focused cells to domain limits with a captured middle-button drag', () => {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 300, 180));
  const changed = vi.fn(),
    completed = vi.fn(),
    activated = vi.fn();
  const {container} = render(
    <Heatmap
      {...common}
      rows={[...common.rows, {id: 'c', label: 'East'}, {id: 'd', label: 'West'}]}
      columns={[...common.columns, {id: 'z', label: 'Night'}, {id: 'w', label: 'Dawn'}]}
      exploration={{
        labels: explorationLabels,
        defaultWindow: {x: ['x', 'x'], y: ['a', 'a']},
        onWindowChange: changed,
        onWindowChangeEnd: completed,
      }}
      interaction={{onActivate: activated}}
    />,
  );
  const canvas = container.querySelector<HTMLElement>('[data-wcl-heatmap-canvas]')!;
  canvas.focus();
  const pointer = {
    pointerType: 'mouse',
    pointerId: 1,
    button: 1,
    buttons: 4,
    clientX: 150,
    clientY: 90,
  };
  fireEvent.pointerDown(canvas, pointer);
  fireEvent.pointerMove(canvas, {...pointer, clientX: -1000, clientY: -1000});
  expect(changed.mock.lastCall![0]).toEqual({x: ['w', 'w'], y: ['d', 'd']});
  fireEvent.pointerUp(canvas, {...pointer, buttons: 0});
  expect(completed).toHaveBeenCalledOnce();
  expect(activated).not.toHaveBeenCalled();
});
