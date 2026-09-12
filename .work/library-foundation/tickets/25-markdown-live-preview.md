# 25 Markdown Live Preview

**What to build:** In-place Markdown Live Preview for the accepted syntax, revealing relevant
markup around the active cursor or selection while preserving a stable Markdown value.

**Blocked by:** none. [Markdown Source and Preview](24-markdown-source-and-preview.md) is complete.

**Status:** complete

- [x] Headings, emphasis, links, images, lists, task lists, blockquotes, fenced code, tables,
      horizontal rules, footnotes, and wiki links render in place outside the active edit context.
- [x] Moving the cursor or changing selection reveals only the syntax needed to edit the active
      construct without causing disorienting scroll or layout jumps.
- [x] Typing, deletion, multiline selection, composition input, undo/redo, and clipboard actions
      preserve a valid canonical Markdown value.
- [x] Live Preview, source, and read-only mode transitions preserve value and a reasonable selection
      or focus location.
- [x] Syntax and rendered meaning have one coherent browser accessibility-tree representation
      without duplicate live-region or rendered content.
- [x] Tables, code blocks, long lines, bidirectional text, zoom, and compact containers remain
      editable and reachable.
- [x] Theme, accent, forced-color, reduced-motion, SSR, hydration, types, and contracts pass.
- [x] Representative large documents meet a recorded interaction-responsiveness budget.

## Accepted sources

- [Specification](../spec.md)
- [Live Preview detail](../../markdown-live-preview/spec.md)
- [Markdown Editor Scope](../decisions/12-markdown-editor-scope.md)
- [Source editor and parser considerations](../../markdown-source-preview/research/editor-engine.md)

## Completion evidence

MarkdownEditor now defaults to in-place Live Preview over the retained Markdown session.
[Verification](../../markdown-live-preview/verification.md) records syntax, keyboard and pointer
entry, exact clipboard values, composition, package compatibility, and large-document timings.
[Ticket 26](26-markdown-commands-links-assets-and-extensions.md) continues with commands and integration seams.
