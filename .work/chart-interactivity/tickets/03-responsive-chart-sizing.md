# 03 Responsive chart sizing

**What to build:** Content-aware Cartesian chart presentation that uses available space before
falling back to a locally scrolling canvas, while preserving all accepted chart interactions.

**Blocked by:** none

**Status:** complete

- [x] Typography, marks, points, strokes, margins, and pointer tolerance follow one bounded
      presentation scale derived from available chart space and the content that must remain
      legible.
- [x] Every categorical label is rendered. Horizontal labels use one row when they fit, alternate
      between two rows when that resolves collisions, and preserve a modest gap before the X-axis
      label.
- [x] A dense categorical chart introduces local horizontal overflow only after two label rows
      reach their legible spacing limit. Numeric axes may retain adaptive tick density.
- [x] Every component-showcase chart fits its specimen without local scrolling.
- [x] An overflowing chart canvas is a labeled, keyboard-focusable native region and matches
      ScrollRegion's idle, active, focused, reduced-motion, and forced-color scrollbar behavior.
      Its tooltip remains in the viewport overlay and cannot create or be clipped by chart
      overflow.
- [x] Each line's pointer target is three times its rendered stroke width, adding one full rendered
      line width on either side, and remains proportional when the chart resizes.
- [x] Shared category reading, direct-series emphasis, numeric reference readings, tooltip
      placement, legend pinning, annotations, chart colors, keyboard traversal, touch persistence,
      generated tables, and non-ready states retain their accepted behavior.
- [x] Public chart documentation and the component showcase describe the content-aware behavior
      without exposing prototype controls or adopting prototype-only composition.
- [x] Focused tests plus browser screenshots at compact, showcase, wide, and overflowing sizes pass,
      along with package build, type, lint, server-rendering, hydration, generated-table, and
      renderer-isolation verification.

## Accepted sources

- [Accepted specification](../spec.md)
- [Accepted responsive sizing prototype](../prototypes/responsive-chart-sizing.md)
- [Accepted interaction prototype](../prototypes/chart-reading-interactions.md)
- [ScrollRegion contract](../../../docs/components/scroll-region.md)

## Completion evidence

Focused sizing and style coverage passes for complete categorical ticks, staggered rows,
content-aware overflow, proportional line targets, and ScrollRegion-equivalent scrollbar states.
Direct Chromium inspection confirms five scroll-free showcase panes and the accepted dense 560px
overflow case. The complete repository check passes.
