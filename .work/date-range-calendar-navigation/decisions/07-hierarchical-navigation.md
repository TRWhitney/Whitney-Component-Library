# 07 Hierarchical date navigation

**Status:** resolved
**Blocked by:** [Two-month layout](04-two-month-layout.md), [Stable calendar height](06-stable-calendar-height.md)
**Type:** prototype

## Question

How many years or larger periods belong in each fixed-size navigation level, how does the heading promote to broader levels, and how does a two-month range calendar use the hierarchy surface?

## Answer

Use a 12-item, four-column by three-row hierarchy: months within a year, years within a 12-year period, decades within a 12-decade period, and successively larger periods. Month and year remain separate heading targets in day view. Selecting an item drills down one level until returning to days without resizing the pane.

In a range calendar, the hierarchy temporarily replaces both month grids. The month or year heading that opened it determines which pane the eventual day view aligns with: a choice made from the right heading remains in the right pane, and a choice made from the left heading remains in the left pane.

## Evidence

- Built-in month and year pickers cover only the first two levels.
- The user cites Microsoft-style promotion and drill-down as the desired interaction pattern.
- The accepted prototype established the fixed replacement surface, item density, and pane alignment.
