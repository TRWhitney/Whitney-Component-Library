'use client';

import {I18nProvider} from 'react-aria/I18nProvider';
import {Button as AriaButton} from 'react-aria-components/Button';
import {Group} from 'react-aria-components/Group';
import {Input} from 'react-aria-components/Input';
import {Label} from 'react-aria-components/Label';
import {NumberField as AriaNumberField} from 'react-aria-components/NumberField';
import type {ReactElement} from 'react';

import {FieldSupport} from './field-support.js';
import {FieldIcon} from './field-icons.js';
import {useFieldGroupDisabled} from './field-group-context.js';
import type {NumberFieldProps} from './field-types.js';

export function NumberField({
  commitBehavior = 'snap',
  defaultValue,
  description,
  errorMessage,
  form,
  formatOptions,
  isDisabled = false,
  isInvalid,
  isPending = false,
  isReadOnly = false,
  isRequired = false,
  isWheelDisabled = true,
  label,
  locale,
  maxValue,
  minValue,
  name,
  onChange,
  pendingMessage,
  placeholder,
  step,
  validationBehavior = 'native',
  validate,
  value,
}: NumberFieldProps): ReactElement {
  const inheritedDisabled = useFieldGroupDisabled();
  const disabled = inheritedDisabled || isDisabled;
  const resolvedFormatOptions =
    formatOptions ?? inferDecimalFormatOptions([defaultValue, value, minValue, maxValue, step]);

  return (
    <I18nProvider locale={locale}>
      <AriaNumberField
        aria-busy={isPending || undefined}
        commitBehavior={commitBehavior}
        data-wcl-field=""
        data-wcl-number-field=""
        isDisabled={disabled}
        isReadOnly={isReadOnly || isPending}
        isRequired={isRequired}
        isWheelDisabled={isWheelDisabled}
        validationBehavior={validationBehavior}
        {...(form === undefined ? {} : {form})}
        {...(defaultValue === undefined ? {} : {defaultValue})}
        formatOptions={resolvedFormatOptions}
        {...(isInvalid === undefined ? {} : {isInvalid})}
        {...(isPending ? {'data-wcl-pending': ''} : {})}
        {...(maxValue === undefined ? {} : {maxValue})}
        {...(minValue === undefined ? {} : {minValue})}
        {...(name === undefined ? {} : {name})}
        {...(onChange === undefined ? {} : {onChange})}
        {...(step === undefined ? {} : {step})}
        {...(value === undefined ? {} : {value})}
        {...(validate === undefined ? {} : {validate})}
      >
        <Label data-wcl-field-label="">
          {label}
          {isRequired ? (
            <span aria-hidden="true" data-wcl-field-required="">
              *
            </span>
          ) : null}
        </Label>
        <Group data-wcl-field-control="" data-wcl-number-control="">
          <AriaButton data-wcl-number-step="" slot="decrement">
            <FieldIcon kind="decrement" />
          </AriaButton>
          <Input
            aria-busy={isPending || undefined}
            data-wcl-field-input=""
            {...(form === undefined ? {} : {form})}
            {...(placeholder === undefined ? {} : {placeholder})}
          />
          <AriaButton data-wcl-number-step="" slot="increment">
            <FieldIcon kind="increment" />
          </AriaButton>
        </Group>
        <FieldSupport
          description={description}
          errorMessage={errorMessage}
          isPending={isPending}
          pendingMessage={pendingMessage}
        />
      </AriaNumberField>
    </I18nProvider>
  );
}

function inferDecimalFormatOptions(
  values: readonly (number | undefined)[],
): Intl.NumberFormatOptions {
  const maximumFractionDigits = Math.max(3, ...values.map((candidate) => decimalPlaces(candidate)));

  return maximumFractionDigits <= 100 ? {maximumFractionDigits} : {maximumSignificantDigits: 21};
}

function decimalPlaces(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value)) return 0;

  const [coefficient = '', exponentText = '0'] = Math.abs(value)
    .toString()
    .toLowerCase()
    .split('e');
  const fractionalDigits = coefficient.split('.')[1]?.length ?? 0;
  const exponent = Number(exponentText);
  return Math.max(0, fractionalDigits - exponent);
}
