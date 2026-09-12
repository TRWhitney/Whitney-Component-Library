import {useState} from 'react';
import {Button, InlineGroup, LineChart, ScatterChart, Stack} from '../src/index.js';

const readings = [
  {id: 'elm', name: 'Elm Hall', area: 2400, energy: 188},
  {id: 'birch', name: 'Birch Hall', area: 5800, energy: 175},
  {id: 'cedar', name: 'Cedar Hall', area: 9400, energy: 151},
];

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
      'Changing proportions reshapes the plot. Activating a reading inspects it immediately.',
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
      {kind === 'scatter' ? (
        <ScatterChart
          {...common}
          title="Inspect building energy"
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
      <p role="status">{inspection}</p>
    </Stack>
  );
}
