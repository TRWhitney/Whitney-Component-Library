# 03 Keep point markers complete at domain edges

**What to build:** Render complete point shapes and selection outlines at the full-data domain boundaries, including the scatter/bubble overview.

**Blocked by:** none.

**Status:** complete

## Evidence

Whitney's supplied screenshot shows clipped circles, diamonds, and selection outlines at the left, top, and bottom/right edges of the scatter overview despite a maximized view. This is separate from the hidden-table overflow in Ticket 01.

`StatisticalPointOverview` places normalized x = 0 and x = 1 directly at the SVG edges, and does the same for y. It draws point shapes and selection cues around those centers without reserving space for their radius. Making the overall chart larger does not remove the clipping.

The client can pad ordinary chart domains through the public scale API. Energy desk pads the full domains and enables native exploration and overview. The padding makes its full-range points fit. This client adjustment does not correct the library-owned geometry for consumers using unpadded or automatic domains.

- [x] Full-domain boundary observations render complete shapes and selection outlines in scatter and bubble overviews.
- [x] Review ordinary point-chart automatic bounds for the same problem; do not require every client to calculate visual padding merely to show complete marks.
- [x] Padding preserves recorded values, numeric ranges, honest bubble sizes, and domain interpretation.
- [x] Overview window position, resizing, dragging, and reset remain consistent with the displayed data bounds.
- [x] Verify boundary points and selected boundary points in wide and compact views, including a one-point or constant-domain dataset.
- [x] Update the component showcase with boundary-point examples in the same library change.

## Accepted sources

- [Approved library fix specification](../spec.md).

- Whitney's screenshot and description of clipped points in the maximized overview.
- [Prototype design](../design.md).
- [Point overview implementation](../../../src/charts/statistical-chart.tsx).
- [Rectangular navigation](../../../src/charts/chart-rectangular-exploration-controls.tsx).

## Completion evidence

Point geometry moves full-domain endpoint marks and ticks inward together, keeping complete shapes and selection cues inside the plot axes. Cropped window sides retain their exact clipping boundary. Tight plots scale all point sizes together, preserving bubble area ratios. Reserved space uses the declared series shapes so hiding a series does not jump the animated axis positions. Touch gestures retain their starting projection bounds throughout the gesture. Overview viewBox padding covers all six shapes and selection cues without changing recorded values or relative bubble sizes. Its window, corners, and pointer coordinates use the same inset data rectangle.

Focused coverage checks main boundary marks, selected scatter and bubble overview markers, all six selected shapes, a constant-domain dataset, cropped-edge clipping, overview window alignment, and pointer dragging after padding. Existing point exploration, rectangular controls, distribution exploration, statistical visibility, geometry, and motion checks pass. The geometry showcase now uses explicit boundary domains and an operable overview. Contracts, rendered application checks, and showcase wiring are complete. Rework coverage adds short and narrow full-extent plots, tick alignment, stable touch panning, and unchanged visibility animation.

## Final verification

Completed in the packed Energy desk application and rendered component showcase. See the [shared verification record](../verification.md) for browser checks, repository checks, package compatibility, and the acceptance mapping.
