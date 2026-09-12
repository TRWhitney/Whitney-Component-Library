import {MarkdownEditor, type MarkdownEditorProps} from '../src/index.js';

export const source = <MarkdownEditor label="Document" defaultValue="# Review" name="body" />;
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

// @ts-expect-error Controlled values require an owner callback.
export const missingOwner = <MarkdownEditor label="Document" value="text" />;
export const conflictingValues = (
  // @ts-expect-error Controlled and default values are exclusive.
  <MarkdownEditor label="Document" value="text" onChange={() => undefined} defaultValue="initial" />
);
// @ts-expect-error Locks require an explanation.
export const unexplainedLock = <MarkdownEditor label="Document" isLocked />;
// @ts-expect-error Live Preview is not delivered in Ticket 24.
export const futureMode = <MarkdownEditor label="Document" mode="live-preview" />;
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
