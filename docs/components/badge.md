# Badge

Badge presents short static metadata or category context beside a named object.

## Use for

- short static metadata, category, identifier, count, or current-context text should sit next to a named object

## Do not use for

- changing status, live announcements, long prose, interactive filtering, dismissible chips, or operation progress

## Prefer instead

- Use StatusIndicator for state, ToggleButton or later filter controls for interaction, and InlineAlert for explanatory feedback.

## Composition and parts

- Render inside AppearanceProvider and place Badge inline with the object it qualifies; content may be text or a concise text-bearing React node.
- Badge includes one compact bordered text capsule.

## Preferred higher-level compositions

- Compose Badge beside a heading, record name, or run identifier rather than as a standalone unlabeled token.

## Content

- Keep content brief and self-explanatory. Accent may emphasize identity or current context, but it never replaces a status tone.

## States

- Neutral is the default. Accent, success, warning, and danger change only the visual treatment and never create live behavior.

## Control, events, validation, and forms

- Badge is static and has no announcement, selection, or dismissal behavior.
- Badge emits no events and does not infer changes from its children.
- Consumer data determines meaning; the component validates only representable numeric domains and threshold ordering where applicable.
- This display component is not a successful form control and does not serialize, validate, or respond to form reset.

## Accessibility

- Badge exposes its visible content as text. It creates no live region or duplicate accessible label.

## Keyboard, labeling, localization, and direction

- The component adds no tab stop or keyboard command; interactive recovery actions belong in adjacent action components.
- Badge content must be readable text and cannot rely on color alone for its meaning.
- Supply localized labels, titles, descriptions, status copy, value labels, units, threshold labels, and completion meaning as applicable.
- Copy and logical edges follow inherited writing direction; numeric source values and consumer-provided wording are not reordered.

## Appearance and responsive behavior

- A compact capsule uses a persistent border so neutral, accent, and status tones remain legible in light or dark mode.
- Badge wraps its content rather than clipping or forcing a containing row beyond compact bounds.

## Accent, forced colors, and reduced motion

- Use the accent Badge for identity, current context, or category emphasis. Status Badge tones use their own green, yellow, and red colors.
- Forced colors keep the capsule border and text. Accent identity maps to system highlight colors without becoming status.
- Badge has no motion or transient state.

## Examples

### Accent identity metadata

Emphasize a current run identifier without implying success or failure.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Badge} from '@trwhitney/component-library';

export function RunIdentifierBadge() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Badge tone="accent">RUN 0284</Badge>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not use Badge as live status

A changing operation state needs StatusIndicator and its optional announcements.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Badge} from '@trwhitney/component-library';

export function LiveBadgeCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Badge tone="warning">Solving</Badge>
    </AppearanceProvider>
  );
}
```
