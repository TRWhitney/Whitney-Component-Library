import {act, cleanup, fireEvent, render} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {
  MarkdownEditor,
  Button,
  type MarkdownExtension,
  type MarkdownEditorControls,
  type MarkdownSnapshot,
} from '../src/index.js';

afterEach(cleanup);
const syntax: MarkdownExtension = {
  id: 'review',
  syntax: [
    {id: 'highlight', kind: 'inline', delimiter: '==', treatment: 'highlight'},
    {id: 'note', kind: 'fence', name: 'review-note', treatment: 'note'},
  ],
};
const value = 'Check ==north boundary==.\n\n```review-note\nCompare after convergence.\n```';

describe('declared Markdown extensions', () => {
  it.each(['preview', 'live-preview'] as const)(
    'renders declared inline and fence syntax in %s without changing Markdown',
    (mode) => {
      const onChange = vi.fn();
      const {container, getByRole} = render(
        <MarkdownEditor
          label="Document"
          defaultValue={value}
          mode={mode}
          extensions={[syntax]}
          onChange={onChange}
        />,
      );
      expect(container.querySelector('mark')?.textContent).toBe('north boundary');
      expect(getByRole('note').textContent).toContain('Compare after convergence.');
      expect(container.querySelector('textarea')?.value).toBe(value);
      expect(onChange).not.toHaveBeenCalled();
    },
  );

  it('reveals custom syntax at the source selection and restores it after moving away', () => {
    const {container, getByRole} = render(
      <MarkdownEditor label="Document" defaultValue={value} extensions={[syntax]} />,
    );
    const editor = getByRole('textbox');
    act(() => editor.focus());
    fireEvent.keyDown(editor, {key: 'Home', ctrlKey: true});
    for (let i = 0; i < 9; i++) fireEvent.keyDown(editor, {key: 'ArrowRight'});
    expect(editor.textContent).toContain('==north boundary==');
    fireEvent.keyDown(editor, {key: 'Home', ctrlKey: true});
    expect(container.querySelector('mark')?.textContent).toBe('north boundary');
    expect(editor.textContent).not.toContain('==north boundary==');
  });

  it('keeps escapes, code, built-in formatting, and incomplete declarations literal', () => {
    const text = '\\==escaped== `==code==` ==**bold**== ==unfinished';
    const {container} = render(
      <MarkdownEditor label="Document" mode="preview" defaultValue={text} extensions={[syntax]} />,
    );
    expect(container.querySelector('mark')).toBeNull();
    expect(container.querySelector('code')?.textContent).toBe('==code==');
    expect(container.querySelector('strong')?.textContent).toBe('bold');
  });

  it('executes a custom command through the retained selection with isolated undo', () => {
    const execute = vi.fn(({value, selection}: MarkdownSnapshot) => ({
      edits: [
        {
          from: selection.anchor,
          to: selection.head,
          insert: value.slice(selection.anchor, selection.head).toUpperCase(),
        },
      ],
    }));
    const extension: MarkdownExtension = {
      id: 'review',
      commands: [{id: 'uppercase', shortcut: 'Mod-Shift-E', execute}],
    };
    const {getByRole, container} = render(
      <MarkdownEditor
        label="Document"
        mode="source"
        defaultValue="north"
        extensions={[extension]}
        renderToolbar={(c) => (
          <Button
            isDisabled={!c.canExecuteExtension('uppercase')}
            onPress={() => c.executeExtension('uppercase')}
          >
            Uppercase
          </Button>
        )}
      />,
    );
    const editor = getByRole('textbox');
    act(() => editor.focus());
    fireEvent.keyDown(editor, {key: 'a', ctrlKey: true});
    fireEvent.click(getByRole('button', {name: 'Uppercase'}));
    expect(container.querySelector('textarea')?.value).toBe('NORTH');
    expect(Object.isFrozen(execute.mock.calls[0]?.[0])).toBe(true);
    expect(Object.isFrozen(execute.mock.calls[0]?.[0].selection)).toBe(true);
    fireEvent.keyDown(editor, {key: 'z', ctrlKey: true});
    expect(container.querySelector('textarea')?.value).toBe('north');
  });

  it('rejects invalid custom edits before changing the canonical value', () => {
    let controls: MarkdownEditorControls | undefined;
    const onChange = vi.fn();
    const {container} = render(
      <MarkdownEditor
        label="Document"
        defaultValue="north"
        onChange={onChange}
        extensions={[
          {
            id: 'review',
            commands: [{id: 'bad', execute: () => ({edits: [{from: 0, to: 99, insert: 'gone'}]})}],
          },
        ]}
        renderToolbar={(c) => {
          controls = c;
          return null;
        }}
      />,
    );
    expect(controls?.canExecuteExtension('bad')).toBe(true);
    expect(() => controls!.executeExtension('bad')).toThrow();
    expect(container.querySelector('textarea')?.value).toBe('north');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('adds semantic source decorations without replacing the text', () => {
    const {container} = render(
      <MarkdownEditor
        label="Document"
        mode="source"
        defaultValue="north boundary"
        extensions={[{id: 'review', decorate: () => [{from: 0, to: 5, treatment: 'accent'}]}]}
      />,
    );
    expect(container.querySelector('[data-wcl-markdown-treatment="accent"]')?.textContent).toBe(
      'north',
    );
    expect(container.querySelector('textarea')?.value).toBe('north boundary');
  });

  it('routes declared prefixes before the general wiki resolver', () => {
    const general = vi.fn(() => ({href: '/general'})),
      navigate = vi.fn();
    const {getByRole} = render(
      <MarkdownEditor
        label="Document"
        mode="preview"
        defaultValue="[[issue:42]]"
        wikiLinks={{resolve: general, onNavigate: vi.fn()}}
        extensions={[
          {
            id: 'issues',
            links: [
              {
                prefix: 'issue:',
                resolve: (target) => ({href: '/issues/' + target.slice(6), label: 'Issue 42'}),
                onNavigate: navigate,
              },
            ],
          },
        ]}
      />,
    );
    fireEvent.click(getByRole('link', {name: 'Issue 42'}));
    expect(navigate).toHaveBeenCalledWith({
      target: 'issue:42',
      href: '/issues/42',
      label: 'Issue 42',
    });
    expect(general).not.toHaveBeenCalled();
  });

  it.each(
    (
      [
        [{id: 'review'}, {id: 'review'}],
        [
          {
            id: 'review',
            syntax: [{id: 'bad', kind: 'inline', delimiter: '**', treatment: 'highlight'}],
          },
        ],
        [{id: 'review', commands: [{id: 'bad', shortcut: 'Mod-Shift-X', execute: () => null}]}],
        [
          {
            id: 'review',
            links: [
              {prefix: 'note:', resolve: () => null, onNavigate: () => {}},
              {prefix: 'note:child', resolve: () => null, onNavigate: () => {}},
            ],
          },
        ],
        [{id: 'review', decorate: () => [{from: -1, to: 2, treatment: 'accent'}]}],
      ] satisfies readonly (readonly MarkdownExtension[])[]
    ).map((extensions) => ({extensions})),
  )('rejects conflicting declarations or malformed ranges %j', ({extensions}) => {
    expect(() =>
      render(<MarkdownEditor label="Document" defaultValue="north" extensions={extensions} />),
    ).toThrow();
  });
});
