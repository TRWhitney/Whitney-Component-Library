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
- DateRangePicker owns a label, start and end segments, separator, trigger, two hidden inputs, support track, popover dialog, and range calendar.

## Preferred higher-level compositions

- Place the range with related constraints in FieldGroup or FormSection.

## Content

- Name the interval as a whole and explain whether both inclusive endpoint dates count.

## States

- Empty, partial, complete, open, closed, controlled, uncontrolled, unavailable, bounded, invalid, required, read-only, and disabled states.

## Control, events, validation, and forms

- Controlled or uncontrolled ranges may be empty; placeholderValue deterministically anchors the empty calendar without selecting a range, start never follows end, ranges containing unavailable dates remain representable but invalid, and entry and calendar selection remain synchronized.
- onChange reports a complete inclusive ISO range or null; onOpenChange reports every owned overlay transition.
- Ordering, bounds, unavailable dates, required state, custom validate, and external invalidity apply to the complete interval and stable error track.
- names supplies ordered start and end field names; each endpoint serializes as YYYY-MM-DD and reset restores the complete default range.

## Accessibility

- DateRangePicker exposes two ordered segmented endpoint inputs, one named calendar trigger, and a dialog grid whose range endpoints and continuous selected interval remain programmatic.

## Keyboard, labeling, localization, and direction

- Each endpoint supports segmented entry; the calendar owns spatial navigation, range anchoring, selection completion, Escape dismissal, and focus restoration.
- label names the complete interval while generated context distinguishes start and end segments.
- locale and calendar are required initial-render inputs; provide localized labels, support text, errors, and calendar trigger labels.
- Locale determines segment order, numerals, calendar grid direction, and logical previous or next navigation without changing value identity or DOM reading order.

## Appearance and responsive behavior

- Segmented controls retain the compact field geometry and stable support track; pickers add one raised almanac sheet with utility weekday text and a continuous range route.
- Fields fill a bounded parent, segments retain operable targets at compact widths, and the single-month calendar sheet remains viewport-contained.

## Accent, forced colors, and reduced motion

- Editable content and calendar text stay neutral; focus, the current-day marker, range route, and inclusive endpoint bookends use bounded accent roles while invalidity remains dangerous.
- Forced colors preserve field, segment focus, calendar boundaries, unavailable dates, current day, range continuity, and endpoint identities with system colors.
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
