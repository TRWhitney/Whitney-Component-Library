# AlertBanner

AlertBanner explains a condition that affects a page or workspace.

## Use for

- a condition has broad page, workspace, application, or account scope and must be seen before local content

## Do not use for

- one field or panel, concise state, metadata, progress, marketing promotion, or content without a real broad condition

## Prefer instead

- Use InlineAlert for local scope, StatusIndicator for terse state, or NotificationProvider for transient background completion.

## Composition and parts

- Render inside AppearanceProvider and place AlertBanner at the start of the region its condition affects; do not nest it inside an unrelated local card.
- AlertBanner includes one full-width border, icon, visible title, and optional description.

## Preferred higher-level compositions

- Compose at the beginning of an application shell, workspace, or page content region before the affected controls.

## Content

- title states what happened and optional content explains consequence or recovery in specific plain language; tone must agree with that wording.

## States

- Neutral, success, warning, and danger share one layout. Announcements may be off, polite, or assertive.

## Control, events, validation, and forms

- announcement supports off, polite, and assertive; off is the default, polite reports non-urgent changes, and assertive is reserved for an immediate interruption.
- The alert emits no events and has no dismissal control. The application updates or removes it and places any recovery Button outside the message.
- Consumer data determines meaning; the component validates only representable numeric domains and threshold ordering where applicable.
- This display component is not a successful form control and does not serialize, validate, or respond to form reset.

## Accessibility

- A static alert is a note; polite and assertive modes turn the same visible title and description into one atomic live region without hidden duplicate copy.

## Keyboard, labeling, localization, and direction

- The component adds no tab stop or keyboard command; interactive recovery actions belong in adjacent action components.
- title is required and visible. The description belongs to the same note or live region, so it needs no duplicate aria-label.
- Supply localized labels, titles, descriptions, status copy, value labels, units, threshold labels, and completion meaning as applicable.
- Copy and logical edges follow inherited writing direction; numeric source values and consumer-provided wording are not reordered.

## Appearance and responsive behavior

- AlertBanner spans its container with a rounded background, fixed icon column, status color, title, and optional description.
- The banner fills the available width and wraps text while keeping its icon column.

## Accent, forced colors, and reduced motion

- Alerts never accept application accent as severity; neutral, success, warning, and danger retain independent meaning.
- Forced colors use system colors for the border, leading edge, status icon, title, and description.
- Alert tone changes use no layout or continuous motion and settle immediately under reduced motion.

## Examples

### Assertive broad interruption

Announce an immediate page-wide interruption once through visible copy.

```tsx
import '@trwhitney/component-library/styles.css';
import {AlertBanner, AppearanceProvider} from '@trwhitney/component-library';

export function SolverOutageBanner() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <AlertBanner announcement="assertive" title="Solver disconnected" tone="danger">Reconnect the solver before starting or resuming runs.</AlertBanner>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not overstate local feedback

Keep a field-group condition local with InlineAlert.

```tsx
import '@trwhitney/component-library/styles.css';
import {AlertBanner, AppearanceProvider} from '@trwhitney/component-library';

export function FieldBannerCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <AlertBanner title="Tolerance needs review" tone="warning">Use 0.001–0.1 K.</AlertBanner>
    </AppearanceProvider>
  );
}
```
