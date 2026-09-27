# Independent lifecycle checker

The checker was written from the frozen lifecycle protocol and briefs, with the earlier
board-inspector checker used only as an infrastructure reference. No trial source or rendered
output was inspected before freezing. The coordinator reported that one condition used native
controls while this checker was being finalized; that observation did not change the checks.

Run `node check.mjs <app-directory> <evidence-directory> <port> initial|maintenance`.
The checker starts Vite directly with `--strictPort` and terminates only its own child. It does
not build, change or repair the app. Evidence includes scenario and individual check results,
page errors, screenshots, geometry, computed contrast, focus samples and the server log.
Each scenario gets a fresh browser page. Both widths run; maintenance repeats in dark and light.

The checks use public accessible roles and the brief's names. They accept native and package
controls. Repeated same-name duplication, insertion order, editing and deletion isolation test
observable identity behavior. The checker does not infer data IDs from DOM IDs. Stable data IDs,
appearance API use and forbidden private overrides need source review.

Computed contrast composites transparent ancestor colors over the default white canvas. A
sample with ancestor opacity, background images or gradients, filters or text shadows remains
unverified. Disabled controls, placeholders, generated content, SVG, canvas and hidden text
are outside this computation. Screenshot review must cover those cases. A computed pass is not
an accessibility audit. Text smaller than the large-text threshold needs 4.5:1; large text needs
3:1. Tab and Shift+Tab containment each use ten presses per dialog.

Screenshots and computed focus styles preserve evidence of keyboard focus; an outline string
alone does not establish that focus is visibly distinct. Human review also owns palette,
hierarchy, spacing, item/page separation, action distinction, useful descriptions and whether
identify labels use meaningful stable region names. Identify mode geometry and hover/focus
screenshots are recorded, but the checker does not prescribe tooltip markup.

Count recognition uses the brief's visible/total phrase, such as `2 of 3 items`. Desktop article
width and centering serve as the observable proxy for the specified content max-width. Review
an unexpected failure against the actual brief before sending correction requests. Scenario
steps after a failed prerequisite remain unverified. Infrastructure failures also remain
unverified. App setup failures and page errors count as failures. Exit code 1 means a measured
failure or infrastructure error; unverified rendering samples alone do not cause it.

Any evaluator correction after freezing must be recorded here and applied to both conditions.

## Evaluator corrections

The initial frozen script hash was
`6816fa566517c8a6e78e5ad557a2d0f014ef435df86499d50d107c42f418a8fc`.
The first native run exposed a case-sensitive category check against `innerText`. CSS uppercase
rendering changed `Shelter` to `SHELTER`, which meets the brief. Category comparisons, including
copied metadata, now ignore case. This is an evaluator correction and applies to every condition.
No app source changed. Original evidence remains under its original evidence path.

The excluded installed-library attempt rendered the heading `Trail kit.`. An exact heading
match in every scenario's setup prevented unrelated behavior checks. Setup now waits for the
required search control; the baseline retains its explicit heading check. This correction also
applies uniformly. It avoids treating heading punctuation as a prerequisite for editing and deletion checks.
The coordinator confirmed that a terminal decorative period meets the heading requirement;
the baseline now accepts either `Trail kit` or `Trail kit.` uniformly.

Before inspecting the explicit-library initial build or either maintenance output, the
coordinator identified two further assumptions in the checker. Invalid-name rejection may
legitimately disable Save, so the invalid-value scenarios now activate Save only when enabled,
then check that the dialog remains open and the item unchanged. The evidence records whether
Save was disabled. Checkbox and switch implementations may expose a visually hidden but
keyboard-focusable native input; all appearance changes now focus the accessible control and
press Space, then verify that checked state changes. These changes apply to both conditions.
The earlier native initial run used an enabled Save and did not test appearance switching, so
its existing results are unaffected. No new trial output informed these corrections.

The corrected checker SHA-256 is
`9efc649eefce0bf87fd8395c1f4c7227f521c01ae5e9337cdbd4d219e983403a`.
Syntax, ESLint and Prettier checks pass.
