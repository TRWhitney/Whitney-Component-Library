import {useEffect, useRef, useState} from 'react';
import {chartDataMotionDuration, chartDataMotionEase} from './use-chart-data-motion.js';

interface RadialAngles {
  readonly identity: string;
  readonly startAngle: number;
  readonly endAngle: number;
}
interface RadialFrame<Value> {
  readonly key: string;
  readonly value: Value;
  readonly opacity: number;
  readonly exiting: boolean;
}
const settled = <Value extends RadialAngles>(targets: readonly Value[]): RadialFrame<Value>[] =>
  targets.map((value) => ({key: value.identity, value, opacity: 1, exiting: false}));

/** Resize stable slices; crossfade reordered arrangements and retain native visibility expansion. */
export function useAnimatedRadialAngles<Value extends RadialAngles>(
  targets: readonly Value[],
  resetKey: string,
  enabled: boolean,
  sourceKey: string,
): readonly RadialFrame<Value>[] {
  const key = JSON.stringify(
    targets.map(({identity, startAngle, endAngle}) => [identity, startAngle, endAngle]),
  );
  const [reduced, setReduced] = useState(false);
  const animate = enabled && !reduced;
  const [goal, setGoal] = useState({key, resetKey, sourceKey, animate, targets});
  if (
    goal.key !== key ||
    goal.resetKey !== resetKey ||
    goal.sourceKey !== sourceKey ||
    goal.animate !== animate
  )
    setGoal({key, resetKey, sourceKey, animate, targets});
  const [state, setState] = useState({resetKey, items: settled(targets)});
  const current = useRef({
    ...state,
    enabled: animate,
    key,
    sourceKey,
    order: targets.map((item) => item.identity),
    generation: 0,
  });
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!media) return;
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const previous = current.current;
    const order = goal.targets.map((item) => item.identity);
    const sourceChanged = previous.sourceKey !== goal.sourceKey;
    const reordered =
      sourceChanged &&
      JSON.stringify(previous.order.filter((id) => order.includes(id))) !==
        JSON.stringify(order.filter((id) => previous.order.includes(id)));
    const generation = previous.generation + 1;
    const publish = (items: RadialFrame<Value>[]) => {
      const value = {resetKey: goal.resetKey, items};
      current.current = {
        ...value,
        enabled: goal.animate,
        key: goal.key,
        sourceKey: goal.sourceKey,
        order,
        generation,
      };
      setState(value);
    };
    const next = settled(goal.targets);
    if (
      !goal.animate ||
      !previous.enabled ||
      previous.resetKey !== goal.resetKey ||
      previous.key === goal.key ||
      typeof requestAnimationFrame === 'undefined'
    ) {
      publish(next);
      return;
    }
    const existing = new Map(
      previous.items.filter((item) => !item.exiting).map((item) => [item.value.identity, item]),
    );
    const arrivals = goal.targets.map((target, index) => {
      const old = reordered ? undefined : existing.get(target.identity);
      if (old) return {target, from: old.value, opacity: old.opacity};
      if (!sourceChanged) {
        const nextExisting = goal.targets
          .slice(index + 1)
          .map((item) => existing.get(item.identity))
          .find((item) => item !== undefined);
        const boundary = nextExisting?.value.startAngle ?? target.endAngle;
        return {target, from: {...target, startAngle: boundary, endAngle: boundary}, opacity: 1};
      }
      return {target, from: target, opacity: 0};
    });
    const departures = sourceChanged
      ? previous.items
          .filter((item) => reordered || item.exiting || !order.includes(item.value.identity))
          .map((item, index) => ({...item, key: `departure:${generation}:${index}`, exiting: true}))
      : [];
    const started = performance.now();
    let frame: number;
    const display = (progress: number): RadialFrame<Value>[] => [
      ...arrivals.map(({target, from, opacity}) => ({
        key: target.identity,
        value: {
          ...target,
          startAngle: from.startAngle + (target.startAngle - from.startAngle) * progress,
          endAngle: from.endAngle + (target.endAngle - from.endAngle) * progress,
        },
        opacity: opacity + (1 - opacity) * progress,
        exiting: false,
      })),
      ...departures.map((item) => ({...item, opacity: item.opacity * (1 - progress)})),
    ];
    publish(display(0));
    const step = (timestamp: number) => {
      const progress = Math.max(0, Math.min(1, (timestamp - started) / chartDataMotionDuration));
      publish(progress === 1 ? next : display(chartDataMotionEase(progress)));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [goal]);
  if (!animate || state.resetKey !== resetKey) return settled(targets);
  const latest = new Map(targets.map((target) => [target.identity, target]));
  return state.items.map((item) => {
    const actual = latest.get(item.value.identity);
    return actual && !item.exiting
      ? {
          ...item,
          value: {...actual, startAngle: item.value.startAngle, endAngle: item.value.endAngle},
        }
      : {...item, exiting: true};
  });
}
