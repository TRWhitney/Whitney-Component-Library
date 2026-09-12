import type {AriaAttributes, InputHTMLAttributes, ReactElement, ReactNode} from 'react';

export type ValidationBehavior = 'aria' | 'native';
export type ValidationError = string | string[];
export type TextAreaRows = 3 | 5 | 8;
export type TextFieldInputType = 'email' | 'password' | 'tel' | 'text' | 'url';
export type FieldGroupColumns = 'one' | 'responsive';
export type FormSectionHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface FieldControlProps {
  readonly 'aria-busy'?: true;
  readonly 'aria-describedby'?: string;
  readonly 'aria-disabled'?: true;
  readonly 'aria-invalid'?: true;
  readonly 'aria-labelledby'?: string;
  readonly 'aria-readonly'?: true;
  readonly 'aria-required'?: true;
  readonly disabled?: true;
  readonly id?: string;
  readonly readOnly?: true;
  readonly required?: true;
  readonly tabIndex?: -1;
}

export interface FieldStateProps {
  /** Reserve a support row even when no description, error, or pending message is visible. */
  readonly reserveSupportSpace?: boolean;
  readonly description?: string;
  readonly errorMessage?: string;
  readonly isDisabled?: boolean;
  readonly isInvalid?: boolean;
  readonly isReadOnly?: boolean;
  readonly isRequired?: boolean;
  readonly label: string;
}

export interface FieldValidationProps<Value> {
  readonly validate?: (value: Value) => ValidationError | true | null | undefined;
  readonly validationBehavior?: ValidationBehavior;
}

export type FieldPendingProps =
  | {
      readonly isPending?: false;
      readonly pendingMessage?: never;
    }
  | {
      readonly isPending: boolean;
      readonly pendingMessage: string;
    };

export type StringValueProps =
  | {
      readonly defaultValue?: string;
      readonly onChange?: (value: string) => void;
      readonly value?: never;
    }
  | {
      readonly defaultValue?: never;
      readonly onChange: (value: string) => void;
      readonly value: string;
    };

export type NumberValueProps =
  | {
      readonly defaultValue?: number;
      readonly onChange?: (value: number) => void;
      readonly value?: never;
    }
  | {
      readonly defaultValue?: never;
      readonly onChange: (value: number) => void;
      readonly value: number;
    };

export interface NativeTextInputProps {
  readonly autoComplete?: string;
  readonly form?: string;
  readonly maxLength?: number;
  readonly minLength?: number;
  readonly name?: string;
  readonly pattern?: string;
  readonly placeholder?: string;
}

export type FieldProps = FieldStateProps &
  FieldPendingProps & {
    readonly children: (controlProps: FieldControlProps) => ReactElement;
  };

export interface FieldGroupProps {
  readonly children: ReactNode;
  readonly columns?: FieldGroupColumns;
  readonly description?: string;
  readonly isDisabled?: boolean;
  readonly legend: string;
}

export interface FormSectionProps {
  readonly children: ReactNode;
  readonly description?: string;
  readonly headingLevel?: FormSectionHeadingLevel;
  readonly title: string;
}

export type TextFieldProps = FieldStateProps &
  FieldPendingProps &
  FieldValidationProps<string> &
  NativeTextInputProps &
  StringValueProps & {
    readonly inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
    readonly inputType?: TextFieldInputType;
  };

export type TextAreaProps = FieldStateProps &
  FieldPendingProps &
  FieldValidationProps<string> &
  Omit<NativeTextInputProps, 'autoComplete' | 'pattern'> &
  StringValueProps & {
    readonly rows?: TextAreaRows;
  };

export type NumberFieldProps = FieldStateProps &
  FieldPendingProps &
  FieldValidationProps<number> &
  NumberValueProps & {
    readonly commitBehavior?: 'snap' | 'validate';
    readonly formatOptions?: Intl.NumberFormatOptions;
    readonly form?: string;
    readonly isWheelDisabled?: boolean;
    readonly locale: string;
    readonly maxValue?: number;
    readonly minValue?: number;
    readonly name?: string;
    readonly placeholder?: string;
    readonly step?: number;
  };

export type SearchFieldProps = FieldStateProps &
  FieldPendingProps &
  FieldValidationProps<string> &
  NativeTextInputProps &
  StringValueProps & {
    readonly clearLabel: string;
    readonly onClear?: () => void;
    readonly onSubmit?: (value: string) => void;
  };

export type FieldAriaControlProps = Pick<
  AriaAttributes,
  'aria-busy' | 'aria-describedby' | 'aria-invalid' | 'aria-labelledby' | 'aria-required'
>;
