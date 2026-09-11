# 36 Animate pie and donut data changes

**What to build:** Deliver approved value/share motion, fading membership changes and rank crossfades with stable category colors across pie and donut.

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

- Focused command: `vitest run tests/radial-data-motion.test.tsx tests/part-to-whole-charts.test.tsx tests/part-to-whole-visibility.test.tsx tests/radial-interaction.test.tsx`.
- Seven new regressions cover shares, ranked crossfades/colors, membership, interruption/reduced motion, moving selection and current callbacks, displayed hit testing and hold continuity. Original and expanded boundaries failed before implementation.
- Native compact/wide pie and donut examples update actual slice shares, fade membership, crossfade rank changes and retain category colors. Keyboard selection survives value/rank changes and activation reports North at 66 MWh. The reduced-motion update settles immediately. Dark and light states were inspected. Temporary screenshots were removed after inspection.
- `npm run check` passes all 904 tests and configured checks. `npm run verify:package` passes React 18/19 SSR, hydration, types and browser builds. The production showcase builds. Independent full reviews identified axis reset exceptions and a second heatmap color transition. Those issues are corrected. Independent intent and engineering correction reviews pass with no findings. All admitted blockers are resolved.
