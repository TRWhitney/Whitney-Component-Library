import type {ComponentContract} from './component-contract.js';

const passiveLayoutGuidance = {
  directionality: [
    'Logical block and inline properties follow the inherited writing direction without a direction override.',
  ],
  events: ['The primitive emits no callbacks and has no interactive state.'],
  formBehavior: [
    'The primitive does not submit values or participate in reset, validation, required, disabled, or read-only form state.',
  ],
  localization: [
    'The primitive renders consumer content without translating, reordering, or constructing localized sentences.',
  ],
  reducedMotionBehavior: [
    'The primitive has no motion, so the reduced-motion setting does not change it.',
  ],
  states: [
    'The primitive has no internal state. Changing a prop updates its structural attributes.',
  ],
  stylesheet: './styles.css',
  validation: [
    'The TypeScript API rejects custom classes, inline styles, token values, and unsupported options.',
  ],
} satisfies Pick<
  ComponentContract,
  | 'directionality'
  | 'events'
  | 'formBehavior'
  | 'localization'
  | 'reducedMotionBehavior'
  | 'states'
  | 'stylesheet'
  | 'validation'
>;

function withinAppearanceProvider(lines: readonly string[]): string {
  const returnLine = lines.indexOf('  return (');
  const closingLine = lines.lastIndexOf('  );');
  if (returnLine < 0 || closingLine <= returnLine) {
    throw new Error('Layout contract examples must contain one returned JSX tree.');
  }

  return [
    ...lines.slice(0, returnLine + 1),
    '    <AppearanceProvider appearance="light" accent="#2474ff">',
    ...lines.slice(returnLine + 1, closingLine).map((line) => `  ${line}`),
    '    </AppearanceProvider>',
    ...lines.slice(closingLine),
  ].join('\n');
}

export const stackContract = {
  ...passiveLayoutGuidance,
  appearance: ['Stack uses the library spacing scale and adds no color.'],
  accentBehavior: ['Stack does not apply the application accent.'],
  accessibility: [
    'Stack changes layout only. Use the appropriate child elements for lists, navigation, regions, and headings.',
  ],
  appropriateUses: [
    'related elements need a consistent vertical rhythm with one semantic spacing and alignment choice',
  ],
  composition: [
    'Size application regions and controls independently: use intrinsic widths for short commands and choices, bound text-entry widths by expected input, and deliberately position bounded content within the remaining workspace. A full-width parent does not require stretched children.',
    'Keep related controls together with bounded gaps. Do not distribute spare container height between form rows. Inspect parent gaps together with child padding and reserved support rows before adding more space.',

    'Render Stack inside AppearanceProvider to load its spacing tokens.',
    'Place related siblings directly inside Stack and nest another layout primitive only when the relationship changes.',
  ],
  contentRules: ['Keep children in reading order and give each one the appropriate HTML element.'],
  controlBehavior: [
    'The gap and alignment props use preset values. They default to regular spacing and stretch alignment.',
  ],
  counterExamples: [
    {
      title: 'Do not simulate a data table',
      description:
        'Use the future table primitive when values require shared columns and row semantics.',
      code: withinAppearanceProvider([
        'export function MisalignedReadings() {',
        '  return (',
        '    <Stack gap="none">',
        '      <span>North chamber 18.2 K</span>',
        '      <span>South chamber 4.8 K</span>',
        '    </Stack>',
        '  );',
        '}',
      ]),
    },
  ],
  exportName: 'Stack',
  forcedColorBehavior: [
    'Forced colors do not change Stack geometry because Stack paints no decorative color.',
  ],
  importPath: '.',
  inappropriateUses: [
    'content requires tabular alignment, collection semantics, or an arbitrary one-off spacing value',
  ],
  keyboardBehavior: ['Stack introduces no focus target or keyboard behavior.'],
  kind: 'component',
  labeling: ['Stack creates no semantic region and receives no label.'],
  name: 'Stack',
  parts: ['Stack exposes one ordered children region and no named parts.'],
  preferredAlternatives: [
    'Use InlineGroup for a horizontal peer relationship and ResponsiveGrid for responsive columns.',
  ],
  preferredCompositions: [
    'Use Stack inside Surface or Section for a compact vertical field, status, or content sequence.',
  ],
  purpose: 'Stack arranges related elements vertically with consistent spacing.',
  relatedExports: ['AppearanceProvider', 'InlineGroup', 'ResponsiveGrid', 'Section', 'Surface'],
  responsiveBehavior: [
    'Stack stays vertical at every width. Its children decide how they wrap or reflow.',
  ],
  summary: 'Arrange related content vertically with consistent spacing.',
  examples: [
    {
      title: 'Arrange a field summary',
      description: 'Use regular vertical rhythm for related labels and values.',
      code: withinAppearanceProvider([
        'export function SolverSummary() {',
        '  return (',
        '    <Stack gap="regular">',
        '      <strong>Solver</strong>',
        '      <span>Adaptive mesh</span>',
        '    </Stack>',
        '  );',
        '}',
      ]),
    },
  ],
} satisfies ComponentContract;

export const inlineGroupContract = {
  ...passiveLayoutGuidance,
  appearance: ['InlineGroup uses the library spacing scale and adds no color.'],
  accentBehavior: ['InlineGroup does not apply the application accent.'],
  accessibility: [
    'InlineGroup changes layout only. Child controls keep their names, roles, states, and focus order.',
  ],
  appropriateUses: [
    'peer controls, labels, or compact values belong on one line and may wrap as a unit',
  ],
  composition: [
    'Render InlineGroup inside AppearanceProvider to load its spacing tokens.',
    'Place equivalent peers directly inside InlineGroup and enable equalItems only when their roles should have equal dimensions.',
  ],
  contentRules: [
    'Keep children in reading and tab order; do not reorder peers visually with consumer CSS.',
  ],
  controlBehavior: [
    'Preset props control gap, alignment, wrapping, and equal-item sizing. Equal items share both dimensions.',
  ],
  counterExamples: [
    {
      title: 'Do not force prose into a control row',
      description: 'Use Stack when a description should remain a separate reading block.',
      code: withinAppearanceProvider([
        'export function CrowdedExplanation() {',
        '  return (',
        '    <InlineGroup wrap={false}>',
        '      <button type="button">Run</button>',
        '      <p>Review every boundary condition before starting the solver.</p>',
        '    </InlineGroup>',
        '  );',
        '}',
      ]),
    },
  ],
  exportName: 'InlineGroup',
  forcedColorBehavior: [
    'Forced colors do not change InlineGroup geometry because InlineGroup paints no decorative color.',
  ],
  importPath: '.',
  inappropriateUses: [
    'children form a vertical sequence, need responsive columns, or have unequal semantic roles that should not be equalized',
  ],
  keyboardBehavior: ['InlineGroup keeps child focus order and adds no keyboard behavior.'],
  kind: 'component',
  labeling: ['InlineGroup creates no semantic group and receives no label.'],
  name: 'InlineGroup',
  parts: ['InlineGroup exposes one peer-children region and no named parts.'],
  preferredAlternatives: [
    'Use Stack for vertical rhythm and ResponsiveGrid for independent responsive columns.',
  ],
  preferredCompositions: [
    'Use equalItems for adjacent equivalent controls, actions, or repeated regions that must align consistently.',
  ],
  purpose: 'InlineGroup arranges peers with preset spacing, alignment, wrapping, and equal sizing.',
  relatedExports: ['AppearanceProvider', 'ResponsiveGrid', 'Stack'],
  responsiveBehavior: [
    'Wrapping is enabled by default; disabling it is appropriate only when the complete row remains reachable at compact widths.',
  ],
  summary: 'Arrange peer content inline with optional equal sizing.',
  examples: [
    {
      title: 'Align equivalent actions',
      description: 'Equalize adjacent actions that carry equivalent weight.',
      code: withinAppearanceProvider([
        'export function ReviewActions() {',
        '  return (',
        '    <InlineGroup gap="tight" equalItems>',
        '      <button type="button">Review</button>',
        '      <button type="button">Run profile</button>',
        '    </InlineGroup>',
        '  );',
        '}',
      ]),
    },
  ],
} satisfies ComponentContract;

export const responsiveGridContract = {
  ...passiveLayoutGuidance,
  appearance: ['ResponsiveGrid uses preset spacing and minimum item widths and adds no color.'],
  accentBehavior: ['ResponsiveGrid does not apply the application accent.'],
  accessibility: [
    'ResponsiveGrid changes visual columns without changing DOM order, reading order, or focus order.',
  ],
  appropriateUses: [
    'equivalent regions should fill available width and collapse into fewer columns from a semantic minimum size',
  ],
  composition: [
    'Render ResponsiveGrid inside AppearanceProvider to load its spacing tokens.',
    'Put one complete item in each direct child and choose a compact, regular, or wide minimum width.',
  ],
  contentRules: ['Each child must still make sense when it moves to its own row.'],
  controlBehavior: ['Preset props control minimum item width, gap, and optional equal row sizing.'],
  counterExamples: [
    {
      title: 'Do not replace tabular relationships',
      description: 'Use the future table primitive when every row must share column meaning.',
      code: withinAppearanceProvider([
        'export function ReadingColumns() {',
        '  return (',
        '    <ResponsiveGrid minimumItemWidth="compact">',
        '      <span>Chamber</span>',
        '      <span>Temperature</span>',
        '    </ResponsiveGrid>',
        '  );',
        '}',
      ]),
    },
  ],
  exportName: 'ResponsiveGrid',
  forcedColorBehavior: [
    'Forced colors do not change grid geometry because ResponsiveGrid paints no decorative color.',
  ],
  importPath: '.',
  inappropriateUses: [
    'content requires a fixed table, consumer-authored breakpoint, masonry placement, or visual reordering',
  ],
  keyboardBehavior: ['ResponsiveGrid keeps child focus order and adds no keyboard behavior.'],
  kind: 'component',
  labeling: ['ResponsiveGrid creates no semantic collection and receives no label.'],
  name: 'ResponsiveGrid',
  parts: ['ResponsiveGrid exposes one item-children region and no named parts.'],
  preferredAlternatives: [
    'Use Stack for a permanently vertical sequence and InlineGroup for one peer row.',
  ],
  preferredCompositions: [
    'Use equalItems with equivalent Surface or Section regions when aligned outer dimensions communicate parity.',
  ],
  purpose: 'ResponsiveGrid forms columns from preset minimum item widths.',
  relatedExports: ['AppearanceProvider', 'InlineGroup', 'Stack', 'Surface'],
  responsiveBehavior: [
    'Columns are derived from available inline size with auto-fit and collapse without a consumer breakpoint.',
  ],
  summary: 'Form responsive columns from preset minimum item widths.',
  examples: [
    {
      title: 'Arrange equivalent regions',
      description: 'Let equivalent regions collapse from wide columns without a custom breakpoint.',
      code: withinAppearanceProvider([
        'export function ChamberRegions() {',
        '  return (',
        '    <ResponsiveGrid minimumItemWidth="wide" equalItems>',
        '      <article>North chamber</article>',
        '      <article>South chamber</article>',
        '    </ResponsiveGrid>',
        '  );',
        '}',
      ]),
    },
  ],
} satisfies ComponentContract;

export const dividerContract = {
  ...passiveLayoutGuidance,
  appearance: ['Divider draws one complete rule with the library neutral border color.'],
  accentBehavior: ['Divider uses the neutral border role rather than the application accent.'],
  accessibility: [
    'A meaningful Divider exposes the separator role and orientation; a decorative Divider is hidden from assistive technology.',
  ],
  appropriateUses: ['two adjacent groups need a complete visual and semantic separation'],
  composition: [
    'Render Divider inside AppearanceProvider to load its neutral border color.',
    'Place Divider between complete sibling groups; let the parent layout own spacing around it.',
  ],
  contentRules: ['Divider accepts no children, label, icon, or status content.'],
  controlBehavior: ['Props set the orientation and whether the line is meaningful or decorative.'],
  counterExamples: [
    {
      title: 'Do not add ornamental fragments',
      description: 'Avoid disconnected rules that imply a relationship without separating groups.',
      code: withinAppearanceProvider([
        'export function DecorativeFragments() {',
        '  return (',
        '    <div>',
        '      <Divider decorative />',
        '      <Divider decorative />',
        '      <p>Stable</p>',
        '    </div>',
        '  );',
        '}',
      ]),
    },
  ],
  exportName: 'Divider',
  forcedColorBehavior: ['Forced-color mode paints Divider with the CanvasText system color.'],
  importPath: '.',
  inappropriateUses: [
    'spacing alone establishes the grouping or a partial decorative line would terminate without structural meaning',
  ],
  keyboardBehavior: ['Divider is never focusable and introduces no keyboard behavior.'],
  kind: 'component',
  labeling: ['Divider receives no label; surrounding groups carry their own labels.'],
  name: 'Divider',
  parts: ['Divider is one complete horizontal or vertical rule with no named parts.'],
  preferredAlternatives: [
    'Use Stack or InlineGroup spacing when content is related and no semantic separation is needed.',
  ],
  preferredCompositions: [
    'Use Divider between full sibling regions, never through controls or across unrelated content.',
  ],
  purpose: 'Divider separates adjacent groups with one complete neutral rule.',
  relatedExports: ['AppearanceProvider', 'InlineGroup', 'Stack'],
  responsiveBehavior: [
    'A horizontal Divider fills available inline size and a vertical Divider stretches with its parent group.',
  ],
  summary: 'Separate adjacent groups with a complete neutral rule.',
  examples: [
    {
      title: 'Separate two content groups',
      description: 'Use one semantic rule between complete sibling groups.',
      code: withinAppearanceProvider([
        'export function RunGroups() {',
        '  return (',
        '    <div>',
        '      <p>Geometry validated</p>',
        '      <Divider />',
        '      <p>Solve pending</p>',
        '    </div>',
        '  );',
        '}',
      ]),
    },
  ],
} satisfies ComponentContract;

export const surfaceContract = {
  ...passiveLayoutGuidance,
  appearance: [
    'Surface uses the library shape, background, text, and border styles. The raised variant adds a small shadow.',
  ],
  accentBehavior: ['Surface stays neutral. It does not apply accent, status, or selection colors.'],
  accessibility: [
    'Surface only groups content visually. Use Section or an appropriate child element when the region needs a name or landmark.',
  ],
  appropriateUses: [
    'related content needs one rounded, opaque, density-controlled containment region',
  ],
  composition: [
    'Render Surface inside AppearanceProvider to load its appearance and container tokens.',
    'Choose base, raised, or subtle from actual hierarchy and compose content with layout primitives inside.',
  ],
  contentRules: [
    'Keep one related content region inside a Surface. Do not nest surfaces just to add space.',
  ],
  controlBehavior: [
    'Preset props control variant and padding. Surface has no selection or expansion state.',
  ],
  counterExamples: [
    {
      title: 'Do not stack decorative containers',
      description:
        'Use layout spacing instead of nesting neutral surfaces without a hierarchy change.',
      code: withinAppearanceProvider([
        'export function NestedDecoration() {',
        '  return (',
        '    <Surface variant="raised">',
        '      <Surface variant="subtle">Stable</Surface>',
        '    </Surface>',
        '  );',
        '}',
      ]),
    },
  ],
  exportName: 'Surface',
  forcedColorBehavior: [
    'Forced-color mode uses Canvas and CanvasText, keeps the border, and removes the shadow.',
  ],
  importPath: '.',
  inappropriateUses: [
    'Surface alone is expected to provide a semantic name, active accent glow, status meaning, or arbitrary card styling',
  ],
  keyboardBehavior: ['Surface introduces no focus target or keyboard behavior.'],
  kind: 'component',
  labeling: ['Surface creates no region role and receives no label.'],
  name: 'Surface',
  parts: ['Surface exposes one opaque children region and no named parts.'],
  preferredAlternatives: [
    'Compose Section inside Surface when rounded containment also needs a visible semantic name; use semantic feedback components for success, warning, or failure.',
  ],
  preferredCompositions: [
    'Compose Section, Stack, ResponsiveGrid, or ScrollRegion inside one Surface when each adds a distinct relationship.',
  ],
  purpose: 'Surface groups related content with neutral hierarchy, padding, and rounded corners.',
  relatedExports: ['AppearanceProvider', 'ResponsiveGrid', 'ScrollRegion', 'Section', 'Stack'],
  responsiveBehavior: [
    'Surface keeps its border and padding at every width. Descendants control their own reflow.',
  ],
  summary: 'Group related content in a neutral container.',
  examples: [
    {
      title: 'Contain a working region',
      description: 'Use a base surface for one working region.',
      code: withinAppearanceProvider([
        'export function WorkingRegion() {',
        '  return (',
        '    <Surface variant="base" padding="regular">',
        '      <Stack gap="regular">',
        '        <h2>North chamber</h2>',
        '        <p>Evaluate the 18-minute ramp profile.</p>',
        '      </Stack>',
        '    </Surface>',
        '  );',
        '}',
      ]),
    },
  ],
} satisfies ComponentContract;

export const sectionContract = {
  ...passiveLayoutGuidance,
  appearance: [
    'Section uses the library text and spacing styles but adds no background or border.',
  ],
  accentBehavior: ['Section does not apply the application accent or semantic status color.'],
  accessibility: [
    'Section renders a labeled section landmark whose accessible name comes from its required visible heading.',
  ],
  appropriateUses: [
    'a content region needs a visible title, optional explanation, actions, and body',
  ],
  composition: [
    'Render Section inside AppearanceProvider to load its text and spacing tokens.',
    'Choose the heading level from document hierarchy and keep actions specific to the complete section.',
  ],
  contentRules: [
    'Use a concise string title, an optional explanatory sentence, and body content that belongs under that heading.',
  ],
  controlBehavior: [
    'Props set the title, description, actions, and heading level. Section has no collapse state.',
  ],
  counterExamples: [
    {
      title: 'Do not invent a heading for decoration',
      description: 'Use Stack when related content has no meaningful section name.',
      code: withinAppearanceProvider([
        'export function DecorativeSection() {',
        '  return (',
        '    <Section title="Information">',
        '      <p>Solver: Adaptive mesh</p>',
        '    </Section>',
        '  );',
        '}',
      ]),
    },
  ],
  exportName: 'Section',
  forcedColorBehavior: [
    'Forced-color mode inherits system text and surfaces without adding decorative section color.',
  ],
  importPath: '.',
  inappropriateUses: [
    'content has no meaningful heading, needs disclosure behavior, or uses the title as decorative filler',
  ],
  keyboardBehavior: [
    'Section introduces no focus target; actions keep their own keyboard behavior and DOM order.',
  ],
  kind: 'component',
  labeling: [
    'The required visible title labels the section through a deterministic generated heading id.',
  ],
  name: 'Section',
  parts: ['Section exposes heading, optional description, optional actions, and content regions.'],
  preferredAlternatives: [
    'Use Stack for unnamed grouping and the future disclosure primitive for collapsible content.',
  ],
  preferredCompositions: [
    'Place Section inside Surface for named containment or use it directly when surrounding structure already supplies a surface.',
  ],
  purpose: 'Section gives a content region a visible heading and aligned actions.',
  relatedExports: ['AppearanceProvider', 'InlineGroup', 'Stack', 'Surface'],
  responsiveBehavior: [
    'Heading and actions share a row when space permits and reflow into one column at compact widths without a divider.',
  ],
  summary: 'Name and structure a content region.',
  examples: [
    {
      title: 'Name a review region',
      description: 'Use the visible title as the section accessible name.',
      code: withinAppearanceProvider([
        'export function BoundarySection() {',
        '  return (',
        '    <Section title="Boundary conditions" description="Resolve every condition before running.">',
        '      <p>Six of six conditions resolved.</p>',
        '    </Section>',
        '  );',
        '}',
      ]),
    },
  ],
} satisfies ComponentContract;

export const scrollRegionContract = {
  ...passiveLayoutGuidance,
  appearance: ['ScrollRegion uses the library subtle background, border, and focus styles.'],
  accentBehavior: [
    'ScrollRegion uses the derived focus accent only for keyboard focus and does not tint its content surface.',
  ],
  accessibility: [
    'ScrollRegion is a labeled region and keyboard focus target so overflow remains reachable without a pointer; its native scrollbar stays visible while focus remains within the region.',
  ],
  appropriateUses: [
    'history, source, logs, or dense content needs a constrained scrollable area within the surrounding layout',
  ],
  composition: [
    'Render ScrollRegion inside AppearanceProvider to load its container and focus tokens.',
    'Provide a concise label, one semantic size, and the overflow orientation that matches the content.',
  ],
  contentRules: [
    'Keep essential controls visible when practical and do not hide the only path to an action inside nested scrolling.',
  ],
  controlBehavior: [
    'Preset props control size and overflow direction. The browser controls scroll position and input.',
    'Native overflow determines whether a scrollbar appears; the library changes only its transient thumb visibility.',
  ],
  counterExamples: [
    {
      title: 'Do not replace normal page flow',
      description:
        'Let primary page content grow when it does not need a constrained scroll region.',
      code: withinAppearanceProvider([
        'export function WholePageScroller() {',
        '  return (',
        '    <ScrollRegion label="Application" size="tall">',
        '      <main>Primary application content</main>',
        '    </ScrollRegion>',
        '  );',
        '}',
      ]),
    },
  ],
  exportName: 'ScrollRegion',
  forcedColorBehavior: [
    'Forced-color mode uses Canvas and CanvasText for containment and a continuously visible native scrollbar, plus Highlight for visible focus.',
  ],
  events: [
    'ScrollRegion emits no callbacks and manages only temporary scrollbar visibility. The browser controls scroll position and input.',
  ],
  importPath: '.',
  inappropriateUses: [
    'page content can grow naturally or nested scrolling would hide essential actions and context',
  ],
  keyboardBehavior: [
    'Tab moves focus to the region; native arrow, Page Up, Page Down, Home, and End scrolling remain available where supported.',
  ],
  kind: 'component',
  labeling: ['A concise required label names the region for assistive technology.'],
  name: 'ScrollRegion',
  parts: ['ScrollRegion exposes one labeled, focusable overflow content region.'],
  preferredAlternatives: [
    'Use normal document flow when content does not need a constrained viewport.',
  ],
  preferredCompositions: [
    'Place ScrollRegion inside Surface or Section when a constrained history or source view belongs to that region.',
  ],
  purpose: 'ScrollRegion labels overflow content and keeps it focusable and reachable.',
  relatedExports: ['AppearanceProvider', 'Section', 'Surface'],
  responsiveBehavior: [
    'The region fills the available width and keeps its preset maximum height at every viewport size.',
  ],
  reducedMotionBehavior: [
    'Reduced motion removes the scrollbar fade. Activity, focus, idle visibility, and native scrolling work the same way.',
  ],
  states: [
    'Pointer or scroll activity reveals the native scrollbar thumb and resets its idle interval; the thumb fades after idle while focus keeps it available to keyboard users.',
  ],
  summary: 'Keep overflow content labeled and keyboard accessible.',
  examples: [
    {
      title: 'Bound solver history',
      description: 'Name a compact log region and keep native keyboard scrolling.',
      code: withinAppearanceProvider([
        'export function SolverHistory() {',
        '  return (',
        '    <ScrollRegion label="Solver history" size="compact">',
        '      <pre>Iteration 0284: residual 0.0025 K</pre>',
        '    </ScrollRegion>',
        '  );',
        '}',
      ]),
    },
  ],
} satisfies ComponentContract;
