import type {ChartDomainValue, ChartExploration, ChartScale} from './chart-types.js';
import type {
  ChartRectangularExploration,
  ChartRectangularWindow,
} from './chart-rectangular-exploration-types.js';
import {useChartExploration} from './use-chart-exploration.js';

/** Coordinate two domain axes while emitting one rectangular change per gesture. */
export function useChartRectangularExploration<
  X extends ChartDomainValue,
  Y extends ChartDomainValue,
>(
  config: ChartRectangularExploration<X, Y> | undefined,
  xScale: ChartScale<X>,
  yScale: ChartScale<Y>,
  xValues: readonly X[],
  yValues: readonly Y[],
) {
  if (config) {
    for (const window of [config.window, config.defaultWindow]) {
      if (window !== undefined && (!window || !Array.isArray(window.x) || !Array.isArray(window.y)))
        throw new TypeError('Chart exploration window requires both x and y axes.');
    }
    if (config.window !== undefined && config.defaultWindow !== undefined)
      throw new TypeError('Chart exploration cannot use window and defaultWindow together.');
    if (config.window !== undefined && typeof config.onWindowChange !== 'function')
      throw new TypeError('Controlled chart exploration window requires onWindowChange.');
    for (const name of ['panLeft', 'panRight', 'panUp', 'panDown'] as const)
      if (typeof config.labels?.[name] !== 'string' || !config.labels[name].trim())
        throw new TypeError(`Chart exploration labels.${name} must be a nonblank string.`);
    if (typeof config.labels?.corner !== 'function' || typeof config.labels?.range !== 'function')
      throw new TypeError('Chart exploration labels.corner and labels.range must be functions.');
    for (const corner of ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const) {
      const label = config.labels.corner(corner);
      if (typeof label !== 'string' || !label.trim())
        throw new TypeError('Chart exploration labels.corner must return a nonblank string.');
    }
  }
  function axisConfig<Value extends ChartDomainValue>(
    axis: 'x' | 'y',
    window: readonly [Value, Value] | undefined,
    defaultWindow: readonly [Value, Value] | undefined,
  ): ChartExploration<Value> | undefined {
    if (!config) return undefined;
    const labels = {
      ...config.labels,
      panBackward: axis === 'x' ? config.labels.panLeft : config.labels.panDown,
      panForward: axis === 'x' ? config.labels.panRight : config.labels.panUp,
      start: config.labels.corner('bottom-left'),
      end: config.labels.corner('top-right'),
      // Axis formatting is internal; consumers format the complete rectangle below.
      range: (range: readonly Value[]) => JSON.stringify(range),
    };
    const shared = {
      labels,
      ...(config.minimumSpan?.[axis] === undefined ? {} : {minimumSpan: config.minimumSpan[axis]}),
    };
    return config.window === undefined
      ? {
          ...shared,
          ...(defaultWindow === undefined ? {} : {defaultWindow}),
        }
      : {
          ...shared,
          window: window!,
          onWindowChange: () => {},
        };
  }
  const x = useChartExploration(
    axisConfig('x', config?.window?.x, config?.defaultWindow?.x),
    xScale,
    xValues,
  );
  const y = useChartExploration(
    axisConfig('y', config?.window?.y, config?.defaultWindow?.y),
    yScale,
    yValues,
  );
  const window = {x: x.window, y: y.window};
  if (config) {
    const label = config.labels.range(window);
    if (typeof label !== 'string' || !label.trim())
      throw new TypeError('Chart exploration labels.range must return a nonblank string.');
  }
  const fromNormalized = (range: ChartRectangularWindow<number, number>) => ({
    x: x.fromNormalized(range.x),
    y: y.fromNormalized(range.y),
  });
  return {
    x,
    y,
    window,
    normalized: {x: x.normalized, y: y.normalized},
    full: {x: x.full, y: y.full},
    minimumSpan: {x: x.minimumSpan, y: y.minimumSpan},
    fromNormalized,
    change: (range: ChartRectangularWindow<number, number>, phase: 'change' | 'end' | 'cancel') => {
      if (!config) return;
      x.change(range.x, phase);
      y.change(range.y, phase);
      const next = fromNormalized(range);
      config.onWindowChange?.(next);
      if (phase === 'end') config.onWindowChangeEnd?.(next);
    },
  };
}
