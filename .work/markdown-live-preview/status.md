# Markdown Live Preview

## Destination

Deliver [Ticket 25](../library-foundation/tickets/25-markdown-live-preview.md).

## Current state

Ticket 25 is complete. Live Preview is the default Markdown editing mode, with source reveal at
the selection and one canonical Markdown value. Repository checks, browser verification, packed
consumer checks, and independent intent and engineering reviews pass.

## Accepted sources

- [Specification](spec.md).
- [Accepted Markdown scope](../library-foundation/decisions/12-markdown-editor-scope.md).
- [Editor architecture](../../docs/adr/0007-own-a-markdown-editing-surface.md).

## Delivery

Delivered on `main` from baseline `821a6bc`. Implementation, verification, contracts, showcase,
and effort records travel together in the containing feature commit. Whitney's deferred state
styling and showcase notes remain in Tickets 27 and 30.

[Ticket 26](../library-foundation/tickets/26-markdown-commands-links-assets-and-extensions.md)
is ready for the next requested work. See the [verification record](verification.md) for the
passing checks, measured browser results, and resolved review findings.
