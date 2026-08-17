import type {ReactElement} from 'react';

interface FieldIconProps {
  readonly kind: 'clear' | 'decrement' | 'increment' | 'search';
}

export function FieldIcon({kind}: FieldIconProps): ReactElement {
  return (
    <svg aria-hidden="true" data-wcl-field-icon="" focusable="false" viewBox="0 0 20 20">
      {kind === 'search' ? (
        <>
          <circle cx="8.5" cy="8.5" r="4.75" />
          <path d="m12 12 4 4" />
        </>
      ) : null}
      {kind === 'clear' ? <path d="m5 5 10 10M15 5 5 15" /> : null}
      {kind === 'decrement' ? <path d="M4 10h12" /> : null}
      {kind === 'increment' ? <path d="M4 10h12M10 4v12" /> : null}
    </svg>
  );
}
