# Chart interaction and composition

## Destination

Deliver the remaining behavior in [Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md).

## Current state

The modal overview design is approved. Production pan and zoom covers LineChart, the remaining
Cartesian charts, scatter/bubble, histogram/box plot and heatmap. Ticket 26 is delivered in
`50c19c2`; tickets 27–30 are delivered with updated public examples, contracts and generated guides.
All 841 tests, repository checks, packed React 18/19 verification and native browser checks pass.
Independent intent and engineering reviews pass after bounded correction reviews.

## Progress

- [Ticket 26](tickets/26-line-exploration.md) delivers LineChart navigation.
- [Ticket 27](tickets/27-cartesian-exploration.md) covers area, columns, horizontal bars and mixed charts.
- [Ticket 28](tickets/28-point-exploration.md) covers scatter and bubble.
- [Ticket 29](tickets/29-distribution-exploration.md) covers histogram and box plot.
- [Ticket 30](tickets/30-heatmap-exploration.md) covers heatmap rows and columns.
- Visibility, activation and selection are delivered across the planned families. Completed tickets
  and the specification retain their accepted behavior and verification records.
- Tickets 22–25 deliver compact axis-label fitting, visible titles, readable radar labels and
  exploration layout prerequisites.

## Frontier

The [decision map](map.md) indexes the remaining work. Scatter plus line, line plus changing range
band, general data-change animation and responsiveness budgets remain separate parent-ticket work.

## Accepted sources

- [Reconciled Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md)
- [Specification](spec.md#production-exploration-boundary)
- [Modal overview](prototypes/modal-overview.md#accepted-behavior)
- [Line pan and zoom](prototypes/domain-exploration.md#accepted-pan-and-zoom-contract)
- [Remaining Cartesian charts](prototypes/chart-exploration-comparison.md#accepted-behavior)
- [Scatter and bubble](prototypes/point-exploration.md#accepted-behavior)
- [Distribution, category and heatmap navigation](prototypes/remaining-exploration.md#accepted-behavior)

## Verification

Tickets 27–30 record the integrated repository, public consumer, package and native browser evidence.
Compact and wide layouts, light/dark appearance, reduced motion, full-data preservation, visibility,
selection, callbacks and touch arbitration were checked. The complete production review and bounded
correction reviews remain distinct from prototype work, which used no agents or production tests.

## Out of scope

Scatter with adjacent distributions, application layouts, implicit statistical calculations and
changes to the accepted palette or reading semantics.

## Continuation

- Resume with `python3 /home/whitney-white/.codex/skills/work-system/scripts/navigate.py resume novel-work planning`.
- Branch: `main`. Cartesian navigation is `1d9aac6`, scatter/bubble is `4af6ede`, and
  histogram/box plot is `baa6a23`. Heatmap navigation is delivered in the commit containing this record.
- Accepted prototypes remain isolated at the same preview host under `/domain-exploration/`,
  `/chart-exploration-comparison/`, `/point-exploration/`, `/remaining-exploration/` and their linked records.
- No further pan/zoom design decision is pending. After delivery, resume the remaining parent work
  at planning because the additional compositions need detailed public boundaries.
