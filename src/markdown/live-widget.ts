import {EditorView, WidgetType} from '@codemirror/view';
import {toHast} from 'mdast-util-to-hast';
import type {Nodes as HastNodes} from 'hast';
import type {RootContent, Root, FootnoteReference} from 'mdast';

import type {MarkdownEditorLabels} from './markdown-types.js';
import {liveFootnotes} from './live-footnotes.js';

import {liveFocus} from './live-effects.js';
import {safeUrl} from './markdown-url.js';
import {footnoteContent, type LiveDocument} from './live-document.js';

// Only the private parser supplies this tree. Raw HTML becomes a text node; URL properties
// use the same allowlist as reading preview. No HTML string is inserted into the document.
function appendTree(parent: Node, tree: HastNodes, owner: Document, origin: number): void {
  if (tree.type === 'text' || tree.type === 'raw') {
    parent.appendChild(owner.createTextNode(tree.value));
    return;
  }
  if (tree.type === 'root') {
    tree.children.forEach((child) => appendTree(parent, child, owner, origin));
    return;
  }
  if (tree.type !== 'element') return;
  const element = owner.createElement(tree.tagName);
  const offset = tree.position?.start.offset;
  if (offset !== undefined) element.dataset.markdownOffset = String(Math.max(0, offset - origin));
  for (const [key, value] of Object.entries(tree.properties)) {
    if (key === 'src' && typeof value === 'string') {
      const url = safeUrl(value, 'src');
      if (url) element.setAttribute('src', url);
    } else if (key === 'start' && typeof value === 'number') {
      element.setAttribute('start', String(value));
    } else if (key === 'ariaLabel' && typeof value === 'string') {
      element.setAttribute('aria-label', value);
    } else if ((key === 'dataFootnotes' || key === 'data-wcl-footnote-continuation') && value) {
      element.setAttribute(key === 'dataFootnotes' ? 'data-footnotes' : key, '');
    } else if (key === 'alt' || key === 'title' || key === 'type' || key === 'align') {
      if (typeof value === 'string') element.setAttribute(key, value);
    } else if ((key === 'checked' || key === 'disabled') && value) {
      element.setAttribute(key, '');
    } else if (key === 'className' && Array.isArray(value)) {
      element.className = value.join(' ');
    } else if (key === 'data-wcl-wiki-link') {
      element.setAttribute(key, '');
    }
  }
  // Editing links select their Markdown source; reading-mode links retain navigation.
  if (tree.tagName === 'a') element.setAttribute('role', 'link');
  tree.children.forEach((child) => appendTree(element, child, owner, origin));
  parent.appendChild(element);
}

export class LiveWidget extends WidgetType {
  constructor(
    readonly node: RootContent,
    readonly document: LiveDocument,
    readonly from: number,
    readonly source: string,
    readonly block: boolean,
    readonly labels: MarkdownEditorLabels,
  ) {
    super();
  }

  override eq(other: LiveWidget): boolean {
    return (
      this.from === other.from &&
      this.source === other.source &&
      this.document.referenceKey === other.document.referenceKey &&
      this.labels.footnotes === other.labels.footnotes &&
      this.labels.footnoteBack === other.labels.footnoteBack
    );
  }

  override toDOM(view: EditorView): HTMLElement {
    const owner = view.dom.ownerDocument;
    const element = owner.createElement(this.block ? 'div' : 'span');
    element.setAttribute('data-wcl-live-widget', this.node.type);
    let root: Root;
    const footnote =
      this.node.type === 'footnoteDefinition'
        ? liveFootnotes(this.document, this.labels).get(this.from)
        : undefined;
    if (footnote) {
      root = {type: 'root', children: []};
    } else if (this.node.type === 'footnoteDefinition') {
      root = footnoteContent(this.node);
      const label = owner.createElement('sup');
      label.textContent = String(
        this.document.footnotes.get(this.node.identifier) ?? this.node.identifier,
      );
      element.appendChild(label);
    } else if (this.node.type === 'footnoteReference') {
      const label = owner.createElement('sup');
      label.textContent = String(
        this.document.footnotes.get(this.node.identifier) ?? this.node.identifier,
      );
      element.appendChild(label);
      root = {type: 'root', children: []};
    } else {
      root = {type: 'root', children: [this.node, ...this.document.definitions]};
    }
    appendTree(
      element,
      footnote ??
        toHast(root, {
          allowDangerousHtml: true,
          handlers: {
            footnoteReference: (_state, node: FootnoteReference) => ({
              type: 'element',
              tagName: 'sup',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: String(this.document.footnotes.get(node.identifier) ?? node.identifier),
                },
              ],
              ...(node.position ? {position: node.position} : {}),
            }),
          },
        }),
      owner,
      this.from,
    );
    element.addEventListener('mousedown', (event) => {
      if (
        !(event instanceof MouseEvent) ||
        event.button !== 0 ||
        view.state.facet(EditorView.editable) === false
      )
        return;
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>('[data-markdown-offset]')
          : null;
      const offset = Number(target?.dataset.markdownOffset ?? 0);
      const anchor = Math.min(view.state.doc.length, this.from + offset);
      event.preventDefault();
      view.dispatch({
        selection: event.shiftKey
          ? {anchor: view.state.selection.main.anchor, head: anchor}
          : {anchor},
        effects: [liveFocus.of(true), view.scrollSnapshot()],
        userEvent: 'select.pointer',
      });
      view.focus();
    });
    for (const image of element.querySelectorAll('img')) {
      image.addEventListener('load', () => view.requestMeasure());
      image.addEventListener('error', () => view.requestMeasure());
    }
    return element;
  }

  override ignoreEvent(): boolean {
    return true;
  }
}

export class MarkerWidget extends WidgetType {
  constructor(
    readonly text: string,
    readonly checked: boolean | null = null,
    readonly decorative = true,
  ) {
    super();
  }
  override eq(other: MarkerWidget): boolean {
    return (
      this.text === other.text &&
      this.checked === other.checked &&
      this.decorative === other.decorative
    );
  }
  override toDOM(view: EditorView): HTMLElement {
    const element = view.dom.ownerDocument.createElement(this.checked === null ? 'span' : 'input');
    if (element instanceof HTMLInputElement) {
      element.type = 'checkbox';
      element.checked = this.checked ?? false;
      element.disabled = true;
    } else {
      element.textContent = this.text;
      if (this.decorative) element.setAttribute('aria-hidden', 'true');
    }
    element.setAttribute('data-wcl-live-marker', '');
    return element;
  }
  override ignoreEvent(): boolean {
    return false;
  }
}
