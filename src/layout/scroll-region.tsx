import type {ReactElement} from 'react';

import type {LayoutChildrenProps} from './layout-types.js';

export type ScrollRegionSize = 'compact' | 'regular' | 'tall';
export type ScrollRegionOrientation = 'vertical' | 'horizontal' | 'both';

export interface ScrollRegionProps extends LayoutChildrenProps {
  readonly label: string;
  readonly orientation?: ScrollRegionOrientation;
  readonly size?: ScrollRegionSize;
}

export function ScrollRegion({
  children,
  label,
  orientation = 'vertical',
  size = 'regular',
}: ScrollRegionProps): ReactElement {
  return (
    <div
      aria-label={label}
      data-wcl-scroll-region=""
      data-orientation={orientation}
      data-size={size}
      role="region"
      tabIndex={0}
    >
      {children}
    </div>
  );
}
