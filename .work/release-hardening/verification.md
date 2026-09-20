# Release hardening evidence

Recorded 2026-09-19 through 2026-09-20 on Ubuntu 24.04. Validation is complete on `main`; delivery review passes.
This is representative coverage, not completed assistive-technology certification.

## Environment and repeatable checks

Playwright 1.61.1 uses Chromium 149.0.7827.55, Firefox 151.0, and WebKit 26.5.
These are Linux browser engines, not Windows, macOS, or physical mobile-device runs.
The package retains its Baseline 2023 contract. This run does not claim historical-browser coverage.

| Check                                                                                                                                        | Result                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check`                                                                                                                              | Passed formatting, code/style lint, types, 85 test files and 1,201 tests, generated metadata, TypeScript matrix, chart/editor isolation. |
| `npm run verify:package`                                                                                                                     | Passed packed SSR, hydration, declarations, and browser builds with React 18.3.1 and 19.2.8.                                             |
| `npm run showcase:build -- --outDir /tmp/wcl-release-showcase`                                                                               | Passed. Separate output preserves the running built integration fixtures.                                                                |
| `npm run prototype:analysis:build`, `npm run prototype:markdown:build`, `npm run prototype:workbench:build`                                  | All passed against the current packed package.                                                                                           |
| `npm run verify:release:browser`                                                                                                             | 39 groups passed, 13 in each engine, including short-height Select and ComboBox scrolling.                                               |
| `ANALYSIS_URL=http://localhost:5184 MARKDOWN_URL=http://localhost:5186 DOCKET_URL=http://localhost:5187 npm run verify:release:integrations` | 24 paths passed, four fixtures with keyboard and touch in each engine. Downloads contain edited content.                                 |
| Same URL variables with `npm run verify:release:accessibility`                                                                               | No unreviewed violations. See scanner adjudication below; an exit code alone does not certify accessibility.                             |

The component runner covers catalog identity, layout families, actions, choices, fields, ranges,
compound date fields, select/combobox, collections/navigation, nested overlays, phone-width pointer
selection, files, feedback, calendar/confirmation/menu flows, Markdown mode continuity and read-only
behavior, all 14 chart entries, appearance, and viewport bounds at 1440, 720, 390, and 320 CSS pixels.
Reduced motion checks ProcessTracker animation removal. Forced-colors inspection checks status text
and distinct stage symbols. These are representative checks, not every possible application state.

The keyboard integration paths reach controls using Tab, Shift+Tab, and composite arrow navigation.
They do not replace an inaccessible step with pointer activation. Touch paths use touch events at
390 by 844. The operational fixture deliberately ends at its existing running-monitor state.

Existing Docket runners also passed in Chromium and Firefox. `prototypes/application-workbench/verify-browser.mjs`
covered save races, selection, export, drawers, failure recovery, empty/loading states, themes,
and alignment. `verify-review-layout.mjs` covered review geometry at wide and narrow sizes,
resizing, evidence drawers, and retained drafts/files. The broader release runner verifies the
final compact Details fix in all three engines.

## Fixes and regression boundaries

| Finding                                                                          | Owning change and evidence                                                                                                                                                                                           |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nested Markdown lists escaped their parent item in Live Preview.                 | Structural wrapper priorities now follow nesting depth. The new list-ownership test failed before the change and passes afterward.                                                                                   |
| Markdown tasks lacked accessible names.                                          | Live Preview and Preview derive names from task text, including inline formatting. Optional `labels.emptyTask` supplies the localized empty-task fallback. Both mode tests failed before the fix and pass afterward. |
| Heatmap's color-key label had no supported grouping role.                        | Added the group role. The named-group regression test failed before and passes afterward.                                                                                                                            |
| Disabled DropZone support content did not expose the group's unavailable state.  | Disabled and pending groups now expose `aria-disabled`. The disabled-group regression failed before and passes afterward.                                                                                            |
| Markdown accent annotations used a graphical-contrast color.                     | Added a surface-specific text role meeting 4.5:1. Sixteen appearance-matrix cases failed before the change; all pass afterward.                                                                                      |
| Docket's compact Details control lost its name when its visible text was hidden. | The compact trigger uses IconButton with `label="Details"`. The phone integration path failed before the change and now passes in all engines.                                                                       |
| Fieldnotes lost useful keyboard focus after a review action disabled itself.     | Review focuses the next enabled command through its public gridcell, then Export. Firefox/WebKit originally reclaimed focus to the old cell. All three engines now complete review without pointer input.            |
| Narrow nested Select pointer choices selected a neighboring option.              | Removed showcase root smooth scrolling that moved the portal between pointer events. Loading, Ready, Empty workspace, and Load error now select correctly in all engines.                                            |
| Operational review commands overflowed at phone width.                           | The fixture uses the existing vertical ButtonGroup composition. A new button-bounds assertion failed on Review configuration before the change and passes afterward.                                                 |
| Named generic containers lacked semantics.                                       | Added roles to the showcase loading region and Energy desk comparison group. Axe no longer reports them.                                                                                                             |

The operational fixture source is shared by the packed consumer verifier and its browser entry.
Its source-verification tests pass. No public application framework was introduced.
Changed public behavior is explained in the human-facing showcase. Markdown contract guidance is
regenerated from its canonical source.

## Direct interface and visual inspection

Operated the rendered applications through the collaborative browser, in addition to the scripts.
Inspected screenshots together with DOM roles, names, active focus, and geometry.

- Fieldnotes at 1440 by 1000: click the first review command, then press Enter twice.
  All three documents become reviewed; Export becomes enabled and receives visible focus.
  The review table, status rail, and publication panel remain aligned.
- Docket at 390 by 844: open the named Details icon and close the drawer with Escape.
  The drawer fits the viewport, metadata remains readable, and focus returns to Details.
- Showcase at 390 by 844: open Run summary, open Review state, select Loading, reopen,
  and select Load error. The displayed value matches each pointer choice. The selection list
  and parent popover stay within the viewport, with focus returning to the Select trigger.
- Operational proof at 390 by 844: submit empty configuration. The field becomes invalid and
  the error is visible. Both vertically stacked review controls fit within the content width.
- Energy desk at 1440 by 1000: inspected the loaded tree, chart, comparison controls, and
  investigation pane. Chart labels, axes, symbols, and selected rails remain distinct.
- Inspected phone screenshots for Energy investigations and Fieldnotes completed publication,
  and light/compact and forced-color status examples. Labels wrap without clipping; status
  words and shapes preserve meaning without color.
- Inspected Markdown with purple accent in both themes. Task indentation and nesting remain
  legible. The built-in annotation uses a readable text accent. Authored RGBA remains exact.

Task-owned screenshots are temporary inspection artifacts and are removed after inspection.
The runners can regenerate screenshots and raw JSON/ARIA evidence in `/tmp/wcl-release-evidence`.

## Scanner adjudication

Axe 4.13 scans the default dark showcase, light/orange showcase, compact dark/purple showcase at
390 and 1440 pixels, and the four integration fixtures. Raw findings remain in the output;
the runner does not disable rules globally.

The meter uses React Aria's `role="meter progressbar"` fallback list. Axe's `aria-allowed-attr`
check resolves the whole string as an unknown role unless fallback parsing is enabled.
The browser accessibility snapshot exposes a named meter with its value. WAI-ARIA permits
space-separated role fallbacks, processed in order of recognition. The runner accepts only this
exact library meter role, its value attributes, and a confirmed meter snapshot.
See [WAI-ARIA role definitions](https://www.w3.org/TR/wai-aria-1.2/#roles) and the installed
`axe-core/axe.js` functions `getExplicitRole`, `getRole`, and the `aria-allowed-attr` rule.

The Markdown RGBA example retains an authored color with insufficient contrast on dark backgrounds.
The accepted [Markdown specification](../markdown-authoring/spec.md) requires exact color across
appearances. The library must not silently recolor authored text. Contract and showcase guidance
now state that the author/application chooses colors for its supported backgrounds. Only nodes
explicitly marked as authored RGBA are classified this way; built-in annotation contrast is fixed
and checked. Forced colors uses system text colors.

Energy desk leaves 30 contrast checks incomplete because axe sees the FocusField pseudo-element.
Direct inspection confirms an opaque content surface above that decoration. Computed text/fill
colors for 106 text nodes in the field have a minimum ratio of 7.47:1. Muted content is
`rgb(166,177,183)` on `rgb(24,33,38)`. The Docket incomplete item is the decorative, aria-hidden
Style chevron; the Style button has its own text label.

The long narrow showcase produces incomplete contrast results for partially obscured navigation,
SVG labels, short labels, overlaps, and pseudo-elements. The matching wide compact/purple scan
has no incomplete results. A separate computed-style review of all 609 flagged narrow text nodes
found a minimum contrast of 4.65:1, with none below 4.5:1. Eleven Heatmap backgrounds use OKLCH;
the browser canvas converted those opaque colors to sRGB for the independent luminance calculation.
The other backgrounds and text/fill colors resolve directly to RGB. Narrow geometry and direct
visual inspection supplement these color measurements. The raw scanner incomplete results remain
visible rather than being relabeled as scanner passes.

## Remaining release evidence

Whitney confirmed on 2026-09-19 that Orca speaks while tabbing and that Run mode can be opened,
changed with arrow keys and Enter, and heard afterward. Whitney also confirmed that reopening and cancelling preserves the selection and returns
focus with an announcement. The Select exercise passes. ComboBox result counts, including zero, and individual
option announcements during arrow-key navigation are confirmed. The ComboBox exercise passes. DateField names, segments, and changed values are announced;
the full date is announced on month changes. DateField passes. Whitney also confirmed that DateRangePicker distinguishes the endpoints
and announces the selected range; both compound-field exercises pass. Nested-dialog titles, focus containment, and focus return are also confirmed. AlertDialog announcement, initial Cancel focus, and focus return after cancellation are
confirmed. The overlays group passes. ListBox option navigation and selected-state announcements also
pass. On 2026-09-20 Whitney confirmed Table cell values, column names, and sorting announcements.
Tree navigation and the search-result announcement retest also passed, completing collections.
Navigation, charts, Markdown, and status-announcement exercises subsequently passed, as
recorded below. The [focused library checklist](screen-reader.md) is complete. Per Whitney's
scope clarification, fixtures do not require separate manual workflow acceptance. Actual
browser zoom now passes the direct checks below; narrow automated viewports alone did not establish that result.

The dated observations below preserve the correction history. Final results supersede earlier pending observations. No stable-candidate acceptance has occurred.

## Tree search announcement correction, 2026-09-20

Whitney passed Tree hierarchy navigation, expansion, and selection, but reported silent search
counts and empty results. Direct reproduction confirmed the only existing live text was the
unrelated inspection message. Tree receives already-filtered data; the example owns the query
and the meaning of a matching building. Its new persistent `role="status"`, `aria-atomic="true"`
region reports matching records without counting the campus container. This follows
[W3C's search-status technique](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA22.html).
Tree contract guidance now describes that application responsibility.

The regression in `tests/showcase.test.tsx` failed before the change because the result-status
region was missing. After the fix, 29 showcase and collection-regression tests pass. The browser
runner now checks one match, no matches, and clearing back to three matches with search focus
retained. Direct operation at 390 pixels confirmed all three visible states, the status semantics,
and focus continuity. The full `npm run check` passes with 1,201 tests. All 33 browser groups pass, including the
new search checks in Chromium, Firefox, and WebKit. Whitney subsequently confirmed all three spoken results in Orca. The reported speech failure
is resolved and collections passes.

## Disclosure reading observation, 2026-09-20

Whitney confirmed Tabs activation/panel reading and CollapsibleNavigationPane state and sibling
command reachability. Disclosure expansion/collapse works, but reading its static text needs
clarification. A Firefox accessibility snapshot exposes region "Advanced solver settings" and
paragraph "Iteration tolerance is 0.0001 with a 400-step limit." No production change is warranted
by that evidence alone. The next manual check uses Down in Orca browse mode, following
[Orca's web navigation guidance](https://help.gnome.org/orca/preferences_web.html).
Whitney subsequently confirmed that the modifier and Down Arrow read the revealed text.
Disclosure reading and the navigation group pass; no component change was needed.

Whitney confirmed line-chart arrow-key announcements for month, Demand/Capacity readings,
and MWh units. Line-chart selection state, details, and data-table values/units were subsequently confirmed.
The line-chart exercise passes. Whitney also confirmed PieChart category/value/unit/share
and selection announcements, with readable details and table data. Heatmap remains pending.

## Heatmap keyboard entry clarification, 2026-09-20

Whitney could reach the track-hiding buttons but could not identify the plot focus stop.
Firefox inspection found the focusable Room temperature group immediately before Hide time
Morning. An initial plain-Right probe did not advance the reading; inspection of the accepted
exploration contract established that this is the pan command. Shift+arrows are the reading
commands when exploration is enabled. No component behavior changed.

Updated the Heatmap example's visible and accessible interaction instructions to explain plot
entry and these commands. Added a retained browser check for Shift+Tab entry, zero readings,
Shift+Right to the next cell, and missing readings. A targeted run passes in Chromium, Firefox,
and WebKit. Direct operation at 390 pixels confirmed focus on the plot and the Midday 18 °C
reading, with its visible marker and tooltip. Formatting and ESLint pass for the changed files.
The full browser runner passes all 36 groups, 12 per engine. Whitney confirmed that plot entry and Shift+arrow reading work in Orca. Whitney subsequently confirmed zero/missing distinction, selection announcements, readable
details, and Heatmap table data. The charts group passes.

Whitney initially reported Markdown editing and mode switching worked, then corrected the
report because text was not being read after mode changes. The manual mode-reading pass is
withdrawn pending diagnosis. Link/table reading and read-only/locked behavior remain pending.

## Preview document reading correction

Whitney identified Preview as the silent mode after tabbing to the document and trying arrows
and Insert+A. The container was a named generic region. Changed it to a named focusable
`document`, preserving its headings, tables, links, descriptions, disabled behavior, and focus
transfer. Updated the public contract, generated guidance, and human showcase instructions.
The role follows https://www.w3.org/TR/wai-aria-1.2/#document.

The existing public semantics/focus tests failed for the missing document role, then passed:
`npx vitest run tests/markdown-editor.test.tsx tests/markdown-live-preview.test.tsx`, 37 tests.
Logs: `/tmp/ticket30-preview-document-red.log` and `/tmp/ticket30-preview-document-green.log`.
The retained browser exercise now enters Preview, tabs into the named document, verifies
heading/table structure, tabs to a link, and returns to Source. All 36 browser groups pass
in Chromium, Firefox, and WebKit, `/tmp/ticket30-preview-browsers.log`.
Direct GUI operation at 1440 and 390 px confirmed entry focus, readable layout, local scrolling,
and link focus. Screenshots and DOM were inspected. A focused Preview axe scan has zero
violations with color-contrast excluded, since authored RGBA was adjudicated separately above.
The initial scan command incorrectly clicked the hidden radio input; the corrected scan
selected Preview with Space before inspecting it.

Whitney confirmed the retest: reload, choose Preview, Tab to Markdown review notes, press Down.
"It reads the document text." The reported Preview silence is resolved in Orca.
Whitney also confirmed Preview links and table headers/cells, then Source reading and edit
prevention in both Read-only and Locked states. Markdown passes. Four integration groups and
browser zoom remain.

The full repository check exposed an existing iOS simulation cleanup race: React Aria's delayed
text-selection restoration ran after jsdom teardown, throwing requestAnimationFrame undefined.
The collection test now waits for restored text selection before removing its mocked platform
and DOM environment. Its focused suite passes. The first full run is retained as failed evidence
in `/tmp/ticket30-preview-check.log`; the corrected full run is in
`/tmp/ticket30-preview-check-final.log`.

The corrected `npm run check` passes completely: 85 files, 1,201 tests, formatting, lint,
type checks, generated artifacts, React type matrix, and bundle isolation. No unhandled errors.

## Operational stage speech correction

Whitney reported repeated pending endings that made the workflow difficult to understand.
Direct inspection showed "Review pendingPending" and "Solve pendingPending" inside an
atomic status region, alongside the overall StatusIndicator live region. The fixture now
names the work without embedding its status and leaves tracker announcements off. The overall
status announces each transition. The public tracker separates description and localized
status text from the label with whitespace. Showcase examples, the contract, and generated
guidance explain stage naming and choosing one announcement owner.

The focused ProcessTracker test failed for joined text before the correction. The retained
Firefox integration regression failed on "Review pendingPending". After correction, 69 focused
tests pass and all six operational browser paths pass, keyboard/touch in Chromium, Firefox,
and WebKit. The browser regression checks one pending occurrence per stage, one overall live
status, no live ancestor around the stage list, and running-stage/progress semantics.
Logs are `/tmp/ticket30-stage-red.log`, `/tmp/ticket30-stage-green.log`,
`/tmp/ticket30-operational-speech-red.log`, and `/tmp/ticket30-operational-speech-green.log`.

Direct GUI operation covered empty validation, named configuration, review dialog, acceptance,
and run. Inspected screenshots and DOM show distinct stage markers, one running status, and
18 of 25 passes. The packed operational server was refreshed and remains detached on port 5179.
Orca retest is pending; automated results do not establish speech clarity.

The complete repository check passes after the stage correction, 1,201 tests plus lint,
formatting, types, generated artifacts, React matrix, and bundle isolation,
`/tmp/ticket30-stage-check.log`. Packed SSR/hydration/types/browser builds pass with React 18
and 19, `/tmp/ticket30-stage-package.log`.

The first Orca retest exposed a remaining information gap: only "Needs input" was announced.
The fixture now keeps short PageHeader statuses but supplies actionable StatusIndicator messages
for invalid, validated, reviewed, and running states. The retained integration test failed on
"Needs input" before this correction and now checks missing-name guidance, review readiness,
review acceptance, and running progress in the single status region. All six operational paths
pass, `/tmp/ticket30-operation-details-green.log`; the red log is
`/tmp/ticket30-operation-details-red.log`. The affected ProcessTracker and package-source suites
pass 21 tests, `/tmp/ticket30-operation-details-tests.log`; changed scripts pass ESLint/Prettier.
Direct empty-validation operation and a 390px screenshot confirm the full missing-name message
is visible and exposed in the atomic status region. Detailed Orca feedback is still pending.

Whitney confirmed the missing-name announcement retest "sounds good now." Empty validation
speech passes. Review/acceptance and running-stage/progress speech remain unverified.

Whitney confirmed the successful operational path in Orca, including review details and
the running announcement with 18 of 25 boundary passes solved. The operational group passes.

Energy desk was rebuilt with `npm run prototype:analysis:build`, then served on 5184.
All six current packed-app keyboard/touch paths pass in Chromium, Firefox, and WebKit,
`/tmp/ticket30-energy-refreshed-browser.log`. Direct browser loading, desktop layout screenshot,
and search control inspection confirm the manual entry is ready. Orca testing is pending.

Energy desk manual result: North Library search/selection and monthly plot reading pass in
Orca. Building identity, months, values, and units are clear. Remaining workflow checks pending.

Energy desk manual result: comparison readings, investigation controls, and export confirmation
pass in Orca. Failed-refresh recovery remains pending.

Energy desk manual completion: Whitney confirmed the failed-refresh and successful Retry
announcements, with comparison and investigation work preserved. The Energy desk group passes.

Fieldnotes was rebuilt with `npm run prototype:markdown:build` and served on 5186.
All six current packed-app keyboard/touch paths pass in Chromium, Firefox, and WebKit,
`/tmp/ticket30-fieldnotes-refreshed-browser.log`. Direct opening of Arrival brief, DOM inspection,
and a desktop screenshot confirm the editor loads and is ready for Orca testing.

## Manual validation scope correction

Whitney clarified that Energy desk, Fieldnotes, and the other integration fixtures are test
artifacts, not library products requiring individual manual acceptance. Manual exercises cover
distinct library component behavior; repeated application workflows add no required coverage.
The foundation specification, quality boundary, Ticket 30, and checklist now reflect that scope.
Existing automated integration checks and already-observed manual results remain evidence.
Fieldnotes/Docket manual walkthroughs are not required, not silently marked as passed. The
focused library screen-reader gate is satisfied; visual/zoom validation remains separate.

## Actual browser zoom and final visual evidence, 2026-09-20

Used native Chromium page zoom through `chrome.tabs.setZoom` in an isolated temporary browser
profile. The browser window stayed 1440 by 1000. At 200%, `getZoom` returned 2, device pixel ratio
was 2, and the content viewport was 720 by 456 CSS pixels. At 400%, those values were 4, 4, and
360 by 228. `visualViewport.scale` stayed 1, distinguishing page zoom from pinch magnification.
The user's browser profile was untouched. See the [Chrome tabs API](https://developer.chrome.com/docs/extensions/reference/api/tabs)
and [Playwright extension support](https://playwright.dev/docs/next/chrome-extensions).

The initial 400% Select check exposed a real defect. The popup fit the available height, but its
child list did not shrink. End moved focus to Fast below the clipped boundary. The browser
regression failed before the fix. The shared Select/ComboBox popup now uses a flex column and a
shrinkable scrolling list. Its 20rem cap no longer depends on an unavailable CSS variable.
The focused option now scrolls into view. At 400%, Fast occupied y=167.20 through 211.20 inside
a popup ending at y=216.25 in a 228px viewport. Enter selected it and restored trigger focus.
ComboBox retained input focus, identified Fast through `aria-activedescendant`, scrolled it into
view, and selected it on Enter. Human showcase descriptions explain the high-zoom behavior.

`npm run verify:release:browser` passes all 39 groups in Chromium, Firefox, and WebKit. The new
short-height regression checks both selection controls, focused-option bounds, selection, and
focus continuity. Logs: `/tmp/ticket30-zoom-red.log`, `/tmp/ticket30-zoom-browsers.log`.
Removed an old static assertion requiring the broken CSS declaration; actual rendered scrolling
is now covered by this browser regression. Other static appearance checks remain.

Direct interaction, screenshots, and DOM inspection also establish:

- At 400%, Dialog scrolls its name field and subsequent actions into view as Tab advances.
  Save name remains fully visible; Escape restores focus to Edit run name.
- At 400%, Markdown Preview text wraps inside the document width. Tab reaches its first link
  and brings it into view. The document retains its name and semantic content.
- At 400%, Table arrow navigation brings the focused column into its own horizontal scroll
  region. The page itself has no horizontal overflow. Wide tabular data keeps deliberate
  two-dimensional scrolling.
- Heatmap readings and tooltips remain usable at 200% and 400%; Shift+Right advances to the
  next reading with value and units, and the selected cell keeps a distinct outline.
- ProcessTracker preserves stage order, connecting lines, and distinct complete/active/pending/
  warning/failure symbols in dark at 200% and light at 400%. Text wraps within the component.
- Page scroll width equals content viewport width at both zoom levels. Tall content remains
  vertically scrollable. Focus indicators, selected rails, and semantic status colors agree
  with the accepted visual direction and the prior theme/accent/forced-color checks.

Native zoom was exercised in Chromium. Firefox and WebKit additionally pass the equivalent
short-height layout regression and existing responsive checks; this does not claim direct
native-zoom operation in those engines.

Docket was rebuilt against the current packed library and its six keyboard/touch integration
paths passed in all engines, `/tmp/ticket30-docket-final-browser.log`. This completes the fixture
refresh following the speech fixes. The final CSS-only selection correction is covered at the
shared library seam and does not invalidate the fixtures' completed application-flow evidence.

## Final quality gate

The final `npm run check` passes all 85 files and 1,201 tests, formatting, code/style lint,
TypeScript checks, generated metadata, React type matrix, and chart/editor isolation.
`npm run verify:package` passes packed SSR, hydration, declarations, and browser builds with
React 18.3.1 and 19.2.8. The showcase production build passes. The build reports its existing
large-chunk warning; no new package failure results.

The final accessibility run covers all eight scenarios with no unreviewed violations. Its
incomplete contrast counts remain 609 for narrow compact showcase, 30 for Energy desk, and one
for Docket; the earlier direct geometry/color adjudication still applies. Other scenarios have
no incomplete checks. Logs are `/tmp/ticket30-final-check-green.log`,
`/tmp/ticket30-final-package.log`, `/tmp/ticket30-final-showcase.log`, and
`/tmp/ticket30-final-accessibility.log`.

All Ticket 30 checks have representative passing evidence. The focused Orca/Firefox checklist
is complete, and no additional application walkthrough is required. Temporary screenshots were
removed after inspection. This closes hardening; stable release acceptance and publication are
separate work.
