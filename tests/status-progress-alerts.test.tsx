import {cleanup, render, screen} from '@testing-library/react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {afterEach, describe, expect, it} from 'vitest';

import {
  AlertBanner,
  Badge,
  InlineAlert,
  Meter,
  ProgressBar,
  Spinner,
  StatusIndicator,
} from '../src/index.js';

afterEach(cleanup);

describe('status, progress, and alerts', () => {
  it('keeps semantic status separate from accent-bearing metadata', () => {
    const {container} = render(
      <>
        <StatusIndicator label="Stable" tone="success" />
        <StatusIndicator label="Solving" tone="warning" />
        <StatusIndicator label="Failed" tone="danger" />
        <StatusIndicator label="Not started" tone="neutral" />
        <Badge tone="accent">Current run</Badge>
      </>,
    );

    expect(
      container.querySelector('[data-wcl-status-indicator][data-tone="success"]'),
    ).toBeTruthy();
    expect(
      container.querySelector('[data-wcl-status-indicator][data-tone="warning"]'),
    ).toBeTruthy();
    expect(container.querySelector('[data-wcl-status-indicator][data-tone="danger"]')).toBeTruthy();
    expect(
      container.querySelector('[data-wcl-status-indicator][data-tone="neutral"]'),
    ).toBeTruthy();
    expect(container.querySelector('[data-wcl-badge][data-tone="accent"]')).toBeTruthy();
  });

  it('announces changing status through only its visible label', () => {
    const {rerender} = render(
      <StatusIndicator announcement="polite" label="Solving" tone="warning" />,
    );
    const status = screen.getByRole('status');

    expect(status.textContent).toBe('Solving');
    expect(status.getAttribute('aria-label')).toBeNull();
    expect(status.getAttribute('aria-atomic')).toBe('true');

    rerender(<StatusIndicator announcement="assertive" label="Run failed" tone="danger" />);

    expect(screen.getByRole('alert').textContent).toBe('Run failed');
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('keeps static alerts non-live and supports deliberate polite and assertive announcements', () => {
    const {rerender} = render(
      <InlineAlert title="Boundary review" tone="warning">
        Check the north wall coefficient.
      </InlineAlert>,
    );

    expect(screen.getByRole('note').textContent).toContain('Boundary review');
    expect(screen.queryByRole('status')).toBeNull();

    rerender(
      <AlertBanner announcement="polite" title="Run completed" tone="success">
        All boundary passes converged.
      </AlertBanner>,
    );
    expect(screen.getByRole('status').textContent).toContain('Run completed');

    rerender(
      <AlertBanner announcement="assertive" title="Run stopped" tone="danger">
        Reconnect the solver before retrying.
      </AlertBanner>,
    );
    expect(screen.getByRole('alert').textContent).toContain('Reconnect the solver');
  });

  it('renders zero-valued alert content', () => {
    const {container} = render(
      <InlineAlert title="Remaining retries" tone="warning">
        {0}
      </InlineAlert>,
    );

    expect(container.querySelector('[data-wcl-alert-description]')?.textContent).toBe('0');
  });

  it('exposes determinate progress value, units, and completion meaning', () => {
    render(
      <ProgressBar
        completionLabel="Complete when all 25 boundary passes are solved."
        isActive
        label="Solving boundary passes"
        maxValue={25}
        minValue={0}
        value={18}
        valueLabel="18 of 25 passes"
      />,
    );

    const progress = screen.getByRole('progressbar', {name: 'Solving boundary passes'});
    expect(progress.getAttribute('aria-valuemin')).toBe('0');
    expect(progress.getAttribute('aria-valuemax')).toBe('25');
    expect(progress.getAttribute('aria-valuenow')).toBe('18');
    expect(progress.getAttribute('aria-valuetext')).toBe('18 of 25 passes');
    expect(progress.getAttribute('aria-describedby')).toBe(
      screen.getByText('Complete when all 25 boundary passes are solved.').id,
    );
  });

  it('keeps indeterminate progress free of a fabricated value', () => {
    render(
      <ProgressBar
        completionLabel="Complete when the solver returns a converged result."
        isActive
        isIndeterminate
        label="Preparing solver"
        statusLabel="Estimating remaining work"
      />,
    );

    const progress = screen.getByRole('progressbar', {name: 'Preparing solver'});
    expect(progress.getAttribute('aria-valuenow')).toBeNull();
    expect(progress.getAttribute('aria-valuetext')).toBeNull();
    expect(progress.getAttribute('aria-describedby')?.split(' ')).toContain(
      screen.getByText('Estimating remaining work').id,
    );
    expect(progress.closest('[data-wcl-progress-bar]')?.hasAttribute('data-indeterminate')).toBe(
      true,
    );
  });

  it('keeps incomplete progress still when work is inactive', () => {
    const {rerender} = render(
      <ProgressBar
        completionLabel="Complete after every pass."
        isActive={false}
        label="Boundary solve paused"
        value={18}
        valueLabel="18 of 25 passes"
      />,
    );

    expect(screen.getByRole('progressbar').hasAttribute('data-active')).toBe(false);

    rerender(
      <ProgressBar
        completionLabel="Complete after every pass."
        isActive
        label="Solving boundary passes"
        value={18}
        valueLabel="18 of 25 passes"
      />,
    );

    expect(screen.getByRole('progressbar').hasAttribute('data-active')).toBe(true);
  });

  it('exposes a bounded meter value, unit-bearing label, and named thresholds', () => {
    render(
      <Meter
        label="Thermal load"
        maxValue={100}
        minValue={0}
        thresholds={[
          {label: 'Review begins', tone: 'warning', value: 70, valueLabel: '70 kilowatts'},
          {label: 'Unsafe begins', tone: 'danger', value: 90, valueLabel: '90 kilowatts'},
        ]}
        tone="warning"
        value={76}
        valueLabel="76 kilowatts"
      />,
    );

    const meter = screen.getByRole('meter', {name: 'Thermal load'});
    expect(meter.getAttribute('aria-valuenow')).toBe('76');
    expect(meter.getAttribute('aria-valuetext')).toBe('76 kilowatts');
    expect(meter.getAttribute('aria-describedby')?.split(' ')).toContain(
      screen.getByText('Review begins: 70 kilowatts.').closest('li')?.parentElement?.id,
    );
    expect(document.querySelectorAll('[data-wcl-meter-threshold]')).toHaveLength(2);
  });

  it('rejects invalid domains and unordered meter thresholds', () => {
    expect(() =>
      render(
        <ProgressBar
          completionLabel="Complete after every pass."
          isActive={false}
          label="Solve"
          maxValue={0}
          minValue={0}
          value={0}
          valueLabel="0 passes"
        />,
      ),
    ).toThrow(/maxValue must be greater than minValue/i);

    expect(() =>
      render(
        <Meter
          label="Thermal load"
          maxValue={100}
          minValue={0}
          thresholds={[
            {label: 'Unsafe', tone: 'danger', value: 90, valueLabel: '90 kilowatts'},
            {label: 'Review', tone: 'warning', value: 70, valueLabel: '70 kilowatts'},
          ]}
          value={76}
          valueLabel="76 kilowatts"
        />,
      ),
    ).toThrow(/thresholds must be ordered/i);
  });

  it('only exposes and animates a generic busy state while active', () => {
    const {container, rerender} = render(<Spinner isActive={false} label="Solving profile" />);
    const spinner = container.querySelector('[data-wcl-spinner]')!;
    const status = screen.getByRole('status');

    expect(status.textContent).toBe('');
    expect(container.querySelector('[data-wcl-spinner-visual]')?.getAttribute('aria-hidden')).toBe(
      'true',
    );

    rerender(<Spinner isActive label="Solving profile" />);

    expect(screen.getByRole('status').textContent).toBe('Solving profile');
    expect(spinner.hasAttribute('data-active')).toBe(true);
    expect(screen.getByRole('status').getAttribute('aria-busy')).toBeNull();
    expect(container.querySelectorAll('[data-wcl-spinner-segment]')).toHaveLength(6);
  });

  it('server-renders and hydrates the complete family without warnings', () => {
    const specimen = (
      <div>
        <StatusIndicator announcement="polite" label="Solving" tone="warning" />
        <Badge tone="accent">Run 0284</Badge>
        <InlineAlert title="Review" tone="warning">
          Check one coefficient.
        </InlineAlert>
        <AlertBanner title="Connected" tone="success">
          Solver is available.
        </AlertBanner>
        <ProgressBar
          completionLabel="Complete after every pass."
          isActive
          label="Solve"
          value={72}
          valueLabel="72 percent"
        />
        <Meter label="Load" maxValue={10} minValue={0} value={7} valueLabel="7 kilowatts" />
        <Spinner isActive label="Solving" />
      </div>
    );
    const markup = renderToString(specimen);
    document.body.innerHTML = `<div id="root">${markup}</div>`;
    const rootElement = document.querySelector('#root')!;

    expect(() => hydrateRoot(rootElement, specimen)).not.toThrow();
  });
});
