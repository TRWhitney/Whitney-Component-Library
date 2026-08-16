'use client';

import {ToggleButton as AriaToggleButton} from 'react-aria-components/ToggleButton';
import type {ReactElement} from 'react';

import {useActionPartRef} from './action-children.js';
import type {ActionChildrenProps, ActionSize} from './action-types.js';

export type ToggleButtonVariant = 'secondary' | 'quiet';

interface ToggleButtonBaseProps extends ActionChildrenProps {
  readonly isDisabled?: boolean;
  readonly size?: ActionSize;
  readonly variant?: ToggleButtonVariant;
}

export type ToggleButtonProps = ToggleButtonBaseProps &
  (
    | {
        readonly defaultSelected?: boolean;
        readonly isSelected?: never;
        readonly onChange?: (isSelected: boolean) => void;
      }
    | {
        readonly defaultSelected?: never;
        readonly isSelected: boolean;
        readonly onChange: (isSelected: boolean) => void;
      }
  );

export function ToggleButton({
  children,
  defaultSelected,
  isDisabled = false,
  isSelected,
  onChange,
  size = 'regular',
  variant = 'secondary',
}: ToggleButtonProps): ReactElement {
  const actionRef = useActionPartRef<HTMLButtonElement>('toggle-button');

  return (
    <AriaToggleButton
      data-wcl-toggle-button=""
      data-size={size}
      data-variant={variant}
      isDisabled={isDisabled}
      ref={actionRef}
      {...(defaultSelected === undefined ? {} : {defaultSelected})}
      {...(isSelected === undefined ? {} : {isSelected})}
      {...(onChange === undefined ? {} : {onChange})}
    >
      {children}
    </AriaToggleButton>
  );
}
