import type {ReactElement, ReactNode} from 'react';

import {EmptyState} from '../feedback/empty-state.js';
import {InlineAlert} from '../feedback/alerts.js';
import {Spinner} from '../feedback/spinner.js';
import type {CollectionSelectionProps, CollectionStatus} from './collection-types.js';

export function assertStableCollectionIds(items: readonly {readonly id: string}[]): void {
  const ids = new Set<string>();
  for (const item of items) {
    if (item.id.length === 0) {
      throw new Error('Collection item ids must not be empty.');
    }
    if (ids.has(item.id)) {
      throw new Error(`Collection item id "${item.id}" is duplicated.`);
    }
    ids.add(item.id);
  }
}

export function CollectionFeedback({
  emptyState,
  hasItems,
  status = 'ready',
  statusMessage,
}: {
  readonly emptyState: Parameters<typeof EmptyState>[0];
  readonly hasItems: boolean;
  readonly status?: CollectionStatus;
  readonly statusMessage?: string;
}): ReactElement | null {
  if (status === 'loading') {
    if (statusMessage === undefined) throw new Error('Loading collections require statusMessage.');
    return (
      <div data-status="loading" data-wcl-collection-feedback="">
        <Spinner isActive label={statusMessage} />
      </div>
    );
  }

  if (status === 'partial' || status === 'error') {
    if (statusMessage === undefined)
      throw new Error(`${status} collections require statusMessage.`);
    return (
      <div data-status={status} data-wcl-collection-feedback="">
        <InlineAlert
          announcement={status === 'error' ? 'assertive' : 'polite'}
          title={statusMessage}
          tone={status === 'error' ? 'danger' : 'warning'}
        />
      </div>
    );
  }

  return hasItems ? null : (
    <div data-status="empty" data-wcl-collection-feedback="">
      <EmptyState {...emptyState} />
    </div>
  );
}

export function collectionBusy(status: CollectionStatus | undefined): true | undefined {
  return status === 'loading' ? true : undefined;
}

export interface AriaSelectionProps {
  readonly defaultSelectedKeys?: Iterable<string | number>;
  readonly onSelectionChange?: (keys: 'all' | Set<string | number>) => void;
  readonly selectedKeys?: Iterable<string | number>;
  readonly selectionMode: 'none' | 'single' | 'multiple';
}

export function ariaSelectionProps<Id extends string>(
  selection: CollectionSelectionProps<Id>,
  items: readonly {readonly id: Id; readonly isDisabled?: boolean}[],
): AriaSelectionProps {
  if (selection.selectionMode === 'none') {
    return {selectionMode: 'none'};
  }

  if (selection.selectionMode === 'single') {
    return {
      selectionMode: 'single',
      ...(selection.defaultSelectedId === undefined
        ? {}
        : {
            defaultSelectedKeys:
              selection.defaultSelectedId === null ? [] : [selection.defaultSelectedId],
          }),
      ...(selection.selectedId === undefined
        ? {}
        : {selectedKeys: selection.selectedId === null ? [] : [selection.selectedId]}),
      ...(selection.onSelectionChange === undefined
        ? {}
        : {
            onSelectionChange: (keys: 'all' | Set<string | number>) => {
              const first =
                keys === 'all'
                  ? items.find((item) => !item.isDisabled)?.id
                  : keys.values().next().value;
              selection.onSelectionChange?.((first as Id | undefined) ?? null);
            },
          }),
    };
  }

  return {
    selectionMode: 'multiple',
    ...(selection.defaultSelectedIds === undefined
      ? {}
      : {defaultSelectedKeys: selection.defaultSelectedIds}),
    ...(selection.selectedIds === undefined ? {} : {selectedKeys: selection.selectedIds}),
    ...(selection.onSelectionChange === undefined
      ? {}
      : {
          onSelectionChange: (keys: 'all' | Set<string | number>) => {
            const selected =
              keys === 'all'
                ? items.filter((item) => !item.isDisabled).map((item) => item.id)
                : items.filter((item) => keys.has(item.id)).map((item) => item.id);
            selection.onSelectionChange?.(selected);
          },
        }),
  };
}

export function CollectionCopy({
  description,
  primary,
}: {
  readonly description?: ReactNode;
  readonly primary: ReactNode;
}): ReactElement {
  return (
    <span data-wcl-collection-copy="">
      <span data-wcl-collection-primary="">{primary}</span>
      {description === undefined ? null : (
        <span data-wcl-collection-secondary="">{description}</span>
      )}
    </span>
  );
}
