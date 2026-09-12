import {Compartment, EditorState, Transaction} from '@codemirror/state';
import {EditorView, keymap} from '@codemirror/view';
import {defaultKeymap, history, historyKeymap, insertNewline} from '@codemirror/commands';
import {markdown} from '@codemirror/lang-markdown';
import {syntaxHighlighting} from '@codemirror/language';
import {classHighlighter} from '@lezer/highlight';

import {liveFocus, liveLabels} from './live-effects.js';
import {livePreview} from './live-preview.js';
import type {MarkdownEditorLabels} from './markdown-types.js';

interface SourceConfiguration {
  readonly labels: MarkdownEditorLabels;
  readonly livePreview: boolean;
  readonly attributes: Record<string, string>;
  readonly isDisabled: boolean;
  readonly isReadOnly: boolean;
}

export interface SourceSession {
  configure: (configuration: SourceConfiguration) => void;
  replace: (value: string, resetHistory?: boolean) => void;
  focus: () => void;
  hasFocus: () => boolean;
  refresh: () => void;
  destroy: () => void;
}

export function createSourceSession(
  parent: HTMLElement,
  value: string,
  configuration: SourceConfiguration,
  onChange: (value: string) => void,
  onPosition: (line: number, column: number) => void,
): SourceSession {
  const settings = new Compartment();
  const undoHistory = new Compartment();
  const presentation = new Compartment();
  let showingLive = configuration.livePreview;
  const configure = (next: SourceConfiguration) => [
    liveLabels.of(next.labels),
    EditorState.readOnly.of(next.isReadOnly || next.isDisabled),
    EditorView.editable.of(!next.isDisabled),
    EditorView.contentAttributes.of(next.attributes),
  ];
  const view = new EditorView({
    parent,
    state: EditorState.create({
      doc: value,
      extensions: [
        // Only LF is structural. CR characters remain in the canonical text unchanged.
        EditorState.lineSeparator.of('\n'),
        EditorView.lineWrapping,
        EditorView.perLineTextDirection.of(true),
        presentation.of(showingLive ? livePreview : []),
        settings.of(configure(configuration)),
        undoHistory.of(history()),
        keymap.of([{key: 'Enter', run: insertNewline}, ...defaultKeymap, ...historyKeymap]),
        markdown({addKeymap: false, completeHTMLTags: false}),
        syntaxHighlighting(classHighlighter),
        EditorView.updateListener.of((update) => {
          if (
            update.docChanged &&
            update.transactions.some((transaction) => !transaction.annotation(externalChange))
          ) {
            onChange(update.state.doc.toString());
          }
          if (update.docChanged || update.selectionSet) {
            const head = update.state.selection.main.head;
            const line = update.state.doc.lineAt(head);
            onPosition(line.number, head - line.from + 1);
          }
        }),
      ],
    }),
  });

  return {
    configure(next) {
      const effects = [settings.reconfigure(configure(next))];
      if (next.livePreview !== showingLive) {
        showingLive = next.livePreview;
        effects.push(presentation.reconfigure(showingLive ? livePreview : []));
        effects.push(view.scrollSnapshot());
        if (showingLive) effects.push(liveFocus.of(view.hasFocus));
      }
      view.dispatch({effects});
    },
    replace(next, resetHistory = false) {
      const previous = view.state.doc.toString();
      if (resetHistory) {
        view.dispatch({effects: undoHistory.reconfigure([])});
      }
      if (previous !== next) {
        let from = 0;
        while (from < previous.length && from < next.length && previous[from] === next[from])
          from++;
        let oldEnd = previous.length;
        let newEnd = next.length;
        while (oldEnd > from && newEnd > from && previous[oldEnd - 1] === next[newEnd - 1]) {
          oldEnd--;
          newEnd--;
        }
        view.dispatch({
          changes: {from, to: oldEnd, insert: next.slice(from, newEnd)},
          annotations: [externalChange.of(true), Transaction.addToHistory.of(false)],
        });
      }
      if (resetHistory) {
        view.dispatch({effects: undoHistory.reconfigure(history()), selection: {anchor: 0}});
      }
    },
    focus() {
      view.focus();
    },
    hasFocus() {
      return view.hasFocus;
    },
    refresh() {
      view.requestMeasure();
    },
    destroy() {
      view.destroy();
    },
  };
}

import {Annotation} from '@codemirror/state';
const externalChange = Annotation.define<boolean>();
