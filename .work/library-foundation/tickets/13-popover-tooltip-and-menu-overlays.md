# 13 Popover, Tooltip, and Menu Overlays

**What to build:** Popover, tooltip, menu, and context-menu exports with distinct content,
activation, focus, dismissal, and anchored-placement contracts.

**Blocked by:** [Action Family](03-action-family.md),
[Dialog and Drawer Overlays](12-dialog-and-drawer-overlays.md)

**Status:** blocked

- [ ] Contracts distinguish supplemental non-interactive description, interactive anchored content,
      command menus, and context actions.
- [ ] Mouse, touch, keyboard, long-press where appropriate, and focus activation are coherent.
- [ ] Tooltips never contain required interactive content and do not replace accessible names.
- [ ] Menus own roving focus, typeahead, disabled items, groups, separators, submenus where
      supported, and action dismissal.
- [ ] Context menus have keyboard and touch alternatives to right-click.
- [ ] Anchored placement responds to viewport and scroll without clipping or detached arrows.
- [ ] Focus restoration, nested overlays, theme, reduced motion, SSR, hydration, and type checks
      pass.
- [ ] Public APIs preserve library-owned items and actions rather than exposing private parts.

## Accepted sources

- [Specification](../spec.md)
- [Behavior and Accessibility Foundation](../decisions/03-behavior-foundation.md)
- [Foundation Expansion Constraints](../decisions/07-foundation-expansion-constraints.md)

## Completion evidence

Pending implementation.
