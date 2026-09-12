# Markdown engine and rendering

## Question and conclusion

Which private implementation supports exact Markdown strings now and in-place markup reveal
later? Use CodeMirror 6 for the text editing session, with react-markdown and remark-gfm for safe
reading output. This is a reversible implementation choice behind the existing public boundary.

## Evidence

- CodeMirror provides text transactions, mapped selections, history, and replacement/widget
  decorations. Those mechanisms allow later presentation changes without serializing a rich-text
  document back into Markdown. See its [state reference](https://codemirror.net/docs/ref/)
  and [decoration example](https://codemirror.net/examples/decoration/).
- Its default newline splitting normalizes CRLF and CR. The implementation explicitly uses LF
  as the structural separator and preserves CR in the underlying text. Public change-event tests
  verify mixed separators and unfinished markup through insertion and undo.
- [react-markdown](https://github.com/remarkjs/react-markdown) produces React elements through a
  syntax tree. Raw HTML remains text without a raw-HTML plugin. The implementation adds a
  restricted URL policy and scopes footnote identifiers per component instance.
- [remark-gfm](https://github.com/remarkjs/remark-gfm) supplies tables, task lists, strikethrough,
  autolinks, and footnotes. A small private micromark extension recognizes simple wiki targets in
  Markdown phrasing. It preserves source positions and does not reinterpret code or escapes.
- [Lezer Markdown](https://github.com/lezer-parser/markdown) supplies incremental source syntax
  information, but its GFM bundle does not cover footnotes or wiki links and its reference-link
  recognition differs from semantic Markdown parsing. Ticket 25 must verify rendered semantics
  against the preview parser rather than treating source highlighting as authoritative rendering.

## Alternatives and limits

[ProseMirror](https://prosemirror.net/examples/markdown/),
[Tiptap](https://tiptap.dev/docs/editor/markdown), and
[Lexical](https://lexical.dev/docs/packages/lexical-markdown) document Markdown import/export
through structured editor state. Exact source preservation and context-sensitive markup reveal
would require additional source tracking. This is a fit assessment, not a claim of impossibility.
[Monaco](https://github.com/microsoft/monaco-editor#faq) excludes mobile-browser support in its FAQ.

The engine choice alone proves neither Live Preview accessibility nor performance. Ticket 25
still owns decoration layout, syntax reveal, selection across replaced content, and interaction
budgets. Ticket 26 owns public command, asset, navigation, and extension contracts. No third-party
engine, parser, or plugin type enters public declarations.
