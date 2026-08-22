# AlertDialog

AlertDialog requires an explicit decision before a consequential action proceeds.

## Use for

- a consequential, destructive, or irreversible action requires an explicit decision before it proceeds

## Do not use for

- ordinary information, routine editing, acknowledgment-only notices, transient feedback, or any action that does not require a consequential decision

## Prefer instead

- Use Dialog for ordinary focused work, Drawer for supplemental work, InlineAlert for durable feedback, or NotificationProvider for transient confirmation after an action completes.

## Composition and parts

- Render inside AppearanceProvider so the surface, semantic threshold, text, and focus treatment share the active theme.
- Pass exactly one Button or IconButton trigger, a decision title and consequence description, localized cancel and confirm labels, an explicit actionKind, and onConfirm.
- AlertDialog includes its trigger, non-dismissible underlay, raised alertdialog surface, title, description, cancel action, and confirm action.

## Preferred higher-level compositions

- Open AlertDialog from the action that needs confirmation and report the eventual result through durable or transient feedback after it closes.

## Content

- State the action in the title, name the specific consequence in the description, and make the confirm label a direct verb phrase; do not use vague labels such as Yes.

## States

- Closed and open may be controlled or uncontrolled. actionKind is explicitly confirm or destructive and determines semantic emphasis without changing behavior.

## Control, events, validation, and forms

- AlertDialog supports controlled isOpen with onOpenChange or uncontrolled defaultOpen. A backdrop press does not dismiss it; cancel and Escape close without confirming, while confirm invokes onConfirm and then closes.
- onConfirm fires only from the confirm action. onOpenChange reports opening and every dismissal without treating dismissal as confirmation.
- TypeScript validates explicit state and variant combinations. Runtime validation requires the trigger to render exactly one library Button or IconButton; consumers validate task data and keep validation feedback inside the active overlay.
- AlertDialog is not a form and accepts no editable body. Validate consumer-owned input before opening it, or use Dialog when the decision itself requires form entry.

## Accessibility

- Opening moves focus into the overlay, focus remains contained while it is open, and closing restores focus to its trigger, including nested and sequential overlays.
- The visible title labels the dialog and the visible description is announced with it; background content is excluded from the accessibility tree while the overlay is open.

## Keyboard, labeling, localization, and direction

- Cancel receives initial focus, Tab and Shift+Tab remain inside, Escape cancels and closes, and focus returns to the trigger.
- title and description are required visible strings; cancelLabel and confirmLabel are visible action labels and must describe their outcomes.
- Supply localized title, description, trigger, dismissal, and decision labels as applicable; allow visible copy and actions to wrap without truncation.
- Copy and actions follow inherited writing direction with cancel before confirm in logical reading order.

## Appearance and responsive behavior

- AlertDialog uses the same raised surface as Dialog with a warning or danger threshold rail and a fixed cancel-then-confirm action area.
- AlertDialog stays inset from the visual viewport, wraps decision copy and actions, and scrolls within its bounded surface when necessary.

## Accent, forced colors, and reduced motion

- The application accent identifies the overlay threshold and primary ordinary action; warning and danger confirmation meaning always use their semantic colors instead.
- Forced colors preserve the modal boundary, semantic threshold, action borders, text, and focus indicators with system colors.
- Reduced motion removes underlay fades and surface settling without changing initial focus, cancellation, or confirmation.

## Examples

### Destructive confirmation

Require an explicit destructive decision while making cancellation safest.

```tsx
import '@trwhitney/component-library/styles.css';
import {AlertDialog, AppearanceProvider, Button} from '@trwhitney/component-library';

export function DeleteRunAlertDialog() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <AlertDialog
        actionKind="destructive"
        cancelLabel="Keep run"
        confirmLabel="Delete run"
        description="This permanently removes RUN 0284 and its saved results."
        onConfirm={() => {}}
        title="Delete this run?"
        trigger={<Button variant="danger">Delete run</Button>}
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not alert for ordinary content

Viewing ordinary supporting content does not require an interruptive decision; use Dialog.

```tsx
import '@trwhitney/component-library/styles.css';
import {AlertDialog, AppearanceProvider, Button} from '@trwhitney/component-library';

export function RunDetailsAlertCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <AlertDialog
        actionKind="confirm"
        cancelLabel="Cancel"
        confirmLabel="Continue"
        description="Review the solver settings for this run."
        onConfirm={() => {}}
        title="Run details"
        trigger={<Button>View details</Button>}
      />
    </AppearanceProvider>
  );
}
```
