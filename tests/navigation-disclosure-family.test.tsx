import {cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {type ReactNode} from 'react';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {
  Accordion,
  AppearanceProvider,
  Breadcrumbs,
  Disclosure,
  Pagination,
  CollapsibleNavigationPane,
  Tabs,
} from '../src/index.js';

if (globalThis.CSS === undefined) {
  Object.defineProperty(globalThis, 'CSS', {
    configurable: true,
    value: {escape: (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, '\\$&')},
  });
}

afterEach(cleanup);

function NavigationFixture({children}: {readonly children: ReactNode}) {
  return (
    <AppearanceProvider accent="#2878ff" appearance="dark">
      {children}
    </AppearanceProvider>
  );
}

describe('navigation and disclosure family', () => {
  it('keeps tab selection, activation, and panel relationships library-owned', () => {
    const onSelectionChange = vi.fn();
    render(
      <NavigationFixture>
        <Tabs
          activationMode="manual"
          ariaLabel="Run details"
          defaultSelectedId="summary"
          items={[
            {id: 'summary', label: 'Summary', panel: <p>Run summary</p>},
            {id: 'inputs', label: 'Inputs', panel: <p>Run inputs</p>},
            {id: 'history', isDisabled: true, label: 'History', panel: <p>Run history</p>},
          ]}
          onSelectionChange={onSelectionChange}
        />
      </NavigationFixture>,
    );

    const tablist = screen.getByRole('tablist', {name: 'Run details'});
    const summary = within(tablist).getByRole('tab', {name: 'Summary'});
    const inputs = within(tablist).getByRole('tab', {name: 'Inputs'});
    const history = within(tablist).getByRole('tab', {name: 'History'});

    expect(summary.getAttribute('aria-selected')).toBe('true');
    expect(history.getAttribute('aria-disabled')).toBe('true');
    expect(screen.getByRole('tabpanel').textContent).toContain('Run summary');

    summary.focus();
    fireEvent.keyDown(summary, {key: 'ArrowRight'});
    expect(document.activeElement).toBe(inputs);
    expect(inputs.getAttribute('aria-selected')).toBe('false');
    fireEvent.keyDown(inputs, {key: 'Enter'});

    expect(inputs.getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tabpanel').textContent).toContain('Run inputs');
    expect(onSelectionChange).toHaveBeenLastCalledWith('inputs');
    expect(within(tablist).queryByRole('link')).toBeNull();
  });

  it('keeps every breadcrumb reachable when the middle of a long path is collapsed', () => {
    render(
      <NavigationFixture>
        <Breadcrumbs
          ariaLabel="Run location"
          items={[
            {href: '/workspaces', id: 'workspaces', label: 'Workspaces'},
            {href: '/workspaces/solver', id: 'solver', label: 'Solver'},
            {href: '/workspaces/solver/runs', id: 'runs', label: 'Runs'},
            {href: '/workspaces/solver/runs/284', id: 'run', label: 'RUN 0284'},
          ]}
          maxVisible={3}
        />
      </NavigationFixture>,
    );

    const navigation = screen.getByRole('navigation', {name: 'Run location'});
    expect(within(navigation).getAllByRole('listitem')).toHaveLength(3);
    expect(within(navigation).getByRole('link', {name: 'Workspaces'})).toBeTruthy();
    expect(within(navigation).getByText('RUN 0284').getAttribute('aria-current')).toBe('page');
    expect(within(navigation).queryByRole('link', {name: 'Solver'})).toBeNull();

    const overflowTrigger = within(navigation).getByRole('button', {name: 'More locations'});
    expect(overflowTrigger.textContent).toBe('…');

    fireEvent.click(overflowTrigger);
    const overflow = screen.getByRole('dialog', {name: 'More locations'});
    expect(navigation.contains(overflow)).toBe(false);
    expect(within(overflow).getByRole('link', {name: 'Solver'})).toBeTruthy();
    expect(within(overflow).getByRole('link', {name: 'Runs'})).toBeTruthy();
  });

  it('keeps breadcrumb overflow direction synchronized with its inherited direction', async () => {
    const breadcrumbs = () => (
      <Breadcrumbs
        ariaLabel="Run location"
        items={[
          {href: '/workspaces', id: 'workspaces', label: 'Workspaces'},
          {href: '/workspaces/solver', id: 'solver', label: 'Solver'},
          {href: '/workspaces/solver/runs', id: 'runs', label: 'Runs'},
          {href: '/workspaces/solver/runs/284', id: 'run', label: 'RUN 0284'},
        ]}
        maxVisible={3}
      />
    );
    const {rerender} = render(<div dir="ltr">{breadcrumbs()}</div>);

    fireEvent.click(screen.getByRole('button', {name: 'More locations'}));
    const popover = screen
      .getByRole('dialog', {name: 'More locations'})
      .closest('[data-wcl-breadcrumb-popover]');
    await waitFor(() => expect(popover?.getAttribute('dir')).toBe('ltr'));

    rerender(<div dir="rtl">{breadcrumbs()}</div>);
    await waitFor(() => expect(popover?.getAttribute('dir')).toBe('rtl'));
  });

  it('reports page navigation and exposes an href seam without dropping distant pages', () => {
    const onPageChange = vi.fn();
    render(
      <NavigationFixture>
        <Pagination
          ariaLabel="Run pages"
          currentPage={8}
          getPageHref={(page) => `/runs?page=${page}`}
          getPageLabel={(_page, formattedPage) => `Page ${formattedPage}`}
          locale="en-US"
          nextLabel="Next page"
          onPageChange={onPageChange}
          pageCount={20}
          previousLabel="Previous page"
        />
      </NavigationFixture>,
    );

    const navigation = screen.getByRole('navigation', {name: 'Run pages'});
    navigation.addEventListener('click', (event) => event.preventDefault());
    expect(
      within(navigation).getByRole('link', {name: 'Page 8'}).getAttribute('aria-current'),
    ).toBe('page');
    expect(within(navigation).getByRole('link', {name: 'Page 1'})).toBeTruthy();
    expect(within(navigation).getByRole('link', {name: 'Page 20'})).toBeTruthy();
    fireEvent.click(within(navigation).getByRole('link', {name: 'Next page'}));
    expect(onPageChange).toHaveBeenCalledWith(9);
  });

  it('localizes pagination digits and accessible page labels', () => {
    render(
      <NavigationFixture>
        <Pagination
          ariaLabel="صفحات النتائج"
          currentPage={8}
          getPageLabel={(_page, formattedPage) => `الصفحة ${formattedPage}`}
          locale="ar-EG"
          nextLabel="الصفحة التالية"
          pageCount={20}
          previousLabel="الصفحة السابقة"
        />
      </NavigationFixture>,
    );

    const navigation = screen.getByRole('navigation', {name: 'صفحات النتائج'});
    expect(within(navigation).getByRole('button', {name: 'الصفحة ٨'}).textContent).toBe('٨');
  });

  it('supports controlled disclosure state with a real heading and named panel', () => {
    const onExpandedChange = vi.fn();
    const {rerender} = render(
      <NavigationFixture>
        <Disclosure
          headingLevel={3}
          isExpanded={false}
          onExpandedChange={onExpandedChange}
          title="Advanced solver settings"
        >
          <p>Iteration and tolerance controls</p>
        </Disclosure>
      </NavigationFixture>,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Advanced solver settings'}));
    expect(onExpandedChange).toHaveBeenCalledWith(true);

    rerender(
      <NavigationFixture>
        <Disclosure
          headingLevel={3}
          isExpanded
          onExpandedChange={onExpandedChange}
          title="Advanced solver settings"
        >
          <p>Iteration and tolerance controls</p>
        </Disclosure>
      </NavigationFixture>,
    );
    expect(screen.getByRole('heading', {level: 3, name: 'Advanced solver settings'})).toBeTruthy();
    expect(screen.getByRole('region', {name: 'Advanced solver settings'})).toBeTruthy();
  });

  it('enforces single accordion expansion while preserving disabled sections', () => {
    render(
      <NavigationFixture>
        <Accordion
          ariaLabel="Run configuration"
          defaultExpandedIds={['geometry']}
          expansionMode="single"
          items={[
            {content: <p>Mesh and boundary settings</p>, id: 'geometry', title: 'Geometry'},
            {content: <p>Precision and speed settings</p>, id: 'solver', title: 'Solver'},
            {
              content: <p>Unavailable output settings</p>,
              id: 'output',
              isDisabled: true,
              title: 'Output',
            },
          ]}
        />
      </NavigationFixture>,
    );

    expect(screen.getByRole('region', {name: 'Geometry'})).toBeTruthy();
    fireEvent.click(screen.getByRole('button', {name: 'Solver'}));
    expect(screen.queryByRole('region', {name: 'Geometry'})).toBeNull();
    expect(screen.getByRole('region', {name: 'Solver'})).toBeTruthy();
    expect(screen.getByRole('button', {name: 'Output'}).hasAttribute('disabled')).toBe(true);
  });

  it('rejects contradictory single-expansion accordion state', () => {
    expect(() =>
      render(
        <NavigationFixture>
          <Accordion
            ariaLabel="Run configuration"
            defaultExpandedIds={['geometry', 'solver']}
            expansionMode="single"
            items={[
              {content: 'Geometry', id: 'geometry', title: 'Geometry'},
              {content: 'Solver', id: 'solver', title: 'Solver'},
            ]}
          />
        </NavigationFixture>,
      ),
    ).toThrow(/single expansion.*at most one/i);
  });

  it('keeps hierarchical navigation-pane links reachable through compact collapse', () => {
    const onNavigate = vi.fn();
    render(
      <NavigationFixture>
        <CollapsibleNavigationPane
          ariaLabel="Workspace"
          collapseLabel="Collapse workspace navigation"
          defaultCollapsed
          expandLabel="Expand workspace navigation"
          groups={[
            {
              id: 'workspace',
              items: [
                {href: '/overview', id: 'overview', label: 'Overview'},
                {
                  children: [
                    {href: '/runs/active', id: 'active-runs', label: 'Active runs'},
                    {href: '/runs/history', id: 'run-history', label: 'Run history'},
                  ],
                  href: '/runs',
                  id: 'runs',
                  label: 'Runs',
                },
              ],
              label: 'Workspace',
            },
          ]}
          currentId="active-runs"
          onNavigate={onNavigate}
        />
      </NavigationFixture>,
    );

    expect(screen.queryByRole('link', {name: 'Active runs'})).toBeNull();
    fireEvent.click(screen.getByRole('button', {name: 'Expand workspace navigation'}));
    const current = screen.getByRole('link', {name: 'Active runs'});
    current.closest('nav')?.addEventListener('click', (event) => event.preventDefault());
    expect(current.getAttribute('aria-current')).toBe('page');
    fireEvent.click(screen.getByRole('link', {name: 'Run history'}));
    expect(onNavigate).toHaveBeenCalledWith('run-history');
  });

  it('renders deterministic server output and hydrates the family without warnings', async () => {
    const tree = (
      <NavigationFixture>
        <Tabs
          ariaLabel="Run details"
          defaultSelectedId="summary"
          items={[{id: 'summary', label: 'Summary', panel: <p>Run summary</p>}]}
        />
        <Disclosure defaultExpanded headingLevel={2} title="Details">
          Run details
        </Disclosure>
        <Breadcrumbs
          ariaLabel="Run location"
          items={[
            {href: '/runs', id: 'runs', label: 'Runs'},
            {href: '/runs/284', id: 'run', label: 'RUN 0284'},
          ]}
        />
        <Pagination
          ariaLabel="Run pages"
          currentPage={2}
          getPageLabel={(_page, formattedPage) => `Page ${formattedPage}`}
          locale="en-US"
          nextLabel="Next page"
          pageCount={4}
          previousLabel="Previous page"
        />
        <Accordion
          ariaLabel="Run configuration"
          items={[{content: 'Geometry settings', id: 'geometry', title: 'Geometry'}]}
        />
        <CollapsibleNavigationPane
          ariaLabel="Workspace"
          collapseLabel="Collapse workspace navigation"
          currentId="runs"
          expandLabel="Expand workspace navigation"
          groups={[
            {
              id: 'workspace',
              items: [{href: '/runs', id: 'runs', label: 'Runs'}],
            },
          ]}
        />
      </NavigationFixture>
    );
    const html = renderToString(tree);
    const container = document.createElement('div');
    container.innerHTML = html;
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    hydrateRoot(container, tree);
    await Promise.resolve();

    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
