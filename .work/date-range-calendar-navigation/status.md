# Date range calendar navigation

## Destination

Make date-range selection explicitly endpoint-oriented, keep endpoint drags open, display and page two adjacent months, support drag paging at the visible edges, give every month a stable height, and add hierarchical month/year navigation for calendar pickers.

## Current state

The complete implementation is delivered in the containing feature commit after renewed validation and independent correction review passed on both intent and engineering axes.

## Progress

The shared calendar sheet provides stable six-row day grids and fixed-height month, year, decade, and broader hierarchy views using the active calendar's arithmetic, locale-aware labels, valid grid semantics, RTL keyboard behavior, selection bounds, and a finite supported-year ceiling. DateRangePicker uses two consecutive own-month panes with shared one-month paging, compact responsive field geometry, explicit start/end activity, ordinary sequential completion, non-closing endpoint drag, crossed identity settlement, forgiving guarded edge paging, and visible edge handles. DatePicker retains its single-calendar behavior, visibly includes adjacent-month dates, and keeps its control content-sized even when support text makes the enclosing field wider.

The [three implementation tickets](tickets/) are complete. The accepted [prototype](prototypes/date-range-navigation.md) remains isolated design evidence, while the human-facing showcase and generated component guidance describe the production behavior.

## Frontier

See the [decision map](map.md). No accepted work remains in this effort.

## Accepted sources

- [Specification](spec.md)
- [Decision map](map.md)
- [React Aria capability research](research/react-aria-capabilities.md)
- [Accepted prototype](prototypes/date-range-navigation.md)
- The user's endpoint, paging, sizing, hierarchy, compact-field, own-month, and edge-handle corrections in the initiating conversation

## Verification

- `npm run check` passes: formatting, ESLint, Stylelint, type checking, 289 tests, generated-documentation consistency, package build, and the TypeScript compatibility matrix are green.
- `npm run showcase:build` passes. Its temporary output was removed after inspection.
- Direct Chromium inspection at 760 px in dark and light schemes confirms fixed 302 px popup geometry without scroll overflow through day and hierarchy views, including the compact DatePicker and two-pane DateRangePicker.
- The compact invalid DatePicker control measures 171.42 × 44 px rather than stretching to its support text; its hierarchy remains 306 × 302 px with matching client/scroll dimensions.
- The bounded broad hierarchy ends once at `9001–9999`, disables further expansion, and reports no browser console errors.
- The controlled-reopen regression first observed the defective `end`, `start` DOM activation sequence, then passes with only `start` committed on reopen.
- Direct range interaction confirms an immediate start rail on open, start-to-end click progression, end-click dismissal, keyboard completion, non-closing endpoint drag, crossed-role settlement, own-month two-pane rendering, and visible forgiving edge paging.
- Independent bounded correction review passes on both intent and engineering axes with no blocking findings or unresolved judgments.

## Out of scope

- Time-zone or instant semantics
- Non-contiguous date ranges
- A public partial-range value type

Nonblocking review observations left outside the accepted outcome are column-preserving ArrowDown behavior into an incomplete thirteenth-month row and monitoring the bundle contribution of React Aria's aggregate locale dictionary.

## Continuation

This effort is complete on branch `master` in the containing `[Feature] Expand calendar range editing` commit. Resume only if a new defect is accepted as a separate outcome.
