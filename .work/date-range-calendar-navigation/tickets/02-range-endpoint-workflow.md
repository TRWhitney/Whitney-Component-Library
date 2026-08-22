# 02 Sequential range endpoint workflow

**What to build:** DateRangePicker calendar opening and cell activation that explicitly edits start then end, retains the old opposite endpoint, shows the active field rail, synchronizes direct entry and validation, and closes only after an ordinary completing activation.

**Blocked by:** [01 Stable calendar surfaces and long-distance navigation](01-calendar-surface-navigation.md)

**Status:** complete

- [x] Opening starts with the start endpoint active and exposes that state visually and accessibly.
- [x] A start activation updates its field immediately, preserves the old end visibly, and advances activity to end without emitting a partial public range.
- [x] An end activation commits the complete ordered range, closes the popup, and restores trigger focus.
- [x] Opening after descending direct entry settles chronological order and clears stale ordering validation.
- [x] Controlled and uncontrolled values, complete-or-null change events, form values, custom validation, disabled dates, and reset behavior remain correct.
- [x] Closed segmented entry remains unchanged and does not open the calendar.
- [x] Showcase examples and generated guidance expose the endpoint model.
- [x] Focused automated, type, formatting, style, build-generation, and visual checks pass.

## Accepted sources

- [Specification](../spec.md)
- [Endpoint editing](../decisions/01-endpoint-editing.md)
- [Partial range boundary](../decisions/02-partial-range-boundary.md)
- [Endpoint crossing](../decisions/03-endpoint-crossing.md)
- [Keyboard and assistive interaction](../decisions/08-keyboard-accessibility.md)
- [Accepted prototype](../prototypes/date-range-navigation.md)

## Completion evidence

- Date-time family regressions cover opening activity, settled and empty sequential selection, no cursor-follow preview after the first click, ordinary completion, clicking the already selected active end, complete-or-null emissions, form behavior, validation, descending direct entry, controlled state, focus, SSR, and hydration.
- Direct Chromium operation chose August 22 as start while retaining August 27 as end, observed end activity with the popup still open, then clicked the selected end and observed the popup close. The closed segmented field showed the committed ordered dates and no console errors occurred.
- `npm run check` and `npm run showcase:build` passed against the complete change.
