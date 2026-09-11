# Chart responsiveness

## Status

Whitney accepted the measured timings and signed off on closing Ticket 22. The original diagnostic target misses below remain accurate but are no longer acceptance failures. Further optimization and an initial-load study are not required for this ticket. The proposed canvas-background heatmap experiment remained unconfirmed and was not adopted.

## Method

`scripts/verify-chart-performance.mjs` builds and serves `scripts/fixtures/chart-performance/` as production code. It renders one public chart at a time with stable data and configuration references. No marks are sampled away. Numeric updates alternate two deterministic revisions; pie/donut retain ranked membership so that their numeric animation is measured.

The desktop viewport is 1280 by 900. The constrained viewport is 390 by 844 with Chromium's fourfold CPU slowdown and touch capability. This is a repeatable browser simulation, not a measurement on Whitney's Samsung phone. Software rendering, the host CPU and automation affect the numbers.

Each operation has 12 repetitions. Input timing starts on keydown, pointerdown for drags, or pointerup for button activation. A MutationObserver verifies the intended feedback changed. The next requestAnimationFrame after the observed change is the recorded paint opportunity. Animation sampling continues for 240ms. Latency and frame intervals use nearest-rank p95, compared at the nearest millisecond to avoid fractional refresh-clock rounding. A 12-sample latency p95 is the largest sample. Main-thread tasks use the Long Tasks API and include tasks overlapping the measured event. Zero means no task reached that API's 50ms reporting threshold.

Budgets were set before measurement: feedback p95 at most 100ms, active frame p95 at most 34ms desktop or 50ms constrained, and no task above 200ms. An input that does not change the expected state fails the runner. Initial loading is outside the interaction budget and was not measured; it is outside the signed-off scope.

## Workloads

| Chart                             | Data                                     |
| --------------------------------- | ---------------------------------------- |
| Line                              | 240 rows, 3 series, 720 marks            |
| Grouped columns / horizontal bars | 24 categories, 3 series                  |
| Scatter / bubble                  | 500 points across 3 series               |
| Histogram                         | 50 supplied bins                         |
| Box plot                          | 6 groups, 3 stable-ID outliers per group |
| Pie / donut                       | 24 categories through native paging      |
| Radar                             | 4 profiles, 8 dimensions                 |
| Heatmap                           | 24 rows by 24 columns, 576 cells         |
| Sparkline                         | 240 readings                             |

Measurements cover reading, selection, supported hiding/restoring, zoom/reset, pan, overview dragging and numeric animation. Rectangle selection also verifies preview and commit on line, scatter, bubble and heatmap. Functional activation and reduced-motion behavior remain covered by production regressions.

## Reproduce

Run after other builds, tests and browser checks have finished. Playwright is supplied by the verification environment, not added to the shipped package. This run uses Playwright 1.63.0.

```sh
WCL_PLAYWRIGHT_MODULE=/home/whitney-white/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs \
WCL_CHROMIUM_PATH=/home/whitney-white/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome \
WCL_PERFORMANCE_OUTPUT=/tmp/chart-performance-complete.json \
npm run verify:chart-performance
```

Set the two executable/module paths for the local environment. Optional `WCL_PERFORMANCE_PROFILE`, `WCL_PERFORMANCE_KINDS` and `WCL_PERFORMANCE_SAMPLES` narrow a diagnostic run. Full verification uses both profiles, every kind and 12 repetitions.

## Changes retained

- Reuse the default number formatter instead of constructing it for each decimal reading.
- Cache unchanged point models, table content and source reading metadata while projecting displayed coordinates live.
- Build point and heatmap overview marks only while their modal content renders.
- Avoid empty point-overlay groups and duplicate initial motion renders.
- Cache the heatmap source model and complete data table.
- Replace crowded heatmap eyes with the approved compact manager, without limiting zoom.

The larger color-rendering experiments did not resolve the constrained heatmap failure and were removed. The accepted colors, inline/high-contrast values and motion remain unchanged.

## Full baseline result

The baseline covered all 24 cases, each with 12 samples per supported operation. Only aggregated results are retained; the runner regenerates raw measurements in a temporary output file. Every desktop case passed. No measured main-thread task exceeded 200ms. The constrained failures are below. Other measured operations passed.

| Chart   | Operation      | Feedback p95, ms | Frame p95, ms | Longest task, ms |
| ------- | -------------- | ---------------: | ------------: | ---------------: |
| line    | drag selection |            124.0 |           0.0 |               62 |
| line    | visibility     |             97.9 |          83.3 |              136 |
| line    | zoom           |            111.2 |          83.4 |              157 |
| line    | overview drag  |            160.6 |           0.0 |              127 |
| scatter | animation      |            106.6 |          50.0 |              106 |
| bubble  | animation      |            119.4 |          50.0 |              115 |
| heatmap | visibility     |            101.7 |          16.8 |              112 |
| heatmap | zoom           |            122.3 |          16.8 |              119 |
| heatmap | animation      |            159.5 |          66.7 |               66 |

The baseline predates the subsequent Cartesian source/table memoization. The focused rerun below supersedes its Cartesian results. The other chart implementations are unchanged. Heatmap profiling identifies cell style recalculation and painting as the remaining animation cost.

## Cartesian cache rerun

The follow-up repeated both profiles for line, columns and bars after caching unchanged source rows, interaction rows and table content. Every desktop case and both constrained bar orientations pass. The constrained line remains above budget in the following operations.

| Operation      | Feedback p95, ms | Frame p95, ms | Longest task, ms |
| -------------- | ---------------: | ------------: | ---------------: |
| drag selection |            104.7 |           0.0 |               64 |
| visibility     |             98.5 |          66.7 |              125 |
| zoom           |            107.1 |          83.4 |              150 |
| overview drag  |            192.0 |           0.0 |              150 |
