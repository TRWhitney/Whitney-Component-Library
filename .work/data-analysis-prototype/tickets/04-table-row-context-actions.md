# 04 Compose context actions with collection rows

**What to build:** A public way to associate a Table or Tree row with its context commands, including invocation from whitespace and keyboard focus within that row.

**Blocked by:** none.

**Status:** complete

## Evidence and client boundary

The prototype now provides investigation, comparison, and detail commands on right-click. Table exposes row cells and selection callbacks, but no row context-menu hook or row wrapper. ContextMenu owns a focusable div target, which cannot wrap a native table row without breaking table structure.

The earlier client wrapped Table in ContextMenu. Energy desk wraps Tree in the same way. Event capture finds the semantic row and reads a client-owned `data-building-id` from its action content. Controlled open state handles Shift+F10 and the ContextMenu key. Chromium opened the nested target through native event handling; Firefox needed the explicit controlled keyboard path. Both browsers pass with that path.

This makes the prototype operable without private selectors, but consumers should not need to interpret rendered rows to attach object commands. Keep the public component change separate from this client workaround.

## Acceptance

- [x] The consumer associates typed row IDs with context commands without querying rendered table rows or private attributes.
- [x] Secondary click on any part of a row, Shift+F10 or the platform context key from its focused cell, and touch long press target that row.
- [x] Nested visible actions retain their own behavior. Opening a context menu does not accidentally toggle comparison or invoke a row action.
- [x] Dismissal and action completion restore sensible focus even after sorting, filtering, or removing a row.
- [x] Blank collection space and column headers cannot invoke commands for a stale row.
- [x] Keep visible action alternatives and valid grid semantics. Update the Table, Tree, and ContextMenu contracts and component showcase.

## Accepted sources

- [Approved library fix specification](../spec.md).

- [Table contract](../../../docs/components/table.md).
- [ContextMenu contract](../../../docs/components/context-menu.md).
- [Prototype client](../../../prototypes/data-analysis/main.tsx).
- [Design direction](../design.md).

## Implementation evidence

Tree and Table accept `contextMenu` with `getLabel(id)` and `getItems(id)` callbacks. Their row IDs retain the collection's inferred type. An empty command list suppresses that row's menu. Disabled Tree items do not invoke commands. A Table row disabled only for selection can still invoke its context commands, consistent with its enabled visible actions.

A shared collection helper attaches invocation to component-owned row refs and events. It does not ask consumers to inspect rows or identify records through DOM attributes. Right-click, Shift+F10, the Context Menu key, and the supported iOS long-press fallback use the same ID. Menu trigger state does not enter the collection's descendant press state.

Dismissal restores the invoking control after the overlay restores its anchor. Removed targets fall back to a nearby visible row or the empty collection region. Sorting preserves the menu's ID; filtering out its target closes the menu. Headers and blank space have no stale row target.

All 43 checks pass in `tests/collection-context-actions.test.tsx`, `tests/application-collection-regressions.test.tsx`, `tests/advanced-collections.test.tsx`, and `tests/anchored-overlays.test.tsx`. The collection contracts and searchable Tree / reading Table examples in `showcase/collection-interaction-example.tsx` use the new API. Parent integration owns export aggregation, the ContextMenu contract cross-reference, generated documentation, and browser verification.

## Final verification

Completed in the packed Energy desk application and rendered component showcase. See the [shared verification record](../verification.md) for browser checks, repository checks, package compatibility, and the acceptance mapping.
