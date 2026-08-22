# React Aria calendar capability research

## Finding

The installed React Aria and React Stately versions can supply locale-aware date math, calendar semantics, two visible months, one-month paging, partial field display, month grids, and year grids. They do not supply the requested active-endpoint model, a non-closing endpoint drag, drag-across-edge paging, or navigation above a year grid.

## Evidence

- `RangeCalendar` accepts `visibleDuration` and `pageBehavior`; `CalendarGrid` accepts a date offset. Two grids with zero- and one-month offsets can share the calendar's previous and next buttons.
- `weeksInMonth={6}` makes every day grid reserve the same number of week rows.
- `useDateRangePickerState` keeps incomplete endpoints in placeholder state and only publishes a complete range. Its `shouldCloseOnSelect` default is `true`.
- `useCalendarCell` turns pointer-down on a selected boundary into a drag and pointer-up into range selection. `useRangeCalendar` commits an anchored selection on pointer release.
- `CalendarMonthPicker` lists the focused calendar year's months. `CalendarYearPicker` exposes a configurable year list, defaulting to 20 years. Neither primitive provides decades or larger periods.

## Consequences

- The public range value and form model need not become partial to show a first endpoint immediately.
- Ordinary complete selection and endpoint drag must be distinguished before the picker-level close decision.
- Library-owned state must identify the active endpoint independently of React Aria's temporary range anchor.
- Higher-level period navigation needs custom accessible grid behavior while retaining internationalized calendar arithmetic and labels.

## Sources

- Installed `react-stately/dist/private/datepicker/useDateRangePickerState.js`
- Installed `react-stately/dist/private/calendar/useRangeCalendarState.js`
- Installed `react-aria/dist/private/calendar/useCalendarCell.mjs`
- Installed `react-aria/dist/private/calendar/useRangeCalendar.mjs`
- Installed `react-aria-components/dist/private/Calendar.js`
