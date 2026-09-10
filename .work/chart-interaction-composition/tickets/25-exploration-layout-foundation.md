# 25 Keep chart geometry and visibility labels usable

**What to build:** Deliver the compact geometry prerequisites discovered in the approved exploration studies without shipping prototype adapters.

**Blocked by:** None

**Status:** complete

- [x] Horizontal bars reserve readable category spacing at narrow widths. Compute plot bounds, SVG viewport, axis titles and pointer conversion from the same geometry; retain the existing footprint when extra height is not needed.
- [x] Later exploration derives chart dimensions from the full source model, never the visible-window count. This ticket establishes the geometry needed for that integration.
- [x] Heatmap label sizing reserves the restore eye and hidden-count width before hiding, so Room remains readable and hiding does not force the label to collapse.
- [x] Preserve selection, activation, legend focus and current table behavior. Clicking a lower bar after geometry growth activates that actual bar.
- [x] Update showcase and generated contracts. Cover narrow geometry and restore-label sizing through meaningful public regressions and native operation; run required production checks and independent reviews.

## Accepted sources

- [Production exploration boundary](../spec.md#production-exploration-boundary)
- [Line contract](../prototypes/domain-exploration.md#accepted-pan-and-zoom-contract)
- [Horizontal group](../prototypes/chart-exploration-comparison.md#accepted-behavior)
- [Scatter/bubble](../prototypes/point-exploration.md#accepted-behavior)
- [Remaining families](../prototypes/remaining-exploration.md#accepted-behavior)

## Completion evidence

Focused regressions passed after reproducing 10.79px categorical steps, an 80px heatmap corner, visibility-driven viewport height changes, and overlapping axis titles. The corrected public examples show about 20px category steps and unchanged plot dimensions when Supply is hidden. Clicking Station 10 opens its own value in both compact and wider containers. Light and dark browser screenshots were inspected. Room and its restore count fit after hiding a row. `npm run check` passed all 761 tests, formatting, both linters, generated-document checks, TypeScript 5/6/7 consumer declarations and chart isolation. `npm run verify:package` passed React 18.3.1 and 19.2.8 SSR, hydration, types and browser builds. `npm run showcase:build` passed. The retained remaining-domain prototype builds using production sizing with only its full-fixture count adapter.

The full-page accent test initially exceeded its 5s timeout. Scoping its queries to the actual controls area preserved its assertions and removed the expensive unrelated page search. Its focused suite and the complete repository rerun passed.

Generated BarChart and Heatmap guides and the rendered showcase are current. Initial independent intent review passed. Engineering review found that additional category spacing overrode a taller requested aspect ratio. The correction preserves the taller canvas. Its public regression failed before the fix and passed afterward; native operation measured the requested 320 by 640px SVG and activated Station 10 correctly. Full repository, package and showcase checks passed again. Independent correction review passed with no remaining findings. Both review axes pass. Heatmap spacing is delivered in `7a2fe96`; the horizontal geometry fix and current accepted work record are delivered together in the following commit.
