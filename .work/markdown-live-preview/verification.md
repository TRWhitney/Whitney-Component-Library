# Markdown Live Preview verification

## Repository and package checks

- `npm run check` passes 1,041 tests across 74 files, formatting, ESLint, Stylelint, strict types,
  generated guidance, TypeScript 5.9/6/7 declarations, and chart/editor bundle isolation.
- `npm run verify:package` passes packed React 18.3.1 and 19.2.8 SSR, hydration, declaration, and
  browser-build checks. The fixture exercises all three Markdown modes.
- `npm run showcase:build` passes. Its existing bundle-size advisory reflects the complete catalog.
- No public declaration exposes editor or parser types. Ordinary component bundles omit the
  Markdown engine and parser.

## Acceptance evidence

| Accepted behavior                      | Evidence                                                                                                                                                                                                                                                                                                                                                                                                |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| In-place syntax and one Markdown value | Public tests render headings, emphasis, strikethrough, code, links, images, tasks, lists, nested quotations, tables, horizontal rules, footnotes, and wiki targets. Form data retains the source. Browser inspection confirms one contenteditable representation and literal HTML.                                                                                                                      |
| Relevant source reveal                 | Tests and direct browser operation enter inline constructs and tables. Other inline constructs remain formatted. Table source is reachable from above and below with arrow keys. Selection across blocks reveals crossed source.                                                                                                                                                                        |
| Editing and history                    | Chromium and Firefox type, undo, redo, and perform native clipboard copy/paste while retaining exact Markdown. Public tests exercise Backspace deletion. Mode transitions keep the same source session. Public tests cover controlled ownership, external replacement, form reset, native/ARIA validation, and rejected edits.                                                                          |
| Parsing and layout stability           | Tests cover empty headings, unfinished fences/markup, escapes/entities, nested quotations, reference context, mapped later positions, and retained image DOM during unrelated edits. Ordinary paragraph edits use cached document structure; structural changes use the full parser.                                                                                                                    |
| Composition                            | Chromium's browser input protocol composes Japanese text and commits `日本` in Live Preview without corrupting the canonical value. Presentation remains mapped and unchanged while composition is active. This does not claim coverage of every operating-system IME.                                                                                                                                  |
| Accessible representation              | Direct DOM and Chromium accessibility-tree inspection show one named multiline textbox, semantic heading/list/table structure, and connected mode, cursor, description, and state text. Replaced source does not add a second accessible document. Tab leaves the editor.                                                                                                                               |
| Reachability and appearance            | Browser operation and inspected captures cover compact and wide layouts, light/dark appearance, forced colors, reduced motion, bidirectional text, and long lines. The 390px headless viewport has a 306px editing area with equal client and scroll width; direct inspection also fits a 282px editing area inside a 293px field. The existing accent focus token updates with the application accent. |
| Field states                           | Both browsers reject typing in read-only, pending, and locked states. Existing field state tests remain green. Stronger visible read-only/lock styling is explicitly deferred to Ticket 27 at Whitney's request.                                                                                                                                                                                        |
| SSR, types, contracts                  | All three modes hydrate without duplicate accessible editors. Packed consumers prove React 18/19 compatibility. Public type tests accept live-preview, reject arbitrary modes, and require livePreview in complete label overrides. Canonical guidance and the rendered specimen describe the delivered behavior.                                                                                       |

## Responsiveness workload

The document contains 115,392 characters, 1,200 sections, headings, emphasis, ordinary links, and
wiki links. It enters the editor through native clipboard paste. Five single-character edits
measure input dispatch to the following animation frame; five arrow movements measure key dispatch
to the following frame. The recorded local budget is 200ms per sampled interaction and two seconds
to enter Live Preview. This is a workstation check, not a hardware-independent guarantee.

| Browser  | Input-to-frame samples, ms    | Selection-to-frame samples, ms | Enter Live Preview, ms |
| -------- | ----------------------------- | ------------------------------ | ---------------------- |
| Chromium | 106.2, 68.6, 49.0, 65.3, 48.7 | 21.1, 18.5, 16.6, 16.6, 31.8   | 278.9                  |
| Firefox  | 65, 29, 21, 34, 47            | 41.0, 66.6, 29.3, 34.0, 33.4   | 335.1                  |

Both runs meet the recorded bounds and report no page errors. The same runs verify table entry
with arrow keys from both directions, native clipboard behavior, live table HTML/URL safety,
field-state editing prevention, and text entry at 200% CSS zoom.

The browsers use installed Playwright Chromium 1228 and Firefox 1532 distributions on this Linux
workstation. Desktop is 1280×900; compact is 390×844. The zoom check uses 200% CSS zoom and performs
actual text entry at that scale. Full browser zoom and manual screen-reader release coverage remain
with Ticket 30.

The initial automation tried inserting the whole 115 KB document as one native keyboard-text
operation. Chromium stalled before the editor's input/parsing callbacks. The final bulk-input
check uses native copy/paste, which exercises the editor's clipboard path. Initial full-document
parsing also exceeded the Firefox interaction budget. Paragraph-level updates reduced that cost;
structural edits still invoke the complete Markdown parser.

## Delivery review corrections

Independent intent review found that Shift-clicking a rendered block collapsed the selection.
Independent engineering review found that table footnotes used local numbering. Both findings
were admitted and corrected. Widget entry now preserves the original anchor for Shift-click, and
widget footnotes use the document-wide numbering map.

Two public regressions failed before the corrections and pass afterward. The focused Markdown
suite passes 29 tests; the complete repository check passes 1,038. Fresh Chromium and Firefox
runs extend selection from within `Before` across `**Middle**` into a table cell without changing
the Markdown value. Both render the second footnote as `2` inside the table, matching reading
Preview and the definitions. Inspected captures show the extended selection and consistent
numbering. Neither browser reports a page error. The original responsiveness evidence remains
applicable because these corrections affect widget pointer selection and footnote labels.

Independent intent and engineering correction reviews both pass with no findings. Each review
remained read-only and covered the admitted findings, corrections, and affected conclusions.

## Inactive footnote presentation

Inactive footnote definitions use the reading renderer's section heading, numbered list, and
return markers, with the same label overrides and typography. Definitions remain at their source
positions. Clicking an entry reveals its original Markdown; moving the caret off that definition
restores its rendered form while the editor remains focused. Return markers follow editing-mode
link behavior and enter source rather than navigate.

Three focused regressions cover the missing section presentation, repeated-reference updates,
and numbering when a definition refers to another footnote. Each failed before its correction.
The Markdown suites pass 32 tests; `npm run check` passes
1,041 tests and all configured formatting, lint, type, generated-guidance, and isolation checks.
Fresh Chromium and Firefox runs compare the actual showcase footnote with reading Preview,
including its number, text, 14px entry type, and 22.4px heading. Inspected dark/wide and light/compact
captures show the restored hierarchy without overflow. Direct browser operation also verifies
source entry and restoration while focused on another line. Both browser runs report no errors. The nested-reference fixture also displays matching
reference and entry numbers in both browsers. Independent engineering review identified that
numbering mismatch; the reference map now follows reading order, visiting the main document
before the contents of referenced definitions. Bounded independent intent and engineering
correction reviews both pass with no findings.

## Remaining ownership

Ticket 26 owns formatting commands, typing shortcuts, wiki navigation, assets, and extensions.
Ticket 27 owns the consumer integration and deferred state styling. Ticket 30 contains Whitney's
scrollbar, appearance-control, and chart-showcase cleanup notes and the wider release hardening.
