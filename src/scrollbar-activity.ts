import {useEffect, useRef, useState, type HTMLAttributes} from 'react';

const SCROLLBAR_IDLE_DELAY = 900;

type ScrollbarActivityProps<Element extends HTMLElement> = Pick<
  HTMLAttributes<Element>,
  'onPointerEnter' | 'onPointerMove' | 'onScroll'
> & {
  readonly 'data-scrollbar-active': true | undefined;
};

export function useScrollbarActivity<
  Element extends HTMLElement,
>(): ScrollbarActivityProps<Element> {
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

  return {
    'data-scrollbar-active': isScrollbarActive || undefined,
    onPointerEnter: revealScrollbar,
    onPointerMove: revealScrollbar,
    onScroll: revealScrollbar,
  };
}
