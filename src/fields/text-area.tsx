'use client';

import {Label} from 'react-aria-components/Label';
import {TextArea as AriaTextArea} from 'react-aria-components/TextArea';
import {TextField as AriaTextField} from 'react-aria-components/TextField';
import type {ReactElement} from 'react';

import {FieldSupport} from './field-support.js';
import {useFieldGroupDisabled} from './field-group-context.js';
import type {TextAreaProps} from './field-types.js';

export function TextArea({
  defaultValue,
  description,
  errorMessage,
  form,
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
  pendingMessage,
  placeholder,
  rows = 5,
  validationBehavior = 'native',
  validate,
  value,
}: TextAreaProps): ReactElement {
  const inheritedDisabled = useFieldGroupDisabled();
  const disabled = inheritedDisabled || isDisabled;

  return (
    <AriaTextField
      aria-busy={isPending || undefined}
      data-reserve-support={reserveSupportSpace || undefined}
      data-wcl-field=""
      data-wcl-text-area=""
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
        <AriaTextArea
          aria-busy={isPending || undefined}
          data-wcl-field-input=""
          rows={rows}
          {...(form === undefined ? {} : {form})}
          {...(maxLength === undefined ? {} : {maxLength})}
          {...(minLength === undefined ? {} : {minLength})}
          {...(name === undefined ? {} : {name})}
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
