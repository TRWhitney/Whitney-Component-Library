// Disposable motion study. Only numeric values change; identity and topology stay fixed.
import {createContext, useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
export const MotionContext = createContext(true);
export function useMotion(target: number[][], identity: string) {
  const enabled = useContext(MotionContext);
  const [reduced, setReduced] = useState(false);
  const [frame, setFrame] = useState(target);
  const current = useRef(target);
  const previousIdentity = useRef(identity);
  const key = JSON.stringify(target);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useLayoutEffect(() => {
    const start = current.current;
    const publish = (next: number[][]) => {
      current.current = next;
      setFrame(next);
    };
    if (!enabled || reduced || previousIdentity.current !== identity) {
      previousIdentity.current = identity;
      publish(target);
      return;
    }
    const time = performance.now();
    let handle: number;
    const step = (now: number) => {
      const progress = Math.min(1, (now - time) / 240);
      const ease = 1 - (1 - progress) ** 3;
      publish(
        progress === 1
          ? target
          : target.map((row, i) =>
              row.map((value, j) => {
                const from = start[i]?.[j] ?? value;
                return Number.isFinite(value) && Number.isFinite(from)
                  ? from + (value - from) * ease
                  : value;
              }),
            ),
      );
      if (progress < 1) handle = requestAnimationFrame(step);
    };
    handle = requestAnimationFrame(step);
    return () => cancelAnimationFrame(handle);
  }, [key, identity, enabled, reduced]);
  return !enabled || reduced || previousIdentity.current !== identity ? target : frame;
}
export function useMovingRows(rows, series) {
  const size = series.length;
  const values = useMotion(
    rows.map((r) => [...r.values, ...(r.lowerValues ?? [])]),
    JSON.stringify([rows.map((r) => r.category), series.map((s) => s.id)]),
  );
  return rows.map((r, i) => ({
    ...r,
    __studyActual: r,
    values: values[i]?.slice(0, size) ?? r.values,
    ...(r.lowerValues ? {lowerValues: values[i]?.slice(size) ?? r.lowerValues} : {}),
  }));
}
export function useMovingModel(model) {
  const points = model.points ?? [];
  const values = useMotion(
    points.map((p) => [p.x, p.y, p.magnitude ?? 1]),
    JSON.stringify(points.map((p) => [p.id, p.series.id])),
  );
  return {
    ...model,
    points: points.map((p, i) => ({
      ...p,
      __studyActual: p,
      x: values[i]?.[0] ?? p.x,
      y: values[i]?.[1] ?? p.y,
      magnitude: values[i]?.[2] ?? p.magnitude,
    })),
  };
}
