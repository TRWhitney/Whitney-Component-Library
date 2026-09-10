# 22 Consistent axis label fitting

**What to build:** Apply the established axis-label space-saving behavior to crowded time and
numeric axes, and make box plots render the staggering their layout already requests.

**Blocked by:** None

**Status:** complete

- [x] Consider the actual formatted tick labels for all horizontal axis types. Try readable
      spacing and staggered rows before reducing density; respect existing local overflow behavior.
- [x] Forward box-plot staggering consistently through its label layout and rendering.
- [x] Keep ticks at their actual data coordinates. Do not truncate numeric/date text into
      ambiguous values, change data domains to make labels fit, or silently hide configured ticks
      where existing spacing/staggering/overflow can preserve them.
- [x] Keep axis titles, selection indicators and focus/activation feedback clear of both label
      rows. Selection and callbacks retain the same item identities during resizing.
- [x] Demonstrate crowded categorical/time/numeric and box examples in the human-facing
      showcase, including narrow and wider containers. Preserve the approved line pan/zoom study.
- [x] Add focused production coverage for crowded time/numeric labels and the box propagation
      defect, with a rendered compact-width check. Include a non-UTC browser timezone in date checks.
- [x] Run the repository's required production checks and reviews when implementing this ticket.

## Accepted sources

- [Audit evidence and reproduction](../research/compact-layout-audit.md)
- [Compact-layout requirement](../spec.md#compact-chart-layout-consistency)
- [Approved line-chart pan and zoom](../prototypes/domain-exploration.md#accepted-pan-and-zoom-contract)

## Completion evidence

Implementation and validation complete. Independent intent and engineering reviews passed with no findings.

- Focused public-component regressions first reproduced missing time/numeric/box staggering and
  the clipped title. A long-title regression then reproduced missing wrapping. They now pass.
- `npm run check`: formatting, both linters, types, 758 tests in 47 files, generated documentation,
  TypeScript 5/6/7 consumer checks and chart bundle isolation pass.
- `npm run verify:package`: packed SSR, hydration, declarations and browser builds pass with
  React 18.3.1 and 19.2.8. `npm run showcase:build` passes.
- Operated production showcase at 360px and 768px, plus narrow theme checks at 390px in
  America/Denver time. Crowded date/numeric/box rows no longer overlap; titles remain within
  SVG bounds in dark and light themes. Local scroll reaches the last ticks.
- Corrected a pre-existing interaction test's rounded midpoint ambiguity: its pointer now sits
  inside the intended month's region. Production selection behavior was not changed.
