# Divider

Divider separates adjacent groups with one complete neutral rule.

## Use for

- two adjacent groups need a complete visual and semantic separation

## Do not use for

- spacing alone establishes the grouping or a partial decorative line would terminate without structural meaning

## Prefer instead

- Use Stack or InlineGroup spacing when content is related and no semantic separation is needed.

## Composition and parts

- Render Divider inside AppearanceProvider so its owned neutral border role is available.
- Place Divider between complete sibling groups; let the parent layout own spacing around it.
- Divider is one complete horizontal or vertical rule with no named parts.

## Preferred higher-level compositions

- Use Divider between full sibling regions, never through controls or across unrelated content.

## Content

- Divider accepts no children, label, icon, or status content.

## States

- The primitive has no internal state; changing a bounded prop deterministically updates its structural attributes.

## Control, events, validation, and forms

- Orientation and whether the line is semantic or decorative are controlled by bounded props.
- The primitive emits no callback events and owns no interactive state.
- The TypeScript API rejects arbitrary classes, inline styles, token values, and unsupported semantic options.
- The primitive does not submit values or participate in reset, validation, required, disabled, or read-only form state.

## Accessibility

- A meaningful Divider exposes the separator role and orientation; a decorative Divider is hidden from assistive technology.

## Keyboard, labeling, localization, and direction

- Divider is never focusable and introduces no keyboard behavior.
- Divider receives no label; surrounding groups carry their own labels.
- The primitive renders consumer content without translating, reordering, or constructing localized sentences.
- Logical block and inline properties follow the inherited writing direction without a direction override.

## Appearance and responsive behavior

- Divider paints one complete rule with the library-owned neutral border role in both appearances.
- A horizontal Divider fills available inline size and a vertical Divider stretches with its parent group.

## Accent, forced colors, and reduced motion

- Divider uses the neutral border role rather than the application accent.
- Forced-color mode paints Divider with the CanvasText system color.
- The primitive introduces no motion, so reduced motion preserves the same structure without an alternate transition.

## Examples

### Separate two content groups

Use one semantic rule between complete sibling groups.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Divider} from '@trwhitney/component-library';

export function RunGroups() {
  return (
    <AppearanceProvider appearance="light" accent="#2474ff">
      <div>
        <p>Geometry validated</p>
        <Divider />
        <p>Solve pending</p>
      </div>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not add ornamental fragments

Avoid disconnected rules that imply a relationship without separating groups.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Divider} from '@trwhitney/component-library';

export function DecorativeFragments() {
  return (
    <AppearanceProvider appearance="light" accent="#2474ff">
      <div>
        <Divider decorative />
        <Divider decorative />
        <p>Stable</p>
      </div>
    </AppearanceProvider>
  );
}
```
