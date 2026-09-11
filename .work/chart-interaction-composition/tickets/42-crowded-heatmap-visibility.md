# 42 Keep dense heatmap visibility controls usable

**What to build:** Preserve full-grid exploration while crowded axes use the existing corner eye/list to manage visible and hidden rows and columns.

**Blocked by:** None. Whitney approved the compact-control approach.

**Status:** complete

- [x] Detect when existing eye hit areas cannot fit; avoid overlapping inline controls.
- [x] Keep every source row/column manageable through open/closed eyes in a compact overlay with retained focus.
- [x] Preserve unrestricted zoom, selection, complete data and existing controls at readable density.
- [x] Provide localized naming, matching showcase/guidance, a public regression and native narrow operation.

## Accepted sources

- [Crowded heatmap visibility](../spec.md#crowded-heatmap-visibility)

## Completion evidence

The 390px production fixture reproduced overlapping eyes. The public regression first failed because crowded inline eyes remained. It now passes with all 576 cells available, hide/restore through the compact manager, retained list focus, focus returning to the trigger, and a complete 576-cell data table.

Native production showcase operation at 390px used touch taps to hide and restore Room 1 and Hour 24. Hiding one track leaves 552 cells; restoring returns all 576. The list remains open and its toggled button retains focus. Escape returns focus to the corner eye. Dark/light screenshots and a 1280px view were inspected. The control and list fit their containers. Returning to the original small dataset restores inline eyes.

The rendered example includes a 24-by-24 switch. The public optional `visibilityLabels.manage` supplies the compact control's name; existing callers fall back to their row and column headings. Canonical guidance and generated heatmap documentation are updated.

Repository checks pass 938 tests. After the final heatmap refactoring, all 54 heatmap tests and TypeScript pass. Packed React 18.3.1/19.2.8 SSR, hydration, types and browser builds pass, as does the production showcase build.
