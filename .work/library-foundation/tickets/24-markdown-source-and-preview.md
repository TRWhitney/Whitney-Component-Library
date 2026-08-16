# 24 Markdown Source and Preview

**What to build:** A Markdown-valued field with source-editing and safe read-only preview modes,
shared field state, deterministic rendering, and a private editor engine.

**Blocked by:** [Field and Text Entry Family](04-field-and-text-entry-family.md),
[Status, Progress, and Alerts](10-status-progress-and-alerts.md)

**Status:** blocked

- [ ] Markdown text is the only canonical public value in controlled and uncontrolled use.
- [ ] Source editing preserves selection, undo/redo, clipboard behavior, form integration, and
      invalid intermediate content.
- [ ] Read-only preview safely renders the accepted built-in syntax with raw HTML disabled by
      default.
- [ ] Required, invalid, read-only, disabled, loading, and collaborative-lock states use shared
      field conventions.
- [ ] Labels, descriptions, validation, cursor context, and mode are programmatically meaningful.
- [ ] The editor engine and its document/state types do not appear in public declarations.
- [ ] Large-document server rendering, hydration, theme, forced-color, type, and basic
      responsiveness checks pass.
- [ ] Ordinary component bundles do not include editor-engine JavaScript.

## Accepted sources

- [Specification](../spec.md)
- [Markdown Editor Scope](../decisions/12-markdown-editor-scope.md)
- [Architecture decision: Own a Markdown Editing Surface](../../../docs/adr/0007-own-a-markdown-editing-surface.md)

## Completion evidence

Pending implementation.
