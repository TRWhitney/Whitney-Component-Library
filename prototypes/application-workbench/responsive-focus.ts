import {useEffect} from 'react';

/** Transfer focus between the app's equivalent fields when a pane becomes a drawer. */
export function useResponsiveFocus(
  onDetails: (open: boolean) => void,
  onNavigator: (open: boolean) => void,
) {
  useEffect(() => {
    let lastFocused: HTMLElement | null = null;
    const rememberFocus = (event: FocusEvent) => {
      const target = event.target;
      lastFocused =
        target instanceof HTMLElement && target.closest('[data-focus-key]') ? target : null;
    };
    const clearOnPointer = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('[data-focus-key]'))
        lastFocused = null;
    };
    document.addEventListener('focusin', rememberFocus);
    document.addEventListener('pointerdown', clearOnPointer);
    const timers: ReturnType<typeof setTimeout>[] = [];
    const subscriptions = [
      {query: matchMedia('(max-width: 1100px)'), region: '.inspector-content', open: onDetails},
      {query: matchMedia('(max-width: 760px)'), region: '.navigator-content', open: onNavigator},
    ].map(({query, region, open}) => {
      const change = () => {
        const focused = lastFocused ?? document.activeElement;
        if (!(focused instanceof HTMLElement) || !focused.closest(region)) return;
        const key = focused.closest<HTMLElement>('[data-focus-key]')?.dataset.focusKey;
        if (!key) return;
        const selection =
          focused instanceof HTMLInputElement || focused instanceof HTMLTextAreaElement
            ? ([focused.selectionStart, focused.selectionEnd] as const)
            : null;
        open(query.matches);
        timers.push(
          setTimeout(() => {
            const candidates = document.querySelectorAll<HTMLElement>(
              `${region} [data-focus-key="${key}"] :is(input, textarea, button)`,
            );
            const target = [...candidates].find(
              (element) => element.getClientRects().length > 0 && !element.closest('[hidden]'),
            );
            target?.focus();
            if (
              selection &&
              selection[0] !== null &&
              selection[1] !== null &&
              (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
            ) {
              target.setSelectionRange(selection[0], selection[1]);
            }
          }, 220),
        );
      };
      query.addEventListener('change', change);
      return () => query.removeEventListener('change', change);
    });
    return () => {
      document.removeEventListener('focusin', rememberFocus);
      document.removeEventListener('pointerdown', clearOnPointer);
      subscriptions.forEach((unsubscribe) => unsubscribe());
      timers.forEach(clearTimeout);
    };
  }, [onDetails, onNavigator]);
}
