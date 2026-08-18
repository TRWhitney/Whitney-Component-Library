import {Checkbox, CheckboxGroup, RadioGroup, SegmentedControl, Switch} from '../src/index.js';

const options = [
  {label: 'Conservative', value: 'conservative'},
  {label: 'Balanced', value: 'balanced'},
] as const;

const describedOptions = [
  {description: 'Balances speed and precision.', label: 'Balanced', value: 'balanced'},
  {label: 'Compact', value: 'compact'},
] as const;

export const choices = (
  <>
    <Checkbox label="Include mesh" onChange={() => undefined} isSelected />
    <CheckboxGroup
      label="Layers"
      options={options}
      onChange={() => undefined}
      value={['balanced']}
    />
    <RadioGroup label="Mode" options={options} onChange={() => undefined} value="balanced" />
    <RadioGroup label="Optional mode" options={options} onChange={() => undefined} value={null} />
    <Switch label="Pin result" defaultSelected />
    <SegmentedControl label="Density" options={options} defaultValue="balanced" />
  </>
);

// @ts-expect-error Controlled checkbox ownership requires an onChange callback.
export const inertCheckbox = <Checkbox isSelected label="Include mesh" />;

// @ts-expect-error Controlled and uncontrolled checkbox ownership cannot be combined.
export const ambiguousCheckbox = Checkbox({
  defaultSelected: true,
  isSelected: true,
  label: 'Include mesh',
  onChange: () => undefined,
});

// @ts-expect-error Controlled checkbox-group ownership requires an onChange callback.
export const inertCheckboxGroup = <CheckboxGroup label="Layers" options={options} value={[]} />;

// @ts-expect-error Controlled radio-group ownership requires an onChange callback.
export const inertRadioGroup = <RadioGroup label="Mode" options={options} value="balanced" />;

// @ts-expect-error Choice options require stable submitted values.
export const missingOptionValue = <RadioGroup label="Mode" options={[{label: 'Balanced'}]} />;

export const unknownRadioValue = RadioGroup({
  label: 'Mode',
  onChange: () => undefined,
  options,
  // @ts-expect-error Exclusive values must belong to the supplied finite option set.
  value: 'experimental',
});

export const unknownCheckboxValue = CheckboxGroup({
  // @ts-expect-error Multiple values must belong to the supplied finite option set.
  defaultValue: ['experimental'],
  label: 'Layers',
  options,
});

export const describedSegment = SegmentedControl({
  label: 'Density',
  options: [
    // @ts-expect-error Segments deliberately accept labels, values, and disabled state only.
    {description: 'Too much copy for a segment.', label: 'Balanced', value: 'balanced'},
    {label: 'Compact', value: 'compact'},
  ],
});

export const describedSegments = (
  // @ts-expect-error Reusable segment options cannot carry silently ignored descriptions.
  <SegmentedControl label="Density" options={describedOptions} />
);

export const oneSegment = SegmentedControl({
  label: 'Density',
  // @ts-expect-error Segmented controls require at least two bounded options.
  options: [{label: 'Balanced', value: 'balanced'}],
});

// @ts-expect-error Choice controls do not accept consumer class injection.
export const styledSwitch = <Switch className="toggle" label="Pin result" />;
