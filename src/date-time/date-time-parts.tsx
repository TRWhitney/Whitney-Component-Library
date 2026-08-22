'use client';

import {DateInput, DateSegment} from 'react-aria-components/DateField';
import type {ReactElement} from 'react';

export function DateSegments({
  isActiveEndpoint = false,
  isControl = false,
  slot,
}: {
  readonly isActiveEndpoint?: boolean;
  readonly isControl?: boolean;
  readonly slot?: 'end' | 'start';
}): ReactElement {
  return (
    <DateInput
      data-wcl-active-endpoint={isActiveEndpoint || undefined}
      data-wcl-date-input=""
      {...(isControl ? {'data-wcl-field-control': ''} : {})}
      {...(slot === undefined ? {} : {slot})}
    >
      {(segment) => <DateSegment data-wcl-date-segment="" segment={segment} />}
    </DateInput>
  );
}

export function CalendarIcon(): ReactElement {
  return (
    <svg aria-hidden="true" data-wcl-calendar-icon="" viewBox="0 0 20 20">
      <path d="M5 3v3m10-3v3M3.5 7.5h13M5 5h10a2 2 0 0 1 2 2v9H3V7a2 2 0 0 1 2-2Zm2 5h2m2 0h2m-6 3h2m2 0h2" />
    </svg>
  );
}
