import {act, cleanup, fireEvent, render, waitFor} from '@testing-library/react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {Component, useState, type ReactNode} from 'react';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {
  AppearanceProvider,
  Field,
  FieldGroup,
  FormSection,
  NumberField,
  SearchField,
  TextArea,
  TextField,
  type FieldControlProps,
} from '../src/index.js';

afterEach(cleanup);

function Fields({children}: {readonly children: React.ReactNode}) {
  return (
    <AppearanceProvider accent="#2878ff" appearance="dark">
      {children}
    </AppearanceProvider>
  );
}

class TestErrorBoundary extends Component<
  {readonly children: ReactNode},
  {readonly error: Error | null}
> {
  override state: {readonly error: Error | null} = {error: null};

  static getDerivedStateFromError(error: Error) {
    return {error};
  }

  override render() {
    return this.state.error ? (
      <div role="alert">{this.state.error.message}</div>
    ) : (
      this.props.children
    );
  }
}

describe('field and text-entry family', () => {
  it('connects each visible label, description, requirement, and error to its control', () => {
    const {getByRole, getByText} = render(
      <Fields>
        <TextField
          description="Used in exported reports."
          errorMessage="A run name is required."
          isInvalid
          isRequired
          label="Run name"
        />
      </Fields>,
    );
    const input = getByRole('textbox', {name: 'Run name'}) as HTMLInputElement;
    const description = getByText('Used in exported reports.');
    const error = getByText('A run name is required.');

    expect(input.getAttribute('aria-describedby')?.split(' ')).toContain(description.id);
    expect(input.getAttribute('aria-describedby')?.split(' ')).toContain(error.id);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.required).toBe(true);
    expect(getByText('*').getAttribute('aria-hidden')).toBe('true');
  });

  it('keeps text, multiline, numeric, and search entry semantics distinct', () => {
    const {getByRole} = render(
      <Fields>
        <TextField inputType="email" label="Contact email" />
        <TextArea label="Notes" rows={5} />
        <NumberField label="Tolerance" locale="en-US" />
        <SearchField clearLabel="Clear query" label="Search runs" />
      </Fields>,
    );

    expect(getByRole('textbox', {name: 'Contact email'})).toMatchObject({type: 'email'});
    expect(getByRole('textbox', {name: 'Notes'}).tagName).toBe('TEXTAREA');
    expect(getByRole('textbox', {name: 'Notes'}).getAttribute('rows')).toBe('5');
    expect(getByRole('searchbox', {name: 'Search runs'})).toMatchObject({type: 'search'});
    expect(getByRole('textbox', {name: 'Tolerance'}).getAttribute('aria-roledescription')).toBe(
      'Number field',
    );
  });

  it('keeps custom fields accessible through a narrow generated control-prop seam', () => {
    const {getByRole, getByText} = render(
      <Fields>
        <Field
          description="Use the team identifier."
          errorMessage="The identifier is unavailable."
          isInvalid
          isRequired
          label="Workspace identifier"
        >
          {(controlProps) => <input {...controlProps} defaultValue="thermal-team" />}
        </Field>
      </Fields>,
    );
    const input = getByRole('textbox', {name: 'Workspace identifier'}) as HTMLInputElement;

    expect(input.getAttribute('aria-describedby')?.split(' ')).toEqual(
      expect.arrayContaining([
        getByText('Use the team identifier.').id,
        getByText('The identifier is unavailable.').id,
      ]),
    );
    expect(input.required).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('communicates custom-control states and disables a grouped custom control', () => {
    const onActivate = vi.fn();
    const {getByRole} = render(
      <Fields>
        <Field isReadOnly label="Read-only custom value">
          {(controlProps) => <div {...controlProps} role="textbox" tabIndex={0} />}
        </Field>
        <FieldGroup isDisabled legend="Unavailable inputs">
          <Field label="Custom value">
            {(controlProps) => (
              <div onClick={onActivate} role="button" {...controlProps}>
                Change value
              </div>
            )}
          </Field>
          <TextField label="Native value" />
        </FieldGroup>
      </Fields>,
    );
    const readOnly = getByRole('textbox', {name: 'Read-only custom value'});
    const group = getByRole('group', {name: 'Unavailable inputs'});
    const custom = getByRole('button', {name: 'Custom value'});
    const native = getByRole('textbox', {name: 'Native value'}) as HTMLInputElement;

    expect(readOnly.getAttribute('aria-readonly')).toBe('true');
    expect(group.getAttribute('aria-disabled')).toBe('true');
    expect(custom.getAttribute('aria-disabled')).toBe('true');
    expect(custom.getAttribute('tabindex')).toBe('-1');
    expect(native.disabled).toBe(true);
    fireEvent.click(custom);
    expect(onActivate).not.toHaveBeenCalled();
  });

  it('lets traversal keys leave a custom control that became disabled', () => {
    const onKeyDown = vi.fn();
    const {getByRole} = render(
      <Fields>
        <div onKeyDown={onKeyDown}>
          <Field isDisabled label="Disabled custom value">
            {(controlProps) => (
              <div role="button" {...controlProps}>
                Change value
              </div>
            )}
          </Field>
        </div>
      </Fields>,
    );
    const control = getByRole('button', {name: 'Disabled custom value'});

    act(() => control.focus());
    expect(fireEvent.keyDown(control, {key: 'Tab'})).toBe(true);
    expect(fireEvent.keyDown(control, {key: 'Escape'})).toBe(true);
    expect(onKeyDown).toHaveBeenCalledTimes(2);
    expect(fireEvent.keyDown(control, {key: 'Enter'})).toBe(false);
  });

  it('rejects a custom Field wrapper that breaks the single-control relationship', async () => {
    const {findByRole} = render(
      <Fields>
        <TestErrorBoundary>
          <Field label="Wrapped value">
            {(controlProps) => (
              <div>
                <input {...controlProps} />
              </div>
            )}
          </Field>
        </TestErrorBoundary>
      </Fields>,
    );

    expect((await findByRole('alert')).textContent).toMatch(
      /Field must render exactly one direct accessible control/i,
    );
  });

  it('rejects a custom Field that drops generated relationships and states', async () => {
    const {findByRole} = render(
      <Fields>
        <TestErrorBoundary>
          <Field
            description="Explain the value."
            errorMessage="Correct the value."
            isDisabled
            isInvalid
            isPending
            isRequired
            label="Incomplete value"
            pendingMessage="Checking value."
          >
            {({id}) => <div id={id} role="textbox" />}
          </Field>
        </TestErrorBoundary>
      </Fields>,
    );

    expect((await findByRole('alert')).textContent).toMatch(/spread every supplied control prop/i);
  });

  it('rejects a non-control role from the custom Field seam', async () => {
    const {findByRole} = render(
      <Fields>
        <TestErrorBoundary>
          <Field label="Static heading">
            {(controlProps) => <div {...controlProps} role="heading" />}
          </Field>
        </TestErrorBoundary>
      </Fields>,
    );

    expect((await findByRole('alert')).textContent).toMatch(
      /exactly one direct accessible control/i,
    );
  });

  it('rejects a hidden input even when it claims an accepted control role', async () => {
    const {findByRole} = render(
      <Fields>
        <TestErrorBoundary>
          <Field label="Hidden value">
            {(controlProps) => <input {...controlProps} role="textbox" type="hidden" />}
          </Field>
        </TestErrorBoundary>
      </Fields>,
    );

    expect((await findByRole('alert')).textContent).toMatch(/direct accessible control/i);
  });

  it('rejects direct controls removed from the accessibility tree', async () => {
    const {findAllByRole} = render(
      <Fields>
        <TestErrorBoundary>
          <Field label="Hidden attribute value">
            {(controlProps) => <input {...controlProps} hidden />}
          </Field>
        </TestErrorBoundary>
        <TestErrorBoundary>
          <Field label="ARIA-hidden value">
            {(controlProps) => <div {...controlProps} aria-hidden="true" role="textbox" />}
          </Field>
        </TestErrorBoundary>
        <TestErrorBoundary>
          <Field label="Inert value">
            {(controlProps) => <div {...controlProps} inert role="textbox" />}
          </Field>
        </TestErrorBoundary>
      </Fields>,
    );

    const errors = await findAllByRole('alert');
    expect(errors).toHaveLength(3);
    expect(
      errors.every(({textContent}) => textContent?.includes('direct accessible control')),
    ).toBe(true);
  });

  it('rejects consumer-added Field-owned states and relationships', async () => {
    const {findAllByRole} = render(
      <Fields>
        <TestErrorBoundary>
          <Field label="Unexpected state">
            {(controlProps) => <input {...controlProps} aria-invalid="true" required />}
          </Field>
        </TestErrorBoundary>
        <TestErrorBoundary>
          <Field label="Unexpected relationship">
            {(controlProps) => <input {...controlProps} aria-describedby="foreign-description" />}
          </Field>
        </TestErrorBoundary>
      </Fields>,
    );

    const errors = await findAllByRole('alert');
    expect(errors).toHaveLength(2);
    expect(errors.every(({textContent}) => textContent?.includes('spread every supplied'))).toBe(
      true,
    );
  });

  it('revalidates when Field state changes but a custom control retains old props', async () => {
    function RetainedControl({controlProps}: {readonly controlProps: FieldControlProps}) {
      const [initialDisabledState] = useState({
        ariaDisabled: controlProps['aria-disabled'],
        disabled: controlProps.disabled,
        tabIndex: controlProps.tabIndex,
      });
      return (
        <input
          {...controlProps}
          aria-disabled={initialDisabledState.ariaDisabled}
          disabled={initialDisabledState.disabled}
          tabIndex={initialDisabledState.tabIndex}
        />
      );
    }

    function ChangingField() {
      const [disabled, setDisabled] = useState(false);
      return (
        <>
          <button onClick={() => setDisabled(true)}>Disable custom field</button>
          <TestErrorBoundary>
            <Field isDisabled={disabled} label="Retained value">
              {(controlProps) => <RetainedControl controlProps={controlProps} />}
            </Field>
          </TestErrorBoundary>
        </>
      );
    }

    const {findByRole, getByRole, queryByRole} = render(
      <Fields>
        <ChangingField />
      </Fields>,
    );

    expect(queryByRole('alert')).toBeNull();
    expect(getByRole('textbox', {name: 'Retained value'})).toBeTruthy();
    fireEvent.click(getByRole('button', {name: 'Disable custom field'}));
    expect((await findByRole('alert')).textContent).toMatch(/spread every supplied control prop/i);
  });

  it('rejects required and read-only states that the rendered control cannot represent', async () => {
    const {findAllByRole} = render(
      <Fields>
        <TestErrorBoundary>
          <Field isReadOnly label="Read-only command">
            {(controlProps) => <div {...controlProps} role="button" />}
          </Field>
        </TestErrorBoundary>
        <TestErrorBoundary>
          <Field isRequired label="Required slider">
            {(controlProps) => <div {...controlProps} role="slider" />}
          </Field>
        </TestErrorBoundary>
        <TestErrorBoundary>
          <Field isReadOnly label="Read-only selection">
            {(controlProps) => <select {...controlProps} />}
          </Field>
        </TestErrorBoundary>
      </Fields>,
    );

    const errors = await findAllByRole('alert');
    expect(errors).toHaveLength(3);
    expect(errors.map(({textContent}) => textContent)).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/button.*read-only/i),
        expect.stringMatching(/slider.*required/i),
        expect.stringMatching(/select.*read-only/i),
      ]),
    );
  });

  it('rejects explicit role overrides on native controls', async () => {
    const {findAllByRole} = render(
      <Fields>
        <TestErrorBoundary>
          <Field isReadOnly label="Read-only native command">
            {(controlProps) => <button {...controlProps} role="textbox" />}
          </Field>
        </TestErrorBoundary>
        <TestErrorBoundary>
          <Field isRequired label="Custom selection">
            {(controlProps) => <input {...controlProps} aria-expanded="false" role="combobox" />}
          </Field>
        </TestErrorBoundary>
      </Fields>,
    );

    expect(await findAllByRole('alert')).toHaveLength(2);
  });

  it('keeps a valid custom control mounted when generated state is removed', async () => {
    const {getByRole, queryByRole, rerender} = render(
      <Fields>
        <TestErrorBoundary>
          <Field
            description="Checked while constrained."
            isDisabled
            isInvalid
            isReadOnly
            isRequired
            label="Mutable value"
          >
            {(controlProps) => <div {...controlProps} role="textbox" />}
          </Field>
        </TestErrorBoundary>
      </Fields>,
    );

    rerender(
      <Fields>
        <TestErrorBoundary>
          <Field label="Mutable value">
            {(controlProps) => <div {...controlProps} role="textbox" />}
          </Field>
        </TestErrorBoundary>
      </Fields>,
    );

    await waitFor(() => expect(queryByRole('alert')).toBeNull());
    const control = getByRole('textbox', {name: 'Mutable value'});
    expect(control.hasAttribute('aria-disabled')).toBe(false);
    expect(control.hasAttribute('aria-invalid')).toBe(false);
    expect(control.hasAttribute('aria-readonly')).toBe(false);
    expect(control.hasAttribute('aria-required')).toBe(false);
  });

  it('suppresses end-phase activation events on disabled custom controls', () => {
    const onActivate = vi.fn();
    const onBubble = vi.fn();
    const {getByRole} = render(
      <Fields>
        <div onKeyUp={onBubble}>
          <Field isDisabled label="Disabled end-phase control">
            {(controlProps) => (
              <div
                {...controlProps}
                onKeyUp={onActivate}
                onMouseUp={onActivate}
                onPointerUp={onActivate}
                onTouchEnd={onActivate}
                role="button"
              />
            )}
          </Field>
        </div>
      </Fields>,
    );
    const control = getByRole('button', {name: 'Disabled end-phase control'});

    expect(fireEvent.pointerUp(control)).toBe(false);
    expect(fireEvent.mouseUp(control)).toBe(false);
    expect(fireEvent.touchEnd(control)).toBe(false);
    expect(fireEvent.keyUp(control, {key: ' '})).toBe(false);
    expect(fireEvent.keyUp(control, {key: 'Enter'})).toBe(false);
    expect(onActivate).not.toHaveBeenCalled();
    expect(fireEvent.keyUp(control, {key: 'Escape'})).toBe(true);
    expect(onBubble).toHaveBeenCalledOnce();
  });

  it('owns locale formatting, bounded stepping, and invalid intermediate number text', () => {
    const onChange = vi.fn();
    const formatted = new Intl.NumberFormat('de-DE', {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    }).format(1234.5);
    const {getAllByRole, getByRole} = render(
      <Fields>
        <NumberField
          commitBehavior="validate"
          defaultValue={1234.5}
          formatOptions={{maximumFractionDigits: 1, minimumFractionDigits: 1}}
          label="Tolerance"
          locale="de-DE"
          maxValue={1235}
          minValue={1234}
          onChange={onChange}
          step={0.5}
        />
      </Fields>,
    );
    const input = getByRole('textbox', {name: 'Tolerance'}) as HTMLInputElement;

    expect(input.value).toBe(formatted);
    fireEvent.change(input, {target: {value: ''}});
    expect(input.value).toBe('');
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.change(input, {target: {value: formatted}});
    fireEvent.blur(input);
    onChange.mockClear();
    const stepButtons = getAllByRole('button');
    fireEvent.click(stepButtons[1]!);
    expect(onChange).toHaveBeenLastCalledWith(1235);
  });

  it('does not round away step precision when plain decimal formatting is implicit', () => {
    const {getByRole} = render(
      <Fields>
        <NumberField defaultValue={0.0025} label="Tolerance" locale="en-US" step={0.0005} />
      </Fields>,
    );

    expect((getByRole('textbox', {name: 'Tolerance'}) as HTMLInputElement).value).toBe('0.0025');
  });

  it('does not round a finite tiny decimal to zero when formatting is implicit', () => {
    const {getByRole} = render(
      <Fields>
        <NumberField defaultValue={1e-21} label="Tiny tolerance" locale="en-US" step={1e-21} />
      </Fields>,
    );

    expect((getByRole('textbox', {name: 'Tiny tolerance'}) as HTMLInputElement).value).toBe(
      '0.000000000000000000001',
    );
  });

  it('steps a focused number field with the wheel only when wheel input is enabled', () => {
    const {getByRole} = render(
      <Fields>
        <NumberField
          defaultValue={2}
          isWheelDisabled={false}
          label="Iterations"
          locale="en-US"
          step={1}
        />
      </Fields>,
    );
    const input = getByRole('textbox', {name: 'Iterations'}) as HTMLInputElement;
    const group = input.closest('[data-wcl-number-control]');
    if (!group) throw new Error('Expected a NumberField control group.');

    act(() => input.focus());
    expect(group.hasAttribute('data-focus-within')).toBe(true);
    fireEvent.wheel(input, {deltaX: 0, deltaY: -1});

    expect(input.value).toBe('1');
  });

  it('supports controlled ownership, uncontrolled reset, and a native search clear command', () => {
    function ControlledText() {
      const [value, setValue] = useState('North chamber');
      return <TextField label="Chamber" onChange={setValue} value={value} />;
    }

    const {getByRole} = render(
      <Fields>
        <form>
          <ControlledText />
          <TextField defaultValue="Draft run" label="Run name" name="run-name" />
          <SearchField
            clearLabel="Clear query"
            defaultValue="thermal"
            label="Search runs"
            name="query"
          />
          <button type="reset">Reset form</button>
        </form>
      </Fields>,
    );
    const chamber = getByRole('textbox', {name: 'Chamber'}) as HTMLInputElement;
    const runName = getByRole('textbox', {name: 'Run name'}) as HTMLInputElement;
    const search = getByRole('searchbox', {name: 'Search runs'}) as HTMLInputElement;

    fireEvent.change(chamber, {target: {value: 'South chamber'}});
    expect(chamber.value).toBe('South chamber');
    fireEvent.change(runName, {target: {value: 'Final run'}});
    fireEvent.click(getByRole('button', {name: 'Clear query'}));
    expect(search.value).toBe('');
    fireEvent.click(getByRole('button', {name: 'Reset form'}));
    expect(runName.value).toBe('Draft run');
    expect(search.value).toBe('thermal');
  });

  it('omits the clear command when a nonempty search field cannot be edited', () => {
    const {queryByRole} = render(
      <Fields>
        <SearchField
          clearLabel="Clear query"
          defaultValue="thermal"
          isDisabled
          label="Search runs"
        />
      </Fields>,
    );

    expect(queryByRole('button', {name: 'Clear query'})).toBeNull();
  });

  it('resets an externally associated number field and submits its raw numeric value once', () => {
    const {container, getByRole} = render(
      <Fields>
        <form id="solver-form" />
        <NumberField
          defaultValue={2.5}
          form="solver-form"
          formatOptions={{style: 'percent'}}
          label="Tolerance"
          locale="en-US"
          name="tolerance"
        />
        <button form="solver-form" type="reset">
          Reset solver
        </button>
      </Fields>,
    );
    const form = container.querySelector('form');
    const input = getByRole('textbox', {name: 'Tolerance'}) as HTMLInputElement;
    if (!form) throw new Error('Expected the externally associated form.');

    fireEvent.change(input, {target: {value: '300%'}});
    fireEvent.blur(input);
    expect(input.value).toBe('300%');
    expect([...new FormData(form).entries()]).toEqual([['tolerance', '3']]);

    fireEvent.click(getByRole('button', {name: 'Reset solver'}));
    expect(input.value).toBe('250%');
    expect(container.querySelectorAll('input[name="tolerance"]')).toHaveLength(1);
  });

  it('keeps read-only, disabled, required, invalid, and pending ownership explicit', () => {
    const {getByRole, getByText} = render(
      <Fields>
        <TextField isDisabled label="Disabled value" />
        <TextField defaultValue="Fixed" isReadOnly label="Read-only value" />
        <TextField isPending label="Pending value" pendingMessage="Checking availability" />
      </Fields>,
    );
    const disabled = getByRole('textbox', {name: 'Disabled value'}) as HTMLInputElement;
    const readOnly = getByRole('textbox', {name: 'Read-only value'}) as HTMLInputElement;
    const pending = getByRole('textbox', {name: 'Pending value'}) as HTMLInputElement;

    expect(disabled.disabled).toBe(true);
    expect(readOnly.readOnly).toBe(true);
    expect(pending.readOnly).toBe(true);
    expect(pending.getAttribute('aria-busy')).toBe('true');
    expect(getByText('Checking availability').getAttribute('role')).toBe('status');
  });

  it('uses native grouped-field semantics and a separately named form section', () => {
    const {getByRole} = render(
      <Fields>
        <FormSection description="Configure the solver input." title="Solver setup">
          <FieldGroup
            columns="responsive"
            description="These values are evaluated together."
            legend="Boundary inputs"
          >
            <TextField label="Solver" />
            <NumberField label="Tolerance" locale="en-US" />
          </FieldGroup>
        </FormSection>
      </Fields>,
    );

    expect(getByRole('region', {name: 'Solver setup'})).toBeTruthy();
    const group = getByRole('group', {name: 'Boundary inputs'});
    expect(group.tagName).toBe('FIELDSET');
    expect(group.getAttribute('aria-describedby')).toBeTruthy();
    expect(group).toMatchObject({dataset: {columns: 'responsive'}});
  });

  it('renders and hydrates deterministic field relationships without warnings', async () => {
    const tree = (
      <Fields>
        <FieldGroup legend="Run inputs">
          <TextField description="Visible to reviewers." label="Run name" />
          <NumberField defaultValue={2.5} label="Tolerance" locale="en-US" step={0.5} />
        </FieldGroup>
      </Fields>
    );
    const html = renderToString(tree);
    const host = document.createElement('div');
    host.innerHTML = html;
    const recoverableErrors: unknown[] = [];
    const root = hydrateRoot(host, tree, {
      onRecoverableError(error) {
        recoverableErrors.push(error);
      },
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(recoverableErrors).toEqual([]);
    act(() => root.unmount());
  });
});
