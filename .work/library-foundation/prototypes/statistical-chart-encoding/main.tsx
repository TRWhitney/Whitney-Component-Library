import {
  useLayoutEffect,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
} from 'react';
import {createPortal} from 'react-dom';
import {createRoot} from 'react-dom/client';

import {
  AppearanceProvider,
  SegmentedControl,
  ToggleButton,
  type AccentColor,
  type Appearance,
} from '../../../../src/index.js';
import '../../../../src/styles.css';
import './styles.css';

type ChartKind = 'box' | 'bubble' | 'histogram' | 'scatter';
type Encoding = 'solid' | 'structure';
type RegionSize = 'compact' | 'wide';
type SeriesId = 'north' | 'south' | 'west';

interface PointDatum {
  readonly group: 0 | 1 | 2;
  readonly id: string;
  readonly label: string;
  readonly magnitude: number;
  readonly x: number;
  readonly y: number;
}

interface HistogramBin {
  readonly count: number;
  readonly from: number;
  readonly to: number;
}

interface BoxSummary {
  readonly label: string;
  readonly lowerWhisker: number;
  readonly median: number;
  readonly outliers: readonly number[];
  readonly q1: number;
  readonly q3: number;
  readonly upperWhisker: number;
}

interface BoxTarget {
  readonly boxIndex: number;
  readonly outlierIndex?: number;
  readonly type: 'outlier' | 'summary';
}

interface Reading {
  readonly index: number;
  readonly label: string;
  readonly rows: readonly ReadingRow[];
  readonly x: number;
  readonly y: number;
}

interface ReadingRow {
  readonly color?: string;
  readonly label: string;
  readonly seriesId?: SeriesId;
  readonly value: string;
}

type PrototypeStyles = CSSProperties & {
  '--prototype-axis-font-size': string;
  '--prototype-region-width': string;
};

type ChartTooltipStyles = CSSProperties & {
  '--wcl-chart-tooltip-left': string;
  '--wcl-chart-tooltip-y': string;
};

const chartOptions = [
  {label: 'Scatter', value: 'scatter'},
  {label: 'Bubble', value: 'bubble'},
  {label: 'Histogram', value: 'histogram'},
  {label: 'Box plot', value: 'box'},
] as const;
const encodingOptions = [
  {label: 'Translucent marks', value: 'structure'},
  {label: 'Solid marks', value: 'solid'},
] as const;
const appearanceOptions = [
  {label: 'Light', value: 'light'},
  {label: 'Dark', value: 'dark'},
] as const;
const sizeOptions = [
  {label: 'Wide', value: 'wide'},
  {label: 'Compact', value: 'compact'},
] as const;
const groupLabels = ['North loop', 'South loop', 'West loop'] as const;
const groupIds = ['north', 'south', 'west'] as const;
const points: readonly PointDatum[] = [
  {group: 0, id: 'north-01', label: 'North loop Monday', magnitude: 42, x: 18, y: 28},
  {group: 1, id: 'south-01', label: 'South loop Monday', magnitude: 74, x: 31, y: 46},
  {group: 2, id: 'west-01', label: 'West loop Monday', magnitude: 31, x: 43, y: 38},
  {group: 0, id: 'north-02', label: 'North loop Tuesday', magnitude: 88, x: 56, y: 68},
  {group: 1, id: 'south-02', label: 'South loop Tuesday', magnitude: 52, x: 70, y: 59},
  {group: 2, id: 'west-02', label: 'West loop Tuesday', magnitude: 64, x: 82, y: 82},
] as const;
const overlapPoints: readonly PointDatum[] = [
  ...points,
  {group: 1, id: 'south-03', label: 'South loop Wednesday', magnitude: 26, x: 56, y: 68},
  {group: 2, id: 'west-03', label: 'West loop Wednesday', magnitude: 58, x: 58, y: 66},
] as const;
const histogramBins: readonly HistogramBin[] = [
  {count: 3, from: 0, to: 40},
  {count: 9, from: 40, to: 80},
  {count: 17, from: 80, to: 120},
  {count: 13, from: 120, to: 160},
  {count: 7, from: 160, to: 200},
  {count: 2, from: 200, to: 240},
] as const;
const boxes: readonly BoxSummary[] = [
  {label: 'North', lowerWhisker: 28, median: 54, outliers: [104], q1: 43, q3: 71, upperWhisker: 91},
  {
    label: 'South',
    lowerWhisker: 19,
    median: 47,
    outliers: [96, 108],
    q1: 34,
    q3: 63,
    upperWhisker: 85,
  },
  {label: 'West', lowerWhisker: 37, median: 66, outliers: [], q1: 55, q3: 79, upperWhisker: 94},
] as const;
const boxTargets: readonly BoxTarget[] = boxes.flatMap((box, boxIndex) => [
  {boxIndex, type: 'summary' as const},
  ...box.outliers.map((_, outlierIndex) => ({boxIndex, outlierIndex, type: 'outlier' as const})),
]);

const plot = {bottom: 306, left: 60, right: 620, top: 18} as const;
const pointXDomain = {maximum: 90, minimum: 10} as const;
const pointYDomain = {maximum: 100, minimum: 20} as const;
const maximumPointMagnitude = Math.max(...overlapPoints.map((point) => point.magnitude));
const query = new URLSearchParams(window.location.search);

function initialChartKind(): ChartKind {
  const value = query.get('chart');
  return value === 'box' || value === 'histogram' || value === 'scatter' ? value : 'bubble';
}

function initialEncoding(): Encoding {
  return query.get('encoding') === 'solid' ? 'solid' : 'structure';
}

function initialAppearance(): Appearance {
  return query.get('appearance') === 'light' ? 'light' : 'dark';
}

function initialRegionSize(): RegionSize {
  return query.get('size') === 'compact' ? 'compact' : 'wide';
}

function projectX(value: number, minimum = 0, maximum = 100): number {
  return plot.left + ((value - minimum) / (maximum - minimum)) * (plot.right - plot.left);
}

function projectY(value: number, minimum = 0, maximum = 100): number {
  return plot.bottom - ((value - minimum) / (maximum - minimum)) * (plot.bottom - plot.top);
}

function pointReading(data: readonly PointDatum[], index: number, kind: ChartKind): Reading {
  const point = data[index] ?? data[0]!;
  const overlaps = data.filter((item) => item.x === point.x && item.y === point.y).length;
  return {
    index,
    label: point.label,
    rows: [
      {
        color: point.group === 0 ? 'accent' : `series-${point.group + 1}`,
        label: 'Turbine loop',
        seriesId: groupIds[point.group],
        value: groupLabels[point.group],
      },
      {label: 'Temperature', value: `${point.x} °F`},
      {label: 'Thermal demand', value: `${point.y} MWh`},
      ...(kind === 'bubble' ? [{label: 'Stored energy', value: `${point.magnitude} MWh`}] : []),
      ...(overlaps > 1 ? [{label: 'Shared position', value: `${overlaps} recorded points`}] : []),
    ],
    x: projectX(point.x, pointXDomain.minimum, pointXDomain.maximum),
    y: projectY(point.y, pointYDomain.minimum, pointYDomain.maximum),
  };
}

function GuideGlyph({kind}: {readonly kind: string}): ReactElement {
  if (kind === 'position') {
    return (
      <svg aria-hidden="true" className="guide-glyph" viewBox="0 0 44 32">
        <path d="M 7 4 V 26 H 39" />
        <circle cx="29" cy="12" r="4" />
      </svg>
    );
  }
  if (kind === 'area') {
    return (
      <svg aria-hidden="true" className="guide-glyph" viewBox="0 0 44 32">
        <circle cx="13" cy="19" r="5" />
        <circle cx="31" cy="15" r="10" />
      </svg>
    );
  }
  if (kind === 'bins') {
    return (
      <svg aria-hidden="true" className="guide-glyph" viewBox="0 0 44 32">
        <path d="M 5 27 H 39" />
        <rect height="10" width="11" x="7" y="17" />
        <rect height="19" width="11" x="18" y="8" />
        <rect height="14" width="11" x="29" y="13" />
      </svg>
    );
  }
  if (kind === 'bar-height') {
    return (
      <svg aria-hidden="true" className="guide-glyph" viewBox="0 0 44 32">
        <path d="M 5 27 H 39" />
        <rect height="10" width="11" x="9" y="17" />
        <rect height="20" width="11" x="24" y="7" />
      </svg>
    );
  }
  if (kind === 'touching') {
    return (
      <svg aria-hidden="true" className="guide-glyph" viewBox="0 0 44 32">
        <rect height="13" width="10" x="7" y="12" />
        <rect height="18" width="10" x="17" y="7" />
        <rect height="13" width="10" x="27" y="12" />
      </svg>
    );
  }
  if (kind === 'box') {
    return (
      <svg aria-hidden="true" className="guide-glyph" viewBox="0 0 44 32">
        <path d="M 5 16 H 12 M 32 16 H 39 M 5 10 V 22 M 39 10 V 22" />
        <rect height="20" width="20" x="12" y="6" />
        <path className="guide-glyph-strong" d="M 23 6 V 26" />
        <circle cx="42" cy="16" r="2" />
      </svg>
    );
  }
  if (kind === 'box-middle') {
    return (
      <svg aria-hidden="true" className="guide-glyph" viewBox="0 0 44 32">
        <path d="M 5 16 H 12 M 32 16 H 39" />
        <rect className="guide-glyph-emphasis" height="20" width="20" x="12" y="6" />
      </svg>
    );
  }
  if (kind === 'box-median') {
    return (
      <svg aria-hidden="true" className="guide-glyph" viewBox="0 0 44 32">
        <path d="M 5 16 H 12 M 32 16 H 39 M 5 10 V 22 M 39 10 V 22" />
        <rect height="20" width="20" x="12" y="6" />
        <path className="guide-glyph-strong" d="M 23 6 V 26" />
      </svg>
    );
  }
  if (kind === 'outliers') {
    return (
      <svg aria-hidden="true" className="guide-glyph" viewBox="0 0 44 32">
        <rect height="18" width="14" x="10" y="7" />
        <circle cx="32" cy="11" r="2.5" />
        <circle cx="38" cy="20" r="2.5" />
      </svg>
    );
  }
  if (kind === 'shape') {
    return (
      <svg aria-hidden="true" className="guide-glyph" viewBox="0 0 44 32">
        <circle cx="8" cy="16" r="5" />
        <rect height="9" transform="rotate(45 22 16)" width="9" x="17.5" y="11.5" />
        <path d="M 36 10 L 42 22 L 30 22 Z" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" className="guide-glyph" viewBox="0 0 44 32">
      <circle cx="8" cy="16" r="3" />
      <circle cx="20" cy="16" r="3" />
      <circle cx="32" cy="16" r="3" />
    </svg>
  );
}

function ChartGuide({kind}: {readonly kind: ChartKind}): ReactElement {
  const items =
    kind === 'scatter'
      ? [
          {copy: 'One mark is one recorded operating period.', glyph: 'record'},
          {
            copy: 'Left to right is temperature. Bottom to top is thermal demand.',
            glyph: 'position',
          },
          {copy: 'Shape and color identify the turbine loop.', glyph: 'shape'},
        ]
      : kind === 'bubble'
        ? [
            {copy: 'One mark is one recorded operating period.', glyph: 'record'},
            {copy: 'Position shows temperature and thermal demand.', glyph: 'position'},
            {copy: 'Mark area shows stored energy. Larger means more.', glyph: 'area'},
            {copy: 'Shape and color identify the turbine loop.', glyph: 'shape'},
          ]
        : kind === 'histogram'
          ? [
              {copy: 'One bar covers a 40 millisecond restart range.', glyph: 'bins'},
              {copy: 'Bar height is the number of restarts in that range.', glyph: 'bar-height'},
              {copy: 'The bars touch because the ranges touch.', glyph: 'touching'},
            ]
          : [
              {copy: 'One box summarizes recovery times for one turbine loop.', glyph: 'box'},
              {copy: 'The box contains the middle half of the times.', glyph: 'box-middle'},
              {
                copy: 'The heavy line is the median. Whiskers show the usual range.',
                glyph: 'box-median',
              },
              {copy: 'Separate dots are times outside that range.', glyph: 'outliers'},
            ];

  return (
    <section aria-label="How to read this chart" className="chart-guide" data-region="chart-guide">
      <span aria-hidden="true" className="prototype-region-label">
        Chart guide
      </span>
      <strong>How to read it</strong>
      <div className="chart-guide-items">
        {items.map((item) => (
          <div className="chart-guide-item" key={item.copy}>
            <GuideGlyph kind={item.glyph} />
            <span>{item.copy}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function EncodingGuide({encoding}: {readonly encoding: Encoding}): ReactElement {
  return (
    <section aria-label="Mark treatment comparison" className="encoding-guide">
      <div className="encoding-guide-heading">
        <strong>What this switch changes</strong>
        <span>Only the paint changes. Every value and mark stays in the same place.</span>
      </div>
      <div className="encoding-guide-options">
        <div data-selected={encoding === 'structure' ? '' : undefined}>
          <span aria-hidden="true" className="encoding-sample" data-sample="structure">
            <i />
            <b />
          </span>
          <span className="encoding-option-copy">
            <strong>Translucent marks</strong>
            <small>
              Series color fills the mark at 30% opacity, so marks beneath remain visible.
            </small>
          </span>
        </div>
        <div data-selected={encoding === 'solid' ? '' : undefined}>
          <span aria-hidden="true" className="encoding-sample" data-sample="solid">
            <i />
            <b />
          </span>
          <span className="encoding-option-copy">
            <strong>Solid marks</strong>
            <small>Series color fills the mark at full opacity.</small>
          </span>
        </div>
      </div>
    </section>
  );
}

function LegendSwatch({
  group,
  kind,
}: {
  readonly group: number;
  readonly kind: ChartKind;
}): ReactElement {
  const color = group === 0 ? 'accent' : `series-${group + 1}`;
  return (
    <svg
      aria-hidden="true"
      data-color={color}
      data-wcl-chart-legend-swatch=""
      focusable="false"
      viewBox="0 0 20 12"
    >
      {kind === 'box' ? (
        <rect data-stat-legend-mark="" height="8" width="14" x="3" y="2" />
      ) : group === 0 ? (
        <circle cx="10" cy="6" data-stat-legend-mark="" r="4" />
      ) : group === 1 ? (
        <rect
          data-stat-legend-mark=""
          height="7"
          transform="rotate(45 10 6)"
          width="7"
          x="6.5"
          y="2.5"
        />
      ) : (
        <path d="M 10 1 L 16 11 L 4 11 Z" data-stat-legend-mark="" />
      )}
    </svg>
  );
}

function StatisticalLegend({
  emphasizedSeriesId,
  kind,
  onClear,
  onPin,
  onTransientChange,
  pinnedSeriesId,
}: {
  readonly emphasizedSeriesId: SeriesId | undefined;
  readonly kind: ChartKind;
  readonly onClear: () => void;
  readonly onPin: (seriesId: SeriesId) => void;
  readonly onTransientChange: (seriesId: SeriesId | null) => void;
  readonly pinnedSeriesId: SeriesId | null;
}): ReactElement {
  return (
    <ul aria-label="Turbine loops" data-wcl-chart-legend="">
      {groupLabels.map((label, group) => {
        const seriesId = groupIds[group]!;
        return (
          <li
            data-color={group === 0 ? 'accent' : `series-${group + 1}`}
            data-emphasized={emphasizedSeriesId === seriesId ? '' : undefined}
            data-muted={
              emphasizedSeriesId !== undefined && emphasizedSeriesId !== seriesId ? '' : undefined
            }
            data-series-index={group}
            key={seriesId}
          >
            <button
              aria-pressed={pinnedSeriesId === seriesId}
              data-wcl-chart-legend-button=""
              onBlur={() => onTransientChange(null)}
              onClick={() => onPin(seriesId)}
              onFocus={() => onTransientChange(seriesId)}
              onKeyDown={(event) => {
                if (event.key !== 'Escape') return;
                event.preventDefault();
                onClear();
              }}
              onMouseEnter={() => onTransientChange(seriesId)}
              onMouseLeave={() => onTransientChange(null)}
              type="button"
            >
              <LegendSwatch group={group} kind={kind} />
              {label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function histogramReading(index: number): Reading {
  const bin = histogramBins[index] ?? histogramBins[0]!;
  return {
    index,
    label: `${bin.from} to ${bin.to} ms`,
    rows: [
      {
        label: 'Interval',
        value: `[${bin.from}, ${bin.to}${index === histogramBins.length - 1 ? ']' : ')'}`,
      },
      {color: 'accent', label: 'Restarts', value: String(bin.count)},
    ],
    x: projectX((bin.from + bin.to) / 2, 0, 240),
    y: projectY(bin.count, 0, 20),
  };
}

function boxReading(index: number): Reading {
  const target = boxTargets[index] ?? boxTargets[0]!;
  const box = boxes[target.boxIndex] ?? boxes[0]!;
  const x = plot.left + ((target.boxIndex + 0.5) / boxes.length) * (plot.right - plot.left);
  if (target.type === 'outlier') {
    const outlier = box.outliers[target.outlierIndex ?? 0] ?? box.outliers[0] ?? box.median;
    return {
      index,
      label: `${box.label} outlier`,
      rows: [
        {
          color: target.boxIndex === 0 ? 'accent' : `series-${target.boxIndex + 1}`,
          label: 'Turbine loop',
          seriesId: groupIds[target.boxIndex],
          value: box.label,
        },
        {label: 'Outlier recovery time', value: `${outlier} min`},
        {label: 'Lower whisker', value: `${box.lowerWhisker} min`},
        {label: 'First quartile', value: `${box.q1} min`},
        {label: 'Median', value: `${box.median} min`},
        {label: 'Third quartile', value: `${box.q3} min`},
        {label: 'Upper whisker', value: `${box.upperWhisker} min`},
      ],
      x,
      y: projectY(outlier, 0, 120),
    };
  }
  return {
    index,
    label: `${box.label} recovery time`,
    rows: [
      {
        color: target.boxIndex === 0 ? 'accent' : `series-${target.boxIndex + 1}`,
        label: 'Turbine loop',
        seriesId: groupIds[target.boxIndex],
        value: box.label,
      },
      {label: 'Lower whisker', value: `${box.lowerWhisker} min`},
      {label: 'First quartile', value: `${box.q1} min`},
      {label: 'Median', value: `${box.median} min`},
      {label: 'Third quartile', value: `${box.q3} min`},
      {label: 'Upper whisker', value: `${box.upperWhisker} min`},
      {label: 'Whisker method', value: 'Tukey 1.5 IQR'},
      {
        label: 'Outliers',
        value: box.outliers.length === 0 ? 'None' : `${box.outliers.join(', ')} min`,
      },
    ],
    x,
    y: projectY(box.median, 0, 120),
  };
}

function pointShape(point: PointDatum, radius: number, active: boolean): ReactElement {
  const common = {
    'data-active': active ? '' : undefined,
    'data-color': point.group === 0 ? 'accent' : `series-${point.group + 1}`,
    'data-mark-radius': radius,
    'data-point-shape': point.group,
    'data-stat-mark': '',
  } as const;
  const x = projectX(point.x, pointXDomain.minimum, pointXDomain.maximum);
  const y = projectY(point.y, pointYDomain.minimum, pointYDomain.maximum);
  if (point.group === 1) {
    return (
      <rect
        {...common}
        height={radius * 1.7}
        rx="1"
        transform={`rotate(45 ${x} ${y})`}
        width={radius * 1.7}
        x={x - radius * 0.85}
        y={y - radius * 0.85}
      />
    );
  }
  if (point.group === 2) {
    return (
      <path
        {...common}
        d={`M ${x} ${y - radius} L ${x + radius} ${y + radius} L ${x - radius} ${y + radius} Z`}
      />
    );
  }
  return <circle {...common} cx={x} cy={y} r={radius} />;
}

function pointRadius(kind: ChartKind, magnitude: number, regionSize: RegionSize): number {
  if (kind === 'scatter') return regionSize === 'compact' ? 12.25 : 7;
  const compactScale = regionSize === 'compact' ? 5 / 3 : 1;
  return Math.sqrt(magnitude / maximumPointMagnitude) * 26 * compactScale;
}

function clamp(minimum: number, value: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function StatisticalTooltip({
  activeSeriesId,
  pointer,
  reading,
  svg,
}: {
  readonly activeSeriesId: SeriesId | null;
  readonly pointer: {readonly x: number; readonly y: number} | null;
  readonly reading: Reading;
  readonly svg: SVGSVGElement | null;
}): ReactElement {
  const contentKey = [
    reading.label,
    ...reading.rows.flatMap((row) => [row.label, row.value, row.color ?? '']),
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
  }, [contentKey]);
  const svgBounds = svg?.getBoundingClientRect();
  const anchorX =
    pointer?.x ??
    (svgBounds === undefined ? reading.x : svgBounds.left + (reading.x / 640) * svgBounds.width);
  const anchorY =
    pointer?.y ??
    (svgBounds === undefined ? reading.y : svgBounds.top + (reading.y / 360) * svgBounds.height);
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const tooltipGap = 12;
  const viewportPadding = 8;
  const estimatedTooltipWidth = Math.min(304, Math.max(176, viewportWidth - viewportPadding * 2));
  const tooltipWidth = tooltipSize?.width ?? estimatedTooltipWidth;
  const tooltipHeight = tooltipSize?.height ?? 50 + reading.rows.length * 25;
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
  const portalTarget = document.querySelector('[data-wcl-provider]') ?? document.body;

  return createPortal(
    <div data-wcl-chart-tooltip-layer="">
      <div
        data-horizontal-placement={horizontalPlacement}
        data-vertical-placement={
          anchorY < tooltipHeight / 2 + tooltipGap
            ? 'start'
            : anchorY + tooltipHeight / 2 + tooltipGap > viewportHeight
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
          {reading.rows.map((row) => (
            <div
              data-active={
                row.seriesId !== undefined && row.seriesId === activeSeriesId ? '' : undefined
              }
              key={`${row.label}-${row.value}`}
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
                    <line data-wcl-chart-legend-line="" x1="0" x2="20" y1="4" y2="4" />
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

function PlotAxes({
  kind,
  regionSize,
}: {
  readonly kind: ChartKind;
  readonly regionSize: RegionSize;
}): ReactElement {
  const horizontalLabel =
    kind === 'histogram'
      ? 'Restart latency (ms)'
      : kind === 'box'
        ? 'Turbine loop'
        : 'Temperature (°F)';
  const verticalLabel =
    kind === 'histogram'
      ? 'Restarts'
      : kind === 'box'
        ? 'Recovery time (minutes)'
        : 'Thermal demand (MWh)';
  const horizontalTicks =
    kind === 'box'
      ? []
      : kind === 'histogram'
        ? regionSize === 'compact'
          ? [0, 80, 160, 240]
          : [0, 40, 80, 120, 160, 200, 240]
        : [10, 30, 50, 70, 90];
  const verticalTicks =
    kind === 'box'
      ? regionSize === 'compact'
        ? [0, 30, 60, 90, 120]
        : [0, 20, 40, 60, 80, 100, 120]
      : kind === 'histogram'
        ? [0, 5, 10, 15, 20]
        : [20, 40, 60, 80, 100];
  const xForTick = (value: number): number =>
    kind === 'histogram'
      ? projectX(value, 0, 240)
      : projectX(value, pointXDomain.minimum, pointXDomain.maximum);
  const yForTick = (value: number): number =>
    kind === 'box'
      ? projectY(value, 0, 120)
      : kind === 'histogram'
        ? projectY(value, 0, 20)
        : projectY(value, pointYDomain.minimum, pointYDomain.maximum);
  return (
    <g data-region="axes">
      <g data-axis="y" data-scale="linear" data-wcl-chart-axis="">
        {verticalTicks.map((value) => {
          const y = yForTick(value);
          return (
            <g data-wcl-chart-tick="" key={value}>
              <line data-wcl-chart-grid-line="" x1={plot.left} x2={plot.right} y1={y} y2={y} />
              <line data-wcl-chart-tick-mark="" x1={plot.left - 5} x2={plot.left} y1={y} y2={y} />
              <text data-wcl-chart-tick-label="" textAnchor="end" x={plot.left - 9} y={y + 4}>
                {value}
              </text>
            </g>
          );
        })}
        <line
          data-wcl-chart-axis-rail=""
          x1={plot.left}
          x2={plot.left}
          y1={plot.top}
          y2={plot.bottom}
        />
        <text
          data-wcl-chart-axis-label=""
          textAnchor="middle"
          transform={`rotate(-90 14 ${(plot.top + plot.bottom) / 2})`}
          x="14"
          y={(plot.top + plot.bottom) / 2}
        >
          {verticalLabel}
        </text>
      </g>
      <g
        data-axis="x"
        data-scale={kind === 'box' ? 'categorical' : 'linear'}
        data-wcl-chart-axis=""
      >
        {horizontalTicks.map((value) => {
          const x = xForTick(value);
          return (
            <g data-wcl-chart-tick="" key={value}>
              <line
                data-wcl-chart-tick-mark=""
                x1={x}
                x2={x}
                y1={plot.bottom}
                y2={plot.bottom + 5}
              />
              <text data-wcl-chart-tick-label="" textAnchor="middle" x={x} y={plot.bottom + 18}>
                {value}
              </text>
            </g>
          );
        })}
        {kind === 'box'
          ? boxes.map((box, index) => {
              const x = plot.left + ((index + 0.5) / boxes.length) * (plot.right - plot.left);
              return (
                <g data-wcl-chart-tick="" key={box.label}>
                  <line
                    data-wcl-chart-tick-mark=""
                    x1={x}
                    x2={x}
                    y1={plot.bottom}
                    y2={plot.bottom + 5}
                  />
                  <text data-wcl-chart-tick-label="" textAnchor="middle" x={x} y={plot.bottom + 18}>
                    {box.label}
                  </text>
                </g>
              );
            })
          : null}
        <line
          data-wcl-chart-axis-rail=""
          x1={plot.left}
          x2={plot.right}
          y1={plot.bottom}
          y2={plot.bottom}
        />
        <text
          data-wcl-chart-axis-label=""
          textAnchor="middle"
          x={(plot.left + plot.right) / 2}
          y="353"
        >
          {horizontalLabel}
        </text>
      </g>
    </g>
  );
}

function StatisticalPlot({
  encoding,
  kind,
  regionSize,
  stressOverlap,
}: {
  readonly encoding: Encoding;
  readonly kind: ChartKind;
  readonly regionSize: RegionSize;
  readonly stressOverlap: boolean;
}): ReactElement {
  const data = stressOverlap ? overlapPoints : points;
  const initialIndex =
    kind === 'box'
      ? Math.max(
          0,
          boxTargets.findIndex((target) => target.type === 'summary' && target.boxIndex === 1),
        )
      : kind === 'histogram'
        ? 2
        : 3;
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [keyboardReading, setKeyboardReading] = useState(false);
  const [pointerReadingIndex, setPointerReadingIndex] = useState<number | null>(null);
  const [pointerSeriesId, setPointerSeriesId] = useState<SeriesId | null>(null);
  const [touchReadingIndex, setTouchReadingIndex] = useState<number | null>(null);
  const [touchSeriesId, setTouchSeriesId] = useState<SeriesId | null>(null);
  const [transientLegendSeriesId, setTransientLegendSeriesId] = useState<SeriesId | null>(null);
  const [pinnedLegendSeriesId, setPinnedLegendSeriesId] = useState<SeriesId | null>(null);
  const [pointerPosition, setPointerPosition] = useState<{
    readonly x: number;
    readonly y: number;
  } | null>(null);
  const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null);
  const [svgElement, setSvgElement] = useState<SVGSVGElement | null>(null);
  const readingIndex = pointerReadingIndex ?? touchReadingIndex ?? activeIndex;
  const reading = useMemo(
    () =>
      kind === 'box'
        ? boxReading(Math.min(readingIndex, boxTargets.length - 1))
        : kind === 'histogram'
          ? histogramReading(Math.min(readingIndex, histogramBins.length - 1))
          : pointReading(data, Math.min(readingIndex, data.length - 1), kind),
    [data, kind, readingIndex],
  );
  const itemCount =
    kind === 'box' ? boxTargets.length : kind === 'histogram' ? histogramBins.length : data.length;
  const highlightedIndex =
    hoveredIndex ?? touchReadingIndex ?? (keyboardReading ? activeIndex : null);
  const legendSeriesId = pinnedLegendSeriesId ?? transientLegendSeriesId ?? undefined;
  const emphasizedSeriesId = legendSeriesId ?? pointerSeriesId ?? touchSeriesId ?? undefined;
  const directlyReadIndex = hoveredIndex ?? touchReadingIndex;
  const isElementMuted = (elementIndex: number, seriesId?: SeriesId): boolean =>
    legendSeriesId !== undefined
      ? seriesId !== legendSeriesId
      : directlyReadIndex !== null && elementIndex !== directlyReadIndex;

  useEffect(() => {
    if (touchReadingIndex === null) return;
    const dismissTouchReading = (event: globalThis.PointerEvent): void => {
      if (event.target instanceof Node && !rootElement?.contains(event.target)) {
        setTouchReadingIndex(null);
        setTouchSeriesId(null);
      }
    };
    document.addEventListener('pointerdown', dismissTouchReading);
    return () => document.removeEventListener('pointerdown', dismissTouchReading);
  }, [rootElement, touchReadingIndex]);

  const movePointerReading = (event: ReactPointerEvent<SVGSVGElement>): void => {
    if (event.pointerType === 'touch') return;
    const target = event.target instanceof Element ? event.target : null;
    const directIndex = Number(
      target?.closest('[data-reading-index]')?.getAttribute('data-reading-index'),
    );
    if (!Number.isInteger(directIndex) || directIndex < 0 || directIndex >= itemCount) {
      setHoveredIndex(null);
      setKeyboardReading(false);
      setPointerPosition(null);
      setPointerReadingIndex(null);
      setPointerSeriesId(null);
      return;
    }
    const seriesId = target?.closest('[data-series-id]')?.getAttribute('data-series-id');
    setHoveredIndex(directIndex);
    setKeyboardReading(false);
    setPointerPosition({x: event.clientX, y: event.clientY});
    setPointerReadingIndex(directIndex);
    setPointerSeriesId(
      seriesId === 'north' || seriesId === 'south' || seriesId === 'west' ? seriesId : null,
    );
  };

  const clearPointerReading = (): void => {
    setHoveredIndex(null);
    setPointerPosition(null);
    setPointerReadingIndex(null);
    setPointerSeriesId(null);
  };

  const retainTouchReading = (event: ReactPointerEvent<SVGSVGElement>): void => {
    if (event.pointerType !== 'touch') return;
    const target = event.target instanceof Element ? event.target : null;
    const directIndex = Number(
      target?.closest('[data-reading-index]')?.getAttribute('data-reading-index'),
    );
    if (!Number.isInteger(directIndex) || directIndex < 0 || directIndex >= itemCount) return;
    const seriesId = target?.closest('[data-series-id]')?.getAttribute('data-series-id');
    clearPointerReading();
    setKeyboardReading(false);
    setTouchReadingIndex(directIndex);
    setTouchSeriesId(
      seriesId === 'north' || seriesId === 'south' || seriesId === 'west' ? seriesId : null,
    );
  };

  const readWithKeyboard = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      clearPointerReading();
      setKeyboardReading(false);
      setTouchReadingIndex(null);
      setTouchSeriesId(null);
      return;
    }
    const current = Math.min(activeIndex, itemCount - 1);
    let next = current;
    if (kind === 'scatter' || kind === 'bubble') {
      const currentPoint = data[current] ?? data[0]!;
      const stablePoints = data.map((point, index) => ({index, point}));
      if (event.key === 'Home' || event.key === 'End') {
        stablePoints.sort(
          (first, second) =>
            first.point.x - second.point.x || first.point.id.localeCompare(second.point.id),
        );
        next = (event.key === 'Home' ? stablePoints[0] : stablePoints.at(-1))?.index ?? current;
      } else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        const coincident = stablePoints
          .filter(
            (candidate) =>
              candidate.index !== current &&
              candidate.point.x === currentPoint.x &&
              candidate.point.y === currentPoint.y,
          )
          .sort((first, second) => first.point.id.localeCompare(second.point.id));
        if (coincident.length > 0) {
          next =
            (event.key === 'ArrowLeft' || event.key === 'ArrowDown'
              ? coincident.at(-1)
              : coincident[0]
            )?.index ?? current;
        } else {
          const candidates = stablePoints
            .filter((candidate) => {
              const dx = candidate.point.x - currentPoint.x;
              const dy = candidate.point.y - currentPoint.y;
              if (event.key === 'ArrowLeft') return dx < 0;
              if (event.key === 'ArrowRight') return dx > 0;
              if (event.key === 'ArrowUp') return dy > 0;
              return dy < 0;
            })
            .map((candidate) => {
              const dx = candidate.point.x - currentPoint.x;
              const dy = candidate.point.y - currentPoint.y;
              const primary =
                event.key === 'ArrowLeft' || event.key === 'ArrowRight'
                  ? Math.abs(dx)
                  : Math.abs(dy);
              const perpendicular =
                event.key === 'ArrowLeft' || event.key === 'ArrowRight'
                  ? Math.abs(dy)
                  : Math.abs(dx);
              return {
                ...candidate,
                score: Math.hypot(dx, dy) + (perpendicular / primary) * 100,
              };
            })
            .sort(
              (first, second) =>
                first.score - second.score || first.point.id.localeCompare(second.point.id),
            );
          next = candidates[0]?.index ?? current;
        }
      }
    } else if (kind === 'box') {
      const summaries = boxes.map((_, boxIndex) =>
        boxTargets.findIndex((target) => target.type === 'summary' && target.boxIndex === boxIndex),
      );
      const currentTarget = boxTargets[current] ?? boxTargets[0]!;
      const currentSummaryPosition = Math.max(0, currentTarget.boxIndex);
      if (event.key === 'Home') next = summaries[0] ?? current;
      if (event.key === 'End') next = summaries.at(-1) ?? current;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        next = summaries[Math.max(0, currentSummaryPosition - 1)] ?? current;
      }
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        next = summaries[Math.min(summaries.length - 1, currentSummaryPosition + 1)] ?? current;
      }
    } else {
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = itemCount - 1;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = Math.max(0, current - 1);
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp')
        next = Math.min(itemCount - 1, current + 1);
    }
    if (
      next === current &&
      !['Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)
    )
      return;
    event.preventDefault();
    setActiveIndex(next);
    clearPointerReading();
    setTouchReadingIndex(null);
    setTouchSeriesId(null);
    setKeyboardReading(true);
  };

  const orderedPoints =
    kind === 'scatter' || kind === 'bubble'
      ? [...data.map((point, index) => ({index, point}))].sort((first, second) => {
          const layer = ({index, point}: {readonly index: number; readonly point: PointDatum}) =>
            Number(groupIds[point.group] === pinnedLegendSeriesId) * 2 +
            Number(index === highlightedIndex);
          return layer(first) - layer(second);
        })
      : [];
  const showReading = pointerReadingIndex !== null || touchReadingIndex !== null || keyboardReading;

  return (
    <div className="stat-plot-composition" data-encoding={encoding} ref={setRootElement}>
      {kind === 'histogram' ? null : (
        <StatisticalLegend
          emphasizedSeriesId={emphasizedSeriesId}
          kind={kind}
          onClear={() => {
            setPinnedLegendSeriesId(null);
            setTransientLegendSeriesId(null);
          }}
          onPin={(seriesId) =>
            setPinnedLegendSeriesId((current) => (current === seriesId ? null : seriesId))
          }
          onTransientChange={setTransientLegendSeriesId}
          pinnedSeriesId={pinnedLegendSeriesId}
        />
      )}
      <div
        aria-label={`${chartOptions.find((option) => option.value === kind)?.label ?? 'Statistical chart'} reading`}
        aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Home End Escape"
        className="stat-chart"
        data-encoding={encoding}
        data-region="plot"
        onBlur={() => setKeyboardReading(false)}
        onFocus={(event) => {
          if (event.currentTarget === event.target) setKeyboardReading(true);
        }}
        onKeyDown={readWithKeyboard}
        role="group"
        tabIndex={0}
      >
        <span aria-hidden="true" className="prototype-region-label">
          Statistical plot
        </span>
        <div className="stat-plot-area" onPointerLeave={clearPointerReading}>
          <svg
            aria-hidden="true"
            data-wcl-chart-svg=""
            focusable="false"
            onPointerDown={retainTouchReading}
            onPointerLeave={clearPointerReading}
            onPointerMove={movePointerReading}
            ref={setSvgElement}
            viewBox="0 0 640 360"
          >
            <PlotAxes kind={kind} regionSize={regionSize} />
            <g data-region="marks">
              {kind === 'scatter' || kind === 'bubble'
                ? orderedPoints.map(({index, point}) => {
                    const seriesId = groupIds[point.group];
                    return (
                      <g
                        data-emphasized={emphasizedSeriesId === seriesId ? '' : undefined}
                        data-muted={isElementMuted(index, seriesId) ? '' : undefined}
                        data-point-id={point.id}
                        data-reading-index={index}
                        data-series-id={seriesId}
                        data-stat-element=""
                        key={point.id}
                      >
                        {pointShape(
                          point,
                          pointRadius(kind, point.magnitude, regionSize),
                          highlightedIndex === index,
                        )}
                      </g>
                    );
                  })
                : null}
              {kind === 'histogram'
                ? histogramBins.map((bin, index) => {
                    const x = projectX(bin.from, 0, 240);
                    const right = projectX(bin.to, 0, 240);
                    const y = projectY(bin.count, 0, 20);
                    return (
                      <rect
                        data-active={highlightedIndex === index ? '' : undefined}
                        data-color="accent"
                        data-muted={isElementMuted(index) ? '' : undefined}
                        data-stat-bin=""
                        data-stat-element=""
                        data-reading-index={index}
                        height={plot.bottom - y}
                        key={bin.from}
                        width={right - x}
                        x={x}
                        y={y}
                      />
                    );
                  })
                : null}
              {kind === 'box'
                ? boxes.map((box, index) => {
                    const center =
                      plot.left + ((index + 0.5) / boxes.length) * (plot.right - plot.left);
                    const halfWidth = 44;
                    const summaryTargetIndex = boxTargets.findIndex(
                      (target) => target.type === 'summary' && target.boxIndex === index,
                    );
                    const color = index === 0 ? 'accent' : `series-${index + 1}`;
                    const seriesId = groupIds[index]!;
                    return (
                      <g
                        data-color={color}
                        data-emphasized={emphasizedSeriesId === seriesId ? '' : undefined}
                        data-series-id={seriesId}
                        key={box.label}
                      >
                        <g
                          data-active={highlightedIndex === summaryTargetIndex ? '' : undefined}
                          data-reading-index={summaryTargetIndex}
                          data-stat-box=""
                          data-stat-element=""
                          data-muted={isElementMuted(summaryTargetIndex, seriesId) ? '' : undefined}
                        >
                          <line
                            data-stat-whisker=""
                            x1={center}
                            x2={center}
                            y1={projectY(box.upperWhisker, 0, 120)}
                            y2={projectY(box.q3, 0, 120)}
                          />
                          <line
                            data-stat-whisker=""
                            x1={center}
                            x2={center}
                            y1={projectY(box.q1, 0, 120)}
                            y2={projectY(box.lowerWhisker, 0, 120)}
                          />
                          <line
                            data-stat-whisker-cap=""
                            x1={center - 22}
                            x2={center + 22}
                            y1={projectY(box.upperWhisker, 0, 120)}
                            y2={projectY(box.upperWhisker, 0, 120)}
                          />
                          <line
                            data-stat-whisker-cap=""
                            x1={center - 22}
                            x2={center + 22}
                            y1={projectY(box.lowerWhisker, 0, 120)}
                            y2={projectY(box.lowerWhisker, 0, 120)}
                          />
                          <rect
                            data-stat-quartile=""
                            height={projectY(box.q1, 0, 120) - projectY(box.q3, 0, 120)}
                            width={halfWidth * 2}
                            x={center - halfWidth}
                            y={projectY(box.q3, 0, 120)}
                          />
                          <line
                            data-stat-median=""
                            x1={center - halfWidth}
                            x2={center + halfWidth}
                            y1={projectY(box.median, 0, 120)}
                            y2={projectY(box.median, 0, 120)}
                          />
                        </g>
                        {box.outliers.map((outlier, outlierIndex) => {
                          const outlierTargetIndex = boxTargets.findIndex(
                            (target) =>
                              target.type === 'outlier' &&
                              target.boxIndex === index &&
                              target.outlierIndex === outlierIndex,
                          );
                          return (
                            <circle
                              cx={center}
                              cy={projectY(outlier, 0, 120)}
                              data-active={highlightedIndex === outlierTargetIndex ? '' : undefined}
                              data-reading-index={outlierTargetIndex}
                              data-stat-outlier=""
                              data-stat-element=""
                              data-muted={
                                isElementMuted(outlierTargetIndex, seriesId) ? '' : undefined
                              }
                              key={outlier}
                              r="6"
                            />
                          );
                        })}
                      </g>
                    );
                  })
                : null}
            </g>
          </svg>
        </div>
        {showReading ? (
          <StatisticalTooltip
            activeSeriesId={emphasizedSeriesId ?? null}
            pointer={pointerPosition}
            reading={reading}
            svg={svgElement}
          />
        ) : null}
        <div aria-atomic="true" aria-live="polite" data-wcl-chart-reading-announcement="">
          {showReading
            ? [reading.label, ...reading.rows.map((row) => `${row.label}: ${row.value}`)].join('. ')
            : ''}
        </div>
      </div>
    </div>
  );
}

function Prototype(): ReactElement {
  const [accent, setAccent] = useState<AccentColor>('#2878ff');
  const [appearance, setAppearance] = useState<Appearance>(initialAppearance);
  const [chartKind, setChartKind] = useState<ChartKind>(initialChartKind);
  const [encoding, setEncoding] = useState<Encoding>(initialEncoding);
  const [identifyRegions, setIdentifyRegions] = useState(false);
  const [regionSize, setRegionSize] = useState<RegionSize>(initialRegionSize);
  const [stressOverlap, setStressOverlap] = useState(query.get('overlap') !== 'false');
  const style: PrototypeStyles = {
    '--prototype-axis-font-size': regionSize === 'wide' ? '9px' : '23px',
    '--prototype-region-width': regionSize === 'wide' ? '64rem' : '24rem',
  };

  return (
    <AppearanceProvider accent={accent} appearance={appearance}>
      <main className="prototype" data-identify={identifyRegions} style={style}>
        <header className="prototype-header">
          <div>
            <span className="prototype-kicker">Non-production prototype</span>
            <h1>How statistical charts carry meaning</h1>
            <p>
              Choose a chart to see what each mark means. Then compare translucent and solid marks
              without changing the data.
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
            label="Chart"
            onChange={setChartKind}
            options={chartOptions}
            value={chartKind}
          />
          <SegmentedControl
            label="Mark treatment"
            onChange={setEncoding}
            options={encodingOptions}
            value={encoding}
          />
          <SegmentedControl
            label="Appearance"
            onChange={setAppearance}
            options={appearanceOptions}
            value={appearance}
          />
          <SegmentedControl
            label="Chart region"
            onChange={setRegionSize}
            options={sizeOptions}
            value={regionSize}
          />
          {chartKind === 'scatter' || chartKind === 'bubble' ? (
            <ToggleButton isSelected={stressOverlap} onChange={setStressOverlap} size="compact">
              Add overlapping points
            </ToggleButton>
          ) : (
            <span aria-hidden="true" />
          )}
          <label className="prototype-accent">
            <span>Accent</span>
            <input
              aria-label="Accent color"
              onChange={(event) => setAccent(event.currentTarget.value as AccentColor)}
              type="color"
              value={accent}
            />
          </label>
        </section>

        <EncodingGuide encoding={encoding} />

        <section className="prototype-stage" data-region="stage">
          <span aria-hidden="true" className="prototype-region-label">
            Chart region
          </span>
          <div className="prototype-chart-region">
            <div className="stat-caption">
              <strong>
                {chartKind === 'box'
                  ? 'Recovery time by turbine loop'
                  : chartKind === 'histogram'
                    ? 'Pump restart latency'
                    : chartKind === 'bubble'
                      ? 'Thermal demand and stored energy'
                      : 'Temperature and thermal demand'}
              </strong>
              <span>
                {chartKind === 'box'
                  ? 'Compare the center and spread of recovery times for three turbine loops.'
                  : chartKind === 'histogram'
                    ? 'See which restart latency ranges occurred most often.'
                    : chartKind === 'bubble'
                      ? 'Compare temperature, demand, and stored energy for recorded operating periods.'
                      : 'Compare temperature and demand for recorded operating periods.'}
              </span>
            </div>
            <ChartGuide kind={chartKind} />
            <StatisticalPlot
              encoding={encoding}
              key={`${chartKind}-${stressOverlap}`}
              kind={chartKind}
              regionSize={regionSize}
              stressOverlap={stressOverlap}
            />
          </div>
        </section>
      </main>
    </AppearanceProvider>
  );
}

const root = document.querySelector('#root');
if (root === null) throw new Error('Prototype root is missing.');
createRoot(root).render(<Prototype />);
