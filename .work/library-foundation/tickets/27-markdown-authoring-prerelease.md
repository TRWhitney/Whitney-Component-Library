# 27 Markdown Authoring Integration Proof

**What to build:** A non-exported packed-package fixture that composes the public Markdown editor,
fields, file handling, commands, overlays, feedback, and application structure under
consumer-owned layout and persistence state.

**Blocked by:** none. Markdown authoring, application structure, overlays, and feedback prerequisites are complete.

**Status:** ready

- [ ] The fixture coordinates editor, metadata fields, toolbar/commands, link navigation, asset
      state, and preview through public component APIs.
- [ ] It demonstrates unsaved, saving, saved, invalid, read-only, locked, asset-pending, and error
      states without owning persistence or collaborative transport.
- [ ] Source, Live Preview, and read-only flows remain keyboard operable and expose coherent
      controls, content, relationships, and state in the browser accessibility tree.
- [ ] Compact and wide layouts preserve authoring focus, supporting metadata, and commands.
- [ ] A clean packed-package fixture implements the complete slice with no private import or
      external substitute component.
- [ ] No Markdown-workspace export, contract, required layout, persistence model, or notes-vault
      abstraction is introduced.
- [ ] Representative document workloads, browsers, theme, SSR, hydration, types, accessibility,
      and generated guidance pass.

## Accepted sources

- [Specification](../spec.md)
- [Prerelease Integration Slice Set](../decisions/14-prerelease-slice-set.md)
- [Markdown Editor Scope](../decisions/12-markdown-editor-scope.md)

## Completion evidence

Pending implementation.

## Markdown cleanup

- [ ] Give read-only and collaboratively locked editors a visible treatment on the editor itself
      that makes their non-editable state clear without relying on the support text below.
      Whitney requested this cleanup after the Markdown tickets; retain the explanatory text.
