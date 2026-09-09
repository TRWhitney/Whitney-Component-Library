# 09 Pie and donut selection and activation

**What to build:** Deliver the approved radial slice interaction, including expansion selection indication, through public PieChart and DonutChart and their live examples.

**Blocked by:** none

**Status:** complete

- [x] Outer-edge selection, inset reading outlines, pop-out emphasis and finite activation feedback match the accepted study across themes and compact sizes.
- [x] Click/tap selects; modified click/key or touch hold activates independently. A temporary dashed trail shows the sweep until release or cancellation. Sweep collects crossed ordinary slices, ignores the donut hole/aggregate, replaces by default, adds with Shift/Control/Command, removes with Alt, and restores selection on cancellation.
- [x] Keyboard reaches every visible ordinary slice and the expansion target. Expansion and Back preserve selection; +N* appears exactly when the remaining group contains selected IDs, with an equivalent localized accessible description.
- [x] Controlled and internal selection use stable category IDs. Paging hides marks without retiring selections; removed/invalid/zero-valued IDs become unavailable. Geometry, data, page or mode changes cancel pending gestures and feedback.
- [x] Category activation reports ID, original datum, label, raw value, total, total/page shares, and input method. Aggregate navigation emits no category callback and never selects aggregate IDs. Zero values remain table-only.
- [x] Existing noninteractive reading, paging, aggregate sizing, proportions, tables and legend pinning remain intact. Pointer reading takes precedence on the directly hovered slice.
- [x] Public types, canonical guides, generated examples and live showcase are updated; public regression seams, native operation, repository/package checks and independent production review pass.

## Accepted sources

- [Accepted pie/donut contract](../prototypes/radial-selection.md#accepted-contract)
- [Specification](../spec.md)
- [Parent Ticket 22](../../library-foundation/tickets/22-chart-interaction-and-composition.md)

## Production boundary

Reuse required idAccessor identities. PartToWholeSelectionItem identifies one category with id.
PartToWholeActivation carries item, datum, label, value, total, shareOfTotal, shareOnPage, and input.
Shares are raw fractions. Share on page uses the ordinary visible categories, matching existing
reading semantics. A configurable interaction has optional onActivate and generic ChartSelection
ownership/labels. Selection additionally supplies a localized containsSelection label for the
expansion indicator. The app may coordinate Pie/Donut using controlled selection. Zero values keep
their existing table-only meaning. No new selection/activation role is added to legend controls.

## Testing decisions

Test through the public components: gestures and real callback records, selected IDs across paging
and reorder/removal, aggregate exclusion and asterisk membership, control ownership, touch hold and
cancellation, unchanged-center geometry changes, and sweep gaps/hole behavior. Preserve native
noninteractive tests. Operate production charts with light/dark, compact and reduced motion.

## Completion evidence

The public seam covers selection and callbacks, paging and asterisk membership, sweep/hole
geometry, touch hold, controlled ownership, data retirement, modifier and cancellation behavior,
presentation changes, full-circle slices, summary growth during dragging, and trail lifecycle.
Missing interaction and navigation failed before implementation. The summary-growth regression and
missing-trail check also failed before their corrections. All 85 tests in the seven affected suites
pass after implementation.

Native Chromium operation confirmed pie and donut selection, +7* after selecting on a later page,
original-record details with independently checked shares, crossed-slice sweep, touch hold without
selection changes, and keyboard selection. Light, dark, compact, reduced-motion and forced-colors
states were inspected. A direct collaborative-browser click also selected Residential and displayed
its outer edge and reading, with the localized summary in the rendered hierarchy. The production
trail is visible during dragging and clears on release/cancellation. Root summary growth no longer
cancels dragging; actual SVG size or presentation changes still do.

`npm run build`, `npm run check`, `npm run showcase:build`, and `npm run verify:package` pass.
The complete suite has 645 passing tests across 40 files. Formatting, both linters, type checks,
generated guides, TypeScript 5/6/7 declarations, chart isolation, and packed React 18/19 SSR,
hydration and browser builds pass. The showcase build retains its existing bundle-size advisory.
Independent intent and engineering reviews both found the duplicate sweep in legend swatches and
activation-capability changes missing from gesture invalidation. Both findings were admitted.
The swatch copies were removed, and radial invalidation now includes activation availability while
allowing callback identity updates. Regression checks failed before correction, then 25 radial
and existing part-to-whole tests passed. Native operation reports one trail and shows it confined
to the plot. Renewed `npm run check`, showcase build, and packed React 18/19 verification pass. Independent intent and engineering correction reviews pass with no remaining findings. Both axes were read-only and independent of implementation.
Prototype acceptance is separate from production verification.
