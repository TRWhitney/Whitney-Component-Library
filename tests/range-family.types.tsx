import {RangeSlider, Slider} from '../src/index.js';

declare const controlledRange: readonly [number, number];

export const rangeControls = (
  <>
    <Slider
      defaultValue={0.4}
      formatOptions={{style: 'percent'}}
      label="Confidence"
      locale="en-US"
      maxValue={1}
      minValue={0}
      step={0.05}
    />
    <RangeSlider
      label="Review window"
      locale="en-US"
      maxValue={100}
      minValue={0}
      onChange={() => undefined}
      step={5}
      thumbLabels={['Window start', 'Window end']}
      value={controlledRange}
    />
  </>
);

export const inertSlider = (
  // @ts-expect-error Controlled Slider ownership requires an onChange callback.
  <Slider label="Confidence" locale="en-US" maxValue={1} minValue={0} step={0.1} value={0.5} />
);

// @ts-expect-error Controlled and uncontrolled Slider ownership cannot be combined.
export const ambiguousSlider = Slider({
  defaultValue: 0.4,
  label: 'Confidence',
  locale: 'en-US',
  maxValue: 1,
  minValue: 0,
  onChange: () => undefined,
  step: 0.05,
  value: 0.5,
});

export const malformedRange = RangeSlider({
  // @ts-expect-error RangeSlider values contain exactly two numeric bounds.
  defaultValue: [20, 50, 80],
  label: 'Window',
  locale: 'en-US',
  maxValue: 100,
  minValue: 0,
  step: 5,
  thumbLabels: ['Start', 'End'],
});

export const unnamedRangeThumb = RangeSlider({
  defaultValue: [20, 80],
  label: 'Window',
  locale: 'en-US',
  maxValue: 100,
  minValue: 0,
  step: 5,
  // @ts-expect-error RangeSlider requires distinct labels for both thumbs.
  thumbLabels: ['Start'],
});

export const styledSlider = (
  <Slider
    // @ts-expect-error Range controls do not accept consumer class injection.
    className="range"
    label="Confidence"
    locale="en-US"
    maxValue={1}
    minValue={0}
    step={0.1}
  />
);
