import {ChartVisibilityButton} from './chart-visibility-button.js';
import {useAnimatedChartDomain} from './use-animated-chart-domain.js';
import {ChartActivationOutline, chartActivationOutset} from './chart-activation.js';
import {bin as createBins, quantileSorted} from 'd3-array';
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
import {useFocusVisible} from 'react-aria';
import {selectionKey, useChartInteraction, type InteractionPoint} from './chart-interaction.js';
import {
  DistributionCue,
  distributionKey,
  distributionSetup,
  hitsDistribution,
  type DistributionPoint,
  type DistributionSetup,
} from './distribution-interaction.js';
import {containsPointShape} from './point-interaction-geometry.js';

import {EmptyState} from '../feedback/empty-state.js';
import {Spinner} from '../feedback/spinner.js';
import {useScrollbarActivity} from '../scrollbar-activity.js';
import {
  Axis,
  Feedback,
  assertText,
  axisTickLabel,
  clamp,
  clientPointFromViewBox,
  viewBoxPointFromPointer,
  createProjection,
  defaultColors,
  inheritedDirection,
  plotForPresentation,
  plotForYAxisLabels,
  plotHeight,
  plotWidth,
  presentationMetrics,
  readAccessor,
  validateScale,
  viewHeight,
  viewWidth,
  type ChartTooltipStyles,
  type PlotBounds,
  type PresentationMetrics,
  type Projection,
} from './cartesian-chart.js';
import type {
  BoxPlotDistribution,
  BoxPlotSelectionItem,
  BoxPlotOutlierContext,
  BoxPlotActivation,
  HistogramActivation,
  BoxPlotProps,
  BoxWhisker,
  BubbleChartProps,
  BubbleMagnitude,
  ChartColor,
  ChartInteraction,
  PointChartInteraction,
  ChartLegend,
  ChartVisibilityLabels,
  ChartStateCopy,
  ChartStatus,
  ChartValueAxis,
  HistogramDistribution,
  HistogramOrdinate,
  HistogramProps,
  LinearChartScale,
  LogarithmicChartScale,
  QuantitativeChartDataAxis,
  ScatterChartProps,
  StatisticalChartSeries,
} from './chart-types.js';

type StatisticalKind = 'box' | 'bubble' | 'histogram' | 'scatter';

type StatisticalFrameStyles = CSSProperties & {
  '--wcl-chart-aspect-ratio': number;
  '--wcl-chart-axis-font-size': string;
  '--wcl-chart-grid-width': string;
  '--wcl-chart-minimum-height': string;
  '--wcl-chart-minimum-width': string;
  '--wcl-statistical-mark-stroke-width': string;
};

interface CommonProps<Datum extends object> {
  readonly visibilityLabels?: ChartVisibilityLabels;
  readonly aspectRatio?: number;
  readonly data: readonly Datum[];
  readonly dataTableLabel: string;
  readonly description: string;
  readonly emptyState: ChartStateCopy;
  readonly invalidData: ChartStateCopy;
  readonly minimumSize?: {readonly height: number; readonly width: number};
  readonly overflow?: 'clip' | 'scroll';
  readonly status?: ChartStatus;
  readonly title: string;
}

interface InternalSeries {
  readonly color: ChartColor;
  readonly id: string;
  readonly label: string;
  readonly shape: number;
}

interface PreparedPoint {
  readonly id: string;
  readonly label: string;
  readonly magnitude?: number;
  readonly series: InternalSeries;
  readonly sourceIndex: number;
  readonly x: number;
  readonly y: number;
}

interface PreparedBin<Datum extends object> {
  readonly source: HistogramActivation<Datum>['source'];
  readonly final: boolean;
  readonly lower: number;
  readonly ordinate: HistogramOrdinate;
  readonly sourceIndex: number;
  readonly upper: number;
  readonly value: number;
}

interface PreparedBox<Datum extends object> {
  readonly source: Extract<BoxPlotActivation<Datum>, {kind: 'summary'}>['source'];
  readonly outlierContexts: readonly BoxPlotOutlierContext<Datum>[];
  readonly outlierIds?: readonly string[];
  readonly lowerWhisker: number;
  readonly median: number;
  readonly outliers: readonly number[];
  readonly q1: number;
  readonly q3: number;
  readonly series: InternalSeries;
  readonly upperWhisker: number;
  readonly whisker: BoxWhisker;
}

interface PointModel<Datum extends object, Kind extends 'bubble' | 'scatter'> {
  readonly invalidCount: number;
  readonly kind: Kind;
  readonly magnitude?: BubbleMagnitude<Datum>;
  readonly points: readonly PreparedPoint[];
  readonly series: readonly InternalSeries[];
  readonly xAxis: QuantitativeChartDataAxis<Datum>;
  readonly yAxis: QuantitativeChartDataAxis<Datum>;
}

interface HistogramModel<Datum extends object> {
  readonly bins: readonly PreparedBin<Datum>[];
  readonly color: ChartColor;
  readonly invalidCount: number;
  readonly kind: 'histogram';
  readonly xAxis: ChartValueAxis<LinearChartScale>;
  readonly yAxis: ChartValueAxis<LinearChartScale>;
}

interface BoxModel<Datum extends object> {
  readonly boxes: readonly PreparedBox<Datum>[];
  readonly invalidCount: number;
  readonly kind: 'box';
  readonly series: readonly InternalSeries[];
  readonly xAxis: {readonly label: string};
  readonly yAxis: ChartValueAxis<LinearChartScale>;
}

type StatisticalModel<Datum extends object> =
  | PointModel<Datum, 'bubble'>
  | PointModel<Datum, 'scatter'>
  | HistogramModel<Datum>
  | BoxModel<Datum>;

interface ReadingRow {
  readonly color?: ChartColor;
  readonly label: string;
  readonly seriesId?: string;
  readonly shape?: number | 'box';
  readonly value: string;
}

interface ReadingTarget {
  readonly id: string;
  readonly kind: 'bin' | 'box' | 'outlier' | 'point';
  readonly label: string;
  readonly rows: readonly ReadingRow[];
  readonly seriesId?: string;
  readonly sourceIndex: number;
  readonly x: number;
  readonly xValue?: number;
  readonly y: number;
  readonly yValue?: number;
}

interface StatisticalProjections {
  readonly xCategory: Projection<string> | null;
  readonly xNumber: Projection<number> | null;
  readonly y: Projection<number>;
}

function formatAxisValue(
  value: number,
  axis: {
    readonly formatTick?: (value: number) => string;
    readonly scale: LinearChartScale | LogarithmicChartScale;
    readonly unit?: string;
  },
): string {
  const formatted = axisTickLabel(value, axis);
  const unit = axis.unit?.trim();
  if (unit === undefined || unit.length === 0 || formatted.trimEnd().endsWith(unit))
    return formatted;
  return `${formatted} ${unit}`;
}

function axisHeading(axis: {readonly label: string; readonly unit?: string}): string {
  return axis.unit === undefined ? axis.label : `${axis.label} (${axis.unit})`;
}

function formatMagnitude<Datum extends object>(
  value: number,
  magnitude: BubbleMagnitude<Datum>,
): string {
  const formatted = magnitude.formatValue?.(value) ?? String(value);
  const unit = magnitude.unit?.trim();
  if (unit === undefined || unit.length === 0 || formatted.trimEnd().endsWith(unit))
    return formatted;
  return `${formatted} ${unit}`;
}

function normalizeSeries(series: readonly StatisticalChartSeries[]): InternalSeries[] {
  const claimedColors = new Set<ChartColor>();
  for (const item of series) {
    if (item.color !== undefined && defaultColors.includes(item.color))
      claimedColors.add(item.color);
  }
  let automaticColorIndex = 0;
  return series.map((item, index) => {
    assertText(item.id, 'Statistical-chart series id');
    assertText(item.label, 'Statistical-chart series label');
    while (claimedColors.has(defaultColors[automaticColorIndex] ?? 'accent'))
      automaticColorIndex += 1;
    const color = item.color ?? defaultColors[automaticColorIndex] ?? 'accent';
    if (item.color === undefined) automaticColorIndex += 1;
    claimedColors.add(color);
    return {color, id: item.id, label: item.label, shape: index};
  });
}

function validateSeries(series: readonly InternalSeries[], legend: ChartLegend | undefined): void {
  if (series.length === 0 || series.length > defaultColors.length) {
    throw new Error(`Statistical charts require between one and ${defaultColors.length} series.`);
  }
  if (new Set(series.map((item) => item.id)).size !== series.length) {
    throw new Error('Statistical-chart series ids must be unique.');
  }
  if (series.length > 1 && legend === undefined) {
    throw new Error('Statistical charts with more than one series require a visible legend.');
  }
  if (legend !== undefined) assertText(legend.label, 'Legend label');
}

function validNumericValue(
  value: unknown,
  scale:
    LinearChartScale | {readonly domain?: readonly [number, number]; readonly type: 'logarithmic'},
): value is number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return false;
  if (scale.type === 'logarithmic' && value <= 0) return false;
  return scale.domain === undefined || (value >= scale.domain[0] && value <= scale.domain[1]);
}

function preparePoints<Datum extends object, Kind extends 'bubble' | 'scatter'>(
  props: ScatterChartProps<Datum> | BubbleChartProps<Datum>,
  kind: Kind,
): PointModel<Datum, Kind> {
  assertText(props.xAxis.label, 'Point-chart X-axis label');
  assertText(props.yAxis.label, 'Point-chart Y-axis label');
  validateScale(props.xAxis.scale, 'X axis');
  validateScale(props.yAxis.scale, 'Y axis');
  const series = normalizeSeries(props.series);
  validateSeries(series, props.legend);
  if (series.length > 1 && props.seriesAccessor === undefined) {
    throw new Error('Point charts with more than one series require seriesAccessor.');
  }
  const knownSeries = new Map(series.map((item) => [item.id, item]));
  const ids = new Set<string>();
  const points: PreparedPoint[] = [];
  let invalidCount = 0;
  props.data.forEach((datum, sourceIndex) => {
    const id = readAccessor(props.idAccessor, datum, sourceIndex);
    const label = readAccessor(props.labelAccessor, datum, sourceIndex);
    const x = readAccessor(props.xAxis.accessor, datum, sourceIndex);
    const y = readAccessor(props.yAxis.accessor, datum, sourceIndex);
    const seriesId =
      props.seriesAccessor === undefined
        ? series[0]?.id
        : readAccessor(props.seriesAccessor, datum, sourceIndex);
    const item = typeof seriesId === 'string' ? knownSeries.get(seriesId) : undefined;
    const magnitude =
      kind === 'bubble'
        ? readAccessor((props as BubbleChartProps<Datum>).magnitude.accessor, datum, sourceIndex)
        : undefined;
    if (
      typeof id !== 'string' ||
      id.trim().length === 0 ||
      typeof label !== 'string' ||
      label.trim().length === 0 ||
      item === undefined ||
      !validNumericValue(x, props.xAxis.scale) ||
      !validNumericValue(y, props.yAxis.scale) ||
      (kind === 'bubble' &&
        (typeof magnitude !== 'number' || !Number.isFinite(magnitude) || magnitude <= 0))
    ) {
      invalidCount += 1;
      return;
    }
    if (ids.has(id)) throw new Error(`Statistical-chart point id "${id}" is duplicated.`);
    ids.add(id);
    points.push({
      id,
      label,
      ...(typeof magnitude === 'number' ? {magnitude} : {}),
      series: item,
      sourceIndex,
      x,
      y,
    });
  });
  return {
    invalidCount,
    kind,
    ...(kind === 'bubble' ? {magnitude: (props as BubbleChartProps<Datum>).magnitude} : {}),
    points,
    series,
    xAxis: props.xAxis,
    yAxis: props.yAxis,
  };
}

function validateThresholds(thresholds: number | readonly number[] | undefined): void {
  if (thresholds === undefined) return;
  if (typeof thresholds === 'number') {
    if (!Number.isInteger(thresholds) || thresholds <= 0) {
      throw new Error('Histogram threshold count must be a positive integer.');
    }
    return;
  }
  if (
    thresholds.some((value) => !Number.isFinite(value)) ||
    thresholds.some((value, index) => index > 0 && value <= thresholds[index - 1]!)
  ) {
    throw new Error('Histogram thresholds must be increasing finite values.');
  }
}

function prepareHistogram<Datum extends object>(
  props: HistogramProps<Datum>,
): HistogramModel<Datum> {
  validateScale(props.xAxis.scale, 'Histogram X axis');
  validateScale(props.yAxis.scale, 'Histogram Y axis');
  if (
    props.yAxis.scale.domain !== undefined &&
    (props.yAxis.scale.domain[0] > 0 || props.yAxis.scale.domain[1] < 0)
  ) {
    throw new Error('Histogram Y-axis domain must include the zero baseline.');
  }
  const distribution: HistogramDistribution<Datum> = props.distribution;
  const bins: PreparedBin<Datum>[] = [];
  let invalidCount = 0;
  if (distribution.kind === 'raw') {
    validateThresholds(distribution.thresholds);
    const values = props.data.flatMap((datum, sourceIndex) => {
      const value = readAccessor(distribution.accessor, datum, sourceIndex);
      if (!validNumericValue(value, props.xAxis.scale)) {
        invalidCount += 1;
        return [];
      }
      return [{value, datum}];
    });
    if (values.length > 0) {
      const domain = props.xAxis.scale.domain ?? [
        Math.min(...values.map((entry) => entry.value)),
        Math.max(...values.map((entry) => entry.value)),
      ];
      const expandedDomain: [number, number] =
        domain[0] === domain[1] ? [domain[0] - 0.5, domain[1] + 0.5] : [domain[0], domain[1]];
      const generator = createBins<{value: number; datum: Datum}, number>()
        .value((entry) => entry.value)
        .domain(expandedDomain);
      const thresholds = distribution.thresholds ?? props.xAxis.tickCount ?? 6;
      if (typeof thresholds === 'number') generator.thresholds(thresholds);
      else
        generator.thresholds(
          thresholds.filter((value) => value > expandedDomain[0] && value < expandedDomain[1]),
        );
      const generated = generator(values).filter(
        (bin) => bin.x0 !== undefined && bin.x1 !== undefined && bin.x1 > bin.x0,
      );
      generated.forEach((bin, sourceIndex) => {
        if (bin.x0 === undefined || bin.x1 === undefined) return;
        bins.push({
          source: {kind: 'raw', data: bin.map((entry) => entry.datum)},
          final: sourceIndex === generated.length - 1,
          lower: bin.x0,
          ordinate: 'count',
          sourceIndex,
          upper: bin.x1,
          value: bin.length,
        });
      });
    }
  } else {
    props.data.forEach((datum, sourceIndex) => {
      const lower = readAccessor(distribution.lowerAccessor, datum, sourceIndex);
      const upper = readAccessor(distribution.upperAccessor, datum, sourceIndex);
      const value = readAccessor(distribution.ordinateAccessor, datum, sourceIndex);
      if (
        !validNumericValue(lower, props.xAxis.scale) ||
        !validNumericValue(upper, props.xAxis.scale) ||
        lower >= upper ||
        typeof value !== 'number' ||
        !Number.isFinite(value) ||
        value < 0 ||
        (distribution.ordinate === 'proportion' && value > 1)
      ) {
        invalidCount += 1;
        return;
      }
      bins.push({
        source: {kind: 'binned', datum},
        final: false,
        lower,
        ordinate: distribution.ordinate,
        sourceIndex,
        upper,
        value,
      });
    });
    bins.sort(
      (first, second) => first.lower - second.lower || first.sourceIndex - second.sourceIndex,
    );
    bins.forEach((bin, index) => {
      if (index > 0 && bin.lower < bins[index - 1]!.upper) {
        throw new Error('Pre-binned histogram intervals must not overlap.');
      }
    });
    if (distribution.ordinate === 'count' && bins.length > 1) {
      const width = bins[0]!.upper - bins[0]!.lower;
      if (bins.some((bin) => Math.abs(bin.upper - bin.lower - width) > Math.abs(width) * 1e-9)) {
        throw new Error('Count histograms require equal widths; use density for unequal bins.');
      }
    }
    if (bins.length > 0) bins[bins.length - 1] = {...bins[bins.length - 1]!, final: true};
  }
  if (bins.some((bin) => !validNumericValue(bin.value, props.yAxis.scale))) {
    throw new Error('Histogram bin ordinates must fit inside the explicit Y-axis domain.');
  }
  return {
    bins,
    color: props.color ?? 'accent',
    invalidCount,
    kind: 'histogram',
    xAxis: props.xAxis,
    yAxis: props.yAxis,
  };
}

function rawBox<Datum extends object>(
  entries: readonly {readonly value: number; readonly datum: Datum}[],
  series: InternalSeries,
  whisker: BoxWhisker,
): PreparedBox<Datum> {
  const values = entries.map((entry) => entry.value);
  const source = {kind: 'raw' as const, data: entries.map((entry) => entry.datum)};
  const sorted = [...values].sort((first, second) => first - second);
  const q1 = quantileSorted(sorted, 0.25)!;
  const median = quantileSorted(sorted, 0.5)!;
  const q3 = quantileSorted(sorted, 0.75)!;
  if (whisker === 'min-max') {
    return {
      source,
      outlierContexts: [],
      lowerWhisker: sorted[0]!,
      median,
      outliers: [],
      q1,
      q3,
      series,
      upperWhisker: sorted.at(-1)!,
      whisker,
    };
  }
  const spread = q3 - q1;
  const lowerFence = q1 - spread * 1.5;
  const upperFence = q3 + spread * 1.5;
  const regular = sorted.filter((value) => value >= lowerFence && value <= upperFence);
  const outlierContexts = entries
    .filter((entry) => entry.value < lowerFence || entry.value > upperFence)
    .sort((a, b) => a.value - b.value)
    .map((entry) => ({
      kind: 'raw' as const,
      datum: entry.datum,
      groupId: series.id,
      value: entry.value,
    }));
  return {
    source,
    outlierContexts,
    lowerWhisker: regular[0]!,
    median,
    outliers: sorted.filter((value) => value < lowerFence || value > upperFence),
    q1,
    q3,
    series,
    upperWhisker: regular.at(-1)!,
    whisker,
  };
}

function prepareBoxes<Datum extends object>(props: BoxPlotProps<Datum>): BoxModel<Datum> {
  validateScale(props.yAxis.scale, 'Box-plot Y axis');
  const series = normalizeSeries(props.groups);
  validateSeries(series, props.legend);
  const knownGroups = new Map(series.map((item) => [item.id, item]));
  const distribution: BoxPlotDistribution<Datum> = props.distribution;
  const boxes: PreparedBox<Datum>[] = [];
  let invalidCount = 0;
  if (distribution.kind === 'raw') {
    const valuesByGroup = new Map(
      series.map((item) => [item.id, [] as {value: number; datum: Datum}[]]),
    );
    props.data.forEach((datum, sourceIndex) => {
      const groupId = readAccessor(props.groupAccessor, datum, sourceIndex);
      const value = readAccessor(distribution.valueAccessor, datum, sourceIndex);
      if (
        typeof groupId !== 'string' ||
        !knownGroups.has(groupId) ||
        !validNumericValue(value, props.yAxis.scale)
      ) {
        invalidCount += 1;
        return;
      }
      valuesByGroup.get(groupId)!.push({value, datum});
    });
    for (const item of series) {
      const values = valuesByGroup.get(item.id) ?? [];
      if (values.length === 0) continue;
      boxes.push(rawBox(values, item, distribution.whisker ?? 'tukey'));
    }
  } else {
    const encounteredGroups = new Set<string>();
    const validGroups = new Set<string>();
    props.data.forEach((datum, sourceIndex) => {
      const groupId = readAccessor(props.groupAccessor, datum, sourceIndex);
      const seriesItem = typeof groupId === 'string' ? knownGroups.get(groupId) : undefined;
      if (typeof groupId !== 'string' || seriesItem === undefined) {
        invalidCount += 1;
        return;
      }
      if (encounteredGroups.has(groupId)) {
        throw new Error(`Box-plot summary group "${groupId}" is duplicated.`);
      }
      encounteredGroups.add(groupId);
      const lowerWhisker = readAccessor(distribution.lowerWhiskerAccessor, datum, sourceIndex);
      const q1 = readAccessor(distribution.q1Accessor, datum, sourceIndex);
      const median = readAccessor(distribution.medianAccessor, datum, sourceIndex);
      const q3 = readAccessor(distribution.q3Accessor, datum, sourceIndex);
      const upperWhisker = readAccessor(distribution.upperWhiskerAccessor, datum, sourceIndex);
      const outliers = readAccessor(distribution.outliersAccessor, datum, sourceIndex);
      const ordered = [lowerWhisker, q1, median, q3, upperWhisker];
      if (
        !ordered.every((value) => validNumericValue(value, props.yAxis.scale)) ||
        ordered.some((value, index) => index > 0 && value < ordered[index - 1]!) ||
        !Array.isArray(outliers) ||
        !outliers.every((value) => validNumericValue(value, props.yAxis.scale))
      ) {
        invalidCount += 1;
        return;
      }
      if (distribution.whisker === 'min-max' && outliers.length > 0) {
        throw new Error('Box-plot min-max summaries cannot declare outliers.');
      }
      if (distribution.whisker === 'tukey') {
        const spread = q3! - q1!;
        const lowerFence = q1! - spread * 1.5;
        const upperFence = q3! + spread * 1.5;
        if (lowerWhisker! < lowerFence || upperWhisker! > upperFence) {
          throw new Error('Box-plot Tukey whiskers must remain inside the 1.5-IQR fences.');
        }
        if (outliers.some((value) => value >= lowerFence && value <= upperFence)) {
          throw new Error('Box-plot Tukey outliers must fall beyond the 1.5-IQR fences.');
        }
      }
      validGroups.add(groupId);
      boxes.push({
        source: {kind: 'summary', datum},
        outlierContexts: outliers.map((value, outlierIndex) => ({
          kind: 'summary',
          datum,
          groupId,
          value,
          outlierIndex,
        })),
        lowerWhisker: lowerWhisker!,
        median: median!,
        outliers,
        q1: q1!,
        q3: q3!,
        series: seriesItem,
        upperWhisker: upperWhisker!,
        whisker: distribution.whisker,
      });
    });
    for (const item of series) {
      if (!validGroups.has(item.id)) {
        throw new Error(`Box-plot summary requires one record for "${item.label}".`);
      }
    }
    boxes.sort((first, second) => first.series.shape - second.series.shape);
  }
  if (props.interaction) {
    if (typeof props.interaction.getOutlierId !== 'function')
      throw new Error('Interactive box plots require getOutlierId.');
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i]!,
        ids = new Set<string>();
      const outlierIds = box.outlierContexts.map((context) => {
        const id = props.interaction!.getOutlierId(context);
        assertText(id, 'Box-plot outlier ID');
        if (ids.has(id))
          throw new Error(`Box-plot outlier ID "${id}" is duplicated in group "${box.series.id}".`);
        ids.add(id);
        return id;
      });
      boxes[i] = {...box, outlierIds};
    }
  }
  return {boxes, invalidCount, kind: 'box', series, xAxis: props.xAxis, yAxis: props.yAxis};
}

function validateCommon<Datum extends object>(props: CommonProps<Datum>): void {
  assertText(props.title, 'Chart title');
  assertText(props.description, 'Chart description');
  assertText(props.dataTableLabel, 'Chart data-table label');
  assertText(props.emptyState.title, 'Empty-state title');
  assertText(props.emptyState.description, 'Empty-state description');
  assertText(props.invalidData.title, 'Invalid-data title');
  assertText(props.invalidData.description, 'Invalid-data description');
  if (props.status?.kind === 'loading') assertText(props.status.label, 'Loading label');
  if (props.status?.kind === 'partial' || props.status?.kind === 'error') {
    assertText(props.status.title, 'Status title');
    assertText(props.status.description, 'Status description');
  }
  if (
    props.aspectRatio !== undefined &&
    (!Number.isFinite(props.aspectRatio) || props.aspectRatio <= 0)
  ) {
    throw new Error('Chart aspectRatio must be a positive finite number.');
  }
  if (
    props.minimumSize !== undefined &&
    (!Number.isFinite(props.minimumSize.width) ||
      !Number.isFinite(props.minimumSize.height) ||
      props.minimumSize.width <= 0 ||
      props.minimumSize.height <= 0)
  ) {
    throw new Error('Chart minimumSize dimensions must be positive finite numbers.');
  }
}

function modelWithDomains<Datum extends object>(
  model: StatisticalModel<Datum>,
  xDomain: readonly [number, number],
  yDomain: readonly [number, number],
): StatisticalModel<Datum> {
  if (model.kind === 'box')
    return {...model, yAxis: {...model.yAxis, scale: {...model.yAxis.scale, domain: yDomain}}};
  if (model.kind === 'histogram')
    return {
      ...model,
      xAxis: {...model.xAxis, scale: {...model.xAxis.scale, domain: xDomain}},
      yAxis: {...model.yAxis, scale: {...model.yAxis.scale, domain: yDomain}},
    };
  return {
    ...model,
    xAxis: {...model.xAxis, scale: {...model.xAxis.scale, domain: xDomain}},
    yAxis: {...model.yAxis, scale: {...model.yAxis.scale, domain: yDomain}},
  };
}

function projectionsFor<Datum extends object>(
  model: StatisticalModel<Datum>,
  plot: PlotBounds,
): StatisticalProjections {
  if (model.kind === 'scatter' || model.kind === 'bubble') {
    return {
      xCategory: null,
      xNumber: createProjection(
        model.xAxis.scale,
        model.points.map((point) => point.x),
        [plot.left, plot.right],
        model.xAxis.tickCount ?? 6,
        false,
      ),
      y: createProjection(
        model.yAxis.scale,
        model.points.map((point) => point.y),
        [plot.bottom, plot.top],
        model.yAxis.tickCount ?? 5,
        false,
      ),
    };
  }
  if (model.kind === 'histogram') {
    return {
      xCategory: null,
      xNumber: createProjection(
        model.xAxis.scale,
        model.bins.flatMap((bin) => [bin.lower, bin.upper]),
        [plot.left, plot.right],
        model.xAxis.tickCount ?? 6,
        false,
      ),
      y: createProjection(
        model.yAxis.scale,
        model.bins.flatMap((bin) => [0, bin.value]),
        [plot.bottom, plot.top],
        model.yAxis.tickCount ?? 5,
        false,
      ),
    };
  }
  return {
    xCategory: createProjection(
      {domain: model.series.map((item) => item.id), type: 'categorical'},
      model.boxes.map((box) => box.series.id),
      [plot.left, plot.right],
      model.series.length,
      false,
    ),
    xNumber: null,
    y: createProjection(
      model.yAxis.scale,
      model.boxes.flatMap((box) => [box.lowerWhisker, box.upperWhisker, ...box.outliers]),
      [plot.bottom, plot.top],
      model.yAxis.tickCount ?? 5,
      false,
    ),
  };
}

function readingTargets<Datum extends object>(
  model: StatisticalModel<Datum>,
  projections: StatisticalProjections,
): ReadingTarget[] {
  if (model.kind === 'scatter' || model.kind === 'bubble') {
    return model.points.flatMap((point) => {
      const x = projections.xNumber?.position(point.x);
      const y = projections.y.position(point.y);
      if (x === undefined || y === undefined) return [];
      const magnitudeRows =
        model.kind === 'bubble' && point.magnitude !== undefined && model.magnitude !== undefined
          ? [
              {
                label: model.magnitude.label,
                value: formatMagnitude(point.magnitude, model.magnitude),
              },
            ]
          : [];
      return [
        {
          id: point.id,
          kind: 'point' as const,
          label: point.label,
          rows: [
            {
              color: point.series.color,
              label: 'Series',
              seriesId: point.series.id,
              shape: point.series.shape,
              value: point.series.label,
            },
            {label: model.xAxis.label, value: formatAxisValue(point.x, model.xAxis)},
            {label: model.yAxis.label, value: formatAxisValue(point.y, model.yAxis)},
            ...magnitudeRows,
          ],
          seriesId: point.series.id,
          sourceIndex: point.sourceIndex,
          x,
          xValue: point.x,
          y,
          yValue: point.y,
        },
      ];
    });
  }
  if (model.kind === 'histogram') {
    return model.bins.flatMap((bin, index) => {
      const left = projections.xNumber?.position(bin.lower);
      const right = projections.xNumber?.position(bin.upper);
      const y = projections.y.position(bin.value);
      if (left === undefined || right === undefined || y === undefined) return [];
      return [
        {
          id: distributionKey({
            kind: 'bin',
            lower: bin.lower,
            upper: bin.upper,
            upperInclusive: bin.final,
          }),
          kind: 'bin' as const,
          label: `${formatAxisValue(bin.lower, model.xAxis)} to ${formatAxisValue(
            bin.upper,
            model.xAxis,
          )}`,
          rows: [
            {
              label: 'Interval',
              value: `[${formatAxisValue(bin.lower, model.xAxis)}, ${formatAxisValue(
                bin.upper,
                model.xAxis,
              )}${bin.final ? ']' : ')'}`,
            },
            {
              color: model.color,
              label: model.yAxis.label,
              shape: 'box' as const,
              value: formatAxisValue(bin.value, model.yAxis),
            },
            {
              label: 'Ordinate',
              value: bin.ordinate[0]!.toUpperCase() + bin.ordinate.slice(1),
            },
          ],
          sourceIndex: index,
          x: (left + right) / 2,
          y,
        },
      ];
    });
  }
  return model.boxes.flatMap((box, boxIndex) => {
    const x = projections.xCategory?.position(box.series.id);
    const medianY = projections.y.position(box.median);
    if (x === undefined || medianY === undefined) return [];
    const summaryRows: ReadingRow[] = [
      {
        color: box.series.color,
        label: 'Group',
        seriesId: box.series.id,
        shape: 'box' as const,
        value: box.series.label,
      },
      {label: 'Lower whisker', value: formatAxisValue(box.lowerWhisker, model.yAxis)},
      {label: 'First quartile', value: formatAxisValue(box.q1, model.yAxis)},
      {label: 'Median', value: formatAxisValue(box.median, model.yAxis)},
      {label: 'Third quartile', value: formatAxisValue(box.q3, model.yAxis)},
      {label: 'Upper whisker', value: formatAxisValue(box.upperWhisker, model.yAxis)},
    ];
    const summary: ReadingTarget = {
      id: distributionKey({kind: 'summary', groupId: box.series.id}),
      kind: 'box',
      label: `${box.series.label} distribution`,
      rows: summaryRows,
      seriesId: box.series.id,
      sourceIndex: boxIndex,
      x,
      y: medianY,
    };
    const outliers = box.outliers.flatMap((value, outlierIndex) => {
      const y = projections.y.position(value);
      if (y === undefined) return [];
      return [
        {
          id: box.outlierIds
            ? distributionKey({
                kind: 'outlier',
                groupId: box.series.id,
                outlierId: box.outlierIds[outlierIndex]!,
              })
            : `outlier-${box.series.id}-${value}-${outlierIndex}`,
          kind: 'outlier' as const,
          label: `${box.series.label} outlier`,
          rows: [summaryRows[0]!, {label: 'Outlier', value: formatAxisValue(value, model.yAxis)}],
          seriesId: box.series.id,
          sourceIndex: boxIndex,
          x,
          y,
        },
      ];
    });
    return [summary, ...outliers];
  });
}

function LegendSwatch({
  kind,
  series,
}: {
  readonly kind: StatisticalKind;
  readonly series: InternalSeries;
}): ReactElement {
  return (
    <svg
      aria-hidden="true"
      data-wcl-chart-legend-swatch=""
      data-wcl-statistical-legend-swatch=""
      focusable="false"
      viewBox="0 0 20 12"
    >
      {kind === 'box' ? (
        <rect
          data-shape="box"
          data-wcl-statistical-legend-mark=""
          height="8"
          width="14"
          x="3"
          y="2"
        />
      ) : (
        <PointShape cx={10} cy={6} radius={4} shape={series.shape} swatch />
      )}
    </svg>
  );
}

function StatisticalLegend({
  hiddenIds,
  visibilityLabels,
  onVisibilityChange,
  firstEye,
  emphasizedSeriesId,
  kind,
  legend,
  onClear,
  onPin,
  onTransientChange,
  pinnedSeriesId,
  series,
}: {
  readonly emphasizedSeriesId: string | undefined;
  readonly kind: StatisticalKind;
  readonly hiddenIds: readonly string[];
  readonly visibilityLabels: ChartVisibilityLabels | undefined;
  readonly onVisibilityChange: (id: string) => void;
  readonly firstEye: React.Ref<HTMLButtonElement>;
  readonly legend: ChartLegend;
  readonly onClear: () => void;
  readonly onPin: (seriesId: string) => void;
  readonly onTransientChange: (seriesId: string | null) => void;
  readonly pinnedSeriesId: string | null;
  readonly series: readonly InternalSeries[];
}): ReactElement {
  return (
    <ul
      aria-label={legend.label}
      data-wcl-chart-legend=""
      data-visibility={visibilityLabels ? '' : undefined}
    >
      {series.map((item, index) => (
        <li
          data-color={item.color}
          data-emphasized={emphasizedSeriesId === item.id ? '' : undefined}
          data-muted={
            emphasizedSeriesId !== undefined && emphasizedSeriesId !== item.id ? '' : undefined
          }
          data-series-index={index}
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
            <LegendSwatch kind={kind} series={item} />
            {item.label}
          </button>
          {visibilityLabels ? (
            <ChartVisibilityButton
              hidden={hiddenIds.includes(item.id)}
              label={
                hiddenIds.includes(item.id)
                  ? visibilityLabels.showSeries(item.label)
                  : visibilityLabels.hideSeries(item.label)
              }
              onToggle={() => onVisibilityChange(item.id)}
              onClear={onClear}
              buttonRef={index === 0 ? firstEye : undefined}
            />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function PointShape({
  cx,
  cy,
  radius,
  shape,
  swatch = false,
  tooltip = false,
  cue,
}: {
  readonly cx: number;
  readonly cy: number;
  readonly radius: number;
  readonly shape: number;
  readonly swatch?: boolean;
  readonly tooltip?: boolean;
  readonly cue?: 'reading' | 'center' | 'selection' | 'activation';
}): ReactElement {
  const attributes = {
    'data-shape': String(shape),
    ...(cue
      ? {'data-wcl-point-cue': cue}
      : tooltip
        ? {'data-wcl-statistical-tooltip-mark': ''}
        : swatch
          ? {'data-wcl-statistical-legend-mark': ''}
          : {'data-wcl-statistical-point': ''}),
  };
  if (shape % 6 === 1) {
    return (
      <rect
        {...attributes}
        height={radius * 1.7}
        transform={`rotate(45 ${cx} ${cy})`}
        width={radius * 1.7}
        x={cx - radius * 0.85}
        y={cy - radius * 0.85}
      />
    );
  }
  if (shape % 6 === 2) {
    return (
      <path
        {...attributes}
        d={`M ${cx} ${cy - radius} L ${cx + radius} ${cy + radius} L ${cx - radius} ${cy + radius} Z`}
      />
    );
  }
  if (shape % 6 === 3) {
    return (
      <rect
        {...attributes}
        height={radius * 1.7}
        width={radius * 1.7}
        x={cx - radius * 0.85}
        y={cy - radius * 0.85}
      />
    );
  }
  if (shape % 6 === 4) {
    return (
      <path
        {...attributes}
        d={`M ${cx - radius} ${cy - radius * 0.35} H ${cx - radius * 0.35} V ${cy - radius} H ${cx + radius * 0.35} V ${cy - radius * 0.35} H ${cx + radius} V ${cy + radius * 0.35} H ${cx + radius * 0.35} V ${cy + radius} H ${cx - radius * 0.35} V ${cy + radius * 0.35} H ${cx - radius} Z`}
      />
    );
  }
  if (shape % 6 === 5) {
    return (
      <path
        {...attributes}
        d={`M ${cx} ${cy - radius} L ${cx + radius * 0.87} ${cy - radius * 0.5} L ${cx + radius * 0.87} ${cy + radius * 0.5} L ${cx} ${cy + radius} L ${cx - radius * 0.87} ${cy + radius * 0.5} L ${cx - radius * 0.87} ${cy - radius * 0.5} Z`}
      />
    );
  }
  return <circle {...attributes} cx={cx} cy={cy} r={radius} />;
}

function pointShapeAreaCoefficient(shape: number): number {
  if (shape % 6 === 1 || shape % 6 === 3) return 1.7 ** 2;
  if (shape % 6 === 2) return 2;
  if (shape % 6 === 4) return 2.31;
  if (shape % 6 === 5) return 2.61;
  return Math.PI;
}

function radiusForEquivalentCircleArea(radius: number, shape: number): number {
  return radius * Math.sqrt(Math.PI / pointShapeAreaCoefficient(shape));
}

function StatisticalTooltip({
  activeSeriesId,
  pointer,
  portalTarget,
  reading,
  svg,
}: {
  readonly activeSeriesId: string | undefined;
  readonly pointer?: {readonly x: number; readonly y: number};
  readonly portalTarget: Element | null;
  readonly reading: ReadingTarget;
  readonly svg: SVGSVGElement | null;
}): ReactElement | null {
  const viewportWidth = typeof window === 'undefined' ? viewWidth : window.innerWidth;
  const viewportHeight = typeof window === 'undefined' ? viewHeight : window.innerHeight;
  const contentKey = [
    reading.label,
    activeSeriesId ?? '',
    ...reading.rows.flatMap((row) => [row.label, row.value]),
  ].join('\u0000');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipSize, setTooltipSize] = useState<{
    readonly height: number;
    readonly width: number;
  }>();
  useLayoutEffect(() => {
    const element = tooltipRef.current;
    if (element === null) return;
    const bounds = element.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return;
    setTooltipSize((current) =>
      current?.width === bounds.width && current.height === bounds.height
        ? current
        : {height: bounds.height, width: bounds.width},
    );
  }, [contentKey, viewportWidth]);
  if (portalTarget === null) return null;
  const anchor = pointer ?? clientPointFromViewBox(svg, reading.x, reading.y);
  const gap = 12;
  const padding = 8;
  const width = tooltipSize?.width ?? Math.min(304, Math.max(176, viewportWidth - padding * 2));
  const height = tooltipSize?.height ?? 50 + reading.rows.length * 25;
  const before = anchor.x - gap;
  const after = viewportWidth - anchor.x - gap;
  const horizontalPlacement = after >= width || after >= before ? 'start' : 'end';
  const preferredLeft = horizontalPlacement === 'start' ? anchor.x + gap : anchor.x - gap - width;
  const style: ChartTooltipStyles = {
    '--wcl-chart-tooltip-left': `${clamp(padding, preferredLeft, Math.max(padding, viewportWidth - width - padding))}px`,
    '--wcl-chart-tooltip-y': `${anchor.y}px`,
  };
  return createPortal(
    <div data-wcl-chart-tooltip-layer="">
      <div
        data-horizontal-placement={horizontalPlacement}
        data-vertical-placement={
          anchor.y < height / 2 + gap
            ? 'start'
            : anchor.y + height / 2 + gap > viewportHeight
              ? 'end'
              : 'center'
        }
        data-wcl-chart-tooltip=""
        ref={tooltipRef}
        role="tooltip"
        style={style}
      >
        <strong>{reading.label}</strong>
        <dl>
          {reading.rows.map((row, index) => (
            <div
              data-active={
                row.seriesId !== undefined && row.seriesId === activeSeriesId ? '' : undefined
              }
              key={`${row.label}-${index}`}
            >
              <dt>
                {row.color === undefined ? null : (
                  <svg
                    aria-hidden="true"
                    data-color={row.color}
                    data-wcl-chart-tooltip-swatch=""
                    focusable="false"
                    viewBox="0 0 20 8"
                  >
                    {row.shape === 'box' ? (
                      <rect
                        data-wcl-statistical-tooltip-mark=""
                        height="6"
                        width="12"
                        x="4"
                        y="1"
                      />
                    ) : (
                      <PointShape
                        cx={10}
                        cy={4}
                        radius={3}
                        shape={typeof row.shape === 'number' ? row.shape : 0}
                        tooltip
                      />
                    )}
                  </svg>
                )}
                {row.label}
              </dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>,
    portalTarget,
  );
}

function spatialTarget(
  readings: readonly ReadingTarget[],
  currentIndex: number,
  key: string,
  skipCoincident = false,
): number {
  const current = readings[currentIndex] ?? readings[0];
  if (current === undefined) return currentIndex;
  if (key === 'Home' || key === 'End') {
    const ordered = readings
      .map((reading, index) => ({index, reading}))
      .sort(
        (first, second) =>
          (first.reading.xValue ?? 0) - (second.reading.xValue ?? 0) ||
          first.reading.id.localeCompare(second.reading.id),
      );
    return (key === 'Home' ? ordered[0] : ordered.at(-1))?.index ?? currentIndex;
  }
  const coincident = readings
    .map((reading, index) => ({index, reading}))
    .filter(
      ({index, reading}) =>
        index !== currentIndex &&
        reading.xValue === current.xValue &&
        reading.yValue === current.yValue,
    )
    .sort((first, second) => first.reading.id.localeCompare(second.reading.id));
  if (!skipCoincident && coincident.length > 0) {
    return (
      (key === 'ArrowLeft' || key === 'ArrowDown' ? coincident.at(-1) : coincident[0])?.index ??
      currentIndex
    );
  }
  const candidates = readings
    .map((reading, index) => ({index, reading}))
    .filter(({reading}) => {
      const dx = (reading.xValue ?? 0) - (current.xValue ?? 0);
      const dy = (reading.yValue ?? 0) - (current.yValue ?? 0);
      if (key === 'ArrowLeft') return dx < 0;
      if (key === 'ArrowRight') return dx > 0;
      if (key === 'ArrowUp') return dy > 0;
      return dy < 0;
    })
    .map((candidate) => {
      const dx = (candidate.reading.xValue ?? 0) - (current.xValue ?? 0);
      const dy = (candidate.reading.yValue ?? 0) - (current.yValue ?? 0);
      const primary = key === 'ArrowLeft' || key === 'ArrowRight' ? Math.abs(dx) : Math.abs(dy);
      const perpendicular =
        key === 'ArrowLeft' || key === 'ArrowRight' ? Math.abs(dy) : Math.abs(dx);
      return {...candidate, score: Math.hypot(dx, dy) + (perpendicular / primary) * 100};
    })
    .sort(
      (first, second) =>
        first.score - second.score || first.reading.id.localeCompare(second.reading.id),
    );
  return candidates[0]?.index ?? currentIndex;
}

function pointRadius<Datum extends object>(
  model: PointModel<Datum, 'scatter' | 'bubble'>,
  point: PreparedPoint,
  presentation: PresentationMetrics,
  maximum: number,
): number {
  if (model.kind === 'scatter')
    return clamp(7.25, presentation.canvasWidth * 0.011, 11.25) / presentation.viewScale;
  const radius =
    (Math.sqrt((point.magnitude ?? 0) / maximum) * clamp(24, presentation.canvasWidth * 0.04, 42)) /
    presentation.viewScale;
  return radiusForEquivalentCircleArea(radius, point.series.shape);
}

function StatisticalMarks<Datum extends object>({
  activeIndex,
  directIndex,
  legendSeriesId,
  model,
  pinnedSeriesId,
  presentation,
  projections,
  readings,
}: {
  readonly activeIndex: number | null;
  readonly directIndex: number | null;
  readonly legendSeriesId: string | undefined;
  readonly model: StatisticalModel<Datum>;
  readonly pinnedSeriesId: string | null;
  readonly presentation: PresentationMetrics;
  readonly projections: StatisticalProjections;
  readonly readings: readonly ReadingTarget[];
}): ReactElement {
  const isMuted = (index: number, seriesId?: string): boolean =>
    directIndex !== null
      ? index !== directIndex
      : legendSeriesId !== undefined && seriesId !== legendSeriesId;
  if (model.kind === 'scatter' || model.kind === 'bubble') {
    const maximum = model.points.reduce((max, point) => Math.max(max, point.magnitude ?? 1), 0);
    const pointRows = model.points.map((point, index) => ({
      index,
      point,
      reading: readings[index]!,
    }));
    pointRows.sort((first, second) => {
      const layer = ({index, point}: (typeof pointRows)[number]) =>
        Number(point.series.id === pinnedSeriesId) * 2 + Number(index === activeIndex);
      return layer(first) - layer(second);
    });
    return (
      <g data-wcl-chart-marks="">
        {pointRows.map(({index, point, reading}) => {
          const radius = pointRadius(model, point, presentation, maximum);
          return (
            <g
              data-active={activeIndex === index ? '' : undefined}
              data-color={point.series.color}
              data-mark-radius={radius}
              data-muted={isMuted(index, point.series.id) ? '' : undefined}
              data-point-id={point.id}
              data-reading-index={index}
              data-series-id={point.series.id}
              data-series-index={point.series.shape}
              data-wcl-statistical-mark=""
              key={point.id}
            >
              <PointShape
                cx={reading.x}
                cy={reading.y}
                radius={radius}
                shape={point.series.shape}
              />
            </g>
          );
        })}
      </g>
    );
  }
  if (model.kind === 'histogram') {
    return (
      <g data-wcl-chart-marks="">
        {model.bins.map((bin, index) => {
          const left = projections.xNumber?.position(bin.lower) ?? 0;
          const right = projections.xNumber?.position(bin.upper) ?? 0;
          const y = projections.y.position(bin.value)!;
          const baseline = projections.y.position(0)!;
          return (
            <rect
              data-active={activeIndex === index ? '' : undefined}
              data-color={model.color}
              data-muted={isMuted(index) ? '' : undefined}
              data-reading-index={index}
              data-wcl-histogram-bin=""
              data-wcl-statistical-mark=""
              height={Math.abs(baseline - y)}
              key={`${bin.lower}-${bin.upper}-${bin.sourceIndex}`}
              width={Math.max(0, right - left)}
              x={left}
              y={Math.min(y, baseline)}
            />
          );
        })}
      </g>
    );
  }
  return (
    <g data-wcl-chart-marks="">
      {model.boxes.map((box, boxPosition) => {
        const summaryIndex = model.boxes
          .slice(0, boxPosition)
          .reduce((total, item) => total + 1 + item.outliers.length, 0);
        const outlierIndices = box.outliers.map((_, index) => summaryIndex + index + 1);
        const center = projections.xCategory?.position(box.series.id) ?? 0;
        const bandwidth = boxBandwidth(model.series.length);
        const q1 = projections.y.position(box.q1)!;
        const q3 = projections.y.position(box.q3)!;
        return (
          <g
            data-color={box.series.color}
            data-series-id={box.series.id}
            data-series-index={box.series.shape}
            key={box.series.id}
          >
            <g
              data-active={activeIndex === summaryIndex ? '' : undefined}
              data-muted={isMuted(summaryIndex, box.series.id) ? '' : undefined}
              data-reading-index={summaryIndex}
              data-wcl-box-summary=""
              data-wcl-statistical-mark=""
            >
              <rect
                data-wcl-box-quartile=""
                height={q1 - q3}
                width={bandwidth}
                x={center - bandwidth / 2}
                y={q3}
              />
              <line
                data-wcl-box-whisker=""
                x1={center}
                x2={center}
                y1={projections.y.position(box.upperWhisker)}
                y2={q3}
              />
              <line
                data-wcl-box-whisker=""
                x1={center}
                x2={center}
                y1={q1}
                y2={projections.y.position(box.lowerWhisker)}
              />
              <line
                data-wcl-box-whisker-cap=""
                x1={center - bandwidth / 4}
                x2={center + bandwidth / 4}
                y1={projections.y.position(box.upperWhisker)}
                y2={projections.y.position(box.upperWhisker)}
              />
              <line
                data-wcl-box-whisker-cap=""
                x1={center - bandwidth / 4}
                x2={center + bandwidth / 4}
                y1={projections.y.position(box.lowerWhisker)}
                y2={projections.y.position(box.lowerWhisker)}
              />
              <line
                data-wcl-box-median=""
                x1={center - bandwidth / 2}
                x2={center + bandwidth / 2}
                y1={projections.y.position(box.median)}
                y2={projections.y.position(box.median)}
              />
            </g>
            {box.outliers.map((outlier, outlierIndex) => {
              const index = outlierIndices[outlierIndex]!;
              return (
                <circle
                  cx={center}
                  cy={projections.y.position(outlier)}
                  data-active={activeIndex === index ? '' : undefined}
                  data-muted={isMuted(index, box.series.id) ? '' : undefined}
                  data-reading-index={index}
                  data-wcl-box-outlier=""
                  data-wcl-statistical-mark=""
                  key={`${outlier}-${outlierIndex}`}
                  r={5 / presentation.viewScale}
                />
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

function StatisticalTable<Datum extends object>({
  hiddenIds = [],
  hiddenLabel,
  dataTableLabel,
  model,
}: {
  readonly dataTableLabel: string;
  readonly hiddenIds?: readonly string[];
  readonly hiddenLabel?: string | undefined;
  readonly model: StatisticalModel<Datum>;
}): ReactElement {
  if (model.kind === 'scatter' || model.kind === 'bubble') {
    return (
      <table aria-label={dataTableLabel} data-wcl-chart-table="">
        <thead>
          <tr>
            <th scope="col">Observation</th>
            <th scope="col">Series</th>
            <th scope="col">{axisHeading(model.xAxis)}</th>
            <th scope="col">{axisHeading(model.yAxis)}</th>
            {model.kind === 'bubble' ? (
              <th scope="col">
                {model.magnitude === undefined ? '' : axisHeading(model.magnitude)}
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {model.points.map((point) => (
            <tr key={point.id}>
              <th scope="row">{point.label}</th>
              <td>
                {point.series.label}
                {hiddenIds.includes(point.series.id) ? ` ${hiddenLabel ?? ''}` : ''}
              </td>
              <td>{axisTickLabel(point.x, model.xAxis)}</td>
              <td>{axisTickLabel(point.y, model.yAxis)}</td>
              {model.kind === 'bubble' ? (
                <td>
                  {point.magnitude === undefined || model.magnitude === undefined
                    ? ''
                    : (model.magnitude.formatValue?.(point.magnitude) ?? point.magnitude)}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  if (model.kind === 'histogram') {
    return (
      <table aria-label={dataTableLabel} data-wcl-chart-table="">
        <thead>
          <tr>
            <th scope="col">{axisHeading(model.xAxis)} interval</th>
            <th scope="col">{axisHeading(model.yAxis)}</th>
            <th scope="col">Ordinate</th>
          </tr>
        </thead>
        <tbody>
          {model.bins.map((bin) => (
            <tr key={`${bin.lower}-${bin.upper}-${bin.sourceIndex}`}>
              <th scope="row">
                [{axisTickLabel(bin.lower, model.xAxis)}, {axisTickLabel(bin.upper, model.xAxis)}
                {bin.final ? ']' : ')'}
              </th>
              <td>{axisTickLabel(bin.value, model.yAxis)}</td>
              <td>{bin.ordinate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  const unitSuffix = model.yAxis.unit === undefined ? '' : ` (${model.yAxis.unit})`;
  return (
    <table aria-label={dataTableLabel} data-wcl-chart-table="">
      <thead>
        <tr>
          <th scope="col">Group</th>
          <th scope="col">Lower whisker{unitSuffix}</th>
          <th scope="col">Q1{unitSuffix}</th>
          <th scope="col">Median{unitSuffix}</th>
          <th scope="col">Q3{unitSuffix}</th>
          <th scope="col">Upper whisker{unitSuffix}</th>
          <th scope="col">Whisker method</th>
          <th scope="col">Outliers{unitSuffix}</th>
        </tr>
      </thead>
      <tbody>
        {model.boxes.map((box) => (
          <tr key={box.series.id}>
            <th scope="row">
              {box.series.label}
              {hiddenIds.includes(box.series.id) ? ` ${hiddenLabel ?? ''}` : ''}
            </th>
            <td>{axisTickLabel(box.lowerWhisker, model.yAxis)}</td>
            <td>{axisTickLabel(box.q1, model.yAxis)}</td>
            <td>{axisTickLabel(box.median, model.yAxis)}</td>
            <td>{axisTickLabel(box.q3, model.yAxis)}</td>
            <td>{axisTickLabel(box.upperWhisker, model.yAxis)}</td>
            <td>{box.whisker === 'tukey' ? 'Tukey 1.5 IQR' : 'Minimum to maximum'}</td>
            <td>
              {box.outliers.length === 0
                ? 'None'
                : box.outliers.map((value) => axisTickLabel(value, model.yAxis)).join(', ')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function boxBandwidth(groupCount: number): number {
  return Math.max(44, Math.min(88, 560 / Math.max(3, groupCount) / 2));
}
function distributionPoints<Datum extends object>(
  model: StatisticalModel<Datum>,
  projections: StatisticalProjections,
  readings: readonly ReadingTarget[],
  presentation: PresentationMetrics,
): DistributionPoint[] {
  const point = (index: number, seriesId: string): Omit<DistributionPoint, 'kind'> => ({
    index,
    x: readings[index]!.x,
    y: readings[index]!.y,
    categoryPosition: readings[index]!.x,
    seriesId,
    item: {rowId: readings[index]!.id, seriesId: ''},
    radius: 5 / presentation.viewScale,
    shape: 0,
  });
  if (model.kind === 'histogram')
    return model.bins.map((bin, index) => {
      const x = projections.xNumber!.position(bin.lower)!,
        right = projections.xNumber!.position(bin.upper)!,
        y = projections.y.position(bin.value)!,
        base = projections.y.position(0)!;
      return {
        ...point(index, ''),
        kind: 'bin',
        bounds: {x, y: Math.min(y, base), width: right - x, height: Math.abs(base - y)},
      };
    });
  if (model.kind !== 'box') return [];
  let index = 0;
  return model.boxes.flatMap((box) => {
    const summary = point(index++, box.series.id),
      center = summary.x,
      width = boxBandwidth(model.series.length),
      q1 = projections.y.position(box.q1)!,
      q3 = projections.y.position(box.q3)!,
      upper = projections.y.position(box.upperWhisker)!,
      lower = projections.y.position(box.lowerWhisker)!;
    return [
      {
        ...summary,
        kind: 'summary' as const,
        bounds: {x: center - width / 2, y: q3, width, height: q1 - q3},
        whiskers: [
          {x1: center, x2: center, y1: upper, y2: q3},
          {x1: center, x2: center, y1: q1, y2: lower},
          {x1: center - width / 4, x2: center + width / 4, y1: upper, y2: upper},
          {x1: center - width / 4, x2: center + width / 4, y1: lower, y2: lower},
        ],
      },
      ...box.outliers.map(() => ({...point(index++, box.series.id), kind: 'outlier' as const})),
    ];
  });
}

function StatisticalFrame<Datum extends object>({
  common,
  legend,
  interaction,
  distribution,
  model: fullModel,
  rootAttribute,
}: {
  readonly common: CommonProps<Datum>;
  readonly interaction?: PointChartInteraction<Datum>;
  readonly distribution?: DistributionSetup;
  readonly legend?: ChartLegend;
  readonly model: StatisticalModel<Datum>;
  readonly rootAttribute: string;
}): ReactElement {
  validateCommon(common);
  const aspectRatio = common.aspectRatio ?? 1.75;
  const minimumSize = common.minimumSize ?? {height: 180, width: 320};
  const overflow = common.overflow ?? 'scroll';
  const status = common.status ?? {kind: 'ready'};
  const availableSeriesIds =
    fullModel.kind === 'histogram' ? [] : fullModel.series.map((series) => series.id);
  const seriesIdentity = JSON.stringify(availableSeriesIds);
  const titleId = useId();
  const clipId = useId();
  const marksClipId = useId();
  const {isFocusVisible} = useFocusVisible();
  const descriptionId = useId();
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);
  const [frameElement, setFrameElement] = useState<HTMLDivElement | null>(null);
  const [svgElement, setSvgElement] = useState<SVGSVGElement | null>(null);
  const [availableWidth, setAvailableWidth] = useState<number | null>(null);
  const [transientLegendSeriesId, setTransientLegendSeriesId] = useState<string | null>(null);
  const [pinnedLegendSeriesId, setPinnedLegendSeriesId] = useState<string | null>(null);
  const [retainedSeriesIdentity, setRetainedSeriesIdentity] = useState(seriesIdentity);
  const firstEye = useRef<HTMLButtonElement>(null);
  const visibilityLabels = common.visibilityLabels;
  if (visibilityLabels) {
    if (!legend || fullModel.kind === 'histogram')
      throw new Error('Statistical visibility requires a visible group legend.');
    assertText(visibilityLabels.hidden, 'Hidden-group label');
    assertText(visibilityLabels.showAll, 'Show-all label');
    assertText(visibilityLabels.allHidden.title, 'All-hidden title');
    assertText(visibilityLabels.allHidden.description, 'All-hidden description');
    for (const series of fullModel.series) {
      assertText(visibilityLabels.hideSeries(series.label), 'Hide-group label');
      assertText(visibilityLabels.showSeries(series.label), 'Show-group label');
    }
  }
  const [hiddenSeriesIds, setHiddenSeriesIds] = useState<readonly string[]>([]);
  const hiddenIds = visibilityLabels
    ? hiddenSeriesIds.filter((id) => availableSeriesIds.includes(id))
    : [];
  const visibleModel =
    fullModel.kind === 'histogram'
      ? fullModel
      : fullModel.kind === 'box'
        ? {
            ...fullModel,
            series: fullModel.series.filter((s) => !hiddenIds.includes(s.id)),
            boxes: fullModel.boxes.filter((b) => !hiddenIds.includes(b.series.id)),
          }
        : {
            ...fullModel,
            series: fullModel.series.filter((s) => !hiddenIds.includes(s.id)),
            points: fullModel.points.filter((p) => !hiddenIds.includes(p.series.id)),
          };
  const scrollbarActivityProps = useScrollbarActivity<HTMLDivElement>();
  useEffect(() => {
    if (frameElement === null) return;
    const measure = (): void => {
      if (frameElement.clientWidth > 0) setAvailableWidth(frameElement.clientWidth);
    };
    measure();
    const ResizeObserverConstructor = frameElement.ownerDocument.defaultView?.ResizeObserver;
    if (ResizeObserverConstructor === undefined) return;
    const observer = new ResizeObserverConstructor(measure);
    observer.observe(frameElement);
    return () => observer.disconnect();
  }, [frameElement]);
  const categoryLabels =
    visibleModel.kind === 'box' ? visibleModel.series.map((item) => item.label) : [];
  const presentation = presentationMetrics(
    availableWidth ?? minimumSize.width,
    minimumSize.width,
    categoryLabels,
  );
  const initialPlot = plotForPresentation(presentation);
  const initialProjections = projectionsFor(visibleModel, initialPlot);
  const yAxis = visibleModel.yAxis;
  const visibleHasData =
    visibleModel.kind === 'box'
      ? !!visibleModel.boxes.length
      : visibleModel.kind === 'histogram'
        ? !!visibleModel.bins.length
        : !!visibleModel.points.length;
  const animate =
    !!visibilityLabels && visibleHasData && status.kind !== 'loading' && status.kind !== 'error';
  const xScale = visibleModel.kind === 'box' ? undefined : visibleModel.xAxis.scale;
  const xDomain = useAnimatedChartDomain(
    [initialProjections.xNumber?.domain?.[0] ?? 0, initialProjections.xNumber?.domain?.[1] ?? 1],
    animate && xScale !== undefined && xScale.domain === undefined,
    xScale?.type === 'logarithmic',
  );
  const yDomain = useAnimatedChartDomain(
    [initialProjections.y.domain?.[0] ?? 0, initialProjections.y.domain?.[1] ?? 1],
    animate && yAxis.scale.domain === undefined,
    yAxis.scale.type === 'logarithmic',
  );
  const model = modelWithDomains(visibleModel, xDomain, yDomain);
  const yLabels = projectionsFor(model, initialPlot).y.ticks.map((tick) =>
    axisTickLabel(tick, yAxis),
  );
  const plot = plotForYAxisLabels(
    yLabels,
    presentation.fontSize / presentation.viewScale / 16,
    initialPlot,
  );
  const projections = projectionsFor(model, plot);
  const readings = readingTargets(model, projections);
  const allReadings = readingTargets(fullModel, projectionsFor(fullModel, initialPlot));
  const distributionGeometry = distributionPoints(model, projections, readings, presentation);
  const readingIdentity = JSON.stringify(readings.map((reading) => reading.id));
  const readingGeometry = JSON.stringify({
    model: statisticalModelGeometry(model),
    distribution: distributionGeometry.map((point) => [point.bounds, point.whiskers]),
    presentation: [
      aspectRatio,
      availableWidth,
      minimumSize.height,
      minimumSize.width,
      overflow,
      presentation.canvasWidth,
      presentation.pointStrokeWidth,
      presentation.viewScale,
    ],
    readings: readings.map((reading) => [reading.id, reading.x, reading.y]),
  });
  const pointModel = model.kind === 'scatter' || model.kind === 'bubble' ? model : undefined;
  const fullPointModel =
    fullModel.kind === 'scatter' || fullModel.kind === 'bubble' ? fullModel : undefined;
  const interactionRows = fullPointModel
    ? fullPointModel.points.map((point) => ({
        id: point.id,
        category: point.x,
        datum: common.data[point.sourceIndex]!,
        values: [
          {
            seriesId: point.series.id,
            label: point.series.label,
            value: point.y,
            hidden: hiddenIds.includes(point.series.id),
          },
        ],
      }))
    : allReadings.map((reading) => ({
        id: reading.id,
        category: reading.x,
        datum: reading,
        values: [{seriesId: '', label: reading.label, value: 0, hidden: false}],
      }));
  const configuration:
    Pick<ChartInteraction<object, number>, 'target' | 'selection' | 'onActivate'> | undefined =
    interaction
      ? {
          target: 'point',
          ...(interaction.selection ? {selection: interaction.selection} : {}),
          ...(interaction.onActivate
            ? {
                onActivate: (activation) => {
                  const point = pointModel?.points.find(
                    (item) => item.id === activation.item.rowId,
                  );
                  if (point)
                    interaction.onActivate?.({
                      item: activation.item,
                      datum: common.data[point.sourceIndex]!,
                      input: activation.input,
                      label: point.label,
                      x: point.x,
                      y: point.y,
                      ...(point.magnitude === undefined ? {} : {magnitude: point.magnitude}),
                    });
                },
              }
            : {}),
        }
      : distribution
        ? {
            target: 'point',
            ...(distribution.selection ? {selection: distribution.selection} : {}),
            ...(distribution.onActivate
              ? {onActivate: (event) => distribution.onActivate?.(event.item.rowId, event.input)}
              : {}),
          }
        : undefined;
  const interactive = configuration !== undefined;
  const actions = useChartInteraction(
    configuration,
    interactionRows,
    JSON.stringify([readingGeometry, status.kind, hiddenIds]),
    common.data,
  );
  const maximumMagnitude = (pointModel?.points ?? []).reduce(
    (max, point) => Math.max(max, point.magnitude ?? 1),
    0,
  );
  const points: DistributionPoint[] = pointModel
    ? pointModel.points.map((point, index) => ({
        kind: 'point' as const,
        index,
        x: readings[index]!.x,
        y: readings[index]!.y,
        categoryPosition: readings[index]!.x,
        seriesId: point.series.id,
        item: {rowId: point.id, seriesId: point.series.id},
        radius: pointRadius(pointModel, point, presentation, maximumMagnitude),
        shape: point.series.shape,
      }))
    : distributionGeometry;
  // Allow complete boundary marks, but contain returning groups while the axes expand.
  const markPadding =
    points.reduce((padding, point) => Math.max(padding, point.radius * Math.SQRT2), 0) +
    2 / presentation.viewScale;
  const marksBounds = {
    left: Math.max(0, plot.left - markPadding),
    right: Math.min(viewWidth, plot.right + markPadding),
    top: Math.max(0, plot.top - markPadding),
    bottom: Math.min(viewHeight, plot.bottom + markPadding),
  };
  const inPlot = (x: number, y: number) =>
    x >= plot.left && x <= plot.right && y >= plot.top && y <= plot.bottom;
  const selectablePoints = points.filter((point) => inPlot(point.x, point.y));
  const selectedKeys = new Set(actions.selected.map(selectionKey));
  const [retainedReadingIdentity, setRetainedReadingIdentity] = useState(readingIdentity);
  const [retainedReadingGeometry, setRetainedReadingGeometry] = useState(readingGeometry);
  const [keyboardReadingId, setKeyboardReadingId] = useState<string | null>(null);
  const [pointerReadingId, setPointerReadingId] = useState<string | null>(null);
  const [touchReadingId, setTouchReadingId] = useState<string | null>(null);
  const [pointerPosition, setPointerPosition] = useState<{
    readonly x: number;
    readonly y: number;
  }>();
  if (retainedSeriesIdentity !== seriesIdentity) {
    setRetainedSeriesIdentity(seriesIdentity);
    setHiddenSeriesIds((ids) => ids.filter((id) => availableSeriesIds.includes(id)));
    setPinnedLegendSeriesId((current) =>
      current !== null && !availableSeriesIds.includes(current) ? null : current,
    );
    setTransientLegendSeriesId((current) =>
      current !== null && !availableSeriesIds.includes(current) ? null : current,
    );
  }
  if (retainedReadingIdentity !== readingIdentity) {
    setRetainedReadingIdentity(readingIdentity);
    setRetainedReadingGeometry(readingGeometry);
    setKeyboardReadingId(null);
    setPointerReadingId(null);
    setTouchReadingId(null);
    setPointerPosition(undefined);
  } else if (retainedReadingGeometry !== readingGeometry) {
    setRetainedReadingGeometry(readingGeometry);
    setPointerReadingId(null);
    setTouchReadingId(null);
    setPointerPosition(undefined);
  }
  useEffect(() => {
    if (touchReadingId === null) return;
    const dismiss = (event: globalThis.PointerEvent): void => {
      if (event.target instanceof Node && !rootElement?.contains(event.target))
        setTouchReadingId(null);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [rootElement, touchReadingId]);
  const hasData = allReadings.length > 0;
  const indexForReadingId = (id: string | null): number | null => {
    if (id === null) return null;
    const index = readings.findIndex((reading) => reading.id === id);
    return index < 0 ? null : index;
  };
  const activeReadingId = pointerReadingId ?? touchReadingId ?? keyboardReadingId;
  const activeIndex = indexForReadingId(activeReadingId);
  const activeReading = activeIndex === null ? undefined : readings[activeIndex];
  const directIndex = indexForReadingId(pointerReadingId ?? touchReadingId);
  const directReading = directIndex === null ? undefined : readings[directIndex];
  const validPinnedSeriesId =
    pinnedLegendSeriesId !== null &&
    availableSeriesIds.includes(pinnedLegendSeriesId) &&
    !hiddenIds.includes(pinnedLegendSeriesId)
      ? pinnedLegendSeriesId
      : null;
  const validTransientSeriesId =
    transientLegendSeriesId !== null &&
    availableSeriesIds.includes(transientLegendSeriesId) &&
    !hiddenIds.includes(transientLegendSeriesId)
      ? transientLegendSeriesId
      : null;
  const legendSeriesId = validPinnedSeriesId ?? validTransientSeriesId ?? undefined;
  const emphasizedSeriesId = directReading?.seriesId ?? legendSeriesId ?? activeReading?.seriesId;
  const frameStyle: StatisticalFrameStyles = {
    '--wcl-chart-aspect-ratio': aspectRatio,
    '--wcl-chart-axis-font-size': `${presentation.fontSize / presentation.viewScale}px`,
    '--wcl-chart-grid-width': `${presentation.gridWidth}px`,
    '--wcl-chart-minimum-height': `${minimumSize.height}px`,
    '--wcl-chart-minimum-width': `${presentation.canvasWidth}px`,
    '--wcl-statistical-mark-stroke-width': `${presentation.pointStrokeWidth}px`,
  };
  const hasLocalOverflow =
    overflow === 'scroll' && presentation.canvasWidth > (availableWidth ?? minimumSize.width);
  const clearPointer = (): void => {
    setPointerReadingId(null);
    setPointerPosition(undefined);
  };
  const pointFromPointer = (event: PointerEvent<SVGSVGElement>): InteractionPoint | undefined => {
    const {x, y} = viewBoxPointFromPointer(event.currentTarget, event.clientX, event.clientY);
    if (!inPlot(x, y)) return undefined;
    const hits = points.filter((point) =>
      point.kind === 'point'
        ? containsPointShape(point.shape, point.radius, x - point.x, y - point.y)
        : hitsDistribution(point, x, y, 2 / presentation.viewScale),
    );
    const preferred =
      hits.length > 1 ? hits.find((point) => point.seriesId === legendSeriesId) : undefined;
    return (
      preferred ??
      hits.sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y))[0]
    );
  };
  const readItem = (event: PointerEvent<SVGSVGElement>): void => {
    const point = pointFromPointer(event);
    setKeyboardReadingId(null);
    if (event.pointerType === 'touch') {
      clearPointer();
      setTouchReadingId(point ? readings[point.index]!.id : null);
    } else {
      setTouchReadingId(null);
      setPointerReadingId(point ? readings[point.index]!.id : null);
      setPointerPosition(point ? {x: event.clientX, y: event.clientY} : undefined);
    }
  };
  const beginItem = (event: PointerEvent<SVGSVGElement>): void => {
    if (event.button !== 0 || event.isPrimary === false) return;
    const {x, y} = viewBoxPointFromPointer(event.currentTarget, event.clientX, event.clientY);
    if (!inPlot(x, y)) return;
    readItem(event);
    actions.begin(event, pointFromPointer(event), x, y);
  };
  const moveItem = (event: PointerEvent<SVGSVGElement>): void => {
    const {x, y} = viewBoxPointFromPointer(event.currentTarget, event.clientX, event.clientY);
    if (actions.move(event, x, y, selectablePoints, plot)) return;
    readItem(event);
  };
  const readPointer = (event: PointerEvent<SVGSVGElement>): void => {
    if (event.pointerType === 'touch') return;
    const target =
      event.target instanceof Element ? event.target.closest('[data-reading-index]') : null;
    const index = target ? Number(target.getAttribute('data-reading-index')) : -1;
    const reading = readings[index];
    if (!Number.isInteger(index) || reading === undefined) {
      clearPointer();
      setKeyboardReadingId(null);
      return;
    }
    setKeyboardReadingId(null);
    setPointerReadingId(reading.id);
    setPointerPosition({x: event.clientX, y: event.clientY});
  };
  const readTouch = (event: PointerEvent<SVGSVGElement>): void => {
    if (event.pointerType !== 'touch') return;
    const target =
      event.target instanceof Element ? event.target.closest('[data-reading-index]') : null;
    const index = target ? Number(target.getAttribute('data-reading-index')) : -1;
    const reading = readings[index];
    if (!Number.isInteger(index) || reading === undefined) return;
    clearPointer();
    setKeyboardReadingId(null);
    setTouchReadingId(reading.id);
  };
  const focusChart = (event: FocusEvent<HTMLDivElement>): void => {
    if (
      (!interactive || isFocusVisible) &&
      event.currentTarget === event.target &&
      keyboardReadingId === null &&
      readings.length > 0
    ) {
      setKeyboardReadingId(readings[0]!.id);
    }
  };
  const blurChart = (event: FocusEvent<HTMLDivElement>): void => {
    if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget))
      return;
    setKeyboardReadingId(null);
  };
  const readKeyboard = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Escape') {
      actions.cancel();
      event.preventDefault();
      clearPointer();
      setTouchReadingId(null);
      setKeyboardReadingId(null);
      return;
    }
    if (interactive && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      const point = points[indexForReadingId(keyboardReadingId) ?? activeIndex ?? -1];
      if (point && inPlot(point.x, point.y))
        actions.activate(point.item, 'keyboard', event.ctrlKey || event.metaKey);
      return;
    }
    if (!['Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key))
      return;
    const current = indexForReadingId(keyboardReadingId) ?? activeIndex ?? 0;
    let next = current;
    if (model.kind === 'scatter' || model.kind === 'bubble') {
      if (interactive && event.key === 'Home') next = 0;
      else if (interactive && event.key === 'End') next = readings.length - 1;
      else if (interactive && event.key === 'ArrowLeft') next = Math.max(0, current - 1);
      else if (interactive && event.key === 'ArrowRight')
        next = Math.min(readings.length - 1, current + 1);
      else next = spatialTarget(readings, current, event.key, interactive);
    } else if (model.kind === 'box' && interactive) {
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = readings.length - 1;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = Math.max(0, current - 1);
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
        next = Math.min(readings.length - 1, current + 1);
    } else if (model.kind === 'box') {
      const summaries = readings
        .map((reading, index) => ({index, reading}))
        .filter(({reading}) => reading.kind === 'box');
      const position = Math.max(
        0,
        summaries.findIndex(({index}) => index === current),
      );
      if (event.key === 'Home') next = summaries[0]?.index ?? current;
      if (event.key === 'End') next = summaries.at(-1)?.index ?? current;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowDown')
        next = summaries[Math.max(0, position - 1)]?.index ?? current;
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp')
        next = summaries[Math.min(summaries.length - 1, position + 1)]?.index ?? current;
    } else {
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = readings.length - 1;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = Math.max(0, current - 1);
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp')
        next = Math.min(readings.length - 1, current + 1);
    }
    event.preventDefault();
    clearPointer();
    setTouchReadingId(null);
    const reading = readings[next];
    setKeyboardReadingId(reading?.id ?? null);
    if (
      reading === undefined ||
      frameElement === null ||
      typeof frameElement.scrollTo !== 'function'
    )
      return;
    const maximum = Math.max(0, frameElement.scrollWidth - frameElement.clientWidth);
    if (maximum === 0) return;
    const center = (reading.x / viewWidth) * frameElement.scrollWidth;
    const left = clamp(0, center - frameElement.clientWidth / 2, maximum);
    frameElement.scrollTo({
      left: inheritedDirection(frameElement) === 'rtl' ? left - maximum : left,
    });
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
  } else if (!hasData) {
    content = (
      <EmptyState
        description={
          common.data.length === 0 ? common.emptyState.description : common.invalidData.description
        }
        kind={common.data.length === 0 ? 'no-data' : 'unavailable'}
        title={common.data.length === 0 ? common.emptyState.title : common.invalidData.title}
      />
    );
  } else {
    content = (
      <>
        {status.kind === 'partial' ? <Feedback copy={status} kind="partial" /> : null}
        {model.invalidCount > 0 ? <Feedback copy={common.invalidData} kind="invalid" /> : null}
        {legend === undefined || model.kind === 'histogram' ? null : (
          <StatisticalLegend
            emphasizedSeriesId={emphasizedSeriesId}
            kind={model.kind}
            legend={legend}
            onClear={() => {
              setPinnedLegendSeriesId(null);
              setTransientLegendSeriesId(null);
            }}
            onPin={(seriesId) =>
              setPinnedLegendSeriesId((current) => (current === seriesId ? null : seriesId))
            }
            onTransientChange={setTransientLegendSeriesId}
            pinnedSeriesId={validPinnedSeriesId}
            series={fullModel.kind === 'histogram' ? [] : fullModel.series}
            hiddenIds={hiddenIds}
            visibilityLabels={visibilityLabels}
            firstEye={firstEye}
            onVisibilityChange={(id) => {
              actions.cancel();
              setHiddenSeriesIds((ids) =>
                ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id],
              );
              if (pinnedLegendSeriesId === id) setPinnedLegendSeriesId(null);
              if (transientLegendSeriesId === id) setTransientLegendSeriesId(null);
              setKeyboardReadingId(null);
              setPointerReadingId(null);
              setTouchReadingId(null);
              setPointerPosition(undefined);
            }}
          />
        )}
        {!visibleHasData && visibilityLabels ? (
          <div data-wcl-chart-all-hidden="" role="status">
            <strong>{visibilityLabels.allHidden.title}</strong>
            <p>{visibilityLabels.allHidden.description}</p>
            <button
              type="button"
              data-wcl-chart-show-all=""
              onClick={() => {
                actions.cancel();
                setHiddenSeriesIds([]);
                firstEye.current?.focus();
              }}
            >
              {visibilityLabels.showAll}
            </button>
          </div>
        ) : (
          <>
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
                  interactive
                    ? 'ArrowLeft ArrowRight ArrowUp ArrowDown Home End Escape Enter Space Control+Enter Meta+Enter Control+Space Meta+Space'
                    : 'ArrowLeft ArrowRight ArrowUp ArrowDown Home End Escape'
                }
                aria-describedby={
                  configuration?.selection ? `${descriptionId}-selection-instructions` : undefined
                }
                data-item-interaction={interactive ? '' : undefined}
                aria-labelledby={titleId}
                data-wcl-chart-canvas=""
                onBlur={blurChart}
                onFocus={focusChart}
                onKeyDown={readKeyboard}
                role="group"
                tabIndex={0}
              >
                <svg
                  aria-hidden="true"
                  data-wcl-chart-svg=""
                  focusable="false"
                  data-selection-enabled={configuration?.selection ? '' : undefined}
                  onPointerDown={interactive ? beginItem : readTouch}
                  onPointerUp={
                    interactive ? (event) => actions.end(event, pointFromPointer(event)) : undefined
                  }
                  onPointerCancel={interactive ? () => actions.cancel() : undefined}
                  onLostPointerCapture={interactive ? () => actions.cancel() : undefined}
                  onPointerLeave={clearPointer}
                  onPointerMove={interactive ? moveItem : readPointer}
                  ref={setSvgElement}
                  viewBox={`0 0 ${viewWidth} ${viewHeight}`}
                >
                  {model.kind === 'box' ? (
                    <Axis
                      axis={{
                        formatTick: (value) =>
                          model.series.find((item) => item.id === value)?.label ?? value,
                        label: model.xAxis.label,
                        scale: {
                          domain: model.series.map((item) => item.id),
                          type: 'categorical',
                        },
                      }}
                      placement="x"
                      plot={plot}
                      presentation={presentation}
                      projection={projections.xCategory!}
                    />
                  ) : (
                    <Axis
                      axis={model.xAxis}
                      placement="x"
                      plot={plot}
                      presentation={presentation}
                      projection={projections.xNumber!}
                    />
                  )}
                  <Axis
                    axis={model.yAxis}
                    placement="y"
                    plot={plot}
                    presentation={presentation}
                    projection={projections.y}
                  />
                  <rect
                    data-wcl-chart-hit-region=""
                    height={plotHeight(plot)}
                    width={plotWidth(plot)}
                    x={plot.left}
                    y={plot.top}
                  />
                  <defs>
                    <clipPath id={clipId}>
                      <rect
                        x={plot.left}
                        y={plot.top}
                        width={plotWidth(plot)}
                        height={plotHeight(plot)}
                      />
                    </clipPath>
                    {visibilityLabels ? (
                      <clipPath id={marksClipId}>
                        <rect
                          x={marksBounds.left}
                          y={marksBounds.top}
                          width={marksBounds.right - marksBounds.left}
                          height={marksBounds.bottom - marksBounds.top}
                        />
                      </clipPath>
                    ) : null}
                  </defs>
                  <>
                    <g clipPath={visibilityLabels ? `url(#${marksClipId})` : undefined}>
                      <StatisticalMarks
                        activeIndex={activeIndex}
                        directIndex={directIndex}
                        legendSeriesId={legendSeriesId}
                        model={model}
                        pinnedSeriesId={validPinnedSeriesId}
                        presentation={presentation}
                        projections={projections}
                        readings={readings}
                      />
                    </g>
                    {interactive ? (
                      <g
                        clipPath={`url(#${clipId})`}
                        data-wcl-chart-interaction-overlay=""
                        pointerEvents="none"
                      >
                        {points.map((point) => (
                          <g key={point.item.rowId}>
                            {selectedKeys.has(selectionKey(point.item)) ? (
                              point.kind === 'bin' || point.kind === 'summary' ? (
                                <DistributionCue
                                  point={point}
                                  points={points}
                                  cue="selection"
                                  scale={presentation.viewScale}
                                />
                              ) : (
                                <PointShape
                                  cx={point.x}
                                  cy={point.y}
                                  radius={
                                    point.radius +
                                    (point.shape % 6 === 0
                                      ? (presentation.pointStrokeWidth *
                                          (activeIndex === point.index ? 1.6 : 1)) /
                                          2 +
                                        1
                                      : 2) /
                                      presentation.viewScale
                                  }
                                  shape={point.shape}
                                  cue="selection"
                                />
                              )
                            ) : null}
                            {activeIndex === point.index ? (
                              point.kind === 'bin' || point.kind === 'summary' ? (
                                <DistributionCue
                                  point={point}
                                  points={points}
                                  cue="reading"
                                  scale={presentation.viewScale}
                                />
                              ) : (
                                <>
                                  {model.kind === 'bubble' ? (
                                    <PointShape
                                      cx={point.x}
                                      cy={point.y}
                                      radius={Math.max(
                                        0,
                                        point.radius - 2 / presentation.viewScale,
                                      )}
                                      shape={point.shape}
                                      cue="reading"
                                    />
                                  ) : null}
                                  <PointShape
                                    cx={point.x}
                                    cy={point.y}
                                    radius={Math.max(
                                      1 / presentation.viewScale,
                                      Math.min(
                                        point.radius - 1 / presentation.viewScale,
                                        3.5 / presentation.viewScale,
                                      ),
                                    )}
                                    shape={point.shape}
                                    cue="center"
                                  />
                                </>
                              )
                            ) : null}
                            {actions.pulse &&
                            selectionKey(actions.pulse.item) === selectionKey(point.item) ? (
                              <g key={actions.pulse.sequence} data-wcl-point-activation="">
                                <ChartActivationOutline
                                  outset={
                                    point.kind === 'bin' || point.kind === 'summary'
                                      ? 0
                                      : chartActivationOutset
                                  }
                                >
                                  {point.kind === 'bin' || point.kind === 'summary' ? (
                                    <DistributionCue
                                      point={point}
                                      points={points}
                                      cue="activation"
                                      scale={presentation.viewScale}
                                    />
                                  ) : (
                                    <PointShape
                                      cx={point.x}
                                      cy={point.y}
                                      radius={point.radius}
                                      shape={point.shape}
                                      cue="activation"
                                    />
                                  )}
                                </ChartActivationOutline>
                              </g>
                            ) : null}
                          </g>
                        ))}
                        {actions.box ? (
                          <rect {...actions.box} data-wcl-chart-selection-box="" />
                        ) : null}
                      </g>
                    ) : null}
                  </>
                </svg>
                {activeReading === undefined ? null : (
                  <StatisticalTooltip
                    activeSeriesId={emphasizedSeriesId}
                    {...(pointerPosition === undefined ? {} : {pointer: pointerPosition})}
                    portalTarget={rootElement?.closest('[data-wcl-provider]') ?? document.body}
                    reading={activeReading}
                    svg={svgElement}
                  />
                )}
              </div>
            </div>
            <div aria-atomic="true" aria-live="polite" data-wcl-chart-reading-announcement="">
              {activeReading === undefined
                ? ''
                : [
                    activeReading.label,
                    ...activeReading.rows.map((row) => `${row.label}: ${row.value}`),
                  ].join('. ')}
            </div>
          </>
        )}
        <StatisticalTable
          dataTableLabel={common.dataTableLabel}
          model={fullModel}
          hiddenIds={hiddenIds}
          hiddenLabel={visibilityLabels?.hidden}
        />
      </>
    );
  }
  return (
    <figure
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      data-wcl-chart=""
      ref={setRootElement}
      {...{[rootAttribute]: ''}}
    >
      <figcaption data-wcl-chart-caption="">
        <strong id={titleId}>{common.title}</strong>
        <p id={descriptionId}>{common.description}</p>
      </figcaption>
      {content}
      {configuration?.selection ? (
        <div data-wcl-chart-selection="">
          <p id={`${descriptionId}-selection-instructions`}>
            {configuration.selection.labels.instructions}
          </p>
          <div aria-live="polite" aria-atomic="true">
            <span>
              {actions.selected.length
                ? configuration.selection.labels.summary(actions.selected.length)
                : configuration.selection.labels.empty}
            </span>
            {actions.selected.length ? (
              <ul>
                {actions.selected.map((item) => (
                  <li key={selectionKey(item)}>
                    {(() => {
                      const label = configuration.selection!.labels.item(item);
                      const seriesId =
                        item.seriesId ||
                        allReadings.find((reading) => reading.id === item.rowId)?.seriesId;
                      return seriesId && hiddenIds.includes(seriesId)
                        ? configuration.selection!.labels.hidden(label)
                        : label;
                    })()}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {actions.selected.length ? (
            <button
              type="button"
              data-wcl-chart-clear-selection=""
              onClick={() => {
                actions.cancel();
                actions.change([]);
                rootElement?.querySelector<HTMLElement>('[data-wcl-chart-canvas]')?.focus();
              }}
            >
              {configuration.selection.labels.clear}
            </button>
          ) : null}
        </div>
      ) : null}
    </figure>
  );
}

function statisticalModelGeometry<Datum extends object>(model: StatisticalModel<Datum>): unknown {
  if (model.kind === 'scatter' || model.kind === 'bubble') {
    return {
      kind: model.kind,
      points: model.points.map((point) => [
        point.id,
        point.series.id,
        point.x,
        point.y,
        point.magnitude,
      ]),
      series: model.series.map((series) => series.id),
    };
  }
  if (model.kind === 'histogram') {
    return {
      bins: model.bins.map((bin) => [bin.lower, bin.upper, bin.value]),
      kind: model.kind,
    };
  }
  return {
    boxes: model.boxes.map((box) => [
      box.series.id,
      box.lowerWhisker,
      box.q1,
      box.median,
      box.q3,
      box.upperWhisker,
      box.outliers,
      box.outlierIds,
    ]),
    kind: model.kind,
    series: model.series.map((series) => series.id),
  };
}

export function ScatterChart<Datum extends object>(props: ScatterChartProps<Datum>): ReactElement {
  const model = preparePoints(props, 'scatter');
  return (
    <StatisticalFrame
      common={props}
      {...(props.interaction === undefined ? {} : {interaction: props.interaction})}
      {...(props.legend === undefined ? {} : {legend: props.legend})}
      model={model}
      rootAttribute="data-wcl-scatter-chart"
    />
  );
}

export function BubbleChart<Datum extends object>(props: BubbleChartProps<Datum>): ReactElement {
  assertText(props.magnitude.label, 'Bubble magnitude label');
  const model = preparePoints(props, 'bubble');
  return (
    <StatisticalFrame
      common={props}
      {...(props.interaction === undefined ? {} : {interaction: props.interaction})}
      {...(props.legend === undefined ? {} : {legend: props.legend})}
      model={model}
      rootAttribute="data-wcl-bubble-chart"
    />
  );
}

export function Histogram<Datum extends object>(props: HistogramProps<Datum>): ReactElement {
  assertText(props.xAxis.label, 'Histogram X-axis label');
  assertText(props.yAxis.label, 'Histogram Y-axis label');
  const model = prepareHistogram(props);
  const distribution = props.interaction
    ? distributionSetup(
        model.bins.map((bin) => ({
          item: {
            kind: 'bin' as const,
            lower: bin.lower,
            upper: bin.upper,
            upperInclusive: bin.final,
          },
          activate: (input: 'pointer' | 'keyboard' | 'touch') =>
            props.interaction?.onActivate?.({
              item: {kind: 'bin', lower: bin.lower, upper: bin.upper, upperInclusive: bin.final},
              value: bin.value,
              ordinate: bin.ordinate,
              source: bin.source,
              input,
            }),
        })),
        props.interaction.selection,
        !!props.interaction.onActivate,
      )
    : undefined;
  return (
    <StatisticalFrame
      common={props}
      model={model}
      {...(distribution ? {distribution} : {})}
      rootAttribute="data-wcl-histogram"
    />
  );
}

export function BoxPlot<Datum extends object>(props: BoxPlotProps<Datum>): ReactElement {
  assertText(props.xAxis.label, 'Box-plot X-axis label');
  assertText(props.yAxis.label, 'Box-plot Y-axis label');
  const model = prepareBoxes(props);
  const distribution = props.interaction
    ? distributionSetup<BoxPlotSelectionItem>(
        model.boxes.flatMap((box) => {
          const item: BoxPlotSelectionItem = {kind: 'summary', groupId: box.series.id};
          return [
            {
              item,
              activate: (input: 'pointer' | 'keyboard' | 'touch') =>
                props.interaction?.onActivate?.({
                  kind: 'summary',
                  item,
                  summary: {
                    lowerWhisker: box.lowerWhisker,
                    q1: box.q1,
                    median: box.median,
                    q3: box.q3,
                    upperWhisker: box.upperWhisker,
                    whisker: box.whisker,
                    outliers: box.outliers,
                  },
                  source: box.source,
                  input,
                }),
            },
            ...box.outlierContexts.map((context, index) => {
              const item: Extract<BoxPlotSelectionItem, {kind: 'outlier'}> = {
                kind: 'outlier',
                groupId: box.series.id,
                outlierId: box.outlierIds![index]!,
              };
              return {
                item,
                activate: (input: 'pointer' | 'keyboard' | 'touch') =>
                  props.interaction?.onActivate?.({
                    kind: 'outlier',
                    item,
                    value: context.value,
                    source:
                      context.kind === 'raw'
                        ? {kind: 'raw', datum: context.datum}
                        : {
                            kind: 'summary',
                            datum: context.datum,
                            outlierIndex: context.outlierIndex,
                          },
                    input,
                  }),
              };
            }),
          ];
        }),
        props.interaction.selection,
        !!props.interaction.onActivate,
      )
    : undefined;
  return (
    <StatisticalFrame
      common={props}
      {...(props.legend === undefined ? {} : {legend: props.legend})}
      model={model}
      {...(distribution ? {distribution} : {})}
      rootAttribute="data-wcl-box-plot"
    />
  );
}
