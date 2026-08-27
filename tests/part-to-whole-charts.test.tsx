import {act} from 'react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {afterEach, describe, expect, it} from 'vitest';

import {DonutChart, PieChart} from '../src/index.js';

(globalThis as typeof globalThis & {IS_REACT_ACT_ENVIRONMENT: boolean}).IS_REACT_ACT_ENVIRONMENT =
  true;

afterEach(cleanup);

const categories = [
  {id: 'residential', label: 'Residential', value: 43},
  {id: 'food', label: 'Food processing', value: 31},
  {id: 'offices', label: 'Offices', value: 26},
  {id: 'retail', label: 'Retail', value: 18},
  {id: 'schools', label: 'Schools', value: 14},
  {id: 'manufacturing', label: 'Manufacturing', value: 12},
  {id: 'hospitality', label: 'Hospitality', value: 9},
  {id: 'data-centers', label: 'Data centers', value: 8},
  {id: 'transit', label: 'Transit', value: 7},
  {id: 'libraries', label: 'Libraries', value: 6},
  {id: 'workshops', label: 'Workshops', value: 5},
  {id: 'agriculture', label: 'Agriculture', value: 4},
  {id: 'civic', label: 'Civic buildings', value: 3},
  {id: 'markets', label: 'Public markets', value: 2},
  {id: 'storage', label: 'Storage', value: 0},
] as const;

const common = {
  dataTableLabel: 'Community annual energy use',
  description: 'Annual metered use by customer category, ranked by megawatt-hours.',
  emptyState: {description: 'Choose a year with recorded use.', title: 'No energy use'},
  invalidData: {description: 'Correct invalid category values.', title: 'Invalid energy use'},
  labels: {
    back: 'Back',
    category: 'Category',
    categoryRange: ({end, start, total}: {end: number; start: number; total: number}) =>
      `Categories ${start}–${end} of ${total}`,
    moreCategories: (count: number) => `More categories (${count})`,
    shareOfTotal: 'Share of total',
    shareOnPage: 'Share on this page',
  },
  legend: {label: 'Visible categories'},
  title: 'Community energy use',
  value: {accessor: 'value', label: 'Energy use', unit: 'MWh'},
} as const;

describe('part-to-whole charts', () => {
  it('pages ranked positive categories through a proportional aggregate by default', () => {
    const {container} = render(
      <PieChart {...common} data={categories} idAccessor="id" labelAccessor="label" />,
    );

    expect(container.querySelectorAll('[data-wcl-radial-slice]')).toHaveLength(8);
    expect(container.querySelector('[data-wcl-radial-aggregate-label]')?.textContent).toBe('+7');
    const aggregate = container.querySelector('[data-wcl-radial-segment][data-aggregate]')!;
    const completeTotal = categories.reduce((sum, category) => sum + category.value, 0);
    const hiddenTotal = categories.slice(7, 14).reduce((sum, category) => sum + category.value, 0);
    expect(Number(aggregate.getAttribute('data-angle-size'))).toBeCloseTo(
      (hiddenTotal / completeTotal) * Math.PI * 2,
      5,
    );
    expect(
      within(screen.getByRole('table', {name: common.dataTableLabel})).getAllByRole('row'),
    ).toHaveLength(categories.length + 1);

    fireEvent.click(aggregate.querySelector('path')!);
    expect(screen.getAllByText('Categories 8–14 of 14')).toHaveLength(2);
    expect(container.querySelectorAll('[data-wcl-radial-slice]')).toHaveLength(7);
    expect(container.querySelector('[data-wcl-radial-segment][data-aggregate]')).toBeNull();
    expect(screen.queryByRole('tooltip')).toBeNull();

    fireEvent.click(screen.getByRole('button', {name: 'Back'}));
    expect(screen.getAllByText('Categories 1–7 of 14')).toHaveLength(2);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('keeps the DonutChart total numeric and gives slice and legend emphasis distinct behavior', () => {
    const {container} = render(
      <DonutChart
        {...common}
        data={categories.slice(0, 5)}
        idAccessor="id"
        labelAccessor="label"
        totalLabel="MWh total"
      />,
    );

    expect(container.querySelector('[data-wcl-radial-total-value]')?.textContent).toBe('132');
    expect(container.querySelector('[data-wcl-radial-total-label]')?.textContent).toBe('MWh total');

    const residential = container.querySelector('[data-segment-id="residential"]')!;
    fireEvent.pointerMove(residential.querySelector('path')!, {
      clientX: 220,
      clientY: 180,
      pointerType: 'mouse',
    });
    const tooltip = within(screen.getByRole('tooltip'));
    expect(tooltip.getByText('Residential')).toBeTruthy();
    expect(tooltip.getByText('43 MWh')).toBeTruthy();
    expect(tooltip.getByText('Share of total')).toBeTruthy();
    expect(tooltip.getByText('Share on this page')).toBeTruthy();
    expect(residential.getAttribute('style')).not.toContain('translate(0px, 0px)');
    expect(container.querySelectorAll('[data-wcl-radial-segment][data-muted]')).toHaveLength(4);

    fireEvent.pointerLeave(container.querySelector('[data-wcl-chart-svg]')!);
    const residentialLegend = screen.getByRole('button', {name: 'Residential 43 MWh'});
    fireEvent.mouseEnter(residentialLegend);
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(residential.hasAttribute('data-emphasized')).toBe(true);
    fireEvent.click(residentialLegend);
    fireEvent.mouseLeave(residentialLegend);
    expect(residentialLegend.getAttribute('aria-pressed')).toBe('true');
    expect(residential.hasAttribute('data-emphasized')).toBe(true);

    const officesLegend = screen.getByRole('button', {name: 'Offices 26 MWh'});
    fireEvent.click(officesLegend);
    expect(residentialLegend.getAttribute('aria-pressed')).toBe('false');
    expect(officesLegend.getAttribute('aria-pressed')).toBe('true');
    fireEvent.keyDown(officesLegend, {key: 'Escape'});
    expect(officesLegend.getAttribute('aria-pressed')).toBe('false');

    fireEvent.pointerDown(residential.querySelector('path')!, {pointerType: 'touch'});
    expect(screen.getByRole('tooltip').textContent).toContain('Residential');
    fireEvent.mouseEnter(residentialLegend);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('distinguishes zero values from invalid records in visual and structured output', () => {
    const {container, rerender} = render(
      <PieChart
        {...common}
        data={[
          {id: 'sold', label: 'Sold', value: 3},
          {id: 'unsold', label: 'Unsold', value: 0},
          {id: 'invalid', label: 'Invalid', value: -1},
        ]}
        idAccessor="id"
        labelAccessor="label"
      />,
    );

    expect(container.querySelectorAll('[data-wcl-radial-slice]')).toHaveLength(1);
    expect(screen.getByText(common.invalidData.title)).toBeTruthy();
    expect(
      within(screen.getByRole('table', {name: common.dataTableLabel})).getAllByRole('row'),
    ).toHaveLength(3);

    rerender(
      <PieChart
        {...common}
        data={[
          {id: 'first', label: 'First', value: 0},
          {id: 'second', label: 'Second', value: 0},
        ]}
        idAccessor="id"
        labelAccessor="label"
      />,
    );
    expect(container.querySelector('[data-wcl-empty-state][data-kind="no-data"]')).toBeTruthy();
    expect(container.querySelector('[data-wcl-chart-svg]')).toBeNull();
    expect(screen.getByRole('table', {name: common.dataTableLabel})).toBeTruthy();

    rerender(
      <PieChart
        {...common}
        data={[
          {id: 'zero', label: 'Zero', value: 0},
          {id: 'invalid', label: 'Invalid', value: -1},
        ]}
        idAccessor="id"
        labelAccessor="label"
      />,
    );
    expect(container.querySelector('[data-wcl-empty-state][data-kind="no-data"]')).toBeTruthy();
    expect(screen.getByText(common.invalidData.title)).toBeTruthy();

    rerender(
      <PieChart
        {...common}
        data={[
          {id: 'negative', label: 'Negative', value: -1},
          {id: 'non-finite', label: 'Non-finite', value: Number.NaN},
        ]}
        idAccessor="id"
        labelAccessor="label"
      />,
    );
    expect(container.querySelector('[data-wcl-empty-state][data-kind="unavailable"]')).toBeTruthy();
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('uses localized share copy in the generated table', () => {
    render(
      <PieChart
        {...common}
        data={categories.slice(0, 2)}
        idAccessor="id"
        labelAccessor="label"
        labels={{...common.labels, category: 'Customer type', shareOfTotal: 'Whole share'}}
      />,
    );

    expect(
      within(screen.getByRole('table', {name: common.dataTableLabel})).getByRole('columnheader', {
        name: 'Whole share',
      }),
    ).toBeTruthy();
    expect(
      within(screen.getByRole('table', {name: common.dataTableLabel})).getByRole('columnheader', {
        name: 'Customer type',
      }),
    ).toBeTruthy();
  });

  it('keeps the optional aggregate smallest and clears reduced aggregate readings on navigation', () => {
    const {container} = render(
      <PieChart
        {...common}
        aggregateSizing="smallest"
        data={categories}
        idAccessor="id"
        labelAccessor="label"
      />,
    );
    const aggregate = container.querySelector('[data-wcl-radial-segment][data-aggregate]')!;
    const ordinaryAngles = Array.from(
      container.querySelectorAll('[data-wcl-radial-segment]:not([data-aggregate])'),
      (segment) => Number(segment.getAttribute('data-angle-size')),
    );
    expect(Number(aggregate.getAttribute('data-angle-size'))).toBeLessThan(
      Math.min(...ordinaryAngles),
    );

    const aggregatePath = aggregate.querySelector('path')!;
    fireEvent.pointerMove(aggregatePath, {
      clientX: 210,
      clientY: 170,
      pointerType: 'mouse',
    });
    const aggregateTooltip = within(screen.getByRole('tooltip'));
    expect(aggregateTooltip.getByText('More categories (7)')).toBeTruthy();
    expect(aggregateTooltip.getByText('35 MWh')).toBeTruthy();
    expect(aggregateTooltip.queryByText(common.labels.shareOfTotal)).toBeNull();
    expect(aggregateTooltip.queryByText(common.labels.shareOnPage)).toBeNull();

    fireEvent.click(aggregatePath);
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(screen.getAllByText('Categories 8–14 of 14')).toHaveLength(2);
  });

  it('opens an aggregate from the keyboard and starts reading the next page', () => {
    const {container} = render(
      <PieChart {...common} data={categories} idAccessor="id" labelAccessor="label" />,
    );
    const canvas = container.querySelector('[data-wcl-chart-canvas]')!;
    fireEvent.focus(canvas);
    fireEvent.keyDown(canvas, {key: 'End'});
    expect(screen.getByRole('tooltip').textContent).toContain('More categories (7)');
    expect(container.querySelector('[data-wcl-chart-reading-announcement]')?.textContent).toContain(
      'More categories (7). Energy use: 35 MWh',
    );

    fireEvent.keyDown(canvas, {key: 'Enter'});
    expect(screen.getByText('Categories 8–14 of 14')).toBeTruthy();
    expect(screen.getByRole('tooltip').textContent).toContain('Data centers');
    expect(screen.getByRole('tooltip').textContent).not.toContain('More categories');
    expect(container.querySelector('[data-wcl-chart-reading-announcement]')?.textContent).toContain(
      'Categories 8–14 of 14. Data centers. Energy use: 8 MWh',
    );
  });

  it('keeps aggregate navigation distinct from a category whose id is aggregate', () => {
    const data = Array.from({length: 10}, (_, index) => ({
      id: index === 0 ? 'aggregate' : `category-${index}`,
      label: index === 0 ? 'Reserved name' : `Category ${index}`,
      value: 20 - index,
    }));
    const {container} = render(
      <PieChart {...common} data={data} idAccessor="id" labelAccessor="label" />,
    );

    fireEvent.mouseEnter(screen.getByRole('button', {name: 'Reserved name 20 MWh'}));
    expect(container.querySelectorAll('[data-wcl-radial-segment][data-emphasized]')).toHaveLength(
      1,
    );
    expect(
      container
        .querySelector('[data-wcl-radial-segment][data-emphasized]')
        ?.hasAttribute('data-aggregate'),
    ).toBe(false);
  });

  it('traverses later aggregate pages and every prior page', () => {
    const data = Array.from({length: 25}, (_, index) => ({
      id: `category-${index + 1}`,
      label: `Category ${index + 1}`,
      value: 25 - index,
    }));
    const {container} = render(
      <PieChart {...common} data={data} idAccessor="id" labelAccessor="label" />,
    );

    fireEvent.click(container.querySelector('[data-wcl-radial-segment][data-aggregate] path')!);
    expect(screen.getAllByText('Categories 8–15 of 25')).toHaveLength(2);
    fireEvent.click(container.querySelector('[data-wcl-radial-segment][data-aggregate] path')!);
    expect(screen.getAllByText('Categories 16–23 of 25')).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', {name: 'Back'}));
    expect(screen.getAllByText('Categories 8–15 of 25')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', {name: 'Back'}));
    expect(screen.getAllByText('Categories 1–7 of 25')).toHaveLength(2);
  });

  it('renders deterministic responsive markup and hydrates without recovery', async () => {
    const specimen = (
      <DonutChart
        {...common}
        aspectRatio={1.5}
        data={categories}
        idAccessor="id"
        labelAccessor="label"
        minimumSize={{height: 240, width: 320}}
        totalLabel="MWh total"
      />
    );
    const markup = renderToString(specimen);
    document.body.innerHTML = `<div id="root">${markup}</div>`;
    const rootElement = document.querySelector('#root')!;
    const frame = rootElement.querySelector('[data-wcl-chart-frame]');
    expect(frame?.getAttribute('style')).toContain('--wcl-chart-aspect-ratio:1.5');
    expect(frame?.getAttribute('style')).toContain('--wcl-chart-minimum-width:320px');
    expect(frame?.getAttribute('style')).toContain('--wcl-chart-minimum-height:240px');

    const recoverableErrors: unknown[] = [];
    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(async () => {
      root = hydrateRoot(rootElement, specimen, {
        onRecoverableError: (error) => recoverableErrors.push(error),
      });
      await Promise.resolve();
    });
    expect(recoverableErrors).toEqual([]);
    await act(async () => {
      root?.unmount();
      await Promise.resolve();
    });
  });

  it('uses the standard chart bounds by default', () => {
    const {container} = render(
      <PieChart {...common} data={categories} idAccessor="id" labelAccessor="label" />,
    );
    const frame = container.querySelector<HTMLElement>('[data-wcl-chart-frame]')!;

    expect(frame.style.getPropertyValue('--wcl-chart-aspect-ratio')).toBe('1.72');
    expect(frame.style.getPropertyValue('--wcl-chart-minimum-height')).toBe('180px');
    expect(frame.style.getPropertyValue('--wcl-chart-minimum-width')).toBe('320px');
  });

  it('lets a consumer minimum width exceed the default bound', () => {
    const {container} = render(
      <PieChart
        {...common}
        data={categories}
        idAccessor="id"
        labelAccessor="label"
        minimumSize={{height: 180, width: 640}}
      />,
    );

    expect(
      container
        .querySelector<HTMLElement>('[data-wcl-part-to-whole-chart]')
        ?.style.getPropertyValue('--wcl-chart-minimum-width'),
    ).toBe('640px');
  });

  it('keeps structured data with partial results but hides it while loading or unavailable', () => {
    const {rerender} = render(
      <PieChart
        {...common}
        data={categories.slice(0, 2)}
        idAccessor="id"
        labelAccessor="label"
        status={{
          description: 'One category is provisional.',
          kind: 'partial',
          title: 'Partial use',
        }}
      />,
    );
    expect(screen.getByRole('table', {name: common.dataTableLabel})).toBeTruthy();
    expect(screen.getByRole('note').textContent).toContain('One category is provisional.');

    rerender(
      <PieChart
        {...common}
        data={categories.slice(0, 2)}
        idAccessor="id"
        labelAccessor="label"
        status={{kind: 'loading', label: 'Loading energy use'}}
      />,
    );
    expect(screen.getByRole('status').textContent).toBe('Loading energy use');
    expect(screen.queryByRole('table')).toBeNull();

    rerender(
      <PieChart
        {...common}
        data={categories.slice(0, 2)}
        idAccessor="id"
        labelAccessor="label"
        status={{
          description: 'The energy request failed.',
          kind: 'error',
          title: 'Use unavailable',
        }}
      />,
    );
    expect(screen.getByRole('note').textContent).toContain('The energy request failed.');
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('rejects duplicate category identity before validating record values', () => {
    expect(() =>
      render(
        <PieChart
          {...common}
          data={[
            {id: 'duplicate', label: 'First', value: -1},
            {id: 'duplicate', label: 'Second', value: 2},
          ]}
          idAccessor="id"
          labelAccessor="label"
        />,
      ),
    ).toThrow(/category id "duplicate" is duplicated/i);
  });

  it('requires complete state copy, supported aggregate sizing, and DonutChart center copy', () => {
    expect(() =>
      render(
        <PieChart
          {...common}
          data={categories.slice(0, 2)}
          emptyState={{...common.emptyState, title: ' '}}
          idAccessor="id"
          labelAccessor="label"
        />,
      ),
    ).toThrow(/empty-state title.*blank/i);

    expect(() =>
      render(
        <PieChart
          {...common}
          aggregateSizing={'unsupported' as 'proportional'}
          data={categories.slice(0, 2)}
          idAccessor="id"
          labelAccessor="label"
        />,
      ),
    ).toThrow(/aggregateSizing.*proportional.*smallest/i);

    expect(() =>
      render(
        <DonutChart
          {...common}
          data={categories.slice(0, 2)}
          idAccessor="id"
          labelAccessor="label"
          totalLabel=" "
        />,
      ),
    ).toThrow(/total label.*blank/i);
  });
});
