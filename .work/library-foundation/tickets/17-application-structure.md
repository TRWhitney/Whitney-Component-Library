# 17 Application Structure

**What to build:** Split view, application shell, and workspace/page-header constructs that combine
layout, navigation, actions, identity, status, and responsive regions without owning routing.

**Blocked by:** [Layout and Surface Primitives](02-layout-and-surface-primitives.md),
[Action Family](03-action-family.md), [Navigation and Disclosure Family](14-navigation-and-disclosure-family.md)

**Status:** blocked

- [ ] Split views provide bounded pane sizing, minimums, collapse behavior, keyboard resizing, and
  responsive fallback.
- [ ] Application shell provides explicit navigation, primary workspace, utility, and transient
  feedback regions without an arbitrary slot free-for-all.
- [ ] Workspace/page headers coordinate identity, status, breadcrumbs, and actions while keeping
  their semantics distinct.
- [ ] Route uses flexible meaningful space without crossing labels, duplicating status, or adding
  endpoint halos.
- [ ] Compact reflow preserves region ownership and does not insert arbitrary dividers.
- [ ] Focus order remains coherent as panes collapse, resize, or move.
- [ ] Theme, accent, directionality, zoom, reduced motion, SSR, hydration, and type checks pass.
- [ ] Contracts distinguish application shell, page header, section, panel, and workflow use.

## Accepted sources

- [Specification](../spec.md)
- [Visual Direction and Permitted Variation](../decisions/05-visual-direction.md)
- [Interactive visual reference](../prototypes/visual-directions.html)

## Completion evidence

Pending implementation.
