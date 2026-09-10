import type {ComponentContract} from './component-contract.js';

type ChartName =
  | 'AreaChart'
  | 'BarChart'
  | 'BoxPlot'
  | 'BubbleChart'
  | 'CartesianChart'
  | 'ColumnChart'
  | 'DonutChart'
  | 'Heatmap'
  | 'Histogram'
  | 'LineChart'
  | 'PieChart'
  | 'RadarChart'
  | 'ScatterChart'
  | 'Sparkline';

interface ChartContractOptions {
  readonly alternative: string;
  readonly counterExample: string;
  readonly example: string;
  readonly misuse: string;
  readonly name: ChartName;
  readonly purpose: string;
  readonly use: string;
}

const activationTiming =
  'Activation uses shared 620ms timing and easing, with feedback removed at 650ms. Repeated activation restarts feedback; reduced motion displays a static cue for the same lifetime.';
const outlineMotion =
  'Outline pulses use a four-pixel stroke, a five-pixel outset, and three pixels of outward travel per edge at every rendered size. Degenerate lines retain their zero dimension. Selection and value-bearing geometry do not move.';

const chartNames = [
  'AreaChart',
  'BarChart',
  'BoxPlot',
  'BubbleChart',
  'CartesianChart',
  'ColumnChart',
  'DonutChart',
  'Heatmap',
  'Histogram',
  'LineChart',
  'PieChart',
  'RadarChart',
  'ScatterChart',
  'Sparkline',
] as const;

function example(name: string, body: string): string {
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

function chartContract({
  alternative,
  counterExample,
  example: exampleCode,
  misuse,
  name,
  purpose,
  use,
}: ChartContractOptions): ComponentContract {
  return {
    accentBehavior: [
      'Application accent identifies the first ordinary series and accent annotations. Later ordinary series orbit that accent with an achromatic fallback, and automatic colors avoid explicit ordinary choices. Success, warning, and danger remain semantic colors.',
    ],
    accessibility: [
      'The required visible title names one figure and the required description explains its point. One title-derived keyboard boundary announces the active category, visible series values, and comparable numeric reference lines. The SVG remains hidden from assistive technology while a generated native data table exposes every valid value, including hidden series whose headers identify them as hidden.',
    ],
    appearance: [
      'A direct instrument plot uses restrained grid and axis rails with readable utility typography. Filled marks use softened series color beneath stronger lines and boundaries. Dash and outline patterns supplement color when series overlap. The component does not add a card, dashboard chrome, or workflow layout.',
    ],
    appropriateUses: [use],
    composition: [
      'Render inside AppearanceProvider in the consumer-owned layout. Supply the records, typed accessors, axes, series, and state copy that describe this data view. A visible legend is required whenever the chart has more than one series; annotations remain optional. Supply visibilityLabels and a named legend to enable separate eye controls, including for a single series.',
    ],
    contentRules: [
      'Use a specific title, one-sentence description, one to six short series labels, explicit axis labels and units, stable series ids, and only annotations that materially aid interpretation. Neutral or accent lines and bands are references; warning or danger lines and bands identify genuine semantic thresholds.',
    ],
    controlBehavior: [
      `${name} reads the nearest recorded category on pointer, keyboard, or touch input. Its tooltip reports visible series and each numeric reference line on the value axis, and never interpolates values between records or during scale animation.`,
      'Legend hover and focus emphasize one series. Click, Enter, or Space pins that emphasis; repeat the action or press Escape to clear it. Repeating the action also clears temporary hover/focus emphasis without moving keyboard focus. Emphasis never hides data, changes a domain, or filters records.',
      'Optional visibilityLabels enables unboxed open/closed eye buttons alongside series names. Each eye hides or restores its series without changing name-based emphasis. Hidden entries keep their order, color, and pattern. Hiding clears that series pin; restoring it does not repin it.',
      'Automatic numeric bounds fit visible series with brief, interruptible animation. Explicit consumer domains stay fixed, filled marks keep their zero baseline, and logarithmic bounds remain positive. Stacks recompute from visible series. Normalized plots and readings recompute visible shares on a 0-to-1 scale; the complete table retains shares of the full supplied data.',
      ['LineChart', 'BarChart', 'ColumnChart', 'AreaChart', 'CartesianChart'].includes(name)
        ? 'Optional interaction enables application activation and selection independently. The chart does not mutate supplied data or own application workflow.'
        : `${name} emits no consumer events and does not coordinate selection, mutate data, or own application workflow.`,
    ],
    counterExamples: [
      {
        code: example(`Misused${name}`, counterExample),
        description: misuse,
        title: `Do not misuse ${name}`,
      },
    ],
    directionality: [
      'Titles, descriptions, legends, and category labels follow inherited writing direction. Numeric axes preserve their mathematical order and horizontal plots retain low-to-high value progression.',
    ],
    events: [
      `${name} manages reading, legend emphasis, and optional series visibility internally${['LineChart', 'BarChart', 'ColumnChart', 'AreaChart', 'CartesianChart'].includes(name) ? '' : ' without emitting consumer callbacks'}. Hiding or restoring series changes automatic bounds and visible readings without changing the supplied records. Stable series ids preserve visibility across value changes; removed series lose their hidden and pinned state, and new series start visible.`,
    ],
    examples: [
      {
        code: example(`${name}Example`, exampleCode),
        description: purpose,
        title: `${name} with accessible source data`,
      },
    ],
    exportName: name,
    forcedColorBehavior: [
      'Forced colors preserve axis and grid structure, retain series dash and outline patterns in system foreground and highlight colors, and keep the generated data table as the complete non-color representation.',
    ],
    formBehavior: [
      'Charts are not form controls and do not submit, validate, or reset values. Filter and range controls belong beside the chart in consumer-owned composition.',
    ],
    importPath: '.',
    inappropriateUses: [misuse],
    keyboardBehavior: [
      'Tab reaches one title-named chart boundary and starts a keyboard reading. Pointer focus does not start a keyboard reading; a pointer press clears any previous keyboard reading. Left and Right read horizontal categories; Up and Down read vertical categories; Home and End reach the endpoints; Escape clears the reading. When local overflow is necessary, its separately labeled native scroll region remains keyboard reachable. Tab also reaches legend name and eye controls. Enter or Space on an eye changes visibility while keeping focus on that eye; hidden names cannot emphasize invisible data. Show all restores focus to the first eye.',
    ],
    kind: 'component',
    labeling: [
      'title and description are visible and required. dataTableLabel supplies a localized accessible name for the generated table. Axis and series labels must stand on their own; legend labels name the series collection rather than repeating the chart title.',
    ],
    localization: [
      'Crowded categorical, time and numeric axes use staggered label rows before local scrolling. Numeric and date labels retain complete values. Vertical titles reserve room for readable text and wrap when needed.',
      'Localize title, description, state copy, labels, units, legend and annotation text. Supply formatTick when locale-specific date or number formatting differs from the deterministic default. Optional visibilityLabels uses ChartVisibilityLabels: hideSeries(label) and showSeries(label) name the next eye action; hidden labels table headers; allHidden supplies title and description; showAll names the recovery action.',
    ],
    name,
    parts: [
      `${name} contains a named figure, visible caption, optional feedback, a required multi-series legend, interactive SVG plot, axes, marks, shared reading tooltip, optional annotations, and a generated native data table.`,
    ],
    preferredAlternatives: [alternative],
    preferredCompositions: [
      'Compose charts with CollectionFilterBar or other separate controls, shared feedback components, and application-owned layout. Do not wrap them in a library dashboard or analysis workflow.',
    ],
    purpose,
    reducedMotionBehavior: [
      'Reduced motion removes series-emphasis and scrollbar-fade transitions while preserving the same reading, focus, legend, and native scrolling states. Automatic scale changes settle immediately when reduced motion is requested, including when that preference changes during an animation. Otherwise axes and marks share the animated scale while readings retain exact values. Initial geometry appears immediately; general data-shape animation is not provided.',
    ],
    relatedExports: ['AppearanceProvider', ...chartNames.filter((chartName) => chartName !== name)],
    responsiveBehavior: [
      "Charts scale readable type, marks, strokes, and pointer targets together from the available plot space. Every categorical label is rendered: horizontal labels use one row when possible, alternate across two rows when needed, and fall back to a labeled native scroll region with ScrollRegion's scrollbar behavior only at the legibility limit. Long labels may shorten while the generated table retains complete values. aspectRatio and minimumSize set explicit lower bounds; choose clip only when shrinking the complete plot is more important than local scrolling.",
    ],
    states: [
      'Ready, loading, empty, partial, invalid-data, and error states are explicit. Partial data remains plotted with warning copy; invalid rows are omitted and reported; an entirely invalid dataset becomes unavailable. Hiding every series retains the caption, legend, and complete table with the localized allHidden message and Show all recovery. Visibility does not change input validity.',
    ],
    stylesheet: './styles.css',
    summary: purpose,
    validation: [
      'TypeScript bounds record accessors, scales, colors, layouts, annotation values, and the one-to-six series vocabulary. Runtime preparation assigns omitted colors without colliding with explicit ordinary choices, excludes missing or non-finite rows, requires a named legend for multiple series or visibilityLabels and a representable filled-mark baseline, and gives empty and unavailable states distinct feedback.',
    ],
  };
}

const commonProps =
  'data={[{month: "Jan", demand: 42, capacity: 58}, {month: "Feb", demand: 51, capacity: 64}]}\n  dataTableLabel="Monthly energy data"\n  description="Monthly demand remains within available capacity."\n  emptyState={{title: "No demand data", description: "Choose a period with recorded demand."}}\n  invalidData={{title: "Invalid demand data", description: "Correct missing or non-finite values."}}';
const visibilityProps =
  'visibilityLabels={{hideSeries: (label) => `Hide ${label}`, showSeries: (label) => `Show ${label}`, hidden: "Hidden", allHidden: {title: "All series hidden", description: "Show a series with its eye control or restore all series."}, showAll: "Show all series"}}';
const counterState =
  'dataTableLabel="Chart data"\n  emptyState={{title: "No values", description: "Choose a populated dataset."}}\n  invalidData={{title: "Invalid values", description: "Correct invalid records."}}';

interface PartToWholeContractOptions {
  readonly exampleName: string;
  readonly exampleTag: string;
  readonly name: Extract<ChartName, 'DonutChart' | 'PieChart'>;
  readonly parts: string;
  readonly purpose: string;
}

const partToWholeProps =
  'data={[{id: "residential", label: "Residential", value: 43}, {id: "offices", label: "Offices", value: 26}]}\n  dataTableLabel="Annual energy by category"\n  description="Residential customers account for the largest share of annual metered energy."\n  emptyState={{title: "No energy use", description: "Choose a year with recorded use."}}\n  idAccessor="id"\n  invalidData={{title: "Invalid energy use", description: "Correct negative or non-finite values."}}\n  labelAccessor="label"\n  labels={{back: "Back", category: "Customer category", categoryRange: ({start, end, total}) => `Categories ${start} to ${end} of ${total}`, moreCategories: (count) => `More categories (${count})`, shareOfTotal: "Share of total", shareOnPage: "Share on this page"}}\n  legend={{label: "Visible categories"}}\n  title="Community energy use"\n  value={{accessor: "value", label: "Energy use", unit: "MWh"}}';

function partToWholeContract({
  exampleName,
  exampleTag,
  name,
  parts,
  purpose,
}: PartToWholeContractOptions): ComponentContract {
  return {
    accentBehavior: [
      'Application accent identifies the first ranked category on each original page. Later categories use the role-aware chart palette. Colors and patterns stay attached to categories when hiding or restoration moves them between pages. A repeated color also receives a stable dash treatment so color is never its only identity.',
    ],
    accessibility: [
      'The visible title names one figure and the description explains the part-to-whole question. One title-named keyboard boundary owns slice readings and page announcements. The SVG is hidden from assistive technology, and the generated native table retains every valid category, including zero values and categories outside the current page.',
      'Optional selection adds localized instructions, a selected count, category names, off-page labels, and Clear selection outside the SVG. The aggregate announces containsSelection when its remaining categories include a selection and names hidden remaining categories with visibilityLabels.hidden.',
    ],
    appearance: [
      'Ordinary slices remain proportional to one another. The aggregate uses a dashed boundary and bold +N count. It is proportional by default, while aggregateSizing="smallest" makes it smaller than every ordinary slice without changing their relative proportions.',
      'Selected slices have an outer-edge arc. The current reading has an inset dashed outline and the existing pop-out, separate from selection. Activation gives finite pulse feedback, including repeated activation of the same category. These cues preserve slice proportions in light, dark, and compact layouts without a whole-chart focus outline.',
    ],
    appropriateUses: [
      'one nonnegative measure forms a meaningful whole and the relative category shares matter more than exact side-by-side comparison',
    ],
    composition: [
      `Render ${name} inside AppearanceProvider in consumer-owned layout. Supply records, stable id and label accessors, one shared value meaning, state copy, localized paging and tooltip labels, a legend label, and a localized table label.`,
      'Supply optional PartToWholeInteraction<Datum> through interaction, with independently optional selection and onActivate. The existing required idAccessor supplies each category identity. Applications own details and navigation and can share controlled selection between PieChart and DonutChart for the same category IDs.',
    ],
    contentRules: [
      `Use short category labels, one shared unit, a specific title, and a one-sentence description that states the comparison.${name === 'DonutChart' ? ' Center copy names the derived total.' : ''} Describe the aggregate as navigation over hidden records, never as a source category.`,
    ],
    controlBehavior: [
      'With more than eight positive categories, the first page shows seven ordinary slices and one aggregate. Activating the aggregate opens the next eight ranked categories, with another aggregate when records remain. Back returns through prior pages.',
      'Slice hover pops out the slice, mutes the others, and opens a cursor-following tooltip. Legend hover and focus use the same emphasis without a tooltip. A second activation releases the pin and temporary hover/focus emphasis without moving keyboard focus. Clicking a legend item pins that emphasis, another replaces it, and a repeat click or Escape clears it.',
      'With selection enabled, click or tap toggles an ordinary category. Control/Command-click activates without changing selection. Touch press-and-hold activates once and release does not also select. Movement and pointer cancellation cancel a pending hold. Without selection, click or tap activates when onActivate is supplied.',
      'Sweep across ordinary slices to collect only the categories crossed. A temporary dashed trail shows the pointer path until release or cancellation. A new drag replaces selection; Shift or Control/Command adds and Alt removes. The donut hole, empty space, and aggregate select nothing. Escape or pointer cancellation restores the selection from before the drag. A sweep never activates a category.',
      'Expansion and Back retain selection across pages. +N* appears when the remaining aggregate group contains selected or hidden categories. Both states share one asterisk. A selected or hidden ordinary category outside the aggregate does not add it. Hidden-only markers work without selection enabled and clear when those categories are restored; any remaining selection keeps the marker. Aggregate activation only navigates and never selects an aggregate ID or emits a category callback. Paging leaves the complete table intact.',
      'Ordinary legend names retain emphasis and pinning; they never select or activate categories. A directly hovered slice takes reading precedence over legend emphasis. Selection and activation do not mutate records, change proportions, or add slices for zero values.',
      'Supply visibilityLabels to add an independent eye beside each ordinary category. Hidden names remain in the ranked legend with closed eyes for restoration and consume no slice slots. Hiding pulls the next visible ranked category out of expansion. Restoration returns the category to rank order and moves overflow back into expansion. When all remaining visible categories fit, expansion disappears. The expansion has no eye; its legend entry opens the next page. Hiding clears that category pin and current readings, cancels pending gestures, and excludes hidden slices from pointer, keyboard, activation, and sweep targets.',
      'Page boundaries follow visible capacity and retain hidden legend entries in their ranked range. Category range labels cover that legend range, including hidden entries. If pages collapse, the current page settles to the nearest available page and stays there after restoration. Expansion counts and asterisks describe the remaining records, including hidden entries. Compact legends scroll within a bounded area. Visible slices refill the circle after hiding. For values 50/30/20, hiding 50 leaves shares of 60%/40% and a donut center total of 50. The table retains all valid raw records. Visible rows use the visible-total denominator; hidden rows use visibilityLabels.hidden in place of a percentage. Zero rows remain valid without a slice or eye.',
      'When all categories are hidden, pages collapse to one and visibilityLabels.allHidden replaces the plot. The full legend, table and selection remain available. Recovery copy should offer an individual eye or Show all; there is no other page to navigate to. Show all restores every category and focuses the first eye.',
    ],
    counterExamples: [
      {
        code: example(
          `Misused${name}`,
          `<${name}\n  ${counterState}\n  data={[{id: "north", label: "North", value: 41}, {id: "south", label: "South", value: 42}]}\n  description="Nearly equal regional readings need exact comparison."\n  idAccessor="id"\n  labelAccessor="label"\n  labels={{back: "Back", category: "Region", categoryRange: ({start, end, total}) => \`Categories \${start} to \${end} of \${total}\`, moreCategories: (count) => \`More categories (\${count})\`, shareOfTotal: "Share of total", shareOnPage: "Share on this page"}}\n  legend={{label: "Regions"}}\n  title="Regional readings"\n  value={{accessor: "value", label: "Reading"}}${name === 'DonutChart' ? '\n  totalLabel="Total readings"' : ''}\n/>`,
        ),
        description:
          'Use BarChart or ColumnChart when small differences need precise comparison against a common baseline.',
        title: `Do not use ${name} for precise comparison`,
      },
    ],
    directionality: [
      'Caption, paging copy, legend labels, tooltip copy, and table content follow inherited writing direction. Slice order remains clockwise after ranking by value.',
    ],
    events: [
      `${name} keeps readings, legend emphasis, and chart paging internal. Pointer, keyboard, touch, and Back interaction do not change consumer data.`,
      'interaction.onActivate receives PartToWholeActivation<Datum> with item containing id, the original datum, label, raw value, total, shareOfTotal, shareOnPage, and input of pointer, keyboard, or touch. Shares are fractions. total and shareOfTotal use the exact sum of visible valid categories across all pages; shareOnPage uses the sum of ordinary visible categories, excluding the aggregate, matching the existing reading denominator. No renderer objects or persistent inspected state are exposed.',
      'selection combines ChartSelection<PartToWholeSelectionItem> with a required localized containsSelection string. Use controlled selectedItems with required onSelectionChange, or uncontrolled defaultSelectedItems with optional onSelectionChange. Do not combine ownership models. onSelectionChange receives category items with stable id values independently of activation.',
      'Stable IDs preserve selection through value updates, reordering, paging, and hiding. Hidden positive categories retain selection and count toward the expansion asterisk. Off-page positive categories remain available and selected. Internal selection retires removed, invalid, and zero-valued categories. Controlled state remains application-owned; unavailable IDs are omitted from rendering and commands. Data, geometry, page, or interaction-mode changes cancel pending gestures and activation feedback.',
    ],
    examples: [
      {
        code: example(exampleName, `<${name}\n  ${partToWholeProps}${exampleTag}\n/>`),
        description: purpose,
        title: `${name} with complete category data`,
      },
      {
        code: `export function Selectable${name}({onOpenDetails}: {readonly onOpenDetails: (message: string) => void}) {\n  return (\n    <AppearanceProvider appearance="dark" accent="#2878ff">\n      <${name}\n        ${partToWholeProps.replace('Share of total', 'Share of visible total').replace('Visible categories', 'Categories on this page').replaceAll('\n  ', '\n        ')}${exampleTag.replace('MWh total', 'Visible MWh').replaceAll('\n  ', '\n        ')}\n        visibilityLabels={{hidden: "Hidden", hideSeries: (label) => \`Hide \${label}\`, showSeries: (label) => \`Show \${label}\`, showAll: "Show all categories", allHidden: {title: "All categories are hidden", description: "Restore a category or show all categories."}}}\n        interaction={{\n          onActivate: ({item, datum, value, total, shareOfTotal, shareOnPage, input}) => onOpenDetails(\`\${datum.label} [\${item.id}]: \${value} of \${total} MWh, \${(shareOfTotal * 100).toFixed(1)}% of total, \${(shareOnPage * 100).toFixed(1)}% of this page, opened by \${input}\`),\n          selection: {\n            defaultSelectedItems: [],\n            containsSelection: "Contains selected categories",\n            labels: {\n              instructions: "Click or tap to select a category. Sweep across slices to select those crossed; Shift or Control/Command adds, Alt removes, and Escape restores selection. Control/Command-click or touch press-and-hold opens details. Arrow keys read slices; Home and End reach endpoints. Enter or Space selects; add Control/Command to open details. The aggregate opens the next page.",\n              clear: "Clear selection",\n              empty: "Nothing selected",\n              summary: (count) => \`\${count} categories selected\`,\n              item: ({id}) => id === "residential" ? "Residential" : "Offices",\n              hidden: (label) => \`\${label} (hidden or on another page)\`,\n            },\n          },\n        }}\n      />\n    </AppearanceProvider>\n  );\n}`,
        description:
          'The chart owns selection in this uncontrolled example. Activation sends the original category record, stable ID, values, shares, and input method to application-owned details. The live example uses controlled selection and separate switches for selection and details.',
        title: `${name} with selection and activation`,
      },
    ],
    exportName: name,
    forcedColorBehavior: [
      'Forced colors preserve slice boundaries and the aggregate dash in system colors. Repeated roles retain their dash treatment, and the generated table remains the complete non-color representation.',
    ],
    formBehavior: [
      'Part-to-whole charts are not form controls and do not submit, validate, or reset values. Place dataset controls beside the chart in consumer-owned composition.',
    ],
    importPath: '.',
    inappropriateUses: [
      'precise comparison of similar values, values that do not form one meaningful whole, negative measures, independent series, or a trend over an ordered domain',
    ],
    keyboardBehavior: [
      'Tab reaches one title-named chart boundary. Left and Right read visible slices clockwise. Home and End reach page endpoints. Enter or Space on the aggregate opens the next page and reads its first slice. Escape clears the reading. Back returns to the prior page.',
      'With selection enabled, Enter or Space toggles the current ordinary category; Control/Command plus Enter or Space activates without changing selection. Without selection, Enter or Space activates when onActivate is supplied. Escape cancels an active drag and restores its prior selection before clearing a reading. Every ordinary visible category and the aggregate remain keyboard reachable.',
    ],
    kind: 'component',
    labeling: [
      'title, description, dataTableLabel, value label, legend label, state copy, page range, Back, aggregate count, and share labels are required. Category ids stay stable while labels provide human-readable names.',
      'selection.labels supplies instructions, clear, empty, summary(count), item(item), and hidden(label). Use stable IDs to name categories and describe the enabled gestures. selection.containsSelection supplies the accessible equivalent of the aggregate asterisk.',
      'visibilityLabels supplies hidden, hideSeries(label), showSeries(label), showAll, and allHidden title/description. Label shareOfTotal and the donut center as visible totals when enabling visibility. selection.labels.hidden should describe hidden or off-page categories.',
    ],
    localization: [
      'Localize all visible and announced copy. categoryRange and moreCategories receive their numeric inputs, while value.formatValue controls locale-specific number formatting.',
    ],
    name,
    parts: [
      parts,
      'Optional interaction adds outer-edge selection arcs, inset reading outlines, finite activation feedback, and a localized selection summary with Clear selection. Controls and application details remain outside the chart.',
    ],
    preferredAlternatives: [
      'Use BarChart or ColumnChart for exact category comparison, LineChart for change over an ordered domain, or a native Table when values do not form one whole.',
    ],
    preferredCompositions: [
      'Compose the chart with separate filters and application-owned layout. Coordinate cross-chart selection through shared controlled category IDs; keep filtering and activation responses in the application.',
    ],
    purpose,
    reducedMotionBehavior: [
      activationTiming,
      'Visibility animates slice boundaries over 240ms and can reverse from the current angles. Reduced motion settles immediately; paging and source-data changes reset directly. Readings, callbacks, table percentages, and the donut center always use exact current values, never interpolated values.',
      'Reduced motion removes slice pop-out and scrollbar-fade transitions. Reading, focus, paging, emphasis, and native scrolling behavior stays the same.',
      'Reduced motion replaces each activation pulse with brief static feedback. Callbacks and selection remain the same.',
    ],
    relatedExports: ['AppearanceProvider', ...chartNames.filter((chartName) => chartName !== name)],
    responsiveBehavior: [
      'Like other chart figures, the default area stays bounded instead of filling an arbitrarily wide parent. Available width and height both bound the chart. Compact layouts reduce caption, paging, Back, legend type, swatches, gaps, and padding while preserving a balanced plot. Tall narrow areas may stack. The legend uses ScrollRegion transient scrollbar behavior without container chrome.',
    ],
    states: [
      'Ready, loading, empty, partial, invalid-data, and error states are explicit. Zero is valid and remains in the table without a slice. All-zero data is empty. Invalid records are omitted and reported; an entirely invalid dataset is unavailable.',
    ],
    stylesheet: './styles.css',
    summary: purpose,
    validation: [
      'TypeScript limits accessors, aggregate sizing, labels, and state copy. Runtime preparation requires stable unique ids, nonempty labels, and finite nonnegative numbers. Zero is valid; negative and non-finite records are invalid. Positive categories rank by value with source order breaking ties.',
    ],
  };
}

export const pieChartContract = partToWholeContract({
  exampleName: 'PieChartExample',
  exampleTag: '',
  name: 'PieChart',
  parts:
    'PieChart contains a named figure, visible caption, optional feedback, page indicator and Back button, interactive proportional pie, aggregate slice when needed, visible legend, shared tooltip, polite announcement, and generated native data table.',
  purpose: 'Show category shares of one whole in a proportional pie with bounded paging.',
});

export const donutChartContract = partToWholeContract({
  exampleName: 'DonutChartExample',
  exampleTag: '\n  totalLabel="MWh total"',
  name: 'DonutChart',
  parts:
    'DonutChart contains a named figure, visible caption, optional feedback, page indicator and Back button, interactive proportional ring, aggregate slice when needed, derived total and localized label in its center, visible legend, shared tooltip, polite announcement, and generated native data table.',
  purpose: 'Show category shares of one whole in a proportional ring with a derived center total.',
});

export const radarChartContract: ComponentContract = {
  accentBehavior: [
    'Application accent identifies the first series. Later series use the role-aware chart palette. Line patterns supplement color when polygons overlap.',
  ],
  accessibility: [
    'The visible title names one figure and the description explains the comparison. One title-named keyboard boundary announces the active dimension and every visible series value. The SVG is hidden from assistive technology, and a generated native table lists dimensions as rows and series as columns.',
  ],
  appearance: [
    'Every series uses the same nonnegative scale. Exact source values place the points. Direct hover draws a center-to-point guide and mutes the other series. Its neutral reading fill reaches the inside of the point border at each rendered size. When an isolated positive point would collapse a fill into a line, small shoulders shape the neighboring corners. These shoulders are visual-only and never change exact points, readings, or table values.',
  ],
  appropriateUses: [
    'comparing a few subjects across three or more ordered qualities that share one meaningful nonnegative scale',
  ],
  composition: [
    'Render RadarChart inside AppearanceProvider in consumer-owned layout. A dimension is one measured quality and one spoke. A series is one subject and one polygon. Supply at least three ordered dimensions, one to six series records, stable ids, labels, one shared value meaning, state copy, a legend label, and a table label.',
  ],
  contentRules: [
    'Keep dimension and series labels short. Use one unit and one shared interpretation for every value. Order dimensions deliberately because their adjacency shapes the polygon. Limit spokes and overlapping series to what remains readable.',
  ],
  controlBehavior: [
    'Hidden profiles stay in the complete table with a localized hidden label. All-hidden recovery keeps the caption, legend, table and selected summary; Show all restores profiles and focuses the first eye. Hidden profiles cannot be read, selected by a gesture, activated or traversed by keyboard. Removing a profile ID drops its visibility state; value updates retain it.',
    'Pointer and touch readings emphasize one profile on one axis. Point mode reports the chosen profile; dimension mode reports all visible profiles on that axis. Radial guides reach exact values. Pointer tooltips follow the cursor. Touch readings stay open until another reading or an outside press replaces them.',
    'Legend hover and focus emphasize one series. Click, Enter, or Space pins it; another legend choice replaces it. A pinned series receives pointer priority where values are close or overlap. Repeat the pinned choice or press Escape to clear it. Repeating the choice also clears temporary hover/focus emphasis without moving keyboard focus. Emphasis never hides source data. Optional visibilityLabels adds a separate eye after each legend name. Hiding clears its pin and keeps its legend position, color and pattern. Hidden names cannot gain emphasis.',
    'Optional interaction targets one point or a whole dimension. Click or tap selects when selection is enabled; Control/Command-click activates independently. Touch press-and-hold activates without changing selection on release. Without selection, click or tap activates directly.',
    'Drag a visible rectangle to select positive value centers inside. In dimension mode, one included center qualifies the dimension. A drag replaces selection, Shift or Control/Command adds, Alt removes, and Escape or pointer cancellation restores the prior selection. Dragging never activates.',
    'Zero and missing-as-zero values remain keyboard targets and belong to whole-dimension selection. Pointer clicks target visible positive value dots. The shared center and visual shoulders are not pointer targets; rectangle selection uses positive centers only.',
    'Selected points use rings joined to their colored borders. Selected dimensions underline their labels. Neutral filled centers preview the exact target while profile hover stays independent of target mode. Legend focus and pinning prioritize only profiles that overlap the pointer.',
  ],
  counterExamples: [
    {
      code: example(
        'MisusedRadarChart',
        '<RadarChart\n  data={[{id: "site-a", label: "Site A", cost: 4200, temperature: 18, satisfaction: 4}]}\n  dataTableLabel="Site readings"\n  description="Cost, temperature, and satisfaction use unrelated scales."\n  dimensions={[{id: "cost", label: "Cost", accessor: "cost"}, {id: "temperature", label: "Temperature", accessor: "temperature"}, {id: "satisfaction", label: "Satisfaction", accessor: "satisfaction"}]}\n  emptyState={{title: "No readings", description: "Choose a site with readings."}}\n  idAccessor="id"\n  invalidData={{title: "Invalid readings", description: "Correct negative or non-finite readings."}}\n  labelAccessor="label"\n  labels={{dimension: "Measure"}}\n  legend={{label: "Sites"}}\n  title="Site comparison"\n  value={{label: "Mixed reading"}}\n/>',
      ),
      description:
        'Use separate charts or a table when the dimensions use unrelated units or need precise comparison.',
      title: 'Do not mix unrelated measures in RadarChart',
    },
  ],
  directionality: [
    'Caption, legend, tooltip, and table content follow inherited writing direction. Declared dimension order remains fixed around the chart.',
  ],
  events: [
    'interaction.selection accepts ChartSelection<RadarSelectionItem>. Each item contains a stable dimensionId and, for point targets, seriesId. Omit selectedItems for internal selection or supply selectedItems with onSelectionChange for application ownership. Selection survives reordering, retains zero values and hidden profiles, and retires removed or invalid targets. Hidden selections use selection.labels.hidden. A selected dimension keeps its identity when profiles are hidden. Changing target mode retires incompatible items.',
    'interaction.onActivate receives RadarActivation<Datum> with item, dimension id and label, input, and values. Each value has seriesId, label, exact value, and the original datum record. A point activation includes one profile; a dimension activation includes all visible profiles, including zeros. Activation is independent of persistent selection.',
    'Data, visibility, geometry, presentation, target, and enabled interaction changes cancel pending gestures and activation feedback. Replacing a callback alone preserves a pending gesture and uses the current callback. Readings and legend emphasis remain internal and never mutate consumer records.',
  ],
  examples: [
    {
      code: example(
        'RadarChartExample',
        '<RadarChart\n  data={[{id: "courier", label: "Courier", speed: 5, range: 4, reliability: 3}, {id: "scout", label: "Scout", speed: 2, range: 5}]}\n  dataTableLabel="Vehicle profile data"\n  description="Courier and Scout scores across shared vehicle qualities."\n  dimensions={[{id: "speed", label: "Speed", accessor: "speed"}, {id: "range", label: "Range", accessor: "range"}, {id: "reliability", label: "Reliability", accessor: "reliability"}]}\n  emptyState={{title: "No scores", description: "Choose vehicles with recorded scores."}}\n  idAccessor="id"\n  invalidData={{title: "Invalid scores", description: "Correct negative or non-finite scores."}}\n  labelAccessor="label"\n  labels={{dimension: "Quality"}}\n  legend={{label: "Vehicles"}}\n  visibilityLabels={{hidden: "Hidden", hideSeries: (label) => `Hide ${label}`, showSeries: (label) => `Show ${label}`, showAll: "Show all profiles", allHidden: {title: "All profiles hidden", description: "Use an eye to restore a profile."}}}\n  title="Vehicle profiles"\n  value={{label: "Score", unit: "points"}}\n/>',
      ),
      description:
        'Compare subjects across ordered dimensions on one shared, nonnegative score scale.',
      title: 'RadarChart with complete and missing dimensions',
    },
    {
      code: example(
        'RadarActivationExample',
        '<RadarChart\n  data={[{id: "courier", label: "Courier", speed: 5, range: 4, reliability: 3, detailsUrl: "/vehicles/courier"}]}\n  dataTableLabel="Vehicle profile data"\n  description="Open a measured value to view its vehicle."\n  dimensions={[{id: "speed", label: "Speed", accessor: "speed"}, {id: "range", label: "Range", accessor: "range"}, {id: "reliability", label: "Reliability", accessor: "reliability"}]}\n  emptyState={{title: "No scores", description: "Choose a vehicle with scores."}}\n  idAccessor="id"\n  interaction={{target: "point", onActivate: ({values}) => { const profile = values[0]; if (profile) window.location.assign(profile.datum.detailsUrl); }}}\n  invalidData={{title: "Invalid scores", description: "Correct negative or non-finite scores."}}\n  labelAccessor="label"\n  labels={{dimension: "Quality"}}\n  legend={{label: "Vehicles"}}\n  title="Open vehicle details"\n  value={{label: "Score", unit: "points"}}\n/>',
      ),
      description:
        'Use the original profile record from a point activation to open application-owned details. Add interaction.selection to enable independent persistent selection.',
      title: 'RadarChart activation with original profile data',
    },
  ],
  exportName: 'RadarChart',
  forcedColorBehavior: [
    'Forced colors preserve guides, spokes, point boundaries, and polygon line patterns in system colors. The generated table remains the complete non-color representation.',
  ],
  formBehavior: [
    'RadarChart is not a form control and does not submit, validate, or reset values. Place dataset controls beside it in consumer-owned composition.',
  ],
  importPath: '.',
  inappropriateUses: [
    'dimensions with unrelated units, precise value comparison, fewer than three dimensions, negative measures, too many spokes, or enough overlapping series to obscure their shapes',
  ],
  keyboardBehavior: [
    'Tab reaches one title-named chart boundary. Left and Right traverse dimensions and stop at the ends. With interaction, Up and Down traverse profiles, including zero values, and Home and End reach the first and last dimension. Enter or Space selects; Control/Command plus Enter or Space activates independently. Without selection, Enter or Space activates directly. Escape cancels a drag or clears a reading. Focus appears at the current value without outlining the whole chart. Legend buttons retain their own focus, pin, replacement, and Escape behavior.',
  ],
  kind: 'component',
  labeling: [
    'title, description, dataTableLabel, value label, dimension heading, legend label, and state copy are required. Dimension and series ids stay stable while their labels provide readable names.',
  ],
  localization: [
    'Localize all visible and announced copy, dimension labels, series labels, and units. value.formatValue controls locale-specific number formatting. visibilityLabels supplies hideSeries, showSeries, hidden, showAll and allHidden copy.',
  ],
  name: 'RadarChart',
  parts: [
    'RadarChart contains a named figure, visible caption, optional feedback, shared polygon guide and spokes, exact source points, one polygon per valid series, visible legend, shared tooltip, polite announcement, and generated native data table.',
  ],
  preferredAlternatives: [
    'Use BarChart or ColumnChart for precise comparison, LineChart for change over an ordered domain, separate charts for unrelated units, or a native Table when many dimensions or series must remain exact.',
  ],
  preferredCompositions: [
    'Compose RadarChart with separate filters and application-owned layout. Keep cross-chart selection and filtering outside the component.',
  ],
  purpose: 'Compare a few subjects across ordered qualities on one shared radial scale.',
  reducedMotionBehavior: [
    activationTiming,
    'Filled point pulses use a ten-screen-pixel base radius with the shared expansion and fade, including compact charts.',
    'Radar dimension and guide labels retain a minimum rendered size of 12 pixels. Compact names may shorten; the full table retains their wording.',
    'Point activation briefly pulses its marker. Dimension activation grows a radial guide from the center through the furthest actual value, holds at full length, then fades. An all-zero dimension briefly underlines its label because it has no line extent. Reduced motion uses brief static activation feedback and removes series-emphasis and scrollbar-fade transitions. With visibility enabled, one interruptible 240ms animation fits the shared zero-based scale to visible profiles. Restored marks stay inside the outer radar edge while the scale expands. Reduced motion settles the scale immediately. Exact readings and table values do not change.',
  ],
  relatedExports: ['AppearanceProvider', ...chartNames.filter((name) => name !== 'RadarChart')],
  responsiveBehavior: [
    'Like other chart figures, the default area stays bounded instead of filling an arbitrarily wide parent. Available width and height bound the chart. Compact layouts reduce caption, legend type, swatches, gaps, and padding while increasing SVG label size enough to survive plot scaling. Long plot labels may shorten while the table keeps their complete text. Tall narrow areas stack the legend below the plot. minimumSize and overflow retain the chart family local-scroll choice, and the legend uses the transient ScrollRegion scrollbar behavior without container chrome.',
  ],
  states: [
    'Ready, loading, empty, partial, invalid-data, and error states are explicit. An all-zero valid series remains in the table but draws no polygon or points. Invalid series are omitted and reported; an entirely invalid dataset becomes unavailable.',
  ],
  stylesheet: './styles.css',
  summary: 'Compare a few subjects across ordered qualities on one shared radial scale.',
  validation: [
    'TypeScript requires at least three dimensions and limits data to one through six series. Runtime preparation requires unique usable ids and labels. A missing dimension becomes zero. A negative or non-finite dimension value invalidates the entire series.',
  ],
};

export const heatmapContract: ComponentContract = {
  accentBehavior: [
    'Heatmap does not read the application accent. A sequential scale accepts one color. A two-sided scale accepts ordered low and high colors. Callers may pass their application accent when it fits the measure. Missing cells stay neutral and outside both numeric scales.',
  ],
  accessibility: [
    'The visible title names one figure and the description explains the grid. One title-named keyboard boundary announces the active row, column, and value, including localized missing values. Visual cells are hidden from assistive technology, while enabled visibility controls remain accessible. A generated native table preserves every declared row and column intersection, marking hidden dimensions.',
  ],
  appearance: [
    'Every numeric cell uses one visible continuous color key. Sequential color represents low-to-high magnitude. Two-sided color meets at the declared midpoint. Missing cells use a neutral dashed crosshatch that cannot be mistaken for zero or a numeric extreme. Dashed inner outlines mark hover and keyboard reading. Solid cell frames mark persistent selection. Selection preserves numeric colors and uses no whole-chart focus border.',
  ],
  appropriateUses: [
    'showing one shared numeric measure across the intersections of two ordered categorical domains',
  ],
  composition: [
    'Render Heatmap inside AppearanceProvider in consumer-owned layout. Supply ordered labeled row and column domains, sparse cell records, coordinate and value accessors, one shared unit and formatter, scale configuration, localized labels, state copy, and a table label.',
  ],
  contentRules: [
    'Keep row and column labels concise and order both domains deliberately. Use one value meaning and unit throughout. Choose colors that match the measure, state what they mean in the description, and use a two-sided scale only when its midpoint has a real interpretation.',
  ],
  controlBehavior: [
    'Selection follows the shared ChartSelection ownership model: selectedItems plus onSelectionChange is controlled; defaultSelectedItems initializes local state. Items retain row/column identity across reordering and value changes; unknown or removed coordinates are pruned. Localized instructions, count, item descriptions and a Clear selection action accompany selection.',
    'Pointer and touch readings begin only on an exact cell and report that row, column, and value. Pointer tooltips follow the cursor. Touch readings stay open until another reading or an outside press replaces them. Missing cells remain readable.',
    'Optional interaction selects cells by stable rowId and columnId. Click/tap toggles selection; Control/Command-click or touch hold activates without changing it. Without selection, ordinary click/tap activates. Rectangle dragging selects boxes it touches, replacing by default, adding with Shift or Control/Command, and removing with Alt. Escape, pointer cancellation, scrolling, data or geometry changes cancel the preview.',
    'Optional visibilityLabels enables individual row and column eyes. Hiding removes the entire track without leaving a blank row or column. Eyes reveal on label hover or keyboard focus and stay visible on touch. A permanently visible closed eye with the hidden-dimension count beside the row heading opens an overlaid restore list. Individual closed eyes restore dimensions; Show all restores every dimension.',
    'Visibility belongs to the chart and follows stable row and column IDs across value changes and reordering. Removed IDs are pruned. Removing visibilityLabels restores the full chart. Hidden cells retain selection, use the selection hidden-label formatter, and remain in the complete table. They cannot receive reading, activation, keyboard or drag gestures. Clear selection also clears hidden items. Visibility changes cancel active gestures.',
    'Automatic color domains fit visible readings after hiding or restoring; explicit domains stay fixed. All original data is validated before visibility filtering, and accessor indices and activation records retain their original source identity.',
  ],
  counterExamples: [
    {
      code: example(
        'MisusedHeatmap',
        '<Heatmap\n  columnAccessor="date"\n  columns={Array.from({length: 200}, (_, index) => ({id: String(index), label: `Day ${index + 1}`}))}\n  data={[{date: "0", device: "0", value: 1}]}\n  dataTableLabel="All device readings"\n  description="Every raw device reading."\n  emptyState={{title: "No grid", description: "Declare devices and dates."}}\n  invalidData={{title: "Invalid readings", description: "Correct non-finite readings."}}\n  labels={{row: "Device", column: "Date", colorKey: "Reading scale", missing: "No reading", scrollRegion: "Device grid"}}\n  rowAccessor="device"\n  rows={Array.from({length: 1000}, (_, index) => ({id: String(index), label: `Device ${index + 1}`}))}\n  scale={{color: "#2878ff", type: "sequential"}}\n  title="All device history"\n  value={{accessor: "value", label: "Reading"}}\n/>',
      ),
      description:
        'Use a summarized chart, filtered view, or virtualized data table when the complete grid is too large to scan as color.',
      title: 'Do not turn Heatmap into an unreadable matrix',
    },
  ],
  directionality: [
    'Caption, labels, tooltip, key, and table follow inherited writing direction. Declared row and column order remains the source order.',
  ],
  events: [
    'interaction.onActivate receives the cell item, labeled row and column, input method, value and original datum. Missing values are undefined; omitted records have undefined datum. An invalid source value remains missing while its original record is available. Zero remains numeric zero. Selection onSelectionChange returns coordinate items and never mutates source data.',
  ],
  examples: [
    {
      code: example(
        'HeatmapExample',
        '<Heatmap\n  interaction={{selection: {labels: {instructions: "Click or tap to select. Drag to select touched cells. Shift adds; Alt removes.", clear: "Clear selection", empty: "Nothing selected", summary: count => `${count} cells selected`, item: item => `${item.rowId}, ${item.columnId}`, hidden: label => `${label} (hidden)`}}}}\n  columnAccessor="hour"\n  columns={[{id: "morning", label: "Morning"}, {id: "evening", label: "Evening"}]}\n  data={[{location: "north", hour: "morning", value: 0}, {location: "south", hour: "evening", value: 18}]}\n  dataTableLabel="Room temperature data"\n  description="Temperature by room and time; patterned cells have no reading."\n  emptyState={{title: "No grid", description: "Declare rooms and times to begin."}}\n  invalidData={{title: "Invalid readings", description: "Correct non-finite readings."}}\n  labels={{row: "Room", column: "Time", colorKey: "Temperature scale", missing: "No reading", scrollRegion: "Temperature grid"}}\n  rowAccessor="location"\n  rows={[{id: "north", label: "North room"}, {id: "south", label: "South room"}]}\n  scale={{color: "#d14f00", type: "sequential"}}\n  title="Room temperature"\n  visibilityLabels={{hideRow: label => `Hide room ${label}`, showRow: label => `Show room ${label}`, hideColumn: label => `Hide time ${label}`, showColumn: label => `Show time ${label}`, restore: count => `Restore ${count} hidden dimensions`, hiddenRows: "Hidden rooms", hiddenColumns: "Hidden times", hidden: "Hidden", showAll: "Show all", close: "Close hidden dimensions", allHidden: {title: "No visible cells", description: "Restore a room and time, or show all."}}}\n  value={{accessor: "value", label: "Temperature", unit: "°C"}}\n/>',
      ),
      description:
        'Show sparse values across a complete declared grid while keeping zero separate from missing.',
      title: 'Sequential Heatmap with zero and missing cells',
    },
  ],
  exportName: 'Heatmap',
  forcedColorBehavior: [
    'Forced colors preserve numeric cells, missing patterns, active boundaries, labels, and the complete table in system colors. The table remains the exact non-color representation.',
  ],
  formBehavior: [
    'Heatmap is not a form control and does not submit, validate, or reset values. Place dataset and scale controls beside it in consumer-owned composition.',
  ],
  importPath: '.',
  inappropriateUses: [
    'unrelated units, area-proportional comparison, precise scanning of a very large matrix, arbitrary two-sided midpoints, or datasets that need aggregation to answer the question',
  ],
  keyboardBehavior: [
    'Tab reaches one title-named grid boundary. Left and Right move across columns; Up and Down move across rows. Home and End reach row endpoints. Control/Command Home and Control/Command End reach the first and last visible cell. Enter/Space selects when selection is enabled; Control/Command plus Enter/Space activates. With selection disabled, Enter/Space activates. Navigation stops at boundaries, and Escape clears the reading.',
    'When visibility is enabled, Tab also reaches the label eyes and corner restore control. Hiding moves focus to the corner control. Escape or an outside press dismisses the restore list, with focus returning to the corner control when appropriate. Restoring an item moves focus to the next restore eye while hidden items remain. Restoring the final item or using Show all closes the list and focuses the first visible row eye.',
  ],
  kind: 'component',
  labeling: [
    'title, description, dataTableLabel, value label, row and column headings, color-key label, localized missing copy, scroll-region label, and state copy are required. Row and column ids stay stable while labels provide readable names.',
  ],
  localization: [
    'Localize all visible and announced copy, domain labels, missing copy, and units. value.formatValue controls locale-specific number formatting. Selection labels provide localized instructions, clearing, empty and count summaries, and cell names.',
    'HeatmapVisibilityLabels requires hideRow, showRow, hideColumn and showColumn formatters receiving the readable domain label; restore formats the total hidden-dimension count. Provide hiddenRows and hiddenColumns list headings, hidden table copy, showAll and close actions, and allHidden title and description.',
  ],
  name: 'Heatmap',
  parts: [
    'Heatmap contains a named figure, visible caption, optional feedback, ordered visual grid, row and column labels, continuous numeric key, missing-value key, shared tooltip, polite announcement, labeled local scroll region when needed, and generated native data table.',
  ],
  preferredAlternatives: [
    'Use a native Table for exact dense comparison, LineChart for change over a continuous ordered domain, BarChart or ColumnChart for a small set of precise comparisons, or filtered and summarized views when the full matrix is too large.',
  ],
  preferredCompositions: [
    'Compose Heatmap with separate filters and application-owned layout. For comparisons across several heatmaps, give them the same fixed domain and explain that shared range nearby.',
  ],
  purpose: 'Show one numeric measure across the complete intersections of two ordered domains.',
  reducedMotionBehavior: [
    activationTiming,
    outlineMotion,
    'Visibility changes briefly animate remaining cells and their colors as the grid and automatic range refit. Reduced motion removes visibility, active-cell and scrollbar-fade transitions. Reading, focus, and native scrolling behavior stays the same.',
  ],
  relatedExports: ['AppearanceProvider', ...chartNames.filter((name) => name !== 'Heatmap')],
  responsiveBehavior: [
    'Like other chart figures, Heatmap keeps a bounded default area instead of filling an arbitrarily wide parent. Row labels reserve space for their text, visibility eye and the largest possible restore count before any tracks are hidden. Rows and cells shrink to their compact legible sizes before inline values disappear; only a grid that still cannot fit becomes a separately labeled local scroll region with the transient ScrollRegion scrollbar treatment. Fitted grids do not become scroll containers, and local overflow does not trap scrolling from the surrounding page. Every intersection remains in the generated table.',
  ],
  states: [
    'Ready, loading, empty-domain, partial, invalid-data, and error states are explicit. A declared grid with no records remains an all-missing grid. Non-finite records are omitted and reported; an entirely invalid nonempty dataset becomes unavailable.',
    'When every row or every column is hidden, an all-hidden state retains the caption, full table and selection. The corner restore list and Show all remain available even when no cells can be displayed.',
  ],
  stylesheet: './styles.css',
  summary: 'Show one numeric measure across two ordered categorical domains.',
  validation: [
    'Runtime preparation requires unique nonblank row and column ids, declared record coordinates, and at most one record per cell. Scale colors must be nonblank strings containing browser-supported CSS color values. Sequential scales require one color, and two-sided scales require ordered low and high colors. Zero and negative values are valid. Missing pairs remain missing. Non-finite values are invalid. Fixed domains must be ascending and finite, and a two-sided midpoint must be finite and inside its fixed domain.',
  ],
};

export const sparklineContract: ComponentContract = {
  accentBehavior: [
    'The application accent identifies the single line, directional observed-range cues, and hollow current cue. Filling the upper half for highs and lower half for lows separates the extrema without implying semantic good or bad.',
  ],
  accessibility: [
    'The standard visible title names one figure and the description explains the domain and trend meaning. One title-named keyboard boundary announces exact position and value readings. A localized derived summary exposes first, last, lowest, and highest valid values, and a generated native table preserves every valid position including missing values.',
  ],
  appearance: [
    'One restrained line shows the ordered series without axes or a legend. Missing values break the line. The current valid record uses a hollow circle. Every other observed low fills the lower half of its circle, while every other observed high fills the upper half, including ties. Reading one of those cues fills its open area with the foreground color; an ordinary active reading uses the same solid foreground point. Neutral selection rings meet existing cue outlines without a gap; ordinary selected readings gain a base circle. Exact values remain in the tooltip, summary, announcement, and table.',
  ],
  appropriateUses: [
    'showing one compact trend whose ordered position, value range, current value, and observed extrema are explained by the nearby title and description',
  ],
  composition: [
    'Render Sparkline inside AppearanceProvider in consumer-owned layout. Supply one ordered record series, typed position and value accessors, position scale, value meaning, localized summary and missing labels, state copy, and a table label. Use valueRange when several sparklines need one fixed comparison range. Optional interaction requires getRowId to identify each record and can enable selection, activation, or both.',
  ],
  contentRules: [
    'Use a specific title and one factual sentence that explains the domain and trend without claiming that change is good or bad. Keep one value meaning and unit throughout. Use a fixed range only when it preserves the same comparison meaning across charts.',
  ],
  controlBehavior: [
    'Pointer reads the nearest recorded position and follows the cursor. Touch retains an exact reading until another reading or an outside press replaces it. Missing positions remain readable and report the localized missing label. Tooltips add the localized lowest or highest label when the active value matches an observed extreme and add no range label otherwise.',
    'With interaction.selection, click or tap toggles a recorded value. Horizontal dragging selects recorded values between its starting and ending positions. A drag replaces selection; Shift or Control/Command adds and Alt removes. Escape, pointer cancellation, or changes to data, geometry, status or interaction cancel the preview. Missing readings remain readable gaps and cannot be selected or activated; zero remains a target.',
    'Control/Command-click or touch press-and-hold activates independently when selection is enabled. Without selection, ordinary click or tap activates. Selection supports controlled selectedItems and onSelectionChange or uncontrolled defaultSelectedItems. Removed or missing readings are pruned by stable row ID without transferring selection to replacement records.',
  ],
  counterExamples: [
    {
      code: example(
        'MisusedSparkline',
        '<Sparkline\n  data={[{month: "Jan", demand: 42, capacity: 58}]}\n  dataTableLabel="Demand and capacity history"\n  description="Demand and capacity over time."\n  emptyState={{title: "No history", description: "Add records."}}\n  invalidData={{title: "Invalid history", description: "Correct non-finite values."}}\n  labels={{first: "First", last: "Last", lowest: "Lowest", highest: "Highest", missing: "No reading"}}\n  position={{accessor: "month", label: "Month", scale: {type: "categorical"}}}\n  title="Demand and capacity"\n  value={{accessor: "demand", label: "Demand", unit: "MWh"}}\n/>',
      ),
      description:
        'Use LineChart when several series, visible axes, annotations, or more detailed comparison context are required.',
      title: 'Do not compress a full comparison into Sparkline',
    },
  ],
  directionality: [
    'Caption, tooltip, summary, and table follow inherited writing direction. The plotted series and keyboard reading retain source order.',
  ],
  events: [
    'interaction.onActivate receives the stable row item, original datum, typed position, finite value and input method. Selection onSelectionChange returns row items. Sparkline never mutates consumer records.',
  ],
  examples: [
    {
      code: example(
        'SparklineExample',
        '<Sparkline\n  interaction={{getRowId: datum => datum.month, selection: {labels: {instructions: "Click or tap to select. Drag across recorded values. Shift adds; Alt removes.", clear: "Clear selection", empty: "Nothing selected", summary: count => `${count} readings selected`, item: item => item.rowId, hidden: label => label}}}}\n  data={[{month: "Jan", demand: 42}, {month: "Feb", demand: null}, {month: "Mar", demand: 51}]}\n  dataTableLabel="Thermal demand history"\n  description="Monthly thermal demand; February has no recorded reading."\n  emptyState={{title: "No history", description: "Record demand to begin."}}\n  invalidData={{title: "Invalid history", description: "Correct non-finite readings."}}\n  labels={{first: "First", last: "Last", lowest: "Lowest", highest: "Highest", missing: "No reading"}}\n  position={{accessor: "month", label: "Month", scale: {type: "categorical"}}}\n  title="Thermal demand"\n  value={{accessor: "demand", label: "Demand", unit: "MWh"}}\n/>',
      ),
      description:
        'Select recorded readings with stable month IDs while preserving the missing February position, current cue, observed range and complete structured reading. Applications can add onActivate to open details independently.',
      title: 'Sparkline selection with a missing position',
    },
  ],
  exportName: 'Sparkline',
  forcedColorBehavior: [
    'Forced colors preserve the line, directional half-filled low and high cues, hollow current cue, completed cue readings, ordinary foreground reading point, reading needle, selection rings and drag region in system colors. The current reading indicates keyboard focus without a whole-chart outline. The summary and table retain exact non-color meaning.',
  ],
  formBehavior: [
    'Sparkline is not a form control and does not submit, validate, or reset values. Place dataset and range controls beside it in consumer-owned composition.',
  ],
  importPath: '.',
  inappropriateUses: [
    'multiple series, tasks requiring visible axes or persistent values, unordered records, categorical comparison without trend meaning, or claims that direction is favorable or unfavorable without consumer-written context',
  ],
  keyboardBehavior: [
    'Tab reaches one title-named chart boundary. Left and Right move through records in source order and stop at the ends. Home and End reach the sequence endpoints. Missing positions remain readable. Enter or Space selects when selection is enabled; Control/Command plus Enter or Space activates independently. Without selection, Enter or Space activates. Escape clears the reading or cancels a drag. Pointer focus does not start a reading at the first record.',
  ],
  kind: 'component',
  labeling: [
    'title, description, dataTableLabel, position and value labels, first, last, lowest, highest, and missing labels, plus state copy are required. Position and value formatters provide exact readable values.',
  ],
  localization: [
    'Localize all visible and announced copy, summary labels, missing copy, and units. position.formatValue and value.formatValue control locale-specific formatting. Selection labels provide localized instructions, clearing, empty and count summaries, and reading names.',
  ],
  name: 'Sparkline',
  parts: [
    'Sparkline contains a named figure, standard visible caption, optional feedback, compact axis-free line, hollow current cue, directional half-filled range cues, cue-completing and ordinary temporary reading points, shared tooltip, polite announcement, derived summary, optional selection summary and clear control, and generated native data table.',
  ],
  preferredAlternatives: [
    'Use LineChart when visible axes, multiple series, annotations, or fuller trend comparison are required. Use BarChart or ColumnChart for precise discrete comparison, or a native Table when exact records are the primary task.',
  ],
  preferredCompositions: [
    'Compose Sparkline with nearby consumer-owned metric context and filters. Give comparable sparklines the same valueRange and explain that shared range in their descriptions.',
  ],
  purpose: 'Show one compact ordered trend with exact current and observed-range context.',
  reducedMotionBehavior: [
    activationTiming,
    'Static current and observed-range cues do not animate. Reduced motion removes reading transitions while pointer, touch, keyboard, focus, tooltip, summary, and table behavior stays the same.',
  ],
  relatedExports: ['AppearanceProvider', ...chartNames.filter((name) => name !== 'Sparkline')],
  responsiveBehavior: [
    'Like other chart figures, Sparkline keeps a bounded default area instead of filling an arbitrarily wide parent. It retains the standard caption and a legible line while omitting axes and a legend at every size. It never uses local scrolling. Its compact default and consumer minimumSize preserve the hollow current cue, directional half-filled low and high cues, and temporary reading points.',
  ],
  states: [
    'Ready, loading, empty, partial, invalid-data, and error states are explicit. Missing values remain table rows and visual gaps. Non-finite values are omitted and reported; a nonempty series without a finite value becomes unavailable.',
  ],
  stylesheet: './styles.css',
  summary: 'Show one compact ordered trend with exact current and observed-range context.',
  validation: [
    'Runtime preparation preserves source order. Negative values and zero are valid. Missing values remain gaps. Non-finite values and invalid positions are omitted and reported. Fixed value ranges and numeric or time position domains must be ascending and finite. Interaction requires nonblank stable row IDs that are unique among prepared records. Distinct IDs can share a position and remain reachable in keyboard source order.',
  ],
};

const lineChartBaseContract = chartContract({
  alternative:
    'Use AreaChart for accumulated magnitude, ColumnChart for discrete comparison, or CartesianChart only when compatible mark types share one honest scale.',
  counterExample: `<LineChart\n  data={[{product: "Alpha", defects: 4}, {product: "Beta", defects: 7}]}\n  description="Defects for unrelated products."\n  ${counterState}\n  series={[{id: "defects", label: "Defects", accessor: "defects"}]}\n  title="Product defects"\n  xAxis={{accessor: "product", label: "Product", scale: {type: "categorical"}}}\n  yAxis={{label: "Defects", scale: {type: "linear"}}}\n/>`,
  example: `<LineChart\n  ${commonProps}\n  ${visibilityProps}\n  legend={{label: "Energy series"}}\n  series={[{id: "demand", label: "Demand", accessor: "demand", showPoints: true}]}\n  title="Thermal demand"\n  xAxis={{accessor: "month", label: "Month", scale: {type: "categorical"}}}\n  yAxis={{label: "Energy", unit: "MWh", scale: {type: "linear"}}}\n/>`,
  misuse:
    'isolated categories, part-to-whole values, or values whose connecting slope implies a continuity that the data does not have',
  name: 'LineChart',
  purpose: 'Show change across an ordered or continuous domain with one or more lines.',
  use: 'one or more numeric series must show trend or change across an ordered category, numeric, logarithmic, or time domain',
});

export const lineChartContract: ComponentContract = {
  ...lineChartBaseContract,
  accessibility: [
    ...lineChartBaseContract.accessibility,
    'Selection instructions describe the available gestures. A localized count, item names, hidden-item labels, and Clear selection expose the persistent selection outside the SVG. Application activation and selection are separate actions with keyboard equivalents.',
  ],
  appearance: [
    ...lineChartBaseContract.appearance,
    'Filled point centers preview the click target: all visible points in category mode, one in point mode. Hover emphasizes the nearest visible line in either mode without narrowing a category selection or activation. Outer rings identify selected points; underlines identify selected categories. Fills and selection rings meet the marker outline without background gaps in light and dark appearances. A finite pulse acknowledges each activation and does not create a persistent inspected state. Optional idle point markers remain optional.',
  ],
  composition: [
    ...lineChartBaseContract.composition,
    'Supply interaction with target="category" or target="point", getRowId, and independently optional onActivate and selection. Application details, navigation, and other callback responses belong outside the chart. Share controlled selection between charts when their stable item identities represent the same records.',
  ],
  controlBehavior: [
    ...lineChartBaseContract.controlBehavior,
    'With selection enabled, ordinary click or touch tap toggles an item. Control/Command-click activates without changing selection. On touchscreens, press and hold activates once; release does not also select. Drag movement and pointer cancellation cancel a pending hold. Without selection, ordinary click or tap activates. Selection and activation never both fire merely because both capabilities are enabled.',
    'Drag horizontally to select a category range or draw a rectangle to select points. A new drag replaces selection. Shift or Control/Command adds; Alt removes. Escape or pointer cancellation restores the selection from before the drag. Dragging never activates and selection does not change chart domains.',
    'Reading previews and activation resolve the same nearest visible category, then the nearest visible point vertically for point targeting. Duplicate category coordinates use input order for category ties; point ties use input order then visible series order. Hidden points cannot be targeted. No rows are implicitly aggregated.',
  ],
  events: [
    ...lineChartBaseContract.events,
    'interaction.onActivate receives ChartActivation with item, category, original datum, input method, and associated raw values. The item has rowId and, for a point, seriesId. Each value contains seriesId, label, value, and hidden. A category produces one callback for one source row with all its series values, including hidden associated values. A point identifies its own series value. No renderer objects are exposed and no inspected state persists.',
    'selection accepts controlled selectedItems with required onSelectionChange, or uncontrolled defaultSelectedItems with optional onSelectionChange. These ownership models cannot be combined. onSelectionChange receives item identities independently of activation.',
    'Stable row and series IDs preserve selection through value updates and reorderings. Internal selection drops deleted rows and series; controlled state remains consumer-owned while unavailable items are omitted from rendering and commands. Hidden items remain selected and identified in the summary. Data replacement or visibility changes cancel active gestures. Changing target kinds discards incompatible selection.',
  ],
  examples: [
    ...lineChartBaseContract.examples,
    {
      code: `import {useState} from "react";\n\nexport function SelectableDemandChart() {\n  const [detail, setDetail] = useState<string | null>(null);\n  return (\n    <AppearanceProvider appearance="dark" accent="#2878ff">\n      <LineChart\n        ${commonProps.replaceAll('\n  ', '\n        ')}\n        interaction={{\n          target: "category",\n          getRowId: (datum) => datum.month,\n          onActivate: ({datum}) => setDetail(\`\${datum.month}: \${datum.demand} MWh\`),\n          selection: {\n            defaultSelectedItems: [],\n            labels: {\n              instructions: "Click or tap to select. Drag to select a range; Shift or Control/Command adds, Alt removes, and Escape cancels. Control/Command-click or press and hold to open details. Enter or Space selects; add Control/Command to open details.",\n              clear: "Clear selection",\n              empty: "Nothing selected",\n              summary: (count) => \`\${count} months selected\`,\n              item: ({rowId}) => rowId,\n              hidden: (label) => \`\${label} (hidden)\`,\n            },\n          },\n        }}\n        series={[{id: "demand", label: "Demand", accessor: "demand", showPoints: true}]}\n        title="Thermal demand"\n        xAxis={{accessor: "month", label: "Month", scale: {type: "categorical"}}}\n        yAxis={{label: "Energy", unit: "MWh", scale: {type: "linear"}}}\n      />\n      {detail ? <p>{detail}</p> : null}\n    </AppearanceProvider>\n  );\n}`,
      description:
        'Keep application details separate from chart selection. Ordinary clicks select a month; modified clicks or touch holds update the application detail without changing selection.',
      title: 'Independent activation and category selection',
    },
  ],
  keyboardBehavior: [
    ...lineChartBaseContract.keyboardBehavior,
    'Point readings announce the targeted series and value first while retaining the complete category reading. For interaction, Left/Right move between categories; point targeting also uses Up/Down to move between visible series. Home/End reach category endpoints. With selection enabled, Enter or Space toggles selection; Control/Command plus Enter or Space activates without changing selection. Without selection, Enter or Space activates. Escape cancels an active drag before clearing a reading.',
  ],
  localization: [
    ...lineChartBaseContract.localization,
    'selection.labels supplies instructions, clear, empty, summary(count), item(item), and hidden(label). Name selections from stable IDs with application labels. Instructions must describe the gestures enabled by this chart, including Control/Command activation and touch press-and-hold when activation and selection are both present.',
  ],
  parts: [
    ...lineChartBaseContract.parts,
    'Optional interaction adds category underlines, point selection rings, temporary activation feedback, and a localized selection summary with Clear selection. Application details and experiment controls are consumer-owned composition.',
  ],
  reducedMotionBehavior: [
    activationTiming,
    'Filled point pulses use a ten-screen-pixel base radius with the shared expansion and fade, including compact charts.',
    ...lineChartBaseContract.reducedMotionBehavior,
    'Repeated activation restarts finite feedback. Reduced motion replaces the activation pulse with a brief static acknowledgment while preserving callback and selection behavior.',
  ],
  validation: [
    ...lineChartBaseContract.validation,
    'interaction.getRowId must return a unique nonempty stable string for each datum, including when category labels repeat. Preserve IDs across sorting and refreshes and change an ID when its underlying identity changes. A category selection has rowId; a point selection also has seriesId. Selection geometry stays within explicit plotted domains.',
  ],
};

const areaChartBaseContract = chartContract({
  alternative:
    'Use LineChart when precise trend comparison matters more than magnitude, or ColumnChart for discrete category comparison.',
  counterExample: `<AreaChart\n  data={[{candidate: "North", votes: 42}, {candidate: "South", votes: 51}]}\n  description="Votes for unrelated candidates."\n  ${counterState}\n  series={[{id: "votes", label: "Votes", accessor: "votes"}]}\n  title="Votes by candidate"\n  xAxis={{accessor: "candidate", label: "Candidate", scale: {type: "categorical"}}}\n  yAxis={{label: "Votes", scale: {type: "linear"}}}\n/>`,
  example: `<AreaChart\n  ${commonProps}\n  ${visibilityProps}\n  legend={{label: "Energy series"}}\n  series={[{id: "demand", label: "Demand", accessor: "demand"}]}\n  stacking="overlap"\n  title="Thermal demand volume"\n  xAxis={{accessor: "month", label: "Month", scale: {type: "categorical"}}}\n  yAxis={{label: "Energy", unit: "MWh", scale: {type: "linear"}}}\n/>`,
  misuse:
    'unrelated series where filled overlap obscures comparison, or data where area would falsely imply accumulation or continuity',
  name: 'AreaChart',
  purpose: 'Show magnitude across an ordered domain with overlap, stacked, or normalized areas.',
  use: 'magnitude or contribution across an ordered domain benefits from a filled baseline and any stacking relationship is explicit',
});

function interactiveBarContract(
  base: ComponentContract,
  name: 'BarChart' | 'ColumnChart',
): ComponentContract {
  const horizontal = name === 'BarChart';
  const categoryArrows = horizontal ? 'Up/Down' : 'Left/Right';
  const seriesArrows = horizontal ? 'Left/Right' : 'Up/Down';
  const rangeDirection = horizontal ? 'vertically' : 'horizontally';
  const categoryAxis = '{accessor: "month", label: "Month", scale: {type: "categorical"}}';
  const valueAxis = '{label: "Energy", unit: "MWh", scale: {type: "linear"}}';
  return {
    ...base,
    responsiveBehavior: [
      ...base.responsiveBehavior,
      ...(horizontal
        ? [
            'Narrow charts with many categorical rows gain enough plot height to keep category labels separated. Plot bounds, axis titles and pointer coordinates share that enlarged viewport. Hiding series does not change category spacing.',
          ]
        : []),
    ],
    accessibility: [
      ...base.accessibility,
      'Selection instructions, a localized count, item names, hidden-item labels, and Clear selection expose selection outside the SVG. Keyboard reading cues identify the current bar or category without adding a whole-chart focus outline.',
    ],
    appearance: [
      ...base.appearance,
      'Persistent individual-bar selection uses an outer frame. Shared borders meet without covering the separate inset dashed reading outline. Category reading and activation follow the combined silhouette of visible bars without internal seams, including grouped and stacked layouts. Category selection underlines the category-axis label in either orientation. Bars do not gain circular point markers. Reading and selection remain distinct in light and dark appearances.',
    ],
    composition: [
      ...base.composition,
      'Optional interaction uses ChartInteraction<Datum, Category>, shared with LineChart, AreaChart, and CartesianChart. LineChartInteraction remains an exported compatibility alias. Supply target="category" or target="point", getRowId, and independently optional onActivate and selection. Here point means one bar identified by row and series. Share controlled selection between charts whose item IDs refer to the same records; application details and navigation remain consumer-owned.',
    ],
    controlBehavior: [
      ...base.controlBehavior,
      'With selection enabled, ordinary click or touch tap toggles the targeted item. Control/Command-click activates without changing selection. A touch press-and-hold activates once; release does not also select. Movement into a drag or pointer cancellation cancels a pending hold. Without selection, ordinary click or tap activates. Enabling both capabilities does not make both callbacks fire for one action.',
      `Drag ${rangeDirection} to select an inclusive category range, or draw a rectangle to select every bar rectangle it intersects in point mode. A new drag replaces selection; Shift or Control/Command adds, and Alt removes. Escape or pointer cancellation restores the selection from before the drag. Dragging never activates or changes chart domains.`,
      'Reading and activation choose the nearest visible category along its axis, then the nearest actual visible bar rectangle for point targeting. This applies to grouped, stacked, normalized, negative, and zero values within the existing input boundary. Hidden bars are not targets. Category activation remains one source-row action, without implicit aggregation.',
    ],
    events: [
      ...base.events,
      'interaction.onActivate receives ChartActivation with item, category, original datum, input method, and associated raw values. An item has rowId and, for an individual bar, seriesId. Each associated value has seriesId, label, value, and hidden. Category activation includes all source series values, including hidden ones; individual activation includes its own series value. Normalized callbacks retain raw source values while readings and positions use visible shares. No renderer objects or persistent inspected state are exposed.',
      'selection accepts controlled selectedItems with required onSelectionChange, or uncontrolled defaultSelectedItems with optional onSelectionChange. These ownership models cannot be combined. onSelectionChange receives stable item identities independently of activation.',
      'Stable row and series IDs preserve selection across value updates and reorderings. Internal selection drops deleted rows and series; controlled state remains consumer-owned, with unavailable items omitted from rendering and commands. Hidden items remain selected and named in the summary so restoring a series restores its frames. Data replacement or visibility changes cancel active gestures. Changing target kinds discards incompatible selection.',
    ],
    examples: [
      ...base.examples,
      {
        code: `export function Selectable${name}({onOpenDetails}: {readonly onOpenDetails: (message: string) => void}) {\n  return (\n    <AppearanceProvider appearance="dark" accent="#2878ff">\n      <${name}\n        ${commonProps.replaceAll('\n  ', '\n        ')}\n        ${visibilityProps}\n        layout="grouped"\n        legend={{label: "Energy series"}}\n        interaction={{\n          target: "point",\n          getRowId: (datum) => datum.month,\n          onActivate: ({category, values}) => onOpenDetails(\`\${category}: \${values.map(({label, value}) => \`\${label} \${value} MWh\`).join(", ")}\`),\n          selection: {\n            defaultSelectedItems: [],\n            labels: {\n              instructions: "Click or tap to select a bar. Drag a rectangle to select bars it touches; Shift or Control/Command adds, Alt removes, and Escape cancels. Control/Command-click or press and hold to open details. Enter or Space selects; add Control/Command to open details.",\n              clear: "Clear selection",\n              empty: "Nothing selected",\n              summary: (count) => \`\${count} bars selected\`,\n              item: ({rowId, seriesId}) => \`\${rowId}, \${seriesId === "demand" ? "Demand" : "Capacity"}\`,\n              hidden: (label) => \`\${label} (hidden)\`,\n            },\n          },\n        }}\n        series={[{id: "demand", label: "Demand", accessor: "demand"}, {id: "capacity", label: "Capacity", accessor: "capacity", color: "series-2"}]}\n        title="Demand and capacity"\n        xAxis={${horizontal ? valueAxis : categoryAxis}}\n        yAxis={${horizontal ? categoryAxis : valueAxis}}\n      />\n    </AppearanceProvider>\n  );\n}`,
        description:
          'Clicking selects a bar and draws its frame. Modified activation or a touch hold opens application details independently. Use target="category" for one month action and a category-label underline. The rendered example also offers stacked and normalized layouts with heating and cooling contributions.',
        title: 'Independent bar selection and activation',
      },
    ],
    keyboardBehavior: [
      ...base.keyboardBehavior,
      `${categoryArrows} move between categories; in point mode ${seriesArrows} move between visible series. Home/End reach category endpoints. Point readings announce the targeted series and value first and retain the complete category reading. Enter or Space toggles selection when enabled; Control/Command plus Enter or Space activates without changing selection. Without selection, Enter or Space activates. Escape cancels an active drag before clearing a reading.`,
    ],
    localization: [
      ...base.localization,
      'selection.labels supplies instructions, clear, empty, summary(count), item(item), and hidden(label). Name selected items using stable IDs and application labels. Describe the enabled gestures, including orientation-specific category dragging, modified activation, and touch press-and-hold when both selection and activation are present.',
    ],
    parts: [
      ...base.parts,
      'Optional interaction adds bar selection frames, inset reading outlines, category-label underlines, finite activation feedback, and a localized selection summary with Clear selection. Application details and controls remain outside the chart.',
    ],
    reducedMotionBehavior: [
      activationTiming,
      outlineMotion,
      ...base.reducedMotionBehavior,
      'Each activation restarts finite feedback. Reduced motion uses a brief static acknowledgment without changing callbacks or selection. Selection and reading geometry follow the same visible-data scale as the bars.',
    ],
    validation: [
      ...base.validation,
      'interaction.getRowId must return a unique nonempty stable string for each datum, including repeated category labels. Preserve IDs across sorting and refreshes; change an ID when the underlying identity changes. Category items have rowId; individual bars also have seriesId. All interaction geometry stays inside explicit plot domains. Existing grouped, stacked, and normalized input constraints remain in force.',
    ],
  };
}

const columnChartBaseContract = chartContract({
  alternative:
    'Use BarChart for long category labels, LineChart for continuous change, or AreaChart for accumulated magnitude.',
  counterExample: `<ColumnChart\n  data={[{second: 0, temperature: 18}, {second: 1, temperature: 18.2}, {second: 2, temperature: 18.4}]}\n  description="Dense temperature samples over time."\n  ${counterState}\n  series={[{id: "temperature", label: "Temperature", accessor: "temperature"}]}\n  title="Temperature samples"\n  xAxis={{accessor: "second", label: "Second", scale: {type: "linear"}}}\n  yAxis={{label: "Temperature", unit: "°C", scale: {type: "linear"}}}\n/>`,
  example: `<ColumnChart\n  ${commonProps}\n  ${visibilityProps}\n  layout="grouped"\n  legend={{label: "Energy series"}}\n  series={[{id: "demand", label: "Demand", accessor: "demand"}, {id: "capacity", label: "Capacity", accessor: "capacity", color: "series-2"}]}\n  title="Demand and capacity"\n  xAxis={{accessor: "month", label: "Month", scale: {type: "categorical"}}}\n  yAxis={{label: "Energy", unit: "MWh", scale: {type: "linear"}}}\n/>`,
  misuse:
    'a continuous domain with many samples, long category labels that need horizontal space, or stacked values with unrelated units',
  name: 'ColumnChart',
  purpose: 'Compare discrete categories with grouped, stacked, or normalized vertical columns.',
  use: 'numeric values must be compared across a modest set of discrete categories on a vertical plot',
});

const barChartBaseContract = chartContract({
  alternative:
    'Use ColumnChart when category order reads naturally across the horizontal axis, or LineChart for trends over a continuous domain.',
  counterExample: `<BarChart\n  data={[{month: "Jan", temperature: 18}, {month: "Feb", temperature: 22}]}\n  description="Temperature change over consecutive months."\n  ${counterState}\n  series={[{id: "temperature", label: "Temperature", accessor: "temperature"}]}\n  title="Temperature trend"\n  xAxis={{label: "Temperature", unit: "°C", scale: {type: "linear"}}}\n  yAxis={{accessor: "month", label: "Month", scale: {type: "categorical"}}}\n/>`,
  example: `<BarChart\n  ${commonProps}\n  ${visibilityProps}\n  layout="grouped"\n  legend={{label: "Energy series"}}\n  series={[{id: "demand", label: "Demand", accessor: "demand"}]}\n  title="Demand by month"\n  xAxis={{label: "Energy", unit: "MWh", scale: {type: "linear"}}}\n  yAxis={{accessor: "month", label: "Month", scale: {type: "categorical"}}}\n/>`,
  misuse:
    'a continuous trend, unordered part-to-whole values, or so many categories that comparison and labels no longer remain legible',
  name: 'BarChart',
  purpose: 'Compare discrete categories with grouped, stacked, or normalized horizontal bars.',
  use: 'numeric values must be compared across discrete categories whose labels benefit from a horizontal layout',
});

export const columnChartContract = interactiveBarContract(columnChartBaseContract, 'ColumnChart');
export const barChartContract = interactiveBarContract(barChartBaseContract, 'BarChart');

const cartesianChartBaseContract = chartContract({
  alternative:
    'Prefer LineChart, AreaChart, ColumnChart, or BarChart when one named mark family expresses the data without a mixed encoding.',
  counterExample: `<CartesianChart\n  data={[{month: "Jan", cost: 1200, temperature: 18}, {month: "Feb", cost: 900, temperature: 22}]}\n  description="Temperature and cost use unrelated units."\n  ${counterState}\n  legend={{label: "Unrelated series"}}\n  series={[{id: "cost", kind: "column", label: "Cost", accessor: "cost"}, {id: "temperature", kind: "line", label: "Temperature", accessor: "temperature"}]}\n  title="Cost and temperature"\n  xAxis={{accessor: "month", label: "Month", scale: {type: "categorical"}}}\n  yAxis={{label: "Mixed values", scale: {type: "linear"}}}\n/>`,
  example: `<CartesianChart\n  ${commonProps}\n  ${visibilityProps}\n  legend={{label: "Energy series"}}\n  series={[{id: "capacity", kind: "column", label: "Capacity", accessor: "capacity"}, {id: "demand", kind: "line", label: "Demand", accessor: "demand", showPoints: true}]}\n  title="Demand within capacity"\n  xAxis={{accessor: "month", label: "Month", scale: {type: "categorical"}}}\n  yAxis={{label: "Energy", unit: "MWh", scale: {type: "linear"}}}\n/>`,
  misuse:
    'series with incompatible units or domains, decorative mixed marks, or a case already expressed clearly by one named chart type',
  name: 'CartesianChart',
  purpose: 'Combine compatible line, area, and column series in one shared Cartesian frame.',
  use: 'compatible line, area, or column series share one category domain, one numeric scale, and one comparison question',
});

function interactiveAreaMixedContract(
  base: ComponentContract,
  name: 'AreaChart' | 'CartesianChart',
): ComponentContract {
  const area = name === 'AreaChart';
  const series = area
    ? '[{id: "demand", label: "Demand", accessor: "demand"}, {id: "capacity", label: "Capacity", accessor: "capacity", color: "series-2"}]'
    : '[{id: "capacity", kind: "column", label: "Capacity", accessor: "capacity"}, {id: "demand", kind: "line", label: "Demand", accessor: "demand", color: "series-2", showPoints: true}]';
  return {
    ...base,
    accessibility: [
      ...base.accessibility,
      'Selection instructions, a localized count, item names, hidden-item labels, and Clear selection expose selection outside the SVG. Keyboard reading cues identify the target without adding a whole-chart focus outline.',
    ],
    appearance: [
      ...base.appearance,
      area
        ? "A value marker sits at each targeted area's plotted upper boundary, including stacked and normalized areas. Filled centers preview the target; outer rings persist for selected values. Rings meet the marker outline without a background gap. Category mode previews every visible value and underlines selected category labels."
        : 'Each mark keeps its own interaction cues. Columns use inset reading outlines and outer selection frames; line and area values use filled reading markers and outer selection rings. Area markers follow the plotted upper boundary. Category mode previews all visible values, combining column outlines without internal seams, and underlines selected category labels.',
      'A brief pulse acknowledges every activation, including repeated activation of the same item. Reading, selection, and whole-series legend emphasis remain distinct in both appearances.',
    ],
    composition: [
      ...base.composition,
      'Optional interaction uses ChartInteraction<Datum, Category>, shared with LineChart, BarChart, and ColumnChart. LineChartInteraction remains an exported compatibility alias. Supply target="category" or target="point", getRowId, and independently optional onActivate and selection. Point targeting identifies one row and series, including for area values and columns. Consumers own application details and navigation and may share controlled selection across charts with matching stable identities.',
    ],
    controlBehavior: [
      ...base.controlBehavior,
      'With selection enabled, click or touch tap toggles the target. Control/Command-click activates without changing selection. Touch press-and-hold activates once; release does not also select. Drag movement or pointer cancellation cancels the pending hold. Without selection, ordinary click or tap activates. Selection and activation do not both fire for the same action.',
      `Drag horizontally to select an inclusive category range. In point mode, draw a rectangle to select ${area ? 'area value markers inside it' : 'line and area value markers inside it and every column rectangle it intersects'}. A new drag replaces selection; Shift or Control/Command adds, and Alt removes. Escape or pointer cancellation restores the selection from before the drag. Dragging never activates or changes chart domains.`,
      'Reading previews and activation use the same target. Resolve the nearest visible category, then the actual shapes under the pointer, including sloping area boundaries between categories. Legend emphasis breaks ties only among overlapping shapes under the pointer. A sole hovered shape wins even when another series is pinned. Empty space falls back to the nearest value marker or bar rectangle. Line points have a small nearby hit region so an overlapping column cannot swallow their targets. Hidden series cannot win.',
      'Category targeting previews all visible series but produces one source-row action. Hidden values remain associated data. Duplicate category coordinates retain input order, without implicit row aggregation.',
    ],
    events: [
      ...base.events,
      'interaction.onActivate receives ChartActivation with item, category, original datum, input method, and associated raw values. An item has rowId and, for an individual value, seriesId. Each associated value has seriesId, label, value, and hidden. Category activation includes all source series values, including hidden ones; point activation includes its own series value. Stacked and normalized positions do not change raw callback values. No renderer objects or persistent inspected state are exposed.',
      'selection accepts controlled selectedItems with required onSelectionChange, or uncontrolled defaultSelectedItems with optional onSelectionChange. These ownership models cannot be combined. onSelectionChange receives stable item identities independently of activation.',
      'Stable row and series IDs preserve selection across value updates and reorderings. Internal selection drops deleted rows and series; controlled state remains consumer-owned, with unavailable items omitted from rendering and commands. Hidden values remain selected and named in the summary, and their selection cues return when shown. Data replacement or visibility changes cancel active gestures. Changing target kinds discards incompatible selection.',
    ],
    examples: [
      ...base.examples,
      {
        code: `export function Selectable${name}({onOpenDetails}: {readonly onOpenDetails: (message: string) => void}) {\n  return (\n    <AppearanceProvider appearance="dark" accent="#2878ff">\n      <${name}\n        ${commonProps.replaceAll('\n  ', '\n        ')}\n        ${visibilityProps}\n        ${area ? 'stacking="overlap"\n        ' : ''}legend={{label: "Energy series"}}\n        interaction={{\n          target: "point",\n          getRowId: (datum) => datum.month,\n          onActivate: ({category, values}) => onOpenDetails(\`\${category}: \${values.map(({label, value}) => \`\${label} \${value} MWh\`).join(", ")}\`),\n          selection: {\n            defaultSelectedItems: [],\n            labels: {\n              instructions: "Click or tap to select a value. Drag to select ${area ? 'enclosed value markers' : 'enclosed value markers and intersected columns'}; Shift or Control/Command adds, Alt removes, and Escape cancels. Control/Command-click or press and hold to open details. Enter or Space selects; add Control/Command to open details.",\n              clear: "Clear selection",\n              empty: "Nothing selected",\n              summary: (count) => \`\${count} values selected\`,\n              item: ({rowId, seriesId}) => \`\${rowId}, \${seriesId === "demand" ? "Demand" : "Capacity"}\`,\n              hidden: (label) => \`\${label} (hidden)\`,\n            },\n          },\n        }}\n        series={${series}}\n        title="Demand and capacity"\n        xAxis={{accessor: "month", label: "Month", scale: {type: "categorical"}}}\n        yAxis={{label: "Energy", unit: "MWh", scale: {type: "linear"}}}\n      />\n    </AppearanceProvider>\n  );\n}`,
        description: area
          ? 'Select an area value at its upper boundary and open application details independently. Use target="category" for one month action with all associated values. The rendered example also offers stacked and normalized heating and cooling areas, controlled selection, and independent selection and activation switches.'
          : 'Select a column or line value with its own frame or ring and open application details independently. Use target="category" to preview both marks and activate one month. The rendered example also offers columns with an area, controlled selection, and independent selection and activation switches.',
        title: 'Independent value selection and activation',
      },
    ],
    keyboardBehavior: [
      ...base.keyboardBehavior,
      'Left/Right move between categories; in point mode Up/Down move between visible series. Home/End reach category endpoints. Point readings announce the targeted series and value first while retaining the complete category reading. Enter or Space toggles selection when enabled; Control/Command plus Enter or Space activates without changing selection. Without selection, Enter or Space activates. Escape cancels an active drag before clearing a reading.',
    ],
    localization: [
      ...base.localization,
      'selection.labels supplies instructions, clear, empty, summary(count), item(item), and hidden(label). Name selected items using stable IDs and application labels. Describe the enabled gestures, including category ranges or mark selection, modified activation, and touch press-and-hold when selection and activation are both enabled.',
    ],
    parts: [
      ...base.parts,
      `Optional interaction adds ${area ? 'area value markers and selection rings' : 'per-mark reading cues, selection rings, and column frames'}, category-label underlines, finite activation feedback, and a localized selection summary with Clear selection. Application details and controls remain outside the chart.`,
    ],
    reducedMotionBehavior: [
      activationTiming,
      outlineMotion,
      'Filled point pulses use a ten-screen-pixel base radius with the shared expansion and fade, including compact charts.',
      ...base.reducedMotionBehavior,
      'Each activation restarts finite feedback. Reduced motion uses a brief static acknowledgment without changing callbacks or selection. Reading and selection geometry follow the same visible-data scale as the marks.',
    ],
    validation: [
      ...base.validation,
      'interaction.getRowId must return a unique nonempty stable string for each datum, including repeated category labels. Preserve IDs across sorting and refreshes; change an ID when the underlying identity changes. Category items have rowId; individual values also have seriesId. All interaction geometry stays inside explicit plot domains. Existing area stacking, normalization, scale constraints, and compatible mixed-series combinations remain the input boundary.',
    ],
  };
}

export const areaChartContract = interactiveAreaMixedContract(areaChartBaseContract, 'AreaChart');
export const cartesianChartContract = interactiveAreaMixedContract(
  cartesianChartBaseContract,
  'CartesianChart',
);

interface StatisticalChartContractOptions {
  readonly alternative: string;
  readonly counterExample: string;
  readonly example: string;
  readonly keyboard: string;
  readonly misuse: string;
  readonly name: Extract<ChartName, 'BoxPlot' | 'BubbleChart' | 'Histogram' | 'ScatterChart'>;
  readonly purpose: string;
  readonly use: string;
  readonly validation: string;
}

interface StatisticalChartGuidance {
  readonly accent: string;
  readonly appearance: string;
  readonly composition: string;
  readonly content: string;
  readonly control: readonly string[];
  readonly events: string;
  readonly forcedColors: string;
  readonly labeling: string;
  readonly localization: string;
  readonly parts: string;
  readonly reducedMotion: string;
  readonly responsive: string;
}

const statisticalChartGuidance: Record<
  StatisticalChartContractOptions['name'],
  StatisticalChartGuidance
> = {
  ScatterChart: {
    accent:
      'Application accent identifies the first ordinary point group. Later groups use the role-aware chart palette, and automatic colors avoid explicit ordinary choices.',
    appearance:
      'Each point has a translucent group-color fill and a stronger edge. Shape distinguishes groups when color is unavailable or points overlap. Direct reading dims every other point.',
    composition:
      'Render ScatterChart inside AppearanceProvider in consumer-owned layout. Provide one record per point, separate id and label accessors, two quantitative axes, and one to six declared series. Supply visible title, description, axis labels, units, state copy, and a localized dataTableLabel. Multiple point groups require a visible legend.',
    content:
      'Use stable point ids and labels that identify individual observations. Name both measurements and their units directly. Use groups only when they support comparison.',
    control: [
      'Legend hover and focus temporarily emphasize one point group. Click, Enter, or Space pins it. A pinned group receives paint and hit-test priority only among actual overlapping point shapes. Repeat the action or press Escape to clear the pin and temporary hover/focus emphasis. Keyboard focus stays on the button.',
    ],
    events:
      'ScatterChart manages point readings and group emphasis internally. Pointer, keyboard, touch, and legend interaction do not mutate consumer data.',
    forcedColors:
      'Forced colors preserve axes and point boundaries in system colors. Point shapes and the generated table keep groups and values distinguishable without color.',
    labeling:
      'title, description, both axis labels, and dataTableLabel are required. Point labels identify observations. Group labels must stand alone, and the legend label names their collection.',
    localization:
      'Localize titles, descriptions, state copy, point and group labels, axis labels, units, and legend text. Use each axis formatTick for locale-specific numeric formatting.',
    parts:
      'ScatterChart contains a named figure, visible caption, optional feedback, a group legend when multiple groups exist, interactive SVG plot, quantitative axes, translucent shaped points, shared tooltip, polite announcement, and generated native data table.',
    reducedMotion:
      'Reduced motion removes point-emphasis, legend, and scrollbar transitions. Reading, focus, and native scrolling behavior stays the same.',
    responsive:
      'Horizontal axes consider formatted labels on categorical, time and numeric scales, using staggered rows before local scrolling. Complete vertical titles reserve space and wrap when needed. The production chart frame scales type, strokes, and plot geometry from measured space. Scatter points keep a bounded readable rendered size as the plot narrows. minimumSize and overflow retain the established local-scroll behavior.',
  },
  BubbleChart: {
    accent:
      'Application accent identifies the first ordinary bubble group. Later groups use the role-aware chart palette, and automatic colors avoid explicit ordinary choices.',
    appearance:
      'Each bubble has a translucent group-color fill and a stronger edge. Shape distinguishes groups, while proportional area expresses magnitude. Direct reading dims every other bubble.',
    composition:
      'Render BubbleChart inside AppearanceProvider in consumer-owned layout. Provide the ScatterChart point contract plus one positive finite magnitude accessor, its label, and an optional unit. Supply visible title, description, axis labels, units, state copy, and a localized dataTableLabel. Multiple bubble groups require a visible legend.',
    content:
      'Use stable point ids and labels that identify individual observations. Name both coordinates, the magnitude, and their units directly. Use area only for a positive measure that supports proportional comparison.',
    control: [
      'Legend hover and focus temporarily emphasize one bubble group. Click, Enter, or Space pins it. A pinned group receives paint and hit-test priority only among actual overlapping bubble shapes. Repeat the action or press Escape to clear the pin and temporary hover/focus emphasis. Keyboard focus stays on the button.',
    ],
    events:
      'BubbleChart manages bubble readings and group emphasis internally. Pointer, keyboard, touch, and legend interaction do not mutate consumer data.',
    forcedColors:
      'Forced colors preserve axes and bubble boundaries in system colors. Point shapes and the generated table keep groups, coordinates, and source magnitudes distinguishable without color.',
    labeling:
      'title, description, both axis labels, magnitude label, and dataTableLabel are required. Point labels identify observations. Group labels must stand alone, and the legend label names their collection.',
    localization:
      'Localize titles, descriptions, state copy, point and group labels, axis and magnitude labels, units, and legend text. Use axis formatTick and magnitude formatValue for locale-specific numeric formatting.',
    parts:
      'BubbleChart contains a named figure, visible caption, optional feedback, a group legend when multiple groups exist, interactive SVG plot, quantitative axes, translucent proportional bubbles, shared tooltip, polite announcement, and generated native data table.',
    reducedMotion:
      'Reduced motion removes bubble-emphasis, legend, and scrollbar transitions. Reading, focus, and native scrolling behavior stays the same.',
    responsive:
      'Horizontal axes consider formatted labels on categorical, time and numeric scales, using staggered rows before local scrolling. Complete vertical titles reserve space and wrap when needed. The production chart frame scales type, strokes, and plot geometry from measured space. Bubble area remains proportional to source magnitude while the maximum rendered radius stays bounded across widths. minimumSize and overflow retain the established local-scroll behavior.',
  },
  Histogram: {
    accent:
      'Application accent colors the histogram bins. Count, proportion, or density remains explicit in the axis, tooltip, and generated table rather than depending on color.',
    appearance:
      'Contiguous translucent bins share the numeric baseline and use stronger boundaries to keep adjacent intervals distinct. Direct reading dims every other bin and uses an inset outline. Selection frames meet at exact shared edges without covering the neighboring reading outline.',
    composition:
      'Render Histogram inside AppearanceProvider in consumer-owned layout. Choose raw observations with explicit or automatic thresholds, or pre-binned records with lower, upper, ordinate accessor, and count, proportion, or density meaning. Supply visible title, description, axis labels, units, state copy, and a localized dataTableLabel.',
    content:
      'Name the measured variable, its unit, and the ordinate directly. Choose thresholds that produce meaningful intervals. Do not describe unrelated categories as bins or pass pre-aggregated values as raw observations.',
    control: [
      'Optional HistogramInteraction<Datum> enables independent activation and selection. HistogramSelectionItem identifies a bin with kind: bin, lower, upper, and upperInclusive. Identity follows that complete interval, including its inclusion rule. Count updates preserve identity; changing thresholds does not transfer selection to a different interval.',
      'Drag selects bin rectangles that intersect the drag rectangle, including zero-height bins at their rendered baseline.',
    ],
    events:
      'interaction.onActivate receives HistogramActivation<Datum> with the interval item, raw displayed value, ordinate of count, proportion, or density, and input of pointer, keyboard, or touch. source.kind is raw with data containing the valid original records in the bin, or binned with datum containing the supplied bin record. onSelectionChange receives named interval items. Density and proportion are never reported as counts.',
    forcedColors:
      'Forced colors preserve axes and bin boundaries in system colors. Interval and ordinate values remain complete in the generated table.',
    labeling:
      'title, description, both axis labels, and dataTableLabel are required. The horizontal label names the measured variable and unit; the vertical label names the count, proportion, or density being plotted.',
    localization:
      'Localize titles, descriptions, state copy, axis labels, and units. Use each axis formatTick for locale-specific interval and ordinate formatting.',
    parts:
      'Histogram contains a named figure, visible caption, optional feedback, interactive SVG plot, two quantitative axes, contiguous translucent bins, shared tooltip, polite announcement, and generated native data table.',
    reducedMotion:
      'Reduced motion removes bin-emphasis and scrollbar transitions. Reading, focus, and native scrolling behavior stays the same.',
    responsive:
      'The production chart frame scales type, strokes, and plot geometry from measured space while bin boundaries remain aligned to their numeric intervals. minimumSize and overflow retain the established local-scroll behavior.',
  },
  BoxPlot: {
    accent:
      'Application accent identifies the first ordinary distribution group. Later groups use the role-aware chart palette, and automatic colors avoid explicit ordinary choices.',
    appearance:
      'Each quartile box has a translucent group-color fill and stronger boundary. Whisker tails stop at Q1 and Q3, and their caps paint above the box so short whiskers remain visible. Only the median crosses the box. Outliers remain separate marks and direct reading dims every other mark. An interactive summary reading uses an inset outline and whisker cues, with no dot on the median. Selection frames the box; an outlier reading has a filled center and outlier selection uses a ring.',
    composition:
      'Render BoxPlot inside AppearanceProvider in consumer-owned layout. Choose raw observations with Tukey or min-max whiskers, or one explicit summary record per declared group with quartiles, median, whiskers, outliers, and whisker method. Supply visible title, description, axis labels, units, state copy, and a localized dataTableLabel. Multiple distribution groups require a visible legend.',
    content:
      'Name each distribution group, numeric measure, unit, quartile method, and whisker method accurately. Use outliers as observations outside the declared whiskers, not as decorative points.',
    control: [
      'Legend hover and focus temporarily emphasize one distribution group. Click, Enter, or Space pins it. Repeat the action or press Escape to clear the pin and temporary hover/focus emphasis. Keyboard focus stays on the button.',
      'Optional BoxPlotInteraction<Datum> requires getOutlierId for both raw and summary distributions. Return a stable nonempty string unique within its group. Its context contains kind, groupId, value, and the original datum; summary mode also supplies outlierIndex. Preserve the ID only while it identifies the same observation. Equal values and array positions are not stable observation identities.',
      'BoxPlotSelectionItem identifies a group summary with kind: summary and groupId, or a separate outlier with kind: outlier, groupId, and outlierId. Selecting a summary does not select its contributing records or outliers.',
      'Drag selects a summary when its central quartile box touches the rectangle, including a zero-spread box at its rendered median segment. Outliers are selected only when their centers are inside the rectangle.',
    ],
    events:
      'interaction.onActivate receives BoxPlotActivation<Datum> with kind, item, and input of pointer, keyboard, or touch. Summary activation includes summary with lowerWhisker, q1, median, q3, upperWhisker, whisker method, and outliers. Its source is raw with valid contributing data, or summary with the supplied datum. Outlier activation includes value and source of raw with the original datum, or summary with the supplied datum and outlierIndex. Summary inputs cannot reconstruct original observations. onSelectionChange receives named summary or outlier items.',
    forcedColors:
      'Forced colors preserve quartile, median, whisker, and outlier boundaries in system colors. Geometry and the generated table retain every statistical role without color.',
    labeling:
      'title, description, both axis labels, and dataTableLabel are required. Group labels must stand alone, and the legend label names their collection. A group tooltip reports its quartiles, median, and whiskers without the method or outlier list. An outlier tooltip reports only its group and that observation. The generated table retains the complete method and outlier data.',
    localization:
      'Localize titles, descriptions, state copy, group labels, axis labels, units, and legend text. Use the quantitative axis formatTick for locale-specific summary and outlier formatting.',
    parts:
      'BoxPlot contains a named figure, visible caption, optional feedback, a group legend when multiple groups exist, interactive SVG plot, categorical and quantitative axes, quartile boxes, medians, split whisker tails, separate outlier marks, shared tooltip, polite announcement, and generated native data table.',
    reducedMotion:
      'Reduced motion removes mark-emphasis, legend, and scrollbar transitions. Reading, focus, and native scrolling behavior stays the same.',
    responsive:
      'The production chart frame scales type, strokes, boxes, whiskers, and outliers from measured space while preserving their statistical relationships. minimumSize and overflow retain the established local-scroll behavior.',
  },
};

function pointChartInteractionExample(name: 'ScatterChart' | 'BubbleChart'): string {
  const bubble = name === 'BubbleChart';
  return `export function Selectable${name}({onOpenDetails}: {readonly onOpenDetails: (message: string) => void}) {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <${name}
        data={[{id: "north-1", label: "North Monday", temperature: 18, demand: 28, stored: 42}, {id: "north-2", label: "North Tuesday", temperature: 56, demand: 68, stored: 88}]}
        dataTableLabel="Operating observations"
        description="Compare temperature and thermal demand across recorded observations."
        emptyState={{title: "No observations", description: "Choose a populated interval."}}
        invalidData={{title: "Invalid observations", description: "Correct invalid records."}}
        idAccessor="id"
        labelAccessor="label"
${bubble ? '        magnitude={{accessor: "stored", label: "Stored energy", unit: "MWh"}}\n' : ''}
        interaction={{
          onActivate: ({item, label, x, y, input${bubble ? ', magnitude' : ''}}) =>
            onOpenDetails(\`\${label} [\${item.rowId}, \${item.seriesId}]: \${x} °F, \${y} MWh${bubble ? ', ${magnitude} MWh stored' : ''} via \${input}\`),
          selection: {
            defaultSelectedItems: [],
            labels: {
              instructions: "Click or tap a mark to select. Drag from empty space to select centers inside the rectangle; Shift or Control/Command adds, Alt removes, and Escape cancels. Control/Command-click or touch press-and-hold opens details. Enter or Space selects; add Control/Command to open details.",
              clear: "Clear selection",
              empty: "Nothing selected",
              summary: (count) => \`\${count} observations selected\`,
              item: ({rowId, seriesId}) => \`\${rowId}, \${seriesId}\`,
              hidden: (label) => \`\${label} (hidden)\`,
            },
          },
        }}
        legend={{label: "Turbine loops"}}
        series={[{id: "north", label: "North loop"}]}
        ${visibilityProps}
        title="${bubble ? 'Stored energy observations' : 'Temperature and demand observations'}"
        xAxis={{accessor: "temperature", label: "Temperature", unit: "°F", scale: {type: "linear"}}}
        yAxis={{accessor: "demand", label: "Thermal demand", unit: "MWh", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}`;
}

function distributionChartInteractionExample(name: 'Histogram' | 'BoxPlot'): string {
  const histogram = name === 'Histogram';
  return `export function Selectable${name}({onOpenDetails}: {readonly onOpenDetails: (message: string) => void}) {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <${name}
        data={${histogram ? '[{latency: 8}, {latency: 21}, {latency: 44}, {latency: 47}]' : '[{id: "n-1", group: "north", value: 43}, {id: "n-2", group: "north", value: 48}, {id: "n-3", group: "north", value: 52}, {id: "n-4", group: "north", value: 54}, {id: "n-5", group: "north", value: 57}, {id: "n-6", group: "north", value: 104}]'}}
        dataTableLabel="Distribution data"
        description="Read the distribution, select statistical targets, and open their source details."
        distribution={${histogram ? '{kind: "raw", accessor: "latency", thresholds: [0, 20, 40, 60]}' : '{kind: "raw", valueAccessor: "value", whisker: "tukey"}'}}
        emptyState={{title: "No observations", description: "Choose a populated interval."}}
        invalidData={{title: "Invalid observations", description: "Correct invalid records."}}
${histogram ? '' : '        groupAccessor="group"\n        groups={[{id: "north", label: "North loop"}]}\n'}        interaction={{
${histogram ? '' : '          getOutlierId: ({datum}) => datum.id,\n'}          onActivate: (activation) => onOpenDetails(JSON.stringify(activation)),
          selection: {
            defaultSelectedItems: [],
            labels: {
              instructions: "Click or tap to select. Drag to select ${histogram ? 'intersected bins' : 'touched boxes and outlier centers inside the rectangle'}; Shift or Control/Command adds, Alt removes, and Escape cancels. Control/Command-click or touch hold opens details. Enter or Space selects; add Control/Command to open details.",
              clear: "Clear selection",
              empty: "Nothing selected",
              summary: (count) => \`\${count} targets selected\`,
              item: ${histogram ? '({lower, upper, upperInclusive}) => `[${lower}, ${upper}${upperInclusive ? "]" : ")"} ms`' : '(item) => item.kind === "summary" ? `${item.groupId} summary` : `${item.groupId} outlier ${item.outlierId}`'},
              hidden: (label) => \`\${label} (hidden)\`,
            },
          },
        }}
${histogram ? '' : `        legend={{label: "Turbine loops"}}\n        ${visibilityProps}\n`}        title="${histogram ? 'Restart latency' : 'Recovery-time distribution'}"
        xAxis={${histogram ? '{label: "Restart latency", unit: "ms", scale: {domain: [0, 60], type: "linear"}}' : '{label: "Turbine loop"}'}}
        yAxis={${histogram ? '{label: "Restarts", scale: {type: "linear"}}' : '{label: "Recovery time", unit: "minutes", scale: {type: "linear"}}'}}
      />
    </AppearanceProvider>
  );
}`;
}

function statisticalChartContract({
  alternative,
  counterExample,
  example: exampleCode,
  keyboard,
  misuse,
  name,
  purpose,
  use,
  validation,
}: StatisticalChartContractOptions): ComponentContract {
  const guidance = statisticalChartGuidance[name];
  const pointInteraction = name === 'ScatterChart' || name === 'BubbleChart';
  const groupVisibility = name !== 'Histogram';
  return {
    accentBehavior: [guidance.accent],
    accessibility: [
      'The visible title names one figure and the description explains the chart question. One keyboard boundary owns readings and announcements. The SVG is hidden from assistive technology; a generated native table exposes the valid chart data without interaction.',
    ],
    appearance: [
      guidance.appearance,
      ...(pointInteraction
        ? [
            'Interactive reading uses a small filled center. Selection outlines follow the full symbol; activation gives finite feedback. All six symbol shapes and bubble magnitude remain unchanged, and interaction cues stay inside the plot.',
          ]
        : []),
    ],
    appropriateUses: [use],
    composition: [
      guidance.composition,
      ...(groupVisibility
        ? [
            'Supply optional visibilityLabels: ChartVisibilityLabels and a named visible legend to enable an eye after each group name, including for a single group.',
          ]
        : []),
      ...(pointInteraction
        ? [
            'Supply optional PointChartInteraction<Datum> through interaction. selection and onActivate are independent. Existing idAccessor supplies stable observation IDs; each selection item has rowId and seriesId. There is no category target or second identity accessor. Consumers own details and may share controlled selection across charts with matching observation identities.',
          ]
        : []),
    ],
    contentRules: [guidance.content],
    controlBehavior: [
      'Pointer and touch input read only a directly targeted mark. Blank plot space clears pointer reading instead of guessing the nearest value. Direct reading dims every other mark.',
      ...guidance.control,
      ...(groupVisibility
        ? [
            'Each legend eye hides or restores its group independently of name-based emphasis. Hidden entries retain legend order, colors, and shapes. Hidden names cannot emphasize invisible marks. Hiding clears that group pin; restoring does not repin it.',
            name === 'BoxPlot'
              ? 'Hiding a group hides its summary and every outlier together. Remaining categories use declared group order. The numeric axis fits visible summaries and outliers without recomputing statistics across groups.'
              : 'Hiding a series hides all its observations. Both numeric axes fit visible observations. Bubble areas retain their magnitude interpretation within the visible dataset.',
            'Automatic numeric bounds fit visible groups with interruptible animation. Explicit consumer domains remain fixed and logarithmic bounds remain positive. Readings retain exact values throughout animation.',
            'Selections remain attached to hidden items and use the localized hidden selection label. Hidden items cannot be read, selected by dragging, or activated. Visibility, data, or geometry changes cancel pending gestures and stale readings; removed data still prunes selection.',
          ]
        : []),
      ...(pointInteraction
        ? [
            'With selection enabled, click or tap a mark toggles that observation. Control/Command-click activates without changing selection. Touch press-and-hold activates and suppresses selection on release. Without selection, click or tap activates when onActivate is supplied. Empty space has no click target.',
            'Drag from empty plot space to select observations whose centers are inside the rectangle. A drag replaces selection; Shift or Control/Command adds and Alt removes. Bubble edges alone do not qualify. Escape, pointer cancellation, or a data or geometry change cancels the pending gesture without committing it.',
            'Shared ChartSelection supports controlled selectedItems with onSelectionChange, or uncontrolled defaultSelectedItems. Supply labels for instructions, clear, empty, summary, item, and hidden. Selected state remains separate from the current reading and activation feedback. Neither selection nor activation changes records, scales, or domains.',
          ]
        : [
            'With selection enabled, click or tap toggles the target. Control/Command-click or touch press-and-hold activates without changing selection. Releasing a hold does not also select. Without selection, click or tap activates when onActivate is supplied.',
            'Drag replaces selection; Shift or Control/Command adds and Alt removes. Escape, pointer cancellation, or a data or geometry change cancels a pending drag or hold without committing it.',
            'Use ChartSelection<HistogramSelectionItem> or ChartSelection<BoxPlotSelectionItem> for controlled selectedItems with onSelectionChange, or uncontrolled defaultSelectedItems with optional onSelectionChange. Supply localized instructions, clear, empty, summary, item, and hidden labels. Existing ChartSelection and ChartSelectionLabels defaults remain compatible.',
            'Selection stays separate from readings and activation feedback. Retain available identities after data replacement and remove retired items from internal selection. Controlled state remains consumer-owned; unavailable items are omitted from rendering and commands. Selection and activation do not mutate statistics, records, or domains.',
          ]),
    ],
    counterExamples: [
      {
        code: example(`Misused${name}`, counterExample),
        description: misuse,
        title: `Do not misuse ${name}`,
      },
    ],
    directionality: [
      'Visible prose and categorical labels follow inherited writing direction. Quantitative axes preserve low-to-high mathematical order.',
    ],
    events: [
      ...(groupVisibility
        ? [
            'Group visibility remains internal and never mutates consumer data. Stable group IDs retain visibility across data updates. Removing a group ID drops its hidden state; new group IDs begin visible.',
          ]
        : []),
      ...(pointInteraction
        ? [
            'interaction.onActivate receives PointChartActivation<Datum> with item containing rowId and seriesId, the original datum, label, raw numeric x and y, optional raw magnitude for bubbles, and input of pointer, keyboard, or touch. onSelectionChange receives the next selection items. Readings and legend emphasis remain internal; callbacks expose no renderer objects.',
          ]
        : [guidance.events]),
    ],
    examples: [
      {
        code: example(`${name}Example`, exampleCode),
        description: purpose,
        title: `${name} with explicit statistical meaning`,
      },
      ...(pointInteraction
        ? [
            {
              code: pointChartInteractionExample(name),
              description:
                'Hide or restore a group with its legend eye, select observations, and open application-owned details independently. Hidden selections remain labeled, and the full table retains hidden groups. Automatic axes fit visible values; Show all series restores every group. The chart owns the uncontrolled selection in this example.',
              title: `${name} with selection and activation`,
            },
          ]
        : [
            {
              code: distributionChartInteractionExample(name),
              description: groupVisibility
                ? 'Hide or restore a group summary and its outliers together. Select targets and open their source details independently. Hidden selections remain labeled, and the full table retains hidden groups. The automatic value axis fits visible values; Show all series restores every group. The chart owns the uncontrolled selection in this example.'
                : 'Select statistical targets and receive their values, source records, and input method in an independent activation callback. The chart owns the uncontrolled selection in this example.',
              title: `${name} with selection and activation`,
            },
          ]),
    ],
    exportName: name,
    forcedColorBehavior: [guidance.forcedColors],
    formBehavior: [
      'Charts are not form controls and do not submit, validate, or reset values. Place filters and range controls beside the chart in consumer-owned composition.',
    ],
    importPath: '.',
    inappropriateUses: [misuse],
    keyboardBehavior: [
      ...(groupVisibility
        ? [
            'Tab reaches separate legend name and eye controls. Enter or Space on an eye hides or restores its group and retains focus on that eye. Plot navigation visits visible items only. Show all restores every group and returns focus to the first eye.',
          ]
        : []),
      `Tab reaches one title-named chart boundary. ${pointInteraction ? 'Without interaction, arrow keys move spatially between recorded observations with stable point id as the final tie-breaker.' : `Without interaction, ${keyboard.charAt(0).toLowerCase()}${keyboard.slice(1)}`} Home and End reach the domain endpoints. Escape clears the reading. A separately labeled local scroll region remains keyboard reachable when minimumSize requires overflow.`,
      ...(pointInteraction
        ? [
            'With interaction, Left/Right visit observations in data order, including coincident observations; Up/Down move spatially. Home/End reach the first and last observations. With selection enabled, Enter or Space toggles selection. Control/Command plus Enter or Space activates without changing selection. Without selection, Enter or Space activates. Escape cancels an active drag before clearing a reading. The reading marks keyboard focus without a whole-chart outline.',
          ]
        : [
            `With interaction, Left/Right and Up/Down traverse ${name === 'Histogram' ? 'bins in interval order' : 'each group summary followed by its individual outliers in declared group order, including equal-valued outliers'}. Home/End reach the first and last targets. Enter or Space toggles selection; add Control/Command to activate independently. Without selection, Enter or Space activates. Escape cancels a drag before clearing a reading. The reading marks keyboard focus without a whole-chart outline.`,
          ]),
    ],
    kind: 'component',
    labeling: [guidance.labeling],
    localization: [
      guidance.localization,
      ...(groupVisibility
        ? [
            'ChartVisibilityLabels requires hideSeries(label) and showSeries(label) for the next eye action, hidden for table group labels, allHidden with title and description, and showAll for recovery. ChartSelection labels.hidden describes retained hidden selections separately.',
          ]
        : []),
      'Localize every ChartSelection label and the instructions for the enabled selection and activation behavior.',
    ],
    name,
    parts: [
      guidance.parts,
      ...(groupVisibility
        ? [
            'Optional visibility adds separate legend eyes and an all-hidden recovery control. The complete native table retains every valid group and identifies hidden groups.',
          ]
        : []),
      ...(pointInteraction
        ? [
            'Optional interaction adds shape-following selection outlines, circular rings joined to the current mark border, filled reading centers, finite activation feedback, a drag rectangle, and a localized selection summary with a clear control.',
          ]
        : [
            'Optional interaction adds selection frames for bins or summaries, rings joined to the outlier border, finite activation feedback, a drag rectangle, and a localized selection summary with a clear control.',
          ]),
    ],
    preferredAlternatives: [alternative],
    preferredCompositions: [
      'Compose the chart with application-owned details and separate controls. Share ChartSelection through controlled selectedItems and onSelectionChange when charts refer to the same target identities. Filtering and zooming remain application-owned.',
    ],
    purpose,
    reducedMotionBehavior: [
      activationTiming,
      outlineMotion,
      guidance.reducedMotion,
      ...(groupVisibility
        ? [
            'Reduced motion settles automatic scale changes immediately, including when the preference changes during an animation. Otherwise axes and marks share the animated scale.',
          ]
        : []),
      'Reduced motion replaces the activation pulse with a brief static acknowledgment. Selection and reading retain the same meanings.',
    ],
    relatedExports: ['AppearanceProvider', ...chartNames.filter((chartName) => chartName !== name)],
    responsiveBehavior: [guidance.responsive],
    states: [
      ...(groupVisibility
        ? [
            'Hiding every group retains the caption, legend, full table, and selection summary. Localized allHidden copy distinguishes this state from empty or invalid data, and showAll restores every group.',
          ]
        : []),
      'Ready, loading, empty, partial, invalid-data, and error states are explicit. Partial data remains plotted with warning copy. Invalid records are omitted and reported; an entirely invalid dataset becomes unavailable.',
    ],
    stylesheet: './styles.css',
    summary: purpose,
    validation: [
      validation,
      ...(groupVisibility
        ? [
            'visibilityLabels requires a named visible legend. Validation uses the full supplied dataset before visibility, so hiding groups does not suppress invalid-data feedback.',
          ]
        : []),
    ],
  };
}

const statisticalState =
  'dataTableLabel="Statistical data"\n  emptyState={{title: "No observations", description: "Choose a populated interval."}}\n  invalidData={{title: "Invalid observations", description: "Correct missing or non-finite values."}}';

export const scatterChartContract = statisticalChartContract({
  alternative:
    'Use LineChart for an ordered trend, BubbleChart when one additional numeric measure belongs in mark area, or Histogram for a one-dimensional distribution.',
  counterExample: `<ScatterChart
  data={[{id: "a", label: "Alpha", productCode: 1, defects: 4}, {id: "b", label: "Beta", productCode: 2, defects: 7}]}
  description="Defects for unrelated products."
  ${statisticalState}
  idAccessor="id"
  labelAccessor="label"
  series={[{id: "products", label: "Products"}]}
  title="Product defects"
  xAxis={{accessor: "productCode", label: "Product code", scale: {type: "linear"}}}
  yAxis={{accessor: "defects", label: "Defects", scale: {type: "linear"}}}
/>`,
  example: `<ScatterChart
  data={[{id: "north-1", label: "North Monday", loop: "north", temperature: 18, demand: 28}, {id: "south-1", label: "South Monday", loop: "south", temperature: 56, demand: 68}]}
  dataTableLabel="Turbine observations"
  description="Compare temperature and thermal demand for recorded operating periods."
  emptyState={{title: "No observations", description: "Choose a populated interval."}}
  invalidData={{title: "Invalid observations", description: "Correct invalid records."}}
  idAccessor="id"
  labelAccessor="label"
  legend={{label: "Turbine loops"}}
  series={[{id: "north", label: "North loop"}, {id: "south", label: "South loop", color: "series-2"}]}
  seriesAccessor="loop"
  ${visibilityProps}
  title="Temperature and demand"
  xAxis={{accessor: "temperature", label: "Temperature", unit: "°F", scale: {type: "linear"}}}
  yAxis={{accessor: "demand", label: "Thermal demand", unit: "MWh", scale: {type: "linear"}}}
/>`,
  keyboard:
    'Arrow keys move spatially between recorded points with stable point id as the final tie-breaker.',
  misuse:
    'categorical codes, part-to-whole data, an ordered trend that needs connection, or coordinates that do not express a meaningful two-variable relationship',
  name: 'ScatterChart',
  purpose: 'Compare two quantitative measurements across distinct recorded observations.',
  use: 'each record is one identifiable observation and its two numeric measurements form the comparison',
  validation:
    'TypeScript requires numeric axis accessors and string id, label, and series accessors. Runtime preparation rejects duplicate point ids, unknown series, invalid domains, missing or non-finite coordinates, and out-of-domain values. Multiple series require seriesAccessor and a legend.',
});

export const bubbleChartContract = statisticalChartContract({
  alternative:
    'Use ScatterChart when area adds no necessary measure, Histogram for one-dimensional frequency, or a generated table when precise comparison of three measurements is the primary task.',
  counterExample: `<BubbleChart
  data={[{id: "a", label: "Alpha", x: 18, y: 28, rowNumber: 1}, {id: "b", label: "Beta", x: 56, y: 68, rowNumber: 2}]}
  description="Row number changes mark area."
  ${statisticalState}
  idAccessor="id"
  labelAccessor="label"
  magnitude={{accessor: "rowNumber", label: "Row number"}}
  series={[{id: "records", label: "Records"}]}
  title="Measurements by row"
  xAxis={{accessor: "x", label: "X", scale: {type: "linear"}}}
  yAxis={{accessor: "y", label: "Y", scale: {type: "linear"}}}
/>`,
  example: `<BubbleChart
  data={[{id: "north-1", label: "North Monday", temperature: 18, demand: 28, stored: 42}, {id: "north-2", label: "North Tuesday", temperature: 56, demand: 68, stored: 88}]}
  description="Compare temperature, demand, and stored energy."
  ${statisticalState}
  idAccessor="id"
  labelAccessor="label"
  magnitude={{accessor: "stored", label: "Stored energy", unit: "MWh"}}
  series={[{id: "north", label: "North loop"}]}
  legend={{label: "Turbine loops"}}
  ${visibilityProps}
  title="Stored energy"
  xAxis={{accessor: "temperature", label: "Temperature", unit: "°F", scale: {type: "linear"}}}
  yAxis={{accessor: "demand", label: "Thermal demand", unit: "MWh", scale: {type: "linear"}}}
/>`,
  keyboard:
    'Arrow keys move spatially between recorded bubbles with stable point id as the final tie-breaker.',
  misuse:
    'arbitrary ranking, record order, signed values, or another measure whose area would not support honest proportional comparison',
  name: 'BubbleChart',
  purpose:
    'Compare two quantitative coordinates while a third positive measure controls mark area.',
  use: 'each point has a third positive numeric measure whose proportional area materially aids comparison',
  validation:
    'BubbleChart applies the point-chart validation and requires every valid magnitude to be positive and finite. Radius uses a square-root mapping so rendered area remains proportional to the source magnitude.',
});

export const histogramContract = statisticalChartContract({
  alternative:
    'Use ColumnChart for unrelated categories, ScatterChart for paired measurements, or BoxPlot to compare compact distribution summaries across groups.',
  counterExample: `<Histogram
  data={[{productCode: 1}, {productCode: 2}, {productCode: 3}]}
  description="Product codes are unrelated categories."
  distribution={{kind: "raw", accessor: "productCode"}}
  ${statisticalState}
  title="Products"
  xAxis={{label: "Product code", scale: {type: "linear"}}}
  yAxis={{label: "Products", scale: {type: "linear"}}}
/>`,
  example: `<Histogram
  data={[{latency: 8}, {latency: 21}, {latency: 44}, {latency: 47}]}
  description="See which restart-latency ranges occurred most often."
  distribution={{kind: "raw", accessor: "latency", thresholds: [0, 20, 40, 60]}}
  ${statisticalState}
  title="Restart latency"
  xAxis={{label: "Restart latency", unit: "ms", scale: {domain: [0, 60], type: "linear"}}}
  yAxis={{label: "Restarts", scale: {type: "linear"}}}
/>`,
  keyboard: 'Left and Right traverse bins in domain order.',
  misuse:
    'unrelated categories, pre-aggregated values presented as raw observations, overlapping intervals, or unequal-width bins with unscaled counts',
  name: 'Histogram',
  purpose: 'Show a numeric distribution through contiguous intervals and an explicit ordinate.',
  use: 'frequency, proportion, or density across meaningful numeric intervals is the question',
  validation:
    'The discriminated distribution contract separates raw and binned inputs. Runtime validation rejects invalid thresholds, overlapping or reversed intervals, negative ordinates, proportions above one, out-of-domain values, and unequal-width count bins. Raw bins use lower-inclusive intervals; the final bin includes its upper bound.',
});

export const boxPlotContract = statisticalChartContract({
  alternative:
    'Use Histogram to inspect one distribution in detail, ScatterChart for paired observations, or a table when the individual records matter more than a summary.',
  counterExample: `<BoxPlot
  data={[{group: "north", value: 4}, {group: "south", value: 7}]}
  description="Each group contains one observation."
  distribution={{kind: "raw", valueAccessor: "value"}}
  groupAccessor="group"
  groups={[{id: "north", label: "North"}, {id: "south", label: "South"}]}
  legend={{label: "Groups"}}
  ${statisticalState}
  title="Single observations"
  xAxis={{label: "Group"}}
  yAxis={{label: "Value", scale: {type: "linear"}}}
/>`,
  example: `<BoxPlot
  data={[{group: "north", value: 43}, {group: "north", value: 48}, {group: "north", value: 52}, {group: "north", value: 54}, {group: "north", value: 57}, {group: "north", value: 104}]}
  description="Compare the center, spread, and outliers of recovery time."
  distribution={{kind: "raw", valueAccessor: "value", whisker: "tukey"}}
  groupAccessor="group"
  groups={[{id: "north", label: "North loop"}]}
  ${statisticalState}
  legend={{label: "Turbine loops"}}
  ${visibilityProps}
  title="Recovery-time distribution"
  xAxis={{label: "Turbine loop"}}
  yAxis={{label: "Recovery time", unit: "minutes", scale: {type: "linear"}}}
/>`,
  keyboard:
    'Left and Right traverse group summaries in declared order. Direct pointer or touch input can read each outlier separately.',
  misuse:
    'groups with too little data for a useful distribution summary, unknown quartile or whisker methods, or a task that requires reading every observation in the plot',
  name: 'BoxPlot',
  purpose: 'Compare distribution center, spread, whiskers, and outliers across declared groups.',
  use: 'one or more groups need a compact, method-explicit comparison of their numeric distributions',
  validation:
    'Raw mode calculates R-7 quartiles and defaults to Tukey 1.5-IQR whiskers; min-max remains explicit. Summary mode requires one ordered finite summary per group and explicit outliers. Runtime preparation rejects unknown or duplicate groups, reversed statistics, invalid values, and values outside an explicit domain. Interactive outlier IDs must be nonempty and unique within their group in either source mode.',
});
