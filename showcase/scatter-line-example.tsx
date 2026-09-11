import {useState} from 'react';
import {ScatterChart, Stack, Switch, type ChartRectangularExplorationLabels} from '../src/index.js';

const targets = [
  [2, 102],
  [7, 82],
  [12, 63],
  [17, 47],
  [22, 44],
  [27, 54],
  [32, 76],
  [37, 108],
].map(([temperature, energy], index) => ({
  key: `target-${index}`,
  name: `Target at ${temperature} °C`,
  temperature: temperature!,
  energy: energy!,
}));
const observed = [
  [3, 105],
  [4, 97],
  [5, 101],
  [6, 86],
  [7, 91],
  [8, 77],
  [9, 83],
  [10, 72],
  [11, 68],
  [12, 77],
  [13, 59],
  [14, 62],
  [15, 49],
  [16, 55],
  [17, 43],
  [18, 50],
  [19, 39],
  [20, 47],
  [21, 45],
  [22, 50],
  [23, 41],
  [24, 57],
  [25, 52],
  [26, 66],
  [27, 49],
  [28, 65],
  [29, 70],
  [30, 75],
  [31, 69],
  [32, 85],
  [33, 92],
  [34, 82],
  [35, 109],
  [36, 101],
  [20, 91],
  [28, 65],
  [8, 62],
  [29, 96],
].map(([x, y], index) => ({id: `day-${index}`, label: `Day ${index + 1}`, x: x!, y: y!}));
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
  panUp: 'Higher energy',
  panDown: 'Lower energy',
  window: 'Visible observations',
  corner: (corner) => `Resize ${corner.replace('-', ' ')} corner`,
  instructions:
    'Drag the area or a corner. Drag outside it to choose a new area. Arrow keys move the focused area or corner.',
  range: ({x, y}) =>
    `${number.format(x[0])} to ${number.format(x[1])} °C; ${number.format(y[0])} to ${number.format(y[1])} kWh`,
};

export function ScatterLineExample() {
  const [compact, setCompact] = useState(false);
  const [details, setDetails] = useState('');
  return (
    <Stack gap="regular">
      <Switch label="Compact container" isSelected={compact} onChange={setCompact} />
      <p>
        Daily observations and a supplied energy target use separate datasets. The line connects
        target samples in their supplied order. Select a dot or click near the line to select a
        target sample. Each series has its own eye and details callback.
      </p>
      <div style={{maxWidth: compact ? '22rem' : undefined}}>
        <ScatterChart
          data={observed}
          idAccessor="id"
          labelAccessor="label"
          title="Temperature and daily energy use"
          description="Heating and cooling demand, compared with supplied energy targets."
          dataTableLabel="Daily observations and supplied targets"
          emptyState={{
            title: 'No observations',
            description: 'Add observations or target samples.',
          }}
          invalidData={{
            title: 'Invalid observations',
            description: 'Correct the recorded coordinates.',
          }}
          series={[{id: 'observed', label: 'Observed use'}]}
          line={{
            ...{id: 'target', label: 'Energy target', data: targets},
            idAccessor: 'key',
            labelAccessor: 'name',
            xAccessor: 'temperature',
            yAccessor: 'energy',
            onActivate: ({datum}) => setDetails(`${datum.name}: ${datum.energy} kWh.`),
          }}
          legend={{label: 'Energy series'}}
          visibilityLabels={{
            hideSeries: (name) => `Hide ${name}`,
            showSeries: (name) => `Show ${name}`,
            hidden: 'Hidden',
            showAll: 'Show all',
            allHidden: {title: 'All series hidden', description: 'Use an eye to restore a series.'},
          }}
          xAxis={{accessor: 'x', label: 'Temperature', unit: '°C', scale: {type: 'linear'}}}
          yAxis={{accessor: 'y', label: 'Daily use', unit: 'kWh', scale: {type: 'linear'}}}
          exploration={{labels}}
          interaction={{
            onActivate: ({datum}) => setDetails(`${datum.label}: ${datum.x} °C, ${datum.y} kWh.`),
            selection: {
              labels: {
                instructions:
                  'Tap to select. Drag to select dots whose centers are inside the rectangle. Control/Command-click or hold to open details. Use two fingers to pan and pinch to zoom.',
                clear: 'Clear selection',
                empty: 'Nothing selected',
                summary: (count) => `${count} items selected`,
                item: (item) =>
                  item.seriesId === 'target'
                    ? targets.find((row) => row.key === item.rowId)!.name
                    : observed.find((row) => row.id === item.rowId)!.label,
                hidden: (label) => `${label} (hidden)`,
              },
            },
          }}
        />
      </div>
      {details ? <p role="status">{details}</p> : null}
    </Stack>
  );
}
