# 10 Status, Progress, and Alerts

**What to build:** Status indicator, badge, inline alert, alert banner, progress bar, meter, and
spinner exports with independent semantic tones and live-region behavior.

**Blocked by:** [Package, Provider, and Contract Spine](01-package-provider-and-contract-spine.md),
[Layout and Surface Primitives](02-layout-and-surface-primitives.md)

**Status:** complete

- [x] Success, warning or in-progress, danger, neutral, and accent roles remain semantically
      distinct in light and dark appearance.
- [x] Status changes use appropriate live announcements without duplicating labels or overwhelming
      assistive technology.
- [x] Determinate progress, indeterminate progress, bounded meter values, and generic busy state
      remain distinct concepts and contracts.
- [x] Labels, values, units, thresholds, and completion meaning are programmatically available.
- [x] Warning and error treatments do not shift adjacent layout.
- [x] Activity animation persists only while active and settles under reduced motion.
- [x] Semantic contrast, forced-color, SSR, hydration, and public-type checks pass.
- [x] Contracts prevent use of the application accent as a substitute for status meaning.

## Accepted sources

- [Specification](../spec.md)
- [Style and Theme Contract](../decisions/02-style-and-theme-contract.md)
- [Visual Direction and Permitted Variation](../decisions/05-visual-direction.md)
- [Interactive visual reference](../prototypes/visual-directions.html)

## Completion evidence

- StatusIndicator, Badge, InlineAlert, AlertBanner, ProgressBar, Meter, and Spinner expose narrow
  public types and canonical contracts. Accent is excluded from status, alert, and meter tones;
  Badge retains a distinct accent metadata role and ProgressBar uses accent only for active
  structure.
- Focused runtime and type checks cover deliberate live-region modes, determinate and indeterminate
  progress with explicit active and inactive motion states, bounded meters with ordered unit-bearing
  thresholds, non-deferred active and inactive busy state, numeric alert content, invalid domains,
  rounded stable alert geometry, SSR, hydration, forced colors, and reduced motion.
- `npm run check` passes 257 tests, generated guidance, and the TypeScript 5.9, 6, and 7 declaration
  matrix. `npm run verify:package` passes packed React 18.3.1 and 19.2.8 SSR, hydration, public-type,
  explicit-style, and clean browser-build consumers.
- Chromium inspection covers light and dark appearance, wide and compact reflow, forced colors,
  reduced motion, status contrast, arbitrary accent propagation, active and paused progress,
  narrow progress-label wrapping, meter semantics, threshold descriptions, non-deferred
  active/inactive spinner exposure, accessibility-tree relationships, and zero horizontal overflow.
  Temporary inspection screenshots were discarded.
- `npm run showcase:build`, `npm audit --audit-level=high`, `git diff --check`, and the source/test/
  tooling no-`Any` scan pass.
