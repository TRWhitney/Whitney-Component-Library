# Responsive visual character

## Problem Statement

The library lacks the idle depth and responsive active-region atmosphere accepted in the visual
study. Consumers should compose these through public components without reproducing effect CSS,
geometry observers, or animation code.

## Solution

Keep Surface as the opaque panel. Its base variant receives the accepted low downward shadow;
raised receives the stronger shadow; subtle remains flat. Add FocusField, a layout-neutral wrapper
that owns one responsive decorative field behind a consumer-chosen Surface. A Surface marked
focusFieldAnchor selects the anchor inside its nearest FocusField. isActive controls emphasis.
One bloom accompanies activation; idle has no glow or animation. Surface elevations never change
with emphasis.

## User Stories

1. As a consuming agent, I can discover and compose the visual language through canonical contracts,
   examples, and the public package instead of custom effects.
2. As an application user, I can distinguish panel depth while idle and recognize an emphasized
   working region without losing readable content or compact controls.

## Implementation Decisions

- Whitney accepted the latest study and authorized library implementation after the explanation
  of its changes. [Study](prototypes/study.md) is the binding visual reference.
- [Reusable boundary](../../docs/adr/0012-own-reusable-concepts-not-applications.md) applies.
  Applications own layout, meaningful active state, and which panel to emphasize. FocusField owns
  atmosphere and its lifecycle, not a review workflow or preset workspace.
- FocusField accepts children and required boolean isActive. Surface adds optional boolean
  focusFieldAnchor. No custom classes, style props, colors, offsets, radii, or selectors are public.
- Exactly one marked opaque Surface within the nearest field is the supported composition.
  Missing, multiple, or hidden anchors suppress atmosphere safely; nested fields stay isolated.
  Other unnested Surfaces in the frame are obstacles for open-space measurement. Consumer content
  does not need to be a direct child. Detached portals are outside the field.
- Field size follows anchor and frame. Only the center shifts slightly toward measured open space;
  the same radial falloff extends in every direction. The field cannot intercept events, label a
  region, add a focus target, alter layout, or shine through opaque surfaces.
- Preserve resize/content reflow, dark/light appearance, accent inheritance, RTL geometry,
  reduced motion, forced colors, SSR/hydration, and cleanup. A mounted active field is steady;
  subsequent inactive-to-active transitions bloom once and can be interrupted.
- Publish canonical FocusField guidance and revise Surface guidance. Update showcase alongside
  the components. Preserve the accepted study as evidence.
- Adopt public components in demo prototypes, retaining application-specific grouping and compact
  controls. Fieldnotes review reproduces the accepted composition, emphasizes document review while
  documents remain unreviewed, and keeps real review/export interactions.

## Testing Decisions

Use public React component tests for anchor lifecycle, activation, nested ownership, hydration,
interaction preservation, and cleanup. Use negative TypeScript fixtures for API boundaries.
Verify browser geometry and screenshots against the accepted Fieldnotes study across wide,
stacked, phone, light/dark, reduced-motion and forced-color cases. Check showcase coverage and
canonical generated documentation. Run repository checks, package verification, and demo builds.

## Out of Scope

Header Route, new application-shell components, theme customization, continuous idle motion,
automatic semantic anchor selection, and the next foundation ticket.

## Further Notes

Binding qualities are solid faces and downward depth, space between major regions, compact
controls, responsive all-direction glow around the chosen panel, a small center offset, and a
one-shot activation bloom. Component names, internal geometry code, and observer mechanics are
implementation choices. No decorative one-way beam or isolated fixed-size hotspot may replace
this behavior.
