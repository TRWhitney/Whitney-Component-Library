import {cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {CartesianChart, type ChartActivation, type ChartSelectionItem} from '../src/index.js';
afterEach(cleanup);
const data = [
  {id: 'jan', month: 'Jan', measured: 12, lower: 5, upper: 20},
  {id: 'feb', month: 'Feb', measured: 15, lower: 8, upper: 25},
  {id: 'mar', month: 'Mar', measured: 18, lower: 10, upper: 30},
];
const labels = {
  instructions: 'Select a value',
  clear: 'Clear',
  empty: 'None',
  summary: (n: number) => `${n} selected`,
  item: (p: ChartSelectionItem) => `${p.rowId} ${p.seriesId}`,
  hidden: (s: string) => s,
};
const common = {
  data,
  title: 'Temperature',
  description: 'Measured and expected',
  legend: {label: 'Series'},
  dataTableLabel: 'Values',
  emptyState: {title: 'Empty', description: 'No data'},
  invalidData: {title: 'Invalid', description: 'Check data'},
  xAxis: {accessor: 'month', label: 'Month', scale: {type: 'categorical'}},
  yAxis: {label: 'Degrees', scale: {type: 'linear', domain: [0, 40]}},
  series: [
    {id: 'measured', label: 'Measured', accessor: 'measured', kind: 'line', showPoints: true},
    {
      id: 'expected',
      label: 'Expected',
      kind: 'range',
      lowerAccessor: 'lower',
      upperAccessor: 'upper',
    },
  ],
} as const;
it('selects one interval with two endpoints and activates both supplied limits', () => {
  const onActivate = vi.fn<(event: ChartActivation<object, string>) => void>(),
    onSelectionChange = vi.fn();
  const {container} = render(
    <CartesianChart
      {...common}
      interaction={{
        target: 'point',
        getRowId: (r) => r.id,
        selection: {labels, onSelectionChange},
        onActivate,
      }}
    />,
  );
  const table = screen.getByRole('table', {name: 'Values'});
  expect(within(table).getByText('8 – 25')).toBeTruthy();
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  Object.defineProperty(svg, 'getBoundingClientRect', {value: () => new DOMRect(0, 0, 640, 360)});
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'ArrowDown'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(onSelectionChange).toHaveBeenLastCalledWith([{rowId: 'jan', seriesId: 'expected'}]);
  expect(container.querySelectorAll('[data-wcl-chart-selected-point]')).toHaveLength(2);
  fireEvent.keyDown(canvas, {key: 'Enter', ctrlKey: true});
  expect(onActivate.mock.calls[0]?.[0]).toMatchObject({
    item: {rowId: 'jan', seriesId: 'expected'},
    values: [],
    ranges: [{seriesId: 'expected', label: 'Expected', lower: 5, upper: 20, hidden: false}],
  });
});
it('leaves gaps for missing or reversed bounds without removing measured values', () => {
  const rows = data.map((r, i) => ({
    ...r,
    lower: i === 1 ? undefined : r.lower,
    upper: i === 2 ? 2 : r.upper,
  }));
  const {container} = render(<CartesianChart {...common} data={rows} />);
  expect(container.querySelectorAll('[data-wcl-chart-point]')).toHaveLength(3);
  expect(screen.getByRole('table', {name: 'Values'}).querySelectorAll('tbody tr')).toHaveLength(3);
  expect(container.querySelector('[data-wcl-chart-area]')?.getAttribute('d')).not.toContain('NaN');
});
it('previews and selects the whole interval when a drag contains only its lower endpoint', () => {
  const onSelectionChange = vi.fn();
  const {container} = render(
    <CartesianChart
      {...common}
      interaction={{
        target: 'point',
        getRowId: (r) => r.id,
        selection: {
          labels,
          defaultSelectedItems: [{rowId: 'jan', seriesId: 'expected'}],
          onSelectionChange,
        },
      }}
    />,
  );
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  Object.defineProperty(svg, 'getBoundingClientRect', {value: () => new DOMRect(0, 0, 640, 360)});
  const rings = [...container.querySelectorAll('[data-wcl-chart-selected-point]')];
  const x = Number(rings[1]!.getAttribute('cx')),
    y = Number(rings[1]!.getAttribute('cy'));
  fireEvent.click(screen.getByRole('button', {name: 'Clear'}));
  const event = {pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0};
  fireEvent.pointerDown(svg, {...event, clientX: x - 5, clientY: y - 5});
  fireEvent.pointerMove(svg, {...event, clientX: x + 5, clientY: y + 5});
  expect(container.querySelector('[data-wcl-chart-selection-box]')).toBeTruthy();
  expect(container.querySelectorAll('[data-wcl-chart-selected-point]')).toHaveLength(2);
  expect(onSelectionChange).toHaveBeenLastCalledWith([]);
  fireEvent.pointerUp(svg, {...event, clientX: x + 5, clientY: y + 5});
  expect(onSelectionChange).toHaveBeenLastCalledWith([{rowId: 'jan', seriesId: 'expected'}]);
});
it('keeps category underlines and sends hidden ranges with the original source row', () => {
  const onActivate = vi.fn<(event: ChartActivation<object, string>) => void>();
  const {container} = render(
    <CartesianChart
      {...common}
      visibilityLabels={{
        hideSeries: (s) => `Hide ${s}`,
        showSeries: (s) => `Show ${s}`,
        hidden: 'Hidden',
        showAll: 'Show all',
        allHidden: {title: 'Hidden', description: 'Restore'},
      }}
      interaction={{target: 'category', getRowId: (r) => r.id, selection: {labels}, onActivate}}
    />,
  );
  fireEvent.click(screen.getByRole('button', {name: 'Hide Expected'}));
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(container.querySelectorAll('[data-wcl-chart-selected-category]')).toHaveLength(1);
  expect(container.querySelectorAll('[data-wcl-chart-selected-point]')).toHaveLength(0);
  fireEvent.keyDown(canvas, {key: 'Enter', ctrlKey: true});
  expect(onActivate.mock.calls[0]?.[0]).toMatchObject({
    datum: data[0],
    values: [{seriesId: 'measured', value: 12}],
    ranges: [{lower: 5, upper: 20, hidden: true}],
  });
});
it('accepts equal bounds as a selectable interval and excludes missing range targets', () => {
  const onActivate = vi.fn<(event: ChartActivation<object, string>) => void>();
  const rows = data.map((r, i) => ({...r, lower: i === 0 ? r.upper : undefined}));
  const {container} = render(
    <CartesianChart
      {...common}
      data={rows}
      interaction={{target: 'point', getRowId: (r) => r.id, onActivate}}
    />,
  );
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'ArrowDown'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(onActivate.mock.calls[0]?.[0].ranges).toMatchObject([{lower: 20, upper: 20}]);
  fireEvent.keyDown(canvas, {key: 'ArrowRight'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(onActivate).toHaveBeenCalledTimes(1);
});
it('breaks the range and measured line independently at missing samples', () => {
  const rows = Array.from({length: 5}, (_, i) => ({
    id: String(i),
    month: String(i),
    measured: i === 1 ? undefined : 12,
    lower: i === 2 ? undefined : 5,
    upper: 20,
  }));
  const {container} = render(<CartesianChart {...common} data={rows} />);
  const rangePath = container.querySelector('[data-wcl-chart-area]')!.getAttribute('d')!;
  const linePath = container.querySelector('[data-wcl-chart-line]')!.getAttribute('d')!;
  expect(rangePath.match(/M/g)).toHaveLength(2);
  expect(linePath.match(/M/g)).toHaveLength(2);
  expect(container.querySelectorAll('[data-wcl-chart-point]')).toHaveLength(4);
});
it('fits a negative interval to both bounds without adding a zero baseline', () => {
  render(
    <CartesianChart
      {...common}
      data={data.map((r) => ({...r, measured: -20, lower: -30, upper: -10}))}
      yAxis={{label: 'Degrees', scale: {type: 'linear'}}}
    />,
  );
  expect(screen.getByText('-30')).toBeTruthy();
  expect(screen.getByText('-10')).toBeTruthy();
  expect(screen.queryByText('0')).toBeNull();
});
