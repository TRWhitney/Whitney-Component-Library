# InlineGroup

InlineGroup arranges peers with bounded spacing, alignment, wrapping, and equal sizing.

## Use for

- peer controls, labels, or compact values belong on one line and may wrap as a unit

## Do not use for

- children form a vertical sequence, need responsive columns, or have unequal semantic roles that should not be equalized

## Prefer instead

- Use Stack for vertical rhythm and ResponsiveGrid for independent responsive columns.

## Composition and parts

- Render InlineGroup inside AppearanceProvider so its owned spacing tokens are available.
- Place equivalent peers directly inside InlineGroup and enable equalItems only when their roles should have equal dimensions.
- InlineGroup exposes one peer-children region and no named parts.

## Preferred higher-level compositions

- Use equalItems for adjacent equivalent controls, actions, or repeated regions that must align consistently.

## Content

- Keep children in reading and tab order; do not reorder peers visually with consumer CSS.

## States

- The primitive has no internal state; changing a bounded prop deterministically updates its structural attributes.

## Control, events, validation, and forms

- Gap, alignment, wrapping, and equivalent-item sizing are controlled by bounded props; equal items share both inline and cross-axis dimensions.
- The primitive emits no callback events and owns no interactive state.
- The TypeScript API rejects arbitrary classes, inline styles, token values, and unsupported semantic options.
- The primitive does not submit values or participate in reset, validation, required, disabled, or read-only form state.

## Accessibility

- InlineGroup contributes layout only; child controls retain their own names, roles, states, and focus order.

## Keyboard, labeling, localization, and direction

- InlineGroup preserves child focus order and adds no keyboard behavior.
- InlineGroup creates no semantic group and receives no label.
- The primitive renders consumer content without translating, reordering, or constructing localized sentences.
- Logical block and inline properties follow the inherited writing direction without a direction override.

## Appearance and responsive behavior

- InlineGroup uses library-owned spacing in both appearances and paints no decorative color.
- Wrapping is enabled by default; disabling it is appropriate only when the complete row remains reachable at compact widths.

## Accent, forced colors, and reduced motion

- InlineGroup does not apply the application accent.
- Forced colors do not change InlineGroup geometry because InlineGroup paints no decorative color.
- The primitive introduces no motion, so reduced motion preserves the same structure without an alternate transition.

## Examples

### Align equivalent actions

Equalize adjacent actions that carry equivalent weight.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, InlineGroup} from '@trwhitney/component-library';

export function ReviewActions() {
  return (
    <AppearanceProvider appearance="light" accent="#2474ff">
      <InlineGroup gap="tight" equalItems>
        <button type="button">Review</button>
        <button type="button">Run profile</button>
      </InlineGroup>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not force prose into a control row

Use Stack when a description should remain a separate reading block.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, InlineGroup} from '@trwhitney/component-library';

export function CrowdedExplanation() {
  return (
    <AppearanceProvider appearance="light" accent="#2474ff">
      <InlineGroup wrap={false}>
        <button type="button">Run</button>
        <p>Review every boundary condition before starting the solver.</p>
      </InlineGroup>
    </AppearanceProvider>
  );
}
```
