'use client';

import {Button as AriaButton} from 'react-aria-components/Button';
import {Tooltip, TooltipTrigger} from 'react-aria-components/Tooltip';
import type {ReactElement} from 'react';

import {useActionPartRef} from './action-children.js';
import type {ActionChildrenProps, ActionSize, ActionStateProps} from './action-types.js';

export type IconButtonVariant = 'secondary' | 'quiet' | 'danger';

export interface IconButtonProps extends ActionChildrenProps, ActionStateProps {
  readonly label: string;
  readonly size?: ActionSize;
  readonly variant?: IconButtonVariant;
}

export function IconButton({
  children,
  isDisabled = false,
  label,
  onPress,
  size = 'regular',
  variant = 'secondary',
}: IconButtonProps): ReactElement {
  const actionRef = useActionPartRef<HTMLButtonElement>('icon-button');

  return (
    <TooltipTrigger closeDelay={100} delay={500}>
      <AriaButton
        aria-label={label}
        data-wcl-icon-button=""
        data-size={size}
        data-variant={variant}
        isDisabled={isDisabled}
        ref={actionRef}
        type="button"
        {...(onPress === undefined ? {} : {onPress})}
      >
        {children}
      </AriaButton>
      <Tooltip data-wcl-action-tooltip="" offset={8} placement="top">
        {label}
      </Tooltip>
    </TooltipTrigger>
  );
}
