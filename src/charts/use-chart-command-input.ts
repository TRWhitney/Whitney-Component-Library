import {useEffect, useLayoutEffect, useRef, type RefObject} from 'react';

type Command = {readonly run: () => void; readonly disabled: boolean};
export function useChartCommandInput(
  scope: RefObject<HTMLDivElement | null>,
  commands: Readonly<Record<string, Command>>,
  owningCanvas?: HTMLElement | null,
): void {
  const current = useRef(commands);
  const lastFocusedCommand = useRef<HTMLButtonElement | null>(null);
  useLayoutEffect(() => {
    const controls = scope.current;
    if (!controls) return;
    const canvas = owningCanvas ?? controls.closest<HTMLElement>('[data-wcl-chart-canvas]');
    const active = controls.ownerDocument.activeElement;
    const button =
      active instanceof HTMLButtonElement && controls.contains(active)
        ? active
        : lastFocusedCommand.current;
    if (
      button?.disabled &&
      canvas &&
      (active === button || active === controls.ownerDocument.body)
    ) {
      canvas.focus({preventScroll: true});
      lastFocusedCommand.current = null;
    }
  });
  useEffect(() => {
    current.current = commands;
  });
  useEffect(() => {
    const controls = scope.current;
    if (!controls) return;
    const canvas =
      owningCanvas ??
      controls.closest<HTMLElement>('[data-wcl-chart-canvas]') ??
      controls
        .closest('[data-wcl-heatmap-visual]')
        ?.querySelector<HTMLElement>('[data-wcl-heatmap-canvas]');
    const boundaries =
      canvas && !canvas.contains(controls) ? [canvas, controls] : [canvas ?? controls];
    const previousShortcuts = canvas?.getAttribute('aria-keyshortcuts');
    canvas?.setAttribute(
      'aria-keyshortcuts',
      `${previousShortcuts ?? ''} + - = Shift+ArrowLeft Shift+ArrowRight Shift+ArrowUp Shift+ArrowDown`.trim(),
    );
    const keyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        (event.shiftKey && event.key.startsWith('Arrow'))
      )
        return;
      const target = event.target;
      if (!(target instanceof Element) || !boundaries.some((boundary) => boundary.contains(target)))
        return;
      if (target !== canvas && !controls.contains(target.closest('button'))) return;
      const button = target.closest('button');
      if (button && controls.contains(button)) lastFocusedCommand.current = button;
      const command = current.current[event.key];
      if (!command) return;
      event.preventDefault();
      event.stopPropagation();
      if (!command.disabled) command.run();
    };
    let wheelDistance = 0;
    let lastWheelTime = 0;
    const wheel = (event: WheelEvent) => {
      const active = controls.ownerDocument.activeElement;
      const target = event.target;
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        event.shiftKey ||
        event.deltaY === 0 ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
        !(target instanceof Element) ||
        !boundaries.some((boundary) => boundary.contains(target)) ||
        (active !== canvas && !(active instanceof HTMLButtonElement && controls.contains(active)))
      )
        return;
      event.preventDefault();
      event.stopPropagation();
      const unit =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? canvas?.clientHeight || 400 : 1;
      const distance = event.deltaY * unit;
      if (event.timeStamp - lastWheelTime > 150 || Math.sign(distance) !== Math.sign(wheelDistance))
        wheelDistance = 0;
      lastWheelTime = event.timeStamp;
      wheelDistance += distance;
      if (Math.abs(wheelDistance) < 40) return;
      const command = current.current[wheelDistance < 0 ? '+' : '-'];
      wheelDistance = 0;
      if (command && !command.disabled) command.run();
    };
    const restoreFocus = (event: Event) => {
      const button = event.target instanceof Element ? event.target.closest('button') : null;
      if (!button || !controls.contains(button)) return;
      lastFocusedCommand.current = button;
      requestAnimationFrame(() => {
        if (
          button.disabled &&
          canvas?.isConnected &&
          (document.activeElement === document.body || document.activeElement === button)
        )
          canvas.focus({preventScroll: true});
      });
    };
    for (const boundary of [controls.ownerDocument]) {
      boundary.addEventListener('keydown', keyDown, true);
      boundary.addEventListener('wheel', wheel, {capture: true, passive: false});
      boundary.addEventListener('click', restoreFocus, true);
      boundary.addEventListener('focusout', restoreFocus, true);
    }
    return () => {
      for (const boundary of [controls.ownerDocument]) {
        boundary.removeEventListener('keydown', keyDown, true);
        boundary.removeEventListener('wheel', wheel, true);
        boundary.removeEventListener('click', restoreFocus, true);
        boundary.removeEventListener('focusout', restoreFocus, true);
      }
      if (canvas) {
        if (previousShortcuts === null || previousShortcuts === undefined)
          canvas.removeAttribute('aria-keyshortcuts');
        else canvas.setAttribute('aria-keyshortcuts', previousShortcuts);
      }
    };
  }, [scope, owningCanvas]);
}
