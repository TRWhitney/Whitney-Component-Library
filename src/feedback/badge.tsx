import type {ReactElement} from 'react';

import type {BadgeProps} from './feedback-types.js';

export function Badge({children, tone = 'neutral'}: BadgeProps): ReactElement {
  return (
    <span data-tone={tone} data-wcl-badge="">
      {children}
    </span>
  );
}
