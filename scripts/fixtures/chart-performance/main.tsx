import {memo, useCallback, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  AppearanceProvider,
  BarChart,
  BoxPlot,
  BubbleChart,
  CartesianChart,
  ColumnChart,
  DonutChart,
  Heatmap,
  Histogram,
  PieChart,
  RadarChart,
  ScatterChart,
  Sparkline,
  type ChartDomainValue,
  type ChartExplorationLabels,
  type ChartRectangularExplorationLabels,
  type ChartSelection,
  type RadarChartDimensions,
} from '../../../src/index.js';
import '../../../src/styles.css';

const kinds = [
  'line',
  'columns',
  'bars',
  'scatter',
  'bubble',
  'histogram',
  'box',
  'pie',
  'donut',
  'radar',
  'heatmap',
  'sparkline',
] as const;
type Kind = (typeof kinds)[number];
const requestedKind = new URLSearchParams(location.search).get('kind') ?? 'line';
if (!kinds.includes(requestedKind as Kind)) throw new Error(`Unknown chart kind: ${requestedKind}`);
const kind = requestedKind as Kind;

// Both revisions are allocated once. Selection, reading and navigation retain the
// exact data and accessor references supplied to the production chart.
function rows(count: number, revision: number) {
  return Array.from({length: count}, (_, index) => ({
    id: `reading-${index + 1}`,
    label: `C${index + 1}`,
    x: index,
    a: 45 + 18 * Math.sin(index * 0.19 + revision) + revision * 7,
    b: 70 + 23 * Math.cos(index * 0.13 + revision) - revision * 11,
    c: 100 + 20 * Math.sin(index * 0.07 + revision * 2) + revision * 13,
  }));
}
const lineData = [rows(240, 0), rows(240, 1)] as const;
const categoryData = [rows(24, 0), rows(24, 1)] as const;
const series = [
  {id: 'a', label: 'Series A', accessor: 'a'},
  {id: 'b', label: 'Series B', accessor: 'b'},
  {id: 'c', label: 'Series C', accessor: 'c'},
] as const;
const lineSeries = series.map((item) => ({...item, kind: 'line', showPoints: true}) as const) as [
  (typeof series)[0] & {kind: 'line'; showPoints: true},
  (typeof series)[1] & {kind: 'line'; showPoints: true},
  (typeof series)[2] & {kind: 'line'; showPoints: true},
];
const pointData = [0, 1].map((revision) =>
  Array.from({length: 500}, (_, index) => ({
    id: `point-${index + 1}`,
    label: `Point ${index + 1}`,
    series: series[index % 3]!.id,
    x: 5 + ((index * 137) % 991) / 10 + revision * Math.sin(index) * 3,
    y: 10 + ((index * 317) % 977) / 10 + revision * Math.cos(index) * 8,
    magnitude: 5 + ((index * 19 + revision * 7) % 40),
  })),
);
const binData = [0, 1].map((revision) =>
  Array.from({length: 50}, (_, index) => ({
    lower: index * 2,
    upper: (index + 1) * 2,
    count: 10 + ((index * 13 + revision * 17) % 60),
  })),
);
// Six is the public NonEmptyChartSeries limit for box groups.
const boxGroups = [
  {id: 'g1', label: 'Group 1'},
  {id: 'g2', label: 'Group 2'},
  {id: 'g3', label: 'Group 3'},
  {id: 'g4', label: 'Group 4'},
  {id: 'g5', label: 'Group 5'},
  {id: 'g6', label: 'Group 6'},
] as const;
const boxData = [0, 1].map((revision) =>
  boxGroups.map((group, index) => {
    const offset = index * 4 + revision * (index % 2 ? -7 : 11);
    return {
      group: group.id,
      low: 20 + offset,
      q1: 35 + offset,
      median: 44 + offset,
      q3: 57 + offset,
      high: 72 + offset,
      outliers: [94 + offset, 103 + offset, 115 + offset],
    };
  }),
);
const radialData = [0, 1].map((revision) =>
  Array.from({length: 24}, (_, index) => ({
    id: `category-${index + 1}`,
    label: `Category ${index + 1}`,
    value: 100 - index * 3 + revision * (index % 2 ? -1 : 1),
  })),
);
type Profile = {id: string; label: string; values: readonly number[]};
const dimensions: RadarChartDimensions<Profile> = [
  {id: 'd1', label: 'D1', accessor: (row) => row.values[0]},
  {id: 'd2', label: 'D2', accessor: (row) => row.values[1]},
  {id: 'd3', label: 'D3', accessor: (row) => row.values[2]},
  ...Array.from({length: 5}, (_, index) => ({
    id: `d${index + 4}`,
    label: `D${index + 4}`,
    accessor: (row: Profile) => row.values[index + 3],
  })),
];
function profile(index: number, revision: number): Profile {
  return {
    id: `profile-${index + 1}`,
    label: `Profile ${index + 1}`,
    values: Array.from(
      {length: 8},
      (_, dimension) => 25 + ((index * 17 + dimension * 11 + revision * 23) % 70),
    ),
  };
}
const radarData = [0, 1].map(
  (revision) =>
    [
      profile(0, revision),
      profile(1, revision),
      profile(2, revision),
      profile(3, revision),
    ] as const,
);
const heatRows = Array.from({length: 24}, (_, index) => ({
  id: `r${index + 1}`,
  label: `R${index + 1}`,
}));
const heatColumns = Array.from({length: 24}, (_, index) => ({
  id: `c${index + 1}`,
  label: `C${index + 1}`,
}));
const heatData = [0, 1].map((revision) =>
  heatRows.flatMap((row, rowIndex) =>
    heatColumns.map((column, columnIndex) => ({
      row: row.id,
      column: column.id,
      value: 5 + ((rowIndex * 17 + columnIndex * 7 + revision * 29) % 95),
    })),
  ),
);

const common = {
  dataTableLabel: 'Current readings',
  description: 'Deterministic production chart performance fixture.',
  emptyState: {title: 'No readings', description: 'Supply readings to display the chart.'},
  invalidData: {title: 'Invalid readings', description: 'Check the supplied chart values.'},
  minimumSize: {width: 260, height: 240},
};
const visibilityLabels = {
  hideSeries: (label: string) => `Hide ${label}`,
  showSeries: (label: string) => `Show ${label}`,
  hidden: 'Hidden',
  showAll: 'Show all',
  allHidden: {title: 'All series hidden', description: 'Show a series to restore the chart.'},
};
const selectionCopy = {
  instructions:
    'Click or press Enter to select. Control-click or Control-Enter opens details. Arrow keys move between readings.',
  clear: 'Clear selection',
  empty: 'Nothing selected',
  summary: (count: number) => `${count} selected`,
  hidden: (label: string) => `${label} (hidden)`,
};
function selection<Item>(
  onSelectionChange: () => void,
  item: (value: Item) => string,
): ChartSelection<Item> {
  return {onSelectionChange, labels: {...selectionCopy, item}};
}
function explorationLabels<Value extends ChartDomainValue>(
  vertical = false,
): ChartExplorationLabels<Value> {
  return {
    overview: 'Overview',
    closeOverview: 'Close overview',
    done: 'Done',
    reset: 'Reset view',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    panBackward: vertical ? 'Pan up' : 'Pan left',
    panForward: vertical ? 'Pan down' : 'Pan right',
    window: 'Visible range',
    start: 'Range start',
    end: 'Range end',
    instructions: 'Drag the window or an edge. Arrow keys move the focused window or edge.',
    range: ([start, end]) => `${String(start)} to ${String(end)}`,
  };
}
function rectangularLabels<
  X extends ChartDomainValue,
  Y extends ChartDomainValue,
>(): ChartRectangularExplorationLabels<X, Y> {
  return {
    overview: 'Overview',
    closeOverview: 'Close overview',
    done: 'Done',
    reset: 'Reset view',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    panLeft: 'Pan left',
    panRight: 'Pan right',
    panUp: 'Pan up',
    panDown: 'Pan down',
    window: 'Visible range',
    instructions: 'Drag the window or a corner. Arrow keys move the focused window or corner.',
    corner: (corner) => `Resize ${corner.replace('-', ' ')} corner`,
    range: ({x, y}) => `${String(x[0])} to ${String(x[1])}, ${String(y[0])} to ${String(y[1])}`,
  };
}
const valueAxis = {label: 'Value', scale: {type: 'linear'}} as const;
const categoryAxis = {
  accessor: 'label',
  label: 'Category',
  scale: {type: 'categorical'},
  tickCount: 6,
} as const;

interface FixtureChartProps {
  kind: Kind;
  revision: number;
  onSelectionChange: () => void;
  onWindowChange: () => void;
  onActivate: () => void;
}
// Counters belong to the fixture parent. They do not rerender this component or
// replace any chart configuration during selection, activation or exploration.
const FixtureChart = memo(function FixtureChart({
  kind,
  revision,
  onSelectionChange,
  onWindowChange,
  onActivate,
}: FixtureChartProps) {
  const version = revision % 2;
  const shared = {...common, title: `${kind} performance`};
  const legend = {label: 'Series'};
  const exploration = {labels: explorationLabels<number>(), onWindowChange};
  const categoricalExploration = {
    labels: explorationLabels<string>(kind === 'bars'),
    onWindowChange,
  };
  const rectangularExploration = {labels: rectangularLabels<number, number>(), onWindowChange};
  const cartesianInteraction = {
    target: 'point' as const,
    getRowId: (row: (typeof lineData)[0][number]) => row.id,
    onActivate,
    selection: selection<{rowId: string; seriesId?: string}>(
      onSelectionChange,
      (item) => `${item.rowId}, ${item.seriesId ?? 'all series'}`,
    ),
  };
  if (kind === 'line')
    return (
      <CartesianChart
        {...shared}
        data={lineData[version]!}
        series={lineSeries}
        xAxis={{accessor: 'x', label: 'Reading', scale: {type: 'linear'}, tickCount: 6}}
        yAxis={valueAxis}
        legend={legend}
        visibilityLabels={visibilityLabels}
        exploration={exploration}
        interaction={cartesianInteraction}
      />
    );
  if (kind === 'columns')
    return (
      <ColumnChart
        {...shared}
        data={categoryData[version]!}
        series={series}
        xAxis={categoryAxis}
        yAxis={valueAxis}
        layout="grouped"
        legend={legend}
        visibilityLabels={visibilityLabels}
        exploration={categoricalExploration}
        interaction={cartesianInteraction}
      />
    );
  if (kind === 'bars')
    return (
      <BarChart
        {...shared}
        data={categoryData[version]!}
        series={series}
        xAxis={valueAxis}
        yAxis={categoryAxis}
        layout="grouped"
        legend={legend}
        visibilityLabels={visibilityLabels}
        exploration={categoricalExploration}
        interaction={cartesianInteraction}
      />
    );
  if (kind === 'scatter' || kind === 'bubble') {
    const props = {
      ...shared,
      data: pointData[version]!,
      idAccessor: 'id' as const,
      labelAccessor: 'label' as const,
      series,
      seriesAccessor: 'series' as const,
      legend,
      visibilityLabels,
      xAxis: {accessor: 'x' as const, ...valueAxis},
      yAxis: {accessor: 'y' as const, ...valueAxis},
      exploration: rectangularExploration,
      interaction: {
        onActivate,
        selection: selection<{rowId: string; seriesId?: string}>(
          onSelectionChange,
          (item) => item.rowId,
        ),
      },
    };
    return kind === 'scatter' ? (
      <ScatterChart {...props} />
    ) : (
      <BubbleChart {...props} magnitude={{accessor: 'magnitude', label: 'Magnitude'}} />
    );
  }
  if (kind === 'histogram')
    return (
      <Histogram
        {...shared}
        data={binData[version]!}
        distribution={{
          kind: 'binned',
          lowerAccessor: 'lower',
          upperAccessor: 'upper',
          ordinateAccessor: 'count',
          ordinate: 'count',
        }}
        xAxis={{label: 'Bin', scale: {type: 'linear'}}}
        yAxis={valueAxis}
        exploration={exploration}
        interaction={{
          onActivate,
          selection: selection(onSelectionChange, (item) => `${item.lower} to ${item.upper}`),
        }}
      />
    );
  if (kind === 'box')
    return (
      <BoxPlot
        {...shared}
        data={boxData[version]!}
        groupAccessor="group"
        groups={boxGroups}
        distribution={{
          kind: 'summary',
          lowerWhiskerAccessor: 'low',
          q1Accessor: 'q1',
          medianAccessor: 'median',
          q3Accessor: 'q3',
          upperWhiskerAccessor: 'high',
          outliersAccessor: 'outliers',
          whisker: 'tukey',
        }}
        xAxis={{label: 'Group'}}
        yAxis={valueAxis}
        legend={legend}
        visibilityLabels={visibilityLabels}
        exploration={categoricalExploration}
        interaction={{
          onActivate,
          getOutlierId: (context) =>
            context.kind === 'summary'
              ? `${context.groupId}-outlier-${context.outlierIndex}`
              : context.groupId,
          selection: selection(onSelectionChange, (item) =>
            item.kind === 'summary' ? item.groupId : item.outlierId,
          ),
        }}
      />
    );
  if (kind === 'pie' || kind === 'donut') {
    const props = {
      ...shared,
      data: radialData[version]!,
      idAccessor: 'id' as const,
      labelAccessor: 'label' as const,
      value: {accessor: 'value' as const, label: 'Value'},
      legend,
      visibilityLabels,
      labels: {
        back: 'Previous categories',
        category: 'Category',
        categoryRange: ({start, end, total}: {start: number; end: number; total: number}) =>
          `${start} to ${end} of ${total}`,
        moreCategories: (count: number) => `More categories (${count})`,
        shareOfTotal: 'Share of total',
        shareOnPage: 'Share on page',
      },
      interaction: {
        onActivate,
        selection: {
          ...selection<{id: string}>(onSelectionChange, (item) => item.id),
          containsSelection: 'Contains selection',
        },
      },
    };
    return kind === 'pie' ? <PieChart {...props} /> : <DonutChart {...props} totalLabel="Total" />;
  }
  if (kind === 'radar')
    return (
      <RadarChart
        {...shared}
        data={radarData[version]!}
        idAccessor="id"
        labelAccessor="label"
        dimensions={dimensions}
        labels={{dimension: 'Dimension'}}
        legend={legend}
        visibilityLabels={visibilityLabels}
        value={{label: 'Score'}}
        interaction={{
          target: 'point',
          onActivate,
          selection: selection(
            onSelectionChange,
            (item) => `${item.seriesId ?? 'all profiles'}, ${item.dimensionId}`,
          ),
        }}
      />
    );
  if (kind === 'heatmap')
    return (
      <Heatmap
        {...shared}
        data={heatData[version]!}
        rows={heatRows}
        columns={heatColumns}
        rowAccessor="row"
        columnAccessor="column"
        value={{accessor: 'value', label: 'Value'}}
        scale={{type: 'sequential', color: '#2878ff'}}
        labels={{
          row: 'Row',
          column: 'Column',
          colorKey: 'Value scale',
          missing: 'No reading',
          scrollRegion: 'Reading grid',
        }}
        exploration={{labels: rectangularLabels<string, string>(), onWindowChange}}
        visibilityLabels={{
          manage: 'Manage visibility',
          hideRow: (label) => `Hide row ${label}`,
          showRow: (label) => `Show row ${label}`,
          hideColumn: (label) => `Hide column ${label}`,
          showColumn: (label) => `Show column ${label}`,
          restore: (count) => `Restore ${count} hidden dimensions`,
          hiddenRows: 'Hidden rows',
          hiddenColumns: 'Hidden columns',
          hidden: 'Hidden',
          showAll: 'Show all',
          close: 'Close hidden dimensions',
          allHidden: {
            title: 'No visible cells',
            description: 'Show a row and column to restore the chart.',
          },
        }}
        interaction={{
          onActivate,
          selection: selection(onSelectionChange, (item) => `${item.rowId}, ${item.columnId}`),
        }}
      />
    );
  return (
    <Sparkline
      {...shared}
      data={lineData[version]!}
      minimumSize={{width: 260, height: 96}}
      position={{accessor: 'x', label: 'Reading', scale: {type: 'linear'}}}
      value={{accessor: 'a', label: 'Value'}}
      labels={{
        first: 'First',
        last: 'Last',
        lowest: 'Lowest',
        highest: 'Highest',
        missing: 'No reading',
      }}
      interaction={{
        getRowId: (row) => row.id,
        onActivate,
        selection: selection(onSelectionChange, (item) => item.rowId),
      }}
    />
  );
});

function Fixture() {
  const [revision, setRevision] = useState(0);
  const [selectionCount, setSelectionCount] = useState(0);
  const [windowCount, setWindowCount] = useState(0);
  const [activationCount, setActivationCount] = useState(0);
  const onSelectionChange = useCallback(() => setSelectionCount((value) => value + 1), []);
  const onWindowChange = useCallback(() => setWindowCount((value) => value + 1), []);
  const onActivate = useCallback(() => setActivationCount((value) => value + 1), []);
  return (
    <main data-perf-fixture="" data-kind={kind} data-revision={revision}>
      <div className="perf-toolbar">
        <button type="button" onClick={() => setRevision((value) => value + 1)}>
          Update values
        </button>
      </div>
      <p className="perf-counters">
        Selection callbacks <output data-perf-selection="">{selectionCount}</output>
        {' · '}
        Window callbacks <output data-perf-window="">{windowCount}</output>
        {' · '}
        Activation callbacks <output data-perf-activation="">{activationCount}</output>
      </p>
      <FixtureChart
        kind={kind}
        revision={revision}
        onSelectionChange={onSelectionChange}
        onWindowChange={onWindowChange}
        onActivate={onActivate}
      />
    </main>
  );
}
const root = document.getElementById('root');
if (!root) throw new Error('The chart performance fixture root is missing.');
createRoot(root).render(
  <AppearanceProvider appearance="light" accent="#2878ff">
    <Fixture />
  </AppearanceProvider>,
);
