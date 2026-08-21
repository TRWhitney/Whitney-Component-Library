import type {ReactElement} from 'react';

import type {SpinnerProps} from './feedback-types.js';

const spinnerSegmentRotations = [0, 60, 120, 180, 240, 300] as const;

export function Spinner({isActive, label}: SpinnerProps): ReactElement {
  return (
    <span data-active={isActive || undefined} data-wcl-spinner="">
      <span aria-hidden="true" data-wcl-spinner-visual="">
        <svg data-wcl-spinner-glyph="" viewBox="0 0 24 24">
          <g data-wcl-spinner-segments="">
            {spinnerSegmentRotations.map((rotation) => (
              <line
                data-wcl-spinner-segment=""
                key={rotation}
                transform={`rotate(${rotation} 12 12)`}
                x1="10.125"
                x2="13.875"
                y1="4.125"
                y2="4.125"
              />
            ))}
          </g>
        </svg>
        <span>{label}</span>
      </span>
      <span aria-atomic="true" data-wcl-visually-hidden="" role="status">
        {isActive ? label : null}
      </span>
    </span>
  );
}
