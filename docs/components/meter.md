# Meter

Meter presents one current quantity within a known range and names meaningful thresholds.

## Use for

- a current quantity, utilization, score, or level must be interpreted within a known range with finite bounds

## Do not use for

- operation completion, unknown progress, generic busy state, an adjustable value, or a threshold with no explained meaning

## Prefer instead

- Use ProgressBar for completion over time, Slider for adjustable approximate input, NumberField for exact input, or StatusIndicator for one categorical state.

## Composition and parts

- Render inside AppearanceProvider and provide one current value and unit-bearing valueLabel; add ordered thresholds only when each boundary has a real named interpretation.
- Meter owns one label/value row, semantic rail and fill, optional fixed threshold marks, and their visually hidden semantic list.

## Preferred higher-level compositions

- Compose beside a description of the measured system and any separately authored action that can change it.

## Content

- label names the quantity, valueLabel includes localized value and unit, and every threshold supplies an ordered numeric value, unit-bearing valueLabel, semantic tone, and plain-language meaning.

## States

- Neutral, success, warning, and danger describe the current measurement; thresholds are descriptive boundaries rather than automatic state logic.

## Control, events, validation, and forms

- Meter requires finite minValue below maxValue and a current value inside the domain; thresholds must be unique, strictly ascending, and inside the range.
- Meter emits no events and is not an adjustable control.
- Consumer data determines meaning; the component validates only representable numeric domains and threshold ordering where applicable.
- This display component is not a successful form control and does not serialize, validate, or respond to form reset.

## Accessibility

- The owned meter exposes its visible label, finite min, max, current value, localized value text, and a programmatic list of every named threshold.

## Keyboard, labeling, localization, and direction

- The component adds no tab stop or keyboard command; interactive recovery actions belong in adjacent action components.
- label and valueLabel are required; each threshold label and valueLabel is connected to the meter as one programmatic description list.
- Supply localized labels, titles, descriptions, status copy, value labels, units, threshold labels, and completion meaning as applicable.
- Copy and logical edges follow inherited writing direction; numeric source values and consumer-provided wording are not reordered.

## Appearance and responsive behavior

- A calibrated semantic fill and fixed threshold marks share the progress family rail geometry while avoiding activity sheen or completion motion.
- The calibrated rail fills available width and the label/value row wraps without clipping threshold meaning at compact sizes.

## Accent, forced colors, and reduced motion

- Meter excludes application accent from semantic tone; neutral, success, warning, and danger describe the measured quantity independently.
- Forced colors retain the bounded system-color rail, fill, threshold marks, and all textual values even when authored semantic hues collapse.
- Meter has no activity animation or value-transition motion.

## Examples

### Thresholded thermal load

Interpret one bounded quantity through named, unit-bearing thresholds.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Meter} from '@trwhitney/component-library';

export function ThermalLoadMeter() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Meter label="Thermal load" maxValue={100} minValue={0} thresholds={[{label: 'Review begins', tone: 'warning', value: 70, valueLabel: '70 kilowatts'}, {label: 'Unsafe begins', tone: 'danger', value: 90, valueLabel: '90 kilowatts'}]} tone="warning" value={76} valueLabel="76 kilowatts" />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not use Meter for completion

A solve advancing toward done is operation progress, not a measured level.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Meter} from '@trwhitney/component-library';

export function SolveMeterCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Meter label="Boundary solve" maxValue={25} minValue={0} value={18} valueLabel="18 of 25 passes" />
    </AppearanceProvider>
  );
}
```
