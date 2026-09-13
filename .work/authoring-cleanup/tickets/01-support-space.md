# 01 Remove unwanted empty support gaps

**What to build:** Choice controls and FileTrigger expose optional support-space reservation; descriptions/errors and pending announcements remain available; settings use Switch without empty gaps.

**Blocked by:** none

**Status:** complete

- [x] Choice controls and FileTrigger expose optional support-space reservation; descriptions/errors and pending announcements remain available; settings use Switch without empty gaps.
- [x] Documentation and examples reflect the changed behavior; public API changes have type coverage where applicable.
- [x] Applicable checks cover the accepted outcome.

## Accepted sources

[Cleanup specification](../spec.md) and its linked Ticket 30 findings.

## Completion evidence

Choice and file acquisition regressions pass. Optional empty tracks disappear; visible support and acquisition announcements remain. Fieldnotes settings use Switch with reservation disabled. Switch includes padding within the shared field-height token; controls measure 36px in compact desktop mode, matching adjacent Select controls. Inspected at 390px and desktop widths. See the [shared verification record](../status.md#verification).
