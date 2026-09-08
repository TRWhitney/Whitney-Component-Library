import {useEffect, useRef, useState} from 'react';
import type {
  ChartActivation,
  ChartDomainValue,
  ChartSelectionItem,
  LineChartInteraction,
} from './chart-types.js';

export interface InteractionRow<Datum extends object, Category extends ChartDomainValue> {
  readonly id: string;
  readonly category: Category;
  readonly datum: Datum;
  readonly values: ChartActivation<Datum, Category>['values'];
}
export interface InteractionPoint {
  readonly item: ChartSelectionItem;
  readonly index: number;
  readonly x: number;
  readonly y: number;
}
export interface SelectionBox {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}
export const selectionKey = (item: ChartSelectionItem): string =>
  JSON.stringify([item.rowId, item.seriesId ?? null]);

export function nearestInteraction(
  points: readonly InteractionPoint[],
  x: number,
  y: number,
  target: 'category' | 'point',
): InteractionPoint | undefined {
  let column: InteractionPoint | undefined;
  for (const point of points) {
    if (column === undefined || Math.abs(point.x - x) < Math.abs(column.x - x)) column = point;
  }
  if (target === 'category' || column === undefined) return column;
  let nearest = column;
  for (const point of points) {
    if (point.x === column.x && Math.abs(point.y - y) < Math.abs(nearest.y - y)) nearest = point;
  }
  return nearest;
}

interface Gesture {
  readonly pointerId: number;
  readonly element: SVGSVGElement;
  readonly x: number;
  readonly y: number;
  readonly clientX: number;
  readonly clientY: number;
  readonly before: readonly ChartSelectionItem[];
  readonly add: boolean;
  readonly remove: boolean;
  moved: boolean;
  activated: boolean;
}

export function useLineChartInteraction<Datum extends object, Category extends ChartDomainValue>(
  configuration: LineChartInteraction<Datum, Category> | undefined,
  rows: readonly InteractionRow<Datum, Category>[],
  version: string,
  data: readonly Datum[],
) {
  const selection = configuration?.selection;
  const [internal, setInternal] = useState<readonly ChartSelectionItem[]>(
    selection?.defaultSelectedItems ?? [],
  );
  const [box, setBox] = useState<SelectionBox | null>(null);
  const [preview, setPreview] = useState<readonly ChartSelectionItem[] | null>(null);
  const [pulse, setPulse] = useState<{item: ChartSelectionItem; sequence: number} | null>(null);
  const sequence = useRef(0);
  const activationCallback = useRef(configuration?.onActivate);
  useEffect(() => {
    activationCallback.current = configuration?.onActivate;
  }, [configuration?.onActivate]);
  const gesture = useRef<Gesture | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const allowed = new Set(
    rows.flatMap((row) =>
      configuration?.target === 'category'
        ? [selectionKey({rowId: row.id})]
        : row.values.map((value) => selectionKey({rowId: row.id, seriesId: value.seriesId})),
    ),
  );
  const normalized = (items: readonly ChartSelectionItem[]) => [
    ...new Map(
      items
        .filter((item) => allowed.has(selectionKey(item)))
        .map((item) => [selectionKey(item), item]),
    ).values(),
  ];
  const selected = normalized(selection?.selectedItems ?? internal);
  const allowedVersion = JSON.stringify([...allowed]);
  const [previousAllowed, setPreviousAllowed] = useState(allowedVersion);
  if (allowedVersion !== previousAllowed) {
    setPreviousAllowed(allowedVersion);
    setInternal(normalized(internal));
  }
  const clearHold = () => {
    clearTimeout(holdTimer.current);
    holdTimer.current = undefined;
  };
  const release = () => {
    const current = gesture.current;
    if (current?.element.hasPointerCapture?.(current.pointerId))
      current.element.releasePointerCapture(current.pointerId);
    gesture.current = null;
    clearHold();
  };
  const cancel = () => {
    release();
    setBox(null);
    setPreview(null);
  };
  const gestureVersion = JSON.stringify([version, configuration?.target, selection !== undefined]);
  const [previousGestureVersion, setPreviousGestureVersion] = useState(gestureVersion);
  const [previousData, setPreviousData] = useState(data);
  if (gestureVersion !== previousGestureVersion || data !== previousData) {
    setPreviousData(data);
    setPreviousGestureVersion(gestureVersion);
    setBox(null);
    setPreview(null);
    setPulse(null);
  }
  useEffect(() => {
    // Identity, geometry, and visibility changes invalidate an in-flight gesture.
    release();
    clearTimeout(pulseTimer.current);
    return () => {
      release();
      clearTimeout(pulseTimer.current);
    };
    // The serialized version describes data/visibility, not callback identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gestureVersion, data]);

  const change = (items: readonly ChartSelectionItem[]) => {
    if (!selection) return;
    const next = normalized(items);
    if (selection.selectedItems === undefined) setInternal(next);
    selection.onSelectionChange?.(next);
  };
  const activate = (
    item: ChartSelectionItem,
    input: ChartActivation<Datum, Category>['input'],
    activationOnly = false,
  ) => {
    if (selection && !activationOnly) {
      change(
        selected.some((value) => selectionKey(value) === selectionKey(item))
          ? selected.filter((value) => selectionKey(value) !== selectionKey(item))
          : [...selected, item],
      );
      return;
    }
    const callback = activationCallback.current;
    if (!callback) return;
    const row = rows.find((value) => value.id === item.rowId);
    if (!row) return;
    clearTimeout(pulseTimer.current);
    setPulse({item, sequence: ++sequence.current});
    pulseTimer.current = setTimeout(() => setPulse(null), 650);
    callback({
      item,
      category: row.category,
      datum: row.datum,
      input,
      values: row.values.filter(
        (value) => item.seriesId === undefined || value.seriesId === item.seriesId,
      ),
    });
  };
  const begin = (
    event: {
      pointerId: number;
      currentTarget: SVGSVGElement;
      clientX: number;
      clientY: number;
      pointerType: string;
      shiftKey: boolean;
      ctrlKey: boolean;
      metaKey: boolean;
      altKey: boolean;
    },
    point: InteractionPoint,
    x: number,
    y: number,
  ) => {
    if (gesture.current !== null) return;
    gesture.current = {
      pointerId: event.pointerId,
      element: event.currentTarget,
      x,
      y,
      clientX: event.clientX,
      clientY: event.clientY,
      before: selected,
      add: event.shiftKey || event.ctrlKey || event.metaKey,
      remove: event.altKey,
      moved: false,
      activated: false,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    if (event.pointerType === 'touch' && selection && configuration?.onActivate) {
      holdTimer.current = setTimeout(() => {
        if (gesture.current === null || gesture.current.moved) return;
        gesture.current.activated = true;
        activate(point.item, 'touch', true);
      }, 500);
    }
  };
  const move = (
    event: {pointerId: number; clientX: number; clientY: number},
    x: number,
    y: number,
    points: readonly InteractionPoint[],
    bounds: {left: number; right: number; top: number; bottom: number},
  ) => {
    const start = gesture.current;
    if (!start || start.pointerId !== event.pointerId) return false;
    if (start.activated) return true;
    if (
      !start.moved &&
      Math.hypot(event.clientX - start.clientX, event.clientY - start.clientY) < 5
    )
      return false;
    clearHold();
    start.moved = true;
    if (!selection) return true;
    const endX = Math.max(bounds.left, Math.min(bounds.right, x));
    const endY = Math.max(bounds.top, Math.min(bounds.bottom, y));
    const rect = {
      x: Math.min(start.x, endX),
      y: Math.min(start.y, endY),
      width: Math.abs(start.x - endX),
      height: Math.abs(start.y - endY),
    };
    let chosen: readonly ChartSelectionItem[];
    if (configuration?.target === 'category') {
      const first = nearestInteraction(points, start.x, start.y, 'category');
      const last = nearestInteraction(points, endX, endY, 'category');
      chosen =
        first && last
          ? points
              .filter((p) => p.x >= Math.min(first.x, last.x) && p.x <= Math.max(first.x, last.x))
              .map((p) => p.item)
          : [];
      rect.y = bounds.top;
      rect.height = bounds.bottom - bounds.top;
    } else {
      chosen = points
        .filter(
          (p) =>
            p.x >= rect.x &&
            p.x <= rect.x + rect.width &&
            p.y >= rect.y &&
            p.y <= rect.y + rect.height,
        )
        .map((p) => p.item);
    }
    const keys = new Set(chosen.map(selectionKey));
    const next = start.remove
      ? start.before.filter((p) => !keys.has(selectionKey(p)))
      : start.add
        ? [...start.before, ...chosen]
        : chosen;
    setPreview(normalized(next));
    setBox(rect);
    return true;
  };
  const end = (
    event: {pointerId: number; pointerType: string; ctrlKey: boolean; metaKey: boolean},
    point: InteractionPoint | undefined,
  ) => {
    const current = gesture.current;
    if (!current || event.pointerId !== current.pointerId) return;
    if (current.moved) {
      if (preview !== null) change(preview);
    } else if (!current.activated && point)
      activate(
        point.item,
        event.pointerType === 'touch' ? 'touch' : 'pointer',
        event.ctrlKey || event.metaKey,
      );
    release();
    setPreview(null);
    setBox(null);
  };
  return {
    selected: preview ?? selected,
    box,
    pulse,
    activate,
    change,
    begin,
    move,
    end,
    cancel,
    isHolding: () => gesture.current?.activated === true || holdTimer.current !== undefined,
  };
}
