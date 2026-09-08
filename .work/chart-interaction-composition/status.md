# Chart interaction and composition

## Destination

Deliver the remaining behavior in [Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md).

## Current state

The LineChart activation and selection portion is complete. Its independent production reviews
and validation pass. Parent Ticket 22 remains active; planning the next portion is the continuation.

## Progress

- Reconciled scope accepted in `e899b8e`.
- Cartesian eye controls and automatic animated visible-data scales delivered in `a3ea65b`,
  documented in [ticket 01](tickets/01-cartesian-visibility.md).
- Pointer focus no longer starts or restores a January keyboard reading (`162c5aa`), documented in
  [ticket 02](tickets/02-pointer-reading-focus.md).
- LineChart delivers the approved activation, selection, dragging, indicators, and touch hold
  behavior through its public API, documented in [ticket 03](tickets/03-line-chart-activation-selection.md).
  Public contracts, generated guides, and the rendered showcase are current.

## Frontier

Plan the next chart-family portion using the accepted LineChart convention. Other Cartesian,
statistical, radial, and compact chart interaction, exploration, general data animation,
responsiveness budgets, and the added mixed geometries remain in Ticket 22.
The approved styles, mouse/keyboard gestures, and touch hold behavior are settled.

## Accepted sources

- [Reconciled Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md)
- [Specification](spec.md)
- [Approved activation and selection contract](prototypes/activation-selection.md#accepted-convention)
- [Chart scope](../library-foundation/decisions/13-charting-scope.md#ticket-22-reconciliation)
- [Existing Cartesian interaction](../chart-interactivity/spec.md)

## Verification

[Ticket 03](tickets/03-line-chart-activation-selection.md#completion-evidence) records the current
591 passing tests, full repository and package checks, native browser observations, and independent
intent and engineering review results. Both review corrections passed focused correction review.
Prototype approval is separate from production verification.

## Out of scope

Scatter with adjacent distribution charts, application layouts, implicit statistical calculations,
and any change to the accepted chart palette or existing reading semantics.

## Continuation

- Resume with `python3 /home/whitney-white/.codex/skills/work-system/scripts/navigate.py resume novel-work planning`.
- Branch: `main`. The completed focus fix and LineChart capability are separate local commits.
- Production showcase: `http://localhost:5174/#line-chart`, Vite session `7315`.
- Accepted isolated prototype: `http://localhost:5175`, Vite session `28120`.
- Next action: plan the next bounded portion of parent Ticket 22; apply the accepted convention
  to the remaining Cartesian chart components before extending it to other reading units.
- No subagents or automated suites for prototype iteration; production work follows its own checks.
