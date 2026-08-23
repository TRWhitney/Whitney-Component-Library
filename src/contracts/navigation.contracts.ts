import type {ComponentContract} from './component-contract.js';

const commonNavigationGuidance = {
  accentBehavior: [
    'The application accent marks focus and active route structure. Current location, selected content, and expanded content retain separate accessibility semantics.',
  ],
  accessibility: [
    'Visible labels, structural relationships, current state, and controlled state remain available to assistive technology without relying on color or motion.',
  ],
  directionality: [
    'Logical order, arrow-key movement where applicable, separators, indentation, and route markers follow inherited writing direction.',
  ],
  forcedColorBehavior: [
    'Forced colors preserve focus, current or selected structure, boundaries, links, and disabled state with system colors.',
  ],
  formBehavior: [
    'This component does not submit a form value. Keep navigation and disclosure state separate from form data.',
  ],
  localization: [
    'Localize visible labels and accessible navigation labels. Allow destination and heading text to wrap or truncate without removing access to the full destination.',
  ],
  reducedMotionBehavior: [
    'Reduced motion settles route markers and expansion indicators immediately without changing state or keyboard behavior.',
  ],
  stylesheet: './styles.css',
  validation: [
    'TypeScript constrains controlled and uncontrolled state, finite modes, and library-owned item models. Consumers keep identifiers unique and destination URLs valid.',
  ],
} satisfies Pick<
  ComponentContract,
  | 'accentBehavior'
  | 'accessibility'
  | 'directionality'
  | 'forcedColorBehavior'
  | 'formBehavior'
  | 'localization'
  | 'reducedMotionBehavior'
  | 'stylesheet'
  | 'validation'
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

export const tabsContract = {
  ...commonNavigationGuidance,
  appearance: [
    'Tabs use a quiet shared baseline and one moving accent rail. The selected panel remains a separate bounded surface.',
  ],
  appropriateUses: ['switching among peer panels within the same task or page context'],
  composition: [
    'Render inside AppearanceProvider so the route, focus, surface, and text roles use the active theme and accent.',
    'Pass a non-empty library-owned item list containing stable ids, short labels, and matching panel content.',
    'Use controlled selectedId when application state or a URL parameter determines the active panel; keep route navigation in links or SideNavigation.',
  ],
  contentRules: [
    'Use short parallel labels and keep each panel focused on one peer section. Do not place href destinations in tab items.',
  ],
  controlBehavior: [
    'Tabs support controlled selectedId with onSelectionChange or uncontrolled defaultSelectedId, horizontal or vertical orientation, and automatic or manual activation.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'RunRouteTabsCounterexample',
        '<Tabs\n  ariaLabel="Workspace destinations"\n  items={[{id: "runs", label: "Runs", panel: <p>Route content</p>}]}\n/>',
      ),
      description:
        'Destinations with their own URLs belong in SideNavigation or ordinary links, not panel-selection tabs.',
      title: 'Do not use tabs as route links',
    },
  ],
  events: ['onSelectionChange reports the selected item id after pointer or keyboard activation.'],
  examples: [
    {
      code: inProvider(
        'RunDetailTabs',
        '<Tabs\n  ariaLabel="Run details"\n  defaultSelectedId="summary"\n  items={[\n    {id: "summary", label: "Summary", panel: <p>Convergence summary</p>},\n    {id: "inputs", label: "Inputs", panel: <p>Solver inputs</p>},\n  ]}\n/>',
      ),
      description: 'Switch between peer run-detail panels without changing location.',
      title: 'Peer content panels',
    },
  ],
  exportName: 'Tabs',
  importPath: '.',
  inappropriateUses: [
    'navigation among URL destinations, choosing a submitted value, progressive steps, or hiding optional supporting detail',
  ],
  keyboardBehavior: [
    'Arrow keys move among enabled tabs according to orientation and direction. Automatic activation selects on focus; manual activation waits for Enter or Space.',
  ],
  kind: 'component',
  labeling: ['ariaLabel names the tab list and each visible item label names its panel.'],
  name: 'Tabs',
  parts: ['Tabs owns one tab list, its tab controls, and their matching tab panels.'],
  preferredAlternatives: [
    'Use SideNavigation or Link for destinations, SegmentedControl for a submitted choice, and Disclosure for optional detail.',
  ],
  preferredCompositions: [
    'Compose Tabs inside a Section or application workspace where its panels remain part of one task.',
  ],
  purpose: 'Tabs selects one peer content panel without changing application location.',
  relatedExports: [
    'AppearanceProvider',
    'Disclosure',
    'Link',
    'SegmentedControl',
    'SideNavigation',
  ],
  responsiveBehavior: [
    'Horizontal tabs remain reachable through a compact scroll track. Vertical tabs return to a horizontal track when the viewport is narrow.',
  ],
  states: ['Selection may be controlled or uncontrolled; items may be disabled individually.'],
  summary: 'Select one peer content panel with explicit activation and panel relationships.',
} satisfies ComponentContract;

export const breadcrumbsContract = {
  ...commonNavigationGuidance,
  appearance: [
    'Breadcrumbs form a compact route with directional separators, muted ancestors, and a stronger current location.',
    'Ancestor links and the overflow control use the same filled hover treatment without link underlines.',
  ],
  appropriateUses: ['showing the hierarchical path from a broad location to the current page'],
  composition: [
    'Render inside AppearanceProvider so the route, focus, and text roles use the active theme and accent.',
    'Pass an ordered non-empty list of stable ids, labels, and href values. The last item is the current page.',
    'Use maxVisible to collapse middle ancestors behind a labeled ellipsis control in an anchored overlay while retaining the root and current location.',
  ],
  contentRules: [
    'Use destination names, not explanatory sentences, and keep the hierarchy shallow.',
  ],
  controlBehavior: [
    'Breadcrumbs marks the final item as the current page and opens every collapsed middle destination in the anchored overflow overlay named by moreLabel.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'RunHistoryBreadcrumbCounterexample',
        '<Breadcrumbs ariaLabel="Recent pages" items={[{id: "one", label: "Run 1", href: "/1"}, {id: "two", label: "Run 2", href: "/2"}]} />',
      ),
      description:
        'A chronological or peer list is not a hierarchy. Use ordinary links or a collection.',
      title: 'Do not represent history as hierarchy',
    },
  ],
  events: ['Navigation remains native link activation; consumers integrate routing through href.'],
  examples: [
    {
      code: inProvider(
        'RunBreadcrumbs',
        '<Breadcrumbs\n  ariaLabel="Run location"\n  items={[\n    {id: "workspaces", label: "Workspaces", href: "/workspaces"},\n    {id: "runs", label: "Runs", href: "/workspaces/runs"},\n    {id: "run", label: "RUN 0284", href: "/workspaces/runs/284"},\n  ]}\n/>',
      ),
      description: 'Expose the current run within its application hierarchy.',
      title: 'Current location path',
    },
  ],
  exportName: 'Breadcrumbs',
  importPath: '.',
  inappropriateUses: ['peer navigation, history, workflow steps, or pagination'],
  keyboardBehavior: [
    'Tab reaches every visible link and the overflow control; Enter activates them.',
  ],
  kind: 'component',
  labeling: [
    'ariaLabel names the navigation landmark and moreLabel names the collapsed ancestors.',
  ],
  name: 'Breadcrumbs',
  parts: [
    'Breadcrumbs owns the navigation landmark, ordered path, separators, and optional anchored overflow overlay.',
  ],
  preferredAlternatives: [
    'Use Tabs for peer panels, SideNavigation for persistent destinations, and Pagination for numbered result pages.',
  ],
  preferredCompositions: [
    'Place Breadcrumbs near the page or workspace heading whose location it names.',
  ],
  purpose: 'Breadcrumbs exposes the current page within a navigable hierarchy.',
  relatedExports: ['AppearanceProvider', 'Link', 'Pagination', 'SideNavigation', 'Tabs'],
  responsiveBehavior: [
    'Long labels truncate visually and middle destinations may collapse into the ellipsis overlay, which keeps every destination reachable without displacing page content.',
  ],
  states: ['The last item is always current; the middle-ancestor overlay is closed or open.'],
  summary: 'Expose a hierarchical path and keep collapsed ancestors reachable.',
} satisfies ComponentContract;

export const paginationContract = {
  ...commonNavigationGuidance,
  appearance: [
    'Pagination uses compact utility-number controls with an accent underline for the current page.',
  ],
  appropriateUses: ['moving among numbered pages in one bounded result collection'],
  composition: [
    'Render inside AppearanceProvider so the current marker, focus, and text roles use the active theme and accent.',
    'Provide a positive pageCount, a currentPage within that range, a locale for number formatting, and localized previous, next, and page labels.',
    'Provide getPageHref for native URL navigation or onPageChange for consumer-controlled in-place paging; both may be used together.',
  ],
  contentRules: [
    'Keep the landmark label tied to the paged collection and do not rename page numbers.',
  ],
  controlBehavior: [
    'Pagination keeps the first, last, current, and neighboring pages reachable, uses inert ellipses for gaps, and disables unavailable previous or next movement.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'WorkflowPaginationCounterexample',
        '<Pagination ariaLabel="Setup steps" currentPage={2} getPageLabel={(_page, number) => `Step ${number}`} locale="en-US" pageCount={4} previousLabel="Back" nextLabel="Next" />',
      ),
      description: 'A workflow needs named stages and validation, not numbered collection pages.',
      title: 'Do not model workflow steps as pages',
    },
  ],
  events: ['onPageChange reports a requested page; getPageHref supplies the corresponding URL.'],
  examples: [
    {
      code: inProvider(
        'RunPagination',
        '<Pagination\n  ariaLabel="Run result pages"\n  currentPage={8}\n  getPageHref={(page) => `/runs?page=${page}`}\n  getPageLabel={(_page, number) => `Page ${number}`}\n  locale="en-US"\n  nextLabel="Next page"\n  pageCount={20}\n  previousLabel="Previous page"\n/>',
      ),
      description: 'Navigate a result collection while preserving shareable URLs.',
      title: 'URL-backed result pages',
    },
  ],
  exportName: 'Pagination',
  importPath: '.',
  inappropriateUses: [
    'workflow progress, unbounded loading, carousel position, or peer content panels',
  ],
  keyboardBehavior: ['Tab reaches each rendered page link or button; Enter activates it.'],
  kind: 'component',
  labeling: [
    'ariaLabel names the paged collection; previousLabel and nextLabel name direction controls; getPageLabel names each localized page control.',
  ],
  name: 'Pagination',
  parts: [
    'Pagination owns the navigation landmark, direction controls, page controls, current marker, and gap indicators.',
  ],
  preferredAlternatives: [
    'Use Tabs for peer panels, ProgressBar for task completion, or a collection loading control for unbounded results.',
  ],
  preferredCompositions: [
    'Place Pagination adjacent to the result collection whose page it changes.',
  ],
  purpose: 'Pagination moves through a finite numbered collection while exposing current location.',
  relatedExports: ['AppearanceProvider', 'Breadcrumbs', 'ProgressBar', 'Tabs'],
  responsiveBehavior: [
    'The complete rendered page set stays reachable through horizontal overflow at compact widths.',
  ],
  states: [
    'Current page is explicit and controlled by the consumer; boundary direction controls are disabled.',
  ],
  summary: 'Navigate a finite numbered collection through URLs or controlled page requests.',
} satisfies ComponentContract;

export const disclosureContract = {
  ...commonNavigationGuidance,
  appearance: [
    'Disclosure uses one quiet boundary and a rotating chevron without creating a card.',
  ],
  appropriateUses: ['showing or hiding one optional supporting section in place'],
  composition: [
    'Render inside AppearanceProvider so the boundary, focus, and text roles use the active theme and accent.',
    'Pass a concise title, headingLevel, and panel content. Use controlled isExpanded when another state owner coordinates visibility.',
  ],
  contentRules: [
    'Make the title describe the hidden content and keep essential instructions visible outside the disclosure.',
  ],
  controlBehavior: [
    'Disclosure supports controlled isExpanded or uncontrolled defaultExpanded and an explicit disabled state.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'PrimaryActionDisclosureCounterexample',
        '<Disclosure headingLevel={2} title="Run solver"><Button>Start run</Button></Disclosure>',
      ),
      description:
        'A primary action should remain visible instead of being hidden as optional detail.',
      title: 'Do not hide required work',
    },
  ],
  events: ['onExpandedChange reports every requested expansion transition.'],
  examples: [
    {
      code: inProvider(
        'AdvancedSettingsDisclosure',
        '<Disclosure headingLevel={3} title="Advanced solver settings"><p>Iteration and tolerance controls</p></Disclosure>',
      ),
      description: 'Keep optional advanced settings near the controls they qualify.',
      title: 'Optional supporting detail',
    },
  ],
  exportName: 'Disclosure',
  importPath: '.',
  inappropriateUses: [
    'multiple coordinated sections, peer panel selection, navigation, or required primary content',
  ],
  keyboardBehavior: ['Tab reaches the heading button; Enter or Space toggles its panel.'],
  kind: 'component',
  labeling: [
    'The visible title names the trigger, labels its region, and renders at the supplied heading level.',
  ],
  name: 'Disclosure',
  parts: ['Disclosure owns one semantic heading, expansion button, chevron, and labeled panel.'],
  preferredAlternatives: [
    'Use Accordion for related sections, Tabs for peer panels, or Section for always-visible content.',
  ],
  preferredCompositions: [
    'Compose Disclosure beside the content or controls its optional detail explains.',
  ],
  purpose: 'Disclosure toggles one optional supporting section under a semantic heading.',
  relatedExports: ['Accordion', 'AppearanceProvider', 'Button', 'Section', 'Tabs'],
  responsiveBehavior: ['The full-width trigger and panel copy wrap without horizontal overflow.'],
  states: ['Expanded state may be controlled or uncontrolled; disabled remains visible and inert.'],
  summary: 'Toggle one optional labeled section with controlled or uncontrolled expansion.',
} satisfies ComponentContract;

export const accordionContract = {
  ...commonNavigationGuidance,
  appearance: [
    'Accordion joins related disclosures through shared quiet boundaries and aligned expansion controls.',
  ],
  appropriateUses: ['organizing several related optional sections under one labeled group'],
  composition: [
    'Render inside AppearanceProvider so the connected boundaries, focus, and text roles use the active theme and accent.',
    'Pass a non-empty item list with stable ids, titles, content, and optional disabled state.',
    'Choose single expansion when open sections compete for attention or multiple when comparison matters.',
  ],
  contentRules: [
    'Use parallel section titles and keep essential task order outside the accordion.',
  ],
  controlBehavior: [
    'Accordion supports single or multiple expansion and controlled expandedIds or uncontrolled defaultExpandedIds.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'PeerPanelsAccordionCounterexample',
        '<Accordion ariaLabel="Run views" items={[{id: "summary", title: "Summary", content: <p>Summary</p>}]} />',
      ),
      description: 'Peer views that replace one another belong in Tabs.',
      title: 'Do not replace tabs with accordion sections',
    },
  ],
  events: ['onExpandedChange reports the complete ordered set of expanded item ids.'],
  examples: [
    {
      code: inProvider(
        'RunConfigurationAccordion',
        '<Accordion\n  ariaLabel="Run configuration"\n  defaultExpandedIds={["geometry"]}\n  expansionMode="single"\n  items={[\n    {id: "geometry", title: "Geometry", content: <p>Mesh settings</p>},\n    {id: "solver", title: "Solver", content: <p>Precision settings</p>},\n  ]}\n/>',
      ),
      description: 'Group related configuration sections with one open at a time.',
      title: 'Related configuration sections',
    },
  ],
  exportName: 'Accordion',
  importPath: '.',
  inappropriateUses: [
    'peer panel selection, page navigation, mandatory sequential steps, or one isolated optional section',
  ],
  keyboardBehavior: [
    'Tab reaches each enabled heading button; Enter or Space toggles it without changing other focus order.',
  ],
  kind: 'component',
  labeling: ['ariaLabel names the group and every item title labels its own heading and panel.'],
  name: 'Accordion',
  parts: ['Accordion owns a labeled group of semantic disclosure headings, buttons, and panels.'],
  preferredAlternatives: [
    'Use Disclosure for one section, Tabs for peer panels, or always-visible Sections for required content.',
  ],
  preferredCompositions: [
    'Compose Accordion inside a Section when a larger task needs grouped optional detail.',
  ],
  purpose: 'Accordion coordinates expansion across several related disclosure sections.',
  relatedExports: ['AppearanceProvider', 'Disclosure', 'Section', 'Tabs'],
  responsiveBehavior: ['Headings and panels wrap in place without adding horizontal overflow.'],
  states: [
    'Expansion may be single or multiple, controlled or uncontrolled; the group or individual items may be disabled.',
  ],
  summary: 'Coordinate single or multiple expansion across related labeled sections.',
} satisfies ComponentContract;

export const sideNavigationContract = {
  ...commonNavigationGuidance,
  appearance: [
    'SideNavigation uses one restrained surface, quiet nested guide rails, and an accent route marker for the current destination.',
  ],
  appropriateUses: [
    'persistent navigation among grouped and hierarchical application destinations',
  ],
  composition: [
    'Render inside AppearanceProvider so the surface, route, focus, and text roles use the active theme and accent.',
    'Pass labeled groups containing stable destination ids, labels, href values, and optional nested destinations.',
    'Set currentId from the active route. Control isCollapsed from an application breakpoint when compact layout should begin collapsed.',
  ],
  contentRules: [
    'Use short destination nouns, group labels only when they clarify hierarchy, and no command actions.',
  ],
  controlBehavior: [
    'SideNavigation supports controlled or uncontrolled collapse, preserves native link navigation, and reports destination ids through onNavigate.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'RunActionsSideNavigationCounterexample',
        '<SideNavigation ariaLabel="Run actions" collapseLabel="Collapse" expandLabel="Expand" currentId="delete" groups={[{id: "actions", items: [{id: "delete", label: "Delete", href: "#delete"}]}]} />',
      ),
      description:
        'Commands belong in Menu, Toolbar, or Button actions rather than destination navigation.',
      title: 'Do not place commands in side navigation',
    },
  ],
  events: [
    'onNavigate reports the activated destination id without replacing href routing. onCollapsedChange reports compact-state requests.',
  ],
  examples: [
    {
      code: inProvider(
        'WorkspaceNavigation',
        '<SideNavigation\n  ariaLabel="Workspace"\n  collapseLabel="Collapse navigation"\n  currentId="active-runs"\n  expandLabel="Expand navigation"\n  groups={[{\n    id: "workspace",\n    label: "Workspace",\n    items: [{id: "overview", label: "Overview", href: "/overview"}, {id: "active-runs", label: "Active runs", href: "/runs"}],\n  }]}\n/>',
      ),
      description: 'Expose grouped application destinations and the current route.',
      title: 'Application destinations',
    },
  ],
  exportName: 'SideNavigation',
  importPath: '.',
  inappropriateUses: [
    'commands, transient choices, contextual actions, panel selection, or routing implementation',
  ],
  keyboardBehavior: [
    'Tab reaches the collapse control and every enabled visible link; Enter activates the focused control.',
  ],
  kind: 'component',
  labeling: [
    'ariaLabel names the navigation landmark; collapseLabel and expandLabel name the state-changing control.',
  ],
  name: 'SideNavigation',
  parts: [
    'SideNavigation owns its landmark, collapse control, labeled groups, nested lists, links, and current marker.',
  ],
  preferredAlternatives: [
    'Use Menu for commands, Tabs for peer panels, Breadcrumbs for ancestry, or Link for isolated destinations.',
  ],
  preferredCompositions: [
    'Compose SideNavigation as the persistent navigation region of an application shell.',
  ],
  purpose: 'SideNavigation exposes grouped application destinations without owning a router.',
  relatedExports: ['AppearanceProvider', 'Breadcrumbs', 'Link', 'Menu', 'Tabs'],
  responsiveBehavior: [
    'The controlled or uncontrolled collapsed state reduces the compact layout to one reachable expansion control.',
  ],
  states: [
    'Current destination is consumer-owned; collapse may be controlled or uncontrolled; links may be disabled.',
  ],
  summary:
    'Navigate grouped application destinations with hierarchy, current location, and compact collapse.',
} satisfies ComponentContract;
