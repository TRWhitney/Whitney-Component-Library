import type {ReactNode} from 'react';

export type ActionSize = 'compact' | 'regular';
export type ActionOrientation = 'horizontal' | 'vertical';

export interface ActionChildrenProps {
  readonly children: ReactNode;
}

export interface ActionStateProps {
  readonly isDisabled?: boolean;
  readonly onPress?: () => void;
}
