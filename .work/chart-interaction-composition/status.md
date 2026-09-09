# Chart interaction and composition

## Destination

Deliver the remaining behavior in [Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md).

## Current state

BarChart and ColumnChart now implement the accepted Frame contract under
[ticket 05](tickets/05-bar-column-interaction.md). Production validation and independent intent and engineering reviews pass.
The bar/column portion is delivered; Parent Ticket 22 stays open.

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

The [decision map](map.md) indexes the remaining decisions and unspecified work. The
[bar selection decision](decisions/01-bar-selection.md) is settled as Frame. After this delivery,
plan area and mixed-chart interaction before moving to other reading units and exploration.

## Accepted sources

- [Reconciled Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md)
- [Specification](spec.md)
- [Approved activation and selection contract](prototypes/activation-selection.md#accepted-convention)
- [Chart scope](../library-foundation/decisions/13-charting-scope.md#ticket-22-reconciliation)
- [Existing Cartesian interaction](../chart-interactivity/spec.md)

## Verification

[Ticket 05](tickets/05-bar-column-interaction.md#completion-evidence) records production regression,
repository, package, and browser checks. Full tests now total 607 in 36 files. The accepted
prototype is the design source; its approval is separate from production verification.

## Out of scope

Scatter with adjacent distribution charts, application layouts, implicit statistical calculations,
and any change to the accepted chart palette or existing reading semantics.

## Continuation

- Resume with `python3 /home/whitney-white/.codex/skills/work-system/scripts/navigate.py resume novel-work planning`.
- Branch: `main`; bar delivery follows `4d934cc` as `[Feature] Add bar selection and activation`.
- Current prototype: `http://localhost:5176`, Vite session `53932`.
- Production showcase: `http://localhost:5174/#column-chart` and `/#bar-chart`, Vite session `57087`.
- No owned uncommitted paths remain after this delivery commit.
- Next action: plan area and mixed-chart interaction from the remaining decisions in the map.
- Direct prototype operation covered both styles, light/dark, grouped/stacked, horizontal bars,
  bar/category drag, modified activation, touch hold, compact layout, and element identification.
  No prototype agents or prototype automated suites were run. Production verification is recorded separately.
