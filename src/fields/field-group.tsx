'use client';

import {useId, type ReactElement} from 'react';

import {FieldGroupDisabledContext, useFieldGroupDisabled} from './field-group-context.js';
import type {FieldGroupProps} from './field-types.js';

export function FieldGroup({
  children,
  columns = 'responsive',
  description,
  isDisabled = false,
  legend,
}: FieldGroupProps): ReactElement {
  const descriptionId = `wcl-field-group-${useId().replaceAll(':', '')}`;
  const inheritedDisabled = useFieldGroupDisabled();
  const disabled = inheritedDisabled || isDisabled;

  return (
    <fieldset
      aria-describedby={description ? descriptionId : undefined}
      aria-disabled={disabled || undefined}
      data-columns={columns}
      data-disabled={disabled || undefined}
      data-wcl-field-group=""
      disabled={disabled}
    >
      <legend data-wcl-field-group-legend="">{legend}</legend>
      {description ? (
        <p data-wcl-field-group-description="" id={descriptionId}>
          {description}
        </p>
      ) : null}
      <div data-wcl-field-group-content="">
        <FieldGroupDisabledContext.Provider value={disabled}>
          {children}
        </FieldGroupDisabledContext.Provider>
      </div>
    </fieldset>
  );
}
