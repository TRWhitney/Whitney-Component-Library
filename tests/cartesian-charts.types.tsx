import {
  AreaChart,
  BarChart,
  CartesianChart,
  ColumnChart,
  LineChart,
  type ChartAccessor,
  type ChartColor,
  type ChartScale,
} from '../src/index.js';

interface Datum {
  readonly category: string;
  readonly label: string;
  readonly value: number;
  readonly when: Date;
}

const data: readonly Datum[] = [{category: 'A', label: 'Alpha', value: 4, when: new Date(0)}];
const numericAccessor: ChartAccessor<Datum, number> = 'value';
const derivedAccessor: ChartAccessor<Datum, number> = (datum) => datum.value * 2;
const color: ChartColor = 'series-3';
const scale: ChartScale<number> = {type: 'linear'};
const common = {
  data,
  dataTableLabel: 'Values data',
  description: 'Values by category.',
  emptyState: {description: 'Add values.', title: 'No values'},
  invalidData: {description: 'Correct invalid values.', title: 'Invalid values'},
  series: [{accessor: numericAccessor, color, id: 'value', label: 'Value'}],
  title: 'Values',
} as const;

export const lineChart = (
  <LineChart
    {...common}
    legend={{label: 'Value series'}}
    series={[...common.series, {accessor: derivedAccessor, id: 'derived', label: 'Derived'}]}
    xAxis={{accessor: 'when', label: 'When', scale: {type: 'time'}}}
    yAxis={{label: 'Value', scale}}
  />
);

export const areaChart = (
  <AreaChart
    {...common}
    stacking="stacked"
    xAxis={{accessor: 'category', label: 'Category', scale: {type: 'categorical'}}}
    yAxis={{label: 'Value', scale: {type: 'linear'}}}
  />
);

export const columnChart = (
  <ColumnChart
    {...common}
    layout="grouped"
    xAxis={{accessor: 'category', label: 'Category', scale: {type: 'categorical'}}}
    yAxis={{label: 'Value', scale: {type: 'linear'}}}
  />
);

export const barChart = (
  <BarChart
    {...common}
    layout="stacked"
    xAxis={{label: 'Value', scale: {type: 'linear'}}}
    yAxis={{accessor: 'category', label: 'Category', scale: {type: 'categorical'}}}
  />
);

export const mixedChart = (
  <CartesianChart
    {...common}
    series={[{...common.series[0], kind: 'line'}]}
    xAxis={{accessor: 'label', label: 'Label', scale: {type: 'categorical'}}}
    yAxis={{label: 'Value', scale: {type: 'linear'}}}
  />
);

export const invalidAccessor = (
  <LineChart
    {...common}
    series={[
      {
        // @ts-expect-error Series accessors must resolve to numeric values.
        accessor: 'label',
        id: 'label',
        label: 'Label',
      },
    ]}
    xAxis={{accessor: 'category', label: 'Category', scale: {type: 'categorical'}}}
    yAxis={{label: 'Value', scale: {type: 'linear'}}}
  />
);

export const unsupportedScale = (
  <LineChart
    {...common}
    xAxis={{
      accessor: 'category',
      label: 'Category',
      // @ts-expect-error Chart scales use the bounded public vocabulary.
      scale: {type: 'symlog'},
    }}
    yAxis={{label: 'Value', scale: {type: 'linear'}}}
  />
);

export const invalidNormalizedLine = (
  <LineChart
    {...common}
    xAxis={{accessor: 'category', label: 'Category', scale: {type: 'categorical'}}}
    yAxis={{
      label: 'Value',
      // @ts-expect-error Line charts do not infer normalization from source values.
      scale: {type: 'normalized'},
    }}
  />
);

export const invalidLogarithmicArea = (
  <AreaChart
    {...common}
    xAxis={{accessor: 'category', label: 'Category', scale: {type: 'categorical'}}}
    yAxis={{
      label: 'Value',
      // @ts-expect-error Area geometry requires a representable zero baseline.
      scale: {type: 'logarithmic'},
    }}
  />
);

export const invalidNormalizedCategory = (
  <LineChart
    {...common}
    xAxis={{
      accessor: 'value',
      label: 'Value',
      // @ts-expect-error Normalization belongs to a normalized value layout, not a data axis.
      scale: {type: 'normalized'},
    }}
    yAxis={{label: 'Value', scale: {type: 'linear'}}}
  />
);

export const tooManySeries = (
  <LineChart
    {...common}
    legend={{label: 'Value series'}}
    // @ts-expect-error The visual vocabulary provides six distinct series identities.
    series={[
      {accessor: 'value', id: 'one', label: 'One'},
      {accessor: 'value', id: 'two', label: 'Two'},
      {accessor: 'value', id: 'three', label: 'Three'},
      {accessor: 'value', id: 'four', label: 'Four'},
      {accessor: 'value', id: 'five', label: 'Five'},
      {accessor: 'value', id: 'six', label: 'Six'},
      {accessor: 'value', id: 'seven', label: 'Seven'},
    ]}
    xAxis={{accessor: 'category', label: 'Category', scale: {type: 'categorical'}}}
    yAxis={{label: 'Value', scale: {type: 'linear'}}}
  />
);

export const interactiveLine = (
  <LineChart<Datum, Date>
    {...common}
    xAxis={{accessor: 'when', label: 'When', scale: {type: 'time'}}}
    yAxis={{label: 'Value', scale: {type: 'linear'}}}
    interaction={{
      target: 'point',
      getRowId: (datum) => datum.category,
      onActivate: (activation) => {
        const date: Date = activation.category;
        const datum: Datum = activation.datum;
        void date;
        void datum;
        // @ts-expect-error Activation contains source values, not a DOM/renderer target.
        void activation.target;
      },
    }}
  />
);

const selectionLabels = {
  instructions: 'Click selects',
  clear: 'Clear',
  empty: 'None',
  summary: (count: number) => String(count),
  item: (item: import('../src/index.js').ChartSelectionItem) => item.rowId,
  hidden: (label: string) => label,
};
// @ts-expect-error Controlled selection requires its change callback.
export const missingSelectionCallback: import('../src/index.js').ChartSelection = {
  labels: selectionLabels,
  selectedItems: [],
};
// @ts-expect-error Controlled and uncontrolled selection cannot be combined.
export const mixedSelectionOwnership: import('../src/index.js').ChartSelection = {
  labels: selectionLabels,
  selectedItems: [],
  defaultSelectedItems: [],
  onSelectionChange: () => {},
};
