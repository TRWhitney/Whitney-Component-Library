import {useLayoutEffect, useState} from 'react';
import {ChartSelectionPresentation} from './chart-selection-presentation.js';
import {ChartActivationOutline, chartActivationOutset} from './chart-activation.js';
import {
  useChartInteraction,
  type InteractionPoint,
  type SelectionBox,
} from './chart-interaction.js';
import {itemInteractionSetup} from './item-interaction.js';
import type {ChartSelection, HeatmapProps, HeatmapSelectionItem} from './chart-types.js';

export interface HeatmapCell {
  readonly index: number;
  readonly rowIndex: number;
  readonly columnIndex: number;
  readonly sourceIndex: number | undefined;
  readonly value: number | undefined;
}
export const heatmapKey = (item: HeatmapSelectionItem): string =>
  JSON.stringify([item.rowId, item.columnId]);

export function useHeatmapInteraction<Datum extends object>(
  props: HeatmapProps<Datum>,
  cells: readonly HeatmapCell[],
  canvas: HTMLDivElement | null,
  version: string,
  source = {props, cells},
) {
  const [geometry, setGeometry] = useState<{
    cells: readonly SelectionBox[];
    canvas: readonly number[];
  }>({cells: [], canvas: []});
  const enabled = props.interaction !== undefined;
  useLayoutEffect(() => {
    if (!canvas || !enabled) return;
    const measure = () => {
      const origin = canvas.getBoundingClientRect();
      const next = {
        canvas: [origin.x, origin.y, origin.width, origin.height],
        cells: [...canvas.querySelectorAll('[data-wcl-heatmap-cell]')].map((element) => {
          const r = element.getBoundingClientRect();
          return {x: r.left - origin.left, y: r.top - origin.top, width: r.width, height: r.height};
        }),
      };
      setGeometry((previous) =>
        JSON.stringify(previous) === JSON.stringify(next) ? previous : next,
      );
    };
    measure();
    const Observer = canvas.ownerDocument.defaultView?.ResizeObserver;
    const observer = Observer ? new Observer(measure) : undefined;
    observer?.observe(canvas);
    return () => observer?.disconnect();
  }, [canvas, version, enabled]);
  const makeEntries = (input: HeatmapProps<Datum>, inputCells: readonly HeatmapCell[]) =>
    inputCells.map((cell) => {
      const row = input.rows[cell.rowIndex]!,
        column = input.columns[cell.columnIndex]!;
      const item = {rowId: row.id, columnId: column.id};
      return {
        item,
        cell,
        activate: (inputMethod: 'pointer' | 'keyboard' | 'touch') =>
          props.interaction?.onActivate?.({
            item,
            row,
            column,
            value: cell.value,
            datum: cell.sourceIndex === undefined ? undefined : source.props.data[cell.sourceIndex],
            input: inputMethod,
          }),
      };
    });
  const entries = makeEntries(props, cells);
  const allEntries = makeEntries(source.props, source.cells);
  const visible = new Set(entries.map(({item}) => heatmapKey(item)));
  const allowed = new Set(allEntries.map(({item}) => heatmapKey(item)));
  const selection = props.interaction?.selection;
  const normalize = (items: readonly HeatmapSelectionItem[]) => [
    ...new Map(
      items.filter((item) => allowed.has(heatmapKey(item))).map((item) => [heatmapKey(item), item]),
    ).values(),
  ];
  const [internal, setInternal] = useState<readonly HeatmapSelectionItem[]>(
    selection?.defaultSelectedItems ?? [],
  );
  const allowedVersion = JSON.stringify([...allowed]);
  const [previousAllowed, setPreviousAllowed] = useState(allowedVersion);
  if (previousAllowed !== allowedVersion) {
    setPreviousAllowed(allowedVersion);
    setInternal(normalize(internal));
  }
  const retained = normalize(selection?.selectedItems ?? internal);
  const commit = (items: readonly HeatmapSelectionItem[]) => {
    const next = normalize(items);
    if (selection?.selectedItems === undefined) setInternal(next);
    selection?.onSelectionChange?.(next);
  };
  const controlledSelection: ChartSelection<HeatmapSelectionItem> | undefined = selection
    ? {
        ...(selection.presentation === undefined ? {} : {presentation: selection.presentation}),
        labels: {
          ...selection.labels,
          item: (item) => {
            const label = selection.labels.item(item);
            return visible.has(heatmapKey(item)) ? label : selection.labels.hidden(label);
          },
        },
        selectedItems: retained,
        onSelectionChange: (items) =>
          commit([...retained.filter((item) => !visible.has(heatmapKey(item))), ...items]),
      }
    : undefined;
  const setup = props.interaction
    ? itemInteractionSetup(
        allEntries,
        controlledSelection,
        !!props.interaction.onActivate,
        heatmapKey,
      )
    : undefined;
  const actions = useChartInteraction(
    setup
      ? {
          target: 'point',
          ...(setup.selection ? {selection: setup.selection} : {}),
          ...(setup.onActivate
            ? {
                onActivate: (event: {
                  item: {rowId: string};
                  input: 'pointer' | 'keyboard' | 'touch';
                }) => setup.onActivate?.(event.item.rowId, event.input),
              }
            : {}),
        }
      : undefined,
    allEntries.map(({item, cell}) => ({
      id: heatmapKey(item),
      category: item.columnId,
      datum: cell,
      values: [{seriesId: '', label: item.columnId, value: cell.value ?? 0, hidden: false}],
    })),
    JSON.stringify([version, geometry, !!props.interaction?.onActivate]),
    props.data,
  );
  const points: InteractionPoint[] = entries.flatMap(({item, cell}) => {
    const bounds = geometry.cells[cell.index];
    return bounds
      ? [
          {
            index: cell.index,
            item: {rowId: heatmapKey(item), seriesId: ''},
            seriesId: '',
            categoryPosition: bounds.x,
            x: bounds.x + bounds.width / 2,
            y: bounds.y + bounds.height / 2,
            bounds,
          },
        ]
      : [];
  });
  const selected = new Set(actions.selected.map((item) => item.rowId));
  return {
    actions: {
      ...actions,
      change: (items: readonly {rowId: string}[]) =>
        commit(
          items.flatMap((item) => {
            const entry = allEntries.find((entry) => heatmapKey(entry.item) === item.rowId);
            return entry ? [entry.item] : [];
          }),
        ),
    },
    points,
    selected,
    setup,
    entries,
  };
}

export function HeatmapInteractionFeedback({
  state,
}: {
  readonly state: ReturnType<typeof useHeatmapInteraction>;
}) {
  const {actions, points} = state;
  const pulse = actions.pulse
    ? points.find((point) => point.item.rowId === actions.pulse!.item.rowId)?.bounds
    : undefined;
  return (
    <svg aria-hidden="true" data-wcl-heatmap-interaction-overlay="">
      {state.setup?.selection
        ? points
            .filter((point) => state.selected.has(point.item.rowId))
            .map((point) => (
              <rect key={point.item.rowId} {...point.bounds} rx={3} data-wcl-heatmap-selection="" />
            ))
        : null}
      {pulse && actions.pulse ? (
        <g key={actions.pulse.sequence}>
          <ChartActivationOutline>
            <rect
              data-wcl-chart-activation-bar=""
              x={pulse.x - chartActivationOutset}
              y={pulse.y - chartActivationOutset}
              width={pulse.width + 2 * chartActivationOutset}
              height={pulse.height + 2 * chartActivationOutset}
              rx={3}
            />
          </ChartActivationOutline>
        </g>
      ) : null}
      {actions.box ? <rect {...actions.box} data-wcl-chart-selection-box="" /> : null}
    </svg>
  );
}

export function HeatmapSelectionSummary({
  state,
  id,
}: {
  readonly state: ReturnType<typeof useHeatmapInteraction>;
  readonly id: string;
}) {
  const {setup, actions} = state;
  if (!setup?.selection) return null;
  return (
    <ChartSelectionPresentation
      selection={setup.selection}
      selected={actions.selected}
      instructionsId={id}
      itemKey={(item) => item.rowId}
      onClear={() => {
        actions.cancel();
        actions.change([]);
      }}
    />
  );
}
