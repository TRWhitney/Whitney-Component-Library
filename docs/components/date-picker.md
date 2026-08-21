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
- DatePicker includes a label, date segments, trigger, hidden input, support area, popover dialog, heading, navigation, grid, and day cells.

## Preferred higher-level compositions

- Place related fields in FieldGroup and workflows in FormSection.

## Content

- Use a concise persistent label and explain accepted bounds or unavailable dates in durable support copy.

## States

- Empty, open, closed, controlled, uncontrolled, unavailable, limited, invalid, required, read-only, and disabled states.

## Control, events, validation, and forms

- Segment edits and calendar selection update the same controlled or uncontrolled ISO value. placeholderValue anchors an empty calendar without selecting a date. The picker also supports controlled open state, limits, and unavailable dates.
- onChange reports an ISO date or null; onOpenChange reports trigger, selection, Escape, and outside-dismissal changes.
- minValue, maxValue, unavailable dates, required state, custom validate, and application errors share the fixed error area.
- name and form serialize YYYY-MM-DD, calendar selection commits the same value as direct entry, and reset restores defaultValue.

## Accessibility

- DatePicker combines labeled segmented entry with a named calendar button. The calendar dialog handles navigation, selection, focus restoration, and dismissal.

## Keyboard, labeling, localization, and direction

- The trigger opens the dialog; calendar arrows move by day or week, Page keys move by month, Enter selects, Escape dismisses, and focus returns to the trigger.
- label is always visible and generated relationships apply to every editable segment.
- locale and calendar are required initial-render inputs; provide localized labels, support text, errors, and the calendar trigger label.
- Locale determines segment order, numerals, calendar grid direction, and logical previous or next navigation without changing value identity or DOM reading order.

## Appearance and responsive behavior

- Segmented controls use the compact field layout and a fixed support area. Pickers add a raised calendar with weekday labels, a continuous range fill, and selected-day or endpoint rails that match selected actions.
- Fields fill their parent. Segments remain operable on narrow screens, and the single-month calendar stays inside the viewport.

## Accent, forced colors, and reduced motion

- Editable content and calendar text stay neutral. Focus, today, the selected range, and its endpoints use accent colors. Invalid fields retain their danger boundary and thicken it on enabled hover.
- Forced colors use system colors for fields, segment focus, calendar borders, unavailable dates, today, selected ranges, and endpoints.
- Reduced motion removes the short popover transition; segment edits and month changes never use positional animation.

## Examples

### Choose a review date

Choose an available day while keeping direct entry.

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
