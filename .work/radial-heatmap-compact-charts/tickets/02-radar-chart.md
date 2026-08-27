# 02 RadarChart

**What to build:** A public RadarChart with ordered dimensions, one to six comparable series, honest
missing and invalid handling, source-preserving sparse-fill shoulders, dimension readings,
contracts, and a production example.

**Blocked by:** none

**Status:** complete

- [x] Typed public inputs distinguish three or more ordered dimensions from one to six series and
      accept stable labels, shared numeric meaning, formatting, chart state, legend, and sizing
      without exposing renderer types.
- [x] Runtime preparation derives one nonnegative scale, maps missing dimension values to zero,
      keeps zero valid, invalidates a complete series for negative or non-finite input, and reports
      partial or invalid data according to surviving series.
- [x] Sparse-fill shoulders match the accepted Jumpchain rule, remain visual-only, and never alter
      points, readings, announcements, or table values.
- [x] Left and Right traverse declared dimensions and report every valid series value. Pointer and
      touch report one series and axis, draw a center-to-point guide, mute the other series, and
      favor a legend-pinned series when close marks overlap. Legend hover, focus, pinning,
      replacement, and Escape otherwise use the existing series-emphasis behavior.
- [x] The plot, spokes, guides, polygons, points, labels, patterns, focus, themes, forced colors,
      reduced motion, responsive sizing, tooltip, announcement, and generated dimension-by-series
      table remain legible and consistent with the chart family.
- [x] Public contract guidance rejects unrelated units, precise lookup, excessive spokes, and
      unreadable overlap, and the production showcase includes valid and sparse examples.
- [x] Focused public tests, shoulder geometry checks, type fixtures, SSR and hydration checks,
      package verification, responsive browser evidence, and the full repository check pass.

## Accepted sources

- [Specification](../spec.md)
- [Radar dimensions and normalization](../decisions/02-radar-dimensions-and-normalization.md)
- [Chart-family reading](../decisions/05-reading-and-structured-alternatives.md)
- [Visual and responsive behavior](../decisions/06-visual-encoding-and-responsive-behavior.md)
- [Jumpchain radar behavior](../research/jumpchain-radar-behavior.md)
- [Architecture decision: Preserve radar values while shaping sparse fills](../../../docs/adr/0016-preserve-radar-values-while-shaping-sparse-fills.md)
- [Shared chart reading](../../chart-interactivity/spec.md)
- [Role-aware chart colors](../../chart-accent-palette/spec.md)

## Completion evidence

- `npm run check` passes formatting, both configured linters, TypeScript, 501 tests, generated
  documentation, the supported TypeScript matrix, production builds, and chart isolation.
- `npm run verify:package`, `npm run showcase:build`, and `git diff --check` pass. Package checks
  cover clean React 18.3.1 and React 19.2.8 consumers, SSR, hydration, types, and browser builds.
- Direct browser operation confirms pointer and touch isolate one series and named dimension,
  keyboard reading retains both series, and a pinned series wins overlapping polygon targets.
- Inspected regular, sparse, compact, stacked, light, dark, and forced-color renders remain legible.
  The axis guide uses a theme-appropriate line without a halo and ends in a solid marker inside the
  source point. Reduced motion removes series and area transitions.
- Browser measurements confirm five dimension table rows, local overflow below the 320px minimum,
  compact 11px legend text, and the expected compact and stacked layout changes.

Delivery review found and implementation corrected fractional-scale derivation, effective aspect
ratio sizing, retained-reading reconciliation, and complete six-series legend patterns. The
sparse-shoulder and geometric touch tests now cover their complete accepted behavior. The complete
repository, package, showcase, and browser evidence above was renewed after those corrections.
Correction review then exposed finite-number overflow and over-broad legend resets. Boundary tests
now cover `Number.MIN_VALUE` and `Number.MAX_VALUE`, while value updates clear stale readings but
preserve valid pinned and focused legend emphasis. Full validation was renewed again afterward.
