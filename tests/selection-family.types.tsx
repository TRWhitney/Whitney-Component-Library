import {ComboBox, Select} from '../src/index.js';

const options = [
  {label: 'Conservative', value: 'conservative'},
  {description: 'Balances speed and precision.', label: 'Balanced', value: 'balanced'},
] as const;

declare const isLoading: boolean;

export const selections = (
  <>
    <Select defaultValue="balanced" emptyMessage="No modes" label="Run mode" options={options} />
    <Select
      emptyMessage="No modes"
      label="Optional mode"
      onChange={() => undefined}
      options={options}
      value={null}
    />
    <ComboBox defaultValue="balanced" emptyMessage="No modes" label="Run mode" options={options} />
    <ComboBox
      filterBehavior="manual"
      emptyMessage="No modes"
      inputValue="bal"
      label="Search modes"
      onInputChange={() => undefined}
      options={options}
    />
    <ComboBox
      emptyMessage="No remote modes"
      filterBehavior="manual"
      isLoading={isLoading}
      label="Remote mode"
      loadingMessage="Loading remote modes"
      options={options}
    />
  </>
);

export const inertSelect = (
  // @ts-expect-error Controlled Select ownership requires an onChange callback.
  <Select emptyMessage="No modes" label="Run mode" options={options} value="balanced" />
);

export const ambiguousSelect = Select({
  defaultValue: 'balanced',
  emptyMessage: 'No modes',
  label: 'Run mode',
  onChange: () => undefined,
  options,
  // @ts-expect-error Controlled and uncontrolled selection ownership cannot be combined.
  value: 'balanced',
});

export const unknownSelectValue = Select({
  emptyMessage: 'No modes',
  label: 'Run mode',
  onChange: () => undefined,
  options,
  // @ts-expect-error Select values must belong to the supplied finite option set.
  value: 'experimental',
});

export const inertComboBoxInput = (
  // @ts-expect-error Controlled ComboBox input ownership requires an onInputChange callback.
  <ComboBox emptyMessage="No modes" inputValue="bal" label="Mode" options={options} />
);

// @ts-expect-error Controlled and uncontrolled ComboBox input ownership cannot be combined.
export const ambiguousComboBoxInput = ComboBox({
  defaultInputValue: 'bal',
  emptyMessage: 'No modes',
  inputValue: 'bal',
  label: 'Mode',
  onInputChange: () => undefined,
  options,
});

export const silentLoading = (
  // @ts-expect-error Loading copy is required whenever a collection can be loading.
  <Select emptyMessage="No modes" isLoading label="Run mode" options={[]} />
);

export const styledSelect = (
  // @ts-expect-error Selection controls do not accept consumer class injection.
  <Select className="select" emptyMessage="No modes" label="Run mode" options={options} />
);
