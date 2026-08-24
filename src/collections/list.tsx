'use client';

import type {ReactElement} from 'react';

import {
  CollectionCopy,
  CollectionFeedback,
  assertStableCollectionIds,
} from './collection-support.js';
import type {ListProps} from './collection-types.js';

export function List<const Id extends string>({
  ariaLabel,
  emptyState,
  items,
  marker = 'bullet',
  status = 'ready',
  statusMessage,
}: ListProps<Id>): ReactElement {
  assertStableCollectionIds(items);
  const ListElement = marker === 'number' ? 'ol' : 'ul';

  return (
    <div data-status={status} data-wcl-collection="" data-wcl-list="">
      <ListElement aria-label={ariaLabel} data-marker={marker}>
        {items.map((item) => (
          <li key={item.id}>
            <CollectionCopy description={item.secondary} primary={item.primary} />
          </li>
        ))}
      </ListElement>
      <CollectionFeedback
        emptyState={emptyState}
        hasItems={items.length > 0}
        status={status}
        {...(statusMessage === undefined ? {} : {statusMessage})}
      />
    </div>
  );
}
