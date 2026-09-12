import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {LineChart, type ChartSelectionItem} from '../src/index.js';
afterEach(cleanup);
const labels = {
  instructions: 'Click selects. Hold activates.',
  clear: 'Clear picks',
  empty: 'No picks',
  summary: (n: number) => `${n} picked`,
  item: (item: ChartSelectionItem) => item.rowId,
  hidden: (label: string) => `${label} hidden`,
};
it('chooses compact chart controls instead of a simultaneous selection panel', () => {
  const onSelectionChange = vi.fn();
  const result = render(
    <LineChart
      title="Trend"
      description="Readings"
      dataTableLabel="Values"
      data={[{id: 'a', x: 1, y: 2}]}
      series={[{id: 'v', label: 'Value', accessor: 'y'}]}
      xAxis={{accessor: 'x', label: 'X', scale: {type: 'linear'}}}
      yAxis={{label: 'Y', scale: {type: 'linear'}}}
      emptyState={{title: 'Empty', description: 'Empty'}}
      invalidData={{title: 'Invalid', description: 'Invalid'}}
      interaction={{
        target: 'point',
        getRowId: (r) => r.id,
        selection: {
          presentation: 'controls',
          selectedItems: [{rowId: 'a', seriesId: 'v'}],
          onSelectionChange,
          labels,
        },
      }}
    />,
  );
  expect(screen.queryByRole('list')).toBeNull();
  expect(
    result.container.querySelector('[data-wcl-chart-selection][data-presentation="controls"]'),
  ).toBeTruthy();
  expect(
    result.container.querySelector('[data-wcl-chart-selection][data-presentation="panel"]'),
  ).toBeNull();
  fireEvent.click(screen.getByRole('button', {name: 'Clear picks'}));
  expect(onSelectionChange).toHaveBeenLastCalledWith([]);
});
