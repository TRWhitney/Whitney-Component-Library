import {arc} from 'd3-shape';
export interface RadialPoint {
  readonly x: number;
  readonly y: number;
}
export interface RadialAngles {
  readonly startAngle: number;
  readonly endAngle: number;
}
export const radialArc = <Shape extends RadialAngles>(inner: number) =>
  arc<Shape>().innerRadius(inner).outerRadius(140).padAngle(0.012).cornerRadius(3);
// Tessellate the same padded, rounded D3 boundary used to draw the slice. Chord
// error stays below 0.01 view-box units, including small and full-circle slices.
export function radialPolygon(shape: RadialAngles, inner: number): RadialPoint[] {
  const points: RadialPoint[] = [];
  const context = {
    moveTo: (x: number, y: number) => {
      points.push({x, y});
    },
    lineTo: (x: number, y: number) => {
      points.push({x, y});
    },
    closePath: () => {},
    arc: (x: number, y: number, r: number, start: number, end: number, ccw = false) => {
      let span = end - start;
      if (ccw && span > 0) span -= Math.PI * 2;
      if (!ccw && span < 0) span += Math.PI * 2;
      const steps = Math.max(
        1,
        Math.ceil(
          Math.abs(span) /
            Math.max(0.001, 2 * Math.acos(Math.max(-1, 1 - 0.01 / Math.max(r, 0.01)))),
        ),
      );
      for (let i = 0; i <= steps; i++) {
        const a = start + (span * i) / steps;
        points.push({x: x + r * Math.cos(a), y: y + r * Math.sin(a)});
      }
    },
  };
  // Arc calls only these four Canvas path methods; D3's context type asks for a full canvas.
  radialArc(inner).context(context as CanvasRenderingContext2D)(shape);
  return points;
}
export function radialContains(points: readonly RadialPoint[], p: RadialPoint): boolean {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const a = points[i]!,
      b = points[j]!;
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x)
      inside = !inside;
  }
  return inside;
}
export function radialCrossing(
  points: readonly RadialPoint[],
  from: RadialPoint,
  to: RadialPoint,
): number | undefined {
  if (radialContains(points, from)) return 0;
  const dx = to.x - from.x,
    dy = to.y - from.y;
  let first: number | undefined;
  for (let i = 0; i < points.length; i++) {
    const a = points[i]!,
      b = points[(i + 1) % points.length]!,
      ex = b.x - a.x,
      ey = b.y - a.y,
      den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-12) continue;
    const ax = a.x - from.x,
      ay = a.y - from.y,
      t = (ax * ey - ay * ex) / den,
      u = (ax * dy - ay * dx) / den;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1 && (first === undefined || t < first)) first = t;
  }
  return first;
}
