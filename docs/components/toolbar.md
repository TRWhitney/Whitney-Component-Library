# Toolbar

Toolbar composes frequent related commands under one labeled arrow-key navigation model.

## Use for

- a compact, frequently used command surface needs one tab entry followed by orientation-aware arrow navigation

## Do not use for

- a small ordinary action row should keep every control in tab order, or the children do not share one command context

## Prefer instead

- Use ButtonGroup for a short ordinary command cluster whose children should all remain Tab stops.

## Composition and parts

- Render Toolbar inside AppearanceProvider with Button, IconButton, and ToggleButton children that belong to one command context.
- A consumer component may bundle commands when it renders Button, IconButton, or ToggleButton as direct DOM children; it must not add a DOM wrapper inside Toolbar.
- Toolbar exposes one ordered rendered control region within its bounded command surface.

## Preferred higher-level compositions

- Combine compact Button, IconButton, and ToggleButton controls only when they operate on the same editor, canvas, or selected object.

## Content

- Order commands by expected use and reading direction, and keep infrequent or unrelated actions outside the toolbar.

## States

- The toolbar surface remains neutral while child commands carry hover, focus, press, selected, pending, and disabled meaning.

## Control, events, validation, and forms

- label names the toolbar and orientation controls both its visual axis and arrow-key focus behavior.
- Toolbar emits no command event; child controls own activation and selection callbacks.
- The TypeScript API rejects arbitrary classes, inline styles, and unsupported orientation values; runtime DOM validation accepts consumer component boundaries while rejecting rendered direct children other than Button, IconButton, ToggleButton, or library-owned action support nodes.
- Toolbar itself has no form behavior; child Button types retain their explicit native form behavior.

## Accessibility

- Toolbar creates a named toolbar and delegates item roles, names, pressed states, and disabled states to its child controls.

## Keyboard, labeling, localization, and direction

- Tab enters or leaves the toolbar as one stop; horizontal toolbars use Left and Right arrows, vertical toolbars use Up and Down arrows, and horizontal direction follows the inherited writing direction.
- label is required and names the toolbar without adding visible text.
- Supply all visible and accessible labels in the application locale and allow labels to grow without relying on a fixed text width.
- Logical sizing and placement follow inherited writing direction; authored content remains in DOM reading order.

## Appearance and responsive behavior

- Toolbar paints a rounded neutral subtle surface and border around its bounded gap and orientation in both appearances.
- Horizontal toolbars preserve one command row with reachable inline overflow; vertical toolbars stack and stretch their children.

## Accent, forced colors, and reduced motion

- Toolbar paints no accent itself; Button, IconButton, and ToggleButton children apply focus, emphasis, and selection accent according to their own contracts.
- Forced-color mode maps the toolbar border and surface to system colors while each child preserves its own system-color states.
- Toolbar introduces no group motion; child commands apply their own reduced-motion behavior.

## Examples

### Compose editor commands

Combine a consumer-owned command bundle and persistent formatting state under one arrow-key model.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Button, ToggleButton, Toolbar} from '@trwhitney/component-library';

const HistoryActions = () => (
  <>
    <Button variant="quiet">Undo</Button>
    <Button variant="quiet">Redo</Button>
  </>
);

export function EditorToolbar() {
  return (
    <AppearanceProvider appearance="dark" accent="#2474ff">
      <Toolbar label="Editor commands">
        <HistoryActions />
        <ToggleButton variant="quiet">Bold</ToggleButton>
      </Toolbar>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not turn an ordinary action row into a toolbar

A short confirmation row should keep each action directly reachable by Tab.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Button, Toolbar} from '@trwhitney/component-library';

export function ConfirmationAsToolbar() {
  return (
    <AppearanceProvider appearance="dark" accent="#2474ff">
      <Toolbar label="Confirmation actions">
        <Button variant="quiet">Cancel</Button>
        <Button variant="primary">Confirm</Button>
      </Toolbar>
    </AppearanceProvider>
  );
}
```
