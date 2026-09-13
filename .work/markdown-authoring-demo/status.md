# Markdown authoring demo

## Destination

Deliver the accepted Fieldnotes client prototype and actionable library findings for [Ticket 27](../library-foundation/tickets/27-markdown-authoring-prerelease.md).

## Current state

Closed. Whitney accepted the demo and completed cleanup on 2026-09-13. The [accepted specification](spec.md) and [operating instructions](prototype.md) describe the retained prototype. Run `npm run prototype:markdown` and open `http://localhost:5176/`.

## Frontier

The recorded [Ticket 30 findings](../library-foundation/tickets/30-cross-browser-accessibility-and-visual-hardening.md) are completed in the [cleanup record](../authoring-cleanup/status.md). Release-wide certification remains separate from those findings.

## Verification

Packed-consumer types and browser build, targeted ESLint, Stylelint, and Prettier pass. Chromium and Firefox workflow and visual evidence covers the accepted demo and subsequent cleanup. Final browser inspection confirms the centered editor and independent sidebar command. See [evidence](prototype.md#evidence).

## Continuation

Ticket 27 was delivered as `7eaac57` on branch `main`, from baseline `370d42a`. The completed [cleanup](../authoring-cleanup/status.md) updates the prototype to use its new public APIs. No work remains in this effort.
