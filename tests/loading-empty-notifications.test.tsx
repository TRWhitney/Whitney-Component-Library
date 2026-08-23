import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {
  AppearanceProvider,
  EmptyState,
  NotificationProvider,
  Skeleton,
  type NotificationControls,
  type NotificationPlacement,
} from '../src/index.js';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function NotificationHarness({
  capture,
  maxVisible,
  placement,
}: {
  readonly capture: (controls: NotificationControls) => void;
  readonly maxVisible?: 1 | 2 | 3;
  readonly placement?: NotificationPlacement;
}) {
  return (
    <AppearanceProvider accent="#2878ff" appearance="dark">
      <NotificationProvider
        dismissLabel="Dismiss notification"
        label="Solver notifications"
        {...(maxVisible === undefined ? {} : {maxVisible})}
        {...(placement === undefined ? {} : {placement})}
      >
        {(controls) => {
          capture(controls);
          return <button type="button">Current work</button>;
        }}
      </NotificationProvider>
    </AppearanceProvider>
  );
}

describe('loading, empty, and notification feedback', () => {
  it('renders hidden structural placeholders with bounded geometry', () => {
    const {container} = render(
      <>
        <Skeleton lines={3} shape="text" width="full" />
        <Skeleton shape="control" width="half" />
        <Skeleton shape="media" width="full" />
      </>,
    );

    const skeletons = [...container.querySelectorAll('[data-wcl-skeleton]')];
    expect(skeletons).toHaveLength(3);
    expect(skeletons.every((skeleton) => skeleton.getAttribute('aria-hidden') === 'true')).toBe(
      true,
    );
    expect(skeletons[0]?.querySelectorAll('[data-wcl-skeleton-line]')).toHaveLength(3);
    expect(skeletons[1]?.getAttribute('data-shape')).toBe('control');
    expect(skeletons[1]?.getAttribute('data-width')).toBe('half');
  });

  it('distinguishes empty conditions and bounds recovery to one action', () => {
    const recover = vi.fn();
    const {container} = render(
      <>
        <EmptyState
          actionLabel="Add boundary"
          description="Add a boundary condition before running the profile."
          kind="no-data"
          onAction={recover}
          title="No boundary conditions"
        />
        <EmptyState
          description="Change or clear the current filters."
          kind="no-results"
          title="No matching runs"
        />
        <EmptyState
          description="The solver could not load this result."
          kind="unavailable"
          title="Result unavailable"
        />
      </>,
    );

    expect(container.querySelectorAll('[data-wcl-empty-state]')).toHaveLength(3);
    expect(container.querySelector('[data-kind="no-data"]')).toBeTruthy();
    expect(container.querySelector('[data-kind="no-results"]')).toBeTruthy();
    expect(container.querySelector('[data-kind="unavailable"]')).toBeTruthy();
    expect(container.querySelectorAll('[data-wcl-empty-action]')).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', {name: 'Add boundary'}));
    expect(recover).toHaveBeenCalledOnce();
  });

  it('renders every notification while maxVisible caps only the scroll viewport', () => {
    let controls: NotificationControls | undefined;
    render(<NotificationHarness capture={(value) => (controls = value)} maxVisible={2} />);

    act(() => {
      controls?.notify({title: 'First pass complete', tone: 'general'});
      controls?.notify({title: 'Second pass complete', tone: 'general'});
      controls?.notify({title: 'Third pass complete', tone: 'general'});
    });

    expect(screen.getAllByRole('alertdialog')).toHaveLength(3);
    expect(screen.getByText('Third pass complete')).toBeTruthy();
    expect(screen.getByText('Second pass complete')).toBeTruthy();
    expect(screen.getByText('First pass complete')).toBeTruthy();
    expect(document.querySelector('[data-wcl-notification-count]')?.textContent).toBe('3');
    expect(
      document.querySelector('[data-wcl-notification-list]')?.getAttribute('data-max-visible'),
    ).toBe('2');

    fireEvent.click(screen.getAllByRole('button', {name: 'Dismiss notification'})[0]!);

    expect(screen.getAllByRole('alertdialog')).toHaveLength(2);
    expect(screen.getByText('First pass complete')).toBeTruthy();
    expect(document.querySelector('[data-wcl-notification-count]')?.textContent).toBe('2');
  });

  it('renders an uncapped top-aligned stack before viewport overflow', () => {
    let controls: NotificationControls | undefined;
    render(<NotificationHarness capture={(value) => (controls = value)} />);

    act(() => {
      for (let index = 1; index <= 6; index += 1) {
        controls?.notify({timeout: null, title: `Run ${index} ready`, tone: 'success'});
      }
    });

    expect(screen.getAllByRole('alertdialog')).toHaveLength(6);
    expect(
      screen.getByRole('region', {name: 'Solver notifications'}).getAttribute('data-placement'),
    ).toBe('top-end');
    expect(document.querySelector('[data-wcl-notification-count]')?.textContent).toBe('6');
  });

  it('renders every notification tone, timed rails, and a matched action', () => {
    let controls: NotificationControls | undefined;
    const retry = vi.fn();
    render(<NotificationHarness capture={(value) => (controls = value)} />);

    act(() => {
      controls?.notify({title: 'Draft saved', tone: 'general'});
      controls?.notify({title: 'Export ready', tone: 'success'});
      controls?.notify({timeout: null, title: 'Capacity nearly full', tone: 'warning'});
      controls?.notify({
        actionLabel: 'Retry',
        onAction: retry,
        title: 'Export failed',
        tone: 'error',
      });
    });

    expect(
      screen
        .getByText('Export ready')
        .closest('[data-wcl-notification]')
        ?.getAttribute('data-tone'),
    ).toBe('success');
    expect(
      screen.getByText('Draft saved').closest('[data-wcl-notification]')?.getAttribute('data-tone'),
    ).toBe('general');
    expect(
      screen
        .getByText('Capacity nearly full')
        .closest('[data-wcl-notification]')
        ?.getAttribute('data-tone'),
    ).toBe('warning');
    expect(
      screen
        .getByText('Export failed')
        .closest('[data-wcl-notification]')
        ?.getAttribute('data-tone'),
    ).toBe('error');
    expect(document.querySelectorAll('[data-wcl-notification-timer]')).toHaveLength(3);
    expect(
      screen
        .getByText('Draft saved')
        .closest('[data-wcl-notification]')
        ?.querySelector<HTMLElement>('[data-wcl-notification-timer]')
        ?.style.getPropertyValue('--wcl-notification-timeout'),
    ).toBe('6000ms');
    expect(
      screen
        .getByText('Capacity nearly full')
        .closest('[data-wcl-notification]')
        ?.querySelector('[data-wcl-notification-timer]'),
    ).toBeNull();

    fireEvent.click(screen.getByRole('button', {name: 'Retry'}));
    expect(retry).toHaveBeenCalledOnce();
    expect(screen.queryByText('Export failed')).toBeNull();
    expect(document.querySelector('[data-wcl-notification-count]')?.textContent).toBe('3');
  });

  it('reveals the overflow scrollbar during activity and clears it after idle', () => {
    vi.useFakeTimers();
    let controls: NotificationControls | undefined;
    render(<NotificationHarness capture={(value) => (controls = value)} />);

    act(() => {
      for (let index = 1; index <= 6; index += 1) {
        controls?.notify({timeout: null, title: `Run ${index} ready`, tone: 'general'});
      }
    });

    const list = document.querySelector('[data-wcl-notification-list]');
    expect(list?.hasAttribute('data-scrollbar-active')).toBe(false);

    fireEvent.scroll(list!);
    expect(list?.getAttribute('data-scrollbar-active')).toBe('true');

    act(() => {
      vi.advanceTimersByTime(900);
    });
    expect(list?.hasAttribute('data-scrollbar-active')).toBe(false);
  });

  it('uses polite and assertive visible copy without moving focus', () => {
    let controls: NotificationControls | undefined;
    render(<NotificationHarness capture={(value) => (controls = value)} />);
    const currentWork = screen.getByRole('button', {name: 'Current work'});
    currentWork.focus();

    act(() => {
      controls?.notify({
        description: 'The run remains available in history.',
        title: 'Run saved',
        tone: 'general',
      });
      controls?.notify({
        description: 'Reconnect before starting another run.',
        title: 'Solver disconnected',
        tone: 'error',
        urgency: 'assertive',
      });
    });

    expect(document.activeElement).toBe(currentWork);
    expect(screen.getByRole('status').textContent).toContain('Run saved');
    expect(screen.getByRole('alert').textContent).toContain('Solver disconnected');
    expect(screen.getByRole('region', {name: 'Solver notifications'})).toBeTruthy();
  });

  it('pauses notification timeouts during hover and supports keyboard dismissal', async () => {
    vi.useFakeTimers();
    let controls: NotificationControls | undefined;
    const dismissed = vi.fn();
    render(<NotificationHarness capture={(value) => (controls = value)} maxVisible={1} />);

    act(() => {
      controls?.notify({onDismiss: dismissed, timeout: 4000, title: 'Run saved', tone: 'general'});
    });

    const region = screen.getByRole('region', {name: 'Solver notifications'});
    fireEvent.pointerEnter(region, {pointerType: 'mouse'});
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText('Run saved')).toBeTruthy();

    fireEvent.pointerLeave(region, {pointerType: 'mouse'});
    await act(async () => {
      vi.advanceTimersByTime(4000);
      await new Promise<void>((resolve) => queueMicrotask(resolve));
    });
    expect(screen.queryByText('Run saved')).toBeNull();
    expect(dismissed).toHaveBeenCalledOnce();

    act(() => {
      controls?.notify({timeout: null, title: 'Export ready', tone: 'general'});
    });
    const notification = screen.getByRole('alertdialog');
    notification.focus();
    fireEvent.keyDown(notification, {key: 'Escape'});
    expect(screen.queryByText('Export ready')).toBeNull();
  });

  it('pauses a timed notification added while the region is already hovered', async () => {
    vi.useFakeTimers();
    let controls: NotificationControls | undefined;
    render(<NotificationHarness capture={(value) => (controls = value)} />);

    act(() => {
      controls?.notify({timeout: null, title: 'Persistent history', tone: 'general'});
    });
    const region = screen.getByRole('region', {name: 'Solver notifications'});
    const list = region.querySelector('[data-wcl-notification-list]');
    fireEvent.pointerEnter(list!, {pointerType: 'mouse'});

    act(() => {
      controls?.notify({timeout: 4000, title: 'Run saved while paused', tone: 'success'});
    });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText('Run saved while paused')).toBeTruthy();

    fireEvent.pointerLeave(list!, {pointerType: 'mouse'});
    await act(async () => {
      vi.advanceTimersByTime(4000);
      await new Promise<void>((resolve) => queueMicrotask(resolve));
    });
    expect(screen.queryByText('Run saved while paused')).toBeNull();
    expect(screen.getByText('Persistent history')).toBeTruthy();
  });

  it('pauses a timed notification added while focus is already within the region', async () => {
    vi.useFakeTimers();
    let controls: NotificationControls | undefined;
    render(<NotificationHarness capture={(value) => (controls = value)} />);

    act(() => {
      controls?.notify({timeout: null, title: 'Persistent history', tone: 'general'});
    });
    screen.getByRole('alertdialog').focus();

    act(() => {
      controls?.notify({timeout: 4000, title: 'Run saved while focused', tone: 'success'});
    });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText('Run saved while focused')).toBeTruthy();

    screen.getByRole('button', {name: 'Current work'}).focus();
    await act(async () => {
      vi.advanceTimersByTime(4000);
      await new Promise<void>((resolve) => queueMicrotask(resolve));
    });
    expect(screen.queryByText('Run saved while focused')).toBeNull();
    expect(screen.getByText('Persistent history')).toBeTruthy();
  });

  it('pauses a timed notification while focus remains within it', () => {
    vi.useFakeTimers();
    let controls: NotificationControls | undefined;
    render(<NotificationHarness capture={(value) => (controls = value)} maxVisible={1} />);

    act(() => {
      controls?.notify({timeout: 4000, title: 'Run saved', tone: 'general'});
    });

    const notification = screen.getByRole('alertdialog');
    notification.focus();
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText('Run saved')).toBeTruthy();

    notification.blur();
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.queryByText('Run saved')).toBeNull();
  });

  it('removes a programmatically dismissed notification before its callback runs', async () => {
    let controls: NotificationControls | undefined;
    const dismissed = vi.fn(() => {
      controls?.notify({timeout: null, title: 'Follow-up ready', tone: 'general'});
    });
    render(<NotificationHarness capture={(value) => (controls = value)} maxVisible={1} />);

    let key = '';
    act(() => {
      key =
        controls?.notify({
          onDismiss: dismissed,
          timeout: null,
          title: 'Original notification',
          tone: 'general',
        }) ?? '';
    });
    await act(async () => {
      controls?.dismiss(key);
      await new Promise<void>((resolve) => queueMicrotask(resolve));
    });

    expect(screen.queryByText('Original notification')).toBeNull();
    expect(screen.getByText('Follow-up ready')).toBeTruthy();
    expect(dismissed).toHaveBeenCalledOnce();
  });

  it('rejects unbounded notification timing and visible counts', () => {
    expect(() =>
      render(<NotificationHarness capture={() => undefined} maxVisible={4 as 3} />),
    ).toThrow(/maxVisible must be one, two, or three/i);

    let controls: NotificationControls | undefined;
    render(<NotificationHarness capture={(value) => (controls = value)} />);

    expect(() => {
      controls?.notify({timeout: 3999, title: 'Too brief', tone: 'general'});
    }).toThrow(/timeout must be between 4000 and 30000/i);
    expect(() => {
      controls?.notify({timeout: Number.POSITIVE_INFINITY, title: 'No bound', tone: 'general'});
    }).toThrow(/timeout must be between 4000 and 30000/i);
  });

  it('server-renders and hydrates without mounting a notification portal early', () => {
    const specimen = (
      <AppearanceProvider accent="#2878ff" appearance="light">
        <Skeleton lines={2} shape="text" width="three-quarters" />
        <EmptyState
          description="Add a boundary condition before running."
          kind="no-data"
          title="No boundary conditions"
        />
        <NotificationProvider dismissLabel="Dismiss" label="Notifications">
          {() => <span>Application content</span>}
        </NotificationProvider>
      </AppearanceProvider>
    );
    const markup = renderToString(specimen);
    document.body.innerHTML = `<div id="root">${markup}</div>`;
    const rootElement = document.querySelector('#root')!;

    expect(markup).not.toContain('data-wcl-notification-region');
    expect(() => hydrateRoot(rootElement, specimen)).not.toThrow();
  });
});
