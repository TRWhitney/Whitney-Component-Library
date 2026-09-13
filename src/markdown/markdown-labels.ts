import type {MarkdownEditorLabels} from './markdown-types.js';

export const englishLabels: MarkdownEditorLabels = {
  readOnly: 'Read-only',
  locked: 'Locked',
  livePreview: 'Live Preview',
  source: 'Markdown source',
  preview: 'Preview',
  emptyPreview: 'No content to preview.',
  required: 'Enter Markdown content.',
  footnotes: 'Footnotes',
  footnoteBack: 'Back to reference',
  position: (line, column) => `Line ${line}, column ${column}`,
};
