# 28 Application Workbench Prerelease

**What to build:** The application-workbench construct and prerelease slice for navigating tools,
managing tabs and panels, invoking commands, and presenting transient feedback.

**Blocked by:** [Application Structure](17-application-structure.md),
[Navigation and Disclosure Family](14-navigation-and-disclosure-family.md),
[Popover, Tooltip, and Menu Overlays](13-popover-tooltip-and-menu-overlays.md),
[Loading, Empty, and Notification Feedback](11-loading-empty-and-notification-feedback.md)

**Status:** blocked

- [ ] The construct owns bounded navigation, workspace, panel, command, utility, and notification
      regions without owning an application router or data store.
- [ ] Tabs, side navigation, menus, toolbars, popovers, split views, and notifications compose
      without conflicting focus or selection models.
- [ ] Wide and compact modes preserve current tool, reachable commands, panel state, and content
      focus as regions move or collapse.
- [ ] Route and continuity language connects meaningful regions without duplicating active, current,
      or status signals.
- [ ] A clean packed-package fixture hosts representative ordinary components, the data workspace,
      and Markdown workspace through public APIs only.
- [ ] Keyboard, touch, screen-reader, theme, accent, forced-color, reduced-motion, browser, SSR,
      hydration, types, and generated guidance pass.
- [ ] Contracts guide agents between application shell, workbench, page header, and simpler layout
      alternatives.

## Accepted sources

- [Specification](../spec.md)
- [Prerelease Integration Slice Set](../decisions/14-prerelease-slice-set.md)
- [Visual Direction and Permitted Variation](../decisions/05-visual-direction.md)

## Completion evidence

Pending implementation.
