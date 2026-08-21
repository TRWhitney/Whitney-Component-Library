'use client';

import {useCallback, useEffect, useState, type RefObject} from 'react';

import {acquireFiles} from './file-validation.js';
import type {
  FileAcceptanceProps,
  FileAcquisitionResult,
  FileAcquisitionSource,
} from './file-types.js';

interface FileAcquisitionStateOptions extends FileAcceptanceProps {
  readonly getAnnouncement: (result: FileAcquisitionResult) => string;
  readonly inputRef: RefObject<HTMLInputElement | null>;
  readonly onFiles: (result: FileAcquisitionResult) => void;
}

interface FileAcquisitionState {
  readonly announcement: string | null;
  readonly hasResult: boolean;
  readonly hasRejection: boolean;
  readonly processFiles: (source: FileAcquisitionSource, files: Iterable<File>) => void;
}

export function useFileAcquisitionState({
  acceptedFileTypes,
  allowsMultiple,
  getAnnouncement,
  inputRef,
  maxFileSize,
  onFiles,
}: FileAcquisitionStateOptions): FileAcquisitionState {
  const [result, setResult] = useState<FileAcquisitionResult | null>(null);

  const processFiles = useCallback(
    (source: FileAcquisitionSource, files: Iterable<File>) => {
      const nextResult = acquireFiles(source, files, {
        ...(acceptedFileTypes === undefined ? {} : {acceptedFileTypes}),
        ...(allowsMultiple === undefined ? {} : {allowsMultiple}),
        ...(maxFileSize === undefined ? {} : {maxFileSize}),
      });
      setResult(nextResult);
      onFiles(nextResult);
    },
    [acceptedFileTypes, allowsMultiple, maxFileSize, onFiles],
  );

  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    const reset = () => setResult(null);
    form.addEventListener('reset', reset);
    return () => form.removeEventListener('reset', reset);
  }, [inputRef]);

  return {
    announcement: result === null ? null : getAnnouncement(result),
    hasResult: result !== null,
    hasRejection: (result?.rejectedFiles.length ?? 0) > 0,
    processFiles,
  };
}
