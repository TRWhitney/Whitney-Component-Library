# BarChart

Compare discrete categories with grouped, stacked, or normalized horizontal bars.

## Use for

- numeric values must be compared across discrete categories whose labels benefit from a horizontal layout

## Do not use for

- a continuous trend, unordered part-to-whole values, or so many categories that comparison and labels no longer remain legible

## Prefer instead

- Use ColumnChart when category order reads naturally across the horizontal axis, or LineChart for trends over a continuous domain.

## Composition and parts

- Render inside AppearanceProvider in the consumer-owned layout. Supply the records, typed accessors, axes, series, and state copy that describe this data view. A visible legend is required whenever the chart has more than one series; annotations remain optional.
- BarChart contains a named figure, visible caption, optional feedback, a required multi-series legend, deterministic SVG plot, axes, marks, optional annotations, and a generated native data table.

## Preferred higher-level compositions

- Compose charts with CollectionFilterBar or other separate controls, shared feedback components, and application-owned layout. Do not wrap them in a library dashboard or analysis workflow.

## Content

- Use a specific title, one-sentence description, one to six short series labels, explicit axis labels and units, stable series ids, and only annotations that materially aid interpretation. Neutral or accent lines and bands are references; warning or danger lines and bands identify genuine semantic thresholds.

## States

- Ready, loading, empty, partial, invalid-data, and error states are explicit. Partial data remains plotted with warning copy; invalid rows are omitted and reported; an entirely invalid dataset becomes unavailable.

## Control, events, validation, and forms

- BarChart is a static data display in this foundation. It does not filter records, coordinate selection, show tooltips, mutate domains, or own application workflow.
- BarChart emits no events in the Cartesian foundation. Later interaction components add bounded hover and selection behavior without changing this static meaning.
- TypeScript bounds record accessors, scales, colors, layouts, annotation values, and the one-to-six series vocabulary. Runtime preparation assigns omitted colors without colliding with explicit ordinary choices, excludes missing or non-finite rows, requires a multi-series legend and representable filled-mark baseline, and gives empty and unavailable states distinct feedback.
- Charts are not form controls and do not submit, validate, or reset values. Filter and range controls belong beside the chart in consumer-owned composition.

## Accessibility

- The required visible title names one figure and the required description explains its point. The SVG is hidden from assistive technology because a generated native data table exposes every valid category and series value before interaction.

## Keyboard, labeling, localization, and direction

- The static chart adds no tab stop or keyboard command. Its complete data table is available without requiring focus or pointer interaction.
- title and description are visible and required. dataTableLabel supplies a localized accessible name for the generated table. Axis and series labels must stand on their own; legend labels name the series collection rather than repeating the chart title.
- Localize title, description, state copy, labels, units, legend and annotation text. Supply formatTick when locale-specific date or number formatting differs from the deterministic default.
- Titles, descriptions, legends, and category labels follow inherited writing direction. Numeric axes preserve their mathematical order and horizontal plots retain low-to-high value progression.

## Appearance and responsive behavior

- A direct instrument plot uses restrained grid and axis rails with readable utility typography. Filled marks use softened series color beneath stronger lines and boundaries. Dash and outline patterns supplement color when series overlap. The component does not add a card, dashboard chrome, or workflow layout.
- Charts preserve a 480px minimum plot with local horizontal scrolling by default. Categorical tickCount bounds label density, and long visible labels shorten within the plot while the generated table retains complete values. aspectRatio and minimumSize make another plot budget explicit; choose clip only when shrinking the complete plot is more important than preserving text size.

## Accent, forced colors, and reduced motion

- Application accent identifies the first ordinary series and accent annotations. Later ordinary series orbit that accent with an achromatic fallback, and automatic colors avoid explicit ordinary choices. Success, warning, and danger remain semantic colors.
- Forced colors preserve axis and grid structure, retain series dash and outline patterns in system foreground and highlight colors, and keep the generated data table as the complete non-color representation.
- The static Cartesian foundation has no idle or data-transition motion. Reduced motion therefore preserves identical plot structure without a substitute animation.

## Examples

### BarChart with accessible source data

Compare discrete categories with grouped, stacked, or normalized horizontal bars.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, BarChart} from '@trwhitney/component-library';

export function BarChartExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <BarChart
        data={[{month: "Jan", demand: 42, capacity: 58}, {month: "Feb", demand: 51, capacity: 64}]}
        dataTableLabel="Monthly energy data"
        description="Monthly demand remains within available capacity."
        emptyState={{title: "No demand data", description: "Choose a period with recorded demand."}}
        invalidData={{title: "Invalid demand data", description: "Correct missing or non-finite values."}}
        layout="grouped"
        series={[{id: "demand", label: "Demand", accessor: "demand"}]}
        title="Demand by month"
        xAxis={{label: "Energy", unit: "MWh", scale: {type: "linear"}}}
        yAxis={{accessor: "month", label: "Month", scale: {type: "categorical"}}}
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not misuse BarChart

a continuous trend, unordered part-to-whole values, or so many categories that comparison and labels no longer remain legible

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, BarChart} from '@trwhitney/component-library';

export function MisusedBarChart() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <BarChart
        data={[{month: "Jan", temperature: 18}, {month: "Feb", temperature: 22}]}
        description="Temperature change over consecutive months."
        dataTableLabel="Chart data"
        emptyState={{title: "No values", description: "Choose a populated dataset."}}
        invalidData={{title: "Invalid values", description: "Correct invalid records."}}
        series={[{id: "temperature", label: "Temperature", accessor: "temperature"}]}
        title="Temperature trend"
        xAxis={{label: "Temperature", unit: "°C", scale: {type: "linear"}}}
        yAxis={{accessor: "month", label: "Month", scale: {type: "categorical"}}}
      />
    </AppearanceProvider>
  );
}
```
