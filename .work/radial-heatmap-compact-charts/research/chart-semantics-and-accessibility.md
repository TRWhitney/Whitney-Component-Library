# Chart semantics and accessibility research

## Question

Which factual accessibility, interaction, and data-semantic constraints should bound PieChart,
DonutChart, RadarChart, Heatmap, and Sparkline without selecting the library's product policy?

## Scope

This review covers equivalent alternatives, keyboard access, non-color meaning, part-to-whole
data, radar normalization, heatmap scales and missing cells, and reduced-context sparklines. It
does not choose public props, category or series limits, default ordering, visual treatments, or
private implementation.

## Conclusion

The delivered chart convention remains a sound baseline. A visible title and description, one
named reading boundary when pointer readings exist, a hidden decorative SVG, polite announcements,
and an adjacent native table can expose equivalent meaning without one focus stop per mark. WCAG
does not define a chart widget or chart key map, so traversal remains a product decision. A static
sparkline with complete adjacent meaning can omit the reading boundary because it exposes no
pointer-only function.

The generated table covers programmatic structure, but it does not replace the visible non-color
cue required when color distinguishes data for sighted users. Exact values, direct labels,
patterns, shapes, or boundaries must supplement color where each chart uses color to communicate.

## Evidence

### Shared accessibility and interaction

- [WCAG 2.2 non-text content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
  requires an equivalent text alternative. Its chart example combines a short identification, a
  high-level account of trends and implications, and the actual data in a table where practical.
- [WAI complex-image guidance](https://www.w3.org/WAI/tutorials/images/complex/) separates concise
  identification from the longer data, scale, relationship, and trend explanation needed for a
  complex chart.
- [WAI table guidance](https://www.w3.org/WAI/tutorials/tables/) requires native row and column
  header relationships. This supports the existing generated native tables rather than flattened
  table text.
- [WCAG use of color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color) requires a visual
  cue such as text, shape, or pattern in addition to color. The criterion addresses sighted users
  who do not distinguish the colors, so a screen-reader-only alternative cannot satisfy it alone.
- [WCAG keyboard guidance](https://www.w3.org/WAI/WCAG22/Understanding/keyboard) requires a
  keyboard method for pointer functionality but does not require every pointer target to be
  separately focusable. [APG keyboard-interface guidance](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
  supports one Tab stop with internal arrow movement for composites, but WAI defines no chart
  widget pattern.
- [WCAG hover or focus content](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)
  requires triggered tooltip content to remain dismissible, hoverable, and persistent under the
  criterion's conditions. The delivered viewport tooltip and Escape behavior already establish
  this convention.

### Pie and donut

- [ONS pie and doughnut guidance](https://service-manual.ons.gov.uk/data-visualisation/chart-types/pie-and-doughnut-charts)
  limits the form to complete, non-overlapping parts of one whole, recommends three or four
  categories, advises against more than six, and prefers direct category and value labels when
  space permits. It directs close comparisons to bars.
- [D3 pie documentation](https://d3js.org/d3-shape/pie) and the
  [pie source](https://github.com/d3/d3-shape/blob/main/src/pie.js) compute the angular total from
  positive values. Nonpositive values receive no proportional arc.
- [Cleveland and McGill's graphical-perception study](https://doi.org/10.1080/01621459.1984.10478080)
  found position judgments more accurate than the angle and area judgments used by pies. The
  library must retain exact labels and the table and guide precise comparisons to another chart.

These facts support finite nonnegative values with a positive aggregate and one complete shared
unit. They do not settle whether zero rows are rejected, retained only in structured output, or
reported as partial data. No standard fixes a category maximum. Six aligns with the delivered
palette and ONS upper guidance.

### Radar

- [Statistics Bureau of Japan radar guidance](https://www.stat.go.jp/naruhodo/9_graph/jyokyu/redar.html)
  describes the classic center-zero, larger-outward interpretation and recommends transforming
  lower-is-better measures when the polygon is intended to mean that farther outward is better.
- [Takenaka et al.](https://doi.org/10.11361/journalcpij.53.640) show that axis order changes radar
  area for identical values. Axis order therefore carries meaning and cannot be an incidental sort.
- [Off the Radar](https://pubmed.ncbi.nlm.nih.gov/26529525/) found radar least effective and least
  preferred among three radial views for tested composite-indicator tasks. Contracts should reject
  precise extraction and dense multi-series comparison as appropriate uses.

Comparable polygon shape requires an explicit axis label, source domain, unit or score meaning,
direction, normalization interpretation, and stable order. Structured output must retain source
values and plotted normalized scores. The evidence does not select a universal normalization
method, maximum axis count, or maximum series count. Negative source measurements can be mapped to
a nonnegative radius, so rejecting negative source data is a policy choice rather than a geometric
necessity.

### Heatmap

- [D3 sequential-scale guidance](https://d3js.org/d3-scale/sequential) defines a two-value numeric
  low-to-high domain. [D3 diverging-scale guidance](https://d3js.org/d3-scale/diverging) defines a
  three-value numeric domain whose middle value is the neutral or critical point.
- [Government of Canada heatmap guidance](https://health-infobase.canada.ca/design-manual/library/heat-maps.html)
  requires one numeric meaning and scale across cells, a color legend, a data table, and a textual
  account when the matrix communicates a clear pattern. It recommends considering visible values
  in each cell.
- D3's [linear-scale unknown handling](https://d3js.org/d3-scale/linear) distinguishes an unknown
  value from a numeric scale result. Missing, zero, and invalid values cannot silently share one
  appearance.

The public model needs unambiguous row and column domains. Sparse cell records can represent a
complete matrix only when absent coordinates receive explicit missing meaning, and duplicate
coordinates require rejection or a declared aggregation that this ticket does not otherwise own.
A diverging scale needs a consumer-declared meaningful center such as zero, a target, or a
reference. The sources do not decide continuous versus binned rendering, default domains, or the
number of missing-status kinds.

### Sparkline

- Edward Tufte's [sparkline definition and examples](https://www.edwardtufte.com/notebook/sparkline-theory-and-practice-edward-tufte/)
  define a sparkline as a compact graphic embedded in nearby words or numbers. The examples retain
  recent value, range, thresholds, and comparable scaling when those facts give the trend meaning.
- [Microsoft sparkline guidance](https://support.microsoft.com/en-us/excel/analyze-trends-in-data-using-sparklines)
  treats sparklines as nearby trend summaries. Its separate missing-point and shared-axis choices
  demonstrate that gaps, zeros, connections, independent ranges, and shared ranges make different
  claims.
- WCAG's equivalent-purpose requirement still covers trend, extrema, sign, domain span, and range
  when visible axes are absent.

The contract must make ordered domain, value range, missing-point policy, and summary meaning
explicit. It should support a common range when several sparklines are compared. Evidence does not
settle whether the library derives the summary, requires consumer-authored copy, or combines both.
It also does not require a focus boundary for a sparkline that has no pointer-only reading.

## Conflicts and uncertainty

- Public guidance differs on a pie-category maximum. ONS recommends no more than six while other
  government guidance recommends five or fewer. Neither is a technical standard.
- WAI defines required outcomes for alternatives, color, and keyboard operation but no chart role
  or chart-specific key map. The existing single-boundary model is an accepted library convention,
  not a W3C-mandated pattern.
- Radar research documents perceptual limits but supplies no universal normalization, axis count,
  or series count.
- Heatmap sources establish sequential and diverging meanings but not a universal missing-value
  vocabulary or non-color rendering.

## Implications

Whitney must settle the six visible decisions in the effort map. The strongest starting policy is
to preserve the existing one-boundary interaction for charts with direct readings, keep one-to-six
categorical uses, use explicit domains instead of inferred interpretation, reject ambiguous or
duplicate records, preserve declared order, and prototype the visible non-color and compact
fallback behavior before implementation.
