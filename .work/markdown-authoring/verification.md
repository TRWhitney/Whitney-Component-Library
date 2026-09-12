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
