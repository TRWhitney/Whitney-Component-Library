# 05 Chart-family reading and structured alternatives

**Status:** resolved
**Blocked by:** [Pie and donut part-to-whole contract](01-pie-donut-part-to-whole.md),
[Radar dimensions and normalization](02-radar-dimensions-and-normalization.md),
[Heatmap grid and value scale](03-heatmap-grid-and-value-scale.md),
[Sparkline context and input](04-sparkline-context-and-input.md)
**Type:** discussion

## Question

How should pointer, keyboard, touch, legend emphasis, tooltip copy, announcements, and generated
tables traverse and report slices, radar dimensions, heatmap cells, and sparkline records while
retaining one chart boundary and each chart's actual data unit?

## Answer

Every chart keeps the delivered chart-reading model: one title-named keyboard boundary, a
chart-owned viewport tooltip, retained touch reading, polite announcements, Escape clearing, and a
complete generated table. None adds one tab stop per visible mark. Pointer, keyboard, and touch
read the chart's actual data unit without emitting consumer events.

PieChart and DonutChart traverse visible slices clockwise with Left and Right. Home and End reach
the first and last visible slice. Enter or Space activates the aggregate navigation slice. Later
pages show a native Back button and their position in the ranked category set. Page changes keep
focus inside the chart and announce the newly visible category range. Pointer, touch, and Back
navigation clear the prior tooltip. Enter or Space navigation reads the first slice on the new page
so keyboard users retain reading continuity.

An ordinary pie or donut reading reports its exact value, its share of the complete total, and its
share of the ordinary categories on the current page. Its tooltip labels those shares `Share of
total` and `Share on this page`. The aggregate reports only its category count and exact combined
value. Page position and activation communicate what opens next; sizing policy is not user-facing
tooltip content. DonutChart continues to show the complete derived total in its center.

RadarChart traverses dimensions in declared order with Left and Right and reports every valid
series value at the selected dimension. Its legend retains the existing temporary and pinned
series emphasis. Readings and the table use exact source values; presentation-only radar shoulders
never become data.

Heatmap uses Left and Right across columns and Up and Down across rows. Home and End reach the row
endpoints; Control with Home or End reaches the first or last cell in the complete grid. Missing
cells remain reachable and report the localized missing-data label. Pointer and touch begin on a
cell rather than inferring a nearby one from blank grid space.

Sparkline retains LineChart's nearest-record pointer reading and ordered Left and Right keyboard
reading. Missing positions remain reachable and report the localized missing-data label rather
than a numeric value. Home and End reach the sequence endpoints.

The generated alternatives retain the complete source meaning regardless of the current visual
page or compact treatment. Pie and donut tables include every category, including zero values and
full-total shares. Radar tables use dimensions as rows and series as columns. Heatmap tables retain
the full row and column grid with explicit missing labels. Sparkline tables include every domain
position, including gaps.

Whitney accepted this recommended reading model as the baseline and reserved unfamiliar visual
details for the faithful prototype.

## Evidence

- [Shared chart-reading specification](../../chart-interactivity/spec.md)
- [Statistical chart reading](../../library-foundation/decisions/18-statistical-chart-reading.md)
- [Parent implementation ticket](../../library-foundation/tickets/21-radial-heatmap-and-compact-charts.md)
