'use client';

import {Radio as AriaRadio, RadioGroup as AriaRadioGroup} from 'react-aria-components/RadioGroup';
import type {ReactElement} from 'react';

import {ChoiceIndicator, ChoiceLabel, ChoiceSupport, useChoiceIds} from './choice-support.js';
import type {RadioGroupProps} from './choice-types.js';

export function RadioGroup<const Value extends string>({
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
}: RadioGroupProps<Value>): ReactElement {
  const ids = useChoiceIds(Boolean(description), isInvalid && Boolean(errorMessage));

  return (
    <AriaRadioGroup
      aria-labelledby={ids.labelId}
      data-wcl-choice-group=""
      data-wcl-radio-group=""
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      validationBehavior={validationBehavior}
      {...(ids.describedBy === undefined ? {} : {'aria-describedby': ids.describedBy})}
      {...(form === undefined ? {} : {form})}
      {...(name === undefined ? {} : {name})}
      {...(defaultValue === undefined ? {} : {defaultValue})}
      {...(value === undefined ? {} : {value})}
      {...(onChange === undefined
        ? {}
        : {onChange: (nextValue: string) => onChange(nextValue as Value)})}
    >
      <ChoiceLabel id={ids.labelId} isRequired={isRequired}>
        {label}
      </ChoiceLabel>
      <div data-wcl-choice-options="">
        {options.map((option, index) => (
          <AriaRadio
            data-wcl-choice-control=""
            key={option.value}
            value={option.value}
            aria-labelledby={`${ids.labelId}-option-${index}`}
            {...(option.description
              ? {'aria-describedby': `${ids.labelId}-option-${index}-description`}
              : {})}
            {...(option.isDisabled === undefined ? {} : {isDisabled: option.isDisabled})}
          >
            <ChoiceIndicator kind="radio" />
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
          </AriaRadio>
        ))}
      </div>
      <ChoiceSupport
        description={description}
        descriptionId={ids.descriptionId}
        errorId={ids.errorId}
        errorMessage={errorMessage}
        isInvalid={isInvalid}
      />
    </AriaRadioGroup>
  );
}
