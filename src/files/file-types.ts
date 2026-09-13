import type {ReactNode} from 'react';

import type {FieldPendingProps} from '../fields/field-types.js';

export type FileAcquisitionSource = 'drop' | 'paste' | 'picker';
export type FileRejectionReason = 'multiple' | 'size' | 'type';

export interface RejectedFile {
  readonly file: File;
  readonly reasons: readonly FileRejectionReason[];
}

export interface FileAcquisitionResult {
  readonly files: readonly File[];
  readonly rejectedFiles: readonly RejectedFile[];
  readonly source: FileAcquisitionSource;
}

export interface FileAcceptanceProps {
  readonly acceptedFileTypes?: readonly string[];
  readonly allowsMultiple?: boolean;
  readonly maxFileSize?: number;
}

interface FileAcquisitionBaseProps extends FileAcceptanceProps {
  readonly description?: string;
  readonly errorMessage?: string;
  readonly getAnnouncement: (result: FileAcquisitionResult) => string;
  readonly isDisabled?: boolean;
  readonly isInvalid?: boolean;
  readonly label: string;
  readonly onFiles: (result: FileAcquisitionResult) => void;
}

export type FileTriggerProps = FileAcquisitionBaseProps &
  FieldPendingProps & {readonly reserveSupportSpace?: boolean};

export type DropZoneProps = FileAcquisitionBaseProps &
  FieldPendingProps & {
    readonly actionLabel: string;
    readonly children?: ReactNode;
  };
