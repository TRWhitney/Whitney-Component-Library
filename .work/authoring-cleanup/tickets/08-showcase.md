# 08 Make showcase appearance and chart layouts coherent

**What to build:** Use accent-aware library controls for appearance beside sidebar accent; remove repeated compact-density links; separate chart sections/concepts; bound explanations independently of pie width; consistent meaningful regular/compact examples.

**Blocked by:** none

**Status:** complete

- [x] Use accent-aware library controls for appearance beside sidebar accent; remove repeated compact-density links; separate chart sections/concepts; bound explanations independently of pie width; consistent meaningful regular/compact examples.
- [x] Documentation and examples reflect the changed behavior; public API changes have type coverage where applicable.
- [x] Applicable checks cover the accepted outcome.

## Accepted sources

[Cleanup specification](../spec.md) and its linked Ticket 30 findings.

## Completion evidence

All 19 showcase tests pass. Rework restores the left description/border, gives all 42 chart examples titled panels, bounds setup controls, and separates each plot from its controls. Browser inspection covers light/dark, 390px/1440px, accent inheritance, density changes, section spacing, independent pie explanation width, and shared size controls. In the 1600px browser check, the available regular line chart measures 718px and compact measures 352px; the pie explanation retains its 535px width in both modes. Chart pointer updates and keyboard selection remain usable through resizing. Chart comparison links are removed. AppearanceProvider has only an Owner field, Priority menu, and Notifications switch. ContextMenu uses one target with working review commands; the unrelated tree and export action are removed. See the [shared verification record](../status.md#verification).
