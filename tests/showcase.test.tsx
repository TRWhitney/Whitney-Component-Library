import {cleanup, render} from '@testing-library/react';
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
});
