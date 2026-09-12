'use client';

import {useRef, useState, useEffect, type DOMAttributes, type RefObject} from 'react';
import {useMenuTrigger} from 'react-aria/useMenu';
import {useMenuTriggerState} from 'react-stately/useMenuTriggerState';
import {OverlayTriggerStateContext} from 'react-aria-components/Dialog';
import {Menu as AriaMenu, RootMenuTriggerStateContext} from 'react-aria-components/Menu';
import {Popover as AriaPopover} from 'react-aria-components/Popover';

import {
  AnchorArrow,
  AnchoredOverlayDirectionProvider,
  anchoredOverlayPositionProps,
} from '../overlays/anchored-overlay.js';
import {renderMenuItems} from '../overlays/menu.js';
import type {CollectionContextMenuProps} from './advanced-collection-types.js';

export function useCollectionContextMenu<RowId extends string>(
  options: CollectionContextMenuProps<RowId> | undefined,
  ids: readonly RowId[],
  collectionRef: RefObject<HTMLElement | null>,
) {
  const targetRef = useRef<HTMLElement | null>(null);
  const rowCleanups = useRef(new Map<RowId, () => void>());
  const rowRefs = useRef(new Map<RowId, HTMLElement>());
  const scrollRef = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<{id: RowId; index: number; direction: 'ltr' | 'rtl'} | null>(
    null,
  );
  const focusOrigin = useRef<HTMLElement | null>(null);
  const restoreFrame = useRef<number | null>(null);
  const restoreAfterClose = useRef(false);
  useEffect(
    () => () => {
      if (restoreFrame.current !== null) cancelAnimationFrame(restoreFrame.current);
    },
    [],
  );
  const state = useMenuTriggerState({
    onOpenChange: (isOpen) => {
      if (!isOpen) restoreAfterClose.current = true;
    },
  });
  const {menuTriggerProps, menuProps} = useMenuTrigger({trigger: 'contextMenu'}, state, targetRef);
  const triggerHandlers = menuTriggerProps as DOMAttributes<HTMLElement>;
  const collectionMenuProps = {...menuProps};
  delete collectionMenuProps['aria-labelledby'];

  useEffect(() => {
    if (target && !ids.includes(target.id) && state.isOpen) state.close();
    if (!state.isOpen && restoreAfterClose.current) {
      restoreAfterClose.current = false;
      if (!target) return;
      // Let the overlay finish restoring its anchor before restoring a nested
      // control or replacing an anchor removed by the selected action.
      restoreFrame.current = requestAnimationFrame(() => {
        restoreFrame.current = requestAnimationFrame(() => {
          const document = collectionRef.current?.ownerDocument;
          const active = document?.activeElement;
          if (
            active &&
            active !== document?.body &&
            !collectionRef.current?.contains(active) &&
            !scrollRef.current?.contains(active)
          )
            return;
          const visibleRows = ids.flatMap((id) => {
            const row = rowRefs.current.get(id);
            return row && row.getAttribute('aria-disabled') !== 'true' ? [row] : [];
          });
          const fallback =
            visibleRows[Math.min(target.index, visibleRows.length - 1)] ?? collectionRef.current;
          (focusOrigin.current?.isConnected ? focusOrigin.current : fallback)?.focus({
            preventScroll: true,
          });
          restoreFrame.current = null;
        });
      });
    }
  }, [ids, state, target, collectionRef]);

  function getRowProps(id: RowId, isDisabled = false) {
    if (!options) return {};
    function prepare(row: HTMLElement) {
      targetRef.current = row;
      const active = row.ownerDocument.activeElement;
      focusOrigin.current = active instanceof HTMLElement && row.contains(active) ? active : row;
      const direction =
        row.ownerDocument.defaultView?.getComputedStyle(row).direction === 'rtl' ? 'rtl' : 'ltr';
      setTarget({id, index: ids.filter((key) => rowRefs.current.has(key)).indexOf(id), direction});
    }
    return {
      ref: (row: HTMLElement | null) => {
        rowCleanups.current.get(id)?.();
        rowCleanups.current.delete(id);
        if (!row) {
          rowRefs.current.delete(id);
          return;
        }
        rowRefs.current.set(id, row);
        const onKeyDown = (event: KeyboardEvent) => {
          if (
            isDisabled ||
            event.defaultPrevented ||
            !((event.key === 'F10' && event.shiftKey) || event.key === 'ContextMenu')
          )
            return;
          event.preventDefault();
          event.stopPropagation();
          if (event.repeat) return;
          const origin = event.target as HTMLElement;
          const rect = origin.getBoundingClientRect();
          origin.dispatchEvent(
            new MouseEvent('contextmenu', {
              bubbles: true,
              cancelable: true,
              clientX: rect.left + rect.width / 2,
              clientY: rect.top + rect.height / 2,
            }),
          );
          focusOrigin.current = origin;
        };
        const onPointerDown = (event: PointerEvent) => {
          if (isDisabled || event.pointerType !== 'touch' || options.getItems(id).length === 0)
            return;
          prepare(row);
          // Collection components own keyboard and pointer handlers. Feed the public
          // context trigger its pointer event at the row before nested controls handle it.
          triggerHandlers.onPointerDown?.({
            nativeEvent: event,
            currentTarget: row,
            target: event.target,
            pointerId: event.pointerId,
            pointerType: event.pointerType,
            button: event.button,
            clientX: event.clientX,
            clientY: event.clientY,
            preventDefault: () => event.preventDefault(),
            stopPropagation: () => event.stopPropagation(),
          } as React.PointerEvent<HTMLElement>);
        };
        row.addEventListener('keydown', onKeyDown, true);
        row.addEventListener('pointerdown', onPointerDown, true);
        rowCleanups.current.set(id, () => {
          row.removeEventListener('keydown', onKeyDown, true);
          row.removeEventListener('pointerdown', onPointerDown, true);
        });
      },
      onContextMenu: (event: React.MouseEvent<HTMLElement>) => {
        if (event.defaultPrevented) return;
        event.stopPropagation();
        if (isDisabled || options.getItems(id).length === 0) return;
        prepare(event.currentTarget);
        const active = event.currentTarget.ownerDocument.activeElement;
        if (!event.currentTarget.contains(active)) event.currentTarget.focus({preventScroll: true});
        triggerHandlers.onContextMenu?.(event);
      },
    };
  }

  const targetAvailable = target && ids.includes(target.id);
  const label = targetAvailable && options ? options.getLabel(target.id) : undefined;
  const menuNameProps = label === undefined ? {} : {'aria-label': label};
  const overlay =
    targetAvailable && options ? (
      <AnchoredOverlayDirectionProvider direction={target.direction}>
        <RootMenuTriggerStateContext.Provider value={state}>
          <OverlayTriggerStateContext.Provider value={state}>
            <AriaPopover
              {...anchoredOverlayPositionProps}
              trigger="MenuTrigger"
              triggerRef={targetRef}
              scrollRef={scrollRef}
              offset={0}
              {...menuNameProps}
              data-context-menu=""
              data-wcl-menu-popover=""
              dir={target.direction}
            >
              <AnchorArrow />
              <AriaMenu
                {...collectionMenuProps}
                {...menuNameProps}
                ref={scrollRef}
                data-wcl-menu=""
              >
                {renderMenuItems(options.getItems(target.id), target.direction)}
              </AriaMenu>
            </AriaPopover>
          </OverlayTriggerStateContext.Provider>
        </RootMenuTriggerStateContext.Provider>
      </AnchoredOverlayDirectionProvider>
    ) : null;
  return {getRowProps, overlay};
}
