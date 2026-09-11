// Disposable study. The Vite adapter extends local renderers only in this prototype.
import {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  AppearanceProvider,
  CartesianChart,
  ScatterChart,
  SegmentedControl,
  ToggleButton,
  Button,
  type ChartSelectionItem,
} from '../../../../src/index.js';
import '../../../../src/styles.css';
import './styles.css';
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const measured = [7, 12, 9, 18, 25, 21, 33, 30, 19, 23, 11, 4];
const lower = [3, 5, 9, 11, 15, 19, 22, 21, 15, 10, 6, 2];
const upper = [10, 11, 15, 20, 23, 27, 29, 32, 25, 19, 15, 9];
const rangeData = months.map((month, i) => ({
  id: month,
  month,
  measured: measured[i],
  lower: lower[i],
  upper: upper[i],
}));
// Supplied seasonal target: heating dominates cold days, cooling dominates hot days.
const samples = [
  [2, 102],
  [7, 82],
  [12, 63],
  [17, 47],
  [22, 44],
  [27, 54],
  [32, 76],
  [37, 108],
].map(([x, y], i) => ({
  id: `target-${i}`,
  label: `Target at ${x} °C`,
  group: 'trend',
  x,
  y,
}));
const observed = [
  [2, 96],
  [3, 114],
  [5, 91],
  [6, 78],
  [7, 82],
  [8, 95],
  [10, 72],
  [11, 58],
  [12, 68],
  [13, 61],
  [14, 75],
  [15, 49],
  [16, 45],
  [17, 47],
  [17, 56],
  [18, 42],
  [18, 50],
  [19, 38],
  [20, 47],
  [21, 41],
  [22, 44],
  [22, 44],
  [23, 52],
  [24, 39],
  [25, 63],
  [26, 48],
  [27, 54],
  [28, 80],
  [29, 68],
  [30, 59],
  [31, 84],
  [32, 76],
  [33, 93],
  [34, 74],
  [35, 108],
  [36, 96],
  [37, 119],
  [21, 88],
];
const points = observed.map(([x, y], i) => ({
  id: `reading-${i}`,
  label: `Day ${i + 1}`,
  group: 'observations',
  x,
  y,
}));
const pointData = [...points, ...samples];
const visibility = {
  hideSeries: (s: string) => `Hide ${s}`,
  showSeries: (s: string) => `Show ${s}`,
  hidden: 'Hidden',
  showAll: 'Show all',
  allHidden: {title: 'All series hidden', description: 'Use an eye to restore a series.'},
};
const commonLabels = {
  overview: 'Overview',
  closeOverview: 'Close overview',
  done: 'Done',
  reset: 'Reset view',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  window: 'Visible range',
  instructions:
    'Drag the window to move it or an edge to resize it. Arrow keys adjust the focused window or edge.',
};
const base = {
  emptyState: {title: 'No readings', description: 'Supply readings to display the chart.'},
  invalidData: {title: 'Invalid readings', description: 'Correct the affected readings.'},
  visibilityLabels: visibility,
};
const instructions =
  'Click or tap to select. Drag to replace selection; Shift adds and Alt removes. Control/Command-click or press and hold to open details. Use two fingers to pan and pinch to zoom.';
function App() {
  const [appearance, setAppearance] = useState<'light' | 'dark'>('dark');
  const [mode, setMode] = useState<'scatter' | 'range'>('scatter');
  const [target, setTarget] = useState<'point' | 'category'>('point');
  const [identify, setIdentify] = useState(false),
    [identified, setIdentified] = useState('');
  const [selected, setSelected] = useState<readonly ChartSelectionItem[]>([]);
  const [detail, setDetail] = useState('');
  const label = (item: ChartSelectionItem) =>
    mode === 'scatter'
      ? (pointData.find((p) => p.id === item.rowId)?.label ?? item.rowId)
      : `${item.rowId}${item.seriesId ? ` · ${item.seriesId === 'range' ? 'Expected range' : 'Measured'}` : ''}`;
  const selection = {
    selectedItems: selected,
    onSelectionChange: setSelected,
    labels: {
      instructions,
      clear: 'Clear selection',
      empty: 'Nothing selected',
      summary: (n: number) => `${n} selected`,
      item: label,
      hidden: (s: string) => `${s} (hidden)`,
    },
  };
  const identifyElement = (element: EventTarget | null) => {
    if (!identify || !(element instanceof Element)) return;
    const e = element.closest(
      'button,[data-study-range-cue],[data-wcl-chart-area],[data-wcl-statistical-mark],[data-wcl-chart-line],[data-wcl-chart-canvas],[data-wcl-chart-legend]',
    );
    setIdentified(
      e?.getAttribute('aria-label') ??
        (e?.hasAttribute('data-study-range-cue')
          ? 'Range limits'
          : e?.hasAttribute('data-wcl-chart-area')
            ? 'Range band'
            : e?.hasAttribute('data-wcl-statistical-mark')
              ? 'Observation or line sample'
              : e?.hasAttribute('data-wcl-chart-line')
                ? 'Line'
                : e?.hasAttribute('data-wcl-chart-legend')
                  ? 'Legend'
                  : 'Plot'),
    );
  };
  return (
    <AppearanceProvider appearance={appearance} accent="#2878ff">
      <main
        className="study"
        onPointerOver={(e) => identifyElement(e.target)}
        onFocus={(e) => identifyElement(e.target)}
      >
        <header>
          <p className="kicker">Chart study</p>
          <h1>Combined charts</h1>
          <p>
            {mode === 'scatter'
              ? 'Measurements and a supplied target share the same axes.'
              : 'The measured value and expected range can be selected separately.'}
          </p>
        </header>
        <div className="study-controls">
          <SegmentedControl
            label="Combination"
            value={mode}
            onChange={(v) => {
              setMode(v);
              setSelected([]);
              setDetail('');
            }}
            options={[
              {label: 'Scatter + line', value: 'scatter'},
              {label: 'Line + range', value: 'range'},
            ]}
          />
          <div className="toggles">
            <ToggleButton
              isSelected={appearance === 'light'}
              onChange={(v) => setAppearance(v ? 'light' : 'dark')}
            >
              Light appearance
            </ToggleButton>
            <ToggleButton isSelected={identify} onChange={setIdentify}>
              Identify elements
            </ToggleButton>
          </div>
          {mode === 'range' ? (
            <SegmentedControl
              label="Selection target"
              value={target}
              onChange={(v) => {
                setTarget(v);
                setSelected([]);
              }}
              options={[
                {label: 'Individual value', value: 'point'},
                {label: 'Whole month', value: 'category'},
              ]}
            />
          ) : null}
        </div>
        <section className="example" key={mode}>
          {mode === 'scatter' ? (
            <ScatterChart
              {...base}
              title="Energy use against target"
              description="Heating and cooling demand across cold, mild and hot days."
              dataTableLabel="Observations and target values"
              data={pointData}
              idAccessor="id"
              labelAccessor="label"
              seriesAccessor="group"
              series={[
                {id: 'observations', label: 'Observations', color: 'accent'},
                {id: 'trend', label: 'Target', color: 'series-2'},
              ]}
              legend={{label: 'Measurements and target'}}
              xAxis={{
                accessor: 'x',
                label: 'Outdoor temperature',
                unit: '°C',
                scale: {type: 'linear'},
              }}
              yAxis={{
                accessor: 'y',
                label: 'Energy use',
                unit: 'kWh',
                scale: {type: 'linear'},
                formatTick: (v) => String(Math.round(v)),
              }}
              exploration={{
                labels: {
                  ...commonLabels,
                  panLeft: 'Lower temperature',
                  panRight: 'Higher temperature',
                  panUp: 'Higher energy use',
                  panDown: 'Lower energy use',
                  corner: (c) => `Resize ${c.replace('-', ' ')} corner`,
                  range: ({x, y}) =>
                    `${x.map((v) => Math.round(v)).join(' to ')} °C; ${y.map((v) => Math.round(v)).join(' to ')} kWh`,
                },
              }}
              interaction={{
                selection,
                onActivate: (a) => setDetail(`${a.label}: ${a.x} °C, ${Math.round(a.y)} kWh`),
              }}
            />
          ) : (
            <CartesianChart
              {...base}
              title="Measured temperature and expected range"
              description="Seasonal temperatures, with several months outside their expected range."
              dataTableLabel="Measured values and both range limits"
              data={rangeData}
              series={[
                {
                  id: 'measured',
                  kind: 'line',
                  accessor: 'measured',
                  label: 'Measured',
                  color: 'accent',
                  showPoints: true,
                },
                {
                  id: 'range',
                  kind: 'area',
                  accessor: 'upper',
                  label: 'Expected range',
                  color: 'series-2',
                },
              ]}
              legend={{label: 'Temperature series'}}
              xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
              yAxis={{label: 'Temperature', unit: '°C', scale: {type: 'linear'}}}
              exploration={{
                labels: {
                  ...commonLabels,
                  panBackward: 'Earlier months',
                  panForward: 'Later months',
                  start: 'First month',
                  end: 'Last month',
                  range: (w) => w.join(' to '),
                },
              }}
              interaction={{
                target,
                getRowId: (r) => r.id,
                selection,
                onActivate: (a) =>
                  setDetail(
                    `${a.category}: ${a.item.seriesId === 'range' ? `Expected range ${a.datum.lower} to ${a.datum.upper} °C` : a.item.seriesId === 'measured' ? `Measured ${a.datum.measured} °C` : `Measured ${a.datum.measured} °C; expected range ${a.datum.lower} to ${a.datum.upper} °C`}`,
                  ),
              }}
            />
          )}
        </section>
        {detail ? (
          <section className="details" aria-label="Opened details">
            <h2>Details</h2>
            <p role="status">{detail}</p>
            <Button variant="quiet" onPress={() => setDetail('')}>
              Close details
            </Button>
          </section>
        ) : null}
        {identify ? (
          <output className="identified">{identified || 'Point to or focus an element'}</output>
        ) : null}
      </main>
    </AppearanceProvider>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
