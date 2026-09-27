'use client';

// Research-only replacement for dist/overlays/dialog.js in the temporary package.
import {Dialog as AriaDialog} from 'react-aria-components/Dialog';
import {Modal as AriaModal, ModalOverlay as AriaModalOverlay} from 'react-aria-components/Modal';
import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  type ReactElement,
  type RefObject,
} from 'react';

import {OverlayFrame, TaskOverlayContent} from './overlay-frame.js';
import type {DialogProps as TriggeredDialogProps} from './overlay-types.js';

export type ControlledDialogProps = Omit<
  TriggeredDialogProps,
  'trigger' | 'defaultOpen' | 'isOpen' | 'onOpenChange'
> & {
  readonly trigger?: never;
  readonly defaultOpen?: never;
  readonly isOpen: boolean;
  readonly onOpenChange: (isOpen: boolean) => void;
  readonly returnFocusRef: RefObject<HTMLElement | null>;
};

export type DialogProps = TriggeredDialogProps | ControlledDialogProps;

function ControlledDialog(props: ControlledDialogProps): ReactElement {
  const titleId = useId();
  const descriptionId = useId();
  const overlay = useRef<HTMLDivElement | null>(null);
  const returnFocusRef = useRef(props.returnFocusRef);
  useLayoutEffect(() => {
    returnFocusRef.current = props.returnFocusRef;
  }, [props.returnFocusRef]);

  const trackOverlay = useCallback((node: HTMLDivElement | null) => {
    const previous = overlay.current;
    overlay.current = node;
    if (node || !previous) return;

    // Ref detachment precedes DOM removal. Wait until that commit finishes, including
    // React Aria's focus containment cleanup, and resolve the consumer's current ref.
    // React Aria's later restoration RAF does nothing when focus has already moved.
    queueMicrotask(() => {
      if (overlay.current || previous.isConnected) return;
      const target = returnFocusRef.current.current;
      if (target?.isConnected) target.focus({preventScroll: true});
      // A missing or unfocusable target leaves React Aria's original-opener fallback.
    });
  }, []);

  return (
    <AriaModalOverlay
      data-kind="dialog"
      data-wcl-overlay=""
      isDismissable
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
      ref={trackOverlay}
    >
      <AriaModal data-wcl-overlay-modal="">
        <AriaDialog
          aria-describedby={descriptionId}
          aria-labelledby={titleId}
          data-wcl-overlay-dialog=""
          role="dialog"
        >
          {({close}) => (
            <TaskOverlayContent
              close={close}
              closeLabel={props.closeLabel}
              description={props.description}
              descriptionId={descriptionId}
              title={props.title}
              titleId={titleId}
              {...(props.actions === undefined ? {} : {actions: props.actions})}
            >
              {props.children}
            </TaskOverlayContent>
          )}
        </AriaDialog>
      </AriaModal>
    </AriaModalOverlay>
  );
}

export function Dialog(props: DialogProps): ReactElement {
  if (props.trigger === undefined) return <ControlledDialog {...props} />;

  const {actions, children, closeLabel, description, title, trigger, ...state} = props;
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
