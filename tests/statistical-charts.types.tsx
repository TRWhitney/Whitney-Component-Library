import {BoxPlot, BubbleChart, Histogram, ScatterChart} from '../src/index.js';

interface PointDatum {
  readonly id: string;
  readonly label: string;
  readonly series: string;
  readonly size: number;
  readonly x: number;
  readonly y: number;
}

const points: readonly PointDatum[] = [
  {id: 'north-1', label: 'North Monday', series: 'north', size: 42, x: 18, y: 28},
];
const common = {
  dataTableLabel: 'Statistical data',
  description: 'Recorded observations.',
  emptyState: {description: 'Add observations.', title: 'No observations'},
  invalidData: {description: 'Correct observations.', title: 'Invalid observations'},
  title: 'Observations',
} as const;
const series = [{id: 'north', label: 'North loop'}] as const;

export const scatter = (
  <ScatterChart
    {...common}
    data={points}
    idAccessor="id"
    labelAccessor="label"
    series={series}
    legend={{label: 'Groups'}}
    visibilityLabels={{
      hidden: 'Hidden',
      hideSeries: (s) => `Hide ${s}`,
      showSeries: (s) => `Show ${s}`,
      showAll: 'Show all',
      allHidden: {title: 'All hidden', description: 'Restore a group.'},
    }}
    seriesAccessor="series"
    xAxis={{accessor: 'x', label: 'Temperature', scale: {type: 'linear'}}}
    yAxis={{accessor: 'y', label: 'Demand', scale: {type: 'logarithmic'}}}
  />
);

export const bubble = (
  <BubbleChart
    {...common}
    data={points}
    idAccessor="id"
    labelAccessor="label"
    magnitude={{accessor: 'size', label: 'Stored energy', unit: 'MWh'}}
    series={series}
    legend={{label: 'Groups'}}
    visibilityLabels={{
      hidden: 'Hidden',
      hideSeries: (s) => `Hide ${s}`,
      showSeries: (s) => `Show ${s}`,
      showAll: 'Show all',
      allHidden: {title: 'All hidden', description: 'Restore a group.'},
    }}
    xAxis={{accessor: 'x', label: 'Temperature', scale: {type: 'linear'}}}
    yAxis={{accessor: 'y', label: 'Demand', scale: {type: 'linear'}}}
  />
);

export const rawHistogram = (
  <Histogram
    {...common}
    data={points}
    distribution={{accessor: 'x', kind: 'raw', thresholds: 5}}
    xAxis={{label: 'Temperature', scale: {type: 'linear'}}}
    yAxis={{label: 'Observations', scale: {type: 'linear'}}}
  />
);

interface SummaryDatum {
  readonly group: string;
  readonly lower: number;
  readonly median: number;
  readonly outliers: readonly number[];
  readonly q1: number;
  readonly q3: number;
  readonly upper: number;
}

const summaries: readonly SummaryDatum[] = [
  {group: 'north', lower: 2, median: 5, outliers: [11], q1: 4, q3: 7, upper: 9},
];

export const summarizedBoxPlot = (
  <BoxPlot
    {...common}
    data={summaries}
    distribution={{
      kind: 'summary',
      lowerWhiskerAccessor: 'lower',
      medianAccessor: 'median',
      outliersAccessor: 'outliers',
      q1Accessor: 'q1',
      q3Accessor: 'q3',
      upperWhiskerAccessor: 'upper',
      whisker: 'tukey',
    }}
    groupAccessor="group"
    visibilityLabels={{
      hidden: 'Hidden',
      hideSeries: (s) => `Hide ${s}`,
      showSeries: (s) => `Show ${s}`,
      showAll: 'Show all',
      allHidden: {title: 'All hidden', description: 'Restore a group.'},
    }}
    groups={series}
    xAxis={{label: 'Loop'}}
    yAxis={{label: 'Recovery', scale: {type: 'linear'}}}
  />
);

export const invalidPointAxis = (
  <ScatterChart
    {...common}
    data={points}
    idAccessor="id"
    labelAccessor="label"
    series={series}
    xAxis={{
      // @ts-expect-error Point axes require numeric accessors.
      accessor: 'label',
      label: 'Label',
      scale: {type: 'linear'},
    }}
    yAxis={{accessor: 'y', label: 'Demand', scale: {type: 'linear'}}}
  />
);

export const invalidBubbleMagnitude = (
  <BubbleChart
    {...common}
    data={points}
    idAccessor="id"
    labelAccessor="label"
    // @ts-expect-error Bubble magnitude must resolve to a number.
    magnitude={{accessor: 'label', label: 'Magnitude'}}
    series={series}
    xAxis={{accessor: 'x', label: 'Temperature', scale: {type: 'linear'}}}
    yAxis={{accessor: 'y', label: 'Demand', scale: {type: 'linear'}}}
  />
);

export const invalidHistogramScale = (
  <Histogram
    {...common}
    data={points}
    distribution={{accessor: 'x', kind: 'raw'}}
    xAxis={{
      label: 'Temperature',
      // @ts-expect-error Histogram axes require linear scales.
      scale: {type: 'normalized'},
    }}
    yAxis={{label: 'Observations', scale: {type: 'linear'}}}
  />
);

export const invalidBoxOutliers = (
  <BoxPlot
    {...common}
    data={summaries}
    distribution={{
      kind: 'summary',
      lowerWhiskerAccessor: 'lower',
      medianAccessor: 'median',
      // @ts-expect-error Summary outliers require a numeric array accessor.
      outliersAccessor: 'median',
      q1Accessor: 'q1',
      q3Accessor: 'q3',
      upperWhiskerAccessor: 'upper',
      whisker: 'min-max',
    }}
    groupAccessor="group"
    groups={series}
    xAxis={{label: 'Loop'}}
    yAxis={{label: 'Recovery', scale: {type: 'linear'}}}
  />
);
