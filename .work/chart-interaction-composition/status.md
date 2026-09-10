# Chart interaction and composition

## Destination

Deliver the remaining behavior in [Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md).

## Current state

[Ticket 21](tickets/21-heatmap-visibility.md) implements the approved public Heatmap visibility
controls and corner restore list. The showcase and canonical/generated guides are current.
Repository checks pass 752 tests, type matrices and chart isolation. Desktop/touch hide,
restore and first-hold activation flows pass. Independent intent and engineering reviews pass. The long-label clipping finding was corrected
and revalidated; the bounded correction review passed. This slice is delivered in the commit
containing this record.

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
are settled. Scatter/bubble Centers inside selection is delivered. Radar, heatmap and Sparkline interaction are delivered. Heatmap visibility completes the planned visibility controls. Exploration and the added compositions remain later work.

## Accepted sources

- [Reconciled Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md)
- [Specification](spec.md)
- [Approved activation and selection contract](prototypes/activation-selection.md#accepted-convention)
- [Chart scope](../library-foundation/decisions/13-charting-scope.md#ticket-22-reconciliation)
- [Existing Cartesian interaction](../chart-interactivity/spec.md)

## Verification

[Ticket 21](tickets/21-heatmap-visibility.md#completion-evidence) records the passing repository,
public type, package and browser checks, plus independent intent and engineering reviews.

## Out of scope

Scatter with adjacent distribution charts, application layouts, implicit statistical calculations,
and any change to the accepted chart palette or existing reading semantics.

## Continuation

- Resume with `python3 /home/whitney-white/.codex/skills/work-system/scripts/navigate.py resume novel-work planning`.
- Branch: `main`; Heatmap interaction is `4567f20`. Sparkline is `f06085b`. Statistical visibility is `3e6a391`. Radar visibility is `5c51e05`. Legend release is delivered in the commit containing this record.
- Production showcase: `http://localhost:5174`, Vite session `54846`.
- Next action: settle exploration controls and their interaction with selection, automatic fitting and explicit domains, then plan the next implementation slice. All planned visibility controls are delivered; the map retains remaining animation/composition decisions.
- Ticket 21 component/types/styles/tests, showcase/contracts/generated guides and accepted prototype/spec/map/status records are committed together. No intentionally uncommitted work remains.
