import {cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import {afterEach, describe, expect, it} from 'vitest';

import {componentContracts} from '../src/contracts/index.js';
import {showcasedComponentNames} from '../showcase/catalog.js';
import {Showcase} from '../showcase/showcase.js';

afterEach(cleanup);

describe('component showcase', () => {
  it('renders exactly one documented specimen for every contracted public component', () => {
    const {container} = render(<Showcase />);
    const specimenNames = [...container.querySelectorAll('[data-showcase-component]')].map(
      (specimen) => {
        const name = specimen.getAttribute('data-showcase-component');
        if (!name) throw new Error('A showcase specimen is missing its component name.');
        return name;
      },
    );
    const contractNames = componentContracts.map((contract) => contract.exportName);

    expect(specimenNames.sort()).toEqual(contractNames.sort());
  });

  it('indexes every contracted public component for browsing', () => {
    const contractNames = componentContracts.map((contract) => contract.exportName);

    expect([...showcasedComponentNames].sort()).toEqual(contractNames.sort());
  });

  it('uses Field for a control without a specialized library component', () => {
    const {container} = render(<Showcase />);
    const specimen = container.querySelector('[data-showcase-component="Field"]');

    const dial = specimen?.querySelector('[data-showcase-phase-dial][role="slider"]');

    expect(dial?.getAttribute('aria-valuenow')).toBe('135');
    fireEvent.keyDown(dial as Element, {key: 'ArrowRight'});
    expect(dial?.getAttribute('aria-valuenow')).toBe('140');
    expect(specimen?.querySelector('select')).toBeNull();
    expect(specimen?.querySelector('[data-wcl-slider]')).toBeNull();
  });

  it('lets a reader change the propagated accent and see its exact value', () => {
    const {container, getByLabelText, getByText} = render(<Showcase />);
    const accentInput = getByLabelText('Accent');

    fireEvent.change(accentInput, {target: {value: '#ff0000'}});

    const provider = container.querySelector('[data-wcl-provider]');
    expect(provider?.getAttribute('style')).toContain('--wcl-accent: #ff0000');
    expect(provider?.getAttribute('style')).toContain('--wcl-accent-fill: #ff0000');
    expect(getByText('#ff0000')).toBeTruthy();
  });

  it('labels every action example by variant or composition', () => {
    const {container} = render(<Showcase />);
    const expectedLabels = {
      Button: [
        'Primary Button',
        'Secondary Button',
        'Quiet Button',
        'Danger Button',
        'Pending Button',
        'Disabled Button',
      ],
      IconButton: ['Secondary IconButton', 'Quiet IconButton', 'Disabled IconButton'],
      Link: ['Current-page Link', 'Destination Link', 'Disabled Link'],
      ToggleButton: ['Selected ToggleButton', 'Quiet ToggleButton', 'Disabled ToggleButton'],
      ButtonGroup: ['2 secondary Buttons + IconButton'],
      Toolbar: ['2 quiet Buttons + ToggleButton + IconButton'],
    } as const;

    for (const [component, labels] of Object.entries(expectedLabels)) {
      const specimen = container.querySelector(`[data-showcase-component="${component}"]`);
      const renderedLabels = [
        ...(specimen?.querySelectorAll('[data-showcase-example-label]') ?? []),
      ]
        .map((label) => label.textContent?.trim())
        .filter(Boolean);

      expect(renderedLabels).toEqual(labels);
    }
  });

  it('keeps the controlled ToggleButton caption aligned with its live state', () => {
    const {getByRole, getByText} = render(<Showcase />);

    fireEvent.click(getByRole('button', {name: 'Pin result'}));

    expect(getByText('Unselected ToggleButton')).toBeTruthy();
  });

  it('demonstrates a working notification without moving focus', () => {
    const {getByRole, getByText} = render(<Showcase />);
    const trigger = getByRole('button', {name: 'Show export notification'});
    trigger.focus();

    fireEvent.click(trigger);

    expect(getByText('Export ready')).toBeTruthy();
    expect(document.activeElement).toBe(trigger);
    expect(getByRole('region', {name: 'Showcase notifications'})).toBeTruthy();
  });

  it('demonstrates drawers from both logical viewport edges', async () => {
    const {container} = render(<Showcase />);
    const specimen = container.querySelector('[data-showcase-component="Drawer"]');
    if (!(specimen instanceof HTMLElement)) throw new Error('The Drawer specimen is missing.');

    const examples = specimen.querySelectorAll('[data-showcase-example-label]');
    const triggers = within(specimen).getAllByRole('button');
    expect(examples).toHaveLength(2);
    expect(triggers).toHaveLength(2);

    for (const [index, placement] of ['start', 'end'].entries()) {
      fireEvent.click(triggers[index]!);
      const drawer = await screen.findByRole('dialog');
      expect(drawer.closest('[data-wcl-overlay]')?.getAttribute('data-placement')).toBe(placement);

      const close = drawer.querySelector('[data-wcl-overlay-close]');
      if (!(close instanceof HTMLElement)) throw new Error('The Drawer close action is missing.');
      fireEvent.click(close);
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    }
  });
});
