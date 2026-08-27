# 21 Radial, Heatmap, and Compact Charts

**What to build:** Named pie/donut, radar, heatmap, and sparkline charts with contracts that bound
their less precise or reduced-context uses.

**Blocked by:** [Cartesian Chart Foundation](19-cartesian-chart-foundation.md)

**Status:** complete

- [x] Pie and donut charts enforce part-to-whole semantics and guide against excessive categories
      or precision claims.
- [x] Radar charts require comparable dimensions on a shared normalized interpretation and guide
      against precise comparison, negative values, or excessive series and axes.
- [x] Heatmaps expose row, column, value, scale, missing-cell, and color-independent meaning.
- [x] Sparklines retain an accessible label, summary, range, and trend meaning despite reduced
      chrome.
- [x] Labels, legends, tooltips, patterns or marks, and structured alternatives remain available.
- [x] Responsive sizing avoids illegible labels and defines compact fallback behavior.
- [x] Theme, semantic color, forced-color, reduced-motion, SSR, hydration, types, and contracts pass.

## Accepted sources

- [Specification](../spec.md)
- [Radial, heatmap, and compact chart specification](../../radial-heatmap-compact-charts/spec.md)
- [Charting Scope](../decisions/13-charting-scope.md)
- [Architecture decision: Own an Accessible Chart Family](../../../docs/adr/0008-own-an-accessible-chart-family.md)

## Completion evidence

- PieChart and DonutChart are delivered in `9780036`, RadarChart in `d9ddcd5`, and Heatmap in
  `6680a5c`. Sparkline is delivered in the current `[Feature] Add Sparkline` commit.
- Each component has typed public inputs, canonical guidance, generated documentation, production
  showcase specimens, complete structured alternatives, focused interaction and appearance tests,
  SSR and hydration coverage, and clean React 18 and React 19 package verification.
- The final Sparkline repository check passes 532 tests together with formatting, lint, types,
  generated artifacts, the supported TypeScript matrix, builds, and chart isolation. Independent
  intent and engineering correction reviews report no remaining findings.
