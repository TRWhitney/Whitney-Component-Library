import {
  EmptyState,
  NotificationProvider,
  Skeleton,
  type EmptyStateKind,
  type NotificationControls,
  type NotificationPlacement,
  type SkeletonShape,
  type SkeletonWidth,
} from '../src/index.js';

const emptyKind: EmptyStateKind = 'no-results';
const placement: NotificationPlacement = 'top-end';
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
              tone: 'success',
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
  // @ts-expect-error Notification regions show at most three messages.
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
            tone: 'danger',
          })
        }
        type="button"
      >
        Notify
      </button>
    )}
  </NotificationProvider>
);
