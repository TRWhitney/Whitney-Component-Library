# Chart interaction and composition

## Destination

Deliver the remaining behavior in [Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md).

## Current state

Heatmap visibility is delivered in `3600497`. Whitney approved pan and zoom for the continuous-time
LineChart in the [exploration study](prototypes/domain-exploration.md#accepted-pan-and-zoom-contract).
The [compact-layout audit](research/compact-layout-audit.md) led to production fixes in tickets
22–24: shared axis fitting, visible vertical titles and readable radar text. Validation and
independent intent and engineering reviews pass. Next is one exploration prototype covering several
chart types together, as Whitney requested. Other chart exploration and public range contracts
remain planning work.

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
- [Approved line-chart pan and zoom](prototypes/domain-exploration.md#accepted-pan-and-zoom-contract)
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

- Resume with `python3 /home/whitney-white/.codex/skills/work-system/scripts/navigate.py resume novel-work delivery`.
- Branch: `main`; Heatmap interaction is `4567f20`. Sparkline is `f06085b`. Statistical visibility is `3e6a391`. Radar visibility is `5c51e05`. Legend release is delivered in the commit containing this record.
- Production showcase: `http://localhost:5174`, Vite session `54846`.
- Next action: return to planning and build one combined exploration study for multiple chart types. Do not use agents or production testing for that prototype. Pause only for consequential choices that need Whitney's input.
- Tickets 22–24, accepted exploration source, audit evidence and work records are delivered with the compact-layout fixes. Axis fitting is `813f5c6`; title fitting is `ed596b0`; radar text is delivered in the commit containing this record.
- Ticket 21 component/types/styles/tests, showcase/contracts/generated guides and accepted prototype/spec/map/status records are committed together.
