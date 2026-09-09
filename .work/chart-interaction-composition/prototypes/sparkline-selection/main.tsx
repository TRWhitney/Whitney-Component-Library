// Isolated interaction study, not the public Sparkline API.
import {useLayoutEffect, useMemo, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {createPortal} from 'react-dom';
import {AppearanceProvider, Sparkline, ToggleButton, Button} from '../../../../src/index.js';
import {useChartInteraction} from '../../../../src/charts/chart-interaction.js';
import {chartActivationPointRadius} from '../../../../src/charts/chart-activation.js';
import '../../../../src/styles.css';
import './styles.css';
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
function App() {
  const [light, setLight] = useState(false),
    [compact, setCompact] = useState(true),
    [dense, setDense] = useState(false),
    [gap, setGap] = useState(false),
    [enabled, setEnabled] = useState(true),
    [identify, setIdentify] = useState(false),
    [identified, setIdentified] = useState('');
  const [active, setActive] = useState<number | null>(null),
    [details, setDetails] = useState<{
      label: string;
      value: number;
      input: string;
      serial: number;
    } | null>(null);
  const [svg, setSvg] = useState<SVGSVGElement | null>(null),
    [scale, setScale] = useState(1);
  const host = useRef<HTMLDivElement>(null),
    pointerFocus = useRef(false),
    cursor = useRef(0),
    keyboardMode = useRef(false),
    sequence = useRef(0);
  const data = useMemo(
    () =>
      (dense
        ? Array.from({length: 24}, (_, i) => 22 + ((i * 17) % 47))
        : [42, 68, 22, 48, 68, 35, 58]
      ).map((value, index) => ({
        id: `reading-${index}`,
        index,
        label: dense ? `${String(index).padStart(2, '0')}:00` : days[index]!,
        value: gap && index === Math.floor((dense ? 24 : 7) / 2) ? undefined : value,
      })),
    [dense, gap],
  );
  const rows = data
    .filter((d) => d.value !== undefined)
    .map((d) => ({
      id: d.id,
      datum: d,
      category: d.label,
      values: [{seriesId: 'load', label: 'Load', value: d.value!, hidden: false}],
    }));
  const actions = useChartInteraction(
    {
      target: 'category',
      ...(enabled
        ? {
            selection: {
              labels: {
                instructions: 'Select readings',
                clear: 'Clear selection',
                empty: 'None',
                summary: (n: number) => `${n} selected`,
                item: (item: {rowId: string}) => item.rowId,
                hidden: (s: string) => s,
              },
            },
          }
        : {}),
      onActivate: (event) =>
        setDetails({
          label: event.datum.label,
          value: event.datum.value!,
          input: event.input,
          serial: ++sequence.current,
        }),
    },
    rows,
    JSON.stringify([compact, dense, gap, enabled, scale]),
    data,
  );
  const x = (i: number) => 12 + (i / (data.length - 1)) * 616,
    y = (i: number) => 150 - (data[i].value ?? 50) * 1.4;
  const points = rows.map((row) => ({
    item: {rowId: row.id},
    seriesId: 'load',
    index: row.datum.index,
    categoryPosition: x(row.datum.index),
    x: x(row.datum.index),
    y: y(row.datum.index),
  }));
  useLayoutEffect(() => {
    const node = host.current!.querySelector<SVGSVGElement>('[data-wcl-sparkline-svg]')!;
    setSvg(node);
    const measure = () => {
      const m = node.getScreenCTM();
      if (m) setScale(Math.hypot(m.a, m.b));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const reset = () => {
    actions.cancel();
    actions.change([]);
    setDetails(null);
    setActive(null);
    cursor.current = 0;
  };
  const location = (event: {clientX: number; clientY: number}) => {
    const m = svg?.getScreenCTM();
    if (!m) return null;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
    const index = Math.max(
      0,
      Math.min(data.length - 1, Math.round(((p.x - 12) / 616) * (data.length - 1))),
    );
    const inside = p.x >= 12 && p.x <= 628 && p.y >= 10 && p.y <= 150;
    return {
      x: p.x,
      y: p.y,
      index,
      inside,
      point: inside ? points.find((point) => point.index === index) : undefined,
    };
  };
  const identifyTarget = (target: EventTarget | null) => {
    if (!identify) return;
    if (target instanceof Element)
      setIdentified(target.closest('[data-study-name]')?.getAttribute('data-study-name') ?? '');
  };
  const selected = new Set(actions.selected.map((item) => item.rowId));
  const cueRadius = (index: number) => {
    const circle = svg?.querySelector<SVGCircleElement>(
      `[data-row-index="${index}"] [data-wcl-sparkline-cue-outline]`,
    );
    return circle ? Number(circle.getAttribute('r')) : 4.5 / scale;
  };
  return (
    <AppearanceProvider appearance={light ? 'light' : 'dark'} accent="#2878ff">
      <main
        className="study"
        onPointerOver={(event) => identifyTarget(event.target)}
        onFocus={(event) => identifyTarget(event.target)}
      >
        <header>
          <p className="kicker">Chart interaction study</p>
          <h1>Sparkline selection</h1>
          <p>Try selecting readings without losing the highs, lows, or latest-value cues.</p>
        </header>
        <div className="controls" data-study-name="Display and interaction controls">
          <ToggleButton
            isSelected={enabled}
            onChange={(value) => {
              reset();
              setEnabled(value);
            }}
          >
            Selection enabled
          </ToggleButton>
          <ToggleButton
            isSelected={compact}
            onChange={(value) => {
              actions.cancel();
              setCompact(value);
            }}
          >
            Compact
          </ToggleButton>
          <ToggleButton
            isSelected={dense}
            onChange={(value) => {
              reset();
              setDense(value);
            }}
          >
            More readings
          </ToggleButton>
          <ToggleButton
            isSelected={gap}
            onChange={(value) => {
              reset();
              setGap(value);
            }}
          >
            Include a gap
          </ToggleButton>
          <ToggleButton isSelected={light} onChange={setLight}>
            Light appearance
          </ToggleButton>
          <ToggleButton isSelected={identify} onChange={setIdentify}>
            Identify elements
          </ToggleButton>
        </div>
        <p className="hint">
          {enabled
            ? 'Click or tap to select a reading. Drag across time to select a range. Shift or Control/Command adds; Alt removes. Control/Command-click or press and hold opens details without changing selection.'
            : 'Click or tap a reading to open details.'}{' '}
          Arrow keys read; Home/End jump to the ends. Enter/Space{' '}
          {enabled ? 'selects; add Control/Command to open details' : 'opens details'}. Escape
          cancels a drag. Gaps remain readable; selection includes recorded values.
        </p>
        <section className="example" data-compact={compact ? '' : undefined}>
          <div
            ref={host}
            className="chart-adapter"
            data-study-name="Sparkline plot"
            data-dragging={actions.box ? '' : undefined}
            onFocusCapture={(event) => {
              if (pointerFocus.current) {
                event.stopPropagation();
                return;
              }
              if (
                event.target instanceof Element &&
                event.target.hasAttribute('data-wcl-sparkline-canvas')
              ) {
                keyboardMode.current = true;
                cursor.current = 0;
                setActive(0);
              }
            }}
            onPointerDownCapture={(event) => {
              if (!svg || event.button !== 0 || event.isPrimary === false) return;
              const p = location(event);
              if (!p?.inside) return;
              keyboardMode.current = false;
              pointerFocus.current = true;
              event.preventDefault();
              host
                .current!.querySelector<HTMLElement>('[data-wcl-sparkline-canvas]')!
                .focus({preventScroll: true});
              cursor.current = p.index;
              setActive(p.index);
              actions.begin({...event, currentTarget: svg}, p.point, p.x, p.y);
            }}
            onPointerMoveCapture={(event) => {
              if (
                !(event.target instanceof Element) ||
                !event.target.closest('[data-wcl-sparkline-svg]')
              )
                return;
              keyboardMode.current = false;
              const p = location(event);
              if (!p) return;
              if (
                actions.move(event, p.x, p.y, points, {left: 12, right: 628, top: 10, bottom: 150})
              ) {
                event.stopPropagation();
                setActive(null);
                return;
              }
              setActive(p.inside ? p.index : null);
              if (p.inside) {
                cursor.current = p.index;
                if (identify) setIdentified(`Sparkline reading / ${data[p.index].label}`);
              }
            }}
            onPointerUpCapture={(event) => {
              const p = location(event);
              actions.end(event, p?.point);
              pointerFocus.current = false;
            }}
            onPointerCancelCapture={() => {
              actions.cancel();
              pointerFocus.current = false;
            }}
            onLostPointerCapture={() => {
              actions.cancel();
              pointerFocus.current = false;
            }}
            onPointerLeave={() => {
              if (!keyboardMode.current && !actions.isDragging()) setActive(null);
            }}
            onBlurCapture={() => {
              keyboardMode.current = false;
              actions.cancel();
              setActive(null);
            }}
            onContextMenuCapture={(event) => {
              if (actions.isHolding() || actions.isDragging()) event.preventDefault();
            }}
            onKeyDownCapture={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.stopPropagation();
                const row = data[active ?? cursor.current];
                if (row.value !== undefined)
                  actions.activate({rowId: row.id}, 'keyboard', event.ctrlKey || event.metaKey);
                return;
              }
              if (event.key === 'Escape') {
                actions.cancel();
                setActive(null);
                return;
              }
              let next = active ?? cursor.current;
              if (event.key === 'ArrowRight') next = Math.min(data.length - 1, next + 1);
              else if (event.key === 'ArrowLeft') next = Math.max(0, next - 1);
              else if (event.key === 'Home') next = 0;
              else if (event.key === 'End') next = data.length - 1;
              else return;
              keyboardMode.current = true;
              cursor.current = next;
              setActive(next);
            }}
          >
            <Sparkline
              data={data}
              position={{
                accessor: 'index',
                label: 'Time',
                scale: {type: 'linear', domain: [0, data.length - 1]},
                formatValue: (value) => data[value]?.label ?? String(value),
              }}
              value={{accessor: 'value', label: 'Load', unit: '%'}}
              valueRange={[0, 100]}
              title="Server load"
              description={dense ? 'A day of hourly readings.' : 'A week of daily readings.'}
              dataTableLabel="Recorded server load"
              emptyState={{title: 'No readings', description: 'Choose a recorded period.'}}
              invalidData={{title: 'Invalid readings', description: 'Check the values.'}}
              labels={{
                first: 'First',
                last: 'Latest',
                lowest: 'Low',
                highest: 'High',
                missing: 'No reading',
              }}
            />
            {svg
              ? createPortal(
                  <g className="study-overlay">
                    {points
                      .filter((point) => selected.has(point.item.rowId))
                      .map((point) => {
                        const r = cueRadius(point.index),
                          hasCue = !!svg.querySelector(
                            `[data-row-index="${point.index}"][data-wcl-sparkline-cue]`,
                          );
                        return (
                          <g key={point.item.rowId} data-study-selected={point.index}>
                            {!hasCue ? (
                              <circle
                                className="selected-point"
                                data-active={active === point.index ? '' : undefined}
                                cx={point.x}
                                cy={point.y}
                                r={r}
                              />
                            ) : null}
                            <circle
                              className="selection-ring"
                              cx={point.x}
                              cy={point.y}
                              r={r + 2.125 / scale}
                            />
                          </g>
                        );
                      })}
                    {actions.pulse
                      ? points
                          .filter((point) => point.item.rowId === actions.pulse!.item.rowId)
                          .map((point) => (
                            <circle
                              key={actions.pulse!.sequence}
                              cx={point.x}
                              cy={point.y}
                              r={chartActivationPointRadius / scale}
                              data-wcl-chart-activation-dot=""
                            />
                          ))
                      : null}
                    {actions.box ? <rect {...actions.box} data-wcl-chart-selection-box="" /> : null}
                  </g>,
                  svg,
                )
              : null}
          </div>
        </section>
        <p className="reading" data-study-name="Current reading" aria-live="polite">
          {active === null
            ? 'Hover or use the arrow keys to read a value.'
            : `${data[active].label}: ${data[active].value === undefined ? 'No reading' : `${data[active].value}%`}`}
        </p>
        <div className="results" data-study-name="Selection summary">
          <p>
            {enabled && actions.selected.length
              ? `Selected: ${data
                  .filter((row) => selected.has(row.id))
                  .map((row) => row.label)
                  .join(', ')}`
              : 'Nothing selected'}
          </p>
          <Button
            variant="quiet"
            isDisabled={!actions.selected.length}
            onPress={() => actions.change([])}
          >
            Clear selection
          </Button>
        </div>
        {details ? (
          <div className="details" data-study-name="Opened details" role="status">
            <strong>{details.label} details</strong>
            <p>Recorded load: {details.value}%</p>
            <p>
              Opened {details.serial} {details.serial === 1 ? 'time' : 'times'} · {details.input}
            </p>
          </div>
        ) : null}
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
