# Chart interaction and composition

## Problem Statement

The chart family has readable values and series emphasis, but lacks the remaining behavior in
[Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md). Its completed
reading behavior must remain intact as visibility, activation, selection, exploration, animation,
and compatible mixed charts are added.

## Solution

Deliver accepted behavior in complete portions. The first production portion is the
[accepted legend and scale behavior](prototypes/legend-visibility.md#accepted-contract) for
LineChart, AreaChart, ColumnChart, BarChart, and CartesianChart. Later portions continue toward the
parent ticket; this first delivery does not complete Ticket 22.

## User Stories

1. As a chart reader, I want to hide and restore series without losing their names or changing the
   meaning of click-to-highlight.
2. As a chart reader, I want the scale to fit visible values and animate the adjustment so I can
   follow the remaining series.
3. As a keyboard user, I want visibility controls to keep their focus and order, and I want access
   to complete data even when every plotted series is hidden.

## Implementation Decisions

- The accepted prototype binds the visual and interaction behavior. Production uses React-owned
  elements and state; prototype DOM adaptation is not retained in the implementation.
- Cartesian charts accept optional localized visibility labels to enable these controls. Automatic
  scale fitting needs no separate setting. Existing explicit consumer bounds remain explicit
  constraints; automatic numeric bounds fit the visible series. Filled marks retain their zero
  baseline, logarithmic bounds remain positive, and normalized bounds remain 0 to 1.
- Series visibility is internal state keyed by stable series id. Removing a series drops its hidden
  and pinned state; changing its values preserves visibility. New series start visible.
- Legend order, colors, and patterns use the complete series list. Hidden names cannot emphasize
  invisible data. Eye buttons remain enabled and named by their next action. Hiding a pinned series
  clears its pin; restoring it does not repin it.
- Every series may be hidden. Keep the caption, legend, complete structured alternative, and a
  localized all-hidden message with Show all recovery. Hiding is not an empty-data or invalid-data
  condition. Show all restores focus to the first eye.
- Determine validity from complete supplied data before filtering visible series. Visibility does
  not turn invalid input into valid input. Readings report visible series with exact values and
  retain category identity. Reference readings preserve their existing meaning.
- Stacked and normalized layouts recompute using visible series. The complete table retains all
  source series, identifies hidden series with localized copy, and retains the complete-data
  interpretation of normalized shares.
- This portion animates automatic scale changes with interruptible, finite intermediate bounds.
  Axis and mark geometry use the same frame. Reading values are never interpolated. Reduced motion
  disables the transition and is observed when the preference changes. Initial rendering and
  hydration remain deterministic. Full data-shape transitions remain part of the parent ticket.
- Existing public limits on inputs, minimum sizes, status states, scales, and renderer privacy stay
  in force. Public contracts and all five showcase specimens explain the delivered visibility.

### Accepted activation and selection convention

Whitney approved the final prototype's reviewed behaviors and styles on 2026-09-08. Its
[accepted contract](prototypes/activation-selection.md#accepted-convention) binds the next
[LineChart production slice](tickets/03-line-chart-activation-selection.md). This is prototype
acceptance, not production completion. The public identity and data-replacement rules below complete this slice's planning boundary; the reviewed styles and gestures do not need reapproval.

- Activation callbacks are independent of optional selection. With selection enabled, ordinary
  clicks toggle selection and Control/Command-click activates without changing selection. With
  selection disabled, ordinary clicks activate. Selection and activation never both fire merely
  because both capabilities are enabled. Callbacks fire immediately for a category or point; the
  chart does not retain an inspected item or prescribe the application's response.
- Current reading and click targeting use one rule: choose the nearest visible category along the
  horizontal axis, then the nearest visible point vertically for point mode. The filled preview
  must identify exactly what a click would target, including between series. Category activation
  is one callback identifying the category with associated series data, not multiple point events.
- The prototype mirrors mouse modifiers with Control/Command plus Enter or Space for activation
  when selection is enabled. On touchscreens, tap selects and press-and-hold activates without
  changing selection. Releasing after a hold must not also select; movement into a drag or pointer
  cancellation cancels the pending hold. Whitney explicitly chose press-and-hold on 2026-09-08.
  The prototype uses a 500ms hold threshold, an implementation detail rather than a fixed API.
  With selection disabled, ordinary tap activates.
- For charts with circular point markers, a filled center consistently identifies the current
  pointer, keyboard, or touch reading. Align Cartesian reading indicators with radar and sparkline;
  do not reinterpret data-bearing fills or invent circular markers for other geometries.
- Hover emphasis follows the nearest visible line in both category and point modes. Filled centers
  still preview the click target: all visible series in category mode, one series in point mode.
  Whitney clarified this distinction after the LineChart delivery. Hover emphasis does not narrow
  category selection or its activation payload.
- A brief pulse acknowledges each activation, including repeated activation of the same item.
  It disappears without creating selection. Reduced motion uses a brief static acknowledgment.
- Persistent point selection uses an outer ring; categorical month selection uses an underline.
  Point fills and selection rings meet the actual marker outline without background gaps or an
  additional halo, in both appearances and as emphasis changes the outline width.
  Reading and selection can coexist. Whole-series legend emphasis remains distinct.
- Preserve the accepted prototype click-and-drag semantics, including range/rectangle selection,
  additive and subtractive modifiers, and cancellation. See the
  [activation example](prototypes/activation-selection.md#accepted-convention).
- Apply the convention consistently across applicable chart families during production delivery,
  with matching public documentation and showcase examples. The prototype demonstrates intent;
  it does not establish a production API or complete the parent ticket.

### LineChart production boundary

- This delivery covers LineChart only. Remaining chart families and other parent-ticket capabilities
  continue as later portions; their unreviewed geometry and gestures are not inferred here.
- An optional interaction object declares category or point targeting, a getRowId callback returning
  a nonempty stable string for each datum, an optional onActivate callback, and optional selection.
  Interaction IDs must be unique, including when category labels repeat. Existing charts without
  interactions retain their input boundary. The application must preserve IDs across sorting and
  refreshes and change an ID when the underlying item changes identity.
- A selection item identifies a rowId; a point additionally identifies seriesId. Category activation
  identifies one source row and all its series values. Duplicate category coordinates remain
  supported: category ties use input order, and point ties use input order then visible series order.
  No rows are implicitly aggregated. Callback payloads contain the item identity, original datum,
  category, associated raw values with series identity/label/visibility, and input method. They expose
  no renderer objects. Hidden series values remain associated data, but hidden points are not targets.
- Selection supports typed controlled selectedItems plus onSelectionChange, or uncontrolled
  defaultSelectedItems with optional onSelectionChange. The two ownership models cannot be combined.
  Selection labels supply instructions, clear, empty, count summary, item names, and hidden-item copy.
  Application code can coordinate charts by sharing selection and responding to activation separately.
- Retain IDs across value updates and reorderings. Remove deleted rows/series from internal selection;
  controlled state remains consumer-owned, with unavailable items omitted from rendering and commands.
  Hidden series remain selected. Data replacement or visibility changes cancel in-progress gestures
  to prevent acting on outdated geometry. Switching target kinds discards incompatible selection.
- Optional point markers remain optional when idle; interaction reading/selection may mark an item
  on a line even when showPoints is false. Keep selection geometry within explicit plotted domains.
- The approved pointer-focus correction is included as a prerequisite in this delivery and will be
  reviewed alongside production code. Prototype adaptation and experiment switches remain isolated.

### Bar and column production boundary

The [accepted bar contract](prototypes/bar-selection.md#accepted-contract) binds BarChart and
ColumnChart. Use the same activation/selection configuration and stable identity semantics as
LineChart, with a shared public interaction type; preserve the existing LineChartInteraction type.
Individual items are identified by row and series, regardless of the rectangular mark geometry.

Category targeting resolves the nearest category along its axis. Individual targeting then picks
the nearest visible bar rectangle. Drag rectangles select intersecting bars; category ranges follow
the category axis in either orientation. Keyboard category navigation follows that orientation,
and the other axis's arrows traverse visible series. Grouped, stacked, normalized, negative, and
zero source values stay within the existing input boundary. Callbacks report raw source values;
normalized readings and positions retain their existing displayed-share meaning.

Use Frame for persistent bar selection, keeping shared borders from covering adjacent inner cues.
Month reading and activation follow the union of the visible bars, without an internal seam.
Category selections underline the axis label in either orientation. Retain keyboard reading cues
on the target instead of adding a whole-chart outline. Keep all interaction geometry inside explicit
plot domains. Consumers keep ownership of controlled selections as in LineChart.

### Area and existing mixed-chart production boundary

The [accepted area/mixed contract](prototypes/area-mixed-selection.md#accepted-contract) binds
AreaChart and CartesianChart. Both expose the existing optional ChartInteraction configuration.
Keep stable identities, consumer-owned callbacks and controlled selection, hidden-selection retention,
gesture cancellation, and raw source payloads as in LineChart and BarChart. Existing supported
area stacking, normalization, scales, and mixed-series combinations remain the input boundary.

An area's marker sits at the plotted upper boundary; stacked/normalized positions do not change
its raw callback value. Individual drag selection uses value markers for areas/lines and intersected
bar rectangles for columns. Month targeting previews all visible values but emits one category
callback. Mixed charts render each mark's approved reading, selection, and activation treatment.

Resolve the nearest category, then the actual shapes under the pointer, including the area boundary
between categories. Legend emphasis breaks ties among overlapping shapes only. A sole hovered shape
wins even when another series is pinned; empty space falls back to nearest value/rectangle. Nearby
line points have a small hit region so overlapping column bodies do not swallow their targets.
Legend emphasis remains distinct from the item preview. No whole-chart focus outline is introduced.

### Scatter and bubble production boundary

The [accepted scatter/bubble contract](prototypes/scatter-bubble-selection.md#accepted-contract)
binds observation activation and selection. Existing idAccessor provides stable observation IDs.
Items use rowId plus seriesId, consistent with individual Cartesian items. Optional
PointChartInteraction exposes shared controlled/uncontrolled ChartSelection and an activation
callback with the source datum, item, input, label, raw x/y, and optional raw magnitude. There is no
category target or second identity accessor. Consumers own details and controlled selection updates.

All six existing symbols, existing numeric scales and explicit domains, invalid-row handling,
complete data tables, and size encoding remain supported. Centers inside determines rectangle
membership. Shape geometry determines hover/click hits; focused or pinned legend series only wins
among actual hits. Clip interaction cues to the plot and cancel gestures on data/geometry changes.
Keep noninteractive reading behavior compatible while interactive keyboard traversal reaches
coincident observations and leaves them. Statistical visibility, zoom/pan, other statistical chart
reading units, and new compositions remain later portions of the parent ticket.

The showcase separates each segmented radio control onto its own row, with ordinary switches and
buttons on separate rows. Production examples demonstrate selection and independent details.

### Histogram and box-plot production boundary

The [accepted distribution prototype](prototypes/distribution-selection.md#accepted-contract) binds
histogram/box-plot gestures and cues. [Ticket 08](tickets/08-distribution-interaction.md#callback-and-identity-boundary)
defines callback payloads and stable identities. Interactive outliers require application-provided
IDs, unique within their group, in both raw and summary modes. Equal-valued outliers remain distinct.
The app preserves an ID across updates only when it still identifies the same outlier.

Expose named bin, summary, and outlier selection items. Reuse controlled/uncontrolled ownership and
localized labels with a generic item type while preserving existing selection type defaults.
Histogram activation includes its interval item, raw ordinate and kind, source mode/records, and
input method. Box activation distinguishes summary statistics from individual outlier values and
includes their source records where supplied. Summary inputs cannot fabricate original observations.
The outlier identity callback receives groupId, value, and original datum; summary mode also provides
the outlier's index within that summary's list. Consumers use that context to return a stable ID.

Preserve existing raw/precomputed statistics, scale validation, complete tables, and symbol meanings.
Zero-count bins and zero-spread boxes remain reachable; use their rendered baseline/median segments
for hits and drag inclusion. Duplicate outlier values remain keyboard reachable. Data or geometry
changes cancel in-flight gestures. Histogram selection follows the full interval and inclusion rule;
box summaries follow group IDs and outliers follow group plus supplied ID. A removed item is retired.
Visibility for statistical families and further chart compositions remain later work.

## Testing Decisions

- Exercise hiding, restoring, all-hidden recovery, focus, order, stable identity, and clear-pin
  behavior through the public chart components.
- Verify visible-series domains, explicit bounds, zero baselines, logarithmic and normalized
  behavior, exact readings, complete tables, invalid input, and data/series replacement.
- Use controlled animation frames to verify intermediate finite bounds, interruption, reduced
  motion, and cancellation. Inspect the actual production example in the browser against the
  accepted prototype in light, dark, compact, forced-color, and reduced-motion states.
- Run affected tests, public types, repository checks, showcase build, and packed consumer checks.

## Out of Scope

The first implementation ticket excludes statistical and radial visibility semantics, selection
and activation APIs, exploration gestures, general data-shape animation, and new mixed-series
geometry. These remain required work in the parent ticket. Their unchosen behavior is not inferred
from acceptance of the legend example. Application layouts and scatter with adjacent distributions
remain outside the overall effort.

## Further Notes

No new glossary or architecture decision is needed for the first portion. Accepted chart scope is
already recorded in the [foundation decision](../library-foundation/decisions/13-charting-scope.md).

## Pie and donut interaction

The [accepted radial study](prototypes/radial-selection.md#accepted-contract) governs Outer edge,
expansion asterisks, reading cues, sweep selection and independent activation. [Ticket 09](tickets/09-pie-donut-interaction.md) records the production boundary and acceptance checks. Existing stable category IDs identify selectable positive categories. Paging preserves selected identities; aggregate navigation never becomes category activation. Zero values remain table-only.

## Marker ring spacing

Selection rings around circular markers meet the normal colored border at its current rendered
width, including hover emphasis and compact layouts. Scale conversion must not create a gap or
cover the normal border. Neutral radar reading fills reach the inner edge of that border. Bubble
reading centers retain their intentional small size and magnitude encoding. Noncircular selection
outlines retain their existing shapes. Existing Cartesian point spacing already satisfies this
contract; separate pie/donut outer arcs and transient activation halos retain their accepted forms.

## Radar interaction

RadarChart adds optional interaction with target `point` or `dimension`, independently optional
selection and activation, and existing stable series/dimension IDs. A selection item has
`dimensionId` and, for points, `seriesId`. Activation carries that item, the dimension ID/label,
input method, and values containing series ID/label, exact numeric value and original series datum.
Point activation includes one value; dimension activation includes all valid series values.

Preserve the accepted [radar study](prototypes/radar-selection.md). Selected points have rings
joined to their colored border; selected dimensions underline their labels. Neutral reading fills
match the radial guide and preview exactly the action target. Profile emphasis stays independent
of point/dimension targeting. Legend priority applies only among overlapping hit profiles.
Dimension activation draws a pulse from the center to the furthest actual value, holds at full
length, then fades. Point activation pulses its circle. Reduced motion uses brief static feedback.

Clicks/taps select when selection is enabled; modified click/key or touch hold activates without
changing selection. With selection disabled, ordinary click/key activates. A visible rectangle
selects positive value centers inside, replacing by default, adding with Shift/Control/Command and
removing with Alt. In dimension mode, any included center qualifies its dimension. Escape or
pointer cancellation restores the committed selection. Data, geometry, target, enabled selection
or activation changes cancel gestures and feedback. Callback identity updates alone do not cancel.

Keyboard Left/Right traverses dimensions, Up/Down traverses profiles, Home/End reaches dimension
endpoints. Enter/Space selects or activates according to enabled behavior; Control/Command activates
independently. Keyboard focus is shown by the current reading, with no whole-chart outline.
Zero values remain selectable by keyboard and as part of dimension selection. Pointer/rectangle
selection uses positive actual values only; coincident zero values and visual shoulders create no
pointer selection target. Missing values retain the existing zero interpretation, and invalid
series stay unavailable. Internal selection survives reorder and retires removed/invalid IDs;
controlled selection remains application-owned. Complete tables and original reading semantics
remain available. No visibility or normalization controls are added in this portion.

### Shared activation motion

Whitney requested standardization while retaining the general production pulse style, rejecting
the heatmap prototype's stationary fade. Cell frames are the accepted heatmap selection indicator.

- Use shared 620ms timing and easing, with feedback removed at 650ms. Repeated activations restart.
- Filled point pulses retain the existing expansion/fade shape and a consistent 10-screen-pixel
  base radius, including radar points. Outline pulses retain the production stroke and fade
  treatment, with a consistent five-pixel outset and three-pixel outward travel on each edge.
- Share outline animation geometry across bars, statistical marks and heatmap cells rather than
  scaling by a fixed percentage of their size. Preserve value-bearing mark geometry and selection.
- Pie/donut retain their slice-outline fade with the shared outline opacity envelope. Radar
  dimensions retain the accepted center-to-furthest-value draw, hold and fade.
- Reduced motion supplies static feedback for the same lifetime. Preserve zero-dimension feedback.
- The isolated heatmap study uses the same production outline animation, Cell frames only, and
  the accepted missing-cell targets. This portion does not implement public heatmap interaction.

### Heatmap cell interaction

The [accepted study](prototypes/heatmap-selection.md) binds the interaction and visual behavior.
Optional `HeatmapInteraction` uses `HeatmapSelectionItem` with stable `rowId` and `columnId` and
the existing controlled/uncontrolled `ChartSelection` convention. Applications provide localized
selection instructions, summaries and item names. Unknown or removed coordinate IDs are pruned;
selection follows IDs across domain order and value updates.

`HeatmapActivation` identifies the cell and labeled row/column, input method, recorded numeric
value or `undefined`, and original datum or `undefined`. An omitted cell has no invented record;
an invalid source value remains missing while its actual source record is available. Numeric zero
is an ordinary value. All rendered missing cells participate. Existing empty/error/loading and
entirely invalid dataset presentation remains unchanged.

Click/tap toggles selection. Control/Command-click and touch hold activate independently; without
selection, ordinary click/tap activates. Box touched dragging shows its region, replaces by default,
adds with Shift or Control/Command, removes with Alt, and cancels without committing a preview.
Keyboard Enter/Space selects; Control/Command plus Enter/Space activates. Arrow keys and row/grid
Home/End navigation preserve existing order and scrolling. Pointer focus must not create a first-cell
reading. Pending gestures cancel after data, layout, status or interaction changes.

Hover and keyboard reading use a dashed inner outline; selection uses solid individual cell frames.
Colors, cell gaps, native tooltip placement and complete data table remain intact. Activation uses
the shared outline pulse and static reduced-motion treatment. No whole-chart focus outline is added.
Production coverage uses the public Heatmap component and browser layout boundaries, including sparse
records, controlled ownership, drag cancellation, touch hold, keyboard operation and callback identity.

## Sparkline recorded-value interaction

The [accepted Sparkline study](prototypes/sparkline-selection.md) defines compact selection rings,
visible horizontal range dragging and independent activation. Existing current and directional
low/high cues retain their meaning and fills; neutral selection rings meet their outlines with no
gap. Ordinary selected readings receive a base circle. Activation uses shared point motion.

Optional `SparklineInteraction` requires a stable application `getRowId`, uses `SparklineSelectionItem`
with `rowId`, and supports the existing controlled/uncontrolled localized selection contract.
Activation exposes the stable item, original datum, typed position, finite value and input method.
IDs must be nonempty and unique among prepared records. Missing readings remain readable gaps and
are not selected or activated; zero remains a normal recorded value. Removed or missing IDs are
pruned without transferring selection to replacement readings. Source order and scale behavior stay
unchanged, including duplicate positions with distinct IDs and keyboard access to those readings.

Click/tap selects, Control/Command-click or touch hold activates independently. Without selection,
ordinary activation works. Horizontal range dragging replaces selection, Shift/Control/Command adds
and Alt removes; Escape and pointer cancellation restore the prior selection. Data, geometry,
status and interaction changes cancel gestures. Keyboard arrows and Home/End retain reading order;
Enter/Space selects and Control/Command-Enter/Space activates. Pointer focus must not start a reading
at the first record. No whole-chart focus border is introduced. Production retains its existing
tooltip, summary and table; the study's external reading is only a comparison aid.

Production tests exercise public selection/callback ownership and identity, gaps, zero, keyboard,
dragging, cancellation and touch hold. Direct browser inspection covers compact dark/light, dense
readings, forced colors and reduced motion. Public contracts, generated guides and the showcase
must demonstrate optional interaction. Independent reviews apply to production only.

## Statistical group visibility

Whitney approved extending the existing opening/closing eye controls first to ScatterChart,
BubbleChart and BoxPlot, then RadarChart. This slice covers the three statistical components.
Optional `visibilityLabels` reuses `ChartVisibilityLabels` and requires a visible legend. The eye
follows each group name; name clicks continue to pin emphasis independently. Hidden entries retain
legend order, colors and shapes, cannot emphasize invisible marks, and remain restorable. Hiding a
pinned group clears its pin. Removing an ID drops hidden state; new IDs begin visible.

Scatter and bubble hide all observations in a named series. Box plots hide a group's summary and
outliers together. Visible numeric axes fit automatically with the existing interruptible animation;
explicit app domains stay fixed and logarithmic axes stay positive. Box category positions use the
remaining groups in declared order. Bubble areas retain their existing magnitude interpretation
within the visible dataset. Exact values and statistical summaries are not interpolated or
recomputed across groups.

Selection stays attached to hidden records and is described as hidden in its summary. Hidden
observations are excluded from pointer, keyboard, drag and activation targets. Hiding/restoring
cancels gestures and stale readings. Data removal still prunes selection. The complete data table
retains hidden groups and labels them. Input validation uses the full dataset before visibility.
All-hidden state retains caption, legend, full table, selection and a localized Show all control
which restores focus to the first eye.

Use the approved Cartesian legend visual contract directly; no new prototype is needed for these
three charts. Reuse existing tokens, eye shape and motion in light/dark, compact, forced-color and
reduced-motion states. Validate through public component tests, direct rendered operation, public
types, repository/package checks and independent production reviews. Update the component showcase
and canonical contracts in the same change.

Histogram and Sparkline hide/show controls are excluded because each currently has one dataset.
Pie/donut percentage behavior remains a later decision. Heatmap visibility should use row/column
labels rather than controls in cells; hover/focus reveal and touch discovery need a small later
prototype. No heatmap prototype or radar implementation begins in this statistical slice.

## Radar series visibility

Extend the approved legend eyes to RadarChart through optional `visibilityLabels`. Each eye hides
or restores one whole profile. Legend names keep their independent pin behavior; hidden names
remain in their original order and retain their color and pattern, but cannot gain emphasis.
Removing an ID clears its hidden state; value updates retain it. Hiding clears that profile's pin.

Fit the existing shared, zero-based radial scale to visible profiles with the established 240ms
interruptible animation and immediate reduced-motion settlement. Keep rendered marks within the
radar during restoration. Preserve exact raw values, zero-center behavior and sparse-fill shoulders.
No dimension normalization or new scale configuration is introduced.

Keep hidden point selections, labeled through the existing selection hidden formatter. Dimension
selection remains one dimension, applying its visible indicators to visible profiles. Its activation
reports visible profiles; hidden points cannot be hovered, dragged, activated or reached by keyboard.
All-zero dimensions remain reachable by keyboard and dimension selection. Visibility, data and
geometry changes cancel active gestures and stale readings. Removed data still prunes selection.

Keep the full table with hidden profile headers. All hidden retains the legend, selected summary,
caption and table, with localized recovery and Show all returning focus to the first eye. Validate
full input before filtering. Keep existing loading, error, partial and invalid feedback.

Reuse the approved eye and radar layout without another prototype. Public component tests cover
visibility, fitting, callbacks, selection, stable identities and recovery. Validate the rendered
examples with keyboard, touch, compact widths, themes and interrupted animation. Update the public
contract, generated guide and showcase in the same delivery.

## Legend release

The approved repeated legend activation clears its emphasis visibly, including while a mouse
remains over the entry or keyboard focus remains on it. Clear temporary legend emphasis together
with toggling the pin, without moving focus. A subsequent hover or focus can preview it again.
Apply this existing toggle contract consistently to Cartesian, statistical, radar and pie/donut
legends. No visibility, reading, data-selection or activation callback behavior changes.

## Pie and donut visibility: accepted totals

Whitney approved recalculating around visible categories. Hiding a 50% category from values
50, 30 and 20 makes the remaining shares 60% and 40%, filling the circle. The donut center total
reflects visible values. Full source records remain available in the table, and hiding retains
selection as in the other chart families. Preserve the approved animated fitting and eye controls.

Eyes apply only to individual categories. Expansion remains navigation and receives no bulk eye.
Hiding frees an ordinary-slice slot and pulls the next visible ranked category out of the expansion.
Hidden categories do not consume slice slots. When the remaining visible categories fit, remove the
expansion and show them all. Preserve source ranking; restoration puts the category back in rank
order and returns the last ordinary category to the expansion when the page is full. Category colors,
patterns and selections follow their IDs across these moves.

Keep hidden entries with closed eyes in the ranked legend so they remain restorable. The legend may
contain more entries than visible slices; retain bounded scrolling on compact layouts. Page boundaries
follow visible capacity while retaining hidden records in their ranked legend range. If pages collapse,
stay on the nearest available page and do not jump forward again on restoration. The expansion count describes its remaining ranked records. Show one asterisk when any of those
records is selected or hidden, including when selection is disabled. Hidden or selected ordinary
legend entries outside expansion do not mark it. Accessible expansion names and keyboard readings
identify the hidden category labels using the localized hidden label, alongside any selection status. No bulk
eye is added. This replaces Ticket 18's initial fixed-page behavior.

Add optional `visibilityLabels` using the existing chart copy contract. Hiding clears that category's
pin and reading, cancels gestures, and excludes it from pointer, keyboard, activation and sweep
selection. Full positive-category IDs still preserve hidden selections, including the selected
asterisk on expansion entries. Removed or invalid items retain existing selection-pruning behavior.

Animate visible slice boundaries together over 240ms, retargeting interrupted visibility changes.
Reduced motion settles immediately. Paging and source-data replacement retain their current reset
behavior. Readings and callbacks report exact visible totals/shares, never interpolated geometry.
`shareOfTotal` uses all visible categories across pages; `shareOnPage` uses visible ordinary categories
on the current page. The donut center reports the visible total across all pages.

The full table keeps raw records, marks hidden categories, and reports visible shares for visible
rows; hidden rows use the localized hidden label instead of a percentage. Zero records remain in
the table without slices or visibility eyes. Full-source validation and loading/error feedback remain.
When all categories are hidden, pages collapse to one; retain the full legend, caption, table and
selection and show recovery. Offer individual eyes and Show all, with no instruction to change page.
Show all restores all categories and focuses the first eye. Update both public guides and showcase.

## Heatmap visibility: accepted behavior

The [accepted visibility study](prototypes/heatmap-visibility.md#acceptance-contract) binds the next
Heatmap visibility slice. Put individual eyes on row and column labels, revealing on hover or
keyboard focus and keeping them visible on touch. Hiding removes the entire data track and lets
remaining cells refit. A permanently visible closed eye with a count beside the row-axis heading
opens an overlaid restore list. Restore individual dimensions using their closed eyes. Preserve
hidden selection and the full readings table, including missing cells and zero. Do not reserve
blank tracks, put eyes at intersections, or add a bottom restoration section. Preserve existing
selection and activation semantics, including visible feedback on the first touch hold.

Optional `visibilityLabels: HeatmapVisibilityLabels` enables internal hiding by stable row/column IDs.
The copy contract provides `hideRow`, `showRow`, `hideColumn`, `showColumn`, `restore` count formatter,
`hiddenRows`, `hiddenColumns`, `hidden`, `showAll`, `close`, and `allHidden` state copy. Hidden IDs
survive values and reordering, prune on domain removal, and reset when visibility is disabled.
Validate full-source records and accessor indices before deriving visible geometry and automatic
color domains; explicit domains remain fixed. Animate refitting briefly with reduced-motion support.
Keep hidden selections labeled and recoverable, with Clear selection clearing everything. The
full table labels hidden rows and columns. All-hidden recovery retains caption, table, selection,
individual restoration and Show all. Visibility changes cancel in-flight gestures.

[Ticket 21](tickets/21-heatmap-visibility.md) owns public behavior/type tests, generated docs,
showcase operation and independent production review.

## Line-chart pan and zoom

Whitney approved pan and zoom for the demonstrated continuous-time LineChart. Preserve the
[accepted behavioral contract and runnable study](prototypes/domain-exploration.md#accepted-pan-and-zoom-contract),
including direct two-finger exploration, independent selection, attached controls, visible-data
fitting and selection persistence. Overview access follows the later accepted modal contract below.
The production boundary below defines range callbacks, application bounds and wheel behavior.

## Compact chart layout consistency

Use the available space and established fitting techniques before hiding labels. Apply them
consistently across chart types when appropriate to the geometry, including time and numeric
axes. Preserve readable text, unambiguous values, complete axis titles, correct tick positions
and the association between labels and selection indicators. Existing local scroll behavior
remains available when spacing and staggering cannot preserve the labels.

The [compact-layout audit](research/compact-layout-audit.md) records the confirmed defects and
limits of the initial review. [Ticket 22](tickets/22-consistent-axis-label-fitting.md) addresses
axis crowding and missing box staggering. [Ticket 23](tickets/23-visible-axis-titles.md) addresses
clipped vertical titles. [Ticket 24](tickets/24-readable-radar-labels.md) preserves a 12px rendered minimum for radar labels without changing the approved interactions. None of these findings expands approval of exploration to other charts.

## Accepted horizontal exploration group

The [combined study](prototypes/chart-exploration-comparison.md#accepted-behavior) extends the
approved monthly line exploration to area, grouped columns, stacked columns and columns with a
line. Its corrected live production selection marks and plot-attached controls are binding.
The later family contracts and production boundary below define the other domain shapes and API responsibilities.

## Accepted scatter and bubble exploration

Use the [accepted two-axis contract](prototypes/point-exploration.md#accepted-behavior) and retained
source. The overview keeps its correct proportions in the existing Dialog, opened directly from
its chart icon under the later modal contract below. Keep the accepted plain copy and retain the
view on dismissal. Preserve production selection/activation, two-finger pan and pinch, stable
magnitude reference, and viewport clipping.

## Accepted remaining exploration families

The [combined distribution/category contract](prototypes/remaining-exploration.md#accepted-behavior)
is approved. Preserve the horizontal histogram and box strips in the shared overview dialog, the fixed-height
horizontal station strip transposed to vertical chart categories, the rectangular heatmap map,
production visibility controls and their synchronized overviews, fixed chart dimensions during
navigation, and a Room label that remains readable beside the restore eye and count.

## Accepted modal overview access

The [modal overview contract](prototypes/modal-overview.md#accepted-behavior) supersedes earlier
disclosure and expansion entry points across all demonstrated chart types. Use one quiet
Overview IconButton beside the chart's zoom/reset controls, with an accessible label and tooltip.
It opens the existing Dialog directly, containing the current range, full-data reference,
Reset view and Done. Closing retains the adjusted range and returns focus to the trigger.
Horizontal families keep horizontal strips, including transposed horizontal bars. Scatter,
bubble and heatmap keep proportional rectangular maps. Hidden data stays hidden in both views.
Window movement and resizing follow the pointer immediately throughout a drag. Keyboard and
reset motion retain their animations and reduced-motion behavior. There is no inline disclosure,
duplicate miniature or second expand action. These access changes do not alter other accepted
selection, activation, navigation or identity semantics.

## Production exploration boundary

Exploration is opt-in and independent of selection and activation. The accepted artifacts define
its controls, gestures, layout, motion and visible feedback. Applications supply localized control
and range labels, as for existing chart interaction. They may let the chart own its window or
provide the current window plus a change callback. Default and controlled windows are exclusive.
Range callbacks contain domain values or stable category identities, never display indexes,
pixel coordinates, renderer objects or private gesture state. Applications can coordinate views
by passing these values deliberately; charts do not share global state.

The production sequence delivers the following complete paths:

- Continuous numeric/time LineChart navigation first, with attached controls, the horizontal
  overview, native two-finger arbitration and controlled-range examples.
- Remaining Cartesian category navigation and line/area/column combinations using that same
  interaction foundation. Horizontal bars transpose only their overview, keeping the main chart's
  vertical category order. Categorical windows include complete category bands.
- Scatter and bubble explore both numeric dimensions. Their overview retains correct proportions,
  with direct modal access under the accepted overview contract. Bubble magnitude is derived before viewport
  clipping so navigation cannot change an observation's represented size.
- Histograms explore complete bins prepared from the full data; counts, boundaries and upper-edge
  inclusivity never depend on the current window. Box plots explore group identities and preserve
  complete summaries and stable outlier IDs. They use horizontal strips in the shared overview dialog.
- Heatmap windows contain complete rows and columns. Hidden tracks close their gaps in the chart
  and overview and remain restorable. Color meaning is independent of the viewport.

Existing explicit scale domains remain application constraints. Without explicit constraints, the
full valid, visible data determines reset bounds; the viewport is a separate window within those
bounds. Navigation never silently overwrites the application's scale definition. Automatic value
axes fit visible geometry, including boundary-crossing lines/bands and required zero baselines;
normalized values retain their meaning. Numeric/time windows are clamped in their scale space;
categorical windows use ordered category values or IDs. Stable identity must survive reordering
and equal-valued observations. Invalid application windows receive clear validation errors;
changes to valid data reconcile the window to available bounds without changing selection IDs.

An unchanged full-range view follows changes to the full domain. A zoomed window preserves its
position and span where possible, shifting only enough to remain within changed bounds. Empty
numeric windows retain the axes, navigation controls, overview and reset; absence of observations
inside the window is not invalid input. All-hidden recovery remains the existing visibility state.
Full data preparation and its structured alternative remain available independently of clipping.
Keyboard target lists contain visible interactive items; off-screen items cannot be accidentally
activated through a stale reading. Selections outside the window remain retained and named.

Continuous gesture updates notify the application as the visible range changes; a separate
completion notification allows expensive work after release. Button and keyboard changes complete
immediately. Cancelled gestures restore their starting window; the second touch cancels pending
selection and activation before exploration begins. Controlled changes report intent and follow
the supplied value without feedback loops. Changing only callback identity must not cancel input.

Ordinary wheel scrolling remains browser scrolling in this delivery. Pie/donut, radar and
Sparkline do not receive new exploration controls in this phase. The two additional compositions,
general data-transition animation and whole-library responsiveness budgets remain separate parent
work. This does not exclude those accepted parent requirements.

### Production verification

Preserve the accepted prototypes and compare rendered production at compact and wide sizes, light
and dark appearances, visible/hidden/all-hidden states and reduced motion. Verify the public
component seam for controlled and internal windows, callbacks, IDs, data replacement, full tables,
clipping and interaction arbitration. Use meaningful regressions for coordinate and state bugs.
Package types, SSR/hydration, generated contracts, chart isolation and the human-facing showcase
must remain current. Prototype bridges, DOM mutation and fixture-specific geometry do not ship.

## Production combined-chart boundary

The [accepted combined study](prototypes/combined-charts.md#acceptance-contract) adds scatter with a supplied line and a line with a changing range. Established chart contracts take precedence over incidental prototype behavior.

CartesianChart gains a `range` series with separate lowerAccessor and upperAccessor. It uses the existing category rows and linear value axis. Equal bounds are valid. A missing bound leaves a gap in that series without removing another series at the same category. Nonfinite or reversed bounds are invalid and leave a gap with the existing invalid-data feedback. Neither bounds nor samples are silently reordered or calculated. The displayed value domain includes both bounds and follows visibility and navigation. Tables and readings name both limits. Range activation adds a typed `ranges` collection to the existing event, leaving scalar `values` intact. A point-target range event contains one range and no scalar values; category activation contains the present scalar values and ranges at that category.

A range item retains the existing row/series identity. Its two value markers are one selection, with the approved connector between outer rings. Dragging includes the item when either endpoint center is inside the rectangle, extending the accepted value-marker rule to both supplied values. Month selection still uses an underline. Gaps are not selectable. Click overlap priority, keyboard, hold activation, drag previews, pulse timing, hidden selection and shared overview behavior remain established contracts.

ScatterChart gains an optional supplied `line` with its own data, ID/label/x/y accessors, series identity and typed activation callback. Its data type can differ from observation data. Shared selection identifies observations and samples by row and series; IDs must remain stable, and duplicate coordinates are allowed. The line connects samples in supplied order, leaves gaps for missing/invalid coordinates and uses the same numeric axis units. It does not calculate a fit. Observations and line count together toward the existing six-series limit. The line uses its own eye, swatch, sample reading and selection; hide, fitting, full tables and both-axis exploration include it. Segments remain visible across viewport boundaries even when their samples are outside. Clicks near a segment resolve to a visible supplied endpoint, as in the accepted study; they never manufacture interpolated callback data. Center-inside dragging remains the point selection rule. Up sits above Down in reserved space beside the plot, with Left/Right below.

Production tests use public components and events to cover both combinations, gaps and invalid bounds, stable identity, overlap priority, callback ownership, hiding, fitting and overview navigation. Native compact/wide, touch, light/dark and reduced-motion checks cover the accepted visual relationships. The showcase and public contracts document both complete examples. No additional prototype approval is needed.
