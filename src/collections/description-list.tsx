'use client';

import type {ReactElement} from 'react';

import {CollectionFeedback, assertStableCollectionIds} from './collection-support.js';
import type {DescriptionListProps} from './collection-types.js';

export function DescriptionList<const Id extends string>({
  ariaLabel,
  emptyState,
  items,
  status = 'ready',
  statusMessage,
}: DescriptionListProps<Id>): ReactElement {
  assertStableCollectionIds(items);

  return (
    <div data-status={status} data-wcl-collection="" data-wcl-description-list="">
      <dl aria-label={ariaLabel}>
        {items.map((item) => (
          <div data-wcl-description-pair="" key={item.id}>
            <dt>{item.term}</dt>
            <dd>{item.description}</dd>
          </div>
        ))}
      </dl>
      <CollectionFeedback
        emptyState={emptyState}
        hasItems={items.length > 0}
        status={status}
        {...(statusMessage === undefined ? {} : {statusMessage})}
      />
    </div>
  );
}
