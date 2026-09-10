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
  AreaChart,
  ColumnChart,
  CartesianChart,
  RadioGroup,
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
  {id: 'revenue', label: 'Subscriptions', accessor: 'revenue', color: 'accent', showPoints: true},
  {id: 'costs', label: 'Services', accessor: 'costs', color: 'series-2', showPoints: true},
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

const chartOptions = [
  {value: 'area', label: 'Area'},
  {value: 'columns', label: 'Grouped columns'},
  {value: 'stacked', label: 'Stacked columns'},
  {value: 'mixed', label: 'Columns + line'},
  {value: 'line', label: 'Line reference'},
] as const;
type ChartKind = (typeof chartOptions)[number]['value'];

function App() {
  const [kind, setKind] = useState<ChartKind>('area');
  const hasColumns = kind === 'columns' || kind === 'stacked' || kind === 'mixed';
  const Chart =
    kind === 'area'
      ? AreaChart
      : hasColumns && kind !== 'mixed'
        ? ColumnChart
        : kind === 'mixed'
          ? CartesianChart
          : LineChart;
  const plottedSeries = useMemo(
    () =>
      kind === 'mixed'
        ? ([
            {...series[0], kind: 'column' as const},
            {...series[1], kind: 'line' as const},
          ] as const)
        : series,
    [kind],
  );
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
    // Prototype-only axis labels: exact month positions, two rows before thinning.
    // Production owns the marks, hit targets and interactions. The proposed zoom viewport
    // must fit the full chosen range rather than introduce a second scrolling viewport.
    const fit = () => {
      const svg = canvas.querySelector<SVGSVGElement>('svg');
      const rail = canvas.querySelector<SVGLineElement>(
        '[data-axis="x"] [data-wcl-chart-axis-rail]',
      );
      const axis = canvas.querySelector<SVGGElement>('[data-axis="x"]');
      if (!svg || !rail || !axis) return;
      const scale = svg.getScreenCTM()?.a ?? 1;
      const font = 14 / scale;
      const left = rail.x1.baseVal.value,
        right = rail.x2.baseVal.value;
      const bottom = rail.y1.baseVal.value;
      const pad = hasColumns ? 15 * 86400000 : 0;
      const first = +visibleData[0].date - pad;
      const last = +visibleData[visibleData.length - 1].date + pad;
      const withYear =
        visibleData[0].date.getUTCFullYear() !==
        visibleData[visibleData.length - 1].date.getUTCFullYear();
      const labels = visibleData.map((d) => ({
        datum: d,
        x: left + ((+d.date - first) / (last - first)) * (right - left),
        text: withYear ? d.month : names[d.date.getUTCMonth()],
      }));
      const fits = (indices: number[], rows: number) =>
        indices.every((index, order) => {
          if (order < rows) return true;
          const a = labels[indices[order - rows]],
            b = labels[index];
          return (b.x - a.x) * scale >= (a.text.length + b.text.length) * 14 * 0.31 + 8;
        });
      const all = labels.map((_, i) => i);
      const stagger = !fits(all, 1);
      let shown = all;
      if (stagger && !fits(all, 2)) {
        for (let n = all.length - 1; n >= 2; n--) {
          const candidate = Array.from({length: n}, (_, i) =>
            Math.round((i * (all.length - 1)) / (n - 1)),
          );
          if (fits(candidate, 2)) {
            shown = candidate;
            break;
          }
        }
      }
      const ns = 'http://www.w3.org/2000/svg';
      const group = document.createElementNS(ns, 'g');
      group.dataset.studyAxis = '';
      const rowFor = (index: number) => {
        const order = shown.indexOf(index);
        return stagger ? (order < 0 ? index % 2 : order % 2) : 0;
      };
      shown.forEach((index) => {
        const item = labels[index];
        const text = document.createElementNS(ns, 'text');
        text.textContent = item.text;
        text.setAttribute('x', String(item.x));
        text.setAttribute('y', String(bottom + font * (1.125 + rowFor(index) * 1.5)));
        text.setAttribute(
          'text-anchor',
          index === 0 ? 'start' : index === labels.length - 1 ? 'end' : 'middle',
        );
        text.style.fontSize = `${font}px`;
        text.dataset.studyMonth = item.datum.id;
        group.append(text);
        const tick = document.createElementNS(ns, 'line');
        Object.entries({x1: item.x, x2: item.x, y1: bottom, y2: bottom + 4 / scale}).forEach(
          ([key, value]) => tick.setAttribute(key, String(value)),
        );
        group.append(tick);
      });
      // Reposition production's live marks instead of mirroring committed selection.
      // The production overlay already replaces previous selection with the drag preview.
      canvas
        .querySelectorAll<SVGLineElement>('[data-wcl-chart-selected-category]')
        .forEach((mark) => {
          const x = (mark.x1.baseVal.value + mark.x2.baseVal.value) / 2;
          const index = labels.findIndex((label) => Math.abs(label.x - x) < 0.1);
          if (index < 0) return;
          const y = bottom + font * (1.125 + rowFor(index) * 1.5) + 5 / scale;
          mark.style.transform = `translateY(${y - mark.y1.baseVal.value}px)`;
        });
      axis.querySelector('[data-study-axis]')?.remove();
      axis.append(group);
      const title = axis.querySelector<SVGTextElement>('[data-wcl-chart-axis-label]');
      if (title) title.style.transform = `translateY(${stagger ? font * 1.5 : 0}px)`;
      const frame = canvas.closest<HTMLElement>('[data-wcl-chart-frame]');
      if (frame) frame.style.paddingBottom = `${stagger ? 21 : 0}px`;
    };
    fit();
    // Only geometry mutations; observing our own inserted labels would loop.
    const observer = new MutationObserver(fit);
    observer.observe(canvas, {
      subtree: true,
      attributes: true,
      attributeFilter: ['viewBox', 'x1', 'x2', 'y1', 'y2'],
    });
    const overlay = canvas.querySelector('[data-wcl-chart-interaction-overlay]');
    if (overlay)
      observer.observe(overlay, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['x1', 'x2', 'y1', 'y2'],
      });
    return () => observer.disconnect();
  }, [canvas, chartWidth, view, kind, selected, plot.width]);
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
          <h1>Explore different charts</h1>
          <p>
            Switch chart types to compare the same months. Your zoom window and selection stay with
            you.
          </p>
        </header>
        <div className="study-controls">
          <div className="chart-choices" data-study-name="Chart type choices">
            <RadioGroup
              label="Chart type"
              name="chart-type"
              value={kind}
              onChange={setKind}
              options={chartOptions}
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
              {...(kind === 'stacked' ? {layout: 'stacked' as const} : {})}
              data={visibleData}
              series={plottedSeries}
              title="Monthly revenue"
              description="Subscriptions and services, in thousands of dollars."
              dataTableLabel="Visible monthly values"
              aspectRatio={16 / 9}
              minimumSize={{width: 280, height: 210}}
              xAxis={{
                accessor: 'date',
                label: 'Month',
                scale: {
                  type: 'time',
                  domain: [
                    new Date(+visibleData[0].date - (hasColumns ? 15 * 86400000 : 0)),
                    new Date(
                      +visibleData[visibleData.length - 1].date + (hasColumns ? 15 * 86400000 : 0),
                    ),
                  ],
                },
                // Exact monthly labels are drawn by the isolated viewport adapter above.
                tickCount: 2,
                formatTick: (date) =>
                  `${names[date.getUTCMonth()]} ${String(date.getUTCFullYear()).slice(-2)}`,
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
                    `${a.datum.month}: subscriptions $${a.datum.revenue}k; services $${a.datum.costs}k.`,
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
                    {hasColumns
                      ? allData.map((d, i) => {
                          const stacked = kind === 'stacked';
                          const denominator = stacked ? 360 : 220;
                          const h1 = (d.revenue / denominator) * 58,
                            h2 = (d.costs / denominator) * 58;
                          const x = ((i + 0.5) / 24) * 1000;
                          return (
                            <g key={d.id}>
                              <rect
                                className="mini-column revenue"
                                x={x - (kind === 'columns' ? 15 : 12)}
                                y={70 - h1}
                                width={kind === 'columns' ? 14 : 24}
                                height={h1}
                              />
                              {kind !== 'mixed' ? (
                                <rect
                                  className="mini-column costs"
                                  x={stacked ? x - 12 : x + 1}
                                  y={70 - h2 - (stacked ? h1 : 0)}
                                  width={stacked ? 24 : 14}
                                  height={h2}
                                />
                              ) : null}
                            </g>
                          );
                        })
                      : null}
                    {kind === 'area' ? (
                      <>
                        <path
                          d={`${smallPath('revenue')} L${(23.5 / 24) * 1000},70 L${(0.5 / 24) * 1000},70 Z`}
                          className="mini-area revenue"
                        />
                        <path
                          d={`${smallPath('costs')} L${(23.5 / 24) * 1000},70 L${(0.5 / 24) * 1000},70 Z`}
                          className="mini-area costs"
                        />
                      </>
                    ) : null}
                    {kind === 'line' || kind === 'area' ? (
                      <path d={smallPath('revenue')} className="mini-revenue" />
                    ) : null}
                    {kind === 'line' || kind === 'area' || kind === 'mixed' ? (
                      <path d={smallPath('costs')} className="mini-costs" />
                    ) : null}
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
                  <th>Subscriptions</th>
                  <th>Services</th>
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
