import type {ComponentContract} from './component-contract.js';

const commonActionGuidance = {
  directionality: [
    'Logical sizing and placement follow inherited writing direction; authored content remains in DOM reading order.',
  ],
  localization: [
    'Supply all visible and accessible labels in the application locale and allow labels to grow without relying on a fixed text width.',
  ],
  stylesheet: './styles.css',
  validation: [
    'The TypeScript API rejects arbitrary classes, inline styles, polymorphic elements, and unsupported visual variants.',
  ],
} satisfies Pick<
  ComponentContract,
  'directionality' | 'localization' | 'stylesheet' | 'validation'
>;

function withinAppearanceProvider(lines: readonly string[]): string {
  const returnLine = lines.indexOf('  return (');
  const closingLine = lines.lastIndexOf('  );');
  if (returnLine < 0 || closingLine <= returnLine) {
    throw new Error('Action contract examples must contain one returned JSX tree.');
  }

  return [
    ...lines.slice(0, returnLine + 1),
    '    <AppearanceProvider appearance="dark" accent="#2474ff">',
    ...lines.slice(returnLine + 1, closingLine).map((line) => `  ${line}`),
    '    </AppearanceProvider>',
    ...lines.slice(closingLine),
  ].join('\n');
}

export const buttonContract = {
  ...commonActionGuidance,
  accentBehavior: [
    'Primary emphasis uses the exact application accent with an independently readable foreground and a saturated same-hue supporting boundary only when the fill is too close to its surrounding surface.',
    'Hover tint preserves the accent hue; focus and interactive edges use exact or saturated same-hue structure while ordinary labels stay neutral. Danger keeps its semantic color, and pending uses warning rather than accent.',
  ],
  accessibility: [
    'The rendered element is a native button with a stable visible label and visible focus indication.',
    'Pending keeps the button focusable but inert and exposes pendingLabel as a live status description without replacing the visible label.',
  ],
  appropriateUses: [
    'a user initiates an immediate command, confirms a choice, or explicitly submits or resets a form',
  ],
  appearance: [
    'Button uses library-owned control height, rounded shape, type, and secondary, primary, quiet, or danger treatment in both appearances.',
  ],
  composition: [
    'Render Button inside AppearanceProvider and place adjacent peer commands in ButtonGroup or Toolbar according to their keyboard relationship.',
  ],
  contentRules: [
    'Use a concise verb-led visible label that remains unchanged while pending.',
    'Use secondary for a standard command, quiet for a supporting or low-emphasis command, primary only for the clearest next action in a region, and danger only for a destructive command.',
  ],
  controlBehavior: [
    'Button is controlled by isDisabled and isPending; pending requires a localized pendingLabel and prevents activation without removing focus.',
  ],
  counterExamples: [
    {
      title: 'Do not use a command for navigation',
      description:
        'A button labeled like a destination does not expose a link destination to the browser.',
      code: withinAppearanceProvider([
        'export function CommandDisguisedAsNavigation() {',
        '  return (',
        '    <Button>Open run history</Button>',
        '  );',
        '}',
      ]),
    },
  ],
  events: [
    'onPress reports one modality-independent activation and is not called while disabled or pending.',
  ],
  examples: [
    {
      title: 'Run a profile',
      description: 'Keep the command label stable and describe its pending work separately.',
      code: withinAppearanceProvider([
        'export function RunProfileAction() {',
        '  return (',
        '    <Button variant="primary" isPending pendingLabel="Running profile">',
        '      Run profile',
        '    </Button>',
        '  );',
        '}',
      ]),
    },
  ],
  exportName: 'Button',
  forcedColorBehavior: [
    'Forced-color mode maps the button boundary, label, focus outline, and pending rail to system colors.',
  ],
  formBehavior: [
    'type defaults to button; set submit or reset explicitly to retain native form behavior, and use form, name, value, or formNoValidate only for that native relationship.',
  ],
  importPath: '.',
  inappropriateUses: [
    'activation changes the current URL, represents persistent binary selection, or needs an icon without visible text',
  ],
  keyboardBehavior: [
    'Enter and Space activate the native button; ordinary buttons remain individual tab stops in ButtonGroup and participate in Toolbar arrow navigation.',
  ],
  kind: 'component',
  labeling: [
    'The visible children provide the accessible name; pendingLabel describes progress and must not duplicate or replace the command label.',
  ],
  name: 'Button',
  parts: [
    'Button exposes one visible label region and an automatic visually hidden pending status.',
  ],
  preferredAlternatives: [
    'Use Link for navigation, ToggleButton for persistent binary selection, and IconButton only for a familiar icon-only command.',
  ],
  preferredCompositions: [
    'Use ButtonGroup for a small ordinary cluster and Toolbar for a compact command surface whose items share arrow-key navigation.',
  ],
  purpose: 'Button initiates a command while preserving native button and form semantics.',
  reducedMotionBehavior: [
    'Reduced motion stops the traveling pending rail and removes state transitions while keeping a static warning rail and every state boundary.',
  ],
  relatedExports: [
    'AppearanceProvider',
    'ButtonGroup',
    'IconButton',
    'Link',
    'ToggleButton',
    'Toolbar',
  ],
  states: [
    'Secondary is the default; primary, quiet, and danger change emphasis without changing command semantics.',
    'Hover, focus, press, pending, and disabled feedback do not translate, scale, or resize the control.',
  ],
  responsiveBehavior: [
    'Button keeps its minimum regular or compact control height and wraps long labels instead of clipping them when its container narrows.',
  ],
  summary: 'Initiate a command with native button and explicit form behavior.',
} satisfies ComponentContract;

export const iconButtonContract = {
  ...commonActionGuidance,
  accentBehavior: [
    'Hover tint preserves the accent hue; focus and interactive edges use exact or saturated same-hue structure while ordinary icon content stays neutral. Danger keeps its semantic color.',
  ],
  accessibility: [
    'The required label supplies the native button accessible name and the same text appears in an automatic hover and focus tooltip.',
  ],
  appropriateUses: [
    'a compact command has a familiar icon whose meaning can be stated by one short accessible label',
  ],
  appearance: [
    'IconButton uses a square regular or compact control, rounded shape, and secondary, quiet, or danger treatment in both appearances.',
  ],
  composition: [
    'Render IconButton inside AppearanceProvider so its provider-scoped tooltip inherits the same appearance and accent.',
  ],
  contentRules: [
    'Pass one icon as children and mark decorative icon content hidden from assistive technology.',
    'Use secondary when the control needs its own neutral boundary, quiet when a toolbar or containing surface already supplies containment, and danger only for a destructive command.',
  ],
  controlBehavior: [
    'IconButton supports enabled and disabled command state and does not expose selection or pending state.',
  ],
  counterExamples: [
    {
      title: 'Do not hide an unfamiliar command behind an icon',
      description: 'Prefer a visible Button label when the symbol is not immediately recognizable.',
      code: withinAppearanceProvider([
        'export function AmbiguousIconCommand() {',
        '  return (',
        '    <IconButton label="Reconcile topology">',
        '      <span aria-hidden="true">◇</span>',
        '    </IconButton>',
        '  );',
        '}',
      ]),
    },
  ],
  events: ['onPress reports activation and is not called while the control is disabled.'],
  examples: [
    {
      title: 'Close a panel',
      description: 'Use one familiar icon and a concise label shared with the tooltip.',
      code: withinAppearanceProvider([
        'export function ClosePanelAction() {',
        '  return (',
        '    <IconButton label="Close panel" variant="quiet">',
        '      <span aria-hidden="true">×</span>',
        '    </IconButton>',
        '  );',
        '}',
      ]),
    },
  ],
  exportName: 'IconButton',
  forcedColorBehavior: [
    'Forced-color mode maps the control boundary, icon, focus outline, and tooltip to system colors.',
  ],
  formBehavior: [
    'IconButton always has type button and does not submit or reset a form implicitly.',
  ],
  importPath: '.',
  inappropriateUses: [
    'the command needs visible text, represents navigation or selection, or needs a pending progress announcement',
  ],
  keyboardBehavior: [
    'Enter and Space activate the native button; focus also reveals the tooltip after its short guidance delay.',
  ],
  kind: 'component',
  labeling: [
    'label is required, becomes the accessible name, and is reused verbatim as the library-owned tooltip text.',
  ],
  name: 'IconButton',
  parts: ['IconButton exposes one icon region and one automatic provider-scoped tooltip.'],
  preferredAlternatives: [
    'Use Button when a visible label improves recognition, Link for navigation, and ToggleButton for persistent selection.',
  ],
  preferredCompositions: [
    'Place compact IconButton peers in Toolbar when they form a frequently used command surface.',
  ],
  purpose: 'IconButton presents a familiar icon-only command with required accessible guidance.',
  reducedMotionBehavior: [
    'Reduced motion removes control and tooltip transitions while preserving hover, focus, press, disabled, and tooltip meaning.',
  ],
  relatedExports: ['AppearanceProvider', 'Button', 'ToggleButton', 'Toolbar'],
  states: [
    'Secondary is the default; quiet and danger offer bounded emphasis while hover, focus, press, and disabled remain visible without movement.',
  ],
  responsiveBehavior: [
    'IconButton keeps its square regular or compact dimensions while its containing layout determines wrapping or overflow.',
  ],
  summary: 'Present a familiar icon-only command with required tooltip guidance.',
} satisfies ComponentContract;

export const linkContract = {
  ...commonActionGuidance,
  accentBehavior: [
    'Link text stays neutral while its resting underline, focus, hover tint, and stronger current-destination underline use exact or saturated same-hue accent structure without borrowing status colors.',
  ],
  accessibility: [
    'Link renders a native anchor with a visible accent-bearing underline and focus outline, so neutral label color does not hide its navigation role.',
    'current exposes the active destination through aria-current, and newWindow applies safe opener isolation.',
  ],
  appropriateUses: ['activation navigates to a URL, resource, page, or in-page destination'],
  appearance: [
    'Link paints neutral text with an accent-bearing underline and no resting control surface; current, hover, focus, and disabled treatments remain distinct in both appearances.',
  ],
  composition: [
    'Render Link inside AppearanceProvider and place it in prose, navigation, or a region that owns the surrounding destination context.',
  ],
  contentRules: [
    'Use destination-oriented text that remains understandable outside its surrounding sentence.',
  ],
  controlBehavior: [
    'href is required; current, isDisabled, and newWindow describe bounded navigation state without an activation callback.',
  ],
  counterExamples: [
    {
      title: 'Do not use navigation for an in-place command',
      description:
        'A placeholder destination disguises a command and creates incorrect browser behavior.',
      code: withinAppearanceProvider([
        'export function LinkDisguisedAsCommand() {',
        '  return (',
        '    <Link href="#">Recalculate profile</Link>',
        '  );',
        '}',
      ]),
    },
  ],
  events: [
    'Link exposes native navigation rather than onPress; application routing may intercept the anchor through its normal router integration.',
  ],
  examples: [
    {
      title: 'Open a run',
      description: 'Expose a real destination and mark the current page when applicable.',
      code: withinAppearanceProvider([
        'export function OpenRunLink() {',
        '  return (',
        '    <Link href="/runs/0284" current="page">Run 0284</Link>',
        '  );',
        '}',
      ]),
    },
  ],
  exportName: 'Link',
  forcedColorBehavior: [
    'Forced-color mode uses the system link color and focus highlight while preserving native underline and current-destination emphasis.',
  ],
  formBehavior: ['Link does not submit, reset, validate, or contribute a value to a form.'],
  importPath: '.',
  inappropriateUses: [
    'activation changes local application state, submits a form, performs a command, or toggles persistent selection',
  ],
  keyboardBehavior: [
    'Enter follows the native anchor destination; Link participates in ordinary document tab order.',
  ],
  kind: 'component',
  labeling: [
    'Visible children provide the accessible name; avoid generic destination text such as click here or more.',
  ],
  name: 'Link',
  parts: ['Link exposes one destination-label region and no command or icon slots.'],
  preferredAlternatives: [
    'Use Button for in-place commands and ToggleButton for persistent binary selection.',
  ],
  preferredCompositions: [
    'Use Link within semantic navigation or prose rather than placing it in ButtonGroup or Toolbar as a command surrogate.',
  ],
  purpose: 'Link exposes a real navigation destination through native anchor semantics.',
  reducedMotionBehavior: [
    'Reduced motion removes link color and underline transitions without removing any navigation state.',
  ],
  relatedExports: ['AppearanceProvider', 'Button', 'ToggleButton'],
  states: [
    'Current, hover, focus, and disabled states remain distinguishable without making the link resemble a button.',
  ],
  responsiveBehavior: [
    'Link remains inline with surrounding content and follows normal text wrapping at compact widths.',
  ],
  summary: 'Navigate to a real destination with native link semantics.',
} satisfies ComponentContract;

export const toggleButtonContract = {
  ...commonActionGuidance,
  accentBehavior: [
    'Ordinary label text stays neutral; hover tint preserves the accent hue, while focus and the persistent selected under-rail use exact or saturated same-hue accent structure without implying semantic status.',
  ],
  accessibility: [
    'ToggleButton renders a button with aria-pressed so selected, disabled, focus, and press state remain distinct.',
  ],
  appropriateUses: [
    'one command-like control represents a persistent binary selection such as pinned, muted, or bold',
  ],
  appearance: [
    'ToggleButton uses library-owned control height, rounded shape, type, and secondary or quiet treatment with a rail-only selected state in both appearances.',
  ],
  composition: [
    'Render ToggleButton inside AppearanceProvider and place related editor or tool toggles in Toolbar.',
  ],
  contentRules: [
    'Use a stable label whose meaning is valid in both selected and unselected state.',
    'Use secondary for a standalone toggle with its own neutral boundary and quiet inside a toolbar or another contained command surface.',
  ],
  controlBehavior: [
    'Use defaultSelected for uncontrolled state or isSelected with onChange for controlled state; do not combine ownership models.',
  ],
  counterExamples: [
    {
      title: 'Do not model a one-time command as selected state',
      description: 'An action such as saving completes; it does not remain pressed afterward.',
      code: withinAppearanceProvider([
        'export function SaveAsPersistentSelection() {',
        '  return (',
        '    <ToggleButton>Save profile</ToggleButton>',
        '  );',
        '}',
      ]),
    },
  ],
  events: ['onChange reports the next selected boolean after user activation.'],
  examples: [
    {
      title: 'Pin status details',
      description: 'Use pressed state for a preference that persists after activation.',
      code: withinAppearanceProvider([
        'export function PinStatusToggle() {',
        '  return (',
        '    <ToggleButton defaultSelected>Pin status</ToggleButton>',
        '  );',
        '}',
      ]),
    },
  ],
  exportName: 'ToggleButton',
  forcedColorBehavior: [
    'Forced-color mode maps the button boundary, label, focus outline, and selected rail to system colors.',
  ],
  formBehavior: [
    'ToggleButton is not a form value, submit button, reset button, checkbox, or substitute for a labeled form field.',
  ],
  importPath: '.',
  inappropriateUses: [
    'activation is a one-time command, navigates, or represents a submitted form value that needs checkbox semantics',
  ],
  keyboardBehavior: [
    'Enter and Space toggle pressed state; ordinary placement preserves its tab stop and Toolbar placement adds orientation-aware arrow navigation.',
  ],
  kind: 'component',
  labeling: [
    'Visible children provide the accessible name, while aria-pressed communicates selection without changing that label.',
  ],
  name: 'ToggleButton',
  parts: ['ToggleButton exposes one stable visible-label region and one selected-state rail.'],
  preferredAlternatives: [
    'Use Button for a one-time command, Link for navigation, and a future checkbox field for submitted binary data.',
  ],
  preferredCompositions: [
    'Use Toolbar for related editor or visualization toggles that should share arrow-key navigation.',
  ],
  purpose: 'ToggleButton represents a persistent binary selection with pressed-button semantics.',
  reducedMotionBehavior: [
    'Reduced motion removes state transitions while preserving hover, focus, press, selected, and disabled boundaries.',
  ],
  relatedExports: ['AppearanceProvider', 'Button', 'Link', 'Toolbar'],
  states: [
    'Selected state uses the application accent as an under-rail without filling the whole control; hover adds feedback without obscuring that rail.',
  ],
  responsiveBehavior: [
    'ToggleButton keeps its minimum regular or compact control height and wraps long labels instead of clipping them when its container narrows.',
  ],
  summary: 'Represent persistent binary selection with a rail-only pressed state.',
} satisfies ComponentContract;

export const buttonGroupContract = {
  ...commonActionGuidance,
  accentBehavior: [
    'ButtonGroup paints no accent itself; its Button and IconButton children apply accent and semantic colors according to their own contracts.',
  ],
  accessibility: [
    'ButtonGroup creates a named group while every child action retains its own role, accessible name, and tab stop.',
  ],
  appropriateUses: [
    'a small set of related ordinary commands needs shared grouping and optionally consistent adjacent sizing',
  ],
  appearance: [
    'ButtonGroup owns gap, orientation, and optional equal-item geometry but paints no group surface, border, text, or state color.',
  ],
  composition: [
    'Render ButtonGroup inside AppearanceProvider with Button or IconButton children and use equalItems for equivalent adjacent choices.',
    'A consumer component may bundle actions when it renders Button or IconButton as direct DOM children; it must not add a DOM wrapper inside ButtonGroup.',
  ],
  contentRules: ['Keep children few, related, and ordered according to reading and tab sequence.'],
  controlBehavior: [
    'label names the group; orientation controls layout and equalItems gives direct children consistent dimensions.',
  ],
  counterExamples: [
    {
      title: 'Do not imply toolbar keyboard behavior',
      description: 'A command surface whose items should share arrow navigation needs Toolbar.',
      code: withinAppearanceProvider([
        'export function EditorCommandsWithoutToolbar() {',
        '  return (',
        '    <ButtonGroup label="Editor commands">',
        '      <Button>Undo</Button>',
        '      <Button>Redo</Button>',
        '    </ButtonGroup>',
        '  );',
        '}',
      ]),
    },
  ],
  events: [
    'ButtonGroup emits no group event; each child action owns its activation or selection callback.',
  ],
  examples: [
    {
      title: 'Group review actions',
      description: 'Equalize adjacent commands that have equivalent placement weight.',
      code: withinAppearanceProvider([
        'export function ReviewActionGroup() {',
        '  return (',
        '    <ButtonGroup label="Review actions" equalItems>',
        '      <Button>Review</Button>',
        '      <Button variant="primary">Run profile</Button>',
        '    </ButtonGroup>',
        '  );',
        '}',
      ]),
    },
  ],
  exportName: 'ButtonGroup',
  forcedColorBehavior: [
    'ButtonGroup geometry is unchanged in forced colors while each child preserves its own system-color treatment.',
  ],
  formBehavior: [
    'ButtonGroup itself has no form behavior; child Button types retain their explicit native submit or reset behavior.',
  ],
  importPath: '.',
  inappropriateUses: [
    'the set needs shared arrow-key navigation, is a single persistent choice set, or contains unrelated actions',
  ],
  keyboardBehavior: [
    'ButtonGroup adds no arrow-key focus model: every enabled child remains in normal tab order and keeps its native keys.',
  ],
  kind: 'composition',
  labeling: ['label is required and names the semantic group without adding visible text.'],
  name: 'ButtonGroup',
  parts: ['ButtonGroup exposes one ordered rendered action region and no decorative separator.'],
  preferredAlternatives: [
    'Use Toolbar when related compact commands need arrow-key navigation and use layout primitives for unrelated controls.',
  ],
  preferredCompositions: [
    'Use equalItems for adjacent actions of equivalent role so labels of different lengths do not create mismatched control sizes.',
  ],
  purpose:
    'ButtonGroup names and aligns related commands without changing their normal tab behavior.',
  reducedMotionBehavior: [
    'ButtonGroup introduces no motion; child actions apply their own reduced-motion behavior.',
  ],
  relatedExports: ['AppearanceProvider', 'Button', 'IconButton', 'Toolbar'],
  states: [
    'The group has no selection or disabled state; its geometry remains stable while children expose their own states.',
  ],
  responsiveBehavior: [
    'Horizontal groups keep their declared axis and allow equal child labels to wrap without clipping; choose vertical orientation when the complete horizontal group does not fit the containing region.',
  ],
  summary: 'Group related ordinary commands while preserving each tab stop.',
  validation: [
    'The TypeScript API rejects arbitrary classes, inline styles, and unsupported geometry options; runtime DOM validation accepts consumer component boundaries while rejecting rendered direct children other than Button, IconButton, or library-owned action support nodes.',
  ],
} satisfies ComponentContract;

export const toolbarContract = {
  ...commonActionGuidance,
  accentBehavior: [
    'Toolbar paints no accent itself; Button, IconButton, and ToggleButton children apply focus, emphasis, and selection accent according to their own contracts.',
  ],
  accessibility: [
    'Toolbar creates a named toolbar and delegates item roles, names, pressed states, and disabled states to its child controls.',
  ],
  appropriateUses: [
    'a compact, frequently used command surface needs one tab entry followed by orientation-aware arrow navigation',
  ],
  appearance: [
    'Toolbar paints a rounded neutral subtle surface and border around its bounded gap and orientation in both appearances.',
  ],
  composition: [
    'Render Toolbar inside AppearanceProvider with Button, IconButton, and ToggleButton children that belong to one command context.',
    'A consumer component may bundle commands when it renders Button, IconButton, or ToggleButton as direct DOM children; it must not add a DOM wrapper inside Toolbar.',
  ],
  contentRules: [
    'Order commands by expected use and reading direction, and keep infrequent or unrelated actions outside the toolbar.',
  ],
  controlBehavior: [
    'label names the toolbar and orientation controls both its visual axis and arrow-key focus behavior.',
  ],
  counterExamples: [
    {
      title: 'Do not turn an ordinary action row into a toolbar',
      description: 'A short confirmation row should keep each action directly reachable by Tab.',
      code: withinAppearanceProvider([
        'export function ConfirmationAsToolbar() {',
        '  return (',
        '    <Toolbar label="Confirmation actions">',
        '      <Button variant="quiet">Cancel</Button>',
        '      <Button variant="primary">Confirm</Button>',
        '    </Toolbar>',
        '  );',
        '}',
      ]),
    },
  ],
  events: [
    'Toolbar emits no command event; child controls own activation and selection callbacks.',
  ],
  examples: [
    {
      title: 'Compose editor commands',
      description:
        'Combine a consumer-owned command bundle and persistent formatting state under one arrow-key model.',
      code: withinAppearanceProvider([
        'const HistoryActions = () => (',
        '  <>',
        '    <Button variant="quiet">Undo</Button>',
        '    <Button variant="quiet">Redo</Button>',
        '  </>',
        ');',
        '',
        'export function EditorToolbar() {',
        '  return (',
        '    <Toolbar label="Editor commands">',
        '      <HistoryActions />',
        '      <ToggleButton variant="quiet">Bold</ToggleButton>',
        '    </Toolbar>',
        '  );',
        '}',
      ]),
    },
  ],
  exportName: 'Toolbar',
  forcedColorBehavior: [
    'Forced-color mode maps the toolbar border and surface to system colors while each child preserves its own system-color states.',
  ],
  formBehavior: [
    'Toolbar itself has no form behavior; child Button types retain their explicit native form behavior.',
  ],
  importPath: '.',
  inappropriateUses: [
    'a small ordinary action row should keep every control in tab order, or the children do not share one command context',
  ],
  keyboardBehavior: [
    'Tab enters or leaves the toolbar as one stop; horizontal toolbars use Left and Right arrows, vertical toolbars use Up and Down arrows, and horizontal direction follows the inherited writing direction.',
  ],
  kind: 'composition',
  labeling: ['label is required and names the toolbar without adding visible text.'],
  name: 'Toolbar',
  parts: [
    'Toolbar exposes one ordered rendered control region within its bounded command surface.',
  ],
  preferredAlternatives: [
    'Use ButtonGroup for a short ordinary command cluster whose children should all remain Tab stops.',
  ],
  preferredCompositions: [
    'Combine compact Button, IconButton, and ToggleButton controls only when they operate on the same editor, canvas, or selected object.',
  ],
  purpose:
    'Toolbar composes frequent related commands under one labeled arrow-key navigation model.',
  reducedMotionBehavior: [
    'Toolbar introduces no group motion; child commands apply their own reduced-motion behavior.',
  ],
  relatedExports: ['AppearanceProvider', 'Button', 'ButtonGroup', 'IconButton', 'ToggleButton'],
  states: [
    'The toolbar surface remains neutral while child commands carry hover, focus, press, selected, pending, and disabled meaning.',
  ],
  responsiveBehavior: [
    'Horizontal toolbars preserve one command row with reachable inline overflow; vertical toolbars stack and stretch their children.',
  ],
  summary: 'Compose frequent commands with orientation-aware arrow navigation.',
  validation: [
    'The TypeScript API rejects arbitrary classes, inline styles, and unsupported orientation values; runtime DOM validation accepts consumer component boundaries while rejecting rendered direct children other than Button, IconButton, ToggleButton, or library-owned action support nodes.',
  ],
} satisfies ComponentContract;
