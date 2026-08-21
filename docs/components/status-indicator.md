# StatusIndicator

StatusIndicator presents one concise semantic state with optional deliberate announcement.

## Use for

- one concise current state such as stable, solving, failed, or not started must remain visible beside the object it describes

## Do not use for

- metadata, a category tag, long explanatory feedback, numeric completion, a bounded measurement, or generic unlabeled activity

## Prefer instead

- Use Badge for static metadata, InlineAlert or AlertBanner for explanatory feedback, ProgressBar for operation completion, Meter for a bounded quantity, or Spinner for generic busy state.

## Composition and parts

- Render inside AppearanceProvider and place StatusIndicator beside the named object or inside a separately labeled region; keep its label short and complete.
- StatusIndicator owns one tone glyph and one visible text label.

## Preferred higher-level compositions

- Compose a StatusIndicator at one endpoint of a workflow header while keeping any relationship Route structurally and semantically separate.

## Content

- label names the actual state; choose success only for achieved outcomes, warning for review or in-progress work, danger for failure, and neutral when no semantic outcome applies.

## States

- Neutral, success, warning or in-progress, and danger are separate required tones; static, polite, and assertive announcement modes are separate.

## Control, events, validation, and forms

- announcement defaults to off for static status, polite creates one atomic status live region, and assertive creates one atomic alert only for an interruption requiring immediate attention.
- StatusIndicator emits no event; consumers update label and tone together from one status source.
- Consumer data determines meaning; the component validates only representable numeric domains and threshold ordering where applicable.
- This display component is not a successful form control and does not serialize, validate, or respond to form reset.

## Accessibility

- The visible label is the only announced content; tone glyphs are hidden from assistive technology and no duplicate accessible label is added.

## Keyboard, labeling, localization, and direction

- The component adds no tab stop or keyboard command; interactive recovery actions belong in adjacent action components.
- label is visible and required; do not repeat the same status in an adjacent live region or aria-label.
- Supply localized labels, titles, descriptions, status copy, value labels, units, threshold labels, and completion meaning as applicable.
- Copy and logical edges follow inherited writing direction; numeric source values and consumer-provided wording are not reordered.

## Appearance and responsive behavior

- One compact rounded indicator combines a tone-specific glyph, semantic surface, and readable label while preserving identical geometry across tones.
- The compact indicator keeps its glyph aligned while its text can wrap without horizontal overflow.

## Accent, forced colors, and reduced motion

- Application accent is not a StatusIndicator tone and must never substitute for success, warning or in-progress, danger, or neutral status meaning.
- Forced colors retain distinct glyph shapes and visible text when authored semantic colors map to system colors.
- StatusIndicator has no continuous motion; changing tone and label settles without animation under reduced motion.

## Examples

### Announced running status

Announce one meaningful transition into an active solve state.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, StatusIndicator} from '@trwhitney/component-library';

export function RunningStatus() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <StatusIndicator announcement="polite" label="Solving" tone="warning" />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not encode failure with application accent

An accent Badge communicates identity or category, not failure; use a danger StatusIndicator.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Badge, StatusIndicator} from '@trwhitney/component-library';

export function AccentFailureBadgeCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Badge tone="accent">Failed</Badge>
    </AppearanceProvider>
  );
}
```
