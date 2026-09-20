import {memo, type ReactElement, type ComponentPropsWithoutRef} from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type {Plugin} from 'unified';
import type {Root} from 'hast';

import {remarkExtensionSyntax, emptyMarkdownSyntax} from './extension-syntax.js';
import type {MarkdownSyntax} from './extension-types.js';

import {remarkWikiLinks} from './wiki-syntax.js';
import type {MarkdownEditorLabels, MarkdownWikiLinks} from './markdown-types.js';
import {resolveWikiLink} from './wiki-resolution.js';

import {safeUrl} from './markdown-url.js';
import {validatedRgba} from './rgba-color.js';
import {taskCheckboxLabels} from './task-labels.js';

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
  wikiLinks,
  syntax = emptyMarkdownSyntax,
}: {
  readonly value: string;
  readonly prefix: string;
  readonly labels: MarkdownEditorLabels;
  readonly isDisabled: boolean;
  readonly wikiLinks?: MarkdownWikiLinks;
  readonly syntax?: readonly MarkdownSyntax[];
}): ReactElement {
  if (!value.trim()) return <p data-wcl-markdown-empty="">{labels.emptyPreview}</p>;
  return (
    <Markdown
      components={{
        ...(isDisabled ? {a: DisabledLink} : {}),
        span: ({node, children, ...props}) => {
          const color = validatedRgba(node?.properties['data-wcl-markdown-rgba']);
          if (color)
            return (
              <span {...props} data-wcl-markdown-rgba={color} style={{color}}>
                {children}
              </span>
            );
          const target = node?.properties['data-wcl-wiki-target'];
          if (typeof target !== 'string') return <span {...props}>{children}</span>;
          const link = resolveWikiLink(target, wikiLinks);
          if (!link) return <span data-wcl-wiki-link="unresolved">{target}</span>;
          return (
            <a
              data-wcl-wiki-link="resolved"
              href={isDisabled ? undefined : link.href}
              role="link"
              aria-disabled={isDisabled || undefined}
              tabIndex={isDisabled ? -1 : undefined}
              onClick={(event) => {
                event.preventDefault();
                if (!isDisabled) wikiLinks?.onNavigate(link);
              }}
              onAuxClick={(event) => {
                if (event.button !== 1) return;
                event.preventDefault();
                if (!isDisabled) wikiLinks?.onNavigate(link);
              }}
            >
              {link.label}
            </a>
          );
        },
      }}
      remarkPlugins={[remarkGfm, remarkWikiLinks, [remarkExtensionSyntax, syntax]]}
      rehypePlugins={[
        [scopeFootnotes, prefix],
        [taskCheckboxLabels, labels.emptyTask ?? 'Task'],
      ]}
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
