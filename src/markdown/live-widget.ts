import {EditorView, WidgetType} from '@codemirror/view';
import {toHast} from 'mdast-util-to-hast';
import type {Nodes as HastNodes} from 'hast';
import type {RootContent, Root, FootnoteReference} from 'mdast';

import type {MarkdownEditorLabels, MarkdownWikiLinks} from './markdown-types.js';
import {openWikiTarget} from './wiki-navigation.js';
import {resolveWikiLink} from './wiki-resolution.js';
import {liveFootnotes} from './live-footnotes.js';

import {liveFocus} from './live-effects.js';
import {safeUrl} from './markdown-url.js';
import {footnoteContent, type LiveDocument} from './live-document.js';

// Only the private parser supplies this tree. Raw HTML becomes a text node; URL properties
// use the same allowlist as reading preview. No HTML string is inserted into the document.
function appendTree(
  parent: Node,
  tree: HastNodes,
  owner: Document,
  origin: number,
  wikiLinks: MarkdownWikiLinks | undefined,
  disabled: boolean,
): void {
  if (tree.type === 'text' || tree.type === 'raw') {
    parent.appendChild(owner.createTextNode(tree.value));
    return;
  }
  if (tree.type === 'root') {
    tree.children.forEach((child) => appendTree(parent, child, owner, origin, wikiLinks, disabled));
    return;
  }
  if (tree.type !== 'element') return;
  const target = tree.properties['data-wcl-wiki-target'];
  const wiki = typeof target === 'string';
  const link = wiki ? resolveWikiLink(target, wikiLinks) : null;
  const element = owner.createElement(wiki ? (link ? 'a' : 'span') : tree.tagName);
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
    }
  }
  // Editing links select their Markdown source; reading-mode links retain navigation.
  if (tree.tagName === 'a') element.setAttribute('role', 'link');
  if (wiki) {
    element.dataset.wclWikiLink = link ? 'resolved' : 'unresolved';
    element.dataset.wclWikiTarget = target;
    element.textContent = link?.label ?? target;
    if (link) {
      element.setAttribute('role', 'link');
      element.tabIndex = -1;
      if (disabled) element.setAttribute('aria-disabled', 'true');
      else element.setAttribute('href', link.href);
    }
  } else {
    tree.children.forEach((child) =>
      appendTree(element, child, owner, origin, wikiLinks, disabled),
    );
  }
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
    readonly wikiLinks: MarkdownWikiLinks | undefined,
    readonly disabled: boolean,
  ) {
    super();
  }

  override eq(other: LiveWidget): boolean {
    return (
      this.wikiLinks === other.wikiLinks &&
      this.disabled === other.disabled &&
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
      this.wikiLinks,
      this.disabled,
    );
    element.addEventListener('click', (event) => {
      if (!(event instanceof MouseEvent)) return;
      const wiki =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>('[data-wcl-wiki-target]')
          : null;
      if (!wiki) return;
      event.preventDefault();
      if (event.button === 0 && (event.ctrlKey || event.metaKey))
        openWikiTarget(view, wiki.dataset.wclWikiTarget!);
    });
    element.addEventListener('auxclick', (event) => {
      if (!(event instanceof MouseEvent) || event.button !== 1) return;
      const wiki =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>('[data-wcl-wiki-target]')
          : null;
      if (!wiki) return;
      event.preventDefault();
      openWikiTarget(view, wiki.dataset.wclWikiTarget!);
    });
    const revealSource = (event: MouseEvent | TouchEvent) => {
      if (view.composing || view.state.facet(EditorView.editable) === false) return;
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
    };
    element.addEventListener('mousedown', (event) => {
      if (!(event instanceof MouseEvent)) return;
      if (event.ctrlKey || event.metaKey) {
        // Keep the rendered target mounted until its intentional click is dispatched.
        event.preventDefault();
        return;
      }
      if (event.button === 0) revealSource(event);
    });
    let touchStart: {x: number; y: number} | null = null;
    element.addEventListener(
      'touchstart',
      (event) => {
        if (!(event instanceof TouchEvent)) return;
        const touch = event.touches.length === 1 ? event.touches[0] : undefined;
        touchStart = touch ? {x: touch.clientX, y: touch.clientY} : null;
      },
      {passive: true},
    );
    element.addEventListener(
      'touchmove',
      (event) => {
        if (!(event instanceof TouchEvent)) return;
        const touch = event.touches[0];
        if (
          !touch ||
          !touchStart ||
          Math.hypot(touch.clientX - touchStart.x, touch.clientY - touchStart.y) > 8
        )
          touchStart = null;
      },
      {passive: true},
    );
    element.addEventListener(
      'touchend',
      (event) => {
        if (!(event instanceof TouchEvent)) return;
        const touch = event.changedTouches[0];
        const tap =
          touchStart &&
          touch &&
          event.touches.length === 0 &&
          Math.hypot(touch.clientX - touchStart.x, touch.clientY - touchStart.y) <= 8;
        touchStart = null;
        // Resolve the original widget target before a synthesized mouse event can hit its revealed source.
        if (tap) revealSource(event);
      },
      {passive: false},
    );
    element.addEventListener('touchcancel', () => {
      touchStart = null;
    });
    for (const image of element.querySelectorAll('img')) {
      image.addEventListener('load', () => view.requestMeasure());
      image.addEventListener('error', () => view.requestMeasure());
    }
    return element;
  }

  override ignoreEvent(event: Event): boolean {
    // File acquisition belongs to the editor even when the target is rendered content.
    return !['dragenter', 'dragover', 'drop'].includes(event.type);
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
