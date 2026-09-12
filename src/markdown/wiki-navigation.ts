import {Facet, Prec, StateField, type Extension} from '@codemirror/state';
import {EditorView, keymap} from '@codemirror/view';
import type {Nodes} from 'mdast';
import type {MarkdownWikiLink, MarkdownWikiLinks} from './markdown-types.js';
import {parseLiveDocument, updateLiveDocument, sourceRange} from './live-document.js';
import {resolveWikiLink} from './wiki-resolution.js';
import {liveComposition} from './live-effects.js';

export const wikiLinks = Facet.define<MarkdownWikiLinks | undefined, MarkdownWikiLinks | undefined>(
  {
    combine: (values) => values[0],
  },
);
export const wikiDisabled = Facet.define<boolean, boolean>({
  combine: (values) => values[0] ?? false,
});

export const wikiDocument = StateField.define({
  create: (state) => parseLiveDocument(state.doc.toString()),
  update: (document, transaction) =>
    transaction.docChanged
      ? updateLiveDocument(document, transaction.changes, transaction.state.doc.toString())
      : document,
});

const composing = StateField.define({
  create: () => false,
  update: (value, transaction) => {
    for (const effect of transaction.effects) if (effect.is(liveComposition)) value = effect.value;
    return value;
  },
});

interface WikiRange {
  readonly from: number;
  readonly to: number;
  readonly target: string;
}
const wikiRanges = StateField.define<readonly WikiRange[]>({
  create: (state) => collect(state.field(wikiDocument).tree),
  update: (previous, transaction) =>
    transaction.docChanged ? collect(transaction.state.field(wikiDocument).tree) : previous,
});
function collect(tree: Nodes): WikiRange[] {
  const ranges: WikiRange[] = [];
  function visit(node: Nodes): void {
    if (node.type === 'wclWikiLink' && !node.isLinkLabel)
      ranges.push({...sourceRange(node), target: node.value});
    if ('children' in node) node.children.forEach(visit);
  }
  visit(tree);
  return ranges;
}

function canNavigate(view: EditorView): boolean {
  return !view.state.facet(wikiDisabled) && !view.composing && !view.state.field(composing, false);
}

export function currentWikiLink(view: EditorView): MarkdownWikiLink | null {
  if (!canNavigate(view) || view.state.selection.ranges.length !== 1) return null;
  const selection = view.state.selection.main;
  const range = view.state
    .field(wikiRanges)
    .find(({from, to}) => selection.from >= from && selection.to <= to);
  return range ? resolveWikiLink(range.target, view.state.facet(wikiLinks)) : null;
}

export function openWikiLink(view: EditorView): boolean {
  const link = currentWikiLink(view);
  if (!link) return false;
  view.state.facet(wikiLinks)!.onNavigate(link);
  return true;
}

export function openWikiTarget(view: EditorView, target: string): boolean {
  if (!canNavigate(view)) return false;
  const configuration = view.state.facet(wikiLinks);
  const link = resolveWikiLink(target, configuration);
  if (!link) return false;
  configuration!.onNavigate(link);
  return true;
}

export const wikiNavigation: Extension = [
  wikiDocument,
  wikiRanges,
  composing,
  Prec.highest(keymap.of([{key: 'Mod-Enter', run: openWikiLink}])),
  EditorView.domEventHandlers({
    click(event, view) {
      if (!(event.ctrlKey || event.metaKey) || event.button !== 0) return false;
      const element =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>('[data-wcl-wiki-target]')
          : null;
      if (element) {
        event.preventDefault();
        return openWikiTarget(view, element.dataset.wclWikiTarget!);
      }
      const position = view.posAtCoords({x: event.clientX, y: event.clientY});
      if (position === null) return false;
      const range = view.state
        .field(wikiRanges)
        .find(({from, to}) => position >= from && position <= to);
      if (!range) return false;
      event.preventDefault();
      return openWikiTarget(view, range.target);
    },
    compositionstart(_event, view) {
      view.dispatch({effects: liveComposition.of(true)});
    },
    compositionend(_event, view) {
      queueMicrotask(() => {
        if (view.state.field(composing, false)) view.dispatch({effects: liveComposition.of(false)});
      });
    },
  }),
];
