# 04 Field and Text Entry Family

**What to build:** Field, field group, form section, text field, text area, number field, and search
field exports with stable validation layout and shared labeling conventions.

**Blocked by:** [Package, Provider, and Contract Spine](01-package-provider-and-contract-spine.md),
[Layout and Surface Primitives](02-layout-and-surface-primitives.md)

**Status:** blocked

- [ ] Label, description, requirement, validation, and error relationships are accessible and
  deterministic.
- [ ] Validation feedback never raises, resizes, or misaligns an adjacent equivalent control.
- [ ] Text, multiline, numeric, and search semantics remain distinct in their public APIs and
  contracts.
- [ ] Number entry owns formatting, stepping, locale, bounds, and invalid intermediate input.
- [ ] Controlled, uncontrolled, read-only, disabled, required, invalid, pending, and form-reset
  behavior is covered.
- [ ] Field groups and sections provide bounded composition without becoming generic styling
  containers.
- [ ] Adjacent equivalent fields maintain consistent control dimensions in every state.
- [ ] Keyboard, touch, screen-reader, directionality, theme, SSR, hydration, and type checks pass.

## Accepted sources

- [Specification](../spec.md)
- [Foundation Expansion Constraints](../decisions/07-foundation-expansion-constraints.md)
- [Visual Direction and Permitted Variation](../decisions/05-visual-direction.md)

## Completion evidence

Pending implementation.
