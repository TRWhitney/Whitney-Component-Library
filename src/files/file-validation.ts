import type {
  FileAcceptanceProps,
  FileAcquisitionResult,
  FileAcquisitionSource,
  FileRejectionReason,
  RejectedFile,
} from './file-types.js';

function matchesAcceptedType(file: File, acceptedType: string): boolean {
  const normalizedType = acceptedType.trim().toLowerCase();
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  if (normalizedType.startsWith('.')) return fileName.endsWith(normalizedType);
  if (normalizedType.endsWith('/*')) {
    return fileType.startsWith(normalizedType.slice(0, -1));
  }
  return fileType === normalizedType;
}

export function normalizeAcceptedFileTypes(
  acceptedFileTypes: readonly string[] | undefined,
): readonly string[] | undefined {
  return acceptedFileTypes?.map((type) => type.trim().toLowerCase());
}

interface FileDragTransfer {
  readonly items: Iterable<{readonly kind: string}>;
  readonly types: Iterable<string>;
}

export function createFileDragPreflight(): {
  readonly capture: (dataTransfer: FileDragTransfer) => void;
  readonly consume: () => boolean;
} {
  let captureVersion = 0;
  let containsFiles = false;
  return Object.freeze({
    capture(dataTransfer: FileDragTransfer) {
      const version = ++captureVersion;
      const items = [...dataTransfer.items];
      containsFiles =
        items.some((item) => item.kind === 'file') ||
        (items.length === 0 && [...dataTransfer.types].includes('Files'));
      setTimeout(() => {
        if (captureVersion === version) containsFiles = false;
      }, 0);
    },
    consume() {
      const result = containsFiles;
      containsFiles = false;
      return result;
    },
  });
}

export async function resolveDroppedFiles(
  items: readonly {readonly getFile: () => Promise<File>}[],
): Promise<readonly File[]> {
  const results = await Promise.allSettled(items.map((item) => item.getFile()));
  return results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []));
}

export function assertFileAcceptanceProps({
  acceptedFileTypes,
  maxFileSize,
}: FileAcceptanceProps): void {
  if (acceptedFileTypes?.some((type) => type.trim().length === 0)) {
    throw new Error('acceptedFileTypes entries must not be empty.');
  }
  if (maxFileSize !== undefined && (!Number.isFinite(maxFileSize) || maxFileSize <= 0)) {
    throw new Error('maxFileSize must be a finite number greater than zero.');
  }
}

export function acquireFiles(
  source: FileAcquisitionSource,
  candidateFiles: Iterable<File>,
  {acceptedFileTypes, allowsMultiple = false, maxFileSize}: FileAcceptanceProps,
): FileAcquisitionResult {
  const candidates = [...candidateFiles];
  const rejectsMultiplicity = !allowsMultiple && candidates.length > 1;
  const files: File[] = [];
  const rejectedFiles: RejectedFile[] = [];

  for (const file of candidates) {
    const reasons: FileRejectionReason[] = [];
    if (rejectsMultiplicity) reasons.push('multiple');
    if (
      acceptedFileTypes !== undefined &&
      !acceptedFileTypes.some((acceptedType) => matchesAcceptedType(file, acceptedType))
    ) {
      reasons.push('type');
    }
    if (maxFileSize !== undefined && file.size > maxFileSize) reasons.push('size');

    if (reasons.length === 0) files.push(file);
    else rejectedFiles.push(Object.freeze({file, reasons: Object.freeze(reasons)}));
  }

  return Object.freeze({
    files: Object.freeze(files),
    rejectedFiles: Object.freeze(rejectedFiles),
    source,
  });
}
