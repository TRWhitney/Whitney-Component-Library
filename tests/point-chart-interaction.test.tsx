import {within, act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {
  BubbleChart,
  ScatterChart,
  type ChartSelectionItem,
  type PointChartInteraction,
} from '../src/index.js';
const data = [
  {id: 'a1', label: 'A one', group: 'a', x: 30, y: 40, size: 40},
  {id: 'b1', label: 'B one', group: 'b', x: 30, y: 40, size: 40},
  {id: 'a2', label: 'A two', group: 'a', x: 70, y: 70, size: 100},
];
type Row = (typeof data)[number];
const labels = {
  instructions: 'Click selects. Hold activates.',
  clear: 'Clear selection',
  empty: 'None',
  summary: (n: number) => `${n} selected`,
  item: (p: ChartSelectionItem) => `${p.rowId} ${p.seriesId}`,
  hidden: (s: string) => s,
};
const common = {
  data,
  idAccessor: 'id',
  labelAccessor: 'label',
  seriesAccessor: 'group',
  series: [
    {id: 'a', label: 'A'},
    {id: 'b', label: 'B'},
  ],
  legend: {label: 'Groups'},
  title: 'Observations',
  description: 'Observed values',
  dataTableLabel: 'Values',
  emptyState: {title: 'Empty', description: 'No data'},
  invalidData: {title: 'Invalid', description: 'Check values'},
  xAxis: {accessor: 'x', label: 'X', scale: {type: 'linear', domain: [0, 100]}},
  yAxis: {accessor: 'y', label: 'Y', scale: {type: 'linear', domain: [0, 100]}},
} as const;
function geometry(container: HTMLElement) {
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  Object.defineProperty(svg, 'getBoundingClientRect', {
    value: () => ({left: 0, top: 0, width: 640, height: 360}),
  });
  const p = container.querySelector('[data-point-id="a2"] circle')!;
  return {svg, at: {clientX: Number(p.getAttribute('cx')), clientY: Number(p.getAttribute('cy'))}};
}
function down(svg: SVGSVGElement, at: {clientX: number; clientY: number}, extra = {}) {
  fireEvent.pointerDown(svg, {
    ...at,
    pointerId: 1,
    isPrimary: true,
    button: 0,
    pointerType: 'mouse',
    ...extra,
  });
}
function up(svg: SVGSVGElement, at: {clientX: number; clientY: number}, extra = {}) {
  fireEvent.pointerUp(svg, {...at, pointerId: 1, pointerType: 'mouse', ...extra});
}
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
it('keeps a diamond activation five screen pixels outside the mark before traveling three more', () => {
  const width = 24;
  const measure = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: Element,
  ) {
    return this.hasAttribute('data-wcl-chart-activation-outline')
      ? new DOMRect(0, 0, width, width)
      : new DOMRect(0, 0, 640, 360);
  });
  try {
    const {container} = render(<ScatterChart {...common} interaction={{onActivate: () => {}}} />);
    const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
    fireEvent.keyDown(canvas, {key: 'Home'});
    fireEvent.keyDown(canvas, {key: 'ArrowRight'});
    fireEvent.keyDown(canvas, {key: 'Enter', ctrlKey: true});
    const mark = container.querySelector('[data-point-id="b1"] rect')!;
    const cue = container.querySelector('[data-wcl-point-cue="activation"]')!;
    expect(cue.getAttribute('width')).toBe(mark.getAttribute('width'));
    const pulse = container.querySelector<SVGGElement>('[data-wcl-chart-activation-outline]')!;
    for (const axis of ['x', 'y']) {
      const start = Number(pulse.style.getPropertyValue(`--wcl-chart-activation-start-${axis}`));
      const end = Number(pulse.style.getPropertyValue(`--wcl-chart-activation-scale-${axis}`));
      expect(((start - 1) * width) / 2).toBeCloseTo(5);
      expect(((end - start) * width) / 2).toBeCloseTo(3);
    }
  } finally {
    measure.mockRestore();
  }
});
it('selects an observation and activates raw bubble details independently', () => {
  const onActivate = vi.fn<NonNullable<PointChartInteraction<Row>['onActivate']>>();
  const onSelectionChange = vi.fn();
  const {container} = render(
    <BubbleChart
      {...common}
      magnitude={{accessor: 'size', label: 'Size'}}
      interaction={{selection: {labels, onSelectionChange}, onActivate}}
    />,
  );
  const {svg, at} = geometry(container);
  down(svg, at);
  up(svg, at);
  expect(onSelectionChange).toHaveBeenLastCalledWith([{rowId: 'a2', seriesId: 'a'}]);
  expect(container.querySelector('[data-wcl-point-cue="selection"]')).not.toBeNull();
  down(svg, at, {ctrlKey: true});
  up(svg, at, {ctrlKey: true});
  expect(onActivate).toHaveBeenCalledWith({
    item: {rowId: 'a2', seriesId: 'a'},
    datum: data[2],
    label: 'A two',
    x: 70,
    y: 70,
    magnitude: 100,
    input: 'pointer',
  });
  expect(onSelectionChange).toHaveBeenCalledTimes(1);
});
it('selects centers inside a rectangle starting in empty space, not bubble edges', () => {
  const onSelectionChange = vi.fn();
  const {container} = render(
    <BubbleChart
      {...common}
      magnitude={{accessor: 'size', label: 'Size'}}
      interaction={{selection: {labels, onSelectionChange}}}
    />,
  );
  const {svg, at} = geometry(container);
  const start = {clientX: at.clientX - 100, clientY: at.clientY - 40};
  down(svg, start);
  fireEvent.pointerMove(svg, {clientX: at.clientX - 1, clientY: at.clientY + 40, pointerId: 1});
  up(svg, at);
  expect(onSelectionChange).toHaveBeenLastCalledWith([]);
  down(svg, start);
  fireEvent.pointerMove(svg, {
    ...at,
    clientX: at.clientX + 1,
    clientY: at.clientY + 40,
    pointerId: 1,
  });
  up(svg, at);
  expect(onSelectionChange).toHaveBeenLastCalledWith([{rowId: 'a2', seriesId: 'a'}]);
});
it('uses legend priority only among actual hit shapes', () => {
  const onActivate = vi.fn<NonNullable<PointChartInteraction<Row>['onActivate']>>();
  const {container} = render(<ScatterChart {...common} interaction={{onActivate}} />);
  const {svg, at} = geometry(container);
  fireEvent.click(screen.getByRole('button', {name: 'B'}));
  const p = container.querySelector('[data-point-id="a1"] circle')!;
  const coincident = {clientX: Number(p.getAttribute('cx')), clientY: Number(p.getAttribute('cy'))};
  down(svg, coincident);
  up(svg, coincident);
  expect(onActivate.mock.lastCall?.[0].item).toEqual({rowId: 'b1', seriesId: 'b'});
  down(svg, at);
  up(svg, at);
  expect(onActivate.mock.lastCall?.[0].item).toEqual({rowId: 'a2', seriesId: 'a'});
  down(svg, {clientX: 300, clientY: 300});
  up(svg, {clientX: 300, clientY: 300});
  expect(onActivate).toHaveBeenCalledTimes(2);
});
it('steps through coincident observations and selects separately from keyboard activation', () => {
  const onActivate = vi.fn<NonNullable<PointChartInteraction<Row>['onActivate']>>(),
    onSelectionChange = vi.fn();
  const {container} = render(
    <ScatterChart {...common} interaction={{onActivate, selection: {labels, onSelectionChange}}} />,
  );
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'ArrowRight'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(onSelectionChange).toHaveBeenLastCalledWith([{rowId: 'b1', seriesId: 'b'}]);
  fireEvent.keyDown(canvas, {key: 'ArrowRight'});
  fireEvent.keyDown(canvas, {key: 'Enter', metaKey: true});
  expect(onActivate.mock.lastCall?.[0].item).toEqual({rowId: 'a2', seriesId: 'a'});
  expect(onSelectionChange).toHaveBeenCalledTimes(1);
});
it('activates on touch hold without selecting on release and cancels a pending hold on data replacement', () => {
  vi.useFakeTimers();
  const onActivate = vi.fn<NonNullable<PointChartInteraction<Row>['onActivate']>>(),
    onSelectionChange = vi.fn();
  const interaction = {onActivate, selection: {labels, onSelectionChange}};
  const {container, rerender} = render(<ScatterChart {...common} interaction={interaction} />);
  const {svg, at} = geometry(container);
  down(svg, at, {pointerType: 'touch'});
  act(() => {
    vi.advanceTimersByTime(510);
  });
  up(svg, at, {pointerType: 'touch'});
  expect(onActivate.mock.lastCall?.[0].input).toBe('touch');
  expect(onSelectionChange).not.toHaveBeenCalled();
  down(svg, at, {pointerType: 'touch'});
  rerender(<ScatterChart {...common} data={[...data]} interaction={interaction} />);
  act(() => {
    vi.advanceTimersByTime(510);
  });
  up(svg, at, {pointerType: 'touch'});
  expect(onActivate).toHaveBeenCalledTimes(1);
});

it('keeps controlled selection through reordering and cancels drag previews', () => {
  const onSelectionChange = vi.fn();
  const interaction = {
    selection: {labels, selectedItems: [{rowId: 'a2', seriesId: 'a'}], onSelectionChange},
  };
  const {container, rerender} = render(<ScatterChart {...common} interaction={interaction} />);
  const {svg, at} = geometry(container);
  down(svg, at);
  up(svg, at);
  expect(onSelectionChange).toHaveBeenLastCalledWith([]);
  expect(container.querySelector('[data-wcl-chart-selection]')!.textContent).toContain('a2 a');
  rerender(
    <ScatterChart {...common} data={[data[2]!, data[0]!, data[1]!]} interaction={interaction} />,
  );
  expect(container.querySelector('[data-wcl-chart-selection]')!.textContent).toContain('a2 a');
  const start = {clientX: at.clientX - 60, clientY: at.clientY - 40};
  down(svg, start, {altKey: true});
  fireEvent.pointerMove(svg, {
    ...at,
    clientX: at.clientX + 20,
    clientY: at.clientY + 20,
    pointerId: 1,
  });
  expect(container.querySelector('[data-wcl-chart-selection-box]')).not.toBeNull();
  fireEvent.keyDown(container.querySelector('[data-wcl-chart-canvas]')!, {key: 'Escape'});
  up(svg, at);
  expect(onSelectionChange).toHaveBeenCalledTimes(1);
  expect(container.querySelector('[data-wcl-chart-selection]')!.textContent).toContain('a2 a');
  down(svg, start, {altKey: true});
  fireEvent.pointerMove(svg, {
    ...at,
    clientX: at.clientX + 20,
    clientY: at.clientY + 20,
    pointerId: 1,
  });
  up(svg, at);
  expect(onSelectionChange).toHaveBeenLastCalledWith([]);
});

it('hits each symbol rather than its surrounding rectangle and keeps the selected symbol', () => {
  const series = [
    {id: 's0', label: 'Series 0'},
    {id: 's1', label: 'Series 1'},
    {id: 's2', label: 'Series 2'},
    {id: 's3', label: 'Series 3'},
    {id: 's4', label: 'Series 4'},
    {id: 's5', label: 'Series 5'},
  ] as const;
  const observations = series.map((s, i) => ({
    id: `p${i}`,
    group: s.id,
    label: `Point ${i}`,
    x: 15 + i * 14,
    y: 50,
    size: 10,
  }));
  const onSelectionChange = vi.fn();
  const {container} = render(
    <ScatterChart
      {...common}
      data={observations}
      series={series}
      interaction={{selection: {labels, onSelectionChange}}}
    />,
  );
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  Object.defineProperty(svg, 'getBoundingClientRect', {
    value: () => ({left: 0, top: 0, width: 640, height: 360}),
  });
  const plot = container.querySelector('[data-wcl-chart-hit-region]')!;
  const ticks = container.querySelectorAll('[data-axis="x"] [data-wcl-chart-tick-mark]');
  const left = Number(ticks[0]!.getAttribute('x1'));
  const width = Number(ticks[ticks.length - 1]!.getAttribute('x1')) - left;
  const y = Number(plot.getAttribute('y')) + Number(plot.getAttribute('height')) / 2;
  for (let i = 0; i < 6; i++) {
    const at = {clientX: left + (width * observations[i]!.x) / 100, clientY: y};
    down(svg, at);
    up(svg, at);
    expect(onSelectionChange.mock.lastCall?.[0]).toContainEqual({
      rowId: `p${i}`,
      seriesId: `s${i}`,
    });
  }
  expect(
    [...container.querySelectorAll('[data-wcl-point-cue="selection"]')].map((el) =>
      el.getAttribute('data-shape'),
    ),
  ).toEqual(['0', '1', '2', '3', '4', '5']);
  const radius = Number(
    container.querySelector('[data-point-id="p4"]')!.getAttribute('data-mark-radius'),
  );
  const miss = {
    clientX: left + (width * observations[4]!.x) / 100 + radius * 0.8,
    clientY: y + radius * 0.8,
  };
  down(svg, miss);
  up(svg, miss);
  expect(onSelectionChange).toHaveBeenCalledTimes(6);
});

it('preserves the full data symbol at a domain boundary when interaction is enabled', () => {
  const boundary = [{...data[0]!, x: 0, y: 0}];
  const {container, rerender} = render(
    <BubbleChart {...common} data={boundary} magnitude={{accessor: 'size', label: 'Size'}} />,
  );
  const original = container.querySelector('[data-wcl-statistical-point]')!;
  const radius = original.getAttribute('r');
  rerender(
    <BubbleChart
      {...common}
      data={boundary}
      magnitude={{accessor: 'size', label: 'Size'}}
      interaction={{
        selection: {
          labels,
          selectedItems: [{rowId: 'a1', seriesId: 'a'}],
          onSelectionChange: vi.fn(),
        },
      }}
    />,
  );
  const mark = container.querySelector('[data-wcl-statistical-point]')!;
  expect(mark.getAttribute('r')).toBe(radius);
  expect(mark.closest('[clip-path]')).toBeNull();
  expect(
    container.querySelector('[data-wcl-point-cue="selection"]')!.closest('[clip-path]'),
  ).not.toBeNull();
});
it.each(['scatter', 'bubble'] as const)(
  'joins %s selection rings to the normal and emphasized border',
  (kind) => {
    const interaction = {selection: {labels, defaultSelectedItems: [{rowId: 'a2', seriesId: 'a'}]}};
    const {container} = render(
      kind === 'scatter' ? (
        <ScatterChart
          {...common}
          minimumSize={{width: 320, height: 180}}
          interaction={interaction}
        />
      ) : (
        <BubbleChart
          {...common}
          minimumSize={{width: 320, height: 180}}
          magnitude={{accessor: 'size', label: 'Size'}}
          interaction={interaction}
        />
      ),
    );
    const mark = container.querySelector('[data-point-id="a2"] circle')!;
    const radius = Number(mark.getAttribute('r'));
    const ringRadius = () =>
      Number(container.querySelector('[data-wcl-point-cue="selection"]')!.getAttribute('r'));
    // The 320px canvas uses half of the 640-unit view box. Its normal border is 1.75px;
    // the selection border is 2px. Compare their rendered inner and outer edges.
    expect((ringRadius() - radius) * 0.5 - 1).toBeCloseTo(0.875);
    const {svg, at} = geometry(container);
    fireEvent.pointerMove(svg, {...at, pointerType: 'mouse'});
    expect((ringRadius() - radius) * 0.5 - 1).toBeCloseTo(1.4);
    expect(Number(mark.getAttribute('r'))).toBe(radius);
  },
);

it('shows selection details on demand in controls mode and returns focus after clearing', () => {
  const {container} = render(
    <ScatterChart
      {...common}
      interaction={{
        selection: {
          labels,
          presentation: 'controls',
          defaultSelectedItems: [{rowId: 'a1', seriesId: 'a'}],
        },
      }}
    />,
  );
  const controls = container.querySelector<HTMLElement>(
    '[data-wcl-chart-selection][data-presentation="controls"]',
  )!;
  const ui = within(controls);
  expect(controls).toBeTruthy();
  expect(
    container.querySelector('[data-wcl-chart-selection][data-presentation="panel"]'),
  ).toBeNull();
  expect(ui.queryByRole('list')).toBeNull();
  const disclosure = container.querySelector('summary')!;
  fireEvent.click(disclosure);
  expect(ui.getByRole('list')).toBeTruthy();
  fireEvent.keyDown(disclosure, {key: 'Escape'});
  expect(ui.queryByRole('list')).toBeNull();
  fireEvent.click(ui.getByRole('button', {name: labels.clear}));
  expect(ui.getByRole('status').textContent).toBe(labels.empty);
  expect(document.activeElement).toBe(container.querySelector('[data-wcl-chart-canvas]'));
});
