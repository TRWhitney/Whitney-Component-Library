import {useEffect, useRef, type ReactElement} from 'react';
import type {LayoutChildrenProps} from './layout-types.js';
import {fieldGeometry} from './focus-field-geometry.js';

export interface FocusFieldProps extends LayoutChildrenProps {
  /** Emphasize a meaningful active region. This is independent of keyboard focus. */
  readonly isActive: boolean;
}

export function FocusField({children, isActive}: FocusFieldProps): ReactElement {
  const element = useRef<HTMLDivElement>(null);
  const previousActive = useRef(isActive);

  useEffect(() => {
    const field = element.current!;
    const win = field.ownerDocument.defaultView!;
    const surfaces = () =>
      [...field.querySelectorAll<HTMLElement>('[data-wcl-surface]')].filter(
        (panel) => panel.closest('[data-wcl-focus-field]') === field,
      );
    const update = () => {
      const panels = surfaces();
      const anchors = panels.filter((panel) => panel.hasAttribute('data-wcl-focus-field-anchor'));
      const anchor = anchors.length === 1 ? anchors[0] : undefined;
      const bounds = field.getBoundingClientRect();
      const rect = anchor?.getBoundingClientRect();
      if (!anchor || !rect?.width || !rect.height || !bounds.width || !bounds.height) {
        field.removeAttribute('data-positioned');
        return;
      }
      const obstacles = panels.filter(
        (panel) =>
          panel !== anchor &&
          !anchor.contains(panel) &&
          !panel.contains(anchor) &&
          !panels.some((other) => other !== panel && other.contains(panel)),
      );
      const geometry = fieldGeometry(
        bounds,
        rect,
        obstacles.map((panel) => panel.getBoundingClientRect()),
      );
      for (const [name, value] of Object.entries(geometry)) {
        const cssName = `--wcl-field-${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
        const cssValue = `${value.toFixed(2)}px`;
        if (field.style.getPropertyValue(cssName) !== cssValue)
          field.style.setProperty(cssName, cssValue);
      }
      field.setAttribute('data-positioned', '');
    };
    const resize =
      typeof win.ResizeObserver === 'function' ? new win.ResizeObserver(update) : undefined;
    const observe = () => {
      resize?.disconnect();
      resize?.observe(field);
      // A wrapper can move a panel without changing the panel's own dimensions.
      const containers = new Set<HTMLElement>();
      for (const panel of surfaces()) {
        let node: HTMLElement | null = panel;
        while (node && node !== field) {
          containers.add(node);
          node = node.parentElement;
        }
      }
      for (const node of containers) resize?.observe(node);
      update();
    };
    const mutation = new win.MutationObserver((records) => {
      if (records.some((record) => record.type === 'childList')) observe();
      else if (records.some((record) => record.target !== field)) update();
    });
    mutation.observe(field, {
      childList: true,
      characterData: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['hidden', 'class', 'style', 'dir', 'data-wcl-focus-field-anchor'],
    });
    // Inherited direction can swap columns without changing any observed size.
    for (let ancestor = field.parentElement; ancestor; ancestor = ancestor.parentElement) {
      mutation.observe(ancestor, {attributes: true, attributeFilter: ['dir']});
    }
    win.addEventListener('resize', update);
    field.addEventListener('scroll', update, true);
    observe();
    return () => {
      resize?.disconnect();
      mutation.disconnect();
      win.removeEventListener('resize', update);
      field.removeEventListener('scroll', update, true);
    };
  }, []);

  useEffect(() => {
    const field = element.current!;
    const activated = isActive && !previousActive.current;
    previousActive.current = isActive;
    if (!activated) return;
    field.setAttribute('data-pulse', '');
    const timer = setTimeout(() => field.removeAttribute('data-pulse'), 950);
    return () => {
      clearTimeout(timer);
      field.removeAttribute('data-pulse');
    };
  }, [isActive]);

  return (
    <div ref={element} data-wcl-focus-field="" data-active={isActive}>
      {children}
    </div>
  );
}
