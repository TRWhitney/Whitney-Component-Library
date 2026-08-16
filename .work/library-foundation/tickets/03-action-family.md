# 03 Action Family

**What to build:** Button, icon button, link, toggle button, button group, and toolbar exports with
clear command, navigation, and persistent-selection semantics.

**Blocked by:** [Package, Provider, and Contract Spine](01-package-provider-and-contract-spine.md),
[Layout and Surface Primitives](02-layout-and-surface-primitives.md)

**Status:** blocked

- [ ] Command buttons and navigation links cannot be confused through a polymorphic escape hatch.
- [ ] Icon-only actions require an accessible name and provide consistent tooltip guidance where
  appropriate.
- [ ] Toggle actions expose pressed state distinctly from ordinary activation and disabled state.
- [ ] Button groups and toolbars own applicable grouping and keyboard-navigation semantics.
- [ ] Hover, focus, press, pending, disabled, and reduced-motion behavior follows the visual
  contract without layout movement or adjacent overlap.
- [ ] Public APIs translate rather than extend React Aria prop types.
- [ ] Form submission and reset behavior remains native and explicit.
- [ ] Contracts direct agents among button, link, toggle, group, and toolbar alternatives.
- [ ] Behavior, accessibility, theme, SSR, hydration, and public-type checks pass.

## Accepted sources

- [Specification](../spec.md)
- [Behavior and Accessibility Foundation](../decisions/03-behavior-foundation.md)
- [Agent-Facing Contract](../decisions/04-agent-contract.md)
- [Visual Direction and Permitted Variation](../decisions/05-visual-direction.md)

## Completion evidence

Pending implementation.
