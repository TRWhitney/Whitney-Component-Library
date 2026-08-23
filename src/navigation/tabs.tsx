'use client';

import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  TabPanels as AriaTabPanels,
  Tabs as AriaTabs,
} from 'react-aria-components/Tabs';
import type {Key} from 'react-aria-components';
import type {ReactElement} from 'react';

import type {TabsProps} from './navigation-types.js';

export function Tabs<const Id extends string>({
  activationMode = 'automatic',
  ariaLabel,
  defaultSelectedId,
  items,
  onSelectionChange,
  orientation = 'horizontal',
  selectedId,
}: TabsProps<Id>): ReactElement {
  const firstEnabledId = items.find((item) => !item.isDisabled)?.id;
  const uncontrolledSelectedId = defaultSelectedId ?? firstEnabledId;

  return (
    <AriaTabs
      data-wcl-tabs=""
      keyboardActivation={activationMode}
      orientation={orientation}
      {...(selectedId === undefined
        ? uncontrolledSelectedId === undefined
          ? {}
          : {defaultSelectedKey: uncontrolledSelectedId}
        : {selectedKey: selectedId})}
      {...(onSelectionChange === undefined
        ? {}
        : {onSelectionChange: (key: Key) => onSelectionChange(String(key) as Id)})}
    >
      <AriaTabList aria-label={ariaLabel} data-wcl-tab-list="" items={items}>
        {(item) => (
          <AriaTab
            data-wcl-tab=""
            id={item.id}
            {...(item.isDisabled === undefined ? {} : {isDisabled: item.isDisabled})}
          >
            <span aria-hidden="true" data-wcl-tab-marker="" />
            {item.label}
          </AriaTab>
        )}
      </AriaTabList>
      <AriaTabPanels data-wcl-tab-panels="" items={items}>
        {(item) => (
          <AriaTabPanel data-wcl-tab-panel="" id={item.id}>
            {item.panel}
          </AriaTabPanel>
        )}
      </AriaTabPanels>
    </AriaTabs>
  );
}
