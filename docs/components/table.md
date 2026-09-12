# Table

Table compares keyed records across typed columns with optional application-owned sorting and row selection.

## Use for

- people need to scan and compare keyed records across typed columns, optionally sort them, or select rows

## Do not use for

- spreadsheet editing, layout grids, hierarchical records, prose, menus, or collections without meaningful columns

## Prefer instead

- Use DescriptionList for one subject, List for a readable sequence, ListBox for compact selection, or Tree for hierarchy.

## Composition and parts

- Render Table inside AppearanceProvider.
- Define columns once and provide every row cell through a record keyed by the same column ids.
- Place Button, IconButton, Link, or another explicit control in a column whose kind is actions.
- The component owns the overflow container, grid, headers, rows, cells, sorting affordance, selection treatment, and collection feedback.

## Preferred higher-level compositions

- Place CollectionFilterBar before Table when the application coordinates query, filtering, and sortable results.

## Content

- Mark at least one data column as a row header. Keep headers concise and use end alignment for numeric values.
- Sorting is application-owned. Reorder rows after onSortChange and pass the active descriptor back to Table.

## States

- ready displays the current items, loading keeps current items and adds Spinner, partial keeps items and adds warning feedback, and error keeps items and adds danger feedback.
- An empty ready collection renders the required no-data or no-results EmptyState inside the labeled collection context.
- Rows support focused, selected, selection-disabled, hovered, and pressed states. Headers expose sortable and active sort-direction states.

## Control, events, validation, and forms

- Interactive row labels and whitespace use the pointer cursor. Disabled rows use not-allowed while nested enabled controls keep their own cursor. Passive records retain text selection.
- selectionMode explicitly chooses none, single, or multiple row selection through typed controlled or uncontrolled props.
- Sortable columns require onSortChange. Table reports a typed descriptor and never mutates or sorts consumer rows.
- Stable row ids preserve focus through insertion and reordering. Removing the focused row moves focus through the grid behavior.
- onSortChange reports a column id and ascending or descending direction. Selection callbacks report row ids in current row order.
- Controls inside action cells own their own events and do not trigger row selection.
- Column and row ids must be nonempty and unique. Every row provides exactly one cell for every declared column.
- At least one column is a row header. Action columns cannot sort or name rows. An active sort descriptor names a sortable column.
- Virtualization is not part of the public API.
- Table does not serialize row selection. Controls placed in cells retain their own form behavior.

## Accessibility

- Table owns a labeled grid with column headers, row headers, rows, cells, sort state, and optional row selection.
- Embedded actions remain named controls inside an actions column and do not activate or select their row.

## Keyboard, labeling, localization, and direction

- Arrow keys move through rows and cells, Home and End reach row boundaries, typeahead finds row headers, Enter sorts headers, and Space or Enter changes selection.
- Focusable controls in cells retain their own keyboard operation without becoming row activation.
- ariaLabel names the grid. isRowHeader marks the columns that name each row. Column and row text values support announcements and typeahead.
- Consumers localize the table name, headers, cell content, action labels, empty copy, and status copy.
- Column order, start and end alignment, selection rails, and horizontal overflow follow inherited writing direction.

## Appearance and responsive behavior

- Collection text, dividers, feedback, focus, and selection use the active AppearanceProvider values.
- Compact layouts keep readable rows and move card and description layouts to one column.
- The table keeps its column relationships and scrolls horizontally when the available inline size is too small. Cells wrap ordinary content.

## Accent, forced colors, and reduced motion

- Final-row cell backgrounds and hover, pressed, and focus borders follow the logical lower table corners, including one-row tables and RTL. Feedback sits one pixel inside the neutral frame so the curved accent stroke keeps the same contrast as its straight edges.
- Selected rows use the established leading accent rail. Focus uses the active accent focus color without tinting ordinary data.
- Headers, cells, boundaries, focus, selection, disabled rows, and overflow use system colors.
- The selection rail and sort indicator settle without transition. Table adds no continuous motion.

## Examples

### Sortable run results

A sortable row-header column identifies each comparable run.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Table} from '@trwhitney/component-library';

<AppearanceProvider accent="#2878ff" appearance="dark">
  <Table
    ariaLabel="Run results"
    columns={[
      {id: 'run', label: 'Run', isRowHeader: true, allowsSorting: true},
      {id: 'status', label: 'Status'},
    ]}
    emptyState={{kind: 'no-results', title: 'No matches', description: 'Change the query.'}}
    onSortChange={(descriptor) => console.log(descriptor)}
    rows={[{
      id: 'run-284',
      textValue: 'RUN 0284',
      cells: {run: 'RUN 0284', status: 'Converged'},
    }]}
    selectionMode="none"
  />
</AppearanceProvider>;
```

## Counterexamples

### Do not imply spreadsheet editing

Table compares records. Use fields and an explicit edit flow instead of turning every cell into a spreadsheet editor.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Table} from '@trwhitney/component-library';

<AppearanceProvider accent="#2878ff" appearance="dark">
  <Table
    ariaLabel="Editable budget"
    columns={[{id: 'amount', label: 'Amount', isRowHeader: true}]}
    emptyState={{kind: 'no-data', title: 'No rows', description: 'Add a row first.'}}
    rows={[{id: 'row-1', textValue: 'Row 1', cells: {amount: <input />}}]}
    selectionMode="none"
  />
</AppearanceProvider>;
```
