# 03 Heatmap

**What to build:** A public Heatmap with ordered row and column domains, explicit missing cells,
sequential or two-sided scales, grid reading, dense local overflow, contracts, and a production
example.

**Blocked by:** none

**Status:** ready-for-agent

- [ ] Typed public inputs accept ordered labeled row and column domains, cell coordinate and value
      accessors, shared unit and formatting, sequential or two-sided scale, optional fixed range,
      localized missing copy, chart state, color key, and sizing without renderer types.
- [ ] Runtime preparation preserves domain order, rejects duplicate or undeclared coordinates,
      accepts negative and zero values, distinguishes missing coordinates from zero, and applies
      partial or invalid feedback to non-finite records.
- [ ] Numeric cells share one scale. The two-sided form honors its declared midpoint. Missing cells
      use a neutral non-color treatment outside the numeric scale, and the visible color key explains
      both numeric and missing meaning.
- [ ] Pointer and touch start only on cells. Arrow, Home, End, Control Home, and Control End traverse
      the complete grid. Missing cells remain readable and use the localized missing label.
- [ ] Cell text disappears before cells become illegible. Larger grids use a separately labeled
      local scroll region with ScrollRegion's transient scrollbar and retain every row and column in
      the generated table.
- [ ] Public contract guidance covers honest color-scale use, zero versus missing, fixed comparison
      ranges, and alternatives to unreadably large grids. The production showcase includes
      sequential, two-sided, zero, and missing examples.
- [ ] Focused public tests, scale and grid checks, type fixtures, SSR and hydration checks,
      appearance, forced-color and responsive browser evidence, package verification, and the full
      repository check pass.

## Accepted sources

- [Specification](../spec.md)
- [Heatmap grid and value scale](../decisions/03-heatmap-grid-and-value-scale.md)
- [Chart-family reading](../decisions/05-reading-and-structured-alternatives.md)
- [Visual and responsive behavior](../decisions/06-visual-encoding-and-responsive-behavior.md)
- [Shared chart reading](../../chart-interactivity/spec.md)
- [Role-aware chart colors](../../chart-accent-palette/spec.md)
- [Chart semantics and accessibility research](../research/chart-semantics-and-accessibility.md)

## Completion evidence

Pending implementation.
