# Markdown authoring demo

## Destination

Deliver the accepted Fieldnotes client prototype and actionable library findings for [Ticket 27](../library-foundation/tickets/27-markdown-authoring-prerelease.md).

## Current state

Complete. Whitney accepted the application-author experience and authorized delivery followed by cleanup. The [accepted specification](spec.md) and [operating instructions](prototype.md) describe the retained prototype. Run `npm run prototype:markdown` and open `http://localhost:5176/`.

## Frontier

The recorded [Ticket 30 findings](../library-foundation/tickets/30-cross-browser-accessibility-and-visual-hardening.md) are authorized for implementation. Release-wide certification remains separate from those findings.

## Verification

Packed-consumer types and browser build, targeted ESLint, Stylelint, and Prettier pass. Existing Chromium and Firefox workflow and visual evidence remains valid; the client implementation is unchanged since acceptance. Final browser inspection confirms the centered editor and independent sidebar command. See [evidence](prototype.md#evidence).

## Continuation

Ticket 27 delivery on branch `main`, baseline `370d42a`. No library implementation changes belong to this delivery. Next work is the authorized cleanup.
