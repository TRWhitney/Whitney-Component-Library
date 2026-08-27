import {cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {afterEach, describe, expect, it} from 'vitest';

import {SparklineCaptionPrototype} from './main.js';

afterEach(cleanup);

describe('Sparkline caption prototype', () => {
  it('switches only the named caption treatment while retaining production chart reading', () => {
    const {container} = render(<SparklineCaptionPrototype />);
    const captionControl = screen.getByRole('radiogroup', {name: 'Caption treatment'});

    expect(container.querySelector('[data-caption-mode="embedded"]')).toBeTruthy();
    expect(container.querySelector('[data-region="consumer-metric-context"]')).toBeTruthy();

    fireEvent.click(within(captionControl).getByRole('radio', {name: 'Compact caption'}));
    expect(container.querySelector('[data-caption-mode="compact"]')).toBeTruthy();
    expect(container.querySelector('[data-region="consumer-metric-context"]')).toBeNull();
    expect(container.querySelector('[data-wcl-chart-caption] strong')?.textContent).toContain(
      '78 kW',
    );

    fireEvent.click(within(captionControl).getByRole('radio', {name: 'Standard caption'}));
    expect(container.querySelector('[data-caption-mode="standard"]')).toBeTruthy();
    expect(container.querySelector('[data-wcl-chart-caption] p')?.textContent).toContain(
      'reached a low of 43 and a high of 78',
    );

    const reader = screen.getByRole('group', {name: 'North loop thermal demand'});
    fireEvent.focus(reader);
    expect(within(screen.getByRole('tooltip')).getByText('Sep 2025')).toBeTruthy();
    fireEvent.keyDown(reader, {key: 'ArrowRight'});
    expect(within(screen.getByRole('tooltip')).getByText('Oct 2025')).toBeTruthy();
    expect(screen.getByRole('table', {name: 'North loop monthly thermal demand'})).toBeTruthy();
  });

  it('exercises width, appearance, and identification controls', () => {
    const {container} = render(<SparklineCaptionPrototype />);
    const width = screen.getByRole('slider', {name: 'Available width'});

    fireEvent.change(width, {target: {value: '220'}});
    expect(container.querySelector<HTMLElement>('.metric-register')?.style.inlineSize).toBe(
      '220px',
    );

    const appearance = screen.getByRole('radiogroup', {name: 'Appearance'});
    fireEvent.click(within(appearance).getByRole('radio', {name: 'Dark'}));
    expect(
      container.querySelector('[data-wcl-provider]')?.getAttribute('data-wcl-appearance'),
    ).toBe('dark');

    fireEvent.click(screen.getByRole('button', {name: 'Identify regions'}));
    expect(container.querySelector('.prototype-page')?.hasAttribute('data-identify')).toBe(true);
  });
});
