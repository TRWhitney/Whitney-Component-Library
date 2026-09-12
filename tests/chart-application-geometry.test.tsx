import {useState} from 'react';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {LineChart, ScatterChart} from '../src/index.js';
afterEach(cleanup);
const data = [
  {id: 'a', x: 1, y: 2},
  {id: 'b', x: 2, y: 3},
];
const common = {
  title: 'Readings',
  description: 'Readings by month',
  dataTableLabel: 'Values',
  emptyState: {title: 'Empty', description: 'No values'},
  invalidData: {title: 'Invalid', description: 'Invalid values'},
};
const axes = {
  xAxis: {accessor: 'x', label: 'X', scale: {type: 'linear'}},
  yAxis: {accessor: 'y', label: 'Y', scale: {type: 'linear'}},
} as const;
it.each(['line', 'scatter'])(
  'uses the requested aspect ratio for the %s plot geometry',
  (family) => {
    const {container} = render(
      family === 'line' ? (
        <LineChart
          {...common}
          {...axes}
          data={data}
          aspectRatio={3}
          series={[{id: 'value', label: 'Value', accessor: 'y'}]}
        />
      ) : (
        <ScatterChart
          {...common}
          {...axes}
          data={data}
          aspectRatio={3}
          idAccessor="id"
          labelAccessor="id"
          seriesAccessor={() => 'value'}
          series={[{id: 'value', label: 'Value'}]}
        />
      ),
    );
    const values = container
      .querySelector('[data-wcl-chart-svg]')!
      .getAttribute('viewBox')!
      .split(/\s+/)
      .map(Number);
    expect(values[2]! / values[3]!).toBeCloseTo(3);
  },
);
it('retains activation feedback through an equivalent data update', () => {
  const onActivate = vi.fn();
  const example = (rows: typeof data) => (
    <LineChart
      {...common}
      {...axes}
      data={rows}
      series={[{id: 'value', label: 'Value', accessor: 'y', showPoints: true}]}
      interaction={{target: 'point', getRowId: (r) => r.id, onActivate}}
    />
  );
  const result = render(example(data));
  const canvas = screen.getByRole('group', {name: 'Readings'});
  fireEvent.focus(canvas);
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(onActivate).toHaveBeenCalledOnce();
  expect(result.container.querySelector('[data-wcl-chart-activation]')).toBeTruthy();
  result.rerender(example(data.map((row) => ({...row}))));
  expect(result.container.querySelector('[data-wcl-chart-activation]')).toBeTruthy();
});

it.each(['keyboard', 'touch'] as const)(
  'keeps %s feedback on a point that becomes current immediately',
  (input) => {
    function Example() {
      const [current, setCurrent] = useState<string | null>(null);
      return (
        <ScatterChart
          {...common}
          {...axes}
          data={data}
          idAccessor="id"
          labelAccessor="id"
          legend={{label: 'Series'}}
          seriesAccessor={(row) => (row.id === current ? 'current' : 'value')}
          series={[
            {id: 'value', label: 'Value'},
            {id: 'current', label: 'Current'},
          ]}
          interaction={{onActivate: (event) => setCurrent(event.item.rowId)}}
        />
      );
    }
    const {container} = render(<Example />);
    if (input === 'keyboard') {
      const canvas = screen.getByRole('group', {name: 'Readings'});
      fireEvent.focus(canvas);
      fireEvent.keyDown(canvas, {key: 'Home'});
      fireEvent.keyDown(canvas, {key: 'Enter'});
    } else {
      const svg = container.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
      Object.defineProperty(svg, 'getBoundingClientRect', {
        value: () => ({left: 0, top: 0, width: 640, height: 360}),
      });
      const circle = container.querySelector('[data-point-id="a"] circle')!;
      const event = {
        clientX: Number(circle.getAttribute('cx')),
        clientY: Number(circle.getAttribute('cy')),
        pointerType: 'touch',
        pointerId: 1,
        isPrimary: true,
        button: 0,
      };
      fireEvent.pointerDown(svg, event);
      fireEvent.pointerUp(svg, event);
    }
    expect(container.querySelector('[data-point-id="a"][data-series-id="current"]')).toBeTruthy();
    expect(container.querySelector('[data-wcl-point-activation]')).toBeTruthy();
  },
);

it('cancels feedback when the activated record disappears', () => {
  const example = (rows: typeof data) => (
    <ScatterChart
      {...common}
      {...axes}
      data={rows}
      idAccessor="id"
      labelAccessor="id"
      series={[{id: 'value', label: 'Value'}]}
      interaction={{onActivate: () => {}}}
    />
  );
  const result = render(example(data));
  const canvas = screen.getByRole('group', {name: 'Readings'});
  fireEvent.focus(canvas);
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  expect(result.container.querySelector('[data-wcl-point-activation]')).toBeTruthy();
  result.rerender(example(data.slice(1)));
  expect(result.container.querySelector('[data-wcl-point-activation]')).toBeNull();
});

it.each(['line', 'scatter'])(
  'changes %s plot height without stretching its point marks',
  (family) => {
    const example = (aspectRatio: number) =>
      family === 'line' ? (
        <LineChart
          {...common}
          {...axes}
          data={data}
          aspectRatio={aspectRatio}
          series={[{id: 'value', label: 'Value', accessor: 'y', showPoints: true}]}
        />
      ) : (
        <ScatterChart
          {...common}
          {...axes}
          data={data}
          aspectRatio={aspectRatio}
          idAccessor="id"
          labelAccessor="id"
          series={[{id: 'value', label: 'Value'}]}
        />
      );
    const result = render(example(3));
    const region = () => result.container.querySelector('[data-wcl-chart-hit-region]')!;
    const radius = () =>
      result.container
        .querySelector(family === 'line' ? '[data-wcl-chart-point]' : '[data-point-id="a"] circle')!
        .getAttribute('r');
    const initialHeight = Number(region().getAttribute('height')),
      initialRadius = radius();
    result.rerender(example(1));
    expect(Number(region().getAttribute('height'))).toBeGreaterThan(initialHeight);
    expect(radius()).toBe(initialRadius);
  },
);
