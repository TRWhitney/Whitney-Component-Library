# Popover

Popover holds short interactive content beside the control that opened it.

## Use for

- supplemental interactive content needs an anchored surface near the control or object that opened it

## Do not use for

- supplemental non-interactive description, a command list, consequential confirmation, deep work, or content that must remain visible

## Prefer instead

- Use Tooltip for description, Menu for commands, AlertDialog for consequential confirmation, or Dialog for a larger bounded task.

## Composition and parts

- Render inside AppearanceProvider and pass exactly one library Button or IconButton trigger.
- Supply a visible title and description, a closeLabel, body content, and optional actions that receive a close function.
- Popover includes one trigger, joined anchor arrow, labeled dialog surface, title, description, close control, body, and optional actions.

## Preferred higher-level compositions

- Compose Popover with short field or inspection content and library Button actions near the object they affect.

## Content

- Keep the task short enough to remain useful beside its trigger. Name the content directly and explain its local purpose in the description.

## States

- Closed and open may be controlled or uncontrolled. placement and alignment request a logical anchor while collision handling may flip the rendered side.

## Control, events, validation, and forms

- Popover supports controlled isOpen with onOpenChange or uncontrolled defaultOpen. Escape, outside press, the close control, and an action calling close dismiss it.
- onOpenChange reports each open-state transition. Body actions own their domain events and call close only when the local task should end.
- TypeScript limits placement and alignment choices. Runtime validation requires exactly one rendered library Button or IconButton trigger.
- Popover is not a form. Consumer-owned fields may appear in the body when their submit and validation behavior remain explicit.

## Accessibility

- Opening moves focus to the visible close control, keeps interactive content inside one labeled dialog, and restores focus to the trigger after dismissal.

## Keyboard, labeling, localization, and direction

- Enter or Space opens from its Button trigger, Tab moves through interactive content, and Escape closes and restores focus.
- title and description are required visible strings. closeLabel names the icon-only close control.
- Localize the trigger, title, description, close label, body, and actions. Copy wraps without detaching the surface from its anchor.
- Logical placement, alignment, copy, actions, and the anchor arrow follow the trigger writing direction.

## Appearance and responsive behavior

- Popover is a compact raised surface with an accent threshold and a joined arrow that identifies its current anchor. Its dialog is constrained by the positioned surface’s available height; the body scrolls inside that boundary when space is short.
- The surface flips when its requested side lacks room, stays inside the visual viewport, and scrolls its own content when available height is limited.

## Accent, forced colors, and reduced motion

- The application accent marks the top threshold and anchor bridge that connect the anchored surface to its trigger. Focused items and controls retain a visible component-specific treatment.
- Forced colors preserve the surface boundary, arrow, focused item or control, and trigger focus with system colors.
- Reduced motion removes the short anchored-surface settling transition without changing placement, focus, or dismissal.

## Examples

### Anchored run summary

Keep short interactive or inspectable content attached to its source.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Button, Popover} from '@trwhitney/component-library';

export function RunSummaryPopover() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Popover
        closeLabel="Close run summary"
        description="Review the active run without leaving the current task."
        title="Run summary"
        trigger={<Button>Inspect run</Button>}
      >
        <p>RUN 0284 converged after 18 passes.</p>
      </Popover>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not confirm destructive work in Popover

Consequential confirmation needs AlertDialog so cancellation receives initial focus and outside presses cannot dismiss the decision.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Button, Popover} from '@trwhitney/component-library';

export function DeleteRunPopoverCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Popover
        closeLabel="Close deletion"
        description="This permanently removes RUN 0284."
        title="Delete run?"
        trigger={<Button>Delete run</Button>}
      >
        <Button>Confirm deletion</Button>
      </Popover>
    </AppearanceProvider>
  );
}
```
