'use client';

import type {CalendarDate} from '@internationalized/date';
import {I18nProvider} from 'react-aria/I18nProvider';
import {Button} from 'react-aria-components/Button';
import {Calendar} from 'react-aria-components/Calendar';
import {DatePicker as AriaDatePicker} from 'react-aria-components/DatePicker';
import {Dialog} from 'react-aria-components/Dialog';
import {Group} from 'react-aria-components/Group';
import {Label} from 'react-aria-components/Label';
import {Popover} from 'react-aria-components/Popover';
import type {ReactElement} from 'react';

import {useFieldGroupDisabled} from '../fields/field-group-context.js';
import {FieldSupport} from '../fields/field-support.js';
import {
  assertDateBounds,
  fromDisplayDate,
  localeWithCalendar,
  toDisplayDate,
} from './date-time-domain.js';
import {CalendarSheet} from './calendar-sheet.js';
import {CalendarIcon, DateSegments} from './date-time-parts.js';
import type {DatePickerProps} from './date-time-types.js';

export function DatePicker({
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
  name,
  onChange,
  onOpenChange,
  placeholderValue,
  shouldForceLeadingZeros,
  validate,
  validationBehavior = 'native',
  value,
}: DatePickerProps): ReactElement {
  const disabled = useFieldGroupDisabled() || isDisabled;
  assertDateBounds(minValue, maxValue);

  return (
    <I18nProvider locale={localeWithCalendar(locale, calendar)}>
      <AriaDatePicker<CalendarDate>
        data-wcl-date-picker=""
        data-wcl-field=""
        isDisabled={disabled}
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        placeholderValue={toDisplayDate(placeholderValue, calendar)}
        validationBehavior={validationBehavior}
        {...(defaultOpen === undefined ? {} : {defaultOpen})}
        {...(defaultValue === undefined
          ? {}
          : {defaultValue: defaultValue === null ? null : toDisplayDate(defaultValue, calendar)})}
        {...(firstDayOfWeek === undefined ? {} : {firstDayOfWeek})}
        {...(form === undefined ? {} : {form})}
        {...(isDateUnavailable === undefined
          ? {}
          : {isDateUnavailable: (date) => isDateUnavailable(fromDisplayDate(date))})}
        {...(isInvalid === undefined ? {} : {isInvalid})}
        {...(isOpen === undefined ? {} : {isOpen})}
        {...(maxValue === undefined ? {} : {maxValue: toDisplayDate(maxValue, calendar)})}
        {...(minValue === undefined ? {} : {minValue: toDisplayDate(minValue, calendar)})}
        {...(name === undefined ? {} : {name})}
        {...(onChange === undefined
          ? {}
          : {onChange: (date) => onChange(date === null ? null : fromDisplayDate(date))})}
        {...(onOpenChange === undefined ? {} : {onOpenChange})}
        {...(shouldForceLeadingZeros === undefined ? {} : {shouldForceLeadingZeros})}
        {...(validate === undefined ? {} : {validate: (date) => validate(fromDisplayDate(date))})}
        {...(value === undefined
          ? {}
          : {value: value === null ? null : toDisplayDate(value, calendar)})}
      >
        <Label data-wcl-field-label="">
          {label}
          {isRequired ? (
            <span aria-hidden="true" data-wcl-field-required="">
              *
            </span>
          ) : null}
        </Label>
        <Group data-wcl-date-picker-control="" data-wcl-field-control="">
          <DateSegments />
          <Button aria-label={calendarButtonLabel} data-wcl-calendar-trigger="">
            <CalendarIcon />
          </Button>
        </Group>
        <FieldSupport description={description} errorMessage={errorMessage} isPending={false} />
        <Popover data-wcl-calendar-popover="" offset={6} placement="bottom start">
          <Dialog data-wcl-calendar-dialog="">
            <Calendar data-wcl-calendar="" weeksInMonth={6}>
              <CalendarSheet />
            </Calendar>
          </Dialog>
        </Popover>
      </AriaDatePicker>
    </I18nProvider>
  );
}
