'use client';

import {I18nProvider} from 'react-aria/I18nProvider';
import {Slider as AriaSlider} from 'react-aria-components/Slider';
import {useMemo, useState, type ReactElement} from 'react';

import {useFieldGroupDisabled} from '../fields/field-group-context.js';
import {assertNumericDomain, assertSliderValue} from './range-domain.js';
import {RangeHeader, RangeScale, RangeSupport, useRangeFieldIds} from './range-parts.js';
import {preventReadOnlyKeyboardChange, preventReadOnlyPointerChange} from './range-readonly.js';
import type {SliderProps} from './range-types.js';

export function Slider({
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
  name,
  onChange,
  onChangeEnd,
  orientation = 'horizontal',
  step,
  value,
}: SliderProps): ReactElement {
  const inheritedDisabled = useFieldGroupDisabled();
  const disabled = inheritedDisabled || isDisabled;
  const domain = {maxValue, minValue, step};
  assertNumericDomain(domain);
  const [initialValue] = useState(() => defaultValue ?? value ?? minValue);
  const [uncontrolledValue, setUncontrolledValue] = useState(initialValue);
  const resolvedValue = value ?? uncontrolledValue;
  assertSliderValue(resolvedValue, domain);
  const ids = useRangeFieldIds(Boolean(description), isInvalid && Boolean(errorMessage));
  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, formatOptions),
    [formatOptions, locale],
  );

  const handleChange = (nextValue: number) => {
    if (isReadOnly) return;
    if (value === undefined) setUncontrolledValue(nextValue);
    onChange?.(nextValue);
  };

  return (
    <I18nProvider locale={locale}>
      <AriaSlider
        data-invalid={isInvalid || undefined}
        data-readonly={isReadOnly || undefined}
        data-wcl-range-field=""
        data-wcl-slider=""
        defaultValue={initialValue}
        isDisabled={disabled}
        maxValue={maxValue}
        minValue={minValue}
        onChange={handleChange}
        orientation={orientation}
        step={step}
        value={resolvedValue}
        {...(ids.describedBy === undefined ? {} : {'aria-describedby': ids.describedBy})}
        {...(formatOptions === undefined ? {} : {formatOptions})}
        {...(isReadOnly
          ? {
              onKeyDownCapture: preventReadOnlyKeyboardChange,
              onPointerDownCapture: preventReadOnlyPointerChange,
            }
          : {})}
        {...(onChangeEnd === undefined || isReadOnly ? {} : {onChangeEnd})}
      >
        <RangeHeader label={label} />
        <RangeScale
          form={form}
          formatter={formatter}
          isInvalid={isInvalid}
          isReadOnly={isReadOnly}
          maxValue={maxValue}
          minValue={minValue}
          names={[name]}
          orientation={orientation}
          thumbLabels={[undefined]}
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
