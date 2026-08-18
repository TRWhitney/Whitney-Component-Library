import {act, cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {ComboBox, Select} from '../src/index.js';

if (globalThis.CSS === undefined) {
  Object.defineProperty(globalThis, 'CSS', {
    configurable: true,
    value: {escape: (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, '\\$&')},
  });
}

afterEach(cleanup);

const options = [
  {label: 'Conservative', value: 'conservative'},
  {description: 'Balances speed and precision.', label: 'Balanced', value: 'balanced'},
  {isDisabled: true, label: 'Experimental', value: 'experimental'},
] as const;

describe('selection family', () => {
  it('connects Select labels, support text, requirement, and controlled selection', () => {
    const onChange = vi.fn();
    render(
      <Select
        description="Choose one bounded run mode."
        emptyMessage="No modes"
        errorMessage="A mode is required."
        isInvalid
        isRequired
        label="Run mode"
        onChange={onChange}
        options={options}
        value="balanced"
      />,
    );

    const trigger = screen.getByRole('button', {name: /Run mode/i});
    expect(trigger.textContent).toContain('Balanced');
    expect(trigger.getAttribute('aria-describedby')?.split(' ')).toContain(
      screen.getByText('A mode is required.').id,
    );
    expect(trigger.closest('[data-wcl-selection-field]')?.hasAttribute('data-invalid')).toBe(true);
    expect(trigger.closest('[data-wcl-selection-field]')?.hasAttribute('data-required')).toBe(true);

    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('option', {name: /Conservative/i}));
    expect(onChange).toHaveBeenCalledWith('conservative');
  });

  it('filters ComboBox options and accepts keyboard selection', () => {
    const onChange = vi.fn();
    render(
      <ComboBox emptyMessage="No modes" label="Run mode" onChange={onChange} options={options} />,
    );

    const input = screen.getByRole('combobox', {name: 'Run mode'});
    fireEvent.focus(input);
    fireEvent.click(screen.getByRole('button', {name: /Show suggestions/}));
    fireEvent.change(input, {target: {value: 'bal'}});
    const listbox = screen.getByRole('listbox');
    expect(within(listbox).getByRole('option', {name: /Balanced/i})).toBeTruthy();
    expect(within(listbox).queryByRole('option', {name: /Conservative/i})).toBeNull();

    fireEvent.keyDown(input, {key: 'ArrowDown'});
    fireEvent.keyDown(input, {key: 'Enter'});
    expect(onChange).toHaveBeenCalledWith('balanced');
    expect((input as HTMLInputElement).value).toBe('Balanced');
  });

  it('shows localized loading and empty collection states', () => {
    const {rerender} = render(
      <ComboBox
        emptyMessage="No remote modes"
        filterBehavior="manual"
        inputValue="remote"
        isLoading
        label="Remote mode"
        loadingMessage="Loading remote modes"
        onInputChange={() => undefined}
        options={[]}
      />,
    );

    const input = screen.getByRole('combobox', {name: 'Remote mode'});
    fireEvent.click(screen.getByRole('button', {name: /Show suggestions/}));
    expect(
      screen.getAllByRole('status').some((status) => status.textContent === 'Loading remote modes'),
    ).toBe(true);
    expect(input.getAttribute('aria-busy')).toBe('true');

    rerender(
      <ComboBox
        emptyMessage="No remote modes"
        filterBehavior="manual"
        inputValue="remote"
        label="Remote mode"
        onInputChange={() => undefined}
        options={[]}
      />,
    );
    expect(screen.getByText('No remote modes')).toBeTruthy();
  });

  it('keeps description and loading relationships unambiguous', () => {
    render(
      <Select
        description="Choose a remote mode."
        emptyMessage="No remote modes"
        isLoading
        label="Remote mode"
        loadingMessage="Loading remote modes"
        options={[]}
      />,
    );

    const trigger = screen.getByRole('button', {name: /Remote mode/});
    const description = screen.getByText('Choose a remote mode.');
    const status = screen.getByRole('status');
    const ids = [...document.querySelectorAll<HTMLElement>('[id]')].map((element) => element.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(trigger.getAttribute('aria-describedby')?.split(' ')).toContain(description.id);
    expect(status.textContent).toBe('Loading remote modes');
  });

  it('opens an empty Select collection so loading and empty states remain reachable', () => {
    const {rerender} = render(
      <Select
        emptyMessage="No bounded modes"
        isLoading
        label="Bounded remote mode"
        loadingMessage="Loading bounded modes"
        options={[]}
      />,
    );

    const trigger = screen.getByRole('button', {name: /Bounded remote mode/});
    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeTruthy();
    expect(screen.getByRole('status').textContent).toBe('Loading bounded modes');

    rerender(<Select emptyMessage="No bounded modes" label="Bounded remote mode" options={[]} />);
    expect(screen.getByText('No bounded modes')).toBeTruthy();
  });

  it('serializes, updates, and resets selection and input state deterministically', async () => {
    render(
      <form>
        <Select
          defaultValue="balanced"
          emptyMessage="No modes"
          label="Bounded mode"
          name="select-mode"
          options={options}
        />
        <ComboBox
          defaultValue="conservative"
          emptyMessage="No modes"
          label="Filtered mode"
          name="combo-mode"
          options={options}
        />
      </form>,
    );
    const form = screen.getByRole('button', {name: /Bounded mode/}).closest('form')!;

    expect([...new FormData(form).entries()]).toEqual([
      ['select-mode', 'balanced'],
      ['combo-mode', 'conservative'],
    ]);

    fireEvent.click(screen.getByRole('button', {name: /Bounded mode/}));
    fireEvent.click(screen.getByRole('option', {name: /Conservative/}));
    const comboInput = screen.getByRole('combobox', {name: 'Filtered mode'});
    fireEvent.click(screen.getByRole('button', {name: /Show suggestions Filtered mode/}));
    fireEvent.click(screen.getByRole('option', {name: /Balanced/}));
    expect([...new FormData(form).entries()]).toEqual([
      ['select-mode', 'conservative'],
      ['combo-mode', 'balanced'],
    ]);

    fireEvent.reset(form);
    await waitFor(() => {
      expect([...new FormData(form).entries()]).toEqual([
        ['select-mode', 'balanced'],
        ['combo-mode', 'conservative'],
      ]);
      expect((comboInput as HTMLInputElement).value).toBe('Conservative');
    });
  });

  it('preserves stable controlled values across dynamic and asynchronous option changes', () => {
    const {rerender} = render(
      <>
        <Select
          emptyMessage="No modes"
          label="Dynamic mode"
          onChange={() => undefined}
          options={options}
          value="balanced"
        />
        <ComboBox
          emptyMessage="No remote modes"
          filterBehavior="manual"
          isLoading
          label="Remote mode"
          loadingMessage="Loading remote modes"
          onChange={() => undefined}
          options={[]}
          value="balanced"
        />
      </>,
    );
    const trigger = screen.getByRole('button', {name: /Dynamic mode/});
    const comboInput = screen.getByRole<HTMLInputElement>('combobox', {name: 'Remote mode'});
    expect(trigger.textContent).toContain('Balanced');

    rerender(
      <>
        <Select
          emptyMessage="No modes"
          label="Dynamic mode"
          onChange={() => undefined}
          options={[
            {label: 'Fast', value: 'fast'},
            {label: 'Balanced', value: 'balanced'},
          ]}
          value="balanced"
        />
        <ComboBox
          emptyMessage="No remote modes"
          filterBehavior="manual"
          label="Remote mode"
          onChange={() => undefined}
          options={[
            {label: 'Fast', value: 'fast'},
            {label: 'Balanced', value: 'balanced'},
          ]}
          value="balanced"
        />
      </>,
    );
    expect(trigger.textContent).toContain('Balanced');
    expect(comboInput.value).toBe('Balanced');
  });

  it('keeps disabled and read-only autocomplete states behaviorally distinct', () => {
    const onReadOnlyChange = vi.fn();
    render(
      <>
        <ComboBox
          defaultValue="balanced"
          emptyMessage="No modes"
          isReadOnly
          label="Approved mode"
          onChange={onReadOnlyChange}
          options={options}
        />
        <ComboBox emptyMessage="No modes" isDisabled label="Unavailable mode" options={options} />
      </>,
    );

    const readOnly = screen.getByRole<HTMLInputElement>('combobox', {name: 'Approved mode'});
    const disabled = screen.getByRole<HTMLInputElement>('combobox', {name: 'Unavailable mode'});
    expect(readOnly.readOnly).toBe(true);
    expect(readOnly.disabled).toBe(false);
    expect(disabled.disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', {name: /Show suggestions Approved mode/}));
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(onReadOnlyChange).not.toHaveBeenCalled();
  });

  it('dismisses collection overlays and restores trigger focus', async () => {
    render(<Select emptyMessage="No modes" label="Dismissable mode" options={options} />);
    const trigger = screen.getByRole('button', {name: /Dismissable mode/});
    trigger.focus();
    fireEvent.keyDown(trigger, {key: 'ArrowDown'});
    const listbox = screen.getByRole('listbox');
    fireEvent.keyDown(listbox, {key: 'Escape'});
    expect(screen.queryByRole('listbox')).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('server-renders and hydrates selection controls without structural drift', async () => {
    const view = (
      <>
        <Select
          defaultValue="balanced"
          emptyMessage="No modes"
          label="Server mode"
          options={options}
        />
        <ComboBox emptyMessage="No modes" label="Server filter" options={options} />
      </>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(view);
    document.body.append(container);
    const onRecoverableError = vi.fn();
    let root: ReturnType<typeof hydrateRoot> | undefined;

    await act(async () => {
      root = hydrateRoot(container, view, {onRecoverableError});
      await Promise.resolve();
    });
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(within(container).getByRole('button', {name: /Server mode/}).textContent).toContain(
      'Balanced',
    );
    expect(within(container).getByRole('combobox', {name: 'Server filter'})).toBeTruthy();

    act(() => root?.unmount());
    container.remove();
  });
});
