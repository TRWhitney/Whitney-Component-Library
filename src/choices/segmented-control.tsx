'use client';

import {Radio as AriaRadio, RadioGroup as AriaRadioGroup} from 'react-aria-components/RadioGroup';
import type {CSSProperties, ReactElement} from 'react';

import {ChoiceLabel, ChoiceSupport, useChoiceIds} from './choice-support.js';
import type {SegmentedControlProps} from './choice-types.js';

export function SegmentedControl<const Value extends string>({
  defaultValue,
  description,
  reserveSupportSpace = true,
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
}: SegmentedControlProps<Value>): ReactElement {
  const ids = useChoiceIds(Boolean(description), isInvalid && Boolean(errorMessage));

  return (
    <AriaRadioGroup
      aria-labelledby={ids.labelId}
      data-wcl-choice-group=""
      data-wcl-segmented-control=""
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      validationBehavior={validationBehavior}
      style={({state}) => {
        const selectedIndex = options.findIndex((option) => option.value === state.selectedValue);
        return {
          '--wcl-segment-count': String(options.length),
          '--wcl-segment-index': String(Math.max(0, selectedIndex)),
          '--wcl-segment-selected': selectedIndex < 0 ? '0' : '1',
        } as CSSProperties;
      }}
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
      <div data-wcl-segment-track="">
        {options.map((option) => (
          <AriaRadio
            data-wcl-segment=""
            key={option.value}
            value={option.value}
            {...(option.isDisabled === undefined ? {} : {isDisabled: option.isDisabled})}
          >
            {option.label}
          </AriaRadio>
        ))}
      </div>
      <ChoiceSupport
        reserveSupportSpace={reserveSupportSpace}
        description={description}
        descriptionId={ids.descriptionId}
        errorId={ids.errorId}
        errorMessage={errorMessage}
        isInvalid={isInvalid}
      />
    </AriaRadioGroup>
  );
}
