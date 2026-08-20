import {
  DateField,
  DatePicker,
  DateRangePicker,
  TimeField,
  type CalendarDateValue,
  type DateRangeValue,
  type TimeValue,
} from '../src/index.js';
import {CalendarDate, Time} from '@internationalized/date';

const date = {day: 20, month: 8, year: 2026} satisfies CalendarDateValue;
const time = {hour: 14, minute: 30, second: 0} satisfies TimeValue;
const range = {
  start: date,
  end: {day: 24, month: 8, year: 2026},
} satisfies DateRangeValue;

export const dateTimeControls = (
  <>
    <DateField calendar="gregory" defaultValue={date} label="Run date" locale="en-US" />
    <TimeField
      defaultValue={time}
      granularity="minute"
      hourCycle={24}
      label="Run time"
      locale="en-US"
    />
    <DatePicker
      calendar="japanese"
      calendarButtonLabel="Choose review date"
      label="Review date"
      locale="ja-JP"
      onChange={() => undefined}
      placeholderValue={date}
      value={date}
    />
    <DateRangePicker
      calendar="gregory"
      calendarButtonLabel="Choose review window"
      defaultValue={range}
      label="Review window"
      locale="en-US"
      names={['review-start', 'review-end']}
      placeholderValue={date}
    />
  </>
);

export const implicitDateLocale = (
  // @ts-expect-error Date controls require a deterministic locale.
  <DateField calendar="gregory" label="Run date" />
);

// @ts-expect-error Date controls require an explicit display calendar.
export const implicitDateCalendar = <DateField label="Run date" locale="en-US" />;

export const implicitHourCycle = (
  // @ts-expect-error Time formatting requires an explicit hour cycle.
  <TimeField granularity="minute" label="Run time" locale="en-US" />
);

export const implicitTimeGranularity = (
  // @ts-expect-error Time formatting requires an explicit granularity.
  <TimeField hourCycle={24} label="Run time" locale="en-US" />
);

export const implicitPickerPlaceholder = (
  // @ts-expect-error Pickers require a deterministic empty-calendar anchor.
  <DatePicker
    calendar="gregory"
    calendarButtonLabel="Choose date"
    label="Run date"
    locale="en-US"
  />
);

export const implicitRangePlaceholder = (
  // @ts-expect-error Range pickers require a deterministic empty-calendar anchor.
  <DateRangePicker
    calendar="gregory"
    calendarButtonLabel="Choose range"
    label="Run dates"
    locale="en-US"
  />
);

export const inertControlledDate = (
  // @ts-expect-error Controlled date ownership requires onChange.
  <DateField calendar="gregory" label="Run date" locale="en-US" value={date} />
);

// @ts-expect-error Controlled and uncontrolled ownership cannot be combined.
export const ambiguousDateOwnership = DateField({
  calendar: 'gregory',
  defaultValue: date,
  label: 'Run date',
  locale: 'en-US',
  onChange: () => undefined,
  value: date,
});

export const nativeDateLeak = (
  <DatePicker
    calendar="gregory"
    calendarButtonLabel="Choose date"
    // @ts-expect-error Public values are plain library values, not native Date instances.
    defaultValue={new Date()}
    label="Run date"
    locale="en-US"
    placeholderValue={date}
  />
);

export const upstreamCalendarDateLeak = (
  <DatePicker
    calendar="gregory"
    calendarButtonLabel="Choose date"
    // @ts-expect-error Private internationalized date objects cannot cross the public boundary.
    defaultValue={new CalendarDate(2026, 8, 20)}
    label="Run date"
    locale="en-US"
    placeholderValue={date}
  />
);

export const upstreamTimeLeak = (
  <TimeField
    // @ts-expect-error Private internationalized time objects cannot cross the public boundary.
    defaultValue={new Time(14, 30)}
    granularity="minute"
    hourCycle={24}
    label="Run time"
    locale="en-US"
  />
);

export const styledDatePicker = (
  <DatePicker
    calendar="gregory"
    calendarButtonLabel="Choose date"
    // @ts-expect-error Date controls do not accept consumer class injection.
    className="calendar"
    label="Run date"
    locale="en-US"
    placeholderValue={date}
  />
);
