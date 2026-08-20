'use client';

import {Button} from 'react-aria-components/Button';
import {
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
} from 'react-aria-components/Calendar';
import {DateInput, DateSegment} from 'react-aria-components/DateField';
import type {ReactElement} from 'react';

export function DateSegments({
  isControl = false,
  slot,
}: {
  readonly isControl?: boolean;
  readonly slot?: 'end' | 'start';
}): ReactElement {
  return (
    <DateInput
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

function NavigationIcon({direction}: {readonly direction: 'next' | 'previous'}): ReactElement {
  return (
    <svg
      aria-hidden="true"
      data-direction={direction}
      data-wcl-calendar-navigation-icon=""
      viewBox="0 0 20 20"
    >
      <path d="m12.5 5-5 5 5 5" />
    </svg>
  );
}

export function CalendarSheet(): ReactElement {
  return (
    <>
      <header data-wcl-calendar-header="">
        <Button data-wcl-calendar-navigation="" slot="previous">
          <NavigationIcon direction="previous" />
        </Button>
        <CalendarHeading data-wcl-calendar-heading="" />
        <Button data-wcl-calendar-navigation="" slot="next">
          <NavigationIcon direction="next" />
        </Button>
      </header>
      <CalendarGrid data-wcl-calendar-grid="" weekdayStyle="short">
        <CalendarGridHeader>
          {(day) => <CalendarHeaderCell data-wcl-calendar-weekday="">{day}</CalendarHeaderCell>}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => <CalendarCell data-wcl-calendar-cell="" date={date} />}
        </CalendarGridBody>
      </CalendarGrid>
    </>
  );
}
