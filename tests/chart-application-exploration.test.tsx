import {cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {ScatterChart, Toolbar} from '../src/index.js';
afterEach(cleanup);
export const scatterProps = {
  title: 'Energy',
  description: 'Buildings',
  dataTableLabel: 'Buildings data',
  emptyState: {title: 'Empty', description: 'No data'},
  invalidData: {title: 'Invalid', description: 'Invalid data'},
  data: [
    {id: 'a', x: 0, y: 0},
    {id: 'b', x: 10, y: 10},
  ],
  idAccessor: 'id',
  labelAccessor: 'id',
  xAxis: {accessor: 'x', label: 'Area', scale: {type: 'linear', domain: [0, 10]}},
  yAxis: {accessor: 'y', label: 'Energy', scale: {type: 'linear', domain: [0, 10]}},
  series: [{id: 'value', label: 'Value'}],
} as const;
export const labels = {
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
  corner: (c: string) => c,
  range: () => 'Window extent',
};
it('composes one command set in a public toolbar and keeps canvas and button shortcuts', () => {
  const change = vi.fn();
  render(
    <ScatterChart
      {...scatterProps}
      exploration={{
        labels,
        defaultWindow: {x: [2, 8], y: [2, 8]},
        onWindowChange: change,
        renderControls: (controls) => (
          <Toolbar label="Explore">
            {controls.overview}
            {controls.zoomOut}
            {controls.zoomIn}
            {controls.reset}
            {controls.pan}
          </Toolbar>
        ),
      }}
    />,
  );
  const toolbar = screen.getByRole('toolbar', {name: 'Explore'});
  expect(screen.getAllByRole('button', {name: 'Zoom in'})).toHaveLength(1);
  const zoom = within(toolbar).getByRole('button', {name: 'Zoom in'});
  fireEvent.keyDown(zoom, {key: 'ArrowRight'});
  expect(change).toHaveBeenCalledOnce();
  const canvas = screen.getByRole('group', {name: 'Energy'});
  fireEvent.keyDown(canvas, {key: '+'});
  expect(change).toHaveBeenCalledTimes(2);
});
