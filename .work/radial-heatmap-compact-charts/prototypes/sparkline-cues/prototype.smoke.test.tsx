import {cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {afterEach, describe, expect, it} from 'vitest';

import {SparklineCuePrototype} from './main.js';

afterEach(cleanup);

describe('Sparkline cue prototype', () => {
  it('switches only static cues while retaining the accepted caption and production reading', () => {
    const {container} = render(<SparklineCuePrototype />);
    const cueControl = screen.getByRole('radiogroup', {name: 'Static point cues'});

    expect(container.querySelector('[data-cue-mode="current"]')).toBeTruthy();
    expect(container.querySelectorAll('[data-prototype-cue]')).toHaveLength(3);
    expect(container.querySelector('[data-prototype-cue="current"]')).toBeTruthy();
    expect(container.querySelector('[data-prototype-cue="low"]')).toBeTruthy();
    expect(container.querySelector('[data-prototype-cue="high"]')).toBeTruthy();
    expect(container.querySelector('[data-wcl-chart-caption] p')?.textContent).toContain(
      'reached a low of 43 and a high of 78',
    );

    fireEvent.click(within(cueControl).getByRole('radio', {name: 'Line only'}));
    expect(container.querySelector('[data-cue-mode="line"]')).toBeTruthy();
    fireEvent.click(within(cueControl).getByRole('radio', {name: 'Current and observed range'}));
    expect(container.querySelector('[data-cue-mode="range"]')).toBeTruthy();

    const reader = screen.getByRole('group', {name: 'North loop thermal demand'});
    fireEvent.focus(reader);
    expect(within(screen.getByRole('tooltip')).getByText('Sep 2025')).toBeTruthy();
    fireEvent.keyDown(reader, {key: 'End'});
    expect(within(screen.getByRole('tooltip')).getByText('Aug 2026')).toBeTruthy();
    expect(screen.getByRole('table', {name: 'North loop monthly thermal demand'})).toBeTruthy();
  });

  it('exercises width, appearance, and identification controls', () => {
    const {container} = render(<SparklineCuePrototype />);
    fireEvent.change(screen.getByRole('slider', {name: 'Available width'}), {
      target: {value: '220'},
    });
    expect(container.querySelector<HTMLElement>('.sparkline-register')?.style.inlineSize).toBe(
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
