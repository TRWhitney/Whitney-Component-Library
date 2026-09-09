import {act, cleanup, fireEvent, render, screen, within, waitFor} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {PieChart, DonutChart, type PartToWholeSelectionItem} from '../src/index.js';
const data = [
  {id: 'a', label: 'A', value: 50},
  {id: 'b', label: 'B', value: 30},
  {id: 'c', label: 'C', value: 20},
];
const visibilityLabels = {
  hidden: 'Hidden',
  hideSeries: (s: string) => `Hide ${s}`,
  showSeries: (s: string) => `Show ${s}`,
  showAll: 'Show all',
  allHidden: {title: 'No visible slices', description: 'Restore a category or change page.'},
};
const common = {
  data,
  idAccessor: 'id',
  labelAccessor: 'label',
  title: 'Categories',
  description: 'Recorded values',
  dataTableLabel: 'All records',
  emptyState: {title: 'Empty', description: 'Add records.'},
  invalidData: {title: 'Invalid', description: 'Correct records.'},
  value: {accessor: 'value', label: 'Value'},
  legend: {label: 'Categories'},
  labels: {
    back: 'Back',
    category: 'Category',
    categoryRange: ({start, end, total}: {start: number; end: number; total: number}) =>
      `${start}-${end} of ${total}`,
    moreCategories: (n: number) => `More ${n}`,
    shareOfTotal: 'Visible share',
    shareOnPage: 'Page share',
  },
  visibilityLabels,
} as const;
const labels = {
  instructions: 'Select slices',
  clear: 'Clear',
  empty: 'None',
  summary: (n: number) => `${n} selected`,
  item: (item: PartToWholeSelectionItem) => item.id,
  hidden: (s: string) => `${s} hidden`,
};
const hide = (name: string) => fireEvent.click(screen.getByRole('button', {name: `Hide ${name}`}));
const slice = (container: HTMLElement, id: string) =>
  container.querySelector(`[data-segment-id="${id}"]`);
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
it.each(['pie', 'donut'])(
  'refits %s to visible shares while keeping records and category identity',
  async (kind) => {
    const chartProps = {...common, interaction: {onActivate: vi.fn()}};
    const {container} = render(
      kind === 'pie' ? (
        <PieChart {...chartProps} />
      ) : (
        <DonutChart {...chartProps} totalLabel="Visible total" />
      ),
    );
    const color = slice(container, 'b')!.getAttribute('data-color');
    hide('A');
    expect(slice(container, 'a')).toBeNull();
    await waitFor(() =>
      expect(Number(slice(container, 'b')!.getAttribute('data-angle-size'))).toBeCloseTo(
        Math.PI * 2 * 0.6,
        5,
      ),
    );
    expect(slice(container, 'b')!.getAttribute('data-color')).toBe(color);
    expect(screen.getByRole('rowheader', {name: 'A (Hidden)'})).toBeTruthy();
    expect(within(screen.getByRole('table')).getByText('60%')).toBeTruthy();
    if (kind === 'donut')
      expect(container.querySelector('[data-wcl-radial-total-value]')!.textContent).toBe('50');
    const canvas = container.querySelector('[data-wcl-part-to-whole-canvas]')!;
    fireEvent.keyDown(canvas, {key: 'Home'});
    fireEvent.keyDown(canvas, {key: 'Enter'});
    expect(chartProps.interaction.onActivate).toHaveBeenCalledWith(
      expect.objectContaining({
        item: {id: 'b'},
        value: 30,
        total: 50,
        shareOfTotal: 0.6,
        shareOnPage: 0.6,
        datum: data[1],
      }),
    );
    fireEvent.click(screen.getByRole('button', {name: 'Show A'}));
    expect(slice(container, 'a')).toBeTruthy();
  },
);
it('keeps hidden selection and the full table through all-hidden recovery', () => {
  const onSelectionChange = vi.fn();
  const {container} = render(
    <PieChart
      {...common}
      interaction={{
        selection: {
          labels,
          containsSelection: 'Contains selection',
          defaultSelectedItems: [{id: 'a'}],
          onSelectionChange,
        },
      }}
    />,
  );
  hide('A');
  hide('B');
  hide('C');
  expect(screen.getByText('a hidden')).toBeTruthy();
  expect(screen.getByText('No visible slices')).toBeTruthy();
  expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(4);
  expect(onSelectionChange).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', {name: 'Show all'}));
  expect(document.activeElement).toBe(screen.getByRole('button', {name: 'Hide A'}));
  expect(container.querySelectorAll('[data-wcl-radial-slice]')).toHaveLength(3);
});
it('keeps fixed legend pages, individual eyes and access to hidden later categories', () => {
  const many = Array.from({length: 9}, (_, i) => ({id: `i${i}`, label: `Item ${i}`, value: 9 - i}));
  const {container} = render(<PieChart {...common} data={many} />);
  expect(screen.queryByRole('button', {name: 'Hide More 2'})).toBeNull();
  hide('Item 0');
  expect(screen.getByRole('button', {name: 'Show Item 0'})).toBeTruthy();
  expect(screen.queryByRole('button', {name: 'Hide Item 7'})).toBeNull();
  fireEvent.click(container.querySelector('[data-aggregate][data-wcl-radial-segment] path')!);
  hide('Item 7');
  hide('Item 8');
  fireEvent.click(screen.getByRole('button', {name: 'Back'}));
  expect(container.querySelector('[data-aggregate][data-wcl-radial-segment]')).toBeNull();
  const paging = container.querySelector('[data-wcl-radial-legend]')!;
  fireEvent.click(within(paging as HTMLElement).getByRole('button', {name: 'More 2'}));
  expect(screen.getByRole('button', {name: 'Show Item 7'})).toBeTruthy();
  fireEvent.click(screen.getByRole('button', {name: 'Show Item 7'}));
  expect(slice(container, 'i7')).toBeTruthy();
});
it('preserves visibility on value updates and retires it when an ID leaves the data', () => {
  const {container, rerender} = render(<PieChart {...common} />);
  hide('A');
  rerender(<PieChart {...common} data={[{...data[0]!, value: 60}, data[1]!, data[2]!]} />);
  expect(slice(container, 'a')).toBeNull();
  rerender(<PieChart {...common} data={data.slice(1)} />);
  rerender(<PieChart {...common} />);
  expect(slice(container, 'a')).toBeTruthy();
});

it('animates and retargets slice boundaries while totals and shares remain exact', () => {
  let now = 0,
    next = 0;
  const frames = new Map<number, FrameRequestCallback>();
  vi.spyOn(performance, 'now').mockImplementation(() => now);
  vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => {
    frames.set(++next, fn);
    return next;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
  const step = (time: number) =>
    act(() => {
      now = time;
      const batch = [...frames.values()];
      frames.clear();
      batch.forEach((fn) => fn(time));
    });
  const {container} = render(<DonutChart {...common} totalLabel="Visible total" />);
  const angle = () => Number(slice(container, 'b')!.getAttribute('data-angle-size'));
  const original = angle();
  hide('A');
  expect(angle()).toBe(original);
  expect(container.querySelector('[data-wcl-radial-total-value]')!.textContent).toBe('50');
  expect(within(screen.getByRole('table')).getByText('60%')).toBeTruthy();
  step(120);
  expect(angle()).toBeGreaterThan(original);
  expect(angle()).toBeLessThan(Math.PI * 2 * 0.6);
  const interrupted = angle();
  fireEvent.click(screen.getByRole('button', {name: 'Show A'}));
  expect(angle()).toBe(interrupted);
  step(360);
  expect(angle()).toBeCloseTo(original, 5);
  const sizes = [...container.querySelectorAll('[data-angle-size]')].map((e) =>
    Number(e.getAttribute('data-angle-size')),
  );
  expect(sizes.every((n) => Number.isFinite(n) && n >= 0)).toBe(true);
  expect(sizes.reduce((a, b) => a + b, 0)).toBeCloseTo(Math.PI * 2, 5);
});
it('settles reduced motion directly and preserves zero records and invalid feedback', () => {
  vi.stubGlobal('matchMedia', () => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  const {container} = render(
    <PieChart
      {...common}
      data={[...data, {id: 'zero', label: 'Zero', value: 0}, {id: 'bad', label: 'Bad', value: -1}]}
    />,
  );
  hide('A');
  expect(Number(slice(container, 'b')!.getAttribute('data-angle-size'))).toBeCloseTo(
    Math.PI * 2 * 0.6,
    5,
  );
  expect(screen.queryByRole('button', {name: 'Hide Zero'})).toBeNull();
  expect(screen.getByRole('rowheader', {name: 'Zero'})).toBeTruthy();
  hide('B');
  hide('C');
  expect(screen.getByText('Invalid')).toBeTruthy();
  expect(screen.getByText('No visible slices')).toBeTruthy();
});
it('keeps selected hidden later categories marked on expansion and prunes removed data', () => {
  const many = Array.from({length: 9}, (_, i) => ({id: `i${i}`, label: `Item ${i}`, value: 9 - i}));
  const interaction = {
    selection: {
      labels,
      containsSelection: 'Contains selection',
      defaultSelectedItems: [{id: 'i8'}],
    },
  };
  const {container, rerender} = render(
    <PieChart {...common} data={many} interaction={interaction} />,
  );
  fireEvent.click(
    within(container.querySelector<HTMLElement>('[data-wcl-radial-legend]')!).getByRole('button', {
      name: /More 2/,
    }),
  );
  hide('Item 8');
  fireEvent.click(screen.getByRole('button', {name: 'Back'}));
  expect(container.querySelector('[data-wcl-radial-aggregate-label]')!.textContent).toBe('+2*');
  expect(screen.getByText('i8 hidden')).toBeTruthy();
  rerender(<PieChart {...common} data={many.slice(0, 8)} interaction={interaction} />);
  expect(screen.queryByText('i8 hidden')).toBeNull();
});
it('cancels pending touch activation when its category is hidden', () => {
  vi.useFakeTimers();
  const onActivate = vi.fn();
  const {container} = render(
    <PieChart
      {...common}
      interaction={{onActivate, selection: {labels, containsSelection: 'Contains selection'}}}
    />,
  );
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 400, 400));
  fireEvent.pointerDown(svg, {
    clientX: 280,
    clientY: 200,
    pointerId: 1,
    pointerType: 'touch',
    isPrimary: true,
    button: 0,
  });
  hide('A');
  act(() => {
    vi.advanceTimersByTime(600);
  });
  fireEvent.pointerUp(svg, {clientX: 280, clientY: 200, pointerId: 1, pointerType: 'touch'});
  expect(onActivate).not.toHaveBeenCalled();
});

it('keeps a lone expansion slice visible with smallest aggregate sizing', async () => {
  const records = Array.from({length: 9}, (_, index) => ({
    id: `i${index}`,
    label: `Item ${index}`,
    value: 10 - index,
  }));
  const {container} = render(<PieChart {...common} data={records} aggregateSizing="smallest" />);
  for (let index = 0; index < 7; index++) hide(`Item ${index}`);
  await waitFor(() =>
    expect(
      Number(
        container
          .querySelector('[data-aggregate][data-wcl-radial-segment]')!
          .getAttribute('data-angle-size'),
      ),
    ).toBeCloseTo(Math.PI * 2, 5),
  );
  fireEvent.click(screen.getByRole('button', {name: 'More 2'}));
  expect(screen.getByRole('button', {name: 'Hide Item 7'})).toBeTruthy();
});
