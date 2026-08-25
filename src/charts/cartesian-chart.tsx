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
import {useId, type CSSProperties, type ReactElement, type ReactNode} from 'react';

import {EmptyState} from '../feedback/empty-state.js';
import {InlineAlert} from '../feedback/alerts.js';
import {Spinner} from '../feedback/spinner.js';
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
  ChartValueAxis,
  ColumnChartProps,
  LineChartProps,
  NonEmptyChartSeries,
} from './chart-types.js';

type ChartFrameStyles = CSSProperties & {
  '--wcl-chart-aspect-ratio': number;
  '--wcl-chart-minimum-height': string;
  '--wcl-chart-minimum-width': string;
};

const viewWidth = 640;
const viewHeight = 360;
const plot = {bottom: 306, left: 62, right: 620, top: 18} as const;
const plotWidth = plot.right - plot.left;
const plotHeight = plot.bottom - plot.top;
const defaultColors: readonly ChartColor[] = [
  'accent',
  'series-2',
  'series-3',
  'series-4',
  'series-5',
  'series-6',
];

type SeriesKind = 'area' | 'bar' | 'column' | 'line';

interface InternalSeries<Datum extends object> {
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

interface Projection<Value extends ChartDomainValue> {
  readonly bandwidth: number;
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

function readAccessor<Datum extends object, Value>(
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

function createProjection<Value extends ChartDomainValue>(
  scale: ChartScale<Value>,
  values: readonly Value[],
  range: readonly [number, number],
  tickCount: number,
  useBands: boolean,
): Projection<Value> {
  if (scale.type === 'categorical') {
    const domain = [...(scale.domain ?? stableDomain(values))];
    if (useBands) {
      const band: ScaleBand<Value> = scaleBand<Value>().domain(domain).range(range).padding(0.18);
      return {
        bandwidth: band.bandwidth(),
        position: (value) => {
          const start = band(value);
          return start === undefined ? undefined : start + band.bandwidth() / 2;
        },
        ticks: domain,
      };
    }
    const point: ScalePoint<Value> = scalePoint<Value>().domain(domain).range(range).padding(0.45);
    return {bandwidth: 0, position: point, ticks: domain};
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

function axisTickLabel<Value extends ChartDomainValue>(
  value: Value,
  axis: {readonly formatTick?: (tick: Value) => string; readonly scale: ChartScale<Value>},
): string {
  return axis.formatTick?.(value) ?? formatValue(value, axis.scale);
}

function Axis<Value extends ChartDomainValue>({
  axis,
  placement,
  projection,
}: {
  readonly axis: {
    readonly formatTick?: (tick: Value) => string;
    readonly label: string;
    readonly scale: ChartScale<Value>;
    readonly showGrid?: boolean;
    readonly unit?: string;
  };
  readonly placement: 'x' | 'y';
  readonly projection: Projection<Value>;
}): ReactElement {
  const horizontal = placement === 'x';
  return (
    <g data-axis={placement} data-scale={axis.scale.type} data-wcl-chart-axis="">
      <line
        data-wcl-chart-axis-rail=""
        x1={plot.left}
        x2={horizontal ? plot.right : plot.left}
        y1={horizontal ? plot.bottom : plot.top}
        y2={plot.bottom}
      />
      {projection.ticks.map((tick, index) => {
        const position = projection.position(tick);
        if (position === undefined) return null;
        return (
          <g data-wcl-chart-tick="" key={`${formatValue(tick, axis.scale)}-${index}`}>
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
              data-wcl-chart-tick-label=""
              textAnchor={horizontal ? 'middle' : 'end'}
              x={horizontal ? position : plot.left - 9}
              y={horizontal ? plot.bottom + 18 : position + 4}
            >
              {axisTickLabel(tick, axis)}
            </text>
          </g>
        );
      })}
      <text
        data-wcl-chart-axis-label=""
        textAnchor="middle"
        transform={horizontal ? undefined : `rotate(-90 14 ${plot.top + plotHeight / 2})`}
        x={horizontal ? plot.left + plotWidth / 2 : 14}
        y={horizontal ? viewHeight - 7 : plot.top + plotHeight / 2}
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

function Marks<Datum extends object, Category extends ChartDomainValue>({
  categoryPlacement,
  categoryProjection,
  layout,
  rows,
  series,
  valueProjection,
}: {
  readonly categoryPlacement: 'x' | 'y';
  readonly categoryProjection: Projection<Category>;
  readonly layout: ChartBarLayout | ChartStacking;
  readonly rows: readonly PreparedRow<Datum, Category>[];
  readonly series: readonly InternalSeries<Datum>[];
  readonly valueProjection: Projection<number>;
}): ReactElement {
  const isHorizontal = categoryPlacement === 'y';
  const barSeries = series.filter((item) => item.kind === 'bar' || item.kind === 'column');
  return (
    <g data-wcl-chart-marks="">
      {series.map((item, seriesIndex) => {
        const color = item.color;
        if (item.kind === 'line') {
          const path = createLine<PreparedRow<Datum, Category>>()
            .x((row) => categoryProjection.position(row.category) ?? plot.left)
            .y((row) => valueProjection.position(row.values[seriesIndex] ?? 0) ?? plot.bottom)
            .curve(item.curve === 'step' ? curveStep : curveLinear)(rows);
          return (
            <g data-color={color} data-series-index={seriesIndex} key={item.id}>
              <path d={path ?? undefined} data-series={item.id} data-wcl-chart-line="" />
              {item.showPoints
                ? rows.map((row) => (
                    <circle
                      cx={categoryProjection.position(row.category)}
                      cy={valueProjection.position(row.values[seriesIndex] ?? 0)}
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
              data-series={item.id}
              data-series-index={seriesIndex}
              data-wcl-chart-area=""
              key={item.id}
            />
          );
        }

        const availableLength = isHorizontal ? plotHeight : plotWidth;
        const groupWidth =
          categoryProjection.bandwidth > 0
            ? categoryProjection.bandwidth
            : Math.min(48, (availableLength / Math.max(rows.length, 1)) * 0.7);
        const grouped = layout === 'grouped';
        const barIndex = barSeries.findIndex((bar) => bar.id === item.id);
        const barWidth = grouped ? groupWidth / Math.max(barSeries.length, 1) : groupWidth;
        return (
          <g data-color={color} data-series-index={seriesIndex} key={item.id}>
            {rows.map((row) => {
              const category = categoryProjection.position(row.category) ?? 0;
              const {end, start} = coordinates(row, seriesIndex, layout);
              const startPosition = valueProjection.position(start) ?? 0;
              const endPosition = valueProjection.position(end) ?? 0;
              const categoryStart =
                category - groupWidth / 2 + (grouped ? Math.max(barIndex, 0) * barWidth : 0);
              return (
                <rect
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
  valueProjection,
}: {
  readonly annotations: readonly ChartAnnotation<ChartDomainValue, ChartDomainValue>[];
  readonly categoryPlacement: 'x' | 'y';
  readonly categoryProjection: Projection<Category>;
  readonly layer: 'background' | 'foreground';
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
              height={annotation.axis === 'x' ? plotHeight : Math.abs(to - from)}
              width={annotation.axis === 'x' ? Math.abs(to - from) : plotWidth}
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
  categoryAxis,
  dataTableLabel,
  layout,
  rows,
  series,
  valueAxis,
}: {
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
  legend,
  series,
}: {
  readonly legend: ChartLegend;
  readonly series: readonly InternalSeries<Datum>[];
}): ReactElement {
  return (
    <ul aria-label={legend.label} data-wcl-chart-legend="">
      {series.map((item, index) => (
        <li data-color={item.color} data-series-index={index} key={item.id}>
          <svg
            aria-hidden="true"
            data-wcl-chart-legend-swatch=""
            focusable="false"
            viewBox="0 0 20 8"
          >
            <line data-wcl-chart-legend-line="" x1="0" x2="20" y1="4" y2="4" />
          </svg>
          {item.label}
        </li>
      ))}
    </ul>
  );
}

function Feedback({
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

function assertText(value: string, name: string): void {
  if (value.trim().length === 0) throw new Error(`${name} must not be blank.`);
}

function validateScale<Value extends ChartDomainValue>(
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
}: ChartFrameProps<Datum, Category>): void {
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
  minimumSize = {height: 220, width: 320},
  overflow = 'clip',
  rootAttribute,
  series,
  status = {kind: 'ready'},
  title,
  valueAxis,
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
    series,
    ...(status === undefined ? {} : {status}),
    title,
    valueAxis,
  });
  const titleId = useId();
  const descriptionId = useId();
  const prepared = prepareRows(data, categoryAxis, series, valueAxis, layout);
  const isLoading = status.kind === 'loading';
  const isError = status.kind === 'error';
  const hasData = prepared.rows.length > 0;
  const rootProps: Record<string, string> = {[rootAttribute]: ''};
  if (rootAttribute === 'data-wcl-area-chart') rootProps['data-stacking'] = layout;
  if (rootAttribute === 'data-wcl-bar-chart' || rootAttribute === 'data-wcl-column-chart') {
    rootProps['data-layout'] = layout;
  }
  const frameStyle: ChartFrameStyles = {
    '--wcl-chart-aspect-ratio': aspectRatio,
    '--wcl-chart-minimum-height': `${minimumSize.height}px`,
    '--wcl-chart-minimum-width': `${minimumSize.width}px`,
  };

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
  } else {
    const usesBars = series.some((item) => item.kind === 'bar' || item.kind === 'column');
    const categoryRange: [number, number] =
      categoryPlacement === 'x' ? [plot.left, plot.right] : [plot.top, plot.bottom];
    const valueRange: [number, number] =
      categoryPlacement === 'x' ? [plot.bottom, plot.top] : [plot.left, plot.right];
    const categoryProjection = createProjection(
      categoryAxis.scale,
      prepared.rows.map((row) => row.category),
      categoryRange,
      categoryAxis.tickCount ?? 6,
      usesBars,
    );
    const rawDomain = valueDomain(prepared.rows, layout, series);
    const valueProjection = createProjection(
      valueAxis.scale,
      rawDomain,
      valueRange,
      valueAxis.tickCount ?? 5,
      false,
    );
    content = (
      <>
        {status.kind === 'partial' ? <Feedback copy={status} kind="partial" /> : null}
        {prepared.invalidCount > 0 ? <Feedback copy={invalidData} kind="invalid" /> : null}
        {legend === undefined ? null : <Legend legend={legend} series={series} />}
        <div data-overflow={overflow} data-wcl-chart-frame="" style={frameStyle}>
          <div data-wcl-chart-canvas="">
            <svg
              aria-hidden="true"
              data-wcl-chart-svg=""
              focusable="false"
              viewBox={`0 0 ${viewWidth} ${viewHeight}`}
            >
              {categoryPlacement === 'x' ? (
                <>
                  <Axis axis={categoryAxis} placement="x" projection={categoryProjection} />
                  <Axis axis={valueAxis} placement="y" projection={valueProjection} />
                </>
              ) : (
                <>
                  <Axis axis={valueAxis} placement="x" projection={valueProjection} />
                  <Axis axis={categoryAxis} placement="y" projection={categoryProjection} />
                </>
              )}
              <Annotations
                annotations={annotations}
                categoryPlacement={categoryPlacement}
                categoryProjection={categoryProjection}
                layer="background"
                valueProjection={valueProjection}
              />
              <Marks
                categoryPlacement={categoryPlacement}
                categoryProjection={categoryProjection}
                layout={layout}
                rows={prepared.rows}
                series={series}
                valueProjection={valueProjection}
              />
              <Annotations
                annotations={annotations}
                categoryPlacement={categoryPlacement}
                categoryProjection={categoryProjection}
                layer="foreground"
                valueProjection={valueProjection}
              />
            </svg>
          </div>
        </div>
        <DataTable
          categoryAxis={categoryAxis}
          dataTableLabel={dataTableLabel}
          layout={layout}
          rows={prepared.rows}
          series={series}
          valueAxis={valueAxis}
        />
        <AnnotationSummary
          annotations={annotations}
          categoryAxis={categoryAxis}
          categoryPlacement={categoryPlacement}
          valueAxis={valueAxis}
        />
      </>
    );
  }

  return (
    <figure
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      data-wcl-chart=""
      {...rootProps}
    >
      <figcaption data-wcl-chart-caption="">
        <strong id={titleId}>{title}</strong>
        <p id={descriptionId}>{description}</p>
      </figcaption>
      {content}
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
  return series.map((item, index) => ({
    accessor: item.accessor,
    color: item.color ?? defaultColors[index] ?? 'accent',
    curve: 'curve' in item ? (item.curve ?? 'linear') : 'linear',
    id: item.id,
    kind: kind ?? ('kind' in item ? item.kind : 'line'),
    label: item.label,
    showPoints: 'showPoints' in item ? (item.showPoints ?? false) : false,
  }));
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
