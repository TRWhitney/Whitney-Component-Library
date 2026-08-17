import type {ComponentContract} from './component-contract.js';

const passiveLayoutGuidance = {
  directionality: [
    'Logical block and inline properties follow the inherited writing direction without a direction override.',
  ],
  events: ['The primitive emits no callback events and owns no interactive state.'],
  formBehavior: [
    'The primitive does not submit values or participate in reset, validation, required, disabled, or read-only form state.',
  ],
  localization: [
    'The primitive renders consumer content without translating, reordering, or constructing localized sentences.',
  ],
  reducedMotionBehavior: [
    'The primitive introduces no motion, so reduced motion preserves the same structure without an alternate transition.',
  ],
  states: [
    'The primitive has no internal state; changing a bounded prop deterministically updates its structural attributes.',
  ],
  stylesheet: './styles.css',
  validation: [
    'The TypeScript API rejects arbitrary classes, inline styles, token values, and unsupported semantic options.',
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
  appearance: [
    'Stack uses library-owned spacing in both appearances and paints no decorative color.',
  ],
  accentBehavior: ['Stack does not apply the application accent.'],
  accessibility: [
    'Stack contributes layout only; use semantic child elements for lists, navigation, regions, and headings.',
  ],
  appropriateUses: [
    'related elements need a consistent vertical rhythm with one semantic spacing and alignment choice',
  ],
  composition: [
    'Render Stack inside AppearanceProvider so its owned spacing tokens are available.',
    'Place related siblings directly inside Stack and nest another layout primitive only when the relationship changes.',
  ],
  contentRules: [
    'Order children in reading order and keep each child responsible for its own semantic element.',
  ],
  controlBehavior: [
    'Gap and cross-axis alignment are controlled by bounded props with regular spacing and stretch alignment as defaults.',
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
  purpose: 'Stack establishes bounded vertical rhythm between related elements.',
  relatedExports: ['AppearanceProvider', 'InlineGroup', 'ResponsiveGrid', 'Section', 'Surface'],
  responsiveBehavior: [
    'Stack remains vertical at every width; children wrap or reflow according to their own contracts.',
  ],
  summary: 'Arrange related content in a bounded vertical rhythm.',
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
  appearance: [
    'InlineGroup uses library-owned spacing in both appearances and paints no decorative color.',
  ],
  accentBehavior: ['InlineGroup does not apply the application accent.'],
  accessibility: [
    'InlineGroup contributes layout only; child controls retain their own names, roles, states, and focus order.',
  ],
  appropriateUses: [
    'peer controls, labels, or compact values belong on one line and may wrap as a unit',
  ],
  composition: [
    'Render InlineGroup inside AppearanceProvider so its owned spacing tokens are available.',
    'Place equivalent peers directly inside InlineGroup and enable equalItems only when their roles should have equal dimensions.',
  ],
  contentRules: [
    'Keep children in reading and tab order; do not reorder peers visually with consumer CSS.',
  ],
  controlBehavior: [
    'Gap, alignment, wrapping, and equivalent-item sizing are controlled by bounded props; equal items share both inline and cross-axis dimensions.',
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
  keyboardBehavior: ['InlineGroup preserves child focus order and adds no keyboard behavior.'],
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
  purpose:
    'InlineGroup arranges peers with bounded spacing, alignment, wrapping, and equal sizing.',
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
  appearance: [
    'ResponsiveGrid uses library-owned spacing and minimum item widths in both appearances and paints no decorative color.',
  ],
  accentBehavior: ['ResponsiveGrid does not apply the application accent.'],
  accessibility: [
    'ResponsiveGrid changes visual columns without changing DOM order, reading order, or focus order.',
  ],
  appropriateUses: [
    'equivalent regions should fill available width and collapse into fewer columns from a semantic minimum size',
  ],
  composition: [
    'Render ResponsiveGrid inside AppearanceProvider so its owned spacing tokens are available.',
    'Place one coherent item in each direct child and choose the minimum width from compact, regular, or wide.',
  ],
  contentRules: ['Keep each child independently understandable when it reflows to its own row.'],
  controlBehavior: [
    'Minimum item width, gap, and optional equal row sizing are controlled by bounded props.',
  ],
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
  keyboardBehavior: ['ResponsiveGrid preserves child focus order and adds no keyboard behavior.'],
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
  purpose: 'ResponsiveGrid forms stable columns from bounded semantic minimum item sizes.',
  relatedExports: ['AppearanceProvider', 'InlineGroup', 'Stack', 'Surface'],
  responsiveBehavior: [
    'Columns are derived from available inline size with auto-fit and collapse without a consumer breakpoint.',
  ],
  summary: 'Form responsive columns from semantic minimum item sizes.',
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
  appearance: [
    'Divider paints one complete rule with the library-owned neutral border role in both appearances.',
  ],
  accentBehavior: ['Divider uses the neutral border role rather than the application accent.'],
  accessibility: [
    'A meaningful Divider exposes the separator role and orientation; a decorative Divider is hidden from assistive technology.',
  ],
  appropriateUses: ['two adjacent groups need a complete visual and semantic separation'],
  composition: [
    'Render Divider inside AppearanceProvider so its owned neutral border role is available.',
    'Place Divider between complete sibling groups; let the parent layout own spacing around it.',
  ],
  contentRules: ['Divider accepts no children, label, icon, or status content.'],
  controlBehavior: [
    'Orientation and whether the line is semantic or decorative are controlled by bounded props.',
  ],
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
    'Surface uses library-owned shape, surface, text, and border roles in both appearances; the raised variant adds restrained elevation.',
  ],
  accentBehavior: [
    'Surface remains neutral and does not apply accent atmosphere, status color, or selection color.',
  ],
  accessibility: [
    'Surface contributes containment only; use Section or semantic children when the region needs a name or landmark.',
  ],
  appropriateUses: [
    'related content needs one rounded, opaque, density-controlled containment region',
  ],
  composition: [
    'Render Surface inside AppearanceProvider so its owned appearance and containment tokens are available.',
    'Choose base, raised, or subtle from actual hierarchy and compose content with layout primitives inside.',
  ],
  contentRules: [
    'Keep one coherent content region inside a Surface and avoid nesting surfaces solely to create spacing.',
  ],
  controlBehavior: [
    'Variant and padding are controlled by bounded semantic props; Surface owns no selection or expansion state.',
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
    'Forced-color mode uses Canvas and CanvasText, preserves the boundary, and removes elevation shadow.',
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
  purpose:
    'Surface contains related content with owned neutral hierarchy, padding, and rounded geometry.',
  relatedExports: ['AppearanceProvider', 'ResponsiveGrid', 'ScrollRegion', 'Section', 'Stack'],
  responsiveBehavior: [
    'Surface preserves its boundary and padding at every width while descendants own their reflow.',
  ],
  summary: 'Contain related content in an owned neutral surface.',
  examples: [
    {
      title: 'Contain a working region',
      description: 'Use a base surface for one coherent working region.',
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
    'Section uses library-owned text and spacing roles in both appearances and paints no containing surface or border.',
  ],
  accentBehavior: ['Section does not apply the application accent or semantic status color.'],
  accessibility: [
    'Section renders a labeled section landmark whose accessible name comes from its required visible heading.',
  ],
  appropriateUses: [
    'a coherent content region needs a visible title, optional explanation, actions, and body',
  ],
  composition: [
    'Render Section inside AppearanceProvider so its owned text and spacing tokens are available.',
    'Choose the heading level from document hierarchy and keep actions specific to the complete section.',
  ],
  contentRules: [
    'Use a concise string title, an optional explanatory sentence, and body content that belongs under that heading.',
  ],
  controlBehavior: [
    'Title, description, actions, and heading level are controlled props; Section owns no collapse state.',
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
  purpose:
    'Section gives one coherent content region a visible, semantic heading and aligned actions.',
  relatedExports: ['AppearanceProvider', 'InlineGroup', 'Stack', 'Surface'],
  responsiveBehavior: [
    'Heading and actions share a row when space permits and reflow into one column at compact widths without a divider.',
  ],
  summary: 'Name and structure a coherent content region.',
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
  appearance: [
    'ScrollRegion uses the library-owned subtle surface, border, and focus roles in both appearances.',
  ],
  accentBehavior: [
    'ScrollRegion uses the derived focus accent only for keyboard focus and does not tint its content surface.',
  ],
  accessibility: [
    'ScrollRegion is a labeled region and keyboard focus target so overflow remains reachable without a pointer; its native scrollbar stays visible while focus remains within the region.',
  ],
  appropriateUses: [
    'bounded history, source, logs, or dense content must remain reachable within a surrounding layout',
  ],
  composition: [
    'Render ScrollRegion inside AppearanceProvider so its owned containment and focus tokens are available.',
    'Provide a concise label, one semantic size, and the overflow orientation that matches the content.',
  ],
  contentRules: [
    'Keep essential controls visible when practical and do not hide the only path to an action inside nested scrolling.',
  ],
  controlBehavior: [
    'Size and overflow orientation are controlled by bounded props; native scrolling owns position and input behavior.',
    'Native overflow determines whether a scrollbar appears; the library changes only its transient thumb visibility.',
  ],
  counterExamples: [
    {
      title: 'Do not replace ordinary page flow',
      description: 'Let primary page content grow when it does not need a bounded context.',
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
    'ScrollRegion exposes no callback events and owns only transient scrollbar visibility state; native scrolling remains the source of position and input behavior.',
  ],
  importPath: '.',
  inappropriateUses: [
    'ordinary page content can grow naturally or nested scrolling would hide essential actions and context',
  ],
  keyboardBehavior: [
    'Tab moves focus to the region; native arrow, Page Up, Page Down, Home, and End scrolling remain available where supported.',
  ],
  kind: 'component',
  labeling: ['A concise required label names the region for assistive technology.'],
  name: 'ScrollRegion',
  parts: ['ScrollRegion exposes one labeled, focusable overflow content region.'],
  preferredAlternatives: [
    'Use normal document flow when content does not require a bounded viewport.',
  ],
  preferredCompositions: [
    'Place ScrollRegion inside Surface or Section when a bounded history or source view belongs to that named region.',
  ],
  purpose: 'ScrollRegion keeps bounded overflow content labeled, focusable, and reachable.',
  relatedExports: ['AppearanceProvider', 'Section', 'Surface'],
  responsiveBehavior: [
    'The region fills available inline size and preserves its semantic maximum block size at compact and wide widths.',
  ],
  reducedMotionBehavior: [
    'Reduced motion removes the scrollbar fade transition while preserving the same activity, focus, idle visibility, and native scrolling behavior.',
  ],
  states: [
    'Pointer or scroll activity reveals the native scrollbar thumb and resets its idle interval; the thumb fades after idle while focus keeps it available to keyboard users.',
  ],
  summary: 'Keep bounded overflow content labeled and keyboard reachable.',
  examples: [
    {
      title: 'Bound solver history',
      description: 'Name a compact log region and preserve keyboard scrolling.',
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
