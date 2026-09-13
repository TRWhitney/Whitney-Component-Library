import {ChartFrame, ChartSizeControl} from './chart-presentation.js';
import {useState} from 'react';
import {BarChart, BoxPlot, LineChart, ScatterChart, Stack} from '../src/index.js';

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
const stations = Array.from({length: 12}, (_, i) => ({
  id: `s${i + 1}`,
  label: `Station ${i + 1}`,
  supply: 36 + ((i * 17) % 64),
  returned: 10 + ((i * 7) % 30),
}));
const samples = groups.flatMap((group) =>
  [10, 20, 30, 40, 50].map((value) => ({group: group.id, value})),
);
const common = {
  dataTableLabel: 'Compact layout values',
  description: 'Labels use staggered rows before the chart needs local scrolling.',
  emptyState: {title: 'No values', description: 'Provide recorded values.'},
  invalidData: {title: 'Invalid values', description: 'Provide valid values.'},
};

export function CompactAxisExample({kind}: {readonly kind: 'time' | 'numeric' | 'box' | 'bar'}) {
  const [compact, setCompact] = useState(true);
  const [details, setDetails] = useState('');
  return (
    <Stack gap="regular">
      <ChartSizeControl compact={compact} onChange={setCompact} />
      <ChartFrame compact={compact}>
        {kind === 'bar' ? (
          <BarChart
            {...common}
            data={stations}
            title="Station energy"
            description="Twelve categories keep readable spacing as the container narrows. Click a bar to open its reading."
            legend={{label: 'Energy'}}
            visibilityLabels={{
              hideSeries: (s) => `Hide ${s}`,
              showSeries: (s) => `Show ${s}`,
              hidden: 'Hidden',
              showAll: 'Show all',
              allHidden: {
                title: 'All series hidden',
                description: 'Use an eye to restore a series.',
              },
            }}
            series={[
              {id: 'supply', label: 'Supply', accessor: 'supply'},
              {id: 'returned', label: 'Returned', accessor: 'returned', color: 'series-2'},
            ]}
            xAxis={{label: 'Energy', unit: 'MWh', scale: {type: 'linear'}}}
            yAxis={{label: 'Station', accessor: 'label', scale: {type: 'categorical'}}}
            interaction={{
              target: 'point',
              getRowId: (d) => d.id,
              onActivate: (a) =>
                setDetails(
                  `${String(a.category)}: ${a.values[0]?.label} ${a.values[0]?.value} MWh`,
                ),
            }}
          />
        ) : kind === 'time' ? (
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
      </ChartFrame>
      {kind === 'bar' && details ? <p role="status">Opened {details}</p> : null}
    </Stack>
  );
}
