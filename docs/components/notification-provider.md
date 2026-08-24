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
- NotificationProvider includes one bounded portal region, a transient-scrollbar list, a total-count marker, a queue, and one raised message with tone glyph, title, optional description, optional action, lifetime rail when timed, and dismiss Button per rendered item.

## Preferred higher-level compositions

- Place one provider around the application root or workbench and issue notifications from completed background commands without duplicating durable status history.

## Content

- title, optional description, and optional actionLabel are plain text. Keep messages concise and use at most one action for a nearby follow-up; arbitrary content and multiple recovery paths remain unsupported.

## States

- General, success, warning, and error tones combine with polite or assertive urgency. Messages may be timed or persistent, actionable or informational, inside an uncapped or card-capped scroll viewport, paused, focused, or dismissed.

## Control, events, validation, and forms

- The provider orders newest notifications first and always renders the full stack. By default, at least five ordinary messages fit before viewport overflow scrolling. maxVisible caps the scroll viewport at the measured height of one, two, or three cards while every additional card remains reachable by scrolling. The provider reports the total count. Timeouts default to 6000 milliseconds, accept 4000 through 30000 milliseconds, or stay persistent with null. Hover and focus pause timers and lifetime rails.
- notify returns a key, dismiss removes that key, and onDismiss runs after user dismissal, action dismissal, timeout, or programmatic dismissal. An optional action calls onAction and then dismisses its message.
- maxVisible is optional and accepts one, two, or three as a scroll viewport cap; it never limits the number of rendered messages. timeout must be finite between 4000 and 30000 milliseconds or null. actionLabel and onAction are required together, copy is plain text, tone is general, success, warning, or error, and placement is one of four logical viewport corners.
- NotificationProvider and its messages are not form controls and do not serialize, validate, or respond to form reset.

## Accessibility

- Each notification is a focusable non-modal alert dialog with one visible atomic status or alert message and a labeled dismiss Button. Arrival never moves focus.

## Keyboard, labeling, localization, and direction

- Notifications do not receive focus on arrival. Readers may Tab to the scrollable list, a notification, its optional action, and its dismiss Button. Escape dismisses a focused notification while hover or focus pauses its timer.
- label names the notification region and dismissLabel names every dismiss control. Each message title remains visible and supplies its non-modal dialog name.
- Supply localized labels, titles, descriptions, status copy, value labels, units, threshold labels, and completion meaning as applicable.
- Copy and logical edges follow inherited writing direction; numeric source values and consumer-provided wording are not reordered.

## Appearance and responsive behavior

- Raised notifications form one compact overlapping stack with a total-count marker. Each message has a tone rail, stable glyph and copy grid, compact dismiss control, and a draining lifetime rail when timed. The viewport-bounded list hides its scrollbar while idle.
- The region starts at its chosen logical viewport edge, defaults to top-end, caps width at 22rem, and scrolls within the available viewport height without clipping long localized copy.

## Accent, forced colors, and reduced motion

- General notifications use the application accent. Success, warning, and error notifications keep the same green, yellow, and red semantic colors used by other feedback components.
- Forced colors retain the raised boundary, leading and lifetime rails, glyph, count, copy, action, dismiss control, and focus outline with system colors.
- Reduced motion removes entry translation and the draining lifetime animation while preserving immediate appearance, count, placement, tone, timeout, and dismissal.

## Examples

### Transient background completion with an action

Confirm a background export and offer one nearby follow-up action.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Button, NotificationProvider} from '@trwhitney/component-library';

export function ExportNotification() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <NotificationProvider dismissLabel="Dismiss notification" label="Notifications">
        {({notify}) => (
          <Button onPress={() => notify({actionLabel: 'Open run history', description: 'The export is available in run history.', onAction: () => undefined, title: 'Export ready', tone: 'success'})}>
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
        {({notify}) => <Button onPress={() => notify({title: 'Solver disconnected', tone: 'error'})}>Reconnect</Button>}
      </NotificationProvider>
    </AppearanceProvider>
  );
}
```
