# 13 Charting Scope

**Status:** resolved
**Blocked by:** [Stable Catalog Model](11-stable-catalog-model.md)
**Type:** discussion

## Question

Which standard chart types, shared data model, scales, interaction and selection behavior,
responsive rules, accessible alternatives, animation, and compositional escape hatches belong to
the stable chart family?

## Answer

Ship a standard chart family containing line, area, bar or column, scatter or bubble, histogram,
box plot, pie or donut, radar, heatmap, sparkline, and mixed compatible Cartesian charts. Bar and
area families support appropriate horizontal, grouped, stacked, or normalized forms.

The shared chart system owns typed record access, categorical, linear, logarithmic, time, and
normalized scales, axes, grids, legends, labels, units, titles, descriptions, reference lines and
bands, thresholds, annotations, responsive sizing, loading, empty, partial, and error states,
light and dark appearance, accent propagation, categorical palettes, semantic colors, and
deterministic server rendering and hydration.

Supported interaction includes pointer and keyboard tooltips, series highlighting, legend
toggling, point or category selection, meaningful pan, zoom, or brush selection, and explicit
shared state for coordinated compatible charts. Data transitions are purposeful and honor reduced
motion; idle decorative animation is excluded.

Every chart requires an accessible title and description, programmatic series, category, value,
and unit meaning, keyboard-reachable interactive marks, and a structured-summary or generated-table
alternative. Patterns or marks supplement color where needed. Component contracts explain
inappropriate uses, including radar charts for precise comparison and pie charts with excessive
categories.

Named components such as line, bar, and radar charts are the preferred agent-facing APIs. An
advanced composition layer supports mixed series, custom annotations, scales, and coordinated
views without exposing the private renderer. Geographic maps, network graphs, Sankey diagrams,
treemaps, candlesticks, 3D charts, and dashboard layout are outside this initial chart family.

## Evidence

- Whitney explicitly requires standard chart types including a radar chart before stable release.
- Earlier visual exploration excluded charts as a general identity premise because they expressed
  application content; that does not exclude a deliberate chart component family.
- [Stable Catalog Model](11-stable-catalog-model.md)
- [Architecture decision: Own an Accessible Chart Family](../../../docs/adr/0008-own-an-accessible-chart-family.md)
