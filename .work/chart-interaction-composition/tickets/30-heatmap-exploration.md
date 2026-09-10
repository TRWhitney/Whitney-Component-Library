# 30 Explore heatmap rows and columns

**What to build:** Deliver the approved grid navigation and rectangular overview with production hide/restore behavior.

**Blocked by:** None. Shared navigation is implemented.

**Status:** completed

- [x] Window complete ordered row/column identities; preserve missing cells, zero values, full-data color meaning and complete structured data.
- [x] Use one source visibility state for chart and overview. Hidden tracks close their gaps, remain restorable outside the window and preserve selection identity.
- [x] Match the proportional map opened directly from the Overview IconButton in the existing Dialog, native two-finger gestures, cell selection/hover/pulse and callback ownership. Do not introduce per-cell eyes.
- [x] Preserve Room and restore-count readability and compact label fitting. Opening an overview or changing its range cannot resize the main chart.
- [x] Update showcase and contracts; verify complete hide/restore/navigation combinations, callback coordination, empty/all-hidden states, focus, touch, reduced motion, SSR/hydration and package types with independent reviews.

- [x] Overview movement and resizing follow pointer dragging immediately; retain keyboard/reset animation, reduced motion, range changes on dismissal and focus return to the icon.

## Accepted sources

- [Modal overview access](../prototypes/modal-overview.md#accepted-behavior), superseding earlier disclosure and expansion controls.

- [Production exploration boundary](../spec.md#production-exploration-boundary)
- [Line contract](../prototypes/domain-exploration.md#accepted-pan-and-zoom-contract)
- [Horizontal group](../prototypes/chart-exploration-comparison.md#accepted-behavior)
- [Scatter/bubble](../prototypes/point-exploration.md#accepted-behavior)
- [Remaining families](../prototypes/remaining-exploration.md#accepted-behavior)

## Completion evidence

Heatmap windows use complete column IDs on x and row IDs on y. Full unhidden data controls color; navigation retains missing cells, zeros, source tables and selection. Hidden tracks close their gaps and remain restorable. Native 390px pinch, immediate map dragging, focus return and hide/restore passed with an unchanged 308 by 180 frame. Phone-width column labels stagger instead of collapsing into indistinguishable ellipses, including all twelve hours. Small cells keep rectangular corners. All-hidden ranges retain real source labels.

`npm run check` passes 841 tests, formatting, both linters, public types, generated guides, TypeScript 5/6/7 declarations and chart bundle isolation. `npm run verify:package` passes React 18.3.1 and 19.2.8 SSR, hydration, public types and browser builds. The production showcase build passes. Dark/light, 390px/1280px and reduced-motion states were operated and inspected. The grouped production examples and canonical contracts/generated guides are current.

Independent intent and engineering reviews pass after bounded correction reviews. The complete production review admitted four defects, now corrected: controlled box windows survive hidden endpoints, point marks clip at plot boundaries, histograms preserve explicit axis bounds, and bars/distributions/heatmaps use the approved two-track Shift step. The corrected public regressions pass, including zooming away empty explicit histogram margins. Native point hide/restore and two-track keyboard flows pass.
