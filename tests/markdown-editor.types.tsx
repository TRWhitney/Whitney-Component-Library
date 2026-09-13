import {
  Button,
  MarkdownEditor,
  ToggleButton,
  Toolbar,
  type MarkdownCommand,
  type MarkdownEditorControls,
  type MarkdownEditorLabels,
  type MarkdownEditorProps,
  type MarkdownAssetResult,
  type MarkdownAssetLabels,
} from '../src/index.js';

export const defaultLivePreview = (
  <MarkdownEditor label="Document" defaultValue="# Review" name="body" />
);
export const livePreview = <MarkdownEditor label="Document" mode="live-preview" />;
export const source = <MarkdownEditor label="Document" mode="source" />;
export const assets = (
  <MarkdownEditor
    label="Document"
    assets={{
      acceptedFileTypes: ['image/png'],
      allowsMultiple: true,
      maxFileSize: 1000000,
      insert: ({files, source, signal}) =>
        Promise.resolve(
          signal.aborted
            ? {error: 'Cancelled'}
            : {markdown: `![${files.length} ${source}](/asset.png)`},
        ),
    }}
  />
);
// @ts-expect-error An asset result supplies Markdown or an error, never both.
export const ambiguousAsset: MarkdownAssetResult = {markdown: 'text', error: 'Failed'};
// @ts-expect-error Asset labels require complete recovery and rejection copy.
export const incompleteAssetLabels: MarkdownAssetLabels = {failed: 'Failed'};
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
  readOnly: 'Read-only',
  locked: 'Locked',
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
export const composedCommands = (
  <MarkdownEditor
    label="Document"
    renderToolbar={({execute, canExecute, isActive}) => (
      <Toolbar label="Formatting">
        <ToggleButton
          isSelected={isActive('bold')}
          isDisabled={!canExecute('bold')}
          onChange={() => {
            execute('bold');
          }}
        >
          Bold
        </ToggleButton>
        <Button
          isDisabled={!canExecute('undo')}
          onPress={() => {
            execute('undo');
          }}
        >
          Undo
        </Button>
      </Toolbar>
    )}
  />
);

export const builtInCommands = [
  'bold',
  'italic',
  'strikethrough',
  'inline-code',
  'link',
  'heading-1',
  'heading-2',
  'heading-3',
  'heading-4',
  'heading-5',
  'heading-6',
  'paragraph',
  'blockquote',
  'bullet-list',
  'ordered-list',
  'task-list',
  'code-block',
  'horizontal-rule',
  'undo',
  'redo',
] satisfies readonly MarkdownCommand[];

export function commandResults(controls: MarkdownEditorControls, command: MarkdownCommand) {
  const executed: boolean = controls.execute(command);
  const available: boolean = controls.canExecute(command);
  const active: boolean = controls.isActive(command);
  return {executed, available, active};
}

export function rejectUnsupportedCommands(controls: MarkdownEditorControls) {
  // @ts-expect-error Custom command identifiers are not built-in commands.
  controls.execute('custom-format');
  // @ts-expect-error Heading commands support levels one through six.
  controls.canExecute('heading-7');
  // @ts-expect-error Active state uses the same finite command identifiers.
  controls.isActive('unknown');
  // @ts-expect-error Commands accept identifiers, not engine command objects.
  controls.execute({id: 'bold', run: () => true});
}

// @ts-expect-error Engine command callbacks are not Markdown command identifiers.
export const engineCommand: MarkdownCommand = () => true;
export const invalidToolbar = (
  // @ts-expect-error Toolbar composition requires a render callback.
  <MarkdownEditor label="Document" renderToolbar={<Toolbar label="Formatting" />} />
);

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
export const declaredExtensions = (
  <MarkdownEditor
    label="Document"
    extensions={[
      {
        id: 'review',
        syntax: [{id: 'highlight', kind: 'inline', delimiter: '==', treatment: 'highlight'}],
      },
    ]}
  />
);
export const engineExtensions = (
  // @ts-expect-error Engine extension objects are not declared Markdown contributions.
  <MarkdownEditor label="Document" extensions={[{extension: []}]} />
);
// @ts-expect-error Arbitrary rendering plugins are private.
export const unsafeRenderer = <MarkdownEditor label="Document" remarkPlugins={[]} />;
// @ts-expect-error General styling does not enter the public component contract.
export const styling = <MarkdownEditor label="Document" className="custom" />;

type PrivateKeys =
  'editorState' | 'editorView' | 'state' | 'view' | 'dispatch' | 'plugins' | 'renderHTML';
export const publicTypesKeepEnginePrivate: Extract<
  keyof MarkdownEditorProps,
  PrivateKeys
> extends never
  ? true
  : false = true;
export const commandControlsKeepEnginePrivate: Extract<
  keyof MarkdownEditorControls,
  PrivateKeys
> extends never
  ? true
  : false = true;

type ControlPrivateKeys = Extract<
  keyof MarkdownEditorControls,
  'editorView' | 'editorState' | 'dispatch' | 'plugins'
>;
export const privateCommandStateIsAbsent: ControlPrivateKeys extends never ? true : false = true;

export const wikiNavigation = (
  <MarkdownEditor
    label="Document"
    defaultValue="[[Boundary]]"
    wikiLinks={{
      resolve: (target) => ({href: `/notes/${encodeURIComponent(target)}`}),
      onNavigate: (link) => {
        const target: string = link.target;
        return target;
      },
    }}
    renderToolbar={(controls) => (
      <Button
        isDisabled={!controls.canOpenLink}
        onPress={() => {
          const opened: boolean = controls.openLink();
          return opened;
        }}
      >
        Open link
      </Button>
    )}
  />
);
export const asynchronousWikiResolution = (
  <MarkdownEditor
    label="Document"
    wikiLinks={{
      // @ts-expect-error Wiki resolution is synchronous; applications supply current destinations.
      resolve: () => Promise.resolve({href: '/note'}),
      onNavigate: () => undefined,
    }}
  />
);
