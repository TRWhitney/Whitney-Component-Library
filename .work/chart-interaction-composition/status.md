# Chart interaction and composition

## Destination

Deliver the remaining behavior in [Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md).

## Current state

AreaChart and CartesianChart are delivered in `c0c09a6`. The
[scatter and bubble prototype](prototypes/scatter-bubble-selection.md) is approved with Centers inside.
[Ticket 07](tickets/07-scatter-bubble-interaction.md) is complete with passing production checks and independent reviews. Parent Ticket 22 stays open.

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
are settled. Scatter/bubble Centers inside selection is delivered. Plan interaction for histogram,
box plot, radial, heatmap, and compact reading units next. Exploration and the added compositions remain later work.

## Accepted sources

- [Reconciled Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md)
- [Specification](spec.md)
- [Approved activation and selection contract](prototypes/activation-selection.md#accepted-convention)
- [Chart scope](../library-foundation/decisions/13-charting-scope.md#ticket-22-reconciliation)
- [Existing Cartesian interaction](../chart-interactivity/spec.md)

## Verification

[Ticket 07](tickets/07-scatter-bubble-interaction.md#completion-evidence) records the current 622 passing
tests, repository/build/package checks, and inspected production flows. Prototype acceptance remains
separate from production verification.

## Out of scope

Scatter with adjacent distribution charts, application layouts, implicit statistical calculations,
and any change to the accepted chart palette or existing reading semantics.

## Continuation

- Resume with `python3 /home/whitney-white/.codex/skills/work-system/scripts/navigate.py resume novel-work planning`.
- Branch: `main`; scatter/bubble delivery follows `c0c09a6` and the separate showcase radio-row commit as `[Feature] Add scatter and bubble interaction`.
- Production showcase: `http://localhost:5174/#scatter-chart` and `http://localhost:5174/#bubble-chart`.
- Owned uncommitted paths: none after delivery.
- Next action: plan selection/activation for the remaining histogram and box-plot reading units; retain the broader frontier in the decision map.
- Active prototype: `http://localhost:5178`, Vite session `78529`.
- Accepted prototype observations and gestures are recorded in its linked contract. No prototype
  agents or automated suites were used. Production verification is recorded separately.
