import type {
  FieldPendingProps,
  FieldStateProps,
  FieldValidationProps,
  StringValueProps,
} from '../fields/field-types.js';

export type MarkdownEditorMode = 'live-preview' | 'source' | 'preview';
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
    readonly form?: string;
    readonly name?: string;
    readonly mode?: MarkdownEditorMode;
    readonly size?: MarkdownEditorSize;
    /** Override the complete English mode, position, validation, and reading copy. */
    readonly labels?: MarkdownEditorLabels;
  };
