# Slider

Slider adjusts one approximate numeric value within an explicit bounded domain.

## Use for

- one bounded approximate value is adjusted and its relative position within the domain helps the user choose

## Do not use for

- the value must be entered exactly, two bounds define an interval, values are discrete named choices, or the control only displays progress

## Prefer instead

- Use NumberField for exact numeric entry, RangeSlider for a lower and upper interval, a finite choice control for named values, and ProgressBar or Meter for display-only feedback.

## Composition and parts

- Render Slider inside AppearanceProvider; provide one finite minValue, maxValue, step, locale, and optional shared number format rather than rebuilding its label, output, endpoints, track, or thumb.
- Slider owns one header, visible label, formatted output, endpoint scale, track, measured fill, thumb, hidden native range input, and stable support track.

## Preferred higher-level compositions

- Place related Slider and NumberField peers in FieldGroup or FormSection.

## Content

- Use a concise visible label and description that explains the effect of adjustment; choose formatOptions that express the unit without repeating it in every surrounding label.

## States

- Controlled, uncontrolled, horizontal, vertical, focused, dragging, read-only, disabled, and invalid states preserve the calibrated scale and formatted output.

## Control, events, validation, and forms

- Finite minValue, maxValue, and step define one reachable numeric domain; value ownership is controlled or uncontrolled, read-only preserves focus without accepting changes, and disabled removes operation.
- onChange reports each accepted stepped value; onChangeEnd reports the final value when keyboard, pointer, or touch adjustment ends.
- The component rejects non-finite, reversed, unreachable, off-step, or out-of-bounds domains and values; use isInvalid with errorMessage for externally owned domain validation.
- name and form serialize the raw numeric value through one hidden native range input; native reset restores defaultValue while visible formatting remains presentational.

## Accessibility

- Slider exposes one labeled native range input with generated description and error relationships, formatted aria-valuetext, domain bounds, orientation, invalidity, read-only state, and disabled state.

## Keyboard, labeling, localization, and direction

- Arrow keys move by step, PageUp and PageDown move by a larger domain-relative step, Home and End reach the endpoints, and horizontal arrow direction follows the locale.
- label is always visible; the current formatted output and endpoints remain visible while the generated range input receives description, error, and formatted value relationships.
- locale and formatOptions format the current value, thumb value text, and endpoints consistently; supply localized visible labels, descriptions, errors, and range thumb labels.
- Horizontal minimum and maximum positions follow inherited writing direction and ArrowLeft or ArrowRight follow locale direction; vertical values always increase from bottom to top.

## Appearance and responsive behavior

- Range controls use a calibrated instrument layout with a compact label/value header, formatted endpoints, one narrow measurement rail, and precise circular thumbs rather than a generic field box.
- Horizontal controls fill a bounded parent and retain reachable endpoint and thumb geometry at compact widths; vertical controls use a bounded instrument width and a twelve-rem minimum track height.

## Accent, forced colors, and reduced motion

- Labels, values, endpoints, and resting track content stay neutral; the measured fill, thumb structure, hover, and focus use bounded accent roles, while invalid state remains independently dangerous.
- Forced-color mode maps the track, measured fill, thumbs, focus, and invalid structure to system colors while preserving their boundaries and positions.
- Direct thumb position never animates; reduced motion also removes the remaining thumb hover and focus transitions without removing value or focus structure.

## Examples

### Set a confidence threshold

Adjust one approximate threshold while retaining its percentage context.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Slider} from '@trwhitney/component-library';

export function ConfidenceThreshold() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Slider defaultValue={0.4} formatOptions={{style: 'percent'}} label="Confidence" locale="en-US" minValue={0} maxValue={1} step={0.05} />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not use approximate adjustment for exact entry

A precise engineering tolerance needs direct numeric entry and editing.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Slider} from '@trwhitney/component-library';

export function ExactToleranceCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Slider label="Tolerance" locale="en-US" minValue={0} maxValue={1} step={0.001} />
    </AppearanceProvider>
  );
}
```
