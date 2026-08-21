# 10 Status, Progress, and Alerts

**What to build:** Status indicator, badge, inline alert, alert banner, progress bar, meter, and
spinner exports with independent semantic tones and live-region behavior.

**Blocked by:** [Package, Provider, and Contract Spine](01-package-provider-and-contract-spine.md),
[Layout and Surface Primitives](02-layout-and-surface-primitives.md)

**Status:** ready

- [ ] Success, warning or in-progress, danger, neutral, and accent roles remain semantically
      distinct in light and dark appearance.
- [ ] Status changes use appropriate live announcements without duplicating labels or overwhelming
      assistive technology.
- [ ] Determinate progress, indeterminate progress, bounded meter values, and generic busy state
      remain distinct concepts and contracts.
- [ ] Labels, values, units, thresholds, and completion meaning are programmatically available.
- [ ] Warning and error treatments do not shift adjacent layout.
- [ ] Activity animation persists only while active and settles under reduced motion.
- [ ] Semantic contrast, forced-color, SSR, hydration, and public-type checks pass.
- [ ] Contracts prevent use of the application accent as a substitute for status meaning.

## Accepted sources

- [Specification](../spec.md)
- [Style and Theme Contract](../decisions/02-style-and-theme-contract.md)
- [Visual Direction and Permitted Variation](../decisions/05-visual-direction.md)
- [Interactive visual reference](../prototypes/visual-directions.html)

## Completion evidence

Pending implementation.
