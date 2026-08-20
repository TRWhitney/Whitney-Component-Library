export type SliderOrientation = 'horizontal' | 'vertical';
export type RangeSliderValue = readonly [number, number];
export type RangeSliderThumbLabels = readonly [string, string];
export type RangeSliderNames = readonly [string, string];

export interface RangeFieldProps {
  readonly description?: string;
  readonly errorMessage?: string;
  readonly formatOptions?: Intl.NumberFormatOptions;
  readonly form?: string;
  readonly isDisabled?: boolean;
  readonly isInvalid?: boolean;
  readonly isReadOnly?: boolean;
  readonly label: string;
  readonly locale: string;
  readonly maxValue: number;
  readonly minValue: number;
  readonly orientation?: SliderOrientation;
  readonly step: number;
}

export type SliderValueProps =
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

export type RangeSliderValueProps =
  | {
      readonly defaultValue?: RangeSliderValue;
      readonly onChange?: (value: RangeSliderValue) => void;
      readonly value?: never;
    }
  | {
      readonly defaultValue?: never;
      readonly onChange: (value: RangeSliderValue) => void;
      readonly value: RangeSliderValue;
    };

export type SliderProps = RangeFieldProps &
  SliderValueProps & {
    readonly name?: string;
    readonly onChangeEnd?: (value: number) => void;
  };

export type RangeSliderProps = RangeFieldProps &
  RangeSliderValueProps & {
    readonly names?: RangeSliderNames;
    readonly onChangeEnd?: (value: RangeSliderValue) => void;
    readonly thumbLabels: RangeSliderThumbLabels;
  };
