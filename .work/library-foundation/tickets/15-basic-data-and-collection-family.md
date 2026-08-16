# 15 Basic Data and Collection Family

**What to build:** List, description list, list box, and card exports over a coherent private
collection model with consistent loading, empty, partial, and error states.

**Blocked by:** [Layout and Surface Primitives](02-layout-and-surface-primitives.md),
[Choice Controls](05-choice-controls.md), [Status, Progress, and Alerts](10-status-progress-and-alerts.md)

**Status:** blocked

- [ ] Static content lists, key/value description lists, selectable list boxes, and grouped cards
      retain distinct semantics and contracts.
- [ ] Dynamic collections require stable keys and support insertion, removal, reordering updates,
      and preserved focus where applicable.
- [ ] Single, multiple, none, and disabled selection semantics are typed rather than inferred.
- [ ] Loading, empty, no-results, partial, and error states use shared feedback components without
      destroying collection context.
- [ ] Keyboard navigation, typeahead, focus versus selection, and touch interaction pass.
- [ ] Cards cannot silently become interactive containers without the appropriate nested action or
      selection contract.
- [ ] Locale, directionality, theme, compact density, SSR, hydration, and types pass.

## Accepted sources

- [Specification](../spec.md)
- [Behavior and Accessibility Foundation](../decisions/03-behavior-foundation.md)
- [Foundation Expansion Constraints](../decisions/07-foundation-expansion-constraints.md)

## Completion evidence

Pending implementation.
