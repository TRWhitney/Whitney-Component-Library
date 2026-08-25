import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import {createRoot} from 'react-dom/client';

import {
  AppearanceProvider,
  CartesianChart,
  SegmentedControl,
  ToggleButton,
  type Appearance,
} from '../../../../src/index.js';
import '../../../../src/styles.css';
import './styles.css';

const data = [
  {capacity: 72, demand: 48, month: 'Jan', reserve: 62},
  {capacity: 76, demand: 54, month: 'Feb', reserve: 66},
  {capacity: 81, demand: 61, month: 'Mar', reserve: 69},
  {capacity: 79, demand: 57, month: 'Apr', reserve: 71},
  {capacity: 85, demand: 66, month: 'May', reserve: 74},
  {capacity: 88, demand: 70, month: 'Jun', reserve: 77},
] as const;

const series = [
  {id: 'demand', kind: 'line', label: 'Demand'},
  {id: 'capacity', kind: 'column', label: 'Capacity'},
  {id: 'reserve', kind: 'line', label: 'Reserve'},
] as const;
const interactionOptions = [
  {label: 'Shared reading', value: 'shared'},
  {label: 'Direct marks', value: 'direct'},
] as const;
const appearanceOptions = [
  {label: 'Light', value: 'light'},
  {label: 'Dark', value: 'dark'},
] as const;
const chartStateCopy = {
  emptyState: {description: 'Choose a period with recorded energy.', title: 'No energy data'},
  invalidData: {
    description: 'Correct records with missing or non-finite energy values.',
    title: 'Some energy data is invalid',
  },
} as const;

type InteractionMode = (typeof interactionOptions)[number]['value'];
type SeriesId = (typeof series)[number]['id'];
type ReadingSource = 'keyboard' | 'pointer' | 'touch';

interface ReadingNode {
  readonly id: SeriesId;
  readonly x: number;
  readonly y: number;
}

interface Reading {
  readonly guideHeight: number;
  readonly guideTop: number;
  readonly index: number;
  readonly nodes: readonly ReadingNode[];
  readonly seriesId?: SeriesId;
  readonly side: 'end' | 'start';
  readonly source: ReadingSource;
  readonly x: number;
  readonly y: number;
}

function isSeriesId(value: string | undefined): value is SeriesId {
  return series.some((item) => item.id === value);
}

function ChartInteractionPrototype() {
  const shellRef = useRef<HTMLDivElement>(null);
  const [appearance, setAppearance] = useState<Appearance>('dark');
  const [identifyRegions, setIdentifyRegions] = useState(false);
  const [interaction, setInteraction] = useState<InteractionMode>('shared');
  const [hoveredSeries, setHoveredSeries] = useState<SeriesId>();
  const [pinnedSeries, setPinnedSeries] = useState<SeriesId>();
  const [reading, setReading] = useState<Reading>();
  const emphasizedSeries = reading?.seriesId ?? hoveredSeries ?? pinnedSeries;

  const readingForIndex = (
    index: number,
    source: ReadingSource,
    seriesId?: SeriesId,
  ): Reading | undefined => {
    const shell = shellRef.current;
    const svg = shell?.querySelector<SVGSVGElement>('[data-wcl-chart-svg]');
    const categoryPoint = shell?.querySelectorAll<SVGCircleElement>(
      '[data-series="demand"][data-wcl-chart-point]',
    )[index];
    if (
      shell === null ||
      shell === undefined ||
      svg === null ||
      svg === undefined ||
      !categoryPoint
    )
      return undefined;
    const shellBounds = shell.getBoundingClientRect();
    const svgBounds = svg.getBoundingClientRect();
    const pointBounds = categoryPoint.getBoundingClientRect();
    const nodes = series.flatMap<ReadingNode>((item) => {
      const selector =
        item.kind === 'column'
          ? `[data-series="${item.id}"][data-wcl-chart-bar]`
          : `[data-series="${item.id}"][data-wcl-chart-point]`;
      const mark = shell.querySelectorAll<SVGGraphicsElement>(selector)[index];
      if (!mark) return [];
      const bounds = mark.getBoundingClientRect();
      return [
        {
          id: item.id,
          x: bounds.left + bounds.width / 2 - shellBounds.left,
          y:
            (item.kind === 'column' ? bounds.top : bounds.top + bounds.height / 2) -
            shellBounds.top,
        },
      ];
    });
    const x = pointBounds.left + pointBounds.width / 2 - shellBounds.left;
    return {
      guideHeight: (288 / 360) * svgBounds.height,
      guideTop: svgBounds.top - shellBounds.top + (18 / 360) * svgBounds.height,
      index,
      nodes,
      ...(seriesId === undefined ? {} : {seriesId}),
      side: x > shellBounds.width * 0.72 ? 'start' : 'end',
      source,
      x,
      y:
        seriesId === undefined
          ? svgBounds.top - shellBounds.top + 18
          : (nodes.find((node) => node.id === seriesId)?.y ?? svgBounds.top - shellBounds.top + 18),
    };
  };

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const frame = shell.querySelector<HTMLElement>('[data-wcl-chart-frame]');
    if (frame) {
      frame.tabIndex = 0;
      frame.setAttribute('role', 'group');
      frame.setAttribute('aria-label', 'Explore Regional energy balance data');
    }
    shell.querySelectorAll<SVGPathElement>('[data-wcl-chart-line]').forEach((line) => {
      if (line.nextElementSibling?.hasAttribute('data-prototype-line-hit')) return;
      const hit = line.cloneNode() as SVGPathElement;
      hit.removeAttribute('data-wcl-chart-line');
      hit.setAttribute('data-prototype-line-hit', '');
      line.after(hit);
    });
    const legendItems = shell.querySelectorAll<HTMLElement>('[data-wcl-chart-legend] > li');
    legendItems.forEach((item, index) => {
      const id = series[index]?.id;
      if (!id) return;
      item.tabIndex = 0;
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', `Emphasize ${series[index]?.label}`);
      item.setAttribute('aria-pressed', String(pinnedSeries === id));
      item.dataset.prototypeSeries = id;
    });
  }, [pinnedSeries]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    shell.querySelectorAll<HTMLElement>('[data-series]').forEach((mark) => {
      const id = mark.dataset.series;
      mark.toggleAttribute('data-prototype-active', emphasizedSeries === id);
      mark.toggleAttribute(
        'data-prototype-muted',
        emphasizedSeries !== undefined && emphasizedSeries !== id,
      );
    });
    shell.querySelectorAll<HTMLElement>('[data-prototype-series]').forEach((item) => {
      const id = item.dataset.prototypeSeries;
      item.toggleAttribute('data-prototype-active', emphasizedSeries === id);
      item.toggleAttribute(
        'data-prototype-muted',
        emphasizedSeries !== undefined && emphasizedSeries !== id,
      );
    });
  }, [emphasizedSeries]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const shell = shellRef.current;
    const target = event.target as Element;
    if (!shell || target.closest('[data-wcl-chart-legend]')) return;
    const svg = target.closest<SVGSVGElement>('[data-wcl-chart-svg]');
    if (!svg) {
      if (reading?.source === 'pointer') setReading(undefined);
      return;
    }
    const svgBounds = svg.getBoundingClientRect();
    const scaleX = svgBounds.width / 640;
    const scaleY = svgBounds.height / 360;
    const withinPlot =
      event.clientX >= svgBounds.left + 140 * scaleX &&
      event.clientX <= svgBounds.left + 620 * scaleX &&
      event.clientY >= svgBounds.top + 18 * scaleY &&
      event.clientY <= svgBounds.top + 306 * scaleY;
    if (!withinPlot) {
      if (reading?.source === 'pointer') setReading(undefined);
      return;
    }
    const targetSeries = (target.closest('[data-series]') as HTMLElement | null)?.dataset.series;
    const seriesId = isSeriesId(targetSeries) ? targetSeries : undefined;
    if (interaction === 'direct' && seriesId === undefined) {
      setReading(undefined);
      return;
    }
    const points = [
      ...shell.querySelectorAll<SVGCircleElement>('[data-series="demand"][data-wcl-chart-point]'),
    ];
    const index = points.reduce(
      (nearest, point, candidate) => {
        const bounds = point.getBoundingClientRect();
        const distance = Math.abs(event.clientX - (bounds.left + bounds.width / 2));
        return distance < nearest.distance ? {distance, index: candidate} : nearest;
      },
      {distance: Number.POSITIVE_INFINITY, index: 0},
    ).index;
    setReading(
      readingForIndex(index, event.pointerType === 'touch' ? 'touch' : 'pointer', seriesId),
    );
  };

  const handlePointerOver = (event: PointerEvent<HTMLDivElement>) => {
    const legendItem = (event.target as Element).closest<HTMLElement>('[data-prototype-series]');
    const id = legendItem?.dataset.prototypeSeries;
    if (isSeriesId(id)) setHoveredSeries(id);
  };

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const legendItem = target.closest<HTMLElement>('[data-prototype-series]');
    const id = legendItem?.dataset.prototypeSeries;
    if (isSeriesId(id)) {
      setHoveredSeries(id);
      return;
    }
    if (target.matches('[data-wcl-chart-frame]') && reading === undefined) {
      setReading(
        readingForIndex(
          0,
          'keyboard',
          interaction === 'direct' ? (pinnedSeries ?? 'demand') : undefined,
        ),
      );
    }
  };

  const togglePinnedSeries = (id: SeriesId) => {
    const next = pinnedSeries === id ? undefined : id;
    setPinnedSeries(next);
    setHoveredSeries(next);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const item = (event.target as Element).closest<HTMLElement>('[data-prototype-series]');
    const id = item?.dataset.prototypeSeries;
    if (isSeriesId(id)) togglePinnedSeries(id);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const legendItem = target.closest<HTMLElement>('[data-prototype-series]');
    const legendId = legendItem?.dataset.prototypeSeries;
    if (isSeriesId(legendId) && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      togglePinnedSeries(legendId);
      return;
    }
    if (event.key === 'Escape') {
      setPinnedSeries(undefined);
      setHoveredSeries(undefined);
      setReading(undefined);
      return;
    }
    if (!target.matches('[data-wcl-chart-frame]')) return;
    const current = reading?.index ?? 0;
    const currentSeries = reading?.seriesId ?? pinnedSeries ?? 'demand';
    if (interaction === 'direct' && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      const currentSeriesIndex = series.findIndex((item) => item.id === currentSeries);
      const nextSeriesIndex =
        event.key === 'ArrowUp'
          ? Math.max(0, currentSeriesIndex - 1)
          : Math.min(series.length - 1, currentSeriesIndex + 1);
      event.preventDefault();
      setReading(readingForIndex(current, 'keyboard', series[nextSeriesIndex]?.id));
      return;
    }
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? data.length - 1
          : event.key === 'ArrowLeft'
            ? Math.max(0, current - 1)
            : event.key === 'ArrowRight'
              ? Math.min(data.length - 1, current + 1)
              : undefined;
    if (next === undefined) return;
    event.preventDefault();
    setReading(
      readingForIndex(next, 'keyboard', interaction === 'direct' ? currentSeries : undefined),
    );
  };

  const activeRows =
    reading === undefined
      ? []
      : series.filter((item) => interaction === 'shared' || item.id === reading.seriesId);
  const announcement =
    reading === undefined
      ? ''
      : `${data[reading.index]?.month}. ${activeRows
          .map((item) => `${item.label} ${data[reading.index]?.[item.id]} megawatt hours`)
          .join(', ')}.`;

  return (
    <AppearanceProvider accent="#2878ff" appearance={appearance}>
      <main className="prototype" data-identify={identifyRegions} data-interaction={interaction}>
        <header className="prototype-header">
          <div>
            <span className="prototype-kicker">Non-production prototype</span>
            <h1>Chart reading interactions</h1>
            <p>
              Compare category-level reading with direct mark tooltips. Move across the plot, use
              the legend, then focus the plot and press Left or Right.
            </p>
          </div>
          <ToggleButton isSelected={identifyRegions} onChange={setIdentifyRegions} size="compact">
            Identify regions
          </ToggleButton>
        </header>

        <section
          aria-label="Prototype controls"
          className="prototype-controls"
          data-region="controls"
        >
          <span aria-hidden="true" className="prototype-region-label">
            Prototype controls
          </span>
          <SegmentedControl
            label="Reading behavior"
            onChange={(value) => {
              setInteraction(value);
              setReading(undefined);
            }}
            options={interactionOptions}
            value={interaction}
          />
          <SegmentedControl
            label="Appearance"
            onChange={setAppearance}
            options={appearanceOptions}
            value={appearance}
          />
          <p>Legend: hover or focus to emphasize. Click, Enter, or Space to pin. Escape clears.</p>
        </section>

        <section
          aria-label="Interactive chart comparison"
          className="prototype-chart"
          data-region="chart"
        >
          <span aria-hidden="true" className="prototype-region-label">
            Interactive chart
          </span>
          <div
            className="prototype-chart-shell"
            onBlurCapture={(event) => {
              if (
                !(event.relatedTarget instanceof Node) ||
                !event.currentTarget.contains(event.relatedTarget)
              )
                setHoveredSeries(pinnedSeries);
            }}
            onClick={handleClick}
            onFocusCapture={handleFocus}
            onKeyDown={handleKeyDown}
            onPointerLeave={() => {
              setHoveredSeries(pinnedSeries);
              if (reading?.source === 'pointer') setReading(undefined);
            }}
            onPointerDown={handlePointerMove}
            onPointerMove={handlePointerMove}
            onPointerOver={handlePointerOver}
            ref={shellRef}
          >
            <CartesianChart
              {...chartStateCopy}
              annotations={[{axis: 'y', kind: 'line', label: 'Operating target', value: 64}]}
              data={data}
              dataTableLabel="Regional energy balance data"
              description="Demand, capacity, and reserve across six recorded months."
              legend={{label: 'Energy series'}}
              minimumSize={{height: 360, width: 640}}
              overflow="scroll"
              series={[
                {accessor: 'demand', id: 'demand', kind: 'line', label: 'Demand', showPoints: true},
                {accessor: 'capacity', id: 'capacity', kind: 'column', label: 'Capacity'},
                {
                  accessor: 'reserve',
                  id: 'reserve',
                  kind: 'line',
                  label: 'Reserve',
                  showPoints: true,
                },
              ]}
              title="Regional energy balance"
              xAxis={{accessor: 'month', label: 'Month', scale: {type: 'categorical'}}}
              yAxis={{label: 'Energy', scale: {type: 'linear'}, showGrid: true, unit: 'MWh'}}
            />

            {reading && interaction === 'shared' ? (
              <div
                aria-hidden="true"
                className="prototype-reading-guide"
                data-region="reading-needle"
                style={{height: reading.guideHeight, left: reading.x, top: reading.guideTop}}
              >
                <span className="prototype-region-label">Reading needle</span>
              </div>
            ) : null}
            {reading?.nodes
              .filter((node) => interaction === 'shared' || node.id === reading.seriesId)
              .map((node) => (
                <span
                  aria-hidden="true"
                  className="prototype-reading-node"
                  data-color={series.find((item) => item.id === node.id)?.id}
                  key={node.id}
                  style={{left: node.x, top: node.y}}
                />
              ))}
            {reading && activeRows.length > 0 ? (
              <div
                className="prototype-chart-tooltip"
                data-region="value-tooltip"
                data-side={reading.side}
                role="tooltip"
                style={{left: reading.x, top: reading.y}}
              >
                <span aria-hidden="true" className="prototype-region-label">
                  Value tooltip
                </span>
                <strong>{data[reading.index]?.month}</strong>
                <dl>
                  {activeRows.map((item) => (
                    <div data-active={reading.seriesId === item.id} key={item.id}>
                      <dt>{item.label}</dt>
                      <dd>{data[reading.index]?.[item.id]} MWh</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
            <p aria-live="polite" className="prototype-live">
              {announcement}
            </p>
          </div>
        </section>
      </main>
    </AppearanceProvider>
  );
}

const rootElement = document.querySelector('#root');
if (rootElement === null) throw new Error('Prototype root element is missing.');
createRoot(rootElement).render(<ChartInteractionPrototype />);
