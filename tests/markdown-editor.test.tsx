import {act, cleanup, fireEvent, render, waitFor, within} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {renderToString} from 'react-dom/server';
import {hydrateRoot} from 'react-dom/client';
import {useState} from 'react';

import {AppearanceProvider, FieldGroup, MarkdownEditor, Toolbar, Button} from '../src/index.js';

afterEach(cleanup);

async function replaceVisibleLine(editor: HTMLElement, text: string) {
  await act(async () => {
    const line = editor.firstElementChild!;
    line.textContent = text;
    fireEvent.input(editor, {inputType: 'insertText', data: text});
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
}

describe('Markdown editing', () => {
  it('exposes one labeled source editor and submits the unchanged Markdown string', () => {
    const value = '# Review\r\n\n  unfinished **text\rfinal\n';
    const {container, getByRole} = render(
      <form>
        <MarkdownEditor
          mode="source"
          defaultValue={value}
          description="Review before publishing."
          label="Document"
          name="body"
        />
      </form>,
    );
    const editor = getByRole('textbox', {name: 'Document'});
    expect(editor.getAttribute('aria-multiline')).toBe('true');
    expect(editor.getAttribute('aria-describedby')).toBeTruthy();
    // FormData uses native newline normalization; the public value does not.
    expect(new FormData(container.querySelector('form')!).get('body')).toBe(
      value.replace(/\r\n?/g, '\n'),
    );
    expect(container.querySelectorAll('[role="textbox"]')).toHaveLength(1);
  });

  it('renders document semantics and keeps raw HTML and unsafe URLs inert', () => {
    const {container, getByRole} = render(
      <MarkdownEditor
        label="Document"
        mode="preview"
        defaultValue={
          '# Review\n\n**Ready** and *careful*.\n\n<script>alert(1)</script>\n\n[unsafe](javascript:alert%281%29)\n\n![bad](data:image/svg+xml,evil)\n\n- [x] Checked\n\n| Step | State |\n| --- | --- |\n| Review | Done |\n\nA note[^one].\n\n[^one]: Evidence.\n\n[[Review process]]'
        }
      />,
    );
    expect(getByRole('heading', {name: 'Review', level: 1})).toBeTruthy();
    expect(container.querySelector('strong')?.textContent).toBe('Ready');
    expect(getByRole('table')).toBeTruthy();
    expect(getByRole('checkbox')).toMatchObject({checked: true, disabled: true});
    expect(container.querySelector('[data-footnotes]')?.textContent).toContain('Evidence.');
    expect(container.querySelector('[data-wcl-wiki-link]')?.textContent).toBe('Review process');
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('a[href^="javascript:"]')).toBeNull();
    expect(container.querySelector('img[src^="data:"]')).toBeNull();
    expect(container.querySelector('[role="textbox"]')).toBeNull();
  });

  it('treats escaped wiki brackets and code as literal while parsing ordinary wiki targets', () => {
    const {container} = render(
      <MarkdownEditor
        label="Document"
        mode="preview"
        defaultValue={
          '\\[[escaped]] and `[[inline]]`\n\n```md\n[[fenced]]\n```\n\n[[actual]] and [[unfinished'
        }
      />,
    );
    expect(
      [...container.querySelectorAll('[data-wcl-wiki-link]')].map((node) => node.textContent),
    ).toEqual(['actual']);
    expect(container.querySelector('pre')?.textContent).toContain('[[fenced]]');
  });

  it('scopes footnote destinations and descriptions to each editor', () => {
    const {container} = render(
      <>
        <MarkdownEditor
          label="First"
          mode="preview"
          defaultValue={'One[^a].\n\n[^a]: First note.'}
        />
        <MarkdownEditor
          label="Second"
          mode="preview"
          defaultValue={'Two[^a].\n\n[^a]: Second note.'}
        />
      </>,
    );
    const ids = [...container.querySelectorAll('[id]')].map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const region of container.querySelectorAll('[role="region"]')) {
      for (const anchor of region.querySelectorAll('a')) {
        const target = document.getElementById(anchor.getAttribute('href')!.slice(1));
        expect(region.contains(target)).toBe(true);
        const description = anchor.getAttribute('aria-describedby');
        if (description) expect(region.contains(document.getElementById(description))).toBe(true);
      }
    }
  });

  it('preserves prose after and between wiki links', () => {
    const {getByRole} = render(
      <MarkdownEditor
        label="Document"
        mode="preview"
        defaultValue="Before [[First]] between [[Second]] after."
      />,
    );
    expect(getByRole('region').textContent).toBe('Before First between Second after.');
  });

  it('preserves mixed line endings and incomplete markup in public change events', () => {
    const value = '# Heading\r\n\nunfinished **text\rlast\n';
    const onChange = vi.fn();
    const {getByRole} = render(
      <MarkdownEditor mode="source" label="Document" defaultValue={value} onChange={onChange} />,
    );
    fireEvent.keyDown(getByRole('textbox'), {key: 'Enter', code: 'Enter'});
    expect(onChange).toHaveBeenLastCalledWith('\n' + value);
    fireEvent.keyDown(getByRole('textbox'), {key: 'z', code: 'KeyZ', ctrlKey: true});
    expect(onChange).toHaveBeenLastCalledWith(value);
  });

  it('keeps disabled reading content accessible with inactive links', () => {
    const {getByRole} = render(
      <MarkdownEditor
        label="Document"
        mode="preview"
        isDisabled
        defaultValue={'# Heading\n\n[Guide](https://example.com)'}
      />,
    );
    expect(getByRole('region').getAttribute('aria-disabled')).toBe('true');
    expect(getByRole('heading', {name: 'Heading'})).toBeTruthy();
    const link = getByRole('link', {name: 'Guide'});
    expect(link.getAttribute('href')).toBeNull();
    expect(link.getAttribute('aria-disabled')).toBe('true');
  });

  it('reports exact Markdown edits, keeps the same source control, and undoes after reading', async () => {
    const onChange = vi.fn();
    const {getByRole, rerender} = render(
      <MarkdownEditor mode="source" defaultValue="Original" label="Document" onChange={onChange} />,
    );
    const editor = getByRole('textbox', {name: 'Document'});
    await replaceVisibleLine(editor, '**Changed');
    expect(onChange).toHaveBeenLastCalledWith('**Changed');
    rerender(
      <MarkdownEditor
        defaultValue="Original"
        label="Document"
        onChange={onChange}
        mode="preview"
      />,
    );
    expect(within(getByRole('region')).getByText('**Changed')).toBeTruthy();
    rerender(
      <MarkdownEditor mode="source" defaultValue="Original" label="Document" onChange={onChange} />,
    );
    expect(getByRole('textbox')).toBe(editor);
    fireEvent.keyDown(editor, {key: 'z', code: 'KeyZ', ctrlKey: true});
    expect(onChange).toHaveBeenLastCalledWith('Original');
    fireEvent.keyDown(editor, {key: 'y', code: 'KeyY', ctrlKey: true});
    expect(onChange).toHaveBeenLastCalledWith('**Changed');
  });

  it('accepts controlled updates and restores repeated rejected edits to the owner value', async () => {
    const onChange = vi.fn();
    const {getByRole, rerender} = render(
      <MarkdownEditor mode="source" value="Owned" label="Document" onChange={onChange} />,
    );
    const editor = getByRole('textbox');
    await replaceVisibleLine(editor, 'Attempt');
    expect(onChange).toHaveBeenLastCalledWith('Attempt');
    expect(editor.textContent).toBe('Owned');
    await replaceVisibleLine(editor, 'Attempt');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith('Attempt');
    expect(editor.textContent).toBe('Owned');
    rerender(
      <MarkdownEditor
        mode="source"
        value="External **update**"
        label="Document"
        onChange={onChange}
      />,
    );
    expect(getByRole('textbox')).toBe(editor);
    expect(editor.textContent).toBe('External **update**');
  });

  it('blocks native required submission, links its error, and focuses the visible editor', () => {
    const {container, getByRole} = render(
      <form>
        <MarkdownEditor mode="source" label="Document" name="body" isRequired />
      </form>,
    );
    act(() => {
      expect(container.querySelector('form')!.checkValidity()).toBe(false);
    });
    const editor = getByRole('textbox');
    expect(editor.getAttribute('aria-invalid')).toBe('true');
    expect(document.activeElement).toBe(editor);
    const error = container.querySelector('[data-wcl-field-error]')!;
    expect(editor.getAttribute('aria-describedby')?.split(' ')).toContain(error.id);
  });

  it('reports ARIA validation without blocking native form submission', () => {
    const {container, getByRole} = render(
      <form>
        <MarkdownEditor
          mode="source"
          label="Document"
          name="body"
          isRequired
          validationBehavior="aria"
        />
      </form>,
    );
    expect(container.querySelector('form')!.checkValidity()).toBe(true);
    expect(getByRole('textbox').getAttribute('aria-invalid')).toBe('true');
  });

  it('restores the initial document on external form reset and clears undo history', async () => {
    const onChange = vi.fn();
    const {container, getByRole} = render(
      <>
        <form id="document-form" />
        <MarkdownEditor
          mode="source"
          form="document-form"
          label="Document"
          name="body"
          defaultValue="Initial"
          onChange={onChange}
        />
      </>,
    );
    const editor = getByRole('textbox');
    await replaceVisibleLine(editor, 'Changed');
    await act(async () => {
      container.querySelector('form')!.reset();
      await Promise.resolve();
    });
    expect(editor.textContent).toBe('Initial');
    expect(onChange).toHaveBeenLastCalledWith('Initial');
    onChange.mockClear();
    fireEvent.keyDown(editor, {key: 'z', code: 'KeyZ', ctrlKey: true});
    expect(onChange).not.toHaveBeenCalled();
  });

  it('exposes read-only, locked, pending, and inherited disabled states', () => {
    const {getByRole, rerender, container} = render(
      <MarkdownEditor
        mode="source"
        label="Document"
        defaultValue="Read me"
        isLocked
        lockMessage="Whitney is editing."
      />,
    );
    expect(getByRole('textbox').getAttribute('aria-readonly')).toBe('true');
    const lock = container.querySelector('[data-wcl-markdown-lock]')!;
    expect(getByRole('textbox').getAttribute('aria-describedby')).toContain(lock.id);
    rerender(
      <MarkdownEditor
        mode="source"
        label="Document"
        defaultValue="Read me"
        isPending
        pendingMessage="Loading document."
      />,
    );
    expect(getByRole('textbox').getAttribute('aria-busy')).toBe('true');
    expect(getByRole('status').textContent).toBe('Loading document.');
    rerender(
      <FieldGroup legend="Metadata" isDisabled>
        <MarkdownEditor mode="source" label="Document" defaultValue="Read me" />
      </FieldGroup>,
    );
    expect(getByRole('textbox').getAttribute('tabindex')).toBe('-1');
    expect(getByRole('textbox').getAttribute('contenteditable')).toBe('false');
  });

  it('keeps an externally controlled value when the owner rejects a form reset', async () => {
    const onChange = vi.fn();
    const {container, getByRole, rerender} = render(
      <form>
        <MarkdownEditor mode="source" label="Document" value="Initial" onChange={onChange} />
      </form>,
    );
    rerender(
      <form>
        <MarkdownEditor mode="source" label="Document" value="External" onChange={onChange} />
      </form>,
    );
    await act(async () => {
      container.querySelector('form')!.reset();
      await Promise.resolve();
    });
    expect(onChange).toHaveBeenCalledWith('Initial');
    expect(getByRole('textbox').textContent).toBe('External');
  });

  it('honors cancellation of form reset', async () => {
    const {container, getByRole} = render(
      <form onReset={(event) => event.preventDefault()}>
        <MarkdownEditor mode="source" label="Document" defaultValue="Initial" />
      </form>,
    );
    await replaceVisibleLine(getByRole('textbox'), 'Changed');
    await act(async () => {
      container.querySelector('form')!.reset();
      await Promise.resolve();
    });
    expect(getByRole('textbox').textContent).toBe('Changed');
  });

  it('transfers focus between document modes when the document owns focus', () => {
    const {getByRole, rerender} = render(
      <MarkdownEditor mode="source" label="Document" defaultValue="# Reading" />,
    );
    act(() => {
      getByRole('textbox').focus();
    });
    rerender(<MarkdownEditor label="Document" defaultValue="# Reading" mode="preview" />);
    expect(document.activeElement).toBe(getByRole('region'));
    rerender(<MarkdownEditor mode="source" label="Document" defaultValue="# Reading" />);
    expect(document.activeElement).toBe(getByRole('textbox'));
  });

  it('allows Tab to leave an editor that becomes disabled while focused', () => {
    const {getByRole, rerender} = render(<MarkdownEditor mode="source" label="Document" />);
    const editor = getByRole('textbox');
    editor.focus();
    rerender(<MarkdownEditor mode="source" label="Document" isDisabled />);
    const tab = new KeyboardEvent('keydown', {key: 'Tab', bubbles: true, cancelable: true});
    editor.dispatchEvent(tab);
    expect(tab.defaultPrevented).toBe(false);
  });

  it('hydrates all three modes without duplicate accessible editors', async () => {
    function View() {
      const [value, setValue] = useState('# Source\n\nInitial text.');
      return (
        <AppearanceProvider accent="#2878ff" appearance="dark">
          <MarkdownEditor mode="source" label="Source" value={value} onChange={setValue} />
          <MarkdownEditor
            label="Live"
            defaultValue="# Live document"
            renderToolbar={(controls) => (
              <Toolbar label="Formatting">
                <Button
                  isDisabled={!controls.canExecute('bold')}
                  onPress={() => controls.execute('bold')}
                >
                  Bold
                </Button>
              </Toolbar>
            )}
          />
          <MarkdownEditor
            label="Reading"
            mode="preview"
            defaultValue={'# Reading\n\nA note[^1].\n\n[^1]: Detail.'}
          />
        </AppearanceProvider>
      );
    }
    const server = renderToString(<View />);
    expect(server).toContain('# Source');
    expect(server).toContain('<h1>Reading</h1>');
    expect(server).toContain('Formatting');
    const container = document.createElement('div');
    document.body.append(container);
    container.innerHTML = server;
    const onRecoverableError = vi.fn();
    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(container, <View />, {onRecoverableError});
      await Promise.resolve();
    });
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(within(container).getByRole('button', {name: 'Bold'}).hasAttribute('disabled')).toBe(
      false,
    );
    await waitFor(() => expect(within(container).getAllByRole('textbox')).toHaveLength(2));
    expect(
      within(within(container).getByRole('textbox', {name: 'Live'})).getByRole('heading', {
        name: 'Live document',
      }),
    ).toBeTruthy();
    await act(async () => {
      root.unmount();
      await Promise.resolve();
    });
    container.remove();
  });
});
