# Heatmap

Show one numeric measure across the complete intersections of two ordered domains.

## Use for

- showing one shared numeric measure across the intersections of two ordered categorical domains

## Do not use for

- unrelated units, area-proportional comparison, precise scanning of a very large matrix, arbitrary two-sided midpoints, or datasets that need aggregation to answer the question

## Prefer instead

- Use a native Table for exact dense comparison, LineChart for change over a continuous ordered domain, BarChart or ColumnChart for a small set of precise comparisons, or filtered and summarized views when the full matrix is too large.

## Composition and parts

- Render Heatmap inside AppearanceProvider in consumer-owned layout. Supply ordered labeled row and column domains, sparse cell records, coordinate and value accessors, one shared unit and formatter, scale configuration, localized labels, state copy, and a table label.
- Heatmap contains a named figure, visible caption, optional feedback, ordered visual grid, row and column labels, continuous numeric key, missing-value key, shared tooltip, polite announcement, labeled local scroll region when needed, and generated native data table.

## Preferred higher-level compositions

- Compose Heatmap with separate filters and application-owned layout. For comparisons across several heatmaps, give them the same fixed domain and explain that shared range nearby.

## Content

- Keep row and column labels concise and order both domains deliberately. Use one value meaning and unit throughout. Choose colors that match the measure, state what they mean in the description, and use a two-sided scale only when its midpoint has a real interpretation.

## States

- Ready, loading, empty-domain, partial, invalid-data, and error states are explicit. A declared grid with no records remains an all-missing grid. Non-finite records are omitted and reported; an entirely invalid nonempty dataset becomes unavailable.

## Control, events, validation, and forms

- Pointer and touch readings begin only on an exact cell and report that row, column, and value. Pointer tooltips follow the cursor. Touch readings stay open until another reading or an outside press replaces them. Missing cells remain readable.
- Heatmap emits no consumer events and does not select, filter, reorder, or mutate records.
- Heatmap manages cell readings and local scrolling internally. Pointer, keyboard, and touch interaction do not change consumer data.
- Runtime preparation requires unique nonblank row and column ids, declared record coordinates, and at most one record per cell. Scale colors must be nonblank strings containing browser-supported CSS color values. Sequential scales require one color, and two-sided scales require ordered low and high colors. Zero and negative values are valid. Missing pairs remain missing. Non-finite values are invalid. Fixed domains must be ascending and finite, and a two-sided midpoint must be finite and inside its fixed domain.
- Heatmap is not a form control and does not submit, validate, or reset values. Place dataset and scale controls beside it in consumer-owned composition.

## Accessibility

- The visible title names one figure and the description explains the grid. One title-named keyboard boundary announces the active row, column, and value, including localized missing values. The visual grid is hidden from assistive technology, and a generated native table preserves every declared row and column intersection.

## Keyboard, labeling, localization, and direction

- Tab reaches one title-named grid boundary. Left and Right move across columns; Up and Down move across rows. Home and End reach row endpoints. Control Home and Control End reach the first and last cell in the complete grid. Navigation stops at boundaries, and Escape clears the reading.
- title, description, dataTableLabel, value label, row and column headings, color-key label, localized missing copy, scroll-region label, and state copy are required. Row and column ids stay stable while labels provide readable names.
- Localize all visible and announced copy, domain labels, missing copy, and units. value.formatValue controls locale-specific number formatting.
- Caption, labels, tooltip, key, and table follow inherited writing direction. Declared row and column order remains the source order.

## Appearance and responsive behavior

- Every numeric cell uses one visible continuous color key. Sequential color represents low-to-high magnitude. Two-sided color meets at the declared midpoint. Missing cells use a neutral dashed crosshatch that cannot be mistaken for zero or a numeric extreme.
- Like other chart figures, Heatmap keeps a bounded default area instead of filling an arbitrarily wide parent. Row labels use only the width their text needs. Rows and cells shrink to their compact legible sizes before inline values disappear; only a grid that still cannot fit becomes a separately labeled local scroll region with the transient ScrollRegion scrollbar treatment. Fitted grids do not become scroll containers, and local overflow does not trap scrolling from the surrounding page. Every intersection remains in the generated table.

## Accent, forced colors, and reduced motion

- Heatmap does not read the application accent. A sequential scale accepts one color. A two-sided scale accepts ordered low and high colors. Callers may pass their application accent when it fits the measure. Missing cells stay neutral and outside both numeric scales.
- Forced colors preserve numeric cells, missing patterns, active boundaries, labels, and the complete table in system colors. The table remains the exact non-color representation.
- Reduced motion removes active-cell and scrollbar-fade transitions. Reading, focus, and native scrolling behavior stays the same. Grid geometry does not animate.

## Examples

### Sequential Heatmap with zero and missing cells

Show sparse values across a complete declared grid while keeping zero separate from missing.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Heatmap} from '@trwhitney/component-library';

export function HeatmapExample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Heatmap
        columnAccessor="hour"
        columns={[{id: "morning", label: "Morning"}, {id: "evening", label: "Evening"}]}
        data={[{location: "north", hour: "morning", value: 0}, {location: "south", hour: "evening", value: 18}]}
        dataTableLabel="Room temperature data"
        description="Temperature by room and time; patterned cells have no reading."
        emptyState={{title: "No grid", description: "Declare rooms and times to begin."}}
        invalidData={{title: "Invalid readings", description: "Correct non-finite readings."}}
        labels={{row: "Room", column: "Time", colorKey: "Temperature scale", missing: "No reading", scrollRegion: "Temperature grid"}}
        rowAccessor="location"
        rows={[{id: "north", label: "North room"}, {id: "south", label: "South room"}]}
        scale={{color: "#d14f00", type: "sequential"}}
        title="Room temperature"
        value={{accessor: "value", label: "Temperature", unit: "°C"}}
      />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not turn Heatmap into an unreadable matrix

Use a summarized chart, filtered view, or virtualized data table when the complete grid is too large to scan as color.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, Heatmap} from '@trwhitney/component-library';

export function MisusedHeatmap() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <Heatmap
        columnAccessor="date"
        columns={Array.from({length: 200}, (_, index) => ({id: String(index), label: `Day ${index + 1}`}))}
        data={[{date: "0", device: "0", value: 1}]}
        dataTableLabel="All device readings"
        description="Every raw device reading."
        emptyState={{title: "No grid", description: "Declare devices and dates."}}
        invalidData={{title: "Invalid readings", description: "Correct non-finite readings."}}
        labels={{row: "Device", column: "Date", colorKey: "Reading scale", missing: "No reading", scrollRegion: "Device grid"}}
        rowAccessor="device"
        rows={Array.from({length: 1000}, (_, index) => ({id: String(index), label: `Device ${index + 1}`}))}
        scale={{color: "#2878ff", type: "sequential"}}
        title="All device history"
        value={{accessor: "value", label: "Reading"}}
      />
    </AppearanceProvider>
  );
}
```
