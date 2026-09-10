# 28 Explore scatter and bubble domains

**What to build:** Deliver approved two-axis point navigation with a proportional overview opened directly from the chart icon in the existing Dialog.

**Blocked by:** [26](26-line-exploration.md)

**Status:** blocked

- [ ] Use a typed rectangular numeric window, scale-space bounds and the shared controlled/internal callback conventions. Both supported numeric scale types retain their interpretation.
- [ ] Match the accepted proportional map, direct corner resizing and quiet Overview IconButton opening the existing Dialog with plain ranges, Reset view and Done. Closing retains adjustments.
- [ ] Keep global magnitude meaning and stable point IDs; clip marks and hit targets correctly at viewport edges, including empty windows.
- [ ] Synchronize visibility, complete tables and selection with full source data. Preserve Centers inside selection and two-finger exploration without stale or duplicate activation.
- [ ] Update both showcase examples/contracts and verify controlled coordination, compact/wide themes, gesture cancellation, data updates, SSR/hydration, package types and independent reviews.

- [ ] Overview movement and resizing follow pointer dragging immediately; retain keyboard/reset animation, reduced motion, range changes on dismissal and focus return to the icon.

## Accepted sources

- [Modal overview access](../prototypes/modal-overview.md#accepted-behavior), superseding earlier disclosure and expansion controls.

- [Production exploration boundary](../spec.md#production-exploration-boundary)
- [Line contract](../prototypes/domain-exploration.md#accepted-pan-and-zoom-contract)
- [Horizontal group](../prototypes/chart-exploration-comparison.md#accepted-behavior)
- [Scatter/bubble](../prototypes/point-exploration.md#accepted-behavior)
- [Remaining families](../prototypes/remaining-exploration.md#accepted-behavior)

## Completion evidence

Pending.
