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

import {EmptyState} from '../feedback/empty-state.js';
import {Spinner} from '../feedback/spinner.js';
import {useScrollbarActivity} from '../scrollbar-activity.js';
import {
  Feedback,
  assertText,
  clamp,
  defaultColors,
  readAccessor,
  type ChartTooltipStyles,
} from './cartesian-chart.js';
import type {ChartColor, RadarChartProps, RadarChartValue} from './chart-types.js';

const viewSize = 480;
const center = viewSize / 2;
const plotRadius = 150;
const labelRadius = 188;
const guideRatios = [0.2, 0.4, 0.6, 0.8, 1] as const;
const supportedColors: readonly ChartColor[] = [...defaultColors, 'success', 'warning', 'danger'];

type RadarFrameStyles = CSSProperties & {
  '--wcl-chart-aspect-ratio': number;
  '--wcl-chart-minimum-height': string;
  '--wcl-chart-minimum-width': string;
};

interface PreparedRadarSeries {
  readonly areaRatios: readonly number[];
  readonly color: ChartColor;
  readonly id: string;
  readonly label: string;
  readonly values: readonly number[];
}

interface RadarModel {
  readonly invalidCount: number;
  readonly maximum: number;
  readonly series: readonly PreparedRadarSeries[];
}

function formatRadarValue(value: number, configuration: RadarChartValue): string {
  const formatted = configuration.formatValue?.(value) ?? String(value);
  const unit = configuration.unit?.trim();
  if (unit === undefined || unit.length === 0 || formatted.trimEnd().endsWith(unit)) {
    return formatted;
  }
  return `${formatted} ${unit}`;
}

function radarAreaRatios(values: readonly number[], maximum: number): readonly number[] {
  const exact = values.map((value) => value / maximum);
  const area = [...exact];
  for (const [index, ratio] of exact.entries()) {
    if (ratio === 0) continue;
    const previous = (index - 1 + exact.length) % exact.length;
    const next = (index + 1) % exact.length;
    if (exact[previous] !== 0 || exact[next] !== 0) continue;
    const shoulder = Math.min(ratio, Math.max(0.08, ratio * 0.25));
    area[previous] = Math.max(area[previous]!, shoulder);
    area[next] = Math.max(area[next]!, shoulder);
  }
  return area;
}

function radarMaximum(greatestValue: number): number {
  if (greatestValue <= 0) return 1;
  const exponent = Math.max(-323, Math.floor(Math.log10(greatestValue)));
  const magnitude = 10 ** exponent;
  const normalized = greatestValue / magnitude;
  const interval = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  const maximum = interval * magnitude;
  return Number.isFinite(maximum) && maximum >= greatestValue ? maximum : greatestValue;
}

function radarGuideValue(maximum: number, ratio: number): number {
  if (ratio === 1) return maximum;
  return Number((maximum * ratio).toPrecision(12));
}

function pointAt(index: number, count: number, ratio: number): readonly [number, number] {
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
  return [
    center + Math.cos(angle) * plotRadius * ratio,
    center + Math.sin(angle) * plotRadius * ratio,
  ];
}

function labelPointAt(index: number, count: number): readonly [number, number] {
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
  return [center + Math.cos(angle) * labelRadius, center + Math.sin(angle) * labelRadius];
}

function distanceToSegment(
  point: readonly [number, number],
  start: readonly [number, number],
  end: readonly [number, number],
): number {
  const deltaX = end[0] - start[0];
  const deltaY = end[1] - start[1];
  const lengthSquared = deltaX * deltaX + deltaY * deltaY;
  if (lengthSquared === 0) return Math.hypot(point[0] - start[0], point[1] - start[1]);
  const ratio = clamp(
    0,
    ((point[0] - start[0]) * deltaX + (point[1] - start[1]) * deltaY) / lengthSquared,
    1,
  );
  return Math.hypot(point[0] - (start[0] + ratio * deltaX), point[1] - (start[1] + ratio * deltaY));
}

function polygonContainsPoint(
  point: readonly [number, number],
  vertices: readonly (readonly [number, number])[],
): boolean {
  let inside = false;
  for (let index = 0, previous = vertices.length - 1; index < vertices.length; previous = index++) {
    const currentPoint = vertices[index]!;
    const previousPoint = vertices[previous]!;
    const crosses =
      currentPoint[1] > point[1] !== previousPoint[1] > point[1] &&
      point[0] <
        ((previousPoint[0] - currentPoint[0]) * (point[1] - currentPoint[1])) /
          (previousPoint[1] - currentPoint[1]) +
          currentPoint[0];
    if (crosses) inside = !inside;
  }
  return inside;
}

function radarPolygonHit(
  point: readonly [number, number],
  ratios: readonly number[],
  dimensionCount: number,
): boolean {
  if (!ratios.some((ratio) => ratio > 0)) return false;
  const vertices = ratios.map((ratio, index) => pointAt(index, dimensionCount, ratio));
  if (polygonContainsPoint(point, vertices)) return true;
  return vertices.some(
    (vertex, index) =>
      distanceToSegment(point, vertex, vertices[(index + 1) % vertices.length]!) <= 10,
  );
}

function clientPointFromViewBox(
  svg: SVGSVGElement | null,
  point: readonly [number, number],
): {readonly x: number; readonly y: number} {
  if (svg === null) return {x: point[0], y: point[1]};
  const rectangle = svg.getBoundingClientRect();
  const scale = Math.min(rectangle.width / viewSize, rectangle.height / viewSize);
  if (!Number.isFinite(scale) || scale <= 0) return {x: point[0], y: point[1]};
  return {
    x: rectangle.left + (rectangle.width - viewSize * scale) / 2 + point[0] * scale,
    y: rectangle.top + (rectangle.height - viewSize * scale) / 2 + point[1] * scale,
  };
}

function validateCommon<Datum extends object>(props: RadarChartProps<Datum>): void {
  assertText(props.title, 'RadarChart title');
  assertText(props.description, 'RadarChart description');
  assertText(props.dataTableLabel, 'RadarChart data-table label');
  assertText(props.legend.label, 'RadarChart legend label');
  assertText(props.labels.dimension, 'RadarChart dimension label');
  assertText(props.value.label, 'RadarChart value label');
  assertText(props.emptyState.title, 'Empty-state title');
  assertText(props.emptyState.description, 'Empty-state description');
  assertText(props.invalidData.title, 'Invalid-data title');
  assertText(props.invalidData.description, 'Invalid-data description');
  if (props.status?.kind === 'loading') assertText(props.status.label, 'Loading label');
  if (props.status?.kind === 'partial' || props.status?.kind === 'error') {
    assertText(props.status.title, 'Status title');
    assertText(props.status.description, 'Status description');
  }
  if (props.dimensions.length < 3)
    throw new Error('RadarChart requires at least three dimensions.');
  if (props.data.length > defaultColors.length) {
    throw new Error('RadarChart supports at most six series.');
  }
  if (
    props.aspectRatio !== undefined &&
    (!Number.isFinite(props.aspectRatio) || props.aspectRatio <= 0)
  ) {
    throw new Error('RadarChart aspectRatio must be a positive finite number.');
  }
  if (
    props.minimumSize !== undefined &&
    (!Number.isFinite(props.minimumSize.width) ||
      !Number.isFinite(props.minimumSize.height) ||
      props.minimumSize.width <= 0 ||
      props.minimumSize.height <= 0)
  ) {
    throw new Error('RadarChart minimumSize dimensions must be positive finite numbers.');
  }
  if (props.overflow !== undefined && props.overflow !== 'scroll' && props.overflow !== 'clip') {
    throw new Error('RadarChart overflow must be "scroll" or "clip".');
  }
  const dimensionIds = new Set<string>();
  for (const dimension of props.dimensions) {
    assertText(dimension.id, 'RadarChart dimension id');
    assertText(dimension.label, 'RadarChart dimension label');
    if (dimensionIds.has(dimension.id)) {
      throw new Error(`RadarChart dimension id "${dimension.id}" is duplicated.`);
    }
    dimensionIds.add(dimension.id);
  }
}

function prepareModel<Datum extends object>(props: RadarChartProps<Datum>): RadarModel {
  validateCommon(props);
  const ids = new Set<string>();
  const valid: Array<
    Omit<PreparedRadarSeries, 'areaRatios' | 'color'> & {
      readonly requestedColor: ChartColor | undefined;
    }
  > = [];
  let invalidCount = 0;
  props.data.forEach((datum, sourceIndex) => {
    const id = readAccessor(props.idAccessor, datum, sourceIndex);
    const label = readAccessor(props.labelAccessor, datum, sourceIndex);
    const hasUsableId = typeof id === 'string' && id.trim().length > 0;
    if (hasUsableId && ids.has(id)) {
      throw new Error(`RadarChart series id "${id}" is duplicated.`);
    }
    if (hasUsableId) ids.add(id);
    const values = props.dimensions.map((dimension) =>
      readAccessor(dimension.accessor, datum, sourceIndex),
    );
    const requestedColor =
      props.colorAccessor === undefined
        ? undefined
        : readAccessor(props.colorAccessor, datum, sourceIndex);
    if (
      !hasUsableId ||
      typeof label !== 'string' ||
      label.trim().length === 0 ||
      values.some(
        (value) =>
          value !== null &&
          value !== undefined &&
          (typeof value !== 'number' || !Number.isFinite(value) || value < 0),
      ) ||
      (requestedColor !== null &&
        requestedColor !== undefined &&
        !supportedColors.includes(requestedColor))
    ) {
      invalidCount += 1;
      return;
    }
    valid.push({
      id,
      label,
      requestedColor: requestedColor ?? undefined,
      values: values.map((value) => value ?? 0),
    });
  });
  const greatestValue = Math.max(0, ...valid.flatMap((item) => item.values));
  const maximum = radarMaximum(greatestValue);
  const claimedColors = new Set(
    valid
      .map((item) => item.requestedColor)
      .filter((color): color is ChartColor => color !== undefined && defaultColors.includes(color)),
  );
  let automaticColorIndex = 0;
  return {
    invalidCount,
    maximum,
    series: valid.map(({requestedColor, ...item}) => {
      while (claimedColors.has(defaultColors[automaticColorIndex] ?? 'accent')) {
        automaticColorIndex += 1;
      }
      const color = requestedColor ?? defaultColors[automaticColorIndex] ?? 'accent';
      if (requestedColor === undefined) automaticColorIndex += 1;
      claimedColors.add(color);
      return {
        ...item,
        areaRatios: radarAreaRatios(item.values, maximum),
        color,
      };
    }),
  };
}

function RadarTooltip<Datum extends object>({
  dimensionIndex,
  pointer,
  portalTarget,
  props,
  series,
  svg,
}: {
  readonly dimensionIndex: number;
  readonly pointer?: {readonly x: number; readonly y: number};
  readonly portalTarget: Element | null;
  readonly props: RadarChartProps<Datum>;
  readonly series: readonly PreparedRadarSeries[];
  readonly svg: SVGSVGElement | null;
}): ReactElement | null {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipSize, setTooltipSize] = useState({height: 128, width: 208});
  const dimension = props.dimensions[dimensionIndex]!;
  useLayoutEffect(() => {
    const tooltip = tooltipRef.current;
    if (tooltip === null) return;
    const bounds = tooltip.getBoundingClientRect();
    if (bounds.width > 0 && bounds.height > 0) {
      setTooltipSize({height: bounds.height, width: bounds.width});
    }
  }, [dimension.id, series.length]);
  if (portalTarget === null) return null;
  const anchor =
    pointer ?? clientPointFromViewBox(svg, pointAt(dimensionIndex, props.dimensions.length, 0.72));
  const viewportWidth = typeof window === 'undefined' ? viewSize : window.innerWidth;
  const viewportHeight = typeof window === 'undefined' ? viewSize : window.innerHeight;
  const padding = 8;
  const gap = 12;
  const after = viewportWidth - anchor.x - gap;
  const before = anchor.x - gap;
  const placement = after >= tooltipSize.width || after >= before ? 'start' : 'end';
  const preferredLeft = placement === 'start' ? anchor.x + gap : anchor.x - gap - tooltipSize.width;
  const style: ChartTooltipStyles = {
    '--wcl-chart-tooltip-left': `${clamp(
      padding,
      preferredLeft,
      Math.max(padding, viewportWidth - tooltipSize.width - padding),
    )}px`,
    '--wcl-chart-tooltip-y': `${anchor.y}px`,
  };
  return createPortal(
    <div data-wcl-chart-tooltip-layer="">
      <div
        data-horizontal-placement={placement}
        data-vertical-placement={
          anchor.y < tooltipSize.height / 2 + gap
            ? 'start'
            : anchor.y + tooltipSize.height / 2 + gap > viewportHeight
              ? 'end'
              : 'center'
        }
        data-wcl-chart-tooltip=""
        ref={tooltipRef}
        role="tooltip"
        style={style}
      >
        <strong>{dimension.label}</strong>
        <dl>
          {series.map((item) => (
            <div data-color={item.color} key={item.id}>
              <dt>{item.label}</dt>
              <dd>{formatRadarValue(item.values[dimensionIndex]!, props.value)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>,
    portalTarget,
  );
}

function RadarTable<Datum extends object>({
  model,
  props,
}: {
  readonly model: RadarModel;
  readonly props: RadarChartProps<Datum>;
}): ReactElement {
  return (
    <table aria-label={props.dataTableLabel} data-wcl-chart-table="">
      <thead>
        <tr>
          <th scope="col">{`${props.labels.dimension}, ${props.value.label}`}</th>
          {model.series.map((item) => (
            <th key={item.id} scope="col">
              {item.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.dimensions.map((dimension, dimensionIndex) => (
          <tr key={dimension.id}>
            <th scope="row">{dimension.label}</th>
            {model.series.map((item) => (
              <td key={item.id}>{formatRadarValue(item.values[dimensionIndex]!, props.value)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function RadarChart<Datum extends object>(props: RadarChartProps<Datum>): ReactElement {
  const model = prepareModel(props);
  const minimumSize = props.minimumSize ?? {height: 300, width: 320};
  const overflow = props.overflow ?? 'scroll';
  const status = props.status ?? {kind: 'ready'};
  const titleId = useId();
  const descriptionId = useId();
  const canvasRef = useRef<HTMLDivElement>(null);
  const frameScrollbarActivityProps = useScrollbarActivity<HTMLDivElement>();
  const legendScrollbarActivityProps = useScrollbarActivity<HTMLUListElement>();
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);
  const [svgElement, setSvgElement] = useState<SVGSVGElement | null>(null);
  const [keyboardIndex, setKeyboardIndex] = useState<number | null>(null);
  const [pointerIndex, setPointerIndex] = useState<number | null>(null);
  const [pointerSeriesId, setPointerSeriesId] = useState<string | null>(null);
  const [pointerPosition, setPointerPosition] = useState<{
    readonly x: number;
    readonly y: number;
  }>();
  const [touchIndex, setTouchIndex] = useState<number | null>(null);
  const [touchSeriesId, setTouchSeriesId] = useState<string | null>(null);
  const [transientSeriesId, setTransientSeriesId] = useState<string | null>(null);
  const [pinnedSeriesId, setPinnedSeriesId] = useState<string | null>(null);
  const [availableSize, setAvailableSize] = useState<{
    readonly height: number;
    readonly width: number;
  }>();
  const modelIdentity = JSON.stringify([
    status.kind,
    props.dimensions.map((dimension) => dimension.id),
    model.series.map((item) => [item.id, ...item.values]),
  ]);
  const [retainedModelIdentity, setRetainedModelIdentity] = useState(modelIdentity);
  if (retainedModelIdentity !== modelIdentity) {
    setRetainedModelIdentity(modelIdentity);
    setKeyboardIndex(null);
    setPointerIndex(null);
    setPointerSeriesId(null);
    setPointerPosition(undefined);
    setTouchIndex(null);
    setTouchSeriesId(null);
    if (!model.series.some((item) => item.id === transientSeriesId)) setTransientSeriesId(null);
    if (!model.series.some((item) => item.id === pinnedSeriesId)) setPinnedSeriesId(null);
  }
  const activeIndex = Math.min(
    pointerIndex ?? touchIndex ?? keyboardIndex ?? 0,
    props.dimensions.length - 1,
  );
  const isReading = pointerIndex !== null || touchIndex !== null || keyboardIndex !== null;
  const validPinnedSeriesId = model.series.some((item) => item.id === pinnedSeriesId)
    ? pinnedSeriesId
    : null;
  const validTransientSeriesId = model.series.some((item) => item.id === transientSeriesId)
    ? transientSeriesId
    : null;
  const directSeriesId = pointerIndex !== null ? pointerSeriesId : touchSeriesId;
  const validDirectSeriesId = model.series.some((item) => item.id === directSeriesId)
    ? directSeriesId
    : null;
  const emphasizedSeriesId = validDirectSeriesId ?? validPinnedSeriesId ?? validTransientSeriesId;
  const frameStyle: RadarFrameStyles = {
    '--wcl-chart-aspect-ratio': props.aspectRatio ?? 1.45,
    '--wcl-chart-minimum-height': `${minimumSize.height}px`,
    '--wcl-chart-minimum-width': `${minimumSize.width}px`,
  };
  const dimensionCount = props.dimensions.length;
  const isCompact =
    availableSize !== undefined && (availableSize.width <= 400 || availableSize.height <= 360);
  const isStacked =
    availableSize !== undefined && availableSize.width <= 400 && availableSize.height >= 520;
  const hasLocalOverflow =
    overflow === 'scroll' && availableSize !== undefined && availableSize.width < minimumSize.width;
  const readingSeries =
    validDirectSeriesId === null
      ? model.series
      : model.series.filter((item) => item.id === validDirectSeriesId);
  const directSeries = model.series.find((item) => item.id === validDirectSeriesId);
  const directPoint =
    directSeries === undefined
      ? undefined
      : pointAt(activeIndex, dimensionCount, directSeries.values[activeIndex]! / model.maximum);
  const readingAnnouncement = !isReading
    ? ''
    : [
        props.dimensions[activeIndex]!.label,
        ...readingSeries.map(
          (item) => `${item.label}: ${formatRadarValue(item.values[activeIndex]!, props.value)}`,
        ),
      ].join('. ');

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

  useEffect(() => {
    if (touchIndex === null) return;
    const dismiss = (event: globalThis.PointerEvent) => {
      if (event.target instanceof Node && !rootElement?.contains(event.target)) {
        setTouchIndex(null);
        setTouchSeriesId(null);
      }
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [rootElement, touchIndex]);

  function clearReading(): void {
    setKeyboardIndex(null);
    setPointerIndex(null);
    setPointerSeriesId(null);
    setPointerPosition(undefined);
    setTouchIndex(null);
    setTouchSeriesId(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      clearReading();
      return;
    }
    const current = keyboardIndex ?? activeIndex;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setPointerIndex(null);
      setPointerSeriesId(null);
      setPointerPosition(undefined);
      setTouchIndex(null);
      setTouchSeriesId(null);
      setKeyboardIndex(Math.min(current + 1, dimensionCount - 1));
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setPointerIndex(null);
      setPointerSeriesId(null);
      setPointerPosition(undefined);
      setTouchIndex(null);
      setTouchSeriesId(null);
      setKeyboardIndex(Math.max(current - 1, 0));
    }
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>): void {
    if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) {
      return;
    }
    setKeyboardIndex(null);
  }

  function dimensionFromEvent(event: PointerEvent<SVGSVGElement>): number | null {
    const target =
      event.target instanceof Element ? event.target.closest('[data-dimension-index]') : null;
    const index = Number(target?.getAttribute('data-dimension-index'));
    return Number.isInteger(index) && props.dimensions[index] !== undefined ? index : null;
  }

  function seriesFromEvent(
    event: PointerEvent<SVGSVGElement>,
    dimensionIndex: number,
  ): string | null {
    const rectangle = event.currentTarget.getBoundingClientRect();
    if (rectangle.width <= 0 || rectangle.height <= 0) {
      return validPinnedSeriesId ?? model.series[0]!.id;
    }
    const scale = Math.min(rectangle.width / viewSize, rectangle.height / viewSize);
    const x = (event.clientX - rectangle.left - (rectangle.width - viewSize * scale) / 2) / scale;
    const y = (event.clientY - rectangle.top - (rectangle.height - viewSize * scale) / 2) / scale;
    const pointer: readonly [number, number] = [x, y];
    const candidates = model.series.map((item) => {
      const [pointX, pointY] = pointAt(
        dimensionIndex,
        dimensionCount,
        item.values[dimensionIndex]! / model.maximum,
      );
      return {
        distance: Math.hypot(x - pointX, y - pointY),
        hit: radarPolygonHit(pointer, item.areaRatios, dimensionCount),
        id: item.id,
      };
    });
    const pinned = candidates.find(
      (candidate) => candidate.id === validPinnedSeriesId && candidate.hit,
    );
    if (pinned !== undefined) return pinned.id;
    const paintedHit = [...candidates].reverse().find((candidate) => candidate.hit);
    if (paintedHit !== undefined) return paintedHit.id;
    const nearest = candidates.reduce((closest, candidate) =>
      candidate.distance < closest.distance ? candidate : closest,
    );
    return nearest.distance <= 14 ? nearest.id : null;
  }

  function handlePointerMove(event: PointerEvent<SVGSVGElement>): void {
    if (event.pointerType === 'touch') return;
    const index = dimensionFromEvent(event);
    if (index === null) {
      setPointerIndex(null);
      setPointerSeriesId(null);
      setPointerPosition(undefined);
      return;
    }
    const seriesId = seriesFromEvent(event, index);
    if (seriesId === null) {
      setPointerIndex(null);
      setPointerSeriesId(null);
      setPointerPosition(undefined);
      return;
    }
    setKeyboardIndex(null);
    setPointerIndex(index);
    setPointerSeriesId(seriesId);
    setPointerPosition({x: event.clientX, y: event.clientY});
  }

  function handlePointerDown(event: PointerEvent<SVGSVGElement>): void {
    if (event.pointerType !== 'touch') return;
    const index = dimensionFromEvent(event);
    if (index === null) return;
    const seriesId = seriesFromEvent(event, index);
    if (seriesId === null) return;
    setKeyboardIndex(null);
    setPointerIndex(null);
    setPointerSeriesId(null);
    setPointerPosition(undefined);
    setTouchIndex(index);
    setTouchSeriesId(seriesId);
  }

  let content: ReactNode;
  if (status.kind === 'loading') {
    content = (
      <div data-wcl-chart-feedback="">
        <Spinner isActive label={status.label} />
      </div>
    );
  } else if (status.kind === 'error') {
    content = <Feedback copy={status} kind="error" />;
  } else if (model.series.length === 0) {
    const unavailable = props.data.length > 0;
    content = (
      <EmptyState
        description={unavailable ? props.invalidData.description : props.emptyState.description}
        kind={unavailable ? 'unavailable' : 'no-data'}
        title={unavailable ? props.invalidData.title : props.emptyState.title}
      />
    );
  } else {
    content = (
      <>
        {status.kind === 'partial' ? <Feedback copy={status} kind="partial" /> : null}
        {model.invalidCount > 0 ? <Feedback copy={props.invalidData} kind="invalid" /> : null}
        <div
          {...frameScrollbarActivityProps}
          aria-labelledby={hasLocalOverflow ? titleId : undefined}
          data-overflow={overflow}
          data-scrollable={hasLocalOverflow ? '' : undefined}
          data-wcl-chart-frame=""
          role={hasLocalOverflow ? 'region' : undefined}
          style={frameStyle}
          tabIndex={hasLocalOverflow ? 0 : undefined}
        >
          <div
            aria-keyshortcuts="ArrowLeft ArrowRight Escape"
            aria-labelledby={titleId}
            data-wcl-chart-canvas=""
            data-wcl-radar-canvas=""
            onBlur={handleBlur}
            onFocus={(event) => {
              if (event.currentTarget === event.target && !isReading) setKeyboardIndex(0);
            }}
            onKeyDown={handleKeyDown}
            ref={canvasRef}
            role="group"
            tabIndex={0}
          >
            <div data-wcl-radar-layout="">
              <svg
                aria-hidden="true"
                data-wcl-chart-svg=""
                focusable="false"
                onPointerDown={handlePointerDown}
                onPointerLeave={() => {
                  setPointerIndex(null);
                  setPointerSeriesId(null);
                  setPointerPosition(undefined);
                }}
                onPointerMove={handlePointerMove}
                ref={setSvgElement}
                viewBox={`0 0 ${viewSize} ${viewSize}`}
              >
                {guideRatios.map((ratio) => (
                  <g data-wcl-radar-guide="" key={ratio}>
                    <polygon
                      points={props.dimensions
                        .map((_, index) => pointAt(index, dimensionCount, ratio).join(','))
                        .join(' ')}
                    />
                    {!isCompact || ratio === 1 ? (
                      <text x={center + 7} y={center - plotRadius * ratio}>
                        {formatRadarValue(radarGuideValue(model.maximum, ratio), props.value)}
                      </text>
                    ) : null}
                  </g>
                ))}
                {props.dimensions.map((dimension, index) => {
                  const [x, y] = pointAt(index, dimensionCount, 1);
                  const [labelX, labelY] = labelPointAt(index, dimensionCount);
                  const anchor =
                    Math.abs(labelX - center) < 12 ? 'middle' : labelX < center ? 'end' : 'start';
                  const displayedLabel =
                    isCompact && dimension.label.length > 7
                      ? `${dimension.label.slice(0, 6)}…`
                      : dimension.label;
                  const labelInset = displayedLabel.length * (isCompact ? 12 : 8) + 8;
                  const safeLabelX =
                    anchor === 'end'
                      ? Math.max(labelX, labelInset)
                      : anchor === 'start'
                        ? Math.min(labelX, viewSize - labelInset)
                        : labelX;
                  return (
                    <g data-wcl-radar-spoke="" key={dimension.id}>
                      <line x1={center} x2={x} y1={center} y2={y} />
                      <text textAnchor={anchor} x={safeLabelX} y={labelY}>
                        {displayedLabel}
                      </text>
                    </g>
                  );
                })}
                {model.series.map((item, seriesIndex) => {
                  const isEmphasized = emphasizedSeriesId === item.id;
                  return (
                    <g
                      data-active={isEmphasized ? '' : undefined}
                      data-color={item.color}
                      data-emphasized={isEmphasized ? '' : undefined}
                      data-muted={emphasizedSeriesId !== null && !isEmphasized ? '' : undefined}
                      data-pattern-index={seriesIndex}
                      data-series-id={item.id}
                      data-wcl-radar-series=""
                      key={item.id}
                    >
                      {item.values.some((value) => value > 0) ? (
                        <polygon
                          data-wcl-radar-area=""
                          points={item.areaRatios
                            .map((ratio, index) => pointAt(index, dimensionCount, ratio).join(','))
                            .join(' ')}
                        />
                      ) : null}
                      {item.values.map((value, index) => {
                        if (value === 0) return null;
                        const [cx, cy] = pointAt(index, dimensionCount, value / model.maximum);
                        return (
                          <circle
                            cx={cx}
                            cy={cy}
                            data-wcl-radar-point=""
                            key={props.dimensions[index]!.id}
                            r="4"
                          />
                        );
                      })}
                    </g>
                  );
                })}
                {directSeries === undefined || directPoint === undefined ? null : (
                  <g data-color={directSeries.color} data-wcl-radar-reading-guide="">
                    <line
                      data-color={directSeries.color}
                      data-wcl-radar-reading-line=""
                      x1={center}
                      x2={directPoint[0]}
                      y1={center}
                      y2={directPoint[1]}
                    />
                    <circle
                      cx={directPoint[0]}
                      cy={directPoint[1]}
                      data-wcl-radar-reading-point=""
                      r="2.5"
                    />
                  </g>
                )}
                {props.dimensions.map((dimension, index) => {
                  const halfAngle = Math.PI / dimensionCount;
                  const path = arc()({
                    endAngle: (Math.PI * 2 * index) / dimensionCount + halfAngle,
                    innerRadius: 0,
                    outerRadius: labelRadius + 22,
                    startAngle: (Math.PI * 2 * index) / dimensionCount - halfAngle,
                  });
                  return (
                    <path
                      d={path ?? undefined}
                      data-dimension-index={index}
                      data-wcl-radar-hit-region=""
                      key={dimension.id}
                      transform={`translate(${center} ${center})`}
                    />
                  );
                })}
              </svg>
              <ul
                {...legendScrollbarActivityProps}
                aria-label={props.legend.label}
                data-wcl-chart-legend=""
                data-wcl-radar-legend=""
              >
                {model.series.map((item, index) => {
                  const isEmphasized = emphasizedSeriesId === item.id;
                  return (
                    <li
                      data-color={item.color}
                      data-emphasized={isEmphasized ? '' : undefined}
                      data-muted={emphasizedSeriesId !== null && !isEmphasized ? '' : undefined}
                      key={item.id}
                    >
                      <button
                        aria-pressed={validPinnedSeriesId === item.id}
                        data-wcl-chart-legend-button=""
                        onBlur={() => setTransientSeriesId(null)}
                        onClick={() =>
                          setPinnedSeriesId((current) => (current === item.id ? null : item.id))
                        }
                        onFocus={() => setTransientSeriesId(item.id)}
                        onKeyDown={(event) => {
                          if (event.key !== 'Escape') return;
                          event.preventDefault();
                          setTransientSeriesId(null);
                          setPinnedSeriesId(null);
                        }}
                        onMouseEnter={() => setTransientSeriesId(item.id)}
                        onMouseLeave={() => setTransientSeriesId(null)}
                        type="button"
                      >
                        <svg
                          aria-hidden="true"
                          data-wcl-chart-legend-swatch=""
                          data-wcl-radar-legend-swatch=""
                          focusable="false"
                          viewBox="0 0 20 8"
                        >
                          <rect data-pattern-index={index} height="8" rx="2" width="20" />
                        </svg>
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            {isReading ? (
              <RadarTooltip
                dimensionIndex={activeIndex}
                {...(pointerPosition === undefined ? {} : {pointer: pointerPosition})}
                portalTarget={rootElement?.closest('[data-wcl-provider]') ?? rootElement}
                props={props}
                series={readingSeries}
                svg={svgElement}
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
      data-wcl-radar-chart=""
      ref={setRootElement}
    >
      <figcaption data-wcl-chart-caption="">
        <strong id={titleId}>{props.title}</strong>
        <p id={descriptionId}>{props.description}</p>
      </figcaption>
      {content}
      {model.series.length > 0 && status.kind !== 'loading' && status.kind !== 'error' ? (
        <RadarTable model={model} props={props} />
      ) : null}
      <div aria-atomic="true" aria-live="polite" data-wcl-chart-reading-announcement="">
        {readingAnnouncement}
      </div>
    </figure>
  );
}
