# 23 Data Analysis Prerelease

**What to build:** The data-analysis workspace construct and prerelease slice for searching,
filtering, sorting, selecting, comparing, charting, and inspecting data.

**Blocked by:** [Table, Tree, and Filter Family](16-table-tree-and-filter-family.md),
[Application Structure](17-application-structure.md), [Chart Interaction and Composition](22-chart-interaction-and-composition.md),
[Loading, Empty, and Notification Feedback](11-loading-empty-and-notification-feedback.md)

**Status:** blocked

- [ ] The construct coordinates filter/query state, collection state, chart state, selection, and
  detail inspection through explicit public state rather than hidden application coupling.
- [ ] Table and chart selection can coordinate while retaining their separate roles and focus.
- [ ] Loading, empty, no-results, partial, stale, and error states preserve context and recovery.
- [ ] Responsive reflow keeps dense analysis usable without decorative chart identity or lost data.
- [ ] Keyboard and screen-reader users can perform the same search, selection, comparison, and
  inspection tasks.
- [ ] A clean packed-package fixture implements the complete slice with no private imports or
  external substitute component.
- [ ] Contracts guide agents to the workspace construct and appropriate chart types.
- [ ] Theme, accent, semantic colors, reduced motion, browsers, SSR, hydration, types, and generated
  guidance pass.

## Accepted sources

- [Specification](../spec.md)
- [Prerelease Integration Slice Set](../decisions/14-prerelease-slice-set.md)
- [Charting Scope](../decisions/13-charting-scope.md)

## Completion evidence

Pending implementation.
