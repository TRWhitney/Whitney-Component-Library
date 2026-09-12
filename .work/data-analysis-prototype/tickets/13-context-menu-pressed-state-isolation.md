# 13 Isolate context-menu trigger state from target contents

**What to build:** Prevent ContextMenu's open or pressed trigger state from propagating into controls and collection items inside its target.

**Blocked by:** none.

**Status:** complete

## Evidence and client boundary

Right-clicking Birch Hall in Energy desk opens the correct row actions, but every Tree row, chevron, and nested IconButton receives `data-pressed="true"`. Unrelated rows gain accent outlines and campus chevrons gain pressed fills. Their `aria-selected` values do not change; this is leaked interaction state, not multi-selection.

ContextMenu places its arbitrary target children beneath AriaMenuTrigger and its press context. ContextMenuTarget uses `usePress` without isolating nested interactive children from that inherited context. DOM inspection also shows repeated generated IDs on nested buttons while using this composition, so label and control identity isolation should be verified as part of the fix.

The app uses the public ContextMenu wrapper around the public Tree. There is no public isolation option. The prototype retains this composition and records the defect instead of masking pressed styles, reaching into React Aria contexts, or replacing the library's context-menu behavior with a custom menu.

## Acceptance

- [x] Opening a context menu changes only its own trigger state. Unrelated nested rows, buttons, and disclosure controls must not become pressed, selected, or focused.
- [x] Genuine hover, press, focus, selection, and expansion behavior inside the target still works when the menu is closed and after it closes.
- [x] Nested controls keep distinct IDs and correct accessible labeling. The menu trigger must not overwrite their IDs or associations.
- [x] Right-click, Shift+F10, and supported touch context activation open actions for the intended record and preserve focus restoration.
- [x] Check a Tree with branch chevrons and row IconButtons and a Table with nested row actions, including repeated open/close and action execution.
- [x] Add a focused regression check that unrelated descendants do not acquire pressed state when the menu opens.
- [x] Update the ContextMenu contract and a composed collection example in the showcase.

## Accepted sources

- [Approved library fix specification](../spec.md).

- Whitney's screenshot of every campus row highlighted while the context menu is open.
- [ContextMenu implementation](../../../src/overlays/context-menu.tsx).
- [Tree implementation](../../../src/collections/tree.tsx).
- [Prototype composition](../../../prototypes/data-analysis/main.tsx).

## Implementation evidence

ContextMenu now composes public React Aria trigger hooks and public menu/popover state contexts. Trigger DOM handlers stay on the target. No press responder wraps the arbitrary target children, so opening the menu cannot distribute its pressed state or trigger ID to nested controls.

Shift+F10 and the Context Menu key invoke the menu from the target or a descendant. The touch fallback observes pointer down during capture, before a nested row handles the event. Existing menu navigation, invocation-point positioning, dismissal, focus restoration, hydration, and direction checks pass.

`tests/application-collection-regressions.test.tsx` covers distinct descendant IDs, independent row selection and buttons, repeated opening and dismissal, keyboard invocation, and the iOS long-press fallback. The contract is updated. `showcase/collection-interaction-example.tsx` adds composed Tree and Table examples for parent integration and browser verification.

## Final verification

Completed in the packed Energy desk application and rendered component showcase. See the [shared verification record](../verification.md) for browser checks, repository checks, package compatibility, and the acceptance mapping.
