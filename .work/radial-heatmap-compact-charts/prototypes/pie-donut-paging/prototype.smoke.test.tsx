import {cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {afterEach, describe, expect, it} from 'vitest';

import {PieDonutPagingPrototype} from './main.js';

afterEach(cleanup);

describe('Pie and donut paging prototype', () => {
  it('uses the selected remaining count through accepted eight-category paging', () => {
    const {container} = render(<PieDonutPagingPrototype />);

    expect(container.querySelector('[data-aggregate-label="count"]')?.textContent).toBe('+8');

    fireEvent.click(container.querySelector('[data-segment-id="aggregate"] path')!);
    expect(screen.getByText('Categories 8–15 of 15')).toBeTruthy();
    expect(screen.getByRole('button', {name: 'Back'})).toBeTruthy();
    expect(container.querySelectorAll('[data-wcl-radial-slice]')).toHaveLength(8);
    expect(container.querySelector('[data-segment-id="aggregate"]')).toBeNull();

    fireEvent.click(screen.getByRole('button', {name: 'Back'}));
    expect(screen.getByText('Categories 1–7 of 15')).toBeTruthy();
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('defaults to proportional aggregation and retains the smallest-slice option', () => {
    const {container} = render(<PieDonutPagingPrototype />);
    fireEvent.click(
      within(screen.getByRole('radiogroup', {name: 'Chart'})).getByRole('radio', {
        name: 'Pie',
      }),
    );
    const ordinary = container.querySelector('[data-segment-id="residential"]')!;
    const aggregate = container.querySelector('[data-segment-id="aggregate"]')!;
    const proportionalAngle = Number(aggregate.getAttribute('data-angle-size'));
    const proportionalLabelRadius = Number(
      container.querySelector('[data-aggregate-label="count"]')?.getAttribute('data-label-radius'),
    );

    expect(
      screen.getByRole('button', {name: 'Proportional aggregate'}).getAttribute('aria-pressed'),
    ).toBe('true');
    fireEvent.click(screen.getByRole('button', {name: 'Proportional aggregate'}));
    const smallestAggregate = container.querySelector('[data-segment-id="aggregate"]')!;
    expect(Number(smallestAggregate.getAttribute('data-angle-size'))).toBeLessThan(
      Number(ordinary.getAttribute('data-angle-size')),
    );
    expect(Number(smallestAggregate.getAttribute('data-angle-size'))).toBeLessThan(
      proportionalAngle,
    );
    expect(
      Number(
        container
          .querySelector('[data-aggregate-label="count"]')
          ?.getAttribute('data-label-radius'),
      ),
    ).toBeGreaterThan(proportionalLabelRadius);
  });

  it('compares six, eight, and ten ranked categories per page', () => {
    const {container} = render(<PieDonutPagingPrototype />);
    const pageSize = screen.getByRole('radiogroup', {name: 'Ranked categories per page'});

    expect(container.querySelector('[data-aggregate-label="count"]')?.textContent).toBe('+8');
    fireEvent.click(within(pageSize).getByRole('radio', {name: '6'}));
    expect(container.querySelectorAll('[data-wcl-radial-slice]')).toHaveLength(6);
    expect(container.querySelector('[data-aggregate-label="count"]')?.textContent).toBe('+10');
    fireEvent.click(within(pageSize).getByRole('radio', {name: '8'}));
    expect(container.querySelectorAll('[data-wcl-radial-slice]')).toHaveLength(8);
    expect(container.querySelector('[data-aggregate-label="count"]')?.textContent).toBe('+8');
    fireEvent.click(container.querySelector('[data-segment-id="aggregate"] path')!);
    expect(screen.getByText('Categories 8–15 of 15')).toBeTruthy();
    expect(container.querySelector('[data-segment-id="aggregate"]')).toBeNull();

    fireEvent.click(within(pageSize).getByRole('radio', {name: '10'}));
    expect(container.querySelectorAll('[data-wcl-radial-slice]')).toHaveLength(10);
    expect(container.querySelector('[data-aggregate-label="count"]')?.textContent).toBe('+6');
  });

  it('keeps the donut center readable and defaults to ScrollRegion legend overflow', () => {
    const {container} = render(<PieDonutPagingPrototype />);

    expect(container.querySelector<SVGTextElement>('[data-donut-total]')?.style.fontSize).toBe(
      '26px',
    );
    expect(container.querySelector<SVGTextElement>('[data-donut-unit]')?.style.fontSize).toBe(
      '13px',
    );
    const legend = screen.getByRole('list', {name: 'Visible categories'});
    expect(legend.hasAttribute('data-scroll-region-style')).toBe(true);

    fireEvent.click(screen.getByRole('button', {name: 'ScrollRegion scrollbar'}));
    expect(legend.hasAttribute('data-scroll-region-style')).toBe(false);
    fireEvent.click(screen.getByRole('button', {name: 'ScrollRegion scrollbar'}));
    expect(container.querySelector('[data-wcl-scroll-region]')).toBeNull();
    fireEvent.pointerEnter(legend);
    expect(legend.hasAttribute('data-scrollbar-active')).toBe(true);
  });

  it('uses existing legend emphasis with radial popout and no legend tooltip', () => {
    const {container} = render(<PieDonutPagingPrototype />);
    const residential = screen.getByRole('button', {name: 'Residential 43 MWh'});
    const foodProcessing = screen.getByRole('button', {name: 'Food processing 31 MWh'});
    const residentialSlice = container.querySelector<SVGGElement>(
      '[data-segment-id="residential"]',
    )!;

    fireEvent.mouseEnter(residential);
    expect(residentialSlice.hasAttribute('data-emphasized')).toBe(true);
    expect(residentialSlice.style.transform).not.toBe('translate(0px, 0px)');
    expect(screen.queryByRole('tooltip')).toBeNull();
    fireEvent.mouseLeave(residential);
    expect(residentialSlice.hasAttribute('data-emphasized')).toBe(false);

    fireEvent.click(residential);
    fireEvent.mouseLeave(residential);
    expect(residential.getAttribute('aria-pressed')).toBe('true');
    expect(residentialSlice.hasAttribute('data-emphasized')).toBe(true);
    expect(screen.queryByRole('tooltip')).toBeNull();

    fireEvent.click(foodProcessing);
    expect(residential.getAttribute('aria-pressed')).toBe('false');
    expect(foodProcessing.getAttribute('aria-pressed')).toBe('true');
    expect(
      container
        .querySelector('[data-segment-id="food-processing"]')
        ?.hasAttribute('data-emphasized'),
    ).toBe(true);

    fireEvent.keyDown(foodProcessing, {key: 'Escape'});
    expect(foodProcessing.getAttribute('aria-pressed')).toBe('false');
    expect(container.querySelector('[data-wcl-radial-segment][data-emphasized]')).toBeNull();
  });

  it('retains keyboard reading, shape, appearance, width, and the complete table', () => {
    const {container} = render(<PieDonutPagingPrototype />);
    const reader = screen.getByRole('group', {name: 'Community energy use'});

    fireEvent.focus(reader);
    expect(within(screen.getByRole('tooltip')).getByText('Residential')).toBeTruthy();
    fireEvent.keyDown(reader, {key: 'End'});
    expect(within(screen.getByRole('tooltip')).getByText('More categories')).toBeTruthy();
    fireEvent.keyDown(reader, {key: 'Enter'});
    expect(screen.getByText('Categories 8–15 of 15')).toBeTruthy();
    expect(within(screen.getByRole('tooltip')).getByText('Hospitality')).toBeTruthy();

    const chartKind = screen.getByRole('radiogroup', {name: 'Chart'});
    fireEvent.click(within(chartKind).getByRole('radio', {name: 'Pie'}));
    expect(container.querySelector('.donut-total')).toBeNull();

    const appearance = screen.getByRole('radiogroup', {name: 'Appearance'});
    fireEvent.click(within(appearance).getByRole('radio', {name: 'Dark'}));
    expect(
      container.querySelector('[data-wcl-provider]')?.getAttribute('data-wcl-appearance'),
    ).toBe('dark');

    fireEvent.change(screen.getByRole('slider', {name: 'Available width'}), {
      target: {value: '320'},
    });
    expect(container.querySelector<HTMLElement>('.chart-register')?.style.inlineSize).toBe('320px');
    fireEvent.change(screen.getByRole('slider', {name: 'Available height'}), {
      target: {value: '300'},
    });
    expect(container.querySelector<HTMLElement>('.chart-register')?.style.blockSize).toBe('300px');
    expect(
      within(screen.getByRole('table', {name: 'Community annual energy use'})).getAllByRole('row'),
    ).toHaveLength(17);
  });

  it('keeps the production pointer-following tooltip placement', () => {
    const {container} = render(<PieDonutPagingPrototype />);
    const slice = container.querySelector('[data-segment-id="residential"] path')!;

    fireEvent.pointerMove(slice, {clientX: 220, clientY: 180, pointerType: 'mouse'});
    const tooltip = screen.getByRole('tooltip');
    expect(
      container.querySelector('[data-segment-id="residential"]')?.hasAttribute('data-emphasized'),
    ).toBe(true);
    expect(within(tooltip).getByText('Share of total')).toBeTruthy();
    expect(within(tooltip).getByText('Share on this page')).toBeTruthy();
    expect(tooltip.style.getPropertyValue('--wcl-chart-tooltip-left')).toBe('232px');
    expect(tooltip.style.getPropertyValue('--wcl-chart-tooltip-y')).toBe('180px');
    expect(tooltip.closest('[data-wcl-chart-tooltip-layer]')).toBeTruthy();

    fireEvent.pointerMove(slice, {clientX: 480, clientY: 260, pointerType: 'mouse'});
    expect(tooltip.style.getPropertyValue('--wcl-chart-tooltip-left')).toBe('492px');
    expect(tooltip.style.getPropertyValue('--wcl-chart-tooltip-y')).toBe('260px');

    fireEvent.pointerMove(slice, {clientX: 980, clientY: 260, pointerType: 'mouse'});
    expect(tooltip.getAttribute('data-horizontal-placement')).toBe('end');
    expect(tooltip.style.getPropertyValue('--wcl-chart-tooltip-left')).toBe('664px');

    fireEvent.pointerLeave(container.querySelector('[data-wcl-chart-svg]')!);
    expect(screen.queryByRole('tooltip')).toBeNull();

    const aggregate = container.querySelector('[data-segment-id="aggregate"] path')!;
    fireEvent.pointerMove(aggregate, {clientX: 220, clientY: 180, pointerType: 'mouse'});
    expect(within(screen.getByRole('tooltip')).queryByText('Opens')).toBeNull();
    expect(within(screen.getByRole('tooltip')).queryByText('Slice size')).toBeNull();
    fireEvent.click(aggregate);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});
