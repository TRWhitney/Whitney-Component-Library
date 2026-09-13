'use client';

import {GridList, GridListItem} from 'react-aria-components/GridList';
import {createElement, type CSSProperties, type ReactElement} from 'react';

import {
  CollectionFeedback,
  ariaSelectionProps,
  assertStableCollectionIds,
  collectionBusy,
} from './collection-support.js';
import type {
  CardCollectionItem,
  CardCollectionProps,
  SelectableCardCollectionItem,
  SelectableCardCollectionProps,
} from './collection-types.js';

function CardContent<Id extends string>({
  headingLevel,
  item,
  isHeightBounded,
}: {
  readonly headingLevel: CardCollectionProps<Id>['headingLevel'];
  readonly isHeightBounded: boolean;
  readonly item: CardCollectionItem<Id> | SelectableCardCollectionItem<Id>;
}): ReactElement {
  return (
    <article aria-label={item.title} data-wcl-card="" tabIndex={isHeightBounded ? 0 : undefined}>
      <div data-wcl-card-copy="">
        {createElement(`h${headingLevel}`, {'data-wcl-card-title': ''}, item.title)}
        {item.description === undefined ? null : (
          <div data-wcl-card-description="">{item.description}</div>
        )}
      </div>
      {item.content === undefined ? null : <div data-wcl-card-content="">{item.content}</div>}
      {item.actions === undefined ? null : <div data-wcl-card-actions="">{item.actions}</div>}
    </article>
  );
}

export function CardCollection<const Id extends string>(
  props: CardCollectionProps<Id>,
): ReactElement {
  const {
    ariaLabel,
    emptyState,
    headingLevel,
    items,
    selectionMode,
    status = 'ready',
    statusMessage,
  } = props;
  assertStableCollectionIds(items);
  for (const dimension of ['cardWidth', 'cardHeight'] as const) {
    const value = props[dimension];
    if (value !== undefined && (!Number.isFinite(value) || value <= 0)) {
      throw new Error(
        `CardCollection ${dimension} must be a positive finite number of CSS pixels.`,
      );
    }
  }

  return (
    <div
      data-card-width={props.cardWidth === undefined ? undefined : ''}
      data-card-height={props.cardHeight === undefined ? undefined : ''}
      style={
        {
          '--wcl-card-width': props.cardWidth === undefined ? undefined : `${props.cardWidth}px`,
          '--wcl-card-height': props.cardHeight === undefined ? undefined : `${props.cardHeight}px`,
        } as CSSProperties
      }
      data-selection-mode={selectionMode}
      data-status={status}
      data-wcl-card-collection=""
      data-wcl-collection=""
    >
      {selectionMode === 'none' ? (
        <ul aria-label={ariaLabel} data-wcl-card-list="">
          {items.map((item) => (
            <li key={item.id}>
              <CardContent
                headingLevel={headingLevel}
                item={item}
                isHeightBounded={props.cardHeight !== undefined}
              />
            </li>
          ))}
        </ul>
      ) : (
        <SelectableCards {...props} />
      )}
      <CollectionFeedback
        emptyState={emptyState}
        hasItems={items.length > 0}
        status={status}
        {...(statusMessage === undefined ? {} : {statusMessage})}
      />
    </div>
  );
}

function SelectableCards<Id extends string>(
  props: SelectableCardCollectionProps<Id>,
): ReactElement {
  const {ariaLabel, headingLevel, items, status} = props;
  const selection = ariaSelectionProps(props, items);
  const disabledKeys = items.filter((item) => item.isDisabled).map((item) => item.id);

  return (
    <GridList<SelectableCardCollectionItem<Id>>
      aria-busy={collectionBusy(status)}
      aria-label={ariaLabel}
      data-wcl-card-grid=""
      disabledKeys={disabledKeys}
      items={items}
      layout="grid"
      selectionBehavior="toggle"
      {...selection}
    >
      {(item) => (
        <GridListItem data-wcl-card-option="" id={item.id} textValue={item.title}>
          {({isSelected}) => (
            <>
              <span
                aria-hidden="true"
                data-selected={isSelected || undefined}
                data-wcl-collection-selection=""
              />
              <CardContent
                headingLevel={headingLevel}
                item={item}
                isHeightBounded={props.cardHeight !== undefined}
              />
            </>
          )}
        </GridListItem>
      )}
    </GridList>
  );
}
