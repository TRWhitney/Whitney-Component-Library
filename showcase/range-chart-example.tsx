import {useState} from 'react';
import {
  CartesianChart,
  SegmentedControl,
  Stack,
  Switch,
  type ChartExplorationLabels,
  type ChartInteraction,
} from '../src/index.js';
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const measured = [7, 12, 9, 18, 25, 21, 33, 30, 19, 23, 11, 4];
const lower = [3, 5, 9, 11, 15, 19, 22, 21, 15, 10, 6, 2];
const upper = [10, 11, 15, 20, 23, 27, 29, 32, 25, 19, 15, 9];
const rows = months.map((month, i) => ({
  id: month,
  month,
  measured: measured[i]!,
  lower: lower[i]!,
  upper: upper[i]!,
}));
const navigation: ChartExplorationLabels<string> = {
  overview: 'Overview',
  closeOverview: 'Close overview',
  done: 'Done',
  reset: 'Reset view',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  panBackward: 'Earlier months',
  panForward: 'Later months',
  window: 'Visible months',
  start: 'First month',
  end: 'Last month',
  instructions: 'Drag the window or its edges. Arrow keys move the focused window or edge.',
  range: ([a, b]) => `${a} to ${b}`,
};
export function RangeChartExample() {
  const [target, setTarget] = useState<'category' | 'point'>('point');
  const [compact, setCompact] = useState(false);
  const [details, setDetails] = useState('');
  const interaction: ChartInteraction<(typeof rows)[number], string> = {
    target,
    getRowId: (row) => row.id,
    onActivate: (item) =>
      setDetails(
        `${item.category}: ${[...item.values.map((v) => `${v.label} ${v.value} °C`), ...(item.ranges ?? []).map((r) => `${r.label} ${r.lower} to ${r.upper} °C`)].join(', ')}`,
      ),
    selection: {
      labels: {
        instructions:
          'Tap to select. Drag to select values or months. Control/Command-click or hold to open details. Use two fingers to pan and pinch to zoom.',
        clear: 'Clear selection',
        empty: 'Nothing selected',
        summary: (n) => `${n} selected`,
        item: (p) =>
          `${p.rowId}${p.seriesId ? `, ${p.seriesId === 'measured' ? 'Measured' : 'Expected range'}` : ''}`,
        hidden: (s) => `${s} (hidden)`,
      },
    },
  };
  return (
    <Stack gap="regular">
      <SegmentedControl
        label="Range chart selection target"
        value={target}
        onChange={setTarget}
        options={[
          {label: 'Value', value: 'point'},
          {label: 'Month', value: 'category'},
        ]}
      />
      <Switch label="Compact range chart" isSelected={compact} onChange={setCompact} />
      <p>
        The measured temperature and expected range are supplied independently. Select the range to
        mark both limits as one item. The eyes hide a series in the chart and Overview.
      </p>
      <div style={{maxWidth: compact ? '22rem' : undefined}}>
        <CartesianChart
          key={target}
          data={rows}
          title="Monthly temperature"
          description="Measured temperature against its expected seasonal range."
          dataTableLabel="Monthly temperature readings"
          emptyState={{title: 'No temperatures', description: 'Add monthly readings.'}}
          invalidData={{
            title: 'Invalid temperatures',
            description: 'Check the readings and range limits.',
          }}
          legend={{label: 'Temperature series'}}
          series={[
            {
              id: 'measured',
              label: 'Measured',
              kind: 'line',
              accessor: 'measured',
              showPoints: true,
              color: 'accent',
            },
            {
              id: 'expected',
              label: 'Expected range',
              kind: 'range',
              lowerAccessor: 'lower',
              upperAccessor: 'upper',
              color: 'series-2',
            },
          ]}
          xAxis={{label: 'Month', accessor: 'month', scale: {type: 'categorical'}}}
          yAxis={{label: 'Temperature', unit: '°C', scale: {type: 'linear'}}}
          visibilityLabels={{
            hideSeries: (s) => `Hide ${s}`,
            showSeries: (s) => `Show ${s}`,
            hidden: 'Hidden',
            showAll: 'Show all',
            allHidden: {title: 'All series hidden', description: 'Use an eye to restore a series.'},
          }}
          exploration={{labels: navigation}}
          interaction={interaction}
        />
      </div>
      {details ? <p role="status">{details}</p> : null}
    </Stack>
  );
}
