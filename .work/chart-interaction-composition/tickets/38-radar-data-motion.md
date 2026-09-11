# 38 Animate radar data changes

**What to build:** Radar profiles and selected values follow numeric updates without changing profile/dimension identity or accepted visibility behavior.

**Blocked by:** None. Shared motion support is delivered.

**Status:** complete

- [x] Implement accepted numeric motion, interruption, deterministic first render and reduced motion.
- [x] Keep source readings/callbacks/tables current and display geometry used by selection and hit testing.
- [x] Preserve existing interaction/visibility; settle unreviewed topology/configuration changes immediately.
- [x] Cover public behavior with observed red/green regressions and native compact/wide flows.
- [x] Update rendered examples, canonical/generated guidance; pass configured checks and independent production reviews.

## Accepted sources

- [Production boundary](../spec.md#remaining-renderer-data-motion)
- [Accepted motion and marker correction](../prototypes/remaining-motion.md#accepted-behavior-and-correction)

## Completion evidence

Production `RadarChart` uses the shared 240ms cubic ease-out for retained numeric profile values and automatic scales, including charts without visibility controls. Profile order, dimension order, missing-value topology, invalid status and configuration changes settle immediately. Visibility still fits the shared scale. Source readings, activation payloads and tables update immediately; marks, selected rings, reading lines and hit targets use display geometry. Gesture versions contain source values and the target scale so motion frames preserve holds and selection rectangles.

The focused baseline failed as expected before implementation: the first score jumped from `cy=120` to `cy=180` on rerender. The regression now observes `120`, `172.5` at 120ms, and `180` at 240ms. Eleven focused tests cover initial rendering, numeric and automatic-scale motion, source readings, selection, display hit testing, interruption, reduced motion, topology/configuration fallbacks and gestures during frames.

Named check passed with 64 tests across four files:

```sh
npx vitest run tests/radar-data-motion.test.tsx tests/radar-chart.test.tsx tests/radar-interaction.test.tsx tests/radar-visibility.test.tsx
```

`showcase/radar-data-motion-example.tsx` exports `RadarDataMotionExample`, a production example with Update values, Reset, a compact container, native profile eyes, selection and detail activation. The showcase wiring, canonical/generated guidance, integrated checks, native operation and independent review are complete.

Integrated `npm run check` passes 937 tests, format/lint/types, generated guidance, TypeScript 5/6/7 and chart isolation. `npm run verify:package` passes packed React 18.3.1 and 19.2.8 SSR/hydration/types/browser builds. The production showcase builds. Independent intent review passes. Engineering identified navigation cancellation during distribution gutter motion; corrected using target geometry, with focused red/green and native two-touch evidence. Independent intent and engineering correction reviews pass with no findings.

Native 390px and 1280px dark/light examples were operated. Keyboard selection stays attached through source updates, activation reports current readings, and eyes hide/restore radar profiles and box groups. All four compact canvases fit their 308px container. The Sparkline minimum and maximum show complementary intermediate fade weights on their moving readings; reduced motion settles them to full opacity. Inspected screenshots were removed.
