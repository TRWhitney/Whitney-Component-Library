# 16 Hide and restore radar profiles

**What to build:** Approved legend eyes and animated visible-profile fitting for RadarChart.

**Blocked by:** none

**Status:** complete

- [x] Optional localized eyes hide profiles separately from legend pinning, with stable order, colors, patterns and ID reconciliation.
- [x] Shared radial scale fits visible profiles using interruptible animation and reduced-motion settlement, preserving raw values and bounded marks.
- [x] Hidden selections and full table remain labeled; hidden profiles are excluded from readings, activation, keyboard and drag. Data/visibility changes cancel gestures.
- [x] All-hidden recovery retains legend, caption, table and selection, restores first-eye focus, and preserves full-input feedback.
- [x] Public types, canonical contract, generated guide and showcase agree; focused and repository checks, direct browser inspection and independent production reviews pass.

## Accepted sources

- [Radar visibility](../spec.md#radar-series-visibility)
- [Radar interaction](../spec.md#radar-interaction)
- [Approved legend eyes](../prototypes/legend-visibility.md#accepted-contract)
- [Sparse radar values](../../../docs/adr/0016-preserve-radar-values-while-shaping-sparse-fills.md)

## Completion evidence

Design retains the radar's side legend and compact wrapping, using the approved opening/closing eye
as its distinctive control. Use `--wcl-text`, `--wcl-text-muted`, `--wcl-surface`,
`--wcl-border` and existing series colors. Caption/body and utility legend text keep their current
scale and hierarchy. One shared 240ms scale animation coordinates polygon, dots and guides;
reduced motion settles immediately. Recovery replaces the plot and keeps the same legend position.
These choices preserve the approved radar and legend studies without adding decoration to data.

Four initial public tests failed because eyes were absent. Eight visibility tests now pass,
covering separate pinning, stable colors/patterns and IDs, hidden selection, full tables, recovery
focus, visible-only activation/keyboard, zero values, interruptible bounded scale animation,
reduced motion, invalid feedback, touch-hold and drag cancellation, and removed-record pruning.
The focused and affected radar suites pass 50 tests across three files. `npm run check` passes
716 tests across 45 files, formatting, both linters, type checks, generated-output checks,
TypeScript 5/6/7 and chart isolation. Build and static showcase build pass.

Direct Chromium inspection covers dark, light, forced colors, compact 390px layouts, native touch,
keyboard selection, pin separation, all-hidden full-table recovery and first-eye focus. The
recovery message stays beside the legend without overlap. Stacked layout allocates enough height
for the eyes. Local minimum-width scrolling remains available with no page overflow. The public
mobile production preview repeats hide/restore and recovery successfully. Evidence logs are
`/tmp/radar-vis-green.log`, `/tmp/radar-vis-check.log`, `/tmp/radar-vis-browser-final.log` and
`/tmp/radar-vis-remote.log`. Packed React 18/19 SSR, hydration, public types and browser builds pass in
`/tmp/radar-vis-package.log`. Independent intent and engineering production reviews both pass with no findings. Reviews were
read-only and used the complete outcome and existing evidence without rerunning validation.
