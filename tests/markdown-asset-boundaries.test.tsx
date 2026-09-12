import {act, cleanup, fireEvent, render} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {MarkdownEditor, type MarkdownAssetOptions, type MarkdownAssetResult} from '../src/index.js';
afterEach(cleanup);
const file = new File(['image'], 'mesh.png', {type: 'image/png'});
function deferred() {
  let resolve!: (value: MarkdownAssetResult) => void;
  const promise = new Promise<MarkdownAssetResult>((yes) => {
    resolve = yes;
  });
  return {promise, resolve};
}
function paste(editor: HTMLElement) {
  fireEvent.paste(editor, {
    clipboardData: {
      items: [{kind: 'file', getAsFile: () => file}],
      files: [file],
      getData: () => '',
    },
  });
}
function key(editor: HTMLElement, key: string, ctrlKey = false) {
  fireEvent.keyDown(editor, {key, ctrlKey});
}
function end(editor: HTMLElement) {
  act(() => editor.focus());
  key(editor, 'End', true);
}

describe('asynchronous Markdown asset boundaries', () => {
  it('keeps the authors current caret when completion inserts elsewhere', async () => {
    const result = deferred();
    const {getByRole, container} = render(
      <MarkdownEditor
        label="Document"
        mode="source"
        defaultValue={'Alpha\nTail'}
        assets={{insert: () => result.promise}}
      />,
    );
    const editor = getByRole('textbox');
    end(editor);
    paste(editor);
    key(editor, 'Home', true);
    key(editor, 'Delete');
    await act(async () => {
      result.resolve({markdown: '![Mesh](/mesh.png)'});
      await result.promise;
    });
    key(editor, 'Delete');
    expect(container.querySelector('textarea')?.value).toBe('pha\nTail![Mesh](/mesh.png)');
  });

  it('cancels if new text is inserted inside the captured selected range', async () => {
    const result = deferred(),
      insert = vi.fn<MarkdownAssetOptions['insert']>(() => result.promise);
    const {getByRole, container} = render(
      <MarkdownEditor label="Document" mode="source" defaultValue="Alpha" assets={{insert}} />,
    );
    const editor = getByRole('textbox');
    end(editor);
    key(editor, 'a', true);
    paste(editor);
    key(editor, 'Home', true);
    key(editor, 'ArrowRight');
    key(editor, 'Enter');
    await act(async () => {
      result.resolve({markdown: '![Mesh](/mesh.png)'});
      await result.promise;
    });
    expect(container.querySelector('textarea')?.value).toBe('A\nlpha');
    expect(insert.mock.calls[0]?.[0].signal.aborted).toBe(true);
  });

  it('aborts a reset even if the Markdown value did not change', async () => {
    const result = deferred(),
      insert = vi.fn<MarkdownAssetOptions['insert']>(() => result.promise);
    const {getByRole, container} = render(
      <form>
        <MarkdownEditor label="Document" defaultValue="Alpha" assets={{insert}} />
        <button type="reset">Reset</button>
      </form>,
    );
    const editor = getByRole('textbox');
    end(editor);
    paste(editor);
    await act(async () => {
      fireEvent.click(getByRole('button', {name: 'Reset'}));
      await Promise.resolve();
    });
    expect(insert.mock.calls[0]?.[0].signal.aborted).toBe(true);
    await act(async () => {
      result.resolve({markdown: 'asset'});
      await result.promise;
    });
    expect(container.querySelector('textarea')?.value).toBe('Alpha');
  });

  it.each([
    {isReadOnly: true},
    {isDisabled: true},
    {isPending: true, pendingMessage: 'Waiting'},
    {isLocked: true, lockMessage: 'Locked'},
    {mode: 'preview'},
  ] as const)('cancels a pending insertion when entering %j', async (state) => {
    const result = deferred(),
      insert = vi.fn<MarkdownAssetOptions['insert']>(() => result.promise);
    const props = {label: 'Document', defaultValue: 'Alpha', assets: {insert}};
    const {getByRole, rerender, container} = render(<MarkdownEditor {...props} />);
    end(getByRole('textbox'));
    paste(getByRole('textbox'));
    rerender(<MarkdownEditor {...props} {...state} />);
    expect(insert.mock.calls[0]?.[0].signal.aborted).toBe(true);
    await act(async () => {
      result.resolve({markdown: 'asset'});
      await result.promise;
    });
    expect(container.querySelector('textarea')?.value).toBe('Alpha');
  });

  it('keeps a controlled consumer authoritative when it rejects insertion', async () => {
    const onChange = vi.fn();
    const {getByRole, container} = render(
      <MarkdownEditor
        label="Document"
        value="Alpha"
        onChange={onChange}
        assets={{insert: () => ({markdown: 'asset'})}}
      />,
    );
    end(getByRole('textbox'));
    await act(async () => {
      paste(getByRole('textbox'));
      await Promise.resolve();
    });
    expect(onChange).toHaveBeenCalledWith('Alphaasset');
    expect(container.querySelector('textarea')?.value).toBe('Alpha');
  });

  it('retains rejections after inserting accepted files without duplicating browser representations', async () => {
    const invalid = new File(['text'], 'notes.txt', {type: 'text/plain'}),
      insert = vi.fn<MarkdownAssetOptions['insert']>(() => ({markdown: 'asset'}));
    const {getByRole, container} = render(
      <MarkdownEditor
        label="Document"
        assets={{insert, allowsMultiple: true, acceptedFileTypes: ['image/png']}}
      />,
    );
    const files = [file, invalid];
    await act(async () => {
      fireEvent.paste(getByRole('textbox'), {
        clipboardData: {
          items: files.map((file) => ({kind: 'file', getAsFile: () => file})),
          files,
          getData: () => '',
        },
      });
      await Promise.resolve();
    });
    expect(insert.mock.calls[0]?.[0].files).toEqual([file]);
    expect(container.querySelector('textarea')?.value).toBe('asset');
    expect(getByRole('alert').textContent).toContain('notes.txt');
  });
});
