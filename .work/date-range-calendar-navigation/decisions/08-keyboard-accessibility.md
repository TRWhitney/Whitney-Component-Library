# 08 Keyboard and assistive interaction

**Status:** resolved
**Blocked by:** [Endpoint editing](01-endpoint-editing.md), [Hierarchical date navigation](07-hierarchical-navigation.md)
**Type:** research

## Question

What keyboard and assistive semantics expose active endpoint editing, two-month spatial movement, edge paging, and hierarchy promotion without relying on pointer drag?

## Answer

Preserve React Aria's standard calendar-grid arrow movement, Page navigation, Enter/Space selection, Escape dismissal, disabled-date behavior, and trigger focus restoration. Announce whether the start or end endpoint is active. Keyboard date activation follows the same sequential start-then-end commit behavior as an ordinary click.

Hierarchy levels expose their current period and choices by accessible name. Arrow keys move spatially through the four-column grid, Home and End move to the first and last choice, Page Up and Page Down page the current level, and Enter or Space drills down. Opening a hierarchy level moves focus into it; returning to days places focus on the chosen date. Pointer-only endpoint dragging does not require a keyboard drag analogue because direct cell activation provides the equivalent endpoint edit.

## Evidence

- Existing DateRangePicker contract delegates spatial calendar semantics to React Aria.
