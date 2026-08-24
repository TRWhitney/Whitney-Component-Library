# 16 Table, Tree, and Filter Family

**What to build:** Table, tree, and reusable collection search/filter controls with dense keyboard
navigation, sorting, expansion, selection, and stable data-state behavior.

**Blocked by:** [Basic Data and Collection Family](15-basic-data-and-collection-family.md),
[Select and Combobox](06-select-and-combobox.md), [Action Family](03-action-family.md)

**Status:** complete

- [x] Tables support typed columns, headers, rows, sorting, row selection, empty/loading/error
      states, and responsive overflow without implying spreadsheet editing.
- [x] Trees support hierarchy, expansion, selection where enabled, stable keys, and focus recovery
      after dynamic changes.
- [x] Search and filter controls produce explicit query state and applied-filter summaries that can
      coordinate with collections without owning data fetching.
- [x] Keyboard interaction, focus persistence, selection versus activation, and embedded row
      actions are unambiguous.
- [x] Dense content remains legible in light, dark, compact, forced-color, and zoomed layouts.
- [x] Async updates preserve announcements and do not reset user context unnecessarily.
- [x] SSR, hydration, localization, directionality, public types, and canonical contracts pass.
- [x] Virtualization remains an internal option or later expansion and does not leak into ordinary
      collection APIs.

## Accepted sources

- [Specification](../spec.md)
- [Foundation Expansion Constraints](../decisions/07-foundation-expansion-constraints.md)
- [Behavior and Accessibility Foundation](../decisions/03-behavior-foundation.md)

## Completion evidence

- Focused public tests cover typed table columns and complete row cells, application-owned sorting,
  single and multiple selection, disabled selection, embedded actions, arrow and typeahead focus,
  keyed insertion and reordering, recursive tree expansion, disabled tree items, focus recovery
  after removal, controlled and uncontrolled complete queries, removable applied summaries,
  invalid ids and data shapes, ready/loading/error feedback, SSR, hydration, and public type
  failures.
- Direct Chromium operation proves sorting, query filtering and clearing, selection versus embedded
  actions, a painted table-row hover boundary, sorting by Run, Status, and Profile, an eight-pixel
  filter-summary gap, six default filtered showcase rows and eight rows after clearing, row overflow
  at compact widths, containment at 200 percent zoom, RTL table and tree layout, forced colors, and
  reduced motion. Firefox and WebKit confirm the named search, grid, and treegrid structures and
  responsive overflow. Wide, compact, RTL, zoomed, and forced-color specimens passed rendered
  inspection without document overflow or page errors.
- Table, Tree, ListBox, Disclosure, and Accordion rows retain their background and use a one-pixel
  accent outline for pointer hover or press, while keyboard focus remains stronger. Selectable cards
  use their leading rail alone when selected and add an accent boundary only while hovered or
  pressed. The filter bar removes unused field-support tracks so summaries sit one standard spacing
  unit below their controls.
- `npm run check` passes formatting, zero-warning ESLint and Stylelint, strict source types, 23 test
  files with 393 tests, generated guidance, package build, and public declarations under TypeScript
  5.9, 6, and 7. `npm run showcase:build`, `npm run verify:package`, and `git diff --check` pass.
  Packed React 18.3.1 and 19.2.8 consumers pass SSR, hydration, declarations, advanced-collection
  semantics, and browser builds.
- Independent intent and engineering correction reviews pass with no blocking findings, unresolved
  judgments, nonblocking follow-ups, or missing evidence. They confirm the cell-painted row boundary
  and the three sortable data columns satisfy the corrected Ticket 16 behavior without changing
  row layout, selection, RTL edges, forced-color visibility, or action-column semantics.
