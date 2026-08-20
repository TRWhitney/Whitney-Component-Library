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
    expect(within(dialog).getByRole('heading', {name: /August 2026/i})).toBeTruthy();
    expect(dialog.querySelectorAll('[data-selected]')).toHaveLength(0);
    expect([...new FormData(document.querySelector('form')!).entries()]).toEqual([
      ['empty-start', ''],
      ['empty-end', ''],
    ]);
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
