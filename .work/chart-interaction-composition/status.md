# Chart interaction and composition

## Destination

Deliver the remaining behavior in [Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md).

## Current state

Whitney accepted the first working example and its
[contract](prototypes/legend-visibility.md#accepted-contract). The
[first production ticket](tickets/01-cartesian-visibility.md) covers the five Cartesian charts.
The first portion is complete, with passing validation and independent intent and engineering
reviews. Other portions of
the parent ticket remain active future work.

## Progress

- The reconciled scope is accepted in `e899b8e`.
- Production eye controls and automatic animated visible-data scales are implemented in all five
  Cartesian charts. Public contracts, generated guides, and showcase examples are current.
- Production Cartesian reading, emphasis, and responsive behavior are reused in the isolated
  [legend visibility example](prototypes/legend-visibility.md).

## Frontier

Continue planning the remaining chart
families and selection/exploration behavior against the parent ticket.

## Accepted sources

- [Reconciled Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md)
- [Chart scope](../library-foundation/decisions/13-charting-scope.md#ticket-22-reconciliation)
- [Existing Cartesian interaction](../chart-interactivity/spec.md)

## Verification

Current production checks, test-first evidence, direct browser observations, and documentation
impact are recorded in the [first ticket](tickets/01-cartesian-visibility.md#completion-evidence).
Prototype evidence remains in the [accepted example](prototypes/legend-visibility.md).

## Out of scope

Scatter with adjacent distribution charts, application layouts, implicit statistical calculations,
and any change to the accepted chart palette or existing reading semantics.

## Continuation

- Resume with `python3 /home/whitney-white/.codex/skills/work-system/scripts/navigate.py resume novel-work implementation`.
- Branch: `main`; base: `e899b8e`.
- Live example: `http://localhost:5173`; Vite process session `13071` serves the isolated prototype.
- First delivered outcome: `[Feature] Add chart series visibility`.
- Production showcase: `http://localhost:5174`.
- Next action: continue planning the remaining portions. The next interface decision is how
  category/point activation and optional selection coexist with readings. The parent ticket is
  not complete.
