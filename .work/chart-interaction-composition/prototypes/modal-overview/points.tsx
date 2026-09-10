// Isolated two-axis exploration study. View filtering and navigation are not public APIs.
import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent,
} from 'react';
import {
  AppearanceProvider,
  ToggleButton,
  Button,
  ScatterChart,
  BubbleChart,
  type ChartSelectionItem,
} from '../../../../src/index.js';
import '../../../../src/styles.css';
import './points.css';
import './styles.css';
import {
  ModalOverview,
  StudyHeading,
  ChartPicker,
  initialChart,
  visibilityLabels,
} from './shared.js';
import {useVisibilitySnapshot} from './visibility-store.js';

const allData = Array.from({length: 25}, (_, i) => ({
  id: `reading-${i + 1}`,
  label: `Reading ${i + 1}`,
  group: i % 2 ? 'south' : 'north',
  load: 10 + (i % 5) * 20,
  demand: 10 + Math.floor(i / 5) * 20,
  stored: 20 + ((i * 17) % 81),
}));
const series = [
  {id: 'north', label: 'North loop', color: 'accent'},
  {id: 'south', label: 'South loop', color: 'series-2'},
] as const;
type View = {x0: number; x1: number; y0: number; y1: number};
const full: View = {x0: 0, x1: 100, y0: 0, y1: 100};
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const axis = (start: number, size: number) => {
  const span = clamp(size, 20, 100),
    first = clamp(start, 0, 100 - span);
  return [first, first + span] as const;
};
const bounded = (x: number, y: number, width: number, height: number): View => {
  const [x0, x1] = axis(x, width),
    [y0, y1] = axis(y, height);
  return {x0, x1, y0, y1};
};
const inView = (d: (typeof allData)[number], v: View) =>
  d.load >= v.x0 && d.load <= v.x1 && d.demand >= v.y0 && d.demand <= v.y1;
const format = (v: number) => Math.round(v).toString();
const describe = (v: View) =>
  `${format(v.x0)}–${format(v.x1)}% load; ${format(v.y0)}–${format(v.y1)} kW`;

function OverviewMap({
  view,
  update,
  kind,
  selected,
  aspect,
  expanded = false,
}: {
  view: View;
  update: (next: View) => void;
  kind: 'scatter' | 'bubble';
  selected: readonly ChartSelectionItem[];
  aspect: number;
  expanded?: boolean;
}) {
  const hidden = useVisibilitySnapshot().box;
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
    nav.current.dataset.dragging = '';
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
    nav.current?.removeAttribute('data-dragging');
  };
  const navKeys = (e: KeyboardEvent, handle: Handle) => {
    const step = e.shiftKey ? 10 : 2,
      dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0,
      dy = e.key === 'ArrowUp' ? step : e.key === 'ArrowDown' ? -step : 0;
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
      data-study-expanded={expanded ? '' : undefined}
      style={{'--map-aspect': aspect} as CSSProperties}
    >
      <div
        className="navigator map"
        ref={nav}
        data-study-name="Two-axis overview"
        onPointerDown={(e) => navDown(e, 'new')}
        onPointerMove={navMove}
        onPointerUp={navUp}
        onPointerCancel={() => {
          if (drag.current) update(drag.current.view);
          drag.current = null;
          nav.current?.removeAttribute('data-dragging');
        }}
      >
        <svg
          viewBox={`0 0 ${mapSize.width} ${mapSize.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {allData
            .filter((d) => !hidden.includes(d.group))
            .map((d) => {
              const x = (d.load / 100) * mapSize.width,
                y = ((100 - d.demand) / 100) * mapSize.height;
              const r = kind === 'bubble' ? Math.sqrt(d.stored / 100) * 5 : 2.5;
              const side = r * (kind === 'bubble' ? Math.sqrt(Math.PI) : 1.7);
              const common = {
                className: `map-point ${d.group}`,
                'data-selected': selected.some((item) => item.rowId === d.id) ? '' : undefined,
              };
              return d.group === 'north' ? (
                <circle key={d.id} {...common} cx={x} cy={y} r={r} />
              ) : (
                <rect
                  key={d.id}
                  {...common}
                  x={x - side / 2}
                  y={y - side / 2}
                  width={side}
                  height={side}
                  transform={`rotate(45 ${x} ${y})`}
                />
              );
            })}
        </svg>
        <div
          className="map-window"
          tabIndex={0}
          role="group"
          aria-label={`Visible region: ${describe(view)}`}
          style={{
            left: `${view.x0}%`,
            top: `${100 - view.y1}%`,
            width: `${width}%`,
            height: `${height}%`,
          }}
          onPointerDown={(e) => navDown(e, 'window')}
          onKeyDown={(e) => navKeys(e, 'window')}
        >
          {(['nw', 'ne', 'sw', 'se'] as const).map((corner) => (
            <button
              key={corner}
              className={`corner ${corner}`}
              aria-label={`Resize ${corner === 'nw' ? 'upper left' : corner === 'ne' ? 'upper right' : corner === 'sw' ? 'lower left' : 'lower right'} corner`}
              onPointerDown={(e) => navDown(e, corner)}
              onKeyDown={(e) => {
                e.stopPropagation();
                navKeys(e, corner);
              }}
            />
          ))}
        </div>
      </div>
      {expanded ? (
        <div className="overview-dates">
          <span>Load: 0–100%</span>
          <span>Demand: 0–100 kW</span>
        </div>
      ) : null}
    </div>
  );
}

export default function App() {
  const [kind] = useState<'scatter' | 'bubble'>(initialChart as 'scatter' | 'bubble');
  const [light, setLight] = useState(false),
    [identify, setIdentify] = useState(false),
    [identified, setIdentified] = useState('');
  const [view, setView] = useState<View>({x0: 20, x1: 80, y0: 20, y1: 80});
  const viewRef = useRef(view);
  viewRef.current = view;
  const update = (next: View) =>
    setView((old) =>
      Object.keys(next).every(
        (k) => Math.abs(old[k as keyof View] - next[k as keyof View]) < 0.0001,
      )
        ? old
        : next,
    );
  const width = view.x1 - view.x0,
    height = view.y1 - view.y0;
  const visibleData = useMemo(() => allData.filter((d) => inView(d, view)), [view]);
  const [selected, setSelected] = useState<readonly ChartSelectionItem[]>([]),
    [details, setDetails] = useState('');
  const host = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<HTMLElement | null>(null);
  const [plot, setPlot] = useState({left: 0, width: 0, top: 0, height: 0, labelMiddle: 0});
  const move = (x: number, y: number) =>
    update(bounded(view.x0 + x * width, view.y0 + y * height, width, height));
  const zoom = (factor: number) => {
    const w = clamp(width * factor, 20, 100),
      h = clamp(height * factor, 20, 100);
    update(bounded(view.x0 + (width - w) / 2, view.y0 + (height - h) / 2, w, h));
  };
  useLayoutEffect(() => {
    const collect = () =>
      setCanvas(host.current?.querySelector<HTMLElement>('[data-wcl-chart-canvas]') ?? null);
    collect();
    const observer = new MutationObserver(collect);
    if (host.current) observer.observe(host.current, {childList: true, subtree: true});
    return () => observer.disconnect();
  }, []);
  useLayoutEffect(() => {
    if (!canvas) return;
    const measure = () => {
      const x = canvas
        .querySelector('[data-axis="x"] [data-wcl-chart-axis-rail]')
        ?.getBoundingClientRect();
      const y = canvas
        .querySelector('[data-axis="y"] [data-wcl-chart-axis-rail]')
        ?.getBoundingClientRect();
      const label = canvas
        .querySelector('[data-axis="x"] [data-wcl-chart-axis-label]')
        ?.getBoundingClientRect();
      if (!x || !y || !label || !host.current) return;
      const bounds = host.current.getBoundingClientRect();
      const next = {
        left: x.left - bounds.left,
        width: x.width,
        top: y.top - bounds.top,
        height: y.height,
        labelMiddle: label.top + label.height / 2 - bounds.top,
      };
      setPlot((old) =>
        Object.keys(next).every(
          (k) => Math.abs(old[k as keyof typeof next] - next[k as keyof typeof next]) < 0.1,
        )
          ? old
          : next,
      );
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(canvas);
    resize.observe(host.current!);
    const mutations = new MutationObserver(measure);
    mutations.observe(canvas, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['viewBox', 'x1', 'x2', 'y1', 'y2'],
    });
    return () => {
      resize.disconnect();
      mutations.disconnect();
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
        !e.target.closest('[data-wcl-chart-svg]')
      )
        return;
      fingers.set(e.pointerId, {x: e.clientX, y: e.clientY});
      if (fingers.size < 2) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (!active) {
        canvas.querySelector('svg')?.dispatchEvent(
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
        const xr = canvas
          .querySelector('[data-axis="x"] [data-wcl-chart-axis-rail]')!
          .getBoundingClientRect();
        const yr = canvas
          .querySelector('[data-axis="y"] [data-wcl-chart-axis-rail]')!
          .getBoundingClientRect();
        const rect = new DOMRect(xr.x, yr.y, xr.width, yr.height);
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
  }, [canvas]);
  const Chart = kind === 'scatter' ? ScatterChart : BubbleChart;
  const identifyTarget = (target: EventTarget | null) => {
    if (identify && target instanceof Element)
      setIdentified(target.closest('[data-study-name]')?.getAttribute('data-study-name') ?? '');
  };
  return (
    <AppearanceProvider appearance={light ? 'light' : 'dark'} accent="#2878ff">
      <main
        className="study"
        onPointerOver={(e) => identifyTarget(e.target)}
        onFocusCapture={(e) => identifyTarget(e.target)}
      >
        <StudyHeading />
        <div className="study-controls">
          <ChartPicker value={kind} />
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
          style={
            {
              '--plot-left': `${plot.left}px`,
              '--plot-width': `${plot.width}px`,
              '--plot-top': `${plot.top}px`,
              '--axis-label-middle': `${plot.labelMiddle}px`,
            } as CSSProperties
          }
        >
          <div className="chart-host" ref={host} data-study-name="Main chart">
            <Chart
              key={kind}
              data={visibleData}
              idAccessor="id"
              labelAccessor="label"
              seriesAccessor="group"
              series={series}
              visibilityLabels={visibilityLabels}
              legend={{label: 'Turbine loops'}}
              title="Load and thermal demand"
              description={
                kind === 'bubble'
                  ? 'Bubble area shows stored energy, in kWh.'
                  : 'Each mark is one operating reading.'
              }
              dataTableLabel="Visible operating readings"
              emptyState={{
                title: 'No readings in view',
                description: 'Move the view or reset it to find readings.',
              }}
              invalidData={{title: 'Invalid readings', description: 'Check observation values.'}}
              minimumSize={{width: 280, height: 240}}
              aspectRatio={16 / 9}
              {...(kind === 'bubble'
                ? {magnitude: {accessor: 'stored' as const, label: 'Stored energy', unit: 'kWh'}}
                : {})}
              xAxis={{
                accessor: 'load',
                label: 'Load',
                unit: '%',
                scale: {type: 'linear', domain: [view.x0, view.x1]},
                tickCount: 5,
              }}
              yAxis={{
                accessor: 'demand',
                label: 'Demand',
                unit: 'kW',
                scale: {type: 'linear', domain: [view.y0, view.y1]},
                tickCount: 5,
              }}
              interaction={{
                onActivate: (a) =>
                  setDetails(
                    `${a.datum.label}: ${a.datum.load}% load, ${a.datum.demand} kW demand, ${a.datum.stored} kWh stored.`,
                  ),
                selection: {
                  selectedItems: selected,
                  onSelectionChange: (next) =>
                    setSelected((previous) => [
                      ...previous.filter((item) => !visibleData.some((d) => d.id === item.rowId)),
                      ...next,
                    ]),
                  labels: {
                    instructions:
                      'Click to select. Drag selects centers inside. Control/Command-click or press and hold opens details.',
                    clear: 'Clear selection',
                    empty: 'Nothing selected',
                    summary: (n) => `${n} readings selected`,
                    item: (item) => allData.find((d) => d.id === item.rowId)?.label ?? item.rowId,
                    hidden: (s) => `${s} (hidden)`,
                  },
                },
              }}
            />
            {canvas ? (
              <>
                <div className="chart-controls" data-study-name="Chart zoom controls">
                  <span className="period">
                    <span>
                      {format(view.x0)}–{format(view.x1)}% load
                    </span>
                    <span>
                      {format(view.y0)}–{format(view.y1)} kW
                    </span>
                  </span>
                  <div className="zoom-buttons">
                    <ModalOverview description={describe(view)} onReset={() => update(full)}>
                      <OverviewMap
                        expanded
                        view={view}
                        update={update}
                        kind={kind}
                        selected={selected}
                        aspect={plot.width / (plot.height || 1) || 2}
                      />
                    </ModalOverview>
                    <button
                      type="button"
                      aria-label="Zoom out"
                      disabled={width >= 99.99 && height >= 99.99}
                      onClick={() => zoom(2)}
                    >
                      −
                    </button>
                    <button
                      type="button"
                      aria-label="Zoom in"
                      disabled={width <= 20.01 && height <= 20.01}
                      onClick={() => zoom(0.5)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      aria-label="Reset view"
                      disabled={width >= 99.99 && height >= 99.99}
                      onClick={() => update(full)}
                    >
                      ↺
                    </button>
                  </div>
                </div>
                <button
                  className="pan-arrow earlier"
                  aria-label="Lower load"
                  title="Lower load"
                  disabled={view.x0 <= 0.01}
                  onClick={() => move(-0.3, 0)}
                >
                  ←
                </button>
                <button
                  className="pan-arrow lower"
                  aria-label="Lower demand"
                  title="Lower demand"
                  disabled={view.y0 <= 0.01}
                  onClick={() => move(0, -0.3)}
                >
                  ↓
                </button>
                <button
                  className="pan-arrow higher"
                  aria-label="Higher demand"
                  title="Higher demand"
                  disabled={view.y1 >= 99.99}
                  onClick={() => move(0, 0.3)}
                >
                  ↑
                </button>
                <button
                  className="pan-arrow later"
                  aria-label="Higher load"
                  title="Higher load"
                  disabled={view.x1 >= 99.99}
                  onClick={() => move(0.3, 0)}
                >
                  →
                </button>
              </>
            ) : null}
          </div>
          <p className="hint" id="gesture-help">
            Drag to select. Two fingers pan or pinch to zoom. Control/Command-click or press and
            hold for details.
          </p>
          <div className="selection" data-study-name="Selection and details">
            <p aria-live="polite">
              {selected.length
                ? `${selected.length} selected: ${selected
                    .map((item) => {
                      const d = allData.find((d) => d.id === item.rowId)!;
                      return `${d.label}${inView(d, view) ? '' : ' (outside view)'}`;
                    })
                    .join(', ')}`
                : 'Nothing selected'}
            </p>
            <Button variant="quiet" isDisabled={!selected.length} onPress={() => setSelected([])}>
              Clear selection
            </Button>
            {details ? <p role="status">Opened {details}</p> : null}
          </div>
        </section>
        {identify ? (
          <output className="identifier">{identified || 'Point at or focus an element.'}</output>
        ) : null}
      </main>
    </AppearanceProvider>
  );
}
