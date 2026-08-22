# Calendar navigation and endpoint editing

## Problem Statement

DateRangePicker currently presents one month, closes selection through the primitive's default range workflow, and does not expose which endpoint a calendar interaction will edit. Long ranges require repeated month-by-month navigation, month length changes resize the popup, and pointer endpoint movement cannot continue across visible month boundaries. DatePicker shares the unstable month height and limited long-distance navigation.

## Solution

Retain the existing segmented closed-field editing and trigger-opened anchored popup. Give DateRangePicker a two-month, endpoint-oriented calendar with sequential click selection, non-closing endpoint dragging, guarded edge paging, stable height, and hierarchical navigation. Give DatePicker the same stable height and hierarchy in its single-month calendar.

The accepted interaction source is the [date range navigation prototype](prototypes/date-range-navigation.md).

## User Stories

1. As a user editing a range, I want the active endpoint identified in the field and calendar, so I know which date will change.
2. As a user replacing a range, I want to choose start and end sequentially while retaining the old opposite endpoint, so the edit remains understandable.
3. As a user adjusting a boundary, I want to drag it across dates and visible months without closing the popup, so fine range changes remain continuous.
4. As a user reviewing a range, I want two adjacent months with one-month paging and stable dimensions, so nearby dates remain visible without layout shifts or scrollbars.
5. As a user navigating a long distance, I want to promote from months to years, decades, and larger periods and drill back down, so I do not need repeated month paging.
6. As a keyboard or assistive-technology user, I want the same endpoint and navigation model exposed through standard focus, names, announcements, and activation semantics.

## Implementation Decisions

- [Endpoint editing](decisions/01-endpoint-editing.md) defines open, click, direct-entry synchronization, rails, close, and post-drag activity.
- [Partial range boundary](decisions/02-partial-range-boundary.md) keeps incomplete calendar selection internal and public values complete-or-null.
- [Endpoint crossing](decisions/03-endpoint-crossing.md) normalizes crossed drags and swaps settled endpoint identities.
- [Two-month layout](decisions/04-two-month-layout.md) defines adjacent consecutive panes, shared navigation, one-month paging, and scrollbar-free compression.
- [Drag edge paging](decisions/05-drag-edge-paging.md) defines date-cell priority, edge regions, dwell, repeat, and preserved drag state.
- [Stable calendar height](decisions/06-stable-calendar-height.md) requires six week rows and a stable hierarchy surface.
- [Hierarchical navigation](decisions/07-hierarchical-navigation.md) defines the 12-item four-column levels, promotion, drill-down, replacement surface, and pane alignment.
- [Keyboard and assistive interaction](decisions/08-keyboard-accessibility.md) defines focus, activation, announcement, and hierarchy keyboard behavior.
- [Single-date scope](decisions/09-single-date-scope.md) applies stable height and hierarchy to DatePicker without range-only behavior.
- Locale, calendar system, bounds, unavailable dates, validation behavior, controlled and uncontrolled values, form serialization, disabled/read-only invariants, SSR, and hydration remain supported by the existing public API.
- Opening a calendar after descending direct segment entry settles the complete dates chronologically before endpoint editing. Calendar commits pass through picker state so displayed fields, validation, public change events, and endpoint identities settle together.
- No new public partial-range or drag API is introduced.

## Testing Decisions

- Extend the existing date-time family seam for public controlled/uncontrolled values, form serialization, validation, disabled dates, open state, focus restoration, SSR, and non-Gregorian calendar behavior.
- Cover fixed six-week grids, adjacent month offsets, shared one-month navigation, no popup overflow at the reviewed narrow viewport, and hierarchy promotion/drill-down for both picker types.
- Cover start activity on open, start then end cell activation, ordinary completion close, active field rails, and complete-or-null public change emissions.
- Cover start/end drag settlement, all four active-role combinations, crossed identity swaps, non-closing release, date-cell priority in outer columns, edge dwell/repeat/cancel, and drag continuation after paging.
- Cover direct descending entry followed by calendar open and drag, asserting ordered fields and cleared stale validation.
- Cover keyboard endpoint selection, hierarchy spatial navigation and activation, announcements, Escape dismissal, and trigger focus restoration.
- Visually inspect light, dark, invalid, unavailable, narrow, hierarchy, selected-range, and drag states in the human-facing showcase.

## Out of Scope

- More than two simultaneous range month grids
- Non-contiguous ranges
- Date-time, instant, or time-zone selection
- A public partial-range value
- Drag interaction for DatePicker

## Further Notes

The accepted prototype is retained as isolated design evidence. Production behavior must use internationalized date arithmetic and accessible calendar semantics rather than the prototype's Gregorian fixtures and native-button approximations.
