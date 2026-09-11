import {cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {CartesianChart, ColumnChart} from '../src/index.js';
import {chartMotionClock} from './chart-motion-clock.js';
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
const data = [
  {id: 'a', label: 'A', value: 20},
  {id: 'b', label: 'B', value: 70},
];
const props = {
  data,
  title: 'Values',
  description: 'Supplied values',
  dataTableLabel: 'All values',
  emptyState: {title: 'Empty', description: 'Add data'},
  invalidData: {title: 'Invalid', description: 'Check data'},
  series: [{id: 'value', label: 'Value', accessor: 'value'}],
  xAxis: {accessor: 'label', label: 'Category', scale: {type: 'categorical'}},
  yAxis: {label: 'Value', scale: {type: 'linear', domain: [0, 100]}},
} as const;
it('resizes existing columns while the table immediately reports updated source values', () => {
  const clock = chartMotionClock();
  const {container, rerender} = render(<ColumnChart {...props} />);
  const height = () =>
    Number(container.querySelector('[data-wcl-chart-bar]')!.getAttribute('height'));
  const initial = height();
  rerender(<ColumnChart {...props} data={[{...data[0]!, value: 60}, data[1]!]} />);
  expect(height()).toBeCloseTo(initial);
  expect(within(screen.getByRole('table')).getByText('60')).toBeTruthy();
  clock.advance(120);
  const middle = height();
  expect(middle).toBeGreaterThan(initial);
  clock.advance(240);
  expect(height()).toBeGreaterThan(middle);
});
it('moves category labels and their columns by identity when order changes', () => {
  const clock = chartMotionClock();
  const {container, rerender} = render(<ColumnChart {...props} />);
  const position = () =>
    Number(container.querySelector('[data-wcl-chart-bar][data-row-index="1"]')!.getAttribute('x'));
  const oldA = Number(
    container.querySelector('[data-wcl-chart-bar][data-row-index="0"]')!.getAttribute('x'),
  );
  rerender(<ColumnChart {...props} data={[data[1]!, data[0]!]} />);
  expect(position()).toBeCloseTo(oldA);
  clock.advance(120);
  const middle = position();
  expect(middle).toBeGreaterThan(oldA);
  clock.advance(240);
  expect(position()).toBeGreaterThan(middle);
});

it('retargets from the displayed height and settles immediately for reduced motion', () => {
  const clock = chartMotionClock();
  const {container, rerender, unmount} = render(<ColumnChart {...props} />);
  const height = () =>
    Number(container.querySelector('[data-wcl-chart-bar]')!.getAttribute('height'));
  rerender(<ColumnChart {...props} data={[{...data[0]!, value: 80}, data[1]!]} />);
  clock.advance(80);
  const interrupted = height();
  rerender(<ColumnChart {...props} data={[{...data[0]!, value: 30}, data[1]!]} />);
  expect(height()).toBeCloseTo(interrupted);
  clock.advance(160);
  expect(height()).toBeLessThan(interrupted);
  clock.reduce();
  expect(height()).toBeCloseTo(78.87);
  expect(clock.pending()).toBe(0);
  unmount();
  expect(clock.pending()).toBe(0);
});

it('fades membership while removing departed records from the interactive plot and table', () => {
  const clock = chartMotionClock();
  const {container, rerender} = render(<ColumnChart {...props} />);
  rerender(<ColumnChart {...props} data={[data[1]!, {id: 'c', label: 'C', value: 40}]} />);
  const departure = () => container.querySelector('[data-wcl-chart-departing-bar]');
  expect(departure()).toBeTruthy();
  expect(departure()!.getAttribute('data-row-index')).toBeNull();
  expect(departure()!.closest('[pointer-events="none"]')).toBeTruthy();
  expect(within(screen.getByRole('table')).queryByText('A')).toBeNull();
  const arrival = () => container.querySelector('[data-wcl-chart-bar][data-row-index="1"]')!;
  expect(Number(arrival().getAttribute('opacity'))).toBe(0);
  clock.advance(120);
  expect(Number(arrival().getAttribute('opacity'))).toBeGreaterThan(0);
  expect(Number(departure()!.getAttribute('opacity'))).toBeLessThan(1);
  clock.advance(240);
  expect(departure()).toBeNull();
  expect(Number(arrival().getAttribute('opacity'))).toBe(1);
});

it('moves the selection underline with its category label and activates actual values at the displayed bar', () => {
  const clock = chartMotionClock();
  const activate = vi.fn();
  const interaction = {
    getRowId: (row: (typeof data)[number]) => row.id,
    target: 'category' as const,
    onActivate: activate,
    selection: {
      defaultSelectedItems: [{rowId: 'a'}],
      labels: {
        instructions: 'Select or open details',
        clear: 'Clear',
        empty: 'None',
        summary: (n: number) => `${n} selected`,
        item: (item: {rowId: string}) => item.rowId,
        hidden: (label: string) => label,
      },
    },
  };
  const {container, rerender} = render(<ColumnChart {...props} interaction={interaction} />);
  rerender(
    <ColumnChart
      {...props}
      data={[data[1]!, {...data[0]!, value: 60}]}
      interaction={interaction}
    />,
  );
  clock.advance(120);
  const bar = container.querySelector('[data-wcl-chart-bar][data-row-index="1"]')!;
  const x = Number(bar.getAttribute('x')) + Number(bar.getAttribute('width')) / 2;
  const underline = container.querySelector('[data-wcl-chart-selected-category]')!;
  expect(
    (Number(underline.getAttribute('x1')) + Number(underline.getAttribute('x2'))) / 2,
  ).toBeCloseTo(x);
  const label = [...container.querySelectorAll('[data-axis="x"] [data-wcl-chart-tick-label]')].find(
    (el) => el.textContent === 'A',
  )!;
  expect(Number(label.getAttribute('x'))).toBeCloseTo(x);
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  Object.defineProperty(svg, 'getBoundingClientRect', {
    value: () => ({left: 0, top: 0, width: 640, height: 360}),
  });
  const at = {
    clientX: x,
    clientY: Number(bar.getAttribute('y')) + Number(bar.getAttribute('height')) / 2,
    isPrimary: true,
    pointerId: 1,
    pointerType: 'mouse',
    button: 0,
    ctrlKey: true,
  };
  fireEvent.pointerDown(svg, at);
  fireEvent.pointerUp(svg, at);
  expect(activate.mock.calls[0]?.[0]).toMatchObject({
    datum: {id: 'a', value: 60},
    values: [{value: 60}],
  });
});

it('animates automatic scale fitting without a visibility control', () => {
  const clock = chartMotionClock();
  const automatic = {label: 'Value', scale: {type: 'linear' as const}};
  const {container, rerender} = render(<ColumnChart {...props} yAxis={automatic} />);
  const height = () =>
    Number(container.querySelector('[data-wcl-chart-bar]')!.getAttribute('height'));
  const old = height();
  rerender(
    <ColumnChart {...props} yAxis={automatic} data={[{...data[0]!, value: 200}, data[1]!]} />,
  );
  expect(height()).toBeCloseTo(old);
  clock.advance(120);
  const middle = height();
  expect(middle).toBeGreaterThan(old);
  clock.advance(240);
  expect(height()).toBeGreaterThan(middle);
});

it('moves both range limits while its table retains the supplied interval', () => {
  const clock = chartMotionClock();
  const rangeProps = {
    ...props,
    series: [
      {
        id: 'range',
        label: 'Range',
        kind: 'range' as const,
        lowerAccessor: 'low' as const,
        upperAccessor: 'value' as const,
      },
    ] as const,
  };
  const rows = data.map((row) => ({...row, low: 10}));
  const {container, rerender} = render(<CartesianChart {...rangeProps} data={rows} />);
  const path = () => container.querySelector('[data-wcl-chart-area]')!.getAttribute('d');
  const old = path();
  rerender(
    <CartesianChart
      {...rangeProps}
      data={rows.map((row) => ({...row, low: 15, value: row.value + 10}))}
    />,
  );
  expect(path()).toBe(old);
  expect(within(screen.getByRole('table')).getByText('15 – 30')).toBeTruthy();
  clock.advance(120);
  const middle = path();
  expect(middle).not.toBe(old);
  clock.advance(240);
  expect(path()).not.toBe(middle);
});

it('moves the axis gutter with data when fitted labels change width', () => {
  const clock = chartMotionClock();
  const axis = {label: 'Value', scale: {type: 'linear' as const}};
  const {container, rerender} = render(<ColumnChart {...props} yAxis={axis} />);
  const x = () => Number(container.querySelector('[data-wcl-chart-bar]')!.getAttribute('x'));
  const before = x();
  rerender(<ColumnChart {...props} yAxis={axis} data={[{...data[0]!, value: 20000}, data[1]!]} />);
  expect(x()).toBeCloseTo(before);
  clock.advance(120);
  const middle = x();
  expect(middle).toBeGreaterThan(before);
  clock.advance(240);
  expect(x()).toBeGreaterThan(middle);
});

it('keeps ambiguous category records distinct and updates them immediately without interaction IDs', () => {
  const clock = chartMotionClock();
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  const rows = [
    {id: 'a', label: 'Same', value: 20},
    {id: 'b', label: 'Same', value: 70},
  ];
  const {container, rerender} = render(<ColumnChart {...props} data={rows} />);
  rerender(<ColumnChart {...props} data={[{...rows[0]!, value: 40}, rows[1]!]} />);
  const heights = [...container.querySelectorAll('[data-wcl-chart-bar]')].map((el) =>
    Number(el.getAttribute('height')),
  );
  expect(heights[0]! / heights[1]!).toBeCloseTo(40 / 70);
  expect(clock.pending()).toBe(0);
  expect(errors).not.toHaveBeenCalled();
});

it('settles automatic bounds immediately when category identities are ambiguous', () => {
  const clock = chartMotionClock();
  const axis = {label: 'Value', scale: {type: 'linear' as const}};
  const rows = data.map((row) => ({...row, label: 'Same'}));
  const {container, rerender} = render(<ColumnChart {...props} yAxis={axis} data={rows} />);
  rerender(<ColumnChart {...props} yAxis={axis} data={[{...rows[0]!, value: 200}, rows[1]!]} />);
  const height = () =>
    Number(container.querySelector('[data-wcl-chart-bar]')!.getAttribute('height'));
  const initial = height();
  expect(initial).toBeLessThan(360);
  expect(clock.pending()).toBe(0);
  clock.advance(240);
  expect(height()).toBe(initial);
});

it('settles range geometry and automatic bounds together when a gap appears', () => {
  const clock = chartMotionClock();
  const rangeProps = {
    ...props,
    yAxis: {label: 'Value', scale: {type: 'linear' as const}},
    series: [
      {
        id: 'range',
        label: 'Range',
        kind: 'range' as const,
        lowerAccessor: 'low' as const,
        upperAccessor: 'value' as const,
      },
    ] as const,
  };
  const rows = data.map((row) => ({...row, low: 10}));
  const {container, rerender} = render(<CartesianChart {...rangeProps} data={rows} />);
  rerender(
    <CartesianChart
      {...rangeProps}
      data={[
        {...rows[0]!, low: 15, value: 200},
        {...rows[1]!, value: NaN},
      ]}
    />,
  );
  const path = () => container.querySelector('[data-wcl-chart-area]')!.getAttribute('d');
  const initial = path();
  expect(clock.pending()).toBe(0);
  clock.advance(240);
  expect(path()).toBe(initial);
});
