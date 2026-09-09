# 15 Hide and restore statistical chart groups

**What to build:** Extend the approved legend eyes and automatic visible-data fitting to ScatterChart, BubbleChart and BoxPlot.

**Blocked by:** none

**Status:** complete

- [x] Optional localized visibilityLabels enables eyes after group names in a required legend. Pinning remains separate; hidden entries retain order, color and shape, and hiding clears their pin.
- [x] Scatter/bubble series and box summaries/outliers hide together by stable group ID. IDs reconcile across data updates, removed groups reset, and new groups start visible.
- [x] Visible numeric axes fit with interruptible animation, fixed consumer domains and logarithmic validity are preserved, and reduced motion settles immediately. Box categories use remaining group order.
- [x] Hidden selections persist with localized hidden labels; hidden items cannot be read, dragged or activated. Visibility/data/geometry changes cancel gestures and stale readings.
- [x] All-hidden recovery retains full data, legend and selection, distinguishes hiding from invalid/empty data, and restores focus to the first eye. Full tables identify hidden groups.
- [x] Public types, canonical contracts, generated guides and rendered examples are current. Focused tests, repository/build/package checks, direct theme/touch/keyboard inspection and independent production reviews pass.

## Accepted sources

- [Statistical group visibility](../spec.md#statistical-group-visibility)
- [Accepted legend contract](../prototypes/legend-visibility.md#accepted-contract)
- [Cartesian visibility delivery](01-cartesian-visibility.md)

## Completion evidence

Design applies the accepted Cartesian eye after each legend name, using `--wcl-text`,
`--wcl-text-muted`, `--wcl-surface`, `--wcl-border` and the existing series palette. Caption text
retains the body role; legend/recovery/selection retain the utility role and current scale. The
legend remains above the plot and wraps through established styles. The distinctive opening/closing
eye and 240ms interruptible domain animation are reused; reduced motion settles immediately. No
new controls or decorations are added to plotted data. This matches the approved legend study.

Initial six tests failed for missing visibility controls after correcting a malformed box fixture.
The initial ten public tests and affected chart suites passed, 61 tests across five files.
An added restoration regression failed for unbounded returning marks and passes with the correction;
all eleven visibility tests now pass.
Coverage includes group pin separation, stable IDs, hidden selection/full tables, all-hidden focus,
fixed/log domains, animated interruption, reduced motion, box outliers and gesture cancellation.

`npm run check` passes all 708 tests across 44 files, formatting, both linters, type checking,
generated-output checks, TypeScript 5/6/7 and chart isolation. Build, showcase build and packed
React 18/19 SSR, hydration, types and browser builds pass.

Direct Chromium operation verifies name pinning remains independent, hiding clears the pin,
selected hidden observations/summaries remain labeled, all-hidden recovery preserves complete
tables, and Show all restores focus to the first eye for all three components. Compact 390px light
appearance has no page overflow; dark and forced-color controls and plots were inspected. Native
touch taps hide/restore all three families and preserve hidden selection. Animation interruption
and reduced-motion settlement are covered by controlled frame tests at the public component seam.
The production build also passes the hide-all and restore flow on a mobile viewport.

Independent intent review passes with no findings. Engineering review identified returning marks
projecting outside the chart while its scale expanded. Visibility-enabled marks now have clipping
that allows boundary-shape padding and stays within the SVG viewport. The regression test proves
containment at the first restoration frame. The bounded engineering correction review passes with
no findings. Renewed evidence is in `/tmp/stat-vis-check-final.log` (708 tests across 44 files),
`/tmp/stat-vis-package-final.log`, `/tmp/stat-vis-browser-final.log` and
`/tmp/stat-vis-showcase-final.log`; these temporary logs are not required to resume the work.
