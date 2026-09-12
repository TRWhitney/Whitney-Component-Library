import {memo, type ReactElement, type ComponentPropsWithoutRef} from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type {Plugin} from 'unified';
import type {Root} from 'hast';

import {remarkWikiLinks} from './wiki-syntax.js';
import type {MarkdownEditorLabels} from './markdown-types.js';

import {safeUrl} from './markdown-url.js';

// mdast's footnote heading uses a fixed ID. Scope every generated ID and local fragment to
// this mounted field so multiple documents and server hydration agree.
const scopeFootnotes: Plugin<[string], Root> = function (prefix) {
  return (tree) => {
    const visit = (node: Root | Root['children'][number]): void => {
      if (node.type === 'element') {
        if (node.properties.id === 'footnote-label') node.properties.id = `${prefix}footnote-label`;
        if (node.properties.ariaDescribedBy) {
          const values = Array.isArray(node.properties.ariaDescribedBy)
            ? node.properties.ariaDescribedBy
            : [node.properties.ariaDescribedBy];
          node.properties.ariaDescribedBy = values.map((value) =>
            value === 'footnote-label' ? `${prefix}footnote-label` : value,
          );
        }
      }
      if ('children' in node) node.children.forEach(visit);
    };
    visit(tree);
  };
};

export const MarkdownPreview = memo(function MarkdownPreview({
  value,
  prefix,
  labels,
  isDisabled,
}: {
  readonly value: string;
  readonly prefix: string;
  readonly labels: MarkdownEditorLabels;
  readonly isDisabled: boolean;
}): ReactElement {
  if (!value.trim()) return <p data-wcl-markdown-empty="">{labels.emptyPreview}</p>;
  return (
    <Markdown
      {...(isDisabled ? {components: {a: DisabledLink}} : {})}
      remarkPlugins={[remarkGfm, remarkWikiLinks]}
      rehypePlugins={[[scopeFootnotes, prefix]]}
      remarkRehypeOptions={{
        clobberPrefix: prefix,
        footnoteLabel: labels.footnotes,
        footnoteBackLabel: labels.footnoteBack,
      }}
      urlTransform={safeUrl}
    >
      {value}
    </Markdown>
  );
});

function DisabledLink({
  children,
  id,
  title,
  'aria-label': label,
  'aria-describedby': description,
}: ComponentPropsWithoutRef<'a'>): ReactElement {
  return (
    <a
      id={id}
      title={title}
      role="link"
      aria-label={label}
      aria-describedby={description}
      aria-disabled="true"
      tabIndex={-1}
    >
      {children}
    </a>
  );
}
