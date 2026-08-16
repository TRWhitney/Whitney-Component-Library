# 12 Markdown Editor Scope

**Status:** resolved
**Blocked by:** [Stable Catalog Model](11-stable-catalog-model.md)
**Type:** discussion

## Question

Which source model, live-preview behavior, Markdown extensions, editing commands, link behavior,
paste and drop handling, persistence boundary, and extensibility belong to the stable catalog's
Obsidian-like Markdown editing field?

## Answer

Provide a reusable Markdown editing surface rather than a notes ecosystem. Markdown text is the
canonical public value. The component provides in-place Live Preview that reveals relevant syntax
around the active cursor or selection, plus explicit source-editing and read-only preview modes.

Built-in syntax covers headings, emphasis, links, images, lists, task lists, blockquotes, fenced
code, tables, horizontal rules, footnotes, and `[[wiki links]]`. Consumers resolve and navigate
wiki links through callbacks. The component owns undo and redo, keyboard formatting commands,
Markdown typing shortcuts, selection preservation, clipboard behavior, safe rendering, and shared
read-only, disabled, invalid, required, loading, and collaborative-lock states. Raw HTML is disabled
by default.

Pasted or dropped assets pass through a consumer callback that returns the Markdown insertion; the
library does not upload or persist them. A bounded extension contract may add syntax, commands,
decorations, and link resolution without exposing the underlying editor framework. Vaults,
filesystems, persistence, backlink indexes, graph views, comments, version history, collaborative
transport, and an Obsidian-compatible plugin runtime are outside the component.

## Evidence

- Whitney explicitly requires an Obsidian-like Markdown text editing field before stable release.
- “Obsidian-like” may refer narrowly to live-preview editing or broadly to wiki links, embeds,
  commands, file-backed notes, and plugins; those meanings create materially different public
  contracts and must not be inferred.
- [Stable Catalog Model](11-stable-catalog-model.md)
- [Architecture decision: Own a Markdown Editing Surface](../../../docs/adr/0007-own-a-markdown-editing-surface.md)
