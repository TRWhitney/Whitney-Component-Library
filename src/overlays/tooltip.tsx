'use client';

import {
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
} from 'react-aria-components/Tooltip';
import {useState, type ReactElement} from 'react';

import {
  AnchorArrow,
  AnchoredOverlayDirectionProvider,
  anchoredOverlayPositionProps,
  anchoredPlacement,
} from './anchored-overlay.js';
import {OverlayTriggerBoundary, type OverlayDirection} from './overlay-frame.js';
import type {TooltipProps} from './overlay-types.js';

export function Tooltip({
  alignment = 'center',
  children,
  content,
  placement = 'top',
}: TooltipProps): ReactElement {
  const [direction, setDirection] = useState<OverlayDirection>();

  return (
    <AnchoredOverlayDirectionProvider direction={direction}>
      <AriaTooltipTrigger closeDelay={100} delay={500}>
        <OverlayTriggerBoundary kind="tooltip" onDirectionChange={setDirection}>
          {children}
        </OverlayTriggerBoundary>
        <AriaTooltip
          {...anchoredOverlayPositionProps}
          data-wcl-tooltip=""
          dir={direction}
          offset={8}
          placement={anchoredPlacement(placement, alignment)}
        >
          <AnchorArrow />
          <span data-wcl-tooltip-content="">{content}</span>
        </AriaTooltip>
      </AriaTooltipTrigger>
    </AnchoredOverlayDirectionProvider>
  );
}
