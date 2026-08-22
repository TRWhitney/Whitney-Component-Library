# NotificationProvider

NotificationProvider queues and presents brief dismissible application notifications.

## Use for

- a background event or completed action needs brief transient confirmation without interrupting the current task

## Do not use for

- the only path to recover or inspect important information, a persistent condition, field feedback, page-wide interruption, confirmation requiring a decision, or arbitrary interactive content

## Prefer instead

- Use InlineAlert for durable local feedback, AlertBanner for a broad condition, StatusIndicator for a concise state, or a dialog when the reader must decide or recover.

## Composition and parts

- Render one NotificationProvider inside AppearanceProvider. Its render child receives notify and dismiss controls while the provider owns a portal-backed notification region.
- NotificationProvider includes one bounded portal region, a queue, and one raised notification with tone glyph, title, optional description, and dismiss Button per visible item.

## Preferred higher-level compositions

- Place one provider around an application shell or workbench and issue notifications from completed background commands without duplicating durable status history.

## Content

- title and optional description are plain text. Keep messages concise and informational; notification copy cannot contain links, buttons, or another recovery path.

## States

- Neutral, success, warning, and danger tones combine with polite or assertive urgency. Messages may be timed or persistent, visible or queued, paused, focused, or dismissed.

## Control, events, validation, and forms

- The provider queues newest notifications first, shows one to three at once, and reveals older queued messages after dismissal. Timeouts default to 6000 milliseconds, accept 4000 through 30000 milliseconds, or stay persistent with null. Hover and focus pause visible timers.
- notify returns a key, dismiss removes that key, and onDismiss runs after user dismissal, timeout, or programmatic dismissal.
- maxVisible accepts one, two, or three. timeout must be finite between 4000 and 30000 milliseconds or null. Copy is plain text, and placement is one of four logical viewport corners.
- NotificationProvider and its messages are not form controls and do not serialize, validate, or respond to form reset.

## Accessibility

- Each notification is a focusable non-modal alert dialog with one visible atomic status or alert message and a labeled dismiss Button. Arrival never moves focus.

## Keyboard, labeling, localization, and direction

- Notifications do not receive focus on arrival. Readers may Tab to a notification and its dismiss Button; Escape dismisses a focused notification while hover or focus pauses its timer.
- label names the notification region and dismissLabel names every dismiss control. Each message title remains visible and supplies its non-modal dialog name.
- Supply localized labels, titles, descriptions, status copy, value labels, units, threshold labels, and completion meaning as applicable.
- Copy and logical edges follow inherited writing direction; numeric source values and consumer-provided wording are not reordered.

## Appearance and responsive behavior

- Raised notifications use one semantic leading rail, a stable glyph and copy grid, and a compact dismiss control. One short entry settles into a bounded viewport corner.
- The region stays within its chosen logical corner, caps width at 22rem, and uses the compact viewport inset without clipping long localized copy.

## Accent, forced colors, and reduced motion

- Notifications use neutral, success, warning, or danger meaning. Application accent appears only in keyboard focus and never replaces semantic tone.
- Forced colors retain the raised boundary, leading rail, glyph, copy, dismiss control, and focus outline with system colors.
- Reduced motion removes entry translation and preserves immediate appearance, placement, tone, and dismissal.

## Examples

### Transient background completion

Confirm a background export without interrupting the current control.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Button, NotificationProvider} from '@trwhitney/component-library';

export function ExportNotification() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <NotificationProvider dismissLabel="Dismiss notification" label="Notifications" maxVisible={3}>
        {({notify}) => (
          <Button onPress={() => notify({description: 'The export is available in run history.', title: 'Export ready', tone: 'success'})}>
            Export run
          </Button>
        )}
      </NotificationProvider>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not make recovery transient

A condition that blocks work needs a durable AlertBanner or dialog with an explicit recovery action.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Button, NotificationProvider} from '@trwhitney/component-library';

export function ReconnectNotificationCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <NotificationProvider dismissLabel="Dismiss" label="Notifications">
        {({notify}) => <Button onPress={() => notify({title: 'Solver disconnected', tone: 'danger'})}>Reconnect</Button>}
      </NotificationProvider>
    </AppearanceProvider>
  );
}
```
