# Stack

Stack arranges related elements vertically with consistent spacing.

## Use for

- related elements need a consistent vertical rhythm with one semantic spacing and alignment choice

## Do not use for

- content requires tabular alignment, collection semantics, or an arbitrary one-off spacing value

## Prefer instead

- Use InlineGroup for a horizontal peer relationship and ResponsiveGrid for responsive columns.

## Composition and parts

- Render Stack inside AppearanceProvider to load its spacing tokens.
- Place related siblings directly inside Stack and nest another layout primitive only when the relationship changes.
- Stack exposes one ordered children region and no named parts.

## Preferred higher-level compositions

- Use Stack inside Surface or Section for a compact vertical field, status, or content sequence.

## Content

- Keep children in reading order and give each one the appropriate HTML element.

## States

- The primitive has no internal state. Changing a prop updates its structural attributes.

## Control, events, validation, and forms

- The gap and alignment props use preset values. They default to regular spacing and stretch alignment.
- The primitive emits no callbacks and has no interactive state.
- The TypeScript API rejects custom classes, inline styles, token values, and unsupported options.
- The primitive does not submit values or participate in reset, validation, required, disabled, or read-only form state.

## Accessibility

- Stack changes layout only. Use the appropriate child elements for lists, navigation, regions, and headings.

## Keyboard, labeling, localization, and direction

- Stack introduces no focus target or keyboard behavior.
- Stack creates no semantic region and receives no label.
- The primitive renders consumer content without translating, reordering, or constructing localized sentences.
- Logical block and inline properties follow the inherited writing direction without a direction override.

## Appearance and responsive behavior

- Stack uses the library spacing scale and adds no color.
- Stack stays vertical at every width. Its children decide how they wrap or reflow.

## Accent, forced colors, and reduced motion

- Stack does not apply the application accent.
- Forced colors do not change Stack geometry because Stack paints no decorative color.
- The primitive has no motion, so the reduced-motion setting does not change it.

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
