# 21 Radial, Heatmap, and Compact Charts

**What to build:** Named pie/donut, radar, heatmap, and sparkline charts with contracts that bound
their less precise or reduced-context uses.

**Blocked by:** [Cartesian Chart Foundation](19-cartesian-chart-foundation.md)

**Status:** blocked

- [ ] Pie and donut charts enforce part-to-whole semantics and guide against excessive categories
  or precision claims.
- [ ] Radar charts require comparable dimensions on a shared normalized interpretation and guide
  against precise comparison, negative values, or excessive series and axes.
- [ ] Heatmaps expose row, column, value, scale, missing-cell, and color-independent meaning.
- [ ] Sparklines retain an accessible label, summary, range, and trend meaning despite reduced
  chrome.
- [ ] Labels, legends, tooltips, patterns or marks, and structured alternatives remain available.
- [ ] Responsive sizing avoids illegible labels and defines compact fallback behavior.
- [ ] Theme, semantic color, forced-color, reduced-motion, SSR, hydration, types, and contracts pass.

## Accepted sources

- [Specification](../spec.md)
- [Charting Scope](../decisions/13-charting-scope.md)
- [Architecture decision: Own an Accessible Chart Family](../../../docs/adr/0008-own-an-accessible-chart-family.md)

## Completion evidence

Pending implementation.
