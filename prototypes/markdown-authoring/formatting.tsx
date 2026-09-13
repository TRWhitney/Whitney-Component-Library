import {useState} from 'react';
import {
  Button,
  IconButton,
  Menu,
  Popover,
  TextField,
  ToggleButton,
  Toolbar,
  type MarkdownCommand,
  type MarkdownEditorControls,
} from '@trwhitney/component-library';
import {Icon} from './icons.js';

export function Formatting({
  controls,
  color,
  onColor,
}: {
  controls: MarkdownEditorControls;
  color: string;
  onColor: (value: string) => void;
}) {
  const [draft, setDraft] = useState(color);
  const valid =
    /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0(?:\.\d+)?|1(?:\.0+)?)\s*\)$/.exec(
      draft,
    );
  const colorValid = !!valid && valid.slice(1, 4).every((v) => Number(v) <= 255);
  const commands = [
    ['bold', 'Bold'],
    ['italic', 'Italic'],
    ['strikethrough', 'Strikethrough'],
    ['inline-code', 'Inline code'],
    ['heading-2', 'Heading 2'],
    ['bullet-list', 'Bullet list'],
    ['task-list', 'Task list'],
    ['blockquote', 'Blockquote'],
  ] as const;
  const item = (command: MarkdownCommand, label: string) => ({
    type: 'action' as const,
    id: command,
    label,
    isDisabled: !controls.canExecute(command),
    onAction: () => {
      controls.execute(command);
    },
  });
  return (
    <Toolbar label="Document formatting">
      {commands.map(([command, label]) => (
        <ToggleButton
          key={command}
          label={label}
          size="compact"
          variant="quiet"
          isSelected={controls.isActive(command)}
          isDisabled={!controls.canExecute(command)}
          onChange={() => {
            controls.execute(command);
          }}
        >
          <Icon name={command} />
        </ToggleButton>
      ))}
      <IconButton
        label="Insert link"
        size="compact"
        variant="quiet"
        isDisabled={!controls.canExecute('link')}
        onPress={() => {
          controls.execute('link');
        }}
      >
        <Icon name="link" />
      </IconButton>
      <Popover
        title="Text color"
        description="Apply an RGBA color to the selected text."
        closeLabel="Close text color"
        trigger={
          <IconButton
            label="Text color"
            size="compact"
            variant="quiet"
            isDisabled={!controls.canExecuteExtension('text-color')}
          >
            <Icon name="color" />
          </IconButton>
        }
        actions={({close}) => (
          <Button
            size="compact"
            isDisabled={!colorValid}
            onPress={() => {
              onColor(draft);
              controls.executeExtension('text-color');
              close();
            }}
          >
            Apply color
          </Button>
        )}
      >
        <div className="demo-form">
          <TextField
            label="RGBA color"
            value={draft}
            onChange={setDraft}
            isInvalid={!colorValid}
            errorMessage="Use rgba with channels 0–255 and alpha 0–1."
          />
          <div className="color-sample">
            <span style={{backgroundColor: colorValid ? draft : 'transparent'}} />
            Selected color
          </div>
        </div>
      </Popover>
      <Menu
        trigger={
          <IconButton
            label="More formatting"
            size="compact"
            variant="quiet"
            isDisabled={!controls.canExecute('paragraph')}
          >
            <Icon name="more" />
          </IconButton>
        }
        items={[
          {
            type: 'group',
            id: 'headings',
            label: 'Headings',
            items: ([1, 2, 3, 4, 5, 6] as const).map((level) =>
              item(`heading-${level}`, `Heading ${level}`),
            ),
          },
          {
            type: 'group',
            id: 'blocks',
            label: 'Blocks',
            items: [
              item('paragraph', 'Paragraph'),
              item('ordered-list', 'Numbered list'),
              item('code-block', 'Code block'),
              item('horizontal-rule', 'Horizontal rule'),
            ],
          },
        ]}
      />
      <IconButton
        label="Undo"
        size="compact"
        variant="quiet"
        isDisabled={!controls.canExecute('undo')}
        onPress={() => {
          controls.execute('undo');
        }}
      >
        <Icon name="undo" />
      </IconButton>
      <IconButton
        label="Redo"
        size="compact"
        variant="quiet"
        isDisabled={!controls.canExecute('redo')}
        onPress={() => {
          controls.execute('redo');
        }}
      >
        <Icon name="redo" />
      </IconButton>
      <IconButton
        label="Open document link"
        size="compact"
        variant="quiet"
        isDisabled={!controls.canOpenLink}
        onPress={() => {
          controls.openLink();
        }}
      >
        <Icon name="open" />
      </IconButton>
    </Toolbar>
  );
}
