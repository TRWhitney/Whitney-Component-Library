# 33 Combine scatter observations with a supplied line

**What to build:** Combine scatter observations with a supplied line, using established chart interactions and the approved combined-chart design.

**Blocked by:** None. Existing production interaction and exploration foundations are delivered.

**Status:** complete

- [x] Accept separate typed observation and line datasets without fabricated combined consumer rows or statistical calculation.
- [x] Preserve sample identity, duplicate coordinates, gaps, independent callbacks, shared selection and overlap-only legend priority.
- [x] Draw the line in supplied order in both plot and overview, including segments crossing viewport edges; fit visible observations and line together.
- [x] Preserve eyes, full tables, center-inside dragging, keyboard/hold/pinch behavior and shared pulses; place Up above Down beside the plot in a reserved gutter.
- [x] Update showcase, exports, contracts and generated guides, with public regression, type, package and native verification.

The additional regressions cover either dataset changing during a gesture, touch selection when only the other dataset has an activation callback, duplicate IDs after reordering and clipped offscreen samples.

## Accepted sources

- [Production boundary](../spec.md#production-combined-chart-boundary)
- [Approved combinations and precedence](../prototypes/combined-charts.md#acceptance-contract)
- [Combined-chart decisions](../decisions/02-combined-chart-plan.md)

## Completion evidence

Nineteen public scatter-line regressions cover separate typed callback data, segment targeting, dataset identity collisions, supplied-order gaps, hiding and overview, visible-center selection, callback availability, automatic colors, compact staggering and crossing segments with offscreen endpoints.

`npm run check` passes 867 tests, formatting, both linters, source types, generated guides, TypeScript 5/6/7 public examples and chart bundle isolation. `npm run verify:package` passes React 18.3.1 and 19.2.8 SSR, hydration, consumer types and browser builds; the packed fixture includes both new combinations. The production showcase build passes.

Native 390px and 1280px checks cover light/dark appearance, paired range rings and connector, category underlines, visible drag preview, independent eyes, activation details, touch hold without changing selection, pinch, Up/Down pan, direct modal overview dragging, fixed main-chart size and focus return to Overview. Reduced-motion endpoint pulses have no animation. Compact scatter numeric labels stagger beside the reserved pan controls. Screenshots were inspected and removed.

Independent intent and engineering production reviews found data-update gesture cancellation, per-dataset touch activation, duplicate-ID overlay keys and offscreen marker targeting defects. All four are corrected. Seven added regressions failed before the corrections and now pass. Independent intent and engineering bounded correction reviews pass with no blocking findings.
