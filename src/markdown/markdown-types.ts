import type {ReactNode} from 'react';

import type {
  FieldPendingProps,
  FieldStateProps,
  FieldValidationProps,
  StringValueProps,
} from '../fields/field-types.js';

export type MarkdownEditorMode = 'live-preview' | 'source' | 'preview';
export type MarkdownCommand =
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'inline-code'
  | 'link'
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'heading-4'
  | 'heading-5'
  | 'heading-6'
  | 'paragraph'
  | 'blockquote'
  | 'bullet-list'
  | 'ordered-list'
  | 'task-list'
  | 'code-block'
  | 'horizontal-rule'
  | 'undo'
  | 'redo';

export interface MarkdownEditorControls {
  readonly execute: (command: MarkdownCommand) => boolean;
  readonly canExecute: (command: MarkdownCommand) => boolean;
  readonly isActive: (command: MarkdownCommand) => boolean;
}

export type MarkdownEditorSize = 'compact' | 'regular' | 'expanded';

export interface MarkdownEditorLabels {
  readonly livePreview: string;
  readonly source: string;
  readonly preview: string;
  readonly emptyPreview: string;
  readonly required: string;
  readonly footnotes: string;
  readonly footnoteBack: string;
  readonly position: (line: number, column: number) => string;
}

export type MarkdownEditorLockProps =
  | {readonly isLocked?: false; readonly lockMessage?: never}
  | {readonly isLocked: boolean; readonly lockMessage: string};

export type MarkdownEditorProps = FieldStateProps &
  FieldPendingProps &
  FieldValidationProps<string> &
  StringValueProps &
  MarkdownEditorLockProps & {
    readonly renderToolbar?: (controls: MarkdownEditorControls) => ReactNode;
    readonly form?: string;
    readonly name?: string;
    readonly mode?: MarkdownEditorMode;
    readonly size?: MarkdownEditorSize;
    /** Override the complete English mode, position, validation, and reading copy. */
    readonly labels?: MarkdownEditorLabels;
  };
