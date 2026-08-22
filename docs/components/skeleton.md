# Skeleton

Skeleton reserves the approximate shape of content while its region loads.

## Use for

- a content region is loading and preserving its approximate eventual geometry prevents disruptive layout movement

## Do not use for

- an unknown loading shape, operation progress, a generic busy label, empty content, unavailable content, or decorative striping

## Prefer instead

- Use Spinner for a brief labeled wait, ProgressBar for an operation with completion meaning, or EmptyState after loading completes without content.

## Composition and parts

- Render inside AppearanceProvider and arrange one or more Skeleton instances with the same public layout components that will contain the loaded content.
- Skeleton includes one shaped block or a bounded sequence of text rails.

## Preferred higher-level compositions

- Compose several Skeleton instances inside Stack, InlineGroup, ResponsiveGrid, or Surface to approximate the loaded region without recreating its private content.

## Content

- Choose the shape and bounded width that most closely matches the expected content. Do not use skeleton rails as decoration or as a substitute for a loading label.

## States

- Text, heading, control, and media are separate approximate shapes. Width and text line count are finite choices.

## Control, events, validation, and forms

- Skeleton is visual only. Text accepts one to five lines; heading, control, and media each reserve one shaped block.
- Skeleton emits no event and does not infer when loading begins or ends.
- shape, width, and text line count are finite TypeScript choices. Non-text shapes do not accept a line count.
- This display component is not a successful form control and does not serialize, validate, or respond to form reset.

## Accessibility

- The complete placeholder is hidden from assistive technology. The surrounding region must expose its own loading state and accessible label when a reader needs progress context.

## Keyboard, labeling, localization, and direction

- The component adds no tab stop or keyboard command; interactive recovery actions belong in adjacent action components.
- Skeleton accepts no label because it is hidden. Name the loading region or use Spinner or ProgressBar when the operation itself must be announced.
- Supply localized labels, titles, descriptions, status copy, value labels, units, threshold labels, and completion meaning as applicable.
- Copy and logical edges follow inherited writing direction; numeric source values and consumer-provided wording are not reordered.

## Appearance and responsive behavior

- Text, heading, control, and media shapes use calibrated neutral rails. Text may reserve one to five lines, and the last line shortens to avoid looking like finished copy.
- Full, three-quarter, and half widths remain relative to the containing region. Media keeps a bounded aspect ratio without horizontal overflow.

## Accent, forced colors, and reduced motion

- Skeleton uses neutral surface and boundary colors. Application accent and semantic status colors do not decorate unfinished content.
- Forced colors retain each placeholder boundary with system colors and remove the moving tonal gradient.
- Reduced motion removes the route sweep and keeps the same neutral placeholder geometry.

## Examples

### Structured result loading

Reserve a short result summary while its named region is busy.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Skeleton} from '@trwhitney/component-library';

export function ResultSummarySkeleton() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <div aria-busy="true" aria-label="Loading result summary">
        <Skeleton lines={3} shape="text" width="three-quarters" />
      </div>
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not invent a content shape

A generic wait with no known eventual layout needs a labeled Spinner or ProgressBar.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Skeleton} from '@trwhitney/component-library';

export function UnknownWaitSkeletonCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Skeleton shape="control" />
    </AppearanceProvider>
  );
}
```
