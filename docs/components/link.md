# Link

Link exposes a real navigation destination through native anchor semantics.

## Use for

- activation navigates to a URL, resource, page, or in-page destination

## Do not use for

- activation changes local application state, submits a form, performs a command, or toggles persistent selection

## Prefer instead

- Use Button for in-place commands and ToggleButton for persistent binary selection.

## Composition and parts

- Render Link inside AppearanceProvider and place it in prose, navigation, or a region that supplies the destination context.
- Link exposes one destination-label region and no command or icon slots.

## Preferred higher-level compositions

- Use Link within semantic navigation or prose rather than placing it in ButtonGroup or Toolbar as a command surrogate.

## Content

- Use destination-oriented text that remains understandable outside its surrounding sentence.

## States

- Current, hover, focus, and disabled states remain distinguishable without making the link resemble a button.

## Control, events, validation, and forms

- href is required. current, isDisabled, and newWindow describe navigation state without an activation callback.
- Link exposes native navigation rather than onPress; application routing may intercept the anchor through its normal router integration.
- The TypeScript API rejects arbitrary classes, inline styles, polymorphic elements, and unsupported visual variants.
- Link does not submit, reset, validate, or contribute a value to a form.

## Accessibility

- Link renders a native anchor with a visible accent-bearing underline and focus outline, so neutral label color does not hide its navigation role.
- current exposes the active destination through aria-current, and newWindow applies safe opener isolation.

## Keyboard, labeling, localization, and direction

- Enter follows the native anchor destination. Link participates in normal document tab order.
- Visible children provide the accessible name; avoid generic destination text such as click here or more.
- Supply all visible and accessible labels in the application locale and allow labels to grow without relying on a fixed text width.
- Logical sizing and placement follow inherited writing direction; authored content remains in DOM reading order.

## Appearance and responsive behavior

- Enabled Link uses a pointer cursor across its label and padding. Disabled Link uses not-allowed.
- Link paints neutral text with an accent-bearing underline and no resting control surface; current, hover, focus, and disabled treatments remain distinct in both appearances.
- Link remains inline with surrounding content and follows normal text wrapping at compact widths.

## Accent, forced colors, and reduced motion

- Link text stays neutral while its resting underline, focus, hover tint, and stronger current-destination underline use exact or saturated same-hue accent structure without borrowing status colors.
- Forced-color mode uses the system link color and focus highlight while keeping the native underline and current-page emphasis.
- Reduced motion removes link color and underline transitions without removing any navigation state.

## Examples

### Open a run

Expose a real destination and mark the current page when applicable.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Link} from '@trwhitney/component-library';

export function OpenRunLink() {
  return (
    <AppearanceProvider appearance="dark" accent="#2474ff">
      <Link href="/runs/0284" current="page">Run 0284</Link>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not use navigation for an in-place command

A placeholder destination disguises a command and creates incorrect browser behavior.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Link} from '@trwhitney/component-library';

export function LinkDisguisedAsCommand() {
  return (
    <AppearanceProvider appearance="dark" accent="#2474ff">
      <Link href="#">Recalculate profile</Link>
    </AppearanceProvider>
  );
}
```
