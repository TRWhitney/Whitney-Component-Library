# Chart interaction and composition

## Destination

Deliver the remaining behavior in [Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md).

## Current state

AreaChart and CartesianChart are delivered under [ticket 06](tickets/06-area-mixed-interaction.md).
Whitney chose Value marker after accepting overlap-only legend priority. The
[accepted contract](prototypes/area-mixed-selection.md#accepted-contract) is the design source.
Validation and independent intent/engineering reviews pass. Parent Ticket 22 stays open.

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
are settled. After ticket 06 delivery, plan interaction for the remaining statistical, radial,
heatmap, and compact reading units. Exploration and the added compositions remain later work.

## Accepted sources

- [Reconciled Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md)
- [Specification](spec.md)
- [Approved activation and selection contract](prototypes/activation-selection.md#accepted-convention)
- [Chart scope](../library-foundation/decisions/13-charting-scope.md#ticket-22-reconciliation)
- [Existing Cartesian interaction](../chart-interactivity/spec.md)

## Verification

[Ticket 06](tickets/06-area-mixed-interaction.md#completion-evidence) records the current 614 passing
tests, repository/build/package checks, and inspected production flows. Prototype acceptance remains
separate from production verification.

## Out of scope

Scatter with adjacent distribution charts, application layouts, implicit statistical calculations,
and any change to the accepted chart palette or existing reading semantics.

## Continuation

- Resume with `python3 /home/whitney-white/.codex/skills/work-system/scripts/navigate.py resume novel-work planning`.
- Branch: `main`; area/mixed delivery follows `0a517e9` as `[Feature] Add area and mixed chart interaction`.
- Production showcase: `http://localhost:5174/#area-chart` and `/#cartesian-chart`.
- No owned uncommitted paths remain after this delivery commit.
- Next action: plan selection and activation for the remaining chart reading units.
- Active prototype: `http://localhost:5177`, Vite session `87353`.
- Accepted prototype observations and gestures are recorded in its linked contract. No prototype
  agents or automated suites were used. Production verification is recorded separately.
