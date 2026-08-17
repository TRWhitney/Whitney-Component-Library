import {
  Field,
  FieldGroup,
  FormSection,
  NumberField,
  SearchField,
  TextArea,
  TextField,
} from '../src/index.js';

export const fields = (
  <FormSection title="Profile input">
    <FieldGroup columns="responsive" legend="Solver">
      <TextField label="Name" onChange={() => undefined} value="North chamber" />
      <TextArea defaultValue="Initial notes" label="Notes" rows={5} />
      <NumberField
        defaultValue={0.0025}
        formatOptions={{maximumFractionDigits: 4}}
        label="Tolerance"
        locale="en-US"
        minValue={0}
        step={0.0005}
      />
      <SearchField clearLabel="Clear query" label="Search runs" />
    </FieldGroup>
  </FormSection>
);

export const customField = (
  <Field label="Workspace">
    {(controlProps) => <input {...controlProps} defaultValue="thermal" />}
  </Field>
);

// @ts-expect-error Controlled text ownership requires an onChange callback.
export const inertControlledText = <TextField label="Name" value="Fixed" />;

// @ts-expect-error Controlled and uncontrolled text ownership cannot be combined.
export const ambiguousTextOwnership = TextField({
  defaultValue: 'Draft',
  label: 'Name',
  value: 'Final',
  onChange: () => undefined,
});

// @ts-expect-error Pending fields require localized pending status text.
export const undescribedPending = <TextField isPending label="Name" />;

// @ts-expect-error Number fields require an explicit deterministic locale.
export const implicitNumberLocale = <NumberField label="Tolerance" />;

// @ts-expect-error Search fields require a localized accessible clear-command label.
export const unnamedClear = <SearchField label="Search" />;

// @ts-expect-error Multiline row counts are bounded to library-owned sizes.
export const arbitraryRows = <TextArea label="Notes" rows={12} />;

// @ts-expect-error Field groups expose bounded layouts rather than arbitrary column counts.
export const arbitraryColumns = <FieldGroup columns={4} legend="Inputs" />;

// @ts-expect-error Public fields do not accept consumer class injection.
export const styledField = <TextField className="input" label="Name" />;
