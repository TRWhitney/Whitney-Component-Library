# DateField

DateField collects one known civil date through localized segmented entry.

## Use for

- a user knows a calendar date and direct segmented entry is fastest

## Do not use for

- calendar comparison, nearby availability, a date interval, or an instant

## Prefer instead

- Use DatePicker when calendar context helps, DateRangePicker for an inclusive interval, and a future zoned date-time control for an instant.

## Composition and parts

- Render DateField inside AppearanceProvider and let it own every date segment.
- DateField includes a label, segmented date input, hidden form input, and support area.

## Preferred higher-level compositions

- Place related fields in FieldGroup and workflows in FormSection.

## Content

- Use a concise persistent label and explain accepted bounds or unavailable dates in durable support copy.

## States

- Empty, controlled, uncontrolled, invalid, required, read-only, and disabled states.

## Control, events, validation, and forms

- Controlled or uncontrolled ISO dates may be empty. Keyboard, pointer, and touch edits stay synchronized and keep the chosen display calendar.
- onChange reports a complete value in the library's ISO calendar-date format or null.
- minValue, maxValue, unavailable dates, required state, custom validate, and application errors share the fixed error area.
- name and form serialize a complete value as YYYY-MM-DD; native reset restores defaultValue and a named empty field contributes an empty string.

## Accessibility

- DateField exposes one visible label and separately focusable localized spinbutton segments with shared description, error, required, invalid, read-only, and disabled relationships.

## Keyboard, labeling, localization, and direction

- Tab enters and leaves the compound field, Arrow keys adjust the focused segment, typing replaces it, and locale controls segment order.
- label is always visible and generated relationships apply to every editable segment.
- locale and calendar are required initial-render inputs; provide localized labels, support text, and errors.
- Locale determines segment order, numerals, calendar grid direction, and logical previous or next navigation without changing value identity or DOM reading order.

## Appearance and responsive behavior

- Segmented controls use the compact field layout and a fixed support area. Pickers add a raised calendar with weekday labels, a continuous range fill, and selected-day or endpoint rails that match selected actions.
- Fields fill their parent. Segments remain operable on narrow screens, and the single-month calendar stays inside the viewport.

## Accent, forced colors, and reduced motion

- Editable content and calendar text stay neutral. Focus, today, the selected range, and its endpoints use accent colors. Invalid state uses danger colors.
- Forced colors use system colors for fields, segment focus, calendar borders, unavailable dates, today, selected ranges, and endpoints.
- Reduced motion removes the short popover transition; segment edits and month changes never use positional animation.

## Examples

### Enter a known date

Collect a known civil date without adding calendar interaction.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, DateField} from '@trwhitney/component-library';

export function RunDateField() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <DateField calendar="gregory" defaultValue={{year: 2026, month: 8, day: 20}} label="Run date" locale="en-US" name="run-date" />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not hide useful availability context

Nearby availability is spatial calendar information that direct entry hides.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, DateField} from '@trwhitney/component-library';

export function AvailabilityDateCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <DateField calendar="gregory" label="Available appointment" locale="en-US" />
    </AppearanceProvider>
  );
}
```
