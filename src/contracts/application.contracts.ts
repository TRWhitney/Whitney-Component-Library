import type {ComponentContract} from './component-contract.js';

const applicationGuidance = {
  accentBehavior: [
    'The application accent marks Route structure, the split resize rail, and focus without recoloring semantic status content.',
  ],
  directionality: [
    'Logical region placement, Route gradients, pane diagrams, pointer sizing, and keyboard resizing follow inherited writing direction.',
  ],
  forcedColorBehavior: [
    'Forced colors preserve region boundaries, the Route track, resize state, collapse controls, and focus with system colors.',
  ],
  formBehavior: [
    'Application structure does not submit values. Forms and controls inside each named region retain their own behavior.',
  ],
  localization: [
    'Localize visible content and every region, resize, collapse, and restore label. Titles, identifiers, descriptions, and actions may wrap without changing DOM order.',
  ],
  reducedMotionBehavior: [
    'Reduced motion removes pane and rail transitions without changing resize, collapse, focus, or responsive behavior.',
  ],
  stylesheet: './styles.css',
} satisfies Pick<
  ComponentContract,
  | 'accentBehavior'
  | 'directionality'
  | 'forcedColorBehavior'
  | 'formBehavior'
  | 'localization'
  | 'reducedMotionBehavior'
  | 'stylesheet'
>;

function inProvider(name: string, body: string): string {
  return [
    `export function ${name}() {`,
    '  return (',
    '    <AppearanceProvider appearance="dark" accent="#2878ff">',
    ...body.split('\n').map((line) => `      ${line}`),
    '    </AppearanceProvider>',
    '  );',
    '}',
  ].join('\n');
}

export const pageHeaderContract = {
  ...applicationGuidance,
  accessibility: [
    'PageHeader labels itself with its real heading and keeps breadcrumb navigation, status semantics, and action controls in their own descendants.',
    'The Route track is hidden from assistive technology because identity and status already provide its meaning.',
  ],
  appearance: [
    'PageHeader uses utility typography for an optional page identifier, reading typography for the page title, and a flexible Route track only between present identifier and status endpoints. Its open origin uses the accent and its solid endpoint uses statusTone, independent of the rendered status content.',
  ],
  appropriateUses: [
    'a page or workspace needs one title plus optional ancestry, page identifier, status content, description, or page-level actions',
  ],
  composition: [
    'Render PageHeader inside AppearanceProvider at the start of the application-owned page region.',
    'Pass Breadcrumbs through breadcrumbs, optional status content through status, and a compact ButtonGroup or Toolbar through actions. StatusIndicator is available when the status has a semantic tone, but PageHeader does not require a pill.',
    'Use identity for a run, document, or workspace identifier that changes how the adjacent status should be read.',
  ],
  contentRules: [
    'Use one concise page title, one optional sentence of description, an optional compact identifier, optional consumer-named status content, and only page-level actions.',
    'Do not repeat status text in the title, description, Route track, or actions.',
  ],
  controlBehavior: [
    'PageHeader owns no routing or action state. It renders Route only when both identity and status contain renderable endpoints.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'SectionAsPageHeader',
        '<PageHeader title="Boundary conditions" description="A local group inside the current page." />',
      ),
      description:
        'A local headed group belongs in Section rather than creating another page identity.',
      title: 'Do not replace a section heading',
    },
  ],
  events: [
    'PageHeader emits no events. Breadcrumbs, status content, and action controls retain their own events.',
  ],
  examples: [
    {
      code: inProvider(
        'RunPageHeader',
        '<PageHeader\n  actions={<Button>Run profile</Button>}\n  breadcrumbs={<Breadcrumbs ariaLabel="Run location" items={[{id: "runs", label: "Runs", href: "/runs"}, {id: "current", label: "RUN 0284", href: "/runs/0284"}]} />}\n  description="Evaluate the 18-minute ramp profile."\n  identity="SIM / THERMAL / 0284"\n  status={<span><small>Run state</small><strong>Converged</strong></span>}\n  statusTone="success"\n  title="North chamber"\n/>',
      ),
      description: 'Connect run identity to semantic status while keeping page actions separate.',
      title: 'Run workspace header',
    },
  ],
  exportName: 'PageHeader',
  importPath: '.',
  inappropriateUses: [
    'local section headings, card headings, dialog titles, repeated collection rows, or a second status label',
  ],
  keyboardBehavior: [
    'PageHeader adds no focus target. Breadcrumb links and actions remain in DOM order and own their keyboard behavior.',
  ],
  kind: 'composition',
  labeling: [
    'title labels the header through the selected headingLevel. Consumer components provide names for breadcrumbs, status, and actions.',
  ],
  name: 'PageHeader',
  parts: [
    'PageHeader exposes optional breadcrumb and context rows, one identity-to-status Route, one heading and description group, and one action group.',
  ],
  preferredAlternatives: [
    'Use Section for local headed content, Surface for an unheaded panel, or a workflow construct for staged identity and progress.',
  ],
  preferredCompositions: [
    'Compose PageHeader in an application-owned page region with Breadcrumbs, optional status content, ButtonGroup, or Toolbar.',
  ],
  purpose:
    'PageHeader coordinates page identity, semantic status, ancestry, description, and actions without owning routing.',
  relatedExports: [
    'AppearanceProvider',
    'Breadcrumbs',
    'Button',
    'ButtonGroup',
    'Section',
    'StatusIndicator',
    'Toolbar',
  ],
  responsiveBehavior: [
    'Route remains a flexible track between distinct endpoints. Compact containers stack heading actions below the title without reordering focus or inserting a divider.',
  ],
  states: [
    'Breadcrumbs, identity, status, description, and actions are optional. Route appears only for the complete identity and status pair.',
  ],
  summary:
    'Coordinate page identity, status, ancestry, description, and actions with a meaningful Route.',
  validation: [
    'TypeScript limits headingLevel to semantic headings, requires identity and status endpoints to be renderable strings, numbers, or elements, requires statusTone with status content, and excludes consumer styling and arbitrary region slots.',
  ],
} satisfies ComponentContract;

export const splitViewContract = {
  ...applicationGuidance,
  accessibility: [
    'SplitView names its group and both pane regions. The focusable separator exposes orientation, current percentage, minimum, and maximum values.',
    'Collapsing a pane hides its focusable descendants while preserving their local state. If focus was inside that pane, SplitView restores it to the persistent expansion control.',
  ],
  appearance: [
    'SplitView uses two quiet content planes separated by one complete resize rail. Two compact split-panel controls identify which pane they collapse without relying on directional chevrons. Their hover and pressed states match quiet secondary buttons.',
  ],
  appropriateUses: [
    'two related workspace panes need bounded user resizing, collapse in either direction, and a stacked compact fallback',
  ],
  composition: [
    'Render SplitView inside AppearanceProvider and an application-owned bounded region with meaningful available width.',
    'Pass one complete primary region and one secondary region with accessible pane and resize labels plus explicit collapse and restore labels for each pane.',
    'Use controlled state when pane size or collapse must persist outside the component; otherwise use the matching defaults.',
  ],
  contentRules: [
    'Keep the primary task in primary and supporting comparison, inspection, preview, or context in secondary.',
    'Do not place required completion actions only in a pane that may collapse.',
  ],
  controlBehavior: [
    'Primary size is a bounded percentage with a default range of 25 through 75 and a default value of 60. Minimum and maximum values may narrow that range within 10 through 90.',
    'Either pane may collapse, but never both at once. Collapsed-pane state and primary size each support controlled or uncontrolled ownership. Pointer drag and keyboard resizing report the same clamped integer percentage.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'UnrelatedSplitColumns',
        '<SplitView ariaLabel="Summary" collapsePrimaryLabel="Hide settings" collapseSecondaryLabel="Hide news" primary="Account settings" primaryLabel="Settings" resizeLabel="Resize" restorePrimaryLabel="Show settings" restoreSecondaryLabel="Show news" secondary="Release notes" secondaryLabel="News" />',
      ),
      description:
        'Unrelated content belongs in separate sections or routes. Resizing should express a real primary and supporting relationship.',
      title: 'Do not join unrelated regions',
    },
  ],
  events: [
    'onPrimarySizeChange reports each clamped keyboard or pointer size. onCollapsedPaneChange reports primary, secondary, or null for collapse and restore requests.',
  ],
  examples: [
    {
      code: inProvider(
        'RunInspectorSplit',
        '<SplitView\n  ariaLabel="Run workspace"\n  collapsePrimaryLabel="Hide run configuration"\n  collapseSecondaryLabel="Hide run inspector"\n  defaultPrimarySize={60}\n  primary={<Section title="Run configuration">Configuration fields</Section>}\n  primaryLabel="Run configuration"\n  resizeLabel="Resize run inspector"\n  restorePrimaryLabel="Show run configuration"\n  restoreSecondaryLabel="Show run inspector"\n  secondary={<Section title="Inspector">Selected run details</Section>}\n  secondaryLabel="Run inspector"\n/>',
      ),
      description: 'Resize configuration and inspection while preserving their distinct regions.',
      title: 'Resizable workspace inspector',
    },
  ],
  exportName: 'SplitView',
  importPath: '.',
  inappropriateUses: [
    'unrelated responsive columns, a fixed sidebar, application navigation, arbitrary dashboard layout, or content with no primary and supporting relationship',
  ],
  keyboardBehavior: [
    'In left-to-right layout, Left and Right decrease and increase primary size; right-to-left layout reverses those keys. Home and End use the minimum and maximum. Each pane-target control toggles with Enter or Space.',
    'The stacked compact fallback disables the resize separator while keeping both pane-target controls reachable.',
  ],
  kind: 'component',
  labeling: [
    'ariaLabel names the split relationship. primaryLabel, secondaryLabel, resizeLabel, collapsePrimaryLabel, collapseSecondaryLabel, restorePrimaryLabel, and restoreSecondaryLabel name every region and control.',
  ],
  name: 'SplitView',
  parts: [
    'SplitView owns two named panes, one resize rail and separator, and distinct pane-target collapse or restore controls.',
  ],
  preferredAlternatives: [
    'Use ResponsiveGrid for equivalent automatic columns, an application-owned layout for page regions, Surface for a panel, or Drawer for temporary overlay detail.',
  ],
  preferredCompositions: [
    'Compose SplitView below PageHeader when a page needs two resizable related regions.',
  ],
  purpose:
    'SplitView coordinates two named workspace panes with bounded resizing, collapse of either pane, and compact stacking.',
  relatedExports: [
    'AppearanceProvider',
    'Drawer',
    'PageHeader',
    'ResponsiveGrid',
    'Section',
    'Surface',
  ],
  responsiveBehavior: [
    'Wide containers place panes beside one vertical separator. Containers at or below 40 rem stack panes in DOM order, disable resizing, preserve the collapse control, and add no decorative divider.',
  ],
  states: [
    'Primary size and collapsed pane may each be controlled or uncontrolled. Collapse preserves descendants of either pane. Compact stacking is container-owned and does not change either application state.',
  ],
  summary: 'Resize two named workspace panes within bounds and collapse either pane responsively.',
  validation: [
    'TypeScript prevents mixed controlled and uncontrolled ownership. Runtime validation rejects non-finite sizes, bounds outside 10 through 90, reversed bounds, and sizes outside the active bounds.',
  ],
} satisfies ComponentContract;
