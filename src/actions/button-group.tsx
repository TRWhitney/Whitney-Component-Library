'use client';

import {Group as AriaGroup} from 'react-aria-components/Group';
import type {ReactElement, ReactNode} from 'react';

import {useRenderedActionValidation, type ActionPartKind} from './action-children.js';
import type {ActionOrientation} from './action-types.js';

export interface ButtonGroupProps {
  readonly children: ReactNode;
  readonly equalItems?: boolean;
  readonly label: string;
  readonly orientation?: ActionOrientation;
}

const BUTTON_GROUP_ACTION_KINDS = [
  'button',
  'icon-button',
] as const satisfies readonly ActionPartKind[];

export function ButtonGroup({
  children,
  equalItems = false,
  label,
  orientation = 'horizontal',
}: ButtonGroupProps): ReactElement {
  const {setRootRef} = useRenderedActionValidation<HTMLDivElement>(
    BUTTON_GROUP_ACTION_KINDS,
    'ButtonGroup',
    'Button or IconButton',
  );

  return (
    <AriaGroup
      aria-label={label}
      data-wcl-button-group=""
      data-equal-items={String(equalItems)}
      data-orientation={orientation}
      ref={setRootRef}
    >
      {children}
    </AriaGroup>
  );
}
