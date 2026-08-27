import {arc} from 'd3-shape';
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import {createPortal} from 'react-dom';
import {createRoot} from 'react-dom/client';

import {
  AppearanceProvider,
  Button,
  SegmentedControl,
  ToggleButton,
  type Appearance,
} from '../../../../src/index.js';
import {useScrollbarActivity} from '../../../../src/scrollbar-activity.js';
import '../../../../src/styles.css';
import './styles.css';

type AggregateSizing = 'navigation' | 'proportional';
type ChartKind = 'donut' | 'pie';
type PageSize = 6 | 8 | 10;

interface Category {
  readonly id: string;
  readonly label: string;
  readonly value: number;
}

interface Page {
  readonly count: number;
  readonly hasMore: boolean;
  readonly start: number;
}

interface Segment {
  readonly category?: Category;
  readonly colorIndex: number;
  readonly endAngle: number;
  readonly id: string;
  readonly isAggregate: boolean;
  readonly remaining?: readonly Category[];
  readonly startAngle: number;
  readonly value: number;
}

type TooltipStyles = CSSProperties & {
  readonly '--wcl-chart-tooltip-left': string;
  readonly '--wcl-chart-tooltip-y': string;
};

const categories: readonly Category[] = [
  {id: 'residential', label: 'Residential', value: 43},
  {id: 'food-processing', label: 'Food processing', value: 31},
  {id: 'offices', label: 'Offices', value: 26},
  {id: 'retail', label: 'Retail', value: 18},
  {id: 'schools', label: 'Schools', value: 14},
  {id: 'warehouses', label: 'Warehouses', value: 12},
  {id: 'clinics', label: 'Clinics', value: 10},
  {id: 'hospitality', label: 'Hospitality', value: 9},
  {id: 'data-centers', label: 'Data centers', value: 8},
  {id: 'transit', label: 'Transit', value: 7},
  {id: 'libraries', label: 'Libraries', value: 6},
  {id: 'workshops', label: 'Workshops', value: 5},
  {id: 'agriculture', label: 'Agriculture', value: 4},
  {id: 'civic', label: 'Civic buildings', value: 3},
  {id: 'markets', label: 'Public markets', value: 2},
  {id: 'unused', label: 'Unused allocation', value: 0},
] as const;

const appearances = [
  {label: 'Light', value: 'light'},
  {label: 'Dark', value: 'dark'},
] as const;
const chartKinds = [
  {label: 'Pie', value: 'pie'},
  {label: 'Donut', value: 'donut'},
] as const;
const pageSizes = [
  {label: '6', value: '6'},
  {label: '8', value: '8'},
  {label: '10', value: '10'},
] as const;
const colorNames = ['accent', 'series-2', 'series-3', 'series-4', 'series-5', 'series-6'] as const;
const fullTotal = categories.reduce((sum, category) => sum + category.value, 0);
const positiveCategories = categories.filter((category) => category.value > 0);

function makePages(records: readonly Category[], pageSize: PageSize): readonly Page[] {
  if (records.length <= pageSize) return [{count: records.length, hasMore: false, start: 0}];
  const pages: Page[] = [{count: pageSize - 1, hasMore: true, start: 0}];
  let start = pageSize - 1;
  while (start < records.length) {
    const remaining = records.length - start;
    const count = Math.min(pageSize, remaining);
    pages.push({count, hasMore: remaining > count, start});
    start += count;
  }
  return pages;
}

function initialPrototypeWidth(): number {
  if (typeof window === 'undefined') return 620;
  const requested = Number(new URLSearchParams(window.location.search).get('width'));
  return Number.isFinite(requested) ? clamp(300, requested, 760) : 620;
}

function initialPrototypeHeight(): number {
  if (typeof window === 'undefined') return 440;
  const requested = Number(new URLSearchParams(window.location.search).get('height'));
  return Number.isFinite(requested) ? clamp(280, requested, 640) : 440;
}

function initialPrototypePageSize(): PageSize {
  if (typeof window === 'undefined') return 8;
  const requested = Number(new URLSearchParams(window.location.search).get('pageSize'));
  return requested === 6 || requested === 10 ? requested : 8;
}

function initialAggregateSizing(): AggregateSizing {
  if (typeof window === 'undefined') return 'proportional';
  return new URLSearchParams(window.location.search).get('aggregate') === 'navigation'
    ? 'navigation'
    : 'proportional';
}

function initialChartKind(): ChartKind {
  if (typeof window === 'undefined') return 'donut';
  return new URLSearchParams(window.location.search).get('chart') === 'pie' ? 'pie' : 'donut';
}

function initialScrollRegionLegend(): boolean {
  if (typeof window === 'undefined') return true;
  return new URLSearchParams(window.location.search).get('legendScroll') !== 'native';
}

function makeSegments(
  records: readonly Category[],
  page: Page,
  aggregateSizing: AggregateSizing,
): readonly Segment[] {
  const ordinary = records.slice(page.start, page.start + page.count);
  const remaining = records.slice(page.start + page.count);
  const ordinaryTotal = ordinary.reduce((sum, category) => sum + category.value, 0);
  const remainingTotal = remaining.reduce((sum, category) => sum + category.value, 0);
  const smallestRatio = Math.min(...ordinary.map((category) => category.value)) / ordinaryTotal;
  const aggregateLimit = (Math.PI * 2 * smallestRatio) / (1 + smallestRatio);
  const aggregateAngle = page.hasMore
    ? aggregateSizing === 'proportional'
      ? (remainingTotal / (ordinaryTotal + remainingTotal)) * Math.PI * 2
      : Math.min(Math.PI / 12, aggregateLimit * 0.55)
    : 0;
  const ordinaryAngle = Math.PI * 2 - aggregateAngle;
  let cursor = -Math.PI / 2;
  const segments: Segment[] = ordinary.map((category, index) => {
    const startAngle = cursor;
    cursor += (category.value / ordinaryTotal) * ordinaryAngle;
    return {
      category,
      colorIndex: index,
      endAngle: cursor,
      id: category.id,
      isAggregate: false,
      startAngle,
      value: category.value,
    };
  });
  if (page.hasMore) {
    segments.push({
      colorIndex: ordinary.length,
      endAngle: Math.PI * 1.5,
      id: 'aggregate',
      isAggregate: true,
      remaining,
      startAngle: cursor,
      value: remainingTotal,
    });
  }
  return segments;
}

function formatPercent(value: number): string {
  return `${new Intl.NumberFormat('en-US', {maximumFractionDigits: 1}).format(value * 100)}%`;
}

function pieSectorCentroid(segment: Segment): readonly [number, number] {
  const angle = segment.endAngle - segment.startAngle;
  const radius = (4 * 140 * Math.sin(angle / 2)) / (3 * angle);
  const middle = (segment.startAngle + segment.endAngle) / 2;
  return [Math.cos(middle - Math.PI / 2) * radius, Math.sin(middle - Math.PI / 2) * radius];
}

function rangeLabel(start: number, count: number): string {
  return `Categories ${start + 1}–${start + count} of ${positiveCategories.length}`;
}

function clamp(minimum: number, value: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function clientPointFromRadialViewBox(
  svg: SVGSVGElement | null,
  point: {readonly x: number; readonly y: number},
): {readonly x: number; readonly y: number} {
  if (svg === null) return point;
  const rectangle = svg.getBoundingClientRect();
  const scale = Math.min(rectangle.width / 340, rectangle.height / 340);
  if (!Number.isFinite(scale) || scale <= 0) return point;
  return {
    x: rectangle.left + (rectangle.width - 340 * scale) / 2 + point.x * scale,
    y: rectangle.top + (rectangle.height - 340 * scale) / 2 + point.y * scale,
  };
}

function RadialTooltip({
  anchor,
  ordinaryTotal,
  pointer,
  portalTarget,
  segment,
  svg,
}: {
  readonly anchor: {readonly x: number; readonly y: number};
  readonly ordinaryTotal: number;
  readonly pointer?: {readonly x: number; readonly y: number};
  readonly portalTarget: Element | null;
  readonly segment: Segment;
  readonly svg: SVGSVGElement | null;
}) {
  const viewportWidth = typeof window === 'undefined' ? 340 : window.innerWidth;
  const viewportHeight = typeof window === 'undefined' ? 340 : window.innerHeight;
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipSize, setTooltipSize] = useState<{
    readonly height: number;
    readonly width: number;
  }>();
  const contentKey = `${segment.id}\u0000${segment.value}`;
  useLayoutEffect(() => {
    const tooltip = tooltipRef.current;
    if (tooltip === null) return;
    const bounds = tooltip.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return;
    setTooltipSize((current) =>
      current?.width === bounds.width && current.height === bounds.height
        ? current
        : {height: bounds.height, width: bounds.width},
    );
  }, [contentKey, viewportWidth]);
  if (portalTarget === null) return null;
  const selectedAnchor = pointer ?? clientPointFromRadialViewBox(svg, anchor);
  const gap = 12;
  const padding = 8;
  const width = tooltipSize?.width ?? Math.min(304, Math.max(176, viewportWidth - padding * 2));
  const height = tooltipSize?.height ?? (segment.isAggregate ? 100 : 125);
  const before = selectedAnchor.x - gap;
  const after = viewportWidth - selectedAnchor.x - gap;
  const horizontalPlacement = after >= width || after >= before ? 'start' : 'end';
  const preferredLeft =
    horizontalPlacement === 'start' ? selectedAnchor.x + gap : selectedAnchor.x - gap - width;
  const style: TooltipStyles = {
    '--wcl-chart-tooltip-left': `${clamp(
      padding,
      preferredLeft,
      Math.max(padding, viewportWidth - width - padding),
    )}px`,
    '--wcl-chart-tooltip-y': `${selectedAnchor.y}px`,
  };
  return createPortal(
    <div data-wcl-chart-tooltip-layer="">
      <div
        data-horizontal-placement={horizontalPlacement}
        data-region="chart-tooltip"
        data-vertical-placement={
          selectedAnchor.y < height / 2 + gap
            ? 'start'
            : selectedAnchor.y + height / 2 + gap > viewportHeight
              ? 'end'
              : 'center'
        }
        data-wcl-chart-tooltip=""
        ref={tooltipRef}
        role="tooltip"
        style={style}
      >
        <strong>{segment.isAggregate ? 'More categories' : segment.category?.label}</strong>
        {segment.isAggregate ? (
          <dl>
            <div>
              <dt>Categories</dt>
              <dd>{segment.remaining?.length}</dd>
            </div>
            <div>
              <dt>Combined value</dt>
              <dd>{segment.value} MWh</dd>
            </div>
          </dl>
        ) : (
          <dl>
            <div>
              <dt>Value</dt>
              <dd>{segment.value} MWh</dd>
            </div>
            <div>
              <dt>Share of total</dt>
              <dd>{formatPercent(segment.value / fullTotal)}</dd>
            </div>
            <div>
              <dt>Share on this page</dt>
              <dd>{formatPercent(segment.value / ordinaryTotal)}</dd>
            </div>
          </dl>
        )}
      </div>
    </div>,
    portalTarget,
  );
}

export function PieDonutPagingPrototype() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const suppressFocusReadingRef = useRef(false);
  const legendScrollbarActivityProps = useScrollbarActivity<HTMLUListElement>();
  const [aggregateSizing, setAggregateSizing] = useState<AggregateSizing>(initialAggregateSizing);
  const [appearance, setAppearance] = useState<Appearance>('light');
  const [chartKind, setChartKind] = useState<ChartKind>(initialChartKind);
  const [pageSize, setPageSize] = useState<PageSize>(initialPrototypePageSize);
  const [pageIndex, setPageIndex] = useState(0);
  const [keyboardIndex, setKeyboardIndex] = useState<number | null>(null);
  const [pointerIndex, setPointerIndex] = useState<number | null>(null);
  const [pointerPosition, setPointerPosition] = useState<{
    readonly x: number;
    readonly y: number;
  }>();
  const [touchIndex, setTouchIndex] = useState<number | null>(null);
  const [transientLegendId, setTransientLegendId] = useState<string | null>(null);
  const [pinnedLegendId, setPinnedLegendId] = useState<string | null>(null);
  const [identifyRegions, setIdentifyRegions] = useState(false);
  const [useScrollRegionLegend, setUseScrollRegionLegend] = useState(initialScrollRegionLegend);
  const [availableWidth, setAvailableWidth] = useState(initialPrototypeWidth);
  const [availableHeight, setAvailableHeight] = useState(initialPrototypeHeight);
  const [svgViewScale, setSvgViewScale] = useState(1);
  const [announcement, setAnnouncement] = useState('');

  const pages = useMemo(() => makePages(positiveCategories, pageSize), [pageSize]);
  const page = pages[pageIndex]!;
  const segments = useMemo(
    () => makeSegments(positiveCategories, page, aggregateSizing),
    [aggregateSizing, page],
  );
  const activeIndex = pointerIndex ?? touchIndex ?? keyboardIndex ?? 0;
  const isReading = pointerIndex !== null || touchIndex !== null || keyboardIndex !== null;
  const activeSegment = segments[activeIndex] ?? segments[0]!;
  const readingEmphasisId = isReading ? activeSegment.id : null;
  const emphasizedSegmentId = pinnedLegendId ?? transientLegendId ?? readingEmphasisId;
  const ordinaryTotal = segments
    .filter((segment) => !segment.isAggregate)
    .reduce((sum, segment) => sum + segment.value, 0);
  const pathBuilder = arc<Segment>()
    .innerRadius(chartKind === 'donut' ? 78 : 0)
    .outerRadius(140)
    .padAngle(0.012)
    .cornerRadius(3);
  const activeCentroid = pathBuilder.centroid(activeSegment);
  const aggregateLabelRenderedSize = clamp(11, 8 + svgViewScale * 6, 14);
  const aggregateLabelFontSize = aggregateLabelRenderedSize / svgViewScale;
  const donutTotalFontSize = clamp(26, 25 / svgViewScale, 38);
  const donutUnitFontSize = clamp(13, 13 / svgViewScale, 24);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (svg === null) return;
    const updateScale = () => {
      const rectangle = svg.getBoundingClientRect();
      const nextScale = Math.min(rectangle.width / 340, rectangle.height / 340);
      if (Number.isFinite(nextScale) && nextScale > 0) setSvgViewScale(nextScale);
    };
    updateScale();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(updateScale);
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (touchIndex === null) return;
    const dismiss = (event: globalThis.PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setTouchIndex(null);
      }
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [touchIndex]);

  function focusChart(readFirstSlice: boolean) {
    suppressFocusReadingRef.current = !readFirstSlice;
    requestAnimationFrame(() => canvasRef.current?.focus());
  }

  function openNextPage(readFirstSlice = false) {
    const nextPageIndex = Math.min(pageIndex + 1, pages.length - 1);
    const nextPage = pages[nextPageIndex]!;
    setPageIndex(nextPageIndex);
    setPointerIndex(null);
    setPointerPosition(undefined);
    setTouchIndex(null);
    setKeyboardIndex(readFirstSlice ? 0 : null);
    setTransientLegendId(null);
    setPinnedLegendId(null);
    setAnnouncement(`Showing ${rangeLabel(nextPage.start, nextPage.count).toLowerCase()}.`);
    focusChart(readFirstSlice);
  }

  function goBack() {
    const previousPageIndex = Math.max(0, pageIndex - 1);
    const previousPage = pages[previousPageIndex]!;
    setPageIndex(previousPageIndex);
    setPointerIndex(null);
    setPointerPosition(undefined);
    setTouchIndex(null);
    setKeyboardIndex(null);
    setTransientLegendId(null);
    setPinnedLegendId(null);
    setAnnouncement(`Showing ${rangeLabel(previousPage.start, previousPage.count).toLowerCase()}.`);
    focusChart(false);
  }

  function changePageSize(value: string) {
    setPageSize(Number(value) as PageSize);
    setPageIndex(0);
    setPointerIndex(null);
    setPointerPosition(undefined);
    setTouchIndex(null);
    setKeyboardIndex(null);
    setTransientLegendId(null);
    setPinnedLegendId(null);
    setAnnouncement('');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const currentIndex = keyboardIndex ?? activeIndex;
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex = Math.min(currentIndex + 1, segments.length - 1);
    else if (event.key === 'ArrowLeft') nextIndex = Math.max(currentIndex - 1, 0);
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = segments.length - 1;
    else if ((event.key === 'Enter' || event.key === ' ') && activeSegment.isAggregate) {
      event.preventDefault();
      openNextPage(true);
      return;
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setKeyboardIndex(null);
      setPointerIndex(null);
      setPointerPosition(undefined);
      setTouchIndex(null);
      return;
    } else return;
    event.preventDefault();
    setPointerIndex(null);
    setPointerPosition(undefined);
    setTouchIndex(null);
    setKeyboardIndex(nextIndex);
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) {
      return;
    }
    setKeyboardIndex(null);
  }

  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    if (event.pointerType === 'touch') return;
    const target =
      event.target instanceof Element ? event.target.closest('[data-segment-index]') : null;
    const index = Number(target?.getAttribute('data-segment-index'));
    if (!Number.isInteger(index) || segments[index] === undefined) {
      setPointerIndex(null);
      setPointerPosition(undefined);
      return;
    }
    setPointerIndex(index);
    setPointerPosition({x: event.clientX, y: event.clientY});
  }

  function handlePointerDown(event: PointerEvent<SVGSVGElement>) {
    if (event.pointerType !== 'touch') return;
    const target =
      event.target instanceof Element ? event.target.closest('[data-segment-index]') : null;
    const index = Number(target?.getAttribute('data-segment-index'));
    if (!Number.isInteger(index) || segments[index] === undefined) return;
    setPointerIndex(null);
    setPointerPosition(undefined);
    setTouchIndex(index);
  }

  const legend = (
    <ul
      {...(useScrollRegionLegend ? legendScrollbarActivityProps : {})}
      aria-label="Visible categories"
      data-region="visible-category-key"
      data-scroll-region-style={useScrollRegionLegend ? '' : undefined}
      data-wcl-chart-legend=""
    >
      {segments.map((segment) => {
        const color = colorNames[segment.colorIndex % colorNames.length]!;
        const isEmphasized = emphasizedSegmentId === segment.id;
        return (
          <li
            data-color={color}
            data-emphasized={isEmphasized ? '' : undefined}
            data-muted={emphasizedSegmentId !== null && !isEmphasized ? '' : undefined}
            key={segment.id}
          >
            <button
              aria-pressed={pinnedLegendId === segment.id}
              data-wcl-chart-legend-button=""
              onBlur={() => setTransientLegendId(null)}
              onClick={() =>
                setPinnedLegendId((current) => (current === segment.id ? null : segment.id))
              }
              onFocus={() => setTransientLegendId(segment.id)}
              onKeyDown={(event) => {
                if (event.key !== 'Escape') return;
                event.preventDefault();
                setTransientLegendId(null);
                setPinnedLegendId(null);
              }}
              onMouseEnter={() => setTransientLegendId(segment.id)}
              onMouseLeave={() => setTransientLegendId(null)}
              type="button"
            >
              <svg
                aria-hidden="true"
                data-wcl-chart-legend-swatch=""
                focusable="false"
                viewBox="0 0 20 8"
              >
                <rect
                  data-aggregate={segment.isAggregate ? '' : undefined}
                  height="8"
                  rx="2"
                  width="20"
                />
              </svg>
              <span className="legend-label">
                {segment.isAggregate
                  ? `More categories (${segment.remaining?.length ?? 0})`
                  : `${segment.category?.label} ${segment.value} MWh`}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <AppearanceProvider accent="#2878ff" appearance={appearance}>
      <main className="prototype-page" data-identify={identifyRegions ? '' : undefined}>
        <header className="prototype-header">
          <div>
            <p className="prototype-kicker">Decision prototype</p>
            <h1>Pie and donut aggregate slice</h1>
            <p>
              The accepted view starts with eight ranked categories, proportional aggregation, and
              the ScrollRegion scrollbar. The controls retain the rejected alternatives for direct
              comparison.
            </p>
          </div>
          <ToggleButton isSelected={identifyRegions} onChange={setIdentifyRegions}>
            Identify regions
          </ToggleButton>
        </header>

        <section
          aria-label="Prototype controls"
          className="prototype-controls"
          data-region="prototype-controls"
        >
          <SegmentedControl
            label="Chart"
            onChange={(value) => setChartKind(value as ChartKind)}
            options={chartKinds}
            value={chartKind}
          />
          <SegmentedControl
            label="Appearance"
            onChange={(value) => setAppearance(value as Appearance)}
            options={appearances}
            value={appearance}
          />
          <SegmentedControl
            label="Ranked categories per page"
            onChange={changePageSize}
            options={pageSizes}
            value={String(pageSize) as '6' | '8' | '10'}
          />
          <div className="sizing-toggle">
            <span>Aggregate sizing comparison</span>
            <ToggleButton
              isSelected={aggregateSizing === 'proportional'}
              onChange={(isSelected) =>
                setAggregateSizing(isSelected ? 'proportional' : 'navigation')
              }
            >
              Proportional aggregate
            </ToggleButton>
          </div>
          <div className="sizing-toggle">
            <span>Legend scroll comparison</span>
            <ToggleButton isSelected={useScrollRegionLegend} onChange={setUseScrollRegionLegend}>
              ScrollRegion scrollbar
            </ToggleButton>
          </div>
          <fieldset className="size-controls">
            <legend>Available size</legend>
            <label className="size-control">
              <span>Width</span>
              <output>{availableWidth}px</output>
              <input
                aria-label="Available width"
                max="760"
                min="300"
                onChange={(event) => setAvailableWidth(Number(event.currentTarget.value))}
                step="20"
                type="range"
                value={availableWidth}
              />
            </label>
            <label className="size-control">
              <span>Height</span>
              <output>{availableHeight}px</output>
              <input
                aria-label="Available height"
                max="640"
                min="280"
                onChange={(event) => setAvailableHeight(Number(event.currentTarget.value))}
                step="20"
                type="range"
                value={availableHeight}
              />
            </label>
          </fieldset>
        </section>

        <section
          aria-label="Aggregate-slice comparison"
          className="prototype-stage"
          data-region="comparison-stage"
        >
          <div
            className="chart-register"
            style={{blockSize: `${availableHeight}px`, inlineSize: `${availableWidth}px`}}
          >
            <figure data-region="radial-chart" data-wcl-chart="" ref={rootRef}>
              <figcaption data-region="chart-caption" data-wcl-chart-caption="">
                <strong>Community energy use</strong>
                <p>Annual metered use by customer category, ranked by megawatt-hours.</p>
              </figcaption>

              <div className="paging-row" data-region="page-navigation">
                <div>{pageIndex > 0 ? <Button onPress={goBack}>Back</Button> : null}</div>
                <p aria-live="polite">{rangeLabel(page.start, page.count)}</p>
              </div>

              <div data-overflow="clip" data-wcl-chart-frame="">
                <div
                  aria-label="Community energy use"
                  data-region="chart-reading-boundary"
                  data-wcl-chart-canvas=""
                  onBlur={handleBlur}
                  onFocus={(event) => {
                    if (suppressFocusReadingRef.current) {
                      suppressFocusReadingRef.current = false;
                      return;
                    }
                    if (
                      event.currentTarget === event.target &&
                      keyboardIndex === null &&
                      pointerIndex === null &&
                      touchIndex === null
                    ) {
                      setKeyboardIndex(0);
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  ref={canvasRef}
                  role="group"
                  style={
                    {
                      '--wcl-chart-aspect-ratio': 1.72,
                      '--wcl-chart-minimum-height': '320px',
                      '--wcl-chart-minimum-width': '300px',
                    } as CSSProperties
                  }
                  tabIndex={0}
                >
                  <div className="radial-layout" key={pageIndex}>
                    <svg
                      aria-hidden="true"
                      data-wcl-chart-svg=""
                      onPointerDown={handlePointerDown}
                      onPointerLeave={() => {
                        setPointerIndex(null);
                        setPointerPosition(undefined);
                      }}
                      onPointerMove={handlePointerMove}
                      ref={svgRef}
                      viewBox="0 0 340 340"
                    >
                      <g transform="translate(170 170)">
                        {segments.map((segment, index) => {
                          const color = colorNames[segment.colorIndex % colorNames.length]!;
                          const centroid = pathBuilder.centroid(segment);
                          const angle = (segment.startAngle + segment.endAngle) / 2;
                          const countLabelPoint =
                            chartKind === 'pie' && segment.isAggregate
                              ? pieSectorCentroid(segment)
                              : centroid;
                          const isEmphasized = emphasizedSegmentId === segment.id;
                          const popDistance = isEmphasized ? 9 : 0;
                          const popX = Math.cos(angle - Math.PI / 2) * popDistance;
                          const popY = Math.sin(angle - Math.PI / 2) * popDistance;
                          return (
                            <g
                              data-active={isEmphasized ? '' : undefined}
                              data-angle-size={(segment.endAngle - segment.startAngle).toFixed(6)}
                              data-color={color}
                              data-emphasized={isEmphasized ? '' : undefined}
                              data-region={segment.isAggregate ? 'aggregate-slice' : undefined}
                              data-segment-id={segment.id}
                              data-segment-index={index}
                              data-wcl-radial-segment=""
                              key={segment.id}
                              style={{transform: `translate(${popX}px, ${popY}px)`}}
                            >
                              <path
                                d={pathBuilder(segment) ?? undefined}
                                data-aggregate={segment.isAggregate ? '' : undefined}
                                data-wcl-radial-slice=""
                                onClick={() => {
                                  if (segment.isAggregate) openNextPage(false);
                                }}
                              />
                              {segment.isAggregate ? (
                                <text
                                  className="aggregate-label"
                                  data-aggregate-label="count"
                                  data-rendered-font-size={aggregateLabelRenderedSize.toFixed(3)}
                                  data-label-radius={Math.hypot(
                                    countLabelPoint[0],
                                    countLabelPoint[1],
                                  ).toFixed(3)}
                                  style={{fontSize: `${aggregateLabelFontSize}px`}}
                                  x={countLabelPoint[0]}
                                  y={countLabelPoint[1]}
                                >
                                  +{segment.remaining?.length ?? 0}
                                </text>
                              ) : null}
                            </g>
                          );
                        })}
                        {chartKind === 'donut' ? (
                          <g className="donut-total" data-region="donut-total">
                            <text
                              data-donut-total=""
                              style={{fontSize: `${donutTotalFontSize}px`}}
                              y={donutUnitFontSize * -0.45}
                            >
                              {fullTotal}
                            </text>
                            <text
                              className="donut-unit"
                              data-donut-unit=""
                              style={{fontSize: `${donutUnitFontSize}px`}}
                              y={donutUnitFontSize * 0.9}
                            >
                              MWh total
                            </text>
                          </g>
                        ) : null}
                      </g>
                    </svg>

                    {legend}
                  </div>

                  {isReading ? (
                    <RadialTooltip
                      anchor={{x: activeCentroid[0] + 170, y: activeCentroid[1] + 170}}
                      ordinaryTotal={ordinaryTotal}
                      {...(pointerPosition === undefined ? {} : {pointer: pointerPosition})}
                      portalTarget={
                        rootRef.current?.closest('[data-wcl-provider]') ?? document.body
                      }
                      segment={activeSegment}
                      svg={svgRef.current}
                    />
                  ) : null}
                </div>
              </div>

              <table aria-label="Community annual energy use" data-wcl-chart-table="">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Energy use</th>
                    <th>Complete total share</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <th>{category.label}</th>
                      <td>{category.value} MWh</td>
                      <td>{formatPercent(category.value / fullTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div aria-atomic="true" aria-live="polite" data-wcl-chart-reading-announcement="">
                {announcement}
              </div>
            </figure>
          </div>
        </section>

        <section className="prototype-notes" data-region="review-question">
          <strong>Accepted defaults are eight categories and proportional aggregation.</strong>
          <p>
            The aggregate sizing option can restore the deliberately smallest slice. The page
            control retains six and ten only as rejected prototype comparisons. Exact fixture values
            and prototype SVG code are not under review.
          </p>
        </section>
      </main>
    </AppearanceProvider>
  );
}

const root = document.querySelector('#root');
if (root !== null) createRoot(root).render(<PieDonutPagingPrototype />);
