import {cleanup, render, screen} from '@testing-library/react';
import {afterEach, expect, it} from 'vitest';
import {
  AppearanceProvider,
  ComboBox,
  Field,
  FieldGroup,
  NumberField,
  SearchField,
  Select,
  TextArea,
  TextField,
} from '../src/index.js';
afterEach(cleanup);
it('exposes an inherited compact application density', () => {
  const {container} = render(
    <AppearanceProvider appearance="dark" accent="#538dff" density="compact">
      <Select label="Campus" options={[{value: 'a', label: 'A'}]} emptyMessage="None" />
    </AppearanceProvider>,
  );
  expect(container.firstElementChild?.getAttribute('data-wcl-density')).toBe('compact');
});
it('lets forms explicitly reserve support space', () => {
  const {container} = render(
    <>
      <Field label="Name" reserveSupportSpace>
        {(props) => <input {...props} />}
      </Field>
      <Select label="Campus" reserveSupportSpace options={[]} emptyMessage="None" />
    </>,
  );
  expect(container.querySelectorAll('[data-wcl-field][data-reserve-support]')).toHaveLength(2);
});

it('supports reservation consistently across field and selection controls', () => {
  const {container} = render(
    <FieldGroup legend="Building details">
      <TextField label="Name" reserveSupportSpace />
      <TextArea label="Notes" reserveSupportSpace />
      <NumberField label="Floor area" locale="en" reserveSupportSpace />
      <SearchField label="Find" clearLabel="Clear search" reserveSupportSpace />
      <ComboBox label="Use" options={[]} emptyMessage="None" reserveSupportSpace />
    </FieldGroup>,
  );
  expect(container.querySelectorAll('[data-wcl-field][data-reserve-support]')).toHaveLength(5);
});

it('keeps real support content and accessible associations without reserving empty rows', () => {
  const {container, rerender} = render(
    <Select
      label="Campus"
      options={[]}
      emptyMessage="None"
      description="Choose the building campus."
    />,
  );
  expect(container.querySelector('[data-reserve-support]')).toBeNull();
  const control = screen.getByRole('button', {name: /Campus/});
  expect(
    control
      .getAttribute('aria-describedby')
      ?.split(' ')
      .map((id) => document.getElementById(id)?.textContent)
      .join(' '),
  ).toContain('Choose the building campus.');
  rerender(
    <Select
      label="Campus"
      options={[]}
      emptyMessage="None"
      description="Choose the building campus."
      isInvalid
      errorMessage="Select an available campus."
    />,
  );
  expect(screen.getByText('Select an available campus.')).toBeTruthy();
  expect(
    screen
      .getByRole('button', {name: /Campus/})
      .getAttribute('aria-describedby')
      ?.split(' ')
      .map((id) => document.getElementById(id)?.textContent)
      .join(' '),
  ).toContain('Select an available campus.');
  rerender(
    <Select
      label="Campus"
      options={[]}
      emptyMessage="None"
      isLoading
      loadingMessage="Loading campuses."
    />,
  );
  expect(screen.getByRole('status').textContent).toBe('Loading campuses.');
});
