# 40 Animate distribution data changes

**What to build:** Histogram counts and box summaries/outliers animate while keeping exact source statistics and stable interval/group/outlier identities.

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

The implementation agent confirmed the supplied focused failures before changing production. `./node_modules/.bin/vitest run tests/distribution-data-motion.test.tsx` failed both supplied tests because a histogram count and box median jumped directly to their target geometry. Histogram height changed from 78.87 to 157.74 immediately; box median position changed from 241.465 to 202.03 immediately.

The renderer now interpolates prepared histogram ordinates and box summaries/outliers through the delivered shared 240ms cubic ease-out hook. Statistics are prepared from current source records once per source render, then copied into a separate display model for interpolation. Source readings, tables and activation payloads remain current. Hit bounds, whiskers, selection frames and outlier rings use display geometry. Source geometry invalidates gestures; animation frames do not.

Histogram correspondence includes exact lower/upper bounds and final-edge inclusion. Box correspondence includes group order, summary mode, whisker configuration and ordered stable application outlier IDs. Changed topology/configuration settles directly. Noninteractive boxes can interpolate a sole outlier or an unchanged outlier value list; multiple changing outlier values without application IDs settle directly. No public motion prop was added. Automatic bounds and gutters share data timing, while visibility still fits its axes through the native animation.

Final named check command:

```sh
./node_modules/.bin/vitest run tests/distribution-data-motion.test.tsx tests/statistical-charts.test.tsx tests/distribution-interaction.test.tsx tests/statistical-visibility.test.tsx tests/distribution-exploration.test.tsx tests/statistical-data-motion.test.tsx
```

All six files passed, 83 tests total. The coordinating agent reported a showcase group-tuple type error; the example now declares an explicit readonly two-group tuple. The new display lookups use maps keyed by exact interval identity or group ID, so the added per-frame mapping is linear. The 15 focused motion tests cover intermediate geometry, exact raw bin membership including the final edge, supplied box summaries and outlier values, moving selections/hits, interruption, reduced motion, automatic fitting with active drags, changed boundaries/final inclusion, outlier membership/order, direct scale changes, and interpolation of derived raw quartiles.

Owned files:

- `src/charts/statistical-chart.tsx`
- `tests/distribution-data-motion.test.tsx`
- `showcase/distribution-data-motion-example.tsx`
- This ticket.

`DistributionDataMotionExample` accepts `kind: 'histogram' | 'box'`. It provides native Update values and Reset controls, a compact container toggle, selection and details, and box visibility eyes. Minimum chart width is 260px. Showcase wiring, canonical/generated guidance, integrated checks, native operation and production reviews are complete.

Scoped lint also passed:

```sh
./node_modules/.bin/eslint src/charts/statistical-chart.tsx tests/distribution-data-motion.test.tsx showcase/distribution-data-motion-example.tsx --max-warnings 0
```

Integrated `npm run check` passes 937 tests, format/lint/types, generated guidance, TypeScript 5/6/7 and chart isolation. `npm run verify:package` passes packed React 18.3.1 and 19.2.8 SSR/hydration/types/browser builds. The production showcase builds. Independent intent review passes. Engineering identified navigation cancellation during distribution gutter motion; corrected using target geometry, with focused red/green and native two-touch evidence. Independent intent and engineering correction reviews pass with no findings.

Native 390px and 1280px dark/light examples were operated. Keyboard selection stays attached through source updates, activation reports current readings, and eyes hide/restore radar profiles and box groups. All four compact canvases fit their 308px container. The Sparkline minimum and maximum show complementary intermediate fade weights on their moving readings; reduced motion settles them to full opacity. Inspected screenshots were removed.

Correction evidence: the public two-touch regression failed before the navigation version used target rather than animated gutter geometry, then passed among 53 focused checks. A native two-finger gesture begun during the gutter transition changed the histogram window from 0–20 to 0–10, confirming that the next animation frame did not cancel it. Renewed full checks pass 937 tests.
