// Isolated interaction study. DOM geometry adaptation is not production architecture.
import {useLayoutEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {createPortal} from 'react-dom';
import {
  AppearanceProvider,
  ScatterChart,
  BubbleChart,
  SegmentedControl,
  ToggleButton,
  Button,
  type Appearance,
} from '../../../../src/index.js';
import '../../../../src/styles.css';
import './styles.css';
const data = [
  {id: 'n1', label: 'North · 08:00', loop: 'north', temperature: 24, demand: 32, volume: 18},
  {id: 's1', label: 'South · 08:00', loop: 'south', temperature: 24, demand: 32, volume: 34},
  {id: 'n2', label: 'North · 10:00', loop: 'north', temperature: 38, demand: 47, volume: 62},
  {id: 's2', label: 'South · 10:00', loop: 'south', temperature: 41, demand: 49, volume: 48},
  {id: 'n3', label: 'North · 12:00', loop: 'north', temperature: 55, demand: 66, volume: 90},
  {id: 's3', label: 'South · 12:00', loop: 'south', temperature: 63, demand: 57, volume: 30},
  {id: 'n4', label: 'North · 14:00', loop: 'north', temperature: 71, demand: 76, volume: 44},
  {id: 's4', label: 'South · 14:00', loop: 'south', temperature: 80, demand: 64, volume: 72},
];
const series = [
  {id: 'north', label: 'North loop'},
  {id: 'south', label: 'South loop'},
] as const;
type Box = {x: number; y: number; width: number; height: number};
type Mark = {
  id: string;
  seriesId: string;
  x: number;
  y: number;
  radius: number;
  element: SVGGeometryElement;
  shape: number;
};
type Scene = {svg: SVGSVGElement; plot: Box; marks: Mark[]};
const row = (id: string) => data.find((d) => d.id === id)!;
const values = (id: string) => {
  const d = row(id);
  return `${d.temperature} °C · ${d.demand} MWh · ${d.volume} m³`;
};
const unique = (ids: string[]) => [...new Set(ids)];
function Prototype() {
  const [appearance, setAppearance] = useState<Appearance>('dark');
  const [kind, setKind] = useState<'scatter' | 'bubble'>('bubble');
  const [dragMode, setDragMode] = useState<'centers' | 'touching'>('centers');
  const [selectionEnabled, setSelectionEnabled] = useState(true);
  const [compact, setCompact] = useState(false),
    [identify, setIdentify] = useState(false),
    [identified, setIdentified] = useState('');
  const [selected, setSelected] = useState<string[]>([]),
    [reading, setReading] = useState<string | null>(null),
    [opened, setOpened] = useState<string | null>(null);
  const [pulse, setPulse] = useState<{id: string; serial: number} | null>(null),
    [box, setBox] = useState<Box | null>(null);
  const [scene, setScene] = useState<Scene | null>(null);
  const host = useRef<HTMLDivElement>(null),
    hold = useRef<ReturnType<typeof setTimeout> | null>(null),
    pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null),
    serial = useRef(0);
  const pointerFocus = useRef(false);
  const gesture = useRef<{
    id: number;
    x: number;
    y: number;
    before: string[];
    target: string | null;
    moved: boolean;
    held: boolean;
    add: boolean;
    remove: boolean;
  } | null>(null);
  const clearHold = () => {
    if (hold.current) clearTimeout(hold.current);
    hold.current = null;
  };
  const cancel = () => {
    clearHold();
    if (gesture.current) setSelected(gesture.current.before);
    gesture.current = null;
    setBox(null);
  };
  const reset = () => {
    cancel();
    setSelected([]);
    setReading(null);
    setOpened(null);
    setPulse(null);
  };
  useLayoutEffect(() => {
    const root = host.current!;
    let frame = 0;
    const read = () => {
      const svg = root.querySelector<SVGSVGElement>('[data-wcl-chart-svg]'),
        plot = svg?.querySelector<SVGRectElement>('[data-wcl-chart-hit-region]');
      if (!svg || !plot) return;
      const b = plot.getBBox();
      const marks = [
        ...svg.querySelectorAll<SVGGElement>('[data-wcl-statistical-mark][data-point-id]'),
      ].map((g) => {
        const element = g.querySelector<SVGGeometryElement>('[data-wcl-statistical-point]')!;
        const b = element.getBBox();
        return {
          id: g.dataset.pointId!,
          seriesId: g.dataset.seriesId!,
          x: b.x + b.width / 2,
          y: b.y + b.height / 2,
          radius: Number(g.dataset.markRadius),
          shape: Number(element.dataset.shape),
          element,
        };
      });
      root.querySelectorAll<HTMLElement>('[data-wcl-chart-canvas]').forEach((el) => {
        if (el.tabIndex !== -1) el.tabIndex = -1;
      });
      setScene((old) =>
        old?.svg === svg &&
        old.marks.length === marks.length &&
        old.marks.every(
          (m, i) =>
            m.element === marks[i].element &&
            m.x === marks[i].x &&
            m.y === marks[i].y &&
            m.radius === marks[i].radius,
        )
          ? old
          : {svg, plot: {x: b.x, y: b.y, width: b.width, height: b.height}, marks},
      );
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    };
    const observer = new MutationObserver(schedule);
    observer.observe(root, {subtree: true, attributes: true, childList: true});
    const resize = new ResizeObserver(schedule);
    resize.observe(root);
    read();
    return () => {
      observer.disconnect();
      resize.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [kind, compact]);
  useLayoutEffect(
    () => () => {
      clearHold();
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
    },
    [],
  );
  const scale = scene
    ? scene.svg.viewBox.baseVal.width / scene.svg.getBoundingClientRect().width
    : 1;
  const point = (e: {clientX: number; clientY: number}) => {
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(
      scene!.svg.getScreenCTM()!.inverse(),
    );
    return {x: p.x, y: p.y};
  };
  const insidePlot = (x: number, y: number) =>
    scene &&
    x >= scene.plot.x &&
    x <= scene.plot.x + scene.plot.width &&
    y >= scene.plot.y &&
    y <= scene.plot.y + scene.plot.height;
  const contains = (m: Mark, x: number, y: number) => {
    const p = new DOMPoint(x, y)
      .matrixTransform(scene!.svg.getScreenCTM()!)
      .matrixTransform(m.element.getScreenCTM()!.inverse());
    return m.element.isPointInFill(p) || m.element.isPointInStroke(p);
  };
  const priority = () => {
    const buttons = [
      ...(host.current?.querySelectorAll<HTMLButtonElement>('[data-wcl-chart-legend-button]') ??
        []),
    ];
    const button =
      buttons.find((b) => b.getAttribute('aria-pressed') === 'true') ??
      buttons.find((b) => b === document.activeElement || b.matches(':hover'));
    return button ? series[buttons.indexOf(button)]?.id : undefined;
  };
  const targetAt = (x: number, y: number) => {
    if (!insidePlot(x, y)) return null;
    const hits = scene!.marks.filter((m) => contains(m, x, y));
    const preferred = hits.length > 1 ? hits.find((m) => m.seriesId === priority()) : undefined;
    return (
      (
        preferred ??
        hits.sort(
          (a, b) =>
            Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y) ||
            data.findIndex((d) => d.id === a.id) - data.findIndex((d) => d.id === b.id),
        )[0]
      )?.id ?? null
    );
  };
  const activate = (id: string, only = false) => {
    if (selectionEnabled && !only) {
      setSelected((old) => (old.includes(id) ? old.filter((x) => x !== id) : [...old, id]));
      return;
    }
    setOpened(id);
    setPulse({id, serial: ++serial.current});
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    pulseTimer.current = setTimeout(() => setPulse(null), 650);
  };
  const isPlot = (e: {target: EventTarget | null}) =>
    !!(e.target as Element)?.closest('[data-wcl-chart-svg]');
  const shape = (m: Mark, r: number, cue: string) =>
    m.shape % 6 === 1 ? (
      <rect
        data-cue={cue}
        x={m.x - r * 0.85}
        y={m.y - r * 0.85}
        width={r * 1.7}
        height={r * 1.7}
        transform={`rotate(45 ${m.x} ${m.y})`}
      />
    ) : (
      <circle data-cue={cue} cx={m.x} cy={m.y} r={r} />
    );
  const draw = (id: string, cue: string) => {
    const m = scene?.marks.find((m) => m.id === id);
    if (!m) return null;
    const radius =
      cue === 'reading'
        ? Math.min(m.radius - 1 * scale, 3.5 * scale)
        : m.radius + (cue === 'selected' ? 2 : 5) * scale;
    return (
      <g key={`${id}-${cue}`} data-name={`${row(id).label} ${cue}`}>
        {cue === 'reading' && kind === 'bubble'
          ? shape(m, Math.max(0, m.radius - 2 * scale), 'reading-edge')
          : null}
        {shape(m, Math.max(radius, 1 * scale), cue)}
      </g>
    );
  };
  const touched = (m: Mark, b: Box) => {
    if (m.x >= b.x && m.x <= b.x + b.width && m.y >= b.y && m.y <= b.y + b.height) return true;
    const edges = [
      [b.x, b.y, b.x + b.width, b.y],
      [b.x + b.width, b.y, b.x + b.width, b.y + b.height],
      [b.x + b.width, b.y + b.height, b.x, b.y + b.height],
      [b.x, b.y + b.height, b.x, b.y],
    ];
    // This fixture uses circles and diamonds. Polygon boundary intersections are exact for diamonds.
    if (m.shape % 6 === 1) {
      const r = m.radius * 0.85 * Math.SQRT2;
      const diamond = [
        {x: m.x, y: m.y - r},
        {x: m.x + r, y: m.y},
        {x: m.x, y: m.y + r},
        {x: m.x - r, y: m.y},
      ];
      if (
        diamond.some(
          (p) => p.x >= b.x && p.x <= b.x + b.width && p.y >= b.y && p.y <= b.y + b.height,
        )
      )
        return true;
      if (
        [
          [b.x, b.y],
          [b.x + b.width, b.y],
          [b.x, b.y + b.height],
          [b.x + b.width, b.y + b.height],
        ].some(([x, y]) => Math.abs(x - m.x) + Math.abs(y - m.y) <= r)
      )
        return true;
      return edges.some(([ax, ay, bx, by]) =>
        diamond.some((c, i) => {
          const d = diamond[(i + 1) % 4],
            den = (bx - ax) * (d.y - c.y) - (by - ay) * (d.x - c.x);
          if (!den) return false;
          const t = ((c.x - ax) * (d.y - c.y) - (c.y - ay) * (d.x - c.x)) / den,
            u = ((c.x - ax) * (by - ay) - (c.y - ay) * (bx - ax)) / den;
          return t >= 0 && t <= 1 && u >= 0 && u <= 1;
        }),
      );
    }
    return (
      Math.hypot(
        Math.max(b.x - m.x, 0, m.x - b.x - b.width),
        Math.max(b.y - m.y, 0, m.y - b.y - b.height),
      ) <= m.radius
    );
  };
  const common = {
    data,
    idAccessor: 'id',
    labelAccessor: 'label',
    seriesAccessor: 'loop',
    series,
    legend: {label: 'Operating loops'},
    title: 'Thermal demand by temperature',
    description:
      'Each mark is one operating observation. Overlapping readings belong to separate loops.',
    dataTableLabel: 'Operating observations',
    emptyState: {title: 'No observations', description: 'Add operating records.'},
    invalidData: {title: 'Invalid observations', description: 'Check the records.'},
    xAxis: {
      accessor: 'temperature',
      label: 'Ambient temperature',
      unit: '°C',
      scale: {type: 'linear', domain: [10, 90]},
    },
    yAxis: {
      accessor: 'demand',
      label: 'Thermal demand',
      unit: 'MWh',
      scale: {type: 'linear', domain: [15, 90]},
    },
  } as const;
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
          <h1>Selecting observations</h1>
          <p>Try overlapping points and bubbles, then compare what a selection box includes.</p>
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
                {label: 'Scatter', value: 'scatter'},
                {label: 'Bubbles', value: 'bubble'},
              ]}
            />
          </div>
          <div data-name="Drag inclusion">
            <SegmentedControl
              label="Drag includes"
              value={dragMode}
              onChange={setDragMode}
              options={[
                {label: 'Centers inside', value: 'centers'},
                {label: 'Touching marks', value: 'touching'},
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
              ? 'Click or tap a mark to select. Control/Command-click or press and hold to open details. Drag from anywhere in the plot; Shift adds, Alt removes, Escape cancels.'
              : 'Click or tap a mark to open details.'}{' '}
            Pin a legend name to prioritize that loop only where marks overlap.
          </p>
          <div
            ref={host}
            className="chart-adapter"
            role="group"
            tabIndex={0}
            aria-label="Observation chart interaction"
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
              if (!insidePlot(p.x, p.y)) return;
              e.preventDefault();
              e.stopPropagation();
              pointerFocus.current = true;
              e.currentTarget.focus();
              pointerFocus.current = false;
              const target = targetAt(p.x, p.y);
              setReading(target);
              e.currentTarget.setPointerCapture(e.pointerId);
              gesture.current = {
                id: e.pointerId,
                ...p,
                before: selected,
                target,
                moved: false,
                held: false,
                add: e.shiftKey || e.ctrlKey || e.metaKey,
                remove: e.altKey,
              };
              if (e.pointerType === 'touch' && selectionEnabled && target)
                hold.current = setTimeout(() => {
                  if (gesture.current && !gesture.current.moved) {
                    gesture.current.held = true;
                    activate(target, true);
                  }
                }, 500);
            }}
            onPointerMoveCapture={(e) => {
              if (!scene || (!isPlot(e) && !gesture.current)) return;
              e.stopPropagation();
              const p = point(e),
                d = gesture.current;
              setReading(targetAt(p.x, p.y));
              if (!d || d.held) return;
              if (!d.moved && Math.hypot(p.x - d.x, p.y - d.y) < 5 * scale) return;
              d.moved = true;
              clearHold();
              if (!selectionEnabled) return;
              const b = {
                x: Math.min(d.x, p.x),
                y: Math.min(d.y, p.y),
                width: Math.abs(d.x - p.x),
                height: Math.abs(d.y - p.y),
              };
              setBox(b);
              const chosen = scene.marks
                .filter((m) =>
                  dragMode === 'touching'
                    ? touched(m, b)
                    : m.x >= b.x && m.x <= b.x + b.width && m.y >= b.y && m.y <= b.y + b.height,
                )
                .map((m) => m.id);
              setSelected(
                d.remove
                  ? d.before.filter((id) => !chosen.includes(id))
                  : d.add
                    ? unique([...d.before, ...chosen])
                    : chosen,
              );
            }}
            onPointerUpCapture={(e) => {
              const d = gesture.current;
              if (!d) return;
              e.stopPropagation();
              clearHold();
              if (!d.moved && !d.held && scene) {
                const p = point(e),
                  target = targetAt(p.x, p.y);
                if (target) activate(target, e.ctrlKey || e.metaKey);
              }
              gesture.current = null;
              setBox(null);
              e.currentTarget.releasePointerCapture(e.pointerId);
            }}
            onPointerCancel={cancel}
            onLostPointerCapture={() => {
              if (gesture.current) cancel();
            }}
            onPointerLeave={() => {
              if (!gesture.current) setReading(null);
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
                !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)
              )
                return;
              e.preventDefault();
              const ordered = [...scene.marks].sort(
                (a, b) =>
                  data.findIndex((d) => d.id === a.id) - data.findIndex((d) => d.id === b.id),
              );
              const m = ordered.find((m) => m.id === reading) ?? ordered[0];
              if (!m) return;
              if (e.key === 'Home' || e.key === 'End') {
                setReading(ordered[e.key === 'Home' ? 0 : ordered.length - 1].id);
                return;
              }
              if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                const at = ordered.indexOf(m);
                setReading(
                  ordered[
                    Math.max(0, Math.min(ordered.length - 1, at + (e.key === 'ArrowLeft' ? -1 : 1)))
                  ].id,
                );
                return;
              }
              const candidates = ordered.filter(
                (n) =>
                  n.id !== m.id &&
                  (e.key === 'ArrowLeft'
                    ? n.x <= m.x
                    : e.key === 'ArrowRight'
                      ? n.x >= m.x
                      : e.key === 'ArrowUp'
                        ? n.y < m.y
                        : n.y > m.y),
              );
              candidates.sort(
                (a, b) => Math.hypot(a.x - m.x, a.y - m.y) - Math.hypot(b.x - m.x, b.y - m.y),
              );
              if (candidates[0]) setReading(candidates[0].id);
            }}
          >
            {kind === 'bubble' ? (
              <BubbleChart
                {...common}
                magnitude={{accessor: 'volume', label: 'Water volume', unit: 'm³'}}
              />
            ) : (
              <ScatterChart {...common} />
            )}
            {scene
              ? createPortal(
                  <g className="study-overlay" pointerEvents="none">
                    {selected.map((id) => draw(id, 'selected'))}
                    {pulse ? (
                      <g key={pulse.serial} className="pulse">
                        {draw(pulse.id, 'pulse')}
                      </g>
                    ) : null}
                    {reading ? draw(reading, 'reading') : null}
                    {box ? <rect {...box} data-cue="drag" /> : null}
                  </g>,
                  scene.svg,
                )
              : null}
          </div>
          <div className="reading" data-name="Current reading" aria-live="polite">
            {reading ? (
              <>
                <strong>{row(reading).label}</strong>
                <span>{values(reading)}</span>
              </>
            ) : (
              <span>
                Hover a mark to read it. Left/Right step through observations, including overlaps;
                Up/Down move spatially.
              </span>
            )}
          </div>
          <div className="summary" data-name="Selection summary" aria-live="polite">
            <span>
              {selected.length
                ? `${selected.length} selected: ${selected.map((id) => row(id).label).join(', ')}`
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
              <strong>{row(opened).label}</strong>
              <p>{values(opened)}</p>
              <Button variant="quiet" onPress={() => setOpened(null)}>
                Close details
              </Button>
            </div>
          ) : null}
          <p className="instructions">
            {dragMode === 'centers'
              ? 'A mark is selected when its center is inside the box.'
              : 'A mark is selected when any part of its shape touches the box.'}{' '}
            Bubble area represents water volume; the small filled center shows the current reading.
          </p>
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
