'use client';

import {Button as AriaButton} from 'react-aria-components/Button';
import {Input} from 'react-aria-components/Input';
import {Label} from 'react-aria-components/Label';
import {SearchField as AriaSearchField} from 'react-aria-components/SearchField';
import type {ReactElement} from 'react';

import {FieldSupport} from './field-support.js';
import {FieldIcon} from './field-icons.js';
import {useFieldGroupDisabled} from './field-group-context.js';
import type {SearchFieldProps} from './field-types.js';

export function SearchField({
  autoComplete,
  clearLabel,
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
  maxLength,
  minLength,
  name,
  onChange,
  onClear,
  onSubmit,
  pattern,
  pendingMessage,
  placeholder,
  validationBehavior = 'native',
  validate,
  value,
}: SearchFieldProps): ReactElement {
  const inheritedDisabled = useFieldGroupDisabled();
  const disabled = inheritedDisabled || isDisabled;

  return (
    <AriaSearchField
      aria-busy={isPending || undefined}
      data-wcl-field=""
      data-wcl-search-field=""
      isDisabled={disabled}
      isReadOnly={isReadOnly || isPending}
      isRequired={isRequired}
      validationBehavior={validationBehavior}
      {...(validate === undefined ? {} : {validate})}
      {...(defaultValue === undefined ? {} : {defaultValue})}
      {...(isInvalid === undefined ? {} : {isInvalid})}
      {...(isPending ? {'data-wcl-pending': ''} : {})}
      {...(onChange === undefined ? {} : {onChange})}
      {...(onClear === undefined ? {} : {onClear})}
      {...(onSubmit === undefined ? {} : {onSubmit})}
      {...(value === undefined ? {} : {value})}
    >
      {({isEmpty}) => (
        <>
          <Label data-wcl-field-label="">
            {label}
            {isRequired ? (
              <span aria-hidden="true" data-wcl-field-required="">
                *
              </span>
            ) : null}
          </Label>
          <div data-wcl-field-control="" data-wcl-search-control="">
            <span aria-hidden="true" data-wcl-search-icon="">
              <FieldIcon kind="search" />
            </span>
            <Input
              aria-busy={isPending || undefined}
              data-wcl-field-input=""
              {...(autoComplete === undefined ? {} : {autoComplete})}
              {...(form === undefined ? {} : {form})}
              {...(maxLength === undefined ? {} : {maxLength})}
              {...(minLength === undefined ? {} : {minLength})}
              {...(name === undefined ? {} : {name})}
              {...(pattern === undefined ? {} : {pattern})}
              {...(placeholder === undefined ? {} : {placeholder})}
            />
            {!isEmpty && !disabled && !isPending && !isReadOnly ? (
              <AriaButton aria-label={clearLabel} data-wcl-search-clear="" slot="clear">
                <FieldIcon kind="clear" />
              </AriaButton>
            ) : null}
          </div>
          <FieldSupport
            description={description}
            errorMessage={errorMessage}
            isPending={isPending}
            pendingMessage={pendingMessage}
          />
        </>
      )}
    </AriaSearchField>
  );
}
