interface Rectangle {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly width: number;
  readonly height: number;
}

// Subtract the union of occupied rectangles so overlapping panels are not counted twice.
function freeSpace(region: Rectangle, obstacles: readonly Rectangle[]) {
  const clipped = obstacles
    .map((rect) => ({
      left: Math.max(region.left, rect.left),
      right: Math.min(region.right, rect.right),
      top: Math.max(region.top, rect.top),
      bottom: Math.min(region.bottom, rect.bottom),
    }))
    .filter((rect) => rect.left < rect.right && rect.top < rect.bottom);
  const xs = [
    ...new Set([region.left, region.right, ...clipped.flatMap((r) => [r.left, r.right])]),
  ].sort((a, b) => a - b);
  const ys = [
    ...new Set([region.top, region.bottom, ...clipped.flatMap((r) => [r.top, r.bottom])]),
  ].sort((a, b) => a - b);
  let area = 0,
    momentX = 0,
    momentY = 0;
  for (let i = 1; i < xs.length; i++) {
    for (let j = 1; j < ys.length; j++) {
      const left = xs[i - 1]!,
        right = xs[i]!,
        top = ys[j - 1]!,
        bottom = ys[j]!;
      const x = (left + right) / 2,
        y = (top + bottom) / 2;
      if (clipped.some((r) => x > r.left && x < r.right && y > r.top && y < r.bottom)) continue;
      const size = (right - left) * (bottom - top);
      area += size;
      momentX += size * x;
      momentY += size * y;
    }
  }
  return {area, x: area ? momentX / area : 0, y: area ? momentY / area : 0};
}

export function fieldGeometry(frame: Rectangle, panel: Rectangle, panels: readonly Rectangle[]) {
  const relative = (rect: Rectangle): Rectangle => ({
    width: rect.width,
    height: rect.height,
    left: rect.left - frame.left,
    right: rect.right - frame.left,
    top: rect.top - frame.top,
    bottom: rect.bottom - frame.top,
  });
  const anchor = relative(panel),
    obstacles = panels.map(relative);
  const center = {x: (anchor.left + anchor.right) / 2, y: (anchor.top + anchor.bottom) / 2};
  const rectangle = (left: number, top: number, right: number, bottom: number): Rectangle => ({
    left,
    top,
    right: Math.max(left, right),
    bottom: Math.max(top, bottom),
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
  });
  const spaces = [
    rectangle(0, 0, Math.max(0, anchor.left), frame.height),
    rectangle(Math.min(frame.width, anchor.right), 0, frame.width, frame.height),
    rectangle(0, 0, frame.width, Math.max(0, anchor.top)),
    rectangle(0, Math.min(frame.height, anchor.bottom), frame.width, frame.height),
  ].map((region) => freeSpace(region, obstacles));
  const space = spaces.sort((a, b) => b.area - a.area)[0]!;
  const spread = Math.max(32, Math.min(96, frame.width * 0.07));
  const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));
  // Offset only the center. Identical falloff surrounds the panel in every direction.
  return {
    x:
      center.x +
      (space.area
        ? clamp((space.x - center.x) * 0.06, Math.min(spread * 0.4, anchor.width * 0.1))
        : 0),
    y:
      center.y +
      (space.area
        ? clamp((space.y - center.y) * 0.06, Math.min(spread * 0.4, anchor.height * 0.1))
        : 0) +
      24,
    radiusX: anchor.width * 0.8 + spread,
    radiusY: anchor.height * 0.9 + spread,
  };
}
