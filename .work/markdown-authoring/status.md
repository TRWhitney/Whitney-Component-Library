# Markdown authoring commands and integrations

## Destination

Complete [Ticket 26](../library-foundation/tickets/26-markdown-commands-links-assets-and-extensions.md).

## Current state

Commands are delivered in f25e80a and wiki navigation in 367ab77. Asset acquisition is delivered in e64b7ca. Declared extensions and stored RGBA text colors are complete. Both independent review axes pass.
[Specification](spec.md) records the accepted boundary, including RGBA stored in Markdown with a source swatch.

## Accepted sources

- [Accepted Markdown scope](../library-foundation/decisions/12-markdown-editor-scope.md).
- [Editor architecture](../../docs/adr/0007-own-a-markdown-editing-surface.md).

## Verification

[Current verification](verification.md) covers commands, navigation, assets, declared extensions, and stored RGBA. All 1165 tests, package checks, native browser flows, and performance checks pass.

## Handoff

Ticket 26 is complete on main. [Ticket 27](../library-foundation/tickets/27-markdown-authoring-prerelease.md)
is ready for the packed-package authoring integration proof. Deferred cleanup remains in Tickets
27 and 30. Rich code-block rendering remains future work beyond the initial declared note/warning fences.
