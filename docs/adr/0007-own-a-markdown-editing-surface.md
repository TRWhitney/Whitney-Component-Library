# Own a Markdown Editing Surface

The stable catalog will include an Obsidian-like Markdown editing surface whose canonical public
value remains Markdown text and whose live-preview, source, read-only, command, wiki-link, paste,
drop, and safe-rendering behavior is library-owned. The underlying editor framework remains private
behind a bounded extension contract, and vault storage, backlinks, collaboration transport, graph
views, and an Obsidian plugin ecosystem are outside the component.

In-place Live Preview is the defining authoring experience. Source editing and read-only preview
support it. Delivering those modes first must preserve a document and editing-session model that
can support context-sensitive markup visibility without changing the public Markdown value.
