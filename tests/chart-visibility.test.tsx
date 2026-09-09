import {act, cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {LineChart, ColumnChart, AreaChart, BarChart, CartesianChart} from '../src/index.js';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const data = [
  {month: 'Jan', revenue: 1000, cost: 100},
  {month: 'Feb', revenue: 1200, cost: 120},
];
const visibilityLabels = {
  hideSeries: (label: string) => `Hide ${label}`,
  showSeries: (label: string) => `Show ${label}`,
  hidden: 'Hidden',
  allHidden: {title: 'No visible series', description: 'Restore a series to read its values.'},
  showAll: 'Show all series',
};
const props = {
  data,
  title: 'Finances',
  description: 'Revenue and cost by month.',
  dataTableLabel: 'Complete finances',
  emptyState: {title: 'No data', description: 'Choose a period.'},
  invalidData: {title: 'Invalid data', description: 'Correct the source data.'},
  legend: {label: 'Financial series'},
  visibilityLabels,
  series: [
    {id: 'revenue', label: 'Revenue', accessor: 'revenue', showPoints: true},
    {id: 'cost', label: 'Cost', accessor: 'cost', showPoints: true},
  ] as const,
  xAxis: {accessor: 'month', label: 'Month', scale: {type: 'categorical'}} as const,
  yAxis: {label: 'Amount', unit: 'USD', scale: {type: 'linear'}} as const,
};

describe('Cartesian series visibility', () => {
  it('animates scale changes through finite geometry and retargets interrupted transitions', () => {
    let now = 0;
    let nextFrame = 0;
    const frames = new Map<number, FrameRequestCallback>();
    vi.spyOn(performance, 'now').mockImplementation(() => now);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.set(++nextFrame, callback);
      return nextFrame;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    const advance = (time: number) =>
      act(() => {
        now = time;
        const callbacks = [...frames.values()];
        frames.clear();
        callbacks.forEach((callback) => callback(now));
      });
    const {container, unmount} = render(<ColumnChart {...props} />);
    const height = () =>
      Number(container.querySelector('[data-series-id="cost"] rect')?.getAttribute('height'));
    const initial = height();
    fireEvent.click(screen.getByRole('button', {name: 'Hide Revenue'}));
    advance(120);
    const intermediate = height();
    expect(intermediate).toBeGreaterThan(initial);
    advance(240);
    expect(height()).toBeGreaterThan(intermediate);
    fireEvent.click(screen.getByRole('button', {name: 'Show Revenue'}));
    advance(300);
    const interrupted = height();
    fireEvent.click(screen.getByRole('button', {name: 'Hide Revenue'}));
    expect(height()).toBeCloseTo(interrupted);
    advance(420);
    expect(Number.isFinite(height())).toBe(true);
    expect(height()).toBeGreaterThan(interrupted);
    unmount();
    expect(frames.size).toBe(0);
  });

  it('settles a running scale animation when reduced motion is requested', () => {
    const listeners = new Set<() => void>();
    const media = {
      matches: false,
      addEventListener: (_type: string, fn: () => void) => listeners.add(fn),
      removeEventListener: (_type: string, fn: () => void) => listeners.delete(fn),
    };
    const frames = new Map<number, FrameRequestCallback>();
    let id = 0;
    vi.stubGlobal('matchMedia', () => media);
    vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => {
      frames.set(++id, fn);
      return id;
    });
    vi.stubGlobal('cancelAnimationFrame', (key: number) => frames.delete(key));
    const {container, unmount} = render(<ColumnChart {...props} />);
    fireEvent.click(screen.getByRole('button', {name: 'Hide Revenue'}));
    expect(frames.size).toBeGreaterThan(0);
    act(() => {
      media.matches = true;
      listeners.forEach((fn) => fn());
    });
    expect(
      Number(container.querySelector('[data-series-id="cost"] rect')?.getAttribute('height')),
    ).toBeGreaterThan(150);
    expect(frames.size).toBe(0);
    unmount();
    expect(listeners.size).toBe(0);
  });

  it('keeps eye controls separate from emphasis and retains complete structured data', () => {
    const {container} = render(<LineChart {...props} />);
    fireEvent.click(screen.getByRole('button', {name: 'Revenue'}));
    expect(screen.getByRole('button', {name: 'Revenue'}).getAttribute('aria-pressed')).toBe('true');
    const eye = screen.getByRole('button', {name: 'Hide Revenue'});
    eye.focus();
    fireEvent.click(eye);
    expect(screen.getByRole('button', {name: 'Show Revenue'})).toBe(eye);
    expect(document.activeElement).toBe(eye);
    expect(container.querySelector('[data-series-id="revenue"]')).toBeNull();
    expect(
      container.querySelector('[data-series-id="cost"]')?.getAttribute('data-series-index'),
    ).toBe('1');
    expect(screen.getByRole('button', {name: 'Revenue'}).getAttribute('aria-pressed')).toBe(
      'false',
    );
    expect(screen.getByRole('button', {name: 'Revenue'}).getAttribute('aria-disabled')).toBe(
      'true',
    );
    const table = screen.getByRole('table', {name: 'Complete finances'});
    expect(within(table).getByRole('columnheader', {name: /Revenue.*Hidden/})).toBeTruthy();
    expect(within(table).getByRole('cell', {name: '1200'})).toBeTruthy();
    const chart = screen.getByRole('group', {name: 'Finances'});
    fireEvent.focus(chart);
    fireEvent.keyDown(chart, {key: 'End'});
    expect(screen.getByRole('tooltip').textContent).toContain('120 USD');
    expect(screen.getByRole('tooltip').textContent).not.toContain('Revenue');
    fireEvent.click(eye);
    expect(container.querySelector('[data-series-id="revenue"]')).not.toBeNull();
    expect(screen.getByRole('button', {name: 'Revenue'}).getAttribute('aria-pressed')).toBe(
      'false',
    );
  });

  it('keeps all-hidden charts recoverable with their legend and full table', () => {
    const {container} = render(<LineChart {...props} />);
    fireEvent.click(screen.getByRole('button', {name: 'Hide Revenue'}));
    const costEye = screen.getByRole('button', {name: 'Hide Cost'});
    costEye.focus();
    fireEvent.click(costEye);
    expect(container.querySelector('[data-wcl-chart-svg]')).toBeNull();
    expect(screen.getByText(visibilityLabels.allHidden.title)).toBeTruthy();
    expect(screen.getByRole('table', {name: 'Complete finances'})).toBeTruthy();
    expect(
      screen.getByRole('list', {name: 'Financial series'}).querySelectorAll('li'),
    ).toHaveLength(2);
    expect(document.activeElement).toBe(costEye);
    fireEvent.click(screen.getByRole('button', {name: 'Show all series'}));
    expect(container.querySelectorAll('[data-wcl-chart-line]')).toHaveLength(2);
    expect(document.activeElement).toBe(screen.getByRole('button', {name: 'Hide Revenue'}));
  });

  it('fits visible columns with a zero baseline and respects explicit consumer bounds', async () => {
    const {container, rerender} = render(<ColumnChart {...props} />);
    fireEvent.click(screen.getByRole('button', {name: 'Hide Revenue'}));
    const cost = container.querySelector('[data-series-id="cost"] rect');
    await waitFor(() => expect(Number(cost?.getAttribute('height'))).toBeGreaterThan(150));
    rerender(
      <ColumnChart
        {...props}
        yAxis={{...props.yAxis, scale: {type: 'linear', domain: [0, 1200]}}}
      />,
    );
    expect(
      Number(container.querySelector('[data-series-id="cost"] rect')?.getAttribute('height')),
    ).toBeLessThan(50);
  });

  it('renormalizes visible areas while retaining complete-data table shares', () => {
    const {container} = render(
      <AreaChart
        {...props}
        stacking="normalized"
        yAxis={{label: 'Share', scale: {type: 'normalized'}}}
      />,
    );
    fireEvent.click(screen.getByRole('button', {name: 'Hide Revenue'}));
    fireEvent.focus(screen.getByRole('group', {name: 'Finances'}));
    expect(screen.getByRole('tooltip').textContent).toContain('100%');
    expect(screen.getByRole('tooltip').textContent).not.toContain('Revenue');
    expect(
      within(screen.getByRole('table', {name: 'Complete finances'})).getAllByRole('cell', {
        name: '9%',
      }),
    ).toHaveLength(2);
    expect(container.querySelectorAll('[data-wcl-chart-area]')).toHaveLength(1);
  });

  it('preserves hidden ids on value changes and forgets ids removed from the chart', () => {
    const {rerender} = render(<LineChart {...props} />);
    fireEvent.click(screen.getByRole('button', {name: 'Hide Revenue'}));
    rerender(
      <LineChart {...props} data={data.map((row) => ({...row, revenue: row.revenue + 10}))} />,
    );
    expect(screen.getByRole('button', {name: 'Show Revenue'})).toBeTruthy();
    rerender(<LineChart {...props} series={[props.series[1]]} />);
    rerender(<LineChart {...props} />);
    expect(screen.getByRole('button', {name: 'Hide Revenue'})).toBeTruthy();
  });
  it('clips restoring marks to the plot while the scale is still expanding', () => {
    const {container} = render(<ColumnChart {...props} />);
    const marks = container.querySelector('[data-series-id="revenue"]');
    const clip = marks?.closest('[clip-path]');
    expect(clip).not.toBeNull();
    const id = clip?.getAttribute('clip-path')?.slice(5, -1);
    expect([...container.querySelectorAll('clipPath')].some((path) => path.id === id)).toBe(true);
  });
  it('keeps logarithmic readings positive and exact after hiding a larger series', async () => {
    const {container} = render(
      <LineChart {...props} yAxis={{...props.yAxis, scale: {type: 'logarithmic'}}} />,
    );
    fireEvent.click(screen.getByRole('button', {name: 'Hide Revenue'}));
    const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
    fireEvent.focus(canvas);
    fireEvent.keyDown(canvas, {key: 'End'});
    expect(within(screen.getByRole('tooltip')).getByText('120 USD')).toBeTruthy();
    await waitFor(() =>
      expect(container.querySelector('[data-wcl-chart-line]')?.getAttribute('d')).not.toMatch(
        /NaN|Infinity/,
      ),
    );
    expect(within(screen.getByRole('tooltip')).queryByText('Revenue')).toBeNull();
  });

  it('retains invalid-data feedback when the invalid series is hidden', () => {
    render(<LineChart {...props} data={[...data, {month: 'Mar', revenue: NaN, cost: 140}]} />);
    fireEvent.click(screen.getByRole('button', {name: 'Hide Revenue'}));
    expect(screen.getByText(props.invalidData.title)).toBeTruthy();
    expect(within(screen.getByRole('table')).queryByText('Mar')).toBeNull();
    fireEvent.click(screen.getByRole('button', {name: 'Hide Cost'}));
    expect(screen.getByText(props.invalidData.title)).toBeTruthy();
    expect(screen.getByText(visibilityLabels.allHidden.title)).toBeTruthy();
  });

  it('fits horizontal bars and recomputes a visible stack', async () => {
    const {container, rerender} = render(
      <BarChart {...props} xAxis={props.yAxis} yAxis={props.xAxis} layout="stacked" />,
    );
    fireEvent.click(screen.getByRole('button', {name: 'Hide Revenue'}));
    await waitFor(() =>
      expect(
        Number(container.querySelector('[data-series-id="cost"] rect')?.getAttribute('width')),
      ).toBeGreaterThan(300),
    );
    const bar = container.querySelector('[data-series-id="cost"] rect');
    expect(Number(bar?.getAttribute('x'))).toBeLessThan(100);
    rerender(
      <CartesianChart
        {...props}
        series={[
          {...props.series[0], kind: 'column'},
          {...props.series[1], kind: 'line'},
        ]}
      />,
    );
    fireEvent.click(screen.getByRole('button', {name: 'Hide Revenue'}));
    expect(container.querySelectorAll('[data-wcl-chart-bar]')).toHaveLength(0);
    expect(container.querySelectorAll('[data-wcl-chart-line]')).toHaveLength(1);
  });
  it('keeps the accepted name-then-eye keyboard order', () => {
    render(<LineChart {...props} />);
    expect(
      within(screen.getByRole('list', {name: 'Financial series'}))
        .getAllByRole('button')
        .map((button) => button.getAttribute('aria-label') ?? button.textContent),
    ).toEqual(['Revenue', 'Hide Revenue', 'Cost', 'Hide Cost']);
  });

  it('preserves annotation labels at domain boundaries outside the animated geometry clip', () => {
    const {container} = render(
      <LineChart
        {...props}
        yAxis={{...props.yAxis, scale: {type: 'linear', domain: [0, 1200]}}}
        annotations={[
          {axis: 'y', kind: 'line', label: 'Upper limit', value: 1200},
          {kind: 'point', label: 'Peak', x: 'Feb', y: 1200},
        ]}
      />,
    );
    for (const label of container.querySelectorAll('[data-wcl-chart-annotation-label]')) {
      expect(label.closest('[clip-path]')).toBeNull();
    }
    expect(container.querySelectorAll('[data-wcl-chart-annotation-label]')).toHaveLength(2);
  });
});

it.each(['hover', 'focus'] as const)(
  'releases legend emphasis on a second activation while %s remains',
  (preview) => {
    const {container} = render(<LineChart {...props} />);
    const button = container.querySelector<HTMLButtonElement>('[data-wcl-chart-legend-button]')!;
    const entry = button.closest('li')!;
    if (preview === 'hover') fireEvent.mouseEnter(button);
    else {
      act(() => button.focus());
      fireEvent.focus(button);
    }
    expect(entry.hasAttribute('data-emphasized')).toBe(true);
    fireEvent.click(button);
    expect(button.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(button);
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(entry.hasAttribute('data-emphasized')).toBe(false);
    expect(container.querySelector('[data-wcl-chart-legend] [data-muted]')).toBeNull();
    if (preview === 'focus') expect(document.activeElement).toBe(button);
    if (preview === 'hover') {
      fireEvent.mouseLeave(button);
      fireEvent.mouseEnter(button);
    } else {
      fireEvent.blur(button);
      fireEvent.focus(button);
    }
    expect(entry.hasAttribute('data-emphasized')).toBe(true);
    fireEvent.click(button);
    expect(button.getAttribute('aria-pressed')).toBe('true');
  },
);
