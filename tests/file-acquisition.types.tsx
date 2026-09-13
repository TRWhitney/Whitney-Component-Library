import {DropZone, FileTrigger, type FileAcquisitionResult} from '../src/index.js';

function announce(result: FileAcquisitionResult): string {
  return `${result.files.length} accepted, ${result.rejectedFiles.length} rejected`;
}

export const fileAcquisition = (
  <>
    <FileTrigger
      reserveSupportSpace={false}
      acceptedFileTypes={['image/*', '.pdf']}
      allowsMultiple
      getAnnouncement={announce}
      label="Choose references"
      maxFileSize={10_000_000}
      onFiles={(result) => result.files.map((file) => file.name)}
    />
    <DropZone
      acceptedFileTypes={['image/*']}
      actionLabel="Browse images"
      description="Drop, paste, or browse for images."
      getAnnouncement={announce}
      isPending
      label="Images"
      onFiles={(result) => result.rejectedFiles.map((rejection) => rejection.reasons)}
      pendingMessage="Checking images"
    />
  </>
);

export const unannouncedTrigger = (
  // @ts-expect-error File acquisition requires localized result announcements.
  <FileTrigger label="Choose files" onFiles={() => undefined} />
);

export const inertTrigger = (
  // @ts-expect-error File acquisition must provide a consumer callback.
  <FileTrigger getAnnouncement={announce} label="Choose files" />
);

export const silentPendingDropZone = (
  // @ts-expect-error Pending acquisition requires a pending message.
  <DropZone
    actionLabel="Browse files"
    description="Drop files."
    getAnnouncement={announce}
    isPending
    label="Files"
    onFiles={() => undefined}
  />
);

export const styledDropZone = (
  <DropZone
    actionLabel="Browse files"
    // @ts-expect-error DropZone does not accept consumer class injection.
    className="drop-zone"
    description="Drop files."
    getAnnouncement={announce}
    label="Files"
    onFiles={() => undefined}
  />
);
