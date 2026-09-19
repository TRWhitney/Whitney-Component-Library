# Docket document workbench

## Problem statement

Ticket 28 needs a substantial public-package application proof. Whitney requests one cohesive document workflow with persistent editing state and a visual identity distinct from Energy desk and Fieldnotes.

## Solution

Docket is a project handover workspace for the fictional Northstar observatory renewal. Navigate documents, write in Live Preview or source, read the result, edit document details, save, mark saved documents ready, and export a reviewed handover packet from one bounded workspace.

## User stories

1. Select and edit a handover document without losing drafts or selection when switching modes, documents, or viewport size.
2. Inspect ownership, summary, readiness, linked documents, and supporting observations beside the document.
3. Save and prepare documents for handover, recovering from unavailable loading or saving without losing work.
4. Review packet readiness and download the ready documents through a contextual overlay.

## Implementation decisions

- Consumer-owned state and hash navigation. One retained MarkdownEditor instance per visited document preserves history and source selection. Mode changes never replace that instance.
- CollapsibleNavigationPane for grouped document destinations, sibling search and creation commands, SplitView for editing and the related inspector, Toolbar for editing actions, Menu for secondary commands, Drawer for compact navigation/details, Dialog for packet review and demo controls, NotificationProvider for completion feedback.
- Wide layout uses a 240px navigator and a resizable document/inspector relationship, with the editor dominant. Below 1100px the inspector becomes an overlay. Below 760px navigation also becomes an overlay. The editor stays mounted and the workspace stays bounded to the viewport.
- Source, Write, and Read are editing modes on the same document, not separate route screens. Commands operate on the retained selection. Title and summary edits also mark the document unsaved and invalidate readiness.
- Save captures a snapshot; edits made while saving remain unsaved. Readiness applies only to a nonempty saved snapshot. Export includes ready saved documents and excludes unfinished drafts.
- Supporting observation data uses public chart APIs inside the document inspector, integrating analytical reading with authoring rather than embedding another application screen.
- Session-only data and simulated latency/failures are explicit in demo controls. No backend, production hardening, collaboration, persistence service, or library implementation changes.
- Public-client corrections are in scope. Required library changes go into a separate actionable correction ticket, to be worked only after Whitney finishes reviewing the demo.

## Testing decisions

Build and typecheck against an installed npm archive with no source aliases. Verify complete document workflows in Chromium and Firefox at desktop and phone sizes, including retained selection, undo, drafts, saving races, failed save and retry, loading, unavailable collection, empty collection/search/document, readiness, download, menu/overlay focus and responsive continuity. Inspect rendered screenshots and semantics. Check appearance variants and reduced motion as prototype evidence, without claiming release-wide certification.

## Out of scope

Public workbench exports, router/store abstractions, library fixes before demo acceptance, production hardening, and stable-release certification.

## Accepted sources

- [Foundation ticket](../library-foundation/tickets/28-application-workbench-prerelease.md)
- [Integration slice decision](../library-foundation/decisions/14-prerelease-slice-set.md)
- Whitney's current instruction authorizes routine design choices and defines the demo/correction boundary.

## Accepted expansion

Whitney accepted the original document workspace without criticisms, then requested additional pages/content that demonstrate more of the library. Retain the accepted document layout, state continuity, alignment care, and prototype boundary.

- Add three explicit workspace destinations: Documents, Handover register, and Commissioning review. Hash navigation and browser history cover each. Switching tools preserves document sessions, register filters/selection, and system-review drafts. These are related tools for the same handover project.
- Handover register presents the same documents in a sortable, selectable Table with CollectionFilterBar, batch readiness actions, row Menu/ContextMenu commands, and a readiness summary. Marking ready skips unsaved, empty, or unnamed documents, and reports exactly how many changed. Filter changes clear selection to avoid invisible batch targets. Row actions open the same retained document editor.
- Commissioning review uses a selectable system CardCollection, ProcessTracker, a Meter for current readings, CheckboxGroup checkpoints, DatePicker, RadioGroup decision, TextArea notes, FileTrigger evidence, and a confirmation dialog for recording the review. Ventilation includes the existing observation chart; access and dome systems use their own readings and checklists.
- A pass requires every checkpoint, a date, and an explicit decision. A hold requires a reason and date; incomplete checks remain visible in the generated document. Recording creates a new unsaved Markdown review document, which then follows the existing save/readiness/export workflow. Evidence files are held in memory; the review lists their names and does not claim to embed binary files in Markdown.
- Register and review have distinct compositions: a wide collection with a compact summary rail, and a system-selector rail beside resizable form and evidence panes. Each fills the remaining viewport with internal scrolling. At narrow widths filters use a dialog, review systems use a select, and evidence moves into a drawer. Preserve equal heights and baselines within control rows.
- Verify both new end-to-end paths, rejected incomplete reviews, visible empty results, batch skip behavior, generated document contents, tool/history state continuity, and desktop/phone layouts. Rerun the accepted document workflow.
