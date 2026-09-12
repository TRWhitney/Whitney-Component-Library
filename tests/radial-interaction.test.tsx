import {within, act, cleanup, fireEvent, render} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {
  PieChart,
  DonutChart,
  type PartToWholeActivation,
  type PartToWholeSelectionItem,
} from '../src/index.js';
const data = Array.from({length: 10}, (_, i) => ({
  id: `c${i}`,
  label: `Category ${i}`,
  value: 10 - i,
}));
const labels = {
  instructions: 'Click selects; hold opens.',
  clear: 'Clear',
  empty: 'None',
  summary: (n: number) => `${n} selected`,
  item: (i: PartToWholeSelectionItem) => i.id,
  hidden: (s: string) => s,
};
const selection = {labels, containsSelection: 'Contains selected categories'};
const common = {
  data,
  idAccessor: 'id',
  labelAccessor: 'label',
  title: 'Energy',
  description: 'Energy by category',
  value: {accessor: 'value', label: 'Energy', unit: 'MWh'},
  dataTableLabel: 'Energy data',
  emptyState: {title: 'Empty', description: 'No data'},
  invalidData: {title: 'Invalid', description: 'Check data'},
  legend: {label: 'Categories'},
  labels: {
    back: 'Back',
    category: 'Category',
    categoryRange: ({start, end}: {start: number; end: number}) => `${start} to ${end}`,
    moreCategories: (n: number) => `More ${n}`,
    shareOfTotal: 'Total share',
    shareOnPage: 'Page share',
  },
} as const;
function svgOf(container: HTMLElement) {
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  Object.defineProperty(svg, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({left: 0, top: 0, width: 340, height: 340}),
  });
  return svg;
}
function at(container: HTMLElement, id: string, radius = 108) {
  let angle = -Math.PI / 2;
  for (const g of container.querySelectorAll('[data-wcl-radial-segment]')) {
    const size = Number(g.getAttribute('data-angle-size'));
    if (g.getAttribute('data-segment-id') === id) {
      const a = angle + size / 2 - Math.PI / 2;
      return {clientX: 170 + Math.cos(a) * radius, clientY: 170 + Math.sin(a) * radius};
    }
    angle += size;
  }
  throw Error(id);
}
function click(svg: SVGSVGElement, p: {clientX: number; clientY: number}, extra = {}) {
  fireEvent.pointerDown(svg, {
    ...p,
    pointerId: 1,
    pointerType: 'mouse',
    button: 0,
    isPrimary: true,
    ...extra,
  });
  fireEvent.pointerUp(svg, {...p, pointerId: 1, pointerType: 'mouse', ...extra});
}
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
it('selects a slice and independently activates its original category values', () => {
  const onActivate = vi.fn<(a: PartToWholeActivation<(typeof data)[number]>) => void>(),
    onSelectionChange = vi.fn();
  const {container} = render(
    <PieChart
      {...common}
      interaction={{selection: {...selection, onSelectionChange}, onActivate}}
    />,
  );
  const svg = svgOf(container),
    p = at(container, 'c1');
  click(svg, p);
  expect(onSelectionChange).toHaveBeenLastCalledWith([{id: 'c1'}]);
  expect(container.querySelector('[data-wcl-radial-cue="selection"]')).not.toBeNull();
  click(svg, p, {metaKey: true});
  expect(onActivate).toHaveBeenCalledWith({
    item: {id: 'c1'},
    datum: data[1],
    label: 'Category 1',
    value: 9,
    total: 55,
    shareOfTotal: 9 / 55,
    shareOnPage: 9 / 49,
    input: 'pointer',
  });
  expect(onSelectionChange).toHaveBeenCalledTimes(1);
});
it('marks the expansion only for selected categories inside and preserves selections across pages', () => {
  const onActivate = vi.fn();
  const {container, getByRole} = render(
    <DonutChart {...common} totalLabel="Energy" interaction={{selection, onActivate}} />,
  );
  const svg = svgOf(container);
  click(svg, at(container, 'c0'));
  expect(container.querySelector('[data-wcl-radial-aggregate-label]')?.textContent).toBe('+3');
  click(svg, at(container, 'aggregate'));
  click(svg, at(container, 'c8'));
  fireEvent.click(getByRole('button', {name: 'Back'}));
  expect(container.querySelector('[data-wcl-radial-aggregate-label]')?.textContent).toBe('+3*');
  expect(container.querySelector('[data-wcl-chart-selection]')?.textContent).toContain('c8');
  expect(onActivate).not.toHaveBeenCalled();
  fireEvent.click(getByRole('button', {name: 'Clear'}));
  expect(container.querySelector('[data-wcl-radial-aggregate-label]')?.textContent).toBe('+3');
});
it('sweeps the slices actually crossed and ignores the donut hole', () => {
  const two = [
    {id: 'a', label: 'A', value: 1},
    {id: 'b', label: 'B', value: 1},
  ];
  const onSelectionChange = vi.fn();
  const {container} = render(
    <DonutChart
      {...common}
      data={two}
      totalLabel="Energy"
      interaction={{selection: {...selection, onSelectionChange}}}
    />,
  );
  const svg = svgOf(container);
  fireEvent.pointerDown(svg, {
    clientX: 155,
    clientY: 170,
    pointerId: 1,
    pointerType: 'mouse',
    button: 0,
    isPrimary: true,
  });
  fireEvent.pointerMove(svg, {clientX: 185, clientY: 170, pointerId: 1});
  fireEvent.pointerUp(svg, {clientX: 185, clientY: 170, pointerId: 1});
  expect(onSelectionChange).toHaveBeenLastCalledWith([]);
  fireEvent.pointerDown(svg, {
    clientX: 170,
    clientY: 60,
    pointerId: 1,
    pointerType: 'mouse',
    button: 0,
    isPrimary: true,
  });
  fireEvent.pointerMove(svg, {clientX: 170, clientY: 280, pointerId: 1});
  fireEvent.pointerUp(svg, {clientX: 170, clientY: 280, pointerId: 1});
  expect(onSelectionChange).toHaveBeenLastCalledWith([{id: 'a'}, {id: 'b'}]);
});
it('holds to activate without selecting and cancels on source replacement', () => {
  vi.useFakeTimers();
  const onActivate = vi.fn(),
    onSelectionChange = vi.fn();
  const interaction = {selection: {...selection, onSelectionChange}, onActivate};
  const {container, rerender} = render(<PieChart {...common} interaction={interaction} />);
  const svg = svgOf(container),
    p = {...at(container, 'c0'), pointerId: 1, pointerType: 'touch', button: 0, isPrimary: true};
  fireEvent.pointerDown(svg, p);
  act(() => {
    vi.advanceTimersByTime(500);
  });
  fireEvent.pointerUp(svg, p);
  expect(onActivate).toHaveBeenCalledTimes(1);
  expect(onSelectionChange).not.toHaveBeenCalled();
  fireEvent.pointerDown(svg, p);
  rerender(<PieChart {...common} data={[...data]} interaction={interaction} />);
  act(() => {
    vi.advanceTimersByTime(500);
  });
  fireEvent.pointerUp(svg, p);
  expect(onActivate).toHaveBeenCalledTimes(1);
  expect(onSelectionChange).not.toHaveBeenCalled();
});

it('keeps controlled selection with the app and retires removed or zero-valued categories', () => {
  const onSelectionChange = vi.fn();
  const interaction = {
    selection: {...selection, selectedItems: [{id: 'c0'}, {id: 'c8'}], onSelectionChange},
  };
  const {container, rerender} = render(<PieChart {...common} interaction={interaction} />);
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(onSelectionChange).toHaveBeenLastCalledWith([{id: 'c8'}]);
  expect(container.querySelector('[data-wcl-chart-selection]')?.textContent).toContain('c0');
  rerender(
    <PieChart
      {...common}
      data={[...data].reverse().map((d) => (d.id === 'c0' ? {...d, value: 0} : d))}
      interaction={interaction}
    />,
  );
  expect(container.querySelector('[data-wcl-chart-selection]')?.textContent).not.toContain('c0');
  expect(container.querySelector('[data-wcl-chart-selection]')?.textContent).toContain('c8');
  expect(container.querySelectorAll('table tbody tr')).toHaveLength(10);
  expect(onSelectionChange).toHaveBeenCalledTimes(1);
});
it('adds and removes swept categories, and Escape restores the committed selection', () => {
  const two = [
      {id: 'a', label: 'A', value: 1},
      {id: 'b', label: 'B', value: 1},
    ],
    onSelectionChange = vi.fn();
  const {container} = render(
    <DonutChart
      {...common}
      data={two}
      totalLabel="Energy"
      interaction={{
        selection: {...selection, defaultSelectedItems: [{id: 'a'}], onSelectionChange},
      }}
    />,
  );
  const svg = svgOf(container);
  const drag = (extra = {}) => {
    fireEvent.pointerDown(svg, {
      clientX: 170,
      clientY: 255,
      pointerId: 1,
      pointerType: 'mouse',
      button: 0,
      isPrimary: true,
      ...extra,
    });
    fireEvent.pointerMove(svg, {clientX: 170, clientY: 295, pointerId: 1, ...extra});
  };
  drag({shiftKey: true});
  fireEvent.pointerUp(svg, {clientX: 170, clientY: 295, pointerId: 1});
  expect(onSelectionChange).toHaveBeenLastCalledWith([{id: 'a'}, {id: 'b'}]);
  drag({altKey: true});
  fireEvent.keyDown(container.querySelector('[data-wcl-chart-canvas]')!, {key: 'Escape'});
  fireEvent.pointerUp(svg, {clientX: 170, clientY: 295, pointerId: 1});
  expect(onSelectionChange).toHaveBeenCalledTimes(1);
  drag({altKey: true});
  fireEvent.pointerUp(svg, {clientX: 170, clientY: 295, pointerId: 1});
  expect(onSelectionChange).toHaveBeenLastCalledWith([{id: 'a'}]);
});
it('cancels a sweep and hold when presentation changes even with the same data', () => {
  vi.useFakeTimers();
  const onSelectionChange = vi.fn(),
    onActivate = vi.fn(),
    interaction = {selection: {...selection, onSelectionChange}, onActivate};
  const {container, rerender} = render(<PieChart {...common} interaction={interaction} />);
  const svg = svgOf(container),
    p = at(container, 'c0');
  fireEvent.pointerDown(svg, {
    ...p,
    pointerId: 1,
    pointerType: 'touch',
    button: 0,
    isPrimary: true,
  });
  rerender(<PieChart {...common} aspectRatio={1.5} interaction={interaction} />);
  act(() => {
    vi.advanceTimersByTime(500);
  });
  fireEvent.pointerUp(svg, {...p, pointerId: 1, pointerType: 'touch'});
  expect(onActivate).not.toHaveBeenCalled();
  expect(onSelectionChange).not.toHaveBeenCalled();
  fireEvent.pointerDown(svg, {
    ...p,
    pointerId: 2,
    pointerType: 'mouse',
    button: 0,
    isPrimary: true,
  });
  fireEvent.pointerMove(svg, {clientX: p.clientX + 10, clientY: p.clientY + 10, pointerId: 2});
  rerender(<PieChart {...common} aspectRatio={1.6} interaction={interaction} />);
  fireEvent.pointerUp(svg, {...p, pointerId: 2, pointerType: 'mouse'});
  expect(onSelectionChange).not.toHaveBeenCalled();
});
it('keeps the hole empty for a full-circle donut and activates directly without selection', () => {
  const single = [{id: 'one', label: 'One', value: 12}],
    onActivate = vi.fn();
  const {container} = render(
    <DonutChart {...common} data={single} totalLabel="Energy" interaction={{onActivate}} />,
  );
  const svg = svgOf(container);
  click(svg, {clientX: 170, clientY: 170});
  expect(onActivate).not.toHaveBeenCalled();
  click(svg, {clientX: 170, clientY: 60});
  expect(onActivate).toHaveBeenCalledWith({
    item: {id: 'one'},
    datum: single[0],
    label: 'One',
    value: 12,
    total: 12,
    shareOfTotal: 1,
    shareOnPage: 1,
    input: 'pointer',
  });
});
it('keeps sweeping when the selection summary grows without resizing the plot', () => {
  vi.spyOn(SVGElement.prototype, 'getBoundingClientRect').mockReturnValue(
    new DOMRect(0, 0, 340, 340),
  );
  let height = 500;
  const resize: (() => void)[] = [];
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: () => void) {
        resize.push(callback);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  const measure = vi
    .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockImplementation(function (this: HTMLElement) {
      return new DOMRect(
        0,
        0,
        this.matches('[data-wcl-part-to-whole-chart]') ? 600 : 0,
        this.matches('[data-wcl-part-to-whole-chart]') ? height : 0,
      );
    });
  const onSelectionChange = vi.fn();
  const {container} = render(
    <PieChart {...common} interaction={{selection: {...selection, onSelectionChange}}} />,
  );
  const svg = svgOf(container),
    p = at(container, 'c0');
  fireEvent.pointerDown(svg, {
    ...p,
    pointerId: 1,
    pointerType: 'mouse',
    button: 0,
    isPrimary: true,
  });
  fireEvent.pointerMove(svg, {clientX: p.clientX + 10, clientY: p.clientY + 10, pointerId: 1});
  height = 560;
  act(() => {
    for (const notify of resize) notify();
  });
  fireEvent.pointerUp(svg, {...p, pointerId: 1, pointerType: 'mouse'});
  expect(onSelectionChange).toHaveBeenCalledWith([{id: 'c0'}]);
  measure.mockRestore();
  vi.unstubAllGlobals();
});
it('shows the swept path until release or cancellation', () => {
  const {container} = render(
    <DonutChart {...common} totalLabel="Total" interaction={{selection}} />,
  );
  const svg = svgOf(container),
    start = at(container, 'c0'),
    end = at(container, 'c1');
  const begin = () =>
    fireEvent.pointerDown(svg, {
      ...start,
      pointerId: 1,
      pointerType: 'mouse',
      button: 0,
      isPrimary: true,
    });
  const move = () => fireEvent.pointerMove(svg, {...end, pointerId: 1, pointerType: 'mouse'});
  begin();
  move();
  expect(container.querySelectorAll('[data-wcl-radial-sweep]')).toHaveLength(1);
  expect(container.querySelector('[data-wcl-radial-sweep] polyline')?.getAttribute('points')).toBe(
    `${start.clientX},${start.clientY} ${end.clientX},${end.clientY}`,
  );
  fireEvent.pointerUp(svg, {...end, pointerId: 1, pointerType: 'mouse'});
  expect(container.querySelector('[data-wcl-radial-sweep]')).toBeNull();
  begin();
  move();
  fireEvent.pointerCancel(svg, {pointerId: 1});
  expect(container.querySelector('[data-wcl-radial-sweep]')).toBeNull();
});

it('cancels pending gestures and feedback when activation availability changes', () => {
  vi.useFakeTimers();
  const onActivate = vi.fn(),
    onSelectionChange = vi.fn();
  const both = {selection: {...selection, onSelectionChange}, onActivate};
  const {container, rerender} = render(<PieChart {...common} interaction={both} />);
  const svg = svgOf(container),
    p = at(container, 'c0');
  const begin = () =>
    fireEvent.pointerDown(svg, {
      ...p,
      pointerId: 1,
      pointerType: 'touch',
      button: 0,
      isPrimary: true,
    });
  begin();
  rerender(<PieChart {...common} interaction={{selection: both.selection}} />);
  act(() => {
    vi.advanceTimersByTime(520);
  });
  expect(container.querySelectorAll('[data-wcl-radial-activation]')).toHaveLength(0);
  expect(onActivate).not.toHaveBeenCalled();
  fireEvent.pointerUp(svg, {...p, pointerId: 1, pointerType: 'touch'});
  rerender(<PieChart {...common} interaction={both} />);
  click(svg, p, {ctrlKey: true});
  expect(container.querySelectorAll('[data-wcl-radial-activation]')).toHaveLength(1);
  rerender(<PieChart {...common} interaction={{selection: both.selection}} />);
  expect(container.querySelectorAll('[data-wcl-radial-activation]')).toHaveLength(0);
  begin();
  fireEvent.pointerMove(svg, {clientX: p.clientX + 10, clientY: p.clientY + 10, pointerId: 1});
  rerender(<PieChart {...common} interaction={both} />);
  fireEvent.pointerUp(svg, {...p, pointerId: 1, pointerType: 'touch'});
  expect(onSelectionChange).not.toHaveBeenCalled();
  expect(container.querySelector('[data-wcl-radial-sweep]')).toBeNull();
});

it('shows selection details on demand in controls mode and returns focus after clearing', () => {
  const {container} = render(
    <PieChart
      {...common}
      interaction={{
        selection: {...selection, presentation: 'controls', defaultSelectedItems: [{id: 'c1'}]},
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
