# Expand Drawer placement and docking

## Problem statement

Drawer only opens from logical inline edges through its ordinary trigger. It cannot attach to the
top or bottom, remain discoverable while closed, preview docked content, or extend through direct
dragging. Its current opening motion can also create a brief horizontal scrollbar.

## Solution

Extend Drawer with four placements and two independent dock options while preserving its existing
modal behavior when fully open.

`placement` accepts `start`, `end`, `top`, and `bottom`. `start` and `end` remain logical inline
edges and follow writing direction. `top` and `bottom` are physical block edges.

`dragHandleLabel` is an optional localized string. Supplying it renders an accessible grip that
can toggle the Drawer, respond to placement-relative arrow keys plus Home and End, and track a
pointer drag toward or away from the viewport center. Pointer release extends at 42% progress or
when inward velocity exceeds 0.5 pixels per millisecond; otherwise it returns to dock. The public
open state changes only when the interaction settles fully open or fully docked.

`dockedPreview` is optional consumer content rendered as a non-interactive visual preview. It keeps
the Drawer surface visible at its docked edge and reserves the same width or height from the active
AppearanceProvider. Application content must not remain beneath the strip. Consumers must not put
interactive controls or unique accessible information in the preview because the preview is hidden
from assistive technology.

Either dock option keeps a dock shell mounted while closed. Without both options, Drawer retains
its current mount, opening, dismissal, and focus behavior. One preview Drawer may occupy a given
AppearanceProvider edge at a time; consumers own coordination if they render several preview
Drawers on the same edge.

The accepted content-facing geometry, dock states, and interaction behavior are defined by the
[prototype acceptance contract](prototypes/acceptance.md).

## User stories

1. As a consumer, I want to place a Drawer on any viewport edge so supplemental work can follow the
   application layout.
2. As a user, I want to drag an optional grip toward the viewport center so I can fully extend a
   docked Drawer directly.
3. As a user, I want an optional preview strip to remain visible without covering application
   content.
4. As a keyboard or assistive-technology user, I want the grip and extended Drawer to retain clear
   labels, focus containment, dismissal, and focus restoration.

## Implementation decisions

- Keep React Aria private and use its lower-level overlay hooks for dock-enabled Drawers so one
  Drawer body can remain mounted while docked and become modal only when fully extended. This
  follows [ADR 0003](../../docs/adr/0003-build-on-react-aria-privately.md).
- Keep the existing React Aria Components path for Drawers without dock options.
- Preserve consumer composition boundaries and validate the ordinary trigger after rendering, as
  required by [ADR 0010](../../docs/adr/0010-preserve-consumer-composition-boundaries.md).
- Reserve preview space at the AppearanceProvider boundary. The fixed dock shell remains outside
  that layout space.
- Publish physical reserved-edge custom properties from AppearanceProvider so a Drawer in a scoped
  writing direction still reserves its rendered viewport edge. Library-owned fixed notification
  regions consume them automatically; consumer-owned fixed controls use the relevant property in
  their inset.
- Render the accepted grip as library-owned SVG and keep preview content non-interactive and
  `aria-hidden`.
- Use the established accent roles, surface tokens, typography, and motion variables. The accepted
  seam and grip are the signature element. No new theme tokens are required.
- At compact widths, a fully extended Drawer fills the visual viewport for every placement.

## Testing decisions

- Component tests cover all four placement values, controlled and uncontrolled opening, dock
  persistence, click and keyboard grip operation, pointer threshold settlement, dismissal, and
  focus restoration.
- Type tests accept the four placements and new dock props while continuing to reject physical
  `left` and `right` values.
- Static style tests cover edge alignment, top and bottom sizing, clipped overflow, seam geometry,
  grip geometry, preview-space reservation, reduced motion, and forced colors.
- Showcase tests operate all four placements and both dock options.
- Package and generated-documentation checks confirm the public contract and docs remain current.

## Out of scope

- Arbitrary drawer sizes, resizable fully open panels, persistent navigation, interactive preview
  content, simultaneous preview Drawers on the same edge, and consumer styling injection.

## Further notes

- The [interactive prototype](prototypes/drawer-lab.html) remains the binding visual reference.
