# 19 Fill freed pie and donut slots

**What to build:** Pull the next ranked visible category from expansion when hiding frees room.

**Blocked by:** none

**Status:** complete

- [x] Hiding pulls forward the next visible category; the expansion count shrinks and disappears when all visible categories fit. Both aggregate sizing modes work.
- [x] Restoring returns categories to ranked order, pushing overflow back. Hidden legend entries remain restorable, with bounded scrolling and stable category colors/patterns/selections.
- [x] Later pages remain usable through hiding and restoration; a collapsed page settles to an available page. Expansion asterisks, exact visible totals and callback page shares follow the new membership.
- [x] Existing animation, touch, keyboard, full table and zero/invalid handling remain correct. Public docs and both rendered examples explain the changed behavior.
- [x] Focused/full checks, rendered desktop/mobile flows, and independent production reviews pass.

## Accepted sources

- [Visibility and page refill](../spec.md#pie-and-donut-visibility-accepted-totals)
- [Approved radial interaction](../prototypes/radial-selection.md)
- [Approved eyes](../prototypes/legend-visibility.md#accepted-contract)

## Design plan

Use existing chart accent, categorical palette, chart reading ink, muted ink and background tokens. Keep figure title/body typography and monospace chart labels. The chart retains its current plot and ranked legend; closed eyes remain visible while new categories join it. Cap the compact legend's allocated rows and scroll additional entries. The existing 240ms boundary animation explains categories entering and returning to expansion; reduced motion settles directly. Preserve the distinctive +N navigation slice and outer selection arcs. No new controls or prototype are needed for this behavior change.

## Completion evidence

- Updated public-component regressions first failed five refill/page assertions against the fixed-page implementation. The final focused chart and showcase suites pass 45 tests. Separate regressions reproduced lost keyboard focus when restoration removes an eye, and non-finite expansion-label coordinates at the start of restoration; both now pass.
- `npm run check` passes formatting, code/style lint, type checking, all 740 tests in 46 files, generated documentation, TypeScript 5/6/7 declarations and bundle isolation. An earlier full run hit the showcase accent test's five-second timeout while browser checks also ran. The focused showcase suite and final full run passed after separating browser work; no timing thresholds were changed.
- Operated both charts with desktop clicks and native touch taps at 1100px and 390px: hide promotes Data centers and changes +7 to +6; restore returns overflow; hiding six categories shows all eight remaining slices without expansion; hiding all keeps fourteen closed-eye restoration controls and Show all returns focus. Native keyboard checks cover later-page collapse and restoration into expansion without losing usable focus.
- Inspected dark desktop, dark/light mobile, expanded-legend and all-hidden screenshots. Legends remain within the chart, scroll when necessary, preserve eye alignment, and cause no page overflow. Final desktop legend height is 272px with 448px scroll content. Screenshots are removed after review.
- Canonical contracts, both generated chart guides, rendered examples, the specification, earlier ticket's supersession note and parent ticket are current.
- Initial independent review admitted three findings: reused page styles collided after promotion, all-hidden copy offered unavailable page navigation, and page clamping overwrote the existing source-data reset. Regressions reproduced the style collision and source reset, then passed after correction. Pattern identity now counts each color occurrence over all ranked records and uses stable short/long dash sequences on slices and swatches. Source resets take precedence over visibility page clamping. All-hidden copy offers only available restoration controls.
- Renewed chart suites pass 32 tests; the complete repository check passes 740 tests. The corrected static preview passed desktop and native touch refill/restoration flows; reviewed repeated-color patterns and updated empty-state screenshots. Native keyboard collapse/restoration also passes. Independent intent and engineering correction reviews passed with no findings. No blockers remain.
