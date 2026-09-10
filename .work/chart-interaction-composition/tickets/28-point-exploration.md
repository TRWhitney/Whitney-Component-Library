# 28 Explore scatter and bubble domains

**What to build:** Deliver approved two-axis point navigation with a proportional overview opened directly from the chart icon in the existing Dialog.

**Blocked by:** None. Shared navigation is implemented.

**Status:** completed

- [x] Use a typed rectangular numeric window, scale-space bounds and the shared controlled/internal callback conventions. Both supported numeric scale types retain their interpretation.
- [x] Match the accepted proportional map, direct corner resizing and quiet Overview IconButton opening the existing Dialog with plain ranges, Reset view and Done. Closing retains adjustments.
- [x] Keep global magnitude meaning and stable point IDs; clip marks and hit targets correctly at viewport edges, including empty windows.
- [x] Synchronize visibility, complete tables and selection with full source data. Preserve Centers inside selection and two-finger exploration without stale or duplicate activation.
- [x] Update both showcase examples/contracts and verify controlled coordination, compact/wide themes, gesture cancellation, data updates, SSR/hydration, package types and independent reviews.

- [x] Overview movement and resizing follow pointer dragging immediately; retain keyboard/reset animation, reduced motion, range changes on dismissal and focus return to the icon.

## Accepted sources

- [Modal overview access](../prototypes/modal-overview.md#accepted-behavior), superseding earlier disclosure and expansion controls.

- [Production exploration boundary](../spec.md#production-exploration-boundary)
- [Line contract](../prototypes/domain-exploration.md#accepted-pan-and-zoom-contract)
- [Horizontal group](../prototypes/chart-exploration-comparison.md#accepted-behavior)
- [Scatter/bubble](../prototypes/point-exploration.md#accepted-behavior)
- [Remaining families](../prototypes/remaining-exploration.md#accepted-behavior)

## Completion evidence

Scatter and bubble use numeric rectangles with proportional modal maps, complete source tables and retained outside-window selections. Keyboard targets stay inside the window. Bubble magnitude uses all unhidden source observations before viewport filtering, preserving existing visibility behavior. Native 390px map dragging reported zero transition duration; pinch changed both axes without selecting, and canvases stayed 308 by 180 CSS pixels. Logarithmic axes, controlled/internal ownership, invalid rectangles and source replacement cancellation pass public tests.

`npm run check` passes 841 tests, formatting, both linters, public types, generated guides, TypeScript 5/6/7 declarations and chart bundle isolation. `npm run verify:package` passes React 18.3.1 and 19.2.8 SSR, hydration, public types and browser builds. The production showcase build passes. Dark/light, 390px/1280px and reduced-motion states were operated and inspected. The grouped production examples and canonical contracts/generated guides are current.

Independent intent and engineering reviews pass after bounded correction reviews. The complete production review admitted four defects, now corrected: controlled box windows survive hidden endpoints, point marks clip at plot boundaries, histograms preserve explicit axis bounds, and bars/distributions/heatmaps use the approved two-track Shift step. The corrected public regressions pass, including zooming away empty explicit histogram margins. Native point hide/restore and two-track keyboard flows pass.
