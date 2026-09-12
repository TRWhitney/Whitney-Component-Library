import type {MarkdownWikiLinks} from './markdown-types.js';

export type MarkdownTreatment = 'highlight' | 'accent' | 'muted';
export type MarkdownSyntax =
  | {readonly id: string; readonly kind: 'color'; readonly delimiter: string}
  | {
      readonly id: string;
      readonly kind: 'inline';
      readonly delimiter: string;
      readonly treatment: MarkdownTreatment;
    }
  | {
      readonly id: string;
      readonly kind: 'fence';
      readonly name: string;
      readonly treatment: 'note' | 'warning';
    };

export interface MarkdownSelection {
  readonly anchor: number;
  readonly head: number;
}
export interface MarkdownSnapshot {
  readonly value: string;
  readonly selection: MarkdownSelection;
}
export interface MarkdownTextEdit {
  readonly from: number;
  readonly to: number;
  readonly insert: string;
}
export interface MarkdownCommandResult {
  readonly edits: readonly MarkdownTextEdit[];
  readonly selection?: MarkdownSelection;
}
export interface MarkdownExtensionCommand {
  readonly id: string;
  /** A Mod-Shift-letter binding that does not conflict with a built-in binding. */
  readonly shortcut?: string;
  readonly isEnabled?: (snapshot: MarkdownSnapshot) => boolean;
  readonly execute: (snapshot: MarkdownSnapshot) => MarkdownCommandResult | null;
}
export interface MarkdownDecoration {
  readonly from: number;
  readonly to: number;
  readonly treatment: MarkdownTreatment;
}
export interface MarkdownLinkResolver extends MarkdownWikiLinks {
  readonly prefix: string;
}
export interface MarkdownExtension {
  readonly id: string;
  readonly syntax?: readonly MarkdownSyntax[];
  readonly commands?: readonly MarkdownExtensionCommand[];
  readonly decorate?: (snapshot: MarkdownSnapshot) => readonly MarkdownDecoration[];
  readonly links?: readonly MarkdownLinkResolver[];
}
