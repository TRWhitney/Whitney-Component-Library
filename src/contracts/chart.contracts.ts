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
      'Legend hover and focus emphasize one series. Click, Enter, or Space pins that emphasis; repeat the action or press Escape to clear it. Emphasis never hides data, changes a domain, or filters records.',
      'Optional visibilityLabels enables unboxed open/closed eye buttons alongside series names. Each eye hides or restores its series without changing name-based emphasis. Hidden entries keep their order, color, and pattern. Hiding clears that series pin; restoring it does not repin it.',
      'Automatic numeric bounds fit visible series with brief, interruptible animation. Explicit consumer domains stay fixed, filled marks keep their zero baseline, and logarithmic bounds remain positive. Stacks recompute from visible series. Normalized plots and readings recompute visible shares on a 0-to-1 scale; the complete table retains shares of the full supplied data.',
      name === 'LineChart'
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
      `${name} manages reading, legend emphasis, and optional series visibility internally${name === 'LineChart' ? '' : ' without emitting consumer callbacks'}. Hiding or restoring series changes automatic bounds and visible readings without changing the supplied records. Stable series ids preserve visibility across value changes; removed series lose their hidden and pinned state, and new series start visible.`,
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
      'Application accent identifies the largest visible category. Later categories use the role-aware chart palette. A repeated color also receives a stable dash treatment so color is never its only identity.',
    ],
    accessibility: [
      'The visible title names one figure and the description explains the part-to-whole question. One title-named keyboard boundary owns slice readings and page announcements. The SVG is hidden from assistive technology, and the generated native table retains every valid category, including zero values and categories outside the current page.',
    ],
    appearance: [
      'Ordinary slices remain proportional to one another. The aggregate uses a dashed boundary and bold +N count. It is proportional by default, while aggregateSizing="smallest" makes it smaller than every ordinary slice without changing their relative proportions.',
    ],
    appropriateUses: [
      'one nonnegative measure forms a meaningful whole and the relative category shares matter more than exact side-by-side comparison',
    ],
    composition: [
      `Render ${name} inside AppearanceProvider in consumer-owned layout. Supply records, stable id and label accessors, one shared value meaning, state copy, localized paging and tooltip labels, a legend label, and a localized table label.`,
    ],
    contentRules: [
      `Use short category labels, one shared unit, a specific title, and a one-sentence description that states the comparison.${name === 'DonutChart' ? ' Center copy names the derived total.' : ''} Describe the aggregate as navigation over hidden records, never as a source category.`,
    ],
    controlBehavior: [
      'With more than eight positive categories, the first page shows seven ordinary slices and one aggregate. Activating the aggregate opens the next eight ranked categories, with another aggregate when records remain. Back returns through prior pages.',
      'Slice hover pops out the slice, mutes the others, and opens a cursor-following tooltip. Legend hover and focus use the same emphasis without a tooltip. Clicking a legend item pins that emphasis, another replaces it, and a repeat click or Escape clears it.',
      `${name} emits no consumer events and does not filter, select, or mutate records. Paging changes only the visible chart page; the table remains complete.`,
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
    ],
    examples: [
      {
        code: example(exampleName, `<${name}\n  ${partToWholeProps}${exampleTag}\n/>`),
        description: purpose,
        title: `${name} with complete category data`,
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
    ],
    kind: 'component',
    labeling: [
      'title, description, dataTableLabel, value label, legend label, state copy, page range, Back, aggregate count, and share labels are required. Category ids stay stable while labels provide human-readable names.',
    ],
    localization: [
      'Localize all visible and announced copy. categoryRange and moreCategories receive their numeric inputs, while value.formatValue controls locale-specific number formatting.',
    ],
    name,
    parts: [parts],
    preferredAlternatives: [
      'Use BarChart or ColumnChart for exact category comparison, LineChart for change over an ordered domain, or a native Table when values do not form one whole.',
    ],
    preferredCompositions: [
      'Compose the chart with separate filters and application-owned layout. Keep cross-chart selection and filtering outside the component.',
    ],
    purpose,
    reducedMotionBehavior: [
      'Reduced motion removes slice pop-out and scrollbar-fade transitions. Reading, focus, paging, emphasis, and native scrolling behavior stays the same.',
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
    'The visible title names one figure and the description explains the comparison. One title-named keyboard boundary announces the active dimension and every valid series value. The SVG is hidden from assistive technology, and a generated native table lists dimensions as rows and series as columns.',
  ],
  appearance: [
    'Every series uses the same nonnegative scale. Exact source values place the points. Direct hover draws a center-to-point guide and mutes the other series. When an isolated positive point would collapse a fill into a line, small shoulders shape the neighboring corners. These shoulders are visual-only and never change exact points, readings, or table values.',
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
    'Pointer and touch readings choose the nearest series value on one axis, draw a guide from the center to its exact point, mute the other series, and report only the chosen series with the axis name. Pointer tooltips follow the cursor. Touch readings stay open until another reading or an outside press replaces them.',
    'Legend hover and focus emphasize one series. Click, Enter, or Space pins it; another legend choice replaces it. A pinned series receives pointer priority where values are close or overlap. Repeat the pinned choice or press Escape to clear it. Emphasis never hides source data.',
    'RadarChart emits no consumer events and does not filter, select, or mutate records.',
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
    'RadarChart manages dimension readings and legend emphasis internally. Pointer, keyboard, touch, and legend interaction do not change consumer data.',
  ],
  examples: [
    {
      code: example(
        'RadarChartExample',
        '<RadarChart\n  data={[{id: "courier", label: "Courier", speed: 5, range: 4, reliability: 3}, {id: "scout", label: "Scout", speed: 2, range: 5}]}\n  dataTableLabel="Vehicle profile data"\n  description="Courier and Scout scores across shared vehicle qualities."\n  dimensions={[{id: "speed", label: "Speed", accessor: "speed"}, {id: "range", label: "Range", accessor: "range"}, {id: "reliability", label: "Reliability", accessor: "reliability"}]}\n  emptyState={{title: "No scores", description: "Choose vehicles with recorded scores."}}\n  idAccessor="id"\n  invalidData={{title: "Invalid scores", description: "Correct negative or non-finite scores."}}\n  labelAccessor="label"\n  labels={{dimension: "Quality"}}\n  legend={{label: "Vehicles"}}\n  title="Vehicle profiles"\n  value={{label: "Score", unit: "points"}}\n/>',
      ),
      description:
        'Compare subjects across ordered dimensions on one shared, nonnegative score scale.',
      title: 'RadarChart with complete and missing dimensions',
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
    'Tab reaches one title-named chart boundary. Left and Right move through dimensions in declared order, stop at the ends, and report every valid series at the selected dimension. Escape clears the reading. Legend buttons retain their usual focus, pin, replacement, and Escape behavior.',
  ],
  kind: 'component',
  labeling: [
    'title, description, dataTableLabel, value label, dimension heading, legend label, and state copy are required. Dimension and series ids stay stable while their labels provide readable names.',
  ],
  localization: [
    'Localize all visible and announced copy, dimension labels, series labels, and units. value.formatValue controls locale-specific number formatting.',
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
    'Reduced motion removes series-emphasis and scrollbar-fade transitions. Reading, focus, legend, and native scrolling behavior stays the same. Plot geometry does not animate.',
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
    'The visible title names one figure and the description explains the grid. One title-named keyboard boundary announces the active row, column, and value, including localized missing values. The visual grid is hidden from assistive technology, and a generated native table preserves every declared row and column intersection.',
  ],
  appearance: [
    'Every numeric cell uses one visible continuous color key. Sequential color represents low-to-high magnitude. Two-sided color meets at the declared midpoint. Missing cells use a neutral dashed crosshatch that cannot be mistaken for zero or a numeric extreme.',
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
    'Pointer and touch readings begin only on an exact cell and report that row, column, and value. Pointer tooltips follow the cursor. Touch readings stay open until another reading or an outside press replaces them. Missing cells remain readable.',
    'Heatmap emits no consumer events and does not select, filter, reorder, or mutate records.',
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
    'Heatmap manages cell readings and local scrolling internally. Pointer, keyboard, and touch interaction do not change consumer data.',
  ],
  examples: [
    {
      code: example(
        'HeatmapExample',
        '<Heatmap\n  columnAccessor="hour"\n  columns={[{id: "morning", label: "Morning"}, {id: "evening", label: "Evening"}]}\n  data={[{location: "north", hour: "morning", value: 0}, {location: "south", hour: "evening", value: 18}]}\n  dataTableLabel="Room temperature data"\n  description="Temperature by room and time; patterned cells have no reading."\n  emptyState={{title: "No grid", description: "Declare rooms and times to begin."}}\n  invalidData={{title: "Invalid readings", description: "Correct non-finite readings."}}\n  labels={{row: "Room", column: "Time", colorKey: "Temperature scale", missing: "No reading", scrollRegion: "Temperature grid"}}\n  rowAccessor="location"\n  rows={[{id: "north", label: "North room"}, {id: "south", label: "South room"}]}\n  scale={{color: "#d14f00", type: "sequential"}}\n  title="Room temperature"\n  value={{accessor: "value", label: "Temperature", unit: "°C"}}\n/>',
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
    'Tab reaches one title-named grid boundary. Left and Right move across columns; Up and Down move across rows. Home and End reach row endpoints. Control Home and Control End reach the first and last cell in the complete grid. Navigation stops at boundaries, and Escape clears the reading.',
  ],
  kind: 'component',
  labeling: [
    'title, description, dataTableLabel, value label, row and column headings, color-key label, localized missing copy, scroll-region label, and state copy are required. Row and column ids stay stable while labels provide readable names.',
  ],
  localization: [
    'Localize all visible and announced copy, domain labels, missing copy, and units. value.formatValue controls locale-specific number formatting.',
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
    'Reduced motion removes active-cell and scrollbar-fade transitions. Reading, focus, and native scrolling behavior stays the same. Grid geometry does not animate.',
  ],
  relatedExports: ['AppearanceProvider', ...chartNames.filter((name) => name !== 'Heatmap')],
  responsiveBehavior: [
    'Like other chart figures, Heatmap keeps a bounded default area instead of filling an arbitrarily wide parent. Row labels use only the width their text needs. Rows and cells shrink to their compact legible sizes before inline values disappear; only a grid that still cannot fit becomes a separately labeled local scroll region with the transient ScrollRegion scrollbar treatment. Fitted grids do not become scroll containers, and local overflow does not trap scrolling from the surrounding page. Every intersection remains in the generated table.',
  ],
  states: [
    'Ready, loading, empty-domain, partial, invalid-data, and error states are explicit. A declared grid with no records remains an all-missing grid. Non-finite records are omitted and reported; an entirely invalid nonempty dataset becomes unavailable.',
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
    'One restrained line shows the ordered series without axes or a legend. Missing values break the line. The current valid record uses a hollow circle. Every other observed low fills the lower half of its circle, while every other observed high fills the upper half, including ties. Reading one of those cues fills its open area with the foreground color; an ordinary active reading uses the same solid foreground point. Exact values remain in the tooltip, summary, announcement, and table.',
  ],
  appropriateUses: [
    'showing one compact trend whose ordered position, value range, current value, and observed extrema are explained by the nearby title and description',
  ],
  composition: [
    'Render Sparkline inside AppearanceProvider in consumer-owned layout. Supply one ordered record series, typed position and value accessors, position scale, value meaning, localized summary and missing labels, state copy, and a table label. Use valueRange when several sparklines need one fixed comparison range.',
  ],
  contentRules: [
    'Use a specific title and one factual sentence that explains the domain and trend without claiming that change is good or bad. Keep one value meaning and unit throughout. Use a fixed range only when it preserves the same comparison meaning across charts.',
  ],
  controlBehavior: [
    'Pointer reads the nearest recorded position and follows the cursor. Touch retains an exact reading until another reading or an outside press replaces it. Missing positions remain readable and report the localized missing label. Tooltips add the localized lowest or highest label when the active value matches an observed extreme and add no range label otherwise.',
    'Sparkline emits no consumer events and does not select, filter, interpolate, mutate, or assign semantic direction to records.',
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
    'Sparkline manages bounded record readings internally. Pointer, keyboard, and touch interaction do not change consumer data.',
  ],
  examples: [
    {
      code: example(
        'SparklineExample',
        '<Sparkline\n  data={[{month: "Jan", demand: 42}, {month: "Feb", demand: null}, {month: "Mar", demand: 51}]}\n  dataTableLabel="Thermal demand history"\n  description="Monthly thermal demand; February has no recorded reading."\n  emptyState={{title: "No history", description: "Record demand to begin."}}\n  invalidData={{title: "Invalid history", description: "Correct non-finite readings."}}\n  labels={{first: "First", last: "Last", lowest: "Lowest", highest: "Highest", missing: "No reading"}}\n  position={{accessor: "month", label: "Month", scale: {type: "categorical"}}}\n  title="Thermal demand"\n  value={{accessor: "demand", label: "Demand", unit: "MWh"}}\n/>',
      ),
      description:
        'Show one compact ordered trend with an honest gap, exact current value, observed range, and complete structured reading.',
      title: 'Sparkline with a missing position',
    },
  ],
  exportName: 'Sparkline',
  forcedColorBehavior: [
    'Forced colors preserve the line, directional half-filled low and high cues, hollow current cue, completed cue readings, ordinary foreground reading point, reading needle, and focus boundary in system colors. The summary and table retain exact non-color meaning.',
  ],
  formBehavior: [
    'Sparkline is not a form control and does not submit, validate, or reset values. Place dataset and range controls beside it in consumer-owned composition.',
  ],
  importPath: '.',
  inappropriateUses: [
    'multiple series, tasks requiring visible axes or persistent values, unordered records, categorical comparison without trend meaning, or claims that direction is favorable or unfavorable without consumer-written context',
  ],
  keyboardBehavior: [
    'Tab reaches one title-named chart boundary. Left and Right move through records in source order and stop at the ends. Home and End reach the sequence endpoints. Missing positions remain readable, and Escape clears the reading.',
  ],
  kind: 'component',
  labeling: [
    'title, description, dataTableLabel, position and value labels, first, last, lowest, highest, and missing labels, plus state copy are required. Position and value formatters provide exact readable values.',
  ],
  localization: [
    'Localize all visible and announced copy, summary labels, missing copy, and units. position.formatValue and value.formatValue control locale-specific formatting.',
  ],
  name: 'Sparkline',
  parts: [
    'Sparkline contains a named figure, standard visible caption, optional feedback, compact axis-free line, hollow current cue, directional half-filled range cues, cue-completing and ordinary temporary reading points, shared tooltip, polite announcement, derived summary, and generated native data table.',
  ],
  preferredAlternatives: [
    'Use LineChart when visible axes, multiple series, annotations, or fuller trend comparison are required. Use BarChart or ColumnChart for precise discrete comparison, or a native Table when exact records are the primary task.',
  ],
  preferredCompositions: [
    'Compose Sparkline with nearby consumer-owned metric context and filters. Give comparable sparklines the same valueRange and explain that shared range in their descriptions.',
  ],
  purpose: 'Show one compact ordered trend with exact current and observed-range context.',
  reducedMotionBehavior: [
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
    'Runtime preparation preserves source order. Negative values and zero are valid. Missing values remain gaps. Non-finite values and invalid positions are omitted and reported. Fixed value ranges and numeric or time position domains must be ascending and finite.',
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
    ...lineChartBaseContract.reducedMotionBehavior,
    'Repeated activation restarts finite feedback. Reduced motion replaces the activation pulse with a brief static acknowledgment while preserving callback and selection behavior.',
  ],
  validation: [
    ...lineChartBaseContract.validation,
    'interaction.getRowId must return a unique nonempty stable string for each datum, including when category labels repeat. Preserve IDs across sorting and refreshes and change an ID when its underlying identity changes. A category selection has rowId; a point selection also has seriesId. Selection geometry stays within explicit plotted domains.',
  ],
};

export const areaChartContract = chartContract({
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

export const columnChartContract = chartContract({
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

export const barChartContract = chartContract({
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

export const cartesianChartContract = chartContract({
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
      'Legend hover and focus temporarily emphasize one point group. Click, Enter, or Space pins it. A pinned group receives paint and hit-test priority where points overlap. Repeat the action or press Escape to clear the pin.',
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
      'The production chart frame scales type, strokes, and plot geometry from measured space. Scatter points keep a bounded readable rendered size as the plot narrows. minimumSize and overflow retain the established local-scroll behavior.',
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
      'Legend hover and focus temporarily emphasize one bubble group. Click, Enter, or Space pins it. A pinned group receives paint and hit-test priority where bubbles overlap. Repeat the action or press Escape to clear the pin.',
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
      'The production chart frame scales type, strokes, and plot geometry from measured space. Bubble area remains proportional to source magnitude while the maximum rendered radius stays bounded across widths. minimumSize and overflow retain the established local-scroll behavior.',
  },
  Histogram: {
    accent:
      'Application accent colors the histogram bins. Count, proportion, or density remains explicit in the axis, tooltip, and generated table rather than depending on color.',
    appearance:
      'Contiguous translucent bins share the numeric baseline and use stronger boundaries to keep adjacent intervals distinct. Direct reading dims every other bin.',
    composition:
      'Render Histogram inside AppearanceProvider in consumer-owned layout. Choose raw observations with explicit or automatic thresholds, or pre-binned records with lower, upper, ordinate accessor, and count, proportion, or density meaning. Supply visible title, description, axis labels, units, state copy, and a localized dataTableLabel.',
    content:
      'Name the measured variable, its unit, and the ordinate directly. Choose thresholds that produce meaningful intervals. Do not describe unrelated categories as bins or pass pre-aggregated values as raw observations.',
    control: [],
    events:
      'Histogram manages direct bin readings internally. Pointer, keyboard, and touch interaction do not mutate observations, bins, or domains.',
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
      'Each quartile box has a translucent group-color fill and stronger boundary. Whisker tails stop at Q1 and Q3, and their caps paint above the box so short whiskers remain visible. Only the median crosses the box. Outliers remain separate marks and direct reading dims every other mark.',
    composition:
      'Render BoxPlot inside AppearanceProvider in consumer-owned layout. Choose raw observations with Tukey or min-max whiskers, or one explicit summary record per declared group with quartiles, median, whiskers, outliers, and whisker method. Supply visible title, description, axis labels, units, state copy, and a localized dataTableLabel. Multiple distribution groups require a visible legend.',
    content:
      'Name each distribution group, numeric measure, unit, quartile method, and whisker method accurately. Use outliers as observations outside the declared whiskers, not as decorative points.',
    control: [
      'Legend hover and focus temporarily emphasize one distribution group. Click, Enter, or Space pins it. Repeat the action or press Escape to clear the pin.',
    ],
    events:
      'BoxPlot manages group-summary and outlier readings plus group emphasis internally. Pointer, keyboard, touch, and legend interaction do not mutate consumer data.',
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
  return {
    accentBehavior: [guidance.accent],
    accessibility: [
      'The visible title names one figure and the description explains the chart question. One keyboard boundary owns readings and announcements. The SVG is hidden from assistive technology; a generated native table exposes the valid chart data without interaction.',
    ],
    appearance: [guidance.appearance],
    appropriateUses: [use],
    composition: [guidance.composition],
    contentRules: [guidance.content],
    controlBehavior: [
      'Pointer and touch input read only a directly targeted mark. Blank plot space clears pointer reading instead of guessing the nearest value. Direct reading dims every other mark.',
      ...guidance.control,
      `${name} emits no consumer events and does not filter records, change domains, or own selection and coordinated chart state.`,
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
    events: [guidance.events],
    examples: [
      {
        code: example(`${name}Example`, exampleCode),
        description: purpose,
        title: `${name} with explicit statistical meaning`,
      },
    ],
    exportName: name,
    forcedColorBehavior: [guidance.forcedColors],
    formBehavior: [
      'Charts are not form controls and do not submit, validate, or reset values. Place filters and range controls beside the chart in consumer-owned composition.',
    ],
    importPath: '.',
    inappropriateUses: [misuse],
    keyboardBehavior: [
      `Tab reaches one title-named chart boundary. ${keyboard} Home and End reach the domain endpoints. Escape clears the reading. A separately labeled local scroll region remains keyboard reachable when minimumSize requires overflow.`,
    ],
    kind: 'component',
    labeling: [guidance.labeling],
    localization: [guidance.localization],
    name,
    parts: [guidance.parts],
    preferredAlternatives: [alternative],
    preferredCompositions: [
      'Compose charts with CollectionFilterBar or separate controls and application-owned layout. Keep cross-chart selection, filtering, zooming, and brushing outside this component.',
    ],
    purpose,
    reducedMotionBehavior: [guidance.reducedMotion],
    relatedExports: ['AppearanceProvider', ...chartNames.filter((chartName) => chartName !== name)],
    responsiveBehavior: [guidance.responsive],
    states: [
      'Ready, loading, empty, partial, invalid-data, and error states are explicit. Partial data remains plotted with warning copy. Invalid records are omitted and reported; an entirely invalid dataset becomes unavailable.',
    ],
    stylesheet: './styles.css',
    summary: purpose,
    validation: [validation],
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
    'Raw mode calculates R-7 quartiles and defaults to Tukey 1.5-IQR whiskers; min-max remains explicit. Summary mode requires one ordered finite summary per group and explicit outliers. Runtime preparation rejects unknown or duplicate groups, reversed statistics, invalid values, and values outside an explicit domain.',
});
