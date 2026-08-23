import type {ReactNode} from 'react';

export type AnnouncementMode = 'off' | 'polite' | 'assertive';
export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger';
export type BadgeTone = StatusTone | 'accent';

export interface StatusIndicatorProps {
  readonly announcement?: AnnouncementMode;
  readonly label: string;
  readonly tone: StatusTone;
}

export interface BadgeProps {
  readonly children: ReactNode;
  readonly tone?: BadgeTone;
}

interface AlertProps {
  readonly announcement?: AnnouncementMode;
  readonly children?: ReactNode;
  readonly title: string;
  readonly tone: StatusTone;
}

export type InlineAlertProps = AlertProps;
export type AlertBannerProps = AlertProps;

interface ProgressBarBaseProps {
  readonly completionLabel: string;
  readonly isActive: boolean;
  readonly label: string;
}

interface DeterminateProgressBarProps extends ProgressBarBaseProps {
  readonly isIndeterminate?: false;
  readonly maxValue?: number;
  readonly minValue?: number;
  readonly statusLabel?: never;
  readonly value: number;
  readonly valueLabel: string;
}

interface IndeterminateProgressBarProps extends ProgressBarBaseProps {
  readonly isIndeterminate: true;
  readonly maxValue?: never;
  readonly minValue?: never;
  readonly statusLabel: string;
  readonly value?: never;
  readonly valueLabel?: never;
}

export type ProgressBarProps = DeterminateProgressBarProps | IndeterminateProgressBarProps;

export interface MeterThreshold {
  readonly label: string;
  readonly tone: Exclude<StatusTone, 'neutral'>;
  readonly value: number;
  readonly valueLabel: string;
}

export interface MeterProps {
  readonly label: string;
  readonly maxValue: number;
  readonly minValue: number;
  readonly thresholds?: readonly MeterThreshold[];
  readonly tone?: StatusTone;
  readonly value: number;
  readonly valueLabel: string;
}

export interface SpinnerProps {
  readonly isActive: boolean;
  readonly label: string;
}

export type SkeletonShape = 'text' | 'heading' | 'control' | 'media';
export type SkeletonWidth = 'full' | 'three-quarters' | 'half';
export type SkeletonLineCount = 1 | 2 | 3 | 4 | 5;

interface SkeletonBaseProps {
  readonly width?: SkeletonWidth;
}

export type SkeletonProps =
  | (SkeletonBaseProps & {
      readonly lines?: SkeletonLineCount;
      readonly shape?: 'text';
    })
  | (SkeletonBaseProps & {
      readonly lines?: never;
      readonly shape: Exclude<SkeletonShape, 'text'>;
    });

export type EmptyStateKind = 'no-data' | 'no-results' | 'unavailable';

interface EmptyStateBaseProps {
  readonly description: string;
  readonly kind: EmptyStateKind;
  readonly title: string;
}

export type EmptyStateProps = EmptyStateBaseProps &
  (
    | {
        readonly actionLabel?: never;
        readonly onAction?: never;
      }
    | {
        readonly actionLabel: string;
        readonly onAction: () => void;
      }
  );

export type NotificationPlacement = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
export type NotificationTone = 'general' | 'success' | 'warning' | 'error';
export type NotificationUrgency = Exclude<AnnouncementMode, 'off'>;
export type NotificationVisibleLimit = 1 | 2 | 3;

interface NotificationInputBase {
  readonly description?: string;
  readonly onDismiss?: () => void;
  readonly timeout?: number | null;
  readonly title: string;
  readonly tone: NotificationTone;
  readonly urgency?: NotificationUrgency;
}

export type NotificationInput = NotificationInputBase &
  (
    | {
        readonly actionLabel?: never;
        readonly onAction?: never;
      }
    | {
        readonly actionLabel: string;
        readonly onAction: () => void;
      }
  );

export interface NotificationControls {
  readonly dismiss: (key: string) => void;
  readonly notify: (notification: NotificationInput) => string;
}

export interface NotificationProviderProps {
  readonly children: (controls: NotificationControls) => ReactNode;
  readonly dismissLabel: string;
  readonly label: string;
  readonly maxVisible?: NotificationVisibleLimit;
  readonly placement?: NotificationPlacement;
}
