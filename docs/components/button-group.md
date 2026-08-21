# ButtonGroup

ButtonGroup names and aligns related commands without changing their normal tab behavior.

## Use for

- a few related commands need a shared group and optional equal sizing

## Do not use for

- the set needs shared arrow-key navigation, is a single persistent choice set, or contains unrelated actions

## Prefer instead

- Use Toolbar when related compact commands need arrow-key navigation and use layout primitives for unrelated controls.

## Composition and parts

- Render ButtonGroup inside AppearanceProvider with Button or IconButton children and use equalItems for equivalent adjacent choices.
- A consumer component may bundle actions when it renders Button or IconButton as direct DOM children; it must not add a DOM wrapper inside ButtonGroup.
- ButtonGroup exposes one ordered rendered action region and no decorative separator.

## Preferred higher-level compositions

- Use equalItems for adjacent actions of equivalent role so labels of different lengths do not create mismatched control sizes.

## Content

- Keep children few, related, and ordered according to reading and tab sequence.

## States

- The group has no selection or disabled state. Child states do not change its layout.

## Control, events, validation, and forms

- label names the group; orientation controls layout and equalItems gives direct children consistent dimensions.
- ButtonGroup emits no group event. Each child handles its activation or selection callback.
- The TypeScript API rejects custom classes, inline styles, and unsupported layout options. Runtime validation accepts consumer component boundaries but requires rendered direct children to be Button, IconButton, or internal support nodes.
- ButtonGroup has no form behavior. Each Button keeps its native submit or reset behavior.

## Accessibility

- ButtonGroup creates a named group while every child action retains its own role, accessible name, and tab stop.

## Keyboard, labeling, localization, and direction

- ButtonGroup adds no arrow-key focus model: every enabled child remains in normal tab order and keeps its native keys.
- label is required and names the semantic group without adding visible text.
- Supply all visible and accessible labels in the application locale and allow labels to grow without relying on a fixed text width.
- Logical sizing and placement follow inherited writing direction; authored content remains in DOM reading order.

## Appearance and responsive behavior

- ButtonGroup sets the gap, orientation, and optional equal-item layout but adds no background, border, text, or state color.
- Horizontal groups keep their declared axis and allow equal child labels to wrap without clipping; choose vertical orientation when the complete horizontal group does not fit the containing region.

## Accent, forced colors, and reduced motion

- ButtonGroup paints no accent itself; its Button and IconButton children apply accent and semantic colors according to their own contracts.
- Forced colors do not change ButtonGroup geometry. Each child keeps its system-color treatment.
- ButtonGroup introduces no motion; child actions apply their own reduced-motion behavior.

## Examples

### Group review actions

Equalize adjacent commands that have equivalent placement weight.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Button, ButtonGroup} from '@trwhitney/component-library';

export function ReviewActionGroup() {
  return (
    <AppearanceProvider appearance="dark" accent="#2474ff">
      <ButtonGroup label="Review actions" equalItems>
        <Button>Review</Button>
        <Button variant="primary">Run profile</Button>
      </ButtonGroup>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not imply toolbar keyboard behavior

A command surface whose items should share arrow navigation needs Toolbar.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Button, ButtonGroup} from '@trwhitney/component-library';

export function EditorCommandsWithoutToolbar() {
  return (
    <AppearanceProvider appearance="dark" accent="#2474ff">
      <ButtonGroup label="Editor commands">
        <Button>Undo</Button>
        <Button>Redo</Button>
      </ButtonGroup>
    </AppearanceProvider>
  );
}
```
