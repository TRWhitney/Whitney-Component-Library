// Isolated visibility study. Filtering and label portals are prototype adapters, not public APIs.
import {useLayoutEffect, useMemo, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {createPortal} from 'react-dom';
import {
  AppearanceProvider,
  Heatmap,
  Button,
  ToggleButton,
  type HeatmapSelectionItem,
} from '../../../../src/index.js';
import {ChartVisibilityButton} from '../../../../src/charts/chart-visibility-button.js';
import '../../../../src/styles.css';
import './styles.css';
const rows = ['North room', 'South room', 'East room', 'West room', 'Studio', 'Workshop'].map(
  (label, i) => ({id: `r${i}`, label}),
);
const columns = ['Morning', 'Midday', 'Afternoon', 'Evening', 'Night', 'Dawn'].map((label, i) => ({
  id: `c${i}`,
  label,
}));
const readings = [
  [0, 18, 22, 16, 11, 5],
  [12, 22, undefined, 20, 14, 8],
  [16, 24, 28, 23, 15, 10],
  [9, 16, 21, 18, 12, 6],
  [8, 14, 19, 21, 13, 7],
  [6, 12, 17, 15, 9, 4],
];
const allData = rows.flatMap((row, r) =>
  columns.flatMap((column, c) =>
    readings[r][c] === undefined ? [] : [{room: row.id, period: column.id, value: readings[r][c]!}],
  ),
);
type Axis = 'row' | 'column';
function App() {
  const [touch, setTouch] = useState(() => navigator.maxTouchPoints > 0);
  const [light, setLight] = useState(false),
    [dense, setDense] = useState(false),
    [compact, setCompact] = useState(false),
    [identify, setIdentify] = useState(false),
    [identified, setIdentified] = useState('');
  const [hiddenRows, setHiddenRows] = useState<string[]>([]),
    [hiddenColumns, setHiddenColumns] = useState<string[]>([]),
    [selected, setSelected] = useState<readonly HeatmapSelectionItem[]>([]),
    [details, setDetails] = useState('');
  const host = useRef<HTMLDivElement>(null);
  const [corner, setCorner] = useState<HTMLElement | null>(null);
  const [restorePosition, setRestorePosition] = useState({left: 0, top: 0});
  const [targets, setTargets] = useState<{axis: Axis; id: string; label: string; node: Element}[]>(
    [],
  );
  const n = dense ? 6 : 4;
  const baseRows = rows.slice(0, n),
    baseColumns = columns.slice(0, n);
  // Details and selection updates must not look like a new dataset to the chart.
  const {visibleRows, visibleColumns, data} = useMemo(() => {
    const visibleRows = rows.slice(0, n).filter((row) => !hiddenRows.includes(row.id));
    const visibleColumns = columns
      .slice(0, n)
      .filter((column) => !hiddenColumns.includes(column.id));
    const data = allData.filter(
      (d) =>
        visibleRows.some((r) => r.id === d.room) && visibleColumns.some((c) => c.id === d.period),
    );
    return {visibleRows, visibleColumns, data};
  }, [n, hiddenRows, hiddenColumns]);
  const noGrid = !visibleRows.length || !visibleColumns.length;
  const itemHidden = (item: HeatmapSelectionItem) =>
    hiddenRows.includes(item.rowId) || hiddenColumns.includes(item.columnId);
  const name = (item: HeatmapSelectionItem) =>
    `${rows.find((r) => r.id === item.rowId)?.label}, ${columns.find((c) => c.id === item.columnId)?.label}`;
  const layoutKey = JSON.stringify([n, hiddenRows, hiddenColumns]);
  useLayoutEffect(() => {
    const elements = host.current;
    if (!elements || noGrid) {
      setTargets([]);
      setCorner(null);
      return;
    }
    const collect = () => {
      // The production grid hides its visual labels from assistive technology. This study
      // adds real label controls, so expose labels while keeping individual visual cells hidden.
      const chartGrid = elements.querySelector<HTMLElement>('[data-wcl-heatmap-grid]');
      chartGrid?.removeAttribute('aria-hidden');
      setCorner(elements.querySelector<HTMLElement>('[data-wcl-heatmap-corner]'));
      elements
        .querySelectorAll('[data-wcl-heatmap-cell]')
        .forEach((cell) => cell.setAttribute('aria-hidden', 'true'));
      const next = [
        ...[
          ...elements.querySelectorAll('[data-wcl-heatmap-row-label]:not([data-hidden-axis])'),
        ].map((node, i) => ({
          node,
          axis: 'row' as const,
          ...visibleRows[i],
        })),
        ...[
          ...elements.querySelectorAll('[data-wcl-heatmap-column-label]:not([data-hidden-axis])'),
        ].map((node, i) => ({
          node,
          axis: 'column' as const,
          ...visibleColumns[i],
        })),
      ];
      setTargets((previous) =>
        previous.length === next.length &&
        previous.every((target, i) => target.node === next[i].node && target.id === next[i].id)
          ? previous
          : next,
      );
    };
    collect();
    const observer = new MutationObserver(collect);
    observer.observe(elements, {childList: true, subtree: true});
    return () => observer.disconnect();
  }, [layoutKey]);
  const toggle = (axis: Axis, id: string, hidden: boolean) => {
    const setter = axis === 'row' ? setHiddenRows : setHiddenColumns;
    setter((ids) => (hidden ? ids.filter((item) => item !== id) : [...ids, id]));
    requestAnimationFrame(() => {
      if (document.activeElement === document.body)
        document
          .querySelector<HTMLButtonElement>(`[data-axis-key="${axis}:${id}"] button`)
          ?.focus();
      if (document.activeElement === document.body)
        host.current
          ?.querySelector<HTMLButtonElement>('.restore-trigger, .axis-eye button')
          ?.focus();
    });
  };
  const eye = (axis: Axis, id: string, label: string, hidden: boolean) => (
    <span
      className="axis-eye"
      data-axis-key={`${axis}:${id}`}
      data-study-name={`${hidden ? 'Restore' : 'Hide'} ${axis}: ${label}`}
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <ChartVisibilityButton
        hidden={hidden}
        label={`${hidden ? 'Show' : 'Hide'} ${axis} ${label}`}
        onClear={() => {}}
        onToggle={() => toggle(axis, id, hidden)}
      />
    </span>
  );
  const hiddenCount = hiddenRows.length + hiddenColumns.length;
  const restoreControl = hiddenCount ? (
    <span
      className="restore-control"
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="restore-trigger"
        data-wcl-chart-visibility=""
        data-hidden=""
        popoverTarget="hidden-dimensions"
        aria-label={`Restore hidden rows or columns (${hiddenCount})`}
        title="Restore hidden rows or columns"
        data-study-name="Hidden rows and columns"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setRestorePosition({
            left: Math.max(8, Math.min(rect.left, window.innerWidth - 264)),
            top: Math.min(rect.bottom + 6, window.innerHeight - 260),
          });
        }}
      >
        <svg aria-hidden="true" data-wcl-chart-eye="" viewBox="0 0 24 24">
          <path d="M3 10 Q12 20 21 10" />
          <path d="m5 12-2 3m6-1-1 4m7-4 1 4m3-6 2 3" />
        </svg>
        <span>{hiddenCount}</span>
      </button>
      <div id="hidden-dimensions" popover="auto" className="restore-menu" style={restorePosition}>
        {(['row', 'column'] as const).map((axis) => {
          const items = (axis === 'row' ? baseRows : baseColumns).filter((item) =>
            (axis === 'row' ? hiddenRows : hiddenColumns).includes(item.id),
          );
          return items.length ? (
            <div key={axis}>
              <p>{axis === 'row' ? 'Hidden rooms' : 'Hidden times'}</p>
              {items.map((item) => (
                <span key={item.id} className="restore-item" data-hidden-axis="">
                  <span>{item.label}</span>
                  {eye(axis, item.id, item.label, true)}
                </span>
              ))}
            </div>
          ) : null;
        })}
      </div>
    </span>
  ) : null;
  const showAll = () => {
    setHiddenRows([]);
    setHiddenColumns([]);
    requestAnimationFrame(() =>
      host.current?.querySelector<HTMLButtonElement>('[data-wcl-chart-visibility]')?.focus(),
    );
  };
  const identifyTarget = (target: EventTarget | null) => {
    if (identify && target instanceof Element)
      setIdentified(target.closest('[data-study-name]')?.getAttribute('data-study-name') ?? '');
  };
  return (
    <AppearanceProvider appearance={light ? 'light' : 'dark'} accent="#2878ff">
      <main
        className="study"
        data-touch={touch ? '' : undefined}
        onPointerDownCapture={(e) => {
          if (e.pointerType === 'touch') setTouch(true);
        }}
        data-reveal=""
        onPointerOver={(e) => identifyTarget(e.target)}
        onFocusCapture={(e) => identifyTarget(e.target)}
      >
        <header>
          <p className="kicker">Interaction study</p>
          <h1>Heatmap visibility</h1>
          <p>
            Hide a room or time period using its label's eye. The remaining cells close the gap.
            Restore hidden items using the closed eye beside Room.
          </p>
        </header>
        <div className="controls">
          <p className="hint">
            Eyes reveal on hover or keyboard focus. Closed eyes remain visible; touchscreens show
            all eyes.
          </p>
          <div className="toggles">
            <ToggleButton isSelected={light} onChange={setLight}>
              Light appearance
            </ToggleButton>
            <ToggleButton isSelected={compact} onChange={setCompact}>
              Compact
            </ToggleButton>
            <ToggleButton
              isSelected={dense}
              onChange={(value) => {
                setDense(value);
                setHiddenRows([]);
                setHiddenColumns([]);
                setSelected([]);
              }}
            >
              More cells
            </ToggleButton>
            <ToggleButton isSelected={identify} onChange={setIdentify}>
              Identify elements
            </ToggleButton>
          </div>
        </div>
        <section
          className="example"
          data-compact={compact ? '' : undefined}
          data-study-name="Heatmap and label eyes"
        >
          <div ref={host} className="chart-host">
            {!noGrid ? (
              <Heatmap
                data={data}
                rows={visibleRows}
                columns={visibleColumns}
                rowAccessor="room"
                columnAccessor="period"
                title="Room temperature"
                description="Temperature by room and time. Patterned cells have no recorded value."
                dataTableLabel="Visible readings"
                emptyState={{title: 'No readings', description: 'Choose a recorded interval.'}}
                invalidData={{title: 'Invalid readings', description: 'Correct the readings.'}}
                labels={{
                  row: 'Room',
                  column: 'Time',
                  missing: 'No recorded value',
                  colorKey: 'Temperature scale',
                  scrollRegion: 'Temperature grid',
                }}
                value={{accessor: 'value', label: 'Temperature', unit: '°C'}}
                scale={{type: 'sequential', color: '#2878ff'}}
                interaction={{
                  onActivate: (a) =>
                    setDetails(
                      `${name(a.item)}: ${a.value === undefined ? 'No recorded value' : `${a.value} °C`} · ${a.input}`,
                    ),
                  selection: {
                    selectedItems: selected,
                    onSelectionChange: (next) =>
                      setSelected((previous) => [...previous.filter(itemHidden), ...next]),
                    labels: {
                      instructions:
                        'Click or tap a cell to select. Drag to select a block. Control/Command-click or touch press-and-hold opens details.',
                      clear: 'Clear selection',
                      empty: 'Nothing selected',
                      summary: (count) => `${count} cells selected`,
                      item: name,
                      hidden: (label) => `${label} (hidden)`,
                    },
                  },
                }}
              />
            ) : (
              <div className="empty-axes">
                <h2>Room temperature</h2>
                <div className="empty-corner">Room {restoreControl}</div>
                <div className="empty" role="status">
                  <p>No visible cells. Restore a room or time period using the closed eye.</p>
                  <Button onPress={showAll}>Show all</Button>
                </div>
              </div>
            )}
            {corner && !noGrid ? createPortal(restoreControl, corner) : null}
            {targets.map((target) =>
              createPortal(
                eye(target.axis, target.id, target.label, false),
                target.node,
                `${target.axis}:${target.id}`,
              ),
            )}
          </div>
          <div className="selection" data-study-name="Selection and details">
            <p className="hint">
              Click or tap cells to select, or drag across a block. Control/Command-click or press
              and hold opens details. Hidden selections remain selected.
            </p>
            <p aria-live="polite">
              {selected.length
                ? `${selected.length} ${selected.length === 1 ? 'cell' : 'cells'} selected`
                : 'Nothing selected'}
            </p>
            {selected.length ? (
              <ul>
                {selected.map((item) => (
                  <li key={`${item.rowId}:${item.columnId}`}>
                    {name(item)}
                    {itemHidden(item) ? ' (hidden)' : ''}
                  </li>
                ))}
              </ul>
            ) : null}
            <Button onPress={() => setSelected([])} isDisabled={!selected.length}>
              Clear selection
            </Button>
            {details ? <p role="status">Opened {details}</p> : null}
          </div>
        </section>
        <details className="raw" data-study-name="Full readings">
          <summary>Full readings, including hidden rooms and times</summary>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Room</th>
                  {baseColumns.map((c) => (
                    <th key={c.id}>{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {baseRows.map((r, ri) => (
                  <tr key={r.id}>
                    <th>{r.label}</th>
                    {baseColumns.map((c, ci) => (
                      <td key={c.id}>{readings[ri][ci] ?? 'Missing'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
        {identify ? (
          <output className="identifier">
            {identified || 'Point at or focus a region to identify it.'}
          </output>
        ) : null}
      </main>
    </AppearanceProvider>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
