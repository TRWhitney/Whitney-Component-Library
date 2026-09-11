# Chart interaction and composition

## Destination

Deliver the remaining behavior in [Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md).

## Current state

The approved combined charts are delivered. [Ticket 32](tickets/32-line-range.md) adds supplied ranges to CartesianChart. [Ticket 33](tickets/33-scatter-line.md) adds a separate supplied dataset to ScatterChart. Both preserve established behavior outside the reviewed paired range markers and vertical pan placement. No prototype approval is pending.

## Progress

- Visibility, selection and activation are delivered across the chart families, with stable identities, shared motion and production showcase examples.
- Tickets 22–25 deliver compact label fitting and exploration layout prerequisites.
- Tickets 26–30 deliver pan and zoom across Cartesian, point, distribution and heatmap charts. The mobile heatmap correction is delivered in `9baab9c`.
- The combined production implementation, public types, complete examples and canonical contracts are current. Browser inspection corrected crowded numeric labels beside the new vertical controls. Per-series callback availability suppresses false activation pulses. Crossing lines retain visible geometry without targeting offscreen samples.

## Frontier

The [decision map](map.md) indexes remaining parent-ticket work. General data-change animation and responsiveness budgets remain separate outcomes.

## Accepted sources

- [Production combined-chart boundary](spec.md#production-combined-chart-boundary)
- [Approved combinations and precedence](prototypes/combined-charts.md#acceptance-contract)
- [Production exploration boundary](spec.md#production-exploration-boundary)
- [Modal overview](prototypes/modal-overview.md#accepted-behavior)

## Verification

Focused range and scatter-line regressions pass. Native 390px and 1280px checks cover paired range rings, month underlines and drag preview, independent eyes, callbacks, touch hold without selection changes, pinch, vertical pan, modal overview dragging and fixed chart dimensions. Light/dark markers and reduced-motion static pulses were inspected. All 867 tests and configured repository checks pass. Packed React 18.3.1 and 19.2.8 SSR, hydration, types and browser builds pass. The production showcase builds. Independent intent and engineering reviews pass after the four admitted gesture/identity/targeting corrections. Seven new regressions cover those failures.

## Out of scope

Scatter with adjacent distributions, application layouts, implicit statistical calculations, and changes to accepted cross-chart behavior not reviewed in the combined study.

## Continuation

- Resume with `python3 /home/whitney-white/.codex/skills/work-system/scripts/navigate.py resume novel-work planning`.
- Branch `main`. Range delivery is `bd706ce`; the following scatter delivery commits the rest of this accepted outcome.
- Both deliveries include public exports, canonical contracts and guides, complete production examples, regression/type/package coverage and the accepted effort record.
- Plan the remaining general data-change animation and responsiveness-budget work. The combined charts need no further prototype approval; do not reopen accepted behavior.
