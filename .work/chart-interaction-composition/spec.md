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
