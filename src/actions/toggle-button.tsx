'use client';

import {ToggleButton as AriaToggleButton} from 'react-aria-components/ToggleButton';
import {Tooltip, TooltipTrigger} from 'react-aria-components/Tooltip';
import type {ReactElement} from 'react';

import {useActionPartRef} from './action-children.js';
import type {ActionChildrenProps, ActionSize} from './action-types.js';

export type ToggleButtonVariant = 'secondary' | 'quiet';

interface ToggleButtonBaseProps extends ActionChildrenProps {
  /** Supplies the accessible name and tooltip for an icon-only toggle. */
  readonly label?: string;
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
  label,
  onChange,
  size = 'regular',
  variant = 'secondary',
}: ToggleButtonProps): ReactElement {
  const actionRef = useActionPartRef<HTMLButtonElement>('toggle-button');

  const button = (
    <AriaToggleButton
      {...(label === undefined ? {} : {'aria-label': label})}
      data-wcl-toggle-button=""
      data-icon-only={label === undefined ? undefined : ''}
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

  return label === undefined ? (
    button
  ) : (
    <TooltipTrigger closeDelay={100} delay={500}>
      {button}
      <Tooltip data-wcl-action-tooltip="" offset={8} placement="top">
        {label}
      </Tooltip>
    </TooltipTrigger>
  );
}
