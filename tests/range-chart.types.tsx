import {CartesianChart, type ChartRangeSeries, type ChartInteraction} from '../src/index.js';
type Reading = {
  id: string;
  month: string;
  measured: number;
  low: number | null;
  high: number | undefined;
};
const range: ChartRangeSeries<Reading> = {
  id: 'expected',
  label: 'Expected',
  kind: 'range',
  lowerAccessor: 'low',
  upperAccessor: 'high',
};
const interaction: ChartInteraction<Reading, string> = {
  target: 'point',
  getRowId: (r) => r.id,
  onActivate: (event) => {
    event.values.forEach((v) => v.value.toFixed());
    event.ranges?.forEach((r) => {
      r.lower.toFixed();
      r.upper.toFixed();
    });
    event.datum.measured.toFixed();
  },
};
export const example = (
  <CartesianChart<Reading, string>
    data={[]}
    title="Temperature"
    description="Measured and expected"
    dataTableLabel="Values"
    emptyState={{title: 'Empty', description: 'Add readings'}}
    invalidData={{title: 'Invalid', description: 'Check readings'}}
    legend={{label: 'Series'}}
    series={[{id: 'measured', label: 'Measured', kind: 'line', accessor: 'measured'}, range]}
    xAxis={{label: 'Month', accessor: 'month', scale: {type: 'categorical'}}}
    yAxis={{label: 'Temperature', scale: {type: 'linear'}}}
    interaction={interaction}
  />
);
export const wrong: ChartRangeSeries<Reading> = {
  ...range,
  // @ts-expect-error Range endpoints must be numeric accessors.
  lowerAccessor: 'month',
};
// @ts-expect-error A range requires both bounds.
export const incomplete: ChartRangeSeries<Reading> = {
  id: 'range',
  label: 'Range',
  kind: 'range',
  lowerAccessor: 'low',
};
