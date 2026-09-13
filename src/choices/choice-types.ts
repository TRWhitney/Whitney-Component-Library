export interface ChoiceOption<Value extends string = string> {
  readonly description?: string;
  readonly isDisabled?: boolean;
  readonly label: string;
  readonly value: Value;
}

export type ChoiceOptions<Value extends string = string> = readonly [
  ChoiceOption<Value>,
  ...ChoiceOption<Value>[],
];

export type SegmentedControlOption<Value extends string = string> = Omit<
  ChoiceOption<Value>,
  'description'
> & {
  readonly description?: never;
};

export type SegmentedControlOptions<Value extends string = string> = readonly [
  SegmentedControlOption<Value>,
  SegmentedControlOption<Value>,
  ...SegmentedControlOption<Value>[],
];

export interface ChoiceStateProps {
  readonly reserveSupportSpace?: boolean;
  readonly description?: string;
  readonly errorMessage?: string;
  readonly form?: string;
  readonly isDisabled?: boolean;
  readonly isInvalid?: boolean;
  readonly isReadOnly?: boolean;
  readonly isRequired?: boolean;
  readonly label: string;
  readonly name?: string;
  readonly validationBehavior?: 'aria' | 'native';
}

export type BooleanChoiceValueProps =
  | {
      readonly defaultSelected?: boolean;
      readonly isSelected?: never;
      readonly onChange?: (isSelected: boolean) => void;
    }
  | {
      readonly defaultSelected?: never;
      readonly isSelected: boolean;
      readonly onChange: (isSelected: boolean) => void;
    };

export type MultipleChoiceValueProps<Value extends string = string> =
  | {
      readonly defaultValue?: readonly NoInfer<Value>[];
      readonly onChange?: (value: Value[]) => void;
      readonly value?: never;
    }
  | {
      readonly defaultValue?: never;
      readonly onChange: (value: Value[]) => void;
      readonly value: readonly NoInfer<Value>[];
    };

export type ExclusiveChoiceValueProps<Value extends string = string> =
  | {
      readonly defaultValue?: NoInfer<Value>;
      readonly onChange?: (value: Value) => void;
      readonly value?: never;
    }
  | {
      readonly defaultValue?: never;
      readonly onChange: (value: Value) => void;
      readonly value: NoInfer<Value> | null;
    };

export type CheckboxProps = Omit<ChoiceStateProps, 'name'> &
  BooleanChoiceValueProps & {
    readonly isIndeterminate?: boolean;
    readonly name?: string;
    readonly value?: string;
  };

export type SwitchProps = Omit<
  ChoiceStateProps,
  'errorMessage' | 'isInvalid' | 'isRequired' | 'validationBehavior'
> &
  BooleanChoiceValueProps & {
    readonly name?: string;
    readonly value?: string;
  };

export type CheckboxGroupProps<Value extends string = string> = ChoiceStateProps &
  MultipleChoiceValueProps<Value> & {
    readonly options: ChoiceOptions<Value>;
  };

export type RadioGroupProps<Value extends string = string> = ChoiceStateProps &
  ExclusiveChoiceValueProps<Value> & {
    readonly options: ChoiceOptions<Value>;
  };

export type SegmentedControlProps<Value extends string = string> = ChoiceStateProps &
  ExclusiveChoiceValueProps<Value> & {
    readonly options: SegmentedControlOptions<Value>;
  };
