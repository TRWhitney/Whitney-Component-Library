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
it.each(['line', 'scatter', 'panel', 'toolbar'] as const)(
  'pans %s by middle-button movement while the chart or commands own focus',
  (kind) => {
    const change =
      vi.fn<
        (
          window:
            | readonly [number, number]
            | {x: readonly [number, number]; y: readonly [number, number]},
        ) => void
      >();
    const end = vi.fn();
    render(
      <>
        <input aria-label="Search" />
        {kind === 'line' ? (
          <LineChart<(typeof data)[number], number>
            {...common}
            series={[{id: 'value', label: 'Value', accessor: 'y'}]}
            exploration={{
              labels,
              defaultWindow: [2, 8],
              onWindowChange: change,
              onWindowChangeEnd: end,
            }}
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
              onWindowChangeEnd: end,
              ...(kind === 'panel' ? {presentation: 'panel'} : {}),
              ...(kind === 'toolbar'
                ? {
                    renderControls: (controls) => (
                      <Toolbar label="Explore">
                        {controls.zoomIn}
                        {controls.zoomOut}
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
    const svg = canvas.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
    Object.defineProperty(svg, 'getBoundingClientRect', {value: () => new DOMRect(0, 0, 640, 360)});
    const pointer = {
      pointerType: 'mouse',
      button: 1,
      buttons: 4,
      pointerId: 1,
      clientX: 250,
      clientY: 150,
    };
    screen.getByRole('textbox', {name: 'Search'}).focus();
    expect(fireEvent.pointerDown(svg, pointer)).toBe(true);
    fireEvent.pointerMove(svg, {...pointer, clientX: 300});
    expect(change).not.toHaveBeenCalled();
    canvas.focus();
    expect(fireEvent.pointerDown(svg, pointer)).toBe(false);
    fireEvent.pointerMove(svg, {...pointer, clientX: 275, clientY: 160});
    expect(change).toHaveBeenCalledOnce();
    const first = change.mock.lastCall![0];
    const firstX = 'x' in first ? first.x : first;
    expect(firstX[0]).toBeLessThan(2);
    expect(firstX[1] - firstX[0]).toBeCloseTo(6);
    if ('y' in first) expect(first.y[0]).toBeGreaterThan(2);
    fireEvent.pointerMove(svg, {...pointer, clientX: 300, clientY: 170});
    const second = change.mock.lastCall![0];
    const secondX = 'x' in second ? second.x : second;
    expect(2 - secondX[0]).toBeCloseTo(2 * (2 - firstX[0]));
    expect(end).not.toHaveBeenCalled();
    fireEvent.pointerUp(svg, {...pointer, buttons: 0, clientX: 300, clientY: 170});
    expect(end).toHaveBeenCalledOnce();
    expect(end.mock.lastCall![0]).toEqual(second);
    change.mockClear();
    fireEvent.pointerMove(svg, {...pointer, buttons: 0, clientX: 350});
    expect(change).not.toHaveBeenCalled();
    screen.getByRole('button', {name: 'Zoom in'}).focus();
    expect(fireEvent.pointerDown(svg, pointer)).toBe(false);
    fireEvent.pointerMove(svg, {...pointer, clientX: 240, clientY: 140});
    expect(change).toHaveBeenCalledOnce();
    fireEvent.pointerCancel(svg, pointer);
    expect(change.mock.lastCall![0]).toEqual(second);
    fireEvent.pointerDown(svg, pointer);
    fireEvent.pointerMove(svg, {...pointer, clientX: 240, clientY: 140});
    fireEvent.keyDown(screen.getByRole('button', {name: 'Zoom in'}), {key: 'Escape'});
    expect(change.mock.lastCall![0]).toEqual(second);
    change.mockClear();
    canvas.focus();
    fireEvent.pointerDown(svg, pointer);
    fireEvent.pointerMove(svg, {...pointer, clientX: 10000, clientY: 10000});
    const limited = change.mock.lastCall![0];
    const limitedX = 'x' in limited ? limited.x : limited;
    expect(limitedX[0]).toBe(0);
    expect(limitedX[1]).toBeCloseTo(6);
    fireEvent.pointerUp(svg, {...pointer, buttons: 0});
  },
);
