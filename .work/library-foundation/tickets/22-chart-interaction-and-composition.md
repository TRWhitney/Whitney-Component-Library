# 22 Chart Interaction and Composition

**What to build:** Shared accessible chart interaction, coordinated state, and the bounded advanced
composition layer across every accepted named chart.

**Blocked by:** [Statistical Chart Family](20-statistical-chart-family.md),
[Radial, Heatmap, and Compact Charts](21-radial-heatmap-and-compact-charts.md)

**Status:** blocked

- [ ] Pointer and keyboard tooltips expose the same series, category, value, and unit information.
- [ ] Highlighting, legend toggling, and point/category selection remain available without color-only
  state.
- [ ] Pan, zoom, and brush are enabled only for meaningful chart domains and provide keyboard and
  reset paths.
- [ ] Explicit shared state coordinates compatible charts without hidden global coupling.
- [ ] Interactive marks have stable focus order and meaningful accessible names at representative
  data sizes.
- [ ] Data transitions communicate change, never loop idly, and settle under reduced motion.
- [ ] The advanced API composes compatible series, scales, annotations, and coordinated views while
  keeping renderer objects private.
- [ ] Structured data alternatives update with filters and selection.
- [ ] Representative data workloads meet an explicit recorded responsiveness budget.

## Accepted sources

- [Specification](../spec.md)
- [Charting Scope](../decisions/13-charting-scope.md)
- [Quality and Release Boundary](../decisions/10-quality-and-release-boundary.md)

## Completion evidence

Pending implementation.
