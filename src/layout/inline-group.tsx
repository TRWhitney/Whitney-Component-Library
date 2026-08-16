import type {ReactElement} from 'react';

import type {LayoutChildrenProps, LayoutGap} from './layout-types.js';

export type InlineGroupAlignment = 'start' | 'center' | 'end' | 'stretch' | 'baseline';

interface InlineGroupBaseProps extends LayoutChildrenProps {
  readonly gap?: LayoutGap;
  readonly wrap?: boolean;
}

export type InlineGroupProps =
  | (InlineGroupBaseProps & {
      readonly align?: InlineGroupAlignment;
      readonly equalItems?: false;
    })
  | (InlineGroupBaseProps & {
      readonly align?: 'stretch';
      readonly equalItems: true;
    });

export function InlineGroup(props: InlineGroupProps): ReactElement {
  const {children, equalItems = false, gap = 'regular', wrap = true} = props;
  const align = props.align ?? (equalItems ? 'stretch' : 'center');

  return (
    <div
      data-wcl-inline-group=""
      data-align={align}
      data-equal-items={String(equalItems)}
      data-gap={gap}
      data-wrap={String(wrap)}
    >
      {children}
    </div>
  );
}
