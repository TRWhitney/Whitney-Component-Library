import {ChartFrame, ChartSizeControl} from './chart-presentation.js';
import {useState} from 'react';
import {
  BarChart,
  InlineGroup,
  Button,
  CartesianChart,
  SegmentedControl,
  Stack,
  type ChartInteraction,
} from '../src/index.js';

const initial = [
  {id: 'north', label: 'North', value: 48, cost: 29, lower: 35, upper: 62},
  {id: 'south', label: 'South', value: 32, cost: 23, lower: 21, upper: 43},
  {id: 'east', label: 'East', value: 67, cost: 38, lower: 49, upper: 76},
  {id: 'west', label: 'West', value: 41, cost: 31, lower: 33, upper: 54},
];
type Row = (typeof initial)[number];
type Kind = 'columns' | 'bars' | 'line' | 'area' | 'range';

export function CartesianDataMotionExample() {
  const [kind, setKind] = useState<Kind>('columns');
  const [data, setData] = useState(initial);
  const [revision, setRevision] = useState(0);
  const [compact, setCompact] = useState(false);
  const [details, setDetails] = useState('');
  const bars = kind === 'columns' || kind === 'bars';
  const interaction: ChartInteraction<Row, string> = {
    target: 'category',
    getRowId: (row) => row.id,
    onActivate: (reading) =>
      setDetails(
        `${reading.category}: ${reading.values.map((v) => `${v.label} ${v.value}`).join(', ')}${reading.ranges?.map((r) => `, ${r.label} ${r.lower} to ${r.upper}`).join('') ?? ''}`,
      ),
    selection: {
      labels: {
        instructions:
          'Tap to select. Drag to replace selection. Control/Command-click or hold to open details.',
        clear: 'Clear selection',
        empty: 'Nothing selected',
        summary: (n) => `${n} selected`,
        item: (item) => data.find((row) => row.id === item.rowId)?.label ?? item.rowId,
        hidden: (label) => `${label} (hidden)`,
      },
    },
  };
  const common = {
    data,
    interaction,
    minimumSize: {width: 260, height: 180},
    title: 'Building energy',
    description: 'Recorded use and operating costs by building.',
    dataTableLabel: 'Current building records',
    emptyState: {title: 'No buildings', description: 'Reset to restore the records.'},
    invalidData: {title: 'Invalid records', description: 'Check the building values.'},
    legend: {label: 'Measures'},
    visibilityLabels: {
      hidden: 'Hidden',
      hideSeries: (s: string) => `Hide ${s}`,
      showSeries: (s: string) => `Show ${s}`,
      showAll: 'Show all measures',
      allHidden: {
        title: 'All measures hidden',
        description: 'Restore a measure to see its values.',
      },
    },
  };
  const categoryAxis = {
    accessor: 'label',
    label: 'Building',
    scale: {type: 'categorical'},
  } as const;
  const valueAxis = {label: 'Energy', scale: {type: 'linear'}} as const;
  return (
    <Stack gap="regular">
      <SegmentedControl
        reserveSupportSpace={false}
        label="Chart type"
        value={kind}
        onChange={setKind}
        options={[
          {label: 'Columns', value: 'columns'},
          {label: 'Bars', value: 'bars'},
          {label: 'Line', value: 'line'},
          {label: 'Area', value: 'area'},
          {label: 'Line + range', value: 'range'},
        ]}
      />
      <p>
        Update values while a building is selected. The chart moves to the new values; details and
        the table report them immediately.
      </p>
      <InlineGroup gap="tight">
        <Button
          variant="secondary"
          onPress={() => {
            setRevision(revision + 1);
            setData((rows) =>
              rows.map((row, i) => {
                const change = (revision % 2 ? -1 : 1) * [17, -9, 23, -12, 8][i % 5]!;
                return {
                  ...row,
                  value: Math.max(4, row.value + change),
                  cost: Math.max(2, row.cost + Math.round(change / 2)),
                  lower: Math.max(0, row.lower + change),
                  upper: Math.max(5, row.upper + change),
                };
              }),
            );
          }}
        >
          Update values
        </Button>
        {bars ? (
          <>
            <Button
              variant="secondary"
              isDisabled={data.some((r) => r.id === 'annex')}
              onPress={() =>
                setData((rows) => [
                  ...rows,
                  {id: 'annex', label: 'Annex', value: 55, cost: 35, lower: 40, upper: 65},
                ])
              }
            >
              Add building
            </Button>
            <Button
              variant="secondary"
              isDisabled={data.length < 2}
              onPress={() =>
                setData((rows) =>
                  rows.filter(
                    (row) => row.id !== [...rows].sort((a, b) => b.value - a.value)[0]?.id,
                  ),
                )
              }
            >
              Remove largest
            </Button>
            <Button variant="secondary" onPress={() => setData((rows) => [...rows].reverse())}>
              Reverse order
            </Button>
          </>
        ) : null}
        <Button
          variant="secondary"
          onPress={() => {
            setData(initial);
            setRevision(0);
          }}
        >
          Reset data
        </Button>
      </InlineGroup>
      <ChartSizeControl compact={compact} onChange={setCompact} />
      <ChartFrame compact={compact}>
        {kind === 'bars' ? (
          <BarChart
            {...common}
            xAxis={valueAxis}
            yAxis={categoryAxis}
            series={[
              {id: 'value', label: 'Use', accessor: 'value'},
              {id: 'cost', label: 'Cost', accessor: 'cost'},
            ]}
          />
        ) : (
          <CartesianChart
            {...common}
            key={kind}
            xAxis={categoryAxis}
            yAxis={valueAxis}
            series={
              kind === 'range'
                ? [
                    {id: 'value', label: 'Use', kind: 'line', accessor: 'value', showPoints: true},
                    {
                      id: 'range',
                      label: 'Expected range',
                      kind: 'range',
                      lowerAccessor: 'lower',
                      upperAccessor: 'upper',
                    },
                  ]
                : [
                    {
                      id: 'value',
                      label: 'Use',
                      kind: kind === 'columns' ? 'column' : kind,
                      accessor: 'value',
                    },
                    {
                      id: 'cost',
                      label: 'Cost',
                      kind: kind === 'columns' ? 'column' : kind,
                      accessor: 'cost',
                    },
                  ]
            }
          />
        )}
      </ChartFrame>
      {details ? <p role="status">{details}</p> : null}
    </Stack>
  );
}
