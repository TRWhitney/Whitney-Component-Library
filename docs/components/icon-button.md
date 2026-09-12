# IconButton

IconButton presents a familiar icon-only command with required accessible guidance.

## Use for

- a compact command has a familiar icon whose meaning can be stated by one short accessible label

## Do not use for

- the command needs visible text, represents navigation or selection, or needs a pending progress announcement

## Prefer instead

- Use Button when a visible label improves recognition, Link for navigation, and ToggleButton for persistent selection.

## Composition and parts

- Render IconButton inside AppearanceProvider so its provider-scoped tooltip inherits the same appearance and accent.
- IconButton exposes one icon region and one automatic provider-scoped tooltip.

## Preferred higher-level compositions

- Place compact IconButton peers in Toolbar when they form a frequently used command surface.

## Content

- Pass one icon as children and mark decorative icon content hidden from assistive technology.
- Use secondary when the control needs its own neutral boundary, quiet when a toolbar or containing surface already supplies containment, and danger only for a destructive command.

## States

- Secondary is the default. Quiet lowers emphasis, and danger marks a destructive command. Hover, focus, press, and disabled states use no movement.

## Control, events, validation, and forms

- IconButton supports enabled and disabled command state and does not expose selection or pending state.
- onPress reports activation and is not called while the control is disabled.
- The TypeScript API rejects arbitrary classes, inline styles, polymorphic elements, and unsupported visual variants.
- IconButton always has type button and does not submit or reset a form implicitly.

## Accessibility

- The required label supplies the native button accessible name and the same text appears in an automatic hover and focus tooltip.

## Keyboard, labeling, localization, and direction

- Enter and Space activate the native button; focus also reveals the tooltip after its short guidance delay.
- label is required. It becomes the accessible name and the tooltip text.
- Supply all visible and accessible labels in the application locale and allow labels to grow without relying on a fixed text width.
- Logical sizing and placement follow inherited writing direction; authored content remains in DOM reading order.

## Appearance and responsive behavior

- Enabled IconButton uses a pointer cursor across its glyph and padding. Disabled IconButton uses not-allowed.
- IconButton uses a square regular or compact control, rounded shape, and secondary, quiet, or danger treatment in both appearances.
- IconButton keeps its square regular or compact dimensions while its containing layout determines wrapping or overflow.

## Accent, forced colors, and reduced motion

- Hover colors keep the accent hue. Focus and interactive edges use the exact accent or a more saturated version of the same hue. Icons stay neutral, and danger uses its status color.
- Forced-color mode maps the control boundary, icon, focus outline, and tooltip to system colors.
- Reduced motion removes control and tooltip transitions. Hover, focus, press, disabled, and tooltip states remain visible.

## Examples

### Close a panel

Use one familiar icon and a concise label shared with the tooltip.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, IconButton} from '@trwhitney/component-library';

export function ClosePanelAction() {
  return (
    <AppearanceProvider appearance="dark" accent="#2474ff">
      <IconButton label="Close panel" variant="quiet">
        <span aria-hidden="true">×</span>
      </IconButton>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not hide an unfamiliar command behind an icon

Prefer a visible Button label when the symbol is not immediately recognizable.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, IconButton} from '@trwhitney/component-library';

export function AmbiguousIconCommand() {
  return (
    <AppearanceProvider appearance="dark" accent="#2474ff">
      <IconButton label="Reconcile topology">
        <span aria-hidden="true">◇</span>
      </IconButton>
    </AppearanceProvider>
  );
}
```
