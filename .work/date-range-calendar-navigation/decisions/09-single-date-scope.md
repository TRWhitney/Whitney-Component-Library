# 09 Single-date picker scope

**Status:** resolved
**Blocked by:** [Stable calendar height](06-stable-calendar-height.md), [Hierarchical date navigation](07-hierarchical-navigation.md)
**Type:** discussion

## Question

Do fixed height and hierarchical month/year navigation apply to both DatePicker and DateRangePicker, while dual months and endpoint behavior remain range-only?

## Answer

Yes. Fixed six-week height and hierarchical month/year navigation apply to both DatePicker and DateRangePicker. Two simultaneous months, active endpoint state, endpoint rails, and endpoint dragging remain range-only.

## Evidence

- DatePicker and DateRangePicker currently share `CalendarSheet`.
- The user identified variable height and long-distance navigation as general calendar concerns.
