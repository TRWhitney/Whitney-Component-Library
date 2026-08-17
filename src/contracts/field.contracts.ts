import type {ComponentContract} from './component-contract.js';

const commonFieldGuidance = {
  accentBehavior: [
    'Resting field content stays neutral; hover and focus use saturated same-hue accent structure, while invalid and pending states retain independent danger and warning colors.',
  ],
  appearance: [
    'The field family uses compact rounded controls, one consistent single-line control height, neutral surfaces, and a reserved support track beneath each control.',
  ],
  directionality: [
    'Logical padding, group placement, icons, and step controls follow the inherited writing direction without changing DOM reading order.',
  ],
  forcedColorBehavior: [
    'Forced-color mode maps field surfaces, boundaries, focus, invalid state, and pending state to system colors without suppressing native control behavior.',
  ],
  localization: [
    'Supply visible labels, descriptions, errors, pending messages, and explicit command labels in the application locale, and allow them to wrap.',
  ],
  reducedMotionBehavior: [
    'Reduced motion stops the pending rail and removes field transitions while retaining a static warning rail and every state boundary.',
  ],
  responsiveBehavior: [
    'Fields fill their bounded parent width; support text grows below without moving or resizing the control, and responsive groups collapse through content-owned minimums.',
  ],
  stylesheet: './styles.css',
} satisfies Pick<
  ComponentContract,
  | 'accentBehavior'
  | 'appearance'
  | 'directionality'
  | 'forcedColorBehavior'
  | 'localization'
  | 'reducedMotionBehavior'
  | 'responsiveBehavior'
  | 'stylesheet'
>;

function withinAppearanceProvider(name: string, body: string): string {
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

export const fieldContract = {
  ...commonFieldGuidance,
  accessibility: [
    'Field generates stable label, description, error, required, invalid, busy, native and ARIA disabled, and native and ARIA read-only props for exactly one direct supported control.',
  ],
  appropriateUses: [
    'one custom form control needs the library field layout and accessible support relationships but no specialized library control applies',
  ],
  composition: [
    'Render Field inside AppearanceProvider; return one direct native control without overriding its native role, or one semantically neutral element with a button, checkbox, combobox, listbox, radio, searchbox, slider, spinbutton, switch, or textbox role. Spread every supplied control prop onto it without a DOM wrapper or overridden relationship or state prop. Field rejects native role overrides uniformly and protects its direct structure and generated relationships; it does not verify complete role-specific widget behavior.',
  ],
  contentRules: [
    'Use a concise visible label; use description for durable input guidance, errorMessage for actionable correction, and pendingMessage only for temporary checking.',
  ],
  controlBehavior: [
    'Field owns support and state relationships, removes a disabled custom control from tab order, and suppresses its direct activation; the rendered control retains value, non-activation events, domain behavior, and role-specific keyboard and ARIA conformance.',
  ],
  counterExamples: [
    {
      code: withinAppearanceProvider(
        'StaticFieldCounterexample',
        '<Field label="Tolerance">\n  {() => <div>0.0025 K</div>}\n</Field>',
      ),
      description:
        'Static content is not a form control and cannot honor the generated relationship.',
      title: 'Do not render display content as a field control',
    },
  ],
  events: ['Field emits no events; the callback-rendered control owns its domain event contract.'],
  examples: [
    {
      code: withinAppearanceProvider(
        'CustomFieldExample',
        '<Field label="Workspace" description="Use the team identifier.">\n  {(controlProps) => <input {...controlProps} name="workspace" />}\n</Field>',
      ),
      description: 'Spread the generated relationship onto one custom native control.',
      title: 'Label a custom control',
    },
  ],
  exportName: 'Field',
  formBehavior: [
    'Field does not serialize a value; native name, form association, validation, submission, and reset remain the custom control’s responsibility.',
  ],
  importPath: '.',
  inappropriateUses: [
    'TextField, TextArea, NumberField, SearchField, or another semantic library field already owns the required behavior',
  ],
  keyboardBehavior: [
    'Field adds no enabled keyboard model; the rendered custom control must provide the keyboard behavior appropriate to its semantic role and honor the supplied read-only state.',
  ],
  kind: 'composition',
  labeling: [
    'label is always visible; the generated control props reference it and any supplied description or error without consumer-authored ids.',
  ],
  name: 'Field',
  parts: ['Field owns a label, one control shell, and one stable support track.'],
  preferredAlternatives: [
    'Prefer TextField, TextArea, NumberField, SearchField, and later semantic field exports whenever their behavior matches the value being collected.',
  ],
  preferredCompositions: [
    'Place related Field peers in FieldGroup and organize larger form workflows with FormSection.',
  ],
  purpose: 'Field provides a bounded accessible shell for one custom form control.',
  relatedExports: [
    'AppearanceProvider',
    'FieldGroup',
    'FormSection',
    'NumberField',
    'SearchField',
    'TextArea',
    'TextField',
  ],
  states: [
    'Required, invalid, read-only, disabled, and pending states affect the generated control props and stable support presentation without changing geometry; required and read-only may be used only when the rendered native element or ARIA role supports that state.',
  ],
  summary: 'Label and support one custom form control through a narrow accessibility seam.',
  validation: [
    'Set isInvalid with errorMessage for externally owned invalidity; the custom control remains responsible for native or domain validation behavior.',
  ],
} satisfies ComponentContract;

export const textFieldContract = {
  ...commonFieldGuidance,
  accessibility: [
    'TextField renders a labeled native single-line input with generated description and error relationships and visible focus indication.',
  ],
  appropriateUses: ['a user enters one line of plain text, contact data, a URL, or a password'],
  composition: [
    'Render TextField inside AppearanceProvider and place related peers in FieldGroup rather than rebuilding label or support parts.',
  ],
  contentRules: [
    'Choose inputType for the value’s native text semantics; keep the label persistent and use placeholder only as an optional example.',
  ],
  controlBehavior: [
    'TextField supports controlled or uncontrolled string ownership and becomes read-only while pending so its value stays focusable and copyable.',
  ],
  counterExamples: [
    {
      code: withinAppearanceProvider('ProseTextFieldCounterexample', '<TextField label="Notes" />'),
      description: 'Long prose needs multiline editing and visible line capacity.',
      title: 'Do not use single-line entry for prose',
    },
  ],
  events: ['onChange reports the complete current string after each accepted text edit.'],
  examples: [
    {
      code: withinAppearanceProvider(
        'RunNameFieldExample',
        '<TextField label="Run name" name="run-name" description="Visible in exports." isRequired />',
      ),
      description: 'Collect one required, named text value with durable guidance.',
      title: 'Name a run',
    },
  ],
  exportName: 'TextField',
  formBehavior: [
    'name and form use native string serialization and reset; validationBehavior defaults to native and validate may return localized errors.',
  ],
  importPath: '.',
  inappropriateUses: [
    'the value is multiline prose, numeric, a search query, or a constrained choice',
  ],
  keyboardBehavior: [
    'Native text editing, selection, composition, and browser autofill behavior remain intact.',
  ],
  kind: 'component',
  labeling: [
    'label is required and remains visible; descriptions, errors, and required state are linked automatically.',
  ],
  name: 'TextField',
  parts: [
    'TextField owns a label, single-line input shell, native input, and stable support track.',
  ],
  preferredAlternatives: [
    'Use TextArea for prose, NumberField for locale-aware numeric values, and SearchField for clearable query submission.',
  ],
  preferredCompositions: [
    'Use FieldGroup for adjacent related values and FormSection for a named workflow region.',
  ],
  purpose: 'TextField collects one line of text with native form and validation behavior.',
  relatedExports: [
    'AppearanceProvider',
    'FieldGroup',
    'FormSection',
    'NumberField',
    'SearchField',
    'TextArea',
  ],
  states: [
    'Controlled, uncontrolled, required, invalid, read-only, disabled, and pending states preserve one control size.',
  ],
  summary: 'Collect one line of text through a persistent labeled native input.',
  validation: [
    'Native length, pattern, required, custom validate, and externally owned invalidity share the stable error track.',
  ],
} satisfies ComponentContract;

export const textAreaContract = {
  ...commonFieldGuidance,
  accessibility: [
    'TextArea renders a labeled native textarea with generated description and error relationships.',
  ],
  appropriateUses: [
    'a user enters multiline notes, explanation, source text, or other plain prose',
  ],
  composition: [
    'Render TextArea inside AppearanceProvider; let its parent determine width while its bounded rows establish initial height.',
  ],
  contentRules: [
    'Use the label to name the content and description to explain format or scope; do not depend on placeholder as the label.',
  ],
  controlBehavior: [
    'TextArea supports controlled or uncontrolled strings, vertical resizing, and three bounded initial row counts.',
  ],
  counterExamples: [
    {
      code: withinAppearanceProvider(
        'NumericTextAreaCounterexample',
        '<TextArea label="Tolerance" />',
      ),
      description:
        'A numeric value needs parsing, stepping, bounds, and numeric form serialization.',
      title: 'Do not use prose entry for numbers',
    },
  ],
  events: ['onChange reports the complete current multiline string after each accepted edit.'],
  examples: [
    {
      code: withinAppearanceProvider(
        'ReviewNotesExample',
        '<TextArea label="Review notes" name="notes" rows={5} />',
      ),
      description: 'Provide a deliberate initial writing area without arbitrary height injection.',
      title: 'Collect review notes',
    },
  ],
  exportName: 'TextArea',
  formBehavior: [
    'name and form use native multiline serialization and reset; native or custom validation uses the same support track.',
  ],
  importPath: '.',
  inappropriateUses: [
    'the value is one short line, numeric, a search query, or rich Markdown editing',
  ],
  keyboardBehavior: [
    'Native multiline editing, selection, composition, and newline behavior remain intact.',
  ],
  kind: 'component',
  labeling: [
    'label is required and remains visible; description, error, required, and pending relationships are automatic.',
  ],
  name: 'TextArea',
  parts: [
    'TextArea owns a label, resizable multiline shell, native textarea, and stable support track.',
  ],
  preferredAlternatives: [
    'Use TextField for one line, NumberField for numbers, and the later Markdown editor for structured Markdown authoring.',
  ],
  preferredCompositions: [
    'Place related prose and metadata fields in FieldGroup or a named FormSection.',
  ],
  purpose: 'TextArea collects multiline plain text with bounded initial sizing.',
  relatedExports: ['AppearanceProvider', 'FieldGroup', 'FormSection', 'NumberField', 'TextField'],
  states: [
    'Controlled, uncontrolled, required, invalid, read-only, disabled, and pending states preserve the textarea shell.',
  ],
  summary: 'Collect multiline plain text in a bounded native textarea.',
  validation: [
    'Native length, required, custom validate, and externally owned invalidity appear beneath rather than moving the textarea.',
  ],
} satisfies ComponentContract;

export const numberFieldContract = {
  ...commonFieldGuidance,
  accessibility: [
    'NumberField exposes a localized text input with number-field role description and labeled decrement and increment commands.',
  ],
  appropriateUses: [
    'a user enters a numeric value that needs locale formatting, stepping, bounds, units, currency, or percentages',
  ],
  composition: [
    'Render NumberField inside AppearanceProvider and set locale explicitly to the server and application locale.',
  ],
  contentRules: [
    'Use formatOptions for numeric presentation and a description for units or constraints that are not already visible in the formatted value.',
  ],
  controlBehavior: [
    'NumberField privately owns localized parsing and incomplete text; plain decimal formatting retains supplied finite value and step precision unless formatOptions overrides it, and onChange reports committed numbers after blur, Enter, or stepping.',
  ],
  counterExamples: [
    {
      code: withinAppearanceProvider(
        'NumericTextCounterexample',
        '<TextField label="Tolerance" />',
      ),
      description:
        'Plain text does not own numeric parsing, localized display, bounds, or stepping.',
      title: 'Do not model numeric values as text',
    },
  ],
  events: [
    'onChange reports a committed number, including NaN for an empty commit; it is not a per-keystroke text callback.',
  ],
  examples: [
    {
      code: withinAppearanceProvider(
        'ToleranceNumberExample',
        '<NumberField label="Tolerance" locale="en-US" defaultValue={0.0025} minValue={0} step={0.0005} />',
      ),
      description: 'Keep formatted text private while exposing a committed numeric value.',
      title: 'Set a bounded tolerance',
    },
  ],
  exportName: 'NumberField',
  formBehavior: [
    'name serializes one raw number through a hidden control; form also associates the visible input so external reset restores defaultValue.',
  ],
  importPath: '.',
  inappropriateUses: [
    'the value is an identifier, free text, phone number, postal code, or other digit-shaped text without arithmetic meaning',
  ],
  keyboardBehavior: [
    'Arrow Up and Down step, Home and End reach bounds, Enter commits, and localized text editing remains available; focused wheel stepping is opt-in.',
  ],
  kind: 'component',
  labeling: [
    'label is required; step commands combine localized increase or decrease text with the field label.',
  ],
  name: 'NumberField',
  parts: [
    'NumberField owns a label, decrement command, localized text input, increment command, raw form value, and stable support track.',
  ],
  preferredAlternatives: [
    'Use TextField for digit-shaped identifiers and Slider only when approximate visual adjustment matters more than exact entry.',
  ],
  preferredCompositions: [
    'Place adjacent numeric peers in FieldGroup so their equal control dimensions remain visible across validation states.',
  ],
  purpose: 'NumberField collects a locale-aware numeric value with bounds and stepping.',
  relatedExports: ['AppearanceProvider', 'FieldGroup', 'FormSection', 'TextField'],
  states: [
    'Controlled, uncontrolled, required, invalid, read-only, disabled, pending, empty, and partial text states preserve numeric ownership.',
  ],
  summary: 'Collect and step a locale-aware numeric value without leaking parser state.',
  validation: [
    'commitBehavior chooses snapping or retained range and step invalidity; validationBehavior independently chooses native blocking or ARIA reporting.',
  ],
} satisfies ComponentContract;

export const searchFieldContract = {
  ...commonFieldGuidance,
  accessibility: [
    'SearchField renders a native search input and a localized clear command only while an editable query is present.',
  ],
  appropriateUses: [
    'a user enters, submits, and may quickly clear a query that filters or searches content',
  ],
  composition: [
    'Render SearchField inside AppearanceProvider and place it near the collection or result region it searches.',
  ],
  contentRules: [
    'Name the searched domain in the label and provide clearLabel in the application locale; placeholder is optional context only.',
  ],
  controlBehavior: [
    'SearchField owns controlled or uncontrolled query text, Enter submission, Escape or clear-command clearing, and read-only pending state.',
  ],
  counterExamples: [
    {
      code: withinAppearanceProvider(
        'StoredSearchCounterexample',
        '<SearchField label="Run name" clearLabel="Clear" />',
      ),
      description:
        'A stored text value is not a query and does not need clear or submit semantics.',
      title: 'Do not use search semantics for ordinary text',
    },
  ],
  events: [
    'onChange reports query edits, onSubmit reports Enter submission, and onClear reports an explicit or Escape clear action.',
  ],
  examples: [
    {
      code: withinAppearanceProvider(
        'SearchRunsExample',
        '<SearchField label="Search runs" clearLabel="Clear query" name="query" />',
      ),
      description: 'Expose a recognizable query input with one localized clear command.',
      title: 'Search runs',
    },
  ],
  exportName: 'SearchField',
  formBehavior: [
    'name and form use native search-string serialization and reset while Enter also invokes onSubmit.',
  ],
  importPath: '.',
  inappropriateUses: [
    'the text is stored as ordinary form data without search, filter, submit, or clear meaning',
  ],
  keyboardBehavior: [
    'Native text editing remains intact; Enter submits the query and Escape clears it when editable and nonempty.',
  ],
  kind: 'component',
  labeling: [
    'label is the required visible input name; clearLabel is the required accessible name for the icon-only clear command.',
  ],
  name: 'SearchField',
  parts: [
    'SearchField owns a label, search glyph, native search input, conditional clear command, and stable support track.',
  ],
  preferredAlternatives: [
    'Use TextField for ordinary stored text and a later filter composition for multiple structured filter dimensions.',
  ],
  preferredCompositions: [
    'Pair SearchField with the collection region it affects; use FormSection only when search is part of a larger form workflow.',
  ],
  purpose: 'SearchField collects, submits, and clears a search query with native semantics.',
  relatedExports: ['AppearanceProvider', 'FormSection', 'TextField'],
  states: [
    'Empty, nonempty, controlled, uncontrolled, required, invalid, read-only, disabled, and pending states preserve one control size.',
  ],
  summary: 'Collect, submit, and clear a query through native search semantics.',
  validation: [
    'Required, pattern, length, custom validate, and external invalidity share the stable error track when a query is validated.',
  ],
} satisfies ComponentContract;

export const fieldGroupContract = {
  ...commonFieldGuidance,
  accentBehavior: [
    'The fieldset surface stays neutral and establishes subtle-surface accent roles for descendant fields, which retain ownership of their own hover, focus, validation, and pending states.',
  ],
  appearance: [
    'FieldGroup uses one compact rounded subtle fieldset surface with a visible legend, optional description, bounded padding, and equal responsive field columns.',
  ],
  accessibility: [
    'FieldGroup renders a native fieldset whose visible legend names the related controls and whose description is linked to the group.',
  ],
  appropriateUses: [
    'multiple fields form one meaningful input set that should be announced together',
  ],
  composition: [
    'Render FieldGroup inside AppearanceProvider, place fields directly within it, and choose one or responsive equal columns; do not use it as an arbitrary surface.',
  ],
  contentRules: [
    'Use a concise legend that names the relationship and an optional description that applies to every child field.',
  ],
  controlBehavior: [
    'FieldGroup owns group naming, disabled propagation, equal column layout, aligned peer label and control rows, and child spacing but no child values or events.',
  ],
  directionality: [
    'Logical fieldset padding, column gaps, and descendant order follow the inherited writing direction without changing DOM reading order.',
  ],
  counterExamples: [
    {
      code: withinAppearanceProvider(
        'ContentFieldGroupCounterexample',
        '<FieldGroup legend="Layout"><p>Explanation only</p></FieldGroup>',
      ),
      description: 'Non-form prose does not form a related native control group.',
      title: 'Do not use a field group as a surface',
    },
  ],
  events: [
    'FieldGroup emits no aggregate value or change event; each child field retains its own ownership.',
  ],
  examples: [
    {
      code: withinAppearanceProvider(
        'BoundaryFieldGroupExample',
        '<FieldGroup legend="Boundary inputs" columns="responsive">\n  <TextField label="Solver" />\n  <NumberField label="Tolerance" locale="en-US" />\n</FieldGroup>',
      ),
      description:
        'Keep related peer controls equally sized while preserving their distinct value semantics.',
      title: 'Group boundary inputs',
    },
  ],
  exportName: 'FieldGroup',
  formBehavior: [
    'isDisabled uses native fieldset propagation and an internal context so library and custom Field children receive disabled state; child names, validation, serialization, and reset remain owned by each field.',
  ],
  forcedColorBehavior: [
    'Forced-color mode maps the fieldset surface and boundary to system Canvas and CanvasText while descendants retain their own system-color state treatment.',
  ],
  importPath: '.',
  inappropriateUses: [
    'content is not a related control set, needs only visual containment, or represents a larger form workflow region',
  ],
  keyboardBehavior: [
    'FieldGroup adds no roving focus or arrow model; child fields remain in normal document tab order.',
  ],
  kind: 'composition',
  labeling: [
    'legend is required and visible; description is linked to the native fieldset without consumer-authored ids.',
  ],
  localization: [
    'Supply the visible legend and optional group description in the application locale and allow both to wrap without disturbing descendant control alignment.',
  ],
  name: 'FieldGroup',
  parts: [
    'FieldGroup owns a legend, optional group description, and one bounded field-layout region.',
  ],
  preferredAlternatives: [
    'Use FormSection for a larger named workflow and Surface for unrelated visual containment.',
  ],
  preferredCompositions: [
    'Nest FieldGroup in FormSection when a workflow section contains one or more semantically related control sets.',
  ],
  reducedMotionBehavior: [
    'FieldGroup adds no motion of its own; descendant controls retain their reduced-motion behavior.',
  ],
  responsiveBehavior: [
    'Responsive equal columns collapse through a content-owned minimum; peer fields share label and control rows when adjacent and return to ordinary one-column rhythm when stacked.',
  ],
  purpose: 'FieldGroup names and lays out one related set of form fields.',
  relatedExports: [
    'AppearanceProvider',
    'Field',
    'FormSection',
    'NumberField',
    'SearchField',
    'TextArea',
    'TextField',
  ],
  states: [
    'One-column and responsive equal-column layouts preserve child control dimensions; responsive peers keep controls aligned when a label wraps, and disabled propagates to native and library-owned custom fields.',
  ],
  summary: 'Name and arrange one related native fieldset without generic layout escape hatches.',
  validation: [
    'The group does not invent aggregate invalidity; child fields expose their own errors while the group description remains stable.',
  ],
} satisfies ComponentContract;

export const formSectionContract = {
  ...commonFieldGuidance,
  accentBehavior: [
    'FormSection adds no accent treatment of its own; descendant fields, groups, and actions retain their role-local accent behavior.',
  ],
  appearance: [
    'FormSection uses a visible heading, optional muted description, and owned vertical rhythm without adding a surface, border, or divider.',
  ],
  accessibility: [
    'FormSection renders a section labeled by a visible heading at an explicit document level.',
  ],
  appropriateUses: [
    'a larger form workflow needs a named region containing fields, groups, or supporting form actions',
  ],
  composition: [
    'Render FormSection inside AppearanceProvider and compose FieldGroup or individual semantic fields as children; use Section instead when the region is not specifically form structure.',
  ],
  contentRules: [
    'Use a task-oriented title and optional section-wide description; keep per-field instructions on the fields they describe.',
  ],
  controlBehavior: [
    'FormSection owns semantic heading and spaced vertical region structure but no form state, submission, or aggregate validation.',
  ],
  directionality: [
    'The section preserves logical document order and inherited writing direction without repositioning its heading, description, or children.',
  ],
  counterExamples: [
    {
      code: withinAppearanceProvider(
        'DisplayFormSectionCounterexample',
        '<FormSection title="Card"><p>Read-only metrics</p></FormSection>',
      ),
      description:
        'Read-only content needs ordinary Section or Surface semantics rather than form-specific organization.',
      title: 'Do not use form structure for display content',
    },
  ],
  events: ['FormSection emits no events and does not intercept child field or form events.'],
  examples: [
    {
      code: withinAppearanceProvider(
        'SolverFormSectionExample',
        '<FormSection title="Solver setup" description="Configure the run inputs.">\n  <FieldGroup legend="Boundary inputs">\n    <TextField label="Solver" />\n  </FieldGroup>\n</FormSection>',
      ),
      description: 'Name a form workflow while preserving the nested fieldset relationship.',
      title: 'Organize solver setup',
    },
  ],
  exportName: 'FormSection',
  formBehavior: [
    'FormSection does not render a form element or own submission; place it inside the application’s native form boundary.',
  ],
  forcedColorBehavior: [
    'FormSection paints no custom boundary or surface in forced-color mode; its semantic heading and content rhythm remain intact while children own their state treatment.',
  ],
  importPath: '.',
  inappropriateUses: [
    'the region is read-only content, only one field, or merely needs a visual surface',
  ],
  keyboardBehavior: [
    'FormSection adds no keyboard interaction; children remain in document order.',
  ],
  kind: 'composition',
  labeling: [
    'title is required and labels the region; headingLevel preserves the surrounding document hierarchy.',
  ],
  localization: [
    'Supply the title and optional section description in the application locale and allow them to wrap within the section width.',
  ],
  name: 'FormSection',
  parts: [
    'FormSection owns a visible heading, optional description, and form-specific content region.',
  ],
  preferredAlternatives: [
    'Use FieldGroup for one related fieldset, Section for general named content, and Surface for unnamed containment.',
  ],
  preferredCompositions: [
    'Use FormSection around one or more FieldGroups when a form has distinct workflow stages.',
  ],
  reducedMotionBehavior: ['FormSection adds no motion of its own.'],
  responsiveBehavior: [
    'FormSection fills its bounded parent and preserves its vertical heading, description, and child rhythm as content wraps or narrows.',
  ],
  purpose: 'FormSection gives a larger form workflow a visible semantic region name.',
  relatedExports: [
    'AppearanceProvider',
    'Field',
    'FieldGroup',
    'NumberField',
    'SearchField',
    'Section',
    'TextArea',
    'TextField',
  ],
  states: [
    'Heading levels one through six preserve document hierarchy; content reflows without adding compact divider lines.',
  ],
  summary: 'Organize a larger form workflow under a visible semantic heading.',
  validation: [
    'FormSection does not aggregate child validity or move child validation messages into a section-level summary.',
  ],
} satisfies ComponentContract;
