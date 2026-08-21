import {Label} from 'react-aria-components/Label';
import {Meter as AriaMeter} from 'react-aria-components/Meter';
import {useId, type CSSProperties, type ReactElement} from 'react';

import {assertProgressDomain} from './feedback-support.js';
import type {MeterProps, MeterThreshold} from './feedback-types.js';

type MeterStyles = CSSProperties & {'--wcl-meter-percentage': string};

function assertThresholds(
  thresholds: readonly MeterThreshold[],
  minValue: number,
  maxValue: number,
): void {
  let prior = minValue;
  for (const threshold of thresholds) {
    if (!Number.isFinite(threshold.value)) {
      throw new TypeError('Meter threshold values must be finite numbers.');
    }
    if (threshold.value <= prior) {
      throw new RangeError(
        'Meter thresholds must be ordered from lowest to highest without duplicates.',
      );
    }
    if (threshold.value >= maxValue) {
      throw new RangeError('Meter thresholds must remain between minValue and maxValue.');
    }
    prior = threshold.value;
  }
}

export function Meter({
  label,
  maxValue,
  minValue,
  thresholds = [],
  tone = 'neutral',
  value,
  valueLabel,
}: MeterProps): ReactElement {
  assertProgressDomain('Meter', minValue, maxValue, value);
  assertThresholds(thresholds, minValue, maxValue);
  const thresholdsId = `wcl-meter-thresholds-${useId().replaceAll(':', '')}`;

  return (
    <AriaMeter
      {...(thresholds.length > 0 ? {'aria-describedby': thresholdsId} : {})}
      data-tone={tone}
      data-wcl-meter=""
      maxValue={maxValue}
      minValue={minValue}
      value={value}
      valueLabel={valueLabel}
    >
      {({percentage, valueText}) => (
        <>
          <div data-wcl-meter-heading="">
            <Label>{label}</Label>
            <span data-wcl-meter-value="">{valueText}</span>
          </div>
          <div aria-hidden="true" data-wcl-meter-track="">
            <span
              data-wcl-meter-fill=""
              style={{'--wcl-meter-percentage': `${percentage}%`} as MeterStyles}
            />
            {thresholds.map((threshold) => (
              <span
                data-tone={threshold.tone}
                data-wcl-meter-threshold=""
                key={threshold.value}
                style={
                  {
                    '--wcl-meter-percentage': `${((threshold.value - minValue) / (maxValue - minValue)) * 100}%`,
                  } as MeterStyles
                }
              />
            ))}
          </div>
          {thresholds.length > 0 ? (
            <ul data-wcl-visually-hidden="" id={thresholdsId}>
              {thresholds.map((threshold) => (
                <li key={threshold.value}>
                  {threshold.label}: {threshold.valueLabel}.
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}
    </AriaMeter>
  );
}
