import type {ComponentContract} from './component-contract.js';

const commonSelectionGuidance = {
  accentBehavior: [
    'Selected option labels stay neutral. A slim leading rail and focus outline use accent colors adjusted for the raised list background. Invalid fields retain their danger boundary and thicken it on enabled hover.',
  ],
  directionality: [
    'Control text, chevrons, option padding, and the selection rail follow inherited writing direction. The application sets option order.',
  ],
  forcedColorBehavior: [
    'Forced-color mode maps control and overlay borders, focused options, and the selection rail to system colors without hiding option states.',
  ],
  localization: [
    'Supply localized labels, descriptions, errors, placeholders, option copy, emptyMessage, and loadingMessage; matching uses the active locale with case-insensitive base sensitivity.',
  ],
  reducedMotionBehavior: [
    'Reduced motion removes overlay, chevron, selection-rail, and loading transitions. Their final states remain visible.',
  ],
  responsiveBehavior: [
    'The control fills its parent and inherits comfortable or compact density from AppearanceProvider. Compact option rows reduce padding while preserving wrapped descriptions; coarse pointers retain 44px minimum targets. The anchored list matches the trigger width, stays inside the viewport, and scrolls within the available height. Empty field support space is omitted unless reserveSupportSpace is true.',
  ],
  stylesheet: './styles.css',
} satisfies Pick<
  ComponentContract,
  | 'accentBehavior'
  | 'directionality'
  | 'forcedColorBehavior'
  | 'localization'
  | 'reducedMotionBehavior'
  | 'responsiveBehavior'
  | 'stylesheet'
>;

function insideProvider(name: string, body: string): string {
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

const modes = `options={[
  {label: 'Conservative', value: 'conservative'},
  {description: 'Balances precision and solve time.', label: 'Balanced', value: 'balanced'},
  {label: 'Fast', value: 'fast'},
]}`;

export const selectContract = {
  ...commonSelectionGuidance,
  accessibility: [
    'Select exposes a labeled button and single-select listbox with generated description, validation, required, disabled, loading, empty, and option-disabled relationships.',
  ],
  appearance: [
    'Select extends the neutral field shell with one compact chevron and a raised anchored collection; selection is carried by a slim leading rail rather than selected-label color.',
  ],
  appropriateUses: [
    'one value must be chosen from a finite list that would take too much space to show in full',
  ],
  composition: [
    'Render Select inside AppearanceProvider. Use durable string keys and localized empty and loading messages. Keep the selected option in the collection.',
  ],
  contentRules: [
    'Use a question-like visible label and concise parallel option labels; descriptions may clarify durable consequences but must not carry the only distinction between options.',
  ],
  controlBehavior: [
    'Use value with onChange for controlled selection or defaultValue for uncontrolled selection. null means no selection. Option keys must not depend on array identity or order.',
    'An opening pointer release does not select an option that moves beneath a stationary pointer. Clicking an option or deliberately dragging from the trigger selects it. Select works inside Popover without dismissing the containing settings panel.',
  ],
  counterExamples: [
    {
      code: insideProvider(
        'SearchableModesCounterexample',
        `<Select emptyMessage="No modes" label="Search a large mode catalog" ${modes} />`,
      ),
      description: 'A large or query-driven collection needs text filtering.',
      title: 'Do not hide a searchable collection behind Select',
    },
  ],
  events: ['onChange reports the selected string key, or null after an external clear.'],
  examples: [
    {
      code: insideProvider(
        'BoundedRunMode',
        `<Select defaultValue="balanced" emptyMessage="No modes" label="Run mode" name="mode" ${modes} />`,
      ),
      description: 'Choose one run mode and submit its key through the native form.',
      title: 'Choose one run mode',
    },
  ],
  exportName: 'Select',
  formBehavior: [
    'name and form serialize the selected key through the hidden native control; native reset restores defaultValue, and required native validation prevents empty submission.',
  ],
  importPath: '.',
  inappropriateUses: [
    'users need to filter options, compare a small set in full, select several values, or view an immutable value',
  ],
  keyboardBehavior: [
    'Enter or Space opens the collection, arrows move focus, locale-aware typeahead locates options, Enter commits, and Escape dismisses and restores focus to the trigger.',
  ],
  kind: 'component',
  labeling: [
    'label is always visible; description, errors, requirement, loading, and empty copy are generated without consumer-authored ids.',
  ],
  name: 'Select',
  parts: [
    'Select includes a field shell, trigger and value, chevron, support area, positioned popover, listbox, option text, and selection rail.',
  ],
  preferredAlternatives: [
    'Use ComboBox for editable filtering or asynchronous query results, RadioGroup for a small visible exclusive set, and plain text or a summary surface for immutable values.',
  ],
  preferredCompositions: ['Place related Select controls in FieldGroup or FormSection.'],
  purpose: 'Select chooses one value from a finite collapsible list.',
  relatedExports: ['AppearanceProvider', 'ComboBox', 'FieldGroup', 'FormSection', 'RadioGroup'],
  states: [
    'Empty, selected, open, focused, required, invalid, disabled, loading, and option-disabled states are visually distinct. Select is non-editable and has no read-only prop.',
  ],
  summary: 'Choose one value from a finite collapsible list.',
  validation: [
    'Use isRequired and validationBehavior for native requirements, validate for value rules, and isInvalid with errorMessage for errors supplied by the application. Loading does not imply an error.',
  ],
} satisfies ComponentContract;

export const comboBoxContract = {
  ...commonSelectionGuidance,
  accessibility: [
    'ComboBox exposes a labeled editable combobox, suggestion button, and single-select listbox with generated active-option, description, validation, read-only, loading, empty, and disabled relationships.',
  ],
  appearance: [
    'ComboBox extends the neutral field shell with an editable input and compact suggestion trigger; its raised collection uses the same neutral labels and slim selected rail as Select.',
  ],
  appropriateUses: [
    'one value is chosen from a collection that benefits from typing, locale-aware filtering, dynamic updates, or asynchronous query results',
  ],
  composition: [
    'Render ComboBox inside AppearanceProvider; use contains or startsWith for client filtering and manual when onInputChange drives a dynamic or asynchronous option list.',
  ],
  contentRules: [
    'Use a visible label that names the chosen value, a short input hint, parallel option labels, and localized loading and empty messages.',
  ],
  controlBehavior: [
    'Selection and input text may each be controlled or uncontrolled. Controlled value requires onChange, and controlled inputValue requires onInputChange. Do not pair either controlled prop with its default prop.',
  ],
  counterExamples: [
    {
      code: insideProvider(
        'ShortModeListCounterexample',
        `<ComboBox emptyMessage="No modes" label="Run mode" ${modes} />`,
      ),
      description: 'A short list does not benefit from editable filtering.',
      title: 'Do not add autocomplete to a short choice',
    },
  ],
  events: [
    'onInputChange reports each query edit. onChange reports the committed option key or null.',
  ],
  examples: [
    {
      code: insideProvider(
        'FilterRunModes',
        `<ComboBox emptyMessage="No matching modes" label="Find run mode" placeholder="Type a mode" ${modes} />`,
      ),
      description: 'Filter a moderately sized local collection with locale-aware matching.',
      title: 'Filter run modes',
    },
  ],
  exportName: 'ComboBox',
  formBehavior: [
    'name and form serialize only the committed option key; editing text alone does not invent a submitted value, native reset restores both defaultValue and defaultInputValue, and required validation needs a committed option.',
  ],
  importPath: '.',
  inappropriateUses: [
    'the list is short, custom text is a valid value, several values may be selected, or all options need to be visible at once',
  ],
  keyboardBehavior: [
    'Typing edits and filters, ArrowDown opens and moves through suggestions, Enter commits, Escape dismisses and restores the committed text, and Tab leaves the composite without trapping focus.',
  ],
  kind: 'component',
  labeling: [
    'label is always visible; placeholder is only a hint, and generated support, loading, empty, and active-option relationships require no consumer-authored ids.',
  ],
  name: 'ComboBox',
  parts: [
    'ComboBox includes a field shell, text input, suggestion trigger, support area, positioned popover, listbox, option text, and selection rail.',
  ],
  preferredAlternatives: [
    'Use Select for a finite collapsible list, RadioGroup for a small visible set, SearchField for submitted free text, and a future multi-select control for several values.',
  ],
  preferredCompositions: ['Place related ComboBox controls in FieldGroup or FormSection.'],
  purpose: 'ComboBox filters local, dynamic, or asynchronous options and chooses one value.',
  relatedExports: [
    'AppearanceProvider',
    'FieldGroup',
    'FormSection',
    'RadioGroup',
    'SearchField',
    'Select',
  ],
  states: [
    'Empty, editing, open, focused, selected, required, invalid, read-only, disabled, loading, and option-disabled states are visually distinct. Read-only keeps focus and text but rejects edits and selection.',
  ],
  summary: 'Filter and choose one value from local, dynamic, or asynchronous options.',
  validation: [
    'Use isRequired and validationBehavior to require a committed selection, validate for value rules, and isInvalid with errorMessage for application errors. Report asynchronous failure as an error, not an empty result.',
  ],
} satisfies ComponentContract;
