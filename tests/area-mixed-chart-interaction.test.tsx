import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {
  AreaChart,
  CartesianChart,
  type ChartInteraction,
  type ChartSelectionItem,
} from '../src/index.js';
const data = [
  {id: 'jan', month: 'Jan', a: 80, b: 20},
  {id: 'feb', month: 'Feb', a: 20, b: 80},
  {id: 'mar', month: 'Mar', a: 70, b: 30},
];
type Row = (typeof data)[number];
const labels = {
  instructions: 'Click selects. Hold activates.',
  clear: 'Clear selection',
  empty: 'None',
  summary: (n: number) => `${n} selected`,
  item: (p: ChartSelectionItem) => `${p.rowId} ${p.seriesId ?? 'month'}`,
  hidden: (s: string) => `${s} hidden`,
};
const common = {
  legend: {label: 'Series'},
  title: 'Energy',
  description: 'Monthly values',
  dataTableLabel: 'Values',
  emptyState: {title: 'Empty', description: 'No data'},
  invalidData: {title: 'Invalid', description: 'Check data'},
  series: [
    {id: 'a', label: 'A', accessor: 'a'},
    {id: 'b', label: 'B', accessor: 'b'},
  ] as const,
};
const config = (
  extra: Partial<ChartInteraction<Row, string>> = {},
): ChartInteraction<Row, string> => ({target: 'point', getRowId: (r) => r.id, ...extra});
function geometry(container: HTMLElement) {
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  Object.defineProperty(svg, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({left: 0, top: 0, width: 640, height: 360, right: 640, bottom: 360}),
  });
  return svg;
}
function rect(container: HTMLElement, index: number, id = 'a') {
  const m = container.querySelector(
    `[data-wcl-chart-bar][data-row-index="${index}"][data-series="${id}"]`,
  )!;
  return {
    x: Number(m.getAttribute('x')),
    y: Number(m.getAttribute('y')),
    width: Number(m.getAttribute('width')),
    height: Number(m.getAttribute('height')),
  };
}
const center = (r: ReturnType<typeof rect>) => ({
  clientX: r.x + r.width / 2,
  clientY: r.y + r.height / 2,
});
function click(svg: SVGSVGElement, at: {clientX: number; clientY: number}, extra = {}) {
  fireEvent.pointerDown(svg, {
    ...at,
    pointerId: 1,
    isPrimary: true,
    button: 0,
    pointerType: 'mouse',
    ...extra,
  });
  fireEvent.pointerUp(svg, {...at, pointerId: 1, pointerType: 'mouse', ...extra});
}
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const xAxis = {accessor: 'month', label: 'Month', scale: {type: 'categorical'}} as const;
const yAxis = {label: 'Value', scale: {type: 'linear'}} as const;
function areaVertices(container: HTMLElement, id = 'a') {
  return [
    ...container
      .querySelector(`[data-wcl-chart-area][data-series="${id}"]`)!
      .getAttribute('d')!
      .matchAll(/[ML](-?[\d.]+),(-?[\d.]+)/g),
  ].map((m) => ({x: Number(m[1]), y: Number(m[2])}));
}
it('uses legend priority only inside overlapping sloping areas', () => {
  const onActivate = vi.fn<NonNullable<ChartInteraction<Row, string>['onActivate']>>();
  const {container} = render(
    <AreaChart
      {...common}
      data={data}
      xAxis={xAxis}
      yAxis={yAxis}
      interaction={config({onActivate})}
    />,
  );
  const svg = geometry(container),
    points = areaVertices(container);
  const zero = points[points.length - 1]!.y;
  const valueY = (value: number) => zero - ((zero - points[0]!.y) * value) / 80;
  const clientX = points[0]!.x + (points[1]!.x - points[0]!.x) / 4;
  fireEvent.click(screen.getByRole('button', {name: 'B'}));
  click(svg, {clientX, clientY: valueY(10)});
  expect(onActivate.mock.calls.at(-1)?.[0].item).toEqual({rowId: 'jan', seriesId: 'b'});
  click(svg, {clientX, clientY: valueY(50)});
  expect(onActivate.mock.calls.at(-1)?.[0].item).toEqual({rowId: 'jan', seriesId: 'a'});
  fireEvent.click(screen.getByRole('button', {name: 'A'}));
  click(svg, {clientX, clientY: valueY(10)});
  expect(onActivate.mock.calls.at(-1)?.[0].item).toEqual({rowId: 'jan', seriesId: 'a'});
});
it.each(['stacked', 'normalized'] as const)(
  'marks the upper area boundary and activates raw values in %s',
  (stacking) => {
    const onActivate = vi.fn<NonNullable<ChartInteraction<Row, string>['onActivate']>>();
    const props = {...common, data, xAxis, interaction: config({onActivate, selection: {labels}})};
    const {container} = render(
      stacking === 'normalized' ? (
        <AreaChart
          {...props}
          stacking="normalized"
          yAxis={{label: 'Share', scale: {type: 'normalized'}}}
        />
      ) : (
        <AreaChart {...props} stacking="stacked" yAxis={yAxis} />
      ),
    );
    const svg = geometry(container),
      top = areaVertices(container, 'b')[1]!;
    const at = {clientX: top.x, clientY: top.y};
    fireEvent.pointerMove(svg, {...at, pointerType: 'mouse'});
    click(svg, at);
    const reading = container.querySelector('[data-wcl-chart-reading-node][data-filled]');
    expect(reading).not.toBeNull();
    expect(Number(reading?.getAttribute('cy'))).toBeCloseTo(top.y);
    expect(container.querySelectorAll('[data-wcl-chart-selected-point]')).toHaveLength(1);
    click(svg, at, {ctrlKey: true});
    expect(onActivate.mock.calls[0]?.[0]).toMatchObject({
      item: {rowId: 'feb', seriesId: 'b'},
      values: [{value: 80}],
    });
  },
);
function mixed(interaction: ChartInteraction<Row, string>) {
  return (
    <CartesianChart
      {...common}
      data={data}
      xAxis={xAxis}
      yAxis={yAxis}
      series={[
        {...common.series[0], kind: 'column'},
        {...common.series[1], kind: 'line', showPoints: true},
      ]}
      interaction={interaction}
    />
  );
}
it('selects an overlapping line point and bar separately with their own indicators', () => {
  const {container} = render(mixed(config({selection: {labels}})));
  const svg = geometry(container),
    bar = rect(container, 0),
    point = container.querySelector('[data-wcl-chart-point][data-row-index="0"]')!;
  const at = {clientX: Number(point.getAttribute('cx')), clientY: Number(point.getAttribute('cy'))};
  fireEvent.pointerMove(svg, {...at, pointerType: 'mouse'});
  click(svg, at);
  expect(container.querySelectorAll('[data-wcl-chart-selected-point]')).toHaveLength(1);
  const inside = {clientX: bar.x + bar.width / 2, clientY: bar.y + bar.height / 4};
  fireEvent.pointerMove(svg, {...inside, pointerType: 'mouse'});
  click(svg, inside);
  expect(container.querySelectorAll('[data-wcl-chart-selected-bar]')).toHaveLength(1);
  expect(container.querySelectorAll('[data-wcl-chart-selected-point]')).toHaveLength(1);
  expect(container.querySelector('[data-wcl-chart-reading-bar]')).not.toBeNull();
  expect(container.querySelector('[data-wcl-chart-reading-node]')).toBeNull();
});
it('previews both mark kinds for a month and emits one category activation', () => {
  const onActivate = vi.fn<NonNullable<ChartInteraction<Row, string>['onActivate']>>();
  const {container} = render(mixed(config({target: 'category', onActivate})));
  const svg = geometry(container),
    at = center(rect(container, 0));
  fireEvent.pointerMove(svg, {...at, pointerType: 'mouse'});
  expect(container.querySelectorAll('[data-wcl-chart-reading-node]')).toHaveLength(1);
  expect(container.querySelector('[data-wcl-chart-reading-bar]')).not.toBeNull();
  click(svg, at);
  expect(onActivate).toHaveBeenCalledTimes(1);
  expect(onActivate.mock.calls[0]?.[0]).toMatchObject({
    item: {rowId: 'jan'},
    values: [
      {seriesId: 'a', value: 80},
      {seriesId: 'b', value: 20},
    ],
  });
  expect(container.querySelectorAll('[data-wcl-chart-activation-dot]')).toHaveLength(1);
  expect(container.querySelector('[data-wcl-chart-activation-bar]')).not.toBeNull();
});
it('holds an area value to activate without changing selection and cancels a pending hold on refresh', () => {
  vi.useFakeTimers();
  const onActivate = vi.fn(),
    change = vi.fn();
  const props = {
    ...common,
    data,
    xAxis,
    yAxis,
    interaction: config({
      onActivate,
      selection: {
        labels,
        onSelectionChange: change,
        defaultSelectedItems: [{rowId: 'feb', seriesId: 'a'}],
      },
    }),
  };
  const {container, rerender} = render(<AreaChart {...props} />);
  const svg = geometry(container),
    top = areaVertices(container)[0]!,
    at = {clientX: top.x, clientY: top.y};
  const down = () =>
    fireEvent.pointerDown(svg, {
      ...at,
      pointerId: 1,
      isPrimary: true,
      button: 0,
      pointerType: 'touch',
    });
  down();
  act(() => {
    vi.advanceTimersByTime(550);
  });
  fireEvent.pointerUp(svg, {...at, pointerId: 1, pointerType: 'touch'});
  expect(onActivate).toHaveBeenCalledTimes(1);
  expect(change).not.toHaveBeenCalled();
  expect(container.querySelectorAll('[data-wcl-chart-selected-point]')).toHaveLength(1);
  down();
  rerender(<AreaChart {...props} data={data.map((row) => ({...row, a: row.a + 1}))} />);
  act(() => {
    vi.advanceTimersByTime(550);
  });
  expect(onActivate).toHaveBeenCalledTimes(1);
});
it('targets the visible area fill when its value marker is outside an explicit domain', () => {
  const onActivate = vi.fn<NonNullable<ChartInteraction<Row, string>['onActivate']>>();
  const {container} = render(
    <AreaChart
      {...common}
      data={data.map((row) => ({...row, a: 80, b: 20}))}
      xAxis={xAxis}
      yAxis={{label: 'Value', scale: {type: 'linear', domain: [0, 50]}}}
      interaction={config({onActivate, selection: {labels}})}
    />,
  );
  const svg = geometry(container),
    points = areaVertices(container);
  const zero = points[points.length - 1]!.y;
  const at = {
    // Stay inside January's region, away from the rounded SVG midpoint tie.
    clientX: (points[0]!.x * 3 + points[1]!.x) / 4,
    clientY: zero - (zero - points[0]!.y) / 2,
  };
  fireEvent.click(screen.getByRole('button', {name: 'B'}));
  fireEvent.pointerMove(svg, {...at, pointerType: 'mouse'});
  click(svg, at, {ctrlKey: true});
  expect(onActivate.mock.calls[0]?.[0]).toMatchObject({
    item: {rowId: 'jan', seriesId: 'a'},
    values: [{value: 80}],
  });
  click(svg, at);
  expect(
    container.querySelector('[data-wcl-chart-reading-node]')?.closest('[clip-path]'),
  ).not.toBeNull();
  expect(
    container.querySelector('[data-wcl-chart-selected-point]')?.closest('[clip-path]'),
  ).not.toBeNull();
  expect(
    container.querySelector('[data-wcl-chart-activation-dot]')?.closest('[clip-path]'),
  ).not.toBeNull();
});
