import {useState} from 'react';

import {
  Button,
  InlineGroup,
  MarkdownEditor,
  SegmentedControl,
  Stack,
  Switch,
  type MarkdownEditorMode,
  type MarkdownEditorSize,
} from '../src/index.js';

const reviewNotes = [
  '# Boundary review',
  '',
  'The **north boundary** needs a second pass. Keep the _balanced_ profile and replace the ~~old~~ threshold with `0.0025 K`.[^1]',
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
  'Read the [CommonMark guide](https://commonmark.org/help/) or visit https://commonmark.org.',
  '',
  'The wiki target [[Boundary review]] is visible but does not navigate.',
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
      </InlineGroup>
      <MarkdownEditor
        label="Markdown review notes"
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
      />
      <InlineGroup gap="regular" wrap>
        <Button variant="secondary" onPress={() => setValue('')}>
          Clear document
        </Button>
        <Button variant="secondary" onPress={() => setValue(reviewNotes)}>
          Restore example
        </Button>
      </InlineGroup>
      <p>
        Click the table or move into it with the keyboard to edit its complete pipe-delimited
        source. Fenced code also reveals its complete source. Move outside the construct to see its
        rendered form again. Inactive footnotes show the same heading and numbered entries as
        Preview; click a footnote to edit its Markdown definition. Switching modes retains the
        Markdown, selection, and undo history.
      </p>
      <p>
        Links reveal their source while editing; use Preview to follow safe links. HTML stays
        literal and wiki targets stay inert. Formatting commands, asset callbacks, and wiki-link
        navigation are planned for Ticket 26.
      </p>
    </Stack>
  );
}
