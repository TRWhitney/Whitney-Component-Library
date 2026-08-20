'use client';

import {Time} from '@internationalized/date';
import {I18nProvider} from 'react-aria/I18nProvider';
import {Label} from 'react-aria-components/Label';
import {TimeField as AriaTimeField} from 'react-aria-components/TimeField';
import type {ReactElement} from 'react';

import {useFieldGroupDisabled} from '../fields/field-group-context.js';
import {FieldSupport} from '../fields/field-support.js';
import {assertTimeBounds, fromTime, toTime} from './date-time-domain.js';
import {DateSegments} from './date-time-parts.js';
import type {TimeFieldProps} from './date-time-types.js';

export function TimeField({
  defaultValue,
  description,
  errorMessage,
  form,
  granularity,
  hourCycle,
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
}: TimeFieldProps): ReactElement {
  const disabled = useFieldGroupDisabled() || isDisabled;
  assertTimeBounds(minValue, maxValue, granularity);

  return (
    <I18nProvider locale={locale}>
      <AriaTimeField<Time>
        data-wcl-field=""
        data-wcl-time-field=""
        granularity={granularity}
        hourCycle={hourCycle}
        isDisabled={disabled}
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        placeholderValue={new Time()}
        validationBehavior={validationBehavior}
        {...(defaultValue === undefined
          ? {}
          : {defaultValue: defaultValue === null ? null : toTime(defaultValue, granularity)})}
        {...(form === undefined ? {} : {form})}
        {...(isInvalid === undefined ? {} : {isInvalid})}
        {...(maxValue === undefined ? {} : {maxValue: toTime(maxValue, granularity)})}
        {...(minValue === undefined ? {} : {minValue: toTime(minValue, granularity)})}
        {...(name === undefined ? {} : {name})}
        {...(onChange === undefined
          ? {}
          : {onChange: (time) => onChange(time === null ? null : fromTime(time))})}
        {...(shouldForceLeadingZeros === undefined ? {} : {shouldForceLeadingZeros})}
        {...(validate === undefined ? {} : {validate: (time) => validate(fromTime(time))})}
        {...(value === undefined
          ? {}
          : {value: value === null ? null : toTime(value, granularity)})}
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
      </AriaTimeField>
    </I18nProvider>
  );
}
