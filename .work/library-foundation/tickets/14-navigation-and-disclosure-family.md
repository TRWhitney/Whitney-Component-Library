# 14 Navigation and Disclosure Family

**What to build:** Tabs, breadcrumbs, pagination, disclosure, accordion, and side-navigation
exports with explicit navigation, selection, expansion, and current-location semantics.

**Blocked by:** [Action Family](03-action-family.md),
[Popover, Tooltip, and Menu Overlays](13-popover-tooltip-and-menu-overlays.md),
[Layout and Surface Primitives](02-layout-and-surface-primitives.md)

**Status:** blocked

- [ ] Tabs distinguish selection from navigation and own keyboard movement, activation policy, and
  panel relationships.
- [ ] Breadcrumbs and pagination expose current location, link semantics, truncation, and compact
  behavior without losing reachability.
- [ ] Disclosure and accordion own expansion state, heading relationships, and single or multiple
  expansion rules.
- [ ] Side navigation owns hierarchy, current destination, groups, compact collapse, and keyboard
  reachability without becoming an application router.
- [ ] Controlled and uncontrolled state and URL integration seams are explicit.
- [ ] Focus, touch, keyboard, screen-reader, directionality, responsive, theme, SSR, hydration, and
  type checks pass.
- [ ] Contracts direct agents among tabs, side navigation, menu, disclosure, and ordinary links.

## Accepted sources

- [Specification](../spec.md)
- [Agent-Facing Contract](../decisions/04-agent-contract.md)
- [Foundation Expansion Constraints](../decisions/07-foundation-expansion-constraints.md)

## Completion evidence

Pending implementation.
