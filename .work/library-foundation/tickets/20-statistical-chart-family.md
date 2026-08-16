# 20 Statistical Chart Family

**What to build:** Named scatter, bubble, histogram, and box-plot charts on the shared chart frame
with appropriate statistical and distribution semantics.

**Blocked by:** [Cartesian Chart Foundation](19-cartesian-chart-foundation.md)

**Status:** blocked

- [ ] Scatter and bubble charts define quantitative axes, point identity, optional magnitude, and
  overlap behavior.
- [ ] Histograms distinguish raw observations from pre-binned data and never masquerade as an
  ordinary categorical bar chart.
- [ ] Box plots define quartile, median, whisker, and outlier inputs and expose those meanings
  programmatically.
- [ ] Missing, invalid, non-finite, and out-of-domain data has explicit handling.
- [ ] Tooltips and summaries express values, units, bins, and statistical meaning accurately.
- [ ] Dense points remain usable through bounded highlighting or selection without color-only
  meaning.
- [ ] Responsive, theme, accent, forced-color, reduced-motion, SSR, hydration, and type checks pass.
- [ ] Contracts provide counterexamples and preferred alternatives for unsuitable data.

## Accepted sources

- [Specification](../spec.md)
- [Charting Scope](../decisions/13-charting-scope.md)

## Completion evidence

Pending implementation.
