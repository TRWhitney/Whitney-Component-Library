'use client';

import {FileTrigger as AriaFileTrigger} from 'react-aria-components/FileTrigger';
import {useId, useRef, type ReactElement} from 'react';

import {FileAction} from './file-action.js';
import {useFileAcquisitionState} from './file-acquisition-state.js';
import {FileSupport, supportIds} from './file-support.js';
import {assertFileAcceptanceProps} from './file-validation.js';
import type {FileTriggerProps} from './file-types.js';

export function FileTrigger({
  acceptedFileTypes,
  allowsMultiple = false,
  description,
  errorMessage,
  getAnnouncement,
  isDisabled = false,
  isInvalid = false,
  isPending = false,
  label,
  maxFileSize,
  onFiles,
  pendingMessage,
}: FileTriggerProps): ReactElement {
  assertFileAcceptanceProps({
    ...(acceptedFileTypes === undefined ? {} : {acceptedFileTypes}),
    allowsMultiple,
    ...(maxFileSize === undefined ? {} : {maxFileSize}),
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionId = useId();
  const errorId = useId();
  const statusId = useId();
  const {announcement, hasRejection, hasResult, processFiles} = useFileAcquisitionState({
    ...(acceptedFileTypes === undefined ? {} : {acceptedFileTypes}),
    allowsMultiple,
    getAnnouncement,
    inputRef,
    ...(maxFileSize === undefined ? {} : {maxFileSize}),
    onFiles,
  });
  const support = {
    announcement,
    description,
    descriptionId,
    errorId,
    errorMessage,
    isInvalid,
    isPending,
    pendingMessage,
    statusId,
  };

  return (
    <div
      data-acquired={hasResult || undefined}
      data-disabled={isDisabled || undefined}
      data-invalid={isInvalid || undefined}
      data-pending={isPending || undefined}
      data-rejected={hasRejection || undefined}
      data-wcl-file-trigger=""
    >
      <AriaFileTrigger
        {...(acceptedFileTypes === undefined ? {} : {acceptedFileTypes})}
        allowsMultiple={allowsMultiple}
        onSelect={(files) => {
          if (files !== null) processFiles('picker', files);
        }}
        ref={inputRef}
      >
        <FileAction
          describedBy={supportIds(support)}
          isDisabled={isDisabled}
          isInvalid={isInvalid}
          isPending={isPending}
          label={label}
        />
      </AriaFileTrigger>
      <FileSupport {...support} />
    </div>
  );
}
