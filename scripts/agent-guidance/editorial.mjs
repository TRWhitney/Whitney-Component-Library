// Short guidance reviewed against canonical contracts. See docs/research/agent-guidance-proposal.md.
export const essentials = {
  AppearanceProvider: [
    'Wrap library components once. appearance is light or dark; accent is required and must be an exact six-digit hex color.',
    'The provider supplies appearance, accent, and density. It adds no form or focus behavior.',
  ],
  Button: [
    'Use onPress for activation. Disabled and pending buttons do not activate; pending requires pendingLabel.',
    'type defaults to button. Set type="submit" or "reset" explicitly. form connects a button to a form by id.',
    'Visible children name the button. Enter and Space activate it. Arbitrary className and style are unsupported.',
  ],
  Dialog: [
    'Use exactly one library Button or IconButton as trigger. title, description, and closeLabel are required.',
    'Use isOpen plus onOpenChange for controlled state, or defaultOpen for uncontrolled state. Escape, backdrop press, close button, and actions calling close dismiss it.',
    'The library labels the modal, hides background content from assistive technology, moves focus inside, contains Tab and Shift+Tab, and restores trigger focus. Initial focus is the close control.',
    'Consumers own task data and validation. The overlay is not a form. Footer actions receive close; connect a submit button to a body form with matching form/id values.',
  ],
  TextField: [
    'label is required and visible. value/onChange control the complete string; defaultValue allows uncontrolled use.',
    'The library associates descriptions, required state, and errors with the native input. Set isInvalid and errorMessage for application errors.',
    'validationBehavior defaults to native. Use "aria" with application validation to avoid native validation blocking custom feedback. name/form retain native serialization.',
    'Pending is read-only. Native editing, composition, autofill, and input constraints remain available.',
  ],
  Checkbox: [
    'label is visible and required. isSelected/onChange control a boolean; defaultSelected allows uncontrolled use. Space toggles.',
    'isRequired supports acknowledgement. isInvalid/errorMessage show associated application errors; validationBehavior chooses native or ARIA validation.',
    'Only checked controls submit name/value. Native reset restores defaultSelected. isIndeterminate changes appearance and announcement, not the submitted value.',
  ],
  Tabs: [
    'Supply ariaLabel and nonempty items with unique stable ids, labels, and matching panel content. Tabs select peer panels, not URL routes.',
    'Use selectedId/onSelectionChange or defaultSelectedId. Arrow keys follow orientation; automatic activation selects on focus, manual activation waits for Enter or Space.',
    'The library owns tab/panel relationships and focus. Selection is separate from form data; application state belongs outside panels when it must survive panel changes.',
  ],
  SearchField: [
    'label and clearLabel are required. value/onChange control query text; defaultValue allows uncontrolled use.',
    'The native search input exposes a clear command only for editable nonempty queries. Enter invokes onSubmit; Escape or clear invokes onClear. Consumers own filtering.',
    'Descriptions and errors are associated automatically. Pending is read-only; name/form retain native string serialization.',
  ],
  Table: [
    'Supply ariaLabel, columns with unique ids, and stable keyed rows. Every row must have exactly one cell per column; at least one data column must be isRowHeader.',
    'Set selectionMode explicitly. kind="actions" columns hold named controls; those controls do not select or activate rows.',
    'Consumers filter and sort rows. Sortable columns require onSortChange; pass the active sort descriptor back and reorder rows yourself. The library does not mutate data.',
    'Provide emptyState with no-data or no-results copy. minimumWidth="content" fits short tables; the default 38rem causes deliberate horizontal scrolling.',
    'The library owns labeled grid/header/cell relationships and sort state. Enter sorts headers; arrows move through cells. Stable ids preserve focus during reordering.',
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

Table renders its own horizontal scroll container. A numeric minimumWidth keeps columns wide inside that container; "content" lets cells wrap. Bound the surrounding layout instead of hiding page overflow. A consumer wrapper can provide an additional scroll boundary when a parent grid measures the wide content.

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

These are application classes, not selectors into the component. Give enclosing flex/grid children min-width: 0; use minmax(0, 1fr) for a grid track that must shrink.

`,
  Tabs: `## Panel layout

Tabs renders a tab list followed by the selected panel. The library panel supplies padding, border, and background. Style your supplied panel content for spacing and containment; Tabs accepts no className or style.

For a panel with search and a wide table, wrap its content in a div with className="panel-content", then wrap Table as shown on its usage page. Bound the application container around Tabs as well.

\`\`\`css
.tabs-frame, .panel-content { min-width: 0; max-width: 100%; }
.panel-content { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; }
\`\`\`

Use these classes on your own wrappers. Keep query, sort, and selected-record state in the parent component so replacing panel content does not reset them.

`,
};
