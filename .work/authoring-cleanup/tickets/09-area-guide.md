# 09 Show the area-chart hover position

**What to build:** Area charts expose a vertical dashed hover guide at the active reading and clear it when the reading clears; verify showcase and interactions.

**Blocked by:** none

**Status:** complete

- [x] Area charts expose a vertical dashed hover guide at the active reading and clear it when the reading clears; verify showcase and interactions.
- [x] Documentation and examples reflect the changed behavior; public API changes have type coverage where applicable.
- [x] Applicable checks cover the accepted outcome.

## Accepted sources

[Cleanup specification](../spec.md) and its linked Ticket 30 findings.

## Completion evidence

Area interaction regression verifies the hover guide and its removal. The rendered area example displays a vertical dashed guide at the pointer reading. Existing line and area interaction tests pass. See the [shared verification record](../status.md#verification).
