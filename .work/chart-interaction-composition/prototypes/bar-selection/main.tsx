// Disposable prototype adapter. Production chart APIs are unchanged.
import {useLayoutEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {createPortal} from 'react-dom';
import {
  AppearanceProvider,
  BarChart,
  ColumnChart,
  SegmentedControl,
  ToggleButton,
  Button,
  type Appearance,
} from '../../../../src/index.js';
import '../../../../src/styles.css';
import './styles.css';

const data = [
  {month: 'Jan', revenue: 820, costs: 440},
  {month: 'Feb', revenue: 890, costs: 510},
  {month: 'Mar', revenue: 960, costs: 490},
  {month: 'Apr', revenue: 900, costs: 620},
  {month: 'May', revenue: 1100, costs: 580},
  {month: 'Jun', revenue: 1200, costs: 700},
];
const series = [
  {id: 'revenue', accessor: 'revenue', label: 'Revenue'},
  {id: 'costs', accessor: 'costs', label: 'Operating costs'},
] as const;
type Item = {index: number; seriesId?: string};
type Box = {x: number; y: number; width: number; height: number};
type Mark = Box & {index: number; seriesId: string};
const key = (p: Item) => `${p.index}:${p.seriesId ?? '*'}`;
const name = (p: Item) =>
  `${data[p.index].month}${p.seriesId ? ` · ${series.find((s) => s.id === p.seriesId)?.label}` : ''}`;
const values = (p: Item) =>
  series
    .filter((s) => !p.seriesId || p.seriesId === s.id)
    .map((s) => `${s.label}: $${data[p.index][s.accessor]}`)
    .join(' · ');
const intersect = (a: Box, b: Box) =>
  a.x <= b.x + b.width && a.x + a.width >= b.x && a.y <= b.y + b.height && a.y + a.height >= b.y;
const union = (items: Item[]) => [...new Map(items.map((p) => [key(p), p])).values()];

// Trace the silhouette of touching rectangles, then inset its corners.
// This keeps month readings continuous across grouped bars and stacked segments.
function contour(rects: Box[], inset: number) {
  const rounded = (v: number) => Math.round(v * 1e6) / 1e6;
  const xs = [...new Set(rects.flatMap((r) => [rounded(r.x), rounded(r.x + r.width)]))].sort(
    (a, b) => a - b,
  );
  const ys = [...new Set(rects.flatMap((r) => [rounded(r.y), rounded(r.y + r.height)]))].sort(
    (a, b) => a - b,
  );
  const occupied = (x: number, y: number) =>
    x >= 0 &&
    y >= 0 &&
    x < xs.length - 1 &&
    y < ys.length - 1 &&
    rects.some(
      (r) =>
        (xs[x] + xs[x + 1]) / 2 > r.x &&
        (xs[x] + xs[x + 1]) / 2 < r.x + r.width &&
        (ys[y] + ys[y + 1]) / 2 > r.y &&
        (ys[y] + ys[y + 1]) / 2 < r.y + r.height,
    );
  type P = {x: number; y: number};
  const edges = new Map<string, P>();
  const id = (p: P) => `${p.x},${p.y}`;
  const edge = (x: number, y: number, a: number, b: number) => edges.set(`${x},${y}`, {x: a, y: b});
  for (let x = 0; x < xs.length - 1; x++)
    for (let y = 0; y < ys.length - 1; y++) {
      if (!occupied(x, y)) continue;
      const l = xs[x],
        r = xs[x + 1],
        t = ys[y],
        b = ys[y + 1];
      if (!occupied(x, y - 1)) edge(l, t, r, t);
      if (!occupied(x + 1, y)) edge(r, t, r, b);
      if (!occupied(x, y + 1)) edge(r, b, l, b);
      if (!occupied(x - 1, y)) edge(l, b, l, t);
    }
  const paths: string[] = [];
  while (edges.size) {
    const start = edges.keys().next().value!;
    const [x, y] = start.split(',').map(Number);
    const points: P[] = [];
    let p = {x, y};
    do {
      points.push(p);
      const next = edges.get(id(p));
      edges.delete(id(p));
      if (!next) break;
      p = next;
    } while (id(p) !== start);
    const corners = points.filter((p, i) => {
      const a = points[(i + points.length - 1) % points.length],
        b = points[(i + 1) % points.length];
      return !((a.x === p.x && p.x === b.x) || (a.y === p.y && p.y === b.y));
    });
    const inner = corners.map((p, i) => {
      const a = corners[(i + corners.length - 1) % corners.length],
        b = corners[(i + 1) % corners.length];
      return {
        x: p.x - inset * (Math.sign(p.y - a.y) + Math.sign(b.y - p.y)),
        y: p.y + inset * (Math.sign(p.x - a.x) + Math.sign(b.x - p.x)),
      };
    });
    if (inner.length)
      paths.push(inner.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ') + ' Z');
  }
  return paths.join(' ');
}

function Prototype() {
  const [appearance, setAppearance] = useState<Appearance>('dark');
  const [horizontal, setHorizontal] = useState(false);
  const [layout, setLayout] = useState<'grouped' | 'stacked'>('grouped');
  const [unit, setUnit] = useState<'month' | 'bar'>('bar');
  const [style, setStyle] = useState<'frame' | 'cap'>('frame');
  const [selectionEnabled, setSelectionEnabled] = useState(true);
  const [compact, setCompact] = useState(false);
  const [identify, setIdentify] = useState(false);
  const [identified, setIdentified] = useState('');
  const [selected, setSelected] = useState<Item[]>([]);
  const [reading, setReading] = useState<Item | null>(null);
  const [opened, setOpened] = useState<Item | null>(null);
  const [pulse, setPulse] = useState<{item: Item; id: number} | null>(null);
  const [box, setBox] = useState<Box | null>(null);
  const host = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<{
    svg: SVGSVGElement;
    plot: Box;
    marks: Mark[];
    labels: Record<string, Box>;
  } | null>(null);
  const drag = useRef<{
    id: number;
    x: number;
    y: number;
    before: Item[];
    moved: boolean;
    held: boolean;
    add: boolean;
    remove: boolean;
    target: Item;
  } | null>(null);
  const hold = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const serial = useRef(0);
  const keyboard = useRef(false);
  const clearHold = () => {
    if (hold.current) clearTimeout(hold.current);
    hold.current = null;
  };
  const cancel = () => {
    clearHold();
    if (drag.current) setSelected(drag.current.before);
    drag.current = null;
    setBox(null);
  };
  useLayoutEffect(() => {
    const root = host.current!;
    let frame = 0;
    const read = () => {
      const svg = root.querySelector<SVGSVGElement>('[data-wcl-chart-svg]');
      const plot = svg?.querySelector<SVGRectElement>('[data-wcl-chart-hit-region]');
      if (!svg || !plot) return;
      const rect = (el: SVGGraphicsElement) => {
        const b = el.getBBox();
        return {x: b.x, y: b.y, width: b.width, height: b.height};
      };
      const marks = [...svg.querySelectorAll<SVGRectElement>('[data-wcl-chart-bar]')].map((el) => ({
        ...rect(el),
        index: Number(el.dataset.rowIndex),
        seriesId: el.dataset.series!,
      }));
      const labels: Record<string, Box> = {};
      svg.querySelectorAll<SVGTextElement>('[data-wcl-chart-tick-label]').forEach((el) => {
        if (data.some((d) => d.month === el.textContent)) labels[el.textContent!] = rect(el);
      });
      root.querySelectorAll<HTMLElement>('[data-wcl-chart-canvas]').forEach((el) => {
        if (el.tabIndex !== -1) el.tabIndex = -1;
      });
      setScene((old) =>
        old?.svg === svg &&
        JSON.stringify([old.plot, old.marks, old.labels]) ===
          JSON.stringify([rect(plot), marks, labels])
          ? old
          : {svg, plot: rect(plot), marks, labels},
      );
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    };
    const observer = new MutationObserver(schedule);
    observer.observe(root, {subtree: true, childList: true, attributes: true});
    const resize = new ResizeObserver(schedule);
    resize.observe(root);
    read();
    return () => {
      observer.disconnect();
      resize.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [horizontal, layout, compact]);
  useLayoutEffect(
    () => () => {
      clearHold();
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
    },
    [],
  );
  const reset = () => {
    cancel();
    setSelected([]);
    setReading(null);
    setOpened(null);
    setPulse(null);
  };
  const point = (e: {clientX: number; clientY: number}) => {
    const matrix = scene!.svg.getScreenCTM()!.inverse();
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(matrix);
    return {x: p.x, y: p.y};
  };
  const targetAt = (x: number, y: number): Item | null => {
    if (!scene?.marks.length) return null;
    const {plot, marks} = scene;
    if (x < plot.x || x > plot.x + plot.width || y < plot.y || y > plot.y + plot.height)
      return null;
    const categories = [...new Set(marks.map((m) => m.index))].map((index) => {
      const group = marks.filter((m) => m.index === index);
      const lo = Math.min(...group.map((m) => (horizontal ? m.y : m.x)));
      const hi = Math.max(...group.map((m) => (horizontal ? m.y + m.height : m.x + m.width)));
      return {index, center: (lo + hi) / 2};
    });
    const pos = horizontal ? y : x;
    const category = categories.reduce((a, b) =>
      Math.abs(a.center - pos) <= Math.abs(b.center - pos) ? a : b,
    );
    if (unit === 'month') return {index: category.index};
    const distance = (m: Mark) =>
      Math.hypot(Math.max(m.x - x, 0, x - m.x - m.width), Math.max(m.y - y, 0, y - m.y - m.height));
    const mark = marks
      .filter((m) => m.index === category.index)
      .reduce((a, b) => (distance(a) <= distance(b) ? a : b));
    return {index: mark.index, seriesId: mark.seriesId};
  };
  const activate = (item: Item, only = false) => {
    if (selectionEnabled && !only) {
      setSelected((old) =>
        old.some((p) => key(p) === key(item))
          ? old.filter((p) => key(p) !== key(item))
          : [...old, item],
      );
      return;
    }
    setOpened(item);
    setPulse({item, id: ++serial.current});
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    pulseTimer.current = setTimeout(() => setPulse(null), 650);
  };
  const isPlot = (e: {target: EventTarget | null}) =>
    !!(e.target as Element)?.closest('[data-wcl-chart-svg]');
  const drawn = (item: Item) =>
    scene?.marks.filter(
      (m) => m.index === item.index && (!item.seriesId || item.seriesId === m.seriesId),
    ) ?? [];
  const scale = scene
    ? scene.svg.viewBox.baseVal.width / scene.svg.getBoundingClientRect().width
    : 1;
  const outline = (m: Mark, kind: string, id: string) => {
    if (kind === 'selected' && style === 'cap')
      return (
        <line
          key={id}
          data-cue="selected-cap"
          x1={horizontal ? m.x + m.width : m.x}
          x2={m.x + m.width}
          y1={m.y}
          y2={horizontal ? m.y + m.height : m.y}
        />
      );
    const inset = kind === 'reading' ? 3 * scale : -2 * scale;
    const neighbors = scene?.marks.filter((n) => n !== m) ?? [];
    const near = (a: number, b: number) => Math.abs(a - b) < 0.001;
    const shared = (side: 'left' | 'right' | 'top' | 'bottom') =>
      neighbors.some((n) =>
        side === 'left' || side === 'right'
          ? Math.min(m.y + m.height, n.y + n.height) > Math.max(m.y, n.y) &&
            near(side === 'left' ? m.x : m.x + m.width, side === 'left' ? n.x + n.width : n.x)
          : Math.min(m.x + m.width, n.x + n.width) > Math.max(m.x, n.x) &&
            near(side === 'top' ? m.y : m.y + m.height, side === 'top' ? n.y + n.height : n.y),
      );
    // Shared edges meet on the same border rather than extending into the next bar.
    const offset = (side: 'left' | 'right' | 'top' | 'bottom') =>
      kind !== 'reading' && shared(side) ? 0 : inset;
    const left = offset('left'),
      right = offset('right'),
      top = offset('top'),
      bottom = offset('bottom');
    return (
      <rect
        key={id}
        data-cue={kind}
        x={m.x + left}
        y={m.y + top}
        width={Math.max(0, m.width - left - right)}
        height={Math.max(0, m.height - top - bottom)}
      />
    );
  };
  const readingOutline = (item: Item, kind: string) =>
    item.seriesId ? (
      drawn(item).map((m) => outline(m, kind, `${kind}-${key(m)}`))
    ) : (
      <path data-cue={kind} d={contour(drawn(item), (kind === 'reading' ? 3 : -2) * scale)} />
    );
  const visibilityLabels = {
    hideSeries: (s: string) => `Hide ${s}`,
    showSeries: (s: string) => `Show ${s}`,
    hidden: 'Hidden',
    allHidden: {title: 'All series hidden', description: 'Restore a series to continue.'},
    showAll: 'Show all',
  };
  const common = {
    data,
    series,
    title: 'Revenue and operating costs',
    description: 'Monthly totals in dollars.',
    dataTableLabel: 'Monthly finances',
    emptyState: {title: 'No records', description: 'Add records.'},
    invalidData: {title: 'Invalid records', description: 'Check records.'},
    legend: {label: 'Financial series'},
    visibilityLabels,
    layout,
  };
  const inspect = (e: {target: EventTarget | null}) => {
    if (identify)
      setIdentified(
        (e.target as Element)?.closest('[data-name]')?.getAttribute('data-name') ?? 'Chart',
      );
  };
  return (
    <AppearanceProvider appearance={appearance} accent="#2878ff">
      <main className="study" onPointerOver={inspect} onFocus={inspect}>
        <header>
          <p className="kicker">Interaction study</p>
          <h1>Selecting bars</h1>
          <p>Compare an outline around the whole bar with a mark at its value end.</p>
        </header>
        <section className="controls" aria-label="Example settings">
          <div data-name="Selection style">
            <SegmentedControl
              label="Selected bar"
              value={style}
              onChange={setStyle}
              options={[
                {label: 'Frame', value: 'frame'},
                {label: 'End cap', value: 'cap'},
              ]}
            />
          </div>
          <div data-name="Chart orientation">
            <SegmentedControl
              label="Chart"
              value={horizontal ? 'horizontal' : 'columns'}
              onChange={(v) => {
                reset();
                setHorizontal(v === 'horizontal');
              }}
              options={[
                {label: 'Columns', value: 'columns'},
                {label: 'Horizontal bars', value: 'horizontal'},
              ]}
            />
          </div>
          <div data-name="Bar arrangement">
            <SegmentedControl
              label="Arrangement"
              value={layout}
              onChange={(v) => {
                reset();
                setLayout(v);
              }}
              options={[
                {label: 'Grouped', value: 'grouped'},
                {label: 'Stacked', value: 'stacked'},
              ]}
            />
          </div>
          <div data-name="Click target">
            <SegmentedControl
              label="Click target"
              value={unit}
              onChange={(v) => {
                reset();
                setUnit(v);
              }}
              options={[
                {label: 'Bar', value: 'bar'},
                {label: 'Month', value: 'month'},
              ]}
            />
          </div>
          <div data-name="Appearance">
            <SegmentedControl
              label="Appearance"
              value={appearance}
              onChange={setAppearance}
              options={[
                {label: 'Dark', value: 'dark'},
                {label: 'Light', value: 'light'},
              ]}
            />
          </div>
          <ToggleButton
            isSelected={selectionEnabled}
            onChange={(v) => {
              reset();
              setSelectionEnabled(v);
            }}
          >
            Selection
          </ToggleButton>
          <ToggleButton isSelected={compact} onChange={setCompact}>
            Compact
          </ToggleButton>
          <ToggleButton isSelected={identify} onChange={setIdentify}>
            Identify elements
          </ToggleButton>
        </section>
        <section className="example" data-compact={compact || undefined}>
          <p className="instructions">
            {selectionEnabled
              ? 'Click or tap to select. Control/Command-click or press and hold to open details. Drag to select several; Shift adds, Alt removes, Escape cancels.'
              : 'Click or tap to open details.'}
          </p>
          <div
            ref={host}
            className="chart-adapter"
            tabIndex={0}
            role="group"
            aria-label="Financial chart interaction"
            data-name="Chart interaction"
            onFocusCapture={(e) => {
              if (e.target === e.currentTarget && e.currentTarget.matches(':focus-visible')) {
                const first = scene?.marks[0];
                if (first)
                  setReading({
                    index: first.index,
                    seriesId: unit === 'bar' ? first.seriesId : undefined,
                  });
              }
            }}
            onPointerDownCapture={(e) => {
              if (!isPlot(e) || !scene || e.button !== 0) return;
              keyboard.current = false;
              e.stopPropagation();
              e.preventDefault();
              e.currentTarget.focus();
              const {x, y} = point(e);
              const target = targetAt(x, y);
              if (!target) return;
              setReading(target);
              e.currentTarget.setPointerCapture(e.pointerId);
              drag.current = {
                id: e.pointerId,
                x,
                y,
                before: selected,
                moved: false,
                held: false,
                add: e.shiftKey || e.ctrlKey || e.metaKey,
                remove: e.altKey,
                target,
              };
              if (e.pointerType === 'touch' && selectionEnabled)
                hold.current = setTimeout(() => {
                  if (drag.current && !drag.current.moved) {
                    drag.current.held = true;
                    activate(target, true);
                  }
                }, 500);
            }}
            onPointerMoveCapture={(e) => {
              if (!scene || (!isPlot(e) && !drag.current)) return;
              e.stopPropagation();
              const {x, y} = point(e);
              const target = targetAt(x, y);
              setReading(target);
              const d = drag.current;
              if (!d || d.held) return;
              if (!d.moved && Math.hypot(x - d.x, y - d.y) < 5 * scale) return;
              d.moved = true;
              clearHold();
              if (!selectionEnabled) return;
              let rect = {
                x: Math.min(d.x, x),
                y: Math.min(d.y, y),
                width: Math.abs(d.x - x),
                height: Math.abs(d.y - y),
              };
              let chosen: Item[];
              if (unit === 'month') {
                const end = target ?? d.target;
                const a = Math.min(end.index, d.target.index),
                  b = Math.max(end.index, d.target.index);
                chosen = union(
                  scene.marks
                    .filter((m) => m.index >= a && m.index <= b)
                    .map((m) => ({index: m.index})),
                );
                rect = horizontal
                  ? {...rect, x: scene.plot.x, width: scene.plot.width}
                  : {...rect, y: scene.plot.y, height: scene.plot.height};
              } else
                chosen = scene.marks
                  .filter((m) => intersect(rect, m))
                  .map((m) => ({index: m.index, seriesId: m.seriesId}));
              setBox(rect);
              setSelected(
                d.remove
                  ? d.before.filter((p) => !chosen.some((c) => key(c) === key(p)))
                  : d.add
                    ? union([...d.before, ...chosen])
                    : chosen,
              );
            }}
            onPointerUpCapture={(e) => {
              if (!drag.current) return;
              e.stopPropagation();
              clearHold();
              const d = drag.current;
              if (!d.moved && !d.held) {
                const p = point(e);
                const target = targetAt(p.x, p.y);
                if (target) activate(target, e.ctrlKey || e.metaKey);
              }
              drag.current = null;
              setBox(null);
              e.currentTarget.releasePointerCapture(e.pointerId);
            }}
            onLostPointerCapture={() => {
              if (drag.current) cancel();
            }}
            onPointerCancel={cancel}
            onPointerLeave={() => {
              if (!drag.current) setReading(null);
            }}
            onClickCapture={(e) => {
              if (isPlot(e)) e.stopPropagation();
            }}
            onContextMenu={(e) => {
              if (isPlot(e)) e.preventDefault();
            }}
            onKeyDownCapture={(e) => {
              if (e.target !== e.currentTarget) return;
              keyboard.current = true;
              if (e.key === 'Escape') {
                cancel();
                setReading(null);
                return;
              }
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (reading) activate(reading, e.ctrlKey || e.metaKey);
                return;
              }
              if (
                !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)
              )
                return;
              e.preventDefault();
              const p = reading ?? {index: 0, seriesId: unit === 'bar' ? 'revenue' : undefined};
              const categoryKeys = horizontal
                ? ['ArrowUp', 'ArrowDown']
                : ['ArrowLeft', 'ArrowRight'];
              if (e.key === 'Home' || e.key === 'End')
                setReading({...p, index: e.key === 'Home' ? 0 : data.length - 1});
              else if (categoryKeys.includes(e.key))
                setReading({
                  ...p,
                  index: Math.max(
                    0,
                    Math.min(data.length - 1, p.index + (e.key === categoryKeys[0] ? -1 : 1)),
                  ),
                });
              else if (unit === 'bar')
                setReading({...p, seriesId: p.seriesId === 'revenue' ? 'costs' : 'revenue'});
            }}
          >
            {horizontal ? (
              <BarChart
                {...common}
                xAxis={{label: 'Amount', unit: '$', scale: {type: 'linear'}}}
                yAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
              />
            ) : (
              <ColumnChart
                {...common}
                xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
                yAxis={{label: 'Amount', unit: '$', scale: {type: 'linear'}}}
              />
            )}
            {scene
              ? createPortal(
                  <g className="study-overlay" pointerEvents="none">
                    {selected.flatMap((p) =>
                      p.seriesId
                        ? drawn(p).map((m) => outline(m, 'selected', key(p)))
                        : (() => {
                            const b = scene.labels[data[p.index].month];
                            return b ? (
                              <line
                                key={key(p)}
                                data-cue="underline"
                                x1={b.x}
                                x2={b.x + b.width}
                                y1={b.y + b.height + 3 * scale}
                                y2={b.y + b.height + 3 * scale}
                              />
                            ) : null;
                          })(),
                    )}
                    {pulse ? (
                      <g key={pulse.id} className="pulse">
                        {readingOutline(pulse.item, 'pulse')}
                      </g>
                    ) : null}
                    {reading ? readingOutline(reading, 'reading') : null}
                    {box ? <rect {...box} data-cue="drag" /> : null}
                  </g>,
                  scene.svg,
                )
              : null}
          </div>
          <div className="reading" data-name="Current reading" aria-live="polite">
            {reading ? (
              <>
                <strong>{name(reading)}</strong>
                <span>{values(reading)}</span>
              </>
            ) : (
              <span>Move over a bar to read it. Arrow keys move between months and series.</span>
            )}
          </div>
          <div className="summary" data-name="Selection summary" aria-live="polite">
            <span>
              {selected.length
                ? `${selected.length} selected: ${selected.map(name).join(', ')}`
                : 'Nothing selected'}
            </span>
            {selected.length ? (
              <Button variant="quiet" onPress={() => setSelected([])}>
                Clear selection
              </Button>
            ) : null}
          </div>
          {opened ? (
            <div className="details" data-name="Opened details">
              <strong>Details · {name(opened)}</strong>
              <p>{values(opened)}</p>
              <Button variant="quiet" onPress={() => setOpened(null)}>
                Close details
              </Button>
            </div>
          ) : null}
        </section>
        {identify ? (
          <output className="identify">
            {identified || 'Hover or focus an element to see its name.'}
          </output>
        ) : null}
      </main>
    </AppearanceProvider>
  );
}
createRoot(document.getElementById('root')!).render(<Prototype />);
