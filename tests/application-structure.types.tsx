import {PageHeader, SplitView, type PageHeaderProps, type SplitViewProps} from '../src/index.js';

export const pageHeader = (
  <PageHeader
    actions={<button type="button">Run</button>}
    identity="RUN 0284"
    status="Converged"
    statusTone="success"
    title="North chamber"
  />
);

export const controlledSplit = (
  <SplitView
    ariaLabel="Controlled split"
    collapsePrimaryLabel="Collapse primary pane"
    collapseSecondaryLabel="Collapse inspector"
    restoreSecondaryLabel="Expand inspector"
    onPrimarySizeChange={() => undefined}
    onCollapsedPaneChange={() => undefined}
    primary="Configuration"
    primaryLabel="Configuration"
    primarySize={60}
    resizeLabel="Resize inspector"
    restorePrimaryLabel="Expand primary pane"
    secondary="Inspector"
    secondaryLabel="Inspector"
    collapsedPane={null}
  />
);

export const structuralTypes: [PageHeaderProps, SplitViewProps] | undefined = undefined;

export const mixedSplitSizeOwnership = (
  // @ts-expect-error Controlled and uncontrolled sizes cannot be mixed.
  <SplitView
    ariaLabel="Mixed split"
    collapsePrimaryLabel="Collapse primary pane"
    collapseSecondaryLabel="Collapse inspector"
    defaultPrimarySize={55}
    restoreSecondaryLabel="Expand inspector"
    onPrimarySizeChange={() => undefined}
    primary="Configuration"
    primaryLabel="Configuration"
    primarySize={60}
    resizeLabel="Resize inspector"
    restorePrimaryLabel="Expand primary pane"
    secondary="Inspector"
    secondaryLabel="Inspector"
  />
);

export const controlledCollapseWithoutCallback = (
  // @ts-expect-error Controlled collapse requires its change callback.
  <SplitView
    ariaLabel="Controlled collapse"
    collapsePrimaryLabel="Collapse primary pane"
    collapseSecondaryLabel="Collapse inspector"
    restoreSecondaryLabel="Expand inspector"
    collapsedPane={null}
    primary="Configuration"
    primaryLabel="Configuration"
    resizeLabel="Resize inspector"
    restorePrimaryLabel="Expand primary pane"
    secondary="Inspector"
    secondaryLabel="Inspector"
  />
);

export const injectedStructureStyle = (
  // @ts-expect-error Application structures own their styling.
  <PageHeader className="custom-header" title="Unsupported" />
);

export const emptyConditionalEndpoint = (
  <PageHeader
    // @ts-expect-error Route endpoints cannot use non-rendering conditional nodes.
    identity={null}
    status="Converged"
    statusTone="success"
    title="Unsupported endpoint"
  />
);

export const statusWithoutTone = (
  // @ts-expect-error Status content requires its semantic Route tone.
  <PageHeader status="Converged" title="Missing tone" />
);

export const toneWithoutStatus = (
  // @ts-expect-error A semantic Route tone requires status content.
  <PageHeader statusTone="success" title="Missing status" />
);

export const invalidStatusTone = (
  <PageHeader
    status="Custom status"
    // @ts-expect-error Route tones are limited to the prescribed semantic colors.
    statusTone="accent"
    title="Invalid tone"
  />
);
