# 32 Combine a line with supplied ranges

**What to build:** Combine a line with supplied ranges, using established chart interactions and the approved combined-chart design.

**Blocked by:** None. Existing production interaction and exploration foundations are delivered.

**Status:** complete

- [x] Add a separately selectable range series with typed lower/upper accessors and truthful readings, callbacks and full tables.
- [x] Preserve other series at missing range samples; show gaps and invalid-data feedback for nonfinite/reversed bounds; accept equal bounds.
- [x] Fit both bounds, including viewport edges, and keep hidden range selection and overview visibility consistent.
- [x] Use the approved paired endpoint rings and connector, either-endpoint center drag targeting, month underlines, shared hover/activation and keyboard/touch behavior.
- [x] Update showcase, exports, contracts and generated guides, with public regression, type, package and native verification.

## Accepted sources

- [Production boundary](../spec.md#production-combined-chart-boundary)
- [Approved combinations and precedence](../prototypes/combined-charts.md#acceptance-contract)
- [Combined-chart decisions](../decisions/02-combined-chart-plan.md)

## Completion evidence

Seven public range regressions cover paired selection and original callback data, either-endpoint drag preview, missing/reversed/equal bounds, independent gaps, hidden category payloads and fitting both negative limits without an artificial zero baseline.

The integrated combined-chart `npm run check` passes 867 tests, formatting, both linters, source types, generated guides, TypeScript 5/6/7 public examples and chart bundle isolation. `npm run verify:package` passes React 18.3.1 and 19.2.8 SSR, hydration, consumer types and browser builds; the packed fixture includes both new combinations. The production showcase build passes.

Native 390px and 1280px checks cover light/dark appearance, paired range rings and connector, category underlines, visible drag preview, independent eyes, activation details, touch hold without changing selection, pinch, Up/Down pan, direct modal overview dragging, fixed main-chart size and focus return to Overview. Reduced-motion endpoint pulses have no animation. Compact scatter numeric labels stagger beside the reserved pan controls. Screenshots were inspected and removed.

Independent intent and engineering production reviews found data-update gesture cancellation, per-dataset touch activation, duplicate-ID overlay keys and offscreen marker targeting defects. All four are corrected. Seven added regressions failed before the corrections and now pass. Independent intent and engineering bounded correction reviews pass with no blocking findings.

The independently staged range snapshot passes source type checking, generated-guide checking and 22 range/showcase tests.
