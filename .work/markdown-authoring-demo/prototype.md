# Fieldnotes authoring demo

## Run

Run `npm run prototype:markdown` from the repository root and open `http://localhost:5176/`.

The launcher packs the current library, installs its archive into the prototype, checks the consumer types, and starts Vite. There are no source aliases or private library imports. `npm run prototype:markdown:build` creates the browser bundle in `.showcase-dist/markdown-authoring/`.

## Review question

Does this composition provide a coherent document workflow through the public components? Iterate on the client until Whitney accepts the application-author experience. Library limitations belong in [Ticket 30](../library-foundation/tickets/30-cross-browser-accessibility-and-visual-hardening.md#markdown-authoring-findings).

## Operate the publication studio

- Start in the writing workspace. On desktop, the sidebar contains Collection, Review & export, and document navigation. Collapse hides only navigation content; New document remains visible at its fixed sidebar position. On phones, Navigator opens a drawer and New document stays in the application bar. On phones, public lists replace tables and secondary toolbar commands use icons.
- Edit the title and stage above the command toolbar. New document focuses an empty title input. Summary, Links, and Attachments open dialogs without moving the editor.
- Use the mode menu for Live Preview, Source, and Preview. All editor sessions remain mounted across application views, preserving drafts, selections, and undo history.
- In Collection, select table rows to include documents in the field guide. Search filters rows without changing inclusion. Open a document title to write or read it.
- Save, or press Ctrl/Command+S, to record a version in memory. Changes made while saving remain unsaved. Document actions offers duplication and individual Markdown export.
- Review & export lists the included documents with per-version approval. Blank titles, empty documents, and unsaved edits prevent approval. A subsequent edit invalidates that document's review.
- Once all included versions are reviewed, Export field guide downloads them as one Markdown file.
- Formatting retains its prior command behavior, fixed H2 shortcut, custom RGBA color input, and additional headings/blocks in More formatting.
- Drop, paste, or choose files through the attachment dialog DropZone, or drop/paste files into the editor to insert links. File links download the original bytes. Files remain in memory and are limited to 8 MB each.
- Demo settings controls appearance, accent, simulated loading/empty/error states, access, save failures, and attachment failures. Identify workspace regions shows stable region/control names in the footer.

## Boundaries

This is a client proof of concept. Four fictional project documents are supplied. Reloading restores them and discards session changes and attachments; export Markdown to retain text. There is no server, storage service, account system, or collaborative transport. Locked state is simulated.

The demo uses the public regular editor height on small screens and expanded height on wide screens. It does not override private styles to force pane filling or remove mandatory support rows. These limitations are recorded in cleanup. The mode selector now uses Menu at every width, and editor size uses the public regular/expanded choices.

## Evidence

Page and document navigation IDs use separate prefixes. Chromium and Firefox checks confirm exactly one current destination while switching between Review & export, Review agenda, and Collection, including keyboard activation.

The drawer-only desktop revision and left-pinned writing workspace are rejected. The restored sidebar separates New document from navigation collapse and centers collection, review, and writing in the remaining area, with a shared 60rem width limit. Chromium and Firefox checks at 2560×1440 confirm unchanged sidebar, New document, and writing geometry through collapse, creation while collapsed, and phone navigation at 390×844. Rounded navigator edges still require the recorded library change. Chromium and Firefox workflow checks pass at 1440×1000 and 390×844, including retained drafts/selections, navigation, review/export, attachments, and simulated loading/empty/error/save-failure states. Review row and column rectangles match before and after all approvals. Separate Chromium checks confirm unchanged workspace bounds when opening/closing the drawer, independent New document visibility, and attachment drop/paste event handling with browser File objects. Picker acquisition passes in both workflow runs. Visual inspection covers the bounded writing area, compact settings, collection controls, and attachment target. Consumer types, ESLint, Stylelint, formatting, and the browser bundle pass. Prior retained editor and asset behavior remains unchanged.

Whitney accepted the publication studio and explicitly authorized closing Ticket 27 and beginning the recorded cleanup. Production hardening, release-wide browser/accessibility certification, and real persistence remain outside this iteration.
