# Authoring and showcase cleanup

## Problem statement

The Markdown work and accepted Fieldnotes prototype exposed library sizing, navigation, overlay, editor-state, and showcase presentation defects recorded in Ticket 30. Whitney authorized fixing these findings after delivery of Ticket 27.

## Solution

Complete the recorded findings through public library APIs and representative showcase examples. Preserve the accepted Fieldnotes composition. Keep release-wide certification and future integration tickets separate from these concrete fixes.

## Implementation decisions

- Empty support-space reservation becomes optional through the existing `reserveSupportSpace` convention. Visible descriptions and validation remain available. Preserve current defaults; use the compact choice deliberately in application settings and examples.
- The demo opens a document-card Home view with fixed/natural height selection, search, inclusion selection, and document opening. Editing sessions remain mounted when returning Home.
- Card sizing is consumer-controlled through explicit positive finite dimensions, with contained scrolling for excess content. Natural cards remain naturally sized. Selection rails stay within the actual card in either case.
- Navigator collapse owns only navigation visibility. Remove externally controlled collapse and the callback. Retain the navigator width and expansion-control dimensions; collapse the outlined pane to its header. Sidebar geometry and sibling commands remain application-owned. New document sits directly below the navigator and remains visible when it collapses. Whitney clarified this after rejecting the fully extended empty outline. A supported top-of-sidebar placement removes only top rounding and retains the border. Keep New document outside navigation.
- Support editor fill within bounded height and distinguish read-only/locked within the document area without impairing selection or copying. Use a distinct background, dashed boundary, and a small lock indicator; remove the label badge. Retain the separate demo alert to explain access restrictions.
- Tables support content-based minimum width and fixed column layout through public choices. Keep deliberate scrolling for wide data.
- Reproduce and correct nested Select pointer interaction in Popover without replacing pointer operation with keyboard operation.
- Increase scrollbars modestly and preserve interaction visibility, themes, and forced colors.
- Group appearance settings by accent in the showcase sidebar using library controls. Remove repeated compact-density promotional links. Remove chart comparison links. Keep showcase examples limited to controls needed to demonstrate the named component; application workflows belong in demos.
- Keep component descriptions and their border on the left, consistent with the catalog. Give each chart example a titled, bordered panel and separate setup controls from its plot. Keep pie explanations independent of chart width. Shared chart presentation options use consistent controls and materially different regular/compact dimensions. Area hover includes a vertical dashed guide.
- Improve canonical composition guidance on intrinsic control sizing, bounded content widths, accumulated spacing, and avoiding distribution of spare height between related controls. This work changes repository guidance, not external work-system skill files.

## Testing decisions

Use focused public-seam regression tests for behavior, type tests for public additions/removals, and browser geometry checks for spatial defects. Inspect representative wide and phone views in both themes and browser pointer/keyboard transitions. Run configured lint, types, tests, generated guidance, showcase build, and packed consumer checks appropriate to each completed batch. Keep evidence separate from release-wide certification.

## Accepted sources

- [Recorded findings](../library-foundation/tickets/30-cross-browser-accessibility-and-visual-hardening.md)
- [Accepted demo](../markdown-authoring-demo/spec.md)

## Out of scope

New application redesign, production persistence, unrequested component families, external skill edits, and release-wide certification before the remaining integration fixtures exist.
