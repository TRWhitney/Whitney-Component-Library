import {cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {BubbleChart, ScatterChart} from '../src/index.js';
import {chartMotionClock} from './chart-motion-clock.js';
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
const data = [
  {id: 'a', label: 'A', x: 20, y: 30},
  {id: 'b', label: 'B', x: 80, y: 70},
];
const props = {
  data,
  idAccessor: 'id',
  labelAccessor: 'label',
  series: [{id: 'observed', label: 'Observed'}],
  title: 'Readings',
  description: 'Observed values',
  dataTableLabel: 'All readings',
  emptyState: {title: 'Empty', description: 'Add readings'},
  invalidData: {title: 'Invalid', description: 'Check values'},
  xAxis: {accessor: 'x', label: 'X', scale: {type: 'linear', domain: [0, 100]}},
  yAxis: {accessor: 'y', label: 'Y', scale: {type: 'linear', domain: [0, 100]}},
} as const;
it('moves the same observation toward new coordinates while its table reports the supplied values', () => {
  const clock = chartMotionClock();
  const {container, rerender} = render(<ScatterChart {...props} />);
  const x = () => Number(container.querySelector('[data-point-id="a"] circle')!.getAttribute('cx'));
  const initial = x();
  rerender(<ScatterChart {...props} data={[{id: 'a', label: 'A', x: 60, y: 50}, data[1]!]} />);
  expect(x()).toBeCloseTo(initial);
  expect(within(screen.getByRole('table')).getByText('60')).toBeTruthy();
  clock.advance(120);
  const middle = x();
  expect(middle).toBeGreaterThan(initial);
  clock.advance(240);
  expect(x()).toBeGreaterThan(middle);
});

it('fits surviving bubble sizes smoothly when the largest bubble leaves', () => {
  const clock = chartMotionClock();
  const initial = [
    {...data[0]!, size: 25},
    {...data[1]!, size: 100},
  ];
  const {container, rerender} = render(
    <BubbleChart {...props} data={initial} magnitude={{accessor: 'size', label: 'Size'}} />,
  );
  const radius = () =>
    Number(container.querySelector('[data-point-id="a"] circle')!.getAttribute('r'));
  const start = radius();
  rerender(
    <BubbleChart
      {...props}
      data={initial.slice(0, 1)}
      magnitude={{accessor: 'size', label: 'Size'}}
    />,
  );
  expect(radius()).toBeCloseTo(start);
  clock.advance(120);
  const middle = radius();
  expect(middle).toBeGreaterThan(start);
  clock.advance(240);
  expect(radius()).toBeGreaterThan(middle);
  expect(radius()).toBeCloseTo(start * 2);
});

const selectionLabels = {
  instructions: 'Tap to select. Hold to open.',
  clear: 'Clear',
  empty: 'None',
  summary: (count: number) => `${count} selected`,
  item: (item: {rowId: string}) => item.rowId,
  hidden: (label: string) => label,
};
function mark(container: HTMLElement, id: string) {
  return container.querySelector<SVGGElement>(`[data-point-id="${id}"]`)!;
}
function center(container: HTMLElement, id: string) {
  const circle = mark(container, id).querySelector('circle')!;
  return {clientX: Number(circle.getAttribute('cx')), clientY: Number(circle.getAttribute('cy'))};
}
function clickAt(
  container: HTMLElement,
  position: {clientX: number; clientY: number},
  ctrlKey = false,
) {
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  Object.defineProperty(svg, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({left: 0, top: 0, width: 640, height: 360}),
  });
  const event = {
    ...position,
    pointerId: 1,
    pointerType: 'mouse',
    button: 0,
    isPrimary: true,
    ctrlKey,
  };
  fireEvent.pointerDown(svg, event);
  fireEvent.pointerUp(svg, event);
}

it('keeps selection on the same observation when source order changes', () => {
  const clock = chartMotionClock();
  const interaction = {selection: {labels: selectionLabels}};
  const {container, rerender} = render(<ScatterChart {...props} interaction={interaction} />);
  const start = center(container, 'a');
  clickAt(container, start);
  expect(screen.getByText('1 selected')).toBeTruthy();
  rerender(<ScatterChart {...props} data={[...data].reverse()} interaction={interaction} />);
  clock.advance(120);
  expect(center(container, 'a')).toEqual(start);
  const cue = container.querySelector('[data-wcl-point-cue="selection"]')!;
  expect(Number(cue.getAttribute('cx'))).toBeCloseTo(start.clientX);
  expect(screen.getByText('1 selected')).toBeTruthy();
});

it('fades arrivals and noninteractive departures while pruning removed selections immediately', () => {
  const clock = chartMotionClock();
  const onActivate = vi.fn();
  const interaction = {selection: {labels: selectionLabels}, onActivate};
  const {container, rerender} = render(<ScatterChart {...props} interaction={interaction} />);
  const departedPosition = center(container, 'a');
  clickAt(container, departedPosition);
  const incoming = {id: 'c', label: 'C', x: 40, y: 90};
  rerender(<ScatterChart {...props} data={[data[1]!, incoming]} interaction={interaction} />);
  expect(screen.getByText('None')).toBeTruthy();
  expect(within(screen.getByRole('table')).queryByText('A')).toBeNull();
  expect(mark(container, 'c').getAttribute('opacity')).toBe('0');
  const departure = mark(container, 'a');
  expect(departure.closest('[data-wcl-chart-departures]')?.getAttribute('pointer-events')).toBe(
    'none',
  );
  clickAt(container, departedPosition, true);
  expect(onActivate).not.toHaveBeenCalled();
  clock.advance(120);
  expect(Number(mark(container, 'c').getAttribute('opacity'))).toBeGreaterThan(0);
  expect(Number(departure.getAttribute('opacity'))).toBeLessThan(1);
  clock.advance(240);
  expect(mark(container, 'a')).toBeNull();
  expect(mark(container, 'c').getAttribute('opacity')).toBe('1');
});

it('retargets interrupted movement from its displayed position and honors reduced motion', () => {
  const clock = chartMotionClock();
  const {container, rerender} = render(<ScatterChart {...props} />);
  const start = center(container, 'a').clientX;
  rerender(<ScatterChart {...props} data={[{...data[0]!, x: 60}, data[1]!]} />);
  clock.advance(60);
  const middle = center(container, 'a').clientX;
  expect(middle).toBeGreaterThan(start);
  rerender(<ScatterChart {...props} data={[{...data[0]!, x: 10}, data[1]!]} />);
  expect(center(container, 'a').clientX).toBeCloseTo(middle);
  clock.advance(120);
  expect(center(container, 'a').clientX).toBeLessThan(middle);
  clock.reduce();
  const settled = center(container, 'a').clientX;
  expect(settled).toBeLessThan(start);
  clock.advance(500);
  expect(center(container, 'a').clientX).toBe(settled);
});

it('hits displayed observation geometry while activation and readings use current supplied values', () => {
  const clock = chartMotionClock();
  const onActivate = vi.fn();
  const {container, rerender} = render(<ScatterChart {...props} interaction={{onActivate}} />);
  const next = {...data[0]!, x: 60, y: 50};
  rerender(<ScatterChart {...props} data={[next, data[1]!]} interaction={{onActivate}} />);
  clock.advance(60);
  clickAt(container, center(container, 'a'));
  expect(onActivate).toHaveBeenCalledWith(expect.objectContaining({datum: next, x: 60, y: 50}));
  const reading = screen.getByRole('tooltip');
  expect(within(reading).getByText('60')).toBeTruthy();
  expect(within(reading).getByText('50')).toBeTruthy();
});

it('moves supplied-line samples with their path and activates their original current dataset', () => {
  const clock = chartMotionClock();
  const onActivate = vi.fn();
  const samples = [
    {id: 'sample-a', label: 'Target A', x: 10, y: 10},
    {id: 'sample-b', label: 'Target B', x: 90, y: 90},
  ];
  const line = {
    id: 'target',
    label: 'Target',
    data: samples,
    idAccessor: 'id',
    labelAccessor: 'label',
    xAccessor: 'x',
    yAccessor: 'y',
    onActivate,
  } as const;
  const {container, rerender} = render(
    <ScatterChart {...props} line={line} legend={{label: 'Series'}} />,
  );
  const start = center(container, 'sample-a');
  const path = () =>
    container
      .querySelector('[data-series-id="target"] path[data-wcl-chart-line]')!
      .getAttribute('d');
  const oldPath = path();
  const next = {...samples[0]!, x: 50, y: 40};
  rerender(
    <ScatterChart
      {...props}
      line={{...line, data: [next, samples[1]!]}}
      legend={{label: 'Series'}}
    />,
  );
  expect(path()).toBe(oldPath);
  clock.advance(120);
  expect(center(container, 'sample-a').clientX).toBeGreaterThan(start.clientX);
  expect(path()).not.toBe(oldPath);
  clickAt(container, center(container, 'sample-a'));
  expect(onActivate).toHaveBeenCalledWith(expect.objectContaining({datum: next, x: 50, y: 40}));
});

it('settles supplied-line geometry directly when missing-sample topology changes', () => {
  const clock = chartMotionClock();
  const samples = [
    {id: 'sample-a', label: 'Target A', x: 10, y: 10},
    {id: 'sample-b', label: 'Target B', x: 50, y: 50},
    {id: 'sample-c', label: 'Target C', x: 90, y: 90},
  ];
  const line = {
    id: 'target',
    label: 'Target',
    data: samples,
    idAccessor: 'id',
    labelAccessor: 'label',
    xAccessor: 'x',
    yAccessor: 'y',
  } as const;
  const {container, rerender} = render(
    <ScatterChart {...props} line={line} legend={{label: 'Series'}} />,
  );
  const nextLine = {
    ...line,
    data: [{...samples[0]!, x: 30}, {...samples[1]!, y: Number.NaN}, samples[2]!],
  };
  rerender(<ScatterChart {...props} line={nextLine} legend={{label: 'Series'}} />);
  const settled = center(container, 'sample-a');
  expect(mark(container, 'sample-b')).toBeNull();
  clock.advance(240);
  expect(center(container, 'sample-a')).toEqual(settled);
});

it('coordinates automatic axes with data and keeps a drag active across animation frames', () => {
  const clock = chartMotionClock();
  const observations = [...data, {id: 'c', label: 'C', x: 50, y: 50}];
  const automatic = {
    xAxis: {accessor: 'x', label: 'X', scale: {type: 'linear'}},
    yAxis: {accessor: 'y', label: 'Y', scale: {type: 'linear'}},
  } as const;
  const interaction = {selection: {labels: selectionLabels}};
  const {container, rerender} = render(
    <ScatterChart {...props} {...automatic} data={observations} interaction={interaction} />,
  );
  const initial = center(container, 'c');
  rerender(
    <ScatterChart
      {...props}
      {...automatic}
      data={[data[0]!, {...data[1]!, x: 140, y: 95}, observations[2]!]}
      interaction={interaction}
    />,
  );
  expect(center(container, 'c')).toEqual(initial);
  clock.advance(60);
  expect(center(container, 'c').clientX).toBeLessThan(initial.clientX);
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  Object.defineProperty(svg, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({left: 0, top: 0, width: 640, height: 360}),
  });
  const point = center(container, 'c');
  fireEvent.pointerDown(svg, {
    ...point,
    clientX: point.clientX - 30,
    clientY: point.clientY - 30,
    pointerId: 1,
    pointerType: 'mouse',
    button: 0,
    isPrimary: true,
  });
  fireEvent.pointerMove(svg, {
    ...point,
    clientX: point.clientX + 30,
    clientY: point.clientY + 30,
    pointerId: 1,
  });
  expect(container.querySelector('[data-wcl-chart-selection-box]')).not.toBeNull();
  clock.advance(120);
  expect(container.querySelector('[data-wcl-chart-selection-box]')).not.toBeNull();
  clock.advance(240);
  expect(container.querySelector('[data-wcl-chart-selection-box]')).not.toBeNull();
  fireEvent.pointerUp(svg, {
    ...point,
    clientX: point.clientX + 30,
    clientY: point.clientY + 30,
    pointerId: 1,
    pointerType: 'mouse',
  });
  expect(screen.getByText('1 selected')).toBeTruthy();
});

it('moves the axis gutter with data when fitted labels change width', () => {
  const clock = chartMotionClock();
  const axis = {accessor: 'y' as const, label: 'Y', scale: {type: 'linear' as const}};
  const {container, rerender} = render(<ScatterChart {...props} yAxis={axis} />);
  const initial = center(container, 'a').clientX;
  rerender(<ScatterChart {...props} yAxis={axis} data={[{...data[0]!, y: 20000}, data[1]!]} />);
  expect(center(container, 'a').clientX).toBeCloseTo(initial);
  clock.advance(120);
  const middle = center(container, 'a').clientX;
  expect(middle).toBeGreaterThan(initial);
  clock.advance(240);
  expect(center(container, 'a').clientX).toBeGreaterThan(middle);
});

it('settles logarithmic projections immediately when the prior linear bounds include zero', () => {
  const clock = chartMotionClock();
  const observations = [
    {...data[0]!, x: 1, y: 1},
    {...data[1]!, x: 100, y: 100},
  ];
  const automatic = {
    xAxis: {accessor: 'x' as const, label: 'X', scale: {type: 'linear' as const}},
    yAxis: {accessor: 'y' as const, label: 'Y', scale: {type: 'linear' as const}},
  };
  const {container, rerender} = render(
    <ScatterChart {...props} {...automatic} data={observations} />,
  );
  rerender(
    <ScatterChart
      {...props}
      data={observations}
      xAxis={{...automatic.xAxis, scale: {type: 'logarithmic'}}}
      yAxis={{...automatic.yAxis, scale: {type: 'logarithmic'}}}
    />,
  );
  const initial = center(container, 'a');
  expect(Number.isFinite(initial.clientX)).toBe(true);
  expect(Number.isFinite(initial.clientY)).toBe(true);
  expect(clock.pending()).toBe(0);
  clock.advance(240);
  expect(center(container, 'a')).toEqual(initial);
});

it('settles automatic line bounds with missing-sample topology changes', () => {
  const clock = chartMotionClock();
  const samples = [
    {id: 'l1', label: 'First', x: 10, y: 20},
    {id: 'l2', label: 'Last', x: 90, y: 80},
  ];
  const line = {
    id: 'line',
    label: 'Target',
    data: samples,
    idAccessor: 'id',
    labelAccessor: 'label',
    xAccessor: 'x',
    yAccessor: 'y',
  } as const;
  const axis = {accessor: 'y' as const, label: 'Y', scale: {type: 'linear' as const}};
  const {container, rerender} = render(
    <ScatterChart {...props} legend={{label: 'Series'}} line={line} yAxis={axis} />,
  );
  rerender(
    <ScatterChart
      {...props}
      legend={{label: 'Series'}}
      line={{
        ...line,
        data: [
          {...samples[0]!, y: 200},
          {...samples[1]!, y: NaN},
        ],
      }}
      yAxis={axis}
    />,
  );
  const initial = center(container, 'a');
  expect(clock.pending()).toBe(0);
  clock.advance(240);
  expect(center(container, 'a')).toEqual(initial);
});

it('keeps visibility fitting animated when a supplied line contains a missing sample', () => {
  const clock = chartMotionClock();
  const line = {
    id: 'target',
    label: 'Target',
    data: [
      {id: 'l1', label: 'First', x: 10, y: 300},
      {id: 'gap', label: 'Gap', x: 50, y: NaN},
      {id: 'l2', label: 'Last', x: 90, y: 250},
    ],
    idAccessor: 'id',
    labelAccessor: 'label',
    xAccessor: 'x',
    yAccessor: 'y',
  } as const;
  const visibilityLabels = {
    hideSeries: (label: string) => `Hide ${label}`,
    showSeries: (label: string) => `Show ${label}`,
    hidden: 'Hidden',
    showAll: 'Show all',
    allHidden: {title: 'All hidden', description: 'Show a group'},
  };
  const {container} = render(
    <ScatterChart
      {...props}
      line={line}
      visibilityLabels={visibilityLabels}
      legend={{label: 'Series'}}
      yAxis={{accessor: 'y', label: 'Y', scale: {type: 'linear'}}}
    />,
  );
  const initial = center(container, 'b').clientY;
  fireEvent.click(screen.getByRole('button', {name: 'Hide Target'}));
  expect(center(container, 'b').clientY).toBe(initial);
  clock.advance(120);
  const middle = center(container, 'b').clientY;
  expect(middle).toBeLessThan(initial);
  clock.advance(240);
  expect(center(container, 'b').clientY).toBeLessThan(middle);
});
