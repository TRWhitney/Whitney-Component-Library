'use client';

import type {ReactElement} from 'react';

import {OverlayFrame} from './overlay-frame.js';
import type {AlertDialogProps} from './overlay-types.js';

export function AlertDialog({
  actionKind,
  cancelLabel,
  confirmLabel,
  description,
  onConfirm,
  title,
  trigger,
  ...state
}: AlertDialogProps): ReactElement {
  return (
    <OverlayFrame
      actionKind={actionKind}
      cancelLabel={cancelLabel}
      confirmLabel={confirmLabel}
      description={description}
      kind="alert-dialog"
      onConfirm={onConfirm}
      state={state}
      title={title}
      trigger={trigger}
    />
  );
}
