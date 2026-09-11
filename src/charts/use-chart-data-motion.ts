import {useEffect, useRef, useState} from 'react';

export const chartDataMotionDuration = 240;
export const chartDataMotionEase = (progress: number): number => 1 - (1 - progress) ** 3;

export interface ChartMotionTarget<Value> {
  readonly id: string;
  readonly value: Value;
}

export interface ChartMotionItem<Value> extends ChartMotionTarget<Value> {
  /** The current supplied value. Departures retain their last supplied value. */
  readonly target: Value;
  readonly opacity: number;
  readonly exiting: boolean;
}

export interface ChartDataMotionOptions<Value> {
  /** Changes only when the numeric geometry or membership changes. */
  readonly version: string;
  /** Configuration, visibility or navigation changes that must settle immediately. */
  readonly resetKey: string;
  readonly enabled: boolean;
  readonly interpolate: (from: Value, to: Value, progress: number) => Value;
}

function settled<Value>(targets: readonly ChartMotionTarget<Value>[]): ChartMotionItem<Value>[] {
  return targets.map(({id, value}) => ({id, value, target: value, opacity: 1, exiting: false}));
}

/** Interpolate displayed data by identity while keeping current supplied data separate. */
export function useChartDataMotion<Value>(
  targets: readonly ChartMotionTarget<Value>[],
  {version, resetKey, enabled, interpolate}: ChartDataMotionOptions<Value>,
): readonly ChartMotionItem<Value>[] {
  const [reduced, setReduced] = useState(false);
  const animate = enabled && !reduced;
  const latest = useRef({targets, interpolate});
  useEffect(() => {
    latest.current = {targets, interpolate};
  }, [targets, interpolate]);
  const [state, setState] = useState(() => ({version, resetKey, animate, items: settled(targets)}));
  const current = useRef(state);

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!media) return;
    const update = (): void => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const goal = {version, resetKey, animate, ...latest.current};
    const previous = current.current;
    if (
      previous.version === goal.version &&
      previous.resetKey === goal.resetKey &&
      previous.animate === goal.animate
    )
      return;
    const publish = (items: ChartMotionItem<Value>[]): void => {
      const next = {version: goal.version, resetKey: goal.resetKey, animate: goal.animate, items};
      current.current = next;
      setState(next);
    };
    const next = settled(goal.targets);
    if (
      previous.version === goal.version ||
      !goal.animate ||
      !previous.animate ||
      previous.resetKey !== goal.resetKey ||
      typeof requestAnimationFrame === 'undefined'
    ) {
      publish(next);
      return;
    }
    const previousById = new Map(previous.items.map((item) => [item.id, item]));
    const nextIds = new Set(goal.targets.map((item) => item.id));
    const arrivals = goal.targets.map(({id, value}) => {
      const old = previousById.get(id);
      return {
        id,
        from: old?.value ?? value,
        to: value,
        opacity: old?.opacity ?? 0,
      };
    });
    const departures = previous.items.filter((item) => !nextIds.has(item.id));
    const started = performance.now();
    let frame: number;
    const display = (progress: number): ChartMotionItem<Value>[] => [
      ...arrivals.map(({id, from, to, opacity}) => ({
        id,
        value: goal.interpolate(from, to, progress),
        target: to,
        opacity: opacity + (1 - opacity) * progress,
        exiting: false,
      })),
      ...departures.map((item) => ({
        ...item,
        opacity: item.opacity * (1 - progress),
        exiting: true,
      })),
    ];
    // The render already retains the current geometry and introduces arrivals at zero
    // opacity. Publish only when the clock advances, avoiding a duplicate full chart render.
    const step = (time: number): void => {
      const progress = Math.max(0, Math.min(1, (time - started) / chartDataMotionDuration));
      publish(progress === 1 ? next : display(chartDataMotionEase(progress)));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [version, resetKey, animate]);

  if (!animate || !state.animate || state.resetKey !== resetKey) return settled(targets);
  const supplied = new Map(targets.map((item) => [item.id, item.value]));
  const displayed = new Set(state.items.map((item) => item.id));
  return [
    ...state.items.map((item) => ({
      ...item,
      target: supplied.get(item.id) ?? item.target,
      exiting: !supplied.has(item.id),
    })),
    ...targets
      .filter((item) => !displayed.has(item.id))
      .map(({id, value}) => ({
        id,
        value,
        target: value,
        opacity: 0,
        exiting: false,
      })),
  ];
}
