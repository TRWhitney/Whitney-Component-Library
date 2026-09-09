import {useLayoutEffect, useState} from 'react';
import {Button} from '../actions/button.js';
import {ChartActivationOutline, chartActivationOutset} from './chart-activation.js';
import {
  useChartInteraction,
  type InteractionPoint,
  type SelectionBox,
} from './chart-interaction.js';
import {itemInteractionSetup} from './item-interaction.js';
import type {HeatmapProps, HeatmapSelectionItem} from './chart-types.js';

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
  const entries = cells.map((cell) => {
    const row = props.rows[cell.rowIndex]!,
      column = props.columns[cell.columnIndex]!;
    const item = {rowId: row.id, columnId: column.id};
    return {
      item,
      cell,
      activate: (input: 'pointer' | 'keyboard' | 'touch') =>
        props.interaction?.onActivate?.({
          item,
          row,
          column,
          value: cell.value,
          datum: cell.sourceIndex === undefined ? undefined : props.data[cell.sourceIndex],
          input,
        }),
    };
  });
  const setup = props.interaction
    ? itemInteractionSetup(
        entries,
        props.interaction.selection,
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
    entries.map(({item, cell}) => ({
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
  return {actions, points, selected, setup, entries};
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
  const {labels} = setup.selection;
  return (
    <div data-wcl-chart-selection="">
      <p id={id}>{labels.instructions}</p>
      <div role="status" aria-atomic="true">
        <p>{actions.selected.length ? labels.summary(actions.selected.length) : labels.empty}</p>
        {actions.selected.length ? (
          <ul>
            {actions.selected.map((item) => (
              <li key={item.rowId}>{labels.item(item)}</li>
            ))}
          </ul>
        ) : null}
      </div>
      <Button
        variant="quiet"
        isDisabled={!actions.selected.length}
        onPress={() => actions.change([])}
      >
        {labels.clear}
      </Button>
    </div>
  );
}
