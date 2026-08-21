import type {ReactElement} from 'react';

import type {SpinnerProps} from './feedback-types.js';

export function Spinner({isActive, label}: SpinnerProps): ReactElement {
  return (
    <span data-active={isActive || undefined} data-wcl-spinner="">
      <span aria-hidden="true" data-wcl-spinner-visual="">
        <svg data-wcl-spinner-glyph="" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 3.5a8.5 8.5 0 0 1 8.5 8.5" />
        </svg>
        <span>{label}</span>
      </span>
      <span aria-atomic="true" data-wcl-visually-hidden="" role="status">
        {isActive ? label : null}
      </span>
    </span>
  );
}
