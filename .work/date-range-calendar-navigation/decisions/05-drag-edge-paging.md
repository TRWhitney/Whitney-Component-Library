# 05 Drag edge paging

**Status:** resolved
**Blocked by:** [Endpoint editing](01-endpoint-editing.md), [Two-month layout](04-two-month-layout.md)
**Type:** prototype

## Question

What edge target, dwell time, and repeat cooldown make cross-month endpoint dragging deliberate without feeling stalled?

## Answer

Page when an active endpoint drag enters a full leading or trailing gutter or continues beyond the calendar boundary. Date cells always take priority over paging, including the outermost columns, so every visible date remains a stable drag target. Do not require the pointer to first hit the month's exact first or last date. Preserve the dragged endpoint across paging. Use a 350 ms initial dwell and a 500 ms repeat cooldown, resetting when the pointer leaves the edge region or enters a date cell.

## Evidence

- The user requires a short cooldown and maintained drag state, but did not prescribe timing.
- The exact-boundary-date target was rejected as too strict for effective dragging.
- The initial full edge band overlapped the outer date columns and was rejected because it could page while targeting those dates.
- The accepted prototype verified both stable outer-column targeting and paging beyond the popup.
