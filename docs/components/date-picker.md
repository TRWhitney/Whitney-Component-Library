# DatePicker

DatePicker collects one civil date through synchronized direct entry and calendar selection.

## Use for

- one civil date is easier to choose by comparing nearby days or availability

## Do not use for

- a known date needs only direct entry, an interval is required, or the value is an instant

## Prefer instead

- Use DateField for direct entry, DateRangePicker for an interval, and a future zoned date-time control for an instant.

## Composition and parts

- Render DatePicker inside AppearanceProvider and let it own trigger, dialog, and calendar.
- DatePicker owns a label, date segments, trigger, hidden input, support track, popover dialog, heading, navigation, grid, and day cells.

## Preferred higher-level compositions

- Place related fields in FieldGroup and workflows in FormSection.

## Content

- Use a concise persistent label and explain accepted bounds or unavailable dates in durable support copy.

## States

- Empty, open, closed, controlled, uncontrolled, unavailable, bounded, invalid, required, read-only, and disabled states.

## Control, events, validation, and forms

- Segment edits and calendar selection update the same controlled or uncontrolled ISO value; placeholderValue deterministically anchors an empty calendar without selecting a date, and the picker owns optional controlled open state, bounds, and unavailable dates.
- onChange reports an ISO date or null; onOpenChange reports trigger, selection, Escape, and outside-dismissal changes.
- minValue, maxValue, unavailable dates, required state, custom validate, and external invalidity share the stable error track.
- name and form serialize YYYY-MM-DD, calendar selection commits the same value as direct entry, and reset restores defaultValue.

## Accessibility

- DatePicker combines labeled segmented entry with a distinctly named calendar trigger and a dialog whose grid owns navigation, selection, focus restoration, and dismissal.

## Keyboard, labeling, localization, and direction

- The trigger opens the dialog; calendar arrows move by day or week, Page keys move by month, Enter selects, Escape dismisses, and focus returns to the trigger.
- label is always visible and generated relationships apply to every editable segment.
- locale and calendar are required initial-render inputs; provide localized labels, support text, errors, and the calendar trigger label.
- Locale determines segment order, numerals, calendar grid direction, and logical previous or next navigation without changing value identity or DOM reading order.

## Appearance and responsive behavior

- Segmented controls retain the compact field geometry and stable support track; pickers add one raised almanac sheet with utility weekday text and a continuous range route.
- Fields fill a bounded parent, segments retain operable targets at compact widths, and the single-month calendar sheet remains viewport-contained.

## Accent, forced colors, and reduced motion

- Editable content and calendar text stay neutral; focus, the current-day marker, range route, and inclusive endpoint bookends use bounded accent roles while invalidity remains dangerous.
- Forced colors preserve field, segment focus, calendar boundaries, unavailable dates, current day, range continuity, and endpoint identities with system colors.
- Reduced motion removes the short popover transition; segment edits and month changes never use positional animation.

## Examples

### Choose a review date

Choose one nearby bounded day with direct entry retained.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, DatePicker} from '@trwhitney/component-library';

export function ReviewDatePicker() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <DatePicker calendar="gregory" calendarButtonLabel="Choose review date" label="Review date" locale="en-US" minValue={{year: 2026, month: 8, day: 18}} maxValue={{year: 2026, month: 8, day: 31}} placeholderValue={{year: 2026, month: 8, day: 20}} />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not add a calendar to every date

A distant known date is usually faster to type than to reach by month navigation.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, DatePicker} from '@trwhitney/component-library';

export function BirthDatePickerCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <DatePicker calendar="gregory" calendarButtonLabel="Choose birth date" label="Birth date" locale="en-US" placeholderValue={{year: 2000, month: 1, day: 1}} />
    </AppearanceProvider>
  );
}
```
