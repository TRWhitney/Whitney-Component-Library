# 26 Explore LineChart domains

**What to build:** Deliver the approved LineChart navigation through the public component, including controlled range coordination and complete-data alternatives.

**Blocked by:** None. [25](25-exploration-layout-foundation.md) and the overview access decision are complete.

**Status:** completed

- [x] Expose opt-in internal/default or controlled domain windows and localized navigation labels. Continuous numeric and time axes preserve their value types; invalid ranges fail clearly.
- [x] Deliver attached zoom/reset/pan controls and a quiet Overview IconButton opening the horizontal strip directly in the existing Dialog with pointer and keyboard window movement/resizing. Match the accepted line artifact at compact and wide widths.
- [x] Implement two-finger pan and pinch as part of native chart input arbitration. One-finger selection, hold activation and live drag previews remain faithful; second-touch cancellation cannot change selection on release.
- [x] Keep the full valid model and complete table. Clip rendering and interaction to the viewport, preserve crossing segments at boundaries, fit the automatic value scale to visible geometry and keep explicit axis constraints.
- [x] Preserve outside-window selection and stable callback identities. Handle empty windows, data updates, controlled updates and all-hidden recovery. Overview visibility follows the same series state as the chart.
- [x] Demonstrate internal navigation and deliberate application coordination in the showcase; update contracts and public-type examples. Complete component, native browser, SSR/hydration, reduced-motion and package checks plus independent reviews.

- [x] Overview movement and resizing follow pointer dragging immediately; retain keyboard/reset animation, reduced motion, range changes on dismissal and focus return to the icon.

## Accepted sources

- [Modal overview access](../prototypes/modal-overview.md#accepted-behavior), superseding earlier disclosure and expansion controls.

- [Production exploration boundary](../spec.md#production-exploration-boundary)
- [Line contract](../prototypes/domain-exploration.md#accepted-pan-and-zoom-contract)
- [Horizontal group](../prototypes/chart-exploration-comparison.md#accepted-behavior)
- [Scatter/bubble](../prototypes/point-exploration.md#accepted-behavior)
- [Remaining families](../prototypes/remaining-exploration.md#accepted-behavior)

## Completion evidence

The public LineChart implements the accepted icon-to-dialog overview and a separate domain window. `ChartExploration` supports controlled and internal windows, localized labels, live/completion callbacks, logarithmic spacing and Date values. Complete source rows, tables and selection identities remain intact. Whole-category windows also work for the existing categorical LineChart.

Focused public tests first failed for missing navigation, invalid-window validation and touch arbitration. Categorical coverage then caught five rendered markers instead of three and value fitting that still included outside categories; both regressions pass after correction. The public exploration and shared-controls suite passes 16 tests. The complete repository check passed all 777 tests, both linters, formatting, generated documentation, TypeScript 5/6/7 declarations and chart bundle isolation. The final change passed the complete repository check. Loading-source and source-change-during-drag regressions also pass. Their initial failures showed a lost default range and a stale gesture updating replaced data. `npm run verify:package` passes React 18.3.1 and 19.2.8 SSR, hydration, public types and browser builds; the production showcase build passes. Independent production reviews and the bounded correction reviews are complete.

Native Chromium operation at 390px and 1280px covered zoom, two-finger panning, keyboard overview movement, touch window movement, Done/focus return, hidden overview series, all-hidden recovery and reduced motion. Touch dragging reported zero transition duration. The 390px chart stayed 308 by 578.59 CSS pixels through navigation and dismissal; no selection was committed by two-finger panning. Dark and light charts and dialogs were inspected. An initial narrow layout pushed controls into horizontal overflow; navigation now keeps a stable canvas and fits tick spacing. Numeric and Date callback tests, full-table preservation, outside-window selection, empty-observation crossings, logarithmic bounds, controlled coordination and SSR hydration pass. The showcase contains internal and shared application-controlled date windows.

Native touch selection followed by a 620ms hold opened the November details while retaining the same single selection. Operating one controlled chart changed both date ranges to the same value. The production preview is refreshed.

## Review corrections

Initial independent intent review found that a one-category window could not pan because the one-third-window movement rounded back to its original category. Initial independent engineering review found that reversing category order collapsed a retained multi-category window. Both findings are admitted. Public regressions failed before the fixes and pass afterward. Category controls now move by at least a whole category, and retained endpoints follow current category order.

The parent also compared the touch distance calculation with the approved behavior and found that vertical pinches did not zoom. The public regression failed with an unchanged 50-unit span instead of 25. Finger separation now uses both screen coordinates while the pan anchor stays on the chart axis. Native vertical pinching reduced July 2025–June 2026 to September 2025–March 2026 without changing selection or chart dimensions. The overview still followed touch dragging with zero transition duration.

The correction's focused suite passes 19 tests. The full repository check passes 780 tests, formatting, both linters, all declared TypeScript versions, generated guides and chart isolation. Final package verification passes React 18.3.1 and 19.2.8 SSR, hydration, types and browser builds. The production showcase build passes and the preview is refreshed. Independent intent and engineering correction reviews pass with no findings.
