import {useMemo, useState} from 'react';

import {
  Button,
  IconButton,
  InlineGroup,
  MarkdownEditor,
  SegmentedControl,
  Stack,
  Switch,
  Toolbar,
  Menu,
  ToggleButton,
  type MarkdownEditorMode,
  type MarkdownEditorSize,
  type MarkdownExtension,
} from '../src/index.js';

import {MarkdownIcon} from './markdown-icons.js';

const reviewNotes = [
  '# Boundary review',
  '',
  'The **north boundary** needs a second pass. Keep the _balanced_ profile and replace the ~~old~~ threshold with `0.0025 K`.[^1]',
  '',
  'Mark %%rgba(180, 35, 24, 0.85) north boundary%% for follow-up and ==check convergence==. TODO: compare [[run:0285]].',
  '',
  '## Review checklist',
  '',
  '- [x] Confirm the mesh',
  '- [ ] Inspect the north boundary',
  '  - Compare the last two runs',
  '',
  '1. Open the result.',
  '2. Record the remaining difference.',
  '',
  '> Repeat the comparison after convergence.',
  '',
  '![Rectangular mesh with its top north boundary highlighted for review.](/markdown-boundary.svg)',
  '',
  '| Run | Difference |',
  '| --- | ---: |',
  '| 0284 | 0.0021 K |',
  '| 0285 | 0.0018 K |',
  '',
  '```text',
  'tolerance = 0.0025',
  'profile = balanced',
  '```',
  '',
  '```review-note',
  'Compare the final two runs before accepting the boundary.',
  '```',
  '',
  'Read the [CommonMark guide](https://commonmark.org/help/) or visit https://commonmark.org.',
  '',
  'Open [[Boundary review]] or review the unresolved [[Mesh annotations]].',
  '',
  '<strong>This HTML remains literal text.</strong>',
  '',
  '---',
  '',
  '[^1]: Differences use the final solver iteration.',
].join('\n');

export function MarkdownSpecimen() {
  const [value, setValue] = useState(reviewNotes);
  const [mode, setMode] = useState<MarkdownEditorMode>('live-preview');
  const [size, setSize] = useState<MarkdownEditorSize>('regular');
  const [isRequired, setRequired] = useState(false);
  const [isInvalid, setInvalid] = useState(false);
  const [isReadOnly, setReadOnly] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [isPending, setPending] = useState(false);
  const [isLocked, setLocked] = useState(false);
  const [openedWiki, setOpenedWiki] = useState('');
  const [assetUnavailable, setAssetUnavailable] = useState(false);
  const extensions = useMemo<readonly MarkdownExtension[]>(
    () => [
      {
        id: 'review-extensions',
        syntax: [
          {
            id: 'review-color',
            kind: 'color',
            delimiter: '%%',
          },
          {id: 'review-highlight', kind: 'inline', delimiter: '==', treatment: 'highlight'},
          {id: 'review-callout', kind: 'fence', name: 'review-note', treatment: 'note'},
        ],
        commands: [
          {
            id: 'color-selection',
            shortcut: 'Mod-Shift-E',
            execute: ({value, selection}) => {
              const from = Math.min(selection.anchor, selection.head),
                to = Math.max(selection.anchor, selection.head);
              const prefix = '%%rgba(180, 35, 24, 0.85) ';
              return {
                edits: [{from, to, insert: `${prefix}${value.slice(from, to)}%%`}],
                selection: {anchor: from + prefix.length, head: to + prefix.length},
              };
            },
          },
        ],
        decorate: ({value}) => {
          const from = value.indexOf('TODO');
          return from < 0 ? [] : [{from, to: from + 4, treatment: 'accent'}];
        },
        links: [
          {
            prefix: 'run:',
            resolve: (target) => ({href: '#markdown-editor', label: `Run ${target.slice(4)}`}),
            onNavigate: ({label}) => setOpenedWiki(label),
          },
        ],
      },
    ],
    [],
  );

  return (
    <Stack gap="regular">
      <InlineGroup align="start" gap="regular" wrap>
        <SegmentedControl
          label="Markdown mode"
          onChange={setMode}
          options={[
            {label: 'Live Preview', value: 'live-preview'},
            {label: 'Source', value: 'source'},
            {label: 'Preview', value: 'preview'},
          ]}
          value={mode}
        />
        <SegmentedControl
          label="Document height"
          onChange={setSize}
          options={[
            {label: 'Compact', value: 'compact'},
            {label: 'Regular', value: 'regular'},
            {label: 'Expanded', value: 'expanded'},
          ]}
          value={size}
        />
      </InlineGroup>
      <InlineGroup align="start" gap="regular" wrap>
        <Switch label="Required" isSelected={isRequired} onChange={setRequired} />
        <Switch label="Invalid" isSelected={isInvalid} onChange={setInvalid} />
        <Switch label="Read-only" isSelected={isReadOnly} onChange={setReadOnly} />
        <Switch label="Disabled" isSelected={isDisabled} onChange={setDisabled} />
        <Switch label="Pending" isSelected={isPending} onChange={setPending} />
        <Switch label="Locked" isSelected={isLocked} onChange={setLocked} />
        <Switch
          label="Asset service unavailable"
          isSelected={assetUnavailable}
          onChange={setAssetUnavailable}
        />
      </InlineGroup>
      <MarkdownEditor
        label="Markdown review notes"
        extensions={extensions}
        renderToolbar={(controls) => (
          <Toolbar label="Markdown formatting">
            {(
              [
                ['bold', 'Bold'],
                ['italic', 'Italic'],
                ['strikethrough', 'Strike'],
                ['inline-code', 'Code'],
                ['heading-2', 'Heading 2'],
                ['bullet-list', 'List'],
                ['task-list', 'Task'],
                ['blockquote', 'Quote'],
              ] as const
            ).map(([command, text]) => (
              <ToggleButton
                key={command}
                label={text}
                size="compact"
                isDisabled={!controls.canExecute(command)}
                isSelected={controls.isActive(command)}
                onChange={() => controls.execute(command)}
              >
                <MarkdownIcon name={command} />
              </ToggleButton>
            ))}
            <IconButton
              label="Link"
              size="compact"
              isDisabled={!controls.canExecute('link')}
              onPress={() => controls.execute('link')}
            >
              <MarkdownIcon name="link" />
            </IconButton>
            <IconButton
              label="Text color"
              size="compact"
              isDisabled={!controls.canExecuteExtension('color-selection')}
              onPress={() => controls.executeExtension('color-selection')}
            >
              <MarkdownIcon name="color" />
            </IconButton>
            <Menu
              trigger={
                <IconButton
                  label="More formatting"
                  size="compact"
                  isDisabled={
                    !controls.canExecute('paragraph') && !controls.canExecute('code-block')
                  }
                >
                  <MarkdownIcon name="more" />
                </IconButton>
              }
              items={[
                {
                  type: 'group',
                  id: 'headings',
                  label: 'Headings',
                  items: (
                    [
                      ['heading-1', 'Heading 1'],
                      ['heading-2', 'Heading 2'],
                      ['heading-3', 'Heading 3'],
                      ['heading-4', 'Heading 4'],
                      ['heading-5', 'Heading 5'],
                      ['heading-6', 'Heading 6'],
                    ] as const
                  ).map(([command, text]) => ({
                    type: 'action' as const,
                    id: command,
                    label: text,
                    isDisabled: !controls.canExecute(command),
                    onAction: () => requestAnimationFrame(() => controls.execute(command)),
                  })),
                },
                {
                  type: 'group',
                  id: 'blocks',
                  label: 'Blocks',
                  items: (
                    [
                      ['paragraph', 'Paragraph'],
                      ['ordered-list', 'Numbered list'],
                      ['code-block', 'Code block'],
                      ['horizontal-rule', 'Horizontal rule'],
                    ] as const
                  ).map(([command, text]) => ({
                    type: 'action' as const,
                    id: command,
                    label: text,
                    isDisabled: !controls.canExecute(command),
                    onAction: () => requestAnimationFrame(() => controls.execute(command)),
                  })),
                },
              ]}
            />
            <IconButton
              label="Undo"
              size="compact"
              isDisabled={!controls.canExecute('undo')}
              onPress={() => controls.execute('undo')}
            >
              <MarkdownIcon name="undo" />
            </IconButton>
            <IconButton
              label="Redo"
              size="compact"
              isDisabled={!controls.canExecute('redo')}
              onPress={() => controls.execute('redo')}
            >
              <MarkdownIcon name="redo" />
            </IconButton>
            <IconButton
              label="Open link"
              size="compact"
              isDisabled={!controls.canOpenLink}
              onPress={() => controls.openLink()}
            >
              <MarkdownIcon name="open" />
            </IconButton>
          </Toolbar>
        )}
        description="Edit formatted text in Live Preview. Move the cursor into a construct to reveal its Markdown; select across constructs to edit their source. Tab leaves the editor."
        errorMessage="Resolve the boundary review before saving these notes."
        isRequired={isRequired}
        isInvalid={isInvalid}
        isReadOnly={isReadOnly}
        isDisabled={isDisabled}
        isPending={isPending}
        pendingMessage="Checking the review notes."
        isLocked={isLocked}
        lockMessage="Morgan is editing these notes. You can still read and copy the document."
        mode={mode}
        size={size}
        value={value}
        onChange={setValue}
        assets={{
          acceptedFileTypes: ['image/png', 'image/jpeg', 'image/svg+xml'],
          maxFileSize: 5 * 1024 * 1024,
          insert: async ({signal}) => {
            await new Promise<void>((resolve) => {
              const timer = setTimeout(resolve, 700);
              signal.addEventListener(
                'abort',
                () => {
                  clearTimeout(timer);
                  resolve();
                },
                {once: true},
              );
            });
            return assetUnavailable
              ? {error: 'The example asset service is unavailable. Turn it back on and retry.'}
              : {markdown: '![Boundary mesh](/markdown-boundary.svg)'};
          },
        }}
        wikiLinks={{
          resolve: (target) =>
            target === 'Boundary review'
              ? {href: '#markdown-editor', label: 'Boundary review'}
              : null,
          onNavigate: ({label}) => setOpenedWiki(label),
        }}
      />
      <InlineGroup gap="regular" wrap>
        <Button variant="secondary" onPress={() => setValue('')}>
          Clear document
        </Button>
        <Button variant="secondary" onPress={() => setValue(reviewNotes)}>
          Restore example
        </Button>
      </InlineGroup>
      {openedWiki ? <p role="status">Opened note: {openedWiki}.</p> : null}
      <p>
        Click the table or move into it with the keyboard to edit its complete pipe-delimited
        source. Fenced code also reveals its complete source. Move outside the construct to see its
        rendered form again. Inactive footnotes show the same heading and numbered entries as
        Preview; click a footnote to edit its Markdown definition. Switching modes retains the
        Markdown, selection, and undo history.
      </p>
      <p>
        Select text and use the formatting toolbar, or press Ctrl/Cmd+B for bold, Ctrl/Cmd+I for
        italic, and Ctrl/Cmd+K for a link. Enter continues lists and quotations; Enter on an empty
        item exits it. Each formatting action can be undone. Literal code keeps ordinary newlines.
      </p>
      <p>
        Click a wiki link to edit its source. Ctrl/Cmd-click follows a resolved target; with the
        cursor inside it, use Ctrl/Cmd+Enter or Open link. Preview supports ordinary link
        activation. This example reports the selected note below the editor. Unresolved wiki targets
        stay inert, and HTML stays literal. The application supplies wiki destinations and handles
        navigation.
      </p>
      <p>
        Paste or drop one PNG, JPEG, or SVG up to 5 MB. This example waits briefly, then inserts the
        bundled boundary mesh. Turn on Asset service unavailable to try failure and retry. Typing
        remains available while insertion is pending. Applications handle file storage and return
        the Markdown to insert; this example does not upload your file.
      </p>
      <p>
        Text color stores an RGBA value with the selected plain text. Source mode and exposed Live
        Preview syntax show a checker-backed swatch beside it. Edit the RGBA numbers to change the
        color and opacity. This extension also adds ==highlighted text==, a review-note fenced
        block, a TODO annotation in editing modes, and run: wiki destinations. Source keeps the
        exact Markdown. Applications register these declarations without parser plugins or HTML.
      </p>
    </Stack>
  );
}
