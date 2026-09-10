# 18 Hide and restore pie and donut categories

**What to build:** Individual legend eyes with animated visible shares and visible donut totals.

**Blocked by:** none

**Status:** complete

- [x] Hiding 50 from values 50/30/20 leaves visible shares 60%/40% and donut total 50. Readings/callbacks/table shares use exact visible data.
- [x] Individual eyes retain stable pages, legend positions, colors and patterns. Hidden items restore in place; expansion has no eye and remains reachable when its slice disappears.
- [x] Hidden selections and expansion asterisks persist; hidden slices cannot be read, activated, swept or reached by keyboard. Data/visibility/geometry changes cancel gestures.
- [x] Interruptible 240ms slice-boundary animation and reduced-motion settlement preserve valid geometry; full-source validation and zero handling remain intact.
- [x] Empty-page recovery retains legend, paging, full table and selection, and Show all restores first-eye focus.
- [x] Public types, contracts, guides and both rendered examples agree; focused and repository checks, native browser flows and independent production reviews pass.

## Accepted sources

- [Visible totals and individual eyes](../spec.md#pie-and-donut-visibility-accepted-totals)
- [Approved radial interaction](../prototypes/radial-selection.md)
- [Approved legend eyes](../prototypes/legend-visibility.md#accepted-contract)

## Completion evidence

- Test-first visibility boundary failed for missing eyes, then passed. A separate navigation regression failed when the expansion legend pinned instead of paging; it now passes. Focused suites pass 26 tests, including exact visible shares, hidden selection, stable pages/IDs/colors, absent aggregate navigation, smallest aggregate sizing, interrupted animation, reduced motion, invalid/zero data, and cancelled touch holds.
- `npm run check` passes formatting, code/style lint, type checking, 734 tests in 46 files, generated documentation, TypeScript 5/6/7 public declarations, and chart-bundle isolation.
- `npm run verify:package` passes packed SSR, hydration, types, and browser builds with React 18.3.1 and 19.2.8.
- Native browser flows at 1100px and 390px operated both charts: select, pin, hide, keep hidden selection, hide every page, navigate without an expansion slice, restore all, focus the first eye, and retain the full table. Inspected desktop dark and phone dark/light screenshots show individual eyes aligned within rows, stable category colors, outer selection arcs, and no page overflow.
- Public props/types, shared contracts, generated PieChart/DonutChart guides, and both rendered examples describe visible totals, retained raw data, paging, and individual eyes.
- Independent intent and engineering reviews passed with no findings. Both reviewed the complete change relative to `d259e79` read-only, using existing evidence without rerunning checks.
- Native touch taps hid and restored categories, changed the donut total from 188 to 145 when hiding 43, navigated pages, and restored all categories with first-eye focus. Inspected hidden-category, empty-page, and forced-color screenshots; controls remain reachable and content does not clip. Screenshots were removed after inspection.
- Repeated both chart flows at desktop and phone sizes. All passed. Final documentation formatting, generated-documentation check and type check passed after copy updates.

## Design completion

Reuses the approved open/closed eye, outer selection edge, and expansion navigation. Existing figure and monospace chart typography and chart palette remain; no new visual role or color is introduced. Phone legends use two columns with room for 32px eyes. Slice boundaries animate for 240ms; reduced motion settles directly. The visible example explains what hiding changes and retains all raw records in the table.

Ticket 19 supersedes the fixed-page portion of this delivery with [automatic refill from expansion](19-radial-page-refill.md). Its other visibility behavior remains accepted.
