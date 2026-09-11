import {cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {Heatmap} from '../src/index.js';
import {chartMotionClock} from './chart-motion-clock.js';
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
const props = {
  data: [{row: 'a', column: 'x', value: 20}],
  rows: [{id: 'a', label: 'A'}],
  columns: [{id: 'x', label: 'X'}],
  rowAccessor: 'row',
  columnAccessor: 'column',
  value: {accessor: 'value', label: 'Value'},
  scale: {type: 'sequential', color: '#2878ff', domain: [0, 100]},
  title: 'Readings',
  description: 'Recorded values',
  dataTableLabel: 'All readings',
  labels: {
    row: 'Row',
    column: 'Column',
    colorKey: 'Value',
    missing: 'Missing',
    scrollRegion: 'Grid',
  },
  emptyState: {title: 'Empty', description: 'Add data'},
  invalidData: {title: 'Invalid', description: 'Check data'},
} as const;
it('changes cell intensity over time without delaying the recorded value or requiring visibility controls', () => {
  const clock = chartMotionClock();
  const {container, rerender} = render(<Heatmap {...props} />);
  const intensity = () =>
    parseFloat(
      container
        .querySelector<HTMLElement>('[data-wcl-heatmap-cell]')!
        .style.getPropertyValue('--wcl-heatmap-intensity'),
    );
  const initial = intensity();
  rerender(<Heatmap {...props} data={[{row: 'a', column: 'x', value: 80}]} />);
  expect(intensity()).toBeCloseTo(initial);
  expect(within(screen.getByRole('table')).getByText('80')).toBeTruthy();
  clock.advance(120);
  const middle = intensity();
  expect(middle).toBeGreaterThan(initial);
  clock.advance(240);
  expect(intensity()).toBeGreaterThan(middle);
});

it('retargets cell color from the displayed intensity and settles reduced motion immediately', () => {
  const clock = chartMotionClock();
  const {container, rerender} = render(<Heatmap {...props} />);
  const intensity = () =>
    parseFloat(
      container
        .querySelector<HTMLElement>('[data-wcl-heatmap-cell]')!
        .style.getPropertyValue('--wcl-heatmap-intensity'),
    );
  rerender(<Heatmap {...props} data={[{row: 'a', column: 'x', value: 80}]} />);
  clock.advance(120);
  const interrupted = intensity();
  rerender(<Heatmap {...props} data={[{row: 'a', column: 'x', value: 10}]} />);
  expect(intensity()).toBeCloseTo(interrupted);
  clock.advance(180);
  expect(intensity()).toBeLessThan(interrupted);
  clock.reduce();
  expect(intensity()).toBeCloseTo(19.2);
  expect(clock.pending()).toBe(0);
});

it('reports the latest supplied record during color motion and retains selection across frames', () => {
  const clock = chartMotionClock();
  const onActivate = vi.fn();
  const interaction = {
    onActivate,
    selection: {
      labels: {
        instructions: 'Select or activate a cell.',
        clear: 'Clear',
        empty: 'None',
        summary: (count: number) => `${count} selected`,
        item: () => 'A X',
        hidden: (label: string) => label,
      },
    },
  };
  const {container, rerender} = render(<Heatmap {...props} interaction={interaction} />);
  const canvas = container.querySelector('[data-wcl-heatmap-canvas]')!;
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'Enter'});
  const datum = {row: 'a', column: 'x', value: 80};
  rerender(<Heatmap {...props} data={[datum]} interaction={interaction} />);
  clock.advance(120);
  fireEvent.keyDown(canvas, {key: 'Home'});
  fireEvent.keyDown(canvas, {key: 'Enter', ctrlKey: true});
  expect(onActivate).toHaveBeenLastCalledWith(expect.objectContaining({datum, value: 80}));
  expect(container.querySelector('[data-wcl-heatmap-cell][data-selected]')).not.toBeNull();
  clock.advance(240);
  expect(container.querySelector('[data-wcl-heatmap-cell][data-selected]')).not.toBeNull();
});

it('settles missing topology changes rather than fading a recorded value into a missing cell', () => {
  const clock = chartMotionClock();
  const {container, rerender} = render(<Heatmap {...props} />);
  rerender(<Heatmap {...props} data={[{row: 'a', column: 'x', value: 80}]} />);
  clock.advance(120);
  rerender(<Heatmap {...props} data={props.data.slice(0, 0)} />);
  expect(container.querySelector('[data-wcl-heatmap-cell][data-missing]')).not.toBeNull();
  expect(clock.pending()).toBe(0);
});

it('moves the fitted color-key limits with the cells even without visibility controls', () => {
  const clock = chartMotionClock();
  const columns = [
    {id: 'x', label: 'X'},
    {id: 'y', label: 'Y'},
  ];
  const scale = {type: 'sequential', color: '#2878ff'} as const;
  const {container, rerender} = render(
    <Heatmap
      {...props}
      scale={scale}
      columns={columns}
      data={[
        {row: 'a', column: 'x', value: 20},
        {row: 'a', column: 'y', value: 40},
      ]}
    />,
  );
  const key = () => container.querySelector('[data-wcl-heatmap-key-numeric]')!;
  rerender(
    <Heatmap
      {...props}
      scale={scale}
      columns={columns}
      data={[
        {row: 'a', column: 'x', value: 60},
        {row: 'a', column: 'y', value: 100},
      ]}
    />,
  );
  expect(within(key() as HTMLElement).getByText('20')).toBeTruthy();
  expect(within(key() as HTMLElement).getByText('40')).toBeTruthy();
  clock.advance(120);
  expect(within(key() as HTMLElement).getByText('55')).toBeTruthy();
  expect(within(key() as HTMLElement).getByText('92.5')).toBeTruthy();
  clock.advance(240);
  expect(within(key() as HTMLElement).getByText('60')).toBeTruthy();
  expect(within(key() as HTMLElement).getByText('100')).toBeTruthy();
});
