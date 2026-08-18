'use client';

import {FieldError} from 'react-aria-components/FieldError';
import {ListBox, ListBoxItem} from 'react-aria-components/ListBox';
import {Text} from 'react-aria-components/Text';
import type {ReactElement, ReactNode} from 'react';

import type {CollectionOption, CollectionOptions} from './selection-types.js';

export function SelectionChevron(): ReactElement {
  return (
    <svg aria-hidden="true" data-wcl-selection-chevron="" viewBox="0 0 20 20">
      <path d="m5 7 5 5 5-5" />
    </svg>
  );
}

interface CollectionListProps<Value extends string> {
  readonly emptyContent: ReactNode;
  readonly options: CollectionOptions<Value>;
}

export function CollectionList<Value extends string>({
  emptyContent,
  options,
}: CollectionListProps<Value>): ReactElement {
  return (
    <ListBox
      aria-busy={undefined}
      data-wcl-selection-list=""
      items={options}
      renderEmptyState={() => <div data-wcl-selection-empty="">{emptyContent}</div>}
    >
      {(option: CollectionOption<Value>) => (
        <ListBoxItem
          data-wcl-selection-option=""
          id={option.value}
          textValue={option.label}
          {...(option.isDisabled === undefined ? {} : {isDisabled: option.isDisabled})}
        >
          {({isSelected}) => (
            <>
              <span
                aria-hidden="true"
                data-selected={isSelected || undefined}
                data-wcl-selection-rail=""
              />
              <span data-wcl-selection-option-copy="">
                <span data-wcl-selection-option-label="">{option.label}</span>
                {option.description ? (
                  <span data-wcl-selection-option-description="">{option.description}</span>
                ) : null}
              </span>
            </>
          )}
        </ListBoxItem>
      )}
    </ListBox>
  );
}

export function collectionEmptyContent(
  emptyMessage: string,
  isLoading: boolean,
  loadingMessage: string | undefined,
): ReactNode {
  return isLoading ? (
    <span aria-atomic="true" aria-live="polite" role="status">
      {loadingMessage}
    </span>
  ) : (
    emptyMessage
  );
}

interface SelectionSupportOptions {
  readonly description: string | undefined;
  readonly errorMessage: string | undefined;
  readonly isLoading: boolean;
  readonly loadingMessage: string | undefined;
}

export function renderSelectionSupport({
  description,
  errorMessage,
  isLoading,
  loadingMessage,
}: SelectionSupportOptions): ReactElement {
  return (
    <>
      {description ? (
        <Text data-wcl-field-description="" slot="description">
          {description}
        </Text>
      ) : null}
      <FieldError data-wcl-field-error="">
        {({validationErrors}) => errorMessage ?? validationErrors.join(' ')}
      </FieldError>
      {isLoading && loadingMessage ? (
        <span aria-atomic="true" aria-live="polite" data-wcl-field-pending="" role="status">
          {loadingMessage}
        </span>
      ) : null}
    </>
  );
}
