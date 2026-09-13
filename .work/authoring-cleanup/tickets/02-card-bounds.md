# 02 Contain card rails and expose explicit sizing

**What to build:** Selection rails remain within natural and explicitly sized cards. Consumers can set positive finite card dimensions and reach overflow content without imposing automatic equal heights.

**Blocked by:** none

**Status:** complete

- [x] Selection rails remain within natural and explicitly sized cards. Consumers can set positive finite card dimensions and reach overflow content without imposing automatic equal heights.
- [x] Documentation and examples reflect the changed behavior; public API changes have type coverage where applicable.
- [x] Applicable checks cover the accepted outcome.

## Accepted sources

[Cleanup specification](../spec.md) and its linked Ticket 30 findings.

## Completion evidence

The Fieldnotes Home view exposes selected document cards, a fixed/natural-height switch, search, and Open/Read actions. Its fixed cards measure 280×260px; natural cards retain differing heights and contained rails. Switching through Home preserves drafts. Home reserves two summary lines so badges and excerpts start at matching offsets in fixed and natural cards. Explicit 280×180px cards preserve those dimensions and offer keyboard-reachable overflow. Browser geometry passes at 390px and 1440px in Chromium and Firefox, in both themes. Invalid dimensions and keyboard reachability have regression coverage. See the [shared verification record](../status.md#verification).
