import {
  StateField,
  Prec,
  type EditorState,
  type Extension,
  type Range,
  type RangeSet,
} from '@codemirror/state';
import {BlockWrapper, Decoration, EditorView, keymap, type DecorationSet} from '@codemirror/view';
import type {Nodes, RootContent} from 'mdast';
import {decodeString} from 'micromark-util-decode-string';

import {
  parseLiveDocument,
  updateLiveDocument,
  sourceRange,
  type LiveDocument,
} from './live-document.js';
import {LiveWidget, MarkerWidget} from './live-widget.js';
import {wikiDocument, wikiLinks, wikiDisabled} from './wiki-navigation.js';
import {resolveWikiLink} from './wiki-resolution.js';

import {liveFocus, liveComposition, liveLabels} from './live-effects.js';

interface LiveState {
  readonly document: LiveDocument;
  readonly focused: boolean;
  readonly composing: boolean;
  readonly decorations: DecorationSet;
  readonly wrappers: RangeSet<BlockWrapper>;
}

function present(state: EditorState, document: LiveDocument, focused: boolean) {
  const decorations: Range<Decoration>[] = [];
  const wrappers: Range<BlockWrapper>[] = [];
  const value = state.doc.toString();
  const active = (from: number, to: number) =>
    focused && state.selection.ranges.some((range) => range.from <= to && range.to >= from);
  const hide = (from: number, to: number, widget?: MarkerWidget) => {
    if (to > from) decorations.push(Decoration.replace(widget ? {widget} : {}).range(from, to));
  };
  const mark = (from: number, to: number, tagName: string, attributes?: Record<string, string>) => {
    if (to > from)
      decorations.push(
        Decoration.mark({tagName, ...(attributes ? {attributes} : {})}).range(from, to),
      );
  };
  const wrap = (
    from: number,
    to: number,
    tagName: string,
    rank: number,
    attributes?: Record<string, string>,
  ) => {
    wrappers.push(
      BlockWrapper.create({tagName, rank, ...(attributes ? {attributes} : {})}).range(
        state.doc.lineAt(from).from,
        to,
      ),
    );
  };
  const replace = (node: RootContent, block: boolean) => {
    const {from, to} = sourceRange(node);
    decorations.push(
      Decoration.replace({
        block,
        widget: new LiveWidget(
          node,
          document,
          from,
          value.slice(from, to),
          block,
          state.facet(liveLabels),
          state.facet(wikiLinks),
          state.facet(wikiDisabled),
        ),
      }).range(from, to),
    );
  };

  function visit(node: Nodes, depth = 0): void {
    const {from, to} = sourceRange(node);
    if (from === to) return;
    const editing = active(from, to);
    if (['table', 'code', 'thematicBreak', 'footnoteDefinition'].includes(node.type)) {
      if (!editing) replace(node as RootContent, true);
      else wrap(from, to, 'div', 50, {'data-wcl-live-source-block': node.type});
      return;
    }
    if (
      node.type === 'image' ||
      node.type === 'imageReference' ||
      node.type === 'inlineCode' ||
      node.type === 'footnoteReference'
    ) {
      if (!editing) replace(node, false);
      return;
    }
    if (node.type === 'heading') {
      wrap(from, to, 'div', 60, {
        role: 'heading',
        'aria-level': String(node.depth),
        'data-wcl-live-heading': String(node.depth),
      });
      if (!editing && node.children.length) {
        hide(from, sourceRange(node.children[0]!).from);
        hide(sourceRange(node.children[node.children.length - 1]!).to, to);
      }
    } else if (node.type === 'strong' || node.type === 'emphasis' || node.type === 'delete') {
      const first = sourceRange(node.children[0]!).from;
      const last = sourceRange(node.children[node.children.length - 1]!).to;
      mark(
        first,
        last,
        node.type === 'strong' ? 'strong' : node.type === 'emphasis' ? 'em' : 'del',
      );
      if (!editing) {
        hide(from, first);
        hide(last, to);
      }
    } else if (node.type === 'link' || node.type === 'linkReference') {
      const first = node.children[0] ? sourceRange(node.children[0]).from : to;
      const last = node.children.length
        ? sourceRange(node.children[node.children.length - 1]!).to
        : to;
      mark(first, last, 'span', {role: 'link', 'data-wcl-live-link': ''});
      if (!editing) {
        hide(from, first);
        hide(last, to);
      }
    } else if (node.type === 'wclWikiLink') {
      if (!editing) replace(node, false);
      else {
        const link = !node.isLinkLabel && resolveWikiLink(node.value, state.facet(wikiLinks));
        mark(from + 2, to - 2, 'span', {
          'data-wcl-wiki-link': link ? 'resolved' : 'unresolved',
          ...(!node.isLinkLabel ? {'data-wcl-wiki-target': node.value} : {}),
        });
      }
    } else if (node.type === 'list') {
      wrap(from, to, 'div', 90 - depth, {role: 'list', 'data-wcl-live-list': ''});
      node.children.forEach((item, index) => {
        const range = sourceRange(item);
        wrap(range.from, range.to, 'div', 80 - depth, {role: 'listitem'});
        const line = state.doc.lineAt(range.from);
        const prefix = /^(?:[-+*]|\d+[.)])\s+(?:\[[ xX]\]\s+)?/.exec(
          value.slice(range.from, line.to),
        )?.[0];
        if (prefix && !active(range.from, range.from + prefix.length)) {
          const bullet = node.ordered ? `${(node.start ?? 1) + index}. ` : '• ';
          hide(
            range.from,
            range.from + prefix.length,
            new MarkerWidget(bullet, item.checked ?? null),
          );
        }
        item.children.forEach((child) => visit(child, depth + 2));
      });
      return;
    } else if (node.type === 'blockquote') {
      wrap(from, to, 'blockquote', 95 - depth, {'data-wcl-live-quote': ''});
      const startLine = state.doc.lineAt(from).number;
      const endLine = state.doc.lineAt(to).number;
      for (let number = startLine; number <= endLine; number++) {
        const line = state.doc.line(number);
        const offset = (node.position?.start.column ?? 1) - 1;
        const quote = /^( {0,3})> ?/.exec(line.text.slice(offset));
        const marker = line.from + offset;
        if (quote && !active(marker, marker + quote[0].length))
          hide(marker, marker + quote[0].length);
      }
    } else if (node.type === 'text') {
      for (const match of value
        .slice(from, to)
        .matchAll(/\\[!-/:-@[-`{-~]|&(?:#[xX][0-9a-fA-F]+|#[0-9]+|[a-zA-Z][a-zA-Z0-9]+);/g)) {
        const start = from + match.index;
        const end = start + match[0].length;
        const decoded = decodeString(match[0]);
        if (decoded !== match[0] && !active(start, end))
          hide(start, end, new MarkerWidget(decoded, null, false));
      }
    }
    if ('children' in node) node.children.forEach((child) => visit(child, depth + 1));
  }
  document.tree.children.forEach((node) => visit(node));
  return {
    decorations: Decoration.set(decorations, true),
    wrappers: BlockWrapper.set(wrappers, true),
  };
}

const liveState = StateField.define<LiveState>({
  create(state) {
    const document = state.field(wikiDocument, false) ?? parseLiveDocument(state.doc.toString());
    return {document, focused: false, composing: false, ...present(state, document, false)};
  },
  update(previous, transaction) {
    let focused = previous.focused;
    let composing = previous.composing;
    for (const effect of transaction.effects) {
      if (effect.is(liveFocus)) focused = effect.value;
      if (effect.is(liveComposition)) composing = effect.value;
    }
    if (composing) {
      return {
        ...previous,
        focused,
        composing,
        decorations: previous.decorations.map(transaction.changes),
        wrappers: previous.wrappers.map(transaction.changes),
      };
    }
    if (
      !transaction.docChanged &&
      !transaction.selection &&
      transaction.startState.facet(liveLabels) === transaction.state.facet(liveLabels) &&
      transaction.startState.facet(wikiLinks) === transaction.state.facet(wikiLinks) &&
      transaction.startState.facet(wikiDisabled) === transaction.state.facet(wikiDisabled) &&
      focused === previous.focused &&
      composing === previous.composing
    )
      return previous;
    const document =
      transaction.state.field(wikiDocument, false) ??
      (previous.composing
        ? parseLiveDocument(transaction.state.doc.toString())
        : transaction.docChanged
          ? updateLiveDocument(
              previous.document,
              transaction.changes,
              transaction.state.doc.toString(),
            )
          : previous.document);
    return {document, focused, composing, ...present(transaction.state, document, focused)};
  },
  provide: (field) => [
    EditorView.decorations.from(field, (value) => value.decorations),
    EditorView.blockWrappers.from(field, (value) => value.wrappers),
  ],
});

function enterBlock(view: EditorView, direction: -1 | 1): boolean {
  if (!view.state.selection.main.empty || view.composing) return false;
  const head = view.state.selection.main.head;
  const currentLine = view.state.doc.lineAt(head);
  const line = currentLine.number;
  if (currentLine.text) {
    const next = view.moveVertically(view.state.selection.main, direction === 1).head;
    if (direction === 1 ? next <= currentLine.to : next >= currentLine.from) return false;
  }
  const ranges = view.state.field(liveState).decorations.iter();
  for (; ranges.value; ranges.next()) {
    const spec: unknown = ranges.value.spec;
    if (typeof spec !== 'object' || spec === null || !('block' in spec) || spec.block !== true)
      continue;
    const before =
      direction === 1 &&
      head < ranges.from &&
      view.state.doc.lineAt(ranges.from).number === line + 1;
    const after =
      direction === -1 && head > ranges.to && view.state.doc.lineAt(ranges.to).number === line - 1;
    if (!before && !after) continue;
    const anchor = before ? ranges.from : ranges.to;
    view.dispatch({
      selection: {anchor},
      effects: [liveFocus.of(true), view.scrollSnapshot()],
      userEvent: 'select',
    });
    return true;
  }
  return false;
}

export const livePreview: Extension = [
  Prec.highest(
    keymap.of([
      {key: 'ArrowDown', run: (view) => enterBlock(view, 1)},
      {key: 'ArrowUp', run: (view) => enterBlock(view, -1)},
    ]),
  ),
  liveState,
  EditorView.domEventHandlers({
    focus(_event, view) {
      view.dispatch({effects: liveFocus.of(true)});
    },
    blur(_event, view) {
      view.dispatch({effects: liveFocus.of(false)});
    },
  }),
];
