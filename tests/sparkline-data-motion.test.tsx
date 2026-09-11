import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {
  Sparkline,
  type SparklineProps,
  type SparklineActivation,
  type SparklineSelectionItem,
} from '../src/index.js';
import {chartMotionClock} from './chart-motion-clock.js';
const data = [
  {id: 'a', at: 0, value: 2},
  {id: 'b', at: 1, value: 5},
  {id: 'c', at: 2, value: 8},
  {id: 'd', at: 3, value: 6},
];
type Datum = (typeof data)[number];
const common: SparklineProps<Datum, number> = {
  data,
  title: 'Demand',
  description: 'Daily readings',
  dataTableLabel: 'Recorded values',
  emptyState: {title: 'Empty', description: 'No readings'},
  invalidData: {title: 'Invalid', description: 'Check values'},
  position: {accessor: 'at', label: 'Day', scale: {type: 'linear', domain: [0, 3]}},
  value: {accessor: 'value', label: 'Demand'},
  valueRange: [0, 10],
  labels: {first: 'First', last: 'Last', lowest: 'Lowest', highest: 'Highest', missing: 'Missing'},
};
const labels = {
  instructions: 'Select readings',
  clear: 'Clear',
  empty: 'None',
  summary: (n: number) => `${n} selected`,
  item: (item: SparklineSelectionItem) => item.rowId,
  hidden: (s: string) => s,
};
const updated = data.map((r, i) => ({...r, value: [6, 3, 9, 7][i]!}));
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function cue(container: HTMLElement, row: number, kind: string) {
  return container.querySelector<SVGGElement>(
    `[data-row-index="${row}"][data-wcl-sparkline-cue="${kind}"]`,
  );
}
function y(el: Element | null) {
  return Number(el?.querySelector('circle')?.getAttribute('cy'));
}
it('moves the line and retained extrema with source values available immediately', () => {
  const clock = chartMotionClock(),
    onActivate = vi.fn<(event: SparklineActivation<Datum, number>) => void>();
  const interaction = {
    getRowId: (d: Datum) => d.id,
    onActivate,
    selection: {labels, defaultSelectedItems: [{rowId: 'c'}]},
  };
  const {container, rerender} = render(<Sparkline {...common} interaction={interaction} />);
  const before = y(cue(container, 2, 'highest'));
  const path = container.querySelector('[data-wcl-sparkline-line]')!.getAttribute('d');
  rerender(<Sparkline {...common} data={updated} interaction={interaction} />);
  expect(y(cue(container, 2, 'highest'))).toBe(before);
  expect(screen.getByRole('table').textContent).toContain('9');
  clock.advance(120);
  const middle = y(cue(container, 2, 'highest'));
  expect(middle).toBeLessThan(before);
  expect(container.querySelector('[data-wcl-sparkline-line]')!.getAttribute('d')).not.toBe(path);
  const canvas = container.querySelector('[data-wcl-sparkline-canvas]')!;
  fireEvent.focus(canvas);
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'Enter', ctrlKey: true});
  expect(onActivate.mock.calls.at(-1)?.[0].value).toBe(6);
  clock.advance(240);
  expect(y(cue(container, 2, 'highest'))).toBeLessThan(middle);
  expect(screen.getByText('1 selected')).toBeTruthy();
});
it('crossfades extreme markers while both stay attached to their moving readings', () => {
  const clock = chartMotionClock();
  const {container, rerender} = render(<Sparkline {...common} />);
  const before = y(cue(container, 0, 'lowest'));
  rerender(<Sparkline {...common} data={updated} />);
  expect(cue(container, 0, 'lowest')).not.toBeNull();
  clock.advance(80);
  const old = cue(container, 0, 'lowest'),
    next = cue(container, 1, 'lowest');
  expect(old).not.toBeNull();
  expect(next).not.toBeNull();
  expect(Number(old!.getAttribute('opacity'))).toBeGreaterThan(0);
  expect(Number(old!.getAttribute('opacity'))).toBeLessThan(1);
  expect(Number(next!.getAttribute('opacity'))).toBeGreaterThan(0);
  expect(Number(next!.getAttribute('opacity'))).toBeLessThan(1);
  expect(y(old)).toBeLessThan(before);
  clock.advance(240);
  expect(cue(container, 0, 'lowest')).toBeNull();
  expect(Number(cue(container, 1, 'lowest')!.getAttribute('opacity') ?? 1)).toBe(1);
});
it('retargets marker handoffs and settles immediately when reduced motion is requested', () => {
  const clock = chartMotionClock();
  const {container, rerender, unmount} = render(<Sparkline {...common} />);
  rerender(<Sparkline {...common} data={updated} />);
  clock.advance(90);
  const middle = y(cue(container, 2, 'highest'));
  rerender(<Sparkline {...common} />);
  expect(y(cue(container, 2, 'highest'))).toBe(middle);
  clock.reduce();
  expect(y(cue(container, 2, 'highest'))).toBe(38);
  expect(cue(container, 1, 'lowest')).toBeNull();
  unmount();
  expect(clock.pending()).toBe(0);
});

it('fades both extreme roles when the highest and lowest readings exchange places', () => {
  const clock = chartMotionClock();
  const {container, rerender} = render(<Sparkline {...common} />);
  rerender(
    <Sparkline
      {...common}
      data={data.map((row, index) => ({...row, value: [8, 5, 2, 6][index]!}))}
    />,
  );
  clock.advance(80);
  for (const [row, kind] of [
    [0, 'lowest'],
    [0, 'highest'],
    [2, 'lowest'],
    [2, 'highest'],
  ] as const) {
    const weight = Number(cue(container, row, kind)?.getAttribute('opacity'));
    expect(weight).toBeGreaterThan(0);
    expect(weight).toBeLessThan(1);
  }
  clock.advance(240);
  expect(cue(container, 0, 'lowest')).toBeNull();
  expect(cue(container, 2, 'highest')).toBeNull();
});

it('retains full-range cues for equal readings and fades them when the range separates', () => {
  const clock = chartMotionClock();
  const {container, rerender} = render(
    <Sparkline {...common} data={data.map((row) => ({...row, value: 4}))} />,
  );
  expect(container.querySelectorAll('[data-wcl-sparkline-cue="range"]')).toHaveLength(3);
  rerender(<Sparkline {...common} />);
  clock.advance(80);
  expect(Number(cue(container, 1, 'range')?.getAttribute('opacity'))).toBeGreaterThan(0);
  clock.advance(240);
  expect(container.querySelectorAll('[data-wcl-sparkline-cue="range"]')).toHaveLength(0);
  expect(cue(container, 0, 'lowest')).not.toBeNull();
  expect(cue(container, 2, 'highest')).not.toBeNull();
});

it('settles changed positions immediately during an in-flight value update', () => {
  const clock = chartMotionClock();
  const {container, rerender} = render(<Sparkline {...common} />);
  rerender(<Sparkline {...common} data={updated} />);
  clock.advance(80);
  rerender(<Sparkline {...common} data={updated.map((row) => ({...row, at: row.at + 0.2}))} />);
  expect(y(cue(container, 2, 'highest'))).toBe(24);
  expect(cue(container, 0, 'lowest')).toBeNull();
});
