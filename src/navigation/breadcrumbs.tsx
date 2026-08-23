'use client';

import {Button as AriaButton} from 'react-aria-components/Button';
import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
} from 'react-aria-components/Dialog';
import {Popover as AriaPopover} from 'react-aria-components/Popover';
import {Fragment, useEffect, useRef, useState, type ReactElement} from 'react';

import {
  AnchorArrow,
  AnchoredOverlayDirectionProvider,
  anchoredOverlayPositionProps,
  anchoredPlacement,
} from '../overlays/anchored-overlay.js';
import type {OverlayDirection} from '../overlays/overlay-frame.js';

import type {BreadcrumbItem, BreadcrumbsProps} from './navigation-types.js';

function BreadcrumbLink({item}: {readonly item: BreadcrumbItem}): ReactElement {
  return (
    <a
      data-wcl-breadcrumb-link=""
      href={item.href}
      {...(item.newWindow ? {rel: 'noopener noreferrer', target: '_blank'} : {})}
    >
      {item.label}
    </a>
  );
}

function BreadcrumbSeparator(): ReactElement {
  return (
    <svg aria-hidden="true" data-wcl-breadcrumb-separator="" viewBox="0 0 12 12">
      <path d="m4 2 4 4-4 4" />
    </svg>
  );
}

function elementDirection(element: HTMLElement): OverlayDirection {
  const scopedDirection = element.closest<HTMLElement>('[dir]')?.dir;
  if (scopedDirection === 'rtl' || scopedDirection === 'ltr') return scopedDirection;
  return element.ownerDocument.defaultView?.getComputedStyle(element).direction === 'rtl'
    ? 'rtl'
    : 'ltr';
}

function BreadcrumbOverflow({
  items,
  moreLabel,
}: {
  readonly items: readonly BreadcrumbItem[];
  readonly moreLabel: string;
}): ReactElement {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [direction, setDirection] = useState<OverlayDirection>();

  useEffect(() => {
    if (!triggerRef.current) return;
    const nextDirection = elementDirection(triggerRef.current);
    setDirection((currentDirection) =>
      currentDirection === nextDirection ? currentDirection : nextDirection,
    );
  }, [items]);

  return (
    <AnchoredOverlayDirectionProvider direction={direction}>
      <AriaDialogTrigger>
        <AriaButton aria-label={moreLabel} data-wcl-breadcrumb-overflow-trigger="" ref={triggerRef}>
          <span aria-hidden="true">…</span>
        </AriaButton>
        <AriaPopover
          {...anchoredOverlayPositionProps}
          data-wcl-breadcrumb-popover=""
          dir={direction}
          offset={8}
          placement={anchoredPlacement('bottom', 'start')}
        >
          <AnchorArrow />
          <AriaDialog aria-label={moreLabel} data-wcl-breadcrumb-overflow-dialog="">
            <ol data-wcl-breadcrumb-overflow-list="">
              {items.map((item) => (
                <li key={item.id}>
                  <BreadcrumbLink item={item} />
                </li>
              ))}
            </ol>
          </AriaDialog>
        </AriaPopover>
      </AriaDialogTrigger>
    </AnchoredOverlayDirectionProvider>
  );
}

export function Breadcrumbs({
  ariaLabel,
  items,
  maxVisible = 4,
  moreLabel = 'More locations',
}: BreadcrumbsProps): ReactElement {
  const [firstItem, ...remainingItems] = items;
  const current = remainingItems.at(-1) ?? firstItem;
  const collapses = items.length > maxVisible;
  const retainedTailCount = Math.max(1, maxVisible - 2);
  const middleEnd = collapses ? items.length - retainedTailCount : 1;
  const collapsedItems = collapses ? items.slice(1, middleEnd) : [];
  const visibleItems = collapses ? [firstItem, ...items.slice(middleEnd)] : items;

  return (
    <nav aria-label={ariaLabel} data-wcl-breadcrumbs="">
      <ol data-wcl-breadcrumb-list="">
        {visibleItems.map((item, index) => {
          const isCurrent = item.id === current.id;
          const insertsCollapsed = collapses && index === 1;

          return (
            <Fragment key={item.id}>
              {insertsCollapsed ? (
                <li data-wcl-breadcrumb-item="">
                  <BreadcrumbSeparator />
                  <div data-wcl-breadcrumb-overflow="">
                    <BreadcrumbOverflow items={collapsedItems} moreLabel={moreLabel} />
                  </div>
                </li>
              ) : null}
              <li data-wcl-breadcrumb-item="">
                {index > 0 ? <BreadcrumbSeparator /> : null}
                {isCurrent ? (
                  <span aria-current="page" data-wcl-breadcrumb-current="">
                    {item.label}
                  </span>
                ) : (
                  <BreadcrumbLink item={item} />
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
