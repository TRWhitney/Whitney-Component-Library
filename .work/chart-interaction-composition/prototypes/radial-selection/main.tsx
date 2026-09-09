// Accepted interaction study, isolated from production rendering.
import {useLayoutEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {createPortal} from 'react-dom';
import {arc} from 'd3-shape';
import {
  AppearanceProvider,
  PieChart,
  DonutChart,
  SegmentedControl,
  ToggleButton,
  Button,
  type Appearance,
} from '../../../../src/index.js';
import '../../../../src/styles.css';
import './styles.css';
const data = [
  {id: 'homes', label: 'Homes', value: 43},
  {id: 'offices', label: 'Offices', value: 26},
  {id: 'shops', label: 'Shops', value: 18},
  {id: 'schools', label: 'Schools', value: 12},
  {id: 'hospital', label: 'Hospital', value: 9},
  {id: 'water', label: 'Water treatment', value: 7},
  {id: 'lighting', label: 'Street lighting', value: 5},
  {id: 'transit', label: 'Transit', value: 4},
  {id: 'library', label: 'Library', value: 3},
  {id: 'leisure', label: 'Leisure center', value: 2},
];
type Mark = {
  id: string;
  group: SVGGElement;
  path: SVGPathElement;
  start: number;
  end: number;
  aggregate: boolean;
};
type Drag = {
  pointer: number;
  x: number;
  y: number;
  before: string[];
  visited: Set<string>;
  add: boolean;
  remove: boolean;
  moved: boolean;
  held: boolean;
  start: Mark | null;
  lastX: number;
  lastY: number;
};
function App() {
  const [kind, setKind] = useState<'pie' | 'donut'>('donut'),
    [appearance, setAppearance] = useState<Appearance>('dark');
  const [selection, setSelection] = useState(true),
    [compact, setCompact] = useState(false),
    [identify, setIdentify] = useState(false),
    [identified, setIdentified] = useState('');
  const [selected, setSelected] = useState<string[]>([]),
    [reading, setReading] = useState<string | null>(null),
    [legend, setLegend] = useState<string | null>(null),
    [pinned, setPinned] = useState<string | null>(null),
    [opened, setOpened] = useState<string | null>(null),
    [pulse, setPulse] = useState<{id: string; serial: number} | null>(null),
    [marks, setMarks] = useState<Mark[]>([]);
  const host = useRef<HTMLDivElement>(null),
    drag = useRef<Drag | null>(null),
    hold = useRef<ReturnType<typeof setTimeout> | undefined>(undefined),
    timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined),
    skipClick = useRef(false),
    nativeClick = useRef(false),
    serial = useRef(0);
  const cancel = () => {
    clearTimeout(hold.current);
    if (drag.current) setSelected(drag.current.before);
    drag.current = null;
  };
  useLayoutEffect(() => {
    const el = host.current!;
    const sync = () => {
      let angle = -Math.PI / 2;
      const next = [...el.querySelectorAll<SVGGElement>('[data-wcl-radial-segment]')].map(
        (group) => {
          const start = angle;
          angle += Number(group.dataset.angleSize);
          return {
            id: group.dataset.segmentId!,
            group,
            path: group.querySelector<SVGPathElement>('[data-wcl-radial-slice]')!,
            start,
            end: angle,
            aggregate: group.hasAttribute('data-aggregate'),
          };
        },
      );
      setMarks(next);
      setReading(null);
      setLegend(null);
      setPinned(null);
      cancel();
    };
    sync();
    const observer = new MutationObserver((records) => {
      if (
        records.some((record) =>
          [...record.addedNodes, ...record.removedNodes].some(
            (node) => node instanceof Element && node.matches('[data-wcl-radial-segment]'),
          ),
        )
      )
        sync();
    });
    observer.observe(el.querySelector('[data-wcl-chart-svg]')!, {childList: true, subtree: true});
    return () => {
      observer.disconnect();
      clearTimeout(hold.current);
      clearTimeout(timer.current);
    };
  }, [kind]);
  const active = reading ?? pinned ?? legend;
  const lastVisible = Math.max(
    -1,
    ...marks.filter((m) => !m.aggregate).map((m) => data.findIndex((d) => d.id === m.id)),
  );
  const selectedInside =
    selection &&
    marks.some((m) => m.aggregate) &&
    data.slice(lastVisible + 1).some((d) => selected.includes(d.id));
  useLayoutEffect(() => {
    for (const m of marks) {
      const on = m.id === active,
        angle = (m.start + m.end) / 2 - Math.PI / 2;
      m.group.style.transform = `translate(${on ? Math.cos(angle) * 9 : 0}px,${on ? Math.sin(angle) * 9 : 0}px)`;
      m.group.toggleAttribute('data-active', on);
      m.group.toggleAttribute('data-muted', active !== null && !on);
      if (m.aggregate) {
        const label = m.group.querySelector('[data-wcl-radial-aggregate-label]');
        const count = `+${data.length - lastVisible - 1}${selectedInside ? '*' : ''}`;
        if (label && label.textContent !== count) label.textContent = count;
        label?.setAttribute('data-name', 'Expansion count');
        const button = host.current?.querySelectorAll('[data-wcl-chart-legend-button]')[
          marks.indexOf(m)
        ];
        if (selectedInside)
          button?.setAttribute(
            'aria-label',
            `${button.textContent}. Contains selected categories.`,
          );
        else button?.removeAttribute('aria-label');
      }
    }
  });
  const hit = (x: number, y: number) => {
    for (const m of [...marks].reverse()) {
      const matrix = m.path.getScreenCTM();
      if (matrix && m.path.isPointInFill(new DOMPoint(x, y).matrixTransform(matrix.inverse())))
        return m;
    }
    return null;
  };
  const activate = (m: Mark) => {
    if (m.aggregate) {
      nativeClick.current = true;
      m.path.dispatchEvent(new MouseEvent('click', {bubbles: true}));
      nativeClick.current = false;
      return;
    }
    setOpened(m.id);
    setPulse({id: m.id, serial: ++serial.current});
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPulse(null), 650);
  };
  const choose = (m: Mark, activation = false) => {
    if (m.aggregate || activation || !selection) activate(m);
    else
      setSelected((old) => (old.includes(m.id) ? old.filter((id) => id !== m.id) : [...old, m.id]));
  };
  const visited = (d: Drag) => {
    const ids = [...d.visited];
    setSelected(
      d.remove
        ? d.before.filter((id) => !d.visited.has(id))
        : d.add
          ? [...new Set([...d.before, ...ids])]
          : ids,
    );
  };
  const outline = (m: Mark, type: 'selected' | 'reading' | 'pulse') => {
    const inner = kind === 'donut' ? 78 : 0,
      scale = m.path.getScreenCTM()?.a ?? 1;
    const pad = 3 / Math.abs(scale);
    let path = m.path.getAttribute('d')!;
    if (type === 'reading')
      path = arc()({
        startAngle: m.start,
        endAngle: m.end,
        innerRadius: inner ? inner + pad : pad * 1.5,
        outerRadius: 140 - pad,
        padAngle: Math.min((m.end - m.start) / 4, pad / 140),
      })!;
    if (type === 'selected') {
      const r = 140 + 5 / Math.abs(scale),
        a = m.start - Math.PI / 2,
        b = m.end - Math.PI / 2;
      path = `M${Math.cos(a) * r},${Math.sin(a) * r} A${r},${r} 0 ${b - a > Math.PI ? 1 : 0} 1 ${Math.cos(b) * r},${Math.sin(b) * r}`;
    }
    return <path d={path} data-study-cue={type} data-outline="rim" />;
  };
  const row = data.find((d) => d.id === reading),
    details = data.find((d) => d.id === opened);
  return (
    <AppearanceProvider appearance={appearance} accent="#2878ff">
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
          <h1>Selecting slices</h1>
          <p>Selected slices have an outer-edge marker. Drag across slices to collect them.</p>
        </header>
        <section className="controls" aria-label="Example settings">
          <div data-name="Chart kind">
            <SegmentedControl
              label="Chart"
              value={kind}
              onChange={(v) => {
                cancel();
                setKind(v);
                setPulse(null);
              }}
              options={[
                {label: 'Pie', value: 'pie'},
                {label: 'Donut', value: 'donut'},
              ]}
            />
          </div>
          <div className="toggles">
            <ToggleButton
              isSelected={selection}
              onChange={(v) => {
                cancel();
                setSelection(v);
              }}
            >
              Selection
            </ToggleButton>
            <ToggleButton
              isSelected={appearance === 'light'}
              onChange={(v) => setAppearance(v ? 'light' : 'dark')}
            >
              Light appearance
            </ToggleButton>
            <ToggleButton isSelected={compact} onChange={setCompact}>
              Compact
            </ToggleButton>
            <ToggleButton isSelected={identify} onChange={setIdentify}>
              Identify elements
            </ToggleButton>
          </div>
        </section>
        <p className="hint">
          {selection
            ? 'Click or tap selects. Control/Command-click or press and hold opens details.'
            : 'Click or tap opens details.'}{' '}
          Drag replaces selection; Shift adds, Alt removes, Escape cancels. Arrow keys move through
          slices. Enter selects; Control/Command-Enter opens details.
        </p>
        <section
          className="example"
          data-compact={compact ? '' : undefined}
          data-name="Slice chart"
        >
          <div
            ref={host}
            className="chart-adapter"
            onMouseOverCapture={(e) => {
              const button = (e.target as Element).closest('[data-wcl-chart-legend-button]');
              if (button) {
                const i = [
                  ...host.current!.querySelectorAll('[data-wcl-chart-legend-button]'),
                ].indexOf(button);
                setReading(null);
                setLegend(marks[i]?.id ?? null);
              }
            }}
            onMouseOutCapture={(e) => {
              const button = (e.target as Element).closest('[data-wcl-chart-legend-button]');
              if (button && !(e.relatedTarget instanceof Node && button.contains(e.relatedTarget)))
                setLegend(null);
            }}
            onFocusCapture={(e) => {
              const button = (e.target as Element).closest('[data-wcl-chart-legend-button]');
              if (button) {
                const i = [
                  ...host.current!.querySelectorAll('[data-wcl-chart-legend-button]'),
                ].indexOf(button);
                setReading(null);
                setLegend(marks[i]?.id ?? null);
              }
              if ((e.target as Element).matches('[data-wcl-chart-canvas]')) {
                e.stopPropagation();
                if (!drag.current) setReading(marks[0]?.id ?? null);
              }
            }}
            onClickCapture={(e) => {
              if (nativeClick.current) return;
              const button = (e.target as Element).closest('[data-wcl-chart-legend-button]');
              if (button) {
                e.stopPropagation();
                const i = [
                  ...host.current!.querySelectorAll('[data-wcl-chart-legend-button]'),
                ].indexOf(button);
                const id = marks[i]?.id ?? null;
                setPinned(pinned === id ? null : id);
                setReading(null);
                return;
              }
              if ((e.target as Element).closest('[data-wcl-chart-svg]')) {
                e.stopPropagation();
                e.preventDefault();
                skipClick.current = false;
              }
            }}
            onPointerDownCapture={(e) => {
              if (!(e.target as Element).closest('[data-wcl-chart-svg]') || e.button !== 0) return;
              e.stopPropagation();
              e.preventDefault();
              const m = hit(e.clientX, e.clientY);
              const d: Drag = {
                pointer: e.pointerId,
                x: e.clientX,
                y: e.clientY,
                lastX: e.clientX,
                lastY: e.clientY,
                before: selected,
                visited: new Set(m && !m.aggregate ? [m.id] : []),
                add: e.shiftKey || e.ctrlKey || e.metaKey,
                remove: e.altKey,
                moved: false,
                held: false,
                start: m,
              };
              drag.current = d;
              host.current
                ?.querySelector<HTMLElement>('[data-wcl-chart-canvas]')
                ?.focus({preventScroll: true});
              setReading(m?.id ?? null);
              e.currentTarget.setPointerCapture(e.pointerId);
              if (e.pointerType === 'touch' && m && selection && !m.aggregate)
                hold.current = setTimeout(() => {
                  d.held = true;
                  activate(m);
                }, 500);
            }}
            onPointerMoveCapture={(e) => {
              const svg = (e.target as Element).closest('[data-wcl-chart-svg]');
              const d = drag.current;
              if (!svg && !d) return;
              e.stopPropagation();
              const m = hit(e.clientX, e.clientY);
              setReading(m?.id ?? null);
              if (!d || d.held) return;
              if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 5) return;
              clearTimeout(hold.current);
              d.moved = true;
              if (selection) {
                const steps = Math.ceil(Math.hypot(e.clientX - d.lastX, e.clientY - d.lastY) / 3);
                for (let i = 1; i <= steps; i++) {
                  const p = hit(
                    d.lastX + ((e.clientX - d.lastX) * i) / steps,
                    d.lastY + ((e.clientY - d.lastY) * i) / steps,
                  );
                  if (p && !p.aggregate) d.visited.add(p.id);
                }
                visited(d);
              }
              d.lastX = e.clientX;
              d.lastY = e.clientY;
            }}
            onPointerUpCapture={(e) => {
              const d = drag.current;
              if (!d) return;
              e.stopPropagation();
              clearTimeout(hold.current);
              drag.current = null;
              if (e.currentTarget.hasPointerCapture(e.pointerId))
                e.currentTarget.releasePointerCapture(e.pointerId);
              if (!d.moved && !d.held) {
                const m = hit(e.clientX, e.clientY);
                if (m && m.id === d.start?.id) choose(m, e.ctrlKey || e.metaKey);
              }
              skipClick.current = true;
            }}
            onPointerCancelCapture={() => cancel()}
            onPointerLeave={() => {
              if (!drag.current) setReading(null);
            }}
            onKeyDownCapture={(e) => {
              if (!(e.target as Element).matches('[data-wcl-chart-canvas]')) return;
              const index = Math.max(
                0,
                marks.findIndex((m) => m.id === reading),
              );
              if (e.key === 'Escape') {
                e.stopPropagation();
                e.preventDefault();
                cancel();
                setReading(null);
                setPinned(null);
                return;
              }
              if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
                e.stopPropagation();
                e.preventDefault();
                setReading(
                  marks[
                    e.key === 'Home'
                      ? 0
                      : e.key === 'End'
                        ? marks.length - 1
                        : Math.max(
                            0,
                            Math.min(marks.length - 1, index + (e.key === 'ArrowLeft' ? -1 : 1)),
                          )
                  ]?.id ?? null,
                );
              } else if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                e.preventDefault();
                if (marks[index]) choose(marks[index], e.ctrlKey || e.metaKey);
              }
            }}
          >
            {kind === 'pie' ? (
              <PieChart {...chartProps} />
            ) : (
              <DonutChart {...chartProps} totalLabel="Annual energy" />
            )}
            {marks.map((m) =>
              createPortal(
                <g className="study-overlay" pointerEvents="none">
                  {selection && selected.includes(m.id) ? outline(m, 'selected') : null}
                  {reading === m.id ? outline(m, 'reading') : null}
                  {pulse?.id === m.id ? (
                    <g key={pulse.serial} className="pulse">
                      {outline(m, 'pulse')}
                    </g>
                  ) : null}
                </g>,
                m.group,
                m.id,
              ),
            )}
          </div>
          <div className="reading" aria-live="polite" data-name="Current reading">
            {row
              ? `${row.label} · ${row.value} MWh`
              : reading === 'aggregate'
                ? `More categories · open the next page${selectedInside ? ' · contains selected categories' : ''}`
                : 'Hover a slice to read its value.'}
          </div>
        </section>
        <section className="results" data-name="Selected slices">
          <p>
            {selected.length
              ? `${selected.length} selected: ${selected.map((id) => data.find((d) => d.id === id)?.label).join(', ')}`
              : 'Nothing selected'}
          </p>
          <Button variant="quiet" onPress={() => setSelected([])} isDisabled={!selected.length}>
            Clear selection
          </Button>
        </section>
        {details ? (
          <section className="details" data-name="Opened details" aria-live="polite">
            <h2>{details.label}</h2>
            <p>
              {details.value} MWh of annual energy. Selection is unchanged when you open details.
            </p>
            <Button variant="quiet" onPress={() => setOpened(null)}>
              Close details
            </Button>
          </section>
        ) : null}
        <p className="hint">
          The dashed +N slice opens the next page. It represents navigation, so dragging across it
          does not select the hidden categories. Selected categories remain selected when you change
          pages. An asterisk beside +N means a category inside is selected.
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
const chartProps = {
  data,
  title: 'Community energy use',
  description: 'Annual metered energy by customer category.',
  idAccessor: 'id',
  labelAccessor: 'label',
  value: {accessor: 'value', label: 'Annual energy', unit: 'MWh'},
  dataTableLabel: 'Energy by category',
  emptyState: {title: 'No energy use', description: 'Choose a populated year.'},
  invalidData: {title: 'Invalid energy use', description: 'Check the values.'},
  labels: {
    back: 'Back',
    category: 'Customer category',
    categoryRange: ({start, end, total}: {start: number; end: number; total: number}) =>
      `Categories ${start} to ${end} of ${total}`,
    moreCategories: (n: number) => `More categories (${n})`,
    shareOfTotal: 'Share of total',
    shareOnPage: 'Share on this page',
  },
  legend: {label: 'Visible categories'},
} as const;
createRoot(document.getElementById('root')!).render(<App />);
