# 27 Markdown Authoring Prerelease

**What to build:** The Markdown authoring workspace construct and prerelease slice for composing,
previewing, navigating wiki links, inserting assets, invoking commands, and coordinating metadata.

**Blocked by:** [Markdown Commands, Links, Assets, and Extensions](26-markdown-commands-links-assets-and-extensions.md),
[Application Structure](17-application-structure.md), [Popover, Tooltip, and Menu Overlays](13-popover-tooltip-and-menu-overlays.md),
[Loading, Empty, and Notification Feedback](11-loading-empty-and-notification-feedback.md)

**Status:** blocked

- [ ] The workspace coordinates editor, metadata fields, toolbar/commands, link navigation, asset
      state, and preview through bounded public composition.
- [ ] It demonstrates unsaved, saving, saved, invalid, read-only, locked, asset-pending, and error
      states without owning persistence or collaborative transport.
- [ ] Source, Live Preview, and read-only flows remain keyboard and screen-reader operable.
- [ ] Compact and wide layouts preserve authoring focus, supporting metadata, and commands.
- [ ] A clean packed-package fixture implements the complete slice with no private import or
      external substitute component.
- [ ] Contracts guide agents to the authoring construct without implying a notes vault.
- [ ] Representative document workloads, browsers, theme, SSR, hydration, types, accessibility,
      and generated guidance pass.

## Accepted sources

- [Specification](../spec.md)
- [Prerelease Integration Slice Set](../decisions/14-prerelease-slice-set.md)
- [Markdown Editor Scope](../decisions/12-markdown-editor-scope.md)

## Completion evidence

Pending implementation.
