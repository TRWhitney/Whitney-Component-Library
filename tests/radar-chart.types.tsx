import {RadarChart, type RadarChartDimensions} from '../src/index.js';

interface Profile {
  readonly color?: 'series-2' | 'success';
  readonly id: string;
  readonly label: string;
  readonly range?: number;
  readonly reliability?: number;
  readonly speed?: number;
}

const dimensions: RadarChartDimensions<Profile> = [
  {accessor: 'speed', id: 'speed', label: 'Speed'},
  {accessor: (profile) => profile.range, id: 'range', label: 'Range'},
  {accessor: 'reliability', id: 'reliability', label: 'Reliability'},
];
const oneProfile: readonly [Profile] = [{id: 'courier', label: 'Courier', speed: 5}];
const common = {
  dataTableLabel: 'Vehicle profile data',
  description: 'Comparable vehicle scores.',
  dimensions,
  emptyState: {description: 'Choose vehicles with recorded scores.', title: 'No scores'},
  idAccessor: 'id',
  invalidData: {description: 'Correct invalid scores.', title: 'Invalid scores'},
  labelAccessor: (profile: Profile) => profile.label,
  labels: {dimension: 'Quality'},
  legend: {label: 'Vehicles'},
  title: 'Vehicle profiles',
  value: {formatValue: (value: number) => value.toFixed(1), label: 'Score', unit: 'points'},
} as const;

export const radarChart = (
  <RadarChart
    {...common}
    colorAccessor="color"
    data={[
      {id: 'courier', label: 'Courier', range: 4, reliability: 3, speed: 5},
      {color: 'success', id: 'scout', label: 'Scout', range: 5, speed: 2},
    ]}
    minimumSize={{height: 280, width: 320}}
    overflow="scroll"
  />
);

export const tooFewDimensions = (
  <RadarChart
    {...common}
    // @ts-expect-error RadarChart requires at least three dimensions.
    dimensions={dimensions.slice(0, 2)}
    data={oneProfile}
  />
);

export const tooManySeries = (
  <RadarChart
    {...common}
    // @ts-expect-error RadarChart supports at most six series.
    data={[
      {id: '1', label: 'One'},
      {id: '2', label: 'Two'},
      {id: '3', label: 'Three'},
      {id: '4', label: 'Four'},
      {id: '5', label: 'Five'},
      {id: '6', label: 'Six'},
      {id: '7', label: 'Seven'},
    ]}
  />
);

export const invalidDimensionAccessor = (
  <RadarChart
    {...common}
    data={oneProfile}
    dimensions={[
      {accessor: 'speed', id: 'speed', label: 'Speed'},
      {accessor: 'range', id: 'range', label: 'Range'},
      // @ts-expect-error Radar dimensions must resolve to numbers.
      {accessor: 'label', id: 'label', label: 'Label'},
    ]}
  />
);

export const rendererProp = (
  <RadarChart
    {...common}
    data={oneProfile}
    // @ts-expect-error Consumers cannot replace the RadarChart renderer.
    renderer={() => null}
  />
);
