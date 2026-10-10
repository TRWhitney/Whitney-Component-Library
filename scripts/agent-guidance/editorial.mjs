// Short guidance reviewed against canonical contracts. See docs/research/agent-guidance-proposal.md.
export const essentials = {
  AppearanceProvider: [
    'Wrap library components once. appearance is light/dark; required accent is six-digit hex.',
    'Supplies appearance, accent and density; no form or focus behavior.',
  ],
  Button: [
    'Use onPress for activation. Disabled/pending buttons do not activate; pending requires pendingLabel.',
    'type defaults to button; set submit/reset explicitly. form links the button to a form id.',
    'Visible children name the button; Enter/Space activate it. Arbitrary className/style unsupported.',
  ],
  Dialog: [
    'Use exactly one library Button/IconButton as trigger. Require title, description, closeLabel.',
    'Control with isOpen/onOpenChange, or use defaultOpen for uncontrolled state. Escape, backdrop press, close button and actions calling close dismiss.',
    'Labels the modal, hides background from assistive technology, focuses the close control, contains Tab/Shift+Tab and restores trigger focus.',
    'Consumers own data/validation. Dialog is not a form. Footer actions receive close; link a footer submit button to the body form with matching form/id.',
  ],
  TextField: [
    'Provide visible label. value/onChange control the whole string; defaultValue initializes uncontrolled text.',
    'Associates descriptions, required state and errors with the native input. Set isInvalid/errorMessage for application errors.',
    'validationBehavior defaults to native; use aria for application validation so native checks cannot block custom feedback. name/form serialize natively.',
    'Pending is read-only. Native editing, composition, autofill and constraints remain.',
  ],
  Checkbox: [
    'Provide visible label. isSelected/onChange control a boolean; defaultSelected initializes uncontrolled state. Space toggles.',
    'isRequired supports acknowledgement. isInvalid/errorMessage associate application errors; validationBehavior chooses native/aria.',
    'Only checked controls submit name/value. Native reset restores defaultSelected. isIndeterminate affects appearance/announcement, not submission.',
  ],
  Tabs: [
    'Require ariaLabel and nonempty items: unique stable ids, labels, matching panels. Peer panels, not URL routes.',
    'Control with selectedId/onSelectionChange, or initialize with defaultSelectedId. Defaults: horizontal/automatic; without either id, first enabled item. Arrows follow orientation; automatic selects on focus, manual on Enter/Space.',
    'Owns tab/panel relationships and focus. Selection is not form data. Keep application state outside panels to survive switches.',
  ],
  SearchField: [
    'Require label/clearLabel. value/onChange control query text; defaultValue initializes uncontrolled text.',
    'Native search input shows a clear command only for editable nonempty queries. Enter invokes onSubmit; Escape/clear invokes onClear. Consumers filter.',
    'Associates descriptions/errors. Pending is read-only; name/form serialize strings natively.',
  ],
  Table: [
    'Require ariaLabel, unique column ids, stable row keys, one cell per column and a data column with isRowHeader.',
    'Set selectionMode explicitly. kind="actions" columns contain named controls; these never select/activate rows.',
    'Consumers filter/sort. Sortable columns require onSortChange: pass the active descriptor back and reorder rows. Table never mutates data.',
    'Provide emptyState with no-data/no-results copy. minimumWidth="content" fits short tables; default 38rem scrolls horizontally.',
    'Owns labeled grid/header/cell relationships and sort state. Enter sorts headers; arrows navigate cells. Stable ids preserve focus on reorder.',
  ],
};

export const examples = {
  AppearanceProvider:
    '<AppearanceProvider appearance="light" accent="#2878ff"><Button>Continue</Button></AppearanceProvider>',
  Button: '<Button type="submit" form="settings">Save</Button>',
  Dialog:
    '<Dialog title="Edit" description="Update settings" closeLabel="Close" trigger={<Button>Edit</Button>} actions={({close}) => <Button onPress={close}>Done</Button>}><p>Task content</p></Dialog>',
  TextField: '<TextField label="Email" name="email" validationBehavior="aria" />',
  Checkbox: '<Checkbox label="Accept terms" name="terms" isRequired validationBehavior="aria" />',
  Tabs: '<Tabs ariaLabel="Details" defaultSelectedId="overview" items={[{id: "overview", label: "Overview", panel: <p>Overview</p>}, {id: "history", label: "History", panel: <p>History</p>}]} />',
  SearchField: '<SearchField label="Search records" clearLabel="Clear search" />',
  Table:
    '<Table ariaLabel="Records" minimumWidth="content" selectionMode="none" columns={[{id: "name", label: "Name", isRowHeader: true}]} rows={[{id: "one", textValue: "Example", cells: {name: "Example"}}]} emptyState={{kind: "no-results", title: "No matches", description: "Change the query."}} />',
};

export const layoutSupplements = {
  Table: `## Responsive composition

Table owns a horizontal scroll container. Numeric minimumWidth keeps columns wide; "content" lets cells wrap. Bound surrounding layout; do not hide page overflow. Add a consumer scroll wrapper if a parent grid measures wide content.

\`\`\`tsx
<div className="table-frame">
  <Table
    ariaLabel="Inventory"
    selectionMode="none"
    minimumWidth={640}
    columns={[
      {id: 'item', label: 'Item', isRowHeader: true},
      {id: 'stock', label: 'Stock'},
    ]}
    rows={[{id: 'notebook', textValue: 'Notebook', cells: {item: 'Notebook', stock: 12}}]}
    emptyState={{kind: 'no-data', title: 'No items', description: 'Add an item.'}}
  />
</div>
\`\`\`

\`\`\`css
.table-frame { min-width: 0; max-width: 100%; overflow-x: auto; }
\`\`\`

Apply these classes to consumer wrappers. Enclosing flex/grid children need min-width: 0; shrinking grid tracks need minmax(0, 1fr).

`,
  Tabs: `## Panel layout

Tabs renders the tab list, then the selected panel with padding, border and background. Style supplied content for spacing/containment; className/style unsupported.

For search/wide tables, use a panel-content div and Table's documented wrapper. Bound the container around Tabs.

\`\`\`css
.tabs-frame, .panel-content { min-width: 0; max-width: 100%; }
.panel-content { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; }
\`\`\`

Apply these classes to consumer wrappers. Parent-owned query, sort and selected-record state survives panel replacement.

`,
};
