# 04 Sparkline

**What to build:** A public one-series Sparkline with the standard chart caption, honest gaps,
derived range context, accepted current and observed-range cues, compact reading, contracts, and a
production example.

**Blocked by:** none

**Status:** ready-for-agent

- [ ] Typed public inputs accept one ordered categorical, numeric, or time series, numeric value
      meaning and formatting, derived or fixed range, localized missing copy, standard caption,
      chart state, and minimum size without axes, a legend, or renderer types.
- [ ] Runtime preparation preserves source order, accepts negative and zero, renders missing values
      as unconnected gaps, applies partial feedback to non-finite records, and derives exact first,
      last, low, and high valid values.
- [ ] The current record uses the filled cue, every tied observed low and high uses a hollow cue,
      and a current extreme keeps the filled treatment. Static cues never replace exact tooltip,
      announcement, or table values.
- [ ] Nearest-record pointer and touch reading, Left and Right, Home and End, missing-value reading,
      Escape, focus, tooltip, announcement, feedback, and generated table retain the delivered
      LineChart conventions.
- [ ] Sparkline keeps the standard visible title and description, omits axes and legend, never
      scrolls locally, and remains readable at its provisional compact default and consumer-supplied
      minimum size.
- [ ] Public contract guidance directs multi-series, visible-axis, and precise-comparison needs to
      other charts. The production showcase includes gaps, current and tied extremes, and a fixed
      comparison range.
- [ ] Focused public tests, cue and gap checks, type fixtures, SSR and hydration checks, appearance,
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

Pending implementation.
