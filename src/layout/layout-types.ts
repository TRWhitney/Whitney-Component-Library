import type {ReactNode} from 'react';

export type LayoutGap = 'none' | 'tight' | 'regular' | 'relaxed';
export type LayoutAlignment = 'start' | 'center' | 'end' | 'stretch';

export interface LayoutChildrenProps {
  readonly children: ReactNode;
}
