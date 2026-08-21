'use client';

import {Button as AriaButton} from 'react-aria-components/Button';
import {DropZone as AriaDropZone} from 'react-aria-components/DropZone';
import {FileTrigger as AriaFileTrigger} from 'react-aria-components/FileTrigger';
import {useId, useRef, type ReactElement} from 'react';

import {useFileAcquisitionState} from './file-acquisition-state.js';
import {FileSupport, supportIds} from './file-support.js';
import {
  assertFileAcceptanceProps,
  createFileDragPreflight,
  normalizeAcceptedFileTypes,
  resolveDroppedFiles,
} from './file-validation.js';
import type {DropZoneProps, FileAcquisitionSource} from './file-types.js';

function FileGlyph(): ReactElement {
  return (
    <svg aria-hidden="true" data-wcl-file-glyph="" viewBox="0 0 24 24">
      <path d="M7 3.5h6l4 4V20.5H7z" />
      <path d="M13 3.5v4h4M9.5 13h5M12 10.5v5" />
    </svg>
  );
}

export function DropZone({
  acceptedFileTypes,
  actionLabel,
  allowsMultiple = false,
  children,
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
}: DropZoneProps): ReactElement {
  assertFileAcceptanceProps({
    ...(acceptedFileTypes === undefined ? {} : {acceptedFileTypes}),
    allowsMultiple,
    ...(maxFileSize === undefined ? {} : {maxFileSize}),
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const dragPreflight = useRef(createFileDragPreflight()).current;
  const nextSource = useRef<FileAcquisitionSource>('drop');
  const normalizedFileTypes = normalizeAcceptedFileTypes(acceptedFileTypes);
  const descriptionId = useId();
  const errorId = useId();
  const statusId = useId();
  const {announcement, hasRejection, hasResult, processFiles} = useFileAcquisitionState({
    ...(normalizedFileTypes === undefined ? {} : {acceptedFileTypes: normalizedFileTypes}),
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
  const describedBy = supportIds(support);
  return (
    <div
      {...(describedBy === undefined ? {} : {'aria-describedby': describedBy})}
      aria-label={label}
      aria-invalid={isInvalid || undefined}
      data-wcl-drop-zone-container=""
      onDragEnterCapture={(event) => {
        dragPreflight.capture(event.dataTransfer);
      }}
      onDragOverCapture={(event) => {
        dragPreflight.capture(event.dataTransfer);
      }}
      onPasteCapture={() => {
        nextSource.current = 'paste';
        queueMicrotask(() => {
          nextSource.current = 'drop';
        });
      }}
      role="group"
    >
      <AriaDropZone
        aria-label={label}
        data-acquired={hasResult || undefined}
        data-invalid={isInvalid || undefined}
        data-pending={isPending || undefined}
        data-rejected={hasRejection || undefined}
        data-wcl-drop-zone=""
        getDropOperation={(types) => {
          if (!dragPreflight.consume()) return 'cancel';
          const mimeTypes = normalizedFileTypes?.filter((type) => !type.startsWith('.'));
          const cannotInspectBeforeDrop =
            normalizedFileTypes === undefined ||
            normalizedFileTypes.some((type) => type.startsWith('.'));
          return cannotInspectBeforeDrop || (mimeTypes !== undefined && types.has([...mimeTypes]))
            ? 'copy'
            : 'cancel';
        }}
        isDisabled={isDisabled || isPending}
        onDrop={(event) => {
          const source = nextSource.current;
          nextSource.current = 'drop';
          const fileItems = event.items.filter((item) => item.kind === 'file');
          if (fileItems.length > 0) {
            void resolveDroppedFiles(fileItems).then((files) => processFiles(source, files));
          }
        }}
      >
        <AriaFileTrigger
          {...(normalizedFileTypes === undefined ? {} : {acceptedFileTypes: normalizedFileTypes})}
          allowsMultiple={allowsMultiple}
          onSelect={(files) => {
            if (files !== null) processFiles('picker', files);
          }}
          ref={inputRef}
        >
          <AriaButton
            {...(describedBy === undefined ? {} : {'aria-describedby': describedBy})}
            aria-invalid={isInvalid || undefined}
            aria-label={actionLabel}
            data-wcl-drop-zone-action=""
            isDisabled={isDisabled || isPending}
            type="button"
          >
            <FileGlyph />
          </AriaButton>
        </AriaFileTrigger>
        <div data-wcl-file-copy="">
          <span data-wcl-file-label="">{label}</span>
          {children ? <div data-wcl-file-content="">{children}</div> : null}
        </div>
        <FileSupport {...support} />
      </AriaDropZone>
    </div>
  );
}
