# 03 LineChart activation and selection

**What to build:** Deliver the accepted LineChart month/category and point interaction through the
public component, with independent application activation, visible selection, and a human-facing
showcase example preserving the approved prototype.

**Blocked by:** none. Include the already implemented pointer-focus correction in this delivery.

**Status:** complete

- [x] Ordinary click toggles selection when enabled; Control/Command-click activates without
      changing selection. With selection disabled, ordinary click activates. Keyboard activation
      follows the accepted modifier behavior. Touch tap selects; press-and-hold activates once,
      without selection on release. Drag movement or cancellation cancels a pending hold.
- [x] Application callbacks identify a category or point and its associated source data. A category
      produces one category activation, not separate point events. No inspected chart state persists.
- [x] Reading previews and activation share target resolution, including pointer positions between
      series. Hidden series cannot be targeted; readings and callback values remain exact.
- [x] Filled reading centers, adjoining outer selection rings, month underlines, and finite
      activation pulses match the accepted artifact in light and dark appearances. Repeated
      activation retriggers feedback; reduced motion retains a brief static acknowledgment.
- [x] Multiple selection, month-range dragging, point-rectangle dragging, additive/subtractive
      modifiers, cancellation, and Clear selection retain the approved behavior. Dragging does not
      activate. Selection does not change domains or interfere with legend emphasis and visibility.
- [x] Public selection state and change callbacks support deliberate consumer coordination without
      renderer objects or hidden global state. Hidden selections remain identified and restorable.
      Use the stable row IDs and series IDs, duplicate-coordinate tie rules, and ownership/data-update
      behavior in the specification. Prototype array indexes are not public selection identity.
- [x] Update public contracts, generated guidance, and the rendered showcase in the same production
      change. Explain selection and activation independently using the approved gestures.
- [x] Production interaction, accessibility, public-type, reduced-motion, SSR/hydration, and package
      checks cover the delivered behavior. Compare rendered production states against the accepted
      artifact; prototype approval is not evidence that production code passes these checks.

## Accepted sources

- [Specification](../spec.md#accepted-activation-and-selection-convention)
- [Approved prototype and binding contract](../prototypes/activation-selection.md#accepted-convention)
- [Existing Cartesian reading specification](../../chart-interactivity/spec.md)
- [Parent Ticket 22](../../library-foundation/tickets/22-chart-interaction-and-composition.md)

## Scope boundary

This slice delivers LineChart first. Other Cartesian, statistical, radial, and compact charts,
exploration gestures, general data animation, and mixed geometries remain in the parent ticket.
Use the explicitly accepted press-and-hold touch gesture; do not treat experimental controls as
permanent chart controls. The specification resolves this slice's public identity and data-update behavior.

## Completion evidence

Production implementation, validation, and independent intent and engineering reviews are complete.
The accepted prototype is retained; its source was only formatted for the repository-wide formatting gate.

- Public LineChart tests demonstrated missing callbacks/selection before implementation. Eighteen
  focused tests now cover independent activation/selection, category payloads, pointer target
  agreement, stable IDs, controlled ownership, drag commit/cancel/subtraction, hidden selection,
  touch hold/cancellation/data replacement, keyboard series traversal, finite repeat feedback,
  duplicate coordinates, ID validation, boundary hit areas, and SSR/hydration.
- Native production browser operation confirmed Control-click details preserve selection, month
  activation contains both values, touch hold/release preserves selection, and a January-to-March
  drag selects all three months. A boundary marker initially rejected its visible lower edge; a
  red/green regression and the repeated native drag establish the correction.
- Light/dark point inspection matches the adjoining marker edges in the accepted artifact.
  Month underlines appear below labels. Reduced-motion activation has no animation. Forced colors
  retain shape distinctions; a 480px viewport has no document horizontal overflow.
- Full test run: 591 tests in 35 files pass. Showcase build passes with the existing chunk-size
  advisory. Full `npm run check` passes, including TypeScript 5/6/7 public examples and chart isolation.
  `npm run verify:package` passes packed SSR, hydration, types, and browser builds for React 18.3.1
  and 19.2.8.

No prototype review agents or prototype test suites were run. A bounded agent updated production
contract/examples; production quality checks cover the integrated delivery.

## Production review correction

The independent intent and engineering reviews identified the same two blockers. Both were
admitted and corrected without changing the accepted behavior or public API:

- For lines without idle point markers, draw the supplemental selected-point outline below the
  reading fill. A regression first demonstrated the opaque outline painting over the center;
  it now verifies the SVG paint order. Native light/dark inspection of selected Capacity confirms
  the visible fill and adjoining selection ring.
- Point-mode live announcements name the current target series/value before the complete category
  reading. A regression first demonstrated unchanged text on Up/Down; it now verifies target
  changes while retaining both values. Native keyboard operation announced Demand then Capacity.

Renewed `npm run check` passes with 591 tests and the full TypeScript matrix/isolation checks.
Independent intent and engineering correction reviews both pass with no findings. They were limited
to these findings and the affected rendering/accessibility behavior; neither reran validation.
Parent Ticket 22 remains open for its other accepted capabilities.
