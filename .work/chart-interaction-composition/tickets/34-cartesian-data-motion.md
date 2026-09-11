# 34 Animate Cartesian data changes

**What to build:** Deliver approved value/range motion, category movement, fading membership changes and coordinated scale fitting across the Cartesian renderer, with stable identities and truthful readings.

**Blocked by:** None. Shared motion support is integrated with ticket 34.

**Status:** complete

- [x] Implement the accepted motion with interruption, reduced motion and deterministic first render.
- [x] Preserve actual source readings/callbacks, visible-geometry interaction, identity and established chart behavior.
- [x] Cover the behavior through public regressions and native compact/wide interaction.
- [x] Update rendered production examples, canonical contracts and generated guidance; pass configured checks and independent production review.

## Accepted sources

- [Production boundary](../spec.md#production-data-transition-boundary)
- [Value motion](../prototypes/value-motion.md#acceptance-contract)
- [Membership and order](../prototypes/data-transitions.md#acceptance-contract)

## Completion evidence

- Focused command: `vitest run tests/cartesian-data-motion.test.tsx tests/cartesian-charts.test.tsx tests/chart-visibility.test.tsx tests/line-chart-interaction.test.tsx tests/bar-chart-interaction.test.tsx tests/area-mixed-chart-interaction.test.tsx tests/range-chart.test.tsx tests/line-chart-exploration.test.tsx tests/cartesian-chart-exploration.test.tsx`.
- Eleven new regressions cover moving values and range limits, category/selection alignment, actual callbacks, fading bars, interruption, reduced motion, fitted scales/gutters, ambiguous identity fallback, and immediate automatic bounds for ambiguous data and missing range topology. Red failures were observed before implementation and before the gutter/identity corrections.
- Native 390px and 1280px examples cover grouped columns, horizontal bars, lines, areas and line plus range. Updated values move, category reorder retains its underline, membership fades, source readings remain current, and the accepted label fitting and outlines remain intact. Dark and light states were inspected. Temporary screenshots were removed after inspection.
- `npm run check` passes all 904 tests and configured checks. `npm run verify:package` passes React 18/19 SSR, hydration, types and browser builds. The production showcase builds. Independent full reviews identified axis reset exceptions and a second heatmap color transition. Those issues are corrected. Independent intent and engineering correction reviews pass with no findings. All admitted blockers are resolved.
