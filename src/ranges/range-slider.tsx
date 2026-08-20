'use client';

import {I18nProvider} from 'react-aria/I18nProvider';
import {Slider as AriaSlider} from 'react-aria-components/Slider';
import {useMemo, useState, type ReactElement} from 'react';

import {useFieldGroupDisabled} from '../fields/field-group-context.js';
import {
  assertNumericDomain,
  assertRangeSliderThumbLabels,
  assertRangeSliderValue,
} from './range-domain.js';
import {RangeHeader, RangeScale, RangeSupport, useRangeFieldIds} from './range-parts.js';
import {preventReadOnlyKeyboardChange, preventReadOnlyPointerChange} from './range-readonly.js';
import type {RangeSliderProps, RangeSliderValue} from './range-types.js';

export function RangeSlider({
  defaultValue,
  description,
  errorMessage,
  form,
  formatOptions,
  isDisabled = false,
  isInvalid = false,
  isReadOnly = false,
  label,
  locale,
  maxValue,
  minValue,
  names,
  onChange,
  onChangeEnd,
  orientation = 'horizontal',
  step,
  thumbLabels,
  value,
}: RangeSliderProps): ReactElement {
  const inheritedDisabled = useFieldGroupDisabled();
  const disabled = inheritedDisabled || isDisabled;
  const domain = {maxValue, minValue, step};
  assertNumericDomain(domain);
  assertRangeSliderThumbLabels(thumbLabels, locale);
  const [initialValue] = useState<RangeSliderValue>(
    () => defaultValue ?? value ?? [minValue, maxValue],
  );
  const [uncontrolledValue, setUncontrolledValue] = useState(initialValue);
  const resolvedValue = value ?? uncontrolledValue;
  assertRangeSliderValue(resolvedValue, domain);
  const ids = useRangeFieldIds(Boolean(description), isInvalid && Boolean(errorMessage));
  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, formatOptions),
    [formatOptions, locale],
  );

  const handleChange = (nextValue: number[]) => {
    if (isReadOnly) return;
    const rangeValue: RangeSliderValue = [nextValue[0]!, nextValue[1]!];
    if (value === undefined) setUncontrolledValue(rangeValue);
    onChange?.(rangeValue);
  };
  const handleChangeEnd =
    onChangeEnd === undefined || isReadOnly
      ? undefined
      : (nextValue: number[]) => onChangeEnd([nextValue[0]!, nextValue[1]!]);

  return (
    <I18nProvider locale={locale}>
      <AriaSlider
        data-invalid={isInvalid || undefined}
        data-readonly={isReadOnly || undefined}
        data-wcl-range-field=""
        data-wcl-range-slider=""
        defaultValue={[...initialValue]}
        isDisabled={disabled}
        maxValue={maxValue}
        minValue={minValue}
        onChange={handleChange}
        orientation={orientation}
        step={step}
        value={[...resolvedValue]}
        {...(ids.describedBy === undefined ? {} : {'aria-describedby': ids.describedBy})}
        {...(formatOptions === undefined ? {} : {formatOptions})}
        {...(isReadOnly
          ? {
              onKeyDownCapture: preventReadOnlyKeyboardChange,
              onPointerDownCapture: preventReadOnlyPointerChange,
            }
          : {})}
        {...(handleChangeEnd === undefined ? {} : {onChangeEnd: handleChangeEnd})}
      >
        <RangeHeader collapseEqualRange label={label} />
        <RangeScale
          form={form}
          formatter={formatter}
          isInvalid={isInvalid}
          isReadOnly={isReadOnly}
          maxValue={maxValue}
          minValue={minValue}
          names={names ?? []}
          orientation={orientation}
          thumbLabels={thumbLabels}
        />
        <RangeSupport
          description={description}
          descriptionId={ids.descriptionId}
          errorId={ids.errorId}
          errorMessage={errorMessage}
          isInvalid={isInvalid}
        />
      </AriaSlider>
    </I18nProvider>
  );
}
