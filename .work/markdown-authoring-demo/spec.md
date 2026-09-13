# Markdown authoring demo

## Problem statement

Prove that an application author can compose a cohesive document workflow with the public library, and make client-side improvements through rapid feedback from Whitney.

## Solution

A runnable packed-consumer publication studio named Fieldnotes coordinates assembling a field guide, focused document writing, and review before a combined Markdown export. Desktop sidebar navigation and a phone drawer connect a table of included documents and a writing workspace that retains editing sessions; version-specific review determines export readiness. The prototype and actionable library deficiencies are the outputs of Ticket 27. Library fixes follow only after Whitney accepts the application-author experience.

## User stories

- Choose or create a document, write and format it, review its metadata, and save it without leaving the workspace.
- Change between Live Preview, Source, and Preview without losing the document, selection, history, or unsaved changes.
- Navigate linked documents and return to retained drafts.
- Recover from loading, save, and attachment failures without discarding work.
- Assemble included documents, revise them, review their saved versions, and export one field guide.
- Keep writing and reviewing on a small screen with navigation in a drawer and the document controls still available.

## Implementation decisions

- Consume an actual npm archive, with public exports only. Keep all application code under `prototypes/markdown-authoring/`.
- Use fictional project documents and session-only state. Saving records an in-memory snapshot; export downloads Markdown. No backend or collaboration transport.
- Preserve mounted document sessions across mode changes, document navigation, and responsive layout changes.
- Use uncontrolled CollapsibleNavigationPane in the desktop sidebar, Drawer with Link navigation on phones, Table, List, ProcessTracker, Toolbar, editable fields, Menu, Dialog, and DropZone for attachment acquisition. Application CSS styles owned layout and content, never private component internals.
- Record a library deficiency with its triggering flow, observed behavior, public API limitation, and desired correction in Ticket 30. Do not patch the library during this prototype.
- Continue iterating until Whitney accepts what the application author can achieve. Ticket 27 remains open during that review.

## Testing decisions

Type-check and bundle the packed consumer. Operate the complete workflow in Chromium and Firefox at desktop and phone widths, inspect the rendered layout and semantics, and check loading, empty, error, unsaved, saving, read-only, locked, and attachment states. These are prototype checks, not production hardening.

## Out of scope

Library implementation changes, production regression tests, durable storage, authentication, collaboration, a public Markdown workspace component, and release-wide certification.

## Design

Use the existing library typography and theme. Canvas, surface, text, muted text, and border use `--wcl-canvas`, `--wcl-surface`, `--wcl-text`, `--wcl-text-muted`, and `--wcl-border`; blue `#397bea` is the initial application accent. Document headings use the library reading hierarchy, application identity and task headings use 18px, and utility labels use 12px. The desktop sidebar contains navigation and a separate New document action. Navigation collapse must not affect sidebar width or the visibility and position of New document. The bounded writing workspace is centered within the remaining area. Phones use a navigation drawer and keep New document in the application bar. Collection, review, and writing share a centered workspace limited to 60rem and its title input to 32rem. The document opens immediately. Title and stage share a compact row, followed by commands, save status, and the editor. Summary, linked documents, and attachments open in dialogs so their contents cannot displace the editor. The attachments dialog uses DropZone for drop, paste, and picker acquisition. The export action sits at the right edge of the review header, separated from the left-aligned title. Review version and button-label content occupy stable widths to prevent automatic table reflow. Settings use compact toggle buttons while Switch support-space reservation remains a library limitation. On narrow screens public lists replace tables, and secondary commands use icons. Motion remains library-owned overlay and focus feedback.

Whitney rejected both the first sidebar/inspector composition and the subsequent page-oriented publication layout. Sidebars remain appropriate; the requirement is a distinct, coherent application, not the absence of sidebars. The accepted application removes promotional page headers, repeated title displays, variable-height cards, and inline metadata sections. Whitney accepted the application-author experience and authorized delivery followed by the recorded library cleanup.
