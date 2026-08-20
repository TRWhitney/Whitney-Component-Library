import type {FieldStateProps, FieldValidationProps} from '../fields/field-types.js';

export type CalendarSystem =
  | 'buddhist'
  | 'coptic'
  | 'ethioaa'
  | 'ethiopic'
  | 'gregory'
  | 'hebrew'
  | 'indian'
  | 'islamic-civil'
  | 'islamic-tbla'
  | 'islamic-umalqura'
  | 'japanese'
  | 'persian'
  | 'roc';

export interface CalendarDateValue {
  /** Prevent private calendar-aware values from satisfying this ISO-only shape. */
  readonly calendar?: never;
  readonly day: number;
  readonly era?: never;
  readonly month: number;
  readonly year: number;
}

export interface TimeValue {
  readonly hour: number;
  /** Prevent precision-bearing private time values from satisfying this wall-clock shape. */
  readonly millisecond?: never;
  readonly minute: number;
  readonly second: number;
}

export interface DateRangeValue {
  readonly end: CalendarDateValue;
  readonly start: CalendarDateValue;
}

export type TimeGranularity = 'hour' | 'minute' | 'second';
export type HourCycle = 12 | 24;
export type DateRangeNames = readonly [start: string, end: string];

export type DateValueProps =
  | {
      readonly defaultValue?: CalendarDateValue | null;
      readonly onChange?: (value: CalendarDateValue | null) => void;
      readonly value?: never;
    }
  | {
      readonly defaultValue?: never;
      readonly onChange: (value: CalendarDateValue | null) => void;
      readonly value: CalendarDateValue | null;
    };

export type TimeValueProps =
  | {
      readonly defaultValue?: TimeValue | null;
      readonly onChange?: (value: TimeValue | null) => void;
      readonly value?: never;
    }
  | {
      readonly defaultValue?: never;
      readonly onChange: (value: TimeValue | null) => void;
      readonly value: TimeValue | null;
    };

export type DateRangeValueProps =
  | {
      readonly defaultValue?: DateRangeValue | null;
      readonly onChange?: (value: DateRangeValue | null) => void;
      readonly value?: never;
    }
  | {
      readonly defaultValue?: never;
      readonly onChange: (value: DateRangeValue | null) => void;
      readonly value: DateRangeValue | null;
    };

export type PickerOpenProps =
  | {
      readonly defaultOpen?: boolean;
      readonly isOpen?: never;
      readonly onOpenChange?: (isOpen: boolean) => void;
    }
  | {
      readonly defaultOpen?: never;
      readonly isOpen: boolean;
      readonly onOpenChange: (isOpen: boolean) => void;
    };

interface DateFormattingProps {
  readonly calendar: CalendarSystem;
  readonly locale: string;
  readonly shouldForceLeadingZeros?: boolean;
}

interface DateConstraintProps {
  readonly isDateUnavailable?: (date: CalendarDateValue) => boolean;
  readonly maxValue?: CalendarDateValue;
  readonly minValue?: CalendarDateValue;
}

interface DateFormProps {
  readonly form?: string;
  readonly name?: string;
}

type DateFieldBaseProps = FieldStateProps &
  FieldValidationProps<CalendarDateValue> &
  DateConstraintProps &
  DateFormattingProps &
  DateFormProps;

export type DateFieldProps = DateFieldBaseProps & DateValueProps;

export type TimeFieldProps = FieldStateProps &
  FieldValidationProps<TimeValue> &
  TimeValueProps & {
    readonly form?: string;
    readonly granularity: TimeGranularity;
    readonly hourCycle: HourCycle;
    readonly locale: string;
    readonly maxValue?: TimeValue;
    readonly minValue?: TimeValue;
    readonly name?: string;
    readonly shouldForceLeadingZeros?: boolean;
  };

interface PickerProps {
  readonly calendarButtonLabel: string;
  readonly firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
  readonly placeholderValue: CalendarDateValue;
}

export type DatePickerProps = DateFieldBaseProps & DateValueProps & PickerOpenProps & PickerProps;

export type DateRangePickerProps = FieldStateProps &
  FieldValidationProps<DateRangeValue> &
  DateConstraintProps &
  DateFormattingProps &
  DateRangeValueProps &
  PickerOpenProps &
  PickerProps & {
    readonly form?: string;
    readonly names?: DateRangeNames;
  };
