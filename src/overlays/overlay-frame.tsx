'use client';

import {Button as AriaButton} from 'react-aria-components/Button';
import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
} from 'react-aria-components/Dialog';
import {Modal as AriaModal, ModalOverlay as AriaModalOverlay} from 'react-aria-components/Modal';
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';

import {ActionPartRegistrationProvider, type ActionPartKind} from '../actions/action-children.js';
import type {
  AlertDialogActionKind,
  DrawerPlacement,
  OverlayControls,
  OverlayOpenStateProps,
} from './overlay-types.js';

const OVERLAY_TRIGGER_ACTIONS = ['button', 'icon-button'] as const;
const useIsomorphicLayoutEffect = typeof document === 'undefined' ? useEffect : useLayoutEffect;

type OverlayDirection = 'ltr' | 'rtl';

interface OverlayFrameBaseProps {
  readonly description: string;
  readonly state: OverlayOpenStateProps;
  readonly title: string;
  readonly trigger: ReactElement;
}

type OverlayFrameProps = OverlayFrameBaseProps &
  (
    | {
        readonly actionKind: AlertDialogActionKind;
        readonly cancelLabel: string;
        readonly confirmLabel: string;
        readonly kind: 'alert-dialog';
        readonly onConfirm: () => void;
      }
    | {
        readonly actions?: (controls: OverlayControls) => ReactNode;
        readonly children: ReactNode;
        readonly closeLabel: string;
        readonly kind: 'dialog';
      }
    | {
        readonly actions?: (controls: OverlayControls) => ReactNode;
        readonly children: ReactNode;
        readonly closeLabel: string;
        readonly kind: 'drawer';
        readonly placement: DrawerPlacement;
      }
  );

function overlayName(kind: OverlayFrameProps['kind']): string {
  if (kind === 'alert-dialog') return 'AlertDialog';
  return kind === 'dialog' ? 'Dialog' : 'Drawer';
}

function OverlayTriggerBoundary({
  children,
  kind,
  onDirectionChange,
}: {
  readonly children: ReactElement;
  readonly kind: OverlayFrameProps['kind'];
  readonly onDirectionChange: (direction: OverlayDirection) => void;
}): ReactElement {
  const registrations = useRef(new Map<HTMLElement, ActionPartKind>());
  const isMounted = useRef(false);
  const validationQueued = useRef(false);
  const [validationError, setValidationError] = useState<TypeError | null>(null);
  const validateRegistrations = useCallback(() => {
    const triggerActions = [...registrations.current].filter(([, partKind]) =>
      OVERLAY_TRIGGER_ACTIONS.includes(partKind as (typeof OVERLAY_TRIGGER_ACTIONS)[number]),
    );
    if (triggerActions.length !== 1) {
      setValidationError(
        (current) =>
          current ??
          new TypeError(
            `${overlayName(kind)} trigger must render exactly one Button or IconButton.`,
          ),
      );
      return;
    }

    const trigger = triggerActions[0]![0];
    const view = trigger.ownerDocument.defaultView;
    const scopedDirection = trigger.closest<HTMLElement>('[dir]')?.dir;
    onDirectionChange(
      scopedDirection === 'rtl' || scopedDirection === 'ltr'
        ? scopedDirection
        : view?.getComputedStyle(trigger).direction === 'rtl'
          ? 'rtl'
          : 'ltr',
    );
  }, [kind, onDirectionChange]);
  const registerActionPart = useCallback(
    (element: HTMLElement, partKind: ActionPartKind, isRegistered: boolean) => {
      if (isRegistered) registrations.current.set(element, partKind);
      else registrations.current.delete(element);
      if (validationQueued.current) return;

      validationQueued.current = true;
      queueMicrotask(() => {
        validationQueued.current = false;
        if (isMounted.current) validateRegistrations();
      });
    },
    [validateRegistrations],
  );

  useIsomorphicLayoutEffect(() => {
    isMounted.current = true;
    validateRegistrations();
    return () => {
      isMounted.current = false;
    };
  }, [validateRegistrations]);

  if (validationError) throw validationError;

  return (
    <ActionPartRegistrationProvider onRegistration={registerActionPart}>
      {children}
    </ActionPartRegistrationProvider>
  );
}

function CloseGlyph(): ReactElement {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path d="m4.5 4.5 7 7M11.5 4.5l-7 7" />
    </svg>
  );
}

function AlertActions({
  actionKind,
  cancelLabel,
  close,
  confirmLabel,
  onConfirm,
}: {
  readonly actionKind: AlertDialogActionKind;
  readonly cancelLabel: string;
  readonly close: () => void;
  readonly confirmLabel: string;
  readonly onConfirm: () => void;
}): ReactElement {
  return (
    <>
      <AriaButton
        autoFocus
        data-size="regular"
        data-variant="secondary"
        data-wcl-button=""
        onPress={close}
        type="button"
      >
        <span data-wcl-action-label="">{cancelLabel}</span>
      </AriaButton>
      <AriaButton
        data-size="regular"
        data-variant={actionKind === 'destructive' ? 'danger' : 'primary'}
        data-wcl-button=""
        onPress={() => {
          onConfirm();
          close();
        }}
        type="button"
      >
        <span data-wcl-action-label="">{confirmLabel}</span>
      </AriaButton>
    </>
  );
}

export function OverlayFrame(props: OverlayFrameProps): ReactElement {
  const titleId = useId();
  const descriptionId = useId();
  const [direction, setDirection] = useState<OverlayDirection>();
  const isAlert = props.kind === 'alert-dialog';

  return (
    <AriaDialogTrigger {...props.state}>
      <OverlayTriggerBoundary kind={props.kind} onDirectionChange={setDirection}>
        {props.trigger}
      </OverlayTriggerBoundary>
      <AriaModalOverlay
        data-action-kind={isAlert ? props.actionKind : undefined}
        data-kind={props.kind}
        data-placement={props.kind === 'drawer' ? props.placement : undefined}
        data-wcl-overlay=""
        dir={direction}
        isDismissable={!isAlert}
      >
        <AriaModal data-wcl-overlay-modal="">
          <AriaDialog
            aria-describedby={descriptionId}
            aria-labelledby={titleId}
            data-wcl-overlay-dialog=""
            role={isAlert ? 'alertdialog' : 'dialog'}
          >
            {({close}) => (
              <>
                <header data-wcl-overlay-header="">
                  <div data-wcl-overlay-heading="">
                    <h2 data-wcl-overlay-title="" id={titleId}>
                      {props.title}
                    </h2>
                    <p data-wcl-overlay-description="" id={descriptionId}>
                      {props.description}
                    </p>
                  </div>
                  {isAlert ? null : (
                    <AriaButton
                      aria-label={props.closeLabel}
                      autoFocus
                      data-wcl-overlay-close=""
                      onPress={close}
                      type="button"
                    >
                      <CloseGlyph />
                    </AriaButton>
                  )}
                </header>
                {isAlert ? null : <div data-wcl-overlay-body="">{props.children}</div>}
                {isAlert || props.actions !== undefined ? (
                  <footer data-wcl-overlay-actions="">
                    {isAlert ? (
                      <AlertActions
                        actionKind={props.actionKind}
                        cancelLabel={props.cancelLabel}
                        close={close}
                        confirmLabel={props.confirmLabel}
                        onConfirm={props.onConfirm}
                      />
                    ) : (
                      props.actions?.({close})
                    )}
                  </footer>
                ) : null}
              </>
            )}
          </AriaDialog>
        </AriaModal>
      </AriaModalOverlay>
    </AriaDialogTrigger>
  );
}
