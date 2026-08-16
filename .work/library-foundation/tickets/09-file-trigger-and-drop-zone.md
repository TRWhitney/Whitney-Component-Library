# 09 File Trigger and Drop Zone

**What to build:** File-trigger and drop-zone exports that unify keyboard, pointer, native-picker,
paste where applicable, and drag/drop file acquisition without owning upload or storage.

**Blocked by:** [Action Family](03-action-family.md),
[Field and Text Entry Family](04-field-and-text-entry-family.md)

**Status:** blocked

- [ ] Accepted file types, multiplicity, size guidance, disabled, invalid, pending, and rejection
  behavior are explicit.
- [ ] Keyboard and pointer users can open the native picker through correctly named actions.
- [ ] Drag enter, leave, drop, rejection, and focus states are distinct without color-only meaning.
- [ ] File objects remain consumer-owned and no upload or persistence behavior is implied.
- [ ] Form, reset, validation, and announcement behavior is deterministic.
- [ ] The APIs compose with the Markdown asset-insertion callback without specializing themselves
  to Markdown.
- [ ] Touch, keyboard, screen-reader, theme, forced-color, SSR, hydration, and type checks pass.

## Accepted sources

- [Specification](../spec.md)
- [Markdown Editor Scope](../decisions/12-markdown-editor-scope.md)
- [Behavior and Accessibility Foundation](../decisions/03-behavior-foundation.md)

## Completion evidence

Pending implementation.
