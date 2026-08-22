import {CalendarDate} from '@internationalized/date';
import {I18nProvider} from 'react-aria/I18nProvider';
import {Button as AriaButton} from 'react-aria-components/Button';
import {
  DateRangePicker as AriaDateRangePicker,
  DateRangePickerStateContext,
} from 'react-aria-components/DateRangePicker';
import {Dialog} from 'react-aria-components/Dialog';
import {Group} from 'react-aria-components/Group';
import {Label} from 'react-aria-components/Label';
import {Popover} from 'react-aria-components/Popover';
import {
  StrictMode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from 'react';
import {createRoot} from 'react-dom/client';
import type {DateRangePickerState} from 'react-stately/useDateRangePickerState';

import {AppearanceProvider} from '../../src/index.js';
import {CalendarIcon, DateSegments} from '../../src/date-time/date-time-parts.js';
import {FieldSupport} from '../../src/fields/field-support.js';
import '../../src/styles.css';
import './date-range-navigation.css';

type Endpoint = 'end' | 'start';
type Edge = 'next' | 'previous';

interface PrototypeDate {
  readonly day: number;
  readonly month: number;
  readonly year: number;
}

interface CompleteRange {
  readonly end: PrototypeDate;
  readonly start: PrototypeDate;
}

interface DragState {
  readonly originActive: Endpoint;
  readonly pointerId: number;
  readonly role: Endpoint;
}

type NavigationView =
  | {readonly kind: 'day'}
  | {readonly kind: 'month'; readonly panel: 0 | 1; readonly year: number}
  | {
      readonly anchorYear: number;
      readonly kind: 'period';
      readonly panel: 0 | 1;
      readonly unit: number;
    };

const initialRange = {
  start: {day: 20, month: 8, year: 2026},
  end: {day: 27, month: 8, year: 2026},
} satisfies CompleteRange;
const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const monthFormatter = new Intl.DateTimeFormat('en-US', {month: 'long', timeZone: 'UTC'});
const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
  year: 'numeric',
});

function toNative(date: PrototypeDate): Date {
  return new Date(Date.UTC(date.year, date.month - 1, date.day));
}

function dateKey(date: PrototypeDate): string {
  return `${String(date.year).padStart(4, '0')}-${String(date.month).padStart(2, '0')}-${String(
    date.day,
  ).padStart(2, '0')}`;
}

function parseDate(value: string): PrototypeDate {
  const [year = '0', month = '1', day = '1'] = value.split('-');
  return {day: Number(day), month: Number(month), year: Number(year)};
}

function fromCalendarDate(date: CalendarDate): PrototypeDate {
  return {day: date.day, month: date.month, year: date.year};
}

function toCalendarDate(date: PrototypeDate): CalendarDate {
  return new CalendarDate(date.year, date.month, date.day);
}

function toCalendarRange(range: CompleteRange) {
  return {end: toCalendarDate(range.end), start: toCalendarDate(range.start)};
}

function PickerStateBridge({
  stateRef,
}: {
  readonly stateRef: {current: DateRangePickerState | null};
}) {
  const state = useContext(DateRangePickerStateContext);

  useEffect(() => {
    stateRef.current = state;
    return () => {
      stateRef.current = null;
    };
  }, [state, stateRef]);

  return null;
}

function compareDates(left: PrototypeDate, right: PrototypeDate): number {
  return toNative(left).getTime() - toNative(right).getTime();
}

function sameDate(left: PrototypeDate, right: PrototypeDate): boolean {
  return compareDates(left, right) === 0;
}

function normalizeRange(left: PrototypeDate, right: PrototypeDate): CompleteRange {
  return compareDates(left, right) <= 0 ? {end: right, start: left} : {end: left, start: right};
}

function addMonths(date: PrototypeDate, amount: number): PrototypeDate {
  const native = new Date(Date.UTC(date.year, date.month - 1 + amount, 1));
  return {day: 1, month: native.getUTCMonth() + 1, year: native.getUTCFullYear()};
}

function daysInMonth(date: PrototypeDate): number {
  return new Date(Date.UTC(date.year, date.month, 0)).getUTCDate();
}

function monthName(month: number): string {
  return monthFormatter.format(new Date(Date.UTC(2026, month - 1, 1)));
}

function periodItemLabel(year: number, unit: number): string {
  if (unit === 0) return String(year);
  const span = 10 ** unit;
  if (unit === 1) return `${year}s`;
  return `${year}–${year + span - 1}`;
}

function periodStart(anchorYear: number, unit: number): number {
  const itemSpan = 10 ** unit;
  const pageSpan = itemSpan * 10;
  return Math.floor(anchorYear / pageSpan) * pageSpan;
}

function NavigationIcon({direction}: {readonly direction: Edge}) {
  return (
    <svg aria-hidden="true" data-direction={direction} viewBox="0 0 20 20">
      <path d="m12.5 5-5 5 5 5" />
    </svg>
  );
}

function MonthGrid({
  active,
  displayRange,
  dragging,
  month,
  onDayClick,
  onEndpointPointerDown,
}: {
  readonly active: Endpoint;
  readonly displayRange: CompleteRange | null;
  readonly dragging: DragState | null;
  readonly month: PrototypeDate;
  readonly onDayClick: (date: PrototypeDate) => void;
  readonly onEndpointPointerDown: (event: PointerEvent<HTMLButtonElement>, role: Endpoint) => void;
}) {
  const firstWeekday = toNative(month).getUTCDay();
  const count = daysInMonth(month);
  const cells = Array.from({length: 42}, (_, index) => {
    const day = index - firstWeekday + 1;
    return day >= 1 && day <= count ? {...month, day} : null;
  });

  return (
    <table aria-label={`${monthName(month.month)} ${month.year}`} data-prototype-part="month grid">
      <caption>{`${monthName(month.month)} ${month.year}`}</caption>
      <thead>
        <tr>
          {weekdayLabels.map((weekday) => (
            <th abbr={weekday} key={weekday} scope="col">
              {weekday.slice(0, 2)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({length: 6}, (_, row) => (
          <tr key={row}>
            {cells.slice(row * 7, row * 7 + 7).map((date, column) => {
              if (!date) return <td aria-hidden="true" key={`empty-${column}`} />;
              const isStart = Boolean(displayRange && sameDate(date, displayRange.start));
              const isEnd = Boolean(displayRange && sameDate(date, displayRange.end));
              const isSelected = Boolean(
                displayRange &&
                compareDates(date, displayRange.start) >= 0 &&
                compareDates(date, displayRange.end) <= 0,
              );
              const endpoint: Endpoint | null = isStart ? 'start' : isEnd ? 'end' : null;
              const isActive = endpoint === active;

              return (
                <td key={`day-${date.day}`}>
                  <button
                    aria-label={fullDateFormatter.format(toNative(date))}
                    aria-pressed={isSelected}
                    data-active-endpoint={isActive || undefined}
                    data-dragging={endpoint === dragging?.role || undefined}
                    data-endpoint={endpoint ?? undefined}
                    data-prototype-date={dateKey(date)}
                    data-prototype-part={endpoint ? `${endpoint} endpoint` : 'day'}
                    data-selected={isSelected || undefined}
                    onClick={() => onDayClick(date)}
                    onPointerDown={(event) => {
                      if (endpoint) onEndpointPointerDown(event, endpoint);
                    }}
                    type="button"
                  >
                    {date.day}
                  </button>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Prototype() {
  const [active, setActive] = useState<Endpoint>('start');
  const [drag, setDrag] = useState<DragState | null>(null);
  const [dragRange, setDragRange] = useState<CompleteRange | null>(null);
  const [edge, setEdge] = useState<Edge | null>(null);
  const [identifiedPart, setIdentifiedPart] = useState('none');
  const [identify, setIdentify] = useState(false);
  const [navigation, setNavigation] = useState<NavigationView>({kind: 'day'});
  const [open, setOpen] = useState(false);
  const [pendingStart, setPendingStart] = useState<PrototypeDate | null>(null);
  const [range, setRange] = useState<CompleteRange | null>(initialRange);
  const [viewStart, setViewStart] = useState<PrototypeDate>({day: 1, month: 8, year: 2026});
  const calendarRef = useRef<HTMLDivElement>(null);
  const pickerStateRef = useRef<DateRangePickerState | null>(null);
  const repeatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const viewStartRef = useRef(viewStart);
  const settledRange = useMemo(
    () => (range ? normalizeRange(range.start, range.end) : null),
    [range],
  );
  const displayRange = dragRange ?? settledRange;
  const rightMonth = addMonths(viewStart, 1);
  const announcement = drag
    ? `Dragging ${drag.role} endpoint. Releasing keeps the calendar open.`
    : `Editing ${active} endpoint.`;

  useEffect(() => {
    viewStartRef.current = viewStart;
  }, [viewStart]);

  useEffect(() => {
    if (!identify) {
      delete document.body.dataset['identify'];
      return;
    }

    document.body.dataset['identify'] = '';
    const identifyPart = (event: Event) => {
      if (!(event.target instanceof HTMLElement)) return;
      const part =
        event.target.closest<HTMLElement>('[data-prototype-part]')?.dataset['prototypePart'];
      if (part) setIdentifiedPart(part);
    };
    document.addEventListener('focusin', identifyPart);
    document.addEventListener('pointerover', identifyPart);
    return () => {
      delete document.body.dataset['identify'];
      document.removeEventListener('focusin', identifyPart);
      document.removeEventListener('pointerover', identifyPart);
    };
  }, [identify]);

  function page(direction: Edge) {
    if (navigation.kind === 'day') {
      setViewStart((current) => addMonths(current, direction === 'next' ? 1 : -1));
      return;
    }
    if (navigation.kind === 'month') {
      setNavigation({...navigation, year: navigation.year + (direction === 'next' ? 1 : -1)});
      return;
    }
    const itemSpan = 10 ** navigation.unit;
    const amount = itemSpan * 10 * (direction === 'next' ? 1 : -1);
    setNavigation({...navigation, anchorYear: navigation.anchorYear + amount});
  }

  function commitRange(nextRange: CompleteRange) {
    const pickerState = pickerStateRef.current;
    if (pickerState) pickerState.setDateRange(toCalendarRange(nextRange));
    else setRange(nextRange);
  }

  useEffect(() => {
    if (!drag || !edge) return;
    let first = true;
    const advance = () => {
      const nextViewStart = addMonths(viewStartRef.current, edge === 'next' ? 1 : -1);
      viewStartRef.current = nextViewStart;
      setViewStart(nextViewStart);
      const boundary =
        edge === 'next'
          ? (() => {
              const month = addMonths(nextViewStart, 1);
              return {...month, day: daysInMonth(month)};
            })()
          : nextViewStart;
      const fixed = drag.role === 'start' ? settledRange?.end : settledRange?.start;
      if (fixed) setDragRange(normalizeRange(boundary, fixed));
      first = false;
      repeatTimeoutRef.current = setTimeout(advance, 500);
    };
    repeatTimeoutRef.current = setTimeout(advance, first ? 350 : 500);
    return () => {
      if (repeatTimeoutRef.current) clearTimeout(repeatTimeoutRef.current);
      repeatTimeoutRef.current = null;
    };
  }, [drag, edge, settledRange?.end, settledRange?.start]);

  useEffect(() => {
    if (!drag) return;

    const move = (event: globalThis.PointerEvent) => {
      if (event.pointerId !== drag.pointerId) return;
      const target = document
        .elementFromPoint(event.clientX, event.clientY)
        ?.closest<HTMLElement>('[data-prototype-date]');
      const value = target?.dataset['prototypeDate'];
      if (value) {
        const date = parseDate(value);
        const fixed = drag.role === 'start' ? settledRange?.end : settledRange?.start;
        if (fixed) setDragRange(normalizeRange(date, fixed));
        setEdge(null);
        return;
      }

      const bounds = calendarRef.current?.getBoundingClientRect();
      if (!bounds) {
        setEdge(null);
        return;
      }
      const edgeBand = Math.min(56, Math.max(36, bounds.width / 14));
      const withinVerticalBand =
        event.clientY >= bounds.top - edgeBand / 2 && event.clientY <= bounds.bottom + edgeBand / 2;
      if (!withinVerticalBand) setEdge(null);
      else if (event.clientX <= bounds.left + edgeBand) setEdge('previous');
      else if (event.clientX >= bounds.right - edgeBand) setEdge('next');
      else setEdge(null);
    };

    const finish = (event: globalThis.PointerEvent) => {
      if (event.pointerId !== drag.pointerId) return;
      if (dragRange) commitRange(dragRange);
      setActive(drag.role === 'start' ? 'end' : drag.originActive);
      setDrag(null);
      setDragRange(null);
      setEdge(null);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', finish, {once: true});
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', finish);
    };
  }, [drag, dragRange, settledRange]);

  function chooseDay(date: PrototypeDate) {
    if (drag) return;
    if (active === 'start') {
      if (settledRange) commitRange(normalizeRange(date, settledRange.end));
      else {
        setPendingStart(date);
        pickerStateRef.current?.setDate('start', toCalendarDate(date));
      }
      setActive('end');
      return;
    }

    const start = pendingStart ?? settledRange?.start;
    if (!start) {
      setPendingStart(date);
      setActive('end');
      return;
    }
    commitRange(normalizeRange(start, date));
    setPendingStart(null);
    setOpen(false);
  }

  function beginDrag(event: PointerEvent<HTMLButtonElement>, role: Endpoint) {
    if (!settledRange) return;
    event.preventDefault();
    setDrag({originActive: active, pointerId: event.pointerId, role});
    setDragRange(settledRange);
  }

  function openHierarchy(panel: 0 | 1, target: 'month' | 'year') {
    const month = panel === 0 ? viewStart : rightMonth;
    setNavigation(
      target === 'month'
        ? {kind: 'month', panel, year: month.year}
        : {anchorYear: month.year, kind: 'period', panel, unit: 0},
    );
  }

  function alignMonth(year: number, month: number, panel: 0 | 1) {
    const selected = {day: 1, month, year};
    setViewStart(panel === 0 ? selected : addMonths(selected, -1));
    setNavigation({kind: 'day'});
  }

  const periodItems =
    navigation.kind === 'period'
      ? Array.from({length: 12}, (_, index) => {
          const itemSpan = 10 ** navigation.unit;
          return periodStart(navigation.anchorYear, navigation.unit) + index * itemSpan;
        })
      : [];

  return (
    <AppearanceProvider accent="#2878ff" appearance="dark">
      <main
        className="prototype-shell"
        data-identify={identify || undefined}
        onFocusCapture={(event) => {
          const part =
            event.target.closest<HTMLElement>('[data-prototype-part]')?.dataset['prototypePart'];
          if (part) setIdentifiedPart(part);
        }}
        onPointerOver={(event) => {
          const part = (event.target as HTMLElement).closest<HTMLElement>('[data-prototype-part]')
            ?.dataset['prototypePart'];
          if (part) setIdentifiedPart(part);
        }}
      >
        <header className="prototype-intro">
          <div>
            <p className="prototype-kicker">Non-production interaction prototype</p>
            <h1>Date range navigation</h1>
            <p>Exercise endpoint editing, two-month paging, edge dragging, and hierarchy zoom.</p>
          </div>
          <div className="prototype-controls" data-prototype-part="prototype controls">
            <label>
              <input
                checked={identify}
                onChange={(event) => setIdentify(event.target.checked)}
                type="checkbox"
              />
              Identify parts
            </label>
            <button
              onClick={() => {
                setRange(initialRange);
                setPendingStart(null);
                setActive('start');
                setViewStart({day: 1, month: 8, year: 2026});
                setNavigation({kind: 'day'});
                setOpen(false);
              }}
              type="button"
            >
              Reset
            </button>
          </div>
        </header>

        {identify ? <output className="prototype-identifier">Part: {identifiedPart}</output> : null}

        <section className="prototype-stage" data-prototype-part="prototype stage">
          <I18nProvider locale="en-US-u-ca-gregory">
            <AriaDateRangePicker<CalendarDate>
              data-prototype-active-endpoint={open ? active : undefined}
              data-wcl-date-range-picker=""
              data-wcl-field=""
              isOpen={open}
              onChange={(nextRange) =>
                setRange(
                  nextRange
                    ? {
                        end: fromCalendarDate(nextRange.end),
                        start: fromCalendarDate(nextRange.start),
                      }
                    : null,
                )
              }
              onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                if (nextOpen) {
                  if (range && compareDates(range.start, range.end) > 0) {
                    commitRange(normalizeRange(range.start, range.end));
                  }
                  setActive('start');
                  setNavigation({kind: 'day'});
                }
              }}
              placeholderValue={toCalendarDate(initialRange.start)}
              shouldCloseOnSelect={false}
              value={range ? toCalendarRange(range) : null}
            >
              <PickerStateBridge stateRef={pickerStateRef} />
              <Label data-wcl-field-label="">Retained interval</Label>
              <Group
                data-prototype-part="date range field"
                data-wcl-date-picker-control=""
                data-wcl-date-range-control=""
                data-wcl-field-control=""
              >
                <DateSegments slot="start" />
                <span aria-hidden="true" data-wcl-date-range-separator="">
                  –
                </span>
                <DateSegments slot="end" />
                <AriaButton
                  aria-label="Choose retained interval"
                  data-prototype-part="calendar trigger"
                  data-wcl-calendar-trigger=""
                >
                  <CalendarIcon />
                </AriaButton>
              </Group>
              <FieldSupport
                description="Edit either date directly or open the calendar."
                isPending={false}
              />
              <Popover data-wcl-calendar-popover="" offset={6} placement="bottom start">
                <Dialog data-wcl-calendar-dialog="">
                  <div
                    className="prototype-calendar"
                    data-edge={edge ?? undefined}
                    data-prototype-part="calendar dialog"
                    data-wcl-calendar=""
                    data-wcl-range-calendar=""
                    ref={calendarRef}
                  >
                    <div className="prototype-calendar-inner">
                      <header className="prototype-calendar-header">
                        <button
                          aria-label="Previous period"
                          data-prototype-part="previous period"
                          onClick={() => page('previous')}
                          type="button"
                        >
                          <NavigationIcon direction="previous" />
                        </button>

                        {navigation.kind === 'day' ? (
                          <div className="prototype-month-headings">
                            {([viewStart, rightMonth] as const).map((month, index) => {
                              const panel = index as 0 | 1;
                              return (
                                <div
                                  data-prototype-part={`${index === 0 ? 'left' : 'right'} month heading`}
                                  key={dateKey(month)}
                                >
                                  <button
                                    onClick={() => openHierarchy(panel, 'month')}
                                    type="button"
                                  >
                                    {monthName(month.month)}
                                  </button>{' '}
                                  <button
                                    onClick={() => openHierarchy(panel, 'year')}
                                    type="button"
                                  >
                                    {month.year}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <button
                            className="prototype-period-heading"
                            data-prototype-part="hierarchy heading"
                            onClick={() => {
                              if (navigation.kind === 'month') {
                                setNavigation({
                                  anchorYear: navigation.year,
                                  kind: 'period',
                                  panel: navigation.panel,
                                  unit: 0,
                                });
                              } else {
                                setNavigation({...navigation, unit: navigation.unit + 1});
                              }
                            }}
                            type="button"
                          >
                            {navigation.kind === 'month'
                              ? navigation.year
                              : `${periodItemLabel(periodItems[0] ?? navigation.anchorYear, navigation.unit)}–${periodItemLabel(
                                  periodItems[periodItems.length - 1] ?? navigation.anchorYear,
                                  navigation.unit,
                                )}`}
                          </button>
                        )}

                        <button
                          aria-label="Next period"
                          data-prototype-part="next period"
                          onClick={() => page('next')}
                          type="button"
                        >
                          <NavigationIcon direction="next" />
                        </button>
                      </header>

                      {navigation.kind === 'day' ? (
                        <div className="prototype-months" data-prototype-part="two month surface">
                          <MonthGrid
                            active={active}
                            displayRange={displayRange}
                            dragging={drag}
                            month={viewStart}
                            onDayClick={chooseDay}
                            onEndpointPointerDown={beginDrag}
                          />
                          <MonthGrid
                            active={active}
                            displayRange={displayRange}
                            dragging={drag}
                            month={rightMonth}
                            onDayClick={chooseDay}
                            onEndpointPointerDown={beginDrag}
                          />
                        </div>
                      ) : (
                        <div className="prototype-hierarchy" data-prototype-part="hierarchy grid">
                          {navigation.kind === 'month'
                            ? Array.from({length: 12}, (_, index) => (
                                <button
                                  key={index}
                                  onClick={() =>
                                    alignMonth(navigation.year, index + 1, navigation.panel)
                                  }
                                  type="button"
                                >
                                  {monthName(index + 1).slice(0, 3)}
                                </button>
                              ))
                            : periodItems.map((year) => (
                                <button
                                  key={year}
                                  onClick={() => {
                                    if (navigation.unit === 0) {
                                      setNavigation({
                                        kind: 'month',
                                        panel: navigation.panel,
                                        year,
                                      });
                                    } else {
                                      setNavigation({
                                        anchorYear: year,
                                        kind: 'period',
                                        panel: navigation.panel,
                                        unit: navigation.unit - 1,
                                      });
                                    }
                                  }}
                                  type="button"
                                >
                                  {periodItemLabel(year, navigation.unit)}
                                </button>
                              ))}
                        </div>
                      )}
                    </div>
                    <p aria-live="polite" className="prototype-announcement">
                      {announcement}
                    </p>
                  </div>
                </Dialog>
              </Popover>
            </AriaDateRangePicker>
          </I18nProvider>
        </section>

        <aside className="prototype-notes">
          <strong>Try these flows</strong>
          <ol>
            <li>
              Edit a date segment directly, then open the calendar with its button. Direct entry
              remains unchanged.
            </li>
            <li>Choose a new start, then an end. The ordinary end click closes the calendar.</li>
            <li>Reopen the calendar and drag either endpoint. Release keeps it open.</li>
            <li>Drag the start beyond the end. The settled endpoint identities swap.</li>
            <li>Drag to the first or last visible date, then continue beyond the calendar edge.</li>
            <li>
              Click either month or year heading, then promote and drill through the hierarchy.
            </li>
            <li>Narrow the browser and verify that both adjacent months fit without scrolling.</li>
          </ol>
        </aside>
      </main>
    </AppearanceProvider>
  );
}

const root = document.querySelector('#root');
if (!root) throw new Error('The prototype root element is missing.');

createRoot(root).render(
  <StrictMode>
    <Prototype />
  </StrictMode>,
);
