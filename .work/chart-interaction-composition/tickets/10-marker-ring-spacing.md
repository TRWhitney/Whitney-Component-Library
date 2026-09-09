# 10 Close chart marker gaps

**What to build:** Make circular scatter, bubble and outlier selection rings meet the actual mark border at every rendered scale and emphasis state. Make existing radar reading fills meet their point border.

**Blocked by:** none

**Status:** complete

- [x] Circular selection rings follow the normal/emphasized mark border without gaps or covering it.
- [x] Mark size, hit testing, noncircular symbol contours, bubble reading centers and activation remain unchanged.
- [x] Radar reading fills meet the colored border at enlarged and compact scales, preserving zero-value readings.
- [x] Showcase explains and demonstrates the corrected spacing. Public regression coverage and native compact/light/dark operation pass.

## Accepted sources

- [Marker ring spacing](../spec.md#marker-ring-spacing)
- Whitney requested cross-chart gap checks, then authorized correcting the confirmed issues.

## Completion evidence

Diagnosis: the fixed two-pixel radius increase leaves a 0.125px circle gap at the observed 1.75px normal mark stroke and overlaps an emphasized border. Public showcase styles confirmed this at 1200px and 480px viewports. The three statistical regressions failed before correction, then passed. The radar regression also failed before correction at enlarged scale. Focused statistical and radar suites pass. `npm run build`, `npm run check` with 649 tests across 40 files, `npm run showcase:build`, and `npm run verify:package` pass, including declarations in TypeScript 5/6/7 and packed React 18/19 SSR/hydration/browser builds.

Native browser operation selected circular scatter, bubble and outlier marks and measured the normal and emphasized ring edges. All six differences are zero within floating-point precision. Dark selection states and light compact radar fills were visually inspected. Marker sizes and bubble areas remain unchanged. Showcase explanations and generated guides are current. Independent read-only intent and engineering review passes with no findings.
