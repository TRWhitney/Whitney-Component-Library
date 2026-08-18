'use client';

import {
  CheckboxButton as AriaCheckboxButton,
  CheckboxField as AriaCheckboxField,
} from 'react-aria-components/Checkbox';
import {CheckboxGroup as AriaCheckboxGroup} from 'react-aria-components/CheckboxGroup';
import type {ReactElement} from 'react';

import {ChoiceIndicator, ChoiceLabel, ChoiceSupport, useChoiceIds} from './choice-support.js';
import type {CheckboxGroupProps} from './choice-types.js';

export function CheckboxGroup<const Value extends string>({
  defaultValue,
  description,
  errorMessage,
  form,
  isDisabled = false,
  isInvalid = false,
  isReadOnly = false,
  isRequired = false,
  label,
  name,
  onChange,
  options,
  validationBehavior = 'aria',
  value,
}: CheckboxGroupProps<Value>): ReactElement {
  const ids = useChoiceIds(Boolean(description), isInvalid && Boolean(errorMessage));

  return (
    <AriaCheckboxGroup
      aria-labelledby={ids.labelId}
      data-wcl-choice-group=""
      data-wcl-checkbox-group=""
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      validationBehavior={validationBehavior}
      {...(ids.describedBy === undefined ? {} : {'aria-describedby': ids.describedBy})}
      {...(form === undefined ? {} : {form})}
      {...(name === undefined ? {} : {name})}
      {...(defaultValue === undefined ? {} : {defaultValue: [...defaultValue]})}
      {...(value === undefined ? {} : {value: [...value]})}
      {...(onChange === undefined
        ? {}
        : {onChange: (nextValue: string[]) => onChange(nextValue as Value[])})}
    >
      <ChoiceLabel id={ids.labelId} isRequired={isRequired}>
        {label}
      </ChoiceLabel>
      <div data-wcl-choice-options="">
        {options.map((option, index) => (
          <AriaCheckboxField
            data-wcl-choice-option=""
            key={option.value}
            value={option.value}
            aria-labelledby={`${ids.labelId}-option-${index}`}
            {...(option.description
              ? {'aria-describedby': `${ids.labelId}-option-${index}-description`}
              : {})}
            {...(form === undefined ? {} : {form})}
            {...(option.isDisabled === undefined ? {} : {isDisabled: option.isDisabled})}
          >
            <AriaCheckboxButton data-wcl-choice-control="">
              <ChoiceIndicator kind="checkbox" />
              <span data-wcl-choice-option-copy="">
                <span data-wcl-choice-option-label="" id={`${ids.labelId}-option-${index}`}>
                  {option.label}
                </span>
                {option.description ? (
                  <span
                    data-wcl-choice-option-description=""
                    id={`${ids.labelId}-option-${index}-description`}
                  >
                    {option.description}
                  </span>
                ) : null}
              </span>
            </AriaCheckboxButton>
          </AriaCheckboxField>
        ))}
      </div>
      <ChoiceSupport
        description={description}
        descriptionId={ids.descriptionId}
        errorId={ids.errorId}
        errorMessage={errorMessage}
        isInvalid={isInvalid}
      />
    </AriaCheckboxGroup>
  );
}
