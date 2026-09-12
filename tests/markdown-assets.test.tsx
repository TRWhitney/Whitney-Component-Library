import {act, cleanup, fireEvent, render} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {MarkdownEditor, type MarkdownAssetResult, type MarkdownAssetOptions} from '../src/index.js';

afterEach(cleanup);
const file = new File(['mesh'], 'mesh.png', {type: 'image/png'});
const inserted = '![Mesh](/mesh.png)';
function deferred() {
  let resolve!: (value: MarkdownAssetResult) => void;
  const promise = new Promise<MarkdownAssetResult>((yes) => {
    resolve = yes;
  });
  return {promise, resolve};
}
function paste(editor: HTMLElement, files: File[] = [file]) {
  return fireEvent.paste(editor, {
    clipboardData: {
      items: files.map((file) => ({kind: 'file', getAsFile: () => file})),
      files,
      getData: () => '',
    },
  });
}
function end(editor: HTMLElement) {
  act(() => editor.focus());
  fireEvent.keyDown(editor, {key: 'End', code: 'End', ctrlKey: true});
}

describe('Markdown application assets', () => {
  it.each([
    ['![Mesh](/mesh.png)', 'img[src]'],
    ['| Run |\n| --- |\n| 0285 |', 'table'],
    ['```text\nmesh\n```', 'pre'],
  ])('consumes file drops over rendered content %s', (value, selector) => {
    const {container} = render(<MarkdownEditor label="Document" defaultValue={value} />);
    const target = container.querySelector(selector)!;
    expect(target).not.toBeNull();
    expect(fireEvent.dragOver(target, {dataTransfer: {types: ['Files']}})).toBe(false);
    expect(fireEvent.drop(target, {dataTransfer: {files: [file]}})).toBe(false);
  });

  it('inserts only callback Markdown at the captured selection as one undoable edit', async () => {
    const result = deferred(),
      insert = vi.fn<MarkdownAssetOptions['insert']>(() => result.promise),
      onChange = vi.fn();
    const {getByRole, container} = render(
      <MarkdownEditor
        label="Document"
        mode="source"
        defaultValue="Alpha"
        onChange={onChange}
        assets={{insert}}
      />,
    );
    const editor = getByRole('textbox');
    end(editor);
    paste(editor);
    expect(insert).toHaveBeenCalledTimes(1);
    expect(insert.mock.calls[0]?.[0]).toMatchObject({files: [file], source: 'paste'});
    expect(getByRole('status').textContent).toContain('1');
    expect(editor.getAttribute('aria-readonly')).toBe('false');
    await act(async () => {
      result.resolve({markdown: inserted});
      await result.promise;
    });
    expect(container.querySelector('textarea')?.value).toBe('Alpha' + inserted);
    fireEvent.keyDown(editor, {key: 'z', code: 'KeyZ', ctrlKey: true});
    expect(container.querySelector('textarea')?.value).toBe('Alpha');
  });

  it('maps the insertion through unrelated local edits while waiting', async () => {
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
    fireEvent.keyDown(editor, {key: 'Home', code: 'Home', ctrlKey: true});
    fireEvent.keyDown(editor, {key: 'Delete', code: 'Delete'});
    await act(async () => {
      result.resolve({markdown: inserted});
      await result.promise;
    });
    expect(container.querySelector('textarea')?.value).toBe('lpha\nTail' + inserted);
  });

  it('discards completion after the selected insertion range is overwritten', async () => {
    const result = deferred(),
      insert = vi.fn<MarkdownAssetOptions['insert']>(() => result.promise);
    const {getByRole, container} = render(
      <MarkdownEditor label="Document" mode="source" defaultValue="Alpha" assets={{insert}} />,
    );
    const editor = getByRole('textbox');
    end(editor);
    fireEvent.keyDown(editor, {key: 'a', code: 'KeyA', ctrlKey: true});
    paste(editor);
    fireEvent.keyDown(editor, {key: 'Backspace', code: 'Backspace'});
    await act(async () => {
      result.resolve({markdown: inserted});
      await result.promise;
    });
    expect(container.querySelector('textarea')?.value).toBe('');
    expect(insert.mock.calls[0]?.[0].signal.aborted).toBe(true);
  });

  it('allows retry after callback failure and dismissal of feedback', async () => {
    const insert = vi
      .fn()
      .mockResolvedValueOnce({error: 'Asset service unavailable.'})
      .mockResolvedValueOnce({markdown: inserted});
    const {getByRole, container} = render(
      <MarkdownEditor label="Document" mode="source" assets={{insert}} />,
    );
    const editor = getByRole('textbox');
    end(editor);
    await act(async () => {
      paste(editor);
      await Promise.resolve();
    });
    expect(getByRole('alert').textContent).toContain('Asset service unavailable.');
    await act(async () => {
      fireEvent.click(getByRole('button', {name: 'Retry asset insertion'}));
      await Promise.resolve();
    });
    expect(container.querySelector('textarea')?.value).toBe(inserted);
    expect(insert).toHaveBeenCalledTimes(2);
  });

  it('rejects unacceptable files without calling the application and lets feedback be dismissed', () => {
    const insert = vi.fn<MarkdownAssetOptions['insert']>(() => ({markdown: ''}));
    const {getByRole, queryByRole} = render(
      <MarkdownEditor label="Document" assets={{insert, acceptedFileTypes: ['image/png']}} />,
    );
    const editor = getByRole('textbox');
    act(() => editor.focus());
    paste(editor, [new File(['text'], 'notes.txt', {type: 'text/plain'})]);
    expect(insert).not.toHaveBeenCalled();
    expect(getByRole('alert')).toBeTruthy();
    fireEvent.click(getByRole('button', {name: 'Dismiss asset feedback'}));
    expect(queryByRole('alert')).toBeNull();
  });

  it.each([
    {isReadOnly: true},
    {isDisabled: true},
    {isPending: true, pendingMessage: 'Waiting'},
    {isLocked: true, lockMessage: 'Locked'},
  ] as const)('blocks file acquisition in noneditable state %j', (state) => {
    const insert = vi.fn<MarkdownAssetOptions['insert']>(() => ({markdown: ''}));
    const {getByRole} = render(<MarkdownEditor {...state} label="Document" assets={{insert}} />);
    paste(getByRole('textbox'));
    expect(insert).not.toHaveBeenCalled();
  });

  it('aborts pending work on external replacement and ignores a late result', async () => {
    const result = deferred(),
      insert = vi.fn<MarkdownAssetOptions['insert']>(() => result.promise),
      onChange = vi.fn();
    const props = {label: 'Document', onChange, assets: {insert}};
    const {getByRole, rerender, container} = render(<MarkdownEditor {...props} value="Alpha" />);
    const editor = getByRole('textbox');
    end(editor);
    paste(editor);
    expect(insert).toHaveBeenCalledTimes(1);
    rerender(<MarkdownEditor {...props} value="Replacement" />);
    expect(insert.mock.calls[0]?.[0].signal.aborted).toBe(true);
    await act(async () => {
      result.resolve({markdown: inserted});
      await result.promise;
    });
    expect(container.querySelector('textarea')?.value).toBe('Replacement');
  });

  it('aborts pending work on unmount', () => {
    const result = deferred(),
      insert = vi.fn<MarkdownAssetOptions['insert']>(() => result.promise);
    const {getByRole, unmount} = render(<MarkdownEditor label="Document" assets={{insert}} />);
    paste(getByRole('textbox'));
    expect(insert).toHaveBeenCalledTimes(1);
    unmount();
    expect(insert.mock.calls[0]?.[0].signal.aborted).toBe(true);
  });
});
