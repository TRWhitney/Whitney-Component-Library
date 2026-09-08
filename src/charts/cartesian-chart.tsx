import {extent} from 'd3-array';
import {
  scaleBand,
  scaleLinear,
  scaleLog,
  scalePoint,
  scaleUtc,
  type ScaleBand,
  type ScaleContinuousNumeric,
  type ScalePoint,
  type ScaleTime,
} from 'd3-scale';
import {area as createArea, curveLinear, curveStep, line as createLine} from 'd3-shape';
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

import {EmptyState} from '../feedback/empty-state.js';
import {InlineAlert} from '../feedback/alerts.js';
import {Spinner} from '../feedback/spinner.js';
import {useScrollbarActivity} from '../scrollbar-activity.js';
import {useAnimatedChartDomain} from './use-animated-chart-domain.js';
import type {
  AreaChartProps,
  BarChartProps,
  CartesianChartProps,
  CartesianChartSeries,
  ChartAccessor,
  ChartAnnotation,
  ChartAreaSeries,
  ChartBarLayout,
  ChartBarSeries,
  ChartColor,
  ChartDataAxis,
  ChartDomainValue,
  ChartLegend,
  ChartLineSeries,
  ChartScale,
  ChartStacking,
  ChartStateCopy,
  ChartStatus,
  ChartTone,
  ChartValueAxis,
  ChartVisibilityLabels,
  ColumnChartProps,
  LineChartProps,
  NonEmptyChartSeries,
} from './chart-types.js';

export type ChartFrameStyles = CSSProperties & {
  '--wcl-chart-aspect-ratio': number;
  '--wcl-chart-axis-font-size': string;
  '--wcl-chart-grid-width': string;
  '--wcl-chart-line-width': string;
  '--wcl-chart-minimum-height': string;
  '--wcl-chart-minimum-width': string;
  '--wcl-chart-point-radius': string;
  '--wcl-chart-point-stroke-width': string;
};

export type BoundedChartStyles = CSSProperties & {
  '--wcl-chart-minimum-width': string;
};

export type ChartTooltipStyles = CSSProperties & {
  '--wcl-chart-tooltip-left': string;
  '--wcl-chart-tooltip-y': string;
};

export const viewWidth = 640;
export const viewHeight = 360;
const compactPlot = {bottom: 306, left: 60, right: 620, top: 18} as const;
export const defaultColors: readonly ChartColor[] = [
  'accent',
  'series-2',
  'series-3',
  'series-4',
  'series-5',
  'series-6',
];

type SeriesKind = 'area' | 'bar' | 'column' | 'line';

export interface PlotBounds {
  readonly bottom: number;
  readonly left: number;
  readonly right: number;
  readonly top: number;
}

export interface PresentationMetrics {
  readonly canvasWidth: number;
  readonly fontSize: number;
  readonly gridWidth: number;
  readonly lineWidth: number;
  readonly pointRadius: number;
  readonly pointStrokeWidth: number;
  readonly staggerLabels: boolean;
  readonly viewScale: number;
}

export function plotWidth(plot: PlotBounds): number {
  return plot.right - plot.left;
}

export function plotHeight(plot: PlotBounds): number {
  return plot.bottom - plot.top;
}

interface InternalSeries<Datum extends object> {
  readonly patternIndex: number;
  readonly accessor: ChartAccessor<Datum, number>;
  readonly color: ChartColor;
  readonly curve: 'linear' | 'step';
  readonly id: string;
  readonly kind: SeriesKind;
  readonly label: string;
  readonly showPoints: boolean;
}

interface PreparedRow<Datum extends object, Category extends ChartDomainValue> {
  readonly category: Category;
  readonly datum: Datum;
  readonly index: number;
  readonly values: readonly number[];
}

interface ChartReading {
  readonly index: number;
  readonly pointer?: {readonly x: number; readonly y: number};
  readonly seriesId?: string;
}

interface ReadingReference {
  readonly label: string;
  readonly tone: ChartTone;
  readonly value: number;
}

export interface Projection<Value extends ChartDomainValue> {
  readonly bandwidth: number;
  readonly domain?: readonly Value[];
  readonly position: (value: Value) => number | undefined;
  readonly ticks: readonly Value[];
}

interface RenderModel<Datum extends object, Category extends ChartDomainValue> {
  readonly annotations: readonly ChartAnnotation<Category, number>[];
  readonly categoryAxis: ChartDataAxis<Datum, Category>;
  readonly categoryPlacement: 'x' | 'y';
  readonly data: readonly Datum[];
  readonly dataTableLabel: string;
  readonly layout: ChartBarLayout | ChartStacking;
  readonly series: readonly InternalSeries<Datum>[];
  readonly valueAxis: ChartValueAxis;
}

interface ChartFrameProps<
  Datum extends object,
  Category extends ChartDomainValue,
> extends RenderModel<Datum, Category> {
  readonly aspectRatio?: number;
  readonly visibilityLabels?: ChartVisibilityLabels;
  readonly description: string;
  readonly emptyState: ChartStateCopy;
  readonly invalidData: ChartStateCopy;
  readonly legend?: ChartLegend;
  readonly minimumSize?: {readonly height: number; readonly width: number};
  readonly overflow?: 'clip' | 'scroll';
  readonly rootAttribute: string;
  readonly status?: ChartStatus;
  readonly title: string;
}

export function readAccessor<Datum extends object, Value>(
  accessor: ChartAccessor<Datum, Value>,
  datum: Datum,
  index: number,
): Value | null | undefined {
  return typeof accessor === 'function' ? accessor(datum, index) : (datum[accessor] as Value);
}

function isDomainValue(value: unknown): value is ChartDomainValue {
  return (
    (typeof value === 'string' && value.length > 0) ||
    (typeof value === 'number' && Number.isFinite(value)) ||
    (value instanceof Date && Number.isFinite(value.getTime()))
  );
}

function isValueForScale<Value extends ChartDomainValue>(
  value: ChartDomainValue,
  scale: ChartScale<Value>,
): value is Value {
  if (scale.type === 'time') return value instanceof Date;
  if (scale.type === 'linear' || scale.type === 'normalized') return typeof value === 'number';
  if (scale.type === 'logarithmic') return typeof value === 'number' && value > 0;
  return true;
}

function prepareRows<Datum extends object, Category extends ChartDomainValue>(
  data: readonly Datum[],
  categoryAxis: ChartDataAxis<Datum, Category>,
  series: readonly InternalSeries<Datum>[],
  valueAxis: ChartValueAxis,
  layout: ChartBarLayout | ChartStacking,
): {readonly invalidCount: number; readonly rows: readonly PreparedRow<Datum, Category>[]} {
  const rows: PreparedRow<Datum, Category>[] = [];
  let invalidCount = 0;

  data.forEach((datum, index) => {
    const category = readAccessor(categoryAxis.accessor, datum, index);
    const values = series.map((item) => readAccessor(item.accessor, datum, index));
    const isInExplicitDomain =
      isDomainValue(category) &&
      (categoryAxis.scale.type !== 'categorical' ||
        categoryAxis.scale.domain === undefined ||
        categoryAxis.scale.domain.some(
          (domainValue) => domainValueKey(domainValue) === domainValueKey(category),
        ));
    const valid =
      isDomainValue(category) &&
      isValueForScale(category, categoryAxis.scale) &&
      isInExplicitDomain &&
      values.every(
        (value) =>
          typeof value === 'number' &&
          Number.isFinite(value) &&
          (valueAxis.scale.type !== 'logarithmic' || value > 0) &&
          ((layout !== 'stacked' && layout !== 'normalized') || value >= 0),
      );

    if (!valid) {
      invalidCount += 1;
      return;
    }

    rows.push({category, datum, index, values: values as number[]});
  });

  return {invalidCount, rows};
}

function stableDomain<Value extends ChartDomainValue>(values: readonly Value[]): Value[] {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = domainValueKey(value);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function domainValueKey(value: ChartDomainValue): string {
  return value instanceof Date ? `date:${value.toISOString()}` : `${typeof value}:${String(value)}`;
}

function extentOrFallback(
  values: readonly number[],
  fallback: readonly [number, number],
): [number, number] {
  const result = extent(values);
  if (result[0] === undefined || result[1] === undefined) return [...fallback];
  if (result[0] === result[1]) {
    const padding = result[0] === 0 ? 1 : Math.abs(result[0]) * 0.1;
    return [result[0] - padding, result[1] + padding];
  }
  return [result[0], result[1]];
}

export function createProjection<Value extends ChartDomainValue>(
  scale: ChartScale<Value>,
  values: readonly Value[],
  range: readonly [number, number],
  tickCount: number,
  useBands: boolean,
): Projection<Value> {
  if (scale.type === 'categorical') {
    const domain = [...(scale.domain ?? stableDomain(values))];
    const ticks = domain;
    if (useBands) {
      const band: ScaleBand<Value> = scaleBand<Value>().domain(domain).range(range).padding(0.18);
      return {
        bandwidth: band.bandwidth(),
        position: (value) => {
          const start = band(value);
          return start === undefined ? undefined : start + band.bandwidth() / 2;
        },
        ticks,
      };
    }
    const point: ScalePoint<Value> = scalePoint<Value>().domain(domain).range(range).padding(0.45);
    return {bandwidth: 0, position: point, ticks};
  }

  if (scale.type === 'time') {
    const dates = values.filter((value): value is Value & Date => value instanceof Date);
    const dateExtent = extent(dates, (value) => value);
    const domain =
      scale.domain ??
      (dateExtent[0] === undefined || dateExtent[1] === undefined
        ? [new Date(0), new Date(86_400_000)]
        : dateExtent[0].getTime() === dateExtent[1].getTime()
          ? [
              new Date(dateExtent[0].getTime() - 43_200_000),
              new Date(dateExtent[1].getTime() + 43_200_000),
            ]
          : [dateExtent[0], dateExtent[1]]);
    const time: ScaleTime<number, number> = scaleUtc().domain(domain).range(range);
    if (scale.domain === undefined) time.nice();
    return {
      bandwidth: 0,
      position: (value) => (value instanceof Date ? time(value) : undefined),
      ticks: time.ticks(tickCount) as Value[],
    };
  }

  const numbers = values.filter((value): value is Value & number => typeof value === 'number');
  const requestedDomain = scale.type === 'normalized' ? [0, 1] : scale.domain;
  const domain =
    requestedDomain ??
    (scale.type === 'logarithmic'
      ? extentOrFallback(
          numbers.filter((value) => value > 0),
          [1, 10],
        )
      : extentOrFallback(numbers, [0, 1]));
  const numeric: ScaleContinuousNumeric<number, number> =
    scale.type === 'logarithmic'
      ? scaleLog()
          .base(scale.base ?? 10)
          .domain(domain)
          .range(range)
      : scaleLinear().domain(domain).range(range);
  if (scale.type !== 'normalized' && scale.domain === undefined) numeric.nice();
  return {
    bandwidth: 0,
    domain: numeric.domain() as Value[],
    position: (value) => (typeof value === 'number' ? numeric(value) : undefined),
    ticks: numeric.ticks(tickCount) as Value[],
  };
}

function valueDomain<Datum extends object, Category extends ChartDomainValue>(
  rows: readonly PreparedRow<Datum, Category>[],
  layout: ChartBarLayout | ChartStacking,
  series: readonly InternalSeries<Datum>[],
): number[] {
  if (layout === 'normalized') return [0, 1];
  if (layout === 'stacked') {
    return rows.flatMap((row) => [
      0,
      row.values.reduce((total, value) => total + Math.max(0, value), 0),
    ]);
  }
  const needsZero = series.some((item) => item.kind !== 'line');
  return rows.flatMap((row) => [...(needsZero ? [0] : []), ...row.values]);
}

function formatValue(value: ChartDomainValue, scale: ChartScale<ChartDomainValue>): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'number') {
    if (scale.type === 'normalized') return `${Math.round(value * 100)}%`;
    return Number.isInteger(value)
      ? String(value)
      : value.toLocaleString('en-US', {maximumFractionDigits: 2});
  }
  return value;
}

export function axisTickLabel<Value extends ChartDomainValue>(
  value: Value,
  axis: {readonly formatTick?: (tick: Value) => string; readonly scale: ChartScale<Value>},
): string {
  return axis.formatTick?.(value) ?? formatValue(value, axis.scale);
}

function truncateTickLabel(label: string, maximumCharacters: number): string {
  const characters = [...label];
  if (characters.length <= maximumCharacters) return label;
  const finalWord = label.slice(label.lastIndexOf(' ') + 1);
  const finalWordCharacters = [...finalWord];
  if (finalWord !== label) {
    if (finalWordCharacters.length <= maximumCharacters - 3) {
      const prefixLength = maximumCharacters - finalWordCharacters.length - 2;
      return `${characters.slice(0, prefixLength).join('').trimEnd()}… ${finalWord}`;
    }
    const suffixLength = Math.floor(maximumCharacters / 2);
    const prefixLength = maximumCharacters - suffixLength - 1;
    return `${characters.slice(0, prefixLength).join('').trimEnd()}…${finalWordCharacters
      .slice(-suffixLength)
      .join('')}`;
  }
  const suffixLength = Math.max(2, Math.floor(maximumCharacters / 3));
  const prefixLength = maximumCharacters - suffixLength - 1;
  return `${characters.slice(0, prefixLength).join('')}…${characters.slice(-suffixLength).join('')}`;
}

export function estimatedUtilityTextWidth(label: string): number {
  return [...label].reduce((width, character) => {
    if (character === ' ') return width + 5.25;
    if (/[1Iil.,:|]/.test(character)) return width + 5;
    if (/[MW@%]/.test(character)) return width + 12.5;
    return width + 9.25;
  }, 0);
}

export function plotForPresentation(presentation: PresentationMetrics): PlotBounds {
  const axisFontSize = presentation.fontSize / presentation.viewScale;
  const tickOffset = axisFontSize * (presentation.staggerLabels ? 1.75 : 1.125);
  const labelGap = axisFontSize * 1.45;
  return {
    ...compactPlot,
    bottom: Math.min(compactPlot.bottom, viewHeight - 7 - tickOffset - labelGap),
  };
}

export function plotForYAxisLabels(
  labels: readonly string[],
  fontScale: number,
  bounds: PlotBounds,
): PlotBounds {
  const widestLabel = Math.max(0, ...labels.map(estimatedUtilityTextWidth)) * fontScale;
  const left = Math.max(compactPlot.left, Math.min(140, Math.ceil(widestLabel + 39)));
  return {...bounds, left};
}

export function clamp(minimum: number, value: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

export function inheritedDirection(element: HTMLElement): 'ltr' | 'rtl' {
  const computedDirection = element.ownerDocument.defaultView?.getComputedStyle(element).direction;
  if (computedDirection === 'ltr' || computedDirection === 'rtl') return computedDirection;
  return element.closest<HTMLElement>('[dir]')?.dir.toLowerCase() === 'rtl' ? 'rtl' : 'ltr';
}

function estimatedLabelWidth(label: string, fontSize: number): number {
  return [...label].length * fontSize * 0.62;
}

export function presentationMetrics(
  availableWidth: number,
  minimumWidth: number,
  categoryLabels: readonly string[],
): PresentationMetrics {
  const fontSize = clamp(14, (availableWidth / viewWidth) * 16, 18);
  const lineWidth = clamp(2, (availableWidth / viewWidth) * 2.5, 3.25);
  const pointRadius = clamp(3.25, (availableWidth / viewWidth) * 4, 5);
  const pointStrokeWidth = clamp(1.75, (availableWidth / viewWidth) * 2, 2.5);
  const gridWidth = clamp(1, (availableWidth / viewWidth) * 1.15, 1.4);
  const labelWidths = categoryLabels.map((label) => estimatedLabelWidth(label, fontSize));
  const maximumLabelWidth = Math.max(...labelWidths, 0);
  const edgePadding = Math.max(
    (labelWidths[0] ?? 0) / 2,
    (labelWidths[labelWidths.length - 1] ?? 0) / 2,
  );
  const intervals = Math.max(0, categoryLabels.length - 1);
  const fixedPlotSpace = 104 + edgePadding * 2;
  const singleRowWidth = fixedPlotSpace + intervals * (maximumLabelWidth + 12);
  const staggerLabels = categoryLabels.length > 0 && singleRowWidth > availableWidth;
  const contentWidth =
    categoryLabels.length === 0
      ? 0
      : fixedPlotSpace +
        intervals * (staggerLabels ? maximumLabelWidth / 2 + 12 : maximumLabelWidth + 12);
  const canvasWidth = Math.ceil(Math.max(availableWidth, minimumWidth, contentWidth));
  return {
    canvasWidth,
    fontSize,
    gridWidth,
    lineWidth,
    pointRadius,
    pointStrokeWidth,
    staggerLabels,
    viewScale: canvasWidth / viewWidth,
  };
}

function tickLabelCharacterLimit(
  horizontal: boolean,
  centered: boolean,
  fontSize: number,
  positions: readonly number[],
  index: number,
  staggered: boolean,
  viewScale: number,
): number {
  if (!horizontal) return 14;
  if (positions.length < 2) return 18;
  const stride = staggered ? 2 : 1;
  const previousGap =
    index < stride ? Number.POSITIVE_INFINITY : positions[index]! - positions[index - stride]!;
  const nextGap =
    index + stride >= positions.length
      ? Number.POSITIVE_INFINITY
      : positions[index + stride]! - positions[index]!;
  const position = positions[index]!;
  const availableWidth = Math.min(
    previousGap,
    nextGap,
    ...(centered ? [position * 2, (viewWidth - position) * 2] : []),
  );
  return Math.max(6, Math.min(18, Math.floor((availableWidth * viewScale) / (fontSize * 0.62))));
}

export function Axis<Value extends ChartDomainValue>({
  axis,
  placement,
  plot,
  projection,
  presentation,
  staggerLabels,
}: {
  readonly axis: {
    readonly formatTick?: (tick: Value) => string;
    readonly label: string;
    readonly scale: ChartScale<Value>;
    readonly showGrid?: boolean;
    readonly unit?: string;
  };
  readonly placement: 'x' | 'y';
  readonly plot: PlotBounds;
  readonly projection: Projection<Value>;
  readonly presentation: PresentationMetrics;
  readonly staggerLabels?: boolean;
}): ReactElement {
  const horizontal = placement === 'x';
  const centerCategoricalLabels = horizontal && axis.scale.type === 'categorical';
  const renderedTicks = projection.ticks.flatMap((tick, sourceIndex) => {
    const position = projection.position(tick);
    return position === undefined ? [] : [{position, sourceIndex, tick}];
  });
  const tickPositions = renderedTicks.map(({position}) => position);
  return (
    <g data-axis={placement} data-scale={axis.scale.type} data-wcl-chart-axis="">
      <line
        data-wcl-chart-axis-rail=""
        x1={plot.left}
        x2={horizontal ? plot.right : plot.left}
        y1={horizontal ? plot.bottom : plot.top}
        y2={plot.bottom}
      />
      {renderedTicks.map(({position, sourceIndex, tick}, index) => {
        const fullLabel = axisTickLabel(tick, axis);
        const label =
          axis.scale.type === 'categorical'
            ? truncateTickLabel(
                fullLabel,
                tickLabelCharacterLimit(
                  horizontal,
                  centerCategoricalLabels,
                  presentation.fontSize,
                  tickPositions,
                  index,
                  staggerLabels ?? false,
                  presentation.viewScale,
                ),
              )
            : fullLabel;
        const textAnchor = centerCategoricalLabels
          ? 'middle'
          : horizontal && tickPositions.length > 1
            ? index === 0
              ? 'start'
              : index === tickPositions.length - 1
                ? 'end'
                : 'middle'
            : horizontal
              ? 'middle'
              : 'end';
        return (
          <g data-wcl-chart-tick="" key={`${formatValue(tick, axis.scale)}-${sourceIndex}`}>
            {label === fullLabel ? null : <title>{fullLabel}</title>}
            {axis.showGrid ? (
              <line
                data-wcl-chart-grid-line=""
                x1={horizontal ? position : plot.left}
                x2={horizontal ? position : plot.right}
                y1={horizontal ? plot.top : position}
                y2={horizontal ? plot.bottom : position}
              />
            ) : null}
            <line
              data-wcl-chart-tick-mark=""
              x1={horizontal ? position : plot.left - 5}
              x2={horizontal ? position : plot.left}
              y1={horizontal ? plot.bottom : position}
              y2={horizontal ? plot.bottom + 5 : position}
            />
            <text
              data-label-row={staggerLabels && horizontal ? (sourceIndex % 2) + 1 : undefined}
              data-wcl-chart-tick-label=""
              textAnchor={textAnchor}
              x={horizontal ? position : plot.left - 9}
              y={
                horizontal
                  ? staggerLabels
                    ? plot.bottom +
                      (presentation.fontSize / presentation.viewScale) *
                        (sourceIndex % 2 === 0 ? 0.875 : 1.75)
                    : plot.bottom + (presentation.fontSize / presentation.viewScale) * 1.125
                  : position + 4
              }
            >
              {label}
            </text>
          </g>
        );
      })}
      <text
        data-wcl-chart-axis-label=""
        textAnchor="middle"
        transform={horizontal ? undefined : `rotate(-90 14 ${plot.top + plotHeight(plot) / 2})`}
        x={horizontal ? plot.left + plotWidth(plot) / 2 : 14}
        y={horizontal ? viewHeight - 7 : plot.top + plotHeight(plot) / 2}
      >
        {axis.label}
        {axis.unit === undefined ? '' : ` (${axis.unit})`}
      </text>
    </g>
  );
}

function coordinates<Datum extends object, Category extends ChartDomainValue>(
  row: PreparedRow<Datum, Category>,
  seriesIndex: number,
  layout: ChartBarLayout | ChartStacking,
): {readonly end: number; readonly start: number} {
  const value = row.values[seriesIndex] ?? 0;
  if (layout === 'overlap' || layout === 'grouped') return {end: value, start: 0};
  const total =
    layout === 'normalized' ? row.values.reduce((sum, item) => sum + Math.max(0, item), 0) : 1;
  const divisor = total === 0 ? 1 : total;
  const start =
    row.values.slice(0, seriesIndex).reduce((sum, item) => sum + Math.max(0, item), 0) / divisor;
  return {end: start + Math.max(0, value) / divisor, start};
}

function displayedValues<Datum extends object, Category extends ChartDomainValue>(
  row: PreparedRow<Datum, Category>,
  layout: ChartBarLayout | ChartStacking,
): readonly number[] {
  if (layout !== 'normalized') return row.values;
  const total = row.values.reduce((sum, value) => sum + Math.max(0, value), 0) || 1;
  return row.values.map((value) => value / total);
}

function formatReadingValue(value: number, valueAxis: ChartValueAxis): string {
  const formatted = axisTickLabel(value, valueAxis);
  const unit = valueAxis.unit?.trim();
  if (unit === undefined || unit.length === 0 || formatted.trimEnd().endsWith(unit))
    return formatted;
  return `${formatted} ${unit}`;
}

function nearestReadingIndex<Datum extends object, Category extends ChartDomainValue>(
  rows: readonly PreparedRow<Datum, Category>[],
  projection: Projection<Category>,
  coordinate: number,
): number | null {
  let nearestIndex: number | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;
  rows.forEach((row, index) => {
    const position = projection.position(row.category);
    if (position === undefined) return;
    const distance = Math.abs(position - coordinate);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });
  return nearestIndex;
}

function svgViewport(svg: SVGSVGElement): {
  readonly left: number;
  readonly scale: number;
  readonly top: number;
} {
  const rectangle = svg.getBoundingClientRect();
  const scale = Math.min(rectangle.width / viewWidth, rectangle.height / viewHeight);
  if (!Number.isFinite(scale) || scale <= 0) return {left: 0, scale: 1, top: 0};
  return {
    left: rectangle.left + (rectangle.width - viewWidth * scale) / 2,
    scale,
    top: rectangle.top + (rectangle.height - viewHeight * scale) / 2,
  };
}

function viewBoxPointFromPointer(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
): {readonly x: number; readonly y: number} {
  const viewport = svgViewport(svg);
  return {
    x: (clientX - viewport.left) / viewport.scale,
    y: (clientY - viewport.top) / viewport.scale,
  };
}

export function clientPointFromViewBox(
  svg: SVGSVGElement | null,
  x: number,
  y: number,
): {readonly x: number; readonly y: number} {
  if (svg === null) return {x, y};
  const viewport = svgViewport(svg);
  return {x: viewport.left + x * viewport.scale, y: viewport.top + y * viewport.scale};
}

function ReadingOverlay<Datum extends object, Category extends ChartDomainValue>({
  categoryPlacement,
  categoryProjection,
  emphasizedSeriesId,
  layout,
  plot,
  reading,
  rows,
  series,
  valueProjection,
}: {
  readonly categoryPlacement: 'x' | 'y';
  readonly categoryProjection: Projection<Category>;
  readonly emphasizedSeriesId: string | undefined;
  readonly layout: ChartBarLayout | ChartStacking;
  readonly plot: PlotBounds;
  readonly reading: ChartReading;
  readonly rows: readonly PreparedRow<Datum, Category>[];
  readonly series: readonly InternalSeries<Datum>[];
  readonly valueProjection: Projection<number>;
}): ReactElement | null {
  const row = rows[reading.index];
  if (row === undefined) return null;
  const category = categoryProjection.position(row.category);
  if (category === undefined) return null;
  return (
    <g data-wcl-chart-reading="">
      <line
        data-wcl-chart-reading-needle=""
        x1={categoryPlacement === 'x' ? category : plot.left}
        x2={categoryPlacement === 'x' ? category : plot.right}
        y1={categoryPlacement === 'x' ? plot.top : category}
        y2={categoryPlacement === 'x' ? plot.bottom : category}
      />
      {series.map((item, seriesIndex) => {
        const plottedValue = coordinates(row, seriesIndex, layout).end;
        const value = valueProjection.position(plottedValue);
        if (value === undefined) return null;
        return (
          <circle
            cx={categoryPlacement === 'x' ? category : value}
            cy={categoryPlacement === 'x' ? value : category}
            data-active={emphasizedSeriesId === item.id ? '' : undefined}
            data-color={item.color}
            data-muted={
              emphasizedSeriesId !== undefined && emphasizedSeriesId !== item.id ? '' : undefined
            }
            data-series-index={item.patternIndex}
            data-wcl-chart-reading-node=""
            key={item.id}
            r="4.5"
          />
        );
      })}
    </g>
  );
}

function ReadingTooltip<Datum extends object, Category extends ChartDomainValue>({
  categoryAxis,
  categoryPlacement,
  categoryProjection,
  emphasizedSeriesId,
  layout,
  plot,
  portalTarget,
  references,
  reading,
  rows,
  series,
  valueAxis,
  valueProjection,
  svg,
}: {
  readonly categoryAxis: ChartDataAxis<Datum, Category>;
  readonly categoryPlacement: 'x' | 'y';
  readonly categoryProjection: Projection<Category>;
  readonly emphasizedSeriesId: string | undefined;
  readonly layout: ChartBarLayout | ChartStacking;
  readonly plot: PlotBounds;
  readonly portalTarget: Element | null;
  readonly references: readonly ReadingReference[];
  readonly reading: ChartReading;
  readonly rows: readonly PreparedRow<Datum, Category>[];
  readonly series: readonly InternalSeries<Datum>[];
  readonly valueAxis: ChartValueAxis;
  readonly valueProjection: Projection<number>;
  readonly svg: SVGSVGElement | null;
}): ReactElement | null {
  const row = rows[reading.index];
  const values = row === undefined ? [] : displayedValues(row, layout);
  const formattedValues = series.map((_, seriesIndex) =>
    formatReadingValue(values[seriesIndex] ?? 0, valueAxis),
  );
  const formattedReferenceValues = references.map((reference) =>
    formatReadingValue(reference.value, valueAxis),
  );
  const viewportWidth = typeof window === 'undefined' ? viewWidth : window.innerWidth;
  const tooltipContentKey = [
    row === undefined ? '' : axisTickLabel(row.category, categoryAxis),
    emphasizedSeriesId ?? '',
    ...series.flatMap((item, seriesIndex) => [item.label, formattedValues[seriesIndex] ?? '']),
    ...references.flatMap((reference, referenceIndex) => [
      reference.label,
      formattedReferenceValues[referenceIndex] ?? '',
    ]),
  ].join('\u0000');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipSize, setTooltipSize] = useState<{
    readonly height: number;
    readonly width: number;
  }>();
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
  }, [tooltipContentKey, viewportWidth]);
  if (row === undefined) return null;
  const category = categoryProjection.position(row.category);
  if (category === undefined) return null;
  const plottedPositions = row.values.flatMap((_, seriesIndex) => {
    const position = valueProjection.position(coordinates(row, seriesIndex, layout).end);
    return position === undefined ? [] : [position];
  });
  const plotAnchorX =
    categoryPlacement === 'x'
      ? category
      : Math.max(plot.left, ...plottedPositions, plot.left + plotWidth(plot) / 2);
  const plotAnchorY =
    categoryPlacement === 'x'
      ? Math.min(plot.bottom, ...plottedPositions, plot.top + plotHeight(plot) / 2)
      : category;
  const categoryAnchor = clientPointFromViewBox(svg, plotAnchorX, plotAnchorY);
  const anchorX = reading.pointer?.x ?? categoryAnchor.x;
  const anchorY = reading.pointer?.y ?? categoryAnchor.y;
  const viewportHeight = typeof window === 'undefined' ? viewHeight : window.innerHeight;
  const tooltipGap = 12;
  const viewportPadding = 8;
  const estimatedTooltipWidth = Math.min(304, Math.max(176, viewportWidth - viewportPadding * 2));
  const tooltipWidth = tooltipSize?.width ?? estimatedTooltipWidth;
  const tooltipHeight = tooltipSize?.height ?? 50 + (series.length + references.length) * 25;
  const availableBefore = anchorX - tooltipGap;
  const availableAfter = viewportWidth - anchorX - tooltipGap;
  const horizontalPlacement =
    availableAfter >= tooltipWidth || availableAfter >= availableBefore ? 'start' : 'end';
  const preferredLeft =
    horizontalPlacement === 'start' ? anchorX + tooltipGap : anchorX - tooltipGap - tooltipWidth;
  const tooltipLeft = clamp(
    viewportPadding,
    preferredLeft,
    Math.max(viewportPadding, viewportWidth - tooltipWidth - viewportPadding),
  );
  const style: ChartTooltipStyles = {
    '--wcl-chart-tooltip-left': `${tooltipLeft}px`,
    '--wcl-chart-tooltip-y': `${anchorY}px`,
  };
  if (portalTarget === null) return null;
  return createPortal(
    <div data-wcl-chart-tooltip-layer="">
      <div
        data-horizontal-placement={horizontalPlacement}
        data-vertical-placement={
          anchorY < tooltipHeight / 2 + 12
            ? 'start'
            : anchorY + tooltipHeight / 2 + 12 > viewportHeight
              ? 'end'
              : 'center'
        }
        data-wcl-chart-tooltip=""
        ref={tooltipRef}
        role="tooltip"
        style={style}
      >
        <strong>{axisTickLabel(row.category, categoryAxis)}</strong>
        <dl>
          {series.map((item, seriesIndex) => (
            <div data-active={emphasizedSeriesId === item.id ? '' : undefined} key={item.id}>
              <dt>
                <svg
                  aria-hidden="true"
                  data-color={item.color}
                  data-series-index={item.patternIndex}
                  data-wcl-chart-tooltip-swatch=""
                  focusable="false"
                  viewBox="0 0 20 8"
                >
                  <line data-wcl-chart-legend-line="" x1="0" x2="20" y1="4" y2="4" />
                </svg>
                {item.label}
              </dt>
              <dd>{formattedValues[seriesIndex]}</dd>
            </div>
          ))}
          {references.map((reference, referenceIndex) => (
            <div
              data-wcl-chart-tooltip-reference=""
              key={`${reference.label}-${reference.value}-${referenceIndex}`}
            >
              <dt>
                <svg
                  aria-hidden="true"
                  data-tone={reference.tone}
                  data-wcl-chart-tooltip-swatch=""
                  focusable="false"
                  viewBox="0 0 20 8"
                >
                  <line data-wcl-chart-annotation="" x1="0" x2="20" y1="4" y2="4" />
                </svg>
                {reference.label}
              </dt>
              <dd>{formattedReferenceValues[referenceIndex]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>,
    portalTarget,
  );
}

function readingReferences(
  annotations: readonly ChartAnnotation<ChartDomainValue, ChartDomainValue>[],
  categoryPlacement: 'x' | 'y',
): readonly ReadingReference[] {
  return annotations.flatMap((annotation) =>
    annotation.kind === 'line' &&
    annotation.axis !== categoryPlacement &&
    typeof annotation.value === 'number'
      ? [
          {
            label: annotation.label,
            tone: annotation.tone ?? 'neutral',
            value: annotation.value,
          },
        ]
      : [],
  );
}

function Marks<Datum extends object, Category extends ChartDomainValue>({
  categoryPlacement,
  categoryProjection,
  emphasizedSeriesId,
  layout,
  plot,
  rows,
  series,
  valueProjection,
}: {
  readonly categoryPlacement: 'x' | 'y';
  readonly categoryProjection: Projection<Category>;
  readonly emphasizedSeriesId: string | undefined;
  readonly layout: ChartBarLayout | ChartStacking;
  readonly plot: PlotBounds;
  readonly rows: readonly PreparedRow<Datum, Category>[];
  readonly series: readonly InternalSeries<Datum>[];
  readonly valueProjection: Projection<number>;
}): ReactElement {
  const isHorizontal = categoryPlacement === 'y';
  const barSeries = series.filter((item) => item.kind === 'bar' || item.kind === 'column');
  const orderedSeries = series
    .map((item, seriesIndex) => ({item, seriesIndex}))
    .sort(
      (first, second) => Number(first.item.kind === 'line') - Number(second.item.kind === 'line'),
    );
  return (
    <g data-wcl-chart-marks="">
      {orderedSeries.map(({item, seriesIndex}) => {
        const color = item.color;
        if (item.kind === 'line') {
          const path = createLine<PreparedRow<Datum, Category>>()
            .x((row) => categoryProjection.position(row.category) ?? plot.left)
            .y((row) => valueProjection.position(row.values[seriesIndex] ?? 0) ?? plot.bottom)
            .curve(item.curve === 'step' ? curveStep : curveLinear)(rows);
          return (
            <g
              data-color={color}
              data-emphasized={emphasizedSeriesId === item.id ? '' : undefined}
              data-muted={
                emphasizedSeriesId !== undefined && emphasizedSeriesId !== item.id ? '' : undefined
              }
              data-series-id={item.id}
              data-series-index={item.patternIndex}
              data-wcl-chart-series=""
              key={item.id}
            >
              <path d={path ?? undefined} data-series={item.id} data-wcl-chart-line-hit-target="" />
              <path d={path ?? undefined} data-series={item.id} data-wcl-chart-line="" />
              {item.showPoints
                ? rows.map((row, rowIndex) => (
                    <circle
                      cx={categoryProjection.position(row.category)}
                      cy={valueProjection.position(row.values[seriesIndex] ?? 0)}
                      data-row-index={rowIndex}
                      data-series={item.id}
                      data-wcl-chart-point=""
                      key={`${item.id}-${row.index}`}
                      r="3.25"
                    />
                  ))
                : null}
            </g>
          );
        }

        if (item.kind === 'area') {
          const path = createArea<PreparedRow<Datum, Category>>()
            .x((row) => categoryProjection.position(row.category) ?? plot.left)
            .y0(
              (row) =>
                valueProjection.position(coordinates(row, seriesIndex, layout).start) ??
                plot.bottom,
            )
            .y1(
              (row) =>
                valueProjection.position(coordinates(row, seriesIndex, layout).end) ?? plot.bottom,
            )(rows);
          return (
            <path
              d={path ?? undefined}
              data-color={color}
              data-emphasized={emphasizedSeriesId === item.id ? '' : undefined}
              data-muted={
                emphasizedSeriesId !== undefined && emphasizedSeriesId !== item.id ? '' : undefined
              }
              data-series={item.id}
              data-series-id={item.id}
              data-series-index={item.patternIndex}
              data-wcl-chart-area=""
              data-wcl-chart-series=""
              key={item.id}
            />
          );
        }

        const availableLength = isHorizontal ? plotHeight(plot) : plotWidth(plot);
        const groupWidth =
          categoryProjection.bandwidth > 0
            ? categoryProjection.bandwidth
            : Math.min(48, (availableLength / Math.max(rows.length, 1)) * 0.7);
        const grouped = layout === 'grouped';
        const barIndex = barSeries.findIndex((bar) => bar.id === item.id);
        const barWidth = grouped ? groupWidth / Math.max(barSeries.length, 1) : groupWidth;
        return (
          <g
            data-color={color}
            data-emphasized={emphasizedSeriesId === item.id ? '' : undefined}
            data-muted={
              emphasizedSeriesId !== undefined && emphasizedSeriesId !== item.id ? '' : undefined
            }
            data-series-id={item.id}
            data-series-index={item.patternIndex}
            data-wcl-chart-series=""
            key={item.id}
          >
            {rows.map((row, rowIndex) => {
              const category = categoryProjection.position(row.category) ?? 0;
              const {end, start} = coordinates(row, seriesIndex, layout);
              const startPosition = valueProjection.position(start) ?? 0;
              const endPosition = valueProjection.position(end) ?? 0;
              const categoryStart =
                category - groupWidth / 2 + (grouped ? Math.max(barIndex, 0) * barWidth : 0);
              return (
                <rect
                  data-row-index={rowIndex}
                  data-series={item.id}
                  data-wcl-chart-bar=""
                  height={isHorizontal ? barWidth : Math.abs(startPosition - endPosition)}
                  key={`${item.id}-${row.index}`}
                  width={isHorizontal ? Math.abs(endPosition - startPosition) : barWidth}
                  x={isHorizontal ? Math.min(startPosition, endPosition) : categoryStart}
                  y={isHorizontal ? categoryStart : Math.min(startPosition, endPosition)}
                />
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

function Annotations<Category extends ChartDomainValue>({
  annotations,
  categoryPlacement,
  categoryProjection,
  layer,
  plot,
  valueProjection,
}: {
  readonly annotations: readonly ChartAnnotation<ChartDomainValue, ChartDomainValue>[];
  readonly categoryPlacement: 'x' | 'y';
  readonly categoryProjection: Projection<Category>;
  readonly layer: 'background' | 'foreground';
  readonly plot: PlotBounds;
  readonly valueProjection: Projection<number>;
}): ReactElement {
  const projectCategory = (value: ChartDomainValue): number | undefined =>
    categoryProjection.position(value as Category);
  const projectValue = (value: ChartDomainValue): number | undefined =>
    typeof value === 'number' ? valueProjection.position(value) : undefined;
  return (
    <g data-layer={layer} data-wcl-chart-annotations="">
      {annotations.map((annotation, index) => {
        if (layer === 'background' && annotation.kind !== 'band') return null;
        const tone = annotation.tone ?? 'neutral';
        const key = `${annotation.kind}-${annotation.label}-${index}`;
        if (annotation.kind === 'point') {
          const x =
            categoryPlacement === 'x' ? projectCategory(annotation.x) : projectValue(annotation.x);
          const y =
            categoryPlacement === 'x' ? projectValue(annotation.y) : projectCategory(annotation.y);
          if (x === undefined || y === undefined) return null;
          return (
            <g data-tone={tone} key={key}>
              <circle cx={x} cy={y} data-wcl-chart-annotation="" r="5" />
              <text data-wcl-chart-annotation-label="" x={x + 8} y={y - 7}>
                {annotation.label}
              </text>
            </g>
          );
        }
        const isCategoryAxis = annotation.axis === categoryPlacement;
        const project = (value: ChartDomainValue): number | undefined =>
          isCategoryAxis ? projectCategory(value) : projectValue(value);
        if (annotation.kind === 'line') {
          const position = project(annotation.value);
          if (position === undefined) return null;
          return (
            <g data-tone={tone} key={key}>
              <line
                data-wcl-chart-annotation=""
                x1={annotation.axis === 'x' ? position : plot.left}
                x2={annotation.axis === 'x' ? position : plot.right}
                y1={annotation.axis === 'x' ? plot.top : position}
                y2={annotation.axis === 'x' ? plot.bottom : position}
              />
              <text
                data-wcl-chart-annotation-label=""
                x={annotation.axis === 'x' ? position + 5 : plot.left + 6}
                y={annotation.axis === 'x' ? plot.top + 12 : position - 6}
              >
                {annotation.label}
              </text>
            </g>
          );
        }
        const from = project(annotation.from);
        const to = project(annotation.to);
        if (from === undefined || to === undefined) return null;
        if (layer === 'foreground') {
          return (
            <text
              data-tone={tone}
              data-wcl-chart-annotation-label=""
              key={key}
              x={annotation.axis === 'x' ? Math.min(from, to) + 5 : plot.left + 6}
              y={annotation.axis === 'x' ? plot.top + 12 : Math.min(from, to) + 13}
            >
              {annotation.label}
            </text>
          );
        }
        return (
          <g data-tone={tone} key={key}>
            <rect
              data-wcl-chart-annotation=""
              height={annotation.axis === 'x' ? plotHeight(plot) : Math.abs(to - from)}
              width={annotation.axis === 'x' ? Math.abs(to - from) : plotWidth(plot)}
              x={annotation.axis === 'x' ? Math.min(from, to) : plot.left}
              y={annotation.axis === 'x' ? plot.top : Math.min(from, to)}
            />
          </g>
        );
      })}
    </g>
  );
}

function DataTable<Datum extends object, Category extends ChartDomainValue>({
  hiddenIds = [],
  hiddenLabel,
  categoryAxis,
  dataTableLabel,
  layout,
  rows,
  series,
  valueAxis,
}: {
  readonly hiddenIds?: readonly string[];
  readonly hiddenLabel?: string;
  readonly categoryAxis: ChartDataAxis<Datum, Category>;
  readonly dataTableLabel: string;
  readonly layout: ChartBarLayout | ChartStacking;
  readonly rows: readonly PreparedRow<Datum, Category>[];
  readonly series: readonly InternalSeries<Datum>[];
  readonly valueAxis: ChartValueAxis;
}): ReactElement {
  const categoryUnit = categoryAxis.unit === undefined ? '' : ` (${categoryAxis.unit})`;
  const unit = valueAxis.unit === undefined ? '' : ` (${valueAxis.unit})`;
  return (
    <table aria-label={dataTableLabel} data-wcl-chart-table="">
      <thead>
        <tr>
          <th scope="col">
            {categoryAxis.label}
            {categoryUnit}
          </th>
          {series.map((item) => (
            <th key={item.id} scope="col">
              {item.label}
              {unit}
              {hiddenIds.includes(item.id) ? ` ${hiddenLabel ?? ''}` : null}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.index}>
            <th scope="row">{axisTickLabel(row.category, categoryAxis)}</th>
            {row.values.map((value, index) => (
              <td key={series[index]?.id ?? index}>
                {axisTickLabel(
                  layout === 'normalized'
                    ? value /
                        (row.values.reduce((total, item) => total + Math.max(0, item), 0) || 1)
                    : value,
                  valueAxis,
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AnnotationSummary<Datum extends object, Category extends ChartDomainValue>({
  annotations,
  categoryAxis,
  categoryPlacement,
  valueAxis,
}: {
  readonly annotations: readonly ChartAnnotation<ChartDomainValue, ChartDomainValue>[];
  readonly categoryAxis: ChartDataAxis<Datum, Category>;
  readonly categoryPlacement: 'x' | 'y';
  readonly valueAxis: ChartValueAxis;
}): ReactElement | null {
  if (annotations.length === 0) return null;
  const formatAxisValue = (axis: 'x' | 'y', value: ChartDomainValue): string => {
    if (axis === categoryPlacement) {
      const unit = categoryAxis.unit === undefined ? '' : ` (${categoryAxis.unit})`;
      return `${categoryAxis.label}${unit}: ${axisTickLabel(value as Category, categoryAxis)}`;
    }
    if (typeof value !== 'number') return `${valueAxis.label}: ${String(value)}`;
    const unit = valueAxis.unit === undefined ? '' : ` (${valueAxis.unit})`;
    return `${valueAxis.label}${unit}: ${axisTickLabel(value, valueAxis)}`;
  };
  return (
    <ul data-wcl-chart-annotation-summary="">
      {annotations.map((annotation, index) => (
        <li key={`${annotation.kind}-${annotation.label}-${index}`}>
          {annotation.label}:{' '}
          {annotation.kind === 'point'
            ? `${formatAxisValue('x', annotation.x)}; ${formatAxisValue('y', annotation.y)}`
            : annotation.kind === 'line'
              ? formatAxisValue(annotation.axis, annotation.value)
              : `${formatAxisValue(annotation.axis, annotation.from)}–${formatAxisValue(annotation.axis, annotation.to)}`}
        </li>
      ))}
    </ul>
  );
}

function Legend<Datum extends object>({
  hiddenIds,
  visibilityLabels,
  onVisibilityChange,
  onFirstEye,
  emphasizedSeriesId,
  legend,
  onClear,
  onPin,
  onTransientChange,
  pinnedSeriesId,
  series,
}: {
  readonly hiddenIds: readonly string[];
  readonly visibilityLabels: ChartVisibilityLabels | undefined;
  readonly onVisibilityChange: (id: string) => void;
  readonly onFirstEye: (element: HTMLButtonElement | null) => void;
  readonly emphasizedSeriesId: string | undefined;
  readonly legend: ChartLegend;
  readonly onClear: () => void;
  readonly onPin: (seriesId: string) => void;
  readonly onTransientChange: (seriesId: string | null) => void;
  readonly pinnedSeriesId: string | null;
  readonly series: readonly InternalSeries<Datum>[];
}): ReactElement {
  return (
    <ul
      aria-label={legend.label}
      data-wcl-chart-legend=""
      data-visibility={visibilityLabels === undefined ? undefined : ''}
    >
      {series.map((item, index) => (
        <li
          data-color={item.color}
          data-emphasized={emphasizedSeriesId === item.id ? '' : undefined}
          data-muted={
            emphasizedSeriesId !== undefined && emphasizedSeriesId !== item.id ? '' : undefined
          }
          data-series-index={item.patternIndex}
          data-hidden={hiddenIds.includes(item.id) ? '' : undefined}
          key={item.id}
        >
          <button
            aria-disabled={hiddenIds.includes(item.id) ? true : undefined}
            aria-pressed={pinnedSeriesId === item.id}
            data-wcl-chart-legend-button=""
            onBlur={() => onTransientChange(null)}
            onClick={() => {
              if (!hiddenIds.includes(item.id)) onPin(item.id);
            }}
            onFocus={() => {
              if (!hiddenIds.includes(item.id)) onTransientChange(item.id);
            }}
            onKeyDown={(event) => {
              if (event.key !== 'Escape') return;
              event.preventDefault();
              onClear();
            }}
            onMouseEnter={() => {
              if (!hiddenIds.includes(item.id)) onTransientChange(item.id);
            }}
            onMouseLeave={() => onTransientChange(null)}
            type="button"
          >
            <svg
              aria-hidden="true"
              data-wcl-chart-legend-swatch=""
              focusable="false"
              viewBox="0 0 20 8"
            >
              <line data-wcl-chart-legend-line="" x1="0" x2="20" y1="4" y2="4" />
            </svg>
            {item.label}
          </button>
          {visibilityLabels === undefined ? null : (
            <button
              aria-label={
                hiddenIds.includes(item.id)
                  ? visibilityLabels.showSeries(item.label)
                  : visibilityLabels.hideSeries(item.label)
              }
              data-wcl-chart-visibility=""
              data-hidden={hiddenIds.includes(item.id) ? '' : undefined}
              onClick={() => onVisibilityChange(item.id)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  event.preventDefault();
                  onClear();
                }
              }}
              ref={index === 0 ? onFirstEye : undefined}
              title={
                hiddenIds.includes(item.id)
                  ? visibilityLabels.showSeries(item.label)
                  : visibilityLabels.hideSeries(item.label)
              }
              type="button"
            >
              <svg aria-hidden="true" data-wcl-chart-eye="" focusable="false" viewBox="0 0 24 24">
                {hiddenIds.includes(item.id) ? (
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
          )}
        </li>
      ))}
    </ul>
  );
}

export function Feedback({
  copy,
  kind,
}: {
  readonly copy: ChartStateCopy;
  readonly kind: 'error' | 'invalid' | 'partial';
}): ReactElement {
  return (
    <InlineAlert title={copy.title} tone={kind === 'error' ? 'danger' : 'warning'}>
      {copy.description}
    </InlineAlert>
  );
}

export function assertText(value: string, name: string): void {
  if (value.trim().length === 0) throw new Error(`${name} must not be blank.`);
}

export function validateScale<Value extends ChartDomainValue>(
  scale: ChartScale<Value>,
  name: string,
): void {
  if (scale.type === 'categorical') {
    if (scale.domain !== undefined && scale.domain.length === 0) {
      throw new Error(`${name} categorical domain must not be empty.`);
    }
    if (scale.domain !== undefined && !scale.domain.every(isDomainValue)) {
      throw new Error(`${name} categorical domain must contain valid values.`);
    }
    if (
      scale.domain !== undefined &&
      new Set(scale.domain.map((value) => domainValueKey(value))).size !== scale.domain.length
    ) {
      throw new Error(`${name} categorical domain must not contain duplicate values.`);
    }
    return;
  }
  if (scale.type === 'normalized') return;
  if (scale.type === 'time') {
    if (
      scale.domain !== undefined &&
      (!Number.isFinite(scale.domain[0].getTime()) ||
        !Number.isFinite(scale.domain[1].getTime()) ||
        scale.domain[0] >= scale.domain[1])
    ) {
      throw new Error(`${name} time domain must contain two increasing valid dates.`);
    }
    return;
  }
  if (
    scale.domain !== undefined &&
    (!scale.domain.every(Number.isFinite) || scale.domain[0] >= scale.domain[1])
  ) {
    throw new Error(`${name} numeric domain must contain two increasing finite values.`);
  }
  if (
    scale.type === 'logarithmic' &&
    ((scale.domain !== undefined && scale.domain[0] <= 0) ||
      (scale.base !== undefined &&
        (!Number.isFinite(scale.base) || scale.base <= 0 || scale.base === 1)))
  ) {
    throw new Error(
      `${name} logarithmic scale requires a positive domain and a positive base other than one.`,
    );
  }
}

function validateChart<Datum extends object, Category extends ChartDomainValue>({
  annotations,
  aspectRatio,
  categoryAxis,
  dataTableLabel,
  description,
  emptyState,
  invalidData,
  layout,
  legend,
  minimumSize,
  series,
  status,
  title,
  valueAxis,
  visibilityLabels,
}: ChartFrameProps<Datum, Category>): void {
  if (visibilityLabels !== undefined) {
    if (legend === undefined) throw new Error('Chart visibility controls require a named legend.');
    assertText(visibilityLabels.hidden, 'Hidden-series label');
    assertText(visibilityLabels.showAll, 'Show-all label');
    assertText(visibilityLabels.allHidden.title, 'All-hidden title');
    assertText(visibilityLabels.allHidden.description, 'All-hidden description');
    for (const item of series) {
      assertText(visibilityLabels.hideSeries(item.label), 'Hide-series label');
      assertText(visibilityLabels.showSeries(item.label), 'Show-series label');
    }
  }
  assertText(title, 'Chart title');
  assertText(description, 'Chart description');
  assertText(dataTableLabel, 'Chart data-table label');
  assertText(categoryAxis.label, 'Category axis label');
  assertText(valueAxis.label, 'Value axis label');
  assertText(emptyState.title, 'Empty-state title');
  assertText(emptyState.description, 'Empty-state description');
  assertText(invalidData.title, 'Invalid-data title');
  assertText(invalidData.description, 'Invalid-data description');
  if (legend !== undefined) assertText(legend.label, 'Legend label');
  if (status?.kind === 'loading') assertText(status.label, 'Loading label');
  if (status?.kind === 'partial' || status?.kind === 'error') {
    assertText(status.title, 'Status title');
    assertText(status.description, 'Status description');
  }
  if (aspectRatio !== undefined && (!Number.isFinite(aspectRatio) || aspectRatio <= 0)) {
    throw new Error('Chart aspectRatio must be a positive finite number.');
  }
  if (
    minimumSize !== undefined &&
    (!Number.isFinite(minimumSize.width) ||
      !Number.isFinite(minimumSize.height) ||
      minimumSize.width <= 0 ||
      minimumSize.height <= 0)
  ) {
    throw new Error('Chart minimumSize dimensions must be positive finite numbers.');
  }
  const ids = new Set<string>();
  for (const item of series) {
    assertText(item.id, 'Series id');
    assertText(item.label, 'Series label');
    if (ids.has(item.id)) throw new Error(`Chart series id "${item.id}" is duplicated.`);
    ids.add(item.id);
  }
  for (const annotation of annotations) assertText(annotation.label, 'Annotation label');
  if (series.length > defaultColors.length) {
    throw new Error(`Charts support at most ${defaultColors.length} series.`);
  }
  const categoryScaleType: string = categoryAxis.scale.type;
  if (categoryScaleType === 'normalized') {
    throw new Error('A normalized scale cannot be used as a chart data axis.');
  }
  validateScale(categoryAxis.scale, 'Category axis');
  validateScale(valueAxis.scale, 'Value axis');
  if (series.length > 1 && legend === undefined) {
    throw new Error('Charts with more than one series require a visible legend.');
  }
  if (
    valueAxis.scale.type === 'logarithmic' &&
    series.some((item) => item.kind === 'area' || item.kind === 'bar' || item.kind === 'column')
  ) {
    throw new Error('Area, bar, and column marks require a value scale with a representable zero.');
  }
  if (
    valueAxis.scale.type === 'linear' &&
    valueAxis.scale.domain !== undefined &&
    (valueAxis.scale.domain[0] > 0 || valueAxis.scale.domain[1] < 0) &&
    series.some((item) => item.kind === 'area' || item.kind === 'bar' || item.kind === 'column')
  ) {
    throw new Error(
      'Explicit linear domains for area, bar, and column marks must include their zero baseline.',
    );
  }
  if (layout === 'normalized' && valueAxis.scale.type !== 'normalized') {
    throw new Error('A normalized chart layout requires a normalized value scale.');
  }
  if (layout !== 'normalized' && valueAxis.scale.type === 'normalized') {
    throw new Error('A normalized value scale requires a normalized chart layout.');
  }
}

function ChartFrame<Datum extends object, Category extends ChartDomainValue>({
  annotations,
  aspectRatio = 1.75,
  categoryAxis,
  categoryPlacement,
  data,
  dataTableLabel,
  description,
  emptyState,
  invalidData,
  layout,
  legend,
  minimumSize = {height: 180, width: 320},
  overflow = 'scroll',
  rootAttribute,
  series: allSeries,
  status = {kind: 'ready'},
  title,
  valueAxis,
  visibilityLabels,
}: ChartFrameProps<Datum, Category>): ReactElement {
  validateChart({
    annotations,
    ...(aspectRatio === undefined ? {} : {aspectRatio}),
    categoryAxis,
    categoryPlacement,
    data,
    dataTableLabel,
    description,
    emptyState,
    invalidData,
    layout,
    ...(legend === undefined ? {} : {legend}),
    ...(minimumSize === undefined ? {} : {minimumSize}),
    ...(overflow === undefined ? {} : {overflow}),
    rootAttribute,
    series: allSeries,
    ...(visibilityLabels === undefined ? {} : {visibilityLabels}),
    ...(status === undefined ? {} : {status}),
    title,
    valueAxis,
  });
  const titleId = useId();
  const descriptionId = useId();
  const plotClipId = useId();
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);
  const [frameElement, setFrameElement] = useState<HTMLDivElement | null>(null);
  const [availableWidth, setAvailableWidth] = useState<number | null>(null);
  const [svgElement, setSvgElement] = useState<SVGSVGElement | null>(null);
  const [keyboardReading, setKeyboardReading] = useState<ChartReading | null>(null);
  const [pointerReading, setPointerReading] = useState<ChartReading | null>(null);
  const [touchReading, setTouchReading] = useState<ChartReading | null>(null);
  const [transientLegendSeriesId, setTransientLegendSeriesId] = useState<string | null>(null);
  const [pinnedLegendSeriesId, setPinnedLegendSeriesId] = useState<string | null>(null);
  const [hiddenSeriesIds, setHiddenSeriesIds] = useState<readonly string[]>([]);
  const firstEye = useRef<HTMLButtonElement | null>(null);
  const hasVisibilityControls = visibilityLabels !== undefined;
  const seriesIdentity = JSON.stringify(allSeries.map((item) => item.id));
  const visibilityIdentity = `${hasVisibilityControls}:${seriesIdentity}`;
  const [previousVisibilityIdentity, setPreviousVisibilityIdentity] = useState(visibilityIdentity);
  if (previousVisibilityIdentity !== visibilityIdentity) {
    setPreviousVisibilityIdentity(visibilityIdentity);
    const ids = allSeries.map((item) => item.id);
    setHiddenSeriesIds((current) =>
      hasVisibilityControls ? current.filter((id) => ids.includes(id)) : [],
    );
    setPinnedLegendSeriesId((current) =>
      current !== null && !ids.includes(current) ? null : current,
    );
    setTransientLegendSeriesId((current) =>
      current !== null && !ids.includes(current) ? null : current,
    );
  }
  const hiddenIds = visibilityLabels === undefined ? [] : hiddenSeriesIds;
  const visibleIndexes = allSeries.flatMap((item, index) =>
    hiddenIds.includes(item.id) ? [] : [index],
  );
  const series = allSeries.filter((item) => !hiddenIds.includes(item.id));
  const allPrepared = prepareRows(data, categoryAxis, allSeries, valueAxis, layout);
  const prepared = {
    invalidCount: allPrepared.invalidCount,
    rows: allPrepared.rows.map((row) => ({
      ...row,
      values: visibleIndexes.map((index) => row.values[index] ?? 0),
    })),
  };
  const activeReading = pointerReading ?? touchReading ?? keyboardReading;
  const availableSeriesId = (id: string | null | undefined): string | undefined =>
    id !== null && id !== undefined && series.some((item) => item.id === id) ? id : undefined;
  const validPinnedLegendSeriesId = availableSeriesId(pinnedLegendSeriesId) ?? null;
  const emphasizedSeriesId =
    availableSeriesId(pinnedLegendSeriesId) ??
    availableSeriesId(transientLegendSeriesId) ??
    availableSeriesId(activeReading?.seriesId);
  const scrollbarActivityProps = useScrollbarActivity<HTMLDivElement>();
  const isLoading = status.kind === 'loading';
  const isError = status.kind === 'error';
  const hasData = prepared.rows.length > 0;
  const rootProps: Record<string, string> = {[rootAttribute]: ''};
  if (rootAttribute === 'data-wcl-area-chart') rootProps['data-stacking'] = layout;
  if (rootAttribute === 'data-wcl-bar-chart' || rootAttribute === 'data-wcl-column-chart') {
    rootProps['data-layout'] = layout;
  }
  const categoryLabels =
    categoryPlacement === 'x' && categoryAxis.scale.type === 'categorical'
      ? (categoryAxis.scale.domain ?? stableDomain(prepared.rows.map((row) => row.category))).map(
          (category) => truncateTickLabel(axisTickLabel(category, categoryAxis), 18),
        )
      : [];
  const presentation = presentationMetrics(
    availableWidth ?? minimumSize.width,
    minimumSize.width,
    categoryLabels,
  );
  const hasLocalOverflow =
    overflow === 'scroll' && presentation.canvasWidth > (availableWidth ?? minimumSize.width);
  const frameStyle: ChartFrameStyles = {
    '--wcl-chart-aspect-ratio': aspectRatio,
    '--wcl-chart-axis-font-size': `${presentation.fontSize / presentation.viewScale}px`,
    '--wcl-chart-grid-width': `${presentation.gridWidth}px`,
    '--wcl-chart-line-width': `${presentation.lineWidth}px`,
    '--wcl-chart-minimum-height': `${minimumSize.height}px`,
    '--wcl-chart-minimum-width': `${presentation.canvasWidth}px`,
    '--wcl-chart-point-radius': `${presentation.pointRadius / presentation.viewScale}px`,
    '--wcl-chart-point-stroke-width': `${presentation.pointStrokeWidth}px`,
  };

  useEffect(() => {
    if (frameElement === null) return;
    const measure = (): void => {
      const nextWidth = frameElement.clientWidth;
      if (nextWidth <= 0) return;
      setAvailableWidth((current) => (current === nextWidth ? current : nextWidth));
    };
    measure();
    const ResizeObserverConstructor = frameElement.ownerDocument.defaultView?.ResizeObserver;
    if (ResizeObserverConstructor === undefined) return;
    const observer = new ResizeObserverConstructor(measure);
    observer.observe(frameElement);
    return () => observer.disconnect();
  }, [frameElement]);

  useEffect(() => {
    if (touchReading === null) return;
    const dismissTouchReading = (event: globalThis.PointerEvent): void => {
      if (event.target instanceof Node && !rootElement?.contains(event.target)) {
        setTouchReading(null);
      }
    };
    document.addEventListener('pointerdown', dismissTouchReading);
    return () => document.removeEventListener('pointerdown', dismissTouchReading);
  }, [rootElement, touchReading]);

  const rawDomain = valueDomain(prepared.rows, layout, series);
  const targetProjection = createProjection(
    valueAxis.scale,
    rawDomain,
    [0, 1],
    valueAxis.tickCount ?? 5,
    false,
  );
  const targetDomain: readonly [number, number] = [
    targetProjection.domain?.[0] ?? 0,
    targetProjection.domain?.[1] ?? 1,
  ];
  const animatedDomain = useAnimatedChartDomain(
    targetDomain,
    hasVisibilityControls &&
      !isLoading &&
      !isError &&
      hasData &&
      series.length > 0 &&
      valueAxis.scale.type !== 'normalized' &&
      valueAxis.scale.domain === undefined,
    valueAxis.scale.type === 'logarithmic',
  );
  const animatedScale =
    valueAxis.scale.type === 'normalized'
      ? valueAxis.scale
      : {...valueAxis.scale, domain: animatedDomain};

  let content: ReactNode;
  if (isLoading) {
    content = (
      <div data-wcl-chart-feedback="">
        <Spinner isActive label={status.label} />
      </div>
    );
  } else if (isError) {
    content = <Feedback copy={status} kind="error" />;
  } else if (!hasData) {
    content = (
      <EmptyState
        description={data.length === 0 ? emptyState.description : invalidData.description}
        kind={data.length === 0 ? 'no-data' : 'unavailable'}
        title={data.length === 0 ? emptyState.title : invalidData.title}
      />
    );
  } else if (series.length === 0 && visibilityLabels !== undefined) {
    content = (
      <>
        {status.kind === 'partial' ? <Feedback copy={status} kind="partial" /> : null}
        {prepared.invalidCount > 0 ? <Feedback copy={invalidData} kind="invalid" /> : null}
        <div data-wcl-chart-all-hidden="" style={frameStyle}>
          <strong>{visibilityLabels.allHidden.title}</strong>
          <p>{visibilityLabels.allHidden.description}</p>
          <button
            data-wcl-chart-show-all=""
            onClick={() => {
              setHiddenSeriesIds([]);
              firstEye.current?.focus();
            }}
            type="button"
          >
            {visibilityLabels.showAll}
          </button>
        </div>
      </>
    );
  } else {
    const usesBars = series.some((item) => item.kind === 'bar' || item.kind === 'column');
    const categoryValues = prepared.rows.map((row) => row.category);
    const createPlotProjections = (bounds: PlotBounds) => ({
      categoryProjection: createProjection(
        categoryAxis.scale,
        categoryValues,
        categoryPlacement === 'x' ? [bounds.left, bounds.right] : [bounds.top, bounds.bottom],
        categoryAxis.tickCount ?? 6,
        usesBars,
      ),
      valueProjection: createProjection(
        animatedScale,
        rawDomain,
        categoryPlacement === 'x' ? [bounds.bottom, bounds.top] : [bounds.left, bounds.right],
        valueAxis.tickCount ?? 5,
        false,
      ),
    });
    const presentationPlot = plotForPresentation(presentation);
    const preliminaryProjections = createPlotProjections(presentationPlot);
    const yAxisLabels =
      categoryPlacement === 'x'
        ? targetProjection.ticks.map((tick) => axisTickLabel(tick, valueAxis))
        : preliminaryProjections.categoryProjection.ticks.map((tick) => {
            const label = axisTickLabel(tick, categoryAxis);
            return categoryAxis.scale.type === 'categorical' ? truncateTickLabel(label, 14) : label;
          });
    const plot = plotForYAxisLabels(
      yAxisLabels,
      presentation.fontSize / presentation.viewScale / 16,
      presentationPlot,
    );
    const {categoryProjection, valueProjection} = createPlotProjections(plot);
    const references = readingReferences(annotations, categoryPlacement);
    const readingRow = activeReading === null ? undefined : prepared.rows[activeReading.index];
    const readingValues =
      readingRow === undefined
        ? []
        : displayedValues(readingRow, layout).map((value) => formatReadingValue(value, valueAxis));
    const readingAnnouncement =
      readingRow === undefined
        ? ''
        : [
            axisTickLabel(readingRow.category, categoryAxis),
            ...series.map((item, index) => `${item.label}: ${readingValues[index] ?? ''}`),
            ...references.map(
              (reference) =>
                `${reference.label}: ${formatReadingValue(reference.value, valueAxis)}`,
            ),
          ].join('. ');
    const readingFromPointer = (
      event: PointerEvent<SVGSVGElement>,
      followPointer: boolean,
    ): ChartReading | null => {
      const {x, y} = viewBoxPointFromPointer(event.currentTarget, event.clientX, event.clientY);
      if (x < plot.left || x > plot.right || y < plot.top || y > plot.bottom) return null;
      const target = event.target instanceof Element ? event.target : null;
      const targetRow = Number(target?.closest('[data-row-index]')?.getAttribute('data-row-index'));
      const coordinate = categoryPlacement === 'x' ? x : y;
      const index =
        Number.isInteger(targetRow) && targetRow >= 0 && targetRow < prepared.rows.length
          ? targetRow
          : nearestReadingIndex(prepared.rows, categoryProjection, coordinate);
      if (index === null) return null;
      const seriesId = target?.closest('[data-series]')?.getAttribute('data-series') ?? undefined;
      return {
        index,
        ...(followPointer ? {pointer: {x: event.clientX, y: event.clientY}} : {}),
        ...(seriesId === undefined ? {} : {seriesId}),
      };
    };
    const movePointerReading = (event: PointerEvent<SVGSVGElement>): void => {
      if (event.pointerType === 'touch') return;
      setPointerReading(readingFromPointer(event, true));
    };
    const retainTouchReading = (event: PointerEvent<SVGSVGElement>): void => {
      if (event.pointerType !== 'touch') return;
      const reading = readingFromPointer(event, false);
      if (reading === null) return;
      setPointerReading(null);
      setTouchReading(reading);
    };
    const revealCategory = (index: number, frame: HTMLElement | null): void => {
      if (categoryPlacement !== 'x' || frame === null) return;
      const row = prepared.rows[index];
      if (row === undefined) return;
      const position = categoryProjection.position(row.category);
      if (position === undefined) return;
      const maximumScroll = Math.max(0, frame.scrollWidth - frame.clientWidth);
      if (maximumScroll === 0 || typeof frame.scrollTo !== 'function') return;
      const categoryCenter = (position / viewWidth) * frame.scrollWidth;
      const physicalLeft = clamp(0, categoryCenter - frame.clientWidth / 2, maximumScroll);
      frame.scrollTo({
        left: inheritedDirection(frame) === 'rtl' ? physicalLeft - maximumScroll : physicalLeft,
      });
    };
    const focusChart = (event: FocusEvent<HTMLDivElement>): void => {
      if (event.currentTarget === event.target && keyboardReading === null) {
        revealCategory(0, event.currentTarget.parentElement);
        setKeyboardReading({index: 0});
      }
    };
    const blurChart = (event: FocusEvent<HTMLDivElement>): void => {
      if (
        event.relatedTarget instanceof Node &&
        event.currentTarget.contains(event.relatedTarget)
      ) {
        return;
      }
      setKeyboardReading(null);
    };
    const readWithKeyboard = (event: KeyboardEvent<HTMLDivElement>): void => {
      const previousIndex = keyboardReading?.index ?? activeReading?.index ?? 0;
      let nextIndex: number | null = null;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = prepared.rows.length - 1;
      if (
        (categoryPlacement === 'x' && event.key === 'ArrowLeft') ||
        (categoryPlacement === 'y' && event.key === 'ArrowUp')
      ) {
        nextIndex = Math.max(0, previousIndex - 1);
      }
      if (
        (categoryPlacement === 'x' && event.key === 'ArrowRight') ||
        (categoryPlacement === 'y' && event.key === 'ArrowDown')
      ) {
        nextIndex = Math.min(prepared.rows.length - 1, previousIndex + 1);
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        setKeyboardReading(null);
        setPointerReading(null);
        setTouchReading(null);
        return;
      }
      if (nextIndex === null) return;
      event.preventDefault();
      revealCategory(nextIndex, event.currentTarget.parentElement);
      setKeyboardReading({index: nextIndex});
      setPointerReading(null);
      setTouchReading(null);
    };
    content = (
      <>
        {status.kind === 'partial' ? <Feedback copy={status} kind="partial" /> : null}
        {prepared.invalidCount > 0 ? <Feedback copy={invalidData} kind="invalid" /> : null}
        <div
          {...scrollbarActivityProps}
          aria-labelledby={hasLocalOverflow ? titleId : undefined}
          data-overflow={overflow}
          data-scrollable={hasLocalOverflow ? '' : undefined}
          data-wcl-chart-frame=""
          ref={setFrameElement}
          role={hasLocalOverflow ? 'region' : undefined}
          style={frameStyle}
          tabIndex={hasLocalOverflow ? 0 : undefined}
        >
          <div
            aria-keyshortcuts={
              categoryPlacement === 'x'
                ? 'ArrowLeft ArrowRight Home End Escape'
                : 'ArrowUp ArrowDown Home End Escape'
            }
            aria-labelledby={titleId}
            data-stagger={presentation.staggerLabels ? '' : undefined}
            data-wcl-chart-canvas=""
            onBlur={blurChart}
            onFocus={focusChart}
            onKeyDown={readWithKeyboard}
            role="group"
            tabIndex={0}
          >
            <svg
              aria-hidden="true"
              data-wcl-chart-svg=""
              focusable="false"
              onPointerDown={retainTouchReading}
              onPointerLeave={() => setPointerReading(null)}
              onPointerMove={movePointerReading}
              ref={setSvgElement}
              viewBox={`0 0 ${viewWidth} ${viewHeight}`}
            >
              {categoryPlacement === 'x' ? (
                <>
                  <Axis
                    axis={categoryAxis}
                    placement="x"
                    plot={plot}
                    presentation={presentation}
                    projection={categoryProjection}
                    staggerLabels={presentation.staggerLabels}
                  />
                  <Axis
                    axis={valueAxis}
                    placement="y"
                    plot={plot}
                    presentation={presentation}
                    projection={valueProjection}
                  />
                </>
              ) : (
                <>
                  <Axis
                    axis={valueAxis}
                    placement="x"
                    plot={plot}
                    presentation={presentation}
                    projection={valueProjection}
                  />
                  <Axis
                    axis={categoryAxis}
                    placement="y"
                    plot={plot}
                    presentation={presentation}
                    projection={categoryProjection}
                  />
                </>
              )}
              <rect
                data-wcl-chart-hit-region=""
                height={plotHeight(plot)}
                width={plotWidth(plot)}
                x={plot.left}
                y={plot.top}
              />
              <defs>
                <clipPath id={plotClipId}>
                  <rect
                    x={plot.left - 4}
                    y={plot.top - 4}
                    width={plotWidth(plot) + 8}
                    height={plotHeight(plot) + 8}
                  />
                </clipPath>
              </defs>
              <Annotations
                annotations={annotations}
                categoryPlacement={categoryPlacement}
                categoryProjection={categoryProjection}
                layer="background"
                plot={plot}
                valueProjection={valueProjection}
              />
              <g clipPath={hasVisibilityControls ? `url(#${plotClipId})` : undefined}>
                <Marks
                  categoryPlacement={categoryPlacement}
                  categoryProjection={categoryProjection}
                  emphasizedSeriesId={emphasizedSeriesId}
                  layout={layout}
                  plot={plot}
                  rows={prepared.rows}
                  series={series}
                  valueProjection={valueProjection}
                />
              </g>
              <Annotations
                annotations={annotations}
                categoryPlacement={categoryPlacement}
                categoryProjection={categoryProjection}
                layer="foreground"
                plot={plot}
                valueProjection={valueProjection}
              />
              <g clipPath={hasVisibilityControls ? `url(#${plotClipId})` : undefined}>
                {activeReading === null ? null : (
                  <ReadingOverlay
                    categoryPlacement={categoryPlacement}
                    categoryProjection={categoryProjection}
                    emphasizedSeriesId={emphasizedSeriesId}
                    layout={layout}
                    plot={plot}
                    reading={activeReading}
                    rows={prepared.rows}
                    series={series}
                    valueProjection={valueProjection}
                  />
                )}
              </g>
            </svg>
            {activeReading === null ? null : (
              <ReadingTooltip
                categoryAxis={categoryAxis}
                categoryPlacement={categoryPlacement}
                categoryProjection={categoryProjection}
                emphasizedSeriesId={emphasizedSeriesId}
                layout={layout}
                plot={plot}
                portalTarget={rootElement?.closest('[data-wcl-provider]') ?? document.body}
                references={references}
                reading={activeReading}
                rows={prepared.rows}
                series={series}
                valueAxis={valueAxis}
                valueProjection={valueProjection}
                svg={svgElement}
              />
            )}
          </div>
        </div>
        <div aria-atomic="true" aria-live="polite" data-wcl-chart-reading-announcement="">
          {readingAnnouncement}
        </div>
      </>
    );
  }

  return (
    <figure
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      data-wcl-chart=""
      ref={setRootElement}
      {...rootProps}
    >
      <figcaption data-wcl-chart-caption="">
        <strong id={titleId}>{title}</strong>
        <p id={descriptionId}>{description}</p>
      </figcaption>
      {!isLoading && !isError && hasData && legend !== undefined ? (
        <Legend
          hiddenIds={hiddenIds}
          visibilityLabels={visibilityLabels}
          onFirstEye={(element) => {
            firstEye.current = element;
          }}
          onVisibilityChange={(id) => {
            setHiddenSeriesIds((current) =>
              current.includes(id) ? current.filter((hidden) => hidden !== id) : [...current, id],
            );
            if (pinnedLegendSeriesId === id) setPinnedLegendSeriesId(null);
            if (transientLegendSeriesId === id) setTransientLegendSeriesId(null);
            setPointerReading(null);
          }}
          emphasizedSeriesId={emphasizedSeriesId}
          legend={legend}
          onClear={() => {
            setPinnedLegendSeriesId(null);
            setTransientLegendSeriesId(null);
          }}
          onPin={(id) => setPinnedLegendSeriesId((current) => (current === id ? null : id))}
          onTransientChange={setTransientLegendSeriesId}
          pinnedSeriesId={validPinnedLegendSeriesId}
          series={allSeries}
        />
      ) : null}
      {content}
      {!isLoading && !isError && hasData ? (
        <>
          <DataTable
            categoryAxis={categoryAxis}
            dataTableLabel={dataTableLabel}
            hiddenIds={hiddenIds}
            {...(visibilityLabels === undefined ? {} : {hiddenLabel: visibilityLabels.hidden})}
            layout={layout}
            rows={allPrepared.rows}
            series={allSeries}
            valueAxis={valueAxis}
          />
          <AnnotationSummary
            annotations={annotations}
            categoryAxis={categoryAxis}
            categoryPlacement={categoryPlacement}
            valueAxis={valueAxis}
          />
        </>
      ) : null}
    </figure>
  );
}

function normalizeSeries<Datum extends object>(
  series: NonEmptyChartSeries<
    | ChartLineSeries<Datum>
    | ChartAreaSeries<Datum>
    | ChartBarSeries<Datum>
    | CartesianChartSeries<Datum>
  >,
  kind: SeriesKind | undefined,
): InternalSeries<Datum>[] {
  const claimedColors = new Set<ChartColor>();
  for (const item of series) {
    if (item.color !== undefined && defaultColors.includes(item.color)) {
      claimedColors.add(item.color);
    }
  }
  let automaticColorIndex = 0;
  const nextAutomaticColor = (): ChartColor => {
    while (
      automaticColorIndex < defaultColors.length &&
      claimedColors.has(defaultColors[automaticColorIndex] ?? 'accent')
    ) {
      automaticColorIndex += 1;
    }
    const color = defaultColors[automaticColorIndex] ?? 'accent';
    automaticColorIndex += 1;
    claimedColors.add(color);
    return color;
  };

  return series.map((item, patternIndex) => {
    const color = item.color ?? nextAutomaticColor();
    return {
      accessor: item.accessor,
      patternIndex,
      color,
      curve: 'curve' in item ? (item.curve ?? 'linear') : 'linear',
      id: item.id,
      kind: kind ?? ('kind' in item ? item.kind : 'line'),
      label: item.label,
      showPoints: 'showPoints' in item ? (item.showPoints ?? false) : false,
    };
  });
}

export function LineChart<Datum extends object, XValue extends ChartDomainValue>(
  props: LineChartProps<Datum, XValue>,
): ReactElement {
  return (
    <ChartFrame
      {...props}
      annotations={props.annotations ?? []}
      categoryAxis={props.xAxis}
      categoryPlacement="x"
      layout="overlap"
      rootAttribute="data-wcl-line-chart"
      series={normalizeSeries(props.series, 'line')}
      valueAxis={props.yAxis}
    />
  );
}

export function AreaChart<Datum extends object, XValue extends ChartDomainValue>(
  props: AreaChartProps<Datum, XValue>,
): ReactElement {
  return (
    <ChartFrame
      {...props}
      annotations={props.annotations ?? []}
      categoryAxis={props.xAxis}
      categoryPlacement="x"
      layout={props.stacking ?? 'overlap'}
      rootAttribute="data-wcl-area-chart"
      series={normalizeSeries(props.series, 'area')}
      valueAxis={props.yAxis}
    />
  );
}

export function ColumnChart<Datum extends object, XValue extends ChartDomainValue>(
  props: ColumnChartProps<Datum, XValue>,
): ReactElement {
  return (
    <ChartFrame
      {...props}
      annotations={props.annotations ?? []}
      categoryAxis={props.xAxis}
      categoryPlacement="x"
      layout={props.layout ?? 'grouped'}
      rootAttribute="data-wcl-column-chart"
      series={normalizeSeries(props.series, 'column')}
      valueAxis={props.yAxis}
    />
  );
}

export function BarChart<Datum extends object, YValue extends ChartDomainValue>(
  props: BarChartProps<Datum, YValue>,
): ReactElement {
  return (
    <ChartFrame
      {...props}
      annotations={
        (props.annotations ?? []) as unknown as readonly ChartAnnotation<YValue, number>[]
      }
      categoryAxis={props.yAxis}
      categoryPlacement="y"
      layout={props.layout ?? 'grouped'}
      rootAttribute="data-wcl-bar-chart"
      series={normalizeSeries(props.series, 'bar')}
      valueAxis={props.xAxis}
    />
  );
}

export function CartesianChart<Datum extends object, XValue extends ChartDomainValue>(
  props: CartesianChartProps<Datum, XValue>,
): ReactElement {
  return (
    <ChartFrame
      {...props}
      annotations={props.annotations ?? []}
      categoryAxis={props.xAxis}
      categoryPlacement="x"
      layout="grouped"
      rootAttribute="data-wcl-cartesian-chart"
      series={normalizeSeries(props.series, undefined)}
      valueAxis={props.yAxis}
    />
  );
}
