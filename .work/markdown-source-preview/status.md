# Markdown source and preview

## Destination

Deliver [foundation Ticket 24](../library-foundation/tickets/24-markdown-source-and-preview.md)
as the first stage of the accepted in-place Markdown authoring experience.

## Current state

Ticket 24 is complete. Independent intent and engineering reviews pass with no remaining findings.
The source editor uses private
CodeMirror state; preview uses a private Markdown syntax pipeline. The public value remains a
string. Source/preview mode changes retain history and selection. The contract, generated guidance,
and interactive showcase are present.

## Verification

`npm run check` passes 1,027 tests across 73 files, formatting, ESLint, Stylelint, strict types,
generated artifacts, TypeScript 5.9/6/7 declarations, and chart/editor bundle isolation.
`npm run verify:package` passes packed React 18.3.1 and 19.2.8 SSR, hydration, declarations,
and browser builds. `npm run showcase:build` and `git diff --check` pass.

Direct Chromium inspection confirms source entry, preview, undo through mode changes, native
preview semantics, scoped footnotes, light/dark appearance, and compact source/preview layout.
Chromium and Firefox browser checks pass, including clipboard, field states, compact layout, forced
colors, and a 115 KB document. Chromium composition commits Japanese text correctly.
See the [verification record](verification.md) for acceptance mapping and measured timings.

## Accepted sources

- [Specification](spec.md).
- [Editor scope](../library-foundation/decisions/12-markdown-editor-scope.md).
- [Architecture decision](../../docs/adr/0007-own-a-markdown-editing-surface.md).
- [Future Live Preview](../library-foundation/tickets/25-markdown-live-preview.md).
- [Future commands and integration seams](../library-foundation/tickets/26-markdown-commands-links-assets-and-extensions.md).

## Out of scope

Live Preview implementation, formatting toolbars, wiki-link navigation, asset acquisition,
public extension APIs, persistence, and the Ticket 27 consumer application.

## Continuation

Delivered on `main` in the commit containing this record. The implementation, dependencies,
contracts, showcase, verification, and related documentation form one completed outcome.
The initial working tree was clean. No work remains in this effort; the foundation continues
with [Ticket 25](../library-foundation/tickets/25-markdown-live-preview.md).
