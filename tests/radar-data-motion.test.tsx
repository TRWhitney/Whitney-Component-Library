import {act, cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {RadarChart, type RadarSelectionItem} from '../src/index.js';
import {chartMotionClock} from './chart-motion-clock.js';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
type Profile = {id: string; label: string; speed: number | null; range: number; comfort: number};
const data: readonly [Profile, Profile] = [
  {id: 'a', label: 'Courier', speed: 8, range: 6, comfort: 4},
  {id: 'b', label: 'Scout', speed: 5, range: 8, comfort: 2},
];
const common = {
  data,
  dimensions: [
    {id: 'speed', label: 'Speed', accessor: 'speed'},
    {id: 'range', label: 'Range', accessor: 'range'},
    {id: 'comfort', label: 'Comfort', accessor: 'comfort'},
  ],
  idAccessor: 'id',
  labelAccessor: 'label',
  title: 'Profiles',
  description: 'Shared scores',
  value: {label: 'Score'},
  labels: {dimension: 'Quality'},
  legend: {label: 'Profiles'},
  dataTableLabel: 'Profile values',
  emptyState: {title: 'Empty', description: 'No data'},
  invalidData: {title: 'Invalid', description: 'Check data'},
} as const;
const selection = {
  defaultSelectedItems: [{dimensionId: 'speed', seriesId: 'a'}],
  labels: {
    instructions: 'Select a reading or open details.',
    clear: 'Clear',
    empty: 'None',
    summary: (count: number) => `${count} selected`,
    item: (item: RadarSelectionItem) => `${item.dimensionId} ${item.seriesId ?? 'all'}`,
    hidden: (label: string) => label,
  },
};
const pointY = (container: HTMLElement, id = 'a') =>
  Number(
    container.querySelector(`[data-series-id="${id}"] [data-wcl-radar-point]`)!.getAttribute('cy'),
  );
const svgOf = (container: HTMLElement) => {
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 480, 480));
  return svg;
};

it('moves retained radar values between supplied scores', () => {
  const clock = chartMotionClock();
  const {container, rerender} = render(<RadarChart<Profile> {...common} />);
  expect(pointY(container)).toBe(120);
  expect(clock.pending()).toBe(0);
  rerender(<RadarChart<Profile> {...common} data={[{...data[0], speed: 4}, data[1]]} />);
  expect(pointY(container)).toBe(120);
  clock.advance(120);
  expect(pointY(container)).toBe(172.5);
  clock.advance(240);
  expect(pointY(container)).toBe(180);
});

it('animates the automatic scale with values even without visibility controls', () => {
  const clock = chartMotionClock();
  const {container, rerender} = render(<RadarChart<Profile> {...common} />);
  rerender(<RadarChart<Profile> {...common} data={[{...data[0], speed: 16}, data[1]]} />);
  expect(pointY(container, 'b')).toBe(165);
  clock.advance(120);
  // The shared maximum is 18.75 and the Courier score is 15 at half time.
  expect(pointY(container)).toBe(120);
  expect(pointY(container, 'b')).toBe(200);
  clock.advance(240);
  expect(pointY(container, 'b')).toBe(202.5);
});

it('keeps source readings and callbacks current while selection and hit testing follow display values', () => {
  const clock = chartMotionClock();
  const onActivate = vi.fn();
  const interaction = {target: 'point' as const, selection, onActivate};
  const next: readonly [Profile, Profile] = [{...data[0], speed: 4}, data[1]];
  const {container, rerender} = render(
    <RadarChart<Profile> {...common} interaction={interaction} />,
  );
  const canvas = container.querySelector('[data-wcl-radar-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'Home'});
  rerender(<RadarChart<Profile> {...common} data={next} interaction={interaction} />);
  expect(within(screen.getByRole('table')).getAllByText('4')).toHaveLength(2);
  expect(screen.getByRole('tooltip').textContent).toContain('Courier4');
  expect(container.querySelector('[data-wcl-chart-reading-announcement]')!.textContent).toContain(
    'Courier: 4',
  );
  clock.advance(60);
  const y = pointY(container);
  expect(
    Number(container.querySelector('[data-wcl-chart-selected-point]')!.getAttribute('cy')),
  ).toBe(y);
  expect(
    Number(container.querySelector('[data-wcl-radar-reading-point]')!.getAttribute('cy')),
  ).toBe(y);
  const svg = svgOf(container);
  const event = {
    clientX: 240,
    clientY: y,
    pointerId: 1,
    pointerType: 'mouse',
    button: 0,
    isPrimary: true,
    ctrlKey: true,
  };
  fireEvent.pointerDown(svg, event);
  fireEvent.pointerUp(svg, event);
  expect(onActivate).toHaveBeenLastCalledWith(
    expect.objectContaining({
      values: [{seriesId: 'a', label: 'Courier', value: 4, datum: next[0]}],
    }),
  );
  expect(screen.getByText('1 selected')).toBeTruthy();
});

it('retargets both values and scale from the display and settles a reduced-motion change', () => {
  const clock = chartMotionClock();
  const {container, rerender, unmount} = render(<RadarChart<Profile> {...common} />);
  rerender(<RadarChart<Profile> {...common} data={[{...data[0], speed: 40}, data[1]]} />);
  clock.advance(80);
  const interrupted = pointY(container, 'b');
  rerender(<RadarChart<Profile> {...common} data={[{...data[0], speed: 3}, data[1]]} />);
  expect(pointY(container, 'b')).toBe(interrupted);
  clock.advance(160);
  expect(pointY(container, 'b')).toBeLessThan(interrupted);
  clock.reduce();
  expect(pointY(container)).toBe(195);
  expect(pointY(container, 'b')).toBe(165);
  expect(clock.pending()).toBe(0);
  rerender(<RadarChart<Profile> {...common} data={[{...data[0], speed: 4}, data[1]]} />);
  expect(pointY(container)).toBe(180);
  unmount();
  expect(clock.pending()).toBe(0);
});

it.each(['dimensions', 'profiles', 'missing', 'configuration', 'invalid'] as const)(
  'settles %s changes without animating stale topology',
  (change) => {
    const clock = chartMotionClock();
    const {container, rerender} = render(<RadarChart<Profile> {...common} />);
    rerender(<RadarChart<Profile> {...common} data={[{...data[0], speed: 40}, data[1]]} />);
    clock.advance(60);
    const changed: readonly [Profile, Profile] = [
      {...data[0], speed: change === 'missing' ? null : change === 'invalid' ? -1 : 4},
      data[1],
    ];
    rerender(
      <RadarChart<Profile>
        {...common}
        data={change === 'profiles' ? [changed[0]] : changed}
        dimensions={
          change === 'dimensions'
            ? [common.dimensions[2], common.dimensions[1], common.dimensions[0]]
            : common.dimensions
        }
        {...(change === 'configuration' ? {aspectRatio: 2} : {})}
      />,
    );
    expect(clock.pending()).toBe(0);
    if (change === 'invalid') expect(container.querySelector('[data-series-id="a"]')).toBeNull();
    else if (change === 'missing')
      expect(
        container.querySelector('[data-series-id="a"]')!.querySelectorAll('[data-wcl-radar-point]'),
      ).toHaveLength(2);
    else expect(pointY(container)).toBe(180);
  },
);

it('keeps a touch hold alive through numeric and scale animation frames', () => {
  vi.useFakeTimers();
  const clock = chartMotionClock();
  const onActivate = vi.fn();
  const interaction = {target: 'point' as const, selection, onActivate};
  const {container, rerender} = render(
    <RadarChart<Profile> {...common} interaction={interaction} />,
  );
  const next: readonly [Profile, Profile] = [{...data[0], speed: 16}, data[1]];
  rerender(<RadarChart<Profile> {...common} data={next} interaction={interaction} />);
  const svg = svgOf(container);
  fireEvent.pointerDown(svg, {
    clientX: 240,
    clientY: 120,
    pointerId: 1,
    pointerType: 'touch',
    button: 0,
    isPrimary: true,
  });
  clock.advance(120);
  clock.advance(240);
  act(() => {
    vi.advanceTimersByTime(520);
  });
  expect(onActivate).toHaveBeenCalledTimes(1);
  expect(onActivate).toHaveBeenLastCalledWith(
    expect.objectContaining({
      input: 'touch',
      values: [{seriesId: 'a', label: 'Courier', value: 16, datum: next[0]}],
    }),
  );
});

it('keeps a selection rectangle alive as its contained score and scale move', () => {
  const clock = chartMotionClock();
  const onSelectionChange = vi.fn();
  const interaction = {
    target: 'point' as const,
    selection: {...selection, defaultSelectedItems: [], onSelectionChange},
  };
  const {container, rerender} = render(
    <RadarChart<Profile> {...common} interaction={interaction} />,
  );
  rerender(
    <RadarChart<Profile>
      {...common}
      data={[{...data[0], speed: 16}, data[1]]}
      interaction={interaction}
    />,
  );
  const svg = svgOf(container);
  fireEvent.pointerDown(svg, {
    clientX: 210,
    clientY: 100,
    pointerId: 1,
    pointerType: 'mouse',
    button: 0,
    isPrimary: true,
  });
  const end = {clientX: 270, clientY: 140, pointerId: 1, pointerType: 'mouse'};
  fireEvent.pointerMove(svg, end);
  clock.advance(120);
  expect(container.querySelector('[data-wcl-chart-selection-box]')).toBeTruthy();
  clock.advance(240);
  fireEvent.pointerMove(svg, end);
  fireEvent.pointerUp(svg, end);
  expect(onSelectionChange).toHaveBeenLastCalledWith([{dimensionId: 'speed', seriesId: 'a'}]);
});
