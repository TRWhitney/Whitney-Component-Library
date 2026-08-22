import {act, cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import {CalendarDate, Time} from '@internationalized/date';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {useState} from 'react';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {
  AppearanceProvider,
  DateField,
  DatePicker,
  DateRangePicker,
  FieldGroup,
  TimeField,
  type DateRangeValue,
} from '../src/index.js';

afterEach(cleanup);

const date = {day: 20, month: 8, year: 2026} as const;

function Dates({children}: {readonly children: React.ReactNode}) {
  return (
    <AppearanceProvider accent="#2878ff" appearance="dark">
      {children}
    </AppearanceProvider>
  );
}

describe('date and time family', () => {
  it('renders localized segmented values through labeled public controls', () => {
    render(
      <Dates>
        <DateField calendar="gregory" defaultValue={date} label="Run date" locale="en-US" />
        <TimeField
          defaultValue={{hour: 14, minute: 30, second: 0}}
          granularity="minute"
          hourCycle={24}
          label="Run time"
          locale="en-US"
        />
      </Dates>,
    );

    expect(screen.getByRole('group', {name: 'Run date'}).textContent).toMatch(/8.*20.*2026/);
    expect(screen.getByRole('group', {name: 'Run time'}).textContent).toMatch(/14.*30/);
  });

  it('serializes fixed ISO date, time, and range values and restores defaults on reset', async () => {
    render(
      <Dates>
        <form>
          <DateField
            calendar="gregory"
            defaultValue={date}
            label="Run date"
            locale="en-US"
            name="run-date"
          />
          <TimeField
            defaultValue={{hour: 14, minute: 30, second: 0}}
            granularity="minute"
            hourCycle={24}
            label="Run time"
            locale="en-US"
            name="run-time"
          />
          <DateRangePicker
            calendar="gregory"
            calendarButtonLabel="Choose review window"
            defaultValue={{start: date, end: {day: 24, month: 8, year: 2026}}}
            label="Review window"
            locale="en-US"
            names={['review-start', 'review-end']}
            placeholderValue={date}
          />
        </form>
      </Dates>,
    );

    const form = document.querySelector('form')!;
    expect([...new FormData(form).entries()]).toEqual([
      ['run-date', '2026-08-20'],
      ['run-time', '14:30:00'],
      ['review-start', '2026-08-20'],
      ['review-end', '2026-08-24'],
    ]);

    fireEvent.keyDown(
      within(screen.getByRole('group', {name: 'Run date'})).getByRole('spinbutton', {name: /day/i}),
      {key: 'ArrowUp'},
    );
    fireEvent.keyDown(
      within(screen.getByRole('group', {name: 'Run time'})).getByRole('spinbutton', {
        name: /minute/i,
      }),
      {key: 'ArrowUp'},
    );
    await waitFor(() =>
      expect([...new FormData(form).entries()]).toEqual([
        ['run-date', '2026-08-21'],
        ['run-time', '14:31:00'],
        ['review-start', '2026-08-20'],
        ['review-end', '2026-08-24'],
      ]),
    );

    fireEvent.reset(form);
    await waitFor(() =>
      expect([...new FormData(form).entries()]).toEqual([
        ['run-date', '2026-08-20'],
        ['run-time', '14:30:00'],
        ['review-start', '2026-08-20'],
        ['review-end', '2026-08-24'],
      ]),
    );
  });

  it('converts a non-Gregorian display calendar back to ISO public values', () => {
    const onChange = vi.fn();
    render(
      <Dates>
        <DateField
          calendar="japanese"
          label="Review date"
          locale="ja-JP"
          onChange={onChange}
          value={date}
        />
      </Dates>,
    );

    const day = screen.getByRole('spinbutton', {name: /日/});
    const year = screen.getByRole('spinbutton', {name: /年/});
    expect(year.getAttribute('aria-valuenow')).toBe('8');
    expect(document.querySelector('[data-type="era"]')?.textContent).toBeTruthy();
    fireEvent.keyDown(day, {key: 'ArrowUp'});
    expect(onChange).toHaveBeenCalledWith({day: 21, month: 8, year: 2026});
  });

  it('opens, navigates, dismisses, and restores focus for a bounded date picker', async () => {
    render(
      <Dates>
        <DatePicker
          calendar="gregory"
          calendarButtonLabel="Choose review date"
          defaultValue={date}
          isDateUnavailable={(candidate) => candidate.day === 21}
          label="Review date"
          locale="en-US"
          maxValue={{day: 24, month: 8, year: 2026}}
          minValue={{day: 18, month: 8, year: 2026}}
          placeholderValue={date}
        />
      </Dates>,
    );

    const trigger = screen.getByRole('button', {name: /Choose review date/});
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('grid')).toBeTruthy();
    const unavailable = dialog.querySelector('[data-wcl-calendar-cell][data-unavailable]');
    expect(unavailable?.textContent).toBe('21');
    fireEvent.keyDown(dialog, {key: 'Escape'});
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('anchors an empty calendar without selecting or submitting the placeholder date', () => {
    render(
      <Dates>
        <form>
          <DatePicker
            calendar="gregory"
            calendarButtonLabel="Choose empty date"
            defaultOpen
            label="Empty date"
            locale="en-US"
            name="empty-date"
            placeholderValue={date}
          />
        </form>
      </Dates>,
    );

    expect(screen.getByRole('heading', {name: /August 2026/i})).toBeTruthy();
    expect([...new FormData(document.querySelector('form')!).entries()]).toEqual([
      ['empty-date', ''],
    ]);
  });

  it('anchors an empty range calendar without selecting or submitting placeholder endpoints', () => {
    render(
      <Dates>
        <form>
          <DateRangePicker
            calendar="gregory"
            calendarButtonLabel="Choose empty range"
            defaultOpen
            label="Empty range"
            locale="en-US"
            names={['empty-start', 'empty-end']}
            placeholderValue={date}
          />
        </form>
      </Dates>,
    );

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('grid', {name: /August 2026/i})).toBeTruthy();
    expect(dialog.querySelectorAll('[data-selected]')).toHaveLength(0);
    expect([...new FormData(document.querySelector('form')!).entries()]).toEqual([
      ['empty-start', ''],
      ['empty-end', ''],
    ]);
  });

  it('keeps the single-date calendar height stable', () => {
    render(
      <Dates>
        <DatePicker
          calendar="gregory"
          calendarButtonLabel="Choose stable date"
          defaultOpen
          defaultValue={{day: 12, month: 2, year: 2026}}
          label="Stable date"
          locale="en-US"
          placeholderValue={{day: 12, month: 2, year: 2026}}
        />
      </Dates>,
    );

    const grid = within(screen.getByRole('dialog')).getByRole('grid');
    expect(within(grid).getAllByRole('row')).toHaveLength(6);
  });

  it('presents adjacent range months with one-month paging', () => {
    render(
      <Dates>
        <DateRangePicker
          calendar="gregory"
          calendarButtonLabel="Choose visible interval"
          defaultOpen
          defaultValue={{start: date, end: {day: 27, month: 8, year: 2026}}}
          label="Visible interval"
          locale="en-US"
          placeholderValue={date}
        />
      </Dates>,
    );

    const rangeDialog = screen.getByRole('dialog');
    expect(within(rangeDialog).getAllByRole('grid')).toHaveLength(2);
    expect(within(rangeDialog).getByRole('grid', {name: /August 2026/i})).toBeTruthy();
    expect(within(rangeDialog).getByRole('grid', {name: /September 2026/i})).toBeTruthy();

    fireEvent.click(rangeDialog.querySelector('[data-wcl-calendar-navigation][slot="next"]')!);
    expect(within(rangeDialog).getByRole('grid', {name: /September 2026/i})).toBeTruthy();
    expect(within(rangeDialog).getByRole('grid', {name: /October 2026/i})).toBeTruthy();
  });

  it('edits range endpoints in sequence and closes only after the end is chosen', async () => {
    const onChange = vi.fn();
    render(
      <Dates>
        <DateRangePicker
          calendar="gregory"
          calendarButtonLabel="Choose sequential interval"
          defaultOpen
          defaultValue={{start: date, end: {day: 27, month: 8, year: 2026}}}
          label="Sequential interval"
          locale="en-US"
          onChange={onChange}
          placeholderValue={date}
        />
      </Dates>,
    );

    const field = screen.getByRole('group', {name: 'Sequential interval'});
    expect(field.querySelector('[data-wcl-date-input][data-wcl-active-endpoint]')?.slot).toBe(
      'start',
    );

    let dialog = screen.getByRole('dialog');
    const nextStart = within(dialog).getByRole('button', {
      name: /Saturday, August 22, 2026/,
    });
    fireEvent.pointerDown(nextStart, {pointerId: 3});
    fireEvent.pointerUp(nextStart, {pointerId: 3});
    fireEvent.click(nextStart);

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(field.querySelector('[data-wcl-date-input][data-wcl-active-endpoint]')?.slot).toBe(
      'end',
    );
    expect(onChange).toHaveBeenLastCalledWith({
      start: {day: 22, month: 8, year: 2026},
      end: {day: 27, month: 8, year: 2026},
    });

    fireEvent.pointerOver(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: /Tuesday, August 25, 2026/,
      }),
      {pointerId: 3},
    );
    expect(screen.getByRole('dialog').querySelector('[data-selection-end]')?.textContent).toBe(
      '27',
    );

    dialog = screen.getByRole('dialog');
    const nextEnd = within(dialog).getByRole('button', {
      name: /Saturday, August 29, 2026/,
    });
    fireEvent.pointerDown(nextEnd, {pointerId: 4});
    fireEvent.pointerUp(nextEnd, {pointerId: 4});
    fireEvent.click(nextEnd);

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(onChange).toHaveBeenLastCalledWith({
      start: {day: 22, month: 8, year: 2026},
      end: {day: 29, month: 8, year: 2026},
    });
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('edits range endpoints in sequence with keyboard activation', async () => {
    const onChange = vi.fn();
    render(
      <Dates>
        <DateRangePicker
          calendar="gregory"
          calendarButtonLabel="Choose keyboard interval"
          defaultOpen
          defaultValue={{start: date, end: {day: 27, month: 8, year: 2026}}}
          label="Keyboard interval"
          locale="en-US"
          onChange={onChange}
          placeholderValue={date}
        />
      </Dates>,
    );

    const field = screen.getByRole('group', {name: 'Keyboard interval'});
    let dialog = screen.getByRole('dialog');
    const nextStart = within(dialog).getByRole('button', {
      name: /Saturday, August 22, 2026/,
    });
    fireEvent.keyDown(nextStart, {key: 'Enter'});
    fireEvent.keyUp(nextStart, {key: 'Enter'});

    expect(field.querySelector('[data-wcl-date-input][data-wcl-active-endpoint]')?.slot).toBe(
      'end',
    );
    expect(onChange).toHaveBeenLastCalledWith({
      start: {day: 22, month: 8, year: 2026},
      end: {day: 27, month: 8, year: 2026},
    });

    dialog = screen.getByRole('dialog');
    const nextEnd = within(dialog).getByRole('button', {
      name: /Saturday, August 29, 2026/,
    });
    fireEvent.keyDown(nextEnd, {key: ' '});
    fireEvent.keyUp(nextEnd, {key: ' '});

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(onChange).toHaveBeenLastCalledWith({
      start: {day: 22, month: 8, year: 2026},
      end: {day: 29, month: 8, year: 2026},
    });
  });

  it('keeps an empty range partial internally until both endpoints are chosen', async () => {
    const onChange = vi.fn();
    render(
      <Dates>
        <DateRangePicker
          calendar="gregory"
          calendarButtonLabel="Choose empty sequential interval"
          defaultOpen
          label="Empty sequential interval"
          locale="en-US"
          onChange={onChange}
          placeholderValue={date}
        />
      </Dates>,
    );

    let dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', {name: /Saturday, August 22, 2026/}));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeTruthy();

    dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', {name: /Thursday, August 27, 2026/}));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      start: {day: 22, month: 8, year: 2026},
      end: {day: 27, month: 8, year: 2026},
    });
  });

  it('closes when the active settled end endpoint is clicked without dragging', async () => {
    render(
      <Dates>
        <DateRangePicker
          calendar="gregory"
          calendarButtonLabel="Choose retained endpoint"
          defaultOpen
          defaultValue={{start: date, end: {day: 27, month: 8, year: 2026}}}
          label="Retained endpoint"
          locale="en-US"
          placeholderValue={date}
        />
      </Dates>,
    );

    let dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', {name: /Saturday, August 22, 2026/}));
    dialog = screen.getByRole('dialog');
    const end = dialog.querySelector<HTMLElement>('[data-selection-end]')!;
    fireEvent.pointerDown(end, {clientX: 100, clientY: 100, pointerId: 6});
    fireEvent.pointerUp(end, {clientX: 100, clientY: 100, pointerId: 6});
    fireEvent.click(end);

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('drags a settled range endpoint without closing the calendar', async () => {
    const onChange = vi.fn();
    render(
      <Dates>
        <DateRangePicker
          calendar="gregory"
          calendarButtonLabel="Choose draggable interval"
          defaultOpen
          defaultValue={{start: date, end: {day: 27, month: 8, year: 2026}}}
          label="Draggable interval"
          locale="en-US"
          onChange={onChange}
          placeholderValue={date}
        />
      </Dates>,
    );

    const dialog = screen.getByRole('dialog');
    const start = dialog.querySelector<HTMLElement>('[data-selection-start]')!;
    const destination = within(dialog).getByRole('button', {
      name: /Tuesday, August 18, 2026/,
    });

    fireEvent.pointerDown(start, {pointerId: 7});
    fireEvent.pointerOver(destination, {pointerId: 7});
    fireEvent.pointerUp(window, {pointerId: 7});

    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith({
        start: {day: 18, month: 8, year: 2026},
        end: {day: 27, month: 8, year: 2026},
      }),
    );
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(
      screen
        .getByRole('group', {name: 'Draggable interval'})
        .querySelector('[data-wcl-date-input][data-wcl-active-endpoint]')?.slot,
    ).toBe('end');
  });

  it.each([
    {active: 'start', expectedActive: 'end', role: 'start'},
    {active: 'end', expectedActive: 'end', role: 'start'},
    {active: 'start', expectedActive: 'start', role: 'end'},
    {active: 'end', expectedActive: 'end', role: 'end'},
  ] as const)(
    'retains the approved $active-active behavior when dragging the $role endpoint',
    async ({active, expectedActive, role}) => {
      const onChange = vi.fn();
      render(
        <Dates>
          <DateRangePicker
            calendar="gregory"
            calendarButtonLabel="Choose endpoint matrix"
            defaultOpen
            defaultValue={{start: date, end: {day: 27, month: 8, year: 2026}}}
            label="Endpoint matrix"
            locale="en-US"
            onChange={onChange}
            placeholderValue={date}
          />
        </Dates>,
      );

      let dialog = screen.getByRole('dialog');
      if (active === 'end') {
        fireEvent.click(within(dialog).getByRole('button', {name: /Saturday, August 22, 2026/}));
        dialog = screen.getByRole('dialog');
      }
      const endpoint = dialog.querySelector<HTMLElement>(`[data-selection-${role}]`)!;
      const destination = within(dialog).getByRole('button', {
        name: role === 'start' ? /Tuesday, August 18, 2026/ : /Saturday, August 29, 2026/,
      });

      fireEvent.pointerDown(endpoint, {pointerId: 21});
      fireEvent.pointerOver(destination, {pointerId: 21});
      fireEvent.pointerUp(window, {pointerId: 21});

      const expectedStart = role === 'start' ? 18 : active === 'end' ? 22 : 20;
      await waitFor(() =>
        expect(onChange).toHaveBeenLastCalledWith({
          start: {day: expectedStart, month: 8, year: 2026},
          end: {day: role === 'end' ? 29 : 27, month: 8, year: 2026},
        }),
      );
      expect(screen.getByRole('dialog')).toBeTruthy();
      expect(
        document
          .querySelector('[data-wcl-date-range-picker]')
          ?.querySelector('[data-wcl-date-input][data-wcl-active-endpoint]')?.slot,
      ).toBe(expectedActive);
    },
  );

  it('swaps endpoint identities when a dragged boundary crosses the opposite date', async () => {
    const onChange = vi.fn();
    render(
      <Dates>
        <DateRangePicker
          calendar="gregory"
          calendarButtonLabel="Choose crossing interval"
          defaultOpen
          defaultValue={{start: date, end: {day: 27, month: 8, year: 2026}}}
          label="Crossing interval"
          locale="en-US"
          onChange={onChange}
          placeholderValue={date}
        />
      </Dates>,
    );

    const dialog = screen.getByRole('dialog');
    fireEvent.pointerDown(dialog.querySelector('[data-selection-start]')!, {pointerId: 9});
    fireEvent.pointerOver(within(dialog).getByRole('button', {name: /Saturday, August 29, 2026/}), {
      pointerId: 9,
    });
    fireEvent.pointerUp(window, {pointerId: 9});

    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith({
        start: {day: 27, month: 8, year: 2026},
        end: {day: 29, month: 8, year: 2026},
      }),
    );
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(
      screen
        .getByRole('group', {name: 'Crossing interval'})
        .querySelector('[data-wcl-date-input][data-wcl-active-endpoint]')?.slot,
    ).toBe('start');
  });

  it('pages a continued endpoint drag only after dwelling beyond the month grids', async () => {
    vi.useFakeTimers();
    const originalElementFromPoint = document.elementFromPoint?.bind(document);
    try {
      render(
        <Dates>
          <DateRangePicker
            calendar="gregory"
            calendarButtonLabel="Choose paged interval"
            defaultOpen
            defaultValue={{start: date, end: {day: 27, month: 8, year: 2026}}}
            label="Paged interval"
            locale="en-US"
            placeholderValue={date}
          />
        </Dates>,
      );

      const dialog = screen.getByRole('dialog');
      const sheet = dialog.querySelector<HTMLElement>('[data-wcl-calendar-sheet]')!;
      const months = dialog.querySelector<HTMLElement>('[data-wcl-calendar-months]')!;
      vi.spyOn(sheet, 'getBoundingClientRect').mockReturnValue({
        bottom: 400,
        height: 400,
        left: 0,
        right: 680,
        top: 0,
        width: 680,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });
      vi.spyOn(months, 'getBoundingClientRect').mockReturnValue({
        bottom: 400,
        height: 400,
        left: 20,
        right: 660,
        top: 0,
        width: 640,
        x: 20,
        y: 0,
        toJSON: () => ({}),
      });
      let pointTarget: Element | null = dialog.querySelector(
        '[data-wcl-calendar-date="2026-09-05"]:not([data-outside-month])',
      );
      Object.defineProperty(document, 'elementFromPoint', {
        configurable: true,
        value: () => pointTarget,
      });

      fireEvent.pointerDown(dialog.querySelector('[data-selection-start]')!, {pointerId: 11});
      expect(dialog.querySelector('[data-wcl-drag-selection-start]')?.textContent).toBe('20');
      fireEvent.pointerMove(window, {clientX: 650, clientY: 200, pointerId: 11});
      expect(sheet.hasAttribute('data-edge')).toBe(false);
      await act(() => vi.advanceTimersByTime(350));
      expect(within(dialog).getByRole('grid', {name: /August 2026/i})).toBeTruthy();

      pointTarget = null;
      fireEvent.pointerMove(window, {clientX: 650, clientY: 200, pointerId: 11});
      expect(sheet.getAttribute('data-edge')).toBe('next');
      await act(() => vi.advanceTimersByTime(349));
      expect(within(dialog).getByRole('grid', {name: /August 2026/i})).toBeTruthy();
      await act(() => vi.advanceTimersByTime(1));
      expect(within(dialog).getByRole('grid', {name: /September 2026/i})).toBeTruthy();
      expect(within(dialog).getByRole('grid', {name: /October 2026/i})).toBeTruthy();
      expect(sheet.getAttribute('data-dragging-endpoint')).toBe('start');
      expect(
        [...dialog.querySelectorAll('[data-wcl-drag-selected]')].map((element) =>
          element.getAttribute('data-wcl-calendar-date'),
        ),
      ).toContain('2026-10-31');
      fireEvent.pointerUp(window, {pointerId: 11});
    } finally {
      Object.defineProperty(document, 'elementFromPoint', {
        configurable: true,
        value: originalElementFromPoint,
      });
      vi.useRealTimers();
    }
  });

  it('drills from the right range heading with the chosen month retained in the right pane', () => {
    render(
      <Dates>
        <DateRangePicker
          calendar="gregory"
          calendarButtonLabel="Choose aligned interval"
          defaultOpen
          defaultValue={{start: date, end: {day: 27, month: 8, year: 2026}}}
          label="Aligned interval"
          locale="en-US"
          placeholderValue={date}
        />
      </Dates>,
    );

    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog.querySelectorAll('[data-wcl-calendar-heading-part="month"]')[1]!);
    fireEvent.click(within(dialog).getByRole('button', {name: 'Mar'}));
    expect(within(dialog).getByRole('grid', {name: /February 2026/i})).toBeTruthy();
    expect(within(dialog).getByRole('grid', {name: /March 2026/i})).toBeTruthy();
  });

  it('settles descending segmented entry before calendar endpoint editing begins', async () => {
    render(
      <Dates>
        <DateRangePicker
          calendar="gregory"
          calendarButtonLabel="Choose settled interval"
          defaultValue={{start: date, end: {day: 21, month: 8, year: 2026}}}
          errorMessage="Start date must be before end date."
          label="Settled interval"
          locale="en-US"
          placeholderValue={date}
          validationBehavior="aria"
        />
      </Dates>,
    );

    const field = screen.getByRole('group', {name: 'Settled interval'});
    const days = within(field).getAllByRole('spinbutton', {name: /day/i});
    fireEvent.keyDown(days[1]!, {key: 'ArrowDown'});
    fireEvent.keyDown(days[1]!, {key: 'ArrowDown'});
    fireEvent.keyDown(days[1]!, {key: 'ArrowDown'});
    expect(days[0]!.getAttribute('aria-valuenow')).toBe('20');
    expect(days[1]!.getAttribute('aria-valuenow')).toBe('18');

    fireEvent.click(screen.getByRole('button', {name: /Choose settled interval/}));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeTruthy());
    await waitFor(() => {
      expect(days[0]!.getAttribute('aria-valuenow')).toBe('18');
      expect(days[1]!.getAttribute('aria-valuenow')).toBe('20');
      expect(field.hasAttribute('data-invalid')).toBe(false);
    });
  });

  it('promotes and drills through calendar hierarchy without changing the selected value', () => {
    const onChange = vi.fn();
    render(
      <Dates>
        <DatePicker
          calendar="gregory"
          calendarButtonLabel="Choose navigable date"
          defaultOpen
          label="Navigable date"
          locale="en-US"
          onChange={onChange}
          placeholderValue={date}
          value={date}
        />
      </Dates>,
    );

    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog.querySelector('[data-wcl-calendar-heading-part="month"]')!);
    const monthGrid = within(dialog).getByRole('grid', {name: /year.*2026/i});
    const monthButtons = within(monthGrid).getAllByRole('button');
    expect(monthButtons).toHaveLength(12);
    expect(monthButtons[0]?.textContent).toBe('Jan');
    expect(document.activeElement).toBe(monthButtons[0]);

    fireEvent.click(dialog.querySelector('[data-wcl-calendar-period-heading]')!);
    const yearGrid = within(dialog).getByRole('grid', {name: /year/i});
    expect(within(yearGrid).getAllByRole('button')).toHaveLength(12);

    fireEvent.click(dialog.querySelector('[data-wcl-calendar-period-heading]')!);
    const decadeGrid = within(dialog).getByRole('grid', {name: /year/i});
    const decadeButtons = within(decadeGrid).getAllByRole('button');
    expect(decadeButtons).toHaveLength(12);
    fireEvent.keyDown(decadeButtons[0]!, {key: 'ArrowRight'});
    expect(document.activeElement).toBe(decadeButtons[1]);
    fireEvent.click(decadeButtons.find((button) => /2030.*2039/.test(button.textContent ?? ''))!);

    fireEvent.click(within(dialog).getByRole('button', {name: '2030'}));
    expect(within(dialog).getByRole('grid', {name: /year.*2030/i})).toBeTruthy();
    fireEvent.click(within(dialog).getByRole('button', {name: 'Mar'}));
    expect(within(dialog).getByRole('grid', {name: /March 2030/i})).toBeTruthy();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('uses valid hierarchy rows and reverses horizontal movement in RTL', () => {
    render(
      <Dates>
        <DateRangePicker
          calendar="gregory"
          calendarButtonLabel="اختر التاريخ"
          defaultOpen
          defaultValue={{start: date, end: {day: 27, month: 8, year: 2026}}}
          label="تاريخ المراجعة"
          locale="ar-EG"
          placeholderValue={date}
        />
      </Dates>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.querySelector('[data-wcl-calendar-announcement]')?.textContent).toMatch(
      /تاريخ البدء/,
    );
    fireEvent.click(dialog.querySelector('[data-wcl-calendar-heading-part="month"]')!);
    const grid = within(dialog).getByRole('grid');
    const rows = within(grid).getAllByRole('row');
    expect(rows).toHaveLength(3);
    expect(grid.querySelector(':scope > [role="gridcell"]')).toBeNull();

    const buttons = within(grid).getAllByRole('button');
    buttons[0]!.focus();
    fireEvent.keyDown(buttons[0]!, {key: 'ArrowLeft'});
    expect(document.activeElement).toBe(buttons[1]);
    const accessibleNames = [...dialog.querySelectorAll('[aria-label]')]
      .map((element) => element.getAttribute('aria-label'))
      .join(' ');
    expect(accessibleNames).not.toMatch(
      /Choose month|Choose year|Editing|Use arrow keys|Previous period|Next period/,
    );
  });

  it('keeps a thirteen-month calendar hierarchy within the fixed surface', () => {
    render(
      <Dates>
        <DatePicker
          calendar="hebrew"
          calendarButtonLabel="Choose Hebrew date"
          defaultOpen
          defaultValue={{day: 1, month: 3, year: 2024}}
          label="Hebrew date"
          locale="en-US"
          placeholderValue={{day: 1, month: 3, year: 2024}}
        />
      </Dates>,
    );

    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog.querySelector('[data-wcl-calendar-heading-part="month"]')!);
    const grid = within(dialog).getByRole('grid');
    expect(within(grid).getAllByRole('button')).toHaveLength(13);
    expect(within(grid).getAllByRole('row')).toHaveLength(4);
  });

  it('keeps hierarchy periods in the selected calendar and stops at the useful year boundary', () => {
    render(
      <Dates>
        <DatePicker
          calendar="japanese"
          calendarButtonLabel="日付を選択"
          defaultOpen
          defaultValue={date}
          label="審査日"
          locale="ja-JP"
          placeholderValue={date}
        />
      </Dates>,
    );

    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog.querySelector('[data-wcl-calendar-heading-part="year"]')!);
    for (let level = 0; level < 3; level += 1) {
      fireEvent.click(dialog.querySelector('[data-wcl-calendar-period-heading]')!);
    }

    const periodButtons = [
      ...dialog.querySelectorAll<HTMLButtonElement>('[data-wcl-calendar-hierarchy-item]'),
    ];
    expect(periodButtons.some((button) => /令和|平成|昭和/.test(button.textContent ?? ''))).toBe(
      true,
    );
    expect(periodButtons.every((button) => !/\d+s$/.test(button.textContent ?? ''))).toBe(true);
    expect(
      dialog.querySelector<HTMLButtonElement>('[data-wcl-calendar-period-heading]')?.disabled,
    ).toBe(true);
  });

  it('partitions the supported year boundary without duplicating its final year', () => {
    render(
      <Dates>
        <DatePicker
          calendar="gregory"
          calendarButtonLabel="Choose bounded date"
          defaultOpen
          defaultValue={date}
          label="Bounded date"
          locale="en-US"
          placeholderValue={date}
        />
      </Dates>,
    );

    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog.querySelector('[data-wcl-calendar-heading-part="year"]')!);
    for (let level = 0; level < 3; level += 1) {
      fireEvent.click(dialog.querySelector('[data-wcl-calendar-period-heading]')!);
    }

    const labels = [
      ...dialog.querySelectorAll<HTMLElement>('[data-wcl-calendar-hierarchy-item]'),
    ].map((button) => button.textContent);
    expect(labels).toEqual([...new Set(labels)]);
    expect(labels.at(-1)).toMatch(/9001.*9999/);
  });

  it('disables hierarchy choices and paging outside date bounds', () => {
    render(
      <Dates>
        <DatePicker
          calendar="gregory"
          calendarButtonLabel="Choose bounded hierarchy"
          defaultOpen
          defaultValue={date}
          label="Bounded hierarchy"
          locale="en-US"
          maxValue={{day: 24, month: 8, year: 2026}}
          minValue={{day: 18, month: 8, year: 2026}}
          placeholderValue={date}
        />
      </Dates>,
    );

    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog.querySelector('[data-wcl-calendar-heading-part="month"]')!);
    const monthButtons = [
      ...dialog.querySelectorAll<HTMLButtonElement>('[data-wcl-calendar-hierarchy-item]'),
    ];
    expect(monthButtons.filter((button) => !button.disabled)).toHaveLength(1);
    expect(document.activeElement).toBe(monthButtons.find((button) => !button.disabled));
    expect(
      dialog.querySelector<HTMLButtonElement>('[data-wcl-calendar-navigation]')?.disabled,
    ).toBe(true);
  });

  it('resets endpoint activity when a controlled range picker is reopened externally', async () => {
    function ControlledRange() {
      const [open, setOpen] = useState(true);
      return (
        <>
          <button onClick={() => setOpen(false)} type="button">
            Close externally
          </button>
          <button onClick={() => setOpen(true)} type="button">
            Open externally
          </button>
          <DateRangePicker
            calendar="gregory"
            calendarButtonLabel="Choose controlled interval"
            defaultValue={{start: date, end: {day: 27, month: 8, year: 2026}}}
            isOpen={open}
            label="Controlled interval"
            locale="en-US"
            onOpenChange={setOpen}
            placeholderValue={date}
          />
        </>
      );
    }

    render(
      <Dates>
        <ControlledRange />
      </Dates>,
    );

    fireEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: /Saturday, August 22, 2026/,
      }),
    );
    const controlledField = document.querySelector('[data-wcl-date-range-picker]')!;
    expect(
      controlledField.querySelector('[data-wcl-date-input][data-wcl-active-endpoint]')?.slot,
    ).toBe('end');

    fireEvent.click(screen.getByRole('button', {name: 'Close externally'}));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    const activatedEndpoints: string[] = [];
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        const target = record.target as HTMLElement;
        if (record.oldValue === null && target.hasAttribute('data-wcl-date-input')) {
          activatedEndpoints.push(target.getAttribute('slot') ?? '');
        }
      }
    });
    observer.observe(controlledField, {
      attributeFilter: ['data-wcl-active-endpoint'],
      attributeOldValue: true,
      attributes: true,
      subtree: true,
    });
    fireEvent.click(screen.getByRole('button', {name: 'Open externally'}));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeTruthy());
    await act(async () => {
      await Promise.resolve();
    });
    observer.disconnect();
    expect(activatedEndpoints).toEqual(['start']);
    expect(
      controlledField.querySelector('[data-wcl-date-input][data-wcl-active-endpoint]')?.slot,
    ).toBe('start');
  });

  it('synchronizes controlled picker value and open state after calendar selection', async () => {
    const onChange = vi.fn();
    const onOpenChange = vi.fn();

    function ControlledPicker() {
      const [isOpen, setOpen] = useState(true);
      const [value, setValue] = useState<null | {day: number; month: number; year: number}>(null);

      return (
        <form>
          <DatePicker
            calendar="gregory"
            calendarButtonLabel="Choose controlled date"
            isOpen={isOpen}
            label="Controlled date"
            locale="en-US"
            name="controlled-date"
            onChange={(nextValue) => {
              onChange(nextValue);
              setValue(nextValue);
            }}
            onOpenChange={(nextOpen) => {
              onOpenChange(nextOpen);
              setOpen(nextOpen);
            }}
            placeholderValue={date}
            value={value}
          />
        </form>
      );
    }

    render(
      <Dates>
        <ControlledPicker />
      </Dates>,
    );

    const day = within(screen.getByRole('dialog')).getByRole('button', {
      name: /Sunday, August 23, 2026/,
    });
    fireEvent.click(day);

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(onChange).toHaveBeenCalledWith({day: 23, month: 8, year: 2026});
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect([...new FormData(document.querySelector('form')!).entries()]).toEqual([
      ['controlled-date', '2026-08-23'],
    ]);
  });

  it('exposes required and custom validation through the labeled public date seam', async () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    const validate = vi.fn(() => 'That date is unavailable.');
    render(
      <Dates>
        <form onSubmit={onSubmit}>
          <DateField
            calendar="gregory"
            isRequired
            label="Required date"
            locale="en-US"
            name="required-date"
            validationBehavior="native"
          />
          <DateField
            calendar="gregory"
            defaultValue={date}
            errorMessage="That date is unavailable."
            label="Validated date"
            locale="en-US"
            validate={validate}
            validationBehavior="aria"
          />
          <button type="submit">Submit date</button>
        </form>
      </Dates>,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Submit date'}));
    await waitFor(() => expect(onSubmit).not.toHaveBeenCalled());
    expect(screen.getByText('*').getAttribute('aria-hidden')).toBe('true');

    const day = within(screen.getByRole('group', {name: 'Validated date'})).getByRole(
      'spinbutton',
      {
        name: /day/i,
      },
    );
    fireEvent.keyDown(day, {key: 'ArrowUp'});
    await waitFor(() => expect(validate).toHaveBeenCalledWith({day: 21, month: 8, year: 2026}));
  });

  it('inherits FieldGroup disabled state and preserves read-only focusability', () => {
    render(
      <Dates>
        <FieldGroup isDisabled legend="Unavailable schedule">
          <DateField calendar="gregory" label="Disabled date" locale="en-US" />
        </FieldGroup>
        <TimeField
          granularity="minute"
          hourCycle={24}
          isReadOnly
          label="Approved time"
          locale="en-US"
          value={{hour: 14, minute: 30, second: 0}}
          onChange={() => undefined}
        />
      </Dates>,
    );

    expect(screen.getByRole('group', {name: 'Disabled date'}).hasAttribute('data-disabled')).toBe(
      true,
    );
    const segment = screen.getAllByRole('spinbutton', {name: /hour|minute/i})[0];
    expect(segment?.getAttribute('aria-readonly')).toBe('true');
    expect(segment?.getAttribute('aria-disabled')).not.toBe('true');
  });

  it('server-renders and hydrates with explicit locale and calendar inputs', async () => {
    const view = (
      <Dates>
        <DateField calendar="gregory" defaultValue={date} label="Server date" locale="ar-EG" />
        <TimeField
          defaultValue={{hour: 14, minute: 30, second: 0}}
          granularity="minute"
          hourCycle={24}
          label="Server time"
          locale="ar-EG"
        />
      </Dates>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(view);
    document.body.append(container);
    const onRecoverableError = vi.fn();
    let root: ReturnType<typeof hydrateRoot> | undefined;

    await act(async () => {
      root = hydrateRoot(container, view, {onRecoverableError});
      await Promise.resolve();
    });
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(within(container).getByRole('group', {name: 'Server date'})).toBeTruthy();

    act(() => root?.unmount());
    container.remove();
  });

  it('rejects impossible dates and descending ranges at the public boundary', () => {
    expect(() =>
      render(
        <DateField
          calendar="gregory"
          defaultValue={{day: 30, month: 2, year: 2026}}
          label="Impossible date"
          locale="en-US"
        />,
      ),
    ).toThrow(/valid ISO calendar day/i);

    expect(() =>
      render(
        <DateRangePicker
          calendar="gregory"
          calendarButtonLabel="Choose descending range"
          defaultValue={{start: {day: 24, month: 8, year: 2026}, end: date}}
          label="Descending range"
          locale="en-US"
          placeholderValue={date}
        />,
      ),
    ).toThrow(/ascending order/i);
  });

  it('keeps a complete unavailable range invalid and prevents native submission', async () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <DateRangePicker
          calendar="gregory"
          calendarButtonLabel="Choose blocked range"
          defaultValue={{start: date, end: {day: 24, month: 8, year: 2026}}}
          errorMessage="The range includes an unavailable date."
          isDateUnavailable={(candidate) => candidate.day === 22}
          label="Blocked range"
          locale="en-US"
          names={['blocked-start', 'blocked-end']}
          placeholderValue={date}
          validationBehavior="native"
        />
        <button type="submit">Submit blocked range</button>
      </form>,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Submit blocked range'}));
    await waitFor(() => expect(onSubmit).not.toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.getByRole('group', {name: 'Blocked range'}).getAttribute('data-invalid')).toBe(
        'true',
      ),
    );
  });

  it('preserves a controlled unavailable segmented edit as invalid without throwing', async () => {
    const onChange = vi.fn();

    function ControlledGuardedRange() {
      const [value, setValue] = useState<DateRangeValue>({
        start: date,
        end: {day: 21, month: 8, year: 2026},
      });

      return (
        <DateRangePicker
          calendar="gregory"
          calendarButtonLabel="Choose guarded range"
          errorMessage="The range includes an unavailable date."
          isDateUnavailable={(candidate) => candidate.day === 22}
          label="Guarded range"
          locale="en-US"
          onChange={(nextValue) => {
            onChange(nextValue);
            if (nextValue) setValue(nextValue);
          }}
          placeholderValue={date}
          validationBehavior="aria"
          value={value}
        />
      );
    }

    render(
      <Dates>
        <ControlledGuardedRange />
      </Dates>,
    );

    const endDay = within(screen.getByRole('group', {name: 'Guarded range'})).getAllByRole(
      'spinbutton',
      {name: /day/i},
    )[1]!;
    expect(() => fireEvent.keyDown(endDay, {key: 'ArrowUp'})).not.toThrow();
    expect(() => fireEvent.keyDown(endDay, {key: 'ArrowUp'})).not.toThrow();
    await waitFor(() =>
      expect(screen.getByRole('group', {name: 'Guarded range'}).getAttribute('data-invalid')).toBe(
        'true',
      ),
    );
    expect(onChange).toHaveBeenLastCalledWith({
      start: date,
      end: {day: 23, month: 8, year: 2026},
    });
  });

  it('rejects time precision hidden below the visible granularity', () => {
    expect(() =>
      render(
        <TimeField
          defaultValue={{hour: 14, minute: 30, second: 1}}
          granularity="minute"
          hourCycle={24}
          label="Hidden precision"
          locale="en-US"
        />,
      ),
    ).toThrow(/hidden seconds/i);
  });

  it('rejects private internationalized values even when callers bypass public types', () => {
    expect(() =>
      render(
        <DateField
          calendar="gregory"
          defaultValue={new CalendarDate(2026, 8, 20) as unknown as typeof date}
          label="Private date"
          locale="en-US"
        />,
      ),
    ).toThrow(/plain library-owned ISO values/i);

    expect(() =>
      render(
        <TimeField
          defaultValue={
            new Time(14, 30) as unknown as {hour: number; minute: number; second: number}
          }
          granularity="minute"
          hourCycle={24}
          label="Private time"
          locale="en-US"
        />,
      ),
    ).toThrow(/plain library-owned wall-clock values/i);
  });
});
