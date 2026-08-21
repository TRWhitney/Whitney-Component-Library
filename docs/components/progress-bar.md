# ProgressBar

ProgressBar reports known or unknown progress toward a described completion.

## Use for

- an operation advances toward completion and its progress is known or indeterminate

## Do not use for

- capacity, score, health, or another measurement; a compact busy state; final success or failure; or decorative animation

## Prefer instead

- Use Meter for a measured quantity, Spinner for a generic busy state, or StatusIndicator for the result.

## Composition and parts

- Render inside AppearanceProvider and place ProgressBar near the operation it reports; update isActive from the operation lifecycle, and update determinate value and valueLabel together or use the exclusive indeterminate contract.
- ProgressBar includes a label and value row, rail and fill, visible indeterminate status when needed, and a completion description for assistive technology.

## Preferred higher-level compositions

- Place ProgressBar below the action or workflow stage for the operation. Show a separate StatusIndicator when the work finishes.

## Content

- label names the current operation state, valueLabel supplies localized value and units for determinate progress, statusLabel names indeterminate state, and completionLabel defines what done means.

## States

- Determinate and indeterminate progress each support active and inactive states. Completed determinate progress stops moving but does not claim success.

## Control, events, validation, and forms

- isActive is required and controls activity motion. Determinate progress requires value and valueLabel within a finite min/max range. Indeterminate progress forbids numeric values and requires statusLabel. Both require a completion description.
- ProgressBar emits no events. The application manages the operation and cancellation.
- Consumer data determines meaning; the component validates only representable numeric domains and threshold ordering where applicable.
- This display component is not a successful form control and does not serialize, validate, or respond to form reset.

## Accessibility

- The progressbar exposes its visible label and completion description. Determinate progress also exposes min, max, current value, and value text. Indeterminate progress uses visible status text.

## Keyboard, labeling, localization, and direction

- The component adds no tab stop or keyboard command; interactive recovery actions belong in adjacent action components.
- label, valueLabel or statusLabel, and completionLabel are required visible or programmatic relationships; do not repeat them in a separate live region.
- Supply localized labels, titles, descriptions, status copy, value labels, units, threshold labels, and completion meaning as applicable.
- Copy and logical edges follow inherited writing direction; numeric source values and consumer-provided wording are not reordered.

## Appearance and responsive behavior

- A compact label row and accent rail use a fixed footprint. The sheen appears only while isActive is true and work is incomplete.
- The rail fills available space and the label row wraps long localized operation text without losing the value or overflowing compact containers.

## Accent, forced colors, and reduced motion

- The progress fill uses the application accent. Success, warning, and danger belong in a separate result status.
- Forced colors map the accent fill to system Highlight and retain a system-colored track boundary, label, value, and completion description.
- Reduced motion makes fill changes immediate and reduces active sheen to one instant pass. The current fill length does not change.

## Examples

### Determinate solve progress

Report progress with units and describe what completion means.

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

Storage usage is a measured quantity, not an operation moving toward completion.

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
