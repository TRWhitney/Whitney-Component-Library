# 15 Basic Data and Collection Family

**What to build:** List, description list, list box, and card exports over a coherent private
collection model with consistent loading, empty, partial, and error states.

**Blocked by:** [Layout and Surface Primitives](02-layout-and-surface-primitives.md),
[Choice Controls](05-choice-controls.md), [Status, Progress, and Alerts](10-status-progress-and-alerts.md)

**Status:** complete

- [x] Static content lists, key/value description lists, selectable list boxes, and grouped cards
      retain distinct semantics and contracts.
- [x] Dynamic collections require stable keys and support insertion, removal, reordering updates,
      and preserved focus where applicable.
- [x] Single, multiple, none, and disabled selection semantics are typed rather than inferred.
- [x] Loading, empty, no-results, partial, and error states use shared feedback components without
      destroying collection context.
- [x] Keyboard navigation, typeahead, focus versus selection, and touch interaction pass.
- [x] Cards cannot silently become interactive containers without the appropriate nested action or
      selection contract.
- [x] Locale, directionality, theme, compact density, SSR, hydration, and types pass.

## Accepted sources

- [Specification](../spec.md)
- [Behavior and Accessibility Foundation](../decisions/03-behavior-foundation.md)
- [Foundation Expansion Constraints](../decisions/07-foundation-expansion-constraints.md)

## Completion evidence

- Focused public tests cover native list and description-list semantics, explicit selection modes,
  disabled items, arrow navigation, locale-aware typeahead, separate focus and selection, keyed
  insertion, removal, and reordering with focus retention, invalid ids, shared loading, empty,
  no-results, partial, and error feedback, static-card actions, selectable-card spatial navigation,
  SSR, hydration, and public type failures.
- Direct Chromium operation covers wide and compact spatial card navigation, initial RTL layout and
  keys, French-context typeahead, touch selection, arbitrary accent, light appearance, forced
  colors, reduced motion, and overflow. Firefox and WebKit cover card layout and spatial navigation,
  typeahead, keyboard selection, and overflow. Corrected wide, compact, and forced-color specimens
  passed rendered inspection.
- `npm run check` passes formatting, ESLint, Stylelint, strict TypeScript, 22 test files with 375
  tests, generated guidance, package build, and the TypeScript 5.9, 6, and 7 declaration matrix.
  `npm run showcase:build`, `npm run verify:package`, `npm audit --audit-level=high`, and
  `git diff --check` pass. Packed React 18.3.1 and 19.2.8 consumers pass SSR, hydration,
  declarations, semantic assertions, and browser builds.
- A public type regression proves predeclared static-card arrays cannot carry an ignored
  `isDisabled` state. The regression failed before `CardCollectionItem` declared
  `isDisabled?: never`; the final full repository, declaration-matrix, and packed-consumer checks
  pass after the correction.
- Independent intent and engineering correction reviews pass with no blocking findings, judgment
  calls, or missing evidence.
