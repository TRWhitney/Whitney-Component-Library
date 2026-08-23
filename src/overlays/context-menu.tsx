'use client';

import {usePress} from 'react-aria/usePress';
import {Menu as AriaMenu, MenuTrigger as AriaMenuTrigger} from 'react-aria-components/Menu';
import {Popover as AriaPopover} from 'react-aria-components/Popover';
import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react';

import {
  AnchorArrow,
  AnchoredOverlayDirectionProvider,
  anchoredOverlayPositionProps,
} from './anchored-overlay.js';
import {renderMenuItems} from './menu.js';
import type {OverlayDirection} from './overlay-frame.js';
import type {ContextMenuProps} from './overlay-types.js';

function ContextMenuTarget({
  children,
  targetLabel,
  targetRef,
}: {
  readonly children: ReactNode;
  readonly targetLabel: string;
  readonly targetRef: RefObject<HTMLDivElement | null>;
}): ReactElement {
  const {pressProps} = usePress({ref: targetRef});

  return (
    <div
      {...pressProps}
      aria-label={targetLabel}
      data-wcl-context-menu-target=""
      onContextMenuCapture={() => targetRef.current?.focus({preventScroll: true})}
      onPointerDownCapture={(event) => {
        if (event.pointerType === 'touch' || event.button === 2) {
          targetRef.current?.focus({preventScroll: true});
        }
      }}
      ref={targetRef}
      role="group"
      tabIndex={0}
    >
      {children}
    </div>
  );
}

export function ContextMenu({
  children,
  items,
  targetLabel,
  ...state
}: ContextMenuProps): ReactElement {
  const targetRef = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<OverlayDirection>();

  useLayoutEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    const scopedDirection = target.closest<HTMLElement>('[dir]')?.dir;
    setDirection(
      scopedDirection === 'rtl' || scopedDirection === 'ltr'
        ? scopedDirection
        : target.ownerDocument.defaultView?.getComputedStyle(target).direction === 'rtl'
          ? 'rtl'
          : 'ltr',
    );
  }, []);

  return (
    <AnchoredOverlayDirectionProvider direction={direction}>
      <AriaMenuTrigger trigger="contextMenu" {...state}>
        <ContextMenuTarget targetLabel={targetLabel} targetRef={targetRef}>
          {children}
        </ContextMenuTarget>
        <AriaPopover
          {...anchoredOverlayPositionProps}
          data-context-menu=""
          data-wcl-menu-popover=""
          dir={direction}
        >
          <AnchorArrow />
          <AriaMenu data-wcl-menu="">{renderMenuItems(items, direction)}</AriaMenu>
        </AriaPopover>
      </AriaMenuTrigger>
    </AnchoredOverlayDirectionProvider>
  );
}
