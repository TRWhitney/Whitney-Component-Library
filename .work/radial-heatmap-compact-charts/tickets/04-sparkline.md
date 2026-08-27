# 04 Sparkline

**What to build:** A public one-series Sparkline with the standard chart caption, honest gaps,
derived range context, accepted current and observed-range cues, compact reading, contracts, and a
production example.

**Blocked by:** none

**Status:** complete

- [x] Typed public inputs accept one ordered categorical, numeric, or time series, numeric value
      meaning and formatting, derived or fixed range, localized missing copy, standard caption,
      chart state, and minimum size without axes, a legend, or renderer types.
- [x] Runtime preparation preserves source order, accepts negative and zero, renders missing values
      as unconnected gaps, applies partial feedback to non-finite records, and derives exact first,
      last, low, and high valid values.
- [x] The current record uses a hollow cue, every tied observed low fills its circle's lower half,
      every tied high fills the upper half, and the current treatment wins at the endpoint. Hover
      fills a cue's open area with the foreground color. Static cues never replace exact tooltip,
      announcement, or table values.
- [x] Nearest-record pointer and touch reading, Left and Right, Home and End, missing-value reading,
      Escape, focus, tooltip, announcement, feedback, and generated table retain the delivered
      LineChart conventions.
- [x] Sparkline keeps the standard visible title and description, omits axes and legend, never
      scrolls locally, and remains readable at its provisional compact default and consumer-supplied
      minimum size.
- [x] Public contract guidance directs multi-series, visible-axis, and precise-comparison needs to
      other charts. The production showcase includes gaps, current and tied extremes, and a fixed
      comparison range.
- [x] Focused public tests, cue and gap checks, type fixtures, SSR and hydration checks, appearance,
      forced-color and compact browser evidence, package verification, and the full repository
      check pass.

## Accepted sources

- [Specification](../spec.md)
- [Sparkline context and input](../decisions/04-sparkline-context-and-input.md)
- [Chart-family reading](../decisions/05-reading-and-structured-alternatives.md)
- [Visual and responsive behavior](../decisions/06-visual-encoding-and-responsive-behavior.md)
- [Accepted Sparkline caption prototype](../prototypes/sparkline-caption.md)
- [Accepted Sparkline cue prototype](../prototypes/sparkline-cues.md)
- [Shared chart reading](../../chart-interactivity/spec.md)
- [Role-aware chart colors](../../chart-accent-palette/spec.md)

## Completion evidence

- `npm run check` passes formatting, ESLint, Stylelint, TypeScript, 548 tests, generated
  documentation, the supported TypeScript matrix, production builds, and chart isolation.
- `npm run verify:package` passes clean React 18.3.1 and React 19.2.8 consumers, SSR, hydration,
  public types, and browser builds. `npm run showcase:build` and `git diff --check` also pass.
- Focused tests cover gaps, isolated valid records, every tied extreme, current-cue precedence,
  exact summaries, complete tables including all-missing series, negative and zero values, fixed
  ranges, invalid records, feedback states, categorical, linear, logarithmic, and time positions,
  finite numeric and date boundaries, pointer, touch, keyboard, model reconciliation, SSR, and
  hydration. Public type fixtures reject invalid values, normalization, malformed ranges, and
  renderer injection.
- Playwright inspection covers light, dark, forced-color, and 280px compact rendering. Browser
  operation confirms cursor-following tooltips, missing readings, Escape clearing, no local
  overflow, and a stable active reading point at 456px, 240px, and 100px widths.
- Delivery review found that all-missing data lost its valid table rows, the live reading was not
  atomic, the active reading point collapsed under shared CSS, boundary logarithmic and time
  positions could produce non-finite geometry, and fractional logarithmic bases departed from the
  shared scale contract. Each correction has focused green coverage.
- Final rendered review confirms Sparkline leaves ordinary connected values unmarked, fills the
  lower half of tied-low circles and the upper half of high circles, preserves a hollow current cue
  and isolated-value mark, fills the open portion of existing cues on hover, and uses a solid
  foreground point for ordinary readings. Its bounded default chart area still allows a larger
  consumer minimum to use available parent space.
- Independent intent and engineering correction reviews pass with no findings.
