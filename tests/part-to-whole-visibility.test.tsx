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
it.each(['pie', 'donut'])('fills freed %s slots and returns overflow on restoration', (kind) => {
  const many = Array.from({length: 11}, (_, i) => ({
    id: `i${i}`,
    label: `Item ${i}`,
    value: 11 - i,
  }));
  const onActivate = vi.fn();
  const props = {
    ...common,
    data: many,
    interaction: {
      onActivate,
      selection: {
        labels,
        containsSelection: 'Contains selection',
        defaultSelectedItems: [{id: 'i7'}],
      },
    },
  };
  const {container} = render(
    kind === 'pie' ? <PieChart {...props} /> : <DonutChart {...props} totalLabel="Visible total" />,
  );
  fireEvent.click(screen.getByRole('button', {name: /More 4/}));
  const color = slice(container, 'i7')!.getAttribute('data-color');
  const pattern = slice(container, 'i7')!.getAttribute('data-pattern-index');
  fireEvent.click(screen.getByRole('button', {name: 'Back'}));
  hide('Item 0');
  expect(screen.getByRole('button', {name: 'Show Item 0'})).toBeTruthy();
  expect(slice(container, 'i7')).toBeTruthy();
  expect(slice(container, 'i7')!.getAttribute('data-color')).toBe(color);
  expect(slice(container, 'i7')!.getAttribute('data-pattern-index')).toBe(pattern);
  expect(screen.getByRole('button', {name: 'More 3'})).toBeTruthy();
  expect(container.querySelector('[data-wcl-radial-aggregate-label]')!.textContent).toBe('+3');
  expect(onActivate).not.toHaveBeenCalled();
  const canvas = container.querySelector('[data-wcl-part-to-whole-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'Home'});
  for (let index = 0; index < 6; index++) fireEvent.keyDown(canvas, {key: 'ArrowRight'});
  fireEvent.keyDown(canvas, {key: 'Enter', ctrlKey: true});
  expect(onActivate).toHaveBeenCalledWith(
    expect.objectContaining({
      item: {id: 'i7'},
      value: 4,
      total: 55,
      shareOfTotal: 4 / 55,
      shareOnPage: 4 / 49,
    }),
  );
  expect(screen.queryByRole('button', {name: 'Hide More 3'})).toBeNull();
  fireEvent.click(screen.getByRole('button', {name: 'Show Item 0'}));
  expect(slice(container, 'i7')).toBeNull();
  expect(screen.getByRole('button', {name: /More 4/})).toBeTruthy();
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
  const many = Array.from({length: 11}, (_, i) => ({
    id: `i${i}`,
    label: `Item ${i}`,
    value: 11 - i,
  }));
  const interaction = {
    selection: {
      labels,
      containsSelection: 'Contains selection',
      defaultSelectedItems: [{id: 'i10'}],
    },
  };
  const {container, rerender} = render(
    <PieChart {...common} data={many} interaction={interaction} />,
  );
  fireEvent.click(
    within(container.querySelector<HTMLElement>('[data-wcl-radial-legend]')!).getByRole('button', {
      name: /More 4/,
    }),
  );
  hide('Item 10');
  fireEvent.click(screen.getByRole('button', {name: 'Back'}));
  expect(container.querySelector('[data-wcl-radial-aggregate-label]')!.textContent).toBe('+4*');
  expect(screen.getByText('i10 hidden')).toBeTruthy();
  rerender(<PieChart {...common} data={many.slice(0, 10)} interaction={interaction} />);
  expect(screen.queryByText('i10 hidden')).toBeNull();
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

it.each(['proportional', 'smallest'] as const)(
  'uses the last expansion slot when remaining categories fit with %s sizing',
  async (aggregateSizing) => {
    const records = Array.from({length: 9}, (_, i) => ({
      id: `i${i}`,
      label: `Item ${i}`,
      value: 10 - i,
    }));
    const {container} = render(
      <PieChart {...common} data={records} aggregateSizing={aggregateSizing} />,
    );
    hide('Item 0');
    expect(container.querySelector('[data-aggregate][data-wcl-radial-segment]')).toBeNull();
    expect(container.querySelectorAll('[data-wcl-radial-segment]')).toHaveLength(8);
    for (let i = 1; i < 9; i++) hide(`Item ${i}`);
    expect(screen.getByText('No visible slices')).toBeTruthy();
    expect(screen.getAllByRole('button', {name: /^Show Item/})).toHaveLength(9);
    fireEvent.click(screen.getByRole('button', {name: 'Show Item 8'}));
    await waitFor(() =>
      expect(Number(slice(container, 'i8')!.getAttribute('data-angle-size'))).toBeCloseTo(
        Math.PI * 2,
        5,
      ),
    );
  },
);

it('settles a collapsed later page and keeps restored categories reachable', async () => {
  const records = Array.from({length: 9}, (_, i) => ({
    id: `i${i}`,
    label: `Item ${i}`,
    value: 10 - i,
  }));
  const {container} = render(<PieChart {...common} data={records} />);
  fireEvent.click(screen.getByRole('button', {name: 'More 2'}));
  hide('Item 8');
  expect(screen.queryByRole('button', {name: 'Back'})).toBeNull();
  expect(slice(container, 'i0')).toBeTruthy();
  screen.getByRole('button', {name: 'Show Item 8'}).focus();
  fireEvent.click(screen.getByRole('button', {name: 'Show Item 8'}));
  await waitFor(() =>
    expect(document.activeElement).toBe(screen.getByRole('button', {name: 'Hide Item 0'})),
  );
  expect(slice(container, 'i0')).toBeTruthy();
  expect(screen.getByRole('button', {name: 'More 2'})).toBeTruthy();
});

it('keeps the expansion label positioned when restoration animates it back in', () => {
  vi.stubGlobal('requestAnimationFrame', () => 1);
  vi.stubGlobal('cancelAnimationFrame', () => {});
  const records = Array.from({length: 9}, (_, i) => ({
    id: `i${i}`,
    label: `Item ${i}`,
    value: 10 - i,
  }));
  const {container} = render(<PieChart {...common} data={records} />);
  hide('Item 0');
  fireEvent.click(screen.getByRole('button', {name: 'Show Item 0'}));
  const count = container.querySelector('[data-wcl-radial-aggregate-label]')!;
  expect(Number.isFinite(Number(count.getAttribute('x')))).toBe(true);
  expect(Number.isFinite(Number(count.getAttribute('y')))).toBe(true);
});

it('keeps promoted categories distinguishable when their original pages reuse a color', () => {
  const records = Array.from({length: 11}, (_, i) => ({
    id: `i${i}`,
    label: `Item ${i}`,
    value: 12 - i,
  }));
  const {container} = render(<PieChart {...common} data={records} />);
  hide('Item 1');
  expect(slice(container, 'i0')!.getAttribute('data-color')).toBe(
    slice(container, 'i7')!.getAttribute('data-color'),
  );
  const dash = (id: string) =>
    slice(container, id)!
      .querySelector('[data-wcl-radial-slice]')!
      .getAttribute('stroke-dasharray');
  expect(dash('i0')).not.toBe(dash('i7'));
  const promotedPattern = dash('i7');
  fireEvent.click(screen.getByRole('button', {name: 'Show Item 1'}));
  fireEvent.click(screen.getByRole('button', {name: 'More 4'}));
  expect(dash('i7')).toBe(promotedPattern);
});

it('resets to the first page when replacement data also removes the current page', () => {
  const records = Array.from({length: 24}, (_, i) => ({
    id: `i${i}`,
    label: `Item ${i}`,
    value: 25 - i,
  }));
  const {container, rerender} = render(<PieChart {...common} data={records} />);
  for (const count of [17, 9, 1])
    fireEvent.click(screen.getByRole('button', {name: `More ${count}`}));
  expect(slice(container, 'i23')).toBeTruthy();
  rerender(<PieChart {...common} data={records.slice(0, 16)} />);
  expect(slice(container, 'i0')).toBeTruthy();
  expect(screen.queryByRole('button', {name: 'Back'})).toBeNull();
});

it.each(['pie', 'donut'])('marks hidden expansion members in %s even without selection', (kind) => {
  const records = Array.from({length: 11}, (_, i) => ({
    id: `i${i}`,
    label: `Item ${i}`,
    value: 12 - i,
  }));
  const props = {...common, data: records};
  const {container} = render(
    kind === 'pie' ? <PieChart {...props} /> : <DonutChart {...props} totalLabel="Visible total" />,
  );
  const marker = () => container.querySelector('[data-wcl-radial-aggregate-label]')!.textContent;
  fireEvent.click(screen.getByRole('button', {name: 'More 4'}));
  hide('Item 10');
  fireEvent.click(screen.getByRole('button', {name: 'Back'}));
  expect(marker()).toBe('+4*');
  const expansion = screen.getByRole('button', {name: /More 4.*Item 10.*Hidden/});
  const canvas = container.querySelector('[data-wcl-part-to-whole-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'End'});
  expect(container.querySelector('[data-wcl-chart-reading-announcement]')!.textContent).toContain(
    'Item 10 (Hidden)',
  );
  fireEvent.click(expansion);
  fireEvent.click(screen.getByRole('button', {name: 'Show Item 10'}));
  fireEvent.click(screen.getByRole('button', {name: 'Back'}));
  expect(marker()).toBe('+4');
  hide('Item 0');
  expect(marker()).toBe('+3');
});

it('uses one marker when expansion contains both hidden and selected categories', () => {
  const records = Array.from({length: 11}, (_, i) => ({
    id: `i${i}`,
    label: `Item ${i}`,
    value: 12 - i,
  }));
  const {container} = render(
    <PieChart
      {...common}
      data={records}
      interaction={{
        selection: {
          labels,
          containsSelection: 'Contains selection',
          defaultSelectedItems: [{id: 'i9'}],
        },
      }}
    />,
  );
  fireEvent.click(screen.getByRole('button', {name: /More 4/}));
  hide('Item 10');
  fireEvent.click(screen.getByRole('button', {name: 'Back'}));
  expect(container.querySelector('[data-wcl-radial-aggregate-label]')!.textContent).toBe('+4*');
  fireEvent.click(
    screen.getByRole('button', {name: /More 4.*Contains selection.*Item 10.*Hidden/}),
  );
  fireEvent.click(screen.getByRole('button', {name: 'Show Item 10'}));
  fireEvent.click(screen.getByRole('button', {name: 'Back'}));
  expect(container.querySelector('[data-wcl-radial-aggregate-label]')!.textContent).toBe('+4*');
});
