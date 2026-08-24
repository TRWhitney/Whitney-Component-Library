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
