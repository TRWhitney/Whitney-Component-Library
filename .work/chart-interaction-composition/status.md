# Chart interaction and composition

## Destination

Deliver the remaining behavior in [Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md).

## Current state

[Ticket 09](tickets/09-pie-donut-interaction.md) delivers pie/donut selection and independent
activation, including the approved outer edge, expansion asterisk, and visible sweep trail.
Validation and independent production reviews pass. The [radar study](prototypes/radar-selection.md) is accepted. [Ticket 10](tickets/10-marker-ring-spacing.md) delivers the confirmed marker-gap fixes. Parent Ticket 22 stays open.

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
are settled. Scatter/bubble Centers inside selection is delivered. Plan interaction for radar, heatmap, and compact reading units next. Exploration and the added compositions remain later work.

## Accepted sources

- [Reconciled Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md)
- [Specification](spec.md)
- [Approved activation and selection contract](prototypes/activation-selection.md#accepted-convention)
- [Chart scope](../library-foundation/decisions/13-charting-scope.md#ticket-22-reconciliation)
- [Existing Cartesian interaction](../chart-interactivity/spec.md)

## Verification

[Ticket 09](tickets/09-pie-donut-interaction.md#completion-evidence) records 645 passing tests,
repository/build/package checks, direct production operation, and passing independent intent and
engineering reviews after the two recorded corrections.

## Out of scope

Scatter with adjacent distribution charts, application layouts, implicit statistical calculations,
and any change to the accepted chart palette or existing reading semantics.

## Continuation

- Resume with `python3 /home/whitney-white/.codex/skills/work-system/scripts/navigate.py resume novel-work planning`.
- Branch: `main`; marker fixes follow `56bf6f5`.
- Production showcase: `http://localhost:5174`.
- Accepted radar study: `http://localhost:5181`, Vite session `68691`.
- Next action: implement approved radar interaction. Zero values use keyboard or whole-dimension selection, without center-click targets. Keep any prototype revisions short, without tests or agent reviews.
