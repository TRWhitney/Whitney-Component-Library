import type {ChartSelection} from './chart-types.js';
export type ActivationInput = 'pointer' | 'keyboard' | 'touch';
export interface ItemInteractionSetup {
  readonly selection?: ChartSelection;
  readonly onActivate?: (id: string, input: ActivationInput) => void;
}
export function itemInteractionSetup<Item>(
  entries: readonly {readonly item: Item; readonly activate: (input: ActivationInput) => void}[],
  selection: ChartSelection<Item> | undefined,
  activates: boolean,
  key: (item: Item) => string,
): ItemInteractionSetup {
  const byId = new Map(entries.map((entry) => [key(entry.item), entry]));
  const encode = (items: readonly Item[]) =>
    items.map((item) => ({rowId: key(item), seriesId: ''}));
  const decode = (items: readonly {readonly rowId: string}[]) =>
    items.flatMap((item) => {
      const entry = byId.get(item.rowId);
      return entry ? [entry.item] : [];
    });
  return {
    ...(activates
      ? {onActivate: (id: string, input: ActivationInput) => byId.get(id)?.activate(input)}
      : {}),
    ...(selection
      ? {
          selection: {
            labels: {
              ...selection.labels,
              item: (item) => selection.labels.item(byId.get(item.rowId)!.item),
            },
            ...(selection.selectedItems === undefined
              ? {
                  defaultSelectedItems: encode(selection.defaultSelectedItems ?? []),
                  ...(selection.onSelectionChange
                    ? {onSelectionChange: (items) => selection.onSelectionChange?.(decode(items))}
                    : {}),
                }
              : {
                  selectedItems: encode(selection.selectedItems),
                  onSelectionChange: (items) => selection.onSelectionChange(decode(items)),
                }),
          } satisfies ChartSelection,
        }
      : {}),
  };
}
