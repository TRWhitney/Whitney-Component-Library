import {MarkdownEditor, type MarkdownEditorLabels, type MarkdownEditorProps} from '../src/index.js';

export const defaultLivePreview = (
  <MarkdownEditor label="Document" defaultValue="# Review" name="body" />
);
export const livePreview = <MarkdownEditor label="Document" mode="live-preview" />;
export const source = <MarkdownEditor label="Document" mode="source" />;
export const reading = (
  <MarkdownEditor
    label="Document"
    mode="preview"
    isReadOnly
    value="# Review"
    onChange={() => undefined}
  />
);
export const locked = (
  <MarkdownEditor label="Document" isLocked lockMessage="Whitney is editing." />
);
const labels = {
  livePreview: 'Live Preview',
  source: 'Source',
  preview: 'Preview',
  emptyPreview: 'No content.',
  required: 'Enter a document.',
  footnotes: 'Footnotes',
  footnoteBack: 'Return to reference',
  position: (line, column) => `Line ${line}, column ${column}`,
} satisfies MarkdownEditorLabels;
export const localized = <MarkdownEditor label="Document" labels={labels} />;
// @ts-expect-error Complete label overrides must include Live Preview copy.
export const incompleteLabels: MarkdownEditorLabels = {
  source: labels.source,
  preview: labels.preview,
  emptyPreview: labels.emptyPreview,
  required: labels.required,
  footnotes: labels.footnotes,
  footnoteBack: labels.footnoteBack,
  position: labels.position,
};

// @ts-expect-error Controlled values require an owner callback.
export const missingOwner = <MarkdownEditor label="Document" value="text" />;
export const conflictingValues = (
  // @ts-expect-error Controlled and default values are exclusive.
  <MarkdownEditor label="Document" value="text" onChange={() => undefined} defaultValue="initial" />
);
// @ts-expect-error Locks require an explanation.
export const unexplainedLock = <MarkdownEditor label="Document" isLocked />;
// @ts-expect-error Arbitrary modes are not supported.
export const arbitraryMode = <MarkdownEditor label="Document" mode="rich-text" />;
// @ts-expect-error Arbitrary engine extensions are private.
export const engineExtensions = <MarkdownEditor label="Document" extensions={[]} />;
// @ts-expect-error Arbitrary rendering plugins are private.
export const unsafeRenderer = <MarkdownEditor label="Document" remarkPlugins={[]} />;
// @ts-expect-error General styling does not enter the public component contract.
export const styling = <MarkdownEditor label="Document" className="custom" />;

type PrivateKeys = 'editorState' | 'editorView' | 'extensions' | 'plugins' | 'renderHTML';
export const publicTypesKeepEnginePrivate: Extract<
  keyof MarkdownEditorProps,
  PrivateKeys
> extends never
  ? true
  : false = true;
