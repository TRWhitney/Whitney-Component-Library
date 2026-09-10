import type {ChartRectangularExploration} from './chart-rectangular-exploration-types.js';

export type ChartDomainValue = string | number | Date;
type Present<Value> = Exclude<Value, null | undefined>;
type KeysMatching<Datum, Value> = {
  [Key in keyof Datum]-?: Present<Datum[Key]> extends Value ? Key : never;
}[keyof Datum] &
  string;

export type ChartAccessor<Datum extends object, Value> =
  KeysMatching<Datum, Value> | ((datum: Datum, index: number) => Value | null | undefined);

export type ChartColor =
  | 'accent'
  | 'series-2'
  | 'series-3'
  | 'series-4'
  | 'series-5'
  | 'series-6'
  | 'success'
  | 'warning'
  | 'danger';
export type ChartTone = 'accent' | 'neutral' | 'success' | 'warning' | 'danger';
export type ChartOverflow = 'clip' | 'scroll';
export type ChartStacking = 'overlap' | 'stacked' | 'normalized';
export type ChartBarLayout = 'grouped' | 'stacked' | 'normalized';

export interface CategoricalChartScale<Value extends ChartDomainValue> {
  readonly domain?: readonly Value[];
  readonly type: 'categorical';
}

export interface LinearChartScale {
  readonly domain?: readonly [number, number];
  readonly type: 'linear';
}

export interface LogarithmicChartScale {
  readonly base?: number;
  readonly domain?: readonly [number, number];
  readonly type: 'logarithmic';
}

export interface TimeChartScale {
  readonly domain?: readonly [Date, Date];
  readonly type: 'time';
}

export interface NormalizedChartScale {
  readonly type: 'normalized';
}

export type ChartScale<Value extends ChartDomainValue> =
  | CategoricalChartScale<Value>
  | (Value extends number ? LinearChartScale | LogarithmicChartScale | NormalizedChartScale : never)
  | (Value extends Date ? TimeChartScale : never);

interface ChartAxisPresentation<
  Value extends ChartDomainValue,
  Scale extends ChartScale<Value> = ChartScale<Value>,
> {
  readonly formatTick?: (value: Value) => string;
  readonly label: string;
  readonly scale: Scale;
  readonly showGrid?: boolean;
  readonly tickCount?: number;
  readonly unit?: string;
}

export type ChartDataAxis<
  Datum extends object,
  Value extends ChartDomainValue,
> = ChartAxisPresentation<Value, Exclude<ChartScale<Value>, NormalizedChartScale>> & {
  readonly accessor: ChartAccessor<Datum, Value>;
};

type NumericValueScale = LinearChartScale | LogarithmicChartScale | NormalizedChartScale;
export type ChartValueAxis<Scale extends NumericValueScale = NumericValueScale> =
  ChartAxisPresentation<number, Scale>;

interface ChartSeriesBase<Datum extends object> {
  readonly accessor: ChartAccessor<Datum, number>;
  readonly color?: ChartColor;
  readonly id: string;
  readonly label: string;
}

export interface ChartLineSeries<Datum extends object> extends ChartSeriesBase<Datum> {
  readonly curve?: 'linear' | 'step';
  readonly showPoints?: boolean;
}

export type ChartAreaSeries<Datum extends object> = ChartSeriesBase<Datum>;
export type ChartBarSeries<Datum extends object> = ChartSeriesBase<Datum>;

export type CartesianChartSeries<Datum extends object> = ChartSeriesBase<Datum> &
  (
    | {readonly curve?: 'linear' | 'step'; readonly kind: 'line'; readonly showPoints?: boolean}
    | {readonly kind: 'area'}
    | {readonly kind: 'column'}
  );

/** The bounded series vocabulary supplies six distinct colors and line patterns. */
export type NonEmptyChartSeries<Series> =
  | readonly [Series]
  | readonly [Series, Series]
  | readonly [Series, Series, Series]
  | readonly [Series, Series, Series, Series]
  | readonly [Series, Series, Series, Series, Series]
  | readonly [Series, Series, Series, Series, Series, Series];

export type ChartAnnotation<XValue extends ChartDomainValue, YValue extends ChartDomainValue> =
  | {
      readonly axis: 'x';
      readonly kind: 'line';
      readonly label: string;
      readonly tone?: ChartTone;
      readonly value: XValue;
    }
  | {
      readonly axis: 'y';
      readonly kind: 'line';
      readonly label: string;
      readonly tone?: ChartTone;
      readonly value: YValue;
    }
  | {
      readonly axis: 'x';
      readonly from: XValue;
      readonly kind: 'band';
      readonly label: string;
      readonly to: XValue;
      readonly tone?: ChartTone;
    }
  | {
      readonly axis: 'y';
      readonly from: YValue;
      readonly kind: 'band';
      readonly label: string;
      readonly to: YValue;
      readonly tone?: ChartTone;
    }
  | {
      readonly kind: 'point';
      readonly label: string;
      readonly tone?: ChartTone;
      readonly x: XValue;
      readonly y: YValue;
    };

export interface ChartLegend {
  readonly label: string;
}

export interface ChartStateCopy {
  readonly description: string;
  readonly title: string;
}

export interface ChartVisibilityLabels {
  readonly allHidden: ChartStateCopy;
  readonly hidden: string;
  readonly hideSeries: (seriesLabel: string) => string;
  readonly showAll: string;
  readonly showSeries: (seriesLabel: string) => string;
}

export type ChartStatus =
  | {readonly kind: 'ready'}
  | {readonly kind: 'loading'; readonly label: string}
  | ({readonly kind: 'partial'} & ChartStateCopy)
  | ({readonly kind: 'error'} & ChartStateCopy);

export interface ChartMinimumSize {
  readonly height: number;
  readonly width: number;
}

export type PartToWholeAggregateSizing = 'proportional' | 'smallest';

export interface PartToWholeChartValue<Datum extends object> {
  readonly accessor: ChartAccessor<Datum, number>;
  readonly formatValue?: (value: number) => string;
  readonly label: string;
  readonly unit?: string;
}

export interface PartToWholeChartRange {
  readonly end: number;
  readonly start: number;
  readonly total: number;
}

export interface PartToWholeChartLabels {
  readonly back: string;
  readonly category: string;
  readonly categoryRange: (range: PartToWholeChartRange) => string;
  readonly moreCategories: (count: number) => string;
  readonly shareOfTotal: string;
  readonly shareOnPage: string;
}

export interface PartToWholeSelectionItem {
  readonly id: string;
}
export interface PartToWholeActivation<Datum extends object> {
  readonly item: PartToWholeSelectionItem;
  readonly datum: Datum;
  readonly label: string;
  readonly value: number;
  readonly total: number;
  readonly shareOfTotal: number;
  readonly shareOnPage: number;
  readonly input: 'pointer' | 'keyboard' | 'touch';
}
export interface PartToWholeInteraction<Datum extends object> {
  readonly onActivate?: (activation: PartToWholeActivation<Datum>) => void;
  readonly selection?: ChartSelection<PartToWholeSelectionItem> & {
    readonly containsSelection: string;
  };
}
interface PartToWholeChartCommonProps<Datum extends object> {
  readonly visibilityLabels?: ChartVisibilityLabels;
  readonly interaction?: PartToWholeInteraction<Datum>;
  readonly aggregateSizing?: PartToWholeAggregateSizing;
  readonly aspectRatio?: number;
  readonly data: readonly Datum[];
  readonly dataTableLabel: string;
  readonly description: string;
  readonly emptyState: ChartStateCopy;
  readonly idAccessor: ChartAccessor<Datum, string>;
  readonly invalidData: ChartStateCopy;
  readonly labelAccessor: ChartAccessor<Datum, string>;
  readonly labels: PartToWholeChartLabels;
  readonly legend: ChartLegend;
  readonly minimumSize?: ChartMinimumSize;
  readonly status?: ChartStatus;
  readonly title: string;
  readonly value: PartToWholeChartValue<Datum>;
}

export type PieChartProps<Datum extends object> = PartToWholeChartCommonProps<Datum>;

export interface DonutChartProps<Datum extends object> extends PartToWholeChartCommonProps<Datum> {
  readonly totalLabel: string;
}

export interface RadarChartDimension<Datum extends object> {
  readonly accessor: ChartAccessor<Datum, number>;
  readonly id: string;
  readonly label: string;
}

export type RadarChartDimensions<Datum extends object> = readonly [
  RadarChartDimension<Datum>,
  RadarChartDimension<Datum>,
  RadarChartDimension<Datum>,
  ...RadarChartDimension<Datum>[],
];

export interface RadarChartValue {
  readonly formatValue?: (value: number) => string;
  readonly label: string;
  readonly unit?: string;
}

export interface RadarChartLabels {
  readonly dimension: string;
}

export interface RadarSelectionItem {
  readonly dimensionId: string;
  readonly seriesId?: string;
}

export interface RadarActivation<Datum extends object> {
  readonly item: RadarSelectionItem;
  readonly dimension: {readonly id: string; readonly label: string};
  readonly input: 'pointer' | 'keyboard' | 'touch';
  readonly values: readonly {
    readonly seriesId: string;
    readonly label: string;
    readonly value: number;
    readonly datum: Datum;
  }[];
}

export interface RadarInteraction<Datum extends object> {
  readonly target: 'point' | 'dimension';
  readonly selection?: ChartSelection<RadarSelectionItem>;
  readonly onActivate?: (activation: RadarActivation<Datum>) => void;
}

export interface RadarChartProps<Datum extends object> {
  readonly visibilityLabels?: ChartVisibilityLabels;
  readonly interaction?: RadarInteraction<Datum>;
  readonly aspectRatio?: number;
  readonly colorAccessor?: ChartAccessor<Datum, ChartColor>;
  readonly data: NonEmptyChartSeries<Datum>;
  readonly dataTableLabel: string;
  readonly description: string;
  readonly dimensions: RadarChartDimensions<Datum>;
  readonly emptyState: ChartStateCopy;
  readonly idAccessor: ChartAccessor<Datum, string>;
  readonly invalidData: ChartStateCopy;
  readonly labelAccessor: ChartAccessor<Datum, string>;
  readonly labels: RadarChartLabels;
  readonly legend: ChartLegend;
  readonly minimumSize?: ChartMinimumSize;
  readonly overflow?: ChartOverflow;
  readonly status?: ChartStatus;
  readonly title: string;
  readonly value: RadarChartValue;
}

export interface HeatmapDomainItem {
  readonly id: string;
  readonly label: string;
}

export type HeatmapScale =
  | {
      readonly color: string;
      readonly domain?: readonly [number, number];
      readonly type: 'sequential';
    }
  | {
      readonly colors: readonly [low: string, high: string];
      readonly domain?: readonly [number, number];
      readonly midpoint: number;
      readonly type: 'two-sided';
    };

export interface HeatmapValue<Datum extends object> {
  readonly accessor: ChartAccessor<Datum, number>;
  readonly formatValue?: (value: number) => string;
  readonly label: string;
  readonly unit?: string;
}

export interface HeatmapLabels {
  readonly colorKey: string;
  readonly column: string;
  readonly missing: string;
  readonly row: string;
  readonly scrollRegion: string;
}

export interface HeatmapVisibilityLabels {
  readonly hideRow: (label: string) => string;
  readonly showRow: (label: string) => string;
  readonly hideColumn: (label: string) => string;
  readonly showColumn: (label: string) => string;
  readonly restore: (count: number) => string;
  readonly hiddenRows: string;
  readonly hiddenColumns: string;
  readonly hidden: string;
  readonly showAll: string;
  readonly close: string;
  readonly allHidden: ChartStateCopy;
}

export interface HeatmapSelectionItem {
  readonly rowId: string;
  readonly columnId: string;
}

export interface HeatmapActivation<Datum extends object> {
  readonly item: HeatmapSelectionItem;
  readonly row: HeatmapDomainItem;
  readonly column: HeatmapDomainItem;
  readonly value: number | undefined;
  readonly datum: Datum | undefined;
  readonly input: 'pointer' | 'keyboard' | 'touch';
}

export interface HeatmapInteraction<Datum extends object> {
  readonly selection?: ChartSelection<HeatmapSelectionItem>;
  readonly onActivate?: (activation: HeatmapActivation<Datum>) => void;
}

export interface HeatmapProps<Datum extends object> {
  readonly visibilityLabels?: HeatmapVisibilityLabels;
  readonly interaction?: HeatmapInteraction<Datum>;
  readonly aspectRatio?: number;
  readonly columnAccessor: ChartAccessor<Datum, string>;
  readonly columns: readonly HeatmapDomainItem[];
  readonly data: readonly Datum[];
  readonly dataTableLabel: string;
  readonly description: string;
  readonly emptyState: ChartStateCopy;
  readonly invalidData: ChartStateCopy;
  readonly labels: HeatmapLabels;
  readonly minimumSize?: ChartMinimumSize;
  readonly rowAccessor: ChartAccessor<Datum, string>;
  readonly rows: readonly HeatmapDomainItem[];
  readonly scale: HeatmapScale;
  readonly status?: ChartStatus;
  readonly title: string;
  readonly value: HeatmapValue<Datum>;
}

export type SparklinePositionScale<Value extends ChartDomainValue> = Exclude<
  ChartScale<Value>,
  NormalizedChartScale
>;

export interface SparklinePosition<Datum extends object, Value extends ChartDomainValue> {
  readonly accessor: ChartAccessor<Datum, Value>;
  readonly formatValue?: (value: Value) => string;
  readonly label: string;
  readonly scale: SparklinePositionScale<Value>;
  readonly unit?: string;
}

export interface SparklineValue<Datum extends object> {
  readonly accessor: ChartAccessor<Datum, number>;
  readonly formatValue?: (value: number) => string;
  readonly label: string;
  readonly unit?: string;
}

export interface SparklineLabels {
  readonly first: string;
  readonly highest: string;
  readonly last: string;
  readonly lowest: string;
  readonly missing: string;
}

export interface SparklineSelectionItem {
  readonly rowId: string;
}

export interface SparklineActivation<Datum extends object, Position extends ChartDomainValue> {
  readonly item: SparklineSelectionItem;
  readonly datum: Datum;
  readonly position: Position;
  readonly value: number;
  readonly input: 'pointer' | 'keyboard' | 'touch';
}

export interface SparklineInteraction<Datum extends object, Position extends ChartDomainValue> {
  readonly getRowId: (datum: Datum) => string;
  readonly selection?: ChartSelection<SparklineSelectionItem>;
  readonly onActivate?: (activation: SparklineActivation<Datum, Position>) => void;
}

export interface SparklineProps<Datum extends object, Position extends ChartDomainValue> {
  readonly interaction?: SparklineInteraction<Datum, Position>;
  readonly aspectRatio?: number;
  readonly data: readonly Datum[];
  readonly dataTableLabel: string;
  readonly description: string;
  readonly emptyState: ChartStateCopy;
  readonly invalidData: ChartStateCopy;
  readonly labels: SparklineLabels;
  readonly minimumSize?: ChartMinimumSize;
  readonly position: SparklinePosition<Datum, Position>;
  readonly status?: ChartStatus;
  readonly title: string;
  readonly value: SparklineValue<Datum>;
  readonly valueRange?: readonly [number, number];
}

interface ChartCommonProps<Datum extends object> {
  readonly visibilityLabels?: ChartVisibilityLabels;
  readonly aspectRatio?: number;
  readonly data: readonly Datum[];
  readonly dataTableLabel: string;
  readonly description: string;
  readonly emptyState: ChartStateCopy;
  readonly invalidData: ChartStateCopy;
  readonly legend?: ChartLegend;
  readonly minimumSize?: ChartMinimumSize;
  readonly overflow?: ChartOverflow;
  readonly status?: ChartStatus;
  readonly title: string;
}

export interface ChartSelectionItem {
  readonly rowId: string;
  readonly seriesId?: string;
}

export interface ChartActivation<Datum extends object, Category extends ChartDomainValue> {
  readonly item: ChartSelectionItem;
  readonly category: Category;
  readonly datum: Datum;
  readonly input: 'pointer' | 'keyboard' | 'touch';
  readonly values: readonly {
    readonly seriesId: string;
    readonly label: string;
    readonly value: number;
    readonly hidden: boolean;
  }[];
}

export interface ChartSelectionLabels<Item = ChartSelectionItem> {
  readonly instructions: string;
  readonly clear: string;
  readonly empty: string;
  readonly summary: (count: number) => string;
  readonly item: (item: Item) => string;
  readonly hidden: (label: string) => string;
}

export type ChartSelection<Item = ChartSelectionItem> = {
  readonly labels: ChartSelectionLabels<Item>;
} & (
  | {
      readonly selectedItems: readonly Item[];
      readonly defaultSelectedItems?: never;
      readonly onSelectionChange: (items: readonly Item[]) => void;
    }
  | {
      readonly selectedItems?: never;
      readonly defaultSelectedItems?: readonly Item[];
      readonly onSelectionChange?: (items: readonly Item[]) => void;
    }
);

export interface ChartInteraction<Datum extends object, Category extends ChartDomainValue> {
  readonly target: 'category' | 'point';
  readonly getRowId: (datum: Datum) => string;
  readonly onActivate?: (activation: ChartActivation<Datum, Category>) => void;
  readonly selection?: ChartSelection;
}

export type LineChartInteraction<
  Datum extends object,
  Category extends ChartDomainValue,
> = ChartInteraction<Datum, Category>;

/** A visible interval in the original axis units. Date intervals contain Dates. */
export type ChartDomainWindow<Value extends ChartDomainValue> = readonly [Value, Value];
export interface ChartExplorationLabels<Value extends ChartDomainValue> {
  readonly overview: string;
  readonly closeOverview: string;
  readonly done: string;
  readonly reset: string;
  readonly zoomIn: string;
  readonly zoomOut: string;
  readonly panBackward: string;
  readonly panForward: string;
  readonly window: string;
  readonly start: string;
  readonly end: string;
  readonly instructions: string;
  readonly range: (window: ChartDomainWindow<Value>) => string;
}
export type ChartExploration<Value extends ChartDomainValue> = {
  readonly labels: ChartExplorationLabels<Value>;
  /** Smallest span as a fraction of the full axis, from greater than zero through one. */
  readonly minimumSpan?: number;
  readonly onWindowChangeEnd?: (window: ChartDomainWindow<NoInfer<Value>>) => void;
} & (
  | {
      readonly window: ChartDomainWindow<NoInfer<Value>>;
      readonly defaultWindow?: never;
      readonly onWindowChange: (window: ChartDomainWindow<NoInfer<Value>>) => void;
    }
  | {
      readonly window?: never;
      readonly defaultWindow?: ChartDomainWindow<NoInfer<Value>>;
      readonly onWindowChange?: (window: ChartDomainWindow<NoInfer<Value>>) => void;
    }
);

export interface LineChartProps<
  Datum extends object,
  XValue extends ChartDomainValue,
> extends ChartCommonProps<Datum> {
  readonly exploration?: ChartExploration<XValue>;
  readonly interaction?: LineChartInteraction<Datum, XValue>;
  readonly annotations?: readonly ChartAnnotation<NoInfer<XValue>, number>[];
  readonly series: NonEmptyChartSeries<ChartLineSeries<Datum>>;
  readonly xAxis: ChartDataAxis<Datum, XValue>;
  readonly yAxis: ChartValueAxis<LinearChartScale | LogarithmicChartScale>;
}

type AreaChartSharedProps<
  Datum extends object,
  XValue extends ChartDomainValue,
> = ChartCommonProps<Datum> & {
  readonly exploration?: ChartExploration<XValue>;
  readonly interaction?: ChartInteraction<Datum, XValue>;
  readonly annotations?: readonly ChartAnnotation<NoInfer<XValue>, number>[];
  readonly series: NonEmptyChartSeries<ChartAreaSeries<Datum>>;
  readonly xAxis: ChartDataAxis<Datum, XValue>;
};

export type AreaChartProps<
  Datum extends object,
  XValue extends ChartDomainValue,
> = AreaChartSharedProps<Datum, XValue> &
  (
    | {
        readonly stacking?: Exclude<ChartStacking, 'normalized'>;
        readonly yAxis: ChartValueAxis<LinearChartScale>;
      }
    | {
        readonly stacking: 'normalized';
        readonly yAxis: ChartValueAxis<NormalizedChartScale>;
      }
  );

type ColumnChartSharedProps<
  Datum extends object,
  XValue extends ChartDomainValue,
> = ChartCommonProps<Datum> & {
  readonly exploration?: ChartExploration<XValue>;
  readonly interaction?: ChartInteraction<Datum, XValue>;
  readonly annotations?: readonly ChartAnnotation<NoInfer<XValue>, number>[];
  readonly series: NonEmptyChartSeries<ChartBarSeries<Datum>>;
  readonly xAxis: ChartDataAxis<Datum, XValue>;
};

export type ColumnChartProps<
  Datum extends object,
  XValue extends ChartDomainValue,
> = ColumnChartSharedProps<Datum, XValue> &
  (
    | {
        readonly layout?: Exclude<ChartBarLayout, 'normalized'>;
        readonly yAxis: ChartValueAxis<LinearChartScale>;
      }
    | {
        readonly layout: 'normalized';
        readonly yAxis: ChartValueAxis<NormalizedChartScale>;
      }
  );

type BarChartSharedProps<
  Datum extends object,
  YValue extends ChartDomainValue,
> = ChartCommonProps<Datum> & {
  readonly exploration?: ChartExploration<YValue>;
  readonly interaction?: ChartInteraction<Datum, YValue>;
  readonly annotations?: readonly ChartAnnotation<number, NoInfer<YValue>>[];
  readonly series: NonEmptyChartSeries<ChartBarSeries<Datum>>;
  readonly yAxis: ChartDataAxis<Datum, YValue>;
};

export type BarChartProps<
  Datum extends object,
  YValue extends ChartDomainValue,
> = BarChartSharedProps<Datum, YValue> &
  (
    | {
        readonly layout?: Exclude<ChartBarLayout, 'normalized'>;
        readonly xAxis: ChartValueAxis<LinearChartScale>;
      }
    | {
        readonly layout: 'normalized';
        readonly xAxis: ChartValueAxis<NormalizedChartScale>;
      }
  );

export interface CartesianChartProps<
  Datum extends object,
  XValue extends ChartDomainValue,
> extends ChartCommonProps<Datum> {
  readonly exploration?: ChartExploration<XValue>;
  readonly interaction?: ChartInteraction<Datum, XValue>;
  readonly annotations?: readonly ChartAnnotation<NoInfer<XValue>, number>[];
  readonly series: NonEmptyChartSeries<CartesianChartSeries<Datum>>;
  readonly xAxis: ChartDataAxis<Datum, XValue>;
  readonly yAxis: ChartValueAxis<LinearChartScale>;
}

interface StatisticalChartCommonProps<Datum extends object> {
  readonly aspectRatio?: number;
  readonly data: readonly Datum[];
  readonly dataTableLabel: string;
  readonly description: string;
  readonly emptyState: ChartStateCopy;
  readonly invalidData: ChartStateCopy;
  readonly minimumSize?: ChartMinimumSize;
  readonly overflow?: ChartOverflow;
  readonly status?: ChartStatus;
  readonly title: string;
}

export type QuantitativeChartDataAxis<Datum extends object> = Omit<
  ChartDataAxis<Datum, number>,
  'scale'
> & {
  readonly scale: LinearChartScale | LogarithmicChartScale;
};

export interface StatisticalChartSeries {
  readonly color?: ChartColor;
  readonly id: string;
  readonly label: string;
}

export interface PointChartActivation<Datum extends object> {
  readonly item: ChartSelectionItem;
  readonly datum: Datum;
  readonly label: string;
  readonly x: number;
  readonly y: number;
  readonly magnitude?: number;
  readonly input: 'pointer' | 'keyboard' | 'touch';
}

export interface PointChartInteraction<Datum extends object> {
  readonly onActivate?: (activation: PointChartActivation<Datum>) => void;
  readonly selection?: ChartSelection;
}

interface PointChartProps<Datum extends object> extends StatisticalChartCommonProps<Datum> {
  readonly exploration?: ChartRectangularExploration<number, number>;
  readonly visibilityLabels?: ChartVisibilityLabels;
  readonly interaction?: PointChartInteraction<Datum>;
  readonly idAccessor: ChartAccessor<Datum, string>;
  readonly labelAccessor: ChartAccessor<Datum, string>;
  readonly legend?: ChartLegend;
  readonly series: NonEmptyChartSeries<StatisticalChartSeries>;
  readonly seriesAccessor?: ChartAccessor<Datum, string>;
  readonly xAxis: QuantitativeChartDataAxis<Datum>;
  readonly yAxis: QuantitativeChartDataAxis<Datum>;
}

export type ScatterChartProps<Datum extends object> = PointChartProps<Datum>;

export interface BubbleMagnitude<Datum extends object> {
  readonly accessor: ChartAccessor<Datum, number>;
  readonly formatValue?: (value: number) => string;
  readonly label: string;
  readonly unit?: string;
}

export interface BubbleChartProps<Datum extends object> extends PointChartProps<Datum> {
  readonly magnitude: BubbleMagnitude<Datum>;
}

export type HistogramOrdinate = 'count' | 'density' | 'proportion';

export type HistogramDistribution<Datum extends object> =
  | {
      readonly accessor: ChartAccessor<Datum, number>;
      readonly kind: 'raw';
      readonly thresholds?: number | readonly number[];
    }
  | {
      readonly kind: 'binned';
      readonly lowerAccessor: ChartAccessor<Datum, number>;
      readonly ordinate: HistogramOrdinate;
      readonly ordinateAccessor: ChartAccessor<Datum, number>;
      readonly upperAccessor: ChartAccessor<Datum, number>;
    };

export interface HistogramSelectionItem {
  readonly kind: 'bin';
  readonly lower: number;
  readonly upper: number;
  readonly upperInclusive: boolean;
}
export interface HistogramActivation<Datum extends object> {
  readonly item: HistogramSelectionItem;
  readonly value: number;
  readonly ordinate: HistogramOrdinate;
  readonly source:
    | {readonly kind: 'raw'; readonly data: readonly Datum[]}
    | {readonly kind: 'binned'; readonly datum: Datum};
  readonly input: 'pointer' | 'keyboard' | 'touch';
}
export interface HistogramInteraction<Datum extends object> {
  readonly onActivate?: (activation: HistogramActivation<Datum>) => void;
  readonly selection?: ChartSelection<HistogramSelectionItem>;
}
export type BoxPlotSelectionItem =
  | {readonly kind: 'summary'; readonly groupId: string}
  | {readonly kind: 'outlier'; readonly groupId: string; readonly outlierId: string};
export type BoxPlotOutlierContext<Datum extends object> = {
  readonly groupId: string;
  readonly value: number;
} & (
  | {readonly kind: 'raw'; readonly datum: Datum}
  | {readonly kind: 'summary'; readonly datum: Datum; readonly outlierIndex: number}
);
export interface BoxPlotSummary {
  readonly lowerWhisker: number;
  readonly q1: number;
  readonly median: number;
  readonly q3: number;
  readonly upperWhisker: number;
  readonly whisker: BoxWhisker;
  readonly outliers: readonly number[];
}
export type BoxPlotActivation<Datum extends object> = {
  readonly input: 'pointer' | 'keyboard' | 'touch';
} & (
  | {
      readonly kind: 'summary';
      readonly item: Extract<BoxPlotSelectionItem, {kind: 'summary'}>;
      readonly summary: BoxPlotSummary;
      readonly source:
        | {readonly kind: 'raw'; readonly data: readonly Datum[]}
        | {readonly kind: 'summary'; readonly datum: Datum};
    }
  | {
      readonly kind: 'outlier';
      readonly item: Extract<BoxPlotSelectionItem, {kind: 'outlier'}>;
      readonly value: number;
      readonly source:
        | {readonly kind: 'raw'; readonly datum: Datum}
        | {readonly kind: 'summary'; readonly datum: Datum; readonly outlierIndex: number};
    }
);
export interface BoxPlotInteraction<Datum extends object> {
  readonly getOutlierId: (context: BoxPlotOutlierContext<Datum>) => string;
  readonly onActivate?: (activation: BoxPlotActivation<Datum>) => void;
  readonly selection?: ChartSelection<BoxPlotSelectionItem>;
}

export interface HistogramProps<Datum extends object> extends StatisticalChartCommonProps<Datum> {
  readonly interaction?: HistogramInteraction<Datum>;
  readonly color?: ChartColor;
  readonly distribution: HistogramDistribution<Datum>;
  readonly xAxis: ChartValueAxis<LinearChartScale>;
  readonly yAxis: ChartValueAxis<LinearChartScale>;
}

export type BoxWhisker = 'min-max' | 'tukey';

export type BoxPlotDistribution<Datum extends object> =
  | {
      readonly kind: 'raw';
      readonly valueAccessor: ChartAccessor<Datum, number>;
      readonly whisker?: BoxWhisker;
    }
  | {
      readonly kind: 'summary';
      readonly lowerWhiskerAccessor: ChartAccessor<Datum, number>;
      readonly medianAccessor: ChartAccessor<Datum, number>;
      readonly outliersAccessor: ChartAccessor<Datum, readonly number[]>;
      readonly q1Accessor: ChartAccessor<Datum, number>;
      readonly q3Accessor: ChartAccessor<Datum, number>;
      readonly upperWhiskerAccessor: ChartAccessor<Datum, number>;
      readonly whisker: BoxWhisker;
    };

export interface BoxPlotProps<Datum extends object> extends StatisticalChartCommonProps<Datum> {
  readonly visibilityLabels?: ChartVisibilityLabels;
  readonly interaction?: BoxPlotInteraction<Datum>;
  readonly distribution: BoxPlotDistribution<Datum>;
  readonly groupAccessor: ChartAccessor<Datum, string>;
  readonly groups: NonEmptyChartSeries<StatisticalChartSeries>;
  readonly legend?: ChartLegend;
  readonly xAxis: {readonly label: string};
  readonly yAxis: ChartValueAxis<LinearChartScale>;
}
