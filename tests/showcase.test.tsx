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
    const {container} = render(<Showcase />);
    const controls = container.querySelector('aside');
    if (!(controls instanceof HTMLElement)) throw new Error('Showcase controls are missing.');
    const accentInput = within(controls).getByLabelText('Accent');

    fireEvent.change(accentInput, {target: {value: '#ff0000'}});

    const provider = container.querySelector('[data-wcl-provider]');
    expect(provider?.getAttribute('style')).toContain('--wcl-accent: #ff0000');
    expect(provider?.getAttribute('style')).toContain('--wcl-accent-fill: #ff0000');
    expect(within(controls).getByText('#ff0000')).toBeTruthy();
  });

  it('reveals each pane scrollbar while the reader scrolls', () => {
    const {container} = render(<Showcase />);
    const main = container.querySelector('.showcase-main-pane');
    const index = container.querySelector('aside');

    fireEvent.scroll(main as HTMLElement);
    fireEvent.scroll(index as HTMLElement);

    expect(main?.getAttribute('data-scrollbar-active')).toBe('true');
    expect(index?.getAttribute('data-scrollbar-active')).toBe('true');
  });

  it('scrolls the masthead with the main pane while the sidebar starts at the top', () => {
    const {container} = render(<Showcase />);
    const frame = container.querySelector('.showcase-frame');
    const index = container.querySelector('.showcase-index');
    const mainPane = container.querySelector('.showcase-main-pane');

    expect(frame?.firstElementChild).toBe(index);
    expect(mainPane?.querySelector(':scope > .showcase-masthead')).toBeTruthy();
    expect(mainPane?.querySelector(':scope > .showcase-content')).toBeTruthy();
  });

  it('makes both desktop scroll panes keyboard reachable', () => {
    const {container} = render(<Showcase />);
    const index = container.querySelector('.showcase-index');
    const mainPane = container.querySelector('.showcase-main-pane');

    expect(index?.getAttribute('aria-label')).toBe('Showcase controls and component index');
    expect(index?.getAttribute('tabindex')).toBe('0');
    expect(mainPane?.getAttribute('aria-label')).toBe('Component examples');
    expect(mainPane?.getAttribute('role')).toBe('region');
    expect(mainPane?.getAttribute('tabindex')).toBe('0');
  });

  it('shows distinct automatic colors for the mixed Cartesian bars and line', () => {
    const {container} = render(<Showcase />);
    const specimen = container.querySelector('[data-showcase-component="CartesianChart"]');
    const colors = [...(specimen?.querySelectorAll('[data-wcl-chart-legend] > li') ?? [])].map(
      (item) => item.getAttribute('data-color'),
    );

    expect(colors).toEqual(['accent', 'series-2']);
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

  it('demonstrates selection, overflow, expansion, and collapse in the navigation family', () => {
    const {container} = render(<Showcase />);

    const tabs = container.querySelector('[data-showcase-component="Tabs"]');
    const inputsTab = within(tabs as HTMLElement).getByRole('tab', {name: 'Inputs'});
    fireEvent.click(inputsTab);
    expect(within(tabs as HTMLElement).getByRole('tabpanel').textContent).toMatch(
      /balanced profile/i,
    );

    const breadcrumbs = container.querySelector('[data-showcase-component="Breadcrumbs"]');
    fireEvent.click(
      within(breadcrumbs as HTMLElement).getByRole('button', {name: 'More locations'}),
    );
    const overflow = screen.getByRole('dialog', {name: 'More locations'});
    fireEvent.click(within(overflow).getByRole('link', {name: 'Thermal studies'}));
    expect(breadcrumbs?.querySelector('[aria-current="page"]')?.textContent).toBe(
      'Thermal studies',
    );
    const breadcrumbNavigation = within(breadcrumbs as HTMLElement).getByRole('navigation', {
      name: 'Run location',
    });
    expect(within(breadcrumbNavigation).queryByText('Run history')).toBeNull();
    expect(within(breadcrumbNavigation).queryByText('RUN 0284')).toBeNull();
    fireEvent.click(within(breadcrumbs as HTMLElement).getByRole('link', {name: 'Run history'}));
    expect(breadcrumbs?.querySelector('[aria-current="page"]')?.textContent).toBe('Run history');
    fireEvent.click(within(breadcrumbs as HTMLElement).getByRole('link', {name: 'Workspace'}));
    expect(breadcrumbs?.querySelector('[aria-current="page"]')?.textContent).toBe('Workspace');
    expect(
      within(breadcrumbs as HTMLElement).getByRole('link', {name: 'Thermal studies'}),
    ).toBeTruthy();

    const accordion = container.querySelector('[data-showcase-component="Accordion"]');
    fireEvent.click(within(accordion as HTMLElement).getByRole('button', {name: 'Solver'}));
    expect(within(accordion as HTMLElement).getByRole('region', {name: 'Solver'})).toBeTruthy();

    const collapsibleNavigationPane = container.querySelector(
      '[data-showcase-component="CollapsibleNavigationPane"]',
    );
    fireEvent.click(
      within(collapsibleNavigationPane as HTMLElement).getByRole('button', {
        name: 'Collapse workspace navigation',
      }),
    );
    expect(within(collapsibleNavigationPane as HTMLElement).queryByRole('link')).toBeNull();
    expect(
      within(collapsibleNavigationPane as HTMLElement).getByRole('button', {
        name: 'Expand workspace navigation',
      }),
    ).toBeTruthy();
  });

  it('demonstrates every notification variant with separate controls without moving focus', () => {
    const {getByRole, getByText} = render(<Showcase />);
    const generalTrigger = getByRole('button', {name: 'Show general notification'});
    const successTrigger = getByRole('button', {name: 'Show success notification'});
    const warningTrigger = getByRole('button', {name: 'Show warning notification'});
    const errorTrigger = getByRole('button', {name: 'Show error notification'});
    errorTrigger.focus();

    fireEvent.click(generalTrigger);
    fireEvent.click(successTrigger);
    fireEvent.click(warningTrigger);
    fireEvent.click(errorTrigger);

    expect(getByText('Draft saved')).toBeTruthy();
    expect(getByText('Export ready')).toBeTruthy();
    expect(getByText('Storage nearly full')).toBeTruthy();
    expect(getByText('Export failed')).toBeTruthy();
    expect(getByRole('button', {name: 'Retry export'})).toBeTruthy();
    expect(document.activeElement).toBe(errorTrigger);
    expect(getByRole('region', {name: 'Showcase notifications'})).toBeTruthy();
  });

  it('sorts the table showcase by each semantic data column', () => {
    const {container} = render(<Showcase />);
    const filters = container.querySelector('[data-showcase-component="CollectionFilterBar"]');
    const specimen = container.querySelector('[data-showcase-component="Table"]');
    if (!(filters instanceof HTMLElement) || !(specimen instanceof HTMLElement)) {
      throw new Error('The collection showcase is incomplete.');
    }

    fireEvent.click(within(filters).getByRole('button', {name: 'Clear query'}));

    const table = within(specimen).getByRole('grid', {name: 'Filtered run results'});
    const status = within(table).getByRole('columnheader', {name: /Status/});
    const profile = within(table).getByRole('columnheader', {name: /Profile/});
    fireEvent.click(status);
    expect(status.getAttribute('aria-sort')).toBe('ascending');
    expect(
      within(within(table).getAllByRole('row')[1] as HTMLElement).getAllByRole('gridcell')[0]
        ?.textContent,
    ).toBe('Converged');

    fireEvent.click(profile);
    expect(profile.getAttribute('aria-sort')).toBe('ascending');
    expect(
      within(within(table).getAllByRole('row')[1] as HTMLElement).getAllByRole('gridcell')[1]
        ?.textContent,
    ).toBe('Balanced');
  });

  it('toggles a three-card scroll viewport for the same notification controls', () => {
    const {getByRole} = render(<Showcase />);
    const capToggle = getByRole('button', {name: 'Cap stack at three'});

    fireEvent.click(capToggle);
    const selectedCapToggle = getByRole('button', {name: 'Cap stack at three'});
    const generalTrigger = getByRole('button', {name: 'Show general notification'});
    for (let message = 0; message < 5; message += 1) {
      fireEvent.click(generalTrigger);
    }

    expect(selectedCapToggle.getAttribute('aria-pressed')).toBe('true');
    const region = getByRole('region', {name: 'Showcase notifications'});
    expect(region.getAttribute('data-count')).toBe('5');
    expect(within(region).getAllByRole('alertdialog')).toHaveLength(5);
    expect(within(region).getAllByText('Draft saved')).toHaveLength(5);
    expect(
      region.querySelector('[data-wcl-notification-list]')?.getAttribute('data-max-visible'),
    ).toBe('3');
  });

  it('demonstrates all Drawer placements with no dock, grip, and preview modes', async () => {
    const {container} = render(<Showcase />);
    const specimen = container.querySelector('[data-showcase-component="Drawer"]');
    if (!(specimen instanceof HTMLElement)) throw new Error('The Drawer specimen is missing.');

    const placementControl = within(specimen).getByRole('radiogroup', {
      name: 'Drawer placement',
    });
    const trigger = within(specimen).getByRole('button', {name: 'Inspect active run'});

    for (const placement of ['start', 'end', 'top', 'bottom'] as const) {
      fireEvent.click(
        within(placementControl).getByRole('radio', {
          name: placement[0]!.toUpperCase() + placement.slice(1),
        }),
      );
      fireEvent.click(trigger);
      const drawer = await screen.findByRole('dialog');
      expect(drawer.closest('[data-wcl-overlay]')?.getAttribute('data-placement')).toBe(placement);

      const close = drawer.querySelector('[data-wcl-overlay-close]');
      if (!(close instanceof HTMLElement)) throw new Error('The Drawer close action is missing.');
      fireEvent.click(close);
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    }

    const dockControl = within(specimen).getByRole('radiogroup', {name: 'Dock behavior'});
    const noDock = within(dockControl).getByRole('radio', {name: 'None'});
    expect((noDock as HTMLInputElement).checked).toBe(true);
    expect(document.querySelector('[data-wcl-drawer-dock]')).toBeNull();
    fireEvent.click(within(dockControl).getByRole('radio', {name: 'Grip only'}));
    expect(document.querySelector('[data-wcl-drawer-preview]')).toBeNull();
    expect(screen.getByRole('button', {name: 'Move result inspector'})).toBeTruthy();
    fireEvent.click(within(dockControl).getByRole('radio', {name: 'Preview strip'}));
    expect(document.querySelector('[data-wcl-drawer-preview]')).toBeTruthy();
    const handleSwitch = within(specimen).getByRole('switch', {name: 'Show drag handle'});
    for (const placement of ['start', 'end', 'top', 'bottom'] as const) {
      fireEvent.click(
        within(placementControl).getByRole('radio', {
          name: placement[0]!.toUpperCase() + placement.slice(1),
        }),
      );
      expect(document.querySelector('[data-wcl-drawer-dock]')?.getAttribute('data-placement')).toBe(
        placement,
      );
      expect(document.querySelector('[data-wcl-drawer-preview]')).toBeTruthy();
    }
    fireEvent.click(handleSwitch);
    expect(screen.queryByRole('button', {name: 'Move result inspector'})).toBeNull();
    expect(document.querySelector('[data-wcl-drawer-preview]')).toBeTruthy();
  });
});
