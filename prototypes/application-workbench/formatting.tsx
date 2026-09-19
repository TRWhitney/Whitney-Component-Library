import {
  Button,
  IconButton,
  Menu,
  ToggleButton,
  Toolbar,
  type MarkdownCommand,
  type MarkdownEditorControls,
} from '@trwhitney/component-library';
import {Icon} from './icons.js';
export function Formatting({controls}: {controls: MarkdownEditorControls}) {
  const {execute, canExecute, isActive} = controls;
  return (
    <Toolbar label="Text formatting">
      <IconButton
        label="Undo"
        size="compact"
        variant="quiet"
        isDisabled={!canExecute('undo')}
        onPress={() => execute('undo')}
      >
        <Icon name="undo" />
      </IconButton>
      <IconButton
        label="Redo"
        size="compact"
        variant="quiet"
        isDisabled={!canExecute('redo')}
        onPress={() => execute('redo')}
      >
        <Icon name="redo" />
      </IconButton>

      <Menu
        trigger={
          <Button size="compact" variant="quiet">
            Style <span aria-hidden="true">⌄</span>
          </Button>
        }
        items={(
          [
            ['paragraph', 'Body text'],
            ['heading-1', 'Heading 1'],
            ['heading-2', 'Heading 2'],
            ['heading-3', 'Heading 3'],
            ['blockquote', 'Quote'],
          ] as [MarkdownCommand, string][]
        ).map(([id, label]) => ({
          type: 'action',
          id,
          label,
          isDisabled: !canExecute(id),
          onAction: () => {
            execute(id);
          },
        }))}
      />
      <ToggleButton
        label="Bold"
        size="compact"
        variant="quiet"
        isSelected={isActive('bold')}
        isDisabled={!canExecute('bold')}
        onChange={() => execute('bold')}
      >
        <b>B</b>
      </ToggleButton>
      <ToggleButton
        label="Italic"
        size="compact"
        variant="quiet"
        isSelected={isActive('italic')}
        isDisabled={!canExecute('italic')}
        onChange={() => execute('italic')}
      >
        <i>I</i>
      </ToggleButton>
      <IconButton
        label="Insert link"
        size="compact"
        variant="quiet"
        isDisabled={!canExecute('link')}
        onPress={() => execute('link')}
      >
        <Icon name="link" />
      </IconButton>
      <Menu
        trigger={
          <IconButton label="Insert into document" size="compact" variant="quiet">
            <Icon name="plus" />
          </IconButton>
        }
        items={(
          [
            ['bullet-list', 'Bulleted list'],
            ['ordered-list', 'Numbered list'],
            ['task-list', 'Checklist'],
            ['link', 'Link'],
            ['inline-code', 'Inline code'],
            ['code-block', 'Code block'],
            ['horizontal-rule', 'Divider'],
          ] as [MarkdownCommand, string][]
        ).map(([id, label]) => ({
          type: 'action',
          id,
          label,
          isDisabled: !canExecute(id),
          onAction: () => {
            execute(id);
          },
        }))}
      />
    </Toolbar>
  );
}
