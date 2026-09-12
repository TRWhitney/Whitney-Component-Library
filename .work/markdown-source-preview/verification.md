# Markdown source and preview verification

## Repository and package evidence

- `npm run check` passes 1,027 tests across 73 files, Prettier, ESLint, Stylelint, strict
  TypeScript, generated guidance, TypeScript 5.9/6/7 declarations, and chart/editor isolation.
- `npm run verify:package` passes clean packed SSR, hydration, types, and browser builds with
  React 18.3.1 and 19.2.8. The consumer exercises both Markdown source and footnote preview.
- `npm run showcase:build` and `git diff --check` pass. The showcase build retains its existing
  bundle-size advisory because it intentionally imports the complete component catalog.
- The ordinary Button bundle excludes private Markdown editor and parser modules. A recursive
  check of declarations reachable from the public entry finds no private Markdown dependency.

## Acceptance evidence

| Accepted behavior                    | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Markdown string is canonical         | Public integration tests cover controlled and uncontrolled values, rejected controlled edits, external replacements, unfinished markup, mixed line endings, and exact change events through insertion and undo. Native textarea form serialization follows browser newline conventions.                                                                                                                                                                                                                              |
| Selection, history, clipboard, forms | Tests and direct Chromium operation preserve the source control across reading mode, then undo and redo edits. Chromium and Firefox retain cursor context through mode changes and leave the editor with Tab. Firefox native Control+C/Control+V reproduces the selected Markdown exactly; Chromium paste takes plain text even when HTML is supplied. Native required validation focuses the visible control; external form reset, canceled reset, owner-rejected reset, and cleared history have regression tests. |
| Safe accepted syntax                 | Tests render headings, emphasis, tasks, tables, footnotes, and wiki targets, and reject executable HTML and unsafe URL schemes. Wiki tests preserve prose around targets and leave escaped/code-contained brackets literal. Browser inspection covers lists, quotes, fenced code, safe links, the loaded local image, tables, footnotes, and literal HTML. Footnote IDs and descriptions resolve within their own instance.                                                                                          |
| Field states                         | Required/native and ARIA validation, inherited disabled state, pending, locked, and read-only states have public tests. Both browsers reject typing in read-only, pending, and locked source. Disabled reading links have no destinations while document content remains accessible. Tab remains available when a focused editor becomes disabled.                                                                                                                                                                   |
| Accessible relationships and modes   | Direct DOM and Chromium accessibility-tree inspection show one visible document representation, a named source textbox or preview region, heading/list/table semantics, and connected mode, position, description, error, and lock text. The hidden form bridge and inactive source do not add an accessible duplicate.                                                                                                                                                                                              |
| SSR and hydration                    | Public tests hydrate deterministic source and semantic reading content. Packed React 18/19 consumers emit no warnings or recoverable hydration errors. The JSDOM fixture supplies browser globals and empty text geometry; actual caret and layout evidence comes from browsers.                                                                                                                                                                                                                                     |
| Appearance and compact layout        | Direct operation and inspected images cover light/dark source and reading, disabled preview, invalid and locked source, and forced colors with reduced motion. At a 390px viewport the editor occupies 308px in the headless checks and has equal client/scroll width. The interactive preview also fits its 293px container without horizontal overflow. Mode/position precede support copy; lock text has its own row.                                                                                             |
| Composition                          | Chromium's browser input protocol sets a Japanese composition and commits `日本` in the controlled source editor. The resulting canonical value retains the committed text. This is browser-level composition evidence, not manual coverage of every operating-system IME.                                                                                                                                                                                                                                           |

## Basic large-document responsiveness

The development showcase uses a 115,392-character document with 1,200 sections, emphasis, ordinary
links, and wiki links. Five single-character edits measure dispatch to the following animation
frame. The intended basic bounds are 100ms per sampled edit and two seconds to switch to reading.
This is a bounded responsiveness check, not a hardware-independent throughput guarantee.

| Browser  | Five input-to-frame samples, ms | Switch to preview, ms |
| -------- | ------------------------------- | --------------------- |
| Chromium | 93.8, 45.3, 43.5, 38.2, 39.4    | 546.8                 |
| Firefox  | 34, 36, 6, 4, 7                 | 723.4                 |

Both browser runs report no page errors. The Firefox synthetic ClipboardEvent constructor strips
the supplied clipboard data, so its final clipboard check uses actual copy-and-paste keystrokes.
The browser test used installed Chromium 1228 and Firefox 1532 Playwright distributions on this
Linux workstation, a 1280×900 desktop viewport, and a 390×844 compact viewport.

## Limits and future ownership

Live Preview and its decoration/selection performance belong to Ticket 25. Formatting shortcuts,
wiki navigation, and assets belong to Ticket 26. Manual screen-reader operation and the wider
release browser matrix remain in Ticket 30. No claims here replace those acceptance gates.

## Independent delivery review

The complete outcome received separate read-only intent and engineering reviews. Intent passed
with no findings. Engineering identified one controlled-value defect: a repeated rejected edit
could remain visible. The public regression test reproduced that failure before the correction.
An explicit reconciliation revision now schedules owner-value restoration on every edit attempt
and form reset. All 18 Markdown tests and the complete `npm run check` pass after the correction.
Direct Chromium and Firefox checks each repeat the same rejected edit three times and confirm
that both visible source and submitted form data retain the owner's value, with no page errors.
Packed React 18.3.1 and 19.2.8 verification also passes after the correction.
The independent engineering correction review passes with no remaining findings. Both review
axes pass, with no unresolved judgments or follow-ups.
