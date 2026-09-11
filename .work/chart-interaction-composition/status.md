# Chart interaction and composition

## Destination

Deliver the remaining behavior in [Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md).

## Current state

Production data motion is delivered for Cartesian, scatter/bubble, pie/donut and heatmap charts in tickets 34–37. Tickets 38–40 complete the approved radar, Sparkline, histogram and box-plot numeric animations, including the smooth Sparkline minimum/maximum marker handoff. The [accepted study](prototypes/remaining-motion.md) records the behavior.

## Progress

- Visibility, selection and activation are delivered across the chart families, with stable identities, shared motion and production showcase examples.
- Tickets 22–25 deliver compact label fitting and exploration layout prerequisites.
- Tickets 26–30 deliver pan and zoom across Cartesian, point, distribution and heatmap charts. The mobile heatmap correction is delivered in `9baab9c`.
- The combined production implementation, public types, complete examples and canonical contracts are current. Browser inspection corrected crowded numeric labels beside the new vertical controls. Per-series callback availability suppresses false activation pulses. Crossing lines retain visible geometry without targeting offscreen samples.

## Frontier

The [decision map](map.md) indexes remaining parent-ticket work. Unreviewed membership/topology animation and responsiveness budgets remain separate outcomes.

## Accepted sources

- [Value-change motion](prototypes/value-motion.md#acceptance-contract)

- [Production combined-chart boundary](spec.md#production-combined-chart-boundary)
- [Approved combinations and precedence](prototypes/combined-charts.md#acceptance-contract)
- [Production exploration boundary](spec.md#production-exploration-boundary)
- [Modal overview](prototypes/modal-overview.md#accepted-behavior)

## Verification

The integrated animations pass all 937 tests and `npm run check`, including formatting, code/style lint, generated guidance, TypeScript 5/6/7 and chart isolation. `npm run verify:package` passes packed React 18.3.1 and 19.2.8 SSR, hydration, types and browser builds. Production showcase build and native compact/wide dark/light checks pass. At 390px, every new canvas fits its 308px container. Selections follow displayed geometry, activation reports supplied values, eyes remain usable, and Sparkline extrema crossfade with the moving line. Reduced motion settles cues immediately. Independent intent and engineering reviews pass with no findings after correcting navigation cancellation during distribution gutter motion. The correction passes a public regression and native two-touch operation.

## Out of scope

Scatter with adjacent distributions, application layouts, implicit statistical calculations, and changes to accepted cross-chart behavior not reviewed in the combined study.

## Continuation

- Resume with `python3 /home/whitney-white/.codex/skills/work-system/scripts/navigate.py resume novel-work delivery`.
- Branch `main`. Cartesian motion is delivered in `223447e`, scatter/bubble motion in `08a7054`, pie/donut motion in `e842a7a`, and heatmap motion in `a67c678`. Sparkline motion is delivered in `761d1cd` and radar motion in `02e2a0b`. Distribution motion, its regressions and the final completion record are delivered together in `[Feature] Animate distribution data changes`. No task-owned implementation remains uncommitted after that outcome.
- Tickets 38–40 are complete. The next work is to reconcile the remaining parent animation and responsiveness criteria against the delivered behavior. Preserve immediate behavior for unreviewed topology/state changes. Whitney explicitly requested proceeding automatically after approval until new input is necessary.
