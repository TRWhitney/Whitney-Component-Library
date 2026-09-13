# 07 Make scroll regions easier to see

**What to build:** Increase scrollbar size slightly across library scrollers, including editor and charts, while preserving existing visibility and forced-color behavior.

**Blocked by:** none

**Status:** complete

- [x] Increase scrollbar size slightly across library scrollers, including editor and charts, while preserving existing visibility and forced-color behavior.
- [x] Documentation and examples reflect the changed behavior; public API changes have type coverage where applicable.
- [x] Applicable checks cover the accepted outcome.

## Accepted sources

[Cleanup specification](../spec.md) and its linked Ticket 30 findings.

## Completion evidence

Styles tests verify standard-width scrollbars and retained visibility rules. Chromium and Firefox scrollers were operated and inspected in narrow/wide and light/dark layouts. Native scrollbar presentation remains browser and OS controlled; headless Firefox reports a hidden native scrollbar despite the matched standard-width rule. See the [shared verification record](../status.md#verification).
