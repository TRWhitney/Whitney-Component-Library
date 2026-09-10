import {useState} from 'react';
import {
  BubbleChart,
  ScatterChart,
  SegmentedControl,
  Stack,
  Switch,
  type ChartRectangularExplorationLabels,
  type PointChartInteraction,
} from '../src/index.js';

const observations = Array.from({length: 42}, (_, index) => ({
  id: `observation-${index}`,
  label: `Observation ${index + 1}`,
  group: index % 2 ? 'south' : 'north',
  temperature: Math.round((8 + ((index * 13) % 31)) * 10) / 10,
  demand: 25 + ((index * 29) % 91),
  capacity: 15 + ((index * 17) % 86),
}));
const number = new Intl.NumberFormat('en', {maximumFractionDigits: 1});
const labels: ChartRectangularExplorationLabels<number, number> = {
  overview: 'Overview',
  closeOverview: 'Close overview',
  done: 'Done',
  reset: 'Reset view',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  panLeft: 'Lower temperature',
  panRight: 'Higher temperature',
  panUp: 'Higher demand',
  panDown: 'Lower demand',
  window: 'Visible observations',
  corner: (corner) => `Resize ${corner.replace('-', ' ')} corner`,
  instructions:
    'Drag the area to move it, drag a corner to resize it, or drag outside it to draw a new area. Arrow keys move the focused area or corner.',
  range: ({x, y}) =>
    `${number.format(x[0])} to ${number.format(x[1])} °C; ${number.format(y[0])} to ${number.format(y[1])} MWh`,
};

export function PointExplorationExample() {
  const [mode, setMode] = useState<'scatter' | 'bubble'>('scatter');
  const [compact, setCompact] = useState(false);
  const [details, setDetails] = useState('');
  const interaction: PointChartInteraction<(typeof observations)[number]> = {
    onActivate: (observation) =>
      setDetails(
        `${observation.label}: ${observation.x} °C, ${observation.y} MWh${observation.magnitude === undefined ? '' : `, capacity ${observation.magnitude} MWh`}.`,
      ),
    selection: {
      labels: {
        instructions:
          'Tap to select. Drag to select observations. Control/Command-click or hold to open details. Use two fingers to pan and pinch to zoom.',
        clear: 'Clear selection',
        empty: 'Nothing selected',
        summary: (count) => `${count} observations selected`,
        item: (item) => observations.find((row) => row.id === item.rowId)!.label,
        hidden: (label) => `${label} (hidden)`,
      },
    },
  };
  const common = {
    data: observations,
    idAccessor: 'id',
    labelAccessor: 'label',
    seriesAccessor: 'group',
    series: [
      {id: 'north', label: 'North loop'},
      {id: 'south', label: 'South loop'},
    ],
    title: 'Temperature and energy demand',
    description: 'Recorded temperatures and demand across two energy loops.',
    dataTableLabel: 'All recorded observations',
    emptyState: {title: 'No observations', description: 'Add recorded observations.'},
    invalidData: {title: 'Invalid observations', description: 'Correct the recorded values.'},
    legend: {label: 'Energy loops'},
    visibilityLabels: {
      hideSeries: (name: string) => `Hide ${name}`,
      showSeries: (name: string) => `Show ${name}`,
      hidden: 'Hidden',
      showAll: 'Show all',
      allHidden: {title: 'All loops hidden', description: 'Use an eye to restore a loop.'},
    },
    xAxis: {accessor: 'temperature', label: 'Temperature', unit: '°C', scale: {type: 'linear'}},
    yAxis: {accessor: 'demand', label: 'Demand', unit: 'MWh', scale: {type: 'linear'}},
    exploration: {labels, defaultWindow: {x: [14, 32], y: [40, 100]}},
    interaction,
  } as const;
  return (
    <Stack gap="regular">
      <SegmentedControl
        label="Point chart type"
        value={mode}
        onChange={(next) => {
          setMode(next);
          setDetails('');
        }}
        options={[
          {label: 'Scatter', value: 'scatter'},
          {label: 'Bubble', value: 'bubble'},
        ]}
      />
      <Switch label="Compact container" isSelected={compact} onChange={setCompact} />
      <p>
        Pan and zoom both axes with the chart buttons or two fingers. Overview shows the full
        observation map and keeps selected observations marked outside the current view. The eyes
        hide or restore a loop in both views. Bubble area shows capacity and keeps the same scale as
        you zoom.
      </p>
      <div key={mode} style={{maxWidth: compact ? '22rem' : undefined}}>
        {mode === 'scatter' ? (
          <ScatterChart {...common} />
        ) : (
          <BubbleChart
            {...common}
            magnitude={{accessor: 'capacity', label: 'Capacity', unit: 'MWh'}}
          />
        )}
      </div>
      {details ? <p role="status">{details}</p> : null}
    </Stack>
  );
}
