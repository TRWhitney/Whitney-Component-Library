import {useEffect, useRef, type PointerEvent} from 'react';

import type {ChartRectangularWindow} from './chart-rectangular-exploration-types.js';
type Range = ChartRectangularWindow<number, number>;
type Coordinate = {readonly x: number; readonly y: number};
type Point = {readonly x: number; readonly y: number; readonly axis: Coordinate};
interface Gesture {
  readonly initial: Range;
  readonly center: Coordinate;
  readonly distance: number;
  latest: Range;
}
/** Arbitrate touch exploration and focused middle-button panning before selection. */
export function useChartRectangularExplorationGesture<Element extends HTMLElement | SVGSVGElement>({
  enabled,
  window,
  minimumSpan,
  onChange,
  onStart,
  version,
}: {
  readonly enabled: boolean;
  readonly window: Range;
  readonly minimumSpan: Coordinate;
  readonly onChange: (range: Range, phase: 'change' | 'end' | 'cancel') => void;
  readonly onStart: () => void;
  readonly version: string;
}) {
  const points = useRef(new Map<number, Point>());
  const gesture = useRef<Gesture | null>(null);
  const mouse = useRef<{
    readonly pointerId: number;
    readonly start: Coordinate;
    readonly initial: Range;
    readonly dispose: () => void;
    latest: Range;
  } | null>(null);
  const callbacks = useRef({onChange, onStart});
  useEffect(() => {
    callbacks.current = {onChange, onStart};
  });
  useEffect(() => {
    points.current.clear();
    gesture.current = null;
    return () => {
      const current = mouse.current;
      mouse.current = null;
      current?.dispose();
    };
  }, [version, enabled]);
  const finishMouse = (cancel: boolean) => {
    const current = mouse.current;
    if (!current) return;
    mouse.current = null;
    current.dispose();
    callbacks.current.onChange(
      cancel ? current.initial : current.latest,
      cancel ? 'cancel' : 'end',
    );
  };
  const stop = (event: PointerEvent<Element>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const pointerDown = (
    event: PointerEvent<Element>,
    coordinateAt: (event: PointerEvent<Element>) => Coordinate,
  ) => {
    if (enabled && event.pointerType === 'mouse' && event.button === 1) {
      const canvas = event.currentTarget.closest('[data-wcl-chart-canvas]');
      const active = event.currentTarget.ownerDocument.activeElement;
      const focused =
        canvas &&
        (active === canvas ||
          (active instanceof HTMLButtonElement &&
            active.closest('[data-wcl-chart-command-scope]')?.closest('figure') ===
              canvas.closest('figure')));
      if (!focused || mouse.current || gesture.current || points.current.size > 0) return;
      stop(event);
      callbacks.current.onStart();
      const element = event.currentTarget;
      const pointerId = event.pointerId;
      const document = element.ownerDocument;
      const cancelKey = (event: KeyboardEvent) => {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        event.stopPropagation();
        finishMouse(true);
      };
      const blur = () => finishMouse(true);
      mouse.current = {
        pointerId,
        start: coordinateAt(event),
        initial: window,
        latest: window,
        dispose: () => {
          document.removeEventListener('keydown', cancelKey, true);
          document.defaultView?.removeEventListener('blur', blur);
          element.removeAttribute('data-wcl-chart-panning');
          if (element.hasPointerCapture?.(pointerId)) element.releasePointerCapture(pointerId);
        },
      };
      document.addEventListener('keydown', cancelKey, true);
      document.defaultView?.addEventListener('blur', blur);
      element.setAttribute('data-wcl-chart-panning', '');
      element.setPointerCapture?.(pointerId);
      return;
    }
    if (mouse.current) return;
    if (!enabled || event.pointerType !== 'touch') return;
    const p = coordinateAt(event);
    points.current.set(event.pointerId, {x: event.clientX, y: event.clientY, axis: p});
    if (points.current.size < 2 && !gesture.current) return;
    stop(event);
    if (!gesture.current) {
      const [a, b] = [...points.current.values()];
      if (!a || !b) return;
      callbacks.current.onStart();
      gesture.current = {
        initial: window,
        latest: window,
        center: {x: (a.axis.x + b.axis.x) / 2, y: (a.axis.y + b.axis.y) / 2},
        distance: Math.max(1, Math.hypot(b.x - a.x, b.y - a.y)),
      };
    }
    for (const id of points.current.keys()) event.currentTarget.setPointerCapture?.(id);
  };
  const pointerMove = (
    event: PointerEvent<Element>,
    coordinateAt: (event: PointerEvent<Element>) => Coordinate,
  ) => {
    const pan = mouse.current;
    if (pan && event.pointerId === pan.pointerId) {
      stop(event);
      if ((event.buttons & 4) === 0) {
        finishMouse(false);
        return;
      }
      const point = coordinateAt(event);
      const nextAxis = (axis: 'x' | 'y'): readonly [number, number] => {
        const span = pan.initial[axis][1] - pan.initial[axis][0];
        const start = Math.max(
          0,
          Math.min(1 - span, pan.initial[axis][0] - (point[axis] - pan.start[axis]) * span),
        );
        return [start, start + span];
      };
      pan.latest = {x: nextAxis('x'), y: nextAxis('y')};
      callbacks.current.onChange(pan.latest, 'change');
      return;
    }
    if (!enabled || event.pointerType !== 'touch' || !points.current.has(event.pointerId)) return;
    const p = coordinateAt(event);
    points.current.set(event.pointerId, {x: event.clientX, y: event.clientY, axis: p});
    const current = gesture.current;
    if (!current) return;
    stop(event);
    const [a, b] = [...points.current.values()];
    if (!a || !b) return;
    const distance = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
    const nextAxis = (axis: 'x' | 'y'): readonly [number, number] => {
      const center = (a.axis[axis] + b.axis[axis]) / 2;
      const initialSpan = current.initial[axis][1] - current.initial[axis][0];
      const span = Math.max(
        minimumSpan[axis],
        Math.min(1, (initialSpan * current.distance) / distance),
      );
      const anchor = current.initial[axis][0] + current.center[axis] * initialSpan;
      const start = Math.max(0, Math.min(1 - span, anchor - center * span));
      return [start, start + span];
    };
    current.latest = {x: nextAxis('x'), y: nextAxis('y')};
    callbacks.current.onChange(current.latest, 'change');
  };
  const pointerEnd = (event: PointerEvent<Element>, cancel = false) => {
    if (mouse.current?.pointerId === event.pointerId) {
      stop(event);
      finishMouse(cancel);
      return;
    }
    if (event.pointerType !== 'touch' || !points.current.has(event.pointerId)) return;
    points.current.delete(event.pointerId);
    const current = gesture.current;
    if (!current) return;
    stop(event);
    if (cancel || points.current.size === 0) {
      gesture.current = null;
      points.current.clear();
      callbacks.current.onChange(
        cancel ? current.initial : current.latest,
        cancel ? 'cancel' : 'end',
      );
    }
  };
  const cancel = () => {
    finishMouse(true);
    const current = gesture.current;
    gesture.current = null;
    points.current.clear();
    if (current) callbacks.current.onChange(current.initial, 'cancel');
  };
  return {pointerDown, pointerMove, pointerEnd, cancel};
}
