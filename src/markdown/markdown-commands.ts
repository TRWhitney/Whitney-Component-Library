import {isolateHistory, redo, redoDepth, undo, undoDepth} from '@codemirror/commands';
import {insertNewlineContinueMarkupCommand} from '@codemirror/lang-markdown';
import {ensureSyntaxTree, syntaxTree} from '@codemirror/language';
import {EditorSelection, EditorState, Transaction, type ChangeSpec} from '@codemirror/state';
import {EditorView, type KeyBinding} from '@codemirror/view';

import type {MarkdownCommand} from './markdown-types.js';

const inlineNodes = {
  bold: 'StrongEmphasis',
  italic: 'Emphasis',
  strikethrough: 'Strikethrough',
  'inline-code': 'InlineCode',
  link: 'Link',
} as const;

const commands = new Set<string>([
  ...Object.keys(inlineNodes),
  'heading-1',
  'heading-2',
  'heading-3',
  'heading-4',
  'heading-5',
  'heading-6',
  'paragraph',
  'blockquote',
  'bullet-list',
  'ordered-list',
  'task-list',
  'code-block',
  'horizontal-rule',
  'undo',
  'redo',
]);

type SyntaxNode = ReturnType<ReturnType<typeof syntaxTree>['resolveInner']>;

function editable(view: EditorView) {
  return (
    !view.state.readOnly &&
    view.state.facet(EditorView.editable) &&
    !view.compositionStarted &&
    !view.composing
  );
}

function enclosing(state: EditorState, name: string): SyntaxNode | null {
  const {from, to, empty} = state.selection.main;
  const tree = ensureSyntaxTree(state, to, 50) ?? syntaxTree(state);
  for (const side of [-1, 1] as const) {
    let node: SyntaxNode | null = tree.resolveInner(from, side);
    for (; node; node = node.parent) {
      if (
        node.name === name &&
        node.from <= from &&
        node.to >= to &&
        (!empty || (node.from < from && node.to > from))
      )
        return node;
    }
  }
  return null;
}

function selectedLines(state: EditorState) {
  const {from, to} = state.selection.main;
  const first = state.doc.lineAt(from);
  const last = state.doc.lineAt(to > from && state.doc.lineAt(to).from === to ? to - 1 : to);
  return Array.from({length: last.number - first.number + 1}, (_, index) =>
    state.doc.line(first.number + index),
  );
}

function literalSelection(state: EditorState, allowInline = false) {
  const {from, to, empty} = state.selection.main;
  const lines = selectedLines(state);
  const lineFrom = lines[0]!.from;
  const lineTo = lines[lines.length - 1]!.to;
  const tree = ensureSyntaxTree(state, lineTo, 50) ?? syntaxTree(state);
  let literal = false;
  tree.iterate({
    from: lineFrom,
    to: lineTo,
    enter(node) {
      if (
        node.name !== 'FencedCode' &&
        node.name !== 'CodeBlock' &&
        (allowInline || node.name !== 'InlineCode')
      )
        return;
      if (
        node.name !== 'InlineCode' ||
        (empty ? node.from < from && node.to > from : node.from < to && node.to > from)
      ) {
        literal = true;
      }
    },
  });
  return literal;
}

export function canExecuteMarkdownCommand(view: EditorView, command: MarkdownCommand): boolean {
  if (!commands.has(command) || !editable(view) || view.state.selection.ranges.length !== 1)
    return false;
  if (command === 'undo') return undoDepth(view.state) > 0;
  if (command === 'redo') return redoDepth(view.state) > 0;
  if (command === 'inline-code' && enclosing(view.state, 'InlineCode')) return true;
  if (command === 'code-block') {
    const node = enclosing(view.state, 'FencedCode');
    if (node) return !!closedFence(view.state, node);
  }
  return !literalSelection(view.state, !(command in inlineNodes));
}

function lineKind(
  state: EditorState,
  line: ReturnType<EditorState['doc']['line']>,
): MarkdownCommand {
  let node: SyntaxNode | null = syntaxTree(state).resolveInner(line.from, 1);
  for (; node; node = node.parent) {
    if (node.name === 'SetextHeading1') return 'heading-1';
    if (node.name === 'SetextHeading2') return 'heading-2';
    if (node.name === 'HorizontalRule') return 'horizontal-rule';
  }
  const {text} = line;
  if (/^ {0,3}>/.test(text)) return 'blockquote';
  if (/^ {0,3}[-+*]\s+\[[ xX]\](?:\s|$)/.test(text)) return 'task-list';
  if (/^ {0,3}[-+*](?:\s|$)/.test(text)) return 'bullet-list';
  if (/^ {0,3}\d+[.)](?:\s|$)/.test(text)) return 'ordered-list';
  const heading = /^ {0,3}(#{1,6})(?:\s|$)/.exec(text);
  if (heading) return `heading-${heading[1]!.length}` as MarkdownCommand;
  return 'paragraph';
}

export function isMarkdownCommandActive(view: EditorView, command: MarkdownCommand): boolean {
  if (!commands.has(command) || command === 'undo' || command === 'redo') return false;
  if (command in inlineNodes) {
    return !!enclosing(view.state, inlineNodes[command as keyof typeof inlineNodes]);
  }
  if (command === 'code-block') return !!enclosing(view.state, 'FencedCode');
  if (literalSelection(view.state, true)) return false;
  return selectedLines(view.state).every((line) => lineKind(view.state, line) === command);
}

function dispatchEdit(view: EditorView, changes: ChangeSpec, anchor: number, head = anchor) {
  view.dispatch({
    changes,
    selection: EditorSelection.single(anchor, head),
    annotations: [isolateHistory.of('full'), Transaction.userEvent.of('input.markdown-command')],
    scrollIntoView: true,
  });
  view.focus();
  return true;
}

function removeWrapper(
  view: EditorView,
  from: number,
  contentFrom: number,
  contentTo: number,
  to: number,
) {
  const {anchor, head} = view.state.selection.main;
  const changes = view.state.changes([
    {from, to: contentFrom},
    {from: contentTo, to},
  ]);
  return dispatchEdit(view, changes, changes.mapPos(anchor), changes.mapPos(head));
}

function toggleInline(view: EditorView, command: keyof typeof inlineNodes) {
  const {state} = view;
  const {from, to, anchor, head} = state.selection.main;
  const node = enclosing(state, inlineNodes[command]);
  if (node && command !== 'link') {
    const opening = node.firstChild;
    const closing = node.lastChild;
    if (opening && closing && opening !== closing) {
      let contentFrom = opening.to;
      let contentTo = closing.from;
      // Code spans use one padding space on each side when their content needs it.
      if (command === 'inline-code') {
        const content = state.sliceDoc(contentFrom, contentTo);
        if (content.startsWith(' ') && content.endsWith(' ') && /[^ ]/.test(content)) {
          contentFrom++;
          contentTo--;
        }
      }
      return removeWrapper(view, node.from, contentFrom, contentTo, node.to);
    }
  }
  const text = state.sliceDoc(from, to);
  if (command === 'link') {
    const destination = 'https://';
    const label = text.replace(/\\.|\\$|[[\]]/g, (match) =>
      match.length === 1 ? `\\${match}` : match,
    );
    const prefix = `[${label}](`;
    return dispatchEdit(
      view,
      {from, to, insert: `${prefix}${destination})`},
      from + prefix.length,
      from + prefix.length + destination.length,
    );
  }
  let delimiter = command === 'bold' ? '**' : command === 'italic' ? '*' : '~~';
  let padding = '';
  if (command === 'inline-code') {
    const longest = Math.max(0, ...Array.from(text.matchAll(/`+/g), (match) => match[0].length));
    delimiter = '`'.repeat(longest + 1);
    if (/^`|`$/.test(text) || (/^ .* $/.test(text) && /[^ ]/.test(text))) padding = ' ';
  }
  // Empty wrappers have no parsed inline node, but can still be toggled off.
  if (
    from === to &&
    state.sliceDoc(Math.max(0, from - delimiter.length), from) === delimiter &&
    state.sliceDoc(to, to + delimiter.length) === delimiter
  ) {
    return removeWrapper(view, from - delimiter.length, from, to, to + delimiter.length);
  }
  const leading = command === 'inline-code' ? '' : /^\s*/.exec(text)![0];
  const remainder = text.slice(leading.length);
  const trailing = command === 'inline-code' ? '' : /\s*$/.exec(remainder)![0];
  const content = remainder.slice(0, remainder.length - trailing.length);
  const prefix = leading + delimiter + padding;
  const contentFrom = from + prefix.length;
  const contentTo = contentFrom + content.length;
  return dispatchEdit(
    view,
    {from, to, insert: prefix + content + padding + delimiter + trailing},
    anchor <= head ? contentFrom : contentTo,
    anchor <= head ? contentTo : contentFrom,
  );
}

function blockPrefix(command: MarkdownCommand, index: number) {
  if (command.startsWith('heading-')) return '#'.repeat(Number(command.slice(-1))) + ' ';
  if (command === 'blockquote') return '> ';
  if (command === 'bullet-list') return '- ';
  if (command === 'ordered-list') return `${index + 1}. `;
  if (command === 'task-list') return '- [ ] ';
  return '';
}

function transformLines(view: EditorView, command: MarkdownCommand) {
  const {state} = view;
  const lines = selectedLines(state);
  const toggleOff =
    command !== 'paragraph' &&
    !command.startsWith('heading-') &&
    lines.every((line) => lineKind(state, line) === command);
  const underlines = new Set<number>();
  const edits: {from: number; to: number; insert: string}[] = [];
  if (command === 'paragraph' || command.startsWith('heading-')) {
    const tree = ensureSyntaxTree(state, lines[lines.length - 1]!.to, 50) ?? syntaxTree(state);
    tree.iterate({
      from: lines[0]!.from,
      to: lines[lines.length - 1]!.to,
      enter(node) {
        if (node.name !== 'SetextHeading1' && node.name !== 'SetextHeading2') return;
        const underline = state.doc.lineAt(node.to);
        underlines.add(underline.number);
        edits.push({from: underline.from - 1, to: underline.to, insert: ''});
      },
    });
  }
  edits.push(
    ...lines
      .filter((line) => !underlines.has(line.number))
      .flatMap((line, index) => {
        const marker =
          /^ {0,3}(?:#{1,6}(?:[ \t]+|$)|>[ \t]?|(?:[-+*]|\d+[.)])(?:[ \t]+(?:\[[ xX]\](?:[ \t]+|$))?|$))/.exec(
            line.text,
          );
        const opening = {
          from: line.from,
          to: line.from + (marker?.[0].length ?? 0),
          insert: toggleOff ? '' : blockPrefix(command, index),
        };
        const closing = /^ {0,3}#{1,6}(?:[ \t]|$)/.test(line.text)
          ? /[ \t]+#+[ \t]*$/.exec(line.text)
          : null;
        return closing
          ? [
              opening,
              {from: Math.max(opening.to, line.from + closing.index), to: line.to, insert: ''},
            ]
          : [opening];
      }),
  );
  const changes = state.changes(edits.sort((left, right) => left.from - right.from));
  const {anchor, head} = state.selection.main;
  return dispatchEdit(view, changes, changes.mapPos(anchor, 1), changes.mapPos(head, 1));
}

function closedFence(state: EditorState, node: SyntaxNode) {
  if (node.lastChild?.name !== 'CodeMark' || node.lastChild.from === node.firstChild?.from) {
    return null;
  }
  const opening = state.doc.lineAt(node.from);
  const closing = state.doc.lineAt(node.to);
  if (opening.number === closing.number || !/^ {0,3}(?:`{3,}|~{3,})\s*$/.test(closing.text)) {
    return null;
  }
  return {opening, closing};
}

function fencedCode(view: EditorView) {
  const {state} = view;
  const node = enclosing(state, 'FencedCode');
  if (node) {
    const fence = closedFence(state, node);
    if (!fence) return false;
    const {opening, closing} = fence;
    const contentFrom = opening.to + 1;
    return removeWrapper(
      view,
      opening.from,
      contentFrom,
      Math.max(contentFrom, closing.from - 1),
      closing.to,
    );
  }
  const lines = selectedLines(state);
  const from = lines[0]!.from;
  const to = lines[lines.length - 1]!.to;
  const text = state.sliceDoc(from, to);
  const longest = Math.max(2, ...Array.from(text.matchAll(/`+/g), (match) => match[0].length));
  const fence = '`'.repeat(longest + 1);
  const prefix = fence + '\n';
  const {anchor, head} = state.selection.main;
  return dispatchEdit(
    view,
    {from, to, insert: prefix + text + '\n' + fence},
    anchor + prefix.length,
    head + prefix.length,
  );
}

function horizontalRule(view: EditorView) {
  const lines = selectedLines(view.state);
  if (view.state.selection.main.empty) {
    const line = lines[0]!;
    const previousIsProse = line.number > 1 && view.state.doc.line(line.number - 1).text.trim();
    const insert = (line.length ? '\n\n' : previousIsProse ? '\n' : '') + '---\n';
    return dispatchEdit(view, {from: line.to, insert}, line.to + insert.length);
  }
  const from = lines[0]!.from;
  const to = lines[lines.length - 1]!.to;
  // Blank lines keep the rule separate from surrounding paragraphs and headings.
  const prefix = from > 0 ? '\n' : '';
  const insert = prefix + '---\n' + (to < view.state.doc.length ? '\n' : '');
  return dispatchEdit(view, {from, to, insert}, from + prefix.length + 4);
}

export function runMarkdownCommand(view: EditorView, command: MarkdownCommand): boolean {
  if (!canExecuteMarkdownCommand(view, command)) return false;
  if (command === 'undo' || command === 'redo') {
    const changed = (command === 'undo' ? undo : redo)(view);
    if (changed) view.focus();
    return changed;
  }
  if (command in inlineNodes) return toggleInline(view, command as keyof typeof inlineNodes);
  if (command === 'code-block') return fencedCode(view);
  if (command === 'horizontal-rule') return horizontalRule(view);
  return transformLines(view, command);
}

const continueMarkup = insertNewlineContinueMarkupCommand({nonTightLists: false});

function continueMarkdown(view: EditorView) {
  if (!editable(view) || literalSelection(view.state)) return false;
  const range = view.state.selection.main;
  const line = view.state.doc.lineAt(range.head);
  const emptyQuote = /^((?: {0,3}> ?)* {0,3})>[ \t]*$/.exec(line.text);
  if (range.empty && emptyQuote && range.head > line.from + emptyQuote[1]!.length) {
    const from = line.from + emptyQuote[1]!.length;
    let node: SyntaxNode | null = syntaxTree(view.state).resolveInner(from, 1);
    for (; node; node = node.parent) {
      if (node.name === 'Blockquote') {
        return dispatchEdit(view, {from, to: line.to}, from);
      }
    }
  }
  return continueMarkup({
    state: view.state,
    dispatch(transaction) {
      view.dispatch(
        transaction.startState.update({
          changes: transaction.changes,
          selection: transaction.newSelection,
          annotations: [isolateHistory.of('full'), Transaction.userEvent.of('input')],
          scrollIntoView: true,
        }),
      );
    },
  });
}

const formattingKeys: readonly (readonly [string, MarkdownCommand])[] = [
  ['Mod-b', 'bold'],
  ['Mod-i', 'italic'],
  ['Mod-Shift-x', 'strikethrough'],
  ['Mod-Shift-c', 'inline-code'],
  ['Mod-k', 'link'],
  ['Mod-Alt-0', 'paragraph'],
  ['Mod-Alt-1', 'heading-1'],
  ['Mod-Alt-2', 'heading-2'],
  ['Mod-Alt-3', 'heading-3'],
  ['Mod-Alt-4', 'heading-4'],
  ['Mod-Alt-5', 'heading-5'],
  ['Mod-Alt-6', 'heading-6'],
];

export const markdownCommandKeymap: readonly KeyBinding[] = [
  ...formattingKeys.map(([key, command]) => ({
    key,
    run: (view: EditorView) => runMarkdownCommand(view, command),
  })),
  {key: 'Enter', run: continueMarkdown},
];

export function markdownCommandStatus(view: EditorView) {
  const available: MarkdownCommand[] = [];
  const active: MarkdownCommand[] = [];
  for (const value of commands) {
    const command = value as MarkdownCommand;
    if (canExecuteMarkdownCommand(view, command)) available.push(command);
    if (isMarkdownCommandActive(view, command)) active.push(command);
  }
  return {available, active};
}
