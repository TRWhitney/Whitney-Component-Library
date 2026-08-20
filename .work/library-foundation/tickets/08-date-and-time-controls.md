# 08 Date and Time Controls

**What to build:** Date field, time field, date picker, and date-range picker exports with
internationalized segmented entry and calendar selection.

**Blocked by:** [Field and Text Entry Family](04-field-and-text-entry-family.md),
[Action Family](03-action-family.md)

**Status:** complete

- [x] Public value types distinguish calendar dates, times, and ranges without leaking private
      React Aria types.
- [x] Locale, calendar, time zone where applicable, formatting, and directionality are explicit.
- [x] Segment keyboard editing and pointer or touch selection remain synchronized.
- [x] Calendar overlays own focus, dismissal, unavailable dates, min/max bounds, and range meaning.
- [x] Labeling, descriptions, validation, required, read-only, disabled, and form behavior pass.
- [x] Server and client locale agreement produces deterministic hydration.
- [x] Contracts distinguish direct date/time entry from picker use and warn against unnecessary
      calendar interaction.
- [x] Theme, compact layout, forced-color, reduced-motion, SSR, hydration, and type checks pass.

## Accepted contract

- `CalendarDateValue` is a plain ISO date, `TimeValue` is a plain zone-free wall-clock value, and
  `DateRangeValue` is an inclusive ascending range. Empty values are `null`; no private date type
  crosses the public boundary.
- Date controls require `locale` and a bounded display `calendar`; values, constraints, callbacks,
  and form serialization retain ISO identity. TimeField requires locale, hour cycle, and
  granularity. Time zones and combined or zoned date-times are intentionally outside this family.
- DateField and TimeField own segmented direct entry. DatePicker adds single-date calendar
  selection. DateRangePicker adds one continuous interval and two endpoint names. Pickers own
  trigger and optional controlled open state, overlay focus and restoration, dismissal, calendar
  navigation, min/max bounds, and unavailable dates. A required plain ISO `placeholderValue`
  deterministically anchors the calendar while a picker is empty without selecting a value.
- Complete ranges containing unavailable dates remain representable under controlled or
  uncontrolled ownership and reach `onChange`, but stay invalid on the stable error track and
  cannot pass native form submission until every inclusive day is available.
- Calendar selection uses a single raised month sheet. A soft continuous route band joins range
  dates and accent bookends identify its inclusive endpoints. Existing field geometry, support
  tracks, type roles, accent roles, and bounded overlay motion remain authoritative.

## Observable checks

- Type probes accept controlled and uncontrolled plain values and reject upstream date objects,
  missing locale/calendar/time formatting inputs, mixed ownership, malformed ranges, and consumer
  style injection.
- Runtime tests cover segmented entry and selection, value conversion through a non-Gregorian
  display calendar, controlled and uncontrolled state, bounds, unavailable dates, validation,
  required/read-only/disabled behavior, overlay open and dismissal, form serialization and reset,
  and FieldGroup disabled inheritance.
- Contracts and showcase specimens explain direct entry versus calendar selection and exercise
  localized, range, invalid, read-only, disabled, and constrained states.
- Package verification covers public declaration encapsulation, React 18 and 19 SSR and hydration,
  and deterministic locale/calendar output. Browser evidence covers keyboard, pointer, touch,
  focus restoration, RTL, compact layout, forced colors, and reduced motion in Chromium, Firefox,
  and WebKit.

## Accepted sources

- [Specification](../spec.md)
- [Behavior and Accessibility Foundation](../decisions/03-behavior-foundation.md)
- [Foundation Expansion Constraints](../decisions/07-foundation-expansion-constraints.md)
- [Date and Time Value Contract](../decisions/15-date-and-time-value-contract.md)

## Completion evidence

- `npm run check` passes formatting, zero-warning ESLint and Stylelint, source types, 222 tests,
  generated guidance, and the TypeScript 5.9, 6, and 7 public declaration matrix.
- `npm run verify:package` passes packed React 18.3.1 and React 19.2.8 consumers, including
  deterministic Japanese-calendar rendering, date/time SSR and hydration, public types, external
  ISO form serialization, changed-value reset, explicit styles, and Vite browser builds.
- `npm run showcase:build`, `npm audit --audit-level=high`, the task-owned no-`Any` scan, and
  `git diff --check` pass.
- Chromium, Firefox, and WebKit direct operation covers non-Gregorian segment editing, touch date
  selection, synchronized public values, unavailable dates, inclusive range identity, keyboard
  overlay opening, Escape dismissal, focus restoration, compact containment, and RTL flow.
- Chromium direct inspection confirms a required plain ISO placeholder anchors an empty picker at
  August 2026 without selecting a day or producing console errors.
- Focused public-seam tests confirm both empty picker variants use their required placeholder
  without selecting or submitting it, omission fails public types, and controlled plus uncontrolled
  complete ranges spanning an unavailable interior day remain recoverably invalid without throwing
  or passing native submission.
- Inspected compact forced-color and reduced-motion rendering plus compact RTL Firefox and WebKit
  and wide dark Chromium rendering retain readable segments, an opaque raised month sheet, a
  subdued continuous range route, distinct inclusive endpoints, visible focus structure, stable
  support geometry, and no horizontal overflow. Temporary screenshots were discarded.
