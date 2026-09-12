import type {MarkdownWikiLink, MarkdownWikiLinks} from './markdown-types.js';
import {safeUrl} from './markdown-url.js';

export function resolveWikiLink(
  target: string,
  configuration: MarkdownWikiLinks | undefined,
): MarkdownWikiLink | null {
  const destination = configuration?.resolve(target);
  if (!destination) return null;
  const href = safeUrl(destination.href, 'href');
  return href ? {target, href, label: destination.label ?? target} : null;
}
