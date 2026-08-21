import type {ReactElement} from 'react';

import {announcementProps, ToneGlyph} from './feedback-support.js';
import type {StatusIndicatorProps} from './feedback-types.js';

export function StatusIndicator({
  announcement = 'off',
  label,
  tone,
}: StatusIndicatorProps): ReactElement {
  return (
    <span {...announcementProps(announcement)} data-tone={tone} data-wcl-status-indicator="">
      <ToneGlyph tone={tone} />
      <span>{label}</span>
    </span>
  );
}
