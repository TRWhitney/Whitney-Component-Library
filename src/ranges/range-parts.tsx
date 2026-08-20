'use client';

import {SliderFill, SliderOutput, SliderThumb, SliderTrack} from 'react-aria-components/Slider';
import {Label} from 'react-aria-components/Label';
import {useEffect, useId, useRef, type ReactElement} from 'react';

import type {SliderOrientation} from './range-types.js';

export interface RangeFieldIds {
  readonly describedBy: string | undefined;
  readonly descriptionId: string | undefined;
  readonly errorId: string | undefined;
}

export function useRangeFieldIds(hasDescription: boolean, hasError: boolean): RangeFieldIds {
  const prefix = useId();
  const descriptionId = hasDescription ? `${prefix}-description` : undefined;
  const errorId = hasError ? `${prefix}-error` : undefined;

  return {
    describedBy: [descriptionId, errorId].filter(Boolean).join(' ') || undefined,
    descriptionId,
    errorId,
  };
}

interface RangeHeaderProps {
  readonly collapseEqualRange?: boolean;
  readonly label: string;
}

export function RangeHeader({collapseEqualRange = false, label}: RangeHeaderProps): ReactElement {
  return (
    <div data-wcl-range-header="">
      <Label data-wcl-range-label="">{label}</Label>
      {collapseEqualRange ? (
        <SliderOutput data-wcl-range-output="">
          {({state}) =>
            state.values.length === 2 && state.values[0] === state.values[1]
              ? state.getFormattedValue(state.values[0])
              : state.getFormattedValue()
          }
        </SliderOutput>
      ) : (
        <SliderOutput data-wcl-range-output="" />
      )}
    </div>
  );
}

interface RangeScaleProps {
  readonly form: string | undefined;
  readonly formatter: Intl.NumberFormat;
  readonly isInvalid: boolean;
  readonly isReadOnly: boolean;
  readonly maxValue: number;
  readonly minValue: number;
  readonly names: readonly (string | undefined)[];
  readonly orientation: SliderOrientation;
  readonly thumbLabels: readonly (string | undefined)[];
}

export function RangeScale({
  form,
  formatter,
  isInvalid,
  isReadOnly,
  maxValue,
  minValue,
  names,
  orientation,
  thumbLabels,
}: RangeScaleProps): ReactElement {
  return (
    <div data-wcl-range-scale="">
      <span data-bound="minimum" data-wcl-range-bound="">
        {formatter.format(minValue)}
      </span>
      <SliderTrack data-wcl-range-track="">
        <SliderFill
          data-wcl-range-fill=""
          offset={minValue}
          style={orientation === 'vertical' ? {width: '4px'} : {height: '4px'}}
        />
        {thumbLabels.map((thumbLabel, index) => (
          <RangeThumb
            form={form}
            index={index}
            isInvalid={isInvalid}
            isReadOnly={isReadOnly}
            key={index}
            name={names[index]}
            orientation={orientation}
            thumb={thumbLabels.length === 1 ? 'single' : index === 0 ? 'start' : 'end'}
            thumbLabel={thumbLabel}
          />
        ))}
      </SliderTrack>
      <span data-bound="maximum" data-wcl-range-bound="">
        {formatter.format(maxValue)}
      </span>
    </div>
  );
}

interface RangeThumbProps {
  readonly form: string | undefined;
  readonly index: number;
  readonly isInvalid: boolean;
  readonly isReadOnly: boolean;
  readonly name: string | undefined;
  readonly orientation: SliderOrientation;
  readonly thumb: 'end' | 'single' | 'start';
  readonly thumbLabel: string | undefined;
}

function RangeThumb({
  form,
  index,
  isInvalid,
  isReadOnly,
  name,
  orientation,
  thumb,
  thumbLabel,
}: RangeThumbProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    if (isReadOnly) input.setAttribute('aria-readonly', 'true');
    else input.removeAttribute('aria-readonly');
  }, [isReadOnly]);

  return (
    <SliderThumb
      data-readonly={isReadOnly || undefined}
      data-thumb={thumb}
      data-wcl-range-thumb=""
      index={index}
      inputRef={inputRef}
      isInvalid={isInvalid}
      orientation={orientation}
      {...(form === undefined ? {} : {form})}
      {...(name === undefined ? {} : {name})}
    >
      {thumbLabel ? <Label data-wcl-visually-hidden="">{thumbLabel}</Label> : null}
    </SliderThumb>
  );
}

interface RangeSupportProps {
  readonly description: string | undefined;
  readonly descriptionId: string | undefined;
  readonly errorId: string | undefined;
  readonly errorMessage: string | undefined;
  readonly isInvalid: boolean;
}

export function RangeSupport({
  description,
  descriptionId,
  errorId,
  errorMessage,
  isInvalid,
}: RangeSupportProps): ReactElement {
  return (
    <div
      data-has-error={isInvalid && Boolean(errorMessage) ? '' : undefined}
      data-wcl-range-support=""
    >
      {description ? (
        <span data-wcl-range-description="" id={descriptionId}>
          {description}
        </span>
      ) : null}
      {isInvalid && errorMessage ? (
        <span data-wcl-range-error="" id={errorId}>
          {errorMessage}
        </span>
      ) : null}
    </div>
  );
}
