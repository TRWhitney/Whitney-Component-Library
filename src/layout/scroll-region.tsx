import {useEffect, useRef, useState, type ReactElement} from 'react';

import type {LayoutChildrenProps} from './layout-types.js';

export type ScrollRegionSize = 'compact' | 'regular' | 'tall';
export type ScrollRegionOrientation = 'vertical' | 'horizontal' | 'both';

export interface ScrollRegionProps extends LayoutChildrenProps {
  readonly label: string;
  readonly orientation?: ScrollRegionOrientation;
  readonly size?: ScrollRegionSize;
}

const SCROLLBAR_IDLE_DELAY = 900;

export function ScrollRegion({
  children,
  label,
  orientation = 'vertical',
  size = 'regular',
}: ScrollRegionProps): ReactElement {
  const scrollbarIdleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [isScrollbarActive, setScrollbarActive] = useState(false);

  useEffect(
    () => () => {
      if (scrollbarIdleTimer.current !== undefined) {
        clearTimeout(scrollbarIdleTimer.current);
      }
    },
    [],
  );

  const revealScrollbar = () => {
    setScrollbarActive(true);
    if (scrollbarIdleTimer.current !== undefined) {
      clearTimeout(scrollbarIdleTimer.current);
    }
    scrollbarIdleTimer.current = setTimeout(() => {
      scrollbarIdleTimer.current = undefined;
      setScrollbarActive(false);
    }, SCROLLBAR_IDLE_DELAY);
  };

  return (
    <div
      aria-label={label}
      data-scrollbar-active={isScrollbarActive || undefined}
      data-wcl-scroll-region=""
      data-orientation={orientation}
      data-size={size}
      onPointerEnter={revealScrollbar}
      onPointerMove={revealScrollbar}
      onScroll={revealScrollbar}
      role="region"
      tabIndex={0}
    >
      {children}
    </div>
  );
}
