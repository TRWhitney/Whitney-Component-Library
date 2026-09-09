import {Sparkline, type SparklinePositionScale} from '../src/index.js';

interface Reading {
  readonly at: Date;
  readonly label: string;
  readonly sequence: number;
  readonly value?: number | null;
}

const data: readonly Reading[] = [
  {at: new Date('2026-01-01T00:00:00Z'), label: 'Jan', sequence: 1, value: 4},
];
const labels = {
  first: 'First',
  highest: 'Highest',
  last: 'Last',
  lowest: 'Lowest',
  missing: 'No reading',
} as const;
const common = {
  data,
  dataTableLabel: 'Reading history',
  description: 'Recorded readings over time.',
  emptyState: {description: 'Add readings.', title: 'No history'},
  invalidData: {description: 'Correct invalid readings.', title: 'Invalid history'},
  labels,
  title: 'Readings',
  value: {accessor: 'value', label: 'Reading', unit: 'units'},
} as const;

const timeScale: SparklinePositionScale<Date> = {type: 'time'};

export const categoricalSparkline = (
  <Sparkline
    {...common}
    position={{accessor: 'label', label: 'Month', scale: {type: 'categorical'}}}
  />
);

export const numericSparkline = (
  <Sparkline
    {...common}
    position={{accessor: 'sequence', label: 'Sequence', scale: {type: 'linear'}}}
    valueRange={[0, 10]}
  />
);

export const timeSparkline = (
  <Sparkline {...common} position={{accessor: 'at', label: 'Date', scale: timeScale}} />
);

export const callbackSparkline = (
  <Sparkline
    {...common}
    position={{accessor: (item) => item.at, label: 'Date', scale: {type: 'time'}}}
    value={{...common.value, accessor: (item) => item.value}}
  />
);

export const invalidValueAccessor = (
  <Sparkline
    {...common}
    position={{accessor: 'label', label: 'Month', scale: {type: 'categorical'}}}
    value={{
      // @ts-expect-error Sparkline values must be numeric or missing.
      accessor: 'label',
      label: 'Reading',
    }}
  />
);

export const invalidPositionScale = (
  <Sparkline
    {...common}
    position={{
      accessor: 'sequence',
      label: 'Sequence',
      // @ts-expect-error Normalization is not an ordered Sparkline position scale.
      scale: {type: 'normalized'},
    }}
  />
);

export const invalidRange = (
  <Sparkline
    {...common}
    position={{accessor: 'label', label: 'Month', scale: {type: 'categorical'}}}
    // @ts-expect-error A fixed value range contains exactly two values.
    valueRange={[0, 5, 10]}
  />
);

export const rendererInjection = (
  <Sparkline
    {...common}
    // @ts-expect-error Sparkline owns its renderer and does not accept custom marks.
    children={<circle />}
    position={{accessor: 'label', label: 'Month', scale: {type: 'categorical'}}}
  />
);

export const interactiveSparkline = (
  <Sparkline
    {...common}
    position={{accessor: 'at', label: 'Date', scale: timeScale}}
    interaction={{
      getRowId: (item) => item.label,
      onActivate: (event) => {
        const position: Date = event.position;
        const value: number = event.value;
        const record: Reading = event.datum;
        const rowId: string = event.item.rowId;
        void [position, value, record, rowId];
        // @ts-expect-error The activation position retains its declared type.
        const wrong: string = event.position;
        void wrong;
      },
      selection: {
        selectedItems: [{rowId: 'Jan'}],
        onSelectionChange: (items) => {
          const rowId: string | undefined = items[0]?.rowId;
          void rowId;
        },
        labels: {
          instructions: 'Select readings.',
          clear: 'Clear',
          empty: 'None',
          item: (item) => item.rowId,
          summary: String,
          hidden: (label) => label,
        },
      },
    }}
  />
);

export const missingInteractionIdentity = (
  <Sparkline
    {...common}
    position={{accessor: 'at', label: 'Date', scale: timeScale}}
    // @ts-expect-error Interactive readings require stable application IDs.
    interaction={{onActivate: () => {}}}
  />
);
