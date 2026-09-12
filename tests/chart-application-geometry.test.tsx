import {cleanup, render} from '@testing-library/react';
import {afterEach, expect, it} from 'vitest';
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
