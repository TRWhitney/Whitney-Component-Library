# 09 File Trigger and Drop Zone

**What to build:** File-trigger and drop-zone exports that unify keyboard, pointer, native-picker,
paste where applicable, and drag/drop file acquisition without owning upload or storage.

**Blocked by:** [Action Family](03-action-family.md),
[Field and Text Entry Family](04-field-and-text-entry-family.md)

**Status:** complete

- [x] Accepted file types, multiplicity, size guidance, disabled, invalid, pending, and rejection
      behavior are explicit.
- [x] Keyboard and pointer users can open the native picker through correctly named actions.
- [x] Drag enter, leave, drop, rejection, and focus states are distinct without color-only meaning.
- [x] File objects remain consumer-owned and no upload or persistence behavior is implied.
- [x] Form, reset, validation, and announcement behavior is deterministic.
- [x] The APIs compose with the Markdown asset-insertion callback without specializing themselves
      to Markdown.
- [x] Touch, keyboard, browser accessibility-tree, theme, forced-color, SSR, hydration, and type
      checks pass.

## Accepted sources

- [Specification](../spec.md)
- [Markdown Editor Scope](../decisions/12-markdown-editor-scope.md)
- [Behavior and Accessibility Foundation](../decisions/03-behavior-foundation.md)

## Completion evidence

- `npm run check` passes formatting, lint, strict types, 238 tests, generated guidance, exact
  contract coverage, public examples, and the TypeScript 5.9/6/7 declaration matrix.
- `npm run verify:package` passes packed React 18.3.1 and 19.2.8 SSR, hydration, type, subpath, and
  browser-bundle consumers; `npm run showcase:build`, the high-severity audit, the no-`Any` scan,
  and `git diff --check` pass.
- Chromium direct operation covers keyboard, pointer, and touch picker activation, accepted and
  rejected files, native file drag enter/drop, plain-text drag rejection, normalized drag
  constraints, drop source after an unrelated picker paste, stable drop-affordance naming and
  descriptions, compact and wide rendering, dark and light appearance, forced colors, reduced
  motion, live status, focus, and the accessibility tree without console or page errors.
- Firefox and WebKit direct operation covers keyboard picker activation, rejected picker files,
  focused file paste, compact light rendering, live status, and accessibility-tree state without
  overflow, console errors, or page errors. Inspected screenshots were discarded after validation.
