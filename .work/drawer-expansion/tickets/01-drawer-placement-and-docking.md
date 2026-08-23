# 01 Drawer placement and docking

**What to build:** Extend the public Drawer with four placements, optional docked preview and grip,
direct dragging, and the accepted edge treatment while preserving existing modal behavior.

**Blocked by:** none

**Status:** complete

- [x] `placement` accepts `start`, `end`, `top`, and `bottom` while rejecting `left` and `right`.
- [x] Supplying `dragHandleLabel` renders an accessible grip that opens and docks by click,
      placement-relative keyboard input, and pointer drag.
- [x] Supplying `dockedPreview` keeps an assistive-technology-hidden strip visible and reserves its
      exact width or height from AppearanceProvider content.
- [x] The open Drawer remains modal, dismissable, focus-contained, and focus-restoring.
- [x] All four placements preserve the accepted surface, seam, grip, and preview geometry.
- [x] Opening, dragging, and docking do not create horizontal or vertical document overflow.
- [x] Focused component, type, and static-style tests pass.

## Accepted sources

- [Specification](../spec.md)
- [Prototype acceptance](../prototypes/acceptance.md)
- [Interactive Drawer lab](../prototypes/drawer-lab.html)
- [ADR 0003](../../docs/adr/0003-build-on-react-aria-privately.md)
- [ADR 0010](../../docs/adr/0010-preserve-consumer-composition-boundaries.md)

## Completion evidence

- `npm run check` passes formatting, ESLint, Stylelint, TypeScript, 325 tests, generated-file checks,
  and the TypeScript 5, 6, and 7 declaration matrix.
- Controlled dock interactions now wait for the accepted `isOpen` value, the ordinary trigger and
  dialog share React Aria's ID, and ten placement-relative arrow steps settle exactly at each end.
- Direct browser operation at all four placements confirms click and pointer-drag opening, live drag
  movement, reverse closing motion, a reachable `grab` cursor while open, zero perpendicular handle
  shift, and zero horizontal document overflow.
- The preview strip contracts from 88px to 0px for inline drawers and from 70px to 0px for block
  drawers. It grows back while closing. The seam and handle outline use the same accent rail.
- At 390 by 844 pixels, every placement fills the visual viewport when open and produces no
  horizontal overflow.
- Scoped RTL operation confirms a logical start Drawer resolves to the physical right edge and
  reserves that same physical edge from its provider.
