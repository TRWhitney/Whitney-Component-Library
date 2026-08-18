import type {ComponentContract} from './component-contract.js';

const commonSelectionGuidance = {
  accentBehavior: [
    'Selected option labels remain neutral; a slim leading rail and focus structure use the saturated same-hue accent roles for the raised collection surface.',
  ],
  directionality: [
    'Control copy, chevrons, option padding, and the selected leading rail follow inherited writing direction; option order remains application-defined.',
  ],
  forcedColorBehavior: [
    'Forced-color mode maps control and overlay boundaries, focused options, and the selected rail to system colors without removing semantic option states.',
  ],
  localization: [
    'Supply localized labels, descriptions, errors, placeholders, option copy, emptyMessage, and loadingMessage; matching uses the active locale with case-insensitive base sensitivity.',
  ],
  reducedMotionBehavior: [
    'Reduced motion removes overlay, chevron, selected-rail, and loading transitions while retaining their settled state.',
  ],
  responsiveBehavior: [
    'The control fills its bounded parent; the anchored collection matches its trigger when space allows, stays inside the viewport, scrolls within available height, and wraps option copy at compact widths.',
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
    'one value must be chosen from a bounded collection and showing every option inline would consume unnecessary space',
  ],
  composition: [
    'Render Select inside AppearanceProvider; supply stable string values and localized empty/loading copy, and keep the selected option present while its value is active.',
  ],
  contentRules: [
    'Use a question-like visible label and concise parallel option labels; descriptions may clarify durable consequences but must not carry the only distinction between options.',
  ],
  controlBehavior: [
    'Select owns either controlled value plus onChange or uncontrolled defaultValue; null means no selection, and option values are stable keys independent of array identity or order.',
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
  events: ['onChange reports the accepted stable string value, or null after an external clear.'],
  examples: [
    {
      code: insideProvider(
        'BoundedRunMode',
        `<Select defaultValue="balanced" emptyMessage="No modes" label="Run mode" name="mode" ${modes} />`,
      ),
      description: 'Choose one bounded mode while preserving native form serialization.',
      title: 'Choose one run mode',
    },
  ],
  exportName: 'Select',
  formBehavior: [
    'name and form serialize the selected key through the hidden native control; native reset restores defaultValue, and required native validation prevents empty submission.',
  ],
  importPath: '.',
  inappropriateUses: [
    'users need to type to filter or query options, compare a small set visibly, select several values, or preserve a truly immutable value',
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
    'Select owns one field shell, trigger and value, chevron, support track, positioned popover, listbox, option copy, and selected rail.',
  ],
  preferredAlternatives: [
    'Use ComboBox for editable filtering or asynchronous query results, RadioGroup for a small visible exclusive set, and plain text or a summary surface for immutable values.',
  ],
  preferredCompositions: ['Place related Select controls in FieldGroup or FormSection.'],
  purpose: 'Select chooses one stable value from a bounded collapsible collection.',
  relatedExports: ['AppearanceProvider', 'ComboBox', 'FieldGroup', 'FormSection', 'RadioGroup'],
  states: [
    'Empty, selected, open, focused, required, invalid, disabled, loading, and option-disabled states remain distinct; Select is inherently non-editable and deliberately has no read-only prop.',
  ],
  summary: 'Choose one value from a bounded collapsible collection.',
  validation: [
    'Use isRequired and validationBehavior for native requirement, validate for value rules, and isInvalid with errorMessage for externally owned errors; loading is progress, not invalidity.',
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
    'Use a visible label that names the chosen value, a short input hint, parallel option labels, and explicit localized loading and empty messages.',
  ],
  controlBehavior: [
    'Selection and input text each have independent controlled or uncontrolled ownership; controlled value requires onChange, controlled inputValue requires onInputChange, and the two ownership channels cannot mix their respective default props.',
  ],
  counterExamples: [
    {
      code: insideProvider(
        'ShortModeListCounterexample',
        `<ComboBox emptyMessage="No modes" label="Run mode" ${modes} />`,
      ),
      description: 'A short bounded collection does not benefit from editable filtering.',
      title: 'Do not add autocomplete to a short bounded choice',
    },
  ],
  events: [
    'onInputChange reports each accepted query edit; onChange separately reports the committed stable option value or null.',
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
    'the collection is short and bounded, arbitrary custom text must be accepted as the value, several values may be selected, or all options need simultaneous comparison',
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
    'ComboBox owns one field shell, text input, suggestion trigger, support track, positioned popover, listbox, option copy, and selected rail over a private shared collection model.',
  ],
  preferredAlternatives: [
    'Use Select for a bounded collapsible list, RadioGroup for a small visible exclusive set, SearchField when submitting free text, and a later multi-select collection control for several values.',
  ],
  preferredCompositions: ['Place related ComboBox controls in FieldGroup or FormSection.'],
  purpose:
    'ComboBox filters and chooses one stable value from local, dynamic, or asynchronous options.',
  relatedExports: [
    'AppearanceProvider',
    'FieldGroup',
    'FormSection',
    'RadioGroup',
    'SearchField',
    'Select',
  ],
  states: [
    'Empty, editing, open, focused, selected, required, invalid, read-only, disabled, loading, and option-disabled states remain distinct; read-only preserves focus and text while rejecting edits and selection.',
  ],
  summary: 'Filter and choose one value from local, dynamic, or asynchronous options.',
  validation: [
    'Use isRequired and validationBehavior for committed-selection requirement, validate for selected-value rules, and isInvalid with errorMessage for external errors; asynchronous failure is supplied as an explicit error state rather than disguised as empty.',
  ],
} satisfies ComponentContract;
