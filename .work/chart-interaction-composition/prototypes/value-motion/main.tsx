import {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  AppearanceProvider,
  CartesianChart,
  ColumnChart,
  BubbleChart,
  DonutChart,
  Heatmap,
  Button,
  ToggleButton,
  SegmentedControl,
} from '../../../../src/index.js';
import {MotionContext} from './motion.js';
import '../../../../src/styles.css';
import './styles.css';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
const monthly = [
  [8, 12, 15, 11, 25, 30, 24, 19],
  [11, 9, 21, 18, 19, 26, 33, 25],
  [5, 16, 11, 23, 28, 20, 26, 31],
].map((values, revision) =>
  values.map((measured, i) => ({
    id: months[i],
    month: months[i],
    measured,
    lower: measured - 5 - (i % 3),
    upper: measured + 4 + (i % 2),
    cost: [5, 9, 10, 8, 18, 21, 16, 13][i] + revision * 2,
  })),
);
const points = [0, 1, 2].map((revision) =>
  Array.from({length: 14}, (_, i) => ({
    id: `site-${i}`,
    label: `Building ${i + 1}`,
    x:
      8 +
      ((i * 7) % 29) +
      (revision === 1 ? ((i % 3) - 1) * 4 : revision === 2 ? (i % 2 ? 3 : -3) : 0),
    y:
      25 +
      ((i * 19) % 70) +
      (revision === 1 ? (i % 2 ? 14 : -11) : revision === 2 ? ((i % 3) - 1) * 10 : 0),
    size: 15 + ((i * 11) % 60) + revision * (i % 2 ? 8 : -4),
  })),
);
const categories = ['Heating', 'Cooling', 'Lighting', 'Equipment', 'Other'];
const parts = [
  [49, 27, 15, 7, 2],
  [39, 32, 18, 8, 3],
  [55, 23, 12, 6, 4],
].map((values) => values.map((value, i) => ({id: categories[i], label: categories[i], value})));
const rooms = ['North', 'South', 'East', 'West'].map((id) => ({id, label: id}));
const times = ['09:00', '12:00', '15:00', '18:00'].map((id) => ({id, label: id}));
const heat = [0, 1, 2].map((revision) =>
  rooms.flatMap((r, i) =>
    times.map((c, j) => ({
      row: r.id,
      column: c.id,
      value: 17 + ((i * 3 + j * 2 + revision * (i % 2 ? 3 : 5)) % 12),
    })),
  ),
);
const visibility = {
  hideSeries: (s) => `Hide ${s}`,
  showSeries: (s) => `Show ${s}`,
  hidden: 'Hidden',
  showAll: 'Show all',
  allHidden: {title: 'All hidden', description: 'Use an eye to restore a series.'},
};
const common = {
  emptyState: {title: 'No readings', description: 'No values recorded.'},
  invalidData: {title: 'Invalid readings', description: 'Check the supplied values.'},
};
const selectionLabels = {
  instructions:
    'Tap to select. Drag to replace selection. Control/Command-click or hold to open details.',
  clear: 'Clear selection',
  empty: 'Nothing selected',
  summary: (n) => `${n} selected`,
  hidden: (s) => `${s} (hidden)`,
};
const options = [
  {label: 'Line + range', value: 'range'},
  {label: 'Columns', value: 'columns'},
  {label: 'Bubbles', value: 'bubbles'},
  {label: 'Donut', value: 'donut'},
  {label: 'Heatmap', value: 'heatmap'},
];
function Example({kind, moving}: {kind: string; moving: boolean}) {
  const [revision, setRevision] = useState(0);
  const [details, setDetails] = useState('');
  const [target, setTarget] = useState<'point' | 'category'>('point');
  const row = monthly[revision];
  const selection = {
    labels: {...selectionLabels, item: (p) => p.rowId + (p.seriesId ? `, ${p.seriesId}` : '')},
  };
  const interaction = {
    target,
    getRowId: (r) => r.id,
    selection,
    onActivate: (a) =>
      setDetails(
        `${a.category}: ${[...a.values.map((v) => `${v.label} ${v.value}`), ...(a.ranges ?? []).map((r) => `${r.label} ${r.lower} to ${r.upper}`)].join('; ')}`,
      ),
  };
  return (
    <>
      <div className="update-bar" data-study-name="Value update controls">
        <Button
          onPress={() => {
            setRevision((r) => (r + 1) % 3);
            setDetails('');
          }}
        >
          Update values
        </Button>
        <span aria-live="polite">Reading {revision + 1} of 3</span>
      </div>
      {(kind === 'range' || kind === 'columns') && (
        <div className="selection-target">
          <SegmentedControl
            label="Selection target"
            value={target}
            onChange={setTarget}
            options={[
              {label: 'Value', value: 'point'},
              {label: 'Month', value: 'category'},
            ]}
          />
        </div>
      )}
      <div
        className="example"
        data-study-name="Chart"
        data-motion={moving ? 'animated' : 'instant'}
      >
        <MotionContext.Provider value={moving}>
          {kind === 'range' && (
            <CartesianChart
              {...common}
              data={row}
              title="Monthly temperature"
              description="Measured temperature and its expected range."
              dataTableLabel="Temperature readings"
              legend={{label: 'Temperature series'}}
              visibilityLabels={visibility}
              series={[
                {
                  id: 'measured',
                  label: 'Measured',
                  kind: 'line',
                  accessor: 'measured',
                  showPoints: true,
                },
                {
                  id: 'expected',
                  label: 'Expected range',
                  kind: 'range',
                  lowerAccessor: 'lower',
                  upperAccessor: 'upper',
                },
              ]}
              xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
              yAxis={{label: 'Temperature', unit: '°C', scale: {type: 'linear', domain: [0, 40]}}}
              interaction={interaction}
            />
          )}
          {kind === 'columns' && (
            <ColumnChart
              {...common}
              data={row}
              title="Energy produced and used"
              description="Monthly solar generation and building use."
              dataTableLabel="Energy readings"
              legend={{label: 'Energy series'}}
              visibilityLabels={visibility}
              series={[
                {id: 'produced', label: 'Produced', accessor: 'measured'},
                {id: 'used', label: 'Used', accessor: 'cost'},
              ]}
              xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
              yAxis={{label: 'Energy', unit: 'MWh', scale: {type: 'linear', domain: [0, 40]}}}
              interaction={interaction}
            />
          )}
          {kind === 'bubbles' && (
            <BubbleChart
              {...common}
              data={points[revision]}
              title="Building energy use"
              description="Temperature and energy use. Circle area shows occupancy."
              dataTableLabel="Building readings"
              idAccessor="id"
              labelAccessor="label"
              series={[{id: 'buildings', label: 'Buildings'}]}
              legend={{label: 'Buildings'}}
              visibilityLabels={visibility}
              xAxis={{
                accessor: 'x',
                label: 'Temperature',
                unit: '°C',
                scale: {type: 'linear', domain: [0, 45]},
              }}
              yAxis={{
                accessor: 'y',
                label: 'Energy',
                unit: 'kWh',
                scale: {type: 'linear', domain: [0, 120]},
              }}
              magnitude={{accessor: 'size', label: 'Occupancy', unit: 'people'}}
              interaction={{
                selection,
                onActivate: (a) => {
                  const p = points[revision].find((p) => p.id === a.item.rowId)!;
                  setDetails(`${p.label}: ${p.x} °C, ${p.y} kWh, ${p.size} people`);
                },
              }}
            />
          )}
          {kind === 'donut' && (
            <DonutChart
              {...common}
              data={parts[revision]}
              title="Energy by use"
              description="The same five categories across three readings."
              dataTableLabel="Energy by category"
              totalLabel="Total MWh"
              idAccessor="id"
              labelAccessor="label"
              value={{accessor: 'value', label: 'Energy', unit: 'MWh'}}
              legend={{label: 'Energy uses'}}
              visibilityLabels={visibility}
              labels={{
                back: 'Back',
                category: 'Use',
                categoryRange: ({start, end, total}) => `${start} to ${end} of ${total}`,
                moreCategories: (n) => `More categories (${n})`,
                shareOfTotal: 'Share of visible total',
                shareOnPage: 'Share on page',
              }}
              interaction={{
                selection: {
                  containsSelection: 'Contains selection',
                  labels: {...selectionLabels, item: (p) => p.id},
                },
                onActivate: (a) => setDetails(`${a.label}: ${a.value} MWh`),
              }}
            />
          )}
          {kind === 'heatmap' && (
            <Heatmap
              {...common}
              minimumSize={{height: 250, width: 280}}
              aspectRatio={1.2}
              data={heat[revision]}
              title="Room temperature"
              description="Temperature at four times of day."
              dataTableLabel="Room temperatures"
              rows={rooms}
              columns={times}
              rowAccessor="row"
              columnAccessor="column"
              scale={{type: 'sequential', color: '#2878ff', domain: [16, 30]}}
              value={{accessor: 'value', label: 'Temperature', unit: '°C'}}
              labels={{
                row: 'Room',
                column: 'Time',
                colorKey: 'Temperature',
                missing: 'No reading',
                scrollRegion: 'Room temperatures',
              }}
              visibilityLabels={{
                hideRow: (s) => `Hide ${s}`,
                showRow: (s) => `Show ${s}`,
                hideColumn: (s) => `Hide ${s}`,
                showColumn: (s) => `Show ${s}`,
                restore: (n) => `Restore ${n} hidden tracks`,
                hiddenRows: 'Hidden rooms',
                hiddenColumns: 'Hidden times',
                hidden: 'Hidden',
                showAll: 'Show all',
                close: 'Close',
                allHidden: {title: 'All hidden', description: 'Restore a room or time.'},
              }}
              interaction={{
                selection: {labels: {...selectionLabels, item: (p) => `${p.rowId}, ${p.columnId}`}},
                onActivate: (a) => setDetails(`${a.row.label}, ${a.column.label}: ${a.value} °C`),
              }}
            />
          )}
        </MotionContext.Provider>
      </div>
      {details && (
        <p role="status" className="details">
          {details}
        </p>
      )}
    </>
  );
}
function App() {
  const [kind, setKind] = useState('range');
  const [moving, setMoving] = useState('animated');
  const [light, setLight] = useState(false);
  const [identify, setIdentify] = useState(false);
  const [identified, setIdentified] = useState('');
  const identifyElement = (target: EventTarget | null) => {
    if (!identify || !(target instanceof Element)) return;
    const node = target.closest('button,[role="radio"],[data-study-name],[data-wcl-chart-legend]');
    setIdentified(
      node?.getAttribute('aria-label') ??
        node?.getAttribute('data-study-name') ??
        node?.textContent?.slice(0, 70) ??
        'Chart',
    );
  };
  return (
    <AppearanceProvider appearance={light ? 'light' : 'dark'} accent="#2878ff">
      <main
        className="study"
        onPointerOver={(e) => identifyElement(e.target)}
        onFocus={(e) => identifyElement(e.target)}
      >
        <header>
          <p className="kicker">Chart study</p>
          <h1>Changing values</h1>
          <p>
            Update the readings, then compare motion with an instant change. Select something first
            to follow it.
          </p>
        </header>
        <div className="study-controls">
          <div className="chart-choice">
            <SegmentedControl
              label="Chart type"
              value={kind}
              onChange={setKind}
              options={options}
            />
          </div>
          <SegmentedControl
            label="Value changes"
            value={moving}
            onChange={setMoving}
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
        <Example key={kind} kind={kind} moving={moving === 'animated'} />
        <p className="scope">Same items, same order. Axis ranges stay fixed for this comparison.</p>
        {identify && (
          <output className="identified">{identified || 'Point to or focus an element'}</output>
        )}
      </main>
    </AppearanceProvider>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
