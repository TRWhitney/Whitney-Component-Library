import type {ReactNode} from 'react';

import type {EmptyStateProps} from '../feedback/feedback-types.js';

export type CollectionStatus = 'ready' | 'loading' | 'partial' | 'error';
export type ListMarker = 'bullet' | 'number' | 'none';
export type CardHeadingLevel = 2 | 3 | 4 | 5 | 6;

export type CollectionStatusProps =
  | {
      readonly status?: 'ready';
      readonly statusMessage?: never;
    }
  | {
      readonly status: Exclude<CollectionStatus, 'ready'>;
      readonly statusMessage: string;
    };

interface CollectionBaseProps {
  readonly ariaLabel: string;
  readonly emptyState: EmptyStateProps;
}

export interface ListItem<Id extends string = string> {
  readonly id: Id;
  readonly primary: ReactNode;
  readonly secondary?: ReactNode;
}

export type ListItems<Id extends string = string> = readonly ListItem<Id>[];

export type ListProps<Id extends string = string> = CollectionBaseProps &
  CollectionStatusProps & {
    readonly items: ListItems<Id>;
    readonly marker?: ListMarker;
  };

export interface DescriptionListItem<Id extends string = string> {
  readonly description: ReactNode;
  readonly id: Id;
  readonly term: ReactNode;
}

export type DescriptionListItems<Id extends string = string> = readonly DescriptionListItem<Id>[];

export type DescriptionListProps<Id extends string = string> = CollectionBaseProps &
  CollectionStatusProps & {
    readonly items: DescriptionListItems<Id>;
  };

export interface ListBoxItem<Id extends string = string> {
  readonly description?: string;
  readonly id: Id;
  readonly isDisabled?: boolean;
  readonly label: string;
}

export type ListBoxItems<Id extends string = string> = readonly ListBoxItem<Id>[];

type NoSelectionProps = {
  readonly defaultSelectedId?: never;
  readonly defaultSelectedIds?: never;
  readonly onSelectionChange?: never;
  readonly selectedId?: never;
  readonly selectedIds?: never;
  readonly selectionMode: 'none';
};

type SingleSelectionProps<Id extends string> =
  | {
      readonly defaultSelectedId?: NoInfer<Id> | null;
      readonly defaultSelectedIds?: never;
      readonly onSelectionChange?: (id: Id | null) => void;
      readonly selectedId?: never;
      readonly selectedIds?: never;
      readonly selectionMode: 'single';
    }
  | {
      readonly defaultSelectedId?: never;
      readonly defaultSelectedIds?: never;
      readonly onSelectionChange: (id: Id | null) => void;
      readonly selectedId: NoInfer<Id> | null;
      readonly selectedIds?: never;
      readonly selectionMode: 'single';
    };

type MultipleSelectionProps<Id extends string> =
  | {
      readonly defaultSelectedId?: never;
      readonly defaultSelectedIds?: readonly NoInfer<Id>[];
      readonly onSelectionChange?: (ids: Id[]) => void;
      readonly selectedId?: never;
      readonly selectedIds?: never;
      readonly selectionMode: 'multiple';
    }
  | {
      readonly defaultSelectedId?: never;
      readonly defaultSelectedIds?: never;
      readonly onSelectionChange: (ids: Id[]) => void;
      readonly selectedId?: never;
      readonly selectedIds: readonly NoInfer<Id>[];
      readonly selectionMode: 'multiple';
    };

export type CollectionSelectionProps<Id extends string = string> =
  NoSelectionProps | SingleSelectionProps<Id> | MultipleSelectionProps<Id>;

export type ListBoxProps<Id extends string = string> = CollectionBaseProps &
  CollectionStatusProps &
  CollectionSelectionProps<Id> & {
    readonly items: ListBoxItems<Id>;
  };

interface CardCollectionItemBase<Id extends string = string> {
  readonly content?: ReactNode;
  readonly description?: ReactNode;
  readonly id: Id;
  readonly title: string;
}

export type CardCollectionItem<Id extends string = string> = CardCollectionItemBase<Id> & {
  readonly actions?: ReactNode;
  readonly isDisabled?: never;
};

export type CardCollectionItems<Id extends string = string> = readonly CardCollectionItem<Id>[];

export type SelectableCardCollectionItem<Id extends string = string> = CardCollectionItemBase<Id> &
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

export type SelectableCardCollectionItems<Id extends string = string> =
  readonly SelectableCardCollectionItem<Id>[];

type CardCollectionBaseProps = CollectionBaseProps &
  CollectionStatusProps & {
    readonly headingLevel: CardHeadingLevel;
  };

type StaticCardCollectionProps<Id extends string> = CardCollectionBaseProps &
  Extract<CollectionSelectionProps<Id>, {readonly selectionMode: 'none'}> & {
    readonly items: CardCollectionItems<Id>;
  };

export type SelectableCardCollectionProps<Id extends string> = CardCollectionBaseProps &
  Exclude<CollectionSelectionProps<Id>, {readonly selectionMode: 'none'}> & {
    readonly items: SelectableCardCollectionItems<Id>;
  };

export type CardCollectionProps<Id extends string = string> =
  StaticCardCollectionProps<Id> | SelectableCardCollectionProps<Id>;
