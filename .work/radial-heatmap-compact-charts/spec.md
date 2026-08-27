# Radial, heatmap, and compact charts

## Problem statement

The public chart family lacks part-to-whole, multivariate radial, matrix, and compact trend charts.
Consumers should not need a second renderer or a one-off accessibility model for these common data
views. The new components must retain the delivered chart family's typed inputs, visible captions,
feedback states, reading behavior, generated tables, responsive sizing, color system, and package
boundaries while expressing the actual data unit of each chart.

## Solution

Add public `PieChart`, `DonutChart`, `RadarChart`, `Heatmap`, and `Sparkline` components. Their public
types use records, typed keys or accessors, labels, units, and formatting callbacks. No public type
exposes D3, SVG, or another renderer. Each component has a canonical contract, generated guidance,
and a production showcase example.

All five components keep the existing required visible title and description, `dataTableLabel`,
loading, empty, partial, invalid-data, and error behavior. They use one title-named keyboard reading
boundary, a chart-owned tooltip, retained touch readings, polite announcements, Escape clearing,
and a complete native table. They emit no consumer events and do not mutate, select, filter, or
coordinate data.

### PieChart and DonutChart

The public input supplies records plus stable id, label, and numeric value accessors. It also
supplies one shared value label, optional unit, optional formatter, a localized legend label, and
localized paging and tooltip copy. Values must be finite and nonnegative. Zero is valid, remains in
the table, and produces no slice. Negative or non-finite records follow the chart family's partial
and invalid-data behavior. A dataset with no positive value uses the empty state.

Positive categories rank by descending value, with declared record order breaking ties. Consumers
cannot override sorting or the fixed page size. Eight or fewer positive categories render as
ordinary proportional slices. With more than eight, page one shows the seven largest categories
and an aggregate navigation slice. Activating it advances through groups of eight ranked ordinary
categories, adding another aggregate whenever more remain. A native Back button returns through
every prior page. The table always retains the complete dataset and each record's share of the
complete total.

The aggregate angle is proportional to the hidden records' combined value by default. Public
`aggregateSizing` accepts `proportional` or `smallest`; omission means `proportional`. The
`smallest` mode gives the aggregate a deliberately smaller angle than every ordinary slice while
ordinary slices retain their relative proportions. Aggregate sizing affects geometry only.

The aggregate uses a dashed boundary and a bold `+N` label. PieChart positions that count from the
slice's area so it remains visually central as the angle changes. The count stays readable at the
minimum size and grows modestly with available plot space. DonutChart shows the complete derived
total and localized unit label in its center. It does not accept arbitrary center content.

Left and Right traverse visible slices clockwise. Home and End reach the first and last visible
slice. Enter or Space on the aggregate opens the next page and reads its first slice. Pointer,
touch, and Back navigation clear the prior tooltip while retaining safe focus and announcing the
new range. Ordinary tooltips contain category, exact value, `Share of total`, and `Share on this
page`. Aggregate tooltips contain only hidden category count and combined value.

Hovering a slice pops it outward, mutes the others, and opens the cursor-following tooltip. The
tooltip flips at viewport edges. Keyboard and touch tooltips anchor to the active slice. Legend
hover and focus pop out the matching slice and mute the others without opening a tooltip. Clicking
a legend item pins that state after hover or focus ends. Clicking another replaces the pin,
clicking the pinned item clears it, and Escape clears it. Repeated palette roles gain stable
non-color treatment when a page contains more ordinary categories than distinct color roles.

Available width and height both bound layout. Short areas keep plot and legend side by side and
compact the caption, page indicator, Back button, legend text, swatches, gaps, and padding. The
legend uses ScrollRegion's transient scrollbar thumb without adding ScrollRegion container chrome.
Narrow areas stack only when enough height remains. Responsive allocation keeps a moderate plot
bias and does not always prioritize either chart or legend.

### RadarChart

RadarChart accepts three or more ordered, labeled dimensions and one to six series. A dimension is
one spoke and one measured quality. A series is one subject's values across every dimension and one
polygon. Typed accessors map each series record to stable identity, label, optional color, and each
dimension value without exposing renderer data.

Every dimension shares one nonnegative numeric meaning, unit, formatter, and scale. RadarChart
derives a readable maximum from valid values and does not expose separate dimension ranges,
normalization, direction, or reversed scales. A missing dimension value becomes zero. Zero stays at
the center. A negative or non-finite value invalidates its complete series. Remaining valid series
produce partial data; no valid series produces invalid data.

An isolated positive value with zero neighbors receives visual-only shoulders on the neighboring
spokes. Each shoulder is capped at the positive value and otherwise uses the greater of eight
percent of the radius or twenty-five percent of that positive value. Adjacent positive values do
not receive shoulders, and an all-zero series stays empty. Marks, tooltips, announcements, and the
table always report the source values.

Left and Right traverse dimensions in declared order. A reading reports every valid series value
at that dimension. Legend hover, focus, pinning, replacement, and Escape use the existing series
emphasis behavior. The generated table uses dimensions as rows and series as columns. The contract
warns against excessive spokes, overlapping polygons, precise lookup, and unrelated units without
imposing a hard dimension maximum.

### Heatmap

Heatmap accepts explicitly ordered row and column lists of any size and a set of cell records. Each
list item has a stable id and label. Typed accessors identify each cell's row, column, and numeric
value. A cell that names an undeclared row or column is invalid because the component cannot place
it. Duplicate row and column pairs invalidate the dataset because the component cannot choose one
value.

Negative values and zero are valid. A missing row and column pair means no data, not zero. Missing
cells use localized missing-data text and a neutral pattern or boundary distinct from every numeric
value. Non-finite records follow the chart family's partial and invalid-data behavior.

Every numeric cell shares one unit and formatter. Consumers choose a low-to-high scale or a
two-sided scale with a meaningful declared midpoint. The component derives the numeric range by
default and accepts a fixed range for comparison across heatmaps. A visible color key explains the
scale and retains a non-color distinction for missing cells.

Left and Right move across columns. Up and Down move across rows. Home and End reach row endpoints.
Control with Home or End reaches the first or last cell in the complete grid. Pointer and touch
begin only on a cell. Missing cells remain reachable and announce the missing-data label. Cells show
formatted values when space permits. Dense grids omit visible text before shrinking cells below a
legible size, then use a labeled local scroll region with ScrollRegion's scrollbar behavior. The
generated table preserves every declared row and column intersection.

### Sparkline

Sparkline accepts one ordered series over a categorical, numeric, or time position. It keeps the
chart family's typed domain and numeric accessors. It renders the standard visible chart title and
description, but omits axes and a legend. Consumers use LineChart for multiple series or visible
axes.

Negative values and zero are valid. A missing value creates a gap and remains a missing table row.
The line does not connect across it or convert it to zero. A non-finite value invalidates its record
and uses partial-data behavior. No valid record produces invalid data. Sparkline derives its value
range by default and accepts a fixed range for direct comparison.

The component derives exact first, last, lowest, and highest valid values. The consumer description
provides the domain meaning and does not ask Sparkline to infer whether change is good or bad. The
current record uses a filled series-color point. Every record tied at the observed low or high uses
a hollow series-color point unless it is current, in which case the filled current treatment wins.
These static cues supplement the tooltip, announcement, and table without persistent value labels.

Sparkline keeps LineChart's nearest-record pointer reading and ordered Left and Right keyboard
reading. Home and End reach the sequence endpoints. Missing positions remain reachable and report
the localized missing label. Sparkline never uses local scrolling. Its initial compact default uses
the chart family's sizing scale, and `minimumSize` remains available. Exact default geometry may be
refined against the production implementation without changing caption, cues, reading, or no-scroll
behavior.

## User stories

1. As a data analyst, I want a paged pie or donut that retains every category so I can inspect a
   large part-to-whole dataset without losing the long tail.
2. As a keyboard, pointer, or touch user, I want chart readings and page changes to behave like the
   existing chart family so I do not learn a separate interaction model.
3. As a consumer, I want a radar chart that distinguishes dimensions from series and treats missing
   dimensions honestly so sparse records do not invent measurements.
4. As a consumer, I want a heatmap that distinguishes zero from missing data and supports stable
   cross-chart ranges so its colors keep one meaning.
5. As a consumer, I want a compact Sparkline with visible context and exact static cues so small
   trends do not discard their accessible meaning.
6. As a maintainer, I want all five components to reuse private chart foundations and public
   contracts so later chart work does not create a second framework.

## Implementation decisions

- [Pie and donut part-to-whole contract](decisions/01-pie-donut-part-to-whole.md)
- [Radar dimensions and normalization](decisions/02-radar-dimensions-and-normalization.md)
- [Heatmap grid and value scale](decisions/03-heatmap-grid-and-value-scale.md)
- [Sparkline context and input](decisions/04-sparkline-context-and-input.md)
- [Chart-family reading and structured alternatives](decisions/05-reading-and-structured-alternatives.md)
- [Visual encoding and responsive behavior](decisions/06-visual-encoding-and-responsive-behavior.md)
- [Architecture decision: Own an accessible chart family](../../docs/adr/0008-own-an-accessible-chart-family.md)
- [Architecture decision: Page large part-to-whole charts](../../docs/adr/0015-page-large-part-to-whole-charts.md)
- [Architecture decision: Preserve radar values while shaping sparse fills](../../docs/adr/0016-preserve-radar-values-while-shaping-sparse-fills.md)
- [Shared chart reading](../chart-interactivity/spec.md)
- [Role-aware chart colors](../chart-accent-palette/spec.md)

## Testing decisions

- Test behavior through public components. Private geometry tests supplement but do not replace
  public rendering, interaction, and table checks.
- Type fixtures cover keys and callbacks, valid scale variants, the one-to-six Radar series bound,
  `aggregateSizing`, and rejected renderer-specific or invalid public shapes.
- Runtime tests cover duplicate identities, duplicate heatmap coordinates, undeclared cell
  coordinates, finite and nonnegative requirements, zero, missing values, partial data, all-invalid
  data, all-zero part-to-whole data, derived totals, fixed ranges, and deterministic ties.
- Interaction tests cover one reading boundary, pointer, touch, keyboard traversal, tooltip copy and
  placement, aggregate paging, Back, announcements, tooltip clearing after pointer navigation,
  legend hover and focus without tooltips, pinned emphasis, replacement, and Escape.
- Visual structure tests cover aggregate count placement and scaling, donut center readability,
  Radar shoulders that never alter source readings, Heatmap missing patterns and dense-grid text
  fallback, Sparkline current and tied range cues, light and dark appearance, accent changes, forced
  colors, and reduced motion.
- Responsive browser checks measure both available dimensions and include short-wide, compact
  square, tall-narrow, local-overflow, and ordinary-size layouts. Pie and donut checks include the
  compact Back button and transient legend scrollbar.
- Every component passes SSR and hydration, public declaration fixtures, generated contract checks,
  production showcase build, chart-isolation build, the package verification path, and relevant
  browser operation.

## Out of scope

- Selection callbacks, filtering, pan, zoom, brushing, and coordinated chart state.
- The advanced mixed-chart composition API.
- Consumer-defined PieChart sorting, page size, or arbitrary DonutChart center content.
- Separate Radar dimension scales, negative Radar values, or inferred missing measurements.
- Heatmap clustering, automatic row or column reordering, and inferred values for missing cells.
- Sparkline semantic judgments about whether a trend is good or bad.
- Geographic maps, network graphs, Sankey diagrams, treemaps, candlesticks, 3D charts, and dashboard
  layout.

## Further notes

The accepted prototypes are sources for the named behavior and visual relationships. Their fixture
data, controls, SVG implementation, exact dimensions, and thresholds are not production code.
Production must use the existing chart frame and conventions wherever they already satisfy the
specification.
