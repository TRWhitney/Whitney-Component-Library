'use client';

import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
} from 'react-aria-components/Dialog';
import {Popover as AriaPopover} from 'react-aria-components/Popover';
import {useId, useState, type ReactElement} from 'react';

import {
  AnchorArrow,
  AnchoredOverlayDirectionProvider,
  anchoredOverlayPositionProps,
  anchoredPlacement,
} from './anchored-overlay.js';
import {
  OverlayTriggerBoundary,
  TaskOverlayContent,
  type OverlayDirection,
} from './overlay-frame.js';
import type {PopoverProps} from './overlay-types.js';

export function Popover({
  actions,
  alignment = 'start',
  children,
  closeLabel,
  description,
  placement = 'bottom',
  title,
  trigger,
  ...state
}: PopoverProps): ReactElement {
  const titleId = useId();
  const descriptionId = useId();
  const [direction, setDirection] = useState<OverlayDirection>();

  return (
    <AnchoredOverlayDirectionProvider direction={direction}>
      <AriaDialogTrigger {...state}>
        <OverlayTriggerBoundary kind="popover" onDirectionChange={setDirection}>
          {trigger}
        </OverlayTriggerBoundary>
        <AriaPopover
          {...anchoredOverlayPositionProps}
          data-wcl-popover=""
          dir={direction}
          offset={8}
          placement={anchoredPlacement(placement, alignment)}
        >
          <AnchorArrow />
          <AriaDialog
            aria-describedby={descriptionId}
            aria-labelledby={titleId}
            data-wcl-popover-dialog=""
          >
            {({close}) => (
              <TaskOverlayContent
                close={close}
                closeLabel={closeLabel}
                description={description}
                descriptionId={descriptionId}
                title={title}
                titleId={titleId}
                {...(actions === undefined ? {} : {actions})}
              >
                {children}
              </TaskOverlayContent>
            )}
          </AriaDialog>
        </AriaPopover>
      </AriaDialogTrigger>
    </AnchoredOverlayDirectionProvider>
  );
}
