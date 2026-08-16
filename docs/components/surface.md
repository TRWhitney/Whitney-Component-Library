# Surface

Surface contains related content with owned neutral hierarchy, padding, and rounded geometry.

## Use for

- related content needs one rounded, opaque, density-controlled containment region

## Do not use for

- Surface alone is expected to provide a semantic name, active accent glow, status meaning, or arbitrary card styling

## Prefer instead

- Compose Section inside Surface when rounded containment also needs a visible semantic name; use semantic feedback components for success, warning, or failure.

## Composition and parts

- Render Surface inside AppearanceProvider so its owned appearance and containment tokens are available.
- Choose base, raised, or subtle from actual hierarchy and compose content with layout primitives inside.
- Surface exposes one opaque children region and no named parts.

## Preferred higher-level compositions

- Compose Section, Stack, ResponsiveGrid, or ScrollRegion inside one Surface when each adds a distinct relationship.

## Content

- Keep one coherent content region inside a Surface and avoid nesting surfaces solely to create spacing.

## States

- The primitive has no internal state; changing a bounded prop deterministically updates its structural attributes.

## Control, events, validation, and forms

- Variant and padding are controlled by bounded semantic props; Surface owns no selection or expansion state.
- The primitive emits no callback events and owns no interactive state.
- The TypeScript API rejects arbitrary classes, inline styles, token values, and unsupported semantic options.
- The primitive does not submit values or participate in reset, validation, required, disabled, or read-only form state.

## Accessibility

- Surface contributes containment only; use Section or semantic children when the region needs a name or landmark.

## Keyboard, labeling, localization, and direction

- Surface introduces no focus target or keyboard behavior.
- Surface creates no region role and receives no label.
- The primitive renders consumer content without translating, reordering, or constructing localized sentences.
- Logical block and inline properties follow the inherited writing direction without a direction override.

## Appearance and responsive behavior

- Surface uses library-owned shape, surface, text, and border roles in both appearances; the raised variant adds restrained elevation.
- Surface preserves its boundary and padding at every width while descendants own their reflow.

## Accent, forced colors, and reduced motion

- Surface remains neutral and does not apply accent atmosphere, status color, or selection color.
- Forced-color mode uses Canvas and CanvasText, preserves the boundary, and removes elevation shadow.
- The primitive introduces no motion, so reduced motion preserves the same structure without an alternate transition.

## Examples

### Contain a working region

Use a base surface for one coherent working region.

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
