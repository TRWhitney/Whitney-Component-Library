import {useEffect, useMemo, useState} from 'react';
import {
  IconButton,
  LineChart,
  ScatterChart,
  type ChartLineSeries,
  type ChartRectangularWindow,
  type NonEmptyChartSeries,
} from '@trwhitney/component-library';
import {months, type Building} from './data.js';
import {integer, number} from './energy.js';
import {Icon} from './icons.js';
function extent(records: Building[], key: 'area' | 'intensity'): readonly [number, number] {
  const values = records.map((record) => record[key]);
  if (!values.length) return [0, 1];
  const minimum = Math.min(...values),
    maximum = Math.max(...values);
  // A single value still needs an increasing numeric axis domain.
  return minimum === maximum
    ? [minimum - Math.max(1, minimum * 0.05), maximum + Math.max(1, maximum * 0.05)]
    : [minimum, maximum];
}
function usePlotRatio() {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [ratio, setRatio] = useState(2.5);
  useEffect(() => {
    if (!element) return;
    const pane = element.closest('.analysis-scroll');
    if (!pane) return;
    const measure = () =>
      setRatio(
        Math.max(
          1,
          Math.min(
            4,
            element.clientWidth /
              Math.max(
                220,
                pane.clientHeight -
                  (element.getBoundingClientRect().top -
                    pane.getBoundingClientRect().top +
                    pane.scrollTop) -
                  180,
              ),
          ),
        ),
      );
    const observer = new ResizeObserver(measure);
    observer.observe(pane);
    measure();
    return () => observer.disconnect();
  }, [element]);
  return {ref: setElement, ratio};
}
const rectangleLabels = {
  overview: 'Distribution overview',
  closeOverview: 'Close distribution overview',
  done: 'Done',
  reset: 'Fit all buildings',
  zoomIn: 'Zoom distribution in',
  zoomOut: 'Zoom distribution out',
  panLeft: 'Pan distribution left',
  panRight: 'Pan distribution right',
  panUp: 'Pan distribution up',
  panDown: 'Pan distribution down',
  window: 'Visible building range',
  instructions: 'Drag the window or its corners. Arrow keys move the view.',
  corner: (corner: string) => `Resize ${corner.replaceAll('-', ' ')} corner`,
  range: (window: ChartRectangularWindow<number, number>) =>
    `${integer.format(window.x[0])}–${integer.format(window.x[1])} m² · ${integer.format(window.y[0])}–${integer.format(window.y[1])} kWh/m²`,
};
export function Distribution({
  records,
  active,
  onInspect,
}: {
  records: Building[];
  active: Building | undefined;
  onInspect: (id: string) => void;
}) {
  const plot = usePlotRatio();
  const full = useMemo(
    () => ({x: extent(records, 'area'), y: extent(records, 'intensity')}),
    [records],
  );
  const [window, setWindow] = useState<ChartRectangularWindow<number, number>>(full);
  useEffect(() => setWindow(full), [full]);
  return (
    <div className="chart-work" data-feedback="Distribution chart">
      <div className="plot-host" ref={plot.ref}>
        <ScatterChart
          data={records}
          idAccessor="id"
          labelAccessor="name"
          seriesAccessor={(record) => (record.id === active?.id ? 'current' : record.kind)}
          series={[
            {id: 'current', label: 'Current'},
            {id: 'Office', label: 'Office'},
            {id: 'Laboratory', label: 'Laboratory'},
            {id: 'Library', label: 'Library'},
          ]}
          title="Energy distribution"
          description="2025 · Annual energy intensity"
          dataTableLabel="Building distribution readings"
          aspectRatio={plot.ratio}
          minimumSize={{width: 250, height: 170}}
          legend={{label: 'Building use'}}
          xAxis={{
            accessor: 'area',
            label: 'Floor area',
            unit: 'm²',
            tickCount: 4,
            formatTick: (value) =>
              value >= 1000 ? `${number.format(value / 1000)}k` : integer.format(value),
            scale: {type: 'linear', domain: full.x},
          }}
          yAxis={{
            accessor: 'intensity',
            label: 'Energy',
            unit: 'kWh/m²',
            tickCount: 4,
            scale: {type: 'linear', domain: full.y},
          }}
          interaction={{onActivate: ({datum}) => onInspect(datum.id)}}
          exploration={{window, onWindowChange: setWindow, labels: rectangleLabels}}
          emptyState={{title: 'No matching buildings', description: 'Clear the building filters.'}}
          invalidData={{title: 'Invalid readings', description: 'Load the sample readings again.'}}
        />
      </div>
    </div>
  );
}
type MonthlyDatum = {month: string; values: Record<string, number>};
const monthlyLabels = {
  overview: 'Monthly overview',
  closeOverview: 'Close monthly overview',
  done: 'Done',
  reset: 'Show full year',
  zoomIn: 'Zoom monthly view in',
  zoomOut: 'Zoom monthly view out',
  panBackward: 'Earlier months',
  panForward: 'Later months',
  window: 'Visible months',
  start: 'First month',
  end: 'Last month',
  instructions: 'Drag the window edges to change the visible months.',
  range: (window: readonly [string, string]) => `${window[0]}–${window[1]}`,
};
export function Monthly({
  records,
  onInspect,
}: {
  records: Building[];
  onInspect: (id: string) => void;
}) {
  const plot = usePlotRatio();
  const [window, setWindow] = useState<readonly [string, string]>(['Jan', 'Dec']);
  const [reading, setReading] = useState<{id: string; month: string; value: number} | null>(null);
  const inspectedBuilding = records.find((record) => record.id === reading?.id);
  const data = useMemo<MonthlyDatum[]>(
    () =>
      months.map((month, index) => ({
        month,
        values: Object.fromEntries(records.map((record) => [record.id, record.monthly[index]!])),
      })),
    [records],
  );
  const series = records.map((record) => ({
    id: record.id,
    label: record.name,
    showPoints: true,
    accessor: (datum: MonthlyDatum) => datum.values[record.id]!,
  })) as unknown as NonEmptyChartSeries<ChartLineSeries<MonthlyDatum>>;
  return (
    <div className="chart-work" data-feedback="Monthly comparison">
      {reading && inspectedBuilding && (
        <div className="reading-inspector" aria-label="Inspected monthly reading">
          <div role="status">
            <strong>
              {inspectedBuilding.name} · {reading.month} 2025
            </strong>
            <span>{number.format(reading.value)} kWh/m²</span>
          </div>
          <IconButton label="Close reading details" size="compact" onPress={() => setReading(null)}>
            <Icon name="close" />
          </IconButton>
        </div>
      )}
      {records.length > 0 && (
        <div className="plot-host" ref={plot.ref}>
          <LineChart
            data={data}
            series={series}
            title="Monthly energy use"
            description="2025 · kWh/m²"
            dataTableLabel="Monthly energy readings"
            aspectRatio={plot.ratio}
            minimumSize={{width: 250, height: 170}}
            legend={{label: 'Compared buildings'}}
            xAxis={{
              accessor: 'month',
              label: 'Month',
              scale: {type: 'categorical', domain: months},
            }}
            yAxis={{label: 'Energy', unit: 'kWh/m²', scale: {type: 'linear'}}}
            exploration={{window, onWindowChange: setWindow, labels: monthlyLabels}}
            interaction={{
              target: 'point',
              getRowId: (datum) => datum.month,
              onActivate: ({item, datum}) => {
                if (!item.seriesId) return;
                setReading({
                  id: item.seriesId,
                  month: datum.month,
                  value: datum.values[item.seriesId]!,
                });
                onInspect(item.seriesId);
              },
            }}
            emptyState={{title: 'No readings', description: 'Select a building.'}}
            invalidData={{
              title: 'Invalid readings',
              description: 'Load the sample readings again.',
            }}
          />
        </div>
      )}
    </div>
  );
}
