# 35 Animate statistical data changes

**What to build:** Deliver approved observation position/size and membership motion in scatter and bubble charts, including supplied line samples. Retain immediate handling of unreviewed distribution topology.

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

- Focused command: `vitest run tests/statistical-data-motion.test.tsx tests/point-chart-interaction.test.tsx tests/statistical-visibility.test.tsx tests/point-chart-exploration.test.tsx tests/scatter-line.test.tsx`.
- Thirteen new regressions cover point and supplied-line values, identity/reorder, noninteractive departures, bubble area fitting, actual callbacks, interruption, reduced motion, missing topology, preserved drag gestures, fitted gutters, and immediate axes on linear/logarithmic or missing-sample changes, while retaining animated eye fitting for a supplied line with gaps. Red failures were observed before their corrections.
- Native 390px and 1280px scatter/bubble examples retain North selection through updates and activate its current 20 °C / 66 kWh readings. The compact gutter now moves with its point. Supplied-line samples and path values move together. New line adjacency remains immediate; missing-value topology settles directly. Dark and light states were inspected. Temporary screenshots were removed after inspection.
- `npm run check` passes all 904 tests and configured checks. `npm run verify:package` passes React 18/19 SSR, hydration, types and browser builds. The production showcase builds. Independent full reviews identified axis reset exceptions and a second heatmap color transition. Those issues are corrected. Independent intent and engineering correction reviews pass with no findings. All admitted blockers are resolved.
