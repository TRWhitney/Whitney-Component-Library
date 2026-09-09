// Disposable prototype adapter. Production chart APIs are unchanged.
import {useLayoutEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {createPortal} from 'react-dom';
import {
  AppearanceProvider,
  AreaChart,
  CartesianChart,
  SegmentedControl,
  ToggleButton,
  Button,
  type Appearance,
} from '../../../../src/index.js';
import '../../../../src/styles.css';
import './styles.css';

const data = [
  {month: 'Jan', revenue: 820, costs: 440},
  {month: 'Feb', revenue: 890, costs: 980},
  {month: 'Mar', revenue: 960, costs: 490},
  {month: 'Apr', revenue: 900, costs: 620},
  {month: 'May', revenue: 1100, costs: 1180},
  {month: 'Jun', revenue: 1200, costs: 700},
];
const series = [
  {id: 'revenue', accessor: 'revenue', label: 'Revenue'},
  {id: 'costs', accessor: 'costs', label: 'Operating costs'},
] as const;
type Item = {index: number; seriesId?: string};
type Box = {x: number; y: number; width: number; height: number};
type Mark = Box & {index: number; seriesId: string; kind: 'bar' | 'area' | 'line'};
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

function Prototype() {
  const [appearance, setAppearance] = useState<Appearance>('dark');
  const horizontal = false;
  const [chartKind, setChartKind] = useState<'area' | 'mixed'>('area');
  const [layout, setLayout] = useState<'grouped' | 'stacked'>('grouped');
  const [unit, setUnit] = useState<'month' | 'bar'>('bar');
  const [style, setStyle] = useState<'marker' | 'slice'>('marker');
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
      const marks: Mark[] = [...svg.querySelectorAll<SVGRectElement>('[data-wcl-chart-bar]')].map(
        (el) => ({
          kind: 'bar',
          ...rect(el),
          index: Number(el.dataset.rowIndex),
          seriesId: el.dataset.series!,
        }),
      );
      svg.querySelectorAll<SVGCircleElement>('[data-wcl-chart-point]').forEach((el) => {
        marks.push({
          kind: 'line',
          x: Number(el.getAttribute('cx')),
          y: Number(el.getAttribute('cy')),
          width: 0,
          height: 0,
          index: Number(el.dataset.rowIndex),
          seriesId: el.dataset.series!,
        });
      });
      svg.querySelectorAll<SVGPathElement>('[data-wcl-chart-area]').forEach((el) => {
        const points = [...(el.getAttribute('d') ?? '').matchAll(/[ML](-?[\d.]+),(-?[\d.]+)/g)].map(
          (m) => ({x: Number(m[1]), y: Number(m[2])}),
        );
        data.forEach((_, index) => {
          const top = points[index],
            bottom = points[points.length - 1 - index];
          if (top && bottom)
            marks.push({
              kind: 'area',
              x: top.x,
              y: top.y,
              width: 0,
              height: Math.max(0, bottom.y - top.y),
              index,
              seriesId: el.dataset.series!,
            });
        });
      });
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
  }, [chartKind, layout, compact]);
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
  const legendPriority = () => {
    const buttons = [
      ...(host.current?.querySelectorAll<HTMLButtonElement>('[data-wcl-chart-legend-button]') ??
        []),
    ];
    const button =
      buttons.find((b) => b.getAttribute('aria-pressed') === 'true') ??
      buttons.find((b) => b === document.activeElement || b.matches(':hover'));
    if (!button || button.getAttribute('aria-disabled') === 'true') return undefined;
    return series[buttons.indexOf(button)]?.id;
  };
  const emphasize = (seriesId?: string) => {
    scene?.svg.querySelectorAll<SVGElement>('[data-wcl-chart-series]').forEach((el) => {
      el.toggleAttribute(
        'data-emphasized',
        seriesId !== undefined && el.dataset.seriesId === seriesId,
      );
      el.toggleAttribute('data-muted', seriesId !== undefined && el.dataset.seriesId !== seriesId);
    });
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
    const candidates = marks.filter((m) => m.index === category.index);
    const pointDistance = (m: Mark) => Math.hypot(m.x - x, m.y - y);
    const line = candidates
      .filter((m) => m.kind === 'line')
      .sort((a, b) => pointDistance(a) - pointDistance(b))[0];
    const distance = (m: Mark) =>
      m.kind === 'bar'
        ? Math.hypot(
            Math.max(m.x - x, 0, x - m.x - m.width),
            Math.max(m.y - y, 0, y - m.y - m.height),
          )
        : m.kind === 'area' && style === 'slice'
          ? Math.hypot(m.x - x, Math.max(m.y - y, 0, y - m.y - m.height))
          : pointDistance(m);
    // Use the actual filled shape at the pointer, including slopes between months.
    const underPointer = candidates.filter((m) => {
      if (m.kind === 'area') {
        const area = [...scene.svg.querySelectorAll<SVGPathElement>('[data-wcl-chart-area]')].find(
          (el) => el.dataset.series === m.seriesId,
        );
        return area?.isPointInFill(new DOMPoint(x, y)) ?? false;
      }
      if (m.kind === 'line') return pointDistance(m) <= 11 * scale;
      return x >= m.x && x <= m.x + m.width && y >= m.y && y <= m.y + m.height;
    });
    const preferred =
      underPointer.length > 1
        ? underPointer.find((m) => m.seriesId === legendPriority())
        : undefined;
    const chosen =
      preferred ??
      (underPointer.length === 1 ? underPointer[0] : undefined) ??
      (line && pointDistance(line) <= 11 * scale
        ? line
        : candidates.reduce((a, b) =>
            distance(a) === distance(b)
              ? Math.abs(a.y - y) <= Math.abs(b.y - y)
                ? a
                : b
              : distance(a) < distance(b)
                ? a
                : b,
          ));
    // Legend priority breaks overlap ties only; month still targets all series.
    emphasize(chosen.seriesId);
    return {index: chosen.index, seriesId: unit === 'month' ? undefined : chosen.seriesId};
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
    if (m.kind === 'line' || (m.kind === 'area' && style === 'marker')) {
      const base = m.kind === 'line' ? 3.25 : 3.25 * scale;
      const r = kind === 'reading' ? base : base + (kind === 'selected' ? 1.75 : 4) * scale;
      return (
        <g key={id} data-shape="value marker">
          {m.kind === 'area' && (
            <circle cx={m.x} cy={m.y} r={3.25 * scale} data-cue="marker-base" />
          )}
          <circle cx={m.x} cy={m.y} r={r} data-cue={kind === 'reading' ? 'reading-dot' : kind} />
        </g>
      );
    }
    if (m.kind === 'area') {
      const width = (kind === 'reading' ? 5 : 11) * scale;
      return (
        <rect
          key={id}
          x={m.x - width / 2}
          y={m.y}
          width={width}
          height={Math.max(m.height, 2 * scale)}
          data-cue={kind}
        />
      );
    }
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
  const readingOutline = (item: Item, kind: string) => {
    const marks = drawn(item);
    if (!marks.length) return null;
    if (!item.seriesId && chartKind === 'area' && style === 'slice') {
      const top = Math.min(...marks.map((m) => m.y)),
        bottom = Math.max(...marks.map((m) => m.y + m.height));
      const width = (kind === 'reading' ? 5 : 11) * scale;
      return (
        <rect
          x={marks[0]?.x - width / 2}
          y={top}
          width={width}
          height={bottom - top}
          data-cue={kind}
        />
      );
    }
    return marks.map((m) => outline(m, kind, `${kind}-${key(m)}`));
  };
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
          <h1>Selecting areas and mixed charts</h1>
          <p>Compare a value marker with a slice through the area, then try bars with a line.</p>
        </header>
        <section className="controls" aria-label="Example settings">
          <div data-name="Area indicator" hidden={chartKind !== 'area'}>
            <SegmentedControl
              label="Area indicator"
              value={style}
              onChange={setStyle}
              options={[
                {label: 'Area slice', value: 'slice'},
                {label: 'Value marker', value: 'marker'},
              ]}
            />
          </div>
          <div data-name="Chart example">
            <SegmentedControl
              label="Chart"
              value={chartKind}
              onChange={(v) => {
                reset();
                setChartKind(v);
              }}
              options={[
                {label: 'Areas', value: 'area'},
                {label: 'Bars + line', value: 'mixed'},
              ]}
            />
          </div>
          <div data-name="Area arrangement" hidden={chartKind !== 'area'}>
            <SegmentedControl
              label="Arrangement"
              value={layout}
              onChange={(v) => {
                reset();
                setLayout(v);
              }}
              options={[
                {label: 'Overlapping', value: 'grouped'},
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
                {label: 'Individual value', value: 'bar'},
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
                  .filter((m) =>
                    intersect(
                      rect,
                      m.kind === 'area' && style === 'marker' ? {...m, height: 0} : m,
                    ),
                  )
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
              if (!drag.current) {
                setReading(null);
                emphasize(legendPriority());
              }
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
            {chartKind === 'area' ? (
              <AreaChart
                {...common}
                stacking={layout === 'stacked' ? 'stacked' : 'overlap'}
                xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
                yAxis={{label: 'Amount', unit: '$', scale: {type: 'linear'}}}
              />
            ) : (
              <CartesianChart
                {...common}
                series={[
                  {...series[0], kind: 'column'},
                  {...series[1], kind: 'line', showPoints: true},
                ]}
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
              <span>
                Move over the chart to read a value. Arrow keys move between months and series.
              </span>
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
