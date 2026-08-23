'use client';

import {
  Button as AriaButton,
  Disclosure as AriaDisclosure,
  DisclosureGroup as AriaDisclosureGroup,
  DisclosurePanel as AriaDisclosurePanel,
} from 'react-aria-components';
import {createElement, type ReactElement} from 'react';

import type {AccordionProps, DisclosureHeadingLevel, DisclosureProps} from './navigation-types.js';

function DisclosureChevron(): ReactElement {
  return (
    <svg aria-hidden="true" data-wcl-disclosure-chevron="" viewBox="0 0 16 16">
      <path d="m3 6 5 5 5-5" />
    </svg>
  );
}

interface DisclosureContentProps {
  readonly children: React.ReactNode;
  readonly headingLevel: DisclosureHeadingLevel;
  readonly title: string;
}

function DisclosureContent({children, headingLevel, title}: DisclosureContentProps): ReactElement {
  return (
    <>
      {createElement(
        `h${headingLevel}`,
        {'data-wcl-disclosure-heading': ''},
        <AriaButton data-wcl-disclosure-trigger="" slot="trigger">
          <span>{title}</span>
          <DisclosureChevron />
        </AriaButton>,
      )}
      <AriaDisclosurePanel data-wcl-disclosure-panel="" role="region">
        {children}
      </AriaDisclosurePanel>
    </>
  );
}

export function Disclosure({
  children,
  defaultExpanded,
  headingLevel,
  isDisabled = false,
  isExpanded,
  onExpandedChange,
  title,
}: DisclosureProps): ReactElement {
  return (
    <AriaDisclosure
      data-wcl-disclosure=""
      isDisabled={isDisabled}
      {...(isExpanded === undefined
        ? defaultExpanded === undefined
          ? {}
          : {defaultExpanded}
        : {isExpanded})}
      {...(onExpandedChange === undefined ? {} : {onExpandedChange})}
    >
      <DisclosureContent headingLevel={headingLevel} title={title}>
        {children}
      </DisclosureContent>
    </AriaDisclosure>
  );
}

export function Accordion<const Id extends string>({
  ariaLabel,
  defaultExpandedIds,
  expandedIds,
  expansionMode = 'single',
  headingLevel = 3,
  isDisabled = false,
  items,
  onExpandedChange,
}: AccordionProps<Id>): ReactElement {
  const initialExpandedIds = expandedIds ?? defaultExpandedIds ?? [];
  if (expansionMode === 'single' && initialExpandedIds.length > 1) {
    throw new Error('Accordion single expansion accepts at most one expanded id.');
  }

  return (
    <AriaDisclosureGroup
      aria-label={ariaLabel}
      allowsMultipleExpanded={expansionMode === 'multiple'}
      data-wcl-accordion=""
      isDisabled={isDisabled}
      {...(expandedIds === undefined
        ? {defaultExpandedKeys: new Set(defaultExpandedIds)}
        : {expandedKeys: new Set(expandedIds)})}
      {...(onExpandedChange === undefined
        ? {}
        : {
            onExpandedChange: (keys: Set<React.Key>) =>
              onExpandedChange([...keys].map(String) as Id[]),
          })}
    >
      {items.map((item) => (
        <AriaDisclosure
          data-wcl-disclosure=""
          id={item.id}
          key={item.id}
          {...(item.isDisabled === undefined ? {} : {isDisabled: item.isDisabled})}
        >
          <DisclosureContent headingLevel={headingLevel} title={item.title}>
            {item.content}
          </DisclosureContent>
        </AriaDisclosure>
      ))}
    </AriaDisclosureGroup>
  );
}
