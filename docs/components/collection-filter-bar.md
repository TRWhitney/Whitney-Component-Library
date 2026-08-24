# CollectionFilterBar

CollectionFilterBar reports explicit text and categorical query state with removable applied summaries.

## Use for

- one text query and a bounded set of categorical filters coordinate a visible consumer-owned collection

## Do not use for

- unbounded query builders, full-text editing, hidden data fetching, sorting, pagination, or collection rendering

## Prefer instead

- Use SearchField alone for text entry, Select for one unrelated choice, or a domain-specific query builder for unbounded conditions.

## Composition and parts

- Render CollectionFilterBar inside AppearanceProvider immediately before the collection it controls.
- Define filters and options with stable ids. Keep data fetching, filtering, result counts, and sorting in the application.
- The component owns the named search region, search field, filter selects, explicit query state, applied summary list, and removal commands.

## Preferred higher-level compositions

- Coordinate CollectionFilterBar with Table, Tree, ListBox, or CardCollection while the parent owns filtering and async data.

## Content

- Use short filter labels and option labels. Summary callbacks produce concise localized descriptions of the active query.

## States

- The query may be empty or applied and controlled or uncontrolled. Search and filter fields preserve their disabled-option, focus, open, and value states.

## Control, events, validation, and forms

- Controlled or uncontrolled query state contains text and an item-ordered list of filter id and option value pairs.
- Changing, removing, or clearing criteria reports a complete next query. The component never filters data or resets collection state.
- onQueryChange reports the complete text and filter selection state after every search, select, remove, or clear command.
- Filter and option ids must be nonempty and unique within their domains. A query may select each known filter at most once and must use a known option value.
- CollectionFilterBar does not submit or fetch data. The application may serialize the reported query separately.

## Accessibility

- CollectionFilterBar owns one named search region containing a named search field, labeled filter selects, and a labeled list of applied query summaries.
- Each applied summary has a named removal control. Clear all remains a separate named command.

## Keyboard, labeling, localization, and direction

- Search and Select retain their field keyboard behavior. Tab reaches each field and applied-query command in reading order.
- ariaLabel names the search region. Every field, applied list, remove command, and clear command requires localized naming copy.
- Consumers localize all field, option, summary, removal, clear, placeholder, and empty-option copy through required strings and callbacks.
- Control order, applied-summary flow, remove controls, and text follow inherited writing direction.

## Appearance and responsive behavior

- Collection text, dividers, feedback, focus, and selection use the active AppearanceProvider values.
- Compact layouts keep readable rows and move card and description layouts to one column.
- Controls use equal responsive columns on wide layouts and stack at compact widths. Applied summaries wrap without document overflow.

## Accent, forced colors, and reduced motion

- Search and filter controls use the application accent for focus. Applied summaries keep neutral text and accent structure.
- Controls, summaries, focus, remove commands, and boundaries use system colors.
- The filter bar adds no motion beyond its composed controls.

## Examples

### Run query controls

The query remains explicit while the application decides how results change.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, CollectionFilterBar} from '@trwhitney/component-library';

<AppearanceProvider accent="#2878ff" appearance="dark">
  <CollectionFilterBar
    appliedFiltersLabel="Applied query"
    ariaLabel="Filter runs"
    clearAllLabel="Clear query"
    filters={[{
      id: 'status',
      label: 'Status',
      emptyMessage: 'No statuses',
      placeholder: 'Any status',
      options: [{value: 'running', label: 'Running'}],
    }]}
    getFilterSummary={(filter, option) => filter + ': ' + option}
    getRemoveLabel={(summary) => 'Remove ' + summary}
    getSearchSummary={(text) => 'Search: ' + text}
    searchClearLabel="Clear search"
    searchLabel="Search runs"
  />
</AppearanceProvider>;
```

## Counterexamples

### Do not make filters fetch data

Do not hide network requests inside the filter controls. The application receives query changes and owns results.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, CollectionFilterBar} from '@trwhitney/component-library';

<AppearanceProvider accent="#2878ff" appearance="dark">
  <CollectionFilterBar
    appliedFiltersLabel="Applied query"
    ariaLabel="Filter runs"
    clearAllLabel="Clear query"
    filters={[]}
    getFilterSummary={(filter, option) => filter + ': ' + option}
    getRemoveLabel={(summary) => 'Remove ' + summary}
    getSearchSummary={(text) => 'Search: ' + text}
    searchClearLabel="Clear search"
    searchLabel="Search runs"
  />
</AppearanceProvider>;
```
