import type {ComponentContract} from './component-contract.js';

type ChartName =
  | 'AreaChart'
  | 'BarChart'
  | 'BoxPlot'
  | 'BubbleChart'
  | 'CartesianChart'
  | 'ColumnChart'
  | 'Histogram'
  | 'LineChart'
  | 'ScatterChart';

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
  'Histogram',
  'LineChart',
  'ScatterChart',
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
      'The required visible title names one figure and the required description explains its point. One title-derived keyboard boundary announces the active category, every series value, and comparable numeric reference lines. The SVG remains hidden from assistive technology while a generated native data table exposes every valid value without interaction.',
    ],
    appearance: [
      'A direct instrument plot uses restrained grid and axis rails with readable utility typography. Filled marks use softened series color beneath stronger lines and boundaries. Dash and outline patterns supplement color when series overlap. The component does not add a card, dashboard chrome, or workflow layout.',
    ],
    appropriateUses: [use],
    composition: [
      'Render inside AppearanceProvider in the consumer-owned layout. Supply the records, typed accessors, axes, series, and state copy that describe this data view. A visible legend is required whenever the chart has more than one series; annotations remain optional.',
    ],
    contentRules: [
      'Use a specific title, one-sentence description, one to six short series labels, explicit axis labels and units, stable series ids, and only annotations that materially aid interpretation. Neutral or accent lines and bands are references; warning or danger lines and bands identify genuine semantic thresholds.',
    ],
    controlBehavior: [
      `${name} reads the nearest recorded category on pointer, keyboard, or touch input. Its tooltip reports every series and each numeric reference line on the value axis, and never interpolates values between records.`,
      'Legend hover and focus emphasize one series. Click, Enter, or Space pins that emphasis; repeat the action or press Escape to clear it. Emphasis never hides data, changes a domain, or filters records.',
      `${name} emits no consumer events and does not coordinate selection, mutate data, or own application workflow.`,
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
      `${name} manages bounded reading and legend emphasis internally without emitting consumer callbacks. Pointer, keyboard, touch, and legend interaction do not change its records or domain.`,
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
      'Tab reaches one title-named chart boundary. Left and Right read horizontal categories; Up and Down read vertical categories; Home and End reach the endpoints; Escape clears the reading. When local overflow is necessary, its separately labeled native scroll region remains keyboard reachable.',
    ],
    kind: 'component',
    labeling: [
      'title and description are visible and required. dataTableLabel supplies a localized accessible name for the generated table. Axis and series labels must stand on their own; legend labels name the series collection rather than repeating the chart title.',
    ],
    localization: [
      'Localize title, description, state copy, labels, units, legend and annotation text. Supply formatTick when locale-specific date or number formatting differs from the deterministic default.',
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
      'Reduced motion removes series-emphasis and scrollbar-fade transitions while preserving the same reading, focus, legend, and native scrolling states. Plot geometry does not animate.',
    ],
    relatedExports: ['AppearanceProvider', ...chartNames.filter((chartName) => chartName !== name)],
    responsiveBehavior: [
      "Charts scale readable type, marks, strokes, and pointer targets together from the available plot space. Every categorical label is rendered: horizontal labels use one row when possible, alternate across two rows when needed, and fall back to a labeled native scroll region with ScrollRegion's scrollbar behavior only at the legibility limit. Long labels may shorten while the generated table retains complete values. aspectRatio and minimumSize set explicit lower bounds; choose clip only when shrinking the complete plot is more important than local scrolling.",
    ],
    states: [
      'Ready, loading, empty, partial, invalid-data, and error states are explicit. Partial data remains plotted with warning copy; invalid rows are omitted and reported; an entirely invalid dataset becomes unavailable.',
    ],
    stylesheet: './styles.css',
    summary: purpose,
    validation: [
      'TypeScript bounds record accessors, scales, colors, layouts, annotation values, and the one-to-six series vocabulary. Runtime preparation assigns omitted colors without colliding with explicit ordinary choices, excludes missing or non-finite rows, requires a multi-series legend and representable filled-mark baseline, and gives empty and unavailable states distinct feedback.',
    ],
  };
}

const commonProps =
  'data={[{month: "Jan", demand: 42, capacity: 58}, {month: "Feb", demand: 51, capacity: 64}]}\n  dataTableLabel="Monthly energy data"\n  description="Monthly demand remains within available capacity."\n  emptyState={{title: "No demand data", description: "Choose a period with recorded demand."}}\n  invalidData={{title: "Invalid demand data", description: "Correct missing or non-finite values."}}';
const counterState =
  'dataTableLabel="Chart data"\n  emptyState={{title: "No values", description: "Choose a populated dataset."}}\n  invalidData={{title: "Invalid values", description: "Correct invalid records."}}';

export const lineChartContract = chartContract({
  alternative:
    'Use AreaChart for accumulated magnitude, ColumnChart for discrete comparison, or CartesianChart only when compatible mark types share one honest scale.',
  counterExample: `<LineChart\n  data={[{product: "Alpha", defects: 4}, {product: "Beta", defects: 7}]}\n  description="Defects for unrelated products."\n  ${counterState}\n  series={[{id: "defects", label: "Defects", accessor: "defects"}]}\n  title="Product defects"\n  xAxis={{accessor: "product", label: "Product", scale: {type: "categorical"}}}\n  yAxis={{label: "Defects", scale: {type: "linear"}}}\n/>`,
  example: `<LineChart\n  ${commonProps}\n  series={[{id: "demand", label: "Demand", accessor: "demand", showPoints: true}]}\n  title="Thermal demand"\n  xAxis={{accessor: "month", label: "Month", scale: {type: "categorical"}}}\n  yAxis={{label: "Energy", unit: "MWh", scale: {type: "linear"}}}\n/>`,
  misuse:
    'isolated categories, part-to-whole values, or values whose connecting slope implies a continuity that the data does not have',
  name: 'LineChart',
  purpose: 'Show change across an ordered or continuous domain with one or more lines.',
  use: 'one or more numeric series must show trend or change across an ordered category, numeric, logarithmic, or time domain',
});

export const areaChartContract = chartContract({
  alternative:
    'Use LineChart when precise trend comparison matters more than magnitude, or ColumnChart for discrete category comparison.',
  counterExample: `<AreaChart\n  data={[{candidate: "North", votes: 42}, {candidate: "South", votes: 51}]}\n  description="Votes for unrelated candidates."\n  ${counterState}\n  series={[{id: "votes", label: "Votes", accessor: "votes"}]}\n  title="Votes by candidate"\n  xAxis={{accessor: "candidate", label: "Candidate", scale: {type: "categorical"}}}\n  yAxis={{label: "Votes", scale: {type: "linear"}}}\n/>`,
  example: `<AreaChart\n  ${commonProps}\n  series={[{id: "demand", label: "Demand", accessor: "demand"}]}\n  stacking="overlap"\n  title="Thermal demand volume"\n  xAxis={{accessor: "month", label: "Month", scale: {type: "categorical"}}}\n  yAxis={{label: "Energy", unit: "MWh", scale: {type: "linear"}}}\n/>`,
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
  example: `<ColumnChart\n  ${commonProps}\n  layout="grouped"\n  legend={{label: "Energy series"}}\n  series={[{id: "demand", label: "Demand", accessor: "demand"}, {id: "capacity", label: "Capacity", accessor: "capacity", color: "series-2"}]}\n  title="Demand and capacity"\n  xAxis={{accessor: "month", label: "Month", scale: {type: "categorical"}}}\n  yAxis={{label: "Energy", unit: "MWh", scale: {type: "linear"}}}\n/>`,
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
  example: `<BarChart\n  ${commonProps}\n  layout="grouped"\n  series={[{id: "demand", label: "Demand", accessor: "demand"}]}\n  title="Demand by month"\n  xAxis={{label: "Energy", unit: "MWh", scale: {type: "linear"}}}\n  yAxis={{accessor: "month", label: "Month", scale: {type: "categorical"}}}\n/>`,
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
  example: `<CartesianChart\n  ${commonProps}\n  legend={{label: "Energy series"}}\n  series={[{id: "capacity", kind: "column", label: "Capacity", accessor: "capacity"}, {id: "demand", kind: "line", label: "Demand", accessor: "demand", showPoints: true}]}\n  title="Demand within capacity"\n  xAxis={{accessor: "month", label: "Month", scale: {type: "categorical"}}}\n  yAxis={{label: "Energy", unit: "MWh", scale: {type: "linear"}}}\n/>`,
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
