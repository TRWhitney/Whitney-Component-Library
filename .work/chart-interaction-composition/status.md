# Chart interaction and composition

## Destination

Deliver the remaining behavior in [Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md).

## Current state

Complete. Whitney accepted the measured timings and signed off on closing Ticket 22. Tickets 41 and 42 record the performance results and compact heatmap visibility correction. The proposed heatmap canvas-background experiment remained unconfirmed and was not adopted. No further optimization is required.

## Progress

- Visibility, selection and activation are delivered across the chart families, with stable identities, shared motion and production showcase examples.
- Tickets 22–25 deliver compact label fitting and exploration layout prerequisites.
- Tickets 26–30 deliver pan and zoom across Cartesian, point, distribution and heatmap charts. The mobile heatmap correction is delivered in `9baab9c`.
- The combined production implementation, public types, complete examples and canonical contracts are current. Browser inspection corrected crowded numeric labels beside the new vertical controls. Per-series callback availability suppresses false activation pulses. Crossing lines retain visible geometry without targeting offscreen samples.

## Frontier

No remaining work for Ticket 22. The [decision map](map.md) and [performance report](research/chart-responsiveness.md) retain the accepted boundaries and measurements.

## Accepted sources

- [Value-change motion](prototypes/value-motion.md#acceptance-contract)

- [Production combined-chart boundary](spec.md#production-combined-chart-boundary)
- [Approved combinations and precedence](prototypes/combined-charts.md#acceptance-contract)
- [Production exploration boundary](spec.md#production-exploration-boundary)
- [Modal overview](prototypes/modal-overview.md#accepted-behavior)

## Verification

Current repository checks pass 938 tests, formatting, code/style lint, generated guidance, TypeScript 5/6/7 and chart isolation. Packed React 18.3.1 and 19.2.8 SSR, hydration, types and browser builds pass. The final bounded heatmap refactoring passes all 54 heatmap tests and TypeScript. The production showcase builds and is refreshed.

Native production checks at 390px and 1280px cover dark/light density, touch hide/restore, list focus, focus return and the original readable inline controls. Hiding one track changes 576 cells to 552; restoring returns 576. The new scatter/bubble examples load 500 buildings. Whitney separately accepted the recorded performance results.

## Out of scope

Scatter with adjacent distributions, application layouts, implicit statistical calculations, and changes to accepted cross-chart behavior not reviewed in the combined study.

## Delivery

The approved compact heatmap manager, retained renderer caching and benchmark records complete this effort. The parent and child tickets record Whitney's explicit sign-off and the unconfirmed, unadopted canvas experiment. No rendering experiment is included in production.
