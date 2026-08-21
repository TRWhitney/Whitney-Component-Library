import type {ReactElement} from 'react';

interface FileSupportProps {
  readonly announcement: string | null;
  readonly description?: string | undefined;
  readonly descriptionId: string;
  readonly errorId: string;
  readonly errorMessage?: string | undefined;
  readonly isInvalid: boolean;
  readonly isPending: boolean;
  readonly pendingMessage?: string | undefined;
  readonly statusId: string;
}

export function FileSupport({
  announcement,
  description,
  descriptionId,
  errorId,
  errorMessage,
  isInvalid,
  isPending,
  pendingMessage,
  statusId,
}: FileSupportProps): ReactElement {
  return (
    <div data-wcl-file-support="">
      {description ? (
        <span data-wcl-file-description="" id={descriptionId}>
          {description}
        </span>
      ) : null}
      {isInvalid && errorMessage ? (
        <span data-wcl-file-error="" id={errorId}>
          {errorMessage}
        </span>
      ) : null}
      {isPending && pendingMessage ? (
        <span
          aria-atomic="true"
          aria-live="polite"
          data-wcl-file-pending=""
          id={statusId}
          role="status"
        >
          {pendingMessage}
        </span>
      ) : !isPending && announcement ? (
        <span
          aria-atomic="true"
          aria-live="polite"
          data-wcl-file-announcement=""
          id={statusId}
          role="status"
        >
          {announcement}
        </span>
      ) : null}
    </div>
  );
}

export function supportIds({
  announcement,
  description,
  descriptionId,
  errorId,
  errorMessage,
  isInvalid,
  isPending,
  pendingMessage,
  statusId,
}: FileSupportProps): string | undefined {
  const ids = [
    description ? descriptionId : null,
    isInvalid && errorMessage ? errorId : null,
    (isPending && pendingMessage) || (!isPending && announcement) ? statusId : null,
  ].filter((id): id is string => id !== null);
  return ids.length === 0 ? undefined : ids.join(' ');
}
