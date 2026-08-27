# 02 RadarChart

**What to build:** A public RadarChart with ordered dimensions, one to six comparable series, honest
missing and invalid handling, source-preserving sparse-fill shoulders, dimension readings,
contracts, and a production example.

**Blocked by:** [PieChart and DonutChart](01-pie-and-donut.md)

**Status:** blocked

- [ ] Typed public inputs distinguish three or more ordered dimensions from one to six series and
      accept stable labels, shared numeric meaning, formatting, chart state, legend, and sizing
      without exposing renderer types.
- [ ] Runtime preparation derives one nonnegative scale, maps missing dimension values to zero,
      keeps zero valid, invalidates a complete series for negative or non-finite input, and reports
      partial or invalid data according to surviving series.
- [ ] Sparse-fill shoulders match the accepted Jumpchain rule, remain visual-only, and never alter
      points, readings, announcements, or table values.
- [ ] Left and Right traverse declared dimensions. Each reading reports every valid series value at
      that dimension, and legend hover, focus, pinning, replacement, and Escape use the existing
      series-emphasis behavior.
- [ ] The plot, spokes, guides, polygons, points, labels, patterns, focus, themes, forced colors,
      reduced motion, responsive sizing, tooltip, announcement, and generated dimension-by-series
      table remain legible and consistent with the chart family.
- [ ] Public contract guidance rejects unrelated units, precise lookup, excessive spokes, and
      unreadable overlap, and the production showcase includes valid and sparse examples.
- [ ] Focused public tests, shoulder geometry checks, type fixtures, SSR and hydration checks,
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

Pending implementation.
