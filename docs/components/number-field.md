# NumberField

NumberField collects a locale-aware numeric value with bounds and stepping.

## Use for

- a user enters a numeric value that needs locale formatting, stepping, bounds, units, currency, or percentages

## Do not use for

- the value is an identifier, free text, phone number, postal code, or other digit-shaped text without arithmetic meaning

## Prefer instead

- Use TextField for digit-shaped identifiers and Slider only when approximate visual adjustment matters more than exact entry.

## Composition and parts

- Render NumberField inside AppearanceProvider and set locale explicitly to the server and application locale.
- NumberField owns a label, decrement command, localized text input, increment command, raw form value, and stable support track.

## Preferred higher-level compositions

- Place adjacent numeric peers in FieldGroup so their equal control dimensions remain visible across validation states.

## Content

- Use formatOptions for numeric presentation and a description for units or constraints that are not already visible in the formatted value.

## States

- Controlled, uncontrolled, required, invalid, read-only, disabled, pending, empty, and partial text states preserve numeric ownership.

## Control, events, validation, and forms

- NumberField privately owns localized parsing and incomplete text; plain decimal formatting retains supplied finite value and step precision unless formatOptions overrides it, and onChange reports committed numbers after blur, Enter, or stepping.
- onChange reports a committed number, including NaN for an empty commit; it is not a per-keystroke text callback.
- commitBehavior chooses snapping or retained range and step invalidity; validationBehavior independently chooses native blocking or ARIA reporting.
- name serializes one raw number through a hidden control; form also associates the visible input so external reset restores defaultValue.

## Accessibility

- NumberField exposes a localized text input with number-field role description and labeled decrement and increment commands.

## Keyboard, labeling, localization, and direction

- Arrow Up and Down step, Home and End reach bounds, Enter commits, and localized text editing remains available; focused wheel stepping is opt-in.
- label is required; step commands combine localized increase or decrease text with the field label.
- Supply visible labels, descriptions, errors, pending messages, and explicit command labels in the application locale, and allow them to wrap.
- Logical padding, group placement, icons, and step controls follow the inherited writing direction without changing DOM reading order.

## Appearance and responsive behavior

- The field family uses compact rounded controls, one consistent single-line control height, neutral surfaces, and a reserved support track beneath each control.
- Fields fill their bounded parent width; support text grows below without moving or resizing the control, and responsive groups collapse through content-owned minimums.

## Accent, forced colors, and reduced motion

- Resting field content stays neutral; hover and focus use saturated same-hue accent structure, while invalid and pending states retain independent danger and warning colors.
- Forced-color mode maps field surfaces, boundaries, focus, invalid state, and pending state to system colors without suppressing native control behavior.
- Reduced motion stops the pending rail and removes field transitions while retaining a static warning rail and every state boundary.

## Examples

### Set a bounded tolerance

Keep formatted text private while exposing a committed numeric value.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, NumberField} from '@trwhitney/component-library';

export function ToleranceNumberExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <NumberField label="Tolerance" locale="en-US" defaultValue={0.0025} minValue={0} step={0.0005} />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not model numeric values as text

Plain text does not own numeric parsing, localized display, bounds, or stepping.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, NumberField, TextField} from '@trwhitney/component-library';

export function NumericTextCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <TextField label="Tolerance" />
    </AppearanceProvider>
  );
}
```
