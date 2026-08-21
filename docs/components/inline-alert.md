# InlineAlert

InlineAlert explains feedback for one nearby region.

## Use for

- feedback applies to one nearby field group, panel, action, or local content region and needs explanatory copy

## Do not use for

- page-wide outages, a short state label, static metadata, progress, temporary toast messages, or content that needs dismissal

## Prefer instead

- Use AlertBanner for broad scope, StatusIndicator for concise state, Badge for metadata, or a later toast for transient notification.

## Composition and parts

- Render inside AppearanceProvider and place InlineAlert directly after the local region it explains; keep recovery actions adjacent rather than embedding arbitrary controls in the message.
- InlineAlert includes one icon, visible title, and optional visible description.

## Preferred higher-level compositions

- Compose beneath a FieldGroup, FormSection, Surface, or local action cluster whose scope is already evident.

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

- InlineAlert is a compact rounded treatment with a constant icon column, boundary, leading edge, title, and optional description across every tone.
- The fixed glyph column and flexible copy column wrap long localized content without changing tone geometry or causing horizontal overflow.

## Accent, forced colors, and reduced motion

- Alerts never accept application accent as severity; neutral, success, warning, and danger retain independent meaning.
- Forced colors use system colors for the border, leading edge, status icon, title, and description.
- Alert tone changes use no layout or continuous motion and settle immediately under reduced motion.

## Examples

### Static local warning

Explain one local review condition without interrupting assistive technology.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, InlineAlert} from '@trwhitney/component-library';

export function BoundaryReviewAlert() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <InlineAlert title="Boundary review" tone="warning">Check the north wall coefficient before running.</InlineAlert>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not understate broad conditions

A condition affecting the whole page needs AlertBanner scope and prominence.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, InlineAlert} from '@trwhitney/component-library';

export function PageOutageInlineCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <InlineAlert title="Solver unavailable" tone="danger">All runs are paused.</InlineAlert>
    </AppearanceProvider>
  );
}
```
