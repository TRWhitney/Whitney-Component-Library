# DateRangePicker

DateRangePicker collects one inclusive continuous civil-date interval.

## Use for

- two inclusive civil dates define one continuous interval

## Do not use for

- one date is selected, the dates are unrelated, or the interval contains time-zone-aware instants

## Prefer instead

- Use DateField for one known date, DatePicker for one calendar-assisted date, or two independent fields when the dates do not define an interval.

## Composition and parts

- Render DateRangePicker inside AppearanceProvider and let it own both endpoints and the range calendar.
- DateRangePicker includes a label, start and end segments, separator, trigger, two hidden inputs, support area, popover dialog, and range calendar.

## Preferred higher-level compositions

- Place the range with related constraints in FieldGroup or FormSection.

## Content

- Name the interval as a whole and explain whether both inclusive endpoint dates count.

## States

- Empty, partial, complete, open, closed, controlled, uncontrolled, unavailable, limited, invalid, required, read-only, and disabled states.

## Control, events, validation, and forms

- Controlled or uncontrolled ranges may be empty. Each value is one continuous interval. placeholderValue anchors the empty calendar without selecting a range. Start never follows end. A range may contain unavailable dates, but it is then invalid. Entry and calendar selection stay synchronized.
- onChange reports a complete inclusive ISO range or null. onOpenChange reports every open-state transition.
- Ordering, limits, unavailable dates, required state, custom validate, and application errors apply to the complete interval and share one fixed error area.
- names supplies ordered start and end field names; each endpoint serializes as YYYY-MM-DD and reset restores the complete default range.

## Accessibility

- DateRangePicker exposes two ordered segmented inputs, one named calendar button, and a dialog grid that identifies both endpoints and the selected interval to assistive technology.

## Keyboard, labeling, localization, and direction

- Each endpoint supports segmented entry. The calendar handles spatial navigation, range anchoring, selection completion, Escape dismissal, and focus restoration.
- label names the complete interval while generated context distinguishes start and end segments.
- locale and calendar are required initial-render inputs; provide localized labels, support text, errors, and calendar trigger labels.
- Locale determines segment order, numerals, calendar grid direction, and logical previous or next navigation without changing value identity or DOM reading order.

## Appearance and responsive behavior

- Segmented controls use the compact field layout and a fixed support area. Pickers add a raised calendar with weekday labels, a continuous range fill, and selected-day or endpoint rails that match selected actions.
- Fields fill their parent. Segments remain operable on narrow screens, and the single-month calendar stays inside the viewport.

## Accent, forced colors, and reduced motion

- Editable content and calendar text stay neutral. Focus, today, the selected range, and its endpoints use accent colors. Invalid fields retain their danger boundary and thicken it on enabled hover.
- Forced colors use system colors for fields, segment focus, calendar borders, unavailable dates, today, selected ranges, and endpoints.
- Reduced motion removes the short popover transition; segment edits and month changes never use positional animation.

## Examples

### Choose a review window

Collect one inclusive interval and serialize its two endpoint identities.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, DateRangePicker} from '@trwhitney/component-library';

export function ReviewWindowPicker() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <DateRangePicker calendar="gregory" calendarButtonLabel="Choose review window" defaultValue={{start: {year: 2026, month: 8, day: 20}, end: {year: 2026, month: 8, day: 24}}} label="Review window" locale="en-US" names={["review-start", "review-end"]} placeholderValue={{year: 2026, month: 8, day: 20}} />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not join independent dates into a range

Two unrelated dates do not form one continuous interval.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, DateRangePicker} from '@trwhitney/component-library';

export function IndependentDatesCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <DateRangePicker calendar="gregory" calendarButtonLabel="Choose dates" label="Created and reviewed" locale="en-US" placeholderValue={{year: 2026, month: 8, day: 20}} />
    </AppearanceProvider>
  );
}
```
