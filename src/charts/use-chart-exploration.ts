import {useState} from 'react';

import type {
  ChartDomainValue,
  ChartDomainWindow,
  ChartExploration,
  ChartScale,
} from './chart-types.js';

type Range = readonly [number, number];

interface ExplorationState<Value extends ChartDomainValue> {
  readonly window: ChartDomainWindow<Value>;
  readonly full: boolean;
  readonly categories: readonly Value[];
}

export interface ChartExplorationState<Value extends ChartDomainValue> {
  readonly window: ChartDomainWindow<Value>;
  readonly normalized: Range;
  readonly full: ChartDomainWindow<Value>;
  readonly minimumSpan: number;
  readonly scale: ChartScale<Value>;
  readonly contains: (value: Value) => boolean;
  readonly position: (value: Value) => number;
  readonly fromNormalized: (range: Range) => ChartDomainWindow<Value>;
  readonly change: (range: Range, phase: 'change' | 'end' | 'cancel') => void;
}

function clamp(value: number, low: number, high: number): number {
  return Math.max(low, Math.min(high, value));
}

function bounded(range: Range, minimum: number): Range {
  const span = clamp(range[1] - range[0], minimum, 1);
  const start = clamp((range[0] + range[1] - span) / 2, 0, 1 - span);
  return [start, start + span];
}

function key(value: ChartDomainValue): string {
  return value instanceof Date ? `date:${+value}` : `${typeof value}:${value}`;
}

function validValue(value: ChartDomainValue): boolean {
  return (
    typeof value === 'string' ||
    (typeof value === 'number' && Number.isFinite(value)) ||
    (value instanceof Date && Number.isFinite(+value))
  );
}

function validateConfig<Value extends ChartDomainValue>(config: ChartExploration<Value>): void {
  if (config.window !== undefined && config.defaultWindow !== undefined) {
    throw new TypeError('Chart exploration cannot use window and defaultWindow together.');
  }
  if (config.window !== undefined && typeof config.onWindowChange !== 'function') {
    throw new TypeError('Controlled chart exploration window requires onWindowChange.');
  }
  if (
    config.minimumSpan !== undefined &&
    (!Number.isFinite(config.minimumSpan) || config.minimumSpan <= 0 || config.minimumSpan > 1)
  ) {
    throw new RangeError(
      'Chart exploration minimumSpan must be greater than zero and at most one.',
    );
  }
  const names = [
    'overview',
    'closeOverview',
    'done',
    'reset',
    'zoomIn',
    'zoomOut',
    'panBackward',
    'panForward',
    'window',
    'start',
    'end',
    'instructions',
  ] as const;
  for (const name of names) {
    if (typeof config.labels?.[name] !== 'string' || !config.labels[name].trim()) {
      throw new TypeError(`Chart exploration labels.${name} must be a nonblank string.`);
    }
  }
  if (typeof config.labels.range !== 'function')
    throw new TypeError('Chart exploration labels.range must be a function.');
}

/** Store domain values so data updates do not move a zoomed viewport proportionally. */
export function useChartExploration<Value extends ChartDomainValue>(
  config: ChartExploration<Value> | undefined,
  scale: ChartScale<Value>,
  values: readonly Value[],
): ChartExplorationState<Value> {
  if (config) validateConfig(config);
  const categorical = scale.type === 'categorical';
  const time = scale.type === 'time';
  const logarithmic = scale.type === 'logarithmic';
  const categories = categorical
    ? [
        ...new Map(
          (scale.domain ?? values).filter(validValue).map((value) => [key(value), value]),
        ).values(),
      ]
    : [];
  const categoryIndex = new Map(categories.map((value, index) => [key(value), index]));
  const count = categories.length;
  const numericValue = (value: Value): number =>
    time ? (value instanceof Date ? +value : NaN) : typeof value === 'number' ? value : NaN;
  const numericValues = values
    .map(numericValue)
    .filter((value) => Number.isFinite(value) && (!logarithmic || value > 0));
  const explicit = scale.type !== 'normalized' && !categorical ? scale.domain : undefined;
  let lower =
    explicit?.[0] === undefined
      ? numericValues.reduce((low, value) => Math.min(low, value), Infinity)
      : +explicit[0];
  let upper =
    explicit?.[1] === undefined
      ? numericValues.reduce((high, value) => Math.max(high, value), -Infinity)
      : +explicit[1];
  if (scale.type === 'normalized') {
    lower = 0;
    upper = 1;
  }
  if (
    !Number.isFinite(lower) ||
    !Number.isFinite(upper) ||
    lower > upper ||
    (logarithmic && lower <= 0)
  ) {
    lower = logarithmic ? 1 : 0;
    upper = logarithmic ? 10 : 1;
  }
  if (lower === upper) {
    const padding = time ? 1 : Math.max(Math.abs(lower) * 0.05, 1);
    lower = logarithmic ? lower / 2 : lower - padding;
    upper = logarithmic ? upper * 2 : upper + padding;
  }
  const requestedMinimum = config?.minimumSpan ?? 0.01;
  const minimumSpan = categorical
    ? Math.max(1, Math.ceil(requestedMinimum * count)) / Math.max(1, count)
    : Math.max(requestedMinimum, time ? Math.min(1, 1 / (upper - lower)) : 0);
  const inverse = (value: number): Value => (time ? new Date(value) : value) as Value;
  const full: ChartDomainWindow<Value> = categorical
    ? [categories[0] ?? ('' as Value), categories[count - 1] ?? ('' as Value)]
    : [inverse(lower), inverse(upper)];
  const transformedLower = logarithmic ? Math.log(lower) : lower;
  const transformedUpper = logarithmic ? Math.log(upper) : upper;
  const transform = (value: Value): number => {
    const number = numericValue(value);
    return (
      ((logarithmic ? Math.log(number) : number) - transformedLower) /
      (transformedUpper - transformedLower)
    );
  };
  const position = (value: Value): number =>
    categorical
      ? categoryIndex.has(key(value))
        ? (categoryIndex.get(key(value))! + 0.5) / count
        : NaN
      : transform(value);

  function fromNormalized(range: Range): ChartDomainWindow<Value> {
    const [start, end] = bounded(range, minimumSpan);
    if (categorical) {
      if (!count) return full;
      const slots = clamp(
        Math.round((end - start) * count),
        Math.ceil(minimumSpan * count - 1e-10),
        count,
      );
      const first = clamp(Math.round(start * count), 0, count - slots);
      return [categories[first]!, categories[first + slots - 1]!];
    }
    const fromPosition = (point: number): Value => {
      if (point === 0) return full[0];
      if (point === 1) return full[1];
      const value = transformedLower + point * (transformedUpper - transformedLower);
      return inverse(logarithmic ? Math.exp(value) : value);
    };
    return [fromPosition(start), fromPosition(end)];
  }

  function toNormalized(window: ChartDomainWindow<Value>, strict: boolean): Range {
    if (strict && (!Array.isArray(window) || window.length !== 2 || !window.every(validValue))) {
      throw new TypeError('Chart exploration window must contain two finite domain values.');
    }
    if (categorical) {
      if (!count) return [0, 1];
      const start = categoryIndex.get(key(window[0]));
      const end = categoryIndex.get(key(window[1]));
      if (strict && (start === undefined || end === undefined || start > end)) {
        throw new RangeError(
          'Chart exploration window must use ordered values from the categorical domain.',
        );
      }
      return bounded([(start ?? 0) / count, ((end ?? count - 1) + 1) / count], minimumSpan);
    }
    const start = transform(window[0]);
    const end = transform(window[1]);
    if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end) {
      if (strict)
        throw new RangeError(
          'Chart exploration window must contain ascending finite values matching the scale type.',
        );
      return [0, 1];
    }
    return bounded([start, end], minimumSpan);
  }

  const [stored, setStored] = useState<ExplorationState<Value>>(() => {
    const normalized = config?.defaultWindow
      ? toNormalized(config.defaultWindow, true)
      : ([0, 1] as const);
    return {
      // Loading charts have no source bounds yet. Keep the caller's domain values
      // until data arrives instead of replacing them with the fallback extent.
      window: config?.defaultWindow ?? fromNormalized(normalized),
      full:
        config?.defaultWindow === undefined ||
        ((categorical ? count > 0 : explicit !== undefined || numericValues.length > 0) &&
          normalized[0] === 0 &&
          normalized[1] === 1),
      categories,
    };
  });

  function retainedWindow(): ChartDomainWindow<Value> {
    if (!categorical || !count || !stored.categories.length) return stored.window;
    const oldStart = stored.categories.findIndex((value) => key(value) === key(stored.window[0]));
    const oldEnd = stored.categories.findIndex((value) => key(value) === key(stored.window[1]));
    const surviving = stored.categories
      .slice(Math.max(0, oldStart), oldEnd + 1)
      .filter((value) => categoryIndex.has(key(value)))
      .sort((a, b) => categoryIndex.get(key(a))! - categoryIndex.get(key(b))!);
    if (surviving.length) return [surviving[0]!, surviving[surviving.length - 1]!];
    return fromNormalized([
      Math.max(0, oldStart) / stored.categories.length,
      (oldEnd + 1) / stored.categories.length,
    ]);
  }

  const requested =
    config?.window !== undefined
      ? toNormalized(config.window, true)
      : !config || stored.full
        ? ([0, 1] as const)
        : toNormalized(retainedWindow(), false);
  const window = fromNormalized(requested);
  const normalized = toNormalized(window, false);
  if (config) {
    const label = config.labels.range(window);
    if (typeof label !== 'string' || !label.trim())
      throw new TypeError('Chart exploration labels.range must return a nonblank string.');
  }
  const viewportScale = !config
    ? scale
    : categorical
      ? ({
          ...scale,
          domain: categories.slice(
            Math.round(normalized[0] * count),
            Math.round(normalized[1] * count),
          ),
        } as ChartScale<Value>)
      : ({...scale, domain: window} as ChartScale<Value>);

  return {
    window,
    normalized,
    full,
    minimumSpan,
    scale: viewportScale,
    position,
    fromNormalized,
    contains: (value) => {
      const point = position(value);
      return Number.isFinite(point) && point >= normalized[0] && point <= normalized[1];
    },
    change: (range, phase) => {
      if (!config) return;
      const next = fromNormalized(range);
      const normalizedNext = toNormalized(next, false);
      if (config.window === undefined)
        setStored({
          window: next,
          full: normalizedNext[0] === 0 && normalizedNext[1] === 1,
          categories,
        });
      config.onWindowChange?.(next);
      if (phase === 'end') config.onWindowChangeEnd?.(next);
    },
  };
}
