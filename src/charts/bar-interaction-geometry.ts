export interface BarRectangle {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export function barRectangle({
  category,
  start,
  end,
  groupWidth,
  seriesIndex,
  seriesCount,
  grouped,
  horizontal,
}: {
  readonly category: number;
  readonly start: number;
  readonly end: number;
  readonly groupWidth: number;
  readonly seriesIndex: number;
  readonly seriesCount: number;
  readonly grouped: boolean;
  readonly horizontal: boolean;
}): BarRectangle {
  const width = grouped ? groupWidth / Math.max(seriesCount, 1) : groupWidth;
  const offset = category - groupWidth / 2 + (grouped ? Math.max(seriesIndex, 0) * width : 0);
  return horizontal
    ? {x: Math.min(start, end), y: offset, width: Math.abs(end - start), height: width}
    : {x: offset, y: Math.min(start, end), width, height: Math.abs(end - start)};
}

export function clipBar(
  rect: BarRectangle,
  plot: {left: number; right: number; top: number; bottom: number},
): BarRectangle | undefined {
  const x = Math.max(rect.x, plot.left),
    y = Math.max(rect.y, plot.top);
  const right = Math.min(rect.x + rect.width, plot.right),
    bottom = Math.min(rect.y + rect.height, plot.bottom);
  return right < x || bottom < y ? undefined : {x, y, width: right - x, height: bottom - y};
}

export function frameBar(
  rect: BarRectangle,
  neighbors: readonly BarRectangle[],
  outset: number,
): BarRectangle {
  const near = (a: number, b: number) => Math.abs(a - b) < 1e-6;
  const shared = (side: 'left' | 'right' | 'top' | 'bottom') =>
    neighbors.some(
      (n) =>
        n !== rect &&
        (side === 'left' || side === 'right'
          ? Math.min(rect.y + rect.height, n.y + n.height) > Math.max(rect.y, n.y) &&
            near(
              side === 'left' ? rect.x : rect.x + rect.width,
              side === 'left' ? n.x + n.width : n.x,
            )
          : Math.min(rect.x + rect.width, n.x + n.width) > Math.max(rect.x, n.x) &&
            near(
              side === 'top' ? rect.y : rect.y + rect.height,
              side === 'top' ? n.y + n.height : n.y,
            )),
    );
  const left = shared('left') ? 0 : outset,
    right = shared('right') ? 0 : outset;
  const top = shared('top') ? 0 : outset,
    bottom = shared('bottom') ? 0 : outset;
  return {
    x: rect.x - left,
    y: rect.y - top,
    width: rect.width + left + right,
    height: rect.height + top + bottom,
  };
}

// Trace the union perimeter so stacked segments have no internal reading seam.
export function barContour(rectangles: readonly BarRectangle[], inset: number): string {
  const rects = rectangles.filter((r) => r.width > 0 && r.height > 0);
  // A zero segment inside a stack belongs to its silhouette, not an internal seam.
  // Keep zero bars visible when their own target has no filled rectangle.
  const flat = rectangles
    .filter(
      (r) =>
        (r.width === 0 || r.height === 0) &&
        !rects.some(
          (filled) =>
            r.x >= filled.x - 1e-6 &&
            r.y >= filled.y - 1e-6 &&
            r.x + r.width <= filled.x + filled.width + 1e-6 &&
            r.y + r.height <= filled.y + filled.height + 1e-6,
        ),
    )
    .map((r) => `M${r.x},${r.y} L${r.x + r.width},${r.y + r.height}`);
  if (!rects.length) return flat.join(' ');
  // Collapse projection rounding at shared edges, not visibly separated bars.
  const round = (v: number) => Math.round(v * 1e6) / 1e6;
  const xs = [...new Set(rects.flatMap((r) => [round(r.x), round(r.x + r.width)]))].sort(
    (a, b) => a - b,
  );
  const ys = [...new Set(rects.flatMap((r) => [round(r.y), round(r.y + r.height)]))].sort(
    (a, b) => a - b,
  );
  const cells = new Set<string>();
  for (let x = 0; x < xs.length - 1; x++)
    for (let y = 0; y < ys.length - 1; y++) {
      const cx = (xs[x]! + xs[x + 1]!) / 2,
        cy = (ys[y]! + ys[y + 1]!) / 2;
      if (rects.some((r) => cx > r.x && cx < r.x + r.width && cy > r.y && cy < r.y + r.height))
        cells.add(`${x},${y}`);
    }
  interface Point {
    readonly x: number;
    readonly y: number;
  }
  const key = (p: Point) => `${p.x},${p.y}`;
  const edges = new Map<string, Point[]>();
  const add = (a: Point, b: Point) => edges.set(key(a), [...(edges.get(key(a)) ?? []), b]);
  for (let x = 0; x < xs.length - 1; x++)
    for (let y = 0; y < ys.length - 1; y++) {
      if (!cells.has(`${x},${y}`)) continue;
      const l = xs[x]!,
        r = xs[x + 1]!,
        t = ys[y]!,
        b = ys[y + 1]!;
      if (!cells.has(`${x},${y - 1}`)) add({x: l, y: t}, {x: r, y: t});
      if (!cells.has(`${x + 1},${y}`)) add({x: r, y: t}, {x: r, y: b});
      if (!cells.has(`${x},${y + 1}`)) add({x: r, y: b}, {x: l, y: b});
      if (!cells.has(`${x - 1},${y}`)) add({x: l, y: b}, {x: l, y: t});
    }
  const paths = [...flat];
  while (edges.size) {
    const first = edges.keys().next().value!;
    const [x, y] = first.split(',').map(Number);
    let point: Point = {x: x!, y: y!};
    const points: Point[] = [];
    do {
      points.push(point);
      const choices = edges.get(key(point));
      const next = choices?.shift();
      if (!choices?.length) edges.delete(key(point));
      if (!next) break;
      point = next;
    } while (key(point) !== first);
    const corners = points.filter((p, i) => {
      const before = points[(i + points.length - 1) % points.length]!,
        after = points[(i + 1) % points.length]!;
      return !((before.x === p.x && p.x === after.x) || (before.y === p.y && p.y === after.y));
    });
    // Keep an inner cue visible even when bars are narrower than its normal inset.
    const amount =
      inset > 0 ? Math.min(inset, ...rects.map((r) => Math.min(r.width, r.height) / 3)) : inset;
    const inner = corners.map((p, i) => {
      const a = corners[(i + corners.length - 1) % corners.length]!,
        b = corners[(i + 1) % corners.length]!;
      return {
        x: p.x - amount * (Math.sign(p.y - a.y) + Math.sign(b.y - p.y)),
        y: p.y + amount * (Math.sign(p.x - a.x) + Math.sign(b.x - p.x)),
      };
    });
    if (inner.length)
      paths.push(inner.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ') + ' Z');
  }
  return paths.join(' ');
}
