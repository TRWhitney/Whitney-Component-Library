# Markdown authoring commands and integrations

## Destination

Complete [Ticket 26](../library-foundation/tickets/26-markdown-commands-links-assets-and-extensions.md).

## Current state

The command slice is complete and ready to commit. Application links/assets are next.
[Specification](spec.md) records the implementation boundary. The optional question about expected
custom syntax is pending; the documented inline/fence boundary applies in its absence.

## Accepted sources

- [Accepted Markdown scope](../library-foundation/decisions/12-markdown-editor-scope.md).
- [Editor architecture](../../docs/adr/0007-own-a-markdown-editing-surface.md).

## Verification

[Current command evidence](verification.md). Package and zoom checks pass.

## Continuation

Branch main, baseline 9beef0f, initially clean. This effort owns Ticket 26 authoring behavior,
showcase, tests, contracts, and effort records. Deferred cleanup remains separate.
Resume with `python3 /home/whitney-white/.codex/skills/work-system/scripts/navigate.py resume novel-work delivery`.
Next action: commit the command outcome, then move to implementation for application links/assets.
