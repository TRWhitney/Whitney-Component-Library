# Slider

Slider adjusts an approximate numeric value within a finite range.

## Use for

- one approximate value is adjusted and its position within a finite range helps the user choose

## Do not use for

- the value must be entered exactly, two bounds define an interval, values are discrete named choices, or the control only displays progress

## Prefer instead

- Use NumberField for exact numeric entry, RangeSlider for a lower and upper interval, a finite choice control for named values, and ProgressBar or Meter for display-only feedback.

## Composition and parts

- Render Slider inside AppearanceProvider; provide one finite minValue, maxValue, step, locale, and optional shared number format rather than rebuilding its label, output, endpoints, track, or thumb.
- Slider includes a header, visible label, formatted output, endpoint scale, track, measured fill, thumb, hidden native range input, and fixed support area.

## Preferred higher-level compositions

- Place related Slider and NumberField peers in FieldGroup or FormSection.

## Content

- Use a concise visible label and description that explains the effect of adjustment; choose formatOptions that express the unit without repeating it in every surrounding label.

## States

- Controlled, uncontrolled, horizontal, vertical, focused, dragging, read-only, disabled, and invalid states keep the same scale and formatted output.

## Control, events, validation, and forms

- Finite minValue, maxValue, and step define the numeric range. The value may be controlled or uncontrolled. Read-only keeps focus but rejects changes, while disabled prevents operation.
- onChange reports each accepted stepped value; onChangeEnd reports the final value when keyboard, pointer, or touch adjustment ends.
- The component rejects non-finite, reversed, unreachable, off-step, or out-of-bounds ranges and values. Use isInvalid with errorMessage for validation handled by the application.
- name and form serialize the raw numeric value through one hidden native range input; native reset restores defaultValue while visible formatting remains presentational.

## Accessibility

- Slider exposes one labeled native range input with generated description and error relationships, formatted aria-valuetext, domain bounds, orientation, invalidity, read-only state, and disabled state.

## Keyboard, labeling, localization, and direction

- Arrow keys move by step, PageUp and PageDown move by a larger domain-relative step, Home and End reach the endpoints, and horizontal arrow direction follows the locale.
- label is always visible; the current formatted output and endpoints remain visible while the generated range input receives description, error, and formatted value relationships.
- locale and formatOptions format the current value, thumb value text, and endpoints consistently; supply localized visible labels, descriptions, errors, and range thumb labels.
- Horizontal minimum and maximum positions follow inherited writing direction and ArrowLeft or ArrowRight follow locale direction; vertical values always increase from bottom to top.

## Appearance and responsive behavior

- Range controls use a compact label and value header, formatted endpoints, a narrow track, and circular thumbs instead of a field box.
- Horizontal controls fill their parent and keep endpoints and thumbs operable on narrow screens. Vertical controls use a preset width and a twelve-rem minimum track height.

## Accent, forced colors, and reduced motion

- Labels, values, endpoints, and the empty track stay neutral. The measured fill, thumbs, and focus use accent colors. Interactive thumb hover adds dilation without changing color. Invalid state uses danger colors.
- Forced-color mode maps the track, measured fill, thumbs, focus, and invalid state to system colors without moving them.
- Direct thumb position never animates; reduced motion also removes the remaining thumb hover and focus transitions without removing value or focus structure.

## Examples

### Set a confidence threshold

Adjust an approximate threshold and display it as a percentage.

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
