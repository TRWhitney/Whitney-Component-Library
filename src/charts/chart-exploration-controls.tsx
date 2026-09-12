'use client';

import type {ChartExplorationPresentation} from './chart-types.js';

import {
  useEffect,
  useId,
  useRef,
  useState,
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

type WindowRange = readonly [number, number];
type WindowPart = 'window' | 'start' | 'end';

export interface ChartExplorationControlLabels {
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
}

export interface ChartExplorationControlsProps extends ChartExplorationPresentation {
  readonly version?: string;
  readonly largeStepMultiplier?: number;
  readonly step?: number;
  readonly isZoomInDisabled?: boolean;
  readonly window: WindowRange;
  readonly minimumSpan: number;
  readonly labels: ChartExplorationControlLabels;
  readonly rangeLabel: string;
  readonly fullRangeLabels: readonly [string, string];
  readonly formatWindow: (range: WindowRange) => string;
  readonly onChange: (range: WindowRange, phase: 'change' | 'end' | 'cancel') => void;
  readonly overview: ReactNode;
}

interface Gesture {
  readonly kind: WindowPart | 'new';
  readonly pointerId: number;
  readonly element: HTMLDivElement;
  readonly x: number;
  readonly width: number;
  readonly point: number;
  readonly initial: WindowRange;
  latest: WindowRange;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

function bounded(start: number, span: number): WindowRange {
  const left = clamp(start, 0, 1 - span);
  return [left, left + span];
}

function stopPropagation(event: SyntheticEvent): void {
  event.stopPropagation();
}

export function ChartExplorationControls({
  presentation = 'chart',
  renderControls,
  version,
  largeStepMultiplier = 3,
  isZoomInDisabled = false,
  step,
  window,
  minimumSpan,
  labels,
  rangeLabel,
  fullRangeLabels,
  formatWindow,
  onChange,
  overview,
}: ChartExplorationControlsProps): ReactElement {
  const commandScope = useRef<HTMLDivElement>(null);
  const instructionId = useId();
  const navigator = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const [draggingState, setDragging] = useState(false);
  const [gestureVersion, setGestureVersion] = useState(version);
  const dragging = draggingState && gestureVersion === version;
  useEffect(() => {
    const current = gesture.current;
    if (!current) return;
    gesture.current = null;
    if (current.element.hasPointerCapture?.(current.pointerId))
      current.element.releasePointerCapture(current.pointerId);
  }, [version]);
  const span = window[1] - window[0];
  const minimum = clamp(minimumSpan, Number.EPSILON, 1);
  const reset = () => onChange([0, 1], 'end');
  const pan = (amount: number) => onChange(bounded(window[0] + amount, span), 'end');
  const zoom = (factor: number) => {
    const nextSpan = clamp(span * factor, minimum, 1);
    onChange(bounded((window[0] + window[1] - nextSpan) / 2, nextSpan), 'end');
  };

  const zoomInDisabled = isZoomInDisabled || span <= minimum + Number.EPSILON;
  function finish(phase: 'end' | 'cancel'): void {
    const current = gesture.current;
    if (!current) return;
    gesture.current = null;
    setDragging(false);
    if (current.element.hasPointerCapture?.(current.pointerId)) {
      current.element.releasePointerCapture(current.pointerId);
    }
    onChange(phase === 'cancel' ? current.initial : current.latest, phase);
  }

  function pointerDown(event: PointerEvent<HTMLDivElement>, kind: Gesture['kind']): void {
    event.stopPropagation();
    if (event.button !== 0 || gesture.current || !navigator.current) return;
    const bounds = navigator.current.getBoundingClientRect();
    if (bounds.width <= 0) return;
    event.preventDefault();
    event.currentTarget.focus();
    navigator.current.setPointerCapture?.(event.pointerId);
    gesture.current = {
      kind,
      pointerId: event.pointerId,
      element: navigator.current,
      x: event.clientX,
      width: bounds.width,
      point: clamp((event.clientX - bounds.left) / bounds.width, 0, 1),
      initial: window,
      latest: window,
    };
    setGestureVersion(version);
    setDragging(true);
  }

  function rangeAt(current: Gesture, clientX: number): WindowRange {
    const delta = (clientX - current.x) / current.width;
    const [start, end] = current.initial;
    if (current.kind === 'window') return bounded(start + delta, end - start);
    if (current.kind === 'start') return [clamp(start + delta, 0, end - minimum), end];
    if (current.kind === 'end') return [start, clamp(end + delta, start + minimum, 1)];
    const point = clamp(current.point + delta, 0, 1);
    return bounded(
      Math.min(point, current.point),
      Math.max(minimum, Math.abs(point - current.point)),
    );
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>): void {
    event.stopPropagation();
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    if (current.kind === 'new' && Math.abs(event.clientX - current.x) < 5) return;
    current.latest = rangeAt(current, event.clientX);
    onChange(current.latest, 'change');
  }

  function pointerUp(event: PointerEvent<HTMLDivElement>): void {
    event.stopPropagation();
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    current.latest =
      current.kind === 'new' && Math.abs(event.clientX - current.x) < 5
        ? bounded(
            current.point - (current.initial[1] - current.initial[0]) / 2,
            current.initial[1] - current.initial[0],
          )
        : rangeAt(current, event.clientX);
    finish('end');
  }

  function keyDown(event: KeyboardEvent<HTMLDivElement>, kind: WindowPart): void {
    if (gesture.current) return;
    const keyboardStep = (step ?? minimum) * (event.shiftKey ? largeStepMultiplier : 1);
    const delta =
      event.key === 'ArrowLeft' || event.key === 'ArrowDown'
        ? -keyboardStep
        : event.key === 'ArrowRight' || event.key === 'ArrowUp'
          ? keyboardStep
          : 0;
    if (!delta && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    event.stopPropagation();
    const position = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : undefined;
    if (kind === 'window') onChange(bounded(position ?? window[0] + delta, span), 'end');
    else if (kind === 'start')
      onChange([clamp(position ?? window[0] + delta, 0, window[1] - minimum), window[1]], 'end');
    else onChange([window[0], clamp(position ?? window[1] + delta, window[0] + minimum, 1)], 'end');
  }

  const overviewControl = (
    <Dialog
      title={labels.overview}
      description={rangeLabel}
      closeLabel={labels.closeOverview}
      onOpenChange={(isOpen) => {
        if (!isOpen) finish('end');
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
      <div data-wcl-chart-exploration-overview="">
        <div
          data-wcl-chart-exploration-navigator=""
          data-dragging={dragging ? '' : undefined}
          ref={navigator}
          tabIndex={-1}
          onPointerDown={(event) => pointerDown(event, 'new')}
          onPointerMove={pointerMove}
          onPointerUp={pointerUp}
          onPointerCancel={(event) => {
            event.stopPropagation();
            if (event.pointerId === gesture.current?.pointerId) finish('cancel');
          }}
          onLostPointerCapture={(event) => {
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
            data-wcl-chart-exploration-shade=""
            style={{left: 0, width: `${window[0] * 100}%`}}
          />
          <div
            data-wcl-chart-exploration-shade=""
            style={{left: `${window[1] * 100}%`, right: 0}}
          />
          <div
            data-wcl-chart-exploration-window=""
            role="slider"
            aria-label={labels.window}
            aria-describedby={instructionId}
            aria-orientation="horizontal"
            aria-valuemin={0}
            aria-valuemax={1 - span}
            aria-valuenow={window[0]}
            aria-valuetext={formatWindow(window)}
            tabIndex={0}
            style={{left: `${window[0] * 100}%`, width: `${span * 100}%`}}
            onPointerDown={(event) => pointerDown(event, 'window')}
            onKeyDown={(event) => keyDown(event, 'window')}
          />
          {(['start', 'end'] as const).map((part) => (
            <div
              key={part}
              data-wcl-chart-exploration-handle={part}
              role="slider"
              aria-label={labels[part]}
              aria-describedby={instructionId}
              aria-orientation="horizontal"
              aria-valuemin={part === 'start' ? 0 : window[0] + minimum}
              aria-valuemax={part === 'start' ? window[1] - minimum : 1}
              aria-valuenow={window[part === 'start' ? 0 : 1]}
              aria-valuetext={formatWindow(window)}
              tabIndex={0}
              style={{left: `${window[part === 'start' ? 0 : 1] * 100}%`}}
              onPointerDown={(event) => pointerDown(event, part)}
              onKeyDown={(event) => keyDown(event, part)}
            />
          ))}
        </div>
        <div data-wcl-chart-exploration-extents="">
          <span>{fullRangeLabels[0]}</span>
          <span>{fullRangeLabels[1]}</span>
        </div>
        <p data-wcl-chart-exploration-instructions="" id={instructionId}>
          {labels.instructions}
        </p>
      </div>
    </Dialog>
  );
  const zoomOutControl = (
    <IconButton
      variant="quiet"
      size="compact"
      label={labels.zoomOut}
      isDisabled={span >= 1}
      onPress={() => zoom(2)}
    >
      <Glyph kind="minus" />
    </IconButton>
  );
  const zoomInControl = (
    <IconButton
      variant="quiet"
      size="compact"
      label={labels.zoomIn}
      isDisabled={zoomInDisabled}
      onPress={() => zoom(0.5)}
    >
      <Glyph kind="plus" />
    </IconButton>
  );
  const resetControl = (
    <IconButton
      variant="quiet"
      size="compact"
      label={labels.reset}
      isDisabled={span >= 1}
      onPress={reset}
    >
      <Glyph kind="reset" />
    </IconButton>
  );
  const panBackwardControl = (
    <IconButton
      variant="quiet"
      size="compact"
      label={labels.panBackward}
      isDisabled={window[0] <= 0}
      onPress={() => pan(-Math.max(step ?? 0, span / 3))}
    >
      <Glyph kind="back" />
    </IconButton>
  );
  const panForwardControl = (
    <IconButton
      variant="quiet"
      size="compact"
      label={labels.panForward}
      isDisabled={window[1] >= 1}
      onPress={() => pan(Math.max(step ?? 0, span / 3))}
    >
      <Glyph kind="forward" />
    </IconButton>
  );
  const commandContent = {
    overview: overviewControl,
    zoomIn: zoomInControl,
    zoomOut: zoomOutControl,
    reset: resetControl,
    rangeLabel,
    pan: (
      <>
        {panBackwardControl}
        {panForwardControl}
      </>
    ),
  };
  const controls = (
    <div
      ref={commandScope}
      data-wcl-chart-command-scope=""
      data-presentation={renderControls ? 'panel' : presentation}
    >
      <div
        data-wcl-chart-exploration-controls=""
        onClick={stopPropagation}
        onPointerDown={stopPropagation}
        onKeyDown={stopPropagation}
      >
        <span data-wcl-chart-exploration-range="">{rangeLabel}</span>
        <div data-wcl-chart-exploration-buttons="">
          <span data-wcl-chart-exploration-trigger="">{overviewControl}</span>
          {zoomOutControl}
          {zoomInControl}
          {resetControl}
        </div>
      </div>
      <div
        data-wcl-chart-exploration-pan=""
        onClick={stopPropagation}
        onPointerDown={stopPropagation}
        onKeyDown={stopPropagation}
      >
        {panBackwardControl}
        {panForwardControl}
      </div>
    </div>
  );
  return renderControls ? (
    <div ref={commandScope} data-wcl-chart-command-scope="" data-presentation="panel">
      {renderControls(commandContent)}
    </div>
  ) : (
    controls
  );
}
