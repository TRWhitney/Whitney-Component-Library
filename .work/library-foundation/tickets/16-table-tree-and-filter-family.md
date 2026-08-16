# 16 Table, Tree, and Filter Family

**What to build:** Table, tree, and reusable collection search/filter controls with dense keyboard
navigation, sorting, expansion, selection, and stable data-state behavior.

**Blocked by:** [Basic Data and Collection Family](15-basic-data-and-collection-family.md),
[Select and Combobox](06-select-and-combobox.md), [Action Family](03-action-family.md)

**Status:** blocked

- [ ] Tables support typed columns, headers, rows, sorting, row selection, empty/loading/error
  states, and responsive overflow without implying spreadsheet editing.
- [ ] Trees support hierarchy, expansion, selection where enabled, stable keys, and focus recovery
  after dynamic changes.
- [ ] Search and filter controls produce explicit query state and applied-filter summaries that can
  coordinate with collections without owning data fetching.
- [ ] Keyboard interaction, focus persistence, selection versus activation, and embedded row
  actions are unambiguous.
- [ ] Dense content remains legible in light, dark, compact, forced-color, and zoomed layouts.
- [ ] Async updates preserve announcements and do not reset user context unnecessarily.
- [ ] SSR, hydration, localization, directionality, public types, and canonical contracts pass.
- [ ] Virtualization remains an internal option or later expansion and does not leak into ordinary
  collection APIs.

## Accepted sources

- [Specification](../spec.md)
- [Foundation Expansion Constraints](../decisions/07-foundation-expansion-constraints.md)
- [Behavior and Accessibility Foundation](../decisions/03-behavior-foundation.md)

## Completion evidence

Pending implementation.
