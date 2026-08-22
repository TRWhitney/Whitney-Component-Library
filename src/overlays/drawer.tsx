'use client';

import type {ReactElement} from 'react';

import {OverlayFrame} from './overlay-frame.js';
import type {DrawerProps} from './overlay-types.js';

export function Drawer({
  actions,
  children,
  closeLabel,
  description,
  placement = 'end',
  title,
  trigger,
  ...state
}: DrawerProps): ReactElement {
  return (
    <OverlayFrame
      closeLabel={closeLabel}
      description={description}
      kind="drawer"
      placement={placement}
      state={state}
      title={title}
      trigger={trigger}
      {...(actions === undefined ? {} : {actions})}
    >
      {children}
    </OverlayFrame>
  );
}
