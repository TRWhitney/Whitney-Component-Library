import {act, cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {DonutChart} from '../src/index.js';
import {chartMotionClock} from './chart-motion-clock.js';
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
const data = [
  {id: 'a', label: 'A', value: 50},
  {id: 'b', label: 'B', value: 30},
  {id: 'c', label: 'C', value: 20},
];
const props = {
  data,
  idAccessor: 'id',
  labelAccessor: 'label',
  value: {accessor: 'value', label: 'Value'},
  title: 'Shares',
  description: 'Supplied categories',
  dataTableLabel: 'All categories',
  totalLabel: 'Total',
  legend: {label: 'Categories'},
  emptyState: {title: 'Empty', description: 'Add categories'},
  invalidData: {title: 'Invalid', description: 'Check values'},
  labels: {
    back: 'Back',
    category: 'Category',
    categoryRange: ({start, end, total}: {start: number; end: number; total: number}) =>
      `${start} to ${end} of ${total}`,
    moreCategories: (n: number) => `More ${n}`,
    shareOfTotal: 'Share of total',
    shareOnPage: 'Share on page',
  },
} as const;
it('changes slice shares through intermediate angles while reporting the new source total', () => {
  const clock = chartMotionClock();
  const {container, rerender} = render(<DonutChart {...props} />);
  const angle = () =>
    Number(container.querySelector('[data-segment-id="a"]')!.getAttribute('data-angle-size'));
  const initial = angle();
  rerender(<DonutChart {...props} data={[{id: 'a', label: 'A', value: 90}, ...data.slice(1)]} />);
  expect(angle()).toBeCloseTo(initial);
  expect(within(screen.getByRole('table')).getByText('90')).toBeTruthy();
  clock.advance(120);
  const middle = angle();
  expect(middle).toBeGreaterThan(initial);
  clock.advance(240);
  expect(angle()).toBeGreaterThan(middle);
});

it('crossfades a changed rank without sweeping slices and retains colors by identity', () => {
  const clock = chartMotionClock();
  const {container, rerender} = render(<DonutChart {...props} />);
  const original = container.querySelector('[data-segment-id="a"]')!;
  const color = original.getAttribute('data-color');
  const path = original.querySelector('path')!.getAttribute('d');
  rerender(<DonutChart {...props} data={[{id: 'a', label: 'A', value: 10}, ...data.slice(1)]} />);
  const current = () => container.querySelector('[data-segment-id="a"]')!;
  expect(current().getAttribute('data-color')).toBe(color);
  expect(container.querySelector('[data-wcl-radial-departure] path')!.getAttribute('d')).toBe(path);
  expect(Number(current().parentElement!.getAttribute('opacity'))).toBe(0);
  const destination = current().querySelector('path')!.getAttribute('d');
  clock.advance(120);
  expect(Number(current().parentElement!.getAttribute('opacity'))).toBeGreaterThan(0);
  expect(Number(current().parentElement!.getAttribute('opacity'))).toBeLessThan(1);
  expect(current().querySelector('path')!.getAttribute('d')).toBe(destination);
  clock.advance(240);
  expect(container.querySelector('[data-wcl-radial-departure]')).toBeNull();
});
it('fades membership changes and removes departures from interaction and the data table', () => {
  const clock = chartMotionClock();
  const onActivate = vi.fn();
  const {container, rerender} = render(<DonutChart {...props} interaction={{onActivate}} />);
  rerender(
    <DonutChart
      {...props}
      data={[...data.slice(0, 2), {id: 'd', label: 'D', value: 10}]}
      interaction={{onActivate}}
    />,
  );
  const departure = container.querySelector('[data-wcl-radial-departure]')!;
  expect(departure).not.toBeNull();
  expect(departure.getAttribute('pointer-events')).toBe('none');
  expect(departure.hasAttribute('data-segment-index')).toBe(false);
  expect(within(screen.getByRole('table')).queryByText('C')).toBeNull();
  expect(
    Number(
      container.querySelector('[data-segment-id="d"]')!.parentElement!.getAttribute('opacity'),
    ),
  ).toBe(0);
  clock.advance(240);
  expect(container.querySelector('[data-wcl-radial-departure]')).toBeNull();
});
it('retargets in-flight changes from current angles and settles reduced motion immediately', () => {
  const clock = chartMotionClock();
  const {container, rerender} = render(<DonutChart {...props} />);
  const angle = () =>
    Number(container.querySelector('[data-segment-id="a"]')!.getAttribute('data-angle-size'));
  rerender(<DonutChart {...props} data={[{...data[0]!, value: 90}, ...data.slice(1)]} />);
  clock.advance(100);
  const middle = angle();
  rerender(<DonutChart {...props} data={[{...data[0]!, value: 60}, ...data.slice(1)]} />);
  expect(angle()).toBe(middle);
  clock.reduce();
  expect(angle()).toBeCloseTo((2 * Math.PI * 60) / 110, 5);
  expect(container.querySelector('[data-wcl-radial-departure]')).toBeNull();
  expect(clock.pending()).toBe(0);
});
it('keeps selection cues on moving slices and callbacks use the actual new reading', () => {
  const clock = chartMotionClock();
  const onActivate = vi.fn();
  const selection = {
    defaultSelectedItems: [{id: 'a'}],
    containsSelection: 'Contains selection',
    labels: {
      instructions: 'Select',
      clear: 'Clear',
      empty: 'None',
      summary: (n: number) => `${n} selected`,
      item: (item: {id: string}) => item.id,
      hidden: (label: string) => label,
    },
  };
  const {container, rerender} = render(
    <DonutChart {...props} interaction={{selection, onActivate}} />,
  );
  rerender(
    <DonutChart
      {...props}
      data={[{...data[0]!, value: 90}, ...data.slice(1)]}
      interaction={{selection, onActivate}}
    />,
  );
  const cue = () => container.querySelector('[data-wcl-radial-cue="selection"]')!.getAttribute('d');
  const initial = cue();
  clock.advance(120);
  expect(cue()).not.toBe(initial);
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'Enter', ctrlKey: true});
  expect(onActivate).toHaveBeenLastCalledWith(
    expect.objectContaining({value: 90, total: 140, datum: {id: 'a', label: 'A', value: 90}}),
  );
});

it('hits the displayed boundary during motion while returning the current supplied value', () => {
  const clock = chartMotionClock();
  const onActivate = vi.fn();
  const {container, rerender} = render(<DonutChart {...props} interaction={{onActivate}} />);
  rerender(
    <DonutChart
      {...props}
      data={[{...data[0]!, value: 90}, ...data.slice(1)]}
      interaction={{onActivate}}
    />,
  );
  clock.advance(120);
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  Object.defineProperty(svg, 'getBoundingClientRect', {
    value: () => ({left: 0, top: 0, width: 340, height: 340}),
  });
  const displayedEnd =
    -Math.PI / 2 +
    Number(container.querySelector('[data-segment-id="a"]')!.getAttribute('data-angle-size'));
  const actualEnd = -Math.PI / 2 + (Math.PI * 2 * 90) / 140;
  const angle = (displayedEnd + actualEnd) / 2;
  const pointer = {
    pointerId: 1,
    pointerType: 'mouse',
    button: 0,
    isPrimary: true,
    ctrlKey: true,
    clientX: 170 + Math.sin(angle) * 108,
    clientY: 170 - Math.cos(angle) * 108,
  };
  fireEvent.pointerMove(svg, pointer);
  fireEvent.keyDown(container.querySelector('[data-wcl-chart-canvas]')!, {
    key: 'Enter',
    ctrlKey: true,
  });
  expect(onActivate).toHaveBeenLastCalledWith(
    expect.objectContaining({item: {id: 'b'}, value: 30, total: 140}),
  );
});

it('allows a press-and-hold across animation frames but cancels it on another source update', () => {
  vi.useFakeTimers();
  const clock = chartMotionClock();
  const onActivate = vi.fn();
  const selection = {
    containsSelection: 'Contains selection',
    labels: {
      instructions: 'Select',
      clear: 'Clear',
      empty: 'None',
      summary: (n: number) => `${n} selected`,
      item: (item: {id: string}) => item.id,
      hidden: (label: string) => label,
    },
  };
  const updated = [{...data[0]!, value: 90}, ...data.slice(1)];
  const {container, rerender} = render(
    <DonutChart {...props} interaction={{onActivate, selection}} />,
  );
  rerender(<DonutChart {...props} data={updated} interaction={{onActivate, selection}} />);
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  Object.defineProperty(svg, 'getBoundingClientRect', {
    value: () => ({left: 0, top: 0, width: 340, height: 340}),
  });
  const pointer = {
    pointerId: 1,
    pointerType: 'touch',
    button: 0,
    isPrimary: true,
    clientX: 170,
    clientY: 62,
  };
  fireEvent.pointerDown(svg, pointer);
  clock.advance(120);
  act(() => {
    vi.advanceTimersByTime(550);
  });
  expect(onActivate).toHaveBeenCalledTimes(1);
  fireEvent.pointerUp(svg, pointer);
  fireEvent.pointerDown(svg, pointer);
  rerender(
    <DonutChart
      {...props}
      data={[{...data[0]!, value: 95}, ...data.slice(1)]}
      interaction={{onActivate, selection}}
    />,
  );
  act(() => {
    vi.advanceTimersByTime(550);
  });
  expect(onActivate).toHaveBeenCalledTimes(1);
});
