'use client';

import {
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
} from 'react-aria-components/ListBox';
import type {ReactElement} from 'react';

import {
  CollectionCopy,
  CollectionFeedback,
  ariaSelectionProps,
  assertStableCollectionIds,
  collectionBusy,
} from './collection-support.js';
import type {ListBoxItem, ListBoxProps} from './collection-types.js';

export function ListBox<const Id extends string>(props: ListBoxProps<Id>): ReactElement {
  const {ariaLabel, emptyState, items, status = 'ready', statusMessage} = props;
  assertStableCollectionIds(items);
  const disabledKeys = items.filter((item) => item.isDisabled).map((item) => item.id);
  const selection = ariaSelectionProps(props, items);

  return (
    <div data-status={status} data-wcl-collection="" data-wcl-list-box="">
      <AriaListBox<ListBoxItem<Id>>
        aria-busy={collectionBusy(status)}
        aria-label={ariaLabel}
        data-wcl-collection-widget=""
        disabledKeys={disabledKeys}
        items={items}
        selectionBehavior="toggle"
        {...selection}
      >
        {(item) => (
          <AriaListBoxItem data-wcl-collection-option="" id={item.id} textValue={item.label}>
            {({isSelected}) => (
              <>
                <span
                  aria-hidden="true"
                  data-selected={isSelected || undefined}
                  data-wcl-collection-selection=""
                />
                <CollectionCopy description={item.description} primary={item.label} />
              </>
            )}
          </AriaListBoxItem>
        )}
      </AriaListBox>
      <CollectionFeedback
        emptyState={emptyState}
        hasItems={items.length > 0}
        status={status}
        {...(statusMessage === undefined ? {} : {statusMessage})}
      />
    </div>
  );
}
