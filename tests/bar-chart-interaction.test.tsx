import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {
  BarChart,
  ColumnChart,
  type ChartInteraction,
  type ChartSelectionItem,
} from '../src/index.js';
const data = [
  {id: 'jan', month: 'Jan', a: 20, b: 30},
  {id: 'feb', month: 'Feb', a: 40, b: 50},
  {id: 'mar', month: 'Mar', a: 60, b: 70},
];
type Row = (typeof data)[number];
const labels = {
  instructions: 'Click selects. Hold activates.',
  clear: 'Clear selection',
  empty: 'None',
  summary: (n: number) => `${n} selected`,
  item: (p: ChartSelectionItem) => `${p.rowId} ${p.seriesId ?? 'month'}`,
  hidden: (s: string) => `${s} hidden`,
};
const common = {
  legend: {label: 'Series'},
  title: 'Energy',
  description: 'Monthly values',
  dataTableLabel: 'Values',
  emptyState: {title: 'Empty', description: 'No data'},
  invalidData: {title: 'Invalid', description: 'Check data'},
  series: [
    {id: 'a', label: 'A', accessor: 'a'},
    {id: 'b', label: 'B', accessor: 'b'},
  ] as const,
};
const config = (
  extra: Partial<ChartInteraction<Row, string>> = {},
): ChartInteraction<Row, string> => ({target: 'point', getRowId: (r) => r.id, ...extra});
function chart(horizontal: boolean, interaction: ChartInteraction<Row, string>, stacked = false) {
  const props = {
    ...common,
    data,
    interaction,
    layout: stacked ? ('stacked' as const) : ('grouped' as const),
  };
  return horizontal ? (
    <BarChart
      {...props}
      xAxis={{label: 'Value', scale: {type: 'linear'}}}
      yAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
    />
  ) : (
    <ColumnChart
      {...props}
      xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
      yAxis={{label: 'Value', scale: {type: 'linear'}}}
    />
  );
}
function geometry(container: HTMLElement) {
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  Object.defineProperty(svg, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({left: 0, top: 0, width: 640, height: 360, right: 640, bottom: 360}),
  });
  return svg;
}
function rect(container: HTMLElement, index: number, id = 'a') {
  const m = container.querySelector(
    `[data-wcl-chart-bar][data-row-index="${index}"][data-series="${id}"]`,
  )!;
  return {
    x: Number(m.getAttribute('x')),
    y: Number(m.getAttribute('y')),
    width: Number(m.getAttribute('width')),
    height: Number(m.getAttribute('height')),
  };
}
const center = (r: ReturnType<typeof rect>) => ({
  clientX: r.x + r.width / 2,
  clientY: r.y + r.height / 2,
});
function click(svg: SVGSVGElement, at: {clientX: number; clientY: number}, extra = {}) {
  fireEvent.pointerDown(svg, {
    ...at,
    pointerId: 1,
    isPrimary: true,
    button: 0,
    pointerType: 'mouse',
    ...extra,
  });
  fireEvent.pointerUp(svg, {...at, pointerId: 1, pointerType: 'mouse', ...extra});
}
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
it.each([false, true])(
  'selects a framed bar and activates its source value, horizontal=%s',
  (horizontal) => {
    const onActivate = vi.fn(),
      onSelectionChange = vi.fn();
    const {container} = render(
      chart(horizontal, config({onActivate, selection: {labels, onSelectionChange}})),
    );
    const svg = geometry(container),
      at = center(rect(container, 1, 'b'));
    fireEvent.pointerMove(svg, {...at, pointerType: 'mouse'});
    click(svg, at);
    expect(onSelectionChange).toHaveBeenLastCalledWith([{rowId: 'feb', seriesId: 'b'}]);
    expect(container.querySelectorAll('[data-wcl-chart-selected-bar]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-wcl-chart-reading-bar]')).toHaveLength(1);
    expect(container.querySelector('[data-wcl-chart-reading-node]')).toBeNull();
    click(svg, at, {ctrlKey: true});
    expect(onActivate.mock.calls[0]![0]).toMatchObject({
      item: {rowId: 'feb', seriesId: 'b'},
      values: [{seriesId: 'b', value: 50}],
      datum: data[1],
    });
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
  },
);
it.each([false, true])(
  'reads a stacked category with one inner contour, horizontal=%s',
  (horizontal) => {
    const onActivate = vi.fn();
    const {container} = render(
      chart(horizontal, config({target: 'category', onActivate, selection: {labels}}), true),
    );
    const svg = geometry(container),
      at = center(rect(container, 1, 'b'));
    fireEvent.pointerMove(svg, {...at, pointerType: 'mouse'});
    const outline = container.querySelector('[data-wcl-chart-reading-bar]');
    expect(outline?.tagName).toBe('path');
    expect(outline?.getAttribute('d')?.match(/M/g)).toHaveLength(1);
    expect(outline?.getAttribute('d')?.match(/L/g)).toHaveLength(3);
    click(svg, at);
    expect(container.querySelectorAll('[data-wcl-chart-selected-category]')).toHaveLength(1);
    click(svg, at, {ctrlKey: true});
    expect(onActivate.mock.calls[0]![0]).toMatchObject({
      item: {rowId: 'feb'},
      values: [
        {seriesId: 'a', value: 40},
        {seriesId: 'b', value: 50},
      ],
    });
  },
);
it.each([false, true])(
  'keeps a zero middle segment inside the continuous month outline, horizontal=%s',
  (horizontal) => {
    const props = {
      ...common,
      data: [{id: 'jan', month: 'Jan', a: 20, b: 0, c: 30}],
      series: [...common.series, {id: 'c', label: 'C', accessor: 'c'}] as const,
      layout: 'stacked' as const,
      interaction: config({target: 'category', onActivate: vi.fn()}),
    };
    const {container} = render(
      horizontal ? (
        <BarChart
          {...props}
          xAxis={{label: 'Value', scale: {type: 'linear'}}}
          yAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
        />
      ) : (
        <ColumnChart
          {...props}
          xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
          yAxis={{label: 'Value', scale: {type: 'linear'}}}
        />
      ),
    );
    const svg = geometry(container),
      at = center(rect(container, 0));
    fireEvent.pointerMove(svg, {...at, pointerType: 'mouse'});
    click(svg, at);
    for (const cue of ['reading', 'activation']) {
      const path = container.querySelector(`[data-wcl-chart-${cue}-bar]`)?.getAttribute('d');
      expect(path?.match(/M/g)).toHaveLength(1);
      expect(path?.match(/L/g)).toHaveLength(3);
    }
  },
);
it.each([false, true])(
  'selects bars touched by a drag and cancels changes, horizontal=%s',
  (horizontal) => {
    const change = vi.fn();
    const {container} = render(
      chart(horizontal, config({selection: {labels, onSelectionChange: change}})),
    );
    const svg = geometry(container),
      r = rect(container, 1);
    const from = {clientX: r.x + 1, clientY: r.y + 1},
      to = {clientX: r.x + 8, clientY: r.y + 8};
    fireEvent.pointerDown(svg, {
      ...from,
      pointerId: 1,
      isPrimary: true,
      button: 0,
      pointerType: 'mouse',
    });
    fireEvent.pointerMove(svg, {...to, pointerId: 1, pointerType: 'mouse'});
    fireEvent.pointerUp(svg, {...to, pointerId: 1, pointerType: 'mouse'});
    expect(change).toHaveBeenLastCalledWith([{rowId: 'feb', seriesId: 'a'}]);
    fireEvent.pointerDown(svg, {
      ...center(rect(container, 0)),
      pointerId: 2,
      isPrimary: true,
      button: 0,
      pointerType: 'mouse',
    });
    fireEvent.pointerMove(svg, {...center(rect(container, 2)), pointerId: 2, pointerType: 'mouse'});
    fireEvent.keyDown(screen.getByRole('group', {name: 'Energy'}), {key: 'Escape'});
    expect(change).toHaveBeenCalledTimes(1);
    expect(container.querySelectorAll('[data-wcl-chart-selected-bar]')).toHaveLength(1);
  },
);
it('uses horizontal chart arrows for categories and series, then holds without selecting', () => {
  vi.useFakeTimers();
  const onActivate = vi.fn(),
    change = vi.fn();
  const {container} = render(
    chart(true, config({onActivate, selection: {labels, onSelectionChange: change}})),
  );
  const canvas = screen.getByRole('group', {name: 'Energy'});
  fireEvent.keyDown(document, {key: 'Tab'});
  fireEvent.focus(canvas);
  fireEvent.keyDown(canvas, {key: 'ArrowDown'});
  fireEvent.keyDown(canvas, {key: 'ArrowRight'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(change).toHaveBeenLastCalledWith([{rowId: 'feb', seriesId: 'b'}]);
  const svg = geometry(container),
    at = center(rect(container, 0));
  fireEvent.pointerDown(svg, {
    ...at,
    pointerId: 1,
    pointerType: 'touch',
    isPrimary: true,
    button: 0,
  });
  act(() => {
    vi.advanceTimersByTime(550);
  });
  fireEvent.pointerUp(svg, {...at, pointerId: 1, pointerType: 'touch'});
  expect(onActivate.mock.calls[0]![0]).toMatchObject({
    item: {rowId: 'jan', seriesId: 'a'},
    input: 'touch',
  });
  expect(change).toHaveBeenCalledTimes(1);
});

it('keeps adjoining selection frames from covering the inner reading', () => {
  const {container} = render(chart(false, config({selection: {labels}})));
  const svg = geometry(container),
    a = rect(container, 1, 'a'),
    b = rect(container, 1, 'b');
  click(svg, center(a));
  click(svg, center(b));
  fireEvent.pointerMove(svg, {...center(b), pointerType: 'mouse'});
  const frames = [...container.querySelectorAll('[data-wcl-chart-selected-bar]')];
  const first = frames[0]!,
    second = frames[1]!;
  expect(Number(first.getAttribute('x')) + Number(first.getAttribute('width'))).toBeCloseTo(b.x);
  expect(Number(second.getAttribute('x'))).toBeCloseTo(b.x);
  expect(
    second.compareDocumentPosition(container.querySelector('[data-wcl-chart-reading-bar]')!) &
      Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
});

it('keeps normalized positions separate from raw activation values', () => {
  const onActivate = vi.fn();
  const {container} = render(
    <ColumnChart
      {...common}
      data={data}
      interaction={config({onActivate})}
      layout="normalized"
      xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
      yAxis={{label: 'Share', unit: '%', scale: {type: 'normalized'}}}
    />,
  );
  const svg = geometry(container),
    at = center(rect(container, 0, 'b'));
  fireEvent.pointerMove(svg, {...at, pointerType: 'mouse'});
  click(svg, at);
  expect(screen.getByRole('tooltip').textContent).toContain('60%');
  expect(onActivate.mock.calls[0]![0]).toMatchObject({values: [{seriesId: 'b', value: 30}]});
});

it('activates zero and negative bar values without invalid contours', () => {
  const onActivate = vi.fn();
  const rows = [
    {id: 'zero', month: 'Zero', a: 0, b: 20},
    {id: 'negative', month: 'Negative', a: -30, b: 10},
  ];
  const {container} = render(
    <ColumnChart
      {...common}
      data={rows}
      interaction={config({onActivate})}
      layout="grouped"
      xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
      yAxis={{label: 'Value', scale: {type: 'linear'}}}
    />,
  );
  const svg = geometry(container);
  click(svg, center(rect(container, 0, 'a')));
  expect(onActivate.mock.calls[0]![0]).toMatchObject({
    item: {rowId: 'zero', seriesId: 'a'},
    values: [{value: 0}],
  });
  const at = center(rect(container, 1, 'a'));
  fireEvent.pointerMove(svg, {...at, pointerType: 'mouse'});
  click(svg, at);
  expect(onActivate.mock.calls[1]![0]).toMatchObject({
    item: {rowId: 'negative', seriesId: 'a'},
    values: [{value: -30}],
  });
  expect(container.querySelector('[data-wcl-chart-reading-bar]')?.getAttribute('d')).not.toMatch(
    /NaN|Infinity/,
  );
});

it('retains controlled hidden items and cancels a hold after data replacement', () => {
  vi.useFakeTimers();
  const onActivate = vi.fn(),
    change = vi.fn();
  const interaction = config({
    onActivate,
    selection: {labels, selectedItems: [{rowId: 'jan', seriesId: 'a'}], onSelectionChange: change},
  });
  const visibilityLabels = {
    hideSeries: (s: string) => `Hide ${s}`,
    showSeries: (s: string) => `Show ${s}`,
    hidden: 'Hidden',
    allHidden: {title: 'All hidden', description: 'Restore a series'},
    showAll: 'Show all',
  };
  const example = (rows: typeof data) => (
    <BarChart
      {...common}
      data={rows}
      interaction={interaction}
      visibilityLabels={visibilityLabels}
      xAxis={{label: 'Value', scale: {type: 'linear'}}}
      yAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
    />
  );
  const {container, rerender} = render(example(data));
  fireEvent.click(screen.getByRole('button', {name: 'Hide A'}));
  expect(container.querySelector('[data-wcl-chart-selection]')?.textContent).toContain(
    'jan a hidden',
  );
  expect(container.querySelector('[data-wcl-chart-selected-bar]')).toBeNull();
  fireEvent.click(screen.getByRole('button', {name: 'Show A'}));
  expect(container.querySelector('[data-wcl-chart-selected-bar]')).not.toBeNull();
  const svg = geometry(container),
    at = center(rect(container, 1, 'b'));
  fireEvent.pointerDown(svg, {
    ...at,
    pointerId: 1,
    pointerType: 'touch',
    isPrimary: true,
    button: 0,
  });
  rerender(example(data.map((r) => ({...r, a: r.a + 2}))));
  act(() => {
    vi.advanceTimersByTime(550);
  });
  expect(onActivate).not.toHaveBeenCalled();
  expect(change).not.toHaveBeenCalled();
});

it.each([
  [120, 40],
  [360, 160],
])('keeps outline travel at three screen pixels for a %s by %s pulse', (width, height) => {
  const measure = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: Element,
  ) {
    return this.hasAttribute('data-wcl-chart-activation-outline')
      ? new DOMRect(0, 0, width, height)
      : new DOMRect(0, 0, 640, 360);
  });
  try {
    const {container} = render(chart(false, config({onActivate: () => {}})));
    const svg = geometry(container);
    click(svg, center(rect(container, 0)));
    const pulse = container.querySelector<SVGGElement>('[data-wcl-chart-activation-outline]');
    expect(pulse).not.toBeNull();
    expect(
      ((Number(pulse!.style.getPropertyValue('--wcl-chart-activation-scale-x')) - 1) * width) / 2,
    ).toBeCloseTo(3);
    expect(
      ((Number(pulse!.style.getPropertyValue('--wcl-chart-activation-scale-y')) - 1) * height) / 2,
    ).toBeCloseTo(3);
  } finally {
    measure.mockRestore();
  }
});
