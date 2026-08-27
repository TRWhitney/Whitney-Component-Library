# Radial, heatmap, and compact charts

## Destination

Deliver PieChart, DonutChart, RadarChart, Heatmap, and Sparkline as public components that preserve
the chart family's established behavior and visual language while expressing each chart's actual
data unit and appropriate-use boundary.

## Notes

Ticket 21 already accepts the five named exports and their broad roles. This map resolves only the
chart-specific decisions that the parent ticket left open. Ticket 22 retains consumer selection,
coordinated state, domain navigation, and the advanced composition API.

## Decisions so far

- [Charting scope](../library-foundation/decisions/13-charting-scope.md): The stable family includes
  pie or donut, radar, heatmap, and sparkline charts with generated structured alternatives and
  guidance against inappropriate precision claims.
- [Shared chart reading](../chart-interactivity/spec.md): Charts use one named keyboard boundary,
  chart-owned tooltips, retained touch readings, polite announcements, generated tables, and
  viewport-contained tooltip placement.
- [Role-aware chart colors](../chart-accent-palette/spec.md): Ordinary series derive from the
  application accent, semantic colors remain independent, and shape, pattern, or boundary cues
  supplement color.
- [Pie and donut part-to-whole contract](decisions/01-pie-donut-part-to-whole.md): Rank any number
  of nonnegative categories, render ordinary slices proportionally in eight-category pages, and
  use a proportional aggregate navigation slice by default with a consumer-selectable smallest
  treatment.
- [Radar dimensions and normalization](decisions/02-radar-dimensions-and-normalization.md): Treat
  spokes as dimensions and polygons as series, use one shared nonnegative scale, map missing values
  to zero, and shape sparse fills with visual-only shoulders.
- [Heatmap grid and value scale](decisions/03-heatmap-grid-and-value-scale.md): Preserve explicitly
  ordered row and column domains, distinguish missing cells from zero, and share one sequential or
  two-sided color scale across all numeric cells.
- [Sparkline context and input](decisions/04-sparkline-context-and-input.md): Plot one ordered
  series, preserve gaps and exact values, derive a factual summary, and defer unfamiliar compact
  caption and mark choices to direct prototype evaluation.
- [Chart-family reading and structured alternatives](decisions/05-reading-and-structured-alternatives.md):
  Preserve the delivered one-boundary reading model, adapt traversal to each chart's data unit, and
  keep the complete source meaning in generated tables.
- [Visual encoding and responsive behavior](decisions/06-visual-encoding-and-responsive-behavior.md):
  Apply the role-aware chart language, the accepted Sparkline cues, and the accepted pie and donut
  paging, emphasis, tooltip, legend overflow, and bounded resize behavior.

## Out of scope

- Consumer events, cross-chart selection, pan, zoom, brushing, and coordinated state.
- Advanced chart composition or exposure of private renderer objects.
- New application layout or dashboard components.
- Idle or decorative animation.
