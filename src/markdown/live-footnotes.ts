import {toHast} from 'mdast-util-to-hast';
import type {Element} from 'hast';

import type {LiveDocument} from './live-document.js';
import type {MarkdownEditorLabels} from './markdown-types.js';

type FootnoteLabels = Pick<MarkdownEditorLabels, 'footnotes' | 'footnoteBack'>;
const cache = new WeakMap<
  LiveDocument,
  {labels: FootnoteLabels; entries: ReadonlyMap<number, Element>}
>();

// Reuse the reading renderer's footnote structure, including repeated backreferences.
// Each entry stays at its source position so entering it can reveal the original Markdown.
export function liveFootnotes(document: LiveDocument, labels: FootnoteLabels) {
  const cached = cache.get(document);
  if (
    cached?.labels.footnotes === labels.footnotes &&
    cached.labels.footnoteBack === labels.footnoteBack
  )
    return cached.entries;
  const root = toHast(document.tree, {
    allowDangerousHtml: true,
    footnoteLabel: labels.footnotes,
    footnoteBackLabel: labels.footnoteBack,
  });
  if (root.type !== 'root') return new Map<number, Element>();
  const section = root.children.find(
    (node): node is Element => node.type === 'element' && !!node.properties.dataFootnotes,
  );
  const list = section?.children.find(
    (node): node is Element => node.type === 'element' && node.tagName === 'ol',
  );
  const items =
    list?.children.filter(
      (node): node is Element => node.type === 'element' && node.tagName === 'li',
    ) ?? [];
  const first = Math.min(...items.map((item) => item.position?.start.offset ?? Infinity));
  const entries = new Map<number, Element>();
  items.forEach((item, index) => {
    const offset = item.position?.start.offset;
    if (offset === undefined || !section || !list) return;
    entries.set(offset, {
      ...section,
      properties: {dataFootnotes: true, 'data-wcl-footnote-continuation': offset !== first},
      children: [
        ...(offset === first ? section.children.filter((child) => child !== list) : []),
        {...list, properties: {start: index + 1}, children: [item]},
      ],
    });
  });
  cache.set(document, {labels, entries});
  return entries;
}
