# Drawer expansion

## Destination

Extend Drawer to every viewport edge with optional docked discovery, direct dragging, reserved
preview space, and an intentional content-facing edge.

## Current state

Delivery is complete. Renewed validation and independent intent and engineering correction reviews
passed with no blocking findings.

## Progress

- `placement` supports logical `start` and `end` plus physical `top` and `bottom`.
- `dragHandleLabel` adds an accessible grip with click, keyboard, and live pointer-drag behavior.
- `dockedPreview` reserves layout space at its provider edge and remains hidden from assistive
  technology.
- Grip-only docking retains the lifted seam. Preview docking contracts and fades the strip to zero
  at full extension, then reverses while closing.
- The straight fading seam and grip outline share the accent rail. The accepted shallow grip and
  rounded outer edge treatment remain consistent across placements.
- The showcase offers no dock, grip-only, and preview-strip modes for all four placements.
- [Specification](spec.md)
- [Prototype acceptance contract](prototypes/acceptance.md)
- [01 Drawer placement and docking](tickets/01-drawer-placement-and-docking.md)
- [02 Drawer guidance and showcase](tickets/02-drawer-guidance-and-showcase.md)

## Accepted sources

- The existing Drawer implementation and component contract.
- Whitney's accepted visual and interaction iterations.
- [Interactive Drawer lab](prototypes/drawer-lab.html)

## Verification

- `npm run check`: formatting, ESLint, Stylelint, TypeScript, 325 tests, generated files, and the
  TypeScript 5, 6, and 7 declaration matrix pass.
- `npm run showcase:build`: production showcase build passes. Vite reports its non-failing existing
  large-chunk warning.
- `npm run verify:package`: packed SSR, hydration, declarations, and browser builds pass with React
  18.3.1 and React 19.2.8. npm reports a non-failing transitive `whatwg-encoding` deprecation.
- Direct browser operation covers docked, opening, open, closing, and pointer-drag states at all four
  placements. Preview extents reach zero when open and reverse while closing. Handle perpendicular
  shift and horizontal overflow both measure zero.
- Inspected dark desktop screenshots for all four docked and open placements. The strips reserve
  content space, the open surfaces have no strip cutoff, and the seam and grip remain aligned.
- Inspected light compact top and bottom Drawers at 390 by 844 pixels after correcting their open
  height. Every compact placement fills the visual viewport without horizontal overflow.
- Component coverage confirms controlled consumers remain authoritative when click, keyboard, or
  drag requests are delayed or rejected. It also covers all placement-relative arrows, the 42%
  distance threshold, velocity settlement, backdrop dismissal, focus restoration, and
  trigger-to-dialog ID linkage.
- Direct browser operation confirms ten arrow steps open and dock every placement, scoped RTL start
  reserves the physical right edge, NotificationProvider avoids end and bottom preview strips, and
  document scroll height remains stable through opening and docking.
- Independent intent and engineering correction reviews confirmed the controlled-state, keyboard
  endpoint, physical reservation, fixed-control, accessibility linkage, and focused-coverage
  corrections without introducing new blockers.

## Out of scope

- Arbitrary drawer sizes, resizable fully open panels, persistent navigation, interactive preview
  content, and simultaneous preview Drawers on the same edge.

## Continuation

- Branch: `master`
- Base commit: `1aa7735`
- Outcome: complete and ready for repository history.
- Next action: none.
