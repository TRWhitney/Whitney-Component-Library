# 24 Markdown Source and Preview

**What to build:** A Markdown-valued field with source-editing and safe read-only preview modes,
shared field state, deterministic rendering, and a private editor engine.

**Blocked by:** none. The field and feedback prerequisites are complete.

**Status:** complete

- [x] Markdown text is the only canonical public value in controlled and uncontrolled use.
- [x] Source editing preserves selection, undo/redo, clipboard behavior, form integration, and
      invalid intermediate content.
- [x] Read-only preview safely renders the accepted built-in syntax with raw HTML disabled by
      default.
- [x] Required, invalid, read-only, disabled, loading, and collaborative-lock states use shared
      field conventions.
- [x] Labels, descriptions, validation, cursor context, and mode are programmatically meaningful.
- [x] The editor engine and its document/state types do not appear in public declarations.
- [x] Large-document server rendering, hydration, theme, forced-color, type, and basic
      responsiveness checks pass.
- [x] Ordinary component bundles do not include editor-engine JavaScript.
- [x] Source and preview share one editing session so mode changes retain selection and history;
      the implementation supports later in-place Live Preview without changing the public value.
- [x] Canonical guidance and the rendered component showcase cover the delivered modes and states
      and distinguish upcoming Live Preview from the current source/preview milestone.

## Accepted sources

- [Specification](../spec.md)
- [Source and preview detail](../../markdown-source-preview/spec.md)
- [Markdown Editor Scope](../decisions/12-markdown-editor-scope.md)
- [Architecture decision: Own a Markdown Editing Surface](../../../docs/adr/0007-own-a-markdown-editing-surface.md)

## Completion evidence

MarkdownEditor now supplies source editing and safe semantic preview over one retained Markdown
editing session. Canonical guidance and an interactive showcase accompany the public component.
The [verification record](../../markdown-source-preview/verification.md) maps every accepted check
to tests, package checks, browser operation, and large-document measurements.
[Ticket 25](25-markdown-live-preview.md) continues with in-place Live Preview.
