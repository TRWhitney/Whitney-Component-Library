# 06 Stable calendar height

**Status:** resolved
**Blocked by:** none
**Type:** research

## Question

How should different month lengths avoid resizing the calendar pane?

## Answer

Every day grid reserves six week rows. Both range-calendar months use the same row height, and hierarchy views occupy that same stable content area.

## Evidence

- The installed calendar state supports a fixed `weeksInMonth` count.
- [React Aria capability research](../research/react-aria-capabilities.md)
