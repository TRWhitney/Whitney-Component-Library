import {act, cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {RadarChart, type RadarSelectionItem} from '../src/index.js';
type Profile = {id: string; label: string; speed: number; range: number; comfort: number};
const data: readonly [Profile, Profile] = [
  {id: 'a', label: 'Courier', speed: 8, range: 6, comfort: 4},
  {id: 'b', label: 'Scout', speed: 5, range: 8, comfort: 0},
] as const;
const dimensions = [
  {id: 'speed', label: 'Speed', accessor: 'speed'},
  {id: 'range', label: 'Range', accessor: 'range'},
  {id: 'comfort', label: 'Comfort', accessor: 'comfort'},
] as const;
const visibilityLabels = {
  hidden: 'Hidden',
  hideSeries: (s: string) => `Hide ${s}`,
  showSeries: (s: string) => `Show ${s}`,
  showAll: 'Show all',
  allHidden: {title: 'All hidden', description: 'Restore a profile.'},
};
const common = {
  visibilityLabels,
  data,
  dimensions,
  idAccessor: 'id',
  labelAccessor: 'label',
  title: 'Profiles',
  description: 'Shared scores',
  value: {label: 'Score', unit: 'points'},
  labels: {dimension: 'Quality'},
  legend: {label: 'Profiles'},
  dataTableLabel: 'Profile values',
  emptyState: {title: 'Empty', description: 'No data'},
  invalidData: {title: 'Invalid', description: 'Check data'},
} as const;
const labels = {
  instructions: 'Click selects; hold opens.',
  clear: 'Clear',
  empty: 'None',
  summary: (n: number) => `${n} selected`,
  item: (p: RadarSelectionItem) => `${p.dimensionId} ${p.seriesId ?? 'all'}`,
  hidden: (s: string) => `${s} hidden`,
};
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
const hide = (name: string) => fireEvent.click(screen.getByRole('button', {name: `Hide ${name}`}));
it('hides profiles separately from pinning and retains full table, color and pattern', () => {
  const {container} = render(<RadarChart {...common} />);
  const legend = screen.getByRole('list', {name: 'Profiles'});
  const scout = container.querySelector('[data-series-id="b"]')!;
  const color = scout.getAttribute('data-color'),
    pattern = scout.getAttribute('data-pattern-index');
  fireEvent.click(within(legend).getByRole('button', {name: 'Courier'}));
  hide('Courier');
  expect(container.querySelector('[data-series-id="a"]')).toBeNull();
  expect(within(legend).getByRole('button', {name: 'Courier'}).getAttribute('aria-pressed')).toBe(
    'false',
  );
  expect(within(legend).getByRole('button', {name: 'Courier'}).getAttribute('aria-disabled')).toBe(
    'true',
  );
  expect(screen.getByRole('columnheader', {name: 'Courier (Hidden)'})).toBeTruthy();
  expect(container.querySelector('[data-series-id="b"]')!.getAttribute('data-color')).toBe(color);
  expect(container.querySelector('[data-series-id="b"]')!.getAttribute('data-pattern-index')).toBe(
    pattern,
  );
  fireEvent.click(screen.getByRole('button', {name: 'Show Courier'}));
  expect(container.querySelector('[data-series-id="a"]')).toBeTruthy();
});
it('retains hidden point selection and recovers all profiles with focus on the first eye', () => {
  const onSelectionChange = vi.fn();
  const {container} = render(
    <RadarChart
      {...common}
      interaction={{
        target: 'point',
        selection: {
          labels,
          defaultSelectedItems: [{dimensionId: 'speed', seriesId: 'a'}],
          onSelectionChange,
        },
      }}
    />,
  );
  hide('Courier');
  expect(screen.getByText('speed a hidden')).toBeTruthy();
  hide('Scout');
  expect(container.querySelector('[data-wcl-radar-series]')).toBeNull();
  expect(screen.getByRole('table')).toBeTruthy();
  expect(screen.getByText('All hidden')).toBeTruthy();
  expect(onSelectionChange).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', {name: 'Show all'}));
  expect(document.activeElement).toBe(screen.getByRole('button', {name: 'Hide Courier'}));
  expect(container.querySelectorAll('[data-wcl-radar-series]')).toHaveLength(2);
});
it('limits keyboard readings and dimension activation to visible profiles', () => {
  const onActivate = vi.fn();
  const {container} = render(
    <RadarChart {...common} interaction={{target: 'dimension', onActivate}} />,
  );
  hide('Courier');
  const canvas = container.querySelector('[data-wcl-radar-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(onActivate).toHaveBeenLastCalledWith(
    expect.objectContaining({
      item: {dimensionId: 'speed'},
      values: [{seriesId: 'b', label: 'Scout', value: 5, datum: data[1]}],
    }),
  );
  expect(
    container.querySelector('[data-wcl-chart-reading-announcement]')!.textContent,
  ).not.toContain('Courier');
});
it('drops hidden state for removed IDs while retaining it across value updates', () => {
  const {container, rerender} = render(<RadarChart {...common} />);
  hide('Courier');
  rerender(<RadarChart {...common} data={[{...data[0], speed: 3}, data[1]]} />);
  expect(container.querySelector('[data-series-id="a"]')).toBeNull();
  rerender(<RadarChart {...common} data={[data[1]]} />);
  rerender(<RadarChart {...common} />);
  expect(container.querySelector('[data-series-id="a"]')).toBeTruthy();
});

it('animates one shared scale, interrupts restoration and keeps marks inside the radar', () => {
  let next = 0;
  const frames = new Map<number, FrameRequestCallback>();
  vi.spyOn(performance, 'now').mockReturnValue(0);
  vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => {
    frames.set(++next, fn);
    return next;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
  const step = (time: number) =>
    act(() => {
      const batch = [...frames.values()];
      frames.clear();
      batch.forEach((fn) => fn(time));
    });
  const {container} = render(<RadarChart {...common} data={[data[0], {...data[1], speed: 100}]} />);
  const position = () =>
    Number(container.querySelector('[data-series-id="a"] circle')!.getAttribute('cy'));
  const original = position();
  hide('Scout');
  expect(position()).toBe(original);
  step(120);
  expect(position()).toBeLessThan(original);
  expect(position()).toBeGreaterThan(120);
  step(240);
  expect(position()).toBe(120);
  fireEvent.click(screen.getByRole('button', {name: 'Show Scout'}));
  expect(Number(container.querySelector('[data-series-id="b"] circle')!.getAttribute('cy'))).toBe(
    90,
  );
  step(120);
  const duringRestore = position();
  hide('Scout');
  expect(position()).toBe(duringRestore);
  step(240);
  expect(position()).toBe(120);
  expect(within(screen.getByRole('table')).getByText('100 points')).toBeTruthy();
});

it('settles reduced-motion scales immediately and keeps invalid input feedback when all hidden', () => {
  vi.stubGlobal('matchMedia', () => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  const {container} = render(
    <RadarChart
      {...common}
      data={[
        data[0],
        {...data[1], speed: 100},
        {id: 'bad', label: 'Bad', speed: -1, range: 0, comfort: 0},
      ]}
    />,
  );
  hide('Scout');
  expect(Number(container.querySelector('[data-series-id="a"] circle')!.getAttribute('cy'))).toBe(
    120,
  );
  hide('Courier');
  expect(screen.getByText('Invalid')).toBeTruthy();
  expect(screen.getByText('All hidden')).toBeTruthy();
});

it('cancels a pending touch activation on hide and prunes selection only when the record is removed', () => {
  vi.useFakeTimers();
  const onActivate = vi.fn(),
    onSelectionChange = vi.fn();
  const interaction = {
    target: 'point' as const,
    onActivate,
    selection: {
      labels,
      onSelectionChange,
      defaultSelectedItems: [{dimensionId: 'speed', seriesId: 'a'}],
    },
  };
  const {container, rerender} = render(<RadarChart {...common} interaction={interaction} />);
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 480, 480));
  fireEvent.pointerDown(svg, {
    clientX: 240,
    clientY: 120,
    pointerId: 1,
    pointerType: 'touch',
    isPrimary: true,
    button: 0,
  });
  hide('Courier');
  act(() => {
    vi.advanceTimersByTime(700);
  });
  fireEvent.pointerUp(svg, {clientX: 240, clientY: 120, pointerId: 1, pointerType: 'touch'});
  expect(onActivate).not.toHaveBeenCalled();
  expect(onSelectionChange).not.toHaveBeenCalled();
  rerender(<RadarChart {...common} data={[data[1]]} interaction={interaction} />);
  expect(screen.queryByText('speed a hidden')).toBeNull();
  expect(container.querySelectorAll('[data-wcl-chart-selection] li')).toHaveLength(0);
  vi.useRealTimers();
});

it('keeps zero values reachable in a visible profile and cancels drag on hiding', () => {
  const onSelectionChange = vi.fn(),
    onActivate = vi.fn();
  const {container} = render(
    <RadarChart
      {...common}
      interaction={{target: 'point', selection: {labels, onSelectionChange}, onActivate}}
    />,
  );
  hide('Courier');
  const canvas = container.querySelector('[data-wcl-radar-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'End'});
  fireEvent.keyDown(canvas, {key: 'ArrowDown'});
  fireEvent.keyDown(canvas, {key: 'Enter', ctrlKey: true});
  expect(onActivate).toHaveBeenLastCalledWith(
    expect.objectContaining({
      item: {dimensionId: 'comfort', seriesId: 'b'},
      values: [expect.objectContaining({seriesId: 'b', value: 0})],
    }),
  );
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 480, 480));
  fireEvent.pointerDown(svg, {
    clientX: 100,
    clientY: 100,
    pointerId: 1,
    pointerType: 'mouse',
    isPrimary: true,
    button: 0,
  });
  fireEvent.pointerMove(svg, {clientX: 330, clientY: 330, pointerId: 1, pointerType: 'mouse'});
  expect(container.querySelector('[data-wcl-chart-selection-box]')).toBeTruthy();
  hide('Scout');
  expect(container.querySelector('[data-wcl-chart-selection-box]')).toBeNull();
  fireEvent.pointerUp(svg, {clientX: 330, clientY: 330, pointerId: 1, pointerType: 'mouse'});
  expect(onSelectionChange).not.toHaveBeenCalled();
});
