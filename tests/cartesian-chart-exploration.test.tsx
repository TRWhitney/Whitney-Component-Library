import {cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {
  AreaChart,
  ColumnChart,
  BarChart,
  CartesianChart,
  type ChartExplorationLabels,
} from '../src/index.js';
afterEach(cleanup);
const rows = Array.from({length: 5}, (_, i) => ({
  id: `m${i}`,
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May'][i]!,
  a: (i + 1) * 10,
  b: (i + 1) * 5,
}));
const labels: ChartExplorationLabels<string> = {
  overview: 'Overview',
  closeOverview: 'Close overview',
  done: 'Done',
  reset: 'Reset view',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  panBackward: 'Earlier',
  panForward: 'Later',
  window: 'Visible months',
  start: 'First month',
  end: 'Last month',
  instructions: 'Drag the range.',
  range: ([a, b]) => `${a} to ${b}`,
};
const common = {
  data: rows,
  title: 'Monthly values',
  description: 'Monthly measurements',
  dataTableLabel: 'All monthly values',
  emptyState: {title: 'Empty', description: 'No data'},
  invalidData: {title: 'Invalid', description: 'Invalid data'},
  legend: {label: 'Measurements'},
  series: [
    {id: 'a', label: 'A', accessor: 'a'},
    {id: 'b', label: 'B', accessor: 'b'},
  ] as const,
  exploration: {labels, defaultWindow: ['Feb', 'Apr'] as const},
};
const vertical = {
  xAxis: {
    label: 'Month',
    accessor: (row: (typeof rows)[number]) => row.month,
    scale: {type: 'categorical'},
  } as const,
  yAxis: {label: 'Amount', scale: {type: 'linear'}} as const,
};
const visibilityLabels = {
  hideSeries: (name: string) => `Hide ${name}`,
  showSeries: (name: string) => `Show ${name}`,
  hidden: 'Hidden',
  showAll: 'Show all',
  allHidden: {title: 'All hidden', description: 'Restore a series.'},
};
const selectionLabels = {
  instructions: 'Select months',
  clear: 'Clear selection',
  empty: 'Nothing selected',
  summary: (n: number) => `${n} selected`,
  item: (item: {readonly rowId: string}) => item.rowId,
  hidden: (label: string) => `${label} hidden`,
};
const attribute = (element: Element, name: string) => Number(element.getAttribute(name));
it.each(['area', 'columns', 'stacked', 'normalized', 'mixed', 'bar'] as const)(
  'shows complete %s geometry in its horizontal overview',
  (kind) => {
    const chart =
      kind === 'area' ? (
        <AreaChart {...common} {...vertical} stacking="stacked" />
      ) : kind === 'bar' ? (
        <BarChart {...common} xAxis={vertical.yAxis} yAxis={vertical.xAxis} />
      ) : kind === 'mixed' ? (
        <CartesianChart
          {...common}
          {...vertical}
          series={[
            {...common.series[0], kind: 'column'},
            {...common.series[1], kind: 'line'},
            {...common.series[1], id: 'fill', kind: 'area'},
          ]}
        />
      ) : kind === 'normalized' ? (
        <ColumnChart
          {...common}
          {...vertical}
          layout="normalized"
          yAxis={{label: 'Share', scale: {type: 'normalized'}}}
        />
      ) : (
        <ColumnChart
          {...common}
          {...vertical}
          layout={kind === 'stacked' ? 'stacked' : 'grouped'}
        />
      );
    const {container} = render(chart);
    expect(within(container.querySelector('table')!).getAllByRole('row')).toHaveLength(6);
    fireEvent.click(screen.getByRole('button', {name: 'Overview'}));
    const overview = screen
      .getByRole('dialog')
      .querySelector('[data-wcl-chart-exploration-reference]')!;
    if (kind === 'area') expect(overview.querySelectorAll('[data-wcl-chart-area]')).toHaveLength(2);
    else
      expect(overview.querySelectorAll('[data-wcl-chart-bar]')).toHaveLength(
        kind === 'mixed' ? 5 : 10,
      );
    if (kind === 'mixed') {
      expect(overview.querySelectorAll('[data-wcl-chart-area]')).toHaveLength(1);
      expect(overview.querySelectorAll('[data-wcl-chart-line]')).toHaveLength(1);
    }
  },
);
it('selects a visible grouped month by its source identity and underlines its label', () => {
  const changed = vi.fn();
  const {container} = render(
    <ColumnChart
      {...common}
      {...vertical}
      interaction={{
        target: 'category',
        getRowId: (d) => d.id,
        selection: {
          onSelectionChange: changed,
          labels: {
            instructions: 'Select months',
            clear: 'Clear selection',
            empty: 'Nothing selected',
            summary: (n) => `${n} selected`,
            item: (i) => i.rowId,
            hidden: (l) => `${l} hidden`,
          },
        },
      }}
    />,
  );
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(changed).toHaveBeenLastCalledWith([{rowId: 'm1'}]);
  expect(container.querySelectorAll('[data-wcl-chart-selected-category]')).toHaveLength(1);
});
it('keeps hidden point selections named while omitting their overview marks', () => {
  const {container} = render(
    <ColumnChart
      {...common}
      {...vertical}
      visibilityLabels={visibilityLabels}
      interaction={{
        target: 'point',
        getRowId: (row) => row.id,
        selection: {
          labels: selectionLabels,
          defaultSelectedItems: [{rowId: 'm0', seriesId: 'a'}],
        },
      }}
    />,
  );
  fireEvent.click(screen.getByRole('button', {name: 'Hide A'}));
  expect(container.querySelector('[data-wcl-chart-selection]')?.textContent).toContain('m0 hidden');
  fireEvent.click(screen.getByRole('button', {name: 'Overview'}));
  const overview = screen
    .getByRole('dialog')
    .querySelector('[data-wcl-chart-exploration-reference]')!;
  expect(overview.querySelectorAll('[data-wcl-chart-bar]')).toHaveLength(5);
  expect(overview.querySelectorAll('line')).toHaveLength(0);
});
it('keeps the horizontal bar canvas size through navigation', () => {
  const {container} = render(
    <BarChart {...common} xAxis={vertical.yAxis} yAxis={vertical.xAxis} />,
  );
  const size = container.querySelector('[data-wcl-chart-frame]')?.getAttribute('style');
  fireEvent.click(screen.getByRole('button', {name: 'Zoom in'}));
  expect(container.querySelector('[data-wcl-chart-frame]')?.getAttribute('style')).toBe(size);
  expect(container.querySelector('[data-wcl-chart-exploration-range]')?.textContent).not.toBe(
    'Feb to Apr',
  );
});
it.each(['stacked', 'normalized'] as const)(
  'uses full-source %s totals in the overview',
  (layout) => {
    render(
      layout === 'normalized' ? (
        <ColumnChart
          {...common}
          {...vertical}
          layout="normalized"
          yAxis={{label: 'Share', scale: {type: 'normalized'}}}
        />
      ) : (
        <ColumnChart {...common} {...vertical} layout="stacked" />
      ),
    );
    fireEvent.click(screen.getByRole('button', {name: 'Overview'}));
    const overview = screen.getByRole('dialog');
    const a = [...overview.querySelectorAll('[data-wcl-chart-bar][data-series="a"]')];
    const b = [...overview.querySelectorAll('[data-wcl-chart-bar][data-series="b"]')];
    for (let index = 0; index < rows.length; index++) {
      expect(attribute(a[index]!, 'x')).toBe(attribute(b[index]!, 'x'));
      expect(attribute(a[index]!, 'y')).toBeCloseTo(
        attribute(b[index]!, 'y') + attribute(b[index]!, 'height'),
      );
      expect(attribute(a[index]!, 'height') / attribute(b[index]!, 'height')).toBeCloseTo(2);
    }
    const totals = a.map((bar, index) => attribute(bar, 'height') + attribute(b[index]!, 'height'));
    expect(totals[4]! / totals[0]!).toBeCloseTo(layout === 'normalized' ? 1 : 5);
  },
);
it('transposes complete horizontal bar categories into left-to-right overview bands', () => {
  const {container} = render(
    <BarChart {...common} xAxis={vertical.yAxis} yAxis={vertical.xAxis} />,
  );
  const bars = [...container.querySelectorAll('[data-wcl-chart-bar][data-series="a"]')];
  expect(bars).toHaveLength(3);
  expect(bars.map((bar) => attribute(bar, 'y'))).toEqual(
    bars.map((bar) => attribute(bar, 'y')).sort((a, b) => a - b),
  );
  fireEvent.click(screen.getByRole('button', {name: 'Overview'}));
  const reference = screen
    .getByRole('dialog')
    .querySelector('[data-wcl-chart-exploration-reference]')!;
  const overviewBars = [...reference.querySelectorAll('[data-wcl-chart-bar][data-series="a"]')];
  expect(reference.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 1000 80');
  expect(overviewBars).toHaveLength(5);
  expect(overviewBars.map((bar) => attribute(bar, 'x'))).toEqual(
    overviewBars.map((bar) => attribute(bar, 'x')).sort((a, b) => a - b),
  );
  expect(attribute(overviewBars[0]!, 'x')).toBeGreaterThanOrEqual(0);
  expect(
    attribute(overviewBars[4]!, 'x') + attribute(overviewBars[4]!, 'width'),
  ).toBeLessThanOrEqual(1000);
});
it('preserves full source accessor indices and activation after a category is clipped out', () => {
  const activate = vi.fn();
  const {container} = render(
    <AreaChart
      {...common}
      {...vertical}
      series={[{id: 'indexed', label: 'Indexed', accessor: (_row, index) => index * 10}]}
      interaction={{target: 'category', getRowId: (row) => row.id, onActivate: activate}}
    />,
  );
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(activate.mock.calls[0]![0]).toMatchObject({
    datum: rows[1],
    category: 'Feb',
    values: [{value: 10}],
  });
  fireEvent.keyDown(canvas, {key: 'End'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(activate.mock.calls[1]![0]).toMatchObject({
    datum: rows[3],
    category: 'Apr',
    values: [{value: 30}],
  });
});
it('keeps a crossing area and its zero baseline in an empty numeric window', () => {
  const {container} = render(
    <AreaChart
      {...common}
      data={[
        {id: 'a', x: 0, a: 100, b: 50},
        {id: 'b', x: 100, a: 200, b: 100},
      ]}
      xAxis={{label: 'Position', accessor: (row) => row.x, scale: {type: 'linear'}}}
      yAxis={vertical.yAxis}
      exploration={{
        labels: {...labels, range: ([first, last]) => `${first} to ${last}`},
        defaultWindow: [40, 60],
      }}
    />,
  );
  const ticks = [...container.querySelectorAll('[data-axis="y"] [data-wcl-chart-tick-label]')].map(
    (tick) => Number(tick.textContent),
  );
  expect(Math.min(...ticks)).toBe(0);
  expect(Math.max(...ticks)).toBeGreaterThanOrEqual(140);
  expect(Math.max(...ticks)).toBeLessThanOrEqual(160);
  expect(container.querySelectorAll('[data-wcl-chart-area]')).toHaveLength(2);
  expect(
    container.querySelector('[data-wcl-chart-marks]')?.parentElement?.getAttribute('clip-path'),
  ).toMatch(/url/);
});
it('previews visible category underlines during a drag without dropping offscreen selection', () => {
  const changed = vi.fn();
  const {container} = render(
    <ColumnChart
      {...common}
      {...vertical}
      interaction={{
        target: 'category',
        getRowId: (row) => row.id,
        selection: {
          labels: selectionLabels,
          defaultSelectedItems: [{rowId: 'm0'}],
          onSelectionChange: changed,
        },
      }}
    />,
  );
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    width: 640,
    height: 360,
    right: 640,
    bottom: 360,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
  const bar = (index: number) =>
    container.querySelector(`[data-wcl-chart-bar][data-series="a"][data-row-index="${index}"]`)!;
  const start = bar(1),
    end = bar(2);
  const at = (element: Element) => ({
    clientX: attribute(element, 'x') + attribute(element, 'width') / 2,
    clientY: attribute(element, 'y') + attribute(element, 'height') / 2,
  });
  fireEvent.pointerDown(svg, {
    ...at(start),
    button: 0,
    pointerId: 1,
    pointerType: 'mouse',
    isPrimary: true,
  });
  fireEvent.pointerMove(svg, {...at(end), pointerId: 1, pointerType: 'mouse'});
  expect(container.querySelectorAll('[data-wcl-chart-selected-category]')).toHaveLength(2);
  expect(container.querySelector('[data-wcl-chart-selection-box]')).toBeTruthy();
  expect(changed).not.toHaveBeenCalled();
  fireEvent.keyDown(container.querySelector('[data-wcl-chart-canvas]')!, {key: 'Escape'});
  expect(container.querySelector('[data-wcl-chart-selection]')?.textContent).toContain('m0');
  expect(container.querySelectorAll('[data-wcl-chart-selected-category]')).toHaveLength(0);
});
it('retains the window and canvas dimensions through all-hidden recovery', () => {
  const {container} = render(
    <BarChart
      {...common}
      xAxis={vertical.yAxis}
      yAxis={vertical.xAxis}
      visibilityLabels={visibilityLabels}
    />,
  );
  const frame = container.querySelector('[data-wcl-chart-frame]')!.getAttribute('style');
  fireEvent.click(screen.getByRole('button', {name: 'Hide A'}));
  fireEvent.click(screen.getByRole('button', {name: 'Hide B'}));
  expect(screen.getByText('All hidden')).toBeTruthy();
  expect(within(container.querySelector('table')!).getAllByRole('row')).toHaveLength(6);
  fireEvent.click(screen.getByRole('button', {name: 'Show all'}));
  expect(container.querySelector('[data-wcl-chart-exploration-range]')?.textContent).toBe(
    'Feb to Apr',
  );
  expect(container.querySelector('[data-wcl-chart-frame]')!.getAttribute('style')).toBe(frame);
  fireEvent.click(screen.getByRole('button', {name: 'Overview'}));
  expect(container.querySelector('[data-wcl-chart-frame]')!.getAttribute('style')).toBe(frame);
});
it('fits and targets a numeric column crossing the viewport edge', () => {
  const activate = vi.fn();
  const {container} = render(
    <ColumnChart
      {...common}
      data={[
        {id: 'edge', x: 0, a: 1000},
        {id: 'inside', x: 25, a: 10},
        {id: 'outside', x: 100, a: 20},
      ]}
      series={[{id: 'a', label: 'A', accessor: 'a'}]}
      xAxis={{label: 'Position', accessor: (row) => row.x, scale: {type: 'linear'}}}
      yAxis={vertical.yAxis}
      exploration={{
        labels: {...labels, range: ([first, last]) => `${first} to ${last}`},
        defaultWindow: [1, 50],
      }}
      interaction={{target: 'point', getRowId: (row) => row.id, onActivate: activate}}
    />,
  );
  const ticks = [...container.querySelectorAll('[data-axis="y"] [data-wcl-chart-tick-label]')].map(
    (tick) => Number(tick.textContent),
  );
  expect(Math.max(...ticks)).toBe(1000);
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(activate.mock.calls[0]![0]).toMatchObject({item: {rowId: 'edge', seriesId: 'a'}});
});

it('pans a focused horizontal bar chart along its vertical category axis', () => {
  const changed = vi.fn(),
    activated = vi.fn();
  const {container} = render(
    <BarChart
      {...common}
      xAxis={vertical.yAxis}
      yAxis={vertical.xAxis}
      exploration={{...common.exploration, onWindowChange: changed}}
      interaction={{target: 'category', getRowId: (row) => row.id, onActivate: activated}}
    />,
  );
  const canvas = screen.getByRole('group', {name: 'Monthly values'});
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  Object.defineProperty(svg, 'getBoundingClientRect', {value: () => new DOMRect(0, 0, 640, 360)});
  canvas.focus();
  const pointer = {
    pointerType: 'mouse',
    pointerId: 1,
    button: 1,
    buttons: 4,
    clientX: 250,
    clientY: 150,
  };
  fireEvent.pointerDown(svg, pointer);
  fireEvent.pointerMove(svg, {...pointer, clientY: -1000});
  expect(changed.mock.lastCall![0]).toEqual(['Mar', 'May']);
  fireEvent.pointerUp(svg, {...pointer, buttons: 0});
  expect(activated).not.toHaveBeenCalled();
});
