import {cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {useState} from 'react';
import {afterEach, expect, it, vi} from 'vitest';
import {ChartExplorationControls} from '../src/charts/chart-exploration-controls.js';

afterEach(cleanup);
const labels = {
  overview: 'Overview',
  closeOverview: 'Close overview',
  done: 'Done',
  reset: 'Reset view',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  panBackward: 'Earlier',
  panForward: 'Later',
  window: 'Visible range',
  start: 'Range start',
  end: 'Range end',
  instructions: 'Drag the window or its edges.',
};
it('opens the overview from one icon and retains keyboard range changes on dismissal', () => {
  const changes =
    vi.fn<(range: readonly [number, number], phase: 'change' | 'end' | 'cancel') => void>();
  function Example() {
    const [window, setWindow] = useState<readonly [number, number]>([0.25, 0.75]);
    return (
      <ChartExplorationControls
        window={window}
        minimumSpan={0.1}
        labels={labels}
        rangeLabel={`${window[0]} to ${window[1]}`}
        fullRangeLabels={['First', 'Last']}
        formatWindow={(w) => `${w[0]} to ${w[1]}`}
        onChange={(next, phase) => {
          setWindow(next);
          changes(next, phase);
        }}
        overview={<svg aria-hidden="true" />}
      />
    );
  }
  render(<Example />);
  fireEvent.click(screen.getByRole('button', {name: 'Overview'}));
  const dialog = screen.getByRole('dialog');
  const window = within(dialog).getByRole('slider', {name: 'Visible range'});
  fireEvent.keyDown(window, {key: 'ArrowRight'});
  expect(changes).toHaveBeenCalled();
  const latest = changes.mock.lastCall!;
  expect(latest[0][0]).toBeGreaterThan(0.25);
  expect(latest[0][1] - latest[0][0]).toBeCloseTo(0.5);
  fireEvent.click(within(dialog).getByRole('button', {name: 'Done'}));
  expect(changes.mock.lastCall![0]).toEqual(latest[0]);
});
it('zooms about the center, completes the change, and resets to the full domain', () => {
  const onChange = vi.fn();
  const {rerender} = render(
    <ChartExplorationControls
      window={[0, 1]}
      minimumSpan={0.1}
      labels={labels}
      rangeLabel="All"
      fullRangeLabels={['First', 'Last']}
      formatWindow={String}
      onChange={onChange}
      overview={<svg />}
    />,
  );
  fireEvent.click(screen.getByRole('button', {name: 'Zoom in'}));
  expect(onChange).toHaveBeenLastCalledWith([0.25, 0.75], 'end');
  rerender(
    <ChartExplorationControls
      window={[0.25, 0.75]}
      minimumSpan={0.1}
      labels={labels}
      rangeLabel="Middle"
      fullRangeLabels={['First', 'Last']}
      formatWindow={String}
      onChange={onChange}
      overview={<svg />}
    />,
  );
  fireEvent.click(screen.getByRole('button', {name: 'Reset view'}));
  expect(onChange).toHaveBeenLastCalledWith([0, 1], 'end');
});

function renderNavigator() {
  const changes =
    vi.fn<(range: readonly [number, number], phase: 'change' | 'end' | 'cancel') => void>();
  function Example() {
    const [range, setRange] = useState<readonly [number, number]>([0.25, 0.75]);
    return (
      <ChartExplorationControls
        window={range}
        minimumSpan={0.1}
        labels={labels}
        rangeLabel={String(range)}
        fullRangeLabels={['First', 'Last']}
        formatWindow={String}
        onChange={(next, phase) => {
          setRange(next);
          changes(next, phase);
        }}
        overview={<svg />}
      />
    );
  }
  render(<Example />);
  fireEvent.click(screen.getByRole('button', {name: 'Overview'}));
  const range = screen.getByRole('slider', {name: 'Visible range'});
  const navigator = range.parentElement!;
  vi.spyOn(navigator, 'getBoundingClientRect').mockReturnValue({left: 0, width: 400} as DOMRect);
  return {changes, range, navigator};
}

it('moves a touch window directly and Escape restores the starting range without closing', () => {
  const {changes, range, navigator} = renderNavigator();
  fireEvent.pointerDown(range, {button: 0, pointerId: 1, pointerType: 'touch', clientX: 200});
  expect(navigator.hasAttribute('data-dragging')).toBe(true);
  fireEvent.pointerMove(navigator, {pointerId: 1, pointerType: 'touch', clientX: 240});
  expect(changes).toHaveBeenLastCalledWith([0.35, 0.85], 'change');
  fireEvent.keyDown(range, {key: 'Escape'});
  expect(changes).toHaveBeenLastCalledWith([0.25, 0.75], 'cancel');
  expect(navigator.hasAttribute('data-dragging')).toBe(false);
  expect(screen.getByRole('dialog')).toBeTruthy();
});

it('completes resizing within the minimum span and recenters clicks outside the window', () => {
  const {changes, navigator} = renderNavigator();
  fireEvent.pointerDown(screen.getByRole('slider', {name: 'Range start'}), {
    button: 0,
    pointerId: 2,
    clientX: 100,
  });
  fireEvent.pointerMove(navigator, {pointerId: 2, clientX: 350});
  fireEvent.pointerUp(navigator, {pointerId: 2, clientX: 350});
  expect(changes).toHaveBeenLastCalledWith([0.65, 0.75], 'end');
  expect(navigator.hasAttribute('data-dragging')).toBe(false);
  fireEvent.pointerDown(navigator, {button: 0, pointerId: 3, clientX: 200});
  fireEvent.pointerUp(navigator, {pointerId: 3, clientX: 200});
  const [next, phase] = changes.mock.lastCall!;
  expect(next[0]).toBeCloseTo(0.45);
  expect(next[1]).toBeCloseTo(0.55);
  expect(phase).toBe('end');
});

it('pans and zooms by default while a chart command owns focus', () => {
  const onChange = vi.fn();
  render(
    <div data-wcl-chart-canvas="" role="group" tabIndex={0}>
      <ChartExplorationControls
        window={[0.25, 0.75]}
        minimumSpan={0.1}
        labels={labels}
        rangeLabel="Middle"
        fullRangeLabels={['First', 'Last']}
        formatWindow={String}
        onChange={onChange}
        overview={<svg />}
      />
    </div>,
  );
  const zoom = screen.getByRole('button', {name: 'Zoom in'});
  zoom.focus();
  fireEvent.keyDown(zoom, {key: 'ArrowRight'});
  expect(onChange).toHaveBeenLastCalledWith([0.41666666666666663, 0.9166666666666666], 'end');
  fireEvent.keyDown(zoom, {key: '+'});
  expect(onChange).toHaveBeenLastCalledWith([0.375, 0.625], 'end');
});

it('restores the canvas before the next key when a focused command becomes disabled', () => {
  function Example() {
    const [window, setWindow] = useState<readonly [number, number]>([0.25, 0.75]);
    return (
      <div data-wcl-chart-canvas="" role="group" aria-label="Chart" tabIndex={0}>
        <ChartExplorationControls
          window={window}
          minimumSpan={0.1}
          labels={labels}
          rangeLabel="Window"
          fullRangeLabels={['Start', 'End']}
          formatWindow={() => 'Window'}
          onChange={setWindow}
          overview={<svg />}
        />
      </div>
    );
  }
  render(<Example />);
  const fit = screen.getByRole('button', {name: labels.reset});
  fit.focus();
  fireEvent.click(fit);
  expect(document.activeElement).toBe(screen.getByRole('group', {name: 'Chart'}));
  fireEvent.keyDown(document.activeElement!, {key: '+'});
  expect((fit as HTMLButtonElement).disabled).toBe(false);
});

it('does not dispatch keyboard zoom when rounding puts the window at its minimum', () => {
  const onChange = vi.fn();
  render(
    <div data-wcl-chart-canvas="" role="group" aria-label="Chart" tabIndex={0}>
      <ChartExplorationControls
        window={[0.45, 0.55]}
        minimumSpan={0.1}
        labels={labels}
        rangeLabel="Minimum"
        fullRangeLabels={['Start', 'End']}
        formatWindow={() => 'Minimum'}
        onChange={onChange}
        overview={<svg />}
      />
    </div>,
  );
  expect(screen.getByRole('button', {name: labels.zoomIn}).hasAttribute('disabled')).toBe(true);
  fireEvent.keyDown(screen.getByRole('group', {name: 'Chart'}), {key: '='});
  expect(onChange).not.toHaveBeenCalled();
});
