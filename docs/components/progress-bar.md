# ProgressBar

ProgressBar reports known or unknown advancement toward an explicitly described completion.

## Use for

- an operation advances toward completion over time and is either numerically known or explicitly indeterminate

## Do not use for

- capacity, score, health, or another bounded measurement; generic compact busy state; final success or failure; or decorative animation

## Prefer instead

- Use Meter for a bounded quantity, Spinner for generic busy state, or StatusIndicator for a resulting semantic state.

## Composition and parts

- Render inside AppearanceProvider and place ProgressBar near the operation it reports; update isActive from the operation lifecycle, and update determinate value and valueLabel together or use the exclusive indeterminate contract.
- ProgressBar owns one label/value row, progressbar rail and fill, visible indeterminate status when applicable, and programmatic completion description.

## Preferred higher-level compositions

- Compose beneath the action or workflow stage that owns the operation, followed by one separate StatusIndicator when work settles.

## Content

- label names the current operation state, valueLabel supplies localized value and units for determinate progress, statusLabel names indeterminate state, and completionLabel defines what done means.

## States

- Determinate and indeterminate progress each support explicit active and inactive operation states; completed determinate progress remains still and does not itself claim semantic success.

## Control, events, validation, and forms

- isActive is required and controls activity motion independently; determinate progress requires value and valueLabel within a finite min/max domain, while indeterminate progress forbids numeric values and requires statusLabel, and both require explicit completion meaning.
- ProgressBar emits no events; operation ownership and cancellation remain external.
- Consumer data determines meaning; the component validates only representable numeric domains and threshold ordering where applicable.
- This display component is not a successful form control and does not serialize, validate, or respond to form reset.

## Accessibility

- The owned progressbar exposes its visible label, determinate min, max, current value and value text, or an indeterminate state described by visible status copy, plus completion meaning.

## Keyboard, labeling, localization, and direction

- The component adds no tab stop or keyboard command; interactive recovery actions belong in adjacent action components.
- label, valueLabel or statusLabel, and completionLabel are required visible or programmatic relationships; do not repeat them in a separate live region.
- Supply localized labels, titles, descriptions, status copy, value labels, units, threshold labels, and completion meaning as applicable.
- Copy and logical edges follow inherited writing direction; numeric source values and consumer-provided wording are not reordered.

## Appearance and responsive behavior

- A compact label row and bounded accent rail preserve one stable footprint; sheen appears only while isActive is true and work is incomplete.
- The rail fills available space and the label row wraps long localized operation text without losing the value or overflowing compact containers.

## Accent, forced colors, and reduced motion

- The progress fill uses application accent as active structure; success, warning, and danger remain outside ProgressBar and belong in a separate resulting status.
- Forced colors map the accent fill to system Highlight and retain a system-colored track boundary, label, value, and completion description.
- Reduced motion settles fill transitions and active route sheen to one effectively instantaneous iteration while preserving the current rail length.

## Examples

### Determinate solve progress

Report known completion with explicit units and completion semantics.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, ProgressBar} from '@trwhitney/component-library';

export function BoundaryProgress() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <ProgressBar completionLabel="Complete when all 25 boundary passes are solved." isActive label="Solving boundary passes" maxValue={25} minValue={0} value={18} valueLabel="18 of 25 passes" />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not use progress for measurement

Storage utilization is a bounded quantity, not an operation moving to completion.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, ProgressBar} from '@trwhitney/component-library';

export function UtilizationProgressCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <ProgressBar completionLabel="The licensed capacity is full." isActive={false} label="Storage used" value={72} valueLabel="72 percent" />
    </AppearanceProvider>
  );
}
```
