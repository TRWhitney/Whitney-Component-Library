'use client';

import {
  CheckboxButton as AriaCheckboxButton,
  CheckboxField as AriaCheckboxField,
} from 'react-aria-components/Checkbox';
import type {ReactElement} from 'react';

import {ChoiceIndicator, ChoiceLabel, ChoiceSupport, useChoiceIds} from './choice-support.js';
import type {CheckboxProps} from './choice-types.js';

export function Checkbox({
  defaultSelected,
  description,
  reserveSupportSpace = true,
  errorMessage,
  form,
  isDisabled = false,
  isIndeterminate = false,
  isInvalid = false,
  isReadOnly = false,
  isRequired = false,
  isSelected,
  label,
  name,
  onChange,
  validationBehavior = 'aria',
  value,
}: CheckboxProps): ReactElement {
  const ids = useChoiceIds(Boolean(description), isInvalid && Boolean(errorMessage));

  return (
    <AriaCheckboxField
      aria-labelledby={ids.labelId}
      data-disabled={isDisabled || undefined}
      data-invalid={isInvalid || undefined}
      data-readonly={isReadOnly || undefined}
      data-wcl-choice-field=""
      data-wcl-checkbox=""
      isDisabled={isDisabled}
      isIndeterminate={isIndeterminate}
      isInvalid={isInvalid}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      validationBehavior={validationBehavior}
      {...(ids.describedBy === undefined ? {} : {'aria-describedby': ids.describedBy})}
      {...(form === undefined ? {} : {form})}
      {...(name === undefined ? {} : {name})}
      {...(value === undefined ? {} : {value})}
      {...(defaultSelected === undefined ? {} : {defaultSelected})}
      {...(isSelected === undefined ? {} : {isSelected})}
      {...(onChange === undefined ? {} : {onChange})}
    >
      <AriaCheckboxButton data-wcl-choice-control="">
        <ChoiceIndicator kind="checkbox" />
        <ChoiceLabel id={ids.labelId} isRequired={isRequired}>
          {label}
        </ChoiceLabel>
      </AriaCheckboxButton>
      <ChoiceSupport
        reserveSupportSpace={reserveSupportSpace}
        description={description}
        descriptionId={ids.descriptionId}
        errorId={ids.errorId}
        errorMessage={errorMessage}
        isInvalid={isInvalid}
      />
    </AriaCheckboxField>
  );
}
