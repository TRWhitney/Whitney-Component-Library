# Button

Button runs a command with native button and form behavior.

## Use for

- a user runs a command, confirms a choice, or submits or resets a form

## Do not use for

- activation changes the current URL, represents persistent binary selection, or needs an icon without visible text

## Prefer instead

- Use Link for navigation, ToggleButton for persistent binary selection, and IconButton only for a familiar icon-only command.

## Composition and parts

- Render Button inside AppearanceProvider and place adjacent peer commands in ButtonGroup or Toolbar according to their keyboard relationship.
- Button exposes one visible label region and an automatic visually hidden pending status.

## Preferred higher-level compositions

- Use ButtonGroup for a few related commands and Toolbar when compact commands share arrow-key navigation.

## Content

- Use a concise verb-led visible label that remains unchanged while pending.
- Use secondary for a standard command, quiet for a supporting or low-emphasis command, primary only for the clearest next action in a region, and danger only for a destructive command.

## States

- Secondary is the default; primary, quiet, and danger change emphasis without changing command semantics.
- Hover, focus, press, pending, and disabled feedback do not translate, scale, or resize the control.

## Control, events, validation, and forms

- Button is controlled by isDisabled and isPending; pending requires a localized pendingLabel and prevents activation without removing focus.
- onPress reports one modality-independent activation and is not called while disabled or pending.
- The TypeScript API rejects arbitrary classes, inline styles, polymorphic elements, and unsupported visual variants.
- type defaults to button. Set it to submit or reset when needed. Use form, name, value, or formNoValidate only for their native form behavior.

## Accessibility

- The rendered element is a native button with an unchanged visible label and a visible focus outline.
- Pending keeps the button focusable but inert and exposes pendingLabel as a live status description without replacing the visible label.

## Keyboard, labeling, localization, and direction

- Enter and Space activate the native button. Buttons remain individual tab stops in ButtonGroup and use arrow navigation in Toolbar.
- The visible children provide the accessible name; pendingLabel describes progress and must not duplicate or replace the command label.
- Supply all visible and accessible labels in the application locale and allow labels to grow without relying on a fixed text width.
- Logical sizing and placement follow inherited writing direction; authored content remains in DOM reading order.

## Appearance and responsive behavior

- Button uses the library control height, rounded shape, type, and secondary, primary, quiet, or danger style.
- Button keeps its minimum regular or compact control height and wraps long labels instead of clipping them when its container narrows.

## Accent, forced colors, and reduced motion

- Primary emphasis uses the application accent unchanged, with a separately chosen readable foreground. A more saturated border with the same hue appears only when the fill blends into its background.
- Hover colors keep the accent hue. Focus and interactive edges use the exact accent or a more saturated version of the same hue. Labels stay neutral, danger uses its status color, and pending uses warning.
- Forced-color mode maps the button boundary, label, focus outline, and pending rail to system colors.
- Reduced motion stops the traveling pending rail and removes state transitions while keeping a static warning rail and every state boundary.

## Examples

### Run a profile

Keep the command label unchanged and describe pending work separately.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Button} from '@trwhitney/component-library';

export function RunProfileAction() {
  return (
    <AppearanceProvider appearance="dark" accent="#2474ff">
      <Button variant="primary" isPending pendingLabel="Running profile">
        Run profile
      </Button>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not use a command for navigation

A button labeled like a destination does not expose a link destination to the browser.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Button} from '@trwhitney/component-library';

export function CommandDisguisedAsNavigation() {
  return (
    <AppearanceProvider appearance="dark" accent="#2474ff">
      <Button>Open run history</Button>
    </AppearanceProvider>
  );
}
```
