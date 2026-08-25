# 19 Cartesian Chart Foundation

**What to build:** The typed shared chart frame, scales, axes, legends, annotations, and named line,
area, bar/column, and compatible mixed Cartesian charts.

**Blocked by:** [Layout and Surface Primitives](02-layout-and-surface-primitives.md),
[Status, Progress, and Alerts](10-status-progress-and-alerts.md)

**Status:** complete

- [x] Typed record keys or accessors produce categorical, linear, logarithmic, time, and normalized
      scales without leaking renderer types.
- [x] Line, area, vertical/horizontal bar, grouped, stacked, normalized, and compatible mixed-series
      contracts advertise appropriate and inappropriate uses.
- [x] Titles, descriptions, units, axes, grids, labels, legends, reference lines/bands, thresholds,
      and annotations compose through bounded public APIs.
- [x] Responsive sizing has explicit aspect-ratio, minimum-size, overflow, and no-data behavior.
- [x] Light/dark appearance, application accent, categorical palettes, and semantic colors remain
      distinct and legible.
- [x] Loading, empty, partial, invalid-data, and error states use shared feedback semantics.
- [x] Initial server output and hydration are deterministic.
- [x] Static chart meaning is available through an accessible structured summary or generated data
      table before interaction is added.
- [x] Ordinary component bundles do not include chart renderer JavaScript.

## Accepted sources

- [Specification](../spec.md)
- [Charting Scope](../decisions/13-charting-scope.md)
- [Architecture decision: Own an Accessible Chart Family](../../../docs/adr/0008-own-an-accessible-chart-family.md)

## Completion evidence

- `src/charts/` owns a renderer-independent public vocabulary for typed record accessors, bounded
  scales, series, layouts, axes, legends, and annotations. LineChart, AreaChart, ColumnChart,
  BarChart, and CartesianChart normalize that vocabulary into deterministic React-owned SVG and
  native HTML. D3 scale, array, and shape micro-packages remain private geometry dependencies; the
  rationale and primary sources are recorded in [renderer research](../research/chart-renderer.md).
- Every chart renders a required visible title and description, hides duplicate SVG semantics, and
  generates a named native data table. Annotation labels remain visible in the plot and are repeated
  in a structured summary. Category and value units remain present in both alternatives without
  duplicating normalized percent units. Loading, empty, partial, invalid-row, wholly unavailable,
  and error data reuse Spinner, EmptyState, and InlineAlert rather than defining chart-only feedback.
- Focused runtime and compile fixtures cover categorical, linear, logarithmic, UTC time, and
  normalized scales; line, area, grouped, stacked, normalized, horizontal, vertical, and mixed
  marks; reference lines, bands, point annotations, generated tables, explicit sizing, runtime
  validation, server output, and hydration. The full Vitest run passes 428 tests.
- The public visual vocabulary is bounded to six series with a required multi-series legend. Its
  swatches reuse the plotted dash patterns, including in forced colors. Filled marks reject explicit
  domains that exclude their zero baseline; categorical domains reject invalid or duplicate values.
- Five canonical contracts and generated component documents distinguish the named charts,
  counterexamples, alternatives, and the consumer-owned composition boundary. The showcase renders
  every chart in the catalog and its production build completes successfully.
- The explicit chart-isolation build imports Button through the public root and confirms that the
  emitted ordinary-component chunk contains neither `src/charts/` nor D3 modules. Packed consumer
  verification renders and hydrates LineChart, checks its plotted and tabular meaning, type-checks
  its public declaration, and builds browser consumers with React 18.3.1 and 19.2.8.
- Independent engineering and intent re-reviews report no unresolved objective defect after the
  contract, validation, structured-alternative, and legend-pattern corrections.
