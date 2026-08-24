import type {ReactNode} from 'react';

export type NavigationOrientation = 'horizontal' | 'vertical';
export type TabActivationMode = 'automatic' | 'manual';
export type DisclosureHeadingLevel = 2 | 3 | 4 | 5 | 6;
export type AccordionExpansionMode = 'single' | 'multiple';
export type BreadcrumbVisibleCount = 3 | 4 | 5;

export interface TabItem<Id extends string = string> {
  readonly id: Id;
  readonly isDisabled?: boolean;
  readonly label: string;
  readonly panel: ReactNode;
}

export type TabItems<Id extends string = string> = readonly [TabItem<Id>, ...TabItem<Id>[]];

export type TabSelectionProps<Id extends string = string> =
  | {
      readonly defaultSelectedId?: NoInfer<Id>;
      readonly onSelectionChange?: (id: Id) => void;
      readonly selectedId?: never;
    }
  | {
      readonly defaultSelectedId?: never;
      readonly onSelectionChange: (id: Id) => void;
      readonly selectedId: NoInfer<Id>;
    };

export type TabsProps<Id extends string = string> = TabSelectionProps<Id> & {
  readonly activationMode?: TabActivationMode;
  readonly ariaLabel: string;
  readonly items: TabItems<Id>;
  readonly orientation?: NavigationOrientation;
};

export interface BreadcrumbItem {
  readonly href: string;
  readonly id: string;
  readonly label: string;
  readonly newWindow?: boolean;
}

export type BreadcrumbItems = readonly [BreadcrumbItem, ...BreadcrumbItem[]];

export interface BreadcrumbsProps {
  readonly ariaLabel: string;
  readonly items: BreadcrumbItems;
  readonly maxVisible?: BreadcrumbVisibleCount;
  readonly moreLabel?: string;
}

export interface PaginationProps {
  readonly ariaLabel: string;
  readonly currentPage: number;
  readonly getPageHref?: (page: number) => string;
  readonly getPageLabel: (page: number, formattedPage: string) => string;
  readonly locale: string;
  readonly nextLabel: string;
  readonly onPageChange?: (page: number) => void;
  readonly pageCount: number;
  readonly previousLabel: string;
}

export type DisclosureExpansionProps =
  | {
      readonly defaultExpanded?: boolean;
      readonly isExpanded?: never;
      readonly onExpandedChange?: (isExpanded: boolean) => void;
    }
  | {
      readonly defaultExpanded?: never;
      readonly isExpanded: boolean;
      readonly onExpandedChange: (isExpanded: boolean) => void;
    };

export type DisclosureProps = DisclosureExpansionProps & {
  readonly children: ReactNode;
  readonly headingLevel: DisclosureHeadingLevel;
  readonly isDisabled?: boolean;
  readonly title: string;
};

export interface AccordionItem<Id extends string = string> {
  readonly content: ReactNode;
  readonly id: Id;
  readonly isDisabled?: boolean;
  readonly title: string;
}

export type AccordionItems<Id extends string = string> = readonly [
  AccordionItem<Id>,
  ...AccordionItem<Id>[],
];

export type AccordionExpansionProps<Id extends string = string> =
  | {
      readonly defaultExpandedIds?: readonly NoInfer<Id>[];
      readonly expandedIds?: never;
      readonly onExpandedChange?: (ids: Id[]) => void;
    }
  | {
      readonly defaultExpandedIds?: never;
      readonly expandedIds: readonly NoInfer<Id>[];
      readonly onExpandedChange: (ids: Id[]) => void;
    };

export type AccordionProps<Id extends string = string> = AccordionExpansionProps<Id> & {
  readonly ariaLabel: string;
  readonly expansionMode?: AccordionExpansionMode;
  readonly headingLevel?: DisclosureHeadingLevel;
  readonly isDisabled?: boolean;
  readonly items: AccordionItems<Id>;
};

export interface CollapsibleNavigationPaneItem<Id extends string = string> {
  readonly children?: readonly CollapsibleNavigationPaneItem<Id>[];
  readonly href: string;
  readonly id: Id;
  readonly isDisabled?: boolean;
  readonly label: string;
  readonly newWindow?: boolean;
}

export interface CollapsibleNavigationPaneGroup<Id extends string = string> {
  readonly id: string;
  readonly items: readonly [
    CollapsibleNavigationPaneItem<Id>,
    ...CollapsibleNavigationPaneItem<Id>[],
  ];
  readonly label?: string;
}

export type CollapsibleNavigationPaneGroups<Id extends string = string> = readonly [
  CollapsibleNavigationPaneGroup<Id>,
  ...CollapsibleNavigationPaneGroup<Id>[],
];

export type CollapsibleNavigationPaneCollapseProps =
  | {
      readonly defaultCollapsed?: boolean;
      readonly isCollapsed?: never;
      readonly onCollapsedChange?: (isCollapsed: boolean) => void;
    }
  | {
      readonly defaultCollapsed?: never;
      readonly isCollapsed: boolean;
      readonly onCollapsedChange: (isCollapsed: boolean) => void;
    };

export type CollapsibleNavigationPaneProps<Id extends string = string> =
  CollapsibleNavigationPaneCollapseProps & {
    readonly ariaLabel: string;
    readonly collapseLabel: string;
    readonly currentId: NoInfer<Id>;
    readonly expandLabel: string;
    readonly groups: CollapsibleNavigationPaneGroups<Id>;
    readonly onNavigate?: (id: Id) => void;
  };
