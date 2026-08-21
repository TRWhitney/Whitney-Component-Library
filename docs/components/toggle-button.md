# ToggleButton

ToggleButton represents a persistent binary selection with pressed-button semantics.

## Use for

- one command-like control represents a persistent binary selection such as pinned, muted, or bold

## Do not use for

- activation is a one-time command, navigates, or represents a submitted form value that needs checkbox semantics

## Prefer instead

- Use Button for a one-time command, Link for navigation, and a future checkbox field for submitted binary data.

## Composition and parts

- Render ToggleButton inside AppearanceProvider and place related editor or tool toggles in Toolbar.
- ToggleButton exposes one visible label region and one selection rail.

## Preferred higher-level compositions

- Use Toolbar for related editor or visualization toggles that should share arrow-key navigation.

## Content

- Use one label that works in both selected and unselected states.
- Use secondary for a standalone toggle with its own neutral boundary and quiet inside a toolbar or another contained command surface.

## States

- Selected state uses the application accent as an under-rail without filling the whole control; hover adds feedback without obscuring that rail.

## Control, events, validation, and forms

- Use defaultSelected for uncontrolled state or isSelected with onChange for controlled state; do not combine ownership models.
- onChange reports the next selected boolean after user activation.
- The TypeScript API rejects arbitrary classes, inline styles, polymorphic elements, and unsupported visual variants.
- ToggleButton is not a form value, submit button, reset button, checkbox, or substitute for a labeled form field.

## Accessibility

- ToggleButton renders a button with aria-pressed so selected, disabled, focus, and press state remain distinct.

## Keyboard, labeling, localization, and direction

- Enter and Space toggle the pressed state. Outside a Toolbar, the button keeps its tab stop. Inside one, it uses orientation-aware arrow navigation.
- Visible children provide the accessible name, while aria-pressed communicates selection without changing that label.
- Supply all visible and accessible labels in the application locale and allow labels to grow without relying on a fixed text width.
- Logical sizing and placement follow inherited writing direction; authored content remains in DOM reading order.

## Appearance and responsive behavior

- ToggleButton uses the library control height, rounded shape, type, and secondary or quiet style with a selection rail.
- ToggleButton keeps its minimum regular or compact control height and wraps long labels instead of clipping them when its container narrows.

## Accent, forced colors, and reduced motion

- Label text stays neutral, and hover colors keep the accent hue. Focus and the selection rail use the exact accent or a more saturated version of the same hue without implying status.
- Forced-color mode maps the button boundary, label, focus outline, and selected rail to system colors.
- Reduced motion removes state transitions. Hover, focus, press, selected, and disabled states remain visible.

## Examples

### Pin status details

Use pressed state for a preference that persists after activation.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, ToggleButton} from '@trwhitney/component-library';

export function PinStatusToggle() {
  return (
    <AppearanceProvider appearance="dark" accent="#2474ff">
      <ToggleButton defaultSelected>Pin status</ToggleButton>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not model a one-time command as selected state

An action such as saving completes; it does not remain pressed afterward.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, ToggleButton} from '@trwhitney/component-library';

export function SaveAsPersistentSelection() {
  return (
    <AppearanceProvider appearance="dark" accent="#2474ff">
      <ToggleButton>Save profile</ToggleButton>
    </AppearanceProvider>
  );
}
```
