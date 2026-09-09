# 07 Scatter and bubble activation and selection

**What to build:** Deliver the approved Centers inside observation interaction and separate showcase radio rows.

**Blocked by:** none

**Status:** complete

- [x] Public ScatterChart/BubbleChart support optional activation and shared selection ownership with existing IDs and raw observation callbacks.
- [x] Centers inside dragging starts in empty plot space, supports replacement/add/remove and cancellation, and ignores bubble edges outside the box.
- [x] Shape-aware reading, selected outlines, and finite activation preserve all symbols and bubble magnitude; legend priority only breaks actual overlap ties.
- [x] Click, modified click, keyboard, and touch hold separate selection from activation; coincident observations remain reachable and escapable.
- [x] Geometry/data changes cancel pending gestures; explicit domains, light/dark, compact, reduced-motion and complete tables remain accurate.
- [x] Public guides and live examples explain behavior, and segmented radio controls occupy their own rows in the showcase.
- [x] Public regressions, repository/build/package checks, direct browser operation, and independent production intent/engineering reviews cover the outcome.

## Accepted sources

- [Specification](../spec.md#scatter-and-bubble-production-boundary)
- [Accepted prototype contract](../prototypes/scatter-bubble-selection.md#accepted-contract)
- [Parent Ticket 22](../../library-foundation/tickets/22-chart-interaction-and-composition.md)

## Completion evidence

Eight public integration tests cover raw bubble callbacks and independent selection, Centers inside
rectangle membership from empty space, actual-overlap legend priority, coincident keyboard traversal,
touch hold and data replacement cancellation, controlled selection/reordering and cancelled/Alt drags,
and all six selected symbols with a cross-shape miss. The initial five failed for the missing
behavior before implementation. All 63 focused and affected interaction/statistical tests pass.

`npm run check` passes 622 tests in 38 files, formatting, both linters, repository types, generated
docs, public TypeScript 5/6/7 examples, and chart isolation. `npm run build`, `npm run showcase:build`,
and `npm run verify:package` pass. Packed React 18.3.1 and 19.2.8 consumers pass SSR, hydration,
types, and browser builds. A generated example's trailing whitespace was removed afterward;
regeneration and the public example compiler matrix pass again. The existing bundle advisory remains.

Native Chromium operation selected South Wednesday with South pinned at its overlap with North
Tuesday, then read North Monday in a North-only mark. Modified activation opened North Monday's
source details and retained South Wednesday. Home/Right/Enter selected South Monday. Touch hold
opened North Monday's 42 MWh stored-energy detail while keeping South Monday selected. A drag
through West Tuesday's bubble edge selected nothing; extending through its center selected it.
Inspected circle, diamond and triangle cues in dark/light, reduced-motion acknowledgment with
animationName none, and forced-color cues. At 480px document width remains 480px. Inspected separate
ColumnChart layout/target radio rows with switches below. Screenshots and DOM selection/detail
identity were inspected together; temporary screenshots are removed after inspection.

Initial independent intent and engineering reviews identified an activation transform overriding
the diamond rotation. Engineering also found that the overlay clip included the base data marks,
cutting bubbles at domain boundaries and changing apparent magnitude. Both are admitted blockers.
The correction animates a containing group and clips only the cue overlay. A new boundary regression
failed before the fix and passes afterward. Native Chromium reproduced the upright square pulse
before correction and then inspected a diamond pulse whose own rotation matrix stays at 45 degrees
while its parent animates. Reduced motion retains that rotation with animationName none. A native
production fixture inspected a full circular bubble centered at the [0,0] explicit-domain corner;
the data mark has no clipped ancestor. The fixture and screenshots were removed. Renewed full
repository checks pass 622 tests, and renewed showcase/package checks pass for the correction.
Independent intent and engineering correction reviews both pass with no remaining findings. Prototype acceptance and source formatting remain separate;
no prototype agents or automated prototype suites were used.
