// Isolated interaction study: the viewport filter and navigation controls are not public APIs.
import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type KeyboardEvent,
} from 'react';
import {createRoot} from 'react-dom/client';
import {createPortal} from 'react-dom';
import {
  AppearanceProvider,
  Button,
  Disclosure,
  ToggleButton,
  LineChart,
  type ChartSelectionItem,
} from '../../../../src/index.js';
import '../../../../src/styles.css';
import './styles.css';

const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const revenue = [
  82, 89, 96, 90, 110, 120, 116, 126, 119, 137, 148, 155, 112, 120, 131, 124, 145, 160, 154, 172,
  168, 181, 195, 207,
];
const costs = [
  58, 62, 66, 65, 71, 76, 72, 82, 81, 87, 93, 96, 78, 80, 89, 91, 97, 104, 108, 113, 117, 121, 132,
  138,
];
const allData = revenue.map((value, i) => ({
  id: String(i),
  date: new Date(Date.UTC(2025, i, 1)),
  month: `${names[i % 12]} ${i < 12 ? '25' : '26'}`,
  revenue: value,
  costs: costs[i],
}));
const series = [
  {id: 'revenue', label: 'Revenue', accessor: 'revenue', color: 'accent', showPoints: true},
  {id: 'costs', label: 'Operating costs', accessor: 'costs', color: 'series-2', showPoints: true},
] as const;
type Window = [number, number];
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const bounded = (start: number, count: number): Window => {
  const size = clamp(Math.round(count), 3, 24);
  const first = clamp(Math.round(start), 0, 24 - size);
  return [first, first + size];
};
const label = (window: Window) => `${allData[window[0]].month} – ${allData[window[1] - 1].month}`;
const smallPath = (key: 'revenue' | 'costs') =>
  allData
    .map((d, i) => `${i ? 'L' : 'M'}${((i + 0.5) / 24) * 1000},${70 - (d[key] / 220) * 58}`)
    .join(' ');

function App() {
  const [light, setLight] = useState(false),
    [identify, setIdentify] = useState(false),
    [identified, setIdentified] = useState('');
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [chartWidth, setChartWidth] = useState(320);
  const [plot, setPlot] = useState({left: 0, width: 0, top: 0, labelMiddle: 0});
  const [view, setView] = useState<Window>([6, 12]);
  const viewRef = useRef(view);
  viewRef.current = view;
  const [selected, setSelected] = useState<readonly ChartSelectionItem[]>([]);
  const [details, setDetails] = useState('');
  const host = useRef<HTMLDivElement>(null),
    nav = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<HTMLElement | null>(null);
  const visibleData = useMemo(() => allData.slice(view[0], view[1]), [view[0], view[1]]);
  const count = view[1] - view[0];
  const outside = (item: ChartSelectionItem) => +item.rowId < view[0] || +item.rowId >= view[1];
  const changeView = (next: Window) =>
    setView((previous) => (previous[0] === next[0] && previous[1] === next[1] ? previous : next));
  const shift = (amount: number) => changeView(bounded(view[0] + amount, count));
  const zoom = (factor: number) => {
    const size = clamp(Math.round(count * factor), 3, 24);
    changeView(bounded((view[0] + view[1] - size) / 2, size));
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
      setChartWidth(canvas.clientWidth);
      const x = canvas
        .querySelector('[data-axis="x"] [data-wcl-chart-axis-rail]')
        ?.getBoundingClientRect();
      const y = canvas
        .querySelector('[data-axis="y"] [data-wcl-chart-axis-rail]')
        ?.getBoundingClientRect();
      const label = canvas
        .querySelector('[data-axis="x"] [data-wcl-chart-axis-label]')
        ?.getBoundingClientRect();
      if (!x || !y || !label) return;
      const bounds = host.current!.getBoundingClientRect();
      const next = {
        left: x.left - bounds.left,
        width: x.width,
        top: y.top - bounds.top,
        labelMiddle: label.top + label.height / 2 - bounds.top,
      };
      setPlot((previous) =>
        Object.keys(next).every(
          (key) => previous[key as keyof typeof next] === next[key as keyof typeof next],
        )
          ? previous
          : next,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(canvas);
    if (host.current) observer.observe(host.current);
    const mutations = new MutationObserver(measure);
    mutations.observe(canvas, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['viewBox', 'x1', 'x2', 'y1', 'y2', 'transform'],
    });
    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [canvas]);
  useLayoutEffect(() => {
    if (!canvas) return;
    // Prototype time-axis adapter: try the existing chart's staggered-label approach
    // before reducing density. Production currently enables it only for categorical axes.
    const thin = () => {
      const labels = [
        ...canvas.querySelectorAll<SVGTextElement>('[data-axis="x"] [data-wcl-chart-tick-label]'),
      ];
      labels.forEach((node) => {
        node.style.visibility = '';
        node.style.transform = '';
      });
      if (labels.length < 2) return;
      const bounds = labels.map((node) => node.getBoundingClientRect());
      const all = labels.map((_, i) => i);
      const fits = (indices: number[], rows: number) =>
        indices.every(
          (index, i) => i < rows || bounds[index].left >= bounds[indices[i - rows]].right + 8,
        );
      let shown = all;
      const stagger = !fits(all, 1);
      if (stagger && !fits(all, 2)) {
        for (let count = labels.length - 1; count >= 2; count--) {
          const indices = Array.from({length: count}, (_, i) =>
            Math.round((i * (labels.length - 1)) / (count - 1)),
          );
          if (fits(indices, 2)) {
            shown = indices;
            break;
          }
        }
      }
      const rowOffset = parseFloat(getComputedStyle(labels[0]).fontSize) * 1.5;
      const offsets = labels.map((_, index) => (stagger ? (index % 2) * rowOffset : 0));
      shown.forEach((index, order) => {
        offsets[index] = stagger ? (order % 2) * rowOffset : 0;
      });
      labels.forEach((node, index) => {
        node.style.visibility = shown.includes(index) ? '' : 'hidden';
        node.style.transform = `translateY(${offsets[index]}px)`;
      });
      const axisLabel = canvas.querySelector<SVGElement>(
        '[data-axis="x"] [data-wcl-chart-axis-label]',
      );
      if (axisLabel) axisLabel.style.transform = `translateY(${stagger ? rowOffset : 0}px)`;
      const frame = canvas.closest<HTMLElement>('[data-wcl-chart-frame]');
      if (frame)
        frame.style.paddingBottom = `${stagger ? rowOffset * (labels[0].getScreenCTM()?.d ?? 1) : 0}px`;
      // Selection underlines follow the same rows as their month labels.
      canvas
        .querySelectorAll<SVGLineElement>('[data-wcl-chart-selected-category]')
        .forEach((mark) => {
          const x = (mark.x1.baseVal.value + mark.x2.baseVal.value) / 2;
          const index = labels.findIndex(
            (node) => Math.abs(node.x.baseVal.getItem(0).value - x) < 0.01,
          );
          mark.style.transform = `translateY(${index < 0 ? 0 : offsets[index]}px)`;
        });
    };
    thin();
    const observer = new MutationObserver(thin);
    observer.observe(canvas, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['x', 'y', 'viewBox', 'text-anchor'],
    });
    return () => observer.disconnect();
  }, [canvas, chartWidth, plot.width, view]);
  useLayoutEffect(() => {
    const element = host.current;
    if (!element || !canvas) return;
    const fingers = new Map<number, {x: number; y: number}>();
    let active = false;
    let gesture: {view: Window; x: number; distance: number; width: number; anchor: number} | null =
      null;
    const down = (event: globalThis.PointerEvent) => {
      if (
        event.pointerType !== 'touch' ||
        !(event.target instanceof Element) ||
        !event.target.closest('[data-wcl-chart-svg]')
      )
        return;
      fingers.set(event.pointerId, {x: event.clientX, y: event.clientY});
      if (fingers.size < 2) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!active) {
        // The first finger may already have started a selection or hold. Cancel it before exploring.
        canvas.querySelector('svg')?.dispatchEvent(
          new window.PointerEvent('pointercancel', {
            bubbles: true,
            pointerId: [...fingers.keys()][0],
            pointerType: 'touch',
          }),
        );
        // The production reading layer keeps a one-finger tooltip until an outside press.
        // This isolated adapter dismisses that reading when two-finger exploration takes over.
        document.body.dispatchEvent(
          new window.PointerEvent('pointerdown', {bubbles: true, pointerType: 'touch'}),
        );
        active = true;
        const points = [...fingers.values()];
        const bounds = canvas.getBoundingClientRect();
        const center = (points[0].x + points[1].x) / 2;
        gesture = {
          view: [...viewRef.current],
          x: center,
          distance: Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y),
          width: bounds.width,
          anchor: clamp((center - bounds.left) / bounds.width, 0, 1),
        };
      }
      for (const id of fingers.keys()) element.setPointerCapture(id);
    };
    const move = (event: globalThis.PointerEvent) => {
      if (!fingers.has(event.pointerId)) return;
      fingers.set(event.pointerId, {x: event.clientX, y: event.clientY});
      if (!active) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (fingers.size < 2 || !gesture) return;
      const points = [...fingers.values()],
        g = gesture;
      const center = (points[0].x + points[1].x) / 2;
      const distance = Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
      const original = g.view[1] - g.view[0];
      const size = clamp(Math.round((original * g.distance) / Math.max(15, distance)), 3, 24);
      changeView(
        bounded(
          g.view[0] + g.anchor * (original - size) - ((center - g.x) / g.width) * original,
          size,
        ),
      );
    };
    const finish = (event: globalThis.PointerEvent) => {
      if (!event.isTrusted || !fingers.has(event.pointerId)) return;
      fingers.delete(event.pointerId);
      if (active) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      if (element.hasPointerCapture(event.pointerId))
        element.releasePointerCapture(event.pointerId);
      // Suppress the remaining finger until it lifts so pinch release never selects an item.
      if (!fingers.size) {
        active = false;
        gesture = null;
      }
    };
    element.addEventListener('pointerdown', down, true);
    element.addEventListener('pointermove', move, true);
    element.addEventListener('pointerup', finish, true);
    element.addEventListener('pointercancel', finish, true);
    return () => {
      element.removeEventListener('pointerdown', down, true);
      element.removeEventListener('pointermove', move, true);
      element.removeEventListener('pointerup', finish, true);
      element.removeEventListener('pointercancel', finish, true);
    };
  }, [canvas]);
  const navGesture = useRef<{
    kind: 'start' | 'end' | 'window' | 'new';
    x: number;
    view: Window;
    point: number;
  } | null>(null);
  const navDown = (e: PointerEvent<HTMLDivElement>, kind: 'start' | 'end' | 'window' | 'new') => {
    if (e.button !== 0 || !nav.current) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.focus();
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = nav.current.getBoundingClientRect();
    navGesture.current = {
      kind,
      x: e.clientX,
      view: [...view],
      point: clamp(Math.floor(((e.clientX - rect.left) / rect.width) * 24), 0, 23),
    };
  };
  const navMove = (e: PointerEvent<HTMLDivElement>) => {
    const g = navGesture.current;
    if (!g || !nav.current) return;
    const delta = Math.round(((e.clientX - g.x) / nav.current.clientWidth) * 24);
    if (g.kind === 'window') changeView(bounded(g.view[0] + delta, g.view[1] - g.view[0]));
    else if (g.kind === 'start')
      changeView([clamp(g.view[0] + delta, 0, g.view[1] - 3), g.view[1]]);
    else if (g.kind === 'end') changeView([g.view[0], clamp(g.view[1] + delta, g.view[0] + 3, 24)]);
    else {
      const end = clamp(g.point + delta, 0, 23);
      changeView(bounded(Math.min(g.point, end), Math.max(3, Math.abs(end - g.point) + 1)));
    }
  };
  const navUp = (e: PointerEvent<HTMLDivElement>) => {
    const g = navGesture.current;
    if (g?.kind === 'new' && Math.abs(e.clientX - g.x) < 5)
      changeView(bounded(g.point - (g.view[1] - g.view[0]) / 2, g.view[1] - g.view[0]));
    navGesture.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const navKeys = (e: KeyboardEvent, kind: 'start' | 'end' | 'window') => {
    if (e.key === 'Escape') {
      if (navGesture.current) changeView(navGesture.current.view);
      navGesture.current = null;
      return;
    }
    const step = e.shiftKey ? 3 : 1;
    const delta = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
    if (!delta) return;
    e.preventDefault();
    if (kind === 'window') shift(delta);
    else if (kind === 'start') changeView([clamp(view[0] + delta, 0, view[1] - 3), view[1]]);
    else changeView([view[0], clamp(view[1] + delta, view[0] + 3, 24)]);
  };
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
        <header>
          <p className="kicker">Interaction study</p>
          <h1>Explore a chart</h1>
          <p>Look closer at a few months, move through the year, and return to the full picture.</p>
        </header>
        <div className="study-controls">
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
            <LineChart
              data={visibleData}
              series={series}
              title="Revenue and operating costs"
              description="Monthly totals in thousands of dollars."
              dataTableLabel="Visible monthly values"
              aspectRatio={3}
              minimumSize={{width: 280, height: 210}}
              xAxis={{
                accessor: 'date',
                label: 'Month',
                scale: {
                  type: 'time',
                  domain: [visibleData[0].date, visibleData[visibleData.length - 1].date],
                },
                tickCount: count,
                formatTick: (date) =>
                  `${names[date.getUTCMonth()]}${allData[view[0]].date.getUTCFullYear() === allData[view[1] - 1].date.getUTCFullYear() ? '' : ` ${String(date.getUTCFullYear()).slice(-2)}`}`,
              }}
              yAxis={{label: 'Amount', unit: '$k', scale: {type: 'linear'}}}
              legend={{label: 'Financial series'}}
              emptyState={{title: 'No months', description: 'Reset the view.'}}
              invalidData={{title: 'Invalid values', description: 'Check the readings.'}}
              interaction={{
                target: 'category',
                getRowId: (d) => d.id,
                onActivate: (a) =>
                  setDetails(
                    `${a.datum.month}: revenue $${a.datum.revenue}k; costs $${a.datum.costs}k.`,
                  ),
                selection: {
                  selectedItems: selected,
                  onSelectionChange: (next) =>
                    setSelected((previous) => [...previous.filter(outside), ...next]),
                  labels: {
                    instructions:
                      'Click to select months. Drag to select a range. Control/Command-click or touch hold opens details.',
                    clear: 'Clear selection',
                    empty: 'Nothing selected',
                    summary: (n) => `${n} months selected`,
                    item: (item) => allData[+item.rowId].month,
                    hidden: (s) => `${s} (hidden)`,
                  },
                },
              }}
            />
            {canvas && host.current
              ? createPortal(
                  <>
                    <div className="chart-controls" data-study-name="Chart zoom controls">
                      <span className="period">{label(view)}</span>
                      <div className="zoom-buttons">
                        <button
                          type="button"
                          aria-label="Zoom out"
                          title="Zoom out"
                          disabled={count === 24}
                          onClick={() => zoom(2)}
                        >
                          −
                        </button>
                        <button
                          type="button"
                          aria-label="Zoom in"
                          title="Zoom in"
                          disabled={count === 3}
                          onClick={() => zoom(0.5)}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          aria-label="Reset view"
                          title="Reset view"
                          disabled={count === 24}
                          onClick={() => changeView([0, 24])}
                        >
                          ↺
                        </button>
                      </div>
                    </div>
                    <button
                      className="pan-arrow earlier"
                      type="button"
                      aria-label="Earlier months"
                      title="Earlier months"
                      disabled={view[0] === 0}
                      onClick={() => shift(-Math.max(1, Math.floor(count / 2)))}
                    >
                      ←
                    </button>
                    <button
                      className="pan-arrow later"
                      type="button"
                      aria-label="Later months"
                      title="Later months"
                      disabled={view[1] === 24}
                      onClick={() => shift(Math.max(1, Math.floor(count / 2)))}
                    >
                      →
                    </button>
                  </>,
                  host.current,
                )
              : null}
          </div>
          <div className="overview-disclosure" data-study-name="Overview disclosure">
            <Disclosure
              headingLevel={3}
              title="Overview"
              isExpanded={overviewOpen}
              onExpandedChange={setOverviewOpen}
            >
              <div className="overview" data-study-name="Overview strip">
                <div className="overview-heading">
                  <span>All 24 months</span>
                  <span>Drag the window or its edges</span>
                </div>
                <div
                  className="navigator"
                  ref={nav}
                  onPointerDown={(e) => navDown(e, 'new')}
                  onPointerMove={navMove}
                  onPointerUp={navUp}
                  onPointerCancel={() => {
                    if (navGesture.current) changeView(navGesture.current.view);
                    navGesture.current = null;
                  }}
                >
                  <svg viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden="true">
                    <path d={smallPath('revenue')} className="mini-revenue" />
                    <path d={smallPath('costs')} className="mini-costs" />
                    {selected.map((item) => (
                      <line
                        key={item.rowId}
                        x1={((+item.rowId + 0.5) / 24) * 1000 - 8}
                        x2={((+item.rowId + 0.5) / 24) * 1000 + 8}
                        y1="77"
                        y2="77"
                        className="mini-selected"
                      />
                    ))}
                  </svg>
                  <div className="shade" style={{left: 0, width: `${(view[0] / 24) * 100}%`}} />
                  <div className="shade" style={{left: `${(view[1] / 24) * 100}%`, right: 0}} />
                  <div
                    className="nav-window"
                    role="slider"
                    aria-label="Visible time window"
                    aria-valuemin={0}
                    aria-valuemax={24 - count}
                    aria-valuenow={view[0]}
                    aria-valuetext={label(view)}
                    tabIndex={0}
                    style={{left: `${(view[0] / 24) * 100}%`, width: `${(count / 24) * 100}%`}}
                    onPointerDown={(e) => navDown(e, 'window')}
                    onKeyDown={(e) => navKeys(e, 'window')}
                  >
                    <span className="window-grip" />
                  </div>
                  <div
                    className="nav-handle start"
                    role="slider"
                    aria-label="First visible month"
                    aria-valuemin={0}
                    aria-valuemax={view[1] - 3}
                    aria-valuenow={view[0]}
                    aria-valuetext={allData[view[0]].month}
                    tabIndex={0}
                    style={{left: `${(view[0] / 24) * 100}%`}}
                    onPointerDown={(e) => navDown(e, 'start')}
                    onKeyDown={(e) => navKeys(e, 'start')}
                  />
                  <div
                    className="nav-handle end"
                    role="slider"
                    aria-label="Last visible month"
                    aria-valuemin={view[0] + 2}
                    aria-valuemax={23}
                    aria-valuenow={view[1] - 1}
                    aria-valuetext={allData[view[1] - 1].month}
                    tabIndex={0}
                    style={{left: `${(view[1] / 24) * 100}%`}}
                    onPointerDown={(e) => navDown(e, 'end')}
                    onKeyDown={(e) => navKeys(e, 'end')}
                  />
                </div>
                <div className="overview-dates">
                  <span>Jan 2025</span>
                  <span>Dec 2026</span>
                </div>
                <p className="hint">
                  Drag outside the window to choose a new range. Arrow keys adjust a focused edge or
                  move the window.
                </p>
              </div>
            </Disclosure>
          </div>
          <p className="hint" id="gesture-help">
            One finger selects; two fingers move or pinch to zoom. On desktop, drag to select and
            use the arrows or overview to move. Control/Command-click or press and hold opens
            details.
          </p>
          <div className="selection" data-study-name="Selection and details">
            <p aria-live="polite">
              {selected.length
                ? `${selected.length} selected: ${selected.map((item) => `${allData[+item.rowId].month}${outside(item) ? ' (outside view)' : ''}`).join(', ')}`
                : 'Nothing selected'}
            </p>
            <Button variant="quiet" isDisabled={!selected.length} onPress={() => setSelected([])}>
              Clear selection
            </Button>
            {details ? <p role="status">Opened {details}</p> : null}
          </div>
        </section>
        <p className="hint">
          Zoom changes the visible months. The vertical scale fits their values. Selection stays
          with its months when you move away or reset.
        </p>
        <details>
          <summary>Full monthly values</summary>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Revenue</th>
                  <th>Operating costs</th>
                </tr>
              </thead>
              <tbody>
                {allData.map((d) => (
                  <tr key={d.id}>
                    <th>{d.month}</th>
                    <td>${d.revenue}k</td>
                    <td>${d.costs}k</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
        {identify ? (
          <output className="identifier">{identified || 'Point at or focus an element.'}</output>
        ) : null}
      </main>
    </AppearanceProvider>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
