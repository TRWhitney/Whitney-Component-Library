import type {ValidationBehavior, ValidationError} from '../fields/field-types.js';

export interface CollectionOption<Value extends string = string> {
  readonly description?: string;
  readonly isDisabled?: boolean;
  readonly label: string;
  readonly value: Value;
}

export type CollectionOptions<Value extends string = string> = readonly CollectionOption<Value>[];

export type SelectionValueProps<Value extends string = string> =
  | {
      readonly defaultValue?: NoInfer<Value> | null;
      readonly onChange?: (value: Value | null) => void;
      readonly value?: never;
    }
  | {
      readonly defaultValue?: never;
      readonly onChange: (value: Value | null) => void;
      readonly value: NoInfer<Value> | null;
    };

export type CollectionLoadingProps =
  | {
      readonly isLoading?: false;
      readonly loadingMessage?: never;
    }
  | {
      readonly isLoading: boolean;
      readonly loadingMessage: string;
    };

export interface CollectionFieldProps<Value extends string = string> {
  readonly description?: string;
  readonly emptyMessage: string;
  readonly errorMessage?: string;
  readonly form?: string;
  readonly isDisabled?: boolean;
  readonly isInvalid?: boolean;
  readonly isRequired?: boolean;
  readonly label: string;
  readonly name?: string;
  readonly options: CollectionOptions<Value>;
  readonly placeholder?: string;
  readonly validate?: (value: Value | null) => ValidationError | true | null | undefined;
  readonly validationBehavior?: ValidationBehavior;
}

export type SelectProps<Value extends string = string> = CollectionFieldProps<Value> &
  CollectionLoadingProps &
  SelectionValueProps<Value>;

export type ComboBoxFilterBehavior = 'contains' | 'manual' | 'startsWith';

export type ComboBoxInputValueProps =
  | {
      readonly defaultInputValue?: string;
      readonly inputValue?: never;
      readonly onInputChange?: (value: string) => void;
    }
  | {
      readonly defaultInputValue?: never;
      readonly inputValue: string;
      readonly onInputChange: (value: string) => void;
    };

export type ComboBoxProps<Value extends string = string> = CollectionFieldProps<Value> &
  CollectionLoadingProps &
  SelectionValueProps<Value> &
  ComboBoxInputValueProps & {
    readonly filterBehavior?: ComboBoxFilterBehavior;
    readonly isReadOnly?: boolean;
  };
