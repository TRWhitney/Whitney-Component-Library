# LineChart

Show change across an ordered or continuous domain with one or more lines.

## Use for

- one or more numeric series must show trend or change across an ordered category, numeric, logarithmic, or time domain

## Do not use for

- isolated categories, part-to-whole values, or values whose connecting slope implies a continuity that the data does not have

## Prefer instead

- Use AreaChart for accumulated magnitude, ColumnChart for discrete comparison, or CartesianChart only when compatible mark types share one honest scale.

## Composition and parts

- Render inside AppearanceProvider in the consumer-owned layout. Supply the records, typed accessors, axes, series, and state copy that describe this data view. A visible legend is required whenever the chart has more than one series; annotations remain optional.
- LineChart contains a named figure, visible caption, optional feedback, a required multi-series legend, interactive SVG plot, axes, marks, shared reading tooltip, optional annotations, and a generated native data table.

## Preferred higher-level compositions

- Compose charts with CollectionFilterBar or other separate controls, shared feedback components, and application-owned layout. Do not wrap them in a library dashboard or analysis workflow.

## Content

- Use a specific title, one-sentence description, one to six short series labels, explicit axis labels and units, stable series ids, and only annotations that materially aid interpretation. Neutral or accent lines and bands are references; warning or danger lines and bands identify genuine semantic thresholds.

## States

- Ready, loading, empty, partial, invalid-data, and error states are explicit. Partial data remains plotted with warning copy; invalid rows are omitted and reported; an entirely invalid dataset becomes unavailable.

## Control, events, validation, and forms

- LineChart reads the nearest recorded category on pointer, keyboard, or touch input. Its tooltip reports every series and each numeric reference line on the value axis, and never interpolates values between records.
- Legend hover and focus emphasize one series. Click, Enter, or Space pins that emphasis; repeat the action or press Escape to clear it. Emphasis never hides data, changes a domain, or filters records.
- LineChart emits no consumer events and does not coordinate selection, mutate data, or own application workflow.
- LineChart manages bounded reading and legend emphasis internally without emitting consumer callbacks. Pointer, keyboard, touch, and legend interaction do not change its records or domain.
- TypeScript bounds record accessors, scales, colors, layouts, annotation values, and the one-to-six series vocabulary. Runtime preparation assigns omitted colors without colliding with explicit ordinary choices, excludes missing or non-finite rows, requires a multi-series legend and representable filled-mark baseline, and gives empty and unavailable states distinct feedback.
- Charts are not form controls and do not submit, validate, or reset values. Filter and range controls belong beside the chart in consumer-owned composition.

## Accessibility

- The required visible title names one figure and the required description explains its point. One title-derived keyboard boundary announces the active category, every series value, and comparable numeric reference lines. The SVG remains hidden from assistive technology while a generated native data table exposes every valid value without interaction.

## Keyboard, labeling, localization, and direction

- Tab reaches one title-named chart boundary. Left and Right read horizontal categories; Up and Down read vertical categories; Home and End reach the endpoints; Escape clears the reading. When local overflow is necessary, its separately labeled native scroll region remains keyboard reachable.
- title and description are visible and required. dataTableLabel supplies a localized accessible name for the generated table. Axis and series labels must stand on their own; legend labels name the series collection rather than repeating the chart title.
- Localize title, description, state copy, labels, units, legend and annotation text. Supply formatTick when locale-specific date or number formatting differs from the deterministic default.
- Titles, descriptions, legends, and category labels follow inherited writing direction. Numeric axes preserve their mathematical order and horizontal plots retain low-to-high value progression.

## Appearance and responsive behavior

- A direct instrument plot uses restrained grid and axis rails with readable utility typography. Filled marks use softened series color beneath stronger lines and boundaries. Dash and outline patterns supplement color when series overlap. The component does not add a card, dashboard chrome, or workflow layout.
- Charts scale readable type, marks, strokes, and pointer targets together from the available plot space. Every categorical label is rendered: horizontal labels use one row when possible, alternate across two rows when needed, and fall back to a labeled native scroll region with ScrollRegion's scrollbar behavior only at the legibility limit. Long labels may shorten while the generated table retains complete values. aspectRatio and minimumSize set explicit lower bounds; choose clip only when shrinking the complete plot is more important than local scrolling.

## Accent, forced colors, and reduced motion

- Application accent identifies the first ordinary series and accent annotations. Later ordinary series orbit that accent with an achromatic fallback, and automatic colors avoid explicit ordinary choices. Success, warning, and danger remain semantic colors.
- Forced colors preserve axis and grid structure, retain series dash and outline patterns in system foreground and highlight colors, and keep the generated data table as the complete non-color representation.
- Reduced motion removes series-emphasis and scrollbar-fade transitions while preserving the same reading, focus, legend, and native scrolling states. Plot geometry does not animate.

## Examples

### LineChart with accessible source data

Show change across an ordered or continuous domain with one or more lines.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, LineChart} from '@trwhitney/component-library';

export function LineChartExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <LineChart
        data={[{month: "Jan", demand: 42, capacity: 58}, {month: "Feb", demand: 51, capacity: 64}]}
        dataTableLabel="Monthly energy data"
        description="Monthly demand remains within available capacity."
        emptyState={{title: "No demand data", description: "Choose a period with recorded demand."}}
        invalidData={{title: "Invalid demand data", description: "Correct missing or non-finite values."}}
        series={[{id: "demand", label: "Demand", accessor: "demand", showPoints: true}]}
        title="Thermal demand"
        xAxis={{accessor: "month", label: "Month", scale: {type: "categorical"}}}
        yAxis={{label: "Energy", unit: "MWh", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not misuse LineChart

isolated categories, part-to-whole values, or values whose connecting slope implies a continuity that the data does not have

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, LineChart} from '@trwhitney/component-library';

export function MisusedLineChart() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <LineChart
        data={[{product: "Alpha", defects: 4}, {product: "Beta", defects: 7}]}
        description="Defects for unrelated products."
        dataTableLabel="Chart data"
        emptyState={{title: "No values", description: "Choose a populated dataset."}}
        invalidData={{title: "Invalid values", description: "Correct invalid records."}}
        series={[{id: "defects", label: "Defects", accessor: "defects"}]}
        title="Product defects"
        xAxis={{accessor: "product", label: "Product", scale: {type: "categorical"}}}
        yAxis={{label: "Defects", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```
