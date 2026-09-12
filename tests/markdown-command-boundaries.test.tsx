import {act, cleanup, fireEvent, render} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {Button, MarkdownEditor, Toolbar, ToggleButton, type MarkdownCommand} from '../src/index.js';

afterEach(cleanup);

const toolbar =
  (command: MarkdownCommand) =>
  (controls: Parameters<NonNullable<Parameters<typeof MarkdownEditor>[0]['renderToolbar']>>[0]) => (
    <Toolbar label="Formatting">
      <Button isDisabled={!controls.canExecute(command)} onPress={() => controls.execute(command)}>
        Format
      </Button>
    </Toolbar>
  );

function selectAll(editor: HTMLElement) {
  act(() => editor.focus());
  fireEvent.keyDown(editor, {key: 'a', code: 'KeyA', ctrlKey: true});
}

describe('Markdown command boundaries', () => {
  it.each([
    {isReadOnly: true},
    {isDisabled: true},
    {isPending: true, pendingMessage: 'Waiting'},
    {isLocked: true, lockMessage: 'Editing elsewhere'},
    {mode: 'preview'},
  ] as const)('rejects editing commands in the shared noneditable state %j', (state) => {
    const onChange = vi.fn();
    const {getByRole, queryByRole} = render(
      <MarkdownEditor
        {...state}
        label="Document"
        defaultValue="Alpha"
        onChange={onChange}
        renderToolbar={toolbar('bold')}
      />,
    );
    expect(getByRole('button', {name: 'Format'}).hasAttribute('disabled')).toBe(true);
    const editor = queryByRole('textbox');
    if (editor) {
      selectAll(editor);
      fireEvent.keyDown(editor, {key: 'b', code: 'KeyB', ctrlKey: true});
    }
    fireEvent.click(getByRole('button', {name: 'Format'}));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('updates toolbar availability when editing is re-enabled without moving the caret', () => {
    const props = {label: 'Document', defaultValue: 'Alpha', renderToolbar: toolbar('bold')};
    const {getByRole, rerender} = render(<MarkdownEditor {...props} isReadOnly />);
    expect(getByRole('button', {name: 'Format'}).hasAttribute('disabled')).toBe(true);
    rerender(<MarkdownEditor {...props} />);
    expect(getByRole('button', {name: 'Format'}).hasAttribute('disabled')).toBe(false);
  });

  it('keeps a formatting edit separate from subsequent typing in undo history', () => {
    const onChange = vi.fn();
    const {getByRole} = render(
      <MarkdownEditor
        label="Document"
        mode="source"
        defaultValue="Alpha"
        onChange={onChange}
        renderToolbar={toolbar('bold')}
      />,
    );
    const editor = getByRole('textbox');
    selectAll(editor);
    fireEvent.click(getByRole('button', {name: 'Format'}));
    fireEvent.keyDown(editor, {key: 'Backspace', code: 'Backspace'});
    expect(onChange).toHaveBeenLastCalledWith('****');
    fireEvent.keyDown(editor, {key: 'z', code: 'KeyZ', ctrlKey: true});
    expect(onChange).toHaveBeenLastCalledWith('**Alpha**');
    fireEvent.keyDown(editor, {key: 'z', code: 'KeyZ', ctrlKey: true});
    expect(onChange).toHaveBeenLastCalledWith('Alpha');
  });

  it('leaves final ownership with a controlled consumer that rejects formatting', () => {
    const onChange = vi.fn();
    const {getByRole, container} = render(
      <MarkdownEditor
        label="Document"
        mode="source"
        value="Alpha"
        onChange={onChange}
        renderToolbar={toolbar('bold')}
      />,
    );
    selectAll(getByRole('textbox'));
    fireEvent.click(getByRole('button', {name: 'Format'}));
    expect(onChange).toHaveBeenCalledWith('**Alpha**');
    expect(getByRole('textbox').textContent).toBe('Alpha');
    expect(container.querySelector('textarea')?.value).toBe('Alpha');
  });

  it.each([
    ['bold', ' Alpha ', ' **Alpha** '],
    ['paragraph', 'Alpha\n=====', 'Alpha'],
    ['paragraph', '# Alpha #', 'Alpha'],
    ['blockquote', '## Alpha ###  ', '> Alpha'],
  ] as const)(
    'preserves prose while applying %s to existing Markdown',
    (command, value, expected) => {
      const onChange = vi.fn();
      const {getByRole} = render(
        <MarkdownEditor
          label="Document"
          mode="source"
          defaultValue={value}
          onChange={onChange}
          renderToolbar={toolbar(command)}
        />,
      );
      selectAll(getByRole('textbox'));
      fireEvent.click(getByRole('button', {name: 'Format'}));
      expect(onChange).toHaveBeenLastCalledWith(expected);
    },
  );

  it.each(['a] b', '[name]', '\\[name\\]'])('inserts a link for bracketed prose %s', (value) => {
    const props = {label: 'Document', defaultValue: value, renderToolbar: toolbar('link')};
    const {getByRole, rerender} = render(<MarkdownEditor {...props} mode="source" />);
    selectAll(getByRole('textbox'));
    fireEvent.click(getByRole('button', {name: 'Format'}));
    expect(document.getSelection()?.toString()).toBe('https://');
    rerender(<MarkdownEditor {...props} mode="preview" />);
    expect(getByRole('link').getAttribute('href')).toBe('https://');
    expect(getByRole('link').textContent).toBe(value.replaceAll('\\', ''));
  });

  it('keeps a trailing backslash in the link label without escaping its closing delimiter', () => {
    const props = {label: 'Document', defaultValue: 'path\\', renderToolbar: toolbar('link')};
    const {getByRole, rerender} = render(<MarkdownEditor {...props} mode="source" />);
    selectAll(getByRole('textbox'));
    fireEvent.click(getByRole('button', {name: 'Format'}));
    expect(document.getSelection()?.toString()).toBe('https://');
    rerender(<MarkdownEditor {...props} mode="preview" />);
    expect(getByRole('link').textContent).toBe('path\\');
  });

  it('toggles strikethrough off using the same command', () => {
    const onChange = vi.fn();
    const {getByRole} = render(
      <MarkdownEditor
        label="Document"
        mode="source"
        defaultValue="Alpha"
        onChange={onChange}
        renderToolbar={toolbar('strikethrough')}
      />,
    );
    selectAll(getByRole('textbox'));
    fireEvent.click(getByRole('button', {name: 'Format'}));
    expect(onChange).toHaveBeenLastCalledWith('~~Alpha~~');
    fireEvent.click(getByRole('button', {name: 'Format'}));
    expect(onChange).toHaveBeenLastCalledWith('Alpha');
  });

  it('inserts a rule after the current line without deleting unselected prose', () => {
    const onChange = vi.fn();
    const {getByRole} = render(
      <MarkdownEditor
        label="Document"
        mode="source"
        defaultValue="Alpha"
        onChange={onChange}
        renderToolbar={toolbar('horizontal-rule')}
      />,
    );
    act(() => getByRole('textbox').focus());
    fireEvent.click(getByRole('button', {name: 'Format'}));
    expect(onChange).toHaveBeenLastCalledWith('Alpha\n\n---\n');
  });

  it('inserts a rule on an empty line without changing preceding prose into a heading', () => {
    const onChange = vi.fn();
    const props = {
      label: 'Document',
      defaultValue: 'Alpha\n',
      onChange,
      renderToolbar: toolbar('horizontal-rule'),
    };
    const {getByRole, queryByRole, rerender} = render(<MarkdownEditor {...props} mode="source" />);
    const editor = getByRole('textbox');
    act(() => editor.focus());
    fireEvent.keyDown(editor, {key: 'End', code: 'End', ctrlKey: true});
    fireEvent.click(getByRole('button', {name: 'Format'}));
    expect(onChange).toHaveBeenLastCalledWith('Alpha\n\n---\n');
    rerender(<MarkdownEditor {...props} mode="preview" />);
    expect(getByRole('separator')).toBeTruthy();
    expect(queryByRole('heading')).toBeNull();
  });

  it('continues a quotation and exits its empty continuation', () => {
    const onChange = vi.fn();
    const {getByRole} = render(
      <MarkdownEditor label="Document" mode="source" defaultValue="> Quote" onChange={onChange} />,
    );
    const editor = getByRole('textbox');
    act(() => editor.focus());
    fireEvent.keyDown(editor, {key: 'End', code: 'End', ctrlKey: true});
    fireEvent.keyDown(editor, {key: 'Enter', code: 'Enter'});
    expect(onChange).toHaveBeenLastCalledWith('> Quote\n> ');
    fireEvent.keyDown(editor, {key: 'Enter', code: 'Enter'});
    expect(onChange).toHaveBeenLastCalledWith('> Quote\n');
  });

  it('disables code-block removal when its fence is unfinished', () => {
    const {getByRole} = render(
      <MarkdownEditor
        label="Document"
        mode="source"
        defaultValue={'```\nAlpha'}
        renderToolbar={toolbar('code-block')}
      />,
    );
    const editor = getByRole('textbox');
    act(() => editor.focus());
    fireEvent.keyDown(editor, {key: 'End', code: 'End', ctrlKey: true});
    fireEvent.keyDown(editor, {key: 'ArrowLeft', code: 'ArrowLeft'});
    expect(getByRole('button', {name: 'Format'}).hasAttribute('disabled')).toBe(true);
  });

  it('reports an existing rule as active at its source boundary', () => {
    const {getByRole} = render(
      <MarkdownEditor
        label="Document"
        mode="source"
        defaultValue="---"
        renderToolbar={(controls) => (
          <Toolbar label="Formatting">
            <ToggleButton
              isSelected={controls.isActive('horizontal-rule')}
              onChange={() => controls.execute('horizontal-rule')}
            >
              Rule
            </ToggleButton>
          </Toolbar>
        )}
      />,
    );
    act(() => getByRole('textbox').focus());
    expect(getByRole('button', {name: 'Rule', pressed: true})).toBeTruthy();
  });

  it('preserves selected backticks inside a code span', () => {
    const onChange = vi.fn();
    const {getByRole} = render(
      <MarkdownEditor
        label="Document"
        mode="source"
        defaultValue="a ` b"
        onChange={onChange}
        renderToolbar={toolbar('inline-code')}
      />,
    );
    selectAll(getByRole('textbox'));
    fireEvent.click(getByRole('button', {name: 'Format'}));
    expect(onChange).toHaveBeenLastCalledWith('``a ` b``');
  });

  it('formats complete selected lines without changing a following unselected line', async () => {
    const onChange = vi.fn();
    const {getByRole} = render(
      <MarkdownEditor
        label="Document"
        mode="source"
        defaultValue={'First\nSecond\nTail'}
        onChange={onChange}
        renderToolbar={toolbar('bullet-list')}
      />,
    );
    const editor = getByRole('textbox');
    await act(async () => {
      editor.focus();
      const lines = editor.querySelectorAll('.cm-line');
      document.getSelection()!.setBaseAndExtent(lines[0]!.firstChild!, 2, lines[2]!.firstChild!, 0);
      document.dispatchEvent(new Event('selectionchange'));
      await new Promise((resolve) => setTimeout(resolve, 30));
    });
    fireEvent.click(getByRole('button', {name: 'Format'}));
    expect(onChange).toHaveBeenLastCalledWith('- First\n- Second\nTail');
  });
});
