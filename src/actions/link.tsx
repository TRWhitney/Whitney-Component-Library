'use client';

import {Link as AriaLink} from 'react-aria-components/Link';
import type {ReactElement} from 'react';

import type {ActionChildrenProps} from './action-types.js';

export type LinkCurrent = 'page' | 'step' | 'location' | 'date' | 'time';

export interface LinkProps extends ActionChildrenProps {
  readonly current?: LinkCurrent;
  readonly href: string;
  readonly isDisabled?: boolean;
  readonly newWindow?: boolean;
}

export function Link({
  children,
  current,
  href,
  isDisabled = false,
  newWindow = false,
}: LinkProps): ReactElement {
  return (
    <AriaLink
      data-wcl-link=""
      href={href}
      isDisabled={isDisabled}
      {...(current === undefined ? {} : {'aria-current': current})}
      {...(newWindow ? {rel: 'noopener noreferrer', target: '_blank'} : {})}
    >
      {children}
    </AriaLink>
  );
}
