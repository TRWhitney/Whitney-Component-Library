import type {ReactElement, ReactNode} from 'react';

import type {StatusTone} from '../feedback/feedback-types.js';

export type PageHeaderHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type PageHeaderStatusTone = StatusTone;
type PageHeaderEndpoint = string | number | ReactElement;

type PageHeaderStatusProps =
  | {
      readonly status?: never;
      readonly statusTone?: never;
    }
  | {
      readonly status: PageHeaderEndpoint;
      readonly statusTone: StatusTone;
    };

export type PageHeaderProps = PageHeaderStatusProps & {
  readonly actions?: ReactNode;
  readonly breadcrumbs?: ReactNode;
  readonly description?: string;
  readonly headingLevel?: PageHeaderHeadingLevel;
  readonly identity?: PageHeaderEndpoint;
  readonly title: string;
};

export type SplitViewSizeProps =
  | {
      readonly defaultPrimarySize?: number;
      readonly onPrimarySizeChange?: (size: number) => void;
      readonly primarySize?: never;
    }
  | {
      readonly defaultPrimarySize?: never;
      readonly onPrimarySizeChange: (size: number) => void;
      readonly primarySize: number;
    };

export type SplitViewCollapsedPane = 'primary' | 'secondary' | null;

export type SplitViewCollapseProps =
  | {
      readonly collapsedPane?: never;
      readonly defaultCollapsedPane?: Exclude<SplitViewCollapsedPane, null>;
      readonly onCollapsedPaneChange?: (pane: SplitViewCollapsedPane) => void;
    }
  | {
      readonly collapsedPane: SplitViewCollapsedPane;
      readonly defaultCollapsedPane?: never;
      readonly onCollapsedPaneChange: (pane: SplitViewCollapsedPane) => void;
    };

export type SplitViewProps = SplitViewSizeProps &
  SplitViewCollapseProps & {
    readonly ariaLabel: string;
    readonly collapsePrimaryLabel: string;
    readonly collapseSecondaryLabel: string;
    readonly maxPrimarySize?: number;
    readonly minPrimarySize?: number;
    readonly primary: ReactNode;
    readonly primaryLabel: string;
    readonly resizeLabel: string;
    readonly restorePrimaryLabel: string;
    readonly restoreSecondaryLabel: string;
    readonly secondary: ReactNode;
    readonly secondaryLabel: string;
  };
