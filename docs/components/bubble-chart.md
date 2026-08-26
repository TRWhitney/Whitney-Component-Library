# BubbleChart

Compare two quantitative coordinates while a third positive measure controls mark area.

## Use for

- each point has a third positive numeric measure whose proportional area materially aids comparison

## Do not use for

- arbitrary ranking, record order, signed values, or another measure whose area would not support honest proportional comparison

## Prefer instead

- Use ScatterChart when area adds no necessary measure, Histogram for one-dimensional frequency, or a generated table when precise comparison of three measurements is the primary task.

## Composition and parts

- Render BubbleChart inside AppearanceProvider in consumer-owned layout. Provide the ScatterChart point contract plus one positive finite magnitude accessor, its label, and an optional unit. Supply visible title, description, axis labels, units, state copy, and a localized dataTableLabel. Multiple bubble groups require a visible legend.
- BubbleChart contains a named figure, visible caption, optional feedback, a group legend when multiple groups exist, interactive SVG plot, quantitative axes, translucent proportional bubbles, shared tooltip, polite announcement, and generated native data table.

## Preferred higher-level compositions

- Compose charts with CollectionFilterBar or separate controls and application-owned layout. Keep cross-chart selection, filtering, zooming, and brushing outside this component.

## Content

- Use stable point ids and labels that identify individual observations. Name both coordinates, the magnitude, and their units directly. Use area only for a positive measure that supports proportional comparison.

## States

- Ready, loading, empty, partial, invalid-data, and error states are explicit. Partial data remains plotted with warning copy. Invalid records are omitted and reported; an entirely invalid dataset becomes unavailable.

## Control, events, validation, and forms

- Pointer and touch input read only a directly targeted mark. Blank plot space clears pointer reading instead of guessing the nearest value. Direct reading dims every other mark.
- Legend hover and focus temporarily emphasize one bubble group. Click, Enter, or Space pins it. A pinned group receives paint and hit-test priority where bubbles overlap. Repeat the action or press Escape to clear the pin.
- BubbleChart emits no consumer events and does not filter records, change domains, or own selection and coordinated chart state.
- BubbleChart manages bubble readings and group emphasis internally. Pointer, keyboard, touch, and legend interaction do not mutate consumer data.
- BubbleChart applies the point-chart validation and requires every valid magnitude to be positive and finite. Radius uses a square-root mapping so rendered area remains proportional to the source magnitude.
- Charts are not form controls and do not submit, validate, or reset values. Place filters and range controls beside the chart in consumer-owned composition.

## Accessibility

- The visible title names one figure and the description explains the chart question. One keyboard boundary owns readings and announcements. The SVG is hidden from assistive technology; a generated native table exposes the valid chart data without interaction.

## Keyboard, labeling, localization, and direction

- Tab reaches one title-named chart boundary. Arrow keys move spatially between recorded bubbles with stable point id as the final tie-breaker. Home and End reach the domain endpoints. Escape clears the reading. A separately labeled local scroll region remains keyboard reachable when minimumSize requires overflow.
- title, description, both axis labels, magnitude label, and dataTableLabel are required. Point labels identify observations. Group labels must stand alone, and the legend label names their collection.
- Localize titles, descriptions, state copy, point and group labels, axis and magnitude labels, units, and legend text. Use axis formatTick and magnitude formatValue for locale-specific numeric formatting.
- Visible prose and categorical labels follow inherited writing direction. Quantitative axes preserve low-to-high mathematical order.

## Appearance and responsive behavior

- Each bubble has a translucent group-color fill and a stronger edge. Shape distinguishes groups, while proportional area expresses magnitude. Direct reading dims every other bubble.
- The production chart frame scales type, strokes, and plot geometry from measured space. Bubble area remains proportional to source magnitude while the maximum rendered radius stays bounded across widths. minimumSize and overflow retain the established local-scroll behavior.

## Accent, forced colors, and reduced motion

- Application accent identifies the first ordinary bubble group. Later groups use the role-aware chart palette, and automatic colors avoid explicit ordinary choices.
- Forced colors preserve axes and bubble boundaries in system colors. Point shapes and the generated table keep groups, coordinates, and source magnitudes distinguishable without color.
- Reduced motion removes bubble-emphasis, legend, and scrollbar transitions. Reading, focus, and native scrolling behavior stays the same.

## Examples

### BubbleChart with explicit statistical meaning

Compare two quantitative coordinates while a third positive measure controls mark area.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, BubbleChart} from '@trwhitney/component-library';

export function BubbleChartExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <BubbleChart
        data={[{id: "north-1", label: "North Monday", temperature: 18, demand: 28, stored: 42}, {id: "north-2", label: "North Tuesday", temperature: 56, demand: 68, stored: 88}]}
        description="Compare temperature, demand, and stored energy."
        dataTableLabel="Statistical data"
        emptyState={{title: "No observations", description: "Choose a populated interval."}}
        invalidData={{title: "Invalid observations", description: "Correct missing or non-finite values."}}
        idAccessor="id"
        labelAccessor="label"
        magnitude={{accessor: "stored", label: "Stored energy", unit: "MWh"}}
        series={[{id: "north", label: "North loop"}]}
        title="Stored energy"
        xAxis={{accessor: "temperature", label: "Temperature", unit: "°F", scale: {type: "linear"}}}
        yAxis={{accessor: "demand", label: "Thermal demand", unit: "MWh", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not misuse BubbleChart

arbitrary ranking, record order, signed values, or another measure whose area would not support honest proportional comparison

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, BubbleChart} from '@trwhitney/component-library';

export function MisusedBubbleChart() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <BubbleChart
        data={[{id: "a", label: "Alpha", x: 18, y: 28, rowNumber: 1}, {id: "b", label: "Beta", x: 56, y: 68, rowNumber: 2}]}
        description="Row number changes mark area."
        dataTableLabel="Statistical data"
        emptyState={{title: "No observations", description: "Choose a populated interval."}}
        invalidData={{title: "Invalid observations", description: "Correct missing or non-finite values."}}
        idAccessor="id"
        labelAccessor="label"
        magnitude={{accessor: "rowNumber", label: "Row number"}}
        series={[{id: "records", label: "Records"}]}
        title="Measurements by row"
        xAxis={{accessor: "x", label: "X", scale: {type: "linear"}}}
        yAxis={{accessor: "y", label: "Y", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```
