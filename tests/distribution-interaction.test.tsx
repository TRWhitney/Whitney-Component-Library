import {act, cleanup, fireEvent, render} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {
  Histogram,
  BoxPlot,
  type HistogramActivation,
  type HistogramSelectionItem,
  type BoxPlotActivation,
  type BoxPlotSelectionItem,
  type ChartSelectionLabels,
} from '../src/index.js';
const copy = {
  title: 'Distribution',
  description: 'Recorded values',
  dataTableLabel: 'Data',
  emptyState: {title: 'Empty', description: 'No data'},
  invalidData: {title: 'Invalid', description: 'Check data'},
};
const labels = <Item,>(): ChartSelectionLabels<Item> => ({
  instructions: 'Click selects. Hold opens.',
  clear: 'Clear',
  empty: 'None',
  summary: (n) => `${n} selected`,
  item: (i) => JSON.stringify(i),
  hidden: (s) => s,
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
  xAxis: {label: 'Latency', scale: {type: 'linear', domain: [0, 120]}},
  yAxis: {label: 'Count', scale: {type: 'linear', domain: [0, 10]}},
} as const;
const observations = [
  ...Array.from({length: 8}, (_, i) => ({id: `n${i}`, group: 'north', value: 30 + i})),
  {id: 'first', group: 'north', value: 100},
  {id: 'second', group: 'north', value: 100},
];
const boxProps = {
  ...copy,
  data: observations,
  groupAccessor: 'group',
  groups: [{id: 'north', label: 'North'}],
  distribution: {kind: 'raw', valueAccessor: 'value', whisker: 'tukey'},
  xAxis: {label: 'Group'},
  yAxis: {label: 'Value', scale: {type: 'linear', domain: [0, 120]}},
} as const;
function svgOf(container: HTMLElement) {
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  Object.defineProperty(svg, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({left: 0, top: 0, width: 640, height: 360}),
  });
  return svg;
}
function rect(el: Element) {
  return {
    x: Number(el.getAttribute('x')),
    y: Number(el.getAttribute('y')),
    width: Number(el.getAttribute('width')),
    height: Number(el.getAttribute('height')),
  };
}
function click(svg: SVGSVGElement, x: number, y: number, extra = {}) {
  fireEvent.pointerDown(svg, {
    clientX: x,
    clientY: y,
    pointerId: 1,
    pointerType: 'mouse',
    button: 0,
    isPrimary: true,
    ...extra,
  });
  fireEvent.pointerUp(svg, {clientX: x, clientY: y, pointerId: 1, pointerType: 'mouse', ...extra});
}
const binItem = (lower: number, upper: number, upperInclusive = false): HistogramSelectionItem => ({
  kind: 'bin',
  lower,
  upper,
  upperInclusive,
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
it('selects intervals and activates the supplied bin without changing selection', () => {
  const onActivate = vi.fn<(a: HistogramActivation<(typeof bins)[number]>) => void>(),
    onSelectionChange = vi.fn();
  const {container} = render(
    <Histogram
      {...histogram}
      interaction={{
        onActivate,
        selection: {labels: labels<HistogramSelectionItem>(), onSelectionChange},
      }}
    />,
  );
  const svg = svgOf(container),
    r = rect(container.querySelectorAll('[data-wcl-histogram-bin]')[1]!);
  click(svg, r.x + r.width / 2, r.y + 10);
  expect(onSelectionChange).toHaveBeenLastCalledWith([binItem(40, 80)]);
  click(svg, r.x + r.width / 2, r.y + 10, {ctrlKey: true});
  expect(onActivate).toHaveBeenCalledWith({
    item: binItem(40, 80),
    value: 5,
    ordinate: 'count',
    source: {kind: 'binned', datum: bins[1]},
    input: 'pointer',
  });
  expect(onSelectionChange).toHaveBeenCalledTimes(1);
});
it('reports exact raw bin members including the final upper endpoint', () => {
  const data = [{v: 0}, {v: 40}, {v: 80}, {v: 120}];
  const onActivate = vi.fn<(a: HistogramActivation<(typeof data)[number]>) => void>();
  const {container} = render(
    <Histogram
      {...histogram}
      data={data}
      distribution={{kind: 'raw', accessor: 'v', thresholds: [0, 40, 80, 120]}}
      interaction={{onActivate}}
    />,
  );
  const svg = svgOf(container),
    r = rect(container.querySelectorAll('[data-wcl-histogram-bin]')[2]!);
  click(svg, r.x + 10, r.y + 1);
  expect(onActivate).toHaveBeenCalledWith({
    item: binItem(80, 120, true),
    value: 2,
    ordinate: 'count',
    source: {kind: 'raw', data: [data[2], data[3]]},
    input: 'pointer',
  });
});
it('keeps shared histogram frames aligned and a hovered inner outline visible', () => {
  const {container} = render(
    <Histogram
      {...histogram}
      interaction={{selection: {labels: labels<HistogramSelectionItem>()}}}
    />,
  );
  const svg = svgOf(container),
    marks = [...container.querySelectorAll('[data-wcl-histogram-bin]')].map(rect);
  for (const r of marks.slice(0, 2)) click(svg, r.x + r.width / 2, r.y + 10);
  const frames = [
    ...container.querySelectorAll('[data-wcl-distribution-cue="selection"] rect'),
  ].map(rect);
  expect(frames).toHaveLength(2);
  expect(frames[0]!.x + frames[0]!.width).toBeCloseTo(frames[1]!.x, 9);
  expect(container.querySelector('[data-wcl-distribution-cue="reading"]')).not.toBeNull();
});
it('keeps equal-valued outliers distinct through reordered input', () => {
  const onActivate = vi.fn<(a: BoxPlotActivation<(typeof observations)[number]>) => void>(),
    onSelectionChange = vi.fn();
  const interaction = {
    getOutlierId: ({datum}: {datum: (typeof observations)[number]}) => datum.id,
    onActivate,
    selection: {labels: labels<BoxPlotSelectionItem>(), onSelectionChange},
  };
  const {container, rerender} = render(<BoxPlot {...boxProps} interaction={interaction} />);
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'ArrowRight'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(onSelectionChange).toHaveBeenLastCalledWith([
    {kind: 'outlier', groupId: 'north', outlierId: 'first'},
  ]);
  rerender(<BoxPlot {...boxProps} data={[...observations].reverse()} interaction={interaction} />);
  expect(container.querySelector('[data-wcl-chart-selection]')!.textContent).toContain('first');
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'ArrowRight'});
  fireEvent.keyDown(canvas, {key: 'ArrowRight'});
  fireEvent.keyDown(canvas, {key: 'Enter', metaKey: true});
  expect(onActivate.mock.lastCall?.[0]).toMatchObject({
    kind: 'outlier',
    item: {outlierId: 'first'},
    value: 100,
    source: {kind: 'raw', datum: observations[8]},
    input: 'keyboard',
  });
});
it('selects a box touched by the drag without a median dot', () => {
  const onSelectionChange = vi.fn();
  const {container} = render(
    <BoxPlot
      {...boxProps}
      interaction={{
        getOutlierId: ({datum}) => datum.id,
        selection: {labels: labels<BoxPlotSelectionItem>(), onSelectionChange},
      }}
    />,
  );
  const svg = svgOf(container),
    r = rect(container.querySelector('[data-wcl-box-quartile]')!);
  fireEvent.pointerDown(svg, {
    clientX: r.x - 15,
    clientY: r.y - 15,
    pointerId: 1,
    pointerType: 'mouse',
    button: 0,
    isPrimary: true,
  });
  fireEvent.pointerMove(svg, {clientX: r.x + 2, clientY: r.y + r.height + 15, pointerId: 1});
  fireEvent.pointerUp(svg, {pointerId: 1, pointerType: 'mouse'});
  expect(onSelectionChange).toHaveBeenLastCalledWith([{kind: 'summary', groupId: 'north'}]);
  fireEvent.pointerMove(svg, {clientX: r.x + 5, clientY: r.y + 2, pointerType: 'mouse'});
  expect(container.querySelector('[data-wcl-distribution-cue="reading"] rect')).not.toBeNull();
  expect(container.querySelector('[data-wcl-distribution-cue="reading"] circle')).toBeNull();
});
it('rejects duplicate outlier IDs within a group', () => {
  expect(() =>
    render(<BoxPlot {...boxProps} interaction={{getOutlierId: () => 'duplicate'}} />),
  ).toThrow(/outlier.*duplicat/i);
});
it('joins an outlier selection ring to its normal and emphasized border', () => {
  const {container} = render(
    <BoxPlot
      {...boxProps}
      minimumSize={{width: 320, height: 180}}
      interaction={{
        getOutlierId: ({datum}) => datum.id,
        selection: {
          labels: labels<BoxPlotSelectionItem>(),
          defaultSelectedItems: [{kind: 'outlier', groupId: 'north', outlierId: 'first'}],
        },
      }}
    />,
  );
  const mark = container.querySelector('[data-wcl-box-outlier]')!;
  const radius = Number(mark.getAttribute('r'));
  const ringRadius = () =>
    Number(container.querySelector('[data-wcl-point-cue="selection"]')!.getAttribute('r'));
  // At half scale, the 2px selection ring meets the 1.75px normal border.
  expect((ringRadius() - radius) * 0.5 - 1).toBeCloseTo(0.875);
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'ArrowRight'});
  expect(mark.hasAttribute('data-active')).toBe(true);
  expect((ringRadius() - radius) * 0.5 - 1).toBeCloseTo(1.4);
  expect(Number(mark.getAttribute('r'))).toBe(radius);
});

it('leaves controlled interval selection with the app and retires changed intervals', () => {
  const onSelectionChange = vi.fn();
  const interaction = {
    selection: {
      labels: labels<HistogramSelectionItem>(),
      selectedItems: [binItem(40, 80)],
      onSelectionChange,
    },
  };
  const {container, rerender} = render(<Histogram {...histogram} interaction={interaction} />);
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(onSelectionChange).toHaveBeenLastCalledWith([binItem(40, 80), binItem(0, 40)]);
  expect(container.querySelectorAll('[data-wcl-distribution-cue="selection"]')).toHaveLength(1);
  rerender(
    <Histogram
      {...histogram}
      data={[
        {lower: 0, upper: 60, count: 4},
        {lower: 60, upper: 120, count: 6},
      ]}
      interaction={interaction}
    />,
  );
  expect(container.querySelectorAll('[data-wcl-distribution-cue="selection"]')).toHaveLength(0);
  expect(onSelectionChange).toHaveBeenCalledTimes(1);
});
it('activates zero-height bins and zero-spread summaries', () => {
  const onActivate =
    vi.fn<
      (
        a:
          | HistogramActivation<(typeof bins)[number]>
          | BoxPlotActivation<(typeof observations)[number]>,
      ) => void
    >();
  const {container, rerender} = render(
    <Histogram
      {...histogram}
      data={bins.map((bin) => ({...bin, count: 0}))}
      interaction={{onActivate}}
    />,
  );
  let svg = svgOf(container),
    r = rect(container.querySelector('[data-wcl-histogram-bin]')!);
  click(svg, r.x + r.width / 2, r.y);
  expect(onActivate).toHaveBeenCalledWith(
    expect.objectContaining({value: 0, item: binItem(0, 40)}),
  );
  rerender(
    <BoxPlot
      {...boxProps}
      data={[{id: 'flat', group: 'north', value: 30}]}
      interaction={{getOutlierId: ({datum}) => datum.id, onActivate}}
    />,
  );
  svg = svgOf(container);
  r = rect(container.querySelector('[data-wcl-box-quartile]')!);
  click(svg, r.x + r.width / 2, r.y);
  expect(onActivate.mock.lastCall?.[0]).toMatchObject({
    kind: 'summary',
    summary: {q1: 30, median: 30, q3: 30},
  });
  expect(container.querySelector('[data-wcl-distribution-cue="reading"] line')).not.toBeNull();
});
it('holds to activate without selecting and cancels a hold on source replacement', () => {
  vi.useFakeTimers();
  const onActivate = vi.fn(),
    onSelectionChange = vi.fn();
  const interaction = {
    onActivate,
    selection: {labels: labels<HistogramSelectionItem>(), onSelectionChange},
  };
  const {container, rerender} = render(<Histogram {...histogram} interaction={interaction} />);
  const svg = svgOf(container),
    r = rect(container.querySelector('[data-wcl-histogram-bin]')!);
  const at = {
    clientX: r.x + r.width / 2,
    clientY: r.y + 10,
    pointerId: 2,
    pointerType: 'touch',
    button: 0,
    isPrimary: true,
  };
  fireEvent.pointerDown(svg, at);
  act(() => {
    vi.advanceTimersByTime(500);
  });
  fireEvent.pointerUp(svg, at);
  expect(onActivate).toHaveBeenCalledWith(
    expect.objectContaining({input: 'touch', item: binItem(0, 40)}),
  );
  expect(onSelectionChange).not.toHaveBeenCalled();
  act(() => {
    vi.advanceTimersByTime(650);
  });
  expect(container.querySelector('[data-wcl-point-activation]')).toBeNull();
  fireEvent.pointerDown(svg, at);
  rerender(<Histogram {...histogram} data={[...bins]} interaction={interaction} />);
  act(() => {
    vi.advanceTimersByTime(500);
  });
  fireEvent.pointerUp(svg, at);
  expect(onActivate).toHaveBeenCalledTimes(1);
  expect(onSelectionChange).not.toHaveBeenCalled();
});
it('reports supplied summaries and stable outliers after the outlier list is reordered', () => {
  const data = [
    {
      group: 'north',
      lo: 20,
      q1: 30,
      median: 35,
      q3: 40,
      hi: 50,
      outliers: [100, 110],
      ids: ['first', 'second'],
    },
  ];
  type Summary = (typeof data)[number];
  const onActivate = vi.fn<(a: BoxPlotActivation<Summary>) => void>();
  const interaction = {
    getOutlierId: (context: import('../src/index.js').BoxPlotOutlierContext<Summary>) =>
      context.kind === 'summary' ? context.datum.ids[context.outlierIndex]! : context.datum.group,
    onActivate,
    selection: {labels: labels<BoxPlotSelectionItem>()},
  };
  const distribution = {
    kind: 'summary',
    lowerWhiskerAccessor: 'lo',
    q1Accessor: 'q1',
    medianAccessor: 'median',
    q3Accessor: 'q3',
    upperWhiskerAccessor: 'hi',
    outliersAccessor: 'outliers',
    whisker: 'tukey',
  } as const;
  const {container, rerender} = render(
    <BoxPlot {...boxProps} data={data} distribution={distribution} interaction={interaction} />,
  );
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'Enter', ctrlKey: true});
  expect(onActivate.mock.lastCall?.[0]).toMatchObject({
    kind: 'summary',
    source: {kind: 'summary', datum: data[0]},
    summary: {median: 35, outliers: [100, 110]},
  });
  fireEvent.keyDown(canvas, {key: 'ArrowDown'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  const updated = [{...data[0]!, outliers: [110, 100], ids: ['second', 'first']}];
  rerender(
    <BoxPlot {...boxProps} data={updated} distribution={distribution} interaction={interaction} />,
  );
  expect(container.querySelector('[data-wcl-chart-selection]')!.textContent).toContain('first');
  fireEvent.keyDown(canvas, {key: 'End'});
  fireEvent.keyDown(canvas, {key: 'Enter', ctrlKey: true});
  expect(onActivate.mock.lastCall?.[0]).toMatchObject({
    kind: 'outlier',
    item: {groupId: 'north', outlierId: 'first'},
    value: 100,
    source: {kind: 'summary', datum: updated[0], outlierIndex: 1},
  });
});
it('rejects empty stable outlier IDs', () => {
  expect(() => render(<BoxPlot {...boxProps} interaction={{getOutlierId: () => ' '}} />)).toThrow(
    /outlier ID/,
  );
});
it('cancels holds and drag previews when a bin resizes around an unchanged center', () => {
  vi.useFakeTimers();
  const data = [bins[0]!],
    onActivate = vi.fn(),
    onSelectionChange = vi.fn();
  const interaction = {
    onActivate,
    selection: {labels: labels<HistogramSelectionItem>(), onSelectionChange},
  };
  const narrow = {label: 'Latency', scale: {type: 'linear', domain: [0, 40]}} as const;
  const wide = {label: 'Latency', scale: {type: 'linear', domain: [-20, 60]}} as const;
  const {container, rerender} = render(
    <Histogram {...histogram} data={data} xAxis={narrow} interaction={interaction} />,
  );
  const svg = svgOf(container),
    r = rect(container.querySelector('[data-wcl-histogram-bin]')!);
  const at = {
    clientX: r.x + r.width / 2,
    clientY: r.y + 10,
    pointerId: 2,
    pointerType: 'touch',
    button: 0,
    isPrimary: true,
  };
  fireEvent.pointerDown(svg, at);
  rerender(<Histogram {...histogram} data={data} xAxis={wide} interaction={interaction} />);
  act(() => {
    vi.advanceTimersByTime(500);
  });
  fireEvent.pointerUp(svg, at);
  expect(onActivate).not.toHaveBeenCalled();
  expect(onSelectionChange).not.toHaveBeenCalled();
  fireEvent.pointerDown(svg, {...at, pointerType: 'mouse'});
  fireEvent.pointerMove(svg, {
    ...at,
    pointerType: 'mouse',
    clientX: at.clientX + 20,
    clientY: at.clientY + 20,
  });
  expect(container.querySelector('[data-wcl-chart-selection-box]')).not.toBeNull();
  rerender(<Histogram {...histogram} data={data} xAxis={narrow} interaction={interaction} />);
  expect(container.querySelector('[data-wcl-chart-selection-box]')).toBeNull();
  fireEvent.pointerUp(svg, {...at, pointerType: 'mouse'});
  expect(onSelectionChange).not.toHaveBeenCalled();
});
