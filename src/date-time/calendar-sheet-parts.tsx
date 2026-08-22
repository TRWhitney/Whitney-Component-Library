'use client';

import type {CalendarDate} from '@internationalized/date';
import {Button} from 'react-aria-components/Button';
import {useEffect, useRef, useState, type ReactElement} from 'react';
import type {CalendarSelectionMode, CalendarState} from 'react-stately/useCalendarState';
import type {RangeCalendarState} from 'react-stately/useRangeCalendarState';

export type CalendarSheetState = CalendarState<CalendarSelectionMode> | RangeCalendarState;
export type Panel = 0 | 1;

export interface HierarchyItem {
  readonly date: CalendarDate;
  readonly endDate: CalendarDate;
  readonly isDisabled: boolean;
  readonly label: string;
}

export function NavigationIcon({
  direction,
}: {
  readonly direction: 'next' | 'previous';
}): ReactElement {
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

function chunkItems(items: readonly HierarchyItem[]): readonly (readonly HierarchyItem[])[] {
  const rows: HierarchyItem[][] = [];
  for (let index = 0; index < items.length; index += 4) rows.push(items.slice(index, index + 4));
  return rows;
}

export function HierarchyGrid({
  direction,
  items,
  label,
  onPage,
  onSelect,
}: {
  readonly direction: 'ltr' | 'rtl';
  readonly items: readonly HierarchyItem[];
  readonly label: string;
  readonly onPage: (direction: 'next' | 'previous') => void;
  readonly onSelect: (date: CalendarDate) => void;
}): ReactElement {
  const firstEnabledIndex = Math.max(
    0,
    items.findIndex((item) => !item.isDisabled),
  );
  const itemsKey = items.map((item) => `${item.date.toString()}:${item.isDisabled}`).join('|');
  const [focusedIndex, setFocusedIndex] = useState(firstEnabledIndex);
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    buttonsRef.current[firstEnabledIndex]?.focus();
  }, [firstEnabledIndex, itemsKey]);

  function moveFocus(index: number, step: number) {
    let next = Math.max(0, Math.min(items.length - 1, index));
    while (items[next]?.isDisabled && next >= 0 && next < items.length) next += step;
    if (next < 0 || next >= items.length || items[next]?.isDisabled) return;
    setFocusedIndex(next);
    buttonsRef.current[next]?.focus();
  }

  return (
    <div
      aria-label={label}
      data-wcl-calendar-hierarchy=""
      onKeyDown={(event) => {
        const current = Number((event.target as HTMLElement).dataset['hierarchyIndex']);
        if (!Number.isInteger(current)) return;
        let next: number | null = null;
        if (event.key === 'ArrowLeft') next = current + (direction === 'rtl' ? 1 : -1);
        else if (event.key === 'ArrowRight') next = current + (direction === 'rtl' ? -1 : 1);
        else if (event.key === 'ArrowUp') next = current - 4;
        else if (event.key === 'ArrowDown') next = current + 4;
        else if (event.key === 'Home') next = items.findIndex((item) => !item.isDisabled);
        else if (event.key === 'End') {
          next = items.length - 1;
          while (next >= 0 && items[next]?.isDisabled) next -= 1;
        } else if (event.key === 'PageUp') onPage('previous');
        else if (event.key === 'PageDown') onPage('next');
        else return;
        event.preventDefault();
        if (next !== null && next >= 0) {
          const step =
            event.key === 'Home' ? 1 : event.key === 'End' ? -1 : next < current ? -1 : 1;
          moveFocus(next, step);
        }
      }}
      role="grid"
    >
      {chunkItems(items).map((row, rowIndex) => (
        <div key={row.map((item) => item.date.toString()).join('-')} role="row">
          {row.map((item, columnIndex) => {
            const index = rowIndex * 4 + columnIndex;
            return (
              <div key={`${item.date.toString()}-${item.label}`} role="gridcell">
                <button
                  aria-label={item.label}
                  data-hierarchy-index={index}
                  data-wcl-calendar-hierarchy-item=""
                  disabled={item.isDisabled}
                  onFocus={() => setFocusedIndex(index)}
                  onClick={() => onSelect(item.date)}
                  ref={(element) => {
                    buttonsRef.current[index] = element;
                  }}
                  tabIndex={index === focusedIndex ? 0 : -1}
                  type="button"
                >
                  {item.label}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function DayHeadings({
  monthFormatter,
  monthName,
  onOpen,
  range,
  state,
  yearFormatter,
  yearName,
}: {
  readonly monthFormatter: Intl.DateTimeFormat;
  readonly monthName: string;
  readonly onOpen: (panel: Panel, target: 'month' | 'year') => void;
  readonly range: boolean;
  readonly state: CalendarSheetState;
  readonly yearFormatter: Intl.DateTimeFormat;
  readonly yearName: string;
}): ReactElement {
  const months = range
    ? [state.visibleRange.start, state.visibleRange.start.add({months: 1})]
    : [state.visibleRange.start];

  return (
    <div data-wcl-calendar-headings="" data-wcl-calendar-headings-range={range || undefined}>
      {months.map((date, index) => {
        const panel = index as Panel;
        const month = monthFormatter.format(date.toDate(state.timeZone));
        const year = yearFormatter.format(date.toDate(state.timeZone));
        return (
          <div data-wcl-calendar-heading="" key={date.toString()}>
            <Button
              aria-label={`${monthName}: ${month}`}
              data-wcl-calendar-heading-part="month"
              onPress={() => onOpen(panel, 'month')}
              slot={null}
            >
              {month}
            </Button>
            <Button
              aria-label={`${yearName}: ${year}`}
              data-wcl-calendar-heading-part="year"
              onPress={() => onOpen(panel, 'year')}
              slot={null}
            >
              {year}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
