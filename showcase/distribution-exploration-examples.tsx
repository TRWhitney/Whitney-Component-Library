import {useState} from 'react';
import {
  BoxPlot,
  Histogram,
  SegmentedControl,
  Stack,
  Switch,
  type BoxPlotInteraction,
  type ChartDomainValue,
  type ChartExplorationLabels,
  type HistogramInteraction,
} from '../src/index.js';

const groups = [
  {id: 'north', label: 'North'},
  {id: 'south', label: 'South'},
  {id: 'east', label: 'East'},
  {id: 'west', label: 'West'},
] as const;
const observations = Array.from({length: 64}, (_, index) => ({
  id: `reading-${index}`,
  group: groups[index % groups.length]!.id,
  latency: index % 17 === 0 ? 130 + index : 18 + ((index * 19) % 64),
}));
const copy = {
  data: observations,
  dataTableLabel: 'All latency distributions',
  emptyState: {title: 'No readings', description: 'Record latency readings.'},
  invalidData: {title: 'Invalid readings', description: 'Correct invalid latency readings.'},
};
function labels<Value extends ChartDomainValue>(
  format: (value: Value) => string,
): ChartExplorationLabels<Value> {
  return {
    overview: 'Overview',
    closeOverview: 'Close overview',
    done: 'Done',
    reset: 'Reset view',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    panBackward: 'Earlier',
    panForward: 'Later',
    window: 'Visible distribution',
    start: 'First visible value',
    end: 'Last visible value',
    instructions:
      'Drag the window to move it or drag an edge to resize it. Arrow keys adjust the focused window or edge.',
    range: ([first, last]) => `${format(first)} to ${format(last)}`,
  };
}
const histogramLabels = labels<number>((value) => `${Math.round(value)} ms`);
const boxLabels = labels<string>((id) => groups.find((group) => group.id === id)?.label ?? id);
const selectionCopy = {
  instructions:
    'Tap to select. Drag to select distributions. Control/Command-click or hold to open details. Use two fingers to pan and pinch to zoom.',
  clear: 'Clear selection',
  empty: 'Nothing selected',
  summary: (count: number) => `${count} items selected`,
  hidden: (label: string) => `${label} (hidden)`,
};

export function DistributionExplorationExample() {
  const [mode, setMode] = useState<'histogram' | 'box'>('histogram');
  const [compact, setCompact] = useState(false);
  const [details, setDetails] = useState('');
  const histogramInteraction: HistogramInteraction<(typeof observations)[number]> = {
    onActivate: ({item, value}) =>
      setDetails(`${item.lower} to ${item.upper} ms: ${value} readings.`),
    selection: {labels: {...selectionCopy, item: (item) => `${item.lower} to ${item.upper} ms`}},
  };
  const boxInteraction: BoxPlotInteraction<(typeof observations)[number]> = {
    getOutlierId: (context) =>
      context.kind === 'raw' ? context.datum.id : String(context.outlierIndex),
    onActivate: (item) =>
      setDetails(
        item.kind === 'summary'
          ? `${boxLabels.range([item.item.groupId, item.item.groupId])}: median ${item.summary.median} ms.`
          : `${item.item.groupId}: outlier ${item.value} ms.`,
      ),
    selection: {
      labels: {
        ...selectionCopy,
        item: (item) =>
          item.kind === 'summary'
            ? `${groups.find((group) => group.id === item.groupId)!.label} distribution`
            : `${groups.find((group) => group.id === item.groupId)!.label} outlier ${item.outlierId}`,
      },
    },
  };
  return (
    <Stack gap="regular">
      <SegmentedControl
        label="Distribution chart type"
        value={mode}
        onChange={(next) => {
          setMode(next);
          setDetails('');
        }}
        options={[
          {label: 'Histogram', value: 'histogram'},
          {label: 'Box plot', value: 'box'},
        ]}
      />
      <Switch label="Compact container" isSelected={compact} onChange={setCompact} />
      <p>
        Pan and zoom with the buttons or two fingers. Overview shows the complete distribution.
        Histograms keep the original bins and counts. Box plots show whole groups, including every
        whisker and outlier. Use the eyes to hide or restore a group.
      </p>
      <div key={mode} style={{maxWidth: compact ? '22rem' : undefined}}>
        {mode === 'histogram' ? (
          <Histogram
            {...copy}
            title="Request latency"
            description="Latency readings grouped into fixed twenty-millisecond bins."
            distribution={{
              kind: 'raw',
              accessor: 'latency',
              thresholds: [20, 40, 60, 80, 100, 120, 140, 160, 180],
            }}
            xAxis={{label: 'Latency', unit: 'ms', scale: {type: 'linear', domain: [0, 200]}}}
            yAxis={{label: 'Readings', scale: {type: 'linear'}}}
            exploration={{labels: histogramLabels, defaultWindow: [20, 100]}}
            interaction={histogramInteraction}
          />
        ) : (
          <BoxPlot
            {...copy}
            title="Latency by region"
            description="Each region retains its complete latency summary and outliers."
            groupAccessor="group"
            groups={groups}
            legend={{label: 'Regions'}}
            distribution={{kind: 'raw', valueAccessor: 'latency', whisker: 'tukey'}}
            xAxis={{label: 'Region'}}
            yAxis={{label: 'Latency', unit: 'ms', scale: {type: 'linear'}}}
            exploration={{labels: boxLabels, defaultWindow: ['south', 'east']}}
            interaction={boxInteraction}
            visibilityLabels={{
              hideSeries: (name) => `Hide ${name}`,
              showSeries: (name) => `Show ${name}`,
              hidden: 'Hidden',
              showAll: 'Show all',
              allHidden: {
                title: 'All regions hidden',
                description: 'Use an eye to restore a region.',
              },
            }}
          />
        )}
      </div>
      {details ? <p role="status">{details}</p> : null}
    </Stack>
  );
}
