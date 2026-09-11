import {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  AppearanceProvider,
  ColumnChart,
  BubbleChart,
  DonutChart,
  Button,
  ToggleButton,
  SegmentedControl,
} from '../../../../src/index.js';
import {MotionContext, TransitionHost} from './motion.js';
import '../../../../src/styles.css';
import '../value-motion/styles.css';
import './styles.css';
const original = [
  {id: 'North', label: 'North', value: 70, x: 12, y: 70, size: 45},
  {id: 'South', label: 'South', value: 54, x: 19, y: 54, size: 28},
  {id: 'East', label: 'East', value: 42, x: 25, y: 42, size: 36},
  {id: 'West', label: 'West', value: 30, x: 32, y: 30, size: 20},
];
const additions = [
  {id: 'Annex', label: 'Annex', value: 118, x: 40, y: 118, size: 60},
  {id: 'Studio', label: 'Studio', value: 86, x: 7, y: 86, size: 32},
];
const common = {
  emptyState: {title: 'No readings', description: 'No values recorded.'},
  invalidData: {title: 'Invalid readings', description: 'Check the supplied values.'},
};
const visibility = {
  hideSeries: (s) => `Hide ${s}`,
  showSeries: (s) => `Show ${s}`,
  hidden: 'Hidden',
  showAll: 'Show all',
  allHidden: {title: 'All hidden', description: 'Use an eye to restore a series.'},
};
const labels = {
  instructions:
    'Tap to select. Drag to replace selection. Control/Command-click or hold to open details.',
  clear: 'Clear selection',
  empty: 'Nothing selected',
  summary: (n) => `${n} selected`,
  hidden: (s) => `${s} (hidden)`,
};
function Example({kind, enabled}) {
  const [data, setData] = useState(original);
  const [revision, setRevision] = useState(0);
  const [message, setMessage] = useState('Four buildings');
  const [details, setDetails] = useState('');
  const selection = {labels: {...labels, item: (p) => p.rowId}};
  const nextAddition = additions.find((a) => !data.some((d) => d.id === a.id));
  const change = (next, note) => {
    setData(next);
    setRevision((v) => v + 1);
    setMessage(note);
    setDetails('');
  };
  return (
    <TransitionHost revision={revision} enabled={enabled} crossfadeOnReorder={kind === 'donut'}>
      <div className="transition-controls" data-study-name="Data update controls">
        <Button
          onPress={() => {
            // Change shares without changing ranks; Swap ranks exercises reordering separately.
            const weights = data.map((d) => Math.pow(d.value, revision % 2 ? 0.5 : 2));
            const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
            const total = data.reduce((sum, d) => sum + d.value, 0);
            change(
              data.map((d, i) => ({
                ...d,
                value:
                  kind === 'donut'
                    ? Math.max(1, Math.round((total * weights[i]) / weightTotal))
                    : Math.round(d.value * (revision % 2 ? 0.64 : 1.5)),
                y: Math.round(d.y * (revision % 2 ? 0.64 : 1.5)),
                x: d.x + (i % 2 ? 2 : -2),
                size: d.size + (revision % 2 ? -3 : 3),
              })),
              'Values updated',
            );
          }}
        >
          Update values
        </Button>
        <Button
          isDisabled={!nextAddition}
          onPress={() =>
            nextAddition && change([...data, nextAddition], `${nextAddition.label} added`)
          }
        >
          Add building
        </Button>
        <Button
          isDisabled={data.length <= 2}
          onPress={() => {
            const largest = data.reduce((a, b) => (a.value > b.value ? a : b));
            change(
              data.filter((d) => d.id !== largest.id),
              `${largest.label} removed`,
            );
          }}
        >
          Remove largest
        </Button>
        <Button
          onPress={() => {
            if (kind === 'donut') {
              const sorted = [...data].sort((a, b) => b.value - a.value);
              const high = sorted[0],
                low = sorted.at(-1);
              change(
                data.map((d) =>
                  d.id === high.id
                    ? {...d, value: low.value}
                    : d.id === low.id
                      ? {...d, value: high.value}
                      : d,
                ),
                'Largest and smallest values exchanged',
              );
            } else change([...data].reverse(), 'Order reversed');
          }}
        >
          {kind === 'donut' ? 'Swap ranks' : 'Reverse order'}
        </Button>
        <Button variant="quiet" onPress={() => change(original, 'Original readings restored')}>
          Reset data
        </Button>
      </div>
      <p className="change-status" aria-live="polite">
        {message}
      </p>
      <div className="example" data-study-name="Chart">
        <MotionContext.Provider value={enabled}>
          {kind === 'columns' && (
            <ColumnChart
              {...common}
              data={data}
              title="Energy by building"
              description="Metered energy. The axis fits the current readings."
              dataTableLabel="Energy readings"
              legend={{label: 'Energy'}}
              visibilityLabels={visibility}
              series={[{id: 'energy', label: 'Energy use', accessor: 'value'}]}
              xAxis={{accessor: 'label', label: 'Building', scale: {type: 'categorical'}}}
              yAxis={{label: 'Energy', unit: 'MWh', scale: {type: 'linear'}}}
              interaction={{
                getRowId: (d) => d.id,
                target: 'category',
                selection,
                onActivate: (a) => setDetails(`${a.category}: ${a.datum.value} MWh`),
              }}
            />
          )}
          {kind === 'bubbles' && (
            <BubbleChart
              {...common}
              data={data}
              title="Building energy use"
              description="Circle area shows occupancy. Both axes fit the readings."
              dataTableLabel="Building readings"
              idAccessor="id"
              labelAccessor="label"
              series={[{id: 'buildings', label: 'Buildings'}]}
              legend={{label: 'Buildings'}}
              visibilityLabels={visibility}
              xAxis={{accessor: 'x', label: 'Temperature', unit: '°C', scale: {type: 'linear'}}}
              yAxis={{accessor: 'y', label: 'Energy', unit: 'MWh', scale: {type: 'linear'}}}
              magnitude={{accessor: 'size', label: 'Occupancy', unit: 'people'}}
              interaction={{
                selection,
                onActivate: (a) => {
                  const d = data.find((d) => d.id === a.item.rowId);
                  if (d) setDetails(`${d.label}: ${d.x} °C, ${d.y} MWh, ${d.size} people`);
                },
              }}
            />
          )}
          {kind === 'donut' && (
            <DonutChart
              {...common}
              data={data}
              title="Share of energy use"
              description="Buildings ranked by their current energy use."
              dataTableLabel="Energy by building"
              totalLabel="Total MWh"
              idAccessor="id"
              labelAccessor="label"
              value={{accessor: 'value', label: 'Energy', unit: 'MWh'}}
              legend={{label: 'Buildings'}}
              visibilityLabels={visibility}
              labels={{
                back: 'Back',
                category: 'Building',
                categoryRange: ({start, end, total}) => `${start} to ${end} of ${total}`,
                moreCategories: (n) => `More buildings (${n})`,
                shareOfTotal: 'Share of visible total',
                shareOnPage: 'Share on page',
              }}
              interaction={{
                selection: {
                  containsSelection: 'Contains selection',
                  labels: {...labels, item: (p) => p.id},
                },
                onActivate: (a) => setDetails(`${a.label}: ${a.value} MWh`),
              }}
            />
          )}
        </MotionContext.Provider>
      </div>
      {details && <p role="status">{details}</p>}
      <p className="scope">
        {kind === 'donut'
          ? 'Rank changes crossfade so slices do not sweep through each other.'
          : kind === 'bubbles'
            ? 'Reversing the list should leave each building in place.'
            : 'Labels and selected buildings move with their columns.'}
      </p>
    </TransitionHost>
  );
}
function App() {
  const [kind, setKind] = useState('columns');
  const [mode, setMode] = useState('animated');
  const [light, setLight] = useState(false);
  const [identify, setIdentify] = useState(false);
  const [identified, setIdentified] = useState('');
  const describe = (target: EventTarget | null) => {
    if (!identify || !(target instanceof Element)) return;
    const e = target.closest('button,[role="radio"],[data-study-name]');
    setIdentified(
      e?.getAttribute('aria-label') ??
        e?.getAttribute('data-study-name') ??
        e?.textContent?.slice(0, 70) ??
        'Chart',
    );
  };
  return (
    <AppearanceProvider appearance={light ? 'light' : 'dark'} accent="#2878ff">
      <main
        className="study"
        onPointerOver={(e) => describe(e.target)}
        onFocus={(e) => describe(e.target)}
      >
        <header>
          <p className="kicker">Chart study</p>
          <h1>Changing the data</h1>
          <p>
            Add or remove a building, change its values, or change the order. Select a building
            first to follow it.
          </p>
        </header>
        <div className="study-controls">
          <SegmentedControl
            label="Chart type"
            value={kind}
            onChange={setKind}
            options={[
              {label: 'Columns', value: 'columns'},
              {label: 'Bubbles', value: 'bubbles'},
              {label: 'Donut', value: 'donut'},
            ]}
          />
          <SegmentedControl
            label="Data changes"
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
        <Example key={kind} kind={kind} enabled={mode === 'animated'} />
        {identify && (
          <output className="identified">{identified || 'Point to or focus an element'}</output>
        )}
      </main>
    </AppearanceProvider>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
