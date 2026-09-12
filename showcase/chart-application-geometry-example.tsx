import {useState} from 'react';
import {Button, InlineGroup, LineChart, ScatterChart, Stack} from '../src/index.js';

const readings = [
  {id: 'elm', name: 'Elm Hall', area: 2400, energy: 188},
  {id: 'birch', name: 'Birch Hall', area: 5800, energy: 175},
  {id: 'cedar', name: 'Cedar Hall', area: 9400, energy: 151},
];

export function ChartApplicationGeometryExample({kind}: {readonly kind: 'line' | 'scatter'}) {
  const [aspectRatio, setAspectRatio] = useState(3);
  const common = {
    data: readings,
    aspectRatio,
    description: 'Changing proportions reshapes the plot.',
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
          title="Building energy proportions"
          idAccessor="id"
          labelAccessor="name"
          legend={{label: 'Building status'}}
          series={[{id: 'buildings', label: 'Buildings'}]}
        />
      ) : (
        <LineChart
          {...common}
          title="Energy reading proportions"
          series={[{id: 'energy', label: 'Energy', accessor: 'energy', showPoints: true}]}
        />
      )}
    </Stack>
  );
}
