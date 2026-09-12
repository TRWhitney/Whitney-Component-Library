# Verification

## Command slice

The public editor regressions first failed without the command API. Subsequent public regressions
exposed whitespace wrapping, Setext heading removal, strike toggling, caret rule insertion,
quotation exit, literal fence availability, active rule state, and toolbar availability after
read-only changes. Each passed after its correction. Coverage lives in
`tests/markdown-commands.test.tsx` and `tests/markdown-command-boundaries.test.tsx`.

`npm run check` passes all 1,078 tests across 76 files, formatting, code and style lint, strict
TypeScript, generated guidance, the TypeScript 5.9/6/7 public declaration matrix, and chart/editor
bundle isolation. `npm run showcase:build` and `git diff --check` pass.
A later CSS-only correction limits toolbar controls to the available width. Style lint,
formatting, the browser command checks, and package verification are repeated for that correction;
JavaScript and type evidence remains applicable.

Chromium and Firefox command checks exercise selection-preserving toolbar and keyboard actions,
undo/redo, link destination editing, list and quotation continuation/exit, literal code, mode and
field-state changes, active controls, keyboard toolbar traversal, and heading-menu focus return.
The Chromium touch check taps Bold after selecting text. Dark/wide, light/390px, forced colors,
reduced motion, and 200% zoom are inspected for wrapping and containment.
Direct collaborative-browser operation confirms selected `Review notes` becomes
`**Review notes**`, remains selected, activates Bold, and returns focus to the document.
Control-Z restores both text and selection. DOM inspection confirms toolbar semantics and
293px content/scroll widths. At 200% zoom, the corrected toolbar is 105px wide with no overflow;
More formatting wraps onto two lines. Inspected screenshots are discarded.

The retained Live Preview browser workload also passes in Chromium and Firefox, including native
clipboard, table reveal, literal HTML/unsafe URLs, mixed-direction text, mode/undo continuity,
field states, composition, and keyboard exit. For a 115,392-character document, Chromium input
samples are 51–95ms, selection samples 19–34ms, and mode switching 248ms. Firefox input samples are
19–78ms, selection samples 33–35ms, and mode switching 324ms. These stay within the accepted
200ms input/selection and two-second mode-switch budgets. No page errors are reported.

`npm run verify:package` passes packed SSR, hydration, public types, and browser builds with
React 18.3.1 and 19.2.8 after the width correction. The revised command browser checks pass in
both browsers, including the zoom containment assertion.

## Command review corrections

Independent intent and engineering review admitted three objective command defects: a rule on the
empty line after prose became a Setext heading, paragraph conversion exposed optional closing ATX
markers, and a link label containing brackets could fail to render as a link. Public regressions
first produced five failures, with one additional bracket case already passing. After correction,
all 69 tests in the four Markdown suites pass. The corrections add an appropriate rule separator,
remove closing heading syntax during block conversion, and escape unescaped link-label brackets.

Direct browser operation confirms `Alpha\n` becomes `Alpha\n\n---\n` with a rendered rule and
no heading; Mod-Alt-0 changes `# Alpha #` to selected `Alpha`; Mod-K on `a] b` inserts an escaped
label while retaining the `https://` destination selection. The two-browser command script now
also checks the resulting reading-preview rule and link. The updated browser checks pass in Chromium and Firefox without page errors. `npm run check` passes all 1,078 tests and all configured checks after correction.
Both independent correction reviews pass without blocking findings.

A final link-label boundary regression exposed a trailing backslash escaping the generated closing
bracket. The one-line escaping correction preserves existing escape pairs and doubles a lone
trailing backslash. The public regression failed before correction; all 70 Markdown tests pass
afterward. Code lint, strict types, formatting, and diff checks pass. Root directly applied Mod-K
to `path\` and observed `[path\\](https://)` with the destination selected. The previous full
suite, package, performance, style, and browser evidence remains applicable outside that bounded
label correction. Both independent correction reviews pass without blocking findings.

## Wiki navigation

`tests/markdown-wiki-links.test.tsx` initially failed five public cases for missing resolution and
navigation. It now covers callback payloads, safe native reading links, unresolved/literal targets,
keyboard and toolbar activation, read-only/disabled states, labels inside tables and footnotes,
resolver refresh, composition, hydration, and touch. The shared editing/reading suites pass.

Native Chromium touch testing exposed intermittent retargeting: synthesized mouse events could
select text outside the wiki target after its widget revealed source. A public touch-completion
regression failed before correction. A tap now resolves the original widget target on touchend
and suppresses the synthesized mouse event. Scrolling gestures preserve the existing selection.
The 50 tests across wiki, reading/source, and Live Preview pass after this correction.

Direct collaborative-browser inspection confirms resolved targets use a native link with the
application destination and unresolved targets use inert spans. Clicking Boundary review reveals
`[[Boundary review]]` and enables Open link. Activating that control reports the selected note
through the application callback while retaining the source string. Screenshots and DOM inspection
cover dark/light, compact/wide, forced colors, and the touch interaction.

The native Chromium/Firefox script exercises ordinary click, modified click, Mod-Enter, toolbar
activation, reading-preview activation, unresolved targets, disabled state, compact layout, forced
colors, and reduced motion. Chromium also taps the link and Open link in a touch viewport.
The repeated native touch trace confirms the callback and unchanged Markdown after correction.

The 115,392-character workload passes in both browsers. Chromium input samples are 60–101ms,
selection samples 19–33ms, and mode switching 118ms. Firefox input samples are 35–57ms, selection
samples 20–50ms, and mode switching 178ms. No page errors occur. Parsing is shared with Live Preview.

`npm run verify:package` passes SSR, hydration, public types, and browser builds with React 18.3.1
and 19.2.8. `npm run showcase:build` passes. `npm run check` passes all 1,097 tests across 77 files after the touch correction, including
formatting, lint, strict types, generated guidance, public declaration matrix, and isolation.
The final native browser checks pass in Chromium and Firefox. Independent review is pending.

## Wiki review corrections

Independent intent and engineering review admitted nested anchors when wiki syntax appeared in an
ordinary Markdown link label, and native middle-click navigation bypassing the application
callback. Four public regressions failed before correction. The tokenizer now records whether a
wiki target belongs to an ordinary link label; those targets retain the outer link's ownership in
reading, editing, and navigation controls. Rendered wiki links intercept middle-button activation.

All 56 tests in wiki, reading/source, and Live Preview pass, including inline/reference outer-link
SSR/hydration, disabled wiki actions inside ordinary labels, and middle-click callback/default
prevention. Direct browser inspection confirms one native anchor with the original destination for
`[See [[Boundary review]]](https://example.com)`. Native Chromium/Firefox checks include middle-click
callbacks with no extra tab and a single reading-preview anchor for the nested example.
`npm run check` passes all 1,103 tests and all configured checks. The revised native browser
checks pass in Chromium and Firefox. Both independent correction reviews pass without blocking findings.

## Asset acquisition

Public integration tests cover accepted files, callback-only Markdown insertion, pending typing,
range mapping, isolated undo, retry, rejection, noneditable states, controlled replacement and
rejection, reset, and ignored late results. Initial acquisition tests observed 7 expected failures;
additional boundary tests observed caret theft and replacement of newly inserted text inside a
captured selection. Both corrections now pass. The two asset suites pass all 21 tests.

`npm run check` passes all 1124 tests in 79 files, formatting, both linters, generated contracts,
TypeScript 5.9/6/7 declarations, and ordinary component bundle isolation. `npm run verify:package`
passes packed React 18.3.1 and 19.2.8 SSR, hydration, types, and browser builds. The production
showcase build passes.

Chromium and Firefox operated the actual showcase with file paste, coordinate-targeted drop,
pending typing elsewhere, preserved caret, isolated undo, failure/retry, and rejected file
feedback. Browser-created File/DataTransfer objects entered native events; Firefox ignores the
ClipboardEvent clipboardData initializer, so its synthetic paste event explicitly supplied that
browser boundary property. Neither browser reported page errors. Ordinary text clipboard behavior
was also retained in the existing Live Preview interaction run.

Direct preview operation reproduced failure and dismissal in Live Preview and inspected the
associated alert/description relationship. Inspected screenshots cover pending and error in dark
appearance, narrow light appearance, and forced colors with reduced motion in both browsers.
Feedback has a separate row below the field description; recovery buttons wrap without clipping.
Screenshots are removed after inspection. The 115392-character interaction run retains the
200 ms input/selection and 2-second mode-switch budgets; current measurements are recorded below.

The canonical component contract, generated documentation, public declaration fixtures, packed
consumer example, and human-facing Markdown specimen describe the callback and recovery boundary.

Chromium measured input 61–103 ms, selection 18–35 ms, and Live Preview switching 113 ms.
Firefox measured input 26–51 ms, selection 29–51 ms, and Live Preview switching 208 ms.

Independent asset intent review passed without findings. Engineering review found that Live Preview
widgets suppressed file drops before the acquisition handler. Public image/table/code tests now
cover consumed dragover and drop. The table/code drop checks and all three dragover checks first
failed, then passed after allowing acquisition events through widgets and admitting file drags.
The affected asset, Live Preview, and wiki suites pass 62 tests. A Chromium native file drag through
CDP now enters, hovers, and drops onto each rendered image/table/code target and inserts the
callback Markdown. Firefox tests send all three events to those exact rendered descendants and
also pass. Direct preview operation confirmed consumed acquisition events and rendered insertion.

A concurrent full-suite run exceeded the existing five-second timeout in a Drawer showcase test.
That unchanged suite passed all 15 tests on repeat. Final full-suite evidence follows the bounded
widget correction. Package and performance evidence remains valid because the correction changes
only file drag admission and widget event filtering.

Final `npm run check` passes all 1127 tests in 79 files after the drag correction, plus formatting,
linters, generated contracts, declaration matrix, and bundle isolation.

Bounded independent intent and engineering correction reviews both pass with no findings.

## Declared extensions

Public extension tests cover shared Preview/Live Preview syntax, literal code and escapes,
validated custom commands and decorations, controlled authority, composition, noneditable states,
link-prefix ownership, conflicts, and malformed declarations. RGBA tests prove the exact authored
value remains in Markdown, renders in both preview modes, and has a source swatch without adding
characters. Invalid color values remain literal. Public regressions caught adjacent-edit rejection,
non-array declarations, reserved shortcuts, and native lowercase shortcut events before correction.

Native Chromium and Firefox checks operate the showcase through inline and fence source reveal,
RGBA rendering, source swatches, the Text color toolbar action and Mod-Shift-E, undo, custom link
navigation, restored documents, narrow layout, appearance changes, and forced colors. Both pass
without page errors. Screenshots of dark/wide, light/390px, forced colors, and selected source are
inspected for wrapping, containment, readable system colors, and source swatches.

The restored-document flow exposed invalid dependency selection mapping when an application or
custom command replaces an entire selected passage. Three public regressions first failed with
crossed endpoints, then passed after transaction filtering collapsed removed selections at the
end of their replacement. Valid selections retain normal mapping. Direct collaborative-browser
operation selected `north`, ran Mod-Shift-E, inspected the RGBA source and swatch, restored the
1046-character example, and confirmed editing controls and rendered color remained usable.

The final full-suite run repeatedly exceeded the existing five-second limit in the showcase test
that exercises eight Drawer placements. Its assertions remained intact; the individual test now
has a ten-second limit. A JavaScript availability callback returning null also has a public failing
regression and correction, so only a boolean is accepted.

Final `npm run check` passes all 1163 tests in 82 files, formatting, both linters, strict types,
generated guidance, the TypeScript 5.9/6/7 declaration matrix, and chart/editor isolation.
`npm run verify:package` passes packed React 18.3.1 and 19.2.8 SSR, hydration, types, and browser
builds. `npm run showcase:build` and `git diff --check` pass.

The isolated 115392-character run measures Chromium input at 58–109 ms, selection at 16–34 ms,
and mode switching at 102 ms. Firefox measures input at 19–69 ms, selection at 33–36 ms, and mode
switching at 153 ms. Both stay inside the accepted 200 ms input/selection and two-second mode
budgets, with no page errors. A discarded run overlapped the full test suite and exceeded the
input budget once; the final performance check runs without concurrent quality workloads.

Both independent extension review axes identified the same missing swatch: entering a table or
footnote exposes the complete block source, but swatches only followed the individual color range.
Two public regressions failed before correction. Source visibility now shares the block definition
with Live Preview and propagates exposed-block state to child colors. All 76 focused extension,
Live Preview, and wiki tests pass. Direct browser operation confirms a swatch with the caret at
the start of both a table and a footnote, with unchanged canonical Markdown.

After correction, `npm run check` passes all 1165 tests in 82 files and all configured checks.
The native table/footnote swatch flow passes in Chromium and Firefox with no errors. Screenshots
confirm visible swatches while the caret remains outside the colored passage. The repeated
115392-character workload measures Chromium input at 60–109 ms, selection at 16–30 ms, and mode
switching at 99 ms; Firefox input at 19–55 ms, selection at 33–51 ms, and mode switching at 141 ms.
All budgets pass. Package evidence remains applicable: the correction changes client-side source
swatch visibility and shares the existing block classification, without changing public types,
SSR output, Preview rendering, CSS, or dependencies.

Both bounded independent correction reviews pass with no findings. Screenshots were removed after inspection.
