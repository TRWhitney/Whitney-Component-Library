import type {ReactElement} from 'react';

export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps {
  readonly decorative?: boolean;
  readonly orientation?: DividerOrientation;
}

export function Divider({
  decorative = false,
  orientation = 'horizontal',
}: DividerProps): ReactElement {
  return (
    <div
      aria-hidden={decorative || undefined}
      aria-orientation={decorative ? undefined : orientation}
      data-wcl-divider=""
      data-orientation={orientation}
      role={decorative ? 'presentation' : 'separator'}
    />
  );
}
