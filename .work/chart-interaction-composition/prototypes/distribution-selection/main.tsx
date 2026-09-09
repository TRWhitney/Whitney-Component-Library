// Disposable planning adapter, not production interaction code.
import {useLayoutEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {createPortal} from 'react-dom';
import {
  AppearanceProvider,
  Histogram,
  BoxPlot,
  SegmentedControl,
  ToggleButton,
  Button,
  type Appearance,
} from '../../../../src/index.js';
import '../../../../src/styles.css';
import './styles.css';
import {frameBar} from '../../../../src/charts/bar-interaction-geometry.js';
const bins = [
  {lower: 0, upper: 40, count: 2},
  {lower: 40, upper: 80, count: 5},
  {lower: 80, upper: 120, count: 8},
  {lower: 120, upper: 160, count: 5},
  {lower: 160, upper: 200, count: 2},
  {lower: 200, upper: 240, count: 1},
];
const groups = [
  {id: 'north', label: 'North loop'},
  {id: 'south', label: 'South loop'},
  {id: 'west', label: 'West loop'},
] as const;
const summaries = [
  {group: 'north', low: 24, q1: 38, median: 48, q3: 60, high: 78, outliers: [100, 110]},
  {group: 'south', low: 18, q1: 32, median: 41, q3: 51, high: 69, outliers: [90]},
  {group: 'west', low: 29, q1: 47, median: 58, q3: 72, high: 94, outliers: [112]},
];
type Rect = {x: number; y: number; width: number; height: number};
type Mark = {
  id: string;
  label: string;
  detail: string;
  kind: 'bin' | 'summary' | 'outlier';
  rect: Rect;
  whole: Rect;
  x: number;
  y: number;
  radius: number;
  elements: SVGGeometryElement[];
  index: number;
};
type Scene = {svg: SVGSVGElement; plot: Rect; marks: Mark[]};
const rect = (el: SVGGraphicsElement): Rect => {
  if (el.tagName.toLowerCase() === 'rect')
    return {
      x: Number(el.getAttribute('x')),
      y: Number(el.getAttribute('y')),
      width: Number(el.getAttribute('width')),
      height: Number(el.getAttribute('height')),
    };
  const b = el.getBBox();
  return {x: b.x, y: b.y, width: b.width, height: b.height};
};
const intersects = (a: Rect, b: Rect) =>
  a.x <= b.x + b.width && a.x + a.width >= b.x && a.y <= b.y + b.height && a.y + a.height >= b.y;
function Study() {
  const [kind, setKind] = useState<'histogram' | 'box'>('box');
  const [appearance, setAppearance] = useState<Appearance>('dark');
  const [selection, setSelection] = useState(true),
    [compact, setCompact] = useState(false),
    [identify, setIdentify] = useState(false),
    [identified, setIdentified] = useState('');
  const [scene, setScene] = useState<Scene | null>(null),
    [reading, setReading] = useState<string | null>(null),
    [selected, setSelected] = useState<string[]>([]),
    [opened, setOpened] = useState<Mark | null>(null),
    [box, setBox] = useState<Rect | null>(null),
    [pulse, setPulse] = useState<{id: string; serial: number} | null>(null);
  const host = useRef<HTMLDivElement>(null),
    hold = useRef<ReturnType<typeof setTimeout>>(),
    pulseTimer = useRef<ReturnType<typeof setTimeout>>();
  const pointerFocus = useRef(false);
  const drag = useRef<{
    id: number;
    x: number;
    y: number;
    clientX: number;
    clientY: number;
    before: string[];
    moved: boolean;
    held: boolean;
    add: boolean;
    remove: boolean;
  } | null>(null);
  const cancel = () => {
    clearTimeout(hold.current);
    if (drag.current) setSelected(drag.current.before);
    drag.current = null;
    setBox(null);
  };
  const reset = () => {
    cancel();
    setReading(null);
    setSelected([]);
    setOpened(null);
    setPulse(null);
  };
  useLayoutEffect(() => {
    let frame = 0;
    const root = host.current!;
    const read = () => {
      const svg = root.querySelector<SVGSVGElement>('[data-wcl-chart-svg]'),
        plot = svg?.querySelector<SVGRectElement>('[data-wcl-chart-hit-region]');
      if (!svg || !plot) return;
      const marks: Mark[] = [];
      if (kind === 'histogram')
        svg.querySelectorAll<SVGRectElement>('[data-wcl-histogram-bin]').forEach((el, index) => {
          const r = rect(el),
            d = bins[index];
          marks.push({
            id: `bin-${index}`,
            index,
            label: `${d.lower}–${d.upper} ms`,
            detail: `${d.count} restarts in ${d.lower} ≤ latency ${index === bins.length - 1 ? '≤' : '<'} ${d.upper} ms`,
            kind: 'bin',
            rect: r,
            whole: r,
            x: r.x + r.width / 2,
            y: r.y + r.height / 2,
            radius: 0,
            elements: [el],
          });
        });
      else
        svg.querySelectorAll<SVGGElement>('[data-wcl-box-summary]').forEach((el, index) => {
          const q = el.querySelector<SVGRectElement>('[data-wcl-box-quartile]')!,
            median = el.querySelector<SVGLineElement>('[data-wcl-box-median]')!,
            r = rect(q),
            d = summaries[index],
            name = groups[index].label;
          marks.push({
            id: `summary-${index}`,
            index: Number(el.dataset.readingIndex),
            label: `${name} summary`,
            detail: `Median ${d.median} min · middle half ${d.q1}–${d.q3} min · whiskers ${d.low}–${d.high} min`,
            kind: 'summary',
            rect: r,
            whole: rect(el),
            x: r.x + r.width / 2,
            y: Number(median.getAttribute('y1')),
            radius: 0,
            elements: [...el.querySelectorAll<SVGGeometryElement>('rect,line')],
          });
          el.parentElement!.querySelectorAll<SVGCircleElement>('[data-wcl-box-outlier]').forEach(
            (out, j) => {
              const b = rect(out);
              marks.push({
                id: `outlier-${index}-${j}`,
                index: Number(out.dataset.readingIndex),
                label: `${name} · ${d.outliers[j]} min outlier`,
                detail: `One unusually high recovery time: ${d.outliers[j]} minutes.`,
                kind: 'outlier',
                rect: b,
                whole: b,
                x: Number(out.getAttribute('cx')),
                y: Number(out.getAttribute('cy')),
                radius: Number(out.getAttribute('r')),
                elements: [out],
              });
            },
          );
        });
      root.querySelectorAll<HTMLElement>('[data-wcl-chart-canvas]').forEach((el) => {
        if (el.tabIndex !== -1) el.tabIndex = -1;
      });
      const next = {svg, plot: rect(plot), marks};
      setScene((old) =>
        old?.svg === svg &&
        JSON.stringify(old.marks.map((m) => [m.id, m.rect, m.whole, m.y])) ===
          JSON.stringify(marks.map((m) => [m.id, m.rect, m.whole, m.y]))
          ? old
          : next,
      );
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    };
    const mo = new MutationObserver(schedule),
      ro = new ResizeObserver(schedule);
    mo.observe(root, {subtree: true, attributes: true, childList: true});
    ro.observe(root);
    read();
    return () => {
      mo.disconnect();
      ro.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [kind, compact]);
  useLayoutEffect(
    () => () => {
      clearTimeout(hold.current);
      clearTimeout(pulseTimer.current);
    },
    [],
  );
  const scale = scene ? 1 / scene.svg.getScreenCTM()!.a : 1;
  const point = (e: {clientX: number; clientY: number}) =>
    new DOMPoint(e.clientX, e.clientY).matrixTransform(scene!.svg.getScreenCTM()!.inverse());
  const inside = (x: number, y: number) =>
    !!scene &&
    x >= scene.plot.x &&
    x <= scene.plot.x + scene.plot.width &&
    y >= scene.plot.y &&
    y <= scene.plot.y + scene.plot.height;
  const hit = (x: number, y: number) =>
    scene?.marks.find((m) =>
      m.elements.some((el) => {
        const p = new DOMPoint(x, y)
          .matrixTransform(scene.svg.getScreenCTM()!)
          .matrixTransform(el.getScreenCTM()!.inverse());
        return el.isPointInFill(p) || el.isPointInStroke(p);
      }),
    )?.id ?? null;
  const byId = (id: string | null) => scene?.marks.find((m) => m.id === id);
  const activate = (id: string, only = false) => {
    if (selection && !only) {
      setSelected((old) => (old.includes(id) ? old.filter((v) => v !== id) : [...old, id]));
      return;
    }
    const m = byId(id);
    if (m) {
      setOpened(m);
      setPulse({id, serial: Date.now()});
      clearTimeout(pulseTimer.current);
      pulseTimer.current = setTimeout(() => setPulse(null), 650);
    }
  };
  const isPlot = (e: {target: EventTarget | null}) =>
    !!(e.target as Element)?.closest('[data-wcl-chart-svg]');
  const cue = (id: string, type: 'selected' | 'reading' | 'pulse') => {
    const m = byId(id);
    if (!m) return null;
    const pad = (type === 'reading' ? -2 : type === 'pulse' ? 5 : 2) * scale;
    if (m.kind === 'outlier')
      return (
        <circle
          key={id}
          data-cue={type}
          cx={m.x}
          cy={m.y}
          r={type === 'reading' ? Math.max(1 * scale, m.radius - 2 * scale) : m.radius + pad}
        />
      );
    const r = m.rect;
    const frame =
      m.kind === 'bin' && type !== 'reading'
        ? frameBar(
            r,
            scene!.marks.filter((mark) => mark.kind === 'bin').map((mark) => mark.rect),
            pad,
          )
        : {
            x: r.x - pad,
            y: r.y - pad,
            width: Math.max(0, r.width + 2 * pad),
            height: Math.max(0, r.height + 2 * pad),
          };
    return (
      <g key={id} data-cue={type}>
        <rect {...frame} />
        {m.kind === 'summary' ? (
          <>
            <line x1={m.x} x2={m.x} y1={m.whole.y} y2={r.y} />
            <line x1={m.x} x2={m.x} y1={r.y + r.height} y2={m.whole.y + m.whole.height} />
            <line x1={m.x - r.width / 4} x2={m.x + r.width / 4} y1={m.whole.y} y2={m.whole.y} />
            <line
              x1={m.x - r.width / 4}
              x2={m.x + r.width / 4}
              y1={m.whole.y + m.whole.height}
              y2={m.whole.y + m.whole.height}
            />
          </>
        ) : null}
      </g>
    );
  };
  const identifyElement = (e: {target: EventTarget | null}) => {
    if (identify)
      setIdentified(
        (e.target as Element).closest('[data-name]')?.getAttribute('data-name') ??
          'Distribution chart',
      );
  };
  return (
    <AppearanceProvider appearance={appearance} accent="#2878ff">
      <main className="study" onPointerOver={identifyElement} onFocus={identifyElement}>
        <header>
          <p className="kicker">Interaction study</p>
          <h1>Selecting distributions</h1>
          <p>
            A histogram bar represents a range. A box summarizes a group; its separate dots are
            outliers.
          </p>
        </header>
        <section className="controls" aria-label="Example settings">
          <div data-name="Chart kind">
            <SegmentedControl
              label="Chart"
              value={kind}
              onChange={(v) => {
                reset();
                setKind(v);
              }}
              options={[
                {label: 'Histogram', value: 'histogram'},
                {label: 'Box plot', value: 'box'},
              ]}
            />
          </div>
          {kind === 'box' ? (
            <p className="hint">
              Dragging includes a summary when any part of its central box touches the rectangle.
              Outlier dots are selected only when their centers are inside.
            </p>
          ) : null}
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
          <div className="toggles">
            <ToggleButton
              isSelected={selection}
              onChange={(v) => {
                reset();
                setSelection(v);
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
          </div>
        </section>
        <section className="example" data-compact={compact || undefined}>
          <p className="instructions">
            {selection
              ? 'Click or tap to select. Control/Command-click or touch press-and-hold opens details. Drag to select several; Shift or Control/Command adds, Alt removes, Escape cancels.'
              : 'Click or tap to open details.'}
          </p>
          <div
            className="chart-adapter"
            ref={host}
            role="group"
            tabIndex={0}
            aria-label="Distribution interaction"
            data-name="Chart interaction"
            onFocusCapture={(e) => {
              if (
                e.target === e.currentTarget &&
                !pointerFocus.current &&
                e.currentTarget.matches(':focus-visible')
              )
                setReading(scene?.marks[0]?.id ?? null);
            }}
            onPointerDownCapture={(e) => {
              if (!isPlot(e) || !scene || e.button !== 0) return;
              const p = point(e);
              if (!inside(p.x, p.y)) return;
              e.preventDefault();
              e.stopPropagation();
              pointerFocus.current = true;
              e.currentTarget.focus();
              pointerFocus.current = false;
              e.currentTarget.setPointerCapture(e.pointerId);
              const target = hit(p.x, p.y);
              setReading(target);
              drag.current = {
                id: e.pointerId,
                x: p.x,
                y: p.y,
                clientX: e.clientX,
                clientY: e.clientY,
                before: selected,
                moved: false,
                held: false,
                add: e.shiftKey || e.ctrlKey || e.metaKey,
                remove: e.altKey,
              };
              if (e.pointerType === 'touch' && selection && target)
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
              const p = point(e),
                d = drag.current;
              setReading(hit(p.x, p.y));
              if (!d || d.held) return;
              if (!d.moved && Math.hypot(e.clientX - d.clientX, e.clientY - d.clientY) < 5) return;
              d.moved = true;
              clearTimeout(hold.current);
              if (!selection) return;
              const x = Math.max(scene.plot.x, Math.min(scene.plot.x + scene.plot.width, p.x)),
                y = Math.max(scene.plot.y, Math.min(scene.plot.y + scene.plot.height, p.y));
              const b = {
                x: Math.min(d.x, x),
                y: Math.min(d.y, y),
                width: Math.abs(d.x - x),
                height: Math.abs(d.y - y),
              };
              setBox(b);
              const chosen = scene.marks
                .filter((m) =>
                  m.kind === 'bin' || m.kind === 'summary'
                    ? intersects(m.rect, b)
                    : m.x >= b.x && m.x <= b.x + b.width && m.y >= b.y && m.y <= b.y + b.height,
                )
                .map((m) => m.id);
              setSelected(
                d.remove
                  ? d.before.filter((id) => !chosen.includes(id))
                  : d.add
                    ? [...new Set([...d.before, ...chosen])]
                    : chosen,
              );
            }}
            onPointerUpCapture={(e) => {
              const d = drag.current;
              if (!d) return;
              e.stopPropagation();
              clearTimeout(hold.current);
              if (!d.moved && !d.held) {
                const p = point(e),
                  id = hit(p.x, p.y);
                if (id) activate(id, e.ctrlKey || e.metaKey);
              }
              drag.current = null;
              setBox(null);
              e.currentTarget.releasePointerCapture(e.pointerId);
            }}
            onPointerCancel={cancel}
            onLostPointerCapture={() => {
              if (drag.current) cancel();
            }}
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
              if (e.target !== e.currentTarget || !scene) return;
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
                !['Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)
              )
                return;
              e.preventDefault();
              const i = Math.max(
                  0,
                  scene.marks.findIndex((m) => m.id === reading),
                ),
                next =
                  e.key === 'Home'
                    ? 0
                    : e.key === 'End'
                      ? scene.marks.length - 1
                      : Math.max(
                          0,
                          Math.min(
                            scene.marks.length - 1,
                            i + (['ArrowLeft', 'ArrowUp'].includes(e.key) ? -1 : 1),
                          ),
                        );
              setReading(scene.marks[next]?.id ?? null);
            }}
          >
            {kind === 'histogram' ? (
              <Histogram
                data={bins}
                title="Pump restart latency"
                description="Number of restarts in each latency range."
                dataTableLabel="Restart ranges"
                emptyState={{title: 'No restarts', description: 'Record a restart'}}
                invalidData={{title: 'Invalid range', description: 'Check counts'}}
                distribution={{
                  kind: 'binned',
                  lowerAccessor: 'lower',
                  upperAccessor: 'upper',
                  ordinate: 'count',
                  ordinateAccessor: 'count',
                }}
                xAxis={{
                  label: 'Restart latency',
                  unit: 'ms',
                  scale: {type: 'linear', domain: [0, 240]},
                }}
                yAxis={{label: 'Restarts', scale: {type: 'linear', domain: [0, 10]}}}
              />
            ) : (
              <BoxPlot
                data={summaries}
                groupAccessor="group"
                groups={groups}
                legend={{label: 'Turbine loops'}}
                title="Recovery-time distribution"
                description="Each box shows the middle half of recovery times. Dots show unusually high values."
                dataTableLabel="Loop summaries"
                emptyState={{title: 'No summaries', description: 'Record recovery times'}}
                invalidData={{title: 'Invalid summary', description: 'Check values'}}
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
                xAxis={{label: 'Turbine loop'}}
                yAxis={{
                  label: 'Recovery time',
                  unit: 'min',
                  scale: {type: 'linear', domain: [0, 120]},
                }}
              />
            )}
            {scene
              ? createPortal(
                  <g className="study-overlay" pointerEvents="none">
                    {selected.map((id) => cue(id, 'selected'))}
                    {pulse ? (
                      <g key={pulse.serial} className="pulse">
                        {cue(pulse.id, 'pulse')}
                      </g>
                    ) : null}
                    {reading ? cue(reading, 'reading') : null}
                    {box ? <rect {...box} data-cue="drag" /> : null}
                  </g>,
                  scene.svg,
                )
              : null}
          </div>
          <div className="reading" data-name="Current reading" aria-live="polite">
            {reading ? (
              <>
                <strong>{byId(reading)?.label}</strong>
                <span>{byId(reading)?.detail}</span>
              </>
            ) : (
              <span>
                Hover to read. Arrow keys visit summaries and individual outliers; Enter selects,
                Control/Command+Enter opens details.
              </span>
            )}
          </div>
          <div className="summary" data-name="Selection summary" aria-live="polite">
            <span>
              {selected.length
                ? `${selected.length} selected: ${selected.map((id) => byId(id)?.label).join(', ')}`
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
              <strong>{opened.label}</strong>
              <p>{opened.detail}</p>
              <Button variant="quiet" onPress={() => setOpened(null)}>
                Close details
              </Button>
            </div>
          ) : null}
          {kind === 'box' ? (
            <p className="hint">
              Selecting a box selects its statistical summary. Each outlier dot is a separate
              target. The inner outline shows the summary you are reading.
            </p>
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
createRoot(document.getElementById('root')!).render(<Study />);
