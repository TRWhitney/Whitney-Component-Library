# TimeField

TimeField collects one zone-free wall-clock time through localized segmented entry.

## Use for

- a user enters a wall-clock time that does not identify an instant

## Do not use for

- a date, duration, countdown, combined date-time, or time-zone-aware instant

## Prefer instead

- Use DateField for a civil day, NumberField for a duration, and a future zoned date-time control for an instant.

## Composition and parts

- Render TimeField inside AppearanceProvider and keep time-zone meaning outside it.
- TimeField includes a label, segmented time input, hidden form input, and support area.

## Preferred higher-level compositions

- Place related schedule fields in FieldGroup or FormSection.

## Content

- State the operational context when the wall-clock time could otherwise be ambiguous.

## States

- Empty, controlled, uncontrolled, invalid, required, read-only, and disabled states.

## Control, events, validation, and forms

- Controlled or uncontrolled zone-free times may be empty. hourCycle and granularity define the format, and values cannot contain more precision than the visible segments.
- onChange reports a complete value in the library's wall-clock format or null.
- minValue, maxValue, required state, visible precision, custom validate, and external invalidity share the support track.
- name and form serialize a complete value as HH:mm:ss; native reset restores defaultValue and a named empty field contributes an empty string.

## Accessibility

- TimeField exposes one visible label and separate focus targets for the hour, minute, second, and day period required by its format.

## Keyboard, labeling, localization, and direction

- Arrow keys adjust the focused segment, typing replaces it, and 12-hour formats expose a day-period segment.
- label is always visible and support relationships apply to every time segment.
- locale, hourCycle, and granularity are required initial-render inputs; provide localized labels, support text, and errors.
- Locale determines segment order, numerals, calendar grid direction, and logical previous or next navigation without changing value identity or DOM reading order.

## Appearance and responsive behavior

- Segmented controls use the compact field layout and a fixed support area. Pickers add a raised calendar with weekday labels, a continuous range fill, and selected-day or endpoint rails that match selected actions.
- Fields fill their parent. Segments remain operable on narrow screens, and the single-month calendar stays inside the viewport.

## Accent, forced colors, and reduced motion

- Editable content and calendar text stay neutral. Focus, today, the selected range, and its endpoints use accent colors. Invalid fields retain their danger boundary and thicken it on enabled hover.
- Forced colors use system colors for fields, segment focus, calendar borders, unavailable dates, today, selected ranges, and endpoints.
- Reduced motion removes the short popover transition; segment edits and month changes never use positional animation.

## Examples

### Enter a daily time

Collect a recurring local wall-clock time with visible minute precision.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, TimeField} from '@trwhitney/component-library';

export function DailyReviewTime() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <TimeField defaultValue={{hour: 14, minute: 30, second: 0}} granularity="minute" hourCycle={24} label="Daily review" locale="en-US" name="review-time" />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not represent an instant as a wall-clock time

A global deployment instant needs a date, time zone, and disambiguation contract.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, TimeField} from '@trwhitney/component-library';

export function DeploymentInstantCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <TimeField granularity="minute" hourCycle={24} label="Deploy at" locale="en-US" />
    </AppearanceProvider>
  );
}
```
