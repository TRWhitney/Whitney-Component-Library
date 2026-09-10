# 21 Hide and restore heatmap dimensions

**What to build:** Approved row/column eyes, complete track removal and a compact corner restore list in the public Heatmap and showcase.

**Blocked by:** none

**Status:** complete

- [x] Optional localized visibility labels enable individual row and column eyes. Reveal on label hover/focus; touch eyes and the hidden-count corner control stay visible. The corner opens an overlaid restore list with individual closed eyes, Escape/outside dismissal and focus recovery.
- [x] Hidden dimensions leave no tracks or cells. Visible data refits the automatic color scale and grid with brief reduced-motion-aware animation; explicit domains remain fixed. No intersection eyes or bottom restoration section.
- [x] Hide state uses stable domain IDs, survives value updates/reorder, and prunes removed IDs. Removing the option restores the full chart. All-hidden recovery retains full readings, caption and selection with individual restore and Show all.
- [x] Hidden cells retain selection and appear as hidden in selection/table labels, but cannot receive reading, activation, keyboard or drag gestures. Clear selection clears hidden items too. Visibility changes cancel ongoing gestures; first/repeated touch activation still animates without selecting.
- [x] Validate all original inputs before filtering, preserve original accessor indices and callback records, and keep existing empty/loading/error/partial behavior.
- [x] Public types, canonical/generated docs and showcase cover the option and gestures. Add focused public behavior/type coverage, run required checks, operate desktop/touch/light/dark/reduced-motion flows and obtain independent production review.

## Accepted sources

- [Accepted behavior](../spec.md#heatmap-visibility-accepted-behavior)
- [Prototype contract](../prototypes/heatmap-visibility.md#acceptance-contract)

## Completion evidence

`npm run check` passes formatting, code/style lint, types, all 752 tests, generated docs,
TypeScript 5/6/7 public declarations and chart isolation. Focused heatmap suites pass 47 tests.
The static showcase build passes. Logs are `/tmp/heatmap-vis-check.log`,
`/tmp/heatmap-vis-green.log` and `/tmp/heatmap-vis-showcase.log`.

Native desktop keyboard and 390px touch operation cover hide row/column, corner restore,
all-hidden individual recovery and Show all, first/repeated touch activation, dark/light,
forced colors and reduced motion. Restoring one room from all-hidden retains the open restore
list; restoring the last hidden item returns focus to the first row eye. Sixteen cells return
on Show all. First and repeated holds animate without selecting; no page overflow was observed.
Inspected screenshots and DOM state.
The mobile viewport check repeats the hide/restore flow successfully in `/tmp/heatmap-vis-remote.log`.
Independent intent review passed with no findings. Engineering review found that unbroken row
or axis-heading labels could push eyes out of clipped containers. Text now shrinks and truncates
while controls retain their space; full labels remain in accessible names and titles. Native
390px measurement reproduced eye bounds outside their label containers before the fix, then
inside after it. The nonblocking automatic-domain coverage note was also addressed by asserting
both fitted endpoints after hiding an extreme. Renewed validation passes. The bounded engineering correction review passes with no remaining
blockers; both independent review axes now pass.
Packed SSR, hydration, types and browser bundles passed with React 18 and 19 in
`/tmp/heatmap-vis-package.log`; this packaging evidence remains applicable to the CSS/text-wrapper
correction.

## Design and implementation notes

Preserve the accepted prototype's open/closed eyes and corner count. Use `--wcl-surface`,
`--wcl-text`, `--wcl-text-muted`, `--wcl-border`, and the existing blue scale. Caption/body text
and 0.75rem utility labels retain their roles. Axis eyes reserve control space so hover does not
move labels. The restore list overlays the chart using the existing dialog/popover infrastructure.
Grid replacement fades for 240ms, with the automatic color domain interpolating over the same
period; reduced motion settles directly. No hidden tracks or extra bottom restoration section.

Initial public integration cases failed because Hide controls were absent. The focused heatmap
suites now cover track removal, tables, retained controlled/uncontrolled selection, ID reconciliation,
fixed domains, full-source validation, original accessor indices, hidden-only missing cells,
first/repeated touch holds with callback rendering and gesture cancellation. Native browser
inspection caught and corrected focus loss on final restoration. Desktop/touch now return focus
to the first row eye after the final restore; remaining restore choices keep focus in the popup.
