import type {PointerEvent} from 'react';
import {useChartRectangularExplorationGesture} from './use-chart-rectangular-exploration-gesture.js';

type Range = readonly [number, number];
/** Restrict shared touch and middle-button exploration to the chart's data axis. */
export function useChartExplorationGesture({
  enabled,
  window,
  minimumSpan,
  onChange,
  onStart,
  version,
}: {
  readonly enabled: boolean;
  readonly window: Range;
  readonly minimumSpan: number;
  readonly onChange: (range: Range, phase: 'change' | 'end' | 'cancel') => void;
  readonly onStart: () => void;
  readonly version: string;
}) {
  const gesture = useChartRectangularExplorationGesture<SVGSVGElement>({
    enabled,
    window: {x: window, y: [0, 1]},
    minimumSpan: {x: minimumSpan, y: 1},
    onChange: (range, phase) => onChange(range.x, phase),
    onStart,
    version,
  });
  const coordinate =
    (coordinateAt: (event: PointerEvent<SVGSVGElement>) => number) =>
    (event: PointerEvent<SVGSVGElement>) => ({x: coordinateAt(event), y: 0.5});
  return {
    pointerDown: (
      event: PointerEvent<SVGSVGElement>,
      coordinateAt: (event: PointerEvent<SVGSVGElement>) => number,
    ) => gesture.pointerDown(event, coordinate(coordinateAt)),
    pointerMove: (
      event: PointerEvent<SVGSVGElement>,
      coordinateAt: (event: PointerEvent<SVGSVGElement>) => number,
    ) => gesture.pointerMove(event, coordinate(coordinateAt)),
    pointerEnd: gesture.pointerEnd,
    cancel: gesture.cancel,
  };
}
