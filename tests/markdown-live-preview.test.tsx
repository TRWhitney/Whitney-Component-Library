import {act, cleanup, fireEvent, render, waitFor, within} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {MarkdownEditor, type MarkdownEditorLabels} from '../src/index.js';

afterEach(cleanup);

async function selectText(editor: HTMLElement, text: string, from: number, to = from) {
  await act(async () => {
    editor.focus();
    const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node && node.textContent !== text) node = walker.nextNode();
    if (!node) throw new Error(`Missing visible text: ${text}`);
    document.getSelection()!.setBaseAndExtent(node, from, node, to);
    document.dispatchEvent(new Event('selectionchange'));
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
}

describe('Markdown Live Preview', () => {
  it('keeps nested lists inside their owning list items', () => {
    const {getByRole} = render(
      <MarkdownEditor
        label="Document"
        defaultValue={'- Parent\n  - Child\n    - Grandchild\n- Sibling'}
      />,
    );
    const lists = within(getByRole('textbox')).getAllByRole('list');
    expect(lists).toHaveLength(3);
    for (const list of lists) {
      expect([...list.children].every((child) => child.getAttribute('role') === 'listitem')).toBe(
        true,
      );
    }
    expect(lists[1]?.parentElement?.getAttribute('role')).toBe('listitem');
    expect(lists[2]?.parentElement?.getAttribute('role')).toBe('listitem');
  });

  it.each(['live-preview', 'preview'] as const)(
    'names task checkboxes with their task text in %s',
    (mode) => {
      const {getByRole} = render(
        <MarkdownEditor
          mode={mode}
          label="Document"
          defaultValue={'- [x] Confirm the **mesh**\n- [ ] Inspect the boundary'}
        />,
      );
      const editor = within(
        getByRole(mode === 'preview' ? 'document' : 'textbox', {name: 'Document'}),
      );
      expect(editor.getByRole('checkbox', {name: 'Confirm the mesh'})).toMatchObject({
        checked: true,
      });
      expect(editor.getByRole('checkbox', {name: 'Inspect the boundary'})).toMatchObject({
        checked: false,
      });
    },
  );

  it('renders inactive footnotes as a labeled numbered section and restores it after editing', () => {
    const markdown = 'Note[^a].\n\n[^a]: Evidence with **weight**.';
    const onChange = vi.fn();
    const {getByRole, rerender} = render(
      <MarkdownEditor label="Document" value={markdown} onChange={onChange} />,
    );
    const editor = getByRole('textbox');
    expect(within(editor).getByRole('heading', {name: 'Footnotes'})).toBeTruthy();
    const entry = within(editor).getByRole('listitem');
    expect(entry.parentElement?.tagName).toBe('OL');
    expect(entry.querySelector('strong')?.textContent).toBe('weight');
    expect(within(entry).getByRole('link', {name: 'Back to reference'}).textContent).toBe('↩');
    fireEvent.mouseDown(entry.querySelector('strong')!, {button: 0});
    expect(editor.textContent).toContain('[^a]: Evidence with **weight**.');
    act(() => editor.blur());
    expect(within(editor).getByRole('heading', {name: 'Footnotes'})).toBeTruthy();
    expect(within(editor).getByRole('listitem').textContent).toContain('Evidence with weight.');
    expect(onChange).not.toHaveBeenCalled();
    rerender(
      <MarkdownEditor label="Document" mode="preview" value={markdown} onChange={onChange} />,
    );
    expect(getByRole('heading', {name: 'Footnotes'})).toBeTruthy();
    expect(getByRole('listitem').textContent).toContain('Evidence with weight.');
  });

  it('numbers references inside definitions after the main document references', () => {
    const {getByRole} = render(
      <MarkdownEditor
        label="Document"
        defaultValue={'[^a]: Alpha[^b].\n\n[^b]: Beta.\n\nMain[^a].'}
      />,
    );
    const editor = getByRole('textbox');
    const entries = within(editor).getAllByRole('listitem');
    expect(entries[0]?.parentElement?.getAttribute('start')).toBe('1');
    expect(entries[0]?.querySelector('sup')?.textContent).toBe('2');
    expect(entries[1]?.parentElement?.getAttribute('start')).toBe('2');
    expect(editor.lastElementChild?.textContent).toBe('Main1.');
  });

  it('updates footnote labels and return markers when references change', () => {
    const labels: MarkdownEditorLabels = {
      livePreview: 'Live',
      source: 'Source',
      preview: 'Preview',
      emptyPreview: 'Empty',
      required: 'Required',
      footnotes: 'Notes',
      footnoteBack: 'Return',
      position: () => 'Position',
    };
    const markdown = '[^a]: Evidence.\n\nFirst[^a].';
    const props = {label: 'Document', onChange: () => undefined, labels};
    const {getByRole, rerender} = render(<MarkdownEditor {...props} value={markdown} />);
    expect(getByRole('heading', {name: 'Notes'})).toBeTruthy();
    expect(within(getByRole('listitem')).getAllByRole('link', {name: 'Return'})).toHaveLength(1);
    rerender(<MarkdownEditor {...props} value={markdown + ' Again[^a].'} />);
    expect(within(getByRole('listitem')).getAllByRole('link', {name: 'Return'})).toHaveLength(2);
    rerender(
      <MarkdownEditor
        {...props}
        value={markdown}
        labels={{...labels, footnotes: 'Endnotes', footnoteBack: 'Go back'}}
      />,
    );
    expect(getByRole('heading', {name: 'Endnotes'})).toBeTruthy();
    expect(within(getByRole('listitem')).getAllByRole('link', {name: 'Go back'})).toHaveLength(1);
  });

  it('extends selection into a rendered table with Shift-click', async () => {
    const onChange = vi.fn();
    const {getByRole} = render(
      <MarkdownEditor
        label="Document"
        defaultValue={'Before\n\n**Middle**\n\n| A | B |\n| - | - |\n| one | two |'}
        onChange={onChange}
      />,
    );
    const editor = getByRole('textbox');
    await selectText(editor, 'Before', 2);
    fireEvent.mouseDown(within(editor).getByRole('cell', {name: 'two'}), {
      button: 0,
      shiftKey: true,
    });
    expect(document.getSelection()?.isCollapsed).toBe(false);
    expect(editor.textContent).toContain('**Middle**');
    expect(editor.querySelector('table')).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('uses document-wide footnote numbers inside rendered tables', () => {
    const {getByRole} = render(
      <MarkdownEditor
        label="Document"
        defaultValue={
          'First[^a].\n\n| Note |\n| --- |\n| Second[^b] |\n\n[^a]: Alpha.\n[^b]: Beta.'
        }
      />,
    );
    const editor = getByRole('textbox');
    expect(within(editor).getByRole('table').querySelector('sup')?.textContent).toBe('2');
    expect([...editor.querySelectorAll('sup')].map((node) => node.textContent)).toEqual(['1', '2']);
    expect([...editor.querySelectorAll('ol')].map((list) => list.start)).toEqual([1, 2]);
  });
  it('enters a rendered table with the arrow keys from either direction', async () => {
    const {getByRole} = render(
      <MarkdownEditor
        label="Document"
        defaultValue={'Before\n\n| A | B |\n| - | - |\n| one | two |\n\nAfter'}
      />,
    );
    const editor = getByRole('textbox');
    await selectText(editor, 'Before', 6);
    fireEvent.keyDown(editor, {key: 'ArrowRight', code: 'ArrowRight'});
    fireEvent.keyDown(editor, {key: 'ArrowDown', code: 'ArrowDown'});
    expect(editor.querySelector('table')).toBeNull();
    await selectText(editor, 'After', 0);
    expect(editor.querySelector('table')).toBeTruthy();
    fireEvent.keyDown(editor, {key: 'ArrowLeft', code: 'ArrowLeft'});
    fireEvent.keyDown(editor, {key: 'ArrowUp', code: 'ArrowUp'});
    expect(editor.querySelector('table')).toBeNull();
  });
  it('retains reference meaning and later source positions after a prose edit', async () => {
    const markdown =
      'Read [guide][ref] and **bold**.\n\nTail **second**.\n\n[ref]: https://example.com';
    const onChange = vi.fn();
    const {getByRole} = render(
      <MarkdownEditor label="Document" defaultValue={markdown} onChange={onChange} />,
    );
    const editor = getByRole('textbox');
    await selectText(editor, 'bold', 4);
    fireEvent.keyDown(editor, {key: 'Backspace', code: 'Backspace'});
    expect(onChange).toHaveBeenLastCalledWith(markdown.replace('bold', 'bol'));
    expect(within(editor).getByRole('link', {name: 'guide'})).toBeTruthy();
    await selectText(editor, 'second', 3);
    expect(editor.textContent).toContain('Tail **second**.');
    expect(editor.querySelector('strong')?.textContent).toBe('bol');
  });
  it('retains an inactive image while editing elsewhere in the document', async () => {
    const {getByRole} = render(
      <MarkdownEditor label="Document" defaultValue={'![Mesh](/mesh.svg)\n\nTail'} />,
    );
    const editor = getByRole('textbox');
    await selectText(editor, 'Tail', 4);
    const image = within(editor).getByRole('img', {name: 'Mesh'});
    fireEvent.keyDown(editor, {key: 'Enter', code: 'Enter'});
    expect(within(editor).getByRole('img', {name: 'Mesh'})).toBe(image);
  });
  it('renders nested quotations and escaped text without leaving structural markers', () => {
    const {getByRole} = render(
      <MarkdownEditor
        label="Document"
        defaultValue={'> outer\n> > inner\n> > next &amp; \\*literal\\*'}
      />,
    );
    const editor = getByRole('textbox');
    expect(editor.textContent).not.toContain('>');
    expect(editor.textContent).toContain('next & *literal*');
    expect(editor.querySelectorAll('blockquote')).toHaveLength(2);
  });
  it('reveals only the inline construct intersected by the caret and preserves selection when modes change', async () => {
    const markdown = 'A **bold** and *quiet* line.';
    const onChange = vi.fn();
    const {getByRole, rerender} = render(
      <MarkdownEditor label="Document" value={markdown} onChange={onChange} />,
    );
    const editor = getByRole('textbox');
    await selectText(editor, 'bold', 2);
    expect(editor.textContent).toBe('A **bold** and quiet line.');
    expect(document.getSelection()?.anchorOffset).toBe(2);
    rerender(
      <MarkdownEditor label="Document" mode="source" value={markdown} onChange={onChange} />,
    );
    expect(getByRole('textbox')).toBe(editor);
    expect(editor.textContent).toBe(markdown);
    rerender(<MarkdownEditor label="Document" value={markdown} onChange={onChange} />);
    expect(editor.textContent).toBe('A **bold** and quiet line.');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('copies the exact Markdown across rendered blocks and inline constructs', () => {
    const markdown = '# Heading\n\nA **bold** line.\n\n| A | B |\n| - | - |\n| one | two |';
    const {getByRole} = render(<MarkdownEditor label="Document" defaultValue={markdown} />);
    const editor = getByRole('textbox');
    act(() => {
      editor.focus();
    });
    fireEvent.keyDown(editor, {key: 'a', code: 'KeyA', ctrlKey: true});
    const clipboard = new Map<string, string>();
    fireEvent.copy(editor, {
      clipboardData: {
        clearData: () => clipboard.clear(),
        setData: (type: string, value: string) => clipboard.set(type, value),
        getData: (type: string) => clipboard.get(type),
      },
    });
    expect(clipboard.get('text/plain')).toBe(markdown);
    expect(editor.querySelector('table')).toBeNull();
    expect(editor.textContent).toContain('**bold**');
  });

  it('keeps empty headings and incomplete constructs editable', () => {
    const {getByRole, rerender} = render(
      <MarkdownEditor label="Document" value="#" onChange={() => undefined} />,
    );
    expect(getByRole('textbox')).toBeTruthy();
    rerender(
      <MarkdownEditor
        label="Document"
        value={'#\n\n**unfinished\n\n```\ncode'}
        onChange={() => undefined}
      />,
    );
    expect(getByRole('textbox').textContent).toContain('unfinished');
  });
  it('defaults to one editable document with rendered inline and block meaning', () => {
    const markdown =
      '# Review\n\n**Ready** and *careful* with ~~old~~ `code` and [[Notes]].\n\n- [x] Done\n- Next\n\n> Quoted\n\n```js\nconst n = 1;\n```\n\n| A | B |\n| - | - |\n| one | two |\n\n---\n\n![Mesh](/mesh.svg)\n\nA note[^one].\n\n[^one]: Evidence.';
    const {container, getByRole} = render(
      <form>
        <MarkdownEditor label="Document" name="body" defaultValue={markdown} />
      </form>,
    );
    const editor = getByRole('textbox', {name: 'Document'});
    expect(within(editor).getByRole('heading', {name: 'Review'})).toBeTruthy();
    expect(editor.querySelector('strong')?.textContent).toBe('Ready');
    expect(editor.querySelector('em')?.textContent).toBe('careful');
    expect(editor.querySelector('del')?.textContent).toBe('old');
    expect(editor.querySelector('code')?.textContent).toBe('code');
    expect(editor.querySelector('[data-wcl-wiki-link]')?.textContent).toBe('Notes');
    expect(within(editor).getByRole('table')).toBeTruthy();
    expect(within(editor).getByRole('img', {name: 'Mesh'})).toBeTruthy();
    expect(within(editor).getByRole('checkbox')).toMatchObject({checked: true, disabled: true});
    expect(editor.querySelector('blockquote')?.textContent).toContain('Quoted');
    expect(editor.querySelector('pre')?.textContent).toContain('const n = 1;');
    expect(editor.querySelector('hr')).toBeTruthy();
    expect(editor.textContent).toContain('Evidence.');
    expect(new FormData(container.querySelector('form')!).get('body')).toBe(markdown);
    expect(container.querySelectorAll('[role="textbox"]')).toHaveLength(1);
    expect(container.querySelector('[data-wcl-markdown-preview]')).toBeNull();
  });

  it('reveals an entered table without changing the document or emitting a change', async () => {
    const onChange = vi.fn();
    const markdown = 'Intro\n\n| A | B |\n| - | - |\n| one | two |\n\nEnd';
    const {container, getByRole} = render(
      <MarkdownEditor label="Document" defaultValue={markdown} onChange={onChange} />,
    );
    const editor = getByRole('textbox');
    fireEvent.mouseDown(within(editor).getByRole('cell', {name: 'two'}), {button: 0});
    expect(editor.querySelector('table')).toBeNull();
    expect(editor.textContent).toContain('| one | two |');
    expect(document.activeElement).toBe(editor);
    expect(onChange).not.toHaveBeenCalled();
    expect(container.querySelector('textarea')?.value).toBe(markdown);
    act(() => {
      editor.blur();
    });
    await waitFor(() => expect(within(editor).getByRole('table')).toBeTruthy());
  });
});
