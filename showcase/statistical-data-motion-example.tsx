import {ChartFrame, ChartSizeControl} from './chart-presentation.js';
import {useState} from 'react';
import {
  BubbleChart,
  Button,
  InlineGroup,
  ScatterChart,
  Stack,
  type ChartRectangularExplorationLabels,
  type ScatterChartProps,
} from '../src/index.js';

const buildings = [
  {id: 'north', label: 'North', group: 'office', x: 17, y: 48, size: 120},
  {id: 'south', label: 'South', group: 'office', x: 23, y: 75, size: 190},
  {id: 'east', label: 'East', group: 'lab', x: 20, y: 62, size: 85},
  {id: 'west', label: 'West', group: 'lab', x: 28, y: 105, size: 250},
  {id: 'annex', label: 'Annex', group: 'office', x: 34, y: 160, size: 340},
  {id: 'studio', label: 'Studio', group: 'lab', x: 13, y: 36, size: 65},
];
type Building = (typeof buildings)[number];
const initial = buildings.slice(0, 4);
const largerDataset: Building[] = [
  ...buildings,
  ...Array.from({length: 494}, (_, index) => ({
    id: `building-${index + 7}`,
    label: `Building ${index + 7}`,
    group: index % 2 ? 'office' : 'lab',
    x: 10 + ((index * 73) % 260) / 10,
    y: 30 + ((index * 37) % 1300) / 10,
    size: 65 + ((index * 31) % 260),
  })),
];
const targets = [
  {id: 'cool', label: 'Cool target', x: 12, y: 36},
  {id: 'mild', label: 'Mild target', x: 22, y: 60},
  {id: 'warm', label: 'Warm target', x: 35, y: 120},
];
const number = new Intl.NumberFormat('en', {maximumFractionDigits: 1});
const explorationLabels: ChartRectangularExplorationLabels<number, number> = {
  overview: 'Overview',
  closeOverview: 'Close overview',
  done: 'Done',
  reset: 'Reset view',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  panLeft: 'Lower temperature',
  panRight: 'Higher temperature',
  panUp: 'Higher energy',
  panDown: 'Lower energy',
  window: 'Visible buildings',
  corner: (corner) => `Resize ${corner.replace('-', ' ')} corner`,
  instructions: 'Drag the area or a corner. Arrow keys move the focused area or corner.',
  range: ({x, y}) =>
    `${number.format(x[0])} to ${number.format(x[1])} °C; ${number.format(y[0])} to ${number.format(y[1])} kWh`,
};

export function StatisticalDataMotionExample({kind}: {readonly kind: 'scatter' | 'bubble'}) {
  const [data, setData] = useState(initial);
  const [lineData, setLineData] = useState(targets);
  const [revision, setRevision] = useState(0);
  const [compact, setCompact] = useState(false);
  const [details, setDetails] = useState('');
  const common: Omit<ScatterChartProps<Building>, 'line'> = {
    data,
    idAccessor: 'id',
    labelAccessor: 'label',
    seriesAccessor: 'group',
    title: kind === 'bubble' ? 'Changing building occupancy' : 'Changing building readings',
    description:
      kind === 'bubble'
        ? 'Bubble area represents occupancy. Temperature and daily energy use set the position.'
        : 'Building observations and separately supplied energy targets.',
    dataTableLabel: 'Current building values',
    emptyState: {title: 'No buildings', description: 'Add a building.'},
    invalidData: {title: 'Invalid readings', description: 'Correct the recorded values.'},
    series: [
      {id: 'office', label: 'Office'},
      {id: 'lab', label: 'Lab'},
    ],
    legend: {label: 'Building groups'},
    visibilityLabels: {
      hideSeries: (label) => `Hide ${label}`,
      showSeries: (label) => `Show ${label}`,
      hidden: 'Hidden',
      showAll: 'Show all',
      allHidden: {title: 'All groups hidden', description: 'Open an eye to restore a group.'},
    },
    xAxis: {accessor: 'x', label: 'Temperature', unit: '°C', scale: {type: 'linear'}},
    yAxis: {accessor: 'y', label: 'Daily use', unit: 'kWh', scale: {type: 'linear'}},
    exploration: {labels: explorationLabels},
    interaction: {
      onActivate: ({datum}) =>
        setDetails(`${datum.label}: ${number.format(datum.x)} °C, ${number.format(datum.y)} kWh.`),
      selection: {
        labels: {
          instructions:
            'Tap to select. Drag to select dots whose centers are inside the rectangle. Control/Command-click or hold to open details. Use two fingers to pan and pinch to zoom.',
          clear: 'Clear selection',
          empty: 'Nothing selected',
          summary: (count) => `${count} ${count === 1 ? 'item' : 'items'} selected`,
          item: (item) =>
            item.seriesId === 'target'
              ? (lineData.find((point) => point.id === item.rowId)?.label ?? item.rowId)
              : (data.find((point) => point.id === item.rowId)?.label ?? item.rowId),
          hidden: (label) => `${label} (hidden)`,
        },
      },
    },
  };
  return (
    <Stack gap="regular">
      <p>
        Select a building, then change its values or the building list. Selection follows the
        building. The data table and details report the current supplied values while marks move.
        Load 500 buildings to try the same controls with a larger dataset.
      </p>
      <ChartSizeControl compact={compact} onChange={setCompact} />
      <InlineGroup gap="tight" wrap>
        <Button
          variant="secondary"
          onPress={() => {
            const direction = revision % 2 === 0 ? 1 : -1;
            setData((rows) =>
              rows.map((row, index) => ({
                ...row,
                x: row.x + direction * (index % 2 === 0 ? 3 : -2),
                y: row.y + direction * (index % 2 === 0 ? 18 : -11),
                size: row.size + direction * (index % 2 === 0 ? 25 : -15),
              })),
            );
            setLineData((rows) =>
              rows.map((row, index) => ({...row, y: row.y + direction * (index + 1) * 6})),
            );
            setRevision((value) => value + 1);
          }}
        >
          Update values
        </Button>
        <Button
          variant="secondary"
          isDisabled={buildings.every((building) => data.some((row) => row.id === building.id))}
          onPress={() => {
            const incoming = buildings.find(
              (building) => !data.some((row) => row.id === building.id),
            );
            if (incoming) setData((rows) => [...rows, incoming]);
          }}
        >
          Add building
        </Button>
        <Button
          variant="secondary"
          isDisabled={data.length <= 1}
          onPress={() => {
            const largest = [...data].sort((a, b) => b.size - a.size)[0]!;
            setData((rows) => rows.filter((row) => row.id !== largest.id));
          }}
        >
          Remove largest
        </Button>
        <Button variant="secondary" onPress={() => setData((rows) => [...rows].reverse())}>
          Reverse order
        </Button>
        <Button
          variant="secondary"
          onPress={() => {
            setData(largerDataset);
            setRevision(0);
            setDetails('');
          }}
        >
          Load 500 buildings
        </Button>
        <Button
          variant="quiet"
          onPress={() => {
            setData(initial);
            setLineData(targets);
            setRevision(0);
          }}
        >
          Reset data
        </Button>
      </InlineGroup>
      <ChartFrame compact={compact}>
        {kind === 'bubble' ? (
          <BubbleChart {...common} magnitude={{accessor: 'size', label: 'Occupants'}} />
        ) : (
          <ScatterChart
            {...common}
            line={{
              id: 'target',
              label: 'Energy target',
              data: lineData,
              idAccessor: 'id',
              labelAccessor: 'label',
              xAccessor: 'x',
              yAccessor: 'y',
              onActivate: ({datum}) => setDetails(`${datum.label}: ${number.format(datum.y)} kWh.`),
            }}
          />
        )}
      </ChartFrame>
      {details ? <p role="status">{details}</p> : null}
    </Stack>
  );
}
