# 03 Heatmap

**What to build:** A public Heatmap with ordered row and column domains, explicit missing cells,
sequential or two-sided scales, grid reading, dense local overflow, contracts, and a production
example.

**Blocked by:** none

**Status:** complete

- [x] Typed public inputs accept ordered labeled row and column domains, cell coordinate and value
      accessors, shared unit and formatting, sequential or two-sided scale, optional fixed range,
      localized missing copy, chart state, color key, and sizing without renderer types.
- [x] Runtime preparation preserves domain order, rejects duplicate or undeclared coordinates,
      accepts negative and zero values, distinguishes missing coordinates from zero, and applies
      partial or invalid feedback to non-finite records.
- [x] Numeric cells share one scale. The two-sided form honors its declared midpoint. Missing cells
      use a neutral non-color treatment outside the numeric scale, and the visible color key explains
      both numeric and missing meaning.
- [x] Pointer and touch start only on cells. Arrow, Home, End, Control Home, and Control End traverse
      the complete grid. Missing cells remain readable and use the localized missing label.
- [x] Cell text disappears before cells become illegible. Larger grids use a separately labeled
      local scroll region with ScrollRegion's transient scrollbar and retain every row and column in
      the generated table.
- [x] Public contract guidance covers honest color-scale use, zero versus missing, fixed comparison
      ranges, and alternatives to unreadably large grids. The production showcase includes
      sequential, two-sided, zero, and missing examples.
- [x] Focused public tests, scale and grid checks, type fixtures, SSR and hydration checks,
      appearance, forced-color and responsive browser evidence, package verification, and the full
      repository check pass.

## Accepted sources

- [Specification](../spec.md)
- [Heatmap grid and value scale](../decisions/03-heatmap-grid-and-value-scale.md)
- [Chart-family reading](../decisions/05-reading-and-structured-alternatives.md)
- [Visual and responsive behavior](../decisions/06-visual-encoding-and-responsive-behavior.md)
- [Shared chart reading](../../chart-interactivity/spec.md)
- [Role-aware chart colors](../../chart-accent-palette/spec.md)
- [Chart semantics and accessibility research](../research/chart-semantics-and-accessibility.md)

## Completion evidence

- `npm run check` passes formatting, ESLint, Stylelint, TypeScript, 522 tests, generated
  documentation, the supported TypeScript matrix, production builds, and chart isolation.
- `npm run verify:package` passes clean React 18.3.1 and React 19.2.8 consumers, SSR, hydration,
  public types, and browser builds. `npm run showcase:build` and `git diff --check` also pass.
- Focused public tests cover ordered complete tables, negative and zero values, explicit missing
  cells, derived and fixed scales, finite numeric extremes, invalid and duplicate records, empty
  and feedback states, pointer, touch, keyboard traversal, dense overflow, model reconciliation,
  SSR, and hydration. Public type fixtures reject invalid accessors, scales, and renderer injection.
- Playwright operation covers cursor-following and cell-anchored tooltips, missing-cell readings,
  complete keyboard traversal, light and dark appearance, forced colors, reduced motion, and a
  280 by 260 constrained area. The constrained chart keeps its caption and full key visible while
  the complete grid scrolls locally with an idle transparent scrollbar and no visible outline.
- Delivery corrections preserve columns at vertical keyboard boundaries, reveal keyboard-selected
  cells in both directions, attach measurement after feedback states resolve, and base dense
  overflow on the space cells actually receive. Public minimum height now affects grid geometry,
  and touch readings survive pointer leave as intended.
- Focused scale and identity checks confirm a neutral two-sided midpoint, logical RTL key direction,
  and collision-safe row and column lookup even when identifiers contain separator characters.
- Final correction coverage confirms a retained touch reading returns after temporary mouse hover
  on hybrid input and that roomy compact grids keep their inline values. Direct browser operation
  reproduces touch, mouse, and mouse-leave ownership and shows all recorded values at a 400px frame.
- Independent intent and engineering correction reviews pass with no findings across every admitted
  keyboard, overflow, sizing, scale, identity, lifecycle, and hybrid-input correction.
