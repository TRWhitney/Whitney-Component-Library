# 03 Keep navigator collapse local and stable

**What to build:** Remove external collapse state and callbacks; preserve navigator width, control dimensions, sidebar width and sibling visibility while collapsing its outline to the header; top-sidebar placement is flush while retaining borders; update demo and guidance.

**Blocked by:** none

**Status:** complete

- [x] Remove external collapse state and callbacks; preserve navigator width, control dimensions, sidebar width and sibling visibility while collapsing its outline to the header; top-sidebar placement is flush while retaining borders; update demo and guidance.
- [x] Documentation and examples reflect the changed behavior; public API changes have type coverage where applicable.
- [x] Applicable checks cover the accepted outcome.

## Accepted sources

[Cleanup specification](../spec.md) and its linked Ticket 30 findings.

## Completion evidence

Public type coverage rejects external collapse control. In Chromium and Firefox, the corrected demo navigator collapses from about 376.6px to 58px tall at unchanged 219px width. Sidebar and header-control dimensions remain unchanged. Whitney subsequently requested New document immediately below the navigator; the independent control follows its height in both states. Link rows now include padding within density-controlled height: compact links are 36px instead of 50px. The top placement retains a 1px border with square top corners. Fieldnotes New document remains independent and usable while navigation is collapsed. See the [shared verification record](../status.md#verification).
