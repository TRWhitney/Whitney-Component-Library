# 26 Explore LineChart domains

**What to build:** Deliver the approved LineChart navigation through the public component, including controlled range coordination and complete-data alternatives.

**Blocked by:** None. [25](25-exploration-layout-foundation.md) is complete.

**Status:** ready-for-agent

- [ ] Expose opt-in internal/default or controlled domain windows and localized navigation labels. Continuous numeric and time axes preserve their value types; invalid ranges fail clearly.
- [ ] Deliver attached zoom/reset/pan controls and the collapsed horizontal overview with pointer and keyboard window movement/resizing. Match the accepted line artifact at compact and wide widths.
- [ ] Implement two-finger pan and pinch as part of native chart input arbitration. One-finger selection, hold activation and live drag previews remain faithful; second-touch cancellation cannot change selection on release.
- [ ] Keep the full valid model and complete table. Clip rendering and interaction to the viewport, preserve crossing segments at boundaries, fit the automatic value scale to visible geometry and keep explicit axis constraints.
- [ ] Preserve outside-window selection and stable callback identities. Handle empty windows, data updates, controlled updates and all-hidden recovery. Overview visibility follows the same series state as the chart.
- [ ] Demonstrate internal navigation and deliberate application coordination in the showcase; update contracts and public-type examples. Complete component, native browser, SSR/hydration, reduced-motion and package checks plus independent reviews.

## Accepted sources

- [Production exploration boundary](../spec.md#production-exploration-boundary)
- [Line contract](../prototypes/domain-exploration.md#accepted-pan-and-zoom-contract)
- [Horizontal group](../prototypes/chart-exploration-comparison.md#accepted-behavior)
- [Scatter/bubble](../prototypes/point-exploration.md#accepted-behavior)
- [Remaining families](../prototypes/remaining-exploration.md#accepted-behavior)

## Completion evidence

Pending.
