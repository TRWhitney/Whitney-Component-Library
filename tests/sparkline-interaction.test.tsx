import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, beforeEach, expect, it, vi} from 'vitest';
import {
  Sparkline,
  type SparklineActivation,
  type SparklineProps,
  type SparklineSelectionItem,
} from '../src/index.js';

const data = [
  {id: 'a', at: 0, value: 0},
  {id: 'gap', at: 1, value: null},
  {id: 'c', at: 2, value: 5},
  {id: 'd', at: 3, value: 10},
];
type Datum = (typeof data)[number];
const common: SparklineProps<Datum, number> = {
  data,
  title: 'Demand',
  description: 'Recorded demand over time.',
  dataTableLabel: 'Readings',
  emptyState: {title: 'Empty', description: 'Add readings.'},
  invalidData: {title: 'Invalid', description: 'Correct readings.'},
  labels: {first: 'First', last: 'Last', lowest: 'Lowest', highest: 'Highest', missing: 'Missing'},
  position: {accessor: 'at', label: 'Time', scale: {type: 'linear', domain: [0, 3]}},
  value: {accessor: 'value', label: 'Value'},
  valueRange: [0, 10],
};
const labels = {
  instructions: 'Select readings or activate details.',
  clear: 'Clear selection',
  empty: 'None',
  summary: (n: number) => `${n} selected`,
  item: (item: SparklineSelectionItem) => item.rowId,
  hidden: (s: string) => s,
};
const getRowId = (d: Datum) => d.id;
function pointer(
  svg: Element,
  type: 'pointerDown' | 'pointerMove' | 'pointerUp',
  index: number,
  extra = {},
) {
  fireEvent[type](svg, {
    clientX: 12 + (index * 616) / 3,
    clientY: 80,
    pointerId: 1,
    pointerType: 'mouse',
    button: 0,
    isPrimary: true,
    ...extra,
  });
}
function click(svg: Element, index: number, extra = {}) {
  pointer(svg, 'pointerDown', index, extra);
  pointer(svg, 'pointerUp', index, extra);
}
beforeEach(() => {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 640, 160));
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

it('selects zero and activates its original record independently, while gaps remain readable only', () => {
  const onActivate = vi.fn<(event: SparklineActivation<Datum, number>) => void>(),
    onSelectionChange = vi.fn();
  const {container} = render(
    <Sparkline
      {...common}
      interaction={{getRowId, onActivate, selection: {labels, onSelectionChange}}}
    />,
  );
  const svg = container.querySelector('[data-wcl-sparkline-svg]')!;
  click(svg, 0);
  expect(onSelectionChange).toHaveBeenLastCalledWith([{rowId: 'a'}]);
  click(svg, 0, {ctrlKey: true});
  expect(onActivate).toHaveBeenLastCalledWith({
    item: {rowId: 'a'},
    datum: data[0],
    position: 0,
    value: 0,
    input: 'pointer',
  });
  expect(onActivate.mock.calls[0]![0].datum).toBe(data[0]);
  expect(onSelectionChange).toHaveBeenCalledTimes(1);
  click(svg, 1);
  click(svg, 1, {ctrlKey: true});
  expect(screen.getByRole('tooltip').textContent).toContain('Missing');
  expect(onSelectionChange).toHaveBeenCalledTimes(1);
  expect(onActivate).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole('button', {name: labels.clear}));
  expect(onSelectionChange).toHaveBeenLastCalledWith([]);
});
it('supports keyboard selection, independent activation and activation without selection', () => {
  const onActivate = vi.fn<(event: SparklineActivation<Datum, number>) => void>(),
    onSelectionChange = vi.fn();
  const {container, rerender} = render(
    <Sparkline
      {...common}
      interaction={{getRowId, onActivate, selection: {labels, onSelectionChange}}}
    />,
  );
  const canvas = container.querySelector('[data-wcl-sparkline-canvas]')!;
  fireEvent.focus(canvas);
  fireEvent.keyDown(canvas, {key: 'End'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(onSelectionChange).toHaveBeenLastCalledWith([{rowId: 'd'}]);
  fireEvent.keyDown(canvas, {key: ' ', metaKey: true});
  expect(onActivate).toHaveBeenLastCalledWith(
    expect.objectContaining({item: {rowId: 'd'}, input: 'keyboard'}),
  );
  expect(onSelectionChange).toHaveBeenCalledTimes(1);
  rerender(<Sparkline {...common} interaction={{getRowId, onActivate}} />);
  click(container.querySelector('[data-wcl-sparkline-svg]')!, 2);
  expect(onActivate).toHaveBeenLastCalledWith(
    expect.objectContaining({item: {rowId: 'c'}, input: 'pointer'}),
  );
});
it('previews and commits horizontal ranges with addition, removal and Escape cancellation', () => {
  const onSelectionChange = vi.fn();
  const {container} = render(
    <Sparkline {...common} interaction={{getRowId, selection: {labels, onSelectionChange}}} />,
  );
  const svg = container.querySelector('[data-wcl-sparkline-svg]')!;
  pointer(svg, 'pointerDown', 0);
  pointer(svg, 'pointerMove', 2);
  expect(container.querySelector('[data-wcl-chart-selection-box]')).toBeTruthy();
  pointer(svg, 'pointerUp', 2);
  expect(onSelectionChange).toHaveBeenLastCalledWith([{rowId: 'a'}, {rowId: 'c'}]);
  pointer(svg, 'pointerDown', 2, {shiftKey: true});
  pointer(svg, 'pointerMove', 3);
  pointer(svg, 'pointerUp', 3);
  expect(onSelectionChange).toHaveBeenLastCalledWith([{rowId: 'a'}, {rowId: 'c'}, {rowId: 'd'}]);
  pointer(svg, 'pointerDown', 0, {altKey: true});
  pointer(svg, 'pointerMove', 2);
  pointer(svg, 'pointerUp', 2);
  expect(onSelectionChange).toHaveBeenLastCalledWith([{rowId: 'd'}]);
  pointer(svg, 'pointerDown', 0);
  pointer(svg, 'pointerMove', 3);
  fireEvent.keyDown(container.querySelector('[data-wcl-sparkline-canvas]')!, {key: 'Escape'});
  pointer(svg, 'pointerUp', 3);
  expect(onSelectionChange).toHaveBeenCalledTimes(3);
  expect(screen.getByText('1 selected')).toBeTruthy();
});
it('touch hold activates once without changing selection and cancels when data changes', () => {
  vi.useFakeTimers();
  const onActivate = vi.fn<(event: SparklineActivation<Datum, number>) => void>(),
    onSelectionChange = vi.fn();
  const interaction = {getRowId, onActivate, selection: {labels, onSelectionChange}};
  const {container, rerender} = render(<Sparkline {...common} interaction={interaction} />);
  const svg = container.querySelector('[data-wcl-sparkline-svg]')!;
  pointer(svg, 'pointerDown', 2, {pointerType: 'touch'});
  act(() => {
    vi.advanceTimersByTime(510);
  });
  pointer(svg, 'pointerUp', 2, {pointerType: 'touch'});
  expect(onActivate).toHaveBeenCalledTimes(1);
  expect(onActivate).toHaveBeenLastCalledWith(
    expect.objectContaining({item: {rowId: 'c'}, input: 'touch'}),
  );
  expect(onSelectionChange).not.toHaveBeenCalled();
  act(() => {
    vi.advanceTimersByTime(660);
  });
  expect(container.querySelector('[data-wcl-chart-activation-dot]')).toBeNull();
  pointer(svg, 'pointerDown', 3, {pointerType: 'touch'});
  rerender(<Sparkline {...common} data={[...data]} interaction={interaction} />);
  act(() => {
    vi.advanceTimersByTime(510);
  });
  expect(onActivate).toHaveBeenCalledTimes(1);
});
it('retains selection by ID across reordering and prunes missing or removed readings', () => {
  const interaction = {getRowId, selection: {labels, defaultSelectedItems: [{rowId: 'c'}]}};
  const {rerender} = render(<Sparkline {...common} interaction={interaction} />);
  expect(screen.getByText('1 selected')).toBeTruthy();
  rerender(
    <Sparkline {...common} data={[data[2]!, data[0]!, data[3]!]} interaction={interaction} />,
  );
  expect(screen.getByText('1 selected')).toBeTruthy();
  rerender(
    <Sparkline
      {...common}
      data={[{...data[2]!, value: null}, data[3]!]}
      interaction={interaction}
    />,
  );
  expect(screen.getByText('None')).toBeTruthy();
  rerender(<Sparkline {...common} interaction={interaction} />);
  expect(screen.getByText('None')).toBeTruthy();
});
it('rejects empty and duplicate interactive IDs', () => {
  expect(() => render(<Sparkline {...common} interaction={{getRowId: () => ''}} />)).toThrow(
    /unique nonempty/,
  );
  expect(() => render(<Sparkline {...common} interaction={{getRowId: () => 'same'}} />)).toThrow(
    /unique nonempty/,
  );
});

it('keeps selection controlled and does not transfer removed IDs to replacement records', () => {
  const onSelectionChange = vi.fn();
  const interaction = {
    getRowId,
    selection: {labels, selectedItems: [{rowId: 'c'}], onSelectionChange},
  };
  const {container, rerender} = render(<Sparkline {...common} interaction={interaction} />);
  click(container.querySelector('[data-wcl-sparkline-svg]')!, 0);
  expect(onSelectionChange).toHaveBeenLastCalledWith([{rowId: 'c'}, {rowId: 'a'}]);
  expect(screen.getByText('1 selected')).toBeTruthy();
  rerender(
    <Sparkline
      {...common}
      data={data.map((d) => (d.id === 'c' ? {...d, id: 'replacement'} : d))}
      interaction={interaction}
    />,
  );
  expect(screen.getByText('None')).toBeTruthy();
});
it('cancels pending ranges on pointer cancellation, status and domain changes', () => {
  const onSelectionChange = vi.fn();
  const interaction = {getRowId, selection: {labels, onSelectionChange}};
  const {container, rerender} = render(<Sparkline {...common} interaction={interaction} />);
  const svg = container.querySelector('[data-wcl-sparkline-svg]')!;
  pointer(svg, 'pointerDown', 0);
  pointer(svg, 'pointerMove', 3);
  fireEvent.pointerCancel(svg, {pointerId: 1});
  pointer(svg, 'pointerUp', 3);
  expect(onSelectionChange).not.toHaveBeenCalled();
  pointer(svg, 'pointerDown', 0);
  pointer(svg, 'pointerMove', 3);
  rerender(<Sparkline {...common} valueRange={[0, 20]} interaction={interaction} />);
  expect(container.querySelector('[data-wcl-chart-selection-box]')).toBeNull();
  pointer(svg, 'pointerUp', 3);
  expect(onSelectionChange).not.toHaveBeenCalled();
  pointer(svg, 'pointerDown', 0);
  pointer(svg, 'pointerMove', 3);
  rerender(
    <Sparkline
      {...common}
      interaction={interaction}
      status={{kind: 'loading', label: 'Loading readings'}}
    />,
  );
  expect(container.querySelector('[data-wcl-sparkline-svg]')).toBeNull();
  expect(onSelectionChange).not.toHaveBeenCalled();
});
it('pointer focus keeps the clicked reading and never restores the first reading after leaving', () => {
  const {container} = render(
    <Sparkline {...common} interaction={{getRowId, selection: {labels}}} />,
  );
  const svg = container.querySelector('[data-wcl-sparkline-svg]')!;
  click(svg, 2);
  expect(document.activeElement).toBe(container.querySelector('[data-wcl-sparkline-canvas]'));
  expect(screen.getByRole('tooltip').textContent).toContain('5');
  fireEvent.pointerLeave(svg, {pointerType: 'mouse'});
  expect(screen.queryByRole('tooltip')).toBeNull();
});
it('preserves extreme and current cues with adjoining selection rings and a finite activation pulse', () => {
  vi.useFakeTimers();
  const {container} = render(
    <Sparkline
      {...common}
      interaction={{
        getRowId,
        onActivate: () => {},
        selection: {labels, defaultSelectedItems: [{rowId: 'a'}, {rowId: 'd'}]},
      }}
    />,
  );
  const canvas = container.querySelector('[data-wcl-sparkline-canvas]')!;
  expect(
    container.querySelector(
      '[data-wcl-sparkline-cue="lowest"] [data-wcl-sparkline-cue-fill="bottom"]',
    ),
  ).toBeTruthy();
  expect(
    container.querySelector('[data-wcl-sparkline-cue="current"] [data-wcl-sparkline-cue-fill]'),
  ).toBeNull();
  const ring = container.querySelector('[data-row-id="a"] circle')!;
  const normal = container.querySelector(
    '[data-wcl-sparkline-cue="lowest"] [data-wcl-sparkline-cue-outline]',
  )!;
  expect(
    (Number(ring.getAttribute('r')) - Number(normal.getAttribute('r'))) * (48 / 160),
  ).toBeCloseTo(2.125);
  fireEvent.focus(canvas);
  fireEvent.keyDown(canvas, {key: 'Enter', ctrlKey: true});
  expect(container.querySelector('[data-wcl-chart-activation-dot]')).toBeTruthy();
  act(() => {
    vi.advanceTimersByTime(660);
  });
  expect(container.querySelector('[data-wcl-chart-activation-dot]')).toBeNull();
});
it('keyboard can distinguish records at duplicate positions and callbacks retain source records after invalid rows', () => {
  const onActivate = vi.fn<(event: SparklineActivation<Datum, number>) => void>();
  const records = [
    {id: 'invalid', at: NaN, value: 1},
    {id: 'one', at: 1, value: 2},
    {id: 'two', at: 1, value: 2},
  ];
  const {container} = render(
    <Sparkline {...common} data={records} interaction={{getRowId, onActivate}} />,
  );
  const canvas = container.querySelector('[data-wcl-sparkline-canvas]')!;
  fireEvent.focus(canvas);
  fireEvent.keyDown(canvas, {key: 'End'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(onActivate).toHaveBeenLastCalledWith(
    expect.objectContaining({item: {rowId: 'two'}, datum: records[2], position: 1, value: 2}),
  );
  expect(onActivate.mock.calls[0]![0].datum).toBe(records[2]);
});
