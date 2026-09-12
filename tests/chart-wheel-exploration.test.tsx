import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {LineChart, ScatterChart, Toolbar} from '../src/index.js';
afterEach(cleanup);
const data: {id: string; x: number; y: number}[] = [
  {id: 'a', x: 0, y: 0},
  {id: 'b', x: 10, y: 10},
];
const common = {
  title: 'Energy',
  description: 'Buildings',
  dataTableLabel: 'Values',
  emptyState: {title: 'Empty', description: 'No data'},
  invalidData: {title: 'Invalid', description: 'Invalid data'},
  data,
  xAxis: {accessor: 'x', label: 'Area', scale: {type: 'linear', domain: [0, 10]}},
  yAxis: {accessor: 'y', label: 'Energy', scale: {type: 'linear', domain: [0, 10]}},
} as const;
const labels = {
  panBackward: 'Backward',
  panForward: 'Forward',
  start: 'Start',
  end: 'End',
  overview: 'Overview',
  closeOverview: 'Close',
  done: 'Done',
  reset: 'Fit',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  panLeft: 'Left',
  panRight: 'Right',
  panUp: 'Up',
  panDown: 'Down',
  window: 'Window',
  instructions: 'Adjust the window',
  corner: (corner: string) => corner,
  range: () => 'Window extent',
};
it.each(['line', 'scatter', 'toolbar'] as const)(
  'zooms %s only while its canvas or commands have focus',
  (kind) => {
    const change =
      vi.fn<
        (
          window:
            | readonly [number, number]
            | {readonly x: readonly [number, number]; readonly y: readonly [number, number]},
        ) => void
      >();
    render(
      <>
        <input aria-label="Search" />
        {kind === 'line' ? (
          <LineChart<(typeof data)[number], number>
            {...common}
            series={[{id: 'value', label: 'Value', accessor: 'y'}]}
            exploration={{labels, defaultWindow: [2, 8], onWindowChange: change}}
          />
        ) : (
          <ScatterChart
            {...common}
            idAccessor="id"
            labelAccessor="id"
            series={[{id: 'value', label: 'Value'}]}
            exploration={{
              labels,
              defaultWindow: {x: [2, 8], y: [2, 8]},
              onWindowChange: change,
              ...(kind === 'toolbar'
                ? {
                    renderControls: (controls) => (
                      <Toolbar label="Explore">
                        {controls.zoomIn}
                        {controls.zoomOut}
                        {controls.reset}
                        {controls.overview}
                        {controls.pan}
                      </Toolbar>
                    ),
                  }
                : {}),
            }}
          />
        )}
      </>,
    );
    const canvas = screen.getByRole('group', {name: 'Energy'});
    const search = screen.getByRole('textbox', {name: 'Search'});
    search.focus();
    expect(fireEvent.wheel(canvas, {deltaY: -100})).toBe(true);
    expect(change).not.toHaveBeenCalled();
    canvas.focus();
    expect(fireEvent.wheel(canvas, {deltaY: -100})).toBe(false);
    expect(change).toHaveBeenCalledOnce();
    const first = change.mock.calls[0]![0];
    const firstX = 'x' in first ? first.x : first;
    expect(firstX[1] - firstX[0]).toBeLessThan(6);
    const out = screen.getByRole('button', {name: 'Zoom out'});
    out.focus();
    expect(fireEvent.wheel(canvas, {deltaY: 100})).toBe(false);
    expect(change).toHaveBeenCalledTimes(2);
    const second = change.mock.calls[1]![0];
    const secondX = 'x' in second ? second.x : second;
    expect(secondX[1] - secondX[0]).toBeGreaterThan(firstX[1] - firstX[0]);
    fireEvent.wheel(search, {deltaY: -100});
    fireEvent.wheel(canvas, {deltaY: -100, ctrlKey: true});
    fireEvent.wheel(canvas, {deltaX: 100, deltaY: 0});
    expect(change).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByRole('button', {name: 'Overview'}));
    fireEvent.wheel(screen.getByRole('dialog'), {deltaY: -100});
    expect(change).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByRole('button', {name: 'Close'}));
    fireEvent.click(screen.getByRole('button', {name: 'Fit'}));
    canvas.focus();
    change.mockClear();
    expect(fireEvent.wheel(canvas, {deltaY: 100})).toBe(false);
    expect(change).not.toHaveBeenCalled();
    for (let index = 0; index < 4; index++) fireEvent.wheel(canvas, {deltaY: -8});
    expect(change).not.toHaveBeenCalled();
    fireEvent.wheel(canvas, {deltaY: -8});
    expect(change).toHaveBeenCalledOnce();
    fireEvent.wheel(canvas, {deltaY: 3, deltaMode: 1});
    expect(change).toHaveBeenCalledTimes(2);
  },
);
