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
