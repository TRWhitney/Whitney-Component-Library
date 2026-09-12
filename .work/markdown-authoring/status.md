# Markdown authoring commands and integrations

## Destination

Complete [Ticket 26](../library-foundation/tickets/26-markdown-commands-links-assets-and-extensions.md).

## Current state

Commands are delivered in f25e80a. Wiki navigation is complete and ready to commit; assets and extensions remain.
[Specification](spec.md) records the implementation boundary. The optional question about expected
custom syntax is pending; the documented inline/fence boundary applies in its absence.

## Accepted sources

- [Accepted Markdown scope](../library-foundation/decisions/12-markdown-editor-scope.md).
- [Editor architecture](../../docs/adr/0007-own-a-markdown-editing-surface.md).

## Verification

[Current command evidence](verification.md). Package and zoom checks pass.

## Continuation

Branch main, current baseline f25e80a, clean after command delivery. This effort owns Ticket 26 authoring behavior,
showcase, tests, contracts, and effort records. Deferred cleanup remains separate.
Resume with `python3 /home/whitney-white/.codex/skills/work-system/scripts/navigate.py resume novel-work delivery`.
Next action: commit wiki navigation, then implement asset acquisition.
