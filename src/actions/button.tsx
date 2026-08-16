'use client';

import {Button as AriaButton} from 'react-aria-components/Button';
import {useId, type ReactElement} from 'react';

import {useActionPartRef} from './action-children.js';
import type {ActionChildrenProps, ActionSize} from './action-types.js';

export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'danger';
export type ButtonType = 'button' | 'submit' | 'reset';

interface ButtonBaseProps extends ActionChildrenProps {
  readonly form?: string;
  readonly formNoValidate?: boolean;
  readonly name?: string;
  readonly onPress?: () => void;
  readonly size?: ActionSize;
  readonly type?: ButtonType;
  readonly value?: string;
  readonly variant?: ButtonVariant;
}

export type ButtonProps = ButtonBaseProps &
  (
    | {
        readonly isDisabled?: boolean;
        readonly isPending?: false;
        readonly pendingLabel?: never;
      }
    | {
        readonly isDisabled?: false;
        readonly isPending: boolean;
        readonly pendingLabel: string;
      }
  );

export function Button({
  children,
  form,
  formNoValidate,
  isDisabled = false,
  isPending = false,
  name,
  onPress,
  pendingLabel,
  size = 'regular',
  type = 'button',
  value,
  variant = 'secondary',
}: ButtonProps): ReactElement {
  const labelId = useId();
  const pendingDescriptionId = useId();
  const actionRef = useActionPartRef<HTMLButtonElement>('button');
  const supportRef = useActionPartRef<HTMLSpanElement>('support');

  const hasPendingStatus = pendingLabel !== undefined;

  return (
    <>
      <AriaButton
        aria-labelledby={labelId}
        data-wcl-button=""
        data-size={size}
        data-variant={variant}
        isDisabled={isDisabled}
        isPending={isPending}
        ref={actionRef}
        type={type}
        {...(form === undefined ? {} : {form})}
        {...(formNoValidate === undefined ? {} : {formNoValidate})}
        {...(name === undefined ? {} : {name})}
        {...(onPress === undefined ? {} : {onPress})}
        {...(value === undefined ? {} : {value})}
        {...(hasPendingStatus ? {'aria-describedby': pendingDescriptionId} : {})}
      >
        <span data-wcl-action-label="" id={labelId}>
          {children}
        </span>
      </AriaButton>
      {hasPendingStatus ? (
        <span
          aria-atomic="true"
          aria-live="polite"
          data-wcl-action-support=""
          data-wcl-visually-hidden=""
          id={pendingDescriptionId}
          ref={supportRef}
          role="status"
        >
          {isPending ? pendingLabel : ''}
        </span>
      ) : null}
    </>
  );
}
