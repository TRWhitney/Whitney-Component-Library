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
- DateField owns a label, segmented date input, hidden form input, and support track.

## Preferred higher-level compositions

- Place related fields in FieldGroup and workflows in FormSection.

## Content

- Use a concise persistent label and explain accepted bounds or unavailable dates in durable support copy.

## States

- Empty, controlled, uncontrolled, invalid, required, read-only, and disabled states.

## Control, events, validation, and forms

- Controlled or uncontrolled ISO calendar dates may be empty; keyboard, pointer, and touch segment edits remain synchronized and preserve the chosen display calendar.
- onChange reports a complete library-owned ISO calendar date or null.
- minValue, maxValue, unavailable dates, required state, custom validate, and external invalidity share the stable error track.
- name and form serialize a complete value as YYYY-MM-DD; native reset restores defaultValue and a named empty field contributes an empty string.

## Accessibility

- DateField exposes one visible label and separately focusable localized spinbutton segments with shared description, error, required, invalid, read-only, and disabled relationships.

## Keyboard, labeling, localization, and direction

- Tab enters and leaves the compound field, Arrow keys adjust the focused segment, typing replaces it, and locale controls segment order.
- label is always visible and generated relationships apply to every editable segment.
- locale and calendar are required initial-render inputs; provide localized labels, support text, and errors.
- Locale determines segment order, numerals, calendar grid direction, and logical previous or next navigation without changing value identity or DOM reading order.

## Appearance and responsive behavior

- Segmented controls retain the compact field geometry and stable support track; pickers add one raised almanac sheet with utility weekday text and a continuous range route.
- Fields fill a bounded parent, segments retain operable targets at compact widths, and the single-month calendar sheet remains viewport-contained.

## Accent, forced colors, and reduced motion

- Editable content and calendar text stay neutral; focus, the current-day marker, range route, and inclusive endpoint bookends use bounded accent roles while invalidity remains dangerous.
- Forced colors preserve field, segment focus, calendar boundaries, unavailable dates, current day, range continuity, and endpoint identities with system colors.
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
