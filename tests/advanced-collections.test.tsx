import {cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {
  AppearanceProvider,
  Button,
  CollectionFilterBar,
  Table,
  Tree,
  type CollectionQueryFor,
} from '../src/index.js';

if (globalThis.CSS === undefined) {
  Object.defineProperty(globalThis, 'CSS', {
    configurable: true,
    value: {escape: (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, '\\$&')},
  });
}

afterEach(cleanup);

const emptyState = {
  description: 'Try a broader query.',
  kind: 'no-results' as const,
  title: 'No matching runs',
};

const columns = [
  {allowsSorting: true, id: 'run', isRowHeader: true, label: 'Run'},
  {id: 'status', label: 'Status'},
  {id: 'actions', kind: 'actions' as const, label: 'Actions'},
] as const;

const queryFilters = [
  {
    emptyMessage: 'No statuses',
    id: 'status',
    label: 'Status',
    options: [{label: 'Running', value: 'running'}],
    placeholder: 'Any status',
  },
  {
    emptyMessage: 'No profiles',
    id: 'profile',
    label: 'Profile',
    options: [{label: 'Balanced', value: 'balanced'}],
    placeholder: 'Any profile',
  },
] as const;

function rows(onInspect: () => void) {
  return [
    {
      cells: {
        actions: <Button onPress={onInspect}>Inspect Alpha</Button>,
        run: 'Alpha run',
        status: 'Converged',
      },
      id: 'alpha',
      textValue: 'Alpha run',
    },
    {
      cells: {actions: null, run: 'Beta run', status: 'Solving'},
      id: 'beta',
      textValue: 'Beta run',
    },
  ] as const;
}

describe('table, tree, and filter family', () => {
  it('keeps table sorting, row selection, and embedded actions separate', () => {
    const onInspect = vi.fn();
    const onSelectionChange = vi.fn();
    const onSortChange = vi.fn();
    render(
      <Table
        ariaLabel="Run results"
        columns={columns}
        emptyState={emptyState}
        onSelectionChange={onSelectionChange}
        onSortChange={onSortChange}
        rows={rows(onInspect)}
        selectedIds={['alpha']}
        selectionMode="multiple"
        sortDescriptor={{column: 'run', direction: 'ascending'}}
      />,
    );

    const table = screen.getByRole('grid', {name: 'Run results'});
    const alpha = within(table).getByRole('row', {name: /Alpha run/});
    expect(within(table).getByRole('columnheader', {name: /Run/})).toBeTruthy();
    expect(alpha.getAttribute('aria-selected')).toBe('true');

    fireEvent.click(within(table).getByRole('columnheader', {name: /Run/}));
    expect(onSortChange).toHaveBeenCalledWith({column: 'run', direction: 'descending'});

    fireEvent.click(within(alpha).getByRole('button', {name: 'Inspect Alpha'}));
    expect(onInspect).toHaveBeenCalledOnce();
    expect(onSelectionChange).not.toHaveBeenCalled();

    fireEvent.click(within(table).getByRole('row', {name: /Beta run/}));
    expect(onSelectionChange).toHaveBeenLastCalledWith(['alpha', 'beta']);
  });

  it('preserves focused table rows through insertion and reordering', () => {
    const initialRows = rows(() => undefined);
    const {rerender} = render(
      <Table
        ariaLabel="Run results"
        columns={columns}
        emptyState={emptyState}
        onSortChange={() => undefined}
        rows={initialRows}
        selectionMode="none"
      />,
    );
    const beta = screen.getByRole('row', {name: /Beta run/});
    beta.focus();

    rerender(
      <Table
        ariaLabel="Run results"
        columns={columns}
        emptyState={emptyState}
        onSortChange={() => undefined}
        rows={[
          initialRows[1],
          {
            cells: {actions: null, run: 'Delta run', status: 'Queued'},
            id: 'delta',
            textValue: 'Delta run',
          },
          initialRows[0],
        ]}
        selectionMode="none"
      />,
    );

    expect(document.activeElement).toBe(screen.getByRole('row', {name: /Beta run/}));
  });

  it('moves table focus without selecting and keeps selection-disabled rows inactive', () => {
    const onSelectionChange = vi.fn();
    render(
      <Table
        ariaLabel="Run results"
        columns={columns}
        emptyState={emptyState}
        onSelectionChange={onSelectionChange}
        onSortChange={() => undefined}
        rows={[
          rows(() => undefined)[0],
          {...rows(() => undefined)[1], isSelectionDisabled: true},
          {
            cells: {actions: null, run: 'Gamma run', status: 'Queued'},
            id: 'gamma',
            textValue: 'Gamma run',
          },
        ]}
        selectionMode="multiple"
      />,
    );

    const alpha = screen.getByRole('row', {name: /Alpha run/});
    const beta = screen.getByRole('row', {name: /Beta run/});
    const gamma = screen.getByRole('row', {name: /Gamma run/});
    alpha.focus();
    fireEvent.keyDown(alpha, {key: 'ArrowDown'});
    expect(document.activeElement).toBe(beta);
    expect(onSelectionChange).not.toHaveBeenCalled();

    fireEvent.click(beta);
    expect(onSelectionChange).not.toHaveBeenCalled();
    fireEvent.keyDown(beta, {key: 'g'});
    expect(document.activeElement).toBe(gamma);
  });

  it('expands tree hierarchy while keeping focus, selection, and actions distinct', () => {
    const onInspect = vi.fn();
    const onSelectionChange = vi.fn();
    const onExpandedChange = vi.fn();
    render(
      <Tree
        ariaLabel="Study hierarchy"
        collapseLabel="Collapse"
        defaultExpandedIds={['study']}
        emptyState={emptyState}
        expandLabel="Expand"
        items={[
          {
            children: [
              {
                actions: <Button onPress={onInspect}>Inspect Alpha</Button>,
                id: 'alpha',
                label: 'Alpha run',
              },
            ],
            id: 'study',
            label: 'Thermal study',
          },
        ]}
        onExpandedChange={onExpandedChange}
        onSelectionChange={onSelectionChange}
        selectionMode="single"
      />,
    );

    const tree = screen.getByRole('treegrid', {name: 'Study hierarchy'});
    const study = within(tree).getByRole('row', {name: /Thermal study/});
    const alpha = within(tree).getByRole('row', {name: /Alpha run/});
    expect(study.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(within(alpha).getByRole('button', {name: 'Inspect Alpha'}));
    expect(onInspect).toHaveBeenCalledOnce();
    expect(onSelectionChange).not.toHaveBeenCalled();

    fireEvent.click(alpha);
    expect(onSelectionChange).toHaveBeenLastCalledWith('alpha');
    fireEvent.click(within(study).getByRole('button', {name: 'Collapse Thermal study'}));
    expect(onExpandedChange).toHaveBeenLastCalledWith([]);
  });

  it('recovers tree focus when an async update removes the focused item', async () => {
    const items = [
      {
        children: [
          {id: 'alpha', label: 'Alpha run'},
          {id: 'beta', label: 'Beta run'},
        ],
        id: 'study',
        label: 'Thermal study',
      },
    ] as const;
    const props = {
      ariaLabel: 'Study hierarchy',
      collapseLabel: 'Collapse',
      defaultExpandedIds: ['study'] as const,
      emptyState,
      expandLabel: 'Expand',
      selectionMode: 'none' as const,
    };
    const {rerender} = render(<Tree {...props} items={items} />);
    screen.getByRole('row', {name: /Beta run/}).focus();

    rerender(<Tree {...props} items={[{...items[0], children: [items[0].children[0]]}]} />);

    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole('row', {name: /Alpha run/})),
    );
  });

  it('recovers tree focus to a visible row rather than a collapsed descendant', async () => {
    const props = {
      ariaLabel: 'Study hierarchy',
      collapseLabel: 'Collapse',
      emptyState,
      expandLabel: 'Expand',
      selectionMode: 'none' as const,
    };
    const collapsed = {
      children: [{id: 'hidden-run', label: 'Hidden run'}],
      id: 'collapsed-study',
      label: 'Collapsed study',
    } as const;
    const {rerender} = render(
      <Tree {...props} items={[collapsed, {id: 'focused-study', label: 'Focused study'}]} />,
    );
    screen.getByRole('row', {name: 'Focused study'}).focus();

    rerender(<Tree {...props} items={[collapsed]} />);

    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole('row', {name: /Collapsed study/})),
    );
    expect(screen.queryByRole('row', {name: /Hidden run/})).toBeNull();
  });

  it('navigates tree rows without coupling focus to selection', () => {
    const onSelectionChange = vi.fn();
    render(
      <Tree
        ariaLabel="Study hierarchy"
        collapseLabel="Collapse"
        defaultExpandedIds={['study']}
        emptyState={emptyState}
        expandLabel="Expand"
        items={[
          {
            children: [
              {id: 'alpha', label: 'Alpha run'},
              {id: 'beta', isDisabled: true, label: 'Beta run'},
              {id: 'gamma', label: 'Gamma run'},
            ],
            id: 'study',
            label: 'Thermal study',
          },
        ]}
        onSelectionChange={onSelectionChange}
        selectionMode="single"
      />,
    );

    const study = screen.getByRole('row', {name: /Thermal study/});
    const alpha = screen.getByRole('row', {name: /Alpha run/});
    const beta = screen.getByRole('row', {name: /Beta run/});
    const gamma = screen.getByRole('row', {name: /Gamma run/});
    study.focus();
    fireEvent.keyDown(study, {key: 'ArrowDown'});
    expect(document.activeElement).toBe(alpha);
    expect(onSelectionChange).not.toHaveBeenCalled();

    fireEvent.keyDown(alpha, {key: 'g'});
    expect(document.activeElement).toBe(gamma);
    fireEvent.click(beta);
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it('reports explicit collection queries and removable applied summaries', () => {
    const onQueryChange = vi.fn();
    const query: CollectionQueryFor<typeof queryFilters> = {
      filters: [{filterId: 'status', value: 'running'}],
      text: 'chamber',
    };
    render(
      <CollectionFilterBar
        appliedFiltersLabel="Applied query"
        ariaLabel="Filter runs"
        clearAllLabel="Clear query"
        filters={queryFilters}
        getFilterSummary={(filter, option) => `${filter}: ${option}`}
        getRemoveLabel={(summary) => `Remove ${summary}`}
        getSearchSummary={(text) => `Search: ${text}`}
        onQueryChange={onQueryChange}
        query={query}
        searchClearLabel="Clear search"
        searchLabel="Search runs"
      />,
    );

    const region = screen.getByRole('search', {name: 'Filter runs'});
    expect(within(region).getByRole('list', {name: 'Applied query'}).textContent).toMatch(
      /Search: chamber.*Status: Running/,
    );

    fireEvent.change(within(region).getByRole('searchbox', {name: 'Search runs'}), {
      target: {value: 'north'},
    });
    expect(onQueryChange).toHaveBeenLastCalledWith({...query, text: 'north'});

    onQueryChange.mockClear();
    fireEvent.click(within(region).getByRole('button', {name: 'Clear search'}));
    expect(onQueryChange).toHaveBeenCalledOnce();
    expect(onQueryChange).toHaveBeenLastCalledWith({...query, text: ''});

    fireEvent.click(within(region).getByRole('button', {name: 'Remove Status: Running'}));
    expect(onQueryChange).toHaveBeenLastCalledWith({filters: [], text: 'chamber'});

    fireEvent.click(within(region).getByRole('button', {name: 'Clear query'}));
    expect(onQueryChange).toHaveBeenLastCalledWith({filters: [], text: ''});
  });

  it('owns uncontrolled query state while reporting complete filter changes', async () => {
    const onQueryChange = vi.fn();
    render(
      <CollectionFilterBar
        appliedFiltersLabel="Applied query"
        ariaLabel="Filter runs"
        clearAllLabel="Clear query"
        filters={[
          {
            emptyMessage: 'No statuses',
            id: 'status',
            label: 'Status',
            options: [
              {label: 'Running', value: 'running'},
              {label: 'Paused', value: 'paused'},
            ],
            placeholder: 'Any status',
          },
        ]}
        getFilterSummary={(filter, option) => `${filter}: ${option}`}
        getRemoveLabel={(summary) => `Remove ${summary}`}
        getSearchSummary={(text) => `Search: ${text}`}
        onQueryChange={onQueryChange}
        searchClearLabel="Clear search"
        searchLabel="Search runs"
      />,
    );

    const search = screen.getByRole('searchbox', {name: 'Search runs'});
    fireEvent.change(search, {target: {value: 'north'}});
    const status = screen.getByRole('button', {name: /Status/});
    fireEvent.keyDown(status, {key: 'ArrowDown'});
    fireEvent.click(screen.getByRole('option', {name: 'Running'}));

    expect(onQueryChange).toHaveBeenLastCalledWith({
      filters: [{filterId: 'status', value: 'running'}],
      text: 'north',
    });
    expect(screen.getByRole('list', {name: 'Applied query'}).textContent).toMatch(
      /Search: north.*Status: Running/,
    );

    const removeStatus = screen.getByRole('button', {name: 'Remove Status: Running'});
    removeStatus.focus();
    fireEvent.click(removeStatus);
    await waitFor(() => expect(document.activeElement).toBe(search));
  });

  it('keeps table and tree context mounted through loading, empty, and error states', () => {
    const {rerender} = render(
      <Table
        ariaLabel="Run results"
        columns={columns}
        emptyState={emptyState}
        onSortChange={() => undefined}
        rows={rows(() => undefined)}
        selectionMode="none"
        status="loading"
        statusMessage="Loading newer runs"
      />,
    );
    expect(screen.getByRole('grid', {name: 'Run results'})).toBeTruthy();
    expect(screen.getByRole('status').textContent).toContain('Loading newer runs');

    rerender(
      <Tree
        ariaLabel="Study hierarchy"
        collapseLabel="Collapse"
        emptyState={emptyState}
        expandLabel="Expand"
        items={[]}
        selectionMode="none"
        status="error"
        statusMessage="Studies could not be loaded"
      />,
    );
    expect(screen.getByRole('group', {name: 'Study hierarchy'})).toBeTruthy();
    expect(screen.queryByRole('treegrid')).toBeNull();
    expect(screen.getByRole('alert').textContent).toContain('Studies could not be loaded');
  });

  it('renders ready empty-state meaning without removing collection context', () => {
    const {rerender} = render(
      <Table
        ariaLabel="Run results"
        columns={columns}
        emptyState={emptyState}
        onSortChange={() => undefined}
        rows={[]}
        selectionMode="none"
      />,
    );
    expect(screen.getByRole('grid', {name: 'Run results'})).toBeTruthy();
    expect(screen.getByText('No matching runs')).toBeTruthy();

    rerender(
      <Tree
        ariaLabel="Study hierarchy"
        collapseLabel="Collapse"
        emptyState={emptyState}
        expandLabel="Expand"
        items={[]}
        selectionMode="none"
      />,
    );
    expect(screen.getByRole('group', {name: 'Study hierarchy'})).toBeTruthy();
    expect(screen.queryByRole('treegrid')).toBeNull();
    expect(screen.getByText('No matching runs')).toBeTruthy();
  });

  it('rejects invalid advanced collection identities and data shapes', () => {
    expect(() =>
      render(
        <Tree
          ariaLabel="Studies"
          collapseLabel="Collapse"
          emptyState={emptyState}
          expandLabel="Expand"
          items={[{children: [{id: 'duplicate', label: 'Child'}], id: 'duplicate', label: 'Study'}]}
          selectionMode="none"
        />,
      ),
    ).toThrow(/id "duplicate" is duplicated/i);
    expect(() =>
      render(
        <Table
          ariaLabel="Runs"
          columns={columns}
          emptyState={emptyState}
          rows={[
            {
              // @ts-expect-error Runtime validation also protects JavaScript consumers.
              cells: {actions: null, run: 'Alpha', status: 'Ready', unknown: 'Unexpected'},
              id: 'alpha',
              textValue: 'Alpha',
            },
          ]}
          selectionMode="none"
        />,
      ),
    ).toThrow(/unknown column "unknown"/i);
    expect(() =>
      render(
        <Table
          ariaLabel="Runs"
          columns={[
            // @ts-expect-error Runtime validation also protects JavaScript consumers.
            {
              id: 'actions',
              isRowHeader: true,
              kind: 'actions',
              label: 'Actions',
            },
          ]}
          emptyState={emptyState}
          rows={[{cells: {actions: null}, id: 'alpha', textValue: 'Alpha'}]}
          selectionMode="none"
        />,
      ),
    ).toThrow(/action columns cannot/i);
  });

  it('renders deterministic server output and hydrates the advanced collection family', async () => {
    const tree = (
      <AppearanceProvider accent="#2878ff" appearance="dark">
        <Table
          ariaLabel="Run results"
          columns={columns}
          emptyState={emptyState}
          onSortChange={() => undefined}
          rows={rows(() => undefined)}
          selectionMode="none"
        />
        <Tree
          ariaLabel="Study hierarchy"
          collapseLabel="Collapse"
          emptyState={emptyState}
          expandLabel="Expand"
          items={[{id: 'study', label: 'Thermal study'}]}
          selectionMode="none"
        />
        <CollectionFilterBar
          appliedFiltersLabel="Applied query"
          ariaLabel="Filter runs"
          clearAllLabel="Clear query"
          filters={[]}
          getFilterSummary={(filter, option) => `${filter}: ${option}`}
          getRemoveLabel={(summary) => `Remove ${summary}`}
          getSearchSummary={(text) => `Search: ${text}`}
          searchClearLabel="Clear search"
          searchLabel="Search runs"
        />
      </AppearanceProvider>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(tree);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    hydrateRoot(container, tree);
    await Promise.resolve();

    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
