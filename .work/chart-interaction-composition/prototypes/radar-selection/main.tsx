// Isolated interaction study; no public RadarChart behavior changes.
import {useLayoutEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {createPortal} from 'react-dom';
import {
  AppearanceProvider,
  RadarChart,
  SegmentedControl,
  ToggleButton,
  Button,
  type RadarChartDimensions,
} from '../../../../src/index.js';
import '../../../../src/styles.css';
import './styles.css';
const data = [
  {id: 'courier', label: 'Courier', speed: 5, range: 7, efficiency: 8, comfort: 6, reliability: 9},
  {id: 'scout', label: 'Scout', speed: 8, range: 9, efficiency: 6, comfort: 8, reliability: 7},
] as const;
type Profile = (typeof data)[number];
const dimensions: RadarChartDimensions<Profile> = [
  {id: 'speed', label: 'Speed', accessor: 'speed'},
  {id: 'range', label: 'Range', accessor: 'range'},
  {id: 'efficiency', label: 'Efficiency', accessor: 'efficiency'},
  {id: 'comfort', label: 'Comfort', accessor: 'comfort'},
  {id: 'reliability', label: 'Reliability', accessor: 'reliability'},
];
type Point = {id: string; series: number; dimension: number; x: number; y: number; color: string};
type Drag = {
  id: number;
  x: number;
  y: number;
  cx: number;
  cy: number;
  before: string[];
  start: Point | null;
  add: boolean;
  remove: boolean;
  moved: boolean;
  held: boolean;
};
function App() {
  const [target, setTarget] = useState<'point' | 'dimension'>('point');
  const [light, setLight] = useState(false),
    [compact, setCompact] = useState(false),
    [enabled, setEnabled] = useState(true),
    [identify, setIdentify] = useState(false),
    [identified, setIdentified] = useState('');
  const [selected, setSelected] = useState<string[]>([]),
    [reading, setReading] = useState<Point | null>(null),
    [pinned, setPinned] = useState<number | null>(null),
    [legend, setLegend] = useState<number | null>(null),
    [details, setDetails] = useState<Point | null>(null),
    [pulse, setPulse] = useState<{point: Point; serial: number} | null>(null),
    [box, setBox] = useState<{x: number; y: number; width: number; height: number} | null>(null),
    [svg, setSvg] = useState<SVGSVGElement | null>(null),
    [points, setPoints] = useState<Point[]>([]),
    [labels, setLabels] = useState<DOMRect[]>([]),
    [scale, setScale] = useState(1);
  const host = useRef<HTMLDivElement>(null),
    drag = useRef<Drag | null>(null),
    hold = useRef<ReturnType<typeof setTimeout> | undefined>(undefined),
    timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined),
    serial = useRef(0),
    keyboard = useRef(false);
  const key = (p: Point) => (target === 'dimension' ? dimensions[p.dimension]!.id : p.id);
  const cancel = () => {
    clearTimeout(hold.current);
    if (drag.current) setSelected(drag.current.before);
    drag.current = null;
    setBox(null);
  };
  useLayoutEffect(() => {
    const el = host.current!.querySelector<SVGSVGElement>('[data-wcl-chart-svg]')!;
    setSvg(el);
    const sync = () => {
      const matrix = el.getScreenCTM();
      setScale(matrix ? Math.hypot(matrix.a, matrix.b) : 1);
      setPoints(
        [...el.querySelectorAll<SVGGElement>('[data-wcl-radar-series]')].flatMap((g, series) =>
          [...g.querySelectorAll<SVGCircleElement>('[data-wcl-radar-point]')].map(
            (c, dimension) => ({
              id: `${data[series]!.id}:${dimensions[dimension]!.id}`,
              series,
              dimension,
              x: Number(c.getAttribute('cx')),
              y: Number(c.getAttribute('cy')),
              color: getComputedStyle(c).stroke,
            }),
          ),
        ),
      );
      setLabels(
        [...el.querySelectorAll<SVGTextElement>('[data-wcl-radar-spoke] text')].map((t) =>
          t.getBBox(),
        ),
      );
    };
    sync();
    const resize = new ResizeObserver(sync);
    resize.observe(el);
    return () => {
      resize.disconnect();
      clearTimeout(hold.current);
      clearTimeout(timer.current);
    };
  }, [light, compact]);
  const active = reading?.series ?? pinned ?? legend;
  useLayoutEffect(() => {
    host.current?.querySelectorAll('[data-wcl-radar-series]').forEach((g, i) => {
      g.toggleAttribute('data-active', active === i);
      g.toggleAttribute('data-muted', active !== null && active !== i);
    });
    host.current?.querySelectorAll('[data-wcl-chart-legend] li').forEach((g, i) => {
      g.toggleAttribute('data-emphasized', active === i);
      g.toggleAttribute('data-muted', active !== null && active !== i);
    });
  });
  const coords = (x: number, y: number) => {
    const matrix = svg?.getScreenCTM();
    const p = matrix ? new DOMPoint(x, y).matrixTransform(matrix.inverse()) : {x, y};
    return {x: p.x, y: p.y};
  };
  const hit = (p: {x: number; y: number}): Point | null => {
    const dx = p.x - 240,
      dy = p.y - 240;
    if (Math.hypot(dx, dy) > 210) return null;
    const dimension =
      Math.round(
        (((Math.atan2(dy, dx) + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2)) *
          dimensions.length,
      ) % dimensions.length;
    const shapes = [...svg!.querySelectorAll<SVGPolygonElement>('[data-wcl-radar-area]')];
    const candidates = shapes.flatMap((shape, series) => {
      const point = points.find((v) => v.series === series && v.dimension === dimension)!;
      const near = Math.hypot(point.x - p.x, point.y - p.y) < 14;
      return shape.isPointInFill(new DOMPoint(p.x, p.y)) ||
        shape.isPointInStroke(new DOMPoint(p.x, p.y)) ||
        near
        ? [point]
        : [];
    });
    return candidates.find((c) => c.series === (pinned ?? legend)) ?? candidates.at(-1) ?? null;
  };
  const activate = (p: Point) => {
    setDetails(p);
    setPulse({point: p, serial: ++serial.current});
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPulse(null), 650);
  };
  const choose = (p: Point, modified = false) => {
    if (!enabled || modified) activate(p);
    else
      setSelected((old) =>
        old.includes(key(p)) ? old.filter((id) => id !== key(p)) : [...old, key(p)],
      );
  };
  const targetPoints = (p: Point) =>
    target === 'point' ? [p] : points.filter((v) => v.dimension === p.dimension);
  const name = (id: string) => {
    const p = points.find((p) => key(p) === id);
    return p
      ? `${target === 'point' ? data[p.series]!.label + ' · ' : ''}${dimensions[p.dimension]!.label}`
      : id;
  };
  const legendIndex = (el: Element) => {
    const b = el.closest('[data-wcl-chart-legend-button]');
    return b
      ? [...host.current!.querySelectorAll('[data-wcl-chart-legend-button]')].indexOf(b)
      : null;
  };
  const read = (p: Point | null) => {
    keyboard.current = false;
    setReading(p);
  };
  return (
    <AppearanceProvider appearance={light ? 'light' : 'dark'} accent="#2878ff">
      <main
        className="study"
        onPointerOver={(e) => {
          if (identify)
            setIdentified(
              (e.target as Element).closest('[data-name]')?.getAttribute('data-name') ?? '',
            );
        }}
        onFocus={(e) => {
          if (identify)
            setIdentified(
              (e.target as Element).closest('[data-name]')?.getAttribute('data-name') ?? '',
            );
        }}
      >
        <header>
          <p className="kicker">Interaction study</p>
          <h1>Selecting radar values</h1>
          <p>Choose one profile’s value, or a whole dimension across both profiles.</p>
        </header>
        <section className="controls" aria-label="Example settings">
          <div data-name="Selection target">
            <SegmentedControl
              label="Selection target"
              value={target}
              onChange={(v) => {
                cancel();
                setTarget(v);
                setSelected([]);
                setPulse(null);
                setDetails(null);
              }}
              options={[
                {label: 'Point', value: 'point'},
                {label: 'Dimension', value: 'dimension'},
              ]}
            />
          </div>
          <div className="toggles">
            <ToggleButton
              isSelected={enabled}
              onChange={(v) => {
                cancel();
                setEnabled(v);
              }}
            >
              Selection
            </ToggleButton>
            <ToggleButton
              isSelected={light}
              onChange={(v) => {
                cancel();
                setLight(v);
              }}
            >
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
            <ToggleButton isSelected={identify} onChange={setIdentify}>
              Identify elements
            </ToggleButton>
          </div>
        </section>
        <p className="hint">
          {enabled
            ? 'Click or tap selects. Control/Command-click or press and hold opens details.'
            : 'Click or tap opens details.'}{' '}
          Drag a box to select value centers inside it.{' '}
          {target === 'dimension'
            ? 'A dimension qualifies when any of its value centers is inside. '
            : ''}
          Shift or Control/Command adds; Alt removes; Escape cancels.
        </p>
        <section
          className="example"
          data-compact={compact ? '' : undefined}
          data-name="Radar chart"
        >
          <div
            ref={host}
            className="chart-adapter"
            onMouseOverCapture={(e) => {
              const i = legendIndex(e.target as Element);
              if (i !== null) {
                setReading(null);
                setLegend(i);
              }
            }}
            onMouseOutCapture={(e) => {
              const i = legendIndex(e.target as Element);
              if (
                i !== null &&
                !(
                  e.relatedTarget instanceof Node &&
                  (e.target as Element).closest('button')?.contains(e.relatedTarget)
                )
              )
                setLegend(null);
            }}
            onFocusCapture={(e) => {
              const i = legendIndex(e.target as Element);
              if (i !== null) {
                setReading(null);
                setLegend(i);
              }
              if ((e.target as Element).matches('[data-wcl-chart-canvas]')) {
                e.stopPropagation();
                if (!drag.current) setReading(points[0] ?? null);
              }
            }}
            onClickCapture={(e) => {
              const i = legendIndex(e.target as Element);
              if (i !== null) {
                e.stopPropagation();
                setPinned(pinned === i ? null : i);
                setReading(null);
                return;
              }
              if ((e.target as Element).closest('[data-wcl-chart-svg]')) {
                e.stopPropagation();
                e.preventDefault();
              }
            }}
            onPointerDownCapture={(e) => {
              if (!(e.target as Element).closest('[data-wcl-chart-svg]') || e.button !== 0) return;
              e.stopPropagation();
              e.preventDefault();
              const p = coords(e.clientX, e.clientY),
                item = hit(p);
              drag.current = {
                id: e.pointerId,
                x: p.x,
                y: p.y,
                cx: e.clientX,
                cy: e.clientY,
                before: selected,
                start: item,
                add: e.shiftKey || e.ctrlKey || e.metaKey,
                remove: e.altKey,
                moved: false,
                held: false,
              };
              read(item);
              host
                .current!.querySelector<HTMLElement>('[data-wcl-chart-canvas]')!
                .focus({preventScroll: true});
              e.currentTarget.setPointerCapture(e.pointerId);
              if (enabled && e.pointerType === 'touch' && item)
                hold.current = setTimeout(() => {
                  if (drag.current) {
                    drag.current.held = true;
                    activate(item);
                  }
                }, 500);
            }}
            onPointerMoveCapture={(e) => {
              if (!(e.target as Element).closest('[data-wcl-chart-svg]') && !drag.current) return;
              e.stopPropagation();
              const p = coords(e.clientX, e.clientY),
                d = drag.current;
              read(hit(p));
              if (!d || d.held) return;
              if (!d.moved && Math.hypot(e.clientX - d.cx, e.clientY - d.cy) < 5) return;
              clearTimeout(hold.current);
              d.moved = true;
              if (!enabled) return;
              const end = {x: Math.max(0, Math.min(480, p.x)), y: Math.max(0, Math.min(480, p.y))};
              const rect = {
                x: Math.min(d.x, end.x),
                y: Math.min(d.y, end.y),
                width: Math.abs(d.x - end.x),
                height: Math.abs(d.y - end.y),
              };
              setBox(rect);
              const ids = [
                ...new Set(
                  points
                    .filter(
                      (p) =>
                        p.x >= rect.x &&
                        p.x <= rect.x + rect.width &&
                        p.y >= rect.y &&
                        p.y <= rect.y + rect.height,
                    )
                    .map(key),
                ),
              ];
              setSelected(
                d.remove
                  ? d.before.filter((id) => !ids.includes(id))
                  : d.add
                    ? [...new Set([...d.before, ...ids])]
                    : ids,
              );
            }}
            onPointerUpCapture={(e) => {
              const d = drag.current;
              if (!d) return;
              e.stopPropagation();
              clearTimeout(hold.current);
              drag.current = null;
              setBox(null);
              if (e.currentTarget.hasPointerCapture(e.pointerId))
                e.currentTarget.releasePointerCapture(e.pointerId);
              if (!d.moved && !d.held) {
                const p = hit(coords(e.clientX, e.clientY));
                if (p && d.start && key(p) === key(d.start)) choose(p, e.ctrlKey || e.metaKey);
              }
            }}
            onPointerCancelCapture={cancel}
            onLostPointerCapture={() => {
              if (drag.current) cancel();
            }}
            onPointerLeave={() => {
              if (!drag.current) setReading(null);
            }}
            onKeyDownCapture={(e) => {
              if (e.key === 'Tab') keyboard.current = true;
              if (!(e.target as Element).matches('[data-wcl-chart-canvas]')) return;
              e.stopPropagation();
              if (e.key === 'Escape') {
                e.preventDefault();
                cancel();
                setReading(null);
                setPinned(null);
                return;
              }
              if (
                ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)
              ) {
                e.preventDefault();
                const dim = reading?.dimension ?? 0,
                  series = reading?.series ?? 0;
                const nextDim =
                  e.key === 'Home'
                    ? 0
                    : e.key === 'End'
                      ? 4
                      : e.key === 'ArrowLeft'
                        ? (dim + 4) % 5
                        : e.key === 'ArrowRight'
                          ? (dim + 1) % 5
                          : dim;
                const nextSeries =
                  e.key === 'ArrowUp' || e.key === 'ArrowDown' ? (series + 1) % 2 : series;
                setReading(
                  points.find((p) => p.dimension === nextDim && p.series === nextSeries) ?? null,
                );
              } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                choose(reading ?? points[0]!, e.ctrlKey || e.metaKey);
              }
            }}
          >
            <RadarChart
              data={data}
              dimensions={dimensions}
              idAccessor="id"
              labelAccessor="label"
              title="Vehicle profiles"
              description="Courier and Scout scores across five shared qualities."
              dataTableLabel="Profile scores"
              emptyState={{title: 'No profiles', description: 'Choose profiles.'}}
              invalidData={{title: 'Invalid scores', description: 'Check the scores.'}}
              labels={{dimension: 'Quality'}}
              value={{label: 'Score', unit: 'points'}}
              legend={{label: 'Vehicle profiles'}}
            />
            {svg
              ? createPortal(
                  <g className="radar-overlays" pointerEvents="none">
                    {reading ? (
                      <line
                        className="reading-spoke"
                        x1={240}
                        y1={240}
                        x2={reading.x}
                        y2={reading.y}
                      />
                    ) : null}
                    {enabled && target === 'point'
                      ? points
                          .filter((p) => selected.includes(p.id))
                          .map((p) => (
                            <circle
                              key={p.id}
                              data-name="Selected value ring"
                              className="selected-point"
                              cx={p.x}
                              cy={p.y}
                              r={4 + ((active === p.series ? 3 : 2) / 2 + 1) / scale}
                            />
                          ))
                      : null}
                    {enabled && target === 'dimension'
                      ? dimensions.map((d, i) => {
                          if (!selected.includes(d.id)) return null;
                          const b = labels[i];
                          return b ? (
                            <line
                              key={d.id}
                              className="selected-dimension"
                              x1={b.x}
                              x2={b.x + b.width}
                              y1={b.y + b.height + 5}
                              y2={b.y + b.height + 5}
                            />
                          ) : null;
                        })
                      : null}
                    {reading
                      ? targetPoints(reading).map((p) => (
                          <circle
                            key={p.id}
                            className="reading-center"
                            cx={p.x}
                            cy={p.y}
                            r={Math.max(0, 4 - ((active === p.series ? 3 : 2) / 2 - 0.2) / scale)}
                          />
                        ))
                      : null}
                    {pulse ? (
                      target === 'dimension' ? (
                        (() => {
                          const end = targetPoints(pulse.point).reduce((a, b) =>
                            Math.hypot(a.x - 240, a.y - 240) > Math.hypot(b.x - 240, b.y - 240)
                              ? a
                              : b,
                          );
                          return (
                            <line
                              key={pulse.serial}
                              className="dimension-pulse"
                              x1={240}
                              y1={240}
                              x2={end.x}
                              y2={end.y}
                            />
                          );
                        })()
                      ) : (
                        <g key={pulse.serial} className="pulse">
                          {targetPoints(pulse.point).map((p) => (
                            <circle
                              key={p.id}
                              className="activation-point"
                              cx={p.x}
                              cy={p.y}
                              r={14}
                            />
                          ))}
                        </g>
                      )
                    ) : null}
                    {box ? <rect className="drag-box" {...box} /> : null}
                  </g>,
                  svg,
                )
              : null}
          </div>
          <div className="reading" aria-live="polite" data-name="Current reading">
            {reading
              ? `${dimensions[reading.dimension]!.label}: ${targetPoints(reading)
                  .map(
                    (p) =>
                      `${data[p.series]!.label} ${data[p.series]![dimensions[p.dimension]!.accessor as keyof Profile]} points`,
                  )
                  .join(' · ')}`
              : 'Hover a profile to read its value.'}
          </div>
        </section>
        <section className="results" data-name="Selected values">
          <p>
            {selected.length
              ? `${selected.length} selected: ${selected.map(name).join(', ')}`
              : 'Nothing selected'}
          </p>
          <Button variant="quiet" onPress={() => setSelected([])} isDisabled={!selected.length}>
            Clear selection
          </Button>
        </section>
        {details ? (
          <section className="details" data-name="Opened details">
            <h2>{dimensions[details.dimension]!.label}</h2>
            <p>
              {targetPoints(details)
                .map(
                  (p) =>
                    `${data[p.series]!.label}: ${data[p.series]![dimensions[p.dimension]!.accessor as keyof Profile]} points`,
                )
                .join(' · ')}
            </p>
            <Button variant="quiet" onPress={() => setDetails(null)}>
              Close details
            </Button>
          </section>
        ) : null}
        <p className="hint">
          Legend focus or pinning chooses between overlapping profiles. Hovering a profile on its
          own still highlights that profile. Left/Right moves between dimensions; Up/Down switches
          profiles. Enter selects; Control/Command-Enter opens details.
        </p>
        {identify ? (
          <output className="identifier">
            {identified || 'Hover or focus an element to identify it.'}
          </output>
        ) : null}
      </main>
    </AppearanceProvider>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
