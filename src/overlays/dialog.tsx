'use client';

import type {ReactElement} from 'react';

import {OverlayFrame} from './overlay-frame.js';
import type {DialogProps} from './overlay-types.js';

export function Dialog({
  actions,
  children,
  closeLabel,
  description,
  title,
  trigger,
  ...state
}: DialogProps): ReactElement {
  return (
    <OverlayFrame
      closeLabel={closeLabel}
      description={description}
      kind="dialog"
      state={state}
      title={title}
      trigger={trigger}
      {...(actions === undefined ? {} : {actions})}
    >
      {children}
    </OverlayFrame>
  );
}
