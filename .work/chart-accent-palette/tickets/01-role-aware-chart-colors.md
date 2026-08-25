# 01 Role-aware chart colors and legible mixed charts

**What to build:** Production chart defaults that derive ordinary categorical series from the
application accent, paint filled and stroked marks according to role, keep chart text readable, and
prevent automatic colors from colliding with explicitly claimed ordinary colors.

**Blocked by:** none

**Status:** complete

- [x] The first ordinary series uses the application accent and later ordinary series use distinct
      accent-derived hues in light and dark appearances.
- [x] Black, near-black, near-white, and white accents retain the selected first-series color while
      later series use a distinct orbit around the default blue seed.
- [x] Bars and areas use softened fills with identifiable series boundaries and render below line
      marks regardless of consumer series order.
- [x] Automatic color allocation skips ordinary palette colors claimed explicitly by any series;
      duplicate explicit choices remain unchanged.
- [x] The showcase mixed bar-and-line example uses distinct automatic colors without relying on an
      example-only override.
- [x] Axes, ticks, annotations, and legends are readable at the smallest supported presentation
      without introducing label collisions or clipped plot content.
- [x] Semantic colors, dash patterns, point markers, server rendering, and hydration behavior remain
      intact.
- [x] Package checks and focused browser verification cover both appearances and representative
      chromatic and achromatic accents.

## Accepted sources

- [Accepted specification](../spec.md)
- [Accepted role-aware orbit prototype](../prototypes/accent-derived-chart-colors.md)
- [Cartesian chart foundation](../../library-foundation/tickets/19-cartesian-chart-foundation.md)

## Completion evidence

- `npm run build && npm run check`: 27 files and 438 tests pass with all configured static,
  declaration-matrix, generated-file, and chart-isolation checks after the long-label correction.
- Focused Cartesian tests pass after observing the new long-label regression fail before the
  production correction.
- Chromium inspection at the 480px minimum canvas in both appearances confirms representative long
  horizontal and vertical category labels remain inside the SVG and do not overlap adjacent labels.
  Ellipses keep long word suffixes distinct, SVG titles and generated tables preserve complete
  labels, single-token labels with shared prefixes retain distinct endings, and non-categorical
  formatted ticks remain unshortened.
- Chromium inspection of the reported showcase line-chart case at 492px and 318px panes shows
  14px-high tick glyphs in both; the compact plot scrolls at 480px rather than shrinking text.
- Chromium inspection of light/black and dark/red role-aware charts confirms visible series
  boundaries, lines above fills, readable labels, and unclipped content.
- Chromium stress checks find six distinct rendered colors for black, near-black, near-white,
  white, and red accents in both light and dark appearances.
- The isolated Vite prototype build passes and direct interaction distinguishes all three prototype
  comparison modes.
