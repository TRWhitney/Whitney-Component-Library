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
} from '../src/index.js';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function NotificationHarness({
  capture,
  maxVisible = 2,
}: {
  readonly capture: (controls: NotificationControls) => void;
  readonly maxVisible?: 1 | 2 | 3;
}) {
  return (
    <AppearanceProvider accent="#2878ff" appearance="dark">
      <NotificationProvider
        dismissLabel="Dismiss notification"
        label="Solver notifications"
        maxVisible={maxVisible}
        placement="bottom-end"
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

  it('queues notifications newest-first and reveals queued items within the visible limit', () => {
    let controls: NotificationControls | undefined;
    render(<NotificationHarness capture={(value) => (controls = value)} />);

    act(() => {
      controls?.notify({title: 'First pass complete', tone: 'success'});
      controls?.notify({title: 'Second pass complete', tone: 'success'});
      controls?.notify({title: 'Third pass complete', tone: 'success'});
    });

    expect(screen.getAllByRole('alertdialog')).toHaveLength(2);
    expect(screen.getByText('Third pass complete')).toBeTruthy();
    expect(screen.getByText('Second pass complete')).toBeTruthy();
    expect(screen.queryByText('First pass complete')).toBeNull();

    fireEvent.click(screen.getAllByRole('button', {name: 'Dismiss notification'})[0]!);

    expect(screen.getAllByRole('alertdialog')).toHaveLength(2);
    expect(screen.getByText('First pass complete')).toBeTruthy();
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
        tone: 'success',
      });
      controls?.notify({
        description: 'Reconnect before starting another run.',
        title: 'Solver disconnected',
        tone: 'danger',
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
      controls?.notify({onDismiss: dismissed, timeout: 4000, title: 'Run saved', tone: 'success'});
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
      controls?.notify({timeout: null, title: 'Export ready', tone: 'neutral'});
    });
    const notification = screen.getByRole('alertdialog');
    notification.focus();
    fireEvent.keyDown(notification, {key: 'Escape'});
    expect(screen.queryByText('Export ready')).toBeNull();
  });

  it('pauses a timed notification while focus remains within it', () => {
    vi.useFakeTimers();
    let controls: NotificationControls | undefined;
    render(<NotificationHarness capture={(value) => (controls = value)} maxVisible={1} />);

    act(() => {
      controls?.notify({timeout: 4000, title: 'Run saved', tone: 'success'});
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
      controls?.notify({timeout: null, title: 'Follow-up ready', tone: 'success'});
    });
    render(<NotificationHarness capture={(value) => (controls = value)} maxVisible={1} />);

    let key = '';
    act(() => {
      key =
        controls?.notify({
          onDismiss: dismissed,
          timeout: null,
          title: 'Original notification',
          tone: 'neutral',
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
      controls?.notify({timeout: 3999, title: 'Too brief', tone: 'neutral'});
    }).toThrow(/timeout must be between 4000 and 30000/i);
    expect(() => {
      controls?.notify({timeout: Number.POSITIVE_INFINITY, title: 'No bound', tone: 'neutral'});
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
