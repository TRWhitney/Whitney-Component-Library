# Dialog

Dialog hosts one ordinary, bounded task or focused piece of content over the current context.

## Use for

- a focused, bounded task or supporting content needs temporary attention without leaving the current context

## Do not use for

- irreversible, destructive, or otherwise consequential confirmation; persistent navigation; transient status; or a task that should have its own route

## Prefer instead

- Use AlertDialog for consequential confirmation, Drawer for a larger edge-attached supplemental task, InlineAlert for durable local feedback, or a route for deep work.

## Composition and parts

- Render inside AppearanceProvider so the surface, threshold, text, and focus treatment share the active theme and application accent.
- Pass exactly one Button or IconButton trigger, a concise title and description, body content, an accessible closeLabel, and optional actions that receive a close function.
- Keep a Dialog open while launching a nested overlay only when the nested decision is necessary to complete the parent task.
- Dialog includes its trigger, underlay, raised dialog surface, title, description, close control, optional body, and optional action area.

## Preferred higher-level compositions

- Compose Dialog with library Button actions and form fields; keep the trigger in the document position to which focus should return.

## Content

- Title the task or content directly, use the description to state context or consequence, and order actions from ordinary alternatives toward the primary action.

## States

- Closed and open are explicit. Open may be controlled or uncontrolled, and nested overlays preserve their own focus and dismissal boundaries.

## Control, events, validation, and forms

- Dialog supports controlled isOpen with onOpenChange or uncontrolled defaultOpen. Backdrop press, Escape, the close button, and an action calling close dismiss it.
- onOpenChange reports every open-state transition; action content owns its domain events and calls the provided close function only when the task should end.
- TypeScript validates explicit state and variant combinations. Runtime validation requires the trigger to render exactly one library Button or IconButton; consumers validate task data and keep validation feedback inside the active overlay.
- The overlay is not a form itself. A consumer may place a form in its body and must connect submission, validation, and reset behavior explicitly.

## Accessibility

- Opening moves focus into the overlay, focus remains contained while it is open, and closing restores focus to its trigger, including nested and sequential overlays.
- The visible title labels the dialog and the visible description is announced with it; background content is excluded from the accessibility tree while the overlay is open.

## Keyboard, labeling, localization, and direction

- Opening places focus on the close control, Tab and Shift+Tab remain inside, Escape dismisses, and focus returns to the trigger.
- title and description are required visible strings. closeLabel names the icon-only close control without repeating visible copy.
- Supply localized title, description, trigger, dismissal, and decision labels as applicable; allow visible copy and actions to wrap without truncation.
- Header, body, close control, and action order follow inherited writing direction and use logical spacing.

## Appearance and responsive behavior

- Dialog is a compact raised work surface over a dimmed canvas, marked by one continuous accent threshold rail and organized into header, scrolling body, and optional action areas.
- Dialog remains inset from the visual viewport, constrains its height, and scrolls its body without moving the header or actions.

## Accent, forced colors, and reduced motion

- The application accent identifies the overlay threshold and primary ordinary action; warning and danger confirmation meaning always use their semantic colors instead.
- Forced colors preserve the modal boundary, accent threshold, text, and close-control focus indicator with system colors.
- Reduced motion removes underlay fades and surface settling while preserving the same opening, focus, and dismissal behavior.

## Examples

### Bounded editing task

Keep a short editing task in context and close it from either action.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Button, Dialog} from '@trwhitney/component-library';

export function EditRunDialog() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Dialog
        actions={({close}) => (
          <>
            <Button onPress={close} variant="secondary">Cancel</Button>
            <Button onPress={close}>Save changes</Button>
          </>
        )}
        closeLabel="Close run editor"
        description="Update the display name used throughout this workspace."
        title="Edit run name"
        trigger={<Button>Edit run</Button>}
      >
        <p>The current run is RUN 0284.</p>
      </Dialog>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not confirm destructive work in Dialog

A permanent deletion needs AlertDialog so cancellation receives initial focus and backdrop presses cannot confirm or dismiss accidentally.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Button, Dialog} from '@trwhitney/component-library';

export function DeleteRunDialogCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Dialog
        actions={({close}) => <Button onPress={close}>Delete run</Button>}
        closeLabel="Close deletion confirmation"
        description="This permanently removes the run and its results."
        title="Delete run?"
        trigger={<Button>Delete run</Button>}
      >
        <p>RUN 0284 and all generated results will be removed.</p>
      </Dialog>
    </AppearanceProvider>
  );
}
```
