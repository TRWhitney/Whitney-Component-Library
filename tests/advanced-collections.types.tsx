import {
  CollectionFilterBar,
  Table,
  Tree,
  type CollectionFilterDefinitions,
  type CollectionQuery,
  type TableColumns,
  type TableRows,
  type TreeItems,
} from '../src/index.js';

const emptyState = {
  description: 'Try a broader query.',
  kind: 'no-results' as const,
  title: 'No matching runs',
};

const columns = [
  {id: 'run', isRowHeader: true, label: 'Run'},
  {id: 'status', label: 'Status'},
] as const satisfies TableColumns<'run' | 'status'>;
const rows = [
  {
    cells: {run: 'Alpha run', status: 'Converged'},
    id: 'alpha',
    textValue: 'Alpha run',
  },
] as const satisfies TableRows<'alpha', 'run' | 'status'>;
const treeItems = [
  {children: [{id: 'alpha', label: 'Alpha run'}], id: 'study', label: 'Study'},
] as const satisfies TreeItems<'study' | 'alpha'>;
const filters = [
  {
    emptyMessage: 'No statuses',
    id: 'status',
    label: 'Status',
    options: [{label: 'Running', value: 'running'}],
  },
] as const satisfies CollectionFilterDefinitions<'status', 'running'>;
const pairedFilters = [
  {
    emptyMessage: 'No statuses',
    id: 'status',
    label: 'Status',
    options: [{label: 'Running', value: 'running'}],
  },
  {
    emptyMessage: 'No profiles',
    id: 'profile',
    label: 'Profile',
    options: [{label: 'Balanced', value: 'balanced'}],
  },
] as const satisfies CollectionFilterDefinitions<'status' | 'profile', 'running' | 'balanced'>;
const query: CollectionQuery<'status', 'running'> = {
  filters: [{filterId: 'status', value: 'running'}],
  text: '',
};

export const advancedCollections = (
  <>
    <Table
      minimumWidth="content"
      ariaLabel="Runs"
      columns={columns}
      emptyState={emptyState}
      onSelectionChange={(id) => id satisfies 'alpha' | null}
      rows={rows}
      selectedId="alpha"
      selectionMode="single"
    />
    <Tree
      ariaLabel="Studies"
      collapseLabel="Collapse"
      emptyState={emptyState}
      expandLabel="Expand"
      expandedIds={['study']}
      items={treeItems}
      onExpandedChange={(ids) => ids satisfies ('study' | 'alpha')[]}
      onSelectionChange={(ids) => ids satisfies ('study' | 'alpha')[]}
      selectedIds={['alpha']}
      selectionMode="multiple"
    />
    <CollectionFilterBar
      appliedFiltersLabel="Applied"
      ariaLabel="Filter runs"
      clearAllLabel="Clear"
      filters={filters}
      getFilterSummary={(filter, option) => `${filter}: ${option}`}
      getRemoveLabel={(summary) => `Remove ${summary}`}
      getSearchSummary={(text) => `Search: ${text}`}
      onQueryChange={(next) => next satisfies CollectionQuery<'status', 'running'>}
      query={query}
      searchClearLabel="Clear search"
      searchLabel="Search"
    />
  </>
);

export const tableRejectsUnknownSortColumn = (
  <Table
    ariaLabel="Runs"
    columns={columns}
    emptyState={emptyState}
    onSortChange={() => undefined}
    rows={rows}
    selectionMode="none"
    // @ts-expect-error Sort columns come from the column id domain.
    sortDescriptor={{column: 'profile', direction: 'ascending'}}
  />
);

export const tableRejectsMissingCells = (
  <Table
    ariaLabel="Runs"
    columns={columns}
    emptyState={emptyState}
    rows={[
      {
        // @ts-expect-error Every row provides a cell for every column.
        cells: {run: 'Alpha run'},
        id: 'alpha',
        textValue: 'Alpha run',
      },
    ]}
    selectionMode="none"
  />
);

export const treeRejectsUnknownExpandedId = (
  <Tree
    ariaLabel="Studies"
    collapseLabel="Collapse"
    emptyState={emptyState}
    expandLabel="Expand"
    // @ts-expect-error Expanded ids come from the tree item domain.
    expandedIds={['missing']}
    items={treeItems}
    onExpandedChange={() => undefined}
    selectionMode="none"
  />
);

export const controlledFilterQueryRequiresCallback = (
  // @ts-expect-error A controlled collection query requires onQueryChange.
  <CollectionFilterBar
    appliedFiltersLabel="Applied"
    ariaLabel="Filter runs"
    clearAllLabel="Clear"
    filters={filters}
    getFilterSummary={(filter, option) => `${filter}: ${option}`}
    getRemoveLabel={(summary) => `Remove ${summary}`}
    getSearchSummary={(text) => `Search: ${text}`}
    query={query}
    searchClearLabel="Clear search"
    searchLabel="Search"
  />
);

export const filterQueryRejectsUnknownValues = (
  <CollectionFilterBar
    appliedFiltersLabel="Applied"
    ariaLabel="Filter runs"
    clearAllLabel="Clear"
    filters={filters}
    getFilterSummary={(filter, option) => `${filter}: ${option}`}
    getRemoveLabel={(summary) => `Remove ${summary}`}
    getSearchSummary={(text) => `Search: ${text}`}
    onQueryChange={() => undefined}
    query={{
      // @ts-expect-error Filter values come from the option value domain.
      filters: [{filterId: 'status', value: 'paused'}],
      text: '',
    }}
    searchClearLabel="Clear search"
    searchLabel="Search"
  />
);

export const filterQueryRejectsValuesFromAnotherFilter = (
  <CollectionFilterBar
    appliedFiltersLabel="Applied"
    ariaLabel="Filter runs"
    clearAllLabel="Clear"
    filters={pairedFilters}
    getFilterSummary={(filter, option) => `${filter}: ${option}`}
    getRemoveLabel={(summary) => `Remove ${summary}`}
    getSearchSummary={(text) => `Search: ${text}`}
    onQueryChange={() => undefined}
    query={{
      filters: [
        // @ts-expect-error Each filter accepts only values from its own options.
        {
          filterId: 'status',
          value: 'balanced',
        },
      ],
      text: '',
    }}
    searchClearLabel="Clear search"
    searchLabel="Search"
  />
);
