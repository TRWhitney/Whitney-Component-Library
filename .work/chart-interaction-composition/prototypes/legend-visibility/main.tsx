// Non-production adapter. Production reading, emphasis, and geometry remain owned by LineChart.
import {scaleLinear} from 'd3-scale';
import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {createRoot} from 'react-dom/client';
import {
  AppearanceProvider,
  LineChart,
  SegmentedControl,
  ToggleButton,
  type Appearance,
  type ChartLineSeries,
  type NonEmptyChartSeries,
} from '../../../../src/index.js';
import '../../../../src/styles.css';
import './styles.css';

const data = [
  {month: 'Jan', revenue: 820, operations: 220, support: 44},
  {month: 'Feb', revenue: 890, operations: 250, support: 51},
  {month: 'Mar', revenue: 960, operations: 235, support: 49},
  {month: 'Apr', revenue: 900, operations: 285, support: 62},
  {month: 'May', revenue: 1100, operations: 310, support: 58},
  {month: 'Jun', revenue: 1200, operations: 295, support: 70},
];
type Datum = (typeof data)[number];
const series = [
  {id: 'revenue', label: 'Revenue', accessor: 'revenue', color: 'accent', showPoints: true},
  {
    id: 'operations',
    label: 'Operating costs',
    accessor: 'operations',
    color: 'series-2',
    showPoints: true,
  },
  {id: 'support', label: 'Support costs', accessor: 'support', color: 'series-3', showPoints: true},
] as const;
type Series = (typeof series)[number];
const appearances = [
  {value: 'light', label: 'Light'},
  {value: 'dark', label: 'Dark'},
] as const;

function useAnimatedMaximum(target: number, immediate: boolean): number {
  const [value, setValue] = useState(target);
  const current = useRef(target);
  useEffect(() => {
    if (immediate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      current.current = target;
      setValue(target);
      return;
    }
    const start = performance.now();
    const from = current.current;
    let frame = 0;
    const animate = (now: number) => {
      const progress = Math.max(0, Math.min(1, (now - start) / 240));
      current.current = from + (target - from) * (1 - (1 - progress) ** 3);
      setValue(current.current);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target, immediate]);
  return value;
}

function Eye({
  item,
  hidden,
  onToggle,
}: {
  item: Series;
  hidden: boolean;
  onToggle: (id: string) => void;
}) {
  const label = `${hidden ? 'Show' : 'Hide'} ${item.label}`;
  return (
    <button
      aria-label={label}
      className="visibility-eye"
      data-eye={item.id}
      data-closed={hidden ? '' : undefined}
      data-element={`${item.label} visibility`}
      onClick={() => onToggle(item.id)}
      title={label}
      type="button"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
        {hidden ? (
          <g>
            <path d="M3 10 Q12 20 21 10" />
            <path d="m5 12-2 3m6-1-1 4m7-4 1 4m3-6 2 3" />
          </g>
        ) : (
          <g>
            <path d="M2 12 Q12 1 22 12 Q12 23 2 12Z" />
            <circle cx="12" cy="12" r="3" />
          </g>
        )}
      </svg>
    </button>
  );
}

function HiddenEntry({item, onToggle}: {item: Series; onToggle: (id: string) => void}) {
  return (
    <li
      className="hidden-entry"
      data-color={item.color}
      data-series-index={series.indexOf(item)}
      style={{order: series.indexOf(item)}}
    >
      <button
        aria-disabled="true"
        data-wcl-chart-legend-button=""
        title="Show this series before highlighting it"
        type="button"
      >
        <svg aria-hidden="true" data-wcl-chart-legend-swatch="" viewBox="0 0 20 8">
          <line data-wcl-chart-legend-line="" x1="0" x2="20" y1="4" y2="4" />
        </svg>
        {item.label}
      </button>
      <Eye item={item} hidden onToggle={onToggle} />
    </li>
  );
}

function VisibilityExample({immediate}: {immediate: boolean}) {
  const host = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<string | null>(null);
  const [hidden, setHidden] = useState<readonly string[]>([]);
  const [targets, setTargets] = useState<{
    list: HTMLUListElement;
    entries: {item: Series; node: HTMLLIElement}[];
  } | null>(null);
  const visible = series.filter((item) => !hidden.includes(item.id));
  const allHidden = visible.length === 0;
  const maximum =
    scaleLinear()
      .domain([0, Math.max(1, ...data.flatMap((row) => visible.map((item) => row[item.accessor])))])
      .nice(5)
      .domain()[1] ?? 1;
  const animatedMaximum = useAnimatedMaximum(maximum, immediate || allHidden);
  const title = 'Revenue and operating costs';
  const description =
    'Monthly revenue and costs, January through June. Values are in thousands of dollars.';

  // Prototype-only insertion points preserve the production legend buttons and their behavior.
  useLayoutEffect(() => {
    const list = host.current?.querySelector<HTMLUListElement>('[data-wcl-chart-legend]');
    if (allHidden || !list) {
      setTargets(null);
      return;
    }
    const entries: {item: Series; node: HTMLLIElement}[] = [];
    for (const item of series) {
      if (hidden.includes(item.id)) continue;
      const button = [
        ...list.querySelectorAll<HTMLButtonElement>('[data-wcl-chart-legend-button]'),
      ].find((entry) => entry.textContent === item.label);
      const node = button?.closest('li');
      if (!node || !button) continue;
      node.style.order = String(series.indexOf(item));
      node.dataset.seriesIndex = String(series.indexOf(item));
      button.dataset.element = `${item.label} emphasis`;
      entries.push({item, node});
    }
    for (const mark of host.current?.querySelectorAll<SVGElement>('[data-wcl-chart-series]') ??
      []) {
      mark.dataset.seriesIndex = String(
        series.findIndex((item) => item.id === mark.dataset.seriesId),
      );
    }
    setTargets({list, entries});
  }, [hidden, allHidden]);

  useEffect(() => {
    if (targets) {
      const ordered = [...targets.list.children].sort(
        (a, b) => Number((a as HTMLElement).style.order) - Number((b as HTMLElement).style.order),
      );
      for (const entry of ordered) targets.list.appendChild(entry);
    }
    const id = restoreFocus.current;
    if (id === null) return;
    const frame = requestAnimationFrame(() => {
      host.current?.querySelector<HTMLButtonElement>(`[data-eye="${id}"]`)?.focus();
      restoreFocus.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [targets, hidden]);

  const toggle = (id: string) => {
    const item = series.find((entry) => entry.id === id);
    const button = [
      ...(host.current?.querySelectorAll<HTMLButtonElement>('[data-wcl-chart-legend-button]') ??
        []),
    ].find((entry) => entry.textContent === item?.label);
    if (button?.getAttribute('aria-pressed') === 'true') button.click();
    restoreFocus.current = id;
    setHidden((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  };

  return (
    <div className="chart-example" ref={host}>
      {allHidden ? (
        <figure
          data-wcl-chart=""
          aria-labelledby="hidden-title"
          aria-describedby="hidden-description"
        >
          <figcaption data-wcl-chart-caption="">
            <strong id="hidden-title">{title}</strong>
            <p id="hidden-description">{description}</p>
          </figcaption>
          <ul aria-label="Financial series" data-wcl-chart-legend="">
            {series.map((item) => (
              <HiddenEntry key={item.id} item={item} onToggle={toggle} />
            ))}
          </ul>
          <div className="all-hidden" data-element="All series hidden">
            <p>No series are visible.</p>
            <button
              className="restore-all"
              onClick={() => {
                restoreFocus.current = 'revenue';
                setHidden([]);
              }}
              type="button"
            >
              Show all series
            </button>
          </div>
        </figure>
      ) : (
        <LineChart
          aspectRatio={2.2}
          data={data}
          dataTableLabel="Visible financial series"
          title={title}
          description={description}
          emptyState={{
            title: 'No financial data',
            description: 'Choose a period with recorded finances.',
          }}
          invalidData={{
            title: 'Invalid financial data',
            description: 'Correct the recorded financial values.',
          }}
          legend={{label: 'Financial series'}}
          series={visible as unknown as NonEmptyChartSeries<ChartLineSeries<Datum>>}
          xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
          yAxis={{
            label: 'Amount',
            unit: '$ thousands',
            scale: {type: 'linear', domain: [0, animatedMaximum]},
          }}
        />
      )}
      {!allHidden && targets ? (
        <>
          {targets.entries
            .filter(({item, node}) => !hidden.includes(item.id) && node.isConnected)
            .map(({item, node}) =>
              createPortal(<Eye item={item} hidden={false} onToggle={toggle} />, node, item.id),
            )}
          {series
            .filter((item) => hidden.includes(item.id))
            .map((item) =>
              createPortal(
                <HiddenEntry item={item} onToggle={toggle} />,
                targets.list,
                `hidden-${item.id}`,
              ),
            )}
        </>
      ) : null}
      <p className="visibility-status" aria-live="polite" aria-atomic="true">
        {allHidden ? 'All series hidden.' : `${visible.length} of 3 series visible.`}
      </p>
      <details className="complete-data" data-element="Complete data">
        <summary>View all data</summary>
        <table aria-label="Complete financial data">
          <thead>
            <tr>
              <th scope="col">Month</th>
              {series.map((item) => (
                <th scope="col" key={item.id}>
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.month}>
                <th scope="row">{row.month}</th>
                {series.map((item) => (
                  <td key={item.id}>{row[item.accessor]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

function Prototype() {
  const [appearance, setAppearance] = useState<Appearance>('dark');
  const [compact, setCompact] = useState(false);
  const [immediate, setImmediate] = useState(false);
  const [identify, setIdentify] = useState(false);
  const [identified, setIdentified] = useState('');
  const identifyTarget = (target: EventTarget) => {
    if (target instanceof Element)
      setIdentified(target.closest<HTMLElement>('[data-element]')?.dataset.element ?? '');
  };
  return (
    <AppearanceProvider accent="#3878c7" appearance={appearance}>
      <main
        className="prototype-page"
        data-identify={identify ? '' : undefined}
        onPointerOver={(event) => identifyTarget(event.target)}
        onFocus={(event) => identifyTarget(event.target)}
      >
        <header className="prototype-header">
          <p className="prototype-kicker">Interaction study</p>
          <h1>Legend visibility</h1>
          <p>Click a series name to highlight it. Use its eye to hide or show it.</p>
        </header>
        <div className="prototype-controls" aria-label="Example settings">
          <SegmentedControl
            label="Appearance"
            options={appearances}
            value={appearance}
            onChange={setAppearance}
          />
          <ToggleButton isSelected={compact} onChange={setCompact} variant="quiet">
            Compact width
          </ToggleButton>
          <ToggleButton isSelected={immediate} onChange={setImmediate} variant="quiet">
            Reduced motion
          </ToggleButton>
          <ToggleButton isSelected={identify} onChange={setIdentify} variant="quiet">
            Identify elements
          </ToggleButton>
        </div>
        <section
          className="prototype-specimen"
          data-compact={compact ? '' : undefined}
          data-element="Financial chart"
          aria-label="Legend visibility example"
        >
          <VisibilityExample immediate={immediate} />
        </section>
        {identify ? (
          <output className="element-name" aria-live="polite">
            {identified || 'Point to or focus an element to see its name.'}
          </output>
        ) : null}
      </main>
    </AppearanceProvider>
  );
}

createRoot(document.getElementById('root')!).render(<Prototype />);
