import {useState} from 'react';
import {
  AreaChart,
  BarChart,
  CartesianChart,
  ColumnChart,
  SegmentedControl,
  Stack,
  Switch,
  type ChartExplorationLabels,
  type ChartInteraction,
} from '../src/index.js';

const month = new Intl.DateTimeFormat('en', {month: 'short', year: '2-digit', timeZone: 'UTC'});
const rows = Array.from({length: 24}, (_, index) => ({
  id: `month-${index}`,
  month: month.format(new Date(Date.UTC(2025, index, 1))),
  heating: Math.round(45 + Math.cos(index / 2) * 22 + index),
  cooling: Math.round(30 + Math.sin(index / 2) * 18 + index / 2),
  target: 75 + index * 2,
}));
type Mode = 'area' | 'grouped' | 'stacked' | 'normalized' | 'mixed' | 'bar';
const labels: ChartExplorationLabels<string> = {
  overview: 'Overview',
  closeOverview: 'Close overview',
  done: 'Done',
  reset: 'Reset view',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  panBackward: 'Earlier months',
  panForward: 'Later months',
  window: 'Visible months',
  start: 'First visible month',
  end: 'Last visible month',
  instructions:
    'Drag the window to move it, or drag an edge to resize it. Arrow keys adjust the focused window or edge.',
  range: ([first, last]) => `${first} to ${last}`,
};
const categoryAxis = {
  accessor: (row: (typeof rows)[number]) => row.month,
  label: 'Month',
  scale: {type: 'categorical'},
} as const;
const valueAxis = {label: 'Energy', unit: 'MWh', scale: {type: 'linear'}} as const;
const series = [
  {id: 'heating', label: 'Heating', accessor: 'heating'},
  {id: 'cooling', label: 'Cooling', accessor: 'cooling'},
] as const;

export function CartesianExplorationExample() {
  const [mode, setMode] = useState<Mode>('area');
  const [compact, setCompact] = useState(false);
  const [details, setDetails] = useState('');
  const interaction: ChartInteraction<(typeof rows)[number], string> = {
    target: 'category',
    getRowId: (row) => row.id,
    onActivate: (item) =>
      setDetails(
        `${item.category}: ${item.values.map((value) => `${value.label} ${value.value} MWh`).join(', ')}`,
      ),
    selection: {
      labels: {
        instructions:
          'Tap to select. Drag to select months. Control/Command-click or hold to open details. Use two fingers to pan and pinch to zoom.',
        clear: 'Clear selection',
        empty: 'Nothing selected',
        summary: (count) => `${count} months selected`,
        item: (item) => rows.find((row) => row.id === item.rowId)!.month,
        hidden: (label) => `${label} (hidden)`,
      },
    },
  };
  const common = {
    data: rows,
    title: 'Monthly energy use',
    description: 'Heating and cooling totals by month.',
    dataTableLabel: 'All monthly energy figures',
    emptyState: {title: 'No months', description: 'Add monthly energy figures.'},
    invalidData: {title: 'Invalid figures', description: 'Correct invalid months or amounts.'},
    legend: {label: 'Energy series'},
    series,
    visibilityLabels: {
      hideSeries: (name: string) => `Hide ${name}`,
      showSeries: (name: string) => `Show ${name}`,
      hidden: 'Hidden',
      showAll: 'Show all',
      allHidden: {title: 'All series hidden', description: 'Use an eye to restore a series.'},
    },
    exploration: {labels, defaultWindow: [rows[6]!.month, rows[13]!.month] as const},
    interaction,
  };
  return (
    <Stack gap="regular">
      <SegmentedControl
        label="Exploration chart type"
        value={mode}
        onChange={(next) => {
          setMode(next);
          setDetails('');
        }}
        options={[
          {label: 'Area', value: 'area'},
          {label: 'Grouped', value: 'grouped'},
          {label: 'Stacked', value: 'stacked'},
          {label: 'Normalized', value: 'normalized'},
          {label: 'Mixed', value: 'mixed'},
          {label: 'Bars', value: 'bar'},
        ]}
      />
      <Switch label="Compact container" isSelected={compact} onChange={setCompact} />
      <p>
        Use the chart buttons or two fingers to pan and zoom. Overview shows every month. The eyes
        hide or restore a series in both views. Horizontal bars keep the same month order from top
        to bottom, with earlier months on the left in Overview.
      </p>
      <div key={mode} style={{maxWidth: compact ? '22rem' : undefined}}>
        {mode === 'area' ? (
          <AreaChart {...common} stacking="stacked" xAxis={categoryAxis} yAxis={valueAxis} />
        ) : mode === 'bar' ? (
          <BarChart {...common} xAxis={valueAxis} yAxis={categoryAxis} />
        ) : mode === 'mixed' ? (
          <CartesianChart
            {...common}
            description="Monthly heating columns, cooling area and an energy target line."
            xAxis={categoryAxis}
            yAxis={valueAxis}
            series={[
              {...series[0], kind: 'column'},
              {...series[1], kind: 'area'},
              {id: 'target', label: 'Target', accessor: 'target', kind: 'line'},
            ]}
          />
        ) : mode === 'normalized' ? (
          <ColumnChart
            {...common}
            layout="normalized"
            xAxis={categoryAxis}
            yAxis={{label: 'Energy share', scale: {type: 'normalized'}}}
          />
        ) : (
          <ColumnChart {...common} layout={mode} xAxis={categoryAxis} yAxis={valueAxis} />
        )}
      </div>
      {details ? <p role="status">{details}</p> : null}
    </Stack>
  );
}
