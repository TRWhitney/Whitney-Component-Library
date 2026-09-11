import {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  AppearanceProvider,
  Button,
  ToggleButton,
  SegmentedControl,
  RadarChart,
  Sparkline,
  Histogram,
  BoxPlot,
} from '../../../../src/index.js';
import {MotionContext} from './motion.js';
import '../../../../src/styles.css';
import '../value-motion/styles.css';
const state = {
  emptyState: {title: 'No readings', description: 'Record some values.'},
  invalidData: {title: 'Invalid readings', description: 'Check the recorded values.'},
  dataTableLabel: 'Current readings',
};
const eyes = {
  hideSeries: (s) => `Hide ${s}`,
  showSeries: (s) => `Show ${s}`,
  hidden: 'Hidden',
  showAll: 'Show all',
  allHidden: {title: 'All hidden', description: 'Open an eye to restore a profile.'},
};
const selectionLabels = {
  instructions:
    'Tap to select. Drag to replace selection. Control/Command-click or hold to open details.',
  clear: 'Clear selection',
  empty: 'Nothing selected',
  summary: (n) => `${n} selected`,
  hidden: (s) => `${s} (hidden)`,
};
const number = new Intl.NumberFormat('en', {maximumFractionDigits: 1});
const dimensions = ['Speed', 'Range', 'Payload', 'Comfort', 'Traction'].map((label) => ({
  id: label.toLowerCase(),
  label,
  accessor: label.toLowerCase(),
}));
const profiles = [
  [
    {id: 'courier', label: 'Courier', speed: 78, range: 56, payload: 88, comfort: 42, traction: 64},
    {id: 'scout', label: 'Scout', speed: 52, range: 86, payload: 38, comfort: 76, traction: 91},
  ],
  [
    {id: 'courier', label: 'Courier', speed: 61, range: 94, payload: 67, comfort: 82, traction: 48},
    {id: 'scout', label: 'Scout', speed: 93, range: 62, payload: 59, comfort: 48, traction: 73},
  ],
];
const demand = [42, 56, 48, 71, 59, 85, 66, 78, 52, 67, 73, 61];
const binCounts = [
  [2, 5, 9, 13, 8, 4],
  [5, 11, 6, 8, 15, 7],
];
const groups = [
  {id: 'north', label: 'North'},
  {id: 'south', label: 'South'},
  {id: 'west', label: 'West'},
];
const boxes = [
  [
    [14, 30, 44, 64, 90, 116],
    [22, 48, 60, 79, 108, 141],
    [10, 20, 37, 49, 72, 102],
  ],
  [
    [26, 40, 62, 83, 110, 166],
    [10, 22, 39, 56, 88, 113],
    [21, 42, 54, 74, 101, 132],
  ],
];
function Example({kind}) {
  const [revision, setRevision] = useState(0),
    [details, setDetails] = useState(''),
    [target, setTarget] = useState('point');
  const mode = revision % 2;
  const bins = binCounts[mode].map((value, i) => ({lower: i * 40, upper: (i + 1) * 40, value}));
  const summaries = boxes[mode].map((v, i) => ({
    id: groups[i].id,
    lower: v[0],
    q1: v[1],
    median: v[2],
    q3: v[3],
    upper: v[4],
    outliers: [v[5]],
    outlierIds: [`${groups[i].id}-slow-run`],
  }));
  const samples = demand.map((value, i) => ({
    id: `day-${i + 1}`,
    day: `Day ${i + 1}`,
    value: mode ? value + (i % 3 === 0 ? 21 : i % 3 === 1 ? -14 : 8) : value,
  }));
  const select = (item) => ({labels: {...selectionLabels, item}});
  let chart;
  if (kind === 'radar')
    chart = (
      <RadarChart
        {...state}
        data={profiles[mode]}
        title="Vehicle profiles"
        description="Scores across five shared qualities."
        idAccessor="id"
        labelAccessor="label"
        dimensions={dimensions}
        labels={{dimension: 'Quality'}}
        legend={{label: 'Vehicles'}}
        visibilityLabels={eyes}
        value={{label: 'Score', unit: 'points'}}
        minimumSize={{width: 260, height: 260}}
        interaction={{
          target,
          selection: select((p) => `${p.dimensionId}${p.seriesId ? `, ${p.seriesId}` : ''}`),
          onActivate: (a) =>
            setDetails(
              `${a.dimension.label}: ${a.values.map((v) => `${v.label} ${number.format(v.value)}`).join(', ')} points`,
            ),
        }}
      />
    );
  if (kind === 'sparkline')
    chart = (
      <Sparkline
        {...state}
        data={samples}
        title="Daily energy demand"
        description="Twelve recorded days, on a shared 0 to 110 MWh scale."
        position={{accessor: 'day', label: 'Day', scale: {type: 'categorical'}}}
        value={{accessor: 'value', label: 'Demand', unit: 'MWh'}}
        valueRange={[0, 110]}
        labels={{
          first: 'First',
          last: 'Last',
          highest: 'Highest',
          lowest: 'Lowest',
          missing: 'No reading',
        }}
        minimumSize={{width: 240, height: 64}}
        interaction={{
          getRowId: (r) => r.id,
          selection: select((p) => samples.find((r) => r.id === p.rowId)?.day ?? p.rowId),
          onActivate: (a) => setDetails(`${a.position}: ${number.format(a.value)} MWh`),
        }}
      />
    );
  if (kind === 'histogram')
    chart = (
      <Histogram
        {...state}
        data={bins}
        title="Pump restart time"
        description="Recorded restarts in fixed 40 ms intervals."
        distribution={{
          kind: 'binned',
          lowerAccessor: 'lower',
          upperAccessor: 'upper',
          ordinateAccessor: 'value',
          ordinate: 'count',
        }}
        xAxis={{label: 'Restart time', unit: 'ms', scale: {type: 'linear', domain: [0, 240]}}}
        yAxis={{label: 'Restarts', scale: {type: 'linear'}}}
        minimumSize={{width: 260, height: 180}}
        interaction={{
          selection: select((p) => `${p.lower} to ${p.upper} ms`),
          onActivate: (a) =>
            setDetails(`${a.item.lower} to ${a.item.upper} ms: ${a.value} restarts`),
        }}
      />
    );
  if (kind === 'box')
    chart = (
      <BoxPlot
        {...state}
        data={summaries}
        title="Recovery time by site"
        description="The box shows the middle half of recovery times; each dot is a separately identified slow run."
        groupAccessor="id"
        groups={groups}
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
        xAxis={{label: 'Site'}}
        yAxis={{label: 'Recovery time', unit: 'min', scale: {type: 'linear'}}}
        legend={{label: 'Sites'}}
        visibilityLabels={eyes}
        minimumSize={{width: 260, height: 180}}
        interaction={{
          getOutlierId: (c) => c.datum.outlierIds[c.outlierIndex],
          selection: select((p) => `${p.groupId}${p.kind === 'outlier' ? ' slow run' : ''}`),
          onActivate: (a) =>
            setDetails(
              a.kind === 'summary'
                ? `${a.item.groupId}: median ${a.summary.median} min`
                : `${a.item.groupId} slow run: ${a.value} min`,
            ),
        }}
      />
    );
  return (
    <>
      <div className="update-bar" data-study-name="Value update controls">
        <Button
          onPress={() => {
            setRevision((v) => v + 1);
            setDetails('');
          }}
        >
          Update values
        </Button>
        <Button
          variant="quiet"
          onPress={() => {
            setRevision(0);
            setDetails('');
          }}
        >
          Reset
        </Button>
        <span>{revision ? `Update ${revision}` : 'Original values'}</span>
      </div>
      {kind === 'radar' && (
        <div className="selection-target">
          <SegmentedControl
            label="Selection target"
            value={target}
            onChange={setTarget}
            options={[
              {label: 'Point', value: 'point'},
              {label: 'Dimension', value: 'dimension'},
            ]}
          />
        </div>
      )}
      <div data-study-name="Chart">{chart}</div>
      <p className="details" aria-live="polite">
        {details || 'Open an item to see its current reading here.'}
      </p>
    </>
  );
}
function App() {
  const [kind, setKind] = useState('radar'),
    [mode, setMode] = useState('animated'),
    [light, setLight] = useState(false),
    [identify, setIdentify] = useState(false),
    [identified, setIdentified] = useState('');
  const name = (el) => {
    if (!identify) return;
    const node = el.closest('button,[role="radio"],[data-study-name]');
    setIdentified(
      node?.getAttribute('aria-label') ??
        node?.getAttribute('data-study-name') ??
        node?.textContent?.slice(0, 80) ??
        'Chart',
    );
  };
  return (
    <AppearanceProvider appearance={light ? 'light' : 'dark'} accent="#2878ff">
      <main className="study" onPointerOver={(e) => name(e.target)} onFocus={(e) => name(e.target)}>
        <header>
          <p className="kicker">Chart study</p>
          <h1>Motion in the remaining charts</h1>
          <p>
            Select an item, then update the values. Compare Animated and Instant across all four
            charts.
          </p>
        </header>
        <div className="study-controls">
          <div className="chart-choice">
            <SegmentedControl
              label="Chart type"
              value={kind}
              onChange={setKind}
              options={[
                {label: 'Radar', value: 'radar'},
                {label: 'Sparkline', value: 'sparkline'},
                {label: 'Histogram', value: 'histogram'},
                {label: 'Box plot', value: 'box'},
              ]}
            />
          </div>
          <SegmentedControl
            label="Value changes"
            value={mode}
            onChange={setMode}
            options={[
              {label: 'Animated', value: 'animated'},
              {label: 'Instant', value: 'instant'},
            ]}
          />
          <div className="toggles">
            <ToggleButton isSelected={light} onChange={setLight}>
              Light appearance
            </ToggleButton>
            <ToggleButton isSelected={identify} onChange={setIdentify}>
              Identify elements
            </ToggleButton>
          </div>
        </div>
        <section className="example">
          <MotionContext.Provider value={mode === 'animated'}>
            <Example kind={kind} key={kind} />
          </MotionContext.Provider>
        </section>
        {identify && identified && <div className="identified">{identified}</div>}
      </main>
    </AppearanceProvider>
  );
}
createRoot(document.getElementById('root')).render(<App />);
