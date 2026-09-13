import {
  Accordion,
  Breadcrumbs,
  CollapsibleNavigationPane,
  Disclosure,
  Pagination,
  Tabs,
  type AccordionItems,
  type BreadcrumbItems,
  type CollapsibleNavigationPaneGroups,
  type TabItems,
} from '../src/index.js';

const tabs = [
  {id: 'summary', label: 'Summary', panel: <p>Summary</p>},
  {id: 'inputs', label: 'Inputs', panel: <p>Inputs</p>},
] as const satisfies TabItems<'summary' | 'inputs'>;

const breadcrumbs = [
  {href: '/runs', id: 'runs', label: 'Runs'},
  {href: '/runs/284', id: 'run', label: 'RUN 0284'},
] as const satisfies BreadcrumbItems;

const accordion = [
  {content: <p>Geometry</p>, id: 'geometry', title: 'Geometry'},
  {content: <p>Solver</p>, id: 'solver', title: 'Solver'},
] as const satisfies AccordionItems<'geometry' | 'solver'>;

const groups = [
  {
    id: 'primary',
    items: [{href: '/runs', id: 'runs', label: 'Runs'}],
    label: 'Workspace',
  },
] as const satisfies CollapsibleNavigationPaneGroups;

export const navigationAndDisclosure = (
  <>
    <Tabs ariaLabel="Details" defaultSelectedId="summary" items={tabs} />
    <Tabs
      ariaLabel="Details"
      items={tabs}
      onSelectionChange={() => undefined}
      selectedId="inputs"
    />
    <Breadcrumbs ariaLabel="Location" items={breadcrumbs} maxVisible={3} />
    <Pagination
      ariaLabel="Results"
      currentPage={2}
      getPageHref={(page) => `/results?page=${page}`}
      getPageLabel={(_page, formattedPage) => `Page ${formattedPage}`}
      locale="en-US"
      nextLabel="Next"
      pageCount={4}
      previousLabel="Previous"
    />
    <Disclosure defaultExpanded headingLevel={2} title="Details">
      Content
    </Disclosure>
    <Accordion
      ariaLabel="Configuration"
      defaultExpandedIds={['geometry']}
      expansionMode="multiple"
      items={accordion}
    />
    <CollapsibleNavigationPane
      ariaLabel="Workspace"
      collapseLabel="Collapse"
      currentId="runs"
      expandLabel="Expand"
      groups={groups}
    />
  </>
);

export const controlledTabsWithoutCallback = (
  // @ts-expect-error Controlled Tabs require onSelectionChange.
  <Tabs ariaLabel="Details" items={tabs} selectedId="summary" />
);

export const breadcrumbsKeepRootOverflowAndCurrentReachable = (
  // @ts-expect-error Collapsed breadcrumbs require room for root, overflow, and current entries.
  <Breadcrumbs ariaLabel="Location" items={breadcrumbs} maxVisible={2} />
);

export const controlledDisclosureWithoutCallback = (
  // @ts-expect-error Controlled Disclosure requires onExpandedChange.
  <Disclosure headingLevel={2} isExpanded title="Details">
    Content
  </Disclosure>
);

export const controlledAccordionWithoutCallback = (
  // @ts-expect-error Controlled Accordion requires onExpandedChange.
  <Accordion
    ariaLabel="Configuration"
    expandedIds={['geometry']}
    expansionMode="single"
    items={accordion}
  />
);

export const controlledCollapsibleNavigationPaneWithoutCallback = (
  <CollapsibleNavigationPane
    ariaLabel="Workspace"
    collapseLabel="Collapse"
    currentId="runs"
    expandLabel="Expand"
    groups={groups}
    // @ts-expect-error Collapse is internal to the navigator.
    isCollapsed
  />
);

export const tabsDoNotNavigate = (
  <Tabs
    ariaLabel="Details"
    items={[
      {
        // @ts-expect-error Tabs select panels and do not accept navigation destinations.
        href: '/summary',
        id: 'summary',
        label: 'Summary',
        panel: <p>Summary</p>,
      },
    ]}
  />
);
