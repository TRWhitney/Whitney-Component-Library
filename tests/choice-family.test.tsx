import {act, cleanup, fireEvent, render, waitFor, within} from '@testing-library/react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {
  AppearanceProvider,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  SegmentedControl,
  Switch,
} from '../src/index.js';

afterEach(cleanup);

const runModes = [
  {label: 'Conservative', value: 'conservative'},
  {description: 'Balances speed and precision.', label: 'Balanced', value: 'balanced'},
  {isDisabled: true, label: 'Experimental', value: 'experimental'},
] as const;

const segmentModes = [
  {label: 'Conservative', value: 'conservative'},
  {label: 'Balanced', value: 'balanced'},
  {isDisabled: true, label: 'Experimental', value: 'experimental'},
] as const;

describe('choice family', () => {
  it('connects visible labels, descriptions, requirement, and errors to binary choices', () => {
    const {getByRole, getByText} = render(
      <AppearanceProvider accent="#2878ff" appearance="dark">
        <Checkbox
          description="Include unresolved boundary conditions."
          errorMessage="Review is required."
          isInvalid
          isRequired
          label="Review unresolved conditions"
          value="review"
        />
        <Switch
          description="Applies only to this workspace."
          label="Keep results synchronized"
          name="synchronized"
          value="yes"
        />
      </AppearanceProvider>,
    );

    const checkbox = getByRole('checkbox', {name: 'Review unresolved conditions'});
    const switchControl = getByRole('switch', {name: 'Keep results synchronized'});

    expect(checkbox.getAttribute('aria-describedby')?.split(' ')).toEqual(
      expect.arrayContaining([getByText('Review is required.').id]),
    );
    expect(checkbox.getAttribute('aria-invalid')).toBe('true');
    expect(checkbox.getAttribute('aria-required')).toBe('true');
    expect(switchControl.getAttribute('aria-describedby')?.split(' ')).toContain(
      getByText('Applies only to this workspace.').id,
    );
  });

  it('keeps selected, indeterminate, read-only, and disabled checkbox states distinct', () => {
    const onReadOnlyChange = vi.fn();
    const {getByRole} = render(
      <>
        <Checkbox isIndeterminate label="Partially selected" />
        <Checkbox
          defaultSelected
          isReadOnly
          label="Read-only selection"
          onChange={onReadOnlyChange}
        />
        <Checkbox isDisabled label="Unavailable selection" />
      </>,
    );

    const indeterminate = getByRole('checkbox', {name: 'Partially selected'}) as HTMLInputElement;
    const readOnly = getByRole('checkbox', {name: 'Read-only selection'}) as HTMLInputElement;
    const disabled = getByRole('checkbox', {name: 'Unavailable selection'}) as HTMLInputElement;

    expect(indeterminate.indeterminate).toBe(true);
    expect(readOnly.checked).toBe(true);
    fireEvent.click(readOnly);
    expect(readOnly.checked).toBe(true);
    expect(onReadOnlyChange).not.toHaveBeenCalled();
    expect(disabled.disabled).toBe(true);
  });

  it('serializes and resets standalone and grouped native choices deterministically', () => {
    const {getByRole} = render(
      <form data-testid="choice-form">
        <Checkbox defaultSelected label="Include mesh" name="features" value="mesh" />
        <CheckboxGroup
          defaultValue={['thermal']}
          label="Result layers"
          name="layers"
          options={[
            {label: 'Thermal', value: 'thermal'},
            {label: 'Pressure', value: 'pressure'},
          ]}
        />
        <RadioGroup defaultValue="balanced" label="Run mode" name="mode" options={runModes} />
        <Switch defaultSelected label="Pin result" name="pin" value="yes" />
        <SegmentedControl
          defaultValue="balanced"
          label="Display density"
          name="density"
          options={segmentModes}
        />
      </form>,
    );
    const form = getByRole('checkbox', {name: 'Include mesh'}).closest('form')!;
    const radioGroup = getByRole('radiogroup', {name: 'Run mode'});
    const segmentedControl = getByRole('radiogroup', {name: 'Display density'});

    fireEvent.click(getByRole('checkbox', {name: 'Pressure'}));
    fireEvent.click(within(radioGroup).getByRole('radio', {name: 'Conservative'}));
    fireEvent.click(within(segmentedControl).getByRole('radio', {name: 'Conservative'}));
    fireEvent.click(getByRole('switch', {name: 'Pin result'}));

    expect([...new FormData(form).entries()]).toEqual([
      ['features', 'mesh'],
      ['layers', 'thermal'],
      ['layers', 'pressure'],
      ['mode', 'conservative'],
      ['density', 'conservative'],
    ]);

    fireEvent.reset(form);
    expect(getByRole('checkbox', {name: 'Include mesh'})).toMatchObject({checked: true});
    expect(getByRole('checkbox', {name: 'Pressure'})).toMatchObject({checked: false});
    expect(within(radioGroup).getByRole('radio', {name: 'Balanced'})).toMatchObject({
      checked: true,
    });
    expect(within(segmentedControl).getByRole('radio', {name: 'Balanced'})).toMatchObject({
      checked: true,
    });
    expect(getByRole('switch', {name: 'Pin result'})).toMatchObject({checked: true});
  });

  it('associates every choice model with an external form', () => {
    render(
      <>
        <form id="external-choice-form" />
        <Checkbox
          defaultSelected
          form="external-choice-form"
          label="Include mesh"
          name="features"
          value="mesh"
        />
        <CheckboxGroup
          defaultValue={['thermal']}
          form="external-choice-form"
          label="Result layers"
          name="layers"
          options={[
            {label: 'Thermal', value: 'thermal'},
            {label: 'Pressure', value: 'pressure'},
          ]}
        />
        <RadioGroup
          defaultValue="balanced"
          form="external-choice-form"
          label="Run mode"
          name="mode"
          options={segmentModes}
        />
        <Switch
          defaultSelected
          form="external-choice-form"
          label="Pin result"
          name="pin"
          value="yes"
        />
        <SegmentedControl
          defaultValue="balanced"
          form="external-choice-form"
          label="Display density"
          name="density"
          options={segmentModes}
        />
      </>,
    );
    const form = document.getElementById('external-choice-form') as HTMLFormElement;

    expect([...new FormData(form).entries()]).toEqual([
      ['features', 'mesh'],
      ['layers', 'thermal'],
      ['mode', 'balanced'],
      ['pin', 'yes'],
      ['density', 'balanced'],
    ]);
  });

  it('uses native required validation to prevent an empty choice submission', async () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    const {getByRole} = render(
      <form onSubmit={onSubmit}>
        <RadioGroup
          isRequired
          label="Run mode"
          name="mode"
          options={runModes}
          validationBehavior="native"
        />
        <button type="submit">Submit</button>
      </form>,
    );

    fireEvent.click(getByRole('button', {name: 'Submit'}));
    await waitFor(() => expect(onSubmit).not.toHaveBeenCalled());

    fireEvent.click(getByRole('radio', {name: 'Balanced'}));
    fireEvent.click(getByRole('button', {name: 'Submit'}));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
  });

  it('uses native required validation to require one checkbox-group value', async () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    const {getByRole} = render(
      <form onSubmit={onSubmit}>
        <CheckboxGroup
          isRequired
          label="Result layers"
          name="layers"
          options={runModes}
          validationBehavior="native"
        />
        <button type="submit">Submit</button>
      </form>,
    );

    fireEvent.click(getByRole('button', {name: 'Submit'}));
    await waitFor(() => expect(onSubmit).not.toHaveBeenCalled());

    fireEvent.click(getByRole('checkbox', {name: 'Balanced'}));
    fireEvent.click(getByRole('button', {name: 'Submit'}));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
  });

  it('reports controlled choice changes and renders externally accepted state', () => {
    const onCheckboxGroupChange = vi.fn();
    const onRadioChange = vi.fn();
    const {getByRole, rerender} = render(
      <>
        <CheckboxGroup
          label="Layers"
          onChange={onCheckboxGroupChange}
          options={runModes}
          value={['balanced']}
        />
        <RadioGroup label="Mode" onChange={onRadioChange} options={runModes} value={null} />
      </>,
    );

    fireEvent.click(getByRole('checkbox', {name: 'Conservative'}));
    fireEvent.click(getByRole('radio', {name: 'Balanced'}));
    expect(onCheckboxGroupChange).toHaveBeenLastCalledWith(['balanced', 'conservative']);
    expect(onRadioChange).toHaveBeenLastCalledWith('balanced');
    expect(getByRole('radio', {name: 'Balanced'})).toMatchObject({checked: false});

    rerender(
      <>
        <CheckboxGroup
          label="Layers"
          onChange={onCheckboxGroupChange}
          options={runModes}
          value={['balanced', 'conservative']}
        />
        <RadioGroup label="Mode" onChange={onRadioChange} options={runModes} value="balanced" />
      </>,
    );
    expect(getByRole('checkbox', {name: 'Conservative'})).toMatchObject({checked: true});
    expect(getByRole('radio', {name: 'Balanced'})).toMatchObject({checked: true});
  });

  it('reserves one support track before and after validation feedback', () => {
    const {container, rerender} = render(
      <Checkbox
        errorMessage="Review unresolved conditions before continuing."
        label="Review conditions"
      />,
    );
    const support = container.querySelector('[data-wcl-choice-support]');
    const error = container.querySelector('[data-wcl-choice-error]');

    expect(support).not.toBeNull();
    expect(error).not.toBeNull();
    expect(within(container).getByRole('checkbox').getAttribute('aria-describedby')).toBeNull();

    rerender(
      <Checkbox
        errorMessage="Review unresolved conditions before continuing."
        isInvalid
        label="Review conditions"
      />,
    );
    expect(container.querySelector('[data-wcl-choice-support]')).toBe(support);
    expect(container.querySelector('[data-wcl-choice-error]')).toBe(error);
    expect(within(container).getByRole('checkbox').getAttribute('aria-describedby')).toBe(
      error?.id,
    );
  });

  it('keeps multiple, exclusive, and bounded-exclusive models separate', () => {
    const {getAllByRole, getByRole} = render(
      <>
        <CheckboxGroup label="Visible layers" options={runModes} />
        <RadioGroup label="Run mode" options={runModes} />
        <SegmentedControl defaultValue="balanced" label="Display density" options={segmentModes} />
      </>,
    );

    expect(getAllByRole('checkbox')).toHaveLength(3);
    expect(getAllByRole('radio')).toHaveLength(6);
    const segmented = getByRole('radiogroup', {name: 'Display density'});
    expect(segmented.hasAttribute('data-wcl-segmented-control')).toBe(true);
    expect(within(segmented).getByRole('radio', {name: 'Balanced'})).toBeDefined();
  });

  it('moves radio focus and selection with arrow keys without adding group tab stops', () => {
    const {getByRole} = render(
      <RadioGroup defaultValue="conservative" label="Run mode" options={runModes} />,
    );
    const group = getByRole('radiogroup', {name: 'Run mode'});
    const conservative = within(group).getByRole('radio', {name: 'Conservative'});
    const balanced = within(group).getByRole('radio', {name: 'Balanced'});

    conservative.focus();
    fireEvent.keyDown(conservative, {key: 'ArrowDown'});

    expect(document.activeElement).toBe(balanced);
    expect(balanced).toMatchObject({checked: true});
    expect(group.getAttribute('tabindex')).toBeNull();
  });

  it('keeps segmented labels neutral and exposes one group-owned gliding rail position', () => {
    const {getByRole} = render(
      <>
        <SegmentedControl defaultValue="balanced" label="Display density" options={segmentModes} />
        <SegmentedControl label="Unselected density" options={segmentModes} />
      </>,
    );
    const control = getByRole('radiogroup', {name: 'Display density'});
    const unselected = getByRole('radiogroup', {name: 'Unselected density'});

    expect(control.style.getPropertyValue('--wcl-segment-count')).toBe('3');
    expect(control.style.getPropertyValue('--wcl-segment-index')).toBe('1');
    expect(control.style.getPropertyValue('--wcl-segment-selected')).toBe('1');
    expect(unselected.style.getPropertyValue('--wcl-segment-selected')).toBe('0');

    fireEvent.click(within(control).getByRole('radio', {name: 'Conservative'}));

    expect(control.style.getPropertyValue('--wcl-segment-index')).toBe('0');
  });

  it('renders and hydrates every choice model deterministically', async () => {
    const choices = (
      <AppearanceProvider accent="#2878ff" appearance="light">
        <Checkbox defaultSelected label="Include mesh" />
        <CheckboxGroup defaultValue={['balanced']} label="Layers" options={runModes} />
        <RadioGroup defaultValue="balanced" label="Run mode" options={runModes} />
        <Switch defaultSelected label="Pin result" />
        <SegmentedControl defaultValue="balanced" label="Density" options={segmentModes} />
      </AppearanceProvider>
    );
    const serverHtml = renderToString(choices);
    const container = document.createElement('div');
    container.innerHTML = serverHtml;
    const recoverableErrors: unknown[] = [];
    const root = hydrateRoot(container, choices, {
      onRecoverableError(error) {
        recoverableErrors.push(error);
      },
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(container.innerHTML).toContain('data-wcl-segmented-control');
    expect(recoverableErrors).toEqual([]);
    act(() => root.unmount());
  });
});
