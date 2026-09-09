# RadarChart

Compare a few subjects across ordered qualities on one shared radial scale.

## Use for

- comparing a few subjects across three or more ordered qualities that share one meaningful nonnegative scale

## Do not use for

- dimensions with unrelated units, precise value comparison, fewer than three dimensions, negative measures, too many spokes, or enough overlapping series to obscure their shapes

## Prefer instead

- Use BarChart or ColumnChart for precise comparison, LineChart for change over an ordered domain, separate charts for unrelated units, or a native Table when many dimensions or series must remain exact.

## Composition and parts

- Render RadarChart inside AppearanceProvider in consumer-owned layout. A dimension is one measured quality and one spoke. A series is one subject and one polygon. Supply at least three ordered dimensions, one to six series records, stable ids, labels, one shared value meaning, state copy, a legend label, and a table label.
- RadarChart contains a named figure, visible caption, optional feedback, shared polygon guide and spokes, exact source points, one polygon per valid series, visible legend, shared tooltip, polite announcement, and generated native data table.

## Preferred higher-level compositions

- Compose RadarChart with separate filters and application-owned layout. Keep cross-chart selection and filtering outside the component.

## Content

- Keep dimension and series labels short. Use one unit and one shared interpretation for every value. Order dimensions deliberately because their adjacency shapes the polygon. Limit spokes and overlapping series to what remains readable.

## States

- Ready, loading, empty, partial, invalid-data, and error states are explicit. An all-zero valid series remains in the table but draws no polygon or points. Invalid series are omitted and reported; an entirely invalid dataset becomes unavailable.

## Control, events, validation, and forms

- Pointer and touch readings choose the nearest series value on one axis, draw a guide from the center to its exact point, mute the other series, and report only the chosen series with the axis name. Pointer tooltips follow the cursor. Touch readings stay open until another reading or an outside press replaces them.
- Legend hover and focus emphasize one series. Click, Enter, or Space pins it; another legend choice replaces it. A pinned series receives pointer priority where values are close or overlap. Repeat the pinned choice or press Escape to clear it. Emphasis never hides source data.
- RadarChart emits no consumer events and does not filter, select, or mutate records.
- RadarChart manages dimension readings and legend emphasis internally. Pointer, keyboard, touch, and legend interaction do not change consumer data.
- TypeScript requires at least three dimensions and limits data to one through six series. Runtime preparation requires unique usable ids and labels. A missing dimension becomes zero. A negative or non-finite dimension value invalidates the entire series.
- RadarChart is not a form control and does not submit, validate, or reset values. Place dataset controls beside it in consumer-owned composition.

## Accessibility

- The visible title names one figure and the description explains the comparison. One title-named keyboard boundary announces the active dimension and every valid series value. The SVG is hidden from assistive technology, and a generated native table lists dimensions as rows and series as columns.

## Keyboard, labeling, localization, and direction

- Tab reaches one title-named chart boundary. Left and Right move through dimensions in declared order, stop at the ends, and report every valid series at the selected dimension. Escape clears the reading. Legend buttons retain their usual focus, pin, replacement, and Escape behavior.
- title, description, dataTableLabel, value label, dimension heading, legend label, and state copy are required. Dimension and series ids stay stable while their labels provide readable names.
- Localize all visible and announced copy, dimension labels, series labels, and units. value.formatValue controls locale-specific number formatting.
- Caption, legend, tooltip, and table content follow inherited writing direction. Declared dimension order remains fixed around the chart.

## Appearance and responsive behavior

- Every series uses the same nonnegative scale. Exact source values place the points. Direct hover draws a center-to-point guide and mutes the other series. Its neutral reading fill reaches the inside of the point border at each rendered size. When an isolated positive point would collapse a fill into a line, small shoulders shape the neighboring corners. These shoulders are visual-only and never change exact points, readings, or table values.
- Like other chart figures, the default area stays bounded instead of filling an arbitrarily wide parent. Available width and height bound the chart. Compact layouts reduce caption, legend type, swatches, gaps, and padding while increasing SVG label size enough to survive plot scaling. Long plot labels may shorten while the table keeps their complete text. Tall narrow areas stack the legend below the plot. minimumSize and overflow retain the chart family local-scroll choice, and the legend uses the transient ScrollRegion scrollbar behavior without container chrome.

## Accent, forced colors, and reduced motion

- Application accent identifies the first series. Later series use the role-aware chart palette. Line patterns supplement color when polygons overlap.
- Forced colors preserve guides, spokes, point boundaries, and polygon line patterns in system colors. The generated table remains the complete non-color representation.
- Reduced motion removes series-emphasis and scrollbar-fade transitions. Reading, focus, legend, and native scrolling behavior stays the same. Plot geometry does not animate.

## Examples

### RadarChart with complete and missing dimensions

Compare subjects across ordered dimensions on one shared, nonnegative score scale.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, RadarChart} from '@trwhitney/component-library';

export function RadarChartExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <RadarChart
        data={[{id: "courier", label: "Courier", speed: 5, range: 4, reliability: 3}, {id: "scout", label: "Scout", speed: 2, range: 5}]}
        dataTableLabel="Vehicle profile data"
        description="Courier and Scout scores across shared vehicle qualities."
        dimensions={[{id: "speed", label: "Speed", accessor: "speed"}, {id: "range", label: "Range", accessor: "range"}, {id: "reliability", label: "Reliability", accessor: "reliability"}]}
        emptyState={{title: "No scores", description: "Choose vehicles with recorded scores."}}
        idAccessor="id"
        invalidData={{title: "Invalid scores", description: "Correct negative or non-finite scores."}}
        labelAccessor="label"
        labels={{dimension: "Quality"}}
        legend={{label: "Vehicles"}}
        title="Vehicle profiles"
        value={{label: "Score", unit: "points"}}
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not mix unrelated measures in RadarChart

Use separate charts or a table when the dimensions use unrelated units or need precise comparison.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, RadarChart} from '@trwhitney/component-library';

export function MisusedRadarChart() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <RadarChart
        data={[{id: "site-a", label: "Site A", cost: 4200, temperature: 18, satisfaction: 4}]}
        dataTableLabel="Site readings"
        description="Cost, temperature, and satisfaction use unrelated scales."
        dimensions={[{id: "cost", label: "Cost", accessor: "cost"}, {id: "temperature", label: "Temperature", accessor: "temperature"}, {id: "satisfaction", label: "Satisfaction", accessor: "satisfaction"}]}
        emptyState={{title: "No readings", description: "Choose a site with readings."}}
        idAccessor="id"
        invalidData={{title: "Invalid readings", description: "Correct negative or non-finite readings."}}
        labelAccessor="label"
        labels={{dimension: "Measure"}}
        legend={{label: "Sites"}}
        title="Site comparison"
        value={{label: "Mixed reading"}}
      />
    </AppearanceProvider>
  );
}
```
