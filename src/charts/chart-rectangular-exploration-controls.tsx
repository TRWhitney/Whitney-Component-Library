'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import {Button} from '../actions/button.js';
import {IconButton} from '../actions/icon-button.js';
import {Dialog} from '../overlays/dialog.js';
import {ChartExplorationGlyph as Glyph} from './chart-exploration-glyph.js';
import type {
  ChartExplorationCorner,
  ChartRectangularExplorationLabels,
  ChartRectangularWindow,
} from './chart-rectangular-exploration-types.js';

type Window = ChartRectangularWindow<number, number>;
type Axis = 'x' | 'y';
type Part = 'window' | ChartExplorationCorner;
type Range = readonly [number, number];
const corners: readonly ChartExplorationCorner[] = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
];

export interface ChartRectangularExplorationControlsProps {
  readonly version?: string;
  readonly largeStepMultiplier?: number;
  readonly step?: {readonly x: number; readonly y: number};
  readonly window: Window;
  readonly minimumSpan: {readonly x: number; readonly y: number};
  readonly labels: ChartRectangularExplorationLabels<number, number>;
  readonly rangeLabel: string;
  readonly fullRangeLabel: string;
  readonly formatWindow: (window: Window) => string;
  readonly onChange: (window: Window, phase: 'change' | 'end' | 'cancel') => void;
  readonly overview: ReactNode;
  readonly aspectRatio: number;
  readonly yIncreasesDown?: boolean;
}

interface Gesture {
  readonly kind: Part | 'new';
  readonly pointerId: number;
  readonly element: HTMLDivElement;
  readonly bounds: DOMRect;
  readonly x: number;
  readonly y: number;
  readonly point: {readonly x: number; readonly y: number};
  readonly initial: Window;
  latest: Window;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}
function stopPropagation(event: SyntheticEvent): void {
  event.stopPropagation();
}

export function ChartRectangularExplorationControls({
  version,
  largeStepMultiplier = 3,
  step,
  window,
  minimumSpan,
  labels,
  rangeLabel,
  fullRangeLabel,
  formatWindow,
  onChange,
  overview,
  aspectRatio,
  yIncreasesDown = false,
}: ChartRectangularExplorationControlsProps): ReactElement {
  const instructionId = useId();
  const navigator = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const [draggingState, setDragging] = useState(false);
  const [gestureVersion, setGestureVersion] = useState(version);
  const dragging = draggingState && gestureVersion === version;
  useEffect(() => {
    const current = gesture.current;
    gesture.current = null;
    if (current?.element.hasPointerCapture?.(current.pointerId))
      current.element.releasePointerCapture(current.pointerId);
  }, [version]);

  const span = {x: window.x[1] - window.x[0], y: window.y[1] - window.y[0]};
  const directionY = yIncreasesDown ? 1 : -1;
  function increment(axis: Axis): number | undefined {
    const value = step?.[axis];
    return value && Number.isFinite(value) && value > 0 ? Math.min(value, 1) : undefined;
  }
  function minimum(axis: Axis): number {
    const value = clamp(minimumSpan[axis], Number.EPSILON, 1);
    const unit = increment(axis);
    return unit ? Math.min(1, Math.ceil(value / unit - 1e-10) * unit) : value;
  }
  function snap(value: number, axis: Axis): number {
    const unit = increment(axis);
    return unit ? Math.round(value / unit) * unit : value;
  }
  function bounded(start: number, size: number, axis: Axis): Range {
    const nextSpan = clamp(snap(size, axis), minimum(axis), 1);
    const nextStart = clamp(snap(start, axis), 0, 1 - nextSpan);
    return [nextStart, nextStart + nextSpan];
  }
  function edge(range: Range, index: 0 | 1, position: number, axis: Axis): Range {
    return index === 0
      ? [clamp(snap(position, axis), 0, range[1] - minimum(axis)), range[1]]
      : [range[0], clamp(snap(position, axis), range[0] + minimum(axis), 1)];
  }
  function cornerIndex(part: ChartExplorationCorner, axis: Axis): 0 | 1 {
    if (axis === 'x') return part.endsWith('left') ? 0 : 1;
    return part.startsWith('top') === yIncreasesDown ? 0 : 1;
  }
  const reset = () => onChange({x: [0, 1], y: [0, 1]}, 'end');
  function pan(axis: Axis, direction: number): void {
    const amount = Math.max(increment(axis) ?? 0, span[axis] / 3) * direction;
    onChange({...window, [axis]: bounded(window[axis][0] + amount, span[axis], axis)}, 'end');
  }
  function zoom(factor: number): void {
    function zoomAxis(axis: Axis): Range {
      const size = clamp(snap(span[axis] * factor, axis), minimum(axis), 1);
      return bounded((window[axis][0] + window[axis][1] - size) / 2, size, axis);
    }
    onChange({x: zoomAxis('x'), y: zoomAxis('y')}, 'end');
  }
  function finish(phase: 'end' | 'cancel'): void {
    const current = gesture.current;
    if (!current) return;
    gesture.current = null;
    setDragging(false);
    if (current.element.hasPointerCapture?.(current.pointerId))
      current.element.releasePointerCapture(current.pointerId);
    onChange(phase === 'cancel' ? current.initial : current.latest, phase);
  }
  function pointerDown(event: PointerEvent<HTMLElement>, kind: Gesture['kind']): void {
    event.stopPropagation();
    if (event.button !== 0 || gesture.current || !navigator.current) return;
    const bounds = navigator.current.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return;
    event.preventDefault();
    event.currentTarget.focus();
    navigator.current.setPointerCapture?.(event.pointerId);
    const y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
    gesture.current = {
      kind,
      pointerId: event.pointerId,
      element: navigator.current,
      bounds,
      x: event.clientX,
      y: event.clientY,
      point: {
        x: clamp((event.clientX - bounds.left) / bounds.width, 0, 1),
        y: yIncreasesDown ? y : 1 - y,
      },
      initial: window,
      latest: window,
    };
    setGestureVersion(version);
    setDragging(true);
  }
  function rangeAt(current: Gesture, clientX: number, clientY: number): Window {
    const delta = {
      x: (clientX - current.x) / current.bounds.width,
      y: (directionY * (clientY - current.y)) / current.bounds.height,
    };
    function range(axis: Axis): Range {
      const original = current.initial[axis];
      if (current.kind === 'window')
        return bounded(original[0] + delta[axis], original[1] - original[0], axis);
      if (current.kind !== 'new') {
        const index = cornerIndex(current.kind, axis);
        return edge(original, index, original[index] + delta[axis], axis);
      }
      const start = snap(current.point[axis], axis);
      const end = snap(clamp(current.point[axis] + delta[axis], 0, 1), axis);
      return bounded(Math.min(start, end), Math.max(minimum(axis), Math.abs(end - start)), axis);
    }
    return {x: range('x'), y: range('y')};
  }
  function isClick(current: Gesture, event: PointerEvent): boolean {
    return Math.hypot(event.clientX - current.x, event.clientY - current.y) < 5;
  }
  function pointerMove(event: PointerEvent<HTMLDivElement>): void {
    event.stopPropagation();
    const current = gesture.current;
    if (
      !current ||
      current.pointerId !== event.pointerId ||
      (current.kind === 'new' && isClick(current, event))
    )
      return;
    current.latest = rangeAt(current, event.clientX, event.clientY);
    onChange(current.latest, 'change');
  }
  function pointerUp(event: PointerEvent<HTMLDivElement>): void {
    event.stopPropagation();
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    current.latest =
      current.kind === 'new' && isClick(current, event)
        ? {
            x: bounded(current.point.x - span.x / 2, span.x, 'x'),
            y: bounded(current.point.y - span.y / 2, span.y, 'y'),
          }
        : rangeAt(current, event.clientX, event.clientY);
    finish('end');
  }
  function keyDown(event: KeyboardEvent<HTMLElement>, part: Part): void {
    if (gesture.current) return;
    const horizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
    const vertical = event.key === 'ArrowUp' || event.key === 'ArrowDown';
    const boundary = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : undefined;
    if (!horizontal && !vertical && boundary === undefined) return;
    event.preventDefault();
    event.stopPropagation();
    function range(axis: Axis): Range {
      if (boundary === undefined && ((axis === 'x' && !horizontal) || (axis === 'y' && !vertical)))
        return window[axis];
      const direction =
        axis === 'x'
          ? event.key === 'ArrowLeft'
            ? -1
            : 1
          : event.key === 'ArrowUp'
            ? -directionY
            : directionY;
      const amount =
        (increment(axis) ?? minimum(axis)) * (event.shiftKey ? largeStepMultiplier : 1) * direction;
      if (part === 'window') return bounded(boundary ?? window[axis][0] + amount, span[axis], axis);
      const index = cornerIndex(part, axis);
      return edge(window[axis], index, boundary ?? window[axis][index] + amount, axis);
    }
    onChange({x: range('x'), y: range('y')}, 'end');
  }
  const top = yIncreasesDown ? window.y[0] : 1 - window.y[1];
  return (
    <>
      <div
        data-wcl-chart-exploration-controls=""
        onClick={stopPropagation}
        onPointerDown={stopPropagation}
        onKeyDown={stopPropagation}
      >
        <span data-wcl-chart-exploration-range="">{rangeLabel}</span>
        <div data-wcl-chart-exploration-buttons="">
          <span data-wcl-chart-exploration-trigger="">
            <Dialog
              title={labels.overview}
              description={rangeLabel}
              closeLabel={labels.closeOverview}
              onOpenChange={(open) => {
                if (!open) finish('end');
              }}
              trigger={
                <IconButton variant="quiet" size="compact" label={labels.overview}>
                  <Glyph kind="overview" />
                </IconButton>
              }
              actions={({close}) => (
                <>
                  <Button variant="quiet" onPress={reset}>
                    {labels.reset}
                  </Button>
                  <Button onPress={close}>{labels.done}</Button>
                </>
              )}
            >
              <div
                data-wcl-chart-exploration-overview=""
                data-wcl-chart-rectangular-overview=""
                onClick={stopPropagation}
                onKeyDown={stopPropagation}
              >
                <div
                  data-wcl-chart-rectangular-navigator=""
                  data-dragging={dragging ? '' : undefined}
                  ref={navigator}
                  tabIndex={-1}
                  style={
                    {
                      '--wcl-overview-aspect-ratio':
                        Number.isFinite(aspectRatio) && aspectRatio > 0 ? aspectRatio : 1,
                    } as CSSProperties
                  }
                  onPointerDown={(event) => pointerDown(event, 'new')}
                  onPointerMove={pointerMove}
                  onPointerUp={pointerUp}
                  onPointerCancel={(event) => {
                    event.stopPropagation();
                    if (event.pointerId === gesture.current?.pointerId) finish('cancel');
                  }}
                  onLostPointerCapture={(event) => {
                    event.stopPropagation();
                    if (event.pointerId === gesture.current?.pointerId) finish('cancel');
                  }}
                  onKeyDownCapture={(event) => {
                    if (event.key === 'Escape' && gesture.current) {
                      event.preventDefault();
                      event.stopPropagation();
                      finish('cancel');
                    }
                  }}
                >
                  <div data-wcl-chart-exploration-reference="" aria-hidden="true">
                    {overview}
                  </div>
                  <div
                    data-wcl-chart-rectangular-window=""
                    role="group"
                    aria-label={`${labels.window}: ${formatWindow(window)}`}
                    aria-describedby={instructionId}
                    tabIndex={0}
                    style={{
                      left: `${window.x[0] * 100}%`,
                      top: `${top * 100}%`,
                      width: `${span.x * 100}%`,
                      height: `${span.y * 100}%`,
                    }}
                    onPointerDown={(event) => pointerDown(event, 'window')}
                    onKeyDown={(event) => keyDown(event, 'window')}
                  />
                  {corners.map((corner) => (
                    <button
                      key={corner}
                      type="button"
                      data-wcl-chart-rectangular-corner={corner}
                      aria-label={labels.corner(corner)}
                      aria-describedby={instructionId}
                      style={{
                        left: `${window.x[cornerIndex(corner, 'x')] * 100}%`,
                        top: `${(corner.startsWith('top') ? top : top + span.y) * 100}%`,
                      }}
                      onPointerDown={(event) => pointerDown(event, corner)}
                      onKeyDown={(event) => keyDown(event, corner)}
                    />
                  ))}
                </div>
                <div data-wcl-chart-exploration-extents="">
                  <span>{fullRangeLabel}</span>
                </div>
                <p data-wcl-chart-rectangular-instructions="" id={instructionId}>
                  {labels.instructions}
                </p>
              </div>
            </Dialog>
          </span>
          <IconButton
            variant="quiet"
            size="compact"
            label={labels.zoomOut}
            isDisabled={span.x >= 1 && span.y >= 1}
            onPress={() => zoom(2)}
          >
            <Glyph kind="minus" />
          </IconButton>
          <IconButton
            variant="quiet"
            size="compact"
            label={labels.zoomIn}
            isDisabled={
              span.x <= minimum('x') + Number.EPSILON && span.y <= minimum('y') + Number.EPSILON
            }
            onPress={() => zoom(0.5)}
          >
            <Glyph kind="plus" />
          </IconButton>
          <IconButton
            variant="quiet"
            size="compact"
            label={labels.reset}
            isDisabled={span.x >= 1 && span.y >= 1}
            onPress={reset}
          >
            <Glyph kind="reset" />
          </IconButton>
        </div>
      </div>
      <div
        data-wcl-chart-exploration-pan=""
        onClick={stopPropagation}
        onPointerDown={stopPropagation}
        onKeyDown={stopPropagation}
      >
        <IconButton
          variant="quiet"
          size="compact"
          label={labels.panLeft}
          isDisabled={window.x[0] <= 0}
          onPress={() => pan('x', -1)}
        >
          <Glyph kind="back" />
        </IconButton>
        <IconButton
          variant="quiet"
          size="compact"
          label={labels.panDown}
          isDisabled={yIncreasesDown ? window.y[1] >= 1 : window.y[0] <= 0}
          onPress={() => pan('y', directionY)}
        >
          <Glyph kind="down" />
        </IconButton>
        <IconButton
          variant="quiet"
          size="compact"
          label={labels.panUp}
          isDisabled={yIncreasesDown ? window.y[0] <= 0 : window.y[1] >= 1}
          onPress={() => pan('y', -directionY)}
        >
          <Glyph kind="up" />
        </IconButton>
        <IconButton
          variant="quiet"
          size="compact"
          label={labels.panRight}
          isDisabled={window.x[1] >= 1}
          onPress={() => pan('x', 1)}
        >
          <Glyph kind="forward" />
        </IconButton>
      </div>
    </>
  );
}
