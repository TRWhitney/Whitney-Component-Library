'use client';

import {useMenuTrigger} from 'react-aria/useMenu';
import {useMenuTriggerState} from 'react-stately/useMenuTriggerState';
import {OverlayTriggerStateContext} from 'react-aria-components/Dialog';
import {Menu as AriaMenu, RootMenuTriggerStateContext} from 'react-aria-components/Menu';
import {Popover as AriaPopover} from 'react-aria-components/Popover';
import {
  useLayoutEffect,
  useRef,
  useState,
  type DOMAttributes,
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
  triggerProps,
}: {
  readonly triggerProps: ReturnType<typeof useMenuTrigger>['menuTriggerProps'];
  readonly children: ReactNode;
  readonly targetLabel: string;
  readonly targetRef: RefObject<HTMLDivElement | null>;
}): ReactElement {
  // Context-menu trigger props are DOM handlers, including the platform touch fallback.
  // Keep them on the target itself so no trigger state is inherited by its children.
  const {onPointerDown, ...targetProps} = triggerProps as typeof triggerProps &
    DOMAttributes<HTMLDivElement>;

  return (
    <div
      {...targetProps}
      aria-label={targetLabel}
      data-wcl-context-menu-target=""
      onContextMenuCapture={() => targetRef.current?.focus({preventScroll: true})}
      onKeyDownCapture={(event) => {
        if (
          event.defaultPrevented ||
          !((event.key === 'F10' && event.shiftKey) || event.key === 'ContextMenu')
        )
          return;
        event.preventDefault();
        event.stopPropagation();
        if (event.repeat) return;
        const origin = event.target as HTMLElement;
        const rect = origin.getBoundingClientRect();
        origin.dispatchEvent(
          new MouseEvent('contextmenu', {
            bubbles: true,
            cancelable: true,
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2,
          }),
        );
      }}
      onPointerDown={(event) => {
        if (event.pointerType !== 'touch') onPointerDown?.(event);
      }}
      onPointerDownCapture={(event) => {
        if (event.pointerType === 'touch') onPointerDown?.(event);
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
  ...props
}: ContextMenuProps): ReactElement {
  const targetRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const state = useMenuTriggerState(props);
  const {menuTriggerProps, menuProps} = useMenuTrigger({trigger: 'contextMenu'}, state, targetRef);
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
      <ContextMenuTarget
        targetLabel={targetLabel}
        targetRef={targetRef}
        triggerProps={menuTriggerProps}
      >
        {children}
      </ContextMenuTarget>
      <RootMenuTriggerStateContext.Provider value={state}>
        <OverlayTriggerStateContext.Provider value={state}>
          <AriaPopover
            {...anchoredOverlayPositionProps}
            trigger="MenuTrigger"
            triggerRef={targetRef}
            scrollRef={scrollRef}
            offset={0}
            {...(menuProps['aria-labelledby'] === undefined
              ? {}
              : {'aria-labelledby': menuProps['aria-labelledby']})}
            data-context-menu=""
            data-wcl-menu-popover=""
            dir={direction}
          >
            <AnchorArrow />
            <AriaMenu {...menuProps} ref={scrollRef} data-wcl-menu="">
              {renderMenuItems(items, direction)}
            </AriaMenu>
          </AriaPopover>
        </OverlayTriggerStateContext.Provider>
      </RootMenuTriggerStateContext.Provider>
    </AnchoredOverlayDirectionProvider>
  );
}
