import type {ReactElement} from 'react';

import type {LayoutAlignment, LayoutChildrenProps, LayoutGap} from './layout-types.js';

export interface StackProps extends LayoutChildrenProps {
  readonly align?: LayoutAlignment;
  readonly gap?: LayoutGap;
}

export function Stack({align = 'stretch', children, gap = 'regular'}: StackProps): ReactElement {
  return (
    <div data-wcl-stack="" data-align={align} data-gap={gap}>
      {children}
    </div>
  );
}
