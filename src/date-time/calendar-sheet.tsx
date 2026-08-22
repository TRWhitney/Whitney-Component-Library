'use client';

import {CalendarDate, endOfMonth, parseDate, toCalendar} from '@internationalized/date';
import {useDateFormatter} from 'react-aria/useDateFormatter';
import {useLocale} from 'react-aria/I18nProvider';
import {dictionary} from 'react-aria/i18n';
import {Button} from 'react-aria-components/Button';
import {
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarStateContext,
} from 'react-aria-components/Calendar';
import {RangeCalendarStateContext} from 'react-aria-components/RangeCalendar';
import {DateRangePickerStateContext} from 'react-aria-components/DateRangePicker';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from 'react';

import {
  DayHeadings,
  HierarchyGrid,
  NavigationIcon,
  type CalendarSheetState,
  type HierarchyItem,
  type Panel,
} from './calendar-sheet-parts.js';

type Endpoint = 'end' | 'start';
type NavigationView =
  | {readonly kind: 'day'}
  | {readonly anchor: CalendarDate; readonly kind: 'month'; readonly panel: Panel}
  | {
      readonly anchor: CalendarDate;
      readonly kind: 'period';
      readonly panel: Panel;
      readonly unit: number;
    };

interface DragInteraction {
  readonly crossed: boolean;
  readonly fixed: CalendarDate;
  readonly hasMoved: boolean;
  readonly originActive: Endpoint;
  readonly originDate: CalendarDate;
  readonly pointerId: number;
  readonly role: Endpoint;
  readonly startX: number;
  readonly startY: number;
}

interface PendingCalendarPress {
  readonly date: CalendarDate;
  readonly pointerId: number;
}

interface CalendarRange {
  readonly end: CalendarDate;
  readonly start: CalendarDate;
}

const minimumIsoDate = new CalendarDate(1, 1, 1);
const maximumIsoDate = new CalendarDate(9999, 12, 31);
const maximumPeriodUnit = 3;

function normalizeCalendarRange(left: CalendarDate, right: CalendarDate) {
  return left.compare(right) <= 0 ? {end: right, start: left} : {end: left, start: right};
}

const DragRangeContext = createContext<CalendarRange | null>(null);

function CalendarDateCell({date}: {readonly date: CalendarDate}): ReactElement {
  const dragRange = useContext(DragRangeContext);
  const isDragStart = dragRange?.start.compare(date) === 0;
  const isDragEnd = dragRange?.end.compare(date) === 0;
  const isDragSelected =
    dragRange !== null && dragRange.start.compare(date) <= 0 && dragRange.end.compare(date) >= 0;
  return (
    <CalendarCell
      data-wcl-calendar-cell=""
      data-wcl-calendar-date={date.toString()}
      data-wcl-drag-selected={isDragSelected || undefined}
      data-wcl-drag-selection-end={isDragEnd || undefined}
      data-wcl-drag-selection-start={isDragStart || undefined}
      date={date}
    />
  );
}

function CalendarGridSheet({offset}: {readonly offset?: {readonly months: number}}): ReactElement {
  return (
    <CalendarGrid
      data-wcl-calendar-grid=""
      {...(offset === undefined ? {} : {offset})}
      weekdayStyle="short"
    >
      <CalendarGridHeader>
        {(day) => <CalendarHeaderCell data-wcl-calendar-weekday="">{day}</CalendarHeaderCell>}
      </CalendarGridHeader>
      <CalendarGridBody>{(date) => <CalendarDateCell date={date} />}</CalendarGridBody>
    </CalendarGrid>
  );
}

function clampDate(date: CalendarDate, minimum: CalendarDate, maximum: CalendarDate): CalendarDate {
  if (date.compare(minimum) < 0) return minimum;
  if (date.compare(maximum) > 0) return maximum;
  return date;
}

function intersectsBounds(
  start: CalendarDate,
  end: CalendarDate,
  minimum: CalendarDate,
  maximum: CalendarDate,
): boolean {
  return end.compare(minimum) >= 0 && start.compare(maximum) <= 0;
}

export function CalendarSheet({
  activeEndpoint = 'start',
  onActiveEndpointChange,
  range = false,
}: {
  readonly activeEndpoint?: Endpoint;
  readonly onActiveEndpointChange?: (endpoint: Endpoint) => void;
  readonly range?: boolean;
}): ReactElement {
  const calendarState = useContext(CalendarStateContext);
  const rangeState = useContext(RangeCalendarStateContext);
  const state = calendarState ?? rangeState;
  if (!state) throw new Error('CalendarSheet must be rendered inside Calendar or RangeCalendar.');

  return (
    <CalendarSheetWithState
      activeEndpoint={activeEndpoint}
      range={range}
      state={state}
      {...(onActiveEndpointChange === undefined ? {} : {onActiveEndpointChange})}
    />
  );
}

function CalendarSheetWithState({
  activeEndpoint,
  onActiveEndpointChange,
  range,
  state,
}: {
  readonly activeEndpoint: Endpoint;
  readonly onActiveEndpointChange?: (endpoint: Endpoint) => void;
  readonly range: boolean;
  readonly state: CalendarSheetState;
}): ReactElement {
  const [navigation, setNavigation] = useState<NavigationView>({kind: 'day'});
  const [drag, setDrag] = useState<DragInteraction | null>(null);
  const [dragRange, setDragRange] = useState<CalendarRange | null>(null);
  const [edge, setEdge] = useState<'next' | 'previous' | null>(null);
  const pickerState = useContext(DateRangePickerStateContext);
  const pendingAlignedFocus = useRef<CalendarDate | null>(null);
  const dragRef = useRef<DragInteraction | null>(null);
  const pendingPressRef = useRef<PendingCalendarPress | null>(null);
  const calendarSheetRef = useRef<HTMLDivElement>(null);
  const suppressClickRef = useRef(false);
  const suppressClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingKeyboardDateRef = useRef<CalendarDate | null>(null);
  const {direction, locale} = useLocale();
  const monthFormatter = useDateFormatter({month: 'long', timeZone: state.timeZone});
  const monthItemFormatter = useDateFormatter({month: 'short', timeZone: state.timeZone});
  const yearFormatter = useDateFormatter({year: 'numeric', timeZone: state.timeZone});
  const localizedMessages = useMemo(() => {
    const packages = dictionary.getStringsForLocale(locale) as unknown as Record<
      string,
      Record<string, string>
    >;
    return {
      endDate: packages['@react-aria/datepicker']?.['endDate'] ?? '',
      month: packages['@react-aria/datepicker']?.['month'] ?? '',
      next: packages['@react-aria/calendar']?.['next'] ?? '',
      previous: packages['@react-aria/calendar']?.['previous'] ?? '',
      startDate: packages['@react-aria/datepicker']?.['startDate'] ?? '',
      year: packages['@react-aria/datepicker']?.['year'] ?? '',
    };
  }, [locale]);
  const monthName = localizedMessages.month;
  const yearName = localizedMessages.year;
  const supportedMinimum = toCalendar(minimumIsoDate, state.visibleRange.start.calendar);
  const supportedMaximum = toCalendar(maximumIsoDate, state.visibleRange.start.calendar);
  const selectionMinimum = (state.minValue as CalendarDate | null) ?? supportedMinimum;
  const selectionMaximum = (state.maxValue as CalendarDate | null) ?? supportedMaximum;

  const suppressNextClick = useCallback(() => {
    suppressClickRef.current = true;
    if (suppressClickTimerRef.current !== null) clearTimeout(suppressClickTimerRef.current);
    suppressClickTimerRef.current = setTimeout(() => {
      suppressClickRef.current = false;
      suppressClickTimerRef.current = null;
    }, 0);
  }, []);

  useEffect(
    () => () => {
      if (suppressClickTimerRef.current !== null) clearTimeout(suppressClickTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!pendingAlignedFocus.current || navigation.kind !== 'day') return;
    const date = pendingAlignedFocus.current;
    pendingAlignedFocus.current = null;
    state.setFocusedDate(date);
  }, [navigation, state]);

  const chooseRangeDate = useCallback(
    (date: CalendarDate) => {
      if (!pickerState || !onActiveEndpointChange) return;
      const current = pickerState.dateRange;
      if (activeEndpoint === 'start') {
        if (current?.end) {
          pickerState.setDateRange(normalizeCalendarRange(date, current.end as CalendarDate));
        } else pickerState.setDate('start', date);
        onActiveEndpointChange('end');
        return;
      }

      const start = current?.start;
      if (!start) {
        pickerState.setDate('start', date);
        onActiveEndpointChange('end');
        return;
      }
      pickerState.setDateRange(normalizeCalendarRange(start as CalendarDate, date));
      pickerState.close();
    },
    [activeEndpoint, onActiveEndpointChange, pickerState],
  );

  function beginDrag(event: React.PointerEvent, role: Endpoint) {
    const current = pickerState?.dateRange;
    if (
      !pickerState ||
      !onActiveEndpointChange ||
      state.isDisabled ||
      state.isReadOnly ||
      !current?.start ||
      !current.end
    ) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const fixed = (role === 'start' ? current.end : current.start) as CalendarDate;
    const originDate = (role === 'start' ? current.start : current.end) as CalendarDate;
    const interaction = {
      crossed: false,
      fixed,
      hasMoved: false,
      originActive: activeEndpoint,
      originDate,
      pointerId: event.pointerId,
      role,
      startX: event.clientX,
      startY: event.clientY,
    } satisfies DragInteraction;
    dragRef.current = interaction;
    setDrag(interaction);
    setDragRange(
      normalizeCalendarRange(current.start as CalendarDate, current.end as CalendarDate),
    );
  }

  const previewDrag = useCallback(
    (date: CalendarDate, clearEdge = true, allowOutsideVisibleRange = false) => {
      const interaction = dragRef.current;
      const isOutsideBounds =
        (state.minValue !== null &&
          state.minValue !== undefined &&
          date.compare(state.minValue) < 0) ||
        (state.maxValue !== null &&
          state.maxValue !== undefined &&
          date.compare(state.maxValue) > 0);
      if (
        !interaction ||
        !pickerState ||
        isOutsideBounds ||
        (!allowOutsideVisibleRange && state.isCellDisabled(date)) ||
        state.isCellUnavailable(date)
      ) {
        return;
      }
      const crossed =
        interaction.role === 'start'
          ? date.compare(interaction.fixed) > 0
          : date.compare(interaction.fixed) < 0;
      const next = {
        ...interaction,
        crossed,
        hasMoved: interaction.hasMoved || date.compare(interaction.originDate) !== 0,
      };
      dragRef.current = next;
      const nextRange = normalizeCalendarRange(date, interaction.fixed);
      setDragRange(nextRange);
      pickerState.setDateRange(nextRange);
      if (clearEdge) setEdge(null);
    },
    [pickerState, state],
  );

  useEffect(() => {
    if (!drag) return;
    const finish = (event: PointerEvent) => {
      const interaction = dragRef.current;
      if (!interaction || event.pointerId !== interaction.pointerId) return;
      dragRef.current = null;
      setDrag(null);
      setDragRange(null);
      setEdge(null);
      if (event.type !== 'pointerup') return;
      suppressNextClick();
      if (!interaction.hasMoved) {
        chooseRangeDate(interaction.originDate);
        return;
      }
      const settledRole: Endpoint = interaction.crossed
        ? interaction.role === 'start'
          ? 'end'
          : 'start'
        : interaction.role;
      onActiveEndpointChange?.(settledRole === 'start' ? 'end' : interaction.originActive);
    };
    const move = (event: PointerEvent) => {
      const interaction = dragRef.current;
      if (!interaction || event.pointerId !== interaction.pointerId) return;
      if (
        !interaction.hasMoved &&
        Math.hypot(event.clientX - interaction.startX, event.clientY - interaction.startY) > 4
      ) {
        dragRef.current = {...interaction, hasMoved: true};
      }
      const target = document
        .elementFromPoint?.(event.clientX, event.clientY)
        ?.closest<HTMLElement>('[data-wcl-calendar-date]');
      const dateValue = target?.dataset['wclCalendarDate'];
      if (dateValue) {
        setEdge(null);
        previewDrag(toCalendar(parseDate(dateValue), state.visibleRange.start.calendar));
        return;
      }
      const sheet = calendarSheetRef.current?.getBoundingClientRect();
      if (!sheet) {
        setEdge(null);
        return;
      }
      const edgeBand = Math.min(56, Math.max(36, sheet.width / 14));
      const withinVerticalBand =
        event.clientY >= sheet.top - edgeBand / 2 && event.clientY <= sheet.bottom + edgeBand / 2;
      if (!withinVerticalBand) setEdge(null);
      else if (event.clientX <= sheet.left + edgeBand)
        setEdge(direction === 'rtl' ? 'next' : 'previous');
      else if (event.clientX >= sheet.right - edgeBand)
        setEdge(direction === 'rtl' ? 'previous' : 'next');
      else setEdge(null);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', finish);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', finish);
    };
  }, [
    chooseRangeDate,
    direction,
    drag,
    onActiveEndpointChange,
    previewDrag,
    state,
    suppressNextClick,
  ]);

  useEffect(() => {
    if (!drag || !edge) return;
    let timer: ReturnType<typeof setTimeout>;
    const page = () => {
      if (edge === 'next') {
        const nextEnd = state.visibleRange.start.add({months: state.visibleDuration.months ?? 1});
        previewDrag(nextEnd.set({day: nextEnd.calendar.getDaysInMonth(nextEnd)}), false, true);
        state.focusNextPage();
      } else {
        previewDrag(state.visibleRange.start.subtract({months: 1}).set({day: 1}), false, true);
        state.focusPreviousPage();
      }
      timer = setTimeout(page, 500);
    };
    timer = setTimeout(page, 350);
    return () => clearTimeout(timer);
  }, [drag, edge, previewDrag, state]);

  useEffect(() => {
    if (!range || !pickerState?.dateRange?.start || !pickerState.dateRange.end) return;
    const start = pickerState.dateRange.start as CalendarDate;
    const end = pickerState.dateRange.end as CalendarDate;
    if (start.compare(end) > 0) pickerState.setDateRange({end: start, start: end});
  }, [pickerState, range]);

  function startOfCalendarYear(date: CalendarDate): CalendarDate {
    const month = date.calendar.getMinimumMonthInYear?.(date) ?? 1;
    const inMonth = date.set({month});
    const day = inMonth.calendar.getMinimumDayInMonth?.(inMonth) ?? 1;
    return inMonth.set({day});
  }

  function fitPeriodPageStart(anchor: CalendarDate, unit: number, center: boolean): CalendarDate {
    const itemSpan = 10 ** unit;
    const aligned =
      unit === 0
        ? startOfCalendarYear(anchor)
        : startOfCalendarYear(
            anchor.set({year: Math.max(1, Math.floor(anchor.year / itemSpan) * itemSpan)}),
          );
    const desired = center ? aligned.subtract({years: itemSpan * 5}) : aligned;
    const shiftedLatest = supportedMaximum.subtract({years: itemSpan * 12});
    const latest =
      shiftedLatest.compare(supportedMinimum) <= 0
        ? supportedMinimum
        : shiftedLatest.add({days: 1});
    const latestStart = latest.compare(supportedMinimum) < 0 ? supportedMinimum : latest;
    return clampDate(desired, supportedMinimum, latestStart);
  }

  function buildHierarchyItems(view: NavigationView): readonly HierarchyItem[] {
    if (view.kind === 'day') return [];
    if (view.kind === 'month') {
      const minimumMonth = view.anchor.calendar.getMinimumMonthInYear?.(view.anchor) ?? 1;
      const monthCount = view.anchor.calendar.getMonthsInYear(view.anchor);
      return Array.from({length: monthCount}, (_, index) => {
        const inMonth = view.anchor.set({month: minimumMonth + index});
        const minimumDay = inMonth.calendar.getMinimumDayInMonth?.(inMonth) ?? 1;
        const date = inMonth.set({day: minimumDay});
        const endDate = endOfMonth(date);
        const displayDate = date.calendar.getFormattableMonth?.(date) ?? date;
        return {
          date,
          endDate,
          isDisabled: !intersectsBounds(date, endDate, selectionMinimum, selectionMaximum),
          label: monthItemFormatter.format(displayDate.toDate(state.timeZone)),
        };
      });
    }

    const itemSpan = 10 ** view.unit;
    const items: HierarchyItem[] = [];
    for (let index = 0; index < 12; index += 1) {
      const date = view.anchor.add({years: index * itemSpan});
      if (date.compare(supportedMaximum) > 0 || items.at(-1)?.date.compare(date) === 0) break;
      const following = date.add({years: itemSpan});
      const endDate =
        following.compare(date) <= 0 || following.compare(supportedMaximum) >= 0
          ? supportedMaximum
          : following.subtract({days: 1});
      items.push({
        date,
        endDate,
        isDisabled: !intersectsBounds(date, endDate, selectionMinimum, selectionMaximum),
        label:
          view.unit === 0
            ? yearFormatter.format(date.toDate(state.timeZone))
            : yearFormatter.formatRange(
                date.toDate(state.timeZone),
                endDate.toDate(state.timeZone),
              ),
      });
      if (endDate.compare(supportedMaximum) === 0) break;
    }
    return items;
  }

  const hierarchyItems = buildHierarchyItems(navigation);

  function openHierarchy(panel: Panel, target: 'month' | 'year') {
    const anchor = state.visibleRange.start.add({months: panel});
    setNavigation(
      target === 'month'
        ? {anchor, kind: 'month', panel}
        : {
            anchor: fitPeriodPageStart(startOfCalendarYear(anchor), 0, true),
            kind: 'period',
            panel,
            unit: 0,
          },
    );
  }

  function hierarchyPage(directionToPage: 'next' | 'previous'): NavigationView | null {
    if (navigation.kind === 'day') return null;
    const amount = navigation.kind === 'month' ? 1 : 10 ** navigation.unit * 12;
    const candidate = navigation.anchor.add({
      years: directionToPage === 'next' ? amount : -amount,
    });
    const anchor =
      navigation.kind === 'month'
        ? clampDate(candidate, supportedMinimum, supportedMaximum)
        : fitPeriodPageStart(candidate, navigation.unit, false);
    if (anchor.compare(navigation.anchor) === 0) return null;
    const target = {...navigation, anchor};
    return buildHierarchyItems(target).some((item) => !item.isDisabled) ? target : null;
  }

  function pageHierarchy(directionToPage: 'next' | 'previous') {
    const target = hierarchyPage(directionToPage);
    if (target) setNavigation(target);
  }

  function settleDayView(date: CalendarDate, panel: Panel) {
    const boundedDate = clampDate(date, selectionMinimum, selectionMaximum);
    if (panel === 1 && boundedDate.compare(state.visibleRange.end) > 0) {
      pendingAlignedFocus.current = boundedDate;
      state.setFocusedDate(boundedDate.add({months: 1}));
    } else if (panel === 0 && boundedDate.compare(state.visibleRange.start) < 0) {
      pendingAlignedFocus.current = boundedDate;
      state.setFocusedDate(boundedDate.subtract({months: 1}));
    } else state.setFocusedDate(boundedDate);
    setNavigation({kind: 'day'});
  }

  function selectHierarchyItem(date: CalendarDate) {
    if (navigation.kind === 'day') return;
    if (navigation.kind === 'month') {
      settleDayView(date, navigation.panel);
      return;
    }
    if (navigation.unit === 0) {
      setNavigation({anchor: date, kind: 'month', panel: navigation.panel});
      return;
    }
    const unit = navigation.unit - 1;
    setNavigation({
      ...navigation,
      anchor: fitPeriodPageStart(date, unit, false),
      unit,
    });
  }

  const hierarchyLabel = (() => {
    if (navigation.kind === 'day') return '';
    if (navigation.kind === 'month') {
      return `${yearName}: ${yearFormatter.format(navigation.anchor.toDate(state.timeZone))}`;
    }
    const first = hierarchyItems[0];
    const last = hierarchyItems.at(-1);
    if (!first || !last) return yearName;
    return `${yearName}: ${yearFormatter.formatRange(
      first.date.toDate(state.timeZone),
      last.endDate.toDate(state.timeZone),
    )}`;
  })();

  const hierarchyHeading = (() => {
    if (navigation.kind === 'day') return null;
    if (navigation.kind === 'month') {
      const year = yearFormatter.format(navigation.anchor.toDate(state.timeZone));
      return (
        <Button
          aria-label={`${yearName}: ${year}`}
          data-wcl-calendar-period-heading=""
          onPress={() =>
            setNavigation({
              ...navigation,
              anchor: fitPeriodPageStart(navigation.anchor, 0, true),
              kind: 'period',
              unit: 0,
            })
          }
          slot={null}
        >
          {year}
        </Button>
      );
    }
    const atMaximumPeriod = navigation.unit >= maximumPeriodUnit;
    return (
      <Button
        aria-label={hierarchyLabel}
        data-wcl-calendar-period-heading=""
        isDisabled={atMaximumPeriod}
        onPress={() => {
          if (atMaximumPeriod) return;
          const unit = navigation.unit + 1;
          const center = hierarchyItems[Math.floor(hierarchyItems.length / 2)]?.date;
          if (!center) return;
          setNavigation({
            ...navigation,
            anchor: fitPeriodPageStart(center, unit, true),
            unit,
          });
        }}
        slot={null}
      >
        {hierarchyLabel.slice(yearName.length + 2)}
      </Button>
    );
  })();

  const previousHierarchyPage = hierarchyPage('previous');
  const nextHierarchyPage = hierarchyPage('next');

  return (
    <div
      data-dragging-endpoint={drag?.role}
      data-edge={edge ?? undefined}
      data-active-endpoint={range ? activeEndpoint : undefined}
      data-wcl-calendar-sheet=""
      data-wcl-calendar-sheet-range={range || undefined}
      onKeyDownCapture={(event) => {
        if (!range || navigation.kind !== 'day' || (event.key !== 'Enter' && event.key !== ' ')) {
          return;
        }
        const cell = (event.target as HTMLElement).closest<HTMLElement>('[data-wcl-calendar-date]');
        const value = cell?.dataset['wclCalendarDate'];
        if (
          !cell ||
          !value ||
          cell.hasAttribute('data-disabled') ||
          cell.hasAttribute('data-unavailable')
        ) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (!event.repeat) {
          pendingKeyboardDateRef.current = toCalendar(
            parseDate(value),
            state.visibleRange.start.calendar,
          );
        }
      }}
      onKeyUpCapture={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const date = pendingKeyboardDateRef.current;
        if (!date) return;
        event.preventDefault();
        event.stopPropagation();
        pendingKeyboardDateRef.current = null;
        suppressNextClick();
        chooseRangeDate(date);
      }}
      onPointerDownCapture={(event) => {
        if (!range || navigation.kind !== 'day') return;
        const cell = (event.target as HTMLElement).closest<HTMLElement>('[data-wcl-calendar-date]');
        const value = cell?.dataset['wclCalendarDate'];
        if (
          !cell ||
          !value ||
          cell.hasAttribute('data-disabled') ||
          cell.hasAttribute('data-unavailable')
        ) {
          return;
        }
        if (cell?.hasAttribute('data-selection-start')) beginDrag(event, 'start');
        else if (cell?.hasAttribute('data-selection-end')) beginDrag(event, 'end');
        else {
          event.preventDefault();
          event.stopPropagation();
          pendingPressRef.current = {
            date: toCalendar(parseDate(value), state.visibleRange.start.calendar),
            pointerId: event.pointerId,
          };
        }
      }}
      onPointerUpCapture={(event) => {
        const pending = pendingPressRef.current;
        if (!pending || pending.pointerId !== event.pointerId) return;
        event.preventDefault();
        event.stopPropagation();
        pendingPressRef.current = null;
        suppressNextClick();
        chooseRangeDate(pending.date);
      }}
      onPointerCancelCapture={() => {
        pendingPressRef.current = null;
      }}
      onPointerOverCapture={(event) => {
        if (!dragRef.current) return;
        const cell = (event.target as HTMLElement).closest<HTMLElement>('[data-wcl-calendar-date]');
        const value = cell?.dataset['wclCalendarDate'];
        if (value) {
          setEdge(null);
          previewDrag(toCalendar(parseDate(value), state.visibleRange.start.calendar));
        }
      }}
      onClickCapture={(event) => {
        if (!range || navigation.kind !== 'day') return;
        if (suppressClickRef.current) {
          suppressClickRef.current = false;
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        const cell = (event.target as HTMLElement).closest<HTMLElement>('[data-wcl-calendar-date]');
        const value = cell?.dataset['wclCalendarDate'];
        if (
          !cell ||
          !value ||
          cell.hasAttribute('data-disabled') ||
          cell.hasAttribute('data-unavailable')
        ) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        chooseRangeDate(toCalendar(parseDate(value), state.visibleRange.start.calendar));
      }}
      ref={calendarSheetRef}
    >
      <header data-wcl-calendar-header="">
        {navigation.kind === 'day' ? (
          <Button data-wcl-calendar-navigation="" slot="previous">
            <NavigationIcon direction="previous" />
          </Button>
        ) : (
          <Button
            aria-label={`${localizedMessages.previous}: ${hierarchyLabel}`}
            data-wcl-calendar-navigation=""
            isDisabled={previousHierarchyPage === null}
            onPress={() => pageHierarchy('previous')}
            slot={null}
          >
            <NavigationIcon direction="previous" />
          </Button>
        )}
        {navigation.kind === 'day' ? (
          <DayHeadings
            monthFormatter={monthFormatter}
            monthName={monthName}
            onOpen={openHierarchy}
            range={range}
            state={state}
            yearFormatter={yearFormatter}
            yearName={yearName}
          />
        ) : (
          hierarchyHeading
        )}
        {navigation.kind === 'day' ? (
          <Button data-wcl-calendar-navigation="" slot="next">
            <NavigationIcon direction="next" />
          </Button>
        ) : (
          <Button
            aria-label={`${localizedMessages.next}: ${hierarchyLabel}`}
            data-wcl-calendar-navigation=""
            isDisabled={nextHierarchyPage === null}
            onPress={() => pageHierarchy('next')}
            slot={null}
          >
            <NavigationIcon direction="next" />
          </Button>
        )}
      </header>
      {navigation.kind === 'day' ? (
        range ? (
          <DragRangeContext.Provider value={dragRange}>
            <div data-wcl-calendar-months="">
              <CalendarGridSheet offset={{months: 0}} />
              <CalendarGridSheet offset={{months: 1}} />
            </div>
          </DragRangeContext.Provider>
        ) : (
          <CalendarGridSheet />
        )
      ) : (
        <HierarchyGrid
          direction={direction}
          items={hierarchyItems}
          key={hierarchyLabel}
          label={hierarchyLabel}
          onPage={pageHierarchy}
          onSelect={selectHierarchyItem}
        />
      )}
      <span aria-live="polite" data-wcl-calendar-announcement="">
        {navigation.kind === 'day'
          ? range
            ? activeEndpoint === 'start'
              ? localizedMessages.startDate
              : localizedMessages.endDate
            : ''
          : hierarchyLabel}
      </span>
    </div>
  );
}
