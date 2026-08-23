import {
  EmptyState,
  NotificationProvider,
  Skeleton,
  type EmptyStateKind,
  type NotificationControls,
  type NotificationPlacement,
  type NotificationTone,
  type SkeletonShape,
  type SkeletonWidth,
} from '../src/index.js';

const emptyKind: EmptyStateKind = 'no-results';
const placement: NotificationPlacement = 'top-end';
const successNotificationTone: NotificationTone = 'success';
const skeletonShape: SkeletonShape = 'text';
const skeletonWidth: SkeletonWidth = 'three-quarters';

export const loadingFeedback = (
  <>
    <Skeleton lines={3} shape={skeletonShape} width={skeletonWidth} />
    <Skeleton shape="media" />
    <EmptyState
      actionLabel="Clear filters"
      description="Change or clear the current filters."
      kind={emptyKind}
      onAction={() => undefined}
      title="No matching runs"
    />
    <NotificationProvider dismissLabel="Dismiss notification" label="Notifications">
      {(notifications: NotificationControls) => (
        <button
          onClick={() =>
            notifications.notify({
              description: 'The export is available in run history.',
              timeout: 8000,
              title: 'Export ready',
              tone: successNotificationTone,
              urgency: 'polite',
            })
          }
          type="button"
        >
          Export
        </button>
      )}
    </NotificationProvider>
    <NotificationProvider
      dismissLabel="Dismiss notification"
      label="Notifications"
      maxVisible={3}
      placement={placement}
    >
      {() => null}
    </NotificationProvider>
  </>
);

export const invalidSkeletonLines = (
  // @ts-expect-error Skeleton line counts are bounded.
  <Skeleton lines={8} shape="text" />
);

export const blockSkeletonLines = (
  // @ts-expect-error Non-text skeletons render one block and do not accept line counts.
  <Skeleton lines={2} shape="media" />
);

export const emptyActionWithoutHandler = (
  // @ts-expect-error Empty-state recovery labels require an action handler.
  <EmptyState
    actionLabel="Retry"
    description="Try loading again."
    kind="unavailable"
    title="Unavailable"
  />
);

export const emptyHandlerWithoutAction = (
  // @ts-expect-error Empty-state action handlers require a visible action label.
  <EmptyState
    description="Try loading again."
    kind="unavailable"
    onAction={() => undefined}
    title="Unavailable"
  />
);

export const tooManyNotifications = (
  // @ts-expect-error Notification viewport caps accept one, two, or three cards.
  <NotificationProvider dismissLabel="Dismiss" label="Notifications" maxVisible={4}>
    {() => null}
  </NotificationProvider>
);

export const interactiveNotificationCopy = (
  <NotificationProvider dismissLabel="Dismiss" label="Notifications">
    {(notifications) => (
      <button
        onClick={() =>
          notifications.notify({
            // @ts-expect-error Notification descriptions are plain text and cannot contain recovery controls.
            description: <button type="button">Retry</button>,
            title: 'Export failed',
            tone: 'error',
          })
        }
        type="button"
      >
        Notify
      </button>
    )}
  </NotificationProvider>
);

export const notificationWithAction = (
  <NotificationProvider dismissLabel="Dismiss" label="Notifications">
    {({notify}) => (
      <button
        onClick={() =>
          notify({
            actionLabel: 'Retry',
            onAction: () => undefined,
            title: 'Export failed',
            tone: 'error',
          })
        }
        type="button"
      >
        Notify
      </button>
    )}
  </NotificationProvider>
);

export const notificationActionWithoutHandler = (
  <NotificationProvider dismissLabel="Dismiss" label="Notifications">
    {({notify}) => (
      <button
        onClick={() =>
          // @ts-expect-error Notification action labels require action handlers.
          notify({actionLabel: 'Retry', title: 'Export failed', tone: 'error'})
        }
        type="button"
      >
        Notify
      </button>
    )}
  </NotificationProvider>
);

export const notificationHandlerWithoutLabel = (
  <NotificationProvider dismissLabel="Dismiss" label="Notifications">
    {({notify}) => (
      <button
        onClick={() =>
          // @ts-expect-error Notification action handlers require visible action labels.
          notify({onAction: () => undefined, title: 'Export failed', tone: 'error'})
        }
        type="button"
      >
        Notify
      </button>
    )}
  </NotificationProvider>
);

export const invalidNotificationTone = (
  <NotificationProvider dismissLabel="Dismiss" label="Notifications">
    {({notify}) => (
      <button
        onClick={() =>
          // @ts-expect-error Notification tones are general, success, warning, or error.
          notify({title: 'Export ready', tone: 'neutral'})
        }
        type="button"
      >
        Notify
      </button>
    )}
  </NotificationProvider>
);
