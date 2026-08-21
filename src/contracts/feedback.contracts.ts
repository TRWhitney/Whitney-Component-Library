import type {ComponentContract} from './component-contract.js';

const commonFeedbackGuidance = {
  directionality: [
    'Copy and logical edges follow inherited writing direction; numeric source values and consumer-provided wording are not reordered.',
  ],
  formBehavior: [
    'This display component is not a successful form control and does not serialize, validate, or respond to form reset.',
  ],
  keyboardBehavior: [
    'The component adds no tab stop or keyboard command; interactive recovery actions belong in adjacent action components.',
  ],
  localization: [
    'Supply localized labels, titles, descriptions, status copy, value labels, units, threshold labels, and completion meaning as applicable.',
  ],
  stylesheet: './styles.css',
  validation: [
    'Consumer data determines meaning; the component validates only representable numeric domains and threshold ordering where applicable.',
  ],
} satisfies Pick<
  ComponentContract,
  | 'directionality'
  | 'formBehavior'
  | 'keyboardBehavior'
  | 'localization'
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

export const statusIndicatorContract = {
  ...commonFeedbackGuidance,
  accentBehavior: [
    'Application accent is not a StatusIndicator tone and must never substitute for success, warning or in-progress, danger, or neutral status meaning.',
  ],
  accessibility: [
    'The visible label is the only announced content; tone glyphs are hidden from assistive technology and no duplicate accessible label is added.',
  ],
  appearance: [
    'One compact rounded indicator combines a tone-specific glyph, semantic surface, and readable label while preserving identical geometry across tones.',
  ],
  appropriateUses: [
    'one concise current state such as stable, solving, failed, or not started must remain visible beside the object it describes',
  ],
  composition: [
    'Render inside AppearanceProvider and place StatusIndicator beside the named object or inside a separately labeled region; keep its label short and complete.',
  ],
  contentRules: [
    'label names the actual state; choose success only for achieved outcomes, warning for review or in-progress work, danger for failure, and neutral when no semantic outcome applies.',
  ],
  controlBehavior: [
    'announcement defaults to off for static status, polite creates one atomic status live region, and assertive creates one atomic alert only for an interruption requiring immediate attention.',
  ],
  counterExamples: [
    {
      code: inProvider('AccentFailureBadgeCounterexample', '<Badge tone="accent">Failed</Badge>'),
      description:
        'An accent Badge communicates identity or category, not failure; use a danger StatusIndicator.',
      title: 'Do not encode failure with application accent',
    },
  ],
  events: [
    'StatusIndicator emits no event; consumers update label and tone together from one status source.',
  ],
  examples: [
    {
      code: inProvider(
        'RunningStatus',
        '<StatusIndicator announcement="polite" label="Solving" tone="warning" />',
      ),
      description: 'Announce one meaningful transition into an active solve state.',
      title: 'Announced running status',
    },
  ],
  exportName: 'StatusIndicator',
  forcedColorBehavior: [
    'Forced colors retain distinct glyph shapes and visible text when authored semantic colors map to system colors.',
  ],
  importPath: '.',
  inappropriateUses: [
    'metadata, a category tag, long explanatory feedback, numeric completion, a bounded measurement, or generic unlabeled activity',
  ],
  kind: 'component',
  labeling: [
    'label is visible and required; do not repeat the same status in an adjacent live region or aria-label.',
  ],
  name: 'StatusIndicator',
  parts: ['StatusIndicator owns one tone glyph and one visible text label.'],
  preferredAlternatives: [
    'Use Badge for static metadata, InlineAlert or AlertBanner for explanatory feedback, ProgressBar for operation completion, Meter for a bounded quantity, or Spinner for generic busy state.',
  ],
  preferredCompositions: [
    'Compose a StatusIndicator at one endpoint of a workflow header while keeping any relationship Route structurally and semantically separate.',
  ],
  purpose:
    'StatusIndicator presents one concise semantic state with optional deliberate announcement.',
  reducedMotionBehavior: [
    'StatusIndicator has no continuous motion; changing tone and label settles without animation under reduced motion.',
  ],
  relatedExports: [
    'AlertBanner',
    'AppearanceProvider',
    'Badge',
    'InlineAlert',
    'Meter',
    'ProgressBar',
    'Spinner',
  ],
  responsiveBehavior: [
    'The compact indicator keeps its glyph aligned while its text can wrap without horizontal overflow.',
  ],
  states: [
    'Neutral, success, warning or in-progress, and danger are separate required tones; static, polite, and assertive announcement modes are separate.',
  ],
  summary: 'Present one concise semantic state without conflating it with application accent.',
} satisfies ComponentContract;

export const badgeContract = {
  ...commonFeedbackGuidance,
  accentBehavior: [
    'Accent Badge is reserved for identity, current context, or category emphasis; semantic Badge tones retain independent green, yellow, and red roles and do not derive from accent.',
  ],
  accessibility: [
    'Badge exposes its visible content as ordinary text and deliberately creates no live region or duplicated accessible label.',
  ],
  appearance: [
    'A compact utility-type capsule uses a persistent boundary so neutral, accent, and semantic roles remain legible in either appearance.',
  ],
  appropriateUses: [
    'short static metadata, category, identifier, count, or current-context text should sit next to a named object',
  ],
  composition: [
    'Render inside AppearanceProvider and place Badge inline with the object it qualifies; content may be text or a concise text-bearing React node.',
  ],
  contentRules: [
    'Keep content brief and self-explanatory; accent may emphasize identity or current context but never replaces a semantic status tone.',
  ],
  controlBehavior: ['Badge is static and has no announcement, selection, or dismissal behavior.'],
  counterExamples: [
    {
      code: inProvider('LiveBadgeCounterexample', '<Badge tone="warning">Solving</Badge>'),
      description:
        'A changing operation state needs StatusIndicator announcement behavior and an explicit semantic contract.',
      title: 'Do not use Badge as live status',
    },
  ],
  events: ['Badge emits no events and does not infer changes from its children.'],
  examples: [
    {
      code: inProvider('RunIdentifierBadge', '<Badge tone="accent">RUN 0284</Badge>'),
      description: 'Emphasize a current run identifier without implying success or failure.',
      title: 'Accent identity metadata',
    },
  ],
  exportName: 'Badge',
  forcedColorBehavior: [
    'Forced colors retain the capsule boundary and text; accent identity maps to system highlight structure without becoming semantic status.',
  ],
  importPath: '.',
  inappropriateUses: [
    'changing status, live announcements, long prose, interactive filtering, dismissible chips, or operation progress',
  ],
  kind: 'component',
  labeling: ['Badge content must be readable text and cannot rely on color alone for its meaning.'],
  name: 'Badge',
  parts: ['Badge owns one compact bordered text capsule.'],
  preferredAlternatives: [
    'Use StatusIndicator for state, ToggleButton or later filter controls for interaction, and InlineAlert for explanatory feedback.',
  ],
  preferredCompositions: [
    'Compose Badge beside a heading, record name, or run identifier rather than as a standalone unlabeled token.',
  ],
  purpose: 'Badge presents short static metadata or category context beside a named object.',
  reducedMotionBehavior: ['Badge has no motion or transient state.'],
  relatedExports: ['AppearanceProvider', 'InlineAlert', 'StatusIndicator', 'ToggleButton'],
  responsiveBehavior: [
    'Badge wraps its content rather than clipping or forcing a containing row beyond compact bounds.',
  ],
  states: [
    'Neutral is the default; accent, success, warning, and danger are explicit visual roles with no live behavior.',
  ],
  summary: 'Present short static metadata, category, or identity context without live behavior.',
} satisfies ComponentContract;

const inlineAlertContractBase = {
  ...commonFeedbackGuidance,
  accentBehavior: [
    'Alerts never accept application accent as severity; neutral, success, warning, and danger retain independent meaning.',
  ],
  accessibility: [
    'A static alert is a note; polite and assertive modes turn the same visible title and description into one atomic live region without hidden duplicate copy.',
  ],
  contentRules: [
    'title states what happened and optional content explains consequence or recovery in specific plain language; tone must agree with that wording.',
  ],
  controlBehavior: [
    'announcement supports off, polite, and assertive; off is the default, polite reports non-urgent changes, and assertive is reserved for an immediate interruption.',
  ],
  events: [
    'The alert emits no event and owns no dismissal; consumers update or remove it and place any recovery Button outside its message semantics.',
  ],
  forcedColorBehavior: [
    'Forced colors preserve the stable boundary, leading edge, tone-specific glyph shape, title, and description using system colors.',
  ],
  labeling: [
    'title is required and visible; the description remains part of the same note or live region, so no aria-label duplication is needed.',
  ],
  reducedMotionBehavior: [
    'Alert tone changes use no layout or continuous motion and settle immediately under reduced motion.',
  ],
  states: [
    'Neutral, success, warning, and danger share one stable geometry; announcement off, polite, and assertive remain deliberate separate modes.',
  ],
};

export const inlineAlertContract = {
  ...inlineAlertContractBase,
  appearance: [
    'InlineAlert is a compact rounded treatment with a constant icon column, boundary, leading edge, title, and optional description across every tone.',
  ],
  appropriateUses: [
    'feedback applies to one nearby field group, panel, action, or local content region and needs explanatory copy',
  ],
  composition: [
    'Render inside AppearanceProvider and place InlineAlert directly after the local region it explains; keep recovery actions adjacent rather than embedding arbitrary controls in the message.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'PageOutageInlineCounterexample',
        '<InlineAlert title="Solver unavailable" tone="danger">All runs are paused.</InlineAlert>',
      ),
      description: 'A condition affecting the whole page needs AlertBanner scope and prominence.',
      title: 'Do not understate broad conditions',
    },
  ],
  examples: [
    {
      code: inProvider(
        'BoundaryReviewAlert',
        '<InlineAlert title="Boundary review" tone="warning">Check the north wall coefficient before running.</InlineAlert>',
      ),
      description: 'Explain one local review condition without interrupting assistive technology.',
      title: 'Static local warning',
    },
  ],
  exportName: 'InlineAlert',
  importPath: '.',
  inappropriateUses: [
    'page-wide outages, a terse state label, static metadata, progress, toast-like transience, or content requiring owned dismissal',
  ],
  kind: 'component',
  name: 'InlineAlert',
  parts: ['InlineAlert owns one glyph, visible title, and optional visible description.'],
  preferredAlternatives: [
    'Use AlertBanner for broad scope, StatusIndicator for concise state, Badge for metadata, or a later toast for transient notification.',
  ],
  preferredCompositions: [
    'Compose beneath a FieldGroup, FormSection, Surface, or local action cluster whose scope is already evident.',
  ],
  purpose: 'InlineAlert explains semantic feedback scoped to one nearby region.',
  relatedExports: [
    'AlertBanner',
    'AppearanceProvider',
    'Badge',
    'Button',
    'FieldGroup',
    'FormSection',
    'StatusIndicator',
    'Surface',
  ],
  responsiveBehavior: [
    'The fixed glyph column and flexible copy column wrap long localized content without changing tone geometry or causing horizontal overflow.',
  ],
  summary: 'Explain semantic feedback scoped to one nearby content or control region.',
} satisfies ComponentContract;

export const alertBannerContract = {
  ...inlineAlertContractBase,
  appearance: [
    'AlertBanner spans its containing region with rounded continuous containment, a constant icon column, semantic surface, title, and optional description.',
  ],
  appropriateUses: [
    'a condition has broad page, workspace, application, or account scope and must be seen before local content',
  ],
  composition: [
    'Render inside AppearanceProvider and place AlertBanner at the start of the region its condition affects; do not nest it inside an unrelated local card.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'FieldBannerCounterexample',
        '<AlertBanner title="Tolerance needs review" tone="warning">Use 0.001–0.1 K.</AlertBanner>',
      ),
      description: 'One field-group condition should remain local through InlineAlert.',
      title: 'Do not overstate local feedback',
    },
  ],
  examples: [
    {
      code: inProvider(
        'SolverOutageBanner',
        '<AlertBanner announcement="assertive" title="Solver disconnected" tone="danger">Reconnect the solver before starting or resuming runs.</AlertBanner>',
      ),
      description: 'Announce an immediate page-wide interruption once through visible copy.',
      title: 'Assertive broad interruption',
    },
  ],
  exportName: 'AlertBanner',
  importPath: '.',
  inappropriateUses: [
    'one field or panel, concise state, metadata, progress, marketing promotion, or content without a real broad condition',
  ],
  kind: 'component',
  name: 'AlertBanner',
  parts: [
    'AlertBanner owns one full-width boundary, glyph, visible title, and optional description.',
  ],
  preferredAlternatives: [
    'Use InlineAlert for local scope, StatusIndicator for terse state, or a later toast for transient background completion.',
  ],
  preferredCompositions: [
    'Compose at the beginning of an application shell, workspace, or page content region before the affected controls.',
  ],
  purpose: 'AlertBanner explains a semantic condition with broad page or workspace scope.',
  relatedExports: ['AppearanceProvider', 'Button', 'InlineAlert', 'StatusIndicator'],
  responsiveBehavior: [
    'The banner fills available inline space and wraps copy beneath no arbitrary breakpoint while preserving its glyph column.',
  ],
  summary: 'Explain a semantic condition with broad page, workspace, or application scope.',
} satisfies ComponentContract;

export const progressBarContract = {
  ...commonFeedbackGuidance,
  accentBehavior: [
    'The progress fill uses application accent as active structure; success, warning, and danger remain outside ProgressBar and belong in a separate resulting status.',
  ],
  accessibility: [
    'The owned progressbar exposes its visible label, determinate min, max, current value and value text, or an indeterminate state described by visible status copy, plus completion meaning.',
  ],
  appearance: [
    'A compact label row and bounded accent rail preserve one stable footprint; sheen appears only while isActive is true and work is incomplete.',
  ],
  appropriateUses: [
    'an operation advances toward completion over time and is either numerically known or explicitly indeterminate',
  ],
  composition: [
    'Render inside AppearanceProvider and place ProgressBar near the operation it reports; update isActive from the operation lifecycle, and update determinate value and valueLabel together or use the exclusive indeterminate contract.',
  ],
  contentRules: [
    'label names the current operation state, valueLabel supplies localized value and units for determinate progress, statusLabel names indeterminate state, and completionLabel defines what done means.',
  ],
  controlBehavior: [
    'isActive is required and controls activity motion independently; determinate progress requires value and valueLabel within a finite min/max domain, while indeterminate progress forbids numeric values and requires statusLabel, and both require explicit completion meaning.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'UtilizationProgressCounterexample',
        '<ProgressBar completionLabel="The licensed capacity is full." isActive={false} label="Storage used" value={72} valueLabel="72 percent" />',
      ),
      description:
        'Storage utilization is a bounded quantity, not an operation moving to completion.',
      title: 'Do not use progress for measurement',
    },
  ],
  events: ['ProgressBar emits no events; operation ownership and cancellation remain external.'],
  examples: [
    {
      code: inProvider(
        'BoundaryProgress',
        '<ProgressBar completionLabel="Complete when all 25 boundary passes are solved." isActive label="Solving boundary passes" maxValue={25} minValue={0} value={18} valueLabel="18 of 25 passes" />',
      ),
      description: 'Report known completion with explicit units and completion semantics.',
      title: 'Determinate solve progress',
    },
  ],
  exportName: 'ProgressBar',
  forcedColorBehavior: [
    'Forced colors map the accent fill to system Highlight and retain a system-colored track boundary, label, value, and completion description.',
  ],
  importPath: '.',
  inappropriateUses: [
    'capacity, score, health, or another bounded measurement; generic compact busy state; final success or failure; or decorative animation',
  ],
  kind: 'component',
  labeling: [
    'label, valueLabel or statusLabel, and completionLabel are required visible or programmatic relationships; do not repeat them in a separate live region.',
  ],
  name: 'ProgressBar',
  parts: [
    'ProgressBar owns one label/value row, progressbar rail and fill, visible indeterminate status when applicable, and programmatic completion description.',
  ],
  preferredAlternatives: [
    'Use Meter for a bounded quantity, Spinner for generic busy state, or StatusIndicator for a resulting semantic state.',
  ],
  preferredCompositions: [
    'Compose beneath the action or workflow stage that owns the operation, followed by one separate StatusIndicator when work settles.',
  ],
  purpose:
    'ProgressBar reports known or unknown advancement toward an explicitly described completion.',
  reducedMotionBehavior: [
    'Reduced motion settles fill transitions and active route sheen to one effectively instantaneous iteration while preserving the current rail length.',
  ],
  relatedExports: ['AppearanceProvider', 'Meter', 'Spinner', 'StatusIndicator'],
  responsiveBehavior: [
    'The rail fills available space and the label row wraps long localized operation text without losing the value or overflowing compact containers.',
  ],
  states: [
    'Determinate and indeterminate progress each support explicit active and inactive operation states; completed determinate progress remains still and does not itself claim semantic success.',
  ],
  summary: 'Report determinate or indeterminate advancement toward explicit completion.',
} satisfies ComponentContract;

export const meterContract = {
  ...commonFeedbackGuidance,
  accentBehavior: [
    'Meter excludes application accent from semantic tone; neutral, success, warning, and danger describe the measured quantity independently.',
  ],
  accessibility: [
    'The owned meter exposes its visible label, finite min, max, current value, localized value text, and a programmatic list of every named threshold.',
  ],
  appearance: [
    'A calibrated semantic fill and fixed threshold marks share the progress family rail geometry while avoiding activity sheen or completion motion.',
  ],
  appropriateUses: [
    'a current quantity, utilization, score, or level must be interpreted within a known range with finite bounds',
  ],
  composition: [
    'Render inside AppearanceProvider and provide one current value and unit-bearing valueLabel; add ordered thresholds only when each boundary has a real named interpretation.',
  ],
  contentRules: [
    'label names the quantity, valueLabel includes localized value and unit, and every threshold supplies an ordered numeric value, unit-bearing valueLabel, semantic tone, and plain-language meaning.',
  ],
  controlBehavior: [
    'Meter requires finite minValue below maxValue and a current value inside the domain; thresholds must be unique, strictly ascending, and inside the range.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'SolveMeterCounterexample',
        '<Meter label="Boundary solve" maxValue={25} minValue={0} value={18} valueLabel="18 of 25 passes" />',
      ),
      description: 'A solve advancing toward done is operation progress, not a measured level.',
      title: 'Do not use Meter for completion',
    },
  ],
  events: ['Meter emits no events and is not an adjustable control.'],
  examples: [
    {
      code: inProvider(
        'ThermalLoadMeter',
        "<Meter label=\"Thermal load\" maxValue={100} minValue={0} thresholds={[{label: 'Review begins', tone: 'warning', value: 70, valueLabel: '70 kilowatts'}, {label: 'Unsafe begins', tone: 'danger', value: 90, valueLabel: '90 kilowatts'}]} tone=\"warning\" value={76} valueLabel=\"76 kilowatts\" />",
      ),
      description: 'Interpret one bounded quantity through named, unit-bearing thresholds.',
      title: 'Thresholded thermal load',
    },
  ],
  exportName: 'Meter',
  forcedColorBehavior: [
    'Forced colors retain the bounded system-color rail, fill, threshold marks, and all textual values even when authored semantic hues collapse.',
  ],
  importPath: '.',
  inappropriateUses: [
    'operation completion, unknown progress, generic busy state, an adjustable value, or a threshold with no explained meaning',
  ],
  kind: 'component',
  labeling: [
    'label and valueLabel are required; each threshold label and valueLabel is connected to the meter as one programmatic description list.',
  ],
  name: 'Meter',
  parts: [
    'Meter owns one label/value row, semantic rail and fill, optional fixed threshold marks, and their visually hidden semantic list.',
  ],
  preferredAlternatives: [
    'Use ProgressBar for completion over time, Slider for adjustable approximate input, NumberField for exact input, or StatusIndicator for one categorical state.',
  ],
  preferredCompositions: [
    'Compose beside a description of the measured system and any separately authored action that can change it.',
  ],
  purpose:
    'Meter presents one current quantity within a known range and names meaningful thresholds.',
  reducedMotionBehavior: ['Meter has no activity animation or value-transition motion.'],
  relatedExports: ['AppearanceProvider', 'NumberField', 'ProgressBar', 'Slider', 'StatusIndicator'],
  responsiveBehavior: [
    'The calibrated rail fills available width and the label/value row wraps without clipping threshold meaning at compact sizes.',
  ],
  states: [
    'Neutral, success, warning, and danger describe the current measurement; thresholds are descriptive boundaries rather than automatic state logic.',
  ],
  summary: 'Present a bounded quantity with localized units and named semantic thresholds.',
} satisfies ComponentContract;

export const spinnerContract = {
  ...commonFeedbackGuidance,
  accentBehavior: [
    'Spinner uses application accent only as active structure and never claims success, warning, or failure.',
  ],
  accessibility: [
    'Spinner keeps one empty atomic status mounted while inactive, then supplies the visible label when active without marking that live region aria-busy, so assistive technology can announce the transition without deferral.',
  ],
  appearance: [
    'One compact routed arc sits beside a visible activity label; the complete slot remains stable when inactive.',
  ],
  appropriateUses: [
    'brief generic busy state is active but no meaningful amount or completion estimate exists',
  ],
  composition: [
    'Render inside AppearanceProvider, place Spinner next to the region or action whose work it describes, and update isActive from that same operation state.',
  ],
  contentRules: [
    'label names the work in active voice; do not use generic “Loading” when a specific operation name is available.',
  ],
  controlBehavior: [
    'isActive is required; true exposes and animates the busy status, while false hides it semantically and visually but preserves its footprint.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'KnownProgressSpinnerCounterexample',
        '<Spinner isActive label="18 of 25 passes" />',
      ),
      description:
        'Known advancement should expose numeric value and completion through ProgressBar.',
      title: 'Do not hide meaningful progress',
    },
  ],
  events: ['Spinner emits no events and does not own cancellation or operation lifecycle.'],
  examples: [
    {
      code: inProvider('SolverSpinner', '<Spinner isActive label="Preparing solver" />'),
      description: 'Expose a brief busy state before a meaningful progress estimate exists.',
      title: 'Generic solver activity',
    },
  ],
  exportName: 'Spinner',
  forcedColorBehavior: [
    'Forced colors retain a system-highlight active arc, a system-colored route, and visible label.',
  ],
  importPath: '.',
  inappropriateUses: [
    'known or indeterminate operation progress needing completion meaning, a final semantic state, decorative idle motion, or an unlabeled loading glyph',
  ],
  kind: 'component',
  labeling: [
    'label is required and visible; do not duplicate it through a surrounding status live region.',
  ],
  name: 'Spinner',
  parts: ['Spinner owns one routed activity glyph and one visible label in a stable inline slot.'],
  preferredAlternatives: [
    'Use ProgressBar when the operation and its completion meaning should remain visible, or StatusIndicator after work settles.',
  ],
  preferredCompositions: [
    'Compose next to a pending Button or inside a stable status field without adding a second live label for the same work.',
  ],
  purpose: 'Spinner presents a brief labeled generic busy state only while work is active.',
  reducedMotionBehavior: [
    'Reduced motion settles the active arc to one effectively instantaneous iteration while retaining its visible busy structure.',
  ],
  relatedExports: ['AppearanceProvider', 'Button', 'ProgressBar', 'StatusIndicator'],
  responsiveBehavior: [
    'The inline glyph remains fixed while the activity label wraps without overflow; inactive state reserves the same footprint.',
  ],
  states: [
    'Active and inactive are explicit; only active has visible or accessible status content and activity motion, while the inactive visual slot remains reserved.',
  ],
  summary: 'Present a brief labeled generic busy state only while activity remains active.',
} satisfies ComponentContract;
