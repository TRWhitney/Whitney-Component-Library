# 28 Application Workbench Integration Proof

**What to build:** A non-exported packed-package fixture that composes public navigation, tabs,
panels, commands, overlays, and transient feedback inside a consumer-owned application layout.

**Blocked by:** [Application Structure](17-application-structure.md),
[Navigation and Disclosure Family](14-navigation-and-disclosure-family.md),
[Popover, Tooltip, and Menu Overlays](13-popover-tooltip-and-menu-overlays.md),
[Loading, Empty, and Notification Feedback](11-loading-empty-and-notification-feedback.md)

**Status:** blocked

- [ ] The fixture owns its navigation, workspace, panel, command, utility, and notification regions
      together with its sample router and state.
- [ ] Tabs, side navigation, menus, toolbars, popovers, split views, and notifications compose
      without conflicting focus or selection models.
- [ ] Wide and compact modes preserve current tool, reachable commands, panel state, and content
      focus as regions move or collapse.
- [ ] Each public component preserves its own route, current, selection, status, and continuity
      semantics inside the fixture without requiring the surrounding layout to connect them.
- [ ] A clean packed-package fixture hosts representative ordinary components plus the data-analysis
      and Markdown fixtures through public APIs only.
- [ ] Keyboard, touch, browser accessibility-tree, theme, accent, forced-color, reduced-motion,
      browser, SSR, hydration, types, and generated guidance pass.
- [ ] No application-shell or workbench export, contract, required region arrangement, router, or
      data-store abstraction is introduced. Existing component contracts retain their narrower
      alternatives and composition guidance.

## Accepted sources

- [Specification](../spec.md)
- [Prerelease Integration Slice Set](../decisions/14-prerelease-slice-set.md)
- [Visual Direction and Permitted Variation](../decisions/05-visual-direction.md)

## Completion evidence

Pending implementation.
