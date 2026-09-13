# 04 Make editor access and height explicit

**What to build:** Readonly and locked are visibly identifiable on the editor with non-color cues; bounded fill height works across modes and resizing; preserve content, selection and editing restrictions.

**Blocked by:** none

**Status:** complete

- [x] Readonly and locked are visibly identifiable on the editor with non-color cues; bounded fill height works across modes and resizing; preserve content, selection and editing restrictions.
- [x] Documentation and examples reflect the changed behavior; public API changes have type coverage where applicable.
- [x] Applicable checks cover the accepted outcome.

## Accepted sources

[Cleanup specification](../spec.md) and its linked Ticket 30 findings.

## Completion evidence

Editor tests cover access cues, restrictions, selection, and bounded sizing. Rework replaces the label badge with a document background, dashed boundary, and pinned lock indicator; the separate demo alert explains access restrictions above the editor. Browser inspection covers both themes, 390px and 1440px widths, 448px and 640px parent heights, and Source, Live Preview, and Preview modes. The editor matches its parent height without outer overflow; read-only and locked documents remain selectable and cannot be typed into. See the [shared verification record](../status.md#verification).
