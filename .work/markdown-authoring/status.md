# Markdown authoring commands and integrations

## Destination

Complete [Ticket 26](../library-foundation/tickets/26-markdown-commands-links-assets-and-extensions.md).

## Current state

Commands are delivered in f25e80a and wiki navigation in 367ab77. Asset acquisition is complete, validated, and reviewed; extensions remain.
[Specification](spec.md) records the implementation boundary. The optional question about expected
custom syntax is pending; the documented inline/fence boundary applies in its absence.

## Accepted sources

- [Accepted Markdown scope](../library-foundation/decisions/12-markdown-editor-scope.md).
- [Editor architecture](../../docs/adr/0007-own-a-markdown-editing-surface.md).

## Verification

[Current verification](verification.md) covers commands, navigation, and asset acquisition.

## Continuation

Branch main, current baseline 367ab77. The current outcome delivers asset acquisition. This effort owns Ticket 26 authoring behavior,
showcase, tests, contracts, and effort records. Deferred cleanup remains separate.
Resume with `python3 /home/whitney-white/.codex/skills/work-system/scripts/navigate.py resume novel-work implementation`.
Next action: implement declared extensions after this asset delivery.
