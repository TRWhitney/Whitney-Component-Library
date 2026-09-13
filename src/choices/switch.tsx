'use client';

import {
  SwitchButton as AriaSwitchButton,
  SwitchField as AriaSwitchField,
} from 'react-aria-components/Switch';
import type {ReactElement} from 'react';

import {ChoiceLabel, ChoiceSupport, useChoiceIds} from './choice-support.js';
import type {SwitchProps} from './choice-types.js';

export function Switch({
  defaultSelected,
  description,
  reserveSupportSpace = true,
  form,
  isDisabled = false,
  isReadOnly = false,
  isSelected,
  label,
  name,
  onChange,
  value,
}: SwitchProps): ReactElement {
  const ids = useChoiceIds(Boolean(description), false);

  return (
    <AriaSwitchField
      aria-labelledby={ids.labelId}
      data-disabled={isDisabled || undefined}
      data-readonly={isReadOnly || undefined}
      data-wcl-choice-field=""
      data-wcl-switch-field=""
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      {...(ids.describedBy === undefined ? {} : {'aria-describedby': ids.describedBy})}
      {...(form === undefined ? {} : {form})}
      {...(name === undefined ? {} : {name})}
      {...(value === undefined ? {} : {value})}
      {...(defaultSelected === undefined ? {} : {defaultSelected})}
      {...(isSelected === undefined ? {} : {isSelected})}
      {...(onChange === undefined ? {} : {onChange})}
    >
      <AriaSwitchButton data-wcl-choice-control="" data-wcl-switch="">
        <span aria-hidden="true" data-wcl-switch-track="">
          <span data-wcl-switch-thumb="" />
        </span>
        <ChoiceLabel id={ids.labelId} isRequired={false}>
          {label}
        </ChoiceLabel>
      </AriaSwitchButton>
      <ChoiceSupport
        reserveSupportSpace={reserveSupportSpace}
        description={description}
        descriptionId={ids.descriptionId}
        errorId={ids.errorId}
        isInvalid={false}
      />
    </AriaSwitchField>
  );
}
