# 26 Markdown Commands, Links, Assets, and Extensions

**What to build:** Formatting commands, typing shortcuts, wiki-link resolution, asset paste/drop,
and bounded syntax/command/decoration extension seams for the Markdown surface.

**Blocked by:** none. Live Preview, file handling, and action prerequisites are complete.

**Status:** active

- [ ] Keyboard and toolbar commands produce the same canonical Markdown transformations and retain
      predictable selection.
- [ ] Markdown typing shortcuts are documented, undoable, and disabled where literal text is
      required.
- [ ] Wiki links display distinctly and use consumer callbacks for resolution and navigation
      without owning routes, vaults, or backlinks.
- [ ] Pasted and dropped assets pass through a consumer callback and insert only its returned
      Markdown; pending, rejection, and failure states are recoverable.
- [ ] The bounded extension contract can add declared syntax, commands, decorations, and link
      resolution without exposing editor-engine objects or enabling an arbitrary plugin runtime.
- [ ] Extension conflicts and unsupported syntax fail deterministically rather than corrupting the
      document.
- [ ] Keyboard, touch, browser accessibility-tree, theme, reduced-motion, SSR, hydration, types,
      and security checks pass.
- [ ] Contracts distinguish built-in behavior, consumer callbacks, and explicitly excluded notes-
      ecosystem behavior.

## Accepted sources

- [Specification](../spec.md)
- [Markdown Editor Scope](../decisions/12-markdown-editor-scope.md)
- [Architecture decision: Own a Markdown Editing Surface](../../../docs/adr/0007-own-a-markdown-editing-surface.md)

## Completion evidence

Implementation and current evidence are tracked in the [authoring effort](../../markdown-authoring/status.md). Commands are complete; links/assets and extensions remain.
