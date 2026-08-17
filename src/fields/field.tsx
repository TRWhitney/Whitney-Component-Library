'use client';

import {useField} from 'react-aria/useField';
import type {KeyboardEvent, ReactElement, SyntheticEvent} from 'react';

import {useFieldControlValidation} from './field-control-validation.js';
import {useFieldGroupDisabled} from './field-group-context.js';
import type {FieldControlProps, FieldProps} from './field-types.js';

export function Field({
  children,
  description,
  errorMessage,
  isDisabled = false,
  isInvalid = false,
  isPending = false,
  isReadOnly = false,
  isRequired = false,
  label,
  pendingMessage,
}: FieldProps): ReactElement {
  const inheritedDisabled = useFieldGroupDisabled();
  const disabled = inheritedDisabled || isDisabled;
  const {descriptionProps, errorMessageProps, fieldProps, labelProps} = useField({
    description,
    errorMessage,
    isInvalid,
    label,
  });
  const controlProps: FieldControlProps = {
    ...fieldProps,
    ...(isPending ? {'aria-busy': true} : {}),
    ...(isInvalid ? {'aria-invalid': true} : {}),
    ...(isRequired ? {'aria-required': true, required: true} : {}),
    ...(disabled ? {'aria-disabled': true, disabled: true, tabIndex: -1} : {}),
    ...(isReadOnly || isPending ? {'aria-readonly': true, readOnly: true} : {}),
  };
  const {controlShellRef} = useFieldControlValidation(controlProps);
  const stopDisabledInteraction = (event: SyntheticEvent) => {
    if (!disabled) return;
    event.preventDefault();
    event.stopPropagation();
  };
  const stopDisabledKeyboardActivation = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') stopDisabledInteraction(event);
  };

  return (
    <div
      aria-busy={isPending || undefined}
      data-disabled={disabled || undefined}
      data-invalid={isInvalid || undefined}
      data-readonly={isReadOnly || isPending || undefined}
      data-required={isRequired || undefined}
      data-wcl-field=""
      {...(isPending ? {'data-wcl-pending': ''} : {})}
    >
      <label data-wcl-field-label="" {...labelProps}>
        {label}
        {isRequired ? (
          <span aria-hidden="true" data-wcl-field-required="">
            *
          </span>
        ) : null}
      </label>
      <div
        data-wcl-field-control=""
        onAuxClickCapture={stopDisabledInteraction}
        onClickCapture={stopDisabledInteraction}
        onDoubleClickCapture={stopDisabledInteraction}
        onKeyDownCapture={stopDisabledKeyboardActivation}
        onKeyPressCapture={stopDisabledKeyboardActivation}
        onKeyUpCapture={stopDisabledKeyboardActivation}
        onMouseDownCapture={stopDisabledInteraction}
        onMouseUpCapture={stopDisabledInteraction}
        onPointerDownCapture={stopDisabledInteraction}
        onPointerUpCapture={stopDisabledInteraction}
        onTouchEndCapture={stopDisabledInteraction}
        onTouchStartCapture={stopDisabledInteraction}
        ref={controlShellRef}
      >
        {children(controlProps)}
      </div>
      <div data-wcl-field-support="">
        {description ? (
          <span data-wcl-field-description="" {...descriptionProps}>
            {description}
          </span>
        ) : null}
        {isInvalid && errorMessage ? (
          <span data-wcl-field-error="" {...errorMessageProps}>
            {errorMessage}
          </span>
        ) : null}
        {isPending && pendingMessage ? (
          <span aria-atomic="true" aria-live="polite" data-wcl-field-pending="" role="status">
            {pendingMessage}
          </span>
        ) : null}
      </div>
    </div>
  );
}
