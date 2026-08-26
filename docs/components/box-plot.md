# BoxPlot

Compare distribution center, spread, whiskers, and outliers across declared groups.

## Use for

- one or more groups need a compact, method-explicit comparison of their numeric distributions

## Do not use for

- groups with too little data for a useful distribution summary, unknown quartile or whisker methods, or a task that requires reading every observation in the plot

## Prefer instead

- Use Histogram to inspect one distribution in detail, ScatterChart for paired observations, or a table when the individual records matter more than a summary.

## Composition and parts

- Render BoxPlot inside AppearanceProvider in consumer-owned layout. Choose raw observations with Tukey or min-max whiskers, or one explicit summary record per declared group with quartiles, median, whiskers, outliers, and whisker method. Supply visible title, description, axis labels, units, state copy, and a localized dataTableLabel. Multiple distribution groups require a visible legend.
- BoxPlot contains a named figure, visible caption, optional feedback, a group legend when multiple groups exist, interactive SVG plot, categorical and quantitative axes, quartile boxes, medians, split whisker tails, separate outlier marks, shared tooltip, polite announcement, and generated native data table.

## Preferred higher-level compositions

- Compose charts with CollectionFilterBar or separate controls and application-owned layout. Keep cross-chart selection, filtering, zooming, and brushing outside this component.

## Content

- Name each distribution group, numeric measure, unit, quartile method, and whisker method accurately. Use outliers as observations outside the declared whiskers, not as decorative points.

## States

- Ready, loading, empty, partial, invalid-data, and error states are explicit. Partial data remains plotted with warning copy. Invalid records are omitted and reported; an entirely invalid dataset becomes unavailable.

## Control, events, validation, and forms

- Pointer and touch input read only a directly targeted mark. Blank plot space clears pointer reading instead of guessing the nearest value. Direct reading dims every other mark.
- Legend hover and focus temporarily emphasize one distribution group. Click, Enter, or Space pins it. Repeat the action or press Escape to clear the pin.
- BoxPlot emits no consumer events and does not filter records, change domains, or own selection and coordinated chart state.
- BoxPlot manages group-summary and outlier readings plus group emphasis internally. Pointer, keyboard, touch, and legend interaction do not mutate consumer data.
- Raw mode calculates R-7 quartiles and defaults to Tukey 1.5-IQR whiskers; min-max remains explicit. Summary mode requires one ordered finite summary per group and explicit outliers. Runtime preparation rejects unknown or duplicate groups, reversed statistics, invalid values, and values outside an explicit domain.
- Charts are not form controls and do not submit, validate, or reset values. Place filters and range controls beside the chart in consumer-owned composition.

## Accessibility

- The visible title names one figure and the description explains the chart question. One keyboard boundary owns readings and announcements. The SVG is hidden from assistive technology; a generated native table exposes the valid chart data without interaction.

## Keyboard, labeling, localization, and direction

- Tab reaches one title-named chart boundary. Left and Right traverse group summaries in declared order. Direct pointer or touch input can read each outlier separately. Home and End reach the domain endpoints. Escape clears the reading. A separately labeled local scroll region remains keyboard reachable when minimumSize requires overflow.
- title, description, both axis labels, and dataTableLabel are required. Group labels must stand alone, and the legend label names their collection. A group tooltip reports its quartiles, median, and whiskers without the method or outlier list. An outlier tooltip reports only its group and that observation. The generated table retains the complete method and outlier data.
- Localize titles, descriptions, state copy, group labels, axis labels, units, and legend text. Use the quantitative axis formatTick for locale-specific summary and outlier formatting.
- Visible prose and categorical labels follow inherited writing direction. Quantitative axes preserve low-to-high mathematical order.

## Appearance and responsive behavior

- Each quartile box has a translucent group-color fill and stronger boundary. Whisker tails stop at Q1 and Q3, and their caps paint above the box so short whiskers remain visible. Only the median crosses the box. Outliers remain separate marks and direct reading dims every other mark.
- The production chart frame scales type, strokes, boxes, whiskers, and outliers from measured space while preserving their statistical relationships. minimumSize and overflow retain the established local-scroll behavior.

## Accent, forced colors, and reduced motion

- Application accent identifies the first ordinary distribution group. Later groups use the role-aware chart palette, and automatic colors avoid explicit ordinary choices.
- Forced colors preserve quartile, median, whisker, and outlier boundaries in system colors. Geometry and the generated table retain every statistical role without color.
- Reduced motion removes mark-emphasis, legend, and scrollbar transitions. Reading, focus, and native scrolling behavior stays the same.

## Examples

### BoxPlot with explicit statistical meaning

Compare distribution center, spread, whiskers, and outliers across declared groups.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, BoxPlot} from '@trwhitney/component-library';

export function BoxPlotExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <BoxPlot
        data={[{group: "north", value: 43}, {group: "north", value: 48}, {group: "north", value: 52}, {group: "north", value: 54}, {group: "north", value: 57}, {group: "north", value: 104}]}
        description="Compare the center, spread, and outliers of recovery time."
        distribution={{kind: "raw", valueAccessor: "value", whisker: "tukey"}}
        groupAccessor="group"
        groups={[{id: "north", label: "North loop"}]}
        dataTableLabel="Statistical data"
        emptyState={{title: "No observations", description: "Choose a populated interval."}}
        invalidData={{title: "Invalid observations", description: "Correct missing or non-finite values."}}
        title="Recovery-time distribution"
        xAxis={{label: "Turbine loop"}}
        yAxis={{label: "Recovery time", unit: "minutes", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not misuse BoxPlot

groups with too little data for a useful distribution summary, unknown quartile or whisker methods, or a task that requires reading every observation in the plot

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, BoxPlot} from '@trwhitney/component-library';

export function MisusedBoxPlot() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <BoxPlot
        data={[{group: "north", value: 4}, {group: "south", value: 7}]}
        description="Each group contains one observation."
        distribution={{kind: "raw", valueAccessor: "value"}}
        groupAccessor="group"
        groups={[{id: "north", label: "North"}, {id: "south", label: "South"}]}
        legend={{label: "Groups"}}
        dataTableLabel="Statistical data"
        emptyState={{title: "No observations", description: "Choose a populated interval."}}
        invalidData={{title: "Invalid observations", description: "Correct missing or non-finite values."}}
        title="Single observations"
        xAxis={{label: "Group"}}
        yAxis={{label: "Value", scale: {type: "linear"}}}
      />
    </AppearanceProvider>
  );
}
```
