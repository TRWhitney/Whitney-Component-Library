'use client';

import {Button as AriaButton} from 'react-aria-components/Button';
import type {ReactElement} from 'react';

interface FileActionProps {
  readonly describedBy?: string | undefined;
  readonly isDisabled: boolean;
  readonly isInvalid: boolean;
  readonly isPending: boolean;
  readonly label: string;
}

export function FileAction({
  describedBy,
  isDisabled,
  isInvalid,
  isPending,
  label,
}: FileActionProps): ReactElement {
  return (
    <AriaButton
      {...(describedBy === undefined ? {} : {'aria-describedby': describedBy})}
      aria-invalid={isInvalid || undefined}
      data-size="regular"
      data-variant="secondary"
      data-wcl-button=""
      data-wcl-file-action=""
      isDisabled={isDisabled || isPending}
      isPending={isPending}
      type="button"
    >
      <span data-wcl-action-label="">{label}</span>
    </AriaButton>
  );
}
