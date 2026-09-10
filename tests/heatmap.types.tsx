import {Heatmap, type HeatmapProps, type HeatmapVisibilityLabels} from '../src/index.js';

interface Reading {
  readonly hour: string;
  readonly location: string;
  readonly note: string;
  readonly value: number;
}

const common: Omit<HeatmapProps<Reading>, 'data'> = {
  columnAccessor: 'hour',
  columns: [{id: 'morning', label: 'Morning'}],
  dataTableLabel: 'Temperature readings',
  description: 'Temperature by location and time.',
  emptyState: {description: 'Record a reading to begin.', title: 'No readings'},
  invalidData: {description: 'Correct invalid readings.', title: 'Invalid readings'},
  labels: {
    colorKey: 'Temperature scale',
    column: 'Time',
    missing: 'No reading',
    row: 'Location',
    scrollRegion: 'Temperature grid',
  },
  rowAccessor: (reading) => reading.location,
  rows: [{id: 'north', label: 'North room'}],
  scale: {
    colors: ['#2878ff', '#d14f00'],
    domain: [-10, 30],
    midpoint: 10,
    type: 'two-sided',
  },
  title: 'Room temperature',
  value: {
    accessor: 'value',
    formatValue: (value) => value.toFixed(1),
    label: 'Temperature',
    unit: '°C',
  },
};

export const heatmap = (
  <Heatmap
    {...common}
    data={[{hour: 'morning', location: 'north', note: 'Calibrated', value: 12}]}
    minimumSize={{height: 260, width: 340}}
  />
);

export const invalidValueAccessor = (
  <Heatmap
    {...common}
    data={[]}
    value={{
      // @ts-expect-error Heatmap values must resolve to numbers.
      accessor: 'note',
      label: 'Temperature',
    }}
  />
);

export const invalidCoordinateAccessor = (
  <Heatmap
    {...common}
    // @ts-expect-error Heatmap coordinates must resolve to strings.
    columnAccessor="value"
    data={[]}
  />
);

export const invalidScale = (
  <Heatmap
    {...common}
    data={[]}
    // @ts-expect-error Two-sided scales require a declared midpoint.
    scale={{colors: ['#2878ff', '#d14f00'], type: 'two-sided'}}
  />
);

export const missingSequentialColor = (
  <Heatmap
    {...common}
    data={[]}
    // @ts-expect-error Sequential scales require one color.
    scale={{type: 'sequential'}}
  />
);

export const invalidTwoSidedColorCount = (
  <Heatmap
    {...common}
    data={[]}
    // @ts-expect-error Two-sided scales require low and high colors.
    scale={{colors: ['#2878ff'], midpoint: 0, type: 'two-sided'}}
  />
);

export const rendererProp = (
  <Heatmap
    {...common}
    data={[]}
    // @ts-expect-error Consumers cannot replace the Heatmap renderer.
    renderer={() => null}
  />
);

export const interactiveHeatmap = (
  <Heatmap
    {...common}
    data={[]}
    interaction={{
      onActivate(activation) {
        const original: Reading | undefined = activation.datum;
        const value: number | undefined = activation.value;
        const row: string = activation.item.rowId;
        const column: string = activation.item.columnId;
        void [original, value, row, column];
        // @ts-expect-error Missing cells do not guarantee a record.
        const required: Reading = activation.datum;
        void required;
      },
    }}
  />
);
export const invalidControlledHeatmap = (
  <Heatmap
    {...common}
    data={[]}
    interaction={{
      // @ts-expect-error Controlled selection requires its change callback.
      selection: {
        selectedItems: [],
        labels: {
          instructions: 'Select',
          clear: 'Clear',
          empty: 'None',
          summary: String,
          item: (item) => item.rowId,
          hidden: String,
        },
      },
    }}
  />
);
export const invalidHeatmapCoordinate = (
  <Heatmap
    {...common}
    data={[]}
    interaction={{
      selection: {
        labels: {
          instructions: 'Select',
          clear: 'Clear',
          empty: 'None',
          summary: String,
          item: (item) => item.columnId,
          hidden: String,
        },
        // @ts-expect-error Heatmap selection requires both row and column identifiers.
        defaultSelectedItems: [{rowId: 'north'}],
      },
    }}
  />
);

const visibilityLabels: HeatmapVisibilityLabels = {
  hideRow: (label) => `Hide row ${label}`,
  showRow: (label) => `Show row ${label}`,
  hideColumn: (label) => `Hide column ${label}`,
  showColumn: (label) => `Show column ${label}`,
  restore: (count) => `Restore ${count} hidden dimensions`,
  hiddenRows: 'Hidden locations',
  hiddenColumns: 'Hidden times',
  hidden: 'Hidden',
  showAll: 'Show all',
  close: 'Close hidden dimensions',
  allHidden: {
    title: 'No visible cells',
    description: 'Restore a location and time to see readings.',
  },
};

export const hideableHeatmap = (
  <Heatmap {...common} data={[]} visibilityLabels={visibilityLabels} />
);

export const invalidVisibilityFormatter: HeatmapVisibilityLabels = {
  ...visibilityLabels,
  // @ts-expect-error Visibility action formatters receive a readable domain label.
  hideRow: (label: number) => String(label),
};

export const invalidRestoreFormatter: HeatmapVisibilityLabels = {
  ...visibilityLabels,
  // @ts-expect-error Restore copy formats a numeric hidden-dimension count.
  restore: (count: string) => count,
};

export const incompleteVisibilityCopy = (
  <Heatmap
    {...common}
    data={[]}
    // @ts-expect-error Enabling visibility requires the complete localized label contract.
    visibilityLabels={{hideRow: (label) => `Hide ${label}`}}
  />
);

const explorationLabels = {
  overview: 'Overview',
  closeOverview: 'Close overview',
  done: 'Done',
  reset: 'Reset view',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  panLeft: 'Left',
  panRight: 'Right',
  panUp: 'Up',
  panDown: 'Down',
  window: 'Visible cells',
  instructions: 'Move the window or resize a corner.',
  corner: (corner: string) => `Resize ${corner}`,
  range: (window: {x: readonly string[]; y: readonly string[]}) =>
    `${window.x.join(' to ')} / ${window.y.join(' to ')}`,
};

export const exploringHeatmap = (
  <Heatmap
    {...common}
    data={[]}
    exploration={{
      labels: explorationLabels,
      window: {x: ['morning', 'morning'], y: ['north', 'north']},
      onWindowChange: ({x, y}) => {
        const columnId: string = x[0];
        const rowId: string = y[0];
        void [columnId, rowId];
      },
    }}
  />
);

export const invalidHeatmapExploration = (
  <Heatmap
    {...common}
    data={[]}
    // @ts-expect-error Controlled exploration requires its change callback.
    exploration={{
      labels: explorationLabels,
      window: {x: ['morning', 'morning'], y: ['north', 'north']},
    }}
  />
);
export const numericHeatmapExploration = (
  <Heatmap
    {...common}
    data={[]}
    exploration={{
      labels: explorationLabels,
      // @ts-expect-error Heatmap windows use column and row identifiers rather than numeric indices.
      defaultWindow: {x: [0, 1], y: [0, 1]},
    }}
  />
);
