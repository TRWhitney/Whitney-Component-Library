'use client';

import {Button as AriaButton} from 'react-aria-components/Button';
import {Text as AriaText} from 'react-aria-components/Text';
import {
  UNSTABLE_Toast,
  UNSTABLE_ToastContent,
  UNSTABLE_ToastList,
  UNSTABLE_ToastQueue,
  UNSTABLE_ToastRegion,
  type QueuedToast,
} from 'react-aria-components/Toast';
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type ReactElement,
} from 'react';

import {useScrollbarActivity} from '../scrollbar-activity.js';
import {ToneGlyph} from './feedback-support.js';
import type {
  NotificationControls,
  NotificationInput,
  NotificationProviderProps,
  NotificationTone,
} from './feedback-types.js';

const DEFAULT_NOTIFICATION_TIMEOUT = 6000;
const MIN_NOTIFICATION_TIMEOUT = 4000;
const MAX_NOTIFICATION_TIMEOUT = 30_000;
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

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
  getIsRegionPaused,
  queue,
  toast,
}: {
  readonly dismissLabel: string;
  readonly getIsRegionPaused: () => boolean;
  readonly queue: UNSTABLE_ToastQueue<NotificationInput>;
  readonly toast: QueuedToast<NotificationInput>;
}): ReactElement {
  const {actionLabel, description, onAction, title, tone, urgency = 'polite'} = toast.content;
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    queue.close(toast.key);
  };
  const handleAction = () => {
    onAction?.();
    queue.close(toast.key);
  };
  const glyphTone = notificationGlyphTone(tone);
  const timerStyle =
    toast.timeout === undefined
      ? undefined
      : ({'--wcl-notification-timeout': `${toast.timeout}ms`} as CSSProperties);

  useEffect(() => {
    if (getIsRegionPaused()) queue.pauseAll();
  }, [getIsRegionPaused, queue, toast.key]);

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
          <ToneGlyph tone={glyphTone} />
          <span data-wcl-notification-copy="">
            <AriaText data-wcl-notification-title="" slot="title">
              {title}
            </AriaText>
            {description === undefined ? null : (
              <AriaText data-wcl-notification-description="" slot="description">
                {description}
              </AriaText>
            )}
            {actionLabel === undefined ? null : (
              <AriaButton data-wcl-notification-action="" onPress={handleAction}>
                {actionLabel}
              </AriaButton>
            )}
          </span>
          <AriaButton aria-label={dismissLabel} data-wcl-notification-dismiss="" slot="close">
            <svg aria-hidden="true" viewBox="0 0 16 16">
              <path d="m4.5 4.5 7 7M11.5 4.5l-7 7" />
            </svg>
          </AriaButton>
        </UNSTABLE_ToastContent>
        {timerStyle === undefined ? null : (
          <span aria-hidden="true" data-wcl-notification-timer="" style={timerStyle} />
        )}
      </UNSTABLE_Toast>
    </div>
  );
}

function notificationGlyphTone(
  tone: NotificationTone,
): 'neutral' | 'success' | 'warning' | 'danger' {
  if (tone === 'success') return 'success';
  if (tone === 'warning') return 'warning';
  if (tone === 'error') return 'danger';
  return 'neutral';
}

function useNotificationListCap(
  maxVisible: NotificationProviderProps['maxVisible'],
  notificationCount: number,
) {
  const listRef = useRef<HTMLDivElement>(null);

  useBrowserLayoutEffect(() => {
    const list = listRef.current;
    if (list === null) return;
    if (maxVisible === undefined) {
      list.style.removeProperty('--wcl-notification-list-cap');
      return;
    }

    const measure = () => {
      const cards = list.querySelectorAll<HTMLElement>('[data-wcl-notification]');
      const finalVisibleCard = cards[Math.min(maxVisible, cards.length) - 1];
      if (finalVisibleCard === undefined) {
        list.style.removeProperty('--wcl-notification-list-cap');
        return;
      }

      const listBounds = list.getBoundingClientRect();
      const cardBounds = finalVisibleCard.getBoundingClientRect();
      const capHeight = Math.ceil(cardBounds.bottom - listBounds.top + list.scrollTop);
      if (capHeight > 0) {
        const resolvedCap = `${capHeight}px`;
        if (list.style.getPropertyValue('--wcl-notification-list-cap') !== resolvedCap) {
          list.style.setProperty('--wcl-notification-list-cap', resolvedCap);
        }
      }
    };

    measure();
    window.addEventListener('resize', measure);
    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    for (const card of list.querySelectorAll<HTMLElement>('[data-wcl-notification]')) {
      resizeObserver?.observe(card);
    }

    return () => {
      window.removeEventListener('resize', measure);
      resizeObserver?.disconnect();
    };
  }, [maxVisible, notificationCount]);

  return listRef;
}

export function NotificationProvider({
  children,
  dismissLabel,
  label,
  maxVisible,
  placement = 'top-end',
}: NotificationProviderProps): ReactElement {
  if (maxVisible !== undefined && maxVisible !== 1 && maxVisible !== 2 && maxVisible !== 3) {
    throw new RangeError('NotificationProvider maxVisible must be one, two, or three.');
  }
  const queue = useMemo(() => new UNSTABLE_ToastQueue<NotificationInput>(), []);
  const notificationRegionPauseRef = useRef({isFocused: false, isHovered: false});
  const scrollbarActivityProps = useScrollbarActivity<HTMLDivElement>();
  const [countState, setCountState] = useState({count: 0, queue});
  const notificationCount = countState.queue === queue ? countState.count : 0;
  const notificationListRef = useNotificationListCap(maxVisible, notificationCount);
  useEffect(() => {
    if (notificationCount === 0) {
      notificationRegionPauseRef.current = {isFocused: false, isHovered: false};
    }
  }, [notificationCount]);
  const getIsNotificationRegionPaused = useMemo(
    () => () => {
      const pauseState = notificationRegionPauseRef.current;
      return pauseState.isFocused || pauseState.isHovered;
    },
    [],
  );
  const handleRegionPointerEnter = () => {
    notificationRegionPauseRef.current.isHovered = true;
    queue.pauseAll();
  };
  const handleRegionPointerLeave = () => {
    notificationRegionPauseRef.current.isHovered = false;
    if (!notificationRegionPauseRef.current.isFocused) queue.resumeAll();
  };
  const handleRegionFocusCapture = () => {
    notificationRegionPauseRef.current.isFocused = true;
    queue.pauseAll();
  };
  const handleRegionBlurCapture = (event: FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    notificationRegionPauseRef.current.isFocused = false;
    if (!notificationRegionPauseRef.current.isHovered) queue.resumeAll();
  };
  const controls = useMemo<NotificationControls>(
    () => ({
      dismiss: (key) => queue.close(key),
      notify: (notification) => {
        const onDismiss = notification.onDismiss;
        const timeout = notificationTimeout(notification.timeout);
        const key = queue.add(notification, {
          onClose: () => {
            setCountState((current) => ({
              count: Math.max(0, (current.queue === queue ? current.count : 0) - 1),
              queue,
            }));
            if (onDismiss !== undefined) queueMicrotask(onDismiss);
          },
          ...(timeout === undefined ? {} : {timeout}),
        });
        setCountState((current) => ({
          count: (current.queue === queue ? current.count : 0) + 1,
          queue,
        }));
        return key;
      },
    }),
    [queue],
  );

  return (
    <>
      {children(controls)}
      <UNSTABLE_ToastRegion
        aria-label={label}
        data-count={notificationCount}
        data-placement={placement}
        data-wcl-notification-region=""
        queue={queue}
      >
        {notificationCount > 1 ? (
          <span aria-hidden="true" data-wcl-notification-count="">
            {notificationCount}
          </span>
        ) : null}
        <div
          {...scrollbarActivityProps}
          {...(maxVisible === undefined ? {} : {'data-max-visible': maxVisible})}
          ref={notificationListRef}
          data-wcl-notification-list=""
          onBlurCapture={handleRegionBlurCapture}
          onFocusCapture={handleRegionFocusCapture}
          onPointerEnter={(event) => {
            scrollbarActivityProps.onPointerEnter?.(event);
            handleRegionPointerEnter();
          }}
          onPointerLeave={handleRegionPointerLeave}
          tabIndex={0}
        >
          <UNSTABLE_ToastList<NotificationInput>>
            {({toast}) => (
              <NotificationItem
                dismissLabel={dismissLabel}
                getIsRegionPaused={getIsNotificationRegionPaused}
                queue={queue}
                toast={toast}
              />
            )}
          </UNSTABLE_ToastList>
        </div>
      </UNSTABLE_ToastRegion>
    </>
  );
}
