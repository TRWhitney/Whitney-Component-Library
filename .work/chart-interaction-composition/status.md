# Chart interaction and composition

## Destination

Deliver the remaining behavior in [Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md).

## Current state

Heatmap visibility is delivered in `3600497`. Whitney approved pan and zoom for the continuous-time
LineChart in the [exploration study](prototypes/domain-exploration.md#accepted-pan-and-zoom-contract).
The [compact-layout audit](research/compact-layout-audit.md) led to production fixes in tickets
22–24: shared axis fitting, visible vertical titles and readable radar text. Validation and
independent intent and engineering reviews pass. The [combined exploration study](prototypes/chart-exploration-comparison.md) now covers area, grouped and stacked columns, mixed columns/line and a line reference. Whitney approved the corrected horizontal group. The [scatter/bubble study](prototypes/point-exploration.md#accepted-behavior) is approved, including the centered, directly resizable compact map, integrated expand icon and plain dialog. Whitney requires retaining the full-space reference; both the large permanent overview and distorted strip were rejected. The remaining distribution/category/heatmap study is approved. The production boundary and tickets 25–30 define the implementation sequence. Ticket 25 layout prerequisites are delivered with 761 passing tests, packed React 18/19 verification and independent reviews. The [modal overview](prototypes/modal-overview.md#accepted-behavior) is now approved, including its icon-only trigger and direct touch dragging. Tickets 26–30 reflect the chosen access pattern; ticket 26 is completed. Ticket 27 is next.

## Progress

- [Ticket 26](tickets/26-line-exploration.md) delivers public LineChart pan, zoom and modal overview with controlled coordination, native touch arbitration, full-data preservation and current showcase/contracts. All 780 tests, repository/package checks and both independent review axes pass.

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

[Ticket 25](tickets/25-exploration-layout-foundation.md#completion-evidence) records 761 passing tests, repository and package checks, and inspected production spacing and visibility flows. Independent intent and engineering reviews pass.

[Ticket 21](tickets/21-heatmap-visibility.md#completion-evidence) records the passing repository,
public type, package and browser checks, plus independent intent and engineering reviews.

## Out of scope

Scatter with adjacent distribution charts, application layouts, implicit statistical calculations,
and any change to the accepted chart palette or existing reading semantics.

## Continuation

- Resume with `python3 /home/whitney-white/.codex/skills/work-system/scripts/navigate.py resume novel-work implementation`.
- Branch: `main`; Heatmap interaction is `4567f20`. Sparkline is `f06085b`. Statistical visibility is `3e6a391`. Radar visibility is `5c51e05`. Legend release is delivered in the commit containing this record.
- Production showcase: `http://localhost:5174`, Vite session `54846`.
- Next action: implement ticket 27 with the delivered shared controls/domain model, then continue tickets 28–30. The modal overview design is approved. No further design question is pending. Prototype work used no agents or production tests.
- Tickets 22–24, accepted exploration source, audit evidence and work records are delivered with the compact-layout fixes. Axis fitting is `813f5c6`; title fitting is `ed596b0`; radar text is `e28dc57`.
- Ticket 21 component/types/styles/tests, showcase/contracts/generated guides and accepted prototype/spec/map/status records are committed together.

- Ticket 25 production changes, accepted exploration prototypes and records, and tickets 26–30 are committed. Heatmap spacing is `7a2fe96`. The production preview is refreshed and its Station 10 click was verified remotely.
- Production checks for tickets 22–24 passed: 758 tests, public consumer types, packed React 18/19 verification, showcase build and independent intent/engineering reviews. The public showcase build is refreshed.

- [Record and run instructions](prototypes/remaining-exploration.md). Revised after overview feedback: histogram/box use long strips without popouts; bar dimensions stay fixed and its horizontal strip transposes station navigation; the heatmap Room label has space for its restore eye; production eyes and shared overview visibility are enabled. Heatmap retains its rectangular overview. Whitney approved the completed study.
