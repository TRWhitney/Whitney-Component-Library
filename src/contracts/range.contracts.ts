import type {ComponentContract} from './component-contract.js';

const commonRangeGuidance = {
  accentBehavior: [
    'Labels, values, endpoints, and the empty track stay neutral. The measured fill, thumbs, hover, and focus use accent colors. Invalid state uses danger colors.',
  ],
  appearance: [
    'Range controls use a compact label and value header, formatted endpoints, a narrow track, and circular thumbs instead of a field box.',
  ],
  directionality: [
    'Horizontal minimum and maximum positions follow inherited writing direction and ArrowLeft or ArrowRight follow locale direction; vertical values always increase from bottom to top.',
  ],
  forcedColorBehavior: [
    'Forced-color mode maps the track, measured fill, thumbs, focus, and invalid state to system colors without moving them.',
  ],
  localization: [
    'locale and formatOptions format the current value, thumb value text, and endpoints consistently; supply localized visible labels, descriptions, errors, and range thumb labels.',
  ],
  reducedMotionBehavior: [
    'Direct thumb position never animates; reduced motion also removes the remaining thumb hover and focus transitions without removing value or focus structure.',
  ],
  responsiveBehavior: [
    'Horizontal controls fill their parent and keep endpoints and thumbs operable on narrow screens. Vertical controls use a preset width and a twelve-rem minimum track height.',
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

export const sliderContract = {
  ...commonRangeGuidance,
  accessibility: [
    'Slider exposes one labeled native range input with generated description and error relationships, formatted aria-valuetext, domain bounds, orientation, invalidity, read-only state, and disabled state.',
  ],
  appropriateUses: [
    'one approximate value is adjusted and its position within a finite range helps the user choose',
  ],
  composition: [
    'Render Slider inside AppearanceProvider; provide one finite minValue, maxValue, step, locale, and optional shared number format rather than rebuilding its label, output, endpoints, track, or thumb.',
  ],
  contentRules: [
    'Use a concise visible label and description that explains the effect of adjustment; choose formatOptions that express the unit without repeating it in every surrounding label.',
  ],
  controlBehavior: [
    'Finite minValue, maxValue, and step define the numeric range. The value may be controlled or uncontrolled. Read-only keeps focus but rejects changes, while disabled prevents operation.',
  ],
  counterExamples: [
    {
      code: insideProvider(
        'ExactToleranceCounterexample',
        '<Slider label="Tolerance" locale="en-US" minValue={0} maxValue={1} step={0.001} />',
      ),
      description: 'A precise engineering tolerance needs direct numeric entry and editing.',
      title: 'Do not use approximate adjustment for exact entry',
    },
  ],
  events: [
    'onChange reports each accepted stepped value; onChangeEnd reports the final value when keyboard, pointer, or touch adjustment ends.',
  ],
  examples: [
    {
      code: insideProvider(
        'ConfidenceThreshold',
        '<Slider defaultValue={0.4} formatOptions={{style: \'percent\'}} label="Confidence" locale="en-US" minValue={0} maxValue={1} step={0.05} />',
      ),
      description: 'Adjust an approximate threshold and display it as a percentage.',
      title: 'Set a confidence threshold',
    },
  ],
  exportName: 'Slider',
  formBehavior: [
    'name and form serialize the raw numeric value through one hidden native range input; native reset restores defaultValue while visible formatting remains presentational.',
  ],
  importPath: '.',
  inappropriateUses: [
    'the value must be entered exactly, two bounds define an interval, values are discrete named choices, or the control only displays progress',
  ],
  keyboardBehavior: [
    'Arrow keys move by step, PageUp and PageDown move by a larger domain-relative step, Home and End reach the endpoints, and horizontal arrow direction follows the locale.',
  ],
  kind: 'component',
  labeling: [
    'label is always visible; the current formatted output and endpoints remain visible while the generated range input receives description, error, and formatted value relationships.',
  ],
  name: 'Slider',
  parts: [
    'Slider includes a header, visible label, formatted output, endpoint scale, track, measured fill, thumb, hidden native range input, and fixed support area.',
  ],
  preferredAlternatives: [
    'Use NumberField for exact numeric entry, RangeSlider for a lower and upper interval, a finite choice control for named values, and ProgressBar or Meter for display-only feedback.',
  ],
  preferredCompositions: [
    'Place related Slider and NumberField peers in FieldGroup or FormSection.',
  ],
  purpose: 'Slider adjusts an approximate numeric value within a finite range.',
  relatedExports: ['AppearanceProvider', 'FieldGroup', 'FormSection', 'NumberField', 'RangeSlider'],
  states: [
    'Controlled, uncontrolled, horizontal, vertical, focused, dragging, read-only, disabled, and invalid states keep the same scale and formatted output.',
  ],
  summary: 'Adjust an approximate numeric value on a formatted scale.',
  validation: [
    'The component rejects non-finite, reversed, unreachable, off-step, or out-of-bounds ranges and values. Use isInvalid with errorMessage for validation handled by the application.',
  ],
} satisfies ComponentContract;

export const rangeSliderContract = {
  ...commonRangeGuidance,
  accessibility: [
    'RangeSlider exposes one labeled group with two native range inputs, distinct thumb names, formatted value text, dynamically constrained bounds, and shared description or error relationships.',
  ],
  appropriateUses: [
    'a lower and upper numeric bound define one interval and relative position within the complete domain helps the user adjust it',
  ],
  composition: [
    'Render RangeSlider inside AppearanceProvider; provide one finite domain and exactly two localized thumbLabels, and let the component own both thumbs and their ordering.',
  ],
  contentRules: [
    'Name the interval with label and identify each bound with parallel thumbLabels such as Minimum and Maximum; describe the consequence of the retained interval rather than repeating its mechanics.',
  ],
  controlBehavior: [
    'A controlled or uncontrolled two-value tuple remains in ascending order; each thumb is clamped by its adjacent value so the bounds may meet but never cross, and paired caliper offsets keep close thumbs distinguishable.',
  ],
  counterExamples: [
    {
      code: insideProvider(
        'SingleThresholdCounterexample',
        '<RangeSlider label="Confidence" locale="en-US" minValue={0} maxValue={1} step={0.05} thumbLabels={[\'Lower\', \'Upper\']} />',
      ),
      description: 'One threshold has no second bound and needs only one operable thumb.',
      title: 'Do not invent an interval for one value',
    },
  ],
  events: [
    'onChange reports an ordered two-number tuple for each accepted adjustment; onChangeEnd reports the final tuple after keyboard, pointer, or touch adjustment ends.',
  ],
  examples: [
    {
      code: insideProvider(
        'ReviewWindow',
        '<RangeSlider defaultValue={[20, 80]} label="Review window" locale="en-US" minValue={0} maxValue={100} step={5} thumbLabels={[\'Window start\', \'Window end\']} />',
      ),
      description: 'Adjust both bounds without allowing their semantic order to reverse.',
      title: 'Choose a review window',
    },
  ],
  exportName: 'RangeSlider',
  formBehavior: [
    'names supplies two optional field names for the two hidden native range inputs and form associates both externally; reset restores the complete default tuple.',
  ],
  importPath: '.',
  inappropriateUses: [
    'only one value is chosen, either bound requires exact typed entry, endpoints are named categories, or an interval is displayed without user adjustment',
  ],
  keyboardBehavior: [
    'Each thumb is reached separately by Tab; Arrow, PageUp, PageDown, Home, and End adjust only the focused bound within the domain and adjacent-thumb limit.',
  ],
  kind: 'component',
  labeling: [
    'label names the complete interval and thumbLabels gives each thumb a distinct accessible name; description and error copy are generated once and referenced by both range inputs.',
  ],
  name: 'RangeSlider',
  parts: [
    'RangeSlider includes a header, formatted range output, endpoint scale, track, interval fill, two offset thumbs, two hidden native range inputs, and one fixed support area.',
  ],
  preferredAlternatives: [
    'Use Slider for one approximate value, two NumberField controls for exact bounds, named choice controls for categorical endpoints, and Meter for display-only intervals.',
  ],
  preferredCompositions: [
    'Place RangeSlider with related filters or numeric constraints in FieldGroup or FormSection.',
  ],
  purpose: 'RangeSlider adjusts an ordered numeric interval within a finite range.',
  relatedExports: ['AppearanceProvider', 'FieldGroup', 'FormSection', 'NumberField', 'Slider'],
  states: [
    'Both bounds remain separately operable in controlled, uncontrolled, separated, adjacent, equal, horizontal, vertical, focused, dragging, read-only, disabled, and invalid states.',
  ],
  summary: 'Adjust an ordered numeric interval with two distinct non-crossing thumbs.',
  validation: [
    'The component rejects malformed tuples, descending values, non-finite or unreachable domains, and off-step or out-of-bounds values; use isInvalid with errorMessage for external interval rules.',
  ],
} satisfies ComponentContract;
