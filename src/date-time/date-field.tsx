'use client';

import type {CalendarDate} from '@internationalized/date';
import {I18nProvider} from 'react-aria/I18nProvider';
import {DateField as AriaDateField} from 'react-aria-components/DateField';
import {Label} from 'react-aria-components/Label';
import type {ReactElement} from 'react';

import {useFieldGroupDisabled} from '../fields/field-group-context.js';
import {FieldSupport} from '../fields/field-support.js';
import {
  assertDateBounds,
  fromDisplayDate,
  localeWithCalendar,
  placeholderDate,
  toDisplayDate,
} from './date-time-domain.js';
import {DateSegments} from './date-time-parts.js';
import type {DateFieldProps} from './date-time-types.js';

export function DateField({
  calendar,
  defaultValue,
  description,
  errorMessage,
  form,
  isDateUnavailable,
  isDisabled = false,
  isInvalid,
  isReadOnly = false,
  isRequired = false,
  label,
  locale,
  maxValue,
  minValue,
  name,
  onChange,
  shouldForceLeadingZeros,
  validate,
  validationBehavior = 'native',
  value,
}: DateFieldProps): ReactElement {
  const disabled = useFieldGroupDisabled() || isDisabled;
  assertDateBounds(minValue, maxValue);

  return (
    <I18nProvider locale={localeWithCalendar(locale, calendar)}>
      <AriaDateField<CalendarDate>
        data-wcl-date-field=""
        data-wcl-field=""
        isDisabled={disabled}
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        placeholderValue={placeholderDate(calendar)}
        validationBehavior={validationBehavior}
        {...(defaultValue === undefined
          ? {}
          : {defaultValue: defaultValue === null ? null : toDisplayDate(defaultValue, calendar)})}
        {...(form === undefined ? {} : {form})}
        {...(isDateUnavailable === undefined
          ? {}
          : {isDateUnavailable: (date) => isDateUnavailable(fromDisplayDate(date))})}
        {...(isInvalid === undefined ? {} : {isInvalid})}
        {...(maxValue === undefined ? {} : {maxValue: toDisplayDate(maxValue, calendar)})}
        {...(minValue === undefined ? {} : {minValue: toDisplayDate(minValue, calendar)})}
        {...(name === undefined ? {} : {name})}
        {...(onChange === undefined
          ? {}
          : {onChange: (date) => onChange(date === null ? null : fromDisplayDate(date))})}
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
        <DateSegments isControl />
        <FieldSupport description={description} errorMessage={errorMessage} isPending={false} />
      </AriaDateField>
    </I18nProvider>
  );
}
