# 20 Statistical Chart Family

**What to build:** Named scatter, bubble, histogram, and box-plot charts on the shared chart frame
with appropriate statistical and distribution semantics.

**Blocked by:** [Cartesian Chart Foundation](19-cartesian-chart-foundation.md)

**Status:** complete

- [x] Scatter and bubble charts define quantitative axes, point identity, optional magnitude, and
      overlap behavior.
- [x] Histograms distinguish raw observations from pre-binned data and never masquerade as an
      ordinary categorical bar chart.
- [x] Box plots define quartile, median, whisker, and outlier inputs and expose those meanings
      programmatically.
- [x] Missing, invalid, non-finite, and out-of-domain data has explicit handling.
- [x] Tooltips and summaries express values, units, bins, and statistical meaning accurately.
- [x] Dense points remain usable through bounded highlighting or selection without color-only
      meaning.
- [x] Responsive, theme, accent, forced-color, reduced-motion, SSR, hydration, and type checks pass.
- [x] Contracts provide counterexamples and preferred alternatives for unsuitable data.

## Accepted sources

- [Specification](../spec.md)
- [Charting Scope](../decisions/13-charting-scope.md)
- [Statistical chart input contracts](../decisions/17-statistical-chart-input-contracts.md)
- [Statistical chart reading](../decisions/18-statistical-chart-reading.md)
- [Statistical chart visual encoding](../decisions/19-statistical-chart-visual-encoding.md)

## Completion evidence

- ScatterChart and BubbleChart accept record-oriented points with stable ids, labels, quantitative
  axes, one to six declared groups, and optional group accessors. BubbleChart maps positive source
  magnitude to proportional area. A pinned legend group receives paint and hit-test priority when
  marks overlap.
- Histogram uses an explicit raw-or-binned distribution contract. Raw thresholds and interval
  inclusion are deterministic; pre-binned count, proportion, and density inputs validate interval
  order, overlap, ordinate bounds, and equal-width count bins. BoxPlot accepts raw observations or
  explicit summaries, calculates R-7 quartiles, supports Tukey and min-max whiskers, stops whisker
  tails at the quartile box, and keeps outliers independently readable.
- The production frame provides graduated axes, required visible titles and descriptions, shared
  feedback states, one keyboard boundary, direct pointer and touch readings, retained touch
  dismissal, polite announcements, and named native data tables. Blank plot space has no inferred
  tooltip. Direct reading dims every other mark; keyboard reading does not.
- Statistical marks use translucent series-color fills with stronger series-color edges. Point
  shapes supplement color, bubble area remains proportional, compact scatter marks retain a bounded
  rendered size, legend pinning controls overlap priority, and box plots distinguish boxes,
  medians, whiskers, and outliers.
- Canonical contracts and generated human guidance explain each chart's own data, interaction, and
  visual semantics without leaking point, bin, legend, magnitude, or box-plot language into charts
  that do not own it. The production showcase contains one accepted specimen for every new public
  chart.
- Focused tests cover point overlap priority, hover clearing, muting, bubble area, raw and binned
  histograms, split box whiskers, separate outliers, keyboard and touch reading, invalid data,
  runtime contract rejection, deterministic SSR, hydration, static styles, public types, canonical
  contracts, and packed-consumer source. `npm run check` passes formatting, zero-warning lint,
  strict source types, all 469 tests, generated-artifact checks, TypeScript 5.9/6/7 declarations,
  and ordinary-component chart isolation.
- `npm run verify:package` passes SSR, hydration, public declarations, semantic assertions, and Vite
  browser builds with packed React 18.3.1 and React 19.2.8 consumers. `npm run showcase:build`,
  `npm audit --audit-level=high`, and `git diff --check` pass.
- Direct Chromium operation and inspected production screenshots cover dark and light appearances,
  arbitrary accent, wide and compact regions, graduated axes, genuine translucent fills, direct
  hover and blank clearing, all-other muting, legend pinning, overlap priority, proportional bubble
  area, histogram readings, split whiskers, separate outliers, forced colors, and reduced motion
  without console or page errors. Broader browser and manual screen-reader hardening remains in the
  accepted Ticket 30 gate.
