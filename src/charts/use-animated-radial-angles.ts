import {useEffect, useRef, useState} from 'react';

interface RadialAngles {
  readonly identity: string;
  readonly startAngle: number;
  readonly endAngle: number;
}
const angleMap = (items: readonly RadialAngles[]) =>
  new Map(items.map((item) => [item.identity, item]));

/** Retarget visibility changes by category identity; paging and source changes settle directly. */
export function useAnimatedRadialAngles(
  targets: readonly RadialAngles[],
  resetKey: string,
  enabled: boolean,
): ReadonlyMap<string, RadialAngles> {
  const key = JSON.stringify(
    targets.map(({identity, startAngle, endAngle}) => [identity, startAngle, endAngle]),
  );
  const [goal, setGoal] = useState({key, resetKey, targets});
  if (goal.key !== key || goal.resetKey !== resetKey) setGoal({key, resetKey, targets});
  const [reduced, setReduced] = useState(false);
  const animate = enabled && !reduced;
  const [state, setState] = useState({resetKey, angles: angleMap(targets)});
  const current = useRef({...state, enabled: animate});
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
    const next = angleMap(goal.targets);
    const publish = (angles: Map<string, RadialAngles>) => {
      const value = {resetKey: goal.resetKey, angles};
      current.current = {...value, enabled: animate};
      setState(value);
    };
    if (
      !animate ||
      !previous.enabled ||
      previous.resetKey !== goal.resetKey ||
      typeof requestAnimationFrame === 'undefined'
    ) {
      publish(next);
      return;
    }
    const starts = goal.targets.map((target, index) => {
      const existing = previous.angles.get(target.identity);
      if (existing) return existing;
      const nextExisting = goal.targets
        .slice(index + 1)
        .map((item) => previous.angles.get(item.identity))
        .find((item) => item !== undefined);
      const boundary = nextExisting?.startAngle ?? target.endAngle;
      return {...target, startAngle: boundary, endAngle: boundary};
    });
    if (
      goal.targets.every(
        (target, index) =>
          target.startAngle === starts[index]!.startAngle &&
          target.endAngle === starts[index]!.endAngle,
      )
    ) {
      publish(next);
      return;
    }
    publish(angleMap(starts));
    const started = performance.now();
    let frame: number;
    const step = (timestamp: number) => {
      const progress = Math.max(0, Math.min(1, (timestamp - started) / 240));
      const eased = 1 - (1 - progress) ** 3;
      publish(
        progress === 1
          ? next
          : angleMap(
              goal.targets.map((target, index) => ({
                identity: target.identity,
                startAngle:
                  starts[index]!.startAngle +
                  (target.startAngle - starts[index]!.startAngle) * eased,
                endAngle:
                  starts[index]!.endAngle + (target.endAngle - starts[index]!.endAngle) * eased,
              })),
            ),
      );
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [animate, goal]);
  return !animate || state.resetKey !== resetKey ? angleMap(targets) : state.angles;
}
