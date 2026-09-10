import type {ChartDomainValue, ChartDomainWindow} from './chart-types.js';

export interface ChartRectangularWindow<X extends ChartDomainValue, Y extends ChartDomainValue> {
  readonly x: ChartDomainWindow<X>;
  readonly y: ChartDomainWindow<Y>;
}
export type ChartExplorationCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export interface ChartRectangularExplorationLabels<
  X extends ChartDomainValue,
  Y extends ChartDomainValue,
> {
  readonly overview: string;
  readonly closeOverview: string;
  readonly done: string;
  readonly reset: string;
  readonly zoomIn: string;
  readonly zoomOut: string;
  readonly panLeft: string;
  readonly panRight: string;
  readonly panUp: string;
  readonly panDown: string;
  readonly window: string;
  readonly instructions: string;
  readonly corner: (corner: ChartExplorationCorner) => string;
  readonly range: (window: ChartRectangularWindow<X, Y>) => string;
}
export type ChartRectangularExploration<X extends ChartDomainValue, Y extends ChartDomainValue> = {
  readonly labels: ChartRectangularExplorationLabels<X, Y>;
  /** Smallest fraction of each complete axis that a window can show. Defaults to .01. */
  readonly minimumSpan?: {readonly x?: number; readonly y?: number};
  readonly onWindowChangeEnd?: (window: ChartRectangularWindow<NoInfer<X>, NoInfer<Y>>) => void;
} & (
  | {
      readonly window: ChartRectangularWindow<NoInfer<X>, NoInfer<Y>>;
      readonly defaultWindow?: never;
      readonly onWindowChange: (window: ChartRectangularWindow<NoInfer<X>, NoInfer<Y>>) => void;
    }
  | {
      readonly window?: never;
      readonly defaultWindow?: ChartRectangularWindow<NoInfer<X>, NoInfer<Y>>;
      readonly onWindowChange?: (window: ChartRectangularWindow<NoInfer<X>, NoInfer<Y>>) => void;
    }
);
