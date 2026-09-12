# Energy desk library verification

The accepted app consumes an installed package archive through public exports. The thirteen corrections below replace the reported library limitations while preserving the accepted workspace and session-only scope.

## Repository checks

- `npm run check` passes 1009 tests across 72 files, formatting, ESLint, Stylelint, strict TypeScript, generated-documentation freshness, TypeScript 5.9/6/7 public declarations, and ordinary-component chart isolation.
- `npm run verify:package` passes clean packed SSR, hydration, types, and browser builds with React 18.3.1 and 19.2.8.
- `npm run prototype:analysis:build` installs the package archive, checks the consumer, and builds the app.
- `npm run showcase:build` builds the rendered component examples.
- `git diff --check` passes.

The build reports its existing chunk-size advisory. Bundle splitting and production hardening are outside this prototype's scope.

## Acceptance mapping

| Ticket                     | Direct evidence                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01 Hidden table overflow   | In Chromium and Firefox, twelve long columns fit inside a one-pixel hidden table at a 320px viewport without document overflow. Accessible table names, headers, rows, and values remain present. The packed app has no document overflow at the tested sizes.                                                                                                                                                                            |
| 02 Selection presentation  | Both browsers show either the panel or controls, with one count, Clear action, and on-demand help. Selection survives switching modes. Public tests cover all six renderer families, hidden selections, clearing, and focus.                                                                                                                                                                                                              |
| 03 Complete marks          | Main and overview marks retain their complete shapes at full-domain edges. Selected scatter and bubble shapes, cropped edges, constant data, window alignment, and dragging pass focused tests. Wide and narrow browser inspection confirms the geometry.                                                                                                                                                                                 |
| 04 Row context actions     | Tree and Table expose typed row actions. Right-clicking a building pins the correct record without changing unrelated selection or pressed state. Public tests cover keyboard, descendant controls, touch long press, disabled rows, reorder/removal, and focus restoration.                                                                                                                                                              |
| 05 Plot proportions        | Line and scatter aspect ratios change actual geometry without stretching marks. The app derives its public aspect ratio from the analysis pane. Browser inspection confirms readable axes and useful plot space at laptop sizes.                                                                                                                                                                                                          |
| 06 Exploration composition | Chart, panel, and public Toolbar presentations each render one command set. Panel commands wrap at 390px without duplicated regions. Pan pairs sit at the lower edges. Browser inspection confirms complete plots and reachable local overflow at the legibility limit.                                                                                                                                                                   |
| 07 Compact density         | The packed app uses compact fields, dropdown options, and Tree rows. Direct filter interaction confirms short gaps and inherited dropdown density. Tests preserve real descriptions/errors, explicit support reservation, and comfortable defaults.                                                                                                                                                                                       |
| 08 Cursors                 | Clickable campus text has a pointer cursor. The showcase and style regressions cover actionable, disabled, pending, and editable controls without making static content clickable.                                                                                                                                                                                                                                                        |
| 09 Search focus            | After focusing a row, sequential typing through zero results retains focus and every character. The empty Tree has no redundant grid frame. Search opens matching campuses and clearing restores prior expansion.                                                                                                                                                                                                                         |
| 10 Activation feedback     | Distribution activation retains its pulse when a point becomes current. Monthly activation opens the corresponding reading and pulses. Reduced-motion operation retains static feedback. Removed targets and removed callbacks cancel feedback in regression tests.                                                                                                                                                                       |
| 11 Keyboard exploration    | Canvas and command buttons share pan/zoom handlers. Rapid Fit followed by plus passes in both browsers across chart, panel, and Toolbar presentations. Shift plus arrows retains reading navigation; overview handles retain their own behavior. A regression covers synchronous focus recovery when a command becomes disabled.                                                                                                          |
| 12 Rounded table feedback  | Chromium and Firefox pass selected/unselected hover, pressed feedback, and keyboard row focus in light/dark, LTR/RTL, and forced colors. Interaction strokes sit 1px inside the neutral frame with 10px lower radii; keyboard borders are 2px. A 500px consumer container verifies horizontal scrolling to both ends. Inspected screenshots retain curved borders, backgrounds, and selection rails. Tests also cover single-row styling. |
| 13 Context-menu isolation  | Opening the building menu leaves unrelated Tree rows and nested buttons unpressed. Public tests and a dedicated ContextMenu-wrapped Tree showcase preserve selection and trigger independence.                                                                                                                                                                                                                                            |

## Application inspection

Chromium and Firefox pass the packed app at 1600×1000, 1101×800, 1024×768, 800×650, and 390×844. Document width and height match the viewport. Dense content uses local scrolling at its legibility limit. Direct preview inspection also covers 1280×800.

Executed flows include campus expansion, search through empty results and back, reversible search expansion, right-click pinning, comparison retention through filters, distribution and monthly pan/zoom/fit, overview entry and dismissal, and immediate continued keyboard use. No page errors occur.

Additional Chromium operation covers reduced-motion distribution and monthly activation, reading inspection, investigation notes, escaped CSV export, light appearance, selected table hover, filter state, and the no-data state. Direct preview interaction covers the compact filter popover and dropdown, filter selection and Clear spacing, working-record changes, and Readings.

The source showcase passes Chromium/Firefox inspection at 1600px and 560px, with targeted command checks at 390px. Twenty-four rapid Fit-to-plus cycles pass across both browsers and all three command presentations. Screenshots were inspected and discarded; they are not delivery artifacts.

Full manual screen-reader and wider release-browser acceptance remain in the foundation release gate. No WebKit result is claimed for this effort.

## Rework verification

The final package passes Chromium and Firefox at 1280px, 800px, and 390px widths. Full-range scatter marks remain inside the plot axes, including their outlines. Tests also cover bubble size ratios, endpoint tick alignment, touch coordinates, symbol hit regions, and uninterrupted legend-filter animation.

The filter form keeps a 16px gap between controls. At 800px width and heights of 220px, 300px, and 500px, the positioned popover contains its dialog and scrollable body inside the viewport. Clear filters remains reachable through local scrolling. Direct preview operation repeats zoom, Fit, and compact plot inspection; earlier direct filter operation and inspected spacing evidence remain valid.

Actual mouse-wheel input zooms both distribution and monthly charts when the canvas or a command button owns focus. Unfocused charts retain ordinary scrolling. Public tests also cover Toolbar composition, trackpad accumulation, bounds, overview isolation, horizontal gestures, and modified input.

Table inspection covers the one-pixel separation between the accent stroke and neutral frame in both browsers, selected multi-row and single-row tables, light/dark appearance, LTR/RTL, forced colors, and a 500px scrolling container. Inspected screenshots show a consistent curved accent without blending into the frame.

## Corrections during verification

Packing initially omitted the new selection stylesheet. The package builder now copies every owned chart stylesheet, and clean packed browser builds pass.

A Firefox focus race after Fit required synchronous recovery before the next key. Its public regression failed before the correction and now passes alongside the browser sequence.

Expanded showcase content exposed expensive whole-page test queries. The affected tests now scope their queries to the component or notification region. The complete suite passes without increasing timeouts.

The zoom minimum regression exposed a rounding mismatch between shortcut and button guards. Both now share the same predicate; the regression passes for a 0.1 minimum span. The prototype launcher forces Vite dependency refresh after installing a same-version package archive.

Independent intent and engineering reviews pass with no findings after the zoom-limit correction and completed table evidence.

Rework regression checks caught a series-visibility jump and a touch-coordinate jump caused by changing projection padding. Both are corrected. The existing shape-hit fixture now derives coordinates from rendered numeric ticks. A notification hydration test now waits for hydration and unmounts its root, preventing React work after DOM teardown. All 1009 tests pass without unhandled errors.

Independent intent and engineering rework reviews both pass with no findings. Review covered the complete change against `fce4df7` and inspected the current acceptance evidence.

Focused middle-button dragging passes in Chromium and Firefox on distribution and monthly charts. Direct operation at 800×650 confirms proportional movement, stable zoom, release, a grabbing cursor, and Escape from command-button focus. Public tests cover all command presentations, heatmap movement beyond the visible plot, vertical bar-chart categories, and no activation. `npm run check` passes all 1009 tests. The packed prototype and rendered showcase builds pass.

Independent intent and engineering reviews of middle-button panning pass with no findings. The addition is folded into the original chart-input outcome.
