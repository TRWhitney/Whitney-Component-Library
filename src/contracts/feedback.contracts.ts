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
    'One compact rounded indicator combines a status icon, tinted background, and readable label. Every tone uses the same layout.',
  ],
  appropriateUses: [
    'a concise state such as stable, solving, failed, or not started must stay visible beside the object it describes',
  ],
  composition: [
    'Render inside AppearanceProvider and place StatusIndicator beside the named object or inside a separately labeled region; keep its label short and complete.',
  ],
  contentRules: [
    'label names the state. Use success only for achieved outcomes, warning for review or work in progress, danger for failure, and neutral when no status applies.',
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
      description: 'Announce the transition into an active solve state.',
      title: 'Announced running status',
    },
  ],
  exportName: 'StatusIndicator',
  forcedColorBehavior: [
    'Forced colors keep distinct icon shapes and visible text when status colors map to system colors.',
  ],
  importPath: '.',
  inappropriateUses: [
    'metadata, a category tag, explanatory feedback, operation progress, a measured value, or unlabeled activity',
  ],
  kind: 'component',
  labeling: [
    'label is visible and required; do not repeat the same status in an adjacent live region or aria-label.',
  ],
  name: 'StatusIndicator',
  parts: ['StatusIndicator includes one status icon and one visible text label.'],
  preferredAlternatives: [
    'Use Badge for static metadata, InlineAlert or AlertBanner for an explanation, ProgressBar for operation progress, Meter for a measured value, or Spinner for a generic busy state.',
  ],
  preferredCompositions: [
    'Compose a StatusIndicator at one endpoint of a workflow header while keeping any relationship Route structurally and semantically separate.',
  ],
  purpose: 'StatusIndicator shows one concise state with optional announcement.',
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
  summary: 'Show one concise state without using the application accent as a status color.',
} satisfies ComponentContract;

export const badgeContract = {
  ...commonFeedbackGuidance,
  accentBehavior: [
    'Use the accent Badge for identity, current context, or category emphasis. Status Badge tones use their own green, yellow, and red colors.',
  ],
  accessibility: [
    'Badge exposes its visible content as text. It creates no live region or duplicate accessible label.',
  ],
  appearance: [
    'A compact capsule uses a persistent border so neutral, accent, and status tones remain legible in light or dark mode.',
  ],
  appropriateUses: [
    'short static metadata, category, identifier, count, or current-context text should sit next to a named object',
  ],
  composition: [
    'Render inside AppearanceProvider and place Badge inline with the object it qualifies; content may be text or a concise text-bearing React node.',
  ],
  contentRules: [
    'Keep content brief and self-explanatory. Accent may emphasize identity or current context, but it never replaces a status tone.',
  ],
  controlBehavior: ['Badge is static and has no announcement, selection, or dismissal behavior.'],
  counterExamples: [
    {
      code: inProvider('LiveBadgeCounterexample', '<Badge tone="warning">Solving</Badge>'),
      description:
        'A changing operation state needs StatusIndicator and its optional announcements.',
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
    'Forced colors keep the capsule border and text. Accent identity maps to system highlight colors without becoming status.',
  ],
  importPath: '.',
  inappropriateUses: [
    'changing status, live announcements, long prose, interactive filtering, dismissible chips, or operation progress',
  ],
  kind: 'component',
  labeling: ['Badge content must be readable text and cannot rely on color alone for its meaning.'],
  name: 'Badge',
  parts: ['Badge includes one compact bordered text capsule.'],
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
    'Neutral is the default. Accent, success, warning, and danger change only the visual treatment and never create live behavior.',
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
    'The alert emits no events and has no dismissal control. The application updates or removes it and places any recovery Button outside the message.',
  ],
  forcedColorBehavior: [
    'Forced colors use system colors for the border, leading edge, status icon, title, and description.',
  ],
  labeling: [
    'title is required and visible. The description belongs to the same note or live region, so it needs no duplicate aria-label.',
  ],
  reducedMotionBehavior: [
    'Alert tone changes use no layout or continuous motion and settle immediately under reduced motion.',
  ],
  states: [
    'Neutral, success, warning, and danger share one layout. Announcements may be off, polite, or assertive.',
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
    'page-wide outages, a short state label, static metadata, progress, temporary toast messages, or content that needs dismissal',
  ],
  kind: 'component',
  name: 'InlineAlert',
  parts: ['InlineAlert includes one icon, visible title, and optional visible description.'],
  preferredAlternatives: [
    'Use AlertBanner for broad scope, StatusIndicator for concise state, Badge for metadata, or a later toast for transient notification.',
  ],
  preferredCompositions: [
    'Compose beneath a FieldGroup, FormSection, Surface, or local action cluster whose scope is already evident.',
  ],
  purpose: 'InlineAlert explains feedback for one nearby region.',
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
  summary: 'Explain feedback for one nearby content or control region.',
} satisfies ComponentContract;

export const alertBannerContract = {
  ...inlineAlertContractBase,
  appearance: [
    'AlertBanner spans its container with a rounded background, fixed icon column, status color, title, and optional description.',
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
      description: 'Keep a field-group condition local with InlineAlert.',
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
    'AlertBanner includes one full-width border, icon, visible title, and optional description.',
  ],
  preferredAlternatives: [
    'Use InlineAlert for local scope, StatusIndicator for terse state, or a later toast for transient background completion.',
  ],
  preferredCompositions: [
    'Compose at the beginning of an application shell, workspace, or page content region before the affected controls.',
  ],
  purpose: 'AlertBanner explains a condition that affects a page or workspace.',
  relatedExports: ['AppearanceProvider', 'Button', 'InlineAlert', 'StatusIndicator'],
  responsiveBehavior: [
    'The banner fills the available width and wraps text while keeping its icon column.',
  ],
  summary: 'Explain a condition that affects a page, workspace, or application.',
} satisfies ComponentContract;

export const progressBarContract = {
  ...commonFeedbackGuidance,
  accentBehavior: [
    'The progress fill uses the application accent. Success, warning, and danger belong in a separate result status.',
  ],
  accessibility: [
    'The progressbar exposes its visible label and completion description. Determinate progress also exposes min, max, current value, and value text. Indeterminate progress uses visible status text.',
  ],
  appearance: [
    'A compact label row and accent rail use a fixed footprint. The sheen appears only while isActive is true and work is incomplete.',
  ],
  appropriateUses: [
    'an operation advances toward completion and its progress is known or indeterminate',
  ],
  composition: [
    'Render inside AppearanceProvider and place ProgressBar near the operation it reports; update isActive from the operation lifecycle, and update determinate value and valueLabel together or use the exclusive indeterminate contract.',
  ],
  contentRules: [
    'label names the current operation state, valueLabel supplies localized value and units for determinate progress, statusLabel names indeterminate state, and completionLabel defines what done means.',
  ],
  controlBehavior: [
    'isActive is required and controls activity motion. Determinate progress requires value and valueLabel within a finite min/max range. Indeterminate progress forbids numeric values and requires statusLabel. Both require a completion description.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'UtilizationProgressCounterexample',
        '<ProgressBar completionLabel="The licensed capacity is full." isActive={false} label="Storage used" value={72} valueLabel="72 percent" />',
      ),
      description:
        'Storage usage is a measured quantity, not an operation moving toward completion.',
      title: 'Do not use progress for measurement',
    },
  ],
  events: ['ProgressBar emits no events. The application manages the operation and cancellation.'],
  examples: [
    {
      code: inProvider(
        'BoundaryProgress',
        '<ProgressBar completionLabel="Complete when all 25 boundary passes are solved." isActive label="Solving boundary passes" maxValue={25} minValue={0} value={18} valueLabel="18 of 25 passes" />',
      ),
      description: 'Report progress with units and describe what completion means.',
      title: 'Determinate solve progress',
    },
  ],
  exportName: 'ProgressBar',
  forcedColorBehavior: [
    'Forced colors map the accent fill to system Highlight and retain a system-colored track boundary, label, value, and completion description.',
  ],
  importPath: '.',
  inappropriateUses: [
    'capacity, score, health, or another measurement; a compact busy state; final success or failure; or decorative animation',
  ],
  kind: 'component',
  labeling: [
    'label, valueLabel or statusLabel, and completionLabel are required visible or programmatic relationships; do not repeat them in a separate live region.',
  ],
  name: 'ProgressBar',
  parts: [
    'ProgressBar includes a label and value row, rail and fill, visible indeterminate status when needed, and a completion description for assistive technology.',
  ],
  preferredAlternatives: [
    'Use Meter for a measured quantity, Spinner for a generic busy state, or StatusIndicator for the result.',
  ],
  preferredCompositions: [
    'Place ProgressBar below the action or workflow stage for the operation. Show a separate StatusIndicator when the work finishes.',
  ],
  purpose: 'ProgressBar reports known or unknown progress toward a described completion.',
  reducedMotionBehavior: [
    'Reduced motion makes fill changes immediate and reduces active sheen to one instant pass. The current fill length does not change.',
  ],
  relatedExports: ['AppearanceProvider', 'Meter', 'Spinner', 'StatusIndicator'],
  responsiveBehavior: [
    'The rail fills available space and the label row wraps long localized operation text without losing the value or overflowing compact containers.',
  ],
  states: [
    'Determinate and indeterminate progress each support active and inactive states. Completed determinate progress stops moving but does not claim success.',
  ],
  summary: 'Report determinate or indeterminate progress toward completion.',
} satisfies ComponentContract;

export const meterContract = {
  ...commonFeedbackGuidance,
  accentBehavior: [
    'Meter does not use the application accent for status. Neutral, success, warning, and danger describe the measured quantity.',
  ],
  accessibility: [
    'Meter exposes its visible label, finite min, max, current value, localized value text, and a list of named thresholds to assistive technology.',
  ],
  appearance: [
    'A status-colored fill and fixed threshold marks use the same rail layout as ProgressBar, without activity sheen or completion motion.',
  ],
  appropriateUses: [
    'a current quantity, utilization, score, or level must be interpreted within a known range with finite bounds',
  ],
  composition: [
    'Render inside AppearanceProvider and provide one current value and unit-bearing valueLabel; add ordered thresholds only when each boundary has a real named interpretation.',
  ],
  contentRules: [
    'label names the quantity, and valueLabel includes the localized value and unit. Each threshold supplies an ordered number, a valueLabel with units, a status tone, and a plain-language description.',
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
      description: 'Interpret a measured quantity through named thresholds with units.',
      title: 'Thresholded thermal load',
    },
  ],
  exportName: 'Meter',
  forcedColorBehavior: [
    'Forced colors use a system-color rail, fill, and threshold marks. Every text value stays visible when status colors collapse.',
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
    'Meter includes a label and value row, status-colored rail and fill, optional fixed threshold marks, and a visually hidden threshold list.',
  ],
  preferredAlternatives: [
    'Use ProgressBar for completion over time, Slider for adjustable approximate input, NumberField for exact input, or StatusIndicator for one categorical state.',
  ],
  preferredCompositions: [
    'Compose beside a description of the measured system and any separately authored action that can change it.',
  ],
  purpose: 'Meter shows a current quantity within a known range and names its thresholds.',
  reducedMotionBehavior: ['Meter has no activity animation or value-transition motion.'],
  relatedExports: ['AppearanceProvider', 'NumberField', 'ProgressBar', 'Slider', 'StatusIndicator'],
  responsiveBehavior: [
    'The calibrated rail fills available width and the label/value row wraps without clipping threshold meaning at compact sizes.',
  ],
  states: [
    'Neutral, success, warning, and danger describe the current measurement; thresholds are descriptive boundaries rather than automatic state logic.',
  ],
  summary: 'Show a measured quantity with localized units and named status thresholds.',
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
    'One compact arc sits beside a visible activity label. The slot keeps its size when inactive.',
  ],
  appropriateUses: [
    'a brief generic busy state is active but no amount or completion estimate exists',
  ],
  composition: [
    'Render inside AppearanceProvider, place Spinner next to the region or action whose work it describes, and update isActive from that same operation state.',
  ],
  contentRules: [
    'label names the work in active voice. Use the operation name instead of a generic "Loading" label.',
  ],
  controlBehavior: [
    'isActive is required. true shows and animates the busy status. false hides it visually and from assistive technology but reserves its space.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'KnownProgressSpinnerCounterexample',
        '<Spinner isActive label="18 of 25 passes" />',
      ),
      description:
        'Known advancement should expose numeric value and completion through ProgressBar.',
      title: 'Do not hide measurable progress',
    },
  ],
  events: ['Spinner emits no events and does not own cancellation or operation lifecycle.'],
  examples: [
    {
      code: inProvider('SolverSpinner', '<Spinner isActive label="Preparing solver" />'),
      description: 'Show a brief busy state before a progress estimate exists.',
      title: 'Generic solver activity',
    },
  ],
  exportName: 'Spinner',
  forcedColorBehavior: [
    'Forced colors retain a system-highlight active arc, a system-colored route, and visible label.',
  ],
  importPath: '.',
  inappropriateUses: [
    'known or indeterminate operation progress that needs a completion description, a final state, decorative idle motion, or an unlabeled loading icon',
  ],
  kind: 'component',
  labeling: [
    'label is required and visible; do not duplicate it through a surrounding status live region.',
  ],
  name: 'Spinner',
  parts: ['Spinner includes one activity icon and one visible label in a fixed inline slot.'],
  preferredAlternatives: [
    'Use ProgressBar when the operation and its completion description should stay visible, or StatusIndicator after work finishes.',
  ],
  preferredCompositions: [
    'Place Spinner next to a pending Button or inside a fixed status field. Do not add a second live label for the same work.',
  ],
  purpose: 'Spinner presents a brief labeled generic busy state only while work is active.',
  reducedMotionBehavior: [
    'Reduced motion settles the active arc to one effectively instantaneous iteration while retaining its visible busy structure.',
  ],
  relatedExports: ['AppearanceProvider', 'Button', 'ProgressBar', 'StatusIndicator'],
  responsiveBehavior: [
    'The icon stays fixed while the activity label wraps without overflow. The inactive state reserves the same space.',
  ],
  states: [
    'Only the active state has visible or accessible status content and motion. The inactive state reserves the same space.',
  ],
  summary: 'Show a brief labeled busy state only while work is active.',
} satisfies ComponentContract;
