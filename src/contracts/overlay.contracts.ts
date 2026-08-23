import type {ComponentContract} from './component-contract.js';

const commonOverlayGuidance = {
  accentBehavior: [
    'The application accent identifies the overlay threshold and primary ordinary action; warning and danger confirmation meaning always use their semantic colors instead.',
  ],
  accessibility: [
    'Opening moves focus into the overlay, focus remains contained while it is open, and closing restores focus to its trigger, including nested and sequential overlays.',
    'The visible title labels the dialog and the visible description is announced with it; background content is excluded from the accessibility tree while the overlay is open.',
  ],
  formBehavior: [
    'The overlay is not a form itself. A consumer may place a form in its body and must connect submission, validation, and reset behavior explicitly.',
  ],
  localization: [
    'Supply localized title, description, trigger, dismissal, and decision labels as applicable; allow visible copy and actions to wrap without truncation.',
  ],
  stylesheet: './styles.css',
  validation: [
    'TypeScript validates explicit state and variant combinations. Runtime validation requires the trigger to render exactly one library Button or IconButton; consumers validate task data and keep validation feedback inside the active overlay.',
  ],
} satisfies Pick<
  ComponentContract,
  'accentBehavior' | 'accessibility' | 'formBehavior' | 'localization' | 'stylesheet' | 'validation'
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

export const dialogContract = {
  ...commonOverlayGuidance,
  appearance: [
    'Dialog is a compact raised work surface over a dimmed canvas, marked by one continuous accent threshold rail and organized into header, scrolling body, and optional action areas.',
  ],
  appropriateUses: [
    'a focused, bounded task or supporting content needs temporary attention without leaving the current context',
  ],
  composition: [
    'Render inside AppearanceProvider so the surface, threshold, text, and focus treatment share the active theme and application accent.',
    'Pass exactly one Button or IconButton trigger, a concise title and description, body content, an accessible closeLabel, and optional actions that receive a close function.',
    'Keep a Dialog open while launching a nested overlay only when the nested decision is necessary to complete the parent task.',
  ],
  contentRules: [
    'Title the task or content directly, use the description to state context or consequence, and order actions from ordinary alternatives toward the primary action.',
  ],
  controlBehavior: [
    'Dialog supports controlled isOpen with onOpenChange or uncontrolled defaultOpen. Backdrop press, Escape, the close button, and an action calling close dismiss it.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'DeleteRunDialogCounterexample',
        '<Dialog\n  actions={({close}) => <Button onPress={close}>Delete run</Button>}\n  closeLabel="Close deletion confirmation"\n  description="This permanently removes the run and its results."\n  title="Delete run?"\n  trigger={<Button>Delete run</Button>}\n>\n  <p>RUN 0284 and all generated results will be removed.</p>\n</Dialog>',
      ),
      description:
        'A permanent deletion needs AlertDialog so cancellation receives initial focus and backdrop presses cannot confirm or dismiss accidentally.',
      title: 'Do not confirm destructive work in Dialog',
    },
  ],
  directionality: [
    'Header, body, close control, and action order follow inherited writing direction and use logical spacing.',
  ],
  events: [
    'onOpenChange reports every open-state transition; action content owns its domain events and calls the provided close function only when the task should end.',
  ],
  examples: [
    {
      code: inProvider(
        'EditRunDialog',
        '<Dialog\n  actions={({close}) => (\n    <>\n      <Button onPress={close} variant="secondary">Cancel</Button>\n      <Button onPress={close}>Save changes</Button>\n    </>\n  )}\n  closeLabel="Close run editor"\n  description="Update the display name used throughout this workspace."\n  title="Edit run name"\n  trigger={<Button>Edit run</Button>}\n>\n  <p>The current run is RUN 0284.</p>\n</Dialog>',
      ),
      description: 'Keep a short editing task in context and close it from either action.',
      title: 'Bounded editing task',
    },
  ],
  exportName: 'Dialog',
  forcedColorBehavior: [
    'Forced colors preserve the modal boundary, accent threshold, text, and close-control focus indicator with system colors.',
  ],
  importPath: '.',
  inappropriateUses: [
    'irreversible, destructive, or otherwise consequential confirmation; persistent navigation; transient status; or a task that should have its own route',
  ],
  keyboardBehavior: [
    'Opening places focus on the close control, Tab and Shift+Tab remain inside, Escape dismisses, and focus returns to the trigger.',
  ],
  kind: 'component',
  labeling: [
    'title and description are required visible strings. closeLabel names the icon-only close control without repeating visible copy.',
  ],
  name: 'Dialog',
  parts: [
    'Dialog includes its trigger, underlay, raised dialog surface, title, description, close control, optional body, and optional action area.',
  ],
  preferredAlternatives: [
    'Use AlertDialog for consequential confirmation, Drawer for a larger edge-attached supplemental task, InlineAlert for durable local feedback, or a route for deep work.',
  ],
  preferredCompositions: [
    'Compose Dialog with library Button actions and form fields; keep the trigger in the document position to which focus should return.',
  ],
  purpose:
    'Dialog hosts one ordinary, bounded task or focused piece of content over the current context.',
  reducedMotionBehavior: [
    'Reduced motion removes underlay fades and surface settling while preserving the same opening, focus, and dismissal behavior.',
  ],
  relatedExports: ['AlertDialog', 'AppearanceProvider', 'Button', 'Drawer', 'InlineAlert'],
  responsiveBehavior: [
    'Dialog remains inset from the visual viewport, constrains its height, and scrolls its body without moving the header or actions.',
  ],
  states: [
    'Closed and open are explicit. Open may be controlled or uncontrolled, and nested overlays preserve their own focus and dismissal boundaries.',
  ],
  summary: 'Host one ordinary, bounded task or focused content surface with reversible dismissal.',
} satisfies ComponentContract;

export const alertDialogContract = {
  ...commonOverlayGuidance,
  appearance: [
    'AlertDialog uses the same raised surface as Dialog with a warning or danger threshold rail and a fixed cancel-then-confirm action area.',
  ],
  appropriateUses: [
    'a consequential, destructive, or irreversible action requires an explicit decision before it proceeds',
  ],
  composition: [
    'Render inside AppearanceProvider so the surface, semantic threshold, text, and focus treatment share the active theme.',
    'Pass exactly one Button or IconButton trigger, a decision title and consequence description, localized cancel and confirm labels, an explicit actionKind, and onConfirm.',
  ],
  contentRules: [
    'State the action in the title, name the specific consequence in the description, and make the confirm label a direct verb phrase; do not use vague labels such as Yes.',
  ],
  controlBehavior: [
    'AlertDialog supports controlled isOpen with onOpenChange or uncontrolled defaultOpen. A backdrop press does not dismiss it; cancel and Escape close without confirming, while confirm invokes onConfirm and then closes.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'RunDetailsAlertCounterexample',
        '<AlertDialog\n  actionKind="confirm"\n  cancelLabel="Cancel"\n  confirmLabel="Continue"\n  description="Review the solver settings for this run."\n  onConfirm={() => {}}\n  title="Run details"\n  trigger={<Button>View details</Button>}\n/>',
      ),
      description:
        'Viewing ordinary supporting content does not require an interruptive decision; use Dialog.',
      title: 'Do not alert for ordinary content',
    },
  ],
  directionality: [
    'Copy and actions follow inherited writing direction with cancel before confirm in logical reading order.',
  ],
  events: [
    'onConfirm fires only from the confirm action. onOpenChange reports opening and every dismissal without treating dismissal as confirmation.',
  ],
  examples: [
    {
      code: inProvider(
        'DeleteRunAlertDialog',
        '<AlertDialog\n  actionKind="destructive"\n  cancelLabel="Keep run"\n  confirmLabel="Delete run"\n  description="This permanently removes RUN 0284 and its saved results."\n  onConfirm={() => {}}\n  title="Delete this run?"\n  trigger={<Button variant="danger">Delete run</Button>}\n/>',
      ),
      description: 'Require an explicit destructive decision while making cancellation safest.',
      title: 'Destructive confirmation',
    },
  ],
  exportName: 'AlertDialog',
  forcedColorBehavior: [
    'Forced colors preserve the modal boundary, semantic threshold, action borders, text, and focus indicators with system colors.',
  ],
  importPath: '.',
  inappropriateUses: [
    'ordinary information, routine editing, acknowledgment-only notices, transient feedback, or any action that does not require a consequential decision',
  ],
  keyboardBehavior: [
    'Cancel receives initial focus, Tab and Shift+Tab remain inside, Escape cancels and closes, and focus returns to the trigger.',
  ],
  kind: 'component',
  formBehavior: [
    'AlertDialog is not a form and accepts no editable body. Validate consumer-owned input before opening it, or use Dialog when the decision itself requires form entry.',
  ],
  labeling: [
    'title and description are required visible strings; cancelLabel and confirmLabel are visible action labels and must describe their outcomes.',
  ],
  name: 'AlertDialog',
  parts: [
    'AlertDialog includes its trigger, non-dismissible underlay, raised alertdialog surface, title, description, cancel action, and confirm action.',
  ],
  preferredAlternatives: [
    'Use Dialog for ordinary focused work, Drawer for supplemental work, InlineAlert for durable feedback, or NotificationProvider for transient confirmation after an action completes.',
  ],
  preferredCompositions: [
    'Open AlertDialog from the action that needs confirmation and report the eventual result through durable or transient feedback after it closes.',
  ],
  purpose: 'AlertDialog requires an explicit decision before a consequential action proceeds.',
  reducedMotionBehavior: [
    'Reduced motion removes underlay fades and surface settling without changing initial focus, cancellation, or confirmation.',
  ],
  relatedExports: [
    'AppearanceProvider',
    'Button',
    'Dialog',
    'Drawer',
    'InlineAlert',
    'NotificationProvider',
  ],
  responsiveBehavior: [
    'AlertDialog stays inset from the visual viewport, wraps decision copy and actions, and scrolls within its bounded surface when necessary.',
  ],
  states: [
    'Closed and open may be controlled or uncontrolled. actionKind is explicitly confirm or destructive and determines semantic emphasis without changing behavior.',
  ],
  summary: 'Require an explicit, cancellation-first decision before consequential work.',
} satisfies ComponentContract;

export const drawerContract = {
  ...commonOverlayGuidance,
  appearance: [
    'Drawer is a raised panel attached to a viewport edge, with a short faded accent seam on the content-facing edge and a dimmed underlay behind it.',
    'A drag handle continues the straight seam through a shallow tapered grip; a docked preview uses the same surface and edge treatment rather than appearing as a separate control.',
  ],
  appropriateUses: [
    'a supplemental workflow or larger focused task should open from a logical viewport edge while retaining the current page context',
  ],
  composition: [
    'Render inside AppearanceProvider so the panel, threshold, text, and focus treatment share the active theme and application accent.',
    'Pass exactly one Button or IconButton trigger, title, description, closeLabel, optional body and actions, and choose placement start, end, top, or bottom.',
    'Pass dragHandleLabel to add an accessible grip that can extend the drawer from its docked edge. Pass dockedPreview for a noninteractive preview that remains visible and reserves page space while docked.',
    'Use nested overlays sparingly and keep each trigger mounted so focus can return through the overlay stack.',
  ],
  contentRules: [
    'Title the supplemental task, explain its relationship to the page, and keep actions in the fixed footer while long content scrolls in the body.',
  ],
  controlBehavior: [
    'Drawer supports controlled isOpen with onOpenChange or uncontrolled defaultOpen. Backdrop press, Escape, the close button, and an action calling close dismiss it.',
    'When dragHandleLabel is present, pressing the grip toggles the drawer and dragging it toward the page opens it after the distance or velocity threshold. Dragging back toward its edge docks it.',
    'dockedPreview is presentational and does not replace the trigger or drag handle. Its reserved provider space remains stable while the drawer opens, preventing covered content and layout jumps.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'NavigationDrawerCounterexample',
        '<Drawer\n  closeLabel="Close navigation"\n  description="Move between the application sections."\n  placement="start"\n  title="Navigation"\n  trigger={<Button>Open navigation</Button>}\n>\n  <nav aria-label="Primary">Application destinations</nav>\n</Drawer>',
      ),
      description:
        'Persistent application navigation needs a stable page-level navigation region rather than a task overlay.',
      title: 'Do not replace persistent navigation',
    },
  ],
  directionality: [
    'placement uses logical start and end: start maps to the left in left-to-right contexts and right in right-to-left contexts, with end mapping oppositely. Top and bottom are physical block edges in either direction.',
  ],
  events: [
    'onOpenChange reports every open-state transition; action content owns domain events and calls the provided close function when the task should end.',
  ],
  examples: [
    {
      code: inProvider(
        'RunInspectorDrawer',
        '<Drawer\n  actions={({close}) => <Button onPress={close}>Done</Button>}\n  closeLabel="Close run inspector"\n  description="Inspect solver inputs without leaving the run list."\n  placement="end"\n  title="Run inspector"\n  trigger={<Button>Inspect run</Button>}\n>\n  <p>RUN 0284 is ready for review.</p>\n</Drawer>',
      ),
      description: 'Open supplemental detail from the logical end edge and preserve page context.',
      title: 'Supplemental inspector',
    },
    {
      code: inProvider(
        'DockedRunInspectorDrawer',
        '<Drawer\n  closeLabel="Close run inspector"\n  description="Inspect solver inputs without leaving the run list."\n  dockedPreview={<span>RUN 0284 · Stable</span>}\n  dragHandleLabel="Move run inspector"\n  placement="end"\n  title="Run inspector"\n  trigger={<Button>Inspect run</Button>}\n>\n  <p>RUN 0284 is ready for review.</p>\n</Drawer>',
      ),
      description:
        'Reserve an edge preview and let the user click, drag, or use the keyboard grip to extend the same drawer surface.',
      title: 'Docked inspector with preview',
    },
  ],
  exportName: 'Drawer',
  forcedColorBehavior: [
    'Forced colors preserve the panel boundary, content-facing seam, grip outline and marks, text, close control, and action focus indicators with system colors.',
  ],
  importPath: '.',
  inappropriateUses: [
    'persistent application navigation, a small confirmation, transient feedback, a non-modal side rail, or primary work that deserves its own route',
  ],
  keyboardBehavior: [
    'Opening places focus on the close control, Tab and Shift+Tab remain inside, Escape dismisses, and focus returns to the trigger.',
    'A drag handle supports Enter or Space to toggle, Home to dock, End to open fully, and placement-relative arrow keys to move in ten-percent steps.',
  ],
  kind: 'component',
  labeling: [
    'title and description are required visible strings. closeLabel names the icon-only close control, and placement never substitutes for a meaningful title.',
    'dragHandleLabel is required whenever the optional grip is rendered and should name the drawer it moves. dockedPreview is hidden from assistive technology and must not contain interactive or essential content.',
  ],
  name: 'Drawer',
  parts: [
    'Drawer includes its trigger, underlay, edge-attached dialog surface, title, description, close control, optional scrolling body and action area, optional drag handle, and optional docked preview.',
  ],
  preferredAlternatives: [
    'Use Dialog for a compact centered task, AlertDialog for consequential confirmation, a page-level navigation region for persistent navigation, or a route for primary work.',
  ],
  preferredCompositions: [
    'Compose Drawer with library fields and Button actions for inspectors, filters, or supplemental editors that need more vertical room.',
  ],
  purpose:
    'Drawer hosts a supplemental workflow or larger focused task at a logical viewport edge.',
  reducedMotionBehavior: [
    'Reduced motion removes the edge slide and underlay fade while preserving placement, focus, and dismissal behavior.',
  ],
  relatedExports: ['AlertDialog', 'AppearanceProvider', 'Button', 'Dialog'],
  responsiveBehavior: [
    'At compact widths Drawer becomes a full-screen visual-viewport surface; at larger widths it remains edge-attached with a bounded inline size. Edge motion stays clipped to the viewport without introducing horizontal scrolling.',
    'A docked preview reserves 88 pixels at a logical inline edge or 70 pixels at a block edge through AppearanceProvider, so ordinary application content reflows instead of sitting underneath it.',
    'AppearanceProvider publishes the current physical reservation as --wcl-drawer-reserved-left, --wcl-drawer-reserved-right, --wcl-drawer-reserved-top, and --wcl-drawer-reserved-bottom. Fixed consumer controls add the relevant value to their inset; NotificationProvider does this automatically.',
  ],
  states: [
    'Closed and open may be controlled or uncontrolled. placement is start, end, top, or bottom, and nested overlays retain independent focus boundaries.',
    'With a handle or preview, the closed drawer remains docked at its edge. Grip-only docking exposes the accent seam; preview docking also exposes the supplied presentational strip.',
  ],
  summary: 'Open or extend a supplemental workflow from any viewport edge.',
} satisfies ComponentContract;

const commonAnchoredGuidance = {
  accentBehavior: [
    'The application accent marks the top threshold and anchor bridge that connect the anchored surface to its trigger. Focused items and controls retain a visible component-specific treatment.',
  ],
  forcedColorBehavior: [
    'Forced colors preserve the surface boundary, arrow, focused item or control, and trigger focus with system colors.',
  ],
  reducedMotionBehavior: [
    'Reduced motion removes the short anchored-surface settling transition without changing placement, focus, or dismissal.',
  ],
  responsiveBehavior: [
    'The surface flips when its requested side lacks room, stays inside the visual viewport, and scrolls its own content when available height is limited.',
  ],
  stylesheet: './styles.css',
} satisfies Pick<
  ComponentContract,
  | 'accentBehavior'
  | 'forcedColorBehavior'
  | 'reducedMotionBehavior'
  | 'responsiveBehavior'
  | 'stylesheet'
>;

export const popoverContract = {
  ...commonAnchoredGuidance,
  accessibility: [
    'Opening moves focus to the visible close control, keeps interactive content inside one labeled dialog, and restores focus to the trigger after dismissal.',
  ],
  appearance: [
    'Popover is a compact raised surface with an accent threshold and a joined arrow that identifies its current anchor.',
  ],
  appropriateUses: [
    'supplemental interactive content needs an anchored surface near the control or object that opened it',
  ],
  composition: [
    'Render inside AppearanceProvider and pass exactly one library Button or IconButton trigger.',
    'Supply a visible title and description, a closeLabel, body content, and optional actions that receive a close function.',
  ],
  contentRules: [
    'Keep the task short enough to remain useful beside its trigger. Name the content directly and explain its local purpose in the description.',
  ],
  controlBehavior: [
    'Popover supports controlled isOpen with onOpenChange or uncontrolled defaultOpen. Escape, outside press, the close control, and an action calling close dismiss it.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'DeleteRunPopoverCounterexample',
        '<Popover\n  closeLabel="Close deletion"\n  description="This permanently removes RUN 0284."\n  title="Delete run?"\n  trigger={<Button>Delete run</Button>}\n>\n  <Button>Confirm deletion</Button>\n</Popover>',
      ),
      description:
        'Consequential confirmation needs AlertDialog so cancellation receives initial focus and outside presses cannot dismiss the decision.',
      title: 'Do not confirm destructive work in Popover',
    },
  ],
  directionality: [
    'Logical placement, alignment, copy, actions, and the anchor arrow follow the trigger writing direction.',
  ],
  events: [
    'onOpenChange reports each open-state transition. Body actions own their domain events and call close only when the local task should end.',
  ],
  examples: [
    {
      code: inProvider(
        'RunSummaryPopover',
        '<Popover\n  closeLabel="Close run summary"\n  description="Review the active run without leaving the current task."\n  title="Run summary"\n  trigger={<Button>Inspect run</Button>}\n>\n  <p>RUN 0284 converged after 18 passes.</p>\n</Popover>',
      ),
      description: 'Keep short interactive or inspectable content attached to its source.',
      title: 'Anchored run summary',
    },
  ],
  exportName: 'Popover',
  formBehavior: [
    'Popover is not a form. Consumer-owned fields may appear in the body when their submit and validation behavior remain explicit.',
  ],
  importPath: '.',
  inappropriateUses: [
    'supplemental non-interactive description, a command list, consequential confirmation, deep work, or content that must remain visible',
  ],
  keyboardBehavior: [
    'Enter or Space opens from its Button trigger, Tab moves through interactive content, and Escape closes and restores focus.',
  ],
  kind: 'component',
  labeling: [
    'title and description are required visible strings. closeLabel names the icon-only close control.',
  ],
  localization: [
    'Localize the trigger, title, description, close label, body, and actions. Copy wraps without detaching the surface from its anchor.',
  ],
  name: 'Popover',
  parts: [
    'Popover includes one trigger, joined anchor arrow, labeled dialog surface, title, description, close control, body, and optional actions.',
  ],
  preferredAlternatives: [
    'Use Tooltip for description, Menu for commands, AlertDialog for consequential confirmation, or Dialog for a larger bounded task.',
  ],
  preferredCompositions: [
    'Compose Popover with short field or inspection content and library Button actions near the object they affect.',
  ],
  purpose: 'Popover holds short interactive content beside the control that opened it.',
  relatedExports: ['AlertDialog', 'AppearanceProvider', 'Button', 'Dialog', 'Menu', 'Tooltip'],
  states: [
    'Closed and open may be controlled or uncontrolled. placement and alignment request a logical anchor while collision handling may flip the rendered side.',
  ],
  summary: 'Place short interactive content beside its trigger with owned focus and dismissal.',
  validation: [
    'TypeScript limits placement and alignment choices. Runtime validation requires exactly one rendered library Button or IconButton trigger.',
  ],
} satisfies ComponentContract;

export const tooltipContract = {
  ...commonAnchoredGuidance,
  accentBehavior: [
    'Tooltip keeps its surface, boundary, and anchor bridge neutral. The application accent remains on the wrapped Button focus treatment rather than entering descriptive content.',
  ],
  accessibility: [
    'Tooltip adds a supplemental accessible description to its already named trigger and never receives focus or contains interactive content.',
  ],
  appearance: [
    'Tooltip is a compact high-contrast label with a joined anchor arrow and no interactive chrome.',
  ],
  appropriateUses: [
    'a named control benefits from a short supplemental non-interactive description',
  ],
  composition: [
    'Render inside AppearanceProvider and wrap exactly one library Button that already has its own accessible name. IconButton owns its label tooltip and must not receive a second tooltip.',
    'Pass plain string content. Interactive descendants are unrepresentable through the public type.',
  ],
  contentRules: [
    'Write one supplemental description that clarifies effect, state, or consequence. Keep the control name on the trigger itself.',
  ],
  controlBehavior: [
    'Tooltip appears after a short hover or keyboard-focus delay, remains while the trigger is hovered or focused, and closes after pointer or focus departure or Escape.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'UnnamedTooltipCounterexample',
        '<Tooltip content="Delete run">\n  <Button><span aria-hidden="true">×</span></Button>\n</Tooltip>',
      ),
      description:
        'Tooltip content does not replace the trigger name. Use IconButton with label when an icon-only command needs a name.',
      title: 'Do not use Tooltip as the accessible name',
    },
  ],
  directionality: [
    'Logical placement, text alignment, and the anchor arrow follow the trigger writing direction.',
  ],
  events: [
    'Tooltip exposes no application event. The wrapped control continues to own its action.',
  ],
  examples: [
    {
      code: inProvider(
        'CopyRunTooltip',
        '<Tooltip content="Copies the immutable run identifier.">\n  <Button>Copy run ID</Button>\n</Tooltip>',
      ),
      description: 'Add supporting detail without changing the visible or accessible control name.',
      title: 'Supplemental command description',
    },
  ],
  exportName: 'Tooltip',
  formBehavior: [
    'Tooltip does not submit or validate data and does not change the wrapped control form behavior.',
  ],
  importPath: '.',
  inappropriateUses: [
    'an accessible name, required interactive content, errors, durable instructions, touch-only discovery, or information needed to complete the task',
  ],
  keyboardBehavior: [
    'Keyboard focus on the trigger reveals the description after the same bounded delay; Escape dismisses it without moving focus.',
  ],
  kind: 'component',
  labeling: [
    'The trigger keeps its own accessible name. content becomes a description through the tooltip relationship.',
  ],
  localization: ['Localize content as a complete short phrase and allow it to wrap.'],
  name: 'Tooltip',
  parts: ['Tooltip includes one named trigger, a non-focusable description, and its joined arrow.'],
  preferredAlternatives: [
    'Use visible support text for required instructions, Popover for interactive content, or Menu for commands.',
  ],
  preferredCompositions: [
    'Use Tooltip sparingly on named compact actions whose effect benefits from one extra sentence.',
  ],
  purpose: 'Tooltip adds a short supplemental description to an already named control.',
  relatedExports: ['AppearanceProvider', 'Button', 'IconButton', 'Menu', 'Popover'],
  states: [
    'Hidden and visible follow trigger hover and focus. placement and alignment request the anchor while collision handling may flip it.',
  ],
  summary: 'Add a non-interactive description to an already named control.',
  validation: [
    'TypeScript limits content to a string and placement to library-owned choices. Runtime validation requires exactly one rendered library Button trigger.',
  ],
} satisfies ComponentContract;

export const menuContract = {
  ...commonAnchoredGuidance,
  accessibility: [
    'Menu owns menu and menuitem semantics, focus movement, disabled state, groups, separators, submenu relationships, and focus restoration.',
  ],
  appearance: [
    'Menu is a compact raised instrument with whole-row hover and focus highlights, subdued group labels, and a joined anchor arrow.',
  ],
  appropriateUses: [
    'a Button or IconButton opens a bounded list of immediate application commands',
  ],
  composition: [
    'Render inside AppearanceProvider so the surface, threshold, items, and focus treatment share the active theme and application accent.',
    'Pass library-owned items with stable ids, labels, callbacks, and optional descriptions, shortcuts, disabled state, danger tone, groups, separators, or submenus.',
    'Pass exactly one library Button or IconButton trigger. Consumers do not compose private menu parts or attach handlers to rendered rows.',
  ],
  contentRules: [
    'Use direct verb phrases for actions, group only commands that share a clear purpose, and show a shortcut only when the application implements it outside the open menu.',
  ],
  controlBehavior: [
    'Menu opens from press, dismisses after an enabled action, outside press, or Escape, and supports controlled isOpen with onOpenChange or uncontrolled defaultOpen.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'NavigationMenuCounterexample',
        '<Menu\n  items={[{id: "settings", label: "Settings", onAction: () => {}, type: "action"}]}\n  trigger={<Button>Application sections</Button>}\n/>',
      ),
      description:
        'Persistent destinations need a navigation component. Menu represents immediate commands rather than application structure.',
      title: 'Do not replace persistent navigation',
    },
  ],
  directionality: [
    'Logical placement, item copy, shortcuts, submenu arrows, and submenu opening keys follow the trigger writing direction.',
  ],
  events: [
    'An enabled action calls its onAction once and closes the complete menu path. onOpenChange reports root open-state transitions.',
  ],
  examples: [
    {
      code: inProvider(
        'RunActionsMenu',
        '<Menu\n  items={[\n    {id: "duplicate", label: "Duplicate run", onAction: () => {}, type: "action"},\n    {id: "divider", type: "separator"},\n    {id: "delete", label: "Delete run", onAction: () => {}, tone: "danger", type: "action"},\n  ]}\n  trigger={<Button>Run actions</Button>}\n/>',
      ),
      description: 'Offer a short command list anchored to the action that reveals it.',
      title: 'Run command menu',
    },
  ],
  exportName: 'Menu',
  formBehavior: [
    'Menu actions do not submit forms implicitly. An onAction callback may perform explicit application or form work.',
  ],
  importPath: '.',
  inappropriateUses: [
    'selection among values, persistent navigation, arbitrary interactive content, status, or actions attached to a pointer location rather than a menu button',
  ],
  keyboardBehavior: [
    'Arrow keys move roving focus, printable characters provide typeahead, Home and End reach boundaries, Enter or Space runs an action, logical ArrowRight opens a submenu, logical ArrowLeft returns, and Escape dismisses.',
  ],
  kind: 'component',
  labeling: [
    'The trigger accessible name labels the menu. Every command and submenu has a concise label; descriptions and shortcuts remain supplementary.',
  ],
  localization: [
    'Localize trigger, group, command, description, and shortcut display strings. Labels wrap and typeahead uses the active locale.',
  ],
  name: 'Menu',
  parts: [
    'Menu owns its trigger relationship, anchored surface, arrow, command rows, groups, separators, descriptions, shortcuts, disabled states, and nested submenu surfaces.',
  ],
  preferredAlternatives: [
    'Use Select for value selection, ContextMenu for object actions at pointer location, Popover for arbitrary interactive content, or navigation components for destinations.',
  ],
  preferredCompositions: [
    'Use Menu from a library Button or IconButton near the object or toolbar whose commands it contains.',
  ],
  purpose: 'Menu presents a library-owned list of immediate commands from an explicit trigger.',
  relatedExports: [
    'AppearanceProvider',
    'Button',
    'ContextMenu',
    'IconButton',
    'Popover',
    'Select',
  ],
  states: [
    'The root and each submenu may be closed or open. Items may be enabled or disabled, neutral or danger, described, grouped, separated, or nested.',
  ],
  summary: 'Open an owned command list from an explicit Button or IconButton trigger.',
  validation: [
    'TypeScript requires discriminated library-owned item records and bounded placement, alignment, state, and tone choices. Runtime validation requires one rendered Button or IconButton trigger.',
  ],
} satisfies ComponentContract;

export const contextMenuContract = {
  ...commonAnchoredGuidance,
  accessibility: [
    'ContextMenu gives its target an accessible name and keyboard focus, owns menu semantics and navigation, and restores focus after dismissal or selection.',
  ],
  appearance: [
    'ContextMenu uses the same compact command surface and whole-row item highlights as Menu, anchored to the invocation point.',
  ],
  appropriateUses: ['an object or bounded region has secondary commands at its invocation point'],
  composition: [
    'Render inside AppearanceProvider so the target focus, command surface, threshold, and items share the active theme and application accent.',
    'Pass target content, a targetLabel, and the same library-owned item model used by Menu. ContextMenu owns the focusable target region and rendered command parts.',
  ],
  contentRules: [
    'Include only actions that apply to the named target and keep every important action available through a visible or otherwise discoverable path.',
  ],
  controlBehavior: [
    'Right-click, platform context-menu gestures, touch long press, and Shift+F10 open the menu at the invocation point. An enabled action, outside press, or Escape dismisses it.',
  ],
  counterExamples: [
    {
      code: inProvider(
        'OnlyDeleteContextMenuCounterexample',
        '<ContextMenu\n  items={[{id: "delete", label: "Delete run", onAction: () => {}, tone: "danger", type: "action"}]}\n  targetLabel="RUN 0284"\n>\n  <span>RUN 0284</span>\n</ContextMenu>',
      ),
      description:
        'A context menu cannot be the only path to an important or consequential action. Keep a visible discoverable path and confirm deletion with AlertDialog.',
      title: 'Do not hide the only action path',
    },
  ],
  directionality: [
    'Item copy, shortcuts, submenu arrows, and keyboard opening follow the target writing direction while the surface remains within the viewport.',
  ],
  events: [
    'An enabled command calls onAction once and closes the complete menu path. onOpenChange reports open-state transitions when state is controlled.',
  ],
  examples: [
    {
      code: inProvider(
        'BoundaryContextMenu',
        '<ContextMenu\n  items={[{id: "inspect", label: "Inspect boundary", onAction: () => {}, type: "action"}]}\n  targetLabel="Boundary condition BC-12"\n>\n  <span>BC-12 · insulated</span>\n</ContextMenu>',
      ),
      description: 'Attach secondary commands to one named object and preserve keyboard access.',
      title: 'Boundary object actions',
    },
  ],
  exportName: 'ContextMenu',
  formBehavior: [
    'Context-menu actions do not submit forms implicitly. An onAction callback may perform explicit application or form work.',
  ],
  importPath: '.',
  inappropriateUses: [
    'the only path to an important action, primary navigation, value selection, arbitrary interactive content, or an unlabeled region',
  ],
  keyboardBehavior: [
    'Shift+F10 opens from the focused target. Arrow keys, typeahead, Home, End, Enter, Space, submenu keys, and Escape match Menu behavior.',
  ],
  kind: 'component',
  labeling: [
    'targetLabel names the focusable target and therefore labels its context menu. Item labels name every command and submenu.',
  ],
  localization: [
    'Localize the target label and all item copy. Typeahead uses the active locale and logical submenu keys follow direction.',
  ],
  name: 'ContextMenu',
  parts: [
    'ContextMenu owns a focusable target region, invocation-point anchor, command surface, items, groups, separators, and submenus.',
  ],
  preferredAlternatives: [
    'Use Menu for a visible command trigger, Popover for interactive content, or AlertDialog to confirm a consequential action.',
  ],
  preferredCompositions: [
    'Pair ContextMenu with a visible Menu or ordinary Button path when actions must remain readily discoverable.',
  ],
  purpose: 'ContextMenu presents secondary commands for one named object at its invocation point.',
  relatedExports: ['AlertDialog', 'AppearanceProvider', 'Button', 'Menu', 'Popover'],
  states: [
    'Closed and open may be controlled or uncontrolled. Invocation may come from pointer, touch, or keyboard, and item states match Menu.',
  ],
  summary:
    'Open secondary object commands by context gesture with keyboard and touch alternatives.',
  validation: [
    'TypeScript requires a target label and discriminated library-owned items. The owned focusable target keeps context activation and restoration coherent.',
  ],
} satisfies ComponentContract;
