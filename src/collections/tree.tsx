'use client';

import {Button as AriaButton} from 'react-aria-components/Button';
import {Collection} from 'react-aria/Collection';
import {
  Tree as AriaTree,
  TreeItem as AriaTreeItem,
  TreeItemContent,
} from 'react-aria-components/Tree';
import type {Key} from 'react-aria-components/Tree';
import {useEffect, useMemo, useRef, type ReactElement} from 'react';

import {
  CollectionCopy,
  CollectionFeedback,
  ariaSelectionProps,
  collectionBusy,
} from './collection-support.js';
import type {TreeItem, TreeItems, TreeProps} from './advanced-collection-types.js';

function flattenTreeItems<ItemId extends string>(items: TreeItems<ItemId>): TreeItem<ItemId>[] {
  const flattened: TreeItem<ItemId>[] = [];
  const ids = new Set<string>();

  function visit(children: TreeItems<ItemId>): void {
    for (const item of children) {
      if (item.id.length === 0) throw new Error('Tree item ids must not be empty.');
      if (ids.has(item.id)) throw new Error(`Tree item id "${item.id}" is duplicated.`);
      ids.add(item.id);
      flattened.push(item);
      if (item.children) visit(item.children);
    }
  }

  visit(items);
  return flattened;
}

function expansionProps<ItemId extends string>(
  props: TreeProps<ItemId>,
  flattened: readonly TreeItem<ItemId>[],
): {
  readonly defaultExpandedKeys?: readonly ItemId[];
  readonly expandedKeys?: readonly ItemId[];
  readonly onExpandedChange?: (keys: Set<Key>) => void;
} {
  const onExpandedChange = props.onExpandedChange;
  const report =
    onExpandedChange === undefined
      ? undefined
      : (keys: Set<Key>) => {
          onExpandedChange(flattened.filter((item) => keys.has(item.id)).map((item) => item.id));
        };

  if (props.expandedIds !== undefined) {
    return {
      expandedKeys: props.expandedIds,
      ...(report === undefined ? {} : {onExpandedChange: report}),
    };
  }
  return {
    ...(props.defaultExpandedIds === undefined
      ? {}
      : {defaultExpandedKeys: props.defaultExpandedIds}),
    ...(report === undefined ? {} : {onExpandedChange: report}),
  };
}

export function Tree<const ItemId extends string>(props: TreeProps<ItemId>): ReactElement {
  const {
    ariaLabel,
    collapseLabel,
    emptyState,
    expandLabel,
    items,
    status = 'ready',
    statusMessage,
  } = props;
  const flattened = useMemo(() => flattenTreeItems(items), [items]);
  const selection = ariaSelectionProps(props, flattened);
  const disabledKeys = flattened.filter((item) => item.isDisabled).map((item) => item.id);
  const treeRef = useRef<HTMLDivElement>(null);
  const focusedId = useRef<ItemId | null>(null);
  const previousVisibleIds = useRef<readonly ItemId[]>([]);

  useEffect(() => {
    const clearExternalFocus = (event: FocusEvent) => {
      if (!treeRef.current?.contains(event.target as Node)) focusedId.current = null;
    };
    document.addEventListener('focusin', clearExternalFocus, true);
    return () => document.removeEventListener('focusin', clearExternalFocus, true);
  }, []);

  useEffect(() => {
    const recoverFocus = () => {
      const visibleRows = [
        ...(treeRef.current?.querySelectorAll<HTMLElement>('[data-item-id]') ?? []),
      ];
      const currentIds = visibleRows.map((item) => item.dataset.itemId as ItemId);
      const previousFocusedId = focusedId.current;
      if (previousFocusedId && !currentIds.includes(previousFocusedId)) {
        const previousIndex = previousVisibleIds.current.indexOf(previousFocusedId);
        const fallback = visibleRows[Math.min(Math.max(previousIndex, 0), visibleRows.length - 1)];
        const treeGrid = treeRef.current?.querySelector<HTMLElement>('[data-wcl-tree-grid]');
        (fallback ?? treeGrid ?? treeRef.current)?.focus();
        focusedId.current = (fallback?.dataset.itemId as ItemId | undefined) ?? null;
      }
      previousVisibleIds.current = currentIds;
    };

    recoverFocus();
    const animationFrame = requestAnimationFrame(recoverFocus);
    return () => cancelAnimationFrame(animationFrame);
  }, [flattened]);

  const renderItem = (item: TreeItem<ItemId>): ReactElement => (
    <AriaTreeItem
      data-item-id={item.id}
      data-wcl-tree-item=""
      id={item.id}
      textValue={item.label}
      {...(item.isDisabled === undefined ? {} : {isDisabled: item.isDisabled})}
    >
      <TreeItemContent>
        {({hasChildItems, isExpanded}) => (
          <div data-wcl-tree-content="">
            {hasChildItems ? (
              <AriaButton
                aria-label={isExpanded ? collapseLabel : expandLabel}
                data-wcl-tree-chevron=""
                slot="chevron"
              >
                <span aria-hidden="true" data-wcl-tree-chevron-mark="" />
              </AriaButton>
            ) : (
              <span aria-hidden="true" data-wcl-tree-chevron-space="" />
            )}
            <CollectionCopy description={item.description} primary={item.label} />
            {item.actions === undefined ? null : <div data-wcl-tree-actions="">{item.actions}</div>}
          </div>
        )}
      </TreeItemContent>
      {item.children === undefined ? null : (
        <Collection items={item.children}>{renderItem}</Collection>
      )}
    </AriaTreeItem>
  );

  return (
    <div data-status={status} data-wcl-collection="" data-wcl-tree="">
      <div
        aria-label={items.length === 0 ? ariaLabel : undefined}
        aria-busy={items.length === 0 ? collectionBusy(status) : undefined}
        role={items.length === 0 ? 'group' : undefined}
        tabIndex={items.length === 0 ? -1 : undefined}
        data-wcl-tree-focus-scope=""
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) focusedId.current = null;
        }}
        onFocusCapture={(event) => {
          const row = (event.target as Element).closest<HTMLElement>('[data-item-id]');
          if (row) {
            focusedId.current = row.dataset.itemId as ItemId;
            previousVisibleIds.current = [
              ...(treeRef.current?.querySelectorAll<HTMLElement>('[data-item-id]') ?? []),
            ].map((item) => item.dataset.itemId as ItemId);
          }
        }}
        ref={treeRef}
      >
        {items.length === 0 ? null : (
          <AriaTree<TreeItem<ItemId>>
            aria-busy={collectionBusy(status)}
            aria-label={ariaLabel}
            data-wcl-tree-grid=""
            disabledKeys={disabledKeys}
            items={items}
            selectionBehavior="toggle"
            {...selection}
            {...expansionProps(props, flattened)}
          >
            {renderItem}
          </AriaTree>
        )}
        <CollectionFeedback
          emptyState={emptyState}
          hasItems={items.length > 0}
          status={status}
          {...(statusMessage === undefined ? {} : {statusMessage})}
        />
      </div>
    </div>
  );
}
