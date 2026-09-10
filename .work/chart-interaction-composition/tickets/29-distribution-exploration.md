# 29 Explore histogram intervals and box groups

**What to build:** Deliver the accepted distribution navigation with fixed-height horizontal strips opened through the shared Overview IconButton and Dialog.

**Blocked by:** None. Shared navigation is implemented.

**Status:** completed

- [x] Prepare bins and summaries from the full source before navigation. Preserve raw-source membership, boundaries, counts, last-bin inclusivity, whiskers, supplied statistics and stable outlier IDs.
- [x] Histogram windows contain complete intervals. Box windows use stable group identities in declared order; both retain complete structured data and selection outside the window.
- [x] Box group eyes and overview use one visibility state. Hidden groups close gaps, retain restoration access and do not change identity when windows move.
- [x] Match the approved strip controls, Box touched selection, inner outlines, two-finger gestures and independent activation. Keep chart dimensions fixed during navigation.
- [x] Update showcase/contracts, public type examples and relevant component/native/package checks; compare accepted compact/wide appearances and complete independent reviews.

- [x] Overview movement and resizing follow pointer dragging immediately; retain keyboard/reset animation, reduced motion, range changes on dismissal and focus return to the icon.

## Accepted sources

- [Modal overview access](../prototypes/modal-overview.md#accepted-behavior), superseding earlier disclosure and expansion controls.

- [Production exploration boundary](../spec.md#production-exploration-boundary)
- [Line contract](../prototypes/domain-exploration.md#accepted-pan-and-zoom-contract)
- [Horizontal group](../prototypes/chart-exploration-comparison.md#accepted-behavior)
- [Scatter/bubble](../prototypes/point-exploration.md#accepted-behavior)
- [Remaining families](../prototypes/remaining-exploration.md#accepted-behavior)

## Completion evidence

Histograms keep original bins, counts and source activation data. Caller windows snap outward to whole bins, unequal-width bins remain proportional in the strip, and panning moves complete bins. Zoom in disables on one complete bin. Box plots use stable ordered group IDs and complete summaries/outliers. Source IDs remain available to formatters when all groups are hidden. Native 390px strip dragging, focus return, zoom and box hide/restore passed with unchanged 308 by 180 canvases.

`npm run check` passes 841 tests, formatting, both linters, public types, generated guides, TypeScript 5/6/7 declarations and chart bundle isolation. `npm run verify:package` passes React 18.3.1 and 19.2.8 SSR, hydration, public types and browser builds. The production showcase build passes. Dark/light, 390px/1280px and reduced-motion states were operated and inspected. The grouped production examples and canonical contracts/generated guides are current.

Independent intent and engineering reviews pass after bounded correction reviews. The complete production review admitted four defects, now corrected: controlled box windows survive hidden endpoints, point marks clip at plot boundaries, histograms preserve explicit axis bounds, and bars/distributions/heatmaps use the approved two-track Shift step. The corrected public regressions pass, including zooming away empty explicit histogram margins. Native point hide/restore and two-track keyboard flows pass.

The explicit-margin correction also preserves the configured minimum span after snapping to complete bins. A public regression reproduces the former 20% window under a 50% minimum and passes with the correction.
