// Isolated study: keyed numeric motion and non-interactive fading departures.
import {createContext, useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
export const MotionContext = createContext(true);
export function useKeyedMotion(target: {id: string; values: number[]}[], resetKey = 0) {
  const enabled = useContext(MotionContext);
  const [reduced, setReduced] = useState(false);
  const asMap = () => new Map(target.map((t) => [t.id, t.values]));
  const [frame, setFrame] = useState(asMap);
  const current = useRef(frame);
  const key = JSON.stringify(target);
  const previousReset = useRef(resetKey);
  const reset = previousReset.current !== resetKey;
  useEffect(() => {
    const m = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(m.matches);
    update();
    m.addEventListener('change', update);
    return () => m.removeEventListener('change', update);
  }, []);
  useLayoutEffect(() => {
    const from = current.current;
    const end = asMap();
    const publish = (v: Map<string, number[]>) => {
      current.current = v;
      setFrame(v);
    };
    if (!enabled || reduced || previousReset.current !== resetKey) {
      previousReset.current = resetKey;
      publish(end);
      return;
    }
    let handle: number;
    const start = performance.now();
    const step = (time: number) => {
      const p = Math.min(1, (time - start) / 240),
        ease = 1 - (1 - p) ** 3;
      publish(
        p === 1
          ? end
          : new Map(
              target.map((t) => [
                t.id,
                t.values.map((v, i) => {
                  const a = from.get(t.id)?.[i] ?? v;
                  return Number.isFinite(v) && Number.isFinite(a) ? a + (v - a) * ease : v;
                }),
              ]),
            ),
      );
      if (p < 1) handle = requestAnimationFrame(step);
    };
    handle = requestAnimationFrame(step);
    return () => cancelAnimationFrame(handle);
  }, [key, enabled, reduced, resetKey]);
  return enabled && !reduced && !reset ? frame : asMap();
}
export function useMovingRows(rows, series) {
  const values = useKeyedMotion(
    rows.map((r) => ({id: String(r.category), values: [...r.values, ...(r.lowerValues ?? [])]})),
  );
  return rows.map((r) => ({
    ...r,
    __studyActual: r,
    values: values.get(String(r.category))?.slice(0, series.length) ?? r.values,
    ...(r.lowerValues
      ? {lowerValues: values.get(String(r.category))?.slice(series.length) ?? r.lowerValues}
      : {}),
  }));
}
export function useMovingProjection(projection) {
  const targets = projection.ticks.map((t) => ({
    id: String(t),
    values: [projection.position(t), projection.bandwidth ?? 0],
  }));
  const values = useKeyedMotion(targets);
  return (range) => ({
    ...projection,
    bandwidth:
      (values.get(targets[0]?.id)?.[1] ?? projection.bandwidth ?? 0) * (range[1] - range[0]),
    position: (value) => {
      const p = values.get(String(value))?.[0] ?? projection.position(value);
      return p === undefined ? undefined : range[0] + p * (range[1] - range[0]);
    },
  });
}
export function useMovingModel(model) {
  const points = model.points ?? [];
  const values = useKeyedMotion(
    points.map((p) => ({id: p.id + '|' + p.series.id, values: [p.x, p.y, p.magnitude ?? 1]})),
  );
  return {
    ...model,
    points: points.map((p) => {
      const v = values.get(p.id + '|' + p.series.id);
      return {
        ...p,
        __studyActual: p,
        x: v?.[0] ?? p.x,
        y: v?.[1] ?? p.y,
        magnitude: v?.[2] ?? p.magnitude,
      };
    }),
  };
}
export function useMovingAngles(targets) {
  const ids = targets.map((t) => t.identity);
  const order = useRef(ids);
  const revision = useRef(0);
  if (JSON.stringify(order.current) !== JSON.stringify(ids)) {
    if (
      JSON.stringify(order.current.filter((id) => ids.includes(id))) !==
      JSON.stringify(ids.filter((id) => order.current.includes(id)))
    )
      revision.current++;
    order.current = ids;
  }
  const values = useKeyedMotion(
    targets.map((t) => ({id: t.identity, values: [t.startAngle, t.endAngle]})),
    revision.current,
  );
  return new Map(
    targets.map((t) => [
      t.identity,
      {
        ...t,
        startAngle: values.get(t.identity)?.[0] ?? t.startAngle,
        endAngle: values.get(t.identity)?.[1] ?? t.endAngle,
      },
    ]),
  );
}

export function TransitionHost({children, revision, enabled, crossfadeOnReorder = false}) {
  const root = useRef<HTMLDivElement>(null);
  const snapshot = useRef(new Map());
  const capture = () => {
    const next = new Map();
    root.current?.querySelectorAll('[data-study-id]').forEach((node: SVGGraphicsElement) => {
      const svg = node.ownerSVGElement;
      if (!svg) return;
      const parent = node.parentElement as unknown as SVGGraphicsElement;
      const matrix = svg.getScreenCTM()?.inverse().multiply(parent.getScreenCTM()!);
      const color = node.closest('[data-color]')?.getAttribute('data-color');
      next.set(node.getAttribute('data-study-id'), {node: node.cloneNode(true), matrix, color});
    });
    snapshot.current = next;
  };
  useLayoutEffect(() => {
    const nodes = [...(root.current?.querySelectorAll('[data-study-id]') ?? [])];
    const ids = new Set(nodes.map((n) => n.getAttribute('data-study-id')));
    const oldIds = [...snapshot.current.keys()];
    const reordered =
      crossfadeOnReorder &&
      JSON.stringify(oldIds.filter((id) => ids.has(id))) !==
        JSON.stringify([...ids].filter((id) => snapshot.current.has(id)));
    if (
      enabled &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches &&
      snapshot.current.size
    ) {
      for (const node of nodes)
        if (reordered || !snapshot.current.has(node.getAttribute('data-study-id')))
          node.animate([{opacity: 0}, {opacity: 1}], {
            duration: 240,
            easing: 'cubic-bezier(.33,1,.68,1)',
          });
      const svg = root.current?.querySelector('svg[data-wcl-chart-svg],svg[data-wcl-radial-svg]');
      if (svg)
        for (const [id, old] of snapshot.current)
          if (reordered || !ids.has(id)) {
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.setAttribute('aria-hidden', 'true');
            group.style.pointerEvents = 'none';
            group.setAttribute('data-study-departure', '');
            if (old.color) group.setAttribute('data-color', old.color);
            group.setAttribute('data-wcl-chart-series', '');
            if (old.matrix)
              group.setAttribute(
                'transform',
                `matrix(${[old.matrix.a, old.matrix.b, old.matrix.c, old.matrix.d, old.matrix.e, old.matrix.f].join(' ')})`,
              );
            old.node.removeAttribute('data-study-id');
            group.append(old.node);
            svg.append(group);
            const fade = group.animate([{opacity: 1}, {opacity: 0}], {
              duration: 240,
              easing: 'cubic-bezier(.33,1,.68,1)',
            });
            fade.onfinish = () => group.remove();
          }
    }
    capture();
  }, [revision]);
  return (
    <div ref={root} onPointerDownCapture={capture} onKeyDownCapture={capture}>
      {children}
    </div>
  );
}
