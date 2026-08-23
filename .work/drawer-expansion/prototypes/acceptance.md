# Drawer prototype acceptance

## Accepted behavior

- Drawer supports `start`, `end`, `top`, and `bottom` placement.
- The content-facing edge is straight. Only its two outer corners have a subtle 14px radius.
- The lifted seam is a straight 2px accent line spanning the middle 64% of the content-facing edge,
  with a short fade at both ends.
- A grip projects 18px from the seam. Its visible face is 26px long with short tapered ends, while
  its operable hit target remains larger.
- The grip is optional. When present, click, keyboard, and pointer drag can fully extend or dock the
  Drawer from every placement.
- Grip-only docking leaves the existing lifted seam visible while the rest of the Drawer remains
  recessed.
- A docked preview strip is optional and uses the Drawer surface, rounded outer corners, lifted
  seam, and grip as one connected object.
- The preview strip reserves its full width or height. Application content and positioned viewport
  controls reflow into the remaining area rather than sitting underneath it.
- The fully extended Drawer is modal and retains the existing close, backdrop, Escape, focus
  containment, and focus restoration behavior.
- Drawer movement never creates document overflow or a transient horizontal scrollbar.

## Production design plan

- Color roles use the established raised and subtle surfaces, primary and muted text, accent rail,
  and standard border tokens. The preview softly mixes the raised surface with the accent-soft role.
- Typography keeps the existing overlay display title, body copy, and compact utility treatment for
  preview metadata.
- Layout stays edge-attached with the existing fixed header, scrolling body, and fixed footer. A
  preview reserves provider space while the fully extended panel remains a modal overlay.
- Motion is one direct edge translation with a progressive underlay. Reduced motion removes both
  transitions without changing docked or open geometry.
- The signature detail is the straight faded seam flowing through a shallow tapered grip; neither
  element introduces a notch or dip in the drawer edge.

## Flexible details

- Prototype copy, run data, and surrounding application content are disposable.
- Production may replace the prototype's imperative state and direct style updates as long as the
  accepted states and transitions remain unchanged.
- Internal element boundaries may change to preserve the library's React Aria integration.

## Acceptance flows

- Switch among all four placements in grip-only mode, then extend and dock with the grip.
- Switch among all four placements in preview-strip mode, then confirm the strip and all viewport
  content have non-overlapping bounds.
- Extend and dock from both the grip and the ordinary trigger.
- Confirm the accepted edge, seam, and grip geometry in dark and light themes.

## Source

- [Interactive Drawer lab](drawer-lab.html)
