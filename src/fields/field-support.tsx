'use client';

import {FieldError} from 'react-aria-components/FieldError';
import {Text} from 'react-aria-components/Text';
import type {ReactElement} from 'react';

interface FieldSupportProps {
  readonly description?: string | undefined;
  readonly errorMessage?: string | undefined;
  readonly isPending: boolean;
  readonly pendingMessage?: string | undefined;
}

export function FieldSupport({
  description,
  errorMessage,
  isPending,
  pendingMessage,
}: FieldSupportProps): ReactElement {
  return (
    <div data-wcl-field-support="">
      {description ? (
        <Text data-wcl-field-description="" slot="description">
          {description}
        </Text>
      ) : null}
      <FieldError data-wcl-field-error="">
        {({validationErrors}) => errorMessage ?? validationErrors.join(' ')}
      </FieldError>
      {isPending && pendingMessage ? (
        <span aria-atomic="true" aria-live="polite" data-wcl-field-pending="" role="status">
          {pendingMessage}
        </span>
      ) : null}
    </div>
  );
}
