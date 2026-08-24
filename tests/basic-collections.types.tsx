import {
  CardCollection,
  DescriptionList,
  List,
  ListBox,
  type CardCollectionItems,
  type DescriptionListItems,
  type ListBoxItems,
  type ListItems,
  type SelectableCardCollectionItems,
} from '../src/index.js';

const emptyState = {
  description: 'Create one first.',
  kind: 'no-data' as const,
  title: 'Nothing here',
};

const listItems = [{id: 'alpha', primary: 'Alpha'}] as const satisfies ListItems<'alpha'>;
const descriptions = [
  {description: 'RUN 0284', id: 'run', term: 'Run'},
] as const satisfies DescriptionListItems<'run'>;
const options = [
  {id: 'alpha', label: 'Alpha'},
  {id: 'beta', label: 'Beta'},
] as const satisfies ListBoxItems<'alpha' | 'beta'>;
const cards = [{id: 'alpha', title: 'Alpha'}] as const satisfies CardCollectionItems<'alpha'>;
const selectableCards = [
  {id: 'alpha', title: 'Alpha'},
  {id: 'beta', isDisabled: true, title: 'Beta'},
] as const satisfies SelectableCardCollectionItems<'alpha' | 'beta'>;
const staticCardsWithDisabledState = [{id: 'alpha', isDisabled: true, title: 'Alpha'}] as const;

export const basicCollections = (
  <>
    <List ariaLabel="Runs" emptyState={emptyState} items={listItems} marker="bullet" />
    <DescriptionList ariaLabel="Details" emptyState={emptyState} items={descriptions} />
    <ListBox
      ariaLabel="Runs"
      emptyState={emptyState}
      items={options}
      onSelectionChange={(id) => id satisfies 'alpha' | 'beta' | null}
      selectedId="alpha"
      selectionMode="single"
    />
    <ListBox
      ariaLabel="Compared runs"
      emptyState={emptyState}
      items={options}
      onSelectionChange={(ids) => ids satisfies ('alpha' | 'beta')[]}
      selectedIds={['alpha']}
      selectionMode="multiple"
    />
    <CardCollection
      ariaLabel="Cards"
      emptyState={emptyState}
      headingLevel={3}
      items={cards}
      selectionMode="none"
    />
    <CardCollection
      ariaLabel="Selectable cards"
      emptyState={emptyState}
      headingLevel={3}
      items={selectableCards}
      selectionMode="multiple"
    />
  </>
);

export const loadingRequiresMessage = (
  // @ts-expect-error Loading collections require localized status copy.
  <List ariaLabel="Runs" emptyState={emptyState} items={listItems} status="loading" />
);

export const noneSelectionRejectsValues = (
  // @ts-expect-error None selection does not accept selected values.
  <ListBox
    ariaLabel="Runs"
    emptyState={emptyState}
    items={options}
    selectedId="alpha"
    selectionMode="none"
  />
);

export const staticCardsRejectDisabledState = (
  // @ts-expect-error Static cards do not have a disabled widget state.
  <CardCollection
    ariaLabel="Cards"
    emptyState={emptyState}
    headingLevel={3}
    items={[
      {
        id: 'alpha',
        isDisabled: true,
        title: 'Alpha',
      },
    ]}
    selectionMode="none"
  />
);

export const staticCardsRejectPredeclaredDisabledState = (
  // @ts-expect-error Static card arrays cannot carry an ignored disabled widget state.
  <CardCollection
    ariaLabel="Cards"
    emptyState={emptyState}
    headingLevel={3}
    items={staticCardsWithDisabledState}
    selectionMode="none"
  />
);

export const disabledSelectableCardsRejectActions = (
  <CardCollection
    ariaLabel="Cards"
    emptyState={emptyState}
    headingLevel={3}
    items={[
      // @ts-expect-error Disabled selectable cards cannot retain active nested actions.
      {
        actions: <button type="button">Inspect</button>,
        id: 'alpha',
        isDisabled: true,
        title: 'Alpha',
      },
    ]}
    selectionMode="single"
  />
);

export const controlledSingleSelectionRequiresCallback = (
  // @ts-expect-error Controlled single selection requires onSelectionChange.
  <ListBox
    ariaLabel="Runs"
    emptyState={emptyState}
    items={options}
    selectedId="alpha"
    selectionMode="single"
  />
);

export const controlledMultipleSelectionRequiresCallback = (
  <ListBox
    ariaLabel="Runs"
    emptyState={emptyState}
    items={options}
    // @ts-expect-error Controlled multiple selection requires onSelectionChange.
    selectedIds={['alpha']}
    selectionMode="multiple"
  />
);

export const selectionRejectsUnknownKeys = (
  <ListBox
    ariaLabel="Runs"
    emptyState={emptyState}
    items={options}
    // @ts-expect-error Selection keys come from the item key domain.
    selectedId="gamma"
    selectionMode="single"
    onSelectionChange={() => undefined}
  />
);
