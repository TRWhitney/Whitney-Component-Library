# 12 Dialog and Drawer Overlays

**What to build:** Dialog, alert dialog, and drawer exports with library-owned containment,
dismissal, responsive layout, and action composition.

**Blocked by:** [Action Family](03-action-family.md),
[Layout and Surface Primitives](02-layout-and-surface-primitives.md)

**Status:** ready

- [ ] Dialog and alert-dialog contracts distinguish ordinary tasks from consequential confirmation.
- [ ] Focus enters predictably, remains contained where required, and restores on every close path.
- [ ] Escape, backdrop, close action, and programmatic dismissal follow each overlay's explicit
      contract.
- [ ] Required titles, descriptions, action ordering, and destructive semantics are accessible.
- [ ] Drawers preserve dialog behavior while owning edge placement and compact full-screen reflow.
- [ ] Nested and sequential overlays avoid orphaned focus and hidden active content.
- [ ] Scroll locking, viewport changes, touch, keyboard, browser accessibility-tree, theme, reduced
      motion, SSR, hydration, and types pass.
- [ ] Public composition does not expose raw React Aria overlay parts.

## Accepted sources

- [Specification](../spec.md)
- [Behavior and Accessibility Foundation](../decisions/03-behavior-foundation.md)
- [Agent-Facing Contract](../decisions/04-agent-contract.md)

## Completion evidence

Pending implementation.
