import {ScatterChart, type ScatterChartLine, type PointChartActivation} from '../src/index.js';

interface Observation {
  readonly id: string;
  readonly label: string;
  readonly x: number;
  readonly y: number;
}
interface Sample {
  readonly key: string;
  readonly name: string;
  readonly temperature: number;
  readonly target: number;
}
const observations: readonly Observation[] = [{id: 'day', label: 'Monday', x: 12, y: 20}];
const samples: readonly Sample[] = [{key: 'target', name: 'Target', temperature: 10, target: 18}];
const line: ScatterChartLine<Sample> = {
  id: 'target',
  label: 'Target',
  data: samples,
  idAccessor: 'key',
  labelAccessor: 'name',
  xAccessor: 'temperature',
  yAccessor: 'target',
  onActivate: (event: PointChartActivation<Sample>) => {
    const sample: Sample = event.datum;
    void sample;
  },
};
export const separateDatasets = (
  <ScatterChart
    data={observations}
    idAccessor="id"
    labelAccessor="label"
    series={[{id: 'observed', label: 'Observed'}]}
    line={line}
    title="Energy"
    description="Actual and target"
    dataTableLabel="Values"
    emptyState={{title: 'Empty', description: 'No data'}}
    invalidData={{title: 'Invalid', description: 'Check data'}}
    legend={{label: 'Series'}}
    xAxis={{accessor: 'x', label: 'Temperature', scale: {type: 'linear'}}}
    yAxis={{accessor: 'y', label: 'Energy', scale: {type: 'linear'}}}
    interaction={{
      onActivate: (event) => {
        const observation: Observation = event.datum;
        // @ts-expect-error The observation callback does not receive line sample records.
        const sample: Sample = event.datum;
        void observation;
        void sample;
      },
    }}
  />
);
export const invalidSampleAccessor: ScatterChartLine<Sample> = {
  ...line,
  // @ts-expect-error Line accessors read the supplied sample type.
  xAccessor: 'x',
};
