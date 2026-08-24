import type {ReactNode} from 'react';

import type {EmptyStateProps} from '../feedback/feedback-types.js';
import type {CollectionSelectionProps, CollectionStatusProps} from './collection-types.js';

export type TableColumnAlignment = 'start' | 'end';
export type TableSortDirection = 'ascending' | 'descending';

interface TableColumnBase<ColumnId extends string = string> {
  readonly align?: TableColumnAlignment;
  readonly id: ColumnId;
  readonly label: string;
}

export type TableColumn<ColumnId extends string = string> = TableColumnBase<ColumnId> &
  (
    | {
        readonly allowsSorting?: boolean;
        readonly isRowHeader?: boolean;
        readonly kind?: 'data';
      }
    | {
        readonly allowsSorting?: never;
        readonly isRowHeader?: never;
        readonly kind: 'actions';
      }
  );

export type TableColumns<ColumnId extends string = string> = readonly TableColumn<ColumnId>[];

interface TableRowBase<RowId extends string, ColumnId extends string> {
  readonly cells: Readonly<Record<ColumnId, ReactNode>>;
  readonly id: RowId;
  readonly textValue: string;
}

export type TableRow<
  RowId extends string = string,
  ColumnId extends string = string,
> = TableRowBase<RowId, ColumnId> & {
  readonly isSelectionDisabled?: never;
};

export type TableRows<
  RowId extends string = string,
  ColumnId extends string = string,
> = readonly TableRow<RowId, ColumnId>[];

export type SelectableTableRow<
  RowId extends string = string,
  ColumnId extends string = string,
> = TableRowBase<RowId, ColumnId> & {
  readonly isSelectionDisabled?: boolean;
};

export type SelectableTableRows<
  RowId extends string = string,
  ColumnId extends string = string,
> = readonly SelectableTableRow<RowId, ColumnId>[];

export interface TableSortDescriptor<ColumnId extends string = string> {
  readonly column: ColumnId;
  readonly direction: TableSortDirection;
}

export type TableSortingProps<ColumnId extends string = string> =
  | {
      readonly onSortChange?: never;
      readonly sortDescriptor?: never;
    }
  | {
      readonly onSortChange: (descriptor: TableSortDescriptor<ColumnId>) => void;
      readonly sortDescriptor?: TableSortDescriptor<NoInfer<ColumnId>> | null;
    };

type TableBaseProps<ColumnId extends string> = CollectionStatusProps &
  TableSortingProps<ColumnId> & {
    readonly ariaLabel: string;
    readonly columns: TableColumns<ColumnId>;
    readonly emptyState: EmptyStateProps;
  };

type StaticTableProps<RowId extends string, ColumnId extends string> = TableBaseProps<ColumnId> &
  Extract<CollectionSelectionProps<RowId>, {readonly selectionMode: 'none'}> & {
    readonly rows: TableRows<RowId, NoInfer<ColumnId>>;
  };

type SelectableTableProps<
  RowId extends string,
  ColumnId extends string,
> = TableBaseProps<ColumnId> &
  Exclude<CollectionSelectionProps<RowId>, {readonly selectionMode: 'none'}> & {
    readonly rows: SelectableTableRows<RowId, NoInfer<ColumnId>>;
  };

export type TableProps<RowId extends string = string, ColumnId extends string = string> =
  StaticTableProps<RowId, ColumnId> | SelectableTableProps<RowId, ColumnId>;

interface TreeItemBase<ItemId extends string = string> {
  readonly children?: TreeItems<ItemId>;
  readonly description?: string;
  readonly id: ItemId;
  readonly label: string;
}

export type TreeItem<ItemId extends string = string> = TreeItemBase<ItemId> &
  (
    | {
        readonly actions?: ReactNode;
        readonly isDisabled?: false;
      }
    | {
        readonly actions?: never;
        readonly isDisabled: true;
      }
  );

export type TreeItems<ItemId extends string = string> = readonly TreeItem<ItemId>[];

export type TreeExpansionProps<ItemId extends string = string> =
  | {
      readonly defaultExpandedIds?: readonly NoInfer<ItemId>[];
      readonly expandedIds?: never;
      readonly onExpandedChange?: (ids: ItemId[]) => void;
    }
  | {
      readonly defaultExpandedIds?: never;
      readonly expandedIds: readonly NoInfer<ItemId>[];
      readonly onExpandedChange: (ids: ItemId[]) => void;
    };

export type TreeProps<ItemId extends string = string> = CollectionStatusProps &
  CollectionSelectionProps<ItemId> &
  TreeExpansionProps<ItemId> & {
    readonly ariaLabel: string;
    readonly collapseLabel: string;
    readonly emptyState: EmptyStateProps;
    readonly expandLabel: string;
    readonly items: TreeItems<ItemId>;
  };

export interface CollectionFilterOption<OptionId extends string = string> {
  readonly isDisabled?: boolean;
  readonly label: string;
  readonly value: OptionId;
}

export type CollectionFilterOptions<OptionId extends string = string> =
  readonly CollectionFilterOption<OptionId>[];

export interface CollectionFilterDefinition<
  FilterId extends string = string,
  OptionId extends string = string,
> {
  readonly emptyMessage: string;
  readonly id: FilterId;
  readonly label: string;
  readonly options: CollectionFilterOptions<OptionId>;
  readonly placeholder?: string;
}

export type CollectionFilterDefinitions<
  FilterId extends string = string,
  OptionId extends string = string,
> = readonly CollectionFilterDefinition<FilterId, OptionId>[];

export interface CollectionFilterSelection<
  FilterId extends string = string,
  OptionId extends string = string,
> {
  readonly filterId: FilterId;
  readonly value: OptionId;
}

export interface CollectionQuery<
  FilterId extends string = string,
  OptionId extends string = string,
> {
  readonly filters: readonly CollectionFilterSelection<FilterId, OptionId>[];
  readonly text: string;
}

type CollectionFilterSelectionFromDefinition<Definition> =
  Definition extends CollectionFilterDefinition<infer FilterId, infer OptionId>
    ? CollectionFilterSelection<FilterId, OptionId>
    : never;

export type CollectionFilterSelectionFor<
  Definitions extends CollectionFilterDefinitions = CollectionFilterDefinitions,
> = CollectionFilterSelectionFromDefinition<Definitions[number]>;

export interface CollectionQueryFor<
  Definitions extends CollectionFilterDefinitions = CollectionFilterDefinitions,
> {
  readonly filters: readonly CollectionFilterSelectionFor<Definitions>[];
  readonly text: string;
}

export type CollectionQueryProps<
  Definitions extends CollectionFilterDefinitions = CollectionFilterDefinitions,
> =
  | {
      readonly defaultQuery?: CollectionQueryFor<NoInfer<Definitions>>;
      readonly onQueryChange?: (query: CollectionQueryFor<Definitions>) => void;
      readonly query?: never;
    }
  | {
      readonly defaultQuery?: never;
      readonly onQueryChange: (query: CollectionQueryFor<Definitions>) => void;
      readonly query: CollectionQueryFor<NoInfer<Definitions>>;
    };

export type CollectionFilterBarProps<
  Definitions extends CollectionFilterDefinitions = CollectionFilterDefinitions,
> = CollectionQueryProps<Definitions> & {
  readonly appliedFiltersLabel: string;
  readonly ariaLabel: string;
  readonly clearAllLabel: string;
  readonly filters: Definitions;
  readonly getFilterSummary: (filterLabel: string, optionLabel: string) => string;
  readonly getRemoveLabel: (summary: string) => string;
  readonly getSearchSummary: (text: string) => string;
  readonly searchClearLabel: string;
  readonly searchLabel: string;
  readonly searchPlaceholder?: string;
};
