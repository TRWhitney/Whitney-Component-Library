# 03 Endpoint crossing

**Status:** resolved
**Blocked by:** [Endpoint editing](01-endpoint-editing.md)
**Type:** discussion

## Question

What happens when start is moved after end, or end before start: clamp at the other endpoint, swap endpoint identities, or reject the move?

## Answer

Allow either dragged endpoint to cross the other. During the preview, continue to display an ordered inclusive range. On release, normalize the dates and swap their start/end identities, updating both endpoint fields to the settled ordered values. Active-role behavior then applies to the resulting start/end identities.

## Evidence

- Existing DateRangePicker contract requires an ordered continuous interval.
- The user chose the current interaction's identity-swapping behavior over clamping.
