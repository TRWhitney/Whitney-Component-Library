# 24 Keep radar labels readable

**What to build:** Preserve readable dimension and guide labels as radar charts shrink, keeping
the approved plot layout and interactions.

**Blocked by:** None

**Status:** complete

- [x] Dimension and guide text remain at least 12 rendered CSS pixels as the SVG scales.
- [x] Label insets account for rendered text size; existing compact shortening and full table
      labels remain available.
- [x] Preserve plot geometry, point fills, hover, selection underlines and activation motion.
- [x] Update showcase explanation and generated component documentation.

## Accepted sources

- Whitney authorized fixing tiny radar labels without changing the approved layout/interactions.
- [Compact audit](../research/compact-layout-audit.md)

## Completion evidence

Implementation and validation complete. Independent intent and engineering reviews passed with no findings.
The browser boundary initially failed at 7.33px. It now passes with a 12px minimum. Inspected
360/768px screenshots and measured containment at 360/768/1280px. Resizing regression coverage
and 43 focused radar tests pass. The integrated `npm run check` has 758 passing tests; packed
React 18/19 verification and showcase build pass. No geometry or activation behavior changed.
