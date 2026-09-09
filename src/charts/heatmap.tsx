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
import {
  heatmapKey,
  useHeatmapInteraction,
  HeatmapInteractionFeedback,
  HeatmapSelectionSummary,
  type HeatmapCell,
} from './heatmap-interaction.js';

import {EmptyState} from '../feedback/empty-state.js';
import {Spinner} from '../feedback/spinner.js';
import {useScrollbarActivity} from '../scrollbar-activity.js';
import {
  Feedback,
  assertText,
  clamp,
  estimatedUtilityTextWidth,
  readAccessor,
  type BoundedChartStyles,
  type ChartTooltipStyles,
} from './cartesian-chart.js';
import type {HeatmapDomainItem, HeatmapProps, HeatmapScale, HeatmapValue} from './chart-types.js';

type HeatmapStyles = CSSProperties & {
  '--wcl-chart-aspect-ratio': number;
  '--wcl-chart-minimum-height': string;
  '--wcl-chart-minimum-width': string;
  '--wcl-heatmap-columns': number;
  '--wcl-heatmap-cell-minimum-width': string;
  '--wcl-heatmap-grid-height': string;
  '--wcl-heatmap-grid-width': string;
  '--wcl-heatmap-header-height': string;
  '--wcl-heatmap-midpoint-position': string;
  '--wcl-heatmap-row-label-width': string;
  '--wcl-heatmap-row-height': string;
  '--wcl-heatmap-rows': number;
};

type CellStyles = CSSProperties & {'--wcl-heatmap-intensity': string};
type HeatmapRootStyles = BoundedChartStyles & {
  '--wcl-heatmap-high-color': string;
  '--wcl-heatmap-low-color': string;
};

interface PreparedCell extends HeatmapCell {
  readonly columnIndex: number;
  readonly index: number;
  readonly rowIndex: number;
  readonly range: 'high' | 'low';
  readonly ratio: number;
  readonly value: number | undefined;
}

interface HeatmapModel {
  readonly cells: readonly PreparedCell[];
  readonly domain: readonly [number, number];
  readonly hasNumericKey: boolean;
  readonly invalidCount: number;
  readonly midpointPosition: number;
}

function formatHeatmapValue<Datum extends object>(
  value: number,
  configuration: HeatmapValue<Datum>,
): string {
  const formatted = configuration.formatValue?.(value) ?? String(value);
  const unit = configuration.unit?.trim();
  if (unit === undefined || unit.length === 0 || formatted.trimEnd().endsWith(unit)) {
    return formatted;
  }
  return `${formatted} ${unit}`;
}

function validateDomain(items: readonly HeatmapDomainItem[], name: 'row' | 'column'): Set<string> {
  const ids = new Set<string>();
  for (const item of items) {
    assertText(item.id, `Heatmap ${name} id`);
    assertText(item.label, `Heatmap ${name} label`);
    if (ids.has(item.id)) throw new Error(`Heatmap ${name} id "${item.id}" is duplicated.`);
    ids.add(item.id);
  }
  return ids;
}

function validateScale(scale: HeatmapScale): void {
  if (scale.type !== 'sequential' && scale.type !== 'two-sided') {
    throw new Error('Heatmap scale type must be "sequential" or "two-sided".');
  }
  if (scale.type === 'two-sided' && !Number.isFinite(scale.midpoint)) {
    throw new Error('Heatmap scale midpoint must be finite.');
  }
  if (scale.type === 'sequential') {
    assertText(scale.color, 'Heatmap sequential color');
  } else {
    if (!Array.isArray(scale.colors) || scale.colors.length !== 2) {
      throw new Error('Heatmap two-sided scale must contain exactly two colors.');
    }
    assertText(scale.colors[0], 'Heatmap low color');
    assertText(scale.colors[1], 'Heatmap high color');
  }
  if (scale.domain === undefined) return;
  const [minimum, maximum] = scale.domain;
  if (!Number.isFinite(minimum) || !Number.isFinite(maximum) || minimum >= maximum) {
    throw new Error('Heatmap scale domain must contain two ascending finite numbers.');
  }
  if (scale.type === 'two-sided' && !(scale.midpoint > minimum && scale.midpoint < maximum)) {
    throw new Error('Heatmap scale midpoint must be inside its fixed domain.');
  }
}

function validateCommon<Datum extends object>(
  props: HeatmapProps<Datum>,
): {
  readonly columnIds: Set<string>;
  readonly rowIds: Set<string>;
} {
  assertText(props.title, 'Heatmap title');
  assertText(props.description, 'Heatmap description');
  assertText(props.dataTableLabel, 'Heatmap data-table label');
  assertText(props.labels.row, 'Heatmap row label');
  assertText(props.labels.column, 'Heatmap column label');
  assertText(props.labels.colorKey, 'Heatmap color-key label');
  assertText(props.labels.missing, 'Heatmap missing label');
  assertText(props.labels.scrollRegion, 'Heatmap scroll-region label');
  assertText(props.value.label, 'Heatmap value label');
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
    throw new Error('Heatmap aspectRatio must be a positive finite number.');
  }
  if (
    props.minimumSize !== undefined &&
    (!Number.isFinite(props.minimumSize.width) ||
      !Number.isFinite(props.minimumSize.height) ||
      props.minimumSize.width <= 0 ||
      props.minimumSize.height <= 0)
  ) {
    throw new Error('Heatmap minimumSize dimensions must be positive finite numbers.');
  }
  validateScale(props.scale);
  return {
    columnIds: validateDomain(props.columns, 'column'),
    rowIds: validateDomain(props.rows, 'row'),
  };
}

function derivedDomain(values: readonly number[], scale: HeatmapScale): readonly [number, number] {
  if (scale.domain !== undefined) return scale.domain;
  if (values.length === 0) {
    return scale.type === 'two-sided' ? [scale.midpoint - 1, scale.midpoint + 1] : [0, 1];
  }
  let minimum = values[0]!;
  let maximum = values[0]!;
  for (const value of values.slice(1)) {
    minimum = Math.min(minimum, value);
    maximum = Math.max(maximum, value);
  }
  if (scale.type === 'sequential') return [minimum, maximum];
  if (minimum !== scale.midpoint || maximum !== scale.midpoint) {
    return [Math.min(minimum, scale.midpoint), Math.max(maximum, scale.midpoint)];
  }
  if (scale.midpoint === 0) return [-1, 1];
  const lower = scale.midpoint > 0 ? scale.midpoint / 2 : scale.midpoint * 1.5;
  const upper = scale.midpoint > 0 ? scale.midpoint * 1.5 : scale.midpoint / 2;
  return [
    Number.isFinite(lower) ? lower : -Number.MAX_VALUE,
    Number.isFinite(upper) ? upper : Number.MAX_VALUE,
  ];
}

function relativePosition(value: number, start: number, end: number): number {
  if (start === end) return 0.5;
  const magnitude = Math.max(Math.abs(value), Math.abs(start), Math.abs(end));
  if (magnitude === 0) return 0.5;
  return clamp(
    0,
    (value / magnitude - start / magnitude) / (end / magnitude - start / magnitude),
    1,
  );
}

function valueEncoding(
  value: number,
  domain: readonly [number, number],
  scale: HeatmapScale,
): Pick<PreparedCell, 'range' | 'ratio'> {
  const [minimum, maximum] = domain;
  if (scale.type === 'sequential') {
    return {
      ratio: minimum === maximum ? 0.62 : relativePosition(value, minimum, maximum),
      range: 'high',
    };
  }
  if (value < scale.midpoint) {
    return {
      ratio: minimum === scale.midpoint ? 0 : 1 - relativePosition(value, minimum, scale.midpoint),
      range: 'low',
    };
  }
  return {
    ratio: maximum === scale.midpoint ? 0 : relativePosition(value, scale.midpoint, maximum),
    range: 'high',
  };
}

function prepareModel<Datum extends object>(props: HeatmapProps<Datum>): HeatmapModel {
  const {columnIds, rowIds} = validateCommon(props);
  const records = new Map<string, Map<string, {value: number | undefined; sourceIndex: number}>>();
  let invalidCount = 0;
  props.data.forEach((datum, sourceIndex) => {
    const rowId = readAccessor(props.rowAccessor, datum, sourceIndex);
    const columnId = readAccessor(props.columnAccessor, datum, sourceIndex);
    if (typeof rowId !== 'string' || !rowIds.has(rowId)) {
      throw new Error(`Heatmap record ${sourceIndex + 1} references an undeclared row.`);
    }
    if (typeof columnId !== 'string' || !columnIds.has(columnId)) {
      throw new Error(`Heatmap record ${sourceIndex + 1} references an undeclared column.`);
    }
    let rowRecords = records.get(rowId);
    if (rowRecords === undefined) {
      rowRecords = new Map();
      records.set(rowId, rowRecords);
    }
    if (rowRecords.has(columnId)) {
      throw new Error(`Heatmap cell for row "${rowId}" and column "${columnId}" is duplicated.`);
    }
    rowRecords.set(columnId, {value: undefined, sourceIndex});
    const value = readAccessor(props.value.accessor, datum, sourceIndex);
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      invalidCount += 1;
      return;
    }
    rowRecords.set(columnId, {value, sourceIndex});
  });
  const values = [...records.values()].flatMap((row) =>
    [...row.values()]
      .map((record) => record.value)
      .filter((value): value is number => value !== undefined),
  );
  const domain = derivedDomain(values, props.scale);
  const midpoint = props.scale.type === 'two-sided' ? props.scale.midpoint : domain[0];
  const midpointPosition =
    domain[0] === domain[1] ? 0.5 : relativePosition(midpoint, domain[0], domain[1]);
  const cells = props.rows.flatMap((row, rowIndex) =>
    props.columns.map((column, columnIndex): PreparedCell => {
      const record = records.get(row.id)?.get(column.id);
      const value = record?.value;
      const encoding =
        value === undefined
          ? {range: 'high' as const, ratio: 0}
          : valueEncoding(value, domain, props.scale);
      return {
        sourceIndex: record?.sourceIndex,
        columnIndex,
        index: rowIndex * props.columns.length + columnIndex,
        ratio: encoding.ratio,
        rowIndex,
        range: encoding.range,
        value,
      };
    }),
  );
  return {
    cells,
    domain,
    hasNumericKey: values.length > 0 || props.scale.domain !== undefined,
    invalidCount,
    midpointPosition,
  };
}

function HeatmapTooltip<Datum extends object>({
  anchor,
  cell,
  portalTarget,
  props,
}: {
  readonly anchor: {readonly x: number; readonly y: number};
  readonly cell: PreparedCell;
  readonly portalTarget: Element | null;
  readonly props: HeatmapProps<Datum>;
}): ReactElement | null {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({height: 128, width: 208});
  useLayoutEffect(() => {
    const bounds = tooltipRef.current?.getBoundingClientRect();
    if (bounds !== undefined && bounds.width > 0 && bounds.height > 0) {
      setSize({height: bounds.height, width: bounds.width});
    }
  }, [cell.index]);
  if (portalTarget === null) return null;
  const viewportWidth = typeof window === 'undefined' ? 480 : window.innerWidth;
  const viewportHeight = typeof window === 'undefined' ? 480 : window.innerHeight;
  const gap = 12;
  const padding = 8;
  const placement = viewportWidth - anchor.x - gap >= size.width ? 'start' : 'end';
  const preferredLeft = placement === 'start' ? anchor.x + gap : anchor.x - gap - size.width;
  const style: ChartTooltipStyles = {
    '--wcl-chart-tooltip-left': `${clamp(padding, preferredLeft, Math.max(padding, viewportWidth - size.width - padding))}px`,
    '--wcl-chart-tooltip-y': `${anchor.y}px`,
  };
  const value =
    cell.value === undefined ? props.labels.missing : formatHeatmapValue(cell.value, props.value);
  return createPortal(
    <div data-wcl-chart-tooltip-layer="">
      <div
        data-horizontal-placement={placement}
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
        <strong>{props.rows[cell.rowIndex]!.label}</strong>
        <dl>
          <div>
            <dt>{props.labels.column}</dt>
            <dd>{props.columns[cell.columnIndex]!.label}</dd>
          </div>
          <div>
            <dt>{props.value.label}</dt>
            <dd>{value}</dd>
          </div>
        </dl>
      </div>
    </div>,
    portalTarget,
  );
}

function HeatmapTable<Datum extends object>({
  model,
  props,
}: {
  readonly model: HeatmapModel;
  readonly props: HeatmapProps<Datum>;
}): ReactElement {
  return (
    <table aria-label={props.dataTableLabel} data-wcl-chart-table="">
      <thead>
        <tr>
          <th scope="col">{`${props.labels.row}, ${props.labels.column}`}</th>
          {props.columns.map((column) => (
            <th key={column.id} scope="col">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.rows.map((row, rowIndex) => (
          <tr key={row.id}>
            <th scope="row">{row.label}</th>
            {props.columns.map((column, columnIndex) => {
              const cell = model.cells[rowIndex * props.columns.length + columnIndex]!;
              return (
                <td key={column.id}>
                  {cell.value === undefined
                    ? props.labels.missing
                    : formatHeatmapValue(cell.value, props.value)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Heatmap<Datum extends object>(props: HeatmapProps<Datum>): ReactElement {
  const model = prepareModel(props);
  const [canvasElement, setCanvasElement] = useState<HTMLDivElement | null>(null);
  const pointerFocus = useRef(false);
  const status = props.status ?? {kind: 'ready'};
  const minimumSize = props.minimumSize ?? {height: 180, width: 320};
  const titleId = useId();
  const descriptionId = useId();
  const scrollbarActivityProps = useScrollbarActivity<HTMLDivElement>();
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);
  const [frameElement, setFrameElement] = useState<HTMLDivElement | null>(null);
  const [availableSize, setAvailableSize] = useState<{
    readonly height: number;
    readonly width: number;
  }>();
  const [keyboardIndex, setKeyboardIndex] = useState<number | null>(null);
  const [pointerIndex, setPointerIndex] = useState<number | null>(null);
  const [touchIndex, setTouchIndex] = useState<number | null>(null);
  const [pointerPosition, setPointerPosition] = useState<{
    readonly x: number;
    readonly y: number;
  }>();
  const columnCount = props.columns.length;
  const rowCount = props.rows.length;
  const widestEstimatedRowLabel = Math.max(
    estimatedUtilityTextWidth(props.labels.row),
    ...props.rows.map((row) => estimatedUtilityTextWidth(row.label)),
  );
  const fullRowLabelWidth = clamp(48, Math.ceil(widestEstimatedRowLabel * (12 / 16) + 16), 160);
  const fullGridWidth = fullRowLabelWidth + columnCount * 64 + columnCount * 4;
  const fullGridHeight = 30 + rowCount * 44;
  const isCompact =
    availableSize !== undefined &&
    (availableSize.width <= 400 ||
      availableSize.width < Math.max(fullGridWidth, minimumSize.width) ||
      availableSize.height < Math.max(fullGridHeight, minimumSize.height));
  const cellMinimumWidth = isCompact ? 48 : 64;
  const headerHeight = isCompact ? 26 : 30;
  const rowHeight = isCompact ? 32 : 40;
  const labelFontScale = (isCompact ? 11 : 12) / 16;
  const rowLabelWidth = clamp(48, Math.ceil(widestEstimatedRowLabel * labelFontScale + 16), 160);
  const calculatedGridWidth = rowLabelWidth + columnCount * cellMinimumWidth + columnCount * 4;
  const calculatedGridHeight = headerHeight + rowCount * (rowHeight + 4);
  const preferredGridWidth = Math.max(calculatedGridWidth, minimumSize.width);
  const preferredGridHeight = Math.max(calculatedGridHeight, minimumSize.height);
  const fallbackDense = columnCount > 8 || rowCount > 8;
  const hasLocalOverflow =
    availableSize === undefined
      ? fallbackDense
      : availableSize.width < preferredGridWidth || availableSize.height < preferredGridHeight;
  const showCellValues =
    availableSize === undefined
      ? !fallbackDense
      : availableSize.width >= calculatedGridWidth && availableSize.height >= calculatedGridHeight;
  const activeIndex = pointerIndex ?? touchIndex ?? keyboardIndex;
  const activeCell = activeIndex === null ? undefined : model.cells[activeIndex];
  const modelIdentity = JSON.stringify([
    status.kind,
    props.rows.map((item) => [item.id, item.label]),
    props.columns.map((item) => [item.id, item.label]),
    model.cells.map((cell) => cell.value ?? null),
  ]);
  const interactionState = useHeatmapInteraction(
    props,
    model.cells,
    canvasElement,
    JSON.stringify([
      modelIdentity,
      availableSize,
      props.minimumSize,
      props.aspectRatio,
      props.scale,
      props.labels,
      model.cells.map((cell) =>
        cell.value === undefined ? null : formatHeatmapValue(cell.value, props.value),
      ),
    ]),
  );
  const {actions, points, selected} = interactionState;
  const interactive = props.interaction !== undefined;
  const selectionInstructionsId = `${descriptionId}-selection-instructions`;
  const [retainedModelIdentity, setRetainedModelIdentity] = useState(modelIdentity);
  if (modelIdentity !== retainedModelIdentity) {
    setRetainedModelIdentity(modelIdentity);
    setKeyboardIndex(null);
    setPointerIndex(null);
    setTouchIndex(null);
    setPointerPosition(undefined);
  }
  const frameStyle: HeatmapStyles = {
    '--wcl-chart-aspect-ratio': props.aspectRatio ?? 1.75,
    '--wcl-chart-minimum-height': `${minimumSize.height}px`,
    '--wcl-chart-minimum-width': `${minimumSize.width}px`,
    '--wcl-heatmap-cell-minimum-width': `${cellMinimumWidth}px`,
    '--wcl-heatmap-columns': Math.max(1, columnCount),
    '--wcl-heatmap-grid-height': `${preferredGridHeight}px`,
    '--wcl-heatmap-grid-width': `${preferredGridWidth}px`,
    '--wcl-heatmap-header-height': `${headerHeight}px`,
    '--wcl-heatmap-midpoint-position': `${model.midpointPosition * 100}%`,
    '--wcl-heatmap-row-label-width': `${rowLabelWidth}px`,
    '--wcl-heatmap-row-height': `${rowHeight}px`,
    '--wcl-heatmap-rows': Math.max(1, rowCount),
  };
  const [lowColor, highColor] =
    props.scale.type === 'sequential' ? [props.scale.color, props.scale.color] : props.scale.colors;
  const rootStyle: HeatmapRootStyles = {
    '--wcl-chart-minimum-width': `${minimumSize.width}px`,
    '--wcl-heatmap-high-color': highColor,
    '--wcl-heatmap-low-color': lowColor,
  };

  useLayoutEffect(() => {
    if (frameElement === null) return;
    const update = () => {
      const bounds = frameElement.getBoundingClientRect();
      if (bounds.width > 0 && bounds.height > 0)
        setAvailableSize({height: bounds.height, width: bounds.width});
    };
    update();
    const ResizeObserverConstructor = frameElement.ownerDocument.defaultView?.ResizeObserver;
    if (ResizeObserverConstructor === undefined) return;
    const observer = new ResizeObserverConstructor(update);
    observer.observe(frameElement);
    return () => observer.disconnect();
  }, [frameElement]);

  useEffect(() => {
    if (touchIndex === null) return;
    const dismiss = (event: globalThis.PointerEvent) => {
      if (event.target instanceof Node && !rootElement?.contains(event.target)) {
        setTouchIndex(null);
        setPointerPosition(undefined);
      }
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [rootElement, touchIndex]);

  function clearDirectReading(): void {
    setPointerIndex(null);
    setTouchIndex(null);
    setPointerPosition(undefined);
  }

  function cellAnchor(
    canvas: HTMLDivElement,
    index: number,
  ): {readonly x: number; readonly y: number} {
    const bounds = canvas.querySelector(`[data-cell-index="${index}"]`)?.getBoundingClientRect();
    return bounds === undefined
      ? {x: 0, y: 0}
      : {x: bounds.right, y: bounds.top + bounds.height / 2};
  }

  function selectKeyboardCell(index: number, canvas: HTMLDivElement): void {
    clearDirectReading();
    const next = clamp(0, index, model.cells.length - 1);
    const cell = canvas.querySelector(`[data-cell-index="${next}"]`);
    if (typeof cell?.scrollIntoView === 'function') {
      cell.scrollIntoView({block: 'nearest', inline: 'nearest'});
    }
    setKeyboardIndex(next);
    setPointerPosition(cellAnchor(canvas, next));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (model.cells.length === 0) return;
    if (interactive && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      const index = keyboardIndex ?? activeIndex ?? 0;
      const entry = interactionState.entries[index];
      if (entry) {
        selectKeyboardCell(index, event.currentTarget);
        actions.activate(
          {rowId: heatmapKey(entry.item), seriesId: ''},
          'keyboard',
          event.ctrlKey || event.metaKey,
        );
      }
      return;
    }
    if (event.key === 'Escape') actions.cancel();
    const current = keyboardIndex ?? 0;
    let next: number | undefined;
    if (event.key === 'Escape') {
      next = -1;
    } else if (event.key === 'ArrowRight') {
      next = Math.min(
        current + 1,
        Math.floor(current / columnCount) * columnCount + columnCount - 1,
      );
    } else if (event.key === 'ArrowLeft') {
      next = Math.max(current - 1, Math.floor(current / columnCount) * columnCount);
    } else if (event.key === 'ArrowDown') {
      next = Math.floor(current / columnCount) >= rowCount - 1 ? current : current + columnCount;
    } else if (event.key === 'ArrowUp') {
      next = Math.floor(current / columnCount) === 0 ? current : current - columnCount;
    } else if (event.key === 'Home') {
      next = event.ctrlKey || event.metaKey ? 0 : Math.floor(current / columnCount) * columnCount;
    } else if (event.key === 'End') {
      next =
        event.ctrlKey || event.metaKey
          ? model.cells.length - 1
          : Math.floor(current / columnCount) * columnCount + columnCount - 1;
    }
    if (next === undefined) return;
    event.preventDefault();
    if (next < 0) {
      setKeyboardIndex(null);
      clearDirectReading();
    } else selectKeyboardCell(next, event.currentTarget);
  }

  function cellFromEvent(event: PointerEvent<HTMLDivElement>): number | null {
    const target =
      event.target instanceof Element ? event.target.closest('[data-cell-index]') : null;
    if (!target || !event.currentTarget.contains(target)) return null;
    const index = Number(target.getAttribute('data-cell-index'));
    return Number.isInteger(index) && model.cells[index] !== undefined ? index : null;
  }

  function pointerLocation(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left,
      y = event.clientY - rect.top;
    const point = points.find((point) => {
      const b = point.bounds!;
      return x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height;
    });
    return {x, y, point, bounds: {left: 0, top: 0, right: rect.width, bottom: rect.height}};
  }

  const readingAnnouncement =
    activeCell === undefined
      ? ''
      : `${props.rows[activeCell.rowIndex]!.label}. ${props.columns[activeCell.columnIndex]!.label}. ${activeCell.value === undefined ? props.labels.missing : formatHeatmapValue(activeCell.value, props.value)}`;

  let content: ReactNode;
  if (status.kind === 'loading') {
    content = (
      <div data-wcl-chart-feedback="">
        <Spinner isActive label={status.label} />
      </div>
    );
  } else if (status.kind === 'error') {
    content = <Feedback copy={status} kind="error" />;
  } else if (props.rows.length === 0 || props.columns.length === 0) {
    content = (
      <EmptyState
        description={props.emptyState.description}
        kind="no-data"
        title={props.emptyState.title}
      />
    );
  } else if (model.cells.every((cell) => cell.value === undefined) && props.data.length > 0) {
    content = (
      <EmptyState
        description={props.invalidData.description}
        kind="unavailable"
        title={props.invalidData.title}
      />
    );
  } else {
    content = (
      <div data-wcl-heatmap-body="">
        {status.kind === 'partial' ? <Feedback copy={status} kind="partial" /> : null}
        {model.invalidCount > 0 ? <Feedback copy={props.invalidData} kind="invalid" /> : null}
        <div data-wcl-heatmap-visual="">
          <div
            {...(hasLocalOverflow ? scrollbarActivityProps : {})}
            aria-label={hasLocalOverflow ? props.labels.scrollRegion : undefined}
            data-overflow={hasLocalOverflow ? 'scroll' : 'clip'}
            data-scrollable={hasLocalOverflow ? '' : undefined}
            data-wcl-chart-frame=""
            data-wcl-heatmap-frame=""
            onScroll={(event) => {
              if (hasLocalOverflow) scrollbarActivityProps.onScroll?.(event);
              actions.cancel();
              clearDirectReading();
              if (keyboardIndex !== null && canvasElement) {
                setPointerPosition(cellAnchor(canvasElement, keyboardIndex));
              }
            }}
            ref={setFrameElement}
            role={hasLocalOverflow ? 'region' : undefined}
            style={frameStyle}
            tabIndex={hasLocalOverflow ? 0 : undefined}
          >
            <div
              aria-keyshortcuts={
                interactive
                  ? 'ArrowLeft ArrowRight ArrowUp ArrowDown Home End Control+Home Control+End Meta+Home Meta+End Enter Space Control+Enter Control+Space Meta+Enter Meta+Space Escape'
                  : 'ArrowLeft ArrowRight ArrowUp ArrowDown Home End Control+Home Control+End Escape'
              }
              aria-describedby={props.interaction?.selection ? selectionInstructionsId : undefined}
              ref={setCanvasElement}
              data-interactive={interactive ? '' : undefined}
              data-selectable={props.interaction?.selection ? '' : undefined}
              aria-labelledby={titleId}
              data-show-values={showCellValues ? '' : undefined}
              data-wcl-chart-canvas=""
              data-wcl-heatmap-canvas=""
              onBlur={(event: FocusEvent<HTMLDivElement>) => {
                if (!(
                  event.relatedTarget instanceof Node &&
                  event.currentTarget.contains(event.relatedTarget)
                )) {
                  actions.cancel();
                  setKeyboardIndex(null);
                  if (pointerIndex === null && touchIndex === null) setPointerPosition(undefined);
                }
              }}
              onFocus={(event) => {
                if (pointerFocus.current) return;
                if (
                  event.currentTarget === event.target &&
                  activeIndex === null &&
                  model.cells.length > 0
                ) {
                  selectKeyboardCell(0, event.currentTarget);
                }
              }}
              onKeyDown={handleKeyDown}
              onPointerDown={(event) => {
                pointerFocus.current = true;
                if (interactive && event.button === 0 && event.isPrimary !== false) {
                  event.preventDefault();
                  setKeyboardIndex(null);
                  event.currentTarget.focus({preventScroll: true});
                  const location = pointerLocation(event);
                  actions.begin(event, location.point, location.x, location.y);
                }
                if (event.pointerType !== 'touch') return;
                const index = cellFromEvent(event);
                if (index === null) return;
                setKeyboardIndex(null);
                setPointerIndex(null);
                setTouchIndex(index);
                setPointerPosition(cellAnchor(event.currentTarget, index));
              }}
              onPointerUp={(event) => {
                if (interactive) actions.end(event, pointerLocation(event).point);
                pointerFocus.current = false;
              }}
              onPointerCancel={() => {
                actions.cancel();
                pointerFocus.current = false;
              }}
              onLostPointerCapture={() => {
                actions.cancel();
                pointerFocus.current = false;
              }}
              onContextMenu={(event) => {
                if (actions.isHolding() || actions.isDragging()) event.preventDefault();
              }}
              onPointerLeave={(event) => {
                pointerFocus.current = false;
                if (event.pointerType === 'touch') return;
                setPointerIndex(null);
                setPointerPosition(
                  touchIndex === null ? undefined : cellAnchor(event.currentTarget, touchIndex),
                );
              }}
              onPointerMove={(event) => {
                const location = interactive ? pointerLocation(event) : undefined;
                if (
                  location &&
                  actions.move(event, location.x, location.y, points, location.bounds)
                ) {
                  clearDirectReading();
                  return;
                }
                if (event.pointerType === 'touch') return;
                const index = location ? (location.point?.index ?? null) : cellFromEvent(event);
                if (index === null) {
                  setPointerIndex(null);
                  setPointerPosition(
                    touchIndex === null ? undefined : cellAnchor(event.currentTarget, touchIndex),
                  );
                  return;
                }
                setKeyboardIndex(null);
                setPointerIndex(index);
                setPointerPosition({x: event.clientX, y: event.clientY});
              }}
              role="group"
              tabIndex={0}
            >
              <div aria-hidden="true" data-wcl-heatmap-grid="">
                <span data-wcl-heatmap-corner="">{props.labels.row}</span>
                {props.columns.map((column) => (
                  <span data-wcl-heatmap-column-label="" key={column.id}>
                    {column.label}
                  </span>
                ))}
                {props.rows.map((row, rowIndex) => (
                  <div data-wcl-heatmap-row="" key={row.id}>
                    <span data-wcl-heatmap-row-label="">{row.label}</span>
                    {props.columns.map((column, columnIndex) => {
                      const cell = model.cells[rowIndex * columnCount + columnIndex]!;
                      const intensity =
                        props.scale.type === 'two-sided' ? cell.ratio * 84 : 12 + cell.ratio * 72;
                      return (
                        <span
                          data-active={activeIndex === cell.index ? '' : undefined}
                          data-selected={
                            props.interaction?.selection &&
                            selected.has(heatmapKey({rowId: row.id, columnId: column.id}))
                              ? ''
                              : undefined
                          }
                          data-cell-index={cell.index}
                          data-range={cell.value === undefined ? undefined : cell.range}
                          data-missing={cell.value === undefined ? '' : undefined}
                          data-scale-ratio={
                            cell.value === undefined ? undefined : cell.ratio.toFixed(4)
                          }
                          data-wcl-heatmap-cell=""
                          key={column.id}
                          style={{'--wcl-heatmap-intensity': `${intensity}%`} as CellStyles}
                        >
                          {cell.value === undefined ? null : (
                            <span data-wcl-heatmap-cell-value="">
                              {formatHeatmapValue(cell.value, props.value)}
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
              {interactive ? <HeatmapInteractionFeedback state={interactionState} /> : null}
              {activeCell === undefined || pointerPosition === undefined ? null : (
                <HeatmapTooltip
                  anchor={pointerPosition}
                  cell={activeCell}
                  portalTarget={rootElement?.closest('[data-wcl-provider]') ?? rootElement}
                  props={props}
                />
              )}
            </div>
          </div>
          <div
            aria-label={props.labels.colorKey}
            data-scale={props.scale.type}
            data-wcl-heatmap-key=""
            style={frameStyle}
          >
            {model.hasNumericKey ? (
              <div data-wcl-heatmap-key-numeric="">
                <span data-wcl-heatmap-key-gradient="" />
                <span>{formatHeatmapValue(model.domain[0], props.value)}</span>
                {props.scale.type === 'two-sided' ? (
                  <span data-wcl-heatmap-key-midpoint="">
                    {formatHeatmapValue(props.scale.midpoint, props.value)}
                  </span>
                ) : null}
                <span>{formatHeatmapValue(model.domain[1], props.value)}</span>
              </div>
            ) : null}
            <span data-wcl-heatmap-key-missing="">
              <i />
              {props.labels.missing}
            </span>
          </div>
        </div>
        <HeatmapTable model={model} props={props} />
        <p aria-live="polite" data-wcl-chart-reading-announcement="">
          {readingAnnouncement}
        </p>
      </div>
    );
  }

  return (
    <figure
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      data-density={isCompact ? 'compact' : 'regular'}
      data-wcl-chart=""
      data-wcl-heatmap=""
      ref={setRootElement}
      style={rootStyle}
    >
      <figcaption data-wcl-chart-caption="">
        <strong id={titleId}>{props.title}</strong>
        <p id={descriptionId}>{props.description}</p>
      </figcaption>
      {content}
      <HeatmapSelectionSummary state={interactionState} id={selectionInstructionsId} />
    </figure>
  );
}
