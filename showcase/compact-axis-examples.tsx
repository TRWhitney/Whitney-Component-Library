import {useState} from 'react';
import {BoxPlot, LineChart, ScatterChart, Stack, Switch} from '../src/index.js';

const months = Array.from({length: 12}, (_, index) => ({
  date: new Date(Date.UTC(2026, index, 1)),
  value: 40 + index * 3,
}));
const points = months.map((row, index) => ({
  id: String(index),
  x: 100000 + index * 1000,
  y: row.value,
}));
const groups = [
  {id: '0', label: 'Turbine loop 1'},
  {id: '1', label: 'Turbine loop 2'},
  {id: '2', label: 'Turbine loop 3'},
  {id: '3', label: 'Turbine loop 4'},
  {id: '4', label: 'Turbine loop 5'},
  {id: '5', label: 'Turbine loop 6'},
] as const;
const samples = groups.flatMap((group) =>
  [10, 20, 30, 40, 50].map((value) => ({group: group.id, value})),
);
const common = {
  dataTableLabel: 'Compact layout values',
  description: 'Labels use staggered rows before the chart needs local scrolling.',
  emptyState: {title: 'No values', description: 'Provide recorded values.'},
  invalidData: {title: 'Invalid values', description: 'Provide valid values.'},
};

export function CompactAxisExample({kind}: {readonly kind: 'time' | 'numeric' | 'box'}) {
  const [compact, setCompact] = useState(true);
  return (
    <Stack gap="regular">
      <Switch label="Compact container" isSelected={compact} onChange={setCompact} />
      <div style={{width: '100%', maxWidth: compact ? '20rem' : '48rem'}}>
        {kind === 'time' ? (
          <LineChart
            {...common}
            data={months}
            title="Monthly recovery duration"
            series={[{id: 'duration', label: 'Duration', accessor: 'value'}]}
            xAxis={{
              accessor: 'date',
              label: 'Month',
              scale: {type: 'time', domain: [months[0]!.date, months[11]!.date]},
              tickCount: 12,
              formatTick: (date) =>
                date.toLocaleDateString('en-US', {month: 'short', timeZone: 'UTC'}),
            }}
            yAxis={{
              label: 'Mean duration for completed recovery operations',
              unit: 'minutes',
              scale: {type: 'linear'},
            }}
          />
        ) : kind === 'numeric' ? (
          <ScatterChart
            {...common}
            data={points}
            title="Survey coordinates"
            idAccessor="id"
            labelAccessor="id"
            series={[{id: 'points', label: 'Observations'}]}
            xAxis={{accessor: 'x', label: 'Distance', scale: {type: 'linear'}, tickCount: 12}}
            yAxis={{accessor: 'y', label: 'Reading', scale: {type: 'linear'}}}
          />
        ) : (
          <BoxPlot
            {...common}
            data={samples}
            title="Recovery by turbine loop"
            groups={groups}
            groupAccessor="group"
            legend={{label: 'Turbine loops'}}
            distribution={{kind: 'raw', valueAccessor: 'value', whisker: 'tukey'}}
            xAxis={{label: 'Turbine loop'}}
            yAxis={{label: 'Recovery duration', unit: 'minutes', scale: {type: 'linear'}}}
          />
        )}
      </div>
    </Stack>
  );
}
