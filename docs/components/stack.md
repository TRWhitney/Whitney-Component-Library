# Stack

Stack establishes bounded vertical rhythm between related elements.

## Use for

- related elements need a consistent vertical rhythm with one semantic spacing and alignment choice

## Do not use for

- content requires tabular alignment, collection semantics, or an arbitrary one-off spacing value

## Prefer instead

- Use InlineGroup for a horizontal peer relationship and ResponsiveGrid for responsive columns.

## Composition and parts

- Render Stack inside AppearanceProvider so its owned spacing tokens are available.
- Place related siblings directly inside Stack and nest another layout primitive only when the relationship changes.
- Stack exposes one ordered children region and no named parts.

## Preferred higher-level compositions

- Use Stack inside Surface or Section for a compact vertical field, status, or content sequence.

## Content

- Order children in reading order and keep each child responsible for its own semantic element.

## States

- The primitive has no internal state; changing a bounded prop deterministically updates its structural attributes.

## Control, events, validation, and forms

- Gap and cross-axis alignment are controlled by bounded props with regular spacing and stretch alignment as defaults.
- The primitive emits no callback events and owns no interactive state.
- The TypeScript API rejects arbitrary classes, inline styles, token values, and unsupported semantic options.
- The primitive does not submit values or participate in reset, validation, required, disabled, or read-only form state.

## Accessibility

- Stack contributes layout only; use semantic child elements for lists, navigation, regions, and headings.

## Keyboard, labeling, localization, and direction

- Stack introduces no focus target or keyboard behavior.
- Stack creates no semantic region and receives no label.
- The primitive renders consumer content without translating, reordering, or constructing localized sentences.
- Logical block and inline properties follow the inherited writing direction without a direction override.

## Appearance and responsive behavior

- Stack uses library-owned spacing in both appearances and paints no decorative color.
- Stack remains vertical at every width; children wrap or reflow according to their own contracts.

## Accent, forced colors, and reduced motion

- Stack does not apply the application accent.
- Forced colors do not change Stack geometry because Stack paints no decorative color.
- The primitive introduces no motion, so reduced motion preserves the same structure without an alternate transition.

## Examples

### Arrange a field summary

Use regular vertical rhythm for related labels and values.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Stack} from '@trwhitney/component-library';

export function SolverSummary() {
  return (
    <AppearanceProvider appearance="light" accent="#2474ff">
      <Stack gap="regular">
        <strong>Solver</strong>
        <span>Adaptive mesh</span>
      </Stack>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not simulate a data table

Use the future table primitive when values require shared columns and row semantics.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Stack} from '@trwhitney/component-library';

export function MisalignedReadings() {
  return (
    <AppearanceProvider appearance="light" accent="#2474ff">
      <Stack gap="none">
        <span>North chamber 18.2 K</span>
        <span>South chamber 4.8 K</span>
      </Stack>
    </AppearanceProvider>
  );
}
```
