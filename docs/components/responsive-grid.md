# ResponsiveGrid

ResponsiveGrid forms columns from preset minimum item widths.

## Use for

- equivalent regions should fill available width and collapse into fewer columns from a semantic minimum size

## Do not use for

- content requires a fixed table, consumer-authored breakpoint, masonry placement, or visual reordering

## Prefer instead

- Use Stack for a permanently vertical sequence and InlineGroup for one peer row.

## Composition and parts

- Render ResponsiveGrid inside AppearanceProvider to load its spacing tokens.
- Put one complete item in each direct child and choose a compact, regular, or wide minimum width.
- ResponsiveGrid exposes one item-children region and no named parts.

## Preferred higher-level compositions

- Use equalItems with equivalent Surface or Section regions when aligned outer dimensions communicate parity.

## Content

- Each child must still make sense when it moves to its own row.

## States

- The primitive has no internal state. Changing a prop updates its structural attributes.

## Control, events, validation, and forms

- Preset props control minimum item width, gap, and optional equal row sizing.
- The primitive emits no callbacks and has no interactive state.
- The TypeScript API rejects custom classes, inline styles, token values, and unsupported options.
- The primitive does not submit values or participate in reset, validation, required, disabled, or read-only form state.

## Accessibility

- ResponsiveGrid changes visual columns without changing DOM order, reading order, or focus order.

## Keyboard, labeling, localization, and direction

- ResponsiveGrid keeps child focus order and adds no keyboard behavior.
- ResponsiveGrid creates no semantic collection and receives no label.
- The primitive renders consumer content without translating, reordering, or constructing localized sentences.
- Logical block and inline properties follow the inherited writing direction without a direction override.

## Appearance and responsive behavior

- ResponsiveGrid uses preset spacing and minimum item widths and adds no color.
- Columns are derived from available inline size with auto-fit and collapse without a consumer breakpoint.

## Accent, forced colors, and reduced motion

- ResponsiveGrid does not apply the application accent.
- Forced colors do not change grid geometry because ResponsiveGrid paints no decorative color.
- The primitive has no motion, so the reduced-motion setting does not change it.

## Examples

### Arrange equivalent regions

Let equivalent regions collapse from wide columns without a custom breakpoint.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, ResponsiveGrid} from '@trwhitney/component-library';

export function ChamberRegions() {
  return (
    <AppearanceProvider appearance="light" accent="#2474ff">
      <ResponsiveGrid minimumItemWidth="wide" equalItems>
        <article>North chamber</article>
        <article>South chamber</article>
      </ResponsiveGrid>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not replace tabular relationships

Use the future table primitive when every row must share column meaning.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, ResponsiveGrid} from '@trwhitney/component-library';

export function ReadingColumns() {
  return (
    <AppearanceProvider appearance="light" accent="#2474ff">
      <ResponsiveGrid minimumItemWidth="compact">
        <span>Chamber</span>
        <span>Temperature</span>
      </ResponsiveGrid>
    </AppearanceProvider>
  );
}
```
