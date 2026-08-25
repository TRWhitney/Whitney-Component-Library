import type {ComponentContract} from './component-contract.js';

type ChartName = 'AreaChart' | 'BarChart' | 'CartesianChart' | 'ColumnChart' | 'LineChart';

interface ChartContractOptions {
  readonly alternative: string;
  readonly counterExample: string;
  readonly example: string;
  readonly misuse: string;
  readonly name: ChartName;
  readonly purpose: string;
  readonly use: string;
}

const chartNames = ['AreaChart', 'BarChart', 'CartesianChart', 'ColumnChart', 'LineChart'] as const;

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
