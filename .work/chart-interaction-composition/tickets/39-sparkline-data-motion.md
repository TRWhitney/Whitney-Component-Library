# 39 Animate Sparkline data and extrema

**What to build:** Sparkline values and selected marks move together. Minimum and maximum cues fade between readings instead of popping, including interrupted updates.

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

The initial three public regressions failed on immediate geometry, missing former minimum cue and interrupted transitions. Six focused motion tests now pass, with 31 tests across `tests/sparkline-data-motion.test.tsx`, `tests/sparkline.test.tsx` and `tests/sparkline-interaction.test.tsx`. Production source keeps supplied models for tables/callbacks while line, selected rings and fading extrema share displayed rows.

Integrated `npm run check` passes 937 tests, format/lint/types, generated guidance, TypeScript 5/6/7 and chart isolation. `npm run verify:package` passes packed React 18.3.1 and 19.2.8 SSR/hydration/types/browser builds. The production showcase builds. Independent intent review passes. Engineering identified navigation cancellation during distribution gutter motion; corrected using target geometry, with focused red/green and native two-touch evidence. Independent intent and engineering correction reviews pass with no findings.

Native 390px and 1280px dark/light examples were operated. Keyboard selection stays attached through source updates, activation reports current readings, and eyes hide/restore radar profiles and box groups. All four compact canvases fit their 308px container. The Sparkline minimum and maximum show complementary intermediate fade weights on their moving readings; reduced motion settles them to full opacity. Inspected screenshots were removed.
