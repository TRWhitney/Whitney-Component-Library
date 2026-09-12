import {ChartSelectionPresentation} from './chart-selection-presentation.js';
import {ChartExplorationControls} from './chart-exploration-controls.js';
import {ChartExplorationLayer} from './chart-exploration-layer.js';
import {useChartExploration} from './use-chart-exploration.js';
import {useChartExplorationGesture} from './use-chart-exploration-gesture.js';
import {ChartVisibilityButton} from './chart-visibility-button.js';
import {
  ChartActivationOutline,
  chartActivationOutset,
  chartActivationPointRadius,
} from './chart-activation.js';
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
  useMemo,
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
import {useFocusVisible} from 'react-aria';

import {barRectangle, clipBar, frameBar, barContour} from './bar-interaction-geometry.js';
import {EmptyState} from '../feedback/empty-state.js';
import {InlineAlert} from '../feedback/alerts.js';
import {Spinner} from '../feedback/spinner.js';
import {useScrollbarActivity} from '../scrollbar-activity.js';
import {
  nearestInteraction,
  selectionKey,
  useChartInteraction,
  type InteractionPoint,
} from './chart-interaction.js';
import {useAnimatedChartDomain} from './use-animated-chart-domain.js';
import {useChartDataMotion} from './use-chart-data-motion.js';
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
  ChartExploration,
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
  ChartInteraction,
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
const categoryBandPadding = 0.18;
const minimumCategoryStep = 20;
const compactPlot = {bottom: 306, left: 60, right: 620, top: 18} as const;
export const defaultColors: readonly ChartColor[] = [
  'accent',
  'series-2',
  'series-3',
  'series-4',
  'series-5',
  'series-6',
];

type SeriesKind = 'area' | 'bar' | 'column' | 'line' | 'range';

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
  readonly lowerAccessor?: ChartAccessor<Datum, number>;
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
  readonly lowerValues?: readonly number[];
  readonly source?: PreparedRow<Datum, Category>;
  readonly motionId?: string;
  readonly opacity?: number;
  readonly exiting?: boolean;
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
  readonly exploration?: ChartExploration<Category>;
  readonly interaction?: ChartInteraction<Datum, Category>;
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

  const hasRanges = series.some((item) => item.kind === 'range');
  data.forEach((datum, index) => {
    const category = readAccessor(categoryAxis.accessor, datum, index);
    const isInExplicitDomain =
      isDomainValue(category) &&
      (categoryAxis.scale.type !== 'categorical' ||
        categoryAxis.scale.domain === undefined ||
        categoryAxis.scale.domain.some(
          (domainValue) => domainValueKey(domainValue) === domainValueKey(category),
        ));
    if (
      !isDomainValue(category) ||
      !isValueForScale(category, categoryAxis.scale) ||
      !isInExplicitDomain
    ) {
      invalidCount += 1;
      return;
    }
    let invalid = false;
    const lowerValues = series.map((item) =>
      item.lowerAccessor === undefined ? 0 : readAccessor(item.lowerAccessor, datum, index),
    );
    const values = series.map((item, seriesIndex) => {
      const value = readAccessor(item.accessor, datum, index);
      const lower = lowerValues[seriesIndex];
      const missing = value == null || (item.kind === 'range' && lower == null);
      const valid =
        typeof value === 'number' &&
        Number.isFinite(value) &&
        (valueAxis.scale.type !== 'logarithmic' || value > 0) &&
        ((layout !== 'stacked' && layout !== 'normalized') || value >= 0) &&
        (item.kind !== 'range' ||
          (typeof lower === 'number' && Number.isFinite(lower) && lower <= value));
      if (!valid && (!hasRanges || !missing)) invalid = true;
      return valid ? value : Number.NaN;
    });
    if (invalid) invalidCount += 1;
    if (!hasRanges && invalid) return;
    rows.push({
      category,
      datum,
      index,
      values,
      ...(hasRanges
        ? {
            lowerValues: lowerValues.map((value, i) =>
              Number.isFinite(values[i]) && typeof value === 'number' ? value : Number.NaN,
            ),
          }
        : {}),
    });
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
      const band: ScaleBand<Value> = scaleBand<Value>()
        .domain(domain)
        .range(range)
        .padding(categoryBandPadding);
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
  const needsZero = series.some((item) => item.kind !== 'line' && item.kind !== 'range');
  return rows
    .flatMap((row) => [
      ...(needsZero ? [0] : []),
      ...row.values,
      ...series.flatMap((item, index) =>
        item.kind === 'range' ? [row.lowerValues?.[index] ?? Number.NaN] : [],
      ),
    ])
    .filter(Number.isFinite);
}

function explorationValueDomain<Datum extends object, Category extends ChartDomainValue>(
  rows: readonly PreparedRow<Datum, Category>[],
  series: readonly InternalSeries<Datum>[],
  layout: ChartBarLayout | ChartStacking,
  position: (value: Category) => number,
  window: readonly [number, number],
  logarithmic: boolean,
): number[] {
  const values: number[] = [];
  const transform = (value: number) => (logarithmic ? Math.log(value) : value);
  const inverse = (value: number) => (logarithmic ? Math.exp(value) : value);
  rows.forEach((row, index) => {
    const x = position(row.category);
    if (x >= window[0] && x <= window[1]) values.push(...valueDomain([row], layout, series));
    const next = rows[index + 1];
    if (!next) return;
    const nextX = position(next.category);
    if (x === nextX || Math.max(x, nextX) < window[0] || Math.min(x, nextX) > window[1]) return;
    series.forEach((item, seriesIndex) => {
      if (item.kind !== 'line' && item.kind !== 'area' && item.kind !== 'range') return;
      const left = coordinates(row, seriesIndex, layout),
        right = coordinates(next, seriesIndex, layout);
      if (!Number.isFinite(left.end) || !Number.isFinite(right.end)) return;
      for (const key of item.kind !== 'line' ? (['start', 'end'] as const) : (['end'] as const)) {
        for (const edge of [
          Math.max(window[0], Math.min(x, nextX)),
          Math.min(window[1], Math.max(x, nextX)),
        ]) {
          const t = (edge - x) / (nextX - x);
          if (item.curve === 'step') {
            values.push(t < 0.5 ? left[key] : right[key]);
            if (
              Math.min(x, nextX) + Math.abs(nextX - x) / 2 >= window[0] &&
              Math.min(x, nextX) + Math.abs(nextX - x) / 2 <= window[1]
            )
              values.push(left[key], right[key]);
          } else
            values.push(
              inverse(transform(left[key]) + (transform(right[key]) - transform(left[key])) * t),
            );
        }
      }
    });
  });
  return values;
}

const numberFormatter = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2});

function formatValue(value: ChartDomainValue, scale: ChartScale<ChartDomainValue>): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'number') {
    if (scale.type === 'normalized') return `${Math.round(value * 100)}%`;
    return Number.isInteger(value) ? String(value) : numberFormatter.format(value);
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

function tickLabelOffset(staggered: boolean, index: number): number {
  return staggered && index % 2 === 1 ? 2.625 : 1.125;
}

export function plotForPresentation(presentation: PresentationMetrics): PlotBounds {
  const axisFontSize = presentation.fontSize / presentation.viewScale;
  const tickOffset = axisFontSize * tickLabelOffset(presentation.staggerLabels, 1);
  const labelGap = axisFontSize * 1.45;
  return {
    ...compactPlot,
    bottom: Math.min(compactPlot.bottom, viewHeight - 7 - tickOffset - labelGap),
  };
}

function axisTitle(axis: {readonly label: string; readonly unit?: string}): string {
  return `${axis.label}${axis.unit === undefined ? '' : ` (${axis.unit})`}`;
}

function verticalTitleLines(
  title: string,
  fontSize: number,
  bounds: PlotBounds,
  viewportHeight = viewHeight,
): string[] {
  const center = bounds.top + plotHeight(bounds) / 2;
  const available = Math.min(center, viewportHeight - center) * 2 - fontSize;
  const lines: string[] = [];
  let line = '';
  for (const word of title.split(' ')) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && (estimatedUtilityTextWidth(candidate) * fontSize) / 16 > available) {
      lines.push(line);
      line = word;
    } else line = candidate;
  }
  if (line) lines.push(line);
  return lines;
}

export function plotForYAxisLabels(
  labels: readonly string[],
  fontScale: number,
  bounds: PlotBounds,
  title = '',
  viewportHeight = viewHeight,
): PlotBounds {
  const widestLabel =
    Math.max(0, ...labels.map((label) => [...label].length * 16 * 0.62)) * fontScale;
  const fontSize = fontScale * 16;
  const lines = verticalTitleLines(title, fontSize, bounds, viewportHeight);
  const titleSpace = fontSize * Math.max(1, lines.length) * 1.25 + 14;
  const left = Math.max(
    compactPlot.left,
    Math.min(viewWidth / 2, Math.ceil(widestLabel + titleSpace)),
  );
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
  viewportHeight = viewHeight,
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
  readonly viewportHeight?: number;
}): ReactElement {
  const horizontal = placement === 'x';
  const titleFontSize = presentation.fontSize / presentation.viewScale;
  const titleX = titleFontSize + 4;
  const title = axisTitle(axis);
  const titleLines = horizontal
    ? [title]
    : verticalTitleLines(title, titleFontSize, plot, viewportHeight);
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
                        tickLabelOffset(true, sourceIndex)
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
        transform={
          horizontal ? undefined : `rotate(-90 ${titleX} ${plot.top + plotHeight(plot) / 2})`
        }
        x={horizontal ? plot.left + plotWidth(plot) / 2 : titleX}
        y={horizontal ? viewportHeight - 7 : plot.top + plotHeight(plot) / 2}
      >
        {titleLines.length === 1
          ? title
          : titleLines.map((line, index) => (
              <tspan
                key={index}
                x={titleX}
                y={plot.top + plotHeight(plot) / 2 + index * titleFontSize * 1.25}
              >
                {line}
                {index < titleLines.length - 1 ? ' ' : ''}
              </tspan>
            ))}
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
  if (layout === 'overlap' || layout === 'grouped')
    return {end: value, start: row.lowerValues?.[seriesIndex] ?? 0};
  const total =
    layout === 'normalized' ? row.values.reduce((sum, item) => sum + Math.max(0, item), 0) : 1;
  const divisor = total === 0 ? 1 : total;
  const start =
    row.values.slice(0, seriesIndex).reduce((sum, item) => sum + Math.max(0, item), 0) / divisor;
  return {end: start + Math.max(0, value) / divisor, start};
}

function formatSeriesReading<Datum extends object, Category extends ChartDomainValue>(
  row: PreparedRow<Datum, Category>,
  seriesIndex: number,
  item: InternalSeries<Datum>,
  layout: ChartBarLayout | ChartStacking,
  axis: ChartValueAxis,
  includeUnit = true,
): string {
  row = row.source ?? row;
  const value = displayedValues(row, layout)[seriesIndex];
  if (value === undefined || !Number.isFinite(value)) return '—';
  const format = (n: number) =>
    includeUnit ? formatReadingValue(n, axis) : axisTickLabel(n, axis);
  return item.kind === 'range'
    ? `${format(row.lowerValues![seriesIndex]!)} – ${format(value)}`
    : format(value);
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
  visibleIndexes?: readonly number[],
): number | null {
  let nearestIndex: number | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;
  rows.forEach((row, index) => {
    if (visibleIndexes && !visibleIndexes.includes(index)) return;
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
  const [, , width = viewWidth, height = viewHeight] =
    svg.getAttribute('viewBox')?.trim().split(/\s+/).map(Number) ?? [];
  const scale = Math.min(rectangle.width / width, rectangle.height / height);
  if (!Number.isFinite(scale) || scale <= 0) return {left: 0, scale: 1, top: 0};
  return {
    left: rectangle.left + (rectangle.width - width * scale) / 2,
    scale,
    top: rectangle.top + (rectangle.height - height * scale) / 2,
  };
}

export function viewBoxPointFromPointer(
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
  pointTarget = false,
  hideNeedle = false,
  filledPresentation,
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
  readonly pointTarget?: boolean;
  readonly hideNeedle?: boolean;
  readonly filledPresentation?: PresentationMetrics;
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
      {hideNeedle ? null : (
        <line
          data-wcl-chart-reading-needle=""
          x1={categoryPlacement === 'x' ? category : plot.left}
          x2={categoryPlacement === 'x' ? category : plot.right}
          y1={categoryPlacement === 'x' ? plot.top : category}
          y2={categoryPlacement === 'x' ? plot.bottom : category}
        />
      )}
      {series.flatMap((item, seriesIndex) => {
        if (pointTarget && reading.seriesId !== item.id) return null;
        if (filledPresentation && (item.kind === 'bar' || item.kind === 'column')) return null;
        const limits = coordinates(row, seriesIndex, layout);
        return (item.kind === 'range' ? [limits.end, limits.start] : [limits.end]).map(
          (plottedValue, endpoint) => {
            const value = valueProjection.position(plottedValue);
            if (value === undefined) return null;
            const stroke = filledPresentation
              ? filledPresentation.pointStrokeWidth * (emphasizedSeriesId === item.id ? 1.5 : 1)
              : 0;
            return (
              <g key={`${item.id}-${endpoint}`} data-color={item.color}>
                {filledPresentation ? (
                  <circle
                    cx={category}
                    cy={value}
                    r={filledPresentation.pointRadius / filledPresentation.viewScale}
                    data-wcl-chart-reading-outline=""
                    style={{strokeWidth: stroke}}
                  />
                ) : null}
                <circle
                  cx={categoryPlacement === 'x' ? category : value}
                  cy={categoryPlacement === 'x' ? value : category}
                  data-active={emphasizedSeriesId === item.id ? '' : undefined}
                  data-color={item.color}
                  data-muted={
                    emphasizedSeriesId !== undefined && emphasizedSeriesId !== item.id
                      ? ''
                      : undefined
                  }
                  data-series-index={item.patternIndex}
                  data-wcl-chart-reading-node=""
                  data-filled={filledPresentation ? '' : undefined}
                  style={
                    filledPresentation
                      ? {
                          r:
                            (filledPresentation.pointRadius - stroke / 2 + 0.35) /
                            filledPresentation.viewScale,
                        }
                      : undefined
                  }
                  key={item.id}
                  r="4.5"
                />
              </g>
            );
          },
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
  const formattedValues = series.map((item, seriesIndex) =>
    row ? formatSeriesReading(row, seriesIndex, item, layout, valueAxis) : '—',
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

function barGroupWidth<Category extends ChartDomainValue>(
  projection: Projection<Category>,
  availableLength: number,
  rowCount: number,
): number {
  return projection.bandwidth > 0
    ? projection.bandwidth
    : Math.min(48, (availableLength / Math.max(rowCount, 1)) * 0.7);
}

function Marks<Datum extends object, Category extends ChartDomainValue>({
  categoryPlacement,
  categoryProjection,
  emphasizedSeriesId,
  departures = false,
  layout,
  plot,
  rows,
  series,
  valueProjection,
}: {
  readonly departures?: boolean;
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
        if (departures && item.kind !== 'bar' && item.kind !== 'column') return null;
        const color = item.color;
        if (item.kind === 'line') {
          const path = createLine<PreparedRow<Datum, Category>>()
            .defined(
              (row) =>
                categoryProjection.position(row.category) !== undefined &&
                Number.isFinite(row.values[seriesIndex]),
            )
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
                ? rows.map((row, rowIndex) =>
                    categoryProjection.position(row.category) === undefined ||
                    !Number.isFinite(row.values[seriesIndex]) ? null : (
                      <circle
                        cx={categoryProjection.position(row.category)}
                        cy={valueProjection.position(row.values[seriesIndex] ?? 0)}
                        data-row-index={row.exiting ? undefined : rowIndex}
                        opacity={row.opacity}
                        data-series={item.id}
                        data-wcl-chart-point=""
                        key={`${item.id}-${row.motionId ?? row.index}`}
                        r="3.25"
                      />
                    ),
                  )
                : null}
            </g>
          );
        }

        if (item.kind === 'area' || item.kind === 'range') {
          const path = createArea<PreparedRow<Datum, Category>>()
            .defined(
              (row) =>
                categoryProjection.position(row.category) !== undefined &&
                Number.isFinite(row.values[seriesIndex]),
            )
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
        const groupWidth = barGroupWidth(categoryProjection, availableLength, rows.length);
        const grouped = layout === 'grouped';
        const barIndex = barSeries.findIndex((bar) => bar.id === item.id);

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
              const category = categoryProjection.position(row.category);
              if (category === undefined) return null;
              const {end, start} = coordinates(row, seriesIndex, layout);
              const startPosition = valueProjection.position(start) ?? 0;
              const endPosition = valueProjection.position(end) ?? 0;
              const rect = barRectangle({
                category,
                start: startPosition,
                end: endPosition,
                groupWidth,
                seriesIndex: barIndex,
                seriesCount: barSeries.length,
                grouped,
                horizontal: isHorizontal,
              });
              return (
                <rect
                  data-row-index={row.exiting ? undefined : rowIndex}
                  data-series={item.id}
                  data-wcl-chart-bar={row.exiting ? undefined : ''}
                  data-wcl-chart-departing-bar={row.exiting ? '' : undefined}
                  opacity={row.opacity}
                  {...rect}
                  key={`${item.id}-${row.motionId ?? row.index}`}
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
  const body = useMemo(
    () =>
      rows.map((row) => (
        <tr key={row.index}>
          <th scope="row">{axisTickLabel(row.category, categoryAxis)}</th>
          {row.values.map((_, index) => (
            <td key={series[index]?.id ?? index}>
              {formatSeriesReading(row, index, series[index]!, layout, valueAxis, false)}
            </td>
          ))}
        </tr>
      )),
    [rows, series, layout, categoryAxis, valueAxis],
  );
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
      <tbody>{body}</tbody>
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
            <ChartVisibilityButton
              hidden={hiddenIds.includes(item.id)}
              label={
                hiddenIds.includes(item.id)
                  ? visibilityLabels.showSeries(item.label)
                  : visibilityLabels.hideSeries(item.label)
              }
              onToggle={() => onVisibilityChange(item.id)}
              onClear={onClear}
              buttonRef={index === 0 ? onFirstEye : undefined}
            />
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
  interaction,
  exploration,
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
  minimumSize = {height: 180, width: exploration ? 240 : 320},
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
  const {isFocusVisible} = useFocusVisible();
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
  const hiddenIds = useMemo(
    () => (visibilityLabels === undefined ? [] : hiddenSeriesIds),
    [visibilityLabels, hiddenSeriesIds],
  );
  const visibleIndexes = useMemo(
    () => allSeries.flatMap((item, index) => (hiddenIds.includes(item.id) ? [] : [index])),
    [allSeries, hiddenIds],
  );
  const series = useMemo(
    () => allSeries.filter((item) => !hiddenIds.includes(item.id)),
    [allSeries, hiddenIds],
  );
  const allPrepared = useMemo(
    () => prepareRows(data, categoryAxis, allSeries, valueAxis, layout),
    [data, categoryAxis, allSeries, valueAxis, layout],
  );
  const dataTable = useMemo(
    () => (
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
    ),
    [
      categoryAxis,
      dataTableLabel,
      hiddenIds,
      visibilityLabels,
      layout,
      allPrepared.rows,
      allSeries,
      valueAxis,
    ],
  );
  const supplied = useMemo(
    () => ({
      invalidCount: allPrepared.invalidCount,
      rows: allPrepared.rows.map((row) => ({
        ...row,
        values: visibleIndexes.map((index) => row.values[index] ?? 0),
        ...(row.lowerValues
          ? {lowerValues: visibleIndexes.map((index) => row.lowerValues![index]!)}
          : {}),
      })),
    }),
    [allPrepared, visibleIndexes],
  );
  const navigation = useChartExploration(
    exploration,
    categoryAxis.scale,
    allPrepared.rows.map((row) => row.category),
  );
  const [navigationDragging, setNavigationDragging] = useState(false);
  const changeWindow = (range: readonly [number, number], phase: 'change' | 'end' | 'cancel') => {
    setNavigationDragging(phase === 'change');
    navigation.change(range, phase);
  };
  const displayedNormalized = useAnimatedChartDomain(
    navigation.normalized,
    exploration !== undefined && !navigationDragging && categoryAxis.scale.type !== 'categorical',
    false,
  );
  const displayedCategoryScale =
    exploration && categoryAxis.scale.type !== 'categorical'
      ? ({
          ...navigation.scale,
          domain: navigation.fromNormalized(displayedNormalized),
        } as ChartScale<Category>)
      : navigation.scale;
  const windowKey = exploration ? JSON.stringify(navigation.window) : '';
  const [previousWindowKey, setPreviousWindowKey] = useState(windowKey);
  if (previousWindowKey !== windowKey) {
    setPreviousWindowKey(windowKey);
    setKeyboardReading(null);
    setPointerReading(null);
    setTouchReading(null);
  }
  const rowIds = useMemo(
    () => (interaction === undefined ? [] : data.map(interaction.getRowId)),
    [interaction, data],
  );
  if (
    interaction &&
    (rowIds.some((id) => typeof id !== 'string' || id.trim() === '') ||
      new Set(rowIds).size !== rowIds.length)
  ) {
    throw new Error(
      'Chart interaction getRowId must return a unique nonempty string for every row.',
    );
  }
  if (
    interaction?.selection?.selectedItems !== undefined &&
    interaction.selection.defaultSelectedItems !== undefined
  ) {
    throw new Error('Chart selection cannot combine selectedItems and defaultSelectedItems.');
  }
  // Source rows own identity, readings and callbacks. Only this display model moves.
  const usesBars = series.some((item) => item.kind === 'bar' || item.kind === 'column');
  const categoryKey = (category: Category): string =>
    JSON.stringify([category instanceof Date ? 'date' : typeof category, category]);
  const motionIds = supplied.rows.map((row) =>
    interaction ? rowIds[row.index]! : categoryKey(row.category),
  );
  const uniqueMotionIds = new Set(motionIds).size === motionIds.length;
  const categorical = categoryAxis.scale.type === 'categorical';
  const motionProjection = createProjection(
    exploration ? displayedCategoryScale : categoryAxis.scale,
    supplied.rows.map((row) => row.category),
    [0, 1],
    categoryAxis.tickCount ?? 6,
    usesBars,
  );
  const motionConfiguration = [
    allSeries.map((item) => [item.id, item.kind, item.curve]),
    layout,
    categoryPlacement,
    categoryAxis.scale,
    valueAxis.scale,
    status.kind,
    uniqueMotionIds,
    // A gap changes path topology; marks, axes and gutters must settle together.
    allPrepared.rows.some((row) => row.values.some((value) => !Number.isFinite(value)))
      ? allPrepared.rows.map((row) => [categoryKey(row.category), row.values.map(Number.isFinite)])
      : null,
    categorical ? null : allPrepared.rows.map((row) => categoryKey(row.category)),
  ];
  const domainResetKey = JSON.stringify(motionConfiguration);
  const motionResetKey = JSON.stringify([motionConfiguration, hiddenIds, windowKey]);
  const motionTargets = supplied.rows.map((row, index) => ({
    id: motionIds[index]!,
    value: {
      row,
      position: motionProjection.position(row.category),
      bandwidth: motionProjection.bandwidth,
    },
  }));
  const movingRows = useChartDataMotion(motionTargets, {
    enabled:
      uniqueMotionIds &&
      supplied.rows.length > 0 &&
      status.kind !== 'loading' &&
      status.kind !== 'error',
    version: JSON.stringify(
      motionTargets.map(({id, value}) => [
        id,
        value.row.category,
        value.row.values,
        value.row.lowerValues,
        value.position,
        value.bandwidth,
      ]),
    ),
    resetKey: motionResetKey,
    interpolate: (from, to, progress) => ({
      ...to,
      position:
        from.position !== undefined && to.position !== undefined
          ? from.position + (to.position - from.position) * progress
          : to.position,
      bandwidth: from.bandwidth + (to.bandwidth - from.bandwidth) * progress,
      row: {
        ...to.row,
        values: to.row.values.map((value, index) =>
          Number.isFinite(value) && Number.isFinite(from.row.values[index])
            ? from.row.values[index]! + (value - from.row.values[index]!) * progress
            : value,
        ),
        ...(to.row.lowerValues
          ? {
              lowerValues: to.row.lowerValues.map((value, index) => {
                const old = from.row.lowerValues?.[index];
                return old !== undefined && Number.isFinite(old) && Number.isFinite(value)
                  ? old + (value - old) * progress
                  : value;
              }),
            }
          : {}),
      },
    }),
  });
  const motionById = new Map(movingRows.map((item) => [item.id, item]));
  const prepared = {
    ...supplied,
    rows: supplied.rows.map((row, index) => {
      const id = motionIds[index]!;
      const displayed = uniqueMotionIds ? motionById.get(id) : undefined;
      return {
        ...row,
        values: displayed?.value.row.values ?? row.values,
        ...(row.lowerValues
          ? {lowerValues: displayed?.value.row.lowerValues ?? row.lowerValues}
          : {}),
        source: row,
        motionId: uniqueMotionIds ? id : String(row.index),
        opacity: displayed?.opacity ?? 1,
      };
    }),
  };
  const departingRows = movingRows
    .filter((item) => item.exiting)
    .map((item) => ({
      ...item.value.row,
      motionId: item.id,
      opacity: item.opacity,
      exiting: true,
    }));
  const categoryMotion = new Map(
    movingRows.map((item) => [categoryKey(item.target.row.category), item.value]),
  );
  const projectCategories = (
    projection: Projection<Category>,
    range: readonly [number, number],
  ): Projection<Category> => {
    if (!categorical || !uniqueMotionIds) return projection;
    const width = range[1] - range[0];
    const displayed = movingRows.find((item) => !item.exiting);
    return {
      ...projection,
      bandwidth: (displayed?.value.bandwidth ?? motionProjection.bandwidth) * width,
      position: (category) => {
        const value = categoryMotion.get(categoryKey(category));
        return value
          ? value.position === undefined
            ? undefined
            : range[0] + value.position * width
          : projection.position(category);
      },
    };
  };
  const interactionRows = useMemo(
    () =>
      (interaction ? allPrepared.rows : []).map((row) => ({
        id: rowIds[row.index] ?? '',
        category: row.category,
        datum: row.datum,
        ...(allSeries.some((s) => s.kind === 'range')
          ? {
              ranges: allSeries.flatMap((item, index) =>
                item.kind === 'range' && Number.isFinite(row.values[index])
                  ? [
                      {
                        seriesId: item.id,
                        label: item.label,
                        lower: row.lowerValues![index]!,
                        upper: row.values[index]!,
                        hidden: hiddenIds.includes(item.id),
                      },
                    ]
                  : [],
              ),
            }
          : {}),
        values: allSeries.flatMap((item, index) =>
          item.kind === 'range' || !Number.isFinite(row.values[index])
            ? []
            : [
                {
                  seriesId: item.id,
                  label: item.label,
                  value: row.values[index]!,
                  hidden: hiddenIds.includes(item.id),
                },
              ],
        ),
      })),
    [interaction, allPrepared.rows, rowIds, allSeries, hiddenIds],
  );
  const interactionVersion = JSON.stringify([
    interactionRows.map((row) => [row.id, domainValueKey(row.category), row.values, row.ranges]),
    status.kind,
    layout,
    categoryPlacement,
    categoryAxis.scale,
    valueAxis.scale,
    windowKey,
  ]);
  const actions = useChartInteraction(
    interaction,
    interactionRows,
    interactionVersion,
    data,
    categoryPlacement,
  );
  const navigationVersion = JSON.stringify([
    allPrepared.rows.map((row) => [row.category, row.values, row.lowerValues]),
    hiddenIds,
    categoryAxis.scale,
    valueAxis.scale,
    status.kind,
    availableWidth,
  ]);
  const [previousNavigationVersion, setPreviousNavigationVersion] = useState(navigationVersion);
  if (previousNavigationVersion !== navigationVersion) {
    setPreviousNavigationVersion(navigationVersion);
    setNavigationDragging(false);
  }
  const navigationGesture = useChartExplorationGesture({
    enabled:
      exploration !== undefined &&
      status.kind !== 'loading' &&
      status.kind !== 'error' &&
      series.length > 0,
    window: navigation.normalized,
    minimumSpan: navigation.minimumSpan,
    onChange: changeWindow,
    onStart: () => {
      actions.cancel();
      setPointerReading(null);
      setTouchReading(null);
      setKeyboardReading(null);
    },
    version: navigationVersion,
  });
  const scrollbarActivityProps = useScrollbarActivity<HTMLDivElement>();
  const isLoading = status.kind === 'loading';
  const isError = status.kind === 'error';
  const hasData = allPrepared.rows.some((row) => row.values.some(Number.isFinite));
  const rootProps: Record<string, string> = {[rootAttribute]: ''};
  if (rootAttribute === 'data-wcl-area-chart') rootProps['data-stacking'] = layout;
  if (rootAttribute === 'data-wcl-bar-chart' || rootAttribute === 'data-wcl-column-chart') {
    rootProps['data-layout'] = layout;
  }
  const horizontalLabels =
    categoryPlacement === 'x'
      ? createProjection(
          categoryAxis.scale,
          prepared.rows.map((row) => row.category),
          [0, 1],
          categoryAxis.tickCount ?? 6,
          false,
        ).ticks.map((tick) => {
          const label = axisTickLabel(tick, categoryAxis);
          return categoryAxis.scale.type === 'categorical' ? truncateTickLabel(label, 18) : label;
        })
      : createProjection(
          valueAxis.scale,
          valueDomain(allPrepared.rows, layout, allSeries),
          [0, 1],
          valueAxis.tickCount ?? 5,
          false,
        ).ticks.map((tick) => axisTickLabel(tick, valueAxis));
  const measuredPresentation = presentationMetrics(
    availableWidth ?? minimumSize.width,
    minimumSize.width,
    horizontalLabels,
  );
  // Navigation changes a viewport inside a stable canvas. Tick spacing adapts to it.
  const explorationWidth = Math.max(availableWidth ?? minimumSize.width, minimumSize.width);
  const presentation = exploration
    ? {
        ...measuredPresentation,
        canvasWidth: explorationWidth,
        viewScale: explorationWidth / viewWidth,
      }
    : measuredPresentation;
  const maximumLabelWidth = Math.max(
    1,
    ...horizontalLabels.map((label) => estimatedLabelWidth(label, presentation.fontSize)),
  );
  const navigationTickCount = Math.max(
    2,
    Math.min(
      categoryAxis.tickCount ?? 6,
      Math.floor(
        Math.max(1, explorationWidth - 104) /
          (maximumLabelWidth / (presentation.staggerLabels ? 2 : 1) + 12),
      ) + 1,
    ),
  );
  const hasLocalOverflow =
    overflow === 'scroll' && presentation.canvasWidth > (availableWidth ?? minimumSize.width);
  const basePlot = plotForPresentation(presentation);
  const categoryCount =
    categoryAxis.scale.type === 'categorical'
      ? (categoryAxis.scale.domain ?? stableDomain(allPrepared.rows.map((row) => row.category)))
          .length
      : 0;
  // Complete source categories and label metrics keep visibility changes from resizing the chart.
  const extraHeight =
    categoryPlacement === 'y' && categoryCount > 0
      ? Math.max(
          0,
          ((categoryCount + categoryBandPadding) * minimumCategoryStep) / presentation.viewScale -
            plotHeight(basePlot),
        )
      : 0;
  const canvasHeight = viewHeight + extraHeight;
  const presentationPlot = {...basePlot, bottom: basePlot.bottom + extraHeight};
  const frameStyle: ChartFrameStyles = {
    '--wcl-chart-aspect-ratio':
      extraHeight > 0 ? Math.min(aspectRatio, viewWidth / canvasHeight) : aspectRatio,
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

  const fullValueDomain = valueDomain(supplied.rows, layout, series);
  const categoryValues = prepared.rows.map((row) => row.category);
  // Full-source labels keep the plot bounds stable while fitting the viewport's values.
  const explorationPlot = exploration
    ? plotForYAxisLabels(
        categoryPlacement === 'x'
          ? createProjection(
              valueAxis.scale,
              valueDomain(allPrepared.rows, layout, allSeries),
              [0, 1],
              valueAxis.tickCount ?? 5,
              false,
            ).ticks.map((tick) => axisTickLabel(tick, valueAxis))
          : createProjection(
              categoryAxis.scale,
              categoryValues,
              [0, 1],
              categoryAxis.tickCount ?? 6,
              usesBars,
            ).ticks.map((tick) => {
              const label = axisTickLabel(tick, categoryAxis);
              return categoryAxis.scale.type === 'categorical'
                ? truncateTickLabel(label, 14)
                : label;
            }),
        presentation.fontSize / presentation.viewScale / 16,
        presentationPlot,
        axisTitle(categoryPlacement === 'x' ? valueAxis : categoryAxis),
        canvasHeight,
      )
    : undefined;
  const barCrossings = new Map<number, readonly number[]>();
  if (explorationPlot && usesBars && categoryAxis.scale.type !== 'categorical') {
    const horizontal = categoryPlacement === 'y';
    const start = horizontal ? explorationPlot.top : explorationPlot.left;
    const end = horizontal ? explorationPlot.bottom : explorationPlot.right;
    const projection = createProjection(navigation.scale, categoryValues, [start, end], 6, false);
    const groupWidth = barGroupWidth(projection, end - start, prepared.rows.length);
    const bars = series.filter((item) => item.kind === 'bar' || item.kind === 'column');
    prepared.rows.forEach((row, rowIndex) => {
      const category = projection.position(row.category);
      if (category === undefined) return;
      const crossing = series.flatMap((item, seriesIndex) => {
        const barIndex = bars.findIndex((bar) => bar.id === item.id);
        if (barIndex < 0) return [];
        const rect = barRectangle({
          category,
          start: 0,
          end: 1,
          groupWidth,
          seriesIndex: barIndex,
          seriesCount: bars.length,
          grouped: layout === 'grouped',
          horizontal: false,
        });
        return rect.x + rect.width >= start && rect.x <= end ? [seriesIndex] : [];
      });
      if (crossing.length) barCrossings.set(rowIndex, crossing);
    });
  }
  const visibleRowIndexes = prepared.rows.flatMap((row, index) =>
    !exploration || navigation.contains(row.category) || barCrossings.has(index) ? [index] : [],
  );
  const candidateReading = pointerReading ?? touchReading ?? keyboardReading;
  const activeReading =
    actions.box !== null ||
    (candidateReading !== null && !visibleRowIndexes.includes(candidateReading.index))
      ? null
      : candidateReading;
  const availableSeriesId = (id: string | null | undefined): string | undefined =>
    id !== null && id !== undefined && series.some((item) => item.id === id) ? id : undefined;
  const validPinnedLegendSeriesId = availableSeriesId(pinnedLegendSeriesId) ?? null;
  const emphasizedSeriesId =
    availableSeriesId(pinnedLegendSeriesId) ??
    availableSeriesId(transientLegendSeriesId) ??
    availableSeriesId(activeReading?.seriesId);

  const visibleValueDomain = exploration
    ? categoryAxis.scale.type === 'categorical'
      ? valueDomain(
          supplied.rows.filter((row) => navigation.contains(row.category)),
          layout,
          series,
        )
      : [
          ...explorationValueDomain(
            supplied.rows,
            series,
            layout,
            navigation.position,
            navigation.normalized,
            valueAxis.scale.type === 'logarithmic',
          ),
          ...[...barCrossings].flatMap(([rowIndex, indexes]) =>
            indexes.flatMap((index) => {
              const {start, end} = coordinates(supplied.rows[rowIndex]!, index, layout);
              return [start, end];
            }),
          ),
        ]
    : fullValueDomain;
  const rawDomain = visibleValueDomain.length > 0 ? visibleValueDomain : fullValueDomain;
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
    uniqueMotionIds &&
      !navigationDragging &&
      !isLoading &&
      !isError &&
      hasData &&
      series.length > 0 &&
      valueAxis.scale.type !== 'normalized' &&
      valueAxis.scale.domain === undefined,
    valueAxis.scale.type === 'logarithmic',
    domainResetKey,
  );
  const animatedScale =
    valueAxis.scale.type === 'normalized'
      ? valueAxis.scale
      : {...valueAxis.scale, domain: animatedDomain};

  const createPlotProjections = (bounds: PlotBounds) => ({
    categoryProjection: projectCategories(
      createProjection(
        exploration ? displayedCategoryScale : categoryAxis.scale,
        categoryValues,
        categoryPlacement === 'x' ? [bounds.left, bounds.right] : [bounds.top, bounds.bottom],
        exploration ? navigationTickCount : (categoryAxis.tickCount ?? 6),
        usesBars,
      ),
      categoryPlacement === 'x' ? [bounds.left, bounds.right] : [bounds.top, bounds.bottom],
    ),
    valueProjection: createProjection(
      animatedScale,
      rawDomain,
      categoryPlacement === 'x' ? [bounds.bottom, bounds.top] : [bounds.left, bounds.right],
      valueAxis.tickCount ?? 5,
      false,
    ),
  });
  const preliminaryProjections = createPlotProjections(presentationPlot);
  const yAxisLabels =
    categoryPlacement === 'x'
      ? targetProjection.ticks.map((tick) => axisTickLabel(tick, valueAxis))
      : preliminaryProjections.categoryProjection.ticks.map((tick) => {
          const label = axisTickLabel(tick, categoryAxis);
          return categoryAxis.scale.type === 'categorical' ? truncateTickLabel(label, 14) : label;
        });
  const targetPlot =
    explorationPlot ??
    plotForYAxisLabels(
      yAxisLabels,
      presentation.fontSize / presentation.viewScale / 16,
      presentationPlot,
      axisTitle(categoryPlacement === 'x' ? valueAxis : categoryAxis),
      canvasHeight,
    );
  const plotMotion = useChartDataMotion([{id: 'plot', value: targetPlot}], {
    version: JSON.stringify(targetPlot),
    resetKey: JSON.stringify([motionResetKey, availableWidth, aspectRatio, minimumSize, overflow]),
    enabled: uniqueMotionIds && hasData && !isLoading && !isError,
    interpolate: (from, to, progress) => ({
      left: from.left + (to.left - from.left) * progress,
      right: from.right + (to.right - from.right) * progress,
      top: from.top + (to.top - from.top) * progress,
      bottom: from.bottom + (to.bottom - from.bottom) * progress,
    }),
  });
  const plot = plotMotion[0]!.value;

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
    const {categoryProjection, valueProjection} = createPlotProjections(plot);
    const references = readingReferences(annotations, categoryPlacement);
    const readingRow = activeReading === null ? undefined : prepared.rows[activeReading.index];
    const readingValues =
      readingRow === undefined
        ? []
        : series.map((item, index) =>
            formatSeriesReading(readingRow, index, item, layout, valueAxis),
          );
    const readingAnnouncement =
      readingRow === undefined
        ? ''
        : [
            axisTickLabel(readingRow.category, categoryAxis),
            ...(interaction?.target === 'point' && activeReading?.seriesId
              ? series.flatMap((item, index) =>
                  item.id === activeReading.seriesId
                    ? [`${item.label}: ${readingValues[index] ?? ''}`]
                    : [],
                )
              : []),
            ...series.map((item, index) => `${item.label}: ${readingValues[index] ?? ''}`),
            ...references.map(
              (reference) =>
                `${reference.label}: ${formatReadingValue(reference.value, valueAxis)}`,
            ),
          ].join('. ');
    const isBarInteraction =
      interaction !== undefined &&
      (rootAttribute === 'data-wcl-bar-chart' || rootAttribute === 'data-wcl-column-chart');
    const isShapeInteraction =
      interaction !== undefined &&
      (rootAttribute === 'data-wcl-area-chart' || rootAttribute === 'data-wcl-cartesian-chart');
    const barSeries = series.filter((item) => item.kind === 'bar' || item.kind === 'column');
    const areaRegions = new Map<string, readonly {x: number; y: number}[]>();
    series.forEach((item, seriesIndex) => {
      if (!isShapeInteraction || (item.kind !== 'area' && item.kind !== 'range')) return;
      let run: {index: number; x: number; top: number; bottom: number}[] = [];
      const finish = () => {
        const region = [
          ...run.map((p) => ({x: p.x, y: p.top})),
          ...[...run].reverse().map((p) => ({x: p.x, y: p.bottom})),
        ];
        for (const point of run) areaRegions.set(JSON.stringify([item.id, point.index]), region);
        run = [];
      };
      prepared.rows.forEach((row, index) => {
        const x = categoryProjection.position(row.category);
        const values = coordinates(row, seriesIndex, layout);
        const top = valueProjection.position(values.end),
          bottom = valueProjection.position(values.start);
        if (
          x === undefined ||
          top === undefined ||
          bottom === undefined ||
          !Number.isFinite(values.end)
        )
          finish();
        else run.push({index, x, top, bottom});
      });
      finish();
    });
    const interactionPoints: InteractionPoint[] =
      interaction === undefined
        ? []
        : prepared.rows.flatMap((row, index) =>
            series.flatMap<InteractionPoint>((item, seriesIndex) => {
              const category = categoryProjection.position(row.category);
              const {start, end} = coordinates(row, seriesIndex, layout);
              const value = valueProjection.position(end);
              if (
                category === undefined ||
                value === undefined ||
                (exploration &&
                  !navigation.contains(row.category) &&
                  item.kind !== 'bar' &&
                  item.kind !== 'column')
              )
                return [];
              if (item.kind === 'bar' || item.kind === 'column') {
                const from = valueProjection.position(start);
                if (from === undefined) return [];
                const horizontal = categoryPlacement === 'y';
                const extent = horizontal ? plotHeight(plot) : plotWidth(plot);
                const groupWidth = barGroupWidth(categoryProjection, extent, prepared.rows.length);
                const bounds = clipBar(
                  barRectangle({
                    category,
                    start: from,
                    end: value,
                    groupWidth,
                    seriesIndex: barSeries.findIndex((bar) => bar.id === item.id),
                    seriesCount: barSeries.length,
                    grouped: layout === 'grouped',
                    horizontal,
                  }),
                  plot,
                );
                if (!bounds) return [];
                return [
                  {
                    item: {
                      rowId: rowIds[row.index]!,
                      ...(interaction.target === 'point' ? {seriesId: item.id} : {}),
                    },
                    index,
                    seriesId: item.id,
                    categoryPosition: category,
                    x: bounds.x + bounds.width / 2,
                    y: bounds.y + bounds.height / 2,
                    bounds,
                  },
                ];
              }
              const area = areaRegions.get(JSON.stringify([item.id, index]));
              // A clipped value marker does not remove the visible fill from targeting.
              const hasVisibleArea =
                area !== undefined &&
                area.some((p) => p.y <= plot.bottom) &&
                area.some((p) => p.y >= plot.top);
              if (
                category < plot.left - 1e-8 ||
                category > plot.right + 1e-8 ||
                (!hasVisibleArea && (value < plot.top - 1e-8 || value > plot.bottom + 1e-8))
              )
                return [];
              return [
                {
                  item: {
                    rowId: rowIds[row.index]!,
                    ...(interaction.target === 'point' ? {seriesId: item.id} : {}),
                  },
                  index,
                  seriesId: item.id,
                  categoryPosition: category,
                  x: category,
                  y: value,
                  ...(item.kind === 'range'
                    ? {companions: [{x: category, y: valueProjection.position(start)!}]}
                    : {}),
                  ...(area === undefined ? {} : {area}),
                },
              ];
            }),
          );
    const barRectangles = interactionPoints.flatMap((p) => (p.bounds ? [p.bounds] : []));
    const readingBarRectangles = interactionPoints.flatMap((p) =>
      p.bounds &&
      activeReading &&
      p.index === activeReading.index &&
      (interaction?.target === 'category' || p.seriesId === activeReading.seriesId)
        ? [p.bounds]
        : [],
    );
    const pulseBarRectangles = interactionPoints.flatMap((p) =>
      p.bounds && actions.pulse && selectionKey(p.item) === selectionKey(actions.pulse.item)
        ? [p.bounds]
        : [],
    );

    const shapeTargeting = isShapeInteraction
      ? {
          preferredSeriesId:
            availableSeriesId(pinnedLegendSeriesId) ?? availableSeriesId(transientLegendSeriesId),
          pointRadius: 11 / presentation.viewScale,
        }
      : undefined;
    const interactionPointFromPointer = (event: PointerEvent<SVGSVGElement>) => {
      const {x, y} = viewBoxPointFromPointer(event.currentTarget, event.clientX, event.clientY);
      const padding =
        (presentation.pointRadius + presentation.pointStrokeWidth) / presentation.viewScale;
      if (
        x < plot.left - padding ||
        x > plot.right + padding ||
        y < plot.top - padding ||
        y > plot.bottom + padding
      )
        return undefined;
      return nearestInteraction(
        interactionPoints,
        x,
        y,
        interaction?.target ?? 'category',
        categoryPlacement,
        shapeTargeting,
      );
    };
    const readingFromPointer = (
      event: PointerEvent<SVGSVGElement>,
      followPointer: boolean,
    ): ChartReading | null => {
      const {x, y} = viewBoxPointFromPointer(event.currentTarget, event.clientX, event.clientY);
      if (interaction) {
        const point = interactionPointFromPointer(event);
        const hoveredPoint =
          interaction.target === 'category'
            ? nearestInteraction(
                interactionPoints,
                x,
                y,
                'point',
                categoryPlacement,
                shapeTargeting,
              )
            : point;
        return point
          ? {
              index: point.index,
              seriesId: hoveredPoint?.seriesId ?? point.seriesId,
              ...(followPointer ? {pointer: {x: event.clientX, y: event.clientY}} : {}),
            }
          : null;
      }
      if (x < plot.left || x > plot.right || y < plot.top || y > plot.bottom) return null;
      const target = event.target instanceof Element ? event.target : null;
      const targetRow = Number(target?.closest('[data-row-index]')?.getAttribute('data-row-index'));
      const coordinate = categoryPlacement === 'x' ? x : y;
      const index =
        Number.isInteger(targetRow) && visibleRowIndexes.includes(targetRow)
          ? targetRow
          : nearestReadingIndex(prepared.rows, categoryProjection, coordinate, visibleRowIndexes);
      if (index === null) return null;
      const seriesId = target?.closest('[data-series]')?.getAttribute('data-series') ?? undefined;
      return {
        index,
        ...(followPointer ? {pointer: {x: event.clientX, y: event.clientY}} : {}),
        ...(seriesId === undefined ? {} : {seriesId}),
      };
    };
    const gestureCoordinate = (event: PointerEvent<SVGSVGElement>): number => {
      const point = viewBoxPointFromPointer(event.currentTarget, event.clientX, event.clientY);
      return categoryPlacement === 'x'
        ? (point.x - plot.left) / plotWidth(plot)
        : (point.y - plot.top) / plotHeight(plot);
    };
    const movePointerReading = (event: PointerEvent<SVGSVGElement>): void => {
      if (interaction) {
        const {x, y} = viewBoxPointFromPointer(event.currentTarget, event.clientX, event.clientY);
        if (actions.move(event, x, y, interactionPoints, plot)) {
          event.preventDefault();
          return;
        }
      }
      if (event.pointerType === 'touch') return;
      setPointerReading(readingFromPointer(event, true));
    };
    const retainTouchReading = (event: PointerEvent<SVGSVGElement>): void => {
      if (interaction && event.button === 0 && event.isPrimary !== false) {
        const point = interactionPointFromPointer(event);
        const {x, y} = viewBoxPointFromPointer(event.currentTarget, event.clientX, event.clientY);
        if (point) actions.begin(event, point, x, y);
      }
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
      if (
        event.currentTarget === event.target &&
        isFocusVisible &&
        keyboardReading === null &&
        visibleRowIndexes.length > 0
      ) {
        revealCategory(visibleRowIndexes[0]!, event.currentTarget.parentElement);
        setKeyboardReading({
          index: visibleRowIndexes[0]!,
          ...(interaction?.target === 'point' && series[0] ? {seriesId: series[0].id} : {}),
        });
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
      if (event.target !== event.currentTarget || visibleRowIndexes.length === 0) return;
      const previousIndex = keyboardReading?.index ?? activeReading?.index ?? visibleRowIndexes[0]!;
      const previousPosition = Math.max(0, visibleRowIndexes.indexOf(previousIndex));
      const currentSeriesId = keyboardReading?.seriesId ?? activeReading?.seriesId ?? series[0]?.id;
      if (interaction && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        const point = interactionPoints.find(
          (p) =>
            p.index === previousIndex &&
            (interaction.target === 'category' || p.item.seriesId === currentSeriesId),
        );
        if (point) actions.activate(point.item, 'keyboard', event.ctrlKey || event.metaKey);
        return;
      }
      if (
        interaction?.target === 'point' &&
        (categoryPlacement === 'x'
          ? event.key === 'ArrowUp' || event.key === 'ArrowDown'
          : event.key === 'ArrowLeft' || event.key === 'ArrowRight')
      ) {
        event.preventDefault();
        const at = Math.max(
          0,
          series.findIndex((item) => item.id === currentSeriesId),
        );
        const next =
          series[
            (at +
              (event.key === (categoryPlacement === 'x' ? 'ArrowUp' : 'ArrowLeft') ? -1 : 1) +
              series.length) %
              series.length
          ]!;
        setKeyboardReading({index: previousIndex, seriesId: next.id});
        setPointerReading(null);
        setTouchReading(null);
        return;
      }
      let nextIndex: number | null = null;
      if (event.key === 'Home') nextIndex = visibleRowIndexes[0]!;
      if (event.key === 'End') nextIndex = visibleRowIndexes.at(-1)!;
      if (
        (categoryPlacement === 'x' && event.key === 'ArrowLeft') ||
        (categoryPlacement === 'y' && event.key === 'ArrowUp')
      ) {
        nextIndex = visibleRowIndexes[Math.max(0, previousPosition - 1)]!;
      }
      if (
        (categoryPlacement === 'x' && event.key === 'ArrowRight') ||
        (categoryPlacement === 'y' && event.key === 'ArrowDown')
      ) {
        nextIndex =
          visibleRowIndexes[Math.min(visibleRowIndexes.length - 1, previousPosition + 1)]!;
      }
      if (event.key === 'Escape') {
        navigationGesture.cancel();
        actions.cancel();
        event.preventDefault();
        setKeyboardReading(null);
        setPointerReading(null);
        setTouchReading(null);
        return;
      }
      if (nextIndex === null) return;
      event.preventDefault();
      revealCategory(nextIndex, event.currentTarget.parentElement);
      setKeyboardReading({
        index: nextIndex,
        ...(interaction?.target === 'point' && currentSeriesId !== undefined
          ? {seriesId: currentSeriesId}
          : {}),
      });
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
              interaction
                ? 'ArrowLeft ArrowRight ArrowUp ArrowDown Home End Escape Enter Space Control+Enter Meta+Enter Control+Space Meta+Space'
                : categoryPlacement === 'x'
                  ? 'ArrowLeft ArrowRight Home End Escape'
                  : 'ArrowUp ArrowDown Home End Escape'
            }
            aria-labelledby={titleId}
            aria-describedby={
              interaction?.selection ? `${descriptionId}-selection-instructions` : undefined
            }
            data-stagger={presentation.staggerLabels ? '' : undefined}
            data-wcl-chart-canvas=""
            data-exploration={exploration ? '' : undefined}
            data-item-interaction={isBarInteraction || isShapeInteraction ? '' : undefined}
            onBlur={blurChart}
            onFocus={focusChart}
            onKeyDown={readWithKeyboard}
            onPointerDownCapture={() => setKeyboardReading(null)}
            role="group"
            tabIndex={0}
          >
            {exploration ? (
              <ChartExplorationLayer svg={svgElement} plot={plot}>
                <ChartExplorationControls
                  largeStepMultiplier={categoryPlacement === 'y' ? 2 : 3}
                  version={navigationVersion}
                  {...(categoryCount > 0 ? {step: 1 / categoryCount} : {})}
                  window={navigation.normalized}
                  minimumSpan={navigation.minimumSpan}
                  labels={exploration.labels}
                  rangeLabel={exploration.labels.range(navigation.window)}
                  fullRangeLabels={[
                    axisTickLabel(navigation.full[0], categoryAxis),
                    axisTickLabel(navigation.full[1], categoryAxis),
                  ]}
                  formatWindow={(range) =>
                    exploration.labels.range(navigation.fromNormalized(range))
                  }
                  onChange={changeWindow}
                  overview={
                    <svg viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden="true">
                      <Marks
                        categoryPlacement="x"
                        categoryProjection={{
                          bandwidth:
                            usesBars && categoryCount > 0
                              ? (1000 / categoryCount) * (1 - categoryBandPadding)
                              : 0,
                          position: (category) => navigation.position(category) * 1000,
                          ticks: [],
                        }}
                        emphasizedSeriesId={undefined}
                        layout={layout}
                        plot={{left: 0, right: 1000, top: 8, bottom: 72}}
                        rows={prepared.rows}
                        series={series}
                        valueProjection={createProjection(
                          valueAxis.scale,
                          fullValueDomain,
                          [72, 8],
                          5,
                          false,
                        )}
                      />
                      {actions.selected.map((item) => {
                        const row = interactionRows.find((row) => row.id === item.rowId);
                        if (!row || (item.seriesId && hiddenIds.includes(item.seriesId)))
                          return null;
                        const x = navigation.position(row.category) * 1000;
                        return (
                          <line
                            key={selectionKey(item)}
                            x1={x - 2}
                            x2={x + 2}
                            y1="77"
                            y2="77"
                            stroke="var(--wcl-text)"
                            strokeWidth="2"
                          />
                        );
                      })}
                    </svg>
                  }
                />
              </ChartExplorationLayer>
            ) : null}
            <svg
              aria-hidden="true"
              data-wcl-chart-svg=""
              data-selection-enabled={interaction?.selection ? '' : undefined}
              focusable="false"
              onPointerDownCapture={(event) =>
                navigationGesture.pointerDown(event, gestureCoordinate)
              }
              onPointerMoveCapture={(event) =>
                navigationGesture.pointerMove(event, gestureCoordinate)
              }
              onPointerUpCapture={(event) => navigationGesture.pointerEnd(event)}
              onPointerCancelCapture={(event) => navigationGesture.pointerEnd(event, true)}
              onLostPointerCaptureCapture={(event) => navigationGesture.pointerEnd(event, true)}
              onPointerDown={retainTouchReading}
              onPointerUp={
                interaction
                  ? (event) => {
                      actions.end(event, interactionPointFromPointer(event));
                      if (actions.box) {
                        setPointerReading(null);
                        setKeyboardReading(null);
                        setTouchReading(null);
                      }
                    }
                  : undefined
              }
              onPointerCancel={interaction ? () => actions.cancel() : undefined}
              onLostPointerCapture={interaction ? () => actions.cancel() : undefined}
              onContextMenu={
                interaction
                  ? (event) => {
                      if (actions.isHolding()) event.preventDefault();
                    }
                  : undefined
              }
              onPointerLeave={() => setPointerReading(null)}
              onPointerMove={movePointerReading}
              ref={setSvgElement}
              viewBox={`0 0 ${viewWidth} ${canvasHeight}`}
            >
              {categoryPlacement === 'x' ? (
                <>
                  <Axis
                    viewportHeight={canvasHeight}
                    axis={categoryAxis}
                    placement="x"
                    plot={plot}
                    presentation={presentation}
                    projection={categoryProjection}
                    staggerLabels={presentation.staggerLabels}
                  />
                  <Axis
                    viewportHeight={canvasHeight}
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
                    viewportHeight={canvasHeight}
                    axis={valueAxis}
                    placement="x"
                    plot={plot}
                    presentation={presentation}
                    projection={valueProjection}
                    staggerLabels={presentation.staggerLabels}
                  />
                  <Axis
                    viewportHeight={canvasHeight}
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
              <g clipPath={exploration ? `url(#${plotClipId})` : undefined}>
                <Annotations
                  annotations={annotations}
                  categoryPlacement={categoryPlacement}
                  categoryProjection={categoryProjection}
                  layer="background"
                  plot={plot}
                  valueProjection={valueProjection}
                />
              </g>
              <g
                clipPath={
                  exploration || hasVisibilityControls || isShapeInteraction
                    ? `url(#${plotClipId})`
                    : undefined
                }
              >
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
                {usesBars && departingRows.length > 0 ? (
                  <g aria-hidden="true" pointerEvents="none" data-wcl-chart-departures="">
                    <Marks
                      categoryPlacement={categoryPlacement}
                      categoryProjection={categoryProjection}
                      emphasizedSeriesId={emphasizedSeriesId}
                      layout={layout}
                      plot={plot}
                      rows={departingRows}
                      series={series}
                      departures
                      valueProjection={valueProjection}
                    />
                  </g>
                ) : null}
              </g>
              <g clipPath={exploration ? `url(#${plotClipId})` : undefined}>
                <Annotations
                  annotations={annotations}
                  categoryPlacement={categoryPlacement}
                  categoryProjection={categoryProjection}
                  layer="foreground"
                  plot={plot}
                  valueProjection={valueProjection}
                />
              </g>
              {interaction?.target === 'point' && !isBarInteraction ? (
                <g
                  pointerEvents="none"
                  clipPath={isShapeInteraction ? `url(#${plotClipId})` : undefined}
                >
                  {actions.selected.map((item) => {
                    const point = interactionPoints.find(
                      (p) => selectionKey(p.item) === selectionKey(item),
                    );
                    const selectedSeries = series.find((s) => s.id === item.seriesId);
                    if (!point || point.bounds || !selectedSeries || selectedSeries.showPoints)
                      return null;
                    const stroke =
                      presentation.pointStrokeWidth *
                      (emphasizedSeriesId === item.seriesId ? 1.5 : 1);
                    return (
                      <g key={selectionKey(item)}>
                        {[point, ...(point.companions ?? [])].map((center, endpoint) => (
                          <circle
                            key={endpoint}
                            data-color={selectedSeries.color}
                            data-wcl-chart-reading-outline=""
                            cx={center.x}
                            cy={center.y}
                            r={presentation.pointRadius / presentation.viewScale}
                            style={{strokeWidth: stroke}}
                          />
                        ))}
                      </g>
                    );
                  })}
                </g>
              ) : null}
              <g
                clipPath={
                  hasVisibilityControls || isShapeInteraction ? `url(#${plotClipId})` : undefined
                }
              >
                {activeReading === null || isBarInteraction ? null : (
                  <ReadingOverlay
                    pointTarget={interaction?.target === 'point'}
                    hideNeedle={isShapeInteraction}
                    {...(interaction || rootAttribute === 'data-wcl-line-chart'
                      ? {filledPresentation: presentation}
                      : {})}
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
              {interaction ? (
                <g data-wcl-chart-interaction-overlay="" pointerEvents="none">
                  {actions.selected.map((item) => {
                    const point = interactionPoints.find(
                      (p) => selectionKey(p.item) === selectionKey(item),
                    );
                    if (!point) return null;
                    if (interaction.target === 'category') {
                      const row = prepared.rows[point.index]!;
                      const tickIndex = categoryProjection.ticks.findIndex(
                        (tick) => domainValueKey(tick) === domainValueKey(row.category),
                      );
                      const labelOffset = tickLabelOffset(presentation.staggerLabels, tickIndex);
                      const y =
                        categoryPlacement === 'x'
                          ? plot.bottom +
                            (presentation.fontSize * labelOffset + 5) / presentation.viewScale
                          : point.categoryPosition +
                            (presentation.fontSize / 2 + 5) / presentation.viewScale;
                      return (
                        <line
                          key={selectionKey(item)}
                          data-wcl-chart-selected-category=""
                          x1={
                            categoryPlacement === 'x'
                              ? point.categoryPosition - 12 / presentation.viewScale
                              : plot.left - 33 / presentation.viewScale
                          }
                          x2={
                            categoryPlacement === 'x'
                              ? point.categoryPosition + 12 / presentation.viewScale
                              : plot.left - 9 / presentation.viewScale
                          }
                          y1={y}
                          y2={y}
                        />
                      );
                    }
                    if (point.bounds)
                      return (
                        <rect
                          key={selectionKey(item)}
                          data-wcl-chart-selected-bar=""
                          clipPath={`url(#${plotClipId})`}
                          {...frameBar(point.bounds, barRectangles, 2 / presentation.viewScale)}
                        />
                      );
                    const selectedSeries = series.find((s) => s.id === item.seriesId)!;
                    const stroke =
                      presentation.pointStrokeWidth *
                      (emphasizedSeriesId === item.seriesId ? 1.5 : 1);
                    return (
                      <g
                        key={selectionKey(item)}
                        data-color={selectedSeries.color}
                        clipPath={isShapeInteraction ? `url(#${plotClipId})` : undefined}
                      >
                        {point.companions?.map((center, endpoint) => {
                          const radius =
                            (presentation.pointRadius + stroke / 2 + 1) / presentation.viewScale;
                          const top = Math.min(point.y, center.y) + radius,
                            bottom = Math.max(point.y, center.y) - radius;
                          return top < bottom ? (
                            <line
                              key={`stem-${endpoint}`}
                              data-wcl-chart-range-connector=""
                              x1={point.x}
                              x2={center.x}
                              y1={top}
                              y2={bottom}
                            />
                          ) : null;
                        })}
                        {[point, ...(point.companions ?? [])].map((center, endpoint) => (
                          <circle
                            key={endpoint}
                            data-wcl-chart-selected-point=""
                            cx={center.x}
                            cy={center.y}
                            r={(presentation.pointRadius + stroke / 2 + 1) / presentation.viewScale}
                          />
                        ))}
                      </g>
                    );
                  })}
                  {actions.box ? <rect data-wcl-chart-selection-box="" {...actions.box} /> : null}
                  {actions.pulse ? (
                    <g key={actions.pulse.sequence} data-wcl-chart-activation="">
                      {pulseBarRectangles.length ? (
                        <ChartActivationOutline>
                          <path
                            data-wcl-chart-activation-bar=""
                            clipPath={`url(#${plotClipId})`}
                            d={barContour(
                              pulseBarRectangles,
                              -chartActivationOutset / presentation.viewScale,
                            )}
                          />
                        </ChartActivationOutline>
                      ) : null}
                      {interactionPoints
                        .filter(
                          (p) =>
                            !p.bounds && selectionKey(p.item) === selectionKey(actions.pulse!.item),
                        )
                        .flatMap((point) => [point, ...(point.companions ?? [])])
                        .map((point, index) => (
                          <circle
                            key={index}
                            data-wcl-chart-activation-dot=""
                            clipPath={isShapeInteraction ? `url(#${plotClipId})` : undefined}
                            cx={point.x}
                            cy={point.y}
                            r={chartActivationPointRadius / presentation.viewScale}
                          />
                        ))}
                      {interaction.target === 'category' && rootAttribute === 'data-wcl-line-chart'
                        ? (() => {
                            const point = interactionPoints.find(
                              (p) => p.item.rowId === actions.pulse!.item.rowId,
                            );
                            return point ? (
                              <line
                                data-wcl-chart-activation-guide=""
                                x1={point.x}
                                x2={point.x}
                                y1={plot.top}
                                y2={plot.bottom}
                              />
                            ) : null;
                          })()
                        : null}
                    </g>
                  ) : null}
                  {readingBarRectangles.length ? (
                    <path
                      data-wcl-chart-reading-bar=""
                      clipPath={`url(#${plotClipId})`}
                      d={barContour(readingBarRectangles, 3 / presentation.viewScale)}
                    />
                  ) : null}
                </g>
              ) : null}
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
          onPin={(id) => {
            setTransientLegendSeriesId(null);
            setPinnedLegendSeriesId((current) => (current === id ? null : id));
          }}
          onTransientChange={setTransientLegendSeriesId}
          pinnedSeriesId={validPinnedLegendSeriesId}
          series={allSeries}
        />
      ) : null}
      {content}
      {interaction?.selection ? (
        <ChartSelectionPresentation
          selection={interaction.selection}
          selected={actions.selected}
          instructionsId={`${descriptionId}-selection-instructions`}
          itemKey={selectionKey}
          itemLabel={(item) =>
            item.seriesId && hiddenIds.includes(item.seriesId)
              ? interaction.selection!.labels.hidden(interaction.selection!.labels.item(item))
              : interaction.selection!.labels.item(item)
          }
          onClear={() => {
            actions.cancel();
            actions.change([]);
          }}
        />
      ) : null}
      {!isLoading && !isError && hasData ? (
        <>
          {dataTable}
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
      accessor: 'upperAccessor' in item ? item.upperAccessor : item.accessor,
      ...('lowerAccessor' in item ? {lowerAccessor: item.lowerAccessor} : {}),
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
