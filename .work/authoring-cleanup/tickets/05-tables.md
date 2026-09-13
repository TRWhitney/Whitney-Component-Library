# 05 Support compact and stable tables

**What to build:** A compact two-column table fits a phone through public API; fixed columns remain stationary across content changes; wide tables retain scrolling.

**Blocked by:** none

**Status:** complete

- [x] A compact two-column table fits a phone through public API; fixed columns remain stationary across content changes; wide tables retain scrolling.
- [x] Documentation and examples reflect the changed behavior; public API changes have type coverage where applicable.
- [x] Applicable checks cover the accepted outcome.

## Accepted sources

[Cleanup specification](../spec.md) and its linked Ticket 30 findings.

## Completion evidence

Compact tables fit a 390px viewport, and column rectangles remain unchanged when status and action text change under the fixed sizing policy. Type and runtime validation cover the public sizing options. Wide tables retain their default scrolling policy. See the [shared verification record](../status.md#verification).
