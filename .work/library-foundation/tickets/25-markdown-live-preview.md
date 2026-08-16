# 25 Markdown Live Preview

**What to build:** In-place Markdown Live Preview for the accepted syntax, revealing relevant
markup around the active cursor or selection while preserving a stable Markdown value.

**Blocked by:** [Markdown Source and Preview](24-markdown-source-and-preview.md)

**Status:** blocked

- [ ] Headings, emphasis, links, images, lists, task lists, blockquotes, fenced code, tables,
      horizontal rules, footnotes, and wiki links render in place outside the active edit context.
- [ ] Moving the cursor or changing selection reveals only the syntax needed to edit the active
      construct without causing disorienting scroll or layout jumps.
- [ ] Typing, deletion, multiline selection, composition input, undo/redo, and clipboard actions
      preserve a valid canonical Markdown value.
- [ ] Live Preview, source, and read-only mode transitions preserve value and a reasonable selection
      or focus location.
- [ ] Syntax and rendered meaning remain available to screen-reader users without duplicate noisy
      announcements.
- [ ] Tables, code blocks, long lines, bidirectional text, zoom, and compact containers remain
      editable and reachable.
- [ ] Theme, accent, forced-color, reduced-motion, SSR, hydration, types, and contracts pass.
- [ ] Representative large documents meet a recorded interaction-responsiveness budget.

## Accepted sources

- [Specification](../spec.md)
- [Markdown Editor Scope](../decisions/12-markdown-editor-scope.md)

## Completion evidence

Pending implementation.
