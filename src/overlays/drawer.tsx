'use client';

import {
  FocusScope,
  OverlayContainer,
  mergeProps,
  useDialog,
  useModalOverlay,
  useOverlayTrigger,
} from 'react-aria';
import {ButtonContext} from 'react-aria-components/Button';
import {useOverlayTriggerState} from 'react-stately';
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

import {
  OverlayFrame,
  OverlayTriggerBoundary,
  TaskOverlayContent,
  type OverlayDirection,
} from './overlay-frame.js';
import type {
  DrawerPlacement,
  DrawerProps,
  OverlayControls,
  OverlayOpenStateProps,
} from './overlay-types.js';

type PhysicalDrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

interface DrawerDrag {
  readonly moved: boolean;
  readonly pointerId: number;
  readonly startProgress: number;
  readonly startX: number;
  readonly startY: number;
  readonly startedAt: number;
}

interface DockedDrawerProps {
  readonly actions?: (controls: OverlayControls) => ReactNode;
  readonly children: ReactNode;
  readonly closeLabel: string;
  readonly description: string;
  readonly dockedPreview?: ReactNode;
  readonly dragHandleLabel?: string;
  readonly placement: DrawerPlacement;
  readonly state: OverlayOpenStateProps;
  readonly title: string;
  readonly trigger: ReactElement;
}

type DrawerMotionStyles = CSSProperties & {
  readonly '--wcl-drawer-preview-extent': string;
  readonly '--wcl-drawer-preview-scale': number;
  readonly '--wcl-drawer-translate-x': string;
  readonly '--wcl-drawer-translate-y': string;
};

const DRAG_OPEN_THRESHOLD = 0.42;
const DRAG_OPEN_VELOCITY = 0.5;
const FALLBACK_BLOCK_EXTENT = 352;
const FALLBACK_INLINE_EXTENT = 448;
const PREVIEW_BLOCK_EXTENT = 70;
const PREVIEW_INLINE_EXTENT = 88;
const SEAM_EXTENT = 2;

function clamp(value: number, minimum = 0, maximum = 1): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function physicalPlacement(
  placement: DrawerPlacement,
  direction: OverlayDirection,
): PhysicalDrawerPlacement {
  if (placement === 'top' || placement === 'bottom') return placement;
  if (placement === 'start') return direction === 'rtl' ? 'right' : 'left';
  return direction === 'rtl' ? 'left' : 'right';
}

function isInlineDrawer(placement: PhysicalDrawerPlacement): boolean {
  return placement === 'left' || placement === 'right';
}

function towardOpenDistance(
  placement: PhysicalDrawerPlacement,
  deltaX: number,
  deltaY: number,
): number {
  if (placement === 'left') return deltaX;
  if (placement === 'right') return -deltaX;
  if (placement === 'top') return deltaY;
  return -deltaY;
}

function DrawerGrip(): ReactElement {
  return (
    <svg data-wcl-drawer-grip-curve="" viewBox="0 0 64 18" aria-hidden="true">
      <path
        data-wcl-drawer-grip-fill=""
        d="M0 0h64v1h-4c-4 0-6 2-7 5l-3 7c-1 3-2 4-5 4H19c-3 0-4-1-5-4l-3-7c-1-3-3-5-7-5H0Z"
      />
      <path
        data-wcl-drawer-grip-outline=""
        d="M0 1h4c4 0 6 2 7 5l3 7c1 3 2 4 5 4h26c3 0 4-1 5-4l3-7c1-3 3-5 7-5h4"
      />
      <path data-wcl-drawer-grip-marks="" d="M27 11v3m5-2v3m5-4v3" />
    </svg>
  );
}

function DockedDrawer({
  actions,
  children,
  closeLabel,
  description,
  dockedPreview,
  dragHandleLabel,
  placement,
  state: openState,
  title,
  trigger,
}: DockedDrawerProps): ReactElement {
  const state = useOverlayTriggerState(openState);
  const titleId = useId();
  const descriptionId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const progressRef = useRef(state.isOpen ? 1 : 0);
  const suppressClickRef = useRef(false);
  const [direction, setDirection] = useState<OverlayDirection>('ltr');
  const [drag, setDrag] = useState<DrawerDrag | null>(null);
  const [extent, setExtent] = useState<number | null>(null);
  const [progress, setProgressState] = useState(state.isOpen ? 1 : 0);
  const resolvedPlacement = physicalPlacement(placement, direction);
  const isControlled = openState.isOpen !== undefined;
  const hasPreview = dockedPreview !== undefined;
  const previewExtent = isInlineDrawer(resolvedPlacement)
    ? PREVIEW_INLINE_EXTENT
    : PREVIEW_BLOCK_EXTENT;
  const visibleDockExtent = hasPreview ? previewExtent : SEAM_EXTENT;
  const drawerExtent =
    extent ?? (isInlineDrawer(resolvedPlacement) ? FALLBACK_INLINE_EXTENT : FALLBACK_BLOCK_EXTENT);
  const dockDistance = Math.max(1, drawerExtent - visibleDockExtent);
  const hiddenDistance = dockDistance * (1 - progress);
  const translateX =
    resolvedPlacement === 'left'
      ? -hiddenDistance
      : resolvedPlacement === 'right'
        ? hiddenDistance
        : 0;
  const translateY =
    resolvedPlacement === 'top'
      ? -hiddenDistance
      : resolvedPlacement === 'bottom'
        ? hiddenDistance
        : 0;
  const drawerStyles: DrawerMotionStyles = {
    '--wcl-drawer-preview-extent': `${previewExtent * (1 - progress)}px`,
    '--wcl-drawer-preview-scale': 1 - progress,
    '--wcl-drawer-translate-x': `${translateX}px`,
    '--wcl-drawer-translate-y': `${translateY}px`,
  };
  const {overlayProps, triggerProps} = useOverlayTrigger({type: 'dialog'}, state, triggerRef);
  const {dialogProps} = useDialog(
    {
      'aria-describedby': descriptionId,
      'aria-labelledby': titleId,
      role: 'dialog',
    },
    dialogRef,
  );
  const {modalProps, underlayProps} = useModalOverlay({isDismissable: true}, state, surfaceRef);

  const setProgress = useCallback((nextProgress: number) => {
    const next = clamp(nextProgress);
    progressRef.current = next;
    setProgressState(next);
  }, []);

  const settle = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen === state.isOpen) {
        setProgress(nextOpen ? 1 : 0);
        return;
      }
      state.setOpen(nextOpen);
      if (isControlled) setProgress(state.isOpen ? 1 : 0);
    },
    [isControlled, setProgress, state],
  );

  useLayoutEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;

    const measure = () => {
      const nextExtent = isInlineDrawer(resolvedPlacement)
        ? surface.offsetWidth
        : surface.offsetHeight;
      if (nextExtent > 0) setExtent(nextExtent);
    };
    measure();
    const ResizeObserverConstructor = surface.ownerDocument.defaultView?.ResizeObserver;
    if (!ResizeObserverConstructor) return;

    const observer = new ResizeObserverConstructor(measure);
    observer.observe(surface);
    return () => observer.disconnect();
  }, [resolvedPlacement]);

  useLayoutEffect(() => {
    const wasOpen = wasOpenRef.current;
    if (state.isOpen && !wasOpen) {
      restoreFocusRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setProgress(1);
      dialogRef.current
        ?.querySelector<HTMLElement>('[data-wcl-overlay-close]')
        ?.focus({preventScroll: true});
    } else if (!state.isOpen && wasOpen) {
      setProgress(0);
      const restoreTarget = restoreFocusRef.current;
      queueMicrotask(() => {
        if (restoreTarget?.isConnected) restoreTarget.focus({preventScroll: true});
      });
    }
    wasOpenRef.current = state.isOpen;
  }, [setProgress, state.isOpen]);

  useEffect(() => {
    if (!drag) return;

    const move = (event: PointerEvent) => {
      if (event.pointerId !== drag.pointerId) return;
      const distance = towardOpenDistance(
        resolvedPlacement,
        event.clientX - drag.startX,
        event.clientY - drag.startY,
      );
      if (!drag.moved && Math.abs(distance) > 4) {
        setDrag((current) => (current ? {...current, moved: true} : current));
      }
      setProgress(drag.startProgress + distance / dockDistance);
    };

    const finish = (event: PointerEvent) => {
      if (event.pointerId !== drag.pointerId) return;
      const distance = towardOpenDistance(
        resolvedPlacement,
        event.clientX - drag.startX,
        event.clientY - drag.startY,
      );
      const elapsed = Math.max(1, performance.now() - drag.startedAt);
      const finalProgress = clamp(drag.startProgress + distance / dockDistance);
      const shouldOpen =
        finalProgress >= DRAG_OPEN_THRESHOLD || distance / elapsed > DRAG_OPEN_VELOCITY;
      suppressClickRef.current = drag.moved || Math.abs(distance) > 4;
      setDrag(null);
      settle(shouldOpen);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', finish);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', finish);
    };
  }, [dockDistance, drag, resolvedPlacement, setProgress, settle]);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    const openKey = {
      bottom: 'ArrowUp',
      left: 'ArrowRight',
      right: 'ArrowLeft',
      top: 'ArrowDown',
    }[resolvedPlacement];
    const dockKey = {
      bottom: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
      top: 'ArrowUp',
    }[resolvedPlacement];

    if (event.key === openKey || event.key === dockKey) {
      event.preventDefault();
      const directionStep = event.key === openKey ? 1 : -1;
      const nextProgress = clamp(Math.round((progressRef.current + directionStep * 0.1) * 10) / 10);
      setProgress(nextProgress);
      if (nextProgress === 1) settle(true);
      if (nextProgress === 0) settle(false);
    } else if (event.key === 'Home') {
      event.preventDefault();
      settle(false);
    } else if (event.key === 'End') {
      event.preventDefault();
      settle(true);
    } else if (event.key === 'Escape' && !state.isOpen) {
      event.preventDefault();
      setProgress(0);
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDrag({
      moved: false,
      pointerId: event.pointerId,
      startProgress: progressRef.current,
      startX: event.clientX,
      startY: event.clientY,
      startedAt: performance.now(),
    });
  };

  const handleClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    settle(!state.isOpen);
  };

  const drawerPanel = (
    <section
      data-dragging={drag ? '' : undefined}
      data-open={state.isOpen ? '' : undefined}
      data-physical-placement={resolvedPlacement}
      data-placement={placement}
      data-wcl-drawer-panel=""
      style={drawerStyles}
    >
      <div {...(state.isOpen ? modalProps : {})} data-wcl-drawer-modal-root="" ref={surfaceRef}>
        <div
          aria-hidden={state.isOpen ? undefined : true}
          data-wcl-drawer-surface=""
          data-wcl-overlay-modal=""
          inert={state.isOpen ? undefined : true}
        >
          <div
            {...mergeProps(overlayProps, dialogProps)}
            data-wcl-overlay-dialog=""
            ref={dialogRef}
          >
            <TaskOverlayContent
              autoFocusClose={false}
              close={() => state.close()}
              closeLabel={closeLabel}
              description={description}
              descriptionId={descriptionId}
              title={title}
              titleId={titleId}
              {...(actions === undefined ? {} : {actions})}
            >
              {children}
            </TaskOverlayContent>
          </div>
          {hasPreview ? (
            <div aria-hidden="true" data-wcl-drawer-preview="">
              {dockedPreview}
            </div>
          ) : null}
        </div>
        {dragHandleLabel === undefined ? null : (
          <button
            aria-controls={overlayProps.id}
            aria-expanded={state.isOpen}
            aria-label={dragHandleLabel}
            data-wcl-drawer-handle=""
            onBlur={() => {
              if (!state.isOpen && !drag && progressRef.current > 0) setProgress(0);
            }}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            type="button"
          >
            <DrawerGrip />
          </button>
        )}
      </div>
    </section>
  );

  return (
    <>
      <ButtonContext.Provider value={{...triggerProps, isPressed: state.isOpen, ref: triggerRef}}>
        <OverlayTriggerBoundary kind="drawer" onDirectionChange={setDirection}>
          {trigger}
        </OverlayTriggerBoundary>
      </ButtonContext.Provider>
      <OverlayContainer>
        <div
          {...underlayProps}
          data-docked={state.isOpen ? undefined : ''}
          data-has-preview={hasPreview ? '' : undefined}
          data-kind="drawer"
          data-physical-placement={resolvedPlacement}
          data-placement={placement}
          data-wcl-drawer-dock=""
          data-wcl-overlay=""
          dir={direction}
          style={{backgroundColor: `rgb(0 0 0 / ${Math.max(0, progress - 0.08) * 0.58})`}}
        >
          <FocusScope contain={state.isOpen}>{drawerPanel}</FocusScope>
        </div>
      </OverlayContainer>
    </>
  );
}

export function Drawer({
  actions,
  children,
  closeLabel,
  description,
  dockedPreview,
  dragHandleLabel,
  placement = 'end',
  title,
  trigger,
  ...state
}: DrawerProps): ReactElement {
  if (dockedPreview !== undefined || dragHandleLabel !== undefined) {
    return (
      <DockedDrawer
        closeLabel={closeLabel}
        description={description}
        placement={placement}
        state={state}
        title={title}
        trigger={trigger}
        {...(actions === undefined ? {} : {actions})}
        {...(dockedPreview === undefined ? {} : {dockedPreview})}
        {...(dragHandleLabel === undefined ? {} : {dragHandleLabel})}
      >
        {children}
      </DockedDrawer>
    );
  }

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
