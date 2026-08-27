# 01 PieChart and DonutChart

**What to build:** Public PieChart and DonutChart components with ranked eight-category paging,
configurable aggregate sizing, accepted slice and legend interaction, bounded responsive layout,
complete structured output, contracts, and production examples.

**Blocked by:** none

**Status:** complete

- [x] Typed public inputs accept stable category identity, label, finite nonnegative value, shared
      value meaning, formatting, localized copy, chart state, sizing, and
      `aggregateSizing="proportional" | "smallest"` without exposing renderer types.
- [x] Runtime preparation ranks positive values with stable ties, omits zero slices while retaining
      zero table rows, distinguishes all-zero empty data from invalid data, applies partial or
      invalid feedback to negative, non-finite, or unusable records, and rejects duplicate ids at
      the structural boundary.
- [x] Eight or fewer positive categories render proportionally. Larger sets use the accepted first
      page, groups of eight, proportional default aggregate, smallest option, Back traversal,
      localized range announcement, and complete-table behavior.
- [x] The aggregate has a dashed boundary and bold slice-aware `+N`; DonutChart has a readable
      complete total and localized unit in its center. Repeated color roles retain a stable
      non-color distinction.
- [x] Pointer, touch, and keyboard reading use the accepted tooltip copy and placement. Aggregate
      activation, Back, focus continuity, announcement, and tooltip clearing match the accepted
      prototype.
- [x] Slice hover pops out and opens a tooltip. Legend hover and focus pop out without a tooltip.
      Legend clicking pins, replaces, toggles, and clears with Escape using the existing emphasis
      hierarchy.
- [x] Width and height both bound the chart. Compact caption, page, Back, legend, plot allocation,
      stacking, and ScrollRegion scrollbar behavior match the accepted responsive contract without
      copying prototype-only container chrome.
- [x] Public contracts, generated guidance, public exports, production showcase examples, and
      appropriate-use counterexamples cover both components.
- [x] Focused public tests, type fixtures, SSR and hydration checks, appearance and forced-color
      checks, responsive browser evidence, package verification, and the full repository check pass.

## Accepted sources

- [Specification](../spec.md)
- [Pie and donut part-to-whole contract](../decisions/01-pie-donut-part-to-whole.md)
- [Chart-family reading](../decisions/05-reading-and-structured-alternatives.md)
- [Visual and responsive behavior](../decisions/06-visual-encoding-and-responsive-behavior.md)
- [Accepted pie and donut prototype](../prototypes/pie-donut-paging.md)
- [Architecture decision: Page large part-to-whole charts](../../../docs/adr/0015-page-large-part-to-whole-charts.md)
- [Shared chart reading](../../chart-interactivity/spec.md)
- [Role-aware chart colors](../../chart-accent-palette/spec.md)

## Completion evidence

- `npm run check` passes formatting, both configured linters, TypeScript, 483 tests, generated
  documentation, the supported TypeScript matrix, the production build, and chart isolation.
- `npm run verify:package`, `npm run showcase:build`, and `git diff --check` pass. Package checks
  cover clean React 18.3.1 and React 19.2.8 consumers, SSR, hydration, types, and browser builds.
- Direct browser operation confirms ranked paging through three pages and every Back step,
  aggregate identity isolation, zero-plus-invalid feedback, tooltip clearing, pointer tracking,
  compact Back sizing, legend behavior, complete table output, transient scrollbar timing, and
  bounded layouts.
- Inspected light, dark, and forced-color renders at compact and regular sizes show no clipping or
  overflow. Forced colors preserve slice boundaries and the aggregate dash, while reduced motion
  removes segment transitions.
- Independent intent and engineering correction reviews pass with no findings.
