import type {ReactElement} from 'react';

import type {LayoutChildrenProps, LayoutGap} from './layout-types.js';

export type GridMinimumItemWidth = 'compact' | 'regular' | 'wide';

export interface ResponsiveGridProps extends LayoutChildrenProps {
  readonly equalItems?: boolean;
  readonly gap?: LayoutGap;
  readonly minimumItemWidth?: GridMinimumItemWidth;
}

export function ResponsiveGrid({
  children,
  equalItems = false,
  gap = 'regular',
  minimumItemWidth = 'regular',
}: ResponsiveGridProps): ReactElement {
  return (
    <div
      data-wcl-responsive-grid=""
      data-equal-items={String(equalItems)}
      data-gap={gap}
      data-minimum-item-width={minimumItemWidth}
    >
      {children}
    </div>
  );
}
