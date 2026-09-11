# 37 Animate heatmap value changes

**What to build:** Deliver approved heatmap color motion for source value updates independently of visibility controls; keep structured readings and cell identity accurate.

**Blocked by:** None. Shared motion support is integrated with ticket 34.

**Status:** ready-to-commit

- [x] Implement the accepted motion with interruption, reduced motion and deterministic first render.
- [x] Preserve actual source readings/callbacks, visible-geometry interaction, identity and established chart behavior.
- [x] Cover the behavior through public regressions and native compact/wide interaction.
- [x] Update rendered production examples, canonical contracts and generated guidance; pass configured checks and independent production review.

## Accepted sources

- [Production boundary](../spec.md#production-data-transition-boundary)
- [Value motion](../prototypes/value-motion.md#acceptance-contract)
- [Membership and order](../prototypes/data-transitions.md#acceptance-contract)

## Completion evidence

- Focused command: `vitest run tests/heatmap-data-motion.test.tsx tests/heatmap.test.tsx tests/heatmap-interaction.test.tsx tests/heatmap-visibility.test.tsx tests/heatmap-exploration.test.tsx`.
- Five numeric regressions and a public-styles guard cover value/fitted-key motion without eyes, interruption/reduced motion, source callbacks and selection, and immediate missing topology. Original and expanded boundaries failed before implementation.
- Browser painted-color comparison confirmed the old CSS lag, then confirmed displayed and settled colors match with no background transition after the correction.
- Native compact/wide heatmap colors and fitted key change together while the selected cell remains framed. A touch press-and-hold reports the current North/Morning value of 22 °C without changing selection. The production example includes native pan/zoom and modal Overview, keeping all four rows usable on mobile. Dark and light states were inspected. Temporary screenshots were removed after inspection.
- `npm run check` passes all 904 tests and configured checks. `npm run verify:package` passes React 18/19 SSR, hydration, types and browser builds. The production showcase builds. Independent full reviews identified axis reset exceptions and a second heatmap color transition. Those issues are corrected. Independent intent and engineering correction reviews pass with no findings. All admitted blockers are resolved.
