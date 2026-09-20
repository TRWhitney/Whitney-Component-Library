# Manual screen-reader exercises

Status: the focused library screen-reader checklist passes in Orca/Firefox. Manual coverage
is organized by distinct library interactions, not by test application. Browser zoom remains
a separate validation item. Automated DOM and accessibility-tree checks do not establish speech.

## Ubuntu setup

This machine has Ubuntu 24.04 and Orca 46.1 installed. Use the desktop Firefox browser.
Press Super+Alt+S to turn Orca on or off. Super is usually the Windows-logo key.
Open Firefox after enabling Orca. If Firefox was already open and does not announce page content,
restart Firefox after saving any work.

Use Tab and Shift+Tab to move among controls, Enter or Space to activate them, and Escape to
close temporary content. Orca has browse and focus modes; record the mode if an arrow key reads
page content instead of operating a widget. See the
[Ubuntu 24.04 introduction](https://ubuntu.com/desktop/docs/en/24.04/tutorial/get-started-with-the-screen-reader/)
and [Orca help](https://help.gnome.org/orca/).

For each exercise, record pass or fail, Firefox version, any unexpected spoken output, and the
control where it occurred. Exact wording can vary. Names, roles, values, states, relationships,
and the outcome must remain understandable without looking at the page.

## Component exercises

Start `npm run showcase`, then open the links below in Firefox.

| Exercise                                             | Actions and expected information                                                                                                                                                                                                                                | Result                                                                          |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [Compound fields](http://localhost:5173/#date-field) | Tab through Run date's segments and change the day with arrow keys. Hear the field and segment names and current values. Visit Review window under DateRangePicker, open its calendar, choose endpoints, and hear the selected interval.                        | Passed: date segments and selected range                                        |
| [Select](http://localhost:5173/#select)              | Open Run mode, move to another enabled option, select it, reopen, then Escape. Hear the label, expanded state, option names and selected value. Focus returns to the trigger.                                                                                   | Passed: selection, cancellation, and focus return                               |
| [ComboBox](http://localhost:5173/#combo-box)         | Type into Find run mode, inspect matches with arrows, choose one, then try a query with no matches. Hear the query, available options, selection and empty result.                                                                                              | Passed: counts, option navigation, selection, and empty results                 |
| [Overlays](http://localhost:5173/#dialog)            | Open Edit run name and then Inspect current run. Close the nested drawer and dialog. Hear each dialog name and content; focus remains inside the active overlay and returns to its opener. Under AlertDialog, cancellation is initially focused.                | Passed: nested dialogs and confirmation cancellation                            |
| [Collections](http://localhost:5173/#list-box)       | Select a list option; visit Table and navigate rows and sortable headers; visit Tree and expand a branch. Hear selection, column context, hierarchy, and expanded states. Filter to an empty result and recover.                                                | Passed: ListBox, Table, Tree, and search-result announcements                   |
| [Navigation](http://localhost:5173/#tabs)            | Use arrows in Run details, then Enter to activate Inputs. Hear the selected tab and associated panel. Expand a disclosure and collapse Workspace navigation; its separate New document action stays reachable.                                                  | Passed: tabs, disclosure reading, and navigation pane                           |
| [Charts](http://localhost:5173/#line-chart)          | Focus a chart plot, move across readings with arrows, select a reading, open its details, and open the full data table. Repeat on a pie chart and heatmap. Hear category, series, value, units, selection and missing values without relying on color or hover. | Passed: line, pie, and heatmap readings, selection, details, and tables         |
| [Markdown](http://localhost:5173/#markdown-editor)   | Enter text, select a word, apply Bold, undo, and switch among Source, Live Preview and Preview. Read a link and table; enable read-only and locked states. Hear the editor label, content and editing restrictions; retain the text and selection across modes. | Pass: editing, Preview text/links/tables, and read-only/locked access confirmed |

## Supplementary fixture evidence

These fixtures are test artifacts. Their workflows remain useful for automated integration
checks, but are not separate manual screen-reader acceptance gates. Existing results below
are retained as evidence. Fieldnotes and Docket walkthroughs are removed from the manual plan;
a future manual request must identify a distinct, still-unverified library interaction.

| Fixture           | Run and path                                                                                                                                                                                                                                                                                        | Result                                                                                              |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Operational proof | `npm run prototype:operational`, http://localhost:5179. Submit empty configuration, hear the error, enter a name, validate, review, accept, run, then read stages and progress.                                                                                                                     | Pass: actionable validation, review details, acceptance, and running progress confirmed             |
| Energy desk       | Built consumer currently at http://localhost:5184. Restart with `npm run prototype:analysis` at port 5174. Find a building, inspect chart readings, compare buildings, add an investigation and export it. Try loading failure and recovery through Prototype settings.                             | Pass: selection, readings, comparison, investigation, export, and failed-refresh recovery confirmed |
| Fieldnotes        | Built consumer currently at http://localhost:5186. Restart with `npm run prototype:markdown` at port 5176. Open a document, edit and save, move into publication review, mark documents reviewed, and export the guide.                                                                             | Not required as an application walkthrough                                                          |
| Docket            | Built consumer currently at http://localhost:5187. Restart with `npm run prototype:workbench` at its reported port. Another existing server occupies 5177. Edit a document, save, mark ready, review the packet and export it. Simulate a save failure using Demo controls, recover and save again. | Not required as an application walkthrough                                                          |

## Browser zoom

Use actual browser zoom at 200% and 400% on representative library examples.
Do not repeat application workflows or check every field. Text and controls must remain reachable, focus visible, and
local scrolling deliberate. Reset to 100% afterward. Record the window dimensions and
zoom level with any failure. Automated narrow viewports test reflow but do not establish
actual browser zoom behavior.

Result: pass. Native Chromium zoom at 200% and 400% covered representative library controls, overlays, Markdown, tables, charts, and status layouts. The selection-list clipping defect is fixed. See [zoom evidence](verification.md#actual-browser-zoom-and-final-visual-evidence-2026-09-20) for dimensions, observations, and browser limits.

## Recorded results

The observations below preserve session history. The completed checklist and checkpoint supersede
earlier pending statements.

2026-09-19: Whitney reported "Speech and selection both work" for the initial Ubuntu
Orca/Firefox exercise at `http://localhost:5173/#select`. This confirms speech while tabbing,
opening Run mode, changing the selection with arrow keys and Enter, and hearing the selected
value. Whitney then confirmed that reopening, moving to another option, and pressing Escape preserves the original selection and returns focus to Run mode with an Orca announcement.
The desktop Firefox version has not been recorded. All other exercises remain unverified.
Pending exercises remain release blockers for Ticket 30.

ComboBox observation: Whitney reports that Orca announces the number of matches and zero
matches for an empty result, but does not announce individual matches "unless I select them."
Whitney clarified that Orca reads each option while moving through matches with arrow keys,
before pressing Enter. Counts, option navigation, selection, and empty-result feedback pass.

DateField observation: Whitney confirms announcements for Run date, its segments, and
changed values. The full date is spoken when changing the month. The DateField exercise
passes. Whitney also confirmed that DateRangePicker distinguishes the start and end dates
and announces the selected range. Both compound-field exercises pass.

## Session checkpoint

The focused library screen-reader exercises pass. Operational and Energy desk results supply
additional evidence for status announcements and component composition. Whitney clarified that
fixtures are test artifacts, so Fieldnotes and Docket manual walkthroughs are not required.
The previous thirteen-group count is superseded. Library visual/zoom validation and Ticket 30
evidence reconciliation are complete. No further manual exercise remains.

Nested-dialog observation: Whitney confirmed that Orca announces both dialog titles, Tab
stays inside the active overlay, and Escape returns focus to each opener. Whitney also confirmed that AlertDialog announces the confirmation, initially focuses Cancel,
and returns focus to the opener after cancellation. The overlays group passes.

ListBox observation: Whitney confirmed that Orca announces each option during arrow-key
navigation and distinguishes the selected option after Space. Table, Tree, and collection
filter recovery remain pending.

2026-09-20: Whitney confirmed that Orca identifies cell values and column names in Filtered
run results and announces sorting changes. Table passes. Tree and collection filter recovery
remain pending.

2026-09-20 Tree result: Whitney confirmed hierarchy navigation, expansion, and selection.
Search did not announce result counts or no results. Reproduction found no search-result live
region in the example. The application-owned filtering example now keeps a named, atomic
status region mounted for count, no-results, and recovery updates. Automated checks verify
updates and retained search focus. Whitney confirmed the Orca retest: Elm announces one match, zzzz announces no matching
buildings, and clearing the query announces three matches. The speech failure is resolved
and the collections group passes.

2026-09-20 navigation observation: Whitney confirmed Tabs and CollapsibleNavigationPane.
Disclosure expansion and collapse work, but Whitney has not found how to read the revealed
text. Firefox's accessibility snapshot contains the named region and full paragraph. This
establishes exposure, not successful Orca reading. Next try Down from the expanded trigger
in Orca browse mode; Orca modifier+A toggles browse/focus modes. Whitney subsequently confirmed that reading works using the modifier and Down Arrow.
The disclosure reading check passes. No component change was needed.

Line-chart observation: Whitney confirmed that arrow-key readings in Thermal demand announce
the month, Demand/Capacity values, and MWh units. Selection, details, the data table, pie,
and heatmap exercises remain pending.

Whitney confirmed line-chart selection announcements and reading the month, series values,
and units in both details and Monthly energy data. The line-chart exercise passes. Pie and
Heatmap remain pending.

PieChart observation: Whitney confirmed category, value, MWh, percentage-share, and selection
announcements, plus readable details and Annual energy use by customer category table data.
PieChart passes; Heatmap remains pending.

Heatmap observation: Whitney could reach the hide buttons but could not identify the plot
focus stop, including after trying Insert+A. Firefox keyboard inspection shows the named
Room temperature group is immediately before Hide time Morning in Tab order. Ask Whitney
to reach that button, press Shift+Tab once, and use Shift+arrows in Orca focus mode. Heatmap
entry and the remaining Heatmap exercises stay unverified. No component behavior change was needed. The showcase instructions now explain plot entry
and Shift+arrow reading navigation. Plain arrows pan when exploration is enabled.

Heatmap diagnostic correction: the initial plain-Right probe retained the first reading because
unmodified arrows are assigned to panning by the accepted exploration contract. Shift+Right
advances to North room, Midday, 18 °C. This passes in Chromium, Firefox, and WebKit. From Hide
time Morning, Shift+Tab focuses the named plot. The user-facing help and browser regression
now cover this distinction. Manual Orca entry/readings still require confirmation.

Whitney confirmed that Heatmap reading works with Shift+arrows after the plot-entry sequence.
The Midday 18 °C reading passes. Zero versus missing values, selection, details, and the
Heatmap data-table reading still require confirmation.

Whitney confirmed Heatmap distinguishes zero from missing readings, announces selection,
and exposes readable details and Room readings by time of day table data. Heatmap and
the charts group pass.

Markdown observation: Whitney initially reported the editing/mode exercise worked, then
corrected that report because text was not being read after mode changes. The earlier
mode-reading pass is withdrawn. Whitney identified Preview: after tabbing to the document,
arrows and Insert+A did not expose readable text. Preview had a focusable generic region.
It now exposes a named document, the ARIA reading context for static content within a widget.
Whitney reloaded, chose Preview, tabbed to Markdown review notes, and used Down.
Whitney confirmed: "It reads the document text." Preview reading now passes in Orca.
Whitney also confirmed Preview table headers/cells and link identification both work.
Whitney confirmed both Source states work: Read-only and Locked remain readable, expose the
access restriction, and prevent typing from changing the document. Markdown passes.

Operational observation: Whitney reported speech was hard to understand because "pending"
repeated two or three times after each action. DOM inspection found "Review pendingPending"
and "Solve pendingPending". The caller repeated status words in stage names, and the tracker
announced the full list alongside the overall StatusIndicator. The fixture now uses stable
Configuration, Review, and Solve labels; ProcessTracker separates labels/descriptions/status
with whitespace, and only the overall status announces transitions. The complete keyboard
and touch workflow passes in three engines. Orca clarity and manual workflow remain pending.

Operational retest: Whitney heard only "Needs input", with no explanation. This is not a pass.
The overall StatusIndicator now exposes the actionable message "Enter an operation name before
review." Successful validation announces review readiness; acceptance announces that Run operation
is ready; running announces 18 of 25 boundary passes solved. Whitney confirmed the empty-name
validation retest "sounds good now." The missing-name announcement passes. Successful
validation, review details/acceptance, and running-stage/progress speech still need confirmation.
No new manual group is complete yet.

Whitney confirmed the successful operational path works: named validation, readable review
details, acceptance, and the running announcement with 18 of 25 boundary passes solved.
Together with the missing-name retest, the operational workflow passes.

Energy desk: Whitney confirmed searching for and selecting North Library, then reading the
Monthly energy use plot with Shift+arrows. Orca identifies the building, months, values, and
units clearly. Comparison, investigation export, and failure/recovery remain pending.

Energy desk: Whitney confirmed North Library/Birch Hall comparison readings, investigation
controls, and export confirmation speak clearly. Only failed-refresh recovery remains in this group.

Energy desk: Whitney confirmed the failed-refresh announcement, successful Retry announcement,
and preservation of comparison and investigation work. The complete Energy desk group passes.
