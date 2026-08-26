# ScatterChart

Compare two quantitative measurements across distinct recorded observations.

## Use for

- each record is one identifiable observation and its two numeric measurements form the comparison

## Do not use for

- categorical codes, part-to-whole data, an ordered trend that needs connection, or coordinates that do not express a meaningful two-variable relationship

## Prefer instead

- Use LineChart for an ordered trend, BubbleChart when one additional numeric measure belongs in mark area, or Histogram for a one-dimensional distribution.

## Composition and parts

- Render ScatterChart inside AppearanceProvider in consumer-owned layout. Provide one record per point, separate id and label accessors, two quantitative axes, and one to six declared series. Supply visible title, description, axis labels, units, state copy, and a localized dataTableLabel. Multiple point groups require a visible legend.
- ScatterChart contains a named figure, visible caption, optional feedback, a group legend when multiple groups exist, interactive SVG plot, quantitative axes, translucent shaped points, shared tooltip, polite announcement, and generated native data table.

## Preferred higher-level compositions

- Compose charts with CollectionFilterBar or separate controls and application-owned layout. Keep cross-chart selection, filtering, zooming, and brushing outside this component.

## Content

- Use stable point ids and labels that identify individual observations. Name both measurements and their units directly. Use groups only when they support comparison.

## States

- Ready, loading, empty, partial, invalid-data, and error states are explicit. Partial data remains plotted with warning copy. Invalid records are omitted and reported; an entirely invalid dataset becomes unavailable.

## Control, events, validation, and forms

- Pointer and touch input read only a directly targeted mark. Blank plot space clears pointer reading instead of guessing the nearest value. Direct reading dims every other mark.
- Legend hover and focus temporarily emphasize one point group. Click, Enter, or Space pins it. A pinned group receives paint and hit-test priority where points overlap. Repeat the action or press Escape to clear the pin.
- ScatterChart emits no consumer events and does not filter records, change domains, or own selection and coordinated chart state.
- ScatterChart manages point readings and group emphasis internally. Pointer, keyboard, touch, and legend interaction do not mutate consumer data.
- TypeScript requires numeric axis accessors and string id, label, and series accessors. Runtime preparation rejects duplicate point ids, unknown series, invalid domains, missing or non-finite coordinates, and out-of-domain values. Multiple series require seriesAccessor and a legend.
- Charts are not form controls and do not submit, validate, or reset values. Place filters and range controls beside the chart in consumer-owned composition.

## Accessibility

- The visible title names one figure and the description explains the chart question. One keyboard boundary owns readings and announcements. The SVG is hidden from assistive technology; a generated native table exposes the valid chart data without interaction.

## Keyboard, labeling, localization, and direction

- Tab reaches one title-named chart boundary. Arrow keys move spatially between recorded points with stable point id as the final tie-breaker. Home and End reach the domain endpoints. Escape clears the reading. A separately labeled local scroll region remains keyboard reachable when minimumSize requires overflow.
- title, description, both axis labels, and dataTableLabel are required. Point labels identify observations. Group labels must stand alone, and the legend label names their collection.
- Localize titles, descriptions, state copy, point and group labels, axis labels, units, and legend text. Use each axis formatTick for locale-specific numeric formatting.
- Visible prose and categorical labels follow inherited writing direction. Quantitative axes preserve low-to-high mathematical order.

## Appearance and responsive behavior

- Each point has a translucent group-color fill and a stronger edge. Shape distinguishes groups when color is unavailable or points overlap. Direct reading dims every other point.
- The production chart frame scales type, strokes, and plot geometry from measured space. Scatter points keep a bounded readable rendered size as the plot narrows. minimumSize and overflow retain the established local-scroll behavior.

## Accent, forced colors, and reduced motion

- Application accent identifies the first ordinary point group. Later groups use the role-aware chart palette, and automatic colors avoid explicit ordinary choices.
- Forced colors preserve axes and point boundaries in system colors. Point shapes and the generated table keep groups and values distinguishable without color.
- Reduced motion removes point-emphasis, legend, and scrollbar transitions. Reading, focus, and native scrolling behavior stays the same.

## Examples

### ScatterChart with explicit statistical meaning

Compare two quantitative measurements across distinct recorded observations.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, ScatterChart} from '@trwhitney/component-library';

export function ScatterChartExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <ScatterChart
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
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not misuse ScatterChart

categorical codes, part-to-whole data, an ordered trend that needs connection, or coordinates that do not express a meaningful two-variable relationship

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, ScatterChart} from '@trwhitney/component-library';

export function MisusedScatterChart() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <ScatterChart
        data={[{id: "a", label: "Alpha", productCode: 1, defects: 4}, {id: "b", label: "Beta", productCode: 2, defects: 7}]}
        description="Defects for unrelated products."
        dataTableLabel="Statistical data"
        emptyState={{title: "No observations", description: "Choose a populated interval."}}
        invalidData={{title: "Invalid observations", description: "Correct missing or non-finite values."}}
        idAccessor="id"
        labelAccessor="label"
        series={[{id: "products", label: "Products"}]}
        title="Product defects"
        xAxis={{accessor: "productCode", label: "Product code", scale: {type: "linear"}}}
        yAxis={{accessor: "defects", label: "Defects", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```
