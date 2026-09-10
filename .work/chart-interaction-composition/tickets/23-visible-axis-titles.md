# 23 Keep axis titles visible at compact widths

**What to build:** Keep complete vertical-axis titles inside the chart's drawable area at compact
sizes, without overlapping tick labels or reducing their readable text size.

**Blocked by:** None

**Status:** complete

- [x] Position and reserve space for rotated titles using their rendered size, including units,
      rather than a fixed coordinate that clips larger SVG text at narrow widths.
- [x] Cover shared Cartesian and statistical axes, including the horizontal-bar orientation.
- [x] Preserve the data domain, plotted values and configured clip/scroll behavior.
- [x] Update the showcase with compact examples containing a title and unit, and retain ordinary
      desktop layout. Verify the title does not extend into inaccessible negative scroll space.
- [x] Add a focused layout regression check for the reproduced 320px canvas defect and a longer
      title/unit case; run required production checks and reviews during implementation.

## Accepted sources

- [Audit evidence and reproduction](../research/compact-layout-audit.md)
- [Compact-layout requirement](../spec.md#compact-chart-layout-consistency)

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
