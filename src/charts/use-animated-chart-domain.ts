import {useEffect, useRef, useState} from 'react';
import {chartDataMotionDuration, chartDataMotionEase} from './use-chart-data-motion.js';

type Domain = readonly [number, number];

/** Keep axes and marks on the same scale throughout an interruptible transition. */
export function useAnimatedChartDomain(
  target: Domain,
  enabled: boolean,
  logarithmic: boolean,
  resetKey = '',
): Domain {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [domain, setDomain] = useState({value: target, resetKey});
  const current = useRef({domain: target, enabled, resetKey});
  const [lower, upper] = target;
  const animate = enabled && !reducedMotion;

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (media === undefined) return;
    const update = (): void => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const next: Domain = [lower, upper];
    const previous = current.current;
    if (
      previous.domain[0] === lower &&
      previous.domain[1] === upper &&
      previous.enabled === animate &&
      previous.resetKey === resetKey
    )
      return;
    const publish = (value: Domain): void => {
      current.current = {domain: value, enabled: animate, resetKey};
      setDomain({value, resetKey});
    };
    if (
      !animate ||
      !previous.enabled ||
      previous.resetKey !== resetKey ||
      typeof requestAnimationFrame === 'undefined' ||
      (previous.domain[0] === lower && previous.domain[1] === upper)
    ) {
      publish(next);
      return;
    }
    const started = performance.now();
    let frame: number;
    const interpolate = (from: number, to: number, progress: number): number =>
      logarithmic
        ? Math.exp((1 - progress) * Math.log(from) + progress * Math.log(to))
        : (1 - progress) * from + progress * to;
    const step = (timestamp: number): void => {
      const progress = Math.max(0, Math.min(1, (timestamp - started) / chartDataMotionDuration));
      const eased = chartDataMotionEase(progress);
      const value: Domain = [
        interpolate(previous.domain[0], lower, eased),
        interpolate(previous.domain[1], upper, eased),
      ];
      publish(
        progress === 1 || !value.every(Number.isFinite) || value[0] >= value[1] ? next : value,
      );
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [animate, logarithmic, lower, upper, resetKey]);

  return animate && domain.resetKey === resetKey ? domain.value : target;
}
