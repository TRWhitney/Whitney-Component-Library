# Chart interaction and composition

## Destination

Deliver the remaining behavior in [Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md).

## Current state

Pie/donut visibility is implemented in [Ticket 18](tickets/18-pie-donut-visibility.md).
Whitney chose individual eyes only. Hidden categories retain their pages and colors; visible
categories refill the circle and determine percentages and the donut total. Expansion remains
navigation even when its slice is absent. Validation and independent intent/engineering reviews passed. Ticket 18 is delivered in the commit containing this record. Legend release remains delivered in `d259e79`.

## Progress

- Reconciled scope accepted in `e899b8e`.
- Cartesian eye controls and automatic animated visible-data scales delivered in `a3ea65b`,
  documented in [ticket 01](tickets/01-cartesian-visibility.md).
- Pointer focus no longer starts or restores a January keyboard reading (`162c5aa`), documented in
  [ticket 02](tickets/02-pointer-reading-focus.md).
- LineChart delivers the approved activation, selection, dragging, indicators, and touch hold
  behavior through its public API, documented in [ticket 03](tickets/03-line-chart-activation-selection.md).
  Public contracts, generated guides, and the rendered showcase are current.

- Line hover emphasis remains independent of month/point targeting, documented in
  [ticket 04](tickets/04-category-hover-emphasis.md). Month mode retains all visible filled centers.

## Frontier

The [decision map](map.md) indexes the remaining work. Frame for bars and Value marker for areas
are settled. Scatter/bubble Centers inside selection is delivered. Radar, heatmap and Sparkline interaction are delivered. Remaining visibility follows. Exploration and the added compositions remain later work.

## Accepted sources

- [Reconciled Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md)
- [Specification](spec.md)
- [Approved activation and selection contract](prototypes/activation-selection.md#accepted-convention)
- [Chart scope](../library-foundation/decisions/13-charting-scope.md#ticket-22-reconciliation)
- [Existing Cartesian interaction](../chart-interactivity/spec.md)

## Verification

[Ticket 18](tickets/18-pie-donut-visibility.md#completion-evidence) records the passing repository,
public type, package and browser checks, plus independent intent and engineering reviews with no findings.

## Out of scope

Scatter with adjacent distribution charts, application layouts, implicit statistical calculations,
and any change to the accepted chart palette or existing reading semantics.

## Continuation

- Resume with `python3 /home/whitney-white/.codex/skills/work-system/scripts/navigate.py resume novel-work planning`.
- Branch: `main`; Heatmap interaction is `4567f20`. Sparkline is `f06085b`. Statistical visibility is `3e6a391`. Radar visibility is `5c51e05`. Legend release is delivered in the commit containing this record.
- Production showcase: `http://localhost:5174`, Vite session `54846`.
- Next action: plan heatmap visibility controls without an eye at every intersection, then present any unresolved behavior for Whitney's choice. Pie/donut visibility is complete. Exploration, general data-change animation, and added compositions remain later work.
