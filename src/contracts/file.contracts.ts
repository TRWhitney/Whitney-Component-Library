import type {ComponentContract} from './component-contract.js';

const commonFileGuidance = {
  localization: [
    'Supply localized labels, descriptions, errors, pending copy, action labels, and getAnnouncement output; file type strings and byte limits remain machine constraints and need matching human guidance.',
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
    'Focus uses saturated same-hue structure; invalidity and rejected-file feedback remain dangerous rather than becoming the application accent.',
  ],
  accessibility: [
    'FileTrigger exposes one correctly named button backed by a hidden native file input; generated description, invalid, pending, and result-announcement relationships require no consumer-authored ids.',
  ],
  appearance: [
    'FileTrigger uses the standard secondary action geometry with one stable support track for guidance, errors, pending work, and acquisition results.',
  ],
  appropriateUses: [
    'files should be chosen through the native picker and a persistent drag or paste target would add unnecessary prominence',
  ],
  composition: [
    'Render FileTrigger inside AppearanceProvider, provide explicit type and size constraints with matching human guidance, and transfer accepted File references to application logic through onFiles.',
  ],
  contentRules: [
    'Use an action label that names what will be chosen; state accepted types, multiplicity, and maximum per-file size in description whenever constrained.',
  ],
  directionality: [
    'The action and support copy follow inherited writing direction while consumer-owned file order remains unchanged.',
  ],
  controlBehavior: [
    'Each picker selection produces one immutable result with accepted files, rejected files and their reasons, and the picker source; File objects remain browser-created and consumer-owned.',
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
      description:
        'Choose several bounded image files without implying what happens after acquisition.',
      title: 'Choose reference images',
    },
  ],
  exportName: 'FileTrigger',
  formBehavior: [
    'The hidden picker deliberately has no name and does not serialize files; native form reset clears browser picker state and component feedback without recalling onFiles or changing consumer-owned File references.',
  ],
  forcedColorBehavior: [
    'Forced colors preserve the picker action, focus, invalid state, and rejected-file state with system colors and non-color structure.',
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
    'label is the action name rather than a generic “Browse”; description explains constraints, errorMessage explains external invalidity, and getAnnouncement localizes each accepted or rejected result.',
  ],
  name: 'FileTrigger',
  parts: [
    'FileTrigger owns one secondary action, hidden native file input, and stable support track.',
  ],
  preferredAlternatives: [
    'Use DropZone when drag, paste, and picker paths should share one persistent target, or a later collection component to review and remove already acquired files.',
  ],
  preferredCompositions: [
    'Compose the accepted files into a workflow that explicitly owns upload, storage, asset insertion, or local processing.',
  ],
  purpose: 'FileTrigger acquires consumer-owned files through a named native-picker action.',
  reducedMotionBehavior: [
    'Reduced motion removes pending transitions while retaining settled pending structure and live announcements.',
  ],
  relatedExports: ['AppearanceProvider', 'DropZone'],
  responsiveBehavior: [
    'The control fills a bounded parent, wraps its guidance, and keeps its picker action operable without horizontal overflow at compact widths.',
  ],
  states: [
    'Idle, focused, disabled, invalid, pending, accepted, and rejected states remain distinct; a result does not become an owned selected-file state.',
  ],
  summary: 'Choose consumer-owned files through one constrained native-picker action.',
  validation: [
    'acceptedFileTypes checks MIME types, wildcards, and filename extensions; maxFileSize is a per-file byte limit; multiplicity rejects the whole multi-file attempt when allowsMultiple is false.',
  ],
} satisfies ComponentContract;

export const dropZoneContract = {
  ...commonFileGuidance,
  accentBehavior: [
    'Focus and the active drop boundary use saturated same-hue structure; invalidity and rejected-file feedback remain dangerous rather than becoming the application accent.',
  ],
  accessibility: [
    'DropZone exposes one labeled drop affordance for pointer, keyboard, and assistive-technology drag operations plus one distinctly named native-picker action and localized live result feedback.',
  ],
  appearance: [
    'DropZone uses a neutral dashed route boundary, a compact file glyph, and the standard secondary picker action; focus, valid drag target, rejection, invalidity, disabled, and pending treatments remain structurally distinct.',
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
    'Copy, action placement, and the route-like active boundary follow inherited writing direction while consumer-owned file order remains unchanged.',
  ],
  controlBehavior: [
    'Picker, drop, and paste paths converge on the same immutable accepted/rejected result model; non-file transfers are not accepted, and browser File objects remain consumer-owned.',
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
      description: 'Unify the three browser file-acquisition paths under one bounded target.',
      title: 'Acquire evidence files',
    },
  ],
  exportName: 'DropZone',
  formBehavior: [
    'DropZone does not serialize files or become a successful form control; native reset clears its picker and visible acquisition feedback without recalling onFiles or mutating consumer-owned files.',
  ],
  forcedColorBehavior: [
    'Forced colors preserve the action, focus boundary, active drop target, invalid state, and rejected-file state with system colors and non-color structure.',
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
    'DropZone owns one accessible target, active boundary, file glyph, label and optional content, named picker action, hidden native input, and stable support track.',
  ],
  preferredAlternatives: [
    'Use FileTrigger for picker-only acquisition and a later collection component to review, reorder, or remove acquired files.',
  ],
  preferredCompositions: [
    'Pass accepted files to a consumer-owned Markdown asset-insertion callback, upload workflow, local parser, or acquired-file collection.',
  ],
  purpose: 'DropZone unifies drag, paste, and native-picker acquisition of consumer-owned files.',
  reducedMotionBehavior: [
    'Reduced motion removes active-boundary and pending transitions while retaining their settled structure and live announcements.',
  ],
  relatedExports: ['AppearanceProvider', 'FileTrigger'],
  responsiveBehavior: [
    'The control fills a bounded parent, wraps guidance and custom content, and keeps its action operable without horizontal overflow at compact widths.',
  ],
  states: [
    'Idle, hovered, focused, active drag target, accepted, rejected, externally invalid, disabled, and pending states remain distinct without color-only meaning.',
  ],
  summary: 'Acquire consumer-owned files through one drop, paste, and picker target.',
  validation: [
    'acceptedFileTypes, maxFileSize, and allowsMultiple apply identically after every acquisition path; per-file type and size reasons are reported and a disallowed multi-file attempt accepts none.',
  ],
} satisfies ComponentContract;
