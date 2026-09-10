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
/** Arbitrate native touch pointers before chart selection can commit. */
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
  const callbacks = useRef({onChange, onStart});
  useEffect(() => {
    callbacks.current = {onChange, onStart};
  });
  useEffect(() => {
    points.current.clear();
    gesture.current = null;
  }, [version, enabled]);
  const stop = (event: PointerEvent<Element>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const pointerDown = (
    event: PointerEvent<Element>,
    coordinateAt: (event: PointerEvent<Element>) => Coordinate,
  ) => {
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
    const current = gesture.current;
    gesture.current = null;
    points.current.clear();
    if (current) callbacks.current.onChange(current.initial, 'cancel');
  };
  return {pointerDown, pointerMove, pointerEnd, cancel};
}
