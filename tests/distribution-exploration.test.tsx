import {cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {
  Histogram,
  BoxPlot,
  type ChartDomainValue,
  type ChartExplorationLabels,
} from '../src/index.js';
afterEach(cleanup);
const copy = {
  title: 'Distribution',
  description: 'Recorded values',
  dataTableLabel: 'All data',
  emptyState: {title: 'Empty', description: 'No data'},
  invalidData: {title: 'Invalid', description: 'Fix data'},
};
const labels = <V extends ChartDomainValue>(): ChartExplorationLabels<V> => ({
  overview: 'Overview',
  closeOverview: 'Close overview',
  done: 'Done',
  reset: 'Reset view',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  panBackward: 'Earlier',
  panForward: 'Later',
  window: 'Visible range',
  start: 'Start',
  end: 'End',
  instructions: 'Drag the window or its edges.',
  range: ([a, b]) => `${String(a)} to ${String(b)}`,
});
const bins = [
  {lower: 0, upper: 40, count: 2},
  {lower: 40, upper: 80, count: 5},
  {lower: 80, upper: 120, count: 8},
];
const histogram = {
  ...copy,
  data: bins,
  distribution: {
    kind: 'binned',
    lowerAccessor: 'lower',
    upperAccessor: 'upper',
    ordinate: 'count',
    ordinateAccessor: 'count',
  },
  xAxis: {label: 'Latency', scale: {type: 'linear'}},
  yAxis: {label: 'Count', scale: {type: 'linear'}},
} as const;
it('windows complete original bins without changing counts or table rows', () => {
  const {container} = render(
    <Histogram {...histogram} exploration={{labels: labels(), defaultWindow: [40, 80]}} />,
  );
  const marks = container.querySelectorAll('[data-wcl-histogram-bin]');
  expect(marks).toHaveLength(1);
  expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(4);
  fireEvent.click(screen.getByRole('button', {name: 'Overview'}));
  expect(screen.getByRole('dialog')).toBeTruthy();
});
it('returns bin edges when zooming so a window never cuts through a bin', () => {
  const changed = vi.fn<(range: readonly [number, number]) => void>();
  render(<Histogram {...histogram} exploration={{labels: labels(), onWindowChange: changed}} />);
  fireEvent.click(screen.getByRole('button', {name: 'Zoom in'}));
  expect(changed).toHaveBeenCalledTimes(1);
  for (const value of changed.mock.lastCall![0]) expect([0, 40, 80, 120]).toContain(value);
  expect(changed.mock.lastCall![0][0]).toBeLessThan(changed.mock.lastCall![0][1]);
});
it('navigates box groups by stable IDs and keeps complete summaries in the table', () => {
  const data = Array.from({length: 3}, (_, i) => ({
    group: ['north', 'south', 'east'][i]!,
    lower: 10,
    q1: 20,
    median: 30,
    q3: 40,
    upper: 50,
    outliers: [80],
  }));
  const changed = vi.fn();
  const {container} = render(
    <BoxPlot
      {...copy}
      data={data}
      groupAccessor="group"
      legend={{label: 'Groups'}}
      groups={[
        {id: 'north', label: 'North'},
        {id: 'south', label: 'South'},
        {id: 'east', label: 'East'},
      ]}
      distribution={{
        kind: 'summary',
        lowerWhiskerAccessor: 'lower',
        q1Accessor: 'q1',
        medianAccessor: 'median',
        q3Accessor: 'q3',
        upperWhiskerAccessor: 'upper',
        outliersAccessor: 'outliers',
        whisker: 'tukey',
      }}
      xAxis={{label: 'Group'}}
      yAxis={{label: 'Value', scale: {type: 'linear'}}}
      exploration={{labels: labels(), defaultWindow: ['south', 'south'], onWindowChange: changed}}
    />,
  );
  expect(container.querySelectorAll('[data-wcl-box-summary]')).toHaveLength(1);
  expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(4);
  fireEvent.click(screen.getByRole('button', {name: 'Later'}));
  expect(changed).toHaveBeenLastCalledWith(['east', 'east']);
});

it('snaps caller windows outward to complete source bins and activates their original data', () => {
  const onActivate = vi.fn();
  const {container} = render(
    <Histogram
      {...histogram}
      exploration={{labels: labels(), defaultWindow: [45, 75]}}
      interaction={{onActivate}}
    />,
  );
  expect(container.querySelectorAll('[data-wcl-histogram-bin]')).toHaveLength(1);
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(onActivate).toHaveBeenCalledWith(
    expect.objectContaining({
      item: {kind: 'bin', lower: 40, upper: 80, upperInclusive: false},
      value: 5,
      ordinate: 'count',
      source: {kind: 'binned', datum: bins[1]},
    }),
  );
});

it('keeps a histogram selection outside the window and shows every source bin in Overview', () => {
  const {container} = render(
    <Histogram
      {...histogram}
      exploration={{labels: labels(), defaultWindow: [40, 80]}}
      interaction={{
        selection: {
          defaultSelectedItems: [{kind: 'bin', lower: 0, upper: 40, upperInclusive: false}],
          labels: {
            instructions: 'Select bins',
            clear: 'Clear',
            empty: 'None',
            summary: (n) => `${n} selected`,
            item: (item) => `${item.lower} to ${item.upper}`,
            hidden: (label) => label,
          },
        },
      }}
    />,
  );
  expect(container.querySelectorAll('[data-wcl-histogram-bin]')).toHaveLength(1);
  expect(container.querySelector('[data-wcl-chart-selection]')?.textContent).toContain('0 to 40');
  fireEvent.click(screen.getByRole('button', {name: 'Overview'}));
  expect(screen.getByRole('dialog').querySelectorAll('[data-wcl-histogram-bin]')).toHaveLength(3);
});

const unequalHistogram = {
  ...histogram,
  data: [
    {lower: 0, upper: 90, count: 1},
    {lower: 90, upper: 100, count: 2},
  ],
  distribution: {...histogram.distribution, ordinate: 'density'},
} as const;
it('disables zooming in when one complete unequal-width bin is visible', () => {
  render(
    <Histogram {...unequalHistogram} exploration={{labels: labels(), defaultWindow: [0, 90]}} />,
  );
  expect(screen.getByRole('button', {name: 'Zoom in'}).hasAttribute('disabled')).toBe(true);
});
it('pans from a wide density bin to the next complete narrow bin', () => {
  const changed = vi.fn<(range: readonly [number, number]) => void>();
  render(
    <Histogram
      {...unequalHistogram}
      exploration={{labels: labels(), defaultWindow: [0, 90], onWindowChange: changed}}
    />,
  );
  fireEvent.click(screen.getByRole('button', {name: 'Later'}));
  expect(changed).toHaveBeenLastCalledWith([90, 100]);
});

it('keeps source group IDs available to range labels while every group is hidden', () => {
  const names = new Map([
    ['north', 'North'],
    ['south', 'South'],
  ]);
  render(
    <BoxPlot
      {...copy}
      data={[
        {group: 'north', value: 10},
        {group: 'south', value: 20},
      ]}
      groupAccessor="group"
      groups={[
        {id: 'north', label: 'North'},
        {id: 'south', label: 'South'},
      ]}
      legend={{label: 'Groups'}}
      distribution={{kind: 'raw', valueAccessor: 'value', whisker: 'min-max'}}
      xAxis={{label: 'Group'}}
      yAxis={{label: 'Value', scale: {type: 'linear'}}}
      exploration={{
        labels: {
          ...labels<string>(),
          range: ([first, last]) => {
            const start = names.get(first),
              end = names.get(last);
            if (!start || !end) throw new Error('Range labels require source group IDs');
            return `${start} to ${end}`;
          },
        },
      }}
      visibilityLabels={{
        hideSeries: (name) => `Hide ${name}`,
        showSeries: (name) => `Show ${name}`,
        hidden: 'Hidden',
        showAll: 'Show all',
        allHidden: {title: 'All groups hidden', description: 'Restore a group.'},
      }}
    />,
  );
  fireEvent.click(screen.getByRole('button', {name: 'Hide North'}));
  fireEvent.click(screen.getByRole('button', {name: 'Hide South'}));
  expect(screen.getByText('All groups hidden')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', {name: 'Show North'}));
  expect(screen.getByRole('button', {name: 'Overview'})).toBeTruthy();
});

it('retains explicit histogram reset bounds beyond the prepared bins', () => {
  const changed = vi.fn<(range: readonly [number, number]) => void>();
  const {container} = render(
    <Histogram
      {...histogram}
      data={bins.slice(1)}
      xAxis={{label: 'Latency', scale: {type: 'linear', domain: [0, 200]}}}
      exploration={{labels: labels(), onWindowChange: changed}}
    />,
  );
  expect(container.querySelector('[data-wcl-chart-exploration-range]')?.textContent).toBe(
    '0 to 200',
  );
  fireEvent.click(screen.getByRole('button', {name: 'Zoom in'}));
  fireEvent.click(screen.getByRole('button', {name: 'Reset view'}));
  expect(changed).toHaveBeenLastCalledWith([0, 200]);
});
it('reconciles a controlled box window when its endpoint is hidden', () => {
  const {container} = render(
    <BoxPlot
      {...copy}
      data={[
        {group: 'north', value: 10},
        {group: 'south', value: 20},
        {group: 'east', value: 30},
      ]}
      groups={[
        {id: 'north', label: 'North'},
        {id: 'south', label: 'South'},
        {id: 'east', label: 'East'},
      ]}
      groupAccessor="group"
      distribution={{kind: 'raw', valueAccessor: 'value'}}
      legend={{label: 'Groups'}}
      xAxis={{label: 'Group'}}
      yAxis={{label: 'Value', scale: {type: 'linear'}}}
      exploration={{labels: labels(), window: ['north', 'south'], onWindowChange: () => {}}}
      visibilityLabels={{
        hideSeries: (s) => `Hide ${s}`,
        showSeries: (s) => `Show ${s}`,
        hidden: 'Hidden',
        showAll: 'Show all',
        allHidden: {title: 'All hidden', description: 'Restore groups'},
      }}
    />,
  );
  fireEvent.click(screen.getByRole('button', {name: 'Hide North'}));
  expect(container.querySelector('[data-wcl-chart-exploration-range]')?.textContent).toBe(
    'south to south',
  );
  fireEvent.click(screen.getByRole('button', {name: 'Show North'}));
  expect(container.querySelector('[data-wcl-chart-exploration-range]')?.textContent).toBe(
    'north to south',
  );
});
it('moves a histogram overview by two complete bins with Shift', () => {
  const changed = vi.fn<(range: readonly [number, number]) => void>();
  render(
    <Histogram
      {...histogram}
      data={Array.from({length: 10}, (_, i) => ({lower: i * 10, upper: (i + 1) * 10, count: 1}))}
      exploration={{labels: labels(), defaultWindow: [0, 10], onWindowChange: changed}}
    />,
  );
  fireEvent.click(screen.getByRole('button', {name: 'Overview'}));
  fireEvent.keyDown(screen.getByRole('slider', {name: 'Visible range'}), {
    key: 'ArrowRight',
    shiftKey: true,
  });
  expect(changed).toHaveBeenLastCalledWith([20, 30]);
});

it('can zoom into a single bin when the explicit full range includes empty margins', () => {
  const {container} = render(
    <Histogram
      {...histogram}
      data={[bins[1]!]}
      xAxis={{label: 'Latency', scale: {type: 'linear', domain: [0, 200]}}}
      exploration={{labels: labels()}}
    />,
  );
  const zoom = screen.getByRole('button', {name: 'Zoom in'});
  expect((zoom as HTMLButtonElement).disabled).toBe(false);
  fireEvent.click(zoom);
  expect(container.querySelector('[data-wcl-chart-exploration-range]')?.textContent).toBe(
    '40 to 80',
  );
  expect((zoom as HTMLButtonElement).disabled).toBe(true);
});

it('respects the minimum histogram span when explicit bounds add empty margins', () => {
  const changed = vi.fn<(range: readonly [number, number]) => void>();
  const {container} = render(
    <Histogram
      {...histogram}
      data={[bins[1]!]}
      xAxis={{label: 'Latency', scale: {type: 'linear', domain: [0, 200]}}}
      exploration={{labels: labels(), minimumSpan: 0.5, onWindowChange: changed}}
    />,
  );
  fireEvent.click(screen.getByRole('button', {name: 'Zoom in'}));
  const [start, end] = changed.mock.lastCall![0];
  expect(end - start).toBeGreaterThanOrEqual(100);
  expect(start).toBeLessThanOrEqual(40);
  expect(end).toBeGreaterThanOrEqual(80);
  expect(container.querySelector('[data-wcl-chart-exploration-range]')?.textContent).toBe(
    `${start} to ${end}`,
  );
});
