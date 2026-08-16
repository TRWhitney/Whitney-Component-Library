import type {ReactElement} from 'react';

import type {LayoutChildrenProps} from './layout-types.js';

export type SurfaceVariant = 'base' | 'raised' | 'subtle';
export type SurfacePadding = 'compact' | 'regular' | 'spacious';

export interface SurfaceProps extends LayoutChildrenProps {
  readonly padding?: SurfacePadding;
  readonly variant?: SurfaceVariant;
}

export function Surface({
  children,
  padding = 'regular',
  variant = 'base',
}: SurfaceProps): ReactElement {
  return (
    <div data-wcl-surface="" data-padding={padding} data-variant={variant}>
      {children}
    </div>
  );
}
