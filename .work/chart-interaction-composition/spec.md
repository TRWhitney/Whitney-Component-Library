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
