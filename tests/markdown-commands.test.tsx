import {act, cleanup, fireEvent, render} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {Button, MarkdownEditor, Toolbar, type MarkdownCommand} from '../src/index.js';

afterEach(cleanup);

async function select(editor: HTMLElement, text: string, anchor: number, head = anchor) {
  await act(async () => {
    editor.focus();
    const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node && !node.textContent?.includes(text)) node = walker.nextNode();
    if (!node) throw new Error(`Missing text ${text}`);
    const offset = node.textContent!.indexOf(text);
    document.getSelection()!.setBaseAndExtent(node, offset + anchor, node, offset + head);
    document.dispatchEvent(new Event('selectionchange'));
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
}

function specimen(value: string, command: MarkdownCommand = 'bold') {
  const onChange = vi.fn();
  const result = render(
    <MarkdownEditor
      label="Document"
      name="body"
      mode="source"
      defaultValue={value}
      onChange={onChange}
      renderToolbar={(controls) => (
        <Toolbar label="Formatting">
          <Button
            isDisabled={!controls.canExecute(command)}
            onPress={() => controls.execute(command)}
          >
            Format
          </Button>
          <Button
            isDisabled={!controls.canExecute('undo')}
            onPress={() => controls.execute('undo')}
          >
            Undo
          </Button>
          <Button
            isDisabled={!controls.canExecute('redo')}
            onPress={() => controls.execute('redo')}
          >
            Redo
          </Button>
        </Toolbar>
      )}
    />,
  );
  return {...result, onChange, editor: result.getByRole('textbox')};
}

describe('Markdown authoring commands', () => {
  it('formats the retained backward selection from a toolbar and restores it through undo', async () => {
    const {editor, getByRole, onChange} = specimen('Alpha');
    await select(editor, 'Alpha', 5, 0);
    act(() => getByRole('button', {name: 'Format'}).focus());
    fireEvent.click(getByRole('button', {name: 'Format'}));
    expect(onChange).toHaveBeenLastCalledWith('**Alpha**');
    expect(document.activeElement).toBe(editor);
    expect(document.getSelection()?.toString()).toBe('Alpha');
    fireEvent.click(getByRole('button', {name: 'Undo'}));
    expect(onChange).toHaveBeenLastCalledWith('Alpha');
    expect(document.getSelection()?.anchorOffset).toBe(5);
    expect(document.getSelection()?.focusOffset).toBe(0);
    fireEvent.click(getByRole('button', {name: 'Redo'}));
    expect(onChange).toHaveBeenLastCalledWith('**Alpha**');
  });

  it('uses the same transformation for keyboard formatting and toggle removal', async () => {
    const {editor, onChange} = specimen('Alpha');
    await select(editor, 'Alpha', 0, 5);
    fireEvent.keyDown(editor, {key: 'b', code: 'KeyB', ctrlKey: true});
    expect(onChange).toHaveBeenLastCalledWith('**Alpha**');
    fireEvent.keyDown(editor, {key: 'b', code: 'KeyB', ctrlKey: true});
    expect(onChange).toHaveBeenLastCalledWith('Alpha');
  });

  it.each([
    ['italic', '*Alpha*'],
    ['strikethrough', '~~Alpha~~'],
    ['inline-code', '`Alpha`'],
    ['link', '[Alpha](https://)'],
    ['heading-2', '## Alpha'],
    ['blockquote', '> Alpha'],
    ['bullet-list', '- Alpha'],
    ['ordered-list', '1. Alpha'],
    ['task-list', '- [ ] Alpha'],
    ['code-block', '```\nAlpha\n```'],
  ] as const)('applies %s to selected prose', async (command, expected) => {
    const {editor, getByRole, onChange} = specimen('Alpha', command);
    await select(editor, 'Alpha', 0, 5);
    fireEvent.click(getByRole('button', {name: 'Format'}));
    expect(onChange).toHaveBeenLastCalledWith(expected);
  });

  it('continues a checked task as unchecked and exits an empty item', async () => {
    const {editor, onChange} = specimen('- [x] Done');
    await select(editor, 'Done', 4);
    fireEvent.keyDown(editor, {key: 'Enter', code: 'Enter'});
    expect(onChange).toHaveBeenLastCalledWith('- [x] Done\n- [ ] ');
    fireEvent.keyDown(editor, {key: 'Enter', code: 'Enter'});
    expect(onChange).toHaveBeenLastCalledWith('- [x] Done\n');
  });

  it('does not format or continue Markdown inside fenced code', async () => {
    const {editor, onChange, getByRole} = specimen('```\n- literal\n```');
    await select(editor, '- literal', 9);
    expect(getByRole('button', {name: 'Format'}).hasAttribute('disabled')).toBe(true);
    fireEvent.keyDown(editor, {key: 'b', code: 'KeyB', ctrlKey: true});
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.keyDown(editor, {key: 'Enter', code: 'Enter'});
    expect(onChange).toHaveBeenLastCalledWith('```\n- literal\n\n```');
  });
});
