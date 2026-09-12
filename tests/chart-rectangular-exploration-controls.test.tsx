import {cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import {useState} from 'react';
import {afterEach, expect, it, vi} from 'vitest';
import {ChartRectangularExplorationControls} from '../src/charts/chart-rectangular-exploration-controls.js';
import type {ChartRectangularExplorationControlsProps} from '../src/charts/chart-rectangular-exploration-controls.js';
import type {
  ChartRectangularExplorationLabels,
  ChartRectangularWindow,
} from '../src/charts/chart-rectangular-exploration-types.js';
afterEach(cleanup);
const labels: ChartRectangularExplorationLabels<number, number> = {
  overview: 'Overview',
  closeOverview: 'Close overview',
  done: 'Done',
  reset: 'Reset view',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  panLeft: 'Left',
  panRight: 'Right',
  panUp: 'Up',
  panDown: 'Down',
  window: 'Visible area',
  instructions: 'Drag the area or a corner. Use arrows to adjust.',
  corner: (corner) => `Resize ${corner}`,
  range: (r) => JSON.stringify(r),
};
it('opens the rectangular overview and moves each axis independently by keyboard', () => {
  const changed =
    vi.fn<
      (r: ChartRectangularWindow<number, number>, phase: 'change' | 'end' | 'cancel') => void
    >();
  function Example() {
    const [window, setWindow] = useState<ChartRectangularWindow<number, number>>({
      x: [0.2, 0.8],
      y: [0.2, 0.8],
    });
    return (
      <ChartRectangularExplorationControls
        window={window}
        minimumSpan={{x: 0.1, y: 0.1}}
        labels={labels}
        rangeLabel={labels.range(window)}
        fullRangeLabel="Complete extent"
        formatWindow={labels.range}
        onChange={(r, p) => {
          setWindow(r);
          changed(r, p);
        }}
        overview={<svg />}
        aspectRatio={2}
      />
    );
  }
  render(<Example />);
  fireEvent.click(screen.getByRole('button', {name: 'Overview'}));
  const dialog = screen.getByRole('dialog');
  const window = within(dialog).getByRole('group', {name: /Visible area/});
  fireEvent.keyDown(window, {key: 'ArrowUp'});
  expect(changed.mock.lastCall![0].y[0]).toBeGreaterThan(0.2);
  expect(changed.mock.lastCall![0].x).toEqual([0.2, 0.8]);
  const previous = changed.mock.lastCall![0];
  fireEvent.keyDown(window, {key: 'ArrowRight'});
  expect(changed.mock.lastCall![0].x[0]).toBeGreaterThan(0.2);
  expect(changed.mock.lastCall![0].y).toEqual(previous.y);
  fireEvent.click(within(dialog).getByRole('button', {name: 'Done'}));
  expect(changed.mock.lastCall![1]).toBe('end');
});
it('zooms both axes about their center and resets both together', () => {
  const changed = vi.fn<ChartRectangularExplorationControlsProps['onChange']>();
  render(
    <ChartRectangularExplorationControls
      window={{x: [0, 1], y: [0, 1]}}
      minimumSpan={{x: 0.1, y: 0.1}}
      labels={labels}
      rangeLabel="All values"
      fullRangeLabel="Complete extent"
      formatWindow={labels.range}
      onChange={changed}
      overview={<svg />}
      aspectRatio={2}
    />,
  );
  fireEvent.click(screen.getByRole('button', {name: 'Zoom in'}));
  expect(changed).toHaveBeenLastCalledWith({x: [0.25, 0.75], y: [0.25, 0.75]}, 'end');
});

function renderNavigator(options: Partial<ChartRectangularExplorationControlsProps> = {}) {
  const changed = vi.fn<ChartRectangularExplorationControlsProps['onChange']>();
  function Example({version = 'first'}: {version?: string}) {
    const [window, setWindow] = useState<ChartRectangularWindow<number, number>>({
      x: [0.25, 0.75],
      y: [0.25, 0.75],
    });
    return (
      <ChartRectangularExplorationControls
        window={window}
        minimumSpan={{x: 0.1, y: 0.1}}
        labels={labels}
        rangeLabel={labels.range(window)}
        fullRangeLabel="Complete extent"
        formatWindow={labels.range}
        overview={<svg />}
        aspectRatio={2}
        {...options}
        version={version}
        onChange={(next, phase) => {
          setWindow(next);
          changed(next, phase);
        }}
      />
    );
  }
  const view = render(<Example />);
  const trigger = screen.getByRole('button', {name: 'Overview'});
  trigger.focus();
  fireEvent.click(trigger);
  const window = screen.getByRole('group', {name: /Visible area/});
  const navigator = window.parentElement!;
  vi.spyOn(navigator, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    width: 400,
    height: 200,
  } as DOMRect);
  return {
    changed,
    trigger,
    window,
    navigator,
    replaceSource: () => view.rerender(<Example version="second" />),
  };
}

it('resizes both corner axes directly and clamps to the minimum spans', () => {
  const {changed, navigator} = renderNavigator();
  fireEvent.pointerDown(screen.getByRole('button', {name: 'Resize top-left'}), {
    button: 0,
    pointerId: 2,
    clientX: 100,
    clientY: 50,
  });
  expect(navigator.hasAttribute('data-dragging')).toBe(true);
  fireEvent.pointerMove(navigator, {pointerId: 2, clientX: 350, clientY: 180});
  fireEvent.pointerUp(navigator, {pointerId: 2, clientX: 350, clientY: 180});
  expect(changed).toHaveBeenLastCalledWith({x: [0.65, 0.75], y: [0.25, 0.35]}, 'end');
  expect(navigator.hasAttribute('data-dragging')).toBe(false);
});

it.each(['Escape', 'pointercancel'])(
  'restores the initial window on %s without dismissing the dialog',
  (cancel) => {
    const {changed, window, navigator} = renderNavigator();
    fireEvent.pointerDown(window, {
      button: 0,
      pointerId: 1,
      pointerType: 'touch',
      clientX: 200,
      clientY: 100,
    });
    fireEvent.pointerMove(navigator, {
      pointerId: 1,
      pointerType: 'touch',
      clientX: 240,
      clientY: 80,
    });
    expect(changed).toHaveBeenLastCalledWith({x: [0.35, 0.85], y: [0.35, 0.85]}, 'change');
    if (cancel === 'Escape') fireEvent.keyDown(window, {key: 'Escape'});
    else fireEvent.pointerCancel(navigator, {pointerId: 1});
    expect(changed).toHaveBeenLastCalledWith({x: [0.25, 0.75], y: [0.25, 0.75]}, 'cancel');
    expect(navigator.hasAttribute('data-dragging')).toBe(false);
    expect(screen.getByRole('dialog')).toBeTruthy();
  },
);

it('abandons an active gesture when its source version changes', () => {
  const {changed, window, navigator, replaceSource} = renderNavigator();
  fireEvent.pointerDown(window, {button: 0, pointerId: 1, clientX: 200, clientY: 100});
  fireEvent.pointerMove(navigator, {pointerId: 1, clientX: 240, clientY: 80});
  replaceSource();
  changed.mockClear();
  fireEvent.pointerMove(navigator, {pointerId: 1, clientX: 250, clientY: 70});
  fireEvent.pointerUp(navigator, {pointerId: 1, clientX: 250, clientY: 70});
  expect(changed).not.toHaveBeenCalled();
  expect(navigator.hasAttribute('data-dragging')).toBe(false);
});

it('draws a new rectangle and recenters an outside click', () => {
  const {changed, navigator} = renderNavigator();
  fireEvent.pointerDown(navigator, {button: 0, pointerId: 1, clientX: 0, clientY: 200});
  fireEvent.pointerMove(navigator, {pointerId: 1, clientX: 80, clientY: 160});
  fireEvent.pointerUp(navigator, {pointerId: 1, clientX: 80, clientY: 160});
  expect(changed).toHaveBeenLastCalledWith({x: [0, 0.2], y: [0, 0.2]}, 'end');
  fireEvent.pointerDown(navigator, {button: 0, pointerId: 2, clientX: 200, clientY: 100});
  fireEvent.pointerUp(navigator, {pointerId: 2, clientX: 200, clientY: 100});
  expect(changed.mock.lastCall![0].x[0]).toBeCloseTo(0.4);
  expect(changed.mock.lastCall![0].y[0]).toBeCloseTo(0.4);
});

it('keeps keyboard and pointer changes on complete categories with downward y values', () => {
  const {changed, window, navigator} = renderNavigator({
    step: {x: 0.25, y: 0.25},
    yIncreasesDown: true,
  });
  fireEvent.keyDown(window, {key: 'ArrowDown'});
  expect(changed).toHaveBeenLastCalledWith({x: [0.25, 0.75], y: [0.5, 1]}, 'end');
  fireEvent.keyDown(screen.getByRole('button', {name: 'Resize top-left'}), {key: 'ArrowDown'});
  expect(changed).toHaveBeenLastCalledWith({x: [0.25, 0.75], y: [0.75, 1]}, 'end');
  fireEvent.pointerDown(window, {button: 0, pointerId: 2, clientX: 200, clientY: 160});
  fireEvent.pointerMove(navigator, {pointerId: 2, clientX: 134, clientY: 124});
  fireEvent.pointerUp(navigator, {pointerId: 2, clientX: 134, clientY: 124});
  expect(changed).toHaveBeenLastCalledWith({x: [0, 0.5], y: [0.5, 0.75]}, 'end');
});

it('retains changes and restores trigger focus when the dialog closes', async () => {
  const {changed, trigger, window} = renderNavigator();
  fireEvent.keyDown(window, {key: 'End'});
  expect(changed).toHaveBeenLastCalledWith({x: [0.5, 1], y: [0.5, 1]}, 'end');
  fireEvent.click(screen.getByRole('button', {name: 'Done'}));
  expect(changed).toHaveBeenLastCalledWith({x: [0.5, 1], y: [0.5, 1]}, 'end');
  expect(screen.queryByRole('dialog')).toBeNull();
  await waitFor(() => expect(document.activeElement).toBe(trigger));
});

it('groups up with left and down with right away from the axis title', () => {
  renderNavigator();
  fireEvent.click(screen.getByRole('button', {name: 'Done'}));
  expect(screen.getByRole('button', {name: 'Left'}).parentElement).toBe(
    screen.getByRole('button', {name: 'Up'}).parentElement,
  );
  expect(screen.getByRole('button', {name: 'Right'}).parentElement).toBe(
    screen.getByRole('button', {name: 'Down'}).parentElement,
  );
  expect(screen.getByRole('button', {name: 'Left'}).parentElement).not.toBe(
    screen.getByRole('button', {name: 'Right'}).parentElement,
  );
});
