import {useChartDataMotion} from './use-chart-data-motion.js';
import {useAnimatedChartDomain} from './use-animated-chart-domain.js';
import {curveLinear, line as createLine} from 'd3-shape';
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
import {chartActivationPointRadius} from './chart-activation.js';
import {useChartInteraction, type InteractionPoint} from './chart-interaction.js';
import {EmptyState} from '../feedback/empty-state.js';
import {Spinner} from '../feedback/spinner.js';
import {
  Feedback,
  assertText,
  axisTickLabel,
  clamp,
  createProjection,
  readAccessor,
  type BoundedChartStyles,
  type ChartTooltipStyles,
} from './cartesian-chart.js';
import type {
  ChartDomainValue,
  SparklinePosition,
  SparklinePositionScale,
  SparklineProps,
  SparklineValue,
} from './chart-types.js';

const sparklineViewWidth = 640;
const sparklineViewHeight = 160;
const sparklinePlot = {bottom: 150, left: 12, right: 628, top: 10} as const;

type SparklineStyles = CSSProperties & {
  '--wcl-chart-aspect-ratio': number;
  '--wcl-chart-line-width': string;
  '--wcl-chart-minimum-height': string;
  '--wcl-chart-minimum-width': string;
  '--wcl-chart-point-radius': string;
};

interface PreparedRow<Position extends ChartDomainValue> {
  readonly index: number;
  readonly position: Position;
  readonly value: number | undefined;
}

interface SparklineModel<Position extends ChartDomainValue> {
  readonly firstIndex: number | null;
  readonly highest: number | undefined;
  readonly invalidCount: number;
  readonly lastIndex: number | null;
  readonly lowest: number | undefined;
  readonly rows: readonly PreparedRow<Position>[];
}

interface Reading {
  readonly index: number;
  readonly pointer?: {readonly x: number; readonly y: number};
}

type SparklineCue = 'current' | 'highest' | 'lowest' | 'range';

function circleSegmentPath(
  centerX: number,
  centerY: number,
  radius: number,
  half: 'bottom' | 'top',
  chordOffset: number,
  largeArc = false,
): string {
  const chordY = centerY + chordOffset;
  const halfWidth = Math.sqrt(Math.max(0, radius ** 2 - chordOffset ** 2));
  const sweep = half === 'top' ? 1 : 0;
  return `M ${centerX - halfWidth} ${chordY} A ${radius} ${radius} 0 ${largeArc ? 1 : 0} ${sweep} ${centerX + halfWidth} ${chordY} L ${centerX - halfWidth} ${chordY} Z`;
}

function positionKey(value: ChartDomainValue): string {
  return value instanceof Date ? `date:${value.toISOString()}` : `${typeof value}:${String(value)}`;
}

function isPositionValue<Position extends ChartDomainValue>(
  value: unknown,
  scale: SparklinePositionScale<Position>,
): value is Position {
  if (scale.type === 'time') return value instanceof Date && Number.isFinite(value.getTime());
  if (scale.type === 'linear') return typeof value === 'number' && Number.isFinite(value);
  if (scale.type === 'logarithmic') {
    return typeof value === 'number' && Number.isFinite(value) && value > 0;
  }
  return (
    (typeof value === 'string' && value.length > 0) ||
    (typeof value === 'number' && Number.isFinite(value)) ||
    (value instanceof Date && Number.isFinite(value.getTime()))
  );
}

function validateScale<Position extends ChartDomainValue>(
  scale: SparklinePositionScale<Position>,
): void {
  if (!['categorical', 'linear', 'logarithmic', 'time'].includes(scale.type)) {
    throw new Error('Sparkline position scale type is invalid.');
  }
  if (scale.type === 'categorical' && scale.domain !== undefined) {
    if (
      scale.domain.length === 0 ||
      !scale.domain.every((value) => isPositionValue(value, scale))
    ) {
      throw new Error('Sparkline categorical position domain must contain valid values.');
    }
    if (new Set(scale.domain.map(positionKey)).size !== scale.domain.length) {
      throw new Error('Sparkline categorical position domain values must be unique.');
    }
  }
  if (scale.type === 'time' && scale.domain !== undefined) {
    if (
      !scale.domain.every((value) => Number.isFinite(value.getTime())) ||
      scale.domain[0] >= scale.domain[1]
    ) {
      throw new Error('Sparkline time position domain must contain two ascending finite dates.');
    }
  }
  if ((scale.type === 'linear' || scale.type === 'logarithmic') && scale.domain !== undefined) {
    if (!scale.domain.every(Number.isFinite) || scale.domain[0] >= scale.domain[1]) {
      throw new Error(
        'Sparkline numeric position domain must contain two ascending finite values.',
      );
    }
    if (scale.type === 'logarithmic' && scale.domain[0] <= 0) {
      throw new Error('Sparkline logarithmic position domain must be positive.');
    }
  }
  if (
    scale.type === 'logarithmic' &&
    scale.base !== undefined &&
    (!Number.isFinite(scale.base) || scale.base <= 0 || scale.base === 1)
  ) {
    throw new Error('Sparkline logarithmic position scale base must be positive and not one.');
  }
}

function validateProps<Datum extends object, Position extends ChartDomainValue>(
  props: SparklineProps<Datum, Position>,
): void {
  assertText(props.title, 'Sparkline title');
  assertText(props.description, 'Sparkline description');
  assertText(props.dataTableLabel, 'Sparkline data-table label');
  assertText(props.position.label, 'Sparkline position label');
  assertText(props.value.label, 'Sparkline value label');
  assertText(props.labels.first, 'Sparkline first label');
  assertText(props.labels.last, 'Sparkline last label');
  assertText(props.labels.lowest, 'Sparkline lowest label');
  assertText(props.labels.highest, 'Sparkline highest label');
  assertText(props.labels.missing, 'Sparkline missing label');
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
    throw new Error('Sparkline aspectRatio must be a positive finite number.');
  }
  if (
    props.minimumSize !== undefined &&
    (!Number.isFinite(props.minimumSize.width) ||
      !Number.isFinite(props.minimumSize.height) ||
      props.minimumSize.width <= 0 ||
      props.minimumSize.height <= 0)
  ) {
    throw new Error('Sparkline minimumSize dimensions must be positive finite numbers.');
  }
  if (
    props.valueRange !== undefined &&
    (!props.valueRange.every(Number.isFinite) || props.valueRange[0] >= props.valueRange[1])
  ) {
    throw new Error('Sparkline valueRange must contain two ascending finite numbers.');
  }
  validateScale(props.position.scale);
}

function prepareModel<Datum extends object, Position extends ChartDomainValue>(
  props: SparklineProps<Datum, Position>,
): SparklineModel<Position> {
  validateProps(props);
  const rows: PreparedRow<Position>[] = [];
  let invalidCount = 0;
  props.data.forEach((datum, index) => {
    const position = readAccessor(props.position.accessor, datum, index);
    const value = readAccessor(props.value.accessor, datum, index);
    const inCategoricalDomain =
      props.position.scale.type !== 'categorical' ||
      props.position.scale.domain === undefined ||
      (isPositionValue(position, props.position.scale) &&
        props.position.scale.domain.some((item) => positionKey(item) === positionKey(position)));
    if (
      !isPositionValue(position, props.position.scale) ||
      !inCategoricalDomain ||
      (value !== null &&
        value !== undefined &&
        (typeof value !== 'number' || !Number.isFinite(value)))
    ) {
      invalidCount += 1;
      return;
    }
    rows.push({index, position, value: value ?? undefined});
  });
  const numericRows = rows.filter(
    (row): row is PreparedRow<Position> & {readonly value: number} => row.value !== undefined,
  );
  let lowest: number | undefined;
  let highest: number | undefined;
  for (const row of numericRows) {
    lowest = lowest === undefined ? row.value : Math.min(lowest, row.value);
    highest = highest === undefined ? row.value : Math.max(highest, row.value);
  }
  return {
    firstIndex: numericRows[0] === undefined ? null : rows.indexOf(numericRows[0]),
    highest,
    invalidCount,
    lastIndex:
      numericRows[numericRows.length - 1] === undefined
        ? null
        : rows.indexOf(numericRows[numericRows.length - 1]!),
    lowest,
    rows,
  };
}

function formatPosition<Datum extends object, Position extends ChartDomainValue>(
  value: Position,
  position: SparklinePosition<Datum, Position>,
): string {
  const formatted = axisTickLabel(value, {
    ...(position.formatValue === undefined ? {} : {formatTick: position.formatValue}),
    scale: position.scale,
  });
  const unit = position.unit?.trim();
  return unit === undefined || unit.length === 0 || formatted.trimEnd().endsWith(unit)
    ? formatted
    : `${formatted} ${unit}`;
}

function formatValue<Datum extends object>(
  value: number,
  configuration: SparklineValue<Datum>,
): string {
  const formatted =
    configuration.formatValue?.(value) ?? axisTickLabel(value, {scale: {type: 'linear'}});
  const unit = configuration.unit?.trim();
  return unit === undefined || unit.length === 0 || formatted.trimEnd().endsWith(unit)
    ? formatted
    : `${formatted} ${unit}`;
}

function numericExtent(values: readonly number[]): readonly [number, number] {
  let minimum = values[0] ?? 0;
  let maximum = values[0] ?? 1;
  for (const value of values.slice(1)) {
    minimum = Math.min(minimum, value);
    maximum = Math.max(maximum, value);
  }
  return [minimum, maximum];
}

function stableLinearPosition(
  value: number,
  domain: readonly [number, number],
  range: readonly [number, number],
): number {
  if (domain[0] === domain[1]) return (range[0] + range[1]) / 2;
  const magnitude = Math.max(Math.abs(value), Math.abs(domain[0]), Math.abs(domain[1]));
  if (magnitude === 0) return (range[0] + range[1]) / 2;
  const start = domain[0] / magnitude;
  const end = domain[1] / magnitude;
  const ratio = clamp(0, (value / magnitude - start) / (end - start), 1);
  return range[0] + ratio * (range[1] - range[0]);
}

function svgViewport(svg: SVGSVGElement): {
  readonly left: number;
  readonly scale: number;
  readonly top: number;
} {
  const bounds = svg.getBoundingClientRect();
  const scale = Math.min(bounds.width / sparklineViewWidth, bounds.height / sparklineViewHeight);
  if (!Number.isFinite(scale) || scale <= 0) return {left: 0, scale: 1, top: 0};
  return {
    left: bounds.left + (bounds.width - sparklineViewWidth * scale) / 2,
    scale,
    top: bounds.top + (bounds.height - sparklineViewHeight * scale) / 2,
  };
}

function viewPointFromPointer(
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

function clientPointFromView(
  svg: SVGSVGElement | null,
  x: number,
  y: number,
): {readonly x: number; readonly y: number} {
  if (svg === null) return {x, y};
  const viewport = svgViewport(svg);
  return {x: viewport.left + x * viewport.scale, y: viewport.top + y * viewport.scale};
}

function SparklineTooltip<Datum extends object, Position extends ChartDomainValue>({
  anchor,
  highest,
  lowest,
  portalTarget,
  props,
  row,
}: {
  readonly anchor: {readonly x: number; readonly y: number};
  readonly highest: number;
  readonly lowest: number;
  readonly portalTarget: Element | null;
  readonly props: SparklineProps<Datum, Position>;
  readonly row: PreparedRow<Position>;
}): ReactElement | null {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({height: 76, width: 196});
  useLayoutEffect(() => {
    const bounds = tooltipRef.current?.getBoundingClientRect();
    if (bounds !== undefined && bounds.width > 0 && bounds.height > 0) {
      setSize({height: bounds.height, width: bounds.width});
    }
  }, [highest, lowest, row]);
  if (portalTarget === null) return null;
  const viewportWidth = typeof window === 'undefined' ? sparklineViewWidth : window.innerWidth;
  const viewportHeight = typeof window === 'undefined' ? sparklineViewHeight : window.innerHeight;
  const gap = 12;
  const padding = 8;
  const after = viewportWidth - anchor.x - gap;
  const before = anchor.x - gap;
  const horizontalPlacement = after >= size.width || after >= before ? 'start' : 'end';
  const preferredLeft =
    horizontalPlacement === 'start' ? anchor.x + gap : anchor.x - gap - size.width;
  const style: ChartTooltipStyles = {
    '--wcl-chart-tooltip-left': `${clamp(padding, preferredLeft, Math.max(padding, viewportWidth - size.width - padding))}px`,
    '--wcl-chart-tooltip-y': `${anchor.y}px`,
  };
  const extremeLabels =
    row.value === undefined
      ? []
      : [
          ...(row.value === lowest ? [props.labels.lowest] : []),
          ...(row.value === highest ? [props.labels.highest] : []),
        ];
  return createPortal(
    <div data-wcl-chart-tooltip-layer="">
      <div
        data-horizontal-placement={horizontalPlacement}
        data-vertical-placement={
          anchor.y < size.height / 2 + gap
            ? 'start'
            : anchor.y + size.height / 2 + gap > viewportHeight
              ? 'end'
              : 'center'
        }
        data-wcl-chart-tooltip=""
        ref={tooltipRef}
        role="tooltip"
        style={style}
      >
        <strong>{formatPosition(row.position, props.position)}</strong>
        <dl>
          <div>
            <dt>
              <svg
                aria-hidden="true"
                data-color="accent"
                data-wcl-chart-tooltip-swatch=""
                focusable="false"
                viewBox="0 0 20 8"
              >
                <line data-wcl-chart-legend-line="" x1="0" x2="20" y1="4" y2="4" />
              </svg>
              {props.value.label}
            </dt>
            <dd>
              {row.value === undefined ? props.labels.missing : formatValue(row.value, props.value)}
            </dd>
          </div>
        </dl>
        {extremeLabels.length === 0 ? null : (
          <p data-wcl-sparkline-tooltip-extreme="">{extremeLabels.join(', ')}</p>
        )}
      </div>
    </div>,
    portalTarget,
  );
}

function SparklineTable<Datum extends object, Position extends ChartDomainValue>({
  model,
  props,
}: {
  readonly model: SparklineModel<Position>;
  readonly props: SparklineProps<Datum, Position>;
}): ReactElement {
  const positionUnit = props.position.unit === undefined ? '' : ` (${props.position.unit})`;
  const valueUnit = props.value.unit === undefined ? '' : ` (${props.value.unit})`;
  return (
    <table aria-label={props.dataTableLabel} data-wcl-chart-table="">
      <thead>
        <tr>
          <th scope="col">{`${props.position.label}${positionUnit}`}</th>
          <th scope="col">{`${props.value.label}${valueUnit}`}</th>
        </tr>
      </thead>
      <tbody>
        {model.rows.map((row) => (
          <tr key={row.index}>
            <th scope="row">{formatPosition(row.position, props.position)}</th>
            <td>
              {row.value === undefined ? props.labels.missing : formatValue(row.value, props.value)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Sparkline<Datum extends object, Position extends ChartDomainValue>(
  props: SparklineProps<Datum, Position>,
): ReactElement {
  const sourceModel = prepareModel(props);
  const status = props.status ?? {kind: 'ready'};
  const minimumSize = props.minimumSize ?? {height: 48, width: 240};
  const aspectRatio = props.aspectRatio ?? 6;
  const pointerFocus = useRef(false);
  const titleId = useId();
  const descriptionId = useId();
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);
  const [frameElement, setFrameElement] = useState<HTMLDivElement | null>(null);
  const [svgElement, setSvgElement] = useState<SVGSVGElement | null>(null);
  const [availableWidth, setAvailableWidth] = useState<number>();
  const [keyboardReading, setKeyboardReading] = useState<Reading | null>(null);
  const [pointerReading, setPointerReading] = useState<Reading | null>(null);
  const [touchReading, setTouchReading] = useState<Reading | null>(null);
  const modelIdentity = JSON.stringify([
    status.kind,
    sourceModel.invalidCount,
    props.position.scale,
    props.valueRange,
    sourceModel.rows.map((row) => [positionKey(row.position), row.value ?? null]),
  ]);
  const [retainedModelIdentity, setRetainedModelIdentity] = useState(modelIdentity);
  if (retainedModelIdentity !== modelIdentity) {
    setRetainedModelIdentity(modelIdentity);
    setKeyboardReading(null);
    setPointerReading(null);
    setTouchReading(null);
  }
  const activeReading = pointerReading ?? touchReading ?? keyboardReading;
  const renderedWidth = availableWidth ?? minimumSize.width;
  const renderedHeight = Math.max(minimumSize.height, renderedWidth / aspectRatio);
  const viewScale = Math.max(
    Math.min(renderedWidth / sparklineViewWidth, renderedHeight / sparklineViewHeight),
    Number.EPSILON,
  );
  const interaction = props.interaction;
  const rowIds = interaction
    ? sourceModel.rows.map((row) => interaction.getRowId(props.data[row.index]!))
    : [];
  if (
    rowIds.some((id) => typeof id !== 'string' || !id.trim()) ||
    new Set(rowIds).size !== rowIds.length
  ) {
    throw new Error(
      'Sparkline interaction getRowId must return a unique nonempty string for every prepared record.',
    );
  }
  const motionIds = sourceModel.rows.map((row, index) =>
    interaction ? rowIds[index]! : positionKey(row.position),
  );
  const uniqueMotionIds = new Set(motionIds).size === motionIds.length;
  const motionResetKey = JSON.stringify([
    status.kind,
    sourceModel.invalidCount,
    props.position.scale,
    props.valueRange,
    renderedWidth,
    renderedHeight,
    uniqueMotionIds,
    sourceModel.rows.map((row, index) => [motionIds[index], row.position, row.value === undefined]),
  ]);
  const motionEnabled =
    uniqueMotionIds &&
    sourceModel.firstIndex !== null &&
    status.kind !== 'loading' &&
    status.kind !== 'error';
  const targets = sourceModel.rows.map((row, index) => {
    const current = index === sourceModel.lastIndex;
    const lowest = row.value !== undefined && row.value === sourceModel.lowest;
    const highest = row.value !== undefined && row.value === sourceModel.highest;
    return {
      id: uniqueMotionIds ? motionIds[index]! : String(index),
      value: {
        value: row.value,
        current: current ? 1 : 0,
        lowest: !current && lowest && !highest ? 1 : 0,
        highest: !current && highest && !lowest ? 1 : 0,
        range: !current && lowest && highest ? 1 : 0,
      },
    };
  });
  const motion = useChartDataMotion(targets, {
    version: JSON.stringify(targets),
    resetKey: motionResetKey,
    enabled: motionEnabled,
    interpolate: (from, to, progress) => ({
      value:
        from.value === undefined || to.value === undefined
          ? to.value
          : (1 - progress) * from.value + progress * to.value,
      current: from.current + (to.current - from.current) * progress,
      lowest: from.lowest + (to.lowest - from.lowest) * progress,
      highest: from.highest + (to.highest - from.highest) * progress,
      range: from.range + (to.range - from.range) * progress,
    }),
  });
  const displayById = new Map(
    motion.filter((item) => !item.exiting).map((item) => [item.id, item.value]),
  );
  const model = {
    ...sourceModel,
    rows: sourceModel.rows.map((row, index) => ({
      ...row,
      ...displayById.get(targets[index]!.id),
    })),
  };
  const displayValueDomain = useAnimatedChartDomain(
    props.valueRange ??
      numericExtent(
        sourceModel.rows.flatMap((row) => (row.value === undefined ? [] : [row.value])),
      ),
    motionEnabled,
    false,
    motionResetKey,
  );
  const activeRow = activeReading === null ? undefined : model.rows[activeReading.index];
  const sourceActiveRow =
    activeReading === null ? undefined : sourceModel.rows[activeReading.index];
  const actions = useChartInteraction(
    interaction
      ? {
          target: 'category',
          ...(interaction.selection ? {selection: interaction.selection} : {}),
          ...(interaction.onActivate
            ? {
                onActivate: (event: {
                  item: {rowId: string};
                  datum: Datum;
                  category: Position;
                  values: readonly {value: number}[];
                  input: 'pointer' | 'keyboard' | 'touch';
                }) => {
                  interaction.onActivate?.({
                    item: {rowId: event.item.rowId},
                    datum: event.datum,
                    position: event.category,
                    value: event.values[0]!.value,
                    input: event.input,
                  });
                },
              }
            : {}),
        }
      : undefined,
    sourceModel.rows.flatMap((row, index) =>
      row.value === undefined || !interaction
        ? []
        : [
            {
              id: rowIds[index]!,
              category: row.position,
              datum: props.data[row.index]!,
              values: [{seriesId: '', label: props.value.label, value: row.value, hidden: false}],
            },
          ],
    ),
    JSON.stringify([
      modelIdentity,
      rowIds,
      renderedWidth,
      renderedHeight,
      !!interaction?.onActivate,
    ]),
    props.data,
  );
  const selectedIds = new Set(actions.selected.map((item) => item.rowId));
  const frameStyle: SparklineStyles = {
    '--wcl-chart-aspect-ratio': aspectRatio,
    '--wcl-chart-line-width': '2.25px',
    '--wcl-chart-minimum-height': `${minimumSize.height}px`,
    '--wcl-chart-minimum-width': `${minimumSize.width}px`,
    '--wcl-chart-point-radius': `${4.5 / viewScale}px`,
  };
  const rootStyle: BoundedChartStyles = {
    '--wcl-chart-minimum-width': `${minimumSize.width}px`,
  };

  useEffect(() => {
    if (frameElement === null) return;
    const measure = (): void => {
      const width = frameElement.clientWidth;
      if (width > 0) setAvailableWidth((current) => (current === width ? current : width));
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
    const dismiss = (event: globalThis.PointerEvent): void => {
      if (event.target instanceof Node && !rootElement?.contains(event.target))
        setTouchReading(null);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [rootElement, touchReading]);

  let content: ReactNode;
  if (status.kind === 'loading') {
    content = (
      <div data-wcl-chart-feedback="">
        <Spinner isActive label={status.label} />
      </div>
    );
  } else if (status.kind === 'error') {
    content = <Feedback copy={status} kind="error" />;
  } else if (props.data.length === 0) {
    content = (
      <EmptyState
        description={props.emptyState.description}
        kind="no-data"
        title={props.emptyState.title}
      />
    );
  } else if (model.firstIndex === null) {
    content = (
      <>
        <EmptyState
          description={props.invalidData.description}
          kind="unavailable"
          title={props.invalidData.title}
        />
        {model.rows.length === 0 ? null : <SparklineTable model={sourceModel} props={props} />}
      </>
    );
  } else {
    const positionProjection =
      props.position.scale.type === 'categorical'
        ? createProjection(
            props.position.scale,
            model.rows.map((row) => row.position),
            [sparklinePlot.left, sparklinePlot.right],
            6,
            false,
          )
        : undefined;
    const numericPositions = model.rows.flatMap((row) =>
      typeof row.position === 'number' ? [row.position] : [],
    );
    const positionDomain =
      props.position.scale.type === 'linear'
        ? (props.position.scale.domain ?? numericExtent(numericPositions))
        : undefined;
    const logarithmicDomain =
      props.position.scale.type === 'logarithmic'
        ? (props.position.scale.domain ?? numericExtent(numericPositions))
        : undefined;
    const timePositions = model.rows.flatMap((row) =>
      row.position instanceof Date ? [row.position.getTime()] : [],
    );
    const timeDomain =
      props.position.scale.type === 'time'
        ? props.position.scale.domain === undefined
          ? numericExtent(timePositions)
          : ([
              props.position.scale.domain[0].getTime(),
              props.position.scale.domain[1].getTime(),
            ] as const)
        : undefined;
    const valueDomain = displayValueDomain;
    const projectPosition = (row: PreparedRow<Position>): number => {
      if (positionDomain !== undefined && typeof row.position === 'number') {
        return stableLinearPosition(row.position, positionDomain, [
          sparklinePlot.left,
          sparklinePlot.right,
        ]);
      }
      if (logarithmicDomain !== undefined && typeof row.position === 'number') {
        return stableLinearPosition(
          Math.log(row.position),
          [Math.log(logarithmicDomain[0]), Math.log(logarithmicDomain[1])],
          [sparklinePlot.left, sparklinePlot.right],
        );
      }
      if (timeDomain !== undefined && row.position instanceof Date) {
        return stableLinearPosition(row.position.getTime(), timeDomain, [
          sparklinePlot.left,
          sparklinePlot.right,
        ]);
      }
      return clamp(
        sparklinePlot.left,
        positionProjection?.position(row.position) ?? sparklinePlot.left,
        sparklinePlot.right,
      );
    };
    const projectValue = (value: number | undefined): number | undefined => {
      if (value === undefined) return undefined;
      return stableLinearPosition(value, valueDomain, [sparklinePlot.bottom, sparklinePlot.top]);
    };
    const path = createLine<PreparedRow<Position>>()
      .defined((row) => row.value !== undefined)
      .x(projectPosition)
      .y((row) => projectValue(row.value) ?? sparklinePlot.bottom)
      .curve(curveLinear)(model.rows);
    const cueRadius = clamp(4.5, renderedWidth / 90, 6) / viewScale;
    const cueFillInset = 0.75 / viewScale;
    const isolatedRadius = clamp(2.5, renderedWidth / 150, 3.25) / viewScale;
    const cueFor = (index: number): SparklineCue | undefined => {
      if (index === model.lastIndex) return 'current';
      const isLowest = sourceModel.rows[index]!.value === sourceModel.lowest;
      const isHighest = sourceModel.rows[index]!.value === sourceModel.highest;
      if (isLowest && isHighest) return 'range';
      if (isLowest) return 'lowest';
      if (isHighest) return 'highest';
      return undefined;
    };
    const points: InteractionPoint[] = model.rows.flatMap((row, index) =>
      row.value === undefined || !interaction
        ? []
        : [
            {
              index,
              item: {rowId: rowIds[index]!},
              seriesId: '',
              categoryPosition: projectPosition(row),
              x: projectPosition(row),
              y: projectValue(row.value)!,
            },
          ],
    );
    const pointForReading = (reading: Reading | null) =>
      reading === null ? undefined : points.find((point) => point.index === reading.index);
    const anchorFor = (reading: Reading): {readonly x: number; readonly y: number} => {
      const row = model.rows[reading.index]!;
      return (
        reading.pointer ??
        clientPointFromView(
          svgElement,
          projectPosition(row),
          projectValue(row.value) ?? (sparklinePlot.top + sparklinePlot.bottom) / 2,
        )
      );
    };
    const nearestIndex = (coordinate: number): number => {
      let result = 0;
      let distance = Number.POSITIVE_INFINITY;
      model.rows.forEach((row, index) => {
        const candidate = Math.abs(projectPosition(row) - coordinate);
        if (candidate < distance) {
          result = index;
          distance = candidate;
        }
      });
      return result;
    };
    const readingFromPointer = (
      event: PointerEvent<SVGSVGElement>,
      followPointer: boolean,
    ): Reading | null => {
      const point = viewPointFromPointer(event.currentTarget, event.clientX, event.clientY);
      if (
        point.x < sparklinePlot.left ||
        point.x > sparklinePlot.right ||
        point.y < sparklinePlot.top ||
        point.y > sparklinePlot.bottom
      ) {
        return null;
      }
      return {
        index: nearestIndex(point.x),
        ...(followPointer ? {pointer: {x: event.clientX, y: event.clientY}} : {}),
      };
    };
    const focusChart = (event: FocusEvent<HTMLDivElement>): void => {
      if (
        !pointerFocus.current &&
        event.currentTarget === event.target &&
        keyboardReading === null
      ) {
        setKeyboardReading({index: 0});
      }
    };
    const readWithKeyboard = (event: KeyboardEvent<HTMLDivElement>): void => {
      if (event.target !== event.currentTarget) return;
      if (interaction && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        const point = pointForReading(activeReading);
        if (point) actions.activate(point.item, 'keyboard', event.ctrlKey || event.metaKey);
        return;
      }
      const previous = keyboardReading?.index ?? activeReading?.index ?? 0;
      let next: number | null = null;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = model.rows.length - 1;
      if (event.key === 'ArrowLeft') next = Math.max(0, previous - 1);
      if (event.key === 'ArrowRight') next = Math.min(model.rows.length - 1, previous + 1);
      if (event.key === 'Escape') {
        actions.cancel();
        event.preventDefault();
        setKeyboardReading(null);
        setPointerReading(null);
        setTouchReading(null);
        return;
      }
      if (next === null) return;
      event.preventDefault();
      setKeyboardReading({index: next});
      setPointerReading(null);
      setTouchReading(null);
    };
    const firstRow = sourceModel.rows[sourceModel.firstIndex!]!;
    const lastRow = sourceModel.rows[sourceModel.lastIndex!]!;
    const readingAnnouncement =
      activeRow === undefined
        ? ''
        : `${formatPosition(activeRow.position, props.position)}. ${props.value.label}: ${
            activeRow.value === undefined
              ? props.labels.missing
              : formatValue(sourceActiveRow!.value!, props.value)
          }`;
    const renderReadingNode = (): ReactNode => {
      if (actions.box || activeReading === null || activeRow?.value === undefined) return null;
      const activeCue = cueFor(activeReading.index);
      if (activeCue === 'range') return null;
      const centerX = projectPosition(activeRow);
      const centerY = projectValue(activeRow.value)!;
      if (activeCue === 'highest' || activeCue === 'lowest') {
        const openHalf = activeCue === 'highest' ? 'bottom' : 'top';
        const chordOffset = activeCue === 'highest' ? -cueFillInset : cueFillInset;
        return (
          <path
            d={circleSegmentPath(centerX, centerY, cueRadius, openHalf, chordOffset, true)}
            data-wcl-chart-reading-node=""
            data-wcl-sparkline-reading-fill={openHalf}
            data-wcl-sparkline-reading-node="complete"
          />
        );
      }
      return (
        <circle
          cx={centerX}
          cy={centerY}
          data-wcl-chart-reading-node=""
          data-wcl-sparkline-reading-fill={activeCue === undefined ? undefined : 'full'}
          data-wcl-sparkline-reading-node={activeCue === undefined ? 'ordinary' : 'complete'}
          r={activeCue === undefined ? 4.5 : cueRadius}
        />
      );
    };
    content = (
      <>
        {status.kind === 'partial' ? <Feedback copy={status} kind="partial" /> : null}
        {model.invalidCount > 0 ? <Feedback copy={props.invalidData} kind="invalid" /> : null}
        <div
          data-overflow="clip"
          data-wcl-chart-frame=""
          data-wcl-sparkline-frame=""
          ref={setFrameElement}
        >
          <div
            aria-describedby={interaction?.selection ? `${descriptionId}-selection` : undefined}
            aria-keyshortcuts={
              interaction
                ? 'ArrowLeft ArrowRight Home End Escape Enter Space Control+Enter Meta+Enter Control+Space Meta+Space'
                : 'ArrowLeft ArrowRight Home End Escape'
            }
            aria-labelledby={titleId}
            data-wcl-chart-canvas=""
            data-wcl-sparkline-canvas=""
            data-interactive={interaction ? '' : undefined}
            onBlur={(event) => {
              if (!(
                event.relatedTarget instanceof Node &&
                event.currentTarget.contains(event.relatedTarget)
              )) {
                actions.cancel();
                setKeyboardReading(null);
              }
            }}
            onFocus={focusChart}
            onKeyDown={readWithKeyboard}
            role="group"
            style={frameStyle}
            tabIndex={0}
          >
            <svg
              aria-hidden="true"
              data-wcl-chart-svg=""
              data-wcl-sparkline-svg=""
              focusable="false"
              data-selectable={interaction?.selection ? '' : undefined}
              onPointerDown={(event) => {
                if (interaction && (event.button > 0 || event.isPrimary === false)) return;
                if (!interaction && event.pointerType !== 'touch') return;
                const reading = readingFromPointer(event, event.pointerType !== 'touch');
                if (reading === null) return;
                if (interaction) {
                  event.preventDefault();
                  pointerFocus.current = true;
                  event.currentTarget.parentElement?.focus({preventScroll: true});
                  pointerFocus.current = false;
                  const p = viewPointFromPointer(event.currentTarget, event.clientX, event.clientY);
                  actions.begin(event, pointForReading(reading), p.x, p.y);
                }
                setKeyboardReading(null);
                if (event.pointerType === 'touch') {
                  setPointerReading(null);
                  setTouchReading(reading);
                } else {
                  setTouchReading(null);
                  setPointerReading(reading);
                }
              }}
              onPointerUp={(event) =>
                actions.end(event, pointForReading(readingFromPointer(event, false)))
              }
              onPointerCancel={() => {
                actions.cancel();
                setTouchReading(null);
                setPointerReading(null);
              }}
              onLostPointerCapture={() => actions.cancel()}
              onContextMenu={(event) => {
                if (actions.isHolding() || actions.isDragging()) event.preventDefault();
              }}
              onPointerLeave={(event) => {
                if (event.pointerType !== 'touch') setPointerReading(null);
              }}
              onPointerMove={(event) => {
                const p = viewPointFromPointer(event.currentTarget, event.clientX, event.clientY);
                if (actions.move(event, p.x, p.y, points, sparklinePlot)) {
                  setKeyboardReading(null);
                  setPointerReading(null);
                  setTouchReading(null);
                  return;
                }
                if (event.pointerType === 'touch') return;
                setKeyboardReading(null);
                if (interaction) setTouchReading(null);
                setPointerReading(readingFromPointer(event, true));
              }}
              ref={setSvgElement}
              viewBox={`0 0 ${sparklineViewWidth} ${sparklineViewHeight}`}
            >
              <rect
                data-wcl-chart-hit-region=""
                height={sparklinePlot.bottom - sparklinePlot.top}
                width={sparklinePlot.right - sparklinePlot.left}
                x={sparklinePlot.left}
                y={sparklinePlot.top}
              />
              <g data-color="accent" data-wcl-chart-series="" data-wcl-sparkline-series="">
                <path
                  d={path ?? undefined}
                  data-wcl-chart-line-hit-target=""
                  data-wcl-sparkline-line-hit-target=""
                />
                <path d={path ?? undefined} data-wcl-chart-line="" data-wcl-sparkline-line="" />
                {model.rows.map((row, index) => {
                  if (row.value === undefined) return null;
                  const cues = (['current', 'lowest', 'highest', 'range'] as const).filter(
                    (cue) => (row[cue] ?? 0) > 0,
                  );
                  const isIsolated =
                    model.rows[index - 1]?.value === undefined &&
                    model.rows[index + 1]?.value === undefined;
                  if (cues.length === 0) {
                    if (!isIsolated) return null;
                    return (
                      <circle
                        cx={projectPosition(row)}
                        cy={projectValue(row.value)}
                        data-row-index={index}
                        data-wcl-sparkline-isolated=""
                        key={row.index}
                        r={isolatedRadius}
                      />
                    );
                  }
                  const centerX = projectPosition(row);
                  const centerY = projectValue(row.value)!;
                  return cues.map((cue) => (
                    <g
                      data-row-index={index}
                      data-wcl-sparkline-cue={cue}
                      key={`${row.index}-${cue}`}
                      opacity={row[cue]}
                    >
                      <circle
                        cx={centerX}
                        cy={centerY}
                        data-wcl-sparkline-cue-base=""
                        r={cueRadius}
                      />
                      {cue === 'range' ? (
                        <circle
                          cx={centerX}
                          cy={centerY}
                          data-wcl-sparkline-cue-fill="full"
                          r={cueRadius}
                        />
                      ) : cue === 'highest' || cue === 'lowest' ? (
                        <path
                          d={circleSegmentPath(
                            centerX,
                            centerY,
                            cueRadius,
                            cue === 'highest' ? 'top' : 'bottom',
                            cue === 'highest' ? -cueFillInset : cueFillInset,
                          )}
                          data-wcl-sparkline-cue-fill={cue === 'highest' ? 'top' : 'bottom'}
                        />
                      ) : null}
                      <circle
                        cx={centerX}
                        cy={centerY}
                        data-wcl-sparkline-cue-outline=""
                        r={cueRadius}
                      />
                    </g>
                  ));
                })}
              </g>
              {actions.box || activeReading === null || activeRow === undefined ? null : (
                <g data-wcl-chart-reading="" data-wcl-sparkline-reading="">
                  <line
                    data-wcl-chart-reading-needle=""
                    x1={projectPosition(activeRow)}
                    x2={projectPosition(activeRow)}
                    y1={sparklinePlot.top}
                    y2={sparklinePlot.bottom}
                  />
                  {renderReadingNode()}
                </g>
              )}
              <g data-wcl-sparkline-interaction="">
                {interaction?.selection
                  ? points
                      .filter((point) => selectedIds.has(point.item.rowId))
                      .map((point) => {
                        const cue = cueFor(point.index);
                        const radius = cue ? cueRadius : 4.5 / viewScale;
                        return (
                          <g key={point.item.rowId} data-row-id={point.item.rowId}>
                            {cue ? null : (
                              <circle
                                cx={point.x}
                                cy={point.y}
                                r={radius}
                                data-wcl-sparkline-selected-base=""
                                data-active={
                                  activeReading?.index === point.index && !actions.box
                                    ? ''
                                    : undefined
                                }
                              />
                            )}
                            <circle
                              cx={point.x}
                              cy={point.y}
                              r={radius + 2.125 / viewScale}
                              data-wcl-sparkline-selection-ring=""
                            />
                          </g>
                        );
                      })
                  : null}
                {actions.pulse
                  ? points
                      .filter((point) => point.item.rowId === actions.pulse!.item.rowId)
                      .map((point) => (
                        <circle
                          key={actions.pulse!.sequence}
                          cx={point.x}
                          cy={point.y}
                          r={chartActivationPointRadius / viewScale}
                          data-wcl-chart-activation-dot=""
                        />
                      ))
                  : null}
                {actions.box ? (
                  <rect
                    {...actions.box}
                    data-wcl-chart-selection-box=""
                    data-wcl-sparkline-selection-box=""
                  />
                ) : null}
              </g>
            </svg>
            {actions.box || activeReading === null || activeRow === undefined ? null : (
              <SparklineTooltip
                anchor={anchorFor(activeReading)}
                highest={model.highest!}
                lowest={model.lowest!}
                portalTarget={rootElement?.closest('[data-wcl-provider]') ?? rootElement}
                props={props}
                row={sourceActiveRow!}
              />
            )}
          </div>
        </div>
        <dl data-wcl-sparkline-summary="">
          <div data-first-index={model.firstIndex}>
            <dt>{props.labels.first}</dt>
            <dd>{formatValue(firstRow.value!, props.value)}</dd>
          </div>
          <div data-last-index={model.lastIndex}>
            <dt>{props.labels.last}</dt>
            <dd>{formatValue(lastRow.value!, props.value)}</dd>
          </div>
          <div>
            <dt>{props.labels.lowest}</dt>
            <dd>{formatValue(model.lowest!, props.value)}</dd>
          </div>
          <div>
            <dt>{props.labels.highest}</dt>
            <dd>{formatValue(model.highest!, props.value)}</dd>
          </div>
        </dl>
        <p aria-atomic="true" aria-live="polite" data-wcl-chart-reading-announcement="">
          {readingAnnouncement}
        </p>
        <SparklineTable model={sourceModel} props={props} />
      </>
    );
  }

  return (
    <figure
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      data-wcl-chart=""
      data-wcl-sparkline=""
      data-interactive={interaction ? '' : undefined}
      ref={setRootElement}
      style={rootStyle}
    >
      <figcaption data-wcl-chart-caption="">
        <strong id={titleId}>{props.title}</strong>
        <p id={descriptionId}>{props.description}</p>
      </figcaption>
      {content}
      {interaction?.selection ? (
        <div data-wcl-chart-selection="">
          <p id={`${descriptionId}-selection`}>{interaction.selection.labels.instructions}</p>
          <div role="status" aria-atomic="true">
            <p>
              {actions.selected.length
                ? interaction.selection.labels.summary(actions.selected.length)
                : interaction.selection.labels.empty}
            </p>
            {actions.selected.length ? (
              <ul>
                {actions.selected.map((item) => (
                  <li key={item.rowId}>{interaction.selection!.labels.item(item)}</li>
                ))}
              </ul>
            ) : null}
          </div>
          <Button
            variant="quiet"
            isDisabled={!actions.selected.length}
            onPress={() => {
              actions.cancel();
              actions.change([]);
            }}
          >
            {interaction.selection.labels.clear}
          </Button>
        </div>
      ) : null}
    </figure>
  );
}
