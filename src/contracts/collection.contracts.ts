import type {ComponentContract} from './component-contract.js';

const sharedCollectionAppearance = [
  'Collection text, dividers, feedback, focus, and selection use the active AppearanceProvider values.',
  'Compact layouts keep readable rows and move card and description layouts to one column.',
];

const sharedCollectionStates = [
  'ready displays the current items, loading keeps current items and adds Spinner, partial keeps items and adds warning feedback, and error keeps items and adds danger feedback.',
  'An empty ready collection renders the required no-data or no-results EmptyState inside the labeled collection context.',
];

export const listContract = {
  accentBehavior: ['Ordered and unordered markers use the application accent rail color.'],
  accessibility: [
    'List renders native ul or ol and li semantics without adding focus or selection behavior.',
  ],
  appearance: sharedCollectionAppearance,
  appropriateUses: [
    'a readable sequence or set of related content needs native list semantics without selection',
  ],
  composition: [
    'Render List inside AppearanceProvider.',
    'Pass keyed items through items. primary and optional secondary content remain consumer-owned React content.',
  ],
  contentRules: [
    'Use number only when order matters, bullet for an unordered set, and none when surrounding presentation already supplies the grouping.',
  ],
  controlBehavior: ['List has no command, navigation, focus-management, or selection behavior.'],
  counterExamples: [
    {
      code: `<AppearanceProvider accent="#2878ff" appearance="dark">
  <List
  ariaLabel="Runs"
  emptyState={{kind: 'no-data', title: 'No runs', description: 'Create a run first.'}}
  items={[{id: 'run-284', primary: 'RUN 0284'}]}
  marker="bullet"
  />
</AppearanceProvider>;`,
      description: 'A selectable result set needs ListBox instead of click handlers on List rows.',
      title: 'Do not add selection to a content list',
    },
  ],
  directionality: [
    'Markers and content inset follow logical inline direction in left-to-right and right-to-left contexts.',
  ],
  events: [
    'Dynamic insertion, removal, and reordering occur by replacing items with the same stable id domain.',
  ],
  examples: [
    {
      code: `<AppearanceProvider accent="#2878ff" appearance="dark">
  <List
  ariaLabel="Run sequence"
  emptyState={{kind: 'no-data', title: 'No steps', description: 'Add a step first.'}}
  items={[
    {id: 'prepare', primary: 'Prepare mesh', secondary: 'Complete'},
    {id: 'solve', primary: 'Solve model', secondary: 'Running'},
  ]}
  marker="number"
  />
</AppearanceProvider>;`,
      description: 'A numbered process keeps its native order and concise secondary state.',
      title: 'Ordered run sequence',
    },
  ],
  exportName: 'List',
  forcedColorBehavior: ['Markers, text, and collection feedback use system colors.'],
  formBehavior: ['List does not submit form values.'],
  importPath: '.',
  inappropriateUses: [
    'selection, tabular comparison, term and value pairs, navigation, or command rows',
  ],
  keyboardBehavior: ['List adds no keyboard interaction to its content.'],
  kind: 'component',
  labeling: ['ariaLabel names the native list for assistive technology.'],
  localization: ['Consumers localize labels, item content, empty copy, and status copy.'],
  name: 'List',
  parts: [
    'The component owns the native list, keyed list items, copy layout, and collection feedback.',
  ],
  preferredAlternatives: [
    'Use DescriptionList for terms and values, ListBox for selection, or CardCollection for grouped summaries.',
  ],
  preferredCompositions: [
    'Place List in Section or Surface when the sequence needs a visible heading.',
  ],
  purpose:
    'List presents keyed static content with ordered, unordered, or visually unmarked native list semantics.',
  reducedMotionBehavior: [
    'List has no motion. Spinner feedback follows its own reduced-motion behavior.',
  ],
  relatedExports: [
    'AppearanceProvider',
    'CardCollection',
    'DescriptionList',
    'EmptyState',
    'ListBox',
    'Section',
    'Spinner',
    'Surface',
  ],
  responsiveBehavior: ['Long primary and secondary content wraps without horizontal overflow.'],
  states: sharedCollectionStates,
  stylesheet: './styles.css',
  summary: 'Present a keyed content sequence without selection or navigation behavior.',
  validation: ['Every item id must be a nonempty stable string and unique within the collection.'],
} as const satisfies ComponentContract;

export const descriptionListContract = {
  accentBehavior: [
    'DescriptionList reserves accent for shared feedback and does not color ordinary values.',
  ],
  accessibility: ['DescriptionList renders one native dl with paired dt and dd elements.'],
  appearance: sharedCollectionAppearance,
  appropriateUses: ['a compact set of terms and corresponding values describes one subject'],
  composition: [
    'Render DescriptionList inside AppearanceProvider.',
    'Pass keyed term and description content through items.',
  ],
  contentRules: [
    'Terms stay concise. Descriptions may contain formatted content but should not become dense tables or independent cards.',
  ],
  controlBehavior: [
    'DescriptionList has no row activation, focus-management, or selection behavior.',
  ],
  counterExamples: [
    {
      code: `<AppearanceProvider accent="#2878ff" appearance="dark">
  <DescriptionList
  ariaLabel="Runs"
  emptyState={{kind: 'no-data', title: 'No runs', description: 'Create a run first.'}}
  items={[{id: 'run', term: 'RUN 0284', description: 'Complete'}]}
  />
</AppearanceProvider>;`,
      description:
        'Repeated records with sortable columns belong in Table, not a description list.',
      title: 'Do not imitate a data table',
    },
  ],
  directionality: [
    'Term and description columns follow logical reading direction and stack on compact layouts.',
  ],
  events: ['Dynamic insertion, removal, and reordering occur by replacing items with stable ids.'],
  examples: [
    {
      code: `<AppearanceProvider accent="#2878ff" appearance="dark">
  <DescriptionList
  ariaLabel="Run details"
  emptyState={{kind: 'no-data', title: 'No details', description: 'Select a run first.'}}
  items={[
    {id: 'run', term: 'Run', description: 'RUN 0284'},
    {id: 'profile', term: 'Profile', description: 'Balanced'},
  ]}
  />
</AppearanceProvider>;`,
      description: 'Terms and values describe one run without pretending to be a table.',
      title: 'Run facts',
    },
  ],
  exportName: 'DescriptionList',
  forcedColorBehavior: ['Dividers, terms, values, and feedback use system colors.'],
  formBehavior: ['DescriptionList does not submit form values.'],
  importPath: '.',
  inappropriateUses: ['sortable records, selection, commands, navigation, or unrelated prose'],
  keyboardBehavior: ['DescriptionList adds no keyboard interaction to its content.'],
  kind: 'component',
  labeling: ['ariaLabel names the description list for assistive technology.'],
  localization: ['Consumers localize the label, terms, values, empty copy, and status copy.'],
  name: 'DescriptionList',
  parts: [
    'The component owns the native description list, keyed pairs, compact reflow, and collection feedback.',
  ],
  preferredAlternatives: [
    'Use List for a sequence, CardCollection for separate summaries, or Table for comparable records and columns.',
  ],
  preferredCompositions: [
    'Place DescriptionList beside a heading in Section or inside a detail Surface.',
  ],
  purpose: 'DescriptionList presents keyed term and value pairs for one described subject.',
  reducedMotionBehavior: [
    'DescriptionList has no motion. Spinner feedback follows its own reduced-motion behavior.',
  ],
  relatedExports: [
    'AppearanceProvider',
    'CardCollection',
    'EmptyState',
    'List',
    'ListBox',
    'Section',
    'Spinner',
    'Surface',
  ],
  responsiveBehavior: ['Term and value columns stack below the compact breakpoint.'],
  states: sharedCollectionStates,
  stylesheet: './styles.css',
  summary: 'Present keyed terms and values with native description-list semantics.',
  validation: ['Every pair id must be a nonempty stable string and unique within the collection.'],
} as const satisfies ComponentContract;

export const listBoxContract = {
  accentBehavior: [
    'The active item uses the focus ring, while selected items use a separate accent rail.',
  ],
  accessibility: [
    'ListBox owns listbox and option semantics, active focus, disabled options, and selected state.',
    'Focus and selection remain separate so moving through options does not silently commit a choice.',
  ],
  appearance: sharedCollectionAppearance,
  appropriateUses: ['one or more keyed items must be selected from a visible collection'],
  composition: [
    'Render ListBox inside AppearanceProvider.',
    'Pass label, optional description, disabled state, and stable id through library-owned items.',
  ],
  contentRules: [
    'Labels are plain localized strings so locale-aware typeahead remains dependable.',
  ],
  controlBehavior: [
    'selectionMode explicitly chooses none, single, or multiple behavior. Controlled and uncontrolled selection use separate typed props.',
    'Dynamic item updates preserve collection focus when the focused stable id remains present.',
  ],
  counterExamples: [
    {
      code: `<AppearanceProvider accent="#2878ff" appearance="dark">
  <ListBox
  ariaLabel="Commands"
  emptyState={{kind: 'no-data', title: 'No commands', description: 'No commands are available.'}}
  items={[{id: 'delete', label: 'Delete run'}]}
  selectionMode="none"
  />
</AppearanceProvider>;`,
      description:
        'A command row belongs in Menu or Toolbar. ListBox models focus and selection, not command activation.',
      title: 'Do not use options as commands',
    },
  ],
  directionality: ['Arrow behavior and the selection rail follow the inherited text direction.'],
  events: [
    'onSelectionChange reports one id or null in single mode and an item-ordered id array in multiple mode.',
  ],
  examples: [
    {
      code: `<AppearanceProvider accent="#2878ff" appearance="dark">
  <ListBox
  ariaLabel="Compared runs"
  defaultSelectedIds={['run-284']}
  emptyState={{kind: 'no-results', title: 'No matches', description: 'Try another query.'}}
  items={[
    {id: 'run-284', label: 'RUN 0284', description: 'Converged'},
    {id: 'run-283', label: 'RUN 0283', description: 'Converged'},
  ]}
  selectionMode="multiple"
  />
</AppearanceProvider>;`,
      description: 'Multiple selection is declared and keyed independently from keyboard focus.',
      title: 'Compare runs',
    },
  ],
  exportName: 'ListBox',
  forcedColorBehavior: [
    'Focus, selection, boundaries, disabled state, and text use system colors.',
  ],
  formBehavior: [
    'ListBox does not serialize values. Consumers own any form representation of collection selection.',
  ],
  importPath: '.',
  inappropriateUses: [
    'commands, navigation destinations, hidden select fields, arbitrary interactive descendants, or tabular records',
  ],
  keyboardBehavior: [
    'Arrow keys move focus, Home and End move to boundaries, locale-aware typeahead finds labels, and Space or Enter toggles selection.',
  ],
  kind: 'component',
  labeling: [
    'ariaLabel supplies the required listbox name. Item labels supply option names and typeahead text.',
  ],
  localization: [
    'Consumers localize the collection label, item text, empty copy, and status copy.',
  ],
  name: 'ListBox',
  parts: [
    'The component owns the listbox, options, focus ring, selection rail, disabled state, and collection feedback.',
  ],
  preferredAlternatives: [
    'Use Select for a collapsed single choice, Menu for commands, List for static content, or CardCollection for summary cards.',
  ],
  preferredCompositions: [
    'Pair ListBox with SearchField when a visible result collection needs consumer-owned filtering.',
  ],
  purpose:
    'ListBox presents a visible keyed option collection with explicit none, single, or multiple selection.',
  reducedMotionBehavior: [
    'The selection rail settles without transition. No other motion is introduced.',
  ],
  relatedExports: [
    'AppearanceProvider',
    'CardCollection',
    'EmptyState',
    'List',
    'Menu',
    'SearchField',
    'Select',
    'Spinner',
  ],
  responsiveBehavior: [
    'Options keep a touch-sized row and wrap secondary descriptions without horizontal overflow.',
  ],
  states: [
    ...sharedCollectionStates,
    'Options support focused, selected, disabled, hovered, and pressed states without conflating focus and selection.',
  ],
  stylesheet: './styles.css',
  summary:
    'Select keyed visible options with library-owned focus, keyboard, and typeahead behavior.',
  validation: [
    'Every option id must be a nonempty stable string and unique within the collection.',
  ],
} as const satisfies ComponentContract;

export const cardCollectionContract = {
  accentBehavior: [
    'Selectable cards use an accent focus ring and selection rail without tinting ordinary card content.',
  ],
  accessibility: [
    'none mode renders a native list of named articles. Single and multiple modes render a labeled grid list with selected rows.',
    'Nested actions stay real controls and do not turn the whole static card into an unnamed button or link.',
  ],
  appearance: sharedCollectionAppearance,
  appropriateUses: [
    'related records need separate summary surfaces with optional visible actions or explicit selection',
  ],
  composition: [
    'Render CardCollection inside AppearanceProvider.',
    'Pass title, optional description, content, actions, and stable id through items. Selectable items may also declare disabled state.',
  ],
  contentRules: [
    'Keep each card concise. Put commands in actions and declare selectionMode instead of attaching click behavior to the card surface.',
  ],
  controlBehavior: [
    'selectionMode none keeps cards static. Single and multiple modes add collection focus and selection through typed controlled or uncontrolled props.',
    'Dynamic item updates preserve collection focus when the focused stable id remains present.',
  ],
  counterExamples: [
    {
      code: `<AppearanceProvider accent="#2878ff" appearance="dark">
  <CardCollection
  ariaLabel="Recent runs"
  emptyState={{kind: 'no-data', title: 'No runs', description: 'Create a run first.'}}
  headingLevel={3}
  items={[{id: 'run-284', title: 'RUN 0284', description: 'Complete'}]}
  selectionMode="none"
  />
</AppearanceProvider>;`,
      description:
        'Do not add a click handler around the rendered card. Use an actions control, explicit selection, or a future navigation-card contract.',
      title: 'Do not hide interaction in the card surface',
    },
  ],
  directionality: [
    'Card flow, nested actions, focus, and the selection rail follow logical direction.',
  ],
  events: [
    'Selection callbacks use the same single or item-ordered multiple id values as ListBox. Nested actions own their own events.',
  ],
  examples: [
    {
      code: `<AppearanceProvider accent="#2878ff" appearance="dark">
  <CardCollection
  ariaLabel="Recent runs"
  emptyState={{kind: 'no-data', title: 'No runs', description: 'Create a run first.'}}
  headingLevel={3}
  items={[{
    id: 'run-284',
    title: 'RUN 0284',
    description: 'Completed two minutes ago',
    actions: <Button size="compact">Inspect run</Button>,
  }]}
  selectionMode="none"
  />
</AppearanceProvider>;`,
      description: 'A static named article exposes its command as a visible nested Button.',
      title: 'Run summary with an action',
    },
  ],
  exportName: 'CardCollection',
  forcedColorBehavior: [
    'Card boundaries, focus, selection, disabled state, text, and actions use system colors.',
  ],
  formBehavior: [
    'CardCollection does not serialize selection. Nested form controls retain their own form behavior.',
  ],
  importPath: '.',
  inappropriateUses: [
    'hidden whole-card commands or links, long documents, sortable tables, menus, or unrelated dashboard layout',
  ],
  keyboardBehavior: [
    'Selectable cards use grid-list arrow, Home, End, typeahead, and selection keys. Nested controls retain their own keyboard behavior.',
  ],
  kind: 'component',
  labeling: [
    'ariaLabel names the group. title names each article or selectable row, and headingLevel preserves page hierarchy.',
  ],
  localization: [
    'Consumers localize the group label, card copy, action labels, empty copy, and status copy.',
  ],
  name: 'CardCollection',
  parts: [
    'The component owns the responsive group, cards, headings, selection behavior, action slot, and collection feedback.',
  ],
  preferredAlternatives: [
    'Use List for simple sequences, DescriptionList for one record, ListBox for compact options, or Table for column comparison.',
  ],
  preferredCompositions: [
    'Place CardCollection in Section and use SearchField outside it when consumers filter the keyed items.',
  ],
  purpose:
    'CardCollection groups keyed summary cards while keeping static content, nested actions, and selection explicit.',
  reducedMotionBehavior: ['The selection rail settles without transition. Cards add no movement.'],
  relatedExports: [
    'AppearanceProvider',
    'Button',
    'DescriptionList',
    'EmptyState',
    'List',
    'ListBox',
    'SearchField',
    'Section',
    'Spinner',
  ],
  responsiveBehavior: [
    'Cards use equal responsive columns and collapse to one column on compact viewports.',
  ],
  states: [
    ...sharedCollectionStates,
    'Selectable cards support focused, selected, disabled, hovered, and pressed states. Static cards expose none of those widget states.',
  ],
  stylesheet: './styles.css',
  summary: 'Group keyed summary cards with explicit static, action, or selection behavior.',
  validation: [
    'Every card id must be a nonempty stable string and unique within the collection.',
    'Static cards do not accept disabled state. Disabled selectable cards do not accept nested actions.',
  ],
} as const satisfies ComponentContract;

export const tableContract = {
  accentBehavior: [
    'Selected rows use the established leading accent rail. Focus uses the active accent focus color without tinting ordinary data.',
  ],
  accessibility: [
    'Table owns a labeled grid with column headers, row headers, rows, cells, sort state, and optional row selection.',
    'Embedded actions remain named controls inside an actions column and do not activate or select their row.',
  ],
  appearance: sharedCollectionAppearance,
  appropriateUses: [
    'people need to scan and compare keyed records across typed columns, optionally sort them, or select rows',
  ],
  composition: [
    'Render Table inside AppearanceProvider.',
    'Define columns once and provide every row cell through a record keyed by the same column ids.',
    'Place Button, IconButton, Link, or another explicit control in a column whose kind is actions.',
  ],
  contentRules: [
    'Mark at least one data column as a row header. Keep headers concise and use end alignment for numeric values.',
    'Sorting is application-owned. Reorder rows after onSortChange and pass the active descriptor back to Table.',
  ],
  controlBehavior: [
    'selectionMode explicitly chooses none, single, or multiple row selection through typed controlled or uncontrolled props.',
    'Sortable columns require onSortChange. Table reports a typed descriptor and never mutates or sorts consumer rows.',
    'Stable row ids preserve focus through insertion and reordering. Removing the focused row moves focus through the grid behavior.',
  ],
  counterExamples: [
    {
      code: `<AppearanceProvider accent="#2878ff" appearance="dark">
  <Table
    ariaLabel="Editable budget"
    columns={[{id: 'amount', label: 'Amount', isRowHeader: true}]}
    emptyState={{kind: 'no-data', title: 'No rows', description: 'Add a row first.'}}
    rows={[{id: 'row-1', textValue: 'Row 1', cells: {amount: <input />}}]}
    selectionMode="none"
  />
</AppearanceProvider>;`,
      description:
        'Table compares records. Use fields and an explicit edit flow instead of turning every cell into a spreadsheet editor.',
      title: 'Do not imply spreadsheet editing',
    },
  ],
  directionality: [
    'Column order, start and end alignment, selection rails, and horizontal overflow follow inherited writing direction.',
  ],
  events: [
    'onSortChange reports a column id and ascending or descending direction. Selection callbacks report row ids in current row order.',
    'Controls inside action cells own their own events and do not trigger row selection.',
  ],
  examples: [
    {
      code: `<AppearanceProvider accent="#2878ff" appearance="dark">
  <Table
    ariaLabel="Run results"
    columns={[
      {id: 'run', label: 'Run', isRowHeader: true, allowsSorting: true},
      {id: 'status', label: 'Status'},
    ]}
    emptyState={{kind: 'no-results', title: 'No matches', description: 'Change the query.'}}
    onSortChange={(descriptor) => console.log(descriptor)}
    rows={[{
      id: 'run-284',
      textValue: 'RUN 0284',
      cells: {run: 'RUN 0284', status: 'Converged'},
    }]}
    selectionMode="none"
  />
</AppearanceProvider>;`,
      description: 'A sortable row-header column identifies each comparable run.',
      title: 'Sortable run results',
    },
  ],
  exportName: 'Table',
  forcedColorBehavior: [
    'Headers, cells, boundaries, focus, selection, disabled rows, and overflow use system colors.',
  ],
  formBehavior: [
    'Table does not serialize row selection. Controls placed in cells retain their own form behavior.',
  ],
  importPath: '.',
  inappropriateUses: [
    'spreadsheet editing, layout grids, hierarchical records, prose, menus, or collections without meaningful columns',
  ],
  keyboardBehavior: [
    'Arrow keys move through rows and cells, Home and End reach row boundaries, typeahead finds row headers, Enter sorts headers, and Space or Enter changes selection.',
    'Focusable controls in cells retain their own keyboard operation without becoming row activation.',
  ],
  kind: 'component',
  labeling: [
    'ariaLabel names the grid. isRowHeader marks the columns that name each row. Column and row text values support announcements and typeahead.',
  ],
  localization: [
    'Consumers localize the table name, headers, cell content, action labels, empty copy, and status copy.',
  ],
  name: 'Table',
  parts: [
    'The component owns the overflow container, grid, headers, rows, cells, sorting affordance, selection treatment, and collection feedback.',
  ],
  preferredAlternatives: [
    'Use DescriptionList for one subject, List for a readable sequence, ListBox for compact selection, or Tree for hierarchy.',
  ],
  preferredCompositions: [
    'Place CollectionFilterBar before Table when the application coordinates query, filtering, and sortable results.',
  ],
  purpose:
    'Table compares keyed records across typed columns with optional application-owned sorting and row selection.',
  reducedMotionBehavior: [
    'The selection rail and sort indicator settle without transition. Table adds no continuous motion.',
  ],
  relatedExports: [
    'AppearanceProvider',
    'Button',
    'CollectionFilterBar',
    'DescriptionList',
    'EmptyState',
    'IconButton',
    'Link',
    'List',
    'Spinner',
    'Tree',
  ],
  responsiveBehavior: [
    'The table keeps its column relationships and scrolls horizontally when the available inline size is too small. Cells wrap ordinary content.',
  ],
  states: [
    ...sharedCollectionStates,
    'Rows support focused, selected, selection-disabled, hovered, and pressed states. Headers expose sortable and active sort-direction states.',
  ],
  stylesheet: './styles.css',
  summary: 'Compare typed keyed rows with sorting, selection, and explicit cell actions.',
  validation: [
    'Column and row ids must be nonempty and unique. Every row provides exactly one cell for every declared column.',
    'At least one column is a row header. Action columns cannot sort or name rows. An active sort descriptor names a sortable column.',
    'Virtualization is not part of the public API.',
  ],
} as const satisfies ComponentContract;

export const treeContract = {
  accentBehavior: [
    'Selected items use the established leading accent rail. Focus and expansion controls use the active accent roles.',
  ],
  accessibility: [
    'Tree owns a labeled tree grid with hierarchical levels, positions, expansion state, disabled items, and optional selection.',
    'Every expandable item includes a named chevron control. Nested actions remain separate named controls.',
  ],
  appearance: sharedCollectionAppearance,
  appropriateUses: [
    'nested keyed information needs disclosure, keyboard hierarchy navigation, and optional selection',
  ],
  composition: [
    'Render Tree inside AppearanceProvider.',
    'Provide recursive items with stable ids, plain labels for typeahead, optional descriptions, children, and visible nested actions.',
  ],
  contentRules: [
    'Use hierarchy only when parent and child relationships change meaning. Keep labels concise and do not imitate indentation with spaces.',
  ],
  controlBehavior: [
    'Expansion and selection are separate controlled or uncontrolled typed states.',
    'Stable ids preserve focused items through insertion and reordering. Removing the focused item moves focus to a nearby remaining item.',
  ],
  counterExamples: [
    {
      code: `<AppearanceProvider accent="#2878ff" appearance="dark">
  <Tree
    ariaLabel="Commands"
    collapseLabel="Collapse"
    emptyState={{kind: 'no-data', title: 'No commands', description: 'No commands are available.'}}
    expandLabel="Expand"
    items={[{id: 'delete', label: 'Delete run'}]}
    selectionMode="none"
  />
</AppearanceProvider>;`,
      description: 'A flat command collection belongs in Menu or Toolbar, not a tree.',
      title: 'Do not use hierarchy for commands',
    },
  ],
  directionality: [
    'Indentation, chevrons, expansion keys, nested actions, and selection rails follow inherited writing direction.',
  ],
  events: [
    'onExpandedChange and onSelectionChange report ids in depth-first item order. Nested controls own their own events.',
  ],
  examples: [
    {
      code: `<AppearanceProvider accent="#2878ff" appearance="dark">
  <Tree
    ariaLabel="Study hierarchy"
    collapseLabel="Collapse"
    defaultExpandedIds={['study']}
    emptyState={{kind: 'no-data', title: 'No studies', description: 'Create a study first.'}}
    expandLabel="Expand"
    items={[{
      id: 'study',
      label: 'Thermal study',
      children: [{id: 'run-284', label: 'RUN 0284'}],
    }]}
    selectionMode="single"
  />
</AppearanceProvider>;`,
      description: 'Expansion reveals runs while selection remains an independent state.',
      title: 'Study and run hierarchy',
    },
  ],
  exportName: 'Tree',
  forcedColorBehavior: [
    'Hierarchy, chevrons, focus, selection, disabled state, boundaries, and text use system colors.',
  ],
  formBehavior: [
    'Tree does not serialize expansion or selection. Nested form controls retain their own behavior.',
  ],
  importPath: '.',
  inappropriateUses: [
    'flat commands, breadcrumb navigation, tabular comparison, arbitrary indentation, or relationship diagrams',
  ],
  keyboardBehavior: [
    'Up and Down move between visible items. Logical Right and Left expand, collapse, or move between parent and child. Home, End, typeahead, and selection keys follow tree-grid behavior.',
  ],
  kind: 'component',
  labeling: [
    'ariaLabel names the tree grid. Item labels name rows and support typeahead. expandLabel and collapseLabel localize chevron commands.',
  ],
  localization: [
    'Consumers localize the tree name, item labels and descriptions, expansion labels, action labels, empty copy, and status copy.',
  ],
  name: 'Tree',
  parts: [
    'The component owns the tree grid, recursive collection, levels, chevrons, item copy, action slot, focus recovery, selection, and feedback.',
  ],
  preferredAlternatives: [
    'Use List for flat content, ListBox for flat selection, Table for columns, or CollapsibleNavigationPane for persistent destinations.',
  ],
  preferredCompositions: [
    'Place Tree in Section or Surface and keep commands in each item actions slot.',
  ],
  purpose:
    'Tree navigates keyed hierarchical information with explicit expansion and optional selection.',
  reducedMotionBehavior: [
    'Chevrons and the selection rail settle without transition. Tree adds no continuous motion.',
  ],
  relatedExports: [
    'AppearanceProvider',
    'Button',
    'EmptyState',
    'IconButton',
    'List',
    'ListBox',
    'Menu',
    'Section',
    'CollapsibleNavigationPane',
    'Spinner',
    'Surface',
    'Table',
  ],
  responsiveBehavior: [
    'Long labels wrap within their hierarchy level. Compact layouts preserve indentation without causing document overflow.',
  ],
  states: [
    ...sharedCollectionStates,
    'Items support collapsed, expanded, focused, selected, disabled, hovered, and pressed states. Focus recovery follows dynamic updates.',
  ],
  stylesheet: './styles.css',
  summary: 'Navigate and optionally select stable keyed hierarchy with explicit expansion.',
  validation: [
    'Every item id must be a nonempty stable string and unique across the full hierarchy.',
    'Disabled items cannot contain active nested actions. Virtualization and asynchronous per-level loading are not public APIs.',
  ],
} as const satisfies ComponentContract;

export const collectionFilterBarContract = {
  accentBehavior: [
    'Search and filter controls use the application accent for focus. Applied summaries keep neutral text and accent structure.',
  ],
  accessibility: [
    'CollectionFilterBar owns one named search region containing a named search field, labeled filter selects, and a labeled list of applied query summaries.',
    'Each applied summary has a named removal control. Clear all remains a separate named command.',
  ],
  appearance: sharedCollectionAppearance,
  appropriateUses: [
    'one text query and a bounded set of categorical filters coordinate a visible consumer-owned collection',
  ],
  composition: [
    'Render CollectionFilterBar inside AppearanceProvider immediately before the collection it controls.',
    'Define filters and options with stable ids. Keep data fetching, filtering, result counts, and sorting in the application.',
  ],
  contentRules: [
    'Use short filter labels and option labels. Summary callbacks produce concise localized descriptions of the active query.',
  ],
  controlBehavior: [
    'Controlled or uncontrolled query state contains text and an item-ordered list of filter id and option value pairs.',
    'Changing, removing, or clearing criteria reports a complete next query. The component never filters data or resets collection state.',
  ],
  counterExamples: [
    {
      code: `<AppearanceProvider accent="#2878ff" appearance="dark">
  <CollectionFilterBar
    appliedFiltersLabel="Applied query"
    ariaLabel="Filter runs"
    clearAllLabel="Clear query"
    filters={[]}
    getFilterSummary={(filter, option) => filter + ': ' + option}
    getRemoveLabel={(summary) => 'Remove ' + summary}
    getSearchSummary={(text) => 'Search: ' + text}
    searchClearLabel="Clear search"
    searchLabel="Search runs"
  />
</AppearanceProvider>;`,
      description:
        'Do not hide network requests inside the filter controls. The application receives query changes and owns results.',
      title: 'Do not make filters fetch data',
    },
  ],
  directionality: [
    'Control order, applied-summary flow, remove controls, and text follow inherited writing direction.',
  ],
  events: [
    'onQueryChange reports the complete text and filter selection state after every search, select, remove, or clear command.',
  ],
  examples: [
    {
      code: `<AppearanceProvider accent="#2878ff" appearance="dark">
  <CollectionFilterBar
    appliedFiltersLabel="Applied query"
    ariaLabel="Filter runs"
    clearAllLabel="Clear query"
    filters={[{
      id: 'status',
      label: 'Status',
      emptyMessage: 'No statuses',
      placeholder: 'Any status',
      options: [{value: 'running', label: 'Running'}],
    }]}
    getFilterSummary={(filter, option) => filter + ': ' + option}
    getRemoveLabel={(summary) => 'Remove ' + summary}
    getSearchSummary={(text) => 'Search: ' + text}
    searchClearLabel="Clear search"
    searchLabel="Search runs"
  />
</AppearanceProvider>;`,
      description: 'The query remains explicit while the application decides how results change.',
      title: 'Run query controls',
    },
  ],
  exportName: 'CollectionFilterBar',
  forcedColorBehavior: [
    'Controls, summaries, focus, remove commands, and boundaries use system colors.',
  ],
  formBehavior: [
    'CollectionFilterBar does not submit or fetch data. The application may serialize the reported query separately.',
  ],
  importPath: '.',
  inappropriateUses: [
    'unbounded query builders, full-text editing, hidden data fetching, sorting, pagination, or collection rendering',
  ],
  keyboardBehavior: [
    'Search and Select retain their field keyboard behavior. Tab reaches each field and applied-query command in reading order.',
  ],
  kind: 'component',
  labeling: [
    'ariaLabel names the search region. Every field, applied list, remove command, and clear command requires localized naming copy.',
  ],
  localization: [
    'Consumers localize all field, option, summary, removal, clear, placeholder, and empty-option copy through required strings and callbacks.',
  ],
  name: 'CollectionFilterBar',
  parts: [
    'The component owns the named search region, search field, filter selects, explicit query state, applied summary list, and removal commands.',
  ],
  preferredAlternatives: [
    'Use SearchField alone for text entry, Select for one unrelated choice, or a domain-specific query builder for unbounded conditions.',
  ],
  preferredCompositions: [
    'Coordinate CollectionFilterBar with Table, Tree, ListBox, or CardCollection while the parent owns filtering and async data.',
  ],
  purpose:
    'CollectionFilterBar reports explicit text and categorical query state with removable applied summaries.',
  reducedMotionBehavior: ['The filter bar adds no motion beyond its composed controls.'],
  relatedExports: [
    'AppearanceProvider',
    'CardCollection',
    'ListBox',
    'SearchField',
    'Select',
    'Table',
    'Tree',
  ],
  responsiveBehavior: [
    'Controls use equal responsive columns on wide layouts and stack at compact widths. Applied summaries wrap without document overflow.',
  ],
  states: [
    'The query may be empty or applied and controlled or uncontrolled. Search and filter fields preserve their disabled-option, focus, open, and value states.',
  ],
  stylesheet: './styles.css',
  summary:
    'Coordinate explicit collection search and categorical filter state without fetching data.',
  validation: [
    'Filter and option ids must be nonempty and unique within their domains. A query may select each known filter at most once and must use a known option value.',
  ],
} as const satisfies ComponentContract;
