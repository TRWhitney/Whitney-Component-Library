/** Hit the existing statistical symbols in their own coordinate system. */
export function containsPointShape(shape: number, radius: number, x: number, y: number): boolean {
  if (radius <= 0) return false;
  const dx = x / radius,
    dy = y / radius;
  switch (shape % 6) {
    case 1:
      return Math.abs(dx) + Math.abs(dy) <= 0.85 * Math.SQRT2;
    case 2:
      return dy >= -1 && dy <= 1 && Math.abs(dx) <= (dy + 1) / 2;
    case 3:
      return Math.abs(dx) <= 0.85 && Math.abs(dy) <= 0.85;
    case 4:
      return (
        (Math.abs(dx) <= 1 && Math.abs(dy) <= 0.35) || (Math.abs(dx) <= 0.35 && Math.abs(dy) <= 1)
      );
    case 5:
      return Math.abs(dx) <= 0.87 && Math.abs(dy) <= 1 - Math.abs(dx) / 1.74;
    default:
      return dx * dx + dy * dy <= 1;
  }
}
