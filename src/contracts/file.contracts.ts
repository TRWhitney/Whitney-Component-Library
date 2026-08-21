import type {ComponentContract} from './component-contract.js';

const commonFileGuidance = {
  localization: [
    'Localize labels, descriptions, errors, pending text, action labels, and getAnnouncement output. Explain file type and byte constraints in human-readable text.',
  ],
  stylesheet: './styles.css',
} satisfies Pick<ComponentContract, 'localization' | 'stylesheet'>;

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

const announcement =
  'getAnnouncement={({files, rejectedFiles}) => `${files.length} accepted; ${rejectedFiles.length} rejected.`}';

export const fileTriggerContract = {
  ...commonFileGuidance,
  accentBehavior: [
    'Focus uses a more saturated version of the accent hue. Invalid and rejected-file feedback use danger colors.',
  ],
  accessibility: [
    'FileTrigger exposes one correctly named button backed by a hidden native file input; generated description, invalid, pending, and result-announcement relationships require no consumer-authored ids.',
  ],
  appearance: [
    'FileTrigger uses the standard secondary action and one fixed support area for guidance, errors, pending work, and results.',
  ],
  appropriateUses: [
    'files should be chosen through the native picker and a persistent drag or paste target would add unnecessary prominence',
  ],
  composition: [
    'Render FileTrigger inside AppearanceProvider. Provide type and size constraints with matching guidance, then handle accepted File objects in onFiles.',
  ],
  contentRules: [
    'Use an action label that names what will be chosen; state accepted types, multiplicity, and maximum per-file size in description whenever constrained.',
  ],
  directionality: [
    'The action and support text follow inherited writing direction. File order stays unchanged.',
  ],
  controlBehavior: [
    'Each picker selection returns accepted files, rejected files with reasons, and the picker source. The browser creates each File object, and the application manages it.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'PersistentDropTargetCounterexample',
        `<FileTrigger label="Drop or choose evidence" onFiles={() => undefined} ${announcement} />`,
      ),
      description: 'A workflow that advertises dropping or pasting needs a persistent DropZone.',
      title: 'Do not promise acquisition modes the trigger does not provide',
    },
  ],
  events: [
    'onFiles reports accepted and rejected browser File objects after a non-cancelled picker selection; cancellation produces no callback, and getAnnouncement supplies localized live-region copy.',
  ],
  examples: [
    {
      code: inProvider(
        'ReferenceImageTrigger',
        `<FileTrigger acceptedFileTypes={['image/png', '.jpg']} allowsMultiple description="PNG or JPG, up to 2 MB each." label="Choose reference images" maxFileSize={2000000} onFiles={() => undefined} ${announcement} />`,
      ),
      description: 'Choose several size-limited image files without implying what happens next.',
      title: 'Choose reference images',
    },
  ],
  exportName: 'FileTrigger',
  formBehavior: [
    'The hidden picker has no name and does not submit files. Native form reset clears picker state and feedback without calling onFiles or changing File references held by the application.',
  ],
  forcedColorBehavior: [
    'Forced colors use system colors and non-color cues for the picker action, focus, invalid state, and rejected files.',
  ],
  importPath: '.',
  inappropriateUses: [
    'drag or paste acquisition, upload progress, remote storage, persistence, file editing, directory traversal, or displaying an acquired-file collection',
  ],
  keyboardBehavior: [
    'Tab reaches the named action and Enter or Space opens the native picker; disabled and pending states prevent another picker request without moving focus.',
  ],
  kind: 'component',
  labeling: [
    'label names the action rather than using a generic "Browse." description explains constraints, errorMessage explains application errors, and getAnnouncement localizes each result.',
  ],
  name: 'FileTrigger',
  parts: [
    'FileTrigger includes one secondary action, hidden native file input, and fixed support area.',
  ],
  preferredAlternatives: [
    'Use DropZone when drag, paste, and picker paths should share one persistent target, or a later collection component to review and remove already acquired files.',
  ],
  preferredCompositions: [
    'Pass accepted files to the workflow responsible for upload, storage, asset insertion, or local processing.',
  ],
  purpose: 'FileTrigger acquires application-managed files through a named native-picker action.',
  reducedMotionBehavior: [
    'Reduced motion removes pending transitions while retaining settled pending structure and live announcements.',
  ],
  relatedExports: ['AppearanceProvider', 'DropZone'],
  responsiveBehavior: [
    'The control fills its parent, wraps guidance, and keeps the picker action usable without horizontal overflow on narrow screens.',
  ],
  states: [
    'Idle, focused, disabled, invalid, pending, accepted, and rejected states are visually distinct. Results do not become selected-file state.',
  ],
  summary: 'Choose files through one native picker with type and size constraints.',
  validation: [
    'acceptedFileTypes checks MIME types, wildcards, and filename extensions; maxFileSize is a per-file byte limit; multiplicity rejects the whole multi-file attempt when allowsMultiple is false.',
  ],
} satisfies ComponentContract;

export const dropZoneContract = {
  ...commonFileGuidance,
  accentBehavior: [
    'Focus and the active drop border use a more saturated version of the accent hue. Invalid and rejected-file feedback use danger colors.',
  ],
  accessibility: [
    'DropZone exposes one labeled drop affordance for pointer, keyboard, and assistive-technology drag operations plus one distinctly named native-picker action and localized live result feedback.',
  ],
  appearance: [
    'DropZone uses a neutral dashed border, a compact file icon, and the standard secondary picker action. Focus, valid drag target, rejection, invalid, disabled, and pending states use distinct shapes or colors.',
  ],
  appropriateUses: [
    'drag, paste, and native-picker acquisition should share one persistent and clearly explained file target',
  ],
  composition: [
    'Render DropZone inside AppearanceProvider; optional children may add concise domain context but cannot replace its required label, description, constraints, action, or callback.',
  ],
  contentRules: [
    'Use label for the target purpose and actionLabel for the picker command; state accepted types, multiplicity, and maximum per-file size in description whenever constrained.',
  ],
  directionality: [
    'Text, action placement, and the active border follow inherited writing direction. File order stays unchanged.',
  ],
  controlBehavior: [
    'Picker, drop, and paste return the same accepted and rejected result shape. The control rejects non-file transfers. The application manages the browser-created File objects.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'UploadProgressCounterexample',
        `<DropZone actionLabel="Upload evidence" description="Uploads immediately." label="Evidence upload" onFiles={() => undefined} ${announcement} />`,
      ),
      description: 'Acquisition does not define upload timing, progress, retry, or persistence.',
      title: 'Do not present acquisition as upload',
    },
  ],
  events: [
    'onFiles reports accepted and rejected files with picker, drop, or paste source; getAnnouncement supplies localized result copy, and no upload or persistence event is implied.',
  ],
  examples: [
    {
      code: inProvider(
        'EvidenceDropZone',
        `<DropZone acceptedFileTypes={['image/*', 'application/pdf']} actionLabel="Browse evidence" allowsMultiple description="Drop, paste, or browse for images and PDFs up to 10 MB each." label="Evidence" maxFileSize={10000000} onFiles={() => undefined} ${announcement} />`,
      ),
      description: 'Accept picker, drop, and paste input through one target.',
      title: 'Acquire evidence files',
    },
  ],
  exportName: 'DropZone',
  formBehavior: [
    'DropZone does not submit files as a form control. Native reset clears its picker and feedback without calling onFiles or changing application-held files.',
  ],
  forcedColorBehavior: [
    'Forced colors use system colors and non-color cues for the action, focus border, active drop target, invalid state, and rejected files.',
  ],
  importPath: '.',
  inappropriateUses: [
    'upload or storage ownership, directory traversal, free-form text paste, sortable acquired-file collections, or a picker-only action that does not need a persistent target',
  ],
  keyboardBehavior: [
    'Tab reaches the drop affordance and picker action; keyboard drag-and-drop follows the platform announcement path, paste is accepted while the affordance is focused, and Enter or Space on the named picker action opens the native picker.',
  ],
  kind: 'component',
  labeling: [
    'label names the drop target, actionLabel names the picker command, description explains constraints, and generated error, pending, and announcement relationships require no consumer ids.',
  ],
  name: 'DropZone',
  parts: [
    'DropZone includes an accessible target, active border, file icon, label and optional content, named picker action, hidden native input, and fixed support area.',
  ],
  preferredAlternatives: [
    'Use FileTrigger for picker-only acquisition and a later collection component to review, reorder, or remove acquired files.',
  ],
  preferredCompositions: [
    "Pass accepted files to the application's Markdown asset callback, upload workflow, local parser, or file collection.",
  ],
  purpose: 'DropZone accepts application-managed files through drag, paste, or a native picker.',
  reducedMotionBehavior: [
    'Reduced motion removes active-boundary and pending transitions while retaining their settled structure and live announcements.',
  ],
  relatedExports: ['AppearanceProvider', 'FileTrigger'],
  responsiveBehavior: [
    'The control fills its parent, wraps guidance and custom content, and keeps its action usable without horizontal overflow on narrow screens.',
  ],
  states: [
    'Idle, hovered, focused, active drag target, accepted, rejected, invalid, disabled, and pending states are distinguishable without color alone.',
  ],
  summary: 'Acquire files through one drop, paste, and picker target.',
  validation: [
    'acceptedFileTypes, maxFileSize, and allowsMultiple apply identically after every acquisition path; per-file type and size reasons are reported and a disallowed multi-file attempt accepts none.',
  ],
} satisfies ComponentContract;
