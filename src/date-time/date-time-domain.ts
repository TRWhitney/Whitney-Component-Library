import {
  CalendarDate,
  Time,
  createCalendar,
  toCalendar,
  type CalendarDate as InternationalizedCalendarDate,
  type DateValue as InternationalizedDateValue,
} from '@internationalized/date';

import type {
  CalendarDateValue,
  CalendarSystem,
  DateRangeValue,
  TimeGranularity,
  TimeValue,
} from './date-time-types.js';

const gregorianCalendar = createCalendar('gregory');

export function localeWithCalendar(locale: string, calendar: CalendarSystem): string {
  try {
    return new Intl.Locale(locale, {calendar}).toString();
  } catch (cause) {
    throw new RangeError(`locale must be a valid locale identifier: ${locale}`, {cause});
  }
}

export function toDisplayDate(
  value: CalendarDateValue,
  calendar: CalendarSystem,
): InternationalizedCalendarDate {
  return toCalendar(toIsoDate(value), createCalendar(calendar));
}

export function fromDisplayDate(value: InternationalizedDateValue): CalendarDateValue {
  const isoDate = toCalendar(value, gregorianCalendar);
  return {day: isoDate.day, month: isoDate.month, year: isoDate.year};
}

export function toIsoDate(value: CalendarDateValue): InternationalizedCalendarDate {
  assertCalendarDate(value);
  return new CalendarDate(value.year, value.month, value.day);
}

export function toDisplayRange(
  value: DateRangeValue,
  calendar: CalendarSystem,
): {end: InternationalizedCalendarDate; start: InternationalizedCalendarDate} {
  assertDateRange(value);
  return {
    end: toDisplayDate(value.end, calendar),
    start: toDisplayDate(value.start, calendar),
  };
}

export function toTime(value: TimeValue, granularity: TimeGranularity): Time {
  assertTime(value, granularity);
  return new Time(value.hour, value.minute, value.second);
}

export function fromTime(value: Time): TimeValue {
  return {hour: value.hour, minute: value.minute, second: value.second};
}

export function assertDateBounds(
  minValue: CalendarDateValue | undefined,
  maxValue: CalendarDateValue | undefined,
): void {
  if (minValue) assertCalendarDate(minValue);
  if (maxValue) assertCalendarDate(maxValue);
  if (minValue && maxValue && toIsoDate(minValue).compare(toIsoDate(maxValue)) > 0) {
    throw new RangeError('minValue must not be after maxValue.');
  }
}

export function assertTimeBounds(
  minValue: TimeValue | undefined,
  maxValue: TimeValue | undefined,
  granularity: TimeGranularity,
): void {
  if (minValue) assertTime(minValue, granularity);
  if (maxValue) assertTime(maxValue, granularity);
  if (
    minValue &&
    maxValue &&
    toTime(minValue, granularity).compare(toTime(maxValue, granularity)) > 0
  ) {
    throw new RangeError('minValue must not be after maxValue.');
  }
}

export function assertCalendarDate(value: CalendarDateValue): void {
  if ('calendar' in value || 'era' in value) {
    throw new TypeError('Calendar dates must be plain library-owned ISO values.');
  }
  if (!Number.isInteger(value.year) || value.year < 1 || value.year > 9999) {
    throw new RangeError('Calendar date years must be integers from 1 through 9999.');
  }
  if (!Number.isInteger(value.month) || !Number.isInteger(value.day)) {
    throw new RangeError('Calendar date months and days must be integers.');
  }
  const constrained = new CalendarDate(value.year, value.month, value.day);
  if (constrained.month !== value.month || constrained.day !== value.day) {
    throw new RangeError('Calendar dates must identify a valid ISO calendar day.');
  }
}

export function assertDateRange(value: DateRangeValue): void {
  const start = toIsoDate(value.start);
  const end = toIsoDate(value.end);
  if (start.compare(end) > 0) throw new RangeError('Date ranges must be in ascending order.');
}

export function rangeContainsUnavailableDate(
  value: DateRangeValue,
  isDateUnavailable: ((date: CalendarDateValue) => boolean) | undefined,
): boolean {
  if (!isDateUnavailable) return false;

  let candidate = toIsoDate(value.start);
  const end = toIsoDate(value.end);
  while (candidate.compare(end) <= 0) {
    if (isDateUnavailable({day: candidate.day, month: candidate.month, year: candidate.year})) {
      return true;
    }
    candidate = candidate.add({days: 1});
  }
  return false;
}

export function assertTime(value: TimeValue, granularity: TimeGranularity): void {
  if ('millisecond' in value) {
    throw new TypeError('Times must be plain library-owned wall-clock values.');
  }
  const fields = [value.hour, value.minute, value.second];
  if (fields.some((part) => !Number.isInteger(part))) {
    throw new RangeError('Time values must contain integer hours, minutes, and seconds.');
  }
  if (
    value.hour < 0 ||
    value.hour > 23 ||
    value.minute < 0 ||
    value.minute > 59 ||
    value.second < 0 ||
    value.second > 59
  ) {
    throw new RangeError('Time values must identify a valid wall-clock time.');
  }
  if (granularity === 'hour' && (value.minute !== 0 || value.second !== 0)) {
    throw new RangeError('Hour-granularity values cannot contain hidden minutes or seconds.');
  }
  if (granularity === 'minute' && value.second !== 0) {
    throw new RangeError('Minute-granularity values cannot contain hidden seconds.');
  }
}

export function placeholderDate(calendar: CalendarSystem): InternationalizedCalendarDate {
  return toDisplayDate({day: 1, month: 1, year: 2000}, calendar);
}
