import type {ReactNode} from 'react';
import type {MarkdownExtension} from './extension-types.js';
import type {FileAcceptanceProps, RejectedFile} from '../files/file-types.js';

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
  readonly executeExtension: (id: string) => boolean;
  readonly canExecuteExtension: (id: string) => boolean;
  readonly execute: (command: MarkdownCommand) => boolean;
  readonly canExecute: (command: MarkdownCommand) => boolean;
  readonly isActive: (command: MarkdownCommand) => boolean;
  readonly canOpenLink: boolean;
  readonly openLink: () => boolean;
}

export interface MarkdownWikiDestination {
  readonly href: string;
  readonly label?: string;
}

export interface MarkdownWikiLink {
  readonly target: string;
  readonly href: string;
  readonly label: string;
}

export interface MarkdownWikiLinks {
  readonly resolve: (target: string) => MarkdownWikiDestination | null;
  readonly onNavigate: (link: MarkdownWikiLink) => void;
}

export interface MarkdownAssetRequest {
  readonly files: readonly File[];
  readonly source: 'paste' | 'drop';
  readonly signal: AbortSignal;
}

export type MarkdownAssetResult =
  | {readonly markdown: string; readonly error?: never}
  | {readonly error: string; readonly markdown?: never};

export interface MarkdownAssetLabels {
  readonly pending: (fileCount: number) => string;
  readonly rejected: (files: readonly RejectedFile[]) => string;
  readonly failed: string;
  readonly retry: string;
  readonly dismiss: string;
}

export interface MarkdownAssetOptions extends FileAcceptanceProps {
  readonly insert: (
    request: MarkdownAssetRequest,
  ) => MarkdownAssetResult | Promise<MarkdownAssetResult>;
  readonly labels?: MarkdownAssetLabels;
}

export type MarkdownEditorSize = 'compact' | 'regular' | 'expanded';

export interface MarkdownEditorLabels {
  /** Defaults to English when omitted for compatibility with existing label sets. */
  readonly readOnly?: string;
  readonly locked?: string;
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
    readonly wikiLinks?: MarkdownWikiLinks;
    readonly assets?: MarkdownAssetOptions;
    readonly extensions?: readonly MarkdownExtension[];
    readonly form?: string;
    readonly name?: string;
    readonly mode?: MarkdownEditorMode;
    readonly size?: MarkdownEditorSize;
    /** Override English mode, position, validation, and reading copy, with optional access labels. */
    readonly labels?: MarkdownEditorLabels;
  };
