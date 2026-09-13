# 27 Markdown Authoring Integration Proof

**What to build:** A non-exported packed-package fixture that composes the public Markdown editor,
fields, file handling, commands, overlays, feedback, and application structure under
consumer-owned layout and persistence state.

**Blocked by:** none. Markdown authoring, application structure, overlays, and feedback prerequisites are complete.

**Status:** complete

## Delivery boundary

Whitney clarified that the outputs are a substantial [authoring demo](../../markdown-authoring-demo/spec.md) and actionable additions to [Ticket 30](30-cross-browser-accessibility-and-visual-hardening.md). Iterate on the application through public APIs. Record anything requiring library changes rather than implementing it here. After Whitney accepts the application-author experience, work through the cleanup ticket. This is a proof of concept without production hardening; release-wide evidence remains with Ticket 30.

- [x] The fixture coordinates editor, metadata fields, toolbar/commands, link navigation, asset
      state, and preview through public component APIs.
- [x] It demonstrates unsaved, saving, saved, invalid, read-only, locked, asset-pending, and error
      states without owning persistence or collaborative transport.
- [x] Source, Live Preview, and read-only flows remain keyboard operable and expose coherent
      controls, content, relationships, and state in the browser accessibility tree.
- [x] Compact and wide layouts preserve authoring focus, supporting metadata, and commands.
- [x] A clean packed-package fixture implements the complete slice with no private import or
      external substitute component.
- [x] No Markdown-workspace export, contract, required layout, persistence model, or notes-vault
      abstraction is introduced.
- [x] Representative document workflows, Chromium and Firefox, desktop and phone layouts,
      appearance, public consumer types, and browser builds pass under the accepted prototype scope.
      Release-wide SSR, hydration, assistive-technology, and compatibility certification remains
      in Ticket 30.

## Accepted sources

- [Specification](../spec.md)
- [Prerelease Integration Slice Set](../decisions/14-prerelease-slice-set.md)
- [Markdown Editor Scope](../decisions/12-markdown-editor-scope.md)

## Completion evidence

Whitney accepted the [Fieldnotes publication studio](../../markdown-authoring-demo/prototype.md) and authorized delivery followed by the recorded cleanup. Packed-consumer and Chromium/Firefox workflow checks pass. The retained demo and Ticket 30 findings satisfy the clarified delivery boundary.

## Markdown cleanup

The [recorded cleanup](../../authoring-cleanup/status.md), including read-only and locked editor styling, is complete and was accepted by Whitney on 2026-09-13.
