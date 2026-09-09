import {act, cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {ScatterChart, BubbleChart, BoxPlot} from '../src/index.js';
const data = [
  {id: 'a1', label: 'A one', group: 'a', x: 10, y: 20, size: 10},
  {id: 'a2', label: 'A two', group: 'a', x: 20, y: 30, size: 20},
  {id: 'b1', label: 'B one', group: 'b', x: 100, y: 200, size: 100},
];
const visibilityLabels = {
  hidden: 'Hidden',
  hideSeries: (s: string) => `Hide ${s}`,
  showSeries: (s: string) => `Show ${s}`,
  showAll: 'Show all',
  allHidden: {title: 'All hidden', description: 'Restore a group.'},
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
  description: 'Observed readings.',
  dataTableLabel: 'Readings',
  emptyState: {title: 'Empty', description: 'Add data.'},
  invalidData: {title: 'Invalid', description: 'Correct data.'},
  xAxis: {accessor: 'x', label: 'X', scale: {type: 'linear'}},
  yAxis: {accessor: 'y', label: 'Y', scale: {type: 'linear'}},
  visibilityLabels,
} as const;
const labels = {
  instructions: 'Select readings.',
  clear: 'Clear',
  empty: 'None',
  summary: (n: number) => `${n} selected`,
  item: (i: {rowId: string}) => i.rowId,
  hidden: (s: string) => `${s} hidden`,
};
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function hide(name: string) {
  fireEvent.click(screen.getByRole('button', {name: `Hide ${name}`}));
}
function y(container: HTMLElement, id: string) {
  return Number(container.querySelector(`[data-point-id="${id}"] circle`)?.getAttribute('cy'));
}
it('hides scatter groups independently of pinning and preserves complete table rows and stable legend entries', () => {
  const {container} = render(<ScatterChart {...common} />);
  fireEvent.click(screen.getByRole('button', {name: 'A'}));
  expect(screen.getByRole('button', {name: 'A'}).getAttribute('aria-pressed')).toBe('true');
  const shape = container.querySelector('[data-point-id="a1"]')?.innerHTML;
  hide('A');
  expect(container.querySelector('[data-point-id="a1"]')).toBeNull();
  expect(screen.getByRole('button', {name: 'A'}).getAttribute('aria-pressed')).toBe('false');
  expect(screen.getByRole('button', {name: 'A'}).getAttribute('aria-disabled')).toBe('true');
  expect(within(screen.getByRole('table')).getByRole('row', {name: /A one A Hidden/})).toBeTruthy();
  fireEvent.click(screen.getByRole('button', {name: 'Show A'}));
  expect(container.querySelector('[data-point-id="a1"]')?.innerHTML).toBe(shape);
  const item = screen.getByRole('button', {name: 'A'}).parentElement!;
  expect(
    [...item.querySelectorAll('button')].map((b) => b.getAttribute('aria-label') ?? b.textContent),
  ).toEqual(['A', 'Hide A']);
});
it('fits visible numeric data, preserves fixed domains and uses the same behavior for bubbles', async () => {
  const {container, rerender} = render(
    <BubbleChart {...common} magnitude={{accessor: 'size', label: 'Count'}} />,
  );
  const before = y(container, 'a2');
  hide('B');
  await waitFor(() => expect(y(container, 'a2')).not.toBe(before));
  expect(container.querySelector('[data-point-id="b1"]')).toBeNull();
  rerender(
    <BubbleChart
      {...common}
      xAxis={{...common.xAxis, scale: {type: 'linear', domain: [0, 100]}}}
      yAxis={{...common.yAxis, scale: {type: 'linear', domain: [0, 200]}}}
      magnitude={{accessor: 'size', label: 'Count'}}
    />,
  );
  const fixed = y(container, 'a1');
  fireEvent.click(screen.getByRole('button', {name: 'Show B'}));
  expect(y(container, 'a1')).toBe(fixed);
});
it('retains hidden selections and all-hidden recovery, while keyboard activation visits visible records only', () => {
  const onActivate = vi.fn();
  const {container} = render(
    <ScatterChart
      {...common}
      interaction={{
        onActivate,
        selection: {labels, defaultSelectedItems: [{rowId: 'b1', seriesId: 'b'}]},
      }}
    />,
  );
  hide('B');
  expect(screen.getByText('b1 hidden')).toBeTruthy();
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'End'});
  fireEvent.keyDown(canvas, {key: 'Enter', ctrlKey: true});
  expect(onActivate).toHaveBeenLastCalledWith(
    expect.objectContaining({item: {rowId: 'a2', seriesId: 'a'}}),
  );
  hide('A');
  expect(screen.getByText('All hidden')).toBeTruthy();
  expect(screen.queryByText('Invalid')).toBeNull();
  expect(container.querySelector('[data-wcl-chart-svg]')).toBeNull();
  expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(4);
  fireEvent.click(screen.getByRole('button', {name: 'Show all'}));
  expect(document.activeElement).toBe(screen.getByRole('button', {name: 'Hide A'}));
  expect(screen.getByText('1 selected')).toBeTruthy();
  expect(screen.queryByText('b1 hidden')).toBeNull();
});
it('reconciles hidden group identity after removal and data updates', () => {
  const {container, rerender} = render(<ScatterChart {...common} />);
  hide('B');
  rerender(<ScatterChart {...common} data={data.map((d) => ({...d, y: d.y + 1}))} />);
  expect(container.querySelector('[data-point-id="b1"]')).toBeNull();
  rerender(<ScatterChart {...common} series={[{id: 'a', label: 'A'}]} data={data.slice(0, 2)} />);
  rerender(<ScatterChart {...common} />);
  expect(container.querySelector('[data-point-id="b1"]')).toBeTruthy();
});
const boxData = [
  {group: 'a', low: 10, q1: 20, median: 30, q3: 40, high: 50, outliers: [-20, 80]},
  {group: 'b', low: 100, q1: 120, median: 130, q3: 140, high: 150, outliers: [200]},
];
const boxProps = {
  data: boxData,
  groups: common.series,
  groupAccessor: 'group',
  legend: common.legend,
  title: 'Distributions',
  description: 'Group ranges.',
  dataTableLabel: 'Summaries',
  emptyState: common.emptyState,
  invalidData: common.invalidData,
  xAxis: {label: 'Group'},
  yAxis: {label: 'Value', scale: {type: 'linear'}},
  visibilityLabels,
  distribution: {
    kind: 'summary',
    lowerWhiskerAccessor: 'low',
    q1Accessor: 'q1',
    medianAccessor: 'median',
    q3Accessor: 'q3',
    upperWhiskerAccessor: 'high',
    outliersAccessor: 'outliers',
    whisker: 'tukey',
  },
} as const;
it('hides box summaries and outliers together and preserves their selected identity', () => {
  const {container} = render(
    <BoxPlot
      {...boxProps}
      interaction={{
        getOutlierId: (ctx) => String(ctx.value),
        selection: {
          labels: {...labels, item: (i) => i.groupId},
          defaultSelectedItems: [{kind: 'summary', groupId: 'b'}],
        },
      }}
    />,
  );
  hide('B');
  expect(screen.getByText('b hidden')).toBeTruthy();
  expect(within(screen.getByRole('table')).getByRole('row', {name: /B Hidden/})).toBeTruthy();
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'End'});
  expect(screen.getByRole('tooltip').textContent).not.toContain('200');
  hide('A');
  expect(screen.getByText('All hidden')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', {name: 'Show all'}));
  expect(screen.getByText('1 selected')).toBeTruthy();
});
it('requires a legend for visibility and does not let hidden invalid data become valid', () => {
  const {legend: omittedLegend, ...withoutLegend} = common;
  void omittedLegend;
  expect(() =>
    render(
      <ScatterChart {...withoutLegend} series={[{id: 'a', label: 'A'}]} data={data.slice(0, 2)} />,
    ),
  ).toThrow(/legend/i);
  render(
    <ScatterChart
      {...common}
      data={[...data, {id: 'bad', label: 'Bad', group: 'b', x: 0, y: NaN, size: 1}]}
    />,
  );
  hide('B');
  expect(screen.getByText('Invalid')).toBeTruthy();
  hide('A');
  expect(screen.getByText('Invalid')).toBeTruthy();
});

it('animates both scatter axes from the displayed domain and settles for reduced motion', () => {
  let time = 0,
    next = 0;
  const frames = new Map<number, FrameRequestCallback>();
  const listeners = new Set<() => void>();
  const media = {
    matches: false,
    addEventListener: (_type: string, fn: () => void) => listeners.add(fn),
    removeEventListener: (_type: string, fn: () => void) => listeners.delete(fn),
  };
  vi.spyOn(performance, 'now').mockImplementation(() => time);
  vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => {
    frames.set(++next, fn);
    return next;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
  vi.stubGlobal('matchMedia', () => media);
  const advance = (to: number) => {
    time = to;
    act(() => {
      const batch = [...frames.values()];
      frames.clear();
      batch.forEach((fn) => fn(to));
    });
  };
  const {container, unmount} = render(<ScatterChart {...common} />);
  const position = () => {
    const c = container.querySelector('[data-point-id="a2"] circle')!;
    return [Number(c.getAttribute('cx')), Number(c.getAttribute('cy'))];
  };
  const initial = position();
  hide('B');
  expect(position()).toEqual(initial);
  advance(100);
  const midway = position();
  expect(midway[0]).toBeGreaterThan(initial[0]!);
  expect(midway[1]).toBeLessThan(initial[1]!);
  advance(250);
  const final = position();
  expect(final[0]).toBeGreaterThan(midway[0]!);
  expect(final[1]).toBeLessThan(midway[1]!);
  fireEvent.click(screen.getByRole('button', {name: 'Show B'}));
  advance(300);
  const interrupted = position();
  hide('B');
  expect(position()).toEqual(interrupted);
  act(() => {
    media.matches = true;
    listeners.forEach((fn) => fn());
  });
  expect(position()).toEqual(final);
  expect(frames.size).toBe(0);
  unmount();
  expect(frames.size).toBe(0);
});
it('keeps logarithmic scales positive and exact readings after hiding', () => {
  const {container} = render(
    <ScatterChart
      {...common}
      xAxis={{...common.xAxis, scale: {type: 'logarithmic'}}}
      yAxis={{...common.yAxis, scale: {type: 'logarithmic'}}}
    />,
  );
  hide('B');
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'End'});
  expect(screen.getByRole('tooltip').textContent).toContain('30');
  for (const circle of container.querySelectorAll('[data-point-id] circle')) {
    expect(Number.isFinite(Number(circle.getAttribute('cx')))).toBe(true);
    expect(Number.isFinite(Number(circle.getAttribute('cy')))).toBe(true);
  }
});
it('cancels a touch hold when group visibility changes and prunes removed selected data', () => {
  vi.useFakeTimers();
  const onActivate = vi.fn();
  const interaction = {
    onActivate,
    selection: {labels, defaultSelectedItems: [{rowId: 'b1', seriesId: 'b'}]},
  };
  const {container, rerender} = render(<ScatterChart {...common} interaction={interaction} />);
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 640, 360));
  const mark = container.querySelector('[data-point-id="a2"] circle')!;
  fireEvent.pointerDown(svg, {
    clientX: Number(mark.getAttribute('cx')),
    clientY: Number(mark.getAttribute('cy')),
    pointerId: 1,
    isPrimary: true,
    button: 0,
    pointerType: 'touch',
  });
  hide('B');
  act(() => {
    vi.advanceTimersByTime(550);
  });
  expect(onActivate).not.toHaveBeenCalled();
  expect(screen.getByText('b1 hidden')).toBeTruthy();
  rerender(<ScatterChart {...common} data={data.slice(0, 2)} interaction={interaction} />);
  expect(screen.getByText('None')).toBeTruthy();
  vi.useRealTimers();
});
it('keeps hidden box outlier selections and cancels a range preview on hide', () => {
  const onSelectionChange = vi.fn();
  const {container} = render(
    <BoxPlot
      {...boxProps}
      interaction={{
        getOutlierId: (ctx) => String(ctx.value),
        selection: {
          labels: {...labels, item: (i) => i.groupId},
          defaultSelectedItems: [{kind: 'outlier', groupId: 'b', outlierId: '200'}],
          onSelectionChange,
        },
      }}
    />,
  );
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 640, 360));
  fireEvent.pointerDown(svg, {
    clientX: 150,
    clientY: 150,
    pointerId: 1,
    isPrimary: true,
    button: 0,
    pointerType: 'mouse',
  });
  fireEvent.pointerMove(svg, {clientX: 350, clientY: 200, pointerId: 1, pointerType: 'mouse'});
  expect(container.querySelector('[data-wcl-chart-selection-box]')).toBeTruthy();
  hide('B');
  expect(container.querySelector('[data-wcl-chart-selection-box]')).toBeNull();
  fireEvent.pointerUp(svg, {clientX: 350, clientY: 200, pointerId: 1, pointerType: 'mouse'});
  expect(onSelectionChange).not.toHaveBeenCalled();
  expect(screen.getByText('b hidden')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', {name: 'Show B'}));
  expect(screen.getByText('1 selected')).toBeTruthy();
});

it('bounds a restored distant group while its numeric domains expand', () => {
  let next = 0;
  const frames = new Map<number, FrameRequestCallback>();
  vi.spyOn(performance, 'now').mockReturnValue(0);
  vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => {
    frames.set(++next, fn);
    return next;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
  const {container} = render(<ScatterChart {...common} />);
  hide('B');
  act(() => {
    const batch = [...frames.values()];
    frames.clear();
    batch.forEach((fn) => fn(250));
  });
  fireEvent.click(screen.getByRole('button', {name: 'Show B'}));
  const mark = container.querySelector('[data-point-id="b1"]')!;
  expect(Number(mark.querySelector('rect')!.getAttribute('x'))).toBeGreaterThan(640);
  const clipReference = mark.closest('[clip-path]')?.getAttribute('clip-path');
  expect(clipReference).toBeTruthy();
  const clipId = clipReference!.slice(5, -1);
  const clip = container.querySelector(`[id="${clipId}"] rect`)!;
  expect(Number(clip.getAttribute('x'))).toBeGreaterThanOrEqual(0);
  expect(Number(clip.getAttribute('x')) + Number(clip.getAttribute('width'))).toBeLessThanOrEqual(
    640,
  );
  expect(Number(clip.getAttribute('y'))).toBeGreaterThanOrEqual(0);
  expect(Number(clip.getAttribute('y')) + Number(clip.getAttribute('height'))).toBeLessThanOrEqual(
    360,
  );
});

it.each(['hover', 'focus'] as const)(
  'releases legend emphasis on a second activation while %s remains',
  (preview) => {
    const {container} = render(<ScatterChart {...common} />);
    const button = container.querySelector<HTMLButtonElement>('[data-wcl-chart-legend-button]')!;
    const entry = button.closest('li')!;
    if (preview === 'hover') fireEvent.mouseEnter(button);
    else {
      act(() => button.focus());
      fireEvent.focus(button);
    }
    expect(entry.hasAttribute('data-emphasized')).toBe(true);
    fireEvent.click(button);
    expect(button.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(button);
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(entry.hasAttribute('data-emphasized')).toBe(false);
    expect(container.querySelector('[data-wcl-chart-legend] [data-muted]')).toBeNull();
    if (preview === 'focus') expect(document.activeElement).toBe(button);
    if (preview === 'hover') {
      fireEvent.mouseLeave(button);
      fireEvent.mouseEnter(button);
    } else {
      fireEvent.blur(button);
      fireEvent.focus(button);
    }
    expect(entry.hasAttribute('data-emphasized')).toBe(true);
    fireEvent.click(button);
    expect(button.getAttribute('aria-pressed')).toBe('true');
  },
);
