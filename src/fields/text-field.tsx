'use client';

import {Input} from 'react-aria-components/Input';
import {Label} from 'react-aria-components/Label';
import {TextField as AriaTextField} from 'react-aria-components/TextField';
import type {ReactElement} from 'react';

import {FieldSupport} from './field-support.js';
import {useFieldGroupDisabled} from './field-group-context.js';
import type {TextFieldProps} from './field-types.js';

export function TextField({
  autoComplete,
  defaultValue,
  description,
  errorMessage,
  form,
  inputMode,
  inputType = 'text',
  isDisabled = false,
  isInvalid,
  isPending = false,
  isReadOnly = false,
  isRequired = false,
  label,
  reserveSupportSpace = false,
  maxLength,
  minLength,
  name,
  onChange,
  pattern,
  pendingMessage,
  placeholder,
  validationBehavior = 'native',
  validate,
  value,
}: TextFieldProps): ReactElement {
  const inheritedDisabled = useFieldGroupDisabled();
  const disabled = inheritedDisabled || isDisabled;

  return (
    <AriaTextField
      aria-busy={isPending || undefined}
      data-reserve-support={reserveSupportSpace || undefined}
      data-wcl-field=""
      isDisabled={disabled}
      isReadOnly={isReadOnly || isPending}
      isRequired={isRequired}
      validationBehavior={validationBehavior}
      {...(validate === undefined ? {} : {validate})}
      {...(isInvalid === undefined ? {} : {isInvalid})}
      {...(isPending ? {'data-wcl-pending': ''} : {})}
      {...(defaultValue === undefined ? {} : {defaultValue})}
      {...(onChange === undefined ? {} : {onChange})}
      {...(value === undefined ? {} : {value})}
    >
      <Label data-wcl-field-label="">
        {label}
        {isRequired ? (
          <span aria-hidden="true" data-wcl-field-required="">
            *
          </span>
        ) : null}
      </Label>
      <div data-wcl-field-control="">
        <Input
          aria-busy={isPending || undefined}
          data-wcl-field-input=""
          type={inputType}
          {...(autoComplete === undefined ? {} : {autoComplete})}
          {...(form === undefined ? {} : {form})}
          {...(inputMode === undefined ? {} : {inputMode})}
          {...(maxLength === undefined ? {} : {maxLength})}
          {...(minLength === undefined ? {} : {minLength})}
          {...(name === undefined ? {} : {name})}
          {...(pattern === undefined ? {} : {pattern})}
          {...(placeholder === undefined ? {} : {placeholder})}
        />
      </div>
      <FieldSupport
        description={description}
        errorMessage={errorMessage}
        isPending={isPending}
        pendingMessage={pendingMessage}
      />
    </AriaTextField>
  );
}
