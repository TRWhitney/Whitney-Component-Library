import {ChartFrame} from './chart-presentation.js';
import {useState} from 'react';
import {
  Button,
  InlineGroup,
  LineChart,
  ScatterChart,
  Stack,
  type ChartRectangularExplorationLabels,
} from '../src/index.js';

const readings = [
  {id: 'elm', name: 'Elm Hall', area: 2400, energy: 188},
  {id: 'birch', name: 'Birch Hall', area: 5800, energy: 175},
  {id: 'cedar', name: 'Cedar Hall', area: 9400, energy: 151},
];

const explorationLabels: ChartRectangularExplorationLabels<number, number> = {
  overview: 'Boundary overview',
  closeOverview: 'Close boundary overview',
  done: 'Done',
  reset: 'Fit buildings',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  panLeft: 'Pan left',
  panRight: 'Pan right',
  panUp: 'Pan up',
  panDown: 'Pan down',
  window: 'Building range',
  instructions: 'Drag the window or a corner to change the visible range.',
  corner: (corner) => `Resize ${corner} corner`,
  range: ({x, y}) =>
    `${Math.round(x[0])}–${Math.round(x[1])} m², ${Math.round(y[0])}–${Math.round(y[1])} kWh/m²`,
};

export function ChartApplicationGeometryExample({kind}: {readonly kind: 'line' | 'scatter'}) {
  const [aspectRatio, setAspectRatio] = useState(3);
  const [current, setCurrent] = useState('elm');
  const [inspection, setInspection] = useState('Activate a reading to inspect its building.');
  const [count, setCount] = useState(0);
  const inspect = (id: string) => {
    const reading = readings.find((row) => row.id === id)!;
    setCurrent(id);
    setCount((value) => value + 1);
    setInspection(`${reading.name}: ${reading.energy} kWh/m². Inspection ${count + 1}.`);
  };
  const common = {
    data: readings,
    aspectRatio,
    description:
      kind === 'scatter'
        ? 'Boundary marks stay inside the axes at full extent. Their tick positions retain the supplied values. Activate a reading to inspect it.'
        : 'Changing proportions reshapes the plot. Activating a reading inspects it immediately.',
    dataTableLabel: 'Building readings',
    emptyState: {title: 'No readings', description: 'Add a building reading.'},
    invalidData: {title: 'Invalid readings', description: 'Check the supplied building readings.'},
    xAxis: {accessor: 'area', label: 'Floor area', unit: 'm²', scale: {type: 'linear'}},
    yAxis: {accessor: 'energy', label: 'Energy', unit: 'kWh/m²', scale: {type: 'linear'}},
  } as const;
  return (
    <Stack>
      <InlineGroup>
        <Button onPress={() => setAspectRatio(3)}>Wide plot</Button>
        <Button onPress={() => setAspectRatio(1)}>Square plot</Button>
      </InlineGroup>
      <ChartFrame compact={false}>
        {kind === 'scatter' ? (
          <ScatterChart
            {...common}
            title="Inspect building energy"
            xAxis={{...common.xAxis, scale: {type: 'linear', domain: [2400, 9400]}}}
            yAxis={{...common.yAxis, scale: {type: 'linear', domain: [151, 188]}}}
            exploration={{labels: explorationLabels}}
            idAccessor="id"
            labelAccessor="name"
            legend={{label: 'Building status'}}
            seriesAccessor={(row) => (row.id === current ? 'current' : 'buildings')}
            series={[
              {id: 'buildings', label: 'Buildings'},
              {id: 'current', label: 'Current'},
            ]}
            interaction={{onActivate: (event) => inspect(event.item.rowId)}}
          />
        ) : (
          <LineChart
            {...common}
            title="Inspect energy readings"
            series={[{id: 'energy', label: 'Energy', accessor: 'energy', showPoints: true}]}
            interaction={{
              target: 'point',
              getRowId: (row) => row.id,
              onActivate: (event) => inspect(event.item.rowId),
            }}
          />
        )}
      </ChartFrame>
      <p role="status">{inspection}</p>
    </Stack>
  );
}
