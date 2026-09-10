import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {act, cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {LineChart, type ChartExplorationLabels} from '../src/index.js';
afterEach(cleanup);
const labels: ChartExplorationLabels<number> = {
  overview: 'Overview',
  closeOverview: 'Close overview',
  done: 'Done',
  reset: 'Reset view',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  panBackward: 'Earlier',
  panForward: 'Later',
  window: 'Visible range',
  start: 'Range start',
  end: 'Range end',
  instructions: 'Drag the range.',
  range: ([a, b]) => `${a} to ${b}`,
};
const data = [
  {id: 'a', x: 0, y: 1000},
  {id: 'b', x: 25, y: 20},
  {id: 'c', x: 50, y: 40},
  {id: 'd', x: 75, y: 60},
  {id: 'e', x: 100, y: 800},
];
const common = {
  data,
  title: 'Readings',
  description: 'Recorded values',
  dataTableLabel: 'All readings',
  emptyState: {title: 'Empty', description: 'No values'},
  invalidData: {title: 'Invalid', description: 'Invalid values'},
  series: [{id: 'y', label: 'Value', accessor: 'y', showPoints: true}] as const,
  xAxis: {
    label: 'Position',
    accessor: (datum: {x: number}) => datum.x,
    scale: {type: 'linear'},
  } as const,
  yAxis: {label: 'Value', scale: {type: 'linear'}} as const,
};
it('changes a numeric window while retaining complete data and selections outside it', () => {
  const changed = vi.fn(),
    completed = vi.fn();
  const {container} = render(
    <LineChart
      {...common}
      exploration={{
        labels,
        defaultWindow: [25, 75],
        onWindowChange: changed,
        onWindowChangeEnd: completed,
      }}
      interaction={{
        target: 'category',
        getRowId: (d) => d.id,
        selection: {
          defaultSelectedItems: [{rowId: 'a'}],
          labels: {
            instructions: 'Select',
            clear: 'Clear selection',
            empty: 'Nothing',
            summary: (n) => `${n} selected`,
            item: (i) => i.rowId,
            hidden: (s) => `${s} hidden`,
          },
        },
      }}
    />,
  );
  expect(container.querySelector('[data-wcl-chart-selection]')?.textContent).toContain(
    '1 selected',
  );
  const table = container.querySelector('table')!;
  expect(within(table).getAllByRole('row')).toHaveLength(6);
  fireEvent.click(screen.getByRole('button', {name: 'Zoom in'}));
  expect(changed).toHaveBeenLastCalledWith([37.5, 62.5]);
  expect(completed).toHaveBeenLastCalledWith([37.5, 62.5]);
  expect(within(table).getAllByRole('row')).toHaveLength(6);
  expect(container.querySelector('[data-wcl-chart-selection]')?.textContent).toContain(
    '1 selected',
  );
  fireEvent.click(screen.getByRole('button', {name: 'Reset view'}));
  expect(changed).toHaveBeenLastCalledWith([0, 100]);
});
it('preserves Date callback values and waits for controlled updates', () => {
  const changed = vi.fn();
  const rows = data.map((d) => ({...d, x: new Date(d.x * 1000)}));
  const props = {
    ...common,
    data: rows,
    xAxis: {label: 'Time', accessor: 'x', scale: {type: 'time'}} as const,
  };
  const window = [new Date(25000), new Date(75000)] as const;
  const {container, rerender} = render(
    <LineChart
      {...props}
      exploration={{
        labels: {...labels, range: ([a, b]) => `${+a} to ${+b}`},
        window,
        onWindowChange: changed,
      }}
    />,
  );
  fireEvent.click(screen.getByRole('button', {name: 'Zoom in'}));
  expect(changed).toHaveBeenLastCalledWith([new Date(37500), new Date(62500)]);
  expect(container.querySelector('[data-wcl-chart-exploration-controls]')?.textContent).toContain(
    '25000 to 75000',
  );
  rerender(
    <LineChart
      {...props}
      exploration={{
        labels: {...labels, range: ([a, b]) => `${+a} to ${+b}`},
        window: [new Date(37500), new Date(62500)],
        onWindowChange: changed,
      }}
    />,
  );
  expect(container.querySelector('[data-wcl-chart-exploration-controls]')?.textContent).toContain(
    '37500 to 62500',
  );
});
it('rejects invalid windows clearly', () => {
  expect(() =>
    render(<LineChart {...common} exploration={{labels, defaultWindow: [75, 25]}} />),
  ).toThrow(/window/i);
});
it('keeps crossing lines in an empty-observation window and fits their visible values', () => {
  const {container} = render(
    <LineChart
      {...common}
      data={[
        {id: 'a', x: 0, y: 0},
        {id: 'b', x: 100, y: 100},
      ]}
      exploration={{labels, defaultWindow: [40, 60]}}
    />,
  );
  expect(screen.getByRole('button', {name: 'Overview'})).toBeTruthy();
  const ticks = [...container.querySelectorAll('[data-axis="y"] [data-wcl-chart-tick-label]')].map(
    (el) => Number(el.textContent),
  );
  expect(Math.min(...ticks)).toBeGreaterThanOrEqual(40);
  expect(Math.max(...ticks)).toBeLessThanOrEqual(60);
  expect(
    container.querySelector('[data-wcl-chart-marks]')?.parentElement?.getAttribute('clip-path'),
  ).toMatch(/url/);
});
it('uses two touches to pan without committing a selection', () => {
  class TestPointerEvent extends MouseEvent {
    readonly pointerId: number;
    readonly pointerType: string;
    readonly isPrimary: boolean;
    constructor(type: string, init: PointerEventInit) {
      super(type, init);
      this.pointerId = init.pointerId ?? 0;
      this.pointerType = init.pointerType ?? 'touch';
      this.isPrimary = init.isPrimary ?? true;
    }
  }
  vi.stubGlobal('PointerEvent', TestPointerEvent);
  const changed = vi.fn(),
    selected = vi.fn();
  const {container} = render(
    <LineChart
      {...common}
      exploration={{labels, defaultWindow: [25, 75], onWindowChange: changed}}
      interaction={{
        target: 'category',
        getRowId: (d) => d.id,
        selection: {
          onSelectionChange: selected,
          labels: {
            instructions: 'Select',
            clear: 'Clear selection',
            empty: 'Nothing',
            summary: (n) => `${n} selected`,
            item: (i) => i.rowId,
            hidden: (s) => `${s} hidden`,
          },
        },
      }}
    />,
  );
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: 640,
    bottom: 360,
    width: 640,
    height: 360,
    toJSON: () => ({}),
  });
  fireEvent.pointerDown(svg, {
    pointerId: 1,
    pointerType: 'touch',
    clientX: 270,
    clientY: 100,
    button: 0,
    isPrimary: true,
  });
  fireEvent.pointerDown(svg, {
    pointerId: 2,
    pointerType: 'touch',
    clientX: 420,
    clientY: 100,
    button: 0,
    isPrimary: false,
  });
  fireEvent.pointerMove(svg, {pointerId: 1, pointerType: 'touch', clientX: 220, clientY: 100});
  fireEvent.pointerMove(svg, {pointerId: 2, pointerType: 'touch', clientX: 370, clientY: 100});
  fireEvent.pointerUp(svg, {pointerId: 2, pointerType: 'touch', clientX: 370, clientY: 100});
  fireEvent.pointerUp(svg, {pointerId: 1, pointerType: 'touch', clientX: 220, clientY: 100});
  expect(changed).toHaveBeenCalled();
  const range = changed.mock.calls.at(-1)![0] as number[];
  expect(range[0]).toBeGreaterThan(25);
  expect(range[1]! - range[0]!).toBeCloseTo(50);
  expect(selected).not.toHaveBeenCalled();
  vi.unstubAllGlobals();
});
it('keeps zoomed domain values through data updates and follows new bounds after reset', () => {
  const {container, rerender} = render(
    <LineChart {...common} exploration={{labels, defaultWindow: [25, 75]}} />,
  );
  const updated = [...data, {id: 'f', x: 200, y: 200}];
  rerender(
    <LineChart {...common} data={updated} exploration={{labels, defaultWindow: [25, 75]}} />,
  );
  expect(container.querySelector('[data-wcl-chart-exploration-range]')?.textContent).toBe(
    '25 to 75',
  );
  fireEvent.click(screen.getByRole('button', {name: 'Reset view'}));
  expect(container.querySelector('[data-wcl-chart-exploration-range]')?.textContent).toBe(
    '0 to 200',
  );
  rerender(
    <LineChart {...common} data={[...updated, {id: 'g', x: 300, y: 200}]} exploration={{labels}} />,
  );
  expect(container.querySelector('[data-wcl-chart-exploration-range]')?.textContent).toBe(
    '0 to 300',
  );
});
it('uses logarithmic spacing and keeps explicit value limits', () => {
  const changed = vi.fn();
  const {container} = render(
    <LineChart
      {...common}
      data={[
        {id: 'a', x: 1, y: 1},
        {id: 'b', x: 10000, y: 100},
      ]}
      xAxis={{label: 'Position', accessor: (d) => d.x, scale: {type: 'logarithmic'}}}
      yAxis={{label: 'Value', scale: {type: 'linear', domain: [0, 1000]}}}
      exploration={{labels, onWindowChange: changed}}
    />,
  );
  fireEvent.click(screen.getByRole('button', {name: 'Zoom in'}));
  const range = changed.mock.calls.at(-1)![0] as number[];
  expect(range[0]).toBeCloseTo(10);
  expect(range[1]).toBeCloseTo(1000);
  const ticks = [...container.querySelectorAll('[data-axis="y"] [data-wcl-chart-tick-label]')].map(
    (el) => Number(el.textContent),
  );
  expect(Math.max(...ticks)).toBe(1000);
});
it('keyboard activation identifies the first visible source item', () => {
  const activate = vi.fn();
  const {container} = render(
    <LineChart
      {...common}
      exploration={{labels, defaultWindow: [25, 75]}}
      interaction={{target: 'category', getRowId: (d) => d.id, onActivate: activate}}
    />,
  );
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(activate.mock.calls[0]![0]).toMatchObject({datum: data[1], category: 25});
  fireEvent.keyDown(canvas, {key: 'End'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(activate.mock.calls[1]![0]).toMatchObject({datum: data[3], category: 75});
});
it('clips categorical windows to complete recorded categories', () => {
  const {container} = render(
    <LineChart
      {...common}
      data={data.map((d) => ({...d, x: d.id}))}
      xAxis={{label: 'Category', accessor: (d) => d.x, scale: {type: 'categorical'}}}
      exploration={{
        labels: {...labels, range: ([a, b]) => `${a} to ${b}`},
        defaultWindow: ['b', 'd'],
      }}
    />,
  );
  expect(container.querySelectorAll('[data-wcl-chart-point]')).toHaveLength(3);
  const ticks = [...container.querySelectorAll('[data-axis="y"] [data-wcl-chart-tick-label]')].map(
    (el) => Number(el.textContent),
  );
  expect(Math.max(...ticks)).toBe(60);
});

it('hydrates an initial window without replacing the server chart', async () => {
  const specimen = <LineChart {...common} exploration={{labels, defaultWindow: [25, 75]}} />;
  const element = document.createElement('div');
  document.body.append(element);
  element.innerHTML = renderToString(specimen);
  const original = element.querySelector('svg');
  const errors: unknown[] = [];
  let root: ReturnType<typeof hydrateRoot>;
  await act(async () => {
    root = hydrateRoot(element, specimen, {onRecoverableError: (error) => errors.push(error)});
    await Promise.resolve();
  });
  expect(errors).toEqual([]);
  expect(element.querySelector('svg')).toBe(original);
  fireEvent.click(within(element).getByRole('button', {name: 'Zoom in'}));
  expect(element.querySelector('[data-wcl-chart-exploration-range]')?.textContent).toBe(
    '37.5 to 62.5',
  );
  await act(async () => {
    root.unmount();
    await Promise.resolve();
  });
  element.remove();
});
it('retains the requested initial window while source data is loading', () => {
  const {container, rerender} = render(
    <LineChart
      {...common}
      data={data.slice(0, 0)}
      status={{kind: 'loading', label: 'Loading'}}
      exploration={{labels, defaultWindow: [25, 75]}}
    />,
  );
  rerender(<LineChart {...common} exploration={{labels, defaultWindow: [25, 75]}} />);
  expect(container.querySelector('[data-wcl-chart-exploration-range]')?.textContent).toBe(
    '25 to 75',
  );
});
it('cancels overview dragging when its source data changes', () => {
  const changed = vi.fn();
  const {rerender} = render(
    <LineChart
      {...common}
      exploration={{labels, defaultWindow: [25, 75], onWindowChange: changed}}
    />,
  );
  fireEvent.click(screen.getByRole('button', {name: 'Overview'}));
  const navigator = document.querySelector<HTMLDivElement>(
    '[data-wcl-chart-exploration-navigator]',
  )!;
  vi.spyOn(navigator, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: 400,
    bottom: 80,
    width: 400,
    height: 80,
    toJSON: () => ({}),
  });
  fireEvent.pointerDown(screen.getByRole('slider', {name: 'Visible range'}), {
    button: 0,
    pointerId: 1,
    clientX: 200,
  });
  fireEvent.pointerMove(navigator, {pointerId: 1, clientX: 220});
  rerender(
    <LineChart
      {...common}
      data={[...data, {id: 'f', x: 200, y: 200}]}
      exploration={{labels, onWindowChange: changed}}
    />,
  );
  changed.mockClear();
  fireEvent.pointerMove(navigator, {pointerId: 1, clientX: 260});
  fireEvent.pointerUp(navigator, {pointerId: 1, clientX: 260});
  expect(changed).not.toHaveBeenCalled();
});
it('pans a one-category window to each neighboring category', () => {
  const {container} = render(
    <LineChart
      {...common}
      data={data.map((d) => ({...d, x: d.id}))}
      xAxis={{label: 'Category', accessor: (d) => d.x, scale: {type: 'categorical'}}}
      exploration={{
        labels: {...labels, range: ([a, b]) => `${a} to ${b}`},
        defaultWindow: ['c', 'c'],
      }}
    />,
  );
  fireEvent.click(screen.getByRole('button', {name: 'Earlier'}));
  expect(container.querySelector('[data-wcl-chart-exploration-range]')?.textContent).toBe('b to b');
  fireEvent.click(screen.getByRole('button', {name: 'Later'}));
  expect(container.querySelector('[data-wcl-chart-exploration-range]')?.textContent).toBe('c to c');
});
it('keeps surviving categories in view when their order reverses', () => {
  const props = {
    ...common,
    data: data.map((d) => ({...d, x: d.id})),
    xAxis: {
      label: 'Category',
      accessor: (d: {x: string}) => d.x,
      scale: {type: 'categorical'},
    } as const,
  };
  const exploration = {
    labels: {...labels, range: ([a, b]: readonly [string, string]) => `${a} to ${b}`},
    defaultWindow: ['b', 'd'] as const,
  };
  const {container, rerender} = render(<LineChart {...props} exploration={exploration} />);
  rerender(<LineChart {...props} data={[...props.data].reverse()} exploration={exploration} />);
  expect(container.querySelector('[data-wcl-chart-exploration-range]')?.textContent).toBe('d to b');
  expect(container.querySelectorAll('[data-wcl-chart-point]')).toHaveLength(3);
});
it('zooms when a pinch spreads vertically as well as horizontally', () => {
  const changed = vi.fn();
  const {container} = render(
    <LineChart
      {...common}
      exploration={{labels, defaultWindow: [25, 75], onWindowChange: changed}}
    />,
  );
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: 640,
    bottom: 360,
    width: 640,
    height: 360,
    toJSON: () => ({}),
  });
  fireEvent.pointerDown(svg, {
    button: 0,
    pointerId: 1,
    pointerType: 'touch',
    clientX: 300,
    clientY: 80,
  });
  fireEvent.pointerDown(svg, {
    button: 0,
    pointerId: 2,
    pointerType: 'touch',
    clientX: 300,
    clientY: 180,
  });
  fireEvent.pointerMove(svg, {pointerId: 1, pointerType: 'touch', clientX: 300, clientY: 30});
  fireEvent.pointerMove(svg, {pointerId: 2, pointerType: 'touch', clientX: 300, clientY: 230});
  fireEvent.pointerUp(svg, {pointerId: 1, pointerType: 'touch', clientX: 300, clientY: 30});
  fireEvent.pointerUp(svg, {pointerId: 2, pointerType: 'touch', clientX: 300, clientY: 230});
  expect(changed).toHaveBeenCalled();
  const range = changed.mock.calls.at(-1)![0] as number[];
  expect(range[1]! - range[0]!).toBeCloseTo(25);
});
