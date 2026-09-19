# Surface

Surface groups related content with neutral hierarchy, padding, and rounded corners.

## Use for

- related content needs one rounded, opaque, density-controlled containment region

## Do not use for

- Surface alone is expected to provide a semantic name, active accent glow, status meaning, or arbitrary card styling

## Prefer instead

- Compose Section inside Surface when rounded containment also needs a visible semantic name; use semantic feedback components for success, warning, or failure.

## Composition and parts

- Render Surface inside AppearanceProvider to load its appearance and container tokens.
- Choose base, raised, or subtle from actual hierarchy and compose content with layout primitives inside.
- Leave space between major regions so their depth reads while keeping controls compact. Set focusFieldAnchor on exactly one Surface inside FocusField; choose the panel that deserves emphasis, not automatically a status or side panel.
- Surface exposes one opaque children region and no named parts.

## Preferred higher-level compositions

- Compose Section, Stack, ResponsiveGrid, or ScrollRegion inside one Surface when each adds a distinct relationship.
- Use FocusField around the application-owned composition for responsive accent atmosphere behind a chosen opaque Surface. Emphasis never changes Surface elevation.

## Content

- Keep one related content region inside a Surface. Do not nest surfaces just to add space.

## States

- The primitive has no internal state. Changing a prop updates its structural attributes.

## Control, events, validation, and forms

- Preset props control variant and padding. Optional focusFieldAnchor marks this panel as the single anchor inside its nearest FocusField. Surface has no selection or expansion state.
- The primitive emits no callbacks and has no interactive state.
- The TypeScript API rejects custom classes, inline styles, token values, and unsupported options.
- The primitive does not submit values or participate in reset, validation, required, disabled, or read-only form state.

## Accessibility

- Surface only groups content visually. Use Section or an appropriate child element when the region needs a name or landmark.

## Keyboard, labeling, localization, and direction

- Surface introduces no focus target or keyboard behavior.
- Surface creates no region role and receives no label.
- The primitive renders consumer content without translating, reordering, or constructing localized sentences.
- Logical block and inline properties follow the inherited writing direction without a direction override.

## Appearance and responsive behavior

- Surface uses library shape, background, text, and border styles with an opaque, solid face. Base has a low downward shadow; raised has a stronger downward shadow; subtle remains flat. Light and dark appearances preserve this hierarchy.
- Surface keeps its border and padding at every width. Descendants control their own reflow.

## Accent, forced colors, and reduced motion

- Surface stays neutral. It does not apply accent, status, or selection colors.
- Forced-color mode uses Canvas and CanvasText, keeps the border, and removes the shadow.
- The primitive has no motion, so the reduced-motion setting does not change it.

## Examples

### Contain a working region

Use a base surface for one working region.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Stack, Surface} from '@trwhitney/component-library';

export function WorkingRegion() {
  return (
    <AppearanceProvider appearance="light" accent="#2474ff">
      <Surface variant="base" padding="regular">
        <Stack gap="regular">
          <h2>North chamber</h2>
          <p>Evaluate the 18-minute ramp profile.</p>
        </Stack>
      </Surface>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not stack decorative containers

Use layout spacing instead of nesting neutral surfaces without a hierarchy change.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Surface} from '@trwhitney/component-library';

export function NestedDecoration() {
  return (
    <AppearanceProvider appearance="light" accent="#2474ff">
      <Surface variant="raised">
        <Surface variant="subtle">Stable</Surface>
      </Surface>
    </AppearanceProvider>
  );
}
```
