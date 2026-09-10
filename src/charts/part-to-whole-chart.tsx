import {ChartVisibilityButton} from './chart-visibility-button.js';
import {useAnimatedRadialAngles} from './use-animated-radial-angles.js';
import {arc} from 'd3-shape';
import {useFocusVisible} from 'react-aria';
import {selectionKey, useChartInteraction, type InteractionPoint} from './chart-interaction.js';
import {itemInteractionSetup} from './item-interaction.js';
import {
  radialArc,
  radialPolygon,
  radialContains,
  radialCrossing,
  type RadialPoint,
} from './radial-interaction-geometry.js';
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
  '--wcl-radial-legend-rows': number;
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

function makePages<Datum extends object>(
  records: readonly PreparedCategory<Datum>[],
  hiddenIds: readonly string[],
): readonly Page[] {
  const pages: Page[] = [];
  let remainingVisible = records.filter((record) => !hiddenIds.includes(record.id)).length;
  let start = 0;
  do {
    // Hidden legend entries retain their ranked place but consume no slice capacity.
    if (remainingVisible <= pageSize) {
      pages.push({start, count: records.length - start, hasMore: false});
      break;
    }
    const capacity = pages.length === 0 ? pageSize - 1 : pageSize;
    let end = start;
    let visibleCount = 0;
    while (end < records.length) {
      const hidden = hiddenIds.includes(records[end]!.id);
      if (!hidden && visibleCount === capacity) break;
      if (!hidden) visibleCount++;
      end++;
    }
    pages.push({start, count: end - start, hasMore: true});
    remainingVisible -= visibleCount;
    start = end;
  } while (start < records.length);
  return pages;
}

/** Preserve the palette role from the original ranked page when a category moves. */
function categoryStyleIndex(rank: number, recordCount: number): number {
  return recordCount <= pageSize || rank < pageSize - 1 ? rank : (rank - (pageSize - 1)) % pageSize;
}

/** Short and long dashes encode the occurrence, keeping patterns stable as pages mix. */
function categoryDashPattern(styleIndex: number): string | undefined {
  const occurrence = Math.floor(styleIndex / defaultColors.length);
  if (occurrence === 0) return undefined;
  return `6 2 ${[...occurrence.toString(2)].map((bit) => (bit === '1' ? '1 2' : '3 2')).join(' ')}`;
}

function makeSegments<Datum extends object>(
  records: readonly PreparedCategory<Datum>[],
  page: Page,
  aggregateSizing: PartToWholeAggregateSizing,
  hiddenIds: readonly string[] = [],
): readonly Segment<Datum>[] {
  const colorCounts = new Map<number, number>();
  const styleIndices = new Map(
    records.map((record, rank) => {
      const colorIndex = categoryStyleIndex(rank, records.length) % defaultColors.length;
      const occurrence = colorCounts.get(colorIndex) ?? 0;
      colorCounts.set(colorIndex, occurrence + 1);
      return [record.id, colorIndex + occurrence * defaultColors.length];
    }),
  );
  const pageRecords = records.slice(page.start, page.start + page.count);
  const ordinary = pageRecords.filter((category) => !hiddenIds.includes(category.id));
  const remainingRecords = records.slice(page.start + page.count);
  const remaining = remainingRecords.filter((category) => !hiddenIds.includes(category.id));
  const ordinaryTotal = ordinary.reduce((sum, category) => sum + category.value, 0);
  const remainingTotal = remaining.reduce((sum, category) => sum + category.value, 0);
  if (ordinaryTotal + remainingTotal === 0) return [];
  const hasAggregate = page.hasMore && remainingTotal > 0;
  const smallestRatio =
    ordinary.length === 0
      ? 0
      : Math.min(...ordinary.map((category) => category.value)) / ordinaryTotal;
  const aggregateLimit = (Math.PI * 2 * smallestRatio) / (1 + smallestRatio);
  const aggregateAngle = hasAggregate
    ? aggregateSizing === 'proportional'
      ? (remainingTotal / (ordinaryTotal + remainingTotal)) * Math.PI * 2
      : Math.min(Math.PI / 12, aggregateLimit * 0.55)
    : 0;
  const ordinaryAngle = Math.PI * 2 - aggregateAngle;
  let cursor = -Math.PI / 2;
  const segments: Segment<Datum>[] = ordinary.map((category) => {
    const index = styleIndices.get(category.id)!;
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
  if (hasAggregate) {
    segments.push({
      color: defaultColors[(page.start === 0 ? pageSize - 1 : pageSize) % defaultColors.length]!,
      endAngle: Math.PI * 1.5,
      id: 'aggregate',
      identity: 'aggregate',
      index: page.start === 0 ? pageSize - 1 : pageSize,
      isAggregate: true,
      remaining: remainingRecords,
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
  const radius =
    angle === 0 ? (2 * outerRadius) / 3 : (4 * outerRadius * Math.sin(angle / 2)) / (3 * angle);
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
  hiddenIds,
  hiddenLabel,
  visibleTotal,
  dataTableLabel,
  labels,
  model,
  value,
}: {
  readonly hiddenIds: readonly string[];
  readonly hiddenLabel: string | undefined;
  readonly visibleTotal: number;
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
            <th scope="row">
              {category.label}
              {hiddenIds.includes(category.id) ? ` (${hiddenLabel})` : ''}
            </th>
            <td>{formatChartValue(category.value, value)}</td>
            <td>
              {hiddenIds.includes(category.id)
                ? hiddenLabel
                : visibleTotal === 0
                  ? formatPercent(0)
                  : formatPercent(category.value / visibleTotal)}
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
  const fullModel = prepareModel(props);
  const visibilityLabels = props.visibilityLabels;
  const firstEye = useRef<HTMLButtonElement>(null);
  const [hiddenCategoryIds, setHiddenCategoryIds] = useState<readonly string[]>([]);
  const categoryIdentity = JSON.stringify(fullModel.categories.map((category) => category.id));
  const [retainedCategoryIdentity, setRetainedCategoryIdentity] = useState(categoryIdentity);
  if (retainedCategoryIdentity !== categoryIdentity) {
    setRetainedCategoryIdentity(categoryIdentity);
    setHiddenCategoryIds((ids) =>
      ids.filter((id) => fullModel.categories.some((category) => category.id === id)),
    );
  }
  const hiddenIds = visibilityLabels ? hiddenCategoryIds : [];
  if (visibilityLabels) {
    assertText(visibilityLabels.hidden, 'Hidden-category label');
    assertText(visibilityLabels.showAll, 'Show-all label');
    assertText(visibilityLabels.allHidden.title, 'No-visible-slices title');
    assertText(visibilityLabels.allHidden.description, 'No-visible-slices description');
    for (const category of fullModel.positiveCategories) {
      assertText(visibilityLabels.hideSeries(category.label), 'Hide-category label');
      assertText(visibilityLabels.showSeries(category.label), 'Show-category label');
    }
  }
  const model = {
    ...fullModel,
    total: fullModel.categories.reduce(
      (sum, category) => sum + (hiddenIds.includes(category.id) ? 0 : category.value),
      0,
    ),
  };
  const interaction = props.interaction;
  if (interaction?.selection)
    assertText(interaction.selection.containsSelection, 'Expansion selection label');
  const {isFocusVisible} = useFocusVisible();
  const pressedSegment = useRef<string | null>(null);
  const pages = makePages(model.positiveCategories, hiddenIds);
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
  const [svgGeometry, setSvgGeometry] = useState<readonly number[]>([]);
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
  if (retainedModelIdentity === modelIdentity && safePageIndex !== pageIndex)
    setPageIndex(safePageIndex);
  const page = pages[safePageIndex]!;
  const legendSegments = makeSegments(model.positiveCategories, page, aggregateSizing);
  const targetSegments = makeSegments(model.positiveCategories, page, aggregateSizing, hiddenIds);
  const angles = useAnimatedRadialAngles(
    targetSegments,
    JSON.stringify([modelIdentity, safePageIndex, kind]),
    !!visibilityLabels &&
      targetSegments.length > 0 &&
      props.status?.kind !== 'loading' &&
      props.status?.kind !== 'error',
  );
  const segments = targetSegments.map((segment) => ({
    ...segment,
    startAngle: angles.get(segment.identity)?.startAngle ?? segment.startAngle,
    endAngle: angles.get(segment.identity)?.endAngle ?? segment.startAngle,
  }));
  const pathBuilder = radialArc<Segment<Datum>>(kind === 'donut' ? donutInnerRadius : 0);
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
  const emphasizedSegmentId = interaction
    ? (readingEmphasisId ?? validPinnedLegendId ?? validTransientLegendId)
    : (validPinnedLegendId ?? validTransientLegendId ?? readingEmphasisId);
  const ordinaryTotal = segments
    .filter((segment) => !segment.isAggregate)
    .reduce((sum, segment) => sum + segment.value, 0);
  const setup = interaction
    ? itemInteractionSetup(
        model.positiveCategories.map((category) => ({
          item: {id: category.id},
          activate: (input: 'pointer' | 'keyboard' | 'touch') =>
            interaction.onActivate?.({
              item: {id: category.id},
              datum: category.datum,
              label: category.label,
              value: category.value,
              total: model.total,
              shareOfTotal: category.value / model.total,
              shareOnPage: category.value / ordinaryTotal,
              input,
            }),
        })),
        interaction.selection,
        !!interaction.onActivate,
        (item) => item.id,
      )
    : undefined;
  const configuration = setup
    ? {
        target: 'point' as const,
        ...(setup.selection ? {selection: setup.selection} : {}),
        ...(setup.onActivate
          ? {
              onActivate: (event: {
                item: {rowId: string};
                input: 'pointer' | 'keyboard' | 'touch';
              }) => setup.onActivate?.(event.item.rowId, event.input),
            }
          : {}),
      }
    : undefined;
  const actions = useChartInteraction(
    configuration,
    model.positiveCategories.map((category) => ({
      id: category.id,
      category: category.label,
      datum: category.datum,
      values: [
        {
          seriesId: '',
          label: category.label,
          value: category.value,
          hidden: hiddenIds.includes(category.id),
        },
      ],
    })),
    JSON.stringify([
      kind,
      safePageIndex,
      modelIdentity,
      hiddenIds,
      segments.map((segment) => [segment.identity, segment.startAngle, segment.endAngle]),
      svgViewScale,
      svgGeometry,
      props.minimumSize,
      props.aspectRatio,
      props.status?.kind,
      !!interaction?.onActivate,
    ]),
    props.data,
  );
  const selectedIds = new Set(actions.selected.map((item) => item.rowId));
  const containsSelected = (segment: Segment<Datum>) =>
    !!interaction?.selection &&
    !!segment.remaining?.some((category) => selectedIds.has(category.id));
  const hiddenExpansionCategories = (segment: Segment<Datum>) =>
    segment.remaining?.filter((category) => hiddenIds.includes(category.id)) ?? [];
  const expansionLabel = (segment: Segment<Datum>) =>
    [
      props.labels.moreCategories(segment.remaining?.length ?? 0),
      ...(containsSelected(segment) ? [interaction!.selection!.containsSelection] : []),
      ...hiddenExpansionCategories(segment).map(
        (category) => `${category.label} (${visibilityLabels!.hidden})`,
      ),
    ].join('. ');
  const interactionPoints: InteractionPoint[] = segments.map((segment, index) => {
    const [x, y] = pathBuilder.centroid(segment);
    return {
      index,
      x: x + radialCenter,
      y: y + radialCenter,
      categoryPosition: index,
      seriesId: '',
      item: {rowId: segment.id, seriesId: ''},
    };
  });
  const polygons = interaction
    ? segments.map((segment) => radialPolygon(segment, kind === 'donut' ? donutInnerRadius : 0))
    : [];
  const clientPoint = (x: number, y: number): RadialPoint => {
    const rect = svgElement?.getBoundingClientRect();
    if (!rect) return {x, y};
    const scale = Math.min(rect.width, rect.height) / radialViewSize || 1;
    return {
      x: (x - rect.left - (rect.width - radialViewSize * scale) / 2) / scale,
      y: (y - rect.top - (rect.height - radialViewSize * scale) / 2) / scale,
    };
  };
  const positionedPolygon = (index: number): RadialPoint[] => {
    const segment = segments[index]!,
      path = svgElement?.querySelectorAll<SVGPathElement>('[data-wcl-radial-slice]')[index],
      matrix = path?.getScreenCTM?.();
    const angle = (segment.startAngle + segment.endAngle) / 2 - Math.PI / 2,
      pop = segment.identity === emphasizedSegmentId ? 9 : 0;
    return polygons[index]!.map((p) =>
      matrix
        ? clientPoint(
            matrix.a * p.x + matrix.c * p.y + matrix.e,
            matrix.b * p.x + matrix.d * p.y + matrix.f,
          )
        : {
            x: p.x + radialCenter + Math.cos(angle) * pop,
            y: p.y + radialCenter + Math.sin(angle) * pop,
          },
    );
  };
  const segmentAt = (p: RadialPoint) => {
    const hits = segments
      .map((segment, index) => ({segment, index}))
      .filter(({index}) => radialContains(positionedPolygon(index), p));
    return hits.find(({segment}) => segment.identity === emphasizedSegmentId) ?? hits.at(-1);
  };
  const sweep = (from: RadialPoint, to: RadialPoint) =>
    segments
      .flatMap((segment, index) => {
        if (segment.isAggregate) return [];
        const crossing = radialCrossing(positionedPolygon(index), from, to);
        return crossing === undefined ? [] : [{crossing, point: interactionPoints[index]!}];
      })
      .sort((a, b) => a.crossing - b.crossing)
      .map((hit) => hit.point);
  const readingAnnouncement =
    !isReading || activeSegment === undefined
      ? ''
      : [
          activeSegment.isAggregate
            ? expansionLabel(activeSegment)
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
      setSvgGeometry([rectangle.width, rectangle.height]);
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
  }, [svgElement, availableSize]);

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
    actions.cancel();
    pressedSegment.current = null;
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
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      actions.cancel();
      pressedSegment.current = null;
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
    } else if (
      interaction &&
      (event.key === 'Enter' || event.key === ' ') &&
      activeSegment &&
      !activeSegment.isAggregate
    ) {
      event.preventDefault();
      actions.activate(
        {rowId: activeSegment.id, seriesId: ''},
        'keyboard',
        event.ctrlKey || event.metaKey,
      );
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

  const readInteractive = (event: PointerEvent<SVGSVGElement>) => {
    const p = clientPoint(event.clientX, event.clientY),
      hit = segmentAt(p);
    setKeyboardIndex(null);
    setAnnouncement('');
    if (event.pointerType === 'touch') {
      setPointerIndex(null);
      setPointerPosition(undefined);
      setTouchIndex(hit?.index ?? null);
    } else {
      setTouchIndex(null);
      setPointerIndex(hit?.index ?? null);
      setPointerPosition(hit ? {x: event.clientX, y: event.clientY} : undefined);
    }
    return {p, hit};
  };
  const beginInteractive = (event: PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0 || event.isPrimary === false) return;
    const {p, hit} = readInteractive(event);
    pressedSegment.current = hit?.segment.identity ?? null;
    actions.begin(
      event,
      hit && !hit.segment.isAggregate ? interactionPoints[hit.index] : undefined,
      p.x,
      p.y,
    );
  };
  const moveInteractive = (event: PointerEvent<SVGSVGElement>) => {
    const p = clientPoint(event.clientX, event.clientY);
    actions.move(
      event,
      p.x,
      p.y,
      interactionPoints,
      {left: 0, right: radialViewSize, top: 0, bottom: radialViewSize},
      sweep,
    );
    if (!actions.isHolding()) readInteractive(event);
  };
  const endInteractive = (event: PointerEvent<SVGSVGElement>) => {
    const hit = segmentAt(clientPoint(event.clientX, event.clientY));
    const expand =
      hit?.segment.isAggregate &&
      hit.segment.identity === pressedSegment.current &&
      !actions.isDragging() &&
      !actions.isHolding();
    const same = hit?.segment.identity === pressedSegment.current;
    actions.end(
      event,
      hit && !hit.segment.isAggregate && same ? interactionPoints[hit.index] : undefined,
    );
    pressedSegment.current = null;
    if (expand) openNextPage(false);
  };
  const cancelInteractive = () => {
    actions.cancel();
    pressedSegment.current = null;
  };
  const outerEdge = (segment: Segment<Datum>, radius: number) => {
    const a = segment.startAngle - Math.PI / 2,
      b = segment.endAngle - Math.PI / 2,
      x = Math.cos(a) * radius,
      y = Math.sin(a) * radius;
    return b - a >= Math.PI * 2 - 1e-6
      ? `M${x},${y} A${radius},${radius} 0 1 1 ${-x},${-y} A${radius},${radius} 0 1 1 ${x},${y}`
      : `M${x},${y} A${radius},${radius} 0 ${b - a > Math.PI ? 1 : 0} 1 ${Math.cos(b) * radius},${Math.sin(b) * radius}`;
  };
  const frameStyle: PartToWholeFrameStyles = {
    '--wcl-radial-legend-rows': Math.min(4, Math.ceil(legendSegments.length / 2)),
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
            aria-keyshortcuts={
              interaction
                ? 'ArrowLeft ArrowRight Home End Enter Space Escape Control+Enter Meta+Enter Control+Space Meta+Space'
                : 'ArrowLeft ArrowRight Home End Enter Space Escape'
            }
            aria-labelledby={titleId}
            data-wcl-chart-canvas=""
            data-wcl-part-to-whole-canvas=""
            data-item-interaction={interaction ? '' : undefined}
            aria-describedby={
              interaction?.selection ? `${descriptionId}-selection-instructions` : undefined
            }
            onBlur={handleBlur}
            onFocus={(event) => {
              if (suppressFocusReadingRef.current) {
                suppressFocusReadingRef.current = false;
                return;
              }
              if (
                (!interaction || isFocusVisible) &&
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
            tabIndex={segments.length ? 0 : -1}
          >
            <div data-wcl-radial-layout="">
              {segments.length ? (
                <svg
                  aria-hidden="true"
                  data-wcl-chart-svg=""
                  focusable="false"
                  data-selection-enabled={interaction?.selection ? '' : undefined}
                  onPointerDown={interaction ? beginInteractive : handlePointerDown}
                  onPointerUp={interaction ? endInteractive : undefined}
                  onPointerCancel={interaction ? cancelInteractive : undefined}
                  onLostPointerCapture={interaction ? cancelInteractive : undefined}
                  onPointerLeave={() => {
                    setPointerIndex(null);
                    setPointerPosition(undefined);
                  }}
                  onPointerMove={interaction ? moveInteractive : handlePointerMove}
                  ref={setSvgElement}
                  viewBox={`0 0 ${radialViewSize} ${radialViewSize}`}
                >
                  <g transform={`translate(${radialCenter} ${radialCenter})`}>
                    {segments.map((segment, index) => {
                      const centroid = pathBuilder.centroid(segment);
                      const angle = (segment.startAngle + segment.endAngle) / 2;
                      const countLabelPoint =
                        kind === 'pie' && segment.isAggregate
                          ? pieSectorCentroid(segment)
                          : centroid;
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
                          data-muted={
                            emphasizedSegmentId !== null && !isEmphasized ? '' : undefined
                          }
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
                            strokeDasharray={
                              segment.isAggregate ? undefined : categoryDashPattern(segment.index)
                            }
                            onClick={() => {
                              if (!interaction && segment.isAggregate) openNextPage(false);
                            }}
                          />
                          {segment.isAggregate ? (
                            <text
                              data-wcl-radial-aggregate-label=""
                              x={countLabelPoint[0]}
                              y={countLabelPoint[1]}
                            >
                              +{segment.remaining?.length ?? 0}
                              {containsSelected(segment) ||
                              hiddenExpansionCategories(segment).length > 0
                                ? '*'
                                : ''}
                            </text>
                          ) : null}
                        </g>
                      );
                    })}
                    {interaction ? (
                      <g data-wcl-radial-interaction-overlay="" pointerEvents="none">
                        {segments.map((segment, index) => {
                          const selected =
                              selectedIds.has(segment.id) &&
                              !!interaction.selection &&
                              !segment.isAggregate,
                            reading = isReading && activeIndex === index,
                            pulsing =
                              actions.pulse?.item.rowId === segment.id && !segment.isAggregate;
                          if (!selected && !reading && !pulsing) return null;
                          const angle = (segment.startAngle + segment.endAngle) / 2 - Math.PI / 2,
                            pop = segment.identity === emphasizedSegmentId ? 9 : 0,
                            pad = 3 / svgViewScale,
                            inner = kind === 'donut' ? donutInnerRadius : 0;
                          const readingPath =
                            arc<Segment<Datum>>()
                              .innerRadius(inner ? inner + pad : pad * 1.5)
                              .outerRadius(outerRadius - pad)
                              .padAngle(
                                Math.min(
                                  (segment.endAngle - segment.startAngle) / 4,
                                  pad / outerRadius,
                                ),
                              )(segment) ?? undefined;
                          return (
                            <g
                              key={segment.identity}
                              data-wcl-radial-cue-group=""
                              style={{
                                transform: `translate(${Math.cos(angle) * pop}px,${Math.sin(angle) * pop}px)`,
                              }}
                            >
                              {selected ? (
                                <path
                                  data-wcl-radial-cue="selection"
                                  d={outerEdge(segment, outerRadius + 5 / svgViewScale)}
                                />
                              ) : null}
                              {reading ? (
                                <path data-wcl-radial-cue="reading" d={readingPath} />
                              ) : null}
                              {pulsing ? (
                                <g key={actions.pulse!.sequence} data-wcl-radial-activation="">
                                  <path
                                    data-wcl-radial-cue="activation"
                                    d={pathBuilder(segment) ?? undefined}
                                  />
                                </g>
                              ) : null}
                            </g>
                          );
                        })}
                      </g>
                    ) : null}
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
                  {actions.sweepTrail.length > 0 ? (
                    <g
                      data-wcl-radial-sweep=""
                      pointerEvents="none"
                      clipPath={`url(#${titleId}-sweep-clip)`}
                    >
                      <defs>
                        <clipPath id={`${titleId}-sweep-clip`}>
                          <circle cx={radialCenter} cy={radialCenter} r={160} />
                        </clipPath>
                      </defs>
                      <polyline
                        points={actions.sweepTrail.map(({x, y}) => `${x},${y}`).join(' ')}
                      />
                      <polyline
                        points={actions.sweepTrail.map(({x, y}) => `${x},${y}`).join(' ')}
                      />
                    </g>
                  ) : null}
                </svg>
              ) : visibilityLabels ? (
                <div data-wcl-chart-all-hidden="" role="status">
                  <strong>{visibilityLabels.allHidden.title}</strong>
                  <p>{visibilityLabels.allHidden.description}</p>
                  <button
                    type="button"
                    data-wcl-chart-show-all=""
                    onClick={() => {
                      setHiddenCategoryIds([]);
                      firstEye.current?.focus();
                    }}
                  >
                    {visibilityLabels.showAll}
                  </button>
                </div>
              ) : null}

              <ul
                {...legendScrollbarActivityProps}
                aria-label={props.legend.label}
                data-wcl-chart-legend=""
                data-wcl-radial-legend=""
                data-visibility={visibilityLabels ? '' : undefined}
              >
                {legendSegments.map((segment, index) => {
                  const hidden = hiddenIds.includes(segment.id) && !segment.isAggregate;
                  const isEmphasized = emphasizedSegmentId === segment.identity;
                  return (
                    <li
                      data-color={segment.color}
                      data-hidden={hidden ? '' : undefined}
                      data-emphasized={isEmphasized ? '' : undefined}
                      data-muted={emphasizedSegmentId !== null && !isEmphasized ? '' : undefined}
                      key={segment.identity}
                    >
                      <button
                        aria-pressed={
                          visibilityLabels && segment.isAggregate
                            ? undefined
                            : validPinnedLegendId === segment.identity
                        }
                        aria-disabled={hidden || undefined}
                        aria-label={segment.isAggregate ? expansionLabel(segment) : undefined}
                        data-wcl-chart-legend-button=""
                        onBlur={() => setTransientLegendId(null)}
                        onClick={() => {
                          if (hidden) return;
                          if (visibilityLabels && segment.isAggregate) {
                            openNextPage(false);
                            return;
                          }
                          clearReading();
                          setTransientLegendId(null);
                          setPinnedLegendId((current) =>
                            current === segment.identity ? null : segment.identity,
                          );
                        }}
                        onFocus={() => {
                          if (hidden) return;
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
                          if (hidden) return;
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
                            strokeDasharray={
                              segment.isAggregate ? undefined : categoryDashPattern(segment.index)
                            }
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
                      {visibilityLabels && !segment.isAggregate ? (
                        <ChartVisibilityButton
                          buttonRef={index === 0 ? firstEye : undefined}
                          hidden={hidden}
                          label={
                            hidden
                              ? visibilityLabels.showSeries(segment.category!.label)
                              : visibilityLabels.hideSeries(segment.category!.label)
                          }
                          onClear={() => {
                            clearReading();
                            setTransientLegendId(null);
                            setPinnedLegendId(null);
                          }}
                          onToggle={() => {
                            const focusedEye = document.activeElement;
                            if (focusedEye?.hasAttribute('data-wcl-chart-visibility')) {
                              requestAnimationFrame(() => {
                                if (!focusedEye.isConnected) firstEye.current?.focus();
                              });
                            }
                            actions.cancel();
                            clearReading();
                            pressedSegment.current = null;
                            setHiddenCategoryIds((ids) =>
                              hidden ? ids.filter((id) => id !== segment.id) : [...ids, segment.id],
                            );
                            if (pinnedLegendId === segment.identity) setPinnedLegendId(null);
                            if (transientLegendId === segment.identity) setTransientLegendId(null);
                          }}
                        />
                      ) : null}
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
      data-visibility={visibilityLabels ? '' : undefined}
      ref={setRootElement}
      style={rootStyle}
    >
      <figcaption data-wcl-chart-caption="">
        <strong id={titleId}>{props.title}</strong>
        <p id={descriptionId}>{props.description}</p>
      </figcaption>
      {content}
      {setup?.selection ? (
        <div data-wcl-chart-selection="">
          <p id={`${descriptionId}-selection-instructions`}>
            {setup.selection.labels.instructions}
          </p>
          <div role="status" aria-atomic="true">
            <p>
              {actions.selected.length
                ? setup.selection.labels.summary(actions.selected.length)
                : setup.selection.labels.empty}
            </p>
            {actions.selected.length ? (
              <ul>
                {actions.selected.map((item) => (
                  <li key={selectionKey(item)}>
                    {segments.some((segment) => !segment.isAggregate && segment.id === item.rowId)
                      ? setup.selection!.labels.item(item)
                      : setup.selection!.labels.hidden(setup.selection!.labels.item(item))}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <Button
            variant="quiet"
            isDisabled={!actions.selected.length}
            onPress={() => actions.change([])}
          >
            {setup.selection.labels.clear}
          </Button>
        </div>
      ) : null}
      {model.categories.length > 0 && status.kind !== 'loading' && status.kind !== 'error' ? (
        <PartToWholeTable
          dataTableLabel={props.dataTableLabel}
          labels={props.labels}
          model={fullModel}
          hiddenIds={hiddenIds}
          hiddenLabel={visibilityLabels?.hidden}
          visibleTotal={model.total}
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
