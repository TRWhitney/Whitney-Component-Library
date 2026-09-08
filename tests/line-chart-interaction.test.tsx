import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {renderToString} from 'react-dom/server';
import {hydrateRoot} from 'react-dom/client';
import {afterEach, expect, it, vi} from 'vitest';
import {LineChart, type LineChartInteraction, type ChartSelectionItem} from '../src/index.js';

const rows = [
  {id: 'jan', month: 'Jan', a: 20, b: 80},
  {id: 'feb', month: 'Feb', a: 40, b: 90},
  {id: 'mar', month: 'Mar', a: 60, b: 100},
];
type Row = (typeof rows)[number];
const labels = {
  instructions: 'Click selects. Control-click or hold activates.',
  clear: 'Clear selection',
  empty: 'Nothing selected',
  summary: (n: number) => `${n} selected`,
  item: (i: ChartSelectionItem) => `${i.rowId} ${i.seriesId ?? 'month'}`,
  hidden: (s: string) => `${s} hidden`,
};
const base = {
  legend: {label: 'Series'},
  title: 'Trend',
  description: 'Monthly data',
  dataTableLabel: 'All values',
  emptyState: {title: 'Empty', description: 'No values'},
  invalidData: {title: 'Invalid', description: 'Invalid values'},
  series: [
    {id: 'a', label: 'A', accessor: 'a', showPoints: true},
    {id: 'b', label: 'B', accessor: 'b', showPoints: true},
  ] as const,
  xAxis: {accessor: 'month', label: 'Month', scale: {type: 'categorical'}} as const,
  yAxis: {label: 'Value', scale: {type: 'linear', domain: [0, 120]}} as const,
};
const config = (
  extra: Partial<LineChartInteraction<Row, string>> = {},
): LineChartInteraction<Row, string> => ({target: 'point', getRowId: (r) => r.id, ...extra});
function example(interaction: LineChartInteraction<Row, string>, data = rows) {
  return <LineChart {...base} data={data} interaction={interaction} />;
}
function geometry(container: HTMLElement) {
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  Object.defineProperty(svg, 'getBoundingClientRect', {
    value: () => ({left: 0, top: 0, width: 640, height: 360, right: 640, bottom: 360}),
    configurable: true,
  });
  return svg;
}
function point(container: HTMLElement, index: number, series = 'a') {
  const p = container.querySelector(
    `[data-wcl-chart-point][data-row-index="${index}"][data-series="${series}"]`,
  )!;
  return {clientX: Number(p.getAttribute('cx')), clientY: Number(p.getAttribute('cy'))};
}
function click(svg: SVGSVGElement, at: {clientX: number; clientY: number}, extra = {}) {
  fireEvent.pointerDown(svg, {
    ...at,
    pointerId: 1,
    isPrimary: true,
    button: 0,
    pointerType: 'mouse',
    ...extra,
  });
  fireEvent.pointerUp(svg, {
    ...at,
    pointerId: 1,
    isPrimary: true,
    button: 0,
    pointerType: 'mouse',
    ...extra,
  });
}
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

it('activates the previewed point between series without adopting selection', () => {
  const onActivate = vi.fn();
  const {container} = render(example(config({onActivate})));
  const svg = geometry(container);
  const at = point(container, 1);
  const middle = {...at, clientY: at.clientY - 15};
  fireEvent.pointerMove(svg, {...middle, pointerType: 'mouse'});
  click(svg, middle);
  expect(onActivate).toHaveBeenCalledOnce();
  expect(onActivate.mock.calls[0]![0]).toMatchObject({
    item: {rowId: 'feb', seriesId: 'a'},
    datum: rows[1],
    category: 'Feb',
    input: 'pointer',
    values: [{seriesId: 'a', value: 40, hidden: false}],
  });
  expect(container.querySelectorAll('[data-wcl-chart-reading-node]')).toHaveLength(1);
});
it('separates click selection from modifier activation and retains selection after release', () => {
  const onActivate = vi.fn(),
    onSelectionChange = vi.fn();
  const {container} = render(example(config({onActivate, selection: {labels, onSelectionChange}})));
  const svg = geometry(container),
    at = point(container, 1);
  click(svg, at);
  expect(onActivate).not.toHaveBeenCalled();
  expect(onSelectionChange).toHaveBeenLastCalledWith([{rowId: 'feb', seriesId: 'a'}]);
  click(svg, at, {ctrlKey: true});
  expect(onActivate).toHaveBeenCalledOnce();
  expect(onSelectionChange).toHaveBeenCalledTimes(1);
  click(svg, at);
  expect(onSelectionChange).toHaveBeenLastCalledWith([]);
});
it('activates one category with its source series values', () => {
  const onActivate = vi.fn();
  const {container} = render(example(config({target: 'category', onActivate})));
  click(geometry(container), point(container, 1));
  expect(onActivate).toHaveBeenCalledOnce();
  expect(onActivate.mock.calls[0]![0]).toMatchObject({
    item: {rowId: 'feb'},
    category: 'Feb',
    values: [
      {seriesId: 'a', value: 40},
      {seriesId: 'b', value: 90},
    ],
  });
});
it('holds to activate without a second selection on touch release', () => {
  vi.useFakeTimers();
  const onActivate = vi.fn(),
    onSelectionChange = vi.fn();
  const {container} = render(example(config({onActivate, selection: {labels, onSelectionChange}})));
  const svg = geometry(container),
    at = point(container, 1);
  fireEvent.pointerDown(svg, {
    ...at,
    pointerId: 1,
    isPrimary: true,
    button: 0,
    pointerType: 'touch',
  });
  act(() => {
    vi.advanceTimersByTime(550);
  });
  expect(onActivate).toHaveBeenCalledOnce();
  fireEvent.pointerUp(svg, {...at, pointerId: 1, pointerType: 'touch'});
  expect(onSelectionChange).not.toHaveBeenCalled();
});
it('keeps controlled selection consumer-owned', () => {
  const onSelectionChange = vi.fn();
  const {container, rerender} = render(
    example(config({selection: {labels, selectedItems: [], onSelectionChange}})),
  );
  click(geometry(container), point(container, 1));
  expect(onSelectionChange).toHaveBeenLastCalledWith([{rowId: 'feb', seriesId: 'a'}]);
  expect(screen.getByText('Nothing selected')).toBeTruthy();
  rerender(
    example(
      config({
        selection: {labels, selectedItems: [{rowId: 'feb', seriesId: 'a'}], onSelectionChange},
      }),
    ),
  );
  expect(screen.getByText('1 selected')).toBeTruthy();
});

it('retains selected identity across reordering and removes deleted items', () => {
  const interaction = config({
    selection: {labels, defaultSelectedItems: [{rowId: 'feb', seriesId: 'a'}]},
  });
  const {rerender} = render(example(interaction));
  rerender(example(interaction, [rows[2]!, rows[0]!, {...rows[1]!, a: 55}]));
  expect(screen.getByText('feb a')).toBeTruthy();
  rerender(example(interaction, [rows[0]!, rows[2]!]));
  expect(screen.getByText('Nothing selected')).toBeTruthy();
  rerender(example(interaction));
  expect(screen.getByText('Nothing selected')).toBeTruthy();
});
it('commits a dragged month range and cancels a new drag without notifying the consumer', () => {
  const onSelectionChange = vi.fn(),
    onActivate = vi.fn();
  const {container} = render(
    example(config({target: 'category', onActivate, selection: {labels, onSelectionChange}})),
  );
  const svg = geometry(container),
    from = point(container, 0),
    to = point(container, 2);
  fireEvent.pointerDown(svg, {
    ...from,
    pointerId: 1,
    isPrimary: true,
    button: 0,
    pointerType: 'mouse',
  });
  fireEvent.pointerMove(svg, {...to, pointerId: 1, pointerType: 'mouse'});
  expect(onSelectionChange).not.toHaveBeenCalled();
  fireEvent.pointerUp(svg, {...to, pointerId: 1, pointerType: 'mouse'});
  expect(onSelectionChange).toHaveBeenLastCalledWith([
    {rowId: 'jan'},
    {rowId: 'feb'},
    {rowId: 'mar'},
  ]);
  expect(onActivate).not.toHaveBeenCalled();
  fireEvent.pointerDown(svg, {
    ...from,
    pointerId: 1,
    isPrimary: true,
    button: 0,
    pointerType: 'mouse',
  });
  fireEvent.pointerMove(svg, {...point(container, 1), pointerId: 1, pointerType: 'mouse'});
  fireEvent.keyDown(screen.getByRole('group', {name: 'Trend'}), {key: 'Escape'});
  fireEvent.pointerUp(svg, {...to, pointerId: 1, pointerType: 'mouse'});
  expect(onSelectionChange).toHaveBeenCalledTimes(1);
  expect(screen.getByText('3 selected')).toBeTruthy();
});
it('subtracts a dragged point rectangle and preserves items outside it', () => {
  const onSelectionChange = vi.fn();
  const {container} = render(
    example(
      config({
        selection: {
          labels,
          onSelectionChange,
          defaultSelectedItems: [
            {rowId: 'jan', seriesId: 'a'},
            {rowId: 'feb', seriesId: 'a'},
            {rowId: 'feb', seriesId: 'b'},
          ],
        },
      }),
    ),
  );
  const svg = geometry(container),
    at = point(container, 1);
  const from = {clientX: at.clientX - 10, clientY: at.clientY - 10},
    to = {clientX: at.clientX + 10, clientY: at.clientY + 10};
  fireEvent.pointerDown(svg, {
    ...from,
    pointerId: 1,
    isPrimary: true,
    button: 0,
    pointerType: 'mouse',
    altKey: true,
  });
  fireEvent.pointerMove(svg, {...to, pointerId: 1, pointerType: 'mouse'});
  fireEvent.pointerUp(svg, {...to, pointerId: 1, pointerType: 'mouse'});
  expect(onSelectionChange).toHaveBeenLastCalledWith([
    {rowId: 'jan', seriesId: 'a'},
    {rowId: 'feb', seriesId: 'b'},
  ]);
});
it('cancels a touch hold on movement, cancellation, or data replacement', () => {
  vi.useFakeTimers();
  const onActivate = vi.fn();
  const interaction = config({onActivate, selection: {labels}});
  const {container, rerender} = render(example(interaction));
  const svg = geometry(container),
    at = point(container, 1);
  const down = () =>
    fireEvent.pointerDown(svg, {
      ...at,
      pointerId: 1,
      isPrimary: true,
      button: 0,
      pointerType: 'touch',
    });
  down();
  fireEvent.pointerMove(svg, {
    clientX: at.clientX + 25,
    clientY: at.clientY,
    pointerId: 1,
    pointerType: 'touch',
  });
  act(() => {
    vi.advanceTimersByTime(600);
  });
  expect(onActivate).not.toHaveBeenCalled();
  fireEvent.pointerCancel(svg, {pointerId: 1});
  down();
  fireEvent.pointerCancel(svg, {pointerId: 1});
  act(() => {
    vi.advanceTimersByTime(600);
  });
  expect(onActivate).not.toHaveBeenCalled();
  down();
  rerender(
    example(
      interaction,
      rows.map((row) => ({...row, a: row.a + 1})),
    ),
  );
  act(() => {
    vi.advanceTimersByTime(600);
  });
  expect(onActivate).not.toHaveBeenCalled();
});
it('keeps hidden selected points named and restores their marker with the series', () => {
  const interaction = config({
    selection: {labels, defaultSelectedItems: [{rowId: 'feb', seriesId: 'a'}]},
  });
  const {container} = render(
    <LineChart
      {...base}
      data={rows}
      interaction={interaction}
      visibilityLabels={{
        hideSeries: (label) => `Hide ${label}`,
        showSeries: (label) => `Show ${label}`,
        hidden: 'Hidden',
        showAll: 'Show all',
        allHidden: {title: 'All hidden', description: 'Restore a series'},
      }}
    />,
  );
  fireEvent.click(screen.getByRole('button', {name: 'Hide A'}));
  expect(screen.getByText('feb a hidden')).toBeTruthy();
  expect(container.querySelector('[data-wcl-chart-selected-point]')).toBeNull();
  fireEvent.click(screen.getByRole('button', {name: 'Show A'}));
  expect(screen.getByText('feb a')).toBeTruthy();
  expect(container.querySelector('[data-wcl-chart-selected-point]')).toBeTruthy();
});
it('keeps keyboard point reading, selection, and activation on the same series', () => {
  const onActivate = vi.fn(),
    onSelectionChange = vi.fn();
  render(example(config({onActivate, selection: {labels, onSelectionChange}})));
  const reader = screen.getByRole('group', {name: 'Trend'});
  fireEvent.keyDown(reader, {key: 'ArrowRight'});
  fireEvent.keyDown(reader, {key: 'ArrowDown'});
  fireEvent.keyDown(reader, {key: 'Enter'});
  expect(onSelectionChange).toHaveBeenLastCalledWith([{rowId: 'feb', seriesId: 'b'}]);
  fireEvent.keyDown(reader, {key: 'Enter', metaKey: true});
  expect(onActivate.mock.calls[0]![0]).toMatchObject({
    item: {rowId: 'feb', seriesId: 'b'},
    input: 'keyboard',
  });
  expect(onSelectionChange).toHaveBeenCalledTimes(1);
});
it('expires activation feedback and restarts it on repeated activation', () => {
  vi.useFakeTimers();
  const onActivate = vi.fn();
  const {container} = render(example(config({onActivate})));
  const svg = geometry(container),
    at = point(container, 1);
  click(svg, at);
  act(() => {
    vi.advanceTimersByTime(500);
  });
  click(svg, at);
  act(() => {
    vi.advanceTimersByTime(300);
  });
  expect(container.querySelector('[data-wcl-chart-activation]')).toBeTruthy();
  act(() => {
    vi.advanceTimersByTime(400);
  });
  expect(container.querySelector('[data-wcl-chart-activation]')).toBeNull();
  expect(onActivate).toHaveBeenCalledTimes(2);
});
it('supports duplicate category coordinates using distinct row IDs', () => {
  const onActivate = vi.fn();
  const data = [rows[0]!, {...rows[1]!, month: 'Jan'}, rows[2]!];
  const {container} = render(example(config({onActivate}), data));
  click(geometry(container), point(container, 1));
  expect(onActivate.mock.calls[0]![0]).toMatchObject({item: {rowId: 'feb', seriesId: 'a'}});
});
it('rejects duplicate row IDs at the interaction boundary', () => {
  expect(() => render(example(config({getRowId: () => 'same'})))).toThrow(/unique nonempty string/);
});

it('hydrates preselected items without firing selection or activation callbacks', async () => {
  const onActivate = vi.fn(),
    onSelectionChange = vi.fn();
  const node = example(
    config({
      onActivate,
      selection: {labels, defaultSelectedItems: [{rowId: 'feb', seriesId: 'a'}], onSelectionChange},
    }),
  );
  const host = document.createElement('div');
  host.innerHTML = renderToString(node);
  document.body.append(host);
  const onRecoverableError = vi.fn();
  const root = hydrateRoot(host, node, {onRecoverableError});
  await act(async () => {
    await Promise.resolve();
  });
  expect(onRecoverableError).not.toHaveBeenCalled();
  expect(onActivate).not.toHaveBeenCalled();
  expect(onSelectionChange).not.toHaveBeenCalled();
  expect(host.textContent).toContain('1 selected');
  act(() => root.unmount());
  host.remove();
});

it('accepts the visible edge of a point on the plot boundary', () => {
  const onActivate = vi.fn();
  const {container} = render(
    <LineChart
      {...base}
      data={rows}
      interaction={config({onActivate})}
      yAxis={{label: 'Value', scale: {type: 'linear', domain: [20, 120]}}}
    />,
  );
  const at = point(container, 0);
  click(geometry(container), {...at, clientY: at.clientY + 1});
  expect(onActivate).toHaveBeenCalledOnce();
  expect(onActivate.mock.calls[0]![0]).toMatchObject({item: {rowId: 'jan', seriesId: 'a'}});
});

it('announces a changed keyboard point target while retaining the complete category reading', () => {
  const {container} = render(example(config({selection: {labels}})));
  const reader = screen.getByRole('group', {name: 'Trend'});
  fireEvent.keyDown(reader, {key: 'ArrowRight'});
  const first = container.querySelector('[data-wcl-chart-reading-announcement]')!.textContent;
  fireEvent.keyDown(reader, {key: 'ArrowDown'});
  const next = container.querySelector('[data-wcl-chart-reading-announcement]')!.textContent;
  expect(next).not.toBe(first);
  expect(next).toContain('A: 40');
  expect(next).toContain('B: 90');
});
it('keeps the reading center above an optional marker when a point is selected', () => {
  const {container} = render(
    <LineChart
      {...base}
      data={rows}
      series={[
        {id: 'a', label: 'A', accessor: 'a'},
        {id: 'b', label: 'B', accessor: 'b'},
      ]}
      interaction={config({
        selection: {labels, defaultSelectedItems: [{rowId: 'feb', seriesId: 'b'}]},
      })}
    />,
  );
  const reader = screen.getByRole('group', {name: 'Trend'});
  fireEvent.keyDown(reader, {key: 'ArrowRight'});
  fireEvent.keyDown(reader, {key: 'ArrowDown'});
  const center = container.querySelector('[data-wcl-chart-reading-node]')!;
  const cx = center.getAttribute('cx'),
    cy = center.getAttribute('cy');
  const outlines = [...container.querySelectorAll('[data-wcl-chart-reading-outline]')].filter(
    (e) => e.getAttribute('cx') === cx && e.getAttribute('cy') === cy,
  );
  expect(outlines.length).toBeGreaterThan(0);
  for (const outline of outlines)
    expect(outline.compareDocumentPosition(center) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

it.each(['category', 'point'] as const)(
  'preserves line hover emphasis independently of the %s click target',
  (target) => {
    const onActivate = vi.fn<NonNullable<LineChartInteraction<Row, string>['onActivate']>>(),
      onSelectionChange = vi.fn();
    const {container} = render(
      example(config({target, onActivate, selection: {labels, onSelectionChange}})),
    );
    const svg = geometry(container);
    const a = container.querySelector('[data-wcl-chart-series][data-series-id="a"]')!;
    const b = container.querySelector('[data-wcl-chart-series][data-series-id="b"]')!;
    const at = point(container, 1, 'b');
    fireEvent.pointerMove(svg, {...at, pointerType: 'mouse'});
    expect(b.hasAttribute('data-emphasized')).toBe(true);
    expect(a.hasAttribute('data-muted')).toBe(true);
    expect(container.querySelectorAll('[data-wcl-chart-reading-node][data-filled]')).toHaveLength(
      target === 'category' ? 2 : 1,
    );
    const item = target === 'category' ? {rowId: 'feb'} : {rowId: 'feb', seriesId: 'b'};
    click(svg, at);
    expect(onSelectionChange).toHaveBeenLastCalledWith([item]);
    click(svg, at, {ctrlKey: true});
    expect(onActivate.mock.calls[0]![0].item).toEqual(item);
    expect(onActivate.mock.calls[0]![0].values).toHaveLength(target === 'category' ? 2 : 1);
    fireEvent.pointerMove(svg, {...point(container, 1, 'a'), pointerType: 'mouse'});
    expect(a.hasAttribute('data-emphasized')).toBe(true);
    fireEvent.pointerLeave(svg);
    expect(a.hasAttribute('data-emphasized')).toBe(false);
    expect(b.hasAttribute('data-emphasized')).toBe(false);
  },
);

it('keeps category fills on the activated row when coordinates repeat', () => {
  const onActivate = vi.fn();
  const data = [rows[0]!, {...rows[1]!, month: 'Jan'}, rows[2]!];
  const {container} = render(example(config({target: 'category', onActivate}), data));
  const svg = geometry(container),
    at = point(container, 1, 'b');
  fireEvent.pointerMove(svg, {...at, pointerType: 'mouse'});
  const fills = [...container.querySelectorAll('[data-wcl-chart-reading-node][data-filled]')];
  expect(fills.map((node) => Number(node.getAttribute('cy')))).toEqual([
    point(container, 0, 'a').clientY,
    point(container, 0, 'b').clientY,
  ]);
  click(svg, at);
  expect(onActivate.mock.calls[0]![0]).toMatchObject({item: {rowId: 'jan'}});
});
