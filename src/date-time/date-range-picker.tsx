'use client';

import type {CalendarDate} from '@internationalized/date';
import {I18nProvider} from 'react-aria/I18nProvider';
import {Button} from 'react-aria-components/Button';
import {RangeCalendar} from 'react-aria-components/RangeCalendar';
import {DateRangePicker as AriaDateRangePicker} from 'react-aria-components/DateRangePicker';
import {Dialog} from 'react-aria-components/Dialog';
import {Group} from 'react-aria-components/Group';
import {Label} from 'react-aria-components/Label';
import {Popover} from 'react-aria-components/Popover';
import {useState, type ReactElement} from 'react';

import {useFieldGroupDisabled} from '../fields/field-group-context.js';
import {FieldSupport} from '../fields/field-support.js';
import {
  assertDateBounds,
  assertDateRange,
  fromDisplayDate,
  localeWithCalendar,
  rangeContainsUnavailableDate,
  toDisplayDate,
  toDisplayRange,
} from './date-time-domain.js';
import {CalendarSheet} from './calendar-sheet.js';
import {CalendarIcon, DateSegments} from './date-time-parts.js';
import type {DateRangePickerProps, DateRangeValue} from './date-time-types.js';

export function DateRangePicker({
  calendar,
  calendarButtonLabel,
  defaultOpen,
  defaultValue,
  description,
  errorMessage,
  firstDayOfWeek,
  form,
  isDateUnavailable,
  isDisabled = false,
  isInvalid,
  isOpen,
  isReadOnly = false,
  isRequired = false,
  label,
  locale,
  maxValue,
  minValue,
  names,
  onChange,
  onOpenChange,
  placeholderValue,
  shouldForceLeadingZeros,
  validate,
  validationBehavior = 'native',
  value,
}: DateRangePickerProps): ReactElement {
  const disabled = useFieldGroupDisabled() || isDisabled;
  const [activeEndpoint, setActiveEndpoint] = useState<'end' | 'start'>('start');
  const [internalCalendarOpen, setInternalCalendarOpen] = useState(defaultOpen ?? false);
  const calendarOpen = isOpen ?? internalCalendarOpen;
  const [observedCalendarOpen, setObservedCalendarOpen] = useState(calendarOpen);
  if (calendarOpen !== observedCalendarOpen) {
    setObservedCalendarOpen(calendarOpen);
    if (calendarOpen && activeEndpoint !== 'start') setActiveEndpoint('start');
  }
  assertDateBounds(minValue, maxValue);
  if (defaultValue) assertDateRange(defaultValue);
  if (value) assertDateRange(value);
  const toPublicRange = (range: {
    readonly end: Parameters<typeof fromDisplayDate>[0];
    readonly start: Parameters<typeof fromDisplayDate>[0];
  }): DateRangeValue => ({end: fromDisplayDate(range.end), start: fromDisplayDate(range.start)});
  const validatePublicRange = (range: Parameters<typeof toPublicRange>[0]) => {
    const publicRange = toPublicRange(range);
    if (rangeContainsUnavailableDate(publicRange, isDateUnavailable)) {
      return errorMessage ?? 'The range includes an unavailable date.';
    }
    return validate?.(publicRange);
  };

  return (
    <I18nProvider locale={localeWithCalendar(locale, calendar)}>
      <AriaDateRangePicker<CalendarDate>
        allowsNonContiguousRanges={false}
        data-wcl-active-endpoint={calendarOpen ? activeEndpoint : undefined}
        data-wcl-date-range-picker=""
        data-wcl-field=""
        isDisabled={disabled}
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        placeholderValue={toDisplayDate(placeholderValue, calendar)}
        validationBehavior={validationBehavior}
        shouldCloseOnSelect={false}
        {...(defaultOpen === undefined ? {} : {defaultOpen})}
        {...(defaultValue === undefined
          ? {}
          : {defaultValue: defaultValue === null ? null : toDisplayRange(defaultValue, calendar)})}
        {...(names === undefined ? {} : {endName: names[1], startName: names[0]})}
        {...(firstDayOfWeek === undefined ? {} : {firstDayOfWeek})}
        {...(form === undefined ? {} : {form})}
        {...(isDateUnavailable === undefined
          ? {}
          : {isDateUnavailable: (date) => isDateUnavailable(fromDisplayDate(date))})}
        {...(isInvalid === undefined ? {} : {isInvalid})}
        {...(isOpen === undefined ? {} : {isOpen})}
        {...(maxValue === undefined ? {} : {maxValue: toDisplayDate(maxValue, calendar)})}
        {...(minValue === undefined ? {} : {minValue: toDisplayDate(minValue, calendar)})}
        {...(onChange === undefined
          ? {}
          : {onChange: (range) => onChange(range === null ? null : toPublicRange(range))})}
        onOpenChange={(nextOpen) => {
          setInternalCalendarOpen(nextOpen);
          if (nextOpen) setActiveEndpoint('start');
          onOpenChange?.(nextOpen);
        }}
        {...(shouldForceLeadingZeros === undefined ? {} : {shouldForceLeadingZeros})}
        {...(validate === undefined && isDateUnavailable === undefined
          ? {}
          : {validate: validatePublicRange})}
        {...(value === undefined
          ? {}
          : {value: value === null ? null : toDisplayRange(value, calendar)})}
      >
        <Label data-wcl-field-label="">
          {label}
          {isRequired ? (
            <span aria-hidden="true" data-wcl-field-required="">
              *
            </span>
          ) : null}
        </Label>
        <Group
          data-wcl-date-picker-control=""
          data-wcl-date-range-control=""
          data-wcl-field-control=""
        >
          <DateSegments
            isActiveEndpoint={calendarOpen && activeEndpoint === 'start'}
            slot="start"
          />
          <span aria-hidden="true" data-wcl-date-range-separator="">
            –
          </span>
          <DateSegments isActiveEndpoint={calendarOpen && activeEndpoint === 'end'} slot="end" />
          <Button aria-label={calendarButtonLabel} data-wcl-calendar-trigger="">
            <CalendarIcon />
          </Button>
        </Group>
        <FieldSupport description={description} errorMessage={errorMessage} isPending={false} />
        <Popover data-wcl-calendar-popover="" offset={6} placement="bottom start">
          <Dialog data-wcl-calendar-dialog="">
            <RangeCalendar
              data-wcl-calendar=""
              data-wcl-range-calendar=""
              pageBehavior="single"
              visibleDuration={{months: 2}}
              weeksInMonth={6}
            >
              <CalendarSheet
                activeEndpoint={activeEndpoint}
                onActiveEndpointChange={setActiveEndpoint}
                range
              />
            </RangeCalendar>
          </Dialog>
        </Popover>
      </AriaDateRangePicker>
    </I18nProvider>
  );
}
