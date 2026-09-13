'use client';

import {Button as AriaButton} from 'react-aria-components/Button';
import {Link as AriaLink} from 'react-aria-components/Link';
import {useState, type ReactElement} from 'react';

import type {
  CollapsibleNavigationPaneItem,
  CollapsibleNavigationPaneProps,
} from './navigation-types.js';

function CollapseIcon({isCollapsed}: {readonly isCollapsed: boolean}): ReactElement {
  return (
    <svg
      aria-hidden="true"
      data-wcl-collapsible-navigation-pane-collapse-icon=""
      viewBox="0 0 16 16"
    >
      {isCollapsed ? <path d="m5 3 5 5-5 5" /> : <path d="m11 3-5 5 5 5" />}
    </svg>
  );
}

interface NavigationItemsProps<Id extends string> {
  readonly currentId: Id;
  readonly items: readonly CollapsibleNavigationPaneItem<Id>[];
  readonly level: number;
  readonly onNavigate?: (id: Id) => void;
}

function NavigationItems<Id extends string>({
  currentId,
  items,
  level,
  onNavigate,
}: NavigationItemsProps<Id>): ReactElement {
  return (
    <ul data-level={level} data-wcl-collapsible-navigation-pane-list="">
      {items.map((item) => (
        <li data-wcl-collapsible-navigation-pane-item="" key={item.id}>
          <AriaLink
            aria-current={item.id === currentId ? 'page' : undefined}
            data-wcl-collapsible-navigation-pane-link=""
            href={item.href}
            onPress={() => onNavigate?.(item.id)}
            {...(item.isDisabled === undefined ? {} : {isDisabled: item.isDisabled})}
            {...(item.newWindow ? {rel: 'noopener noreferrer', target: '_blank'} : {})}
          >
            <span aria-hidden="true" data-wcl-collapsible-navigation-pane-marker="" />
            <span>{item.label}</span>
          </AriaLink>
          {item.children && item.children.length > 0 ? (
            <NavigationItems
              currentId={currentId}
              items={item.children}
              level={level + 1}
              {...(onNavigate === undefined ? {} : {onNavigate})}
            />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function CollapsibleNavigationPane<const Id extends string>({
  ariaLabel,
  collapseLabel,
  currentId,
  defaultCollapsed = false,
  expandLabel,
  groups,
  placement = 'standalone',
  onNavigate,
}: CollapsibleNavigationPaneProps<Id>): ReactElement {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <nav
      aria-label={ariaLabel}
      data-collapsed={collapsed || undefined}
      data-placement={placement}
      data-wcl-collapsible-navigation-pane=""
    >
      <AriaButton
        aria-expanded={!collapsed}
        aria-label={collapsed ? expandLabel : collapseLabel}
        data-wcl-collapsible-navigation-pane-collapse=""
        onPress={() => setCollapsed((value) => !value)}
      >
        <CollapseIcon isCollapsed={collapsed} />
        <span>{collapsed ? expandLabel : collapseLabel}</span>
      </AriaButton>
      <div aria-hidden={collapsed || undefined} data-wcl-collapsible-navigation-pane-groups="">
        {groups.map((group) => (
          <section data-wcl-collapsible-navigation-pane-group="" key={group.id}>
            {group.label ? (
              <h2 data-wcl-collapsible-navigation-pane-group-label="">{group.label}</h2>
            ) : null}
            <NavigationItems
              currentId={currentId}
              items={group.items}
              level={1}
              {...(onNavigate === undefined ? {} : {onNavigate})}
            />
          </section>
        ))}
      </div>
    </nav>
  );
}
