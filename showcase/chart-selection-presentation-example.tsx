import {ChartFrame} from './chart-presentation.js';
import {useState} from 'react';
import {Button, LineChart, Stack, type ChartSelectionItem} from '../src/index.js';

const readings = [
  {id: 'jan', month: 'Jan', value: 24},
  {id: 'feb', month: 'Feb', value: 18},
  {id: 'mar', month: 'Mar', value: 21},
];
const labels = {
  instructions: 'Select a reading with click or Enter. Hold or Control-click to inspect it.',
  clear: 'Clear selected readings',
  empty: 'No readings selected',
  summary: (count: number) => `${count} readings selected`,
  item: (item: ChartSelectionItem) => readings.find((reading) => reading.id === item.rowId)!.month,
  hidden: (label: string) => `${label} (hidden)`,
};

export function ChartSelectionPresentationExample() {
  const [presentation, setPresentation] = useState<'panel' | 'controls'>('controls');
  const [selected, setSelected] = useState<readonly ChartSelectionItem[]>([
    {rowId: 'feb', seriesId: 'energy'},
  ]);
  const [inspection, setInspection] = useState('Select readings to compare them.');
  return (
    <Stack>
      <Button onPress={() => setPresentation(presentation === 'controls' ? 'panel' : 'controls')}>
        {presentation === 'controls' ? 'Use selection panel' : 'Use compact chart controls'}
      </Button>
      <p>
        The panel and compact controls share the selection. Open the count in compact mode for
        selected readings and interaction help.
      </p>
      <ChartFrame compact={false}>
        <LineChart
          title="Monthly energy review"
          description="Select months for review or activate a reading to inspect its value."
          dataTableLabel="Monthly readings"
          data={readings}
          series={[{id: 'energy', label: 'Energy', accessor: 'value', showPoints: true}]}
          xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
          yAxis={{label: 'Energy', unit: 'kWh/m²', scale: {type: 'linear'}}}
          emptyState={{title: 'No readings', description: 'Add monthly readings.'}}
          invalidData={{title: 'Invalid readings', description: 'Check the supplied values.'}}
          interaction={{
            target: 'point',
            getRowId: (row) => row.id,
            selection: {
              presentation,
              selectedItems: selected,
              onSelectionChange: setSelected,
              labels,
            },
            onActivate: (event) =>
              setInspection(`${event.datum.month}: ${event.datum.value} kWh/m².`),
          }}
        />
      </ChartFrame>
      <p role="status">{inspection}</p>
    </Stack>
  );
}
