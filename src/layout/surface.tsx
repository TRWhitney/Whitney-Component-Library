import type {ReactElement} from 'react';

import type {LayoutChildrenProps} from './layout-types.js';

export type SurfaceVariant = 'base' | 'raised' | 'subtle';
export type SurfacePadding = 'compact' | 'regular' | 'spacious';

export interface SurfaceProps extends LayoutChildrenProps {
  readonly padding?: SurfacePadding;
  /** Choose this panel as the anchor inside its nearest FocusField. */
  readonly focusFieldAnchor?: boolean;
  readonly variant?: SurfaceVariant;
}

export function Surface({
  children,
  padding = 'regular',
  focusFieldAnchor = false,
  variant = 'base',
}: SurfaceProps): ReactElement {
  return (
    <div
      data-wcl-surface=""
      data-padding={padding}
      data-variant={variant}
      data-wcl-focus-field-anchor={focusFieldAnchor ? '' : undefined}
    >
      {children}
    </div>
  );
}
