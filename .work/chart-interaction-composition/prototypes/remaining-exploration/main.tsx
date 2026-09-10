// Isolated navigation study. Fixtures, window filtering, and layout adapters are not public APIs.
import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent,
} from 'react';
import {createRoot} from 'react-dom/client';
import {
  AppearanceProvider,
  RadioGroup,
  ToggleButton,
  Button,
  IconButton,
  Disclosure,
  Dialog,
  Histogram,
  BoxPlot,
  BarChart,
  Heatmap,
  type ChartSelectionItem,
  type HistogramSelectionItem,
  type BoxPlotSelectionItem,
  type HeatmapSelectionItem,
} from '../../../../src/index.js';
import '../../../../src/styles.css';
import './styles.css';
import {getVisibility, useVisibilitySnapshot} from './visibility-store.js';

type StudyItem =
  ChartSelectionItem | HistogramSelectionItem | BoxPlotSelectionItem | HeatmapSelectionItem;
type Kind = 'histogram' | 'box' | 'bar' | 'heatmap';
type View = {x0: number; x1: number; y0: number; y1: number};
const full: View = {x0: 0, x1: 100, y0: 0, y1: 100};
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const axis = (start: number, size: number) => {
  const span = clamp(size, 20, 100),
    first = clamp(start, 0, 100 - span);
  return [first, first + span] as const;
};
const bounded = (x: number, y: number, w: number, h: number): View => {
  const [x0, x1] = axis(x, w),
    [y0, y1] = axis(y, h);
  return {x0, x1, y0, y1};
};
const bins = [2, 4, 6, 10, 16, 20, 17, 12, 8, 5, 3, 1].map((count, i) => ({
  lower: i * 20,
  upper: (i + 1) * 20,
  count,
}));
const rooms = Array.from({length: 8}, (_, i) => ({id: `r${i}`, label: `A${i + 1}`}));
const periods = Array.from({length: 8}, (_, i) => ({
  id: `c${i}`,
  label: `${String(i * 3).padStart(2, '0')}:00`,
}));
const cells = rooms.flatMap((r, i) =>
  periods.flatMap((c, j) =>
    i === 2 && j === 4 ? [] : [{room: r.id, period: c.id, value: (i * 7 + j * 3) % 31}],
  ),
);
const bars = Array.from({length: 12}, (_, i) => ({
  id: `station-${i}`,
  label: `S${String(i + 1).padStart(2, '0')}`,
  supply: 36 + ((i * 17) % 64),
  returned: 10 + ((i * 7) % 30),
}));
const boxes = Array.from({length: 6}, (_, i) => ({
  id: `loop-${i}`,
  label: `Loop ${i + 1}`,
  low: 8 + i * 3,
  q1: 16 + i * 4,
  median: 24 + i * 4,
  q3: 32 + i * 5,
  high: 44 + i * 5,
  outliers: [70 + i * 6],
  outlierIds: [`loop-${i}-spike`],
}));
const boxGroups = boxes.map((d) => ({id: d.id, label: d.label, color: 'accent' as const}));
const activeBoxes = () => boxes.filter((d) => !getVisibility().box.includes(d.id));
const activeRooms = () => rooms.filter((d) => !getVisibility().heatmap.rows.includes(d.id));
const activePeriods = () => periods.filter((d) => !getVisibility().heatmap.columns.includes(d.id));
const visibilityLabels = {
  hideSeries: (s: string) => `Hide ${s}`,
  showSeries: (s: string) => `Show ${s}`,
  hidden: 'Hidden',
  showAll: 'Show all',
  allHidden: {title: 'All series hidden', description: 'Use a closed eye to restore a series.'},
};
const heatVisibility = {
  hideRow: (s: string) => `Hide room ${s}`,
  showRow: (s: string) => `Show room ${s}`,
  hideColumn: (s: string) => `Hide time ${s}`,
  showColumn: (s: string) => `Show time ${s}`,
  restore: (n: number) => `Restore ${n} hidden rooms and times`,
  hiddenRows: 'Hidden rooms',
  hiddenColumns: 'Hidden times',
  hidden: 'Hidden',
  showAll: 'Show all',
  close: 'Close hidden rooms and times',
  allHidden: {
    title: 'No visible cells',
    description: 'Use the closed eye to restore a room and time.',
  },
};
const enabledX = (k: Kind) => k !== 'bar';
const enabledY = (k: Kind) => k === 'bar' || k === 'heatmap';
const counts = (k: Kind) => ({
  x:
    k === 'box'
      ? Math.max(1, activeBoxes().length)
      : k === 'heatmap'
        ? Math.max(1, activePeriods().length)
        : 12,
  y: k === 'heatmap' ? Math.max(1, activeRooms().length) : 12,
});
const windowIndices = (v: View, k: Kind) => {
  const n = counts(k);
  return {
    a: Math.round((v.x0 * n.x) / 100),
    b: Math.round((v.x1 * n.x) / 100),
    c: Math.round(((100 - v.y1) * n.y) / 100),
    d: Math.round(((100 - v.y0) * n.y) / 100),
  };
};
function snap(v: View, k: Kind): View {
  const n = counts(k),
    min = k === 'box' ? 2 : 3;
  const range = (start: number, span: number, total: number) => {
    const size = clamp(Math.round((span * total) / 100), Math.min(min, total), total),
      first = clamp(Math.round((start * total) / 100), 0, total - size);
    return [(first * 100) / total, ((first + size) * 100) / total];
  };
  const [x0, x1] = enabledX(k) ? range(v.x0, v.x1 - v.x0, n.x) : [0, 100];
  const [top, bottom] = enabledY(k) ? range(100 - v.y1, v.y1 - v.y0, n.y) : [0, 100];
  return {x0, x1, y0: 100 - bottom, y1: 100 - top};
}
const describe = (v: View, k: Kind) => {
  const {a, b, c, d} = windowIndices(v, k);
  return k === 'histogram'
    ? `${a * 20}–${b * 20} ms`
    : k === 'box'
      ? `${activeBoxes()[a]?.label ?? 'No loops'}–${activeBoxes()[b - 1]?.label ?? ''}`
      : k === 'bar'
        ? `Stations ${c + 1}–${d}`
        : `${activeRooms()[c]?.label ?? 'No rooms'}–${activeRooms()[d - 1]?.label ?? ''}; ${activePeriods()[a]?.label ?? ''}–${activePeriods()[b - 1]?.label ?? ''}`;
};
const itemLabel = (i: StudyItem) => {
  if ('lower' in i) return `${i.lower}–${i.upper} ms`;
  if ('groupId' in i)
    return `${boxes.find((d) => d.id === i.groupId)?.label}${i.kind === 'outlier' ? ' outlier' : ''}`;
  if ('columnId' in i)
    return `${rooms.find((r) => r.id === i.rowId)?.label}, ${periods.find((c) => c.id === i.columnId)?.label}`;
  return bars.find((d) => d.id === i.rowId)?.label ?? '';
};
const itemVisible = (i: StudyItem, v: View, k: Kind) => {
  const {a, b, c, d} = windowIndices(v, k);
  if ('lower' in i) return i.lower >= a * 20 && i.upper <= b * 20;
  if ('groupId' in i)
    return activeBoxes()
      .slice(a, b)
      .some((d) => d.id === i.groupId);
  if ('columnId' in i)
    return (
      activeRooms()
        .slice(c, d)
        .some((r) => r.id === i.rowId) &&
      activePeriods()
        .slice(a, b)
        .some((c) => c.id === i.columnId)
    );
  return bars.slice(c, d).some((d) => d.id === i.rowId);
};
const help =
  'Drag to select. Two fingers pan or pinch to zoom. Control/Command-click or press and hold for details.';
function OverviewMap({
  view: chartView,
  update: applyView,
  kind,
  selected,
  aspect,
  expanded = false,
}: {
  view: View;
  update: (next: View) => void;
  kind: Kind;
  selected: readonly StudyItem[];
  aspect: number;
  expanded?: boolean;
}) {
  // A horizontal station strip controls the chart's top-to-bottom category window.
  const view =
    kind === 'bar' ? {x0: 100 - chartView.y1, x1: 100 - chartView.y0, y0: 0, y1: 100} : chartView;
  const update = (next: View) =>
    applyView(kind === 'bar' ? {x0: 0, x1: 100, y0: 100 - next.x1, y1: 100 - next.x0} : next);
  const nav = useRef<HTMLDivElement>(null);
  const [mapSize, setMapSize] = useState({width: 192, height: 96});
  const width = view.x1 - view.x0,
    height = view.y1 - view.y0;
  useLayoutEffect(() => {
    const element = nav.current;
    if (!element) return;
    const measure = () => setMapSize({width: element.clientWidth, height: element.clientHeight});
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  type Handle = 'window' | 'new' | 'nw' | 'ne' | 'sw' | 'se';
  const drag = useRef<{
    kind: Handle;
    view: View;
    x: number;
    y: number;
    px: number;
    py: number;
  } | null>(null);
  const navDown = (e: ReactPointerEvent<HTMLElement>, kind: Handle) => {
    if (e.button !== 0 || !nav.current) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.focus();
    e.currentTarget.setPointerCapture(e.pointerId);
    const b = nav.current.getBoundingClientRect();
    drag.current = {
      kind,
      view: {...view},
      x: e.clientX,
      y: e.clientY,
      px: clamp(((e.clientX - b.x) / b.width) * 100, 0, 100),
      py: clamp(100 - ((e.clientY - b.y) / b.height) * 100, 0, 100),
    };
  };
  const navMove = (e: ReactPointerEvent) => {
    const g = drag.current;
    if (!g || !nav.current) return;
    const b = nav.current.getBoundingClientRect();
    const dx = ((e.clientX - g.x) / b.width) * 100,
      dy = (-(e.clientY - g.y) / b.height) * 100;
    if (g.kind === 'window')
      update(bounded(g.view.x0 + dx, g.view.y0 + dy, g.view.x1 - g.view.x0, g.view.y1 - g.view.y0));
    else if (g.kind === 'new') {
      const x = clamp(g.px + dx, 0, 100),
        y = clamp(g.py + dy, 0, 100);
      update(bounded(Math.min(g.px, x), Math.min(g.py, y), Math.abs(x - g.px), Math.abs(y - g.py)));
    } else {
      const v = {...g.view};
      if (g.kind.includes('w')) v.x0 = clamp(v.x0 + dx, 0, v.x1 - 20);
      else v.x1 = clamp(v.x1 + dx, v.x0 + 20, 100);
      if (g.kind.includes('s')) v.y0 = clamp(v.y0 + dy, 0, v.y1 - 20);
      else v.y1 = clamp(v.y1 + dy, v.y0 + 20, 100);
      update(v);
    }
  };
  const navUp = (e: ReactPointerEvent) => {
    const g = drag.current;
    if (g?.kind === 'new' && Math.hypot(e.clientX - g.x, e.clientY - g.y) < 5)
      update(
        bounded(
          g.px - (g.view.x1 - g.view.x0) / 2,
          g.py - (g.view.y1 - g.view.y0) / 2,
          g.view.x1 - g.view.x0,
          g.view.y1 - g.view.y0,
        ),
      );
    drag.current = null;
  };
  const navKeys = (e: KeyboardEvent, handle: Handle) => {
    const stepX = ((e.shiftKey ? 2 : 1) * 100) / counts(kind).x,
      stepY = ((e.shiftKey ? 2 : 1) * 100) / counts(kind).y,
      dx = e.key === 'ArrowLeft' ? -stepX : e.key === 'ArrowRight' ? stepX : 0,
      dy = e.key === 'ArrowUp' ? stepY : e.key === 'ArrowDown' ? -stepY : 0;
    if (!dx && !dy) return;
    e.preventDefault();
    if (handle === 'window') update(bounded(view.x0 + dx, view.y0 + dy, width, height));
    else {
      const v = {...view};
      if (handle.includes('w')) v.x0 = clamp(v.x0 + dx, 0, v.x1 - 20);
      else v.x1 = clamp(v.x1 + dx, v.x0 + 20, 100);
      if (handle.includes('s')) v.y0 = clamp(v.y0 + dy, 0, v.y1 - 20);
      else v.y1 = clamp(v.y1 + dy, v.y0 + 20, 100);
      update(v);
    }
  };
  return (
    <div
      className="overview-map"
      data-kind={kind}
      data-study-expanded={expanded ? '' : undefined}
      style={{'--map-aspect': aspect} as CSSProperties}
    >
      <div
        className="navigator map"
        ref={nav}
        data-study-name={
          kind === 'heatmap'
            ? 'Two-axis overview'
            : kind === 'bar'
              ? 'Station overview strip'
              : 'Horizontal overview strip'
        }
        onPointerDown={(e) => navDown(e, 'new')}
        onPointerMove={navMove}
        onPointerUp={navUp}
        onPointerCancel={() => {
          if (drag.current) update(drag.current.view);
          drag.current = null;
        }}
      >
        <svg
          viewBox={`0 0 ${mapSize.width} ${mapSize.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id={expanded ? 'missing-large' : 'missing-small'}
              width="5"
              height="5"
              patternUnits="userSpaceOnUse"
            >
              <path d="M-1 1L1-1M0 5L5 0M4 6L6 4" stroke="var(--wcl-text-muted)" strokeWidth=".6" />
            </pattern>
          </defs>
          {kind === 'histogram' &&
            bins.map((d) => (
              <rect
                key={d.lower}
                x={(d.lower / 240) * mapSize.width}
                y={(1 - d.count / 22) * mapSize.height}
                width={mapSize.width / 12}
                height={(d.count / 22) * mapSize.height}
                className="map-bin"
                data-selected={
                  selected.some((i) => 'lower' in i && i.lower === d.lower) ? '' : undefined
                }
              />
            ))}
          {kind === 'bar' &&
            bars.flatMap((d, i) =>
              ['supply', 'returned']
                .filter((id) => !getVisibility().bar.includes(id))
                .map((id, j, ids) => (
                  <rect
                    key={d.id + id}
                    x={((i + 0.1 + (j * 0.8) / ids.length) / 12) * mapSize.width}
                    y={(1 - d[id as 'supply'] / 100) * mapSize.height}
                    width={((mapSize.width / 12) * 0.8) / ids.length}
                    height={(d[id as 'supply'] / 100) * mapSize.height}
                    className="map-bin"
                    style={
                      id === 'returned'
                        ? {
                            stroke: 'var(--wcl-chart-series-2, #df5c25)',
                            fill: 'color-mix(in srgb, #df5c25 24%, var(--wcl-surface))',
                          }
                        : undefined
                    }
                    data-selected={
                      selected.some((s) => 'rowId' in s && s.rowId === d.id) ? '' : undefined
                    }
                  />
                )),
            )}
          {kind === 'box' &&
            activeBoxes().map((d, i) => {
              const x = ((i + 0.5) / activeBoxes().length) * mapSize.width,
                y = (v: number) => (1 - v / 110) * mapSize.height,
                w = (mapSize.width / activeBoxes().length) * 0.55;
              return (
                <g
                  key={d.id}
                  className="map-box"
                  data-selected={
                    selected.some((s) => 'groupId' in s && s.groupId === d.id) ? '' : undefined
                  }
                >
                  <path
                    d={`M${x} ${y(d.low)}V${y(d.high)}M${x - w / 4} ${y(d.low)}h${w / 2}M${x - w / 4} ${y(d.high)}h${w / 2}`}
                  />
                  <rect x={x - w / 2} y={y(d.q3)} width={w} height={y(d.q1) - y(d.q3)} />
                  <path d={`M${x - w / 2} ${y(d.median)}h${w}`} />
                  <circle cx={x} cy={y(d.outliers[0])} r={2} />
                </g>
              );
            })}
          {kind === 'heatmap' &&
            activeRooms().flatMap((r, i) =>
              activePeriods().map((c, j) => {
                const d = cells.find((d) => d.room === r.id && d.period === c.id);
                return (
                  <rect
                    key={r.id + c.id}
                    x={(j / activePeriods().length) * mapSize.width}
                    y={(i / activeRooms().length) * mapSize.height}
                    width={mapSize.width / activePeriods().length - 1}
                    height={mapSize.height / activeRooms().length - 1}
                    fill={
                      d
                        ? `color-mix(in srgb, #2878ff ${12 + (d.value / 30) * 72}%, var(--wcl-surface))`
                        : `url(#${expanded ? 'missing-large' : 'missing-small'})`
                    }
                    stroke={
                      selected.some(
                        (s) => 'columnId' in s && s.rowId === r.id && s.columnId === c.id,
                      )
                        ? 'var(--wcl-text)'
                        : 'none'
                    }
                    strokeWidth={1.5}
                  />
                );
              }),
            )}
        </svg>
        <div
          className="map-window"
          tabIndex={0}
          role="group"
          aria-label={`Visible region: ${describe(chartView, kind)}`}
          style={{
            left: `${view.x0}%`,
            top: `${100 - view.y1}%`,
            width: `${width}%`,
            height: `${height}%`,
          }}
          onPointerDown={(e) => navDown(e, 'window')}
          onKeyDown={(e) => navKeys(e, 'window')}
        >
          {(kind === 'heatmap' ? (['nw', 'ne', 'sw', 'se'] as const) : (['sw', 'se'] as const)).map(
            (corner) => (
              <button
                key={corner}
                className={`corner ${corner}`}
                aria-label={
                  kind === 'heatmap'
                    ? `Resize ${corner === 'nw' ? 'upper left' : corner === 'ne' ? 'upper right' : corner === 'sw' ? 'lower left' : 'lower right'} corner`
                    : `Resize ${corner === 'sw' || corner === 'ne' ? 'start' : 'end'} of range`
                }
                onPointerDown={(e) => navDown(e, corner)}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  navKeys(e, corner);
                }}
              />
            ),
          )}
        </div>
      </div>
      {expanded ? (
        <div className="overview-dates">
          <span>
            {kind === 'histogram'
              ? '0–240 ms'
              : kind === 'box'
                ? 'Loops 1–6'
                : kind === 'bar'
                  ? 'Stations 1–12'
                  : 'Rooms A1–A8'}
          </span>
          <span>{kind === 'heatmap' ? '00:00–21:00' : ''}</span>
        </div>
      ) : null}
    </div>
  );
}

function plotBounds(canvas: HTMLElement): DOMRect {
  if (canvas.matches('[data-wcl-heatmap-canvas]')) {
    const cells = canvas.querySelectorAll('[data-wcl-heatmap-cell]');
    const first = cells[0].getBoundingClientRect(),
      last = cells[cells.length - 1].getBoundingClientRect();
    return new DOMRect(first.x, first.y, last.right - first.left, last.bottom - first.top);
  }
  const x = canvas
      .querySelector('[data-axis="x"] [data-wcl-chart-axis-rail]')!
      .getBoundingClientRect(),
    y = canvas.querySelector('[data-axis="y"] [data-wcl-chart-axis-rail]')!.getBoundingClientRect();
  return new DOMRect(x.x, y.y, x.width, y.height);
}
function App() {
  const hidden = useVisibilitySnapshot();
  const [kind, setKind] = useState<Kind>('histogram');
  const [light, setLight] = useState(false),
    [identify, setIdentify] = useState(false),
    [identified, setIdentified] = useState('');
  const [view, setView] = useState<View>(snap({x0: 25, x1: 75, y0: 25, y1: 75}, 'histogram'));
  const viewRef = useRef(view);
  viewRef.current = view;
  const update = (v: View) =>
    setView((old) => {
      const next = snap(v, kind);
      return JSON.stringify(old) === JSON.stringify(next) ? old : next;
    });
  const [selected, setSelected] = useState<readonly StudyItem[]>([]),
    [details, setDetails] = useState(''),
    [overview, setOverview] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<HTMLElement | null>(null),
    [plot, setPlot] = useState({left: 0, width: 0, top: 0, height: 0, labelMiddle: 0});
  const {a, b, c, d} = windowIndices(view, kind);
  const visible = useMemo(
    () => ({
      bins: bins.slice(a, b),
      boxes: boxes.filter(
        (d) => hidden.box.includes(d.id) || activeBoxes().slice(a, b).includes(d),
      ),
      groups: boxGroups.filter(
        (d) =>
          hidden.box.includes(d.id) ||
          activeBoxes()
            .slice(a, b)
            .some((b) => b.id === d.id),
      ),
      bars: bars.slice(c, d),
      rows: rooms.filter(
        (r) => hidden.heatmap.rows.includes(r.id) || activeRooms().slice(c, d).includes(r),
      ),
      columns: periods.filter(
        (p) => hidden.heatmap.columns.includes(p.id) || activePeriods().slice(a, b).includes(p),
      ),
      cells: cells.filter(
        (v) =>
          activeRooms()
            .slice(c, d)
            .some((r) => r.id === v.room) &&
          activePeriods()
            .slice(a, b)
            .some((c) => c.id === v.period),
      ),
    }),
    [a, b, c, d, hidden],
  );
  const width = view.x1 - view.x0,
    height = view.y1 - view.y0;
  const minX = Math.min(100, ((kind === 'box' ? 2 : 3) / counts(kind).x) * 100),
    minY = Math.min(100, (3 / counts(kind).y) * 100);
  const move = (x: number, y: number) =>
    update(bounded(view.x0 + x * width, view.y0 + y * height, width, height));
  const zoom = (factor: number) => {
    const w = enabledX(kind) ? clamp(width * factor, minX, 100) : 100,
      h = enabledY(kind) ? clamp(height * factor, minY, 100) : 100;
    update(bounded(view.x0 + (width - w) / 2, view.y0 + (height - h) / 2, w, h));
  };
  useLayoutEffect(() => {
    const collect = () =>
      setCanvas(
        host.current?.querySelector<HTMLElement>(
          '[data-wcl-chart-canvas], [data-wcl-heatmap-canvas]',
        ) ?? null,
      );
    collect();
    const o = new MutationObserver(collect);
    o.observe(host.current!, {subtree: true, childList: true});
    return () => o.disconnect();
  }, []);
  useLayoutEffect(() => {
    if (!canvas) return;
    const measure = () => {
      const rect = plotBounds(canvas),
        bounds = host.current!.getBoundingClientRect();
      const label = canvas
        .querySelector('[data-axis="x"] [data-wcl-chart-axis-label]')
        ?.getBoundingClientRect();
      const next = {
        left: rect.x - bounds.x,
        width: rect.width,
        top: rect.y - bounds.y,
        height: rect.height,
        labelMiddle: label ? label.y + label.height / 2 - bounds.y : rect.bottom - bounds.y + 28,
      };
      setPlot((old) =>
        Object.keys(next).every(
          (k) => Math.abs(old[k as keyof typeof old] - next[k as keyof typeof next]) < 0.1,
        )
          ? old
          : next,
      );
    };
    measure();
    const r = new ResizeObserver(measure);
    r.observe(canvas);
    r.observe(host.current!);
    const m = new MutationObserver(measure);
    m.observe(canvas, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['viewBox', 'x1', 'x2', 'y1', 'y2'],
    });
    return () => {
      r.disconnect();
      m.disconnect();
    };
  }, [canvas]);
  useLayoutEffect(() => {
    const element = host.current;
    if (!element || !canvas) return;
    const fingers = new Map<number, {x: number; y: number}>();
    let active = false;
    let start: {
      view: View;
      x: number;
      y: number;
      distance: number;
      plot: DOMRect;
      ax: number;
      ay: number;
    } | null = null;
    const down = (e: globalThis.PointerEvent) => {
      if (
        e.pointerType !== 'touch' ||
        !(e.target instanceof Element) ||
        !e.target.closest('[data-wcl-chart-svg], [data-wcl-heatmap-canvas]')
      )
        return;
      fingers.set(e.pointerId, {x: e.clientX, y: e.clientY});
      if (fingers.size < 2) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (!active) {
        (canvas.matches('[data-wcl-heatmap-canvas]')
          ? canvas
          : canvas.querySelector('svg')
        )?.dispatchEvent(
          new window.PointerEvent('pointercancel', {
            bubbles: true,
            pointerType: 'touch',
            pointerId: [...fingers.keys()][0],
          }),
        );
        document.body.dispatchEvent(
          new window.PointerEvent('pointerdown', {bubbles: true, pointerType: 'touch'}),
        );
        active = true;
        const a = [...fingers.values()],
          x = (a[0].x + a[1].x) / 2,
          y = (a[0].y + a[1].y) / 2;
        const rect = plotBounds(canvas);
        start = {
          view: {...viewRef.current},
          x,
          y,
          distance: Math.hypot(a[1].x - a[0].x, a[1].y - a[0].y),
          plot: rect,
          ax: clamp((x - rect.x) / rect.width, 0, 1),
          ay: clamp(1 - (y - rect.y) / rect.height, 0, 1),
        };
      }
      for (const id of fingers.keys()) element.setPointerCapture(id);
    };
    const touchMove = (e: globalThis.PointerEvent) => {
      if (!fingers.has(e.pointerId)) return;
      fingers.set(e.pointerId, {x: e.clientX, y: e.clientY});
      if (!active) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (fingers.size < 2 || !start) return;
      const a = [...fingers.values()],
        g = start,
        x = (a[0].x + a[1].x) / 2,
        y = (a[0].y + a[1].y) / 2;
      const ratio = g.distance / Math.max(15, Math.hypot(a[1].x - a[0].x, a[1].y - a[0].y));
      const oldW = g.view.x1 - g.view.x0,
        oldH = g.view.y1 - g.view.y0,
        w = clamp(oldW * ratio, 20, 100),
        h = clamp(oldH * ratio, 20, 100);
      update(
        bounded(
          g.view.x0 + g.ax * (oldW - w) - ((x - g.x) / g.plot.width) * oldW,
          g.view.y0 + g.ay * (oldH - h) + ((y - g.y) / g.plot.height) * oldH,
          w,
          h,
        ),
      );
    };
    const finish = (e: globalThis.PointerEvent) => {
      if (!e.isTrusted || !fingers.has(e.pointerId)) return;
      fingers.delete(e.pointerId);
      if (active) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
      if (element.hasPointerCapture(e.pointerId)) element.releasePointerCapture(e.pointerId);
      if (!fingers.size) {
        active = false;
        start = null;
      }
    };
    element.addEventListener('pointerdown', down, true);
    element.addEventListener('pointermove', touchMove, true);
    element.addEventListener('pointerup', finish, true);
    element.addEventListener('pointercancel', finish, true);
    return () => {
      element.removeEventListener('pointerdown', down, true);
      element.removeEventListener('pointermove', touchMove, true);
      element.removeEventListener('pointerup', finish, true);
      element.removeEventListener('pointercancel', finish, true);
    };
  }, [canvas, kind]);

  const selection = {
    selectedItems: selected,
    onSelectionChange: (next: readonly StudyItem[]) =>
      setSelected((previous) => [...previous.filter((i) => !itemVisible(i, view, kind)), ...next]),
    labels: {
      instructions: help,
      clear: 'Clear selection',
      empty: 'Nothing selected',
      summary: (n: number) => `${n} selected`,
      item: (i: StudyItem) => itemLabel(i),
      hidden: (s: string) => `${s} (outside view)`,
    },
  };
  const common = {
    dataTableLabel: 'Visible data',
    emptyState: {title: 'No data', description: 'Reset the view.'},
    invalidData: {title: 'Invalid data', description: 'Check the supplied data.'},
    minimumSize: {width: 260, height: 260},
    aspectRatio: 16 / 9,
  };
  const identifyTarget = (target: EventTarget | null) => {
    if (identify && target instanceof Element)
      setIdentified(target.closest('[data-study-name]')?.getAttribute('data-study-name') ?? '');
  };
  const isFull = width > 99.9 && height > 99.9;
  const isMin =
    (!enabledX(kind) || width <= minX + 0.01) && (!enabledY(kind) || height <= minY + 0.01);
  return (
    <AppearanceProvider appearance={light ? 'light' : 'dark'} accent="#2878ff">
      <main
        className="study"
        onPointerOver={(e) => identifyTarget(e.target)}
        onFocusCapture={(e) => identifyTarget(e.target)}
      >
        <header>
          <h1>Distribution and category navigation</h1>
        </header>
        <div className="study-controls">
          <div className="chart-choices" data-study-name="Chart type choices">
            <RadioGroup
              label="Chart type"
              name="chart-type"
              value={kind}
              onChange={(k: Kind) => {
                setKind(k);
                setView(snap({x0: 25, x1: 75, y0: 25, y1: 75}, k));
                setSelected([]);
                setDetails('');
              }}
              options={[
                {value: 'histogram', label: 'Histogram'},
                {value: 'box', label: 'Box plot'},
                {value: 'bar', label: 'Horizontal bars'},
                {value: 'heatmap', label: 'Heatmap'},
              ]}
            />
          </div>
          <div className="toggles">
            <ToggleButton isSelected={light} onChange={setLight}>
              Light appearance
            </ToggleButton>
            <ToggleButton isSelected={identify} onChange={setIdentify}>
              Identify elements
            </ToggleButton>
          </div>
        </div>
        <section
          className="example"
          data-kind={kind}
          data-dense={b - a > 6 ? '' : undefined}
          style={
            {
              '--plot-left': `${plot.left}px`,
              '--plot-width': `${plot.width}px`,
              '--plot-top': `${plot.top}px`,
              '--plot-height': `${plot.height}px`,
              '--axis-label-middle': `${plot.labelMiddle}px`,
            } as CSSProperties
          }
        >
          <div className="chart-host" ref={host} data-study-name="Main chart">
            {kind === 'histogram' ? (
              <Histogram
                {...common}
                data={visible.bins}
                title="Restart latency"
                description="Restarts per 20 ms interval."
                distribution={{
                  kind: 'binned',
                  lowerAccessor: 'lower',
                  upperAccessor: 'upper',
                  ordinateAccessor: 'count',
                  ordinate: 'count',
                }}
                xAxis={{
                  label: 'Restart latency',
                  unit: 'ms',
                  scale: {type: 'linear', domain: [a * 20, b * 20]},
                }}
                yAxis={{label: 'Restarts', scale: {type: 'linear'}}}
                interaction={{
                  selection: {...selection, selectedItems: selected.filter((i) => 'lower' in i)},
                  onActivate: (a) => setDetails(`${itemLabel(a.item)}: ${a.value} restarts`),
                }}
              />
            ) : kind === 'box' ? (
              <BoxPlot
                {...common}
                data={visible.boxes}
                title="Recovery time by loop"
                legend={{label: 'Loops'}}
                visibilityLabels={visibilityLabels}
                description="Quartiles, whiskers and recorded outliers."
                groupAccessor="id"
                groups={visible.groups}
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
                xAxis={{label: 'Loop'}}
                yAxis={{label: 'Time', unit: 'min', scale: {type: 'linear'}}}
                interaction={{
                  selection: {...selection, selectedItems: selected.filter((i) => 'groupId' in i)},
                  getOutlierId: (ctx) =>
                    ctx.datum.outlierIds[ctx.kind === 'summary' ? ctx.outlierIndex : 0],
                  onActivate: (a) =>
                    setDetails(
                      a.kind === 'outlier'
                        ? `${itemLabel(a.item)}: ${a.value} min`
                        : `${itemLabel(a.item)}: median ${a.summary.median} min`,
                    ),
                }}
              />
            ) : kind === 'bar' ? (
              <BarChart
                {...common}
                aspectRatio={16 / 9}
                legend={{label: 'Energy'}}
                visibilityLabels={visibilityLabels}
                data={visible.bars}
                title="Station supply"
                description="Daily supplied energy for stations S01 to S12."
                layout="grouped"
                series={[
                  {id: 'supply', label: 'Supply', accessor: 'supply', color: 'accent'},
                  {id: 'returned', label: 'Returned', accessor: 'returned', color: 'series-2'},
                ]}
                xAxis={{label: 'Energy', unit: 'MWh', scale: {type: 'linear'}}}
                yAxis={{label: 'Station', accessor: 'label', scale: {type: 'categorical'}}}
                interaction={{
                  target: 'category',
                  getRowId: (d) => d.id,
                  selection: {
                    ...selection,
                    selectedItems: selected.filter((i) => 'rowId' in i && !('columnId' in i)),
                  },
                  onActivate: (a) => setDetails(`${a.datum.label}: ${a.datum.supply} MWh`),
                }}
              />
            ) : (
              <Heatmap
                {...common}
                data={visible.cells}
                visibilityLabels={heatVisibility}
                rows={visible.rows}
                columns={visible.columns}
                rowAccessor="room"
                columnAccessor="period"
                title="Room temperature"
                description="Rooms A1 to A8. Patterned cells have no reading."
                value={{accessor: 'value', label: 'Temperature', unit: '°C'}}
                scale={{type: 'sequential', color: '#2878ff', domain: [0, 30]}}
                labels={{
                  row: 'Room',
                  column: 'Time',
                  missing: 'No reading',
                  colorKey: 'Temperature',
                  scrollRegion: 'Temperature grid',
                }}
                interaction={{
                  selection: {...selection, selectedItems: selected.filter((i) => 'columnId' in i)},
                  onActivate: (a) =>
                    setDetails(
                      `${a.row.label}, ${a.column.label}: ${a.value === undefined ? 'No reading' : `${a.value} °C`}`,
                    ),
                }}
              />
            )}
            {canvas && (
              <>
                <div className="chart-controls" data-study-name="Chart zoom controls">
                  <span className="period">{describe(view, kind)}</span>
                  <div className="zoom-buttons">
                    <button aria-label="Zoom out" disabled={isFull} onClick={() => zoom(2)}>
                      −
                    </button>
                    <button aria-label="Zoom in" disabled={isMin} onClick={() => zoom(0.5)}>
                      +
                    </button>
                    <button aria-label="Reset view" disabled={isFull} onClick={() => update(full)}>
                      ↺
                    </button>
                  </div>
                </div>
                {enabledX(kind) && (
                  <>
                    <button
                      className="pan-arrow earlier"
                      aria-label="Move left"
                      disabled={view.x0 < 0.01}
                      onClick={() => move(-0.3, 0)}
                    >
                      ←
                    </button>
                    <button
                      className="pan-arrow later"
                      aria-label="Move right"
                      disabled={view.x1 > 99.99}
                      onClick={() => move(0.3, 0)}
                    >
                      →
                    </button>
                  </>
                )}
                {enabledY(kind) && (
                  <>
                    <button
                      className="pan-arrow up"
                      aria-label="Move up"
                      disabled={view.y1 > 99.99}
                      onClick={() => move(0, 0.3)}
                    >
                      ↑
                    </button>
                    <button
                      className="pan-arrow down"
                      aria-label="Move down"
                      disabled={view.y0 < 0.01}
                      onClick={() => move(0, -0.3)}
                    >
                      ↓
                    </button>
                  </>
                )}
              </>
            )}
          </div>
          <div className="overview-disclosure" data-study-name="Overview disclosure">
            <Disclosure
              headingLevel={3}
              title="Overview"
              isExpanded={overview}
              onExpandedChange={setOverview}
            >
              {kind === 'heatmap' ? (
                <div className="compact-overview">
                  <OverviewMap
                    view={view}
                    update={update}
                    kind={kind}
                    selected={selected}
                    aspect={kind === 'heatmap' ? 1 : plot.width / (plot.height || 1) || 2}
                  />
                  <Dialog
                    title="Overview"
                    description={describe(view, kind)}
                    closeLabel="Close overview"
                    trigger={
                      <span className="overview-expand">
                        <IconButton variant="quiet" size="compact" label="Expand overview">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            aria-hidden="true"
                          >
                            <path d="M6 2H2v4M10 2h4v4M14 10v4h-4M6 14H2v-4M2 2l4 4m8-4-4 4m4 8-4-4M2 14l4-4" />
                          </svg>
                        </IconButton>
                      </span>
                    }
                    actions={({close}) => (
                      <>
                        <Button variant="quiet" onPress={() => update(full)}>
                          Reset view
                        </Button>
                        <Button onPress={close}>Done</Button>
                      </>
                    )}
                  >
                    <OverviewMap
                      expanded
                      view={view}
                      update={update}
                      kind={kind}
                      selected={selected}
                      aspect={kind === 'heatmap' ? 1 : plot.width / (plot.height || 1) || 2}
                    />
                  </Dialog>
                </div>
              ) : kind === 'bar' ? (
                <div className="axis-overview" data-study-name="Horizontal station overview">
                  <OverviewMap
                    view={view}
                    update={update}
                    kind={kind}
                    selected={selected}
                    aspect={1}
                  />
                  <div className="overview-dates">
                    <span>S01</span>
                    <span>S12</span>
                  </div>
                </div>
              ) : (
                <div className="axis-overview" data-study-name="Horizontal overview strip">
                  <OverviewMap
                    view={view}
                    update={update}
                    kind={kind}
                    selected={selected}
                    aspect={1}
                  />
                  <div className="overview-dates">
                    <span>{kind === 'histogram' ? '0 ms' : (activeBoxes()[0]?.label ?? '')}</span>
                    <span>
                      {kind === 'histogram' ? '240 ms' : (activeBoxes().at(-1)?.label ?? '')}
                    </span>
                  </div>
                </div>
              )}
            </Disclosure>
          </div>
          <p className="hint" id="gesture-help">
            {help}
          </p>
          <div className="selection" data-study-name="Selection and details">
            <p aria-live="polite">
              {selected.length
                ? `${selected.length} selected: ${selected.map((i) => `${itemLabel(i)}${itemVisible(i, view, kind) ? '' : ' (outside view)'}`).join(', ')}`
                : 'Nothing selected'}
            </p>
            <Button variant="quiet" isDisabled={!selected.length} onPress={() => setSelected([])}>
              Clear selection
            </Button>
            {details && <p role="status">Opened {details}</p>}
          </div>
        </section>
        {identify && (
          <output className="identifier">{identified || 'Point at or focus an element.'}</output>
        )}
      </main>
    </AppearanceProvider>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
