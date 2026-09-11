import {useState} from 'react';
import {Button, Heatmap, Stack, Switch} from '../src/index.js';

const rows = ['North', 'South', 'Studio', 'Office'].map((label) => ({id: label, label}));
const columns = ['Morning', 'Noon', 'Night'].map((label) => ({id: label, label}));
const readings = [
  [16, 24, 18, 21, 27, 20, 14, 22, 17, 19, 26, 23],
  [22, 19, 25, 16, 24, 28, 20, 30, 18, 26, 21, 15],
  [18, 28, 21, 25, 20, 17, 23, 26, 31, 16, 24, 20],
];

export function HeatmapDataMotionExample() {
  const [update, setUpdate] = useState(0);
  const [compact, setCompact] = useState(false);
  const [details, setDetails] = useState('');
  const values = readings[update % readings.length]!;
  const data = rows.flatMap((row, rowIndex) =>
    columns.flatMap((column, columnIndex) =>
      rowIndex === 2 && columnIndex === 2
        ? []
        : [
            {
              row: row.id,
              column: column.id,
              value: values[rowIndex * columns.length + columnIndex]!,
            },
          ],
    ),
  );
  return (
    <Stack gap="regular">
      <p>
        Update the readings to change cell colors and their fitted scale. Select a cell to keep its
        frame through the update. Details and the table show the latest recorded temperature.
      </p>
      <Button variant="secondary" onPress={() => setUpdate((previous) => previous + 1)}>
        Update temperatures
      </Button>
      <Switch label="Compact container" isSelected={compact} onChange={setCompact} />
      <div style={{maxWidth: compact ? '22rem' : undefined}}>
        <Heatmap
          rows={rows}
          columns={columns}
          data={data}
          rowAccessor="row"
          columnAccessor="column"
          title="Updated room temperatures"
          description="Four rooms across three times. The Studio has no night reading."
          dataTableLabel="Updated temperature records"
          minimumSize={{width: 260, height: 300}}
          labels={{
            row: 'Room',
            column: 'Time',
            colorKey: 'Temperature scale',
            missing: 'No reading',
            scrollRegion: 'Temperature grid',
          }}
          value={{accessor: 'value', label: 'Temperature', unit: '°C'}}
          scale={{type: 'sequential', color: '#2878ff'}}
          emptyState={{title: 'No rooms', description: 'Add rooms and readings.'}}
          invalidData={{title: 'Invalid readings', description: 'Correct the affected readings.'}}
          visibilityLabels={{
            hideRow: (label) => `Hide room ${label}`,
            showRow: (label) => `Show room ${label}`,
            hideColumn: (label) => `Hide time ${label}`,
            showColumn: (label) => `Show time ${label}`,
            restore: (count) => `Restore ${count} hidden dimensions`,
            hiddenRows: 'Hidden rooms',
            hiddenColumns: 'Hidden times',
            hidden: 'Hidden',
            showAll: 'Show all',
            close: 'Close hidden dimensions',
            allHidden: {
              title: 'No visible cells',
              description: 'Restore a room and time to see readings.',
            },
          }}
          exploration={{
            labels: {
              overview: 'Overview',
              closeOverview: 'Close overview',
              done: 'Done',
              reset: 'Reset view',
              zoomIn: 'Zoom in',
              zoomOut: 'Zoom out',
              panLeft: 'Earlier times',
              panRight: 'Later times',
              panUp: 'Previous rooms',
              panDown: 'Next rooms',
              window: 'Visible rooms and times',
              corner: (corner) => `Resize ${corner.replace('-', ' ')} corner`,
              instructions:
                'Drag the window or a corner. Arrow keys adjust the focused window or corner.',
              range: ({x, y}) => `${x[0]} to ${x[1]}, ${y[0]} to ${y[1]}`,
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
                summary: (count) => `${count} ${count === 1 ? 'cell' : 'cells'} selected`,
                item: ({rowId, columnId}) => `${rowId}, ${columnId}`,
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
