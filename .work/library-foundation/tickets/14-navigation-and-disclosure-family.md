# 14 Navigation and Disclosure Family

**What to build:** Tabs, breadcrumbs, pagination, disclosure, accordion, and side-navigation
exports with explicit navigation, selection, expansion, and current-location semantics.

**Blocked by:** [Action Family](03-action-family.md),
[Popover, Tooltip, and Menu Overlays](13-popover-tooltip-and-menu-overlays.md),
[Layout and Surface Primitives](02-layout-and-surface-primitives.md)

**Status:** complete

- [x] Tabs distinguish selection from navigation and own keyboard movement, activation policy, and
      panel relationships.
- [x] Breadcrumbs and pagination expose current location, link semantics, truncation, and compact
      behavior without losing reachability.
- [x] Disclosure and accordion own expansion state, heading relationships, and single or multiple
      expansion rules.
- [x] Side navigation owns hierarchy, current destination, groups, compact collapse, and keyboard
      reachability without becoming an application router.
- [x] Controlled and uncontrolled state and URL integration seams are explicit.
- [x] Focus, touch, keyboard, browser accessibility-tree, directionality, responsive, theme, SSR,
      hydration, and type checks pass.
- [x] Contracts direct agents among tabs, side navigation, menu, disclosure, and ordinary links.

## Accepted sources

- [Specification](../spec.md)
- [Agent-Facing Contract](../decisions/04-agent-contract.md)
- [Foundation Expansion Constraints](../decisions/07-foundation-expansion-constraints.md)

## Completion evidence

Implementation, contracts, generated guidance, public exports, tests, and showcase specimens are
present for the full family. The repository check, showcase build, packed React 18/19 consumer
verification, and direct Chromium interaction and rendering checks pass. Pagination now uses the
same full-width three-pixel selection rail as ToggleButton, formats page numbers through its
required locale, and accepts localized page-control labels. Disclosure and Accordion rows keep
their intended 44-pixel minimum without relying on consumer box sizing. Breadcrumb ancestor links
and the overflow control share one filled, underline-free hover treatment. Collapsed ancestors open
in an anchored ellipsis overlay without displacing page content, retain ordered-path list semantics,
and follow runtime direction changes. The showcase removes descendants after an ancestor
destination is followed and provides the next route from each ancestor page.
Whitney accepted the completed Breadcrumbs behavior and appearance.
Whitney also accepted SideNavigation as the persistent destination list inside an application
sidebar, including its library-owned collapse and expand control.

All accepted interface decisions now have current repository and rendered-browser evidence.

## Applied interface direction

- Existing canvas, base, subtle, text, border, and accent-rail roles provide the complete palette.
- Body labels use the established compact body role. Location metadata and page numbers use the
  utility role.
- Tabs and breadcrumbs form horizontal routes. Disclosure and accordion form quiet vertical
  sequences. Side navigation uses one continuous route rail rather than separate cards.
- Motion is limited to selected-route and expansion transitions, and settles immediately under
  reduced motion.
- The same accent route marker identifies selected content, current location, and expanded
  structure while their semantics remain distinct.
