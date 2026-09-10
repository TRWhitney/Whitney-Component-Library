import {useEffect, useRef, type PointerEvent} from 'react';

type Range = readonly [number, number];
type Point = {readonly x: number; readonly y: number; readonly axis: number};
interface Gesture {
  readonly initial: Range;
  readonly center: number;
  readonly distance: number;
  latest: Range;
}
/** Arbitrate native touch pointers before chart selection can commit. */
export function useChartExplorationGesture({
  enabled,
  window,
  minimumSpan,
  onChange,
  onStart,
  version,
}: {
  readonly enabled: boolean;
  readonly window: Range;
  readonly minimumSpan: number;
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
  const coordinate = (p: Point) => p.axis;
  const stop = (event: PointerEvent<SVGSVGElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const pointerDown = (
    event: PointerEvent<SVGSVGElement>,
    coordinateAt: (event: PointerEvent<SVGSVGElement>) => number,
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
        center: (coordinate(a) + coordinate(b)) / 2,
        distance: Math.max(1, Math.hypot(b.x - a.x, b.y - a.y)),
      };
    }
    for (const id of points.current.keys()) event.currentTarget.setPointerCapture?.(id);
  };
  const pointerMove = (
    event: PointerEvent<SVGSVGElement>,
    coordinateAt: (event: PointerEvent<SVGSVGElement>) => number,
  ) => {
    if (!enabled || event.pointerType !== 'touch' || !points.current.has(event.pointerId)) return;
    const p = coordinateAt(event);
    points.current.set(event.pointerId, {x: event.clientX, y: event.clientY, axis: p});
    const current = gesture.current;
    if (!current) return;
    stop(event);
    const [a, b] = [...points.current.values()];
    if (!a || !b) return;
    const center = (coordinate(a) + coordinate(b)) / 2;
    const distance = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
    const initialSpan = current.initial[1] - current.initial[0];
    const span = Math.max(minimumSpan, Math.min(1, (initialSpan * current.distance) / distance));
    const anchor = current.initial[0] + current.center * initialSpan;
    const start = Math.max(0, Math.min(1 - span, anchor - center * span));
    current.latest = [start, start + span];
    callbacks.current.onChange(current.latest, 'change');
  };
  const pointerEnd = (event: PointerEvent<SVGSVGElement>, cancel = false) => {
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
