import type {ReactElement} from 'react';
import {frameBar, type BarRectangle} from './bar-interaction-geometry.js';
import type {InteractionPoint} from './chart-interaction.js';
import type {BoxPlotSelectionItem, ChartSelection, HistogramSelectionItem} from './chart-types.js';
export type DistributionItem = HistogramSelectionItem | BoxPlotSelectionItem;
export type ActivationInput = 'pointer' | 'keyboard' | 'touch';
export const distributionKey = (item: DistributionItem): string =>
  item.kind === 'bin'
    ? JSON.stringify(['bin', item.lower, item.upper, item.upperInclusive])
    : item.kind === 'summary'
      ? JSON.stringify(['summary', item.groupId])
      : JSON.stringify(['outlier', item.groupId, item.outlierId]);
export interface DistributionSetup {
  readonly selection?: ChartSelection;
  readonly onActivate?: (id: string, input: ActivationInput) => void;
}
export function distributionSetup<Item extends DistributionItem>(
  entries: readonly {readonly item: Item; readonly activate: (input: ActivationInput) => void}[],
  selection: ChartSelection<Item> | undefined,
  activates: boolean,
): DistributionSetup {
  const byId = new Map(entries.map((entry) => [distributionKey(entry.item), entry]));
  const encode = (items: readonly Item[]) =>
    items.map((item) => ({rowId: distributionKey(item), seriesId: ''}));
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
export interface DistributionPoint extends InteractionPoint {
  readonly kind: 'point' | 'bin' | 'summary' | 'outlier';
  readonly radius: number;
  readonly shape: number;
  readonly whiskers?: readonly {
    readonly x1: number;
    readonly x2: number;
    readonly y1: number;
    readonly y2: number;
  }[];
}
export function hitsDistribution(
  point: DistributionPoint,
  x: number,
  y: number,
  padding: number,
): boolean {
  if (point.kind === 'outlier')
    return Math.hypot(point.x - x, point.y - y) <= point.radius + padding;
  const r = point.bounds!;
  if (
    x >= r.x - padding &&
    x <= r.x + r.width + padding &&
    y >= r.y - padding &&
    y <= r.y + r.height + padding
  )
    return true;
  return (
    point.whiskers?.some(
      (line) =>
        x >= Math.min(line.x1, line.x2) - padding &&
        x <= Math.max(line.x1, line.x2) + padding &&
        y >= Math.min(line.y1, line.y2) - padding &&
        y <= Math.max(line.y1, line.y2) + padding,
    ) ?? false
  );
}
export function DistributionCue({
  point,
  points,
  cue,
  scale,
}: {
  readonly point: DistributionPoint;
  readonly points: readonly DistributionPoint[];
  readonly cue: 'reading' | 'selection' | 'activation';
  readonly scale: number;
}): ReactElement {
  const pad = (cue === 'reading' ? -2 : cue === 'selection' ? 2 : 5) / scale;
  const r = point.bounds!;
  const frame: BarRectangle =
    cue === 'reading'
      ? {
          x: r.x + Math.min(-pad, r.width / 3),
          y: r.y + Math.min(-pad, r.height / 3),
          width: Math.max(0, r.width - 2 * Math.min(-pad, r.width / 3)),
          height: Math.max(0, r.height - 2 * Math.min(-pad, r.height / 3)),
        }
      : point.kind === 'bin'
        ? frameBar(
            r,
            points.filter((p) => p.kind === 'bin').map((p) => p.bounds!),
            pad,
          )
        : {x: r.x - pad, y: r.y - pad, width: r.width + 2 * pad, height: r.height + 2 * pad};
  return (
    <g data-wcl-distribution-cue={cue}>
      {r.height === 0 || r.width === 0 ? (
        <line x1={r.x} x2={r.x + r.width} y1={r.y} y2={r.y + r.height} />
      ) : (
        <rect {...frame} />
      )}
      {point.whiskers?.map((line, index) => (
        <line {...line} key={index} />
      ))}
    </g>
  );
}
