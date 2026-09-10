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
- When every row or every column is hidden, an all-hidden state retains the caption, full table and selection. The corner restore list and Show all remain available even when no cells can be displayed.

## Control, events, validation, and forms

- Optional exploration uses ChartRectangularExploration<string, string> with column IDs on x and row IDs on y. Windows include complete ordered tracks. Supply localized navigation, corner and range labels, defaultWindow for internal state, or window with required onWindowChange for controlled state. Live callbacks return one domain rectangle; onWindowChangeEnd reports completed gestures and commands.
- A quiet Overview icon opens the complete visible grid in Dialog. Move or resize its rectangular window directly. Two fingers pan and pinch the main grid without selecting or activating. Closing retains the range and restores focus. The main frame reserves height for source rows and the label/eye header within its existing size limit. Its height stays fixed during navigation and hiding; narrow layouts stagger column labels. Viewport changes preserve the color domain, missing cells, zeros and the complete source table.
- Hidden rows and columns close their gaps in both views. The restore control remains available when a hidden track is outside the window. Selections retain their row and column IDs outside the viewport, while reading and activation target only visible cells.
- Selection follows the shared ChartSelection ownership model: selectedItems plus onSelectionChange is controlled; defaultSelectedItems initializes local state. Items retain row/column identity across reordering and value changes; unknown or removed coordinates are pruned. Localized instructions, count, item descriptions and a Clear selection action accompany selection.
- Pointer and touch readings begin only on an exact cell and report that row, column, and value. Pointer tooltips follow the cursor. Touch readings stay open until another reading or an outside press replaces them. Missing cells remain readable.
- Optional interaction selects cells by stable rowId and columnId. Click/tap toggles selection; Control/Command-click or touch hold activates without changing it. Without selection, ordinary click/tap activates. Rectangle dragging selects boxes it touches, replacing by default, adding with Shift or Control/Command, and removing with Alt. Escape, pointer cancellation, scrolling, data or geometry changes cancel the preview.
- Optional visibilityLabels enables individual row and column eyes. Hiding removes the entire track without leaving a blank row or column. Eyes reveal on label hover or keyboard focus and stay visible on touch. A permanently visible closed eye with the hidden-dimension count beside the row heading opens an overlaid restore list. Individual closed eyes restore dimensions; Show all restores every dimension.
- Visibility belongs to the chart and follows stable row and column IDs across value changes and reordering. Removed IDs are pruned. Removing visibilityLabels restores the full chart. Hidden cells retain selection, use the selection hidden-label formatter, and remain in the complete table. They cannot receive reading, activation, keyboard or drag gestures. Clear selection also clears hidden items. Visibility changes cancel active gestures.
- Automatic color domains fit visible readings after hiding or restoring; explicit domains stay fixed. All original data is validated before visibility filtering, and accessor indices and activation records retain their original source identity.
- interaction.onActivate receives the cell item, labeled row and column, input method, value and original datum. Missing values are undefined; omitted records have undefined datum. An invalid source value remains missing while its original record is available. Zero remains numeric zero. Selection onSelectionChange returns coordinate items and never mutates source data.
- Runtime preparation requires unique nonblank row and column ids, declared record coordinates, and at most one record per cell. Scale colors must be nonblank strings containing browser-supported CSS color values. Sequential scales require one color, and two-sided scales require ordered low and high colors. Zero and negative values are valid. Missing pairs remain missing. Non-finite values are invalid. Fixed domains must be ascending and finite, and a two-sided midpoint must be finite and inside its fixed domain.
- Heatmap is not a form control and does not submit, validate, or reset values. Place dataset and scale controls beside it in consumer-owned composition.

## Accessibility

- The visible title names one figure and the description explains the grid. One title-named keyboard boundary announces the active row, column, and value, including localized missing values. Visual cells are hidden from assistive technology, while enabled visibility controls remain accessible. A generated native table preserves every declared row and column intersection, marking hidden dimensions.

## Keyboard, labeling, localization, and direction

- Tab reaches one title-named grid boundary. Left and Right move across columns; Up and Down move across rows. Home and End reach row endpoints. Control/Command Home and Control/Command End reach the first and last visible cell. Enter/Space selects when selection is enabled; Control/Command plus Enter/Space activates. With selection disabled, Enter/Space activates. Navigation stops at boundaries, and Escape clears the reading.
- When visibility is enabled, Tab also reaches the label eyes and corner restore control. Hiding moves focus to the corner control. Escape or an outside press dismisses the restore list, with focus returning to the corner control when appropriate. Restoring an item moves focus to the next restore eye while hidden items remain. Restoring the final item or using Show all closes the list and focuses the first visible row eye.
- title, description, dataTableLabel, value label, row and column headings, color-key label, localized missing copy, scroll-region label, and state copy are required. Row and column ids stay stable while labels provide readable names.
- Localize all visible and announced copy, domain labels, missing copy, and units. value.formatValue controls locale-specific number formatting. Selection labels provide localized instructions, clearing, empty and count summaries, and cell names.
- HeatmapVisibilityLabels requires hideRow, showRow, hideColumn and showColumn formatters receiving the readable domain label; restore formats the total hidden-dimension count. Provide hiddenRows and hiddenColumns list headings, hidden table copy, showAll and close actions, and allHidden title and description.
- Caption, labels, tooltip, key, and table follow inherited writing direction. Declared row and column order remains the source order.

## Appearance and responsive behavior

- Every numeric cell uses one visible continuous color key. Sequential color represents low-to-high magnitude. Two-sided color meets at the declared midpoint. Missing cells use a neutral dashed crosshatch that cannot be mistaken for zero or a numeric extreme. Dashed inner outlines mark hover and keyboard reading. Solid cell frames mark persistent selection. Selection preserves numeric colors and uses no whole-chart focus border.
- Like other chart figures, Heatmap keeps a bounded default area instead of filling an arbitrarily wide parent. Row labels reserve space for their text, visibility eye and the largest possible restore count before any tracks are hidden. Rows and cells shrink to their compact legible sizes before inline values disappear; only a grid that still cannot fit becomes a separately labeled local scroll region with the transient ScrollRegion scrollbar treatment. Fitted grids do not become scroll containers, and local overflow does not trap scrolling from the surrounding page. Every intersection remains in the generated table.

## Accent, forced colors, and reduced motion

- The Heatmap cell encoding does not read the application accent; optional navigation controls use it. A sequential scale accepts one color. A two-sided scale accepts ordered low and high colors. Callers may pass their application accent when it fits the measure. Missing cells stay neutral and outside both numeric scales.
- Forced colors preserve numeric cells, missing patterns, active boundaries, labels, and the complete table in system colors. The table remains the exact non-color representation.
- Activation uses shared 620ms timing and easing, with feedback removed at 650ms. Repeated activation restarts feedback; reduced motion displays a static cue for the same lifetime.
- Outline pulses use a four-pixel stroke, a five-pixel outset, and three pixels of outward travel per edge at every rendered size. Degenerate lines retain their zero dimension. Selection and value-bearing geometry do not move.
- Visibility changes briefly animate remaining cells and their colors as the grid and automatic range refit. Reduced motion removes visibility, active-cell and scrollbar-fade transitions. Reading, focus, and native scrolling behavior stays the same.

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
        interaction={{selection: {labels: {instructions: "Click or tap to select. Drag to select touched cells. Shift adds; Alt removes.", clear: "Clear selection", empty: "Nothing selected", summary: count => `${count} cells selected`, item: item => `${item.rowId}, ${item.columnId}`, hidden: label => `${label} (hidden)`}}}}
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
        visibilityLabels={{hideRow: label => `Hide room ${label}`, showRow: label => `Show room ${label}`, hideColumn: label => `Hide time ${label}`, showColumn: label => `Show time ${label}`, restore: count => `Restore ${count} hidden dimensions`, hiddenRows: "Hidden rooms", hiddenColumns: "Hidden times", hidden: "Hidden", showAll: "Show all", close: "Close hidden dimensions", allHidden: {title: "No visible cells", description: "Restore a room and time, or show all."}}}
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
