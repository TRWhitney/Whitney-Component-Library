// Isolated heatmap selection study. This is not the public interaction implementation.
import {useLayoutEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {createPortal} from 'react-dom';
import {AppearanceProvider, Heatmap, ToggleButton, Button} from '../../../../src/index.js';
import {
  ChartActivationOutline,
  chartActivationLifetime,
  chartActivationOutset,
} from '../../../../src/charts/chart-activation.js';
import '../../../../src/styles.css';
import './styles.css';
const rows = ['North room', 'South room', 'East room', 'West room', 'Studio', 'Workshop'].map(
  (label, i) => ({id: `room-${i}`, label}),
);
const columns = ['Morning', 'Midday', 'Afternoon', 'Evening', 'Night', 'Dawn'].map((label, i) => ({
  id: `period-${i}`,
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
type Cell = {
  index: number;
  row: number;
  column: number;
  x: number;
  y: number;
  width: number;
  height: number;
};
type Drag = {
  id: number;
  x: number;
  y: number;
  cx: number;
  cy: number;
  start: Cell | null;
  before: number[];
  add: boolean;
  remove: boolean;
  moved: boolean;
  held: boolean;
};
function App() {
  const [light, setLight] = useState(false),
    [compact, setCompact] = useState(false),
    [dense, setDense] = useState(false),
    [enabled, setEnabled] = useState(true),
    [identify, setIdentify] = useState(false),
    [identified, setIdentified] = useState('');
  const [selected, setSelected] = useState<number[]>([]),
    [active, setActive] = useState<number | null>(null),
    [details, setDetails] = useState<{index: number; input: string} | null>(null),
    [pulse, setPulse] = useState<{index: number; serial: number} | null>(null),
    [box, setBox] = useState<{x: number; y: number; width: number; height: number} | null>(null);
  const [canvas, setCanvas] = useState<HTMLDivElement | null>(null),
    [cells, setCells] = useState<Cell[]>([]),
    [size, setSize] = useState({width: 1, height: 1});
  const host = useRef<HTMLDivElement>(null),
    gesture = useRef<Drag | null>(null),
    hold = useRef<ReturnType<typeof setTimeout> | undefined>(undefined),
    timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined),
    cursor = useRef(0),
    serial = useRef(0);
  const n = dense ? 6 : 4,
    visibleRows = rows.slice(0, n),
    visibleColumns = columns.slice(0, n);
  const data = visibleRows.flatMap((row, r) =>
    visibleColumns.flatMap((column, c) =>
      readings[r][c] === undefined
        ? []
        : [{room: row.id, period: column.id, value: readings[r][c]!}],
    ),
  );
  const value = (index: number) => readings[Math.floor(index / n)][index % n];
  const label = (index: number) =>
    `${visibleRows[Math.floor(index / n)]?.label}, ${visibleColumns[index % n]?.label}`;
  const cancel = () => {
    clearTimeout(hold.current);
    if (gesture.current) setSelected(gesture.current.before);
    gesture.current = null;
    setBox(null);
  };
  const reset = () => {
    cancel();
    setSelected([]);
    setActive(null);
    setDetails(null);
    setPulse(null);
    cursor.current = 0;
  };
  useLayoutEffect(() => {
    const el = host.current!.querySelector<HTMLDivElement>('[data-wcl-heatmap-canvas]')!;
    setCanvas(el);
    const measure = () => {
      const origin = el.getBoundingClientRect();
      setSize({width: el.scrollWidth, height: el.scrollHeight});
      setCells(
        [...el.querySelectorAll<HTMLElement>('[data-cell-index]')].map((c) => {
          const rect = c.getBoundingClientRect(),
            index = Number(c.dataset.cellIndex);
          return {
            index,
            row: Math.floor(index / n),
            column: index % n,
            x: rect.left - origin.left,
            y: rect.top - origin.top,
            width: rect.width,
            height: rect.height,
          };
        }),
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    el.querySelectorAll('[data-cell-index]').forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [n, compact]);
  useLayoutEffect(() => {
    host.current?.querySelectorAll<HTMLElement>('[data-cell-index]').forEach((e) => {
      e.toggleAttribute('data-active', Number(e.dataset.cellIndex) === active);
      e.dataset.studyName = `Cell: ${label(Number(e.dataset.cellIndex))}`;
    });
  }, [active, cells]);
  const coordinates = (e: {clientX: number; clientY: number}) => {
    const r = canvas!.getBoundingClientRect();
    return {x: e.clientX - r.left, y: e.clientY - r.top};
  };
  const hit = (x: number, y: number) =>
    cells.find((c) => x >= c.x && x <= c.x + c.width && y >= c.y && y <= c.y + c.height) ?? null;
  const activate = (cell: Cell, input: string) => {
    setDetails({index: cell.index, input});
    setPulse({index: cell.index, serial: ++serial.current});
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPulse(null), chartActivationLifetime);
  };
  const toggle = (cell: Cell) => {
    setSelected((prev) =>
      prev.includes(cell.index) ? prev.filter((i) => i !== cell.index) : [...prev, cell.index],
    );
  };
  const selectedCells = cells.filter((c) => selected.includes(c.index));
  return (
    <AppearanceProvider appearance={light ? 'light' : 'dark'} accent="#2878ff">
      <main
        className="study"
        onPointerOver={(e) => {
          if (identify)
            setIdentified(
              (e.target as HTMLElement).closest<HTMLElement>('[data-study-name]')?.dataset
                .studyName ?? '',
            );
        }}
        onFocus={(e) => {
          if (identify)
            setIdentified(
              (e.target as HTMLElement).closest<HTMLElement>('[data-study-name]')?.dataset
                .studyName ?? '',
            );
        }}
      >
        <header>
          <div className="kicker">CHART INTERACTION STUDY</div>
          <h1>Heatmap selection</h1>
          <p>
            Dashed inner outlines mark hover. Solid cell frames mark selection. Activate a cell to
            see its outlined pulse.
          </p>
        </header>
        <div className="controls">
          <div className="toggles" data-study-name="Display and interaction controls">
            <ToggleButton
              isSelected={enabled}
              onChange={(v) => {
                cancel();
                setEnabled(v);
              }}
            >
              Selection enabled
            </ToggleButton>
            <ToggleButton isSelected={light} onChange={setLight}>
              Light appearance
            </ToggleButton>
            <ToggleButton
              isSelected={compact}
              onChange={(v) => {
                cancel();
                setCompact(v);
              }}
            >
              Compact
            </ToggleButton>
            <ToggleButton
              isSelected={dense}
              onChange={(v) => {
                reset();
                setDense(v);
              }}
            >
              More cells
            </ToggleButton>
            <ToggleButton isSelected={identify} onChange={setIdentify}>
              Identify elements
            </ToggleButton>
          </div>
        </div>
        <p className="hint">
          {enabled
            ? 'Click or tap to select. Control/Command-click or press and hold to open details. Drag to select every cell the box touches. Shift or Control/Command adds; Alt removes; Escape cancels.'
            : 'Click or tap to open details.'}{' '}
          Arrow keys move between cells. Enter or Space selects; Control/Command plus Enter or Space
          opens details.
        </p>
        <div className="example" data-compact={compact ? '' : undefined} data-study-name="Heatmap">
          <div
            className="chart-adapter"
            ref={host}
            onFocusCapture={(e) => {
              e.stopPropagation();
              if (
                (e.target as HTMLElement).hasAttribute('data-wcl-heatmap-canvas') &&
                !gesture.current
              )
                setActive(cursor.current);
            }}
            onBlurCapture={() => setActive(null)}
            onPointerDownCapture={(e) => {
              if (!canvas || !canvas.contains(e.target as Node) || e.button !== 0) return;
              e.stopPropagation();
              e.preventDefault();
              const {x, y} = coordinates(e),
                cell = hit(x, y);
              const g: Drag = {
                id: e.pointerId,
                x,
                y,
                cx: e.clientX,
                cy: e.clientY,
                start: cell,
                before: [...selected],
                add: e.shiftKey || e.ctrlKey || e.metaKey,
                remove: e.altKey,
                moved: false,
                held: false,
              };
              gesture.current = g;
              canvas.focus({preventScroll: true});
              canvas.setPointerCapture(e.pointerId);
              setActive(cell?.index ?? null);
              if (cell) cursor.current = cell.index;
              clearTimeout(hold.current);
              if (e.pointerType === 'touch' && cell)
                hold.current = setTimeout(() => {
                  if (gesture.current === g && !g.moved) {
                    g.held = true;
                    activate(cell, 'touch hold');
                  }
                }, 500);
            }}
            onPointerMoveCapture={(e) => {
              if (!canvas || !canvas.contains(e.target as Node)) return;
              e.stopPropagation();
              const {x, y} = coordinates(e),
                g = gesture.current;
              if (g) {
                if (Math.hypot(e.clientX - g.cx, e.clientY - g.cy) > 5) g.moved = true;
                if (g.moved) {
                  clearTimeout(hold.current);
                  setActive(null);
                  if (enabled) {
                    const b = {
                      x: Math.min(x, g.x),
                      y: Math.min(y, g.y),
                      width: Math.abs(x - g.x),
                      height: Math.abs(y - g.y),
                    };
                    setBox(b);
                    const ids = cells
                      .filter(
                        (c) =>
                          c.x < b.x + b.width &&
                          c.x + c.width > b.x &&
                          c.y < b.y + b.height &&
                          c.y + c.height > b.y,
                      )
                      .map((c) => c.index);
                    setSelected(
                      g.remove
                        ? g.before.filter((i) => !ids.includes(i))
                        : g.add
                          ? [...new Set([...g.before, ...ids])]
                          : ids,
                    );
                  }
                  return;
                }
              }
              const cell = hit(x, y);
              setActive(cell?.index ?? null);
              if (cell) cursor.current = cell.index;
            }}
            onPointerUpCapture={(e) => {
              const g = gesture.current;
              if (!g) return;
              e.stopPropagation();
              clearTimeout(hold.current);
              gesture.current = null;
              setBox(null);
              if (canvas?.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
              if (g.moved || g.held) return;
              const {x, y} = coordinates(e),
                cell = hit(x, y);
              if (!cell || cell.index !== g.start?.index) return;
              if (!enabled || e.ctrlKey || e.metaKey)
                activate(cell, e.pointerType === 'touch' ? 'touch' : 'pointer');
              else toggle(cell);
            }}
            onPointerCancelCapture={cancel}
            onPointerLeave={() => {
              if (!gesture.current) setActive(null);
            }}
            onKeyDownCapture={(e) => {
              if (!(e.target as HTMLElement).hasAttribute('data-wcl-heatmap-canvas')) return;
              const keys = [
                'ArrowLeft',
                'ArrowRight',
                'ArrowUp',
                'ArrowDown',
                'Home',
                'End',
                'Enter',
                ' ',
                'Escape',
              ];
              if (!keys.includes(e.key)) return;
              e.stopPropagation();
              e.preventDefault();
              if (e.key === 'Escape') {
                cancel();
                setActive(null);
                return;
              }
              let next = cursor.current;
              const col = next % n;
              if (e.key === 'ArrowLeft' && col > 0) next--;
              if (e.key === 'ArrowRight' && col < n - 1) next++;
              if (e.key === 'ArrowUp') next = Math.max(col, next - n);
              if (e.key === 'ArrowDown') next = Math.min((n - 1) * n + col, next + n);
              if (e.key === 'Home') next = e.ctrlKey || e.metaKey ? 0 : next - col;
              if (e.key === 'End') next = e.ctrlKey || e.metaKey ? n * n - 1 : next - col + n - 1;
              cursor.current = next;
              setActive(next);
              canvas
                ?.querySelector(`[data-cell-index="${next}"]`)
                ?.scrollIntoView({block: 'nearest', inline: 'nearest'});
              const cell = cells.find((c) => c.index === next);
              if (cell && (e.key === 'Enter' || e.key === ' ')) {
                if (!enabled || e.ctrlKey || e.metaKey) activate(cell, 'keyboard');
                else toggle(cell);
              }
            }}
          >
            <Heatmap
              data={data}
              rows={visibleRows}
              columns={visibleColumns}
              rowAccessor="room"
              columnAccessor="period"
              title="Room temperature"
              description="Temperature by room and time. Patterned cells have no recorded value."
              dataTableLabel="Room temperature readings"
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
            />
            {canvas
              ? createPortal(
                  <svg
                    className="study-overlay"
                    width={size.width}
                    height={size.height}
                    aria-hidden="true"
                  >
                    {selectedCells.map((c) => (
                      <rect
                        className="selection"
                        key={c.index}
                        x={c.x}
                        y={c.y}
                        width={c.width}
                        height={c.height}
                        rx={3}
                      />
                    ))}
                    {pulse
                      ? cells
                          .filter((c) => c.index === pulse.index)
                          .map((c) => (
                            <ChartActivationOutline key={pulse.serial}>
                              <rect
                                data-wcl-chart-activation-bar=""
                                x={c.x - chartActivationOutset}
                                y={c.y - chartActivationOutset}
                                width={c.width + 2 * chartActivationOutset}
                                height={c.height + 2 * chartActivationOutset}
                                rx={3}
                              />
                            </ChartActivationOutline>
                          ))
                      : null}
                    {box ? <rect className="drag-box" {...box} /> : null}
                  </svg>,
                  canvas,
                )
              : null}
          </div>
          <p className="reading" data-study-name="Current cell" aria-live="polite">
            {active === null
              ? 'Hover or use the arrow keys to read a cell.'
              : `${label(active)}: ${value(active) === undefined ? 'No recorded value' : `${value(active)} °C`}`}
          </p>
        </div>
        <div className="results" data-study-name="Selection summary">
          <span>
            {selected.length} {selected.length === 1 ? 'cell' : 'cells'} selected
          </span>
          <Button onPress={() => setSelected([])}>Clear selection</Button>
        </div>
        {selected.length ? <p className="hint">{selected.map(label).join(' · ')}</p> : null}
        <div className="details" data-study-name="Activated cell details">
          <h2>Opened details</h2>
          {details ? (
            <p>
              {label(details.index)} ·{' '}
              {value(details.index) === undefined
                ? 'No recorded value'
                : `${value(details.index)} °C`}{' '}
              · {details.input}
            </p>
          ) : (
            <p>Activate a cell to open its details here.</p>
          )}
        </div>
        {identify ? (
          <div className="identifier">
            {identified || 'Hover or focus an element to identify it.'}
          </div>
        ) : null}
      </main>
    </AppearanceProvider>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
