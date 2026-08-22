'use client';

import {Button as AriaButton} from 'react-aria-components/Button';
import {Text as AriaText} from 'react-aria-components/Text';
import {
  UNSTABLE_Toast,
  UNSTABLE_ToastContent,
  UNSTABLE_ToastQueue,
  UNSTABLE_ToastRegion,
  type QueuedToast,
} from 'react-aria-components/Toast';
import {useMemo, type KeyboardEvent, type ReactElement} from 'react';

import {ToneGlyph} from './feedback-support.js';
import type {
  NotificationControls,
  NotificationInput,
  NotificationProviderProps,
} from './feedback-types.js';

const DEFAULT_NOTIFICATION_TIMEOUT = 6000;
const MIN_NOTIFICATION_TIMEOUT = 4000;
const MAX_NOTIFICATION_TIMEOUT = 30_000;

function notificationTimeout(timeout: number | null | undefined): number | undefined {
  if (timeout === null) return undefined;
  const resolvedTimeout = timeout ?? DEFAULT_NOTIFICATION_TIMEOUT;
  if (
    !Number.isFinite(resolvedTimeout) ||
    resolvedTimeout < MIN_NOTIFICATION_TIMEOUT ||
    resolvedTimeout > MAX_NOTIFICATION_TIMEOUT
  ) {
    throw new RangeError(
      `Notification timeout must be between ${MIN_NOTIFICATION_TIMEOUT} and ${MAX_NOTIFICATION_TIMEOUT} milliseconds, or null.`,
    );
  }
  return resolvedTimeout;
}

function NotificationItem({
  dismissLabel,
  queue,
  toast,
}: {
  readonly dismissLabel: string;
  readonly queue: UNSTABLE_ToastQueue<NotificationInput>;
  readonly toast: QueuedToast<NotificationInput>;
}): ReactElement {
  const {description, title, tone, urgency = 'polite'} = toast.content;
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    queue.close(toast.key);
  };

  return (
    <div data-wcl-notification-item="" onKeyDown={handleKeyDown}>
      <UNSTABLE_Toast data-tone={tone} data-wcl-notification="" toast={toast}>
        <UNSTABLE_ToastContent
          aria-atomic="true"
          aria-live={urgency}
          data-urgency={urgency}
          data-wcl-notification-content=""
          role={urgency === 'assertive' ? 'alert' : 'status'}
        >
          <ToneGlyph tone={tone} />
          <span data-wcl-notification-copy="">
            <AriaText data-wcl-notification-title="" slot="title">
              {title}
            </AriaText>
            {description === undefined ? null : (
              <AriaText data-wcl-notification-description="" slot="description">
                {description}
              </AriaText>
            )}
          </span>
          <AriaButton aria-label={dismissLabel} data-wcl-notification-dismiss="" slot="close">
            <svg aria-hidden="true" viewBox="0 0 16 16">
              <path d="m4.5 4.5 7 7M11.5 4.5l-7 7" />
            </svg>
          </AriaButton>
        </UNSTABLE_ToastContent>
      </UNSTABLE_Toast>
    </div>
  );
}

export function NotificationProvider({
  children,
  dismissLabel,
  label,
  maxVisible = 3,
  placement = 'bottom-end',
}: NotificationProviderProps): ReactElement {
  if (maxVisible !== 1 && maxVisible !== 2 && maxVisible !== 3) {
    throw new RangeError('NotificationProvider maxVisible must be one, two, or three.');
  }
  const queue = useMemo(
    () => new UNSTABLE_ToastQueue<NotificationInput>({maxVisibleToasts: maxVisible}),
    [maxVisible],
  );
  const controls = useMemo<NotificationControls>(
    () => ({
      dismiss: (key) => queue.close(key),
      notify: (notification) => {
        const onDismiss = notification.onDismiss;
        const timeout = notificationTimeout(notification.timeout);
        return queue.add(notification, {
          ...(onDismiss === undefined ? {} : {onClose: () => queueMicrotask(onDismiss)}),
          ...(timeout === undefined ? {} : {timeout}),
        });
      },
    }),
    [queue],
  );

  return (
    <>
      {children(controls)}
      <UNSTABLE_ToastRegion
        aria-label={label}
        data-placement={placement}
        data-wcl-notification-region=""
        queue={queue}
      >
        {({toast}) => <NotificationItem dismissLabel={dismissLabel} queue={queue} toast={toast} />}
      </UNSTABLE_ToastRegion>
    </>
  );
}
