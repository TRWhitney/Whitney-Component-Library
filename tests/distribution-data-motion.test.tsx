import {cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {
  Histogram,
  BoxPlot,
  type ChartSelectionLabels,
  type HistogramSelectionItem,
  type BoxPlotSelectionItem,
  type BoxPlotOutlierContext,
} from '../src/index.js';
import {chartMotionClock} from './chart-motion-clock.js';
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
const common = {
  title: 'Readings',
  description: 'Recorded data',
  dataTableLabel: 'Values',
  emptyState: {title: 'Empty', description: 'No data'},
  invalidData: {title: 'Invalid', description: 'Check data'},
};
it('moves histogram counts within unchanged intervals', () => {
  const clock = chartMotionClock();
  const props = {
    ...common,
    data: [
      {lo: 0, hi: 10, n: 3},
      {lo: 10, hi: 20, n: 5},
    ],
    distribution: {
      kind: 'binned',
      lowerAccessor: 'lo',
      upperAccessor: 'hi',
      ordinateAccessor: 'n',
      ordinate: 'count',
    },
    xAxis: {label: 'Time', scale: {type: 'linear', domain: [0, 20]}},
    yAxis: {label: 'Count', scale: {type: 'linear', domain: [0, 10]}},
  } as const;
  const {container, rerender} = render(<Histogram {...props} />);
  const height = () =>
    Number(container.querySelector('[data-wcl-histogram-bin]')!.getAttribute('height'));
  const before = height();
  rerender(
    <Histogram
      {...props}
      data={[
        {lo: 0, hi: 10, n: 6},
        {lo: 10, hi: 20, n: 5},
      ]}
    />,
  );
  expect(height()).toBe(before);
  clock.advance(120);
  expect(height()).toBeGreaterThan(before);
  expect(height()).toBeLessThan(before * 2);
  clock.advance(240);
  expect(height()).toBeCloseTo(before * 2);
});
it('moves box summaries and outliers without changing supplied statistics', () => {
  const clock = chartMotionClock();
  const data = [{id: 'a', lo: 1, q1: 2, median: 3, q3: 4, hi: 5, outliers: [8]}];
  const props = {
    ...common,
    data,
    groupAccessor: 'id',
    groups: [{id: 'a', label: 'A'}],
    distribution: {
      kind: 'summary',
      lowerWhiskerAccessor: 'lo',
      q1Accessor: 'q1',
      medianAccessor: 'median',
      q3Accessor: 'q3',
      upperWhiskerAccessor: 'hi',
      outliersAccessor: 'outliers',
      whisker: 'tukey',
    },
    xAxis: {label: 'Group'},
    yAxis: {label: 'Value', scale: {type: 'linear', domain: [0, 20]}},
  } as const;
  const {container, rerender} = render(<BoxPlot {...props} />);
  const y = () => Number(container.querySelector('[data-wcl-box-median]')!.getAttribute('y1'));
  const before = y();
  rerender(
    <BoxPlot
      {...props}
      data={[{id: 'a', lo: 2, q1: 4, median: 6, q3: 8, hi: 10, outliers: [16]}]}
    />,
  );
  expect(y()).toBe(before);
  clock.advance(120);
  const middle = y();
  expect(middle).toBeLessThan(before);
  clock.advance(240);
  expect(y()).toBeLessThan(middle);
});

const bins = [
  {lo: 0, hi: 10, n: 3},
  {lo: 10, hi: 20, n: 5},
];
const histogram = {
  ...common,
  data: bins,
  distribution: {
    kind: 'binned',
    lowerAccessor: 'lo',
    upperAccessor: 'hi',
    ordinateAccessor: 'n',
    ordinate: 'count',
  },
  xAxis: {label: 'Time', scale: {type: 'linear', domain: [0, 20]}},
  yAxis: {label: 'Count', scale: {type: 'linear', domain: [0, 10]}},
} as const;
const boxes = [
  {id: 'a', lo: 1, q1: 2, median: 3, q3: 4, hi: 5, outliers: [8], outlierIds: ['slow']},
];
type Box = (typeof boxes)[number];
const box = {
  ...common,
  data: boxes,
  groupAccessor: 'id',
  groups: [{id: 'a', label: 'A'}],
  distribution: {
    kind: 'summary',
    lowerWhiskerAccessor: 'lo',
    q1Accessor: 'q1',
    medianAccessor: 'median',
    q3Accessor: 'q3',
    upperWhiskerAccessor: 'hi',
    outliersAccessor: 'outliers',
    whisker: 'tukey',
  },
  xAxis: {label: 'Group'},
  yAxis: {label: 'Value', scale: {type: 'linear', domain: [0, 20]}},
} as const;
const doubled = {...boxes[0]!, lo: 2, q1: 4, median: 6, q3: 8, hi: 10, outliers: [16]};
const labels = <Item,>(): ChartSelectionLabels<Item> => ({
  instructions: 'Select or hold to open.',
  clear: 'Clear',
  empty: 'None',
  summary: (count) => `${count} selected`,
  item: (item) => JSON.stringify(item),
  hidden: (label) => label,
});
const getOutlierId = (context: BoxPlotOutlierContext<Box>) =>
  context.kind === 'summary' ? context.datum.outlierIds[context.outlierIndex]! : context.datum.id;
function rect(element: Element) {
  return Object.fromEntries(
    ['x', 'y', 'height', 'width'].map((name) => [name, Number(element.getAttribute(name))]),
  ) as {x: number; y: number; height: number; width: number};
}
function svgOf(container: HTMLElement) {
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  Object.defineProperty(svg, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({left: 0, top: 0, width: 640, height: 360}),
  });
  return svg;
}
function click(svg: SVGSVGElement, x: number, y: number, ctrlKey = false) {
  const at = {
    clientX: x,
    clientY: y,
    pointerId: 1,
    pointerType: 'mouse',
    button: 0,
    isPrimary: true,
    ctrlKey,
  };
  fireEvent.pointerDown(svg, at);
  fireEvent.pointerUp(svg, at);
}
it('keeps histogram selection on displayed bars and activates current raw members including the final edge', () => {
  const clock = chartMotionClock();
  const onActivate = vi.fn();
  const interaction = {onActivate, selection: {labels: labels<HistogramSelectionItem>()}};
  const data = [{v: 1}, {v: 11}, {v: 20}];
  const distribution = {kind: 'raw', accessor: 'v', thresholds: [0, 10, 20]} as const;
  const {container, rerender} = render(
    <Histogram {...histogram} data={data} distribution={distribution} interaction={interaction} />,
  );
  const bar = () => container.querySelectorAll('[data-wcl-histogram-bin]')[1]!;
  const start = rect(bar());
  click(svgOf(container), start.x + start.width / 2, start.y + 2);
  const startCue = rect(container.querySelector('[data-wcl-distribution-cue="selection"] rect')!);
  const next = [...data, {v: 15}, {v: 17}];
  rerender(
    <Histogram {...histogram} data={next} distribution={distribution} interaction={interaction} />,
  );
  expect(within(screen.getByRole('table')).getByText('4')).toBeTruthy();
  clock.advance(60);
  const moving = rect(bar());
  expect(moving.height).toBeGreaterThan(start.height);
  const cue = rect(container.querySelector('[data-wcl-distribution-cue="selection"] rect')!);
  expect(cue.y - startCue.y).toBeCloseTo(moving.y - start.y);
  expect(cue.height - startCue.height).toBeCloseTo(moving.height - start.height);
  click(svgOf(container), moving.x + moving.width / 2, moving.y + 1, true);
  expect(onActivate).toHaveBeenLastCalledWith(
    expect.objectContaining({
      item: {kind: 'bin', lower: 10, upper: 20, upperInclusive: true},
      value: 4,
      source: {kind: 'raw', data: [data[1], data[2], next[3], next[4]]},
    }),
  );
  expect(within(screen.getByRole('tooltip')).getByText('4')).toBeTruthy();
});
it('moves stable outlier selection and hits its display while exposing exact supplied statistics', () => {
  const clock = chartMotionClock();
  const onActivate = vi.fn();
  const interaction = {
    getOutlierId,
    onActivate,
    selection: {
      labels: labels<BoxPlotSelectionItem>(),
      defaultSelectedItems: [{kind: 'outlier', groupId: 'a', outlierId: 'slow'} as const],
    },
  };
  const {container, rerender} = render(<BoxPlot {...box} interaction={interaction} />);
  const outlier = () => container.querySelector('[data-wcl-box-outlier]')!;
  const start = Number(outlier().getAttribute('cy'));
  rerender(<BoxPlot {...box} data={[doubled]} interaction={interaction} />);
  expect(within(screen.getByRole('table')).getByText('16')).toBeTruthy();
  clock.advance(60);
  const y = Number(outlier().getAttribute('cy'));
  expect(y).toBeLessThan(start);
  expect(
    Number(container.querySelector('[data-wcl-point-cue="selection"]')!.getAttribute('cy')),
  ).toBeCloseTo(y);
  click(svgOf(container), Number(outlier().getAttribute('cx')), y, true);
  expect(onActivate).toHaveBeenLastCalledWith(
    expect.objectContaining({
      kind: 'outlier',
      item: {kind: 'outlier', groupId: 'a', outlierId: 'slow'},
      value: 16,
      source: {kind: 'summary', datum: doubled, outlierIndex: 0},
    }),
  );
  expect(within(screen.getByRole('tooltip')).getByText('16')).toBeTruthy();
  const quartile = rect(container.querySelector('[data-wcl-box-quartile]')!);
  click(svgOf(container), quartile.x + quartile.width / 2, quartile.y + quartile.height / 2, true);
  expect(onActivate).toHaveBeenLastCalledWith(
    expect.objectContaining({
      kind: 'summary',
      summary: {
        lowerWhisker: 2,
        median: 6,
        q1: 4,
        q3: 8,
        upperWhisker: 10,
        whisker: 'tukey',
        outliers: [16],
      },
    }),
  );
});
it.each(['histogram', 'box'] as const)(
  'retargets %s numeric changes and settles immediately for reduced motion',
  (kind) => {
    const clock = chartMotionClock();
    const chart = (updated: boolean) =>
      kind === 'histogram' ? (
        <Histogram {...histogram} data={updated ? [{...bins[0]!, n: 6}, bins[1]!] : bins} />
      ) : (
        <BoxPlot {...box} data={updated ? [doubled] : boxes} interaction={{getOutlierId}} />
      );
    const {container, rerender} = render(chart(false));
    const y = () =>
      Number(
        container
          .querySelector(
            kind === 'histogram' ? '[data-wcl-histogram-bin]' : '[data-wcl-box-median]',
          )!
          .getAttribute(kind === 'histogram' ? 'y' : 'y1'),
      );
    const start = y();
    expect(clock.pending()).toBe(0);
    rerender(chart(true));
    clock.advance(60);
    const middle = y();
    expect(middle).toBeLessThan(start);
    rerender(chart(false));
    expect(y()).toBeCloseTo(middle);
    clock.advance(120);
    expect(y()).toBeGreaterThan(middle);
    clock.reduce();
    expect(y()).toBeCloseTo(start);
    clock.advance(500);
    expect(y()).toBeCloseTo(start);
  },
);
it.each(['histogram', 'box'] as const)(
  'preserves an active %s selection drag across automatic axis and data motion',
  (kind) => {
    const clock = chartMotionClock();
    const automatic = {label: 'Value', scale: {type: 'linear'}} as const;
    const chart = (updated: boolean) =>
      kind === 'histogram' ? (
        <Histogram
          {...histogram}
          yAxis={automatic}
          data={
            updated
              ? [
                  {...bins[0]!, n: 6},
                  {...bins[1]!, n: 12},
                ]
              : bins
          }
          interaction={{selection: {labels: labels<HistogramSelectionItem>()}}}
        />
      ) : (
        <BoxPlot
          {...box}
          yAxis={automatic}
          data={updated ? [doubled] : boxes}
          interaction={{getOutlierId, selection: {labels: labels<BoxPlotSelectionItem>()}}}
        />
      );
    const {container, rerender} = render(chart(false));
    const geometry = () =>
      rect(
        container.querySelector(
          kind === 'histogram' ? '[data-wcl-histogram-bin]' : '[data-wcl-box-quartile]',
        )!,
      );
    const initial = geometry();
    rerender(chart(true));
    expect(geometry()).toEqual(initial);
    clock.advance(60);
    const moving = geometry();
    const svg = svgOf(container);
    fireEvent.pointerDown(svg, {
      clientX: moving.x + 5,
      clientY: moving.y - 10,
      pointerId: 1,
      pointerType: 'mouse',
      button: 0,
      isPrimary: true,
    });
    fireEvent.pointerMove(svg, {
      clientX: moving.x + moving.width - 5,
      clientY: moving.y + moving.height + 10,
      pointerId: 1,
    });
    expect(container.querySelector('[data-wcl-chart-selection-box]')).not.toBeNull();
    clock.advance(120);
    expect(container.querySelector('[data-wcl-chart-selection-box]')).not.toBeNull();
    clock.advance(240);
    expect(container.querySelector('[data-wcl-chart-selection-box]')).not.toBeNull();
    fireEvent.pointerUp(svg, {pointerId: 1, pointerType: 'mouse'});
    expect(screen.getByText('1 selected')).toBeTruthy();
  },
);
it('settles changed histogram intervals and final-edge inclusion without retaining stale bins', () => {
  const clock = chartMotionClock();
  const {container, rerender} = render(<Histogram {...histogram} />);
  rerender(
    <Histogram
      {...histogram}
      data={[
        {lo: 0, hi: 5, n: 6},
        {lo: 5, hi: 10, n: 4},
      ]}
    />,
  );
  const settled = [...container.querySelectorAll('[data-wcl-histogram-bin]')].map(rect);
  expect(clock.pending()).toBe(0);
  clock.advance(240);
  expect([...container.querySelectorAll('[data-wcl-histogram-bin]')].map(rect)).toEqual(settled);
});
it('settles box outlier membership changes while pruning departed selections', () => {
  const clock = chartMotionClock();
  const interaction = {
    getOutlierId,
    selection: {
      labels: labels<BoxPlotSelectionItem>(),
      defaultSelectedItems: [{kind: 'outlier', groupId: 'a', outlierId: 'slow'} as const],
    },
  };
  const {container, rerender} = render(<BoxPlot {...box} interaction={interaction} />);
  rerender(
    <BoxPlot
      {...box}
      data={[{...doubled, outlierIds: ['replacement']}]}
      interaction={interaction}
    />,
  );
  expect(screen.getByText('None')).toBeTruthy();
  const settled = container.querySelector('[data-wcl-box-outlier]')!.getAttribute('cy');
  expect(clock.pending()).toBe(0);
  clock.advance(240);
  expect(container.querySelector('[data-wcl-box-outlier]')!.getAttribute('cy')).toBe(settled);
});
it('interpolates derived raw quartiles without inventing intermediate sample statistics', () => {
  const clock = chartMotionClock();
  const data = [
    {id: 'a', v: 1},
    {id: 'a', v: 2},
    {id: 'a', v: 3},
    {id: 'a', v: 4},
    {id: 'a', v: 5},
  ];
  const distribution = {kind: 'raw', valueAccessor: 'v', whisker: 'min-max'} as const;
  const onActivate = vi.fn();
  const interaction = {getOutlierId: () => 'unused', onActivate};
  const {container, rerender} = render(
    <BoxPlot {...box} data={data} distribution={distribution} interaction={interaction} />,
  );
  const y = () => Number(container.querySelector('[data-wcl-box-median]')!.getAttribute('y1'));
  const start = y();
  const next = [9, 2, 3, 4, 5].map((v) => ({id: 'a', v}));
  rerender(<BoxPlot {...box} data={next} distribution={distribution} interaction={interaction} />);
  clock.advance(120);
  const middle = y();
  expect(middle).toBeLessThan(start);
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'Enter', ctrlKey: true});
  expect(onActivate).toHaveBeenLastCalledWith(
    expect.objectContaining({
      kind: 'summary',
      summary: {
        lowerWhisker: 2,
        median: 4,
        q1: 3,
        q3: 5,
        upperWhisker: 9,
        whisker: 'min-max',
        outliers: [],
      },
      source: {kind: 'raw', data: next},
    }),
  );
  clock.advance(240);
  const end = y();
  expect(middle).toBeCloseTo(start + (end - start) * 0.875);
});

it('settles a final-edge identity change even when the surviving interval keeps its bounds', () => {
  const clock = chartMotionClock();
  const interaction = {
    selection: {
      labels: labels<HistogramSelectionItem>(),
      defaultSelectedItems: [{kind: 'bin', lower: 0, upper: 10, upperInclusive: false} as const],
    },
  };
  const {container, rerender} = render(<Histogram {...histogram} interaction={interaction} />);
  rerender(<Histogram {...histogram} data={[{...bins[0]!, n: 6}]} interaction={interaction} />);
  expect(screen.getByText('None')).toBeTruthy();
  const settled = rect(container.querySelector('[data-wcl-histogram-bin]')!);
  expect(clock.pending()).toBe(0);
  clock.advance(240);
  expect(rect(container.querySelector('[data-wcl-histogram-bin]')!)).toEqual(settled);
});

it.each(['histogram', 'box'] as const)(
  'settles %s scale configuration changes during a transition',
  (kind) => {
    const clock = chartMotionClock();
    const chart = (updated: boolean, upper: number) => {
      const yAxis = {label: 'Value', scale: {type: 'linear', domain: [0, upper]}} as const;
      return kind === 'histogram' ? (
        <Histogram
          {...histogram}
          yAxis={yAxis}
          data={updated ? [{...bins[0]!, n: 6}, bins[1]!] : bins}
        />
      ) : (
        <BoxPlot
          {...box}
          yAxis={yAxis}
          data={updated ? [doubled] : boxes}
          interaction={{getOutlierId}}
        />
      );
    };
    const {container, rerender} = render(chart(false, 20));
    rerender(chart(true, 20));
    clock.advance(60);
    rerender(chart(true, 40));
    const geometry = () =>
      rect(
        container.querySelector(
          kind === 'histogram' ? '[data-wcl-histogram-bin]' : '[data-wcl-box-quartile]',
        )!,
      );
    const settled = geometry();
    expect(clock.pending()).toBe(0);
    clock.advance(240);
    expect(geometry()).toEqual(settled);
  },
);

it('settles reordered outlier IDs and preserves selection on the identified source outlier', () => {
  const clock = chartMotionClock();
  const data = [{...boxes[0]!, outliers: [8, 9], outlierIds: ['slow', 'slower']}];
  const onActivate = vi.fn();
  const interaction = {
    getOutlierId,
    onActivate,
    selection: {
      labels: labels<BoxPlotSelectionItem>(),
      defaultSelectedItems: [{kind: 'outlier', groupId: 'a', outlierId: 'slow'} as const],
    },
  };
  const {container, rerender} = render(<BoxPlot {...box} data={data} interaction={interaction} />);
  const next = [{...doubled, outliers: [18, 16], outlierIds: ['slower', 'slow']}];
  rerender(<BoxPlot {...box} data={next} interaction={interaction} />);
  expect(clock.pending()).toBe(0);
  const outlier = container.querySelectorAll('[data-wcl-box-outlier]')[1]!;
  const y = Number(outlier.getAttribute('cy'));
  expect(
    Number(container.querySelector('[data-wcl-point-cue="selection"]')!.getAttribute('cy')),
  ).toBeCloseTo(y);
  click(svgOf(container), Number(outlier.getAttribute('cx')), y, true);
  expect(onActivate).toHaveBeenLastCalledWith(
    expect.objectContaining({item: {kind: 'outlier', groupId: 'a', outlierId: 'slow'}, value: 16}),
  );
});

it('keeps two-touch exploration active while updated counts animate the axis gutter', () => {
  const clock = chartMotionClock();
  const onWindowChange = vi.fn<(window: readonly [number, number]) => void>();
  const initial = [30, 95, 60, 45].map((n, i) => ({lo: i * 10, hi: (i + 1) * 10, n}));
  const props = {
    ...common,
    data: initial,
    distribution: {
      kind: 'binned',
      lowerAccessor: 'lo',
      upperAccessor: 'hi',
      ordinateAccessor: 'n',
      ordinate: 'count',
    },
    xAxis: {label: 'Time', scale: {type: 'linear'}},
    yAxis: {label: 'Count', scale: {type: 'linear'}},
    exploration: {
      defaultWindow: [0, 20],
      onWindowChange,
      labels: {
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
        instructions: 'Drag the range',
        range: (window: readonly [number, number]) => window.join(' to '),
      },
    },
  } as const;
  const {container, rerender} = render(<Histogram {...props} />);
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 640, 360));
  rerender(<Histogram {...props} data={initial.map((row) => ({...row, n: row.n * 100}))} />);
  clock.advance(60);
  const event = (pointerId: number, clientX: number) => ({
    pointerId,
    clientX,
    clientY: 130,
    pointerType: 'touch',
    isPrimary: pointerId === 1,
    button: 0,
  });
  fireEvent.pointerDown(svg, event(1, 180));
  fireEvent.pointerDown(svg, event(2, 380));
  clock.advance(120);
  fireEvent.pointerMove(svg, event(2, 590));
  expect(onWindowChange).toHaveBeenCalled();
  fireEvent.pointerUp(svg, event(2, 590));
  fireEvent.pointerUp(svg, event(1, 180));
});
