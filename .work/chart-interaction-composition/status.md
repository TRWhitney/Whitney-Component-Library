# Chart interaction and composition

## Destination

Deliver the remaining behavior in [Ticket 22](../library-foundation/tickets/22-chart-interaction-and-composition.md).

## Current state

The combined charts are delivered in `bd706ce` and `f3087f9`. [Value-change motion](prototypes/value-motion.md#acceptance-contract) is approved across all five examples. The [data-transition study](prototypes/data-transitions.md) now shows additions, removals, reordering and automatic axis fitting in columns, bubbles and a donut. Whitney approved it. Tickets 34–37 carry the reviewed transitions into production; other renderer cases remain on the parent frontier.

## Progress

- Visibility, selection and activation are delivered across the chart families, with stable identities, shared motion and production showcase examples.
- Tickets 22–25 deliver compact label fitting and exploration layout prerequisites.
- Tickets 26–30 deliver pan and zoom across Cartesian, point, distribution and heatmap charts. The mobile heatmap correction is delivered in `9baab9c`.
- The combined production implementation, public types, complete examples and canonical contracts are current. Browser inspection corrected crowded numeric labels beside the new vertical controls. Per-series callback availability suppresses false activation pulses. Crossing lines retain visible geometry without targeting offscreen samples.

## Frontier

The [decision map](map.md) indexes remaining parent-ticket work. General data-change animation and responsiveness budgets remain separate outcomes.

## Accepted sources

- [Value-change motion](prototypes/value-motion.md#acceptance-contract)

- [Production combined-chart boundary](spec.md#production-combined-chart-boundary)
- [Approved combinations and precedence](prototypes/combined-charts.md#acceptance-contract)
- [Production exploration boundary](spec.md#production-exploration-boundary)
- [Modal overview](prototypes/modal-overview.md#accepted-behavior)

## Verification

Production motion passes all 904 tests and `npm run check`, including formatting, code/style lint, generated guidance, all three TypeScript versions and chart isolation. `npm run verify:package` passes packed React 18.3.1 and 19.2.8 SSR, hydration, types and browser builds. The production showcase builds. Native compact/wide, dark/light, reduced-motion, retained-selection, current callback and touch-hold flows pass. Fitted axis gutters now move with data. The new heatmap example uses the approved exploration layout; the Cartesian example fits a 308px mobile container. Independent full reviews identified axis reset exceptions and a second heatmap color transition. Those issues are corrected with six regressions and renewed repository/package/native evidence. Independent intent and engineering correction reviews pass with no findings. All admitted blockers are resolved. Per-family evidence is in tickets 34–37.

## Out of scope

Scatter with adjacent distributions, application layouts, implicit statistical calculations, and changes to accepted cross-chart behavior not reviewed in the combined study.

## Continuation

- Resume with `python3 /home/whitney-white/.codex/skills/work-system/scripts/navigate.py resume novel-work delivery`.
- Branch `main`, production base `f3087f9`. Uncommitted work is production motion in the four reviewed renderer families, shared motion support, public regressions, rendered examples, canonical/generated guidance, and both accepted prototypes with their effort records.
- Both deliveries include public exports, canonical contracts and guides, complete production examples, regression/type/package coverage and the accepted effort record.
- Commit each reviewed renderer outcome with its documentation and examples, then plan one combined motion study for radar, Sparkline, histogram and box plot. Preserve immediate behavior for unreviewed topology/state changes. Whitney explicitly requested proceeding automatically after approval until new input is necessary.
