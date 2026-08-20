# 15 Date and Time Value Contract

**Status:** resolved
**Blocked by:** [Behavior and Accessibility Foundation](03-behavior-foundation.md),
[Foundation Expansion Constraints](07-foundation-expansion-constraints.md)
**Type:** discussion

## Question

How should date and time controls represent values, calendars, localization, form data, and picker
behavior without exposing the private React Aria date model or confusing calendar dates with
instants?

## Answer

Expose three plain, immutable, library-owned value shapes:

- `CalendarDateValue` is an ISO 8601 calendar date with `year`, `month`, and `day`. It identifies a
  civil day rather than an instant and supports years 1 through 9999.
- `TimeValue` is a zone-free wall-clock time with `hour`, `minute`, and `second`.
- `DateRangeValue` contains inclusive `start` and `end` calendar dates in ascending order.

Date controls require both `locale` and a bounded `CalendarSystem`. Public values and form data
remain ISO regardless of the display calendar; the component converts them to and from the chosen
calendar privately. TimeField requires `locale`, exposes an explicit hour cycle and granularity,
and rejects precision hidden below the selected granularity. These controls do not accept a time
zone because neither a calendar date nor a wall-clock time identifies an instant. A future date-time
or zoned-date-time control must use a distinct public value and contract.

Empty values are `null`. Controlled and uncontrolled ownership remain mutually exclusive. Date
constraints, unavailable-date callbacks, validation callbacks, and change events use only the
library-owned values. Date ranges are continuous, inclusive, non-descending intervals and cannot
be valid while containing an unavailable date. Such a complete range remains representable in
controlled and uncontrolled state and reaches `onChange`, but the field is invalid on its stable
error track and native validation prevents form submission. Structurally malformed dates and
descending ranges are rejected at the public boundary; availability is a recoverable validation
condition rather than a structural exception.

Date and time form values serialize as fixed ISO strings. DateRangePicker uses two explicitly
ordered optional names, one for each endpoint. Locale, calendar, hour cycle, and granularity are
part of initial render input so server output and hydration do not depend on a browser default.

DateField and TimeField are direct segmented-entry controls for known values. DatePicker adds a
calendar only when spatial date context, nearby availability, or month navigation helps the choice.
DateRangePicker owns one contiguous interval and its two endpoint identities. Pickers own their
trigger, open state, focus movement and restoration, outside and Escape dismissal, calendar
navigation, bounds, and unavailable-date presentation.

Each picker requires a plain ISO `placeholderValue`. It determines the visible and focused calendar
date while the picker is empty, so empty initial rendering never depends on the current clock and
never strands a nearby-date workflow at a library-selected historical month. The value does not
select or submit a date.

The visual direction is a compact almanac instrument within the established Focus + Rail +
Momentum + Route language:

- surface, raised surface, neutral text, muted text, structural border, and accent rail/focus roles
  provide the bounded color vocabulary;
- IBM Plex Sans carries labels and editable segments while IBM Plex Mono carries weekday and
  calendar utility text;
- segmented fields use the existing field geometry, and picker popovers use one raised single-month
  sheet with logical navigation;
- a continuous soft route band joins range dates, with exact or saturated accent bookends marking
  the inclusive endpoints;
- popovers use only the existing short fade and translate transition, month changes do not slide,
  and reduced motion removes the transition.

This direction reuses the library's compact rounded containment, stable support track, neutral
content, accent focus structure, and relationship rail. The range route adds family-specific
meaning without duplicating validation or turning every selected day into an unrelated filled
action.

## Evidence

- [Specification](../spec.md)
- [Behavior and Accessibility Foundation](03-behavior-foundation.md)
- [Style and Theme Contract](02-style-and-theme-contract.md)
- [Visual Direction and Permitted Variation](05-visual-direction.md)
- [Foundation Expansion Constraints](07-foundation-expansion-constraints.md)
- The private behavior dependency supplies internationalized segmented editing, calendar
  navigation, range semantics, overlay focus, and localized direction while accepting calendar
  dates and zone-free times as distinct inputs.
