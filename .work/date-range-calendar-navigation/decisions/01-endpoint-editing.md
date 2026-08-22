# 01 Endpoint editing

**Status:** resolved
**Blocked by:** none
**Type:** discussion

## Question

When a complete range is opened with the start endpoint active, does choosing a new start preserve the existing end while moving activity to the end, or clear the old end and begin a fresh range?

Should an ordinary second click close the calendar after completing the range, while drag releases always keep it open?

## Answer

When the calendar opens, start is active. Choosing a start immediately updates the start field, preserves the existing end visibly, and advances activity to end. Choosing an end by an ordinary click updates the complete range and closes the calendar.

Direct segment entry remains independent while the calendar is closed. If it leaves a complete range in descending order, opening the calendar settles the dates into chronological order before endpoint editing begins. Calendar clicks and drags then commit through the picker's range state so field values, endpoint identities, and validation cannot diverge.

While the calendar is open, the active endpoint's complete segmented input carries a full-width accent rail. The rail moves from start to end as activity advances, so the field and calendar expose the same editing target.

Dragging either boundary updates the range but never closes the calendar. After a drag, the active role follows the user's requested matrix: moving start advances start activity to end but otherwise preserves the active role; moving end preserves the active role. If the dates cross, role activity applies to the normalized start/end identities after they swap.

## Evidence

- The user explicitly requires start activity on open, sequential start-then-end clicks, and no close after any endpoint drag.
- The user accepted preserving the old end while choosing a replacement start.
- The user requested a full field rail while the calendar is open so the active endpoint remains explicit.
- Mixed direct-entry and calendar-drag operation demonstrated that bypassing the picker range state could leave a stale ordering error beside an ordered range.
- [React Aria capability research](../research/react-aria-capabilities.md)
