# 06 Area and mixed-chart activation and selection

**What to build:** Deliver Value marker for areas and approved per-mark interactions in existing mixed charts.

**Blocked by:** none

**Status:** complete

- [x] AreaChart and CartesianChart expose optional shared activation/selection with stable identities,
      raw category/item payloads, controlled ownership, and accurate public exports and examples.
- [x] Area value markers follow plotted upper boundaries in overlap, stacked, and normalized layouts.
      Filled readings, selected rings, finite activation, and category underlines preserve the contract.
- [x] Mixed columns use frames and inset reading contours, lines/areas use markers and rings, and
      month previews include all visible series without assigning circular cues to bars.
- [x] Legend priority breaks overlap ties only. Exact sloping area boundaries determine which shapes
      are under the pointer; a sole blue region remains blue with red pinned. Hidden series cannot win.
- [x] Click/tap selection, modified activation, touch hold, marker/rectangle dragging, cancellation,
      keyboard navigation, hidden selection, and data replacement use the existing shared behavior.
- [x] Existing chart behavior and complete tables remain accurate. Geometry respects explicit domains,
      reduced motion, dark/light, and compact layouts. No whole-chart outline for these interactions.
- [x] Public integration regressions, repository/build/package checks, direct browser operation, docs,
      showcase examples, and independent production intent/engineering review cover the outcome.

## Accepted sources

- [Prototype contract](../prototypes/area-mixed-selection.md#accepted-contract)
- [Specification](../spec.md#area-and-existing-mixed-chart-production-boundary)
- [Parent Ticket 22](../../library-foundation/tickets/22-chart-interaction-and-composition.md)

## Completion evidence

Seven public integration tests cover overlap-only legend priority at sloping boundaries, stacked and
normalized marker positions with raw callbacks, distinct mixed bar/line selection cues, whole-month
reading and activation, and touch hold plus cancellation on data refresh. The first five cases
failed for the missing/incorrect behavior before implementation. The focused area/bar/line suites
pass with 41 cases.

`npm run check` passes all 614 tests in 37 files, formatting, both linters, repository types,
generated documentation, public TypeScript 5/6/7 examples, and chart isolation. `npm run build`,
`npm run showcase:build`, and `npm run verify:package` pass. Packed React 18.3.1 and 19.2.8 consumers
pass SSR, hydration, types, and browser builds. The existing bundle-size advisory remains.

Native Chromium operation on the rendered production examples confirmed red priority in overlap,
blue targeting in a blue-only region, then red on return. Inspected area selection and stacked
upper-boundary readings, mixed bar/line frames and rings, whole-month cues, and mixed column/area
reading in dark and light. Normalized tooltip values used visible shares. Month dragging selected
January through March. A native touch hold opened January's 42 MWh heating detail and preserved
February's prior selection. Hiding/restoring heating retained the named selection and restored its
ring. Reduced-motion activation reported animationName none. At 480px, document width stayed 480px.
Forced-color readings and selection remained visible. Screenshots were inspected alongside DOM
identity, selection summaries, and callback/detail results, then removed.

Public contracts, generated area/mixed guides, shared API references in bar/column guides, and
rendered examples are current. Initial independent intent and engineering reviews identified the same explicit-domain defect:
an area with its upper marker outside the domain lost targeting even while its fill remained visible.
A public regression reproduced blue=80/red=20 with domain [0,50], wrongly activating red at value 40.
The correction retains visible area hit eligibility independently of upper-marker visibility and
clips area/mixed marks and reading/selection/activation cues to the plot. The regression now passes.
Renewed repository/build/package checks pass. Native Chromium repeated the exact capped-domain case:
blue was read and selected with red pinned; upper-boundary cues stayed clipped. The stale continuation
record was also updated. Independent intent and engineering correction reviews both pass with no findings. No prototype agents or
automated prototype test suites were used; accepted source formatting was mechanical integration.
