import {act, cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {
  ScatterChart,
  BubbleChart,
  type ChartRectangularWindow,
  type PointChartActivation,
  type ChartRectangularExplorationLabels,
} from '../src/index.js';
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
const labels: ChartRectangularExplorationLabels<number, number> = {
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
  window: 'Visible area',
  instructions: 'Drag the area or a corner.',
  corner: (c) => `Resize ${c}`,
  range: (r) => JSON.stringify(r),
};
const data = [
  {id: 'a', label: 'A', x: 0, y: 0, size: 100},
  {id: 'b', label: 'B', x: 25, y: 25, size: 10},
  {id: 'c', label: 'C', x: 50, y: 50, size: 20},
  {id: 'd', label: 'D', x: 75, y: 75, size: 30},
  {id: 'e', label: 'E', x: 100, y: 100, size: 200},
];
const common = {
  data,
  title: 'Observations',
  description: 'Recorded positions',
  dataTableLabel: 'All observations',
  emptyState: {title: 'Empty', description: 'No observations'},
  invalidData: {title: 'Invalid', description: 'Invalid observations'},
  idAccessor: 'id',
  labelAccessor: 'label',
  series: [{id: 'points', label: 'Points'}],
  xAxis: {accessor: 'x', label: 'X', scale: {type: 'linear'}},
  yAxis: {accessor: 'y', label: 'Y', scale: {type: 'linear'}},
} as const;
it('changes a rectangular domain while preserving full observations and outside selection', () => {
  const changed = vi.fn<(window: ChartRectangularWindow<number, number>) => void>(),
    completed = vi.fn();
  const {container} = render(
    <ScatterChart
      {...common}
      exploration={{
        labels,
        defaultWindow: {x: [25, 75], y: [25, 75]},
        onWindowChange: changed,
        onWindowChangeEnd: completed,
      }}
      interaction={{
        selection: {
          defaultSelectedItems: [{rowId: 'a', seriesId: 'points'}],
          labels: {
            instructions: 'Select points',
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
  const table = container.querySelector('table')!;
  expect(within(table).getAllByRole('row')).toHaveLength(6);
  fireEvent.click(screen.getByRole('button', {name: 'Zoom in'}));
  expect(changed).toHaveBeenLastCalledWith({x: [37.5, 62.5], y: [37.5, 62.5]});
  expect(completed).toHaveBeenLastCalledWith({x: [37.5, 62.5], y: [37.5, 62.5]});
  expect(container.querySelector('[data-wcl-chart-selection]')?.textContent).toContain(
    '1 selected',
  );
  expect(within(table).getAllByRole('row')).toHaveLength(6);
});
it('keeps bubble magnitude scale independent of the viewport', () => {
  const {container} = render(
    <BubbleChart
      {...common}
      magnitude={{accessor: 'size', label: 'Size'}}
      exploration={{labels}}
    />,
  );
  const point = container.querySelector('[data-point-id="c"]');
  const radius = Number(point?.getAttribute('data-mark-radius'));
  expect(radius).toBeGreaterThan(0);
  expect(point).not.toBeNull();
  fireEvent.click(screen.getByRole('button', {name: 'Zoom in'}));
  expect(
    Number(container.querySelector('[data-point-id="c"]')?.getAttribute('data-mark-radius')),
  ).toBe(radius);
});
it('keeps empty numeric windows navigable without inventing a keyboard target', () => {
  const activate = vi.fn<(activation: PointChartActivation<(typeof data)[number]>) => void>();
  const {container} = render(
    <ScatterChart
      {...common}
      exploration={{labels, defaultWindow: {x: [30, 40], y: [60, 70]}}}
      interaction={{onActivate: activate}}
    />,
  );
  expect(screen.getByRole('button', {name: 'Overview'})).toBeTruthy();
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(activate).not.toHaveBeenCalled();
  expect(container.querySelectorAll('[data-wcl-chart-axis]')).toHaveLength(2);
});
it('rejects an invalid rectangular window', () => {
  expect(() =>
    render(
      <ScatterChart
        {...common}
        exploration={{labels, defaultWindow: {x: [75, 25], y: [25, 75]}}}
      />,
    ),
  ).toThrow(/window/i);
});

it('limits keyboard targets to the window and shows outside selections in the full map', () => {
  const activate = vi.fn<(activation: PointChartActivation<(typeof data)[number]>) => void>();
  const {container} = render(
    <ScatterChart
      {...common}
      exploration={{labels, defaultWindow: {x: [25, 75], y: [25, 75]}}}
      interaction={{
        onActivate: activate,
        selection: {
          defaultSelectedItems: [{rowId: 'a', seriesId: 'points'}],
          labels: {
            instructions: 'Select points',
            clear: 'Clear',
            empty: 'None',
            summary: (n) => `${n} selected`,
            item: (i) => i.rowId,
            hidden: (l) => l,
          },
        },
      }}
    />,
  );
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'Enter', ctrlKey: true});
  expect(activate.mock.lastCall?.[0].item.rowId).toBe('b');
  fireEvent.keyDown(canvas, {key: 'End'});
  fireEvent.keyDown(canvas, {key: 'Enter', metaKey: true});
  expect(activate.mock.lastCall?.[0].item.rowId).toBe('d');
  fireEvent.click(screen.getByRole('button', {name: 'Overview'}));
  const dialog = screen.getByRole('dialog');
  expect(dialog.querySelectorAll('[data-wcl-statistical-mark]')).toHaveLength(5);
  expect(dialog.querySelector('[data-wcl-point-cue="selection"]')).not.toBeNull();
});

it('cancels selection and hold when a second finger starts navigation', () => {
  vi.useFakeTimers();
  const activate = vi.fn<(activation: PointChartActivation<(typeof data)[number]>) => void>(),
    selected = vi.fn(),
    changed = vi.fn();
  const {container} = render(
    <ScatterChart
      {...common}
      exploration={{labels, onWindowChange: changed}}
      interaction={{
        onActivate: activate,
        selection: {
          onSelectionChange: selected,
          labels: {
            instructions: 'Select points',
            clear: 'Clear',
            empty: 'None',
            summary: (n) => `${n} selected`,
            item: (i) => i.rowId,
            hidden: (l) => l,
          },
        },
      }}
    />,
  );
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  Object.defineProperty(svg, 'getBoundingClientRect', {value: () => new DOMRect(0, 0, 640, 360)});
  const mark = container.querySelector('[data-point-id="c"] circle')!;
  const at = {clientX: Number(mark.getAttribute('cx')), clientY: Number(mark.getAttribute('cy'))};
  fireEvent.pointerDown(svg, {
    ...at,
    pointerId: 1,
    pointerType: 'touch',
    button: 0,
    isPrimary: true,
  });
  fireEvent.pointerDown(svg, {
    ...at,
    clientX: at.clientX + 40,
    pointerId: 2,
    pointerType: 'touch',
    button: 0,
    isPrimary: false,
  });
  fireEvent.pointerMove(svg, {...at, clientX: at.clientX + 80, pointerId: 2, pointerType: 'touch'});
  act(() => {
    vi.advanceTimersByTime(510);
  });
  fireEvent.pointerUp(svg, {...at, pointerId: 1, pointerType: 'touch'});
  fireEvent.pointerUp(svg, {...at, pointerId: 2, pointerType: 'touch'});
  expect(changed).toHaveBeenCalled();
  expect(activate).not.toHaveBeenCalled();
  expect(selected).not.toHaveBeenCalled();
});

it('rejects a rectangular window missing one axis for JavaScript callers', () => {
  expect(() =>
    render(
      <ScatterChart
        {...common}
        exploration={{
          labels,
          // @ts-expect-error JavaScript callers can supply a malformed rectangle.
          window: {x: [25, 75]},
          onWindowChange: () => {},
        }}
      />,
    ),
  ).toThrow(/window.*(axis|axes|x|y)|rectang/i);
});

it('cancels an active touch viewport gesture when source data is replaced', () => {
  const changed = vi.fn<(window: ChartRectangularWindow<number, number>) => void>();
  const exploration = {labels, onWindowChange: changed};
  const {container, rerender} = render(<ScatterChart {...common} exploration={exploration} />);
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  Object.defineProperty(svg, 'getBoundingClientRect', {value: () => new DOMRect(0, 0, 640, 360)});
  const touch = {pointerType: 'touch', button: 0, clientY: 150};
  fireEvent.pointerDown(svg, {...touch, clientX: 250, pointerId: 1, isPrimary: true});
  fireEvent.pointerDown(svg, {...touch, clientX: 350, pointerId: 2, isPrimary: false});
  fireEvent.pointerMove(svg, {...touch, clientX: 400, pointerId: 2});
  expect(changed).toHaveBeenCalled();
  changed.mockClear();
  rerender(<ScatterChart {...common} data={[...data]} exploration={exploration} />);
  fireEvent.pointerMove(svg, {...touch, clientX: 450, pointerId: 2});
  fireEvent.pointerUp(svg, {...touch, clientX: 250, pointerId: 1});
  fireEvent.pointerUp(svg, {...touch, clientX: 450, pointerId: 2});
  expect(changed).not.toHaveBeenCalled();
});

it('zooms logarithmic axes in transformed space without changing plot dimensions', () => {
  const changed = vi.fn<(window: ChartRectangularWindow<number, number>) => void>();
  const {container} = render(
    <ScatterChart
      {...common}
      data={[
        {...data[0]!, x: 1, y: 1},
        {...data[2]!, x: 10, y: 10},
        {...data[4]!, x: 100, y: 100},
      ]}
      xAxis={{accessor: 'x', label: 'X', scale: {type: 'logarithmic'}}}
      yAxis={{accessor: 'y', label: 'Y', scale: {type: 'logarithmic'}}}
      exploration={{labels, onWindowChange: changed}}
    />,
  );
  const plot = container.querySelector('[data-wcl-chart-hit-region]')!;
  const before = ['x', 'y', 'width', 'height'].map((name) => plot.getAttribute(name));
  fireEvent.click(screen.getByRole('button', {name: 'Zoom in'}));
  const range = changed.mock.lastCall![0];
  expect(range.x[0]).toBeCloseTo(Math.sqrt(10));
  expect(range.x[1]).toBeCloseTo(Math.sqrt(1000));
  expect(range.y).toEqual(range.x);
  expect(['x', 'y', 'width', 'height'].map((name) => plot.getAttribute(name))).toEqual(before);
});

it('preserves visible-group bubble sizing when a group is hidden during exploration', () => {
  const {container} = render(
    <BubbleChart
      {...common}
      data={data.map((point) => ({...point, group: point.id === 'e' ? 'large' : 'small'}))}
      series={[
        {id: 'small', label: 'Small'},
        {id: 'large', label: 'Large'},
      ]}
      seriesAccessor="group"
      legend={{label: 'Groups'}}
      magnitude={{accessor: 'size', label: 'Size'}}
      exploration={{labels}}
      visibilityLabels={{
        hideSeries: (s) => `Hide ${s}`,
        showSeries: (s) => `Show ${s}`,
        hidden: 'Hidden',
        showAll: 'Show all',
        allHidden: {title: 'All hidden', description: 'Restore groups'},
      }}
    />,
  );
  const radius = () =>
    Number(container.querySelector('[data-point-id="c"]')!.getAttribute('data-mark-radius'));
  const before = radius();
  fireEvent.click(screen.getByRole('button', {name: 'Hide Large'}));
  expect(radius()).toBeGreaterThan(before);
  const hidden = radius();
  fireEvent.click(screen.getByRole('button', {name: 'Zoom in'}));
  expect(radius()).toBe(hidden);
});

it('clips exploring bubble marks to the plot so axes stay clear', () => {
  const {container} = render(
    <BubbleChart
      {...common}
      magnitude={{accessor: 'size', label: 'Size'}}
      exploration={{labels}}
    />,
  );
  const mark = container.querySelector('[data-point-id="e"]')!;
  const clipped = mark.closest('g[clip-path]')!;
  const clipId = clipped.getAttribute('clip-path')!.slice(5, -1);
  const rect = Array.from(container.querySelectorAll('clipPath'))
    .find((clip) => clip.id === clipId)!
    .querySelector('rect')!;
  const plot = container.querySelector('[data-wcl-chart-hit-region]')!;
  for (const attr of ['x', 'y', 'width', 'height'])
    expect(Number(rect.getAttribute(attr))).toBe(Number(plot.getAttribute(attr)));
});
