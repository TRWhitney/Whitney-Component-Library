# Chart interaction and composition

## Destination

Deliver the remaining behavior in [Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md).

## Current state

[Ticket 13](tickets/13-heatmap-interaction.md) delivers the approved heatmap cell selection,
independent activation, dashed hover and solid selection frames. All 686 tests, repository/build/
package checks and independent production reviews pass after the keyboard-tooltip scroll correction.
The accepted [heatmap study](prototypes/heatmap-selection.md) remains the visual contract.
Parent Ticket 22 stays open for the remaining chart families and capabilities.

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
are settled. Scatter/bubble Centers inside selection is delivered. Radar and heatmap interaction are delivered. Compact reading units follow. Exploration and the added compositions remain later work.

## Accepted sources

- [Reconciled Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md)
- [Specification](spec.md)
- [Approved activation and selection contract](prototypes/activation-selection.md#accepted-convention)
- [Chart scope](../library-foundation/decisions/13-charting-scope.md#ticket-22-reconciliation)
- [Existing Cartesian interaction](../chart-interactivity/spec.md)

## Verification

[Ticket 13](tickets/13-heatmap-interaction.md#completion-evidence) records the passing repository,
public type, package and browser checks, plus independent intent and engineering reviews.

## Out of scope

Scatter with adjacent distribution charts, application layouts, implicit statistical calculations,
and any change to the accepted chart palette or existing reading semantics.

## Continuation

- Resume with `python3 /home/whitney-white/.codex/skills/work-system/scripts/navigate.py resume novel-work planning`.
- Branch: `main`; radar interaction committed as `df6d702`, marker fixes as `e0eac43`.
- Production showcase: `http://localhost:5174`.
- Accepted radar study: `http://localhost:5181`, Vite session `68691`.
- Heatmap study: `http://localhost:5182`, Vite session `20034`.
- Next action: plan interaction for the compact reading units. Heatmap interaction is delivered in the commit containing this record. Keep prototype revisions short, without tests or agent reviews.
