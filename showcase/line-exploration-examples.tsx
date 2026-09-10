import {useState} from 'react';
import {
  LineChart,
  Stack,
  Switch,
  type ChartDomainWindow,
  type ChartExplorationLabels,
} from '../src/index.js';
const rows = Array.from({length: 24}, (_, i) => ({
  id: `month-${i}`,
  date: new Date(Date.UTC(2025, i, 1)),
  revenue: 80 + i * 4 + Math.sin(i) * 12,
  cost: 55 + i * 2 + Math.sin(i) * 5,
}));
const month = new Intl.DateTimeFormat('en', {month: 'short', year: '2-digit', timeZone: 'UTC'});
const labels: ChartExplorationLabels<Date> = {
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
  range: ([a, b]) => `${month.format(a)} – ${month.format(b)}`,
};
const common = {
  data: rows,
  dataTableLabel: 'All monthly figures',
  emptyState: {title: 'No months', description: 'Add monthly figures.'},
  invalidData: {title: 'Invalid figures', description: 'Correct invalid dates or amounts.'},
  xAxis: {
    accessor: (row: (typeof rows)[number]) => row.date,
    label: 'Month',
    scale: {type: 'time'},
    formatTick: (date: Date) => month.format(date),
  } as const,
  yAxis: {label: 'Amount', unit: '$k', scale: {type: 'linear'}} as const,
  series: [
    {id: 'revenue', label: 'Revenue', accessor: 'revenue', showPoints: true},
    {id: 'cost', label: 'Operating costs', accessor: 'cost', showPoints: true},
  ] as const,
  legend: {label: 'Monthly series'},
  visibilityLabels: {
    hideSeries: (name: string) => `Hide ${name}`,
    showSeries: (name: string) => `Show ${name}`,
    hidden: 'Hidden',
    showAll: 'Show all',
    allHidden: {title: 'All series hidden', description: 'Use an eye to restore a series.'},
  },
};
export function LineExplorationExample({coordinated = false}: {readonly coordinated?: boolean}) {
  const [compact, setCompact] = useState(false);
  const [window, setWindow] = useState<ChartDomainWindow<Date>>([rows[6]!.date, rows[17]!.date]);
  const [details, setDetails] = useState('');
  return (
    <Stack gap="regular">
      <Switch label="Compact container" isSelected={compact} onChange={setCompact} />
      <p>
        {coordinated
          ? 'Both charts share an application-controlled date range. Changing either one updates both.'
          : 'Use the chart buttons or two fingers to pan and zoom. Overview opens the full timeline. Tap to select; hold or Control/Command-click to open details. Drag to select a range.'}
      </p>
      <div style={{maxWidth: compact ? '22rem' : undefined}}>
        <LineChart
          {...common}
          title={coordinated ? 'Coordinated monthly figures' : 'Revenue and operating costs'}
          description="Monthly totals in thousands of dollars."
          exploration={
            coordinated
              ? {labels, window, onWindowChange: setWindow}
              : {labels, defaultWindow: [rows[6]!.date, rows[17]!.date]}
          }
          interaction={{
            target: 'category',
            getRowId: (row) => row.id,
            onActivate: (item) =>
              setDetails(
                `${month.format(item.category)}: ${item.values.map((v) => `${v.label} ${v.value.toFixed(1)}`).join(', ')}`,
              ),
            selection: {
              labels: {
                instructions:
                  'Tap to select. Drag to select months. Control/Command-click or hold to open details. Use two fingers to pan and pinch to zoom.',
                clear: 'Clear selection',
                empty: 'Nothing selected',
                summary: (count) => `${count} months selected`,
                item: (item) => month.format(rows.find((row) => row.id === item.rowId)!.date),
                hidden: (label) => `${label} (hidden)`,
              },
            },
          }}
        />
        {coordinated ? (
          <LineChart
            {...common}
            title="Revenue detail"
            description="This chart shares the date window above."
            series={[common.series[0]]}
            exploration={{labels, window, onWindowChange: setWindow}}
          />
        ) : null}
      </div>
      {details ? <p role="status">{details}</p> : null}
    </Stack>
  );
}
