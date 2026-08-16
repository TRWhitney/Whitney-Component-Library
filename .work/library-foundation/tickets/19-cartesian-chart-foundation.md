# 19 Cartesian Chart Foundation

**What to build:** The typed shared chart frame, scales, axes, legends, annotations, and named line,
area, bar/column, and compatible mixed Cartesian charts.

**Blocked by:** [Layout and Surface Primitives](02-layout-and-surface-primitives.md),
[Status, Progress, and Alerts](10-status-progress-and-alerts.md)

**Status:** blocked

- [ ] Typed record keys or accessors produce categorical, linear, logarithmic, time, and normalized
      scales without leaking renderer types.
- [ ] Line, area, vertical/horizontal bar, grouped, stacked, normalized, and compatible mixed-series
      contracts advertise appropriate and inappropriate uses.
- [ ] Titles, descriptions, units, axes, grids, labels, legends, reference lines/bands, thresholds,
      and annotations compose through bounded public APIs.
- [ ] Responsive sizing has explicit aspect-ratio, minimum-size, overflow, and no-data behavior.
- [ ] Light/dark appearance, application accent, categorical palettes, and semantic colors remain
      distinct and legible.
- [ ] Loading, empty, partial, invalid-data, and error states use shared feedback semantics.
- [ ] Initial server output and hydration are deterministic.
- [ ] Static chart meaning is available through an accessible structured summary or generated data
      table before interaction is added.
- [ ] Ordinary component bundles do not include chart renderer JavaScript.

## Accepted sources

- [Specification](../spec.md)
- [Charting Scope](../decisions/13-charting-scope.md)
- [Architecture decision: Own an Accessible Chart Family](../../../docs/adr/0008-own-an-accessible-chart-family.md)

## Completion evidence

Pending implementation.
