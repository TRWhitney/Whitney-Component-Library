'use client';

import {
  Cell as AriaCell,
  Column as AriaColumn,
  Row as AriaRow,
  Table as AriaTable,
  TableBody as AriaTableBody,
  TableHeader as AriaTableHeader,
} from 'react-aria-components/Table';
import type {Key} from 'react-aria-components/Table';
import {useRef, type ReactElement} from 'react';

import {useCollectionContextMenu} from './collection-context-menu.js';

import {
  CollectionFeedback,
  ariaSelectionProps,
  assertStableCollectionIds,
  collectionBusy,
} from './collection-support.js';
import type {
  SelectableTableRow,
  TableColumn,
  TableProps,
  TableRow,
  TableSortDescriptor,
} from './advanced-collection-types.js';

function validateTable<RowId extends string, ColumnId extends string>(
  props: TableProps<RowId, ColumnId>,
): void {
  const {columns, rows} = props;
  assertStableCollectionIds(columns);
  assertStableCollectionIds(rows);

  if (columns.length === 0) throw new Error('Table requires at least one column.');
  if (
    columns.some(
      (column) =>
        column.kind === 'actions' &&
        (column.allowsSorting !== undefined || column.isRowHeader !== undefined),
    )
  ) {
    throw new Error('Table action columns cannot sort or name rows.');
  }
  if (!columns.some((column) => column.isRowHeader)) {
    throw new Error('Table requires at least one row-header column.');
  }

  const columnIds = new Set(columns.map((column) => column.id));
  for (const row of rows) {
    const cellIds = Object.keys(row.cells);
    const missing = columns.find((column) => !Object.hasOwn(row.cells, column.id));
    const unknown = cellIds.find((id) => !columnIds.has(id as ColumnId));
    if (missing) throw new Error(`Table row "${row.id}" is missing column "${missing.id}".`);
    if (unknown) throw new Error(`Table row "${row.id}" has unknown column "${unknown}".`);
  }

  const sortableColumns = columns.filter((column) => column.allowsSorting);
  if (sortableColumns.length > 0 && props.onSortChange === undefined) {
    throw new Error('Sortable table columns require onSortChange.');
  }
  if (props.sortDescriptor) {
    const sortedColumn = columns.find((column) => column.id === props.sortDescriptor?.column);
    if (!sortedColumn?.allowsSorting) {
      throw new Error('Table sortDescriptor must name a sortable column.');
    }
  }
}

function sortProps<RowId extends string, ColumnId extends string>(
  props: TableProps<RowId, ColumnId>,
): {
  readonly onSortChange?: (descriptor: {
    column: Key;
    direction: 'ascending' | 'descending';
  }) => void;
  readonly sortDescriptor?: {column: Key; direction: 'ascending' | 'descending'};
} {
  if (props.onSortChange === undefined) return {};
  return {
    onSortChange: (descriptor) => props.onSortChange?.(descriptor as TableSortDescriptor<ColumnId>),
    ...(props.sortDescriptor === null || props.sortDescriptor === undefined
      ? {}
      : {sortDescriptor: props.sortDescriptor}),
  };
}

export function Table<const RowId extends string, const ColumnId extends string>(
  props: TableProps<RowId, ColumnId>,
): ReactElement {
  const {ariaLabel, columns, emptyState, rows, status = 'ready', statusMessage} = props;
  validateTable(props);
  const collectionRef = useRef<HTMLTableElement>(null);
  const context = useCollectionContextMenu(
    props.contextMenu,
    rows.map((row) => row.id),
    collectionRef,
  );
  const selectionRows = rows.map((row) => ({
    id: row.id,
    isDisabled: 'isSelectionDisabled' in row && row.isSelectionDisabled,
  }));
  const selection = ariaSelectionProps(props, selectionRows);
  const disabledKeys = selectionRows.filter((row) => row.isDisabled).map((row) => row.id);

  return (
    <div data-status={status} data-wcl-collection="" data-wcl-table="">
      <div data-wcl-table-scroll="">
        <AriaTable
          ref={collectionRef}
          aria-busy={collectionBusy(status)}
          aria-label={ariaLabel}
          data-wcl-table-grid=""
          disabledBehavior="selection"
          disabledKeys={disabledKeys}
          selectionBehavior="toggle"
          {...selection}
          {...sortProps(props)}
        >
          <AriaTableHeader<TableColumn<ColumnId>> columns={columns}>
            {(column) => (
              <AriaColumn
                data-align={column.align ?? 'start'}
                data-kind={column.kind ?? 'data'}
                data-wcl-table-column=""
                id={column.id}
                textValue={column.label}
                {...(column.allowsSorting === undefined
                  ? {}
                  : {allowsSorting: column.allowsSorting})}
                {...(column.isRowHeader === undefined ? {} : {isRowHeader: column.isRowHeader})}
              >
                {({sortDirection}) => (
                  <span data-wcl-table-heading="">
                    <span>{column.label}</span>
                    {column.allowsSorting ? (
                      <span
                        aria-hidden="true"
                        data-direction={sortDirection}
                        data-wcl-table-sort=""
                      />
                    ) : null}
                  </span>
                )}
              </AriaColumn>
            )}
          </AriaTableHeader>
          <AriaTableBody<TableRow<RowId, ColumnId> | SelectableTableRow<RowId, ColumnId>>
            items={rows}
          >
            {(row) => (
              <AriaRow
                {...context.getRowProps(row.id)}
                columns={columns}
                data-wcl-table-row=""
                id={row.id}
                textValue={row.textValue}
              >
                {(column) => (
                  <AriaCell
                    data-align={column.align ?? 'start'}
                    data-kind={column.kind ?? 'data'}
                    data-wcl-table-cell=""
                  >
                    {row.cells[column.id]}
                  </AriaCell>
                )}
              </AriaRow>
            )}
          </AriaTableBody>
        </AriaTable>
      </div>
      {context.overlay}
      <CollectionFeedback
        emptyState={emptyState}
        hasItems={rows.length > 0}
        status={status}
        {...(statusMessage === undefined ? {} : {statusMessage})}
      />
    </div>
  );
}
