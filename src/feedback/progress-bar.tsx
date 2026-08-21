import {Label} from 'react-aria-components/Label';
import {ProgressBar as AriaProgressBar} from 'react-aria-components/ProgressBar';
import {useId, type CSSProperties, type ReactElement} from 'react';

import {assertProgressDomain} from './feedback-support.js';
import type {ProgressBarProps} from './feedback-types.js';

type ProgressStyles = CSSProperties & {'--wcl-progress-percentage': string};
type AriaProgressValueProps =
  | {readonly isIndeterminate: true}
  | {
      readonly isIndeterminate: false;
      readonly maxValue: number;
      readonly minValue: number;
      readonly value: number;
      readonly valueLabel: string;
    };

export function ProgressBar(props: ProgressBarProps): ReactElement {
  const completionId = `wcl-progress-completion-${useId().replaceAll(':', '')}`;
  const statusId = `wcl-progress-status-${useId().replaceAll(':', '')}`;
  const isIndeterminate = props.isIndeterminate === true;
  const minValue = isIndeterminate ? undefined : (props.minValue ?? 0);
  const maxValue = isIndeterminate ? undefined : (props.maxValue ?? 100);
  if (!isIndeterminate) {
    assertProgressDomain('ProgressBar', minValue!, maxValue!, props.value);
  }
  const ariaValueProps: AriaProgressValueProps = isIndeterminate
    ? {isIndeterminate: true}
    : {
        isIndeterminate: false,
        maxValue: maxValue!,
        minValue: minValue!,
        value: props.value,
        valueLabel: props.valueLabel,
      };

  return (
    <AriaProgressBar
      {...ariaValueProps}
      aria-describedby={isIndeterminate ? `${statusId} ${completionId}` : completionId}
      data-active={(props.isActive && (isIndeterminate || props.value < maxValue!)) || undefined}
      data-indeterminate={isIndeterminate || undefined}
      data-wcl-progress-bar=""
    >
      {({percentage, valueText}) => (
        <>
          <div data-wcl-progress-heading="">
            <Label>{props.label}</Label>
            <span data-wcl-progress-value="" id={isIndeterminate ? statusId : undefined}>
              {isIndeterminate ? props.statusLabel : valueText}
            </span>
          </div>
          <div aria-hidden="true" data-wcl-progress-track="">
            <span
              data-wcl-progress-fill=""
              style={
                {
                  '--wcl-progress-percentage': `${percentage ?? 36}%`,
                } as ProgressStyles
              }
            />
          </div>
          <span data-wcl-visually-hidden="" id={completionId}>
            {props.completionLabel}
          </span>
        </>
      )}
    </AriaProgressBar>
  );
}
