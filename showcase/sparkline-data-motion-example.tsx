import {ChartFrame, ChartSizeControl} from './chart-presentation.js';
import {useState} from 'react';
import {Button, InlineGroup, Sparkline, Stack} from '../src/index.js';
const original = [42, 56, 48, 71, 59, 85, 66, 78, 52, 67, 73, 61];
const updated = [63, 42, 56, 92, 45, 77, 87, 64, 60, 88, 59, 69];
export function SparklineDataMotionExample() {
  const [changed, setChanged] = useState(false);
  const [compact, setCompact] = useState(false);
  const [details, setDetails] = useState('');
  const data = (changed ? updated : original).map((value, index) => ({
    id: `day-${index + 1}`,
    day: `Day ${index + 1}`,
    value,
  }));
  return (
    <Stack gap="regular">
      <p>
        Select a reading, then update the values. The minimum and maximum markers fade between
        readings when the extremes change.
      </p>
      <ChartSizeControl compact={compact} onChange={setCompact} />
      <InlineGroup gap="tight" wrap>
        <Button
          variant="secondary"
          onPress={() => {
            setChanged((value) => !value);
            setDetails('');
          }}
        >
          Update values
        </Button>
        <Button
          variant="quiet"
          onPress={() => {
            setChanged(false);
            setDetails('');
          }}
        >
          Reset data
        </Button>
      </InlineGroup>
      <ChartFrame compact={compact}>
        <Sparkline<(typeof data)[number], string>
          data={data}
          title="Daily energy demand"
          description="Twelve recorded days, on a shared 0 to 110 MWh scale."
          dataTableLabel="Current daily readings"
          emptyState={{title: 'No readings', description: 'Record demand to begin.'}}
          invalidData={{title: 'Invalid demand', description: 'Correct the recorded values.'}}
          labels={{
            first: 'First',
            last: 'Last',
            lowest: 'Lowest',
            highest: 'Highest',
            missing: 'No reading',
          }}
          position={{accessor: 'day', label: 'Day', scale: {type: 'categorical'}}}
          value={{accessor: 'value', label: 'Demand', unit: 'MWh'}}
          valueRange={[0, 110]}
          minimumSize={{width: 240, height: 64}}
          interaction={{
            getRowId: (row) => row.id,
            onActivate: ({position, value}) => setDetails(`${position}: ${value} MWh.`),
            selection: {
              labels: {
                instructions:
                  'Tap to select. Drag to replace selection. Control/Command-click or hold to open details.',
                clear: 'Clear selection',
                empty: 'Nothing selected',
                summary: (count) => `${count} ${count === 1 ? 'reading' : 'readings'} selected`,
                item: (item) => data.find((row) => row.id === item.rowId)?.day ?? item.rowId,
                hidden: (label) => `${label} (hidden)`,
              },
            },
          }}
        />
      </ChartFrame>
      <p aria-live="polite">{details || 'Open a reading to see its current value here.'}</p>
    </Stack>
  );
}
