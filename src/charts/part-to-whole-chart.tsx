import {arc} from 'd3-shape';
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import {createPortal} from 'react-dom';

import {Button} from '../actions/button.js';
import {EmptyState} from '../feedback/empty-state.js';
import {Spinner} from '../feedback/spinner.js';
import {useScrollbarActivity} from '../scrollbar-activity.js';
import {
  Feedback,
  assertText,
  clamp,
  defaultColors,
  readAccessor,
  type BoundedChartStyles,
  type ChartTooltipStyles,
} from './cartesian-chart.js';
import type {
  ChartColor,
  DonutChartProps,
  PartToWholeAggregateSizing,
  PartToWholeChartLabels,
  PartToWholeChartValue,
  PieChartProps,
} from './chart-types.js';

const radialViewSize = 340;
const radialCenter = radialViewSize / 2;
const outerRadius = 140;
const donutInnerRadius = 78;
const pageSize = 8;

type PartToWholeKind = 'donut' | 'pie';

type PartToWholeFrameStyles = CSSProperties & {
  '--wcl-chart-aspect-ratio': number;
  '--wcl-chart-minimum-height': string;
  '--wcl-chart-minimum-width': string;
  '--wcl-radial-count-font-size': string;
  '--wcl-radial-total-font-size': string;
  '--wcl-radial-unit-font-size': string;
};

interface PreparedCategory<Datum extends object> {
  readonly datum: Datum;
  readonly id: string;
  readonly label: string;
  readonly sourceIndex: number;
  readonly value: number;
}

interface PartToWholeModel<Datum extends object> {
  readonly categories: readonly PreparedCategory<Datum>[];
  readonly invalidCount: number;
  readonly positiveCategories: readonly PreparedCategory<Datum>[];
  readonly total: number;
}

interface Page {
  readonly count: number;
  readonly hasMore: boolean;
  readonly start: number;
}

interface Segment<Datum extends object> {
  readonly category?: PreparedCategory<Datum>;
  readonly color: ChartColor;
  readonly endAngle: number;
  readonly id: string;
  readonly identity: string;
  readonly index: number;
  readonly isAggregate: boolean;
  readonly remaining?: readonly PreparedCategory<Datum>[];
  readonly startAngle: number;
  readonly value: number;
}

type PartToWholeProps<Datum extends object> = PieChartProps<Datum> | DonutChartProps<Datum>;

function validateCommon<Datum extends object>(props: PartToWholeProps<Datum>): void {
  assertText(props.title, 'Part-to-whole chart title');
  assertText(props.description, 'Part-to-whole chart description');
  assertText(props.dataTableLabel, 'Part-to-whole data-table label');
  assertText(props.legend.label, 'Part-to-whole legend label');
  assertText(props.value.label, 'Part-to-whole value label');
  assertText(props.emptyState.title, 'Empty-state title');
  assertText(props.emptyState.description, 'Empty-state description');
  assertText(props.invalidData.title, 'Invalid-data title');
  assertText(props.invalidData.description, 'Invalid-data description');
  assertText(props.labels.back, 'Part-to-whole Back label');
  assertText(props.labels.category, 'Part-to-whole category label');
  assertText(props.labels.shareOfTotal, 'Part-to-whole complete-share label');
  assertText(props.labels.shareOnPage, 'Part-to-whole page-share label');
  if ('totalLabel' in props) assertText(props.totalLabel, 'DonutChart total label');
  if (props.status?.kind === 'loading') assertText(props.status.label, 'Loading label');
  if (props.status?.kind === 'partial' || props.status?.kind === 'error') {
    assertText(props.status.title, 'Status title');
    assertText(props.status.description, 'Status description');
  }
  if (
    props.aggregateSizing !== undefined &&
    props.aggregateSizing !== 'proportional' &&
    props.aggregateSizing !== 'smallest'
  ) {
    throw new Error('Part-to-whole aggregateSizing must be "proportional" or "smallest".');
  }
  assertText(props.labels.moreCategories(1), 'Part-to-whole aggregate label');
  assertText(
    props.labels.categoryRange({end: 1, start: 1, total: 1}),
    'Part-to-whole category-range label',
  );
  if (
    props.minimumSize !== undefined &&
    (!Number.isFinite(props.minimumSize.width) ||
      !Number.isFinite(props.minimumSize.height) ||
      props.minimumSize.width <= 0 ||
      props.minimumSize.height <= 0)
  ) {
    throw new Error('Part-to-whole minimumSize dimensions must be positive finite numbers.');
  }
  if (
    props.aspectRatio !== undefined &&
    (!Number.isFinite(props.aspectRatio) || props.aspectRatio <= 0)
  ) {
    throw new Error('Part-to-whole aspectRatio must be a positive finite number.');
  }
}

function prepareModel<Datum extends object>(
  props: PartToWholeProps<Datum>,
): PartToWholeModel<Datum> {
  validateCommon(props);
  const ids = new Set<string>();
  const categories: PreparedCategory<Datum>[] = [];
  let invalidCount = 0;
  props.data.forEach((datum, sourceIndex) => {
    const id = readAccessor(props.idAccessor, datum, sourceIndex);
    const label = readAccessor(props.labelAccessor, datum, sourceIndex);
    const value = readAccessor(props.value.accessor, datum, sourceIndex);
    const hasUsableId = typeof id === 'string' && id.trim().length > 0;
    if (hasUsableId && ids.has(id)) {
      throw new Error(`Part-to-whole category id "${id}" is duplicated.`);
    }
    if (hasUsableId) ids.add(id);
    if (
      !hasUsableId ||
      typeof label !== 'string' ||
      label.trim().length === 0 ||
      typeof value !== 'number' ||
      !Number.isFinite(value) ||
      value < 0
    ) {
      invalidCount += 1;
      return;
    }
    categories.push({datum, id, label, sourceIndex, value});
  });
  const positiveCategories = categories
    .filter((category) => category.value > 0)
    .sort((first, second) => second.value - first.value || first.sourceIndex - second.sourceIndex);
  return {
    categories,
    invalidCount,
    positiveCategories,
    total: categories.reduce((sum, category) => sum + category.value, 0),
  };
}

function makePages(recordCount: number): readonly Page[] {
  if (recordCount <= pageSize) return [{count: recordCount, hasMore: false, start: 0}];
  const pages: Page[] = [{count: pageSize - 1, hasMore: true, start: 0}];
  let start = pageSize - 1;
  while (start < recordCount) {
    const remaining = recordCount - start;
    const count = Math.min(pageSize, remaining);
    pages.push({count, hasMore: remaining > count, start});
    start += count;
  }
  return pages;
}

function makeSegments<Datum extends object>(
  records: readonly PreparedCategory<Datum>[],
  page: Page,
  aggregateSizing: PartToWholeAggregateSizing,
): readonly Segment<Datum>[] {
  const ordinary = records.slice(page.start, page.start + page.count);
  const remaining = records.slice(page.start + page.count);
  const ordinaryTotal = ordinary.reduce((sum, category) => sum + category.value, 0);
  const remainingTotal = remaining.reduce((sum, category) => sum + category.value, 0);
  const smallestRatio =
    ordinary.length === 0
      ? 0
      : Math.min(...ordinary.map((category) => category.value)) / ordinaryTotal;
  const aggregateLimit = (Math.PI * 2 * smallestRatio) / (1 + smallestRatio);
  const aggregateAngle = page.hasMore
    ? aggregateSizing === 'proportional'
      ? (remainingTotal / (ordinaryTotal + remainingTotal)) * Math.PI * 2
      : Math.min(Math.PI / 12, aggregateLimit * 0.55)
    : 0;
  const ordinaryAngle = Math.PI * 2 - aggregateAngle;
  let cursor = -Math.PI / 2;
  const segments: Segment<Datum>[] = ordinary.map((category, index) => {
    const startAngle = cursor;
    cursor += (category.value / ordinaryTotal) * ordinaryAngle;
    return {
      category,
      color: defaultColors[index % defaultColors.length]!,
      endAngle: cursor,
      id: category.id,
      identity: `category:${category.id}`,
      index,
      isAggregate: false,
      startAngle,
      value: category.value,
    };
  });
  if (page.hasMore) {
    segments.push({
      color: defaultColors[ordinary.length % defaultColors.length]!,
      endAngle: Math.PI * 1.5,
      id: 'aggregate',
      identity: 'aggregate',
      index: ordinary.length,
      isAggregate: true,
      remaining,
      startAngle: cursor,
      value: remainingTotal,
    });
  }
  return segments;
}

function formatChartValue<Datum extends object>(
  value: number,
  configuration: PartToWholeChartValue<Datum>,
): string {
  const formatted = formatChartNumber(value, configuration);
  const unit = configuration.unit?.trim();
  if (unit === undefined || unit.length === 0 || formatted.trimEnd().endsWith(unit))
    return formatted;
  return `${formatted} ${unit}`;
}

function formatChartNumber<Datum extends object>(
  value: number,
  configuration: PartToWholeChartValue<Datum>,
): string {
  return configuration.formatValue?.(value) ?? String(value);
}

function valueHeading<Datum extends object>(configuration: PartToWholeChartValue<Datum>): string {
  return configuration.unit === undefined
    ? configuration.label
    : `${configuration.label} (${configuration.unit})`;
}

function formatPercent(value: number): string {
  return `${new Intl.NumberFormat('en-US', {maximumFractionDigits: 1}).format(value * 100)}%`;
}

function pieSectorCentroid<Datum extends object>(
  segment: Segment<Datum>,
): readonly [number, number] {
  const angle = segment.endAngle - segment.startAngle;
  const radius = (4 * outerRadius * Math.sin(angle / 2)) / (3 * angle);
  const middle = (segment.startAngle + segment.endAngle) / 2;
  return [Math.cos(middle - Math.PI / 2) * radius, Math.sin(middle - Math.PI / 2) * radius];
}

function clientPointFromRadialViewBox(
  svg: SVGSVGElement | null,
  point: {readonly x: number; readonly y: number},
): {readonly x: number; readonly y: number} {
  if (svg === null) return point;
  const rectangle = svg.getBoundingClientRect();
  const scale = Math.min(rectangle.width / radialViewSize, rectangle.height / radialViewSize);
  if (!Number.isFinite(scale) || scale <= 0) return point;
  return {
    x: rectangle.left + (rectangle.width - radialViewSize * scale) / 2 + point.x * scale,
    y: rectangle.top + (rectangle.height - radialViewSize * scale) / 2 + point.y * scale,
  };
}

function RadialTooltip<Datum extends object>({
  anchor,
  labels,
  ordinaryTotal,
  pointer,
  portalTarget,
  segment,
  svg,
  total,
  value,
}: {
  readonly anchor: {readonly x: number; readonly y: number};
  readonly labels: PartToWholeChartLabels;
  readonly ordinaryTotal: number;
  readonly pointer?: {readonly x: number; readonly y: number};
  readonly portalTarget: Element | null;
  readonly segment: Segment<Datum>;
  readonly svg: SVGSVGElement | null;
  readonly total: number;
  readonly value: PartToWholeChartValue<Datum>;
}): ReactElement | null {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipSize, setTooltipSize] = useState<{
    readonly height: number;
    readonly width: number;
  }>();
  const title = segment.isAggregate
    ? labels.moreCategories(segment.remaining?.length ?? 0)
    : (segment.category?.label ?? '');
  const formattedValue = formatChartValue(segment.value, value);
  const contentKey = `${title}\u0000${formattedValue}\u0000${ordinaryTotal}\u0000${total}`;
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
  }, [contentKey]);
  if (portalTarget === null) return null;
  const selectedAnchor = pointer ?? clientPointFromRadialViewBox(svg, {x: anchor.x, y: anchor.y});
  const viewportWidth = typeof window === 'undefined' ? radialViewSize : window.innerWidth;
  const viewportHeight = typeof window === 'undefined' ? radialViewSize : window.innerHeight;
  const padding = 8;
  const gap = 12;
  const width = tooltipSize?.width ?? Math.min(304, Math.max(176, viewportWidth - padding * 2));
  const height = tooltipSize?.height ?? (segment.isAggregate ? 92 : 124);
  const after = viewportWidth - selectedAnchor.x - gap;
  const before = selectedAnchor.x - gap;
  const placement = after >= width || after >= before ? 'start' : 'end';
  const preferredLeft =
    placement === 'start' ? selectedAnchor.x + gap : selectedAnchor.x - gap - width;
  const style: ChartTooltipStyles = {
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
        data-horizontal-placement={placement}
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
        <strong>{title}</strong>
        <dl>
          <div>
            <dt>{value.label}</dt>
            <dd>{formattedValue}</dd>
          </div>
          {segment.isAggregate ? null : (
            <>
              <div>
                <dt>{labels.shareOfTotal}</dt>
                <dd>{formatPercent(segment.value / total)}</dd>
              </div>
              <div>
                <dt>{labels.shareOnPage}</dt>
                <dd>{formatPercent(segment.value / ordinaryTotal)}</dd>
              </div>
            </>
          )}
        </dl>
      </div>
    </div>,
    portalTarget,
  );
}

function PartToWholeTable<Datum extends object>({
  dataTableLabel,
  labels,
  model,
  value,
}: {
  readonly dataTableLabel: string;
  readonly labels: PartToWholeChartLabels;
  readonly model: PartToWholeModel<Datum>;
  readonly value: PartToWholeChartValue<Datum>;
}): ReactElement {
  return (
    <table aria-label={dataTableLabel} data-wcl-chart-table="">
      <thead>
        <tr>
          <th scope="col">{labels.category}</th>
          <th scope="col">{valueHeading(value)}</th>
          <th scope="col">{labels.shareOfTotal}</th>
        </tr>
      </thead>
      <tbody>
        {model.categories.map((category) => (
          <tr key={category.id}>
            <th scope="row">{category.label}</th>
            <td>{formatChartValue(category.value, value)}</td>
            <td>
              {model.total === 0 ? formatPercent(0) : formatPercent(category.value / model.total)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PartToWholeFrame<Datum extends object>({
  kind,
  props,
}: {
  readonly kind: PartToWholeKind;
  readonly props: PartToWholeProps<Datum>;
}): ReactElement {
  const model = prepareModel(props);
  const pages = makePages(model.positiveCategories.length);
  const aggregateSizing = props.aggregateSizing ?? 'proportional';
  const titleId = useId();
  const descriptionId = useId();
  const canvasRef = useRef<HTMLDivElement>(null);
  const suppressFocusReadingRef = useRef(false);
  const legendScrollbarActivityProps = useScrollbarActivity<HTMLUListElement>();
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);
  const [svgElement, setSvgElement] = useState<SVGSVGElement | null>(null);
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
  const [svgViewScale, setSvgViewScale] = useState(1);
  const [availableSize, setAvailableSize] = useState<{
    readonly height: number;
    readonly width: number;
  }>();
  const [announcement, setAnnouncement] = useState('');
  const modelIdentity = JSON.stringify([
    aggregateSizing,
    ...model.positiveCategories.map((category) => [category.id, category.value]),
  ]);
  const [retainedModelIdentity, setRetainedModelIdentity] = useState(modelIdentity);
  if (retainedModelIdentity !== modelIdentity) {
    setRetainedModelIdentity(modelIdentity);
    setPageIndex(0);
    setKeyboardIndex(null);
    setPointerIndex(null);
    setPointerPosition(undefined);
    setTouchIndex(null);
    setTransientLegendId(null);
    setPinnedLegendId(null);
    setAnnouncement('');
  }
  const safePageIndex = Math.min(pageIndex, pages.length - 1);
  const page = pages[safePageIndex]!;
  const segments = makeSegments(model.positiveCategories, page, aggregateSizing);
  const pathBuilder = arc<Segment<Datum>>()
    .innerRadius(kind === 'donut' ? donutInnerRadius : 0)
    .outerRadius(outerRadius)
    .padAngle(0.012)
    .cornerRadius(3);
  const activeIndex = pointerIndex ?? touchIndex ?? keyboardIndex ?? 0;
  const isReading = pointerIndex !== null || touchIndex !== null || keyboardIndex !== null;
  const activeSegment = segments[activeIndex] ?? segments[0];
  const readingEmphasisId = isReading ? (activeSegment?.identity ?? null) : null;
  const validPinnedLegendId = segments.some((segment) => segment.identity === pinnedLegendId)
    ? pinnedLegendId
    : null;
  const validTransientLegendId = segments.some((segment) => segment.identity === transientLegendId)
    ? transientLegendId
    : null;
  const emphasizedSegmentId = validPinnedLegendId ?? validTransientLegendId ?? readingEmphasisId;
  const ordinaryTotal = segments
    .filter((segment) => !segment.isAggregate)
    .reduce((sum, segment) => sum + segment.value, 0);
  const readingAnnouncement =
    !isReading || activeSegment === undefined
      ? ''
      : [
          activeSegment.isAggregate
            ? props.labels.moreCategories(activeSegment.remaining?.length ?? 0)
            : (activeSegment.category?.label ?? ''),
          `${props.value.label}: ${formatChartValue(activeSegment.value, props.value)}`,
          ...(activeSegment.isAggregate
            ? []
            : [
                `${props.labels.shareOfTotal}: ${formatPercent(activeSegment.value / model.total)}`,
                `${props.labels.shareOnPage}: ${formatPercent(activeSegment.value / ordinaryTotal)}`,
              ]),
        ].join('. ');
  const activeCentroid: readonly [number, number] =
    activeSegment === undefined ? [0, 0] : pathBuilder.centroid(activeSegment);
  const aggregateLabelRenderedSize = clamp(11, 8 + svgViewScale * 6, 14);
  const aggregateLabelFontSize = aggregateLabelRenderedSize / svgViewScale;
  const donutTotalFontSize = clamp(26, 25 / svgViewScale, 38);
  const donutUnitFontSize = clamp(13, 13 / svgViewScale, 24);
  const minimumSize = props.minimumSize ?? {height: 180, width: 320};
  const status = props.status ?? {kind: 'ready'};
  const rangeLabel = (selectedPage: Page): string =>
    props.labels.categoryRange({
      end: selectedPage.start + selectedPage.count,
      start: selectedPage.start + 1,
      total: model.positiveCategories.length,
    });
  const isCompact =
    availableSize !== undefined && (availableSize.width <= 480 || availableSize.height <= 352);
  const isStacked =
    availableSize !== undefined && availableSize.width <= 400 && availableSize.height >= 512;

  useLayoutEffect(() => {
    if (rootElement === null) return;
    const update = () => {
      const rectangle = rootElement.getBoundingClientRect();
      if (rectangle.width > 0 && rectangle.height > 0) {
        setAvailableSize({height: rectangle.height, width: rectangle.width});
      }
    };
    update();
    const ResizeObserverConstructor = rootElement.ownerDocument.defaultView?.ResizeObserver;
    if (ResizeObserverConstructor === undefined) return;
    const observer = new ResizeObserverConstructor(update);
    observer.observe(rootElement);
    return () => observer.disconnect();
  }, [rootElement]);

  useLayoutEffect(() => {
    if (svgElement === null) return;
    const update = () => {
      const rectangle = svgElement.getBoundingClientRect();
      const nextScale = Math.min(
        rectangle.width / radialViewSize,
        rectangle.height / radialViewSize,
      );
      if (Number.isFinite(nextScale) && nextScale > 0) setSvgViewScale(nextScale);
    };
    update();
    const ResizeObserverConstructor = svgElement.ownerDocument.defaultView?.ResizeObserver;
    if (ResizeObserverConstructor === undefined) return;
    const observer = new ResizeObserverConstructor(update);
    observer.observe(svgElement);
    return () => observer.disconnect();
  }, [svgElement]);

  useEffect(() => {
    if (touchIndex === null) return;
    const dismiss = (event: globalThis.PointerEvent) => {
      if (event.target instanceof Node && !rootElement?.contains(event.target)) {
        setTouchIndex(null);
      }
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [rootElement, touchIndex]);

  function focusChart(readFirstSlice: boolean): void {
    suppressFocusReadingRef.current = !readFirstSlice;
    requestAnimationFrame(() => canvasRef.current?.focus());
  }

  function clearReading(): void {
    setKeyboardIndex(null);
    setPointerIndex(null);
    setPointerPosition(undefined);
    setTouchIndex(null);
  }

  function showPage(nextPageIndex: number, readFirstSlice: boolean): void {
    const nextPage = pages[nextPageIndex]!;
    setPageIndex(nextPageIndex);
    setPointerIndex(null);
    setPointerPosition(undefined);
    setTouchIndex(null);
    setKeyboardIndex(readFirstSlice ? 0 : null);
    setTransientLegendId(null);
    setPinnedLegendId(null);
    setAnnouncement(rangeLabel(nextPage));
    focusChart(readFirstSlice);
  }

  function openNextPage(readFirstSlice = false): void {
    showPage(Math.min(safePageIndex + 1, pages.length - 1), readFirstSlice);
  }

  function goBack(): void {
    showPage(Math.max(0, safePageIndex - 1), false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      clearReading();
      return;
    }
    const currentIndex = keyboardIndex ?? activeIndex;
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex = Math.min(currentIndex + 1, segments.length - 1);
    else if (event.key === 'ArrowLeft') nextIndex = Math.max(currentIndex - 1, 0);
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = segments.length - 1;
    else if ((event.key === 'Enter' || event.key === ' ') && activeSegment?.isAggregate) {
      event.preventDefault();
      openNextPage(true);
      return;
    } else return;
    event.preventDefault();
    setAnnouncement('');
    setPointerIndex(null);
    setPointerPosition(undefined);
    setTouchIndex(null);
    setKeyboardIndex(nextIndex);
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>): void {
    if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) {
      return;
    }
    setKeyboardIndex(null);
  }

  function handlePointerMove(event: PointerEvent<SVGSVGElement>): void {
    if (event.pointerType === 'touch') return;
    const target =
      event.target instanceof Element ? event.target.closest('[data-segment-index]') : null;
    const index = Number(target?.getAttribute('data-segment-index'));
    if (!Number.isInteger(index) || segments[index] === undefined) {
      setPointerIndex(null);
      setPointerPosition(undefined);
      return;
    }
    setKeyboardIndex(null);
    setPointerIndex(index);
    setPointerPosition({x: event.clientX, y: event.clientY});
    setAnnouncement('');
  }

  function handlePointerDown(event: PointerEvent<SVGSVGElement>): void {
    if (event.pointerType !== 'touch') return;
    const target =
      event.target instanceof Element ? event.target.closest('[data-segment-index]') : null;
    const index = Number(target?.getAttribute('data-segment-index'));
    if (!Number.isInteger(index) || segments[index] === undefined) return;
    setKeyboardIndex(null);
    setPointerIndex(null);
    setPointerPosition(undefined);
    setTouchIndex(index);
    setAnnouncement('');
  }

  const frameStyle: PartToWholeFrameStyles = {
    '--wcl-chart-aspect-ratio': props.aspectRatio ?? 1.72,
    '--wcl-chart-minimum-height': `${minimumSize.height}px`,
    '--wcl-chart-minimum-width': `${minimumSize.width}px`,
    '--wcl-radial-count-font-size': `${aggregateLabelFontSize}px`,
    '--wcl-radial-total-font-size': `${donutTotalFontSize}px`,
    '--wcl-radial-unit-font-size': `${donutUnitFontSize}px`,
  };
  const rootStyle: BoundedChartStyles = {
    '--wcl-chart-minimum-width': `${minimumSize.width}px`,
  };

  let content: ReactNode;
  if (status.kind === 'loading') {
    content = (
      <div data-wcl-chart-feedback="">
        <Spinner isActive label={status.label} />
      </div>
    );
  } else if (status.kind === 'error') {
    content = <Feedback copy={status} kind="error" />;
  } else if (model.positiveCategories.length === 0) {
    const unavailable = props.data.length > 0 && model.categories.length === 0;
    content = (
      <>
        {!unavailable && model.invalidCount > 0 ? (
          <Feedback copy={props.invalidData} kind="invalid" />
        ) : null}
        <EmptyState
          description={unavailable ? props.invalidData.description : props.emptyState.description}
          kind={unavailable ? 'unavailable' : 'no-data'}
          title={unavailable ? props.invalidData.title : props.emptyState.title}
        />
      </>
    );
  } else {
    content = (
      <>
        {status.kind === 'partial' ? <Feedback copy={status} kind="partial" /> : null}
        {model.invalidCount > 0 ? <Feedback copy={props.invalidData} kind="invalid" /> : null}
        <div className="wcl-radial-paging" data-wcl-radial-paging="">
          <div>
            {safePageIndex > 0 ? <Button onPress={goBack}>{props.labels.back}</Button> : null}
          </div>
          <p>{rangeLabel(page)}</p>
        </div>
        <div data-overflow="clip" data-wcl-chart-frame="" style={frameStyle}>
          <div
            aria-keyshortcuts="ArrowLeft ArrowRight Home End Enter Space Escape"
            aria-labelledby={titleId}
            data-wcl-chart-canvas=""
            data-wcl-part-to-whole-canvas=""
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
            tabIndex={0}
          >
            <div data-wcl-radial-layout="">
              <svg
                aria-hidden="true"
                data-wcl-chart-svg=""
                focusable="false"
                onPointerDown={handlePointerDown}
                onPointerLeave={() => {
                  setPointerIndex(null);
                  setPointerPosition(undefined);
                }}
                onPointerMove={handlePointerMove}
                ref={setSvgElement}
                viewBox={`0 0 ${radialViewSize} ${radialViewSize}`}
              >
                <g transform={`translate(${radialCenter} ${radialCenter})`}>
                  {segments.map((segment, index) => {
                    const centroid = pathBuilder.centroid(segment);
                    const angle = (segment.startAngle + segment.endAngle) / 2;
                    const countLabelPoint =
                      kind === 'pie' && segment.isAggregate ? pieSectorCentroid(segment) : centroid;
                    const isEmphasized = emphasizedSegmentId === segment.identity;
                    const popDistance = isEmphasized ? 9 : 0;
                    const popX = Math.cos(angle - Math.PI / 2) * popDistance;
                    const popY = Math.sin(angle - Math.PI / 2) * popDistance;
                    return (
                      <g
                        data-active={isEmphasized ? '' : undefined}
                        data-aggregate={segment.isAggregate ? '' : undefined}
                        data-angle-size={(segment.endAngle - segment.startAngle).toFixed(6)}
                        data-color={segment.color}
                        data-emphasized={isEmphasized ? '' : undefined}
                        data-muted={emphasizedSegmentId !== null && !isEmphasized ? '' : undefined}
                        data-pattern-index={Math.floor(segment.index / defaultColors.length)}
                        data-segment-id={segment.id}
                        data-segment-index={index}
                        data-wcl-radial-segment=""
                        key={segment.identity}
                        style={{transform: `translate(${popX}px, ${popY}px)`}}
                      >
                        <path
                          d={pathBuilder(segment) ?? undefined}
                          data-wcl-radial-slice=""
                          onClick={() => {
                            if (segment.isAggregate) openNextPage(false);
                          }}
                        />
                        {segment.isAggregate ? (
                          <text
                            data-wcl-radial-aggregate-label=""
                            x={countLabelPoint[0]}
                            y={countLabelPoint[1]}
                          >
                            +{segment.remaining?.length ?? 0}
                          </text>
                        ) : null}
                      </g>
                    );
                  })}
                  {kind === 'donut' && 'totalLabel' in props ? (
                    <g data-wcl-radial-total="">
                      <text data-wcl-radial-total-value="" y={donutUnitFontSize * -0.45}>
                        {formatChartNumber(model.total, props.value)}
                      </text>
                      <text data-wcl-radial-total-label="" y={donutUnitFontSize * 0.9}>
                        {props.totalLabel}
                      </text>
                    </g>
                  ) : null}
                </g>
              </svg>

              <ul
                {...legendScrollbarActivityProps}
                aria-label={props.legend.label}
                data-wcl-chart-legend=""
                data-wcl-radial-legend=""
              >
                {segments.map((segment) => {
                  const isEmphasized = emphasizedSegmentId === segment.identity;
                  return (
                    <li
                      data-color={segment.color}
                      data-emphasized={isEmphasized ? '' : undefined}
                      data-muted={emphasizedSegmentId !== null && !isEmphasized ? '' : undefined}
                      key={segment.identity}
                    >
                      <button
                        aria-pressed={validPinnedLegendId === segment.identity}
                        data-wcl-chart-legend-button=""
                        onBlur={() => setTransientLegendId(null)}
                        onClick={() => {
                          clearReading();
                          setPinnedLegendId((current) =>
                            current === segment.identity ? null : segment.identity,
                          );
                        }}
                        onFocus={() => {
                          clearReading();
                          setTransientLegendId(segment.identity);
                        }}
                        onKeyDown={(event) => {
                          if (event.key !== 'Escape') return;
                          event.preventDefault();
                          setTransientLegendId(null);
                          setPinnedLegendId(null);
                        }}
                        onMouseEnter={() => {
                          clearReading();
                          setTransientLegendId(segment.identity);
                        }}
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
                        <span>
                          {segment.isAggregate
                            ? props.labels.moreCategories(segment.remaining?.length ?? 0)
                            : `${segment.category?.label} ${formatChartValue(segment.value, props.value)}`}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {isReading && activeSegment !== undefined ? (
              <RadialTooltip
                anchor={{x: activeCentroid[0] + radialCenter, y: activeCentroid[1] + radialCenter}}
                labels={props.labels}
                ordinaryTotal={ordinaryTotal}
                {...(pointerPosition === undefined ? {} : {pointer: pointerPosition})}
                portalTarget={rootElement?.closest('[data-wcl-provider]') ?? document.body}
                segment={activeSegment}
                svg={svgElement}
                total={model.total}
                value={props.value}
              />
            ) : null}
          </div>
        </div>
      </>
    );
  }

  return (
    <figure
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      data-density={isCompact ? 'compact' : 'regular'}
      data-layout={isStacked ? 'stacked' : 'side-by-side'}
      data-wcl-chart=""
      data-wcl-part-to-whole-chart={kind}
      ref={setRootElement}
      style={rootStyle}
    >
      <figcaption data-wcl-chart-caption="">
        <strong id={titleId}>{props.title}</strong>
        <p id={descriptionId}>{props.description}</p>
      </figcaption>
      {content}
      {model.categories.length > 0 && status.kind !== 'loading' && status.kind !== 'error' ? (
        <PartToWholeTable
          dataTableLabel={props.dataTableLabel}
          labels={props.labels}
          model={model}
          value={props.value}
        />
      ) : null}
      <div aria-atomic="true" aria-live="polite" data-wcl-chart-reading-announcement="">
        {[announcement, readingAnnouncement].filter((value) => value.length > 0).join('. ')}
      </div>
    </figure>
  );
}

export function PieChart<Datum extends object>(props: PieChartProps<Datum>): ReactElement {
  return <PartToWholeFrame kind="pie" props={props} />;
}

export function DonutChart<Datum extends object>(props: DonutChartProps<Datum>): ReactElement {
  return <PartToWholeFrame kind="donut" props={props} />;
}
