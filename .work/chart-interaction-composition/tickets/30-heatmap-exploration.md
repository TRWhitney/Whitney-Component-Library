# 30 Explore heatmap rows and columns

**What to build:** Deliver the approved grid navigation and rectangular overview with production hide/restore behavior.

**Blocked by:** [28](28-point-exploration.md)

**Status:** blocked

- [ ] Window complete ordered row/column identities; preserve missing cells, zero values, full-data color meaning and complete structured data.
- [ ] Use one source visibility state for chart and overview. Hidden tracks close their gaps, remain restorable outside the window and preserve selection identity.
- [ ] Match the compact proportional map and expanded navigator, native two-finger gestures, cell selection/hover/pulse and callback ownership. Do not introduce per-cell eyes.
- [ ] Preserve Room and restore-count readability and compact label fitting. Opening an overview or changing its range cannot resize the main chart.
- [ ] Update showcase and contracts; verify complete hide/restore/navigation combinations, callback coordination, empty/all-hidden states, focus, touch, reduced motion, SSR/hydration and package types with independent reviews.

## Accepted sources

- [Production exploration boundary](../spec.md#production-exploration-boundary)
- [Line contract](../prototypes/domain-exploration.md#accepted-pan-and-zoom-contract)
- [Horizontal group](../prototypes/chart-exploration-comparison.md#accepted-behavior)
- [Scatter/bubble](../prototypes/point-exploration.md#accepted-behavior)
- [Remaining families](../prototypes/remaining-exploration.md#accepted-behavior)

## Completion evidence

Pending.
