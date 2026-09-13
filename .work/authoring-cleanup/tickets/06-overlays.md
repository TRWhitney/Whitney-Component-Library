# 06 Restore nested Select pointer reachability

**What to build:** At 390px, Popover containing Select survives repeated Loading/Ready/Empty/Ready/Error pointer selections without interception and preserves keyboard/focus dismissal.

**Blocked by:** none

**Status:** complete

- [x] At 390px, Popover containing Select survives repeated Loading/Ready/Empty/Ready/Error pointer selections without interception and preserves keyboard/focus dismissal.
- [x] Documentation and examples reflect the changed behavior; public API changes have type coverage where applicable.
- [x] Applicable checks cover the accepted outcome.

## Accepted sources

[Cleanup specification](../spec.md) and its linked Ticket 30 findings.

## Completion evidence

A pointer regression reproduces and prevents the opening mouse release choosing the option newly positioned beneath it. Deliberate drag selection remains covered. Thirty repeated nested pointer sequences pass in each of Chromium and Firefox at 390px; Escape dismissal and focus restoration pass. The actual Popover example also passes pointer selection. See the [shared verification record](../status.md#verification).
