# 05 Bar and column activation and selection

**What to build:** Deliver the accepted Frame treatment and gestures through BarChart and ColumnChart.

**Blocked by:** none

**Status:** complete

- [x] Both components expose optional category or individual-item activation and selection with the
      existing stable row/series identities, controlled ownership, localized summaries, and callback
      payload convention. Preserve the public LineChart API and behavior.
- [x] Ordinary click/tap selects; modified click/keyboard activation and touch hold activate without
      selection changes. Category traversal follows orientation; the other arrows traverse series.
- [x] Reading and activation resolve the nearest visible category then the nearest actual bar rectangle.
      Grouped, stacked, normalized, negative, and zero values preserve exact source payloads. Data and
      visibility changes cancel active gestures; hidden selections remain identified and restorable.
- [x] Persistent item selection uses Frame. Frames meet on shared edges; inner reading cues remain
      visible. Category reading/activation follows the combined silhouette without internal seams.
      Category selection underlines its label in either orientation. No circular point cues or
      whole-chart focus outline are added to interactive bars.
- [x] Dragging selects the bar rectangles it touches or an inclusive category range. Shift/Control/
      Command adds, Alt removes, Escape and pointer cancellation restore the prior selection.
- [x] Selection and reading geometry respect explicit domains, visible-data scales, and reduced motion.
      Existing emphasis, visibility, complete tables, and other chart families remain accurate.
- [x] Public contracts, generated guides, and rendered examples demonstrate the delivered behavior.
      Focused integration/type checks and production browser inspection cover both orientations,
      grouped and stacked shapes, light/dark appearance, touch, and controlled coordination.

## Accepted sources

- [Bar prototype contract](../prototypes/bar-selection.md#accepted-contract)
- [Interaction specification](../spec.md)
- [Parent Ticket 22](../../library-foundation/tickets/22-chart-interaction-and-composition.md)

## Completion evidence

Implementation and validation are complete. This portion excludes AreaChart, mixed charts, and
other reading units. Thirteen focused public integration tests cover both orientations, raw activation,
category contours, intersecting drag/cancellation, keyboard/touch, shared frames, normalized values,
zero/negative grouped values, and controlled hidden selection/data replacement. Seven initial cases
failed for incorrect targeting and missing frame/contour/drag behavior before implementation.

`npm run check` passes with 607 tests in 36 files, formatting, both linters, repository types,
generated documentation, public TypeScript 5/6/7 consumers, and chart isolation. The showcase build
passes. `npm run verify:package` passes packed React 18.3.1 and 19.2.8 SSR, hydration, types, and
browser builds. The existing showcase bundle-size advisory remains.

Native Chromium operation selected adjacent bars and inspected their frame/inner-outline separation;
category contours were inspected for grouped columns and stacked horizontal bars in dark/light.
A horizontal drag selected January through March. A touch hold opened details while preserving
February's prior selection. Normalized readings showed the visible shares; callbacks retained raw
values. Reduced-motion activation had animationName none. A 480px viewport had no document overflow.
Compact and forced-color states retained distinguishable shapes. Canonical contracts, generated
BarChart/ColumnChart guides, public exports, and both rendered examples are updated.

Initial independent intent and engineering reviews identified the same zero-segment contour defect.
Two public regressions reproduced an internal seam for stacked values `[20, 0, 30]`, one in each
orientation. The correction omits zero-segment lines covered by a filled rectangle while preserving
standalone zero-value cues. Both regressions now pass for reading and activation. Repository checks,
showcase build, and package verification were renewed. Native Chromium inspection of the same
three-series data confirmed a single rectangular reading and activation perimeter in both
orientations. Independent intent and engineering correction reviews both pass with no findings. No agents or automated suites were used for prototype
iteration. The accepted source received formatting only for repository integration.
