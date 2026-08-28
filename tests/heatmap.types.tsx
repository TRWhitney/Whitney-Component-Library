import {Heatmap, type HeatmapProps} from '../src/index.js';

interface Reading {
  readonly hour: string;
  readonly location: string;
  readonly note: string;
  readonly value: number;
}

const common: Omit<HeatmapProps<Reading>, 'data'> = {
  columnAccessor: 'hour',
  columns: [{id: 'morning', label: 'Morning'}],
  dataTableLabel: 'Temperature readings',
  description: 'Temperature by location and time.',
  emptyState: {description: 'Record a reading to begin.', title: 'No readings'},
  invalidData: {description: 'Correct invalid readings.', title: 'Invalid readings'},
  labels: {
    colorKey: 'Temperature scale',
    column: 'Time',
    missing: 'No reading',
    row: 'Location',
    scrollRegion: 'Temperature grid',
  },
  rowAccessor: (reading) => reading.location,
  rows: [{id: 'north', label: 'North room'}],
  scale: {
    colors: ['#2878ff', '#d14f00'],
    domain: [-10, 30],
    midpoint: 10,
    type: 'two-sided',
  },
  title: 'Room temperature',
  value: {
    accessor: 'value',
    formatValue: (value) => value.toFixed(1),
    label: 'Temperature',
    unit: '°C',
  },
};

export const heatmap = (
  <Heatmap
    {...common}
    data={[{hour: 'morning', location: 'north', note: 'Calibrated', value: 12}]}
    minimumSize={{height: 260, width: 340}}
  />
);

export const invalidValueAccessor = (
  <Heatmap
    {...common}
    data={[]}
    value={{
      // @ts-expect-error Heatmap values must resolve to numbers.
      accessor: 'note',
      label: 'Temperature',
    }}
  />
);

export const invalidCoordinateAccessor = (
  <Heatmap
    {...common}
    // @ts-expect-error Heatmap coordinates must resolve to strings.
    columnAccessor="value"
    data={[]}
  />
);

export const invalidScale = (
  <Heatmap
    {...common}
    data={[]}
    // @ts-expect-error Two-sided scales require a declared midpoint.
    scale={{colors: ['#2878ff', '#d14f00'], type: 'two-sided'}}
  />
);

export const missingSequentialColor = (
  <Heatmap
    {...common}
    data={[]}
    // @ts-expect-error Sequential scales require one color.
    scale={{type: 'sequential'}}
  />
);

export const invalidTwoSidedColorCount = (
  <Heatmap
    {...common}
    data={[]}
    // @ts-expect-error Two-sided scales require low and high colors.
    scale={{colors: ['#2878ff'], midpoint: 0, type: 'two-sided'}}
  />
);

export const rendererProp = (
  <Heatmap
    {...common}
    data={[]}
    // @ts-expect-error Consumers cannot replace the Heatmap renderer.
    renderer={() => null}
  />
);
