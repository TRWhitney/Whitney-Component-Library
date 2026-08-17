import {cleanup, fireEvent, render} from '@testing-library/react';
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

  it('describes the Field behavior demonstrated by its custom select', () => {
    const {container} = render(<Showcase />);
    const description = container.querySelector(
      '[data-showcase-component="Field"] .showcase-specimen-header p',
    );

    expect(description?.textContent).toMatch(/label.*support.*custom control/i);
    expect(description?.textContent).not.toMatch(/read-only/i);
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
});
