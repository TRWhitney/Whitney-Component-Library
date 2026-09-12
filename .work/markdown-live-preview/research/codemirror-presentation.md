# CodeMirror presentation constraints

The existing private CodeMirror session can retain exact source, history, and selection while
Live Preview changes its decorations. Selection uses canonical document offsets. The
[decoration documentation](https://codemirror.net/examples/decoration/) and installed
`@codemirror/view` 6.43.11 declarations require direct state-field decorations for block widgets
or replacements that cross line breaks. View-plugin decorations run after viewport calculation.

Use semantic block wrappers for ordinary headings, lists, and quotations. Table cells need actual
table DOM in a replacement widget with a route back to source. Do not mark whole constructs as
atomic, which prevents normal keyboard entry. See the
[BlockWrapper reference](https://codemirror.net/docs/ref/#view.BlockWrapper) and
[maintainer discussion of atomic movement](https://discuss.codemirror.net/t/detect-cursor-motion-into-atomicranges-widget/6399).

Cache parsing by document revision; selection-only updates need no parse. Use the existing
semantic Markdown grammar rather than assuming Lezer highlighting has the same language.
The installed default `markdown()` language lacks GFM, footnotes, and custom wiki targets.

Freeze presentation structure during composition and map its positions through text changes.
A [June 2026 Safari diagnosis](https://discuss.codemirror.net/t/bug-ime-selection-is-not-updated-when-decoration-mark-contains-multiple-decoration-replace-decorations/9785)
shows that replacing DOM before active composition can alter native selection. Programmatically
repairing that selection can abort composition. Recompute after the composition commits.

These findings came from independent read-only research and inspection of the installed engine.
The browser checks must establish actual editing, accessibility, and performance behavior; the
engine mechanisms alone do not prove those outcomes.
