import type {ComponentContract} from './component-contract.js';

const choiceAccentBehavior =
  'Labels stay neutral. Selection indicators, focus outlines, and the segmented rail use the exact accent or a more saturated version of the same hue.';
const invalidChoiceAccentBehavior = [
  `${choiceAccentBehavior} Invalid controls use a thin danger outline that thickens over a danger surface on enabled hover.`,
];

const commonChoiceGuidance = {
  accentBehavior: [choiceAccentBehavior],
  directionality: [
    'Indicators, option copy, switch movement, and segmented rail placement follow inherited writing direction without changing option order.',
  ],
  forcedColorBehavior: [
    'Forced-color mode maps boundaries, selected indicators, focus outlines, switch state, and the segmented rail to system colors without hiding native inputs.',
  ],
  localization: [
    'Supply labels, descriptions, errors, and option text in the application locale and allow them to wrap without truncation.',
  ],
  reducedMotionBehavior: [
    'Reduced motion removes indicator, switch-thumb, hover, and segmented-rail transitions while retaining the final state.',
  ],
  responsiveBehavior: [
    'Choice rows fill their parent and option text wraps. Segmented options stay equal when their labels wrap on narrow screens.',
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
  {label: 'Balanced', value: 'balanced'},
  {label: 'Fast', value: 'fast'},
]}`;

const resultLayers = `options={[
  {label: 'Thermal', value: 'thermal'},
  {label: 'Pressure', value: 'pressure'},
  {label: 'Velocity', value: 'velocity'},
]}`;

const verboseModes = `options={[
  {label: 'Conservative with maximum precision', value: 'conservative'},
  {label: 'Balanced speed and precision', value: 'balanced'},
  {label: 'Fast with approximate results', value: 'fast'},
]}`;

export const checkboxContract = {
  ...commonChoiceGuidance,
  accentBehavior: invalidChoiceAccentBehavior,
  accessibility: [
    'Checkbox renders one native checkbox with a persistent visible label and generated description, invalid, required, disabled, and read-only relationships.',
  ],
  appearance: [
    'Checkbox uses a compact rounded square indicator beside neutral label text; selected and indeterminate marks do not change row geometry.',
  ],
  appropriateUses: [
    'one independent option, acknowledgement, or form value can be selected, cleared, or partially represented',
  ],
  composition: [
    'Render Checkbox inside AppearanceProvider; use CheckboxGroup when several values share one question and group-level validation.',
  ],
  contentRules: [
    'Use a concise affirmative label that makes both checked and unchecked meaning clear; reserve description for durable consequences or scope.',
  ],
  controlBehavior: [
    'Checkbox supports controlled or uncontrolled boolean selection. isIndeterminate changes its visual and accessible state but not the submitted checked value.',
  ],
  counterExamples: [
    {
      code: insideProvider(
        'ImmediateSettingCounterexample',
        '<Checkbox label="Enable automatic synchronization" />',
      ),
      description: 'An immediately applied on/off setting is better communicated as a switch.',
      title: 'Do not use a checkbox for an immediate setting',
    },
  ],
  events: ['onChange reports the complete selected boolean after each accepted interaction.'],
  examples: [
    {
      code: insideProvider(
        'IncludeMeshChoice',
        '<Checkbox defaultSelected label="Include mesh" name="features" value="mesh" />',
      ),
      description: 'Submit one optional result feature.',
      title: 'Choose an optional result feature',
    },
  ],
  exportName: 'Checkbox',
  formBehavior: [
    'name, value, and form use native checkbox serialization; only a checked control submits its value, and native form reset restores defaultSelected.',
  ],
  importPath: '.',
  inappropriateUses: [
    'the setting applies immediately, choices are mutually exclusive, or several related values need one group label',
  ],
  keyboardBehavior: ['Space toggles the focused checkbox; Tab moves through enabled checkboxes.'],
  kind: 'component',
  labeling: [
    'label is always visible; description and error text are referenced without consumer-authored ids.',
  ],
  name: 'Checkbox',
  parts: ['Checkbox includes one indicator, visible label, and optional support area.'],
  preferredAlternatives: [
    'Use Switch for an immediately applied setting, CheckboxGroup for related multiple selection, RadioGroup or SegmentedControl for exclusive selection, and ToggleButton for a persistent action state.',
  ],
  preferredCompositions: ['Place independent Checkbox peers in FieldGroup or FormSection.'],
  purpose: 'Checkbox selects one independent optional value with native form behavior.',
  relatedExports: [
    'AppearanceProvider',
    'CheckboxGroup',
    'RadioGroup',
    'SegmentedControl',
    'Switch',
    'ToggleButton',
  ],
  states: [
    'Checked, unchecked, indeterminate, required, invalid, read-only, and disabled states do not change the control size.',
  ],
  summary: 'Select one independent optional or indeterminate value.',
  validation: [
    'Use isRequired for required acknowledgement and isInvalid with errorMessage for external invalidity; validationBehavior chooses native or ARIA validation presentation.',
  ],
} satisfies ComponentContract;

export const checkboxGroupContract = {
  ...commonChoiceGuidance,
  accentBehavior: invalidChoiceAccentBehavior,
  accessibility: [
    'CheckboxGroup exposes one named group and native checkbox options with generated group description, error, required, disabled, and read-only relationships.',
  ],
  appearance: ['CheckboxGroup aligns option rows and indicators in one vertical list.'],
  appropriateUses: ['a user may choose zero, one, or several related values under one question'],
  composition: [
    'Render CheckboxGroup inside AppearanceProvider and supply durable option keys. Each option description must describe that value.',
  ],
  contentRules: [
    'Use a concise group label and parallel option labels. Option keys must work for state and form submission.',
  ],
  controlBehavior: [
    'CheckboxGroup supports controlled or uncontrolled string-array selection. Each option remains an independent checkbox tab stop.',
  ],
  counterExamples: [
    {
      code: insideProvider(
        'ExclusiveLayersCounterexample',
        `<CheckboxGroup label="Quality" ${modes} />`,
      ),
      description: 'A single mutually exclusive answer requires a radio group.',
      title: 'Do not use multiple selection for one answer',
    },
  ],
  events: ['onChange reports the complete selected string array after each accepted change.'],
  examples: [
    {
      code: insideProvider(
        'ResultLayerChoices',
        `<CheckboxGroup defaultValue={['thermal']} label="Result layers" name="layers" ${resultLayers} />`,
      ),
      description: 'Choose any combination of result layers.',
      title: 'Choose multiple result layers',
    },
  ],
  exportName: 'CheckboxGroup',
  formBehavior: [
    'name and form serialize one entry per selected option in option order; reset restores defaultValue and disabled options do not submit new selections.',
  ],
  importPath: '.',
  inappropriateUses: [
    'exactly one answer is allowed or one independent checkbox needs no group question',
  ],
  keyboardBehavior: [
    'Tab moves among enabled checkboxes and Space toggles the focused option without changing any other selection.',
  ],
  kind: 'component',
  labeling: [
    'label names the group; each option has visible label text and may have a separately referenced description.',
  ],
  name: 'CheckboxGroup',
  parts: [
    'CheckboxGroup includes a group label, option list, checkbox indicators, and support area.',
  ],
  preferredAlternatives: [
    'Use Checkbox for one independent value and RadioGroup or SegmentedControl for mutually exclusive selection.',
  ],
  preferredCompositions: [
    'Place CheckboxGroup inside FormSection for a larger configuration flow.',
  ],
  purpose: 'CheckboxGroup selects several related values under one accessible question.',
  relatedExports: ['AppearanceProvider', 'Checkbox', 'RadioGroup', 'SegmentedControl'],
  states: [
    'Empty, partial, and complete selection combine with required, invalid, read-only, group-disabled, and option-disabled states.',
  ],
  summary: 'Select zero or more related values under one question.',
  validation: [
    'isRequired requires at least one selected option. isInvalid and errorMessage report group errors supplied by the application.',
  ],
} satisfies ComponentContract;

export const radioGroupContract = {
  ...commonChoiceGuidance,
  accentBehavior: invalidChoiceAccentBehavior,
  accessibility: [
    'RadioGroup exposes one named native radio group with one tab stop and generated group description, error, required, disabled, and read-only relationships.',
  ],
  appearance: [
    'RadioGroup uses aligned circular indicators and vertical option rows with neutral labels.',
  ],
  appropriateUses: ['a user must choose at most or exactly one answer from a visible set'],
  composition: [
    'Render RadioGroup inside AppearanceProvider and supply durable option keys. Keep every mutually exclusive option in the same group.',
  ],
  contentRules: [
    'Use parallel option labels and durable submitted keys. Descriptions may explain each consequence but must not replace option names.',
  ],
  controlBehavior: [
    'RadioGroup supports controlled or uncontrolled string selection. A controlled value is one option key or null. Focus moves among the options, not the group container.',
  ],
  counterExamples: [
    {
      code: insideProvider(
        'DenseModeCounterexample',
        `<RadioGroup label="Display density" ${modes} />`,
      ),
      description:
        'A small compact set that benefits from adjacent comparison should use segmented selection.',
      title: 'Do not spend vertical space on a compact mode switcher',
    },
  ],
  events: ['onChange reports the newly selected option value.'],
  examples: [
    {
      code: insideProvider(
        'RunModeChoice',
        `<RadioGroup defaultValue="balanced" label="Run mode" name="mode" ${modes} />`,
      ),
      description: 'Expose one visible mutually exclusive run configuration.',
      title: 'Choose one run mode',
    },
  ],
  exportName: 'RadioGroup',
  formBehavior: [
    'name and form serialize the selected native radio value; reset restores defaultValue.',
  ],
  importPath: '.',
  inappropriateUses: [
    'several options may be combined, one immediate binary setting is changing, or the set is compact enough for segmented comparison',
  ],
  keyboardBehavior: [
    'Tab enters the selected or first enabled radio; arrow keys move focus and selection through enabled options according to writing direction.',
  ],
  kind: 'component',
  labeling: [
    'label names the radiogroup; every radio has visible option text and may reference one option description.',
  ],
  name: 'RadioGroup',
  parts: ['RadioGroup includes a group label, option list, indicators, and support area.'],
  preferredAlternatives: [
    'Use CheckboxGroup for multiple selection, Switch for an immediate setting, and SegmentedControl for a few compact modes.',
  ],
  preferredCompositions: ['Place RadioGroup inside FormSection for a larger configuration flow.'],
  purpose: 'RadioGroup selects one visible mutually exclusive value with native radio behavior.',
  relatedExports: ['AppearanceProvider', 'CheckboxGroup', 'SegmentedControl', 'Switch'],
  states: [
    'Unselected and selected values combine with required, invalid, read-only, group-disabled, and option-disabled states.',
  ],
  summary: 'Select one value from a visible mutually exclusive set.',
  validation: [
    'Use isRequired when an empty answer is invalid. Use isInvalid with errorMessage for errors supplied by the application.',
  ],
} satisfies ComponentContract;

export const switchContract = {
  ...commonChoiceGuidance,
  accessibility: [
    'Switch renders a native checkbox with switch semantics, a persistent visible label, and an automatically referenced description.',
  ],
  appearance: [
    'Switch uses a compact pill track and logical-direction thumb movement beside a neutral label without changing row geometry.',
  ],
  appropriateUses: ['a user turns one setting on or off and the change takes effect immediately'],
  composition: ['Render Switch inside AppearanceProvider and use the same label in both states.'],
  contentRules: [
    'Name the setting rather than the action; the on and off states must both make sense with the same persistent label.',
  ],
  controlBehavior: [
    'Switch supports controlled or uncontrolled boolean state; read-only keeps the value focusable and prevents change while disabled removes interaction.',
  ],
  counterExamples: [
    {
      code: insideProvider('ConsentSwitchCounterexample', '<Switch label="Accept final terms" />'),
      description: 'A required acknowledgement submitted with a form should use a checkbox.',
      title: 'Do not use a switch for acknowledgement',
    },
  ],
  events: ['onChange reports the complete on/off boolean after each accepted interaction.'],
  examples: [
    {
      code: insideProvider(
        'SynchronizationSetting',
        '<Switch defaultSelected label="Keep results synchronized" name="synchronized" value="yes" />',
      ),
      description: 'Change an immediately applied workspace setting.',
      title: 'Toggle synchronization',
    },
  ],
  exportName: 'Switch',
  formBehavior: [
    'name, value, and form use native checkbox serialization; only the on state submits and reset restores defaultSelected.',
  ],
  importPath: '.',
  inappropriateUses: [
    'the value is a required acknowledgement, an optional batch-form choice, or one answer among several',
  ],
  keyboardBehavior: ['Space toggles the focused switch; Tab moves to or from the enabled switch.'],
  kind: 'component',
  labeling: ['label is required and does not change with state. description may add context.'],
  name: 'Switch',
  parts: ['Switch includes one track, moving thumb, visible label, and optional description.'],
  preferredAlternatives: [
    'Use Checkbox for acknowledgement or deferred form choice and RadioGroup or SegmentedControl for exclusive modes.',
  ],
  preferredCompositions: ['Place related Switch peers in FieldGroup or FormSection.'],
  purpose: 'Switch changes one immediately applied binary setting.',
  relatedExports: ['AppearanceProvider', 'Checkbox', 'RadioGroup', 'SegmentedControl'],
  states: [
    'On, off, read-only, and disabled states remain visible without changing the control size.',
  ],
  summary: 'Turn one immediately applied setting on or off.',
  validation: [
    'Switch does not expose required or invalid state; use Checkbox when a binary value participates in acknowledgement validation.',
  ],
} satisfies ComponentContract;

export const segmentedControlContract = {
  ...commonChoiceGuidance,
  accessibility: [
    'SegmentedControl exposes one named native radio group with one tab stop, equivalent segment labels, and generated group support relationships.',
  ],
  appearance: [
    'SegmentedControl places equal adjacent segments on a neutral background. One accent rail moves below the selection. Labels stay neutral, and selection adds no fill or shadow.',
  ],
  appropriateUses: [
    'a user switches among two or more compact, visible, mutually exclusive views or modes',
  ],
  composition: [
    'Render SegmentedControl inside AppearanceProvider. Provide at least two options with durable keys and short labels that fit side by side.',
  ],
  contentRules: [
    'Use short parallel labels and durable keys. Put longer explanations in the group description.',
  ],
  controlBehavior: [
    'SegmentedControl supports controlled or uncontrolled exclusive string selection. A controlled value is one option key or null. Disabled options remain visible, and the rail follows the selection.',
  ],
  counterExamples: [
    {
      code: insideProvider(
        'VerboseSegmentsCounterexample',
        `<SegmentedControl label="Run mode" ${verboseModes} />`,
      ),
      description:
        'Use RadioGroup when labels or option consequences need substantial vertical explanation.',
      title: 'Do not compress verbose answers into segments',
    },
  ],
  events: [
    'onChange reports the newly selected segment value after accepted pointer or keyboard input.',
  ],
  examples: [
    {
      code: insideProvider(
        'DensitySegments',
        `<SegmentedControl defaultValue="balanced" label="Display density" name="density" ${modes} />`,
      ),
      description: 'Compare and switch among a few compact modes.',
      title: 'Choose display density',
    },
  ],
  exportName: 'SegmentedControl',
  formBehavior: [
    'name and form serialize the selected native radio value; reset restores defaultValue without losing the rail position.',
  ],
  importPath: '.',
  inappropriateUses: [
    'options can be combined, labels need long explanations, or the choices are loaded from an open or large collection',
  ],
  keyboardBehavior: [
    'Tab enters the selected or first enabled segment; arrow keys move focus and selection through enabled segments according to writing direction.',
  ],
  kind: 'component',
  labeling: [
    'label names the radiogroup and every segment has visible text; no accent-colored label carries selection alone.',
  ],
  name: 'SegmentedControl',
  parts: [
    'SegmentedControl includes one group label, equal segment row, moving rail, and support area.',
  ],
  preferredAlternatives: [
    'Use RadioGroup for verbose visible choices, CheckboxGroup for multiple selection, and later Select for a larger or open collection.',
  ],
  preferredCompositions: ['Place SegmentedControl near the content or mode it directly changes.'],
  purpose: 'SegmentedControl selects one compact mode through equal adjacent radio segments.',
  relatedExports: ['AppearanceProvider', 'CheckboxGroup', 'RadioGroup'],
  states: [
    'Selected, unselected, required, invalid, read-only, group-disabled, and option-disabled states keep segments equal.',
  ],
  summary: 'Switch among a few compact modes with a moving selection rail.',
  validation: [
    'Use isRequired when an empty selection is invalid. Use isInvalid with errorMessage for errors supplied by the application.',
  ],
} satisfies ComponentContract;
