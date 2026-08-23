# Tooltip

Tooltip adds a short supplemental description to an already named control.

## Use for

- a named control benefits from a short supplemental non-interactive description

## Do not use for

- an accessible name, required interactive content, errors, durable instructions, touch-only discovery, or information needed to complete the task

## Prefer instead

- Use visible support text for required instructions, Popover for interactive content, or Menu for commands.

## Composition and parts

- Render inside AppearanceProvider and wrap exactly one library Button that already has its own accessible name. IconButton owns its label tooltip and must not receive a second tooltip.
- Pass plain string content. Interactive descendants are unrepresentable through the public type.
- Tooltip includes one named trigger, a non-focusable description, and its joined arrow.

## Preferred higher-level compositions

- Use Tooltip sparingly on named compact actions whose effect benefits from one extra sentence.

## Content

- Write one supplemental description that clarifies effect, state, or consequence. Keep the control name on the trigger itself.

## States

- Hidden and visible follow trigger hover and focus. placement and alignment request the anchor while collision handling may flip it.

## Control, events, validation, and forms

- Tooltip appears after a short hover or keyboard-focus delay, remains while the trigger is hovered or focused, and closes after pointer or focus departure or Escape.
- Tooltip exposes no application event. The wrapped control continues to own its action.
- TypeScript limits content to a string and placement to library-owned choices. Runtime validation requires exactly one rendered library Button trigger.
- Tooltip does not submit or validate data and does not change the wrapped control form behavior.

## Accessibility

- Tooltip adds a supplemental accessible description to its already named trigger and never receives focus or contains interactive content.

## Keyboard, labeling, localization, and direction

- Keyboard focus on the trigger reveals the description after the same bounded delay; Escape dismisses it without moving focus.
- The trigger keeps its own accessible name. content becomes a description through the tooltip relationship.
- Localize content as a complete short phrase and allow it to wrap.
- Logical placement, text alignment, and the anchor arrow follow the trigger writing direction.

## Appearance and responsive behavior

- Tooltip is a compact high-contrast label with a joined anchor arrow and no interactive chrome.
- The surface flips when its requested side lacks room, stays inside the visual viewport, and scrolls its own content when available height is limited.

## Accent, forced colors, and reduced motion

- Tooltip keeps its surface, boundary, and anchor bridge neutral. The application accent remains on the wrapped Button focus treatment rather than entering descriptive content.
- Forced colors preserve the surface boundary, arrow, focused item or control, and trigger focus with system colors.
- Reduced motion removes the short anchored-surface settling transition without changing placement, focus, or dismissal.

## Examples

### Supplemental command description

Add supporting detail without changing the visible or accessible control name.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Button, Tooltip} from '@trwhitney/component-library';

export function CopyRunTooltip() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Tooltip content="Copies the immutable run identifier.">
        <Button>Copy run ID</Button>
      </Tooltip>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not use Tooltip as the accessible name

Tooltip content does not replace the trigger name. Use IconButton with label when an icon-only command needs a name.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Button, Tooltip} from '@trwhitney/component-library';

export function UnnamedTooltipCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Tooltip content="Delete run">
        <Button><span aria-hidden="true">×</span></Button>
      </Tooltip>
    </AppearanceProvider>
  );
}
```
