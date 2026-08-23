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
    'Use AlertBanner for broad scope, StatusIndicator for concise state, Badge for metadata, or NotificationProvider for transient notification.',
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
    'NotificationProvider',
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
    'Use InlineAlert for local scope, StatusIndicator for terse state, or NotificationProvider for transient background completion.',
  ],
  preferredCompositions: [
    'Compose at the beginning of an application shell, workspace, or page content region before the affected controls.',
  ],
  purpose: 'AlertBanner explains a condition that affects a page or workspace.',
  relatedExports: [
    'AppearanceProvider',
    'Button',
    'InlineAlert',
    'NotificationProvider',
    'StatusIndicator',
  ],
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
    'Six thick, rounded accent capsules rotate beside a visible activity label. They appear and disappear one complete capsule at a time, and the slot keeps its size when inactive.',
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
    'Forced colors retain system-highlight activity capsules and a visible label.',
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
  parts: [
    'Spinner includes one six-capsule activity icon and one visible label in a fixed inline slot.',
  ],
  preferredAlternatives: [
    'Use ProgressBar when the operation and its completion description should stay visible, or StatusIndicator after work finishes.',
  ],
  preferredCompositions: [
    'Place Spinner next to a pending Button or inside a fixed status field. Do not add a second live label for the same work.',
  ],
  purpose: 'Spinner presents a brief labeled generic busy state only while work is active.',
  reducedMotionBehavior: [
    'Reduced motion stops the rotation and shows all six capsules as a static busy structure.',
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

export const skeletonContract = {
  ...commonFeedbackGuidance,
  accentBehavior: [
    'Skeleton uses neutral surface and boundary colors. Application accent and semantic status colors do not decorate unfinished content.',
  ],
  accessibility: [
    'The complete placeholder is hidden from assistive technology. The surrounding region must expose its own loading state and accessible label when a reader needs progress context.',
  ],
  appearance: [
    'Text, heading, control, and media shapes use calibrated neutral rails. Text may reserve one to five lines, and the last line shortens to avoid looking like finished copy.',
  ],
  appropriateUses: [
    'a content region is loading and preserving its approximate eventual geometry prevents disruptive layout movement',
  ],
  composition: [
    'Render inside AppearanceProvider and arrange one or more Skeleton instances with the same public layout components that will contain the loaded content.',
  ],
  contentRules: [
    'Choose the shape and bounded width that most closely matches the expected content. Do not use skeleton rails as decoration or as a substitute for a loading label.',
  ],
  controlBehavior: [
    'Skeleton is visual only. Text accepts one to five lines; heading, control, and media each reserve one shaped block.',
  ],
  counterExamples: [
    {
      code: inProvider('UnknownWaitSkeletonCounterexample', '<Skeleton shape="control" />'),
      description:
        'A generic wait with no known eventual layout needs a labeled Spinner or ProgressBar.',
      title: 'Do not invent a content shape',
    },
  ],
  events: ['Skeleton emits no event and does not infer when loading begins or ends.'],
  examples: [
    {
      code: inProvider(
        'ResultSummarySkeleton',
        '<div aria-busy="true" aria-label="Loading result summary">\n  <Skeleton lines={3} shape="text" width="three-quarters" />\n</div>',
      ),
      description: 'Reserve a short result summary while its named region is busy.',
      title: 'Structured result loading',
    },
  ],
  exportName: 'Skeleton',
  forcedColorBehavior: [
    'Forced colors retain each placeholder boundary with system colors and remove the moving tonal gradient.',
  ],
  importPath: '.',
  inappropriateUses: [
    'an unknown loading shape, operation progress, a generic busy label, empty content, unavailable content, or decorative striping',
  ],
  kind: 'component',
  labeling: [
    'Skeleton accepts no label because it is hidden. Name the loading region or use Spinner or ProgressBar when the operation itself must be announced.',
  ],
  name: 'Skeleton',
  parts: ['Skeleton includes one shaped block or a bounded sequence of text rails.'],
  preferredAlternatives: [
    'Use Spinner for a brief labeled wait, ProgressBar for an operation with completion meaning, or EmptyState after loading completes without content.',
  ],
  preferredCompositions: [
    'Compose several Skeleton instances inside Stack, InlineGroup, ResponsiveGrid, or Surface to approximate the loaded region without recreating its private content.',
  ],
  purpose: 'Skeleton reserves the approximate shape of content while its region loads.',
  reducedMotionBehavior: [
    'Reduced motion removes the route sweep and keeps the same neutral placeholder geometry.',
  ],
  relatedExports: [
    'AppearanceProvider',
    'EmptyState',
    'InlineGroup',
    'ProgressBar',
    'ResponsiveGrid',
    'Spinner',
    'Stack',
    'Surface',
  ],
  responsiveBehavior: [
    'Full, three-quarter, and half widths remain relative to the containing region. Media keeps a bounded aspect ratio without horizontal overflow.',
  ],
  states: [
    'Text, heading, control, and media are separate approximate shapes. Width and text line count are finite choices.',
  ],
  summary: 'Reserve approximate content geometry during a known loading state.',
  validation: [
    'shape, width, and text line count are finite TypeScript choices. Non-text shapes do not accept a line count.',
  ],
} satisfies ComponentContract;

export const emptyStateContract = {
  ...commonFeedbackGuidance,
  accentBehavior: [
    'No-data and no-results use the application accent on the leading rail. Unavailable content uses warning for the rail, glyph, and recovery Button without claiming an error outcome.',
  ],
  accessibility: [
    'The visible title and description form one ordinary content group. The kind glyph is hidden, so wording rather than color or shape identifies the condition.',
  ],
  appearance: [
    'A reserved open field pairs one stable condition glyph with left-aligned copy. An optional compact secondary Button stays with the copy rather than turning the state into a dialog.',
  ],
  appropriateUses: [
    'a loaded content region has no data, no matching results, or temporarily unavailable content and can explain the next useful step',
  ],
  composition: [
    'Render inside AppearanceProvider where the missing collection or content would appear. Supply at most one bounded recovery action through actionLabel and onAction.',
  ],
  contentRules: [
    'title names the condition and description explains what the reader can do next. Distinguish an empty source from filters with no matches and from content that failed to become available.',
  ],
  controlBehavior: [
    'EmptyState adds no behavior without actionLabel and onAction. Supplying both renders exactly one compact secondary action; neither may appear alone.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'FailedSaveEmptyCounterexample',
        '<EmptyState description="Your draft was not saved." kind="unavailable" title="Save failed" />',
      ),
      description:
        'A failed operation needs durable explanatory feedback and a recovery path, not an empty-content treatment.',
      title: 'Do not hide an operation failure',
    },
  ],
  events: [
    'onAction runs when the optional recovery Button is pressed. EmptyState emits no event when it appears.',
  ],
  examples: [
    {
      code: inProvider(
        'NoBoundaryConditions',
        '<EmptyState actionLabel="Add boundary" description="Add a boundary condition before running the profile." kind="no-data" onAction={() => undefined} title="No boundary conditions" />',
      ),
      description: 'Explain the missing source data and offer one direct next step.',
      title: 'Empty source with one action',
    },
  ],
  exportName: 'EmptyState',
  forcedColorBehavior: [
    'Forced colors preserve the field, glyph, text, and action boundaries with system colors.',
  ],
  importPath: '.',
  inappropriateUses: [
    'content still loading, a failed command, field validation, broad application conditions, transient notifications, or multiple competing recovery choices',
  ],
  keyboardBehavior: [
    'The optional recovery Button follows ordinary Tab and activation behavior. EmptyState itself adds no tab stop or keyboard command.',
  ],
  kind: 'component',
  labeling: [
    'title and description are visible and required. actionLabel is visible when a recovery action exists.',
  ],
  name: 'EmptyState',
  parts: [
    'EmptyState includes one hidden condition glyph, visible title, visible description, and at most one Button.',
  ],
  preferredAlternatives: [
    'Use Skeleton while known content loads, InlineAlert for a local condition, AlertBanner for broad scope, or a dialog when recovery needs a decision.',
  ],
  preferredCompositions: [
    'Place EmptyState inside the same Section, Surface, list, table, or chart region that owns the absent content.',
  ],
  purpose: 'EmptyState explains why a loaded content region has nothing to show.',
  reducedMotionBehavior: ['EmptyState has no motion or transient state.'],
  relatedExports: [
    'AlertBanner',
    'AppearanceProvider',
    'Button',
    'InlineAlert',
    'Section',
    'Skeleton',
    'Surface',
  ],
  responsiveBehavior: [
    'The glyph and copy use two columns when space permits. Long localized text and the optional action wrap without horizontal overflow.',
  ],
  states: [
    'No data means the source is empty, no results means current criteria match nothing, and unavailable means expected content cannot currently load.',
  ],
  summary: 'Explain no data, no results, or unavailable content with at most one action.',
  validation: [
    'kind is a finite choice. TypeScript requires actionLabel and onAction together and prevents either from appearing alone.',
  ],
} satisfies ComponentContract;

export const notificationProviderContract = {
  ...commonFeedbackGuidance,
  accentBehavior: [
    'General notifications use the application accent. Success, warning, and error notifications keep the same green, yellow, and red semantic colors used by other feedback components.',
  ],
  accessibility: [
    'Each notification is a focusable non-modal alert dialog with one visible atomic status or alert message and a labeled dismiss Button. Arrival never moves focus.',
  ],
  appearance: [
    'Raised notifications form one compact overlapping stack with a total-count marker. Each message has a tone rail, stable glyph and copy grid, compact dismiss control, and a draining lifetime rail when timed. The viewport-bounded list hides its scrollbar while idle.',
  ],
  appropriateUses: [
    'a background event or completed action needs brief transient confirmation without interrupting the current task',
  ],
  composition: [
    'Render one NotificationProvider inside AppearanceProvider. Its render child receives notify and dismiss controls while the provider owns a portal-backed notification region.',
  ],
  contentRules: [
    'title, optional description, and optional actionLabel are plain text. Keep messages concise and use at most one action for a nearby follow-up; arbitrary content and multiple recovery paths remain unsupported.',
  ],
  controlBehavior: [
    'The provider orders newest notifications first and always renders the full stack. By default, at least five ordinary messages fit before viewport overflow scrolling. maxVisible caps the scroll viewport at the measured height of one, two, or three cards while every additional card remains reachable by scrolling. The provider reports the total count. Timeouts default to 6000 milliseconds, accept 4000 through 30000 milliseconds, or stay persistent with null. Hover and focus pause timers and lifetime rails.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'ReconnectNotificationCounterexample',
        '<NotificationProvider dismissLabel="Dismiss" label="Notifications">\n  {({notify}) => <Button onPress={() => notify({title: \'Solver disconnected\', tone: \'error\'})}>Reconnect</Button>}\n</NotificationProvider>',
      ),
      description:
        'A condition that blocks work needs a durable AlertBanner or dialog with an explicit recovery action.',
      title: 'Do not make recovery transient',
    },
  ],
  events: [
    'notify returns a key, dismiss removes that key, and onDismiss runs after user dismissal, action dismissal, timeout, or programmatic dismissal. An optional action calls onAction and then dismisses its message.',
  ],
  examples: [
    {
      code: inProvider(
        'ExportNotification',
        "<NotificationProvider dismissLabel=\"Dismiss notification\" label=\"Notifications\">\n  {({notify}) => (\n    <Button onPress={() => notify({actionLabel: 'Open run history', description: 'The export is available in run history.', onAction: () => undefined, title: 'Export ready', tone: 'success'})}>\n      Export run\n    </Button>\n  )}\n</NotificationProvider>",
      ),
      description: 'Confirm a background export and offer one nearby follow-up action.',
      title: 'Transient background completion with an action',
    },
  ],
  exportName: 'NotificationProvider',
  forcedColorBehavior: [
    'Forced colors retain the raised boundary, leading and lifetime rails, glyph, count, copy, action, dismiss control, and focus outline with system colors.',
  ],
  formBehavior: [
    'NotificationProvider and its messages are not form controls and do not serialize, validate, or respond to form reset.',
  ],
  importPath: '.',
  inappropriateUses: [
    'the only path to recover or inspect important information, a persistent condition, field feedback, page-wide interruption, confirmation requiring a decision, or arbitrary interactive content',
  ],
  keyboardBehavior: [
    'Notifications do not receive focus on arrival. Readers may Tab to the scrollable list, a notification, its optional action, and its dismiss Button. Escape dismisses a focused notification while hover or focus pauses its timer.',
  ],
  kind: 'provider',
  labeling: [
    'label names the notification region and dismissLabel names every dismiss control. Each message title remains visible and supplies its non-modal dialog name.',
  ],
  name: 'NotificationProvider',
  parts: [
    'NotificationProvider includes one bounded portal region, a transient-scrollbar list, a total-count marker, a queue, and one raised message with tone glyph, title, optional description, optional action, lifetime rail when timed, and dismiss Button per rendered item.',
  ],
  preferredAlternatives: [
    'Use InlineAlert for durable local feedback, AlertBanner for a broad condition, StatusIndicator for a concise state, or a dialog when the reader must decide or recover.',
  ],
  preferredCompositions: [
    'Place one provider around an application shell or workbench and issue notifications from completed background commands without duplicating durable status history.',
  ],
  purpose: 'NotificationProvider queues and presents brief dismissible application notifications.',
  reducedMotionBehavior: [
    'Reduced motion removes entry translation and the draining lifetime animation while preserving immediate appearance, count, placement, tone, timeout, and dismissal.',
  ],
  relatedExports: ['AlertBanner', 'AppearanceProvider', 'Button', 'InlineAlert', 'StatusIndicator'],
  responsiveBehavior: [
    'The region starts at its chosen logical viewport edge, defaults to top-end, caps width at 22rem, and scrolls within the available viewport height without clipping long localized copy.',
  ],
  states: [
    'General, success, warning, and error tones combine with polite or assertive urgency. Messages may be timed or persistent, actionable or informational, inside an uncapped or card-capped scroll viewport, paused, focused, or dismissed.',
  ],
  summary:
    'Queue accent, success, warning, and error notifications with visible count and lifetime.',
  validation: [
    'maxVisible is optional and accepts one, two, or three as a scroll viewport cap; it never limits the number of rendered messages. timeout must be finite between 4000 and 30000 milliseconds or null. actionLabel and onAction are required together, copy is plain text, tone is general, success, warning, or error, and placement is one of four logical viewport corners.',
  ],
} satisfies ComponentContract;
