# 01 Markdown authoring commands

**What to build:** Composable formatting controls and matching keyboard actions over the retained
Markdown session, including undoable Markdown list and quotation continuation.

**Blocked by:** none

**Status:** complete

- [x] The optional toolbar uses existing action components and retains source selection.
- [x] Built-in inline and block commands produce documented Markdown and predictable selections.
- [x] Keyboard and toolbar commands share behavior and each edit can be undone independently.
- [x] Enter continues and exits Markdown lists/quotations, respects literal code/composition,
      and leaves Tab available to exit the editor.
- [x] Controlled values, field states, modes, SSR/hydration, and localization remain valid.
- [x] Canonical guidance and the actual showcase demonstrate the delivered commands.

## Accepted sources

- [Specification](../spec.md), commands and typing section.

## Completion evidence

[Command validation](../verification.md) covers the public tests, browser operation, layout, performance, and packed consumers.
