'use client';

import {Header} from 'react-aria-components/Header';
import {Keyboard} from 'react-aria-components/Keyboard';
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  SubmenuTrigger as AriaSubmenuTrigger,
} from 'react-aria-components/Menu';
import {Popover as AriaPopover} from 'react-aria-components/Popover';
import {Separator as AriaSeparator} from 'react-aria-components/Separator';
import {Text} from 'react-aria-components/Text';
import {useState, type ReactElement, type ReactNode} from 'react';

import {
  AnchorArrow,
  AnchoredOverlayDirectionProvider,
  anchoredOverlayPositionProps,
  anchoredPlacement,
} from './anchored-overlay.js';
import {OverlayTriggerBoundary, type OverlayDirection} from './overlay-frame.js';
import type {
  MenuActionItem,
  MenuItem,
  MenuItems,
  MenuProps,
  MenuSubmenuItem,
} from './overlay-types.js';

function SubmenuChevron(): ReactElement {
  return (
    <svg aria-hidden="true" data-wcl-menu-chevron="" viewBox="0 0 16 16">
      <path d="m6 3 5 5-5 5" />
    </svg>
  );
}

function MenuActionContent({item}: {readonly item: MenuActionItem}): ReactElement {
  return (
    <>
      <span aria-hidden="true" data-wcl-menu-item-rail="" />
      <span data-wcl-menu-item-copy="">
        <span data-wcl-menu-item-label="">{item.label}</span>
        {item.description ? (
          <Text data-wcl-menu-item-description="" slot="description">
            {item.description}
          </Text>
        ) : null}
      </span>
      {item.shortcut ? <Keyboard data-wcl-menu-shortcut="">{item.shortcut}</Keyboard> : null}
    </>
  );
}

function SubmenuContent({item}: {readonly item: MenuSubmenuItem}): ReactElement {
  return (
    <>
      <span aria-hidden="true" data-wcl-menu-item-rail="" />
      <span data-wcl-menu-item-copy="">
        <span data-wcl-menu-item-label="">{item.label}</span>
      </span>
      <SubmenuChevron />
    </>
  );
}

export function renderMenuItems(
  items: MenuItems,
  direction: OverlayDirection | undefined,
): ReactNode {
  return items.map((item: MenuItem) => {
    if (item.type === 'separator') {
      return <AriaSeparator data-wcl-menu-separator="" key={item.id} />;
    }

    if (item.type === 'group') {
      return (
        <AriaMenuSection data-wcl-menu-group="" id={item.id} key={item.id}>
          <Header data-wcl-menu-group-label="">{item.label}</Header>
          {renderMenuItems(item.items, direction)}
        </AriaMenuSection>
      );
    }

    if (item.type === 'submenu') {
      return (
        <AriaSubmenuTrigger key={item.id}>
          <AriaMenuItem
            data-wcl-menu-item=""
            id={item.id}
            textValue={item.label}
            {...(item.isDisabled === undefined ? {} : {isDisabled: item.isDisabled})}
          >
            <SubmenuContent item={item} />
          </AriaMenuItem>
          <AriaPopover
            {...anchoredOverlayPositionProps}
            data-submenu=""
            data-wcl-menu-popover=""
            dir={direction}
            offset={4}
          >
            <AnchorArrow />
            <AriaMenu aria-label={item.label} data-wcl-menu="">
              {renderMenuItems(item.items, direction)}
            </AriaMenu>
          </AriaPopover>
        </AriaSubmenuTrigger>
      );
    }

    return (
      <AriaMenuItem
        data-tone={item.tone ?? 'neutral'}
        data-wcl-menu-item=""
        id={item.id}
        key={item.id}
        onAction={item.onAction}
        textValue={item.label}
        {...(item.isDisabled === undefined ? {} : {isDisabled: item.isDisabled})}
      >
        <MenuActionContent item={item} />
      </AriaMenuItem>
    );
  });
}

export function Menu({
  alignment = 'start',
  items,
  placement = 'bottom',
  trigger,
  ...state
}: MenuProps): ReactElement {
  const [direction, setDirection] = useState<OverlayDirection>();

  return (
    <AnchoredOverlayDirectionProvider direction={direction}>
      <AriaMenuTrigger {...state}>
        <OverlayTriggerBoundary kind="menu" onDirectionChange={setDirection}>
          {trigger}
        </OverlayTriggerBoundary>
        <AriaPopover
          {...anchoredOverlayPositionProps}
          data-wcl-menu-popover=""
          dir={direction}
          offset={8}
          placement={anchoredPlacement(placement, alignment)}
        >
          <AnchorArrow />
          <AriaMenu data-wcl-menu="">{renderMenuItems(items, direction)}</AriaMenu>
        </AriaPopover>
      </AriaMenuTrigger>
    </AnchoredOverlayDirectionProvider>
  );
}
