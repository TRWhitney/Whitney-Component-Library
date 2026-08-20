import type {RangeSliderThumbLabels, RangeSliderValue} from './range-types.js';

interface NumericDomain {
  readonly maxValue: number;
  readonly minValue: number;
  readonly step: number;
}

export function assertNumericDomain({maxValue, minValue, step}: NumericDomain): void {
  if (!Number.isFinite(minValue) || !Number.isFinite(maxValue) || !Number.isFinite(step)) {
    throw new TypeError('Slider minValue, maxValue, and step must be finite numbers.');
  }
  if (maxValue <= minValue) {
    throw new RangeError('Slider maxValue must be greater than minValue.');
  }
  if (step <= 0) {
    throw new RangeError('Slider step must be greater than zero.');
  }
  if (!isStepAligned(maxValue, minValue, step)) {
    throw new RangeError(
      'Slider maxValue must be reachable from minValue by whole step increments.',
    );
  }
}

export function assertSliderValue(value: number, domain: NumericDomain): void {
  assertBoundedValue(value, domain, 'Slider value');
}

export function assertRangeSliderThumbLabels(labels: RangeSliderThumbLabels, locale: string): void {
  if (
    labels.length !== 2 ||
    labels.some((label) => typeof label !== 'string' || label.trim().length === 0)
  ) {
    throw new TypeError('RangeSlider thumbLabels must contain exactly two non-empty strings.');
  }
  const startLabel = normalizeLabel(labels[0]);
  const endLabel = normalizeLabel(labels[1]);
  const collator = new Intl.Collator(locale, {sensitivity: 'accent', usage: 'search'});
  if (collator.compare(startLabel, endLabel) === 0) {
    throw new RangeError('RangeSlider thumbLabels must give each thumb a distinct name.');
  }
}

function normalizeLabel(label: string): string {
  return label.trim().replace(/\s+/g, ' ');
}

export function assertRangeSliderValue(value: RangeSliderValue, domain: NumericDomain): void {
  if (value.length !== 2) {
    throw new TypeError('RangeSlider value must contain exactly two numeric bounds.');
  }
  const [start, end] = value;
  assertBoundedValue(start, domain, 'RangeSlider start value');
  assertBoundedValue(end, domain, 'RangeSlider end value');
  if (start > end) {
    throw new RangeError('RangeSlider values must remain in ascending order.');
  }
}

function assertBoundedValue(value: number, domain: NumericDomain, name: string): void {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number.`);
  }
  if (value < domain.minValue || value > domain.maxValue) {
    throw new RangeError(`${name} must be between minValue and maxValue.`);
  }
  if (!isStepAligned(value, domain.minValue, domain.step)) {
    throw new RangeError(`${name} must align to step increments from minValue.`);
  }
}

function isStepAligned(value: number, minValue: number, step: number): boolean {
  const increments = (value - minValue) / step;
  const tolerance = Number.EPSILON * Math.max(16, Math.abs(increments) * 16);
  return Math.abs(increments - Math.round(increments)) <= tolerance;
}
