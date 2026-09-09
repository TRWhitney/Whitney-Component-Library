import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {RadarChart, type RadarSelectionItem, type RadarActivation} from '../src/index.js';
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
const common = {
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
  hidden: (s: string) => s,
};
function svgOf(container: HTMLElement) {
  const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
  Object.defineProperty(svg, 'getBoundingClientRect', {
    configurable: true,
    value: () => new DOMRect(0, 0, 480, 480),
  });
  return svg;
}
function at(series = 0, dimension = 0) {
  const a = (dimension * 2 * Math.PI) / 3 - Math.PI / 2,
    r = (data[series]![dimensions[dimension]!.accessor] / 10) * 150;
  return {clientX: 240 + Math.cos(a) * r, clientY: 240 + Math.sin(a) * r};
}
function down(svg: SVGSVGElement, p: {clientX: number; clientY: number}, extra = {}) {
  fireEvent.pointerDown(svg, {
    ...p,
    pointerId: 1,
    pointerType: 'mouse',
    button: 0,
    isPrimary: true,
    ...extra,
  });
}
function click(svg: SVGSVGElement, p: {clientX: number; clientY: number}, extra = {}) {
  down(svg, p, extra);
  fireEvent.pointerUp(svg, {...p, pointerId: 1, pointerType: 'mouse', ...extra});
}
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
it('selects one radar value and activates its original record independently', () => {
  const onActivate = vi.fn<(event: RadarActivation<Profile>) => void>(),
    onSelectionChange = vi.fn();
  const {container} = render(
    <RadarChart<Profile>
      {...common}
      interaction={{target: 'point', selection: {labels, onSelectionChange}, onActivate}}
    />,
  );
  const svg = svgOf(container);
  click(svg, at());
  expect(onSelectionChange).toHaveBeenLastCalledWith([{dimensionId: 'speed', seriesId: 'a'}]);
  click(svg, at(), {ctrlKey: true});
  expect(onSelectionChange).toHaveBeenCalledTimes(1);
  expect(onActivate).toHaveBeenCalledWith({
    item: {dimensionId: 'speed', seriesId: 'a'},
    dimension: {id: 'speed', label: 'Speed'},
    input: 'pointer',
    values: [{seriesId: 'a', label: 'Courier', value: 8, datum: data[0]}],
  });
});
it('activates a dimension with all original profile values', () => {
  const onActivate = vi.fn<(event: RadarActivation<Profile>) => void>(),
    onSelectionChange = vi.fn();
  const {container} = render(
    <RadarChart<Profile>
      {...common}
      interaction={{target: 'dimension', selection: {labels, onSelectionChange}, onActivate}}
    />,
  );
  const svg = svgOf(container);
  click(svg, at());
  expect(onSelectionChange).toHaveBeenLastCalledWith([{dimensionId: 'speed'}]);
  click(svg, at(), {metaKey: true});
  expect(onActivate).toHaveBeenCalledWith({
    item: {dimensionId: 'speed'},
    dimension: {id: 'speed', label: 'Speed'},
    input: 'pointer',
    values: [
      {seriesId: 'a', label: 'Courier', value: 8, datum: data[0]},
      {seriesId: 'b', label: 'Scout', value: 5, datum: data[1]},
    ],
  });
});
it('selects a dimension when one positive value center is inside the rectangle', () => {
  const onSelectionChange = vi.fn();
  const {container} = render(
    <RadarChart<Profile>
      {...common}
      interaction={{target: 'dimension', selection: {labels, onSelectionChange}}}
    />,
  );
  const svg = svgOf(container);
  down(svg, {clientX: 220, clientY: 110});
  fireEvent.pointerMove(svg, {clientX: 260, clientY: 125, pointerId: 1, pointerType: 'mouse'});
  fireEvent.pointerUp(svg, {clientX: 260, clientY: 125, pointerId: 1, pointerType: 'mouse'});
  expect(onSelectionChange).toHaveBeenLastCalledWith([{dimensionId: 'speed'}]);
});
it('touch-holds to activate without selecting on release', () => {
  vi.useFakeTimers();
  const onActivate = vi.fn<(event: RadarActivation<Profile>) => void>(),
    onSelectionChange = vi.fn();
  const {container} = render(
    <RadarChart<Profile>
      {...common}
      interaction={{target: 'point', selection: {labels, onSelectionChange}, onActivate}}
    />,
  );
  const svg = svgOf(container);
  down(svg, at(), {pointerType: 'touch'});
  act(() => {
    vi.advanceTimersByTime(520);
  });
  fireEvent.pointerUp(svg, {...at(), pointerId: 1, pointerType: 'touch'});
  expect(onActivate).toHaveBeenCalledTimes(1);
  expect(onActivate.mock.calls[0]?.[0].input).toBe('touch');
  expect(onSelectionChange).not.toHaveBeenCalled();
});
it('reaches a zero value by keyboard without making the center a pointer target', () => {
  const onActivate = vi.fn<(event: RadarActivation<Profile>) => void>(),
    onSelectionChange = vi.fn();
  const {container} = render(
    <RadarChart<Profile>
      {...common}
      interaction={{target: 'point', selection: {labels, onSelectionChange}, onActivate}}
    />,
  );
  const svg = svgOf(container);
  click(svg, {clientX: 240, clientY: 240});
  expect(onSelectionChange).not.toHaveBeenCalled();
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.focus(canvas);
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'End'});
  fireEvent.keyDown(canvas, {key: 'ArrowDown'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(onSelectionChange).toHaveBeenLastCalledWith([{dimensionId: 'comfort', seriesId: 'b'}]);
  fireEvent.keyDown(canvas, {key: 'Enter', ctrlKey: true});
  expect(onActivate.mock.calls[0]?.[0].values).toEqual([
    {seriesId: 'b', label: 'Scout', value: 0, datum: data[1]},
  ]);
});

it('keeps controlled selection application-owned and supports clearing internal selection', () => {
  const onSelectionChange = vi.fn();
  const selectedItems = [{dimensionId: 'range', seriesId: 'b'}];
  const {container, rerender} = render(
    <RadarChart<Profile>
      {...common}
      interaction={{target: 'point', selection: {labels, selectedItems, onSelectionChange}}}
    />,
  );
  click(svgOf(container), at());
  expect(onSelectionChange).toHaveBeenLastCalledWith([
    ...selectedItems,
    {dimensionId: 'speed', seriesId: 'a'},
  ]);
  expect(screen.getByRole('status').textContent).toContain('range b');
  expect(screen.getByRole('status').textContent).not.toContain('speed a');
  rerender(
    <RadarChart<Profile>
      {...common}
      interaction={{target: 'point', selection: {labels, selectedItems: [], onSelectionChange}}}
    />,
  );
  expect(screen.getByRole('status').textContent).toContain('None');
});
it('preserves IDs on reorder and retires removed or invalid series', () => {
  const {container, rerender} = render(
    <RadarChart<Profile> {...common} interaction={{target: 'point', selection: {labels}}} />,
  );
  click(svgOf(container), at());
  rerender(
    <RadarChart<Profile>
      {...common}
      data={[data[1], data[0]]}
      dimensions={[dimensions[2], dimensions[0], dimensions[1]]}
      interaction={{target: 'point', selection: {labels}}}
    />,
  );
  expect(screen.getByRole('status').textContent).toContain('speed a');
  rerender(
    <RadarChart<Profile>
      {...common}
      data={[data[1]]}
      interaction={{target: 'point', selection: {labels}}}
    />,
  );
  expect(screen.getByRole('status').textContent).toContain('None');
  rerender(
    <RadarChart<Profile> {...common} interaction={{target: 'point', selection: {labels}}} />,
  );
  expect(screen.getByRole('status').textContent).toContain('None');
  click(svgOf(container), at());
  rerender(
    <RadarChart<Profile>
      {...common}
      data={[{...data[0], speed: -1}, data[1]]}
      interaction={{target: 'point', selection: {labels}}}
    />,
  );
  rerender(
    <RadarChart<Profile> {...common} interaction={{target: 'point', selection: {labels}}} />,
  );
  expect(screen.getByRole('status').textContent).toContain('None');
});
it('uses the latest activation callback during a hold', () => {
  vi.useFakeTimers();
  const oldCallback = vi.fn(),
    newCallback = vi.fn(),
    onSelectionChange = vi.fn();
  const {container, rerender} = render(
    <RadarChart<Profile>
      {...common}
      interaction={{
        target: 'point',
        selection: {labels, onSelectionChange},
        onActivate: oldCallback,
      }}
    />,
  );
  down(svgOf(container), at(), {pointerType: 'touch'});
  rerender(
    <RadarChart<Profile>
      {...common}
      interaction={{
        target: 'point',
        selection: {labels, onSelectionChange},
        onActivate: newCallback,
      }}
    />,
  );
  act(() => {
    vi.advanceTimersByTime(510);
  });
  expect(oldCallback).not.toHaveBeenCalled();
  expect(newCallback).toHaveBeenCalledTimes(1);
});
it.each(['data', 'geometry', 'presentation', 'target', 'selection', 'activation'] as const)(
  'cancels holds on %s changes',
  (change) => {
    vi.useFakeTimers();
    const onActivate = vi.fn<(event: RadarActivation<Profile>) => void>();
    const initialInteraction = {target: 'point' as const, selection: {labels}, onActivate};
    const {container, rerender} = render(
      <RadarChart<Profile> {...common} interaction={initialInteraction} />,
    );
    const svg = svgOf(container);
    down(svg, at(), {pointerType: 'touch'});
    const nextProps = {
      ...common,
      ...(change === 'data' ? {data: [{...data[0]}, data[1]] as const} : {}),
      ...(change === 'geometry' ? {aspectRatio: 2} : {}),
      ...(change === 'presentation' ? {title: 'Renamed profiles'} : {}),
    };
    const nextInteraction = {
      target: change === 'target' ? ('dimension' as const) : ('point' as const),
      ...(change === 'selection' ? {} : {selection: {labels}}),
      ...(change === 'activation' ? {} : {onActivate}),
    };
    rerender(<RadarChart<Profile> {...nextProps} interaction={nextInteraction} />);
    act(() => {
      vi.advanceTimersByTime(510);
    });
    fireEvent.pointerUp(svg, {...at(), pointerId: 1, pointerType: 'touch'});
    expect(onActivate).not.toHaveBeenCalled();
  },
);
it('cancels a visible rectangle and applies add and remove modifiers', () => {
  const onSelectionChange = vi.fn();
  const {container} = render(
    <RadarChart<Profile>
      {...common}
      interaction={{target: 'point', selection: {labels, onSelectionChange}}}
    />,
  );
  const svg = svgOf(container);
  click(svg, at(1, 1));
  function rectangle(extra = {}) {
    down(svg, {clientX: 220, clientY: 110}, extra);
    fireEvent.pointerMove(svg, {clientX: 260, clientY: 125, pointerId: 1, pointerType: 'mouse'});
  }
  rectangle();
  expect(container.querySelector('[data-wcl-chart-selection-box]')).not.toBeNull();
  fireEvent.keyDown(container.querySelector('[data-wcl-chart-canvas]')!, {key: 'Escape'});
  expect(container.querySelector('[data-wcl-chart-selection-box]')).toBeNull();
  expect(onSelectionChange).toHaveBeenCalledTimes(1);
  rectangle({shiftKey: true});
  fireEvent.pointerUp(svg, {clientX: 260, clientY: 125, pointerId: 1, pointerType: 'mouse'});
  expect(onSelectionChange).toHaveBeenLastCalledWith([
    {dimensionId: 'range', seriesId: 'b'},
    {dimensionId: 'speed', seriesId: 'a'},
  ]);
  rectangle({altKey: true});
  fireEvent.pointerUp(svg, {clientX: 260, clientY: 125, pointerId: 1, pointerType: 'mouse'});
  expect(onSelectionChange).toHaveBeenLastCalledWith([{dimensionId: 'range', seriesId: 'b'}]);
  rectangle();
  fireEvent.pointerCancel(svg, {pointerId: 1});
  expect(container.querySelector('[data-wcl-chart-selection-box]')).toBeNull();
  expect(onSelectionChange).toHaveBeenCalledTimes(3);
});
it('preserves the pointer dimension when focus enters and activates without selection enabled', () => {
  const onActivate = vi.fn<(event: RadarActivation<Profile>) => void>();
  const {container} = render(
    <RadarChart<Profile> {...common} interaction={{target: 'point', onActivate}} />,
  );
  const svg = svgOf(container);
  click(svg, at(0, 1));
  expect(onActivate.mock.calls[0]?.[0].item).toEqual({dimensionId: 'range', seriesId: 'a'});
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(onActivate.mock.calls[1]?.[0].item).toEqual({dimensionId: 'range', seriesId: 'a'});
  fireEvent.pointerMove(svg, {...at(0, 2), pointerId: 2, pointerType: 'mouse'});
  fireEvent.focus(canvas);
  fireEvent.keyDown(canvas, {key: ' '});
  expect(onActivate.mock.calls[2]?.[0].item).toEqual({dimensionId: 'comfort', seriesId: 'a'});
});
it('does not select zero centers or sparse visual shoulders in a rectangle or click', () => {
  const sparse = [
    {...data[0], speed: 8, range: 0, comfort: 0},
    {...data[1], speed: 0, range: 0, comfort: 0},
  ] as const;
  const onSelectionChange = vi.fn();
  const {container} = render(
    <RadarChart<Profile>
      {...common}
      data={sparse}
      interaction={{target: 'point', selection: {labels, onSelectionChange}}}
    />,
  );
  const svg = svgOf(container);
  click(svg, {clientX: 240, clientY: 240});
  click(svg, {clientX: 266, clientY: 255});
  expect(onSelectionChange).not.toHaveBeenCalled();
  down(svg, {clientX: 230, clientY: 230});
  fireEvent.pointerMove(svg, {clientX: 270, clientY: 270, pointerId: 1, pointerType: 'mouse'});
  fireEvent.pointerUp(svg, {clientX: 270, clientY: 270, pointerId: 1, pointerType: 'mouse'});
  expect(onSelectionChange).toHaveBeenLastCalledWith([]);
});
it('prioritizes pinned and transient legend profiles only at overlapping positive points', () => {
  const overlapping = [data[0], {...data[1], speed: 8}] as const;
  const onSelectionChange = vi.fn();
  const {container} = render(
    <RadarChart<Profile>
      {...common}
      data={overlapping}
      interaction={{target: 'point', selection: {labels, onSelectionChange}}}
    />,
  );
  const svg = svgOf(container);
  fireEvent.mouseEnter(screen.getByRole('button', {name: 'Scout'}));
  click(svg, at());
  expect(onSelectionChange).toHaveBeenLastCalledWith([{dimensionId: 'speed', seriesId: 'b'}]);
  fireEvent.click(screen.getByRole('button', {name: 'Scout'}));
  click(svg, at(0, 2));
  expect(onSelectionChange).toHaveBeenLastCalledWith([
    {dimensionId: 'speed', seriesId: 'b'},
    {dimensionId: 'comfort', seriesId: 'a'},
  ]);
});

it('gives a zero-only dimension visible activation feedback without inventing an extent', () => {
  const onActivate = vi.fn<(event: RadarActivation<Profile>) => void>();
  const {container} = render(
    <RadarChart<Profile>
      {...common}
      data={[{...data[0], comfort: 0}, data[1]]}
      interaction={{target: 'dimension', onActivate}}
    />,
  );
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.focus(canvas);
  fireEvent.keyDown(canvas, {key: 'End'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(onActivate.mock.calls[0]?.[0].values.map((value: {value: number}) => value.value)).toEqual(
    [0, 0],
  );
  expect(container.querySelector('[data-wcl-radar-zero-dimension-activation]')?.textContent).toBe(
    'Comfort',
  );
});

it('cancels pending activation when the value formatter changes', () => {
  vi.useFakeTimers();
  const onActivate = vi.fn<(event: RadarActivation<Profile>) => void>();
  const {container, rerender} = render(
    <RadarChart<Profile>
      {...common}
      interaction={{target: 'point', selection: {labels}, onActivate}}
    />,
  );
  down(svgOf(container), at(), {pointerType: 'touch'});
  rerender(
    <RadarChart<Profile>
      {...common}
      value={{...common.value, formatValue: (value) => value.toFixed(1)}}
      interaction={{target: 'point', selection: {labels}, onActivate}}
    />,
  );
  act(() => {
    vi.advanceTimersByTime(510);
  });
  expect(onActivate).not.toHaveBeenCalled();
});

it('clears keyboard target preview when the pointer moves into blank plot space', () => {
  const {container} = render(
    <RadarChart<Profile> {...common} interaction={{target: 'dimension', selection: {labels}}} />,
  );
  const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
  fireEvent.focus(canvas);
  expect(container.querySelectorAll('[data-wcl-radar-reading-point]')).toHaveLength(2);
  fireEvent.pointerMove(svgOf(container), {
    clientX: 30,
    clientY: 30,
    pointerId: 1,
    pointerType: 'mouse',
  });
  expect(container.querySelectorAll('[data-wcl-radar-reading-point]')).toHaveLength(0);
});

it('keeps the last pointer target available to the keyboard after pointer exit', () => {
  const onActivate = vi.fn<(event: RadarActivation<Profile>) => void>();
  const {container} = render(
    <RadarChart<Profile> {...common} interaction={{target: 'point', onActivate}} />,
  );
  const svg = svgOf(container);
  click(svg, at(1, 1));
  fireEvent.pointerLeave(svg, {pointerType: 'mouse'});
  expect(container.querySelectorAll('[data-wcl-radar-reading-point]')).toHaveLength(0);
  fireEvent.keyDown(container.querySelector('[data-wcl-chart-canvas]')!, {key: 'Enter'});
  expect(onActivate).toHaveBeenLastCalledWith(
    expect.objectContaining({item: {dimensionId: 'range', seriesId: 'b'}}),
  );
});

it('uses the shared screen-space point pulse size for radar activation', () => {
  const {container} = render(
    <RadarChart<Profile> {...common} interaction={{target: 'point', onActivate: () => {}}} />,
  );
  const svg = svgOf(container);
  click(svg, at());
  expect(
    Number(container.querySelector('[data-wcl-chart-activation-dot]')?.getAttribute('r')),
  ).toBe(10);
});
