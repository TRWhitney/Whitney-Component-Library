# 27 Explore remaining Cartesian charts

**What to build:** Extend the delivered navigation to area, grouped/stacked/normalized columns, horizontal bars and mixed line/area/column charts.

**Blocked by:** None. [26](26-line-exploration.md) is completed.

**Status:** completed

- [x] Preserve the approved combined monthly behavior and production live selection marks in all listed chart types.
- [x] Categorical windows use stable ordered values and complete bands. Keep stacked totals, normalization and automatic scales faithful to visible series.
- [x] Horizontal bars use the approved fixed-height horizontal overview transposed to vertical categories. Navigating or opening the overview dialog cannot resize the main chart.
- [x] Use full-source identity, visibility and table models; preserve category underline locations, boundary contours, crossing geometry and hidden selections.
- [x] Update every affected showcase example and public contract. Include native narrow/wide, hidden/all-hidden, callback coordination, input arbitration, accessibility, type and package verification plus independent reviews.

- [x] Overview movement and resizing follow pointer dragging immediately; retain keyboard/reset animation, reduced motion, range changes on dismissal and focus return to the icon.

## Accepted sources

- [Modal overview access](../prototypes/modal-overview.md#accepted-behavior), superseding earlier disclosure and expansion controls.

- [Production exploration boundary](../spec.md#production-exploration-boundary)
- [Line contract](../prototypes/domain-exploration.md#accepted-pan-and-zoom-contract)
- [Horizontal group](../prototypes/chart-exploration-comparison.md#accepted-behavior)
- [Scatter/bubble](../prototypes/point-exploration.md#accepted-behavior)
- [Remaining families](../prototypes/remaining-exploration.md#accepted-behavior)

## Completion evidence

Area, grouped/stacked/normalized columns, horizontal bars and mixed charts use their own full-source geometry in the horizontal modal strip. Numeric columns crossing a window boundary contribute to fitting and remain targetable. Stable source identities, category underlines, live selection preview, visibility and full tables remain intact. Native 390px navigation, modal dragging, keyboard movement, focus return and all-hidden recovery passed for every variant. The main canvas stayed 308 by 180 CSS pixels for vertical variants and 308 by 531.67 for horizontal bars.

`npm run check` passes 841 tests, formatting, both linters, public types, generated guides, TypeScript 5/6/7 declarations and chart bundle isolation. `npm run verify:package` passes React 18.3.1 and 19.2.8 SSR, hydration, public types and browser builds. The production showcase build passes. Dark/light, 390px/1280px and reduced-motion states were operated and inspected. The grouped production examples and canonical contracts/generated guides are current.

Independent intent and engineering reviews pass after bounded correction reviews. The complete production review admitted four defects, now corrected: controlled box windows survive hidden endpoints, point marks clip at plot boundaries, histograms preserve explicit axis bounds, and bars/distributions/heatmaps use the approved two-track Shift step. The corrected public regressions pass, including zooming away empty explicit histogram margins. Native point hide/restore and two-track keyboard flows pass.
