import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, expect, it} from 'vitest';
import {LineChart} from '../src/index.js';

afterEach(() => {
  cleanup();
  fireEvent.keyDown(document, {key: 'Tab'});
});
const chart = (
  <LineChart
    data={[
      {month: 'Jan', value: 10},
      {month: 'Mar', value: 30},
    ]}
    title="Values"
    description="Monthly values"
    dataTableLabel="Values table"
    emptyState={{title: 'Empty', description: 'No values'}}
    invalidData={{title: 'Invalid', description: 'Invalid values'}}
    series={[{id: 'value', accessor: 'value', label: 'Value', showPoints: true}]}
    xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
    yAxis={{label: 'Value', scale: {type: 'linear'}}}
  />
);

it('does not start a keyboard reading when a mouse click focuses the plot', () => {
  const {container} = render(chart);
  const reader = screen.getByRole('group', {name: 'Values'});
  const svg = container.querySelector('svg[data-wcl-chart-svg]')!;
  fireEvent.pointerDown(svg, {pointerType: 'mouse'});
  act(() => reader.focus());
  fireEvent.pointerUp(svg, {pointerType: 'mouse'});
  fireEvent.click(svg);
  fireEvent.pointerLeave(svg);
  expect(screen.queryByRole('tooltip')).toBeNull();
  fireEvent.keyDown(reader, {key: 'End'});
  expect(screen.getByRole('tooltip').textContent).toContain('Mar');
});

it('clears the old keyboard reading when the reader switches to the mouse', () => {
  fireEvent.keyDown(document, {key: 'Tab'});
  const {container} = render(chart);
  const reader = screen.getByRole('group', {name: 'Values'});
  act(() => reader.focus());
  fireEvent.keyDown(reader, {key: 'End'});
  expect(screen.getByRole('tooltip').textContent).toContain('Mar');
  const svg = container.querySelector('svg[data-wcl-chart-svg]')!;
  fireEvent.pointerDown(svg, {pointerType: 'mouse'});
  fireEvent.pointerLeave(svg);
  expect(screen.queryByRole('tooltip')).toBeNull();
  act(() => reader.blur());
  fireEvent.keyDown(document, {key: 'Tab'});
  act(() => reader.focus());
  expect(screen.getByRole('tooltip').textContent).toContain('Jan');
});
