import type {ReactElement} from 'react';

import {Button} from '../actions/button.js';
import type {EmptyStateKind, EmptyStateProps} from './feedback-types.js';

function EmptyStateGlyph({kind}: {readonly kind: EmptyStateKind}): ReactElement {
  if (kind === 'no-results') {
    return (
      <svg aria-hidden="true" data-wcl-empty-glyph="" viewBox="0 0 32 32">
        <circle cx="13.5" cy="13.5" r="7.5" />
        <path d="m19 19 6 6M10.5 13.5h6" />
      </svg>
    );
  }

  if (kind === 'unavailable') {
    return (
      <svg aria-hidden="true" data-wcl-empty-glyph="" viewBox="0 0 32 32">
        <path d="M16 4 28 26H4Z" />
        <path d="M16 11v7M16 22v.2" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" data-wcl-empty-glyph="" viewBox="0 0 32 32">
      <path d="M5 9h22v16H5ZM9 5h14M10 14h12M10 19h8" />
    </svg>
  );
}

export function EmptyState({
  actionLabel,
  description,
  kind,
  onAction,
  title,
}: EmptyStateProps): ReactElement {
  return (
    <div data-kind={kind} data-wcl-empty-state="">
      <span data-wcl-empty-visual="">
        <EmptyStateGlyph kind={kind} />
      </span>
      <div data-wcl-empty-copy="">
        <strong data-wcl-empty-title="">{title}</strong>
        <p data-wcl-empty-description="">{description}</p>
        {actionLabel === undefined || onAction === undefined ? null : (
          <div data-wcl-empty-action="">
            <Button onPress={onAction} size="compact">
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
