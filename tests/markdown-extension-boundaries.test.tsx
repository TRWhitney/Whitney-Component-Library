import {act, cleanup, fireEvent, render} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {
  MarkdownEditor,
  type MarkdownExtension,
  type MarkdownEditorControls,
  type MarkdownSnapshot,
} from '../src/index.js';
afterEach(cleanup);
const command: MarkdownExtension = {
  id: 'review',
  commands: [
    {
      id: 'insert',
      shortcut: 'Mod-Shift-E',
      execute: ({selection}) => ({
        edits: [{from: selection.anchor, to: selection.head, insert: 'north'}],
      }),
    },
  ],
};
describe('Markdown extension boundaries', () => {
  it('rejects a non-boolean command availability result from JavaScript', () => {
    expect(() =>
      render(
        <MarkdownEditor
          label="Document"
          extensions={[
            {
              id: 'review',
              commands: [
                {
                  id: 'invalid',
                  execute: () => null,
                  isEnabled: (() => null) as unknown as () => boolean,
                },
              ],
            },
          ]}
        />,
      ),
    ).toThrow();
  });
  it('maps the selection when a custom command replaces the selected passage', () => {
    let controls: MarkdownEditorControls | undefined;
    const inspect = vi.fn(() => null);
    render(
      <MarkdownEditor
        label="Document"
        defaultValue="north"
        extensions={[
          {
            id: 'review',
            commands: [
              {id: 'select', execute: () => ({edits: [], selection: {anchor: 2, head: 4}})},
              {id: 'replace', execute: () => ({edits: [{from: 0, to: 5, insert: 'south'}]})},
              {id: 'inspect', execute: inspect},
            ],
          },
        ]}
        renderToolbar={(next) => {
          controls = next;
          return null;
        }}
      />,
    );
    act(() => {
      controls!.executeExtension('select');
    });
    act(() => {
      controls!.executeExtension('replace');
    });
    act(() => {
      controls!.executeExtension('inspect');
    });
    expect(inspect).toHaveBeenCalledWith({value: 'south', selection: {anchor: 5, head: 5}});
  });
  it.each([
    {anchor: 2, head: 4},
    {anchor: 4, head: 2},
  ])('collapses a selection replaced by the document owner (%j)', (selection) => {
    let controls: MarkdownEditorControls | undefined;
    const inspect = vi.fn(() => null);
    const extensions: readonly MarkdownExtension[] = [
      {
        id: 'review',
        commands: [
          {id: 'select', execute: () => ({edits: [], selection})},
          {id: 'inspect', execute: inspect},
        ],
      },
    ];
    const toolbar = (next: MarkdownEditorControls) => {
      controls = next;
      return null;
    };
    const {rerender} = render(
      <MarkdownEditor
        label="Document"
        value="north"
        onChange={vi.fn()}
        extensions={extensions}
        renderToolbar={toolbar}
      />,
    );
    act(() => {
      controls!.executeExtension('select');
    });
    rerender(
      <MarkdownEditor
        label="Document"
        value="replaced document"
        onChange={vi.fn()}
        extensions={extensions}
        renderToolbar={toolbar}
      />,
    );
    act(() => {
      controls!.executeExtension('inspect');
    });
    expect(inspect).toHaveBeenCalledWith({
      value: 'replaced document',
      selection: {anchor: 17, head: 17},
    });
    expect(controls!.canExecute('bold')).toBe(true);
  });
  it('accepts adjacent disjoint command edits', () => {
    let controls: MarkdownEditorControls | undefined;
    const {container} = render(
      <MarkdownEditor
        label="Document"
        defaultValue="ab"
        extensions={[
          {
            id: 'review',
            commands: [
              {
                id: 'replace',
                execute: () => ({
                  edits: [
                    {from: 0, to: 1, insert: 'A'},
                    {from: 1, to: 2, insert: 'B'},
                  ],
                }),
              },
            ],
          },
        ]}
        renderToolbar={(c) => {
          controls = c;
          return null;
        }}
      />,
    );
    act(() => {
      controls!.executeExtension('replace');
    });
    expect(container.querySelector('textarea')?.value).toBe('AB');
  });
  it('reserves the built-in selection history shortcut', () => {
    expect(() =>
      render(
        <MarkdownEditor
          label="Document"
          extensions={[
            {
              id: 'review',
              commands: [{id: 'action', shortcut: 'Mod-Shift-U', execute: () => null}],
            },
          ]}
        />,
      ),
    ).toThrow();
  });
  it.each([
    {isReadOnly: true},
    {isDisabled: true},
    {isPending: true, pendingMessage: 'Waiting'},
    {isLocked: true, lockMessage: 'Locked'},
    {mode: 'preview'},
  ] as const)('blocks custom edits in %j', (props) => {
    let controls: MarkdownEditorControls | undefined;
    const {container} = render(
      <MarkdownEditor
        {...props}
        label="Document"
        defaultValue="mesh"
        extensions={[command]}
        renderToolbar={(c) => {
          controls = c;
          return null;
        }}
      />,
    );
    expect(controls!.canExecuteExtension('insert')).toBe(false);
    expect(controls!.executeExtension('insert')).toBe(false);
    expect(container.querySelector('textarea')?.value).toBe('mesh');
  });
  it('runs the declared keyboard binding and suppresses it during composition', () => {
    const {getByRole, container} = render(
      <MarkdownEditor label="Document" mode="source" extensions={[command]} />,
    );
    const editor = getByRole('textbox');
    act(() => editor.focus());
    fireEvent.keyDown(editor, {key: 'e', code: 'KeyE', ctrlKey: true, shiftKey: true});
    expect(container.querySelector('textarea')?.value).toBe('north');
    fireEvent.compositionStart(editor);
    fireEvent.keyDown(editor, {key: 'e', code: 'KeyE', ctrlKey: true, shiftKey: true});
    expect(container.querySelector('textarea')?.value).toBe('north');
  });
  it('retains controlled authority over custom commands', () => {
    let controls: MarkdownEditorControls | undefined;
    const onChange = vi.fn();
    const {container} = render(
      <MarkdownEditor
        label="Document"
        value="mesh"
        onChange={onChange}
        extensions={[command]}
        renderToolbar={(c) => {
          controls = c;
          return null;
        }}
      />,
    );
    act(() => {
      controls!.executeExtension('insert');
    });
    expect(onChange).toHaveBeenCalledWith('northmesh');
    expect(container.querySelector('textarea')?.value).toBe('mesh');
  });
  it('rejects a non-array declaration list from JavaScript', () => {
    expect(() =>
      render(
        <MarkdownEditor
          label="Document"
          extensions={{id: 'bad'} as unknown as readonly MarkdownExtension[]}
        />,
      ),
    ).toThrow();
  });
  it('rejects invalid contributed decoration state before a custom edit commits', () => {
    let controls: MarkdownEditorControls | undefined;
    const onChange = vi.fn();
    const decorate = ({value}: MarkdownSnapshot) => [
      {from: 0, to: value === 'northmesh' ? 100 : 1, treatment: 'accent' as const},
    ];
    const {container} = render(
      <MarkdownEditor
        label="Document"
        defaultValue="mesh"
        onChange={onChange}
        extensions={[{...command, decorate}]}
        renderToolbar={(c) => {
          controls = c;
          return null;
        }}
      />,
    );
    expect(() => controls!.executeExtension('insert')).toThrow();
    expect(container.querySelector('textarea')?.value).toBe('mesh');
    expect(onChange).not.toHaveBeenCalled();
  });
  it('does not fall through a declared prefix that resolves to an unsafe URL', () => {
    const fallback = vi.fn(() => ({href: '/fallback'}));
    const {queryByRole} = render(
      <MarkdownEditor
        label="Document"
        mode="preview"
        defaultValue="[[issue:42]]"
        wikiLinks={{resolve: fallback, onNavigate: vi.fn()}}
        extensions={[
          {
            id: 'review',
            links: [
              {
                prefix: 'issue:',
                resolve: () => ({href: 'javascript:alert(1)'}),
                onNavigate: vi.fn(),
              },
            ],
          },
        ]}
      />,
    );
    expect(queryByRole('link')).toBeNull();
    expect(fallback).not.toHaveBeenCalled();
  });
});
