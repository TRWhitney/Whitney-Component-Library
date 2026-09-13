import {ChartFrame, ChartSizeControl} from './chart-presentation.js';
import {useState} from 'react';
import {
  BoxPlot,
  Button,
  Histogram,
  InlineGroup,
  Stack,
  type BoxPlotSelectionItem,
  type ChartSelectionLabels,
  type HistogramSelectionItem,
} from '../src/index.js';

const bins = [
  {lower: 0, upper: 10, count: 3},
  {lower: 10, upper: 20, count: 8},
  {lower: 20, upper: 30, count: 6},
  {lower: 30, upper: 40, count: 2},
];
const summaries = [
  {
    group: 'north',
    lower: 25,
    q1: 35,
    median: 42,
    q3: 50,
    upper: 62,
    outliers: [85],
    ids: ['north-slow'],
  },
  {
    group: 'south',
    lower: 35,
    q1: 45,
    median: 52,
    q3: 62,
    upper: 76,
    outliers: [95],
    ids: ['south-slow'],
  },
];
const groups = [
  {id: 'north', label: 'North'},
  {id: 'south', label: 'South'},
] as const;
function selectionLabels<Item>(item: (value: Item) => string): ChartSelectionLabels<Item> {
  return {
    instructions:
      'Tap to select. Drag to select an area. Control/Command-click or hold to open details.',
    clear: 'Clear selection',
    empty: 'Nothing selected',
    summary: (count) => `${count} ${count === 1 ? 'item' : 'items'} selected`,
    item,
    hidden: (label) => `${label} (hidden)`,
  };
}

export function DistributionDataMotionExample({kind}: {readonly kind: 'histogram' | 'box'}) {
  const [updated, setUpdated] = useState(false);
  const [compact, setCompact] = useState(false);
  const [details, setDetails] = useState('');
  const histogramData = bins.map((bin, index) => ({
    ...bin,
    count: updated ? [7, 5, 11, 4][index]! : bin.count,
  }));
  const boxData = summaries.map((summary, index) => {
    const factor = updated ? (index === 0 ? 1.5 : 0.85) : 1;
    return {
      ...summary,
      lower: summary.lower * factor,
      q1: summary.q1 * factor,
      median: summary.median * factor,
      q3: summary.q3 * factor,
      upper: summary.upper * factor,
      outliers: summary.outliers.map((value) => value * factor),
    };
  });
  const common = {
    dataTableLabel: 'Current distribution values',
    emptyState: {title: 'No readings', description: 'Add readings to see their distribution.'},
    invalidData: {title: 'Invalid readings', description: 'Correct the recorded values.'},
    minimumSize: {width: 260, height: 180},
    overflow: 'clip' as const,
  };
  return (
    <Stack gap="regular">
      <p>
        {kind === 'histogram'
          ? 'Select an interval, then update its count. The selected frame follows the bar as the count and axis change.'
          : 'Select a summary or outlier, then update its values. The box and outlier rings follow the same groups and outlier IDs.'}{' '}
        The table and details report the supplied values throughout the transition.
      </p>
      <ChartSizeControl compact={compact} onChange={setCompact} />
      <InlineGroup gap="tight" wrap>
        <Button variant="secondary" onPress={() => setUpdated((value) => !value)}>
          Update values
        </Button>
        <Button
          variant="quiet"
          onPress={() => {
            setUpdated(false);
            setDetails('');
          }}
        >
          Reset
        </Button>
      </InlineGroup>
      <ChartFrame compact={compact}>
        {kind === 'histogram' ? (
          <Histogram
            {...common}
            title="Changing restart counts"
            description="Restarts grouped into fixed ten-minute intervals."
            data={histogramData}
            distribution={{
              kind: 'binned',
              lowerAccessor: 'lower',
              upperAccessor: 'upper',
              ordinateAccessor: 'count',
              ordinate: 'count',
            }}
            xAxis={{label: 'Time', unit: 'min', scale: {type: 'linear', domain: [0, 40]}}}
            yAxis={{label: 'Restarts', scale: {type: 'linear'}}}
            interaction={{
              selection: {
                labels: selectionLabels<HistogramSelectionItem>(
                  (item) => `${item.lower} to ${item.upper} min`,
                ),
              },
              onActivate: ({item, value}) =>
                setDetails(`${item.lower} to ${item.upper} min: ${value} restarts.`),
            }}
          />
        ) : (
          <BoxPlot
            {...common}
            title="Changing recovery times"
            description="Supplied recovery-time summaries and individually identified slow recoveries."
            data={boxData}
            groups={groups}
            groupAccessor="group"
            distribution={{
              kind: 'summary',
              lowerWhiskerAccessor: 'lower',
              q1Accessor: 'q1',
              medianAccessor: 'median',
              q3Accessor: 'q3',
              upperWhiskerAccessor: 'upper',
              outliersAccessor: 'outliers',
              whisker: 'tukey',
            }}
            xAxis={{label: 'Region'}}
            yAxis={{label: 'Recovery time', unit: 'min', scale: {type: 'linear'}}}
            legend={{label: 'Regions'}}
            visibilityLabels={{
              hideSeries: (label) => `Hide ${label}`,
              showSeries: (label) => `Show ${label}`,
              hidden: 'Hidden',
              showAll: 'Show all',
              allHidden: {
                title: 'All regions hidden',
                description: 'Open an eye to restore a region.',
              },
            }}
            interaction={{
              getOutlierId: (context) =>
                context.kind === 'summary'
                  ? context.datum.ids[context.outlierIndex]!
                  : context.datum.group,
              selection: {
                labels: selectionLabels<BoxPlotSelectionItem>(
                  (item) =>
                    `${groups.find((group) => group.id === item.groupId)?.label ?? item.groupId} ${item.kind === 'summary' ? 'summary' : 'slow recovery'}`,
                ),
              },
              onActivate: (event) => {
                const group =
                  groups.find((group) => group.id === event.item.groupId)?.label ??
                  event.item.groupId;
                setDetails(
                  event.kind === 'summary'
                    ? `${group}: median ${event.summary.median} min.`
                    : `${group}: slow recovery ${event.value} min.`,
                );
              },
            }}
          />
        )}
      </ChartFrame>
      {details ? <p role="status">{details}</p> : null}
    </Stack>
  );
}
