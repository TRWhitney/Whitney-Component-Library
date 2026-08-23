# 13 Popover, Tooltip, and Menu Overlays

**What to build:** Popover, tooltip, menu, and context-menu exports with distinct content,
activation, focus, dismissal, and anchored-placement contracts.

**Blocked by:** [Action Family](03-action-family.md),
[Dialog and Drawer Overlays](12-dialog-and-drawer-overlays.md)

**Status:** complete

- [x] Contracts distinguish supplemental non-interactive description, interactive anchored content,
      command menus, and context actions.
- [x] Mouse, touch, keyboard, long-press where appropriate, and focus activation are coherent.
- [x] Tooltips never contain required interactive content and do not replace accessible names.
- [x] Menus own roving focus, typeahead, disabled items, groups, separators, submenus where
      supported, and action dismissal.
- [x] Context menus have keyboard and touch alternatives to right-click.
- [x] Anchored placement responds to viewport and scroll without clipping or detached arrows.
- [x] Focus restoration, nested overlays, theme, reduced motion, SSR, hydration, and type checks
      pass.
- [x] Public APIs preserve library-owned items and actions rather than exposing private parts.

## Accepted sources

- [Specification](../spec.md)
- [Behavior and Accessibility Foundation](../decisions/03-behavior-foundation.md)
- [Foundation Expansion Constraints](../decisions/07-foundation-expansion-constraints.md)

## Completion evidence

- `npm run check` passes formatting, zero-warning linting, strict source types, 345 tests,
  generated guidance, and public declarations under TypeScript 5.9, 6, and 7.
- `npm run showcase:build`, `npm run verify:package`, `npm audit --audit-level=high`,
  `git diff --check`, and the explicit source/test/tooling no-`Any` scan pass. Packed React 18.3.1
  and React 19.2.8 consumers pass SSR, hydration, types, and browser builds.
- Chromium direct interaction covers Popover focus entry and restoration, Menu typeahead and action
  dismissal, ContextMenu keyboard activation, rejection of ambiguous triggers, warning-free
  positioning at distinct pointer invocation points, and focus restoration after right-click and
  trusted touch long-press. Accessibility snapshots expose the expected dialog and menu structures.
- Chromium, Firefox, and WebKit rendered inspection covers viewport-constrained Popover, Menu, and
  ContextMenu pointer attachment. The non-tooltip pointer joins the accent rail at its centerline,
  stays outside the rounded corner, and masks the underlying border across whole and fractional
  device-pixel positions. Tooltip retains its neutral edge.
- Chromium inspection additionally covers nested Menu placement, light and dark appearance,
  locally scoped RTL behavior, reduced motion, and forced colors. Whitney accepted the corrected
  rendered pointers after direct visual review.
- A later navigation-family review removed the leading state rail from Menu and ContextMenu rows.
  Hover and focus now use the whole-row highlight, while keyboard focus keeps its visible outline.
