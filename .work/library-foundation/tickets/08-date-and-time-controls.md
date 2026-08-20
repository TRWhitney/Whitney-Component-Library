# 08 Date and Time Controls

**What to build:** Date field, time field, date picker, and date-range picker exports with
internationalized segmented entry and calendar selection.

**Blocked by:** [Field and Text Entry Family](04-field-and-text-entry-family.md),
[Action Family](03-action-family.md)

**Status:** ready

- [ ] Public value types distinguish calendar dates, times, and ranges without leaking private
      React Aria types.
- [ ] Locale, calendar, time zone where applicable, formatting, and directionality are explicit.
- [ ] Segment keyboard editing and pointer or touch selection remain synchronized.
- [ ] Calendar overlays own focus, dismissal, unavailable dates, min/max bounds, and range meaning.
- [ ] Labeling, descriptions, validation, required, read-only, disabled, and form behavior pass.
- [ ] Server and client locale agreement produces deterministic hydration.
- [ ] Contracts distinguish direct date/time entry from picker use and warn against unnecessary
      calendar interaction.
- [ ] Theme, compact layout, forced-color, reduced-motion, SSR, hydration, and type checks pass.

## Accepted sources

- [Specification](../spec.md)
- [Behavior and Accessibility Foundation](../decisions/03-behavior-foundation.md)
- [Foundation Expansion Constraints](../decisions/07-foundation-expansion-constraints.md)

## Completion evidence

Pending implementation.
