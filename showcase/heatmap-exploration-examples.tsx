import {ChartFrame, ChartSizeControl} from './chart-presentation.js';
import {useState} from 'react';
import {Heatmap, Stack, type ChartRectangularExplorationLabels} from '../src/index.js';

const rows = ['North', 'South', 'East', 'West', 'Studio', 'Office'].map((label) => ({
  id: label.toLowerCase(),
  label,
}));
const columns = Array.from({length: 12}, (_, index) => ({
  id: `hour-${index}`,
  label: `${index + 7}:00`,
}));
const data = rows.flatMap((row, rowIndex) =>
  columns.flatMap((column, columnIndex) =>
    (rowIndex + columnIndex) % 11 === 5
      ? []
      : [
          {
            row: row.id,
            column: column.id,
            value:
              rowIndex === 0 && columnIndex === 0
                ? 0
                : Math.round(15 + rowIndex * 2 + Math.sin(columnIndex) * 6),
          },
        ],
  ),
);
const rowLabel = (id: string) => rows.find((row) => row.id === id)?.label ?? id;
const columnLabel = (id: string) => columns.find((column) => column.id === id)?.label ?? id;
const labels: ChartRectangularExplorationLabels<string, string> = {
  overview: 'Overview',
  closeOverview: 'Close overview',
  done: 'Done',
  reset: 'Reset view',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  panLeft: 'Earlier hours',
  panRight: 'Later hours',
  panUp: 'Previous rooms',
  panDown: 'Next rooms',
  window: 'Visible rooms and hours',
  corner: (corner) => `Resize ${corner.replace('-', ' ')} corner`,
  instructions:
    'Drag the window to move it or drag a corner to resize it. Arrow keys adjust the focused window or corner.',
  range: ({x, y}) =>
    `${columnLabel(x[0])} to ${columnLabel(x[1])}, ${rowLabel(y[0])} to ${rowLabel(y[1])}`,
};

export function HeatmapExplorationExample() {
  const [compact, setCompact] = useState(false);
  const [details, setDetails] = useState('');
  return (
    <Stack gap="regular">
      <ChartSizeControl compact={compact} onChange={setCompact} />
      <p>
        Pan and zoom through complete cells with the controls or two fingers. Overview shows every
        visible room and hour. Hide tracks with their eyes and restore them beside Room. The color
        key uses all unhidden readings.
      </p>
      <ChartFrame compact={compact}>
        <Heatmap
          rows={rows}
          columns={columns}
          data={data}
          rowAccessor="row"
          columnAccessor="column"
          title="Room temperatures"
          description="Hourly readings across six rooms. Hatched cells have no reading."
          dataTableLabel="All hourly room readings"
          labels={{
            row: 'Room',
            column: 'Hour',
            missing: 'No reading',
            colorKey: 'Temperature scale',
            scrollRegion: 'Temperature grid',
          }}
          value={{accessor: 'value', label: 'Temperature', unit: '°C'}}
          scale={{type: 'sequential', color: '#2878ff'}}
          emptyState={{title: 'No rooms', description: 'Add rooms and hourly readings.'}}
          invalidData={{title: 'Invalid readings', description: 'Correct the affected readings.'}}
          exploration={{labels, defaultWindow: {x: ['hour-2', 'hour-7'], y: ['north', 'west']}}}
          visibilityLabels={{
            hideRow: (label) => `Hide room ${label}`,
            showRow: (label) => `Show room ${label}`,
            hideColumn: (label) => `Hide hour ${label}`,
            showColumn: (label) => `Show hour ${label}`,
            restore: (count) => `Restore ${count} hidden dimensions`,
            hiddenRows: 'Hidden rooms',
            hiddenColumns: 'Hidden hours',
            hidden: 'Hidden',
            showAll: 'Show all',
            close: 'Close hidden dimensions',
            allHidden: {
              title: 'No visible cells',
              description: 'Restore a room and hour to see readings.',
            },
          }}
          interaction={{
            onActivate: ({row, column, value}) =>
              setDetails(
                `${row.label}, ${column.label}: ${value === undefined ? 'No reading' : `${value} °C`}`,
              ),
            selection: {
              labels: {
                instructions:
                  'Tap to select. Drag to select cells. Control/Command-click or hold to open details. Use two fingers to pan and pinch to zoom.',
                clear: 'Clear selection',
                empty: 'Nothing selected',
                summary: (count) => `${count} cells selected`,
                item: ({rowId, columnId}) => `${rowLabel(rowId)}, ${columnLabel(columnId)}`,
                hidden: (label) => `${label} (outside the visible grid)`,
              },
            },
          }}
        />
      </ChartFrame>
      {details ? <p role="status">{details}</p> : null}
    </Stack>
  );
}
