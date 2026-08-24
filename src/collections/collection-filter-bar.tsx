'use client';

import {Button as AriaButton} from 'react-aria-components/Button';
import {useEffect, useRef, useState, type ReactElement} from 'react';

import {SearchField} from '../fields/search-field.js';
import {Select} from '../selection/select.js';
import {assertStableCollectionIds} from './collection-support.js';
import type {
  CollectionFilterBarProps,
  CollectionFilterDefinitions,
  CollectionFilterSelectionFor,
  CollectionQueryFor,
} from './advanced-collection-types.js';

type FilterId<Definitions extends CollectionFilterDefinitions> = Definitions[number]['id'];
type OptionId<Definitions extends CollectionFilterDefinitions> =
  Definitions[number]['options'][number]['value'];

function validateFilters<Definitions extends CollectionFilterDefinitions>(
  props: CollectionFilterBarProps<Definitions>,
  query: CollectionQueryFor<Definitions>,
): void {
  assertStableCollectionIds(props.filters);
  const definitions = new Map(props.filters.map((filter) => [filter.id, filter]));
  const applied = new Set<FilterId<Definitions>>();

  for (const filter of props.filters) {
    assertStableCollectionIds(filter.options.map((option) => ({id: option.value})));
  }
  for (const selection of query.filters) {
    const definition = definitions.get(selection.filterId);
    if (!definition)
      throw new Error(`Collection query has unknown filter "${selection.filterId}".`);
    if (applied.has(selection.filterId)) {
      throw new Error(`Collection query repeats filter "${selection.filterId}".`);
    }
    if (!definition.options.some((option) => option.value === selection.value)) {
      throw new Error(
        `Collection query filter "${selection.filterId}" has unknown value "${selection.value}".`,
      );
    }
    applied.add(selection.filterId);
  }
}

export function CollectionFilterBar<const Definitions extends CollectionFilterDefinitions>(
  props: CollectionFilterBarProps<Definitions>,
): ReactElement {
  const {
    appliedFiltersLabel,
    ariaLabel,
    clearAllLabel,
    filters,
    getFilterSummary,
    getRemoveLabel,
    getSearchSummary,
    onQueryChange,
    searchClearLabel,
    searchLabel,
    searchPlaceholder,
  } = props;
  const [uncontrolledQuery, setUncontrolledQuery] = useState<CollectionQueryFor<Definitions>>(
    props.defaultQuery ?? {filters: [], text: ''},
  );
  const [focusRequest, setFocusRequest] = useState(0);
  const filterBarRef = useRef<HTMLElement>(null);
  const query = props.query ?? uncontrolledQuery;
  validateFilters(props, query);

  useEffect(() => {
    if (focusRequest === 0) return;
    filterBarRef.current?.querySelector<HTMLInputElement>('[data-wcl-search-field] input')?.focus();
  }, [focusRequest]);

  const emitQuery = (next: CollectionQueryFor<Definitions>, restoreFocus = false) => {
    if (restoreFocus) setFocusRequest((current) => current + 1);
    if (props.query === undefined) setUncontrolledQuery(next);
    onQueryChange?.(next);
  };

  const setFilter = (
    filterId: FilterId<Definitions>,
    value: OptionId<Definitions> | null,
    restoreFocus = false,
  ) => {
    const values = new Map(query.filters.map((selection) => [selection.filterId, selection.value]));
    if (value === null) values.delete(filterId);
    else values.set(filterId, value);
    const nextFilters = filters.flatMap<CollectionFilterSelectionFor<Definitions>>((filter) => {
      const selectedValue = values.get(filter.id);
      return selectedValue === undefined
        ? []
        : [
            {
              filterId: filter.id,
              value: selectedValue,
            } as CollectionFilterSelectionFor<Definitions>,
          ];
    });
    emitQuery({...query, filters: nextFilters}, restoreFocus);
  };

  const summaries = [
    ...(query.text.length === 0
      ? []
      : [
          {
            id: 'search',
            label: getSearchSummary(query.text),
            remove: () => emitQuery({...query, text: ''}, true),
          },
        ]),
    ...filters.flatMap((filter) => {
      const selection = query.filters.find((item) => item.filterId === filter.id);
      const option = filter.options.find((item) => item.value === selection?.value);
      if (!selection || !option) return [];
      const label = getFilterSummary(filter.label, option.label);
      return [{id: `filter-${filter.id}`, label, remove: () => setFilter(filter.id, null, true)}];
    }),
  ];

  return (
    <section
      aria-label={ariaLabel}
      data-wcl-collection-filter-bar=""
      ref={filterBarRef}
      role="search"
    >
      <div data-wcl-collection-filter-controls="">
        <SearchField
          clearLabel={searchClearLabel}
          label={searchLabel}
          onChange={(text) => emitQuery({...query, text})}
          value={query.text}
          {...(searchPlaceholder === undefined ? {} : {placeholder: searchPlaceholder})}
        />
        {filters.map((filter) => {
          const value = query.filters.find((item) => item.filterId === filter.id)?.value ?? null;
          return (
            <Select
              emptyMessage={filter.emptyMessage}
              key={filter.id}
              label={filter.label}
              onChange={(nextValue) => setFilter(filter.id, nextValue)}
              options={filter.options}
              value={value}
              {...(filter.placeholder === undefined ? {} : {placeholder: filter.placeholder})}
            />
          );
        })}
      </div>
      {summaries.length === 0 ? null : (
        <div data-wcl-applied-filter-region="">
          <ul aria-label={appliedFiltersLabel} data-wcl-applied-filters="">
            {summaries.map((summary) => (
              <li data-wcl-applied-filter="" key={summary.id}>
                <span>{summary.label}</span>
                <AriaButton
                  aria-label={getRemoveLabel(summary.label)}
                  data-wcl-applied-filter-remove=""
                  onPress={summary.remove}
                >
                  <span aria-hidden="true">×</span>
                </AriaButton>
              </li>
            ))}
          </ul>
          <AriaButton
            aria-label={clearAllLabel}
            data-wcl-applied-filter-clear=""
            onPress={() => emitQuery({filters: [], text: ''}, true)}
          >
            {clearAllLabel}
          </AriaButton>
        </div>
      )}
    </section>
  );
}
