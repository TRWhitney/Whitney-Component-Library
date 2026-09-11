# 41 Verify chart responsiveness

**What to build:** Reproducible production measurements for the remaining chart responsiveness acceptance check, with corrections for measured failures.

**Blocked by:** None. Tickets 34–40 are delivered.

**Status:** complete

- [x] Measure every renderer with deterministic representative datasets at desktop and constrained narrow widths.
- [x] Confirm reading, selection, supported visibility/exploration and animation operations actually change visible state.
- [x] Record the measured timings and obtain acceptance of the performance boundary. Whitney accepted the results and closure.
- [x] Record reproducible commands, workloads, environment limits and results.
- [x] Reconcile and close the parent ticket against its approved boundaries.

## Accepted sources

- [Responsiveness boundary](../spec.md#responsiveness-verification-boundary)
- [Parent acceptance checks](../../library-foundation/tickets/22-chart-interaction-and-composition.md#acceptance-checks)

## Completion evidence

[Aggregated measurements](../research/chart-responsiveness.md) record 24 cases, with 12 repetitions per supported operation. Every desktop case passes; constrained dense line, scatter, bubble and heatmap cases still have failures. The report retains aggregated results and the reproduction method. Raw measurement files are disposable and are not committed. A Cartesian cache rerun covers the affected families and records its remaining failures.

The fixture and runner use public production charts. The implementation retains formatter/source/table caching and deferred overview rendering. Whitney accepted the measured timings and signed off on closing this ticket and the parent issue. The original target misses remain in the report; they are not outstanding defects for this delivery.

## Unconfirmed experiment

The proposed next experiment was one canvas behind the heatmap's existing DOM cells to paint numeric backgrounds together and avoid repeated per-cell style recalculation. Its visual parity, fallbacks and performance were unconfirmed. Work stopped before adoption. The delivered heatmap keeps its existing CSS rendering. Whitney signed off on closing the issue with that experiment unconfirmed; no additional optimization or initial-load study remains in scope.
